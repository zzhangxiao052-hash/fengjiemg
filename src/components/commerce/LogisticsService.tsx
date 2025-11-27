import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Search, Eye, MapPin, Plus, Save, Upload, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LogisticsServiceProps {
  onNavigate: (page: string) => void;
}

export default function LogisticsService({ onNavigate }: LogisticsServiceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([
    { id: '1', company: '物流公司A', route: '奉节→重庆', capacity: '100吨', price: '¥3000/吨', contactNumber: '13800138000', address: '奉节县物流中心A区', serviceTags: '整车,零担', description: '当日达', status: '可用' },
    { id: '2', company: '运输公司B', route: '奉节→成都', capacity: '80吨', price: '¥3500/吨', contactNumber: '13912345678', address: '奉节县工业园B区', serviceTags: '冷链,仓储', description: '次日达', status: '可用' },
    { id: '3', company: '货运公司C', route: '奉节→武汉', capacity: '120吨', price: '¥4000/吨', contactNumber: '13787654321', address: '奉节县商贸城C区', serviceTags: '快递,专线', description: '两日达', status: '繁忙' },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState<any | null>(null);
  const [logisticsForm, setLogisticsForm] = useState({
    logo: '',
    name: '',
    route: '',
    capacity: '',
    price: '',
    contactNumber: '',
    address: '',
    serviceTags: '',
    description: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setLogisticsForm({ ...logisticsForm, logo: file.name });
    setUploadProgress(1);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success('附件上传完成');
          return 100;
        }
        return prev + 7;
      });
    }, 120);
  };

  const handleAdd = () => {
    setLogisticsForm({ logo: '', name: '', route: '', capacity: '', price: '', contactNumber: '', address: '', serviceTags: '', description: '' });
    setUploadProgress(0);
    setEditMode(false);
    setCurrentService(null);
    setShowAddDialog(true);
  };

  const handleSubmit = () => {
    if (!logisticsForm.name || !logisticsForm.route) {
      toast.error('请填写服务名称和运输路线');
      return;
    }
    if (editMode && currentService) {
      setServices(services.map(s => s.id === currentService.id ? {
        ...s,
        company: logisticsForm.name,
        route: logisticsForm.route,
        capacity: logisticsForm.capacity || '-',
        price: logisticsForm.price || '-',
        contactNumber: logisticsForm.contactNumber || '-',
        address: logisticsForm.address || '-',
        serviceTags: logisticsForm.serviceTags || '-',
        description: logisticsForm.description || '-',
      } : s));
      toast.success('物流服务已更新');
    } else {
      const newItem = {
        id: String(services.length + 1),
        company: logisticsForm.name,
        route: logisticsForm.route,
        capacity: logisticsForm.capacity || '-',
        price: logisticsForm.price || '-',
        contactNumber: logisticsForm.contactNumber || '-',
        address: logisticsForm.address || '-',
        serviceTags: logisticsForm.serviceTags || '-',
        description: logisticsForm.description || '-',
        status: '可用',
      };
      setServices([newItem, ...services]);
      toast.success('物流服务已添加');
    }
    setShowAddDialog(false);
  };

  const filtered = services.filter(s => 
    s.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (id: string) => {
    onNavigate(`logistics-service-detail-${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">物流服务查看</h1>
          <p className="text-slate-500 mt-1">查看物流服务和运输线路</p>
        </div>
        <Button onClick={handleAdd} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          <Plus className="h-4 w-4 mr-2" />
          新增物流
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索物流公司或线路..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>服务名称</TableHead>
                  <TableHead>运输路线</TableHead>
                  <TableHead>运输能力</TableHead>
                  <TableHead>价格</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>地址</TableHead>
                  <TableHead>服务标签</TableHead>
                  <TableHead>服务描述</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((service) => (
                  <TableRow key={service.id} className="hover:bg-slate-50">
                    <TableCell>{service.company}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {service.route}
                      </div>
                    </TableCell>
                    <TableCell>{service.capacity}</TableCell>
                    <TableCell>{service.price}</TableCell>
                    <TableCell>{service.contactNumber}</TableCell>
                    <TableCell>{service.address}</TableCell>
                    <TableCell>{service.serviceTags}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>
                      <Badge className={service.status === '可用' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewDetails(service.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditService(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>新增物流服务</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="logistics-logo">企业Logo</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-[#1E3A8A] transition-colors cursor-pointer">
                <input id="logistics-logo" type="file" className="hidden" onChange={handleFileUpload} />
                <label htmlFor="logistics-logo" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-slate-600">点击或拖拽文件到此处上传</p>
                  {logisticsForm.logo && <p className="text-sm text-slate-500 mt-2">已选择文件: {logisticsForm.logo}</p>}
                </label>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logistics-name">服务名称 *</Label>
              <Input id="logistics-name" value={logisticsForm.name} onChange={(e) => setLogisticsForm({ ...logisticsForm, name: e.target.value })} placeholder="请输入服务名称" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logistics-route">运输路线 *</Label>
              <Input id="logistics-route" value={logisticsForm.route} onChange={(e) => setLogisticsForm({ ...logisticsForm, route: e.target.value })} placeholder="如：重庆 → 上海" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="logistics-capacity">运输能力</Label>
                <Input id="logistics-capacity" value={logisticsForm.capacity} onChange={(e) => setLogisticsForm({ ...logisticsForm, capacity: e.target.value })} placeholder="如：50吨" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logistics-price">价格</Label>
                <Input id="logistics-price" value={logisticsForm.price} onChange={(e) => setLogisticsForm({ ...logisticsForm, price: e.target.value })} placeholder="如：¥5000" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logistics-contact">联系电话</Label>
              <Input id="logistics-contact" value={logisticsForm.contactNumber} onChange={(e) => setLogisticsForm({ ...logisticsForm, contactNumber: e.target.value })} placeholder="请输入联系电话" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logistics-address">地址</Label>
              <Input id="logistics-address" value={logisticsForm.address} onChange={(e) => setLogisticsForm({ ...logisticsForm, address: e.target.value })} placeholder="请输入地址" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logistics-tags">服务标签</Label>
              <Input id="logistics-tags" value={logisticsForm.serviceTags} onChange={(e) => setLogisticsForm({ ...logisticsForm, serviceTags: e.target.value })} placeholder="如：快递服务、仓储服务、冷链物流" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logistics-description">服务描述</Label>
              <Textarea id="logistics-description" value={logisticsForm.description} onChange={(e) => setLogisticsForm({ ...logisticsForm, description: e.target.value })} placeholder="请输入服务描述" rows={4} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => toast.success('草稿已保存')}>
                <Save className="h-4 w-4 mr-2" />
                保存草稿
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">立即发布</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
  const handleEditService = (service: any) => {
    setEditMode(true);
    setCurrentService(service);
    setLogisticsForm({
      logo: '',
      name: service.company || '',
      route: service.route || '',
      capacity: service.capacity || '',
      price: service.price || '',
      contactNumber: service.contactNumber || '',
      address: service.address || '',
      serviceTags: service.serviceTags || '',
      description: service.description || '',
    });
    setShowAddDialog(true);
  };

  const handleDeleteService = (id: string) => {
    const target = services.find(s => s.id === id);
    setServices(services.filter(s => s.id !== id));
    const record = {
      id: `${Date.now()}-${id}`,
      type: '物流服务',
      action: '删除',
      target: target ? `${target.company} - ${target.route}` : id,
      operator: '商务委管理员',
      timestamp: new Date().toLocaleString(),
    };
    try {
      const key = 'commerceHistory';
      const existing = localStorage.getItem(key);
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem(key, JSON.stringify([record, ...list]));
    } catch {}
    toast.success('已删除物流服务');
  };
