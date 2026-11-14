import * as THREE from 'three';
import { CelestialBodyId } from '../types/afterlight';

const materialCache = new Map<string, THREE.MeshStandardMaterial>();

function pseudoNoise2D(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function fbm2D(x: number, y: number, octaves = 4): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1.0;
  for (let i = 0; i < octaves; i++) {
    const ix = Math.floor(x * freq);
    const iy = Math.floor(y * freq);
    const fx = x * freq - ix;
    const fy = y * freq - iy;
    const u = fx * fx * (3.0 - 2.0 * fx);
    const v = fy * fy * (3.0 - 2.0 * fy);
    const a = pseudoNoise2D(ix, iy);
    const b = pseudoNoise2D(ix + 1, iy);
    const c = pseudoNoise2D(ix, iy + 1);
    const d = pseudoNoise2D(ix + 1, iy + 1);
    const res = a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    value += res * amp;
    freq *= 2.12;
    amp *= 0.48;
  }
  return value;
}

/**
 * Generates authentic crinkled Gold Kapton MLI (Multi-Layer Insulation) PBR material
 * with diamond-quilted thermal blanket seams and micro-crease bump mapping.
 */
export function getGoldKaptonMaterial(): THREE.MeshStandardMaterial {
  const cached = materialCache.get('kapton_gold');
  if (cached) return cached;

  const size = 256;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  const imgData = ctx.createImageData(size, size);
  const bumpData = bCtx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const crinkle =
        fbm2D(x * 0.14, y * 0.14, 4) * 0.65 +
        Math.abs(Math.sin(x * 0.25 + y * 0.18) * Math.cos(x * 0.19 - y * 0.27)) * 0.35;

      // Diamond quilting seam lines
      const diag1 = Math.abs(((x + y) % 32) - 16);
      const diag2 = Math.abs(((x - y + 512) % 32) - 16);
      const seam = diag1 < 1.2 || diag2 < 1.2 ? 0.65 : 1.0;

      const r = Math.min(255, Math.round((215 + crinkle * 40) * seam));
      const g = Math.min(255, Math.round((152 + crinkle * 48) * seam));
      const b = Math.min(255, Math.round((24 + crinkle * 25) * seam));

      imgData.data[idx] = r;
      imgData.data[idx + 1] = g;
      imgData.data[idx + 2] = b;
      imgData.data[idx + 3] = 255;

      const bVal = Math.min(255, Math.max(0, Math.round(crinkle * 240 * seam)));
      bumpData.data[idx] = bVal;
      bumpData.data[idx + 1] = bVal;
      bumpData.data[idx + 2] = bVal;
      bumpData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  bCtx.putImageData(bumpData, 0, 0);

  const map = new THREE.CanvasTexture(colorCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 2);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 2);

  const mat = new THREE.MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: 0.042,
    metalness: 0.88,
    roughness: 0.28,
    envMapIntensity: 0.35,
  });

  materialCache.set('kapton_gold', mat);
  return mat;
}

/**
 * Generates a high-detail triple-junction Gallium Arsenide Photovoltaic Solar Cell Array material
 * with individual wafer cells, silver busbars, and anti-reflective specular coating.
 */
export function getSolarArrayMaterial(): THREE.MeshStandardMaterial {
  const cached = materialCache.get('solar_array');
  if (cached) return cached;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  // Deep iridescent cobalt-navy background
  ctx.fillStyle = '#07132c';
  ctx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  const cols = 8;
  const rows = 16;
  const cellW = size / cols;
  const cellH = size / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW;
      const y = r * cellH;
      const shade = 0.82 + pseudoNoise2D(c, r) * 0.28;
      ctx.fillStyle = `rgb(${Math.round(10 * shade)}, ${Math.round(32 * shade)}, ${Math.round(
        84 * shade
      )})`;
      ctx.fillRect(x + 1.5, y + 1.5, cellW - 3, cellH - 3);

      // Fine silver grid fingers
      ctx.fillStyle = 'rgba(148, 197, 255, 0.28)';
      ctx.fillRect(x + cellW * 0.5, y + 1.5, 0.8, cellH - 3);

      // Corner chamfer interconnect
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(x + 1, y + 1, 2.5, 2.5);

      bCtx.strokeStyle = '#1e293b';
      bCtx.lineWidth = 1.5;
      bCtx.strokeRect(x + 1, y + 1, cellW - 2, cellH - 2);
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  const mat = new THREE.MeshStandardMaterial({
    map,
    bumpMap,
    bumpScale: 0.022,
    metalness: 0.78,
    roughness: 0.22,
    envMapIntensity: 0.32,
    emissive: new THREE.Color('#051026'),
    emissiveIntensity: 0.14,
  });

  materialCache.set('solar_array', mat);
  return mat;
}

