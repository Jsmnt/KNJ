import { connection } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { UUID_PATTERN } from "@/lib/queue";

// DELETE /api/submissions/<id> — the submitter removes their own link.
// The browser must send the secret owner token it got when submitting,
// in the "x-owner-token" header. Without the right token, nothing is deleted.
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connection();

  const { id } = await params;
  const token = request.headers.get("x-owner-token") ?? "";

  if (!UUID_PATTERN.test(id) || !UUID_PATTERN.test(token)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("submissions")
    .delete()
    .eq("id", id)
    .eq("owner_token", token)
    .eq("status", "queue") // once it's been checked, it stays in Done
    .select("id");

  if (error) {
    return Response.json({ error: "Could not remove the link." }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return Response.json({ error: "Nothing to remove." }, { status: 404 });
  }
  return Response.json({ ok: true });
}
