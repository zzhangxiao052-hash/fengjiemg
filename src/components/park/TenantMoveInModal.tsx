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

  // Get pricing policy options (3 active policies + standard)
  const policyOptions = useMemo(() => {
    const activePolicies = pricingPolicies
      .filter(p => p.isActive)
      .map(p => ({
        label: `${p.policyName}`,
        value: p.id,
      }));
    
    return [
      { label: '标准计费 (无优惠)', value: 'standard' },
      ...activePolicies
    ];
  }, [pricingPolicies]);

  return (
    <ModalForm
      title="新增租户 (Tenant Move-in)"
      visible={visible}
      onVisibleChange={onVisibleChange}
      onFinish={onFinish}
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

      <Divider orientation="left">租赁条款</Divider>
      <ProFormDateRangePicker
        name="leaseRange"
        label="起止日期"
        rules={[{ required: true, message: '请选择租赁起止日期' }]}
      />
      <ProFormDigit
        name="decorationDays"
        label="装修免租期 (天)"
        min={0}
        initialValue={0}
        fieldProps={{ precision: 0 }}
      />

      <ProFormUploadDragger
        name="contractFile"
        label="租房合同附件"
        title="点击上传合同"
        max={1}
      />

      <Divider orientation="left">费用计算</Divider>
      <ProFormSelect
        name="policyId"
        label="收费标准"
        initialValue="standard"
        options={policyOptions}
        rules={[{ required: true, message: '请选择收费标准' }]}
      />

      {/* Smart Calculation Display with Real-time Calculator */}
      <ProFormDependency name={['assetId', 'policyId', 'leaseRange', 'decorationDays']}>
        {({ assetId, policyId, leaseRange, decorationDays }) => {
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
          const decoration = decorationDays || 0;
          const actualPolicyId = policyId === 'standard' ? undefined : policyId;

          const calculation = calculate({
            asset: selectedAsset,
            leaseStartDate,
            leaseEndDate,
            decorationDays: decoration,
            policyId: actualPolicyId
          });

          if (!calculation) {
            return (
              <Card style={{ background: '#fff2e8', borderColor: '#ffbb96', marginTop: 16 }}>
                <Text type="warning">无法计算租金，请检查基础费率配置</Text>
              </Card>
            );
          }

          const selectedPolicy = pricingPolicies.find(p => p.id === policyId);
          const policyName = selectedPolicy ? selectedPolicy.policyName : '标准计费 (无优惠)';

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
              render: (_: any, record: any) => 
                record.monthStart === record.monthEnd 
                  ? `第${record.monthStart}月` 
                  : `第${record.monthStart}-${record.monthEnd}月`
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
                    title="装修免租期" 
                    value={decoration} 
                    suffix="天"
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
