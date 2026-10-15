# ChatTruth — Production Deployment Guide

This guide details deploying ChatTruth to production using Vercel (Frontend) and Render / Node.js host (Backend) with MongoDB Atlas.

---

## 1. Architecture Overview

```
Frontend (Vercel)  ──HTTPS──>  Backend (Render Node.js)  ──TLS──>  MongoDB Atlas
                                           │
                       ┌───────────────────┼────────────────────┐
                       ▼                   ▼                    ▼
                 Google Gemini         Razorpay / Stripe      Resend
```

---

## 2. Backend Deployment (Render / Railway / Fly.io)

1. Connect your Git repository.
2. Root Directory: `server`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start` (runs `node dist/server.js`)
5. Configure Environment Variables in the provider dashboard:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `CLIENT_ORIGIN=https://your-frontend.vercel.app`
   - `PUBLIC_APP_URL=https://your-frontend.vercel.app`
   - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chattruth?retryWrites=true&w=majority`
   - `SESSION_SECRET=<minimum-32-character-random-secret>`
   - `JWT_SECRET=<minimum-32-character-random-secret>`
   - `GEMINI_API_KEY=<your-google-gemini-key>`
   - `GEMINI_MODEL=gemini-2.5-flash`
   - `RAZORPAY_KEY_ID=<live_key_id>`
   - `RAZORPAY_KEY_SECRET=<live_key_secret>`
   - `RAZORPAY_WEBHOOK_SECRET=<webhook_secret>`
   - `RESEND_API_KEY=<re_...>`
   - `EMAIL_FROM=ChatTruth <notifications@yourdomain.com>`

---

## 3. Frontend Deployment (Vercel)

1. Import project in Vercel.
2. Root Directory: `client`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. In `vite.config.ts` or Vercel Rewrites, route `/api/(.*)` to `https://your-backend.onrender.com/api/$1`.

---

## 4. Verification & Health Probes

Verify the deployed services:
- Health check: `https://your-backend.onrender.com/api/v1/health` (should return `{ "status": "ok" }`)
- Readiness check: `https://your-backend.onrender.com/api/v1/ready` (should return `{ "ready": true }`)
