import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Badge } from '../ui/badge';
import MonthlyTalentChart from './MonthlyTalentChart';
import MonthlyFinanceChart from './MonthlyFinanceChart';

export default function StatisticsPage() {
  const stats = [
    { title: '总企业数', value: '1,234', change: '+12%', period: '较上月' },
    { title: '新增企业数', value: '87', change: '+5%', period: '较上月' },
    { title: '物流需求总量', value: '5,678', change: '+8%', period: '较上月' },
    { title: '已完成物流订单', value: '4,987', change: '+10%', period: '较上月' },
  ];

  const monthlyEnterpriseGrowth = [
    { month: '一月', enterprises: 120 },
    { month: '二月', enterprises: 150 },
    { month: '三月', enterprises: 130 },
    { month: '四月', enterprises: 180 },
    { month: '五月', enterprises: 200 },
    { month: '六月', enterprises: 220 },
  ];

  const monthlyLogisticsDemand = [
    { month: '一月', demand: 300 },
    { month: '二月', demand: 350 },
    { month: '三月', demand: 320 },
    { month: '四月', demand: 400 },
    { month: '五月', demand: 450 },
    { month: '六月', demand: 480 },
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
        <h1 className="text-slate-900">商务委数据总览</h1>
        <p className="text-slate-500 mt-1">全面了解商务委各项业务数据</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} {stat.period}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MonthlyFinanceChart />
        <MonthlyTalentChart />
      </div>
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