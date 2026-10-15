# 💬 ChatTruth — AI WhatsApp Conversation & Conflict Dynamics Analyzer

<div align="center">
  <img src="client/public/logo.png" alt="ChatTruth Logo" width="380" />
  <p><strong>"Understand more. Assume less."</strong></p>
  <p>Evidence-grounded WhatsApp conversation dynamics, Hinglish conflict verdicts, and genuine intent decoding.</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
  [![React 19](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%20%7C%20Tailwind-61dafb)](https://react.dev/)
  [![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%20%7C%20TypeScript-339933)](https://nodejs.org/)
  [![AI](https://img.shields.io/badge/AI-Google%20Gemini%203.8%20Flash-4285F4)](https://ai.google.dev/)
  [![Tests](https://img.shields.io/badge/Tests-25%2F25%20Passing-brightgreen)](tests)
  [![Security](https://img.shields.io/badge/Privacy-Zero%20Raw%20Storage-success)](#-privacy--security-architecture)
</div>

---

## 🌟 What is ChatTruth?

**ChatTruth** is a full-stack, production-grade AI conversation analysis platform designed for real-world messaging dynamics. It turns exported WhatsApp plain-text conversations (`.txt`) into clear, honest, and mathematically verifiable reports.

Specially engineered for **Hinglish, Indian WhatsApp idioms, and modern messaging culture**, ChatTruth avoids vague, diplomatic AI non-answers and gives direct, respectful, and balanced rulings on relationship and friendship disputes.

---

## ✨ Key Features

### ⚖️ 1. Unambiguous Conflict Verdicts ("Faisla")
- ❌ **Galat Kaun Tha (Who Was Wrong)**: Identifies the primary fault (e.g., emotional withdrawal, silent treatment, dismissive one-word replies, passive aggression).
- 🟢 **Sahi Kaun Tha (Who Was Right)**: Validates justified concerns, patience, or open communication attempts.
- ⚖️ **Direct AI Ruling**: A clear, balanced 1-sentence verdict on what actually happened.
- 📊 **Responsibility Split Bar**: Mathematical fault distribution (e.g., 65% vs 35%).
- 💡 **Dil Mein Kya Tha (Underlying Intent)**: Decodes what each person *actually* wanted beneath the surface.
- 💬 **WhatsApp Ready-to-Send Reply Scripts**: Copyable WhatsApp messages crafted to de-escalate tension and rebuild connection.

### 🇮🇳 2. Native Hinglish & Indian WhatsApp Idiom Understanding
- Understands colloquial Hinglish phrases and sarcasm:
  - *"Bade log ho gaye"*, *"Scene kya hai"*, *"Achha theek hai"*, *"Koi baat nahi"*, *"Apna dekh lo"*, etc.
- Accurately filters out WhatsApp metadata stopwords (`omitted`, `joined using this group's invite link`, `changed the subject`, `deleted this message`, `end-to-end encrypted`).

### 📊 3. Deterministic Statistical Analysis
- **100% Calculated in Code (Zero Hallucination)**:
  - Exact message counts & word counts
  - Participation Balance Index (0–100%)
  - Response-Time Latency & Pacing (median reply intervals)
  - 24-Hour Activity Heatmap (Time-of-day distribution)
  - Conversation Initiator Ratios

### 🔒 4. Zero Permanent Storage & Privacy Sovereignty
- **In-Memory Ephemeral Pipeline**: Chat files are analyzed in temporary memory buffers and never permanently archived.
- **Enterprise Google Gemini API**: No user conversations are ever used to train public AI models.
- **DPDP Act 2023 & GDPR Aligned**: 1-click account and report deletion, 60-minute automatic cleanup routines.

---

## 🛠️ Architecture & Tech Stack

```
chattruth/
├── client/                      # Frontend SPA (React 19, Vite, Tailwind CSS v4, Lucide Icons)
│   ├── src/
│   │   ├── components/          # Layout (Navbar, Footer), Forms, Reports, ConflictVerdictCard
│   │   ├── pages/               # Home, Analyze, SampleReport, Relationship, Friends, Auth, Dashboard
│   │   └── lib/api.ts           # Type-safe API client (supports local dev & production URLs)
│   └── vercel.json              # Vercel SPA client routing configuration
├── server/                      # Backend API (Node.js, Express, TypeScript, Zod)
│   ├── src/
│   │   ├── controllers/         # Uploads, Reports, Auth, Payments, Admin
│   │   ├── services/            # WhatsApp Parser, Statistics Engine, Gemini AI Analyzer
│   │   ├── models/              # Mongoose schemas + safe in-memory store fallback
│   │   └── app.ts / server.ts   # Express server with Helmet, CORS, RateLimiting
│   └── tests/                   # Automated Vitest test suite (25/25 passing)
├── shared/types/                # Shared TypeScript contracts between client & server
├── docs/                        # Complete Deployment, Setup, and Security Guides
├── .env.example                 # Production environment variable reference
└── .gitignore                   # Bulletproof protection for secrets and uploads
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- (Optional) **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 2. Clone & Install
```bash
git clone https://github.com/arvind0019/chattruth.git
cd chattruth

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Configure Environment
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```
Add your Gemini API key in `server/.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```
*(If left blank, ChatTruth automatically runs in deterministic mock mode for offline testing.)*

### 4. Run Automated Tests
```bash
cd server && npm test
```
*Expected: 5 test suites passed, 25 tests passed.*

### 5. Launch Locally
```bash
# Terminal 1: Backend API (Port 5000)
cd server && npm run dev

# Terminal 2: Frontend Client (Port 5173)
cd client && npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## ☁️ Production Deployment Guide

Deploying ChatTruth for public use takes less than 10 minutes using **Vercel** (Frontend) + **Render / Railway** (Backend) + **MongoDB Atlas** (Database).

### Step 1: Database (MongoDB Atlas — Free)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free Shared M0 cluster.
2. Under **Database Access**, create a user (e.g., `chattruth_admin`).
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere).
4. Click **Connect** -> **Drivers** and copy your connection string:
   `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/chattruth?retryWrites=true&w=majority`

### Step 2: Backend (Render / Railway)
1. Go to [render.com](https://render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`arvind0019/chattruth`).
3. Set the following settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add **Environment Variables** in Render:
   ```env
   NODE_ENV=production
   PORT=5000
   CLIENT_ORIGIN=https://your-app.vercel.app
   PUBLIC_APP_URL=https://your-app.vercel.app
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.abcde.mongodb.net/chattruth
   SESSION_SECRET=min_32_characters_random_string_here
   JWT_SECRET=min_32_characters_random_string_here
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-3.8-flash
   PAYMENT_PROVIDER=razorpay
   REPORT_PRICE_INR=49900
   ```
5. Click **Deploy Web Service** and copy your backend URL (e.g., `https://chattruth-backend.onrender.com`).

### Step 3: Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com/) and click **Add New** -> **Project**.
2. Import your GitHub repository (`arvind0019/chattruth`).
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable** in Vercel:
   ```env
   VITE_API_URL=https://chattruth-backend.onrender.com
   ```
5. Click **Deploy**. Your app is live!

---

## 🔒 Privacy & Security Architecture

1. **No Raw Text Persistence**: Uploaded chat exports are processed strictly in-memory during analysis and wiped automatically.
2. **Encrypted Communication**: Strict HTTPS/TLS enforcement, Helmet headers, CORS origin verification, and HTTP-only cookies.
3. **Password Security**: Strong salting and hashing using Argon2/Bcrypt.
4. **Data Minimization**: Reports contain statistical counts and small verified excerpt quotes; full original raw transcripts are never retained.

---

## 📄 License & Disclaimer

MIT License © 2026 ChatTruth.

*Disclaimer: ChatTruth provides conversational pattern analysis and communication reflection. It does not constitute psychological therapy, medical diagnosis, or legal counsel.*
