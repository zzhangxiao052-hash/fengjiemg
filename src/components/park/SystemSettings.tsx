import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent } from '../ui/tabs';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select'; // 导入 Select 组件
import DepartmentManagement from './DepartmentManagement';
import AccountManagement from './AccountManagement';
import PermissionManagement from './PermissionManagement';
import RoleManagement from './RoleManagement';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('department');

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-slate-900 text-2xl font-semibold">系统设置</h1>
        <p className="text-slate-500 mt-1">管理园区管理系统的各项配置</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {/* 下拉菜单导航 */}
          {/* 桌面端左侧导航栏 */}
          <div className="hidden md:block w-64 flex-shrink-0 bg-white rounded-lg border border-slate-200 shadow-sm">
            <nav className="flex flex-col p-2 space-y-1">
              <button
                onClick={() => setActiveTab('department')}
                className={`px-4 py-2 rounded text-left transition-colors ${activeTab === 'department' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] font-medium' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                部门管理
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`px-4 py-2 rounded text-left transition-colors ${activeTab === 'permissions' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] font-medium' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                权限管理
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`px-4 py-2 rounded text-left transition-colors ${activeTab === 'roles' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] font-medium' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                角色管理
              </button>
              <button
                onClick={() => setActiveTab('accounts')}
                className={`px-4 py-2 rounded text-left transition-colors ${activeTab === 'accounts' ? 'bg-[#1E3A8A]/10 text-[#1E3A8A] font-medium' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                账号管理
              </button>
            </nav>
          </div>
          {/* 右侧内容区 */}
          <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="md:hidden w-full mb-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择设置项" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">部门管理</SelectItem>
                  <SelectItem value="permissions">权限管理</SelectItem>
                  <SelectItem value="roles">角色管理</SelectItem>
                  <SelectItem value="accounts">账号管理</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <TabsContent value="department">
              <DepartmentManagement />
            </TabsContent>
            <TabsContent value="permissions">
              <PermissionManagement />
            </TabsContent>

            <TabsContent value="roles">
              <RoleManagement />
            </TabsContent>
            <TabsContent value="accounts">
              <AccountManagement />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}