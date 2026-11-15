/**
 * AFTERLIGHT — Core Domain Types & Scientific Provenance Schema
 */

export type CelestialBodyId =
  | 'sun'
  | 'earth'
  | 'moon'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export type ViewportMode =
  | 'solar_system'
  | 'moon_globe'
  | 'mars_globe'
  | 'satellite_world'
  | 'hardware_inspector'
  | 'story_cinema';

export type ExperiencePresentationMode =
  | 'scientific'
  | 'cinematic'
  | 'geological';

export type CinematicShotPreset =
  | 'GRAND_REVEAL'
  | 'ORBITAL_APPROACH'
  | 'SURFACE_DESCENT'
  | 'HORIZON_SHOT'
  | 'GEOLOGICAL_CLOSEUP'
  | 'PLANET_IN_SKY'
  | 'ORBITAL_TRACKING'
  | 'DEEP_SPACE_WIDE';

export type StoryChapterNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14;

export type WorkspacePanel =
  | 'none'
  | 'artifact_dossier'
  | 'storytelling'
  | 'search_catalog'
  | 'timeline_legacy'
  | 'media_pipeline'
  | 'education_academy'
  | 'data_provenance';

export type ArtifactCategory =
  | 'Rover'
  | 'Lander'
  | 'Descent stage'
  | 'Orbiter'
  | 'Scientific instrument'
  | 'Experiment package'
  | 'Surface equipment'
  | 'Spacecraft'
  | 'Probe'
  | 'Impacted hardware';

export type OperationalStatus =
  | 'Operational'
  | 'Extended mission'
  | 'Inactive'
  | 'Retired'
  | 'Impacted'
  | 'Jettisoned'
  | 'Unknown';

export type VerificationStatus =
  | 'VERIFIED'
  | 'ESTIMATED'
  | 'UNCERTAIN'
  | 'CREATIVE_NARRATIVE';

export interface CoordinateRecord {
  lat: number;
  lon: number;
  elevationM?: number;
  datum: string;
  confidenceRadiusM: number;
  verification: VerificationStatus;
  provenanceSourceId: string;
  imagingReference?: string;
  notes?: string;
}

export interface ArtifactCoordinates {
  landingLocation?: CoordinateRecord;
  finalOperatingLocation?: CoordinateRecord;
  finalDocumentedLocation?: CoordinateRecord;
  currentEstimatedLocation?: CoordinateRecord;
  impactLocation?: CoordinateRecord;
  heliocentricPosition?: {
    distanceAU: number;
    eclipticLatDeg: number;
    eclipticLonDeg: number;
    velocityKmS: number;
    epoch: string;
    provenanceSourceId: string;
  };
}

export interface ScientificSource {
  id: string;
  archiveName:
    | 'NASA PDS'
    | 'NASA NSSDC'
    | 'LROC / LRO'
    | 'NASA Human Artifacts Catalog'
    | 'MER / MRO HiRISE Archive'
    | 'NAIF SPICE'
    | 'JPL Horizons'
    | 'NASA Image and Video Library';
  title: string;
  citation: string;
  url: string;
  datasetId: string;
  lastUpdated: string;
  license: string;
}

export interface ScientificClaim {
  id: string;
  artifactId: string;
  sourceId: string;
  statement: string;
  evidenceUrl: string;
  evidenceType:
    | 'Orbital Optical Imagery'
    | 'Radio Doppler / VLBI Telemetry'
    | 'In-Situ Spectrometer Data'
    | 'Laser Ranging Retroreflector'
    | 'Mission Flight Log / NSSDC Record'
    | 'Seismic Telemetry';
  verificationStatus: VerificationStatus;
  uncertaintyNotes: string;
  reviewTimestamp: string;
}

export interface ScientificInstrument {
  id: string;
  name: string;
  acronym: string;
  type: string;
  principalInvestigator: string;
  massKg: number;
  powerWatts: number;
  resolutionOrRange: string;
  scientificPurpose: string;
  keyFindings: string;
}

export interface StoryChapter {
  chapterNumber: StoryChapterNumber;
  title: string;
  subtitle: string;
  factualParagraphs: {
    text: string;
    simpleText: string;
    claimIds: string[];
  }[];
  firstPersonPassage: string;
  telemetryHighlight: {
    label: string;
    value: string;
    unit: string;
  };
}

export interface TraverseWaypoint {
  solOrDay: number;
  label: string;
  lat: number;
  lon: number;
  elevationM: number;
  distanceKm: number;
}