/**
 * Generates CNC-machined aerospace aluminum/titanium structural hull material with isogrid ribs,
 * fastener rivets, and thermal control louvers.
 */
export function getAerospaceHullMaterial(
  key: string,
  baseHex: string,
  metalness = 0.68,
  roughness = 0.36
): THREE.MeshStandardMaterial {
  const cacheKey = `hull_${key}_${baseHex}`;
  const cached = materialCache.get(cacheKey);
  if (cached) return cached;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, size, size);

  // Panel seams and rivets
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.55)';
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, size - 8, size - 8);
  ctx.strokeRect(4, size / 2, size - 8, size / 2 - 4);
  ctx.strokeRect(size / 2, 4, size / 2 - 4, size - 8);

  // Isogrid subtle lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  // Fastener rivet dots along panel borders
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
  for (let i = 12; i < size; i += 16) {
    ctx.fillRect(i, 8, 2, 2);
    ctx.fillRect(i, size - 10, 2, 2);
    ctx.fillRect(8, i, 2, 2);
    ctx.fillRect(size - 10, i, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;

  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    bumpMap: tex,
    bumpScale: 0.02,
    metalness,
    roughness,
    envMapIntensity: 0.28,
  });

  materialCache.set(cacheKey, mat);
  return mat;
}

/**
 * Generates an Avcoat / Phenolic Honeycomb Ablative Heatshield material with radial char streaks.
 */
export function getAblativeHeatshieldMaterial(): THREE.MeshStandardMaterial {
  const cached = materialCache.get('ablative_tps');
  if (cached) return cached;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    8,
    size / 2,
    size / 2,
    size * 0.5
  );
  grad.addColorStop(0, '#29150c');
  grad.addColorStop(0.55, '#5c2812');
  grad.addColorStop(0.85, '#7c3416');
  grad.addColorStop(1, '#3b170b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Hexagonal tile grid + radial ablation streaks
  ctx.strokeStyle = 'rgba(251, 146, 60, 0.22)';
  ctx.lineWidth = 1;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 24) {
    ctx.beginPath();
    ctx.moveTo(size / 2, size / 2);
    ctx.lineTo(size / 2 + Math.cos(a) * (size * 0.48), size / 2 + Math.sin(a) * (size * 0.48));
    ctx.stroke();
  }

  for (let r = 16; r < size * 0.48; r += 14) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshStandardMaterial({
    map: tex,
    bumpMap: tex,
    bumpScale: 0.032,
    metalness: 0.22,
    roughness: 0.76,
    envMapIntensity: 0.22,
  });
  materialCache.set('ablative_tps', mat);
  return mat;
}

/**
 * Evaluates deterministic planetary micro-topography height at local coordinates (u, v) in [-1, 1]
 * including multi-scale impact craters with raised rims, central peaks, and regolith ridges.
 */
