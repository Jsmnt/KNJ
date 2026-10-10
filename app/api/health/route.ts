import { connection } from "next/server";
import { getSupabase } from "@/lib/supabase";

// Visit /api/health to check that the site can talk to the database.
export async function GET() {
  await connection(); // run on every request, never at build time

  try {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from("submissions")
      .select("*", { count: "exact", head: true });

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }
    return Response.json({ ok: true, submissions: count });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}