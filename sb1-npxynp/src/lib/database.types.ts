export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          settings: Json
          status: 'active' | 'suspended' | 'pending_verification'
          lastLoginAt: string
          loginAttempts: number
          created_at: string
          is_admin: boolean
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          phone?: string | null
          settings?: Json
          status?: 'active' | 'suspended' | 'pending_verification'
          lastLoginAt?: string
          loginAttempts?: number
          created_at?: string
          is_admin?: boolean
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          settings?: Json
          status?: 'active' | 'suspended' | 'pending_verification'
          lastLoginAt?: string
          loginAttempts?: number
          created_at?: string
          is_admin?: boolean
        }
      }
      sleep_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          sleep_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          sleep_data: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          sleep_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}