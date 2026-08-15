import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CELESTIAL_BODIES } from '../data/celestialData';
import {
  createSunTexture,
  createMercuryTexture,
  createVenusTexture,
  createEarthTexture,
  createEarthCloudsTexture,
  createMoonTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingsTexture,
  createUranusTexture,
  createNeptuneTexture,
  createPlutoTexture
} from '../three/proceduralTextures';

function cubicEaseInOut(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Galactic Center Offset — positioned so Sun at (0,0,0) lies inside the outer Orion arm
const GALACTIC_CENTER = new THREE.Vector3(600, 20, 400);
// Solar System position within the Milky Way (Orion arm, ~26,000 ly from center)
// In scene units: offset from galactic center along an arm, scaled to look embedded in arm
const SOLAR_SYSTEM_POSITION = new THREE.Vector3(200, -50, 150);
// Andromeda Center Offset — positioned far away in another quadrant of deep space
const ANDROMEDA_CENTER = new THREE.Vector3(-1800, 400, -1500);

// A. Soft glowing star particle texture (removes hard retro square points)
function createCircularParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// B. Large soft nebula gas particle texture (blends overlapping points into volumetric clouds)
function createNebulaParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.22)');
  grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// C. Soft volumetric core glow sprite (volumetric center haze instead of hard billiard ball meshes)
