"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button, Card, Input, Textarea } from "@/components/ui";

type Props = {
  onPublished?: () => void;
};

export function AdminAnnouncementForm({ onPublished }: Props) {
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
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
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

      const notifyRes = await fetch("/api/notify/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          announcementId: data.id,
          title: data.title,
        }),
      });

      const notifyJson = await notifyRes.json().catch(() => null);

      if (!notifyRes.ok) {
        setMessage(
          notifyJson?.error ||
            "Informasi tersimpan, tetapi notifikasi gagal dikirim."
        );
        setLoading(false);
        return;
      }

      setTitle("");
      setContent("");
      setMessage("Informasi berhasil dipublikasikan dan notifikasi dikirim.");

      if (onPublished) onPublished();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
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
          required
        />

        <Textarea
          placeholder="Isi informasi"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <Button disabled={loading}>
          {loading ? "Memproses..." : "Publikasikan info"}
        </Button>
      </form>

      {message ? (
        <p className="mt-4 text-sm text-foreground/70">{message}</p>
      ) : null}
    </Card>
  );
}