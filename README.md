# Masjid Al-Ikhlas Web App

Starter production-style web app untuk Masjid Al-Ikhlas dengan Next.js App Router + Supabase.

## Fitur utama
- Login/register user & admin dengan Supabase Auth.
- Home realtime: info teks admin, image slider otomatis, lokasi masjid, jadwal shalat, quick actions.
- Laporan jamaah realtime masuk ke admin.
- Push notification ke HP via OneSignal Web Push/PWA.
- Profil: upload foto, ubah nama, alamat, password, preferensi notifikasi, tema terang/gelap/system.
- Qiblat realtime memakai Device Orientation + fallback kompas matematis.
- Halaman doa terpisah.
- Donasi: coming soon.
- Bottom navbar untuk mobile.

## Stack
- Next.js App Router
- Supabase Auth, Postgres, Storage, Realtime, RLS
- OneSignal Web Push
- EQuran SDK (`equran`) + API jadwal shalat EQuran
- Lucide React + slot untuk aset iconmonstr di `/public/icons`

## Cara jalanin
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Setup Supabase singkat
1. Buat project Supabase.
2. Jalankan SQL pada file `supabase/schema.sql`.
3. Buat bucket public `avatars` dan `slides`.
4. Tambahkan user admin lalu ubah `profiles.role = 'admin'`.
5. Aktifkan Realtime untuk tabel: `announcements`, `slides`, `reports`, `profiles`.

## Setup push notification ke HP
Agar notifikasi muncul di HP, app perlu dibuka sebagai PWA / browser yang support web push. Implementasi ini memakai OneSignal Web SDK + service worker, dan backend Next.js memanggil OneSignal REST API saat laporan baru dibuat. Lihat `app/api/push/report/route.ts` dan file worker di `public/`.

## Catatan implementasi
- Jadwal shalat mengambil data EQuran Shalat API per bulan untuk Kota Bekasi, Jawa Barat, lalu memilih hari berjalan.
- Doa page memakai data lokal seed agar tetap stabil.
- Qiblat realtime memakai koordinat Ka'bah dan sensor device orientation jika tersedia.
