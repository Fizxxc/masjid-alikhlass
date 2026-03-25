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

    async function init() {
      if (typeof window === "undefined") return;

      const alreadyRegistered = sessionStorage.getItem("onesignal_registered");
      if (alreadyRegistered === "true") return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      window.OneSignalDeferred = window.OneSignalDeferred || [];

      window.OneSignalDeferred.push(async function (OneSignal: any) {
        await OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: false,
          },
        });

        if (!session?.user?.id || !session.access_token) return;

        await OneSignal.login(session.user.id);

        await new Promise((resolve) => setTimeout(resolve, 1200));

        const subscriptionId = OneSignal?.User?.PushSubscription?.id ?? null;
        const optedIn = OneSignal?.User?.PushSubscription?.optedIn ?? false;

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
          sessionStorage.setItem("onesignal_registered", "true");
        }
      });
    }

    init();
  }, []);

  return null;
}