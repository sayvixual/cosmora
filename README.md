# 🌌 COSMORA

> **AI-Powered Space Exploration & Astronomy Experiences**

COSMORA is an interactive web-based 3D space exploration platform that brings the universe to your browser. By combining real astronomical data, immersive 3D graphics, and contextual AI, COSMORA allows users to seamlessly explore the Solar System, dive into Deep Space, and learn about celestial events and historic space missions.

![Cosmora Preview](public/images/og-image.jpg) *(Replace with actual screenshot if available)*

---

## ✨ Features

- **Interactive 3D Solar System**: Navigate and explore planets, moons, and the Sun with real-time 3D assets.
- **Deep Space Views**: Journey beyond our solar system to explore the Andromeda Galaxy, Orion Nebula, and more.
- **Contextual AI Assistant**: Powered by Groq LLM, the AI acts as your personal astronomer. It knows what you're looking at and answers your questions with scientific accuracy.
- **Mission Logs & Telemetry**: Track historical space missions (Apollo, Voyager, Perseverance) and view real-time-like telemetry.
- **Personal Observation Logbook**: Log your own real-world stargazing observations to your personal account.
- **NASA Data Integration**: Real-time Astronomy Picture of the Day (APOD) and dynamic celestial event tracking.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + `framer-motion` for fluid animations
- **3D Graphics**: `three.js` + `@react-three/fiber` + `@react-three/drei`
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security)
- **AI Integration**: [Groq API](https://console.groq.com) (Llama 3 / Mixtral models for ultra-fast inference)

## 🚀 Getting Started

Follow these steps to run Cosmora locally:

### 1. Clone the repository
```bash
git clone https://github.com/sayvixual/cosmora.git
cd cosmora
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file and fill in your keys:
```bash
cp .env.example .env.local
```
You will need:
- Supabase URL & Anon Key (from your Supabase project)
- Groq API Key
- NASA API Key (optional)

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to start exploring.

## 🗄️ Database Setup (Supabase)

To set up the required database tables, you can run the SQL files located in `supabase/migrations/` directly in your Supabase SQL Editor:
1. `001_initial_schema.sql` (Creates tables)
2. `002_seed_data.sql` (Populates base astronomical data)
3. `003_secure_rls.sql` (Enforces Row-Level Security for user logs)

---

> **Note to AI Agents and Developers:** Please read [CLAUDE.md](./CLAUDE.md) for critical architecture rules, tech stack constraints, and guidelines before making any changes to the codebase.
