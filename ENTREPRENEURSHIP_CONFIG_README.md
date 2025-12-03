# 返乡创业一张图 - 驾驶舱主页配置组件

## 📋 概述

这是一个全新设计的"返乡创业一张图"可视化大屏配置管理系统,采用模块化设计,让管理员能够直观地配置大屏各个区域的显示内容。

## 🎨 设计特点

### 1. 模块化布局
- **左侧配置区**: 创业园信息、土地使用、视频监控
- **中间配置区**: 地图中心点、高点标注
- **右侧配置区**: 园区产值、用工统计、金融贷款

### 2. 直观对应
每个配置卡片都明确标注了对应大屏的位置(如"对应大屏左上角区域"),让管理员清楚地知道自己在配置哪个模块。

### 3. 多级导航
左侧导航栏支持三级菜单:
```
可视化页面管理
  ├─ 返乡创业一张图
  │   ├─ 驾驶舱主页配置 (当前页面)
  │   ├─ 园区详情页配置
  │   ├─ 企业详情页配置
  │   └─ 介绍弹窗配置
  ├─ 能源一张图
  └─ 园区一张图
```

## 🗂️ 文件结构

```
src/components/park/
├── VisualizationConfigLayout.tsx       # 主布局组件
├── VisualizationSidebar.tsx           # 多级导航侧边栏
└── EntrepreneurshipMapConfig.tsx      # 返乡创业主页配置
```

## 🚀 使用方法

### 在现有系统中集成

#### 方法1: 替换原有的 VisualizationManagement 组件

在 `ParkDashboard.tsx` 或相应的路由文件中:

```tsx
import VisualizationConfigLayout from './components/park/VisualizationConfigLayout';

// 在渲染部分
<VisualizationConfigLayout />
```

#### 方法2: 添加为新的路由

如果使用 React Router:

```tsx
import { Routes, Route } from 'react-router-dom';
import VisualizationConfigLayout from './components/park/VisualizationConfigLayout';

<Routes>
  <Route path="/visualization-config" element={<VisualizationConfigLayout />} />
</Routes>
```

## 📦 数据结构

### EntrepreneurshipConfig 接口

```typescript
interface EntrepreneurshipConfig {
  // 园区简介文本
  introduction: string;
  
  // 基础指标 (园区/企业/产业数量)
  basicIndicators: BasicIndicator[];
  
  // 土地使用情况
  landUsage: LandUsage;
  
  // 视频监控源配置
  videoMonitors: VideoMonitor[];
  
  // 产值数据 (季度/年度 + 饼图)
  outputData: OutputData;
  
  // 用工统计 (总数 + 月度趋势)
  employmentData: EmploymentData;
  
  // 金融贷款 (总额 + 月度柱状图)
  financeData: FinanceData;
}
```

## 🎯 核心功能

### 1. 创业园信息与基础数据配置

- **园区简介**: 多行文本域,实时显示字数统计
- **核心指标**: 3个指标卡片(园区/企业/产业),每个包含标题、数值、单位

### 2. 土地使用情况配置

- **规划用地**: 面积 + 占比,带进度条可视化
- **已建园区**: 面积 + 占比,带进度条可视化

### 3. 视频监控源设置

- **4个监控窗口**: 每个窗口独立配置监控源
- **下拉选择**: 从预设的10个监控点中选择

### 4. 园区产值配置

- **季度数据**: 产值 + 环比增长率
- **年度数据**: 产值 + 同比增长率
- **饼图数据**: 动态添加/删除产业分类,每个包含名称和数值

### 5. 用工统计配置

- **总体数据**: 用工总数、带动就业人数,各自带趋势百分比
- **月度数据**: 1-12月的数据点输入

### 6. 金融贷款配置

- **总体数据**: 贷款总额 + 增长率
- **月度数据**: 1-12月的柱状图数据

## 🎨 UI 特性

### 卡片设计
- 每个模块使用独立的 Card 组件
- 渐变色标题栏区分不同功能区域
- 左侧彩色竖条标识模块

### 颜色方案
- **左侧配置**: 蓝色、绿色、紫色渐变
- **中间配置**: 琥珀色、天蓝色渐变
- **右侧配置**: 玫瑰色、青色、靛蓝渐变

### 响应式布局
- 使用 Grid 三列布局
- 每列独立滚动
- 顶部操作栏固定定位

## 💾 数据持久化

当前版本使用 React State 管理配置数据。生产环境建议:

### 方法1: 集成后端 API

```tsx
const handleSave = async () => {
  try {
    await fetch('/api/entrepreneurship-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    toast.success('配置已保存');
  } catch (error) {
    toast.error('保存失败');
  }
};
```

### 方法2: 使用 LocalStorage

```tsx
useEffect(() => {
  const saved = localStorage.getItem('entrepreneurship-config');
  if (saved) {
    setConfig(JSON.parse(saved));
  }
}, []);

const handleSave = () => {
  localStorage.setItem('entrepreneurship-config', JSON.stringify(config));
  toast.success('配置已保存');
};
```

## 🔧 自定义扩展

### 添加新的配置模块

1. 在 `EntrepreneurshipMapConfig.tsx` 中添加新的 Card:

```tsx
<Card className="shadow-md">
  <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
    <CardTitle className="text-lg flex items-center gap-2">
      <div className="w-1 h-6 bg-cyan-600 rounded"></div>
      新模块标题
    </CardTitle>
    <p className="text-xs text-slate-500 ml-3">对应大屏位置说明</p>
  </CardHeader>
  <CardContent className="pt-6 space-y-4">
    {/* 配置表单 */}
  </CardContent>
</Card>
```

2. 在数据接口中添加对应字段
3. 实现更新函数

### 添加新的子页面

在 `VisualizationConfigLayout.tsx` 的 `renderConfigContent` 中添加新的 case:

```tsx
case 'new-page':
  return <NewPageConfig />;
```

## 📱 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 已知问题

1. 月度数据输入框较多,考虑添加批量导入功能
2. 产业饼图数据可以添加颜色选择器
3. 地图中心点配置需要实际集成地图预览

## 🎓 开发建议

### 后续优化方向

1. **实时预览**: 右侧显示大屏实时预览效果
2. **历史版本**: 支持配置版本管理和回滚
3. **模板功能**: 预设多套配置模板供快速切换
4. **数据验证**: 添加更严格的输入验证和错误提示
5. **导入导出**: 支持配置文件的导入导出功能

### 代码质量提升

1. 将配置数据和业务逻辑抽离到自定义 Hook
2. 使用 React Query 管理服务端状态
3. 添加单元测试覆盖核心功能
4. 使用 Zod 进行运行时类型验证

## 📞 技术支持

如有问题或建议,请联系开发团队或提交 Issue。

---

**最后更新**: 2025年12月3日
**版本**: v1.0.0
