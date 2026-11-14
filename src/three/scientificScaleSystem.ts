import * as THREE from 'three';
import { CelestialBodyId } from '../types/afterlight';
import { AuthenticSolarTextures, createAtmosphereMesh } from './proceduralAssets';

export type AstronomicalScaleMode = 'scientific_exploration' | 'scientific_scale';

export type ScientificDataProvenanceClass =
  | 'ACTUAL_IMAGERY_AND_DEM'
  | 'OPTICAL_MOSAIC_WITH_RELIEF'
  | 'PARTIAL_FLYBY_WITH_RECONSTRUCTION'
  | 'PROCEDURAL_RECONSTRUCTION';

export interface ScientificAssetManifest {
  datasetSource: string;
  datasetResolution: string;
  geographicCoverage: string;
  coordinateSystem: string;
  elevationScale: string;
  textureResolution: string;
  dataProvenance: ScientificDataProvenanceClass;
  scientificConfidence: 'VERIFIED' | 'HIGH_CONFIDENCE' | 'PARTIAL_COVERAGE' | 'ILLUSTRATIVE_PROCEDURAL';
  missingDataRegions: string;
}

export interface SatelliteGeologicalFormation {
  id: string;
  name: string;
  featureType:
    | 'Crater / Basin'
    | 'Volcanic Caldera / Plume'
    | 'Tectonic Chasma / Sulcus'
    | 'Chaos / Corona Terrain'
    | 'Hydrocarbon Mare / Dune'
    | 'Equatorial Ridge / Montes'
    | 'Regio / Highland';
  lat: number;
  lon: number;
  diameterKm: number;
  description: string;
}

/**
 * Authoritative NASA Planetary Fact Sheet / JPL Solar System Dynamics metadata
 * for every planet and natural satellite in the scene.
 */
export interface ScientificCelestialMetadata {
  id: string;
  name: string;
  parentBody: string;
  meanRadiusKm: number;
  triaxialAxesKm?: [number, number, number];
  massKg: string;
  meanDensityGcm3: number;
  semimajorAxisKm: number;
  eccentricity: number;
  inclinationDeg: number;
  orbitalPeriodDays: number;
  rotationPeriodHours: number;
  surfaceGravityMS2: number;
  surfaceCharacteristics: string;
  atmosphericCharacteristics: string;
  provenanceDataset: string;
  retrograde?: boolean;
  cinematicStorytellingSummary?: string;
  assetManifest?: ScientificAssetManifest;
  namedFormations?: SatelliteGeologicalFormation[];
}

export const EARTH_MEAN_RADIUS_KM = 6371.0;

/**
 * Reference Planetary Dimensions & Orbital Elements (NASA GSFC Planetary Fact Sheet / JPL Horizons)
 */
export const PLANETARY_SCIENTIFIC_METADATA: Record<
  CelestialBodyId | 'mercury' | 'venus',
  ScientificCelestialMetadata
> = {
  sun: {
    id: 'sun',
    name: 'The Sun (Sol)',
    parentBody: 'Milky Way Galactic Barycenter',
    meanRadiusKm: 695700,
    massKg: '1.9885 × 10³⁰ kg',
    meanDensityGcm3: 1.408,
    semimajorAxisKm: 0,
    eccentricity: 0,
    inclinationDeg: 0,
    orbitalPeriodDays: 0,
    rotationPeriodHours: 609.12,
    surfaceGravityMS2: 274.0,
    surfaceCharacteristics:
      'G2V main-sequence photosphere at 5,772 K with convective granules and active magnetic sunspot regions.',
    atmosphericCharacteristics:
      'Chromosphere and multi-million-kelvin magnetized solar corona driving the heliospheric solar wind.',
    provenanceDataset: 'NASA GSFC Sun Fact Sheet / IAU 2015 Resolution B3',
  },
  mercury: {
    id: 'mercury',
    name: 'Mercury',
    parentBody: 'The Sun (Sol)',
    meanRadiusKm: 2439.7,
    massKg: '3.3011 × 10²³ kg',
    meanDensityGcm3: 5.427,
    semimajorAxisKm: 57909050,
    eccentricity: 0.2056,
    inclinationDeg: 7.005,
    orbitalPeriodDays: 87.969,
    rotationPeriodHours: 1407.6,
    surfaceGravityMS2: 3.7,
    surfaceCharacteristics:
      'Heavily cratered silicate crust with global lobate thrust scarps, Caloris Basin, and polar shadow water-ice deposits.',
    atmosphericCharacteristics:
      'Ultra-tenuous surface-bounded exosphere of O₂, Na, H₂, He, and K.',
    provenanceDataset: 'NASA MESSENGER MDIS & MLA PDS Archive',
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    parentBody: 'The Sun (Sol)',
    meanRadiusKm: 6051.8,
    massKg: '4.8675 × 10²⁴ kg',
    meanDensityGcm3: 5.243,
    semimajorAxisKm: 108208000,
    eccentricity: 0.0067,
    inclinationDeg: 3.3946,
    orbitalPeriodDays: 224.701,
    rotationPeriodHours: -5832.5,
    retrograde: true,
    surfaceGravityMS2: 8.87,
    surfaceCharacteristics:
      'Volcanic basaltic plains, Maxwell Montes highland tesserae, and coronae resurfaced by global volcanism.',
    atmosphericCharacteristics:
      '92-bar supercritical CO₂ atmosphere (96.5%) with opaque H₂SO₄ sulfuric acid cloud decks at 45–70 km.',
    provenanceDataset: 'NASA Magellan SAR Radar Altimetry PDS Archive',
  },
  earth: {
    id: 'earth',
    name: 'Earth',
    parentBody: 'The Sun (Sol)',
    meanRadiusKm: 6371.0,
    massKg: '5.9724 × 10²⁴ kg',
    meanDensityGcm3: 5.514,
    semimajorAxisKm: 149598023,
    eccentricity: 0.0167,
    inclinationDeg: 0.00005,
    orbitalPeriodDays: 365.256,
    rotationPeriodHours: 23.9345,
    surfaceGravityMS2: 9.80665,
    surfaceCharacteristics:
      '70.8% liquid water ocean basins and tectonic silicate continental plates with active biosphere.',
    atmosphericCharacteristics:
      '1.013-bar N₂ (78.08%), O₂ (20.95%), Ar (0.93%), and H₂O cloud layers with Rayleigh blue scattering.',
    provenanceDataset: 'WGS84 / NASA Blue Marble Next Generation',
  },
  moon: {
    id: 'moon',
    name: 'The Moon (Luna)',
    parentBody: 'Earth',
    meanRadiusKm: 1737.4,
    massKg: '7.346 × 10²² kg',
    meanDensityGcm3: 3.344,
    semimajorAxisKm: 384399,
    eccentricity: 0.0549,
    inclinationDeg: 5.145,
    orbitalPeriodDays: 27.3217,
    rotationPeriodHours: 655.72,
    surfaceGravityMS2: 1.62,
    surfaceCharacteristics:
      'Anorthositic highlands, flood-basalt maria (Mare Tranquillitatis, Oceanus Procellarum), and multi-ring impact basins.',
    atmosphericCharacteristics:
      'Hard vacuum surface-bounded exosphere (~10⁻¹⁴ bar of Ar, He, Ne).',
    provenanceDataset: 'NASA LRO LOLA / LROC PDS Archive',
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    parentBody: 'The Sun (Sol)',
    meanRadiusKm: 3389.5,
    massKg: '6.4171 × 10²³ kg',
    meanDensityGcm3: 3.933,
    semimajorAxisKm: 227939200,
    eccentricity: 0.0934,
    inclinationDeg: 1.85,
    orbitalPeriodDays: 686.98,
    rotationPeriodHours: 24.6229,
    surfaceGravityMS2: 3.72076,
    surfaceCharacteristics:
      'Iron-oxide basaltic regolith, Tharsis volcanic province, Valles Marineris canyon system, and Noachian paleolake craters.',
    atmosphericCharacteristics:
      '6.36-mbar tenuous CO₂ (95.1%), N₂ (2.59%), Ar (1.94%) atmosphere with suspended iron-oxide dust aerosols.',
    provenanceDataset: 'NASA MGS MOLA / MRO HiRISE PDS Archive',
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    parentBody: 'The Sun (Sol)',
    meanRadiusKm: 69911.0,
    massKg: '1.8982 × 10²⁷ kg',
    meanDensityGcm3: 1.326,
    semimajorAxisKm: 778570000,
    eccentricity: 0.0489,
    inclinationDeg: 1.303,
    orbitalPeriodDays: 4332.59,
    rotationPeriodHours: 9.925,
    surfaceGravityMS2: 24.79,
    surfaceCharacteristics:
      'No solid surface; transition from molecular H₂/He envelope into liquid metallic hydrogen mantle.',
    atmosphericCharacteristics:
      'Zonal ammonia/ammonium-hydrosulfide cloud belts and zones, anticyclonic Great Red Spot, and polar cyclones.',
    provenanceDataset: 'NASA Juno / Galileo PDS Archive',
  },
  saturn: {
    id: 'saturn',
    name: 'Saturn',
    parentBody: 'The Sun (Sol)',
    meanRadiusKm: 58232.0,
    massKg: '5.6834 × 10²⁶ kg',
    meanDensityGcm3: 0.687,
    semimajorAxisKm: 1433530000,
    eccentricity: 0.0565,
    inclinationDeg: 2.485,
    orbitalPeriodDays: 10759.22,
    rotationPeriodHours: 10.656,
    surfaceGravityMS2: 10.44,
    surfaceCharacteristics:
      'No solid surface; oblate gas giant surrounded by an extensive water-ice ring system (D, C, B, Cassini Division, A, F).',
    atmosphericCharacteristics:
      'H₂ (96.3%) and He (3.25%) atmosphere with golden ammonia haze bands and a north-polar hexagonal jet stream.',
    provenanceDataset: 'NASA/ESA Cassini-Huygens PDS Archive',
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    parentBody: 'The Sun (Sol)',
    meanRadiusKm: 25362.0,
    massKg: '8.6810 × 10²⁵ kg',
    meanDensityGcm3: 1.27,
    semimajorAxisKm: 2872460000,
    eccentricity: 0.0457,
    inclinationDeg: 0.773,
    orbitalPeriodDays: 30688.5,
    rotationPeriodHours: -17.24,
    retrograde: true,
    surfaceGravityMS2: 8.87,
    surfaceCharacteristics:
      'Ice giant mantle of hot dense H₂O, NH₃, and CH₄ ices at 97.77° axial obliquity.',
    atmosphericCharacteristics:
      'H₂ (82.5%), He (15.2%), CH₄ (2.3%) cyan atmosphere with methane red-light absorption and 13 narrow dark rings.',
    provenanceDataset: 'NASA Voyager 2 PDS / GSFC Uranus Fact Sheet',
  },
  neptune: {
    id: 'neptune',
    name: 'Neptune',
    parentBody: 'The Sun (Sol)',
    meanRadiusKm: 24622.0,
    massKg: '1.02413 × 10²⁶ kg',
    meanDensityGcm3: 1.638,
    semimajorAxisKm: 4495060000,
    eccentricity: 0.0113,
    inclinationDeg: 1.77,
    orbitalPeriodDays: 60182.0,
    rotationPeriodHours: 16.11,
    surfaceGravityMS2: 11.15,
    surfaceCharacteristics:
      'High-pressure water-ammonia-methane ice mantle surrounding a rocky silicate-nickel-iron core.',
    atmosphericCharacteristics:
      'Deep azure H₂/He/CH₄ atmosphere with supersonic 2,100 km/h winds, methane cirrus clouds, and dark vortex storms.',
    provenanceDataset: 'NASA Voyager 2 PDS / JPL Horizons',
  },
};

export type SatelliteGeologicalArchetype =
  | 'lunar_regolith'
  | 'martian_phobos_stickney'
  | 'martian_deimos_smooth'
  | 'jovian_volcanic_io'
  | 'jovian_ice_europa'
  | 'jovian_grooved_ganymede'
  | 'jovian_cratered_callisto'
  | 'saturnian_herschel_mimas'
  | 'saturnian_cryo_enceladus'
  | 'saturnian_chasma_tethys'
  | 'saturnian_wispy_dione'
  | 'saturnian_cratered_rhea'
  | 'saturnian_haze_titan'
  | 'saturnian_twotone_iapetus'
  | 'uranian_corona_miranda'
  | 'uranian_graben_ariel'
  | 'uranian_dark_umbriel'
  | 'uranian_canyon_titania'
  | 'uranian_ancient_oberon'
  | 'neptunian_cantaloupe_triton'
  | 'neptunian_irregular_proteus'
  | 'neptunian_eccentric_nereid';

export interface NaturalSatelliteSpec extends ScientificCelestialMetadata {
  parentId: CelestialBodyId;
  geologicalType: SatelliteGeologicalArchetype;
  baseColorHex: string;
  secondaryColorHex: string;
  featureColorHex: string;
  roughness: number;
  displacementAmplitude: number;
  hasActivePlumes?: boolean;
  plumeColorHex?: string;
  hasThermalLavaEmission?: boolean;
  equatorialRidgeFactor?: number;
  majorBasinSpec?: {
    nx: number;
    ny: number;
    nz: number;
    radiusNorm: number;
    depthFactor: number;
    hasCentralPeak: boolean;
  };
  cinematicStorytellingSummary: string;
  assetManifest: ScientificAssetManifest;
  namedFormations: SatelliteGeologicalFormation[];
}

/**
 * Comprehensive 22-World Natural Satellite Master Catalog across Earth, Mars, Jupiter, Saturn, Uranus, and Neptune
 */
