import React, { useState } from 'react';
import { Button, ButtonProps } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Bell, ChevronDown, LogOut, User, Menu, ChevronRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: { id: string; label: string }[];
}

interface DashboardLayoutProps {
  username: string;
  roleLabel: string;
  menuItems: MenuItem[];
  currentPage: string;
  onPageChange: (pageId: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export default function DashboardLayout({
  username,
  roleLabel,
  menuItems,
  currentPage,
  onPageChange,
  onLogout,
  children,
}: DashboardLayoutProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showNotificationDetailModal, setShowNotificationDetailModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: '您有新的订单待处理', content: '订单号 #20230815001 等待您的确认。', timestamp: '2023-08-15 10:00', read: false },
    { id: '2', title: '系统维护通知', content: '系统将于今晚 22:00-23:00 进行维护，请提前保存您的工作。', timestamp: '2023-08-14 18:30', read: false },
    { id: '3', title: '平台政策更新', content: '新的平台使用政策已发布，请查阅。', timestamp: '2023-08-13 09:00', read: true },
    { id: '4', title: '您的服务“金融产品咨询”已上架', content: '您的服务“金融产品咨询服务”已成功上架，现在可以被用户发现。', timestamp: '2023-08-12 14:00', read: true },
  ]);

  const unreadNotifications = notifications.filter(n => !n.read);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowNotificationDetailModal(true);
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="bg-[#1E3A8A] text-white flex flex-col shadow-2xl"
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-white">智慧园区</h1>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            expandedMenus.includes(item.id) ? 'rotate-90' : ''
                          }`}
                        />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedMenus.includes(item.id) && !sidebarCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-6 mt-1 space-y-1 overflow-hidden"
                        >
                          {item.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => onPageChange(child.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                currentPage === child.id
                                  ? 'bg-white/20 text-white'
                                  : 'hover:bg-white/10 text-white/80'
                              }`}
                            >
                              {child.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-white/20 text-white'
                        : 'hover:bg-white/10 text-white/90'
                    }`}
                  >
                    {item.icon}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {!sidebarCollapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-sm text-white/70">当前角色</p>
              <p className="text-white">{roleLabel}</p>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-slate-700">奉节智慧园区管理平台</h2>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>通知</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className="flex flex-col items-start space-y-1"
                    >
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-slate-500">{notification.timestamp}</p>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem className="text-slate-500">暂无新通知</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-slate-100">
                  <div className="bg-[#1E3A8A] rounded-full p-2">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span>{username}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowChangePasswordModal(true)}>
                  <Lock className="h-4 w-4 mr-2" />
                  修改密码
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>

      <Dialog open={showChangePasswordModal} onOpenChange={setShowChangePasswordModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
            <DialogDescription>
              为了您的账户安全,请设置强密码
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentPassword" className="text-right">
                当前密码
              </Label>
              <Input id="currentPassword" type="password" placeholder="请输入当前密码" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">
                新密码
              </Label>
              <Input id="newPassword" type="password" placeholder="请输入新密码" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-right">
                确认密码
              </Label>
              <Input id="confirmPassword" type="password" placeholder="请再次输入新密码" className="col-span-3" />
            </div>
            <div className="mt-4 p-4 border rounded-md">
              <p className="font-semibold">密码要求 (至少满足3种条件):</p>
              <ul className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <li>× 至少8个字符</li>
                <li>× 包含大写字母</li>
                <li>× 包含小写字母</li>
                <li>× 包含数字</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            <Button type="submit" className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">确认修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotificationDetailModal} onOpenChange={setShowNotificationDetailModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title}</DialogTitle>
            <DialogDescription>
              {selectedNotification?.timestamp}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>{selectedNotification?.content}</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">关闭</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}