export function evaluateLandingSiteMicroHeight(u: number, v: number): number {
  // Base FBM undulating topography
  let h = (fbm2D((u + 2) * 3.8, (v + 2) * 3.8, 5) - 0.5) * 0.095;

  // Deterministic crater catalog around the landing pad (keep center (0,0) relatively flat for lander pads)
  const craters = [
    { cx: 0.34, cy: 0.24, r: 0.16, depth: 0.048 },
    { cx: -0.38, cy: 0.28, r: 0.21, depth: 0.062 },
    { cx: 0.18, cy: -0.36, r: 0.14, depth: 0.042 },
    { cx: -0.26, cy: -0.32, r: 0.12, depth: 0.038 },
    { cx: 0.52, cy: -0.12, r: 0.18, depth: 0.054 },
    { cx: -0.54, cy: -0.06, r: 0.15, depth: 0.045 },
    { cx: 0.05, cy: 0.48, r: 0.17, depth: 0.05 },
    { cx: -0.14, cy: 0.22, r: 0.09, depth: 0.028 },
    { cx: 0.26, cy: -0.15, r: 0.1, depth: 0.03 },
  ];

  for (const c of craters) {
    const dx = u - c.cx;
    const dy = v - c.cy;
    const d = Math.sqrt(dx * dx + dy * dy) / c.r;
    if (d < 1.35) {
      if (d < 0.85) {
        // Bowl depression
        const bowl = (d / 0.85) * (d / 0.85) - 1.0;
        h += bowl * c.depth;
      } else {
        // Raised crater rim lip
        const rimT = (d - 0.85) / 0.5;
        const rim = Math.sin((1 - rimT) * Math.PI) * 0.38;
        h += rim * c.depth;
      }
    }
  }

  // Smooth flatten right under the touchdown origin (0,0) so lander footpads sit flush
  const originDist = Math.sqrt(u * u + v * v);
  const padFlatten = Math.min(1.0, Math.max(0.0, (originDist - 0.06) / 0.12));
  return h * padFlatten;
}

/**
 * Builds an ultra-high-polygon (128x128 = 32,768 terrain triangles + 56 detail-3 icosahedron boulders = 50,688 triangles)
 * local planetary surface patch around the active artifact site with authentic low-albedo basaltic/iron-oxide reflectance.
 */
