import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TruckIcon, Package, MapPin, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '../ui/badge';

interface CommerceHomeProps {
  onNavigate: (page: string) => void;
}

const chartData = [
  { month: '1月', demands: 28, services: 35 },
  { month: '2月', demands: 34, services: 42 },
  { month: '3月', demands: 31, services: 38 },
  { month: '4月', demands: 38, services: 45 },
  { month: '5月', demands: 42, services: 51 },
  { month: '6月', demands: 45, services: 53 },
];

export default function CommerceHome({ onNavigate }: CommerceHomeProps) {
  const stats = [
    { title: '物流需求', value: '218', icon: <Package className="h-8 w-8 text-[#1E3A8A]" />, color: 'bg-blue-50' },
    { title: '物流服务', value: '264', icon: <TruckIcon className="h-8 w-8 text-green-600" />, color: 'bg-green-50' },
    { title: '服务线路', value: '45', icon: <MapPin className="h-8 w-8 text-purple-600" />, color: 'bg-purple-50' },
    { title: '月度增长', value: '+15.3%', icon: <TrendingUp className="h-8 w-8 text-orange-600" />, color: 'bg-orange-50' },
  ];

  const recentActivities = [
    { id: '1', type: '企业认证', description: '新企业“奉节农产品有限公司”完成认证', time: '2小时前', status: '已完成' },
    { id: '2', type: '政策发布', description: '发布新政策“2024年电商扶持计划”', time: '1天前', status: '已发布' },
    { id: '3', type: '物流订单', description: '“重庆物流”完成一笔大宗农产品运输订单', time: '2天前', status: '已完成' },
    { id: '4', type: '内容更新', description: '更新了“奉节脐橙”的电商推广文章', time: '3天前', status: '已更新' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">仪表盘</h1>
        <p className="text-slate-500 mt-1">商务委管理端数据概览</p>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>物流数据趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
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
                <Line type="monotone" dataKey="demands" stroke="#1E3A8A" strokeWidth={2} name="物流需求" />
                <Line type="monotone" dataKey="services" stroke="#10b981" strokeWidth={2} name="物流服务" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>热门线路</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { from: '奉节', to: '重庆', volume: '1250吨/月', trend: '+12%' },
              { from: '奉节', to: '成都', volume: '980吨/月', trend: '+8%' },
              { from: '奉节', to: '武汉', volume: '756吨/月', trend: '+15%' },
            ].map((route, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#1E3A8A]" />
                  <div>
                    <p className="text-slate-900">{route.from} → {route.to}</p>
                    <p className="text-slate-500 text-sm">{route.volume}</p>
                  </div>
                </div>
                <span className="text-green-600 text-sm">{route.trend}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="outline">{activity.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
