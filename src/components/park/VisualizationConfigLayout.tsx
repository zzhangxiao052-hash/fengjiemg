import React, { useState } from 'react';
import VisualizationSidebar from './VisualizationSidebar';
import EntrepreneurshipMapConfig from './EntrepreneurshipMapConfig';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const VisualizationConfigLayout: React.FC = () => {
  const [activeConfig, setActiveConfig] = useState('return-home');

  const renderConfigContent = () => {
    switch (activeConfig) {
      case 'return-home':
        return <EntrepreneurshipMapConfig />;
      case 'return-park-detail':
        return (
          <div className="min-h-screen bg-slate-50 p-6">
            <Card>
              <CardHeader>
                <CardTitle>园区详情页配置</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500">此功能正在开发中...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'return-enterprise-detail':
        return (
          <div className="min-h-screen bg-slate-50 p-6">
            <Card>
              <CardHeader>
                <CardTitle>企业详情页配置</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500">此功能正在开发中...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'return-intro-dialog':
        return (
          <div className="min-h-screen bg-slate-50 p-6">
            <Card>
              <CardHeader>
                <CardTitle>介绍弹窗配置</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500">此功能正在开发中...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'energy-home':
        return (
          <div className="min-h-screen bg-slate-50 p-6">
            <Card>
              <CardHeader>
                <CardTitle>能源主页配置</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500">此功能正在开发中...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'park-overview':
        return (
          <div className="min-h-screen bg-slate-50 p-6">
            <Card>
              <CardHeader>
                <CardTitle>园区总览配置</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500">此功能正在开发中...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-slate-50 p-6">
            <Card>
              <CardHeader>
                <CardTitle>配置页面</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-500">请从左侧菜单选择要配置的模块</p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <VisualizationSidebar activeItem={activeConfig} onItemClick={setActiveConfig} />
      <div className="flex-1 overflow-y-auto">
        {renderConfigContent()}
      </div>
    </div>
  );
};

export default VisualizationConfigLayout;
