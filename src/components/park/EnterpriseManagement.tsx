import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, Edit, Trash, Eye } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import DynamicManagement from './DynamicManagement';

interface Enterprise {
  id: string;
  enterpriseName: string;
  username: string;
  password?: string;
  isVerified: boolean;
  region: string;
  enterpriseSummary: string;
  socialCreditCode: string;
  registeredCapital: string;
  mainBusiness: string;
  industry: string;
  enterpriseScale: string;
  enterpriseAddress: string;
  intendedPark: string;
  expectedMoveInDate: string;
  contactPersonName: string;
  contactPersonPosition: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  additionalNotes: string;
}

const EnterpriseManagement: React.FC = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([
    // Sample data
    {
      id: '1',
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
      intendedPark: '张江高科园区',
      expectedMoveInDate: '2024-01-01',
      contactPersonName: '张三',
      contactPersonPosition: '销售经理',
      contactPersonPhone: '13800138000',
      contactPersonEmail: 'zhangsan@example.com',
      additionalNotes: '无',
    },
    {
      id: '2',
      enterpriseName: '示例企业B',
      username: 'userB',
      isVerified: false,
      region: '北京',
      enterpriseSummary: '专注于人工智能研发',
      socialCreditCode: '911100008888888888',
      registeredCapital: '500万',
      mainBusiness: 'AI解决方案',
      industry: '人工智能',
      enterpriseScale: '小型',
      enterpriseAddress: '北京市海淀区',
      intendedPark: '中关村软件园',
      expectedMoveInDate: '2024-02-15',
      contactPersonName: '李四',
      contactPersonPosition: '技术总监',
      contactPersonPhone: '13911112222',
      contactPersonEmail: 'lisi@example.com',
      additionalNotes: '需要更多技术支持',
    },
    {
      id: '3',
      enterpriseName: '示例企业C',
      username: 'userC',
      isVerified: true,
      region: '广州',
      enterpriseSummary: '电商平台运营',
      socialCreditCode: '914401019999999999',
      registeredCapital: '2000万',
      mainBusiness: '在线销售',
      industry: '电子商务',
      enterpriseScale: '大型',
      enterpriseAddress: '广州市天河区',
      intendedPark: '广州科学城',
      expectedMoveInDate: '2024-03-10',
      contactPersonName: '王五',
      contactPersonPosition: '运营总监',
      contactPersonPhone: '13733334444',
      contactPersonEmail: 'wangwu@example.com',
      additionalNotes: '希望扩大市场份额',
    },
    {
      id: '4',
      enterpriseName: '示例企业D',
      username: 'userD',
      isVerified: false,
      region: '深圳',
      enterpriseSummary: '物联网设备制造商',
      socialCreditCode: '914403001111111111',
      registeredCapital: '800万',
      mainBusiness: '智能硬件',
      industry: '物联网',
      enterpriseScale: '中型',
      enterpriseAddress: '深圳市南山区',
      intendedPark: '深圳湾科技园',
      expectedMoveInDate: '2024-04-20',
      contactPersonName: '赵六',
      contactPersonPosition: '研发经理',
      contactPersonPhone: '13655556666',
      contactPersonEmail: 'zhaoliu@example.com',
      additionalNotes: '寻求技术合作',
    },
    {
      id: '5',
      enterpriseName: '示例企业E',
      username: 'userE',
      isVerified: true,
      region: '杭州',
      enterpriseSummary: '大数据分析服务',
      socialCreditCode: '913301002222222222',
      registeredCapital: '1500万',
      mainBusiness: '数据服务',
      industry: '大数据',
      enterpriseScale: '中型',
      enterpriseAddress: '杭州市滨江区',
      intendedPark: '杭州高新区',
      expectedMoveInDate: '2024-05-01',
      contactPersonName: '孙七',
      contactPersonPosition: '数据科学家',
      contactPersonPhone: '13577778888',
      contactPersonEmail: 'sunqi@example.com',
      additionalNotes: '对云计算有需求',
    },
    {
      id: '6',
      enterpriseName: '示例企业F',
      username: 'userF',
      isVerified: false,
      region: '武汉',
      enterpriseSummary: '在线教育平台',
      socialCreditCode: '914201003333333333',
      registeredCapital: '700万',
      mainBusiness: '教育培训',
      industry: '在线教育',
      enterpriseScale: '小型',
      enterpriseAddress: '武汉市洪山区',
      intendedPark: '光谷软件园',
      expectedMoveInDate: '2024-06-10',
      contactPersonName: '周八',
      contactPersonPosition: '课程顾问',
      contactPersonPhone: '13499990000',
      contactPersonEmail: 'zhouba@example.com',
      additionalNotes: '希望拓展K12业务',
    },
  ]);

  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [currentEnterprise, setCurrentEnterprise] = useState<Enterprise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeManagementType, setActiveManagementType] = useState('enterprise-management');

  const handleAddEdit = (enterprise?: Enterprise) => {
    setCurrentEnterprise(enterprise || {
      id: '',
      enterpriseName: '',
      username: '',
      password: '',
      isVerified: false,
      region: '',
      enterpriseSummary: '',
      socialCreditCode: '',
      registeredCapital: '',
      mainBusiness: '',
      industry: '',
      enterpriseScale: '',
      enterpriseAddress: '',
      intendedPark: '',
      expectedMoveInDate: '',
      contactPersonName: '',
      contactPersonPosition: '',
      contactPersonPhone: '',
      contactPersonEmail: '',
      additionalNotes: '',
    });
    setShowAddEditDialog(true);
  };

  const handleView = (enterprise: Enterprise) => {
    setCurrentEnterprise(enterprise);
    setShowViewDialog(true);
  };

  const handleDelete = (id: string) => {
    setEnterprises(enterprises.filter(e => e.id !== id));
  };

  const handleSave = () => {
    if (currentEnterprise) {
      if (currentEnterprise.id) {
        setEnterprises(enterprises.map(e => e.id === currentEnterprise.id ? currentEnterprise : e));
      } else {
        setEnterprises([...enterprises, { ...currentEnterprise, id: String(enterprises.length + 1) }]);
      }
      setShowAddEditDialog(false);
      setCurrentEnterprise(null);
    }
  };

  const filteredEnterprises = enterprises.filter(enterprise =>
    enterprise.enterpriseName.includes(searchTerm) ||
    enterprise.contactPersonName.includes(searchTerm) ||
    enterprise.region.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Select onValueChange={setActiveManagementType} defaultValue={activeManagementType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="选择管理模块" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enterprise-management">企业管理</SelectItem>
            <SelectItem value="dynamic-management">动态管理</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeManagementType === 'enterprise-management' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="搜索企业..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
              <Button><Search className="h-4 w-4 mr-2" />搜索</Button>
            </div>
            <Button onClick={() => handleAddEdit()}>新增企业</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>企业名称</TableHead>
                  <TableHead>用户名</TableHead>
                  <TableHead>联系人姓名</TableHead>
                  <TableHead>联系人电话</TableHead>
                  <TableHead>是否认证</TableHead>
                  <TableHead>地区</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnterprises.map(enterprise => (
                  <TableRow key={enterprise.id}>
                    <TableCell>{enterprise.enterpriseName}</TableCell>
                    <TableCell>{enterprise.username}</TableCell>
                    <TableCell>{enterprise.contactPersonName}</TableCell>
                    <TableCell>{enterprise.contactPersonPhone}</TableCell>
                    <TableCell>{enterprise.isVerified ? '是' : '否'}</TableCell>
                    <TableCell>{enterprise.region}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleView(enterprise)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleAddEdit(enterprise)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(enterprise.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {activeManagementType === 'dynamic-management' && (
        <DynamicManagement />
      )}

      <Dialog open={showAddEditDialog} onOpenChange={setShowAddEditDialog}>
        <DialogContent className="max-w-[800px] max-h-[75vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentEnterprise?.id ? '编辑企业' : '新增企业'}</DialogTitle>
          </DialogHeader>
          {currentEnterprise && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="enterpriseName">企业名称</Label>
                <Input
                  id="enterpriseName"
                  value={currentEnterprise.enterpriseName}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, enterpriseName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  value={currentEnterprise.username}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, username: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={currentEnterprise.password}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, password: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="isVerified">是否认证</Label>
                <Input
                  id="isVerified"
                  type="checkbox"
                  checked={currentEnterprise.isVerified}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, isVerified: e.target.checked })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="region">地区</Label>
                <Input
                  id="region"
                  value={currentEnterprise.region}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, region: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="enterpriseSummary">企业概要</Label>
                <Textarea
                  id="enterpriseSummary"
                  value={currentEnterprise.enterpriseSummary}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, enterpriseSummary: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="socialCreditCode">统一社会信用代码</Label>
                <Input
                  id="socialCreditCode"
                  value={currentEnterprise.socialCreditCode}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, socialCreditCode: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="registeredCapital">注册资本</Label>
                <Input
                  id="registeredCapital"
                  value={currentEnterprise.registeredCapital}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, registeredCapital: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mainBusiness">主营业务</Label>
                <Input
                  id="mainBusiness"
                  value={currentEnterprise.mainBusiness}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, mainBusiness: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">所属产业</Label>
                <Input
                  id="industry"
                  value={currentEnterprise.industry}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, industry: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="enterpriseScale">企业规模</Label>
                <Input
                  id="enterpriseScale"
                  value={currentEnterprise.enterpriseScale}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, enterpriseScale: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="enterpriseAddress">企业地址</Label>
                <Input
                  id="enterpriseAddress"
                  value={currentEnterprise.enterpriseAddress}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, enterpriseAddress: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="intendedPark">意向入驻园区</Label>
                <Input
                  id="intendedPark"
                  value={currentEnterprise.intendedPark}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, intendedPark: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expectedMoveInDate">预计入住信息</Label>
                <Input
                  id="expectedMoveInDate"
                  type="date"
                  value={currentEnterprise.expectedMoveInDate}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, expectedMoveInDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPersonName">联系人姓名</Label>
                <Input
                  id="contactPersonName"
                  value={currentEnterprise.contactPersonName}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, contactPersonName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPersonPosition">联系人职位</Label>
                <Input
                  id="contactPersonPosition"
                  value={currentEnterprise.contactPersonPosition}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, contactPersonPosition: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPersonPhone">联系人电话</Label>
                <Input
                  id="contactPersonPhone"
                  value={currentEnterprise.contactPersonPhone}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, contactPersonPhone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPersonEmail">联系人邮箱</Label>
                <Input
                  id="contactPersonEmail"
                  value={currentEnterprise.contactPersonEmail}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, contactPersonEmail: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="additionalNotes">补充说明</Label>
                <Textarea
                  id="additionalNotes"
                  value={currentEnterprise.additionalNotes}
                  onChange={(e) => setCurrentEnterprise({ ...currentEnterprise, additionalNotes: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEditDialog(false)}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-[800px] max-h-[75vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>企业详情</DialogTitle>
          </DialogHeader>
          {currentEnterprise && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <p><strong>企业名称:</strong> {currentEnterprise.enterpriseName}</p>
              <p><strong>用户名:</strong> {currentEnterprise.username}</p>
              <p><strong>密码:</strong> {currentEnterprise.password ? '******' : '未设置'}</p>
              <p><strong>联系人姓名:</strong> {currentEnterprise.contactPersonName}</p>
              <p><strong>是否认证:</strong> {currentEnterprise.isVerified ? '是' : '否'}</p>
              <p><strong>地区:</strong> {currentEnterprise.region}</p>
              <p><strong>企业概要:</strong> {currentEnterprise.enterpriseSummary}</p>
              <p><strong>统一社会信用代码:</strong> {currentEnterprise.socialCreditCode}</p>
              <p><strong>注册资本:</strong> {currentEnterprise.registeredCapital}</p>
              <p><strong>主营业务:</strong> {currentEnterprise.mainBusiness}</p>
              <p><strong>所属产业:</strong> {currentEnterprise.industry}</p>
              <p><strong>企业规模:</strong> {currentEnterprise.enterpriseScale}</p>
              <p><strong>企业地址:</strong> {currentEnterprise.enterpriseAddress}</p>
              <p><strong>意向入驻园区:</strong> {currentEnterprise.intendedPark}</p>
              <p><strong>预计入住信息:</strong> {currentEnterprise.expectedMoveInDate}</p>
              <p><strong>联系人姓名:</strong> {currentEnterprise.contactPersonName}</p>
              <p><strong>联系人职位:</strong> {currentEnterprise.contactPersonPosition}</p>
              <p><strong>联系人电话:</strong> {currentEnterprise.contactPersonPhone}</p>
              <p><strong>联系人邮箱:</strong> {currentEnterprise.contactPersonEmail}</p>
              <p><strong>补充说明:</strong> {currentEnterprise.additionalNotes}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnterpriseManagement;