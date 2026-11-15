---
marp: true
theme: default
paginate: true
header: "AFTERLIGHT — Planetary Archaeology & Deep Space Heritage"
footer: "NASA Space Apps Challenge 2026 · Confidential & Scientific Briefing"
style: |
  section {
    background-color: #07090e;
    color: #e2e8f0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    padding: 40px 60px;
  }
  h1 {
    color: #38bdf8;
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 0.4rem;
  }
  h2 {
    color: #fbbf24;
    font-size: 1.5rem;
    font-weight: 700;
    border-bottom: 2px solid rgba(251, 191, 36, 0.3);
    padding-bottom: 0.3rem;
    margin-bottom: 1rem;
  }
  h3 {
    color: #38bdf8;
    font-size: 1.15rem;
  }
  p, li {
    font-size: 1.0rem;
    line-height: 1.55;
    color: #cbd5e1;
  }
  strong {
    color: #f8fafc;
  }
  code {
    background-color: #1e293b;
    color: #38bdf8;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
  }
  .highlight-box {
    background: rgba(30, 41, 59, 0.7);
    border-left: 4px solid #38bdf8;
    padding: 12px 18px;
    border-radius: 0 8px 8px 0;
    margin: 12px 0;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .tag {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-right: 6px;
  }
  .tag-cyan { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
  .tag-amber { background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3); }
  .tag-emerald { background: rgba(52, 211, 153, 0.15); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.3); }
---

<!-- SLIDE 1: TITLE SLIDE -->
# AFTERLIGHT
## Planetary Archaeology, Deep Space Heritage & 3D Spatial Storytelling

<div class="highlight-box">
  <strong>Preserving Humanity's Footprints Across the Solar System</strong><br>
  An interactive 3D WebGL engine, scientific provenance catalog, 14-chapter mission choreographic suite, and physically grounded space acoustic simulator.
</div>

<div class="grid-2" style="margin-top: 30px;">
  <div>
    <span class="tag tag-cyan">NASA PDS & LROC</span>
    <span class="tag tag-amber">Three.js WebGL</span>
    <span class="tag tag-emerald">React 19 & Vite</span>
    <p style="margin-top: 15px; font-size: 0.95rem;">
      <strong>Author:</strong> AFTERLIGHT Engineering Team<br>
      <strong>Platform:</strong> WebGL 2.0 / Web Audio API / Node.js<br>
      <strong>Date:</strong> 2026 Edition
    </p>
  </div>
  <div style="background: rgba(15, 23, 42, 0.8); padding: 16px; border-radius: 8px; border: 1px solid #334155;">
    <p style="font-size: 0.85rem; margin: 0; font-family: monospace; color: #94a3b8;">
      MISSION STATUS: <span style="color: #34d399;">OPERATIONAL</span><br>
      WORLDS MAPPED: 22 Natural Satellites + Moon + Mars<br>
      HERITAGE SITES: 12 Historical Artifacts<br>
      AUDIO ENGINE: 48 kHz Physically Grounded Space Acoustics<br>
      VALIDATION: 10/10 Automated Tests Passing
    </p>
  </div>
</div>

<!-- Speaker Notes:
Welcome to the official presentation of AFTERLIGHT. This platform bridges aerospace engineering, historical planetary archaeology, and interactive real-time 3D spatial simulation to preserve and narrate humanity's robotic and crewed exploration heritage across celestial worlds.
-->

---

<!-- SLIDE 2: THE PROBLEM STATEMENT -->
# The Problem & Scientific Need
## The Peril of Vanishing Interplanetary Heritage

<div class="grid-2">
  <div>
    <h3>1. Degradation of Space Artifacts</h3>
    <p>Over 70 humanity-crafted landers, rovers, and probes reside on celestial bodies. Without atmosphere on the Moon or under micrometeorite bombardment and dust storms on Mars, physical sites face micro-erosion, solar UV degradation, and thermal stress.</p>

    <h3>2. Fragmented Historical Provenance</h3>
    <p>Coordinates, telemetry, mission reports, and scientific claims are scattered across disparate NASA PDS volumes, Soviet archival releases, and academic papers with conflicting coordinates.</p>
  </div>
  <div>
    <h3>3. Static Public Engagement</h3>
    <p>Conventional space museum archives present 2D photos or disconnected Wikipedia tables. Public audiences lack spatial intuition for distances, orbital trajectories, landing dynamics, and the physical environment.</p>

    <div class="highlight-box" style="border-left-color: #fbbf24;">
      <strong>The AFTERLIGHT Imperative:</strong>
      Deliver an authoritative, mathematically verified 3D digital twin of humanity's lunar and Martian heritage with exact coordinates, authentic telemetry, and multi-chapter cinematic storytelling.
    </div>
  </div>
