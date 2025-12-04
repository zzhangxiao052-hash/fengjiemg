import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
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
  outputValueStats: string;

  // Module C: Dual Carbon (Line)
  dualCarbonReduction: string;
  dualCarbonSink: string;
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
  outputValueStats: '29238, 20642, 28353, 28318, 20383, 29105, 27615, 27168, 25338, 25545, 22132, 22715',
  dualCarbonReduction: '491, 325, 215, 471, 284, 261, 318, 206, 409, 155, 158, 546',
  dualCarbonSink: '197, 322, 237, 317, 542, 336, 171, 189, 555, 187, 453, 276',
};

export interface EnergyOneMapSettingsHandle { save: () => void }

const EnergyOneMapSettings = forwardRef<EnergyOneMapSettingsHandle, {}>((props, ref) => {
  const [data, setData] = useState<EnergyOneMapData>(initialEnergyData);
  const [editableKeysA, setEditableRowKeysA] = useState<React.Key[]>([]);
  const formRef = useRef<any>();

  const handleSave = async () => {
    // In a real app, you would validate and send 'data' to the backend
    console.log('Saving data:', data);
    message.success('能源一张图配置已保存');
  };

  useImperativeHandle(ref, () => ({
    save: handleSave,
  }));

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



  return (
    <div style={{ background: '#F5F7FA', padding: '24px' }}>
      <ProForm
        formRef={formRef}
        // remove default submitter (we use parent header save)
        submitter={false}
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
               <ProFormTextArea
                  name="outputValueStats"
                  label="柱状图数据 (逗号分隔数值)"
                  placeholder="请输入12个月份的数值，用英文逗号分隔，如: 2000, 3000, ..."
                  fieldProps={{ rows: 3 }}
               />
            </ProCard>

            {/* Module C */}
            <ProCard title="生态工业双碳统计 (双折线图)" bordered type="inner">
               <ProFormTextArea
                  name="dualCarbonReduction"
                  label="减碳量数据 (逗号分隔数值)"
                  placeholder="请输入12个月份的减碳量数值，用英文逗号分隔"
                  fieldProps={{ rows: 3 }}
               />
               <ProFormTextArea
                  name="dualCarbonSink"
                  label="碳汇量数据 (逗号分隔数值)"
                  placeholder="请输入12个月份的碳汇量数值，用英文逗号分隔"
                  fieldProps={{ rows: 3 }}
               />
            </ProCard>

          </ProCard>
        </ProCard>
      </ProForm>
    </div>
  );
});

export default EnergyOneMapSettings;
