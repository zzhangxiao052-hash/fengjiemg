import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Video, Upload, GripVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';

interface CameraDevice {
  id: string;
  displayName: string; // 显示名称
  deviceType: string; // 设备类型：全景、动球、枪机
  streamUrl: string; // 视频流地址/设备ID
  zone: string; // 所属区域
  status: boolean; // 在线/离线状态
  order: number; // 排序
}

interface VideoMonitoringData {
  cameras: CameraDevice[];
  defaultCamera: string; // 默认选中设备ID
  ptzControlEnabled: boolean; // 云台控制权限
}

interface VideoMonitoringSettingsProps {
  videoMonitoringData: VideoMonitoringData;
  updateVideoMonitoring: (key: keyof VideoMonitoringData, value: any) => void;
  handleSaveVideoMonitoring: () => void;
}

export default function VideoMonitoringSettings({
  videoMonitoringData,
  updateVideoMonitoring,
  handleSaveVideoMonitoring
}: VideoMonitoringSettingsProps) {
  // 批量导入对话框状态
  const [batchImportOpen, setBatchImportOpen] = React.useState(false);
  const [batchImportText, setBatchImportText] = React.useState('');

  // 处理批量导入
  const handleBatchImport = () => {
    const lines = batchImportText.trim().split('\n').filter(line => line.trim());
    const newCameras: CameraDevice[] = [];
    
    lines.forEach((line, index) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const camera: CameraDevice = {
          id: `cam-${Date.now()}-${index}`,
          displayName: parts[0] || `摄像头${videoMonitoringData.cameras.length + index + 1}`,
          deviceType: parts[1] || '全景',
          streamUrl: parts[2] || '',
          zone: parts[3] || '草堂工业园',
          status: parts[4] === '离线' ? false : true,
          order: videoMonitoringData.cameras.length + index + 1
        };
        newCameras.push(camera);
      }
    });

    if (newCameras.length > 0) {
      updateVideoMonitoring('cameras', [...videoMonitoringData.cameras, ...newCameras]);
      toast.success(`成功导入 ${newCameras.length} 个摄像头`);
      setBatchImportOpen(false);
      setBatchImportText('');
    } else {
      toast.error('导入格式错误,请检查输入');
    }
  };

  // 设备类型颜色映射
  const getDeviceTypeColor = (type: string) => {
    switch (type) {
      case '全景': return 'bg-blue-100 text-blue-700 border-blue-300';
      case '动球': return 'bg-green-100 text-green-700 border-green-300';
      case '枪机': return 'bg-orange-100 text-orange-700 border-orange-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // 移动摄像头顺序
  const moveCameraUp = (index: number) => {
    if (index === 0) return;
    const newCameras = [...videoMonitoringData.cameras];
    [newCameras[index - 1], newCameras[index]] = [newCameras[index], newCameras[index - 1]];
    // 更新 order
    newCameras.forEach((cam, idx) => {
      cam.order = idx + 1;
    });
    updateVideoMonitoring('cameras', newCameras);
  };

  const moveCameraDown = (index: number) => {
    if (index === videoMonitoringData.cameras.length - 1) return;
    const newCameras = [...videoMonitoringData.cameras];
    [newCameras[index], newCameras[index + 1]] = [newCameras[index + 1], newCameras[index]];
    // 更新 order
    newCameras.forEach((cam, idx) => {
      cam.order = idx + 1;
    });
    updateVideoMonitoring('cameras', newCameras);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">视频监控点位管理</h2>
        <Button onClick={handleSaveVideoMonitoring} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          <Save className="w-4 h-4 mr-2" />
          保存全部配置
        </Button>
      </div>

      {/* 主要配置区域：摄像头设备列表 */}
      <Card className="border-2">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-bold border-l-4 border-blue-600 pl-3 flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" />
                视频监控点位配置
              </CardTitle>
              <CardDescription className="mt-2 ml-3">
                管理大屏左侧视频列表的摄像头设备,支持拖拽排序
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={batchImportOpen} onOpenChange={setBatchImportOpen}>
                <DialogTrigger asChild>
                  <Button className="border border-blue-600 bg-white text-blue-700 hover:bg-blue-50">
                    <Upload className="w-4 h-4 mr-2" />
                    批量导入
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>批量导入摄像头</DialogTitle>
                    <DialogDescription>
                      请按以下格式输入(每行一个):<br/>
                      显示名称, 设备类型(全景/动球/枪机), 视频流地址, 区域, 状态(在线/离线)
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea 
                    value={batchImportText}
                    onChange={(e) => setBatchImportText(e.target.value)}
                    placeholder="例如: 园区入口, 枪机, rtsp://..., 草堂工业园, 在线"
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <DialogFooter>
                    <Button className="border" onClick={() => setBatchImportOpen(false)}>取消</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleBatchImport}>确认导入</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button 
                onClick={() => {
                  const newCamera: CameraDevice = {
                    id: `cam-${Date.now()}`,
                    displayName: '',
                    deviceType: '枪机',
                    streamUrl: '',
                    zone: '草堂工业园',
                    status: true,
                    order: videoMonitoringData.cameras.length + 1
                  };
                  updateVideoMonitoring('cameras', [...videoMonitoringData.cameras, newCamera]);
                }}
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加设备
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[50px] text-center">排序</TableHead>
                <TableHead className="w-[200px]">显示名称</TableHead>
                <TableHead className="w-[120px]">设备类型</TableHead>
                <TableHead className="w-[300px]">视频流地址/设备ID</TableHead>
                <TableHead className="w-[150px]">所属区域</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videoMonitoringData.cameras.map((camera, index) => (
                <TableRow key={camera.id} className="hover:bg-slate-50">
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        disabled={index === 0}
                        onClick={() => moveCameraUp(index)}
                      >
                        <span className="text-xs">▲</span>
                      </Button>
                      <span className="text-xs font-mono text-slate-400">{index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        disabled={index === videoMonitoringData.cameras.length - 1}
                        onClick={() => moveCameraDown(index)}
                      >
                        <span className="text-xs">▼</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={camera.displayName} 
                      onChange={(e) => {
                        const newCameras = [...videoMonitoringData.cameras];
                        newCameras[index].displayName = e.target.value;
                        updateVideoMonitoring('cameras', newCameras);
                      }}
                      placeholder="设备显示名称"
                      className="font-medium"
                    />
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={camera.deviceType} 
                      onValueChange={(value: string) => {
                        const newCameras = [...videoMonitoringData.cameras];
                        newCameras[index].deviceType = value;
                        updateVideoMonitoring('cameras', newCameras);
                      }}
                    >
                      <SelectTrigger className={`h-9 ${getDeviceTypeColor(camera.deviceType)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="全景">全景</SelectItem>
                        <SelectItem value="动球">动球</SelectItem>
                        <SelectItem value="枪机">枪机</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={camera.streamUrl} 
                      onChange={(e) => {
                        const newCameras = [...videoMonitoringData.cameras];
                        newCameras[index].streamUrl = e.target.value;
                        updateVideoMonitoring('cameras', newCameras);
                      }}
                      placeholder="rtsp://... 或 设备ID"
                      className="font-mono text-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={camera.zone} 
                      onChange={(e) => {
                        const newCameras = [...videoMonitoringData.cameras];
                        newCameras[index].zone = e.target.value;
                        updateVideoMonitoring('cameras', newCameras);
                      }}
                      placeholder="所属区域"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={camera.status}
                        onCheckedChange={(checked: boolean) => {
                          const newCameras = [...videoMonitoringData.cameras];
                          newCameras[index].status = checked;
                          updateVideoMonitoring('cameras', newCameras);
                        }}
                      />
                      <span className={`text-xs ${camera.status ? 'text-green-600' : 'text-slate-400'}`}>
                        {camera.status ? '在线' : '离线'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        const newCameras = videoMonitoringData.cameras.filter((_, i) => i !== index);
                        updateVideoMonitoring('cameras', newCameras);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {videoMonitoringData.cameras.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                    暂无摄像头设备，请点击右上角添加
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 其他设置 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">默认选中设备</CardTitle>
            <CardDescription>进入页面时默认展示画面的设备</CardDescription>
          </CardHeader>
          <CardContent>
            <Select 
              value={videoMonitoringData.defaultCamera} 
              onValueChange={(value: string) => updateVideoMonitoring('defaultCamera', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择默认设备" />
              </SelectTrigger>
              <SelectContent>
                {videoMonitoringData.cameras.map(cam => (
                  <SelectItem key={cam.id} value={cam.id}>
                    {cam.displayName} ({cam.zone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">云台控制权限</CardTitle>
            <CardDescription>是否允许在前端页面控制云台设备</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
              <div className="space-y-0.5">
                <div className="font-medium text-slate-900">启用云台控制</div>
                <div className="text-sm text-slate-500">仅对支持PTZ的设备生效</div>
              </div>
              <Switch 
                checked={videoMonitoringData.ptzControlEnabled}
                onCheckedChange={(checked: boolean) => updateVideoMonitoring('ptzControlEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
