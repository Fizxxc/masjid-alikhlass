import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportId, title, description } = body;

    const supabase = createServiceRoleClient();

    const { data: admins, error: adminError } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin");

    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 500 });
    }

    const adminIds = (admins ?? []).map((admin) => admin.id);

    if (adminIds.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "Tidak ada admin yang menerima notif",
      });
    }

    const response = await fetch("https://api.onesignal.com/notifications?c=push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY!}`,
      },
      body: JSON.stringify({
        app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        include_aliases: {
          external_id: adminIds,
        },
        target_channel: "push",
        headings: {
          id: "Laporan baru masuk",
          en: "Laporan baru masuk",
        },
        contents: {
          id: title || "Ada laporan baru dari jamaah",
          en: title || "Ada laporan baru dari jamaah",
        },
        data: {
          type: "report",
          reportId,
          description: description ?? "",
        },
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/admin/reports`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result?.errors || result || "Gagal kirim notif" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, result });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengirim notifikasi admin" },
      { status: 500 }
    );
  }
}