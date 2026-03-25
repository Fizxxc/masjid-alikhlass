'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-client';
import { Button, Card, Input } from '@/components/ui';

export function AuthForm({ type }: { type: 'login' | 'register' }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (type === 'register') {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name }
        }
      });
      setMessage(error?.message ?? 'Registrasi berhasil. Cek email untuk verifikasi bila diaktifkan.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });
      setMessage(error?.message ?? 'Login berhasil.');
      if (!error) router.push('/');
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <Card className="mx-auto max-w-md p-6">
      <h2 className="text-2xl font-bold">{type === 'login' ? 'Masuk' : 'Daftar Akun'}</h2>
      <p className="mt-1 text-sm text-foreground/70">Akses layanan jamaah dan dashboard admin.</p>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {type === 'register' && (
          <Input placeholder="Nama lengkap" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        )}
        <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Button disabled={loading} className="w-full">{loading ? 'Memproses...' : type === 'login' ? 'Masuk' : 'Daftar'}</Button>
      </form>
      {message && <p className="mt-4 text-sm text-foreground/70">{message}</p>}
    </Card>
  );
}
