import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Plus, Search, Upload, Eye, Edit, Trash2, Check, X, SquarePen } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
// import { Eye, Check, X, SquarePen, Trash2, Upload } from 'lucide-react'; // Remove this line

interface EnterpriseCollaborationProps {
  type: string;
  onNavigate: (page: string) => void; // Add onNavigate prop
}

interface ProcurementItem {
  id: string,
  procurementTitle: string,
  procurementCategory: string,
  procurementQuantity: string,
  budgetRange: string,
  contact: string,
  materialName: string,
  publishingCompany: string,
  deliveryLocation: string,
  inquiryTime: string,
  deadline: string,
  invoiceType: string,
  brand: string,
  specification: string,
  unit: string,
  description: string,
  contact: string,
  manufacturerName: string, // New field for capacity
  address: string, // New field for capacity
  numberOfEmployees: string, // New field for capacity
  area: string, // New field for capacity
  monthlyCapacity: string, // New field for capacity
  factoryCapacityTags: string, // New field for capacity
  projectName: string, // New field for production
  companyName: string, // New field for production
  projectDescription: string, // New field for production
  deadline: string, // New field for production
  projectTags: string, // New field for production
  contactInfo: string, // New field for production
  quoteBudget: string, // New field for production
  contactPerson: string, // New field for production
  contactPhone: string, // New field for production
}

const titleMap: Record<string, string> = {
  procurement: '采购寻源',
  capacity: '产能共享',
  supply: '产品供应',
  shop: '云商店铺',
  production: '生产协作',
};

const descriptionMap: Record<string, string> = {
  procurement: '发布采购需求，寻找合适的供应商',
  capacity: '共享闲置产能，提高资源利用率',
  supply: '展示和销售您的产品',
  shop: '在线商店管理',
  production: '协同生产，提升效率',
};

