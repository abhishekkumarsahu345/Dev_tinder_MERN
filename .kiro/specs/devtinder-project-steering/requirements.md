# Requirements Document

## Introduction

This specification defines the requirements for a steering/context file for the DevTinder project. DevTinder is a developer-matching web application (inspired by Tinder) that allows developers to discover each other, connect, chat, and subscribe to premium features. The project is a monorepo with two independently runnable sub-projects: **Client** (React + Vite SPA) and **Server** (Node.js + Express REST API + Socket.io).

The steering file serves as a compact, structured reference document that allows an AI assistant to:
- Load all critical project context in minimal tokens
- Execute common development tasks without re-exploring the codebase
- Follow established conventions consistently
- Set up and run both Client and Server from scratch

---

## Glossary

- **Steering_File**: A markdown document placed at `.kiro/steering/` that is automatically loaded into AI assistant context on every interaction.
- **Client**: The React + Vite frontend application located at `DevTinder/Client/`.
- **Server**: The Node.js + Express backend application located at `DevTinder/Server/`.
- **AI_Assistant**: The AI coding assistant (Kiro) that reads the steering file to understand the project.
- **Developer**: A human engineer working on the DevTinder codebase.
- **Redux_Store**: The client-side global state manager configured in `Client/src/utils/appStore.js`.
- **Protected_Route**: A React route component that redirects unauthenticated users to `/auth`.
- **Auth_Route**: A React route component that redirects already-authenticated users away from public pages to `/profile`.
- **JWT_Token**: A JSON Web Token stored as an HTTP-only cookie named `token`, used for authentication.
- **BASE_URL**: The client-side constant (`http://localhost:3000/api/v1/`) used as the Axios base URL.
- **SOCKET_URL**: The client-side constant (`http://localhost:3000`) used to connect Socket.io.
- **API_Route_Group**: A versioned Express sub-router mounted under `/api/v1/`.
- **ENV_File**: The `.env` file at `Server/.env` that stores secrets and configuration values.

---

## Requirements

### Requirement 1: Project Overview Section

**User Story:** As an AI assistant, I want a concise project overview, so that I can immediately understand what DevTinder is and answer questions about it without exploring the codebase.

#### Acceptance Criteria

1. THE Steering_File SHALL include a description of the DevTinder application covering all four of: developer matchmaking, swipe-to-connect, real-time chat, and premium membership.
2. THE Steering_File SHALL list the monorepo top-level structure: `Client/` (React + Vite SPA) and `Server/` (Node.js + Express + MongoDB) as the two independently runnable sub-projects.
3. THE Steering_File SHALL state the local development base URLs: Client on `http://localhost:5173` and Server on `http://localhost:3000`.

---

### Requirement 2: Tech Stack Reference

**User Story:** As an AI assistant, I want a complete, scannable tech stack reference, so that I can recommend the correct libraries and APIs without guessing.

#### Acceptance Criteria

1. THE Steering_File SHALL list all Client dependencies with their roles: React 19, react-redux 9, Redux Toolkit 2, React Router DOM 6, Axios, Socket.io-client 4, React Toastify 11, React Icons 5, React Spinners; with TailwindCSS 3 and Vite 7 as devDependencies. Note: DaisyUI is NOT installed.
2. THE Steering_File SHALL list all Server dependencies with their roles: Express 5, Mongoose 9, jsonwebtoken 9, bcrypt 6, cookie-parser, cors, Socket.io 4, Multer 2, Cloudinary 2, Razorpay, node-cron 4, nodemailer, Zod 4, dotenv.
3. THE Steering_File SHALL note that the Server uses CommonJS (`require`/`module.exports`) and the Client uses ES Modules (`import`/`export`).
4. THE Steering_File SHALL note that the Server runs on plain Node.js and does NOT use TypeScript.

---

### Requirement 3: Project Structure Map

**User Story:** As an AI assistant, I want a precise folder-by-folder structure map, so that I can navigate to the correct file for any task without a full directory scan.

#### Acceptance Criteria

1. THE Steering_File SHALL document the Client source tree including: `src/App.jsx` (router config, lazy imports), `src/main.jsx` (React root mount), `src/Pages/` (About, Auth, Chat, Connection, EditProfile, Feed, Home, Pricing, Profile, Requests), `src/Components/` (AuthRoute, CardDeck, Container, EmptyState, Footer, Header, Input, ProtectedRoute, Spinner, UserCard), `src/layout/AppLayout.jsx`, `src/utils/`.
2. THE Steering_File SHALL document the Server source tree: `src/app.js` (entry point, middleware setup, server listen), `src/routes/index.js` (v1 router mount), `src/routes/v1/` (authRoutes, profileRoutes, requestRoutes, userRoutes, paymentRoutes, chatRoutes), `src/controller/`, `src/models/`, `src/middlewares/`, `src/config/`.
3. THE Steering_File SHALL list the purpose of each Client utility file: `appStore.js` (Redux store with 5 slices), `constants.js` (exports BASE_URL and SOCKET_URL), `userSlice.js` (current user, isUserLoggedIn, authMode), `feedSlice.js` (feed array for swipe), `connectionSlice.js` (confirmed matches), `requestSlice.js` (pending incoming requests), `chatNotify.js` (array of user IDs with new messages), `socket.js` (exports `createSocketConnection()` factory).
4. THE Steering_File SHALL list the purpose of each Server config file: `db.js` (MongoDB connection via Mongoose), `cloudinary.js` (exports `uploadOnCloudinary(filePath)` helper), `razorpay.js` (exports configured Razorpay instance), `socket.js` (exports `initializeSocket(server)` — sets up Socket.io rooms and chat events).

