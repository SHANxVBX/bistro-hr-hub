// Mock data for the HR Management System

export type Role = 'maintainer' | 'admin' | 'finance' | 'boss' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  department: string;
  position: string;
  alQuota: number;
  mcQuota: number;
  medicalClaimQuota: number;
  alUsed: number;
  mcUsed: number;
  medicalClaimUsed: number;
  avatar?: string;
  // New fields for extended registration
  nationality?: 'malaysian' | 'foreign';
  dateOfJoining?: string;
  salary?: number;
  // Malaysian specific
  icNumber?: string;
  // Foreign specific
  passportNumber?: string;
  visaExpiryDate?: string;
  sijilKursus?: boolean;
  typhoidExpiryDate?: string;
  permitCost?: number;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'In Office' | 'Out for Lunch' | 'Out of Office' | 'Out to Mallar Bistro';
  workingHours: number;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  type: 'AL' | 'MC' | 'EL';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl?: string;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

export interface MedicalClaim {
  id: string;
  userId: string;
  date: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl?: string;
  appliedDate: string;
  approvedBy?: string;
}

export interface Payment {
  id: string;
  userId: string;
  type: 'salary' | 'bonus' | 'allowance' | 'reimbursement';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'not-required';
  date: string;
  recordedBy: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdDate: string;
}

export interface TodoItem {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  createdDate: string;
}

