import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';

interface Account {
  id: string;
  username: string;
  password?: string; // Add password field
  role: string;
  status: string;
  email: string;
}

const initialAccounts: Account[] = [
  { id: '1', username: 'admin', password: 'admin123', role: '管理员', status: '启用', email: 'admin@park.com' },
  { id: '2', username: 'hr_manager', password: 'hr123', role: '人事', status: '启用', email: 'hr@park.com' },
  { id: '3', username: 'finance_lead', password: 'finance123', role: '财务', status: '禁用', email: 'finance@park.com' },
];

const AccountManagement: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: '', status: '启用', email: '' });

  const filteredAccounts = accounts.filter(a =>
    a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 新增账号
  const handleAdd = () => {
    setFormData({ username: '', password: '', role: '', status: '启用', email: '' });
    setShowAddDialog(true);
  };
  const handleAddSubmit = () => {
    const newAccount: Account = {
      id: (accounts.length + 1).toString(),
      username: formData.username,
      password: formData.password,
      role: formData.role,
      status: formData.status,
      email: formData.email,
    };
    setAccounts([...accounts, newAccount]);
    setShowAddDialog(false);
  };

  // 编辑账号
  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setFormData({ username: account.username, password: account.password || '', role: account.role, status: account.status, email: account.email });
    setShowEditDialog(true);
  };
  const handleEditSubmit = () => {
    if (!selectedAccount) return;
    setAccounts(accounts.map(a =>
      a.id === selectedAccount.id ? { ...a, ...formData } : a
    ));
    setShowEditDialog(false);
  };

  // 删除账号（确认弹窗）
  const handleDeleteInit = (account: Account) => {
    setDeleteTarget(account);
    setShowDeleteDialog(true);
  };
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setAccounts(accounts.filter(a => a.id !== deleteTarget.id));
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  // 查看详情
  const handleDetail = (account: Account) => {
    setSelectedAccount(account);
    setShowDetailDialog(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">账号管理</h1>
        <Button onClick={handleAdd} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">新增账号</Button>
      </div>
      <Card>
        <CardHeader>
          <Input
            placeholder="搜索用户名或邮箱..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-1/2"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户名</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map(account => (
                <TableRow key={account.id}>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>{account.role}</TableCell>
                  <TableCell>{account.status}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleDetail(account)}>查看</Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(account)}>编辑</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteInit(account)}>删除</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增账号弹窗 */}
      {showAddDialog && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增账号</DialogTitle>
            </DialogHeader>
            <Label htmlFor="username">用户名</Label>
            <Input id="username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
            <Label htmlFor="password">密码</Label>
            <Input id="password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            <Label htmlFor="role">角色</Label>
            <Input id="role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
            <Label htmlFor="status">状态</Label>
            <Input id="status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} />
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <DialogFooter>
              <Button onClick={handleAddSubmit}>保存</Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 编辑账号弹窗 */}
      {showEditDialog && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑账号</DialogTitle>
            </DialogHeader>
            <Label htmlFor="edit-username">用户名</Label>
            <Input id="edit-username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
            <Label htmlFor="edit-password">密码</Label>
            <Input id="edit-password" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            <Label htmlFor="edit-role">角色</Label>
            <Input id="edit-role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
            <Label htmlFor="edit-status">状态</Label>
            <Input id="edit-status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} />
            <Label htmlFor="edit-email">邮箱</Label>
            <Input id="edit-email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <DialogFooter>
              <Button onClick={handleEditSubmit}>保存</Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>取消</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 查看详情弹窗 */}
      {showDetailDialog && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>账号详情</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div>
                <Label>用户名</Label>
                <p className="mt-1 text-slate-700">{selectedAccount?.username}</p>
              </div>
              <div>
                <Label>密码</Label>
                <p className="mt-1 text-slate-700">{selectedAccount?.password}</p>
              </div>
              <div>
                <Label>角色</Label>
                <p className="mt-1 text-slate-700">{selectedAccount?.role}</p>
              </div>
              <div>
                <Label>状态</Label>
                <p className="mt-1 text-slate-700">{selectedAccount?.status}</p>
              </div>
              <div>
                <Label>邮箱</Label>
                <p className="mt-1 text-slate-700">{selectedAccount?.email}</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowDetailDialog(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 删除确认弹窗 */}
      {showDeleteDialog && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认删除</DialogTitle>
            </DialogHeader>
            <p>确定要删除账号“{deleteTarget?.username}”吗？该操作不可恢复。</p>
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

export default AccountManagement;