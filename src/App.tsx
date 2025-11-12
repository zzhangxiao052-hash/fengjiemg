import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import FinanceDashboard from './components/FinanceDashboard';
import EnterpriseDashboard from './components/EnterpriseDashboard';
import HRDashboard from './components/HRDashboard';
import CommerceDashboard from './components/CommerceDashboard';
import ParkDashboard from './components/ParkDashboard';
import { Toaster } from './components/ui/sonner';

export type UserRole = 'finance' | 'enterprise' | 'hr' | 'commerce' | 'park' | null;

function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [username, setUsername] = useState('');

  const handleLogin = (role: UserRole, user: string) => {
    setCurrentRole(role);
    setUsername(user);
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setUsername('');
  };

  if (!currentRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      {currentRole === 'finance' && <FinanceDashboard username={username} onLogout={handleLogout} />}
      {currentRole === 'enterprise' && <EnterpriseDashboard username={username} onLogout={handleLogout} />}
      {currentRole === 'hr' && <HRDashboard username={username} onLogout={handleLogout} />}
      {currentRole === 'commerce' && <CommerceDashboard username={username} onLogout={handleLogout} />}
      {currentRole === 'park' && <ParkDashboard username={username} onLogout={handleLogout} />}
      {/* TODO: Integrate react-router-dom for proper routing */}
      {/* <Route path="/enterprise/:id" element={<EnterpriseDetail />} /> */}
      <Toaster />
    </>
  );
}

export default App;
