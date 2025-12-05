import React, { useMemo } from 'react';
import { ModalForm, ProFormSelect, ProFormText, ProFormDateRangePicker, ProFormDigit, ProFormDependency, ProFormUploadDragger } from '@ant-design/pro-components';
import { Form, Card, Typography, Row, Col, Statistic, Divider, Table, Space } from 'antd';
import { useAssetStore } from '../../stores/assetStore';
import { Asset, AssetStatus, AssetType } from '../../types/asset';
import { useRentCalculator } from '../../hooks/useRentCalculator';
import dayjs from 'dayjs';

interface TenantMoveInModalProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onFinish: (values: any) => Promise<boolean | void>;
  assetType: AssetType;
}

const { Text } = Typography;

export const TenantMoveInModal: React.FC<TenantMoveInModalProps> = ({
  visible,
  onVisibleChange,
  onFinish,
  assetType,
}) => {
  const { assets, pricingPolicies } = useAssetStore();
  const { calculate } = useRentCalculator();

  // Filter vacant assets of the specific type
  const vacantAssets = useMemo(() => {
    return assets.filter(
      (a) => a.type === assetType && a.status === AssetStatus.VACANT
    );
  }, [assets, assetType]);

  // Get pricing policy options based on asset type
  const policyOptions = useMemo(() => {
    // For retail shops, only show the retail increment policy
    if (assetType === AssetType.RETAIL) {
      const retailPolicy = pricingPolicies.find(p => p.id === 'policy-4');
      return retailPolicy ? [{ label: retailPolicy.policyName, value: retailPolicy.id }] : [];
    }
    
    // For dormitory, no policies shown (will be hidden)
    if (assetType === AssetType.DORM) {
      return [];
    }
    
    // For factories, show all active policies
    const activePolicies = pricingPolicies
      .filter(p => p.isActive && p.id !== 'policy-4') // Exclude retail policy
      .map(p => ({
        label: `${p.policyName}`,
        value: p.id,
      }));
    
    return [
      { label: '标准计费 (无优惠)', value: 'standard' },
      ...activePolicies
    ];
  }, [pricingPolicies, assetType]);

  // Enhanced onFinish to include calculated rent data
  const handleFinish = async (values: any) => {
    const selectedAsset = vacantAssets.find((a) => a.id === values.assetId);
    
    if (selectedAsset && values.leaseRange) {
      const leaseStartDate = dayjs(values.leaseRange[0]).toDate();
      const leaseEndDate = dayjs(values.leaseRange[1]).toDate();
      const decorationDays = values.decorationDays || 0;
      // policyId may be a string or an array when switched to multi-select.
      let actualPolicyId: string | undefined = undefined;
      if (Array.isArray(values.policyId)) {
        // prefer the first selected policy that is not 'standard'
        const nonStandard = values.policyId.find((p: string) => p !== 'standard');
        actualPolicyId = nonStandard || (values.policyId.length > 0 && values.policyId[0] !== 'standard' ? values.policyId[0] : undefined);
      } else {
        actualPolicyId = values.policyId === 'standard' ? undefined : values.policyId;
      }

      // Calculate rent
      const calculation = calculate({
        asset: selectedAsset,
        leaseStartDate,
        leaseEndDate,
        decorationDays,
          policyId: actualPolicyId
      });

      if (calculation) {
        // Add calculated values to form data
        const enhancedValues = {
          ...values,
          receivableRent: calculation.totalRent,
          receivableProperty: calculation.totalMgmt,
          // Initialize other financial fields
          receivedRent: 0,
          receivedProperty: 0,
          receivedDeposit: 0,
          policyReductionRent: 0,
          policyReductionProperty: 0,
          policyReductionDeposit: 0,
          receivableDeposit: 0 // Will be filled manually in fee edit
        };
        
        return await onFinish(enhancedValues);
      }
    }
    
    return await onFinish(values);
  };

  return (
    <ModalForm
      title="新增租户 (Tenant Move-in)"
      visible={visible}
      onVisibleChange={onVisibleChange}
      onFinish={handleFinish}
      width={800}
      layout="horizontal"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <Divider orientation="left">房源选择</Divider>
      <ProFormSelect
        name="assetId"
        label="选择房源"
        options={vacantAssets.map((a) => {
          // For dormitory type, show only addressCode without area and zone suffix
          if (assetType === AssetType.DORM) {
            return {
              label: a.addressCode,
              value: a.id,
            };
          }
          // For other types, keep the original format
          return {
            label: `${a.addressCode} (${a.area}㎡) - ${a.zone}`,
            value: a.id,
          };
        })}
        placeholder="请选择空闲房源"
        rules={[{ required: true, message: '请选择房源' }]}
      />

      {/* Display Asset Details automatically */}
      <ProFormDependency name={['assetId']}>
        {({ assetId }) => {
          const selectedAsset = vacantAssets.find((a) => a.id === assetId);
          if (!selectedAsset) return null;
          return (
            <Row gutter={16} style={{ marginBottom: 24, paddingLeft: '25%' }}>
              <Col span={8}>
                <Statistic title="面积" value={selectedAsset.area} suffix="㎡" valueStyle={{ fontSize: 16 }} />
              </Col>
              <Col span={8}>
                <Statistic 
                  title={assetType === AssetType.DORM ? "类型" : "楼层"} 
                  value={assetType === AssetType.DORM ? "标准间" : `${selectedAsset.floorLevel}层`} 
                  valueStyle={{ fontSize: 16 }} 
                />
              </Col>
              <Col span={8}>
                <Statistic title="区域" value={selectedAsset.zone} valueStyle={{ fontSize: 16 }} />
              </Col>
            </Row>
          );
        }}
      </ProFormDependency>

      <Divider orientation="left">租户信息</Divider>
      <ProFormText
        name="tenantName"
        label="企业/个人名称"
        placeholder="请输入租户名称"
        rules={[{ required: true, message: '请输入租户名称' }]}
      />
      {/* 所在企业：宿舍类型改为文本输入（用户自行填写）；其它资产类型仍保留所属行业下拉 */}
      {assetType === AssetType.DORM ? (
        <ProFormText
          name="enterpriseName"
          label="所在企业"
          placeholder="请输入所在企业名称"
          rules={[{ required: true, message: '请输入所在企业名称' }]}
        />
      ) : (
        <ProFormSelect
          name="industry"
          label="所属行业"
          options={[
            { label: '眼镜产业', value: 'glasses_industry' },
            { label: '新签企业', value: 'new_enterprise' },
            { label: '传统制造业', value: 'traditional_mfg' },
            { label: '配套服务业', value: 'supporting_services' },
          ]}
          placeholder="请选择行业"
          rules={[{ required: true, message: '请选择行业' }]}
        />
      )}

      <Divider orientation="left">租赁条款</Divider>
      <ProFormDateRangePicker
        name="leaseRange"
        label="起止日期"
        rules={[{ required: true, message: '请选择租赁起止日期' }]}
      />

      <ProFormUploadDragger
        name="contractFile"
        label="租房合同附件"
        title="点击上传合同"
        max={1}
      />

      <Divider orientation="left">费用计算</Divider>
      
      {/* For Retail: Show fixed policy as static text with hidden input */}
      {assetType === AssetType.RETAIL && (
        <>
          <Form.Item label="使用政策">
            <Text strong style={{ color: '#1890ff' }}>门市年度递增策略</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              第二年在第一年的租金基础上增加3%，以此递增没有上限
            </Text>
          </Form.Item>
          <ProFormText
            name="policyId"
            hidden
            initialValue="policy-4"
          />
        </>
      )}
      
      {/* For Dormitory: Hide policy selection, use standard rate */}
      {assetType === AssetType.DORM && (
        <ProFormText
          name="policyId"
          hidden
          initialValue="standard"
        />
      )}
      
      {/* For Factory: Show full policy dropdown */}
      {assetType === AssetType.FACTORY && (
        <ProFormSelect
          name="policyId"
          label="收费标准"
          // Use array initial value for multi-select
          initialValue={["standard"]}
          options={policyOptions}
          rules={[{ required: true, message: '请选择收费标准' }]}
          fieldProps={{ mode: 'multiple', placeholder: '请选择收费标准（可多选）' }}
        />
      )}

      {/* Smart Calculation Display with Real-time Calculator */}
      <ProFormDependency name={['assetId', 'policyId', 'leaseRange']}>
        {({ assetId, policyId, leaseRange }) => {
          const selectedAsset = vacantAssets.find((a) => a.id === assetId);
          
          if (!selectedAsset) {
            return (
              <Card style={{ background: '#f5f5f5', marginTop: 16 }}>
                <Text type="secondary">请先选择房源以计算费用</Text>
              </Card>
            );
          }

          if (!leaseRange || !leaseRange[0] || !leaseRange[1]) {
            return (
              <Card style={{ background: '#f5f5f5', marginTop: 16 }}>
                <Text type="secondary">请选择租赁起止日期以计算费用</Text>
              </Card>
            );
          }

          // Calculate rent using the hook
          const leaseStartDate = dayjs(leaseRange[0]).toDate();
          const leaseEndDate = dayjs(leaseRange[1]).toDate();
          // policyId from form may be string or string[] (multi-select). Pick a policy id for calculation.
          let effectivePolicyId: string | undefined = undefined;
          if (Array.isArray(policyId)) {
            const nonStandard = policyId.find((p: string) => p !== 'standard');
            effectivePolicyId = nonStandard || (policyId.length > 0 && policyId[0] !== 'standard' ? policyId[0] : undefined);
          } else {
            effectivePolicyId = policyId === 'standard' ? undefined : policyId;
          }

          const calculation = calculate({
            asset: selectedAsset,
            leaseStartDate,
            leaseEndDate,
            decorationDays: 0,
            policyId: effectivePolicyId
          });

          if (!calculation) {
            return (
              <Card style={{ background: '#fff2e8', borderColor: '#ffbb96', marginTop: 16 }}>
                <Text type="warning">无法计算租金，请检查基础费率配置</Text>
              </Card>
            );
          }

          // Render selected policy names (support array)
          let policyName = '标准计费 (无优惠)';
          if (Array.isArray(policyId)) {
            const names = policyId.map((id: string) => {
              if (id === 'standard') return '标准计费 (无优惠)';
              const p = pricingPolicies.find(pp => pp.id === id);
              return p ? p.policyName : id;
            });
            policyName = names.join(', ');
          } else {
            const selectedPolicy = pricingPolicies.find(p => p.id === policyId);
            policyName = selectedPolicy ? selectedPolicy.policyName : '标准计费 (无优惠)';
          }

          // Helper function to calculate date from month offset
          const getDateFromMonthOffset = (baseDate: Date, monthOffset: number): string => {
            const date = dayjs(baseDate).add(monthOffset - 1, 'month');
            return date.format('YYYY.MM.DD');
          };

          // Payment schedule table columns
          const scheduleColumns = [
            {
              title: '阶段',
              dataIndex: 'stage',
              key: 'stage',
              render: (_: any, __: any, index: number) => `阶段${index + 1}`
            },
            {
              title: '月份范围',
              dataIndex: 'months',
              key: 'months',
              render: (_: any, record: any) => {
                const startDate = getDateFromMonthOffset(leaseStartDate, record.monthStart);
                const endDate = getDateFromMonthOffset(leaseStartDate, record.monthEnd);
                return record.monthStart === record.monthEnd 
                  ? startDate
                  : `${startDate}-${endDate}`;
              }
            },
            {
              title: '月租金',
              dataIndex: 'rentAmount',
              key: 'rentAmount',
              render: (value: number) => `¥${value.toFixed(2)}`
            },
            {
              title: '月物管费',
              dataIndex: 'mgmtAmount',
              key: 'mgmtAmount',
              render: (value: number) => `¥${value.toFixed(2)}`
            },
            {
              title: '月合计',
              dataIndex: 'totalAmount',
              key: 'totalAmount',
              render: (value: number) => <Text strong>¥{value.toFixed(2)}</Text>
            },
            {
              title: '优惠说明',
              dataIndex: 'discount',
              key: 'discount'
            }
          ];

          return (
            <Card 
              style={{ background: '#f0f5ff', borderColor: '#adc6ff', marginTop: 16 }} 
              size="small"
              title={
                <Space>
                  <Text strong>租金计算明细</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    (基础单价: ¥{calculation.baseRentPrice.toFixed(2)}/㎡/月 + 物管费: ¥{calculation.baseMgmtPrice.toFixed(2)}/㎡/月)
                  </Text>
                </Space>
              }
            >
              {/* Summary Statistics */}
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                  <Statistic 
                    title="租赁总月数" 
                    value={calculation.totalMonths} 
                    suffix="月"
                  />
                </Col>
                
                <Col span={6}>
                  <Statistic 
                    title="总租金" 
                    value={calculation.totalRent} 
                    precision={2} 
                    prefix="¥"
                    valueStyle={{ color: '#cf1322' }}
                  />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="总物管费" 
                    value={calculation.totalMgmt} 
                    precision={2} 
                    prefix="¥"
                    valueStyle={{ color: '#096dd9' }}
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={12}>
                  <Statistic 
                    title="合同总额" 
                    value={calculation.grandTotal} 
                    precision={2} 
                    prefix="¥"
                    valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="平均月付" 
                    value={calculation.averageMonthlyPayment} 
                    precision={2} 
                    prefix="¥"
                  />
                </Col>
              </Row>

              <Divider style={{ margin: '12px 0' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>适用政策: {policyName}</Text>
              </Divider>

              {/* Payment Schedule Table */}
              <Table
                columns={scheduleColumns}
                dataSource={calculation.paymentSchedule}
                pagination={false}
                size="small"
                rowKey={(record, index) => `stage-${index}`}
              />
            </Card>
          );
        }}
      </ProFormDependency>
    </ModalForm>
  );
};
