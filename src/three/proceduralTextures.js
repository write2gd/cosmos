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
  const { canvas, ctx } = createCanvas(2048, 1024);
  
  const centerX = 1024;
  const centerY = 512;
  const maxRadius = 850;
  
  // Multi-stage radial gradient for photosphere
  const radialGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
  radialGrad.addColorStop(0, '#ffffff');      // Bright white core
  radialGrad.addColorStop(0.15, '#fffacd');   // Lemon white
  radialGrad.addColorStop(0.3, '#ffff99');    // Yellow-white
  radialGrad.addColorStop(0.5, '#ffdd44');    // Bright golden
  radialGrad.addColorStop(0.7, '#ffaa22');    // Golden orange
  radialGrad.addColorStop(0.9, '#ff6600');    // Deep orange
  radialGrad.addColorStop(1, '#cc3300');      // Intense edge red
  
  ctx.fillStyle = radialGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Enhanced solar granulation - multiple layers for depth
  ctx.globalAlpha = 0.25;
  for (let i = 0; i < 12000; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const size = Math.random() * 5 + 0.5;
    const brightness = Math.random();
    if (brightness > 0.8) {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
    } else if (brightness > 0.5) {
      ctx.fillStyle = 'rgba(255,250,150,0.5)';
    } else {
      ctx.fillStyle = 'rgba(150,100,20,0.4)';
    }
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
  
  // Dense sunspots with realistic patterns
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 25; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 450;
    const spotX = centerX + Math.cos(angle) * distance;
    const spotY = centerY + Math.sin(angle) * distance;
    const spotSize = Math.random() * 100 + 40;
    
    // Umbra (dark spot core)
    ctx.fillStyle = 'rgba(20,5,0,0.9)';
    ctx.beginPath();
    ctx.arc(spotX, spotY, spotSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    // Penumbra (lighter transition area)
    ctx.fillStyle = 'rgba(60,20,0,0.6)';
    ctx.beginPath();
    ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Spot halo (magnetic field effect)
    ctx.fillStyle = 'rgba(100,50,0,0.2)';
    ctx.beginPath();
    ctx.arc(spotX, spotY, spotSize * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
  
  // Solar flares and prominences
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = 'rgba(255,100,0,0.5)';
  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const baseDistance = maxRadius - 100;
    const flareX = centerX + Math.cos(angle) * baseDistance;
    const flareY = centerY + Math.sin(angle) * baseDistance;
    const flareWidth = 60 + Math.random() * 100;
    const flareHeight = 150 + Math.random() * 200;
    
    ctx.save();
    ctx.translate(flareX, flareY);
    ctx.rotate(angle);
    ctx.fillRect(-flareWidth / 2, 0, flareWidth, flareHeight);
    ctx.restore();
  }
  ctx.globalAlpha = 1.0;
  
  // Chromosphere glow effect
  const chromosphereGrad = ctx.createRadialGradient(centerX, centerY, maxRadius * 0.8, centerX, centerY, maxRadius * 1.2);
  chromosphereGrad.addColorStop(0, 'rgba(255,50,0,0.3)');
  chromosphereGrad.addColorStop(0.5, 'rgba(255,100,20,0.15)');
  chromosphereGrad.addColorStop(1, 'rgba(255,200,100,0)');
  ctx.fillStyle = chromosphereGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius * 1.2, 0, Math.PI * 2);
  ctx.fill();
  
  // Intense bright highlights for photorealism
  ctx.globalAlpha = 0.7;
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const r = Math.random() * 4 + 0.5;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
  
  // Limb darkening effect (realistic edge darkening)
  const limbGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 1.15);
  limbGrad.addColorStop(0, 'rgba(0,0,0,0)');
  limbGrad.addColorStop(0.85, 'rgba(0,0,0,0.1)');
  limbGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = limbGrad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius * 1.15, 0, Math.PI * 2);
  ctx.fill();

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
  
  // Deep realistic ocean blue
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
  oceanGrad.addColorStop(0, '#0a1f3f');      // Deep blue poles
  oceanGrad.addColorStop(0.25, '#0d47a1');   // Dark blue
  oceanGrad.addColorStop(0.5, '#1565c0');    // Deep ocean blue
  oceanGrad.addColorStop(0.75, '#0d47a1');   // Dark blue
  oceanGrad.addColorStop(1, '#0a1f3f');      // Deep blue poles
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 2048, 1024);

  // Simplified realistic continents - approximate actual landmass positions
  const continents = [
    // North America
    { x: 400, y: 320, rx: 180, ry: 140, color: '#2d5016' },
    // South America
    { x: 550, y: 580, rx: 100, ry: 120, color: '#3d6b1f' },
    // Europe & Africa
    { x: 1050, y: 400, rx: 200, ry: 180, color: '#38761d' },
    // Russia & Asia
    { x: 1300, y: 250, rx: 280, ry: 150, color: '#2d5016' },
    // Australia
    { x: 1600, y: 650, rx: 90, ry: 100, color: '#8b6914' },
    // Greenland
    { x: 550, y: 100, rx: 60, ry: 100, color: '#1a3a1a' },
  ];

  continents.forEach((continent) => {
    ctx.beginPath();
    ctx.ellipse(continent.x, continent.y, continent.rx, continent.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = continent.color;
    ctx.fill();
    
    // Add some land variation
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * continent.rx * 0.6;
      const x = continent.x + Math.cos(angle) * dist;
      const y = continent.y + Math.sin(angle) * dist;
      const size = Math.random() * 20 + 10;
      ctx.fillStyle = '#4e342e';  // Brown mountain shadows
      ctx.beginPath();
      ctx.ellipse(x, y, size * 0.8, size * 0.4, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  });

  // Polar ice caps - realistic white ice
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = '#f5f5f5';  // Slightly off-white ice
  ctx.beginPath();
  ctx.ellipse(1024, 60, 1024, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(1024, 964, 1024, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Cloud shadows (very subtle)
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#666666';
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const rx = 60 + Math.random() * 150;
    const ry = 30 + Math.random() * 60;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // Ocean depth variation (subtle)
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const size = Math.random() * 8 + 2;
    ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createEarthCloudsTexture() {
  const { canvas, ctx } = createCanvas(2048, 1024);
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, 2048, 1024);

  // Realistic cloud patterns with varying opacity
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  
  // Trade wind clouds (northeast pattern)
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 2048;
    const y = 400 + Math.random() * 300;
    const rx = 80 + Math.random() * 200;
    const ry = 20 + Math.random() * 40;
    ctx.globalAlpha = 0.4 + Math.random() * 0.4;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Cumulus clouds (scattered)
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const rx = 40 + Math.random() * 100;
    const ry = 30 + Math.random() * 80;
    ctx.globalAlpha = 0.3 + Math.random() * 0.5;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.random(), 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Hurricane/storm clouds (darker, denser)
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = 'rgba(200,200,200,0.6)';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 2048;
    const y = Math.random() * 1024;
    const size = 50 + Math.random() * 120;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.globalAlpha = 1.0;

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
