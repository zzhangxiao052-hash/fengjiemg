import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export default function DynamicManagement() {
  const [userDynamics, setUserDynamics] = useState([
    { id: '1', username: '张三', action: '发布了新服务', time: '2023-10-26 10:00', region: '重庆' },
    { id: '2', username: '李四', action: '更新了企业信息', time: '2023-10-26 11:30', region: '成都' },
  ]);

  const [enterpriseDynamics, setEnterpriseDynamics] = useState([
    { id: '1', enterpriseName: '重庆科技公司', action: '发布了招聘岗位', time: '2023-10-26 09:00', region: '重庆' },
    { id: '2', enterpriseName: '成都物流公司', action: '发布了物流服务', time: '2023-10-26 14:00', region: '成都' },
  ]);

  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [enterpriseSearchTerm, setEnterpriseSearchTerm] = useState('');

  const filteredUserDynamics = userDynamics.filter(dynamic =>
    dynamic.username.includes(userSearchTerm) ||
    dynamic.action.includes(userSearchTerm) ||
    dynamic.region.includes(userSearchTerm)
  );

  const filteredEnterpriseDynamics = enterpriseDynamics.filter(dynamic =>
    dynamic.enterpriseName.includes(enterpriseSearchTerm) ||
    dynamic.action.includes(enterpriseSearchTerm) ||
    dynamic.region.includes(enterpriseSearchTerm)
  );

  const handleViewUserDynamic = (id: string) => {
    toast.info(`查看用户动态: ${id}`);
  };

  const handleEditUserDynamic = (id: string) => {
    toast.info(`编辑用户动态: ${id}`);
  };

  const handleDeleteUserDynamic = (id: string) => {
    setUserDynamics(userDynamics.filter(dynamic => dynamic.id !== id));
    toast.success(`用户动态 ${id} 已删除`);
  };

  const handleViewEnterpriseDynamic = (id: string) => {
    toast.info(`查看企业动态: ${id}`);
  };

  const handleEditEnterpriseDynamic = (id: string) => {
    toast.info(`编辑企业动态: ${id}`);
  };

  const handleDeleteEnterpriseDynamic = (id: string) => {
    setEnterpriseDynamics(enterpriseDynamics.filter(dynamic => dynamic.id !== id));
    toast.success(`企业动态 ${id} 已删除`);
  };

  return (
    <Tabs defaultValue="user-dynamics" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="user-dynamics">用户动态</TabsTrigger>
        <TabsTrigger value="enterprise-dynamics">企业动态</TabsTrigger>
      </TabsList>

      <TabsContent value="user-dynamics">
        <Card>
          <CardHeader>
            <CardTitle>用户动态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="搜索用户名、行为或地区..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Button><Search className="h-4 w-4 mr-2" />搜索</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户名</TableHead>
                  <TableHead>行为方式</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>地区</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUserDynamics.map((dynamic) => (
                  <TableRow key={dynamic.id}>
                    <TableCell className="font-medium">{dynamic.username}</TableCell>
                    <TableCell>{dynamic.action}</TableCell>
                    <TableCell>{dynamic.time}</TableCell>
                    <TableCell>{dynamic.region}</TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleViewUserDynamic(dynamic.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>查看用户动态</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleEditUserDynamic(dynamic.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>编辑用户动态</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteUserDynamic(dynamic.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>删除用户动态</p>
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
      </TabsContent>

      <TabsContent value="enterprise-dynamics">
        <Card>
          <CardHeader>
            <CardTitle>企业动态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="搜索企业名称、行为或地区..."
                value={enterpriseSearchTerm}
                onChange={(e) => setEnterpriseSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Button><Search className="h-4 w-4 mr-2" />搜索</Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>企业名称</TableHead>
                  <TableHead>行为方式</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>地区</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnterpriseDynamics.map((dynamic) => (
                  <TableRow key={dynamic.id}>
                    <TableCell className="font-medium">{dynamic.enterpriseName}</TableCell>
                    <TableCell>{dynamic.action}</TableCell>
                    <TableCell>{dynamic.time}</TableCell>
                    <TableCell>{dynamic.region}</TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleViewEnterpriseDynamic(dynamic.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>查看企业动态</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleEditEnterpriseDynamic(dynamic.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>编辑企业动态</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteEnterpriseDynamic(dynamic.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>删除企业动态</p>
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
      </TabsContent>
    </Tabs>
  );
}