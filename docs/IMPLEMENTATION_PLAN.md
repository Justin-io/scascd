# AFTERLIGHT — Master Implementation Plan & Progress Ledger

## 1. Prioritized Implementation Backlog
1. **Phase 00 — Repository Reconnaissance**: Complete architectural audit, dependency graph, and risk register.
2. **Phase 01 — Application Foundation**: Full-stack Express + Vite + TypeScript architecture, structured logging, health checks (`/api/health`), and global error boundaries.
3. **Phase 02 — Three.js Solar System Engine**: Heliocentric interactive 3D engine (Sun, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune), GLSL atmospheric Fresnel shaders, orbital paths, and adaptive `isSoftwareGl` rendering.
4. **Phase 03 — Moon & Mars Planetary Environments**: Dedicated 3D Lunar Globe (LROC WAC/NAC coordinate system, crater relief, Apollo/Surveyor/Lunokhod markers & traverses) and 3D Mars Globe (MOLA elevation shading, rover traverse paths, landing & final documented sites).
5. **Phase 04 — Planetary Archaeology & Artifact System**: Multi-coordinate tracking (`landing`, `finalOperating`, `finalDocumented`, `currentEstimated`, `impact`), operational status taxonomy, and 3D Studio PBR Composite Spacecraft Inspector (3–12 part procedural `THREE.Group` models).
6. **Phase 05 — Scientific Data Engine**: Normalized entities (`artifacts`, `missions`, `instruments`, `discoveries`, `locations`, `media_assets`, `sources`, `claims`, `mission_events`, `artifact_relationships`), ingestion connectors (NASA PDS, NSSDC, LROC, MER, NAIF SPICE, JPL Horizons), and automated validation pipeline.
7. **Phase 06 — FFmpeg Media Intelligence Pipeline**: Controlled backend subprocess service (`ffmpeg` / `ffprobe` via `execFile` argument arrays), metadata probing, thumbnail extraction, contact sheet generation, H.264 MP4 transcoding, and audio normalization.
8. **Phase 07 — Immersive Storytelling Engine**: 6-Chapter structured narrative per artifact, First-Person narrative toggle, inline `[CLAIM-ID]` citation synchronization, Simple Language mode, font scaling, and Web Speech/Audio synthesis.
9. **Phase 08 — Mission Timeline & Scientific Legacy Graph**: Chronological event scrubber with multi-dimensional filtering and interactive SVG causal graph (`Mission → Artifact → Instrument → Observation → Discovery → Later Mission`).
10. **Phase 09 — Search & Discovery Engine**: Full-text and multi-faceted filter engine with sorting, pagination, related artifacts, and persistent Field Expedition List.
11. **Phase 10 — Educational Experience**: 3-tier difficulty Space Archaeology Academy (Beginner, Intermediate, Advanced) with Artifact Identification, Instrument Matching, and Timeline Reconstruction challenges.
12. **Phase 11 & 12 — Quality Audit, Testing & Delivery**: Node unit tests (`node:test`), Playwright browser verification (`playwright-cli`), and comprehensive engineering reports.
