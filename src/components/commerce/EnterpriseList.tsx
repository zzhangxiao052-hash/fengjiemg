import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../ui/table';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';

interface Enterprise {
  id: string;
  name: string;
  industry: string;
  contactPerson: string;
  contactPhone: string;
  status: 'active' | 'inactive';
}

interface EnterpriseListProps {
  onNavigate: (page: string) => void;
}

export default function EnterpriseList({ onNavigate }: EnterpriseListProps) {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([
    { id: '1', name: '智慧物流有限公司', industry: '物流', contactPerson: '张三', contactPhone: '13800138000', status: 'active' },
    { id: '2', name: '城市配送服务中心', industry: '配送', contactPerson: '李四', contactPhone: '13912345678', status: 'active' },
    { id: '3', name: '供应链管理公司', industry: '供应链', contactPerson: '王五', contactPhone: '13787654321', status: 'inactive' },
    { id: '4', name: '冷链运输有限公司', industry: '冷链物流', contactPerson: '赵六', contactPhone: '13654321098', status: 'active' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEnterprises = enterprises.filter(enterprise =>
    enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enterprise.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    onNavigate(`enterprise-detail-${id}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">企业列表</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="搜索企业名称或行业..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>企业名称</TableHead>
              <TableHead>行业</TableHead>
              <TableHead>联系人</TableHead>
              <TableHead>联系电话</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnterprises.map((enterprise) => (
              <TableRow key={enterprise.id}>
                <TableCell className="font-medium">{enterprise.name}</TableCell>
                <TableCell>{enterprise.industry}</TableCell>
                <TableCell>{enterprise.contactPerson}</TableCell>
                <TableCell>{enterprise.contactPhone}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    enterprise.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {enterprise.status === 'active' ? '活跃' : '非活跃'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(enterprise.id)}
                    className="mr-2"
                    aria-label="查看企业详情"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}