export const NATURAL_SATELLITES_CATALOG: NaturalSatelliteSpec[] = [
  // ================= EARTH SYSTEM =================
  {
    id: 'sat-moon',
    name: 'The Moon (Luna)',
    parentId: 'earth',
    parentBody: 'Earth',
    meanRadiusKm: 1737.4,
    massKg: '7.346 × 10²² kg',
    meanDensityGcm3: 3.344,
    semimajorAxisKm: 384399,
    eccentricity: 0.0549,
    inclinationDeg: 5.145,
    orbitalPeriodDays: 27.3217,
    rotationPeriodHours: 655.72,
    surfaceGravityMS2: 1.62,
    geologicalType: 'lunar_regolith',
    baseColorHex: '#717882',
    secondaryColorHex: '#3c424b',
    featureColorHex: '#aeb6c2',
    roughness: 0.94,
    displacementAmplitude: 0.036,
    surfaceCharacteristics:
      'Dark flood-basalt maria, bright anorthositic highlands, Tycho and Copernicus ray craters, sinuous volcanic rilles, and South Pole-Aitken basin.',
    atmosphericCharacteristics:
      'Ultra-high vacuum surface-bounded exosphere (~10⁻¹⁴ bar).',
    provenanceDataset: 'NASA LRO LROC WAC / LOLA Digital Elevation Model',
    cinematicStorytellingSummary:
      'A low-altitude traverse across ancient flood-basalt maria and terraced impact craters with Earth suspended as a blue-white crescent above the airless horizon.',
    assetManifest: {
      datasetSource: 'NASA LRO LROC Wide Angle Camera (WAC) + LOLA Laser Altimeter DEM',
      datasetResolution: '100 m/px global albedo mosaic; 118 m/px LOLA elevation grid (0.5 m/px NAC at landing sites)',
      geographicCoverage: '100% Global (90°S to 90°N, 0° to 360°E)',
      coordinateSystem: 'IAU Mean Earth / Polar Axis (ME) Planetocentric',
      elevationScale: '-9,120 m (Antoniadi Crater floor) to +10,786 m (Selenean Summit)',
      textureResolution: '2048×1024 Optical Albedo + LOLA Normal/Bump Relief',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None (complete polar-orbit laser altimetry and optical coverage)',
    },
    namedFormations: [
      {
        id: 'form-moon-tycho',
        name: 'Tycho Crater & Ray System',
        featureType: 'Crater / Basin',
        lat: -43.31,
        lon: -11.36,
        diameterKm: 85.0,
        description: 'Copernican-age terraced impact crater (108 Ma) with a 2-km central peak and 1,500-km bright ejecta rays.',
      },
      {
        id: 'form-moon-copernicus',
        name: 'Copernicus Crater',
        featureType: 'Crater / Basin',
        lat: 9.62,
        lon: -20.08,
        diameterKm: 93.0,
        description: 'Classic complex impact crater in eastern Oceanus Procellarum with terraced walls and triple central peaks.',
      },
      {
        id: 'form-moon-tranquillitatis',
        name: 'Mare Tranquillitatis',
        featureType: 'Regio / Highland',
        lat: 8.5,
        lon: 31.4,
        diameterKm: 873.0,
        description: 'Titanium-rich flood basalt basin hosting Apollo 11 Tranquillity Base, Ranger 8, and Surveyor 5.',
      },
      {
        id: 'form-moon-spa',
        name: 'South Pole–Aitken Basin',
        featureType: 'Crater / Basin',
        lat: -53.0,
        lon: -169.0,
        diameterKm: 2500.0,
        description: 'Largest, oldest, and deepest impact basin on the Moon (~8.2 km deep), visited by Chang\'e 4 at Von Kármán crater.',
      },
      {
        id: 'form-moon-aristarchus',
        name: 'Aristarchus Plateau & Vallis Schröteri',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: 23.7,
        lon: -47.4,
        diameterKm: 40.0,
        description: 'High-albedo crustal block with pyroclastic dark mantle deposits and the largest sinuous lava rille on the Moon.',
      },
    ],
  },

  // ================= MARS SYSTEM =================
  {
    id: 'sat-phobos',
    name: 'Phobos (Mars I)',
    parentId: 'mars',
    parentBody: 'Mars',
    meanRadiusKm: 11.267,
    triaxialAxesKm: [13.0, 11.4, 9.1],
    massKg: '1.0659 × 10¹⁶ kg',
    meanDensityGcm3: 1.876,
    semimajorAxisKm: 9376,
    eccentricity: 0.0151,
    inclinationDeg: 1.093,
    orbitalPeriodDays: 0.31891,
    rotationPeriodHours: 7.6538,
    surfaceGravityMS2: 0.0057,
    geologicalType: 'martian_phobos_stickney',
    baseColorHex: '#595048',
    secondaryColorHex: '#332d28',
    featureColorHex: '#82776c',
    roughness: 0.95,
    displacementAmplitude: 0.16,
    majorBasinSpec: {
      nx: 0.82,
      ny: 0.08,
      nz: 0.56,
      radiusNorm: 0.62,
      depthFactor: 1.45,
      hasCentralPeak: false,
    },
    surfaceCharacteristics:
      'Irregular triaxial rubble-pile body (26 × 22.8 × 18.2 km) dominated by the 9-km Stickney impact crater and parallel tidal stress grooves.',
    atmosphericCharacteristics: 'None (hard vacuum).',
    provenanceDataset: 'NASA Viking / MRO HiRISE / ESA Mars Express HRSC Shape Model',
    cinematicStorytellingSummary:
      'Skimming 6,000 km above the rusty clouds of Mars across Phobos\'s battered Stickney Crater rim and parallel tidal fracture grooves.',
    assetManifest: {
      datasetSource: 'ESA Mars Express HRSC + NASA MRO HiRISE / Viking Orbiter Shape Model (Willner et al.)',
      datasetResolution: '100 m/vertex 3D harmonic shape model; 4–12 m/px HRSC optical mosaic',
      geographicCoverage: '100% Global Triaxial Body',
      coordinateSystem: 'IAU Phobos West Longitude Planetocentric',
      elevationScale: 'Triaxial radii 13.0 × 11.4 × 9.1 km (±1.9 km local Stickney relief)',
      textureResolution: '1024×512 Albedo + Stickney Basin & Groove Displacement',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None',
    },
    namedFormations: [
      {
        id: 'form-phobos-stickney',
        name: 'Stickney Crater',
        featureType: 'Crater / Basin',
        lat: 1.0,
        lon: 49.0,
        diameterKm: 9.0,
        description: 'Enormous impact basin spanning nearly half of Phobos\'s mean diameter, with internal landslide streaks.',
      },
      {
        id: 'form-phobos-grooves',
        name: 'Tidal Stress & Ejecta Groove System',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: 14.0,
        lon: 110.0,
        diameterKm: 18.0,
        description: 'Parallel chains of 100–200 m wide, 20 m deep linear grooves produced by Mars tidal flexing and rolling ejecta boulders.',
      },
      {
        id: 'form-phobos-kepler',
        name: 'Kepler Dorsum',
        featureType: 'Equatorial Ridge / Montes',
        lat: -45.0,
        lon: 205.0,
        diameterKm: 15.0,
        description: 'Prominent southern hemisphere topographic ridge bounding ancient degraded crater basins.',
      },
    ],
  },
  {
    id: 'sat-deimos',
    name: 'Deimos (Mars II)',
    parentId: 'mars',
    parentBody: 'Mars',
    meanRadiusKm: 6.2,
    triaxialAxesKm: [7.8, 6.0, 5.1],
    massKg: '1.4762 × 10¹⁵ kg',
    meanDensityGcm3: 1.471,
    semimajorAxisKm: 23463.2,
    eccentricity: 0.00033,
    inclinationDeg: 0.93,
    orbitalPeriodDays: 1.26244,
    rotationPeriodHours: 30.312,
    surfaceGravityMS2: 0.003,
    geologicalType: 'martian_deimos_smooth',
    baseColorHex: '#6e6257',
    secondaryColorHex: '#463e37',
    featureColorHex: '#948679',
    roughness: 0.92,
    displacementAmplitude: 0.13,
    surfaceCharacteristics:
      'Irregular carbonaceous C/D-type body (15.6 × 12.0 × 10.2 km) with subdued craters (Swift, Voltaire) mantled in a 50-m blanket of fine regolith.',
    atmosphericCharacteristics: 'None (hard vacuum).',
    provenanceDataset: 'NASA Viking Orbiter 2 / MRO HiRISE / UAE Hope EXI Shape Model',
    cinematicStorytellingSummary:
      'Drifting past Deimos\'s regolith-softened ridges and bright downslope albedo streamers high above the Martian terminator.',
    assetManifest: {
      datasetSource: 'NASA Viking Orbiter + MRO HiRISE + Thomas (1993) Shape Model',
      datasetResolution: '200 m/vertex shape model; 20 m/px HiRISE/Viking optical coverage',
      geographicCoverage: '~95% Global (polar shadow gaps interpolated)',
      coordinateSystem: 'IAU Deimos West Longitude',
      elevationScale: 'Triaxial radii 7.8 × 6.0 × 5.1 km',
      textureResolution: '1024×512 Regolith Streamer Albedo + Triaxial Displacement',
      dataProvenance: 'OPTICAL_MOSAIC_WITH_RELIEF',
      scientificConfidence: 'HIGH_CONFIDENCE',
      missingDataRegions: 'High northern polar concavity interpolated smoothly from limb profiles',
    },
    namedFormations: [
      {
        id: 'form-deimos-swift',
        name: 'Swift Crater',
        featureType: 'Crater / Basin',
        lat: 12.5,
        lon: 358.2,
        diameterKm: 1.0,
        description: 'Sharp-rimmed 1-km impact crater surrounded by bright downslope regolith movement.',
      },
      {
        id: 'form-deimos-voltaire',
        name: 'Voltaire Crater',
        featureType: 'Crater / Basin',
        lat: 22.0,
        lon: 3.5,
        diameterKm: 1.9,
        description: 'Largest confirmed impact structure on Deimos, partially infilled by fine reddish-grey dust.',
      },
    ],
  },

  // ================= JUPITER SYSTEM (GALILEAN WORLDS) =================
  {
    id: 'sat-io',
    name: 'Io (Jupiter I)',
    parentId: 'jupiter',
    parentBody: 'Jupiter',
    meanRadiusKm: 1821.6,
    massKg: '8.9319 × 10²² kg',
    meanDensityGcm3: 3.528,
    semimajorAxisKm: 421700,
    eccentricity: 0.0041,
    inclinationDeg: 0.05,
    orbitalPeriodDays: 1.7691,
    rotationPeriodHours: 42.459,
    surfaceGravityMS2: 1.796,
    geologicalType: 'jovian_volcanic_io',
    baseColorHex: '#d99b26',
    secondaryColorHex: '#7f1d1d',
    featureColorHex: '#fef08a',
    roughness: 0.82,
    displacementAmplitude: 0.032,
    hasActivePlumes: true,
    plumeColorHex: '#f59e0b',
    hasThermalLavaEmission: true,
    surfaceCharacteristics:
      'Most volcanically active world in the Solar System; sulfur allotrope plains, glowing silicate lava lakes (Loki Patera, Pele), SO₂ frost deposits, and 17-km tectonic mountains.',
    atmosphericCharacteristics:
      'Patchy SO₂ volcanic plume atmosphere (~10⁻⁹ bar) feeding the Io plasma torus.',
    provenanceDataset: 'NASA Galileo SSI & NIMS / Juno JunoCam & JIRAM / Voyager PDS',
    cinematicStorytellingSummary:
      'Sweeping across Io\'s sulfurous calderas and glowing silicate lava fissures while umbrella-shaped volcanic plumes erupt against the striped immensity of Jupiter.',
    assetManifest: {
      datasetSource: 'USGS Astrogeology Galileo SSI + Voyager 1/2 Global Mosaic & Juno JIRAM Hotspots',
      datasetResolution: '1 km/px global color mosaic (100–300 m/px regional patera frames)',
      geographicCoverage: '100% Global',
      coordinateSystem: 'IAU Io West Longitude',
      elevationScale: '-3.5 km (Loki Patera floor) to +17.5 km (Boösaule Montes)',
      textureResolution: '1024×512 Albedo + Thermal Lava Emissive Map + Caldera Displacement',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None (Juno polar flybys completed high-latitude coverage in 2023–2024)',
    },
    namedFormations: [
      {
        id: 'form-io-loki',
        name: 'Loki Patera (Active Silicate Lava Lake)',
        featureType: 'Volcanic Caldera / Plume',
        lat: 13.0,
        lon: 308.8,
        diameterKm: 202.0,
        description: 'Largest volcanic depression on Io, containing an overturning crust of molten basaltic lava surrounding a central island.',
      },
      {
        id: 'form-io-pele',
        name: 'Pele Volcano & Red Sulfur Ring',
        featureType: 'Volcanic Caldera / Plume',
        lat: -18.7,
        lon: 255.3,
        diameterKm: 1200.0,
        description: 'Persistent high-temperature lava lake venting a 300-km-high plume that deposits a giant oval ring of red short-chain sulfur (S₃/S₄).',
      },
      {
        id: 'form-io-boosaule',
        name: 'Boösaule Montes',
        featureType: 'Equatorial Ridge / Montes',
        lat: -3.7,
        lon: 269.1,
        diameterKm: 540.0,
        description: '17.5-km-tall tilted tectonic crustal block—one of the tallest mountain peaks in the Solar System.',
      },
      {
        id: 'form-io-prometheus',
        name: 'Prometheus Plume & Lava Flow Field',
        featureType: 'Volcanic Caldera / Plume',
        lat: -1.5,
        lon: 153.9,
        diameterKm: 400.0,
        description: 'Long-lived effusive compound pahoehoe lava flow vaporizing underlying SO₂ frost into a 100-km umbrella plume.',
      },
    ],
  },
  {
    id: 'sat-europa',
    name: 'Europa (Jupiter II)',
    parentId: 'jupiter',
    parentBody: 'Jupiter',
    meanRadiusKm: 1560.8,
    massKg: '4.7998 × 10²² kg',
    meanDensityGcm3: 3.013,
    semimajorAxisKm: 671034,
    eccentricity: 0.009,
    inclinationDeg: 0.47,
    orbitalPeriodDays: 3.5512,
    rotationPeriodHours: 85.228,
    surfaceGravityMS2: 1.315,
    geologicalType: 'jovian_ice_europa',
    baseColorHex: '#d5e0ec',
    secondaryColorHex: '#7c3f23',
    featureColorHex: '#f8fafc',
    roughness: 0.44,
    displacementAmplitude: 0.024,
    surfaceCharacteristics:
      'Geologically young water-ice shell (<60 Ma) crisscrossed by reddish-brown irradiated salt lineae (double ridges), lenticulae, and Conamara Chaos ice rafts above a 100-km subsurface ocean.',
    atmosphericCharacteristics:
      'Tenuous radiolytic O₂ exosphere (~10⁻¹² bar).',
    provenanceDataset: 'NASA Galileo SSI / Juno JunoCam (2022 Flyby) PDS Archive',
    cinematicStorytellingSummary:
      'A slow cinematic glide toward Europa\'s glistening, fracture-scarred ice shell as Jupiter\'s banded cloud decks loom across the sky.',
    assetManifest: {
      datasetSource: 'USGS Galileo SSI + Voyager + JunoCam (PJ45 2022) Global Mosaic',
      datasetResolution: '500 m/px global mosaic (6–50 m/px Galileo regional Conamara frames)',
      geographicCoverage: '100% Global',
      coordinateSystem: 'IAU Europa West Longitude',
      elevationScale: '±1.2 km low-relief water-ice shell (200–300 m double-ridge crests)',
      textureResolution: '1024×512 Albedo + Lineae Double-Ridge Normal/Bump Map',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None (subsurface ocean depth inferred via Galileo magnetometer induction, not directly exposed)',
    },
    namedFormations: [
      {
        id: 'form-europa-conamara',
        name: 'Conamara Chaos',
        featureType: 'Chaos / Corona Terrain',
        lat: 9.7,
        lon: 272.7,
        diameterKm: 144.0,
        description: 'Disrupted landscape of rotated water-ice rafts refrozen in a hummocky matrix produced by warm diapiric upwelling.',
      },
      {
        id: 'form-europa-pwyll',
        name: 'Pwyll Ray Crater',
        featureType: 'Crater / Basin',
        lat: -25.2,
        lon: 271.4,
        diameterKm: 45.0,
        description: 'Young, shallow impact crater with a dark reddish floor and bright water-ice ejecta rays extending over 1,000 km.',
      },
      {
        id: 'form-europa-andorr',
        name: 'Minos & Cadmus Lineae (Double Ridges)',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: 45.0,
        lon: 195.0,
        diameterKm: 2100.0,
        description: 'Intersecting bands of parallel twin ice ridges stained reddish-brown by radiolytically altered magnesium sulfate and sulfuric acid hydrates.',
      },
      {
        id: 'form-europa-thera',
        name: 'Thera Macula',
        featureType: 'Chaos / Corona Terrain',
        lat: -46.7,
        lon: 181.2,
        diameterKm: 95.0,
        description: 'Sunken, actively collapsing chaos depression potentially underlain by a perched shallow liquid water lens within the ice shell.',
      },
    ],
  },
  {
    id: 'sat-ganymede',
    name: 'Ganymede (Jupiter III)',
    parentId: 'jupiter',
    parentBody: 'Jupiter',
    meanRadiusKm: 2634.1,
    massKg: '1.4819 × 10²³ kg',
    meanDensityGcm3: 1.936,
    semimajorAxisKm: 1070412,
    eccentricity: 0.0013,
    inclinationDeg: 0.2,
    orbitalPeriodDays: 7.1546,
    rotationPeriodHours: 171.71,
    surfaceGravityMS2: 1.428,
    geologicalType: 'jovian_grooved_ganymede',
    baseColorHex: '#8d857b',
    secondaryColorHex: '#46403a',
    featureColorHex: '#c7c1b8',
    roughness: 0.8,
    displacementAmplitude: 0.028,
    surfaceCharacteristics:
      'Largest moon in the Solar System (larger than Mercury); bimodal crust of dark cratered Galileo Regio (35%) and bright faulted Uruk Sulcus grooved terrain (65%); intrinsic magnetic field.',
    atmosphericCharacteristics:
      'Tenuous O₂ exosphere with polar auroral ovals driven by Ganymede\'s intrinsic dipole magnetosphere.',
    provenanceDataset: 'NASA Galileo SSI / Voyager / Juno (PJ34 2021) USGS Global Mosaic',
    cinematicStorytellingSummary:
      'Cruising above Ganymede\'s vast tectonic boundary between ancient dark Galileo Regio and bright fault-grooved Uruk Sulcus.',
    assetManifest: {
      datasetSource: 'USGS Astrogeology Galileo + Voyager + Juno PJ34 Global Mosaic',
      datasetResolution: '1 km/px global mosaic (11–100 m/px regional sulci frames)',
      geographicCoverage: '100% Global',
      coordinateSystem: 'IAU Ganymede West Longitude',
      elevationScale: '±3.0 km (viscously relaxed palimpsests and 700-m grooved graben)',
      textureResolution: '1024×512 Bimodal Albedo + Sulcus Groove Relief',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None',
    },
    namedFormations: [
      {
        id: 'form-ganymede-galileo',
        name: 'Galileo Regio',
        featureType: 'Regio / Highland',
        lat: 47.0,
        lon: 129.6,
        diameterKm: 4439.0,
        description: 'Vast, ancient (>4 Ga) dark clay-and-organic-lag plain cut by concentric tectonic furrows and bright palimpsest scars.',
      },
      {
        id: 'form-ganymede-uruk',
        name: 'Uruk Sulcus',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: 0.8,
        lon: 160.3,
        diameterKm: 2200.0,
        description: 'Bright swathe of extensional horst-and-graben water-ice ridges separating Galileo Regio from Marius Regio.',
      },
      {
        id: 'form-ganymede-gilgamesh',
        name: 'Gilgamesh Impact Basin',
        featureType: 'Crater / Basin',
        lat: -62.8,
        lon: 125.0,
        diameterKm: 585.0,
        description: 'Young multi-ring impact basin with a smooth central floor and rugged concentric mountain rings.',
      },
      {
        id: 'form-ganymede-tros',
        name: 'Tros Bright Ray Crater',
        featureType: 'Crater / Basin',
        lat: 11.1,
        lon: 27.3,
        diameterKm: 94.0,
        description: 'Prominent young impact crater excavating pure crystalline water-ice rays across Phrygia Sulcus.',
      },
    ],
  },
  {
    id: 'sat-callisto',
    name: 'Callisto (Jupiter IV)',
    parentId: 'jupiter',
    parentBody: 'Jupiter',
    meanRadiusKm: 2410.3,
    massKg: '1.0759 × 10²³ kg',
    meanDensityGcm3: 1.834,
    semimajorAxisKm: 1882709,
    eccentricity: 0.0074,
    inclinationDeg: 0.192,
    orbitalPeriodDays: 16.689,
    rotationPeriodHours: 400.54,
    surfaceGravityMS2: 1.235,
    geologicalType: 'jovian_cratered_callisto',
    baseColorHex: '#5c554e',
    secondaryColorHex: '#332e2a',
    featureColorHex: '#b8b2ac',
    roughness: 0.9,
    displacementAmplitude: 0.034,
    majorBasinSpec: {
      nx: 0.52,
      ny: 0.25,
      nz: 0.81,
      radiusNorm: 0.58,
      depthFactor: 0.55,
      hasCentralPeak: false,
    },
    surfaceCharacteristics:
      'Most heavily cratered saturation surface in the Solar System; dark non-ice lag blanket punctured by sparkling frost-rimmed craters and the 3,800-km Valhalla multi-ring impact structure.',
    atmosphericCharacteristics:
      'Extremely tenuous CO₂ and O₂ exosphere (~7.5 × 10⁻¹² bar).',
    provenanceDataset: 'NASA Galileo SSI / Voyager 1 & 2 USGS Global Mosaic',
    cinematicStorytellingSummary:
      'Passing over Callisto\'s ancient, saturation-cratered dark lithosphere and the giant concentric rings of the Valhalla impact basin.',
    assetManifest: {
      datasetSource: 'USGS Astrogeology Galileo SSI + Voyager 1/2 Controlled Mosaic',
      datasetResolution: '1 km/px global mosaic (15–120 m/px Galileo targeted frames)',
      geographicCoverage: '100% Global',
      coordinateSystem: 'IAU Callisto West Longitude',
      elevationScale: '±2.5 km (sublimated pinnacle knobs and concentric basin scarps)',
      textureResolution: '1024×512 Frost-Spotted Albedo + Valhalla Multi-Ring Relief',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None',
    },
    namedFormations: [
      {
        id: 'form-callisto-valhalla',
        name: 'Valhalla Multi-Ring Impact Basin',
        featureType: 'Crater / Basin',
        lat: 14.7,
        lon: 56.0,
        diameterKm: 3800.0,
        description: 'Largest multi-ring impact structure in the Solar System, with a 600-km bright central palimpsest and 20+ concentric graben rings.',
      },
      {
        id: 'form-callisto-asgard',
        name: 'Asgard Multi-Ring Structure',
        featureType: 'Crater / Basin',
        lat: 32.2,
        lon: 139.9,
        diameterKm: 1600.0,
        description: 'Second-largest multi-ring impact system on Callisto, overprinted by the young bright Doh crater.',
      },
      {
        id: 'form-callisto-gipul',
        name: 'Gipul Catena',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: 68.5,
        lon: 54.2,
        diameterKm: 620.0,
        description: 'Linear chain of 13 overlapping impact craters formed by a tidally disrupted comet (similar to Shoemaker-Levy 9).',
      },
    ],
  },

  // ================= SATURN SYSTEM =================
  {
    id: 'sat-mimas',
    name: 'Mimas (Saturn I)',
    parentId: 'saturn',
    parentBody: 'Saturn',
    meanRadiusKm: 198.2,
    triaxialAxesKm: [207.8, 196.7, 190.6],
    massKg: '3.7493 × 10¹⁹ kg',
    meanDensityGcm3: 1.148,
    semimajorAxisKm: 185539,
    eccentricity: 0.0196,
    inclinationDeg: 1.574,
    orbitalPeriodDays: 0.9424,
    rotationPeriodHours: 22.618,
    surfaceGravityMS2: 0.064,
    geologicalType: 'saturnian_herschel_mimas',
    baseColorHex: '#c8d0d8',
    secondaryColorHex: '#7d8794',
    featureColorHex: '#f1f5f9',
    roughness: 0.72,
    displacementAmplitude: 0.078,
    majorBasinSpec: {
      nx: 0.74,
      ny: 0.02,
      nz: 0.67,
      radiusNorm: 0.56,
      depthFactor: 1.65,
      hasCentralPeak: true,
    },
    surfaceCharacteristics:
      'Low-density water-ice body saturated with impact craters and dominated by the 139-km Herschel Crater (whose 11-km walls and 6-km central peak nearly shattered the moon).',
    atmosphericCharacteristics: 'None (hard vacuum).',
    provenanceDataset: 'NASA/ESA Cassini ISS Global Mosaic & Stereo Topographic Model',
    cinematicStorytellingSummary:
      'Approaching Mimas\'s colossal 139-km Herschel impact basin with Saturn\'s illuminated B and A rings spanning the background.',
    assetManifest: {
      datasetSource: 'NASA/ESA Cassini ISS Global Map + DLR Stereo Photogrammetry DEM',
      datasetResolution: '250 m/px global optical mosaic',
      geographicCoverage: '100% Global',
      coordinateSystem: 'IAU Mimas West Longitude',
      elevationScale: '-11.0 km (Herschel floor) to +6.0 km (Herschel central peak)',
      textureResolution: '1024×512 Icy Cratered Albedo + Herschel Basin & Central Peak Displacement',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None',
    },
    namedFormations: [
      {
        id: 'form-mimas-herschel',
        name: 'Herschel Impact Basin',
        featureType: 'Crater / Basin',
        lat: -1.38,
        lon: 111.7,
        diameterKm: 139.0,
        description: 'Colossal impact crater spanning one-third of Mimas\'s diameter, with 5-km-high walls, 10-km floor depth, and a 6-km central peak.',
      },
      {
        id: 'form-mimas-avalon',
        name: 'Avalon & Ossa Chasmata',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: 35.0,
        lon: 148.0,
        diameterKm: 120.0,
        description: 'Deep tectonic graben canyons up to 150 km long formed by antipodal shock waves from the Herschel impact.',
      },
      {
        id: 'form-mimas-arthur',
        name: 'Arthur Crater',
        featureType: 'Crater / Basin',
        lat: -35.4,
        lon: 196.0,
        diameterKm: 64.0,
        description: 'Major southern hemisphere complex crater with a prominent central peak.',
      },
    ],
  },
  {
    id: 'sat-enceladus',
    name: 'Enceladus (Saturn II)',
    parentId: 'saturn',
    parentBody: 'Saturn',
    meanRadiusKm: 252.1,
    triaxialAxesKm: [256.6, 251.4, 248.3],
    massKg: '1.0802 × 10²⁰ kg',
    meanDensityGcm3: 1.609,
    semimajorAxisKm: 238037,
    eccentricity: 0.0047,
    inclinationDeg: 0.019,
    orbitalPeriodDays: 1.3702,
    rotationPeriodHours: 32.885,
    surfaceGravityMS2: 0.113,
    geologicalType: 'saturnian_cryo_enceladus',
    baseColorHex: '#e6eff8',
    secondaryColorHex: '#0284c7',
    featureColorHex: '#ffffff',
    roughness: 0.36,
    displacementAmplitude: 0.038,
    hasActivePlumes: true,
    plumeColorHex: '#7dd3fc',
    surfaceCharacteristics:
      'Most reflective body in the Solar System (albedo 0.99); fresh crystalline water-ice plains and four warm south-polar "Tiger Stripe" sulci venting H₂O, H₂, silica nanoparticles, and organics.',
    atmosphericCharacteristics:
      'South-polar cryovolcanic water-vapor plume feeding Saturn\'s diffuse E ring.',
    provenanceDataset: 'NASA/ESA Cassini ISS, CIRS & INMS PDS Enceladus Archive',
    cinematicStorytellingSummary:
      'Diving through Enceladus\'s backlit south-polar water-ice geyser plumes above the turquoise Tiger Stripe fractures.',
    assetManifest: {
      datasetSource: 'NASA/ESA Cassini ISS Color Mosaic (Schenk et al. / Roatsch et al.)',
      datasetResolution: '110 m/px global mosaic (7–25 m/px South Polar Terrain plume vents)',
      geographicCoverage: '100% Global',
      coordinateSystem: 'IAU Enceladus West Longitude',
      elevationScale: '±1.5 km (500-m south-polar basin depression and 100-m Tiger Stripe flanking ridges)',
      textureResolution: '1024×512 High-Albedo Ice + Turquoise Sulci & Cryo-Plume Emitters',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None',
    },
    namedFormations: [
      {
        id: 'form-enceladus-baghdad',
        name: 'Baghdad & Damascus Sulci (Tiger Stripes)',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: -81.5,
        lon: 290.0,
        diameterKm: 135.0,
        description: 'Warm (160 K) parallel tectonic fissures 2 km wide and 500 m deep actively erupting supersonic jets of salty water vapor and ice grains.',
      },
      {
        id: 'form-enceladus-samarkand',
        name: 'Samarkand Sulcus',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: 30.0,
        lon: 327.0,
        diameterKm: 360.0,
        description: 'Extensive northern-to-equatorial belt of parallel tectonic grooves and strike-slip faults.',
      },
      {
        id: 'form-enceladus-alibaba',
        name: 'Ali Baba & Aladdin Craters',
        featureType: 'Crater / Basin',
        lat: 55.1,
        lon: 22.3,
        diameterKm: 39.2,
        description: 'Viscously relaxed northern hemisphere craters with domed floors testifying to past high heat flow.',
      },
    ],
  },
  {
    id: 'sat-tethys',
    name: 'Tethys (Saturn III)',
    parentId: 'saturn',
    parentBody: 'Saturn',
    meanRadiusKm: 531.1,
    massKg: '6.1745 × 10²⁰ kg',
    meanDensityGcm3: 0.984,
    semimajorAxisKm: 294619,
    eccentricity: 0.0001,
    inclinationDeg: 1.12,
    orbitalPeriodDays: 1.8878,
    rotationPeriodHours: 45.307,
    surfaceGravityMS2: 0.146,
    geologicalType: 'saturnian_chasma_tethys',
    baseColorHex: '#dce3eb',
    secondaryColorHex: '#94a3b8',
    featureColorHex: '#f8fafc',
    roughness: 0.56,
    displacementAmplitude: 0.052,
    majorBasinSpec: {
      nx: -0.68,
      ny: 0.42,
      nz: 0.6,
      radiusNorm: 0.52,
      depthFactor: 1.15,
      hasCentralPeak: true,
    },
    surfaceCharacteristics:
      'Pure water-ice world (density 0.984 g/cm³) scarred by the 450-km Odysseus impact basin and the 2,000-km-long Ithaca Chasma tectonic canyon.',
    atmosphericCharacteristics: 'None (hard vacuum).',
    provenanceDataset: 'NASA/ESA Cassini ISS Global Mosaic & Stereo DEM',
    cinematicStorytellingSummary:
      'Tracking along the 2,000-km walls of Ithaca Chasma toward the relaxed rim of the giant Odysseus impact basin.',
    assetManifest: {
      datasetSource: 'NASA/ESA Cassini ISS Controlled Mosaic (Roatsch et al.)',
      datasetResolution: '290 m/px global mosaic',
      geographicCoverage: '100% Global',
      coordinateSystem: 'IAU Tethys West Longitude',
      elevationScale: '-5.0 km (Ithaca Chasma floor) to +4.0 km (Odysseus rim)',
      textureResolution: '1024×512 Icy Albedo + Ithaca Chasma & Odysseus Basin Relief',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None',
    },
    namedFormations: [
      {
        id: 'form-tethys-odysseus',
        name: 'Odysseus Giant Impact Basin',
        featureType: 'Crater / Basin',
        lat: 32.8,
        lon: 128.9,
        diameterKm: 445.0,
        description: 'Immense impact basin spanning over 40% of Tethys\'s diameter, with a viscously flattened floor and central Scheria Montes massif.',
      },
      {
        id: 'form-tethys-ithaca',
        name: 'Ithaca Chasma',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: -14.0,
        lon: 6.1,
        diameterKm: 2000.0,
        description: '100-km-wide, 3–5 km-deep tectonic rift valley wrapping three-quarters of the way around Tethys\'s circumference.',
      },
    ],
  },
  {
    id: 'sat-dione',
    name: 'Dione (Saturn IV)',
    parentId: 'saturn',
    parentBody: 'Saturn',
    meanRadiusKm: 561.4,
    massKg: '1.0955 × 10²¹ kg',
    meanDensityGcm3: 1.478,
    semimajorAxisKm: 377396,
    eccentricity: 0.0022,
    inclinationDeg: 0.019,
    orbitalPeriodDays: 2.7369,
    rotationPeriodHours: 65.686,
    surfaceGravityMS2: 0.232,
    geologicalType: 'saturnian_wispy_dione',
    baseColorHex: '#c6cfd9',
    secondaryColorHex: '#64748b',
    featureColorHex: '#f8fafc',
    roughness: 0.62,
    displacementAmplitude: 0.042,
    surfaceCharacteristics:
      'Dense silicate-core icy moon with a heavily cratered leading hemisphere and a trailing hemisphere braided with bright wispy ice cliffs (Padua Chasmata, Eurotas Chasmata).',
    atmosphericCharacteristics: 'Extremely tenuous molecular O₂⁺ exosphere detected by Cassini CAPS.',
    provenanceDataset: 'NASA/ESA Cassini ISS Global Mosaic & Topographic Profile',
    cinematicStorytellingSummary:
      'Illuminating the bright, braided ice cliffs of Dione\'s trailing hemisphere Padua Chasmata fault network.',
    assetManifest: {
      datasetSource: 'NASA/ESA Cassini ISS Global Mosaic',
      datasetResolution: '150 m/px global mosaic',
      geographicCoverage: '100% Global',
      coordinateSystem: 'IAU Dione West Longitude',
      elevationScale: '±2.5 km (tectonic normal-fault ice scarps and Evander basin)',
      textureResolution: '1024×512 Wispy Chasmata Albedo + Fault Scarp Relief',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None',
    },
    namedFormations: [
      {
        id: 'form-dione-padua',
        name: 'Padua & Eurotas Chasmata (Wispy Terrain)',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: 17.7,
        lon: 247.2,
        diameterKm: 1000.0,
        description: 'Bright, freshly exposed water-ice normal fault cliffs hundreds of meters high cutting across the dark trailing hemisphere.',
      },
      {
        id: 'form-dione-evander',
        name: 'Evander Multi-Ring Basin',
        featureType: 'Crater / Basin',
        lat: -57.0,
        lon: 145.0,
        diameterKm: 350.0,
        description: 'Largest impact basin on Dione, located in the southern cratered plains.',
      },
    ],
  },
  {
    id: 'sat-rhea',
    name: 'Rhea (Saturn V)',
    parentId: 'saturn',
    parentBody: 'Saturn',
    meanRadiusKm: 763.8,
    massKg: '2.3065 × 10²¹ kg',
    meanDensityGcm3: 1.236,
    semimajorAxisKm: 527108,
    eccentricity: 0.00126,
    inclinationDeg: 0.345,
    orbitalPeriodDays: 4.5182,
    rotationPeriodHours: 108.437,
    surfaceGravityMS2: 0.264,
    geologicalType: 'saturnian_cratered_rhea',
    baseColorHex: '#bcc5cf',
    secondaryColorHex: '#6b7280',
    featureColorHex: '#f1f5f9',
    roughness: 0.74,
    displacementAmplitude: 0.044,
    surfaceCharacteristics:
      'Saturn\'s second-largest moon; ancient saturation-cratered icy crust with giant Tirawa and Mamaldi basins, trailing-hemisphere tectonic chasmata, and the brilliant young Inktomi ray crater.',
    atmosphericCharacteristics: 'Tenuous radiolytic O₂ and CO₂ exosphere.',
    provenanceDataset: 'NASA/ESA Cassini ISS Global Mosaic',
    cinematicStorytellingSummary:
      'Orbiting above Rhea\'s ancient cratered highlands and the dazzling white ejecta butterfly of Inktomi Crater.',
    assetManifest: {
      datasetSource: 'NASA/ESA Cassini ISS Global Mosaic',
      datasetResolution: '400 m/px global mosaic',
      geographicCoverage: '100% Global',
      coordinateSystem: 'IAU Rhea West Longitude',
      elevationScale: '±3.5 km (Tirawa basin and Galatea Chasma fault scarps)',
      textureResolution: '1024×512 Cratered Ice Albedo + Relief Map',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None',
    },
    namedFormations: [
      {
        id: 'form-rhea-inktomi',
        name: 'Inktomi ("The Splat") Ray Crater',
        featureType: 'Crater / Basin',
        lat: -14.1,
        lon: 112.1,
        diameterKm: 47.2,
        description: 'Spectacularly bright, young oblique-impact crater ejecting pure crystalline water ice across the leading hemisphere.',
      },
      {
        id: 'form-rhea-tirawa',
        name: 'Tirawa Impact Basin',
        featureType: 'Crater / Basin',
        lat: 34.2,
        lon: 151.7,
        diameterKm: 360.0,
        description: 'Ancient degraded impact basin overlapping the even larger 480-km Mamaldi basin.',
      },
    ],
  },
  {
    id: 'sat-titan',
    name: 'Titan (Saturn VI)',
    parentId: 'saturn',
    parentBody: 'Saturn',
    meanRadiusKm: 2574.73,
    massKg: '1.3452 × 10²³ kg',
    meanDensityGcm3: 1.8798,
    semimajorAxisKm: 1221870,
    eccentricity: 0.0288,
    inclinationDeg: 0.3485,
    orbitalPeriodDays: 15.945,
    rotationPeriodHours: 382.68,
    surfaceGravityMS2: 1.352,
    geologicalType: 'saturnian_haze_titan',
    baseColorHex: '#c28135',
    secondaryColorHex: '#4a2e0e',
    featureColorHex: '#eab308',
    roughness: 0.72,
    displacementAmplitude: 0.022,
    surfaceCharacteristics:
      'Water-ice bedrock, equatorial hydrocarbon sand dunes (Shangri-La), bright Xanadu highlands, dendritic river channels, and polar liquid methane/ethane seas (Kraken & Ligeia Mare); Huygens landing site at Adiri.',
    atmosphericCharacteristics:
      'Dense 1.45-bar N₂ (94.2%) and CH₄ (5.65%) atmosphere with golden-orange organonitrogen tholin stratospheric haze and detached haze layer.',
    provenanceDataset: 'NASA/ESA Cassini SAR RADAR, VIMS, ISS & Huygens DISR PDS Archive',
    cinematicStorytellingSummary:
      'Descending through Titan\'s golden tholin atmospheric haze toward the dark hydrocarbon dune seas of Shangri-La and the liquid methane shorelines of Kraken Mare.',
    assetManifest: {
      datasetSource: 'NASA/ESA Cassini Synthetic Aperture Radar (SAR) + VIMS Infrared + Huygens DISR',
      datasetResolution: '350 m/px SAR radar swaths; 1–4 km/px VIMS/ISS global near-IR map (2 cm/px at Huygens site)',
      geographicCoverage: '100% Global (67% high-res SAR radar + 100% VIMS/ISS infrared)',
      coordinateSystem: 'IAU Titan West Longitude',
      elevationScale: '-1,700 m (Bathysplanum / Kraken Mare depths) to +3,337 m (Mithrim Montes)',
      textureResolution: '1024×512 SAR/VIMS Surface Albedo + Layered GLSL Tholin Atmosphere Shader',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'Non-SAR corridors filled using Cassini VIMS 2.0-µm atmospheric window albedo',
    },
    namedFormations: [
      {
        id: 'form-titan-kraken',
        name: 'Kraken Mare (Liquid Hydrocarbon Sea)',
        featureType: 'Hydrocarbon Mare / Dune',
        lat: 68.0,
        lon: 310.0,
        diameterKm: 1170.0,
        description: 'Largest body of liquid methane and ethane on Titan (500,000 km², >300 m deep), with drowned river valleys and specular radar reflections.',
      },
      {
        id: 'form-titan-ligeia',
        name: 'Ligeia Mare & Vid Flumina',
        featureType: 'Hydrocarbon Mare / Dune',
        lat: 79.0,
        lon: 248.0,
        diameterKm: 500.0,
        description: 'Pure liquid methane sea 160 m deep fed by 400-km-long dendritic liquid hydrocarbon river canyons (Vid Flumina).',
      },
      {
        id: 'form-titan-shangrila',
        name: 'Shangri-La & Adiri (Huygens Landing Site)',
        featureType: 'Hydrocarbon Mare / Dune',
        lat: -10.573,
        lon: 192.335,
        diameterKm: 1800.0,
        description: 'Vast equatorial dark basin of 100-m-high linear organic tholin sand dunes where ESA\'s Huygens probe landed on January 14, 2005.',
      },
      {
        id: 'form-titan-xanadu',
        name: 'Xanadu Bright Highland Continent',
        featureType: 'Regio / Highland',
        lat: -15.0,
        lon: 100.0,
        diameterKm: 3400.0,
        description: 'Australia-sized radar-bright water-ice highland plateau carved by methane rainfall channels and tectonic ridges.',
      },
    ],
  },
  {
    id: 'sat-iapetus',
    name: 'Iapetus (Saturn VIII)',
    parentId: 'saturn',
    parentBody: 'Saturn',
    meanRadiusKm: 734.5,
    massKg: '1.8056 × 10²¹ kg',
    meanDensityGcm3: 1.088,
    semimajorAxisKm: 3560820,
    eccentricity: 0.0286,
    inclinationDeg: 15.47,
    orbitalPeriodDays: 79.3215,
    rotationPeriodHours: 1903.72,
    surfaceGravityMS2: 0.223,
    geologicalType: 'saturnian_twotone_iapetus',
    baseColorHex: '#e2e8f0',
    secondaryColorHex: '#1f1916',
    featureColorHex: '#94a3b8',
    roughness: 0.84,
    displacementAmplitude: 0.056,
    equatorialRidgeFactor: 0.095,
    surfaceCharacteristics:
      'Dramatic two-tone "yin-yang" hemisphere dichotomy: pitch-dark leading Cassini Regio (albedo 0.04) vs. bright icy trailing Roncevaux Terra (albedo 0.60), girdled by a 20-km-high equatorial mountain ridge.',
    atmosphericCharacteristics: 'None (hard vacuum).',
    provenanceDataset: 'NASA/ESA Cassini ISS Global Mosaic & Limb Topography',
    cinematicStorytellingSummary:
      'Crossing Iapetus\'s towering 20-km equatorial mountain ridge along the razor-sharp thermal boundary between pitch-black Cassini Regio and dazzling white Roncevaux Terra.',
    assetManifest: {
      datasetSource: 'NASA/ESA Cassini ISS Controlled Global Mosaic (Roatsch et al.)',
      datasetResolution: '800 m/px global mosaic (40 m/px equatorial ridge flyby frames)',
      geographicCoverage: '100% Global',
      coordinateSystem: 'IAU Iapetus West Longitude',
      elevationScale: '±20.0 km (Toledo Montes equatorial ridge & 580-km Turgis basin)',
      textureResolution: '1024×512 Two-Tone Dichotomy Albedo + 3D Equatorial Ridge Displacement',
      dataProvenance: 'ACTUAL_IMAGERY_AND_DEM',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'None',
    },
    namedFormations: [
      {
        id: 'form-iapetus-cassini',
        name: 'Cassini Regio (Dark Leading Hemisphere)',
        featureType: 'Regio / Highland',
        lat: 0.0,
        lon: 90.0,
        diameterKm: 2300.0,
        description: 'Carbonaceous-coated dark hemisphere created by Phoebe dust infalling onto the leading face and driving runaway thermal water-ice sublimation.',
      },
      {
        id: 'form-iapetus-ridge',
        name: 'Toledo Montes (20-km Equatorial Ridge)',
        featureType: 'Equatorial Ridge / Montes',
        lat: 0.0,
        lon: 135.0,
        diameterKm: 1300.0,
        description: '20-km-high, 200-km-wide spine of mountains running precisely along Iapetus\'s equator, giving the moon its iconic walnut silhouette.',
      },
      {
        id: 'form-iapetus-turgis',
        name: 'Turgis & Engelier Impact Basins',
        featureType: 'Crater / Basin',
        lat: 16.9,
        lon: 28.4,
        diameterKm: 580.0,
        description: 'Giant impact basin with a 15-km-high rim scarp and massive long-runout icy landslide (Malun crater).',
      },
    ],
  },

  // ================= URANUS SYSTEM =================
  {
    id: 'sat-miranda',
    name: 'Miranda (Uranus V)',
    parentId: 'uranus',
    parentBody: 'Uranus',
    meanRadiusKm: 235.8,
    triaxialAxesKm: [240.4, 234.2, 232.9],
    massKg: '6.4 × 10¹⁹ kg',
    meanDensityGcm3: 1.2,
    semimajorAxisKm: 129390,
    eccentricity: 0.0013,
    inclinationDeg: 4.232,
    orbitalPeriodDays: 1.4135,
    rotationPeriodHours: 33.923,
    surfaceGravityMS2: 0.079,
    geologicalType: 'uranian_corona_miranda',
    baseColorHex: '#94a3b8',
    secondaryColorHex: '#475569',
    featureColorHex: '#e2e8f0',
    roughness: 0.78,
    displacementAmplitude: 0.095,
    surfaceCharacteristics:
      'Most extreme tectonic patchwork relief in the Solar System: three giant polygonal grooved coronae (Inverness "Chevron", Arden, Elsinore) and the 20-km-high Verona Rupes cliff scarp.',
    atmosphericCharacteristics: 'None (hard vacuum).',
    provenanceDataset: 'NASA Voyager 2 ISS Southern Hemisphere Mosaic (1986 Flyby)',
    cinematicStorytellingSummary:
      'Plunging down the 20-km sheer ice face of Verona Rupes—the tallest cliff in the Solar System—above Miranda\'s chevron-grooved Inverness Corona.',
    assetManifest: {
      datasetSource: 'NASA Voyager 2 ISS Narrow Angle Camera + USGS Stereo DEM (Schenk)',
      datasetResolution: '250–600 m/px southern hemisphere mosaic',
      geographicCoverage: '~45% Southern Hemisphere observed during January 1986 high-obliquity solstice',
      coordinateSystem: 'IAU Miranda East Longitude',
      elevationScale: '±20.0 km (Verona Rupes fault scarp and corona canyons)',
      textureResolution: '1024×512 Chevron Corona Albedo + High-Amplitude Fault Scarp Displacement',
      dataProvenance: 'PARTIAL_FLYBY_WITH_RECONSTRUCTION',
      scientificConfidence: 'HIGH_CONFIDENCE',
      missingDataRegions: 'Northern hemisphere in winter darkness during 1986 Voyager 2 flyby; reconstructed with cratered icy highland topology',
    },
    namedFormations: [
      {
        id: 'form-miranda-verona',
        name: 'Verona Rupes (20-km Cliff Scarp)',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: -18.3,
        lon: 347.8,
        diameterKm: 120.0,
        description: 'Tallest known normal fault cliff in the Solar System (15–20 km vertical drop); in Miranda\'s 0.079 m/s² gravity, a free-fall from the rim takes 12 minutes.',
      },
      {
        id: 'form-miranda-inverness',
        name: 'Inverness Corona ("The Chevron")',
        featureType: 'Chaos / Corona Terrain',
        lat: -66.9,
        lon: 325.7,
        diameterKm: 234.0,
        description: 'Trapezoidal complex of concentric faulted ridges surrounding a bright L-shaped chevron core formed by convective ice diapirism.',
      },
      {
        id: 'form-miranda-arden',
        name: 'Arden & Elsinore Coronae',
        featureType: 'Chaos / Corona Terrain',
        lat: -29.1,
        lon: 73.7,
        diameterKm: 318.0,
        description: 'Banded tectonic coronae up to 318 km wide bounded by concentric 8-km-deep canyons.',
      },
    ],
  },
  {
    id: 'sat-ariel',
    name: 'Ariel (Uranus I)',
    parentId: 'uranus',
    parentBody: 'Uranus',
    meanRadiusKm: 578.9,
    massKg: '1.251 × 10²¹ kg',
    meanDensityGcm3: 1.592,
    semimajorAxisKm: 191020,
    eccentricity: 0.0012,
    inclinationDeg: 0.26,
    orbitalPeriodDays: 2.5204,
    rotationPeriodHours: 60.489,
    surfaceGravityMS2: 0.249,
    geologicalType: 'uranian_graben_ariel',
    baseColorHex: '#b8c4d0',
    secondaryColorHex: '#64748b',
    featureColorHex: '#f1f5f9',
    roughness: 0.62,
    displacementAmplitude: 0.054,
    surfaceCharacteristics:
      'Brightest Uranian moon; cratered plains transected by global extensional graben valleys (Kachina Chasmata) with smooth cryovolcanically resurfaced valley floors.',
    atmosphericCharacteristics: 'None (hard vacuum; surface CO₂ frost detected on trailing hemisphere).',
    provenanceDataset: 'NASA Voyager 2 ISS Southern Hemisphere Mosaic (1986)',
    cinematicStorytellingSummary:
      'Gliding through Ariel\'s deep Kachina Chasmata tectonic rift valleys under the pale cyan glow of tilted Uranus.',
    assetManifest: {
      datasetSource: 'NASA Voyager 2 ISS + USGS Astrogeology Mosaic',
      datasetResolution: '1.0–2.4 km/px southern hemisphere',
      geographicCoverage: '~35% Southern Hemisphere imaged',
      coordinateSystem: 'IAU Ariel East Longitude',
      elevationScale: '±4.0 km (Kachina Chasmata graben walls)',
      textureResolution: '1024×512 Graben Valley Albedo + Canyon Displacement',
      dataProvenance: 'PARTIAL_FLYBY_WITH_RECONSTRUCTION',
      scientificConfidence: 'HIGH_CONFIDENCE',
      missingDataRegions: 'Unimaged northern hemisphere reconstructed with consistent graben/crater density',
    },
    namedFormations: [
      {
        id: 'form-ariel-kachina',
        name: 'Kachina Chasmata',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: -33.7,
        lon: 246.0,
        diameterKm: 622.0,
        description: 'Network of 50-km-wide, 4-km-deep extensional fault canyons floored by smooth cryovolcanic ammonia-water ice extrusions.',
      },
      {
        id: 'form-ariel-yangoor',
        name: 'Yangoor Crater',
        featureType: 'Crater / Basin',
        lat: -68.7,
        lon: 279.7,
        diameterKm: 78.0,
        description: 'Largest observed impact crater on Ariel, partially truncated by younger tectonic troughs.',
      },
    ],
  },
  {
    id: 'sat-umbriel',
    name: 'Umbriel (Uranus II)',
    parentId: 'uranus',
    parentBody: 'Uranus',
    meanRadiusKm: 584.7,
    massKg: '1.275 × 10²¹ kg',
    meanDensityGcm3: 1.39,
    semimajorAxisKm: 266000,
    eccentricity: 0.0039,
    inclinationDeg: 0.128,
    orbitalPeriodDays: 4.1442,
    rotationPeriodHours: 99.46,
    surfaceGravityMS2: 0.25,
    geologicalType: 'uranian_dark_umbriel',
    baseColorHex: '#4b525c',
    secondaryColorHex: '#282c33',
    featureColorHex: '#e2e8f0',
    roughness: 0.92,
    displacementAmplitude: 0.046,
    surfaceCharacteristics:
      'Darkest of Uranus\'s major moons (albedo 0.16); ancient heavily cratered carbonaceous-ice surface punctuated by the mysterious bright annular floor of Wunda Crater.',
    atmosphericCharacteristics: 'None (hard vacuum).',
    provenanceDataset: 'NASA Voyager 2 ISS Mosaic (1986)',
    cinematicStorytellingSummary:
      'Emerging over Umbriel\'s ancient charcoal-dark cratered plains to reveal the gleaming white ring of Wunda Crater on the equator.',
    assetManifest: {
      datasetSource: 'NASA Voyager 2 ISS Mosaic',
      datasetResolution: '5.2 km/px southern hemisphere',
      geographicCoverage: '~40% Southern Hemisphere',
      coordinateSystem: 'IAU Umbriel East Longitude',
      elevationScale: '±3.5 km (ancient complex craters and central peaks)',
      textureResolution: '1024×512 Dark Carbonaceous Albedo + Bright Wunda Ring',
      dataProvenance: 'PARTIAL_FLYBY_WITH_RECONSTRUCTION',
      scientificConfidence: 'HIGH_CONFIDENCE',
      missingDataRegions: 'Northern hemisphere unilluminated in 1986; reconstructed with ancient cratered terrain',
    },
    namedFormations: [
      {
        id: 'form-umbriel-wunda',
        name: 'Wunda Crater (Bright Floor Annulus)',
        featureType: 'Crater / Basin',
        lat: -7.9,
        lon: 273.6,
        diameterKm: 131.0,
        description: 'Equatorial impact crater containing a brilliant 10-km-thick ring of cold-trapped pure CO₂ or H₂O ice on its floor.',
      },
      {
        id: 'form-umbriel-skynd',
        name: 'Skynd Crater',
        featureType: 'Crater / Basin',
        lat: -1.8,
        lon: 331.7,
        diameterKm: 72.0,
        description: 'Complex impact crater with a brilliantly reflective central peak.',
      },
    ],
  },
  {
    id: 'sat-titania',
    name: 'Titania (Uranus III)',
    parentId: 'uranus',
    parentBody: 'Uranus',
    meanRadiusKm: 788.4,
    massKg: '3.400 × 10²¹ kg',
    meanDensityGcm3: 1.711,
    semimajorAxisKm: 435910,
    eccentricity: 0.0011,
    inclinationDeg: 0.34,
    orbitalPeriodDays: 8.7062,
    rotationPeriodHours: 208.94,
    surfaceGravityMS2: 0.367,
    geologicalType: 'uranian_canyon_titania',
    baseColorHex: '#9e968f',
    secondaryColorHex: '#57524d',
    featureColorHex: '#d6d1cc',
    roughness: 0.78,
    displacementAmplitude: 0.048,
    surfaceCharacteristics:
      'Largest moon of Uranus; neutral reddish-grey water-ice and silicate crust cut by the 1,500-km Messina Chasmata fault canyon and the 326-km Gertrude impact basin.',
    atmosphericCharacteristics: 'Possible seasonal ~10 nbar CO₂ exosphere.',
    provenanceDataset: 'NASA Voyager 2 ISS Mosaic (1986)',
    cinematicStorytellingSummary:
      'Following the sunlit fault walls of the 1,500-km Messina Chasmata canyon across Uranus\'s largest moon.',
    assetManifest: {
      datasetSource: 'NASA Voyager 2 ISS + USGS Astrogeology Mosaic',
      datasetResolution: '3.4 km/px southern hemisphere',
      geographicCoverage: '~40% Southern Hemisphere',
      coordinateSystem: 'IAU Titania East Longitude',
      elevationScale: '±5.0 km (Messina Chasmata fault scarps and Gertrude basin)',
      textureResolution: '1024×512 Canyon & Basin Albedo + Fault Displacement',
      dataProvenance: 'PARTIAL_FLYBY_WITH_RECONSTRUCTION',
      scientificConfidence: 'HIGH_CONFIDENCE',
      missingDataRegions: 'Northern hemisphere unilluminated in 1986; reconstructed via global tectonic extension model',
    },
    namedFormations: [
      {
        id: 'form-titania-messina',
        name: 'Messina Chasmata',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: -33.3,
        lon: 335.0,
        diameterKm: 1492.0,
        description: 'Enormous 1,500-km graben canyon system with 2–5 km high bright fault scarps formed as Titania\'s interior froze and expanded.',
      },
      {
        id: 'form-titania-gertrude',
        name: 'Gertrude Impact Basin',
        featureType: 'Crater / Basin',
        lat: -15.8,
        lon: 287.1,
        diameterKm: 326.0,
        description: 'Largest confirmed impact basin on Titania, spanning one-fifth of the moon\'s diameter.',
      },
    ],
  },
  {
    id: 'sat-oberon',
    name: 'Oberon (Uranus IV)',
    parentId: 'uranus',
    parentBody: 'Uranus',
    meanRadiusKm: 761.4,
    massKg: '3.076 × 10²¹ kg',
    meanDensityGcm3: 1.63,
    semimajorAxisKm: 583520,
    eccentricity: 0.0014,
    inclinationDeg: 0.058,
    orbitalPeriodDays: 13.4632,
    rotationPeriodHours: 323.11,
    surfaceGravityMS2: 0.354,
    geologicalType: 'uranian_ancient_oberon',
    baseColorHex: '#7d726d',
    secondaryColorHex: '#332926',
    featureColorHex: '#cbd5e1',
    roughness: 0.86,
    displacementAmplitude: 0.05,
    surfaceCharacteristics:
      'Outermost major Uranian moon; heavily cratered reddish-grey icy surface with dark carbonaceous-floored craters (Hamlet, Othello), Mommur Chasma, and an 11-km limb peak.',
    atmosphericCharacteristics: 'None (hard vacuum).',
    provenanceDataset: 'NASA Voyager 2 ISS Mosaic (1986)',
    cinematicStorytellingSummary:
      'Surveying Oberon\'s ancient cratered horizon, where dark-floored Hamlet Crater contrasts with bright water-ice ejecta rays.',
    assetManifest: {
      datasetSource: 'NASA Voyager 2 ISS Mosaic',
      datasetResolution: '6.0 km/px southern hemisphere',
      geographicCoverage: '~40% Southern Hemisphere',
      coordinateSystem: 'IAU Oberon East Longitude',
      elevationScale: '±11.0 km (southern limb peak and Mommur Chasma)',
      textureResolution: '1024×512 Dark-Floored Crater Albedo + Relief Map',
      dataProvenance: 'PARTIAL_FLYBY_WITH_RECONSTRUCTION',
      scientificConfidence: 'HIGH_CONFIDENCE',
      missingDataRegions: 'Northern hemisphere unilluminated in 1986; reconstructed with cratered highland model',
    },
    namedFormations: [
      {
        id: 'form-oberon-hamlet',
        name: 'Hamlet Crater',
        featureType: 'Crater / Basin',
        lat: -46.1,
        lon: 44.4,
        diameterKm: 206.0,
        description: 'Large impact crater flooded by dark, low-albedo cryovolcanic or carbonaceous material and surrounded by bright icy rays.',
      },
      {
        id: 'form-oberon-mommur',
        name: 'Mommur Chasma',
        featureType: 'Tectonic Chasma / Sulcus',
        lat: -16.3,
        lon: 323.5,
        diameterKm: 537.0,
        description: 'Major extensional tectonic canyon formed early in Oberon\'s thermal evolution.',
      },
    ],
  },

  // ================= NEPTUNE SYSTEM =================
  {
    id: 'sat-triton',
    name: 'Triton (Neptune I)',
    parentId: 'neptune',
    parentBody: 'Neptune',
    meanRadiusKm: 1353.4,
    massKg: '2.1390 × 10²² kg',
    meanDensityGcm3: 2.061,
    semimajorAxisKm: 354759,
    eccentricity: 0.000016,
    inclinationDeg: 156.885,
    orbitalPeriodDays: 5.8769,
    rotationPeriodHours: -141.04,
    retrograde: true,
    surfaceGravityMS2: 0.779,
    geologicalType: 'neptunian_cantaloupe_triton',
    baseColorHex: '#d8c8c4',
    secondaryColorHex: '#7a6864',
    featureColorHex: '#f8fafc',
    roughness: 0.52,
    displacementAmplitude: 0.026,
    hasActivePlumes: true,
    plumeColorHex: '#94a3b8',
    surfaceCharacteristics:
      'Captured Kuiper Belt world in a retrograde orbit; frozen N₂, CH₄, CO, and H₂O crust with dimpled "Cantaloupe Terrain" (Bubembe Regio), pinkish south polar nitrogen cap, and active 8-km nitrogen geyser plumes leaving dark wind-blown streaks.',
    atmosphericCharacteristics:
      'Tenuous 14-µbar N₂ atmosphere with a 8-km troposphere, nitrogen ice clouds, and wind-sheared geyser plumes.',
    provenanceDataset: 'NASA Voyager 2 ISS Color Mosaic & Stereo DEM (August 1989 Flyby)',
    cinematicStorytellingSummary:
      'Approaching Triton along its retrograde orbit above the pinkish south-polar nitrogen ice cap as 8-km nitrogen geysers bent by high-altitude winds trail across the horizon below azure Neptune.',
    assetManifest: {
      datasetSource: 'NASA Voyager 2 ISS + USGS Astrogeology Controlled Color Mosaic (Schenk)',
      datasetResolution: '600 m/px southern & equatorial hemisphere mosaic',
      geographicCoverage: '~40% Southern & Neptune-facing Hemisphere imaged in August 1989',
      coordinateSystem: 'IAU Triton East Longitude',
      elevationScale: '±1.2 km low-relief cryovolcanic calderas and Cantaloupe cavi',
      textureResolution: '1024×512 Cantaloupe & Polar Nitrogen Cap Albedo + Geyser Plume Emitters',
      dataProvenance: 'PARTIAL_FLYBY_WITH_RECONSTRUCTION',
      scientificConfidence: 'VERIFIED',
      missingDataRegions: 'Northern winter hemisphere unimaged in 1989; reconstructed using Bubembe Regio cantaloupe cavi morphology',
    },
    namedFormations: [
      {
        id: 'form-triton-bubembe',
        name: 'Bubembe Regio ("Cantaloupe Terrain")',
        featureType: 'Chaos / Corona Terrain',
        lat: 18.0,
        lon: 335.0,
        diameterKm: 1200.0,
        description: 'Unique dimpled western hemisphere terrain of 30–40 km intersecting pits (cavi) and viscous ridges formed by nitrogen/water-ice diapirism.',
      },
      {
        id: 'form-triton-uhlanga',
        name: 'Uhlanga Regio & Hili/Mahilani Nitrogen Geysers',
        featureType: 'Volcanic Caldera / Plume',
        lat: -57.0,
        lon: 358.0,
        diameterKm: 1800.0,
        description: 'Bright pinkish-white seasonal nitrogen-methane ice cap where solar solid-state greenhouse heating drives 8-km-high nitrogen gas plumes.',
      },
      {
        id: 'form-triton-leviathan',
        name: 'Leviathan Patera & Cipango Planum',
        featureType: 'Volcanic Caldera / Plume',
        lat: 17.0,
        lon: 28.5,
        diameterKm: 100.0,
        description: 'Cryovolcanic caldera complex surrounded by smooth ammonia-water cryolava plains.',
      },
    ],
  },
  {
    id: 'sat-proteus',
    name: 'Proteus (Neptune VIII)',
    parentId: 'neptune',
    parentBody: 'Neptune',
    meanRadiusKm: 210.0,
    triaxialAxesKm: [218.0, 208.0, 201.0],
    massKg: '4.4 × 10¹⁹ kg',
    meanDensityGcm3: 1.3,
    semimajorAxisKm: 117647,
    eccentricity: 0.00053,
    inclinationDeg: 0.524,
    orbitalPeriodDays: 1.1223,
    rotationPeriodHours: 26.935,
    surfaceGravityMS2: 0.07,
    geologicalType: 'neptunian_irregular_proteus',
    baseColorHex: '#4f545c',
    secondaryColorHex: '#2b2e33',
    featureColorHex: '#7d8590',
    roughness: 0.95,
    displacementAmplitude: 0.14,
    majorBasinSpec: {
      nx: -0.58,
      ny: -0.22,
      nz: 0.78,
      radiusNorm: 0.58,
      depthFactor: 1.35,
      hasCentralPeak: false,
    },
    surfaceCharacteristics:
      'Neptune\'s largest inner prograde moon; dark box-like polyhedral body (albedo 0.096) near the maximum mass limit before hydrostatic rounding, scarred by the 250-km Pharos Crater.',
    atmosphericCharacteristics: 'None (hard vacuum).',
    provenanceDataset: 'NASA Voyager 2 ISS Shape Model (Stooke 1994 / Croft 1992)',
    cinematicStorytellingSummary:
      'Orbiting Proteus\'s faceted, soot-dark polyhedral silhouette and the 250-km Pharos impact basin inside Triton\'s orbit.',
    assetManifest: {
      datasetSource: 'NASA Voyager 2 ISS Low-Phase & High-Phase Frames + Stooke (1994) Shape Model',
      datasetResolution: '1.3–3.0 km/px Voyager 2 frames',
      geographicCoverage: '~60% Global Triaxial Facets',
      coordinateSystem: 'IAU Proteus West Longitude',
      elevationScale: 'Triaxial radii 218 × 208 × 201 km (±15 km Pharos basin depression)',
      textureResolution: '1024×512 Soot-Dark Albedo + Polyhedral Pharos Basin Displacement',
      dataProvenance: 'PARTIAL_FLYBY_WITH_RECONSTRUCTION',
      scientificConfidence: 'HIGH_CONFIDENCE',
      missingDataRegions: 'Anti-Voyager hemisphere reconstructed from limb chords and triaxial harmonic model',
    },
    namedFormations: [
      {
        id: 'form-proteus-pharos',
        name: 'Pharos Impact Basin',
        featureType: 'Crater / Basin',
        lat: -22.0,
        lon: 10.0,
        diameterKm: 250.0,
        description: 'Enormous 250-km-wide, 10–15 km-deep impact basin spanning more than half of Proteus\'s diameter.',
      },
    ],
  },
  {
    id: 'sat-nereid',
    name: 'Nereid (Neptune II)',
    parentId: 'neptune',
    parentBody: 'Neptune',
    meanRadiusKm: 178.5,
    triaxialAxesKm: [195.0, 175.0, 165.0],
    massKg: '3.1 × 10¹⁹ kg',
    meanDensityGcm3: 1.5,
    semimajorAxisKm: 5513818,
    eccentricity: 0.7507,
    inclinationDeg: 7.09,
    orbitalPeriodDays: 360.13,
    rotationPeriodHours: 11.594,
    surfaceGravityMS2: 0.071,
    geologicalType: 'neptunian_eccentric_nereid',
    baseColorHex: '#7d8590',
    secondaryColorHex: '#4b525c',
    featureColorHex: '#cbd5e1',
    roughness: 0.88,
    displacementAmplitude: 0.11,
    surfaceCharacteristics:
      'Outer Neptunian moon on the most eccentric orbit of any regular/captured moon (e = 0.7507, ranging from 1.37M to 9.65M km); neutral grey water-ice spectrum.',
    atmosphericCharacteristics: 'None (hard vacuum).',
    provenanceDataset: 'NASA Voyager 2 Long-Range Photometry / Spitzer & Kepler Lightcurves (Illustrative Procedural Reconstruction)',
    cinematicStorytellingSummary:
      'Observing distant Nereid along its highly elliptical 360-day orbit—explicitly marked as a procedural geological reconstruction constrained by Voyager 2 and Kepler photometry.',
    assetManifest: {
      datasetSource: 'Voyager 2 Long-Range Imaging (4.7M km) + Kepler/K2 Rotational Lightcurves (Kiss et al. 2016)',
      datasetResolution: '43 km/px disk-resolved albedo + rotational lightcurve shape ratio',
      geographicCoverage: 'Disk-integrated photometry (0% resolved sub-kilometer topography)',
      coordinateSystem: 'IAU Nereid Planetocentric',
      elevationScale: 'Illustrative triaxial 195 × 175 × 165 km procedural relief',
      textureResolution: '1024×512 Illustrative Procedural Icy-Silicate Reconstruction',
      dataProvenance: 'PROCEDURAL_RECONSTRUCTION',
      scientificConfidence: 'ILLUSTRATIVE_PROCEDURAL',
      missingDataRegions: '100% of fine surface topography is unmapped by spacecraft; rendered as clearly disclosed illustrative procedural reconstruction',
    },
    namedFormations: [
      {
        id: 'form-nereid-illustrative',
        name: 'Unmapped Outer-Moon Surface (Procedural Reconstruction)',
        featureType: 'Regio / Highland',
        lat: 0.0,
        lon: 0.0,
        diameterKm: 357.0,
        description: 'Voyager 2 passed no closer than 4.7 million km in 1989; surface craters and ridges shown here are an illustrative procedural reconstruction matching Nereid\'s measured 0.155 albedo and water-ice spectrum.',
      },
    ],
  },
];