export interface ArtifactRecord {
  id: string;
  name: string;
  nssdcaId: string;
  missionId: string;
  missionName: string;
  agency: 'NASA' | 'Roscosmos / USSR' | 'CNSA' | 'NASA / ESA / ASI';
  bodyId: CelestialBodyId;
  regionName: string;
  category: ArtifactCategory;
  operationalStatus: OperationalStatus;
  statusExplanation: string;
  launchDate: string;
  landingOrArrivalDate: string;
  endOfOperationsDate?: string;
  massDryKg: number;
  powerSystem: string;
  dimensions: string;
  traverseDistanceKm?: number;
  coordinates: ArtifactCoordinates;
  proceduralModelType: 'lander' | 'rover' | 'probe' | 'impactor';
  primaryColorHex: string;
  accentColorHex: string;
  heroImageUrl: string;
  heroImageCaption: string;
  originalPurpose: string;
  scientificAchievements: string[];
  presentConditionSummary: string;
  instruments: ScientificInstrument[];
  storyChapters: StoryChapter[];
  claimIds: string[];
  sourceIds: string[];
  relatedArtifactIds: string[];
  traversePath?: TraverseWaypoint[];
}

export interface MissionEvent {
  id: string;
  missionId: string;
  missionName: string;
  artifactId: string;
  bodyId: CelestialBodyId;
  date: string;
  eventType:
    | 'Launch'
    | 'Landing'
    | 'Milestone'
    | 'Observation'
    | 'Extended Mission'
    | 'Last Communication'
    | 'Discovery';
  title: string;
  description: string;
  claimId: string;
}

export interface LegacyNode {
  id: string;
  type:
    | 'Mission'
    | 'Artifact'
    | 'Instrument'
    | 'Observation'
    | 'Discovery'
    | 'Later Mission';
  label: string;
  sublabel: string;
  bodyId: CelestialBodyId;
  year: number;
}

export interface LegacyEdge {
  id: string;
  fromId: string;
  toId: string;
  relationship: string;
  evidenceClaimId: string;
  historicalBasis: string;
}

export interface CelestialBodySpec {
  id: CelestialBodyId;
  name: string;
  subtitle: string;
  classification: 'Star' | 'Terrestrial Planet' | 'Natural Satellite' | 'Gas Giant' | 'Ice Giant';
  orbitRadiusSceneUnits: number;
  radiusSceneUnits: number;
  meanRadiusKm: number;
  semiMajorAxisAU: number;
  orbitalPeriodDays: number;
  rotationPeriodHours: number;
  surfaceGravityMS2: number;
  axialTiltDeg: number;
  baseColorHex: string;
  secondaryColorHex: string;
  atmosphereColorHex: string;
  hasRings?: boolean;
  missionCount: number;
  documentedArtifactCount: number;
  scientificSummary: string;
  terrainReferenceSystem: string;
  elevationSource: string;
  hasDedicatedGlobe: boolean;
}

export interface GeologicalFeature {
  id: string;
  bodyId: 'moon' | 'mars';
  name: string;
  featureType: 'Crater' | 'Mare / Planitia' | 'Vallis' | 'Mons' | 'Basin';
  lat: number;
  lon: number;
  diameterKm: number;
  elevationM: number;
  description: string;
}

export interface MediaAsset {
  id: string;
  nasaId: string;
  artifactId: string;
  title: string;
  mediaType: 'video' | 'audio';
  format: 'MP4' | 'WEBM' | 'WAV';
  durationSec: number;
  resolution: string;
  videoCodec: string;
  audioCodec: string;
  sampleRateHz: number;
  sourceArchive: string;
  license: string;
  description: string;
  transcriptCaption: string;
  fileKey: string;
}

export interface MediaJobRecord {
  jobId: string;
  assetId: string;
  operation:
    | 'ffprobe_inspect'
    | 'extract_thumbnail'
    | 'transcode_h264'
    | 'generate_contact_sheet'
    | 'normalize_audio';
  status: 'completed' | 'running' | 'failed';
  commandArgs: string[];
  startedAt: string;
  completedAt: string;
  durationMs: number;
  outputSummary: string;
  probeData?: {
    formatName: string;
    durationSec: number;
    sizeBytes: number;
    bitRateBps: number;
    streams: {
      index: number;
      codecType: string;
      codecName: string;
      width?: number;
      height?: number;
      sampleRate?: string;
    }[];
  };
  contactSheetFrames?: {
    timestampSec: number;
    caption: string;
    telemetryTag: string;
  }[];
}

export interface EducationalChallenge {
  id: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  challengeType:
    | 'artifact_identification'
    | 'instrument_matching'
    | 'timeline_reconstruction'
    | 'discovery_evidence';
  question: string;
  contextClue: string;
  artifactId: string;
  claimId: string;
  options: {
    id: string;
    label: string;
    detail: string;
  }[];
  correctOptionId: string;
  authoritativeExplanation: string;
  points: number;
}

export interface DataConnectorStatus {
  id: string;
  sourceName: string;
  endpointPattern: string;
  recordsIngested: number;
  verifiedClaimsCount: number;
  lastSyncTimestamp: string;
  validationStatus: 'PASS' | 'WARN';
  schemaVersion: string;
  notes: string;
}
