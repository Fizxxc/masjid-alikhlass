import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { announcementId, title } = body;

    const supabase = createServiceRoleClient();

    const { data: activeSubs, error: subError } = await supabase
      .from("push_subscriptions")
      .select("external_user_id")
      .eq("is_active", true)
      .not("external_user_id", "is", null);

    if (subError) {
      return NextResponse.json({ error: subError.message }, { status: 500 });
    }

    const userIds = Array.from(
      new Set((activeSubs ?? []).map((x) => x.external_user_id).filter(Boolean))
    );

    if (userIds.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "Belum ada user yang subscribe notifikasi",
      });
    }

    const response = await fetch(
      "https://api.onesignal.com/notifications?c=push",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY!}`,
        },
        body: JSON.stringify({
          app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
          include_aliases: {
            external_id: userIds,
          },
          target_channel: "push",
          headings: {
            id: "Informasi baru masjid",
            en: "Informasi baru masjid",
          },
          contents: {
            id: title || "Ada pengumuman baru dari masjid",
            en: title || "Ada pengumuman baru dari masjid",
          },
          data: {
            type: "announcement",
            announcementId,
          },
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result?.errors || result || "Gagal kirim notif pengumuman" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan mengirim notifikasi pengumuman",
      },
      { status: 500 }
    );
  }
}