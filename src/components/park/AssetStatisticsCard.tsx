import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { PieChartOutlined, HomeOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

export interface AssetStats {
  totalCount: number;
  totalArea: number;
  leasedCount: number;
  vacantCount: number;
  decorationCount: number;
  occupancyRate: number;
}

interface AssetStatisticsCardProps {
  stats: AssetStats;
  title?: string;
}

export const AssetStatisticsCard: React.FC<AssetStatisticsCardProps> = ({ stats, title = '资产统计' }) => {
  return (
    <Card title={title} style={{ marginBottom: 24 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic 
            title="总资产数" 
            value={stats.totalCount} 
            prefix={<HomeOutlined />} 
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="已出租" 
            value={stats.leasedCount} 
            valueStyle={{ color: '#3f8600' }}
            prefix={<CheckCircleOutlined />}
            suffix={`/ ${stats.occupancyRate}%`}
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="空置中" 
            value={stats.vacantCount} 
            valueStyle={{ color: '#cf1322' }}
            prefix={<WarningOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic 
            title="装修中" 
            value={stats.decorationCount} 
            prefix={<PieChartOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );
};
