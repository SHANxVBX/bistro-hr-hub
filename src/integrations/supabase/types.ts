export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          date: string
          id: string
          status: Database["public"]["Enums"]["attendance_status"] | null
          total_hours: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          id?: string
          status?: Database["public"]["Enums"]["attendance_status"] | null
          total_hours?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          id?: string
          status?: Database["public"]["Enums"]["attendance_status"] | null
          total_hours?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          attachment_url: string | null
          created_at: string
          days_count: number
          end_date: string
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string
          reviewed_at: string | null
          reviewer_comment: string | null
          reviewer_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          days_count: number
          end_date: string
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string
          reviewed_at?: string | null
          reviewer_comment?: string | null
          reviewer_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          days_count?: number
          end_date?: string
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string
          reviewed_at?: string | null
          reviewer_comment?: string | null
          reviewer_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medical_claims: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          paid_at: string | null
          receipt_url: string
          reviewed_at: string | null
          reviewer_comment: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["claim_status"]
          updated_at: string
          user_id: string
          visit_date: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          paid_at?: string | null
          receipt_url: string
          reviewed_at?: string | null
          reviewer_comment?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
          user_id: string
          visit_date: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          paid_at?: string | null
          receipt_url?: string
          reviewed_at?: string | null
          reviewer_comment?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
          user_id?: string
          visit_date?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          annual_leave_quota: number
          annual_leave_used: number
          avatar_url: string | null
          created_at: string
          date_of_joining: string
          department: Database["public"]["Enums"]["department"]
          email: string
          employee_type: Database["public"]["Enums"]["employee_type"]
          full_name: string
          ic_number: string | null
          id: string
          medical_claim_limit: number
          medical_claim_used: number
          medical_leave_quota: number
          medical_leave_used: number
          passport_number: string | null
          permit_cost: number | null
          position: string
          salary: number
          sijil_kursus: boolean | null
          typhoid_injection_expiry: string | null
          updated_at: string
          user_id: string
          visa_expiry_date: string | null
        }
        Insert: {
          annual_leave_quota?: number
          annual_leave_used?: number
          avatar_url?: string | null
          created_at?: string
          date_of_joining?: string
          department?: Database["public"]["Enums"]["department"]
          email: string
          employee_type?: Database["public"]["Enums"]["employee_type"]
          full_name: string
          ic_number?: string | null
          id?: string
          medical_claim_limit?: number
          medical_claim_used?: number
          medical_leave_quota?: number
          medical_leave_used?: number
          passport_number?: string | null
          permit_cost?: number | null
          position?: string
          salary?: number
          sijil_kursus?: boolean | null
          typhoid_injection_expiry?: string | null
          updated_at?: string
          user_id: string
          visa_expiry_date?: string | null
        }
        Update: {
          annual_leave_quota?: number
          annual_leave_used?: number
          avatar_url?: string | null
          created_at?: string
          date_of_joining?: string
          department?: Database["public"]["Enums"]["department"]
          email?: string
          employee_type?: Database["public"]["Enums"]["employee_type"]
          full_name?: string
          ic_number?: string | null
          id?: string
          medical_claim_limit?: number
          medical_claim_used?: number
          medical_leave_quota?: number
          medical_leave_used?: number
          passport_number?: string | null
          permit_cost?: number | null
          position?: string
          salary?: number
          sijil_kursus?: boolean | null
          typhoid_injection_expiry?: string | null
          updated_at?: string
          user_id?: string
          visa_expiry_date?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_by: string | null
          assigned_to: string
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"]
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          assigned_to: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_above: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "user" | "admin" | "finance" | "boss" | "maintainer"
      attendance_status:
        | "in_office"
        | "out_for_lunch"
        | "out_of_office"
        | "out_to_mallar"
      claim_status: "pending" | "approved" | "rejected" | "reimbursed"
      department: "kitchen" | "front_of_house" | "management" | "finance" | "it"
      employee_type: "malaysian" | "foreign"
      leave_type: "annual" | "medical" | "emergency"
      request_status: "pending" | "approved" | "rejected"
      task_priority: "low" | "medium" | "high"
      task_status: "pending" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "admin", "finance", "boss", "maintainer"],
      attendance_status: [
        "in_office",
        "out_for_lunch",
        "out_of_office",
        "out_to_mallar",
      ],
      claim_status: ["pending", "approved", "rejected", "reimbursed"],
      department: ["kitchen", "front_of_house", "management", "finance", "it"],
      employee_type: ["malaysian", "foreign"],
      leave_type: ["annual", "medical", "emergency"],
      request_status: ["pending", "approved", "rejected"],
      task_priority: ["low", "medium", "high"],
      task_status: ["pending", "in_progress", "completed"],
    },
  },
} as const
