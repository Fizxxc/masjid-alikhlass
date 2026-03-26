"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Button, Card, Input, Textarea } from "@/components/ui";

type Report = {
  id: string;
  title: string;
  category: string | null;
  description: string;
  status: "pending" | "in_review" | "resolved" | "rejected" | string;
  created_at: string;
};

export function AdminDashboard({ reports }: { reports: Report[] }) {
  const supabase = createClient();

  const [announcement, setAnnouncement] = useState({
    title: "",
    content: "",
  });

  const [slide, setSlide] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
  });

  const [message, setMessage] = useState("");
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(false);
  const [loadingSlide, setLoadingSlide] = useState(false);
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);

  async function saveAnnouncement() {
    setLoadingAnnouncement(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Silakan login dulu.");
        setLoadingAnnouncement(false);
        return;
      }

      const { data, error } = await supabase
        .from("announcements")
        .insert({
          title: announcement.title,
          content: announcement.content,
          excerpt: announcement.content.slice(0, 120),
          is_published: true,
          published_at: new Date().toISOString(),
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        setMessage(error.message);
        setLoadingAnnouncement(false);
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
        setLoadingAnnouncement(false);
        return;
      }

      setAnnouncement({ title: "", content: "" });
      setMessage("Informasi teks berhasil dipublikasikan dan notifikasi dikirim.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    }

    setLoadingAnnouncement(false);
  }

  async function saveSlide() {
    setLoadingSlide(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Silakan login dulu.");
        setLoadingSlide(false);
        return;
      }

      const { error } = await supabase.from("hero_slides").insert({
        title: slide.title || null,
        subtitle: slide.subtitle || null,
        image_url: slide.imageUrl,
        sort_order: 0,
        is_active: true,
        created_by: user.id,
      });

      if (error) {
        setMessage(error.message);
        setLoadingSlide(false);
        return;
      }

      setSlide({ title: "", subtitle: "", imageUrl: "" });
      setMessage("Slide berhasil ditambahkan.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    }

    setLoadingSlide(false);
  }

  async function updateStatus(
    id: string,
    status: "in_review" | "resolved"
  ) {
    setUpdatingReportId(id);
    setMessage("");

    try {
      const { error } = await supabase
        .from("reports")
        .update({ status })
        .eq("id", id);

      if (error) {
        setMessage(error.message);
        setUpdatingReportId(null);
        return;
      }

      setMessage("Status laporan diperbarui. Silakan refresh untuk melihat data terbaru.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    }

    setUpdatingReportId(null);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <div className="space-y-5">
        <Card className="p-5">
          <h2 className="text-xl font-bold">Kelola Informasi Teks</h2>
          <div className="mt-4 space-y-4">
            <Input
              placeholder="Judul informasi"
              value={announcement.title}
              onChange={(e) =>
                setAnnouncement({ ...announcement, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Isi informasi"
              value={announcement.content}
              onChange={(e) =>
                setAnnouncement({ ...announcement, content: e.target.value })
              }
            />
            <Button
              type="button"
              onClick={saveAnnouncement}
              disabled={loadingAnnouncement}
            >
              {loadingAnnouncement ? "Memproses..." : "Publikasikan info"}
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-xl font-bold">Kelola Slide Home</h2>
          <div className="mt-4 space-y-4">
            <Input
              placeholder="Judul slide"
              value={slide.title}
              onChange={(e) => setSlide({ ...slide, title: e.target.value })}
            />
            <Input
              placeholder="Subjudul"
              value={slide.subtitle}
              onChange={(e) =>
                setSlide({ ...slide, subtitle: e.target.value })
              }
            />
            <Input
              placeholder="URL gambar"
              value={slide.imageUrl}
              onChange={(e) =>
                setSlide({ ...slide, imageUrl: e.target.value })
              }
            />
            <Button
              type="button"
              onClick={saveSlide}
              disabled={loadingSlide}
            >
              {loadingSlide ? "Memproses..." : "Tambah slide"}
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-xl font-bold">Laporan Masuk</h2>

        <div className="mt-4 space-y-3">
          {reports.length === 0 ? (
            <p className="text-sm text-foreground/70">Belum ada laporan masuk.</p>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="rounded-2xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{report.title}</p>
                    <p className="text-xs text-foreground/60">
                      {report.category ?? "Umum"} • {report.status}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(report.id, "in_review")}
                      disabled={updatingReportId === report.id}
                      className="rounded-full border px-3 py-1 text-xs disabled:opacity-60"
                    >
                      Proses
                    </button>
                    <button
                      onClick={() => updateStatus(report.id, "resolved")}
                      disabled={updatingReportId === report.id}
                      className="rounded-full border px-3 py-1 text-xs disabled:opacity-60"
                    >
                      Selesai
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-sm text-foreground/75">
                  {report.description}
                </p>

                <p className="mt-3 text-xs text-foreground/50">
                  {new Date(report.created_at).toLocaleString("id-ID")}
                </p>
              </div>
            ))
          )}
        </div>

        {message && <p className="mt-4 text-sm text-foreground/70">{message}</p>}
      </Card>
    </div>
  );
}