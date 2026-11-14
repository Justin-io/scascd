import * as THREE from 'three';
import {
  CinematicShotPreset,
  ExperiencePresentationMode,
} from '../types/afterlight';
import { latLonToCartesian } from '../utils/scientificEngine';
import {
  AuthenticSolarTextures,
  createAtmosphereMesh,
  createEarthDayNightMaterial,
} from './proceduralAssets';
import {
  buildSatelliteActivePlumeGroup,
  createNaturalSatelliteMaterial,
  createSaturnMultiBandRingSystem,
  evaluateSatelliteVertexDisplacement,
  NaturalSatelliteSpec,
  PLANETARY_SCIENTIFIC_METADATA,
  SatelliteGeologicalFormation,
} from './scientificScaleSystem';

export interface SatelliteWorldStageRig {
  group: THREE.Group;
  satelliteMesh: THREE.Mesh;
  plumeGroup: THREE.Group | null;
  plumeParticles: THREE.Points | null;
  volcanicLight: THREE.PointLight | null;
  parentPlanetGroup: THREE.Group;
  parentPlanetPosition: THREE.Vector3;
  formationMarkersGroup: THREE.Group;
  graticuleGroup: THREE.Group;
  primaryFormationWorldPos: THREE.Vector3;
  interactables: THREE.Object3D[];
}

export interface CinematicShotMetadata {
  id: CinematicShotPreset;
  label: string;
  shortLabel: string;
  fovDeg: number;
  description: string;
}

export const CINEMATIC_SHOT_PRESETS: CinematicShotMetadata[] = [
  {
    id: 'GRAND_REVEAL',
    label: '01 · Grand Reveal',
    shortLabel: 'Grand Reveal',
    fovDeg: 44,
    description: 'Full-hemisphere sunlit reveal showcasing global albedo dichotomy, craters, and limb relief.',
  },
  {
    id: 'ORBITAL_APPROACH',
    label: '02 · Orbital Approach',
    shortLabel: 'Approach',
    fovDeg: 42,
    description: 'Gradual orbital trajectory approach across the terminator transition zone.',
  },
  {
    id: 'SURFACE_DESCENT',
    label: '03 · Surface Descent',
    shortLabel: 'Descent',
    fovDeg: 40,
    description: 'Low-altitude descent toward the world’s primary geological province.',
  },
  {
    id: 'HORIZON_SHOT',
    label: '04 · Horizon Shot',
    shortLabel: 'Horizon',
    fovDeg: 36,
    description: 'Grazing skim across the curved planetary horizon with the blackness of space above.',
  },
  {
    id: 'GEOLOGICAL_CLOSEUP',
    label: '05 · Geological Close-Up',
    shortLabel: 'Close-Up',
    fovDeg: 34,
    description: 'High-magnification inspection of the signature crater, caldera, chasma, or ridge.',
  },
  {
    id: 'PLANET_IN_SKY',
    label: '06 · Planet in Sky',
    shortLabel: 'Planet in Sky',
    fovDeg: 38,
    description: 'Frames the parent planet (Jupiter, Saturn & Rings, Uranus, Neptune, Earth, Mars) rising above the moon’s horizon.',
  },
  {
    id: 'ORBITAL_TRACKING',
    label: '07 · Orbital Tracking',
    shortLabel: 'Orbit Track',
    fovDeg: 44,
    description: 'Continuous polar-to-equatorial orbital tracking pass around the satellite.',
  },
  {
    id: 'DEEP_SPACE_WIDE',
    label: '08 · Deep Space Wide',
    shortLabel: 'Wide Space',
    fovDeg: 50,
    description: 'Wide environmental composition framing both the satellite world and its parent planetary system.',
  },
];

/**
 * ParentPlanetVisibilityEngine:
 * Computes the scientifically grounded angular subtense and relative sky position of the parent planet
 * as seen from its natural satellite (`2 * atan(R_parent / a_orbit)`).
 */
