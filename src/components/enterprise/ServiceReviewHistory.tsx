import React, { useState } from 'react';
import { Input, Button, Table, Space } from '@arco-design/web-react';
import { Search } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface HistoryItem {
  key: string;
  type: string; // e.g., 'financial', 'logistics', 'hr'
  name: string;
  status: string; // e.g., '已同意', '已拒绝'
  details: string; // More details about the item
}

const ServiceReviewHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [historyData, setHistoryData] = useState<HistoryItem[]>([
    {
      key: '1',
      type: 'financial',
      name: '企业经营贷',
      status: '已同意',
      details: '合作银行: 招商银行, 利率: 4.5%',
    },
    {
      key: '2',
      type: 'logistics',
      name: '城市快运',
      status: '已拒绝',
      details: '运输路线: 上海-苏州, 运输能力: 5吨',
    },
    {
      key: '3',
      type: 'hr',
      name: '张三',
      status: '已同意',
      details: '学历: 本科, 工作年限: 5年, 求职意向: 前端开发',
    },
    {
      key: '4',
      type: 'financial',
      name: '小微企业贷',
      status: '已拒绝',
      details: '合作银行: 建设银行, 利率: 4.2%',
    },
    {
      key: '5',
      type: 'logistics',
      name: '跨省物流',
      status: '已同意',
      details: '运输路线: 上海-北京, 运输能力: 10吨',
    },
    {
      key: '6',
      type: 'procurement',
      name: '办公用品采购',
      status: '已拒绝',
      details: '采购方: 某公司, 物品: 打印纸, 数量: 1000, 理由: 预算不足',
    },
    {
      key: '7',
      type: 'capacity',
      name: 'CNC机床共享',
      status: '已同意',
      details: '提供方: 某工厂, 设备型号: XYZ-2000, 可用时间: 2023-10-26',
    },
    {
      key: '8',
      type: 'supply',
      name: '电子元器件供应',
      status: '已修改',
      details: '供应商: 某电子, 物品: 电阻, 数量: 5000, 价格: 0.05元/个',
    },
    {
      key: '9',
      type: 'shop',
      name: '云服务器租赁',
      status: '已删除',
      details: '服务商: 某云服务, 配置: 4核8G, 区域: 华东1',
    },
    {
      key: '10',
      type: 'production',
      name: '定制服装生产',
      status: '已同意',
      details: '需求方: 某品牌, 数量: 500件, 工期: 30天',
    },
  ]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredHistoryData = historyData.filter(item =>
    item.name.includes(searchTerm) ||
    item.details.includes(searchTerm) ||
    item.type.includes(searchTerm) ||
    item.status.includes(searchTerm)
  );

  const handleView = (key: string) => {
    const item = historyData.find(data => data.key === key);
    if (item) {
      alert(`查看详情 - 类型: ${item.type}, 名称: ${item.name}, 状态: ${item.status}, 详情: ${item.details}`);
    }
  };

  const handleDelete = (key: string) => {
    setItemToDelete(key);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setHistoryData(historyData.filter(item => item.key !== itemToDelete));
      setItemToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const columns = [
    { title: '类型', dataIndex: 'type', render: (col) => {
        if (col === 'financial') return '金融产品审核';
        if (col === 'logistics') return '物流服务审核';
        if (col === 'hr') return '用人需求审核';
        if (col === 'procurement') return '采购寻源';
        if (col === 'capacity') return '产能共享';
        if (col === 'supply') return '产品供应';
        if (col === 'shop') return '云商店铺';
        if (col === 'production') return '生产协作';
        return col;
      }
    },
    { title: '名称', dataIndex: 'name' },
    { title: '状态', dataIndex: 'status' },
    { title: '详情', dataIndex: 'details' },
    {
      title: '操作',
      dataIndex: 'operations',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleView(record.key)}>查看</Button>
          <Button status="danger" onClick={() => handleDelete(record.key)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">历史记录</h2>
      <div className="mb-4 flex space-x-4">
        <Input
          placeholder="搜索名称、类型或状态..."
          prefix={<Search className="h-4 w-4" />}
          style={{ width: 300 }}
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <Button type="primary">搜索</Button>
      </div>
      <Table columns={columns} data={filteredHistoryData} pagination={false} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除此历史记录吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServiceReviewHistory;