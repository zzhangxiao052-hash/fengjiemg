import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button'; // Import Button component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog'; // Import Dialog components
import { Label } from '../ui/label'; // Import Label component

interface HistoryItem {
  id: string;
  type: string; // e.g., '网站内容管理', '企业认证', '系统设置'
  action: string; // e.g., '删除', '修改', '同意'
  target: string; // e.g., '新闻公告', '企业A', '账号管理'
  timestamp: string;
  operator: string;
  status: '成功' | '失败';
}

const initialHistoryData: HistoryItem[] = [
  // 网站内容管理 - 新闻公告
  { id: '1', type: '网站内容管理', action: '删除', target: '新闻公告：园区招聘会', timestamp: '2023-10-26 10:00:00', operator: '张三', status: '成功' },
  { id: '2', type: '网站内容管理', action: '修改', target: '新闻公告：园区政策更新', timestamp: '2023-10-26 10:30:00', operator: '李四', status: '成功' },
  // 网站内容管理 - 政策法规
  { id: '3', type: '网站内容管理', action: '删除', target: '政策法规：高新技术企业扶持政策', timestamp: '2023-10-26 11:00:00', operator: '王五', status: '成功' },
  { id: '4', type: '网站内容管理', action: '修改', target: '政策法规：人才引进计划', timestamp: '2023-10-26 11:30:00', operator: '赵六', status: '成功' },
  // 网站内容管理 - 园区风采
  { id: '5', type: '网站内容管理', action: '删除', target: '园区风采：智慧园区建设成果', timestamp: '2023-10-26 12:00:00', operator: '张三', status: '成功' },
  { id: '6', type: '网站内容管理', action: '修改', target: '园区风采：企业入驻风采', timestamp: '2023-10-26 12:30:00', operator: '李四', status: '成功' },

  // 企业认证
  { id: '7', type: '企业认证', action: '同意', target: '企业A认证申请', timestamp: '2023-10-26 13:00:00', operator: '王五', status: '成功' },
  { id: '8', type: '企业认证', action: '删除', target: '企业B认证申请', timestamp: '2023-10-26 13:30:00', operator: '赵六', status: '成功' },

  // 系统设置 - 部门管理
  { id: '9', type: '系统设置', action: '编辑', target: '部门管理：研发部', timestamp: '2023-10-26 14:00:00', operator: '张三', status: '成功' },
  { id: '10', type: '系统设置', action: '删除', target: '部门管理：市场部', timestamp: '2023-10-26 14:30:00', operator: '李四', status: '成功' },
  // 系统设置 - 权限管理
  { id: '11', type: '系统设置', action: '编辑', target: '权限管理：管理员角色', timestamp: '2023-10-26 15:00:00', operator: '王五', status: '成功' },
  { id: '12', type: '系统设置', action: '删除', target: '权限管理：普通用户角色', timestamp: '2023-10-26 15:30:00', operator: '赵六', status: '成功' },
  // 系统设置 - 账号管理
  { id: '13', type: '系统设置', action: '编辑', target: '账号管理：admin', timestamp: '2023-10-26 16:00:00', operator: '张三', status: '成功' },
  { id: '14', type: '系统设置', action: '删除', target: '账号管理：testuser', timestamp: '2023-10-26 16:30:00', operator: '李四', status: '成功' },
  // 系统设置 - 广告管理
  { id: '15', type: '系统设置', action: '编辑', target: '广告管理：首页轮播图', timestamp: '2023-10-26 17:00:00', operator: '王五', status: '成功' },
  { id: '16', type: '系统设置', action: '删除', target: '广告管理：侧边栏广告', timestamp: '2023-10-26 17:30:00', operator: '赵六', status: '成功' },
];

const ParkHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null);

  const filteredHistory = initialHistoryData.filter(item => {
    const matchesSearch = item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewDetails = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setShowDetailDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>历史记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Input
              placeholder="搜索目标、操作人或操作..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="筛选类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有类型</SelectItem>
                <SelectItem value="网站内容管理">网站内容管理</SelectItem>
                <SelectItem value="企业认证">企业认证</SelectItem>
                <SelectItem value="系统设置">系统设置</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="成功">成功</SelectItem>
                <SelectItem value="失败">失败</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>类型</TableHead>
                <TableHead>操作</TableHead>
                <TableHead>目标</TableHead>
                <TableHead>操作人</TableHead>
                <TableHead>时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>{item.target}</TableCell>
                  <TableCell>{item.operator}</TableCell>
                  <TableCell>{item.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === '成功' ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(item)}>查看</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 历史记录详情弹窗 */}
      {showDetailDialog && selectedHistoryItem && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>历史记录详情</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div>
                <Label>ID</Label>
                <p className="mt-1 text-slate-700">{selectedHistoryItem.id}</p>
              </div>
              <div>
                <Label>类型</Label>
                <p className="mt-1 text-slate-700">{selectedHistoryItem.type}</p>
              </div>
              <div>
                <Label>操作</Label>
                <p className="mt-1 text-slate-700">{selectedHistoryItem.action}</p>
              </div>
              <div>
                <Label>目标</Label>
                <p className="mt-1 text-slate-700">{selectedHistoryItem.target}</p>
              </div>
              <div>
                <Label>操作人</Label>
                <p className="mt-1 text-slate-700">{selectedHistoryItem.operator}</p>
              </div>
              <div>
                <Label>时间</Label>
                <p className="mt-1 text-slate-700">{selectedHistoryItem.timestamp}</p>
              </div>
              <div>
                <Label>状态</Label>
                <p className="mt-1 text-slate-700">{selectedHistoryItem.status}</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowDetailDialog(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ParkHistory;