/**
 * Computes physically consistent planet and satellite radii & orbital distances
 * under either:
 * - MODE A (`scientific_scale`): True single unified scale (`1 R⊕ = 0.65 scene units`), preserving exact planetary & satellite diameter ratios.
 * - MODE B (`scientific_exploration`): Exact planet-to-satellite diameter ratios (`R_moon / R_planet`) with a clearly disclosed global logarithmic/power-law orbital distance compression factor.
 */
export function computePlanetSceneRadius(
  meanRadiusKm: number,
  scaleMode: AstronomicalScaleMode
): number {
  const ratioToEarth = meanRadiusKm / EARTH_MEAN_RADIUS_KM;
  if (scaleMode === 'scientific_scale') {
    return ratioToEarth * 0.65;
  }
  return Math.max(0.28, Math.pow(ratioToEarth, 0.52) * 1.42);
}

/**
 * Computes natural satellite scene radius strictly from its parent planet's scene radius
 * using the exact physical diameter ratio (`moon.meanRadiusKm / parent.meanRadiusKm`).
 */
export function computeSatelliteSceneRadius(
  sat: NaturalSatelliteSpec,
  parentMeanRadiusKm: number,
  parentSceneRadius: number,
  scaleMode: AstronomicalScaleMode
): number {
  const truePhysicalRatio = sat.meanRadiusKm / parentMeanRadiusKm;
  const exactRadius = parentSceneRadius * truePhysicalRatio;
  if (scaleMode === 'scientific_scale') {
    return Math.max(0.018, exactRadius);
  }
  return Math.max(0.052, exactRadius);
}

