# Contributing — AutoClipp AI

> Dibuat solo dev XySpace + Agent. Kontribusi butuh izin dulu (repo private / restricted).

## Cara Jadi Contributor

1. **Join WA Channel:** https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L — kenalan, lihat update
2. **DM XySpace:** Jelaskan skill (Frontend Next.js / Backend Workers / AI / Design / QA) + portfolio / GitHub
3. **Jika di-approve:** Kamu akan di-invite sebagai collaborator (Read atau Write)
4. **Clone (setelah invite):** `git clone https://github.com/xykalnotkel/autoclipp-ai.git`

## Workflow

```bash
# Buat branch baru
git checkout -b feat/nama-fitur-jelas

# Contoh: feat/subtitle-wave-preview
# Contoh: fix/admin-realtime-users

# Commit conventional
git commit -m "feat: tambah preview wave animasi di editor"

# Push & PR
git push origin feat/nama-fitur-jelas
# Buka GitHub → Create Pull Request → Deskripsi lengkap → Request review @xykalnotkel
```

## Aturan Code

- **Stack:** Next.js 15 App Router, TypeScript strict, Tailwind CSS, shadcn/ui
- **No `any` sembarangan** — pakai type proper
- **Komponen:** di `src/components/`, reuseable, props typed
- **i18n:** Jika tambah text UI, wajib tambah di `src/lib/i18n` id & en (full translate, jangan setengah)
- **Jangan bahas backend di frontend legal pages:** Jangan sebut Cloudflare Workers, D1, Resend, Cloudinary, Vercel, PBKDF2, JWT di /[locale]/terms, privacy, legal, docs, faq
- **Jangan bahas pw admin di frontend:** kall/Haekal123 tidak boleh muncul di /[locale]/* atau footer/header
- **Real data:** Testimonial, rating, stats harus dari DB real, bukan hardcode fake (kecuali fallback)
- **SEO:** Jika tambah page, update `sitemap.ts` & `robots.ts`

## Checklist PR

- [ ] Build passed: `npm run build` (21 routes)
- [ ] Tidak ada console.log berlebihan
- [ ] i18n id & en lengkap (price Rp 5k-100k id, $0.32-$6.30 en)
- [ ] Tidak bocorkan env key di frontend
- [ ] Preview visual untuk subtitle style / animasi jika ubah editor
- [ ] Test admin login tidak loop (SameSite=None + Authorization Bearer)

## Area yang Butuh Bantuan

- [ ] Subtitle style baru (misal: Netflix, YouTube Shorts style)
- [ ] Animasi baru (typewriter, glitch, etc)
- [ ] FFmpeg filter: burn subtitle real SRT
- [ ] Analytics dashboard: chart revenue, user growth
- [ ] Promo popup A/B testing
- [ ] Maintenance page design variasi

## Code of Conduct

- Be respectful, no spam, no toxic
- Solo dev + agent — jadi komunikasi via WA Channel cepat
- Jika tidak di-approve dalam 2 hari, DM lagi (mungkin kelewat)

## Lisensi

Dengan kontribusi, kamu setuju code kamu jadi bagian dari Proprietary License XySpace. Kamu tetap dapat credit di README Contributors, tapi hak cipta tetap di Owner.

Thanks! 🙏 — XySpace
