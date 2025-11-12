import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Search, Eye } from 'lucide-react';

interface LogisticsDemandProps {
  onNavigate: (page: string) => void;
}

export default function LogisticsDemand({ onNavigate }: LogisticsDemandProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const demands = [
    { id: '1', company: '制造公司A', cargo: '钢材', weight: '50吨', route: '奉节→重庆', status: '待对接', publishTime: '2024-10-16' },
    { id: '2', company: '贸易公司B', cargo: '农产品', weight: '30吨', route: '奉节→成都', status: '已对接', publishTime: '2024-10-15' },
    { id: '3', company: '电商企业C', cargo: '电子产品', weight: '10吨', route: '奉节→武汉', status: '运输中', publishTime: '2024-10-14' },
  ];

  const filtered = demands.filter(d => 
    d.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (id: string) => {
    onNavigate(`logistics-demand-detail-${id}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">物流需求查看</h1>
        <p className="text-slate-500 mt-1">查看企业物流需求与路线</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索企业或货物类型..."
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
                  <TableHead>货物类型</TableHead>
                  <TableHead>重量</TableHead>
                  <TableHead>运输路线</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>发布时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((demand) => (
                  <TableRow key={demand.id} className="hover:bg-slate-50">
                    <TableCell>{demand.company}</TableCell>
                    <TableCell>{demand.cargo}</TableCell>
                    <TableCell>{demand.weight}</TableCell>
                    <TableCell>{demand.route}</TableCell>
                    <TableCell>
                      <Badge className={
                        demand.status === '运输中' ? 'bg-blue-100 text-blue-700' :
                        demand.status === '已对接' ? 'bg-green-100 text-green-700' :
                        'bg-orange-100 text-orange-700'
                      }>
                        {demand.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{demand.publishTime}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(demand.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
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