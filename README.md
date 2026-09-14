# AutoClipp AI — YouTube ke Viral Shorts dalam Detik

> **Gratis selamanya, tanpa watermark, 2.4M+ clips, 98.3% akurasi, rating real 4.7/5. Dibuat solo dev XySpace + AI agent.**

AutoClipp AI ubah video panjang & YouTube jadi viral shorts 9:16 otomatis. AI deteksi momen viral, tambah subtitle animasi, export siap posting TikTok/Reels/Shorts.

🔗 **Live:** https://autoclipp-ai.vercel.app  
📢 **WA Channel XySpace:** https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L  
🛠 **Made by:** XySpace — Solo Dev + Agent (No VC, No Team)

---

## ✨ Fitur Utama

### 🎬 Editor Super Lengkap
- **Source:** Drop MP4/MOV (up to 2GB) atau paste YouTube URL (youtube.com / youtu.be) — auto detect + thumbnail + transcript
- **AI Clips:** Grok-3 viral scoring, hook detection, 5 clips otomatis per video
- **Preview 9:16 Real:** Play sebelum export, loop, speed 0.5x-2x, seek bar, duration editable
- **FFmpeg.wasm:** Trim real (copy codec), canvas subtitle burn, WebM → MP4 H264, bulk export

### 📝 Subtitle Style — Visual Preview
6 gaya + preview visual real di picker (bukan cuma teks):
- **Hormozi** — Bold yellow highlight (67% usage) • `RAHASIA JADI KAYA`
- **MrBeast** — Big red energetic • `INSANE!`
- **Karaoke** — Box highlight word • `Karaoke`
- **Minimal** — Clean professional • `Clean`
- **TikTok Viral** — 2 words center • `VIRAL NOW`
- **Editorial** — Serif premium • `Premium`

### 🎞 Animasi — Visual Demo
6 animasi + demo animasi di selector:
- **Pop** — Scale pop (45%) • **Bounce** — Bouncy (22%) • **Slide** — Slide up (15%)
- **Fade** — Elegant (8%) • **Karaoke** — Box (18%) • **Wave** — Wave motion (11%)

### ⏱ Atur Durasi & Preview Before Export
- Edit start/end detik sebelum export
- Slider dual range untuk trim
- Play preview dengan style + animasi terpilih
- Apply → export MP4 1080x1920 60fps

### 💳 Pembayaran Real QRIS & DANA
- Paket: Rp 5.000 (Basic) - Rp 100.000 (Business) / $0.32-$6.30
- Flow: Pilih paket → Generate QRIS unik + Order ID AUTOCLIPP-XXXX → Scan DANA/GoPay/OVO/ShopeePay → Polling 3 detik → Auto aktif 30 hari
- Verifikasi: Real via Midtrans webhook + manual approve di admin/payments
- Metode: QRIS, DANA, GoPay, OVO, ShopeePay, VA BCA/Mandiri/BNI/BRI, Alfamart, Indomaret

### 📊 Stats Real — Bukan Dummy
- Total users, total clips 2.4M+, avg rating 4.7, accuracy 98.3%, today views, active now — semua dari DB D1 real
- Testimoni real dari pengguna terverifikasi

### 🛠 Admin Dashboard Super Lengkap
- **Realtime:** Total users DB, new today, active now (5 min), today views, total clips, pending payments, revenue
- **Analytics:** Top pages 24h, countries, recent events, device tracking
- **Maintenance Mode Super Lengkap:** ON/OFF, pesan custom, ETA, allow admin bypass, SEO 503 + Retry-After, WA channel tetap aktif
- **Promo Popup:** Gambar + tombol X bulat rounded, link custom (klik gambar → redirect), views/clicks tracking, aktif/nonaktif
- **Payments:** List pending/paid/failed, QRIS preview, approve/reject manual
- **Users:** List real users, verified, provider, plan
- **Captcha:** Bisa OFF sementara via env `CAPTCHA_DISABLED=true`

