import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';

interface MetricConfig {
  id: string;
  name: string;
  value: string;
  unit?: string;
}

export default function VisualizationManagement({ onlyReturn = false }: { onlyReturn?: boolean }) {
  const overviewItems = useMemo(() => [
    '全县工业园区概况', '园区简介', '各工业园区概况', '园区风光图', '用地统计', '发电、产值统计', '用水统计', '用电统计', '用气统计', '园区产业布局', '企业数量统计', '产量统计', '专利统计', '注册商标统计', '企业类型统计', '产品产量统计'
  ], []);

  const economyItems = useMemo(() => [
    '各产业产值统计', '各产业投资统计', '各产业税收统计', '眼镜产业', '清洁能源产业', '农副食品及食品加工业'
  ], []);

  const elementsItems = useMemo(() => [
    '年用水量统计', '年用电量统计', '年用气量统计'
  ], []);

  const assetsItems = useMemo(() => [
    '用地面积、已使用面积', '自用地面积、出让地面积', '各用地类型及占比统计', '规划用地、已建城区面积统计', '出租房屋及出租率', '厂房、楼租房等宿舍出租情况', '地块名称、面积、土地出让状态'
  ], []);

  const investmentItems = useMemo(() => [
    '招商投资额', '合同总产值', '重点在谈项目', '拟签约项目', '已签约项目', '1-10亿数量', '10-30亿数量', '30亿以上数量', '近一年各季度招商项目数量及同比增速', '近五年各年招商项目数量及同比增速'
  ], []);

  const projectsItems = useMemo(() => [
    '项目总数统计', '续建项目、改扩建项目数量和占比', '一亿以下数量', '一亿到五亿数量', '五亿到十亿数量', '数量及占比统计', '近4年项目预计产值及同比增速', '续建项目状态统计', '改扩建项目状态统计'
  ], []);

  const servicesItems = useMemo(() => [
    '科研机构、研发成果、专利数量统计', '专家、软件、服务需求数量统计', '各类岗位与推荐人数统计', '近1年各月贷款金额分布', '运输方式数量与占比统计', '各类贷款金额统计'
  ], []);

  const videoItems = useMemo(() => [
    '设备列表', '实时画面', '告警统计'
  ], []);

  const energyItems = useMemo(() => [
    '能源供给总览', '用能统计', '清洁能源占比', '用电/用水/用气趋势'
  ], []);

  const returnEntrepreneurshipItems = useMemo(() => [
    '设备列表', '实时画面', '告警统计',
    '创业园图层', '物流服务图层', '金融贷款图层',
    '创业园文本信息',
    '12个创业园用工人数统计', '12个创业园辅助就业人数统计',
    '最近一个季度园区产值、占比统计', '最近一年园区产值、占比统计',
    '园区使用面积', '园区可使用面积',
    '12个园区金融贷款金额',
    '支持按年、季度、月展示用工总数', '园区与移动就业人数统计', '支持按年、季度、月展示就业人数统计',
    '园区详情最近一个季度园区产值、占比统计', '园区详情最近一年园区产值、占比统计',
    '园区详情用地使用面积', '园区详情可使用面积',
    '支持按年份、季度、月份统计金融贷款金额',
    '园区基本信息（法人、联系方式、地址等）', '企业用工情况', '企业产值'
  ], []);

  const [configs, setConfigs] = useState<Record<string, MetricConfig[]>>({});

  const initCategory = (key: string, items: string[]) => {
    if (!configs[key]) {
      setConfigs(prev => ({ ...prev, [key]: items.map((name, idx) => ({ id: `${key}-${idx}`, name, value: '', unit: '' })) }));
    }
  };

  const saveCategory = (key: string) => {
    toast.success('已保存该页面管理配置');
  };

  const addMetric = (key: string) => {
    setConfigs(prev => {
      const copy = { ...(prev || {}) } as Record<string, MetricConfig[]>;
      const arr = copy[key] ? copy[key].slice() : [];
      arr.push({ id: `${key}-${Date.now()}`, name: '新指标', value: '', unit: '' });
      copy[key] = arr;
      return copy;
    });
  };

  const renderCategory = (key: string, title: string, items: string[]) => {
    initCategory(key, items);
    const list = configs[key] || items.map((name, idx) => ({ id: `${key}-${idx}`, name, value: '', unit: '' }));
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 text-lg">{title}</h2>
            <div className="flex gap-2">
              {key === 'return' && (
                <Button variant="outline" onClick={() => addMetric(key)}>新增指标</Button>
              )}
              <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" onClick={() => saveCategory(key)}>保存</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>指标名称</TableHead>
                  <TableHead>值</TableHead>
                  <TableHead>单位</TableHead>
                  {key === 'return' && <TableHead className="text-right">操作</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((m, i) => (
                  <TableRow key={m.id} className="hover:bg-slate-50">
                    <TableCell>{m.name}</TableCell>
                    <TableCell>
                      <Input value={m.value} onChange={e => {
                        setConfigs(prev => {
                          const copy = { ...(prev || {}) };
                          const arr = (copy[key] || list).slice();
                          arr[i] = { ...arr[i], value: e.target.value };
                          copy[key] = arr;
                          return copy;
                        });
                      }} />
                    </TableCell>
                    <TableCell>
                      <Input value={m.unit || ''} onChange={e => {
                        setConfigs(prev => {
                          const copy = { ...(prev || {}) };
                          const arr = (copy[key] || list).slice();
                          arr[i] = { ...arr[i], unit: e.target.value };
                          copy[key] = arr;
                          return copy;
                        });
                      }} />
                    </TableCell>
                    {key === 'return' && (
                      <TableCell className="text-right">
                        <Button variant="ghost" onClick={() => {
                          setConfigs(prev => {
                            const copy = { ...(prev || {}) } as Record<string, MetricConfig[]>;
                            const arr = (copy[key] || list).slice();
                            arr.splice(i, 1);
                            copy[key] = arr;
                            return copy;
                          });
                        }}>删除</Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">可视化页面管理</h1>
        <p className="text-slate-500 mt-1">配置各可视化页面的展示指标与单位</p>
      </div>
      <Tabs defaultValue={onlyReturn ? 'return' : 'overview'} className="space-y-6">
        <TabsList className="flex flex-wrap gap-2">
          {!onlyReturn && <TabsTrigger value="overview">园区总览页面管理</TabsTrigger>}
          {!onlyReturn && <TabsTrigger value="economy">经济运行页面管理</TabsTrigger>}
          {!onlyReturn && <TabsTrigger value="elements">要素保障页面管理</TabsTrigger>}
          {!onlyReturn && <TabsTrigger value="assets">资产管理页面管理</TabsTrigger>}
          {!onlyReturn && <TabsTrigger value="investment">招商引资页面管理</TabsTrigger>}
          {!onlyReturn && <TabsTrigger value="projects">建设项目页面管理</TabsTrigger>}
          {!onlyReturn && <TabsTrigger value="services">企业服务页面管理</TabsTrigger>}
          {!onlyReturn && <TabsTrigger value="video">视频监控页面管理</TabsTrigger>}
          {!onlyReturn && <TabsTrigger value="energy">能源一张图页面管理</TabsTrigger>}
          <TabsTrigger value="return">返乡创业一张图页面管理</TabsTrigger>
        </TabsList>
        {!onlyReturn && <TabsContent value="overview">{renderCategory('overview', '园区总览页面管理', overviewItems)}</TabsContent>}
        {!onlyReturn && <TabsContent value="economy">{renderCategory('economy', '经济运行页面管理', economyItems)}</TabsContent>}
        {!onlyReturn && <TabsContent value="elements">{renderCategory('elements', '要素保障页面管理', elementsItems)}</TabsContent>}
        {!onlyReturn && <TabsContent value="assets">{renderCategory('assets', '资产管理页面管理', assetsItems)}</TabsContent>}
        {!onlyReturn && <TabsContent value="investment">{renderCategory('investment', '招商引资页面管理', investmentItems)}</TabsContent>}
        {!onlyReturn && <TabsContent value="projects">{renderCategory('projects', '建设项目页面管理', projectsItems)}</TabsContent>}
        {!onlyReturn && <TabsContent value="services">{renderCategory('services', '企业服务页面管理', servicesItems)}</TabsContent>}
        {!onlyReturn && <TabsContent value="video">{renderCategory('video', '视频监控页面管理', videoItems)}</TabsContent>}
        {!onlyReturn && <TabsContent value="energy">{renderCategory('energy', '能源一张图页面管理', energyItems)}</TabsContent>}
        <TabsContent value="return">{renderCategory('return', '返乡创业一张图页面管理', returnEntrepreneurshipItems)}</TabsContent>
      </Tabs>
    </div>
  );
}
