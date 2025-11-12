import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Store, FileText, Users, TrendingUp, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface EnterpriseHomeProps {
  onNavigate: (page: string) => void;
}

export default function EnterpriseHome({ onNavigate }: EnterpriseHomeProps) {
  const stats = [
    { title: '发布服务', value: '12', icon: <Store className="h-8 w-8 text-[#1E3A8A]" />, color: 'bg-blue-50' },
    { title: '服务订单', value: '48', icon: <FileText className="h-8 w-8 text-green-600" />, color: 'bg-green-50' },
    { title: '合作企业', value: '23', icon: <Users className="h-8 w-8 text-purple-600" />, color: 'bg-purple-50' },
    { title: '月度收益', value: '¥156K', icon: <TrendingUp className="h-8 w-8 text-orange-600" />, color: 'bg-orange-50' },
  ];

  const services = [
    { id: '1', name: '金融产品咨询服务', category: '金融服务', status: '已上架', views: 256 },
    { id: '2', name: '物流运输服务', category: '物流服务', status: '已上架', views: 189 },
    { id: '3', name: '技术人才招聘', category: '用人需求', status: '招聘中', views: 145 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">服务展示</h1>
          <p className="text-slate-500 mt-1">查看和管理您的服务信息</p>
        </div>
        <Button onClick={() => onNavigate('publish')} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          <Plus className="h-4 w-4 mr-2" />
          发布新服务
        </Button>
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

      <Card>
        <CardHeader>
          <CardTitle>我的服务</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <h4 className="text-slate-900">{service.name}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="outline">{service.category}</Badge>
                    <span className="text-slate-400 text-sm">浏览量: {service.views}</span>
                  </div>
                </div>
                <Badge className={service.status === '已上架' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}>
                  {service.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* <Card>
          <CardHeader>
            <CardTitle>快捷入口</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('procurement')}>
              采购寻源
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('capacity')}>
              产能共享
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('supply')}>
              产品供应
            </Button>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>最新消息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['您有新的订单待处理', '系统维护通知', '平台政策更新'].map((msg, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded hover:bg-slate-50">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                  <p className="text-slate-700 text-sm">{msg}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
