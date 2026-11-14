# AFTERLIGHT — System Architecture & Engineering Specification

## 1. Executive Summary
**AFTERLIGHT** is a full-stack planetary archaeology, scientific provenance, and interactive 3D storytelling platform built for the NASA Space Apps Challenge 2026. It preserves, maps, and contextualizes humanity's physical heritage across the Solar System—from the Apollo, Surveyor, and Lunokhod hardware on the Lunar regolith to the Viking, Pathfinder, Spirit, Opportunity, Curiosity, Perseverance, and Ingenuity artifacts on Mars, and the deep-space heliocentric pioneers (Voyager 1, Cassini-Huygens).

## 2. Runtime & Architectural Topology

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        CLIENT PRESENTATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Three.js WebGL Spatial Engine (Full-Bleed 100vw x 100vh)             │  │
│  │  • Solar System Heliocentric Scene (Sun + 8 Worlds + Asteroid Belt)  │  │
│  │  • Lunar Reconnaissance Globe (LROC WAC/NAC + Crater Relief + Sites) │  │
│  │  • Martian MOLA Elevation Globe (Rover Traverses + Landing Sites)    │  │
│  │  • Studio PBR Hardware Inspector (Composite 3–12 Part Spacecraft)    │  │
│  │  • Custom GLSL Atmosphere & Fresnel Rim Shaders + RoomEnvironment    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Semantic Scientific Overlays & Workspaces                            │  │
│  │  • Top Bar Contract (Brand Wordmark · 5 Workspace Links · Action)    │  │
│  │  • Collapsible Bottom Control Dock (Cinema/Zen Mode, Camera, Layers) │  │
│  │  • Artifact Dossier & 6-Chapter Storytelling Engine (Claim Sync)     │  │
│  │  • Chronological Mission Timeline & Scientific Legacy Graph          │  │
│  │  • Unified Full-Text & Multi-Faceted Search & Expedition Catalog     │  │
│  │  • FFmpeg Media Intelligence Lab & Educational Space Academy         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────┬────────────────────────────────────┘
                                        │ REST / JSON API (/api/*)
┌───────────────────────────────────────▼────────────────────────────────────┐
│                    SERVER & SCIENTIFIC PIPELINE LAYER                      │
│  • Express / Node.js Full-Stack Server (Port 3000 + Vite Middleware)       │
│  • Scientific Data Ingestion & Normalization Connectors:                   │
│      - NASA Planetary Data System (PDS)                                    │
│      - NSSDC Master Catalog (NSSDCA ID validation)                         │
│      - LROC / NASA Human Artifacts on the Moon                             │
│      - Mars Exploration Rover (MER) & MSL/Mars 2020 Traverse Archives      │
│      - NAIF SPICE Ephemeris & JPL Horizons Reference Frames                │
│      - NASA Image and Video Library Connector                              │
│  • Scientific Provenance & Claim Validation Engine                         │
│  • Controlled FFmpeg / FFprobe Subprocess Media Processing Service         │
└────────────────────────────────────────────────────────────────────────────┘
```

## 3. Coordinate Reference Systems & Epistemic Rigor
All spatial records strictly separate:
1. `landingLocation`: Documented touchdown or initial contact coordinates.
2. `finalOperatingLocation`: Last active telemetry transmission coordinates.
3. `finalDocumentedLocation`: Optically verified coordinates from orbital imagery (e.g., LROC NAC, HiRISE).
4. `currentEstimatedLocation`: Ephemeris or dead-reckoning estimate where direct optical imaging is unavailable.
5. `impactLocation`: Terminal impact site for jettisoned stages, orbiters, or impactors.

Every coordinate record includes explicit datum/reference frame (`IAU Moon 2000 Mean Earth/Polar Axis`, `IAU Mars 2000 Aerocentric`, `J2000 Heliocentric Ecliptic`), horizontal uncertainty in meters, and authoritative citation (`Claim ID`).
