import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface Demand {
  id: string;
  company: string;
  type: string;
  amount: string;
  contact: string;
  status: string;
  submitTime: string;
  description: string;
  notes?: string; // Add notes field for processing
}

export default function FinanceDemandList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);

  // Add state for process dialog
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [processNotes, setProcessNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  // Add state for delete confirmation dialog
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [demandToDeleteId, setDemandToDeleteId] = useState<string | null>(null);

  const [demands, setDemands] = useState<Demand[]>([
    { id: '1', company: '重庆科技有限公司', type: '流动资金贷款', amount: '500万', contact: '张经理', status: 'pending', submitTime: '2024-10-16', description: '企业急需流动资金周转' },
    { id: '2', company: '奉节农业发展公司', type: '项目贷款', amount: '1000万', contact: '李总', status: 'processing', submitTime: '2024-10-15', description: '农业项目扩大再生产，需要资金支持' },
    { id: '3', company: '长江物流集团', type: '供应链融资', amount: '800万', contact: '王主管', status: 'completed', submitTime: '2024-10-14', description: '优化供应链，提高资金周转效率' },
    { id: '4', company: '三峡旅游开发', type: '旅游专项贷', amount: '1200万', contact: '赵经理', status: 'pending', submitTime: '2024-10-13', description: '开发新的旅游项目，需要大额资金投入' },
  ]);

  const handleViewDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setShowViewDialog(true);
  };

  const handleProcessDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setProcessNotes(demand.notes || ''); // Clear previous notes
    setNewStatus(demand.status); // Set initial status to current demand status
    setShowProcessDialog(true);
  };

  const confirmProcessDemand = () => {
    if (selectedDemand) {
      setDemands(demands.map(d =>
        d.id === selectedDemand.id ? { ...d, status: newStatus, notes: processNotes } : d
      ));
      toast.success(`需求 ${selectedDemand.company} - ${selectedDemand.type} 已更新`);
      setShowProcessDialog(false);
      setSelectedDemand(null);
      setProcessNotes('');
      setNewStatus('');
    }
  };

  const handleDeleteDemand = (demandId: string) => {
    setDemandToDeleteId(demandId);
    setShowDeleteConfirmDialog(true);
  };

  const confirmDeleteDemand = () => {
    if (demandToDeleteId) {
      setDemands(demands.filter(d => d.id !== demandToDeleteId));
      toast.success('金融需求已删除');
      setShowDeleteConfirmDialog(false);
      setDemandToDeleteId(null);
    }
  };

  const filteredDemands = demands.filter(demand => {
    const matchesSearch = demand.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          demand.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' ||
                          (filterStatus === 'pending' && demand.status === 'pending') ||
                          (filterStatus === 'processing' && demand.status === 'processing') ||
                          (filterStatus === 'completed' && demand.status === 'completed');
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700">待处理</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700">处理中</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">已完成</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">金融需求管理</h1>
        <p className="text-slate-500 mt-1">查看和处理企业金融需求</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="搜索企业或需求类型..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="processing">处理中</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
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
                  <TableHead>需求类型</TableHead>
                  <TableHead>融资金额</TableHead>
                  <TableHead>联系人</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>提交时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDemands.map((demand) => (
                  <TableRow key={demand.id} className="hover:bg-slate-50">
                    <TableCell>{demand.company}</TableCell>
                    <TableCell>{demand.type}</TableCell>
                    <TableCell>{demand.amount}</TableCell>
                    <TableCell>{demand.contact}</TableCell>
                    <TableCell>{getStatusBadge(demand.status)}</TableCell>
                    <TableCell>{demand.submitTime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDemand(demand)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Demand Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>金融需求详情</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>企业名称</Label>
              <p className="mt-1 text-slate-700">{selectedDemand?.company}</p>
            </div>
            <div>
              <Label>需求类型</Label>
              <p className="mt-1 text-slate-700">{selectedDemand?.type}</p>
            </div>
            <div>
              <Label>融资金额</Label>
              <p className="mt-1 text-slate-700">{selectedDemand?.amount}</p>
            </div>
            <div>
              <Label>联系人</Label>
              <p className="mt-1 text-slate-700">{selectedDemand?.contact}</p>
            </div>
            <div>
              <Label>状态</Label>
              <p className="mt-1 text-slate-700">{selectedDemand?.status && getStatusBadge(selectedDemand.status)}</p>
            </div>
            <div>
              <Label>提交时间</Label>
              <p className="mt-1 text-slate-700">{selectedDemand?.submitTime}</p>
            </div>
            <div>
              <Label>需求描述</Label>
              <p className="mt-1 text-slate-700">{selectedDemand?.description}</p>
            </div>
            {selectedDemand?.notes && (
              <div>
                <Label>处理备注</Label>
                <p className="mt-1 text-slate-700">{selectedDemand.notes}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Demand Dialog */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>处理金融需求</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>企业名称</Label>
              <p className="mt-1 text-slate-700">{selectedDemand?.company}</p>
            </div>
            <div>
              <Label>需求类型</Label>
              <p className="mt-1 text-slate-700">{selectedDemand?.type}</p>
            </div>
            <div>
              <Label htmlFor="newStatus">更新状态</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="newStatus">
                  <SelectValue placeholder="选择新状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="processNotes">处理备注</Label>
              <Textarea
                id="processNotes"
                value={processNotes}
                onChange={(e) => setProcessNotes(e.target.value)}
                placeholder="填写处理备注..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProcessDialog(false)}>
              取消
            </Button>
            <Button onClick={confirmProcessDemand}>
              确认处理
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>您确定要删除此金融需求吗？此操作不可撤销。</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDeleteDemand}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}