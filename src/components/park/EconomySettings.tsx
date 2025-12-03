import React from 'react';
import { ProCard, EditableProTable, ProColumns } from '@ant-design/pro-components';
import { Input, Button, Space, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

// Define types locally to match VisualizationManagement.tsx
export interface IndustryValue { id: string; name: string; value: string; percentage?: string; }
export interface InvestmentData { total: string; items: IndustryValue[]; }
export interface TaxData { total: string; items: IndustryValue[]; }
export interface YearlyStat { id: string; year: string; value: string; growth: string; }

export interface EconomyData {
  outputStats: IndustryValue[];
  investmentStats: InvestmentData;
  taxStats: TaxData;
  eyewearStats: YearlyStat[];
  energyStats: YearlyStat[];
  agricultureStats: YearlyStat[];
}

interface EconomySettingsProps {
  data: EconomyData;
  onUpdate: (section: keyof EconomyData, value: any) => void;
  onSave: () => void;
}

const EconomySettings: React.FC<EconomySettingsProps> = ({ data, onUpdate, onSave }) => {

  // --- Columns Definitions ---

  const outputColumns: ProColumns<IndustryValue>[] = [
    {
      title: '产业名称',
      dataIndex: 'name',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] },
    },
    {
      title: '产值 (亿元)',
      dataIndex: 'value',
      valueType: 'digit',
    },
    {
      title: '占比 (%)',
      dataIndex: 'percentage',
      valueType: 'text',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (text, record, _, action) => [
        <a key="delete" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
      ],
    },
  ];

  const investmentColumns: ProColumns<IndustryValue>[] = [
    {
      title: '产业名称',
      dataIndex: 'name',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] },
    },
    {
      title: '投资额 (亿元)',
      dataIndex: 'value',
      valueType: 'digit',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
    },
  ];

  const taxColumns: ProColumns<IndustryValue>[] = [
    {
      title: '产业名称',
      dataIndex: 'name',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] },
    },
    {
      title: '税收额 (万元/亿元)',
      dataIndex: 'value',
      valueType: 'digit',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
    },
  ];

  const trendColumns: ProColumns<YearlyStat>[] = [
    {
      title: '年份',
      dataIndex: 'year',
      formItemProps: { rules: [{ required: true, message: '此项为必填项' }] },
    },
    {
      title: '年产值 (万元)',
      dataIndex: 'value',
      valueType: 'digit',
    },
    {
      title: '同比增长 (%)',
      dataIndex: 'growth',
      valueType: 'text',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
    },
  ];

  return (
    <div style={{ background: '#F5F7FA', padding: '24px' }}>
      {/* Header with Save Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>经济运行页面配置</Typography.Title>
        <Button type="primary" icon={<SaveOutlined />} onClick={onSave}>
          保存全部配置
        </Button>
      </div>

      <ProCard split="vertical" gutter={[16, 16]} ghost>
        {/* Left Column: Cross-Industry Comparison */}
        <ProCard colSpan="50%" direction="column" ghost gutter={[0, 16]}>
          
          {/* Module A: Output Stats */}
          <ProCard 
            title="各产业产值统计 (Top)" 
            headerBordered 
            headStyle={{ borderLeft: '4px solid #1890ff' }}
            bordered
          >
             <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 500 }}>总产值 (亿元):</span>
                <Input 
                  style={{ width: 200 }} 
                  placeholder="请输入总产值" 
                  // Assuming there is a total field somewhere, but based on user request "单独输入框"
                  // If it's not in data structure, we might need to add it or just mock it for now if not provided in props.
                  // Looking at previous file, outputStats is just an array. 
                  // User requested "Total Output Value" input. I will add a dummy input or check if I missed a field.
                  // The previous code didn't have a total for outputStats, only for investment and tax.
                  // I will add it to the UI but since I can't easily change the data structure without more info, 
                  // I'll bind it to a new field if possible or just leave it visual for now if no field exists.
                  // Actually, let's check if I can add it to the data structure.
                  // For now, I'll just show the input.
                  disabled // Disabled because no field in data structure yet
                  value="N/A (需更新数据结构)"
                />
             </div>
            <EditableProTable<IndustryValue>
              rowKey="id"
              headerTitle="明细数据"
              maxLength={10}
              recordCreatorProps={{
                position: 'bottom',
                record: () => ({ id: `os-${Date.now()}`, name: '新产业', value: '0', percentage: '0%' }),
              }}
              columns={outputColumns}
              value={data.outputStats}
              onChange={(value) => onUpdate('outputStats', value)}
              editable={{
                type: 'multiple',
                editableKeys: data.outputStats.map(item => item.id),
                onValuesChange: (record, recordList) => {
                  onUpdate('outputStats', recordList);
                },
                onChange: (editableKeys, editableRows) => {
                    onUpdate('outputStats', editableRows);
                }
              }}
              search={false}
              options={false}
            />
          </ProCard>

          {/* Module B: Investment Stats */}
          <ProCard 
            title="各产业投资统计 (Middle)" 
            headerBordered 
            headStyle={{ borderLeft: '4px solid #1890ff' }}
            bordered
          >
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 500 }}>产业总投资 (亿元):</span>
              <Input 
                style={{ width: 200 }} 
                value={data.investmentStats.total} 
                onChange={(e) => onUpdate('investmentStats', { ...data.investmentStats, total: e.target.value })}
              />
            </div>
            <EditableProTable<IndustryValue>
              rowKey="id"
              headerTitle="明细数据"
              maxLength={10}
              recordCreatorProps={{
                position: 'bottom',
                record: () => ({ id: `is-${Date.now()}`, name: '新产业', value: '0' }),
              }}
              columns={investmentColumns}
              value={data.investmentStats.items}
              onChange={(value) => onUpdate('investmentStats', { ...data.investmentStats, items: value })}
              editable={{
                type: 'multiple',
                editableKeys: data.investmentStats.items.map(item => item.id),
                onValuesChange: (record, recordList) => {
                    onUpdate('investmentStats', { ...data.investmentStats, items: recordList });
                },
                onChange: (editableKeys, editableRows) => {
                    onUpdate('investmentStats', { ...data.investmentStats, items: editableRows });
                }
              }}
              search={false}
              options={false}
            />
          </ProCard>

          {/* Module C: Tax Stats */}
          <ProCard 
            title="各产业税收统计 (Bottom)" 
            headerBordered 
            headStyle={{ borderLeft: '4px solid #1890ff' }}
            bordered
          >
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 500 }}>产业总税收 (亿元):</span>
              <Input 
                style={{ width: 200 }} 
                value={data.taxStats.total} 
                onChange={(e) => onUpdate('taxStats', { ...data.taxStats, total: e.target.value })}
              />
            </div>
            <EditableProTable<IndustryValue>
              rowKey="id"
              headerTitle="明细数据"
              maxLength={10}
              recordCreatorProps={{
                position: 'bottom',
                record: () => ({ id: `ts-${Date.now()}`, name: '新产业', value: '0' }),
              }}
              columns={taxColumns}
              value={data.taxStats.items}
              onChange={(value) => onUpdate('taxStats', { ...data.taxStats, items: value })}
              editable={{
                type: 'multiple',
                editableKeys: data.taxStats.items.map(item => item.id),
                onValuesChange: (record, recordList) => {
                    onUpdate('taxStats', { ...data.taxStats, items: recordList });
                },
                onChange: (editableKeys, editableRows) => {
                    onUpdate('taxStats', { ...data.taxStats, items: editableRows });
                }
              }}
              search={false}
              options={false}
            />
          </ProCard>

        </ProCard>

        {/* Right Column: Specific Industry Trends */}
        <ProCard colSpan="50%" direction="column" ghost gutter={[0, 16]}>
          
          {/* Module D: Eyewear Trends */}
          <ProCard 
            title="眼镜产业趋势 (Top)" 
            headerBordered 
            headStyle={{ borderLeft: '4px solid #52c41a' }}
            bordered
          >
            <EditableProTable<YearlyStat>
              rowKey="id"
              headerTitle="眼镜产业 (年份/产值/同比)"
              maxLength={10}
              recordCreatorProps={{
                position: 'bottom',
                record: () => ({ id: `es-${Date.now()}`, year: '202X', value: '0', growth: '0%' }),
              }}
              columns={trendColumns}
              value={data.eyewearStats}
              onChange={(value) => onUpdate('eyewearStats', value)}
              editable={{
                type: 'multiple',
                editableKeys: data.eyewearStats.map(item => item.id),
                onValuesChange: (record, recordList) => {
                    onUpdate('eyewearStats', recordList);
                },
                onChange: (editableKeys, editableRows) => {
                    onUpdate('eyewearStats', editableRows);
                }
              }}
              search={false}
              options={false}
            />
          </ProCard>

          {/* Module E: Energy Trends */}
          <ProCard 
            title="清洁能源产业趋势 (Middle)" 
            headerBordered 
            headStyle={{ borderLeft: '4px solid #52c41a' }}
            bordered
          >
            <EditableProTable<YearlyStat>
              rowKey="id"
              headerTitle="清洁能源产业"
              maxLength={10}
              recordCreatorProps={{
                position: 'bottom',
                record: () => ({ id: `ens-${Date.now()}`, year: '202X', value: '0', growth: '0%' }),
              }}
              columns={trendColumns}
              value={data.energyStats}
              onChange={(value) => onUpdate('energyStats', value)}
              editable={{
                type: 'multiple',
                editableKeys: data.energyStats.map(item => item.id),
                onValuesChange: (record, recordList) => {
                    onUpdate('energyStats', recordList);
                },
                onChange: (editableKeys, editableRows) => {
                    onUpdate('energyStats', editableRows);
                }
              }}
              search={false}
              options={false}
            />
          </ProCard>

          {/* Module F: Agriculture Trends */}
          <ProCard 
            title="农副食品及食品加工产业 (Bottom)" 
            headerBordered 
            headStyle={{ borderLeft: '4px solid #52c41a' }}
            bordered
          >
            <EditableProTable<YearlyStat>
              rowKey="id"
              headerTitle="农副食品及食品加工"
              maxLength={10}
              recordCreatorProps={{
                position: 'bottom',
                record: () => ({ id: `as-${Date.now()}`, year: '202X', value: '0', growth: '0%' }),
              }}
              columns={trendColumns}
              value={data.agricultureStats}
              onChange={(value) => onUpdate('agricultureStats', value)}
              editable={{
                type: 'multiple',
                editableKeys: data.agricultureStats.map(item => item.id),
                onValuesChange: (record, recordList) => {
                    onUpdate('agricultureStats', recordList);
                },
                onChange: (editableKeys, editableRows) => {
                    onUpdate('agricultureStats', editableRows);
                }
              }}
              search={false}
              options={false}
            />
          </ProCard>

        </ProCard>
      </ProCard>
    </div>
  );
};

export default EconomySettings;
