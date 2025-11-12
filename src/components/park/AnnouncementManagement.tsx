import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface Announcement {
  id: string;
  title: string;
  category: string;
  content: string;
  status: 'active' | 'inactive';
  publishDate: string;
}

const initialAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '园区最新政策通知',
    category: '政策',
    content: '关于2024年园区企业扶持政策的详细说明...',
    status: 'active',
    publishDate: '2024-01-15',
  },
  {
    id: '2',
    title: '春节放假安排',
    category: '通知',
    content: '2024年春节假期为2月9日至2月17日...',
    status: 'active',
    publishDate: '2024-02-01',
  },
];

const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    status: 'active' as 'active' | 'inactive',
    publishDate: '',
  });

  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ title: '', category: '', content: '', status: 'active', publishDate: new Date().toISOString().split('T')[0] });
    setShowAddDialog(true);
  };
  const handleAddSubmit = () => {
    const newItem: Announcement = {
      id: (announcements.length + 1).toString(),
      ...formData,
    };
    setAnnouncements([...announcements, newItem]);
    setShowAddDialog(false);
  };

  const handleEdit = (item: Announcement) => {
    setSelected(item);
    setFormData({ title: item.title, category: item.category, content: item.content, status: item.status, publishDate: item.publishDate });
    setShowEditDialog(true);
  };
  const handleEditSubmit = () => {
    if (!selected) return;
    setAnnouncements(announcements.map(a => a.id === selected.id ? { ...a, ...formData } : a));
    setShowEditDialog(false);
  };

  const handleDetail = (item: Announcement) => {
    setSelected(item);
    setShowDetailDialog(true);
  };

  const handleDeleteInit = (item: Announcement) => {
    setDeleteTarget(item);
    setShowDeleteDialog(true);
  };
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setAnnouncements(announcements.filter(a => a.id !== deleteTarget.id));
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">公告管理</h1>
        <Button onClick={handleAdd} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">发布公告</Button>
      </div>
      <Card>
        <CardHeader>
          <Input
            placeholder="搜索公告标题、内容或分类..."
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
                <TableHead>分类</TableHead>
                <TableHead>发布日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.publishDate}</TableCell>
                  <TableCell>{item.status === 'active' ? '已发布' : '草稿'}</TableCell>
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
            <DialogTitle>发布新公告</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">标题</Label>
              <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">分类</Label>
              <Input id="category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">内容</Label>
              <Textarea id="content" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleAddSubmit}>发布</Button>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑公告</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">标题</Label>
              <Input id="edit-title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">分类</Label>
              <Input id="edit-category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-content" className="text-right">内容</Label>
              <Textarea id="edit-content" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="col-span-3" />
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
            <DialogTitle>公告详情</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">标题</Label>
              <p className="col-span-3">{selected?.title}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">分类</Label>
              <p className="col-span-3">{selected?.category}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">内容</Label>
              <p className="col-span-3">{selected?.content}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">发布日期</Label>
              <p className="col-span-3">{selected?.publishDate}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">状态</Label>
              <p className="col-span-3">{selected?.status === 'active' ? '已发布' : '草稿'}</p>
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
          <p>确定要删除公告“{deleteTarget?.title}”吗？该操作不可恢复。</p>
          <DialogFooter className="mt-4">
            <Button variant="destructive" onClick={handleDeleteConfirm}>删除</Button>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementManagement;
