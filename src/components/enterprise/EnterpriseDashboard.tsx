import React, { useState } from 'react';
import DashboardLayout from '../DashboardLayout';
import EnterpriseHome from './EnterpriseHome';
import EnterpriseManagement from './EnterpriseManagement';
import OperationsManagement from './OperationsManagement';
import DynamicManagement from './DynamicManagement';
import AccountManagement from './AccountManagement';
import RoleManagement from './RoleManagement';
import DepartmentManagement from './DepartmentManagement';
import EnterpriseCollaboration from './EnterpriseCollaboration';
import ContentManagement from './ContentManagement';
import ServiceReview from './ServiceReview';
import { LayoutDashboard, Building, Users, Settings, Briefcase, GitPullRequest, FileText, Shield, UserCheck, ClipboardCheck } from 'lucide-react';

interface EnterpriseDashboardProps {
  username: string;
  onLogout: () => void;
}

export default function EnterpriseDashboard({ username, onLogout }: EnterpriseDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'enterprise-management', label: '企业管理', icon: <Building className="h-5 w-5" /> },
    { id: 'operations', label: '运营管理', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'dynamic', label: '动态管理', icon: <GitPullRequest className="h-5 w-5" /> },
    { id: 'account', label: '账户管理', icon: <Users className="h-5 w-5" /> },
    { id: 'role', label: '角色管理', icon: <Shield className="h-5 w-5" /> },
    { id: 'department', label: '部门管理', icon: <UserCheck className="h-5 w-5" /> },
    { id: 'collaboration', label: '协作管理', icon: <ClipboardCheck className="h-5 w-5" /> },
    { id: 'content', label: '内容管理', icon: <FileText className="h-5 w-5" /> },
    { id: 'service-review', label: '服务审核', icon: <ClipboardCheck className="h-5 w-5" /> },
    { id: 'settings', label: '系统设置', icon: <Settings className="h-5 w-5" /> },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <EnterpriseHome onNavigate={setCurrentPage} />;
      case 'enterprise-management':
        return <EnterpriseManagement onNavigate={setCurrentPage} />;
      case 'operations':
        return <OperationsManagement onNavigate={setCurrentPage} />;
      case 'dynamic':
        return <DynamicManagement onNavigate={setCurrentPage} />;
      case 'account':
        return <AccountManagement onNavigate={setCurrentPage} />;
      case 'role':
        return <RoleManagement onNavigate={setCurrentPage} />;
      case 'department':
        return <DepartmentManagement onNavigate={setCurrentPage} />;
      case 'collaboration':
        return <EnterpriseCollaboration onNavigate={setCurrentPage} />;
      case 'content':
        return <ContentManagement onNavigate={setCurrentPage} />;
      case 'service-review':
        return <ServiceReview />;
      case 'settings':
        return <div>系统设置内容</div>; // Placeholder for settings
      default:
        return <EnterpriseHome onNavigate={setCurrentPage} />;
    }
  };

  return (
    <DashboardLayout
      username={username}
      roleLabel="企业管理端"
      menuItems={menuItems}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
