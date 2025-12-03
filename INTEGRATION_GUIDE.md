# 返乡创业一张图配置系统 - 集成指南

## 📋 概述

本指南说明如何将新开发的"返乡创业一张图"配置系统集成到现有的园区管理平台中。

## 🚀 快速开始

### 方式1: 替换现有配置页面 (推荐)

在 `src/components/ParkDashboard.tsx` 文件中:

#### 步骤1: 添加导入

```tsx
// 在文件顶部添加
import VisualizationConfigLayout from './park/VisualizationConfigLayout';
```

#### 步骤2: 修改 renderContent 函数

找到以下代码:

```tsx
case 'visualization-return':
  return <VisualizationManagement pageType="return" />;
```

替换为:

```tsx
case 'visualization-return':
  return <VisualizationConfigLayout />;
```

### 方式2: 添加为新的菜单项

#### 步骤1: 在 menuItems 中添加新菜单

```tsx
const menuItems = [
  // ... 现有菜单项
  {
    id: 'visualization-management-group',
    label: '可视化页面管理',
    icon: <Presentation className="h-5 w-5" />,
    children: [
      { id: 'visualization-overview', label: '园区总览页面管理' },
      { id: 'visualization-economy', label: '经济运行页面管理' },
      // ... 其他子菜单
      
      // 新增: 保留旧版本
      { id: 'visualization-return-old', label: '返乡创业一张图 (旧版)' },
      // 新增: 新版本
      { id: 'visualization-return-new', label: '返乡创业一张图 (新版)' },
    ],
  },
];
```

#### 步骤2: 在 renderContent 中添加路由

```tsx
const renderContent = () => {
  switch (currentPage) {
    // ... 现有 case
    
    case 'visualization-return-old':
      return <VisualizationManagement pageType="return" />;
    
    case 'visualization-return-new':
      return <VisualizationConfigLayout />;
    
    default:
      return <ParkHome onNavigate={setCurrentPage} />;
  }
};
```

## 📁 完整示例

### 修改后的 ParkDashboard.tsx

```tsx
import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import ParkHome from './park/ParkHome';
import VisualizationManagement from './park/VisualizationManagement';
import VisualizationConfigLayout from './park/VisualizationConfigLayout'; // 新增
import { Presentation } from 'lucide-react';
// ... 其他导入

export default function ParkDashboard({ username, onLogout }: ParkDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    // ... 其他菜单项
    {
      id: 'visualization-management-group',
      label: '可视化页面管理',
      icon: <Presentation className="h-5 w-5" />,
      children: [
        { id: 'visualization-overview', label: '园区总览页面管理' },
        { id: 'visualization-economy', label: '经济运行页面管理' },
        { id: 'visualization-elements', label: '要素保障页面管理' },
        { id: 'visualization-assets', label: '资产管理页面管理' },
        { id: 'visualization-investment', label: '招商引资页面管理' },
        { id: 'visualization-projects', label: '建设项目页面管理' },
        { id: 'visualization-services', label: '企业服务页面管理' },
        { id: 'visualization-video', label: '视频监控页面管理' },
        { id: 'visualization-energy', label: '能源一张图页面管理' },
        { id: 'visualization-return', label: '返乡创业一张图页面管理' }, // 使用新版
      ],
    },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'visualization-overview':
        return <VisualizationManagement pageType="overview" />;
      case 'visualization-economy':
        return <VisualizationManagement pageType="economy" />;
      case 'visualization-elements':
        return <VisualizationManagement pageType="elements" />;
      case 'visualization-assets':
        return <VisualizationManagement pageType="assets" />;
      case 'visualization-investment':
        return <VisualizationManagement pageType="investment" />;
      case 'visualization-projects':
        return <VisualizationManagement pageType="projects" />;
      case 'visualization-services':
        return <VisualizationManagement pageType="services" />;
      case 'visualization-video':
        return <VisualizationManagement pageType="video" />;
      case 'visualization-energy':
        return <VisualizationManagement pageType="energy" />;
      
      // 使用新的配置布局
      case 'visualization-return':
        return <VisualizationConfigLayout />;
      
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
      onPageChange={setCurrentPage}
      onLogout={onLogout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
```

## 🧪 测试新组件

### 创建独立测试页面

创建文件 `src/TestVisualizationConfig.tsx`:

```tsx
import React from 'react';
import VisualizationConfigLayout from './components/park/VisualizationConfigLayout';

export default function TestVisualizationConfig() {
  return (
    <div className="w-full h-screen">
      <VisualizationConfigLayout />
    </div>
  );
}
```

在 `src/App.tsx` 中临时使用:

```tsx
import TestVisualizationConfig from './TestVisualizationConfig';

function App() {
  // 临时显示测试页面
  return <TestVisualizationConfig />;
  
  // 正常流程
  // return <YourNormalApp />;
}
```

