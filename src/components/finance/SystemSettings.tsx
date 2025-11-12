import React, { useState } from 'react';
import { Tabs, TabsContent } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('adminAccount');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">系统设置</h1>
        <p className="text-slate-500 mt-1">管理金融办管理系统的各项配置</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Select onValueChange={setActiveTab} defaultValue={activeTab}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择设置类别" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adminAccount">申请管理员账号</SelectItem>
            <SelectItem value="notifications">通知设置</SelectItem>
          </SelectContent>
        </Select>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>通用设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="language">语言</Label>
                <Input id="language" defaultValue="中文" className="w-1/2" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">主题</Label>
                <Input id="theme" defaultValue="亮色" className="w-1/2" />
              </div>
              <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">保存更改</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">邮件通知</Label>
                <Input id="emailNotifications" defaultValue="已启用" className="w-1/2" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications">短信通知</Label>
                <Input id="smsNotifications" defaultValue="已启用" className="w-1/2" />
              </div>
              <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">保存更改</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">修改密码</Label>
                <Button variant="outline">修改</Button>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="twoFactorAuth">两步验证</Label>
                <Input id="twoFactorAuth" defaultValue="已禁用" className="w-1/2" />
              </div>
              <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">保存更改</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="adminAccount">
              <Card>
                <CardHeader>

                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminAccount">管理员账号</Label>
                    <Input id="adminAccount" placeholder="请输入新管理员的账号" defaultValue="" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">密码</Label>
                    <Input id="password" type="password" placeholder="请输入密码" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicantUnit">申请人所在单位</Label>
                    <Input id="applicantUnit" placeholder="请输入申请人所在单位" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicantName">申请人名称</Label>
                    <Input id="applicantName" placeholder="请输入申请人名称" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">联系电话</Label>
                    <Input id="contactPhone" placeholder="请输入联系电话" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">职位</Label>
                    <Input id="position" placeholder="请输入职位" />
                  </div>
                  <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">提交申请</Button>
                </CardContent>
              </Card>
            </TabsContent>
      </Tabs>
    </div>
  );
}