</div>

<!-- Speaker Notes:
Why does AFTERLIGHT exist? Right now, humanity is returning to the Moon with Artemis and preparing for Mars. As commercial and international space exploration expands, protecting historic landing sites like Tranquillity Base or Jezero Crater becomes critical. We need an authoritative, visually engaging, and scientifically rigorous archive.
-->

---

<!-- SLIDE 3: EXECUTIVE SOLUTION OVERVIEW -->
# Executive Solution Overview
## A Unified Epistemic 3D Simulation Engine

```
+-----------------------------------------------------------------------------------+
|                                 AFTERLIGHT PLATFORM                               |
+-----------------------------------------------------------------------------------+
|  1. 3D Spatial Canvas      |  2. Planetary Archaeology   |  3. Story Cinema Rig   |
|  - Heliocentric Solar Sys  |  - Verified Coordinates     |  - 14 Synchronized Chs |
|  - LROC 3D Moon Globe      |  - Positional Uncertainty   |  - 70 Micro-Beats      |
|  - MOLA 3D Mars Globe      |  - 12 Heritage Artifacts    |  - Live Aerodynamics   |
|  - 22 Natural Satellites   |  - Causal Legacy Graph      |  - Archival Timing     |
+----------------------------+-----------------------------+------------------------+
|  4. Space Acoustic Suite   |  5. 3D Hardware Inspector   |  6. Educational Lab    |
|  - 48 kHz Master Sound     |  - Exploded-View Assembly   |  - Automated Grading   |
|  - Deep Space Cruise Audio |  - PBR Aerospace Shaders    |  - Claim Verification  |
|  - 24s Soft Thrusters      |  - Subsystem Disassembly    |  - FFmpeg Media Lab    |
+-----------------------------------------------------------------------------------+
```

- **Scientific Grounding**: Ground-truth coordinates from NASA Planetary Data System (PDS) and LROC.
- **Extreme Fidelity**: Custom GLSL shaders for Fresnel atmosphere, Kapton gold foil, and lunar regolith.
- **Accessible Narratives**: NASA Facts, Creative Creative Voice, and Simple Language modes.

<!-- Speaker Notes:
AFTERLIGHT delivers six interconnected pillars: a multi-mode 3D spatial engine, an authoritative archaeological catalog, a 14-chapter choreographic story rig, a physical space acoustic engine, a 3D hardware inspector with exploded views, and an interactive educational academy.
-->

---

<!-- SLIDE 4: SYSTEM ARCHITECTURE & TECH STACK -->
# High-Level Architecture & Tech Stack
## Hardened Full-Stack Reactive Architecture

<div class="grid-2">
  <div>
    <h3>Frontend Stack</h3>
    <ul>
      <li><strong>React 19 & TypeScript (Strict Mode)</strong>: Component lifecycle, state management, and strict domain schemas.</li>
      <li><strong>Three.js (r187) & WebGL 2.0</strong>: Scene graphs, dual-mode astronomy scales, dynamic lighting, and custom shaders.</li>
      <li><strong>Tailwind CSS v4 & Lucide Icons</strong>: Aerospace telemetry aesthetic, HUD reticles, and responsive docking panes.</li>
      <li><strong>Web Audio API</strong>: Low-latency sample scheduling, parametric synthesis fallbacks, and rate-limiting busses.</li>
    </ul>
  </div>
  <div>
    <h3>Backend & Security Stack</h3>
    <ul>
      <li><strong>Node.js & Express 4</strong>: Hardened REST API gateway and high-performance static asset streaming.</li>
      <li><strong>OWASP Defense in Depth</strong>: Strict Content Security Policy (CSP), anti-clickjacking headers, and CORS restrictions.</li>
      <li><strong>FFmpeg / FFprobe Media Worker</strong>: Sandboxed subprocess media analysis with path-traversal prevention.</li>
      <li><strong>Automated Test Harness</strong>: Built-in <code>node:test</code> runner validating 100% of scientific records.</li>
    </ul>
  </div>
