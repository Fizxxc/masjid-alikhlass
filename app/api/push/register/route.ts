import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const body = await req.json().catch(() => ({}));

    const subscriptionId =
      body?.subscriptionId && typeof body.subscriptionId === "string"
        ? body.subscriptionId
        : null;

    const optedIn = Boolean(body?.optedIn);

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: missing bearer token" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.slice("Bearer ".length).trim();
    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: empty access token" },
        { status: 401 }
      );
    }

    const supabaseAdmin = createServiceRoleClient();

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "User tidak valid",
          detail: userError?.message ?? null,
        },
        { status: 401 }
      );
    }

    const payload = {
      user_id: user.id,
      channel: "push" as const,
      provider: "onesignal",
      external_user_id: user.id,
      player_id: subscriptionId,
      is_active: optedIn,
      last_seen_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("push_subscriptions")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        {
          error: "Database error",
          detail: error.message,
          code: error.code,
          hint: error.hint,
          payload,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unhandled error",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}