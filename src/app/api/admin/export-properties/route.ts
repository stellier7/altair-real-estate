import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getOptionalStaffProfile } from "@/lib/admin/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rowToProperty, type PropertyRow } from "@/lib/properties/serialize";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const profile = await getOptionalStaffProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");

  if (source === "json-backup") {
    const backupPath = path.join(
      process.cwd(),
      "backups/catalog-2026-10-12/properties.json",
    );
    const raw = await readFile(backupPath, "utf8");
    return new NextResponse(raw, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="altair-catalog-frozen-backup.json"',
      },
    });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("properties").select("*");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const properties = ((data ?? []) as PropertyRow[]).map(rowToProperty);
  const payload = {
    exportedAt: new Date().toISOString(),
    exportedBy: profile.email,
    count: properties.length,
    properties,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="altair-properties-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
