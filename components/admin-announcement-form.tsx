"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

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

      if (onPublished) {
        onPublished();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    }

    setLoading(false);
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
      <h2 className="text-2xl font-bold text-white">Kelola Informasi Teks</h2>

      <form onSubmit={handlePublish} className="mt-5 space-y-4">
        <input
          type="text"
          placeholder="Judul informasi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-3xl border border-white/10 bg-transparent px-5 py-4 text-white outline-none placeholder:text-white/45"
          required
        />

        <textarea
          placeholder="Isi informasi"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[160px] w-full rounded-3xl border border-white/10 bg-transparent px-5 py-4 text-white outline-none placeholder:text-white/45"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-green-500 px-6 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Publikasikan info"}
        </button>
      </form>

      {message ? (
        <p className="mt-4 text-sm text-white/70">{message}</p>
      ) : null}
    </div>
  );
}