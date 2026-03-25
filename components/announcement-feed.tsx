import { Card } from '@/components/ui';

type Announcement = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export function AnnouncementFeed({ items }: { items: Announcement[] }) {
  return (
    <Card className="p-5">
      <h3 className="text-lg font-bold">Info & Pengumuman</h3>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-foreground/70">Belum ada info terbaru.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border p-4">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-foreground/75">{item.content}</p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