---

### Requirement 4: Environment Variables Reference

**User Story:** As an AI assistant, I want a list of all required environment variable keys, so that I can guide a developer to set up the Server `.env` file correctly without reading secrets.

#### Acceptance Criteria

1. THE Steering_File SHALL list the following required ENV_File keys without values: `PORT`, `DB_URL`, `JWT_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RAZORPAY_API_KEY`, `RAZORPAY_API_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`.
2. THE Steering_File SHALL state the ENV_File path as `Server/.env`.
3. THE Steering_File SHALL include an explicit statement that the ENV_File must be created and fully populated before the Server is started.

---

### Requirement 5: Setup and Run Instructions

**User Story:** As an AI assistant or Developer, I want step-by-step setup instructions, so that I can get both Client and Server running from a fresh clone in under 5 minutes.

#### Acceptance Criteria

1. THE Steering_File SHALL provide the Server setup steps in order: `cd Server` → `npm install` → create `Server/.env` with all 14 required keys → `npm start`.
2. THE Steering_File SHALL provide the Client setup steps in order: `cd Client` → `npm install` → `npm run dev`.
3. THE Steering_File SHALL state that the Server and Client MUST be started in separate terminal sessions simultaneously.
4. THE Steering_File SHALL state that the Client dev server starts on port `5173` and the Server starts on the port defined by the `PORT` env var (default `3000`).
5. WHEN a Developer runs `npm start` in the Server directory, THE Server SHALL start using `node src/app.js` as defined in `package.json`.
6. WHEN a Developer runs `npm run dev` in the Client directory, THE Client SHALL start using the Vite dev server.
7. IF the `Server/.env` file is absent or missing required keys WHEN `npm start` is run, THE Steering_File SHALL warn that the Server will crash or malfunction and the developer must fix `.env` before retrying.

---

### Requirement 6: API Routes Reference

**User Story:** As an AI assistant, I want a complete API route map, so that I can write correct API calls on the Client side without scanning all route files.

#### Acceptance Criteria

1. THE Steering_File SHALL document that all API routes are prefixed with `/api/v1/`.
2. THE Steering_File SHALL list all API_Route_Groups and their base paths: `/api/v1/auth`, `/api/v1/profile`, `/api/v1/request`, `/api/v1/user`, `/api/v1/payment`, `/api/v1/conversation`.
3. THE Steering_File SHALL list the exact endpoints per group:
   - **auth**: `POST /signup`, `POST /login`, `POST /logout` (no auth middleware)
   - **profile**: `GET /view` (userAuth), `POST /edit` (userAuth + multer + validateProfileUpdate), `PATCH /reset-password` (userAuth)
   - **request**: `POST /send/:status/:toUserId` (userAuth), `POST /review/:status/:requestId` (userAuth)
   - **user**: `GET /feed` (userAuth), `GET /request/received` (userAuth), `GET /connection` (userAuth), `DELETE /remove/:dltConnectionId` (userAuth)
   - **payment**: `POST /create` (userAuth), `POST /webhook` (no auth), `GET /verify/premimum` (userAuth)
   - **conversation**: `GET /:userId` (userAuth)
4. THE Steering_File SHALL note that all routes marked `(userAuth)` require a valid JWT_Token in the `token` cookie. `POST /webhook` deliberately has no auth middleware — it uses Razorpay webhook signature validation instead.

---

### Requirement 7: Authentication and Authorization Pattern

**User Story:** As an AI assistant, I want a clear description of the auth flow, so that I can implement or debug authentication correctly.

#### Acceptance Criteria

1. THE Steering_File SHALL document that the Server sets a JWT_Token as an HTTP-only cookie named `token` on successful **login** (not signup). Cookie attributes: httpOnly, secure, sameSite: "none".
2. THE Steering_File SHALL document that the Client sends all requests with `withCredentials: true` (Axios) to include the cookie automatically.
3. THE Steering_File SHALL document that the `userAuth` middleware reads `req.cookies.token`, returns `401 { msg: "No token, auth denied" }` if absent, calls `jwt.verify(token, JWT_KEY)` and attaches the decoded payload to `req.user`, returns `401 { msg: "Invalid or expired token" }` on failure.
4. THE Steering_File SHALL document that `AppLayout.jsx` calls `GET /api/v1/profile/view` on mount (skipped if `user` is already in Redux), dispatches `addUser(res.data)` on success, and navigates to `/auth` on a 401 response.
5. THE Steering_File SHALL document the two client-side route guard components: `ProtectedRoute` (requires auth — redirects to `/auth` if `state.user.user` is null) and `AuthRoute` (redirects to `/profile` if `state.user.user` is not null).

