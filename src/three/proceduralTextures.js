import * as THREE from 'three';

function createCanvas(width = 1024, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

function generateNoise(ctx, width, height, opacity = 0.15) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = Math.floor((Math.random() * 0.5 + 0.5) * 255 * opacity);
    data[i] = Math.min(255, data[i] + val);
    data[i + 1] = Math.min(255, data[i + 1] + val);
    data[i + 2] = Math.min(255, data[i + 2] + val);
  }
  ctx.putImageData(imgData, 0, 0);
}

export function createSunTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#ff9900');
  grad.addColorStop(0.5, '#ff4400');
  grad.addColorStop(1, '#ffbb00');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 8 + 2;
    const color = Math.random() > 0.3 ? 'rgba(255,240,150,0.5)' : 'rgba(180,30,0,0.6)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createMercuryTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  ctx.fillStyle = '#7a7a7a';
  ctx.fillRect(0, 0, 1024, 512);

  for (let i = 0; i < 1200; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 6 + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(40,40,40,0.5)';
    ctx.fill();
  }

  generateNoise(ctx, 1024, 512, 0.2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createVenusTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#e3bb76');
  grad.addColorStop(0.5, '#cfa358');
  grad.addColorStop(1, '#b88a3d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  for (let y = 0; y < 512; y += 4) {
    const wave = Math.sin(y * 0.05) * 30;
    ctx.fillStyle = `rgba(255, 235, 175, ${0.2 + Math.random() * 0.2})`;
    ctx.fillRect(0 + wave, y, 1024, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createEarthTexture() {
  const { canvas, ctx } = createCanvas(2048, 1024);
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#0a2342');
  grad.addColorStop(0.5, '#12559b');
  grad.addColorStop(1, '#0a2342');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 2048, 1024);

  const landColors = ['#2e7d32', '#388e3c', '#558b2f', '#8d6e63', '#4e342e'];
  for (let i = 0; i < 350; i++) {
    const cx = Math.random() * 2048;
    const cy = 150 + Math.random() * 724;
    const rx = 60 + Math.random() * 200;
    const ry = 40 + Math.random() * 140;

    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = landColors[Math.floor(Math.random() * landColors.length)];
    ctx.globalAlpha = 0.8;
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // Ice Caps
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 2048, 80);
  ctx.fillRect(0, 944, 2048, 80);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createEarthCloudsTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  for (let i = 0; i < 250; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const rx = 40 + Math.random() * 130;
    const ry = 12 + Math.random() * 45;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createMoonTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  ctx.fillStyle = '#9e9e9e';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = 'rgba(50,50,50,0.6)';
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 1024;
    const y = 100 + Math.random() * 312;
    const r = 30 + Math.random() * 90;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(240,240,240,0.8)';
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 1 + Math.random() * 4;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createMarsTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#b83b14');
  grad.addColorStop(0.5, '#c1440e');
  grad.addColorStop(1, '#8f2508');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = 'rgba(70,15,5,0.6)';
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const rx = 30 + Math.random() * 100;
    const ry = 10 + Math.random() * 30;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1024, 35);
  ctx.fillRect(0, 477, 1024, 35);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createJupiterTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  const bands = ['#b88a4c', '#d6b278', '#a46d33', '#e4cc9d', '#965922', '#c39d67', '#7c4314'];
  const bandHeight = 512 / bands.length;
  for (let i = 0; i < bands.length; i++) {
    ctx.fillStyle = bands[i];
    ctx.fillRect(0, i * bandHeight, 1024, bandHeight + 2);
  }

  for (let y = 0; y < 512; y += 6) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
    const offset = Math.sin(y * 0.04) * 40;
    ctx.fillRect(0 + offset, y, 1024, 3);
  }

  ctx.beginPath();
  ctx.ellipse(650, 320, 75, 45, 0, 0, Math.PI * 2);
  const spotGrad = ctx.createRadialGradient(650, 320, 5, 650, 320, 75);
  spotGrad.addColorStop(0, '#c43418');
  spotGrad.addColorStop(0.7, '#a2260e');
  spotGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = spotGrad;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createSaturnTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#cfac6d');
  grad.addColorStop(0.2, '#e0c58e');
  grad.addColorStop(0.5, '#ba9554');
  grad.addColorStop(0.8, '#d4b77d');
  grad.addColorStop(1, '#a68040');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createSaturnRingsTexture() {
  const { canvas, ctx } = createCanvas(1024, 64);
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0.0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.1, 'rgba(215, 185, 130, 0.9)');
  grad.addColorStop(0.4, 'rgba(190, 160, 105, 0.8)');
  grad.addColorStop(0.5, 'rgba(20, 20, 20, 0.1)');
  grad.addColorStop(0.6, 'rgba(230, 205, 155, 0.85)');
  grad.addColorStop(0.95, 'rgba(160, 130, 80, 0.4)');
  grad.addColorStop(1.0, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createUranusTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#82e2f0');
  grad.addColorStop(0.5, '#56c2d4');
  grad.addColorStop(1, '#70d6e3');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createNeptuneTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#1a4099');
  grad.addColorStop(0.5, '#2b5ce6');
  grad.addColorStop(1, '#163680');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    ctx.fillRect(x, y, 120, 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createPlutoTexture() {
  const { canvas, ctx } = createCanvas(1024, 512);
  ctx.fillStyle = '#bfa58e';
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = '#f0e6df';
  ctx.beginPath();
  ctx.arc(450, 260, 60, 0, Math.PI * 2);
  ctx.arc(520, 260, 60, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
