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
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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
  { label: 'Leave', href: '/admin-dashboard/leave', icon: CalendarDays, roles: ['admin'] },
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

export function MobileBottomNav() {
  const { role } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const filteredNavItems = navItems.filter((item) =>
    role ? item.roles.includes(role) : false
  );

  // Show first 4 items in bottom bar, rest in more menu
  const primaryItems = filteredNavItems.slice(0, 4);
  const secondaryItems = filteredNavItems.slice(4);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glass background with blur */}
      <div className="glass border-t border-border/50 px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {primaryItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300',
                  'animate-fade-up opacity-0',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className={cn(
                  'relative p-2 rounded-xl transition-all duration-300',
                  isActive && 'gradient-primary'
                )}>
                  <Icon className={cn(
                    'h-5 w-5 transition-transform duration-300',
                    isActive ? 'text-primary-foreground scale-110' : ''
                  )} />
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg -z-10" />
                  )}
                </div>
                <span className={cn(
                  'text-[10px] font-medium mt-0.5 transition-colors duration-300',
                  isActive ? 'text-primary' : ''
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More menu */}
          {secondaryItems.length > 0 && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    'flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300',
                    'text-muted-foreground hover:text-foreground animate-fade-up opacity-0'
                  )}
                  style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
                >
                  <div className="p-2 rounded-xl">
                    <Menu className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-medium mt-0.5">More</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="glass-card rounded-t-3xl border-t-0 pb-safe">
                <SheetHeader>
                  <SheetTitle className="text-left">More Options</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-4 gap-4 py-6">
                  {secondaryItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300',
                          'animate-scale-in opacity-0',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
                      >
                        <Icon className="h-6 w-6 mb-1" />
                        <span className="text-xs font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
}