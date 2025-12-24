// Database types matching Supabase schema
export type AppRole = 'user' | 'admin' | 'finance' | 'boss' | 'maintainer';
export type EmployeeType = 'malaysian' | 'foreign';
export type Department = 'kitchen' | 'front_of_house' | 'management' | 'finance' | 'it';
export type LeaveType = 'annual' | 'medical' | 'emergency';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'reimbursed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type AttendanceStatus = 'in_office' | 'out_for_lunch' | 'out_of_office' | 'out_to_mallar';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  employee_type: EmployeeType;
  department: Department;
  position: string;
  salary: number;
  date_of_joining: string;
  annual_leave_quota: number;
  medical_leave_quota: number;
  annual_leave_used: number;
  medical_leave_used: number;
  medical_claim_limit: number;
  medical_claim_used: number;
  ic_number?: string;
  passport_number?: string;
  visa_expiry_date?: string;
  typhoid_injection_expiry?: string;
  sijil_kursus?: boolean;
  permit_cost?: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Attendance {
  id: string;
  user_id: string;
  check_in?: string;
  check_out?: string;
  total_hours?: number;
  status: AttendanceStatus;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: string;
  user_id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string;
  attachment_url?: string;
  status: RequestStatus;
  reviewer_id?: string;
  reviewer_comment?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalClaim {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  visit_date: string;
  receipt_url: string;
  status: ClaimStatus;
  reviewer_id?: string;
  reviewer_comment?: string;
  reviewed_at?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  assigned_to: string;
  assigned_by?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}
