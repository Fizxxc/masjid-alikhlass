"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Card } from "@/components/ui";
import { AdminAnnouncementForm } from "@/components/admin-announcement-form";

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
  const [message, setMessage] = useState("");
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);

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

      setMessage(
        "Status laporan diperbarui. Refresh halaman untuk melihat data terbaru."
      );
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
        <AdminAnnouncementForm />

        <Card className="p-5">
          <h2 className="text-xl font-bold">Kelola Slide Home</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Bagian ini bisa kamu sambungkan ke hero_slides kalau diperlukan.
          </p>
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

        {message ? <p className="mt-4 text-sm text-foreground/70">{message}</p> : null}
      </Card>
    </div>
  );
}