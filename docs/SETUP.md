# ChatTruth — Local Development Setup Guide

This guide describes how to run and configure ChatTruth locally in development mode.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (Tested on Node v24)
- **npm**: v9.0.0 or higher
- Optional: MongoDB Community or MongoDB Atlas URI (ChatTruth features a built-in safe in-memory fallback store so local development and automated testing work out of the box even without MongoDB running)

---

## 2. Repository Layout

```
chattruth/
├── client/       # React + TypeScript + Vite + Tailwind CSS v4 frontend
├── server/       # Node.js + Express + TypeScript + Zod backend API
├── shared/       # Shared TypeScript domain contracts and interfaces
├── docs/         # Setup, API, Security, and Deployment guides
└── package.json  # Monorepo root workspace configuration
```

---

## 3. Quick Start (Step-by-Step)

### Step 1: Clone and navigate
```bash
cd chattruth
```

### Step 2: Install Dependencies
Install dependencies for both workspaces:
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
cd ..
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

Ensure the following minimal settings are configured for local development:
```ini
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
PUBLIC_APP_URL=http://localhost:5173

# Optional: Add your Google Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

> **Note on Mock Mode**: If `GEMINI_API_KEY` is not provided, ChatTruth runs in safe deterministic mock mode, producing structured, realistic analysis grounded strictly in the messages without external network calls.

---

## 4. Starting the Application

Open two terminal windows:

### Terminal 1: Backend API Server
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`.

### Terminal 2: Frontend Client
```bash
cd client
npm run dev
```
The Vite development server will start on `http://localhost:5173`.

---

## 5. Running Automated Tests

Run the full automated test suite (including WhatsApp parser, statistics calculations, AI schema verification, payment signature verification, and API route guards):

```bash
cd server
npm run test
```

To run tests in watch mode during development:
```bash
npm run test:watch
```

---

## 6. Building for Production

To compile both client and server production bundles:

```bash
# Build server
cd server
npm run build

# Build client
cd ../client
npm run build
```
