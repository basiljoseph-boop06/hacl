# 🏥 Carelytix — Digital Health Identity Platform

> A production-ready healthcare web application built with Next.js 14+, TypeScript, TailwindCSS, MongoDB, Firebase, and AI-powered medical analysis.

---

## 🎯 Overview

Carelytix is a **Digital Health Identity + Primary Care Assignment + AI-powered Healthcare Network** that:

1. **Assigns each user a unique Health ID** (`AG-XXXXXXXX`) upon registration
2. **Auto-assigns the nearest verified hospital** based on geolocation
3. **Provides a secure medical vault** for storing vitals, lab results, X-rays, and prescriptions
4. **AI Oracle** powered by Featherless API for medical report analysis, donor eligibility, and X-ray explanation
5. **Blood Community** with live map of active blood requests and donor matching
6. **QR-based hospital check-in** for fast-track verification

---

## 🏗 Architecture

```
d:\NEXTJA\
├── app/
│   ├── (auth)/              # Auth pages (login, register)
│   │   ├── layout.tsx       # Gradient background with glass card
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── api/                 # API routes
│   │   ├── auth/            # register, login, me
│   │   ├── hospitals/       # CRUD + nearest
│   │   ├── vault/           # Medical records CRUD
│   │   ├── blood-requests/  # GET, POST, PATCH
│   │   ├── ai/              # analyze-report, check-donor, explain-xray
│   │   ├── verify/          # QR + document verification
│   │   └── seed/            # Sample data seeder
│   ├── dashboard/           # Protected dashboard pages
│   │   ├── layout.tsx       # Sidebar + auth guard
│   │   ├── page.tsx         # Overview with stats + health passport
│   │   ├── vault/           # Medical records vault
│   │   ├── ai-oracle/       # AI analysis interface
│   │   ├── blood-community/ # Map + blood requests
│   │   └── hospital/        # Assigned hospital info
│   ├── globals.css          # Design system + animations
│   ├── layout.tsx           # Root layout with AuthProvider
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx       # 5 variants, 3 sizes, loading state
│   │   ├── Card.tsx         # Glass, gradient, bordered variants
│   │   ├── Input.tsx        # Label, error, icon support
│   │   ├── Badge.tsx        # Status indicators
│   │   ├── Modal.tsx        # Overlay dialog
│   │   ├── Spinner.tsx      # Loading spinner
│   │   ├── Sidebar.tsx      # Dashboard navigation
│   │   └── StatsCard.tsx    # Metric display card
│   └── dashboard/
│       ├── HealthPassport.tsx  # QR code + verification
│       └── BloodMap.tsx        # React-Leaflet map
├── hooks/
│   ├── useAuth.tsx          # Firebase auth context
│   ├── useUser.ts           # User profile fetching
│   └── useGeolocation.ts    # Browser geolocation
├── lib/
│   ├── mongodb.ts           # Mongoose singleton connection
│   ├── firebase.ts          # Firebase client SDK
│   ├── firebase-admin.ts    # Firebase Admin SDK
│   ├── healthId.ts          # Health ID generation + QR encryption
│   ├── hospitals.ts         # Haversine distance + nearest hospital
│   └── featherless.ts       # AI API client
├── models/
│   ├── User.ts              # Health ID, hospital assignment, scores
│   ├── Hospital.ts          # Geolocation, capacity, specialties
│   ├── Vault.ts             # Medical records storage
│   └── BloodRequest.ts      # Blood donation requests
├── types/
│   └── index.ts             # TypeScript interfaces
└── .env.local               # Environment variables (template)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (Atlas or local)
- Firebase project with Auth enabled
- Featherless API key

### Setup

```bash
# Install dependencies
npm install

# Configure environment
# Edit .env.local with your credentials (a template is included in the repo)
# for local development you can omit MONGODB_URI entirely and the app will
# fall back to mongodb://localhost:27017/carelytix-demo automatically.

# NOTE: eslint options have been removed from next.config.ts – run `npm run lint`
# or `next lint` manually if you want to check code.
#
# UI improvements
# The dashboard and hospital pages now display interactive maps and cleaner
# cards. For a production demo you can style further or integrate real map
# tiles.  (You're free to tweak Tailwind colors or component layouts.)

# Seed sample data (hospitals, blood requests, plus two demo users)
# POST to http://localhost:3000/api/seed
# the seeded users are `doctor@example.com` and `patient@example.com`
# you can log in with either email (password not checked) since the login
# endpoint accepts email directly for demos.
#
# Optional modes:
#   - `?ai=true` (or set USE_AI_HOSPITALS=true in .env.local) will ask
#     Featherless AI to generate a list of hospitals around Vandalur, TN.
#   - `scripts/scrapeHospitals.ts` can be run to pull real names from a public
#     directory and then manually insert them via the Mongo shell or extend
#     this script to POST to /api/hospitals.

# Start development server
npm run dev
```

### Environment Variables

```env
# MongoDB connection string; omit to use local mongodb://localhost:27017/carelytix-demo
MONGODB_URI=your_mongodb_uri

# Firebase web config (public-facing)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (server)
FIREBASE_ADMIN_PROJECT_ID=...
FIREBASE_ADMIN_CLIENT_EMAIL=...
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Third‑party API keys
FEATHERLESS_API_KEY=your_key

# Optional secrets
HEALTH_ID_SECRET=your_secret  # used to generate health IDs
```

---

## 🎨 Design System

Consistent **medical teal + navy** color palette:

| Token     | Color     | Usage                  |
| --------- | --------- | ---------------------- |
| Primary   | `#0D9488` | Buttons, active states |
| Secondary | `#1E293B` | Sidebar, dark sections |
| Accent    | `#F59E0B` | Karma, warnings        |
| Danger    | `#EF4444` | Blood requests, errors |
| Success   | `#22C55E` | Verified states        |

Font: **Inter** via Google Fonts

---

## 🔒 Security

- Firebase Auth for authentication
- Server-side token verification via Firebase Admin
- Environment variables for all secrets
- AES-encrypted QR payloads with 30-min expiry
- HMAC-SHA256 hashing for sensitive data
- No raw medical data exposed publicly

---

## 📡 API Endpoints

| Method         | Route                    | Description                 |
| -------------- | ------------------------ | --------------------------- |
| POST           | `/api/auth/register`     | Create user + Health ID     |
| POST           | `/api/auth/login`        | Login with Firebase UID     |
| GET            | `/api/auth/me`           | Get current user profile    |
| GET            | `/api/hospitals`         | List all hospitals          |
| GET            | `/api/hospitals/nearest` | Find nearest hospital       |
| GET/POST       | `/api/vault`             | Medical records CRUD        |
| GET/POST/PATCH | `/api/blood-requests`    | Blood request management    |
| POST           | `/api/ai/analyze-report` | AI medical report analysis  |
| POST           | `/api/ai/check-donor`    | Donor eligibility check     |
| POST           | `/api/ai/explain-xray`   | X-ray explanation           |
| POST           | `/api/verify/qr`         | QR-based verification       |
| POST           | `/api/verify/document`   | Document-based verification |
| POST           | `/api/seed`              | Seed sample data            |

---

## 🚢 Deployment (Vercel)

```bash
vercel --prod
```

Ensure all environment variables are configured in Vercel dashboard.

---

Built with ❤️ by Carelytix Team
#   h a c l  
 