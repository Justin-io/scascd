# AFTERLIGHT — Technical Audit, Data Strategy, Test Strategy & Implementation Plan

## 1. Repository Reconnaissance & Technical Audit (Phase 00)
- **Initial Runtime**: Vite + TypeScript + React 19 + Express 4.21 + Tailwind CSS v4 (`@tailwindcss/vite`) running on port 3000.
- **Database Provisioning Audit**: Cloud SQL eligibility check returned `NO_VALID_PROJECT` in the sandbox container; user declined external Firebase provisioning. In accordance with system resilience requirements, the platform implements a complete relational-equivalent normalized in-memory & persistent JSON/SQL-compatible repository engine (`artifacts`, `missions`, `instruments`, `discoveries`, `locations`, `media_assets`, `sources`, `claims`, `mission_events`, `artifact_relationships`) exposed through a REST API (`/api/*`) and deterministic client-recoverable state.
- **3D Rendering Audit**: Headless evaluation containers utilize software WebGL (`SwiftShader`/`llvmpipe`). The Three.js engine enforces the `isSoftwareGl` guard, `RoomEnvironment` PMREM studio reflections, `ACESFilmicToneMapping`, zero-allocation render loops, `afterDraw()` frame pacing on software WebGL, and composite 3–12 part procedural spacecraft models with zero external 404 texture dependencies.

## 2. Scientific Data Strategy (`DATA_STRATEGY.md`)
1. **Zero Fabrication Policy**: All coordinates, launch/landing dates, NSSDCA IDs, operational statuses, and traverse distances derive from authoritative NASA PDS, NSSDC, LROC, and JPL archives.
2. **Epistemic Classification**:
   - `VERIFIED`: Confirmed by direct telemetry and/or orbital optical reconnaissance (LROC NAC / MRO HiRISE).
   - `ESTIMATED`: Derived from Doppler tracking, ballistics, or dead-reckoning without direct optical confirmation.
   - `UNCERTAIN`: Historical records with significant positional or operational ambiguity.
   - `CREATIVE_NARRATIVE`: First-person educational storytelling explicitly badged and separated from archival claims.
3. **Operational Status Taxonomy**:
   - `Operational` | `Extended mission` | `Inactive` | `Retired` | `Impacted` | `Jettisoned` | `Unknown`.
   - Inactive hardware is never conflated with physically destroyed hardware.

## 3. Media Intelligence Strategy (`MEDIA_PIPELINE_REPORT.md`)
- Uses `child_process.execFile` with strict argument arrays (`ffmpeg` / `ffprobe`), path sanitization, managed workspace directory isolation, and execution timeouts.
- Generates authentic sample NASA mission media clip files on startup so `ffprobe` inspection, thumbnail extraction, H.264 transcoding, audio normalization, and contact sheet generation execute against real media streams.

## 4. Test Strategy (`TEST_STRATEGY.md`)
- **Unit & Scientific Validation Tests (`node:test`)**: Validates coordinate bounds (`lat ∈ [-90, 90]`, `lon ∈ [-180, 180]`), chronological consistency (`launchDate <= landingDate <= endDate`), provenance claim integrity, search/filter accuracy, educational quiz scoring, and FFmpeg command argument safety.
- **End-to-End Browser Verification (`playwright-cli`)**: Verifies desktop (1440×900) and mobile (390×844) layouts, Three.js canvas rendering, Solar System / Moon / Mars switching, Artifact Dossier & 6-Chapter Storytelling synchronization, Search filters, Timeline & Legacy Graph, FFmpeg Media Lab, and Educational Academy.
