import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import ParkHome from './park/ParkHome';
import ParkEnterpriseVerification from './park/ParkEnterpriseVerification';
import ParkEnterpriseDetail from './park/ParkEnterpriseDetail';
import EnterpriseManagement from './park/EnterpriseManagement';
import PolicyManagement from './park/PolicyManagement';
import ContentManagement from './park/ContentManagement';
import DepartmentManagement from './park/DepartmentManagement';
import PermissionManagement from './park/PermissionManagement';
import AccountManagement from './park/AccountManagement';
import AdManagement from './park/AdManagement';
// import RoleManagement from './park/RoleManagement';
import StatisticsPage from './park/StatisticsPage';
import SystemSettings from './park/SystemSettings';
import { LayoutDashboard, Settings, FileText, Building, Megaphone, BookOpen, Bell, Users, BarChart3, History, Presentation } from 'lucide-react';
import AnnouncementManagement from './park/AnnouncementManagement';
import ParkDataCollectionManagement from './park/ParkDataCollectionManagement';
import ParkHistory from './park/ParkHistory';
import VisualizationManagement from './park/VisualizationManagement';
import DynamicManagement from './park/DynamicManagement';
import ContentSettings from './park/ContentSettings';


interface ParkDashboardProps {
  username: string;
  onLogout: () => void;
}

export default function ParkDashboard({ username, onLogout }: ParkDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentSystemManagementPage, setCurrentSystemManagementPage] = useState('home');
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string | null>(null);

  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'content', label: '网站内容管理', icon: <FileText className="h-5 w-5" /> },
    { id: 'verification', label: '企业认证', icon: <Building className="h-5 w-5" /> },
    {
      id: 'enterprise-management-group',
      label: '企业管理',
      icon: <Building className="h-5 w-5" />,
      children: [
        { id: 'enterprise-management', label: '企业管理' },
        { id: 'dynamic-management', label: '动态管理' },
        { id: 'content-settings', label: '内容设置' },
      ],
    },
    { id: 'statistics', label: '数据统计', icon: <BarChart3 className="h-5 w-5" /> },
    {
      id: 'settings',
      label: '系统设置',
      icon: <Settings className="h-5 w-5" />,
      subItems: [
        { title: '部门管理', content: <DepartmentManagement /> },
        { title: '权限管理', content: <PermissionManagement /> },
        { title: '账号管理', content: <AccountManagement /> },
        { title: '广告管理', content: <AdManagement /> },
      ],
    },
    {
      label: "园区数据采集管理端",
      icon: <BarChart3 className="h-5 w-5" />,
      id: "park-data-collection-management",
    },
    {
      id: 'visualization-management',
      label: '可视化页面管理',
      icon: <Presentation className="h-5 w-5" />,
    },
    {
      id: 'history',
      label: '历史记录',
      icon: <History className="h-5 w-5" />,
    },
  ];

  const renderContent = () => {
    if (selectedEnterpriseId) {
      return <ParkEnterpriseDetail enterpriseId={selectedEnterpriseId} onBack={() => setSelectedEnterpriseId(null)} />;
    }

    switch (currentPage) {
      case 'system-management':
        switch (currentSystemManagementPage) {
          case 'home':
            return <ParkHome onNavigate={setCurrentPage} />;
          case 'department-management':
            return <DepartmentManagement />;
          case 'permission-management':
            return <PermissionManagement />;
          case 'account-management':
            return <AccountManagement />;
          default:
            return <ParkHome onNavigate={setCurrentPage} />;
        }
      case 'verification':
        return <ParkEnterpriseVerification onNavigate={(page) => {
          if (page.startsWith('enterprise-detail-')) {
            setSelectedEnterpriseId(page.replace('enterprise-detail-', ''));
          }
        }} />;
      case 'enterprise-management':
        return <EnterpriseManagement />;
      case 'dynamic-management':
        return <DynamicManagement />;
      case 'content-settings':
        return <ContentSettings />;
      case 'policy':
        return <PolicyManagement />;
      case 'content':
        return <ContentManagement />;
      case 'ad-management': // Changed from 'ads' to 'ad-management' to match sub-item ID
        return <AdManagement />;
      // case 'role-management':
      //   return <RoleManagement />;
      // case "announcement-management":
      //   return <AnnouncementManagement />;
      case "park-data-collection-management":
        return <ParkDataCollectionManagement />;
      case "statistics":
        return <StatisticsPage />;
      case "settings":
        return <SystemSettings />;
      case 'visualization-management':
        return <VisualizationManagement />;
      case "history":
        return <ParkHistory />;
      default:
        return <ParkHome onNavigate={setCurrentPage} />;
    }
  };

  return (
    <DashboardLayout
      username={username}
      roleLabel="园区管理端"
      menuItems={menuItems}
      currentPage={currentPage}
      onPageChange={(pageId) => {
        setCurrentPage(pageId);
      }}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
