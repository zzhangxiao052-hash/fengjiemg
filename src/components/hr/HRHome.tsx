import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Briefcase, Users, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface HRHomeProps {
  onNavigate: (page: string) => void;
}

const chartData = [
  { month: '1月', demands: 45, resumes: 156 },
  { month: '2月', demands: 52, resumes: 178 },
  { month: '3月', demands: 48, resumes: 189 },
  { month: '4月', demands: 61, resumes: 203 },
  { month: '5月', demands: 55, resumes: 195 },
  { month: '6月', demands: 58, resumes: 218 },
];

export default function HRHome({ onNavigate }: HRHomeProps) {
  const stats = [
    { title: '用人需求', value: '319', icon: <Briefcase className="h-8 w-8 text-[#1E3A8A]" />, color: 'bg-blue-50' },
    { title: '待岗人员', value: '142', icon: <Users className="h-8 w-8 text-green-600" />, color: 'bg-green-50' },
    { title: '简历库', value: '1,239', icon: <FileText className="h-8 w-8 text-purple-600" />, color: 'bg-purple-50' },
    { title: '待审核认证', value: '8', icon: <CheckCircle className="h-8 w-8 text-orange-600" />, color: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">仪表盘</h1>
        <p className="text-slate-500 mt-1">人力资源管理数据概览</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
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
                <Bar dataKey="demands" fill="#1E3A8A" name="用人需求" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resumes" fill="#10b981" name="简历数量" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>月度新增岗位趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
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
                <Line type="monotone" dataKey="demands" stroke="#8884d8" activeDot={{ r: 8 }} name="新增岗位" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}