import { connection } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { PUBLIC_COLUMNS, cleanName, toSubmission, type SubmissionRow } from "@/lib/queue";
import { normalizeUrl, siteKey } from "@/lib/utils";

// GET /api/submissions — everyone's queue and done list (no secret tokens).
export async function GET() {
  await connection();

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("submissions")
    .select(PUBLIC_COLUMNS)
    .order("created_at", { ascending: true })
    .limit(500);

  if (error) {
    return Response.json({ error: "Could not load the queue." }, { status: 500 });
  }

  const items = (data as SubmissionRow[]).map(toSubmission);
  return Response.json({ items });
}

// POST /api/submissions — add a link to the queue.
// Body: { url: string, name?: string }
export async function POST(request: Request) {
  await connection();

  let body: { url?: unknown; name?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Check the link again on the server — never trust the browser alone.
  const raw = typeof body.url === "string" ? body.url : "";
  if (!raw.trim()) {
    return Response.json({ error: "Paste a link first." }, { status: 400 });
  }
  const url = normalizeUrl(raw);
  if (!url || url.length > 2048) {
    return Response.json({ error: "That doesn't look like a website link." }, { status: 400 });
  }

  const supabase = getSupabase();
  const key = siteKey(url);

  const { data, error } = await supabase
    .from("submissions")
    .insert({ url, name: cleanName(body.name), site_key: key })
    .select(`${PUBLIC_COLUMNS}, owner_token`)
    .single();

  if (error) {
    // 23505 = the database's "unique" rule said no: this website is already listed.
    if (error.code === "23505") {
      const { data: existing } = await supabase
        .from("submissions")
        .select("status")
        .eq("site_key", key)
        .maybeSingle();
      const message =
        existing?.status === "done"
          ? "This website has already been checked."
          : "This website is already in the queue.";
      return Response.json({ error: message }, { status: 409 });
    }
    return Response.json({ error: "Could not save your link. Please try again." }, { status: 500 });
  }

  const row = data as SubmissionRow & { owner_token: string };
  return Response.json(
    { item: toSubmission(row), ownerToken: row.owner_token },
    { status: 201 }
  );
}
