import { formatTime } from '@/lib/utils';
import { Card } from '@/components/ui';

const labels: Record<string, string> = {
  imsak: 'Imsak',
  subuh: 'Subuh',
  terbit: 'Terbit',
  dhuha: 'Dhuha',
  dzuhur: 'Dzuhur',
  ashar: 'Ashar',
  maghrib: 'Maghrib',
  isya: 'Isya'
};

export async function PrayerTimes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/prayer-times`, { cache: 'no-store' });
  const data = await res.json();

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h3 className="text-lg font-bold">Jadwal Shalat Hari Ini</h3>
          <p className="text-sm text-foreground/70">{data.location} • {data.dateLabel}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Object.entries(data.times).map(([key, value]) => (
          <div key={key} className="rounded-2xl bg-muted p-4">
            <p className="text-xs uppercase tracking-wide text-foreground/60">{labels[key]}</p>
            <p className="mt-2 text-lg font-bold">{formatTime(String(value))}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
