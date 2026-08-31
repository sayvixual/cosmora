# 🌌 COSMORA

> **AI-Powered Space Exploration & Astronomy Experiences**

COSMORA is an interactive, web-based 3D space exploration platform that brings the universe directly to your browser. By combining real astronomical data, immersive 3D graphics, and contextual Artificial Intelligence, COSMORA allows users to seamlessly explore the Solar System, dive into Deep Space, and learn about celestial events and historic space missions.

![Cosmora Preview](public/images/og-image.jpg) *(Note: Replace with actual project screenshot)*

---

## 🌟 About The Project

Our mission is to make astronomy accessible, interactive, and educational. Traditional space websites are often static and text-heavy. COSMORA transforms learning into an experience by letting users "fly" between planets, ask an AI questions about the celestial body they are currently viewing, and track real-time NASA data.

## ✨ Key Features

- **Interactive 3D Solar System**: Navigate and explore planets, moons, and the Sun. The 3D environment is built with real-time WebGL rendering, allowing you to pan, zoom, and rotate celestial bodies.
- **Deep Space Views**: Journey beyond our solar system to explore the Andromeda Galaxy, Orion Nebula, and other deep space phenomena.
- **Contextual AI Assistant**: Powered by **Groq LLM** (Llama 3 / Mixtral). The AI acts as your personal astronomer. It knows exactly which planet or galaxy you are currently viewing and answers your questions with high scientific accuracy.
- **Mission Logs & Telemetry**: Track historical space missions (e.g., Apollo, Voyager, Perseverance) and view realistic telemetry data.
- **Personal Observation Logbook**: Log your own real-world stargazing observations to your personal account, protected by row-level security.
- **NASA Data Integration**: Features real-time Astronomy Picture of the Day (APOD) and dynamic celestial event tracking using NASA APIs.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + `framer-motion` (for fluid UI animations) |
| **3D Graphics** | `three.js` + `@react-three/fiber` + `@react-three/drei` |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Row Level Security) |
| **AI Integration** | [Groq API](https://console.groq.com) (Ultra-fast LLM inference) |

---

## ⚠️ IMPORTANT: Git LFS Requirement

Because this project utilizes high-quality 3D models and high-resolution textures (totaling over 200MB), **Git Large File Storage (LFS)** is strictly required.

If you clone this repository without Git LFS installed, you will download 130-byte text pointers instead of the actual 3D models, which will result in `THREE.GLTFLoader` errors.

**To ensure 3D models load correctly:**
1. Install Git LFS: [https://git-lfs.github.com/](https://git-lfs.github.com/)
2. Run `git lfs install` in your terminal.
3. If you have already cloned the repo, run `git lfs pull` to download the actual 3D assets.

---

## 🚀 Getting Started (Local Development)

Follow these steps to run Cosmora locally on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/sayvixual/cosmora.git
cd cosmora
git lfs pull # (Ensures 3D models are downloaded)
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
You must set up your environment variables for the database and AI to function.
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in your keys:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Public Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key (Keep Secret) |
| `GROQ_API_KEY` | Your Groq API Key for the Contextual AI |
| `NASA_API_KEY` | (Optional) For fetching live APOD data |

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to start exploring.

---

## 🗄️ Database Setup (Supabase)

To set up the required database tables, you can run the SQL files located in `supabase/migrations/` directly in your Supabase SQL Editor:
1. **`001_initial_schema.sql`**: Creates the `observations` and `celestial_objects` tables.
2. **`002_seed_data.sql`**: Populates base astronomical data.
3. **`003_secure_rls.sql`**: Enforces strict Row-Level Security (RLS) so users can only view and edit their own logs.

---

## ☁️ Deployment (Vercel)

This project is optimized for deployment on Vercel. 
1. Import the repository into your Vercel Dashboard.
2. **Crucial Step:** Add all the variables from your `.env.local` into the **Environment Variables** section in the Vercel deployment settings.
3. Vercel natively supports Git LFS, so it will automatically pull the 3D models during the build process (`npm run build`).
4. Click **Deploy**.

---

> **Note to AI Agents and Developers:** Please read [CLAUDE.md](./CLAUDE.md) for critical architecture rules, tech stack constraints, and guidelines before making any changes to the codebase.
