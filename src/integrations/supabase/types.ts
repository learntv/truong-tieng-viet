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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          avatar_emoji: string | null
          avatar_url: string | null
          country: string | null
          completed_count: number
          created_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string
          avatar_emoji?: string | null
          avatar_url?: string | null
          country?: string | null
          completed_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          avatar_emoji?: string | null
          avatar_url?: string | null
          country?: string | null
          completed_count?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bai: {
        Row: {
          id: string
          meta: Json | null
          noidung_id: string
          position: number
          text: Json
        }
        Insert: {
          id: string
          meta?: Json | null
          noidung_id: string
          position: number
          text: Json
        }
        Update: {
          id?: string
          meta?: Json | null
          noidung_id?: string
          position?: number
          text?: Json
        }
        Relationships: [
          {
            foreignKeyName: "bai_noidung_id_fkey"
            columns: ["noidung_id"]
            isOneToOne: false
            referencedRelation: "noidung"
            referencedColumns: ["id"]
          },
        ]
      }
      chang: {
        Row: {
          chude_id: string
          id: string
          position: number
          text: Json
        }
        Insert: {
          chude_id: string
          id: string
          position: number
          text: Json
        }
        Update: {
          chude_id?: string
          id?: string
          position?: number
          text?: Json
        }
        Relationships: [
          {
            foreignKeyName: "chang_chude_id_fkey"
            columns: ["chude_id"]
            isOneToOne: false
            referencedRelation: "chude"
            referencedColumns: ["id"]
          },
        ]
      }
      chude: {
        Row: {
          id: string
          position: number
          quyen_id: string
          text: Json
        }
        Insert: {
          id: string
          position: number
          quyen_id: string
          text: Json
        }
        Update: {
          id?: string
          position?: number
          quyen_id?: string
          text?: Json
        }
        Relationships: [
          {
            foreignKeyName: "chude_quyen_id_fkey"
            columns: ["quyen_id"]
            isOneToOne: false
            referencedRelation: "quyen"
            referencedColumns: ["id"]
          },
        ]
      }
      hinh: {
        Row: {
          bai_id: string
          id: string
          position: number
          storage_bucket: string
          storage_path: string
          text: Json
          uploaded_at: string | null
        }
        Insert: {
          bai_id: string
          id: string
          position: number
          storage_bucket?: string
          storage_path: string
          text: Json
          uploaded_at?: string | null
        }
        Update: {
          bai_id?: string
          id?: string
          position?: number
          storage_bucket?: string
          storage_path?: string
          text?: Json
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hinh_bai_id_fkey"
            columns: ["bai_id"]
            isOneToOne: false
            referencedRelation: "bai"
            referencedColumns: ["id"]
          },
        ]
      }
      noidung: {
        Row: {
          chang_id: string
          id: string
          position: number
          text: Json
        }
        Insert: {
          chang_id: string
          id: string
          position: number
          text: Json
        }
        Update: {
          chang_id?: string
          id?: string
          position?: number
          text?: Json
        }
        Relationships: [
          {
            foreignKeyName: "noidung_chang_id_fkey"
            columns: ["chang_id"]
            isOneToOne: false
            referencedRelation: "chang"
            referencedColumns: ["id"]
          },
        ]
      }
      quyen: {
        Row: {
          created_at: string
          id: string
          source_file: string
        }
        Insert: {
          created_at?: string
          id: string
          source_file: string
        }
        Update: {
          created_at?: string
          id?: string
          source_file?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          user_id: string    // uuid
          chang_id: string   // text (matches chang.id type)
          noidung_index: number
          completed_at: string | null
        }
        Insert: {
          user_id: string
          chang_id: string
          noidung_index?: number
          completed_at?: string | null
        }
        Update: {
          user_id?: string
          chang_id?: string
          noidung_index?: number
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_chang_id_fkey"
            columns: ["chang_id"]
            isOneToOne: false
            referencedRelation: "chang"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