// Mock Users
// Mock Users
export const mockUsers: User[] = [
  {
    id: 'laavenya',
    name: 'Laavenya',
    email: 'laavenya@mallarbistro.com',
    password: 'password123',
    role: 'finance',
    department: 'Finance',
    position: 'Senior Executive',
    alQuota: 14,
    mcQuota: 14,
    medicalClaimQuota: 1000,
    alUsed: 0,
    mcUsed: 0,
    medicalClaimUsed: 0,
  },
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'maintainer@mallarbistro.com',
    password: 'password123',
    role: 'maintainer',
    department: 'IT',
    position: 'System Administrator',
    alQuota: 14,
    mcQuota: 14,
    medicalClaimQuota: 1000,
    alUsed: 3,
    mcUsed: 2,
    medicalClaimUsed: 350,
    nationality: 'malaysian',
    icNumber: '900101-14-1234',
    dateOfJoining: '2020-01-01',
    salary: 5000,
  },
  {
    id: '2',
    name: 'Kuugashini',
    email: 'admin@mallarbistro.com',
    password: 'password123',
    role: 'admin',
    department: 'HR',
    position: 'HR Manager',
    alQuota: 14,
    mcQuota: 14,
    medicalClaimQuota: 1000,
    alUsed: 5,
    mcUsed: 1,
    medicalClaimUsed: 200,
  },
  {
    id: '3',
    name: 'Laavenya',
    email: 'finance@mallarbistro.com',
    password: 'password123',
    role: 'finance',
    department: 'Finance',
    position: 'Finance Manager',
    alQuota: 14,
    mcQuota: 14,
    medicalClaimQuota: 1000,
    alUsed: 2,
    mcUsed: 0,
    medicalClaimUsed: 0,
  },
  {
    id: '4',
    name: 'Segar Boss',
    email: 'boss@mallarbistro.com',
    password: 'password123',
    role: 'boss',
    department: 'Management',
    position: 'CEO',
    alQuota: 21,
    mcQuota: 14,
    medicalClaimQuota: 2000,
    alUsed: 7,
    mcUsed: 0,
    medicalClaimUsed: 0,
  },
  {
    id: '5',
    name: 'Deva',
    email: 'deva@mallarbistro.com',
    password: 'password123',
    role: 'user',
    department: 'Kitchen',
    position: 'Chef',
    alQuota: 12,
    mcQuota: 14,
    medicalClaimQuota: 800,
    alUsed: 4,
    mcUsed: 3,
    medicalClaimUsed: 450,
    nationality: 'foreign',
    passportNumber: 'A12345678',
    visaExpiryDate: '2025-12-31',
    sijilKursus: true,
    typhoidExpiryDate: '2025-06-30',
    permitCost: 2000,
    dateOfJoining: '2022-03-15',
    salary: 3500,
  },
  {
    id: '6',
    name: 'James Lee',
    email: 'james@mallarbistro.com',
    password: 'password123',
    role: 'user',
    department: 'Front of House',
    position: 'Server',
    alQuota: 12,
    mcQuota: 14,
    medicalClaimQuota: 800,
    alUsed: 6,
    mcUsed: 4,
    medicalClaimUsed: 600,
  },
  {
    id: '7',
    name: 'Sophie Ng',
    email: 'sophie@mallarbistro.com',
    password: 'password123',
    role: 'user',
    department: 'Kitchen',
    position: 'Sous Chef',
    alQuota: 12,
    mcQuota: 14,
    medicalClaimQuota: 800,
    alUsed: 2,
    mcUsed: 1,
    medicalClaimUsed: 150,
  },
  {
    id: '8',
    name: 'Ryan Koh',
    email: 'ryan@mallarbistro.com',
    password: 'password123',
    role: 'user',
    department: 'Front of House',
    position: 'Bartender',
    alQuota: 12,
    mcQuota: 14,
    medicalClaimQuota: 800,
    alUsed: 5,
    mcUsed: 2,
    medicalClaimUsed: 320,
  },
  {
    id: 'u9',
    name: 'Ahmad bin Ali',
    email: 'ahmad@mallarbistro.com',
    password: 'password123',
    role: 'user',
    department: 'Kitchen',
    position: 'Junior Chef',
    alQuota: 12,
    alUsed: 1,
    mcQuota: 14,
    mcUsed: 0,
    medicalClaimQuota: 800,
    medicalClaimUsed: 50,
  },
  {
    id: 'u10',
    name: 'Siti Sarah',
    email: 'siti@mallarbistro.com',
    password: 'password123',
    role: 'user',
    department: 'Front of House',
    position: 'Waitress',
    alQuota: 12,
    alUsed: 4,
    mcQuota: 14,
    mcUsed: 6,
    medicalClaimQuota: 800,
    medicalClaimUsed: 120,
  },
  {
    id: 'u11',
    name: 'Muthu Kumar',
    email: 'muthu@mallarbistro.com',
    password: 'password123',
    role: 'user',
    department: 'Kitchen',
    position: 'Dishwasher',
    alQuota: 12,
    alUsed: 0,
    mcQuota: 14,
    mcUsed: 0,
    medicalClaimQuota: 800,
    medicalClaimUsed: 0,
  },
  {
    id: 'u12',
    name: 'Jessica Wong',
    email: 'jessica@mallarbistro.com',
    password: 'password123',
    role: 'user',
    department: 'Front of House',
    position: 'Hostess',
    alQuota: 12,
    alUsed: 2,
    mcQuota: 14,
    mcUsed: 1,
    medicalClaimQuota: 800,
    medicalClaimUsed: 80,
  },
  {
    id: 'u13',
    name: 'Rizal Malik',
    email: 'rizal@mallarbistro.com',
    password: 'password123',
    role: 'user',
    department: 'Kitchen',
    position: 'Prep Cook',
    alQuota: 12,
    alUsed: 5,
    mcQuota: 14,
    mcUsed: 2,
    medicalClaimQuota: 800,
    medicalClaimUsed: 150,
  }
];

// Mock Attendance Records
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att1',
    userId: '5',
    date: '2024-12-22',
    checkIn: '08:30',
    checkOut: null,
    status: 'In Office',
    workingHours: 0,
  },
  {
    id: 'att2',
    userId: '6',
    date: '2024-12-22',
    checkIn: '09:00',
    checkOut: null,
    status: 'Out for Lunch',
    workingHours: 0,
  },
  {
    id: 'att3',
    userId: '5',
    date: '2024-12-21',
    checkIn: '08:45',
    checkOut: '17:30',
    status: 'In Office',
    workingHours: 8.75,
  },
  {
    id: 'att4',
    userId: '6',
    date: '2024-12-21',
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'In Office',
    workingHours: 9,
  },
  {
    id: 'att5',
    userId: '7',
    date: '2024-12-21',
    checkIn: '08:30',
    checkOut: '17:00',
    status: 'In Office',
    workingHours: 8.5,
  },
  {
    id: 'att6',
    userId: '8',
    date: '2024-12-21',
    checkIn: '10:00',
    checkOut: '19:00',
    status: 'In Office',
    workingHours: 9,
  },
];

