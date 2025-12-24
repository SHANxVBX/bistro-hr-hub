-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'finance', 'boss', 'maintainer');

-- Create enum for employee type
CREATE TYPE public.employee_type AS ENUM ('malaysian', 'foreign');

-- Create enum for department
CREATE TYPE public.department AS ENUM ('kitchen', 'front_of_house', 'management', 'finance', 'it');

-- Create enum for leave type
CREATE TYPE public.leave_type AS ENUM ('annual', 'medical', 'emergency');

-- Create enum for request status
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for claim status
CREATE TYPE public.claim_status AS ENUM ('pending', 'approved', 'rejected', 'reimbursed');

-- Create enum for task priority
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');

-- Create enum for task status
CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed');

-- Create enum for attendance status
CREATE TYPE public.attendance_status AS ENUM ('in_office', 'out_for_lunch', 'out_of_office', 'out_to_mallar');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    employee_type employee_type NOT NULL DEFAULT 'malaysian',
    department department NOT NULL DEFAULT 'front_of_house',
    position TEXT NOT NULL DEFAULT 'Staff',
    salary DECIMAL(10, 2) NOT NULL DEFAULT 0,
    date_of_joining DATE NOT NULL DEFAULT CURRENT_DATE,
    annual_leave_quota INTEGER NOT NULL DEFAULT 14,
    medical_leave_quota INTEGER NOT NULL DEFAULT 14,
    annual_leave_used INTEGER NOT NULL DEFAULT 0,
    medical_leave_used INTEGER NOT NULL DEFAULT 0,
    medical_claim_limit DECIMAL(10, 2) NOT NULL DEFAULT 1000,
    medical_claim_used DECIMAL(10, 2) NOT NULL DEFAULT 0,
    -- Malaysian specific
    ic_number TEXT,
    -- Foreign worker specific
    passport_number TEXT,
    visa_expiry_date DATE,
    typhoid_injection_expiry DATE,
    sijil_kursus BOOLEAN DEFAULT false,
    permit_cost DECIMAL(10, 2),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create attendance table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    total_hours DECIMAL(5, 2),
    status attendance_status DEFAULT 'in_office',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    leave_type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count INTEGER NOT NULL,
    reason TEXT NOT NULL,
    attachment_url TEXT,
    status request_status NOT NULL DEFAULT 'pending',
    reviewer_id UUID REFERENCES auth.users(id),
    reviewer_comment TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create medical_claims table
CREATE TABLE public.medical_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    visit_date DATE NOT NULL,
    receipt_url TEXT NOT NULL,
    status claim_status NOT NULL DEFAULT 'pending',
    reviewer_id UUID REFERENCES auth.users(id),
    reviewer_comment TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    priority task_priority NOT NULL DEFAULT 'medium',
    status task_status NOT NULL DEFAULT 'pending',
    due_date DATE,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Create function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.user_roles
    WHERE user_id = _user_id
    LIMIT 1
$$;

-- Create function to check if user is admin or above
CREATE OR REPLACE FUNCTION public.is_admin_or_above(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role IN ('admin', 'boss', 'maintainer')
    )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Admins can insert profiles"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_or_above(auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE
TO authenticated
USING (public.is_admin_or_above(auth.uid()));

-- User roles policies (only maintainers can modify roles)
CREATE POLICY "Users can view their own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Maintainers can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'maintainer'))
WITH CHECK (public.has_role(auth.uid(), 'maintainer'));

-- Allow inserting own role during signup
CREATE POLICY "Users can insert their own role"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Attendance policies
CREATE POLICY "Users can view their own attendance"
ON public.attendance FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all attendance"
ON public.attendance FOR SELECT
TO authenticated
USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Users can manage their own attendance"
ON public.attendance FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Leave requests policies
CREATE POLICY "Users can view their own leave requests"
ON public.leave_requests FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all leave requests"
ON public.leave_requests FOR SELECT
TO authenticated
USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Users can create their own leave requests"
ON public.leave_requests FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their pending leave requests"
ON public.leave_requests FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND status = 'pending')
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update all leave requests"
ON public.leave_requests FOR UPDATE
TO authenticated
USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Users can delete their pending leave requests"
ON public.leave_requests FOR DELETE
TO authenticated
USING (user_id = auth.uid() AND status = 'pending');

-- Medical claims policies
CREATE POLICY "Users can view their own claims"
ON public.medical_claims FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins and Finance can view all claims"
ON public.medical_claims FOR SELECT
TO authenticated
USING (public.is_admin_or_above(auth.uid()) OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Users can create their own claims"
ON public.medical_claims FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their pending claims"
ON public.medical_claims FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND status = 'pending')
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update all claims"
ON public.medical_claims FOR UPDATE
TO authenticated
USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Finance can update approved claims"
ON public.medical_claims FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'finance'));

-- Tasks policies
CREATE POLICY "Users can view their assigned tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (assigned_to = auth.uid());

CREATE POLICY "Admins can view all tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (public.is_admin_or_above(auth.uid()));

CREATE POLICY "Users can update their own task status"
ON public.tasks FOR UPDATE
TO authenticated
USING (assigned_to = auth.uid())
WITH CHECK (assigned_to = auth.uid());

CREATE POLICY "Admins can manage all tasks"
ON public.tasks FOR ALL
TO authenticated
USING (public.is_admin_or_above(auth.uid()))
WITH CHECK (public.is_admin_or_above(auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON public.attendance
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at
    BEFORE UPDATE ON public.leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_claims_updated_at
    BEFORE UPDATE ON public.medical_claims
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Create profile
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        NEW.email
    );
    
    -- Assign default 'user' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- Storage policies for documents bucket
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND public.is_admin_or_above(auth.uid()));

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);