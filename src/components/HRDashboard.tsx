import React, { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import HRHome from './hr/HRHome';
import JobDemandManagement from './hr/JobDemandManagement';
import UnemployedManagement from './hr/UnemployedManagement';
import ResumeManagement from './hr/ResumeManagement';
import SystemSettings from './hr/SystemSettings';
import EnterpriseDetail from './enterprise/EnterpriseDetail';
import { LayoutDashboard, Briefcase, Users, FileText, Settings, History, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';

interface HRDashboardProps {
  username: string;
  onLogout: () => void;
}

export default function HRDashboard({ username, onLogout }: HRDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'demand', label: '用人需求', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'unemployed', label: '待岗人员', icon: <Users className="h-5 w-5" /> },
    { id: 'resume', label: '简历管理', icon: <FileText className="h-5 w-5" /> },
    { id: 'settings', label: '系统设置', icon: <Settings className="h-5 w-5" /> },
    { id: 'history', label: '历史记录', icon: <History className="h-5 w-5" /> },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <HRHome onNavigate={setCurrentPage} />;
      case 'demand':
        return <JobDemandManagement />;
      case 'unemployed':
        return <UnemployedManagement />;
      case 'resume':
        return <ResumeManagement />;
      case 'settings':
        return <SystemSettings />;
      case 'history':
        return <HRHistoryView />;
      default:
        return <HRHome onNavigate={setCurrentPage} />;
    }
  };

  if (currentPage.startsWith('enterprise-detail-')) {
    const enterpriseId = currentPage.split('-')[2];
    return (
      <DashboardLayout
        username={username}
        roleLabel="人资管理端"
        menuItems={menuItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={onLogout}
      >
        <EnterpriseDetail enterpriseId={enterpriseId} onBack={() => setCurrentPage('dashboard')} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      username={username}
      roleLabel="人资管理端"
      menuItems={menuItems}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

function HRHistoryView() {
  const [records, setRecords] = useState<any[]>([]);
  useEffect(() => {
    const key = 'hrHistory';
    const existing = localStorage.getItem(key);
    setRecords(existing ? JSON.parse(existing) : []);
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">历史记录</h1>
        <p className="text-slate-500 mt-1">来源：待岗人员管理的删除与修改操作</p>
      </div>
      <Card>
        <CardHeader />
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>类型</TableHead>
                  <TableHead>操作</TableHead>
                  <TableHead>目标</TableHead>
                  <TableHead>操作人</TableHead>
                  <TableHead>时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id} className="hover:bg-slate-50">
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.action}</TableCell>
                    <TableCell>{r.target}</TableCell>
                    <TableCell>{r.operator}</TableCell>
                    <TableCell>{r.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
