import { AnnouncementFeed } from '@/components/announcement-feed';
import { HeroSlider } from '@/components/hero-slider';
import { LocationCard } from '@/components/location-card';
import { PrayerTimes } from '@/components/prayer-times';
import { QiblaCard } from '@/components/qibla-card';
import { Card } from '@/components/ui';
import { getHomeData } from '@/lib/queries';

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="space-y-6">
      <HeroSlider slides={data.slides} />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-6">
          <PrayerTimes />
          <AnnouncementFeed items={data.announcements} />
        </div>
        <div className="space-y-6">
          <QiblaCard />
          <LocationCard />
          <Card className="p-5">
            <h3 className="text-lg font-bold">Donasi</h3>
            <p className="mt-2 text-sm text-foreground/70">Coming soon. Nanti admin bisa aktifkan campaign dan QRIS di sini.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
