# 返乡创业一张图配置系统 - 架构说明

## 📐 组件架构

```
VisualizationConfigLayout (主布局)
├── VisualizationSidebar (多级导航栏)
│   └── 返乡创业一张图
│       ├── 驾驶舱主页配置 ✓
│       ├── 园区详情页配置 (待开发)
│       ├── 企业详情页配置 (待开发)
│       └── 介绍弹窗配置 (待开发)
│
└── EntrepreneurshipMapConfig (主配置页面)
    ├── 顶部操作栏
    │   ├── 页面标题
    │   ├── 重置按钮
    │   └── 保存按钮
    │
    ├── 左侧配置区
    │   ├── 模块A: 创业园信息与基础数据
    │   │   ├── 园区简介 (Textarea)
    │   │   └── 核心指标卡片 (3个)
    │   │       ├── 园区数量
    │   │       ├── 企业数量
    │   │       └── 产业数量
    │   │
    │   ├── 模块B: 土地使用情况
    │   │   ├── 规划用地 (面积 + 占比 + 进度条)
    │   │   └── 已建园区 (面积 + 占比 + 进度条)
    │   │
    │   └── 模块C: 视频监控源设置
    │       ├── 监控窗口1 (Select)
    │       ├── 监控窗口2 (Select)
    │       ├── 监控窗口3 (Select)
    │       └── 监控窗口4 (Select)
    │
    ├── 中间配置区
    │   ├── 地图中心配置
    │   │   ├── 经度
    │   │   ├── 纬度
    │   │   └── 缩放级别
    │   │
    │   └── 高点图标配置 (预留)
    │
    └── 右侧配置区
        ├── 模块D: 园区产值
        │   ├── 季度产值 + 环比
        │   ├── 年度产值 + 同比
        │   └── 饼图数据 (动态列表)
        │       ├── 工业
        │       ├── 科技
        │       ├── 物流
        │       └── 其他 (可添加/删除)
        │
        ├── 模块E: 用工统计
        │   ├── 用工总数 + 趋势
        │   ├── 带动就业 + 趋势
        │   └── 月度数据 (1-12月)
        │
        └── 模块F: 金融贷款
            ├── 贷款总额 + 增长率
            └── 月度数据 (1-12月)
```

## 🗂️ 文件结构

```
src/components/park/
│
├── VisualizationConfigLayout.tsx       (383 行)
│   ├── 布局管理
│   ├── 路由控制
│   └── 侧边栏与内容区域协调
│
├── VisualizationSidebar.tsx           (99 行)
│   ├── 多级菜单渲染
│   ├── 展开/折叠控制
│   └── 活动项高亮
│
└── EntrepreneurshipMapConfig.tsx      (700+ 行)
    ├── 状态管理 (React State)
    ├── 数据类型定义
    ├── 初始数据
    ├── 更新函数集合
    └── UI 渲染
```

## 🎨 UI 设计原则

### 1. 模块化卡片设计

每个配置区域使用独立的 `Card` 组件:

```tsx
<Card className="shadow-md">
  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
    <CardTitle className="text-lg flex items-center gap-2">
      <div className="w-1 h-6 bg-blue-600 rounded"></div>
      模块标题
    </CardTitle>
    <p className="text-xs text-slate-500 ml-3">对应大屏位置说明</p>
  </CardHeader>
  <CardContent className="pt-6 space-y-4">
    {/* 配置表单 */}
  </CardContent>
</Card>
```

### 2. 颜色系统

| 模块区域 | 主色调 | 渐变方案 | 用途 |
|---------|--------|---------|------|
| 左上 | 蓝色 | `from-blue-50 to-indigo-50` | 创业园信息 |
| 左中 | 绿色 | `from-green-50 to-emerald-50` | 土地使用 |
| 左下 | 紫色 | `from-purple-50 to-pink-50` | 视频监控 |
| 中上 | 琥珀色 | `from-amber-50 to-orange-50` | 地图配置 |
| 中下 | 天蓝色 | `from-sky-50 to-cyan-50` | 高点标注 |
| 右上 | 玫瑰色 | `from-rose-50 to-red-50` | 园区产值 |
| 右中 | 青色 | `from-teal-50 to-emerald-50` | 用工统计 |
| 右下 | 靛蓝色 | `from-indigo-50 to-blue-50` | 金融贷款 |