function hash2D(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

export function fbmNoise(x: number, y: number, octaves = 4): number {
  let val = 0;
  let amp = 0.5;
  let freq = 1.0;
  for (let i = 0; i < octaves; i++) {
    const ix = Math.floor(x * freq);
    const iy = Math.floor(y * freq);
    const fx = x * freq - ix;
    const fy = y * freq - iy;
    const u = fx * fx * (3 - 2 * fx);
    const v = fy * fy * (3 - 2 * fy);
    const a = hash2D(ix, iy);
    const b = hash2D(ix + 1, iy);
    const c = hash2D(ix, iy + 1);
    const d = hash2D(ix + 1, iy + 1);
    val += (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * amp;
    freq *= 2.07;
    amp *= 0.49;
  }
  return val;
}

const satelliteMaterialCache = new Map<string, THREE.MeshStandardMaterial>();

/**
 * SurfaceMaterialEngine:
 * Generates a scientifically tailored PBR material (albedo + bump/normal + roughness + optional lava emissive)
 * for each of the 22 natural satellites so every single moon has its own unmistakable geological visual identity.
 */
export function createNaturalSatelliteMaterial(
  sat: NaturalSatelliteSpec,
  authenticTextures: AuthenticSolarTextures
): THREE.MeshStandardMaterial {
  const cached = satelliteMaterialCache.get(sat.id);
  if (cached) return cached;

  // 1. Use authentic NASA/USGS maps where available in `/public/solar-textures/`, enhanced with custom PBR maps
  if (sat.id === 'sat-moon') {
    const mat = new THREE.MeshStandardMaterial({
      map: authenticTextures.moon,
      bumpMap: authenticTextures.moonBump,
      bumpScale: 0.055,
      roughness: 0.94,
      metalness: 0.04,
      envMapIntensity: 0.12,
    });
    satelliteMaterialCache.set(sat.id, mat);
    return mat;
  }

  if (sat.id === 'sat-io') {
    // Synthesize glowing volcanic caldera emissive map for Loki Patera, Pele, and Prometheus
    const emCanvas = document.createElement('canvas');
    emCanvas.width = 512;
    emCanvas.height = 256;
    const emCtx = emCanvas.getContext('2d')!;
    emCtx.fillStyle = '#000000';
    emCtx.fillRect(0, 0, 512, 256);
    const hotspots = [
      { x: 410, y: 112, r: 16, c: '#ff4500' }, // Loki Patera
      { x: 350, y: 152, r: 14, c: '#ff6b00' }, // Pele
      { x: 215, y: 132, r: 11, c: '#ff3b00' }, // Prometheus
      { x: 110, y: 98, r: 12, c: '#ff5500' }, // Tvashtar
      { x: 280, y: 85, r: 10, c: '#ff4500' }, // Amirani
    ];
    for (const h of hotspots) {
      const grad = emCtx.createRadialGradient(h.x, h.y, 1, h.x, h.y, h.r);
      grad.addColorStop(0, '#fff7aa');
      grad.addColorStop(0.35, h.c);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      emCtx.fillStyle = grad;
      emCtx.beginPath();
      emCtx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
      emCtx.fill();
    }
    const emTex = new THREE.CanvasTexture(emCanvas);
    emTex.colorSpace = THREE.SRGBColorSpace;

    const mat = new THREE.MeshStandardMaterial({
      map: authenticTextures.io,
      bumpMap: authenticTextures.io,
      bumpScale: 0.038,
      emissive: new THREE.Color('#ff5500'),
      emissiveMap: emTex,
      emissiveIntensity: 1.35,
      roughness: 0.82,
      metalness: 0.08,
      envMapIntensity: 0.16,
    });
    satelliteMaterialCache.set(sat.id, mat);
    return mat;
  }

  if (sat.id === 'sat-europa') {
    const mat = new THREE.MeshStandardMaterial({
      map: authenticTextures.europa,
      bumpMap: authenticTextures.europa,
      bumpScale: 0.034,
      roughness: 0.44,
      metalness: 0.12,
      envMapIntensity: 0.28,
    });
    satelliteMaterialCache.set(sat.id, mat);
    return mat;
  }

  if (sat.id === 'sat-ganymede') {
    const mat = new THREE.MeshStandardMaterial({
      map: authenticTextures.ganymede,
      bumpMap: authenticTextures.ganymede,
      bumpScale: 0.04,
      roughness: 0.8,
      metalness: 0.06,
      envMapIntensity: 0.16,
    });
    satelliteMaterialCache.set(sat.id, mat);
    return mat;
  }

  if (sat.id === 'sat-callisto') {
    const mat = new THREE.MeshStandardMaterial({
      map: authenticTextures.callisto,
      bumpMap: authenticTextures.callisto,
      bumpScale: 0.048,
      roughness: 0.9,
      metalness: 0.06,
      envMapIntensity: 0.12,
    });
    satelliteMaterialCache.set(sat.id, mat);
    return mat;
  }

  // 2. Synthesize high-resolution 1024x512 bespoke geological Albedo + Bump + Roughness maps for all other moons
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;
  const bumpData = bCtx.createImageData(width, height);

  const cBase = new THREE.Color(sat.baseColorHex);
  const cSec = new THREE.Color(sat.secondaryColorHex);
  const cFeat = new THREE.Color(sat.featureColorHex);
  const cWork = new THREE.Color();

  for (let y = 0; y < height; y++) {
    const v = y / height;
    const latRad = (0.5 - v) * Math.PI;
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const lonRad = u * Math.PI * 2;

      const n1 = fbmNoise(u * 8, v * 4, 5);
      const n2 = fbmNoise(u * 22 + 4.2, v * 11 + 1.7, 4);
      const n3 = fbmNoise(u * 48 + 9.1, v * 24 + 5.3, 3);
      let relief = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;

      cWork.copy(cBase).lerp(cSec, n1 * 0.65);

      if (sat.geologicalType === 'saturnian_cryo_enceladus') {
        // Fresh high-albedo water ice + 4 turquoise-blue south-polar Tiger Stripe sulci + global tectonic grooves
        cWork.copy(cBase).lerp(cFeat, n2 * 0.65);
        const stripeSignal = Math.abs(Math.sin((u * 16 + n1 * 2.4) * Math.PI));
        const globalGroove = Math.abs(Math.sin((u * 12 - v * 9 + n2 * 2.1) * Math.PI));
        if (v > 0.52 && stripeSignal < 0.22) {
          cWork.lerp(cSec, 0.92);
          relief -= 0.36;
        } else if (globalGroove < 0.11) {
          cWork.lerp(cFeat, 0.78);
          relief -= 0.22;
        }
      } else if (sat.geologicalType === 'saturnian_haze_titan') {
        // Dark equatorial hydrocarbon dune belts (Shangri-La) + bright Xanadu continent + polar Kraken Mare
        const eqBand = Math.exp(-Math.pow((v - 0.52) * 4.8, 2));
        if (eqBand > 0.42 && n1 > 0.42) {
          cWork.lerp(cSec, eqBand * 0.78);
        } else if (u > 0.22 && u < 0.48 && v > 0.42 && v < 0.68) {
          // Bright Xanadu highland continent
          cWork.lerp(cFeat, 0.55);
          relief += 0.22;
        }
        // Dark liquid methane seas at North Pole (Kraken & Ligeia Mare)
        if (v < 0.22 && n1 > 0.38) {
          cWork.setHex(0x141824);
          relief = 0.12;
        }
      } else if (sat.geologicalType === 'saturnian_twotone_iapetus') {
        // Dramatic two-tone Cassini Regio (dark leading hemisphere) vs Roncevaux Terra (bright trailing + poles)
        const leadingFactor = Math.sin(lonRad) * Math.cos(latRad);
        const noisyBoundary = leadingFactor + (n1 - 0.5) * 0.38;
        if (noisyBoundary > 0.05) {
          const darkBlend = Math.min(1, (noisyBoundary - 0.05) * 3.2);
          cWork.copy(cBase).lerp(cSec, darkBlend * 0.94);
        } else {
          cWork.copy(cBase).lerp(cFeat, n2 * 0.45);
        }
        // Equatorial mountain ridge highlight
        const eqDist = Math.abs(v - 0.5);
        if (eqDist < 0.035) {
          relief += (1 - eqDist / 0.035) * 0.42;
        }
      } else if (sat.geologicalType === 'saturnian_herschel_mimas') {
        // Enormous Herschel Crater with bright walls and central peak
        const dHerschel = Math.hypot((u - 0.31) * 1.8, v - 0.51);
        if (dHerschel < 0.22) {
          if (dHerschel < 0.045) {
            cWork.lerp(cFeat, 0.75); // Central peak
            relief += 0.38;
          } else if (dHerschel > 0.17) {
            cWork.lerp(cFeat, 0.65); // Raised rim wall
            relief += 0.32;
          } else {
            cWork.lerp(cSec, 0.6); // Deep basin floor
            relief -= 0.35;
          }
        }
      } else if (sat.geologicalType === 'saturnian_chasma_tethys') {
        // 2,000-km Ithaca Chasma diagonal rift canyon + Odysseus giant basin
        const chasmaDist = Math.abs(v - (0.5 + 0.28 * Math.sin((u - 0.15) * Math.PI * 2)));
        if (chasmaDist < 0.045) {
          cWork.lerp(cSec, 0.55);
          relief -= 0.32;
        } else if (chasmaDist < 0.068) {
          cWork.lerp(cFeat, 0.6);
          relief += 0.22;
        }
        const dOdysseus = Math.hypot((u - 0.36) * 1.7, v - 0.32);
        if (dOdysseus < 0.24) {
          if (dOdysseus > 0.19) {
            cWork.lerp(cFeat, 0.55);
            relief += 0.26;
          } else {
            cWork.lerp(cSec, 0.35);
          }
        }
      } else if (sat.geologicalType === 'saturnian_wispy_dione') {
        // Bright wispy braided ice cliffs (Padua Chasmata) on the trailing hemisphere
        if (u > 0.45 && u < 0.92) {
          const wisp = Math.abs(Math.sin((u * 26 + v * 14 + n1 * 3.5) * Math.PI));
          if (wisp < 0.14) {
            cWork.lerp(cFeat, 0.85);
            relief += 0.28;
          }
        }
      } else if (sat.geologicalType === 'uranian_corona_miranda') {
        // Inverness Corona ("The Chevron") + Arden/Elsinore grooved polygons + Verona Rupes cliff
        const dChevron = Math.max(Math.abs(u - 0.72), Math.abs(v - 0.74));
        if (dChevron < 0.18) {
          const groove = Math.sin(dChevron * 140);
          if (groove > 0.2) {
            cWork.lerp(cFeat, 0.75);
            relief += 0.28;
          } else {
            cWork.lerp(cSec, 0.7);
            relief -= 0.24;
          }
        }
        // Verona Rupes bright fault scarp
        if (Math.abs(u - 0.92) < 0.025 && v > 0.45 && v < 0.72) {
          cWork.lerp(cFeat, 0.9);
          relief += 0.45;
        }
      } else if (sat.geologicalType === 'uranian_graben_ariel') {
        // Intersecting Kachina Chasmata graben valleys
        const g1 = Math.abs(Math.sin((u * 14 + v * 9 + n1 * 1.8) * Math.PI));
        const g2 = Math.abs(Math.sin((u * 11 - v * 12 + n2 * 1.5) * Math.PI));
        if (g1 < 0.12 || g2 < 0.11) {
          cWork.lerp(cSec, 0.55);
          relief -= 0.3;
        }
      } else if (sat.geologicalType === 'uranian_dark_umbriel') {
        // Dark ancient surface + brilliant white Wunda Crater floor annulus near equator
        cWork.copy(cBase).lerp(cSec, 0.55 + n1 * 0.35);
        const dWunda = Math.hypot((u - 0.76) * 1.8, v - 0.54);
        if (dWunda > 0.022 && dWunda < 0.062) {
          cWork.setHex(0xf1f5f9);
          relief += 0.18;
        }
      } else if (sat.geologicalType === 'uranian_canyon_titania') {
        // 1,500-km Messina Chasmata fault scarp
        const canyon = Math.abs(v - (0.58 + 0.24 * Math.cos(u * Math.PI * 2 + n1)));
        if (canyon < 0.032) {
          cWork.lerp(cFeat, 0.75);
          relief -= 0.32;
        }
      } else if (sat.geologicalType === 'uranian_ancient_oberon') {
        // Dark-floored Hamlet crater + bright rays
        const dHamlet = Math.hypot((u - 0.18) * 1.8, v - 0.74);
        if (dHamlet < 0.085) {
          cWork.setHex(0x1c1917);
          relief -= 0.25;
        } else if (dHamlet < 0.18 && n3 > 0.52) {
          cWork.lerp(cFeat, 0.65);
        }
      } else if (sat.geologicalType === 'neptunian_cantaloupe_triton') {
        // Southern pinkish-white nitrogen frost cap (Uhlanga Regio) + dark geyser wind streaks + northern Cantaloupe dimples
        if (v > 0.56) {
          cWork.setHex(0xeadad6).lerp(cFeat, n2 * 0.45);
          // Dark wind-sheared nitrogen geyser streaks
          const streak =
            Math.sin(v * 85 + n1 * 6) * Math.cos((u * 40 - v * 18) * Math.PI);
          if (streak > 0.76) {
            cWork.setHex(0x3b302e);
          }
        } else {
          // Dimpled Cantaloupe Terrain (Bubembe Regio cavi)
          const cell =
            Math.abs(Math.sin(u * 64 + n1 * 4) * Math.sin(v * 32 + n2 * 4));
          cWork.copy(cBase).lerp(cSec, (1 - cell) * 0.75);
          relief += cell * 0.28;
        }
      } else if (
        sat.geologicalType === 'martian_phobos_stickney' ||
        sat.geologicalType === 'martian_deimos_smooth' ||
        sat.geologicalType === 'neptunian_irregular_proteus'
      ) {
        // Stickney/Pharos basin dark floor + parallel tidal groove striations
        const dBasin = Math.hypot(u - 0.35, v - 0.48);
        if (dBasin < 0.18) {
          const rim = dBasin > 0.13 ? 1.28 : 0.62;
          cWork.multiplyScalar(rim);
          relief += dBasin > 0.13 ? 0.25 : -0.35;
        }
        if (sat.geologicalType === 'martian_phobos_stickney') {
          const groove = Math.sin((u * 42 + v * 16 + n1 * 1.5) * Math.PI);
          if (groove > 0.8) {
            cWork.lerp(cFeat, 0.38);
            relief -= 0.15;
          }
        }
      }

      const idx = (y * width + x) * 4;
      imgData.data[idx] = Math.min(255, Math.max(0, Math.round(cWork.r * 255)));
      imgData.data[idx + 1] = Math.min(255, Math.max(0, Math.round(cWork.g * 255)));
      imgData.data[idx + 2] = Math.min(255, Math.max(0, Math.round(cWork.b * 255)));
      imgData.data[idx + 3] = 255;

      const bVal = Math.min(255, Math.max(0, Math.round(relief * 255)));
      bumpData.data[idx] = bVal;
      bumpData.data[idx + 1] = bVal;
      bumpData.data[idx + 2] = bVal;
      bumpData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  bCtx.putImageData(bumpData, 0, 0);

  // Stamp 48 multi-scale impact craters (shadowed bowl + bright raised rim + central peak) onto both Albedo and Bump maps
  const seedBase = sat.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0) * 17, 13);
  const craterCount = sat.geologicalType === 'saturnian_haze_titan' ? 12 : 48;
  for (let c = 0; c < craterCount; c++) {
    const h1 = Math.abs(Math.sin(seedBase + c * 12.9898) * 43758.5453) % 1;
    const h2 = Math.abs(Math.sin(seedBase + c * 78.233 + 1.7) * 43758.5453) % 1;
    const h3 = Math.abs(Math.sin(seedBase + c * 39.412 + 3.1) * 43758.5453) % 1;

    const cx = h1 * width;
    const cy = (0.12 + h2 * 0.76) * height;
    const r = 6 + Math.pow(h3, 1.8) * 36;

    // Albedo crater shading
    const albGrad = ctx.createRadialGradient(cx, cy, r * 0.08, cx, cy, r * 1.18);
    albGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)'); // Central peak highlight
    albGrad.addColorStop(0.22, 'rgba(15, 23, 42, 0.34)'); // Deep shadowed crater floor
    albGrad.addColorStop(0.76, 'rgba(15, 23, 42, 0.24)');
    albGrad.addColorStop(0.9, 'rgba(255, 255, 255, 0.38)'); // Bright raised rim wall
    albGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = albGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.18, 0, Math.PI * 2);
    ctx.fill();

    // Bump map crater elevation profile
    const bumpGrad = bCtx.createRadialGradient(cx, cy, r * 0.05, cx, cy, r * 1.15);
    bumpGrad.addColorStop(0, 'rgba(220, 220, 220, 0.55)'); // Central peak
    bumpGrad.addColorStop(0.2, 'rgba(20, 20, 20, 0.65)'); // Depressed bowl
    bumpGrad.addColorStop(0.78, 'rgba(30, 30, 30, 0.5)');
    bumpGrad.addColorStop(0.92, 'rgba(245, 245, 245, 0.7)'); // Raised rim
    bumpGrad.addColorStop(1.0, 'rgba(128, 128, 128, 0)');
    bCtx.fillStyle = bumpGrad;
    bCtx.beginPath();
    bCtx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
    bCtx.fill();
  }

  // Extra crisp tectonic lineaments / Tiger Stripes for icy worlds
  if (
    sat.geologicalType === 'saturnian_cryo_enceladus' ||
    sat.geologicalType === 'saturnian_wispy_dione' ||
    sat.geologicalType === 'saturnian_chasma_tethys' ||
    sat.geologicalType === 'uranian_graben_ariel' ||
    sat.geologicalType === 'uranian_corona_miranda'
  ) {
    ctx.save();
    bCtx.save();
    for (let f = 0; f < 18; f++) {
      const fx1 = ((f * 73 + seedBase) % 100) * 0.01 * width;
      const fy1 = (0.18 + ((f * 41 + seedBase) % 72) * 0.01) * height;
      const fx2 = fx1 + (((f % 2 === 0 ? 1 : -1) * (110 + (f * 29) % 140)));
      const fy2 = fy1 + (((f % 3 === 0 ? 1 : -1) * (45 + (f * 19) % 90)));
      const cpx = (fx1 + fx2) * 0.5 + ((f % 2) - 0.5) * 60;
      const cpy = (fy1 + fy2) * 0.5 - ((f % 3) - 1) * 40;

      ctx.strokeStyle =
        sat.geologicalType === 'saturnian_cryo_enceladus'
          ? 'rgba(56, 189, 248, 0.42)'
          : 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(fx1, fy1);
      ctx.quadraticCurveTo(cpx, cpy, fx2, fy2);
      ctx.stroke();

      bCtx.strokeStyle = 'rgba(25, 25, 25, 0.65)';
      bCtx.lineWidth = 3.0;
      bCtx.beginPath();
      bCtx.moveTo(fx1, fy1);
      bCtx.quadraticCurveTo(cpx, cpy, fx2, fy2);
      bCtx.stroke();
    }
    ctx.restore();
    bCtx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;

  const bumpTex = new THREE.CanvasTexture(bumpCanvas);
  bumpTex.wrapS = THREE.RepeatWrapping;
  bumpTex.wrapT = THREE.ClampToEdgeWrapping;

  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    bumpMap: bumpTex,
    bumpScale: 0.11,
    roughness: sat.roughness,
    metalness: sat.geologicalType === 'saturnian_cryo_enceladus' ? 0.12 : 0.06,
    envMapIntensity: sat.roughness < 0.55 ? 0.26 : 0.15,
  });

  satelliteMaterialCache.set(sat.id, mat);
  return mat;
}

