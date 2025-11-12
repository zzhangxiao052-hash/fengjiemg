import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Product {
  id: string;
  name: string;
  company: string;
  submitTime: string;
  status: string;
}

export default function FinanceProductAudit() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: '小微企业快速贷', company: '民生银行', submitTime: '2024-10-16 10:30', status: 'pending' },
    { id: '2', name: '产业链金融方案', company: '浦发银行', submitTime: '2024-10-16 09:15', status: 'pending' },
    { id: '3', name: '创新创业扶持基金', company: '建设银行', submitTime: '2024-10-15 16:20', status: 'pending' },
  ]);

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.filter(p => p.status === 'pending').map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelect = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleApprove = (productId?: string) => {
    const idsToApprove = productId ? [productId] : selectedProducts;
    setProducts(products.map(p => 
      idsToApprove.includes(p.id) ? { ...p, status: 'approved' } : p
    ));
    setSelectedProducts([]);
    toast.success(`已通过 ${idsToApprove.length} 个产品审核`);
  };

  const handleReject = (product: Product) => {
    setCurrentProduct(product);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error('请填写拒绝理由');
      return;
    }
    if (currentProduct) {
      setProducts(products.map(p => 
        p.id === currentProduct.id ? { ...p, status: 'rejected' } : p
      ));
      toast.success('已拒绝该产品');
    }
    setShowRejectDialog(false);
    setRejectReason('');
  };

  const batchApprove = () => {
    if (selectedProducts.length === 0) {
      toast.error('请先选择要审核的产品');
      return;
    }
    handleApprove();
  };

  const pendingProducts = products.filter(p => p.status === 'pending');
  const approvedProducts = products.filter(p => p.status === 'approved');
  const rejectedProducts = products.filter(p => p.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900">金融产品审核</h1>
          <p className="text-slate-500 mt-1">审核企业提交的金融产品</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={batchApprove}
            disabled={selectedProducts.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            批量通过
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            待审核 <Badge className="ml-2">{pendingProducts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">
            已通过 <Badge className="ml-2">{approvedProducts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            已拒绝 <Badge className="ml-2">{rejectedProducts.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedProducts.length === pendingProducts.length && pendingProducts.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>产品名称</TableHead>
                      <TableHead>提交企业</TableHead>
                      <TableHead>提交时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-slate-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={(checked) => handleSelect(product.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.company}</TableCell>
                        <TableCell>{product.submitTime}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApprove(product.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              通过
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleReject(product)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              拒绝
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>产品名称</TableHead>
                      <TableHead>提交企业</TableHead>
                      <TableHead>提交时间</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.company}</TableCell>
                        <TableCell>{product.submitTime}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700">已通过</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>产品名称</TableHead>
                      <TableHead>提交企业</TableHead>
                      <TableHead>提交时间</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rejectedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.company}</TableCell>
                        <TableCell>{product.submitTime}</TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-700">已拒绝</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>拒绝产品审核</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>产品名称</Label>
              <p className="mt-1 text-slate-700">{currentProduct?.name}</p>
            </div>
            <div>
              <Label htmlFor="reason">拒绝理由 *</Label>
              <Textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="请填写拒绝理由..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              取消
            </Button>
            <Button onClick={confirmReject} className="bg-red-600 hover:bg-red-700">
              确认拒绝
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
