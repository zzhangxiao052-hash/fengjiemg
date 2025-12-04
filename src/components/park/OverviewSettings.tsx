import React, { useRef } from 'react';
import {
  ProCard,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormList,
  ProFormGroup,
  EditableProTable,
  ProFormDigit,
} from '@ant-design/pro-components';
import type { ProFormInstance, ProColumns } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

// --- Types ---
interface TopMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
}

interface ParkMarker {
  id: string;
  name: string;
  area: string;
  coreIndustry: string;
}

interface VideoConfig {
  name: string;
  url: string;
}

interface EnergyStat {
  id: string;
  year: string;
  water: number;
  electricity: number;
  gas: number;
}

interface IndustryLayoutItem {
  id: string;
  name: string;
  value: number;
}

interface EnterpriseTypeDist {
  id: string;
  type: string;
  count: number;
}

interface ProductOutputItem {
  id: string;
  name: string;
  output: number;
}

interface OverviewFormValues {
  topMetrics: TopMetric[];
  parkMarkers: ParkMarker[];
  ecologyOverview: string;
  videos: VideoConfig[];
  energyStats: EnergyStat[];
  industryLayout: IndustryLayoutItem[];
  glassesIndustry: {
    enterpriseCount: number;
    output: number;
    patents: number;
    trademarks: number;
  };
  agriIndustry: {
    enterpriseCount: number;
    output: number;
    distribution: EnterpriseTypeDist[];
  };
  productOutput: ProductOutputItem[];
}

// --- Initial Data (Mock) ---
const initialValues: OverviewFormValues = {
  topMetrics: [
    { id: '1', name: '工业总产值', value: 100, unit: '亿元' },
    { id: '2', name: '用地面积', value: 1320, unit: '亩' },
    { id: '3', name: '总发电量', value: 2654, unit: '万kWh' },
  ],
  parkMarkers: [
    { id: '1', name: '安坪组团', area: '8KM²', coreIndustry: '能源' },
    { id: '2', name: '草堂组团', area: '6KM²', coreIndustry: '农副产品' },
  ],
  ecologyOverview: '2023年全县实现工业增加值47亿元，增长3.5%，占GDP比重13.8%...',
  videos: [
    { name: '园区入口', url: 'rtsp://admin:123456@192.168.1.101' },
    { name: '全景监控', url: 'rtsp://admin:123456@192.168.1.102' },
  ],
  energyStats: [
    { id: '1', year: '2023', water: 1700, electricity: 2200, gas: 700 },
    { id: '2', year: '2024', water: 1800, electricity: 2300, gas: 800 },
  ],
  industryLayout: [
    { id: '1', name: '眼镜产业', value: 30 },
    { id: '2', name: '农副产品', value: 25 },
  ],
  glassesIndustry: {
    enterpriseCount: 2654,
    output: 2654,
    patents: 120,
    trademarks: 50,
  },
  agriIndustry: {
    enterpriseCount: 120,
    output: 1500,
    distribution: [
      { id: '1', type: '米面加工', count: 36 },
      { id: '2', type: '肉类加工', count: 15 },
    ],
  },
  productOutput: [
    { id: '1', name: '菜籽油加工', output: 5000 },
  ],
};