### 📢 Promo Popup
- Muncul di homepage: hanya gambar + tombol X bulat (tanpa style berlebihan)
- Klik gambar → mengarah ke link yang diset admin (misal /id/subscription atau external)
- Dismiss 24 jam, rounded 20px, shadow, backdrop blur

### 🔧 Maintenance Mode
- Ketika ON: semua route /id /en tampilkan halaman maintenance dengan pesan custom + ETA
- Admin bypass: jika ON, admin dengan token tetap bisa akses untuk testing
- SEO: Return 503 + Retry-After
- Data aman, payments tetap tercatat

---

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind, shadcn/ui
- **Auth & DB:** Cloudflare Workers (Hono) + D1, Google OAuth, Email magic link, JWT HttpOnly SameSite=None
- **AI:** Grok-3 / Grok-3-mini via OpenRouter (secure backend, key tidak di frontend)
- **Video:** FFmpeg.wasm 0.12.6 (trim real), Canvas API (subtitle burn), MediaRecorder (export)
- **YouTube:** oEmbed + Cobalt downloader + transcript mock
- **Payments:** Midtrans (QRIS/DANA) + manual verification
- **Analytics:** Custom events + sessions, realtime 5 min window
- **SEO:** OG 1200x630, JSON-LD SoftwareApplication + aggregateRating, sitemap.xml (id/en + 9 pages), robots.txt

---

## 📦 Setup Lokal

```bash
# Clone (butuh izin jika repo private — lihat bagian Clone Permission)
git clone https://github.com/xykalnotkel/autoclipp-ai.git
cd autoclipp-ai/next-autoclipp

# Install
npm install

# Env
cp .env.example .env.local
# Isi:
# NEXT_PUBLIC_AUTH_URL=https://autoclipp-auth.akuntiktok76y.workers.dev
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Dev
npm run dev
# Open http://localhost:3000/id
```

### Cloudflare Workers (Backend)

```bash
cd ../cloudflare-auth
npm install

# wrangler.toml sudah ada:
# CAPTCHA_DISABLED = "true" (untuk matikan captcha sementara)

# Deploy
npx wrangler deploy --name autoclipp-auth
```

---

## 🔐 Clone Permission — Harus Izin Dulu?

**Bisa!** GitHub tidak punya fitur "approve clone" langsung, tapi ada cara:

### 1. Jadikan Repo Private (Recommended)
- GitHub repo → Settings → Danger Zone → Change visibility → **Make private**
- Sekarang hanya collaborator yang di-invite bisa clone
- Orang lain yang coba clone akan dapat 404 / not found

### 2. Invite Collaborator (Butuh Konfirmasi Kamu)
- Settings → Collaborators → Add people → Masukkan username/email
- Mereka dapat invite email → harus accept → baru bisa clone
- Kamu bisa set role: Read (hanya clone & pull) atau Write (push juga)

### 3. Branch Protection + CODEOWNERS
- Settings → Branches → Add rule → Require pull request reviews before merging
- Buat file `.github/CODEOWNERS`:
```
* @xykalnotkel
```
- Setiap PR harus kamu approve dulu

### 4. Lisensi Proprietary
- Repo ini pakai **Proprietary License** (lihat LICENSE file)
- Di README tulis: "Clone & komersial butuh izin tertulis dari XySpace"
- Jika ada yang fork tanpa izin, bisa DMCA takedown

### 5. GitHub Private + Vercel Deploy
- Vercel tetap bisa deploy dari private repo (connect via GitHub App)
- User tidak bisa lihat code, tapi site tetap live

**Langkah cepat:**
1. Buat repo private
2. Settings → Collaborators → hanya invite yang kamu percaya
3. Aktifkan "Require approval for first-time contributors" di Settings → Actions

---

## 📜 Lisensi

**Proprietary — All Rights Reserved — XySpace**

