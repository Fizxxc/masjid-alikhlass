import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MASJID_COORDS = {
  lat: Number(process.env.NEXT_PUBLIC_MASJID_LAT ?? -6.232265758662486),
  lng: Number(process.env.NEXT_PUBLIC_MASJID_LNG ?? 107.09997895210284)
};

export function formatTime(value?: string | null) {
  if (!value) return '-';
  return value.slice(0, 5);
}

export function getQiblaBearing(lat: number, lng: number) {
  const kaabaLat = 21.4225 * (Math.PI / 180);
  const kaabaLng = 39.8262 * (Math.PI / 180);
  const userLat = lat * (Math.PI / 180);
  const userLng = lng * (Math.PI / 180);

  const y = Math.sin(kaabaLng - userLng);
  const x = Math.cos(userLat) * Math.tan(kaabaLat) - Math.sin(userLat) * Math.cos(kaabaLng - userLng);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
