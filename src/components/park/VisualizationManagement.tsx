import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Camera, Factory, Activity, Zap, Map as MapIcon, BarChart, PieChart, TrendingUp, Coins, Building, Users, GripVertical, Video, Eye, EyeOff, Upload } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import VideoMonitoringSettings from './VideoMonitoringSettings';
import EnergyOneMapSettings from './EnergyOneMapSettings';
import OverviewSettings from './OverviewSettings';
import EconomySettings from './EconomySettings'; // Import the new component
import ElementGuaranteeSettings from './ElementGuaranteeSettings';
import AssetsSettings from './AssetsSettings';

// --- Types for Overview Page ---
interface Metric { id: string; name: string; value: string; unit: string; }
interface SectionData { title: string; content?: string; stats: Metric[]; }
interface ParkData { id: string; name: string; area: string; coreIndustry: string; }
interface CameraData { id: string; name: string; url: string; }
interface EnergyStat { id: string; year: string; water: string; electricity: string; gas: string; }
interface ChartData { id: string; name: string; value: string; }

interface OverviewData {
  topMetrics: Metric[];
  ecological: SectionData;
  county: SectionData;
  parks: ParkData[];
  cameras: CameraData[];
  energyStats: EnergyStat[];
  industryLayout: ChartData[];
  eyeIndustry: SectionData;
  agIndustry: SectionData;
  enterpriseTypes: ChartData[];
  productOutput: ChartData[];
}

// --- Initial Data for Overview ---
const initialOverviewData: OverviewData = {
  topMetrics: [
    { id: 'tm1', name: '工业总产值', value: '100', unit: '亿元' },
    { id: 'tm2', name: '用地面积', value: '1320', unit: '亩' },
    { id: 'tm3', name: '总发电量', value: '2654', unit: '万kWh' },
  ],
  ecological: {
    title: '生态工业发展概况',
    content: '2023年全县实现工业增加值47亿元，增长3.5%，占GDP比重13.8%...',
    stats: [
      { id: 'eco1', name: '全县工业园区概况', value: '', unit: '' },
    ]
  },
  county: {
    title: '全县工业园区概况',
    content: '...',
    stats: []
  },
  parks: [
    { id: 'p1', name: '安坪组团', area: '8KM²', coreIndustry: '能源' },
    { id: 'p2', name: '草堂组团', area: '6KM²', coreIndustry: '农副产品和旅游产品加工' },
    { id: 'p3', name: '朱衣组团', area: '2KM²', coreIndustry: '出口贸易加工产业' },
  ],
  cameras: [
    { id: 'c1', name: '园区入口摄像头', url: 'rtsp://...' },
    { id: 'c2', name: '厂区全景', url: 'rtsp://...' },
    { id: 'c3', name: '生产车间A', url: 'rtsp://...' },
    { id: 'c4', name: '物流通道', url: 'rtsp://...' },
  ],
  energyStats: [
    { id: 'es1', year: '2021', water: '1500', electricity: '2000', gas: '500' },
    { id: 'es2', year: '2022', water: '1600', electricity: '2100', gas: '600' },
    { id: 'es3', year: '2023', water: '1700', electricity: '2200', gas: '700' },
    { id: 'es4', year: '2024', water: '1800', electricity: '2300', gas: '800' },
    { id: 'es5', year: '2025', water: '1900', electricity: '2400', gas: '900' },
  ],
  industryLayout: [
    { id: 'il1', name: '眼镜产业', value: '30' },
    { id: 'il2', name: '农副产品加工产业', value: '25' },
    { id: 'il3', name: '出口贸易加工产业', value: '20' },
    { id: 'il4', name: '特色旅游产品加工产业', value: '15' },
    { id: 'il5', name: '能源化工及建材产业', value: '10' },
  ],
  eyeIndustry: {
    title: '眼镜产业情况',
    stats: [
      { id: 'ei1', name: '企业数量', value: '2654', unit: '家' },
      { id: 'ei2', name: '总产值', value: '2654', unit: '万元' },
      { id: 'ei3', name: '专利', value: '2654', unit: '项' },
      { id: 'ei4', name: '注册商标', value: '2654', unit: '个' },
    ]
  },
  agIndustry: {
    title: '农副产品加工产业情况',
    stats: [
      { id: 'ai1', name: '企业数量', value: '120', unit: '家' },
      { id: 'ai2', name: '总产值', value: '1500', unit: '万元' },
    ]
  },
  enterpriseTypes: [
    { id: 'et1', name: '米面加工', value: '36' },
    { id: 'et2', name: '淀粉制作加工', value: '24' },
    { id: 'et3', name: '中药材初加工', value: '20' },
    { id: 'et4', name: '肉类加工', value: '15' },
    { id: 'et5', name: '其他', value: '5' },
  ],
  productOutput: [
    { id: 'po1', name: '菜籽油加工', value: '1500' },
    { id: 'po2', name: '淀粉制作加工', value: '2000' },
    { id: 'po3', name: '中药材初加工', value: '1800' },
    { id: 'po4', name: '肉类加工', value: '2500' },
    { id: 'po5', name: '其他', value: '1000' },
  ]
};

// --- Types for Economy Page ---
interface IndustryValue { id: string; name: string; value: string; percentage?: string; }
interface InvestmentData { total: string; items: IndustryValue[]; }
interface TaxData { total: string; items: IndustryValue[]; }
interface YearlyStat { id: string; year: string; value: string; growth: string; }

interface EconomyData {
  outputStats: IndustryValue[];
  investmentStats: InvestmentData;
  taxStats: TaxData;
  eyewearStats: YearlyStat[];
  energyStats: YearlyStat[];
  agricultureStats: YearlyStat[];
}

const initialEconomyData: EconomyData = {
  outputStats: [
    { id: 'os1', name: '眼镜产业', value: '840', percentage: '48%' },
    { id: 'os2', name: '农副产品加工产业', value: '840', percentage: '48%' },
    { id: 'os3', name: '出口贸易加工产业', value: '840', percentage: '48%' },
    { id: 'os4', name: '特色旅游产品加工产业', value: '840', percentage: '48%' },
    { id: 'os5', name: '能源化工及建材产业', value: '840', percentage: '48%' },
  ],
  investmentStats: {
    total: '1320',
    items: [
      { id: 'is1', name: '眼镜产业', value: '20.0' },
      { id: 'is2', name: '农副产品加工产业', value: '20.0' },
      { id: 'is3', name: '出口贸易加工产业', value: '20.0' },
      { id: 'is4', name: '特色旅游产品加工产业', value: '20.0' },
      { id: 'is5', name: '能源化工及建材产业', value: '20.0' },
    ]
  },
  taxStats: {
    total: '1320',
    items: [
      { id: 'ts1', name: '眼镜产业', value: '20.0' },
      { id: 'ts2', name: '农副产品加工产业', value: '20.0' },
      { id: 'ts3', name: '出口贸易加工产业', value: '20.0' },
      { id: 'ts4', name: '特色旅游产品加工产业', value: '20.0' },
      { id: 'ts5', name: '能源化工及建材产业', value: '20.0' },
    ]
  },
  eyewearStats: [
    { id: 'es1', year: '2021', value: '1500', growth: '20' },
    { id: 'es2', year: '2022', value: '2000', growth: '40' },
    { id: 'es3', year: '2023', value: '1800', growth: '30' },
    { id: 'es4', year: '2024', value: '2500', growth: '50' },
    { id: 'es5', year: '2025', value: '2800', growth: '60' },
  ],
  energyStats: [
    { id: 'ens1', year: '2021', value: '1500', growth: '20' },
    { id: 'ens2', year: '2022', value: '2000', growth: '40' },
    { id: 'ens3', year: '2023', value: '1800', growth: '30' },
    { id: 'ens4', year: '2024', value: '2500', growth: '50' },
    { id: 'ens5', year: '2025', value: '2800', growth: '60' },
  ],
  agricultureStats: [
    { id: 'as1', year: '2021', value: '1500', growth: '20' },
    { id: 'as2', year: '2022', value: '2000', growth: '40' },
    { id: 'as3', year: '2023', value: '1800', growth: '30' },
    { id: 'as4', year: '2024', value: '2500', growth: '50' },
    { id: 'as5', year: '2025', value: '2800', growth: '60' },
  ],
};

// --- Types for Assets Page ---
interface AssetMetric { id: string; name: string; value: string; unit: string; }
interface LandUseData { metrics: AssetMetric[]; }
interface ConstructionLandData { totalArea: string; percentage: string; items: { id: string; name: string; value: string; percentage: string; }[]; }
interface PlanningTrendMetric { area: string; percentage: string; }
interface PlanningTrendData { planning: PlanningTrendMetric; built: PlanningTrendMetric; }
interface PlanningAreaTrendItem { id: string; year: string; planning: string; built: string; }
interface RentalItem { id: string; name: string; value: string; unit: string; }
interface TenantAnalysisItem { id: string; name: string; value: string; percentage: string; }
interface TenantTableItem { id: string; name: string; area: string; status: string; }

interface AssetsData {
  landUse: LandUseData;
  constructionLand: ConstructionLandData;
  planningTrend: PlanningTrendData;
  planningAreaTrend: PlanningAreaTrendItem[];
  leasedHouses: { total: string; rate: string; };
  houseRental: RentalItem[];
  tenantAnalysis: TenantAnalysisItem[];
  tenantTable: TenantTableItem[];
}

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
    { id: 'tt4', name: '奉节工业园区地块名称', area: '63.2975', status: '已出让' },
    { id: 'tt5', name: '奉节工业园区地块名称', area: '63.2975', status: '已出让' },
  ]
};

// --- Generic Types for Other Tabs ---
interface MetricConfig {
  id: string;
  name: string;
  value: string;
  unit?: string;
}

