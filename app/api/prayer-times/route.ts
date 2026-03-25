import { NextResponse } from 'next/server';

export async function GET() {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const today = new Date().getDate();

  const payload = {
    provinsi: process.env.NEXT_PUBLIC_MASJID_PROVINCE ?? 'Jawa Barat',
    kabkota: process.env.NEXT_PUBLIC_MASJID_CITY ?? 'Kota Bekasi',
    bulan: month,
    tahun: year
  };

  const res = await fetch('https://equran.id/api/v2/shalat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store'
  });

  const json = await res.json();
  const item = json?.data?.jadwal?.find((x: { tanggal: number | string }) => String(x.tanggal).endsWith(`-${String(today).padStart(2, '0')}`)) ?? json?.data?.jadwal?.[today - 1];

  return NextResponse.json({
    location: `${payload.kabkota}, ${payload.provinsi}`,
    dateLabel: item?.tanggal ?? new Date().toLocaleDateString('id-ID'),
    times: {
      imsak: item?.imsak,
      subuh: item?.subuh,
      terbit: item?.terbit,
      dhuha: item?.dhuha,
      dzuhur: item?.dzuhur,
      ashar: item?.ashar,
      maghrib: item?.maghrib,
      isya: item?.isya
    }
  });
}
