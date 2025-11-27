import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Edit, Trash, Eye, ClipboardCheck, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

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
  status: 'pending' | 'approved' | 'rejected';
  content?: string;
}

const DynamicManagement: React.FC = () => {
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [enterpriseSearchTerm, setEnterpriseSearchTerm] = useState('');

  const [userDynamics, setUserDynamics] = useState<UserDynamic[]>([
    { id: '1', username: '张三', action: '发布了新服务', time: '2023-10-26 10:00', region: '重庆' },
    { id: '2', username: '李四', action: '更新了企业信息', time: '2023-10-26 11:30', region: '成都' },
  ]);

  const [enterpriseDynamics, setEnterpriseDynamics] = useState<EnterpriseDynamic[]>([
    { id: '1', enterpriseName: '重庆科技有限公司', action: '发布了招聘岗位', time: '2023-10-26 09:00', region: '重庆', status: 'pending', content: '招聘高级前端工程师，薪资20k-30k，要求5年以上经验。' },
    { id: '2', enterpriseName: '成都物流公司', action: '发布了物流服务', time: '2023-10-26 14:00', region: '成都', status: 'approved', content: '提供成都至重庆的冷链物流服务，每日发车。' },
  ]);

  const [selectedDynamic, setSelectedDynamic] = useState<EnterpriseDynamic | null>(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

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

  const handleAuditClick = (dynamic: EnterpriseDynamic) => {
    setSelectedDynamic(dynamic);
    setIsAuditOpen(true);
  };

  const handleApprove = () => {
    if (selectedDynamic) {
      setEnterpriseDynamics(prev => prev.map(d => d.id === selectedDynamic.id ? { ...d, status: 'approved' } : d));
      setIsAuditOpen(false);
    }
  };

  const handleReject = () => {
    if (selectedDynamic) {
      setEnterpriseDynamics(prev => prev.map(d => d.id === selectedDynamic.id ? { ...d, status: 'rejected' } : d));
      setIsAuditOpen(false);
    }
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserSearchTerm(e.target.value)}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEnterpriseSearchTerm(e.target.value)}
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
                  <TableHead>状态</TableHead>
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
                      <Badge variant={dynamic.status === 'approved' ? 'default' : dynamic.status === 'rejected' ? 'destructive' : 'secondary'}>
                        {dynamic.status === 'approved' ? '已通过' : dynamic.status === 'rejected' ? '已拒绝' : '待审核'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleAuditClick(dynamic)} title="审核">
                        <ClipboardCheck className="h-4 w-4" />
                      </Button>
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

      <Dialog open={isAuditOpen} onOpenChange={setIsAuditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>审核企业动态</DialogTitle>
            <DialogDescription>查看并审核企业发布的内容。</DialogDescription>
          </DialogHeader>
          {selectedDynamic && (
            <div className="py-4 space-y-2">
              <p><strong>企业名称:</strong> {selectedDynamic.enterpriseName}</p>
              <p><strong>行为:</strong> {selectedDynamic.action}</p>
              <p><strong>时间:</strong> {selectedDynamic.time}</p>
              <p><strong>地区:</strong> {selectedDynamic.region}</p>
              <p><strong>内容:</strong> {selectedDynamic.content || '无详细内容'}</p>
              <p><strong>当前状态:</strong> 
                <Badge className="ml-2" variant={selectedDynamic.status === 'approved' ? 'default' : selectedDynamic.status === 'rejected' ? 'destructive' : 'secondary'}>
                  {selectedDynamic.status === 'approved' ? '已通过' : selectedDynamic.status === 'rejected' ? '已拒绝' : '待审核'}
                </Badge>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAuditOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleReject}><X className="mr-2 h-4 w-4"/> 拒绝</Button>
            <Button onClick={handleApprove}><Check className="mr-2 h-4 w-4"/> 同意</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DynamicManagement;