export function computeParentPlanetSkyGeometry(
  sat: NaturalSatelliteSpec,
  stageSatelliteRadius: number
): {
  angularDiameterDeg: number;
  skyDistanceUnits: number;
  skyRadiusUnits: number;
  directionVec: THREE.Vector3;
} {
  const parentMeta = PLANETARY_SCIENTIFIC_METADATA[sat.parentId];
  const parentRadiusKm = parentMeta ? parentMeta.meanRadiusKm : 6371;
  const orbitKm = Math.max(parentRadiusKm * 1.5, sat.semimajorAxisKm);

  const angularRad = 2 * Math.atan(parentRadiusKm / orbitKm);
  const angularDiameterDeg = (angularRad * 180) / Math.PI;

  // Place the parent planet in the upper-right sky quadrant (+X, +Y, -Z)
  // so that it rises prominently above the moon's upper-right horizon away from the top-left HUD card
  const skyDistanceUnits = stageSatelliteRadius * 9.2;
  // Preserve physically meaningful angular size (clamped slightly so outer moons like Iapetus/Callisto still show a recognizable parent disk)
  const rawSkyRadius = Math.tan(angularRad * 0.5) * skyDistanceUnits * 2.8;
  const skyRadiusUnits = Math.max(
    stageSatelliteRadius * 0.45,
    Math.min(stageSatelliteRadius * 2.35, rawSkyRadius)
  );

  const incRad = ((sat.inclinationDeg % 30) * Math.PI) / 180;
  const directionVec = new THREE.Vector3(
    0.46,
    0.26 + Math.sin(incRad) * 0.16,
    -0.85
  ).normalize();

  return {
    angularDiameterDeg,
    skyDistanceUnits,
    skyRadiusUnits,
    directionVec,
  };
}

/**
 * SatelliteWorldEngine:
 * Constructs a high-resolution (`144 × 108` displaced vertices = 31,104 triangles) close-up
 * Satellite World Exploration Stage complete with:
 * - Multi-scale 3D displaced surface topology & triaxial shape scaling
 * - Bespoke PBR material (plus geological relief emphasis in `geological` mode)
 * - Active volcanic/cryovolcanic particle plumes & thermal point light (Io, Enceladus, Triton)
 * - Parent planet suspended in the sky with accurate rings/clouds (`ParentPlanetVisibilityEngine`)
 * - Named geological formation 3D markers & coordinate graticule
 */
