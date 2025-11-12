import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Eye } from 'lucide-react';

interface Enterprise {
  id: string;
  name: string;
  status: string;
  contact: string;
  phone: string;
}

interface EnterpriseManagementProps {
  onNavigate: (page: string) => void;
}

export default function EnterpriseManagement({ onNavigate }: EnterpriseManagementProps) {
  const [enterprises] = useState<Enterprise[]>([
    { id: '1', name: '奉节县XX科技有限公司', status: '待审核', contact: '张三', phone: '13800138000' },
    { id: '2', name: '奉节县YY物流有限公司', status: '待审核', contact: '李四', phone: '13912345678' },
    { id: '3', name: '奉节县ZZ农业发展有限公司', status: '待审核', contact: '王五', phone: '13787654321' },
    { id: '4', name: '奉节县AA科技公司', status: '已认证', contact: '赵六', phone: '13611112222' },
    { id: '5', name: '奉节县BB贸易公司', status: '已驳回', contact: '孙七', phone: '13533334444' },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>企业管理</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>企业名称</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>联系人</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enterprises.map((enterprise) => (
              <TableRow key={enterprise.id}>
                <TableCell className="font-medium">{enterprise.name}</TableCell>
                <TableCell>{enterprise.status}</TableCell>
                <TableCell>{enterprise.contact}</TableCell>
                <TableCell>{enterprise.phone}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onNavigate(`enterprise-detail-${enterprise.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
