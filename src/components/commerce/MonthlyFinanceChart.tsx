import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { month: '一月', finance: 500 },
  { month: '二月', finance: 550 },
  { month: '三月', finance: 520 },
  { month: '四月', finance: 600 },
  { month: '五月', finance: 650 },
  { month: '六月', finance: 680 },
];

export default function MonthlyFinanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>月度金融图表</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="finance" fill="#82ca9d" name="金融数据" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
