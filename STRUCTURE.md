# AutoClipp Next.js - Struktur Rapi Premium

## Folder Structure

```
src/
├── app/
│   ├── api/
│   │   ├── upload/route.ts        # Cloudinary upload (free 25GB)
│   │   ├── transcribe/route.ts    # Groq Whisper free 7500h
│   │   └── clips/route.ts         # Llama 3.3 free viral detection
│   ├── editor/page.tsx            # Main editor - 3 panel layout
│   ├── projects/page.tsx          # Project management
│   ├── pricing/page.tsx           # Pricing free vs pro
│   ├── layout.tsx                 # Root layout with Geist font
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Premium design system
├── components/
│   ├── landing/
│   │   ├── header.tsx             # Sticky header, no neon
│   │   ├── hero.tsx               # Hero with floating AI elements
│   │   └── features.tsx           # 6 features grid
│   └── ui/
│       ├── button.tsx             # Premium button, rounded-full
│       └── card.tsx               # Card with soft shadow
├── lib/
│   ├── supabase.ts                # Supabase client (slncetmq...)
│   ├── cloudinary.ts              # Cloudinary client (jxjvz3qi)
│   └── utils.ts                   # cn, formatTime
public/
└── images/
    ├── hero-main.png              # Green screen version
    ├── hero-main-nobg.png         # Rembg version (transparent)
    ├── float-subtitle.png / -nobg.png
    ├── float-waveform.png / -nobg.png
    ├── float-play.png / -nobg.png
    └── float-timeline.png / -nobg.png
```

## Routes

- `/` - Landing page dengan hero floating elements
- `/editor` - Main app: upload, clips, preview 9:16, style controls
- `/projects` - List projects dari Supabase + Cloudinary
- `/pricing` - Pricing free vs pro
- `/api/upload` - Upload video ke Cloudinary
- `/api/transcribe` - Transcribe via Groq Whisper
- `/api/clips` - Detect viral moments via Llama 3.3

## UI/UX Premium - No Neon, No Emoji

Design system:
- Background: #FCFCF9 (warm white)
- Foreground: #0A0A0A (soft black)
- Muted: #F5F5F0
- Border: #E8E8E3
- Accent: #FFD60A (mustard, not neon)
- Font: Geist Sans (Vercel style), tracking -0.02em
- Radius: 20px cards, full rounded buttons
- Shadow: soft [0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]
- Animations: float 6s ease-in-out, no neon glow

## Green Screen + Rembg Process

Untuk elemen melayang dan hero:

1. Generate AI dengan background hijau solid #00FF00:
   Prompt: "3D video editing interface, isolated on pure bright green background #00FF00, studio lighting"

2. Remove background dengan rembg AI:
   - Option A: Python `rembg` library
     ```bash
     pip install rembg
     rembg i hero-main.png hero-main-nobg.png
     ```
   - Option B: JS `@imgly/background-removal`
     ```js
     import { removeBackground } from '@imgly/background-removal'
     const blob = await removeBackground(greenImage)
     ```
   - Option C: Generate langsung dengan prompt "isolated on transparent background" (yang kita pakai untuk demo cepat)

3. Hasil nobg dipakai di hero.tsx dengan:
   - rounded-[16px] border shadow
   - animate-float, animate-float-slow, animate-float-delayed
   - No green screen visible di production

## Backend Free Stack (Token Kerjasama)

Sudah terpasang di .env.local:

- Supabase: https://slncetmqstgiiobeqhqk.supabase.co (500MB free)
- Cloudinary: jxjvz3qi (25GB free) - dipakai untuk video upload
- Groq: Free 7500h whisper + 14k req/day llama (tinggal isi GROQ_API_KEY)
- Resend: re_UCuv8V1h_... (email)

Supabase kurang? Bisa ganti:
- Cloudflare D1 + R2 (10GB free, no egress)
- Atau tetap Cloudinary untuk video + Supabase untuk metadata (current setup)

## Cara Run

```bash
npm run dev
# open http://localhost:3000
```

Build production: `npm run build`
