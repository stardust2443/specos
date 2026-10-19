# Architecture Decision Record (ADR-001)

## Title: Local-First Client Architecture with Structured Agent Streaming
**Status:** Accepted  
**Date:** 2026-10-19  
**Decision Maker:** Arun Mitra Kommireddy (Solo AI PM / Technical Lead)  

---

## 1. Context & Problem Statement
SpecOS requires sub-50ms user interactions, seamless keyboard-driven workflows, zero-friction visitor onboarding (instant demo access without account creation or credit card walls), and resilient persistence.

When architecting an AI-native product workspace, the conventional paradigm is a multi-tier cloud stack:
`Client (Next.js) -> Server API Route -> Cloud Database (PostgreSQL / Supabase) -> LLM API -> Database Write -> Client Poll/SSE`.

This architecture introduces significant latency ($>300\text{ms}$ network roundtrips), hosting overhead, database connection pooling limits, and strict user authentication barriers that degrade recruiter and visitor conversion.

---

## 2. Considered Options

### Option 1: Full-Stack Cloud Architecture (Next.js + Supabase / PostgreSQL + Prisma)
* **Pros:** Traditional relational consistency; multi-user collaboration out of the box.
* **Cons:** High infrastructure cost; authentication required upfront; $>300\text{ms}$ mutation latency; vendor lock-in.

### Option 2: Heavyweight Desktop Architecture (Electron + Local SQLite + Python Backend)
* **Pros:** Deep OS integration; full local file system access.
* **Cons:** High binary download size (>120MB); cross-platform signing hurdles; cannot be shared via a quick clickable web link in cold emails.

### Option 3: Local-First Web Architecture (React + Vite + Zustand + LocalStorage/IndexedDB + Direct Streaming Client) — *[SELECTED]*
* **Pros:**
  1. Instant page load ($<1\text{s}$) deployed globally on edge CDN.
  2. 0ms state mutation latency.
  3. Zero backend server costs; 100% resilient against server downtime.
  4. Instant zero-login demo testing for hiring managers and founders.
  5. Clean separation between UI state machine and AI inference.
* **Cons:** Cross-device sync requires manual export/import in v1 (acceptable for P0 scope).

---

## 3. Decision Outcome
We have chosen **Option 3: Local-First Web Architecture** utilizing:
* **UI & Rendering:** React 19 + Vite + Tailwind CSS for maximum build speed and instant HMR.
* **State Machine:** Zustand with persistence middleware mapped to `localStorage` / `IndexedDB`.
* **Inference Pipeline:** Streaming client orchestrator supporting direct Gemini 2.5 Flash API calls with typed JSON schema enforcement, alongside bundled, pre-computed demo presets for instant evaluation.

---

## 4. Consequences & Tradeoffs

### Positive Consequences
* **Recruiter Conversion Velocity:** A founder or recruiter clicking the project link sees a fully rendered, interactive workspace within 800ms without being blocked by a sign-up modal.
* **Cost Efficiency:** Running costs are practically \$0/month, allowing the project to stay live indefinitely.
* **Reliability:** No database migrations to fail; no backend connection timeouts.

### Negative Consequences & Mitigation
* *Limitation:* State is isolated to the user's browser session.
* *Mitigation:* Provide 1-click "Export JSON / Markdown" and "Import Spec" so users can effortlessly persist, share, or commit their specs to Git repositories.
