import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';

interface Role {
  id: string;
  name: string;
  permissions: string; // 简化为逗号分隔的权限代码
  description: string;
}

const initialRoles: Role[] = [
  { id: '1', name: '管理员', permissions: 'enterprise.view,content.edit,account.manage', description: '系统超级管理员' },
  { id: '2', name: '内容运营', permissions: 'content.edit', description: '负责网站内容维护' },
];

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selected, setSelected] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', permissions: '', description: '' });

  const filtered = roles.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.permissions.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ name: '', permissions: '', description: '' });
    setShowAddDialog(true);
  };
  const handleAddSubmit = () => {
    const newItem: Role = {
      id: (roles.length + 1).toString(),
      name: formData.name,
      permissions: formData.permissions,
      description: formData.description,
    };
    setRoles([...roles, newItem]);
    setShowAddDialog(false);
  };

  const handleEdit = (item: Role) => {
    setSelected(item);
    setFormData({ name: item.name, permissions: item.permissions, description: item.description });
    setShowEditDialog(true);
  };
  const handleEditSubmit = () => {
    if (!selected) return;
    setRoles(roles.map(r => r.id === selected.id ? { ...r, ...formData } : r));
    setShowEditDialog(false);
  };

  const handleDetail = (item: Role) => {
    setSelected(item);
    setShowDetailDialog(true);
  };

  const handleDeleteInit = (item: Role) => {
    setDeleteTarget(item);
    setShowDeleteDialog(true);
  };
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setRoles(roles.filter(r => r.id !== deleteTarget.id));
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">角色管理</h1>
        <Button onClick={handleAdd} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">新增角色</Button>
      </div>
      <Card>
        <CardHeader>
          <Input
            placeholder="搜索角色名称或权限代码..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-1/2"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>角色名称</TableHead>
                <TableHead>权限代码</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.permissions}</TableCell>
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

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增角色</DialogTitle>
          </DialogHeader>
          <Label htmlFor="r-name">角色名称</Label>
          <Input id="r-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <Label htmlFor="r-perms">权限代码（逗号分隔）</Label>
          <Input id="r-perms" value={formData.permissions} onChange={e => setFormData({ ...formData, permissions: e.target.value })} />
          <Label htmlFor="r-desc">描述</Label>
          <Input id="r-desc" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <DialogFooter className="mt-4">
            <Button onClick={handleAddSubmit}>保存</Button>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑角色</DialogTitle>
          </DialogHeader>
          <Label htmlFor="e-name">角色名称</Label>
          <Input id="e-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          <Label htmlFor="e-perms">权限代码（逗号分隔）</Label>
          <Input id="e-perms" value={formData.permissions} onChange={e => setFormData({ ...formData, permissions: e.target.value })} />
          <Label htmlFor="e-desc">描述</Label>
          <Input id="e-desc" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <DialogFooter className="mt-4">
            <Button onClick={handleEditSubmit}>保存</Button>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>角色详情</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <div>
              <Label>角色名称</Label>
              <p className="mt-1 text-slate-700">{selected?.name}</p>
            </div>
            <div>
              <Label>权限代码</Label>
              <p className="mt-1 text-slate-700">{selected?.permissions}</p>
            </div>
            <div>
              <Label>描述</Label>
              <p className="mt-1 text-slate-700">{selected?.description}</p>
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
          <p>确定要删除角色“{deleteTarget?.name}”吗？该操作不可恢复。</p>
          <DialogFooter className="mt-4">
            <Button variant="destructive" onClick={handleDeleteConfirm}>删除</Button>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;
