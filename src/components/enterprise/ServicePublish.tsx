import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';
import { Upload, Save } from 'lucide-react';

export function ServicePublish() {
  const [financeForm, setFinanceForm] = useState({
    name: '',
    type: '',
    rate: '',
    amountRange: '',
    bank: '',
    loanTerm: '',
    requirements: '',
    description: '',
  });

  const [logisticsForm, setLogisticsForm] = useState({
    name: '',
    route: '',
    capacity: '',
    price: '',
    logo: '',
    contactNumber: '',
    address: '',
    serviceTags: '',
    description: '',
  });

  const [hrForm, setHrForm] = useState({
    position: '',
    companyName: '',
    salary: '',
    workLocation: '',
    experienceRequirements: '',
    educationRequirements: '',
    jobResponsibilities: '',
    contactNumber: '',
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFinanceSubmit = () => {
    if (!financeForm.name || !financeForm.type || !financeForm.rate || !financeForm.amountRange || !financeForm.bank || !financeForm.loanTerm || !financeForm.requirements) {
      toast.error('请填写所有必填项');
      return;
    }
    toast.success('金融服务已发布');
    setFinanceForm({ name: '', type: '', rate: '', amountRange: '', bank: '', loanTerm: '', requirements: '', description: '' });
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
      salary: '',
      workLocation: '',
      experienceRequirements: '',
      educationRequirements: '',
      jobResponsibilities: '',
      contactNumber: '',
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogisticsForm({ ...logisticsForm, logo: file.name });
    }
  };

  const handleLogisticsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logisticsForm.name || !logisticsForm.route || !logisticsForm.capacity || !logisticsForm.price || !logisticsForm.logo || !logisticsForm.contactNumber || !logisticsForm.address || !logisticsForm.serviceTags || !logisticsForm.description) {
      toast.error("请填写所有必填项");
      return;
    }
    console.log("提交物流服务:", logisticsForm);
    toast.success("物流服务发布成功");
    setLogisticsForm({
      name: '',
      route: '',
      capacity: '',
      price: '',
      logo: '',
      contactNumber: '',
      address: '',
      serviceTags: '',
      description: '',
    });
  };

  const handleHrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hrForm.position || !hrForm.companyName || !hrForm.workLocation || !hrForm.jobResponsibilities || !hrForm.contactNumber) {
      toast.error('请填写所有必填项');
      return;
    }
    toast.success('用人需求已发布');
    setHrForm({
      position: '',
      companyName: '',
      salary: '',
      workLocation: '',
      experienceRequirements: '',
      educationRequirements: '',
      jobResponsibilities: '',
      contactNumber: '',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">服务发布</h1>
        <p className="text-slate-500 mt-1">发布您的金融、物流、人力资源服务</p>
      </div>

      <Tabs defaultValue="finance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="finance">金融服务</TabsTrigger>
          <TabsTrigger value="logistics">物流服务</TabsTrigger>
          <TabsTrigger value="hr">用人需求</TabsTrigger>
        </TabsList>

        <TabsContent value="finance">
          <Card>
            <CardHeader>
              <CardTitle>发布金融服务</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="finance-name">服务名称 *</Label>
                  <Input
                    id="finance-name"
                    value={financeForm.name}
                    onChange={(e) => setFinanceForm({ ...financeForm, name: e.target.value })}
                    placeholder="请输入服务名称"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="finance-type">服务类型 *</Label>
                    <Select value={financeForm.type} onValueChange={(value) => setFinanceForm({ ...financeForm, type: value })}>
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
                  <div className="grid gap-2">
                    <Label htmlFor="finance-rate">利率 *</Label>
                    <Input
                      id="finance-rate"
                      value={financeForm.rate}
                      onChange={(e) => setFinanceForm({ ...financeForm, rate: e.target.value })}
                      placeholder="如：4.5%"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="finance-amount-range">额度范围</Label>
                  <Input
                    id="finance-amount-range"
                    value={financeForm.amountRange}
                    onChange={(e) => setFinanceForm({ ...financeForm, amountRange: e.target.value })}
                    placeholder="如：10万-100万"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="finance-bank">合作银行</Label>
                  <Input
                    id="finance-bank"
                    value={financeForm.bank}
                    onChange={(e) => setFinanceForm({ ...financeForm, bank: e.target.value })}
                    placeholder="如：招商银行"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="finance-loan-term">贷款期限</Label>
                  <Input
                    id="finance-loan-term"
                    value={financeForm.loanTerm}
                    onChange={(e) => setFinanceForm({ ...financeForm, loanTerm: e.target.value })}
                    placeholder="如：1年"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="finance-requirements">申请要求</Label>
                  <Textarea
                    id="finance-requirements"
                    value={financeForm.requirements}
                    onChange={(e) => setFinanceForm({ ...financeForm, requirements: e.target.value })}
                    placeholder="请输入申请要求"
                    rows={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="finance-description">服务描述</Label>
                  <Textarea
                    id="finance-description"
                    value={financeForm.description}
                    onChange={(e) => setFinanceForm({ ...financeForm, description: e.target.value })}
                    placeholder="请输入服务描述"
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="finance-file">附件上传</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-[#1E3A8A] transition-colors cursor-pointer">
                    <input
                      id="finance-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="finance-file" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-slate-600">点击或拖拽文件到此处上传</p>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-[#1E3A8A] h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
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
                  <Button onClick={handleFinanceSubmit} className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                    立即发布
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logistics">
          <Card>
            <CardHeader>
              <CardTitle>发布物流服务</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="logistics-logo">企业Logo</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-[#1E3A8A] transition-colors cursor-pointer">
                    <input
                      id="logistics-logo"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="logistics-logo" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-slate-600">点击或拖拽文件到此处上传</p>
                      {logisticsForm.logo && <p className="text-sm text-slate-500 mt-2">已选择文件: {logisticsForm.logo}</p>}
                    </label>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logistics-name">服务名称 *</Label>
                  <Input
                    id="logistics-name"
                    value={logisticsForm.name}
                    onChange={(e) => setLogisticsForm({ ...logisticsForm, name: e.target.value })}
                    placeholder="请输入服务名称"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logistics-route">运输路线 *</Label>
                  <Input
                    id="logistics-route"
                    value={logisticsForm.route}
                    onChange={(e) => setLogisticsForm({ ...logisticsForm, route: e.target.value })}
                    placeholder="如：重庆 → 上海"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="logistics-capacity">运输能力</Label>
                    <Input
                      id="logistics-capacity"
                      value={logisticsForm.capacity}
                      onChange={(e) => setLogisticsForm({ ...logisticsForm, capacity: e.target.value })}
                      placeholder="如：50吨"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="logistics-price">价格</Label>
                    <Input
                      id="logistics-price"
                      value={logisticsForm.price}
                      onChange={(e) => setLogisticsForm({ ...logisticsForm, price: e.target.value })}
                      placeholder="如：¥5000"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logistics-contact">联系电话</Label>
                  <Input
                    id="logistics-contact"
                    value={logisticsForm.contactNumber}
                    onChange={(e) => setLogisticsForm({ ...logisticsForm, contactNumber: e.target.value })}
                    placeholder="请输入联系电话"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logistics-address">地址</Label>
                  <Input
                    id="logistics-address"
                    value={logisticsForm.address}
                    onChange={(e) => setLogisticsForm({ ...logisticsForm, address: e.target.value })}
                    placeholder="请输入地址"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logistics-tags">服务标签</Label>
                  <Input
                    id="logistics-tags"
                    value={logisticsForm.serviceTags}
                    onChange={(e) => setLogisticsForm({ ...logisticsForm, serviceTags: e.target.value })}
                    placeholder="如：快递服务、仓储服务、冷链物流"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="logistics-description">服务描述</Label>
                  <Textarea
                    id="logistics-description"
                    value={logisticsForm.description}
                    onChange={(e) => setLogisticsForm({ ...logisticsForm, description: e.target.value })}
                    placeholder="请输入服务描述"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    保存草稿
                  </Button>
                  <Button onClick={handleLogisticsSubmit} className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                    立即发布
                  </Button>
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
    </div>
  );
}