// Mock Leave Requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'leave1',
    userId: '5',
    type: 'AL',
    startDate: '2024-12-25',
    endDate: '2024-12-27',
    days: 3,
    reason: 'Christmas holiday',
    status: 'approved',
    appliedDate: '2024-12-10',
    approvedBy: '4',
    approvedDate: '2024-12-11',
  },
  {
    id: 'leave2',
    userId: '6',
    type: 'MC',
    startDate: '2024-12-20',
    endDate: '2024-12-20',
    days: 1,
    reason: 'Fever',
    status: 'approved',
    documentUrl: 'mock-mc-certificate.pdf',
    appliedDate: '2024-12-20',
    approvedBy: '2',
    approvedDate: '2024-12-20',
  },
  {
    id: 'leave3',
    userId: '7',
    type: 'AL',
    startDate: '2024-12-30',
    endDate: '2025-01-02',
    days: 4,
    reason: 'New Year break',
    status: 'pending',
    appliedDate: '2024-12-15',
  },
  {
    id: 'leave4',
    userId: '8',
    type: 'EL',
    startDate: '2024-12-23',
    endDate: '2024-12-23',
    days: 1,
    reason: 'Family emergency',
    status: 'pending',
    appliedDate: '2024-12-22',
  },
];

// Mock Medical Claims
export const mockMedicalClaims: MedicalClaim[] = [
  {
    id: 'claim1',
    userId: '5',
    date: '2024-12-15',
    amount: 120,
    description: 'Dental checkup',
    status: 'approved',
    documentUrl: 'mock-receipt.pdf',
    appliedDate: '2024-12-16',
    approvedBy: '2',
  },
  {
    id: 'claim2',
    userId: '6',
    date: '2024-12-18',
    amount: 85,
    description: 'GP consultation',
    status: 'pending',
    documentUrl: 'mock-receipt2.pdf',
    appliedDate: '2024-12-19',
  },
  {
    id: 'claim3',
    userId: '8',
    date: '2024-12-10',
    amount: 250,
    description: 'Physiotherapy session',
    status: 'approved',
    documentUrl: 'mock-receipt3.pdf',
    appliedDate: '2024-12-11',
    approvedBy: '2',
  },
];

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 'pay1',
    userId: '5',
    type: 'salary',
    amount: 3500,
    description: 'December 2024 Salary',
    status: 'completed',
    date: '2024-12-01',
    recordedBy: '3',
  },
  {
    id: 'pay2',
    userId: '6',
    type: 'salary',
    amount: 2800,
    description: 'December 2024 Salary',
    status: 'completed',
    date: '2024-12-01',
    recordedBy: '3',
  },
  {
    id: 'pay3',
    userId: '7',
    type: 'bonus',
    amount: 1000,
    description: 'Year-end bonus',
    status: 'pending',
    date: '2024-12-22',
    recordedBy: '3',
  },
  {
    id: 'pay4',
    userId: '8',
    type: 'allowance',
    amount: 200,
    description: 'Transport allowance',
    status: 'completed',
    date: '2024-12-15',
    recordedBy: '3',
  },
];

// Mock Tasks
export const mockTasks: Task[] = [
  {
    id: 'task1',
    title: 'Review leave requests',
    description: 'Review and approve pending leave requests for December',
    assignedTo: '2',
    assignedBy: '4',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-12-23',
    createdDate: '2024-12-20',
  },
  {
    id: 'task2',
    title: 'Process payroll',
    description: 'Process December payroll for all staff',
    assignedTo: '3',
    assignedBy: '4',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-12-25',
    createdDate: '2024-12-18',
  },
  {
    id: 'task3',
    title: 'Update employee records',
    description: 'Update employee information in the system',
    assignedTo: '2',
    assignedBy: '1',
    status: 'completed',
    priority: 'medium',
    dueDate: '2024-12-20',
    createdDate: '2024-12-15',
  },
];

// Mock Todo Items
export const mockTodoItems: TodoItem[] = [
  {
    id: 'todo1',
    userId: '2',
    text: 'Review medical claims',
    completed: false,
    createdDate: '2024-12-22',
  },
  {
    id: 'todo2',
    userId: '2',
    text: 'Update attendance policy',
    completed: true,
    createdDate: '2024-12-21',
  },
  {
    id: 'todo3',
    userId: '2',
    text: 'Schedule team meeting',
    completed: false,
    createdDate: '2024-12-20',
  },
];