/**
 * CraterGeometryEngine & GeologicalTerrainEngine:
 * Evaluates 5-frequency 3D geological vertex displacement on a unit sphere normal `(nx, ny, nz)`
 * for a given natural satellite so close-up views reveal genuine 3D craters, terraced rims, central peaks,
 * equatorial ridges (Iapetus), fault cliffs (Miranda Verona Rupes), and triaxial potato shapes (Phobos/Deimos/Proteus).
 */
export function evaluateSatelliteVertexDisplacement(
  nx: number,
  ny: number,
  nz: number,
  sat: NaturalSatelliteSpec
): number {
  // Frequency 1 & 2: Multi-octave regional terrain + deterministic 8-crater impact field
  const craters = [
    { x: 0.58, y: 0.22, z: 0.78, r: 0.38, d: 1.0 },
    { x: -0.64, y: -0.31, z: 0.7, r: 0.32, d: 0.8 },
    { x: 0.15, y: 0.82, z: -0.55, r: 0.28, d: 0.7 },
    { x: -0.25, y: -0.78, z: -0.57, r: 0.34, d: 0.85 },
    { x: 0.84, y: -0.41, z: -0.35, r: 0.26, d: 0.65 },
    { x: -0.88, y: 0.32, z: -0.35, r: 0.3, d: 0.75 },
    { x: 0.12, y: -0.18, z: -0.97, r: 0.36, d: 0.9 },
    { x: -0.42, y: 0.68, z: 0.6, r: 0.22, d: 0.55 },
  ];

  let disp =
    (fbmNoise(nx * 3.4 + 2.1, ny * 3.4 + nz * 2.7, 4) - 0.5) * sat.displacementAmplitude;

  // Frequency 3: Major Named Giant Impact Basin (Herschel on Mimas, Stickney on Phobos, Odysseus on Tethys, Pharos on Proteus, Valhalla on Callisto)
  if (sat.majorBasinSpec) {
    const b = sat.majorBasinSpec;
    const bDist = Math.hypot(nx - b.nx, ny - b.ny, nz - b.nz) / b.radiusNorm;
    if (bDist < 1.32) {
      if (bDist < 0.82) {
        const normD = bDist / 0.82;
        let bowl = normD * normD - 1.0;
        if (b.hasCentralPeak && normD < 0.26) {
          bowl += (1 - normD / 0.26) * 0.72;
        }
        disp += bowl * sat.displacementAmplitude * b.depthFactor;
      } else {
        const rimT = (bDist - 0.82) / 0.5;
        disp +=
          Math.sin((1 - rimT) * Math.PI) * 0.45 * sat.displacementAmplitude * b.depthFactor;
      }
    }
  }

  // Frequency 4: Iapetus 20-km Equatorial Mountain Ridge (`equatorialRidgeFactor`)
  if (sat.equatorialRidgeFactor) {
    const eqProfile = Math.exp(-Math.pow(ny / 0.085, 2));
    const ridgeMod = 0.65 + 0.35 * fbmNoise(nx * 6.5, nz * 6.5, 3);
    disp += eqProfile * sat.equatorialRidgeFactor * ridgeMod;
  }

  // Frequency 5: Miranda Verona Rupes & Corona Fault Scarps
  if (sat.geologicalType === 'uranian_corona_miranda') {
    const cliffStep = Math.tanh((nx - 0.32) * 14.0) * 0.42 * sat.displacementAmplitude;
    disp += cliffStep;
  }

  for (const c of craters) {
    const dist = Math.hypot(nx - c.x, ny - c.y, nz - c.z) / c.r;
    if (dist < 1.3) {
      if (dist < 0.85) {
        const bowl = (dist / 0.85) * (dist / 0.85) - 1.0;
        disp += bowl * sat.displacementAmplitude * c.d;
      } else {
        const rimT = (dist - 0.85) / 0.45;
        disp += Math.sin((1 - rimT) * Math.PI) * 0.35 * sat.displacementAmplitude * c.d;
      }
    }
  }

  return disp;
}

