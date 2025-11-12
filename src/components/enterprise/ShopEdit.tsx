import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface ShopEditProps {
  shopId: string;
  onBack: () => void;
}

export default function ShopEdit({ shopId, onBack }: ShopEditProps) {
  const [shopData, setShopData] = useState({
    id: shopId,
    companyName: '',
    address: '',
    contactPhone: '',
    email: '',
    businessLicense: '',
    qualificationCert: '',
    description: '',
  });

  useEffect(() => {
    // 模拟从后端获取数据
    const fetchShopData = () => {
      // 实际应用中，这里会调用API获取数据
      const mockData = {
        id: shopId,
        companyName: `模拟云商店铺 ${shopId}`,
        address: '重庆市奉节县XXX路XXX号',
        contactPhone: '13912345678',
        email: 'shop@example.com',
        businessLicense: '统一社会信用代码1234567890',
        qualificationCert: '资质证书编号XYZ',
        description: '这是一个模拟的云商店铺，提供各种优质商品和服务。',
      };
      setShopData(mockData);
    };
    fetchShopData();
  }, [shopId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setShopData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSave = () => {
    // 实际应用中，这里会调用API保存数据
    console.log('保存云商店铺数据:', shopData);
    toast.success('云商店铺信息已保存！');
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-slate-900">编辑云商店铺信息</h1>
        <Button onClick={onBack}>返回</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="companyName">企业名称</Label>
            <Input id="companyName" value={shopData.companyName} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">地址</Label>
            <Input id="address" value={shopData.address} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactPhone">联系电话</Label>
            <Input id="contactPhone" value={shopData.contactPhone} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" value={shopData.email} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>资质信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="businessLicense">营业执照</Label>
            <Input id="businessLicense" value={shopData.businessLicense} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="qualificationCert">企业资格证书</Label>
            <Input id="qualificationCert" value={shopData.qualificationCert} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>店铺描述</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea id="description" value={shopData.description} onChange={handleChange} rows={5} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>保存</Button>
      </div>
    </div>
  );
}
