import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  status: 'active' | 'inactive';
  startDate: string;
  endDate: string;
}

export default function AdManagement() {
  const [ads, setAds] = useState<Ad[]>([
    { id: '1', title: '园区招商广告', imageUrl: '', link: '#', status: 'active', startDate: '2024-01-01', endDate: '2024-12-31' },
    { id: '2', title: '科技创新大会', imageUrl: '', link: '#', status: 'inactive', startDate: '2024-03-01', endDate: '2024-03-31' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    link: '',
    status: 'active' as 'active' | 'inactive',
    startDate: '',
    endDate: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const filteredAds = ads.filter(ad =>
    ad.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAd = () => {
    setCurrentAd(null);
    setFormData({
      title: '',
      imageUrl: '',
      link: '',
      status: 'active',
      startDate: '',
      endDate: '',
    });
    setImageFile(null);
    setShowAddEditDialog(true);
  };

  const handleEditAd = (ad: Ad) => {
    setCurrentAd(ad);
    setFormData({
      title: ad.title,
      imageUrl: ad.imageUrl,
      link: ad.link,
      status: ad.status,
      startDate: ad.startDate,
      endDate: ad.endDate,
    });
    setImageFile(null); // Clear image file when editing
    setShowAddEditDialog(true);
  };

  const handleDeleteAd = (id: string) => {
    setAds(ads.filter(ad => ad.id !== id));
    toast.success('广告已删除');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) }); // For preview
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.imageUrl || !formData.link || !formData.startDate || !formData.endDate) {
      toast.error('请填写所有必填项');
      return;
    }

    // In a real application, you would upload imageFile to a server here
    // and get the actual imageUrl. For this example, we'll use the local URL.

    if (currentAd) {
      setAds(ads.map(ad => (ad.id === currentAd.id ? { ...formData, id: currentAd.id } : ad)));
      toast.success('广告已更新');
    } else {
      const newAd: Ad = { ...formData, id: String(ads.length + 1) };
      setAds([...ads, newAd]);
      toast.success('广告已添加');
    }
    setShowAddEditDialog(false);
    setImageFile(null); // Clear image file after submission
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">广告管理</h1>
          <p className="text-slate-500 mt-1">管理园区内的广告内容</p>
        </div>
        <Button onClick={handleAddAd} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          <Plus className="h-4 w-4 mr-2" />
          新增广告
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索广告标题..."
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
                  <TableHead>标题</TableHead>
                  <TableHead>图片</TableHead>
                  <TableHead>链接</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>开始日期</TableHead>
                  <TableHead>结束日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAds.map((ad) => (
                  <TableRow key={ad.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{ad.title}</TableCell>
                    <TableCell>
                      <img src={ad.imageUrl} alt={ad.title} className="w-16 h-16 object-cover rounded" />
                    </TableCell>
                    <TableCell>{ad.link}</TableCell>
                    <TableCell>{ad.status === 'active' ? '启用中' : '已禁用'}</TableCell>
                    <TableCell>{ad.startDate}</TableCell>
                    <TableCell>{ad.endDate}</TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleEditAd(ad)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>编辑广告</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteAd(ad.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>删除广告</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddEditDialog} onOpenChange={setShowAddEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentAd ? '编辑广告' : '新增广告'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">标题 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="请输入广告标题"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">图片上传 *</Label>
              <Input
                id="imageUrl"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {formData.imageUrl && (
                <img src={formData.imageUrl} alt="预览" className="mt-2 w-24 h-24 object-cover rounded" />
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link">链接 *</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="请输入广告链接"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">开始日期 *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">结束日期 *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="status">状态</Label>
              <Input
                id="status"
                type="checkbox"
                checked={formData.status === 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                className="w-4 h-4"
              />
              <span>{formData.status === 'active' ? '启用' : '禁用'}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEditDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              {currentAd ? '保存修改' : '添加广告'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}