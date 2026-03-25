import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';

export default function LoginPage() {
  return (
    <div className="py-10">
      <AuthForm type="login" />
      <p className="mt-4 text-center text-sm text-foreground/70">Belum punya akun? <Link href="/register" className="text-primary">Daftar</Link></p>
    </div>
  );
}
