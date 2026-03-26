import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { createClient } from "@/lib/supabase-server";
import { getProfile } from "@/lib/queries";

type Report = {
  id: string;
  title: string;
  category: string | null;
  description: string;
  status: string;
  created_at: string;
};

export default async function AdminPage() {
  const profile = await getProfile();

  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/");

  const supabase = await createClient();

  const { data: reports } = await supabase
    .from("reports")
    .select("id, title, category, description, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Admin</h2>
        <p className="text-sm text-foreground/70">
          Kelola info teks, slide home, dan semua laporan jamaah.
        </p>
      </div>

      <AdminDashboard reports={(reports as Report[]) ?? []} />
    </div>
  );
}