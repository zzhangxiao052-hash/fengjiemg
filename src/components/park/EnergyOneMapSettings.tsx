import React, { useState, useRef } from 'react';
import { ProCard, ProForm, ProFormSelect, ProFormTextArea, ProFormDigit, EditableProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

// --- Types ---

export interface EnergyOneMapData {
  // Left Section
  videoSource: string;
  introduction: string;

  // Middle Top Section (5 Indicators)
  industryIndicators: {
    wind: number;
    pv: number;
    hydro: number;
    thermal: number;
    pumpedStorage: number;
  };

  // Right Section
  // Module A: Classification (Pie)
  classificationStats: {
    id: string;
    name: string;
    value: number;
  }[];

  // Module B: Output Value (Bar)
  outputValueStats: {
    id: string;
    month: number;
    value: number;
  }[];

  // Module C: Dual Carbon (Line)
  dualCarbonStats: {
    id: string;
    month: string;
    reduction: number;
    sink: number;
  }[];
}

const initialEnergyData: EnergyOneMapData = {
  videoSource: '草堂工业园全景',
  introduction: '奉节生态工业园区成立于2006年，是重庆市级特色工业园区。园区规划面积13.82平方公里...',
  industryIndicators: {
    wind: 85606,
    pv: 1033,
    hydro: 40228,
    thermal: 540301,
    pumpedStorage: 654,
  },
  classificationStats: [
    { id: '1', name: '加工企业', value: 210 },
    { id: '2', name: '热水蓄能', value: 210 },
    { id: '3', name: '水力发电', value: 210 },
    { id: '4', name: '风力发电', value: 210 },
    { id: '5', name: '光伏', value: 210 },
  ],
  outputValueStats: Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 1}`,
    month: i + 1,
    value: Math.floor(Math.random() * 10000) + 20000,
  })),
  dualCarbonStats: Array.from({ length: 12 }, (_, i) => ({
    id: `${i + 1}`,
    month: `${i + 1}月`,
    reduction: Math.floor(Math.random() * 500) + 100,
    sink: Math.floor(Math.random() * 500) + 100,
  })),
};

export default function EnergyOneMapSettings() {
  const [data, setData] = useState<EnergyOneMapData>(initialEnergyData);
  const [editableKeysA, setEditableRowKeysA] = useState<React.Key[]>([]);
  const [editableKeysB, setEditableRowKeysB] = useState<React.Key[]>([]);
  const [editableKeysC, setEditableRowKeysC] = useState<React.Key[]>([]);
  const formRef = useRef<any>();

  const handleSave = async () => {
    // In a real app, you would validate and send 'data' to the backend
    console.log('Saving data:', data);
    message.success('能源一张图配置已保存');
  };

  // --- Columns Definitions ---

  const columnsA: ProColumns<EnergyOneMapData['classificationStats'][0]>[] = [
    {
      title: '分类名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
    {
      title: '数值 (数量)',
      dataIndex: 'value',
      valueType: 'digit',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setData(prev => ({
              ...prev,
              classificationStats: prev.classificationStats.filter((item) => item.id !== record.id),
            }));
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const columnsB: ProColumns<EnergyOneMapData['outputValueStats'][0]>[] = [
    {
      title: '月份',
      dataIndex: 'month',
      valueType: 'digit',
      editable: false, // Assuming months are fixed 1-12 for simplicity, or make editable
      width: '20%',
    },
    {
      title: '产值金额 (万元)',
      dataIndex: 'value',
      valueType: 'digit',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  const columnsC: ProColumns<EnergyOneMapData['dualCarbonStats'][0]>[] = [
    {
      title: '月份/时间点',
      dataIndex: 'month',
      width: '20%',
    },
    {
      title: '减碳量 (数值)',
      dataIndex: 'reduction',
      valueType: 'digit',
    },
    {
      title: '碳汇量 (数值)',
      dataIndex: 'sink',
      valueType: 'digit',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  return (
    <div style={{ background: '#F5F7FA', padding: '24px' }}>
      <ProForm
        formRef={formRef}
        submitter={{
          render: () => {
            return (
              <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 999, padding: '16px', background: '#fff', width: '100%', borderTop: '1px solid #e8e8e8', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                 <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                  保存全部配置
                </Button>
              </div>
            );
          },
        }}
        initialValues={data}
        onValuesChange={(changedValues, allValues) => {
            // Sync form values to state for simple fields
            // Note: EditableProTable handles its own data via 'value' and 'onChange'
            setData(prev => ({ ...prev, ...changedValues }));
        }}
      >
        <ProCard direction="column" ghost gutter={[0, 16]}>
          
          {/* Top Section: Left Intro & Middle Indicators */}
          <ProCard gutter={16} ghost>
            {/* Left: Introduction & Video */}
            <ProCard colSpan={8} title="左侧简介与视频源配置" headerBordered bordered>
              <ProFormSelect
                name="videoSource"
                label="视频监控源选择"
                options={[
                  { value: '草堂工业园全景', label: '草堂工业园全景' },
                  { value: '风力发电站01', label: '风力发电站01' },
                  { value: '光伏基地02', label: '光伏基地02' },
                ]}
                placeholder="请选择实时监控画面源"
                rules={[{ required: true, message: '请选择视频源' }]}
              />
              <ProFormTextArea
                name="introduction"
                label="简介文本"
                placeholder="请输入全县生态工业简介"
                fieldProps={{ rows: 8 }}
                rules={[{ required: true, message: '请输入简介' }]}
              />
            </ProCard>

            {/* Middle: Core Industry Indicators */}
            <ProCard colSpan={16} title="五大能源产业指标" headerBordered bordered>
               <ProCard.Group direction="row">
                  <ProCard>
                    <ProFormDigit
                        name={['industryIndicators', 'wind']}
                        label="风电产业 (kWh)"
                        min={0}
                        fieldProps={{ precision: 0 }}
                    />
                  </ProCard>
                  <ProCard>
                    <ProFormDigit
                        name={['industryIndicators', 'pv']}
                        label="光伏产业 (kWh)"
                        min={0}
                        fieldProps={{ precision: 0 }}
                    />
                  </ProCard>
                  <ProCard>
                    <ProFormDigit
                        name={['industryIndicators', 'hydro']}
                        label="水电产业 (kWh)"
                        min={0}
                        fieldProps={{ precision: 0 }}
                    />
                  </ProCard>
               </ProCard.Group>
               <ProCard.Group direction="row" style={{ marginTop: 16 }}>
                  <ProCard>
                    <ProFormDigit
                        name={['industryIndicators', 'thermal']}
                        label="火电产业 (kWh)"
                        min={0}
                        fieldProps={{ precision: 0 }}
                    />
                  </ProCard>
                  <ProCard>
                    <ProFormDigit
                        name={['industryIndicators', 'pumpedStorage']}
                        label="抽水蓄能 (kWh)"
                        min={0}
                        fieldProps={{ precision: 0 }}
                    />
                  </ProCard>
                  <ProCard /> {/* Spacer */}
               </ProCard.Group>
            </ProCard>
          </ProCard>

          {/* Bottom Section: Right Charts */}
          <ProCard title="右侧统计图表配置" headerBordered bordered direction="column" gutter={[0, 16]}>
            
            {/* Module A */}
            <ProCard title="生态工业分类统计 (饼图/环图)" bordered type="inner">
              <EditableProTable<EnergyOneMapData['classificationStats'][0]>
                rowKey="id"
                headerTitle="分类数据"
                maxLength={10}
                recordCreatorProps={{
                  position: 'bottom',
                  record: () => ({ id: (Math.random() * 1000000).toFixed(0), name: '新分类', value: 0 }),
                }}
                columns={columnsA}
                value={data.classificationStats}
                onChange={(value) => setData({ ...data, classificationStats: value as any })}
                editable={{
                  type: 'multiple',
                  editableKeys: editableKeysA,
                  onSave: async (rowKey, data, row) => {
                    console.log(rowKey, data, row);
                  },
                  onChange: setEditableRowKeysA,
                }}
              />
            </ProCard>

            {/* Module B */}
            <ProCard title="生态工业产值统计 (柱状图)" bordered type="inner">
               <EditableProTable<EnergyOneMapData['outputValueStats'][0]>
                rowKey="id"
                headerTitle="月度产值数据"
                recordCreatorProps={false} // Disable adding rows if we want fixed 12 months
                columns={columnsB}
                value={data.outputValueStats}
                onChange={(value) => setData({ ...data, outputValueStats: value as any })}
                editable={{
                  type: 'multiple',
                  editableKeys: editableKeysB,
                  onChange: setEditableRowKeysB,
                }}
              />
            </ProCard>

            {/* Module C */}
            <ProCard title="生态工业双碳统计 (双折线图)" bordered type="inner">
               <EditableProTable<EnergyOneMapData['dualCarbonStats'][0]>
                rowKey="id"
                headerTitle="双碳数据"
                recordCreatorProps={false}
                columns={columnsC}
                value={data.dualCarbonStats}
                onChange={(value) => setData({ ...data, dualCarbonStats: value as any })}
                editable={{
                  type: 'multiple',
                  editableKeys: editableKeysC,
                  onChange: setEditableRowKeysC,
                }}
              />
            </ProCard>

          </ProCard>
        </ProCard>
        <div style={{ height: 60 }} /> {/* Spacer for fixed footer */}
      </ProForm>
    </div>
  );
}
