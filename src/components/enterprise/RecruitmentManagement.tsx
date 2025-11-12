import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Eye, Edit, ArrowDownCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export default function RecruitmentManagement() {
  const [jobPostings, setJobPostings] = useState([
    { id: '1', title: '前端开发工程师', company: '奉节县XX科技有限公司', status: '招聘中', applicants: 15 },
    { id: '2', title: 'UI/UX设计师', company: '奉节县YY物流有限公司', status: '已下架', applicants: 8 },
    { id: '3', title: '市场营销经理', company: '奉节县ZZ农业发展有限公司', status: '招聘中', applicants: 22 },
  ]);

  const handleViewDetails = (id: string) => {
    // Implement actual view details logic here
    toast.info(`查看岗位详情: ${id}`);
  };

  const handleEditJob = (id: string) => {
    // Implement actual edit job logic here
    toast.info(`编辑岗位: ${id}`);
  };

  const handleTakeDownJob = (id: string) => {
    setJobPostings(jobPostings.map(job => job.id === id ? { ...job, status: '已下架' } : job));
    toast.success(`岗位 ${id} 已下架`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>招聘管理 - 岗位列表</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>岗位名称</TableHead>
              <TableHead>公司</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>申请人数</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobPostings.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>{job.applicants}</TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(job.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>查看岗位详情</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {job.status === '招聘中' && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleEditJob(job.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>编辑岗位</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {job.status === '招聘中' && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleTakeDownJob(job.id)}>
                            <ArrowDownCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>下架岗位</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}