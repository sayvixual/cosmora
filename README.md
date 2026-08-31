# 🌌 COSMORA

<div align="center">
  <p><strong>AI-Powered Space Exploration & Astronomy Experiences</strong></p>
  <img src="public/images/og-image.jpg" alt="Cosmora Preview" width="800" />
</div>

<br />

COSMORA is an interactive, web-based 3D space exploration platform that brings the universe directly to your browser. By combining real astronomical data, immersive 3D graphics, and contextual Artificial Intelligence, COSMORA allows users to seamlessly explore the Solar System, dive into Deep Space, and learn about celestial events.

## 🌟 Why Cosmora?

Traditional space websites are often static and text-heavy. COSMORA transforms learning into a living experience. Users can "fly" between planets, ask an AI questions about the celestial body they are viewing, and track real-time NASA data. It's astronomy made accessible, interactive, and educational.

## ✨ Features

- 🪐 **Interactive 3D Solar System**: Real-time WebGL rendering to pan, zoom, and rotate celestial bodies smoothly.
- 🤖 **Contextual AI Assistant**: Powered by **Groq LLM**. The AI knows which planet you're viewing and answers questions with ultra-low latency.
- 🚀 **Mission Logs & Telemetry**: Track historical space missions and view realistic telemetry data.
- 🔭 **Observation Logbook**: Securely log your real-world stargazing observations (Powered by Supabase RLS).
- 🛰️ **NASA API Integration**: Real-time Astronomy Picture of the Day (APOD) and dynamic celestial event tracking.
- 📱 **Responsive UI**: Modern, fluid interface built with Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **3D Engine**: Three.js, React Three Fiber, React Three Drei
- **Backend & Auth**: Supabase (PostgreSQL, Row Level Security)
- **AI**: Groq API for ultra-fast LLM inference

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- [Supabase](https://supabase.com/) account
- [Groq API](https://console.groq.com) key

### 2. Installation

```bash
git clone https://github.com/sayvixual/cosmora.git
cd cosmora
npm install
```

### 3. Environment Variables
Copy the example environment file and fill in your keys:
```bash
cp .env.example .env.local
```
Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY`
- `NASA_API_KEY` (Optional)

### 4. Database Setup
Run the SQL migrations located in `supabase/migrations/` in your Supabase SQL Editor to set up tables and RLS policies.

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start exploring.

## ☁️ Deployment

Optimized for Vercel. Push to your repository, import to Vercel, add your `.env.local` environment variables, and deploy.

## 📄 License
MIT License. See `LICENSE` for more information.

---
> **Note to AI Agents and Developers:** Please read `CLAUDE.md` for critical architecture rules, tech stack constraints, and guidelines before making any changes to the codebase.