export function buildSatelliteWorldStage(
  sat: NaturalSatelliteSpec,
  stageRadius: number,
  solarTex: AuthenticSolarTextures,
  presentationMode: ExperiencePresentationMode,
  showGeology: boolean,
  showGraticule: boolean
): SatelliteWorldStageRig {
  const group = new THREE.Group();
  group.name = `satellite-world-stage-${sat.id}`;
  const interactables: THREE.Object3D[] = [];

  // 1. Triaxial aspect scaling (e.g., Phobos, Deimos, Mimas, Miranda, Proteus)
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

  // 2. High-polygon 144x108 displaced BufferGeometry (31,104 triangles)
  const geom = new THREE.SphereGeometry(stageRadius, 144, 108);
  const pos = geom.attributes.position;
  const reliefMultiplier = presentationMode === 'geological' ? 1.45 : 1.0;

  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);
    const len = Math.hypot(vx, vy, vz) || 1;
    const nx = vx / len;
    const ny = vy / len;
    const nz = vz / len;
    const disp =
      evaluateSatelliteVertexDisplacement(nx, ny, nz, sat) * reliefMultiplier;
    const rNew = stageRadius * (1 + disp);
    pos.setXYZ(i, nx * rNew * scaleX, ny * rNew * scaleY, nz * rNew * scaleZ);
  }
  geom.computeVertexNormals();

  const baseMat = createNaturalSatelliteMaterial(sat, solarTex);
  const mat = baseMat.clone();
  mat.bumpScale =
    (baseMat.bumpScale || 0.09) * (presentationMode === 'geological' ? 1.55 : 1.15);

  const satelliteMesh = new THREE.Mesh(geom, mat);
  satelliteMesh.castShadow = true;
  satelliteMesh.receiveShadow = true;
  satelliteMesh.userData = {
    interactionType: 'globe_surface',
    satelliteId: sat.id,
    bodyId: sat.parentId,
    datum: sat.assetManifest.coordinateSystem,
    label: `${sat.name} · Mean R = ${sat.meanRadiusKm.toLocaleString()} km`,
  };
  group.add(satelliteMesh);
  interactables.push(satelliteMesh);

  // 3. Layered Planetary Atmosphere / Exosphere Scattering
  if (sat.id === 'sat-titan') {
    const titanOpacity = presentationMode === 'geological' ? 0.24 : 0.52;
    group.add(createAtmosphereMesh(stageRadius * 1.018, '#d97706', titanOpacity));
    group.add(createAtmosphereMesh(stageRadius * 1.058, '#38bdf8', titanOpacity * 0.45));
  } else if (sat.id === 'sat-triton') {
    group.add(createAtmosphereMesh(stageRadius * 1.014, '#93c5fd', 0.26));
  } else if (sat.id === 'sat-europa') {
    group.add(createAtmosphereMesh(stageRadius * 1.01, '#bae6fd', 0.22));
  } else if (sat.id === 'sat-io') {
    group.add(createAtmosphereMesh(stageRadius * 1.015, '#f59e0b', 0.24));
  }

  // 4. Active Volcanic / Cryovolcanic Plumes + Particle System + Dynamic Point Light
  let plumeGroup: THREE.Group | null = null;
  let plumeParticles: THREE.Points | null = null;
  let volcanicLight: THREE.PointLight | null = null;

  if (sat.hasActivePlumes) {
    plumeGroup = buildSatelliteActivePlumeGroup(sat, stageRadius);
    group.add(plumeGroup);

    // Build 420-particle organic cryovolcanic / sulfur plume stream
    const pCount = 420;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const r1 = Math.abs(Math.sin(i * 12.9898 + 4.1) * 43758.5453) % 1;
      const r2 = Math.abs(Math.sin(i * 78.233 + 9.3) * 43758.5453) % 1;
      const r3 = Math.abs(Math.sin(i * 45.164 + 2.7) * 43758.5453) % 1;

      const angle = r2 * Math.PI * 2;
      if (sat.id === 'sat-enceladus' || sat.id === 'sat-triton') {
        // South-polar plume stream
        const spread = Math.pow(r1, 0.75) * stageRadius * 0.34 * (0.3 + r3 * 0.7);
        pPositions[i * 3] = Math.cos(angle) * spread;
        pPositions[i * 3 + 1] = -stageRadius * (0.98 + r1 * 1.35);
        pPositions[i * 3 + 2] = Math.sin(angle) * spread;
      } else {
        // Io Pele / Loki limb volcanic plume umbrella
        const dir = new THREE.Vector3(0.88, 0.36, -0.31).normalize();
        const tangentA = new THREE.Vector3(-dir.y, dir.x, 0).normalize();
        const tangentB = new THREE.Vector3().crossVectors(dir, tangentA).normalize();
        const alt = stageRadius * (1.0 + Math.sin(r1 * Math.PI) * 0.26);
        const radialSpread = r1 * stageRadius * 0.28 * (0.4 + r3 * 0.6);
        const pt = dir
          .clone()
          .multiplyScalar(alt)
          .addScaledVector(tangentA, Math.cos(angle) * radialSpread)
          .addScaledVector(tangentB, Math.sin(angle) * radialSpread);
        pPositions[i * 3] = pt.x;
        pPositions[i * 3 + 1] = pt.y;
        pPositions[i * 3 + 2] = pt.z;
      }
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: new THREE.Color(sat.plumeColorHex || '#7dd3fc'),
      size: 0.068,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    plumeParticles = new THREE.Points(pGeo, pMat);
    group.add(plumeParticles);
  }

  if (sat.hasThermalLavaEmission) {
    volcanicLight = new THREE.PointLight(0xff5500, 0.45, stageRadius * 2.8);
    volcanicLight.position.set(stageRadius * 0.92, stageRadius * 0.32, -stageRadius * 0.25);
    group.add(volcanicLight);
  }

  // 5. ParentPlanetVisibilityEngine: Build the Parent Planet in the Sky!
  const skyGeom = computeParentPlanetSkyGeometry(sat, stageRadius);
  const parentPlanetGroup = new THREE.Group();
  const parentPlanetPosition = skyGeom.directionVec
    .clone()
    .multiplyScalar(skyGeom.skyDistanceUnits);
  parentPlanetGroup.position.copy(parentPlanetPosition);

  const pRadius = skyGeom.skyRadiusUnits;
  let parentMat: THREE.Material;
  if (sat.parentId === 'jupiter') {
    parentMat = new THREE.MeshStandardMaterial({
      map: solarTex.jupiter,
      roughness: 0.68,
      envMapIntensity: 0.14,
    });
  } else if (sat.parentId === 'saturn') {
    parentMat = new THREE.MeshStandardMaterial({
      map: solarTex.saturn,
      roughness: 0.7,
      envMapIntensity: 0.14,
    });
  } else if (sat.parentId === 'uranus') {
    parentMat = new THREE.MeshStandardMaterial({
      map: solarTex.uranus,
      roughness: 0.64,
      envMapIntensity: 0.14,
    });
  } else if (sat.parentId === 'neptune') {
    parentMat = new THREE.MeshStandardMaterial({
      map: solarTex.neptune,
      roughness: 0.64,
      envMapIntensity: 0.14,
    });
  } else if (sat.parentId === 'mars') {
    parentMat = new THREE.MeshStandardMaterial({
      map: solarTex.mars,
      bumpMap: solarTex.marsBump,
      bumpScale: 0.06,
      roughness: 0.86,
    });
  } else {
    parentMat = createEarthDayNightMaterial(
      solarTex.earthDay,
      solarTex.earthNight,
      new THREE.Vector3(50, 20, 40)
    );
  }

  const parentMesh = new THREE.Mesh(
    new THREE.SphereGeometry(pRadius, 64, 48),
    parentMat
  );
  parentMesh.userData = {
    interactionType: 'body',
    bodyId: sat.parentId,
    label: `Parent Planet: ${sat.parentBody} (Angular Size ${skyGeom.angularDiameterDeg.toFixed(2)}° from ${sat.name})`,
  };
  parentPlanetGroup.add(parentMesh);
  interactables.push(parentMesh);

  if (sat.parentId === 'saturn') {
    const rings = createSaturnMultiBandRingSystem(pRadius, solarTex.saturnRing);
    parentPlanetGroup.add(rings);
  } else if (sat.parentId === 'uranus') {
    const uRingGeo = new THREE.RingGeometry(pRadius * 1.32, pRadius * 1.82, 72);
    uRingGeo.rotateX(-Math.PI / 2);
    const uRingMat = new THREE.MeshStandardMaterial({
      map: solarTex.uranusRing,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const uRing = new THREE.Mesh(uRingGeo, uRingMat);
    uRing.rotation.z = (97.77 * Math.PI) / 180;
    parentPlanetGroup.add(uRing);
  }
  group.add(parentPlanetGroup);

  // 6. Named Geological Formation Markers
  const formationMarkersGroup = new THREE.Group();
  formationMarkersGroup.visible = showGeology || presentationMode === 'geological';
  const primaryFormationWorldPos = new THREE.Vector3(
    stageRadius * 0.72,
    stageRadius * 0.18,
    stageRadius * 0.68
  );

  sat.namedFormations.forEach((form: SatelliteGeologicalFormation, idx: number) => {
    const rawPos = latLonToCartesian(form.lat, form.lon, stageRadius * 1.035);
    const worldPos = new THREE.Vector3(
      rawPos.x * scaleX,
      rawPos.y * scaleY,
      rawPos.z * scaleZ
    );
    if (idx === 0) {
      primaryFormationWorldPos.copy(worldPos);
    }

    const markerAnchor = new THREE.Group();
    markerAnchor.position.copy(worldPos);
    const normalVec = worldPos.clone().normalize();
    markerAnchor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normalVec);

    const ringRadius = Math.max(0.22, Math.min(0.68, form.diameterKm / Math.max(15, sat.meanRadiusKm * 0.65)));
    const ringGeo = new THREE.RingGeometry(ringRadius * 0.82, ringRadius, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: idx === 0 ? 0xf59e0b : 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: presentationMode === 'geological' ? 0.82 : 0.55,
      depthWrite: false,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    markerAnchor.add(ringMesh);

    const hitSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 10, 10),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitSphere.userData = {
      interactionType: 'geological_formation',
      formation: form,
      label: `${form.name} (${form.featureType} · Ø ${form.diameterKm.toLocaleString()} km): ${form.description}`,
    };
    markerAnchor.add(hitSphere);
    interactables.push(hitSphere);
    formationMarkersGroup.add(markerAnchor);
  });
  group.add(formationMarkersGroup);

  // 7. Planetary Coordinate Graticule
  const graticuleGroup = new THREE.Group();
  graticuleGroup.visible = showGraticule || presentationMode === 'scientific';
  const gratMat = new THREE.LineBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.16,
  });
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts: THREE.Vector3[] = [];
    for (let lon = -180; lon <= 180; lon += 5) {
      const c = latLonToCartesian(lat, lon, stageRadius * 1.04);
      pts.push(new THREE.Vector3(c.x * scaleX, c.y * scaleY, c.z * scaleZ));
    }
    graticuleGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gratMat));
  }
  for (let lon = -180; lon < 180; lon += 30) {
    const pts: THREE.Vector3[] = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const c = latLonToCartesian(lat, lon, stageRadius * 1.04);
      pts.push(new THREE.Vector3(c.x * scaleX, c.y * scaleY, c.z * scaleZ));
    }
    graticuleGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gratMat));
  }
  group.add(graticuleGroup);

  return {
    group,
    satelliteMesh,
    plumeGroup,
    plumeParticles,
    volcanicLight,
    parentPlanetGroup,
    parentPlanetPosition,
    formationMarkersGroup,
    graticuleGroup,
    primaryFormationWorldPos,
    interactables,
  };
}

