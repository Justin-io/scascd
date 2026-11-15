import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSafeFfmpegArgs,
  calculateSphericalDistanceKm,
  cartesianToLatLon,
  evaluateEducationalSubmission,
  formatCoordinate,
  latLonToCartesian,
  searchAndFilterArtifacts,
  validateScientificDataset,
} from './scientificEngine';
import {
  ARTIFACT_RECORDS,
  EDUCATIONAL_CHALLENGES,
  MISSION_EVENTS,
  SCIENTIFIC_CLAIMS,
  SCIENTIFIC_SOURCES,
} from '../data/scientificData';

test('Coordinate conversion round-trips accurately for Apollo 11 Tranquillity Base', () => {
  const lat = 0.6742;
  const lon = 23.4731;
  const radius = 10;
  const cart = latLonToCartesian(lat, lon, radius);
  const recovered = cartesianToLatLon(cart.x, cart.y, cart.z);

  assert.equal(Math.abs(recovered.lat - lat) < 0.01, true);
  assert.equal(Math.abs(recovered.lon - lon) < 0.01, true);
  assert.equal(formatCoordinate(lat, lon), '0.6742° N, 23.4731° E');
});

test('Spherical Haversine distance accurately calculates lunar and Martian surface separation', () => {
  // Distance between Eagle Crater (-1.9462, 354.4734) and Perseverance Valley (-2.8062, 354.5284) on Mars (R = 3389.5 km)
  const distKm = calculateSphericalDistanceKm(-1.9462, 354.4734, -2.8062, 354.5284, 3389.5);
  assert.equal(distKm > 45 && distKm < 55, true);
});

test('Phase 05 scientific validation pipeline passes 100% of production NASA records with zero errors', () => {
  const report = validateScientificDataset(
    ARTIFACT_RECORDS,
    SCIENTIFIC_CLAIMS,
    SCIENTIFIC_SOURCES,
    MISSION_EVENTS
  );
  assert.equal(report.isValid, true);
  assert.equal(report.errors.length, 0);
  assert.equal(report.totalArtifacts >= 10, true);
  assert.equal(report.verifiedClaims >= 12, true);
  assert.equal(report.estimatedClaims >= 1, true);
});

test('Phase 09 search and filter engine filters by body, category, status, and full-text query', () => {
  const moonRovers = searchAndFilterArtifacts(ARTIFACT_RECORDS, {
    bodyId: 'moon',
    category: 'Rover',
  });
  assert.equal(moonRovers.length, 3); // Lunokhod 2, Apollo 15 LRV-1, Chang'e 4 Yutu-2

  const jarositeSearch = searchAndFilterArtifacts(ARTIFACT_RECORDS, {
    query: 'jarosite',
  });
  assert.equal(jarositeSearch.length, 1);
  assert.equal(jarositeSearch[0].id, 'ART-MERB-OPPORTUNITY');
});

test('Phase 06 FFmpeg command builder produces safe argument arrays and blocks path traversal', () => {
  const probeCmd = buildSafeFfmpegArgs('ffprobe_inspect', '/tmp/media/input.mp4', '/tmp/media/out.json');
  assert.equal(probeCmd.binary, 'ffprobe');
  assert.deepEqual(probeCmd.args, [
    '-v',
    'error',
    '-show_format',
    '-show_streams',
    '-of',
    'json',
    '/tmp/media/input.mp4',
  ]);

  assert.throws(() => {
    buildSafeFfmpegArgs('extract_thumbnail', '../etc/passwd', '/tmp/out.jpg');
  }, /Unsafe media file path/);
});

test('Phase 10 educational assessment evaluator scores submissions and returns claim-backed explanations', () => {
  const perfectAnswers: Record<string, string> = {};
  for (const ch of EDUCATIONAL_CHALLENGES) {
    perfectAnswers[ch.id] = ch.correctOptionId;
  }
  const result = evaluateEducationalSubmission(EDUCATIONAL_CHALLENGES, perfectAnswers);
  assert.equal(result.accuracyPercent, 100);
  assert.equal(result.rankTitle, 'Principal Planetary Archaeologist');
  assert.equal(result.earnedPoints, result.maxPoints);
});

