import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface GeographicalAdvantage {
  id: string;
  text: string;
  imageUrl: string;
  imageFile?: File | null;
}

export default function GeographicalAdvantagesManagement() {
  const [advantages, setAdvantages] = useState<GeographicalAdvantage[]>([
    { id: '1', text: '交通便利，紧邻高速公路和港口。', imageUrl: '' },
    { id: '2', text: '自然环境优美，空气质量高。', imageUrl: '' },
  ]);

  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [currentAdvantage, setCurrentAdvantage] = useState<GeographicalAdvantage | null>(null);
  const [formData, setFormData] = useState<Omit<GeographicalAdvantage, 'id'>>({
    text: '',
    imageUrl: '',
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, imageFile: null });
      setImagePreview(null);
    }
  };

  const handleAddEdit = () => {
    if (!formData.text) {
      toast.error('请填写地理优势描述');
      return;
    }

    if (currentAdvantage) {
      // Edit existing advantage
      setAdvantages(advantages.map(adv => 
        adv.id === currentAdvantage.id ? { ...adv, text: formData.text, imageUrl: formData.imageUrl, imageFile: formData.imageFile } : adv
      ));
      toast.success('地理优势已更新');
    } else {
      // Add new advantage
      const newAdvantage: GeographicalAdvantage = {
        id: String(advantages.length + 1),
        text: formData.text,
        imageUrl: formData.imageUrl,
        imageFile: formData.imageFile,
      };
      setAdvantages([...advantages, newAdvantage]);
      toast.success('地理优势已添加');
    }
    setShowAddEditDialog(false);
    setCurrentAdvantage(null);
    setFormData({ text: '', imageUrl: '', imageFile: null });
    setImagePreview(null);
  };

  const handleEditClick = (advantage: GeographicalAdvantage) => {
    setCurrentAdvantage(advantage);
    setFormData({ text: advantage.text, imageUrl: advantage.imageUrl, imageFile: advantage.imageFile || null });
    setImagePreview(advantage.imageUrl || null);
    setShowAddEditDialog(true);
  };

  const handleDelete = (id: string) => {
    setAdvantages(advantages.filter(adv => adv.id !== id));
    toast.success('地理优势已删除');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>地理优势管理</CardTitle>
        <Button onClick={() => {
          setCurrentAdvantage(null);
          setFormData({ text: '', imageUrl: '', imageFile: null });
          setImagePreview(null);
          setShowAddEditDialog(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> 添加地理优势
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advantages.map(advantage => (
            <div key={advantage.id} className="flex flex-col space-y-2 p-4 border rounded-md">
              {advantage.imageUrl && <img src={advantage.imageUrl} alt="地理优势图片" className="w-full h-32 object-cover rounded-md" />}
              <p className="flex-grow">{advantage.text}</p>
              <div className="flex space-x-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(advantage)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(advantage.id)}>
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
            <DialogTitle>{currentAdvantage ? '编辑地理优势' : '添加地理优势'}</DialogTitle>
            <DialogDescription>填写地理优势的详细信息。</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text" className="text-right">描述</Label>
              <Textarea
                id="text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">图片</Label>
              <Input
                id="image"
                type="file"
                onChange={handleImageUpload}
                className="col-span-3"
              />
            </div>
            {imagePreview && (
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="col-span-1"></span>
                <img src={imagePreview} alt="图片预览" className="col-span-3 w-32 h-32 object-cover rounded-md" />
              </div>
            )}
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