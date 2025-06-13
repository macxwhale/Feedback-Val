export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          is_super_admin: boolean | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_super_admin?: boolean | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_super_admin?: boolean | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      feedback_responses: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          question_category: Database["public"]["Enums"]["question_category"]
          question_id: string
          response_value: Json
          score: number | null
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          question_category: Database["public"]["Enums"]["question_category"]
          question_id: string
          response_value: Json
          score?: number | null
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          question_category?: Database["public"]["Enums"]["question_category"]
          question_id?: string
          response_value?: Json
          score?: number | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_responses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_sessions: {
        Row: {
          category_scores: Json | null
          completed_at: string | null
          created_at: string
          id: string
          organization_id: string
          started_at: string
          status: string
          total_score: number | null
          user_id: string | null
        }
        Insert: {
          category_scores?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          organization_id: string
          started_at?: string
          status?: string
          total_score?: number | null
          user_id?: string | null
        }
        Update: {
          category_scores?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          started_at?: string
          status?: string
          total_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_assets: {
        Row: {
          asset_name: string | null
          asset_type: string
          asset_url: string
          created_at: string
          display_order: number | null
          file_size: number | null
          id: string
          is_active: boolean | null
          mime_type: string | null
          organization_id: string
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          asset_name?: string | null
          asset_type: string
          asset_url: string
          created_at?: string
          display_order?: number | null
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          mime_type?: string | null
          organization_id: string
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          asset_name?: string | null
          asset_type?: string
          asset_url?: string
          created_at?: string
          display_order?: number | null
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          mime_type?: string | null
          organization_id?: string
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_assets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_themes: {
        Row: {
          colors: Json
          created_at: string
          id: string
          is_active: boolean | null
          organization_id: string
          spacing: Json | null
          theme_name: string
          typography: Json | null
          updated_at: string
        }
        Insert: {
          colors?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          organization_id: string
          spacing?: Json | null
          theme_name?: string
          typography?: Json | null
          updated_at?: string
        }
        Update: {
          colors?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          organization_id?: string
          spacing?: Json | null
          theme_name?: string
          typography?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_themes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_users: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          id: string
          invited_at: string | null
          invited_by_user_id: string | null
          organization_id: string
          role: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          id?: string
          invited_at?: string | null
          invited_by_user_id?: string | null
          organization_id: string
          role?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invited_at?: string | null
          invited_by_user_id?: string | null
          organization_id?: string
          role?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          billing_email: string | null
          created_at: string
          created_by_user_id: string | null
          custom_css: Json | null
          domain: string | null
          feedback_header_subtitle: string | null
          feedback_header_title: string | null
          flow_configuration: Json | null
          id: string
          is_active: boolean
          logo_storage_path: string | null
          logo_url: string | null
          max_responses: number | null
          name: string
          plan_type: string | null
          primary_color: string | null
          secondary_color: string | null
          settings: Json | null
          slug: string
          thank_you_message: string | null
          thank_you_title: string | null
          trial_ends_at: string | null
          updated_at: string
          welcome_screen_description: string | null
          welcome_screen_title: string | null
        }
        Insert: {
          billing_email?: string | null
          created_at?: string
          created_by_user_id?: string | null
          custom_css?: Json | null
          domain?: string | null
          feedback_header_subtitle?: string | null
          feedback_header_title?: string | null
          flow_configuration?: Json | null
          id?: string
          is_active?: boolean
          logo_storage_path?: string | null
          logo_url?: string | null
          max_responses?: number | null
          name: string
          plan_type?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          settings?: Json | null
          slug: string
          thank_you_message?: string | null
          thank_you_title?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          welcome_screen_description?: string | null
          welcome_screen_title?: string | null
        }
        Update: {
          billing_email?: string | null
          created_at?: string
          created_by_user_id?: string | null
          custom_css?: Json | null
          domain?: string | null
          feedback_header_subtitle?: string | null
          feedback_header_title?: string | null
          flow_configuration?: Json | null
          id?: string
          is_active?: boolean
          logo_storage_path?: string | null
          logo_url?: string | null
          max_responses?: number | null
          name?: string
          plan_type?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          settings?: Json | null
          slug?: string
          thank_you_message?: string | null
          thank_you_title?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          welcome_screen_description?: string | null
          welcome_screen_title?: string | null
        }
        Relationships: []
      }
      question_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      question_types: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          name: string
          supports_options: boolean | null
          supports_scale: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          name: string
          supports_options?: boolean | null
          supports_scale?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          name?: string
          supports_options?: boolean | null
          supports_scale?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: Database["public"]["Enums"]["question_category"]
          category_id: string
          created_at: string
          id: string
          is_active: boolean
          options: Json | null
          order_index: number
          organization_id: string
          question_text: string
          question_type: string
          required: boolean
          scale: Json | null
          type_id: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["question_category"]
          category_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          options?: Json | null
          order_index: number
          organization_id: string
          question_text: string
          question_type: string
          required?: boolean
          scale?: Json | null
          type_id: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["question_category"]
          category_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          options?: Json | null
          order_index?: number
          organization_id?: string
          question_text?: string
          question_type?: string
          required?: boolean
          scale?: Json | null
          type_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_questions_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "question_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_questions_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_questions_type"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "question_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "question_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "question_types"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          invitation_token: string
          invited_by_user_id: string
          organization_id: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_by_user_id: string
          organization_id: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invited_by_user_id?: string
          organization_id?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_organization_invitation: {
        Args: { invitation_token: string }
        Returns: Json
      }
      get_current_user_admin_status: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_organization_config: {
        Args: { org_slug: string }
        Returns: Json
      }
      is_current_user_org_admin: {
        Args: { org_id: string }
        Returns: boolean
      }
    }
    Enums: {
      question_category:
        | "QualityCommunication"
        | "QualityStaff"
        | "ValueForMoney"
        | "QualityService"
        | "LikeliRecommend"
        | "DidWeMakeEasy"
        | "Comments"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      question_category: [
        "QualityCommunication",
        "QualityStaff",
        "ValueForMoney",
        "QualityService",
        "LikeliRecommend",
        "DidWeMakeEasy",
        "Comments",
      ],
    },
  },
} as const
