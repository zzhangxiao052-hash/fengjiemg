import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdvancedManufacturing {
  id: string;
  text: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export default function AdvancedManufacturingManagement() {
  const [projects, setProjects] = useState<AdvancedManufacturing[]>([
    { id: '1', text: '智能制造项目招商，欢迎高科技企业入驻。', address: '园区A区101号', contactPerson: '张经理', phone: '13800138000', email: 'zhang@example.com' },
    { id: '2', text: '新能源汽车产业园招商，提供优惠政策。', address: '园区B区202号', contactPerson: '李经理', phone: '13912345678', email: 'li@example.com' },
  ]);

  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [currentProject, setCurrentProject] = useState<AdvancedManufacturing | null>(null);
  const [formData, setFormData] = useState<Omit<AdvancedManufacturing, 'id'>>({
    text: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: '',
  });

  const handleAddEdit = () => {
    if (!formData.text || !formData.address || !formData.contactPerson || !formData.phone || !formData.email) {
      toast.error('请填写所有项目信息');
      return;
    }

    if (currentProject) {
      // Edit existing project
      setProjects(projects.map(proj => 
        proj.id === currentProject.id ? { ...proj, ...formData } : proj
      ));
      toast.success('项目信息已更新');
    } else {
      // Add new project
      const newProject: AdvancedManufacturing = {
        id: String(projects.length + 1),
        ...formData,
      };
      setProjects([...projects, newProject]);
      toast.success('项目信息已添加');
    }
    setShowAddEditDialog(false);
    setCurrentProject(null);
    setFormData({ text: '', address: '', contactPerson: '', phone: '', email: '' });
  };

  const handleEditClick = (project: AdvancedManufacturing) => {
    setCurrentProject(project);
    setFormData({ text: project.text, address: project.address, contactPerson: project.contactPerson, phone: project.phone, email: project.email });
    setShowAddEditDialog(true);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id));
    toast.success('项目已删除');
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>先进制造业项目产业招商管理</CardTitle>
        <Button onClick={() => {
          setCurrentProject(null);
          setFormData({ text: '', address: '', contactPerson: '', phone: '', email: '' });
          setShowAddEditDialog(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> 添加招商项目
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map(project => (
            <div key={project.id} className="p-4 border rounded-md">
              <p className="font-medium">{project.text}</p>
              <p className="text-sm text-slate-600">地址: {project.address}</p>
              <p className="text-sm text-slate-600">联系人: {project.contactPerson}</p>
              <p className="text-sm text-slate-600">电话: {project.phone}</p>
              <p className="text-sm text-slate-600">邮箱: {project.email}</p>
              <div className="flex space-x-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(project)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={showAddEditDialog} onOpenChange={setShowAddEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentProject ? '编辑招商项目' : '添加招商项目'}</DialogTitle>
            <DialogDescription>填写先进制造业招商项目的详细信息。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text" className="text-right">文案</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">招商地址</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPerson" className="text-right">联系人</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">联系电话</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddEdit}>保存</Button>
            <Button variant="outline" onClick={() => setShowAddEditDialog(false)}>取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}