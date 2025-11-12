import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import CommerceHome from './commerce/CommerceHome';
import LogisticsDemand from './commerce/LogisticsDemand';
import LogisticsService from './commerce/LogisticsService';
import EnterpriseList from './commerce/EnterpriseList';
import StatisticsPage from './commerce/StatisticsPage';
import SystemSettings from './commerce/SystemSettings';
import { LayoutDashboard, TruckIcon, Package, Building, BarChart3, Settings } from 'lucide-react';

interface CommerceDashboardProps {
  username: string;
  onLogout: () => void;
}

export default function CommerceDashboard({ username, onLogout }: CommerceDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'demand', label: '物流需求', icon: <Package className="h-5 w-5" /> },
    { id: 'service', label: '物流服务', icon: <TruckIcon className="h-5 w-5" /> },
    { id: 'enterprise', label: '企业列表', icon: <Building className="h-5 w-5" /> },
    { id: 'settings', label: '系统设置', icon: <Settings className="h-5 w-5" /> },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <CommerceHome onNavigate={setCurrentPage} />;
      case 'demand':
        return <LogisticsDemand onNavigate={setCurrentPage} />;
      case 'service':
        return <LogisticsService onNavigate={setCurrentPage} />;
      case 'enterprise':
        return <EnterpriseList onNavigate={setCurrentPage} />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <CommerceHome onNavigate={setCurrentPage} />;
    }
  };

  return (
    <DashboardLayout
      username={username}
      roleLabel="商务委管理端"
      menuItems={menuItems}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}