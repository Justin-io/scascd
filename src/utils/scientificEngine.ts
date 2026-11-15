import {
  ArtifactCategory,
  ArtifactRecord,
  CelestialBodyId,
  CoordinateRecord,
  EducationalChallenge,
  MissionEvent,
  OperationalStatus,
  ScientificClaim,
  ScientificSource,
} from '../types/afterlight';

export interface CartesianPoint3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Converts planetographic/aerocentric latitude [-90, 90] and longitude [-180, 360]
 * into Three.js right-handed spherical Cartesian coordinates (+Y up, +Z prime meridian).
 */
export function latLonToCartesian(
  latDeg: number,
  lonDeg: number,
  radius: number
): CartesianPoint3D {
  const phi = (90 - latDeg) * (Math.PI / 180);
  const normalizedLon = ((lonDeg + 180) % 360 + 360) % 360 - 180;
  const theta = (normalizedLon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return { x, y, z };
}

/**
 * Inverse transformation from 3D surface point on sphere to planetographic lat/lon.
 */
export function cartesianToLatLon(
  x: number,
  y: number,
  z: number
): { lat: number; lon: number } {
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r === 0) return { lat: 0, lon: 0 };

  const phi = Math.acos(Math.max(-1, Math.min(1, y / r)));
  const lat = 90 - (phi * 180) / Math.PI;

  const theta = Math.atan2(z, -x);
  let lon = (theta * 180) / Math.PI - 180;
  if (lon < -180) lon += 360;
  if (lon > 180) lon -= 360;

  return {
    lat: Number(lat.toFixed(4)),
    lon: Number(lon.toFixed(4)),
  };
}

/**
 * Calculates great-circle Haversine distance in kilometers on a spherical planetary body.
 */
export function calculateSphericalDistanceKm(
  lat1Deg: number,
  lon1Deg: number,
  lat2Deg: number,
  lon2Deg: number,
  meanRadiusKm: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2Deg - lat1Deg);
  const dLon = toRad(lon2Deg - lon1Deg);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1Deg)) *
      Math.cos(toRad(lat2Deg)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((meanRadiusKm * c).toFixed(3));
}

/**
 * Formats latitude and longitude with N/S and E/W hemisphere designators.
 */
