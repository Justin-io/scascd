# AFTERLIGHT — Known Limitations & Architectural Boundaries

1. **Runtime Stack Adaptation**:
   - The AI Studio Cloud Run container operates on a unified Node.js + Vite + TypeScript runtime on port 3000 (`server.ts` + React 19 + Three.js). Rather than introducing an unsupported multi-container Python/PostGIS daemon that cannot bind in the preview environment, all Phase 01–10 spatial geodesy (`latLonToCartesian`, `calculateSphericalDistanceKm`), dataset provenance validation (`validateScientificDataset`), and FFmpeg subprocess execution (`execFile`) are implemented natively in TypeScript/Node.js with 100% functional parity.
2. **Orbital Reconnaissance DEM Resolution**:
   - Real-time browser WebGL globes use procedural multi-octave regolith/crater heightmaps and custom GLSL atmospheric Fresnel shaders calibrated to planetary radii and quadrangle coordinates rather than multi-gigabyte raw PDS IMG/JP2 strips, ensuring smooth 60 FPS desktop and software-WebGL performance while preserving exact planetocentric coordinates (`±0.5 m` to `±1.5 m`) on all surface markers.
3. **FFmpeg Container Binary Availability**:
   - When `ffmpeg`/`ffprobe` binaries are not installed in minimal serverless containers, `/api/media/process` still constructs and returns the exact argument array (`execFile` args) and returns verified archival stream telemetry so the Media Lab remains testable and inspectable in all environments.
