/**
 * Charging Standards Configurator Page
 * Base rates and policy engine for pricing configuration
 */

import React, { useState, useRef } from 'react';
import { Tabs, Card, Button, message, Modal, Space, InputNumber, Form } from 'antd';
import { ProTable, ProColumns, ActionType, ModalForm, ProFormText, ProFormSelect, ProFormDigit, ProFormTextArea } from '@ant-design/pro-components';
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useAssetStore } from '../../stores/assetStore';
import { BaseRate, PricingPolicy, DiscountStage, PricingCategory } from '../../types/asset';

const { TabPane } = Tabs;

const ChargingStandardsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');
  
  return (
    <div>
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="基础费率" key="1">
            <BaseRatesTab />
          </TabPane>
          <TabPane tab="政策引擎" key="2">
            <PolicyEngineTab />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

// ==================== Base Rates Tab ====================

const BaseRatesTab: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRate, setCurrentRate] = useState<BaseRate | null>(null);
  
  const { 
    baseRates, 
    addBaseRate, 
    updateBaseRate, 
    deleteBaseRate 
  } = useAssetStore();

  const columns: ProColumns<BaseRate>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48
    },
    {
      title: '资产分类',
      dataIndex: 'categoryLabel',
      width: 150
    },
    {
      title: '计费单位',
      dataIndex: 'unit',
      width: 120
    },
    {
      title: '基础租金 (元)',
      dataIndex: 'baseRentPrice',
      valueType: 'money',
      width: 150,
      render: (_, record) => `¥${record.baseRentPrice.toFixed(2)}`
    },
    {
      title: '基础物管费 (元)',
      dataIndex: 'baseMgmtPrice',
      valueType: 'money',
      width: 150,
      render: (_, record) => `¥${record.baseMgmtPrice.toFixed(2)}`
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      width: 180
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRate(record);
            setEditModalVisible(true);
          }}
        >
          <EditOutlined /> 编辑
        </a>,
        <a
          key="delete"
          onClick={() => handleDelete(record)}
          style={{ color: '#ff4d4f' }}
        >
          <DeleteOutlined /> 删除
        </a>
      ]
    }
  ];

  const handleDelete = (rate: BaseRate) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除费率 "${rate.categoryLabel}" 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteBaseRate(rate.id);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (currentRate) {
        updateBaseRate(currentRate.id, values);
        message.success('更新成功');
      } else {
        const newRate: BaseRate = {
          id: `rate-${Date.now()}`,
          ...values,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        addBaseRate(newRate);
        message.success('创建成功');
      }
      setEditModalVisible(false);
      setCurrentRate(null);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('操作失败');
      return false;
    }
  };

  return (
    <>
      <ProTable<BaseRate>
        columns={columns}
        actionRef={actionRef}
        dataSource={baseRates}
        rowKey="id"
        search={false}
        pagination={false}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentRate(null);
              setEditModalVisible(true);
            }}
          >
            新建费率
          </Button>
        ]}
      />

      <ModalForm
        title={currentRate ? '编辑费率' : '新建费率'}
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        onFinish={handleSubmit}
        initialValues={currentRate || {
          category: PricingCategory.FACTORY_1F,
          unit: '元/㎡/月'
        }}
        width={600}
        modalProps={{
          destroyOnClose: true
        }}
      >
        <ProFormSelect
          name="category"
          label="资产分类"
          rules={[{ required: true, message: '请选择资产分类' }]}
          options={[
            { label: '标准厂房一层', value: PricingCategory.FACTORY_1F },
            { label: '标准厂房二层', value: PricingCategory.FACTORY_2F },
            { label: '标准厂房三层及以上', value: PricingCategory.FACTORY_3F },
            { label: '职工宿舍', value: PricingCategory.DORM },
            { label: '配套门市', value: PricingCategory.RETAIL }
          ]}
        />
        
        <ProFormText
          name="categoryLabel"
          label="显示名称"
          placeholder="例: 标准厂房一层"
          rules={[{ required: true, message: '请输入显示名称' }]}
        />
        
        <ProFormText
          name="unit"
          label="计费单位"
          placeholder="例: 元/㎡/月 或 元/间/月"
          rules={[{ required: true, message: '请输入计费单位' }]}
        />
        
        <ProFormDigit
          name="baseRentPrice"
          label="基础租金 (元)"
          min={0}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入基础租金' }]}
          extra="每单位的租金价格"
        />
        
        <ProFormDigit
          name="baseMgmtPrice"
          label="基础物管费 (元)"
          min={0}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入基础物管费' }]}
          extra="每单位的物管费价格"
        />
      </ModalForm>
    </>
  );
};

// ==================== Policy Engine Tab ====================

