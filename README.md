# AFTERLIGHT — Planetary Archaeology & Deep Space Heritage Platform

**NASA Space Apps Challenge 2026 Engineering Submission**

AFTERLIGHT is an interactive 3D planetary archaeology, scientific provenance, and mission storytelling platform that maps and contextualizes humanity's physical spacecraft heritage across the Moon, Mars, Saturn/Titan, and the Heliocentric frontier.

## Core Capabilities
1. **Three.js 3D Spatial Engine**:
   - **Solar System View**: Heliocentric scene with the Sun, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, custom GLSL atmospheric Fresnel shaders, orbital paths, and instanced asteroid belt.
   - **Lunar Reconnaissance Globe (`Moon Globe`)**: 3D Lunar globe with LROC WAC/NAC coordinate graticule, maria/crater topography, rover traverse paths (*Lunokhod 2* 39.1 km, *Apollo 15 LRV-1* 27.76 km), and composite 3D spacecraft markers.
   - **Martian MOLA Elevation Globe (`Mars Globe`)**: 3D Martian globe with MOLA regional dichotomy, *Opportunity* (45.16 km) and *Perseverance* (31.8 km) rover traverse polylines, and landing/final documented markers.
   - **Studio PBR 3D Hardware Inspector (`3D Hardware`)**: Multi-part procedural 3D spacecraft models (Lander, Rover, Interstellar Probe) with real-time damped Exploded-View Assembly inspection (`0%–100%`).
2. **Planetary Archaeology & Epistemic Provenance**:
   - Separate coordinate tracking for `Landing Location`, `Final Operating Location`, `Final Documented Location`, and `Impact Location` with explicit uncertainty radii (`±m`) and `VERIFIED` vs. `ESTIMATED` status.
3. **6-Chapter Immersive Storytelling Engine**:
   - Structured 6-chapter narratives per artifact with synchronized `[CLAIM-ID]` citations, Archival vs. First-Person Creative Narrative toggle, Simple Language mode, font scaling, and Web Speech audio narration.
4. **Chronological Mission Timeline & Scientific Legacy Graph**:
   - Interactive causal chain (`Mission → Artifact → Instrument → Observation → Discovery → Later Mission`) backed by archival citations.
5. **FFmpeg & FFprobe Media Intelligence Lab**:
   - Controlled backend subprocess media inspection (`ffprobe`), thumbnail extraction, 2×2 contact sheet generation, H.264 transcoding, and EBU R128 audio normalization.
6. **Space Archaeology Educational Academy**:
   - Beginner, Intermediate, and Advanced challenges with automated grading and claim-linked explanations.

## Development & Verification Commands
```bash
# Run deterministic unit & scientific validation tests
npx --yes tsx --test src/utils/scientificEngine.test.ts

# Start full-stack development server on port 3000
npm run dev

# Type-check and build production bundle
npm run lint
npm run build
```
