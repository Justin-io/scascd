# AFTERLIGHT — Scientific Data & Provenance Strategy

## 1. Scientific Authority Hierarchy

AFTERLIGHT enforces a strict epistemological hierarchy across all planetary archaeology records, coordinate markers, and narrative chapters:

1. **Primary Photogrammetric & Altimetric Archives**:
   - **NASA Planetary Data System (PDS)** — Lunar Reconnaissance Orbiter Camera (LROC NAC/WAC) and Mars Reconnaissance Orbiter (MRO HiRISE / MOLA).
   - **NAIF SPICE & JPL Horizons** — Reference frames (`IAU_MOON`, `IAU_MARS`), planetocentric coordinates, and spacecraft state vectors.
2. **Mission Operations & Archival Catalogs**:
   - **NASA Space Science Data Coordinated Archive (NSSDC)** — International COSPAR IDs, launch/landing UTC timestamps, and mission duration records.
3. **Peer-Reviewed Geodesy & Archaeological Surveys**:
   - Wagner et al. (2017) *Icarus* for LROC NAC lunar anthropogenic artifact coordinates.
   - Karachevtseva et al. (2013) *Planetary and Space Science* for Lunokhod 2 photogrammetric odometer reconstruction.

## 2. Multi-Coordinate Spatial Provenance

Unlike generic maps that reduce a mission to a single pin, AFTERLIGHT tracks up to five distinct spatial states per artifact:

- `landingLocation` — Initial touchdown or first surface contact coordinates.
- `finalOperatingLocation` — Location of final telemetry transmission or active operation.
- `finalDocumentedLocation` — Photogrammetrically resolved position in orbital reconnaissance imagery (LROC NAC / HiRISE).
- `currentEstimatedLocation` — Best-estimate coordinates where direct optical resolution has not yet been achieved (e.g., Huygens on Titan, Venera 13 on Venus, Galileo atmospheric entry).
- `impactLocation` — Terminal impact coordinates for orbital impactors or spent stages.

## 3. Epistemic Classification (`VerificationLevel`)

Every scientific claim (`[CLAIM-ID]`) is tagged with one of four verification states:
- `verified` — Directly confirmed by orbital imagery, laser retroreflector ranging, or verified telemetry.
- `estimated` — Derived from entry-descent-landing (EDL) ballistics, Doppler tracking, or wheel odometry prior to orbital imaging.
- `uncertain` — Subject to historical telemetry ambiguity or unresolved surface visibility.
- `fictional_frame` — Literary framing used exclusively in the optional *First-Person Creative Narrative* mode, always explicitly labeled and paired with the underlying archival record.