### 3. 响应式布局

```tsx
// 主容器: 三列网格
<div className="grid grid-cols-3 gap-6">
  <div className="space-y-6">{/* 左侧 */}</div>
  <div className="space-y-6">{/* 中间 */}</div>
  <div className="space-y-6">{/* 右侧 */}</div>
</div>
```

## 🔄 数据流

### 单向数据流

```
用户操作
   ↓
Input/Select onChange
   ↓
updateXXX 函数
   ↓
setConfig (更新 State)
   ↓
组件重渲染
   ↓
UI 更新
```

### 状态管理

```tsx
// 主状态
const [config, setConfig] = useState<EntrepreneurshipConfig>(initialConfig);

// 更新示例
const updateBasicIndicator = (id: string, field: keyof BasicIndicator, value: string) => {
  setConfig({
    ...config,
    basicIndicators: config.basicIndicators.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ),
  });
};
```

## 📊 数据结构详解

### EntrepreneurshipConfig (主接口)

```typescript
interface EntrepreneurshipConfig {
  introduction: string;                    // 园区简介
  basicIndicators: BasicIndicator[];       // 基础指标数组
  landUsage: LandUsage;                   // 土地使用对象
  videoMonitors: VideoMonitor[];          // 监控源数组
  outputData: OutputData;                 // 产值数据对象
  employmentData: EmploymentData;         // 用工数据对象
  financeData: FinanceData;               // 金融数据对象
}
```

### 子接口

```typescript
// 基础指标
interface BasicIndicator {
  id: string;
  title: string;    // 如 "园区"
  value: string;    // 如 "12"
  unit: string;     // 如 "个"
}

// 土地使用
interface LandUsage {
  plannedArea: string;          // 规划用地面积
  plannedPercentage: string;    // 规划用地占比
  builtArea: string;            // 已建面积
  builtPercentage: string;      // 已建占比
}

// 监控源
interface VideoMonitor {
  id: string;
  label: string;    // 如 "监控窗口1"
  source: string;   // 如 "大门全景"
}

// 产业数据 (用于饼图)
interface IndustryData {
  id: string;
  name: string;     // 如 "工业"
  value: string;    // 如 "279"
}

// 月度数据 (通用)
interface MonthlyData {
  month: string;    // 如 "1月"
  value: string;    // 数值
}

// 产值数据
interface OutputData {
  quarterValue: string;         // 季度产值
  quarterChange: string;        // 季度环比
  annualValue: string;          // 年度产值
  annualChange: string;         // 年度同比
  pieChartData: IndustryData[]; // 饼图数据
}

// 用工数据
interface EmploymentData {
  totalEmployment: string;      // 用工总数
  totalTrend: string;           // 用工趋势
  jobCreation: string;          // 带动就业
  jobCreationTrend: string;     // 就业趋势
  monthlyData: MonthlyData[];   // 月度数据
}

// 金融数据
interface FinanceData {
  totalLoan: string;            // 贷款总额
  growthRate: string;           // 增长率
  monthlyData: MonthlyData[];   // 月度数据
}
```

## 🔧 核心函数说明

### 通用更新模式

```typescript
// 1. 简单字段更新
const updateIntroduction = (value: string) => {
  setConfig({ ...config, introduction: value });
};

// 2. 嵌套对象更新
const updateLandUsage = (field: keyof LandUsage, value: string) => {
  setConfig({
    ...config,
    landUsage: { ...config.landUsage, [field]: value },
  });
};

// 3. 数组项更新
const updateBasicIndicator = (id: string, field: keyof BasicIndicator, value: string) => {
  setConfig({
    ...config,
    basicIndicators: config.basicIndicators.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ),
  });
};

// 4. 数组添加
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

// 5. 数组删除
const removeIndustryData = (id: string) => {
  setConfig({
    ...config,
    outputData: {
      ...config.outputData,
      pieChartData: config.outputData.pieChartData.filter((item) => item.id !== id),
    },
  });
};
```

