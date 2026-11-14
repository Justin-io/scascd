import * as THREE from 'three';
import { CelestialBodyId } from '../types/afterlight';
import {
  getAblativeHeatshieldMaterial,
  getAerospaceHullMaterial,
  getGoldKaptonMaterial,
  getSolarArrayMaterial,
} from './aerospaceTextures';


/**
 * Generates a soft radial contact shadow texture to ground 3D spacecraft and markers
 * without coplanar Z-fighting.
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.32)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Loads authentic planetary textures from `/solar-textures/` (ported from N3rson/Solar-System-3D)
 * while initializing immediate procedural fallback data so WebGL never renders blank frames.
 */
export interface AuthenticSolarTextures {
  skyboxCube: THREE.CubeTexture;
  sun: THREE.Texture;
  mercury: THREE.Texture;
  mercuryBump: THREE.Texture;
  venus: THREE.Texture;
  venusBump: THREE.Texture;
  venusAtmosphere: THREE.Texture;
  earthDay: THREE.Texture;
  earthNight: THREE.Texture;
  earthNormal: THREE.Texture;
  earthSpec: THREE.Texture;
  earthAtmosphere: THREE.Texture;
  moon: THREE.Texture;
  moonBump: THREE.Texture;
  mars: THREE.Texture;
  marsBump: THREE.Texture;
  jupiter: THREE.Texture;
  io: THREE.Texture;
  europa: THREE.Texture;
  ganymede: THREE.Texture;
  callisto: THREE.Texture;
  saturn: THREE.Texture;
  saturnRing: THREE.Texture;
  uranus: THREE.Texture;
  uranusRing: THREE.Texture;
  neptune: THREE.Texture;
  pluto: THREE.Texture;
  plutoBump: THREE.Texture;
}

export function loadAuthenticSolarTextures(maxAnisotropy: number): AuthenticSolarTextures {
  const loader = new THREE.TextureLoader();
  const cubeLoader = new THREE.CubeTextureLoader();

  const loadTex = (url: string, isSRGB = true): THREE.Texture => {
    const tex = loader.load(url);
    tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.anisotropy = maxAnisotropy;
    return tex;
  };

  const skyboxCube = cubeLoader.load([
    '/solar-textures/3.jpg',
    '/solar-textures/1.jpg',
    '/solar-textures/2.jpg',
    '/solar-textures/2.jpg',
    '/solar-textures/4.jpg',
    '/solar-textures/2.jpg',
  ]);
  skyboxCube.colorSpace = THREE.SRGBColorSpace;

  return {
    skyboxCube,
    sun: loadTex('/solar-textures/sun.jpg', true),
    mercury: loadTex('/solar-textures/mercurymap.jpg', true),
    mercuryBump: loadTex('/solar-textures/mercurybump.jpg', false),
    venus: loadTex('/solar-textures/venusmap.jpg', true),
    venusBump: loadTex('/solar-textures/venusbump.jpg', false),
    venusAtmosphere: loadTex('/solar-textures/venus_atmosphere.jpg', true),
    earthDay: loadTex('/solar-textures/earth_daymap.jpg', true),
    earthNight: loadTex('/solar-textures/earth_nightmap.jpg', true),
    earthNormal: loadTex('/solar-textures/earth_normalmap.jpg', false),
    earthSpec: loadTex('/solar-textures/earth_specularmap.jpg', false),
    earthAtmosphere: loadTex('/solar-textures/earth_atmosphere.jpg', true),
    moon: loadTex('/solar-textures/moonmap.jpg', true),
    moonBump: loadTex('/solar-textures/moonbump.jpg', false),
    mars: loadTex('/solar-textures/marsmap.jpg', true),
    marsBump: loadTex('/solar-textures/marsbump.jpg', false),
    jupiter: loadTex('/solar-textures/jupiter.jpg', true),
    io: loadTex('/solar-textures/jupiterIo.jpg', true),
    europa: loadTex('/solar-textures/jupiterEuropa.jpg', true),
    ganymede: loadTex('/solar-textures/jupiterGanymede.jpg', true),
    callisto: loadTex('/solar-textures/jupiterCallisto.jpg', true),
    saturn: loadTex('/solar-textures/saturnmap.jpg', true),
    saturnRing: loadTex('/solar-textures/saturn_ring.png', true),
    uranus: loadTex('/solar-textures/uranus.jpg', true),
    uranusRing: loadTex('/solar-textures/uranus_ring.png', true),
    neptune: loadTex('/solar-textures/neptune.jpg', true),
    pluto: loadTex('/solar-textures/plutomap.jpg', true),
    plutoBump: loadTex('/solar-textures/plutobump2k.jpg', false),
  };
}

/**
 * Custom GLSL Day/Night Terminator Shader for Earth (from N3rson/Solar-System-3D),
 * enhanced with twilight atmospheric scattering and city-light emission on the night side.
 */