</div>

<!-- Speaker Notes:
Our tech stack is modern and hardened. Built on React 19 and Three.js with strict TypeScript types. The backend runs Express with OWASP-compliant security headers and a sandboxed media processing pipeline.
-->

---

<!-- SLIDE 5: 3D CELESTIAL SPATIAL ENGINE -->
# The 3D Celestial Spatial Engine
## Multi-Viewport Planetary Exploration

<div class="grid-2">
  <div>
    <h3>1. Heliocentric Solar System</h3>
    <ul>
      <li>8 Planets + Sun with accurate orbital semi-major axes and Keplerian eccentricities.</li>
      <li>GLSL Fresnel atmospheric rim lighting and instanced 1,200-body asteroid belt.</li>
      <li>Interactive orbit lines, gravitational well depth shaders, and speed scaling.</li>
    </ul>

    <h3>2. High-Resolution Lunar Globe (LROC)</h3>
    <ul>
      <li>LROC WAC basemap with true lunar graticule (lat/lon graticules at 15° intervals).</li>
      <li>Prominent formations: Mare Tranquillitatis, Hadley Rille, Oceanus Procellarum.</li>
      <li>Ground traverse polylines: Lunokhod 2 (39.1 km) & Apollo 15 LRV (27.76 km).</li>
    </ul>
  </div>
  <div>
    <h3>3. High-Resolution Martian Globe (MOLA)</h3>
    <ul>
      <li>USGS Mars MOLA topography highlighting hemispheric elevation dichotomy.</li>
      <li>Rover traverses: Opportunity in Meridiani Planum (45.16 km), Perseverance in Jezero Crater (31.8 km).</li>
      <li>Artifact markers for Viking 1, Pathfinder, Spirit, Curiosity, and InSight.</li>
    </ul>

    <h3>4. 3D Spatial Navigation Controls</h3>
    <ul>
      <li>Smooth OrbitControls with logarithmic depth buffer preventing z-fighting.</li>
      <li>Dynamic camera transitions with spherical slerp interpolation.</li>
    </ul>
  </div>
</div>

<!-- Speaker Notes:
The user can seamlessly zoom from a wide heliocentric view of the Solar System down to millimeter-accurate landing coordinates on the Moon or Mars. We render real traverse polylines mapped directly from NASA mission telemetry.
-->

---

<!-- SLIDE 6: 22 NATURAL SATELLITE WORLDS -->
# 22 Natural Satellite Worlds & True Scale
## Bridging Scientific Scale Ratios with Visual Exploration

<div class="grid-2">
  <div>
    <h3>Dual Astronomical Scale Engine</h3>
    <ul>
      <li><strong>Scientific Exploration Mode</strong>: Logarithmic planet/moon distance scaling allows navigable viewing of massive celestial systems without losing small bodies.</li>
      <li><strong>True Physical Scale Mode</strong>: Strict 1:1 physical diameter ratios preserve exact planetary proportions:
        <ul>
          <li>Jupiter (139,820 km) vs Io (3,643 km) vs Europa (3,122 km)</li>
          <li>Earth (12,742 km) vs Moon (3,474 km)</li>
        </ul>
      </li>
    </ul>

    <h3>Parent-Planet Sky Geometry</h3>
    <p>Calculates exact sky visibility and angular diameter of parent planets as seen from each satellite's surface.</p>
  </div>
  <div>
    <h3>22-World Catalog Highlights</h3>
    <ul>
      <li><strong>Earth</strong>: The Moon (Earth-Moon barycentric system)</li>
      <li><strong>Mars</strong>: Phobos & Deimos (captured carbonaceous asteroids)</li>
      <li><strong>Jupiter</strong>: Io, Europa, Ganymede, Callisto, Amalthea</li>
      <li><strong>Saturn</strong>: Titan (dense atmosphere), Enceladus (cryovolcanoes), Mimas, Iapetus, Rhea, Tethys, Dione</li>
      <li><strong>Uranus</strong>: Miranda (chaotic scarps), Ariel, Umbriel, Titania, Oberon</li>
      <li><strong>Neptune</strong>: Triton (retrograde capture), Proteus, Nereid</li>
    </ul>
    <div class="highlight-box">
      <strong>8 Director Camera Presets:</strong> Grand Reveal, Polar High Angle, Horizon Scrape, Orbit Chase, Surface Telephoto, Ring Plane, Eclipse Shadow, Flyby.
    </div>
  </div>