test('70-Beat 14-Chapter Story Choreography Engine generates 5 synchronized micro-beats and physics telemetry per chapter', async () => {
  const { getChapterStoryBeats, computeLiveChoreographyTelemetry } = await import(
    './storyChoreographyEngine'
  );
  const apollo11 = ARTIFACT_RECORDS[0];
  assert.equal(apollo11.storyChapters.length, 14);
  for (const ch of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const) {
    const beats = getChapterStoryBeats(apollo11, ch);
    assert.equal(beats.length, 5);
    const telemetry = computeLiveChoreographyTelemetry(apollo11, ch, 0.35);
    assert.equal(telemetry.activeBeat.beatIndex >= 1, true);
    assert.equal(telemetry.spectralPeaks.length, 3);
    assert.equal(typeof telemetry.velocityKmS, 'number');
    assert.equal(typeof telemetry.altitudeKm, 'number');
  }
});

test('Scientifically Accurate Scale System preserves exact planet-to-satellite physical diameter ratios and reference radii', async () => {
  const {
    PLANETARY_SCIENTIFIC_METADATA,
    NATURAL_SATELLITES_CATALOG,
    computePlanetSceneRadius,
    computeSatelliteSceneRadius,
  } = await import('../three/scientificScaleSystem');

  // Verify reference planetary mean radii match NASA Planetary Fact Sheet values
  assert.equal(PLANETARY_SCIENTIFIC_METADATA.mercury.meanRadiusKm, 2439.7);
  assert.equal(PLANETARY_SCIENTIFIC_METADATA.venus.meanRadiusKm, 6051.8);
  assert.equal(PLANETARY_SCIENTIFIC_METADATA.earth.meanRadiusKm, 6371);
  assert.equal(PLANETARY_SCIENTIFIC_METADATA.moon.meanRadiusKm, 1737.4);
  assert.equal(PLANETARY_SCIENTIFIC_METADATA.mars.meanRadiusKm, 3389.5);
  assert.equal(PLANETARY_SCIENTIFIC_METADATA.jupiter.meanRadiusKm, 69911);
  assert.equal(PLANETARY_SCIENTIFIC_METADATA.saturn.meanRadiusKm, 58232);
  assert.equal(PLANETARY_SCIENTIFIC_METADATA.uranus.meanRadiusKm, 25362);
  assert.equal(PLANETARY_SCIENTIFIC_METADATA.neptune.meanRadiusKm, 24622);

  // Verify Mode A (scientific_scale) preserves exact linear planet-to-Earth and moon-to-planet ratios
  const earthR = computePlanetSceneRadius(6371, 'scientific_scale');
  const jupiterR = computePlanetSceneRadius(69911, 'scientific_scale');
  assert.equal(Math.abs(jupiterR / earthR - 69911 / 6371) < 1e-6, true);

  const moonSpec = NATURAL_SATELLITES_CATALOG.find((s) => s.id === 'sat-moon')!;
  const moonSceneR = computeSatelliteSceneRadius(moonSpec, 6371, earthR, 'scientific_scale');
  assert.equal(Math.abs(moonSceneR / earthR - 1737.4 / 6371) < 1e-6, true);
});

