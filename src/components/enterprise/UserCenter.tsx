import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default function UserCenter() {
  const [userData, setUserData] = useState({
    username: '企业管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    companyRole: '管理员',
  });

  const [adminApplication, setAdminApplication] = useState({
    company: '',
    name: '',
    contact: '',
    position: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleAdminApplicationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setAdminApplication((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 在这里处理表单提交逻辑，例如发送到后端API
    console.log('User data submitted:', userData);
    alert('用户信息已保存！');
  };

  const handleApplyAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Admin application submitted:', adminApplication);
    alert('管理员账号申请已提交！');
    setAdminApplication({
      company: '',
      name: '',
      contact: '',
      position: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>用户中心</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              value={userData.username}
              onChange={handleChange}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">电话</Label>
            <Input
              id="phone"
              type="tel"
              value={userData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="companyRole">公司角色</Label>
            <Input
              id="companyRole"
              value={userData.companyRole}
              onChange={handleChange}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <Button type="submit">保存更改</Button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">申请管理员账号</h3>
          <form onSubmit={handleApplyAdminSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="company">所在公司</Label>
              <Input
                id="company"
                value={adminApplication.company}
                onChange={handleAdminApplicationChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">申请人名称</Label>
              <Input
                id="name"
                value={adminApplication.name}
                onChange={handleAdminApplicationChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">联系电话</Label>
              <Input
                id="contact"
                type="tel"
                value={adminApplication.contact}
                onChange={handleAdminApplicationChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">职位</Label>
              <Input
                id="position"
                value={adminApplication.position}
                onChange={handleAdminApplicationChange}
                required
              />
            </div>
            <Button type="submit">提交申请</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}