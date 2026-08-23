# Design Document

## Overview

This design describes the structure and content of a single markdown steering file that will be created at `DevTinder/.kiro/steering/devtinder-project-steering.md`. The file uses YAML frontmatter with `inclusion: always` so Kiro loads it automatically on every session, eliminating the need to re-explore the codebase for common tasks.

The output is **one file**. There is no runtime code, no API, and no build step. The design specifies exactly what sections to include, in what order, and in what format.

---

## File Location and Frontmatter

**Path:** `DevTinder/.kiro/steering/devtinder-project-steering.md`

**Frontmatter:**
```yaml
---
inclusion: always
---
```

This directive causes Kiro to inject the file into context at the start of every interaction.

---

## Section Layout (in order)

The file uses `##` headers only (no `###` nesting) to keep scanning fast. Each section maps directly to one or more requirements.

| # | Section Header | Req |
|---|---|---|
| 1 | `## Project Overview` | R1 |
| 2 | `## Tech Stack` | R2 |
| 3 | `## Project Structure` | R3 |
| 4 | `## Environment Variables` | R4 |
| 5 | `## Setup & Run` | R5 |
| 6 | `## API Routes` | R6 |
| 7 | `## Auth Flow` | R7 |
| 8 | `## Redux Store` | R8 |
| 9 | `## Socket.io` | R9 |
| 10 | `## Coding Conventions` | R10 |
| 11 | `## Common Tasks` | R11 |

---

## Section Content Design

### § Project Overview
- One-sentence description covering: developer matchmaking, swipe/connect, real-time chat, premium membership.
- Monorepo layout: `Client/` (React + Vite SPA) · `Server/` (Node.js + Express + MongoDB).
- Dev URLs: Client `http://localhost:5173` · Server `http://localhost:3000`.

### § Tech Stack
Two subsections using bullet lists:

**Client** (dependencies):
- React 19, react-redux 9, Redux Toolkit 2, React Router DOM 6, Axios, Socket.io-client 4, React Toastify 11, React Icons 5, React Spinners
- devDeps: TailwindCSS 3, Vite 7
- Module system: ES Modules (`import`/`export`), `.jsx` for components

**Server** (dependencies):
- Express 5, Mongoose 9, jsonwebtoken 9, bcrypt 6, cookie-parser, cors, Socket.io 4, Multer 2, Cloudinary 2, Razorpay, node-cron 4, nodemailer, Zod 4, dotenv
- Module system: CommonJS (`require`/`module.exports`), no TypeScript

### § Project Structure
Two compact annotated trees (use indented bullet lists, not full ASCII tree):

**Client `src/`:**
- `App.jsx` — router config, all lazy imports
- `main.jsx` — React root mount
- `Pages/` — About, Auth, Chat, Connection, EditProfile, Feed, Home, Pricing, Profile, Requests
- `Components/` — AuthRoute, CardDeck, Container, EmptyState, Footer, Header, Input, ProtectedRoute, Spinner, UserCard
- `layout/AppLayout.jsx` — wraps all routes, fetches current user on mount
- `utils/` — appStore.js, constants.js, userSlice.js, feedSlice.js, connectionSlice.js, requestSlice.js, chatNotify.js, socket.js

**Server `src/`:**
- `app.js` — entry: middleware, router mount, `server.listen`
- `routes/index.js` — mounts all v1 sub-routers
- `routes/v1/` — authRoutes, profileRoutes, requestRoutes, userRoutes, paymentRoutes, chatRoutes
- `controller/` — authController, profileController, connectionController, userController, paymentController, msgController
- `models/` — user, connectionRequest, chat, payment
- `middlewares/` — userAuth, multer, profileUpdate
- `config/` — db.js, cloudinary.js, razorpay.js, socket.js

**Client utils file purposes** (inline after file name):
- `appStore.js` → Redux store (5 reducers)
- `constants.js` → exports `BASE_URL`, `SOCKET_URL`
- `userSlice.js` → `{ user, isUserLoggedIn, authMode }` + actions `addUser`, `removeUser`, `setAuthMode`
- `feedSlice.js` → `{ feed: [] }` + actions `addFeed`, `removeFeed`
- `connectionSlice.js` → `{ matches: null }` + action `getConnection`
- `requestSlice.js` → `{ requests: null }` + action `getRequest`
- `chatNotify.js` → `{ msgUserID: [] }` + action `addnewUserID`
- `socket.js` → exports `createSocketConnection()` (returns new `io(SOCKET_URL)`)

**Server config file purposes** (inline after file name):
- `db.js` → MongoDB connection via Mongoose
- `cloudinary.js` → exports `uploadOnCloudinary(filePath)` — uploads image, deletes temp file
- `razorpay.js` → exports configured Razorpay instance using `RAZORPAY_API_KEY` / `RAZORPAY_API_SECRET`
- `socket.js` → exports `initializeSocket(server)` — Socket.io setup, events: `joinChat`, `sendMessage`, `typing`, `stopTyping`

### § Environment Variables
- Section opens with: **"Create `Server/.env` before starting the server. Missing keys will cause crashes."**
- Bullet list of all 14 keys (no values): `PORT`, `DB_URL`, `JWT_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RAZORPAY_API_KEY`, `RAZORPAY_API_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`

### § Setup & Run
Two numbered lists side by side as separate subsections:

