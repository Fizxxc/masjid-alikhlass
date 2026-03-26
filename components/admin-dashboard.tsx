"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Card, Button, Input } from "@/components/ui";
import { AdminAnnouncementForm } from "@/components/admin-announcement-form";

type Report = {
  id: string;
  title: string;
  category: string | null;
  description: string;
  status: "pending" | "in_review" | "resolved" | "rejected" | string;
  created_at: string;
};

type Props = {
  reports: Report[];
};

export function AdminDashboard({ reports }: Props) {
  const supabase = createClient();

  const [slideTitle, setSlideTitle] = useState("");
  const [slideSubtitle, setSlideSubtitle] = useState("");
  const [slideImageUrl, setSlideImageUrl] = useState("");
  const [slideLoading, setSlideLoading] = useState(false);
  const [slideMessage, setSlideMessage] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);

  async function saveSlide() {
    setSlideLoading(true);
    setSlideMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setSlideMessage("Silakan login dulu.");
        setSlideLoading(false);
        return;
      }

      const { error } = await supabase.from("hero_slides").insert({
        title: slideTitle || null,
        subtitle: slideSubtitle || null,
        image_url: slideImageUrl,
        sort_order: 0,
        is_active: true,
        created_by: user.id,
      });

      if (error) {
        setSlideMessage(error.message);
        setSlideLoading(false);
        return;
      }

      setSlideTitle("");
      setSlideSubtitle("");
      setSlideImageUrl("");
      setSlideMessage("Slide berhasil ditambahkan.");
    } catch (error) {
      setSlideMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    }

    setSlideLoading(false);
  }

  async function updateStatus(
    id: string,
    status: "in_review" | "resolved" | "rejected"
  ) {
    setUpdatingReportId(id);
    setReportMessage("");

    try {
      const { error } = await supabase
        .from("reports")
        .update({ status })
        .eq("id", id);

      if (error) {
        setReportMessage(error.message);
        setUpdatingReportId(null);
        return;
      }

      setReportMessage(
        "Status laporan diperbarui. Refresh halaman untuk melihat data terbaru."
      );
    } catch (error) {
      setReportMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      );
    }

    setUpdatingReportId(null);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <div className="space-y-5">
        <AdminAnnouncementForm />

        <Card className="p-5">
          <h2 className="text-xl font-bold">Kelola Slide Home</h2>

          <div className="mt-4 space-y-4">
            <Input
              placeholder="Judul slide"
              value={slideTitle}
              onChange={(e) => setSlideTitle(e.target.value)}
            />

            <Input
              placeholder="Subjudul"
              value={slideSubtitle}
              onChange={(e) => setSlideSubtitle(e.target.value)}
            />

            <Input
              placeholder="URL gambar"
              value={slideImageUrl}
              onChange={(e) => setSlideImageUrl(e.target.value)}
            />

            <Button
              type="button"
              onClick={saveSlide}
              disabled={slideLoading}
            >
              {slideLoading ? "Memproses..." : "Tambah slide"}
            </Button>

            {slideMessage ? (
              <p className="text-sm text-foreground/70">{slideMessage}</p>
            ) : null}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-xl font-bold">Laporan Masuk</h2>

        <div className="mt-4 space-y-3">
          {reports.length === 0 ? (
            <p className="text-sm text-foreground/70">
              Belum ada laporan masuk.
            </p>
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

                  <div className="flex flex-wrap gap-2">
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

                    <button
                      onClick={() => updateStatus(report.id, "rejected")}
                      disabled={updatingReportId === report.id}
                      className="rounded-full border px-3 py-1 text-xs disabled:opacity-60"
                    >
                      Tolak
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

        {reportMessage ? (
          <p className="mt-4 text-sm text-foreground/70">{reportMessage}</p>
        ) : null}
      </Card>
    </div>
  );
}