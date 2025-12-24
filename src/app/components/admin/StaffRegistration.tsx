import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
import { UserPlus, Save } from 'lucide-react';

export const StaffRegistration: React.FC = () => {
    const [activeTab, setActiveTab] = useState('foreign');
    const [isLoading, setIsLoading] = useState(false);

    // Common fields
    const [formData, setFormData] = useState({
        name: '',
        dateOfJoining: '',
        position: '',
        salary: '',
        // Malaysian
        icNumber: '',
        // Foreign
        passportNumber: '',
        visaExpiryDate: '',
        sijilKursus: 'no',
        typhoidExpiryDate: '',
        permitCost: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Registering staff:', { type: activeTab, ...formData });
        toast.success(`${activeTab === 'malaysian' ? 'Malaysian' : 'Foreign'} staff registered successfully`);

        // Reset form
        setFormData({
            name: '',
            dateOfJoining: '',
            position: '',
            salary: '',
            icNumber: '',
            passportNumber: '',
            visaExpiryDate: '',
            sijilKursus: 'no',
            typhoidExpiryDate: '',
            permitCost: '',
        });
        setIsLoading(false);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Staff Registration
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="foreign" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="foreign">Foreign Worker</TabsTrigger>
                        <TabsTrigger value="malaysian">Malaysian</TabsTrigger>
                    </TabsList>

                    <div className="space-y-4">
                        {/* Common Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    placeholder="Detailed position"
                                    value={formData.position}
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dateOfJoining">Date of Joining</Label>
                                <Input
                                    id="dateOfJoining"
                                    type="date"
                                    value={formData.dateOfJoining}
                                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary (RM)</Label>
                                <Input
                                    id="salary"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.salary}
                                    onChange={(e) => handleInputChange('salary', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Foreign Worker Specific Fields */}
                        <TabsContent value="foreign" className="space-y-4 mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="passportNumber">Passport Number</Label>
                                    <Input
                                        id="passportNumber"
                                        placeholder="Enter passport number"
                                        value={formData.passportNumber}
                                        onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="visaExpiryDate">Visa Expiry Date</Label>
                                    <Input
                                        id="visaExpiryDate"
                                        type="date"
                                        value={formData.visaExpiryDate}
                                        onChange={(e) => handleInputChange('visaExpiryDate', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sijilKursus">Sijil Kursus</Label>
                                    <Select
                                        value={formData.sijilKursus}
                                        onValueChange={(value) => handleInputChange('sijilKursus', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="typhoidExpiryDate">Typhoid Expiry Date</Label>
                                    <Input
                                        id="typhoidExpiryDate"
                                        type="date"
                                        value={formData.typhoidExpiryDate}
                                        onChange={(e) => handleInputChange('typhoidExpiryDate', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="permitCost">Permit Cost (RM)</Label>
                                    <Input
                                        id="permitCost"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.permitCost}
                                        onChange={(e) => handleInputChange('permitCost', e.target.value)}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Malaysian Specific Fields */}
                        <TabsContent value="malaysian" className="space-y-4 mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="icNumber">IC Number</Label>
                                    <Input
                                        id="icNumber"
                                        placeholder="e.g. 900101-14-1234"
                                        value={formData.icNumber}
                                        onChange={(e) => handleInputChange('icNumber', e.target.value)}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <div className="flex justify-end pt-4">
                            <Button onClick={handleSubmit} disabled={isLoading} className="w-full sm:w-auto">
                                <Save className="mr-2 h-4 w-4" />
                                {isLoading ? 'Registering...' : 'Register Staff'}
                            </Button>
                        </div>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
};
