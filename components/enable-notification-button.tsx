"use client";

import { useState } from "react";

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>;
  }
}

export function EnableNotificationButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleEnable() {
    setLoading(true);
    setMessage("");

    try {
      if (typeof window === "undefined") return;

      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function (OneSignal: any) {
        try {
          await OneSignal.Slidedown.promptPush();

          const permission =
            OneSignal?.Notifications?.permission ?? "default";
          const optedIn =
            OneSignal?.User?.PushSubscription?.optedIn ?? false;

          if (optedIn || permission === "granted") {
            setMessage("Notifikasi berhasil diaktifkan.");
          } else {
            setMessage("Izin notifikasi belum diberikan.");
          }
        } catch (error) {
          console.error(error);
          setMessage("Gagal memunculkan prompt notifikasi.");
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan saat mengaktifkan notifikasi.");
      setLoading(false);
    }
  }

  async function handleDisable() {
    setLoading(true);
    setMessage("");

    try {
      if (typeof window === "undefined") return;

      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function (OneSignal: any) {
        try {
          await OneSignal.User.PushSubscription.optOut();
          setMessage("Notifikasi dimatikan.");
        } catch (error) {
          console.error(error);
          setMessage("Gagal mematikan notifikasi.");
        } finally {
          setLoading(false);
        }
      });
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan saat mematikan notifikasi.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleEnable}
          disabled={loading}
          className="rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Memproses..." : "Aktifkan"}
        </button>

        <button
          type="button"
          onClick={handleDisable}
          disabled={loading}
          className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Matikan
        </button>
      </div>

      {message ? (
        <p className="text-sm text-white/70">{message}</p>
      ) : (
        <p className="text-sm text-white/70">
          Aktifkan notifikasi untuk menerima update penting.
        </p>
      )}
    </div>
  );
}