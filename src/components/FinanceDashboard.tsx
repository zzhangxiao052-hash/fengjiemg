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
import { LayoutDashboard, Briefcase, FileText, BarChart3, Building, Settings, History } from 'lucide-react';

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
    { id: 'history', label: '历史记录', icon: <History className="h-5 w-5" /> },
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
      case 'history':
        return <FinanceHistoryView />;
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

function FinanceHistoryView() {
  const [records, setRecords] = React.useState<any[]>([]);
  React.useEffect(() => {
    const key = 'financeHistory';
    const existing = localStorage.getItem(key);
    setRecords(existing ? JSON.parse(existing) : []);
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">历史记录</h1>
        <p className="text-slate-500 mt-1">来源：金融需求同意/拒绝与金融服务删除操作</p>
      </div>
      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-3">类型</th>
              <th className="p-3">操作</th>
              <th className="p-3">目标</th>
              <th className="p-3">操作人</th>
              <th className="p-3">时间</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.type}</td>
                <td className="p-3">{r.action}</td>
                <td className="p-3">{r.target}</td>
                <td className="p-3">{r.operator}</td>
                <td className="p-3">{r.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
