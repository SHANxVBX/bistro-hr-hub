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

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground">Mallar Bistro</h1>
              <p className="text-xs text-muted-foreground">HR System</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && profile && (
          <div className="mb-3">
            <p className="font-medium text-sidebar-foreground text-sm truncate">
              {profile.full_name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          onClick={handleSignOut}
          className={cn('text-sidebar-foreground w-full', !collapsed && 'justify-start')}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