function createGlowSprite(colorStr, size, opacity) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, colorStr);
  grad.addColorStop(0.25, colorStr);
  const c = new THREE.Color(colorStr);
  const r = Math.floor(c.r * 255);
  const g = Math.floor(c.g * 255);
  const b = Math.floor(c.b * 255);
  grad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, 0.15)`);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({
    map: texture,
    color: 0xffffff,
    transparent: true,
    opacity: opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(size, size, 1);
  return sprite;
}

// D. Soft accretion disk texture for Sagittarius A* (orange dust)
function createMilkyWayAccretionDiskTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 25, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255, 153, 0, 0)');
  grad.addColorStop(0.18, 'rgba(255, 153, 0, 0.9)');
  grad.addColorStop(0.4, 'rgba(255, 170, 34, 0.45)');
  grad.addColorStop(0.75, 'rgba(255, 120, 0, 0.15)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// E. Soft accretion disk texture for Andromeda (violet-blue dust)
function createAndromedaAccretionDiskTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 30, 128, 128, 128);
  grad.addColorStop(0, 'rgba(129, 140, 248, 0)');
  grad.addColorStop(0.18, 'rgba(129, 140, 248, 0.9)');
  grad.addColorStop(0.4, 'rgba(196, 181, 253, 0.4)');
  grad.addColorStop(0.75, 'rgba(139, 92, 246, 0.12)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function CosmosCanvas({
  selectedBodyId,
  onSelectBody,
  onClickBodyInScene,
  isRealisticScale,
  timeSpeed,
  isPaused,
  showOrbits,
  observeFromPlanetId
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const meshesRef = useRef({});
  const orbitsRef = useRef([]);
  const solarSystemGroupRef = useRef(null);

  const [hoverInfo, setHoverInfo] = useState(null);
  const deepSpaceInteractablesRef = useRef([]);

  const selectedBodyIdRef = useRef(selectedBodyId);
  const isRealisticScaleRef = useRef(isRealisticScale);
  const timeSpeedRef = useRef(timeSpeed);
  const isPausedRef = useRef(isPaused);
  const observeFromPlanetIdRef = useRef(observeFromPlanetId);

  const flightStateRef = useRef({
    isAnimating: false,
    startTime: 0,
    duration: 3.5,
    startCamPos: new THREE.Vector3(),
    startTargetPos: new THREE.Vector3(),
    midCamPos: new THREE.Vector3(),
    targetBodyId: selectedBodyId
  });

  useEffect(() => {
    const prevTargetId = selectedBodyIdRef.current;
    selectedBodyIdRef.current = selectedBodyId;

    if (
      prevTargetId !== selectedBodyId &&
      cameraRef.current &&
      controlsRef.current &&
      meshesRef.current
    ) {
      startCinematicFlight(selectedBodyId);
    }
  }, [selectedBodyId]);

  useEffect(() => {
    isRealisticScaleRef.current = isRealisticScale;
  }, [isRealisticScale]);

  useEffect(() => {
    timeSpeedRef.current = timeSpeed;
  }, [timeSpeed]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    observeFromPlanetIdRef.current = observeFromPlanetId;
    
    // Hide/show observation planet's mesh, but keep its moons visible
    const bodyMeshes = meshesRef.current;
    if (bodyMeshes) {
      // Show all planets and moons first
      Object.keys(bodyMeshes).forEach((id) => {
        if (bodyMeshes[id] && bodyMeshes[id].mesh) {
          bodyMeshes[id].mesh.visible = true;
        }
      });
      
      // Hide only the observation planet, keep its moons visible
      if (observeFromPlanetId && bodyMeshes[observeFromPlanetId]) {
        bodyMeshes[observeFromPlanetId].mesh.visible = false;
      }
    }
  }, [observeFromPlanetId]);

  const startCinematicFlight = (targetId) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const bodyMeshes = meshesRef.current;
    if (!camera || !controls) return;

    let targetWorldPos = new THREE.Vector3(0, 0, 0);
    let offsetDist = 25;

    if (targetId === 'milkyway') {
      // Focus on Galactic Center Sagittarius A*
      const gScale = isRealisticScaleRef.current ? 30 : 1;
      targetWorldPos.copy(GALACTIC_CENTER).multiplyScalar(gScale);
      offsetDist = 3800 * gScale; // Pull back far enough to view the entire galaxy with Solar System inside arm
    } else if (targetId === 'andromeda') {
      // Focus on Andromeda Center core
      const gScale = isRealisticScaleRef.current ? 30 : 1;
      targetWorldPos.copy(ANDROMEDA_CENTER).multiplyScalar(gScale);
      offsetDist = 3800 * 1.5 * gScale; // Pull back further since Andromeda is 1.5x larger
    } else if (bodyMeshes[targetId]) {
      const selectedObj = bodyMeshes[targetId].mesh;
      selectedObj.getWorldPosition(targetWorldPos);

      const bodyData = bodyMeshes[targetId].bodyData;
      const radius = isRealisticScaleRef.current
        ? Math.max(0.2, bodyData.realRadius / 15000)
        : bodyData.visualRadius;

      offsetDist = radius * 3.5 + 5;
    }

    const startCamPos = camera.position.clone();
    const startTargetPos = controls.target.clone();

    const dist = startCamPos.distanceTo(targetWorldPos);
    const duration = Math.min(5.0, Math.max(2.8, dist * 0.0015));

    const midCamPos = startCamPos.clone().add(targetWorldPos).multiplyScalar(0.5);
    const arcHeight = Math.min(500, dist * 0.25);
    midCamPos.y += arcHeight;

    flightStateRef.current = {
      isAnimating: true,
      startTime: performance.now(),
      duration,
      startCamPos,
      startTargetPos,
      midCamPos,
      targetBodyId: targetId
    };
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x030308, 0.00008);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 20000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.maxDistance = 15000;
    controls.minDistance = 1.2;

    // 3. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffffff, 3.5, 4500, 0.1);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // 4. PROCEDURAL TEXTURES INITIALIZATION
    const textures = {
      sun: createSunTexture(),
      mercury: createMercuryTexture(),
      venus: createVenusTexture(),
      earth: createEarthTexture(),
      earthClouds: createEarthCloudsTexture(),
      moon: createMoonTexture(),
      mars: createMarsTexture(),
      jupiter: createJupiterTexture(),
      saturn: createSaturnTexture(),
      saturnRings: createSaturnRingsTexture(),
      uranus: createUranusTexture(),
      neptune: createNeptuneTexture(),
      pluto: createPlutoTexture()
    };

    // 5. DEEP SPACE STARFIELD & EMBEDDED GALAXIES (MILKY WAY, ANDROMEDA, TRIANGULUM, DWARFS & NEBULAE)
    createStarfield(scene);
    const galaxyGroup = createMilkyWayGalaxy(scene);
    const andromedaGroup = createAndromedaGalaxy(scene);
    const triangulumGroup = createTriangulumGalaxy(scene);
    const deepSpaceInteractables = [];
    deepSpaceInteractables.push(...createDwarfGalaxies(scene));
    deepSpaceInteractables.push(...createNebulaFilaments(scene));

    // Scale galaxies so they always dwarf the solar system in both scale modes
    if (isRealisticScale) {
      const galaxyScale = 30;
      galaxyGroup.scale.setScalar(galaxyScale);
      galaxyGroup.position.copy(GALACTIC_CENTER).multiplyScalar(galaxyScale);

      const andromedaScale = 30 * 1.5;
      andromedaGroup.scale.setScalar(andromedaScale);
      andromedaGroup.position.copy(ANDROMEDA_CENTER).multiplyScalar(30);
    } else {
      andromedaGroup.scale.setScalar(1.5);
      andromedaGroup.position.copy(ANDROMEDA_CENTER);
    }

    // 6. BUILD CELESTIAL BODIES
    const bodyMeshes = {};
    const orbitLines = [];

    // Create a galactic-orbit pivot so the solar system revolves around the galactic center
    // in BOTH visual and realistic modes.
    const galacticOrbitPivot = new THREE.Group();
    if (isRealisticScale) {
      // Realistic: pivot sits at galactic center (scaled), solar system at arm offset
      galacticOrbitPivot.position.copy(GALACTIC_CENTER).multiplyScalar(30);
    } else {
      // Visual: pivot sits at galactic center in scene space
      galacticOrbitPivot.position.copy(GALACTIC_CENTER);
    }
    scene.add(galacticOrbitPivot);

    // Create a container group for the entire solar system
    const solarSystemGroup = new THREE.Group();
    if (isRealisticScale) {
      // Place solar system offset from galactic center inside the Orion arm
      solarSystemGroup.position.copy(SOLAR_SYSTEM_POSITION);
      galacticOrbitPivot.add(solarSystemGroup);
    } else {
      // Visual: solar system stays at its original world position (0,0,0).
      // Since the pivot is at GALACTIC_CENTER, offset by -GALACTIC_CENTER so
      // the world position is exactly (0,0,0) — preserving the original distance
      // from the galaxy — while the pivot rotation makes it orbit the center.
      solarSystemGroup.position.copy(GALACTIC_CENTER).negate();
      galacticOrbitPivot.add(solarSystemGroup);
    }
    solarSystemGroupRef.current = solarSystemGroup;
    // Store galactic pivot on the solarSystemGroup so the animate loop can reach it
    solarSystemGroup.userData.galacticOrbitPivot = galacticOrbitPivot;

    CELESTIAL_BODIES.forEach((body) => {
      const radius = isRealisticScale ? Math.max(0.2, body.realRadius / 15000) : body.visualRadius;
      const distance = isRealisticScale ? body.realDistance * 1.2 : body.visualDistance;

      const orbitGroup = new THREE.Group();
      // Always add to solarSystemGroup (which is parented to galacticOrbitPivot)
      solarSystemGroup.add(orbitGroup);

      let mesh;

      if (body.id === 'sun') {
        const sunGeo = new THREE.SphereGeometry(radius, 64, 64);
        const sunMat = new THREE.MeshBasicMaterial({ map: textures.sun });
        mesh = new THREE.Mesh(sunGeo, sunMat);

        const coronaGeo = new THREE.SphereGeometry(radius * 1.2, 32, 32);
        const coronaMat = new THREE.MeshBasicMaterial({
          color: 0xffaa00,
          transparent: true,
          opacity: 0.35,
          side: THREE.BackSide
        });
        mesh.add(new THREE.Mesh(coronaGeo, coronaMat));

      } else {
        const geo = new THREE.SphereGeometry(radius, 48, 48);
        const bodyTexture = textures[body.id] || textures[body.parentBodyId] || textures.mercury;

        const mat = new THREE.MeshStandardMaterial({
          map: bodyTexture,
          roughness: 0.6,
          metalness: 0.1
        });

        mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (body.id === 'earth') {
          const cloudsGeo = new THREE.SphereGeometry(radius * 1.02, 48, 48);
          const cloudsMat = new THREE.MeshStandardMaterial({
            map: textures.earthClouds,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending
          });
          const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
          mesh.add(cloudsMesh);
          mesh.userData.cloudsMesh = cloudsMesh;

          const nightGeo = new THREE.SphereGeometry(radius * 1.04, 48, 48);
          const nightMat = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            uniforms: {
              sunDirection: { value: new THREE.Vector3(1, 0, 0) },
              tintColor: { value: new THREE.Color(0x0a1d38) }
            },
            vertexShader: `
              varying vec3 vNormal;
              void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `,
            fragmentShader: `
              uniform vec3 sunDirection;
              uniform vec3 tintColor;
              varying vec3 vNormal;
              void main() {
                float sunAmount = clamp(dot(normalize(sunDirection), normalize(vNormal)), 0.0, 1.0);
                float darkness = 1.0 - sunAmount;
                float alpha = darkness * 0.9;
                vec3 color = tintColor * (0.2 + darkness * 0.8);
                gl_FragColor = vec4(color, alpha);
              }
            `
          });
          const nightMesh = new THREE.Mesh(nightGeo, nightMat);
          nightMesh.renderOrder = 2;
          mesh.add(nightMesh);
          mesh.userData.nightMesh = nightMesh;

          const atmosGeo = new THREE.SphereGeometry(radius * 1.12, 32, 32);
          const atmosMat = new THREE.MeshBasicMaterial({
            color: 0x41a0ff,
            transparent: true,
            opacity: 0.25,
            side: THREE.BackSide
          });
          mesh.add(new THREE.Mesh(atmosGeo, atmosMat));
        }

        if (body.hasRings) {
          const innerR = body.ringInnerRadius || radius * 1.4;
          const outerR = body.ringOuterRadius || radius * 2.4;
          const ringGeo = new THREE.RingGeometry(innerR, outerR, 64);

          const pos = ringGeo.attributes.position;
          const uv = ringGeo.attributes.uv;
          for (let i = 0; i < pos.count; i++) {
            const vx = pos.getX(i);
            const vy = pos.getY(i);
            const r = Math.sqrt(vx * vx + vy * vy);
            uv.setXY(i, (r - innerR) / (outerR - innerR), 0.5);
          }

          const ringMat = new THREE.MeshStandardMaterial({
            map: textures.saturnRings,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
            roughness: 0.5
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2;
          ringMesh.receiveShadow = true;
          mesh.add(ringMesh);
        }
      }

      if (body.tilt) {
        mesh.rotation.z = THREE.MathUtils.degToRad(body.tilt);
      }

      if (body.type === 'moon' && body.parentBodyId && bodyMeshes[body.parentBodyId]) {
        const parentMesh = bodyMeshes[body.parentBodyId].mesh;
        const moonPivot = new THREE.Group();
        parentMesh.add(moonPivot);
        // In realistic scale, ensure the moon doesn't overlap its parent body.
        // The parent's rendered radius may be close to or larger than the moon's orbit distance.
        let moonDistance = distance;
        if (isRealisticScale) {
          const parentBody = bodyMeshes[body.parentBodyId].bodyData;
          const parentRadius = Math.max(0.2, parentBody.realRadius / 15000);
          const minDist = parentRadius + radius + 0.3; // parent surface + moon radius + gap
          moonDistance = Math.max(moonDistance, minDist);
        }
        mesh.position.set(moonDistance, 0, 0);
        moonPivot.add(mesh);
        bodyMeshes[body.id] = { mesh, pivot: moonPivot, bodyData: body };
      } else {
        mesh.position.set(distance, 0, 0);
        orbitGroup.add(mesh);

        if (distance > 0) {
          const points = [];
          const segments = 128;
          for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(theta) * distance, 0, Math.sin(theta) * distance));
          }
          const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);
          const orbitMat = new THREE.LineBasicMaterial({
            color: new THREE.Color(body.color),
            transparent: true,
            opacity: showOrbits ? 0.35 : 0
          });
          const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
          solarSystemGroup.add(orbitLine);
          orbitLines.push(orbitLine);
        }

        bodyMeshes[body.id] = { mesh, orbitGroup, bodyData: body };
      }

      mesh.userData = { bodyId: body.id, bodyData: body };
    });

    meshesRef.current = bodyMeshes;
    orbitsRef.current = orbitLines;
    deepSpaceInteractablesRef.current = deepSpaceInteractables;

    // 7. ASTEROID BELT
    const asteroidMesh = createAsteroidBelts(solarSystemGroup, isRealisticScale);

    const updateEarthNightTint = () => {
      const earthMesh = bodyMeshes['earth']?.mesh;
      const sunMesh = bodyMeshes['sun']?.mesh;
      if (!earthMesh || !sunMesh) return;

      const sunWorldPos = new THREE.Vector3();
      sunMesh.getWorldPosition(sunWorldPos);
      const localSunDirection = earthMesh.worldToLocal(sunWorldPos.clone()).normalize();
      const nightMesh = earthMesh.userData.nightMesh;
      if (nightMesh && nightMesh.material && nightMesh.material.uniforms) {
        nightMesh.material.uniforms.sunDirection.value.copy(localSunDirection);
      }
    };

    // Initial Camera Setup (Earth) — use world position since solar system is now inside galactic pivot
    if (bodyMeshes['earth']) {
      const earthMesh = bodyMeshes['earth'].mesh;
      // Force matrix update so world position is correct even before first frame
      galacticOrbitPivot.updateMatrixWorld(true);
      const worldPos = new THREE.Vector3();
      earthMesh.getWorldPosition(worldPos);
      controls.target.copy(worldPos);
      camera.position.set(worldPos.x + 8, worldPos.y + 4, worldPos.z + 14);
    }

    // 8. RAYCASTER LISTENERS
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedBody = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactables = [];
      Object.values(bodyMeshes).forEach((b) => interactables.push(b.mesh));
      interactables.push(...deepSpaceInteractablesRef.current);

      const intersects = raycaster.intersectObjects(interactables, true);

      if (intersects.length > 0) {
        let hitObject = intersects[0].object;
        while (hitObject && (!hitObject.userData || !hitObject.userData.bodyId)) {
          hitObject = hitObject.parent;
        }

        if (hitObject && hitObject.userData && hitObject.userData.bodyId) {
          return hitObject.userData.bodyData;
        }
      }
      return null;
    };

    const handlePointerMove = (event) => {
      const hitBody = getIntersectedBody(event);
      if (hitBody) {
        renderer.domElement.style.cursor = 'pointer';
        setHoverInfo({
          name: hitBody.name,
          category: hitBody.category,
          color: hitBody.color,
          x: event.clientX,
          y: event.clientY
        });
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoverInfo(null);
      }
    };

    const handlePointerDown = (event) => {
      if (event.target !== renderer.domElement) return;
      const hitBody = getIntersectedBody(event);
      if (hitBody) {
        // Open info board when clicking on object
        if (onClickBodyInScene) {
          onClickBodyInScene(hitBody.id);
        }
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 9. ANIMATION LOOP WITH CINEMATIC FLIGHT & GALAXY ROTATION
    let animationFrameId;
    let clock = new THREE.Clock();

    // Galactic orbit speed: ~225 million years per orbit → very slow visual rotation
    const GALACTIC_ORBIT_SPEED = 0.0004; // radians per second (completes one loop in ~4 hours real time)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const currentSpeed = isPausedRef.current ? 0 : timeSpeedRef.current;
      const currentSelectedId = selectedBodyIdRef.current;
      const flightState = flightStateRef.current;

      // Slow majestic galaxy disc rotation (spin in place)
      if (galaxyGroup) {
        galaxyGroup.rotation.y += delta * 0.0015;
      }
      if (andromedaGroup) {
        andromedaGroup.rotation.y += delta * 0.0012;
      }

      // Solar system orbits the galactic center in BOTH visual and realistic modes
      const galacticPivot = solarSystemGroupRef.current?.userData?.galacticOrbitPivot;
      if (galacticPivot) {
        galacticPivot.rotation.y += delta * GALACTIC_ORBIT_SPEED;
      }

      // Rotate planets
      Object.values(bodyMeshes).forEach(({ mesh, orbitGroup, pivot, bodyData }) => {
        mesh.rotation.y += bodyData.rotationSpeed * (currentSpeed > 0 ? currentSpeed * 0.5 : 1);

        if (mesh.userData.cloudsMesh) {
          mesh.userData.cloudsMesh.rotation.y += 0.002 * (currentSpeed > 0 ? currentSpeed : 1);
        }

        if (bodyData.orbitalPeriod > 0 && currentSpeed > 0) {
          const angleDelta = (delta * (365 / bodyData.orbitalPeriod) * currentSpeed * 0.05);
          if (orbitGroup) orbitGroup.rotation.y += angleDelta;
          if (pivot) pivot.rotation.y += angleDelta * 2;
        }
      });

      updateEarthNightTint();

      if (asteroidMesh) {
        asteroidMesh.rotation.y += delta * 0.01 * (currentSpeed > 0 ? currentSpeed * 0.2 : 1);
        
        // Update asteroid brightness based on proximity to selected body
        if (currentSelectedId && bodyMeshes[currentSelectedId]) {
          const selectedMesh = bodyMeshes[currentSelectedId].mesh;
          const selectedWorldPos = new THREE.Vector3();
          selectedMesh.getWorldPosition(selectedWorldPos);
          
          const asteroidPositions = asteroidMesh.userData.asteroidPositions;
          const proximityRadius = 50;  // Distance for brightness effect
          let hasCloseAsteroid = false;
          
          if (asteroidPositions) {
            for (let i = 0; i < asteroidPositions.length; i++) {
              const astroWorldPos = asteroidPositions[i].clone();
              if (solarSystemGroupRef.current) {
                astroWorldPos.applyMatrix4(solarSystemGroupRef.current.matrixWorld);
              }
              
              const distance = selectedWorldPos.distanceTo(astroWorldPos);
              if (distance < proximityRadius) {
                hasCloseAsteroid = true;
                // Randomly brighten asteroids close to the planet
                if (Math.random() < 0.3) {
                  asteroidMesh.userData.asteroidBrightness[i] = 1;
                }
              } else {
                // Fade out brightness for distant asteroids
                asteroidMesh.userData.asteroidBrightness[i] *= 0.95;
              }
            }
          }
          
          // Update material emissive based on proximity
          if (hasCloseAsteroid) {
            asteroidMesh.material.emissive.setHex(0xffaa44);
            asteroidMesh.material.emissiveIntensity = 0.4;
          } else {
            asteroidMesh.material.emissive.setHex(0x111111);
            asteroidMesh.material.emissiveIntensity = 0.1;
          }
        }
      }

      // Geocentric View Logic - keep observation planet at center
      const observePlanetId = observeFromPlanetIdRef.current;
      if (observePlanetId && bodyMeshes[observePlanetId] && solarSystemGroupRef.current) {
        const observePlanetMesh = bodyMeshes[observePlanetId].mesh;
        const worldPos = new THREE.Vector3();
        observePlanetMesh.getWorldPosition(worldPos);
        
        // Apply negative offset to keep planet at origin (realistic mode only)
        const offset = worldPos.clone().multiplyScalar(-1);
        if (isRealisticScaleRef.current) {
          solarSystemGroupRef.current.position.add(offset.multiplyScalar(0.05));
        }
      } else if (solarSystemGroupRef.current && isRealisticScaleRef.current) {
        // Return to arm-offset position when geocentric view is off
        const targetPos = SOLAR_SYSTEM_POSITION.clone();
        solarSystemGroupRef.current.position.lerp(targetPos, 0.05);
      }

      // Camera Flight interpolation
      if (currentSelectedId) {
        let targetWorldPos = new THREE.Vector3(0, 0, 0);
        let offsetDist = 25;

        if (currentSelectedId === 'milkyway') {
          const gScale = isRealisticScaleRef.current ? 30 : 1;
          targetWorldPos.copy(GALACTIC_CENTER).multiplyScalar(gScale);
          offsetDist = 3800 * gScale;
        } else if (currentSelectedId === 'andromeda') {
          const gScale = isRealisticScaleRef.current ? 30 : 1;
          targetWorldPos.copy(ANDROMEDA_CENTER).multiplyScalar(gScale);
          offsetDist = 3800 * 1.5 * gScale;
        } else if (currentSelectedId === 'triangulum') {
          const gScale = isRealisticScaleRef.current ? 30 : 1;
          const triangulumPos = ANDROMEDA_CENTER.clone().add(new THREE.Vector3(800, 200, -300));
          targetWorldPos.copy(triangulumPos).multiplyScalar(gScale);
          offsetDist = 2500 * gScale;
        } else if (bodyMeshes[currentSelectedId]) {
          const selectedObj = bodyMeshes[currentSelectedId].mesh;
          selectedObj.getWorldPosition(targetWorldPos);

          const bodyData = bodyMeshes[currentSelectedId].bodyData;
          const radius = isRealisticScaleRef.current
            ? Math.max(0.2, bodyData.realRadius / 15000)
            : bodyData.visualRadius;

          // In geocentric view, position camera higher above the planet surface
          if (observePlanetId === currentSelectedId && isRealisticScaleRef.current) {
            offsetDist = radius * 8 + 15;  // Higher altitude view
          } else {
            offsetDist = radius * 3.5 + 5;
          }
        }

        if (flightState.isAnimating) {
          const elapsedTime = (performance.now() - flightState.startTime) / 1000;
          const progress = Math.min(1.0, elapsedTime / flightState.duration);
          const easedProgress = cubicEaseInOut(progress);

          controls.target.lerpVectors(flightState.startTargetPos, targetWorldPos, easedProgress);

          const finalCamOffset = camera.position.clone().sub(controls.target);
          if (finalCamOffset.length() === 0) finalCamOffset.set(0, 800, 1800);
          finalCamOffset.normalize().multiplyScalar(offsetDist);
          const endCamPos = targetWorldPos.clone().add(finalCamOffset);

          const t = easedProgress;
          const p0 = flightState.startCamPos;
          const p1 = flightState.midCamPos;
          const p2 = endCamPos;

          camera.position.x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
          camera.position.y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
          camera.position.z = Math.pow(1 - t, 2) * p0.z + 2 * (1 - t) * t * p1.z + Math.pow(t, 2) * p2.z;

          if (progress >= 1.0) {
            flightState.isAnimating = false;
          }
        } else {
          const camDir = camera.position.clone().sub(controls.target);
          if (camDir.length() === 0) camDir.set(0, 4, 12);
          camDir.normalize().multiplyScalar(offsetDist);
          const desiredCamPos = targetWorldPos.clone().add(camDir);

          controls.target.lerp(targetWorldPos, 0.04);
          camera.position.lerp(desiredCamPos, 0.04);
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRealisticScale]);

  useEffect(() => {
    if (orbitsRef.current) {
      orbitsRef.current.forEach((line) => {
        line.visible = showOrbits;
      });
    }
  }, [showOrbits]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab'
        }}
      />

      {/* Hover Tooltip Badge */}
      {hoverInfo && (
        <div
          className="glass-panel"
          style={{
            position: 'fixed',
            top: hoverInfo.y + 15,
            left: hoverInfo.x + 15,
            zIndex: 30,
            pointerEvents: 'none',
            padding: '6px 12px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.6)'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: hoverInfo.color }} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{hoverInfo.name}</div>
            <div style={{ fontSize: '9px', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {hoverInfo.category}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 1. DEEP SPACE STARFIELD
function createStarfield(scene) {
  const starCount = 15000;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const colors = [new THREE.Color(0xffffff), new THREE.Color(0x88bbff), new THREE.Color(0xffddaa), new THREE.Color(0xffaacc)];

  for (let i = 0; i < starCount; i++) {
    const r = 1500 + Math.random() * 9000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);

    const c = colors[Math.floor(Math.random() * colors.length)];
    starColors[i * 3] = c.r;
    starColors[i * 3 + 1] = c.g;
    starColors[i * 3 + 2] = c.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 5.5,
    map: createCircularParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false
  });
  scene.add(new THREE.Points(starGeo, starMat));
}

// 2. MILKY WAY GALAXY (POSITIONED SO SOLAR SYSTEM AT (0,0,0) LIES INSIDE THE ORION SPIRAL ARM)
function createMilkyWayGalaxy(scene) {
  const galaxyGroup = new THREE.Group();
  galaxyGroup.position.copy(GALACTIC_CENTER);
  galaxyGroup.rotation.x = Math.PI * 0.15; // Realistic tilted galaxy disc

  // A. Sagittarius A* Black Hole Core
  const coreGeo = new THREE.SphereGeometry(15, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);

  // Accretion Disk
  const accretionGeo = new THREE.PlaneGeometry(500, 500);
  const accretionMat = new THREE.MeshBasicMaterial({
    map: createMilkyWayAccretionDiskTexture(),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const accretionRing = new THREE.Mesh(accretionGeo, accretionMat);
  accretionRing.rotation.x = Math.PI / 2;
  coreMesh.add(accretionRing);

  // Volumetric core glow sprite
  const coreGlow = createGlowSprite('#ff9900', 450, 0.85);
  coreMesh.add(coreGlow);

  galaxyGroup.add(coreMesh);

  // B. Logarithmic 4-Arm Spiral Stars (120,000 particles — dense arms)
  const starCount = 120000;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const innerColor = new THREE.Color(0xffeeaa);
  const armColor = new THREE.Color(0x4499ff);
  const outerColor = new THREE.Color(0x9944ee);

  const arms = 4;
  const a = 60;
  const b = 0.18;

  for (let i = 0; i < starCount; i++) {
    const isCore = Math.random() < 0.22;

    let r, theta, y;
    if (isCore) {
      r = Math.pow(Math.random(), 2.5) * 450;
      theta = Math.random() * Math.PI * 2;
      y = (Math.random() - 0.5) * (280 - (r / 450) * 200);
    } else {
      const armIdx = i % arms;
      const armAngle = (armIdx * Math.PI * 2) / arms;
      const t = Math.random() * Math.PI * 4.8;
      r = a * Math.exp(b * t);
      const armSpread = 40 + r * 0.12;
      r += (Math.random() - 0.5) * armSpread;
      theta = armAngle + t + (Math.random() - 0.5) * (100 / (r + 80));
      y = (Math.random() - 0.5) * (100 * Math.exp(-r / 2000) + 10);
    }

    starPos[i * 3] = Math.cos(theta) * r;
    starPos[i * 3 + 1] = y;
    starPos[i * 3 + 2] = Math.sin(theta) * r;

    let mixedColor;
    if (r < 350) {
      mixedColor = innerColor.clone().lerp(armColor, r / 350);
    } else {
      mixedColor = armColor.clone().lerp(outerColor, Math.min(1.0, (r - 350) / 3000));
    }

    starColors[i * 3] = mixedColor.r;
    starColors[i * 3 + 1] = mixedColor.g;
    starColors[i * 3 + 2] = mixedColor.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 5.5,
    map: createCircularParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  galaxyGroup.add(new THREE.Points(starGeo, starMat));

  // C. Galactic Bulge Glow (warm dense center haze)
  const bulgeCount = 20000;
  const bulgeGeo = new THREE.BufferGeometry();
  const bulgePos = new Float32Array(bulgeCount * 3);
  const bulgeColors = new Float32Array(bulgeCount * 3);
  const bulgeWarm = new THREE.Color(0xffcc66);
  const bulgeHot = new THREE.Color(0xffffff);

  for (let i = 0; i < bulgeCount; i++) {
    const r = Math.pow(Math.random(), 3) * 350;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * (200 * (1 - r / 350) + 10);
    bulgePos[i * 3] = Math.cos(theta) * r;
    bulgePos[i * 3 + 1] = y;
    bulgePos[i * 3 + 2] = Math.sin(theta) * r;
    const c = bulgeHot.clone().lerp(bulgeWarm, r / 350);
    bulgeColors[i * 3] = c.r;
    bulgeColors[i * 3 + 1] = c.g;
    bulgeColors[i * 3 + 2] = c.b;
  }

  bulgeGeo.setAttribute('position', new THREE.BufferAttribute(bulgePos, 3));
  bulgeGeo.setAttribute('color', new THREE.BufferAttribute(bulgeColors, 3));

  const bulgeMat = new THREE.PointsMaterial({
    size: 10.0,
    map: createCircularParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  galaxyGroup.add(new THREE.Points(bulgeGeo, bulgeMat));

  // D. Interstellar Dust Nebulae (40,000 particles — dense arm dust lanes)
  const nebulaCount = 40000;
  const nebulaGeo = new THREE.BufferGeometry();
  const nebulaPos = new Float32Array(nebulaCount * 3);
  const nebulaColors = new Float32Array(nebulaCount * 3);

  const magentaNebula = new THREE.Color(0xff2299);
  const cyanNebula = new THREE.Color(0x00ddff);
  const warmNebula = new THREE.Color(0xff8844);

  for (let i = 0; i < nebulaCount; i++) {
    const armIdx = i % arms;
    const armAngle = (armIdx * Math.PI * 2) / arms;
    const t = Math.random() * Math.PI * 4.8;
    const baseR = a * Math.exp(b * t);
    const armSpread = 30 + baseR * 0.1;
    const r = baseR + (Math.random() - 0.5) * armSpread;
    const theta = armAngle + t + (Math.random() - 0.5) * 0.3;
    const y = (Math.random() - 0.5) * 60;

    nebulaPos[i * 3] = Math.cos(theta) * r;
    nebulaPos[i * 3 + 1] = y;
    nebulaPos[i * 3 + 2] = Math.sin(theta) * r;

    const pick = Math.random();
    const c = pick < 0.4 ? magentaNebula : pick < 0.75 ? cyanNebula : warmNebula;
    nebulaColors[i * 3] = c.r;
    nebulaColors[i * 3 + 1] = c.g;
    nebulaColors[i * 3 + 2] = c.b;
  }

  nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
  nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

  const nebulaMat = new THREE.PointsMaterial({
    size: 24.0,
    map: createNebulaParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  galaxyGroup.add(new THREE.Points(nebulaGeo, nebulaMat));

  scene.add(galaxyGroup);
  return galaxyGroup;
}

// 3. ANDROMEDA GALAXY (M31) - DISTANT LARGE SPIRAL GALAXY WITH DOUBLE CORE & RING OF FIRE
function createAndromedaGalaxy(scene) {
  const galaxyGroup = new THREE.Group();
  galaxyGroup.position.copy(ANDROMEDA_CENTER);
  
  // Realistically tilted and slanted disk relative to observer
  galaxyGroup.rotation.x = -Math.PI * 0.22;
  galaxyGroup.rotation.z = Math.PI * 0.08;

  // A. DOUBLE NUCLEUS STRUCTURE (Scientific Realism - Volumetric Glow instead of flat meshes)
  // P2: Central supermassive black hole core
  const p2Geo = new THREE.SphereGeometry(15, 32, 32);
  const p2Mat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const p2Mesh = new THREE.Mesh(p2Geo, p2Mat);

  // Soft violet-blue accretion disk (dusty, glowing radial texture)
  const accretionGeo = new THREE.PlaneGeometry(450, 450);
  const accretionMat = new THREE.MeshBasicMaterial({
    map: createAndromedaAccretionDiskTexture(),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const accretionRing = new THREE.Mesh(accretionGeo, accretionMat);
  accretionRing.rotation.x = Math.PI / 2;
  p2Mesh.add(accretionRing);

  // Soft glow sprite for P2 black hole center
  const p2Glow = createGlowSprite('#818cf8', 350, 0.9);
  p2Mesh.add(p2Glow);

  galaxyGroup.add(p2Mesh);

  // P1: Offset bright companion core (glowing sprite, no solid sphere)
  const p1Center = new THREE.Vector3(50, 8, 25);
  const p1Glow = createGlowSprite('#fef3c7', 280, 0.75); // warm cream-yellow glow
  p1Glow.position.copy(p1Center);
  galaxyGroup.add(p1Glow);

  // Custom dense star particle cluster specifically around the P1 core
  const p1Count = 5000;
  const p1StarsGeo = new THREE.BufferGeometry();
  const p1StarsPos = new Float32Array(p1Count * 3);
  const p1StarsColors = new Float32Array(p1Count * 3);
  const p1WarmColor = new THREE.Color(0xffeedb);

  for (let i = 0; i < p1Count; i++) {
    const r = Math.pow(Math.random(), 2.0) * 80;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    p1StarsPos[i * 3] = p1Center.x + r * Math.sin(phi) * Math.cos(theta);
    p1StarsPos[i * 3 + 1] = p1Center.y + r * Math.sin(phi) * Math.sin(theta);
    p1StarsPos[i * 3 + 2] = p1Center.z + r * Math.cos(phi);

    p1StarsColors[i * 3] = p1WarmColor.r;
    p1StarsColors[i * 3 + 1] = p1WarmColor.g;
    p1StarsColors[i * 3 + 2] = p1WarmColor.b;
  }
  p1StarsGeo.setAttribute('position', new THREE.BufferAttribute(p1StarsPos, 3));
  p1StarsGeo.setAttribute('color', new THREE.BufferAttribute(p1StarsColors, 3));
  const p1StarsMat = new THREE.PointsMaterial({
    size: 4.5,
    map: createCircularParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  galaxyGroup.add(new THREE.Points(p1StarsGeo, p1StarsMat));

  // B. 2-ARM LOGARITHMIC SPIRAL & RING OF FIRE STARS (200,000 particles for detail)
  const starCount = 200000;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const innerColor = new THREE.Color(0xfff7d0); // Cream yellow
  const armColor = new THREE.Color(0x38bdf8); // Cyan blue
  const outerColor = new THREE.Color(0x6366f1); // Indigo blue

  const arms = 2; // Andromeda is a 2-arm dominant spiral
  const a = 150;  // increased starting radius of the arms
  const b = 0.12; // Winding factor (looser wind for bigger arms)

  for (let i = 0; i < starCount; i++) {
    const isCore = Math.random() < 0.25; // 25% Bulge stars

    let r, theta, y;
    let mixedColor;

    if (isCore) {
      // bulgy core concentration (flattened spheroid)
      r = Math.pow(Math.random(), 2.2) * 350;
      theta = Math.random() * Math.PI * 2;
      y = (Math.random() - 0.5) * (200 - (r / 350) * 140) * 0.65;
      mixedColor = innerColor.clone().lerp(new THREE.Color(0xffffff), Math.random() * 0.5);
    } else {
      // Continuous Logarithmic arms spanning from 200 to 2000 units (much bigger)
      const armIdx = i % arms;
      const armAngle = (armIdx * Math.PI * 2) / arms;
      
      // Bias t to create higher inner density (density gradient)
      const t = Math.pow(Math.random(), 1.25) * Math.PI * 6.2;  // extended range
      const baseR = a * Math.exp(b * t);
      let armSpread = 100 + baseR * 0.25;  // wider arm spread
      
      let targetR = baseR + (Math.random() - 0.5) * armSpread;
      
      // Ring of Fire density enhancement around 1500 to 1900 units (outer arm)
      if (targetR > 1400 && targetR < 2000 && Math.random() < 0.45) {
        targetR = 1650 + (targetR - 1650) * 0.35; // compress towards ring core
      }

      r = targetR;
      theta = armAngle + t + (Math.random() - 0.5) * (120 / (r + 70));
      y = (Math.random() - 0.5) * (70 * Math.exp(-r / 2500) + 8);

      if (r < 350) {
        mixedColor = innerColor.clone().lerp(armColor, r / 350);
      } else {
        // Shift to hot blue in the Ring of Fire zone, and indigo on the outskirts
        const isRingZone = r > 1400 && r < 1900;
        const baseColor = isRingZone ? new THREE.Color(0xbae6fd) : armColor;
        mixedColor = baseColor.clone().lerp(outerColor, Math.min(1.0, (r - 350) / 2500));
      }
    }

    starPos[i * 3] = Math.cos(theta) * r;
    starPos[i * 3 + 1] = y;
    starPos[i * 3 + 2] = Math.sin(theta) * r;

    starColors[i * 3] = mixedColor.r;
    starColors[i * 3 + 1] = mixedColor.g;
    starColors[i * 3 + 2] = mixedColor.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 4.5,
    map: createCircularParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  galaxyGroup.add(new THREE.Points(starGeo, starMat));

  // C. DENSE BULGE GLOW (Soft volumetric particle haze - increased size)
  const bulgeCount = 35000;
  const bulgeGeo = new THREE.BufferGeometry();
  const bulgePos = new Float32Array(bulgeCount * 3);
  const bulgeColors = new Float32Array(bulgeCount * 3);
  const bulgeWarm = new THREE.Color(0xffecd1);
  const bulgeHot = new THREE.Color(0xffffff);

  for (let i = 0; i < bulgeCount; i++) {
    const r = Math.pow(Math.random(), 2.5) * 450;  // larger bulge
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * (220 * (1 - r / 450) + 15) * 0.65;

    bulgePos[i * 3] = Math.cos(theta) * r;
    bulgePos[i * 3 + 1] = y;
    bulgePos[i * 3 + 2] = Math.sin(theta) * r;

    const c = bulgeHot.clone().lerp(bulgeWarm, r / 350);
    bulgeColors[i * 3] = c.r;
    bulgeColors[i * 3 + 1] = c.g;
    bulgeColors[i * 3 + 2] = c.b;
  }

  bulgeGeo.setAttribute('position', new THREE.BufferAttribute(bulgePos, 3));
  bulgeGeo.setAttribute('color', new THREE.BufferAttribute(bulgeColors, 3));

  const bulgeMat = new THREE.PointsMaterial({
    size: 12.0, // large soft overlap particles
    map: createCircularParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  galaxyGroup.add(new THREE.Points(bulgeGeo, bulgeMat));

  // D. INTERSTELLAR DUST LANES & REDDISH GAS NEBULAE (50,000 particles - more detailed)
  const nebulaCount = 50000;
  const nebulaGeo = new THREE.BufferGeometry();
  const nebulaPos = new Float32Array(nebulaCount * 3);
  const nebulaColors = new Float32Array(nebulaCount * 3);

  const roseNebula = new THREE.Color(0xf43f5e); // Hot glowing HII regions
  const darkRedNebula = new THREE.Color(0x4c0519); // Dark red-brown dust lanes
  const violetNebula = new THREE.Color(0x6b21a8); // Indigo-violet gas clouds

  for (let i = 0; i < nebulaCount; i++) {
    const armIdx = i % arms;
    const armAngle = (armIdx * Math.PI * 2) / arms;
    const t = Math.pow(Math.random(), 1.15) * Math.PI * 6.2;  // extended range
    const baseR = a * Math.exp(b * t);
    const armSpread = 70 + baseR * 0.2;  // wider spread

    const r = baseR + (Math.random() - 0.5) * armSpread;
    // Offset theta slightly to align dust lanes along the inner edges of spiral arms
    const theta = armAngle + t - 0.15 + (Math.random() - 0.5) * 0.18;
    const y = (Math.random() - 0.5) * 55;

    nebulaPos[i * 3] = Math.cos(theta) * r;
    nebulaPos[i * 3 + 1] = y;
    nebulaPos[i * 3 + 2] = Math.sin(theta) * r;

    const pick = Math.random();
    const c = pick < 0.4 ? darkRedNebula : pick < 0.75 ? roseNebula : violetNebula;
    nebulaColors[i * 3] = c.r;
    nebulaColors[i * 3 + 1] = c.g;
    nebulaColors[i * 3 + 2] = c.b;
  }

  nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
  nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

  const nebulaMat = new THREE.PointsMaterial({
    size: 28.0, // large gaseous clouds
    map: createNebulaParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  galaxyGroup.add(new THREE.Points(nebulaGeo, nebulaMat));

  scene.add(galaxyGroup);
  return galaxyGroup;
}

// Create Triangulum Galaxy (M33) - Major Local Group galaxy
function createTriangulumGalaxy(scene) {
  const galaxyGroup = new THREE.Group();
  galaxyGroup.position.copy(ANDROMEDA_CENTER).add(new THREE.Vector3(800, 200, -300));
  galaxyGroup.rotation.x = Math.PI * 0.35;
  galaxyGroup.rotation.z = Math.PI * 0.25;

  // Single spiral arm structure (face-on view)
  const starCount = 80000;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const arms = 3;  // 3-armed spiral
  const a = 80;
  const b = 0.15;
  const coreColor = new THREE.Color(0xfff4e6);
  const armColor1 = new THREE.Color(0x60a5fa);
  const armColor2 = new THREE.Color(0xf472b6);

  for (let i = 0; i < starCount; i++) {
    let r, theta, y;
    if (Math.random() < 0.2) {
      r = Math.pow(Math.random(), 2.3) * 300;
      theta = Math.random() * Math.PI * 2;
      y = (Math.random() - 0.5) * 60;
    } else {
      const armIdx = i % arms;
      const armAngle = (armIdx * Math.PI * 2) / arms;
      const t = Math.pow(Math.random(), 1.2) * Math.PI * 5.5;
      const baseR = a * Math.exp(b * t);
      r = baseR + (Math.random() - 0.5) * (60 + baseR * 0.18);
      theta = armAngle + t + (Math.random() - 0.5) * (100 / (r + 50));
      y = (Math.random() - 0.5) * (50 * Math.exp(-r / 1500) + 5);
    }

    starPos[i * 3] = Math.cos(theta) * r;
    starPos[i * 3 + 1] = y;
    starPos[i * 3 + 2] = Math.sin(theta) * r;

    let color = coreColor.clone();
    if (r < 300 && Math.random() < 0.5) {
      color.lerp(armColor1, 0.4);
    } else if (r > 200) {
      color.lerp(armColor2, Math.min(1, r / 800));
    }
    starColors[i * 3] = color.r;
    starColors[i * 3 + 1] = color.g;
    starColors[i * 3 + 2] = color.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 3.0,
    map: createCircularParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  galaxyGroup.add(new THREE.Points(starGeo, starMat));

  // Bulge
  const bulgeCount = 15000;
  const bulgeGeo = new THREE.BufferGeometry();
  const bulgePos = new Float32Array(bulgeCount * 3);
  const bulgeColors = new Float32Array(bulgeCount * 3);

  for (let i = 0; i < bulgeCount; i++) {
    const r = Math.pow(Math.random(), 2.5) * 280;
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 80;

    bulgePos[i * 3] = Math.cos(theta) * r;
    bulgePos[i * 3 + 1] = y;
    bulgePos[i * 3 + 2] = Math.sin(theta) * r;

    const c = coreColor.clone().lerp(new THREE.Color(0xffffff), r / 280 * 0.3);
    bulgeColors[i * 3] = c.r;
    bulgeColors[i * 3 + 1] = c.g;
    bulgeColors[i * 3 + 2] = c.b;
  }

  bulgeGeo.setAttribute('position', new THREE.BufferAttribute(bulgePos, 3));
  bulgeGeo.setAttribute('color', new THREE.BufferAttribute(bulgeColors, 3));

  const bulgeMat = new THREE.PointsMaterial({
    size: 8.0,
    map: createNebulaParticleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  galaxyGroup.add(new THREE.Points(bulgeGeo, bulgeMat));

  scene.add(galaxyGroup);
  return galaxyGroup;
}

// Create dwarf elliptical galaxies around Andromeda
function createDwarfGalaxies(scene) {
  const dwarfPositions = [
    { pos: new THREE.Vector3(500, 150, 400), color: 0xffd700, size: 0.8, id: 'dwarf-m110', name: 'M110 Dwarf Galaxy' },
    { pos: new THREE.Vector3(-600, -200, 300), color: 0xff6b9d, size: 0.6, id: 'dwarf-m32', name: 'M32 Dwarf Galaxy' },
    { pos: new THREE.Vector3(300, -400, -500), color: 0x87ceeb, size: 0.5, id: 'dwarf-lyra', name: 'Lyra Dwarf' },
    { pos: new THREE.Vector3(-400, 300, 600), color: 0xffa500, size: 0.7, id: 'dwarf-auriga', name: 'Auriga Dwarf' },
    { pos: new THREE.Vector3(200, -100, 400), color: 0xff69b4, size: 0.4, id: 'dwarf-pegasus', name: 'Pegasus Dwarf' }
  ];

  const interactables = [];

  dwarfPositions.forEach(({ pos, color, size, id, name }) => {
    const dwarfGroup = new THREE.Group();
    const finalPos = ANDROMEDA_CENTER.clone().add(pos);
    dwarfGroup.position.copy(finalPos);

    const starCount = Math.floor(20000 * size * size);
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const c = new THREE.Color(color);
    const maxRadius = 80 * size;

    for (let i = 0; i < starCount; i++) {
      const r = Math.pow(Math.random(), 2) * maxRadius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      colors[i * 3] = c.r + (Math.random() - 0.5) * 0.2;
      colors[i * 3 + 1] = c.g + (Math.random() - 0.5) * 0.2;
      colors[i * 3 + 2] = c.b + (Math.random() - 0.5) * 0.2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 2.5 * size,
      map: createCircularParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const mesh = new THREE.Points(geo, mat);
    mesh.userData = {
      bodyId: id,
      bodyData: {
        id,
        name,
        type: 'dwarf_galaxy',
        category: 'Deep Space',
        color: `#${color.toString(16).padStart(6, '0')}`,
        description: 'A small companion galaxy orbiting a larger galactic system, containing older stars and a dim, diffuse glow.',
        stats: {
          'Type': 'Dwarf Galaxy',
          'Host Galaxy': 'Andromeda',
          'Visual Brightness': 'Low surface brightness',
          'Star Population': 'Ancient stellar population'
        }
      }
    };

    dwarfGroup.add(mesh);
    scene.add(dwarfGroup);
    interactables.push(mesh);
  });

  return interactables;
}