export function createEarthDayNightMaterial(
  dayTexture: THREE.Texture,
  nightTexture: THREE.Texture,
  sunPosition: THREE.Vector3
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: { value: dayTexture },
      nightTexture: { value: nightTexture },
      sunPosition: { value: sunPosition },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vSunDirection;
      uniform vec3 sunPosition;

      void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vSunDirection = normalize(sunPosition - worldPosition.xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D dayTexture;
      uniform sampler2D nightTexture;
      varying vec3 vNormal;
      varying vec2 vUv;
      varying vec3 vSunDirection;

      void main() {
        float rawDot = dot(vNormal, vSunDirection);
        float dayWeight = smoothstep(-0.18, 0.25, rawDot);
        float twilight = smoothstep(-0.22, 0.05, rawDot) * (1.0 - smoothstep(0.0, 0.28, rawDot));
        vec4 dayColor = texture2D(dayTexture, vUv);
        vec4 nightColor = texture2D(nightTexture, vUv) * 0.45 + vec4(0.02, 0.04, 0.09, 1.0);
        vec3 twilightTint = vec3(0.95, 0.42, 0.15) * twilight * 0.35;
        vec3 finalRgb = mix(nightColor.rgb, dayColor.rgb * 1.12, dayWeight) + twilightTint;
        gl_FragColor = vec4(finalRgb, 1.0);
      }
    `,
  });
}

/**
 * Custom GLSL Mach-Diamond Rocket / Ion Plasma Exhaust Plume Shader
 */
export function createMachDiamondPlumeMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uCoreColor: { value: new THREE.Color('#38bdf8') },
      uOuterColor: { value: new THREE.Color('#f59e0b') },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uCoreColor;
      uniform vec3 uOuterColor;
      varying vec2 vUv;

      void main() {
        // vUv.y = 1.0 at nozzle throat, 0.0 at exhaust tip
        float nozzleDist = 1.0 - vUv.y;
        float machDiamonds = pow(max(0.0, sin(nozzleDist * 26.0 - uTime * 38.0)), 2.0);
        float coreWeight = smoothstep(0.65, 0.0, nozzleDist) * (0.65 + 0.35 * machDiamonds);
        vec3 col = mix(uOuterColor, uCoreColor, coreWeight) + vec3(0.9, 0.98, 1.0) * machDiamonds * 0.45 * (1.0 - nozzleDist);
        float alpha = pow(vUv.y, 1.35) * (0.55 + 0.45 * machDiamonds);
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.95));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * Custom GLSL Hypersonic Atmospheric Entry Plasma Bow-Shock Shader (1,450°C Ionization Sheath)
 */
export function createEntryPlasmaBowShockMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIntensity;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        float wave1 = sin(vUv.x * 24.0 + uTime * 22.0) * cos(vUv.y * 18.0 - uTime * 28.0);
        float wave2 = sin(vUv.x * 40.0 - uTime * 34.0);
        float plasma = 0.65 + 0.35 * (wave1 * 0.6 + wave2 * 0.4);
        vec3 hotCore = vec3(1.0, 0.92, 0.65);
        vec3 orangeShock = vec3(0.98, 0.42, 0.08);
        vec3 violetTrail = vec3(0.68, 0.22, 0.95);
        vec3 col = mix(violetTrail, mix(orangeShock, hotCore, plasma), vUv.y);
        float edgeFade = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.45, vUv.y);
        gl_FragColor = vec4(col * 1.35, clamp(edgeFade * plasma * uIntensity, 0.0, 0.92));
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * Generates high-detail zero-404 procedural planetary albedo, bump, and roughness
 * CanvasTextures as an immediate fallback.
 */
export function createPlanetaryTextures(
  bodyId: CelestialBodyId,
  maxAnisotropy: number
): {
  albedoMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const width = 1024;
  const height = 512;

  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = width;
  albedoCanvas.height = height;
  const aCtx = albedoCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bCtx = bumpCanvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rCtx = roughCanvas.getContext('2d')!;

  let seed = bodyId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0) * 31, 1337);
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, width, height);
  rCtx.fillStyle = '#b0b0b0';
  rCtx.fillRect(0, 0, width, height);

  if (bodyId === 'moon') {
    const grad = aCtx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#94a3b8');
    grad.addColorStop(0.5, '#cbd5e1');
    grad.addColorStop(1, '#94a3b8');
    aCtx.fillStyle = grad;
    aCtx.fillRect(0, 0, width, height);

    for (let i = 0; i < 240; i++) {
      const cx = rand() * width;
      const cy = 24 + rand() * (height - 48);
      const r = 2 + Math.pow(rand(), 3) * 26;
      bCtx.strokeStyle = 'rgba(235, 235, 235, 0.55)';
      bCtx.lineWidth = Math.max(1, r * 0.18);
      bCtx.beginPath();
      bCtx.arc(cx, cy, r, 0, Math.PI * 2);
      bCtx.stroke();
    }
  } else if (bodyId === 'mars') {
    const grad = aCtx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(0.06, '#b45309');
    grad.addColorStop(0.55, '#c2410c');
    grad.addColorStop(1, '#f1f5f9');
    aCtx.fillStyle = grad;
    aCtx.fillRect(0, 0, width, height);
  } else {
    aCtx.fillStyle = '#334155';
    aCtx.fillRect(0, 0, width, height);
  }

  const albedoMap = new THREE.CanvasTexture(albedoCanvas);
  albedoMap.colorSpace = THREE.SRGBColorSpace;
  albedoMap.wrapS = THREE.RepeatWrapping;
  albedoMap.wrapT = THREE.ClampToEdgeWrapping;
  albedoMap.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.colorSpace = THREE.NoColorSpace;
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;
  bumpMap.anisotropy = maxAnisotropy;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.colorSpace = THREE.NoColorSpace;
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.ClampToEdgeWrapping;
  roughnessMap.anisotropy = maxAnisotropy;

  return { albedoMap, bumpMap, roughnessMap };
}

/**
 * Creates a custom GLSL Fresnel atmospheric rim-lighting shell around a planet or star.
 */
export function createAtmosphereMesh(
  radius: number,
  colorHex: string,
  intensity = 0.65
): THREE.Mesh {
  const geo = new THREE.SphereGeometry(radius * 1.045, 32, 24);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(colorHex) },
      intensity: { value: intensity },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float intensity;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vec3 viewDir = normalize(vViewPosition);
        float rim = 1.0 - max(0.0, dot(viewDir, vNormal));
        float fresnel = pow(rim, 3.0) * intensity;
        gl_FragColor = vec4(glowColor, clamp(fresnel, 0.0, 0.85));
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 2;
  return mesh;
}

/**
 * 3D SPACETIME GRAVITATIONAL WELL DEPTH SYSTEM ("well depth")
 */
export interface GravityWellSource {
  x: number;
  z: number;
  strength: number;
  softening: number;
}

export interface GravitationalWellSystem {
  group: THREE.Group;
  updateWells: (sources: GravityWellSource[], depthMultiplier: number) => void;
}

export function createGravitationalWellSystem(): GravitationalWellSystem {
  const group = new THREE.Group();
  const gridSegments = 88;
  const extent = 150;

  const geo = new THREE.PlaneGeometry(extent, extent, gridSegments, gridSegments);
  geo.rotateX(-Math.PI / 2);

  const posAttr = geo.attributes.position as THREE.BufferAttribute;
  const vertexCount = posAttr.count;

  const basePositions = new Float32Array(vertexCount * 2);
  const colors = new Float32Array(vertexCount * 3);

  for (let i = 0; i < vertexCount; i++) {
    basePositions[i * 2] = posAttr.getX(i);
    basePositions[i * 2 + 1] = posAttr.getZ(i);
    colors[i * 3] = 0.05;
    colors[i * 3 + 1] = 0.25;
    colors[i * 3 + 2] = 0.45;
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const surfaceMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const surfaceMesh = new THREE.Mesh(geo, surfaceMat);
  group.add(surfaceMesh);

  const wireMat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    wireframe: true,
    transparent: true,
    opacity: 0.52,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const wireMesh = new THREE.Mesh(geo, wireMat);
  wireMesh.position.y = 0.02;
  group.add(wireMesh);

  const colorAttr = geo.attributes.color as THREE.BufferAttribute;

  const updateWells = (sources: GravityWellSource[], depthMultiplier: number) => {
    if (depthMultiplier <= 0.01) {
      group.visible = false;
      return;
    }
    group.visible = true;

    for (let i = 0; i < vertexCount; i++) {
      const vx = basePositions[i * 2];
      const vz = basePositions[i * 2 + 1];

      const distFromOrigin = Math.sqrt(vx * vx + vz * vz);
      const edgeFade = Math.max(0, 1 - Math.pow(distFromOrigin / (extent * 0.5), 3));

      let totalPotential = 0;
      for (let s = 0; s < sources.length; s++) {
        const src = sources[s];
        const dx = vx - src.x;
        const dz = vz - src.z;
        const d2 = dx * dx + dz * dz + src.softening * src.softening;
        totalPotential += src.strength / Math.sqrt(d2);
      }

      const depthY = -1.2 - totalPotential * depthMultiplier * edgeFade;
      posAttr.setY(i, depthY);

      const normDepth = Math.min(1, (totalPotential * depthMultiplier) / 16.5);
      let r = 0.04;
      let g = 0.22;
      let b = 0.42;

      if (normDepth < 0.45) {
        const t = normDepth / 0.45;
        r = 0.04 + t * 0.02;
        g = 0.22 + t * 0.58;
        b = 0.42 + t * 0.48;
      } else {
        const t = (normDepth - 0.45) / 0.55;
        r = 0.06 + t * 0.92;
        g = 0.8 + t * -0.12;
        b = 0.9 - t * 0.78;
      }

      colorAttr.setXYZ(i, r * edgeFade, g * edgeFade, b * edgeFade);
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  };

  return { group, updateWells };
}

/**
 * Creates a localized 3D gravitational well funnel around a planetary globe (Moon or Mars).
 */
export function createLocalPlanetaryWellMesh(
  globeRadius: number,
  colorHex: string,
  depthScale = 1.0
): THREE.Group {
  const group = new THREE.Group();
  const rings = 28;
  const segments = 64;
  const innerR = globeRadius * 1.08;
  const outerR = globeRadius * 3.1;

  const positions: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const baseColor = new THREE.Color(colorHex);
  const cyanColor = new THREE.Color('#06b6d4');

  for (let r = 0; r <= rings; r++) {
    const u = r / rings;
    const rad = THREE.MathUtils.lerp(innerR, outerR, u);
    const wellDrop = -((1 - Math.pow(u, 0.55)) * 4.2 * depthScale) - 0.4;
    const c = baseColor.clone().lerp(cyanColor, u);
    const alphaFade = 1 - Math.pow(u, 2.2);

    for (let s = 0; s <= segments; s++) {
      const theta = (s / segments) * Math.PI * 2;
      positions.push(Math.cos(theta) * rad, wellDrop, Math.sin(theta) * rad);
      colors.push(c.r * alphaFade, c.g * alphaFade, c.b * alphaFade);
    }
  }

  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < segments; s++) {
      const a = r * (segments + 1) + s;
      const b = a + segments + 1;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);

  const wireMesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  group.add(wireMesh);
  return group;
}

/**
 * Animated Spacecraft Rig interface attached to `group.userData.animRig`
 * for hyper-detailed 6-Chapter Storyline choreography and kinematic articulation.
 */
export interface SpacecraftAnimationRig {
  thrusterPlumeGroup: THREE.Group;
  machPlumeMaterial: THREE.ShaderMaterial;
  entryPlasmaDome: THREE.Mesh;
  entryPlasmaMaterial: THREE.ShaderMaterial;
  detachableHeatshield: THREE.Group;
  parachuteGroup: THREE.Group;
  skyCraneGroup: THREE.Group;
  rcsPlumesGroup: THREE.Group;
  dustWaveRing: THREE.Mesh;
  dustParticleSystem: THREE.Points;
  lidarScanRing: THREE.Mesh;
  instrumentBeamGroup: THREE.Group;
  telemetryWavesGroup: THREE.Group;
  reconOrbiterGroup: THREE.Group;
  satSolarWingL?: THREE.Object3D;
  satSolarWingR?: THREE.Object3D;
  satDishGroup?: THREE.Object3D;
  ingenuityGroup: THREE.Group;
  ingenuityRotorA: THREE.Object3D;
  ingenuityRotorB: THREE.Object3D;
  dishGroup?: THREE.Object3D;
  mastGroup?: THREE.Object3D;
  armGroup?: THREE.Object3D;
  armForearmGroup?: THREE.Object3D;
  armTurretGroup?: THREE.Object3D;
  solarWingL?: THREE.Object3D;
  solarWingR?: THREE.Object3D;
  ascentGroup?: THREE.Object3D;
  deployedPackage?: THREE.Object3D;
  wheels: THREE.Object3D[];
  rockerBogieGroups: THREE.Object3D[];
}

/**
 * Builds a high-polygon parabolic high-gain dish antenna with radial graphite-epoxy
 * structural ribs, concentric RF mesh rings, 3-strut feed tripod, and sub-reflector.
 */
function createHighPolyParabolicDish(
  radius: number,
  depth: number,
  ribCount: number,
  dishMat: THREE.Material,
  strutMat: THREE.Material,
  feedMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();

  // Smooth 18-point parabolic Lathe profile (48 radial segments = 1,728 triangles)
  const pts: THREE.Vector2[] = [];
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = t * radius;
    const y = t * t * depth;
    pts.push(new THREE.Vector2(r, y));
  }
  const dishGeo = new THREE.LatheGeometry(pts, 48);
  const dishMesh = new THREE.Mesh(dishGeo, dishMat);
  dishMesh.castShadow = true;
  dishMesh.receiveShadow = true;
  group.add(dishMesh);

  // Outer stiffening rim torus (48 radial segments)
  const rimMesh = new THREE.Mesh(
    new THREE.TorusGeometry(radius, radius * 0.025, 14, 48),
    strutMat
  );
  rimMesh.rotation.x = Math.PI / 2;
  rimMesh.position.y = depth;
  group.add(rimMesh);

  // Radial structural truss ribs on dish backface
  for (let r = 0; r < ribCount; r++) {
    const a = (r / ribCount) * Math.PI * 2;
    const ribCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, -0.01, 0),
      new THREE.Vector3(Math.cos(a) * radius * 0.55, depth * 0.22, Math.sin(a) * radius * 0.55),
      new THREE.Vector3(Math.cos(a) * radius, depth, Math.sin(a) * radius)
    );
    const ribMesh = new THREE.Mesh(
      new THREE.TubeGeometry(ribCurve, 12, radius * 0.016, 8, false),
      strutMat
    );
    group.add(ribMesh);
  }

  // Central waveguide horn + 3-strut subreflector tripod
  const focalY = depth * 1.65 + radius * 0.28;
  const hornMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.05, radius * 0.11, depth * 0.9, 24),
    strutMat
  );
  hornMesh.position.y = depth * 0.45;
  group.add(hornMesh);

  const subReflector = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.14, radius * 0.06, radius * 0.09, 28),
    feedMat
  );
  subReflector.position.y = focalY;
  group.add(subReflector);

  for (let s = 0; s < 3; s++) {
    const sa = (s / 3) * Math.PI * 2;
    const strutCurve = new THREE.LineCurve3(
      new THREE.Vector3(Math.cos(sa) * radius * 0.68, depth * 0.46, Math.sin(sa) * radius * 0.68),
      new THREE.Vector3(0, focalY, 0)
    );
    group.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(strutCurve, 8, radius * 0.015, 8, false),
        strutMat
      )
    );
  }

  return group;
}

/**
 * Builds a high-polygon de Laval rocket engine nozzle with regenerative cooling channels,
 * horizontal stiffening manifolds, and glowing combustion throat.
 */
function createHighPolyRocketNozzle(
  throatRadius: number,
  exitRadius: number,
  height: number,
  nozzleMat: THREE.Material,
  manifoldMat: THREE.Material
): THREE.Group {
  const group = new THREE.Group();

  const pts: THREE.Vector2[] = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Bell-shaped expansion contour
    const r = throatRadius + (exitRadius - throatRadius) * Math.pow(t, 0.72);
    const y = (1 - t) * height;
    pts.push(new THREE.Vector2(r, y));
  }
  const bellGeo = new THREE.LatheGeometry(pts, 48);
  const bellMesh = new THREE.Mesh(bellGeo, nozzleMat);
  bellMesh.castShadow = true;
  group.add(bellMesh);

  // 5 horizontal stiffening manifold rings around the nozzle exterior
  for (let m = 1; m <= 5; m++) {
    const mt = m / 6;
    const mr = throatRadius + (exitRadius - throatRadius) * Math.pow(mt, 0.72);
    const my = (1 - mt) * height;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(mr * 1.015, exitRadius * 0.03, 12, 40),
      manifoldMat
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = my;
    group.add(ring);
  }

  // Glowing inner injector plate
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    side: THREE.DoubleSide,
  });
  const injectorDisc = new THREE.Mesh(
    new THREE.CircleGeometry(throatRadius * 0.92, 24),
    glowMat
  );
  injectorDisc.rotation.x = Math.PI / 2;
  injectorDisc.position.y = height * 0.92;
  group.add(injectorDisc);

  return group;
}

/**
 * Builds a high-polygon CNC-machined Rover Wheel with 24 individual 3D chevron grouser cleats,
 * curved titanium flex-spokes, internal hub motor barrel, and anodized rim flanges.
 */
function createHighPolyCleatedRoverWheel(
  radius: number,
  width: number,
  tireMat: THREE.Material,
  spokeMat: THREE.Material,
  hubMat: THREE.Material
): THREE.Group {
  const wheelGroup = new THREE.Group();

  // Outer hollow tire cylinder (36 radial segments)
  const rimOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, width, 36, 2, true),
    tireMat
  );
  rimOuter.rotation.z = Math.PI / 2;
  rimOuter.castShadow = true;
  wheelGroup.add(rimOuter);

  // Front and back rim flanges
  for (const side of [-1, 1]) {
    const flange = new THREE.Mesh(
      new THREE.RingGeometry(radius * 0.76, radius * 1.01, 36),
      tireMat
    );
    flange.rotation.y = Math.PI / 2;
    flange.position.x = side * (width * 0.49);
    wheelGroup.add(flange);
  }

  // 24 individual 3D machined grouser cleats around the tire perimeter
  const cleatCount = 24;
  const cleatGeo = new THREE.BoxGeometry(width * 0.94, radius * 0.065, radius * 0.075);
  for (let c = 0; c < cleatCount; c++) {
    const a = (c / cleatCount) * Math.PI * 2;
    const cleat = new THREE.Mesh(cleatGeo, spokeMat);
    cleat.position.set(0, Math.cos(a) * (radius * 1.01), Math.sin(a) * (radius * 1.01));
    cleat.rotation.x = -a;
    // Slight chevron twist alternating
    cleat.rotation.y = c % 2 === 0 ? 0.14 : -0.14;
    wheelGroup.add(cleat);
  }

  // 6 curved titanium flex-spokes connecting hub to outer rim
  const spokeCount = 6;
  for (let s = 0; s < spokeCount; s++) {
    const sa = (s / spokeCount) * Math.PI * 2;
    const spokeCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, Math.cos(sa) * radius * 0.32, Math.sin(sa) * radius * 0.32),
      new THREE.Vector3(
        width * 0.12,
        Math.cos(sa + 0.38) * radius * 0.56,
        Math.sin(sa + 0.38) * radius * 0.56
      ),
      new THREE.Vector3(0, Math.cos(sa) * radius * 0.86, Math.sin(sa) * radius * 0.86)
    );
    const spokeMesh = new THREE.Mesh(
      new THREE.TubeGeometry(spokeCurve, 10, radius * 0.042, 8, false),
      spokeMat
    );
    wheelGroup.add(spokeMesh);
  }

  // Planetary gear hub motor housing
  const hubCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.36, radius * 0.36, width * 0.92, 24),
    hubMat
  );
  hubCyl.rotation.z = Math.PI / 2;
  wheelGroup.add(hubCyl);

  return wheelGroup;
}

/**
 * Builds an ultra-hyper-detailed polygon Orbiting Reconnaissance Satellite (LRO / MRO / Relay Orbiter)
 * featuring an 8-bay isogrid composite bus, 48-blade thermal radiator louvers, 4 spherical titanium
 * propellant tanks, 4 orbital insertion engines, 16 RCS attitude thrusters, dual star-tracker optical baffles,
 * a 16-strut Serrurier-truss Cassegrain telescope (LROC NAC / HiRISE), SHARAD subsurface radar booms,
 * dual articulated 4-panel solar wings with rear structural trusses, and a 2-axis gimbaled high-gain parabolic dish.
 */
export function buildHighPolyReconSatellite(
  kaptonMat: THREE.Material,
  solarMat: THREE.Material,
  hullMat: THREE.Material,
  alloyMat: THREE.Material,
  lensMat: THREE.Material
): {
  group: THREE.Group;
  solarWingL: THREE.Group;
  solarWingR: THREE.Group;
  dishGroup: THREE.Group;
  swathCone: THREE.Mesh;
} {
  const group = new THREE.Group();
  const darkAnodizedMat = getAerospaceHullMaterial('sat_dark_carbon', '#1e293b', 0.72, 0.38);

  // 1. Multi-Bay Octagonal Isogrid Composite Bus + 3 Machined Titanium Adapter Rings
  const busGeo = new THREE.CylinderGeometry(0.34, 0.36, 0.68, 8, 4);
  const busMesh = new THREE.Mesh(busGeo, kaptonMat);
  busMesh.castShadow = true;
  busMesh.receiveShadow = true;
  group.add(busMesh);

  for (const yRing of [-0.33, 0.0, 0.33]) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.365, 0.022, 20, 48),
      alloyMat
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = yRing;
    group.add(ring);
  }

  // 8 Recessed Avionics Bays with 48 Individual 3D Thermal Louver Blades & Corner RCS Quads (16 Nozzles)
  for (let face = 0; face < 8; face++) {
    const fa = (face / 8) * Math.PI * 2 + Math.PI / 8;
    const fx = Math.cos(fa) * 0.345;
    const fz = Math.sin(fa) * 0.345;

    const bayFrame = new THREE.Group();
    bayFrame.position.set(fx, 0, fz);
    bayFrame.rotation.y = -fa + Math.PI / 2;

    if (face % 2 === 0) {
      // Micrometeoroid radiator louver housing with 12 individual angled louver blades per bay
      const housing = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.48, 0.025),
        darkAnodizedMat
      );
      bayFrame.add(housing);
      for (let lb = 0; lb < 10; lb++) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.19, 0.012, 0.032),
          alloyMat
        );
        blade.position.set(0, -0.18 + lb * 0.04, 0.012);
        blade.rotation.x = 0.42;
        bayFrame.add(blade);
      }
    } else {
      // Avionics harness conduit & star-tracker electronics box
      const avionicsBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.38, 0.045),
        hullMat
      );
      bayFrame.add(avionicsBox);
    }
    group.add(bayFrame);

    // 4 Corner Attitude Control RCS Thruster Pods (16 individual hypergolic micro-nozzles)
    if (face % 2 === 0) {
      const rcsPod = new THREE.Group();
      rcsPod.position.set(Math.cos(fa) * 0.39, 0.28, Math.sin(fa) * 0.39);
      rcsPod.rotation.y = -fa;
      const manifold = new THREE.Mesh(
        new THREE.SphereGeometry(0.032, 16, 12),
        alloyMat
      );
      rcsPod.add(manifold);
      const dirs = [
        new THREE.Euler(0, 0, -Math.PI / 2),
        new THREE.Euler(Math.PI / 2, 0, 0),
        new THREE.Euler(-Math.PI / 2, 0, 0),
        new THREE.Euler(0, 0, Math.PI / 4),
      ];
      for (const d of dirs) {
        const noz = new THREE.Mesh(
          new THREE.ConeGeometry(0.014, 0.048, 14, 1, true),
          darkAnodizedMat
        );
        noz.rotation.copy(d);
        noz.translateY(-0.028);
        rcsPod.add(noz);
      }
      group.add(rcsPod);
    }
  }

  // 2. Dual Flared Star-Tracker Optical Baffles (32-segment LatheGeometry sun-shades)
  const bafflePts = [
    new THREE.Vector2(0.025, 0),
    new THREE.Vector2(0.032, 0.06),
    new THREE.Vector2(0.068, 0.16),
    new THREE.Vector2(0.072, 0.17),
  ];
  const starBaffleGeo = new THREE.LatheGeometry(bafflePts, 32);
  for (const side of [-1, 1]) {
    const trackerGroup = new THREE.Group();
    trackerGroup.position.set(side * 0.26, 0.18, 0.28);
    trackerGroup.rotation.set(-0.45, 0, side * -0.55);
    const shade = new THREE.Mesh(starBaffleGeo, darkAnodizedMat);
    trackerGroup.add(shade);
    const lens = new THREE.Mesh(
      new THREE.SphereGeometry(0.026, 20, 16),
      lensMat
    );
    lens.position.y = 0.04;
    trackerGroup.add(lens);
    group.add(trackerGroup);
  }

  // 3. Aft Bi-Propellant Propulsion Module: 4 Spherical Titanium Tanks + 4 Orbital Insertion Engines
  for (let tk = 0; tk < 4; tk++) {
    const ta = (tk / 4) * Math.PI * 2 + Math.PI / 4;
    const tank = new THREE.Mesh(
      new THREE.SphereGeometry(0.115, 32, 24),
      tk % 2 === 0 ? kaptonMat : alloyMat
    );
    tank.position.set(Math.cos(ta) * 0.24, 0.02, Math.sin(ta) * 0.24);
    group.add(tank);

    const engine = createHighPolyRocketNozzle(
      0.022,
      0.058,
      0.14,
      darkAnodizedMat,
      alloyMat
    );
    engine.position.set(Math.cos(ta) * 0.22, 0.34, Math.sin(ta) * 0.22);
    engine.rotation.x = Math.PI; // Facing +Y (retro-propulsion / orbital trim)
    group.add(engine);
  }

  // 4. Ultra-High-Polygon Nadir Cassegrain Reconnaissance Telescope (LROC NAC / MRO HiRISE 0.5m)
  const scopeGroup = new THREE.Group();
  scopeGroup.position.set(0, -0.36, 0);

  // Contoured carbon-fiber optical barrel + 7 external stiffening baffle rings
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.23, 0.52, 48, 4, true),
    darkAnodizedMat
  );
  scopeGroup.add(barrel);

  for (let br = 0; br < 7; br++) {
    const bRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.218, 0.012, 16, 48),
      alloyMat
    );
    bRing.rotation.x = Math.PI / 2;
    bRing.position.y = -0.23 + br * 0.076;
    scopeGroup.add(bRing);
  }

  // Primary Cassegrain Mirror + 4-Vane Spider + Secondary Mirror Cell
  const primaryMirror = new THREE.Mesh(
    new THREE.CylinderGeometry(0.185, 0.185, 0.04, 40),
    lensMat
  );
  primaryMirror.position.y = 0.14;
  scopeGroup.add(primaryMirror);

  const secondaryCell = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.055, 0.05, 24),
    alloyMat
  );
  secondaryCell.position.y = -0.18;
  scopeGroup.add(secondaryCell);

  for (let v = 0; v < 4; v++) {
    const vane = new THREE.Mesh(
      new THREE.BoxGeometry(0.39, 0.012, 0.006),
      alloyMat
    );
    vane.position.y = -0.18;
    vane.rotation.y = (v * Math.PI) / 4;
    scopeGroup.add(vane);
  }

  // 16-Strut Double-Ring Serrurier Optical Truss Cage around the Telescope
  for (let t = 0; t < 16; t++) {
    const ta = (t / 16) * Math.PI * 2;
    const nextTa = ((t + (t % 2 === 0 ? 1 : -1)) / 16) * Math.PI * 2;
    const pStart = new THREE.Vector3(
      Math.cos(ta) * 0.245,
      -0.24,
      Math.sin(ta) * 0.245
    );
    const pEnd = new THREE.Vector3(
      Math.cos(nextTa) * 0.245,
      0.24,
      Math.sin(nextTa) * 0.245
    );
    const strutCurve = new THREE.LineCurve3(pStart, pEnd);
    scopeGroup.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(strutCurve, 4, 0.008, 8, false),
        alloyMat
      )
    );
  }

  // Nadir LOLA / MOLA 5-Beam Laser Altimeter Emitter Pod & Diviner Thermal Radiometer
  const altimeterPod = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.14, 0.16),
    hullMat
  );
  altimeterPod.position.set(0.28, -0.08, 0.12);
  scopeGroup.add(altimeterPod);
  for (let l = 0; l < 5; l++) {
    const la = (l / 5) * Math.PI * 2;
    const emitter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.04, 16),
      lensMat
    );
    emitter.position.set(
      0.28 + Math.cos(la) * 0.04,
      -0.16,
      0.12 + Math.sin(la) * 0.04
    );
    scopeGroup.add(emitter);
  }

  group.add(scopeGroup);

  // 5. Dual Articulated 4-Panel Photovoltaic Solar Array Wings with 24 Rear Truss Ribs & Harmonic Gimbal Drive
  const buildSolarWing = (dir: 1 | -1): THREE.Group => {
    const wingGroup = new THREE.Group();
    wingGroup.position.set(dir * 0.36, 0.04, 0);

    // Motorized harmonic-drive root actuator cylinder
    const driveMotor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.14, 24),
      darkAnodizedMat
    );
    driveMotor.rotation.z = Math.PI / 2;
    wingGroup.add(driveMotor);

    // Triangular deployment yoke truss
    for (const zOff of [-0.14, 0, 0.14]) {
      const yokeCurve = new THREE.LineCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(dir * 0.26, 0, zOff)
      );
      wingGroup.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(yokeCurve, 6, 0.014, 10, false),
          alloyMat
        )
      );
    }

    // 4 hinged solar panels per wing with machined frames, hinges, and diagonal stiffening ribs
    const panelW = 0.38;
    const panelD = 0.54;
    for (let p = 0; p < 4; p++) {
      const px = dir * (0.46 + p * (panelW + 0.032));
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(panelW, 0.018, panelD),
        darkAnodizedMat
      );
      frame.position.set(px, 0, 0);
      frame.castShadow = true;
      wingGroup.add(frame);

      const cellFace = new THREE.Mesh(
        new THREE.BoxGeometry(panelW * 0.94, 0.022, panelD * 0.94),
        solarMat
      );
      cellFace.position.set(px, 0, 0);
      wingGroup.add(cellFace);

      // Rear structural cross-bracing ribs & inter-panel rotary hinges
      for (const rZ of [-0.18, 0, 0.18]) {
        const rib = new THREE.Mesh(
          new THREE.BoxGeometry(panelW * 0.96, 0.026, 0.016),
          alloyMat
        );
        rib.position.set(px, -0.008, rZ);
        wingGroup.add(rib);
      }

      if (p > 0) {
        const hingeX = px - dir * (panelW * 0.5 + 0.016);
        for (const hZ of [-0.18, 0.18]) {
          const hinge = new THREE.Mesh(
            new THREE.CylinderGeometry(0.014, 0.014, 0.06, 12),
            alloyMat
          );
          hinge.rotation.x = Math.PI / 2;
          hinge.position.set(hingeX, 0, hZ);
          wingGroup.add(hinge);
        }
      }
    }

    return wingGroup;
  };

  const solarWingL = buildSolarWing(-1);
  const solarWingR = buildSolarWing(1);
  group.add(solarWingL);
  group.add(solarWingR);

  // 6. SHARAD / LEND Subsurface Radar Dipole Antenna Booms
  for (const bDir of [-1, 1]) {
    const boomCurve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0.12, bDir * 0.34),
      new THREE.Vector3(0, 0.24, bDir * 1.45)
    );
    group.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(boomCurve, 8, 0.01, 10, false),
        alloyMat
      )
    );
    const tipSensor = new THREE.Mesh(
      new THREE.SphereGeometry(0.028, 16, 12),
      lensMat
    );
    tipSensor.position.set(0, 0.24, bDir * 1.45);
    group.add(tipSensor);
  }

  // 7. Dorsal 2-Axis Gimbaled 18-Ribbed High-Gain Parabolic Dish Antenna
  const dishGroup = new THREE.Group();
  dishGroup.position.set(0, 0.44, -0.12);
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.04, 0.28, 24),
    alloyMat
  );
  dishGroup.add(mast);

  const gimbalYoke = new THREE.Mesh(
    new THREE.TorusGeometry(0.065, 0.014, 16, 32, Math.PI),
    darkAnodizedMat
  );
  gimbalYoke.position.y = 0.14;
  dishGroup.add(gimbalYoke);

  const hgaDish = createHighPolyParabolicDish(
    0.52,
    0.18,
    18,
    hullMat,
    alloyMat,
    lensMat
  );
  hgaDish.position.y = 0.18;
  hgaDish.rotation.x = -0.45;
  dishGroup.add(hgaDish);
  group.add(dishGroup);

  // 8. Volumetric Nadir Optical Reconnaissance Swath Pyramid
  const swathGeo = new THREE.ConeGeometry(2.1, 4.1, 4, 1, true);
  swathGeo.translate(0, -2.05, 0);
  swathGeo.rotateY(Math.PI / 4);
  const swathMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.16,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const swathCone = new THREE.Mesh(swathGeo, swathMat);
  swathCone.position.y = -0.38;
  group.add(swathCone);

  return { group, solarWingL, solarWingR, dishGroup, swathCone };
}

/**
 * Builds a hyper-detailed composite 3D spacecraft model (`THREE.Group`)
 * with high-polygon aerospace CAD sub-assemblies, procedural PBR Kapton/Solar/Hull textures,
 * custom GLSL Mach-diamond plumes, hypersonic entry bow-shock plasma shield,
 * supersonic Disk-Gap-Band parachute, Sky-Crane bridle stage, and Reconnaissance Orbiter.
 */
export function createCompositeSpacecraftGroup(
  modelType: 'lander' | 'rover' | 'probe' | 'impactor',
  primaryColorHex: string,
  accentColorHex: string,
  scale = 1.0
): THREE.Group {
  const root = new THREE.Group();
  root.scale.setScalar(scale);

  const explodableParts: {
    obj: THREE.Object3D;
    basePos: THREE.Vector3;
    explodeDir: THREE.Vector3;
    partName: string;
  }[] = [];

  const registerPart = (
    obj: THREE.Object3D,
    explodeDir: THREE.Vector3,
    partName: string
  ) => {
    obj.userData.partName = partName;
    explodableParts.push({
      obj,
      basePos: obj.position.clone(),
      explodeDir,
      partName,
    });
    root.add(obj);
  };

  // Soft radial contact shadow disc at y = 0.015
  const shadowGeo = new THREE.CircleGeometry(2.1, 40);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
  shadowDisc.position.y = 0.015;
  root.add(shadowDisc);

  // Authentic Procedural Aerospace PBR Materials (Tuned for rich contrast & zero bloom washout)
  const goldKaptonMat = getGoldKaptonMaterial();
  const solarArrayMat = getSolarArrayMaterial();
  const matteThermalMat = getAerospaceHullMaterial('white_thermal', '#94a3b8', 0.24, 0.68);
  const brushedAlloyMat = getAerospaceHullMaterial('titanium_alloy', '#7c8ca1', 0.78, 0.28);
  const darkTitaniumMat = getAerospaceHullMaterial('anodized_dark', '#1e293b', 0.72, 0.44);
  const ablativeTpsMat = getAblativeHeatshieldMaterial();

  const opticalLensMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(accentColorHex),
    emissive: new THREE.Color(accentColorHex).multiplyScalar(0.24),
    metalness: 0.15,
    roughness: 0.08,
    clearcoat: 1.0,
    envMapIntensity: 0.35,
  });

  const wheels: THREE.Object3D[] = [];
  const rockerBogieGroups: THREE.Object3D[] = [];
  let refDishGroup: THREE.Object3D | undefined;
  let refMastGroup: THREE.Object3D | undefined;
  let refArmGroup: THREE.Object3D | undefined;
  let refArmForearmGroup: THREE.Object3D | undefined;
  let refArmTurretGroup: THREE.Object3D | undefined;
  let refSolarWingL: THREE.Object3D | undefined;
  let refSolarWingR: THREE.Object3D | undefined;
  let refAscentGroup: THREE.Object3D | undefined;
  let refDeployedPkg: THREE.Object3D | undefined;

  if (modelType === 'lander') {
    // --- HIGH-POLYGON APOLLO LUNAR MODULE ("EAGLE") / SURVEYOR LANDER CAD ASSEMBLY ---
    const descentGroup = new THREE.Group();
    const octShape = new THREE.Shape();
    const octRadius = 0.88;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const x = Math.cos(angle) * octRadius;
      const y = Math.sin(angle) * octRadius;
      if (i === 0) octShape.moveTo(x, y);
      else octShape.lineTo(x, y);
    }
    octShape.closePath();

    const hullGeo = new THREE.ExtrudeGeometry(octShape, {
      depth: 0.58,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.045,
      bevelSegments: 5,
    });
    hullGeo.rotateX(-Math.PI / 2);
    const hullMesh = new THREE.Mesh(hullGeo, goldKaptonMat);
    hullMesh.position.set(0, 0.42, 0);
    hullMesh.castShadow = true;
    hullMesh.receiveShadow = true;
    descentGroup.add(hullMesh);

    // 4 Anodized black thermal & micrometeoroid bay panels on alternate octagon faces
    for (let b = 0; b < 4; b++) {
      const ba = (b * Math.PI) / 2;
      const bayPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.56, 0.44, 0.04),
        darkTitaniumMat
      );
      bayPanel.position.set(Math.cos(ba) * 0.83, 0.71, Math.sin(ba) * 0.83);
      bayPanel.rotation.y = -ba + Math.PI / 2;
      descentGroup.add(bayPanel);
    }

    // Outrigger truss mounting brackets on the 4 main axes
    for (let o = 0; o < 4; o++) {
      const oa = (o * Math.PI) / 2 + Math.PI / 4;
      const outrigger = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.18, 0.34),
        brushedAlloyMat
      );
      outrigger.position.set(Math.cos(oa) * 0.88, 0.68, Math.sin(oa) * 0.88);
      outrigger.rotation.y = -oa + Math.PI / 2;
      descentGroup.add(outrigger);
    }

    registerPart(
      descentGroup,
      new THREE.Vector3(0, 0, 0),
      'Octagonal Kapton-MLI Descent Stage & Propellant Bays'
    );

    // Multi-Faceted Pressurized Ascent Stage with Recessed Windows, Docking Tunnel & 16-Nozzle RCS Quads
    const ascentGroup = new THREE.Group();
    ascentGroup.position.set(0, 1.14, 0);

    // Main pressurized cylindrical crew compartment (32 segments) + aft avionics bay
    const midSection = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.68, 0.56, 32),
      matteThermalMat
    );
    midSection.castShadow = true;
    ascentGroup.add(midSection);

    const aftBay = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.48, 0.58),
      goldKaptonMat
    );
    aftBay.position.set(0, -0.02, -0.36);
    ascentGroup.add(aftBay);

    // Forward face with recessed triangular Commander & Lunar Module Pilot windows
    const frontFace = new THREE.Mesh(
      new THREE.BoxGeometry(0.84, 0.5, 0.36),
      matteThermalMat
    );
    frontFace.position.set(0, 0.0, 0.34);
    ascentGroup.add(frontFace);

    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x020617,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.22,
      metalness: 0.9,
      roughness: 0.05,
      clearcoat: 1.0,
    });
    for (const winSide of [-1, 1]) {
      const winFrame = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.18, 0.05),
        windowGlassMat
      );
      winFrame.position.set(winSide * 0.23, 0.1, 0.51);
      winFrame.rotation.z = winSide * -0.18;
      winFrame.rotation.x = 0.15;
      ascentGroup.add(winFrame);
    }

    // Forward EVA Ingress/Egress Square Hatch + Top Docking Tunnel with Drogue Ring
    const evaHatch = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.28, 0.06),
      darkTitaniumMat
    );
    evaHatch.position.set(0, -0.12, 0.51);
    ascentGroup.add(evaHatch);

    const topDockTunnel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.28, 0.22, 32),
      brushedAlloyMat
    );
    topDockTunnel.position.set(0, 0.34, 0.05);
    ascentGroup.add(topDockTunnel);

    const drogueRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.25, 0.025, 16, 32),
      darkTitaniumMat
    );
    drogueRing.rotation.x = Math.PI / 2;
    drogueRing.position.set(0, 0.45, 0.05);
    ascentGroup.add(drogueRing);

    // 4x R-4D RCS Attitude Thruster Quads (16 individual hypergolic bell nozzles!)
    const nozzleGeo = new THREE.ConeGeometry(0.032, 0.095, 16, 1, true);
    for (let q = 0; q < 4; q++) {
      const qa = (q * Math.PI) / 2 + Math.PI / 4;
      const podGroup = new THREE.Group();
      podGroup.position.set(Math.cos(qa) * 0.68, 0.08, Math.sin(qa) * 0.68);
      podGroup.rotation.y = -qa;

      const podHousing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.065, 0.18, 16),
        brushedAlloyMat
      );
      podGroup.add(podHousing);

      // 4 orthogonal thruster bells per pod
      const dirs: [number, number, number, number, number, number][] = [
        [0, 0.12, 0, 0, 0, 0],
        [0, -0.12, 0, Math.PI, 0, 0],
        [0.11, 0, 0, 0, 0, -Math.PI / 2],
        [0, 0, 0.11, Math.PI / 2, 0, 0],
      ];
      for (const [nx, ny, nz, rx, ry, rz] of dirs) {
        const nMesh = new THREE.Mesh(nozzleGeo, darkTitaniumMat);
        nMesh.position.set(nx, ny, nz);
        nMesh.rotation.set(rx, ry, rz);
        podGroup.add(nMesh);
      }
      ascentGroup.add(podGroup);
    }

    registerPart(
      ascentGroup,
      new THREE.Vector3(0, 0.95, 0),
      'Pressurized Ascent Stage & 16-Nozzle R-4D RCS Quads'
    );
    refAscentGroup = ascentGroup;

    // High-Polygon Gimbaled DPS Descent Engine Bell Nozzle
    const dpsNozzle = createHighPolyRocketNozzle(
      0.11,
      0.38,
      0.44,
      darkTitaniumMat,
      brushedAlloyMat
    );
    dpsNozzle.position.set(0, 0.04, 0);
    registerPart(
      dpsNozzle,
      new THREE.Vector3(0, -0.48, 0),
      'TRW Descent Propulsion System (DPS) Bell Nozzle'
    );

    // Four High-Polygon Cantilevered Landing Gear Struts, Honeycomb Oleo Cylinders, Dished Footpads & Lunar Contact Probes
    const padPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.24, 0.012),
      new THREE.Vector2(0.29, 0.055),
      new THREE.Vector2(0.21, 0.068),
      new THREE.Vector2(0.0, 0.068),
    ];
    const footpadGeo = new THREE.LatheGeometry(padPoints, 36);

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const legGroup = new THREE.Group();
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const padMesh = new THREE.Mesh(footpadGeo, goldKaptonMat);
      padMesh.position.set(cos * 1.42, 0, sin * 1.42);
      legGroup.add(padMesh);

      // Lunar surface contact sensing probe extending below footpads #2, #3, #4
      if (i > 0) {
        const probe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.008, 0.008, 0.28, 8),
          brushedAlloyMat
        );
        probe.position.set(cos * 1.48, -0.04, sin * 1.48);
        probe.rotation.z = 0.45;
        legGroup.add(probe);
      }

      // Primary telescoping shock-absorber oleo strut (upper Kapton sleeve + lower chromed piston)
      const primaryCurve = new THREE.LineCurve3(
        new THREE.Vector3(cos * 0.84, 0.92, sin * 0.84),
        new THREE.Vector3(cos * 1.42, 0.05, sin * 1.42)
      );
      legGroup.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(primaryCurve, 12, 0.042, 16, false),
          goldKaptonMat
        )
      );

      // Dual A-frame secondary drag struts
      for (const sideAngle of [-0.22, 0.22]) {
        const dragCurve = new THREE.LineCurve3(
          new THREE.Vector3(
            Math.cos(angle + sideAngle) * 0.84,
            0.48,
            Math.sin(angle + sideAngle) * 0.84
          ),
          new THREE.Vector3(cos * 1.24, 0.28, sin * 1.24)
        );
        legGroup.add(
          new THREE.Mesh(
            new THREE.TubeGeometry(dragCurve, 8, 0.022, 12, false),
            brushedAlloyMat
          )
        );
      }

      registerPart(
        legGroup,
        new THREE.Vector3(cos * 0.7, -0.1, sin * 0.7),
        `Cantilevered Oleo Landing Gear #${i + 1}`
      );
    }

    // High-Polygon Ribbed Parabolic S-Band Steerable Dish Antenna
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0.36, 1.62, 0.2);
    const sBandDish = createHighPolyParabolicDish(
      0.34,
      0.12,
      12,
      brushedAlloyMat,
      darkTitaniumMat,
      opticalLensMat
    );
    sBandDish.rotation.x = Math.PI / 2.6;
    dishGroup.add(sBandDish);
    registerPart(
      dishGroup,
      new THREE.Vector3(0.48, 0.8, 0.3),
      'S-Band Steerable Parabolic Ribbed Antenna'
    );
    refDishGroup = dishGroup;

    // 9-Rung Egress Ladder + Deployed EASEP (100-Cube LRRR Array + Passive Seismometer + Planted US Flag)
    const ladderGroup = new THREE.Group();
    for (const railX of [-0.09, 0.09]) {
      const rail = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.92, 12),
        brushedAlloyMat
      );
      rail.position.set(railX, 0.48, 1.08);
      rail.rotation.x = -0.38;
      ladderGroup.add(rail);
    }
    for (let r = 0; r < 9; r++) {
      const t = r / 8;
      const rung = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.18, 10),
        brushedAlloyMat
      );
      rung.rotation.z = Math.PI / 2;
      rung.position.set(0, 0.14 + t * 0.68, 1.21 - t * 0.26);
      ladderGroup.add(rung);
    }

    // Deployed Surface Science Package (LRRR + PSEP + Planted Flag)
    const pkgGroup = new THREE.Group();
    pkgGroup.position.set(0.92, 0.06, 1.02);

    // LRRR 100-Corner-Cube Fused Silica Array with open tilted pallet
    const lrrrBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.12, 0.28),
      brushedAlloyMat
    );
    pkgGroup.add(lrrrBase);
    const prismGrid = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.04, 0.22),
      opticalLensMat
    );
    prismGrid.position.set(0, 0.09, 0.02);
    prismGrid.rotation.x = 0.42;
    pkgGroup.add(prismGrid);

    // PSEP Seismometer with Gold Kapton Thermal Skirt & Solar Panels
    const pseSkirt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.28, 0.06, 24),
      goldKaptonMat
    );
    pseSkirt.position.set(-0.48, -0.02, 0.22);
    pkgGroup.add(pseSkirt);
    const pseCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.22, 24),
      goldKaptonMat
    );
    pseCylinder.position.set(-0.48, 0.08, 0.22);
    pkgGroup.add(pseCylinder);

    // Telescopic Flagpole & Rippled Flag
    const flagPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 0.68, 10),
      brushedAlloyMat
    );
    flagPole.position.set(-1.35, 0.28, 0.35);
    pkgGroup.add(flagPole);

    const flagClothGeo = new THREE.PlaneGeometry(0.34, 0.2, 12, 6);
    const fPos = flagClothGeo.attributes.position;
    for (let fi = 0; fi < fPos.count; fi++) {
      fPos.setZ(fi, Math.sin(fPos.getX(fi) * 28) * 0.015);
    }
    flagClothGeo.computeVertexNormals();
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      emissive: new THREE.Color(accentColorHex).multiplyScalar(0.15),
      side: THREE.DoubleSide,
      roughness: 0.6,
    });
    const flagMesh = new THREE.Mesh(flagClothGeo, flagMat);
    flagMesh.position.set(-1.18, 0.51, 0.35);
    pkgGroup.add(flagMesh);

    ladderGroup.add(pkgGroup);
    refDeployedPkg = pkgGroup;
    registerPart(
      ladderGroup,
      new THREE.Vector3(0.35, 0.1, 0.78),
      '9-Rung Egress Ladder, LRRR Prism Array & PSEP Seismometer'
    );
  } else if (modelType === 'rover') {
    // --- HIGH-POLYGON 6-WHEEL ROCKER-BOGIE PLANETARY ROVER CAD ASSEMBLY ---
    const chassisGroup = new THREE.Group();
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-0.56, -0.44);
    chassisShape.lineTo(0.56, -0.44);
    chassisShape.lineTo(0.66, 0.44);
    chassisShape.lineTo(-0.66, 0.44);
    chassisShape.closePath();

    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 4,
    });
    chassisGeo.rotateX(-Math.PI / 2);
    const chassisMesh = new THREE.Mesh(chassisGeo, goldKaptonMat);
    chassisMesh.position.set(0, 0.44, 0);
    chassisMesh.castShadow = true;
    chassisGroup.add(chassisMesh);

    // Front stereo Hazcam bar & laser rangefinder lenses on lower front chassis
    const hazcamBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.09, 0.08),
      darkTitaniumMat
    );
    hazcamBar.position.set(0, 0.56, 0.62);
    chassisGroup.add(hazcamBar);
    for (const hx of [-0.16, -0.06, 0.06, 0.16]) {
      const hLens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.022, 0.05, 16),
        opticalLensMat
      );
      hLens.rotation.x = Math.PI / 2;
      hLens.position.set(hx, 0.56, 0.65);
      chassisGroup.add(hLens);
    }

    registerPart(
      chassisGroup,
      new THREE.Vector3(0, 0, 0),
      'Warm Electronics Box (WEB) & Stereo Hazcam Array'
    );

    // Upper Equipment Deck + Articulated Gull-Wing Solar Arrays
    const deckGroup = new THREE.Group();
    deckGroup.position.set(0, 0.85, 0);

    const centerDeck = new THREE.Mesh(
      new THREE.BoxGeometry(1.12, 0.045, 1.08),
      solarArrayMat
    );
    deckGroup.add(centerDeck);

    // Port & Starboard Deployable Gull-Wing Solar Panels
    const wingL = new THREE.Group();
    wingL.position.set(-0.56, 0.01, 0);
    const wingLPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.032, 0.94),
      solarArrayMat
    );
    wingLPanel.position.set(-0.27, 0, 0);
    wingL.add(wingLPanel);
    deckGroup.add(wingL);
    refSolarWingL = wingL;

    const wingR = new THREE.Group();
    wingR.position.set(0.56, 0.01, 0);
    const wingRPanel = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.032, 0.94),
      solarArrayMat
    );
    wingRPanel.position.set(0.27, 0, 0);
    wingR.add(wingRPanel);
    deckGroup.add(wingR);
    refSolarWingR = wingR;

    registerPart(
      deckGroup,
      new THREE.Vector3(0, 0.58, 0),
      'Articulated Multi-Panel Photovoltaic Deck & Gull-Wings'
    );

    // High-Polygon 6-Wheel Rocker-Bogie Titanium Suspension + 24-Cleat Wheels
    const wheelXOffsets = [-0.78, 0.78];
    const wheelZOffsets = [-0.72, 0.0, 0.72];

    for (const sideX of wheelXOffsets) {
      const suspGroup = new THREE.Group();
      const sideLabel = sideX < 0 ? 'Port' : 'Starboard';

      // Main titanium rocker-bogie tubular linkage + differential pivot
      const bogieCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(sideX, 0.25, -0.72),
        new THREE.Vector3(sideX * 0.88, 0.62, -0.18),
        new THREE.Vector3(sideX, 0.25, 0.0),
        new THREE.Vector3(sideX * 0.88, 0.54, 0.36),
        new THREE.Vector3(sideX, 0.25, 0.72),
      ]);
      const bogieMesh = new THREE.Mesh(
        new THREE.TubeGeometry(bogieCurve, 32, 0.034, 14, false),
        brushedAlloyMat
      );
      suspGroup.add(bogieMesh);

      // Differential pivot housing on chassis side
      const diffPivot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.16, 20),
        goldKaptonMat
      );
      diffPivot.rotation.z = Math.PI / 2;
      diffPivot.position.set(sideX * 0.82, 0.6, -0.15);
      suspGroup.add(diffPivot);

      for (let wIdx = 0; wIdx < wheelZOffsets.length; wIdx++) {
        const zOff = wheelZOffsets[wIdx];
        // Vertical corner steering actuator housing for front & rear wheels
        if (wIdx !== 1) {
          const steerHousing = new THREE.Mesh(
            new THREE.CylinderGeometry(0.042, 0.042, 0.24, 16),
            darkTitaniumMat
          );
          steerHousing.position.set(sideX, 0.42, zOff);
          suspGroup.add(steerHousing);
        }

        const wheelAssembly = createHighPolyCleatedRoverWheel(
          0.25,
          0.2,
          darkTitaniumMat,
          brushedAlloyMat,
          goldKaptonMat
        );
        wheelAssembly.position.set(sideX, 0.25, zOff);
        suspGroup.add(wheelAssembly);
        wheels.push(wheelAssembly);
      }

      rockerBogieGroups.push(suspGroup);
      registerPart(
        suspGroup,
        new THREE.Vector3(sideX > 0 ? 0.72 : -0.72, -0.15, 0),
        `${sideLabel} Rocker-Bogie Titanium Suspension & 24-Cleat Wheels`
      );
    }

    // High-Polygon Remote Sensing Mast (Pancam / Mastcam-Z / SuperCam Laser Head)
    const mastGroup = new THREE.Group();
    mastGroup.position.set(0.24, 0.88, 0.36);

    const mastPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.058, 0.74, 24),
      brushedAlloyMat
    );
    mastPole.position.y = 0.37;
    mastGroup.add(mastPole);

    // Spiral umbilical cable wrapped around the mast pole
    const cablePts: THREE.Vector3[] = [];
    for (let c = 0; c <= 20; c++) {
      const ct = c / 20;
      const ca = ct * Math.PI * 4;
      cablePts.push(
        new THREE.Vector3(Math.cos(ca) * 0.06, ct * 0.68, Math.sin(ca) * 0.06)
      );
    }
    mastGroup.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cablePts), 24, 0.01, 8, false),
        goldKaptonMat
      )
    );

    const camHead = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.2, 0.22),
      matteThermalMat
    );
    camHead.position.y = 0.76;
    mastGroup.add(camHead);

    // SuperCam / ChemCam large central 110mm LIBS laser telescope + stereo Mastcam-Z barrels
    const superCamBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.062, 0.068, 0.14, 24),
      darkTitaniumMat
    );
    superCamBarrel.rotation.x = Math.PI / 2;
    superCamBarrel.position.set(0, 0.79, 0.11);
    mastGroup.add(superCamBarrel);

    const superCamLens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.02, 24),
      opticalLensMat
    );
    superCamLens.rotation.x = Math.PI / 2;
    superCamLens.position.set(0, 0.79, 0.18);
    mastGroup.add(superCamLens);

    for (const eyeX of [-0.14, 0.14]) {
      const stereoLens = new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.036, 0.09, 20),
        opticalLensMat
      );
      stereoLens.rotation.x = Math.PI / 2;
      stereoLens.position.set(eyeX, 0.72, 0.11);
      mastGroup.add(stereoLens);
    }

    registerPart(
      mastGroup,
      new THREE.Vector3(0.24, 0.88, 0.36),
      'Remote Sensing Mast, SuperCam LIBS Laser & Stereo Mastcam'
    );
    refMastGroup = mastGroup;

    // Articulated 5-DOF Robotic Arm + Rotating 4-Instrument Turret (PIXL / SHERLOC / Drill / APXS)
    const armGroup = new THREE.Group();
    armGroup.position.set(0, 0.56, 0.58);

    const shoulderTurret = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.09, 0.14, 20),
      darkTitaniumMat
    );
    armGroup.add(shoulderTurret);

    const upperBoom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.036, 0.036, 0.46, 16),
      brushedAlloyMat
    );
    upperBoom.rotation.x = Math.PI / 2.6;
    upperBoom.position.set(0, 0.08, 0.21);
    armGroup.add(upperBoom);

    const forearmGroup = new THREE.Group();
    forearmGroup.position.set(0, 0.16, 0.42);

    const elbowJoint = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.055, 0.12, 16),
      goldKaptonMat
    );
    elbowJoint.rotation.z = Math.PI / 2;
    forearmGroup.add(elbowJoint);

    const forearmBoom = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.032, 0.44, 16),
      brushedAlloyMat
    );
    forearmBoom.rotation.x = Math.PI / 1.35;
    forearmBoom.position.set(0, -0.18, 0.12);
    forearmGroup.add(forearmBoom);

    // Multi-Instrument Rotating Turret at wrist
    const turretGroup = new THREE.Group();
    turretGroup.position.set(0, -0.38, 0.22);

    const turretHub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.12, 24),
      brushedAlloyMat
    );
    turretGroup.add(turretHub);

    // 4 Radial Scientific Instruments (Rotary Coring Drill, PIXL X-Ray, SHERLOC UV Raman, Microscopic Imager)
    for (let inst = 0; inst < 4; inst++) {
      const ia = (inst * Math.PI) / 2;
      const sensorPod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.042, 0.05, 0.16, 16),
        inst === 0 ? opticalLensMat : darkTitaniumMat
      );
      sensorPod.position.set(Math.cos(ia) * 0.12, -0.04, Math.sin(ia) * 0.12);
      turretGroup.add(sensorPod);
    }
    // Coring drill bit tip
    const drillBit = new THREE.Mesh(
      new THREE.ConeGeometry(0.018, 0.14, 12),
      opticalLensMat
    );
    drillBit.rotation.x = Math.PI;
    drillBit.position.set(0, -0.14, 0);
    turretGroup.add(drillBit);

    forearmGroup.add(turretGroup);
    armGroup.add(forearmGroup);

    refArmGroup = armGroup;
    refArmForearmGroup = forearmGroup;
    refArmTurretGroup = turretGroup;

    registerPart(
      armGroup,
      new THREE.Vector3(0, 0.12, 0.85),
      '5-DOF Robotic Instrument Arm & 4-Sensor Spectrometer Turret'
    );

    // Rear Finned MMRTG Nuclear Radioisotope Thermoelectric Generator + UHF Helical Antenna
    const rtgGroup = new THREE.Group();
    rtgGroup.position.set(0, 0.64, -0.62);
    rtgGroup.rotation.x = -Math.PI / 3.2;

    const rtgCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.14, 0.56, 24),
      matteThermalMat
    );
    rtgGroup.add(rtgCore);

    // 8 Radial Heat-Dissipation Cooling Fins on the MMRTG
    for (let f = 0; f < 8; f++) {
      const fa = (f / 8) * Math.PI * 2;
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.018, 0.52, 0.12),
        matteThermalMat
      );
      fin.position.set(Math.cos(fa) * 0.16, 0, Math.sin(fa) * 0.16);
      fin.rotation.y = -fa;
      rtgGroup.add(fin);
    }

    registerPart(
      rtgGroup,
      new THREE.Vector3(0, 0.38, -0.82),
      '8-Fin MMRTG Radioisotope Generator & X-Band High-Gain Dish'
    );
    refDishGroup = rtgGroup;
  } else {
    // --- HIGH-POLYGON DEEP-SPACE FLAGSHIP PROBE (VOYAGER 1 / CASSINI-HUYGENS / S-IVB) ---
    const busGroup = new THREE.Group();
    const busGeo = new THREE.CylinderGeometry(0.54, 0.54, 0.44, 10, 2);
    const busMesh = new THREE.Mesh(busGeo, darkTitaniumMat);
    busMesh.position.set(0, 0.55, 0);
    busGroup.add(busMesh);

    // 10 Decagonal Avionics Bays with Thermal Louver Blades
    for (let b = 0; b < 10; b++) {
      const ba = (b / 10) * Math.PI * 2;
      const bayLouver = new THREE.Mesh(
        new THREE.BoxGeometry(0.26, 0.32, 0.04),
        b % 2 === 0 ? brushedAlloyMat : goldKaptonMat
      );
      bayLouver.position.set(Math.cos(ba) * 0.53, 0.55, Math.sin(ba) * 0.53);
      bayLouver.rotation.y = -ba + Math.PI / 2;
      busGroup.add(bayLouver);
    }
    registerPart(
      busGroup,
      new THREE.Vector3(0, 0, 0),
      '10-Bay Decagonal Avionics Bus & Thermal Control Louvers'
    );

    // Golden Phonograph Record / Huygens Aeroshell mounted on the bus side
    const plaqueGroup = new THREE.Group();
    plaqueGroup.position.set(0, 0.55, 0.56);
    const recordDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.04, 36),
      goldKaptonMat
    );
    recordDisc.rotation.x = Math.PI / 2;
    plaqueGroup.add(recordDisc);
    registerPart(
      plaqueGroup,
      new THREE.Vector3(0, 0, 0.72),
      'Gold-Anodized Interstellar Record / Huygens Entry Probe'
    );

    // High-Polygon 3.7m Parabolic High-Gain Dish with 16 Radial Ribs & Tripod Subreflector
    const hgaDishGroup = createHighPolyParabolicDish(
      1.12,
      0.36,
      16,
      matteThermalMat,
      brushedAlloyMat,
      opticalLensMat
    );
    hgaDishGroup.position.set(0, 0.8, 0);
    registerPart(
      hgaDishGroup,
      new THREE.Vector3(0, 0.85, 0),
      '3.7m High-Gain Parabolic Ribbed Dish & X/S-Band Feed Tripod'
    );
    refDishGroup = hgaDishGroup;

    // Triple-Tandem MHW-RTG Radioisotope Boom with Finned Plutonium-238 Cylinders
    const rtgGroup = new THREE.Group();
    for (const zStrut of [-0.08, 0.08]) {
      const rtgCurve = new THREE.LineCurve3(
        new THREE.Vector3(-0.48, 0.52, zStrut),
        new THREE.Vector3(-1.62, 0.32, zStrut * 0.5)
      );
      rtgGroup.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(rtgCurve, 12, 0.022, 10, false),
          brushedAlloyMat
        )
      );
    }
    for (let r = 0; r < 3; r++) {
      const rtgCan = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.28, 24),
        darkTitaniumMat
      );
      rtgCan.rotation.z = Math.PI / 2;
      rtgCan.position.set(-0.92 - r * 0.32, 0.42 - r * 0.05, 0);
      rtgGroup.add(rtgCan);
    }
    registerPart(
      rtgGroup,
      new THREE.Vector3(-0.95, 0, 0),
      'Triple-Tandem MHW-RTG Plutonium-238 Power Boom'
    );

    // 13-Meter Astromast Magnetometer Lattice Boom + 2-Axis Science Scan Platform
    const sciGroup = new THREE.Group();
    for (let b = 0; b < 3; b++) {
      const ba = (b / 3) * Math.PI * 2;
      const longeron = new THREE.LineCurve3(
        new THREE.Vector3(0.48, 0.52 + Math.cos(ba) * 0.07, Math.sin(ba) * 0.07),
        new THREE.Vector3(1.68, 0.64 + Math.cos(ba) * 0.05, Math.sin(ba) * 0.05)
      );
      sciGroup.add(
        new THREE.Mesh(
          new THREE.TubeGeometry(longeron, 12, 0.014, 8, false),
          goldKaptonMat
        )
      );
    }
    const scanPlatform = new THREE.Group();
    scanPlatform.position.set(1.68, 0.64, 0);
    const scanBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.22, 0.28),
      darkTitaniumMat
    );
    scanPlatform.add(scanBody);
    // ISS Narrow & Wide Angle Telescope Barrels
    for (const bz of [-0.08, 0.08]) {
      const issScope = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.055, 0.26, 20),
        opticalLensMat
      );
      issScope.rotation.z = Math.PI / 2;
      issScope.position.set(0.16, 0.02, bz);
      scanPlatform.add(issScope);
    }
    sciGroup.add(scanPlatform);
    registerPart(
      sciGroup,
      new THREE.Vector3(0.95, 0.2, 0),
      'Astromast Truss Boom & ISS Narrow/Wide-Angle Scan Platform'
    );
    refMastGroup = sciGroup;
  }

  // --- HYPER-DETAILED 6-CHAPTER STORYLINE SHADERS, EDL STAGES & PARTICLE RIGS ---

  // 1. Custom GLSL Mach-Diamond Rocket Exhaust Plume
  const thrusterPlumeGroup = new THREE.Group();
  const machPlumeMaterial = createMachDiamondPlumeMaterial();
  const outerConeGeo = new THREE.ConeGeometry(0.46, 2.45, 36, 20, true);
  outerConeGeo.translate(0, -1.22, 0);
  const outerCone = new THREE.Mesh(outerConeGeo, machPlumeMaterial);
  thrusterPlumeGroup.add(outerCone);
  thrusterPlumeGroup.position.set(0, 0.12, 0);
  thrusterPlumeGroup.visible = false;
  root.add(thrusterPlumeGroup);

  // 2. Custom GLSL Hypersonic Entry Bow-Shock Plasma Shield (1,450°C Ionization Dome)
  const entryPlasmaMaterial = createEntryPlasmaBowShockMaterial();
  const plasmaDomeGeo = new THREE.SphereGeometry(
    1.88,
    48,
    32,
    0,
    Math.PI * 2,
    Math.PI * 0.44,
    Math.PI * 0.56
  );
  const entryPlasmaDome = new THREE.Mesh(plasmaDomeGeo, entryPlasmaMaterial);
  entryPlasmaDome.position.set(0, 0.65, 0);
  entryPlasmaDome.visible = false;
  root.add(entryPlasmaDome);

  // 3. High-Poly Honeycomb Ablative Entry Heatshield Cone (Separates in Chapter 3 Beat 2)
  const detachableHeatshield = new THREE.Group();
  const shieldPoints = [
    new THREE.Vector2(0.0, -0.36),
    new THREE.Vector2(0.88, -0.22),
    new THREE.Vector2(1.58, 0.08),
    new THREE.Vector2(1.5, 0.16),
    new THREE.Vector2(0.0, -0.26),
  ];
  const shieldGeo = new THREE.LatheGeometry(shieldPoints, 48);
  const shieldMesh = new THREE.Mesh(shieldGeo, ablativeTpsMat);
  detachableHeatshield.add(shieldMesh);
  detachableHeatshield.position.set(0, 0.05, 0);
  detachableHeatshield.visible = false;
  root.add(detachableHeatshield);

  // 4. High-Poly Supersonic Disk-Gap-Band Parachute Canopy + 16 Suspension Lines (Chapter 3 Beat 2)
  const parachuteGroup = new THREE.Group();
  parachuteGroup.position.set(0, 1.35, 0);

  const chutePoints = [
    new THREE.Vector2(0.18, 4.45),
    new THREE.Vector2(0.95, 4.38),
    new THREE.Vector2(1.85, 4.05),
    new THREE.Vector2(2.25, 3.55),
    new THREE.Vector2(2.15, 3.25),
  ];
  const chuteCanopyGeo = new THREE.LatheGeometry(chutePoints, 48);
  const chuteMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    emissive: 0x7c2d12,
    emissiveIntensity: 0.22,
    roughness: 0.65,
    side: THREE.DoubleSide,
  });
  const chuteCanopy = new THREE.Mesh(chuteCanopyGeo, chuteMat);
  parachuteGroup.add(chuteCanopy);

  // White dacron band ring below gap
  const bandPoints = [
    new THREE.Vector2(2.18, 3.12),
    new THREE.Vector2(2.22, 2.75),
  ];
  const bandMesh = new THREE.Mesh(
    new THREE.LatheGeometry(bandPoints, 48),
    matteThermalMat
  );
  parachuteGroup.add(bandMesh);

  // 16 Kevlar suspension riser lines from backshell bridle to canopy skirt
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xe2e8f0,
    transparent: true,
    opacity: 0.65,
  });
  const lineVerts: number[] = [];
  for (let l = 0; l < 16; l++) {
    const la = (l / 16) * Math.PI * 2;
    lineVerts.push(0, 0.35, 0);
    lineVerts.push(Math.cos(la) * 2.2, 2.75, Math.sin(la) * 2.2);
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
  parachuteGroup.add(new THREE.LineSegments(lineGeo, lineMat));
  parachuteGroup.visible = false;
  root.add(parachuteGroup);

  // 5. Sky-Crane / Retro-Descent Bridle Stage with 8 Cantilevered Nozzles & 3 Nylon Bridles (Chapter 3 Beat 3)
  const skyCraneGroup = new THREE.Group();
  skyCraneGroup.position.set(0, 2.35, 0);

  const craneFrame = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 1.05, 0.26, 8),
    matteThermalMat
  );
  skyCraneGroup.add(craneFrame);

  // 8 outward-canted MLE retro-rocket nozzles around the Sky-Crane perimeter so plumes don't scorch the rover
  for (let n = 0; n < 8; n++) {
    const na = (n / 8) * Math.PI * 2;
    const mleCone = new THREE.Mesh(
      new THREE.ConeGeometry(0.14, 0.68, 16, 1, true),
      machPlumeMaterial
    );
    mleCone.position.set(Math.cos(na) * 1.12, -0.32, Math.sin(na) * 1.12);
    mleCone.rotation.z = Math.cos(na) * 0.45;
    mleCone.rotation.x = -Math.sin(na) * 0.45;
    skyCraneGroup.add(mleCone);
  }

  // 3 Triple-Bridle Nylon Lowering Tethers + Umbilical Cord connecting Sky-Crane to Rover Deck
  const bridleVerts: number[] = [];
  for (let b = 0; b < 3; b++) {
    const ba = (b / 3) * Math.PI * 2;
    bridleVerts.push(Math.cos(ba) * 0.65, -0.1, Math.sin(ba) * 0.65);
    bridleVerts.push(Math.cos(ba) * 0.42, -1.5, Math.sin(ba) * 0.42);
  }
  const bridleGeo = new THREE.BufferGeometry();
  bridleGeo.setAttribute('position', new THREE.Float32BufferAttribute(bridleVerts, 3));
  skyCraneGroup.add(
    new THREE.LineSegments(
      bridleGeo,
      new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.85 })
    )
  );
  skyCraneGroup.visible = false;
  root.add(skyCraneGroup);

  // 6. 4-Way RCS Attitude Control Micro-Thruster Plumes (Chapters 1, 2 & 3)
  const rcsPlumesGroup = new THREE.Group();
  const rcsConeGeo = new THREE.ConeGeometry(0.085, 0.52, 16, 1, true);
  rcsConeGeo.rotateZ(Math.PI / 2);
  const rcsMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  for (let rIdx = 0; rIdx < 4; rIdx++) {
    const ra = (rIdx * Math.PI) / 2 + Math.PI / 4;
    const rMesh = new THREE.Mesh(rcsConeGeo, rcsMat);
    rMesh.position.set(Math.cos(ra) * 0.94, 1.15, Math.sin(ra) * 0.94);
    rMesh.rotation.y = -ra;
    rcsPlumesGroup.add(rMesh);
  }
  rcsPlumesGroup.visible = false;
  root.add(rcsPlumesGroup);

  // 7. Touchdown Regolith Dust Wave Ring + 540-Particle GPU Ejecta Cloud
  const dustWaveGeo = new THREE.RingGeometry(0.65, 1.45, 48);
  dustWaveGeo.rotateX(-Math.PI / 2);
  const dustWaveMat = new THREE.MeshBasicMaterial({
    color: 0xfde68a,
    transparent: true,
    opacity: 0.0,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const dustWaveRing = new THREE.Mesh(dustWaveGeo, dustWaveMat);
  dustWaveRing.position.y = 0.04;
  dustWaveRing.visible = false;
  root.add(dustWaveRing);

  const particleCount = 540;
  const pPositions = new Float32Array(particleCount * 3);
  const pColors = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const ang = (i / particleCount) * Math.PI * 2 * 9;
    const rad = 0.32 + ((i * 19) % 100) * 0.034;
    pPositions[i * 3] = Math.cos(ang) * rad;
    pPositions[i * 3 + 1] = ((i * 7) % 45) * 0.025;
    pPositions[i * 3 + 2] = Math.sin(ang) * rad;
    pColors[i * 3] = 0.96;
    pColors[i * 3 + 1] = 0.8;
    pColors[i * 3 + 2] = 0.48;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
  const dustParticleSystem = new THREE.Points(
    particleGeo,
    new THREE.PointsMaterial({
      size: 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  dustParticleSystem.visible = false;
  root.add(dustParticleSystem);

  // 8. Volumetric Holographic LiDAR Terrain Scanner Ring (Chapters 3, 4, 6)
  const lidarGeo = new THREE.RingGeometry(1.15, 1.3, 64);
  lidarGeo.rotateX(-Math.PI / 2);
  const lidarMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.68,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const lidarScanRing = new THREE.Mesh(lidarGeo, lidarMat);
  lidarScanRing.position.y = 0.03;
  lidarScanRing.visible = false;
  root.add(lidarScanRing);

  // 9. Scientific Instrument Laser / LIBS Spectrometer Scan Beam & Target Plasma Spark (Chapter 4)
  const instrumentBeamGroup = new THREE.Group();
  const laserRayGeo = new THREE.CylinderGeometry(0.032, 0.085, 10.5, 24, 1, true);
  laserRayGeo.translate(0, 5.25, 0);
  const laserRayMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const laserBeam = new THREE.Mesh(laserRayGeo, laserRayMat);
  laserBeam.position.set(0.65, 0.2, 0.75);
  laserBeam.rotation.z = -0.22;
  instrumentBeamGroup.add(laserBeam);

  const specConeGeo = new THREE.ConeGeometry(0.62, 1.45, 36, 1, true);
  specConeGeo.translate(0, -0.72, 0);
  const specConeMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const specCone = new THREE.Mesh(specConeGeo, specConeMat);
  specCone.position.set(0, 0.65, 1.15);
  specCone.rotation.x = 0.35;
  instrumentBeamGroup.add(specCone);
  instrumentBeamGroup.visible = false;
  root.add(instrumentBeamGroup);

  // 10. Concentric Telemetry Carrier Waves (Chapter 5)
  const telemetryWavesGroup = new THREE.Group();
  telemetryWavesGroup.position.set(0, 1.35, 0);
  for (let w = 0; w < 5; w++) {
    const waveRingGeo = new THREE.RingGeometry(0.3 + w * 0.24, 0.36 + w * 0.24, 48);
    waveRingGeo.rotateX(-Math.PI / 3);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.68,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const waveMesh = new THREE.Mesh(waveRingGeo, waveMat);
    waveMesh.userData.waveIndex = w;
    telemetryWavesGroup.add(waveMesh);
  }
  telemetryWavesGroup.visible = false;
  root.add(telemetryWavesGroup);

  // 11. Hyper-Detailed Orbital Reconnaissance Satellite Rig (LRO / MRO HiRISE Overflight)
  const reconSat = buildHighPolyReconSatellite(
    goldKaptonMat,
    solarArrayMat,
    darkTitaniumMat,
    brushedAlloyMat,
    opticalLensMat
  );
  const reconOrbiterGroup = reconSat.group;
  reconOrbiterGroup.position.set(0, 4.1, 0);
  reconOrbiterGroup.visible = false;
  root.add(reconOrbiterGroup);

  // 12. High-Polygon Autonomous Coaxial Rotorcraft Companion (Ingenuity Mars Helicopter)
  const ingenuityGroup = new THREE.Group();
  ingenuityGroup.position.set(1.65, 0.15, 0.85);
  const heliBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.2, 0.22),
    goldKaptonMat
  );
  heliBody.position.y = 0.24;
  ingenuityGroup.add(heliBody);

  // 4 Carbon-fiber tubular landing legs with hemispherical foot dampers
  for (let l = 0; l < 4; l++) {
    const la = (l * Math.PI) / 2 + Math.PI / 4;
    const legCurve = new THREE.LineCurve3(
      new THREE.Vector3(Math.cos(la) * 0.09, 0.2, Math.sin(la) * 0.09),
      new THREE.Vector3(Math.cos(la) * 0.32, 0.0, Math.sin(la) * 0.32)
    );
    ingenuityGroup.add(
      new THREE.Mesh(
        new THREE.TubeGeometry(legCurve, 6, 0.008, 8, false),
        darkTitaniumMat
      )
    );
  }

  const mastRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.025, 0.34, 16),
    brushedAlloyMat
  );
  mastRod.position.y = 0.4;
  ingenuityGroup.add(mastRod);

  // Sculpted counter-rotating carbon-fiber airfoils
  const buildRotorAssembly = (yPos: number): THREE.Group => {
    const rGroup = new THREE.Group();
    rGroup.position.y = yPos;
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.025, 16),
      brushedAlloyMat
    );
    rGroup.add(hub);
    for (const dir of [-1, 1]) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.008, 0.085),
        darkTitaniumMat
      );
      blade.position.x = dir * 0.26;
      blade.rotation.x = dir * 0.16; // Collective pitch angle
      rGroup.add(blade);
    }
    return rGroup;
  };

  const ingenuityRotorA = buildRotorAssembly(0.46);
  ingenuityGroup.add(ingenuityRotorA);

  const ingenuityRotorB = buildRotorAssembly(0.53);
  ingenuityRotorB.rotation.y = Math.PI / 2;
  ingenuityGroup.add(ingenuityRotorB);

  const heliSolar = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.016, 0.24),
    solarArrayMat
  );
  heliSolar.position.y = 0.58;
  ingenuityGroup.add(heliSolar);

  ingenuityGroup.visible = false;
  root.add(ingenuityGroup);

  root.userData.explodableParts = explodableParts;
  const animRig: SpacecraftAnimationRig = {
    thrusterPlumeGroup,
    machPlumeMaterial,
    entryPlasmaDome,
    entryPlasmaMaterial,
    detachableHeatshield,
    parachuteGroup,
    skyCraneGroup,
    rcsPlumesGroup,
    dustWaveRing,
    dustParticleSystem,
    lidarScanRing,
    instrumentBeamGroup,
    telemetryWavesGroup,
    reconOrbiterGroup,
    satSolarWingL: reconSat.solarWingL,
    satSolarWingR: reconSat.solarWingR,
    satDishGroup: reconSat.dishGroup,
    ingenuityGroup,
    ingenuityRotorA,
    ingenuityRotorB,
    dishGroup: refDishGroup,
    mastGroup: refMastGroup,
    armGroup: refArmGroup,
    armForearmGroup: refArmForearmGroup,
    armTurretGroup: refArmTurretGroup,
    solarWingL: refSolarWingL,
    solarWingR: refSolarWingR,
    ascentGroup: refAscentGroup,
    deployedPackage: refDeployedPkg,
    wheels,
    rockerBogieGroups,
  };
  root.userData.animRig = animRig;

  return root;
}

