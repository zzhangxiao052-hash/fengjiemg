import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export default function ServiceManagement() {
  const [services, setServices] = useState([
    { id: '1', name: '企业贷款服务', type: '金融服务', status: '已发布', date: '2023-01-15' },
    { id: '2', name: '物流运输方案', type: '物流服务', status: '已发布', date: '2023-02-20' },
    { id: '3', name: '高级人才招聘', type: '用人需求', status: '草稿', date: '2023-03-10' },
  ]);

  const handleEdit = (id: string) => {
    toast.info(`编辑服务: ${id}`);
    // Implement actual edit logic here
  };

  const handleDelete = (id: string) => {
    setServices(services.filter(service => service.id !== id));
    toast.success(`服务 ${id} 已删除`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>服务管理</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>服务名称</TableHead>
              <TableHead>服务类型</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>发布日期</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.type}</TableCell>
                <TableCell>{service.status}</TableCell>
                <TableCell>{service.date}</TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(service.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>编辑服务</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>删除服务</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}