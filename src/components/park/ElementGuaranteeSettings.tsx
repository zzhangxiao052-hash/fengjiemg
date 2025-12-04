import React, { useState } from 'react';
import { ProCard, EditableProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Tabs, Input, Row, Col } from 'antd';

// --- Types ---
export interface ElementMetric { id: string; name: string; value: string; unit: string; growth: string; }
export interface TimeSeriesItem {
  label: string;
  value: string;
}

export interface ElementStats {
  monthly: TimeSeriesItem[];
  yearly: TimeSeriesItem[];
}

export interface ElementsData {
  energyMetrics: ElementMetric[];
  waterStats: ElementStats;
  electricityStats: ElementStats;
  gasStats: ElementStats;
}

// --- Initial Data ---
const generateMonthlyData = (values: string[]) => {
  return values.map((val, idx) => ({ label: `${idx + 1}月`, value: val }));
};

const generateYearlyData = (startYear: number, values: string[]) => {
  return values.map((val, idx) => ({ label: `${startYear + idx}年`, value: val }));
};

const initialElementsData: ElementsData = {
  energyMetrics: [
    { id: 'em1', name: '年度用水量统计', value: '2540', unit: '万立方', growth: '42' },
    { id: 'em2', name: '年度用电量统计', value: '2540', unit: 'kWh', growth: '42' },
    { id: 'em3', name: '年度用气量统计', value: '2540', unit: '万立方', growth: '42' },
  ],
  waterStats: {
    monthly: generateMonthlyData(['1587', '1720', '1427', '1326', '1390', '1281', '1701', '1162', '1008', '1960', '1921', '1856']),
    yearly: generateYearlyData(2021, ['2540', '2680', '2890', '3100', '3350']),
  },
  electricityStats: {
    monthly: generateMonthlyData(['1220', '1926', '1957', '1982', '1831', '1835', '1880', '1340', '1113', '1918', '1574', '1232']),
    yearly: generateYearlyData(2021, ['2540', '2680', '2890', '3100', '3350']),
  },
  gasStats: {
    monthly: generateMonthlyData(['1380', '1032', '1440', '1784', '1115', '1914', '1902', '1262', '1497', '1294', '1174', '1667']),
    yearly: generateYearlyData(2021, ['2540', '2680', '2890', '3100', '3350']),
  },
};

export interface ElementGuaranteeSettingsProps {
  value?: ElementsData;
  onChange?: (value: ElementsData) => void;
}

export default function ElementGuaranteeSettings({ value, onChange }: ElementGuaranteeSettingsProps) {
  const [internalData, setInternalData] = useState<ElementsData>(initialElementsData);
  const data = value || internalData;

  const setData = (updater: (prev: ElementsData) => ElementsData) => {
      const newData = updater(data);
      if (onChange) {
          onChange(newData);
      } else {
          setInternalData(newData);
      }
  };

  // --- Columns Definitions ---

  const metricColumns: ProColumns<ElementMetric>[] = [
    {
      title: '指标名称',
      dataIndex: 'name',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] },
    },
    {
      title: '数值',
      dataIndex: 'value',
      valueType: 'digit',
    },
    {
      title: '单位',
      dataIndex: 'unit',
    },
    {
      title: '同比%',
      dataIndex: 'growth',
      valueType: 'digit',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
        <a key="delete" onClick={() => {
            setData(prev => ({
                ...prev,
                energyMetrics: prev.energyMetrics.filter(item => item.id !== record.id)
            }));
        }}>删除</a>,
      ],
    },
  ];

  // Helper to create Grid Inputs for Stats
  const renderTrendInputs = (
    section: 'waterStats' | 'electricityStats' | 'gasStats',
    type: 'monthly' | 'yearly'
  ) => {
    const items = data[section][type];
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="mb-4 text-gray-500">
          {type === 'monthly' ? '请输入1-12月的数值' : '请输入近5年的数值'}
        </div>
        <Row gutter={[16, 16]}>
          {items.map((item, index) => (
            <Col key={index} span={type === 'monthly' ? 4 : 4}>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="mb-2 font-medium text-gray-600">{item.label}</div>
                <Input 
                    value={item.value} 
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setData(prev => {
                            const newItems = [...prev[section][type]];
                            newItems[index] = { ...newItems[index], value: newValue };
                            return {
                                ...prev,
                                [section]: {
                                    ...prev[section],
                                    [type]: newItems
                                }
                            };
                        });
                    }} 
                    className="text-center"
                />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <ProCard ghost split="vertical" gutter={[16, 0]}>
      {/* Left Column */}
      <ProCard colSpan={12} ghost direction="column" gutter={[0, 16]}>
        
        {/* 2.1 Energy Overview */}
        <ProCard title="能耗统计指标 - 左上" bordered headerBordered>
          <EditableProTable<ElementMetric>
            rowKey="id"
            headerTitle="核心指标"
            maxLength={5}
            recordCreatorProps={{
              position: 'bottom',
              record: () => ({ id: Date.now().toString(), name: '新指标', value: '0', unit: '', growth: '0' }),
            }}
            columns={metricColumns}
            value={data.energyMetrics}
            onChange={(value) => setData(prev => ({ ...prev, energyMetrics: [...value] }))}
            editable={{
              type: 'multiple',
            }}
          />
        </ProCard>

        {/* 2.2 Water Consumption */}
        <ProCard title="用水量统计 - 左下" bordered headerBordered>
          <Tabs
            items={[
              {
                key: 'monthly',
                label: '月度统计',
                children: renderTrendInputs('waterStats', 'monthly'),
              },
              {
                key: 'yearly',
                label: '年度统计',
                children: renderTrendInputs('waterStats', 'yearly'),
              },
            ]}
          />
        </ProCard>
      </ProCard>

      {/* Right Column */}
      <ProCard colSpan={12} ghost direction="column" gutter={[0, 16]}>
        
        {/* 3.1 Electricity Consumption */}
        <ProCard title="用电量统计 - 右上" bordered headerBordered>
          <Tabs
            items={[
              {
                key: 'monthly',
                label: '月度统计',
                children: renderTrendInputs('electricityStats', 'monthly'),
              },
              {
                key: 'yearly',
                label: '年度统计',
                children: renderTrendInputs('electricityStats', 'yearly'),
              },
            ]}
          />
        </ProCard>

        {/* 3.2 Gas Consumption */}
        <ProCard title="用气量统计 - 右下" bordered headerBordered>
          <Tabs
            items={[
              {
                key: 'monthly',
                label: '月度统计',
                children: renderTrendInputs('gasStats', 'monthly'),
              },
              {
                key: 'yearly',
                label: '年度统计',
                children: renderTrendInputs('gasStats', 'yearly'),
              },
            ]}
          />
        </ProCard>
      </ProCard>
    </ProCard>
  );
}
