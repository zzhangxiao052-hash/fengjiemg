import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import FinanceHome from './finance/FinanceHome';
import FinanceServiceList from './finance/FinanceServiceList';
import FinanceDemandList from './finance/FinanceDemandList';
import FinanceProductAudit from './finance/FinanceProductAudit';
import EnterpriseList from './finance/EnterpriseList';
import StatisticsPage from './finance/StatisticsPage';
import SystemSettings from './finance/SystemSettings';
import EnterpriseDetail from './enterprise/EnterpriseDetail';
import { LayoutDashboard, Briefcase, FileText, BarChart3, Building, Settings } from 'lucide-react';

interface FinanceDashboardProps {
  username: string;
  onLogout: () => void;
}

export default function FinanceDashboard({ username, onLogout }: FinanceDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'service', label: '金融服务管理', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'demand', label: '金融需求管理', icon: <FileText className="h-5 w-5" /> },
    { id: 'enterprise', label: '企业列表', icon: <Building className="h-5 w-5" /> },
    { id: 'settings', label: '系统设置', icon: <Settings className="h-5 w-5" /> },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <FinanceHome onNavigate={setCurrentPage} />;
      case 'service':
        return <FinanceServiceList />;
      case 'demand':
        return <FinanceDemandList />;
      case 'enterprise':
        return <EnterpriseList onNavigate={setCurrentPage} />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <FinanceHome onNavigate={setCurrentPage} />;
    }
  };

  if (currentPage.startsWith('enterprise-detail-')) {
    const enterpriseId = currentPage.split('-')[2];
    return (
      <DashboardLayout
        username={username}
        roleLabel="金融办管理端"
        menuItems={menuItems}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={onLogout}
      >
        <EnterpriseDetail enterpriseId={enterpriseId} onBack={() => setCurrentPage('enterprise')} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      username={username}
      roleLabel="金融办管理端"
      menuItems={menuItems}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}