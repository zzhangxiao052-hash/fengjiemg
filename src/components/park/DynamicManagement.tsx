import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Edit, Trash, Eye } from 'lucide-react';

interface UserDynamic {
  id: string;
  username: string;
  action: string;
  time: string;
  region: string;
}

interface EnterpriseDynamic {
  id: string;
  enterpriseName: string;
  action: string;
  time: string;
  region: string;
}

const DynamicManagement: React.FC = () => {
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [enterpriseSearchTerm, setEnterpriseSearchTerm] = useState('');

  const [userDynamics, setUserDynamics] = useState<UserDynamic[]>([
    { id: '1', username: '张三', action: '发布了新服务', time: '2023-10-26 10:00', region: '重庆' },
    { id: '2', username: '李四', action: '更新了企业信息', time: '2023-10-26 11:30', region: '成都' },
  ]);

  const [enterpriseDynamics, setEnterpriseDynamics] = useState<EnterpriseDynamic[]>([
    { id: '1', enterpriseName: '重庆科技有限公司', action: '发布了招聘岗位', time: '2023-10-26 09:00', region: '重庆' },
    { id: '2', enterpriseName: '成都物流公司', action: '发布了物流服务', time: '2023-10-26 14:00', region: '成都' },
  ]);

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

  const handleView = (type: 'user' | 'enterprise', id: string) => {
    console.log(`View ${type} dynamic with id: ${id}`);
    // Implement view logic here
  };

  const handleEdit = (type: 'user' | 'enterprise', id: string) => {
    console.log(`Edit ${type} dynamic with id: ${id}`);
    // Implement edit logic here
  };

  const handleDelete = (type: 'user' | 'enterprise', id: string) => {
    if (type === 'user') {
      setUserDynamics(userDynamics.filter(d => d.id !== id));
    } else {
      setEnterpriseDynamics(enterpriseDynamics.filter(d => d.id !== id));
    }
    console.log(`Delete ${type} dynamic with id: ${id}`);
  };

  return (
    <div className="p-6">
      <Tabs defaultValue="user-dynamic" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="user-dynamic">用户动态</TabsTrigger>
          <TabsTrigger value="enterprise-dynamic">企业动态</TabsTrigger>
        </TabsList>
        <TabsContent value="user-dynamic">
          <h2 className="text-xl font-bold mb-4">用户动态</h2>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="搜索用户名、行为或地区..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-80"
            />
            <Button><Search className="h-4 w-4 mr-2" />搜索</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户名</TableHead>
                  <TableHead>行为方式</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>地区</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUserDynamics.map(dynamic => (
                  <TableRow key={dynamic.id}>
                    <TableCell>{dynamic.username}</TableCell>
                    <TableCell>{dynamic.action}</TableCell>
                    <TableCell>{dynamic.time}</TableCell>
                    <TableCell>{dynamic.region}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleView('user', dynamic.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit('user', dynamic.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete('user', dynamic.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="enterprise-dynamic">
          <h2 className="text-xl font-bold mb-4">企业动态</h2>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="搜索企业名称、行为或地区..."
              value={enterpriseSearchTerm}
              onChange={(e) => setEnterpriseSearchTerm(e.target.value)}
              className="w-80"
            />
            <Button><Search className="h-4 w-4 mr-2" />搜索</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>企业名称</TableHead>
                  <TableHead>行为方式</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>地区</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnterpriseDynamics.map(dynamic => (
                  <TableRow key={dynamic.id}>
                    <TableCell>{dynamic.enterpriseName}</TableCell>
                    <TableCell>{dynamic.action}</TableCell>
                    <TableCell>{dynamic.time}</TableCell>
                    <TableCell>{dynamic.region}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleView('enterprise', dynamic.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit('enterprise', dynamic.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete('enterprise', dynamic.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DynamicManagement;
