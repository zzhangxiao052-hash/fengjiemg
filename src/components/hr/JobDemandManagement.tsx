import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Search, Eye } from 'lucide-react';

export default function JobDemandManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJobType, setFilterJobType] = useState('all');

  const demands = [
    { id: '1', company: '科技公司A', position: '软件工程师', jobType: '前端开发', experience: '3-5年', salary: '10K-15K', status: '招聘中', publishTime: '2024-10-15' },
    { id: '2', company: '制造公司B', position: '机械工程师', jobType: '机械工程', experience: '1-3年', salary: '8K-12K', status: '招聘中', publishTime: '2024-10-14' },
    { id: '3', company: '物流公司C', position: '仓储管理', jobType: '仓储管理', experience: '5年以上', salary: '6K-9K', status: '已完成', publishTime: '2024-10-13' },
  ];

  const filtered = demands.filter(d => {
    const meetsSearch = d.company.toLowerCase().includes(searchTerm.toLowerCase()) || d.position.toLowerCase().includes(searchTerm.toLowerCase());
    const meetsJobType = filterJobType === 'all' || d.jobType === filterJobType;
    return meetsSearch && meetsJobType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">用人需求管理</h1>
        <p className="text-slate-500 mt-1">查看和管理企业用人需求</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative flex flex-col md:flex-row gap-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索企业或职位..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Select value={filterJobType} onValueChange={setFilterJobType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="工种筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部工种</SelectItem>
                <SelectItem value="前端开发">前端开发</SelectItem>
                <SelectItem value="机械工程">机械工程</SelectItem>
                <SelectItem value="仓储管理">仓储管理</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>企业名称</TableHead>
                  <TableHead>职位</TableHead>
                  <TableHead>工种</TableHead>
                  <TableHead>经验要求</TableHead>
                  <TableHead>薪资</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>发布时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((demand) => (
                  <TableRow key={demand.id} className="hover:bg-slate-50">
                    <TableCell>{demand.company}</TableCell>
                    <TableCell>{demand.position}</TableCell>
                    <TableCell>{demand.jobType}</TableCell>
                    <TableCell>{demand.experience}</TableCell>
                    <TableCell>{demand.salary}</TableCell>
                    <TableCell>
                      <Badge className={demand.status === '招聘中' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}>
                        {demand.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{demand.publishTime}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
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
