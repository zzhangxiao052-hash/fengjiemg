import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Space } from '@arco-design/web-react';

interface RecruitmentFair {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  address: string;
  exhibitorCount: number;
  jobCount: number;
}

export default function RecruitmentFairManagement() {
  const [recruitmentFairs, setRecruitmentFairs] = useState<RecruitmentFair[]>([
    {
      id: '1',
      name: '2023年春季招聘会',
      status: '进行中',
      startDate: '2023-03-15',
      endDate: '2023-03-17',
      address: '园区会展中心A馆',
      exhibitorCount: 50,
      jobCount: 200,
    },
    {
      id: '2',
      name: '2023年秋季招聘会',
      status: '未开始',
      startDate: '2023-09-20',
      endDate: '2023-09-22',
      address: '园区会展中心B馆',
      exhibitorCount: 0,
      jobCount: 0,
    },
  ]);

  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedFair, setSelectedFair] = useState<RecruitmentFair | null>(null);
  const [editingFair, setEditingFair] = useState<RecruitmentFair | null>(null);

  const handleViewDetails = (fair: RecruitmentFair) => {
    setSelectedFair(fair);
    setShowDetailDialog(true);
  };

  const handleEditFair = (fair: RecruitmentFair) => {
    setEditingFair({ ...fair }); // Create a copy to edit
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingFair) {
      setRecruitmentFairs(recruitmentFairs.map((fair) =>
        fair.id === editingFair.id ? editingFair : fair
      ));
      setShowEditDialog(false);
      setEditingFair(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>招聘会管理</CardTitle>
          <Button>添加招聘会</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>招聘会名称</TableHead>
                <TableHead>目前状态</TableHead>
                <TableHead>开始日期</TableHead>
                <TableHead>截至日期</TableHead>
                <TableHead>地址</TableHead>
                <TableHead>参展企业数量</TableHead>
                <TableHead>提供岗位数量</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recruitmentFairs.map((fair) => (
                <TableRow key={fair.id}>
                  <TableCell>{fair.name}</TableCell>
                  <TableCell>{fair.status}</TableCell>
                  <TableCell>{fair.startDate}</TableCell>
                  <TableCell>{fair.endDate}</TableCell>
                  <TableCell>{fair.address}</TableCell>
                  <TableCell>{fair.exhibitorCount}</TableCell>
                  <TableCell>{fair.jobCount}</TableCell>
                  <TableCell>
                    <Space>
                      <Button size="sm" onClick={() => handleViewDetails(fair)}>查看</Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditFair(fair)}>编辑</Button>
                      <Button size="sm" variant="destructive">删除</Button>
                    </Space>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedFair && (
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>招聘会详情</DialogTitle>
              <DialogDescription>{selectedFair.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <div>
                <Label>招聘会名称</Label>
                <p className="text-slate-700">{selectedFair.name}</p>
              </div>
              <div>
                <Label>目前状态</Label>
                <p className="text-slate-700">{selectedFair.status}</p>
              </div>
              <div>
                <Label>开始日期</Label>
                <p className="text-slate-700">{selectedFair.startDate}</p>
              </div>
              <div>
                <Label>截至日期</Label>
                <p className="text-slate-700">{selectedFair.endDate}</p>
              </div>
              <div>
                <Label>地址</Label>
                <p className="text-slate-700">{selectedFair.address}</p>
              </div>
              <div>
                <Label>参展企业数量</Label>
                <p className="text-slate-700">{selectedFair.exhibitorCount}</p>
              </div>
              <div>
                <Label>提供岗位数量</Label>
                <p className="text-slate-700">{selectedFair.jobCount}</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowDetailDialog(false)}>关闭</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {editingFair && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑招聘会</DialogTitle>
              <DialogDescription>{editingFair.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">招聘会名称</Label>
                <Input
                  id="edit-name"
                  value={editingFair.name}
                  onChange={(e) => setEditingFair({ ...editingFair, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">目前状态</Label>
                <Input
                  id="edit-status"
                  value={editingFair.status}
                  onChange={(e) => setEditingFair({ ...editingFair, status: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-startDate">开始日期</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={editingFair.startDate}
                  onChange={(e) => setEditingFair({ ...editingFair, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate">截至日期</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={editingFair.endDate}
                  onChange={(e) => setEditingFair({ ...editingFair, endDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-address">地址</Label>
                <Input
                  id="edit-address"
                  value={editingFair.address}
                  onChange={(e) => setEditingFair({ ...editingFair, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-exhibitorCount">参展企业数量</Label>
                <Input
                  id="edit-exhibitorCount"
                  type="number"
                  value={editingFair.exhibitorCount}
                  onChange={(e) => setEditingFair({ ...editingFair, exhibitorCount: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-jobCount">提供岗位数量</Label>
                <Input
                  id="edit-jobCount"
                  type="number"
                  value={editingFair.jobCount}
                  onChange={(e) => setEditingFair({ ...editingFair, jobCount: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>取消</Button>
              <Button onClick={handleSaveEdit}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}