import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface Policy {
  id: string;
  title: string;
  type: string;
  status: string;
  publishTime: string;
  views: number;
  content: string; // Assuming content is part of the policy for editing
  keywords: string; // Assuming keywords are part of the policy for editing
}

interface PolicyEditPageProps {
  policyId: string;
  onBack: () => void;
  onSave: (updatedPolicy: Policy) => void;
  // This would typically come from a global state or API call
  // For now, we'll simulate fetching it
  initialPolicies: Policy[]; 
}

export default function PolicyEditPage({ policyId, onBack, onSave, initialPolicies }: PolicyEditPageProps) {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    content: '',
    keywords: '',
  });

  useEffect(() => {
    // Simulate fetching policy data based on policyId
    const fetchedPolicy = initialPolicies.find(p => p.id === policyId);
    if (fetchedPolicy) {
      setPolicy(fetchedPolicy);
      setFormData({
        title: fetchedPolicy.title,
        type: fetchedPolicy.type,
        content: fetchedPolicy.content || '',
        keywords: fetchedPolicy.keywords || '',
      });
    } else {
      toast.error('政策未找到');
      onBack();
    }
  }, [policyId, initialPolicies, onBack]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const handleSave = () => {
    if (!formData.title || !formData.type || !formData.content) {
      toast.error('请填写所有必填项');
      return;
    }
    if (policy) {
      const updatedPolicy = { ...policy, ...formData };
      onSave(updatedPolicy);
      toast.success('政策已更新');
    }
  };

  if (!policy) {
    return <div>加载中...</div>; // Or a loading spinner
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回政策管理
        </Button>
        <h1 className="text-2xl font-bold">编辑政策: {policy.title}</h1>
        <Button onClick={handleSave} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          保存更改
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>政策信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">政策标题 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="请输入政策标题"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">政策类型 *</Label>
            <Select value={formData.type} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="产业政策">产业政策</SelectItem>
                <SelectItem value="金融政策">金融政策</SelectItem>
                <SelectItem value="人才政策">人才政策</SelectItem>
                <SelectItem value="税收政策">税收政策</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">政策内容 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="请输入政策详细内容..."
              rows={15}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="keywords">AI解读关键词</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="用于AI解读的关键词，用逗号分隔"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="attachment">附件上传</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-[#1E3A8A] transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
              <p className="text-slate-600 text-sm">点击或拖拽文件到此处上传</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