// --- Types for Elements Page ---
interface ElementMetric { id: string; name: string; value: string; unit: string; growth: string; }
interface TimeSeriesData { id: string; label: string; value: string; } // label can be month or year
interface ElementChartData {
  monthly: TimeSeriesData[];
  yearly: TimeSeriesData[];
}

interface ElementsData {
  energyMetrics: ElementMetric[];
  waterStats: ElementChartData;
  electricityStats: ElementChartData;
  gasStats: ElementChartData;
}

const initialElementsData: ElementsData = {
  energyMetrics: [
    { id: 'em1', name: '年度用水量统计', value: '2540', unit: '万立方', growth: '42' },
    { id: 'em2', name: '年度用电量统计', value: '2540', unit: 'kWh', growth: '42' },
    { id: 'em3', name: '年度用气量统计', value: '2540', unit: '万立方', growth: '42' },
  ],
  waterStats: {
    monthly: Array.from({ length: 12 }, (_, i) => ({ id: `wm-${i}`, label: `${String(i + 1).padStart(2, '0')}`, value: String(Math.floor(Math.random() * 1000) + 1000) })),
    yearly: Array.from({ length: 5 }, (_, i) => ({ id: `wy-${i}`, label: `${2021 + i}`, value: String(Math.floor(Math.random() * 1000) + 2000) })),
  },
  electricityStats: {
    monthly: Array.from({ length: 12 }, (_, i) => ({ id: `em-${i}`, label: `${String(i + 1).padStart(2, '0')}`, value: String(Math.floor(Math.random() * 1000) + 1000) })),
    yearly: Array.from({ length: 5 }, (_, i) => ({ id: `ey-${i}`, label: `${2021 + i}`, value: String(Math.floor(Math.random() * 1000) + 2000) })),
  },
  gasStats: {
    monthly: Array.from({ length: 12 }, (_, i) => ({ id: `gm-${i}`, label: `${String(i + 1).padStart(2, '0')}`, value: String(Math.floor(Math.random() * 1000) + 1000) })),
    yearly: Array.from({ length: 5 }, (_, i) => ({ id: `gy-${i}`, label: `${2021 + i}`, value: String(Math.floor(Math.random() * 1000) + 2000) })),
  },
};

// --- Types for Investment Page ---
interface IndustryChainItem {
  id: string;
  name: string;
  status: string; // 招商完成情况
  rate: string;   // 完成率
}

interface InvestmentPromotionData {
  // Left Section
  overview: {
    investmentAmount: string; // 招商投资额
    contractValue: string;    // 合同总产值
  };
  projectStage: {
    negotiating: { count: string; ratio: string }; // 重点在谈
    signed: { count: string; ratio: string };      // 已签约
  };
  projectScale: {
    scale1to10: { count: string; ratio: string };
    scale10to30: { count: string; ratio: string };
    scaleOver30: { count: string; ratio: string };
  };

  // Right Section A
  recentResults: {
    count: string;
    growth: string;
  };
  industryChains: IndustryChainItem[];

  // Right Section B
  signingOverview: {
    notStarted: string;
    started: string; // Highlight
    notInProduction: string;
    inProduction: string; // Highlight
  };
}

const initialInvestmentPromotionData: InvestmentPromotionData = {
  overview: { investmentAmount: '380,203', contractValue: '380,203' },
  projectStage: {
    negotiating: { count: '12', ratio: '25.60%' },
    signed: { count: '12', ratio: '25.60%' },
  },
  projectScale: {
    scale1to10: { count: '50', ratio: '68%' },
    scale10to30: { count: '13', ratio: '21%' },
    scaleOver30: { count: '8', ratio: '11%' },
  },
  recentResults: { count: '30', growth: '20%' },
  industryChains: [
    { id: 'ic1', name: '智能制造', status: '完成', rate: '100%' },
    { id: 'ic2', name: '生物医药', status: '进行中', rate: '80%' },
    { id: 'ic3', name: '新能源', status: '进行中', rate: '60%' },
    { id: 'ic4', name: '新材料', status: '未开始', rate: '0%' },
    { id: 'ic5', name: '电子信息', status: '完成', rate: '100%' },
  ],
  signingOverview: {
    notStarted: '5',
    started: '20',
    notInProduction: '8',
    inProduction: '12',
  },
};

// --- Types for Projects Page ---
interface ProjectClassificationItem {
  id: string;
  name: string;
  count: string;
}

interface InvestmentItem {
  id: string;
  name: string;
  amount: string; // 投资金额
}

interface ProjectsData {
  // Left Column
  nature: {
    total: string;
    continued: { count: string; ratio: string };
    expansion: { count: string; ratio: string };
  };
  scale: {
    below100M: { count: string; ratio: string };
    between100And500M: { count: string; ratio: string };
    between500And1000M: { count: string; ratio: string };
  };
  classification: ProjectClassificationItem[]; // Dynamic

  // Right Column
  completedInvestment: InvestmentItem[]; // Dynamic
  continuedStage: {
    notStarted: { count: string; ratio: string };
    underConstruction: { count: string; ratio: string };
    completed: { count: string; ratio: string };
  };
  expansionStage: {
    notStarted: { count: string; ratio: string };
    underConstruction: { count: string; ratio: string };
    completed: { count: string; ratio: string };
  };
}

const initialProjectsData: ProjectsData = {
  nature: {
    total: '254',
    continued: { count: '20', ratio: '62.50%' },
    expansion: { count: '12', ratio: '37.50%' },
  },
  scale: {
    below100M: { count: '840', ratio: '48%' },
    between100And500M: { count: '840', ratio: '48%' },
    between500And1000M: { count: '840', ratio: '48%' },
  },
  classification: [
    { id: 'pc1', name: '眼镜项目', count: '80' },
    { id: 'pc2', name: '农副产品项目', count: '78' },
    { id: 'pc3', name: '能源项目', count: '80' },
  ],
  completedInvestment: [
    { id: 'ci1', name: '眼镜项目', amount: '30' },
    { id: 'ci2', name: '农副产品项目', amount: '25' },
    { id: 'ci3', name: '能源项目', amount: '20' },
  ],
  continuedStage: {
    notStarted: { count: '840', ratio: '48%' },
    underConstruction: { count: '840', ratio: '48%' },
    completed: { count: '840', ratio: '48%' },
  },
  expansionStage: {
    notStarted: { count: '840', ratio: '48%' },
    underConstruction: { count: '840', ratio: '48%' },
    completed: { count: '840', ratio: '48%' },
  },
};

// --- Types for Services Page ---
interface EnterpriseClassificationItem {
  id: string;
  industryName: string;
  enterpriseList: string; // Comma separated or multiline
  count: string;
}

interface PositionChartItem {
  id: string;
  category: string;
  value: string;
  unit: string;
}

interface HighQualityEnterpriseItem {
  id: string;
  categoryName: string;
  companyDetails: string;
  associatedValue: string;
}

interface LogisticsItem {
  id: string;
  mode: string;
  percentage: string;
  unit: string;
}

interface FinancialProductItem {
  id: string;
  productName: string;
  amount: string;
  unit: string;
}

interface ServicesData {
  classification: EnterpriseClassificationItem[];
  talent: {
    totalRecommended: string;
    positionChart: PositionChartItem[];
  };
  highQuality: HighQualityEnterpriseItem[];
  logistics: LogisticsItem[];
  financialProducts: FinancialProductItem[];
}

const initialServicesData: ServicesData = {
  classification: [
    { id: 'ec1', industryName: '眼镜重点企业', enterpriseList: '企业A, 企业B, 企业C', count: '12' },
    { id: 'ec2', industryName: '农副产品重点企业', enterpriseList: '企业D, 企业E', count: '8' },
  ],
  talent: {
    totalRecommended: '129208',
    positionChart: [
      { id: 'pc1', category: '技工', value: '1200', unit: '人' },
      { id: 'pc2', category: '销售', value: '1200', unit: '人' },
      { id: 'pc3', category: '质量管理', value: '1200', unit: '人' },
      { id: 'pc4', category: '财务', value: '1200', unit: '人' },
      { id: 'pc5', category: '普工', value: '1200', unit: '人' },
      { id: 'pc6', category: '专业技术', value: '1200', unit: '人' },
    ],
  },
  highQuality: [
    { id: 'hq1', categoryName: '专精特新', companyDetails: '企业X, 企业Y', associatedValue: '15' },
    { id: 'hq2', categoryName: '小巨人', companyDetails: '企业Z', associatedValue: '5' },
  ],
  logistics: [
    { id: 'l1', mode: '公路运输', percentage: '85', unit: '%' },
    { id: 'l2', mode: '铁路运输', percentage: '5', unit: '%' },
    { id: 'l3', mode: '其它运输', percentage: '10', unit: '%' },
  ],
  financialProducts: [
    { id: 'fp1', productName: '担保贷', amount: '5368.82', unit: '万元' },
    { id: 'fp2', productName: '经营快贷', amount: '4275', unit: '万元' },
    { id: 'fp3', productName: '园区产业贷', amount: '2275', unit: '万元' },
    { id: 'fp4', productName: '其他贷款', amount: '30784.08', unit: '万元' },
  ],
};

// --- Types for Video Surveillance Page ---
interface CameraDevice {
  id: string;
  displayName: string; // 显示名称
  deviceType: string; // 设备类型：全景、动球、枪机
  streamUrl: string; // 视频流地址/设备ID
  zone: string; // 所属区域
  status: boolean; // 在线/离线状态
  order: number; // 排序
}

interface VideoMonitoringData {
  cameras: CameraDevice[];
  defaultCamera: string; // 默认选中设备ID
  ptzControlEnabled: boolean; // 云台控制权限
}

