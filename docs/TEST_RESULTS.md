# AFTERLIGHT — Verification & Test Results

## 1. Unit Test Suite (`node:test` — `src/utils/scientificEngine.test.ts`)

Command: `npx --yes tsx --test src/utils/scientificEngine.test.ts`

| Test Case | Status | Duration |
| :--- | :--- | :--- |
| 1. Coordinate conversion round-trips accurately for Apollo 11 Tranquillity Base | `PASS` | `1.67 ms` |
| 2. Spherical Haversine distance accurately calculates lunar and Martian surface separation | `PASS` | `0.28 ms` |
| 3. Phase 05 scientific validation pipeline passes 100% of production NASA records with zero errors | `PASS` | `1.64 ms` |
| 4. Phase 09 search and filter engine filters by body, category, status, and full-text query | `PASS` | `10.48 ms` |
| 5. Phase 06 FFmpeg command builder produces safe argument arrays and blocks path traversal | `PASS` | `2.83 ms` |
| 6. Phase 10 educational assessment evaluator scores submissions and returns claim-backed explanations | `PASS` | `0.41 ms` |

**Summary**: `6 passed, 0 failed` (`541.9 ms` total execution time).

## 2. Backend API & Subprocess Pipeline Verification

- `GET /api/health` — `200 OK` (`{"status":"ok","platform":"AFTERLIGHT Planetary Archaeology Engine","scientificValidationPass":true,"artifactCount":12,"claimCount":14}`)
- `GET /api/scientific/provenance` — `200 OK` (100% claim/source integrity verified)
- `POST /api/media/process` — `200 OK` (`ffprobe_inspect`, `extract_thumbnail`, `generate_contact_sheet`, `transcode_h264`, `normalize_audio` verified with safe argument-array subprocess isolation)

## 3. Real-Browser WebGL & UI Verification (`playwright-cli`)

- **Console & Page Errors**: `0 errors` across all viewports and interactive journeys.
- **3D Scene Modes Verified**:
  - `solar_system` — Interactive 3D heliocentric system with Sun, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, custom GLSL Fresnel atmospheric shaders, orbital paths, and instanced asteroid belt.
  - `moon_globe` — LROC WAC/NAC lunar globe with latitude/longitude graticule and composite 3D spacecraft models on the surface.
  - `mars_globe` — MGS MOLA / HiRISE Martian globe with rover traverse polylines and multi-coordinate landing/final operating pins.
  - `hardware_inspector` — Studio PBR 3D spacecraft stage with interactive Exploded-View Assembly slider (`0%` to `100%`).
- **Workspaces Verified**:
  - Archaeological Dossier & 6-Chapter Storytelling Engine (Verified Archival Record vs. First-Person Creative Voice, synchronized `[CLAIM-ID]` Evidence Inspector).
  - Unified Search & Discovery Catalog, Chronological Timeline & 6-Stage Scientific Legacy Graph, FFmpeg Media Lab, Educational Academy, and Scientific Data Provenance Console.
- **Responsive Viewports Verified**: Desktop (`1440×900`) and Mobile (`390×844`).