</div>

<!-- Speaker Notes:
We expanded the simulation beyond just the Moon and Mars to encompass 22 major natural satellites across six planetary systems. We model their true physical dimensions, retrograde orbits, and parent planet sky visibility.
-->

---

<!-- SLIDE 7: 14-CHAPTER STORY CINEMA ENGINE -->
# 14-Chapter Choreographed Story Cinema
## 70 Micro-Beats & Live Aerodynamic Telemetry

```
[CH 01-04: Trans-Planetary Cruise]  -->  [CH 05: Powered Descent Initiation]  -->  [CH 06: Terminal Cushion]
- TLI / Trans-Mars Insertion            - Braking burn ignition (30% throttle)    - Soft throttle ramp (100%)
- Interplanetary vacuum drift            - Pitch-over maneuver & radar lock        - Oleo strut compression
- Audio: Deep Space Cruise (12s loop)   - Audio: Soft Thrusters Part 1 (12s)       - Audio: Cushion Thrusters Part 2 (12s)

[CH 07-10: Surface Operations]      -->  [CH 11-12: Science Legacy]            -->  [CH 13-14: Observatory & Heritage]
- Sample collection & deployment        - Isotope analysis & discoveries          - Modern orbital imaging (LROC/HiRISE)
- Regolith mobility traverses           - Causal impacts on modern Artemis/MSR     - Eternal cultural legacy on surface
- Strictly silent atmospheric audio     - Narrative NASA Facts & Archival Docs     - Multi-spectral radar view
```

- **Exact Archival Video Synchronization**: Every chapter runs for exactly 12.0 seconds, matching historical NASA 16mm DAC film and rover entry footage.
- **Real-Time Dynamic Telemetry**: Calculates instant Altitude ($km$), Velocity ($m/s$), Dynamic Pressure ($kPa$), G-Force ($g$), and Thermal Flux ($kW/m^2$).

<!-- Speaker Notes:
Story Cinema is our flagship storytelling feature. It choreographs 14 narrative chapters through 70 synchronized micro-beats. It computes live aerodynamic telemetry and links directly to historical archival records.
-->

---

<!-- SLIDE 8: SCIENTIFIC SPACE ACOUSTIC SUITE -->
# Scientific Space Acoustic Suite
## Grounded in Vacuum Physics & Terminal Landing Thruster Dynamics

<div class="grid-2">
  <div>
    <h3>Acoustic Design Principles</h3>
    <ul>
      <li><strong>Physical Vacuum Physics</strong>: Sound cannot travel through vacuum; inside spacecraft or on planetary surfaces, sound conducts through airframes and landing struts.</li>
      <li><strong>Silence on Idle & Browsing</strong>: Opening the website or browsing the 3D globe produces zero audio clutter.</li>
      <li><strong>Watch Story Intro Exclusivity</strong>: Audio is strictly routed only inside Story Cinema mode.</li>
    </ul>

    <h3>Strict Chapter Audio Routing</h3>
    <ul>
      <li><strong>CH 1 to 4</strong>: <code>rocket_space_travel_12s.wav</code> (soft deep space cruise).</li>
      <li><strong>CH 5</strong>: <code>landing_increasing_thruster_ch5.wav</code> (Part 1: 12s descent throttle).</li>
      <li><strong>CH 6</strong>: <code>landing_increasing_thruster_ch6.wav</code> (Part 2: 12s terminal cushion to reduce impact).</li>
      <li><strong>CH 7 to 14</strong>: Strictly silent.</li>
    </ul>
  </div>
  <div>
    <h3>Instant Pause & Anti-Race Architecture</h3>
    <div class="highlight-box">
      <strong>Zero-Latency Audio Cutoff:</strong>
      Clicking Pause, pressing Spacebar, or scrubbing immediately drops gain to 0.0 and disconnects all Web Audio nodes.
    </div>
    <ul>
      <li><strong>Generation-Token Gating</strong>: <code>storyAudioGeneration</code> token prevents async buffer loads from playing if paused during network fetch.</li>
      <li><strong>Procedural Fallback</strong>: 48 kHz Web Audio oscillator and brownian noise synth if external files are unbuffered.</li>
      <li><strong>Scrubber Alignment</strong>: Resumes at exact millisecond offset matching visual timeline progress.</li>
    </ul>
  </div>