export function buildHighPolyLandingSiteTerrainPatch(
  bodyId: CelestialBodyId,
  planetRadius: number,
  siteNormal: THREE.Vector3
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'highPolyLandingSiteTerrain';

  const isMars = bodyId === 'mars';
  const isMoon = bodyId === 'moon';

  // Generate high-contrast procedural micro-regolith texture + bump map (authentic low-albedo reflectance — zero overexposure!)
  const texSize = 512;
  const canvas = document.createElement('canvas');
  canvas.width = texSize;
  canvas.height = texSize;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(texSize, texSize);

  for (let y = 0; y < texSize; y++) {
    for (let x = 0; x < texSize; x++) {
      const u = (x / texSize) * 2 - 1;
      const v = (y / texSize) * 2 - 1;
      const h = evaluateLandingSiteMicroHeight(u, v);
      const grain = fbm2D(x * 0.22, y * 0.22, 4);
      const shade = Math.max(0.28, Math.min(1.15, 0.64 + h * 5.2 + (grain - 0.5) * 0.42));

      // Subtle rocket exhaust blast-zone scouring directly under the lander (r < 0.16)
      const rCenter = Math.sqrt(u * u + v * v);
      const blastHalo = rCenter < 0.16 ? (1 - rCenter / 0.16) * 0.06 : 0;

      const idx = (y * texSize + x) * 4;
      if (isMars) {
        imgData.data[idx] = Math.min(172, Math.round(114 * shade + blastHalo * 38));
        imgData.data[idx + 1] = Math.min(118, Math.round(56 * shade + blastHalo * 24));
        imgData.data[idx + 2] = Math.min(86, Math.round(34 * shade + blastHalo * 18));
      } else if (isMoon) {
        // Authentic Lunar Mare Basalt regolith (dark slate-charcoal so gold Kapton & crater rims pop with crisp contrast)
        const val = Math.min(136, Math.round(76 * shade + blastHalo * 32));
        imgData.data[idx] = val;
        imgData.data[idx + 1] = val + 2;
        imgData.data[idx + 2] = Math.min(144, val + 6);
      } else {
        imgData.data[idx] = Math.min(152, Math.round(104 * shade));
        imgData.data[idx + 1] = Math.min(136, Math.round(88 * shade));
        imgData.data[idx + 2] = Math.min(112, Math.round(68 * shade));
      }
      imgData.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
  const regolithTex = new THREE.CanvasTexture(canvas);
  regolithTex.colorSpace = THREE.SRGBColorSpace;

  // Create ultra-high-density subdivided patch (128 x 128 segments = 32,768 triangles)
  const patchSpan = 2.9;
  const segs = 128;
  const geom = new THREE.PlaneGeometry(patchSpan, patchSpan, segs, segs);
  const posAttr = geom.attributes.position;

  for (let i = 0; i < posAttr.count; i++) {
    const px = posAttr.getX(i);
    const py = posAttr.getY(i);
    const u = px / (patchSpan * 0.5);
    const v = py / (patchSpan * 0.5);
    const radialDist = Math.sqrt(u * u + v * v);

    // Smoothly feather the edge into the underlying globe sphere
    const edgeFeather = Math.max(0, 1 - Math.pow(Math.min(1, radialDist), 3));
    const microH = evaluateLandingSiteMicroHeight(u, v) * edgeFeather;

    // Curvature drop to hug the sphere of radius `planetRadius`
    const horizDistSq = px * px + py * py;
    const sphereDrop =
      planetRadius - Math.sqrt(Math.max(0.1, planetRadius * planetRadius - horizDistSq));

    posAttr.setZ(i, -sphereDrop + microH + 0.006 * edgeFeather);
  }
  geom.computeVertexNormals();

  const patchMat = new THREE.MeshStandardMaterial({
    map: regolithTex,
    bumpMap: regolithTex,
    bumpScale: 0.055,
    roughness: 0.94,
    metalness: 0.04,
    envMapIntensity: 0.1,
  });

  const patchMesh = new THREE.Mesh(geom, patchMat);
  patchMesh.receiveShadow = true;
  group.add(patchMesh);

  // Add 56 Ultra-High-Polygon Fractured 3D Boulders & Outcrops (Icosahedron detail=3 => 320 tris each = 17,920 boulder tris!)
  const rockBaseMat = new THREE.MeshStandardMaterial({
    color: isMars ? '#662f1a' : '#4a505c',
    roughness: 0.92,
    metalness: 0.1,
    bumpMap: regolithTex,
    bumpScale: 0.032,
    envMapIntensity: 0.12,
  });

  for (let b = 0; b < 56; b++) {
    const angle = b * 2.39996 + 0.4; // Golden angle distribution
    const dist = 0.17 + ((b * 0.019) % 1.02);
    const bx = Math.cos(angle) * dist;
    const by = Math.sin(angle) * dist;
    const u = bx / (patchSpan * 0.5);
    const v = by / (patchSpan * 0.5);

    const rockScale = 0.015 + (b % 6) * 0.0075;
    const rockGeom = new THREE.IcosahedronGeometry(rockScale, 3); // 320 triangles per boulder!
    const rPos = rockGeom.attributes.position;
    for (let vi = 0; vi < rPos.count; vi++) {
      const vx = rPos.getX(vi);
      const vy = rPos.getY(vi);
      const vz = rPos.getZ(vi);
      const disp =
        0.7 +
        0.52 *
          pseudoNoise2D(
            vx * 48 + b * 1.3,
            vy * 48 + vz * 33 + b * 0.7
          );
      rPos.setXYZ(vi, vx * disp * 1.22, vy * disp, vz * disp * 0.78);
    }
    rockGeom.computeVertexNormals();

    const rockMesh = new THREE.Mesh(rockGeom, rockBaseMat);
    const horizDistSq = bx * bx + by * by;
    const sphereDrop =
      planetRadius - Math.sqrt(Math.max(0.1, planetRadius * planetRadius - horizDistSq));
    const microH = evaluateLandingSiteMicroHeight(u, v);

    rockMesh.position.set(bx, by, -sphereDrop + microH + rockScale * 0.35);
    rockMesh.rotation.set(b * 0.7, b * 1.1, b * 0.4);
    rockMesh.castShadow = true;
    rockMesh.receiveShadow = true;
    group.add(rockMesh);
  }

  // Orient patch so local +Z aligns with `siteNormal` and position at surface
  const surfacePos = siteNormal.clone().multiplyScalar(planetRadius);
  group.position.copy(surfacePos);
  const upQuat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    siteNormal.clone().normalize()
  );
  group.quaternion.copy(upQuat);

  return group;
}
