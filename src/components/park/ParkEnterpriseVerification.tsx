import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input'; // 导入 Input 组件
import { Eye, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface Enterprise {
  id: string;
  name: string;
  legalRepresentative: string;
  contact: string;
  contactPhone: string;
  belongingIndustry: string;
  registeredCapital: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
}

interface EnterpriseVerificationProps {
  onNavigate: (page: string) => void;
}

export default function EnterpriseVerification({ onNavigate }: EnterpriseVerificationProps) {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([
    { id: '1', name: '智能科技有限公司', legalRepresentative: '张三', contact: '李四', contactPhone: '138-0000-1234', belongingIndustry: '人工智能', registeredCapital: '5000万', status: 'pending', applicationDate: '2025-11-05' },
    { id: '2', name: '绿色能源科技股份有限公司', legalRepresentative: '王五', contact: '赵六', contactPhone: '139-0000-5678', belongingIndustry: '新能源', registeredCapital: '1亿', status: 'approved', applicationDate: '2025-11-01' },
    { id: '3', name: '云计算数据服务有限公司', legalRepresentative: '孙七', contact: '周八', contactPhone: '136-0000-9012', belongingIndustry: '云计算', registeredCapital: '3000万', status: 'pending', applicationDate: '2025-11-04' },
    { id: '4', name: '先进制造装备集团', legalRepresentative: '吴九', contact: '郑十', contactPhone: '137-0000-3456', belongingIndustry: '智能制造', registeredCapital: '2亿', status: 'approved', applicationDate: '2025-10-28' },
    { id: '5', name: '现代物流供应链有限公司', legalRepresentative: '钱十一', contact: '陈十二', contactPhone: '135-0000-7890', belongingIndustry: '现代物流', registeredCapital: '8000万', status: 'rejected', applicationDate: '2025-11-03' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredEnterprises = enterprises.filter(
    (enterprise) =>
      enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.legalRepresentative.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.contactPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.belongingIndustry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: string) => {
    setEnterprises(prev => prev.map(e => e.id === id ? { ...e, status: 'approved' } : e));
    toast.success('企业认证已通过');
  };

  const handleReject = (id: string) => {
    setEnterprises(prev => prev.map(e => e.id === id ? { ...e, status: 'rejected' } : e));
    toast.error('企业认证已拒绝');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">企业认证审核</h1>
        <p className="text-slate-500 mt-1">审核企业认证申请</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="搜索企业名称或联系人..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>企业名称</TableHead>
              <TableHead>法人代表</TableHead>
              <TableHead>联系人</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>所属行业</TableHead>
              <TableHead>注册资本</TableHead>
              <TableHead>认证状态</TableHead>
              <TableHead>申请日期</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnterprises.map((enterprise) => (
              <TableRow key={enterprise.id} className="hover:bg-slate-50">
                <TableCell>{enterprise.name}</TableCell>
                <TableCell>{enterprise.legalRepresentative}</TableCell>
                <TableCell>{enterprise.contact}</TableCell>
                <TableCell>{enterprise.contactPhone}</TableCell>
                <TableCell>{enterprise.belongingIndustry}</TableCell>
                <TableCell>{enterprise.registeredCapital}</TableCell>
                <TableCell>
                  <Badge
                    variant={enterprise.status === 'approved' ? 'success' : enterprise.status === 'rejected' ? 'destructive' : 'outline'}
                    className={enterprise.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                  >
                    {enterprise.status === 'pending' && '待审核'}
                    {enterprise.status === 'approved' && '已通过'}
                    {enterprise.status === 'rejected' && '已拒绝'}
                  </Badge>
                </TableCell>
                <TableCell>{enterprise.applicationDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onNavigate(`enterprise-detail-${enterprise.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      查看
                    </Button>
                    {enterprise.status === 'pending' && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => handleApprove(enterprise.id)}>
                          <Check className="h-4 w-4 mr-1" />
                          通过
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleReject(enterprise.id)}>
                          <X className="h-4 w-4 mr-1" />
                          拒绝
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-slate-500">
          共 {enterprises.length} 条记录
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>上一页</Button>
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">下一页</Button>
        </div>
      </div>
    </div>
  );
}