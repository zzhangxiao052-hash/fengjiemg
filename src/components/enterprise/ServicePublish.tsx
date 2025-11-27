import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { Upload, Save, Edit, Trash2, Search, Eye, ArrowDownCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

export function ServicePublish() {
  // Service Management State
  const [services, setServices] = useState([
    {
      id: '1',
      name: '金融需求：重庆科技有限公司需30万贷款',
      type: '金融需求',
      status: '已发布',
      date: '2024-10-16',
    },
    {
      id: '2',
      name: '金融需求：奉节农业发展公司需100万贷款',
      type: '金融需求',
      status: '已发布',
      date: '2024-10-15',
    },
    {
      id: '3',
      name: '物流需求：奉节→北京 5吨',
      type: '物流需求',
      status: '已发布',
      date: '2024-10-14',
    },
    {
      id: '4',
      name: '物流需求：奉节→成都 40方',
      type: '物流需求',
      status: '草稿',
      date: '2024-10-13',
    },
  ]);

  const [recruitmentPositions, setRecruitmentPositions] = useState([
    {
      id: '1',
      name: '前端开发工程师',
      company: '奉节县XX科技有限公司',
      status: '招聘中',
      applicants: 15,
    },
    {
      id: '2',
      name: 'UI/UX设计师',
      company: '奉节县YY物流有限公司',
      status: '已下架',
      applicants: 8,
    },
    {
      id: '3',
      name: '市场营销经理',
      company: '奉节县ZZ农业发展有限公司',
      status: '招聘中',
      applicants: 22,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleEdit = (id: string) => {
    toast.info(`编辑服务: ${id}`);
  };

  const handleDelete = (id: string) => {
    setServices(services.filter(service => service.id !== id));
    toast.success(`服务 ${id} 已删除`);
  };

  const handleView = (service: any) => {
    setSelectedService(service);
    setIsViewOpen(true);
  };

  const handleRecruitmentView = (position: { name: string }) => {
    toast.info(`查看岗位: ${position.name}`);
  };

  const handleRecruitmentEdit = (id: string) => {
    toast.info(`编辑岗位: ${id}`);
  };

  const handleRecruitmentOffline = (id: string) => {
    setRecruitmentPositions(recruitmentPositions.map(p => 
      p.id === id ? { ...p, status: '已下架' } : p
    ));
    toast.success('岗位已下架');
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.type.includes(searchTerm)
  );

  // Service Publish State
  const [financeForm, setFinanceForm] = useState({
    companyName: '',
    financingType: '',
    amount: '',
    purpose: '',
    expectedRateRange: '',
    expectedTerm: '',
    contactName: '',
    contactPhone: '',
    description: '',
  });

  const [logisticsForm, setLogisticsForm] = useState({
    companyName: '',
    origin: '',
    destination: '',
    goodsType: '',
    weight: '',
    volume: '',
    departureDate: '',
    expectedPriceRange: '',
    requirements: '',
    contactName: '',
    contactPhone: '',
    description: '',
  });

  const [hrForm, setHrForm] = useState({
    position: '',
    companyName: '',
    jobType: '',
    salary: '',
    workLocation: '',
    experienceRequirements: '',
    educationRequirements: '',
    jobResponsibilities: '',
    contactNumber: '',
  });

  const [financeAttachment, setFinanceAttachment] = useState('');
  const [financeUploadProgress, setFinanceUploadProgress] = useState(0);

  const handleFinanceSubmit = () => {
    if (!financeForm.companyName || !financeForm.amount || !financeForm.financingType || !financeForm.expectedTerm || !financeForm.contactPhone) {
      toast.error('请填写企业名称、需求金额、需求类型、期望期限、联系电话');
      return;
    }
    const title = `金融需求：${financeForm.companyName}${financeForm.amount ? `需${financeForm.amount}` : ''}${financeForm.financingType ? financeForm.financingType : ''}`;
    const newItem = {
      id: String(services.length + 1),
      name: title,
      type: '金融需求',
      status: '已发布',
      date: new Date().toISOString().split('T')[0],
    };
    setServices([newItem, ...services]);
    toast.success('金融需求已发布');
    setFinanceForm({ companyName: '', financingType: '', amount: '', purpose: '', expectedRateRange: '', expectedTerm: '', contactName: '', contactPhone: '', description: '' });
    setFinanceAttachment('');
    setFinanceUploadProgress(0);
  };

  const handleHRSubmit = () => {
    if (!hrForm.position || !hrForm.companyName || !hrForm.workLocation || !hrForm.jobResponsibilities || !hrForm.contactNumber) {
      toast.error('请填写所有必填项');
      return;
    }
    toast.success('用人需求已发布');
    setHrForm({
      position: '',
      companyName: '',
      jobType: '',
      salary: '',
      workLocation: '',
      experienceRequirements: '',
      educationRequirements: '',
      jobResponsibilities: '',
      contactNumber: '',
    });
  };

  const handleFinanceFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFinanceAttachment(file.name);
    setFinanceUploadProgress(1);
    const interval = setInterval(() => {
      setFinanceUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success('附件上传完成');
          return 100;
        }
        return prev + 7;
      });
    }, 120);
  };

  const handleLogisticsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logisticsForm.companyName || !logisticsForm.origin || !logisticsForm.destination || !logisticsForm.contactPhone) {
      toast.error('请填写企业名称、出发地、目的地、联系电话');
      return;
    }
    const title = `物流需求：${logisticsForm.origin}→${logisticsForm.destination}${logisticsForm.weight ? ` ${logisticsForm.weight}` : ''}`;
    const newItem = {
      id: String(services.length + 1),
      name: title,
      type: '物流需求',
      status: '已发布',
      date: new Date().toISOString().split('T')[0],
    };
    setServices([newItem, ...services]);
    toast.success('物流需求已发布');
    setLogisticsForm({ companyName: '', origin: '', destination: '', goodsType: '', weight: '', volume: '', departureDate: '', expectedPriceRange: '', requirements: '', contactName: '', contactPhone: '', description: '' });
  };

  const renderServiceDetails = (service: any) => {
    if (!service) return null;

    if (service.type === '金融需求') {
      return (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-slate-500">服务名称</Label><p className="font-medium">{service.name}</p></div>
            <div><Label className="text-slate-500">服务类型</Label><p className="font-medium">{service.type}</p></div>
          </div>
          <div><Label className="text-slate-500">描述</Label><p className="font-medium mt-1">{service.description || '—'}</p></div>
        </div>
      );
    } else if (service.type === '物流需求') {
      return (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-slate-500">服务名称</Label><p className="font-medium">{service.name}</p></div>
            <div><Label className="text-slate-500">服务类型</Label><p className="font-medium">{service.type}</p></div>
          </div>
          <div><Label className="text-slate-500">描述</Label><p className="font-medium mt-1">{service.description || '—'}</p></div>
        </div>
      );
    } else if (service.type === '用人需求') {
      return (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-slate-500">岗位名称</Label><p className="font-medium">{service.position}</p></div>
            <div><Label className="text-slate-500">公司名称</Label><p className="font-medium">{service.companyName}</p></div>
            <div><Label className="text-slate-500">工种</Label><p className="font-medium">{service.jobType}</p></div>
            <div><Label className="text-slate-500">薪资待遇</Label><p className="font-medium">{service.salary}</p></div>
            <div><Label className="text-slate-500">工作地点</Label><p className="font-medium">{service.workLocation}</p></div>
            <div><Label className="text-slate-500">经验要求</Label><p className="font-medium">{service.experienceRequirements}</p></div>
            <div><Label className="text-slate-500">学历要求</Label><p className="font-medium">{service.educationRequirements}</p></div>
            <div><Label className="text-slate-500">联系电话</Label><p className="font-medium">{service.contactNumber}</p></div>
          </div>
          <div><Label className="text-slate-500">岗位职责</Label><p className="font-medium mt-1">{service.jobResponsibilities}</p></div>
        </div>
      );
    }
    return <p>暂无详情</p>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">需求发布与管理</h1>
        <p className="text-slate-500 mt-1">发布新需求或管理已发布的需求</p>
      </div>

      <Tabs defaultValue="management" className="space-y-4">
        <TabsList>
          <TabsTrigger value="management">需求管理</TabsTrigger>
          <TabsTrigger value="publish">需求发布</TabsTrigger>
        </TabsList>

        <TabsContent value="management">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>已发布服务</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="搜索服务名称或类型..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[250px]"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>服务名称</TableHead>
                    <TableHead>服务类型</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>发布日期</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>{service.type}</TableCell>
                        <TableCell>{service.status}</TableCell>
                        <TableCell>{service.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleView(service)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>查看详情</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleEdit(service.id)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>编辑服务</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>删除服务</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        未找到相关服务
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>招聘管理 - 岗位列表</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>岗位名称</TableHead>
                    <TableHead>公司</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>申请人数</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recruitmentPositions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-medium">{position.name}</TableCell>
                      <TableCell>{position.company}</TableCell>
                      <TableCell>{position.status}</TableCell>
                      <TableCell>{position.applicants}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleRecruitmentView(position)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>查看详情</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          {position.status === '招聘中' && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => handleRecruitmentEdit(position.id)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>编辑岗位</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => handleRecruitmentOffline(position.id)}>
                                      <ArrowDownCircle className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>下架岗位</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publish">
          <Tabs defaultValue="finance" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="finance">金融需求</TabsTrigger>
              <TabsTrigger value="logistics">物流需求</TabsTrigger>
              <TabsTrigger value="hr">用人需求</TabsTrigger>
            </TabsList>

            <TabsContent value="finance">
              <Card>
                <CardHeader>
                  <CardTitle>发布金融需求</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fd-company">企业名称 *</Label>
                      <Input id="fd-company" value={financeForm.companyName} onChange={(e) => setFinanceForm({ ...financeForm, companyName: e.target.value })} placeholder="请输入企业名称" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fd-amount">需求金额 *</Label>
                        <Input id="fd-amount" value={financeForm.amount} onChange={(e) => setFinanceForm({ ...financeForm, amount: e.target.value })} placeholder="如：30万" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="fd-type">需求类型 *</Label>
                        <Select value={financeForm.financingType} onValueChange={(value: string) => setFinanceForm({ ...financeForm, financingType: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="选择类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="贷款">贷款</SelectItem>
                            <SelectItem value="担保">担保</SelectItem>
                            <SelectItem value="咨询">咨询</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fd-purpose">资金用途</Label>
                      <Textarea id="fd-purpose" value={financeForm.purpose} onChange={(e) => setFinanceForm({ ...financeForm, purpose: e.target.value })} placeholder="如：用于流动资金周转" rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fd-rate">期望利率范围</Label>
                        <Input id="fd-rate" value={financeForm.expectedRateRange} onChange={(e) => setFinanceForm({ ...financeForm, expectedRateRange: e.target.value })} placeholder="如：3%-5%" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="fd-term">期望贷款期限 *</Label>
                        <Input id="fd-term" value={financeForm.expectedTerm} onChange={(e) => setFinanceForm({ ...financeForm, expectedTerm: e.target.value })} placeholder="如：12个月" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fd-contact-name">联系人姓名</Label>
                        <Input id="fd-contact-name" value={financeForm.contactName} onChange={(e) => setFinanceForm({ ...financeForm, contactName: e.target.value })} placeholder="请输入联系人姓名" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="fd-contact-phone">联系电话 *</Label>
                        <Input id="fd-contact-phone" value={financeForm.contactPhone} onChange={(e) => setFinanceForm({ ...financeForm, contactPhone: e.target.value })} placeholder="请输入联系电话" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fd-desc">详细描述</Label>
                      <Textarea id="fd-desc" value={financeForm.description} onChange={(e) => setFinanceForm({ ...financeForm, description: e.target.value })} placeholder="请输入需求详细描述" rows={4} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fd-file">附件上传</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-[#1E3A8A] transition-colors cursor-pointer">
                        <input id="fd-file" type="file" className="hidden" onChange={handleFinanceFileUpload} />
                        <label htmlFor="fd-file" className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                          <p className="text-slate-600">点击或拖拽文件到此处上传</p>
                          {financeUploadProgress > 0 && financeUploadProgress < 100 && (
                            <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                              <div className="bg-[#1E3A8A] h-2 rounded-full" style={{ width: `${financeUploadProgress}%` }}></div>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        保存草稿
                      </Button>
                      <Button onClick={handleFinanceSubmit} className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">立即发布</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logistics">
              <Card>
                <CardHeader>
                  <CardTitle>发布物流需求</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="ld-company">企业名称 *</Label>
                      <Input id="ld-company" value={logisticsForm.companyName} onChange={(e) => setLogisticsForm({ ...logisticsForm, companyName: e.target.value })} placeholder="请输入企业名称" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="ld-origin">出发地 *</Label>
                        <Input id="ld-origin" value={logisticsForm.origin} onChange={(e) => setLogisticsForm({ ...logisticsForm, origin: e.target.value })} placeholder="如：奉节" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="ld-destination">目的地 *</Label>
                        <Input id="ld-destination" value={logisticsForm.destination} onChange={(e) => setLogisticsForm({ ...logisticsForm, destination: e.target.value })} placeholder="如：北京" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="ld-goods-type">货物类型</Label>
                        <Input id="ld-goods-type" value={logisticsForm.goodsType} onChange={(e) => setLogisticsForm({ ...logisticsForm, goodsType: e.target.value })} placeholder="如：电子产品" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="ld-weight">重量</Label>
                        <Input id="ld-weight" value={logisticsForm.weight} onChange={(e) => setLogisticsForm({ ...logisticsForm, weight: e.target.value })} placeholder="如：5吨" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="ld-volume">体积</Label>
                        <Input id="ld-volume" value={logisticsForm.volume} onChange={(e) => setLogisticsForm({ ...logisticsForm, volume: e.target.value })} placeholder="如：40方" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="ld-departure">预计发货时间</Label>
                        <Input id="ld-departure" value={logisticsForm.departureDate} onChange={(e) => setLogisticsForm({ ...logisticsForm, departureDate: e.target.value })} placeholder="如：2024-12-01" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ld-price">期望价格范围</Label>
                      <Input id="ld-price" value={logisticsForm.expectedPriceRange} onChange={(e) => setLogisticsForm({ ...logisticsForm, expectedPriceRange: e.target.value })} placeholder="如：¥3000-¥5000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ld-req">特殊要求</Label>
                      <Textarea id="ld-req" value={logisticsForm.requirements} onChange={(e) => setLogisticsForm({ ...logisticsForm, requirements: e.target.value })} placeholder="如：需要冷链运输" rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="ld-contact-name">联系人姓名</Label>
                        <Input id="ld-contact-name" value={logisticsForm.contactName} onChange={(e) => setLogisticsForm({ ...logisticsForm, contactName: e.target.value })} placeholder="请输入联系人姓名" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="ld-contact-phone">联系电话 *</Label>
                        <Input id="ld-contact-phone" value={logisticsForm.contactPhone} onChange={(e) => setLogisticsForm({ ...logisticsForm, contactPhone: e.target.value })} placeholder="请输入联系电话" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ld-desc">详细描述</Label>
                      <Textarea id="ld-desc" value={logisticsForm.description} onChange={(e) => setLogisticsForm({ ...logisticsForm, description: e.target.value })} placeholder="请输入需求详细描述" rows={4} />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        保存草稿
                      </Button>
                      <Button onClick={handleLogisticsSubmit} className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">立即发布</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hr">
              <Card>
                <CardHeader>
                  <CardTitle>发布用人需求</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="hr-position">岗位名称 *</Label>
                      <Input
                        id="hr-position"
                        value={hrForm.position}
                        onChange={(e) => setHrForm({ ...hrForm, position: e.target.value })}
                        placeholder="请输入岗位名称"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hr-company-name">公司名称 *</Label>
                      <Input
                        id="hr-company-name"
                        value={hrForm.companyName}
                        onChange={(e) => setHrForm({ ...hrForm, companyName: e.target.value })}
                        placeholder="请输入公司名称"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hr-job-type">工种</Label>
                      <Select value={hrForm.jobType} onValueChange={(value: string) => setHrForm({ ...hrForm, jobType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择工种" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="前端开发">前端开发</SelectItem>
                          <SelectItem value="后端开发">后端开发</SelectItem>
                          <SelectItem value="机械工程">机械工程</SelectItem>
                          <SelectItem value="市场运营">市场运营</SelectItem>
                          <SelectItem value="仓储管理">仓储管理</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hr-salary">薪资待遇</Label>
                      <Input
                        id="hr-salary"
                        value={hrForm.salary}
                        onChange={(e) => setHrForm({ ...hrForm, salary: e.target.value })}
                        placeholder="如：8K-12K"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hr-work-location">工作地点 *</Label>
                      <Input
                        id="hr-work-location"
                        value={hrForm.workLocation}
                        onChange={(e) => setHrForm({ ...hrForm, workLocation: e.target.value })}
                        placeholder="请输入工作地点"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hr-experience-requirements">经验要求</Label>
                      <Input
                        id="hr-experience-requirements"
                        value={hrForm.experienceRequirements}
                        onChange={(e) => setHrForm({ ...hrForm, experienceRequirements: e.target.value })}
                        placeholder="如：3-5年"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hr-education-requirements">学历要求</Label>
                      <Input
                        id="hr-education-requirements"
                        value={hrForm.educationRequirements}
                        onChange={(e) => setHrForm({ ...hrForm, educationRequirements: e.target.value })}
                        placeholder="如：本科及以上"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hr-job-responsibilities">岗位职责 *</Label>
                      <Textarea
                        id="hr-job-responsibilities"
                        value={hrForm.jobResponsibilities}
                        onChange={(e) => setHrForm({ ...hrForm, jobResponsibilities: e.target.value })}
                        placeholder="请输入岗位职责"
                        rows={4}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="hr-contact-number">联系电话 *</Label>
                      <Input
                        id="hr-contact-number"
                        value={hrForm.contactNumber}
                        onChange={(e) => setHrForm({ ...hrForm, contactNumber: e.target.value })}
                        placeholder="请输入联系电话"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        保存草稿
                      </Button>
                      <Button onClick={handleHRSubmit} className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                        立即发布
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>服务详情</DialogTitle>
            <DialogDescription>
              查看服务的详细信息
            </DialogDescription>
          </DialogHeader>
          {renderServiceDetails(selectedService)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
