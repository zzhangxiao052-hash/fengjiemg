import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Search, Edit, Eye, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import PolicyEditPage from './PolicyEditPage';

interface Policy {
  id: string;
  title: string;
  type: string;
  status: string;
  publishTime: string;
  views: number;
  content?: string; // Add content field
  keywords?: string; // Add keywords field
}

export default function PolicyManagement() {
  const [policies, setPolicies] = useState<Policy[]>([
    { id: '1', title: '2024年产业扶持政策', type: '产业政策', status: '已发布', publishTime: '2024-10-15', views: 1256, content: '为深入贯彻国家产业政策，加快产业结构调整和优化升级，特制定本政策。', keywords: '产业政策, 结构调整' },
    { id: '2', title: '中小企业融资补贴方案', type: '金融政策', status: '已发布', publishTime: '2024-10-14', views: 892, content: '为缓解中小企业融资压力，促进其健康发展，提供融资补贴。', keywords: '中小企业, 融资, 补贴' },
    { id: '3', title: '人才引进优惠政策', type: '人才政策', status: '草稿', publishTime: '2024-10-13', views: 0, content: '为吸引高层次人才来园区发展，提供住房、落户等多方面优惠政策。', keywords: '人才引进, 优惠政策' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showEditPage, setShowEditPage] = useState(false); // New state for edit page
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null); // New state for editing policy ID
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    content: '',
    keywords: '',
  });

  const filteredPolicies = policies.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({ title: '', type: '', content: '', keywords: '' });
    setShowAddDialog(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.type || !formData.content) {
      toast.error('请填写所有必填项');
      return;
    }
    const newPolicy: Policy = {
      id: String(policies.length + 1),
      title: formData.title,
      type: formData.type,
      status: '草稿',
      publishTime: new Date().toISOString().split('T')[0],
      views: 0,
      content: formData.content, // Save content
      keywords: formData.keywords, // Save keywords
    };
    setPolicies([newPolicy, ...policies]);
    toast.success('政策已添加');
    setShowAddDialog(false);
  };

  const handlePublish = (policyId: string) => {
    setPolicies(policies.map(p => 
      p.id === policyId ? { ...p, status: '已发布' } : p
    ));
    toast.success('政策已发布');
  };

  const viewDetail = (policy: Policy) => {
    setSelectedPolicy(policy);
    setShowDetailDialog(true);
  };

  const handleEdit = (policyId: string) => {
    setEditingPolicyId(policyId);
    setShowEditPage(true);
  };

  const handleSaveEditedPolicy = (updatedPolicy: Policy) => {
    setPolicies(policies.map(p => p.id === updatedPolicy.id ? updatedPolicy : p));
    setShowEditPage(false);
    setEditingPolicyId(null);
    toast.success('政策已更新');
  };

  if (showEditPage && editingPolicyId) {
    return (
      <PolicyEditPage
        policyId={editingPolicyId}
        onBack={() => setShowEditPage(false)}
        onSave={handleSaveEditedPolicy}
        initialPolicies={policies} // Pass policies for simulation
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">政策管理</h1>
          <p className="text-slate-500 mt-1">发布和管理园区政策</p>
        </div>
        <Button onClick={handleAdd} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          <Plus className="h-4 w-4 mr-2" />
          新增政策
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索政策标题..."
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
                  <TableHead>政策标题</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>发布时间</TableHead>
                  <TableHead>浏览量</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id} className="hover:bg-slate-50">
                    <TableCell>{policy.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{policy.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={policy.status === '已发布' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}>
                        {policy.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{policy.publishTime}</TableCell>
                    <TableCell>{policy.views}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewDetail(policy)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(policy.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {policy.status === '草稿' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePublish(policy.id)}
                          >
                            发布
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Policy Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>发布政策</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">政策标题 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="请输入政策标题"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">政策类型 *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="请输入政策详细内容..."
                rows={8}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="keywords">AI解读关键词</Label>
              <Input
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              保存为草稿
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>政策详情</DialogTitle>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4">
              <div>
                <Label>政策标题</Label>
                <p className="mt-1 text-slate-900">{selectedPolicy.title}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>政策类型</Label>
                  <p className="mt-1 text-slate-700">{selectedPolicy.type}</p>
                </div>
                <div>
                  <Label>发布时间</Label>
                  <p className="mt-1 text-slate-700">{selectedPolicy.publishTime}</p>
                </div>
                <div>
                  <Label>浏览量</Label>
                  <p className="mt-1 text-slate-700">{selectedPolicy.views}</p>
                </div>
              </div>
              <div>
                <Label>政策内容</Label>
                <div className="mt-2 p-4 bg-slate-50 rounded-lg max-h-96 overflow-y-auto">
                  <p className="text-slate-700 leading-relaxed">
                    {selectedPolicy.content}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailDialog(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}