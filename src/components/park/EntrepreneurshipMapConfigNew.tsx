import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

// 数据类型定义
interface BasicIndicator {
  id: string;
  title: string;
  value: string;
  unit: string;
}

interface LandUsage {
  plannedArea: string;
  plannedPercentage: string;
  builtArea: string;
  builtPercentage: string;
}

interface VideoMonitor {
  id: string;
  label: string;
  source: string;
}

interface IndustryData {
  id: string;
  name: string;
  value: string;
}

interface OutputData {
  quarterValue: string;
  quarterChange: string;
  annualValue: string;
  annualChange: string;
  pieChartData: IndustryData[];
}

interface EmploymentData {
  totalEmployment: string;
  totalTrend: string;
  jobCreation: string;
  jobCreationTrend: string;
  trendDataStr: string;
}

interface FinanceData {
  totalLoan: string;
  growthRate: string;
  chartDataStr: string;
}

interface EntrepreneurshipConfig {
  introduction: string;
  basicIndicators: BasicIndicator[];
  landUsage: LandUsage;
  videoMonitors: VideoMonitor[];
  outputData: OutputData;
  employmentData: EmploymentData;
  financeData: FinanceData;
}

// 初始数据
const initialConfig: EntrepreneurshipConfig = {
  introduction: '奉节县产业园位于奉节县夔州街道、白帝镇、公平镇、安坪镇及夔门街道境内，规划占地面积4.6平方公里。',
  basicIndicators: [
    { id: '1', title: '园区', value: '12', unit: '个' },
    { id: '2', title: '企业', value: '368', unit: '家' },
    { id: '3', title: '产业', value: '5', unit: '类' },
  ],
  landUsage: {
    plannedArea: '1320',
    plannedPercentage: '72',
    builtArea: '980',
    builtPercentage: '28',
  },
  videoMonitors: [
    { id: '1', label: '监控窗口1', source: '大门全景' },
    { id: '2', label: '监控窗口2', source: '园区主干道' },
    { id: '3', label: '监控窗口3', source: '生产车间A' },
    { id: '4', label: '监控窗口4', source: '物流出入口' },
  ],
  outputData: {
    quarterValue: '0.38',
    quarterChange: '+6.8',
    annualValue: '1.51',
    annualChange: '+12.3',
    pieChartData: [
      { id: '1', name: '工业', value: '279' },
      { id: '2', name: '科技', value: '213' },
      { id: '3', name: '物流', value: '156' },
      { id: '4', name: '其他', value: '89' },
    ],
  },
  employmentData: {
    totalEmployment: '4320',
    totalTrend: '+8.5',
    jobCreation: '5832',
    jobCreationTrend: '+10.2',
    trendDataStr: '1500, 3000, 2800, 3200, 2500, 3500, 4000, 3800, 4200, 4500, 5000, 5500',
  },
  financeData: {
    totalLoan: '4320',
    growthRate: '+8.5',
    chartDataStr: '2000, 3000, 2500, 4000, 3500, 4500, 5000, 4800, 5200, 5500, 6000, 5800',
  },
};

