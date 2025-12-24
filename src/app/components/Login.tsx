import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Mail, Lock, ChevronRight, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);

    if (success) {
      toast.success('Login successful!');
    } else {
      toast.error('Invalid email or password');
    }
  };

  const demoLogins = [
    { role: 'Admin (Kuugashini)', email: 'admin@mallarbistro.com', color: 'bg-blue-600' },
    { role: 'Boss (Segar Boss)', email: 'boss@mallarbistro.com', color: 'bg-slate-600' },
    { role: 'Finance (Laavenya)', email: 'finance@mallarbistro.com', color: 'bg-amber-600' },
    { role: 'User (Deva)', email: 'deva@mallarbistro.com', color: 'bg-emerald-600' },
    { role: 'Maintainer', email: 'maintainer@mallarbistro.com', color: 'bg-indigo-600' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="backdrop-blur-sm bg-white shadow-2xl border-0">
          <CardHeader className="text-center space-y-4 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-20 h-20 flex items-center justify-center"
            >
              <img src="/logo.png" alt="Mallar Bistro Logo" className="w-16 h-16 object-contain" />
            </motion.div>
            <div>
              <CardTitle className="text-3xl text-slate-800 font-bold">
                Mallar Bistro
              </CardTitle>
              <CardDescription className="text-base mt-2">HR Management System</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  size="lg"
                >
                  Login
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Quick Login</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-2">
                {demoLogins.map((demo, index) => (
                  <motion.button
                    key={demo.email}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    onClick={() => {
                      setEmail(demo.email);
                      setPassword('password123');
                    }}
                    className="group relative overflow-hidden rounded-lg p-3 text-left transition-all hover:shadow-md border border-gray-200 hover:border-transparent"
                  >
                    <div className={`absolute inset-0 ${demo.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-gray-900">
                          {demo.role}
                        </p>
                        <p className="text-xs text-gray-500">{demo.email}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </motion.button>
                ))}
              </div>

              <p className="text-xs text-center text-gray-500 mt-4">
                All demo accounts use password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">password123</span>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div >
  );
};