**Server:**
1. `cd Server`
2. `npm install`
3. Create `Server/.env` with all 14 keys
4. `npm start` → runs `node src/app.js`

**Client:**
1. `cd Client`
2. `npm install`
3. `npm run dev` → Vite on port 5173

Note: run Server and Client in **separate terminals simultaneously**.

### § API Routes
Prefix: all routes under `/api/v1/`

Table or grouped bullet list per route group:

| Group | Method | Path | Auth |
|---|---|---|---|
| auth | POST | `/auth/signup` | — |
| auth | POST | `/auth/login` | — |
| auth | POST | `/auth/logout` | — |
| profile | GET | `/profile/view` | userAuth |
| profile | POST | `/profile/edit` | userAuth + multer |
| profile | PATCH | `/profile/reset-password` | userAuth |
| request | POST | `/request/send/:status/:toUserId` | userAuth |
| request | POST | `/request/review/:status/:requestId` | userAuth |
| user | GET | `/user/feed` | userAuth |
| user | GET | `/user/request/received` | userAuth |
| user | GET | `/user/connection` | userAuth |
| user | DELETE | `/user/remove/:dltConnectionId` | userAuth |
| payment | POST | `/payment/create` | userAuth |
| payment | POST | `/payment/webhook` | — (Razorpay sig) |
| payment | GET | `/payment/verify/premimum` | userAuth |
| conversation | GET | `/conversation/:userId` | userAuth |

### § Auth Flow
Ordered bullet list:
1. **Login** → Server signs JWT (`{ _id }`, 1d expiry) → sets `token` cookie (httpOnly, secure, sameSite: "none")
2. **Client** sends all Axios requests with `withCredentials: true`
3. **userAuth** middleware: reads `req.cookies.token` → 401 if absent → `jwt.verify(token, JWT_KEY)` → attaches decoded payload to `req.user` → 401 if invalid/expired
4. **AppLayout** on mount: if `state.user.user` is null → `GET /api/v1/profile/view` → dispatch `addUser(res.data)` → on 401 navigate to `/auth`
5. **ProtectedRoute**: redirects to `/auth` when `state.user.user === null`
6. **AuthRoute**: redirects to `/profile` when `state.user.user !== null`

### § Redux Store
Store key → initial state → actions table:

| Store key | Initial state | Actions |
|---|---|---|
| `user` | `{ user: null, isUserLoggedIn: false, authMode: "login" }` | `addUser`, `removeUser`, `setAuthMode` |
| `feed` | `{ feed: [] }` | `addFeed`, `removeFeed` |
| `matches` | `{ matches: null }` | `getConnection` |
| `request` | `{ requests: null }` | `getRequest` |
| `msgUserID` | `{ msgUserID: [] }` | `addnewUserID` |

Store file: `Client/src/utils/appStore.js`. All slices co-located in `Client/src/utils/`.

### § Socket.io
- **Server init:** `initializeSocket(server)` in `Server/src/config/socket.js` called from `app.js`. CORS origin: `http://localhost:5173`.
- **Room ID:** `[userId1, userId2].sort().join("_")`
- **Server events:** `joinChat` (joins room), `sendMessage` (saves to DB, emits `messageRecieved`), `typing`, `stopTyping`
- **Client connect:** `createSocketConnection()` from `Client/src/utils/socket.js` → returns `io(SOCKET_URL)`. Call per component, not a global singleton.
- `SOCKET_URL = "http://localhost:3000"` from `Client/src/utils/constants.js`

### § Coding Conventions
- Server: CommonJS only (`require`/`module.exports`)
- Client: ES Modules only (`import`/`export`), `.jsx` extension for all React files
- Code splitting: all Pages loaded via `React.lazy()` + `<Suspense>` in `App.jsx`
- Styling: TailwindCSS utility classes only. DaisyUI is **not** installed. Minimal custom CSS in `App.css`/`index.css`
- Validation: Zod on the Server for request body/param validation
- Auth: `bcrypt` for password hashing, `jsonwebtoken` with `JWT_KEY` for tokens
- Theme: `AppLayout` applies `bg-slate-900 text-slate-100 min-h-screen` to all routes

### § Common Tasks
Four recipes as bullet items:

**New API endpoint:**
1. Add controller fn to `Server/src/controller/<domain>Controller.js`
2. Add route to `Server/src/routes/v1/<domain>Routes.js` with `userAuth` if protected

**New client page:**
1. Create `Client/src/Pages/MyPage.jsx`
2. Add `const MyPage = lazy(() => import('./Pages/MyPage'))` in `App.jsx`
3. Add route object in `createBrowserRouter` array, wrap with `ProtectedRoute` or `AuthRoute`

**New Redux slice:**
1. Create `Client/src/utils/mySlice.js` with `createSlice`, export reducer (default) and actions (named)
2. Import in `appStore.js`, add to `reducer: { myKey: myReducer }`

**New Mongoose model:**
1. Create `Server/src/models/myModel.js` with schema
2. Export `module.exports = mongoose.model('MyModel', mySchema)`

---

## Format Constraints

- Max 600 lines total
- No `###` or deeper headers — `##` only
- No prose paragraphs — bullet lists, tables, and inline code only
- Frontmatter block at the very top
- Actual line budget estimate: ~280 lines (well within 600)
