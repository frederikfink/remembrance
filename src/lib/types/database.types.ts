export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: number
          created_at: string
          created_by: string
          list_id: string
          name: string
        }
        Insert: {
          id?: number
          created_at?: string
          created_by: string
          list_id: string
          name: string
        }
        Update: {
          id?: number
          created_at?: string
          created_by?: string
          list_id?: string
          name?: string
        }
      }
      lists: {
        Row: {
          id: number
          created_at: string
          name: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
        }
      }
      test: {
        Row: {
          id: number
          created_at: string | null
          etetest: number | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          etetest?: number | null
        }
        Update: {
          id?: number
          created_at?: string | null
          etetest?: number | null
        }
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
  }
}
