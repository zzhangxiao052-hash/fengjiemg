import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { month: '一月', talent: 120 },
  { month: '二月', talent: 150 },
  { month: '三月', talent: 130 },
  { month: '四月', talent: 180 },
  { month: '五月', talent: 200 },
  { month: '六月', talent: 220 },
];

export default function MonthlyTalentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>月度人才图表</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="talent" stroke="#8884d8" name="人才数量" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
