import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Briefcase, FileText, TrendingUp, Plus, CheckCircle, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'motion/react';

interface FinanceHomeProps {
  onNavigate: (page: string) => void;
}

const chartData = [
  { month: '1月', services: 45, demands: 32, amount: 2500 },
  { month: '2月', services: 52, demands: 41, amount: 3200 },
  { month: '3月', services: 61, demands: 38, amount: 2800 },
  { month: '4月', services: 58, demands: 47, amount: 3800 },
  { month: '5月', services: 73, demands: 55, amount: 4200 },
  { month: '6月', services: 69, demands: 62, amount: 4800 },
];

export default function FinanceHome({ onNavigate }: FinanceHomeProps) {
  const stats = [
    {
      title: '金融服务总数',
      value: '358',
      change: '+12.5%',
      icon: <Briefcase className="h-8 w-8 text-[#1E3A8A]" />,
      color: 'bg-blue-50',
    },
    {
      title: '金融需求总数',
      value: '275',
      change: '+8.3%',
      icon: <FileText className="h-8 w-8 text-green-600" />,
      color: 'bg-green-50',
    },
    {
      title: '待审核产品',
      value: '23',
      change: '-5.2%',
      icon: <CheckCircle className="h-8 w-8 text-orange-600" />,
      color: 'bg-orange-50',
    },
    {
      title: '本月新增服务',
      value: '69',
      change: '+15.7%',
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      color: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">仪表盘</h1>
          <p className="text-slate-500 mt-1">金融办管理端数据概览</p>
        </div>
      </div>

      {/* Stats Grid */}
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
                    <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} 较上月
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>月度数据趋势</CardTitle>
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
                <Bar dataKey="services" fill="#1E3A8A" name="金融服务" radius={[4, 4, 0, 0]} />
                <Bar dataKey="demands" fill="#10b981" name="金融需求" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>服务类型分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: '贷款', value: 156 },
                    { name: '担保', value: 89 },
                    { name: '咨询', value: 67 },
                    { name: '其他', value: 46 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {['#1E3A8A', '#3b82f6', '#60a5fa', '#93c5fd'].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>融资金额统计（万元）</CardTitle>
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
                <Bar dataKey="amount" fill="#1E3A8A" name="融资金额" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: '重庆银行提交了新的金融产品', time: '5分钟前', type: 'new' },
              { action: '长江证券的贷款产品已通过审核', time: '1小时前', type: 'approved' },
              { action: '某企业提交了融资需求', time: '2小时前', type: 'demand' },
              { action: '工商银行更新了产品信息', time: '3小时前', type: 'update' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  activity.type === 'new' ? 'bg-blue-500' :
                  activity.type === 'approved' ? 'bg-green-500' :
                  activity.type === 'demand' ? 'bg-orange-500' : 'bg-purple-500'
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
    </div>
  );
}