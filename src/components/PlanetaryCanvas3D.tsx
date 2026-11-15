import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import {
  ArtifactCategory,
  ArtifactRecord,
  CelestialBodyId,
  CelestialBodySpec,
  CinematicShotPreset,
  ExperiencePresentationMode,
  GeologicalFeature,
  StoryChapterNumber,
  ViewportMode,
} from '../types/afterlight';
import {
  buildSatelliteWorldStage,
  evaluateCinematicCameraShot,
  SatelliteWorldStageRig,
} from '../three/celestialWorldsEngine';
import {
  buildHighPolyReconSatellite,
  createAtmosphereMesh,
  createCompositeSpacecraftGroup,
  createEarthDayNightMaterial,
  createGravitationalWellSystem,
  createLocalPlanetaryWellMesh,
  createPlanetaryTextures,
  GravityWellSource,
  loadAuthenticSolarTextures,
  SpacecraftAnimationRig,
} from '../three/proceduralAssets';
import {
  buildHighPolyLandingSiteTerrainPatch,
  getAerospaceHullMaterial,
  getGoldKaptonMaterial,
  getSolarArrayMaterial,
} from '../three/aerospaceTextures';
import {
  AstronomicalScaleMode,
  buildAdaptiveNaturalSatelliteLOD,
  buildAdaptivePlanetLOD,
  computePlanetSceneRadius,
  computeSatelliteSceneRadius,
  createSaturnMultiBandRingSystem,
  NATURAL_SATELLITES_CATALOG,
  NaturalSatelliteSpec,
  PLANETARY_SCIENTIFIC_METADATA,
  ScientificCelestialMetadata,
} from '../three/scientificScaleSystem';
import {
  cartesianToLatLon,
  getPrimaryCoordinate,
  latLonToCartesian,
} from '../utils/scientificEngine';
import { CinemaCameraMode } from '../utils/storyChoreographyEngine';

// Pre-allocated scratch math objects outside animation loop (Zero GC per frame)
const _scratchVecA = new THREE.Vector3();
const _scratchVecB = new THREE.Vector3();
const _scratchUp = new THREE.Vector3(0, 1, 0);
const _scratchQuat = new THREE.Quaternion();
const _scratchMat4 = new THREE.Matrix4();
const _scratchColor = new THREE.Color();

export interface LayerVisibilityState {
  showArtifacts: boolean;
  showTraverses: boolean;
  showGeology: boolean;
  showGraticule: boolean;
  showOrbits: boolean;
  categoryFilter: ArtifactCategory | 'all';
}

interface Observatory3DBuild {
  group: THREE.Group;
  dishPivot: THREE.Group;
  fftBars: THREE.Mesh[];
}

interface EndingMonuments3DBuild {
  group: THREE.Group;
  particles: THREE.Points;
}

function buildObservatory3DGroup(): Observatory3DBuild {
  const group = new THREE.Group();
  group.name = 'legacyObservatoryGroup';

  // 1. DSN 70m Tracking Antenna Station Base & Alidade
  const antennaStation = new THREE.Group();
  antennaStation.position.set(1.4, 0, -0.6);

  // Concrete pedestal
  const baseGeom = new THREE.CylinderGeometry(0.55, 0.75, 0.45, 16);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.92,
    metalness: 0.12,
  });
  const pedestal = new THREE.Mesh(baseGeom, baseMat);
  pedestal.position.y = 0.225;
  pedestal.receiveShadow = true;
  antennaStation.add(pedestal);

  // Elevation-over-Azimuth Turntable Ring
  const collarGeom = new THREE.CylinderGeometry(0.48, 0.52, 0.15, 16);
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.85,
    roughness: 0.28,
  });
  const collar = new THREE.Mesh(collarGeom, metalMat);
  collar.position.y = 0.525;
  antennaStation.add(collar);

  // Fork elevation trunnion mounts
  const forkArmGeom = new THREE.BoxGeometry(0.12, 0.55, 0.2);
  const forkL = new THREE.Mesh(forkArmGeom, metalMat);
  forkL.position.set(-0.35, 0.8, 0);
  const forkR = new THREE.Mesh(forkArmGeom, metalMat);
  forkR.position.set(0.35, 0.8, 0);
  antennaStation.add(forkL, forkR);

  // Steerable Dish Assembly Pivot (Elevation axis)
  const dishPivot = new THREE.Group();
  dishPivot.position.set(0, 0.95, 0);

  // Parabolic Primary Reflector (Deep Cassegrain 70-meter dish)
  const dishGeom = new THREE.CylinderGeometry(1.5, 0.2, 0.42, 32, 1, true);
  const dishMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.72,
    roughness: 0.22,
    side: THREE.DoubleSide,
  });
  const dishMesh = new THREE.Mesh(dishGeom, dishMat);
  dishMesh.rotation.x = Math.PI / 2;
  dishMesh.castShadow = true;
  dishPivot.add(dishMesh);

  // Central Feed Cone
  const feedGeom = new THREE.CylinderGeometry(0.12, 0.22, 0.32, 16);
  const feedMat = getGoldKaptonMaterial();
  const feedMesh = new THREE.Mesh(feedGeom, feedMat);
  feedMesh.rotation.x = Math.PI / 2;
  feedMesh.position.z = 0.15;
  dishPivot.add(feedMesh);

  // Quadripod subreflector support struts
  const strutMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.2,
  });
  const strutGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.85, 6);
  for (let s = 0; s < 4; s++) {
    const angle = (s * Math.PI) / 2 + Math.PI / 4;
    const strut = new THREE.Mesh(strutGeom, strutMat);
    strut.position.set(Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, 0.42);
    strut.rotation.x = Math.PI / 3;
    strut.rotation.z = angle;
    dishPivot.add(strut);
  }

  // Cassegrain Subreflector Cone
  const subConeGeom = new THREE.ConeGeometry(0.16, 0.18, 16);
  const subConeMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.95,
    roughness: 0.15,
  });
  const subCone = new THREE.Mesh(subConeGeom, subConeMat);
  subCone.rotation.x = -Math.PI / 2;
  subCone.position.z = 0.72;
  dishPivot.add(subCone);

  antennaStation.add(dishPivot);
  group.add(antennaStation);

  // 2. Real-Time 3D Fourier Hydrogen Line (1,420.405 MHz) Spectrum Waterfall Array (24 Vertical Bars)
  const fftBars: THREE.Mesh[] = [];
  const fftArrayGroup = new THREE.Group();
  fftArrayGroup.position.set(0.6, 0.04, 1.4);
  fftArrayGroup.rotation.y = -0.32;

  // Baseline datum rail
  const railGeom = new THREE.BoxGeometry(2.5, 0.03, 0.08);
  const railMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
  const rail = new THREE.Mesh(railGeom, railMat);
  rail.position.set(0, 0.015, 0);
  fftArrayGroup.add(rail);

  const barCount = 24;
  const barWidth = 0.07;
  const barDepth = 0.04;
  const barSpan = 2.3;
  const barGeom = new THREE.BoxGeometry(barWidth, 1.0, barDepth);

  for (let i = 0; i < barCount; i++) {
    const isCenterHLine = Math.abs(i - 12) <= 2;
    const barMat = new THREE.MeshStandardMaterial({
      color: isCenterHLine ? 0x06b6d4 : 0x0284c7,
      emissive: isCenterHLine ? 0x06b6d4 : 0x0369a1,
      emissiveIntensity: isCenterHLine ? 0.85 : 0.4,
      metalness: 0.5,
      roughness: 0.2,
    });
    const bar = new THREE.Mesh(barGeom, barMat);
    const xPos = -barSpan / 2 + (i / (barCount - 1)) * barSpan;
    bar.position.set(xPos, 0.25, 0);
    bar.scale.set(1, 0.5, 1);
    fftArrayGroup.add(bar);
    fftBars.push(bar);
  }
  group.add(fftArrayGroup);

  // 3. 3D Floating Calibrated Thermal Infrared Radiometric Panels (CRISM / Diviner Multi-Band Matrices)
  const irPanelGroup = new THREE.Group();
  irPanelGroup.position.set(-1.6, 1.1, 0.8);
  irPanelGroup.rotation.y = 0.45;

  const panelFrameGeom = new THREE.BoxGeometry(0.95, 0.65, 0.03);
  const panelFrameMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.85,
    roughness: 0.25,
  });
  const panelFrame = new THREE.Mesh(panelFrameGeom, panelFrameMat);
  irPanelGroup.add(panelFrame);

  // 8-Band thermal radiometric grid face
  const irGridCanvas = document.createElement('canvas');
  irGridCanvas.width = 128;
  irGridCanvas.height = 96;
  const ictx = irGridCanvas.getContext('2d')!;
  ictx.fillStyle = '#090d16';
  ictx.fillRect(0, 0, 128, 96);
  const bandColors = [
    '#312e81', '#4338ca', '#0284c7', '#0d9488',
    '#16a34a', '#ca8a04', '#ea580c', '#e11d48',
  ];
  for (let b = 0; b < 8; b++) {
    ictx.fillStyle = bandColors[b];
    const bx = 8 + (b % 4) * 28;
    const by = 8 + Math.floor(b / 4) * 40;
    ictx.fillRect(bx, by, 24, 32);
    ictx.strokeStyle = '#ffffff';
    ictx.lineWidth = 1;
    ictx.strokeRect(bx, by, 24, 32);
  }
  const irTex = new THREE.CanvasTexture(irGridCanvas);
  const irMat = new THREE.MeshBasicMaterial({ map: irTex, side: THREE.DoubleSide });
  const irFace = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.58), irMat);
  irFace.position.z = 0.02;
  irPanelGroup.add(irFace);

  group.add(irPanelGroup);

  return { group, dishPivot, fftBars };
}

function buildEndingMonuments3DGroup(): EndingMonuments3DBuild {
  const group = new THREE.Group();
  group.name = 'endingMonumentsGroup';

  // 1. Sanctuary Base Ring
  const ringGeom = new THREE.RingGeometry(2.4, 2.52, 48);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x94a3b8,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.42,
  });
  const sanctuaryRing = new THREE.Mesh(ringGeom, ringMat);
  sanctuaryRing.rotation.x = -Math.PI / 2;
  sanctuaryRing.position.y = 0.015;
  group.add(sanctuaryRing);

  // 2. Three Historical Heritage Plinths
  const plinthBaseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.82,
    metalness: 0.35,
  });

  // Plinth A (Apollo 11 LRRR: 100 quartz corner cubes)
  const plinthAGroup = new THREE.Group();
  plinthAGroup.position.set(-1.25, 0, 0.95);
  const pedA = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.16, 8), plinthBaseMat);
  pedA.position.y = 0.08;
  plinthAGroup.add(pedA);

  const lrrrTray = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.04, 0.38),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 })
  );
  lrrrTray.position.set(0, 0.22, 0);
  lrrrTray.rotation.x = -0.45;
  const prismMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.65,
    roughness: 0.05,
    metalness: 0.95,
  });
  const prismMesh = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.32), prismMat);
  prismMesh.position.y = 0.025;
  lrrrTray.add(prismMesh);
  plinthAGroup.add(lrrrTray);
  group.add(plinthAGroup);

  // Plinth B (Surveyor 3 / Apollo 12 Television Camera Assembly Specimen)
  const plinthBGroup = new THREE.Group();
  plinthBGroup.position.set(1.35, 0, 0.85);
  const pedB = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.18, 16), plinthBaseMat);
  pedB.position.y = 0.09;
  plinthBGroup.add(pedB);

  const camBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 0.26, 16),
    new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.82, roughness: 0.35 })
  );
  camBarrel.rotation.z = Math.PI / 4;
  camBarrel.position.set(0, 0.26, 0);
  plinthBGroup.add(camBarrel);
  group.add(plinthBGroup);

  // Plinth C (Mars Rover Heritage Wheel Tread & Titanium Sample Tube)
  const plinthCGroup = new THREE.Group();
  plinthCGroup.position.set(0, 0, -1.45);
  const pedC = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.85), plinthBaseMat);
  pedC.position.y = 0.06;
  plinthCGroup.add(pedC);

  const tubeMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.34, 16),
    new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1 })
  );
  tubeMesh.rotation.z = Math.PI / 2;
  tubeMesh.position.set(0, 0.14, 0);
  plinthCGroup.add(tubeMesh);
  group.add(plinthCGroup);

  // 3. Central Stela / Archaeological Monument Plaque
  const stelaGroup = new THREE.Group();
  stelaGroup.position.set(0, 0, 0.1);
  const slabGeom = new THREE.BoxGeometry(0.85, 1.25, 0.1);
  const slabMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.88,
    metalness: 0.25,
  });
  const slab = new THREE.Mesh(slabGeom, slabMat);
  slab.position.y = 0.625;
  stelaGroup.add(slab);

  // Gold-leaf commemorative inscription plaque
  const plaqueCanvas = document.createElement('canvas');
  plaqueCanvas.width = 256;
  plaqueCanvas.height = 360;
  const pctx = plaqueCanvas.getContext('2d')!;
  pctx.fillStyle = '#1c1917';
  pctx.fillRect(0, 0, 256, 360);
  pctx.strokeStyle = '#d97706';
  pctx.lineWidth = 4;
  pctx.strokeRect(8, 8, 240, 344);
  pctx.strokeRect(14, 14, 228, 332);
  pctx.fillStyle = '#fbbf24';
  pctx.font = 'bold 15px sans-serif';
  pctx.textAlign = 'center';
  pctx.fillText('AFTERLIGHT', 128, 48);
  pctx.font = '11px sans-serif';
  pctx.fillStyle = '#fde68a';
  pctx.fillText('PLANETARY ARCHAEOLOGY', 128, 72);
  pctx.fillText('SANCTUARY', 128, 90);
  pctx.font = 'italic 11px sans-serif';
  pctx.fillText('"They remain where they fell,', 128, 175);
  pctx.fillText('not as debris,', 128, 195);
  pctx.fillText('but as the quiet monuments', 128, 215);
  pctx.fillText('of human curiosity."', 128, 235);
  pctx.font = '10px sans-serif';
  pctx.fillStyle = '#94a3b8';
  pctx.fillText('1959 — PERPETUITY', 128, 315);

  const plaqueTex = new THREE.CanvasTexture(plaqueCanvas);
  const plaqueMat = new THREE.MeshStandardMaterial({
    map: plaqueTex,
    metalness: 0.65,
    roughness: 0.35,
  });
  const plaqueMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 1.02), plaqueMat);
  plaqueMesh.position.set(0, 0.64, 0.055);
  stelaGroup.add(plaqueMesh);
  group.add(stelaGroup);

  // 4. Subtle Ambient Floating Regolith Dust Motes (240 Particles)
  const particleCount = 240;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  for (let p = 0; p < particleCount; p++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 0.4 + Math.random() * 2.8;
    particlePositions[p * 3] = Math.cos(angle) * r;
    particlePositions[p * 3 + 1] = 0.08 + Math.random() * 2.2;
    particlePositions[p * 3 + 2] = Math.sin(angle) * r;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xfde68a,
    size: 0.024,
    transparent: true,
    opacity: 0.48,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  group.add(particles);

  return { group, particles };
}

