import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent } from '../ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import ServiceManagement from './ServiceManagement';
import DynamicManagement from './DynamicManagement';
import EnterpriseManagement from './EnterpriseManagement';
import RecruitmentManagement from './RecruitmentManagement';
import ContentSettings from './ContentSettings';

interface OperationsManagementProps {
  onNavigate: (page: string) => void;
}

export default function OperationsManagement({ onNavigate }: OperationsManagementProps) {
  const [activeTab, setActiveTab] = useState('service-management');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">运营管理</h1>
        <p className="text-slate-500 mt-1">管理您已发布的服务和用人需求</p>
      </div>

      <Select onValueChange={setActiveTab} defaultValue={activeTab}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder="选择管理模块" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="service-management">服务管理</SelectItem>

          <SelectItem value="recruitment-management">招聘管理</SelectItem>
          <SelectItem value="content-settings">内容设置</SelectItem>
        </SelectContent>
      </Select>

      <Tabs value={activeTab} className="space-y-4">
        <TabsContent value="service-management">
          <ServiceManagement />
        </TabsContent>



        <TabsContent value="recruitment-management">
          <RecruitmentManagement />
        </TabsContent>

        <TabsContent value="content-settings">
          <ContentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