export default function EnterpriseCollaboration({ type, onNavigate }: EnterpriseCollaborationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [formData, setFormData] = useState({
    materialName: '',
    publishingCompany: '',
    procurementCategory: '',
    procurementQuantity: '',
    budgetRange: '',
    deliveryLocation: '',
    procurementTitle: '',
    inquiryTime: '',
    deadline: '',
    invoiceType: '',
    brand: '',
    specification: '',
    unit: '',
    description: '',
    contact: '',
    manufacturerName: '', // New field for capacity
    address: '', // New field for capacity
    numberOfEmployees: '', // New field for capacity
    area: '', // New field for capacity
    monthlyCapacity: '', // New field for capacity
    factoryCapacityTags: '', // New field for capacity
    projectName: '', // New field for production
    companyName: '', // New field for production
    minOrderQuantity: '', // New field for supply
    priceRange: '', // New field for supply
    contactPerson: '', // New field for supply
    contactPhone: '', // New field for supply
  });

  const [shopFormData, setShopFormData] = useState({
    companyName: '',
    businessLicense: '',
    qualificationCert: '',
    email: '',
    address: '',
    companyProfile: '',
    contactPhone: '',
  });

  const sampleData: Record<string, any[]> = {
    procurement: [
      {
        id: '1',
        procurementTitle: '采购钢材500吨',
        procurementCategory: '建筑材料',
        procurementQuantity: '500',
        budgetRange: '100万-200万',
        contact: '张三 13800138000',
        materialName: '钢材',
        publishingCompany: '建筑公司A',
        deliveryLocation: '上海市浦东新区',
        inquiryTime: '2024-10-01T09:00',
        deadline: '2024-10-15T17:00',
        invoiceType: 'special',
        brand: '宝武',
        specification: 'HRB400',
        unit: '吨',
        description: '采购用于新建项目的钢材，要求符合国家标准。',
      },
      {
        id: '2',
        procurementTitle: '采购电子元器件',
        procurementCategory: '电子产品',
        procurementQuantity: '10000',
        budgetRange: '50万-80万',
        contact: '李四 13912345678',
        materialName: '电阻',
        publishingCompany: '科技公司B',
        deliveryLocation: '深圳市南山区',
        inquiryTime: '2024-10-05T10:00',
        deadline: '2024-10-20T18:00',
        invoiceType: 'general',
        brand: 'TDK',
        specification: '10kΩ',
        unit: '个',
        description: '采购用于智能设备的电子元器件，要求性能稳定。',
      },
    ],
    capacity: [
      { id: '1', deviceName: '机械加工产能', manufacturerName: '制造公司A', deviceType: '机床', monthlyCapacity: '1000件/月', price: '¥150,000', createTime: '2023-01-01', status: '可用' },
      { id: '2', deviceName: '仓储空间', manufacturerName: '物流公司B', deviceType: '仓库', monthlyCapacity: '500㎡', price: '¥50,000', createTime: '2023-02-15', status: '可用' },
      { id: '3', deviceName: '注塑机产能', manufacturerName: '塑胶厂C', deviceType: '注塑机', monthlyCapacity: '2000件/月', price: '¥200,000', createTime: '2023-03-10', status: '可用' },
      { id: '4', deviceName: 'CNC加工产能', manufacturerName: '精密机械D', deviceType: 'CNC机床', monthlyCapacity: '800件/月', price: '¥300,000', createTime: '2023-04-20', status: '占用' },
    ],
    supply: [
      { id: '1', materialName: '不锈钢板', industrialType: '金属加工', quantity: '1000kg', budget: '¥10,000', contactPerson: '张三', contactPhone: '13812345678' },
      { id: '2', materialName: '塑料粒子', industrialType: '塑料制品', quantity: '5000kg', budget: '¥25,000', contactPerson: '李四', contactPhone: '13987654321' },
      { id: '3', materialName: '电子元器件', industrialType: '电子制造', quantity: '100000个', budget: '¥50,000', contactPerson: '王五', contactPhone: '13700112233' },
      { id: '4', materialName: '包装纸箱', industrialType: '包装印刷', quantity: '20000个', budget: '¥8,000', contactPerson: '赵六', contactPhone: '13655443322' },
    ],
    shop: [
      { id: '1', companyName: '科技创新公司', address: '深圳市南山区科技园', contactPhone: '13800138000', email: 'contact@tech.com', companyProfile: '专注于高科技产品研发与生产。', products: '23', orders: '156', status: '营业中' },
      { id: '2', companyName: '绿色能源有限公司', address: '广州市天河区环保科技园', contactPhone: '13912345678', email: 'info@greenenergy.com', companyProfile: '致力于可持续能源解决方案。', products: '15', orders: '88', status: '审核中' },
    ],
    production: [
      {
        id: '1',
        projectName: '智能工厂改造项目',
        companyName: '智能制造有限公司',
        projectDescription: '对现有工厂进行智能化升级，引入自动化设备和智能管理系统。',
        deadline: '2024-12-31',
        projectTags: '自动化,智能化,MES',
        contactInfo: '王经理 13911112222',
        quoteBudget: '500万-800万',
        contactPerson: '王经理',
        contactPhone: '13911112222',
      },
      {
        id: '2',
        projectName: '新能源汽车零部件生产',
        companyName: '绿色动力科技有限公司',
        projectDescription: '为新能源汽车提供核心零部件的研发与生产服务。',
        deadline: '2025-06-30',
        projectTags: '新能源,汽车,零部件',
        contactInfo: '李总 13833334444',
        quoteBudget: '1000万-1500万',
        contactPerson: '李总',
        contactPhone: '13833334444',
      },
      {
        id: '3',
        projectName: '医疗器械精密加工',
        companyName: '精准医疗器械公司',
        projectDescription: '提供高精度医疗器械的定制加工服务。',
        deadline: '2024-11-15',
        projectTags: '医疗器械,精密加工',
        contactInfo: '赵女士 13755556666',
        quoteBudget: '200万-300万',
        contactPerson: '赵女士',
        contactPhone: '13755556666',
      },
    ],
  };

  const data = sampleData[type] || [];

  const handleSubmit = () => {
    if (type === 'shop') {
      if (!shopFormData.companyName || !shopFormData.email || !shopFormData.address) {
        toast.error('请填写必填信息 (企业名称, 邮箱, 地址)');
        return;
      }
      toast.success('店铺信息提交成功');
      setShowAddDialog(false);
      setShopFormData({
        companyName: '',
        businessLicense: '',
        qualificationCert: '',
        email: '',
        address: '',
        companyProfile: '',
        contactPhone: '',
      });
    } else if (type === 'procurement') {
      if (!formData.materialName || !formData.publishingCompany || !formData.deliveryLocation || !formData.procurementTitle || !formData.procurementQuantity || !formData.unit) {
        toast.error('请填写所有必填信息');
        return;
      }
      toast.success('采购寻源发布成功');
      setShowAddDialog(false);
      setFormData({
        materialName: '',
        publishingCompany: '',
        procurementCategory: '',
        procurementQuantity: '',
        budgetRange: '',
        deliveryLocation: '',
        procurementTitle: '',
        inquiryTime: '',
        deadline: '',
        invoiceType: '',
        brand: '',
        specification: '',
        unit: '',
        description: '',
        contact: '',
      });
    } else {
      if (!formData.title) {
        toast.error('请填写标题');
        return;
      }
      toast.success('发布成功');
      setShowAddDialog(false);
      setFormData({ title: '', category: '', description: '', contact: '' });
    }
  };

  const handleView = (item: any) => {
    setViewData(item);
    setShowViewDialog(true);
  };

  const handleAgree = (item: any) => {
    toast.success(`已同意采购寻源: ${item.title}`);
    // Add logic to update the status or perform other actions
  };

  const handleReject = (item: any) => {
    toast.error(`已拒绝采购寻源: ${item.title}`);
    // Add logic to update the status or perform other actions
  };

  const handleEdit = (item: any) => {
    if (type === 'capacity') {
      toast.info(`编辑产能共享项目: ${item.deviceName}`);
      // Add logic to open edit dialog or navigate to edit page
    } else if (type === 'shop') {
      // Navigate to a new page for editing shop details
      onNavigate(`shop-edit-${item.id}`);
    } else {
      toast.info(`编辑项目: ${item.title}`);
      // Add logic for other types
    }
  };

  const handleDelete = (item: any) => {
    if (type === 'capacity') {
      if (confirm(`确定要删除产能共享项目 "${item.deviceName}" 吗？此操作无法撤销。`)) {
        toast.success(`已删除产能共享项目: ${item.deviceName}`);
        // Add logic to remove the item from data array
      }
    } else {
      if (confirm(`确定要删除项目 "${item.title}" 吗？此操作无法撤销。`)) {
        toast.success(`已删除项目: ${item.title}`);
        // Add logic to remove the item from data array
      }
    }
  };

  const renderTableCells = (item: any, type: string) => {
    switch (type) {
      case 'procurement':
        return [
          <TableCell key="procurementTitle">{item.procurementTitle}</TableCell>,
          <TableCell key="procurementCategory">{item.procurementCategory}</TableCell>,
          <TableCell key="procurementQuantity">{item.procurementQuantity}</TableCell>,
          <TableCell key="budgetRange">{item.budgetRange}</TableCell>,
          <TableCell key="contact">{item.contact}</TableCell>,
          <TableCell key="actions" className="text-right">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleView(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>查看</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleAgree(item)}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>同意</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleReject(item)}>
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>拒绝</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>,
        ];
      case 'supply':
        return [
          <TableCell key="materialName">{item.materialName}</TableCell>,
          <TableCell key="industrialType">{item.industrialType}</TableCell>,
          <TableCell key="demandQuantity">{item.demandQuantity}</TableCell>,
          <TableCell key="budget">{item.budget}</TableCell>,
          <TableCell key="contactPerson">{item.contactPerson}</TableCell>,
          <TableCell key="contactNumber">{item.contactNumber}</TableCell>,
          <TableCell key="actions" className="text-right">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleView(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>查看</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleAgree(item)}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>同意</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleReject(item)}>
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>拒绝</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>,
        ];
      case 'capacity':
        return [
          <TableCell key="deviceName">{item.deviceName}</TableCell>,
          <TableCell key="manufacturerName">{item.manufacturerName}</TableCell>,
          <TableCell key="deviceType">{item.deviceType}</TableCell>,
          <TableCell key="monthlyCapacity">{item.monthlyCapacity}</TableCell>,
          <TableCell key="price">{item.price}</TableCell>,
          <TableCell key="createTime">{item.createTime}</TableCell>,
          <TableCell key="statusBadge">
            <Badge className={
              (item.status === '可用')
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-700'
            }>
              {item.status}
            </Badge>
          </TableCell>,
          <TableCell key="actions" className="text-right">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleView(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>查看</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <SquarePen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>编辑</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>删除</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>,
        ];
      case 'shop':
        return [
          <TableCell key="companyName">{item.companyName}</TableCell>,
          <TableCell key="address">{item.address}</TableCell>,
          <TableCell key="contactPhone">{item.contactPhone}</TableCell>,
          <TableCell key="email">{item.email}</TableCell>,
          <TableCell key="actions" className="text-right">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleView(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>查看</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <SquarePen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>编辑</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>删除</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>,
        ];
      case 'production':
        return [
          <TableCell key="projectName">{item.projectName}</TableCell>,
          <TableCell key="companyName">{item.companyName}</TableCell>,
          <TableCell key="quoteBudget">{item.quoteBudget}</TableCell>,
          <TableCell key="contactPerson">{item.contactPerson}</TableCell>,
          <TableCell key="contactPhone">{item.contactPhone}</TableCell>,
          <TableCell key="deadline">{item.deadline}</TableCell>,
          <TableCell key="actions" className="text-right">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleView(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>查看</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleAgree(item)}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>同意</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleReject(item)}>
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>拒绝</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>,
        ];
      default:
        return [
          <TableCell key="companyOrProductsOrPartners">{item.company || item.products || item.partners}</TableCell>,
          <TableCell key="statusOrCapacityOrPriceOrOrdersOrProgress">{item.status || item.capacity || item.price || item.orders || item.progress}</TableCell>,
          <TableCell key="statusBadgeDefault">
            <Badge className={
              (item.status === '进行中' || item.status === '可用' || item.status === '在售' || item.status === '营业中')
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-700'
            }>
              {item.status || item.createTime}
            </Badge>
          </TableCell>,
          <TableCell key="actionsDefault" className="text-right">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => handleView(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>查看</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>编辑</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>删除</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableCell>,
        ];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">{titleMap[type]}</h1>
          <p className="text-slate-500 mt-1">{descriptionMap[type]}</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          <Plus className="h-4 w-4 mr-2" />
          新增
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="搜索..."
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
                  {type === 'procurement' && (
                    <>
                      <TableHead>采购标题</TableHead>
                      <TableHead>采购类别</TableHead>
                      <TableHead>报价数量</TableHead>
                      <TableHead>报价预算</TableHead>
                      <TableHead>联系方式</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </>
                  )}
                  {type === 'capacity' && (
                    <>
                      <TableHead>设备名称</TableHead>
                      <TableHead>制造厂名称</TableHead>
                      <TableHead>设备类型</TableHead>
                      <TableHead>月产能件数</TableHead>
                      <TableHead>设备价格</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </>
                  )}
                  {type === 'supply' && (
                    <>
                      <TableHead>材料名称</TableHead>
                      <TableHead>工业类型</TableHead>
                      <TableHead>需求数量</TableHead>
                      <TableHead>报价预算</TableHead>
                      <TableHead>联系人</TableHead>
                      <TableHead>联系电话</TableHead>
                      <TableHead className="text-center">操作</TableHead>
                    </>
                  )}
                  {type === 'shop' && (
                    <>
                      <TableHead>企业名称</TableHead>
                      <TableHead>地址</TableHead>
                      <TableHead>联系电话</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </>
                  )}
                  {type === 'production' && (
                    <>
                      <TableHead>项目名称</TableHead>
                      <TableHead>公司名称</TableHead>
                      <TableHead>报价预算</TableHead>
                      <TableHead>联系人</TableHead>
                      <TableHead>联系人电话</TableHead>
                      <TableHead>截止时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50">
                    {renderTableCells(item, type)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{type === 'shop' ? '云商店铺信息' : `发布${titleMap[type]}`}</DialogTitle>
          </DialogHeader>
          {type === 'shop' ? (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="companyName">企业名称 *</Label>
                <Input
                  id="companyName"
                  value={shopFormData.companyName}
                  onChange={(e) => setShopFormData({ ...shopFormData, companyName: e.target.value })}
                  placeholder="请输入企业名称"
                />

              </div>
              <div className="grid gap-2">
                <Label htmlFor="businessLicense">营业执照 *</Label>
                <div className="flex items-center gap-2">
                  <img src="https://via.placeholder.com/150?text=营业执照" alt="营业执照" className="w-full h-auto object-cover rounded-md" />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-slate-500">请上传营业执照扫描件或填写营业执照编号</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qualificationCert">企业资格证书</Label>
                <div className="flex items-center gap-2">
                  <img src="https://via.placeholder.com/150?text=企业资格证书" alt="企业资格证书" className="w-full h-auto object-cover rounded-md" />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-2">
                  <Label>邮箱</Label>
                  <Input
                    id="email"
                    value={shopFormData.email}
                    onChange={(e) => setShopFormData({ ...shopFormData, email: e.target.value })}
                    placeholder="请输入邮箱"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">地址</Label>
                <Input
                  id="address"
                  value={shopFormData.address}
                  onChange={(e) => setShopFormData({ ...shopFormData, address: e.target.value })}
                  placeholder="请输入地址"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="companyProfile">企业简介</Label>
                <Textarea
                  id="companyProfile"
                  value={shopFormData.companyProfile}
                  onChange={(e) => setShopFormData({ ...shopFormData, companyProfile: e.target.value })}
                  placeholder="请输入企业简介"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPhone">联系电话</Label>
                <Input
                  id="contactPhone"
                  value={shopFormData.contactPhone}
                  onChange={(e) => setShopFormData({ ...shopFormData, contactPhone: e.target.value })}
                  placeholder="请输入联系电话"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {type === 'production' ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="projectName">项目名称 *</Label>
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      placeholder="请输入项目名称"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">公司名称 *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="请输入公司名称"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="projectDescription">项目描述 *</Label>
                    <Textarea
                      id="projectDescription"
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      placeholder="例如：需要CNC精密加工服务或者电子产品组装外包"
                      rows={4}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">截止时间 *</Label>
                    <Input
                      id="deadline"
                      type="datetime-local"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="projectTags">项目标签</Label>
                    <Input
                      id="projectTags"
                      value={formData.projectTags}
                      onChange={(e) => setFormData({ ...formData, projectTags: e.target.value })}
                      placeholder="例如：加工、组装"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactInfo">联系方式 *</Label>
                    <Input
                      id="contactInfo"
                      value={formData.contactInfo}
                      onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                      placeholder="请输入联系方式"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quoteBudget">报价预算</Label>
                    <Input
                      id="quoteBudget"
                      value={formData.quoteBudget}
                      onChange={(e) => setFormData({ ...formData, quoteBudget: e.target.value })}
                      placeholder="请输入报价预算"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactPerson">联系人名称</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="请输入联系人名称"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactPhone">联系人电话</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="请输入联系人电话"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="title">标题 *</Label>
                    <Input
                      id="title"
                      value={formData.procurementTitle}
                      onChange={(e) => setFormData({ ...formData, procurementTitle: e.target.value })}
                      placeholder="请输入标题"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company">公司 *</Label>
                    <Input
                      id="company"
                      value={formData.publishingCompany}
                      onChange={(e) => setFormData({ ...formData, publishingCompany: e.target.value })}
                      placeholder="请输入公司名称"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">描述</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="请输入详细描述"
                      rows={4}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="factoryPhotos">工厂照片</Label>
                    <Input
                      id="factoryPhotos"
                      type="file"
                      onChange={(e) => setFormData({ ...formData, factoryPhotos: e.target.files[0] })}
                      accept="image/*"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="industrialType">工业类型</Label>
                    <Input
                      id="industrialType"
                      value={formData.industrialType}
                      onChange={(e) => setFormData({ ...formData, industrialType: e.target.value })}
                      placeholder="请输入工业类型"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minOrderQuantity">起订量</Label>
                    <Input
                      id="minOrderQuantity"
                      value={formData.minOrderQuantity}
                      onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                      placeholder="请输入起订量"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priceRange">价格区间</Label>
                    <Input
                      id="priceRange"
                      value={formData.priceRange}
                      onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                      placeholder="请输入价格区间"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactPerson">联系人</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="请输入联系人"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contactPhone">联系电话</Label>
                    <Input
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="请输入联系电话"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              {type === 'shop' ? '提交' : '发布'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>查看详情</DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="grid gap-4 py-4">
              {type === 'procurement' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>材料名称</Label>
                      <p className="font-medium">{viewData.materialName}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>发布公司</Label>
                      <p className="font-medium">{viewData.publishingCompany}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>采购类别</Label>
                      <p className="font-medium">{viewData.procurementCategory}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>采购数量</Label>
                      <p className="font-medium">{viewData.procurementQuantity}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>预算范围</Label>
                      <p className="font-medium">{viewData.budgetRange}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>交货地点</Label>
                      <p className="font-medium">{viewData.deliveryLocation}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>询价时间</Label>
                      <p className="font-medium">{viewData.inquiryTime}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>截止时间</Label>
                      <p className="font-medium">{viewData.deadline}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>发票类型</Label>
                      <p className="font-medium">{viewData.invoiceType}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>品牌</Label>
                      <p className="font-medium">{viewData.brand}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>规格</Label>
                      <p className="font-medium">{viewData.specification}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>单位</Label>
                      <p className="font-medium">{viewData.unit}</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>联系方式</Label>
                    <p className="font-medium">{viewData.contact}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>描述</Label>
                    <p className="text-sm text-slate-500">{viewData.description}</p>
                  </div>
                </>
              ) : type === 'supply' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>材料名称</Label>
                      <p className="font-medium">{viewData.materialName}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>工业类型</Label>
                      <p className="font-medium">{viewData.industrialType}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>需求数量</Label>
                      <p className="font-medium">{viewData.quantity}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>报价预算</Label>
                      <p className="font-medium">{viewData.budget}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>联系人</Label>
                      <p className="font-medium">{viewData.contactPerson}</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>联系电话</Label>
                    <p className="font-medium">{viewData.contactPhone}</p>
                  </div>
                </>
              ) : type === 'capacity' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>制造厂名称</Label>
                      <p className="font-medium">{viewData.manufacturerName}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>地址</Label>
                      <p className="font-medium">{viewData.address}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>人数</Label>
                      <p className="font-medium">{viewData.numberOfEmployees}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>面积</Label>
                      <p className="font-medium">{viewData.area}</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>月产能件数</Label>
                    <p className="font-medium">{viewData.monthlyCapacity}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>工厂产能标签</Label>
                    <p className="font-medium">{viewData.factoryCapacityTags}</p>
                  </div>
                </>
              ) : type === 'shop' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>企业名称</Label>
                      <p className="font-medium">{viewData.companyName}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>营业执照</Label>
                      <img src="https://via.placeholder.com/150?text=营业执照" alt="营业执照" className="w-full h-auto object-cover rounded-md" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>企业资格证书</Label>
                      <img src="https://via.placeholder.com/150?text=企业资格证书" alt="企业资格证书" className="w-full h-auto object-cover rounded-md" />
                    </div>
                    <div className="grid gap-2">
                      <Label>邮箱</Label>
                      <p className="font-medium">{viewData.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>地址</Label>
                      <p className="font-medium">{viewData.address}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>联系电话</Label>
                      <p className="font-medium">{viewData.contactPhone}</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>企业简介</Label>
                    <p className="font-medium">{viewData.companyProfile}</p>
                  </div>
                </>
              ) : type === 'production' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>项目名称</Label>
                      <p className="font-medium">{viewData.projectName}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>公司名称</Label>
                      <p className="font-medium">{viewData.companyName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>报价预算</Label>
                      <p className="font-medium">{viewData.quoteBudget}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>联系人名称</Label>
                      <p className="font-medium">{viewData.contactPerson}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>联系人电话</Label>
                      <p className="font-medium">{viewData.contactPhone}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>截止时间</Label>
                      <p className="font-medium">{viewData.deadline}</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>项目描述</Label>
                    <p className="text-sm text-slate-500">{viewData.projectDescription}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label>项目标签</Label>
                    <p className="font-medium">{viewData.projectTags}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>标题</Label>
                      <p className="font-medium">{viewData.title}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>{type === 'capacity' ? '公司' : type === 'supply' ? '公司' : type === 'shop' ? '店铺名称' : '公司'}</Label>
                      <p className="font-medium">{viewData.company || viewData.products || viewData.partners}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>{type === 'capacity' ? '产能' : type === 'supply' ? '价格' : type === 'shop' ? '订单量' : '状态'}</Label>
                      <p className="font-medium">{viewData.capacity || viewData.price || viewData.orders || viewData.status}</p>
                    </div>
                    <div className="grid gap-2">
                      <Label>{type === 'capacity' ? '状态' : type === 'supply' ? '状态' : type === 'shop' ? '状态' : '创建时间'}</Label>
                      <p className="font-medium">{viewData.status || viewData.createTime}</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>描述</Label>
                    <p className="text-sm text-slate-500">{viewData.description}</p>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>关闭</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}