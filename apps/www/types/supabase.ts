<<<<<<< HEAD
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          website: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          website?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
=======
export type Database = {
  public: {
    Tables: {
      [key: string]: {
        Row: {}; // Will be populated with actual table row types
        Insert: {}; // Will be populated with insertion types
        Update: {}; // Will be populated with update types
      };
    };
    Views: {
      [key: string]: {
        Row: {}; // Will be populated with actual view row types
      };
    };
    Functions: {
      [key: string]: {
        Args: {}; // Will be populated with function argument types
        Returns: {}; // Will be populated with function return types
      };
    };
    Enums: {
      [key: string]: string[]; // Will be populated with enum values
    };
  };
};
>>>>>>> 113382bd7dd2ac82c70197c115e3a815f6d6d8d8
