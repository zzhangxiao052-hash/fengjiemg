import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Search, Eye, Download, Star, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

interface Resume {
  id: string;
  name: string;
  position: string;
  jobType: string;
  education: string;
  experience: string;
  phone: string;
  submitTime: string;
}

export default function ResumeManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJobType, setFilterJobType] = useState('all');
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toDeleteResume, setToDeleteResume] = useState<Resume | null>(null);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const [resumes, setResumes] = useState<Resume[]>([
    { id: '1', name: '张三', position: '软件工程师', jobType: '前端开发', education: '本科', experience: '3年', phone: '138****1234', submitTime: '2024-10-16' },
    { id: '2', name: '李四', position: '机械工程师', jobType: '机械工程', education: '硕士', experience: '5年', phone: '139****5678', submitTime: '2024-10-15' },
    { id: '3', name: '王五', position: '市场经理', jobType: '市场运营', education: '本科', experience: '4年', phone: '137****9012', submitTime: '2024-10-14' },
  ]);

  const filtered = resumes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJob = filterJobType === 'all' || r.jobType === filterJobType;
    return matchesSearch && matchesJob;
  });

  const viewDetail = (resume: Resume) => {
    setSelectedResume(resume);
    setShowDetailDialog(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">简历管理</h1>
        <p className="text-slate-500 mt-1">查看和管理求职者简历</p>
      </div>

      <Card>
        <CardHeader>
          <div className="relative flex flex-col md:flex-row gap-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索姓名或职位..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Select value={filterJobType} onValueChange={setFilterJobType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="工种筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部工种</SelectItem>
                <SelectItem value="前端开发">前端开发</SelectItem>
                <SelectItem value="机械工程">机械工程</SelectItem>
                <SelectItem value="市场运营">市场运营</SelectItem>
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
                  <TableHead>期望职位</TableHead>
                  <TableHead>工种</TableHead>
                  <TableHead>学历</TableHead>
                  <TableHead>工作经验</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>投递时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((resume) => (
                  <TableRow key={resume.id} className="hover:bg-slate-50">
                    <TableCell>{resume.name}</TableCell>
                    <TableCell>{resume.position}</TableCell>
                    <TableCell>{resume.jobType}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{resume.education}</Badge>
                    </TableCell>
                    <TableCell>{resume.experience}</TableCell>
                    <TableCell>{resume.phone}</TableCell>
                    <TableCell>{resume.submitTime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewDetail(resume)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { setToDeleteResume(resume); setShowDeleteDialog(true); }}>
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

      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>简历详情</DialogTitle>
          </DialogHeader>
          {selectedResume && (
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">基础信息</TabsTrigger>
                <TabsTrigger value="work">工作经历</TabsTrigger>
                <TabsTrigger value="education">教育背景</TabsTrigger>
                <TabsTrigger value="attachments">附件</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>姓名</Label>
                    <p className="mt-1 text-slate-700">{selectedResume.name}</p>
                  </div>
                  <div>
                    <Label>期望职位</Label>
                    <p className="mt-1 text-slate-700">{selectedResume.position}</p>
                  </div>
                  <div>
                    <Label>工种</Label>
                    <p className="mt-1 text-slate-700">{selectedResume.jobType}</p>
                  </div>
                  <div>
                    <Label>学历</Label>
                    <p className="mt-1 text-slate-700">{selectedResume.education}</p>
                  </div>
                  <div>
                    <Label>工作经验</Label>
                    <p className="mt-1 text-slate-700">{selectedResume.experience}</p>
                  </div>
                  <div>
                    <Label>联系电话</Label>
                    <p className="mt-1 text-slate-700">{selectedResume.phone}</p>
                  </div>
                  <div>
                    <Label>投递时间</Label>
                    <p className="mt-1 text-slate-700">{selectedResume.submitTime}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="work" className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-slate-900">软件工程师</h4>
                    <p className="text-slate-500 text-sm mt-1">科技公司A | 2021.06 - 至今</p>
                    <p className="text-slate-700 mt-2 text-sm">负责项目开发与维护，参与系统架构设计...</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-slate-900">初级开发工程师</h4>
                    <p className="text-slate-500 text-sm mt-1">互联网公司B | 2019.07 - 2021.05</p>
                    <p className="text-slate-700 mt-2 text-sm">参与产品功能开发，进行代码审查...</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="text-slate-900">某某大学</h4>
                  <p className="text-slate-500 text-sm mt-1">计算机科学与技术 | 本科 | 2015.09 - 2019.06</p>
                  <p className="text-slate-700 mt-2 text-sm">主修课程：数据结构、算法、操作系统等</p>
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">📄</span>
                    <span className="text-sm">个人简历.pdf</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              下载简历
            </Button>
            <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              邀约面试
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除简历</AlertDialogTitle>
            <AlertDialogDescription>
              是否删除 {toDeleteResume?.name}（ID: {toDeleteResume?.id}）的简历？该操作将记录到历史记录。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (!toDeleteResume) return;
              setResumes(prev => prev.filter(r => r.id !== toDeleteResume.id));
              const key = 'hrHistory';
              const existing = localStorage.getItem(key);
              const list = existing ? JSON.parse(existing) : [];
              const record = {
                id: `${Date.now()}`,
                type: '简历',
                action: '删除',
                target: `${toDeleteResume.name}(${toDeleteResume.id})`,
                operator: '人资管理员',
                timestamp: new Date().toLocaleString(),
                before: toDeleteResume,
                after: null,
              };
              localStorage.setItem(key, JSON.stringify([record, ...list]));
              setShowDeleteDialog(false);
              setToDeleteResume(null);
            }}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
