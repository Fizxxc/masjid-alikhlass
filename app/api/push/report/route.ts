import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  if (!process.env.ONESIGNAL_REST_API_KEY || !process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) {
    return NextResponse.json({ ok: false, message: 'OneSignal belum dikonfigurasi.' }, { status: 200 });
  }

  const response = await fetch('https://api.onesignal.com/notifications?c=push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Key ${process.env.ONESIGNAL_REST_API_KEY}`
    },
    body: JSON.stringify({
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      headings: { en: 'Laporan Baru Masjid', id: 'Laporan Baru Masjid' },
      contents: { en: `${body.title ?? 'Laporan baru'} • ${body.category ?? 'Umum'}`, id: `${body.title ?? 'Laporan baru'} • ${body.category ?? 'Umum'}` },
      included_segments: ['Subscribed Users'],
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/admin`
    })
  });

  const json = await response.json();
  return NextResponse.json({ ok: true, data: json });
}