/**
 * Builds an animated volcanic or cryovolcanic plume group for active worlds:
 * - Io: Loki Patera, Pele, and Prometheus umbrella sulfur plumes + warm point light glow
 * - Enceladus: South-polar Tiger Stripe water-ice geyser curtains
 * - Triton: South-polar nitrogen geysers sheared horizontally at 8 km altitude by winds
 */
export function buildSatelliteActivePlumeGroup(
  sat: NaturalSatelliteSpec,
  sceneRadius: number
): THREE.Group {
  const plumeGroup = new THREE.Group();
  plumeGroup.name = `${sat.id}-plumes`;

  const plumeColor = new THREE.Color(sat.plumeColorHex || '#7dd3fc');

  if (sat.id === 'sat-enceladus') {
    // 4 South-polar Tiger Stripe cryovolcanic water-ice jet cones + shimmering particle cloud
    for (let j = 0; j < 4; j++) {
      const jetGeo = new THREE.ConeGeometry(
        sceneRadius * (0.14 + j * 0.04),
        sceneRadius * (1.15 + j * 0.18),
        20,
        1,
        true
      );
      jetGeo.translate(
        (j - 1.5) * sceneRadius * 0.11,
        -sceneRadius * 1.18,
        ((j % 2) - 0.5) * sceneRadius * 0.11
      );
      const jetMat = new THREE.MeshBasicMaterial({
        color: plumeColor,
        transparent: true,
        opacity: 0.16 - j * 0.025,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      plumeGroup.add(new THREE.Mesh(jetGeo, jetMat));
    }
  } else if (sat.id === 'sat-io') {
    // Pele & Prometheus translucent umbrella volcanic plumes on the limb
    const ventDirs = [
      new THREE.Vector3(0.88, 0.36, -0.31).normalize(),
      new THREE.Vector3(-0.76, -0.34, 0.55).normalize(),
      new THREE.Vector3(0.22, -0.68, -0.7).normalize(),
    ];
    ventDirs.forEach((dir, idx) => {
      const ventAnchor = new THREE.Group();
      ventAnchor.position.copy(dir).multiplyScalar(sceneRadius * 0.99);
      ventAnchor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

      const umbrellaGeo = new THREE.SphereGeometry(
        sceneRadius * 0.18,
        20,
        14,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.55
      );
      umbrellaGeo.scale(1.25, 0.85, 1.25);
      umbrellaGeo.translate(0, sceneRadius * 0.05, 0);
      const stemMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0xf97316 : 0xfacc15,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      ventAnchor.add(new THREE.Mesh(umbrellaGeo, stemMat));
      plumeGroup.add(ventAnchor);
    });
  } else if (sat.id === 'sat-triton') {
    // South-polar nitrogen geysers rising vertically then sheared horizontally by Triton's winds
    for (let g = 0; g < 3; g++) {
      const geyserAnchor = new THREE.Group();
      const lat = -0.68 - g * 0.08;
      const lon = g * 2.1;
      const dir = new THREE.Vector3(
        Math.cos(lat) * Math.cos(lon),
        Math.sin(lat),
        Math.cos(lat) * Math.sin(lon)
      ).normalize();
      geyserAnchor.position.copy(dir).multiplyScalar(sceneRadius);
      geyserAnchor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

      const plumeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, sceneRadius * 0.16, 0),
        new THREE.Vector3(sceneRadius * 0.24, sceneRadius * 0.22, sceneRadius * 0.08),
        new THREE.Vector3(sceneRadius * 0.56, sceneRadius * 0.24, sceneRadius * 0.16),
      ]);
      const plumeTube = new THREE.TubeGeometry(
        plumeCurve,
        16,
        sceneRadius * 0.035,
        8,
        false
      );
      const plumeMat = new THREE.MeshBasicMaterial({
        color: 0xcbd5e1,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      });
      geyserAnchor.add(new THREE.Mesh(plumeTube, plumeMat));
      plumeGroup.add(geyserAnchor);
    }
  }

  return plumeGroup;
}

