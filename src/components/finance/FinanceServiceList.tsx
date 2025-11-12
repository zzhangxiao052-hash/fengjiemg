import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Plus, Search, Edit, Trash2, Eye, FileEdit } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface Service {
  id: string;
  name: string;
  institution: string;
  type: string;
  status: string;
  rate: string;
  createTime: string;
}

export default function FinanceServiceList() {
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: '中小企业信用贷款', institution: '重庆银行', type: '贷款', status: '已上架', rate: '4.5%', createTime: '2024-10-15' },
    { id: '2', name: '企业融资担保', institution: '长江证券', type: '担保', status: '已上架', rate: '3.8%', createTime: '2024-10-14' },
    { id: '3', name: '供应链金融服务', institution: '工商银行', type: '贷款', status: '待审核', rate: '5.2%', createTime: '2024-10-13' },
    { id: '4', name: '股权融资咨询', institution: '招商证券', type: '咨询', status: '已上架', rate: '1.5%', createTime: '2024-10-12' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    institution: '',
    type: '',
    rate: '',
    description: '',
  });

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || service.type === filterType;
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAdd = () => {
    setEditMode(false);
    setFormData({ name: '', institution: '', type: '', rate: '', description: '' });
    setShowAddDialog(true);
  };

  const handleEdit = (service: Service) => {
    setEditMode(true);
    setSelectedService(service);
    setFormData({
      name: service.name,
      institution: service.institution,
      type: service.type,
      rate: service.rate,
      description: '',
    });
    setShowAddDialog(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.institution || !formData.type || !formData.rate) {
      toast.error('请填写所有必填项');
      return;
    }

    if (editMode && selectedService) {
      setServices(services.map(s => 
        s.id === selectedService.id 
          ? { ...s, ...formData }
          : s
      ));
      toast.success('金融服务已更新');
    } else {
      const newService: Service = {
        id: String(services.length + 1),
        ...formData,
        status: '待审核',
        createTime: new Date().toISOString().split('T')[0],
      };
      setServices([newService, ...services]);
      toast.success('金融服务已添加');
    }
    
    setShowAddDialog(false);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedService) {
      setServices(services.filter(s => s.id !== selectedService.id));
      toast.success('金融服务已删除');
    }
    setShowDeleteDialog(false);
  };

  const handleViewDetail = (service: Service) => {
    setSelectedService(service);
    setShowDetailDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">金融服务管理</h1>
          <p className="text-slate-500 mt-1">管理和维护金融服务信息</p>
        </div>
        <Button onClick={handleAdd} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          <Plus className="h-4 w-4 mr-2" />
          新增服务
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="搜索服务名称或金融机构..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="服务类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="贷款">贷款</SelectItem>
                <SelectItem value="担保">担保</SelectItem>
                <SelectItem value="咨询">咨询</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="已上架">已上架</SelectItem>
                <SelectItem value="待审核">待审核</SelectItem>
                <SelectItem value="已下架">已下架</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>服务名称</TableHead>
                  <TableHead>金融机构</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>利率</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id} className="hover:bg-slate-50">
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.institution}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.type}</Badge>
                    </TableCell>
                    <TableCell>{service.rate}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          service.status === '已上架' ? 'bg-green-100 text-green-700' :
                          service.status === '待审核' ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-700'
                        }
                      >
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{service.createTime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetail(service)}
                        >
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

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editMode ? '编辑金融服务' : '新增金融服务'}</DialogTitle>
            <DialogDescription>
              {editMode ? '修改金融服务信息' : '填写以下信息以添加新的金融服务'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">服务名称 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="请输入服务名称"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="institution">金融机构 *</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="请输入金融机构名称"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">服务类型 *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="贷款">贷款</SelectItem>
                    <SelectItem value="担保">担保</SelectItem>
                    <SelectItem value="咨询">咨询</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rate">利率 *</Label>
                <Input
                  id="rate"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  placeholder="如：4.5%"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">服务描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="请输入服务描述"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              {editMode ? '保存' : '添加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>服务详情</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="space-y-4">
              <div>
                <Label>服务名称</Label>
                <p className="mt-1 text-slate-700">{selectedService.name}</p>
              </div>
              <div>
                <Label>金融机构</Label>
                <p className="mt-1 text-slate-700">{selectedService.institution}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>服务类型</Label>
                  <p className="mt-1 text-slate-700">{selectedService.type}</p>
                </div>
                <div>
                  <Label>利率</Label>
                  <p className="mt-1 text-slate-700">{selectedService.rate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>状态</Label>
                  <p className="mt-1 text-slate-700">{selectedService.status}</p>
                </div>
                <div>
                  <Label>创建时间</Label>
                  <p className="mt-1 text-slate-700">{selectedService.createTime}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailDialog(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除服务"{selectedService?.name}"吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
