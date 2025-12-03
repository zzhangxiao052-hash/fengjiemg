import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import VisualizationManagement from './park/VisualizationManagement';
import { Presentation } from 'lucide-react';

interface EmploymentDashboardProps {
  username: string;
  onLogout: () => void;
}

export default function EmploymentDashboard({ username, onLogout }: EmploymentDashboardProps) {
  const [currentPage, setCurrentPage] = useState('return-management');

  const menuItems = [
    { id: 'return-management', label: '返乡创业一张图页面管理', icon: <Presentation className="h-5 w-5" /> },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'return-management':
      default:
        return <VisualizationManagement pageType="return" />;
    }
  };

  return (
    <DashboardLayout
      username={username}
      roleLabel="就业局管理端"
      menuItems={menuItems}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

