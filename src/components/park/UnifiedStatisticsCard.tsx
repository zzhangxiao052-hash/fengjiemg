/**
 * Unified Statistics Card Component
 * 统一的资产统计卡片 - 展示7个核心指标
 * 适用于所有资产管理页面（标准厂房、宿舍、商铺）
 */

import React from 'react';
import { StatisticCard } from '@ant-design/pro-components';
import { Divider } from 'antd';

const { Statistic } = StatisticCard;

export interface UnifiedStats {
  totalCount: number;          // 总资产数
  leasedCount: number;         // 已出租
  vacantCount: number;         // 空闲中
  decorationCount: number;     // 装修中
  
  // Financials - Breakdown
  receivable: {
    rent: number;
    property: number;
    deposit: number;
    total: number;
  };
  received: {
    rent: number;
    property: number;
    deposit: number;
    total: number;
  };
  reduction: {
    rent: number;
    property: number;
    deposit: number;
    total: number;
  };
  arrears: {
    rent: number;
    property: number;
    deposit: number;
    total: number;
  };
}

interface UnifiedStatisticsCardProps {
  stats: UnifiedStats;
  title?: string;
}

const BreakdownItem = ({ label, value, color }: { label: string, value: number, color?: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginTop: 4 }}>
    <span>{label}:</span>
    <span style={{ color: color || 'inherit' }}>¥{value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
  </div>
);

export const UnifiedStatisticsCard: React.FC<UnifiedStatisticsCardProps> = ({ 
  stats, 
  title = '资产统计总览' 
}) => {
  // 计算出租率
  const occupancyRate = stats.totalCount > 0 
    ? ((stats.leasedCount / stats.totalCount) * 100).toFixed(1) 
    : '0.0';

  return (
    <StatisticCard.Group 
      direction="row" 
      style={{ marginBottom: 24 }}
      title={title}
    >
      {/* 左侧：资产状态统计 (2x2 布局) - 占据 8/24 宽度 */}
      <StatisticCard colSpan={8} direction="column" ghost>
        <StatisticCard.Group direction="row" ghost>
          <StatisticCard
            statistic={{
              title: '总资产数',
              value: stats.totalCount,
              suffix: '个',
            }}
          />
          <StatisticCard
            statistic={{
              title: '已出租',
              value: stats.leasedCount,
              suffix: `个 (${occupancyRate}%)`,
              valueStyle: { color: '#3f8600' },
            }}
          />
        </StatisticCard.Group>
        
        <Divider style={{ margin: 0 }} />
        
        <StatisticCard.Group direction="row" ghost>
          <StatisticCard
            statistic={{
              title: '空闲中',
              value: stats.vacantCount,
              suffix: '个',
              valueStyle: { color: '#1890ff' },
            }}
          />
          <StatisticCard
            statistic={{
              title: '装修中',
              value: stats.decorationCount,
              suffix: '个',
              valueStyle: { color: '#faad14' },
            }}
          />
        </StatisticCard.Group>
      </StatisticCard>

      <StatisticCard.Divider />

      {/* 右侧：财务统计 (1x4 布局) - 占据 16/24 宽度 */}
      <StatisticCard colSpan={16} direction="row" ghost>
        <StatisticCard
          statistic={{
            title: '本年应收',
            value: stats.receivable.total,
            precision: 2,
            prefix: '¥',
            valueStyle: { color: '#000000' },
          }}
          footer={
            <div style={{ marginTop: 8 }}>
              <BreakdownItem label="租金" value={stats.receivable.rent} />
              <BreakdownItem label="物管" value={stats.receivable.property} />
              <BreakdownItem label="保证金" value={stats.receivable.deposit} />
            </div>
          }
        />
        <StatisticCard.Divider />
        <StatisticCard
          statistic={{
            title: '本年实收',
            value: stats.received.total,
            precision: 2,
            prefix: '¥',
            valueStyle: { color: '#52c41a' },
          }}
          footer={
            <div style={{ marginTop: 8 }}>
              <BreakdownItem label="租金" value={stats.received.rent} />
              <BreakdownItem label="物管" value={stats.received.property} />
              <BreakdownItem label="保证金" value={stats.received.deposit} />
            </div>
          }
        />
        <StatisticCard.Divider />
        <StatisticCard
          statistic={{
            title: '政策减免',
            value: stats.reduction.total,
            precision: 2,
            prefix: '¥',
            valueStyle: { color: '#722ed1' },
          }}
          footer={
            <div style={{ marginTop: 8 }}>
              <BreakdownItem label="租金" value={stats.reduction.rent} />
              <BreakdownItem label="物管" value={stats.reduction.property} />
              <BreakdownItem label="保证金" value={stats.reduction.deposit} />
            </div>
          }
        />
        <StatisticCard.Divider />
        <StatisticCard
          statistic={{
            title: '欠费金额',
            value: stats.arrears.total,
            precision: 2,
            prefix: '¥',
            valueStyle: { color: stats.arrears.total > 0 ? '#ff4d4f' : '#52c41a' },
          }}
          footer={
            <div style={{ marginTop: 8 }}>
              <BreakdownItem label="租金" value={stats.arrears.rent} />
              <BreakdownItem label="物管" value={stats.arrears.property} />
              <BreakdownItem label="保证金" value={stats.arrears.deposit} />
            </div>
          }
        />
      </StatisticCard>
    </StatisticCard.Group>
  );
};

export default UnifiedStatisticsCard;
