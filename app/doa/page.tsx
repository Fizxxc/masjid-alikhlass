import { BookHeart } from 'lucide-react';
import { Card } from '@/components/ui';
import { doaList } from '@/lib/doa';

export default function DoaPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <BookHeart className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Doa-Doa Harian</h2>
          <p className="text-sm text-foreground/70">Halaman terpisah untuk doa pilihan sehari-hari.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {doaList.map((item) => (
          <Card key={item.id} className="p-5">
            <h3 className="text-lg font-bold">{item.title}</h3>
            <p className="mt-4 text-right text-2xl leading-loose">{item.arabic}</p>
            <p className="mt-4 text-sm italic text-foreground/75">{item.latin}</p>
            <p className="mt-3 text-sm text-foreground/75">{item.translation}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
