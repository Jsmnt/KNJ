import { createClient } from "@supabase/supabase-js";

// Server-only database client.
// It uses the SECRET key, so only import this file from server code
// (API routes and server components) — never from a "use client" file.
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY. Check your .env.local file.");
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false },
  });
}