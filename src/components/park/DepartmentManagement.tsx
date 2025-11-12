import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from "sonner";

interface Department {
  id: string;
  name: string;
  description: string;
}

const initialDepartments: Department[] = [
  { id: '1', name: '行政部', description: '负责行政管理' },
  { id: '2', name: '人事部', description: '负责人力资源管理' },
  { id: '3', name: '财务部', description: '负责财务管理' },
];

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce delay
  
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // 新增部门
  const handleAdd = () => {
    setFormData({ name: '', description: '' });
    setShowAddDialog(true);
  };
  const handleAddSubmit = () => {
    const newDepartment: Department = {
      id: (departments.length + 1).toString(),
      name: formData.name,
      description: formData.description,
    };
    setDepartments([...departments, newDepartment]);
    setShowAddDialog(false);
    toast.success("部门添加成功！");
  };

  // 编辑部门
  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({ name: department.name, description: department.description });
    setShowEditDialog(true);
  };
  const handleEditSubmit = () => {
    if (!selectedDepartment) return;
    setDepartments(departments.map(d =>
      d.id === selectedDepartment.id ? { ...d, ...formData } : d
    ));
    setShowEditDialog(false);
    toast.success("部门编辑成功！");
  };

  // 删除部门（确认弹窗）
  const handleDeleteInit = (department: Department) => {
    setDeleteTarget(department);
    setShowDeleteDialog(true);
  };
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setDepartments(departments.filter(d => d.id !== deleteTarget.id));
    setShowDeleteDialog(false);
    setDeleteTarget(null);
    toast.success("部门删除成功！");
  };

  // 查看详情
  const handleDetail = (department: Department) => {
    setSelectedDepartment(department);
    setShowDetailDialog(true);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">部门管理</h1>
        <Button onClick={handleAdd} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">新增部门</Button>
      </div>
      <Card>
        <CardHeader>
          <Input
            placeholder="搜索部门名称..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-1/2"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              onClick={() => setSearchTerm('')}
              className="ml-2"
            >
              清除
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>部门名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map(department => (
                <TableRow key={department.id}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell>{department.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleDetail(department)}>查看</Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(department)}>编辑</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteInit(department)}>删除</Button>
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
              <DialogTitle>新增部门</DialogTitle>
            </DialogHeader>
            <Label htmlFor="name">部门名称</Label>
            <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <Label htmlFor="description">描述</Label>
            <Input id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            <DialogFooter className="mt-4">
              <Button onClick={handleAddSubmit}>保存</Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>取消</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showEditDialog && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="overflow-y-auto max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>编辑部门</DialogTitle>
            </DialogHeader>
            <Label htmlFor="edit-name">部门名称</Label>
            <Input id="edit-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <Label htmlFor="edit-description">描述</Label>
            <Input id="edit-description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            <DialogFooter className="mt-4">
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
              <DialogTitle>部门详情</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <div>
                <Label>部门名称</Label>
                <p className="mt-1 text-slate-700">{selectedDepartment?.name}</p>
              </div>
              <div>
                <Label>描述</Label>
                <p className="mt-1 text-slate-700">{selectedDepartment?.description}</p>
              </div>
            </div>
            <DialogFooter className="mt-4">
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
            <p>确定要删除部门“{deleteTarget?.name}”吗？该操作不可恢复。</p>
            <DialogFooter className="mt-4">
              <Button variant="destructive" onClick={handleDeleteConfirm}>删除</Button>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>取消</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DepartmentManagement;