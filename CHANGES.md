# DevTinder — Changes & Interview Notes

This file documents every change made to the project, why it was done, and what to say in an interview.

---

## 1. Fixed default landing page (/ → /home)

**Files changed:**
- `Client/src/App.jsx`
- `Client/src/layout/AppLayout.jsx`

**What was wrong:**
Opening `localhost:5173` was redirecting to `/auth` even for unauthenticated users visiting public pages.

**What was changed:**

`App.jsx` — replaced the `/` route from rendering `<Home>` to a hard redirect:
```jsx
// Before
{ path: "/", element: <AuthRoute><Home /></AuthRoute> }

// After
{ path: "/", element: <Navigate to="/home" replace /> }
```

`AppLayout.jsx` — the fetch-user function was navigating to `/auth` on any 401, even on public pages. Fixed to only redirect on 401 when the user is on a protected path:
```js
// Before
if (error.status === 401) { navigate("/auth"); }

// After
const publicPaths = ["/", "/home", "/about", "/pricing", "/auth"];
const isPublic = publicPaths.some((p) => window.location.pathname === p ...);
if (error.status === 401 && !isPublic) { navigate("/auth"); }
```

**Interview answer:**
> "The root issue was that AppLayout blindly redirected to /auth on any 401 — even when the user was on a public page. I separated public and protected paths and only triggered the redirect on protected routes. I also replaced the / route with a declarative Navigate component so the default landing page is /home."

---

## 2. Rebranded email templates from Bytemate → DevTinder

**Files changed:**
- `Server/src/controller/connectionController.js`
- `Server/src/service/cronJobs.js`

**What was changed:**
Both files had hardcoded "Bytemate" in email subject lines and HTML bodies.

```js
// Before
subject: "New connection request on Bytemate"
// html body also referenced "Bytemate" and "Team Bytemate"

// After
subject: "New connection request on DevTinder"
// html body now references "DevTinder" and "Team DevTinder"
```

**Why two files:**
- `connectionController.js` sends an instant email when someone swipes "interested"
- `cronJobs.js` sends a daily reminder email (runs at 2am) for pending requests older than 15 days

**Interview answer:**
> "The email system uses Nodemailer with a MailService class. There are two trigger points — an instant notification in the connection controller, and a scheduled cron job using node-cron that runs daily at 2am to remind users of unanswered requests. I updated both."

---

## 3. Made CORS and Socket.io origin dynamic for deployment

**Files changed:**
- `Server/src/app.js`
- `Server/src/config/socket.js`

**What was changed:**
Both had hardcoded `http://localhost:5173` as the allowed origin.

```js
// Before
cors({ origin: "http://localhost:5173" })

// After
cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" })
```

**Why:**
When deployed to Render, the client is on Vercel (`https://your-app.vercel.app`). If the origin is hardcoded to localhost, all API calls and WebSocket connections from the deployed frontend will be blocked by CORS.

**Interview answer:**
> "CORS is a browser security mechanism. The server must explicitly allow the frontend's origin. I moved the allowed origin to an environment variable so the same codebase works in both local dev (localhost:5173) and production (Vercel URL) without code changes — just config."

---

## 4. Made Client API URLs dynamic using Vite env variables

**Files changed:**
- `Client/src/utils/constants.js`

**What was changed:**
```js
// Before
export const BASE_URL = "http://localhost:3000/api/v1/";
export const SOCKET_URL = "http://localhost:3000";

// After
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1/";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
```

**Why `import.meta.env` and not `process.env`:**
Vite uses `import.meta.env` for env variables, not `process.env` (which is Node.js). In production on Vercel, you set `VITE_API_URL` and `VITE_SOCKET_URL` in the Vercel dashboard.

**Interview answer:**
> "Vite replaces `import.meta.env.VITE_*` variables at build time — they get baked into the static bundle. So in dev, the fallback localhost URLs are used. On Vercel, I set the real Render backend URL as an environment variable, and Vite injects it during the build."

---

## 5. Updated Server .gitignore

**Files changed:**
- `Server/.gitignore`

**Added:**
- `uploads/` — Multer temp upload folder (images before Cloudinary upload)
- `*.log`, `npm-debug.log*` — server log files
- `.env.local`, `.env.*.local` — extra env file variants
- `.vscode/`, `.idea/` — editor config
- `dist/`, `build/` — build output

**Interview answer:**
> "The critical ones are .env (secrets) and node_modules (large, regeneratable). I also added the uploads/ folder since Multer saves files there temporarily before they're uploaded to Cloudinary — those temp files should never be committed."

---

## 6. Deployment Setup

**Server → Render:**
- Root directory: `Server`
- Build command: `npm install`
- Start command: `node src/app.js`
- All .env variables added in Render dashboard
- `CLIENT_URL` set to the Vercel frontend URL

