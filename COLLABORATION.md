# Kolaborasi & Clone Permission — AutoClipp AI

## Apakah Bisa Clone Repo Harus Izin Dulu?

**Ya, bisa dan memang begitu sistemnya sekarang.**

GitHub tidak punya tombol "Approve Clone" langsung, tapi kita pakai kombinasi **Private Repo + Collaborator Invite** sehingga hanya yang kamu izinkan bisa clone.

---

## 🔐 Cara Setting Agar Clone Harus Izin Kamu

### Langkah 1: Jadikan Repo Private

1. Buka https://github.com/xykalnotkel/autoclipp-ai
2. Settings → General → Danger Zone → **Change visibility** → **Make private** → Ketik nama repo → Confirm
3. Sekarang repo tidak bisa ditemukan orang random. Jika mereka coba buka / clone, dapat 404.

### Langkah 2: Invite Collaborator (Butuh Approval Kamu)

1. Settings → Collaborators and teams → **Add people**
2. Masukkan username GitHub atau email orang yang mau kamu kasih izin
3. Pilih role:
   - **Read** = hanya bisa clone & pull, tidak bisa push (aman untuk reviewer)
   - **Triage** = bisa manage issues
   - **Write** = bisa push branch & PR (untuk contributor aktif)
   - **Maintain/Admin** = hampir full (hanya untuk co-owner)
4. Orang tersebut dapat email invite → **harus Accept** → baru bisa clone
5. Kamu bisa revoke kapan saja: Settings → Collaborators → Remove

### Langkah 3: Aktifkan Branch Protection (PR Harus Kamu Approve)

1. Settings → Branches → Add classic branch protection rule
2. Branch name pattern: `main`
3. Centang:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ✅ Dismiss stale PR approvals when new commits pushed
   - ✅ Require status checks (Vercel)
4. Save. Sekarang tidak ada yang bisa push langsung ke main tanpa PR + approval kamu.

### Langkah 4: CODEOWNERS (Otomatis Request Review Kamu)

Buat file `.github/CODEOWNERS`:

```
* @xykalnotkel
/src/app/admin/ @xykalnotkel
/cloudflare-auth/ @xykalnotkel
```

Setiap PR yang ubah file tersebut otomatis minta review kamu.

### Langkah 5: Private + Vercel Tetap Jalan

- Vercel → Project → Settings → Git → Connected Git Repository → tetap connect ke private repo via GitHub App (sudah authorized)
- Deploy tetap jalan otomatis tiap push ke main
- User tidak bisa lihat code, tapi site live tetap di https://autoclipp-ai.vercel.app

---

## 📋 Alur Kolaborasi Lengkap

```
1. Calon contributor join WA Channel: https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L
2. DM XySpace: "Halo, mau kontribusi feat X, GitHub: @username"
3. XySpace cek portfolio → jika ok → Invite sebagai collaborator (Read/Write)
4. Contributor accept invite via email
5. git clone https://github.com/xykalnotkel/autoclipp-ai.git (sekarang bisa)
6. Buat branch: git checkout -b feat/fitur-baru
7. Commit & push
8. Buat PR → XySpace review → Approve → Merge → Auto deploy Vercel
```

---

## 🚫 Jika Ada Yang Clone Tanpa Izin

- Jika repo private: mereka tidak bisa clone (404)
- Jika repo pernah public dan ada yang fork: 
  - Cek Insights → Forks
  - Jika fork tanpa izin & dipakai komersial: bisa DMCA takedown → GitHub Settings → Report → DMCA
  - Karena LICENSE Proprietary, kamu punya hak

---

## 📜 Lisensi Terkait Clone

Lihat `LICENSE` file: Proprietary — All Rights Reserved — XySpace.

Intinya:
- Clone untuk belajar personal (tidak komersial, tidak re-upload) = toleransi, tapi tetap butuh izin jika mau publish
- Clone untuk komersial / SaaS ulang = dilarang keras tanpa izin tertulis
- Ingin MIT untuk portfolio? DM XySpace untuk dual license.

---

## ❓ FAQ

**Q: Bagaimana jika saya ingin repo tetap public tapi clone harus izin?**
A: Tidak bisa 100%. Public = semua orang bisa clone. Solusi: tetap public tapi pakai LICENSE Proprietary + tulis di README "Clone butuh izin". Jika ada yang melanggar, DMCA. Tapi paling aman = private.

**Q: Apakah Vercel bisa deploy dari private repo?**
A: Ya, bisa. Vercel pakai GitHub App yang sudah authorized. Tidak perlu public.

**Q: Bagaimana jika contributor sudah tidak aktif?**
A: Settings → Collaborators → Remove. Mereka langsung tidak bisa clone lagi (jika repo private).

**Q: Apakah bisa batasi clone hanya dari IP tertentu?**
A: Tidak di GitHub personal. Butuh GitHub Enterprise. Untuk personal, cukup private + invite.

---

## 📞 Kontak

- WA Channel: https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L
- GitHub: @xykalnotkel
- Live: https://autoclipp-ai.vercel.app/id

Made by XySpace — Solo Dev + Agent — No VC.
