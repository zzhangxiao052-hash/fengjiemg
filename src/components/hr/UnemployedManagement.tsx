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
import { toast } from 'sonner@2.0.3';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Person {
  id: string;
  name: string;
  education: string;
  area: string;
  channel: string;
  phone: string;
}

export default function UnemployedManagement() {
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: '张三', education: '本科', area: '奉节县', channel: '招聘会', phone: '138****1234' },
    { id: '2', name: '李四', education: '大专', area: '重庆市', channel: '在线平台', phone: '139****5678' },
    { id: '3', name: '王五', education: '硕士', area: '奉节县', channel: '推荐', phone: '137****9012' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterEducation, setFilterEducation] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const filteredPeople = people.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEducation = filterEducation === 'all' || p.education === filterEducation;
    return matchesSearch && matchesEducation;
  });

  const handleView = (person: Person) => {
    setSelectedPerson(person);
    setShowViewDialog(true);
  };

  const handleImport = () => {
    toast.success('批量导入成功');
    setShowUploadDialog(false);
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
                  <TableHead>来源渠道</TableHead>
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
                    <TableCell>{person.channel}</TableCell>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
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

      {/* View Dialog */}
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
              <Label htmlFor="channel">来源渠道</Label>
              <Input
                id="channel"
                value={selectedPerson?.channel}
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