"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button, Card, Input, Textarea } from "@/components/ui";

export function ReportForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "Umum",
    description: "",
  });

  async function submitReport(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Silakan login dulu.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("reports")
        .insert({
          user_id: user.id,
          title: form.title,
          category: form.category,
          description: form.description,
          priority: "medium",
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      await fetch("/api/notify/admin-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: data.id,
          title: data.title,
          description: data.description,
        }),
      });

      setMessage("Laporan berhasil dikirim ke admin.");
      setForm({
        title: "",
        category: "Umum",
        description: "",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    }

    setLoading(false);
  }

  return (
    <Card className="max-w-2xl p-5">
      <h2 className="text-xl font-bold">Kirim Laporan</h2>
      <p className="mt-1 text-sm text-foreground/70">
        Masukan, kerusakan fasilitas, saran kegiatan, atau aduan jamaah.
      </p>

      <form onSubmit={submitReport} className="mt-4 space-y-4">
        <Input
          placeholder="Judul laporan"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <Input
          placeholder="Kategori"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <Textarea
          placeholder="Tulis detail laporan"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Button disabled={loading}>
          {loading ? "Mengirim..." : "Kirim laporan"}
        </Button>
      </form>

      {message && <p className="mt-4 text-sm text-foreground/70">{message}</p>}
    </Card>
  );
}