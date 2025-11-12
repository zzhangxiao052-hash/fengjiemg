import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'; // Import Select components

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import AnnouncementManagement from './AnnouncementManagement';
import PolicyManagement from './PolicyManagement';
import AdManagement from './AdManagement';
import GeographicalAdvantagesManagement from './GeographicalAdvantagesManagement';
import AdvancedManufacturingManagement from './AdvancedManufacturingManagement';
import ModernLogisticsManagement from './ModernLogisticsManagement';
import RecruitmentFairManagement from '../hr/RecruitmentFairManagement';

interface ParkOverview {
  introduction: string;
  enterpriseCount: number;
  area: string;
  annualOutputValue: string;
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('content'); // State to manage active tab: 'content', 'announcement', 'policy', 'ad'

  const [parkOverview, setParkOverview] = useState<ParkOverview>({
    introduction: '这是一个充满活力的现代化科技园区，致力于高新技术产业发展。',
    enterpriseCount: 120,
    area: '500亩',
    annualOutputValue: '100亿元',
  });
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [editedOverview, setEditedOverview] = useState<ParkOverview>(parkOverview);

  const handleSaveOverview = () => {
    setParkOverview(editedOverview);
    setIsEditingOverview(false);
  };

  return (
    <div className="p-6 space-y-24">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-slate-900">内容管理</h1>
          <p className="text-slate-500 mt-1">管理园区内容信息</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择管理模块" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="content">网站内容管理</SelectItem>
              <SelectItem value="announcement">公告管理</SelectItem>
              <SelectItem value="policy">政策管理</SelectItem>
              <SelectItem value="ad">广告管理</SelectItem>
              <SelectItem value="recruitment-fair">招聘会管理</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 园区概况 */}
      {activeTab === 'content' && (
        <div className="space-y-24">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-semibold">园区概况</h2>
                <Button variant="outline" size="sm" onClick={() => {
                  setEditedOverview(parkOverview);
                  setIsEditingOverview(true);
                }}>
                  编辑
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">园区介绍</span>
                  <p className="text-slate-900 font-medium">{parkOverview.introduction}</p>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">入驻企业数量</span>
                  <p className="text-slate-900 font-medium">{parkOverview.enterpriseCount} 家</p>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">园区面积</span>
                  <p className="text-slate-900 font-medium">{parkOverview.area}</p>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-500">全区年产值</span>
                  <p className="text-slate-900 font-medium">{parkOverview.annualOutputValue}</p>
                </div>
              </CardContent>
            </Card>

          <div className="flex flex-col gap-8">
            <div><GeographicalAdvantagesManagement /></div>
            <div><AdvancedManufacturingManagement /></div>
            <div><ModernLogisticsManagement /></div>
          </div>
        </div>
      )}

      {activeTab === 'announcement' && (
        <AnnouncementManagement />
      )}

      {activeTab === 'policy' && (
        <PolicyManagement />
      )}

      {activeTab === 'ad' && (
        <AdManagement />
      )}

      {activeTab === 'recruitment-fair' && (
        <RecruitmentFairManagement />
      )}

      {/* 编辑园区概况弹窗 */}
      <Dialog open={isEditingOverview} onOpenChange={setIsEditingOverview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑园区概况</DialogTitle>
            <DialogDescription>修改园区概况信息。</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="introduction" className="block text-sm font-medium text-gray-700">园区介绍</label>
              <Input
                id="introduction"
                value={editedOverview.introduction}
                onChange={(e) => setEditedOverview({ ...editedOverview, introduction: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="enterpriseCount" className="block text-sm font-medium text-gray-700">入驻企业数量</label>
              <Input
                id="enterpriseCount"
                type="number"
                value={editedOverview.enterpriseCount}
                onChange={(e) => setEditedOverview({ ...editedOverview, enterpriseCount: parseInt(e.target.value) })}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">园区面积</label>
              <Input
                id="area"
                value={editedOverview.area}
                onChange={(e) => setEditedOverview({ ...editedOverview, area: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label htmlFor="annualOutputValue" className="block text-sm font-medium text-gray-700">全区年产值</label>
              <Input
                id="annualOutputValue"
                value={editedOverview.annualOutputValue}
                onChange={(e) => setEditedOverview({ ...editedOverview, annualOutputValue: e.target.value })}
                className="mt-1 block w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingOverview(false)}>取消</Button>
            <Button onClick={handleSaveOverview} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 园区特色管理 */}
      
    </div>
  );
}