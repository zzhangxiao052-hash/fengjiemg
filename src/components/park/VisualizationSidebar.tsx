import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Map, Zap, Building2 } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

interface VisualizationSidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

const VisualizationSidebar: React.FC<VisualizationSidebarProps> = ({ activeItem, onItemClick }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['visualization', 'return-entrepreneurship']);

  const menuItems: MenuItem[] = [
    {
      id: 'visualization',
      label: '可视化页面管理',
      icon: <Map className="w-4 h-4" />,
      children: [
        {
          id: 'return-entrepreneurship',
          label: '返乡创业一张图',
          children: [
            { id: 'return-home', label: '驾驶舱主页配置' },
            { id: 'return-park-detail', label: '园区详情页配置' },
            { id: 'return-enterprise-detail', label: '企业详情页配置' },
            { id: 'return-intro-dialog', label: '介绍弹窗配置' },
          ],
        },
        {
          id: 'energy-map',
          label: '能源一张图',
          children: [
            { id: 'energy-home', label: '能源主页配置' },
            { id: 'energy-detail', label: '能源详情配置' },
          ],
        },
        {
          id: 'park-map',
          label: '园区一张图',
          children: [
            { id: 'park-overview', label: '园区总览配置' },
            { id: 'park-economy', label: '经济运行配置' },
            { id: 'park-assets', label: '资产管理配置' },
          ],
        },
      ],
    },
  ];

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;

    const paddingLeft = `${(level + 1) * 16}px`;

    return (
      <div key={item.id}>
        <div
          className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-all ${
            isActive
              ? 'bg-blue-50 text-blue-700 border-r-3 border-blue-600'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          style={{ paddingLeft }}
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else {
              onItemClick(item.id);
            }
          }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            <span className="text-sm font-medium truncate">{item.label}</span>
          </div>
          {hasChildren && (
            <span className="shrink-0 text-slate-400">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className="bg-slate-50/50">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900">可视化大屏配置</h2>
        <p className="text-xs text-slate-500 mt-1">选择要配置的页面模块</p>
      </div>
      <div className="py-2">
        {menuItems.map((item) => renderMenuItem(item))}
      </div>
    </div>
  );
};

export default VisualizationSidebar;