</div>

<!-- Speaker Notes:
Our acoustic engine was engineered to avoid audio clutter. The site is completely quiet on initial load. Sound only plays inside Watch Story Intro for Chapters 1 through 6, featuring a 24-second two-part soft increasing thruster sound that cushions touchdown. When paused, audio halts instantly.
-->

---

<!-- SLIDE 9: PLANETARY ARCHAEOLOGY & PROVENANCE -->
# Planetary Archaeology & Provenance Data
## Epistemic Integrity Grounded in NASA Ground-Truth

<div class="grid-2">
  <div>
    <h3>Four Distinct Coordinate Disciplines</h3>
    <ol>
      <li><strong>Landing Location</strong>: Initial touchdown point from mission descent telemetry.</li>
      <li><strong>Final Operating Location</strong>: Last transmission coordinate before power exhaustion or shutdown.</li>
      <li><strong>Final Documented Location</strong>: Modern coordinate pinpointed by high-resolution orbital reconnaissance (LROC / MRO HiRISE).</li>
      <li><strong>Impact Location</strong>: Crash coordinate for intentionally crashed ascent stages and orbiters.</li>
    </ol>
  </div>
  <div>
    <h3>Catalog of 12 Featured Artifacts</h3>
    <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse;">
      <thead>
        <tr style="border-bottom: 1px solid #475569; color: #38bdf8;">
          <th>Artifact ID</th><th>Mission</th><th>Body</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>ART-APOLLO11-LM</td><td>Apollo 11</td><td>Moon</td><td>Verified</td></tr>
        <tr><td>ART-APOLLO15-LRV</td><td>Apollo 15</td><td>Moon</td><td>Verified</td></tr>
        <tr><td>ART-LUNOKHOD2</td><td>Luna 21</td><td>Moon</td><td>Verified</td></tr>
        <tr><td>ART-SURVEYOR3</td><td>Surveyor 3</td><td>Moon</td><td>Inspected</td></tr>
        <tr><td>ART-VIKING1</td><td>Viking 1</td><td>Mars</td><td>Verified</td></tr>
        <tr><td>ART-OPPORTUNITY</td><td>MER-B</td><td>Mars</td><td>Verified</td></tr>
        <tr><td>ART-PERSEVERANCE</td><td>Mars 2020</td><td>Mars</td><td>Active</td></tr>
        <tr><td>ART-CASSINI</td><td>Cassini</td><td>Saturn</td><td>Impacted</td></tr>
        <tr><td>ART-VOYAGER1</td><td>Voyager 1</td><td>Helio</td><td>Interstellar</td></tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Speaker Notes:
Planetary archaeology requires distinguishing between where a spacecraft landed, where it completed its mission, and where modern orbiters like LROC or HiRISE actually photographed it. We track explicit uncertainty radii for every artifact.
-->

---

<!-- SLIDE 10: 3D HARDWARE INSPECTOR -->
# 3D Hardware Inspector & Exploded View
## Multi-Part Procedural CAD & Aerospace PBR Shaders