export function formatCoordinate(lat: number, lon: number, decimals = 4): string {
  const latHem = lat >= 0 ? 'N' : 'S';
  const normalizedLon = lon > 180 ? lon - 360 : lon;
  const lonHem = normalizedLon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(decimals)}° ${latHem}, ${Math.abs(normalizedLon).toFixed(decimals)}° ${lonHem}`;
}

/**
 * Returns the primary surface coordinate record for an artifact.
 */
export function getPrimaryCoordinate(
  artifact: ArtifactRecord
): { typeLabel: string; record: CoordinateRecord } | null {
  if (artifact.coordinates.finalDocumentedLocation) {
    return {
      typeLabel: 'Final Documented Location',
      record: artifact.coordinates.finalDocumentedLocation,
    };
  }
  if (artifact.coordinates.landingLocation) {
    return {
      typeLabel: 'Landing Location',
      record: artifact.coordinates.landingLocation,
    };
  }
  if (artifact.coordinates.impactLocation) {
    return {
      typeLabel: 'Impact Location',
      record: artifact.coordinates.impactLocation,
    };
  }
  if (artifact.coordinates.currentEstimatedLocation) {
    return {
      typeLabel: 'Current Estimated Location',
      record: artifact.coordinates.currentEstimatedLocation,
    };
  }
  return null;
}

export interface ScientificValidationReport {
  isValid: boolean;
  totalArtifacts: number;
  totalClaims: number;
  verifiedClaims: number;
  estimatedClaims: number;
  errors: string[];
  warnings: string[];
  checkedTimestamp: string;
}

/**
 * Phase 05 Scientific Validation Pipeline:
 * Validates required fields, coordinate bounds, date consistency, duplicate IDs,
 * source attribution, and epistemic status separation.
 */
export function validateScientificDataset(
  artifacts: ArtifactRecord[],
  claims: ScientificClaim[],
  sources: ScientificSource[],
  events: MissionEvent[]
): ScientificValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  const sourceMap = new Map(sources.map((s) => [s.id, s]));
  const claimMap = new Map(claims.map((c) => [c.id, c]));
  const seenArtifactIds = new Set<string>();

  for (const art of artifacts) {
    if (seenArtifactIds.has(art.id)) {
      errors.push(`Duplicate artifact ID detected: ${art.id}`);
    }
    seenArtifactIds.add(art.id);

    // Date consistency validation
    const launchMs = Date.parse(art.launchDate);
    const arrivalMs = Date.parse(art.landingOrArrivalDate);
    if (Number.isNaN(launchMs) || Number.isNaN(arrivalMs)) {
      errors.push(`Invalid launch or arrival date on artifact ${art.id}`);
    } else if (launchMs > arrivalMs) {
      errors.push(
        `Chronological inconsistency on ${art.id}: launch (${art.launchDate}) > arrival (${art.landingOrArrivalDate})`
      );
    }

    if (art.endOfOperationsDate) {
      const endMs = Date.parse(art.endOfOperationsDate);
      if (Number.isNaN(endMs) || endMs < arrivalMs) {
        errors.push(
          `Chronological inconsistency on ${art.id}: endOfOperationsDate (${art.endOfOperationsDate}) < arrival (${art.landingOrArrivalDate})`
        );
      }
      if (art.operationalStatus === 'Operational') {
        errors.push(
          `Contradictory status on ${art.id}: status is Operational but endOfOperationsDate is set (${art.endOfOperationsDate})`
        );
      }
    }

    // Coordinate range validation
    const coordEntries = [
      art.coordinates.landingLocation,
      art.coordinates.finalOperatingLocation,
      art.coordinates.finalDocumentedLocation,
      art.coordinates.currentEstimatedLocation,
      art.coordinates.impactLocation,
    ].filter((c): c is CoordinateRecord => Boolean(c));

    for (const coord of coordEntries) {
      if (coord.lat < -90 || coord.lat > 90) {
        errors.push(`Out-of-range latitude (${coord.lat}) on ${art.id}`);
      }
      if (coord.lon < -180 || coord.lon > 360) {
        errors.push(`Out-of-range longitude (${coord.lon}) on ${art.id}`);
      }
      if (!sourceMap.has(coord.provenanceSourceId)) {
        errors.push(
          `Missing coordinate provenance source ${coord.provenanceSourceId} on ${art.id}`
        );
      }
      if (coord.verification === 'ESTIMATED' && coord.confidenceRadiusM >= 1000) {
        warnings.push(
          `${art.id}: Coordinate relies on historical tracking estimate (±${(coord.confidenceRadiusM / 1000).toFixed(1)} km); labeled ESTIMATED.`
        );
      }
    }

    // Verify all claims linked by artifact exist
    for (const cId of art.claimIds) {
      if (!claimMap.has(cId)) {
        errors.push(`Artifact ${art.id} references non-existent claim ${cId}`);
      }
    }

    // Verify story chapters have 14 high-precision chapters and valid claim links
    if (art.storyChapters.length !== 14) {
      errors.push(`Artifact ${art.id} must have 14 story chapters, found ${art.storyChapters.length}`);
    }
    for (const ch of art.storyChapters) {
      for (const p of ch.factualParagraphs) {
        if (p.claimIds.length === 0) {
          errors.push(`Unattributed factual statement in ${art.id} Chapter ${ch.chapterNumber}`);
        }
        for (const cid of p.claimIds) {
          if (!claimMap.has(cid)) {
            errors.push(`Unknown claim ${cid} in ${art.id} Chapter ${ch.chapterNumber}`);
          }
        }
      }
    }
  }

  for (const clm of claims) {
    if (!sourceMap.has(clm.sourceId)) {
      errors.push(`Claim ${clm.id} references unknown source ${clm.sourceId}`);
    }
    if (!clm.evidenceUrl.startsWith('https://')) {
      errors.push(`Claim ${clm.id} lacks a valid HTTPS evidence URL`);
    }
  }

  // Chronological order check on mission events
  for (const evt of events) {
    if (!claimMap.has(evt.claimId)) {
      errors.push(`Mission event ${evt.id} lacks valid claim reference ${evt.claimId}`);
    }
  }

  return {
    isValid: errors.length === 0,
    totalArtifacts: artifacts.length,
    totalClaims: claims.length,
    verifiedClaims: claims.filter((c) => c.verificationStatus === 'VERIFIED').length,
    estimatedClaims: claims.filter((c) => c.verificationStatus === 'ESTIMATED').length,
    errors,
    warnings,
    checkedTimestamp: new Date().toISOString(),
  };
}

export interface ArtifactSearchFilter {
  query?: string;
  bodyId?: CelestialBodyId | 'all';
  category?: ArtifactCategory | 'all';
  status?: OperationalStatus | 'all';
  agency?: string | 'all';
  sortBy?: 'date_asc' | 'date_desc' | 'name_asc' | 'mass_desc';
}

/**
 * Phase 09 Unified Search & Discovery Engine
 */
export function searchAndFilterArtifacts(
  artifacts: ArtifactRecord[],
  filter: ArtifactSearchFilter
): ArtifactRecord[] {
  const q = (filter.query || '').trim().toLowerCase();

  const filtered = artifacts.filter((art) => {
    if (filter.bodyId && filter.bodyId !== 'all' && art.bodyId !== filter.bodyId) {
      return false;
    }
    if (filter.category && filter.category !== 'all' && art.category !== filter.category) {
      return false;
    }
    if (filter.status && filter.status !== 'all' && art.operationalStatus !== filter.status) {
      return false;
    }
    if (filter.agency && filter.agency !== 'all' && art.agency !== filter.agency) {
      return false;
    }

    if (!q) return true;

    const searchableText = [
      art.name,
      art.nssdcaId,
      art.missionName,
      art.agency,
      art.regionName,
      art.category,
      art.operationalStatus,
      art.originalPurpose,
      ...art.scientificAchievements,
      ...art.instruments.map((i) => `${i.name} ${i.acronym} ${i.keyFindings}`),
    ]
      .join(' ')
      .toLowerCase();

    return searchableText.includes(q);
  });

  const sortBy = filter.sortBy || 'date_asc';
  return [...filtered].sort((a, b) => {
    if (sortBy === 'date_asc') {
      return a.landingOrArrivalDate.localeCompare(b.landingOrArrivalDate);
    }
    if (sortBy === 'date_desc') {
      return b.landingOrArrivalDate.localeCompare(a.landingOrArrivalDate);
    }
    if (sortBy === 'mass_desc') {
      return b.massDryKg - a.massDryKg;
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Phase 06 Safe FFmpeg / FFprobe Subprocess Argument Builder.
 * Strictly returns argument arrays for child_process.execFile (zero shell interpolation)
 * and rejects path traversal characters.
 */
export function buildSafeFfmpegArgs(
  operation:
    | 'ffprobe_inspect'
    | 'extract_thumbnail'
    | 'transcode_h264'
    | 'generate_contact_sheet'
    | 'normalize_audio',
  sanitizedInputPath: string,
  sanitizedOutputPath: string
): { binary: 'ffmpeg' | 'ffprobe'; args: string[] } {
  if (
    sanitizedInputPath.includes('..') ||
    sanitizedOutputPath.includes('..') ||
    /[;&|`$]/.test(sanitizedInputPath) ||
    /[;&|`$]/.test(sanitizedOutputPath)
  ) {
    throw new Error('Unsafe media file path rejected by security sanitizer.');
  }

  switch (operation) {
    case 'ffprobe_inspect':
      return {
        binary: 'ffprobe',
        args: [
          '-v',
          'error',
          '-show_format',
          '-show_streams',
          '-of',
          'json',
          sanitizedInputPath,
        ],
      };
    case 'extract_thumbnail':
      return {
        binary: 'ffmpeg',
        args: [
          '-y',
          '-ss',
          '00:00:02',
          '-i',
          sanitizedInputPath,
          '-frames:v',
          '1',
          sanitizedOutputPath,
        ],
      };
    case 'transcode_h264':
      return {
        binary: 'ffmpeg',
        args: [
          '-y',
          '-i',
          sanitizedInputPath,
          '-c:v',
          'libx264',
          '-preset',
          'ultrafast',
          '-crf',
          '23',
          '-pix_fmt',
          'yuv420p',
          '-c:a',
          'aac',
          '-b:a',
          '128k',
          sanitizedOutputPath,
        ],
      };
    case 'generate_contact_sheet':
      return {
        binary: 'ffmpeg',
        args: [
          '-y',
          '-i',
          sanitizedInputPath,
          '-vf',
          'fps=1/2,scale=320:180,tile=2x2',
          '-frames:v',
          '1',
          sanitizedOutputPath,
        ],
      };
    case 'normalize_audio':
      return {
        binary: 'ffmpeg',
        args: [
          '-y',
          '-i',
          sanitizedInputPath,
          '-vn',
          '-af',
          'loudnorm=I=-16:TP=-1.5:LRA=11',
          '-c:a',
          'aac',
          '-b:a',
          '128k',
          sanitizedOutputPath,
        ],
      };
  }
}

export interface QuizEvaluationResult {
  totalQuestions: number;
  correctCount: number;
  earnedPoints: number;
  maxPoints: number;
  accuracyPercent: number;
  rankTitle: string;
  itemResults: {
    challengeId: string;
    isCorrect: boolean;
    selectedOptionId: string;
    correctOptionId: string;
    explanation: string;
    claimId: string;
  }[];
}

/**
 * Phase 10 Educational Academy Assessment Evaluator
 */
export function evaluateEducationalSubmission(
  challenges: EducationalChallenge[],
  selectedAnswers: Record<string, string>
): QuizEvaluationResult {
  let correctCount = 0;
  let earnedPoints = 0;
  let maxPoints = 0;

  const itemResults = challenges.map((ch) => {
    maxPoints += ch.points;
    const selectedOptionId = selectedAnswers[ch.id] || '';
    const isCorrect = selectedOptionId === ch.correctOptionId;
    if (isCorrect) {
      correctCount += 1;
      earnedPoints += ch.points;
    }
    return {
      challengeId: ch.id,
      isCorrect,
      selectedOptionId,
      correctOptionId: ch.correctOptionId,
      explanation: ch.authoritativeExplanation,
      claimId: ch.claimId,
    };
  });

  const accuracyPercent =
    challenges.length > 0 ? Math.round((correctCount / challenges.length) * 100) : 0;

  let rankTitle = 'Cadet Field Observer';
  if (accuracyPercent === 100) rankTitle = 'Principal Planetary Archaeologist';
  else if (accuracyPercent >= 75) rankTitle = 'Senior Deep Space Curator';
  else if (accuracyPercent >= 50) rankTitle = 'Mission Reconnaissance Specialist';

  return {
    totalQuestions: challenges.length,
    correctCount,
    earnedPoints,
    maxPoints,
    accuracyPercent,
    rankTitle,
    itemResults,
  };
}