/**
 * CinematicCameraDirector:
 * Computes target camera position, look-at point, and FOV for any of the 8 Cinematic Camera Presets
 * with deliberate, depth-aware spline motion.
 */
export function evaluateCinematicCameraShot(
  shot: CinematicShotPreset,
  stageRadius: number,
  primaryFormationPos: THREE.Vector3,
  parentPlanetPos: THREE.Vector3,
  elapsedSec: number
): {
  cameraPos: THREE.Vector3;
  lookTarget: THREE.Vector3;
  fovDeg: number;
} {
  const slowDrift = Math.sin(elapsedSec * 0.22);
  const slowCos = Math.cos(elapsedSec * 0.22);

  switch (shot) {
    case 'GRAND_REVEAL': {
      return {
        cameraPos: new THREE.Vector3(
          stageRadius * 2.15 + slowDrift * 0.45,
          stageRadius * 0.72,
          stageRadius * 2.35 + slowCos * 0.45
        ),
        lookTarget: new THREE.Vector3(0, 0, 0),
        fovDeg: 44,
      };
    }
    case 'ORBITAL_APPROACH': {
      const approachT = (Math.sin(elapsedSec * 0.28) + 1) * 0.5;
      const dist = THREE.MathUtils.lerp(stageRadius * 2.85, stageRadius * 1.65, approachT);
      return {
        cameraPos: new THREE.Vector3(
          dist * 0.78,
          stageRadius * 0.45 * (1 - approachT * 0.4),
          dist * 0.78
        ),
        lookTarget: new THREE.Vector3(0, stageRadius * 0.12, 0),
        fovDeg: 42,
      };
    }
    case 'SURFACE_DESCENT': {
      const norm = primaryFormationPos.clone().normalize();
      const tangent = new THREE.Vector3(-norm.z, 0.25, norm.x).normalize();
      const camPos = norm
        .clone()
        .multiplyScalar(stageRadius * 1.48)
        .addScaledVector(tangent, stageRadius * 0.55 + slowDrift * 0.22);
      return {
        cameraPos: camPos,
        lookTarget: primaryFormationPos.clone().multiplyScalar(0.88),
        fovDeg: 40,
      };
    }
    case 'HORIZON_SHOT': {
      // Skim just above the eastern limb looking across the curved cratered horizon into deep space
      return {
        cameraPos: new THREE.Vector3(
          stageRadius * 0.92,
          stageRadius * 0.78 + slowDrift * 0.08,
          stageRadius * 0.88
        ),
        lookTarget: new THREE.Vector3(
          -stageRadius * 0.45,
          stageRadius * 0.62,
          -stageRadius * 0.55
        ),
        fovDeg: 36,
      };
    }
    case 'GEOLOGICAL_CLOSEUP': {
      const norm = primaryFormationPos.clone().normalize();
      const offset = new THREE.Vector3(0.28, 0.22, 0.28);
      return {
        cameraPos: norm
          .clone()
          .multiplyScalar(stageRadius * 1.38)
          .add(offset),
        lookTarget: primaryFormationPos.clone(),
        fovDeg: 34,
      };
    }
    case 'PLANET_IN_SKY': {
      // Position camera on the near side of the satellite so the satellite's horizon is in the foreground
      // and the giant Parent Planet (`parentPlanetPos`) rises dramatically in the upper-right sky!
      const dirToParent = parentPlanetPos.clone().normalize();
      const camPos = dirToParent
        .clone()
        .multiplyScalar(-stageRadius * 2.15)
        .add(new THREE.Vector3(-stageRadius * 0.48, -stageRadius * 0.18 + slowDrift * 0.08, stageRadius * 0.28));

      const limbMidpoint = dirToParent
        .clone()
        .multiplyScalar(stageRadius * 1.45)
        .add(new THREE.Vector3(-stageRadius * 0.12, stageRadius * 0.08, 0));

      return {
        cameraPos: camPos,
        lookTarget: limbMidpoint,
        fovDeg: 40,
      };
    }
    case 'ORBITAL_TRACKING': {
      const ang = elapsedSec * 0.32;
      const orbitDist = stageRadius * 2.25;
      return {
        cameraPos: new THREE.Vector3(
          Math.cos(ang) * orbitDist,
          Math.sin(ang * 0.5) * stageRadius * 0.65,
          Math.sin(ang) * orbitDist
        ),
        lookTarget: new THREE.Vector3(0, 0, 0),
        fovDeg: 44,
      };
    }
    case 'DEEP_SPACE_WIDE':
    default: {
      return {
        cameraPos: new THREE.Vector3(
          stageRadius * 3.1,
          stageRadius * 1.45,
          stageRadius * 3.4
        ),
        lookTarget: parentPlanetPos.clone().multiplyScalar(0.18),
        fovDeg: 50,
      };
    }
  }
}
