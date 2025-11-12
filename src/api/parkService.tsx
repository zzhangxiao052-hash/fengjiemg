
import { Building, FileText, Megaphone, Users } from 'lucide-react';

// 模拟统计数据
export interface Stat {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export const getParkStats = (): Promise<Stat[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { title: '入驻企业', value: '210', icon: <Building className="h-8 w-8 text-[#1E3A8A]" />, color: 'bg-blue-50' },
        { title: '发布政策', value: '75', icon: <FileText className="h-8 w-8 text-green-600" />, color: 'bg-green-50' },
        { title: '广告位', value: '15', icon: <Megaphone className="h-8 w-8 text-purple-600" />, color: 'bg-purple-50' },
        { title: '活跃用户', value: '1,500', icon: <Users className="h-8 w-8 text-orange-600" />, color: 'bg-orange-50' },
      ]);
    }, 500); // 模拟网络延迟
  });
};

// 模拟月度数据
export interface ChartData {
  month: string;
  enterprises: number;
  policies: number;
}

export const getMonthlyData = (): Promise<ChartData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { month: '1月', enterprises: 130, policies: 9 },
        { month: '2月', enterprises: 140, policies: 13 },
        { month: '3月', enterprises: 160, policies: 11 },
        { month: '4月', enterprises: 175, policies: 16 },
        { month: '5月', enterprises: 190, policies: 12 },
        { month: '6月', enterprises: 210, policies: 14 },
      ]);
    }, 500);
  });
};

// 模拟最新动态
export interface Activity {
  action: string;
  time: string;
  type: 'new' | 'policy' | 'system' | 'ad';
}

export const getLatestActivities = (): Promise<Activity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { action: '新企业"创新科技"提交认证申请', time: '5分钟前', type: 'new' },
        { action: '发布了最新园区安全管理政策', time: '30分钟前', type: 'policy' },
        { action: '系统完成了每日数据同步', time: '1小时前', type: 'system' },
        { action: '新增广告位"园区入口大屏"已上线', time: '2小时前', type: 'ad' },
        { action: '企业"绿色能源"完成年度审核', time: '3小时前', type: 'new' },
      ]);
    }, 500);
  });
};
