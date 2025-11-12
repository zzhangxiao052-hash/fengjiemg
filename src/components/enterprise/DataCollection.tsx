import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { Save } from 'lucide-react';

export default function DataCollection() {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    scale: '',
    revenue: '',
    employees: '',
    address: '',
  });

  const handleSubmit = () => {
    toast.success('数据已保存');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">数据采集</h1>
        <p className="text-slate-500 mt-1">填写和更新企业基础数据</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>企业基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">企业名称</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="请输入企业名称"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="industry">所属行业</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择行业" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="制造业">制造业</SelectItem>
                    <SelectItem value="信息技术">信息技术</SelectItem>
                    <SelectItem value="金融">金融</SelectItem>
                    <SelectItem value="物流">物流</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scale">企业规模</Label>
                <Select value={formData.scale} onValueChange={(value) => setFormData({ ...formData, scale: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择规模" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="小型">小型</SelectItem>
                    <SelectItem value="中型">中型</SelectItem>
                    <SelectItem value="大型">大型</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="revenue">年营收（万元）</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  placeholder="请输入年营收"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employees">员工人数</Label>
                <Input
                  id="employees"
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                  placeholder="请输入员工人数"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">企业地址</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="请输入企业地址"
              />
            </div>
            <Button onClick={handleSubmit} className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              <Save className="h-4 w-4 mr-2" />
              保存数据
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
