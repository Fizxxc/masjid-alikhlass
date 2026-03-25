import { redirect } from 'next/navigation';
import { ProfileSettings } from '@/components/profile-settings';
import { getProfile, getSession } from '@/lib/queries';

export default async function ProfilePage() {
  const user = await getSession();
  if (!user) redirect('/login');
  const profile = await getProfile();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Profil & Settings</h2>
        <p className="text-sm text-foreground/70">Kelola foto profil, nama, alamat, password, tema, dan notifikasi.</p>
      </div>
      <ProfileSettings profile={profile} />
    </div>
  );
}