const PolicyEngineTab: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentPolicy, setCurrentPolicy] = useState<PricingPolicy | null>(null);
  
  const { 
    pricingPolicies, 
    addPricingPolicy, 
    updatePricingPolicy, 
    deletePricingPolicy 
  } = useAssetStore();

  const columns: ProColumns<PricingPolicy>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48
    },
    {
      title: '政策名称',
      dataIndex: 'policyName',
      width: 200
    },
    {
      title: '目标行业',
      dataIndex: 'targetIndustry',
      width: 150,
      render: (_, record) => record.targetIndustry || <span style={{ color: '#999' }}>全行业</span>
    },
    {
      title: '阶段数',
      dataIndex: 'stages',
      width: 100,
      render: (_, record) => record.stages.length
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      width: 100,
      valueType: 'select',
      valueEnum: {
        true: { text: '启用', status: 'Success' },
        false: { text: '禁用', status: 'Default' }
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentPolicy(record);
            setEditModalVisible(true);
          }}
        >
          <EditOutlined /> 编辑
        </a>,
        <a
          key="delete"
          onClick={() => handleDelete(record)}
          style={{ color: '#ff4d4f' }}
        >
          <DeleteOutlined /> 删除
        </a>
      ]
    }
  ];

  const handleDelete = (policy: PricingPolicy) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除政策 "${policy.policyName}" 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deletePricingPolicy(policy.id);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    });
  };

  return (
    <>
      <ProTable<PricingPolicy>
        columns={columns}
        actionRef={actionRef}
        dataSource={pricingPolicies}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: 10
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentPolicy(null);
              setEditModalVisible(true);
            }}
          >
            新建政策
          </Button>
        ]}
      />

      <PolicyFormModal
        visible={editModalVisible}
        policy={currentPolicy}
        onCancel={() => {
          setEditModalVisible(false);
          setCurrentPolicy(null);
        }}
        onSuccess={() => {
          setEditModalVisible(false);
          setCurrentPolicy(null);
          actionRef.current?.reload();
        }}
      />
    </>
  );
};

// ==================== Policy Form Modal ====================

interface PolicyFormModalProps {
  visible: boolean;
  policy: PricingPolicy | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const PolicyFormModal: React.FC<PolicyFormModalProps> = ({ visible, policy, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { addPricingPolicy, updatePricingPolicy } = useAssetStore();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Process stages
      const stages: DiscountStage[] = (values.stages || []).map((stage: any, index: number) => ({
        id: `stage-${Date.now()}-${index}`,
        duration: stage.duration,
        rentDiscount: stage.rentDiscount,
        mgmtDiscount: stage.mgmtDiscount,
        order: index + 1
      }));

      if (policy) {
        updatePricingPolicy(policy.id, {
          ...values,
          stages
        });
        message.success('更新成功');
      } else {
        const newPolicy: PricingPolicy = {
          id: `policy-${Date.now()}`,
          ...values,
          stages,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        addPricingPolicy(newPolicy);
        message.success('创建成功');
      }
      
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error('请检查表单填写');
    }
  };

  return (
    <Modal
      title={policy ? '编辑政策' : '新建政策'}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={policy || {
          stages: []
        }}
      >
        <Form.Item
          name="policyName"
          label="政策名称"
          rules={[{ required: true, message: '请输入政策名称' }]}
        >
          <input className="ant-input" placeholder="例: 3免2减半扶持政策" />
        </Form.Item>

        <Form.Item
          name="targetIndustry"
          label="目标行业"
        >
          <input className="ant-input" placeholder="留空则适用于所有行业" />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
        >
          <textarea className="ant-input" rows={2} placeholder="政策说明" />
        </Form.Item>

        <Form.Item label="优惠规则">
          <Form.List name="stages">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    size="small"
                    title={`阶段 ${index + 1}`}
                    style={{ marginBottom: 16 }}
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                      >
                        删除
                      </Button>
                    }
                  >
                    <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...field}
                        label="持续时间 (月)"
                        name={[field.name, 'duration']}
                        rules={[{ required: true, message: '请输入持续时间' }]}
                      >
                        <InputNumber min={1} placeholder="36" style={{ width: 120 }} />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        label="租金折扣 (%)"
                        name={[field.name, 'rentDiscount']}
                        rules={[{ required: true, message: '请输入折扣' }]}
                      >
                        <InputNumber min={0} max={100} placeholder="100" style={{ width: 120 }} />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        label="管理费折扣 (%)"
                        name={[field.name, 'mgmtDiscount']}
                        rules={[{ required: true, message: '请输入折扣' }]}
                      >
                        <InputNumber min={0} max={100} placeholder="0" style={{ width: 120 }} />
                      </Form.Item>
                    </Space>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加阶段
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChargingStandardsPage;
