import React, { useState } from 'react';
import { Input, Button, Table, Space, Select as ArcoSelect } from '@arco-design/web-react';
import { Search } from 'lucide-react';

interface ServiceReviewProps {
  onNavigate: (page: string) => void;
}

const ServiceReview = ({ onNavigate }: ServiceReviewProps) => {
  const [activeTab, setActiveTab] = useState('hr');
  const [hrSearchTerm, setHrSearchTerm] = useState('');
  const [hrEducationFilter, setHrEducationFilter] = useState('');
  const [hrWorkYearsFilter, setHrWorkYearsFilter] = useState('');
  const [hrJobTypeFilter, setHrJobTypeFilter] = useState('');

  // 删除金融产品审核与物流服务审核，保留用人需求审核

  // 用人需求审核数据和逻辑
  const hrColumns = [
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { title: '学历', dataIndex: 'education' },
    { title: '工作年限', dataIndex: 'workYears' },
    { title: '求职意向', dataIndex: 'jobIntention' },
    { title: '期望薪资', dataIndex: 'expectedSalary' },
    { title: '手机号码', dataIndex: 'phone' },
    { title: '邮箱', dataIndex: 'email' },
    {
      title: '操作',
      dataIndex: 'operations',
      render: (_, record) => (
        <Space>
          {record.status === '待审核' && (
            <Button type="primary" onClick={() => handleHrView(record.key)}>查看</Button>
          )}
          {record.status !== '待审核' && <span>{record.status}</span>}
        </Space>
      ),
    },
  ];
  const [hrData, setHrData] = useState([
    {
      key: '1',
      name: '张三',
      age: 28,
      education: '本科',
      workYears: '5年',
      jobIntention: '前端开发',
      jobType: '前端开发',
      expectedSalary: '15k',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      status: '待审核',
    },
    {
      key: '2',
      name: '李四',
      age: 30,
      education: '硕士',
      workYears: '7年',
      jobIntention: '后端开发',
      jobType: '后端开发',
      expectedSalary: '20k',
      phone: '13900139000',
      email: 'lisi@example.com',
      status: '待审核',
    },
  ]);

  const filteredHrData = hrData.filter(item => {
    const matchesSearch = hrSearchTerm ? (item.name.includes(hrSearchTerm) || item.jobIntention.includes(hrSearchTerm)) : true;
    const matchesEducation = hrEducationFilter ? item.education === hrEducationFilter : true;
    const matchesWorkYears = hrWorkYearsFilter ? item.workYears === hrWorkYearsFilter : true;
    const matchesJobType = hrJobTypeFilter ? item.jobType === hrJobTypeFilter : true;
    return matchesSearch && matchesEducation && matchesWorkYears && matchesJobType;
  });

  const handleHrView = (key: string) => {
    // Implement view logic here, e.g., open a modal with details
    alert(`查看用人需求: ${key}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">简历审核</h2>
      
      {/* 仅保留用人需求审核，移除下拉菜单 */}
      <div className="space-y-4">
        <div className="mb-4 flex space-x-4">
          <Input
            placeholder="搜索姓名/求职意向"
            prefix={<Search className="h-4 w-4" />}
            style={{ width: 200 }}
            value={hrSearchTerm}
            onChange={setHrSearchTerm}
          />
          <ArcoSelect placeholder="工种筛选" style={{ width: 150 }} value={hrJobTypeFilter} onChange={setHrJobTypeFilter}>
            <ArcoSelect.Option value="前端开发">前端开发</ArcoSelect.Option>
            <ArcoSelect.Option value="后端开发">后端开发</ArcoSelect.Option>
            <ArcoSelect.Option value="机械工程">机械工程</ArcoSelect.Option>
            <ArcoSelect.Option value="市场运营">市场运营</ArcoSelect.Option>
            <ArcoSelect.Option value="仓储管理">仓储管理</ArcoSelect.Option>
          </ArcoSelect>
          <ArcoSelect placeholder="学历筛选" style={{ width: 150 }} value={hrEducationFilter} onChange={setHrEducationFilter}>
            <ArcoSelect.Option value="本科">本科</ArcoSelect.Option>
            <ArcoSelect.Option value="硕士">硕士</ArcoSelect.Option>
            <ArcoSelect.Option value="博士">博士</ArcoSelect.Option>
          </ArcoSelect>
          <ArcoSelect placeholder="工作年限筛选" style={{ width: 150 }} value={hrWorkYearsFilter} onChange={setHrWorkYearsFilter}>
            <ArcoSelect.Option value="1-3年">1-3年</ArcoSelect.Option>
            <ArcoSelect.Option value="3-5年">3-5年</ArcoSelect.Option>
            <ArcoSelect.Option value="5年以上">5年以上</ArcoSelect.Option>
          </ArcoSelect>
          <Button type="primary">搜索</Button>
        </div>
        <Table columns={hrColumns} data={filteredHrData} pagination={false} />
      </div>
    </div>
  );
};

export default ServiceReview;
