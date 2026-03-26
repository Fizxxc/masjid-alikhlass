"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase-client";

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>;
  }
}

export function OneSignalInit() {
  useEffect(() => {
    const supabase = createClient();

    async function boot() {
      if (typeof window === "undefined") return;

      const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
      if (!appId) {
        console.error("NEXT_PUBLIC_ONESIGNAL_APP_ID belum diisi");
        return;
      }

      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      window.OneSignalDeferred = window.OneSignalDeferred || [];

      window.OneSignalDeferred.push(async function (OneSignal: any) {
        try {
          await OneSignal.init({
            appId,
            allowLocalhostAsSecureOrigin: isLocalhost,
            notifyButton: {
              enable: true,
              position: "bottom-right",
              size: "medium",
              theme: "default",
            },
            promptOptions: {
              slidedown: {
                prompts: [
                  {
                    type: "push",
                    autoPrompt: false,
                    text: {
                      actionMessage:
                        "Aktifkan notifikasi untuk menerima update penting dari Masjid Al-Ikhlas.",
                      acceptButton: "Aktifkan",
                      cancelButton: "Nanti",
                    },
                    delay: {
                      pageViews: 1,
                      timeDelay: 5,
                    },
                  },
                ],
              },
            },
          });

          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session?.user?.id || !session.access_token) return;

          await OneSignal.login(session.user.id);

          await new Promise((resolve) => setTimeout(resolve, 1200));

          const subscriptionId =
            OneSignal?.User?.PushSubscription?.id ?? null;
          const optedIn =
            OneSignal?.User?.PushSubscription?.optedIn ?? false;

          const cacheKey = `onesignal_registered_${session.user.id}_${subscriptionId ?? "none"}`;
          const alreadyRegistered = sessionStorage.getItem(cacheKey);

          if (!alreadyRegistered) {
            const res = await fetch("/api/push/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                subscriptionId,
                optedIn,
              }),
            });

            const result = await res.json().catch(() => null);
            console.log("push/register result:", result);

            if (res.ok) {
              sessionStorage.setItem(cacheKey, "true");
            }
          }
        } catch (error) {
          console.error("OneSignal init error:", error);
        }
      });
    }

    boot();
  }, []);

  return null;
}