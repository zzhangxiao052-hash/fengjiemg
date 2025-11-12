import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Building, FileText, Megaphone, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCcw } from 'lucide-react';
import { getParkStats, getMonthlyData, getLatestActivities, Stat, ChartData, Activity } from '../../api/parkService.tsx';
import MonthlyLogisticsDemandTrendChart from './MonthlyLogisticsDemandTrendChart';

interface ParkHomeProps {
  onNavigate: (page: string) => void;
}

export default function ParkHome({ onNavigate }: ParkHomeProps) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [latestActivities, setLatestActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, chartDataData, activitiesData] = await Promise.all([
        getParkStats(),
        getMonthlyData(),
        getLatestActivities(),
      ]);
      setStats(statsData);
      setChartData(chartDataData);
      setLatestActivities(activitiesData);
    } catch (error) {
      console.error("Failed to fetch park data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-slate-900">数据概览</h1>
          <p className="text-slate-500 mt-1">园区管理端数据概览</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          刷新数据
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-slate-500">加载中...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-slate-500 text-sm">{stat.title}</p>
                        <h3 className="text-slate-900 mt-2">{stat.value}</h3>
                      </div>
                      <div className={`${stat.color} p-3 rounded-xl`}>{stat.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>月度数据统计</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="enterprises" fill="#1E3A8A" name="入驻企业" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="policies" fill="#10b981" name="发布政策" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <MonthlyLogisticsDemandTrendChart />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>最新动态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      activity.type === 'new' ? 'bg-blue-500' :
                      activity.type === 'policy' ? 'bg-green-500' :
                      activity.type === 'system' ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-slate-700">{activity.action}</p>
                      <p className="text-slate-400 text-sm mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}