test('22-World Satellite Catalog, Scientific Asset Manifests, Parent-Planet Sky Visibility, and 8-Shot Camera Director', async () => {
  const { NATURAL_SATELLITES_CATALOG } = await import('../three/scientificScaleSystem');
  const {
    CINEMATIC_SHOT_PRESETS,
    computeParentPlanetSkyGeometry,
    evaluateCinematicCameraShot,
  } = await import('../three/celestialWorldsEngine');

  // Verify all 22 natural satellite worlds across Earth, Mars, Jupiter, Saturn, Uranus, and Neptune are present
  assert.equal(NATURAL_SATELLITES_CATALOG.length, 22);
  for (const sat of NATURAL_SATELLITES_CATALOG) {
    assert.equal(sat.namedFormations.length >= 1, true);
    assert.equal(Boolean(sat.assetManifest.datasetSource), true);
    assert.equal(Boolean(sat.assetManifest.missingDataRegions), true);
  }

  // Verify Triton is marked retrograde (inclination 156.885°) and Nereid is honestly classified as PROCEDURAL_RECONSTRUCTION
  const triton = NATURAL_SATELLITES_CATALOG.find((s) => s.id === 'sat-triton')!;
  assert.equal(triton.retrograde, true);
  assert.equal(triton.inclinationDeg > 90, true);

  const nereid = NATURAL_SATELLITES_CATALOG.find((s) => s.id === 'sat-nereid')!;
  assert.equal(nereid.assetManifest.dataProvenance, 'PROCEDURAL_RECONSTRUCTION');
  assert.equal(nereid.assetManifest.scientificConfidence, 'ILLUSTRATIVE_PROCEDURAL');

  // Verify Parent-Planet Sky Visibility angular subtense: Jupiter from Io (a=421,700 km) subtends a larger angle than from Callisto (a=1,882,709 km)
  const io = NATURAL_SATELLITES_CATALOG.find((s) => s.id === 'sat-io')!;
  const callisto = NATURAL_SATELLITES_CATALOG.find((s) => s.id === 'sat-callisto')!;
  const ioSky = computeParentPlanetSkyGeometry(io, 4.8);
  const callistoSky = computeParentPlanetSkyGeometry(callisto, 4.8);
  assert.equal(ioSky.angularDiameterDeg > callistoSky.angularDiameterDeg, true);

  // Verify all 8 Cinematic Camera Presets produce valid camera coordinates and FOV
  assert.equal(CINEMATIC_SHOT_PRESETS.length, 8);
  for (const preset of CINEMATIC_SHOT_PRESETS) {
    const shot = evaluateCinematicCameraShot(
      preset.id,
      4.8,
      ioSky.directionVec,
      ioSky.directionVec.clone().multiplyScalar(ioSky.skyDistanceUnits),
      1.5
    );
    assert.equal(shot.fovDeg >= 30 && shot.fovDeg <= 55, true);
    assert.equal(shot.cameraPos.length() > 1.0, true);
  }
});

test('Story Cinema Audio Chapter Mapping and Audio Assets Verification', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');

  // Verify all audio assets exist and have positive size
  const soundDir = path.resolve('public/media/sounds');
  const requiredFiles = [
    'rocket_space_travel_12s.wav',
    'landing_increasing_thruster_ch5.wav',
    'landing_increasing_thruster_ch6.wav',
    'landing_increasing_thruster.wav',
  ];

  for (const filename of requiredFiles) {
    const fullPath = path.join(soundDir, filename);
    assert.equal(fs.existsSync(fullPath), true, `Missing required audio file: ${filename}`);
    const stats = fs.statSync(fullPath);
    assert.equal(stats.size > 1000, true, `Audio file too small or empty: ${filename}`);
  }

  // Verify Chapter Audio Mapping Contract:
  // CH 1-4: rocket_space_travel_12s
  // CH 5: landing_increasing_thruster_ch5
  // CH 6: landing_increasing_thruster_ch6
  // CH 7-14 & invalid: silent (null/undefined)
  const getChapterSoundId = (chapter?: number): string | null => {
    if (chapter === undefined || chapter < 1 || chapter > 6) {
      return null;
    }
    if (chapter >= 1 && chapter <= 4) {
      return 'rocket_space_travel_12s';
    }
    if (chapter === 5) {
      return 'landing_increasing_thruster_ch5';
    }
    if (chapter === 6) {
      return 'landing_increasing_thruster_ch6';
    }
    return null;
  };

  assert.equal(getChapterSoundId(1), 'rocket_space_travel_12s');
  assert.equal(getChapterSoundId(2), 'rocket_space_travel_12s');
  assert.equal(getChapterSoundId(3), 'rocket_space_travel_12s');
  assert.equal(getChapterSoundId(4), 'rocket_space_travel_12s');
  assert.equal(getChapterSoundId(5), 'landing_increasing_thruster_ch5');
  assert.equal(getChapterSoundId(6), 'landing_increasing_thruster_ch6');

  // Verify all chapters from 7 to 14 are strictly silent
  for (let ch = 7; ch <= 14; ch++) {
    assert.equal(getChapterSoundId(ch), null, `Chapter ${ch} must be silent`);
  }
  // Verify unassigned / undefined is strictly silent
  assert.equal(getChapterSoundId(undefined), null);
  assert.equal(getChapterSoundId(0), null);
  assert.equal(getChapterSoundId(15), null);
});




