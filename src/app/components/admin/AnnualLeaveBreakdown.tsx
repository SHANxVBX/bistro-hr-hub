import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { mockUsers, mockLeaveRequests, User } from '../../data/mockData';
import { Download, Calendar, ChevronDown, ChevronUp, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export const AnnualLeaveBreakdown: React.FC = () => {
    const [activeTab, setActiveTab] = useState('office');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);

    const officeDepartments = ['IT', 'HR', 'Finance', 'Management'];
    // All others are restaurant
    const getStaff = (type: 'office' | 'restaurant') => {
        return mockUsers.filter(user => {
            if (type === 'office') return officeDepartments.includes(user.department);
            return !officeDepartments.includes(user.department);
        });
    };

    const getLeaveHistory = (userId: string) => {
        return mockLeaveRequests.filter(req => req.userId === userId && req.status === 'approved');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        // Collect all data
        const headers = ['Employee Name', 'Department', 'Position', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Reason'];
        const rows: string[] = [];

        mockUsers.forEach(user => {
            const leaves = getLeaveHistory(user.id);
            if (leaves.length > 0) {
                leaves.forEach(leave => {
                    rows.push([
                        user.name,
                        user.department,
                        user.position,
                        leave.type,
                        leave.startDate,
                        leave.endDate,
                        leave.days.toString(),
                        `"${leave.reason}"` // Quote reason to handle commas
                    ].join(','));
                });
            } else {
                // Should we include users with no leave? Let's just include leaves for this report.
            }
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `leave_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Leave report exported successfully');
    };

    const renderStaffList = (staff: User[]) => (
        <div className="space-y-4">
            {staff.map((employee) => {
                const leaveHistory = getLeaveHistory(employee.id);
                const isExpanded = expandedUser === employee.id;

                return (
                    <Card key={employee.id} className="overflow-hidden border border-gray-200">
                        <div
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setExpandedUser(isExpanded ? null : employee.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-100 p-2 rounded-full">
                                    <UserIcon className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">{employee.name}</h3>
                                    <p className="text-sm text-gray-500">{employee.position} • {employee.department}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right mr-4 hidden sm:block">
                                    <p className="text-xs text-gray-500">AL Balance</p>
                                    <p className="font-bold text-slate-700">{employee.alQuota - employee.alUsed} / {employee.alQuota}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="no-print"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Individual download logic could go here if needed
                                    }}
                                >
                                    <ChevronUp className={`h-4 w-4 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
                                </Button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-slate-50 border-t border-gray-200"
                                >
                                    <div className="p-4">
                                        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Leave History
                                        </h4>
                                        {leaveHistory.length > 0 ? (
                                            <div className="grid gap-3">
                                                {leaveHistory.map(leave => (
                                                    <div key={leave.id} className="bg-white p-3 rounded-md border border-gray-200 flex justify-between items-center text-sm">
                                                        <div>
                                                            <span className="font-medium text-slate-700">
                                                                {leave.startDate} to {leave.endDate}
                                                            </span>
                                                            <Badge variant="outline" className="ml-2">{leave.type}</Badge>
                                                        </div>
                                                        <div className="text-gray-500">
                                                            {leave.days} day(s) • {leave.reason}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No leave history found.</p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                );
            })}
        </div>
    );

    return (
        <Card className="w-full leave-breakdown-card">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="h-6 w-6" />
                    Annual Leave Breakdown
                </CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <button
                        data-slot="button"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3"
                        onClick={handlePrint}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-printer mr-2 h-4 w-4"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"></path><rect x="6" y="14" width="12" height="8" rx="1"></rect></svg>
                        Export & Print Leave Statements
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="office" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="office">Office Staff</TabsTrigger>
                        <TabsTrigger value="restaurant">Restaurant Staff</TabsTrigger>
                    </TabsList>

                    <TabsContent value="office" className="tab-content">
                        {renderStaffList(getStaff('office'))}
                    </TabsContent>

                    <TabsContent value="restaurant" className="tab-content">
                        {renderStaffList(getStaff('restaurant'))}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};
