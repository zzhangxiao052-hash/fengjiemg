import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface EnterpriseDetail {
  id: string;
  // 账户信息
  username: string;
  password?: string; // 密码可能不直接显示或需要特殊处理

  // 企业信息
  name: string;
  unifiedSocialCreditCode: string;
  registeredCapital: string;
  mainBusiness: string;
  belongingIndustry: string;
  enterpriseScale: string;
  enterpriseAddress: string;
  intendedPark: string;
  estimatedMoveInInfo: string;

  // 联系人信息
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  contactEmail: string;
  additionalNotes: string;
}

interface ParkEnterpriseDetailProps {
  enterpriseId: string;
  onBack: () => void;
}

export default function ParkEnterpriseDetail({ enterpriseId, onBack }: ParkEnterpriseDetailProps) {
  // 模拟数据，实际应用中会根据 enterpriseId 从后端获取数据
  const dummyDetail: EnterpriseDetail = {
    id: enterpriseId,
    username: 'example_user',
    password: '******',
    name: '智能科技有限公司',
    unifiedSocialCreditCode: '9131000077XXXXX',
    registeredCapital: '5000万',
    mainBusiness: '人工智能软件开发',
    belongingIndustry: '人工智能',
    enterpriseScale: '中型企业',
    enterpriseAddress: '上海市浦东新区张江高科',
    intendedPark: '创新科技园',
    estimatedMoveInInfo: '2024年12月',
    contactName: '李四',
    contactPosition: '市场总监',
    contactPhone: '138-0000-1234',
    contactEmail: 'lisi@intelligent.com',
    additionalNotes: '希望尽快完成入驻手续。',
  };

  // 在实际应用中，这里会有一个 useEffect 来根据 enterpriseId 异步加载数据
  const enterprise = dummyDetail; // 暂时使用模拟数据

  if (!enterprise) {
    return (
      <div className="p-4">
        <Button onClick={onBack} className="mb-4">返回</Button>
        <p>未找到企业详情。</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">企业详情 - {enterprise.name}</h1>
        <Button onClick={onBack}>返回列表</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>账户信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">用户名</p>
            <p className="text-lg">{enterprise.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">密码</p>
            <p className="text-lg">{enterprise.password}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>企业信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">企业名称</p>
            <p className="text-lg">{enterprise.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">统一社会信用代码</p>
            <p className="text-lg">{enterprise.unifiedSocialCreditCode}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">注册资本</p>
            <p className="text-lg">{enterprise.registeredCapital}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">主营业务</p>
            <p className="text-lg">{enterprise.mainBusiness}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">所属产业</p>
            <p className="text-lg">{enterprise.belongingIndustry}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">企业规模</p>
            <p className="text-lg">{enterprise.enterpriseScale}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">企业地址</p>
            <p className="text-lg">{enterprise.enterpriseAddress}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">意向入驻园区</p>
            <p className="text-lg">{enterprise.intendedPark}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">预计入驻信息</p>
            <p className="text-lg">{enterprise.estimatedMoveInInfo}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>联系人信息</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-500">联系人姓名</p>
            <p className="text-lg">{enterprise.contactName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">职位</p>
            <p className="text-lg">{enterprise.contactPosition}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">电话</p>
            <p className="text-lg">{enterprise.contactPhone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">邮箱</p>
            <p className="text-lg">{enterprise.contactEmail}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">补充说明</p>
            <p className="text-lg">{enterprise.additionalNotes}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
