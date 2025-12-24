import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, UtensilsCrossed, Users, Sparkles } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { user, role, signIn, signUp, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');

  useEffect(() => {
    if (user && role) {
      // Redirect based on role
      const redirectPath = getRedirectPath(role);
      navigate(redirectPath, { replace: true });
    }
  }, [user, role, navigate]);

  const getRedirectPath = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return '/admin-dashboard';
      case 'finance':
        return '/finance-dashboard';
      case 'boss':
        return '/boss-dashboard';
      case 'maintainer':
        return '/maintainer-dashboard';
      default:
        return '/user-dashboard';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginEmail, loginPassword);

    if (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    }

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (signupPassword.length < 6) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(signupEmail, signupPassword, signupName);

    if (error) {
      let errorMessage = error.message;
      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please login instead.';
      }
      toast({
        title: 'Signup Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Account Created!',
        description: 'Welcome to Mallar Bistro HR System.',
      });
    }

    setIsLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-fade-up">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary blur-2xl opacity-30 rounded-full" />
            <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
          </div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md glass-card animate-scale-in relative">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <div className="absolute inset-0 gradient-primary blur-xl opacity-50 rounded-2xl" />
              <div className="p-4 gradient-primary rounded-2xl shadow-2xl relative">
                <UtensilsCrossed className="h-10 w-10 text-primary-foreground" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-primary animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold gradient-text animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Mallar Bistro
          </CardTitle>
          <CardDescription className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            HR Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/50">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 gradient-primary rounded-xl shadow-lg hover-lift font-semibold text-primary-foreground" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    className="h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 gradient-primary rounded-xl shadow-lg hover-lift font-semibold text-primary-foreground" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground text-center mb-4 font-medium">
              Quick Login (Demo)
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { label: 'User', email: 'user@mallar.com', color: 'from-blue-500 to-blue-600' },
                { label: 'Admin', email: 'admin@mallar.com', color: 'from-purple-500 to-purple-600' },
                { label: 'Finance', email: 'finance@mallar.com', color: 'from-green-500 to-green-600' },
                { label: 'Boss', email: 'boss@mallar.com', color: 'from-amber-500 to-amber-600' },
                { label: 'Maint', email: 'maintainer@mallar.com', color: 'from-red-500 to-red-600' },
              ].map((demo, index) => (
                <Button
                  key={demo.email}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 animate-fade-up opacity-0"
                  style={{ animationDelay: `${0.5 + index * 0.05}s`, animationFillMode: 'forwards' }}
                  onClick={() => {
                    setLoginEmail(demo.email);
                    setLoginPassword('password123');
                  }}
                >
                  {demo.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Click to auto-fill, then press Login
            </p>
            
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full mt-4 rounded-xl h-11 bg-muted/50 hover:bg-muted transition-all duration-300"
              disabled={isSeeding}
              onClick={async () => {
                setIsSeeding(true);
                try {
                  const { data, error } = await supabase.functions.invoke('seed-demo-users');
                  if (error) throw error;
                  toast({
                    title: 'Demo Accounts Created!',
                    description: 'All 5 demo accounts are now ready to use.',
                  });
                  console.log('Seed results:', data);
                } catch (error) {
                  console.error('Seeding error:', error);
                  toast({
                    title: 'Seeding Failed',
                    description: error instanceof Error ? error.message : 'Failed to create demo accounts',
                    variant: 'destructive',
                  });
                } finally {
                  setIsSeeding(false);
                }
              }}
            >
              {isSeeding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Demo Accounts...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Setup Demo Accounts (First Time)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
