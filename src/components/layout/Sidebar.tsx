import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  FileText,
  CheckSquare,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  UtensilsCrossed,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  // User items
  { label: 'Dashboard', href: '/user-dashboard', icon: LayoutDashboard, roles: ['user'] },
  { label: 'Attendance', href: '/user-dashboard/attendance', icon: Clock, roles: ['user'] },
  { label: 'Leave', href: '/user-dashboard/leave', icon: CalendarDays, roles: ['user'] },
  { label: 'Claims', href: '/user-dashboard/claims', icon: FileText, roles: ['user'] },
  { label: 'Tasks', href: '/user-dashboard/tasks', icon: CheckSquare, roles: ['user'] },
  
  // Admin items
  { label: 'Dashboard', href: '/admin-dashboard', icon: LayoutDashboard, roles: ['admin'] },
  { label: 'Employees', href: '/admin-dashboard/employees', icon: Users, roles: ['admin'] },
  { label: 'Leave Requests', href: '/admin-dashboard/leave', icon: CalendarDays, roles: ['admin'] },
  { label: 'Claims', href: '/admin-dashboard/claims', icon: FileText, roles: ['admin'] },
  { label: 'Tasks', href: '/admin-dashboard/tasks', icon: CheckSquare, roles: ['admin'] },
  { label: 'Attendance', href: '/admin-dashboard/attendance', icon: Clock, roles: ['admin'] },
  
  // Finance items
  { label: 'Dashboard', href: '/finance-dashboard', icon: LayoutDashboard, roles: ['finance'] },
  { label: 'Payroll', href: '/finance-dashboard/payroll', icon: DollarSign, roles: ['finance'] },
  { label: 'Claims', href: '/finance-dashboard/claims', icon: FileText, roles: ['finance'] },
  
  // Boss items
  { label: 'Dashboard', href: '/boss-dashboard', icon: LayoutDashboard, roles: ['boss'] },
  { label: 'Overview', href: '/boss-dashboard/overview', icon: BarChart3, roles: ['boss'] },
  { label: 'Approvals', href: '/boss-dashboard/approvals', icon: CheckSquare, roles: ['boss'] },
  
  // Maintainer items
  { label: 'Dashboard', href: '/maintainer-dashboard', icon: LayoutDashboard, roles: ['maintainer'] },
  { label: 'Users', href: '/maintainer-dashboard/users', icon: Users, roles: ['maintainer'] },
  { label: 'Settings', href: '/maintainer-dashboard/settings', icon: Settings, roles: ['maintainer'] },
];

export function Sidebar() {
  const { role, profile, signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNavItems = navItems.filter((item) =>
    role ? item.roles.includes(role) : false
  );

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside
      className={cn(
        'h-screen glass-sidebar border-r border-border/50 flex flex-col transition-all duration-500 ease-out',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Header */}
      <div className={cn(
        'p-4 border-b border-border/50 flex items-center transition-all duration-300',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="p-2.5 gradient-primary rounded-xl shadow-lg">
              <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground tracking-tight">Mallar Bistro</h1>
              <p className="text-xs text-muted-foreground">HR System</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="p-2.5 gradient-primary rounded-xl shadow-lg">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300',
            collapsed && 'absolute right-2 top-4'
          )}
        >
          <div className={cn(
            'transition-transform duration-300',
            collapsed && 'rotate-180'
          )}>
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </div>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300',
                'animate-fade-up opacity-0 hover-lift',
                isActive
                  ? 'gradient-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
            >
              <Icon className={cn(
                'h-5 w-5 shrink-0 transition-transform duration-300',
                isActive ? 'scale-110' : 'group-hover:scale-105'
              )} />
              {!collapsed && (
                <span className="font-medium transition-colors duration-300">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border/50">
        {profile && (
          <div className={cn(
            'flex items-center gap-3 mb-3 p-2 rounded-xl bg-muted/30 transition-all duration-300',
            collapsed && 'justify-center p-2'
          )}>
            <Avatar className={cn(
              'ring-2 ring-primary/20 transition-all duration-300',
              collapsed ? 'h-8 w-8' : 'h-10 w-10'
            )}>
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
              <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-semibold">
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="min-w-0 flex-1 animate-fade-in">
                <p className="font-medium text-foreground text-sm truncate">
                  {profile.full_name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </div>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          onClick={handleSignOut}
          className={cn(
            'w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300',
            !collapsed && 'justify-start'
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