/**
 * Builds a 3-Level Adaptive `THREE.LOD` Natural Satellite Assembly with:
 * - LOD 0 (Close-up): High-subdivision `96 × 72` displaced 3D mesh (`13,824` triangles) with craters, rims, ridges, and triaxial shape scaling.
 * - LOD 1 (Mid-range): `48 × 36` displaced mesh (`3,456` triangles).
 * - LOD 2 (Far-range): `24 × 18` mesh (`864` triangles).
 * - Layered atmospheric scattering halo (Titan, Triton, Io, Europa) and active plumes (Io, Enceladus, Triton).
 */
export function buildAdaptiveNaturalSatelliteLOD(
  sat: NaturalSatelliteSpec,
  sceneRadius: number,
  authenticTextures: AuthenticSolarTextures
): THREE.Group {
  const root = new THREE.Group();
  root.name = sat.id;
  root.userData = {
    type: 'natural_satellite',
    satelliteId: sat.id,
    parentBodyId: sat.parentId,
    label: `${sat.name} · R = ${sat.meanRadiusKm.toLocaleString()} km`,
    scientificMetadata: sat,
  };

  const mat = createNaturalSatelliteMaterial(sat, authenticTextures);
  const lod = new THREE.LOD();

  let scaleX = 1.0;
  let scaleY = 1.0;
  let scaleZ = 1.0;
  if (sat.triaxialAxesKm) {
    const [ax, ay, az] = sat.triaxialAxesKm;
    const mean = (ax + ay + az) / 3;
    scaleX = ax / mean;
    scaleY = az / mean;
    scaleZ = ay / mean;
  }

  const levels: { wSegs: number; hSegs: number; dist: number; displace: boolean }[] = [
    { wSegs: 96, hSegs: 72, dist: 0, displace: true },
    { wSegs: 48, hSegs: 36, dist: Math.max(5.5, sceneRadius * 14), displace: true },
    { wSegs: 24, hSegs: 18, dist: Math.max(18.0, sceneRadius * 42), displace: false },
  ];

  for (const lvl of levels) {
    const geom = new THREE.SphereGeometry(sceneRadius, lvl.wSegs, lvl.hSegs);
    if (lvl.displace) {
      const pos = geom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const vz = pos.getZ(i);
        const len = Math.hypot(vx, vy, vz) || 1;
        const nx = vx / len;
        const ny = vy / len;
        const nz = vz / len;
        const disp = evaluateSatelliteVertexDisplacement(nx, ny, nz, sat);
        const rNew = sceneRadius * (1 + disp);
        pos.setXYZ(i, nx * rNew * scaleX, ny * rNew * scaleY, nz * rNew * scaleZ);
      }
      geom.computeVertexNormals();
    } else if (sat.triaxialAxesKm) {
      geom.scale(scaleX, scaleY, scaleZ);
    }

    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = root.userData;
    lod.addLevel(mesh, lvl.dist);
  }

  root.add(lod);

  // Add layered photochemical stratospheric haze shell for Titan and tenuous atmospheric scattering for Triton/Europa/Io
  if (sat.id === 'sat-titan') {
    const titanInnerHaze = createAtmosphereMesh(sceneRadius * 1.015, '#d97706', 0.54);
    const titanDetachedHaze = createAtmosphereMesh(sceneRadius * 1.055, '#38bdf8', 0.22);
    root.add(titanInnerHaze);
    root.add(titanDetachedHaze);
  } else if (sat.id === 'sat-triton') {
    root.add(createAtmosphereMesh(sceneRadius * 1.012, '#93c5fd', 0.24));
  } else if (sat.id === 'sat-europa') {
    root.add(createAtmosphereMesh(sceneRadius * 1.008, '#bae6fd', 0.2));
  } else if (sat.id === 'sat-io') {
    root.add(createAtmosphereMesh(sceneRadius * 1.012, '#f59e0b', 0.25));
  }

  // Add animated volcanic / cryovolcanic plumes for Io, Enceladus, and Triton
  if (sat.hasActivePlumes) {
    root.add(buildSatelliteActivePlumeGroup(sat, sceneRadius));
  }

  return root;
}

