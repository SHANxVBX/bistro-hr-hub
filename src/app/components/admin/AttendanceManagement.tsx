import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { mockAttendanceRecords, mockUsers } from '../../data/mockData';
import { Search } from 'lucide-react';

export const AttendanceManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const attendanceWithUsers = mockAttendanceRecords.map((record) => ({
    ...record,
    user: mockUsers.find((u) => u.id === record.userId),
  }));

  const filteredAttendance = attendanceWithUsers.filter(
    (record) =>
      record.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm)
  );

  // Group by date
  const groupedByDate = filteredAttendance.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, typeof attendanceWithUsers>);

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      {Object.entries(groupedByDate)
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .map(([date, records]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle>{date}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{record.user?.name}</p>
                      <p className="text-sm text-gray-600">
                        {record.user?.department} - {record.user?.position}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-gray-600">In:</span> {record.checkIn || '-'}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Out:</span> {record.checkOut || '-'}
                      </div>
                      {record.checkOut && (
                        <div className="text-sm">
                          <span className="text-gray-600">Hours:</span> {record.workingHours}
                        </div>
                      )}
                      <Badge variant="outline">{record.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

      {Object.keys(groupedByDate).length === 0 && (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-500">No attendance records found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
