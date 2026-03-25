import { cache } from 'react';
import { createClient } from '@/lib/supabase-server';

export const getSession = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
});

export const getProfile = cache(async () => {
  const supabase = await createClient();
  const user = await getSession();
  if (!user) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return data;
});

export async function getHomeData() {
  const supabase = await createClient();
  const [{ data: announcements }, { data: slides }] = await Promise.all([
    supabase.from('announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(10),
    supabase.from('slides').select('*').eq('is_active', true).order('sort_order', { ascending: true })
  ]);

  return {
    announcements: announcements ?? [],
    slides: slides ?? []
  };
}
