# 🌌 COSMORA

<div align="center">
  <p><strong>AI-Powered Space Exploration & Astronomy Experiences</strong></p>
  <img src="public/images/og-image.png" alt="Cosmora Preview" width="800" />
</div>

<br />

COSMORA is an interactive, web-based 3D space exploration platform that brings the universe directly to your browser. By combining real astronomical data, immersive 3D graphics, and contextual Artificial Intelligence, COSMORA allows users to seamlessly explore the Solar System, dive into Deep Space, and learn about celestial events.

## 🚨 Problem Statement & Deskripsi Solusi

**Problem Statement:** 
Platform edukasi astronomi tradisional seringkali bersifat statis, didominasi oleh teks tebal, dan kurang interaktif. Mempelajari alam semesta seharusnya tidak terasa seperti membaca buku teks biasa; ia harus memberikan pengalaman eksplorasi yang nyata dan menggugah rasa ingin tahu.

**Deskripsi Solusi:** 
COSMORA hadir untuk mengubah cara kita belajar astronomi menjadi sebuah "living experience". Pengguna dapat "terbang" mengarungi planet-planet dalam lingkungan 3D, bertanya langsung kepada AI mengenai objek langit yang sedang mereka amati, dan memantau data satelit NASA secara *real-time*. Kami membuat edukasi astronomi menjadi sangat mudah diakses, interaktif, dan menyenangkan.

## 🧠 AI Approach, Arsitektur & Tema yang Dipilih

**Tema yang Dipilih:** 
*Interactive Education & Space Exploration* (Edukasi Interaktif & Eksplorasi Luar Angkasa).

**Arsitektur Sistem:**
- **Frontend Layer:** Dibangun dengan Next.js 15 (App Router), Tailwind CSS, dan Framer Motion untuk UI yang responsif dan fluid.
- **3D Rendering Engine:** Menggunakan Three.js dan React Three Fiber untuk me-render objek tata surya (WebGL) secara *real-time* dan interaktif di browser.
- **Backend & Data Layer:** Memanfaatkan Supabase (PostgreSQL + RLS) untuk keamanan data *Observation Logbook* pengguna, serta integrasi API publik NASA untuk pembaruan data astronomi.
- **AI Layer:** Pendekatan *Context-Aware AI*. Sistem AI secara terus-menerus menerima *state* dari *viewport* 3D pengguna (misal: "User sedang fokus pada orbit Saturnus") sehingga AI dapat menghasilkan respons yang sangat relevan sesuai dengan apa yang dilihat pengguna.

**AI Approach:**
Kami mengkombinasikan *Context-Aware Prompt Engineering* dengan pemrosesan bahasa alami (NLP). AI tidak hanya menjawab secara pasif, tetapi bertindak sebagai pendamping (astronom pribadi) yang "melihat" simulasi yang sama dengan pengguna, memastikan jawaban selalu akurat secara ilmiah dan sesuai konteks visual.

## 🤖 Bagaimana IBM Bob Digunakan dalam Project

Dalam arsitektur Cosmora, **IBM Bob** memegang peranan krusial sebagai otak dari **Contextual AI Assistant** kami. 

1. **Contextual Interactions:** Ketika pengguna melakukan navigasi ke planet atau galaksi tertentu, data koordinat dan informasi objek tersebut dikirim ke IBM Bob. IBM Bob memproses konteks ini untuk memberikan *insights* yang akurat secara ilmiah.
2. **Conversational Guide:** IBM Bob bertindak sebagai "Personal Astronomer" yang interaktif. Alih-alih mencari di ensiklopedia, pengguna dapat bertanya langsung di dalam ruang 3D (misal: *"Bob, kenapa planet ini berwarna merah?"*), dan IBM Bob akan merespons layaknya seorang ahli.
3. **Data Interpretation:** Data astronomi mentah (telemetri) dari NASA seringkali kompleks. IBM Bob digunakan untuk menyederhanakan dan menerjemahkan data teknis tersebut menjadi penjelasan yang mudah dipahami oleh pengguna dari segala usia.

## ✨ Fitur Utama

- 🪐 **Interactive 3D Solar System**: Rendering WebGL *real-time* untuk *pan, zoom,* dan rotasi objek langit.
- 🤖 **Contextual AI Assistant**: Ditenagai oleh **IBM Bob**, AI yang mengerti konteks planet apa yang sedang Anda lihat.
- 🚀 **Mission Logs & Telemetry**: Melacak misi luar angkasa bersejarah dengan data telemetri realistis.
- 🔭 **Observation Logbook**: Logbook personal untuk mencatat pengamatan bintang Anda yang diamankan dengan Supabase RLS.
- 🛰️ **NASA API Integration**: Melacak kejadian langit dinamis dan Astronomy Picture of the Day (APOD).

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **3D Engine**: Three.js, React Three Fiber, React Three Drei
- **Backend & Auth**: Supabase (PostgreSQL, Row Level Security)
- **AI Intelligence**: **IBM Bob** (untuk *Contextual NLP* & *Assistant*)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Akun [Supabase](https://supabase.com/)
- API Keys yang dibutuhkan (NASA API, IBM Bob AI, dll)

### 2. Installation

```bash
git clone https://github.com/sayvixual/cosmora.git
cd cosmora
npm install
```

### 3. Environment Variables
Copy file environment:
```bash
cp .env.example .env.local
```
Lengkapi variabel berikut di `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- IBM Bob / AI API Keys yang relevan

### 4. Run Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) untuk mulai menjelajah.

## ☁️ Deployment
Aplikasi ini sangat optimal di-deploy melalui Vercel. Pastikan seluruh *Environment Variables* telah disiapkan di dashboard Vercel sebelum proses *build*.

## 📄 License
MIT License. See `LICENSE` for more information.