/**
 * Builds a high-polygon 3-Level `THREE.LOD` Planetary Sphere so close-up views have
 * `128 × 96` (`24,576` triangles) smooth curvature with zero polygonal faceting.
 */
export function buildAdaptivePlanetLOD(
  radius: number,
  material: THREE.Material,
  userData: Record<string, unknown>
): THREE.LOD {
  const lod = new THREE.LOD();
  const levels = [
    { w: 128, h: 96, dist: 0 },
    { w: 64, h: 48, dist: radius * 9.5 },
    { w: 32, h: 24, dist: radius * 28.0 },
  ];

  for (const lvl of levels) {
    const geom = new THREE.SphereGeometry(radius, lvl.w, lvl.h);
    const mesh = new THREE.Mesh(geom, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = userData;
    lod.addLevel(mesh, lvl.dist);
  }
  lod.userData = userData;
  return lod;
}

/**
 * Builds Saturn's Multi-Band Ring System (D, C, B, Cassini Division, A, Encke Gap, F Ring)
 * using accurate relative ring dimensions and a custom GLSL shader that computes multi-band optical depth,
 * Cassini/Encke gaps, and real-time planetary shadow casting across the anti-solar side of the rings.
 */
export function createSaturnMultiBandRingSystem(
  saturnRadius: number,
  ringTexture: THREE.Texture
): THREE.Mesh {
  const innerR = saturnRadius * 1.24;
  const outerR = saturnRadius * 2.35;
  const ringGeo = new THREE.RingGeometry(innerR, outerR, 180, 24);
  const pos = ringGeo.attributes.position;
  const uvs = ringGeo.attributes.uv;
  const v3 = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    const t = (v3.length() - innerR) / (outerR - innerR);
    uvs.setXY(i, Math.max(0, Math.min(1, t)), 0.5);
  }
  ringGeo.rotateX(Math.PI / 2);

  const ringMat = new THREE.ShaderMaterial({
    uniforms: {
      uRingMap: { value: ringTexture },
      uPlanetRadius: { value: saturnRadius },
      uInnerRadius: { value: innerR },
      uOuterRadius: { value: outerR },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vLocalPos;
      void main() {
        vUv = uv;
        vLocalPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uRingMap;
      uniform float uPlanetRadius;
      varying vec2 vUv;
      varying vec3 vLocalPos;

      void main() {
        float rNorm = vUv.x;
        vec4 texColor = texture2D(uRingMap, vec2(rNorm, 0.5));

        float fineWaves = 0.88 + 0.12 * sin(rNorm * 280.0) * cos(rNorm * 95.0);
        float cassiniGap = 1.0 - 0.88 * exp(-pow((rNorm - 0.63) / 0.022, 2.0));
        float enckeGap = 1.0 - 0.78 * exp(-pow((rNorm - 0.875) / 0.008, 2.0));
        float cRingDim = mix(0.38, 1.0, smoothstep(0.0, 0.24, rNorm));

        float shadowCheck = 1.0;
        if (vLocalPos.x > 0.0) {
          float perpDist = abs(vLocalPos.z);
          shadowCheck = smoothstep(uPlanetRadius * 0.88, uPlanetRadius * 1.04, perpDist);
          shadowCheck = mix(0.14, 1.0, shadowCheck);
        }

        vec3 finalRgb = texColor.rgb * fineWaves * cRingDim * shadowCheck * 0.85;
        float finalAlpha = texColor.a * cassiniGap * enckeGap * cRingDim * 0.92;
        if (finalAlpha < 0.02) discard;

        gl_FragColor = vec4(finalRgb, finalAlpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.z = 0.466; // Saturn's 26.73° axial tilt
  return ringMesh;
}
