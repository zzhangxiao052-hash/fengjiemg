import React, { useState } from 'react';
import { ProCard, EditableProTable, ProFormGroup, ProFormDigit } from '@ant-design/pro-components';
import { Col, Row } from 'antd';

// --- Types Definition ---

interface LandUsageItem {
  id: string;
  name: string;
  value: number;
  unit: string;
}

interface ConstructionLandItem {
  id: string;
  type: string;
  area: number;
  percentage: number;
}

interface YearlyTrendItem {
  id: string;
  year: string;
  plannedValue: number;
  builtValue: number;
}

interface HouseRentalItem {
  id: string;
  name: string;
  value: number;
  unit: string;
}

interface TenantAnalysisItem {
  id: string;
  type: string;
  value: number;
  percentage: number;
}

interface TenantPlotItem {
  id: string;
  name: string;
  area: number;
  status: string;
}

const AssetVisualConfig: React.FC = () => {
  // --- Mock Data State ---

  // 2.1 用地情况
  const [landUsageData, setLandUsageData] = useState<LandUsageItem[]>([
    { id: '1', name: '用地面积', value: 2654, unit: '亩' },
    { id: '2', name: '已用面积', value: 1800, unit: '亩' },
  ]);

  // 2.2 建设用地
  const [constructionLandData, setConstructionLandData] = useState<ConstructionLandItem[]>([
    { id: '1', type: '居住用地', area: 500, percentage: 25 },
    { id: '2', type: '工业用地', area: 1200, percentage: 60 },
    { id: '3', type: '商经用地', area: 300, percentage: 15 },
  ]);
  // 建设用地 Top KPI
  const [constructionTotal, setConstructionTotal] = useState({ area: 2000, percentage: 100 });

  // 2.3 规划建设趋势 Top KPI
  const [planningKPI, setPlanningKPI] = useState({
    plannedArea: 5000,
    plannedPercentage: 100,
    builtArea: 2654,
    builtPercentage: 53.08,
  });

  // 2.4 规划面积趋势 (Yearly)
  const [yearlyTrendData, setYearlyTrendData] = useState<YearlyTrendItem[]>([
    { id: '1', year: '2021', plannedValue: 4000, builtValue: 2000 },
    { id: '2', year: '2022', plannedValue: 4200, builtValue: 2200 },
    { id: '3', year: '2023', plannedValue: 4500, builtValue: 2400 },
    { id: '4', year: '2024', plannedValue: 4800, builtValue: 2550 },
    { id: '5', year: '2025', plannedValue: 5000, builtValue: 2654 },
  ]);

  // 3.1 房屋出租
  const [houseRentalData, setHouseRentalData] = useState<HouseRentalItem[]>([
    { id: '1', name: '标准厂房', value: 85, unit: '%' },
    { id: '2', name: '宿舍', value: 90, unit: '%' },
    { id: '3', name: '门市', value: 60, unit: '%' },
  ]);
  // 房屋出租 Top KPI
  const [rentalKPI, setRentalKPI] = useState({ totalRented: 1200, rate: 78 });

  // 3.2 租户分析
  const [tenantAnalysisData, setTenantAnalysisData] = useState<TenantAnalysisItem[]>([
    { id: '1', type: '标准厂房', value: 840, percentage: 48 },
    { id: '2', type: '宿舍', value: 600, percentage: 34 },
    { id: '3', type: '门市', value: 310, percentage: 18 },
  ]);

  // 3.3 租户地块列表
  const [tenantPlotData, setTenantPlotData] = useState<TenantPlotItem[]>([
    { id: '1', name: '奉节工业园区地块A', area: 15.5, status: '已出让' },
    { id: '2', name: '奉节工业园区地块B', area: 20.0, status: '已出让' },
    { id: '3', name: '奉节工业园区地块C', area: 8.2, status: '待出让' },
  ]);

  return (
    <ProCard ghost gutter={[16, 16]} split="vertical">
      {/* --- Left Column --- */}
      <ProCard colSpan={12} ghost direction="column" gutter={[0, 16]}>
        
        {/* 2.1 用地情况 */}
        <ProCard title="用地情况" bordered headerBordered>
          <EditableProTable<LandUsageItem>
            rowKey="id"
            value={landUsageData}
            onChange={(val) => setLandUsageData([...val])}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              record: () => ({ id: Date.now().toString(), name: '', value: 0, unit: '亩' }),
            }}
            columns={[
              { title: '指标名称', dataIndex: 'name' },
              { title: '数值', dataIndex: 'value', valueType: 'digit' },
              { title: '单位', dataIndex: 'unit' },
              { title: '操作', valueType: 'option', width: 100, render: (text, record, _, action) => [
                <a key="delete" onClick={() => {
                  setLandUsageData(landUsageData.filter((item) => item.id !== record.id));
                }}>删除</a>
              ]}
            ]}
            editable={{
              type: 'multiple',
              editableKeys: landUsageData.map(item => item.id),
              onValuesChange: (record, recordList) => setLandUsageData(recordList),
            }}
          />
        </ProCard>

        {/* 2.2 建设用地 */}
        <ProCard title="建设用地" bordered headerBordered>
          <ProFormGroup title="核心指标">
            <ProFormDigit
              label="总面积(亩)"
              fieldProps={{ value: constructionTotal.area, onChange: (val) => setConstructionTotal({ ...constructionTotal, area: val || 0 }) }}
              width="sm"
            />
            <ProFormDigit
              label="占总数量(%)"
              fieldProps={{ value: constructionTotal.percentage, onChange: (val) => setConstructionTotal({ ...constructionTotal, percentage: val || 0 }) }}
              width="sm"
            />
          </ProFormGroup>
          <EditableProTable<ConstructionLandItem>
            rowKey="id"
            value={constructionLandData}
            onChange={(val) => setConstructionLandData([...val])}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              record: () => ({ id: Date.now().toString(), type: '', area: 0, percentage: 0 }),
            }}
            columns={[
              { title: '用地类型', dataIndex: 'type' },
              { title: '面积(亩)', dataIndex: 'area', valueType: 'digit' },
              { title: '占比(%)', dataIndex: 'percentage', valueType: 'digit' },
              { title: '操作', valueType: 'option', width: 100, render: (text, record, _, action) => [
                <a key="delete" onClick={() => {
                  setConstructionLandData(constructionLandData.filter((item) => item.id !== record.id));
                }}>删除</a>
              ]}
            ]}
            editable={{
              type: 'multiple',
              editableKeys: constructionLandData.map(item => item.id),
              onValuesChange: (record, recordList) => setConstructionLandData(recordList),
            }}
          />
        </ProCard>

        {/* 2.3 规划建设趋势 - 核心指标 */}
        <ProCard title="规划建设趋势 - 核心指标" bordered headerBordered>
          <ProFormGroup>
            <ProFormDigit
              label="规划用地总面积"
              fieldProps={{ value: planningKPI.plannedArea, onChange: (val) => setPlanningKPI({ ...planningKPI, plannedArea: val || 0 }) }}
              width="sm"
            />
            <ProFormDigit
              label="规划占比(%)"
              fieldProps={{ value: planningKPI.plannedPercentage, onChange: (val) => setPlanningKPI({ ...planningKPI, plannedPercentage: val || 0 }) }}
              width="sm"
            />
          </ProFormGroup>
          <ProFormGroup>
            <ProFormDigit
              label="已建城区总面积"
              fieldProps={{ value: planningKPI.builtArea, onChange: (val) => setPlanningKPI({ ...planningKPI, builtArea: val || 0 }) }}
              width="sm"
            />
            <ProFormDigit
              label="已建占比(%)"
              fieldProps={{ value: planningKPI.builtPercentage, onChange: (val) => setPlanningKPI({ ...planningKPI, builtPercentage: val || 0 }) }}
              width="sm"
            />
          </ProFormGroup>
        </ProCard>

        {/* 2.4 规划面积趋势 - 年份走势 */}
        <ProCard title="规划面积趋势 - 年份走势" bordered headerBordered>
          <EditableProTable<YearlyTrendItem>
            rowKey="id"
            value={yearlyTrendData}
            onChange={(val) => setYearlyTrendData([...val])}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              record: () => ({ id: Date.now().toString(), year: '2025', plannedValue: 0, builtValue: 0 }),
            }}
            columns={[
              { title: '年份', dataIndex: 'year' },
              { title: '规划用地数值', dataIndex: 'plannedValue', valueType: 'digit' },
              { title: '已建城区数值', dataIndex: 'builtValue', valueType: 'digit' },
              { title: '操作', valueType: 'option', width: 100, render: (text, record, _, action) => [
                <a key="delete" onClick={() => {
                  setYearlyTrendData(yearlyTrendData.filter((item) => item.id !== record.id));
                }}>删除</a>
              ]}
            ]}
            editable={{
              type: 'multiple',
              editableKeys: yearlyTrendData.map(item => item.id),
              onValuesChange: (record, recordList) => setYearlyTrendData(recordList),
            }}
          />
        </ProCard>
      </ProCard>

      {/* --- Right Column --- */}
      <ProCard colSpan={12} ghost direction="column" gutter={[0, 16]}>
        
        {/* 3.1 房屋出租 */}
        <ProCard title="房屋出租" bordered headerBordered>
          <ProFormGroup title="核心指标">
            <ProFormDigit
              label="已出租房屋总数(间)"
              fieldProps={{ value: rentalKPI.totalRented, onChange: (val) => setRentalKPI({ ...rentalKPI, totalRented: val || 0 }) }}
              width="sm"
            />
            <ProFormDigit
              label="出租率(%)"
              fieldProps={{ value: rentalKPI.rate, onChange: (val) => setRentalKPI({ ...rentalKPI, rate: val || 0 }) }}
              width="sm"
            />
          </ProFormGroup>
          <EditableProTable<HouseRentalItem>
            rowKey="id"
            value={houseRentalData}
            onChange={(val) => setHouseRentalData([...val])}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              record: () => ({ id: Date.now().toString(), name: '', value: 0, unit: '%' }),
            }}
            columns={[
              { title: '指标名称', dataIndex: 'name' },
              { title: '数值', dataIndex: 'value', valueType: 'digit' },
              { title: '单位', dataIndex: 'unit' },
              { title: '操作', valueType: 'option', width: 100, render: (text, record, _, action) => [
                <a key="delete" onClick={() => {
                  setHouseRentalData(houseRentalData.filter((item) => item.id !== record.id));
                }}>删除</a>
              ]}
            ]}
            editable={{
              type: 'multiple',
              editableKeys: houseRentalData.map(item => item.id),
              onValuesChange: (record, recordList) => setHouseRentalData(recordList),
            }}
          />
        </ProCard>

        {/* 3.2 租户分析 */}
        <ProCard title="租户分析 - 饼图数据" bordered headerBordered>
          <EditableProTable<TenantAnalysisItem>
            rowKey="id"
            value={tenantAnalysisData}
            onChange={(val) => setTenantAnalysisData([...val])}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              record: () => ({ id: Date.now().toString(), type: '', value: 0, percentage: 0 }),
            }}
            columns={[
              { title: '类型名称', dataIndex: 'type' },
              { title: '数值', dataIndex: 'value', valueType: 'digit' },
              { title: '占比(%)', dataIndex: 'percentage', valueType: 'digit' },
              { title: '操作', valueType: 'option', width: 100, render: (text, record, _, action) => [
                <a key="delete" onClick={() => {
                  setTenantAnalysisData(tenantAnalysisData.filter((item) => item.id !== record.id));
                }}>删除</a>
              ]}
            ]}
            editable={{
              type: 'multiple',
              editableKeys: tenantAnalysisData.map(item => item.id),
              onValuesChange: (record, recordList) => setTenantAnalysisData(recordList),
            }}
          />
        </ProCard>

        {/* 3.3 租户地块列表 */}
        <ProCard title="租户地块列表" bordered headerBordered>
          <EditableProTable<TenantPlotItem>
            rowKey="id"
            value={tenantPlotData}
            onChange={(val) => setTenantPlotData([...val])}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              record: () => ({ id: Date.now().toString(), name: '', area: 0, status: '待出让' }),
            }}
            columns={[
              { title: '地块名称', dataIndex: 'name' },
              { title: '土地面积(公顷)', dataIndex: 'area', valueType: 'digit' },
              { title: '土地出让状态', dataIndex: 'status' },
              { title: '操作', valueType: 'option', width: 100, render: (text, record, _, action) => [
                <a key="delete" onClick={() => {
                  setTenantPlotData(tenantPlotData.filter((item) => item.id !== record.id));
                }}>删除</a>
              ]}
            ]}
            editable={{
              type: 'multiple',
              editableKeys: tenantPlotData.map(item => item.id),
              onValuesChange: (record, recordList) => setTenantPlotData(recordList),
            }}
          />
        </ProCard>

      </ProCard>
    </ProCard>
  );
};

export default AssetVisualConfig;
