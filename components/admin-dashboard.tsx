'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { Button, Card, Input, Textarea } from '@/components/ui';

type Report = {
  id: string;
  title: string;
  category: string;
  content: string;
  status: string;
  created_at: string;
};

export function AdminDashboard({ reports }: { reports: Report[] }) {
  const supabase = createClient();
  const [announcement, setAnnouncement] = useState({ title: '', content: '' });
  const [slide, setSlide] = useState({ title: '', subtitle: '', imageUrl: '' });
  const [message, setMessage] = useState('');

  async function saveAnnouncement() {
    const { error } = await supabase.from('announcements').insert({
      title: announcement.title,
      content: announcement.content,
      is_active: true
    });
    setMessage(error?.message ?? 'Informasi teks berhasil ditambahkan.');
    if (!error) setAnnouncement({ title: '', content: '' });
  }

  async function saveSlide() {
    const { error } = await supabase.from('slides').insert({
      title: slide.title,
      subtitle: slide.subtitle,
      image_url: slide.imageUrl,
      is_active: true,
      sort_order: 0
    });
    setMessage(error?.message ?? 'Slide berhasil ditambahkan.');
    if (!error) setSlide({ title: '', subtitle: '', imageUrl: '' });
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('reports').update({ status }).eq('id', id);
    setMessage('Status laporan diperbarui.');
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <div className="space-y-5">
        <Card className="p-5">
          <h2 className="text-xl font-bold">Kelola Informasi Teks</h2>
          <div className="mt-4 space-y-4">
            <Input placeholder="Judul informasi" value={announcement.title} onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })} />
            <Textarea placeholder="Isi informasi" value={announcement.content} onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })} />
            <Button type="button" onClick={saveAnnouncement}>Publikasikan info</Button>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-bold">Kelola Slide Home</h2>
          <div className="mt-4 space-y-4">
            <Input placeholder="Judul slide" value={slide.title} onChange={(e) => setSlide({ ...slide, title: e.target.value })} />
            <Input placeholder="Subjudul" value={slide.subtitle} onChange={(e) => setSlide({ ...slide, subtitle: e.target.value })} />
            <Input placeholder="URL gambar" value={slide.imageUrl} onChange={(e) => setSlide({ ...slide, imageUrl: e.target.value })} />
            <Button type="button" onClick={saveSlide}>Tambah slide</Button>
          </div>
        </Card>
      </div>
      <Card className="p-5">
        <h2 className="text-xl font-bold">Laporan Masuk</h2>
        <div className="mt-4 space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="rounded-2xl border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{report.title}</p>
                  <p className="text-xs text-foreground/60">{report.category} • {report.status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(report.id, 'diproses')} className="rounded-full border px-3 py-1 text-xs">Proses</button>
                  <button onClick={() => updateStatus(report.id, 'selesai')} className="rounded-full border px-3 py-1 text-xs">Selesai</button>
                </div>
              </div>
              <p className="mt-2 text-sm text-foreground/75">{report.content}</p>
            </div>
          ))}
        </div>
        {message && <p className="mt-4 text-sm text-foreground/70">{message}</p>}
      </Card>
    </div>
  );
}
