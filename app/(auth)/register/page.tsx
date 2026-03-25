import Link from 'next/link';
import { AuthForm } from '@/components/auth-form';

export default function RegisterPage() {
  return (
    <div className="py-10">
      <AuthForm type="register" />
      <p className="mt-4 text-center text-sm text-foreground/70">Sudah punya akun? <Link href="/login" className="text-primary">Masuk</Link></p>
    </div>
  );
}
