import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const EntrepreneurshipMapConfigSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <Card>
        <CardHeader>
          <CardTitle>返乡创业一张图 - 驾驶舱主页配置 (测试)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">如果你能看到这段文字,说明组件加载成功!</p>
          <p className="text-slate-500 mt-2">主配置页面正在加载...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntrepreneurshipMapConfigSimple;
