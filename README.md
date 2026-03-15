# 🚛 TowNow — On-Demand Tow Truck PWA

A full-stack Progressive Web App for on-demand roadside assistance, similar to Uber but for tow trucks.

---

## 📁 Project Structure

```
townow/
├── public/
│   ├── manifest.json          ← PWA manifest
│   └── icons/                 ← App icons (SVG, replace with PNG for production)
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← Root layout (fonts, PWA meta tags)
│   │   ├── globals.css        ← Global styles + Tailwind
│   │   ├── page.tsx           ← Home screen (customer / driver selector)
│   │   ├── auth/
│   │   │   └── page.tsx       ← Sign up / Login page
│   │   ├── customer/
│   │   │   └── page.tsx       ← Full customer tow request flow
│   │   └── driver/
│   │       └── page.tsx       ← Driver dashboard
│   ├── components/
│   │   ├── map/
│   │   │   └── MapView.tsx    ← Mapbox GL JS map component
│   │   ├── ui/
│   │   │   └── index.tsx      ← BottomSheet, Button, Badge, Card, Stars, etc.
│   │   ├── customer/
│   │   │   ├── ServiceSelector.tsx
│   │   │   ├── PriceEstimate.tsx
│   │   │   ├── SearchingAnimation.tsx
│   │   │   ├── PaymentScreen.tsx
│   │   │   └── RatingScreen.tsx
│   │   └── driver/
│   │       └── DriverCard.tsx
│   ├── hooks/
│   │   ├── useAuth.ts          ← Firebase auth state
│   │   ├── useDriverTracking.ts← Simulated live driver position
│   │   └── usePWAInstall.ts   ← beforeinstallprompt handler
│   ├── lib/
│   │   ├── firebase.ts        ← Firebase app init
│   │   └── mockData.ts        ← Drivers, services, pricing utils
│   └── store/
│       └── appStore.ts        ← Zustand global state
├── scripts/
│   └── generate-icons.js      ← Generates SVG icons for PWA
├── firestore.rules            ← Firestore security rules
├── database.rules.json        ← Realtime DB rules
├── next.config.js             ← Next.js + next-pwa config
├── tailwind.config.js
├── tsconfig.json
└── .env.local.example         ← Copy to .env.local and fill in keys
```

---

## 🚀 Quick Start (Windows)

### Prerequisites

1. **Node.js 18+** — Download from https://nodejs.org (choose LTS)
2. **Git** (optional) — https://git-scm.com

### Step 1 — Copy the project

Place the `townow/` folder anywhere on your machine, e.g. `C:\Projects\townow`

### Step 2 — Install dependencies

Open **Command Prompt** or **PowerShell** in the project folder:

```cmd
cd C:\Projects\townow
npm install
```

This installs all packages (~2–3 minutes the first time).

### Step 3 — Configure environment variables

```cmd
copy .env.local.example .env.local
```

Then open `.env.local` in Notepad and fill in your keys (see Firebase & Mapbox setup below).

> **Want to skip Firebase/Mapbox for now?**  
> The app has a **Demo Mode** button on the login screen — tap it to bypass authentication completely. The map will use a Mapbox public token placeholder, so the map itself won't load until you add a token.

### Step 4 — Run the development server

```cmd
npm run dev
```

Open your browser at **http://localhost:3000**

---

## 🗺️ Mapbox Setup (Free tier available)

1. Go to https://mapbox.com and create a free account
2. From your dashboard, copy your **Default public token** (starts with `pk.`)
3. Paste it in `.env.local`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6...
   ```

**Free tier**: 50,000 map loads/month — plenty for development and testing.

---

## 🔥 Firebase Setup (Free Spark plan)

### 1. Create a project
1. Go to https://console.firebase.google.com
2. Click **Add project** → give it a name (e.g. `townow-dev`)
3. Disable Google Analytics (optional for prototype)

### 2. Enable Authentication
1. Left sidebar → **Build → Authentication**
2. Click **Get started**
3. Enable **Email/Password** provider

### 3. Create Firestore Database
1. Left sidebar → **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a region close to you

### 4. Create Realtime Database
1. Left sidebar → **Build → Realtime Database**
2. Click **Create database**
3. Choose test mode → pick a location

### 5. Get your config keys
1. Left sidebar → **Project Overview** (gear icon) → **Project settings**
2. Scroll down to **Your apps** → click **</>** (Web)
3. Register the app (name: `townow-web`)
4. Copy the `firebaseConfig` object values into your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=townow-dev.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=townow-dev
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=townow-dev.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://townow-dev-default-rtdb.firebaseio.com
```

### 6. Deploy security rules (optional)
Install Firebase CLI and deploy:
```cmd
npm install -g firebase-tools
firebase login
firebase init
firebase deploy --only firestore:rules,database
```

---

## 📱 Testing as a PWA (Install to Home Screen)

### Android (Chrome)
1. Open http://localhost:3000 in Chrome
2. Tap the **⋮** menu → **Add to Home screen**
3. Or look for the install banner at the bottom of the screen

### iPhone (Safari)
1. Open http://localhost:3000 in Safari
2. Tap the **Share** icon (box with arrow)
3. Scroll down → **Add to Home Screen**
4. Tap **Add**

> **Note**: On iOS, PWA service workers only work over HTTPS. For local testing, Safari allows localhost. For real device testing over Wi-Fi, use a tunnel like `ngrok`:
> ```cmd
> npm install -g ngrok
> ngrok http 3000
> ```
> Then open the `https://xxxx.ngrok.io` URL on your phone.

---

## 🏗️ Building for Production

```cmd
npm run build
npm start
```

Or deploy to **Vercel** (recommended for Next.js):
1. Push to GitHub
2. Import at https://vercel.com
3. Add environment variables in Vercel dashboard
4. Deploy

---

## 🎮 App Flow Guide

### Customer Flow
1. Open app → tap **"I need a tow"**
2. Tap **Demo Mode** (or sign up with email)
3. The map loads centered on your location (or Dubai by default)
4. Tap the **pickup** field → tap the map to set location
5. Tap the **drop-off** field → tap the map to set destination
6. Tap the service card to expand → choose a tow type
7. Review the price estimate
8. Tap **Request Tow Truck**
9. Wait ~3 seconds → a driver is assigned
10. Watch the truck animate toward your pickup on the map
11. Status updates: searching → assigned → en route → arrived → in progress → completed
12. Payment screen appears → select method → confirm
13. Rate your driver

### Driver Flow
1. Open app → tap **"I'm a driver"**
2. Tap **Demo Mode**
3. Dashboard shows your stats (earnings, trips, rating)
4. Tap **Go Online** → green status appears
5. After ~4 seconds, an incoming request pops up with a 15-second countdown
6. Tap **Accept Job** → see pickup and drop-off on map
7. Tap **Start Navigation** → **I've Arrived** → **Mark Complete**
8. Earnings are added to your dashboard

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS |
| Animations | Framer Motion |
| Maps | Mapbox GL JS v3 |
| Auth | Firebase Authentication |
| Database | Firestore + Realtime Database |
| State | Zustand |
| PWA | next-pwa (Workbox) |
| Notifications | react-hot-toast |
| Icons | Lucide React |
| Language | TypeScript |

---

## 🔧 Common Issues

**"Mapbox map not loading"**  
→ Check your `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local`. Make sure there are no spaces around the `=`.

**"Firebase: auth/invalid-api-key"**  
→ Check all `NEXT_PUBLIC_FIREBASE_*` values in `.env.local`. Restart the dev server after changing env vars.

**"Cannot find module 'next-pwa'"**  
→ Run `npm install` again. If it persists: `npm install next-pwa --legacy-peer-deps`

**"Module not found: mapbox-gl"**  
→ Run `npm install mapbox-gl @types/mapbox-gl`

**Port 3000 already in use**  
→ `npm run dev -- -p 3001` to use port 3001

**Service worker not registering in dev**  
→ PWA service worker is disabled in development (by design). Build and run `npm start` to test the service worker.

---

## 📝 Extending the Prototype

### Add real geocoding (address → coords)
Use the Mapbox Geocoding API:
```ts
const res = await fetch(
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
)
const data = await res.json()
const [lng, lat] = data.features[0].center
```

### Add push notifications
Install `firebase/messaging` and configure a service worker with your VAPID key.

### Add real payment (Stripe)
```cmd
npm install @stripe/stripe-js @stripe/react-stripe-js
```
Create a Next.js API route at `/api/create-payment-intent`.

### Add SMS verification
Enable the Phone provider in Firebase Auth and use `signInWithPhoneNumber`.
