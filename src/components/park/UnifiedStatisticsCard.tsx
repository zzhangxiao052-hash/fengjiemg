/**
 * Unified Statistics Card Component
 * 统一的资产统计卡片 - 展示7个核心指标
 * 适用于所有资产管理页面（标准厂房、宿舍、商铺）
 */

import React from 'react';
import { StatisticCard } from '@ant-design/pro-components';

const { Statistic } = StatisticCard;

export interface UnifiedStats {
  totalCount: number;          // 总资产数
  leasedCount: number;         // 已出租
  vacantCount: number;         // 空闲中
  decorationCount: number;     // 装修中
  totalReceivable: number;     // 本年应收租金
  totalReceived: number;       // 本年实收租金
  arrearsAmount: number;       // 欠费金额
}

interface UnifiedStatisticsCardProps {
  stats: UnifiedStats;
  title?: string;
}

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
      {/* 1. 总资产数 */}
      <StatisticCard
        statistic={{
          title: '总资产数',
          value: stats.totalCount,
          suffix: '个',
        }}
        chartPlacement="left"
      />

      {/* 2. 已出租 */}
      <StatisticCard
        statistic={{
          title: '已出租',
          value: stats.leasedCount,
          suffix: `个 (${occupancyRate}%)`,
          valueStyle: { color: '#3f8600' },
        }}
      />

      {/* 3. 空闲中 */}
      <StatisticCard
        statistic={{
          title: '空闲中',
          value: stats.vacantCount,
          suffix: '个',
          valueStyle: { color: '#1890ff' },
        }}
      />

      {/* 4. 装修中 */}
      <StatisticCard
        statistic={{
          title: '装修中',
          value: stats.decorationCount,
          suffix: '个',
          valueStyle: { color: '#faad14' },
        }}
      />

      {/* 5. 本年应收租金 */}
      <StatisticCard
        statistic={{
          title: '本年应收租金',
          value: stats.totalReceivable,
          precision: 2,
          prefix: '¥',
          valueStyle: { color: '#000000' },
        }}
      />

      {/* 6. 本年实收租金 */}
      <StatisticCard
        statistic={{
          title: '本年实收租金',
          value: stats.totalReceived,
          precision: 2,
          prefix: '¥',
          valueStyle: { color: '#52c41a' },
        }}
      />

      {/* 7. 欠费金额 */}
      <StatisticCard
        statistic={{
          title: '欠费金额',
          value: stats.arrearsAmount,
          precision: 2,
          prefix: '¥',
          valueStyle: { color: stats.arrearsAmount > 0 ? '#ff4d4f' : '#52c41a' },
        }}
      />
    </StatisticCard.Group>
  );
};

export default UnifiedStatisticsCard;
