# AFTERLIGHT — Verification & Test Strategy

## 1. Multi-Tier Verification Architecture

AFTERLIGHT uses a three-tier verification strategy combining pure-function unit testing, API/pipeline verification, and real-browser WebGL inspection:

### Tier 1: Fast-Feedback Pure Logic Unit Tests (`node:test`)
Located in `src/utils/scientificEngine.test.ts` and executed via `npx --yes tsx --test src/utils/scientificEngine.test.ts`:
- **Spherical & Planetocentric Coordinate Math**: Verifies `latLonToCartesian` and `cartesianToLatLon` round-trip accuracy within `1e-4` degrees across lunar and Martian quadrangles, plus Haversine great-circle traverse distance (`calculateSphericalDistanceKm`).
- **Phase 05 Dataset Integrity Validator**: Executes `validateScientificDataset()` across all 10 artifacts, 14 claims, 9 primary sources, and 6-chapter narratives to guarantee zero out-of-range coordinates, zero orphan `sourceIds`, and 100% provenance traceability.
- **Phase 06 Subprocess Security**: Verifies `buildSafeFfmpegArgs()` produces strict argument arrays without shell interpolation and rejects malicious path traversal (`../`, `;`, `|`).
- **Phase 09 Catalog Search & Filter**: Tests full-text query matching, celestial body filtering, operational status filtering, and deterministic sorting.
- **Phase 10 Educational Assessment Grading**: Tests `evaluateEducationalSubmission()` score calculation and claim citation mapping.

### Tier 2: Backend API & Media Pipeline Verification
- `/api/health` — Confirms service readiness, active dataset counts, and FFmpeg/FFprobe binary availability.
- `/api/scientific/provenance` — Returns real-time validation reports for all loaded NASA PDS/NSSDC/LROC/HiRISE entities.
- `/api/media/process` — Executes safe argument-array `ffprobe` / `ffmpeg` tasks (`ffprobe_inspect`, `extract_thumbnail`, `generate_contact_sheet`, `transcode_h264`, `normalize_audio`) with deterministic telemetry fallback when container media binaries are restricted.

### Tier 3: Real-Browser WebGL & Interactive Journey Verification (`playwright-cli`)
- **Viewport & Layout Checks**: Verified at `1440x900` (desktop) and `390x844` (mobile) with zero console errors, zero uncaught page errors, and >=80% unobstructed 3D WebGL viewport allocation.
- **Interactive Journeys**:
  - **Journey 1 (3D Solar System & Planetary Globes)**: Switch between Solar System, Lunar Globe (LROC), Mars Globe (MOLA/HiRISE), and 3D Hardware Inspector; adjust Exploded-View slider (`0%` to `100%`).
  - **Journey 2 (Archaeological Dossier & 6-Chapter Storytelling)**: Open artifact dossier, switch to 6-Chapter Narrative, toggle Verified Archival Record vs. First-Person Creative Narrative, and click `[CLAIM-ID]` badges to inspect primary NASA sources.
  - **Journey 3 (Catalog, Timeline/Graph, Media Lab, Academy)**: Search/filter artifacts, trace the 6-stage Scientific Legacy Graph, run an FFmpeg/FFprobe pipeline task, and grade an Educational Academy challenge.
