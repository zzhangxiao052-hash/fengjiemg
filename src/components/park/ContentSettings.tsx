import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

export default function ContentSettings() {
  const [bannerUrl, setBannerUrl] = useState('https://via.placeholder.com/150');
  const [announcement, setAnnouncement] = useState('欢迎来到奉节智慧园区管理平台！');

  const handleSave = () => {
    toast.success('内容设置已保存');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">内容设置</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>内容设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="banner-url">Banner 图片 URL</Label>
            <Input 
              id="banner-url" 
              value={bannerUrl} 
              onChange={(e) => setBannerUrl(e.target.value)} 
              placeholder="请输入 Banner 图片 URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcement">通知公告</Label>
            <Textarea 
              id="announcement" 
              value={announcement} 
              onChange={(e) => setAnnouncement(e.target.value)} 
              placeholder="请输入通知公告内容"
              rows={4}
            />
          </div>

          <Button onClick={handleSave} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
            保存设置
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