const EntrepreneurshipMapConfigNew: React.FC = () => {
  const [config, setConfig] = useState<EntrepreneurshipConfig>(initialConfig);

  // 监控源选项
  const monitorSourceOptions = [
    '大门全景',
    '园区主干道',
    '生产车间A',
    '生产车间B',
    '物流出入口',
    '物流仓储区',
    '办公区域',
    '员工宿舍',
  ];

  const handleSave = () => {
    console.log('保存配置:', config);
    toast.success('配置已保存');
  };



  const updateIntroduction = (value: string) => {
    setConfig({ ...config, introduction: value });
  };

  const updateBasicIndicator = (id: string, field: keyof BasicIndicator, value: string) => {
    setConfig({
      ...config,
      basicIndicators: config.basicIndicators.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const updateLandUsage = (field: keyof LandUsage, value: string) => {
    setConfig({
      ...config,
      landUsage: { ...config.landUsage, [field]: value },
    });
  };

  const updateVideoMonitor = (id: string, source: string) => {
    setConfig({
      ...config,
      videoMonitors: config.videoMonitors.map((item) =>
        item.id === id ? { ...item, source } : item
      ),
    });
  };

  const updateOutputData = (field: string, value: any) => {
    setConfig({
      ...config,
      outputData: { ...config.outputData, [field]: value },
    });
  };

  const addIndustryData = () => {
    const newItem: IndustryData = {
      id: Date.now().toString(),
      name: '新产业',
      value: '0',
    };
    setConfig({
      ...config,
      outputData: {
        ...config.outputData,
        pieChartData: [...config.outputData.pieChartData, newItem],
      },
    });
  };

  const removeIndustryData = (id: string) => {
    setConfig({
      ...config,
      outputData: {
        ...config.outputData,
        pieChartData: config.outputData.pieChartData.filter((item) => item.id !== id),
      },
    });
  };

  const updateIndustryData = (id: string, field: keyof IndustryData, value: string) => {
    setConfig({
      ...config,
      outputData: {
        ...config.outputData,
        pieChartData: config.outputData.pieChartData.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      },
    });
  };

  const updateEmploymentData = (field: string, value: any) => {
    setConfig({
      ...config,
      employmentData: { ...config.employmentData, [field]: value },
    });
  };



  const updateFinanceData = (field: string, value: any) => {
    setConfig({
      ...config,
      financeData: { ...config.financeData, [field]: value },
    });
  };



  return (
    <div className="min-h-screen bg-slate-50">
      {/* 固定顶部操作栏 */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">返乡创业一张图 - 驾驶舱主页配置</h1>
              <p className="text-sm text-slate-500 mt-1">配置大屏各区域显示内容与数据</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                保存配置
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 - 两列布局 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-6">
          {/* 左侧配置区 */}
          <div className="space-y-6">
            {/* 创业园信息与基础数据 */}
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                  创业园信息与基础数据
                </CardTitle>
                <p className="text-xs text-slate-500 ml-3">对应大屏左上角区域</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">园区简介</label>
                  <Textarea
                    value={config.introduction}
                    onChange={(e) => updateIntroduction(e.target.value)}
                    rows={4}
                    className="text-sm"
                    placeholder="请输入园区简介..."
                  />
                  <p className="text-xs text-slate-400 mt-1">字数: {config.introduction.length}</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 block">核心指标卡片</label>
                  {config.basicIndicators.map((indicator) => (
                    <div key={indicator.id} className="p-3 border rounded-lg bg-slate-50 space-y-2">
                      <Input
                        placeholder="指标标题"
                        value={indicator.title}
                        onChange={(e) => updateBasicIndicator(indicator.id, 'title', e.target.value)}
                        className="text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="数值"
                          value={indicator.value}
                          onChange={(e) => updateBasicIndicator(indicator.id, 'value', e.target.value)}
                          className="text-sm"
                        />
                        <Input
                          placeholder="单位"
                          value={indicator.unit}
                          onChange={(e) => updateBasicIndicator(indicator.id, 'unit', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 土地使用情况 */}
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-green-600 rounded"></div>
                  土地使用情况
                </CardTitle>
                <p className="text-xs text-slate-500 ml-3">对应大屏左中区域</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">规划用地</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="面积 (亩)"
                      value={config.landUsage.plannedArea}
                      onChange={(e) => updateLandUsage('plannedArea', e.target.value)}
                    />
                    <Input
                      placeholder="占比 (%)"
                      value={config.landUsage.plannedPercentage}
                      onChange={(e) => updateLandUsage('plannedPercentage', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">已建园区面积</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="面积 (亩)"
                      value={config.landUsage.builtArea}
                      onChange={(e) => updateLandUsage('builtArea', e.target.value)}
                    />
                    <Input
                      placeholder="占比 (%)"
                      value={config.landUsage.builtPercentage}
                      onChange={(e) => updateLandUsage('builtPercentage', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 视频监控源设置 */}
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-600 rounded"></div>
                  视频监控源设置
                </CardTitle>
                <p className="text-xs text-slate-500 ml-3">对应大屏左下角4个监控窗口</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  {config.videoMonitors.map((monitor) => (
                    <div key={monitor.id} className="space-y-2">
                      <label className="text-xs font-medium text-slate-600">{monitor.label}</label>
                      <Select value={monitor.source} onValueChange={(value: string) => updateVideoMonitor(monitor.id, value)}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {monitorSourceOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧配置区 */}
          <div className="space-y-6">
            {/* 园区产值 */}
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-rose-50 to-red-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-rose-600 rounded"></div>
                  园区产值
                </CardTitle>
                <p className="text-xs text-slate-500 ml-3">对应大屏右上角区域</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">季度产值(亿元)</label>
                    <Input
                      value={config.outputData.quarterValue}
                      onChange={(e) => updateOutputData('quarterValue', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">环比(%)</label>
                    <Input
                      value={config.outputData.quarterChange}
                      onChange={(e) => updateOutputData('quarterChange', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">年度产值(亿元)</label>
                    <Input
                      value={config.outputData.annualValue}
                      onChange={(e) => updateOutputData('annualValue', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">同比(%)</label>
                    <Input
                      value={config.outputData.annualChange}
                      onChange={(e) => updateOutputData('annualChange', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-slate-700">饼图数据配置</label>
                    <Button className="border h-7 text-xs" onClick={addIndustryData}>
                      <Plus className="w-3 h-3 mr-1" />
                      添加
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {config.outputData.pieChartData.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 p-2 border rounded bg-slate-50">
                        <Input
                          placeholder="产业名称"
                          value={item.name}
                          onChange={(e) => updateIndustryData(item.id, 'name', e.target.value)}
                          className="flex-1 text-sm h-8"
                        />
                        <Input
                          placeholder="数值"
                          value={item.value}
                          onChange={(e) => updateIndustryData(item.id, 'value', e.target.value)}
                          className="w-20 text-sm h-8"
                        />
                        <Button
                          className="border h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                          onClick={() => removeIndustryData(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 用工统计 */}
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-teal-600 rounded"></div>
                  用工统计
                </CardTitle>
                <p className="text-xs text-slate-500 ml-3">对应大屏右中区域</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">用工总数</label>
                    <Input
                      value={config.employmentData.totalEmployment}
                      onChange={(e) => updateEmploymentData('totalEmployment', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">趋势(%)</label>
                    <Input
                      value={config.employmentData.totalTrend}
                      onChange={(e) => updateEmploymentData('totalTrend', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">带动就业</label>
                    <Input
                      value={config.employmentData.jobCreation}
                      onChange={(e) => updateEmploymentData('jobCreation', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">趋势(%)</label>
                    <Input
                      value={config.employmentData.jobCreationTrend}
                      onChange={(e) => updateEmploymentData('jobCreationTrend', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">趋势图数据 (逗号分隔数值)</label>
                  <Textarea
                    value={config.employmentData.trendDataStr}
                    onChange={(e) => updateEmploymentData('trendDataStr', e.target.value)}
                    rows={3}
                    className="text-sm"
                    placeholder="请输入12个月份的数值，用英文逗号分隔，如: 100,200,150..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* 金融贷款 */}
            <Card className="shadow-md">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-indigo-600 rounded"></div>
                  金融贷款
                </CardTitle>
                <p className="text-xs text-slate-500 ml-3">对应大屏右下角区域</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">贷款总额(亿元)</label>
                    <Input
                      value={config.financeData.totalLoan}
                      onChange={(e) => updateFinanceData('totalLoan', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">增长率(%)</label>
                    <Input
                      value={config.financeData.growthRate}
                      onChange={(e) => updateFinanceData('growthRate', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">柱状图数据 (逗号分隔数值)</label>
                  <Textarea
                    value={config.financeData.chartDataStr}
                    onChange={(e) => updateFinanceData('chartDataStr', e.target.value)}
                    rows={3}
                    className="text-sm"
                    placeholder="请输入各阶段贷款金额，用英文逗号分隔"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurshipMapConfigNew;
