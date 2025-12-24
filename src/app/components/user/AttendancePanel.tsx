import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { mockAttendanceRecords, AttendanceRecord } from '../../data/mockData';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface AttendancePanelProps {
  userId: string;
}

export const AttendancePanel: React.FC<AttendancePanelProps> = ({ userId }) => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentStatus, setCurrentStatus] = useState<AttendanceRecord['status']>('In Office');
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    // Load attendance records for this user
    const userRecords = mockAttendanceRecords.filter((r) => r.userId === userId);
    setAttendanceRecords(userRecords);

    // Check if there's a record for today
    const today = new Date().toISOString().split('T')[0];
    const todayRec = userRecords.find((r) => r.date === today);
    if (todayRec) {
      setTodayRecord(todayRec);
      setCurrentStatus(todayRec.status);
    }
  }, [userId]);

  const handleCheckIn = () => {
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    const date = now.toISOString().split('T')[0];

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId,
      date,
      checkIn: time,
      checkOut: null,
      status: currentStatus,
      workingHours: 0,
    };

    setTodayRecord(newRecord);
    setAttendanceRecords([newRecord, ...attendanceRecords]);
    toast.success(`Checked in at ${time}`);
  };

  const handleCheckOut = () => {
    if (!todayRecord) return;

    const now = new Date();
    const time = now.toTimeString().slice(0, 5);

    // Calculate working hours
    const checkInTime = todayRecord.checkIn || '00:00';
    const [inH, inM] = checkInTime.split(':').map(Number);
    const [outH, outM] = time.split(':').map(Number);
    const hours = outH + outM / 60 - (inH + inM / 60);

    const updatedRecord = {
      ...todayRecord,
      checkOut: time,
      workingHours: Math.round(hours * 100) / 100,
    };

    setTodayRecord(updatedRecord);
    setAttendanceRecords([
      updatedRecord,
      ...attendanceRecords.filter((r) => r.id !== todayRecord.id),
    ]);
    toast.success(`Checked out at ${time}. Total hours: ${updatedRecord.workingHours}`);
  };

  const handleStatusChange = (status: AttendanceRecord['status']) => {
    setCurrentStatus(status);
    if (todayRecord && !todayRecord.checkOut) {
      const updatedRecord = { ...todayRecord, status };
      setTodayRecord(updatedRecord);
      setAttendanceRecords([
        updatedRecord,
        ...attendanceRecords.filter((r) => r.id !== todayRecord.id),
      ]);
      toast.success(`Status updated to: ${status}`);
    }
  };

  const statusOptions: AttendanceRecord['status'][] = [
    'In Office',
    'Out for Lunch',
    'Out of Office',
    'Out to Mallar Bistro',
  ];

  return (
    <div className="space-y-4">
      {/* Check In/Out Card */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {!todayRecord?.checkIn ? (
              <Button onClick={handleCheckIn} className="flex-1" size="lg">
                <LogIn className="mr-2 h-5 w-5" />
                Check In
              </Button>
            ) : !todayRecord?.checkOut ? (
              <Button onClick={handleCheckOut} variant="destructive" className="flex-1" size="lg">
                <LogOut className="mr-2 h-5 w-5" />
                Check Out
              </Button>
            ) : (
              <div className="flex-1 p-4 bg-green-50 rounded-lg text-center">
                <p className="text-green-800">Attendance completed for today</p>
              </div>
            )}
          </div>

          {todayRecord && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Check In</p>
                <p className="text-lg">{todayRecord.checkIn || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check Out</p>
                <p className="text-lg">{todayRecord.checkOut || '-'}</p>
              </div>
              {todayRecord.checkOut && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Working Hours</p>
                  <p className="text-lg">{todayRecord.workingHours} hours</p>
                </div>
              )}
            </div>
          )}

          {/* Status Toggles */}
          {todayRecord && !todayRecord.checkOut && (
            <div className="space-y-2">
              <p className="text-sm">Current Status:</p>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    variant={currentStatus === status ? 'default' : 'outline'}
                    size="sm"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceRecords.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{record.date}</p>
                  <p className="text-sm text-gray-600">
                    {record.checkIn} - {record.checkOut || 'Not checked out'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{record.status}</Badge>
                  {record.checkOut && (
                    <span className="text-sm">{record.workingHours}h</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};