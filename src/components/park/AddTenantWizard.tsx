/**
 * Add Tenant Wizard - Intelligent Multi-Step Form
 * Core feature with auto-calculation and pricing preview
 */

import React, { useState } from 'react';
import { 
  StepsForm, 
  ProFormSelect, 
  ProFormText, 
  ProFormDateRangePicker, 
  ProFormDigit,
  ProFormTextArea 
} from '@ant-design/pro-components';
import { Card, Space, Tag, message, Descriptions, Table, Button, Alert, Divider } from 'antd';
import { 
  CalculatorOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAssetStore } from '../../stores/assetStore';
import { useRentCalculator, formatCurrency, formatDate, usePricingSummary } from '../../hooks/useRentCalculator';
import { 
  Asset, 
  AssetStatus, 
  TenantType, 
  LeaseContract,
  LeaseStatus,
  Tenant,
  RentCalculation,
  AddTenantFormData 
} from '../../types/asset';

const AddTenantWizard: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  // State
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<Partial<AddTenantFormData>>({});
  const [calculation, setCalculation] = useState<RentCalculation | null>(null);

  // Store
  const { 
    getVacantAssets, 
    getAssetById,
    pricingPolicies,
    addLeaseContract,
    addTenant,
    updateAsset
  } = useAssetStore();

  const vacantAssets = getVacantAssets();
  const { calculate } = useRentCalculator();

  // Handle asset selection
  const handleAssetChange = (assetId: string) => {
    const asset = getAssetById(assetId);
    setSelectedAsset(asset || null);
    setFormData(prev => ({ ...prev, assetId }));
  };

  // Auto-calculate pricing
  const handleCalculate = () => {
    if (!selectedAsset || !formData.leaseStartDate || !formData.leaseEndDate) {
      message.warning('请先完成资产和租期信息填写');
      return;
    }

    const result = calculate({
      asset: selectedAsset,
      leaseStartDate: formData.leaseStartDate,
      leaseEndDate: formData.leaseEndDate,
      decorationDays: formData.decorationDays || 0,
      policyId: formData.policyId
    });

    if (result) {
      setCalculation(result);
      message.success('计算成功');
    } else {
      message.error('计算失败,请检查基础费率配置');
    }
  };

  // Handle final submission
  const handleFinish = async (values: any) => {
    try {
      if (!selectedAsset || !calculation) {
        message.error('缺少必要信息');
        return false;
      }

      // Create tenant
      const newTenant: Tenant = {
        id: `tenant-${Date.now()}`,
        tenantName: formData.tenantName!,
        type: formData.tenantType!,
        industry: formData.industry,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      addTenant(newTenant);

      // Create lease contract
      const newContract: LeaseContract = {
        id: `contract-${Date.now()}`,
        contractNumber: `CT-${Date.now()}`,
        assetId: selectedAsset.id,
        tenantId: newTenant.id,
        leaseStartDate: formData.leaseStartDate!,
        leaseEndDate: formData.leaseEndDate!,
        decorationDays: formData.decorationDays || 0,
        billingStartDate: calculation.billingStartDate,
        policyId: formData.policyId,
        baseRentPrice: calculation.baseRentPrice,
        baseMgmtPrice: calculation.baseMgmtPrice,
        totalRent: calculation.totalRent,
        totalMgmt: calculation.totalMgmt,
        grandTotal: calculation.grandTotal,
        paymentSchedule: calculation.paymentSchedule,
        status: LeaseStatus.ACTIVE,
        notes: formData.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      addLeaseContract(newContract);

      // Update asset status
      updateAsset(selectedAsset.id, {
        status: AssetStatus.LEASED,
        tenantId: newTenant.id,
        tenantName: newTenant.tenantName
      });

      message.success('租户添加成功!');
      onSuccess?.();
      return true;
    } catch (error) {
      message.error('操作失败');
      return false;
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <StepsForm
          onFinish={handleFinish}
          formProps={{
            validateMessages: {
              required: '此项为必填项'
            }
          }}
          stepsFormRender={(dom, submitter) => {
            return (
              <Card>
                {dom}
                <Space style={{ marginTop: 24, width: '100%', justifyContent: 'flex-end' }}>
                  {submitter}
                </Space>
              </Card>
            );
          }}
        >
          {/* Step 1: Select Asset */}
          <StepsForm.StepForm
            name="asset"
            title="选择资产"
            onFinish={async (values) => {
              setFormData(prev => ({ ...prev, ...values }));
              handleAssetChange(values.assetId);
              return true;
            }}
          >
            <Alert
              message="从空置资产中选择"
              description="选择资产后,系统会自动读取面积和楼层信息用于租金计算"
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <ProFormSelect
              name="assetId"
              label="选择资产"
              placeholder="请选择空置资产"
              rules={[{ required: true }]}
              fieldProps={{
                showSearch: true,
                onChange: handleAssetChange
              }}
              options={vacantAssets.map(asset => ({
                label: `${asset.zone} - ${asset.addressCode} (${asset.area}㎡, ${asset.floorLevel}F)`,
                value: asset.id
              }))}
            />

            {selectedAsset && (
              <Card size="small" title="资产详情" style={{ marginTop: 16 }}>
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="区域">{selectedAsset.zone}</Descriptions.Item>
                  <Descriptions.Item label="地址">{selectedAsset.addressCode}</Descriptions.Item>
                  <Descriptions.Item label="楼层">{selectedAsset.floorLevel}F</Descriptions.Item>
                  <Descriptions.Item label="面积">{selectedAsset.area}㎡</Descriptions.Item>
                  <Descriptions.Item label="状态">
                    <Tag color="success">空置</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </StepsForm.StepForm>

          {/* Step 2: Tenant Information */}
          <StepsForm.StepForm
            name="tenant"
            title="租户信息"
            onFinish={async (values) => {
              setFormData(prev => ({ ...prev, ...values }));
              return true;
            }}
          >
            <ProFormSelect
              name="tenantType"
              label="租户类型"
              rules={[{ required: true }]}
              options={[
                { label: '企业租户', value: TenantType.ENTERPRISE },
                { label: '个人租户', value: TenantType.PERSONAL }
              ]}
            />

            <ProFormText
              name="tenantName"
              label="租户名称"
              placeholder="企业名称或个人姓名"
              rules={[{ required: true }]}
            />

            <ProFormSelect
              name="industry"
              label="所属行业"
              placeholder="请选择所属行业"
              rules={[{ required: true, message: '请选择所属行业' }]}
              fieldProps={{
                onChange: (value) => {
                  setFormData(prev => ({ ...prev, industry: value as string }));
                  // Reset policy selection when industry changes
                  setFormData(prev => ({ ...prev, policyId: undefined }));
                  setCalculation(null);
                }
              }}
              options={[
                { label: '眼镜产业 (Eyewear)', value: 'Eyewear' },
                { label: '高新技术', value: '高新技术' },
                { label: '先进制造', value: '先进制造' },
                { label: '电子信息', value: '电子信息' },
                { label: '生物医药', value: '生物医药' },
                { label: '新能源', value: '新能源' },
                { label: '新材料', value: '新材料' },
                { label: '现代服务业', value: '现代服务业' },
                { label: '其他', value: '其他' }
              ]}
            />

            <ProFormText
              name="contactPerson"
              label="联系人"
              placeholder="联系人姓名"
            />

            <ProFormText
              name="contactPhone"
              label="联系电话"
              placeholder="手机号码"
              rules={[
                { 
                  pattern: /^1[3-9]\d{9}$/, 
                  message: '请输入有效的手机号码' 
                }
              ]}
            />

            <ProFormText
              name="contactEmail"
              label="联系邮箱"
              placeholder="email@example.com"
              rules={[
                { 
                  type: 'email', 
                  message: '请输入有效的邮箱地址' 
                }
              ]}
            />
          </StepsForm.StepForm>

          {/* Step 3: Lease Details */}
          <StepsForm.StepForm
            name="lease"
            title="租赁详情"
            onFinish={async (values) => {
              const [startDate, endDate] = values.dateRange;
              setFormData(prev => ({ 
                ...prev, 
                leaseStartDate: startDate.toDate(),
                leaseEndDate: endDate.toDate(),
                decorationDays: values.decorationDays
              }));
              return true;
            }}
          >
            <ProFormDateRangePicker
              name="dateRange"
              label="租赁期限"
              rules={[{ required: true }]}
              fieldProps={{
                format: 'YYYY-MM-DD'
              }}
            />

            <ProFormDigit
              name="decorationDays"
              label="装修期 (天)"
              placeholder="90"
              min={0}
              initialValue={0}
              fieldProps={{ precision: 0 }}
              extra="装修期间免租,从装修期结束后开始计费"
            />

            {formData.leaseStartDate && formData.decorationDays !== undefined && (
              <Alert
                message="计费开始日期"
                description={`${formatDate(
                  new Date(formData.leaseStartDate.getTime() + formData.decorationDays * 24 * 60 * 60 * 1000)
                )}`}
                type="success"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </StepsForm.StepForm>

          {/* Step 4: Pricing & Calculation */}
          <StepsForm.StepForm
            name="pricing"
            title="定价计算"
          >
            <Alert
              message="定价说明"
              description={`选择定价政策后,点击计算按钮查看详细费用明细。未选择政策则使用标准费率。${
                formData.industry 
                  ? `\n当前行业【${formData.industry}】,政策列表已自动筛选适用政策。` 
                  : '\n提示:政策会根据租户行业自动筛选,请先填写行业信息。'
              }`}
              type="info"
              showIcon
              style={{ marginBottom: 24, whiteSpace: 'pre-line' }}
            />

            <ProFormSelect
              name="policyId"
              label="定价政策"
              placeholder="选择定价政策 (可选)"
              fieldProps={{
                onChange: (value) => {
                  setFormData(prev => ({ ...prev, policyId: value as string }));
                  setCalculation(null); // Reset calculation when policy changes
                }
              }}
              options={pricingPolicies
                .filter(p => p.isActive)
                .filter(policy => {
                  // If no industry selected yet, show all policies
                  if (!formData.industry) return true;
                  
                  // Check policy applicability based on industry
                  if (policy.targetIndustry === 'All') return true;
                  if (policy.targetIndustry === 'Eyewear' && formData.industry === 'Eyewear') return true;
                  if (policy.targetIndustry === 'Non-Eyewear' && formData.industry !== 'Eyewear') return true;
                  
                  return false;
                })
                .map(policy => ({
                  label: `${policy.policyName}${policy.targetIndustry ? ` - ${policy.targetIndustry}` : ''}`,
                  value: policy.id
                }))}
            />

            <Space style={{ marginBottom: 24 }}>
              <Button
                type="primary"
                icon={<CalculatorOutlined />}
                onClick={handleCalculate}
              >
                自动计算
              </Button>
            </Space>

            {calculation && <PaymentSchedulePreview calculation={calculation} />}

            <ProFormTextArea
              name="notes"
              label="备注"
              placeholder="其他说明事项"
              fieldProps={{ rows: 3 }}
            />
          </StepsForm.StepForm>
        </StepsForm>
      </Card>
    </div>
  );
};

// ==================== Payment Schedule Preview Component ====================

const PaymentSchedulePreview: React.FC<{ calculation: RentCalculation }> = ({ calculation }) => {
  const summary = usePricingSummary(calculation);

  // Helper function to calculate date from month offset
  const getDateFromMonthOffset = (baseDate: Date, monthOffset: number): string => {
    const date = dayjs(baseDate).add(monthOffset - 1, 'month');
    return date.format('YYYY.MM.DD');
  };

  const columns = [
    {
      title: '阶段',
      dataIndex: 'stage',
      key: 'stage',
      render: (_: any, record: any) => {
        const startDate = getDateFromMonthOffset(calculation.billingStartDate, record.monthStart);
        const endDate = getDateFromMonthOffset(calculation.billingStartDate, record.monthEnd);
        return record.monthStart === record.monthEnd 
          ? startDate
          : `${startDate}-${endDate}`;
      }
    },
    {
      title: '租金/月',
      dataIndex: 'rentAmount',
      key: 'rentAmount',
      render: (value: number) => formatCurrency(value)
    },
    {
      title: '管理费/月',
      dataIndex: 'mgmtAmount',
      key: 'mgmtAmount',
      render: (value: number) => formatCurrency(value)
    },
    {
      title: '合计/月',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value: number) => <strong>{formatCurrency(value)}</strong>
    },
    {
      title: '优惠说明',
      dataIndex: 'discount',
      key: 'discount',
      render: (value: string) => <Tag color="blue">{value}</Tag>
    }
  ];

  return (
    <Card 
      size="small" 
      title={
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
          <span>付款计划预览</span>
        </Space>
      }
      style={{ marginBottom: 24, border: '2px solid #52c41a' }}
    >
      <Descriptions column={2} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="基础租金">{formatCurrency(calculation.baseRentPrice)}/㎡/月</Descriptions.Item>
        <Descriptions.Item label="基础管理费">{formatCurrency(calculation.baseMgmtPrice)}/㎡/月</Descriptions.Item>
        <Descriptions.Item label="资产面积">{calculation.asset.area}㎡</Descriptions.Item>
        <Descriptions.Item label="计费月数">{calculation.totalMonths}个月</Descriptions.Item>
        <Descriptions.Item label="计费开始">{formatDate(calculation.billingStartDate)}</Descriptions.Item>
        <Descriptions.Item label="月均支付">{formatCurrency(calculation.averageMonthlyPayment)}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Table
        dataSource={calculation.paymentSchedule}
        columns={columns}
        pagination={false}
        size="small"
        rowKey={(record) => `${record.monthStart}-${record.monthEnd}`}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row style={{ backgroundColor: '#f0f0f0' }}>
              <Table.Summary.Cell index={0}><strong>合计</strong></Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>{formatCurrency(calculation.totalRent)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <strong>{formatCurrency(calculation.totalMgmt)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <strong style={{ color: '#1890ff', fontSize: '16px' }}>
                  {formatCurrency(calculation.grandTotal)}
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>总计</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
};

export default AddTenantWizard;
