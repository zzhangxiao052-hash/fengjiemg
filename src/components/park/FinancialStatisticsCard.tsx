import React from 'react';
import { StatisticCard } from '@ant-design/pro-components';
import { RcFile } from 'antd/es/upload';

const { Statistic } = StatisticCard;

export interface FinancialStats {
  totalCount: number;
  totalReceivable: number;
  totalReceived: number;
  arrearsRate: number;
}

interface FinancialStatisticsCardProps {
  stats: FinancialStats;
  title?: string;
}

export const FinancialStatisticsCard: React.FC<FinancialStatisticsCardProps> = ({ stats, title = '财务概览' }) => {
  return (
    <StatisticCard.Group direction="row" style={{ marginBottom: 24 }}>
      <StatisticCard
        statistic={{
          title: '总资产数',
          value: stats.totalCount,
          icon: <img src="https://gw.alipayobjects.com/zos/alicdn/tX6lQxftC/SVG/asset.svg" alt="icon" width="100%" />,
        }}
      />
      <StatisticCard
        statistic={{
          title: '本年应收租金',
          value: stats.totalReceivable,
          precision: 2,
          prefix: '¥',
          status: 'default',
        }}
      />
      <StatisticCard
        statistic={{
          title: '本年实收租金',
          value: stats.totalReceived,
          precision: 2,
          prefix: '¥',
          status: 'processing',
        }}
      />
      <StatisticCard
        statistic={{
          title: '欠费率',
          value: stats.arrearsRate,
          precision: 2,
          suffix: '%',
          status: stats.arrearsRate > 0 ? 'error' : 'success',
          valueStyle: { color: stats.arrearsRate > 0 ? '#cf1322' : '#3f8600' },
        }}
      />
    </StatisticCard.Group>
  );
};
