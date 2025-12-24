import { useAuth } from '@/contexts/AuthContext';
import { useAttendance } from '@/hooks/useAttendance';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, FileText, DollarSign, LogIn, LogOut } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AttendanceStatus } from '@/types/database';

export default function UserDashboard() {
  const { profile } = useAuth();
  const { todayAttendance, loading, checkIn, checkOut, updateStatus } = useAttendance();

  const isCheckedIn = todayAttendance?.check_in && !todayAttendance?.check_out;
  const isCheckedOut = todayAttendance?.check_out;

  const remainingAL = (profile?.annual_leave_quota ?? 14) - (profile?.annual_leave_used ?? 0);
  const remainingMC = (profile?.medical_leave_quota ?? 14) - (profile?.medical_leave_used ?? 0);
  const remainingClaims = (profile?.medical_claim_limit ?? 1000) - (profile?.medical_claim_used ?? 0);

  const statusOptions: { value: AttendanceStatus; label: string }[] = [
    { value: 'in_office', label: 'In Office' },
    { value: 'out_for_lunch', label: 'Out for Lunch' },
    { value: 'out_of_office', label: 'Out of Office' },
    { value: 'out_to_mallar', label: 'Out to Mallar Bistro' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {profile?.full_name?.split(' ')[0] ?? 'User'}!
          </h1>
          <p className="text-muted-foreground">Here's your dashboard overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Annual Leave</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{remainingAL} days</div>
              <p className="text-xs text-muted-foreground">remaining of {profile?.annual_leave_quota ?? 14}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Medical Leave</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{remainingMC} days</div>
              <p className="text-xs text-muted-foreground">remaining of {profile?.medical_leave_quota ?? 14}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Claims Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">RM {remainingClaims.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">of RM {profile?.medical_claim_limit ?? 1000} limit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayAttendance?.total_hours?.toFixed(1) ?? '0.0'} hrs
              </div>
              <p className="text-xs text-muted-foreground">
                {isCheckedIn ? 'Currently working' : isCheckedOut ? 'Completed' : 'Not checked in'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={checkIn}
                  disabled={loading || !!isCheckedIn || !!isCheckedOut}
                  className="flex-1"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Check In
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={checkOut}
                  disabled={loading || !isCheckedIn}
                  className="flex-1"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Check Out
                </Button>
              </div>

              {isCheckedIn && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Status</label>
                  <Select
                    value={todayAttendance?.status}
                    onValueChange={(value) => updateStatus(value as AttendanceStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {todayAttendance && (
                <div className="text-sm text-muted-foreground space-y-1">
                  {todayAttendance.check_in && (
                    <p>Checked in: {new Date(todayAttendance.check_in).toLocaleTimeString()}</p>
                  )}
                  {todayAttendance.check_out && (
                    <p>Checked out: {new Date(todayAttendance.check_out).toLocaleTimeString()}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Department</span>
                <Badge variant="secondary" className="capitalize">
                  {profile?.department?.replace(/_/g, ' ') ?? 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Position</span>
                <span className="font-medium">{profile?.position ?? 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Employee Type</span>
                <Badge variant="outline" className="capitalize">
                  {profile?.employee_type ?? 'N/A'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Joined</span>
                <span className="font-medium">
                  {profile?.date_of_joining
                    ? new Date(profile.date_of_joining).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
