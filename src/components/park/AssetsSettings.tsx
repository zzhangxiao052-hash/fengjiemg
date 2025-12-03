import React, { useState } from 'react';
import { ProCard, EditableProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Input, Space, Typography, Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

// --- Types (Copied from VisualizationManagement.tsx to ensure compatibility) ---
export interface AssetMetric { id: string; name: string; value: string; unit: string; }
export interface LandUseData { metrics: AssetMetric[]; }
export interface ConstructionLandData { totalArea: string; percentage: string; items: { id: string; name: string; value: string; percentage: string; }[]; }
export interface PlanningTrendMetric { area: string; percentage: string; }
export interface PlanningTrendData { planning: PlanningTrendMetric; built: PlanningTrendMetric; }
export interface PlanningAreaTrendItem { id: string; year: string; planning: string; built: string; }
export interface RentalItem { id: string; name: string; value: string; unit: string; }
export interface TenantAnalysisItem { id: string; name: string; value: string; percentage: string; }
export interface TenantTableItem { id: string; name: string; area: string; status: string; }

export interface AssetsData {
  landUse: LandUseData;
  constructionLand: ConstructionLandData;
  planningTrend: PlanningTrendData;
  planningAreaTrend: PlanningAreaTrendItem[];
  leasedHouses: { total: string; rate: string; };
  houseRental: RentalItem[];
  tenantAnalysis: TenantAnalysisItem[];
  tenantTable: TenantTableItem[];
}

// --- Initial Data (Fallback) ---
const initialAssetsData: AssetsData = {
  landUse: {
    metrics: [
      { id: 'lu1', name: '用地面积', value: '2654', unit: '亩' },
      { id: 'lu2', name: '已用面积', value: '2654', unit: '亩' },
      { id: 'lu3', name: '出让面积', value: '2654', unit: '亩' },
    ]
  },
  constructionLand: {
    totalArea: '1320',
    percentage: '50%',
    items: [
      { id: 'cl1', name: '居住用地', value: '840', percentage: '48%' },
      { id: 'cl2', name: '工业用地', value: '840', percentage: '48%' },
      { id: 'cl3', name: '商经用地', value: '840', percentage: '48%' },
      { id: 'cl4', name: '其他用地', value: '840', percentage: '48%' },
    ]
  },
  planningTrend: {
    planning: { area: '1320', percentage: '50%' },
    built: { area: '1320', percentage: '50%' }
  },
  planningAreaTrend: [
    { id: 'pat1', year: '2021', planning: '2000', built: '1500' },
    { id: 'pat2', year: '2022', planning: '2200', built: '1600' },
    { id: 'pat3', year: '2023', planning: '2400', built: '1800' },
    { id: 'pat4', year: '2024', planning: '2600', built: '2000' },
    { id: 'pat5', year: '2025', planning: '2800', built: '2200' },
  ],
  leasedHouses: { total: '320', rate: '78%' },
  houseRental: [
    { id: 'hr1', name: '标准厂房', value: '60.15', unit: '%' },
    { id: 'hr2', name: '宿舍', value: '60.15', unit: '%' },
    { id: 'hr3', name: '门市', value: '60.15', unit: '%' },
  ],
  tenantAnalysis: [
    { id: 'ta1', name: '标准厂房', value: '840', percentage: '48%' },
    { id: 'ta2', name: '宿舍', value: '840', percentage: '48%' },
    { id: 'ta3', name: '门市', value: '840', percentage: '48%' },
  ],
  tenantTable: [
    { id: 'tt1', name: '奉节工业园区地块名称', area: '63.2975', status: '已出让' },
    { id: 'tt2', name: '奉节工业园区地块名称', area: '63.2975', status: '已出让' },
    { id: 'tt3', name: '奉节工业园区地块名称', area: '63.2975', status: '已出让' },
  ]
};

export interface AssetsSettingsProps {
  value?: AssetsData;
  onChange?: (value: AssetsData) => void;
}

export default function AssetsSettings({ value, onChange }: AssetsSettingsProps) {
  const [internalData, setInternalData] = useState<AssetsData>(initialAssetsData);
  const data = value || internalData;

  const setData = (updater: (prev: AssetsData) => AssetsData) => {
    const newData = updater(data);
    if (onChange) {
      onChange(newData);
    } else {
      setInternalData(newData);
    }
  };

  // --- Columns Definitions ---

  // 1. Land Use
  const landUseColumns: ProColumns<AssetMetric>[] = [
    { title: '指标名称', dataIndex: 'name', formItemProps: { rules: [{ required: true }] } },
    { title: '数值', dataIndex: 'value' },
    { title: '单位', dataIndex: 'unit' },
    {
      title: '操作', valueType: 'option', width: 100,
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
        <a key="delete" onClick={() => setData(prev => ({ ...prev, landUse: { ...prev.landUse, metrics: prev.landUse.metrics.filter(i => i.id !== record.id) } }))}>删除</a>,
      ],
    },
  ];

  // 2. Construction Land
  const constructionLandColumns: ProColumns<{ id: string; name: string; value: string; percentage: string; }>[] = [
    { title: '用地类型', dataIndex: 'name', formItemProps: { rules: [{ required: true }] } },
    { title: '面积 (亩)', dataIndex: 'value' },
    { title: '占比 (%)', dataIndex: 'percentage' },
    {
      title: '操作', valueType: 'option', width: 100,
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
        <a key="delete" onClick={() => setData(prev => ({ ...prev, constructionLand: { ...prev.constructionLand, items: prev.constructionLand.items.filter(i => i.id !== record.id) } }))}>删除</a>,
      ],
    },
  ];

  // 3. Planning Trend (Helper to convert object to array for table)
  const planningTrendData = [
    { id: 'planning', name: '规划建设', ...data.planningTrend.planning },
    { id: 'built', name: '已建成', ...data.planningTrend.built },
  ];
  const planningTrendColumns: ProColumns<{ id: string; name: string; area: string; percentage: string; }>[] = [
    { title: '类型', dataIndex: 'name', editable: false },
    { title: '面积 (万㎡)', dataIndex: 'area' },
    { title: '占比 (%)', dataIndex: 'percentage' },
    {
      title: '操作', valueType: 'option', width: 100,
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
      ],
    },
  ];

  // 4. Planning Area Trend
  const planningAreaTrendColumns: ProColumns<PlanningAreaTrendItem>[] = [
    { title: '年份', dataIndex: 'year', formItemProps: { rules: [{ required: true }] } },
    { title: '规划面积', dataIndex: 'planning' },
    { title: '已建面积', dataIndex: 'built' },
    {
      title: '操作', valueType: 'option', width: 100,
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
        <a key="delete" onClick={() => setData(prev => ({ ...prev, planningAreaTrend: prev.planningAreaTrend.filter(i => i.id !== record.id) }))}>删除</a>,
      ],
    },
  ];

  // 5. House Rental (List)
  const houseRentalColumns: ProColumns<RentalItem>[] = [
    { title: '类型', dataIndex: 'name', formItemProps: { rules: [{ required: true }] } },
    { title: '数值', dataIndex: 'value' },
    { title: '单位', dataIndex: 'unit' },
    {
      title: '操作', valueType: 'option', width: 100,
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
        <a key="delete" onClick={() => setData(prev => ({ ...prev, houseRental: prev.houseRental.filter(i => i.id !== record.id) }))}>删除</a>,
      ],
    },
  ];

  // 6. Tenant Analysis
  const tenantAnalysisColumns: ProColumns<TenantAnalysisItem>[] = [
    { title: '类型', dataIndex: 'name', formItemProps: { rules: [{ required: true }] } },
    { title: '数值', dataIndex: 'value' },
    { title: '占比 (%)', dataIndex: 'percentage' },
    {
      title: '操作', valueType: 'option', width: 100,
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
        <a key="delete" onClick={() => setData(prev => ({ ...prev, tenantAnalysis: prev.tenantAnalysis.filter(i => i.id !== record.id) }))}>删除</a>,
      ],
    },
  ];

  // 7. Tenant Table
  const tenantTableColumns: ProColumns<TenantTableItem>[] = [
    { title: '地块名称', dataIndex: 'name', formItemProps: { rules: [{ required: true }] } },
    { title: '面积 (亩)', dataIndex: 'area' },
    { title: '状态', dataIndex: 'status' },
    {
      title: '操作', valueType: 'option', width: 100,
      render: (text, record, _, action) => [
        <a key="edit" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
        <a key="delete" onClick={() => setData(prev => ({ ...prev, tenantTable: prev.tenantTable.filter(i => i.id !== record.id) }))}>删除</a>,
      ],
    },
  ];

  return (
    <ProCard ghost split="vertical" gutter={[16, 0]}>
      {/* Left Column */}
      <ProCard colSpan={12} ghost direction="column" gutter={[0, 16]}>
        
        {/* 1. Land Use */}
        <ProCard title="用地情况 (左上)" bordered headerBordered>
          <EditableProTable<AssetMetric>
            rowKey="id"
            headerTitle="核心指标"
            recordCreatorProps={{
              position: 'bottom',
              record: () => ({ id: Date.now().toString(), name: '新指标', value: '0', unit: '亩' }),
            }}
            columns={landUseColumns}
            value={data.landUse.metrics}
            onChange={(value) => setData(prev => ({ ...prev, landUse: { ...prev.landUse, metrics: [...value] } }))}
            editable={{ type: 'multiple' }}
          />
        </ProCard>

        {/* 2. Construction Land */}
        <ProCard title="建设用地 (左中上)" bordered headerBordered>
          <Space style={{ marginBottom: 16 }}>
            <Typography.Text>总面积:</Typography.Text>
            <Input 
              style={{ width: 100 }} 
              value={data.constructionLand.totalArea} 
              onChange={e => setData(prev => ({ ...prev, constructionLand: { ...prev.constructionLand, totalArea: e.target.value } }))} 
            />
            <Typography.Text>占比:</Typography.Text>
            <Input 
              style={{ width: 100 }} 
              value={data.constructionLand.percentage} 
              onChange={e => setData(prev => ({ ...prev, constructionLand: { ...prev.constructionLand, percentage: e.target.value } }))} 
            />
          </Space>
          <EditableProTable
            rowKey="id"
            headerTitle="用地明细"
            recordCreatorProps={{
              position: 'bottom',
              record: () => ({ id: Date.now().toString(), name: '新用地', value: '0', percentage: '0%' }),
            }}
            columns={constructionLandColumns}
            value={data.constructionLand.items}
            onChange={(value) => setData(prev => ({ ...prev, constructionLand: { ...prev.constructionLand, items: [...value] } }))}
            editable={{ type: 'multiple' }}
          />
        </ProCard>

        {/* 3. Planning Trend */}
        <ProCard title="规划建设趋势 (左中下)" bordered headerBordered>
          <EditableProTable
            rowKey="id"
            headerTitle="建设进度"
            recordCreatorProps={false}
            columns={planningTrendColumns}
            value={planningTrendData}
            onChange={(value) => {
                // Convert array back to object structure
                const planning = value.find(i => i.id === 'planning');
                const built = value.find(i => i.id === 'built');
                if (planning && built) {
                    setData(prev => ({
                        ...prev,
                        planningTrend: {
                            planning: { area: planning.area, percentage: planning.percentage },
                            built: { area: built.area, percentage: built.percentage }
                        }
                    }));
                }
            }}
            editable={{ type: 'multiple' }}
          />
        </ProCard>

        {/* 4. Planning Area Trend */}
        <ProCard title="规划面积趋势 (左下)" bordered headerBordered>
          <EditableProTable<PlanningAreaTrendItem>
            rowKey="id"
            headerTitle="年度趋势"
            recordCreatorProps={{
              position: 'bottom',
              record: () => ({ id: Date.now().toString(), year: '2026', planning: '0', built: '0' }),
            }}
            columns={planningAreaTrendColumns}
            value={data.planningAreaTrend}
            onChange={(value) => setData(prev => ({ ...prev, planningAreaTrend: [...value] }))}
            editable={{ type: 'multiple' }}
          />
        </ProCard>

      </ProCard>

      {/* Right Column */}
      <ProCard colSpan={12} ghost direction="column" gutter={[0, 16]}>
        
        {/* 5. House Rental */}
        <ProCard title="房屋出租 (右上)" bordered headerBordered>
          <Space style={{ marginBottom: 16 }}>
            <Typography.Text>租赁总数:</Typography.Text>
            <Input 
              style={{ width: 100 }} 
              value={data.leasedHouses.total} 
              onChange={e => setData(prev => ({ ...prev, leasedHouses: { ...prev.leasedHouses, total: e.target.value } }))} 
            />
            <Typography.Text>出租率:</Typography.Text>
            <Input 
              style={{ width: 100 }} 
              value={data.leasedHouses.rate} 
              onChange={e => setData(prev => ({ ...prev, leasedHouses: { ...prev.leasedHouses, rate: e.target.value } }))} 
            />
          </Space>
          <EditableProTable<RentalItem>
            rowKey="id"
            headerTitle="出租明细"
            recordCreatorProps={{
              position: 'bottom',
              record: () => ({ id: Date.now().toString(), name: '新类型', value: '0', unit: '%' }),
            }}
            columns={houseRentalColumns}
            value={data.houseRental}
            onChange={(value) => setData(prev => ({ ...prev, houseRental: [...value] }))}
            editable={{ type: 'multiple' }}
          />
        </ProCard>

        {/* 6. Tenant Analysis */}
        <ProCard title="租户分析 (右中)" bordered headerBordered>
          <EditableProTable<TenantAnalysisItem>
            rowKey="id"
            headerTitle="租户类型"
            recordCreatorProps={{
              position: 'bottom',
              record: () => ({ id: Date.now().toString(), name: '新类型', value: '0', percentage: '0%' }),
            }}
            columns={tenantAnalysisColumns}
            value={data.tenantAnalysis}
            onChange={(value) => setData(prev => ({ ...prev, tenantAnalysis: [...value] }))}
            editable={{ type: 'multiple' }}
          />
        </ProCard>

        {/* 7. Tenant Table */}
        <ProCard title="租户分析表格 (右下)" bordered headerBordered>
          <EditableProTable<TenantTableItem>
            rowKey="id"
            headerTitle="地块列表"
            recordCreatorProps={{
              position: 'bottom',
              record: () => ({ id: Date.now().toString(), name: '新地块', area: '0', status: '待出让' }),
            }}
            columns={tenantTableColumns}
            value={data.tenantTable}
            onChange={(value) => setData(prev => ({ ...prev, tenantTable: [...value] }))}
            editable={{ type: 'multiple' }}
          />
        </ProCard>

      </ProCard>
    </ProCard>
  );
}