interface PlanetaryCanvas3DProps {
  viewportMode: ViewportMode;
  celestialBodies: CelestialBodySpec[];
  selectedBodyId: CelestialBodyId;
  artifacts: ArtifactRecord[];
  selectedArtifactId: string;
  geologicalFeatures: GeologicalFeature[];
  layerVisibility: LayerVisibilityState;
  simulationSpeed: number;
  wellDepth: number;
  explodedFactor: number;
  activeStoryChapter: StoryChapterNumber;
  storyProgress: number;
  isStoryPlaying: boolean;
  cinemaCameraMode: CinemaCameraMode;
  cameraPresetKey: number;
  scaleMode?: AstronomicalScaleMode;
  selectedSatelliteId?: string;
  presentationMode?: ExperiencePresentationMode;
  cinematicShotPreset?: CinematicShotPreset;
  onSelectBody: (bodyId: CelestialBodyId) => void;
  onSelectArtifact: (artifactId: string) => void;
  onSelectSatellite?: (sat: ScientificCelestialMetadata | null) => void;
  onHoverCoordinate: (coords: { lat: number; lon: number; datum: string } | null) => void;
  onHoverObjectLabel: (label: string | null) => void;
}

export const PlanetaryCanvas3D: React.FC<PlanetaryCanvas3DProps> = ({
  viewportMode,
  celestialBodies,
  selectedBodyId,
  artifacts,
  selectedArtifactId,
  geologicalFeatures,
  layerVisibility,
  simulationSpeed,
  wellDepth,
  explodedFactor,
  activeStoryChapter,
  storyProgress,
  isStoryPlaying,
  cinemaCameraMode,
  cameraPresetKey,
  scaleMode = 'scientific_exploration',
  selectedSatelliteId = 'sat-europa',
  presentationMode = 'scientific',
  cinematicShotPreset = 'GRAND_REVEAL',
  onSelectBody,
  onSelectArtifact,
  onSelectSatellite,
  onHoverCoordinate,
  onHoverObjectLabel,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const stateRef = useRef({
    viewportMode,
    selectedBodyId,
    selectedArtifactId,
    layerVisibility,
    simulationSpeed,
    wellDepth,
    explodedFactor,
    activeStoryChapter,
    storyProgress,
    isStoryPlaying,
    cinemaCameraMode,
    scaleMode,
    selectedSatelliteId,
    presentationMode,
    cinematicShotPreset,
    onSelectBody,
    onSelectArtifact,
    onSelectSatellite,
    onHoverCoordinate,
    onHoverObjectLabel,
  });

  useEffect(() => {
    stateRef.current = {
      viewportMode,
      selectedBodyId,
      selectedArtifactId,
      layerVisibility,
      simulationSpeed,
      wellDepth,
      explodedFactor,
      activeStoryChapter,
      storyProgress,
      isStoryPlaying,
      cinemaCameraMode,
      scaleMode,
      selectedSatelliteId,
      presentationMode,
      cinematicShotPreset,
      onSelectBody,
      onSelectArtifact,
      onSelectSatellite,
      onHoverCoordinate,
      onHoverObjectLabel,
    };
  }, [
    viewportMode,
    selectedBodyId,
    selectedArtifactId,
    layerVisibility,
    simulationSpeed,
    wellDepth,
    explodedFactor,
    activeStoryChapter,
    storyProgress,
    isStoryPlaying,
    cinemaCameraMode,
    scaleMode,
    selectedSatelliteId,
    presentationMode,
    cinematicShotPreset,
    onSelectBody,
    onSelectArtifact,
    onSelectSatellite,
    onHoverCoordinate,
    onHoverObjectLabel,
  ]);

  const sceneControllerRef = useRef<{
    syncSceneMode: () => void;
    resetCamera: () => void;
  } | null>(null);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // 1. Software WebGL detection
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.78;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('data-testid', 'planetary-webgl-canvas');
    renderer.domElement.className = 'block w-full h-full cursor-crosshair outline-none';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    // 2. Load Authentic N3rson/Solar-System-3D Textures & Cube Skybox
    const solarTex = loadAuthenticSolarTextures(maxAniso);

    const scene = new THREE.Scene();
    scene.background = solarTex.skyboxCube;
    scene.fog = new THREE.FogExp2(0x05070c, 0.0018);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.22;
    pmremGenerator.dispose();

    // 3. Camera, OrbitControls & Selective HDR UnrealBloom Post-Processing
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 650);
    camera.position.set(-38, 28, 48);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.45;
    controls.maxDistance = 240;
    controls.maxPolarAngle = Math.PI * 0.96;

    let composer: EffectComposer | null = null;
    if (!isSoftwareGl) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.32,
        0.3,
        0.92
      );
      composer.addPass(bloomPass);
      composer.addPass(new OutputPass());
    }

    const camTargetPos = new THREE.Vector3(-38, 28, 48);
    const camLookTarget = new THREE.Vector3(0, 0, 0);
    let isCameraTransitioning = false;
    let trackedSatelliteMesh: THREE.Object3D | null = null;

    controls.addEventListener('start', () => {
      isCameraTransitioning = false;
      trackedSatelliteMesh = null;
    });

    // 4. Scientifically Calibrated High-Contrast Space Lighting Rig (No overexposure)
    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.65);
    scene.add(ambientLight);

    const sunPointLight = new THREE.PointLight(0xfdffd3, 2.6, 320, 0.45);
    sunPointLight.position.set(0, 0, 0);
    if (!isSoftwareGl) {
      sunPointLight.castShadow = true;
      sunPointLight.shadow.mapSize.set(1024, 1024);
      sunPointLight.shadow.camera.near = 4;
      sunPointLight.shadow.camera.far = 160;
    }
    scene.add(sunPointLight);

    const keyLight = new THREE.DirectionalLight(0xfff4d6, 1.15);
    keyLight.position.set(32, 26, 28);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 0.55);
    rimLight.position.set(-24, 14, -22);
    scene.add(rimLight);

    // 5. Instanced Deep-Field Starfield
    const starCount = 950;
    const starGeo = new THREE.OctahedronGeometry(0.15, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const starInstanced = new THREE.InstancedMesh(starGeo, starMat, starCount);
    const starPalette = [0xf8fafc, 0xbae6fd, 0xfef08a, 0xfed7aa];
    let sSeed = 42;
    const sRand = () => {
      sSeed = (sSeed * 1664525 + 1013904223) % 4294967296;
      return sSeed / 4294967296;
    };
    for (let i = 0; i < starCount; i++) {
      const r = 135 + sRand() * 110;
      const theta = sRand() * Math.PI * 2;
      const phi = Math.acos(2 * sRand() - 1);
      _scratchVecA.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
      const scale = 0.55 + sRand() * 1.35;
      _scratchMat4.makeScale(scale, scale, scale);
      _scratchMat4.setPosition(_scratchVecA);
      starInstanced.setMatrixAt(i, _scratchMat4);
      _scratchColor.setHex(starPalette[i % starPalette.length]);
      starInstanced.setColorAt(i, _scratchColor);
    }
    starInstanced.instanceMatrix.needsUpdate = true;
    if (starInstanced.instanceColor) starInstanced.instanceColor.needsUpdate = true;
    starInstanced.computeBoundingSphere();
    scene.add(starInstanced);

    // 6. Scene Mode Groups
    const solarSystemGroup = new THREE.Group();
    const globeGroup = new THREE.Group();
    const satelliteWorldGroup = new THREE.Group();
    const inspectorGroup = new THREE.Group();
    const storyCinemaGroup = new THREE.Group();
    scene.add(solarSystemGroup);
    scene.add(globeGroup);
    scene.add(satelliteWorldGroup);
    scene.add(inspectorGroup);
    scene.add(storyCinemaGroup);

    const interactables: THREE.Object3D[] = [];
    const textureCache = new Map<
      CelestialBodyId,
      ReturnType<typeof createPlanetaryTextures>
    >();
    const getBodyFallbackTextures = (id: CelestialBodyId) => {
      if (!textureCache.has(id)) {
        textureCache.set(id, createPlanetaryTextures(id, maxAniso));
      }
      return textureCache.get(id)!;
    };

    // --- 7. GRAVITATIONAL WELL DEPTH SYSTEM ("well depth") ---
    const gravityWellSystem = createGravitationalWellSystem();
    solarSystemGroup.add(gravityWellSystem.group);

    // --- 8. BUILD SCIENTIFIC-SCALE SOLAR SYSTEM GROUP (3-Level Adaptive LOD + Multi-Band Rings + 9 Natural Satellites) ---
    interface NaturalMoonEntry {
      spec: NaturalSatelliteSpec;
      mesh: THREE.Group;
      orbitPlaneGroup: THREE.Group;
      baseOrbitRadius: number;
      eccentricity: number;
      speed: number;
      angle: number;
      parentMeanRadiusKm: number;
      parentBaseSceneRadius: number;
    }

    const planetMeshes = new Map<
      CelestialBodyId,
      {
        pivot: THREE.Group;
        scaleGroup: THREE.Group;
        lod: THREE.LOD;
        baseRadiusSceneUnits: number;
        meanRadiusKm: number;
        atmosphereMesh?: THREE.Mesh;
        moons: NaturalMoonEntry[];
        orbitRadius: number;
        speed: number;
        angle: number;
        wellStrength: number;
        wellSoftening: number;
      }
    >();
    const allNaturalMoons: NaturalMoonEntry[] = [];
    const orbitLinesGroup = new THREE.Group();
    solarSystemGroup.add(orbitLinesGroup);

    const sunOrigin = new THREE.Vector3(0, 0, 0);

    const decorativePlanets: {
      pivot: THREE.Group;
      scaleGroup: THREE.Group;
      lod: THREE.LOD;
      baseRadius: number;
      meanRadiusKm: number;
      orbitRadius: number;
      speed: number;
      angle: number;
      wellStrength: number;
      wellSoftening: number;
    }[] = [];

    const addDecorativeInnerPlanet = (
      id: 'mercury' | 'venus',
      orbitR: number,
      radius: number,
      meanRadiusKm: number,
      tex: THREE.Texture,
      bumpTex: THREE.Texture,
      atmoTex?: THREE.Texture,
      initialAngle = 0.8
    ) => {
      const pivot = new THREE.Group();
      const scaleGroup = new THREE.Group();
      pivot.add(scaleGroup);

      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        bumpMap: bumpTex,
        bumpScale: 0.06,
        roughness: 0.82,
        envMapIntensity: 0.12,
      });
      const meta = PLANETARY_SCIENTIFIC_METADATA[id];
      const lod = buildAdaptivePlanetLOD(radius, mat, {
        interactionType: 'satellite',
        scientificMetadata: meta,
        label: `${meta.name} · R = ${meta.meanRadiusKm.toLocaleString()} km`,
      });
      scaleGroup.add(lod);

      if (atmoTex) {
        const atmoMesh = new THREE.Mesh(
          new THREE.SphereGeometry(radius * 1.03, 48, 36),
          new THREE.MeshStandardMaterial({
            map: atmoTex,
            transparent: true,
            opacity: 0.38,
            depthWrite: false,
            envMapIntensity: 0.1,
          })
        );
        scaleGroup.add(atmoMesh);
      }

      const orbitPts: THREE.Vector3[] = [];
      for (let s = 0; s <= 96; s++) {
        const a = (s / 96) * Math.PI * 2;
        orbitPts.push(new THREE.Vector3(Math.cos(a) * orbitR, 0, Math.sin(a) * orbitR));
      }
      orbitLinesGroup.add(
        new THREE.LineLoop(
          new THREE.BufferGeometry().setFromPoints(orbitPts),
          new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.25 })
        )
      );

      pivot.position.set(Math.cos(initialAngle) * orbitR, 0, Math.sin(initialAngle) * orbitR);
      solarSystemGroup.add(pivot);
      decorativePlanets.push({
        pivot,
        scaleGroup,
        lod,
        baseRadius: radius,
        meanRadiusKm,
        orbitRadius: orbitR,
        speed: 1.8 / Math.sqrt(orbitR),
        angle: initialAngle,
        wellStrength: radius * 2.2,
        wellSoftening: 2.2,
      });
    };

    addDecorativeInnerPlanet(
      'mercury',
      7.4,
      0.55,
      2439.7,
      solarTex.mercury,
      solarTex.mercuryBump,
      undefined,
      1.1
    );
    addDecorativeInnerPlanet(
      'venus',
      10.6,
      1.28,
      6051.8,
      solarTex.venus,
      solarTex.venusBump,
      solarTex.venusAtmosphere,
      2.4
    );

    const wellStrengthByBody: Record<CelestialBodyId, { strength: number; softening: number }> = {
      sun: { strength: 42.0, softening: 5.5 },
      earth: { strength: 6.8, softening: 2.2 },
      moon: { strength: 2.8, softening: 1.6 },
      mars: { strength: 5.2, softening: 2.0 },
      jupiter: { strength: 18.5, softening: 3.4 },
      saturn: { strength: 14.2, softening: 3.2 },
      uranus: { strength: 9.0, softening: 2.8 },
      neptune: { strength: 9.2, softening: 2.8 },
    };

    celestialBodies.forEach((body, idx) => {
      const pivot = new THREE.Group();
      const scaleGroup = new THREE.Group();
      pivot.add(scaleGroup);

      let mat: THREE.Material;
      let atmosphereCloudMesh: THREE.Mesh | undefined;
      const bodyMoons: NaturalMoonEntry[] = [];

      if (body.id === 'sun') {
        mat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: solarTex.sun,
          emissive: new THREE.Color(0xffe484),
          emissiveMap: solarTex.sun,
          emissiveIntensity: 1.35,
          roughness: 0.35,
          envMapIntensity: 0.05,
        });
      } else if (body.id === 'earth') {
        mat = createEarthDayNightMaterial(solarTex.earthDay, solarTex.earthNight, sunOrigin);
        atmosphereCloudMesh = new THREE.Mesh(
          new THREE.SphereGeometry(body.radiusSceneUnits * 1.022, 64, 48),
          new THREE.MeshStandardMaterial({
            map: solarTex.earthAtmosphere,
            transparent: true,
            opacity: 0.36,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        );
        scaleGroup.add(atmosphereCloudMesh);
      } else if (body.id === 'moon') {
        mat = new THREE.MeshStandardMaterial({
          map: solarTex.moon,
          bumpMap: solarTex.moonBump,
          bumpScale: 0.09,
          roughness: 0.92,
          envMapIntensity: 0.1,
        });
      } else if (body.id === 'mars') {
        mat = new THREE.MeshStandardMaterial({
          map: solarTex.mars,
          bumpMap: solarTex.marsBump,
          bumpScale: 0.11,
          roughness: 0.86,
          envMapIntensity: 0.12,
        });
      } else if (body.id === 'jupiter') {
        mat = new THREE.MeshStandardMaterial({
          map: solarTex.jupiter,
          roughness: 0.68,
          envMapIntensity: 0.14,
        });
      } else if (body.id === 'saturn') {
        mat = new THREE.MeshStandardMaterial({
          map: solarTex.saturn,
          roughness: 0.7,
          envMapIntensity: 0.14,
        });
      } else if (body.id === 'uranus') {
        mat = new THREE.MeshStandardMaterial({
          map: solarTex.uranus,
          roughness: 0.64,
          envMapIntensity: 0.14,
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          map: solarTex.neptune,
          roughness: 0.64,
          envMapIntensity: 0.14,
        });
      }

      const bodyUserData = {
        interactionType: 'body',
        bodyId: body.id,
        label: `${body.name} · R = ${body.meanRadiusKm.toLocaleString()} km (${body.documentedArtifactCount} sites)`,
      };
      const lod = buildAdaptivePlanetLOD(body.radiusSceneUnits, mat, bodyUserData);
      lod.rotation.z = (body.axialTiltDeg * Math.PI) / 180;
      scaleGroup.add(lod);

      const atmo = createAtmosphereMesh(
        body.radiusSceneUnits,
        body.atmosphereColorHex,
        body.id === 'sun' ? 0.65 : 0.38
      );
      scaleGroup.add(atmo);

      if (body.id === 'saturn') {
        const saturnRings = createSaturnMultiBandRingSystem(
          body.radiusSceneUnits,
          solarTex.saturnRing
        );
        scaleGroup.add(saturnRings);
      } else if (body.id === 'uranus') {
        const innerR = body.radiusSceneUnits * 1.32;
        const outerR = body.radiusSceneUnits * 1.85;
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 96);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshStandardMaterial({
          map: solarTex.uranusRing,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.48,
          roughness: 0.6,
          envMapIntensity: 0.1,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.z = (body.axialTiltDeg * Math.PI) / 180;
        scaleGroup.add(ringMesh);
      }

      // Attach scientifically scaled, high-polygon 3-Level LOD Natural Satellites for this parent planet
      const childSatSpecs = NATURAL_SATELLITES_CATALOG.filter(
        (s) => s.parentId === body.id
      );
      childSatSpecs.forEach((satSpec, sIdx) => {
        const satSceneRadius = computeSatelliteSceneRadius(
          satSpec,
          body.meanRadiusKm,
          body.radiusSceneUnits,
          'scientific_exploration'
        );
        const satLodGroup = buildAdaptiveNaturalSatelliteLOD(
          satSpec,
          satSceneRadius,
          solarTex
        );

        // Orbit plane tilted by real orbital inclination
        const orbitPlaneGroup = new THREE.Group();
        orbitPlaneGroup.rotation.z = (satSpec.inclinationDeg * Math.PI) / 180;
        orbitPlaneGroup.rotation.x = ((sIdx % 2 === 0 ? 1 : -1) * satSpec.inclinationDeg * Math.PI) / 360;

        // Physically ordered semi-major axis outside parent planet / rings
        const minClearance = body.id === 'saturn' ? 2.48 : 1.42;
        const baseOrbitRadius =
          body.radiusSceneUnits * (minClearance + sIdx * 0.42);

        // Keplerian elliptical orbit track line
        const satOrbitPts: THREE.Vector3[] = [];
        const ecc = satSpec.eccentricity;
        const semiMinor = baseOrbitRadius * Math.sqrt(Math.max(0.2, 1 - ecc * ecc));
        for (let st = 0; st <= 72; st++) {
          const theta = (st / 72) * Math.PI * 2;
          satOrbitPts.push(
            new THREE.Vector3(
              Math.cos(theta) * baseOrbitRadius - baseOrbitRadius * ecc,
              0,
              Math.sin(theta) * semiMinor
            )
          );
        }
        orbitPlaneGroup.add(
          new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(satOrbitPts),
            new THREE.LineBasicMaterial({
              color: 0x38bdf8,
              transparent: true,
              opacity: 0.24,
            })
          )
        );

        const initAng = sIdx * 1.65 + 0.5;
        satLodGroup.position.set(
          Math.cos(initAng) * baseOrbitRadius,
          0,
          Math.sin(initAng) * semiMinor
        );
        orbitPlaneGroup.add(satLodGroup);
        pivot.add(orbitPlaneGroup);

        const dirSign = satSpec.retrograde ? -1 : 1;
        const angularSpeed =
          (dirSign * 1.6) / Math.pow(Math.max(0.3, satSpec.orbitalPeriodDays), 0.35);

        const moonEntry: NaturalMoonEntry = {
          spec: satSpec,
          mesh: satLodGroup,
          orbitPlaneGroup,
          baseOrbitRadius,
          eccentricity: ecc,
          speed: angularSpeed,
          angle: initAng,
          parentMeanRadiusKm: body.meanRadiusKm,
          parentBaseSceneRadius: body.radiusSceneUnits,
        };
        bodyMoons.push(moonEntry);
        allNaturalMoons.push(moonEntry);
      });

      if (body.orbitRadiusSceneUnits > 0) {
        const orbitPts: THREE.Vector3[] = [];
        const segments = 120;
        for (let s = 0; s <= segments; s++) {
          const a = (s / segments) * Math.PI * 2;
          orbitPts.push(
            new THREE.Vector3(
              Math.cos(a) * body.orbitRadiusSceneUnits,
              0,
              Math.sin(a) * body.orbitRadiusSceneUnits
            )
          );
        }
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
        const orbitMat = new THREE.LineBasicMaterial({
          color: body.id === 'moon' || body.id === 'mars' ? 0x06b6d4 : 0x475569,
          transparent: true,
          opacity: body.id === 'moon' || body.id === 'mars' ? 0.65 : 0.35,
        });
        orbitLinesGroup.add(new THREE.LineLoop(orbitGeo, orbitMat));
      }

      const initialAngle = idx * 0.95 + 0.4;
      pivot.position.set(
        Math.cos(initialAngle) * body.orbitRadiusSceneUnits,
        0,
        Math.sin(initialAngle) * body.orbitRadiusSceneUnits
      );
      solarSystemGroup.add(pivot);

      const wellSpec = wellStrengthByBody[body.id] || { strength: 5.0, softening: 2.0 };
      planetMeshes.set(body.id, {
        pivot,
        scaleGroup,
        lod,
        baseRadiusSceneUnits: body.radiusSceneUnits,
        meanRadiusKm: body.meanRadiusKm,
        atmosphereMesh: atmosphereCloudMesh,
        moons: bodyMoons,
        orbitRadius: body.orbitRadiusSceneUnits,
        speed: body.orbitRadiusSceneUnits > 0 ? 1.8 / Math.sqrt(body.orbitRadiusSceneUnits) : 0,
        angle: initialAngle,
        wellStrength: wellSpec.strength,
        wellSoftening: wellSpec.softening,
      });
    });

    const gltfLoader = new GLTFLoader();

    const beltCount = 180;
    const beltGeo = new THREE.DodecahedronGeometry(0.18, 0);
    const beltMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.85,
      metalness: 0.2,
    });
    const beltInstanced = new THREE.InstancedMesh(beltGeo, beltMat, beltCount);
    for (let i = 0; i < beltCount; i++) {
      const angle = (i / beltCount) * Math.PI * 2 + sRand() * 0.2;
      const rad = 29.2 + sRand() * 3.8;
      const yOff = (sRand() - 0.5) * 1.4;
      const sc = 0.7 + sRand() * 0.7;
      _scratchMat4.makeScale(sc, sc * 0.8, sc * 1.1);
      _scratchMat4.setPosition(Math.cos(angle) * rad, yOff, Math.sin(angle) * rad);
      beltInstanced.setMatrixAt(i, _scratchMat4);
      _scratchColor.setHex(i % 2 === 0 ? 0x94a3b8 : 0x64748b);
      beltInstanced.setColorAt(i, _scratchColor);
    }
    beltInstanced.instanceMatrix.needsUpdate = true;
    if (beltInstanced.instanceColor) beltInstanced.instanceColor.needsUpdate = true;
    beltInstanced.computeBoundingSphere();
    solarSystemGroup.add(beltInstanced);

    const gltfAsteroidsGroup = new THREE.Group();
    solarSystemGroup.add(gltfAsteroidsGroup);
    gltfLoader.load(
      '/asteroids/asteroidPack.glb',
      (gltf) => {
        const meshes: THREE.Mesh[] = [];
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            meshes.push(child as THREE.Mesh);
          }
        });
        if (meshes.length > 0) {
          for (let i = 0; i < 48; i++) {
            const srcMesh = meshes[i % meshes.length];
            const clone = srcMesh.clone();
            const ang = (i / 48) * Math.PI * 2;
            const r = 29.5 + (i % 7) * 0.45;
            clone.position.set(
              Math.cos(ang) * r,
              ((i % 5) - 2) * 0.28,
              Math.sin(ang) * r
            );
            clone.scale.setScalar(0.18 + (i % 4) * 0.06);
            gltfAsteroidsGroup.add(clone);
          }
        }
      },
      undefined,
      () => {}
    );

    // --- 9. HELIOCENTRIC SPACECRAFT TRANSFER TRAJECTORY ANIMATIONS ---
    const heliocentricCraftGroup = new THREE.Group();
    solarSystemGroup.add(heliocentricCraftGroup);

    interface HeliocentricFlightRig {
      craft: THREE.Group;
      line: THREE.Line;
      fromBody: CelestialBodyId;
      toBody: CelestialBodyId;
      phase: number;
      speed: number;
      arcHeight: number;
    }
    const heliocentricFlights: HeliocentricFlightRig[] = [];

    const missionFlightTargets: {
      from: CelestialBodyId;
      to: CelestialBodyId;
      modelType: 'lander' | 'rover' | 'probe';
      color: string;
      accent: string;
      speed: number;
      arcHeight: number;
      initialPhase: number;
    }[] = [
      {
        from: 'earth',
        to: 'moon',
        modelType: 'lander',
        color: '#f59e0b',
        accent: '#38bdf8',
        speed: 0.32,
        arcHeight: 1.8,
        initialPhase: 0.15,
      },
      {
        from: 'earth',
        to: 'mars',
        modelType: 'rover',
        color: '#e2e8f0',
        accent: '#06b6d4',
        speed: 0.22,
        arcHeight: 3.4,
        initialPhase: 0.45,
      },
      {
        from: 'earth',
        to: 'saturn',
        modelType: 'probe',
        color: '#eab308',
        accent: '#38bdf8',
        speed: 0.14,
        arcHeight: 6.2,
        initialPhase: 0.65,
      },
      {
        from: 'earth',
        to: 'neptune',
        modelType: 'probe',
        color: '#cbd5e1',
        accent: '#10b981',
        speed: 0.11,
        arcHeight: 8.5,
        initialPhase: 0.8,
      },
    ];

    missionFlightTargets.forEach((ft) => {
      const miniCraft = createCompositeSpacecraftGroup(
        ft.modelType,
        ft.color,
        ft.accent,
        0.38
      );
      const rig = miniCraft.userData.animRig as SpacecraftAnimationRig | undefined;
      if (rig) {
        rig.thrusterPlumeGroup.visible = true;
      }
      heliocentricCraftGroup.add(miniCraft);

      const dummyPts = Array.from({ length: 33 }, () => new THREE.Vector3());
      const lineGeo = new THREE.BufferGeometry().setFromPoints(dummyPts);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(ft.accent),
        transparent: true,
        opacity: 0.55,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      heliocentricCraftGroup.add(line);

      heliocentricFlights.push({
        craft: miniCraft,
        line,
        fromBody: ft.from,
        toBody: ft.to,
        phase: ft.initialPhase,
        speed: ft.speed,
        arcHeight: ft.arcHeight,
      });
    });

    const gravitySourcesScratch: GravityWellSource[] = [];
    const syncGravityWells = () => {
      gravitySourcesScratch.length = 0;
      planetMeshes.forEach((entry) => {
        gravitySourcesScratch.push({
          x: entry.pivot.position.x,
          z: entry.pivot.position.z,
          strength: entry.wellStrength,
          softening: entry.wellSoftening,
        });
      });
      decorativePlanets.forEach((dp) => {
        gravitySourcesScratch.push({
          x: dp.pivot.position.x,
          z: dp.pivot.position.z,
          strength: dp.wellStrength,
          softening: dp.wellSoftening,
        });
      });
      gravityWellSystem.updateWells(gravitySourcesScratch, stateRef.current.wellDepth);
    };

    syncGravityWells();

    // --- 10. DEDICATED PLANETARY GLOBE, HARDWARE INSPECTOR & 6-CHAPTER STORY CINEMA STAGE ---
    const GLOBE_RADIUS = 5.6;
    let activeGlobeMesh: THREE.Mesh | null = null;
    let activeGlobeReconSat: {
      pivot: THREE.Group;
      satGroup: THREE.Group;
      solarWingL: THREE.Group;
      solarWingR: THREE.Group;
      dishGroup: THREE.Group;
    } | null = null;
    let activeInspectorModel: THREE.Group | null = null;
    let activeSatelliteWorldRig: SatelliteWorldStageRig | null = null;
    let isSatelliteCinematicShotActive = false;
    let activeStoryCraftModel: THREE.Group | null = null;
    let activeStoryCurve: THREE.CatmullRomCurve3 | null = null;
    let activeObservatoryGroup: THREE.Group | null = null;
    let activeEndingMonumentsGroup: THREE.Group | null = null;
    const activeObservatoryFftBars: THREE.Mesh[] = [];
    let activeObservatoryDishPivot: THREE.Group | null = null;
    let activeEndingParticles: THREE.Points | null = null;
    const storyCorridorGates: THREE.Mesh[] = [];
    const globeAnimatedCrafts: THREE.Group[] = [];
    let currentExplodedDisplay = stateRef.current.explodedFactor;

    controls.addEventListener('start', () => {
      isSatelliteCinematicShotActive = false;
    });

    const rebuildActiveSceneContent = () => {
      interactables.length = 0;
      globeAnimatedCrafts.length = 0;
      storyCorridorGates.length = 0;
      activeGlobeReconSat = null;
      activeSatelliteWorldRig = null;
      activeStoryCraftModel = null;
      activeStoryCurve = null;
      activeObservatoryGroup = null;
      activeEndingMonumentsGroup = null;
      activeObservatoryFftBars.length = 0;
      activeObservatoryDishPivot = null;
      activeEndingParticles = null;

      const {
        viewportMode: mode,
        selectedBodyId: bodyId,
        selectedArtifactId: artId,
        layerVisibility: layers,
        wellDepth: currentWellDepth,
        scaleMode: currentScaleMode,
        selectedSatelliteId: satId,
        presentationMode: presMode,
        cinematicShotPreset: shotPreset,
      } = stateRef.current;

      solarSystemGroup.visible = mode === 'solar_system';
      globeGroup.visible = mode === 'moon_globe' || mode === 'mars_globe';
      satelliteWorldGroup.visible = mode === 'satellite_world';
      inspectorGroup.visible = mode === 'hardware_inspector';
      storyCinemaGroup.visible = mode === 'story_cinema';

      orbitLinesGroup.visible = layers.showOrbits;
      heliocentricCraftGroup.visible = layers.showArtifacts;

      if (mode === 'solar_system') {
        trackedSatelliteMesh = null;

        // Apply scientifically accurate scale factor based on currentScaleMode ('scientific_exploration' vs 'scientific_scale')
        planetMeshes.forEach((entry, id) => {
          const targetPlanetR =
            id === 'sun'
              ? currentScaleMode === 'scientific_scale'
                ? 4.6
                : entry.baseRadiusSceneUnits
              : computePlanetSceneRadius(entry.meanRadiusKm, currentScaleMode);
          const planetScaleRatio = targetPlanetR / entry.baseRadiusSceneUnits;
          entry.scaleGroup.scale.setScalar(planetScaleRatio);

          entry.moons.forEach((m) => {
            const baseSatR = computeSatelliteSceneRadius(
              m.spec,
              m.parentMeanRadiusKm,
              m.parentBaseSceneRadius,
              'scientific_exploration'
            );
            const targetSatR = computeSatelliteSceneRadius(
              m.spec,
              m.parentMeanRadiusKm,
              targetPlanetR,
              currentScaleMode
            );
            m.mesh.scale.setScalar(targetSatR / Math.max(0.001, baseSatR));
            interactables.push(m.mesh);
          });

          interactables.push(entry.lod);
        });

        decorativePlanets.forEach((dp) => {
          const targetR = computePlanetSceneRadius(dp.meanRadiusKm, currentScaleMode);
          dp.scaleGroup.scale.setScalar(targetR / dp.baseRadius);
          interactables.push(dp.lod);
        });

        syncGravityWells();
        const targetEntry = planetMeshes.get(bodyId);
        if (targetEntry) {
          const p = targetEntry.pivot.position;
          const activeScale = targetEntry.scaleGroup.scale.x || 1;
          const effRadius = targetEntry.baseRadiusSceneUnits * activeScale;
          camLookTarget.copy(p);
          if (bodyId === 'sun') {
            camTargetPos.set(-38, 28, 48);
          } else {
            const dist = Math.max(3.2, effRadius * 4.2);
            camTargetPos.set(p.x + dist, p.y + dist * 0.62, p.z + dist);
          }
          isCameraTransitioning = true;
        }
        return;
      }

      if (mode === 'moon_globe' || mode === 'mars_globe') {
        while (globeGroup.children.length > 0) {
          globeGroup.remove(globeGroup.children[0]);
        }

        const globeBodyId: CelestialBodyId = mode === 'moon_globe' ? 'moon' : 'mars';
        const fallbackTex = getBodyFallbackTextures(globeBodyId);
        const bodySpec = celestialBodies.find((b) => b.id === globeBodyId)!;

        // High-polygon 128x96 planetary sphere for smooth silhouette & relief without overexposure
        const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 128, 96);
        const globeMat = new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          map: globeBodyId === 'moon' ? solarTex.moon : solarTex.mars,
          bumpMap: globeBodyId === 'moon' ? solarTex.moonBump : solarTex.marsBump,
          bumpScale: 0.14,
          roughnessMap: fallbackTex.roughnessMap,
          roughness: 0.9,
          metalness: 0.04,
          envMapIntensity: 0.12,
        });
        const globeMesh = new THREE.Mesh(globeGeo, globeMat);
        globeMesh.receiveShadow = true;
        globeMesh.userData = {
          interactionType: 'globe_surface',
          bodyId: globeBodyId,
          datum: bodySpec.terrainReferenceSystem,
        };
        globeGroup.add(globeMesh);
        activeGlobeMesh = globeMesh;
        interactables.push(globeMesh);

        globeGroup.add(
          createAtmosphereMesh(
            GLOBE_RADIUS,
            globeBodyId === 'mars' ? '#f59e0b' : '#94a3b8',
            globeBodyId === 'mars' ? 0.38 : 0.18
          )
        );

        // Add Live Polar-Orbiting Ultra-High-Polygon Reconnaissance Satellite (LRO around Moon / MRO around Mars)
        const satOrbitRadius = GLOBE_RADIUS * 1.24;
        const satPivot = new THREE.Group();
        satPivot.rotation.z = 0.24; // Polar reconnaissance inclination
        const satBuilt = buildHighPolyReconSatellite(
          getGoldKaptonMaterial(),
          getSolarArrayMaterial(),
          getAerospaceHullMaterial('sat_dark', '#1e293b', 0.68, 0.48),
          getAerospaceHullMaterial('sat_alloy', '#94a3b8', 0.72, 0.34),
          new THREE.MeshPhysicalMaterial({
            color: 0x06b6d4,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.28,
            clearcoat: 1.0,
          })
        );
        satBuilt.group.scale.setScalar(0.42);
        satBuilt.group.position.set(satOrbitRadius, 0, 0);
        satBuilt.group.rotation.z = Math.PI / 2;
        satPivot.add(satBuilt.group);

        // Polar reconnaissance orbit track ring
        const satTrackPts: THREE.Vector3[] = [];
        for (let s = 0; s <= 96; s++) {
          const a = (s / 96) * Math.PI * 2;
          satTrackPts.push(
            new THREE.Vector3(Math.cos(a) * satOrbitRadius, 0, Math.sin(a) * satOrbitRadius)
          );
        }
        satPivot.add(
          new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(satTrackPts),
            new THREE.LineBasicMaterial({
              color: 0x06b6d4,
              transparent: true,
              opacity: 0.35,
            })
          )
        );
        globeGroup.add(satPivot);
        activeGlobeReconSat = {
          pivot: satPivot,
          satGroup: satBuilt.group,
          solarWingL: satBuilt.solarWingL,
          solarWingR: satBuilt.solarWingR,
          dishGroup: satBuilt.dishGroup,
        };

        if (currentWellDepth > 0.02) {
          const localWell = createLocalPlanetaryWellMesh(
            GLOBE_RADIUS,
            globeBodyId === 'mars' ? '#f59e0b' : '#38bdf8',
            currentWellDepth
          );
          globeGroup.add(localWell);
        }

        if (layers.showGraticule) {
          const graticuleGroup = new THREE.Group();
          const gratMat = new THREE.LineBasicMaterial({
            color: globeBodyId === 'mars' ? 0xf59e0b : 0x38bdf8,
            transparent: true,
            opacity: 0.18,
          });
          for (let lat = -60; lat <= 60; lat += 30) {
            const pts: THREE.Vector3[] = [];
            for (let lon = -180; lon <= 180; lon += 5) {
              const c = latLonToCartesian(lat, lon, GLOBE_RADIUS + 0.022);
              pts.push(new THREE.Vector3(c.x, c.y, c.z));
            }
            graticuleGroup.add(
              new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gratMat)
            );
          }
          for (let lon = -180; lon < 180; lon += 30) {
            const pts: THREE.Vector3[] = [];
            for (let lat = -90; lat <= 90; lat += 5) {
              const c = latLonToCartesian(lat, lon, GLOBE_RADIUS + 0.022);
              pts.push(new THREE.Vector3(c.x, c.y, pPtsZ(c.z)));
            }
            graticuleGroup.add(
              new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gratMat)
            );
          }
          globeGroup.add(graticuleGroup);
        }

        if (layers.showGeology) {
          const geoFeatures = geologicalFeatures.filter((g) => g.bodyId === globeBodyId);
          for (const feat of geoFeatures) {
            const pos = latLonToCartesian(feat.lat, feat.lon, GLOBE_RADIUS + 0.03);
            const ringRadius = Math.max(0.18, Math.min(0.65, feat.diameterKm / 1200));
            const ringGeo = new THREE.RingGeometry(ringRadius * 0.86, ringRadius, 32);
            const ringMat = new THREE.MeshBasicMaterial({
              color: 0x94a3b8,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.45,
              depthWrite: false,
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            ringMesh.position.set(pos.x, pos.y, pos.z);
            _scratchVecA.set(pos.x, pos.y, pos.z).normalize();
            ringMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), _scratchVecA);
            globeGroup.add(ringMesh);
          }
        }

        const bodyArtifacts = artifacts.filter((a) => {
          if (a.bodyId !== globeBodyId) return false;
          if (layers.categoryFilter !== 'all' && a.category !== layers.categoryFilter) {
            return false;
          }
          return true;
        });

        for (const art of bodyArtifacts) {
          const primaryCoord = getPrimaryCoordinate(art);
          if (!primaryCoord) continue;

          if (layers.showArtifacts) {
            const surfacePos = latLonToCartesian(
              primaryCoord.record.lat,
              primaryCoord.record.lon,
              GLOBE_RADIUS
            );
            const isSelected = art.id === artId;

            const markerAnchor = new THREE.Group();
            markerAnchor.position.set(surfacePos.x, surfacePos.y, surfacePos.z);

            _scratchVecA.set(surfacePos.x, surfacePos.y, surfacePos.z).normalize();
            _scratchQuat.setFromUnitVectors(_scratchUp, _scratchVecA);
            markerAnchor.quaternion.copy(_scratchQuat);

            const miniCraft = createCompositeSpacecraftGroup(
              art.proceduralModelType,
              art.primaryColorHex,
              art.accentColorHex,
              isSelected ? 0.36 : 0.25
            );
            const rig = miniCraft.userData.animRig as SpacecraftAnimationRig | undefined;
            if (rig && isSelected) {
              rig.instrumentBeamGroup.visible = true;
              if (art.id.includes('PERSEVERANCE') || art.id.includes('INGENUITY')) {
                rig.ingenuityGroup.visible = true;
              }
            }
            markerAnchor.add(miniCraft);
            globeAnimatedCrafts.push(miniCraft);

            const beaconGeo = new THREE.RingGeometry(
              isSelected ? 0.26 : 0.18,
              isSelected ? 0.34 : 0.23,
              28
            );
            beaconGeo.rotateX(-Math.PI / 2);
            const beaconMat = new THREE.MeshBasicMaterial({
              color: isSelected
                ? 0x06b6d4
                : primaryCoord.record.verification === 'ESTIMATED'
                ? 0xf59e0b
                : 0x10b981,
              side: THREE.DoubleSide,
              depthWrite: false,
            });
            const beaconRing = new THREE.Mesh(beaconGeo, beaconMat);
            beaconRing.position.y = 0.02;
            markerAnchor.add(beaconRing);

            const hitProxy = new THREE.Mesh(
              new THREE.SphereGeometry(0.42, 12, 12),
              new THREE.MeshBasicMaterial({ visible: false })
            );
            hitProxy.position.y = 0.2;
            hitProxy.userData = {
              interactionType: 'artifact',
              artifactId: art.id,
              label: `${art.name} · ${art.regionName} [${primaryCoord.record.verification}]`,
            };
            markerAnchor.add(hitProxy);
            interactables.push(hitProxy);

            globeGroup.add(markerAnchor);
          }

          if (layers.showTraverses && art.traversePath && art.traversePath.length > 1) {
            const pathPts: THREE.Vector3[] = [];
            for (const wp of art.traversePath) {
              const p = latLonToCartesian(wp.lat, wp.lon, GLOBE_RADIUS + 0.045);
              pathPts.push(new THREE.Vector3(p.x, p.y, p.z));
            }
            const pathCurve = new THREE.CatmullRomCurve3(pathPts);
            const tubeGeo = new THREE.TubeGeometry(pathCurve, 32, 0.024, 6, false);
            const tubeMat = new THREE.MeshBasicMaterial({
              color: 0x06b6d4,
            });
            globeGroup.add(new THREE.Mesh(tubeGeo, tubeMat));
          }
        }

        const focusedArt = bodyArtifacts.find((a) => a.id === artId) || bodyArtifacts[0];
        const focusedCoord = focusedArt ? getPrimaryCoordinate(focusedArt) : null;
        if (focusedCoord) {
          const targetSurf = latLonToCartesian(
            focusedCoord.record.lat,
            focusedCoord.record.lon,
            GLOBE_RADIUS
          );
          _scratchVecA.set(targetSurf.x, targetSurf.y, targetSurf.z).normalize();
          camLookTarget.set(0, 0, 0);
          camTargetPos.copy(_scratchVecA).multiplyScalar(GLOBE_RADIUS * 2.15);
          isCameraTransitioning = true;
        } else {
          camLookTarget.set(0, 0, 0);
          camTargetPos.set(0, 4, GLOBE_RADIUS * 2.25);
          isCameraTransitioning = true;
        }
        return;
      }

      if (mode === 'satellite_world') {
        while (satelliteWorldGroup.children.length > 0) {
          satelliteWorldGroup.remove(satelliteWorldGroup.children[0]);
        }

        const satSpec =
          NATURAL_SATELLITES_CATALOG.find((s) => s.id === satId) ||
          NATURAL_SATELLITES_CATALOG.find((s) => s.id === 'sat-europa') ||
          NATURAL_SATELLITES_CATALOG[0];

        const stageRadius = 4.8;
        const builtStage = buildSatelliteWorldStage(
          satSpec,
          stageRadius,
          solarTex,
          presMode,
          layers.showGeology,
          layers.showGraticule
        );
        satelliteWorldGroup.add(builtStage.group);
        activeSatelliteWorldRig = builtStage;
        interactables.push(...builtStage.interactables);

        if (presMode === 'scientific' && currentWellDepth > 0.02) {
          const localWell = createLocalPlanetaryWellMesh(
            stageRadius,
            satSpec.plumeColorHex || '#38bdf8',
            currentWellDepth * 0.85
          );
          satelliteWorldGroup.add(localWell);
        }

        const shotEval = evaluateCinematicCameraShot(
          shotPreset,
          stageRadius,
          builtStage.primaryFormationWorldPos,
          builtStage.parentPlanetPosition,
          0
        );
        camLookTarget.copy(shotEval.lookTarget);
        camTargetPos.copy(shotEval.cameraPos);
        camera.fov = shotEval.fovDeg;
        camera.updateProjectionMatrix();
        isCameraTransitioning = true;
        isSatelliteCinematicShotActive = true;
        return;
      }

      if (mode === 'hardware_inspector') {
        while (inspectorGroup.children.length > 0) {
          inspectorGroup.remove(inspectorGroup.children[0]);
        }

        const art = artifacts.find((a) => a.id === artId) || artifacts[0];

        const basePedestal = new THREE.Mesh(
          new THREE.CylinderGeometry(3.8, 4.1, 0.24, 64),
          new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.75,
            metalness: 0.3,
            envMapIntensity: 0.15,
          })
        );
        basePedestal.position.y = -0.12;
        basePedestal.receiveShadow = true;
        inspectorGroup.add(basePedestal);

        const ringGrid = new THREE.Mesh(
          new THREE.RingGeometry(3.55, 3.65, 64),
          new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.55,
            polygonOffset: true,
            polygonOffsetFactor: -1,
            polygonOffsetUnits: -1,
          })
        );
        ringGrid.rotateX(-Math.PI / 2);
        ringGrid.position.y = 0.02;
        inspectorGroup.add(ringGrid);

        const craftModel = createCompositeSpacecraftGroup(
          art.proceduralModelType,
          art.primaryColorHex,
          art.accentColorHex,
          1.95
        );
        craftModel.position.set(0, 0, 0);
        inspectorGroup.add(craftModel);
        activeInspectorModel = craftModel;

        camLookTarget.set(0, 1.15, 0);
        camTargetPos.set(4.6, 3.2, 5.2);
        isCameraTransitioning = true;
        return;
      }

      if (mode === 'story_cinema') {
        while (storyCinemaGroup.children.length > 0) {
          storyCinemaGroup.remove(storyCinemaGroup.children[0]);
        }

        const art = artifacts.find((a) => a.id === artId) || artifacts[0];
        const isMars = art.bodyId === 'mars';
        const isMoon = art.bodyId === 'moon';

        // 1. Curved Planetary Surface Horizon Stage + 50,688-Triangle Displaced Crater & Boulder Patch
        const terrainPatchRadius = 26;
        const terrainSphere = new THREE.Mesh(
          new THREE.SphereGeometry(terrainPatchRadius, 128, 84),
          new THREE.MeshStandardMaterial({
            color: 0xdbe4ee,
            map: isMars ? solarTex.mars : isMoon ? solarTex.moon : solarTex.saturn,
            bumpMap: isMars ? solarTex.marsBump : solarTex.moonBump,
            bumpScale: 0.18,
            roughness: 0.92,
            metalness: 0.04,
            envMapIntensity: 0.1,
          })
        );
        terrainSphere.position.set(0, -terrainPatchRadius, 0);
        terrainSphere.receiveShadow = true;
        storyCinemaGroup.add(terrainSphere);

        // Thin Mars atmospheric dust limb haze (optical back-scattering on tenuous CO2 boundary)
        if (isMars) {
          const marsAtmoGeo = new THREE.SphereGeometry(terrainPatchRadius * 1.025, 64, 42);
          const marsAtmoMat = new THREE.MeshBasicMaterial({
            color: 0xc2410c,
            transparent: true,
            opacity: 0.14,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          const marsAtmo = new THREE.Mesh(marsAtmoGeo, marsAtmoMat);
          marsAtmo.position.set(0, -terrainPatchRadius, 0);
          storyCinemaGroup.add(marsAtmo);
        }

        // Attach High-Polygon Displaced Crater Rim & 56-Boulder Patch directly under the landing site
        const highPolyPatch = buildHighPolyLandingSiteTerrainPatch(
          art.bodyId,
          terrainPatchRadius,
          new THREE.Vector3(0, 1, 0)
        );
        highPolyPatch.position.set(0, 0.01, 0);
        highPolyPatch.scale.set(3.2, 1.4, 3.2);
        storyCinemaGroup.add(highPolyPatch);

        // Local Gravitational Potential Funnel on the Landing Zone
        if (currentWellDepth > 0.02) {
          const wellGrid = createLocalPlanetaryWellMesh(
            3.6,
            isMars ? '#f59e0b' : '#06b6d4',
            currentWellDepth * 0.45
          );
          wellGrid.position.y = 0.14;
          storyCinemaGroup.add(wellGrid);
        }

        // 2. 3D Interplanetary / Descent Trajectory Spline Curve + 6 Holographic Entry Corridor Gates
        const trajectoryCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-9.5, 7.2, -7.5),
          new THREE.Vector3(-5.2, 5.4, -3.8),
          new THREE.Vector3(-2.1, 3.1, -1.4),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(1.4, 0.02, 1.2),
          new THREE.Vector3(2.6, 0.02, 0.4),
        ]);
        activeStoryCurve = trajectoryCurve;

        const curveLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(trajectoryCurve.getPoints(90)),
          new THREE.LineBasicMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.55,
          })
        );
        storyCinemaGroup.add(curveLine);

        // Add 6 Holographic Trajectory Corridor Waypoint Gates along the approach spline
        const gateGeo = new THREE.RingGeometry(0.85, 0.94, 6);
        for (let g = 0; g < 5; g++) {
          const gt = 0.06 + g * 0.11;
          const gPos = trajectoryCurve.getPointAt(gt);
          const gTan = trajectoryCurve.getTangentAt(gt);
          const gateMat = new THREE.MeshBasicMaterial({
            color: g % 2 === 0 ? 0x06b6d4 : 0xf59e0b,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.42,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          const gateMesh = new THREE.Mesh(gateGeo, gateMat);
          gateMesh.position.copy(gPos);
          gateMesh.lookAt(gPos.clone().add(gTan));
          storyCinemaGroup.add(gateMesh);
          storyCorridorGates.push(gateMesh);
        }

        // 3. Hero Animated High-Polygon Composite Spacecraft Group
        const craftModel = createCompositeSpacecraftGroup(
          art.proceduralModelType,
          art.primaryColorHex,
          art.accentColorHex,
          1.45
        );
        storyCinemaGroup.add(craftModel);
        activeStoryCraftModel = craftModel;

        // 4. Chapter 13: Legacy Deep Space Network Observatory Antenna & 3D FFT Spectrum
        const obsBuilt = buildObservatory3DGroup();
        storyCinemaGroup.add(obsBuilt.group);
        activeObservatoryGroup = obsBuilt.group;
        activeObservatoryDishPivot = obsBuilt.dishPivot;
        activeObservatoryFftBars.push(...obsBuilt.fftBars);
        activeObservatoryGroup.visible = false;

        // 5. Chapter 14: Historical Artifact Sanctuary, Stela Plaque & Regolith Dust Motes
        const endBuilt = buildEndingMonuments3DGroup();
        storyCinemaGroup.add(endBuilt.group);
        activeEndingMonumentsGroup = endBuilt.group;
        activeEndingParticles = endBuilt.particles;
        activeEndingMonumentsGroup.visible = false;

        camLookTarget.set(1.0, 0.9, 0);
        camTargetPos.set(-4.8, 3.4, 6.8);
        isCameraTransitioning = true;
      }
    };

    function pPtsZ(z: number): number {
      return z;
    }

    rebuildActiveSceneContent();

    sceneControllerRef.current = {
      syncSceneMode: rebuildActiveSceneContent,
      resetCamera: () => {
        rebuildActiveSceneContent();
      },
    };

    // 11. Pointer Raycasting (Supports recursive LOD & Natural Satellite inspection)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverRaycastMs = 0;

    const resolveUserData = (obj: THREE.Object3D): Record<string, any> => {
      let cur: THREE.Object3D | null = obj;
      while (cur) {
        if (
          cur.userData &&
          (cur.userData.interactionType || cur.userData.type === 'natural_satellite')
        ) {
          return cur.userData;
        }
        cur = cur.parent;
      }
      return obj.userData || {};
    };

    const updatePointerFromEvent = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (e: MouseEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: MouseEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (dx * dx + dy * dy > 64) return;

      updatePointerFromEvent(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactables, true);
      if (hits.length > 0) {
        const hit = hits[0];
        const uData = resolveUserData(hit.object);
        if (uData.interactionType === 'artifact' && uData.artifactId) {
          stateRef.current.onSelectArtifact(uData.artifactId);
        } else if (uData.type === 'natural_satellite' || uData.interactionType === 'satellite') {
          if (uData.scientificMetadata) {
            stateRef.current.onSelectSatellite?.(uData.scientificMetadata);
          }
          trackedSatelliteMesh = hit.object;
          hit.object.getWorldPosition(_scratchVecA);
          camLookTarget.copy(_scratchVecA);
          camTargetPos.set(_scratchVecA.x + 1.4, _scratchVecA.y + 0.85, _scratchVecA.z + 1.4);
          isCameraTransitioning = true;
        } else if (uData.interactionType === 'body' && uData.bodyId) {
          trackedSatelliteMesh = null;
          stateRef.current.onSelectSatellite?.(null);
          stateRef.current.onSelectBody(uData.bodyId);
        }
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastHoverRaycastMs < 60) return;
      lastHoverRaycastMs = now;

      updatePointerFromEvent(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactables, true);
      if (hits.length > 0) {
        const hit = hits[0];
        const uData = resolveUserData(hit.object);
        if (uData.label) {
          stateRef.current.onHoverObjectLabel(uData.label);
        } else {
          stateRef.current.onHoverObjectLabel(null);
        }

        if (uData.interactionType === 'globe_surface' && activeGlobeMesh) {
          const pt = hit.point;
          const coords = cartesianToLatLon(pt.x, pt.y, pt.z);
          stateRef.current.onHoverCoordinate({
            lat: coords.lat,
            lon: coords.lon,
            datum: uData.datum || 'IAU Planetary Frame',
          });
        } else {
          stateRef.current.onHoverCoordinate(null);
        }
      } else {
        stateRef.current.onHoverObjectLabel(null);
        stateRef.current.onHoverCoordinate(null);
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (composer) {
        composer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    // 12. Master Animation Loop
    let frameId = 0;
    let isDisposed = false;
    const clock = new THREE.Clock();
    let elapsedTotal = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      elapsedTotal += dt;

      const {
        viewportMode: mode,
        simulationSpeed: speed,
        explodedFactor: targetExplode,
        activeStoryChapter: chapter,
        storyProgress: progress,
        cinemaCameraMode: camRigMode,
      } = stateRef.current;

      // A. SOLAR SYSTEM MODE
      if (mode === 'solar_system') {
        if (speed > 0) {
          planetMeshes.forEach((entry, id) => {
            entry.lod.rotation.y += dt * 0.32 * speed;
            if (entry.atmosphereMesh) {
              entry.atmosphereMesh.rotation.y += dt * 0.42 * speed;
            }
            entry.moons.forEach((m) => {
              m.angle += dt * m.speed * speed * 0.45;
              const semiMinor =
                m.baseOrbitRadius * Math.sqrt(Math.max(0.2, 1 - m.eccentricity * m.eccentricity));
              m.mesh.position.set(
                Math.cos(m.angle) * m.baseOrbitRadius - m.baseOrbitRadius * m.eccentricity,
                0,
                Math.sin(m.angle) * semiMinor
              );
              m.mesh.rotation.y += dt * 0.55;
            });

            if (id !== stateRef.current.selectedBodyId && entry.orbitRadius > 0) {
              entry.angle += dt * 0.045 * entry.speed * speed;
              entry.pivot.position.set(
                Math.cos(entry.angle) * entry.orbitRadius,
                0,
                Math.sin(entry.angle) * entry.orbitRadius
              );
            }
          });

          decorativePlanets.forEach((dp) => {
            dp.lod.rotation.y += dt * 0.25 * speed;
            dp.angle += dt * 0.045 * dp.speed * speed;
            dp.pivot.position.set(
              Math.cos(dp.angle) * dp.orbitRadius,
              0,
              Math.sin(dp.angle) * dp.orbitRadius
            );
          });

          gltfAsteroidsGroup.rotation.y += dt * 0.015 * speed;
          beltInstanced.rotation.y += dt * 0.012 * speed;
        }

        if (trackedSatelliteMesh) {
          trackedSatelliteMesh.getWorldPosition(_scratchVecA);
          camLookTarget.copy(_scratchVecA);
        }

        syncGravityWells();

        heliocentricFlights.forEach((fl) => {
          const fromEntry = planetMeshes.get(fl.fromBody);
          const toEntry = planetMeshes.get(fl.toBody);
          if (!fromEntry || !toEntry) return;

          fl.phase = (fl.phase + dt * fl.speed * Math.max(0.25, speed)) % 1.0;
          const p0 = fromEntry.pivot.position;
          const p2 = toEntry.pivot.position;

          _scratchVecA.lerpVectors(p0, p2, 0.5);
          const perpX = -(p2.z - p0.z) * 0.18;
          const perpZ = (p2.x - p0.x) * 0.18;
          _scratchVecA.x += perpX;
          _scratchVecA.y += fl.arcHeight;
          _scratchVecA.z += perpZ;

          const posAttr = fl.line.geometry.attributes.position as THREE.BufferAttribute;
          for (let s = 0; s <= 32; s++) {
            const t = s / 32;
            const inv = 1 - t;
            const x = inv * inv * p0.x + 2 * inv * t * _scratchVecA.x + t * t * p2.x;
            const y = inv * inv * p0.y + 2 * inv * t * _scratchVecA.y + t * t * p2.y;
            const z = inv * inv * p0.z + 2 * inv * t * _scratchVecA.z + t * t * p2.z;
            posAttr.setXYZ(s, x, y, z);
          }
          posAttr.needsUpdate = true;

          const t = fl.phase;
          const inv = 1 - t;
          const cx = inv * inv * p0.x + 2 * inv * t * _scratchVecA.x + t * t * p2.x;
          const cy = inv * inv * p0.y + 2 * inv * t * _scratchVecA.y + t * t * p2.y;
          const cz = inv * inv * p0.z + 2 * inv * t * _scratchVecA.z + t * t * p2.z;
          fl.craft.position.set(cx, cy, cz);

          const tNext = Math.min(1, t + 0.02);
          const invN = 1 - tNext;
          _scratchVecB.set(
            invN * invN * p0.x + 2 * invN * tNext * _scratchVecA.x + tNext * tNext * p2.x,
            invN * invN * p0.y + 2 * invN * tNext * _scratchVecA.y + tNext * tNext * p2.y,
            invN * invN * p0.z + 2 * invN * tNext * _scratchVecA.z + tNext * tNext * p2.z
          );
          fl.craft.lookAt(_scratchVecB);

          const rig = fl.craft.userData.animRig as SpacecraftAnimationRig | undefined;
          if (rig) {
            rig.machPlumeMaterial.uniforms.uTime.value = elapsedTotal;
          }
        });
      }

      // B. PLANETARY GLOBE MODE (including Orbiting Reconnaissance Satellite LRO / MRO)
      if (mode === 'moon_globe' || mode === 'mars_globe') {
        if (activeGlobeReconSat) {
          activeGlobeReconSat.pivot.rotation.y += dt * 0.36;
          activeGlobeReconSat.solarWingL.rotation.x = Math.sin(elapsedTotal * 0.8) * 0.4;
          activeGlobeReconSat.solarWingR.rotation.x = Math.sin(elapsedTotal * 0.8) * 0.4;
          activeGlobeReconSat.dishGroup.rotation.y = elapsedTotal * 0.6;
        }

        globeAnimatedCrafts.forEach((craft) => {
          const rig = craft.userData.animRig as SpacecraftAnimationRig | undefined;
          if (!rig) return;
          if (rig.dishGroup) {
            rig.dishGroup.rotation.y = Math.sin(elapsedTotal * 1.4) * 0.35;
          }
          if (rig.mastGroup) {
            rig.mastGroup.rotation.y = Math.sin(elapsedTotal * 1.1) * 0.45;
          }
          if (rig.ingenuityGroup.visible) {
            rig.ingenuityRotorA.rotation.y += dt * 28;
            rig.ingenuityRotorB.rotation.y -= dt * 28;
            rig.ingenuityGroup.position.y = 0.85 + Math.sin(elapsedTotal * 2.5) * 0.25;
            rig.ingenuityGroup.position.x = Math.cos(elapsedTotal * 0.9) * 1.25;
            rig.ingenuityGroup.position.z = Math.sin(elapsedTotal * 0.9) * 1.25;
          }
        });
      }

      // B2. SATELLITE WORLD STAGE MODE (22 Natural Satellite Worlds + Active Plumes + Parent Planet Sky + 8-Shot Camera Director)
      if (mode === 'satellite_world' && activeSatelliteWorldRig) {
        activeSatelliteWorldRig.parentPlanetGroup.rotation.y += dt * 0.14;
        if (activeSatelliteWorldRig.volcanicLight) {
          activeSatelliteWorldRig.volcanicLight.intensity =
            1.6 + Math.sin(elapsedTotal * 7.5) * 0.45;
        }
        if (activeSatelliteWorldRig.plumeParticles) {
          activeSatelliteWorldRig.plumeParticles.rotation.y += dt * 0.65;
          const sPulse = 1 + Math.sin(elapsedTotal * 3.2) * 0.08;
          activeSatelliteWorldRig.plumeParticles.scale.set(1, sPulse, 1);
        }

        if (
          isSatelliteCinematicShotActive ||
          stateRef.current.presentationMode === 'cinematic'
        ) {
          const shotEval = evaluateCinematicCameraShot(
            stateRef.current.cinematicShotPreset,
            4.8,
            activeSatelliteWorldRig.primaryFormationWorldPos,
            activeSatelliteWorldRig.parentPlanetPosition,
            elapsedTotal
          );
          camTargetPos.copy(shotEval.cameraPos);
          camLookTarget.copy(shotEval.lookTarget);
          const alpha = 1 - Math.exp(-3.6 * dt);
          camera.position.lerp(camTargetPos, alpha);
          controls.target.lerp(camLookTarget, alpha);
        }
      }

      // C. HARDWARE INSPECTOR MODE
      if (mode === 'hardware_inspector' && activeInspectorModel) {
        currentExplodedDisplay = THREE.MathUtils.damp(
          currentExplodedDisplay,
          targetExplode,
          6.0,
          dt
        );
        const parts = activeInspectorModel.userData.explodableParts as
          | {
              obj: THREE.Object3D;
              basePos: THREE.Vector3;
              explodeDir: THREE.Vector3;
            }[]
          | undefined;
        if (parts) {
          for (const part of parts) {
            part.obj.position
              .copy(part.basePos)
              .addScaledVector(part.explodeDir, currentExplodedDisplay);
          }
        }
      }

      // D. HYPER-DETAILED 12-CHAPTER STORYLINE CINEMA CHOREOGRAPHY MODE (`story_cinema`)
      if (mode === 'story_cinema' && activeStoryCraftModel && activeStoryCurve) {
        const rig = activeStoryCraftModel.userData.animRig as
          | SpacecraftAnimationRig
          | undefined;

        // Rotate holographic approach corridor gates
        storyCorridorGates.forEach((gate, gIdx) => {
          gate.rotation.z = elapsedTotal * (gIdx % 2 === 0 ? 0.6 : -0.6);
          gate.visible = chapter >= 2 && chapter <= 5;
        });

        if (rig) {
          // Advance custom GLSL shader uniforms
          rig.machPlumeMaterial.uniforms.uTime.value = elapsedTotal;
          rig.entryPlasmaMaterial.uniforms.uTime.value = elapsedTotal;

          // Reset all chapter-specific FX flags first
          rig.thrusterPlumeGroup.visible = false;
          rig.entryPlasmaDome.visible = false;
          rig.detachableHeatshield.visible = false;
          rig.parachuteGroup.visible = false;
          rig.skyCraneGroup.visible = false;
          rig.rcsPlumesGroup.visible = false;
          rig.dustWaveRing.visible = false;
          rig.dustParticleSystem.visible = false;
          rig.lidarScanRing.visible = false;
          rig.instrumentBeamGroup.visible = false;
          rig.telemetryWavesGroup.visible = false;
          rig.reconOrbiterGroup.visible = camRigMode === 'sat_recon';
          rig.ingenuityGroup.visible = false;
          activeStoryCraftModel.rotation.set(0, 0, 0);

          // Reset default deployed pose on solar wings & mast unless overridden by chapter
          if (rig.solarWingL && rig.solarWingR) {
            rig.solarWingL.rotation.z = 0;
            rig.solarWingR.rotation.z = 0;
          }

          if (chapter === 1) {
            // CHAPTER 01 — Launch & Pad: Cleanroom Spin-Balance, Solar Wing Deployment & 5-DOF Arm Calibration
            activeStoryCraftModel.position.set(
              0,
              2.4 + Math.sin(elapsedTotal * 1.8) * 0.16,
              0
            );
            activeStoryCraftModel.rotation.y = progress * Math.PI * 2;
            rig.rcsPlumesGroup.visible = progress > 0.4 && Math.sin(elapsedTotal * 12) > 0.1;
            rig.thrusterPlumeGroup.visible = progress > 0.75;
            rig.thrusterPlumeGroup.scale.setScalar(
              0.68 + Math.sin(elapsedTotal * 18) * 0.18
            );

            const deployFactor = Math.min(1, Math.max(0, (progress - 0.15) / 0.55));
            if (rig.solarWingL && rig.solarWingR) {
              rig.solarWingL.rotation.z = -(1 - deployFactor) * 1.25;
              rig.solarWingR.rotation.z = (1 - deployFactor) * 1.25;
            }
            if (rig.dishGroup) {
              rig.dishGroup.rotation.y = Math.sin(progress * Math.PI * 4) * 0.85;
            }
            if (rig.mastGroup) {
              rig.mastGroup.rotation.y = Math.cos(progress * Math.PI * 2) * 0.65;
            }
            if (rig.armGroup && rig.armForearmGroup && rig.armTurretGroup) {
              rig.armGroup.rotation.y = Math.sin(elapsedTotal * 1.8) * 0.35;
              rig.armForearmGroup.rotation.x = Math.cos(elapsedTotal * 2.1) * 0.3;
              rig.armTurretGroup.rotation.y = elapsedTotal * 2.5;
            }
          } else if (chapter === 2 || chapter === 3 || chapter === 4) {
            // CHAPTERS 02–04 — Orbital Injection (02), Deep-Space Cruise & TCM (03), Planetary Gravity Capture (04)
            const segStart = chapter === 2 ? 0.02 : chapter === 3 ? 0.22 : 0.42;
            const segEnd = chapter === 2 ? 0.22 : chapter === 3 ? 0.42 : 0.62;
            const splineT = THREE.MathUtils.lerp(segStart, segEnd, progress);
            activeStoryCurve.getPointAt(splineT, _scratchVecA);
            activeStoryCraftModel.position.copy(_scratchVecA);

            const lookT = Math.min(0.66, splineT + 0.04);
            activeStoryCurve.getPointAt(lookT, _scratchVecB);
            activeStoryCraftModel.lookAt(_scratchVecB);
            activeStoryCraftModel.rotateX(Math.PI / 2);

            rig.thrusterPlumeGroup.visible = chapter !== 3 || (progress > 0.35 && progress < 0.65);
            const pulse = 1.05 + Math.sin(elapsedTotal * 26) * 0.22;
            rig.thrusterPlumeGroup.scale.set(
              1.1,
              pulse * (chapter === 2 ? 1.55 : 1.25),
              1.1
            );
            rig.rcsPlumesGroup.visible =
              chapter === 3 || (progress > 0.3 && Math.sin(elapsedTotal * 20) > 0);
          } else if (chapter === 5) {
            // CHAPTER 05 — Entry / PDI: Hypersonic Entry Plasma Bow-Shock Dome or Airless Powered Descent Initiation
            const easeOut = 1 - Math.pow(1 - progress, 1.8);
            const altY = THREE.MathUtils.lerp(5.6, 2.2, easeOut);
            const latX = THREE.MathUtils.lerp(-2.8, -0.9, easeOut);
            activeStoryCraftModel.position.set(latX, altY, 0);
            activeStoryCraftModel.rotation.z =
              0.16 + Math.sin(elapsedTotal * 16) * 0.03;

            const isAirlessBody = stateRef.current.selectedBodyId === 'moon';
            if (isAirlessBody) {
              rig.thrusterPlumeGroup.visible = true;
              rig.thrusterPlumeGroup.scale.setScalar(
                1.05 + Math.sin(elapsedTotal * 32) * 0.2
              );
              rig.rcsPlumesGroup.visible = true;
            } else {
              rig.entryPlasmaDome.visible = true;
              rig.entryPlasmaMaterial.uniforms.uIntensity.value =
                0.45 + 0.55 * Math.sin(progress * Math.PI);
              rig.detachableHeatshield.visible = true;
              rig.detachableHeatshield.position.set(0, 0.05, 0);
              rig.detachableHeatshield.rotation.set(0, 0, 0);
              rig.rcsPlumesGroup.visible = Math.sin(elapsedTotal * 24) > 0;
            }
          } else if (chapter === 6) {
            // CHAPTER 06 — Terminal Descent & Touchdown: Supersonic Parachute, Heatshield Separation, Sky-Crane & Dust Ejecta
            const easeOut = 1 - Math.pow(1 - progress, 2.2);
            const altY = THREE.MathUtils.lerp(2.2, 0.0, easeOut);
            const latX = THREE.MathUtils.lerp(-0.9, 0.0, easeOut);
            activeStoryCraftModel.position.set(latX, altY, 0);
            activeStoryCraftModel.rotation.z = (1 - easeOut) * 0.08;

            const isAirlessBody = stateRef.current.selectedBodyId === 'moon';
            if (isAirlessBody) {
              rig.thrusterPlumeGroup.visible = progress < 0.92;
              rig.thrusterPlumeGroup.scale.setScalar(
                (1 - progress * 0.65) * (0.95 + Math.sin(elapsedTotal * 32) * 0.18)
              );
              rig.rcsPlumesGroup.visible = progress < 0.9;
            } else if (progress < 0.52) {
              rig.parachuteGroup.visible = true;
              const chuteScale = Math.min(1, progress / 0.12);
              rig.parachuteGroup.scale.set(
                chuteScale * (1 + Math.sin(elapsedTotal * 16) * 0.03),
                chuteScale,
                chuteScale * (1 + Math.cos(elapsedTotal * 16) * 0.03)
              );
              rig.detachableHeatshield.visible = true;
              const sepDrop = progress * 9.5;
              rig.detachableHeatshield.position.set(sepDrop * 0.38, -sepDrop, sepDrop * 0.12);
              rig.detachableHeatshield.rotation.set(sepDrop * 0.3, sepDrop * 0.5, sepDrop * 0.45);
            } else {
              if (rig.wheels.length > 0) {
                rig.skyCraneGroup.visible = true;
                rig.skyCraneGroup.position.y = 2.15 + Math.sin(elapsedTotal * 22) * 0.04;
              } else {
                rig.thrusterPlumeGroup.visible = progress < 0.94;
                rig.thrusterPlumeGroup.scale.setScalar(0.85 + Math.sin(elapsedTotal * 28) * 0.18);
              }
            }

            rig.lidarScanRing.visible = true;
            const lidarPulse = ((elapsedTotal * 2.5) % 1.0) * 2.4;
            rig.lidarScanRing.scale.setScalar(0.55 + lidarPulse);
            rig.lidarScanRing.position.y = -altY + 0.04;

            if (progress > 0.35) {
              const pFactor = (progress - 0.35) / 0.65;
              rig.dustWaveRing.visible = true;
              rig.dustWaveRing.scale.setScalar(1 + pFactor * 7.8);
              (rig.dustWaveRing.material as THREE.MeshBasicMaterial).opacity =
                0.76 * (1 - pFactor * 0.85);
              rig.dustParticleSystem.visible = true;
              rig.dustParticleSystem.scale.set(
                1 + pFactor * 3.8,
                0.6 + pFactor * 1.9,
                1 + pFactor * 3.8
              );
              rig.dustParticleSystem.rotation.y = elapsedTotal * 2.6;
            }
          } else if (chapter === 7) {
            // CHAPTER 07 — Surface Deployment: Solar Array Unfurling, High-Gain Dish Lock, Mast Elevation & ALSEP/Payload Egress
            activeStoryCraftModel.position.set(0, 0, 0);
            const deployFactor = Math.min(1, progress * 1.35);
            if (rig.solarWingL && rig.solarWingR) {
              rig.solarWingL.rotation.z = -(1 - deployFactor) * 1.15;
              rig.solarWingR.rotation.z = (1 - deployFactor) * 1.15;
            }
            if (rig.dishGroup) {
              rig.dishGroup.rotation.y = progress * Math.PI * 1.5;
            }
            if (rig.mastGroup) {
              rig.mastGroup.rotation.y = Math.sin(progress * Math.PI * 2) * 0.75;
            }
            if (rig.deployedPackage) {
              rig.deployedPackage.position.set(
                0.65 + progress * 0.75,
                0.07,
                0.75 + progress * 0.65
              );
            }
            rig.telemetryWavesGroup.visible = progress > 0.5;
          } else if (chapter === 8) {
            // CHAPTER 08 — Primary Traverse: 24-Cleat Wheel Rotation, Rocker-Bogie Articulation & Ingenuity Coaxial Rotorcraft Scout
            if (rig.wheels.length > 0) {
              const driveX = Math.sin(progress * Math.PI * 2) * 1.65;
              const driveZ = (1 - Math.cos(progress * Math.PI * 2)) * 1.1;
              activeStoryCraftModel.position.set(driveX, 0, driveZ);
              activeStoryCraftModel.rotation.y = progress * Math.PI * 2 + Math.PI / 2;

              rig.wheels.forEach((w) => {
                w.rotation.x += dt * 6.2;
              });
              rig.rockerBogieGroups.forEach((bg, bIdx) => {
                bg.rotation.x = Math.sin(elapsedTotal * 4.5 + bIdx * Math.PI) * 0.085;
              });

              rig.ingenuityGroup.visible = true;
              rig.ingenuityRotorA.rotation.y += dt * 36;
              rig.ingenuityRotorB.rotation.y -= dt * 36;
              const flightAngle = progress * Math.PI * 4;
              rig.ingenuityGroup.position.set(
                Math.cos(flightAngle) * 1.65,
                1.35 + Math.sin(progress * Math.PI) * 0.95,
                Math.sin(flightAngle) * 1.65
              );
            } else {
              activeStoryCraftModel.position.set(0, 0, 0);
              rig.lidarScanRing.visible = true;
              rig.lidarScanRing.scale.setScalar(0.8 + ((elapsedTotal * 1.8) % 1.0) * 2.8);
              rig.lidarScanRing.position.y = 0.03;
            }
          } else if (chapter === 9) {
            // CHAPTER 09 — Core Discovery: 5-DOF Robotic Arm Coring, Active LIBS Laser Spectrometry & Volumetric LiDAR Rings
            activeStoryCraftModel.position.set(0, 0, 0);
            rig.instrumentBeamGroup.visible = true;
            rig.instrumentBeamGroup.rotation.y = Math.sin(elapsedTotal * 2.2) * 0.48;

            rig.lidarScanRing.visible = true;
            const scanScale = 0.6 + ((elapsedTotal * 1.4) % 1.0) * 3.2;
            rig.lidarScanRing.scale.setScalar(scanScale);
            rig.lidarScanRing.position.y = 0.03;

            if (rig.armGroup) {
              rig.armGroup.rotation.x = Math.sin(elapsedTotal * 2.0) * 0.22;
              rig.armGroup.rotation.y = Math.cos(elapsedTotal * 1.5) * 0.28;
            }
            if (rig.armForearmGroup) {
              rig.armForearmGroup.rotation.x = 0.25 + Math.sin(elapsedTotal * 2.4) * 0.18;
            }
            if (rig.armTurretGroup) {
              rig.armTurretGroup.rotation.y += dt * 3.2;
            }
            if (rig.mastGroup) {
              rig.mastGroup.rotation.y = Math.sin(elapsedTotal * 1.6) * 0.6;
            }
          } else if (chapter === 10) {
            // CHAPTER 10 — Environmental Survival: Swirling Dust Storm / Cryogenic Night Survival & Thermal Stow Pose
            activeStoryCraftModel.position.set(0, 0, 0);
            rig.dustParticleSystem.visible = true;
            rig.dustParticleSystem.scale.set(3.2, 2.1, 3.2);
            rig.dustParticleSystem.rotation.y = elapsedTotal * 1.25;

            if (rig.solarWingL && rig.solarWingR) {
              const tilt = Math.sin(elapsedTotal * 0.8) * 0.18;
              rig.solarWingL.rotation.z = tilt;
              rig.solarWingR.rotation.z = -tilt;
            }
            if (rig.mastGroup) {
              rig.mastGroup.rotation.x = 0.25;
            }
          } else if (chapter === 11) {
            // CHAPTER 11 — Final Transmission: Deep-Space Carrier Wave Attenuation & Loss of Signal
            activeStoryCraftModel.position.set(0, 0, 0);
            rig.telemetryWavesGroup.visible = true;
            rig.telemetryWavesGroup.children.forEach((child, idx) => {
              const mesh = child as THREE.Mesh;
              const cycle = (elapsedTotal * 0.65 + idx * 0.2) % 1.0;
              mesh.position.y = cycle * 3.8;
              mesh.scale.setScalar(1 + cycle * 2.5);
              (mesh.material as THREE.MeshBasicMaterial).opacity =
                (1 - cycle) * (1 - progress * 0.45) * 0.78;
            });

            rig.dustParticleSystem.visible = true;
            rig.dustParticleSystem.scale.set(2.4, 1.5, 2.4);
            rig.dustParticleSystem.rotation.y = elapsedTotal * 0.65;

            if (rig.dishGroup) {
              rig.dishGroup.rotation.x = -0.35;
              rig.dishGroup.rotation.y = Math.sin(elapsedTotal * 0.5) * 0.15;
            }
          } else if (chapter === 12) {
            // CHAPTER 12 — Orbital Recon & Legacy: Ultra-High-Polygon Reconnaissance Satellite Overflight & Heritage Swath Lock
            activeStoryCraftModel.position.set(0, 0, 0);
            rig.reconOrbiterGroup.visible = true;
            const passX = THREE.MathUtils.lerp(-3.8, 3.8, (progress + elapsedTotal * 0.08) % 1.0);
            rig.reconOrbiterGroup.position.set(passX, 4.1, Math.sin(elapsedTotal * 0.8) * 0.35);

            rig.lidarScanRing.visible = true;
            rig.lidarScanRing.scale.setScalar(1.8 + Math.sin(elapsedTotal * 3) * 0.35);
            rig.lidarScanRing.position.y = 0.03;
          } else if (chapter === 13) {
            // CHAPTER 13 — The Legacy Observatory: Deep Space Network 70m Dish Tracking, Hydrogen 1,420.405 MHz Line FFT Spectrum & Radiometry
            activeStoryCraftModel.position.set(0, 0, 0);
            if (activeObservatoryDishPivot) {
              activeObservatoryDishPivot.rotation.x = -0.32 + Math.sin(elapsedTotal * 0.12) * 0.08;
              activeObservatoryDishPivot.rotation.y = Math.sin(elapsedTotal * 0.08) * 0.18;
            }
            for (let b = 0; b < activeObservatoryFftBars.length; b++) {
              const bar = activeObservatoryFftBars[b];
              const distCenter = Math.abs(b - 12);
              const gauss = Math.exp(-(distCenter * distCenter) / 5.2);
              const timeWave =
                Math.sin(elapsedTotal * 5.5 + b * 0.75) * 0.16 +
                Math.sin(elapsedTotal * 11.0 + b * 1.8) * 0.08;
              const barHeight = Math.max(0.12, Math.min(1.45, 0.22 + gauss * 0.85 + timeWave));
              bar.scale.y = barHeight;
              bar.position.y = barHeight * 0.5;
            }
          } else if (chapter === 14) {
            // CHAPTER 14 — The Quiet Monuments: Planetary Archaeology Sanctuary & Epilogue
            activeStoryCraftModel.position.set(0, 0, 0);
            if (activeEndingParticles) {
              activeEndingParticles.rotation.y = elapsedTotal * 0.025;
            }
          }

          if (activeObservatoryGroup) {
            activeObservatoryGroup.visible = chapter === 13;
          }
          if (activeEndingMonumentsGroup) {
            activeEndingMonumentsGroup.visible = chapter === 14;
          }

          // Animate Ultra-High-Polygon Reconnaissance Satellite solar wings & HGA dish whenever visible
          if (rig.reconOrbiterGroup.visible) {
            if (camRigMode === 'sat_recon') {
              const passAngle = elapsedTotal * 0.22;
              rig.reconOrbiterGroup.position.set(
                Math.sin(passAngle) * 0.45,
                1.75,
                Math.cos(passAngle) * 0.35
              );
              rig.reconOrbiterGroup.rotation.y = passAngle + Math.PI * 0.25;
            } else if (chapter !== 12) {
              rig.reconOrbiterGroup.position.set(
                Math.sin(elapsedTotal * 0.35) * 1.4,
                4.1,
                Math.cos(elapsedTotal * 0.35) * 0.6
              );
            }
            if (rig.satSolarWingL && rig.satSolarWingR) {
              const trackAngle = Math.sin(elapsedTotal * 0.9) * 0.45;
              rig.satSolarWingL.rotation.x = trackAngle;
              rig.satSolarWingR.rotation.x = trackAngle;
            }
            if (rig.satDishGroup) {
              rig.satDishGroup.rotation.y = elapsedTotal * 0.8;
            }
          }

          // --- 6-CAMERA CINEMA RIG DIRECTOR (Including Satellite Recon View!) ---
          if (camRigMode !== 'free_orbit') {
            const craftPos = activeStoryCraftModel.position;
            const stageOffset = 1.05;

            if (camRigMode === 'sat_recon') {
              rig.reconOrbiterGroup.visible = true;
              const satLocal = rig.reconOrbiterGroup.position;
              const satScale = activeStoryCraftModel.scale.x || 1.45;
              const satWorldX = craftPos.x + satLocal.x * satScale;
              const satWorldY = craftPos.y + satLocal.y * satScale;
              const satWorldZ = craftPos.z + satLocal.z * satScale;
              camLookTarget.set(
                (satWorldX + craftPos.x) * 0.5 + 0.35,
                craftPos.y + 1.15,
                (satWorldZ + craftPos.z) * 0.5
              );
              camTargetPos.set(
                satWorldX - 0.95,
                satWorldY + 0.95,
                satWorldZ + 2.35
              );
            } else if (camRigMode === 'wing_pov') {
              camLookTarget.set(craftPos.x + stageOffset * 0.4, craftPos.y + 0.4, craftPos.z);
              camTargetPos.set(craftPos.x - 1.8, craftPos.y + 1.45, craftPos.z + 2.1);
            } else if (camRigMode === 'belly_cam') {
              camLookTarget.set(craftPos.x + stageOffset * 0.3, 0.0, craftPos.z);
              camTargetPos.set(craftPos.x - 0.8, craftPos.y + 3.8, craftPos.z + 1.6);
            } else if (camRigMode === 'orbital_chase') {
              const orbitAng = elapsedTotal * 0.35;
              camLookTarget.set(craftPos.x + stageOffset, craftPos.y + 0.7, craftPos.z);
              camTargetPos.set(
                craftPos.x + Math.cos(orbitAng) * 6.2,
                craftPos.y + 3.2,
                craftPos.z + Math.sin(orbitAng) * 6.2
              );
            } else {
              // `director_auto`: Automatic cinematic cuts tailored to active 14-chapter stage!
              camLookTarget.set(craftPos.x + stageOffset, craftPos.y + 0.75, craftPos.z);
              if (chapter >= 2 && chapter <= 4) {
                camTargetPos.set(craftPos.x - 3.6, craftPos.y + 2.2, craftPos.z + 4.8);
              } else if (chapter === 5 || chapter === 6) {
                camTargetPos.set(craftPos.x - 3.8, craftPos.y + 1.8, craftPos.z + 5.2);
              } else if (chapter === 9) {
                camTargetPos.set(craftPos.x - 3.0, craftPos.y + 1.9, craftPos.z + 4.1);
              } else if (chapter === 12) {
                camTargetPos.set(craftPos.x - 4.6, craftPos.y + 4.6, craftPos.z + 6.2);
              } else if (chapter === 13) {
                // Focus on DSN antenna station and 3D FFT spectrum array
                camLookTarget.set(craftPos.x + 1.15, craftPos.y + 1.25, craftPos.z + 0.15);
                camTargetPos.set(craftPos.x - 2.8, craftPos.y + 2.4, craftPos.z + 4.2);
              } else if (chapter === 14) {
                // Dignified slow orbital sweep around the Planetary Archaeology Sanctuary
                const endAngle = elapsedTotal * 0.04;
                camLookTarget.set(craftPos.x, craftPos.y + 0.72, craftPos.z);
                camTargetPos.set(
                  craftPos.x + Math.cos(endAngle) * 5.4,
                  craftPos.y + 1.95 + Math.sin(elapsedTotal * 0.06) * 0.22,
                  craftPos.z + Math.sin(endAngle) * 5.4
                );
              } else {
                camTargetPos.set(
                  craftPos.x - 4.2 + Math.sin(elapsedTotal * 0.25) * 0.8,
                  craftPos.y + 2.6,
                  craftPos.z + 5.4
                );
              }
            }

            const camAlpha = 1 - Math.exp(-4.2 * dt);
            camera.position.lerp(camTargetPos, camAlpha);
            controls.target.lerp(camLookTarget, camAlpha);

            // Anti-clipping ground boundary protection (keeps camera above planetary terrain)
            camera.position.y = Math.max(0.24, camera.position.y);
            controls.target.y = Math.max(0.05, controls.target.y);
          }
        }
      }

      if (isCameraTransitioning && mode !== 'story_cinema') {
        const alpha = 1 - Math.exp(-5.0 * dt);
        camera.position.lerp(camTargetPos, alpha);
        controls.target.lerp(camLookTarget, alpha);
        if (
          camera.position.distanceToSquared(camTargetPos) < 0.02 &&
          controls.target.distanceToSquared(camLookTarget) < 0.02
        ) {
          isCameraTransitioning = false;
        }
      }

      controls.update();
      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }
    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      controls.dispose();
      if (composer) {
        composer.dispose();
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    sceneControllerRef.current?.syncSceneMode();
  }, [
    viewportMode,
    selectedBodyId,
    selectedArtifactId,
    layerVisibility,
    wellDepth,
    cameraPresetKey,
    scaleMode,
    selectedSatelliteId,
    presentationMode,
    cinematicShotPreset,
  ]);

  return (
    <div
      ref={canvasMountRef}
      className="fixed inset-0 w-screen h-screen z-0 bg-[#07090E]"
      aria-label="Interactive 3D Planetary Archaeology Viewport"
    />
  );
};
