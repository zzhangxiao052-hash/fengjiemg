import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Eye, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Enterprise {
  id: string;
  name: string;
  industry: string;
  status: string;
  credit: string;
  contact: string;
}

interface EnterpriseListProps {
  onNavigate: (pageId: string) => void;
}

export default function EnterpriseList({ onNavigate }: EnterpriseListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [enterprises, setEnterprises] = useState<Enterprise[]>([
    { id: '1', name: '重庆科技有限公司', industry: '信息技术', status: '已认证', credit: 'AAA', contact: '张经理' },
    { id: '2', name: '奉节农业发展公司', industry: '农业', status: '已认证', credit: 'AA', contact: '李总' },
    { id: '3', name: '长江物流集团', industry: '物流', status: '已认证', credit: 'AAA', contact: '王主管' },
    { id: '4', name: '三峡旅游开发', industry: '旅游', status: '待认证', credit: '-', contact: '赵经理' },
  ]);

  const filteredEnterprises = enterprises.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">企业列表</h1>
        <p className="text-slate-500 mt-1">查看和管理入驻企业信息</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索企业名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>企业名称</TableHead>
                  <TableHead>所属行业</TableHead>
                  <TableHead>认证状态</TableHead>
                  <TableHead>信用等级</TableHead>
                  <TableHead>联系人</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnterprises.map((enterprise) => (
                  <TableRow key={enterprise.id} className="hover:bg-slate-50">
                    <TableCell>{enterprise.name}</TableCell>
                    <TableCell>{enterprise.industry}</TableCell>
                    <TableCell>
                      <Badge className={enterprise.status === '已认证' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                        {enterprise.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{enterprise.credit}</TableCell>
                    <TableCell>{enterprise.contact}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => onNavigate(`enterprise-detail-${enterprise.id}`)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>查看详情</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}