const initialVideoMonitoringData: VideoMonitoringData = {
  cameras: [
    { 
      id: 'cam1', 
      displayName: '草堂工业园-全景', 
      deviceType: '全景', 
      streamUrl: 'rtsp://192.168.1.100/stream1', 
      zone: '草堂工业园', 
      status: true,
      order: 1
    },
    { 
      id: 'cam2', 
      displayName: '草堂工业园-动球01', 
      deviceType: '动球', 
      streamUrl: 'rtsp://192.168.1.101/stream1', 
      zone: '草堂工业园', 
      status: true,
      order: 2
    },
    { 
      id: 'cam3', 
      displayName: '高铁生态城-全景', 
      deviceType: '全景', 
      streamUrl: 'rtsp://192.168.1.102/stream1', 
      zone: '高铁生态城', 
      status: false,
      order: 3
    },
    { 
      id: 'cam4', 
      displayName: '园区入口-枪机', 
      deviceType: '枪机', 
      streamUrl: 'rtsp://192.168.1.103/stream1', 
      zone: '草堂工业园', 
      status: true,
      order: 4
    },
  ],
  defaultCamera: 'cam1',
  ptzControlEnabled: true,
};

export default function VisualizationManagement({ pageType = 'overview' }: { pageType?: string }) {
  // --- State for Overview ---
  const [overviewData, setOverviewData] = useState<OverviewData>(initialOverviewData);

  const [economyData, setEconomyData] = useState<EconomyData>(initialEconomyData);
  const [elementsData, setElementsData] = useState<ElementsData>(initialElementsData);
  const [assetsData, setAssetsData] = useState<AssetsData>(initialAssetsData);
  const [investmentData, setInvestmentData] = useState<InvestmentPromotionData>(initialInvestmentPromotionData);
  const [projectsData, setProjectsData] = useState<ProjectsData>(initialProjectsData);

  // --- State for Other Tabs ---
  const [configs, setConfigs] = useState<Record<string, MetricConfig[]>>({});

  // --- Helper Functions for Overview ---
  const updateOverview = (section: keyof OverviewData, value: any) => {
    setOverviewData(prev => ({ ...prev, [section]: value }));
  };

  const handleSaveOverview = () => {
    toast.success('园区总览页面配置已保存');
    // Here you would typically save to backend
  };

  const updateEconomy = (section: keyof EconomyData, value: any) => {
    setEconomyData(prev => ({ ...prev, [section]: value }));
  };

  const handleSaveEconomy = () => {

    toast.success('经济运行页面配置已保存');
  };

  const updateElements = (section: keyof ElementsData, value: any) => {
    setElementsData(prev => ({ ...prev, [section]: value }));
  };

  const handleSaveElements = () => {
    toast.success('要素保障页面配置已保存');
  };

  const updateAssets = (section: keyof AssetsData, value: any) => {
    setAssetsData(prev => ({ ...prev, [section]: value }));
  };

  const handleSaveAssets = () => {
    toast.success('资产管理页面配置已保存');
  };

  const updateInvestment = (section: keyof InvestmentPromotionData, value: any) => {
    setInvestmentData(prev => ({ ...prev, [section]: value }));
  };

  const handleSaveInvestment = () => {
    toast.success('招商引资页面配置已保存');
  };

  const updateProjects = (section: keyof ProjectsData, value: any) => {
    setProjectsData(prev => ({ ...prev, [section]: value }));
  };

  const handleSaveProjects = () => {
    toast.success('建设项目页面配置已保存');
  };

  const [servicesData, setServicesData] = useState<ServicesData>(initialServicesData);

  const updateServices = (section: keyof ServicesData, value: any) => {
    setServicesData(prev => ({ ...prev, [section]: value }));
  };

  const handleSaveServices = () => {
    toast.success('企业服务页面配置已保存');
  };

  // --- State for Video Monitoring ---
  const [videoMonitoringData, setVideoMonitoringData] = useState<VideoMonitoringData>(initialVideoMonitoringData);

  const updateVideoMonitoring = (section: keyof VideoMonitoringData, value: any) => {
    setVideoMonitoringData(prev => ({ ...prev, [section]: value }));
  };

  const handleSaveVideoMonitoring = () => {
    toast.success('视频监控页面配置已保存');
  };

  // --- Helper Functions for Other Tabs ---
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

  // const initCategory = (key: string, items: string[]) => {
  //   if (!configs[key]) {
  //     setConfigs(prev => ({ ...prev, [key]: items.map((name, idx) => ({ id: `${key}-${idx}`, name, value: '', unit: '' })) }));
  //   }
  // };

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
    // initCategory(key, items); // Removed to prevent side effects during render
    const safeItems = Array.isArray(items) ? items : [];
    // Ensure configs is an object
    const currentConfigs = configs || {};
    const list = currentConfigs[key] || safeItems.map((name, idx) => ({ id: `${key}-${idx}`, name, value: '', unit: '' }));
    
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 text-lg">{title}</h2>
            <div className="flex gap-2">
              {key === 'return' && (
                <Button className="border" onClick={() => addMetric(key)}>新增指标</Button>
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
                  <TableRow key={m.id || i} className="hover:bg-slate-50">
                    <TableCell>{m.name}</TableCell>
                    <TableCell>
                      <Input value={m.value || ''} onChange={e => {
                        setConfigs(prev => {
                          const copy = { ...(prev || {}) };
                          const arr = (copy[key] || list).slice();
                          if (arr[i]) {
                             arr[i] = { ...arr[i], value: e.target.value };
                             copy[key] = arr;
                          }
                          return copy;
                        });
                      }} />
                    </TableCell>
                    <TableCell>
                      <Input value={m.unit || ''} onChange={e => {
                        setConfigs(prev => {
                          const copy = { ...(prev || {}) };
                          const arr = (copy[key] || list).slice();
                          if (arr[i]) {
                              arr[i] = { ...arr[i], unit: e.target.value };
                              copy[key] = arr;
                          }
                          return copy;
                        });
                      }} />
                    </TableCell>
                    {key === 'return' && (
                      <TableCell className="text-right">
                        <Button className="hover:bg-slate-100" onClick={() => {
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

  // --- Economy Render Component ---
  // Refactored to use EconomySettings component
  // const renderEconomySettings = () => { ... }

  // --- Elements Render Component ---
  const renderElementsSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">要素保障页面配置</h2>
          <Button onClick={handleSaveElements} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
            <Save className="w-4 h-4 mr-2" />
            保存全部配置
          </Button>
        </div>

        <ElementGuaranteeSettings value={elementsData} onChange={setElementsData} />
      </div>
    );
  };

  // --- Overview Render Component ---
  const renderOverviewSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">园区总览页面配置</h2>
          <Button onClick={handleSaveOverview} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
            <Save className="w-4 h-4 mr-2" />
            保存全部配置
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="top-metrics">
          {/* 1. Top Metrics */}
          <AccordionItem value="top-metrics" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-medium">顶部核心指标 (地图上方)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>指标名称</TableHead>
                    <TableHead>数值</TableHead>
                    <TableHead>单位</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overviewData.topMetrics.map((metric, index) => (
                    <TableRow key={metric.id}>
                      <TableCell><Input value={metric.name} onChange={(e) => {
                        const newMetrics = [...overviewData.topMetrics];
                        newMetrics[index].name = e.target.value;
                        updateOverview('topMetrics', newMetrics);
                      }} /></TableCell>
                      <TableCell><Input value={metric.value} onChange={(e) => {
                        const newMetrics = [...overviewData.topMetrics];
                        newMetrics[index].value = e.target.value;
                        updateOverview('topMetrics', newMetrics);
                      }} /></TableCell>
                      <TableCell><Input value={metric.unit} onChange={(e) => {
                        const newMetrics = [...overviewData.topMetrics];
                        newMetrics[index].unit = e.target.value;
                        updateOverview('topMetrics', newMetrics);
                      }} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

          {/* 2. Ecological & County Overview */}
          <AccordionItem value="ecological" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 text-green-600" />
                <span className="text-lg font-medium">生态工业与园区概况 (左上)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700">生态工业发展概况</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label className="text-right text-sm">标题</label>
                    <Input className="col-span-3" value={overviewData.ecological.title} onChange={(e) => {
                      updateOverview('ecological', { ...overviewData.ecological, title: e.target.value });
                    }} />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <label className="text-right text-sm mt-2">内容描述</label>
                    <Textarea className="col-span-3" rows={4} value={overviewData.ecological.content} onChange={(e) => {
                      updateOverview('ecological', { ...overviewData.ecological, content: e.target.value });
                    }} />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700">全县工业园区概况</h3>
                 {/* Assuming this is nested or separate, following user description */}
                 {overviewData.ecological.stats.map((stat, idx) => (
                   <div key={stat.id} className="grid grid-cols-3 gap-4 border p-4 rounded bg-slate-50">
                      <Input placeholder="名称" value={stat.name} onChange={(e) => {
                        const newStats = [...overviewData.ecological.stats];
                        newStats[idx].name = e.target.value;
                        updateOverview('ecological', { ...overviewData.ecological, stats: newStats });
                      }} />
                      {/* Add more fields if needed for stats */}
                   </div>
                 ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 3. Park Cards (Map) */}
          <AccordionItem value="parks" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-indigo-600" />
                <span className="text-lg font-medium">园区卡片信息 (地图)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={() => {
                  updateOverview('parks', [...overviewData.parks, { id: `p-${Date.now()}`, name: '新园区', area: '', coreIndustry: '' }]);
                }}><Plus className="w-4 h-4 mr-2" />添加园区</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>园区名称</TableHead>
                    <TableHead>占地面积</TableHead>
                                       <TableHead>核心产业</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overviewData.parks.map((park, index) => (
                    <TableRow key={park.id}>
                      <TableCell><Input value={park.name} onChange={(e) => {
                        const newParks = [...overviewData.parks];
                        newParks[index].name = e.target.value;
                        updateOverview('parks', newParks);
                      }} /></TableCell>
                      <TableCell><Input value={park.area} onChange={(e) => {
                        const newParks = [...overviewData.parks];
                        newParks[index].area = e.target.value;
                        updateOverview('parks', newParks);
                      }} /></TableCell>
                      <TableCell><Input value={park.coreIndustry} onChange={(e) => {
                        const newParks = [...overviewData.parks];
                        newParks[index].coreIndustry = e.target.value;
                        updateOverview('parks', newParks);
                      }} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                          const newParks = [...overviewData.parks];
                          newParks.splice(index, 1);
                          updateOverview('parks', newParks);
                        }}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

          {/* 4. Cameras */}
          <AccordionItem value="cameras" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-slate-600" />
                <span className="text-lg font-medium">园区风光 (摄像头配置)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="flex justify-end mb-4">
                <Button variant="outline" size="sm" onClick={() => {
                  updateOverview('cameras', [...overviewData.cameras, { id: `c-${Date.now()}`, name: '新摄像头', url: '' }]);
                }}><Plus className="w-4 h-4 mr-2" />添加摄像头</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>摄像头名称</TableHead>
                    <TableHead>视频流地址/ID</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overviewData.cameras.map((cam, index) => (
                    <TableRow key={cam.id}>
                      <TableCell><Input value={cam.name} onChange={(e) => {
                        const newCams = [...overviewData.cameras];
                        newCams[index].name = e.target.value;
                        updateOverview('cameras', newCams);
                      }} /></TableCell>
                      <TableCell><Input value={cam.url} placeholder="rtsp://..." onChange={(e) => {
                        const newCams = [...overviewData.cameras];
                        newCams[index].url = e.target.value;
                        updateOverview('cameras', newCams);
                      }} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                          const newCams = [...overviewData.cameras];
                          newCams.splice(index, 1);
                          updateOverview('cameras', newCams);
                        }}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>

          {/* 5. Energy Consumption */}
          <AccordionItem value="energy" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-medium">用能情况统计 (左下)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>年份/时间</TableHead>
                    <TableHead>用水量 (万立方)</TableHead>
                    <TableHead>用电量 (kWh)</TableHead>
                    <TableHead>用气量 (万立方)</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overviewData.energyStats.map((stat, index) => (
                    <TableRow key={stat.id}>
                      <TableCell><Input value={stat.year} onChange={(e) => {
                        const newStats = [...overviewData.energyStats];
                        newStats[index].year = e.target.value;
                        updateOverview('energyStats', newStats);
                      }} /></TableCell>
                      <TableCell><Input type="number" value={stat.water} onChange={(e) => {
                        const newStats = [...overviewData.energyStats];
                        newStats[index].water = e.target.value;
                        updateOverview('energyStats', newStats);
                      }} /></TableCell>
                      <TableCell><Input type="number" value={stat.electricity} onChange={(e) => {
                        const newStats = [...overviewData.energyStats];
                        newStats[index].electricity = e.target.value;
                        updateOverview('energyStats', newStats);
                      }} /></TableCell>
                      <TableCell><Input type="number" value={stat.gas} onChange={(e) => {
                        const newStats = [...overviewData.energyStats];
                        newStats[index].gas = e.target.value;
                        updateOverview('energyStats', newStats);
                      }} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                          const newStats = [...overviewData.energyStats];
                          newStats.splice(index, 1);
                          updateOverview('energyStats', newStats);
                        }}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="mt-4 w-full" onClick={() => {
                updateOverview('energyStats', [...overviewData.energyStats, { id: `es-${Date.now()}`, year: '2026', water: '0', electricity: '0', gas: '0' }]);
              }}><Plus className="w-4 h-4 mr-2" />添加年份数据</Button>
            </AccordionContent>
          </AccordionItem>

          {/* 6. Right Panel Charts */}
          <AccordionItem value="right-charts" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-medium">右侧产业与统计数据</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-8">
              
              {/* Industry Layout */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2">产业布局统计分析 (圆环图)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>产业名称</TableHead>
                      <TableHead>数值/占比</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overviewData.industryLayout.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell><Input value={item.name} onChange={(e) => {
                          const newData = [...overviewData.industryLayout];
                          newData[index].name = e.target.value;
                          updateOverview('industryLayout', newData);
                        }} /></TableCell>
                        <TableCell><Input type="number" value={item.value} onChange={(e) => {
                          const newData = [...overviewData.industryLayout];
                          newData[index].value = e.target.value;
                          updateOverview('industryLayout', newData);
                        }} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                            const newData = [...overviewData.industryLayout];
                            newData.splice(index, 1);
                            updateOverview('industryLayout', newData);
                          }}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outline" size="sm" onClick={() => updateOverview('industryLayout', [...overviewData.industryLayout, { id: `il-${Date.now()}`, name: '新产业', value: '0' }])}>添加产业</Button>
              </div>

              {/* Eye Industry */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2">眼镜产业情况</h3>
                <div className="grid grid-cols-2 gap-4">
                  {overviewData.eyeIndustry.stats.map((stat, idx) => (
                    <div key={stat.id} className="flex gap-2 items-center">
                       <span className="text-sm w-20 text-right">{stat.name}:</span>
                       <Input className="w-24" value={stat.value} onChange={(e) => {
                         const newStats = [...overviewData.eyeIndustry.stats];
                         newStats[idx].value = e.target.value;
                         updateOverview('eyeIndustry', { ...overviewData.eyeIndustry, stats: newStats });
                       }} />
                       <span className="text-sm text-slate-500">{stat.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ag Industry */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2">农副产品加工产业情况</h3>
                <div className="grid grid-cols-2 gap-4">
                  {overviewData.agIndustry.stats.map((stat, idx) => (
                    <div key={stat.id} className="flex gap-2 items-center">
                       <span className="text-sm w-20 text-right">{stat.name}:</span>
                       <Input className="w-24" value={stat.value} onChange={(e) => {
                         const newStats = [...overviewData.agIndustry.stats];
                         newStats[idx].value = e.target.value;
                         updateOverview('agIndustry', { ...overviewData.agIndustry, stats: newStats });
                       }} />
                       <span className="text-sm text-slate-500">{stat.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise Types */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2">企业类型 (圆环图)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>类型名称</TableHead>
                      <TableHead>数值/家数</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overviewData.enterpriseTypes.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell><Input value={item.name} onChange={(e) => {
                          const newData = [...overviewData.enterpriseTypes];
                          newData[index].name = e.target.value;
                          updateOverview('enterpriseTypes', newData);
                        }} /></TableCell>
                        <TableCell><Input type="number" value={item.value} onChange={(e) => {
                          const newData = [...overviewData.enterpriseTypes];
                          newData[index].value = e.target.value;
                          updateOverview('enterpriseTypes', newData);
                        }} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                            const newData = [...overviewData.enterpriseTypes];
                            newData.splice(index, 1);
                            updateOverview('enterpriseTypes', newData);
                          }}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outline" size="sm" onClick={() => updateOverview('enterpriseTypes', [...overviewData.enterpriseTypes, { id: `et-${Date.now()}`, name: '新类型', value: '0' }])}>添加类型</Button>
              </div>

              {/* Product Output */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2">产品产量统计 (折线图)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>产品名称</TableHead>
                      <TableHead>产量 (KG)</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overviewData.productOutput.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell><Input value={item.name} onChange={(e) => {
                          const newData = [...overviewData.productOutput];
                          newData[index].name = e.target.value;
                          updateOverview('productOutput', newData);
                        }} /></TableCell>
                        <TableCell><Input type="number" value={item.value} onChange={(e) => {
                          const newData = [...overviewData.productOutput];
                          newData[index].value = e.target.value;
                          updateOverview('productOutput', newData);
                        }} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                            const newData = [...overviewData.productOutput];
                            newData.splice(index, 1);
                            updateOverview('productOutput', newData);
                          }}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button variant="outline" size="sm" onClick={() => updateOverview('productOutput', [...overviewData.productOutput, { id: `po-${Date.now()}`, name: '新产品', value: '0' }])}>添加产品</Button>
              </div>

            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  // --- Assets Render Component ---
  const renderAssetsSettings = () => {
    return <AssetsSettings value={assetsData} onChange={setAssetsData} />;
  };

  const renderAssetsSettingsLegacy = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">资产管理页面配置</h2>
          <Button onClick={handleSaveAssets} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
            <Save className="w-4 h-4 mr-2" />
            保存全部配置
          </Button>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="land-use">
          {/* 1. Land Use Situation */}
          <AccordionItem value="land-use" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-medium">用地情况 (左上)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>指标名称</TableHead>
                    <TableHead>数值</TableHead>
                    <TableHead>单位</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetsData.landUse.metrics.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell><Input value={item.name} onChange={(e) => {
                        const newData = [...assetsData.landUse.metrics];
                        newData[index].name = e.target.value;
                        updateAssets('landUse', { ...assetsData.landUse, metrics: newData });
                      }} /></TableCell>
                      <TableCell><Input value={item.value} onChange={(e) => {
                        const newData = [...assetsData.landUse.metrics];
                        newData[index].value = e.target.value;
                        updateAssets('landUse', { ...assetsData.landUse, metrics: newData });
                      }} /></TableCell>
                      <TableCell><Input value={item.unit} onChange={(e) => {
                        const newData = [...assetsData.landUse.metrics];
                        newData[index].unit = e.target.value;
                        updateAssets('landUse', { ...assetsData.landUse, metrics: newData });
                      }} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                          const newData = [...assetsData.landUse.metrics];
                          newData.splice(index, 1);
                          updateAssets('landUse', { ...assetsData.landUse, metrics: newData });
                        }}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="mt-4" onClick={() => {
                updateAssets('landUse', { ...assetsData.landUse, metrics: [...assetsData.landUse.metrics, { id: `lu-${Date.now()}`, name: '新指标', value: '0', unit: '' }] });
              }}><Plus className="w-4 h-4 mr-2" />添加指标</Button>
            </AccordionContent>
          </AccordionItem>

          {/* 2. Construction Land */}
          <AccordionItem value="construction-land" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-600" />
                <span className="text-lg font-medium">建设用地 (左中上)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium w-32">总面积(亩):</label>
                <Input className="w-48" value={assetsData.constructionLand.totalArea} onChange={(e) => {
                  updateAssets('constructionLand', { ...assetsData.constructionLand, totalArea: e.target.value });
                }} />
                <label className="font-medium w-32">占总数量(%):</label>
                <Input className="w-48" value={assetsData.constructionLand.percentage} onChange={(e) => {
                  updateAssets('constructionLand', { ...assetsData.constructionLand, percentage: e.target.value });
                }} />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用地类型</TableHead>
                    <TableHead>面积</TableHead>
                    <TableHead>占比</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetsData.constructionLand.items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell><Input value={item.name} onChange={(e) => {
                        const newItems = [...assetsData.constructionLand.items];
                        newItems[index].name = e.target.value;
                        updateAssets('constructionLand', { ...assetsData.constructionLand, items: newItems });
                      }} /></TableCell>
                      <TableCell><Input value={item.value} onChange={(e) => {
                        const newItems = [...assetsData.constructionLand.items];
                        newItems[index].value = e.target.value;
                        updateAssets('constructionLand', { ...assetsData.constructionLand, items: newItems });
                      }} /></TableCell>
                      <TableCell><Input value={item.percentage} onChange={(e) => {
                        const newItems = [...assetsData.constructionLand.items];
                        newItems[index].percentage = e.target.value;
                        updateAssets('constructionLand', { ...assetsData.constructionLand, items: newItems });
                      }} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                          const newItems = [...assetsData.constructionLand.items];
                          newItems.splice(index, 1);
                          updateAssets('constructionLand', { ...assetsData.constructionLand, items: newItems });
                        }}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" onClick={() => {
                const newItems = [...assetsData.constructionLand.items, { id: `cl-${Date.now()}`, name: '新类型', value: '0', percentage: '0%' }];
                updateAssets('constructionLand', { ...assetsData.constructionLand, items: newItems });
              }}><Plus className="w-4 h-4 mr-2" />添加类型</Button>
            </AccordionContent>
          </AccordionItem>

          {/* 3. Planning & Construction Trends */}
          <AccordionItem value="planning-trend" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span className="text-lg font-medium">规划建设趋势 (左中下)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
              <div className="space-y-4 border p-4 rounded bg-slate-50">
                <h4 className="font-semibold">规划用地</h4>
                <div className="flex items-center gap-4">
                  <label className="font-medium w-24">总面积(亩):</label>
                  <Input className="w-40" value={assetsData.planningTrend.planning.area} onChange={(e) => {
                    updateAssets('planningTrend', { ...assetsData.planningTrend, planning: { ...assetsData.planningTrend.planning, area: e.target.value } });
                  }} />
                  <label className="font-medium w-24">占总数量(%):</label>
                  <Input className="w-40" value={assetsData.planningTrend.planning.percentage} onChange={(e) => {
                    updateAssets('planningTrend', { ...assetsData.planningTrend, planning: { ...assetsData.planningTrend.planning, percentage: e.target.value } });
                  }} />
                </div>
              </div>
              <div className="space-y-4 border p-4 rounded bg-slate-50">
                <h4 className="font-semibold">已建城区面积</h4>
                <div className="flex items-center gap-4">
                  <label className="font-medium w-24">总面积(亩):</label>
                  <Input className="w-40" value={assetsData.planningTrend.built.area} onChange={(e) => {
                    updateAssets('planningTrend', { ...assetsData.planningTrend, built: { ...assetsData.planningTrend.built, area: e.target.value } });
                  }} />
                  <label className="font-medium w-24">占总数量(%):</label>
                  <Input className="w-40" value={assetsData.planningTrend.built.percentage} onChange={(e) => {
                    updateAssets('planningTrend', { ...assetsData.planningTrend, built: { ...assetsData.planningTrend.built, percentage: e.target.value } });
                  }} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 4. Planning Area Trend */}
          <AccordionItem value="planning-area-trend" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-teal-600" />
                <span className="text-lg font-medium">规划面积趋势 (左下)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>年份</TableHead>
                    <TableHead>规划用地</TableHead>
                    <TableHead>已建城区</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetsData.planningAreaTrend.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell><Input value={item.year} onChange={(e) => {
                        const newData = [...assetsData.planningAreaTrend];
                        newData[index].year = e.target.value;
                        updateAssets('planningAreaTrend', newData);
                      }} /></TableCell>
                      <TableCell><Input value={item.planning} onChange={(e) => {
                        const newData = [...assetsData.planningAreaTrend];
                        newData[index].planning = e.target.value;
                        updateAssets('planningAreaTrend', newData);
                      }} /></TableCell>
                      <TableCell><Input value={item.built} onChange={(e) => {
                        const newData = [...assetsData.planningAreaTrend];
                        newData[index].built = e.target.value;
                        updateAssets('planningAreaTrend', newData);
                      }} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                          const newData = [...assetsData.planningAreaTrend];
                          newData.splice(index, 1);
                          updateAssets('planningAreaTrend', newData);
                        }}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="mt-4" onClick={() => {
                updateAssets('planningAreaTrend', [...assetsData.planningAreaTrend, { id: `pat-${Date.now()}`, year: '2026', planning: '0', built: '0' }]);
              }}><Plus className="w-4 h-4 mr-2" />添加年份数据</Button>
            </AccordionContent>
          </AccordionItem>

          {/* 5. House Rental */}
          <AccordionItem value="house-rental" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-medium">房屋出租 (右上)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <div className="space-y-4 border p-4 rounded bg-slate-50">
                <h4 className="font-semibold">已出租房屋</h4>
                <div className="flex items-center gap-4">
                  <label className="font-medium w-24">总数(间):</label>
                  <Input className="w-40" value={assetsData.leasedHouses.total} onChange={(e) => {
                    updateAssets('leasedHouses', { ...assetsData.leasedHouses, total: e.target.value });
                  }} />
                  <label className="font-medium w-24">出租率(%):</label>
                  <Input className="w-40" value={assetsData.leasedHouses.rate} onChange={(e) => {
                    updateAssets('leasedHouses', { ...assetsData.leasedHouses, rate: e.target.value });
                  }} />
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>指标名称</TableHead>
                    <TableHead>数值</TableHead>
                    <TableHead>单位</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetsData.houseRental.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell><Input value={item.name} onChange={(e) => {
                        const newData = [...assetsData.houseRental];
                        newData[index].name = e.target.value;
                        updateAssets('houseRental', newData);
                      }} /></TableCell>
                      <TableCell><Input value={item.value} onChange={(e) => {
                        const newData = [...assetsData.houseRental];
                        newData[index].value = e.target.value;
                        updateAssets('houseRental', newData);
                      }} /></TableCell>
                      <TableCell><Input value={item.unit} onChange={(e) => {
                        const newData = [...assetsData.houseRental];
                        newData[index].unit = e.target.value;
                        updateAssets('houseRental', newData);
                      }} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                          const newData = [...assetsData.houseRental];
                          newData.splice(index, 1);
                          updateAssets('houseRental', newData);
                        }}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="mt-4" onClick={() => {
                updateAssets('houseRental', [...assetsData.houseRental, { id: `hr-${Date.now()}`, name: '新指标', value: '0', unit: '%' }]);
              }}><Plus className="w-4 h-4 mr-2" />添加指标</Button>
            </AccordionContent>
          </AccordionItem>

          {/* 6. Tenant Analysis (Chart) */}
          <AccordionItem value="tenant-analysis" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-pink-600" />
                <span className="text-lg font-medium">租户分析 (右中)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>类型名称</TableHead>
                    <TableHead>数值</TableHead>
                    <TableHead>占比</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetsData.tenantAnalysis.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell><Input value={item.name} onChange={(e) => {
                        const newData = [...assetsData.tenantAnalysis];
                        newData[index].name = e.target.value;
                        updateAssets('tenantAnalysis', newData);
                      }} /></TableCell>
                      <TableCell><Input value={item.value} onChange={(e) => {
                        const newData = [...assetsData.tenantAnalysis];
                        newData[index].value = e.target.value;
                        updateAssets('tenantAnalysis', newData);
                      }} /></TableCell>
                      <TableCell><Input value={item.percentage} onChange={(e) => {
                        const newData = [...assetsData.tenantAnalysis];
                        newData[index].percentage = e.target.value;
                        updateAssets('tenantAnalysis', newData);
                      }} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                          const newData = [...assetsData.tenantAnalysis];
                          newData.splice(index, 1);
                          updateAssets('tenantAnalysis', newData);
                        }}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="mt-4" onClick={() => {
                updateAssets('tenantAnalysis', [...assetsData.tenantAnalysis, { id: `ta-${Date.now()}`, name: '新类型', value: '0', percentage: '0%' }]);
              }}><Plus className="w-4 h-4 mr-2" />添加类型</Button>
            </AccordionContent>
          </AccordionItem>

          {/* 7. Tenant Analysis (Table) */}
          <AccordionItem value="tenant-table" className="border rounded-lg bg-white px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                <span className="text-lg font-medium">租户分析表格 (右下)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>地块名称</TableHead>
                    <TableHead>土地面积(公顷)</TableHead>
                    <TableHead>土地出让状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetsData.tenantTable.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell><Input value={item.name} onChange={(e) => {
                        const newData = [...assetsData.tenantTable];
                        newData[index].name = e.target.value;
                        updateAssets('tenantTable', newData);
                      }} /></TableCell>
                      <TableCell><Input value={item.area} onChange={(e) => {
                        const newData = [...assetsData.tenantTable];
                        newData[index].area = e.target.value;
                        updateAssets('tenantTable', newData);
                      }} /></TableCell>
                      <TableCell><Input value={item.status} onChange={(e) => {
                        const newData = [...assetsData.tenantTable];
                        newData[index].status = e.target.value;
                        updateAssets('tenantTable', newData);
                      }} /></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                          const newData = [...assetsData.tenantTable];
                          newData.splice(index, 1);
                          updateAssets('tenantTable', newData);
                        }}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="mt-4" onClick={() => {
                updateAssets('tenantTable', [...assetsData.tenantTable, { id: `tt-${Date.now()}`, name: '新地块', area: '0', status: '已出让' }]);
              }}><Plus className="w-4 h-4 mr-2" />添加地块</Button>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    );
  };

  // --- Investment Render Component ---
  const renderInvestmentSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">招商引资页面管理</h2>
          <Button onClick={handleSaveInvestment} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
            <Save className="w-4 h-4 mr-2" />
            保存全部配置
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Left Section Config */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-bold border-l-4 border-blue-600 pl-2">左侧指标配置 (Left Section)</CardTitle>
              <CardDescription>配置大屏左侧的招商概览、项目阶段和规模数据</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* 1. Investment Overview */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2">1. 招商概览 (Top)</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">招商投资额 (亿元)</label>
                    <Input className="w-48" value={investmentData.overview.investmentAmount} onChange={(e) => {
                      updateInvestment('overview', { ...investmentData.overview, investmentAmount: e.target.value });
                    }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">合同总产值 (亿元)</label>
                    <Input className="w-48" value={investmentData.overview.contractValue} onChange={(e) => {
                      updateInvestment('overview', { ...investmentData.overview, contractValue: e.target.value });
                    }} />
                  </div>
                </div>
              </div>

              {/* 2. Project Stage Statistics */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2">2. 项目阶段统计 (Middle)</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-4 text-sm font-medium">重点在谈项目</label>
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500">数量</span>
                      <Input value={investmentData.projectStage.negotiating.count} onChange={(e) => {
                        updateInvestment('projectStage', { ...investmentData.projectStage, negotiating: { ...investmentData.projectStage.negotiating, count: e.target.value } });
                      }} />
                    </div>
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500">占比</span>
                      <Input value={investmentData.projectStage.negotiating.ratio} onChange={(e) => {
                        updateInvestment('projectStage', { ...investmentData.projectStage, negotiating: { ...investmentData.projectStage.negotiating, ratio: e.target.value } });
                      }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-4 text-sm font-medium">已签约项目</label>
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500">数量</span>
                      <Input value={investmentData.projectStage.signed.count} onChange={(e) => {
                        updateInvestment('projectStage', { ...investmentData.projectStage, signed: { ...investmentData.projectStage.signed, count: e.target.value } });
                      }} />
                    </div>
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500">占比</span>
                      <Input value={investmentData.projectStage.signed.ratio} onChange={(e) => {
                        updateInvestment('projectStage', { ...investmentData.projectStage, signed: { ...investmentData.projectStage.signed, ratio: e.target.value } });
                      }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Investment Project Scale */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2">3. 招商项目规模 (Bottom)</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-4 text-sm font-medium">1-10亿</label>
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500">家数</span>
                      <Input value={investmentData.projectScale.scale1to10.count} onChange={(e) => {
                        updateInvestment('projectScale', { ...investmentData.projectScale, scale1to10: { ...investmentData.projectScale.scale1to10, count: e.target.value } });
                      }} />
                    </div>
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500">占比</span>
                      <Input value={investmentData.projectScale.scale1to10.ratio} onChange={(e) => {
                        updateInvestment('projectScale', { ...investmentData.projectScale, scale1to10: { ...investmentData.projectScale.scale1to10, ratio: e.target.value } });
                      }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-4 text-sm font-medium">10-30亿</label>
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500">家数</span>
                      <Input value={investmentData.projectScale.scale10to30.count} onChange={(e) => {
                        updateInvestment('projectScale', { ...investmentData.projectScale, scale10to30: { ...investmentData.projectScale.scale10to30, count: e.target.value } });
                      }} />
                    </div>
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500">占比</span>
                      <Input value={investmentData.projectScale.scale10to30.ratio} onChange={(e) => {
                        updateInvestment('projectScale', { ...investmentData.projectScale, scale10to30: { ...investmentData.projectScale.scale10to30, ratio: e.target.value } });
                      }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <label className="col-span-4 text-sm font-medium">30亿以上</label>
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500">家数</span>
                      <Input value={investmentData.projectScale.scaleOver30.count} onChange={(e) => {
                        updateInvestment('projectScale', { ...investmentData.projectScale, scaleOver30: { ...investmentData.projectScale.scaleOver30, count: e.target.value } });
                      }} />
                    </div>
                    <div className="col-span-4 flex items-center gap-2">
                      <span className="text-xs text-slate-500">占比</span>
                      <Input value={investmentData.projectScale.scaleOver30.ratio} onChange={(e) => {
                        updateInvestment('projectScale', { ...investmentData.projectScale, scaleOver30: { ...investmentData.projectScale.scaleOver30, ratio: e.target.value } });
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Card 2: Right Section Config A */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold border-l-4 border-purple-600 pl-2">右侧近期成果与产业链 (Right Section A)</CardTitle>
                <CardDescription>配置近期招商成果与产业链数据</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* 1. Recent Results */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700 border-b pb-2">1. 近期招商成果统计 (Top)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">招商项目数量</label>
                      <Input value={investmentData.recentResults.count} onChange={(e) => {
                        updateInvestment('recentResults', { ...investmentData.recentResults, count: e.target.value });
                      }} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">增长率</label>
                      <Input value={investmentData.recentResults.growth} onChange={(e) => {
                        updateInvestment('recentResults', { ...investmentData.recentResults, growth: e.target.value });
                      }} />
                    </div>
                  </div>
                </div>

                {/* 2. Industry Chain Management */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="font-semibold text-slate-700">2. 招商产业链管理 (Middle)</h3>
                    <Button variant="outline" size="sm" onClick={() => {
                      updateInvestment('industryChains', [...investmentData.industryChains, { id: `ic-${Date.now()}`, name: '新产业链', status: '', rate: '' }]);
                    }}><Plus className="w-4 h-4 mr-2" />添加产业链</Button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>产业链名称</TableHead>
                          <TableHead>完成情况</TableHead>
                          <TableHead>完成率</TableHead>
                          <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {investmentData.industryChains.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell><Input value={item.name} onChange={(e) => {
                              const newData = [...investmentData.industryChains];
                              newData[index].name = e.target.value;
                              updateInvestment('industryChains', newData);
                            }} /></TableCell>
                            <TableCell><Input value={item.status} onChange={(e) => {
                              const newData = [...investmentData.industryChains];
                              newData[index].status = e.target.value;
                              updateInvestment('industryChains', newData);
                            }} /></TableCell>
                            <TableCell><Input value={item.rate} onChange={(e) => {
                              const newData = [...investmentData.industryChains];
                              newData[index].rate = e.target.value;
                              updateInvestment('industryChains', newData);
                            }} /></TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                                const newData = [...investmentData.industryChains];
                                newData.splice(index, 1);
                                updateInvestment('industryChains', newData);
                              }}><Trash2 className="w-4 h-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Right Section Config B */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold border-l-4 border-green-600 pl-2">签约概览配置 (Right Section B)</CardTitle>
                <CardDescription>配置“签约”后的项目转化情况，层级结构非常重要</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Level 1: Un-Kai2 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">未开2 (Un-Kai2) - 数量</label>
                    <Input value={investmentData.signingOverview.notStarted} onChange={(e) => {
                      updateInvestment('signingOverview', { ...investmentData.signingOverview, notStarted: e.target.value });
                    }} />
                  </div>

                  {/* Level 1: Kai-2 (Container) */}
                  <div className="rounded-lg border-2 border-green-100 bg-green-50/50 p-4 space-y-6">
                    <div className="flex items-center justify-between border-b border-green-200 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <h3 className="text-base font-bold text-green-800">开2 (Kai-2) - 重要指标</h3>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-sm text-green-700">数量:</span>
                         <Input className="w-32 bg-white border-green-200 focus-visible:ring-green-500 h-8" value={investmentData.signingOverview.started} onChange={(e) => {
                          updateInvestment('signingOverview', { ...investmentData.signingOverview, started: e.target.value });
                        }} />
                      </div>
                    </div>

                    {/* Level 2: Nested under Kai-2 */}
                    <div className="grid grid-cols-2 gap-4 pl-4">
                      {/* Not In Production */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-600">未投产 (数量)</label>
                        <Input className="bg-white" value={investmentData.signingOverview.notInProduction} onChange={(e) => {
                          updateInvestment('signingOverview', { ...investmentData.signingOverview, notInProduction: e.target.value });
                        }} />
                      </div>

                      {/* In Production (Highlight) */}
                      <div className="space-y-2 relative">
                        <label className="text-sm font-bold text-blue-700 flex items-center gap-2">
                          投产 (重要指标)
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded border border-blue-200">CORE</span>
                        </label>
                        <Input className="bg-white border-blue-200 focus-visible:ring-blue-500" value={investmentData.signingOverview.inProduction} onChange={(e) => {
                          updateInvestment('signingOverview', { ...investmentData.signingOverview, inProduction: e.target.value });
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  // --- Projects Render Component ---
  const renderProjectsSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">建设项目页面管理</h2>
          <Button onClick={handleSaveProjects} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
            <Save className="w-4 h-4 mr-2" />
            保存全部配置
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Card A: Project Nature Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold border-l-4 border-blue-600 pl-2">项目性质统计 (Top)</CardTitle>
                <CardDescription>配置项目总数与性质分布</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">项目总数</label>
                  <Input className="w-32" value={projectsData.nature.total} onChange={(e) => {
                    updateProjects('nature', { ...projectsData.nature, total: e.target.value });
                  }} />
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-sm font-medium">续建项目</label>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">数量</span>
                    <Input value={projectsData.nature.continued.count} onChange={(e) => {
                      updateProjects('nature', { ...projectsData.nature, continued: { ...projectsData.nature.continued, count: e.target.value } });
                    }} />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">占比</span>
                    <Input value={projectsData.nature.continued.ratio} onChange={(e) => {
                      updateProjects('nature', { ...projectsData.nature, continued: { ...projectsData.nature.continued, ratio: e.target.value } });
                    }} />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-sm font-medium">改扩建项目</label>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">数量</span>
                    <Input value={projectsData.nature.expansion.count} onChange={(e) => {
                      updateProjects('nature', { ...projectsData.nature, expansion: { ...projectsData.nature.expansion, count: e.target.value } });
                    }} />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">占比</span>
                    <Input value={projectsData.nature.expansion.ratio} onChange={(e) => {
                      updateProjects('nature', { ...projectsData.nature, expansion: { ...projectsData.nature.expansion, ratio: e.target.value } });
                    }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card B: Project Scale Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold border-l-4 border-cyan-600 pl-2">项目规模分布 (Middle)</CardTitle>
                <CardDescription>配置不同规模项目的分布情况</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-sm font-medium">一亿以下</label>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">家数</span>
                    <Input value={projectsData.scale.below100M.count} onChange={(e) => {
                      updateProjects('scale', { ...projectsData.scale, below100M: { ...projectsData.scale.below100M, count: e.target.value } });
                    }} />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">占比</span>
                    <Input value={projectsData.scale.below100M.ratio} onChange={(e) => {
                      updateProjects('scale', { ...projectsData.scale, below100M: { ...projectsData.scale.below100M, ratio: e.target.value } });
                    }} />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-sm font-medium">一亿到五亿</label>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">家数</span>
                    <Input value={projectsData.scale.between100And500M.count} onChange={(e) => {
                      updateProjects('scale', { ...projectsData.scale, between100And500M: { ...projectsData.scale.between100And500M, count: e.target.value } });
                    }} />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">占比</span>
                    <Input value={projectsData.scale.between100And500M.ratio} onChange={(e) => {
                      updateProjects('scale', { ...projectsData.scale, between100And500M: { ...projectsData.scale.between100And500M, ratio: e.target.value } });
                    }} />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-sm font-medium">五亿到十亿</label>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">家数</span>
                    <Input value={projectsData.scale.between500And1000M.count} onChange={(e) => {
                      updateProjects('scale', { ...projectsData.scale, between500And1000M: { ...projectsData.scale.between500And1000M, count: e.target.value } });
                    }} />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">占比</span>
                    <Input value={projectsData.scale.between500And1000M.ratio} onChange={(e) => {
                      updateProjects('scale', { ...projectsData.scale, between500And1000M: { ...projectsData.scale.between500And1000M, ratio: e.target.value } });
                    }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card C: Project Classification Statistics */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold border-l-4 border-indigo-600 pl-2">项目分类统计 (Bottom)</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => {
                    updateProjects('classification', [...projectsData.classification, { id: `pc-${Date.now()}`, name: '新分类', count: '0' }]);
                  }}><Plus className="w-4 h-4 mr-2" />添加分类</Button>
                </div>
                <CardDescription>统计不同类型的项目数量</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>分类名称</TableHead>
                      <TableHead>项目数量</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectsData.classification.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell><Input value={item.name} onChange={(e) => {
                          const newData = [...projectsData.classification];
                          newData[index].name = e.target.value;
                          updateProjects('classification', newData);
                        }} /></TableCell>
                        <TableCell><Input value={item.count} onChange={(e) => {
                          const newData = [...projectsData.classification];
                          newData[index].count = e.target.value;
                          updateProjects('classification', newData);
                        }} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                            const newData = [...projectsData.classification];
                            newData.splice(index, 1);
                            updateProjects('classification', newData);
                          }}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Card D: Completed Investment Amount */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold border-l-4 border-orange-600 pl-2">完成投资额 (Top)</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => {
                    updateProjects('completedInvestment', [...projectsData.completedInvestment, { id: `ci-${Date.now()}`, name: '新分类', amount: '0' }]);
                  }}><Plus className="w-4 h-4 mr-2" />添加分类</Button>
                </div>
                <CardDescription>统计各分类项目的已投入资金</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>分类名称</TableHead>
                      <TableHead>投资金额 (亿元/万元)</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectsData.completedInvestment.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell><Input value={item.name} onChange={(e) => {
                          const newData = [...projectsData.completedInvestment];
                          newData[index].name = e.target.value;
                          updateProjects('completedInvestment', newData);
                        }} /></TableCell>
                        <TableCell><Input value={item.amount} onChange={(e) => {
                          const newData = [...projectsData.completedInvestment];
                          newData[index].amount = e.target.value;
                          updateProjects('completedInvestment', newData);
                        }} /></TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                            const newData = [...projectsData.completedInvestment];
                            newData.splice(index, 1);
                            updateProjects('completedInvestment', newData);
                          }}><Trash2 className="w-4 h-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Card E: Continued Project Stage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold border-l-4 border-green-600 pl-2">续建项目阶段统计 (Middle)</CardTitle>
                <CardDescription>配置续建项目的进度分布</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-sm font-medium">未开工</label>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">数量</span>
                    <Input value={projectsData.continuedStage.notStarted.count} onChange={(e) => {
                      updateProjects('continuedStage', { ...projectsData.continuedStage, notStarted: { ...projectsData.continuedStage.notStarted, count: e.target.value } });
                    }} />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">占比</span>
                    <Input value={projectsData.continuedStage.notStarted.ratio} onChange={(e) => {
                      updateProjects('continuedStage', { ...projectsData.continuedStage, notStarted: { ...projectsData.continuedStage.notStarted, ratio: e.target.value } });
                    }} />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-sm font-medium">建设中</label>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">数量</span>
                    <Input value={projectsData.continuedStage.underConstruction.count} onChange={(e) => {
                      updateProjects('continuedStage', { ...projectsData.continuedStage, underConstruction: { ...projectsData.continuedStage.underConstruction, count: e.target.value } });
                    }} />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">占比</span>
                    <Input value={projectsData.continuedStage.underConstruction.ratio} onChange={(e) => {
                      updateProjects('continuedStage', { ...projectsData.continuedStage, underConstruction: { ...projectsData.continuedStage.underConstruction, ratio: e.target.value } });
                    }} />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-sm font-medium">已竣工</label>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">数量</span>
                    <Input value={projectsData.continuedStage.completed.count} onChange={(e) => {
                      updateProjects('continuedStage', { ...projectsData.continuedStage, completed: { ...projectsData.continuedStage.completed, count: e.target.value } });
                    }} />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">占比</span>
                    <Input value={projectsData.continuedStage.completed.ratio} onChange={(e) => {
                      updateProjects('continuedStage', { ...projectsData.continuedStage, completed: { ...projectsData.continuedStage.completed, ratio: e.target.value } });
                    }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card F: Expansion Project Stage */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold border-l-4 border-purple-600 pl-2">改扩建项目阶段统计 (Bottom)</CardTitle>
                <CardDescription>配置改扩建项目的进度分布</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-sm font-medium">未开工</label>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">数量</span>
                    <Input value={projectsData.expansionStage.notStarted.count} onChange={(e) => {
                      updateProjects('expansionStage', { ...projectsData.expansionStage, notStarted: { ...projectsData.expansionStage.notStarted, count: e.target.value } });
                    }} />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">占比</span>
                    <Input value={projectsData.expansionStage.notStarted.ratio} onChange={(e) => {
                      updateProjects('expansionStage', { ...projectsData.expansionStage, notStarted: { ...projectsData.expansionStage.notStarted, ratio: e.target.value } });
                    }} />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-sm font-medium">建设中</label>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">数量</span>
                    <Input value={projectsData.expansionStage.underConstruction.count} onChange={(e) => {
                      updateProjects('expansionStage', { ...projectsData.expansionStage, underConstruction: { ...projectsData.expansionStage.underConstruction, count: e.target.value } });
                    }} />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">占比</span>
                    <Input value={projectsData.expansionStage.underConstruction.ratio} onChange={(e) => {
                      updateProjects('expansionStage', { ...projectsData.expansionStage, underConstruction: { ...projectsData.expansionStage.underConstruction, ratio: e.target.value } });
                    }} />
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 items-center">
                  <label className="col-span-4 text-sm font-medium">已竣工</label>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">数量</span>
                    <Input value={projectsData.expansionStage.completed.count} onChange={(e) => {
                      updateProjects('expansionStage', { ...projectsData.expansionStage, completed: { ...projectsData.expansionStage.completed, count: e.target.value } });
                    }} />
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-xs text-slate-500">占比</span>
                    <Input value={projectsData.expansionStage.completed.ratio} onChange={(e) => {
                      updateProjects('expansionStage', { ...projectsData.expansionStage, completed: { ...projectsData.expansionStage.completed, ratio: e.target.value } });
                    }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderServicesSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={handleSaveServices} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Save className="h-4 w-4" />
            保存配置
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Card 1: Enterprise Classification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold border-l-4 border-blue-600 pl-2">企业分类数据配置</CardTitle>
                <CardDescription>配置重点产业企业列表及数量</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {servicesData.classification.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-start border-b pb-4 last:border-0">
                      <div className="col-span-3 space-y-1">
                        <label className="text-xs text-slate-500">产业名称</label>
                        <Input 
                          value={item.industryName} 
                          onChange={(e) => {
                            const newItems = [...servicesData.classification];
                            newItems[index].industryName = e.target.value;
                            updateServices('classification', newItems);
                          }} 
                          placeholder="如：眼镜重点企业"
                        />
                      </div>
                      <div className="col-span-6 space-y-1">
                        <label className="text-xs text-slate-500">企业列表</label>
                        <Textarea 
                          value={item.enterpriseList} 
                          onChange={(e) => {
                            const newItems = [...servicesData.classification];
                            newItems[index].enterpriseList = e.target.value;
                            updateServices('classification', newItems);
                          }} 
                          placeholder="输入企业名称，用逗号分隔"
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-xs text-slate-500">数量</label>
                        <Input 
                          value={item.count} 
                          onChange={(e) => {
                            const newItems = [...servicesData.classification];
                            newItems[index].count = e.target.value;
                            updateServices('classification', newItems);
                          }} 
                        />
                      </div>
                      <div className="col-span-1 flex items-center justify-center pt-6">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const newItems = servicesData.classification.filter((_, i) => i !== index);
                            updateServices('classification', newItems);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-dashed text-slate-500 hover:text-blue-600 hover:border-blue-600"
                          onClick={() => {
                            updateServices('classification', [
                              ...servicesData.classification, 
                              { id: `ec-${Date.now()}`, industryName: '', enterpriseList: '', count: '0' }
                            ]);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" /> 添加产业分类
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Talent & Positions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold border-l-4 border-blue-600 pl-2">已解决岗位与推荐数据</CardTitle>
                <CardDescription>配置人才推荐总数及各岗位分布</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <label className="text-sm font-medium whitespace-nowrap">累计推荐总人数：</label>
                  <Input 
                    value={servicesData.talent.totalRecommended} 
                    onChange={(e) => {
                      updateServices('talent', { ...servicesData.talent, totalRecommended: e.target.value });
                    }} 
                    className="max-w-[200px]"
                  />
                  <span className="text-sm text-slate-500">人</span>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-700">岗位分布图表配置</h4>
                  {servicesData.talent.positionChart.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <Input 
                          value={item.category} 
                          onChange={(e) => {
                            const newItems = [...servicesData.talent.positionChart];
                            newItems[index].category = e.target.value;
                            updateServices('talent', { ...servicesData.talent, positionChart: newItems });
                          }} 
                          placeholder="岗位名称"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input 
                          value={item.value} 
                          onChange={(e) => {
                            const newItems = [...servicesData.talent.positionChart];
                            newItems[index].value = e.target.value;
                            updateServices('talent', { ...servicesData.talent, positionChart: newItems });
                          }} 
                          placeholder="数值"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input 
                          value={item.unit} 
                          onChange={(e) => {
                            const newItems = [...servicesData.talent.positionChart];
                            newItems[index].unit = e.target.value;
                            updateServices('talent', { ...servicesData.talent, positionChart: newItems });
                          }} 
                          placeholder="单位"
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const newItems = servicesData.talent.positionChart.filter((_, i) => i !== index);
                            updateServices('talent', { ...servicesData.talent, positionChart: newItems });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-dashed"
                    onClick={() => {
                      updateServices('talent', { 
                        ...servicesData.talent, 
                        positionChart: [...servicesData.talent.positionChart, { id: `pc-${Date.now()}`, category: '', value: '', unit: '人' }]
                      });
                    }}
                  >
                    <Plus className="h-3 w-3 mr-2" /> 添加岗位分类
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Card 3: High-Quality Enterprises */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold border-l-4 border-blue-600 pl-2">优质企业展示配置</CardTitle>
                <CardDescription>配置专精特新、小巨人等优质企业列表</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {servicesData.highQuality.map((item, index) => (
                  <div key={item.id} className="border p-4 rounded-lg space-y-3 relative group">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const newItems = servicesData.highQuality.filter((_, i) => i !== index);
                        updateServices('highQuality', newItems);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">荣誉类别</label>
                        <Input 
                          value={item.categoryName} 
                          onChange={(e) => {
                            const newItems = [...servicesData.highQuality];
                            newItems[index].categoryName = e.target.value;
                            updateServices('highQuality', newItems);
                          }} 
                          placeholder="如：专精特新"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">关联数值</label>
                        <Input 
                          value={item.associatedValue} 
                          onChange={(e) => {
                            const newItems = [...servicesData.highQuality];
                            newItems[index].associatedValue = e.target.value;
                            updateServices('highQuality', newItems);
                          }} 
                          placeholder="数值"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">企业名单/详情</label>
                      <Textarea 
                        value={item.companyDetails} 
                        onChange={(e) => {
                          const newItems = [...servicesData.highQuality];
                          newItems[index].companyDetails = e.target.value;
                          updateServices('highQuality', newItems);
                        }} 
                        placeholder="输入企业详细信息"
                        className="min-h-[60px]"
                      />
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full border-dashed"
                  onClick={() => {
                    updateServices('highQuality', [
                      ...servicesData.highQuality, 
                      { id: `hq-${Date.now()}`, categoryName: '', companyDetails: '', associatedValue: '' }
                    ]);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> 添加优质企业类别
                </Button>
              </CardContent>
            </Card>

            {/* Card 4: Logistics & Finance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold border-l-4 border-blue-600 pl-2">物流与金融指标管理</CardTitle>
                <CardDescription>配置物流运输方式及金融产品数据</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Subsection A: Logistics */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-400 rounded-full"></span>
                    物流运输方式 (饼图)
                  </h3>
                  {servicesData.logistics.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <Input 
                          value={item.mode} 
                          onChange={(e) => {
                            const newItems = [...servicesData.logistics];
                            newItems[index].mode = e.target.value;
                            updateServices('logistics', newItems);
                          }} 
                          placeholder="运输方式"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input 
                          value={item.percentage} 
                          onChange={(e) => {
                            const newItems = [...servicesData.logistics];
                            newItems[index].percentage = e.target.value;
                            updateServices('logistics', newItems);
                          }} 
                          placeholder="占比/数值"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input 
                          value={item.unit} 
                          onChange={(e) => {
                            const newItems = [...servicesData.logistics];
                            newItems[index].unit = e.target.value;
                            updateServices('logistics', newItems);
                          }} 
                          placeholder="单位"
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const newItems = servicesData.logistics.filter((_, i) => i !== index);
                            updateServices('logistics', newItems);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-dashed"
                    onClick={() => {
                      updateServices('logistics', [
                        ...servicesData.logistics, 
                        { id: `l-${Date.now()}`, mode: '', percentage: '', unit: '%' }
                      ]);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-2" /> 添加运输方式
                  </Button>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-md font-semibold flex items-center gap-2">
                    <span className="w-1 h-4 bg-green-400 rounded-full"></span>
                    金融产品数据 (横向柱图)
                  </h3>
                  {servicesData.financialProducts.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-4">
                        <Input 
                          value={item.productName} 
                          onChange={(e) => {
                            const newItems = [...servicesData.financialProducts];
                            newItems[index].productName = e.target.value;
                            updateServices('financialProducts', newItems);
                          }} 
                          placeholder="产品名称"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input 
                          value={item.amount} 
                          onChange={(e) => {
                            const newItems = [...servicesData.financialProducts];
                            newItems[index].amount = e.target.value;
                            updateServices('financialProducts', newItems);
                          }} 
                          placeholder="金额"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input 
                          value={item.unit} 
                          onChange={(e) => {
                            const newItems = [...servicesData.financialProducts];
                            newItems[index].unit = e.target.value;
                            updateServices('financialProducts', newItems);
                          }} 
                          placeholder="单位"
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const newItems = servicesData.financialProducts.filter((_, i) => i !== index);
                            updateServices('financialProducts', newItems);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-dashed"
                    onClick={() => {
                      updateServices('financialProducts', [
                        ...servicesData.financialProducts, 
                        { id: `fp-${Date.now()}`, productName: '', amount: '', unit: '万元' }
                      ]);
                    }}
                  >
                    <Plus className="h-3 w-3 mr-2" /> 添加金融产品
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };





  const renderPageContent = () => {
    switch (pageType) {
      case 'overview':
        return <OverviewSettings />;
      case 'economy':
        return (
          <EconomySettings 
            data={economyData} 
            onUpdate={updateEconomy} 
            onSave={handleSaveEconomy} 
          />
        );
      case 'elements':
        return renderElementsSettings();
      case 'assets':
        return renderAssetsSettings();
      case 'investment':
        return renderInvestmentSettings();
      case 'projects':
        return renderProjectsSettings();
      case 'services':
        return renderServicesSettings();
      case 'video':
        return (
          <VideoMonitoringSettings 
            videoMonitoringData={videoMonitoringData}
            updateVideoMonitoring={updateVideoMonitoring}
            handleSaveVideoMonitoring={handleSaveVideoMonitoring}
          />
        );
      case 'energy':
        return <EnergyOneMapSettings />;
      case 'return':
        return renderCategory('return', '返乡创业一张图页面管理', returnEntrepreneurshipItems);
      default:
        return <OverviewSettings />;
    }
  };

  const getPageTitle = () => {
    switch (pageType) {
      case 'overview':
        return '园区总览页面管理';
      case 'economy':
        return '经济运行页面管理';
      case 'elements':
        return '要素保障页面管理';
      case 'assets':
        return '资产管理页面管理';
      case 'investment':
        return '招商引资页面管理';
      case 'projects':
        return '建设项目页面管理';
      case 'services':
        return '企业服务页面管理';
      case 'video':
        return '视频监控页面管理';
      case 'energy':
        return '能源一张图页面管理';
      case 'return':
        return '返乡创业一张图页面管理';
      default:
        return '园区总览页面管理';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">{getPageTitle()}</h1>
        <p className="text-slate-500 mt-1">配置可视化页面的展示指标与单位</p>
      </div>
      {renderPageContent()}
    </div>
  );
}
