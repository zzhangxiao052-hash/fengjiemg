import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface EnterpriseDetailProps {
  enterpriseId: string;
  onBack: () => void;
}

export default function EnterpriseDetail({ enterpriseId, onBack }: EnterpriseDetailProps) {
  // 模拟企业数据
  const enterpriseData = {
    id: enterpriseId,
    name: `企业 ${enterpriseId}`,
    industry: '信息技术',
    scale: '中型',
    address: '重庆市奉节县XXX路XXX号',
    contactPerson: '张经理',
    contactPhone: '13800138000',
    description: '这是一家专注于软件开发和信息技术服务的高科技企业，致力于为客户提供创新的解决方案。',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-slate-900">企业详情页</h1>
        <Button onClick={onBack}>返回企业列表</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>企业基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">企业名称</p>
            <p className="text-lg font-semibold">{enterpriseData.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">所属行业</p>
              <p className="text-base">{enterpriseData.industry}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">企业规模</p>
              <p className="text-base">{enterpriseData.scale}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">企业地址</p>
            <p className="text-base">{enterpriseData.address}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>联系方式</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">联系人</p>
            <p className="text-base">{enterpriseData.contactPerson}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">联系电话</p>
            <p className="text-base">{enterpriseData.contactPhone}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>企业描述</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base">{enterpriseData.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
