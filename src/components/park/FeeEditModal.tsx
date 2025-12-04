import React, { useState, useEffect } from 'react';
import { ModalForm, ProFormDigit, ProFormGroup, ProFormDependency } from '@ant-design/pro-components';
import { Divider, Descriptions, Empty, Row, Col, Statistic } from 'antd';
import { Asset, AssetType } from '../../types/asset';

interface FeeEditModalProps {
  visible: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (values: any) => Promise<boolean>;
  asset: Asset | null;
}

// Mock Enterprise Data (Reused from AssetDetailModal logic)
const MOCK_ENTERPRISES = [
  {
    enterpriseName: '企业1',
    socialCreditCode: '913100007777777777',
    industry: '信息技术',
    enterpriseScale: '中型',
    registeredCapital: '1000万',
    contactPersonName: '张三',
    contactPersonPhone: '13800138000',
    contactPersonEmail: 'zhangsan@example.com',
    enterpriseAddress: '上海市浦东新区',
    enterpriseSummary: '一家领先的科技公司',
  },
  {
    enterpriseName: '企业2',
    socialCreditCode: '911100008888888888',
    industry: '人工智能',
    enterpriseScale: '小型',
    registeredCapital: '500万',
    contactPersonName: '李四',
    contactPersonPhone: '13911112222',
    contactPersonEmail: 'lisi@example.com',
    enterpriseAddress: '北京市海淀区',
    enterpriseSummary: '专注于人工智能研发',
  },
  {
    enterpriseName: '企业3',
    socialCreditCode: '913100009999999999',
    industry: '电子商务',
    enterpriseScale: '大型',
    registeredCapital: '5000万',
    contactPersonName: '王五',
    contactPersonPhone: '13700001111',
    contactPersonEmail: 'wangwu@example.com',
    enterpriseAddress: '杭州市滨江区',
    enterpriseSummary: '知名电商平台运营商',
  },
  {
    enterpriseName: '企业4',
    socialCreditCode: '913100006666666666',
    industry: '智能制造',
    enterpriseScale: '中型',
    registeredCapital: '2000万',
    contactPersonName: '赵六',
    contactPersonPhone: '13600002222',
    contactPersonEmail: 'zhaoliu@example.com',
    enterpriseAddress: '苏州市工业园区',
    enterpriseSummary: '高端精密仪器制造商',
  },
  {
    enterpriseName: '企业5',
    socialCreditCode: '913100005555555555',
    industry: '生物医药',
    enterpriseScale: '中型',
    registeredCapital: '3000万',
    contactPersonName: '孙七',
    contactPersonPhone: '13500003333',
    contactPersonEmail: 'sunqi@example.com',
    enterpriseAddress: '上海市张江高科',
    enterpriseSummary: '创新药研发企业',
  }
];

