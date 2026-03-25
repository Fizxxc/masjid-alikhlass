"use client";

import { useEffect, useMemo, useState } from "react";

type IOSDeviceOrientationEvent = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

function getQiblaBearing(lat: number, lng: number) {
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  const phi1 = toRad(lat);
  const phi2 = toRad(kaabaLat);
  const deltaLambda = toRad(kaabaLng - lng);

  const y = Math.sin(deltaLambda);
  const x =
    Math.cos(phi1) * Math.tan(phi2) -
    Math.sin(phi1) * Math.cos(deltaLambda);

  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

export function QiblaCard() {
  const [heading, setHeading] = useState(0);

  const mosqueLat = -6.232265758662486;
  const mosqueLng = 107.09997895210284;

  const qiblaBearing = useMemo(
    () => getQiblaBearing(mosqueLat, mosqueLng),
    [mosqueLat, mosqueLng]
  );

  useEffect(() => {
    const handle = (event: DeviceOrientationEvent) => {
      const e = event as IOSDeviceOrientationEvent;
      const alpha =
        typeof e.webkitCompassHeading === "number"
          ? e.webkitCompassHeading
          : 360 - (event.alpha ?? 0);

      setHeading(alpha);
    };

    window.addEventListener("deviceorientation", handle, true);

    return () => {
      window.removeEventListener("deviceorientation", handle, true);
    };
  }, []);

  const relativeRotation = qiblaBearing - heading;

  return (
    <div className="rounded-2xl border p-4">
      <h2 className="mb-2 text-lg font-semibold">Arah Kiblat</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Arahkan ponsel dan ikuti jarum menuju kiblat.
      </p>

      <div className="flex justify-center">
        <div className="relative flex h-64 w-64 items-center justify-center rounded-full border">
          <div className="absolute text-xs text-muted-foreground top-3">N</div>
          <div className="absolute right-3 text-xs text-muted-foreground">E</div>
          <div className="absolute bottom-3 text-xs text-muted-foreground">S</div>
          <div className="absolute left-3 text-xs text-muted-foreground">W</div>

          <div
            className="absolute h-24 w-1 origin-bottom rounded bg-green-600"
            style={{
              transform: `rotate(${relativeRotation}deg) translateY(-48px)`,
            }}
          />

          <div className="h-3 w-3 rounded-full bg-green-600" />
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm">
        <p>Heading: {heading.toFixed(1)}°</p>
        <p>Kiblat: {qiblaBearing.toFixed(1)}°</p>
      </div>
    </div>
  );
}