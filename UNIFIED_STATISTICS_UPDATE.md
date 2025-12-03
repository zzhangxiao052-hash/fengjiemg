# 统一统计栏指标更新说明

## 更新日期
2025年12月3日

## 更新内容

### 1. 新增统一统计组件
创建了 `UnifiedStatisticsCard.tsx` 组件，用于在所有资产管理页面展示统一的7个核心指标。

### 2. 核心指标说明

在三个管理页面（标准厂房、宿舍、商铺）的顶部，统一展示以下 **7个核心指标**：

| 序号 | 指标名称 | 说明 | 数据来源 |
|------|---------|------|---------|
| 1 | **总资产数** | 当前页面的资产总数量 | `dataSource.length` |
| 2 | **已出租** | 状态为"租赁中"的资产数量，含出租率 | `status === 'leased'` |
| 3 | **空闲中** | 状态为"空置"的资产数量 | `status === 'vacant'` |
| 4 | **装修中** | 状态为"装修中"的资产数量 | `status === 'decoration'` |
| 5 | **本年应收租金** | 所有资产的应收租金总和 | `sum(receivableRent)` |
| 6 | **本年实收租金** | 所有资产的实收租金总和 | `sum(receivedRent)` |
| 7 | **欠费金额** | 应收与实收的差额 | `应收 - 实收` |

### 3. 更新的文件

#### 新增文件
- `src/components/park/UnifiedStatisticsCard.tsx` - 统一统计卡片组件

#### 修改的文件
- `src/components/park/DormitoryPage.tsx` - 宿舍管理页面
- `src/components/park/StandardFactoryPage.tsx` - 标准厂房管理页面
- `src/components/park/RetailShopPage.tsx` - 商铺管理页面

### 4. 技术实现

#### UnifiedStats 接口定义
```typescript
export interface UnifiedStats {
  totalCount: number;          // 总资产数
  leasedCount: number;         // 已出租
  vacantCount: number;         // 空闲中
  decorationCount: number;     // 装修中
  totalReceivable: number;     // 本年应收租金
  totalReceived: number;       // 本年实收租金
  arrearsAmount: number;       // 欠费金额
}
```

#### 数据计算逻辑
每个页面都会基于当前的 `dataSource` 动态计算统计数据：

```typescript
const calculateStats = (data: Asset[]) => {
  const totalCount = data.length;
  const leasedCount = data.filter(item => item.status === AssetStatus.LEASED).length;
  const vacantCount = data.filter(item => item.status === AssetStatus.VACANT).length;
  const decorationCount = data.filter(item => item.status === AssetStatus.DECORATION).length;
  const totalReceivable = data.reduce((sum, item) => sum + (item.receivableRent || 0), 0);
  const totalReceived = data.reduce((sum, item) => sum + (item.receivedRent || 0), 0);
  const arrearsAmount = totalReceivable - totalReceived;

  setStats({
    totalCount,
    leasedCount,
    vacantCount,
    decorationCount,
    totalReceivable,
    totalReceived,
    arrearsAmount
  });
};
```

### 5. UI 展示效果

- 使用 Ant Design Pro 的 `StatisticCard.Group` 组件
- 7个指标横向排列
- 已出租显示绿色并包含出租率百分比
- 空闲中显示蓝色
- 装修中显示橙色
- 欠费金额根据数值显示红色（>0）或绿色（=0）
- 所有金额指标显示人民币符号（¥）和小数点后两位

### 6. 使用方式

在每个资产管理页面中：

```tsx
<UnifiedStatisticsCard 
  stats={stats} 
  title="资产统计标题" 
/>
```

### 7. 特性

✅ **动态计算**：基于当前页面的 dataSource 实时计算
✅ **统一规范**：三个页面使用相同的组件和数据结构
✅ **可扩展**：易于添加新的指标
✅ **类型安全**：使用 TypeScript 确保类型安全
✅ **响应式**：数据变化时自动更新统计

### 8. 后续优化建议

1. 可以添加趋势图表，显示各指标的月度变化
2. 可以添加同比/环比增长率
3. 可以添加导出统计报表功能
4. 可以添加自定义时间范围筛选
