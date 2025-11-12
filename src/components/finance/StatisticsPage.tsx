import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StatisticsPage() {
  const monthlyData = [
    { month: '1月', services: 45, demands: 32, amount: 2500 },
    { month: '2月', services: 52, demands: 41, amount: 3200 },
    { month: '3月', services: 61, demands: 38, amount: 2800 },
    { month: '4月', services: 58, demands: 47, amount: 3800 },
    { month: '5月', services: 73, demands: 55, amount: 4200 },
    { month: '6月', services: 69, demands: 62, amount: 4800 },
  ];

  const typeData = [
    { name: '贷款', value: 156 },
    { name: '担保', value: 89 },
    { name: '咨询', value: 67 },
    { name: '其他', value: 46 },
  ];

  const COLORS = ['#1E3A8A', '#3b82f6', '#60a5fa', '#93c5fd'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900">统计分析</h1>
        <p className="text-slate-500 mt-1">金融服务数据统计与分析</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>月度趋势分析</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
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
                <Line type="monotone" dataKey="services" stroke="#1E3A8A" strokeWidth={2} name="服务数量" />
                <Line type="monotone" dataKey="demands" stroke="#10b981" strokeWidth={2} name="需求数量" />
              </LineChart>
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
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>融资金额统计（万元）</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
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
      </div>
    </div>
  );
}
