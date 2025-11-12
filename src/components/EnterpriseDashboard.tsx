import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import EnterpriseHome from './enterprise/EnterpriseHome';
import { ServicePublish } from './enterprise/ServicePublish';
import EnterpriseCollaboration from './enterprise/EnterpriseCollaboration';
import DataCollection from './enterprise/DataCollection';
import OperationsManagement from './enterprise/OperationsManagement';
import UserCenter from './enterprise/UserCenter';
import EnterpriseDetail from './enterprise/EnterpriseDetail'; // Import EnterpriseDetail
import ServiceReview from './enterprise/ServiceReview'; // Import ServiceReview
import ServiceReviewHistory from './enterprise/ServiceReviewHistory'; // Import ServiceReviewHistory
import ShopEdit from './enterprise/ShopEdit'; // Import ShopEdit
import { LayoutDashboard, Building, Briefcase, GitPullRequest, Users, Shield, UserCheck, ClipboardCheck, FileText, Settings, Store, Send, Database, User, History } from 'lucide-react';

interface EnterpriseDashboardProps {
  username: string;
  onLogout: () => void;
}

export default function EnterpriseDashboard({ username, onLogout }: EnterpriseDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: '服务展示', icon: <Store className="h-5 w-5" /> },
    { id: 'publish', label: '服务发布', icon: <Send className="h-5 w-5" /> },
    { id: 'operations', label: '运营管理', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'service-review', label: '服务审核', icon: <LayoutDashboard className="h-5 w-5" /> },
    {
      id: 'collaboration',
      label: '企业协同',
      icon: <Users className="h-5 w-5" />,
      children: [
        { id: 'procurement', label: '采购寻源' },
        { id: 'capacity', label: '产能共享' },
        { id: 'supply', label: '产品供应' },
        { id: 'production', label: '生产协作' },
        { id: 'shop', label: '云商店铺' },
      ],
    },
    { id: 'data', label: '数据采集', icon: <Database className="h-5 w-5" /> },
    { id: 'user', label: '用户中心', icon: <User className="h-5 w-5" /> },
    { id: 'history', label: '历史记录', icon: <History className="h-5 w-5" /> },
  ];

  const renderContent = () => {
    if (currentPage.startsWith('enterprise-detail-')) {
      const enterpriseId = currentPage.replace('enterprise-detail-', '');
      return <EnterpriseDetail enterpriseId={enterpriseId} onBack={() => setCurrentPage('dashboard')} />;
    } else if (currentPage.startsWith('shop-edit-')) {
      const shopId = currentPage.replace('shop-edit-', '');
      return <ShopEdit shopId={shopId} onBack={() => setCurrentPage('shop')} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <EnterpriseHome onNavigate={setCurrentPage} />;
      case 'publish':
        return <ServicePublish />;
      case 'operations':
        return <OperationsManagement onNavigate={setCurrentPage} />;
      case 'service-review':
        return <ServiceReview onNavigate={setCurrentPage} />;
      case 'procurement':
      case 'capacity':
      case 'supply':
      case 'shop':
      case 'production':
        return <EnterpriseCollaboration type={currentPage} onNavigate={setCurrentPage} />;
      case 'data':
        return <DataCollection />;
      case 'user':
        return <UserCenter />;
      case 'history':
        return <ServiceReviewHistory />;
      case 'enterprise-management':
        return <EnterpriseManagement onNavigate={setCurrentPage} />;
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