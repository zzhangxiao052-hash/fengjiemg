import React, { useState } from 'react';
import { ProCard, EditableProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Tabs } from 'antd';

// --- Types ---
export interface ElementMetric { id: string; name: string; value: string; unit: string; growth: string; }
export interface TimeSeriesData { id: string; label: string; value: string; }
export interface ElementChartData {
  monthly: TimeSeriesData[];
  yearly: TimeSeriesData[];
}

export interface ElementsData {
  energyMetrics: ElementMetric[];
  waterStats: ElementChartData;
  electricityStats: ElementChartData;
  gasStats: ElementChartData;
}

// --- Initial Data ---
const initialElementsData: ElementsData = {
  energyMetrics: [
    { id: 'em1', name: '年度用水量统计', value: '2540', unit: '万立方', growth: '42' },
    { id: 'em2', name: '年度用电量统计', value: '2540', unit: 'kWh', growth: '42' },
    { id: 'em3', name: '年度用气量统计', value: '2540', unit: '万立方', growth: '42' },
  ],
  waterStats: {
    monthly: Array.from({ length: 12 }, (_, i) => ({ id: `wm-${i}`, label: `${String(i + 1).padStart(2, '0')}`, value: String(Math.floor(Math.random() * 1000) + 1000) })),
    yearly: Array.from({ length: 5 }, (_, i) => ({ id: `wy-${i}`, label: `${2021 + i}`, value: String(Math.floor(Math.random() * 1000) + 2000) })),
  },
  electricityStats: {
    monthly: Array.from({ length: 12 }, (_, i) => ({ id: `em-${i}`, label: `${String(i + 1).padStart(2, '0')}`, value: String(Math.floor(Math.random() * 1000) + 1000) })),
    yearly: Array.from({ length: 5 }, (_, i) => ({ id: `ey-${i}`, label: `${2021 + i}`, value: String(Math.floor(Math.random() * 1000) + 2000) })),
  },
  gasStats: {
    monthly: Array.from({ length: 12 }, (_, i) => ({ id: `gm-${i}`, label: `${String(i + 1).padStart(2, '0')}`, value: String(Math.floor(Math.random() * 1000) + 1000) })),
    yearly: Array.from({ length: 5 }, (_, i) => ({ id: `gy-${i}`, label: `${2021 + i}`, value: String(Math.floor(Math.random() * 1000) + 2000) })),
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

  const monthlyColumns: ProColumns<TimeSeriesData>[] = [
    {
      title: '月份',
      dataIndex: 'label',
      valueType: 'select',
      valueEnum: {
        '01': '1月', '02': '2月', '03': '3月', '04': '4月', '05': '5月', '06': '6月',
        '07': '7月', '08': '8月', '09': '9月', '10': '10月', '11': '11月', '12': '12月',
      },
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] },
    },
    {
      title: '数值',
      dataIndex: 'value',
      valueType: 'digit',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
      ],
    },
  ];

  const yearlyColumns: ProColumns<TimeSeriesData>[] = [
    {
      title: '年份',
      dataIndex: 'label',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] },
    },
    {
      title: '数值',
      dataIndex: 'value',
      valueType: 'digit',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
        <a key="delete" onClick={() => {
            // Note: This delete logic needs to be passed down or handled via context if generic
            // But here we are inside the component, so we need to know which section we are editing.
            // I will handle this in the render function by creating specific handlers or using closures.
        }}>删除</a>,
      ],
    },
  ];

  // Helper to create EditableProTable for TimeSeriesData
  const renderTimeSeriesTable = (
    section: 'waterStats' | 'electricityStats' | 'gasStats',
    type: 'monthly' | 'yearly'
  ) => {
    const isMonthly = type === 'monthly';
    const dataSource = data[section][type];
    
    return (
      <EditableProTable<TimeSeriesData>
        rowKey="id"
        headerTitle={`${isMonthly ? '月度' : '年度'}数据`}
        maxLength={isMonthly ? 12 : 10}
        recordCreatorProps={
          isMonthly
            ? false // Usually monthly data is fixed 12 months, but let's allow editing existing ones. 
            : {
                position: 'bottom',
                record: () => ({ id: Date.now().toString(), label: '2026', value: '0' }),
              }
        }
        columns={isMonthly ? monthlyColumns : yearlyColumns}
        value={dataSource}
        onChange={(value) => {
            setData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [type]: [...value]
                }
            }));
        }}
        editable={{
          type: 'multiple',
          onDelete: async (key, row) => {
             setData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [type]: prev[section][type].filter(item => item.id !== row.id)
                }
            }));
          },
          onSave: async (key, row) => {
             // Save is handled by onChange usually for controlled component, 
             // but EditableProTable might need explicit handling if not fully controlled via value.
             // With 'value' and 'onChange', it should be controlled.
          }
        }}
      />
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
                children: renderTimeSeriesTable('waterStats', 'monthly'),
              },
              {
                key: 'yearly',
                label: '年度统计',
                children: renderTimeSeriesTable('waterStats', 'yearly'),
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
                children: renderTimeSeriesTable('electricityStats', 'monthly'),
              },
              {
                key: 'yearly',
                label: '年度统计',
                children: renderTimeSeriesTable('electricityStats', 'yearly'),
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
                children: renderTimeSeriesTable('gasStats', 'monthly'),
              },
              {
                key: 'yearly',
                label: '年度统计',
                children: renderTimeSeriesTable('gasStats', 'yearly'),
              },
            ]}
          />
        </ProCard>
      </ProCard>
    </ProCard>
  );
}
