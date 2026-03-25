'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';

type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
};

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <Card className="overflow-hidden p-8">
        <p className="text-sm text-foreground/70">Admin belum menambahkan slide. Tambahkan banner kegiatan, kajian, atau pengumuman utama.</p>
      </Card>
    );
  }

  const slide = slides[index];

  return (
    <Card className="relative overflow-hidden">
      <div className="relative h-[240px] w-full md:h-[320px]">
        <Image src={slide.image_url} alt={slide.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.22em]">Masjid Al-Ikhlas</p>
          <h2 className="mt-2 text-2xl font-bold">{slide.title}</h2>
          {slide.subtitle && <p className="mt-2 max-w-xl text-sm text-white/85">{slide.subtitle}</p>}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2">
        {slides.map((item, dotIndex) => (
          <span key={item.id} className={`h-2.5 w-2.5 rounded-full ${dotIndex === index ? 'bg-white' : 'bg-white/40'}`} />
        ))}
      </div>
    </Card>
  );
}
