"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button, Card, Input, Textarea } from "@/components/ui";

export function AdminAnnouncementForm() {
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Silakan login dulu.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("announcements")
        .insert({
          title,
          content,
          excerpt: content.slice(0, 120),
          is_published: true,
          published_at: new Date().toISOString(),
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      await fetch("/api/notify/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          announcementId: data.id,
          title: data.title,
        }),
      });

      setTitle("");
      setContent("");
      setMessage("Informasi berhasil dipublikasikan dan notifikasi dikirim.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    }

    setLoading(false);
  }

  return (
    <Card className="p-5">
      <h2 className="text-xl font-bold">Kelola Informasi Teks</h2>

      <form onSubmit={handlePublish} className="mt-4 space-y-4">
        <Input
          placeholder="Judul informasi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Isi informasi"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Button disabled={loading}>
          {loading ? "Memproses..." : "Publikasikan info"}
        </Button>
      </form>

      {message && <p className="mt-4 text-sm text-foreground/70">{message}</p>}
    </Card>
  );
}   