<div class="grid-2">
  <div>
    <h3>Exploded-View Assembly Animation</h3>
    <ul>
      <li>Damped slider control (<code>0% to 100%</code>) dynamically expands spacecraft subsystems along radial vectors.</li>
      <li>Inspect internal propellant tanks, avionics bays, scientific payloads, and retro-rocket thrusters.</li>
      <li>Spring-damped easing provides realistic CAD-grade spatial clarity.</li>
    </ul>

    <h3>Procedural 3D Spacecraft Models</h3>
    <ul>
      <li><strong>Lunar Module Descent Stage</strong>: Octagonal chassis, 4 truss landing legs, Descent Propulsion System engine bell, and deployable MESA experiment pallet.</li>
      <li><strong>Martian Science Rover</strong>: 6-wheel rocker-bogie suspension, rocker differential, mastcam sensor head, and robotic sample arm.</li>
      <li><strong>Deep Space Probe</strong>: High-gain parabolic antenna dish, RTG boom, and plasma wave sensor arrays.</li>
    </ul>
  </div>
  <div>
    <h3>Physically Based Materials (PBR)</h3>
    <div style="background: rgba(15, 23, 42, 0.8); padding: 15px; border-radius: 8px; border: 1px solid #334155;">
      <p style="margin: 0; font-size: 0.9rem;">
        <strong>1. Kapton Foil Shader:</strong> Golden aluminized polyimide film with high specular reflectivity and micro-wrinkle bump map.<br><br>
        <strong>2. Anodized Aluminum:</strong> Micro-roughness metalness mapping simulating spacecraft bus structural bulkheads.<br><br>
        <strong>3. Solar Silicon Arrays:</strong> Deep navy anti-reflective coating with fine silver gridlines and high specular sheen.<br><br>
        <strong>4. Martian Regolith Dusting:</strong> Progressive ferric oxide weathering procedural overlay.
      </p>
    </div>
  </div>
</div>

<!-- Speaker Notes:
Our 3D Hardware Inspector lets students and aerospace engineers explode the spacecraft in 3D space to examine internal avionics, fuel tanks, and thruster nozzles with custom PBR materials simulating thermal blankets and gold Kapton foil.
-->

---

<!-- SLIDE 11: ACADEMY & MEDIA INTELLIGENCE LAB -->
# Space Archaeology Academy & Media Lab
## Interactive Education & Guarded Multimedia Pipeline

<div class="grid-2">
  <div>
    <h3>Space Archaeology Academy</h3>
    <ul>
      <li><strong>Tiered Difficulty Challenges</strong>: Beginner, Intermediate, and Advanced missions testing historical and physics comprehension.</li>
      <li><strong>Automated Grading Engine</strong>: Instant submission assessment with score breakdowns.</li>
      <li><strong>Claim-Backed Explanations</strong>: Every answer directly references verified NASA PDS claims and archival source IDs.</li>
    </ul>
  </div>
  <div>
    <h3>FFmpeg / FFprobe Media Lab</h3>
    <ul>
      <li><strong>Subprocess Security Sandbox</strong>: Executes FFmpeg and FFprobe with validated argument lists, blocking path traversal and shell injection.</li>
      <li><strong>Automated Contact Sheet Generation</strong>: Produces 2x2 thumbnail sheets from historical video archives.</li>
      <li><strong>EBU R128 Audio Normalization</strong>: Ensures archival voice tracks match modern broadcast loudness standards (-23 LUFS).</li>
    </ul>
  </div>
</div>

<!-- Speaker Notes:
We built an interactive educational academy with automated grading tied to scientific claims, alongside a backend media lab that processes historical NASA footage with strict subprocess security.
-->

---

<!-- SLIDE 12: QUALITY ASSURANCE & VERIFICATION -->
# Verification, Security & Quality Assurance
## Rigorous Engineering Verification Suite

<div class="grid-2">
  <div>
    <h3>10/10 Passing Automated Unit Tests</h3>
    <ol style="font-size: 0.85rem;">
      <li>Coordinate conversion round-trip for Apollo 11 Tranquillity Base</li>
      <li>Spherical Haversine distance for surface separation</li>
      <li>Phase 05 scientific validation (100% NASA records pass)</li>
      <li>Phase 09 search & filter engine across bodies & categories</li>
      <li>Phase 06 FFmpeg command builder security & path traversal blocks</li>
      <li>Phase 10 educational assessment scoring and claim explanations</li>
      <li>70-Beat 14-Chapter Story Choreography telemetry accuracy</li>
      <li>Astronomical scale engine planet-to-moon diameter ratios</li>
      <li>22-World Natural Satellite catalog and camera presets</li>
      <li>Story Cinema Audio chapter mapping and audio asset validation</li>
    </ol>
  </div>
  <div>
    <h3>Security & Build Standards</h3>
    <div class="highlight-box">
      <strong>Enterprise-Grade Standards:</strong>
      Zero runtime vulnerabilities, zero path traversal, and deterministic builds.
    </div>
    <ul>
      <li><strong>TypeScript Compiler</strong>: Strict null checks, zero unused locals, 100% type coverage.</li>
      <li><strong>Vite 8 & Rollup Bundler</strong>: 1.4s production build time, optimized Gzip assets.</li>
      <li><strong>Git Version Control</strong>: Clean linear commit history on <code>main</code> with atomic commits.</li>
    </ul>
  </div>
