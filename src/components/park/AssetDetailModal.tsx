import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Divider, Empty, List, Button, Space, message } from 'antd';
import { FileTextOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
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

// Mock attachments data
const MOCK_ATTACHMENTS = [
  {
    id: '1',
    name: '租赁合同.pdf',
    type: 'contract',
    size: '2.5 MB',
    uploadDate: '2024-01-15',
    url: '/mock/租赁合同.pdf'
  },
  {
    id: '2',
    name: '补充协议.pdf',
    type: 'agreement',
    size: '1.2 MB',
    uploadDate: '2024-02-20',
    url: '/mock/补充协议.pdf'
  },
  {
    id: '3',
    name: '物业交接单.pdf',
    type: 'handover',
    size: '800 KB',
    uploadDate: '2024-01-16',
    url: '/mock/物业交接单.pdf'
  }
];

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ visible, onClose, asset }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState<any>(null);

  if (!asset) return null;

  // Find tenant info if available
  const tenantInfo = MOCK_ENTERPRISES.find(e => e.enterpriseName === asset.tenantName);

  const isDorm = asset.type === AssetType.DORM;
  const isLeased = asset.status === AssetStatus.LEASED;

  // Get attachments for this asset (mock data for now)
  const attachments = isLeased ? MOCK_ATTACHMENTS : [];

  // Handle file preview
  const handlePreview = (file: any) => {
    setPreviewFile(file);
    setPreviewVisible(true);
  };

  // Handle file download
  const handleDownload = (file: any) => {
    message.success(`正在下载 ${file.name}`);
    // In real implementation, trigger file download
    // const link = document.createElement('a');
    // link.href = file.url;
    // link.download = file.name;
    // link.click();
  };

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

      {/* 附件区域 */}
      {isLeased && (
        <>
          <Divider />
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>附件资料</h3>
            {attachments.length > 0 ? (
              <List
                dataSource={attachments}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key="preview"
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handlePreview(item)}
                      >
                        预览
                      </Button>,
                      <Button
                        key="download"
                        type="link"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(item)}
                      >
                        下载
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                      title={item.name}
                      description={`大小: ${item.size} | 上传时间: ${item.uploadDate}`}
                    />
                  </List.Item>
                )}
                bordered
              />
            ) : (
              <Empty description="暂无附件" />
            )}
          </div>
        </>
      )}

      {/* 文档预览模态框 */}
      <Modal
        title={
          <Space>
            <FileTextOutlined />
            <span>{previewFile?.name || '文档预览'}</span>
          </Space>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button 
            key="download" 
            type="primary"
            icon={<DownloadOutlined />} 
            onClick={() => handleDownload(previewFile)}
          >
            下载
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>
        ]}
        width={1000}
        style={{ top: 20 }}
        destroyOnClose
      >
        <div style={{ 
          height: '70vh', 
          border: '1px solid #d9d9d9', 
          borderRadius: '4px', 
          overflow: 'hidden',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {previewFile ? (
            previewFile.name.endsWith('.pdf') ? (
              // PDF 预览
              <iframe
                src={`${previewFile.url}#toolbar=1&navpanes=0&scrollbar=1`}
                style={{ width: '100%', height: '100%', border: 'none', backgroundColor: 'white' }}
                title={previewFile.name}
              />
            ) : (
              // 其他文件类型
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <FileTextOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '20px' }} />
                <div style={{ fontSize: '16px', marginBottom: '10px' }}>{previewFile.name}</div>
                <div style={{ color: '#999' }}>该文件类型暂不支持在线预览，请下载后查看</div>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />} 
                  onClick={() => handleDownload(previewFile)}
                  style={{ marginTop: '20px' }}
                >
                  立即下载
                </Button>
              </div>
            )
          ) : (
            <Empty description="无法预览" />
          )}
        </div>
      </Modal>
    </Modal>
  );
};