## 💾 后端集成

### API 接口设计

#### 获取配置

```
GET /api/entrepreneurship-config
```

响应示例:
```json
{
  "introduction": "奉节县产业园...",
  "basicIndicators": [
    { "id": "1", "title": "园区", "value": "12", "unit": "个" }
  ],
  "landUsage": {
    "plannedArea": "1320",
    "plannedPercentage": "72",
    "builtArea": "980",
    "builtPercentage": "28"
  },
  "videoMonitors": [...],
  "outputData": {...},
  "employmentData": {...},
  "financeData": {...}
}
```

#### 保存配置

```
POST /api/entrepreneurship-config
Content-Type: application/json

{
  "introduction": "...",
  "basicIndicators": [...],
  ...
}
```

### 前端 API 集成

修改 `src/components/park/EntrepreneurshipMapConfig.tsx`:

```tsx
import React, { useState, useEffect } from 'react';
// ... 其他导入

const EntrepreneurshipMapConfig: React.FC = () => {
  const [config, setConfig] = useState<EntrepreneurshipConfig>(initialConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 加载配置
  useEffect(() => {
    fetch('/api/entrepreneurship-config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('加载失败:', error);
        toast.error('加载配置失败');
        setLoading(false);
      });
  }, []);

  // 保存配置
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/entrepreneurship-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      
      if (response.ok) {
        toast.success('配置已保存');
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存配置失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">加载配置中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部操作栏 */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                返乡创业一张图 - 驾驶舱主页配置
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                配置大屏各区域显示内容与数据
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
                disabled={saving}
              >
                <RotateCcw className="w-4 h-4" />
                重置
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                disabled={saving}
              >
                <Save className="w-4 h-4" />
                {saving ? '保存中...' : '保存配置'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 其余组件内容 */}
    </div>
  );
};
```

## 🔐 权限控制

如果需要权限控制,可以在菜单项中添加权限检查:

```tsx
const menuItems = [
  {
    id: 'visualization-management-group',
    label: '可视化页面管理',
    icon: <Presentation className="h-5 w-5" />,
    permissions: ['admin', 'park_manager'], // 需要的权限
    children: [
      {
        id: 'visualization-return',
        label: '返乡创业一张图页面管理',
        permissions: ['admin', 'visualization_editor'],
      },
    ],
  },
];

// 在渲染前检查权限
const hasPermission = (requiredPermissions: string[]) => {
  const userPermissions = getCurrentUserPermissions();
  return requiredPermissions.some(p => userPermissions.includes(p));
};
```

## 🌐 环境配置

### 开发环境

创建 `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_NEW_VISUALIZATION=true
```

### 生产环境

创建 `.env.production`:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENABLE_NEW_VISUALIZATION=true
```

### 在代码中使用

```tsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 条件渲染新旧版本
const ENABLE_NEW = import.meta.env.VITE_ENABLE_NEW_VISUALIZATION === 'true';

{ENABLE_NEW ? (
  <VisualizationConfigLayout />
) : (
  <VisualizationManagement pageType="return" />
)}
```

## ✅ 集成检查清单

- [ ] 已添加 `VisualizationConfigLayout` 导入
- [ ] 已在菜单中添加新的配置项
- [ ] 已在 renderContent 中添加对应的路由
- [ ] 已测试菜单点击能正确显示新页面
- [ ] 已测试配置保存功能
- [ ] 已测试配置重置功能
- [ ] 已测试各个配置模块的数据输入
- [ ] 已确认在不同屏幕尺寸下的显示效果
- [ ] 已配置后端 API (如果需要)
- [ ] 已添加错误处理和 loading 状态
- [ ] 已添加权限控制 (如果需要)

## 🐛 常见问题

### Q1: 导入组件时报错找不到模块

确保文件路径正确:
```tsx
// 如果 ParkDashboard.tsx 在 src/components/
import VisualizationConfigLayout from './park/VisualizationConfigLayout';

// 如果在其他位置,调整相对路径
import VisualizationConfigLayout from '../components/park/VisualizationConfigLayout';
```

### Q2: 样式显示不正确

确保项目中已安装并正确配置了:
- Tailwind CSS
- shadcn/ui 组件库

### Q3: Toast 通知不显示

确保在根组件中添加了 `<Toaster />`:

```tsx
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <>
      <YourApp />
      <Toaster />
    </>
  );
}
```

## 📞 技术支持

如有问题或需要帮助,请:
1. 检查本文档的常见问题部分
2. 查看 `ENTREPRENEURSHIP_CONFIG_README.md` 了解组件详情
3. 联系开发团队

---

**最后更新**: 2025年12月3日