export const FeeEditModal: React.FC<FeeEditModalProps> = ({
  visible,
  onOpenChange,
  onFinish,
  asset
}) => {
  if (!asset) return null;

  // Find tenant info
  const tenantInfo = MOCK_ENTERPRISES.find(e => e.enterpriseName === asset.tenantName);

  // 计算欠费金额的辅助函数
  const calculateArrears = (receivable: number = 0, received: number = 0, reduction: number = 0) => {
    return receivable - received - reduction;
  };

  return (
    <ModalForm
      title="收费编辑"
      open={visible}
      onOpenChange={onOpenChange}
      onFinish={onFinish}
      initialValues={asset}
      modalProps={{
        destroyOnClose: true
      }}
      width={1100}
      layout="horizontal"
      labelCol={{ span: 0 }}
      wrapperCol={{ span: 24 }}
    >
      {/* 表头 */}
      <Row gutter={[16, 0]} style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #f0f0f0' }}>
        <Col span={4} style={{ fontWeight: 'bold', fontSize: '15px', paddingLeft: '12px' }}>
          费用类型
        </Col>
        <Col span={5} style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'center' }}>
          本年应收
        </Col>
        <Col span={5} style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'center' }}>
          本年实收
        </Col>
        <Col span={5} style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'center' }}>
          政策减免
        </Col>
        <Col span={5} style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'center' }}>
          欠费金额
        </Col>
      </Row>

      {/* 租金 (元) */}
      <Row gutter={[16, 0]} align="middle" style={{ marginBottom: '20px' }}>
        <Col span={4} style={{ 
          fontWeight: '500', 
          fontSize: '14px', 
          paddingLeft: '12px',
          display: 'flex',
          alignItems: 'center',
          height: '32px'
        }}>
          租金 (元)
        </Col>
        <Col span={5}>
          <ProFormDigit 
            name="receivableRent" 
            fieldProps={{ 
              precision: 2,
              style: { width: '100%' }
            }} 
            readonly
            tooltip="来源于新增租户时计算的总租金，不可编辑"
            placeholder="-"
            formItemProps={{
              style: { marginBottom: 0 }
            }}
          />
        </Col>
        <Col span={5}>
          <ProFormDigit 
            name="receivedRent" 
            fieldProps={{ 
              precision: 2,
              style: { width: '100%' }
            }} 
            rules={[{ required: true, message: '请输入本年实收' }]}
            placeholder="请输入"
            formItemProps={{
              style: { marginBottom: 0 }
            }}
          />
        </Col>
        <Col span={5}>
          <ProFormDigit 
            name="policyReductionRent" 
            fieldProps={{ 
              precision: 2,
              style: { width: '100%' }
            }} 
            placeholder="请输入"
            formItemProps={{
              style: { marginBottom: 0 }
            }}
          />
        </Col>
        <Col span={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px' }}>
          <ProFormDependency name={['receivableRent', 'receivedRent', 'policyReductionRent']}>
            {({ receivableRent, receivedRent, policyReductionRent }) => {
              const arrears = calculateArrears(receivableRent || 0, receivedRent || 0, policyReductionRent || 0);
              return (
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: arrears > 0 ? '#cf1322' : '#3f8600',
                  textAlign: 'center'
                }}>
                  {arrears.toFixed(2)} 元
                </div>
              );
            }}
          </ProFormDependency>
        </Col>
      </Row>

      {/* 物管 (元) */}
      <Row gutter={[16, 0]} align="middle" style={{ marginBottom: '20px' }}>
        <Col span={4} style={{ 
          fontWeight: '500', 
          fontSize: '14px', 
          paddingLeft: '12px',
          display: 'flex',
          alignItems: 'center',
          height: '32px'
        }}>
          物管 (元)
        </Col>
        <Col span={5}>
          <ProFormDigit 
            name="receivableProperty" 
            fieldProps={{ 
              precision: 2,
              style: { width: '100%' }
            }} 
            readonly
            tooltip="来源于新增租户时计算的总物管费，不可编辑"
            placeholder="-"
            formItemProps={{
              style: { marginBottom: 0 }
            }}
          />
        </Col>
        <Col span={5}>
          <ProFormDigit 
            name="receivedProperty" 
            fieldProps={{ 
              precision: 2,
              style: { width: '100%' }
            }} 
            rules={[{ required: true, message: '请输入本年实收' }]}
            placeholder="请输入"
            formItemProps={{
              style: { marginBottom: 0 }
            }}
          />
        </Col>
        <Col span={5}>
          <ProFormDigit 
            name="policyReductionProperty" 
            fieldProps={{ 
              precision: 2,
              style: { width: '100%' }
            }} 
            placeholder="请输入"
            formItemProps={{
              style: { marginBottom: 0 }
            }}
          />
        </Col>
        <Col span={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px' }}>
          <ProFormDependency name={['receivableProperty', 'receivedProperty', 'policyReductionProperty']}>
            {({ receivableProperty, receivedProperty, policyReductionProperty }) => {
              const arrears = calculateArrears(receivableProperty || 0, receivedProperty || 0, policyReductionProperty || 0);
              return (
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: arrears > 0 ? '#cf1322' : '#3f8600',
                  textAlign: 'center'
                }}>
                  {arrears.toFixed(2)} 元
                </div>
              );
            }}
          </ProFormDependency>
        </Col>
      </Row>

      {/* 保证金 (元) */}
      <Row gutter={[16, 0]} align="middle" style={{ marginBottom: '20px' }}>
        <Col span={4} style={{ 
          fontWeight: '500', 
          fontSize: '14px', 
          paddingLeft: '12px',
          display: 'flex',
          alignItems: 'center',
          height: '32px'
        }}>
          保证金 (元)
        </Col>
        <Col span={5}>
          <ProFormDigit 
            name="receivableDeposit" 
            fieldProps={{ 
              precision: 2,
              style: { width: '100%' }
            }} 
            placeholder="请输入"
            tooltip="保证金应收金额由用户手动填写"
            formItemProps={{
              style: { marginBottom: 0 }
            }}
          />
        </Col>
        <Col span={5}>
          <ProFormDigit 
            name="receivedDeposit" 
            fieldProps={{ 
              precision: 2,
              style: { width: '100%' }
            }} 
            rules={[{ required: true, message: '请输入本年实收' }]}
            placeholder="请输入"
            formItemProps={{
              style: { marginBottom: 0 }
            }}
          />
        </Col>
        <Col span={5}>
          <ProFormDigit 
            name="policyReductionDeposit" 
            fieldProps={{ 
              precision: 2,
              style: { width: '100%' }
            }} 
            placeholder="请输入"
            formItemProps={{
              style: { marginBottom: 0 }
            }}
          />
        </Col>
        <Col span={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '32px' }}>
          <ProFormDependency name={['receivableDeposit', 'receivedDeposit', 'policyReductionDeposit']}>
            {({ receivableDeposit, receivedDeposit, policyReductionDeposit }) => {
              const arrears = calculateArrears(receivableDeposit || 0, receivedDeposit || 0, policyReductionDeposit || 0);
              return (
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  color: arrears > 0 ? '#cf1322' : '#3f8600',
                  textAlign: 'center'
                }}>
                  {arrears.toFixed(2)} 元
                </div>
              );
            }}
          </ProFormDependency>
        </Col>
      </Row>
    </ModalForm>
  );
};