// Create galactic nebula clusters in space
function createNebulaFilaments(scene) {
  const nebulaClusters = [
    { pos: new THREE.Vector3(1200, 500, -1000), color: 0x00ff88, radius: 200, id: 'nebula-cluster-cygnus', name: 'Cygnus Nebula Cluster' },
    { pos: new THREE.Vector3(-1500, -300, 800), color: 0xff00ff, radius: 180, id: 'nebula-cluster-rose', name: 'Rose Dust Nebula' },
    { pos: new THREE.Vector3(800, 1000, 600), color: 0x00ccff, radius: 150, id: 'nebula-cluster-aquila', name: 'Aquila Gas Cloud' },
    { pos: new THREE.Vector3(-900, -700, -1200), color: 0xffaa00, radius: 170, id: 'nebula-cluster-lacerta', name: 'Lacerta Emission Cloud' }
  ];

  const interactables = [];

  nebulaClusters.forEach(({ pos, color, radius, id, name }) => {
    const particleCount = 40000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const c = new THREE.Color(color);

    for (let i = 0; i < particleCount; i++) {
      const r = Math.pow(Math.random(), 1.3) * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;

      positions[i * 3] = pos.x + r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = pos.y + r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = pos.z + r * Math.cos(phi);

      const fade = 1 - r / radius;
      colors[i * 3] = c.r * fade;
      colors[i * 3 + 1] = c.g * fade;
      colors[i * 3 + 2] = c.b * fade;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 15,
      map: createNebulaParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const mesh = new THREE.Points(geo, mat);
    mesh.userData = {
      bodyId: id,
      bodyData: {
        id,
        name,
        type: 'nebula_cluster',
        category: 'Deep Space',
        color: `#${c.getHexString()}`,
        description: 'A glowing cluster of gas and dust where stars are being born and surrounding material is being illuminated by intense radiation.',
        stats: {
          'Type': 'Nebula Cluster',
          'Composition': 'Ionized gases + dust',
          'Energy Source': 'Nearby hot stars',
          'Appearance': 'Diffuse luminous glow'
        }
      }
    };

    scene.add(mesh);
    interactables.push(mesh);
  });

  return interactables;
}

function createAsteroidBelts(scene, isRealisticScale) {
  const count = 750;
  const geo = new THREE.DodecahedronGeometry(0.35, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x555555,  // Dull gray
    roughness: 0.95,
    metalness: 0.1,
    emissive: 0x111111  // Minimal glow
  });

  const instancedMesh = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();

  // Store asteroid positions for distance calculations
  const asteroidPositions = [];
  const asteroidBrightness = new Array(count).fill(0);

  const minR = isRealisticScale ? 260 : 105;
  const maxR = isRealisticScale ? 310 : 125;

  for (let i = 0; i < count; i++) {
    const r = minR + Math.random() * (maxR - minR);
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 6;

    const pos = new THREE.Vector3(
      Math.cos(theta) * r,
      y,
      Math.sin(theta) * r
    );
    asteroidPositions.push(pos);

    dummy.position.copy(pos);
    const scale = (0.5 + Math.random() * 1.5) * 0.5;
    dummy.scale.set(scale, scale, scale);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    dummy.updateMatrix();

    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  instancedMesh.userData.asteroidPositions = asteroidPositions;
  instancedMesh.userData.asteroidBrightness = asteroidBrightness;
  scene.add(instancedMesh);
  return instancedMesh;
}
