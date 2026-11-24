# Yağmurdan Önce — Akıllı Pompa Konuşlandırma

**Wilo × imece Water AI Hackathon 2026 · Etkileşimli Karar Destek Sunumu**

Sağanak başlamadan önce Çankaya'daki 12 aday alt geçidi 16 farklı sinyalle değerlendirip sabit istasyon sağlığı (`Wilo Rexa SOLID-Q / SUPRA DDI`) ile 6 mobil pompayı (`4 Doğrudan + 2 Tampon`) dinamik olarak konumlandıran hikâyeli web sunumu.

## Teknoloji Yığını

- **Framework:** Next.js 16 (App Router, TypeScript)
- **3B / Görselleştirme:** Three.js (WebGL 3B fırtına-radar izdüşümü) ve yüksek DPI Canvas mühendislik kesitleri
- **Kaydırma & Hareket:** GSAP (`ScrollTrigger`) + Lenis akıcı kaydırma senkronizasyonu
- **Stil & Tipografi:** Tailwind CSS v4 (`Spectral`, `DM Sans`, `IBM Plex Mono`)

## Yerel Kurulum ve Çalıştırma

```bash
npm install
npm run dev
```

Üretim derlemesi almak ve yerel olarak çalıştırmak için:

```bash
npm run build
npm run start
```

Uygulama doğrudan `http://localhost:3000` adresinde açılır.

## Vercel ile Yayınlama

Depo kökü doğrudan Next.js uygulamasıdır ve ek yapılandırma gerektirmez (`Zero-Config`):

1. [Vercel Dashboard](https://vercel.com/new) üzerinden bu GitHub deposunu içe aktarın.
2. **Framework Preset:** `Next.js` ve **Root Directory:** `.` olarak bırakın.
3. **Deploy** düğmesine tıklayın; tüm görseller (`/public/media`), sesli anlatımlar (`/public/voices`) ve statik sayfalar otomatik olarak derlenir.
