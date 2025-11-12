import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import HRHome from './hr/HRHome';
import JobDemandManagement from './hr/JobDemandManagement';
import UnemployedManagement from './hr/UnemployedManagement';
import ResumeManagement from './hr/ResumeManagement';
import SystemSettings from './hr/SystemSettings';
import EnterpriseDetail from './enterprise/EnterpriseDetail';
import { LayoutDashboard, Briefcase, Users, Building, FileText, Bell, Settings } from 'lucide-react';

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