**Client → Vercel:**
- Root directory: `Client`
- Framework: Vite (auto-detected)
- Environment variables in Vercel dashboard:
  - `VITE_API_URL` = `https://<your-render-app>.onrender.com/api/v1/`
  - `VITE_SOCKET_URL` = `https://<your-render-app>.onrender.com`

**Interview answer:**
> "The architecture is decoupled — frontend on Vercel (static CDN), backend on Render (Node.js server). They communicate over HTTPS for REST calls and WSS (secure WebSocket) for Socket.io. Environment variables are used on both ends so no URLs are hardcoded."

---

## Key Architecture Points for Interview

| Topic | Answer |
|---|---|
| Auth mechanism | JWT stored in HTTP-only cookie, sent automatically with `withCredentials: true` |
| Real-time | Socket.io rooms, room ID = sorted user IDs joined by `_` |
| File uploads | Multer (temp) → Cloudinary (permanent), temp file deleted after upload |
| Payments | Razorpay order creation + webhook signature verification |
| Scheduled jobs | node-cron runs daily at 2am, sends reminder emails for pending requests |
| State management | Redux Toolkit with 5 slices: user, feed, matches, request, msgUserID |
| Code splitting | All pages loaded with React.lazy + Suspense |
| DB | MongoDB via Mongoose, collections auto-created on first write |

---

## 7. Vercel Deployment Configuration

**Files created:**
- `Client/.env.local` — local dev env (git-ignored via `*.local` rule)
- `Client/.env.production` — production env reference (documents Render URL)

**What was verified during inspection:**
- All API calls in every component (`Auth`, `Feed`, `Chat`, `Connection`, `Requests`, `EditProfile`, `Pricing`, `Header`, `CardDeck`, `AppLayout`) use `BASE_URL` from `constants.js` — no hardcoded localhost anywhere
- Socket.io uses `SOCKET_URL` from `constants.js` via `createSocketConnection()`
- All axios calls already have `withCredentials: true` — cookie/JWT auth preserved
- `constants.js` already uses `import.meta.env.VITE_API_URL` with localhost fallback (set in previous session)
- Client `.gitignore` already has `*.local` — so `.env.local` is automatically git-ignored

**Production URLs:**
- `VITE_API_URL` = `https://devtinder-backend-l3qn.onrender.com/api/v1/`
- `VITE_SOCKET_URL` = `https://devtinder-backend-l3qn.onrender.com`

**Build result:** ✅ `vite build` — 166 modules, 0 errors, built in 2.35s

**To deploy on Vercel:**
1. Push code to GitHub
2. New Project → connect repo → Root Directory: `Client`
3. Add environment variables in Vercel dashboard:
   - `VITE_API_URL` = `https://devtinder-backend-l3qn.onrender.com/api/v1/`
   - `VITE_SOCKET_URL` = `https://devtinder-backend-l3qn.onrender.com`
4. Deploy

**On Render — add after getting Vercel URL:**
- `CLIENT_URL` = `https://your-app.vercel.app`

**Interview answer:**
> "Vite bakes `import.meta.env.VITE_*` variables into the static bundle at build time. I kept localhost as the fallback in constants.js for local dev, and set the real Render URL via Vercel's environment variable dashboard. No secrets are hardcoded, no .env files are committed. All axios calls already had `withCredentials: true` so JWT cookie auth works cross-origin."

---

## 8. Fixed Vercel SPA 404 on direct URL access

**Problem:**
Navigating to `https://devtinder-six.vercel.app/home` directly returned `404 NOT_FOUND`.
Works fine inside the app because React Router handles it client-side.
But Vercel's CDN tried to find a physical file at `/home` in the `dist/` folder — found nothing — returned 404.

**Root cause:**
React Router uses the HTML5 History API (`createBrowserRouter`). All routes are virtual — only `index.html` physically exists. Any direct URL access or browser refresh on a non-root path hits Vercel's static file server, which has no fallback configured.

**Fix:**
Created `Client/vercel.json` with a catch-all rewrite:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
This tells Vercel: for ANY request path, serve `index.html`. React Router then picks up the URL and renders the correct page.

**Files created:**
- `Client/vercel.json`

**Build result:** ✅ 166 modules, 0 errors, 2.72s

**What to do:**
1. `git add Client/vercel.json`
2. `git commit -m "fix: add vercel SPA fallback rewrite"`
3. `git push`
4. Vercel auto-redeploys — `https://devtinder-six.vercel.app/home` will work

**Interview answer:**
> "This is a classic SPA deployment issue. React Router uses the browser History API — routes like /home don't exist as real files, they're handled entirely in JavaScript. When you deploy to a static host like Vercel and hit /home directly, the server looks for a physical file, finds nothing, and returns 404. The fix is a catch-all rewrite rule in vercel.json that serves index.html for every path. The browser loads React, React Router reads the URL, and renders the correct component."
