import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Search, Eye, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LogisticsServiceProps {
  onNavigate: (page: string) => void;
}

export default function LogisticsService({ onNavigate }: LogisticsServiceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const services = [
    { id: '1', company: '物流公司A', route: '奉节→重庆', capacity: '100吨', price: '¥3000/吨', status: '可用', distance: '350公里' },
    { id: '2', company: '运输公司B', route: '奉节→成都', capacity: '80吨', price: '¥3500/吨', status: '可用', distance: '420公里' },
    { id: '3', company: '货运公司C', route: '奉节→武汉', capacity: '120吨', price: '¥4000/吨', status: '繁忙', distance: '680公里' },
  ];

  const filtered = services.filter(s => 
    s.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (id: string) => {
    onNavigate(`logistics-service-detail-${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">物流服务查看</h1>
          <p className="text-slate-500 mt-1">查看物流服务和运输线路</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索物流公司或线路..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>物流公司</TableHead>
                  <TableHead>运输路线</TableHead>
                  <TableHead>距离</TableHead>
                  <TableHead>运输能力</TableHead>
                  <TableHead>价格</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((service) => (
                  <TableRow key={service.id} className="hover:bg-slate-50">
                    <TableCell>{service.company}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {service.route}
                      </div>
                    </TableCell>
                    <TableCell>{service.distance}</TableCell>
                    <TableCell>{service.capacity}</TableCell>
                    <TableCell>{service.price}</TableCell>
                    <TableCell>
                      <Badge className={service.status === '可用' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(service.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}