import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: '一月', '企业数量': 120 },
  { name: '二月', '企业数量': 150 },
  { name: '三月', '企业数量': 130 },
  { name: '四月', '企业数量': 180 },
  { name: '五月', '企业数量': 200 },
  { name: '六月', '企业数量': 220 },
];

export default function MonthlyEnterpriseGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>月度企业增长</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="企业数量" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}