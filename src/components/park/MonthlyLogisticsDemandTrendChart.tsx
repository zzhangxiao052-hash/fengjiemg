import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: '一月', '物流需求': 120 },
  { name: '二月', '物流需求': 150 },
  { name: '三月', '物流需求': 130 },
  { name: '四月', '物流需求': 180 },
  { name: '五月', '物流需求': 200 },
  { name: '六月', '物流需求': 220 },
];

export default function MonthlyLogisticsDemandTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>月度物流需求趋势</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="物流需求" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}