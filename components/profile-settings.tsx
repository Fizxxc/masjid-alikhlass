'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase-client';
import { Button, Card, Input } from '@/components/ui';
import { EnableNotificationButton } from "@/components/enable-notification-button";

type Profile = {
  id: string;
  full_name: string | null;
  address: string | null;
  avatar_url: string | null;
  push_enabled: boolean | null;
};

export function ProfileSettings({ profile }: { profile: Profile | null }) {
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    address: profile?.address ?? '',
    password: ''
  });
  const [message, setMessage] = useState('');

  async function saveProfile() {
    setMessage('Menyimpan...');
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name,
      address: form.address
    }).eq('id', userData.user.id);

    if (form.password) {
      await supabase.auth.updateUser({ password: form.password });
    }

    setMessage(error?.message ?? 'Profil berhasil diperbarui.');
  }

  async function uploadAvatar(file: File) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const path = `${userData.user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (error) return setMessage(error.message);
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', userData.user.id);
    setMessage('Foto profil berhasil diupload.');
  }

  async function updatePush(enabled: boolean) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    await supabase.from('profiles').update({ push_enabled: enabled }).eq('id', userData.user.id);
    setMessage(enabled ? 'Notifikasi diaktifkan.' : 'Notifikasi dimatikan.');
  }

  return (
    <div className="grid gap-5">
      <Card className="p-5">
        <h2 className="text-xl font-bold">Settings Profil</h2>
        <div className="mt-4 space-y-4">
          <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Nama" />
          <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Alamat" />
          <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Ganti sandi baru" type="password" />
          <div>
            <label className="mb-2 block text-sm font-medium">Upload foto profil</label>
            <Input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
          </div>
          <Button type="button" onClick={saveProfile}>Simpan perubahan</Button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-lg font-bold">Tema</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {['light', 'dark', 'system'].map((item) => (
            <button key={item} type="button" onClick={() => setTheme(item)} className={`rounded-2xl border px-4 py-3 text-sm ${theme === item ? 'border-primary bg-primary text-white' : ''}`}>
              {item}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
          <h3 className="text-xl font-bold">Notifikasi</h3>
          <div className="mt-4">
            <EnableNotificationButton />
          </div>
        </div>
      </Card>

      {message && <p className="text-sm text-foreground/70">{message}</p>}
    </div>
  );
}