export default function OverviewSettings() {
  const formRef = useRef<ProFormInstance>(null);

  const handleFinish = async (values: OverviewFormValues) => {
    console.log('Submitted values:', values);
    message.success('配置已保存');
    return true;
  };

  // --- Columns Definitions ---
  const parkMarkerColumns: ProColumns<ParkMarker>[] = [
    { title: '园区名称', dataIndex: 'name', formItemProps: { rules: [{ required: true }] } },
    { title: '占地面积', dataIndex: 'area' },
    { title: '核心产业', dataIndex: 'coreIndustry' },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a key="delete" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
      ],
    },
  ];

  const energyColumns: ProColumns<EnergyStat>[] = [
    { title: '年份', dataIndex: 'year' },
    { title: '用水量 (万立方)', dataIndex: 'water', valueType: 'digit' },
    { title: '用电量 (kWh)', dataIndex: 'electricity', valueType: 'digit' },
    { title: '用气量 (万立方)', dataIndex: 'gas', valueType: 'digit' },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a key="delete" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
      ],
    },
  ];

  const industryLayoutColumns: ProColumns<IndustryLayoutItem>[] = [
    { title: '产业名称', dataIndex: 'name' },
    { title: '数值/占比', dataIndex: 'value', valueType: 'digit' },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a key="delete" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
      ],
    },
  ];

  const agriDistColumns: ProColumns<EnterpriseTypeDist>[] = [
    { title: '企业类型', dataIndex: 'type' },
    { title: '数量 (家)', dataIndex: 'count', valueType: 'digit' },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a key="delete" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
      ],
    },
  ];

  const productOutputColumns: ProColumns<ProductOutputItem>[] = [
    { title: '产品名称', dataIndex: 'name' },
    { title: '产量 (KG)', dataIndex: 'output', valueType: 'digit' },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a key="delete" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
      ],
    },
  ];

  return (
    <ProForm<OverviewFormValues>
      formRef={formRef}
      initialValues={initialValues}
      onFinish={handleFinish}
      // submitter removed to avoid duplicate top-right fixed button; submission
      // should be handled by page-level controls when embedded in VisualizationManagement
      layout="horizontal"
    >
      <ProCard ghost gutter={[16, 16]} direction="column">
        
        {/* --- 1. Center/Top: Map & Core Metrics --- */}
        <ProCard title="地图与核心指标 (Center/Top)" headerBordered bordered>
          <ProFormGroup title="顶部核心指标">
            <ProFormList
              name="topMetrics"
              min={3}
              max={3}
              copyIconProps={false}
              deleteIconProps={false}
              creatorButtonProps={false}
              itemRender={({ listDom, action }, { index }) => (
                <ProCard bordered style={{ marginBottom: 8 }} bodyStyle={{ padding: 16 }}>
                  {listDom}
                </ProCard>
              )}
            >
              <ProFormGroup>
                <ProFormText name="name" label="指标名称" width="sm" disabled />
                <ProFormDigit name="value" label="数值" width="sm" />
                <ProFormText name="unit" label="单位" width="xs" />
              </ProFormGroup>
            </ProFormList>
          </ProFormGroup>

          <ProCard title="园区卡片信息 (Map Markers)" bordered={false} style={{ marginTop: 16 }}>
            <EditableProTable<ParkMarker>
              name="parkMarkers"
              rowKey="id"
              columns={parkMarkerColumns}
              recordCreatorProps={{
                newRecordType: 'dataSource',
                record: () => ({ id: Date.now().toString(), name: '新园区', area: '', coreIndustry: '' }),
              }}
              editable={{
                type: 'multiple',
              }}
            />
          </ProCard>
        </ProCard>

        {/* --- Split Layout: Left & Right --- */}
        <ProCard ghost gutter={16}>
          
          {/* --- 2. Left Section: Ecology & Energy --- */}
          <ProCard colSpan={10} title="左侧屏配置 (生态与能源)" headerBordered bordered direction="column">
            <ProFormTextArea
              name="ecologyOverview"
              label="生态工业发展概览"
              placeholder="请输入左上角的文字介绍"
              fieldProps={{ rows: 4 }}
            />

            <ProCard title="园区风光 (视频矩阵)" bordered={false} style={{ marginTop: 16 }}>
              <ProFormList
                name="videos"
                label="视频流配置 (Max 4)"
                creatorButtonProps={{
                  creatorButtonText: '添加摄像头',
                }}
                max={4}
                itemRender={({ listDom, action }, { index }) => (
                  <ProCard
                    bordered
                    style={{ marginBottom: 8 }}
                    extra={action}
                    bodyStyle={{ padding: 16 }}
                  >
                    {listDom}
                  </ProCard>
                )}
              >
                <ProFormGroup>
                  <ProFormText name="name" label="摄像头名称" width="sm" rules={[{ required: true }]} />
                  <ProFormText name="url" label="视频流地址 (RTSP/HLS)" width="md" rules={[{ required: true }]} />
                </ProFormGroup>
              </ProFormList>
            </ProCard>

            <ProCard title="用能情况统计 (Bar Chart)" bordered={false} style={{ marginTop: 16 }}>
              <EditableProTable<EnergyStat>
                name="energyStats"
                rowKey="id"
                columns={energyColumns}
                recordCreatorProps={{
                  newRecordType: 'dataSource',
                  record: () => ({ id: Date.now().toString(), year: '2025', water: 0, electricity: 0, gas: 0 }),
                }}
                editable={{
                  type: 'multiple',
                }}
              />
            </ProCard>
          </ProCard>

          {/* --- 3. Right Section: Industry Data --- */}
          <ProCard colSpan={14} title="右侧屏配置 (产业数据)" headerBordered bordered>
            <ProCard
              tabs={{
                type: 'card',
              }}
            >
              <ProCard.TabPane key="tab1" tab="产业布局统计">
                <EditableProTable<IndustryLayoutItem>
                  name="industryLayout"
                  rowKey="id"
                  columns={industryLayoutColumns}
                  recordCreatorProps={{
                    newRecordType: 'dataSource',
                    record: () => ({ id: Date.now().toString(), name: '新产业', value: 0 }),
                  }}
                  editable={{
                    type: 'multiple',
                  }}
                />
              </ProCard.TabPane>

              <ProCard.TabPane key="tab2" tab="特色产业详情">
                <ProCard title="眼镜产业情况" bordered style={{ marginBottom: 16 }} headerBordered>
                  <ProFormGroup>
                    <ProFormDigit name={['glassesIndustry', 'enterpriseCount']} label="企业数量 (家)" width="xs" />
                    <ProFormDigit name={['glassesIndustry', 'output']} label="总产值 (万元)" width="xs" />
                    <ProFormDigit name={['glassesIndustry', 'patents']} label="专利 (项)" width="xs" />
                    <ProFormDigit name={['glassesIndustry', 'trademarks']} label="注册商标 (个)" width="xs" />
                  </ProFormGroup>
                </ProCard>

                <ProCard title="农副产品加工产业情况" bordered headerBordered>
                  <ProFormGroup>
                    <ProFormDigit name={['agriIndustry', 'enterpriseCount']} label="企业数量 (家)" width="sm" />
                    <ProFormDigit name={['agriIndustry', 'output']} label="总产值 (万元)" width="sm" />
                  </ProFormGroup>
                  
                  <div style={{ marginTop: 16 }}>
                    <div style={{ marginBottom: 8, fontWeight: 500 }}>企业类型分布:</div>
                    <EditableProTable<EnterpriseTypeDist>
                      name={['agriIndustry', 'distribution']}
                      rowKey="id"
                      columns={agriDistColumns}
                      recordCreatorProps={{
                        newRecordType: 'dataSource',
                        record: () => ({ id: Date.now().toString(), type: '新类型', count: 0 }),
                      }}
                      editable={{
                        type: 'multiple',
                      }}
                    />
                  </div>
                </ProCard>
              </ProCard.TabPane>

              <ProCard.TabPane key="tab3" tab="产品产量统计">
                <EditableProTable<ProductOutputItem>
                  name="productOutput"
                  rowKey="id"
                  columns={productOutputColumns}
                  recordCreatorProps={{
                    newRecordType: 'dataSource',
                    record: () => ({ id: Date.now().toString(), name: '新产品', output: 0 }),
                  }}
                  editable={{
                    type: 'multiple',
                  }}
                />
              </ProCard.TabPane>
            </ProCard>
          </ProCard>

        </ProCard>
      </ProCard>
    </ProForm>
  );
}
