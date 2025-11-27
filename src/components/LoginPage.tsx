import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../App';

interface LoginPageProps {
  onLogin: (role: UserRole, username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('');
  const [errors, setErrors] = useState<{ username?: string; password?: string; role?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!username) newErrors.username = '请输入用户名';
    if (!password) newErrors.password = '请输入密码';
    if (!role) newErrors.role = '请选择角色';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onLogin(role as UserRole, username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[420px] shadow-xl">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="bg-[#1E3A8A] p-3 rounded-2xl">
                <Building2 className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-[#1E3A8A]">奉节智慧园区管理平台</CardTitle>
            <CardDescription>请选择您的角色并登录系统</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">角色选择</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className={errors.role ? 'border-red-500' : ''}>
                    <SelectValue placeholder="请选择登录角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="park">园区管理端</SelectItem>
                    <SelectItem value="enterprise">企业管理端</SelectItem>
                    <SelectItem value="finance">金融办管理端</SelectItem>
                    <SelectItem value="hr">人资管理端</SelectItem>
                    <SelectItem value="commerce">商务委管理端</SelectItem>
                    <SelectItem value="employment">就业局</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
              </div>

              <Button type="submit" className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                登录
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