## 🎯 关键特性实现

### 1. 固定顶部操作栏

```tsx
<div className="sticky top-0 z-10 bg-white border-b shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-4">
    <div className="flex items-center justify-between">
      {/* 标题和按钮 */}
    </div>
  </div>
</div>
```

### 2. 进度条可视化

```tsx
<Progress 
  value={parseFloat(config.landUsage.plannedPercentage) || 0} 
  className="mt-2 h-2" 
/>
```

### 3. 动态列表管理

```tsx
<div className="space-y-2 max-h-64 overflow-y-auto">
  {config.outputData.pieChartData.map((item) => (
    <div key={item.id} className="flex items-center gap-2">
      <Input /* 名称 */ />
      <Input /* 数值 */ />
      <Button onClick={() => removeItem(item.id)}>删除</Button>
    </div>
  ))}
</div>
<Button onClick={addItem}>添加</Button>
```

### 4. 下拉选择器

```tsx
<Select
  value={monitor.source}
  onValueChange={(value: string) => updateVideoMonitor(monitor.id, value)}
>
  <SelectTrigger>
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
```

## 🚀 性能优化建议

### 1. 使用 useMemo 缓存计算结果

```typescript
const totalIndustryValue = useMemo(() => {
  return config.outputData.pieChartData.reduce(
    (sum, item) => sum + parseFloat(item.value || '0'),
    0
  );
}, [config.outputData.pieChartData]);
```

### 2. 使用 useCallback 缓存函数

```typescript
const updateBasicIndicator = useCallback((id: string, field: keyof BasicIndicator, value: string) => {
  setConfig(prev => ({
    ...prev,
    basicIndicators: prev.basicIndicators.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    ),
  }));
}, []);
```

### 3. 拆分大组件

考虑将配置区域拆分为独立组件:

```tsx
// BasicInfoConfig.tsx
const BasicInfoConfig: React.FC<Props> = ({ config, onUpdate }) => {
  // 只处理基础信息部分
};

// LandUsageConfig.tsx
const LandUsageConfig: React.FC<Props> = ({ config, onUpdate }) => {
  // 只处理土地使用部分
};

// 主组件中使用
<BasicInfoConfig config={config.basicInfo} onUpdate={handleBasicInfoUpdate} />
<LandUsageConfig config={config.landUsage} onUpdate={handleLandUsageUpdate} />
```

## 📝 代码规范

### 命名约定

- **接口**: 使用 PascalCase,如 `EntrepreneurshipConfig`
- **组件**: 使用 PascalCase,如 `EntrepreneurshipMapConfig`
- **函数**: 使用 camelCase,如 `updateBasicIndicator`
- **常量**: 使用 UPPER_SNAKE_CASE,如 `MONITOR_SOURCE_OPTIONS`

### 注释规范

```typescript
/**
 * 更新基础指标
 * @param id 指标ID
 * @param field 要更新的字段
 * @param value 新值
 */
const updateBasicIndicator = (id: string, field: keyof BasicIndicator, value: string) => {
  // 实现
};
```

## 🔮 未来扩展方向

1. **实时预览**: 右侧显示大屏预览效果
2. **历史版本**: 配置版本管理和回滚
3. **模板系统**: 预设配置模板
4. **批量操作**: 批量导入月度数据
5. **数据验证**: 表单验证和错误提示
6. **权限控制**: 细粒度权限管理
7. **审计日志**: 记录配置变更历史
8. **国际化**: 支持多语言

---

**文档版本**: v1.0.0  
**最后更新**: 2025年12月3日  
**维护者**: 开发团队