---

### Requirement 8: Redux Store Conventions

**User Story:** As an AI assistant, I want to know the Redux store shape and slice conventions, so that I can write correct selectors and dispatch calls.

#### Acceptance Criteria

1. THE Steering_File SHALL document the Redux_Store shape: `user` → `{ user: null, isUserLoggedIn: false, authMode: "login" }`; `feed` → `{ feed: [] }`; `matches` → `{ matches: null }`; `request` → `{ requests: null }`; `msgUserID` → `{ msgUserID: [] }`.
2. THE Steering_File SHALL list the exported actions per slice: `userSlice` → `addUser`, `removeUser`, `setAuthMode`; `feedSlice` → `addFeed`, `removeFeed`; `connectionSlice` → `getConnection`; `requestSlice` → `getRequest`; `chatNotify` → `addnewUserID`.
3. THE Steering_File SHALL note that the Redux store file is at `Client/src/utils/appStore.js` and all slice files are co-located in `Client/src/utils/`.

---

### Requirement 9: Real-Time (Socket.io) Convention

**User Story:** As an AI assistant, I want to understand how Socket.io is initialized and used, so that I can implement or debug real-time chat features correctly.

#### Acceptance Criteria

1. THE Steering_File SHALL document that Socket.io on the Server is initialized via `initializeSocket(server)` exported from `Server/src/config/socket.js` and called in `src/app.js` with the HTTP server instance. It handles events: `joinChat`, `sendMessage`, `typing`, `stopTyping`, `disconnect`. Room IDs are formed by sorting and joining the two user IDs with `_`.
2. THE Steering_File SHALL document that the Client connects to Socket.io using `SOCKET_URL` (`http://localhost:3000`) defined in `Client/src/utils/constants.js`.
3. THE Steering_File SHALL document that the client-side socket is created via `createSocketConnection()` from `Client/src/utils/socket.js` (not a singleton — callers create and manage their own instance).

---

### Requirement 10: Coding Conventions

**User Story:** As an AI assistant, I want a summary of the project's coding conventions, so that I can generate code that is consistent with the existing codebase.

#### Acceptance Criteria

1. THE Steering_File SHALL document that all Server modules use CommonJS (`require`/`module.exports`) syntax.
2. THE Steering_File SHALL document that all Client modules use ES Module (`import`/`export`) syntax with `.jsx` extension for React components.
3. THE Steering_File SHALL document that all Client pages are loaded via `React.lazy()` + `<Suspense>` in `App.jsx` for code splitting.
4. THE Steering_File SHALL document that styling uses TailwindCSS utility classes; DaisyUI is NOT installed. Custom CSS is minimal and limited to `App.css` and `index.css`.
5. THE Steering_File SHALL document that form/request body validation on the Server uses the Zod library.
6. THE Steering_File SHALL document that password hashing uses `bcrypt` and JWT signing uses `jsonwebtoken` with the `JWT_KEY` env variable.
7. THE Steering_File SHALL document the base layout convention: `AppLayout.jsx` wraps every route with `bg-slate-900 text-slate-100 min-h-screen`.

---

### Requirement 11: Common Development Tasks

**User Story:** As an AI assistant, I want a quick reference for the most common development tasks, so that I can execute them immediately without exploration.

#### Acceptance Criteria

1. THE Steering_File SHALL document how to add a new API endpoint: create a controller function in `Server/src/controller/`, add a route in the relevant `Server/src/routes/v1/` file, apply `userAuth` middleware if the route is protected.
2. THE Steering_File SHALL document how to add a new client page: create a `.jsx` file in `Client/src/Pages/`, add a `React.lazy` import in `App.jsx`, register the route in the `createBrowserRouter` config inside `App.jsx`, wrap with `ProtectedRoute` or `AuthRoute` as appropriate.
3. THE Steering_File SHALL document how to add a new Redux slice: create a slice file in `Client/src/utils/`, export the reducer as default and named actions, import and register the reducer in `appStore.js` under a new key.
4. THE Steering_File SHALL document how to add a new Mongoose model: create a schema file in `Server/src/models/`, export the model with `mongoose.model('ModelName', schema)`.

---

### Requirement 12: Steering File Format and Placement

**User Story:** As an AI assistant, I want the steering file to be placed in the correct location and formatted for minimal token usage, so that it loads efficiently on every interaction.

#### Acceptance Criteria

1. THE Steering_File SHALL be placed at `DevTinder/.kiro/steering/devtinder-project-steering.md`.
2. THE Steering_File SHALL use markdown `##` headers to separate sections for fast scanning.
3. THE Steering_File SHALL use bullet lists and inline code rather than prose paragraphs to minimize token count.
4. THE Steering_File SHALL not exceed 600 lines to remain within efficient context-loading limits.
5. THE Steering_File SHALL include a YAML frontmatter block with `inclusion: always` so that Kiro loads it automatically on every interaction.
