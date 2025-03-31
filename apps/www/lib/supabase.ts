// DEPRECATED: This file is being kept temporarily for backward compatibility
// New code should use the server-side pattern with API routes instead

import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// IMPORTANT: This warning is to help developers transition to the secure pattern
console.warn(
  "WARNING: Direct Supabase client usage is deprecated. Use API routes instead for better security.",
);

// This is a placeholder for the transition period
// The client below will not work without the NEXT_PUBLIC_ env vars
// which we are no longer using for security reasons
export const supabase = {
  from: () => {
    console.error("Direct Supabase client usage is not supported");
    return {
      select: () => Promise.reject("Use API routes instead"),
      insert: () => Promise.reject("Use API routes instead"),
      update: () => Promise.reject("Use API routes instead"),
      delete: () => Promise.reject("Use API routes instead"),
    };
  },
  auth: {
    getSession: () => Promise.reject("Use API routes instead"),
    signIn: () => Promise.reject("Use API routes instead"),
    signOut: () => Promise.reject("Use API routes instead"),
  },
  // Add other commonly used methods as needed
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error("Supabase error:", error);
  return {
    error: error.message || "An error occurred",
    details: error.details,
    hint: error.hint,
  };
};