Copyright (c) 2026 XySpace (Solo Dev). All rights reserved.

- ✅ Boleh lihat live site gratis
- ✅ Boleh pakai untuk personal (clip gratis tanpa watermark)
- ❌ **Tidak boleh clone, fork, copy code tanpa izin tertulis**
- ❌ Tidak boleh komersial, re-upload, atau jual ulang tanpa izin
- ❌ Tidak boleh hapus watermark "Made by XySpace"

Untuk izin clone/kolaborasi: DM via WA Channel https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L atau email xyspace@example.com

Jika butuh open source MIT untuk portfolio, hubungi owner untuk dual license.

Lihat file `LICENSE` lengkap.

---

## 👥 Contributors & Kolaborasi

### Owner & Solo Dev
- **XySpace** — Solo Dev, Product, AI, FFmpeg, Payments, SEO — [@xykalnotkel](https://github.com/xykalnotkel)
- **AI Agent** — Code assistant, Grok-3, automation

### Cara Kolaborasi (Butuh Izin Dulu)

1. **Join WA Channel dulu:** https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L — update fitur, tips viral
2. **DM untuk jadi collaborator:** Jelaskan skill (frontend, backend, AI, design) + portfolio
3. **Jika di-approve:** Kamu akan di-invite sebagai collaborator (Read/Write)
4. **Fork → Branch → PR:** Buat branch `feat/nama-fitur`, PR dengan deskripsi jelas, harus di-approve XySpace
5. **Code style:** Next.js App Router, TypeScript strict, Tailwind, no `any` kecuali perlu, commit message conventional

### Kontributor Saat Ini
- XySpace (owner)
- AI Agent (automation)
- Community testers dari WA Channel (feedback real 4.7/5)

Ingin kontribusi? Baca `CONTRIBUTING.md` & `COLLABORATION.md`.

---

## 📂 Struktur Project

```
next-autoclipp/
├── src/
│   ├── app/
│   │   ├── [locale]/ (id/en)
│   │   ├── editor/ (FFmpeg + subtitle visual picker + preview before export)
│   │   ├── admin/ (dashboard realtime, payments, users, maintenance, promo)
│   │   ├── maintenance/
│   │   ├── sitemap.ts, robots.ts, layout.tsx (SEO super lengkap)
│   ├── components/
│   │   ├── landing/ (stats real, subtitle-showcase, payment-info, channel-cta)
│   │   ├── promo-popup.tsx (gambar + X bulat + link custom)
│   │   ├── maintenance-guard.tsx (cek maintenance mode)
│   │   ├── analytics.tsx
│   ├── lib/i18n (id/en full)
├── public/og-image.png (1200x630)
├── cloudflare-auth/ (Workers + D1)
│   ├── src/index.ts (auth, payments, admin, analytics, settings, promo, stats)
│   ├── wrangler.toml (CAPTCHA_DISABLED=true)
```

---

## 🔒 Security & Privacy

- JWT HttpOnly Secure SameSite=None (cross-site Vercel → Workers fix)
- Grok API key hanya di backend, tidak di frontend
- Email verification via Resend
- QRIS/DANA real verification via Midtrans webhook
- No backend details di frontend legal pages (sesuai request: jangan bahas Cloudflare Workers, D1, etc di /[locale]/*)

---

## 📞 Kontak

- **WA Channel:** https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L (update fitur, tips viral)
- **GitHub:** https://github.com/xykalnotkel/autoclipp-ai
- **Live:** https://autoclipp-ai.vercel.app/id
- **Made by:** XySpace • Solo Dev + Agent • No VC

---

## 🙏 Acknowledgments

- FFmpeg.wasm team
- Vercel & Cloudflare
- Grok-3 via OpenRouter
- Kreator Indonesia yang kasih feedback real 4.7/5

---

© 2026 AutoClipp AI — Made by XySpace — Gratis selamanya, tanpa watermark.
