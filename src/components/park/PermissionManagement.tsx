import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';

interface Permission {
  id: string;
  name: string;
  code: string;
  description: string;
}

const initialPermissions: Permission[] = [
  { id: '1', name: '查看企业', code: 'enterprise.view', description: '允许查看企业信息' },
  { id: '2', name: '编辑内容', code: 'content.edit', description: '允许编辑网站内容' },
  { id: '3', name: '管理账号', code: 'account.manage', description: '允许新增、编辑、删除账号' },
];

const PermissionManagement: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selected, setSelected] = useState<Permission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  const filtered = permissions.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ name: '', code: '', description: '' });
    setShowAddDialog(true);
  };
  const handleAddSubmit = () => {
    const newItem: Permission = {
      id: (permissions.length + 1).toString(),
      name: formData.name,
      code: formData.code,
      description: formData.description,
    };
    setPermissions([...permissions, newItem]);
    setShowAddDialog(false);
  };

  const handleEdit = (item: Permission) => {
    setSelected(item);
    setFormData({ name: item.name, code: item.code, description: item.description });
    setShowEditDialog(true);
  };
  const handleEditSubmit = () => {
    if (!selected) return;
    setPermissions(permissions.map(p => p.id === selected.id ? { ...p, ...formData } : p));
    setShowEditDialog(false);
  };

  const handleDetail = (item: Permission) => {
    setSelected(item);
    setShowDetailDialog(true);
  };

  const handleDeleteInit = (item: Permission) => {
    setDeleteTarget(item);
    setShowDeleteDialog(true);
  };
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setPermissions(permissions.filter(p => p.id !== deleteTarget.id));
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">权限管理</h1>
        <Button onClick={handleAdd} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">新增权限</Button>
      </div>
      <Card>
        <CardHeader>
          <Input
            placeholder="搜索权限名称或代码..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-1/2"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>权限名称</TableHead>
                <TableHead>代码</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.description}</TableCell>
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

      {showAddDialog && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增权限</DialogTitle>
            </DialogHeader>
            <Label htmlFor="p-name">权限名称</Label>
            <Input id="p-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <Label htmlFor="p-code">代码</Label>
            <Input id="p-code" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
            <Label htmlFor="p-desc">描述</Label>
            <Input id="p-desc" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            <DialogFooter>
              <Button onClick={handleAddSubmit}>保存</Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showEditDialog && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑权限</DialogTitle>
            </DialogHeader>
            <Label htmlFor="e-name">权限名称</Label>
            <Input id="e-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <Label htmlFor="e-code">代码</Label>
            <Input id="e-code" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
            <Label htmlFor="e-desc">描述</Label>
            <Input id="e-desc" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            <DialogFooter>
              <Button onClick={handleEditSubmit}>保存</Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>取消</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showDetailDialog && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>权限详情</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div>
                <Label>权限名称</Label>
                <p className="mt-1 text-slate-700">{selected?.name}</p>
              </div>
              <div>
                <Label>代码</Label>
                <p className="mt-1 text-slate-700">{selected?.code}</p>
              </div>
              <div>
                <Label>描述</Label>
                <p className="mt-1 text-slate-700">{selected?.description}</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowDetailDialog(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认删除</DialogTitle>
            </DialogHeader>
            <p>确定要删除权限“{deleteTarget?.name}”吗？该操作不可恢复。</p>
            <DialogFooter>
              <Button variant="destructive" onClick={handleDeleteConfirm}>删除</Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>取消</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PermissionManagement;
