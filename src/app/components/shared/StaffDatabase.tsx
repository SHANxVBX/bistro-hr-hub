import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { mockUsers } from '../../data/mockData';
import { Search, Users, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StaffDatabase: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);

    const filteredUsers = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search staff..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="text-sm text-gray-500">
                    Total Staff: {mockUsers.length}
                </div>
            </div>

            <div className="space-y-3">
                {filteredUsers.map((user, index) => {
                    const isExpanded = expandedUser === user.id;

                    return (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                className={`border transition-all duration-200 cursor-pointer ${isExpanded ? 'border-blue-300 ring-1 ring-blue-300 shadow-md' : 'hover:border-blue-200'
                                    }`}
                                onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                            >
                                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                            <p className="text-sm text-gray-500">{user.position} • {user.department}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge variant={user.nationality === 'foreign' ? 'secondary' : 'outline'}>
                                            {user.nationality === 'foreign' ? 'Foreign Worker' : 'Malaysian'}
                                        </Badge>
                                        <Badge variant="outline" className="capitalize">{user.role}</Badge>
                                        {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t bg-slate-50/50"
                                        >
                                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {/* Basic Info */}
                                                <div className="space-y-3">
                                                    <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                                                        Basic Information
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <span className="text-gray-500">Email:</span>
                                                        <span className="font-medium text-gray-900">{user.email}</span>

                                                        <span className="text-gray-500">Joined:</span>
                                                        <span className="font-medium text-gray-900">{user.dateOfJoining || '-'}</span>

                                                        <span className="text-gray-500">Salary:</span>
                                                        <span className="font-medium text-gray-900">RM {user.salary?.toLocaleString() || '-'}</span>
                                                    </div>
                                                </div>

                                                {/* Identification */}
                                                <div className="space-y-3">
                                                    <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                                                        Identification Documents
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        {user.nationality === 'malaysian' ? (
                                                            <>
                                                                <span className="text-gray-500">IC Number:</span>
                                                                <span className="font-medium text-gray-900">{user.icNumber || '-'}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-gray-500">Passport:</span>
                                                                <span className="font-medium text-gray-900">{user.passportNumber || '-'}</span>

                                                                <span className="text-gray-500">Visa Expiry:</span>
                                                                <span className="font-medium text-red-600">{user.visaExpiryDate || '-'}</span>

                                                                <span className="text-gray-500">Typhoid:</span>
                                                                <span className="font-medium text-gray-900">{user.typhoidExpiryDate || '-'}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Additional Info */}
                                                <div className="space-y-3">
                                                    <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                                                        Employment Details
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        {user.nationality === 'foreign' && (
                                                            <>
                                                                <span className="text-gray-500">Permit Cost:</span>
                                                                <span className="font-medium text-gray-900">RM {user.permitCost?.toLocaleString() || '-'}</span>

                                                                <span className="text-gray-500">Sijil Kursus:</span>
                                                                <span className="font-medium text-gray-900">
                                                                    {user.sijilKursus ? <Badge className="bg-green-100 text-green-800 border-0">Certified</Badge> : <Badge variant="outline">Not Certified</Badge>}
                                                                </span>
                                                            </>
                                                        )}
                                                        <span className="text-gray-500">Leave Balance:</span>
                                                        <span className="font-medium text-gray-900">{user.alQuota - user.alUsed} Days</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    );
                })}

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No staff members found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
};
