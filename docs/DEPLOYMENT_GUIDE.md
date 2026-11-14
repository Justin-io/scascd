# AFTERLIGHT — Deployment & Operations Guide

## 1. Local & Container Execution

### Prerequisites
- Node.js 22+
- Optional system binaries: `ffmpeg` and `ffprobe` (pipeline automatically detects binary presence via `/api/health` and falls back to deterministic archival stream inspection when running in minimal containers).

### Commands
```bash
# Install dependencies
npm install

# Run pure-logic & dataset provenance unit tests
npx --yes tsx --test src/utils/scientificEngine.test.ts

# Start full-stack Express + Vite server on port 3000
npm run dev

# Build production client bundle and typecheck
npm run build
npm run lint
```

## 2. Environment Variables (`.env.example`)
- `PORT=3000` — HTTP port bound by `server.ts`.
- `APP_URL` — Public service URL injected at runtime.
- `GEMINI_API_KEY` — Reserved for server-side environment compatibility (not exposed in client UI).
