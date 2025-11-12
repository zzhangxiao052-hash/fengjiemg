import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
  createDate: string;
}

const initialSurveys: Survey[] = [
  {
    id: '1',
    title: '园区企业满意度调查',
    description: '了解园区企业对各项服务的满意度。',
    status: 'active',
    createDate: '2023-10-01',
  },
  {
    id: '2',
    title: '员工通勤方式调查',
    description: '统计园区员工的通勤方式，以便优化交通。',
    status: 'inactive',
    createDate: '2023-11-15',
  },
];

const ParkDataCollectionManagement: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selected, setSelected] = useState<Survey | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Survey | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    createDate: '',
  });

  const filtered = surveys.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ title: '', description: '', status: 'active', createDate: new Date().toISOString().split('T')[0] });
    setShowAddDialog(true);
  };
  const handleAddSubmit = () => {
    const newItem: Survey = {
      id: (surveys.length + 1).toString(),
      ...formData,
    };
    setSurveys([...surveys, newItem]);
    setShowAddDialog(false);
  };

  const handleEdit = (item: Survey) => {
    setSelected(item);
    setFormData({ title: item.title, description: item.description, status: item.status, createDate: item.createDate });
    setShowEditDialog(true);
  };
  const handleEditSubmit = () => {
    if (!selected) return;
    setSurveys(surveys.map(s => s.id === selected.id ? { ...s, ...formData } : s));
    setShowEditDialog(false);
  };

  const handleDetail = (item: Survey) => {
    setSelected(item);
    setShowDetailDialog(true);
  };

  const handleDeleteInit = (item: Survey) => {
    setDeleteTarget(item);
    setShowDeleteDialog(true);
  };
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setSurveys(surveys.filter(s => s.id !== deleteTarget.id));
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">园区数据采集管理</h1>
        <Button onClick={handleAdd} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">新增问卷</Button>
      </div>
      <Card>
        <CardHeader>
          <Input
            placeholder="搜索问卷标题或描述..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-1/2"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>标题</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>创建日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.createDate}</TableCell>
                  <TableCell>{item.status === 'active' ? '进行中' : '已结束'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleDetail(item)}>查看</Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>编辑</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteInit(item)}>删除</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增问卷</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">标题</Label>
              <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">描述</Label>
              <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleAddSubmit}>保存</Button>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑问卷</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">标题</Label>
              <Input id="edit-title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">描述</Label>
              <Textarea id="edit-description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleEditSubmit}>保存</Button>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>问卷详情</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">标题</Label>
              <p className="col-span-3">{selected?.title}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">描述</Label>
              <p className="col-span-3">{selected?.description}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">创建日期</Label>
              <p className="col-span-3">{selected?.createDate}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">状态</Label>
              <p className="col-span-3">{selected?.status === 'active' ? '进行中' : '已结束'}</p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setShowDetailDialog(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p>确定要删除问卷“{deleteTarget?.title}”吗？该操作不可恢复。</p>
          <DialogFooter className="mt-4">
            <Button variant="destructive" onClick={handleDeleteConfirm}>删除</Button>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParkDataCollectionManagement;
