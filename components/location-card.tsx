import Link from 'next/link';
import { MapPinned } from 'lucide-react';
import { Card } from '@/components/ui';
import { MASJID_COORDS } from '@/lib/utils';

export function LocationCard() {
  const mapLink = `https://www.google.com/maps?q=${MASJID_COORDS.lat},${MASJID_COORDS.lng}`;

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <MapPinned className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-bold">Lokasi Masjid</h3>
          <p className="text-sm text-foreground/70">Koordinat tersimpan untuk Masjid Al-Ikhlas.</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-muted p-4 text-sm">
        <p>Latitude: {MASJID_COORDS.lat}</p>
        <p>Longitude: {MASJID_COORDS.lng}</p>
      </div>
      <Link href={mapLink} className="mt-4 inline-flex rounded-2xl border px-4 py-3 text-sm font-semibold">
        Buka di Maps
      </Link>
    </Card>
  );
}
