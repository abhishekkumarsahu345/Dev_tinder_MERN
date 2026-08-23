# Implementation Tasks

## Task List

- [ ] 1. Create the steering file with frontmatter and all sections
  - Create `DevTinder/.kiro/steering/devtinder-project-steering.md`
  - Add YAML frontmatter: `inclusion: always`
  - Add `## Project Overview` section (R1): one-sentence description covering matchmaking/swipe/chat/premium, monorepo layout, dev URLs
  - Add `## Tech Stack` section (R2): Client deps bullet list, Server deps bullet list, module system notes
  - Add `## Project Structure` section (R3): annotated Client src tree, annotated Server src tree, utils file purposes, config file purposes
  - Add `## Environment Variables` section (R4): mandatory prerequisite warning + all 14 env key names
  - Add `## Setup & Run` section (R5): numbered Server steps, numbered Client steps, parallel-terminals note, .env crash warning
  - Add `## API Routes` section (R6): all 16 endpoints in a table with method, path, and auth middleware column
  - Add `## Auth Flow` section (R7): 6-step ordered list covering login cookie, withCredentials, userAuth middleware, AppLayout fetch, ProtectedRoute, AuthRoute
  - Add `## Redux Store` section (R8): store-key/initial-state/actions table for all 5 slices
  - Add `## Socket.io` section (R9): server init, room ID formula, events list, client connect pattern
  - Add `## Coding Conventions` section (R10): CommonJS vs ESM, lazy loading, Tailwind-only (no DaisyUI), Zod, bcrypt/JWT, theme class
  - Add `## Common Tasks` section (R11): 4 recipes — new endpoint, new page, new slice, new model
  - Verify the file does not exceed 600 lines
  - **Acceptance:** File exists at correct path, frontmatter present, all 11 `##` sections present, line count ≤ 600
