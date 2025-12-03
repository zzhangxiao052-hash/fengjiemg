/**
 * Dormitory Manager Page
 * Display and manage dormitory assets with ProTable
 */

import React, { useState, useRef, useEffect } from 'react';
import { ProTable, ProColumns, ActionType, ModalForm, ProFormText, ProFormSelect, ProFormDigit } from '@ant-design/pro-components';
import { Button, Tag, Space, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useAssetStore } from '../../stores/assetStore';
import { Asset, AssetStatus, AssetType, Zone } from '../../types/asset';
import { TenantMoveInModal } from './TenantMoveInModal';
import { UnifiedStatisticsCard, UnifiedStats } from './UnifiedStatisticsCard';
import { AssetDetailModal } from './AssetDetailModal';

// Status badge colors
const statusColorMap: Record<AssetStatus, string> = {
  [AssetStatus.VACANT]: 'success',
  [AssetStatus.LEASED]: 'processing',
  [AssetStatus.DECORATION]: 'warning'
};

// Status display names
const statusLabelMap: Record<AssetStatus, string> = {
  [AssetStatus.VACANT]: '空闲中',
  [AssetStatus.LEASED]: '租赁中',
  [AssetStatus.DECORATION]: '装修中'
};

const DormitoryPage: React.FC = () => {
  const actionRef = useRef<ActionType>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [moveInModalVisible, setMoveInModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [stats, setStats] = useState<UnifiedStats>({
    totalCount: 0,
    leasedCount: 0,
    vacantCount: 0,
    decorationCount: 0,
    totalReceivable: 0,
    totalReceived: 0,
    arrearsAmount: 0
  });
  
  const { 
    assets, 
    addAsset, 
    updateAsset, 
    deleteAsset 
  } = useAssetStore();

  // Filter dormitory assets only
  const dormitoryAssets = assets.filter(a => a.type === AssetType.DORM);

  // Calculate stats helper
  const calculateStats = (data: Asset[]) => {
    const totalCount = data.length;
    const leasedCount = data.filter(item => item.status === AssetStatus.LEASED).length;
    const vacantCount = data.filter(item => item.status === AssetStatus.VACANT).length;
    const decorationCount = data.filter(item => item.status === AssetStatus.DECORATION).length;
    const totalReceivable = data.reduce((sum, item) => sum + (item.receivableRent || 0), 0);
    const totalReceived = data.reduce((sum, item) => sum + (item.receivedRent || 0), 0);
    const arrearsAmount = totalReceivable - totalReceived;

    setStats({
      totalCount,
      leasedCount,
      vacantCount,
      decorationCount,
      totalReceivable,
      totalReceived,
      arrearsAmount
    });
  };

  // Initial stats calculation
  useEffect(() => {
    calculateStats(dormitoryAssets);
  }, [assets]);

  const handleMoveIn = async (values: any) => {
    try {
      const assetToUpdate = assets.find(a => a.id === values.assetId);
      if (assetToUpdate) {
        updateAsset(assetToUpdate.id, {
          status: AssetStatus.LEASED,
          tenantName: values.tenantName,
          leaseStartDate: values.leaseRange[0],
          leaseEndDate: values.leaseRange[1]
        });
        message.success('租户入驻办理成功');
        setMoveInModalVisible(false);
        actionRef.current?.reload();
      }
      return true;
    } catch (error) {
      message.error('操作失败');
      return false;
    }
  };

  // Define table columns
  const columns: ProColumns<Asset>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
      fixed: 'left',
      hideInSearch: true
    },
    {
      title: '区域',
      dataIndex: 'zone',
      valueType: 'select',
      valueEnum: {
        'LowRent': { text: '廉租房' },
        'Logistics': { text: '后勤服务中心' },
        'Research': { text: '科研基地宿舍' },
      },
      filters: true,
      width: 120
    },
    {
      title: '房号',
      dataIndex: 'addressCode',
      copyable: true,
      width: 100
    },
    {
      title: '楼层',
      dataIndex: 'floorLevel',
      valueType: 'digit',
      width: 80,
      render: (_, record) => `${record.floorLevel}楼`,
      sorter: (a, b) => a.floorLevel - b.floorLevel
    },
    {
      title: '计费模式',
      key: 'rentType',
      width: 100,
      hideInSearch: true,
      render: (_, record) => record.zone === Zone.LOW_RENT ? '按面积' : '固定价格'
    },
    {
      title: '月租金',
      key: 'monthlyRent',
      width: 120,
      valueType: 'money',
      hideInSearch: true,
      render: (_, record) => {
        const rent = record.zone === Zone.LOW_RENT ? record.area * 2 : 200;
        return `¥${rent}`;
      }
    },
    {
      title: '本年应收',
      dataIndex: 'receivableRent',
      valueType: 'money',
      width: 120,
      hideInSearch: true,
      sorter: (a, b) => (a.receivableRent || 0) - (b.receivableRent || 0)
    },
    {
      title: '本年实收',
      dataIndex: 'receivedRent',
      valueType: 'money',
      width: 120,
      hideInSearch: true,
      sorter: (a, b) => (a.receivedRent || 0) - (b.receivedRent || 0)
    },
    {
      title: '是否欠费',
      dataIndex: 'arrearsStatus',
      width: 100,
      valueType: 'select',
      valueEnum: {
        true: { text: '欠费', status: 'Error' },
        false: { text: '正常', status: 'Success' }
      },
      render: (_, record) => (
        <Tag color={record.arrearsStatus ? 'red' : 'green'}>
          {record.arrearsStatus ? '欠费' : '正常'}
        </Tag>
      )
    },
    {
      title: '使用状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        [AssetStatus.VACANT]: { 
          text: statusLabelMap[AssetStatus.VACANT], 
          status: 'Success' 
        },
        [AssetStatus.LEASED]: { 
          text: statusLabelMap[AssetStatus.LEASED], 
          status: 'Processing' 
        },
        [AssetStatus.DECORATION]: { 
          text: statusLabelMap[AssetStatus.DECORATION], 
          status: 'Warning' 
        }
      },
      width: 100,
      render: (_, record) => (
        <Tag color={statusColorMap[record.status]}>
          {statusLabelMap[record.status]}
        </Tag>
      )
    },
    {
      title: '租赁企业/人',
      dataIndex: 'tenantName',
      width: 150,
      hideInSearch: true,
      render: (_, record) => {
        if (record.status === AssetStatus.LEASED && record.tenantName) {
          return record.tenantName;
        }
        return <span style={{ color: '#999' }}>-</span>;
      }
    },
    {
      title: '租赁周期',
      key: 'leasePeriod',
      width: 200,
      hideInSearch: true,
      render: (_, record) => {
        if (record.status === AssetStatus.LEASED && record.leaseStartDate && record.leaseEndDate) {
          return `${record.leaseStartDate} 至 ${record.leaseEndDate}`;
        }
        return <span style={{ color: '#999' }}>-</span>;
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      hideInSearch: true,
      render: (_, record) => [
        <a key="detail" onClick={() => {
          setCurrentAsset(record);
          setDetailModalVisible(true);
        }}>详情</a>,
        <a
          key="edit"
          onClick={() => {
            setCurrentAsset(record);
            setEditModalVisible(true);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => handleDelete(record)}
          style={{ color: '#ff4d4f' }}
        >
          删除
        </a>
      ]
    }
  ];

  // Handle delete
  const handleDelete = (asset: Asset) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除宿舍 "${asset.addressCode}" 吗?`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteAsset(asset.id);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    });
  };

  // Handle create/update
  const handleSubmit = async (values: any) => {
    try {
      if (currentAsset) {
        // Update existing asset
        updateAsset(currentAsset.id, values);
        message.success('更新成功');
      } else {
        // Create new asset
        const newAsset: Asset = {
          id: `asset-${Date.now()}`,
          type: AssetType.DORM,
          ...values,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        addAsset(newAsset);
        message.success('创建成功');
      }
      setEditModalVisible(false);
      setCurrentAsset(null);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('操作失败');
      return false;
    }
  };

  return (
    <div>
      <UnifiedStatisticsCard stats={stats} title="宿舍资产统计" />
      <ProTable<Asset>
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          let filteredData = [...dormitoryAssets];

          // Filter by zone
          if (params.zone) {
            filteredData = filteredData.filter(item => item.zone === params.zone);
          }

          // Filter by status
          if (params.status) {
            filteredData = filteredData.filter(item => item.status === params.status);
          }

          // Filter by addressCode
          if (params.addressCode) {
            filteredData = filteredData.filter(item => 
              item.addressCode.toLowerCase().includes(params.addressCode.toLowerCase())
            );
          }

          // Calculate stats based on filtered data
          calculateStats(filteredData);

          return {
            data: filteredData,
            success: true,
            total: filteredData.length,
          };
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true
        }}
        dateFormatter="string"
        headerTitle="宿舍管理"
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentAsset(null);
              setEditModalVisible(true);
            }}
          >
            新建宿舍
          </Button>,
          <Button
            key="moveIn"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setMoveInModalVisible(true)}
          >
            新增租户
          </Button>,
          <Button key="export" icon={<DownloadOutlined />}>
            导出
          </Button>
        ]}
        scroll={{ x: 1300 }}
      />

      {/* Create/Edit Modal */}
      <ModalForm
        title={currentAsset ? '编辑宿舍' : '新建宿舍'}
        open={editModalVisible}
        onOpenChange={setEditModalVisible}
        onFinish={handleSubmit}
        initialValues={currentAsset || {
          zone: Zone.ZONE_A,
          floorLevel: 1,
          status: AssetStatus.VACANT
        }}
        width={600}
        modalProps={{
          destroyOnClose: true
        }}
      >
        <ProFormSelect
          name="zone"
          label="区域"
          rules={[{ required: true, message: '请选择区域' }]}
          options={[
            { label: '廉租房', value: Zone.LOW_RENT },
            { label: '后勤服务中心', value: Zone.LOGISTICS },
            { label: '科研基地宿舍', value: Zone.RESEARCH }
          ]}
        />
        
        <ProFormText
          name="addressCode"
          label="宿舍房号"
          placeholder="例: L-101"
          rules={[{ required: true, message: '请输入宿舍房号' }]}
        />
        
        <ProFormDigit
          name="floorLevel"
          label="楼层"
          min={1}
          max={10}
          fieldProps={{ precision: 0 }}
          rules={[{ required: true, message: '请输入楼层' }]}
          extra="楼层决定基础租金价格"
        />
        
        <ProFormDigit
          name="area"
          label="面积 (㎡)"
          min={1}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: '请输入面积' }]}
        />
        
        <ProFormSelect
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
          options={[
            { label: statusLabelMap[AssetStatus.VACANT], value: AssetStatus.VACANT },
            { label: statusLabelMap[AssetStatus.LEASED], value: AssetStatus.LEASED },
            { label: statusLabelMap[AssetStatus.DECORATION], value: AssetStatus.DECORATION }
          ]}
        />
      </ModalForm>

      <TenantMoveInModal
        visible={moveInModalVisible}
        onVisibleChange={setMoveInModalVisible}
        onFinish={handleMoveIn}
        assetType={AssetType.DORM}
      />
      
      <AssetDetailModal
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setCurrentAsset(null);
        }}
        asset={currentAsset}
      />
    </div>
  );
};

export default DormitoryPage;
