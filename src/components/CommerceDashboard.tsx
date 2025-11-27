import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import CommerceHome from './commerce/CommerceHome';
import LogisticsDemand from './commerce/LogisticsDemand';
import LogisticsService from './commerce/LogisticsService';
import EnterpriseList from './commerce/EnterpriseList';
import StatisticsPage from './commerce/StatisticsPage';
import SystemSettings from './commerce/SystemSettings';
import { LayoutDashboard, TruckIcon, Package, Building, BarChart3, Settings, History } from 'lucide-react';

interface CommerceDashboardProps {
  username: string;
  onLogout: () => void;
}

export default function CommerceDashboard({ username, onLogout }: CommerceDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'demand', label: '物流需求管理', icon: <Package className="h-5 w-5" /> },
    { id: 'service', label: '物流服务管理', icon: <TruckIcon className="h-5 w-5" /> },
    { id: 'enterprise', label: '企业列表', icon: <Building className="h-5 w-5" /> },
    { id: 'settings', label: '系统设置', icon: <Settings className="h-5 w-5" /> },
    { id: 'history', label: '历史记录', icon: <History className="h-5 w-5" /> },
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
      case 'history':
        return <CommerceHistoryView />;
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

function CommerceHistoryView() {
  const [records, setRecords] = React.useState<any[]>([]);
  React.useEffect(() => {
    const key = 'commerceHistory';
    const existing = localStorage.getItem(key);
    setRecords(existing ? JSON.parse(existing) : []);
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">历史记录</h1>
        <p className="text-slate-500 mt-1">来源：物流需求同意/拒绝与物流服务删除操作</p>
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
