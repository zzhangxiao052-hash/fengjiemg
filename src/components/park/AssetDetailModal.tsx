import React from 'react';
import { Modal, Descriptions, Tag, Divider, Empty } from 'antd';
import { Asset, AssetStatus, AssetType } from '../../types/asset';

interface AssetDetailModalProps {
  visible: boolean;
  onClose: () => void;
  asset: Asset | null;
}

// Mock Enterprise Data (matching the structure from EnterpriseManagement)
const MOCK_ENTERPRISES = [
  {
    enterpriseName: '企业1', // Matching the tenantName in the screenshot/mock
    username: 'user1',
    isVerified: true,
    region: '上海',
    enterpriseSummary: '一家领先的科技公司',
    socialCreditCode: '913100007777777777',
    registeredCapital: '1000万',
    mainBusiness: '软件开发',
    industry: '信息技术',
    enterpriseScale: '中型',
    enterpriseAddress: '上海市浦东新区',
    contactPersonName: '张三',
    contactPersonPosition: '销售经理',
    contactPersonPhone: '13800138000',
    contactPersonEmail: 'zhangsan@example.com',
  },
  {
    enterpriseName: '企业2',
    username: 'user2',
    isVerified: true,
    region: '北京',
    enterpriseSummary: '专注于人工智能研发',
    socialCreditCode: '911100008888888888',
    registeredCapital: '500万',
    mainBusiness: 'AI解决方案',
    industry: '人工智能',
    enterpriseScale: '小型',
    enterpriseAddress: '北京市海淀区',
    contactPersonName: '李四',
    contactPersonPosition: '技术总监',
    contactPersonPhone: '13911112222',
    contactPersonEmail: 'lisi@example.com',
  },
  // Add more mock data as needed to match potential tenant names
  {
    enterpriseName: '示例企业A',
    username: 'userA',
    isVerified: true,
    region: '上海',
    enterpriseSummary: '一家领先的科技公司',
    socialCreditCode: '913100007777777777',
    registeredCapital: '1000万',
    mainBusiness: '软件开发',
    industry: '信息技术',
    enterpriseScale: '中型',
    enterpriseAddress: '上海市浦东新区',
    contactPersonName: '张三',
    contactPersonPosition: '销售经理',
    contactPersonPhone: '13800138000',
    contactPersonEmail: 'zhangsan@example.com',
  }
];

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ visible, onClose, asset }) => {
  if (!asset) return null;

  // Find tenant info if available
  const tenantInfo = MOCK_ENTERPRISES.find(e => e.enterpriseName === asset.tenantName);

  const isDorm = asset.type === AssetType.DORM;
  const isLeased = asset.status === AssetStatus.LEASED;

  return (
    <Modal
      title={`${asset.type === AssetType.FACTORY ? '厂房' : asset.type === AssetType.RETAIL ? '门市' : '宿舍'}详情 - ${asset.addressCode}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions title="资产基础信息" bordered column={2}>
        <Descriptions.Item label="区域">{asset.zone}区</Descriptions.Item>
        <Descriptions.Item label="地址/房号">{asset.addressCode}</Descriptions.Item>
        <Descriptions.Item label="楼层">{asset.floorLevel}层</Descriptions.Item>
        <Descriptions.Item label="面积">{asset.area} ㎡</Descriptions.Item>
        <Descriptions.Item label="当前状态">
          <Tag color={
            asset.status === AssetStatus.VACANT ? 'green' : 
            asset.status === AssetStatus.LEASED ? 'blue' : 'orange'
          }>
            {asset.status === AssetStatus.VACANT ? '空闲' : 
             asset.status === AssetStatus.LEASED ? '租赁中' : '装修中'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="欠费状态">
           <Tag color={asset.arrearsStatus ? 'red' : 'green'}>
            {asset.arrearsStatus ? '欠费' : '正常'}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Descriptions title="租赁信息" bordered column={2}>
        <Descriptions.Item label="租赁状态">
           {isLeased ? '已出租' : '未出租'}
        </Descriptions.Item>
        {isLeased && (
          <>
            <Descriptions.Item label="承租方">{asset.tenantName}</Descriptions.Item>
            <Descriptions.Item label="租赁开始日期">{asset.leaseStartDate}</Descriptions.Item>
            <Descriptions.Item label="租赁结束日期">{asset.leaseEndDate}</Descriptions.Item>
            <Descriptions.Item label="本年应收">¥{asset.receivableRent?.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="本年实收">¥{asset.receivedRent?.toLocaleString()}</Descriptions.Item>
          </>
        )}
      </Descriptions>

      {!isDorm && isLeased && (
        <>
          <Divider />
          <div style={{ marginBottom: 16, fontWeight: 'bold', fontSize: 16 }}>企业/商户详细信息</div>
          {tenantInfo ? (
            <Descriptions bordered column={2}>
              <Descriptions.Item label="企业名称">{tenantInfo.enterpriseName}</Descriptions.Item>
              <Descriptions.Item label="统一社会信用代码">{tenantInfo.socialCreditCode}</Descriptions.Item>
              <Descriptions.Item label="所属行业">{tenantInfo.industry}</Descriptions.Item>
              <Descriptions.Item label="企业规模">{tenantInfo.enterpriseScale}</Descriptions.Item>
              <Descriptions.Item label="注册资金">{tenantInfo.registeredCapital}</Descriptions.Item>
              <Descriptions.Item label="联系人">{tenantInfo.contactPersonName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{tenantInfo.contactPersonPhone}</Descriptions.Item>
              <Descriptions.Item label="联系邮箱">{tenantInfo.contactPersonEmail}</Descriptions.Item>
              <Descriptions.Item label="企业地址" span={2}>{tenantInfo.enterpriseAddress}</Descriptions.Item>
              <Descriptions.Item label="企业简介" span={2}>{tenantInfo.enterpriseSummary}</Descriptions.Item>
            </Descriptions>
          ) : (
            <Empty description="暂无关联的企业详细信息" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </>
      )}
    </Modal>
  );
};