</div>

<!-- Speaker Notes:
Quality assurance is built into every layer. We have 10 comprehensive automated unit tests covering coordinates, spherical distance, dataset integrity, FFmpeg arguments, choreography, astronomical scale ratios, and audio routing.
-->

---

<!-- SLIDE 13: LIVE DEMO & FUTURE ROADMAP -->
# Live Demonstration & Future Roadmap
## Operational Excellence & Expansion Horizons

<div class="grid-2">
  <div>
    <h3>Current Operational Capabilities</h3>
    <ul>
      <li><strong>Live Local & Production Server</strong>: Active on port 3000 with Hot Module Replacement (HMR).</li>
      <li><strong>Full Touch & Mobile Support</strong>: Responsive multi-dock layout, Zen mode toggle, and touch orbit navigation.</li>
      <li><strong>Offline Acoustic Synthesizers</strong>: Web Audio fallback operates even without network asset fetches.</li>
    </ul>
  </div>
  <div>
    <h3>Future Roadmap Horizons</h3>
    <ul>
      <li><strong>Expanded Outer Worlds</strong>: Add subsurface ocean visualization for Europa, Enceladus, and Ganymede.</li>
      <li><strong>WebXR VR/AR Support</strong>: Walk on Apollo 11 Tranquillity Base in virtual reality headsets.</li>
      <li><strong>Artemis III Real-Time Integration</strong>: Stream live telemetry from upcoming crewed lunar surface missions.</li>
      <li><strong>Crowdsourced Archaeology Annotations</strong>: Verified peer-reviewed community contribution pipeline.</li>
    </ul>
  </div>
</div>

<!-- Speaker Notes:
The application is live right now. Looking forward, our roadmap includes WebXR immersion for VR headsets, live telemetry integration for upcoming Artemis lunar landings, and expanded oceanic visualizations for moons like Europa.
-->

---

<!-- SLIDE 14: CONCLUSION & Q&A -->
# Conclusion & Acknowledgments
## Preserving Humanity's Past to Inspire the Interplanetary Future

<div class="highlight-box" style="margin-top: 25px;">
  <em>"That's one small step for man, one giant leap for mankind."</em><br>
  <strong>AFTERLIGHT ensures those first footsteps, wheels, and sensors are never forgotten, mislocated, or erased.</strong>
</div>

<div class="grid-2" style="margin-top: 35px;">
  <div>
    <h3>Key Takeaways</h3>
    <ul>
      <li>Authentic 3D spatial twin of planetary artifacts.</li>
      <li>14-Chapter synchronized audiovisual storytelling.</li>
      <li>24s dual-part increasing thrusters with immediate pause.</li>
      <li>Strict NASA PDS and LROC scientific provenance.</li>
    </ul>
  </div>
  <div style="text-align: center; background: rgba(15, 23, 42, 0.7); padding: 30px; border-radius: 12px; border: 1px solid #334155;">
    <h2 style="color: #38bdf8; border: none; margin: 0 0 10px 0;">Thank You</h2>
    <p style="font-size: 1.1rem; color: #f8fafc; margin: 0 0 15px 0;"><strong>AFTERLIGHT Engineering Team</strong></p>
    <p style="font-size: 0.9rem; color: #94a3b8; margin: 0;">Open for Questions & Discussion</p>
    <div style="margin-top: 20px;">
      <span class="tag tag-cyan">Live Demo Available</span>
      <span class="tag tag-amber">NASA Space Apps 2026</span>
    </div>
  </div>
</div>

<!-- Speaker Notes:
Thank you for your time. AFTERLIGHT stands ready to preserve and bring alive humanity's greatest exploratory achievements. We welcome any questions and would be delighted to demonstrate the live platform.
-->
