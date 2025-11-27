import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Upload, Search, Eye } from 'lucide-react';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Person {
  id: string;
  name: string;
  education: string;
  area: string;
  jobType: string;
  workExperience: string;
  phone: string;
}

export default function UnemployedManagement() {
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: '张三', education: '本科', area: '奉节县', jobType: '前端开发', workExperience: '3年', phone: '138****1234' },
    { id: '2', name: '李四', education: '大专', area: '重庆市', jobType: '后端开发', workExperience: '5年', phone: '139****5678' },
    { id: '3', name: '王五', education: '硕士', area: '奉节县', jobType: 'UI设计', workExperience: '2年', phone: '137****9012' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEducation, setFilterEducation] = useState('all');
  const [filterJobType, setFilterJobType] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editPersonData, setEditPersonData] = useState<Person | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toDeletePerson, setToDeletePerson] = useState<Person | null>(null);

  const initialNewPersonData: Person = {
    id: '',
    name: '',
    education: '',
    area: '',
    jobType: '',
    workExperience: '',
    phone: '',
  };
  const [newPersonData, setNewPersonData] = useState<Person>(initialNewPersonData);

  const filteredPeople = people.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEducation = filterEducation === 'all' || p.education === filterEducation;
    const matchesJobType = filterJobType === 'all' || p.jobType === filterJobType;
    return matchesSearch && matchesEducation && matchesJobType;
  });

  const handleView = (person: Person) => {
    setSelectedPerson(person);
    setShowViewDialog(true);
  };

  const addHistoryRecord = (action: '删除' | '修改', before: Person, after?: Person) => {
    const key = 'hrHistory';
    const existing = localStorage.getItem(key);
    const list = existing ? JSON.parse(existing) : [];
    const record = {
      id: `${Date.now()}`,
      type: '待岗人员',
      action,
      target: `${before.name}(${before.id})`,
      operator: '人资管理员',
      timestamp: new Date().toLocaleString(),
      before,
      after: after || null,
    };
    localStorage.setItem(key, JSON.stringify([record, ...list]));
  };

  const handleImport = () => {
    toast.success('批量导入成功');
    setShowUploadDialog(false);
  };

  const handleAdd = () => {
    setNewPersonData(initialNewPersonData);
    setShowAddDialog(true);
  };

  const handleSaveNewPerson = () => {
    const newId = (people.length + 1).toString();
    setPeople([...people, { ...newPersonData, id: newId }]);
    toast.success('人员信息添加成功');
    setShowAddDialog(false);
    setNewPersonData(initialNewPersonData);
  };

  const handleEdit = (person: Person) => {
    setEditPersonData({ ...person });
    setShowEditDialog(true);
  };

  const handleSaveEditPerson = () => {
    if (!editPersonData) return;
    setPeople(prev => prev.map(p => (p.id === editPersonData.id ? editPersonData : p)));
    const before = selectedPerson || people.find(p => p.id === editPersonData.id)!;
    addHistoryRecord('修改', before, editPersonData);
    toast.success('人员信息修改成功');
    setShowEditDialog(false);
    setEditPersonData(null);
  };

  const handleDelete = (person: Person) => {
    setToDeletePerson(person);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!toDeletePerson) return;
    setPeople(prev => prev.filter(p => p.id !== toDeletePerson.id));
    addHistoryRecord('删除', toDeletePerson);
    toast.success('人员已删除');
    setShowDeleteDialog(false);
    setToDeletePerson(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">待岗人员管理</h1>
          <p className="text-slate-500 mt-1">管理和维护待岗人员信息</p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          <Upload className="h-4 w-4 mr-2" />
          批量导入
        </Button>
        <Button onClick={handleAdd} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 ml-2">
          手动添加
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="搜索姓名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterEducation} onValueChange={setFilterEducation}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="学历" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部学历</SelectItem>
                <SelectItem value="本科">本科</SelectItem>
                <SelectItem value="大专">大专</SelectItem>
                <SelectItem value="硕士">硕士</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterJobType} onValueChange={setFilterJobType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="工种" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部工种</SelectItem>
                <SelectItem value="前端开发">前端开发</SelectItem>
                <SelectItem value="后端开发">后端开发</SelectItem>
                <SelectItem value="UI设计">UI设计</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>姓名</TableHead>
                  <TableHead>学历</TableHead>
                  <TableHead>所在地区</TableHead>
                  <TableHead>工种</TableHead>
                  <TableHead>工作年限</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPeople.map((person) => (
                  <TableRow key={person.id} className="hover:bg-slate-50">
                    <TableCell>{person.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{person.education}</Badge>
                    </TableCell>
                    <TableCell>{person.area}</TableCell>
                    <TableCell>{person.jobType}</TableCell>
                    <TableCell>{person.workExperience}</TableCell>
                    <TableCell>{person.phone}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(person)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>查看人员信息</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(person)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>修改人员信息</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(person)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>删除人员</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>批量导入人员信息</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-[#1E3A8A] transition-colors cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-slate-400 mb-3" />
              <p className="text-slate-600">点击或拖拽Excel文件到此处</p>
              <p className="text-slate-400 text-sm mt-2">支持 .xlsx, .xls 格式</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              取消
            </Button>
            <Button onClick={handleImport} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              确认导入
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>手动添加人员信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name">姓名</Label>
              <Input
                id="add-name"
                value={newPersonData.name}
                onChange={(e) => setNewPersonData({ ...newPersonData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-education">学历</Label>
              <Select
                value={newPersonData.education}
                onValueChange={(value) => setNewPersonData({ ...newPersonData, education: value })}
              >
                <SelectTrigger id="add-education">
                  <SelectValue placeholder="选择学历" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="本科">本科</SelectItem>
                  <SelectItem value="大专">大专</SelectItem>
                  <SelectItem value="硕士">硕士</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-area">所在地区</Label>
              <Input
                id="add-area"
                value={newPersonData.area}
                onChange={(e) => setNewPersonData({ ...newPersonData, area: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-jobType">工种</Label>
              <Input
                id="add-jobType"
                value={newPersonData.jobType}
                onChange={(e) => setNewPersonData({ ...newPersonData, jobType: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-workExperience">工作年限</Label>
              <Input
                id="add-workExperience"
                value={newPersonData.workExperience}
                onChange={(e) => setNewPersonData({ ...newPersonData, workExperience: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-phone">联系电话</Label>
              <Input
                id="add-phone"
                value={newPersonData.phone}
                onChange={(e) => setNewPersonData({ ...newPersonData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-resume">简历附件</Label>
              <Input
                id="add-resume"
                type="file"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSaveNewPerson} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改人员信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">姓名</Label>
              <Input
                id="edit-name"
                value={editPersonData?.name || ''}
                onChange={(e) => setEditPersonData(prev => prev ? { ...prev, name: e.target.value } : prev)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-education">学历</Label>
              <Select
                value={editPersonData?.education || ''}
                onValueChange={(value) => setEditPersonData(prev => prev ? { ...prev, education: value } : prev)}
              >
                <SelectTrigger id="edit-education">
                  <SelectValue placeholder="选择学历" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="本科">本科</SelectItem>
                  <SelectItem value="大专">大专</SelectItem>
                  <SelectItem value="硕士">硕士</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-area">所在地区</Label>
              <Input
                id="edit-area"
                value={editPersonData?.area || ''}
                onChange={(e) => setEditPersonData(prev => prev ? { ...prev, area: e.target.value } : prev)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-jobType">工种</Label>
              <Input
                id="edit-jobType"
                value={editPersonData?.jobType || ''}
                onChange={(e) => setEditPersonData(prev => prev ? { ...prev, jobType: e.target.value } : prev)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-workExperience">工作年限</Label>
              <Input
                id="edit-workExperience"
                value={editPersonData?.workExperience || ''}
                onChange={(e) => setEditPersonData(prev => prev ? { ...prev, workExperience: e.target.value } : prev)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">联系电话</Label>
              <Input
                id="edit-phone"
                value={editPersonData?.phone || ''}
                onChange={(e) => setEditPersonData(prev => prev ? { ...prev, phone: e.target.value } : prev)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSaveEditPerson} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              是否删除人员 {toDeletePerson?.name}（ID: {toDeletePerson?.id}）？该操作将记录到历史记录。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>查看人员信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                value={selectedPerson?.name}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="education">学历</Label>
              <Input
                id="education"
                value={selectedPerson?.education}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="area">所在地区</Label>
              <Input
                id="area"
                value={selectedPerson?.area}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jobType">工种</Label>
              <Input
                id="jobType"
                value={selectedPerson?.jobType}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workExperience">工作年限</Label>
              <Input
                id="workExperience"
                value={selectedPerson?.workExperience}
                readOnly
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">联系电话</Label>
              <Input
                id="phone"
                value={selectedPerson?.phone}
                readOnly
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
