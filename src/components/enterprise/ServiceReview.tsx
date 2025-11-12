import React, { useState } from 'react';
import { Input, Button, Table, Space, Select as ArcoSelect } from '@arco-design/web-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Search } from 'lucide-react';

const ServiceReview = () => {
  const [activeTab, setActiveTab] = useState('financial');
  const [financialSearchTerm, setFinancialSearchTerm] = useState('');
  const [logisticsSearchTerm, setLogisticsSearchTerm] = useState('');
  const [hrSearchTerm, setHrSearchTerm] = useState('');
  const [hrEducationFilter, setHrEducationFilter] = useState('');
  const [hrWorkYearsFilter, setHrWorkYearsFilter] = useState('');

  // 金融产品审核数据和逻辑
  const financialColumns = [
    { title: '产品名称', dataIndex: 'productName' },
    { title: '合作银行', dataIndex: 'bank' },
    { title: '利率', dataIndex: 'rate' },
    { title: '额度范围', dataIndex: 'amountRange' },
    { title: '贷款期限', dataIndex: 'loanTerm' },
    { title: '申请要求', dataIndex: 'requirements' },
    {
      title: '操作',
      dataIndex: 'operations',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleFinancialView(record.key)}>查看</Button>
          {record.status === '待审核' && (
            <>
              <Button type="primary" onClick={() => handleFinancialApprove(record.key)}>同意</Button>
              <Button status="danger" onClick={() => handleFinancialReject(record.key)}>拒绝</Button>
            </>
          )}
          {record.status !== '待审核' && <span>{record.status}</span>}
        </Space>
      ),
    },
  ];
  const [financialData, setFinancialData] = useState([
    {
      key: '1',
      productName: '企业经营贷',
      bank: '招商银行',
      rate: '4.5%',
      amountRange: '10万-100万',
      loanTerm: '1年',
      requirements: '企业注册满1年',
      status: '待审核',
    },
    {
      key: '2',
      productName: '小微企业贷',
      bank: '建设银行',
      rate: '4.2%',
      amountRange: '5万-50万',
      loanTerm: '6个月',
      requirements: '小微企业',
      status: '待审核',
    },
  ]);

  const filteredFinancialData = financialData.filter(item =>
    item.productName.includes(financialSearchTerm) ||
    item.bank.includes(financialSearchTerm)
  );

  const handleFinancialApprove = (key: string) => {
    setFinancialData(financialData.map(item =>
      item.key === key ? { ...item, status: '已同意' } : item
    ));
  };

  const handleFinancialReject = (key: string) => {
    setFinancialData(financialData.map(item =>
      item.key === key ? { ...item, status: '已拒绝' } : item
    ));
  };

  const handleFinancialView = (key: string) => {
    console.log('查看金融产品', key);
    // TODO: Implement view logic
  };

  // 物流服务审核数据和逻辑
  const logisticsColumns = [
    { title: '服务名称', dataIndex: 'serviceName' },
    { title: '运输路线', dataIndex: 'route' },
    { title: '运输能力', dataIndex: 'capacity' },
    { title: '价格', dataIndex: 'price' },
    { title: '服务描述', dataIndex: 'description' },
    { title: '联系人', dataIndex: 'contactPerson' },
    { title: '联系人电话', dataIndex: 'contactPhone' },
    { title: '地址', dataIndex: 'address' },
    {
      title: '操作',
      dataIndex: 'operations',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleLogisticsView(record.key)}>查看</Button>
          {record.status === '待审核' && (
            <>
              <Button type="primary" onClick={() => handleLogisticsApprove(record.key)}>同意</Button>
              <Button status="danger" onClick={() => handleLogisticsReject(record.key)}>拒绝</Button>
            </>
          )}
          {record.status !== '待审核' && <span>{record.status}</span>}
        </Space>
      ),
    },
  ];
  const [logisticsData, setLogisticsData] = useState([
    {
      key: '1',
      serviceName: '城市快运',
      route: '上海-苏州',
      capacity: '5吨',
      price: '200元/吨',
      description: '当日达',
      contactPerson: '王小明',
      contactPhone: '13812345678',
      address: '上海市浦东新区张江高科',
      status: '待审核',
    },
    {
      key: '2',
      serviceName: '跨省物流',
      route: '上海-北京',
      capacity: '10吨',
      price: '500元/吨',
      description: '次日达',
      contactPerson: '李大华',
      contactPhone: '13987654321',
      address: '北京市朝阳区建国路',
      status: '待审核',
    },
  ]);

  const filteredLogisticsData = logisticsData.filter(item =>
    item.serviceName.includes(logisticsSearchTerm) ||
    item.route.includes(logisticsSearchTerm)
  );

  const handleLogisticsApprove = (key: string) => {
    setLogisticsData(logisticsData.map(item =>
      item.key === key ? { ...item, status: '已同意' } : item
    ));
  };

  const handleLogisticsReject = (key: string) => {
    setLogisticsData(logisticsData.map(item =>
      item.key === key ? { ...item, status: '已拒绝' } : item
    ));
  };

  const handleLogisticsView = (key: string) => {
    console.log('查看物流服务', key);
    // TODO: Implement view logic
  };

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
    return matchesSearch && matchesEducation && matchesWorkYears;
  });

  const handleHrView = (key: string) => {
    // Implement view logic here, e.g., open a modal with details
    alert(`查看用人需求: ${key}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">服务审核</h2>
      <div className="flex items-center gap-2 mb-4">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择审核类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="financial">金融产品审核</SelectItem>
            <SelectItem value="logistics">物流服务审核</SelectItem>
            <SelectItem value="hr">用人需求审核</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeTab === 'financial' && (
        <div className="space-y-4">
          <div className="mb-4 flex space-x-4">
            <Input
              placeholder="搜索产品名称/合作银行"
              prefix={<Search className="h-4 w-4" />}
              style={{ width: 200 }}
              value={financialSearchTerm}
              onChange={setFinancialSearchTerm}
            />
            <Button type="primary">搜索</Button>
          </div>
          <Table columns={financialColumns} data={filteredFinancialData} pagination={false} />
        </div>
      )}

      {activeTab === 'logistics' && (
        <div className="space-y-4">
          <div className="mb-4 flex space-x-4">
            <Input
              placeholder="搜索服务名称/运输路线"
              prefix={<Search className="h-4 w-4" />}
              style={{ width: 200 }}
              value={logisticsSearchTerm}
              onChange={setLogisticsSearchTerm}
            />
            <Button type="primary">搜索</Button>
          </div>
          <Table columns={logisticsColumns} data={filteredLogisticsData} pagination={false} />
        </div>
      )}

      {activeTab === 'hr' && (
        <div className="space-y-4">
          <div className="mb-4 flex space-x-4">
            <Input
              placeholder="搜索姓名/求职意向"
              prefix={<Search className="h-4 w-4" />}
              style={{ width: 200 }}
              value={hrSearchTerm}
              onChange={setHrSearchTerm}
            />
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
      )}
    </div>
  );
};

export default ServiceReview;