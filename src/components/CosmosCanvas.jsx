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

export default function CosmosCanvas({
  selectedBodyId,
  onSelectBody,
  isRealisticScale,
  timeSpeed,
  isPaused,
  showOrbits
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const meshesRef = useRef({});
  const orbitsRef = useRef([]);

  const [hoverInfo, setHoverInfo] = useState(null);

  const selectedBodyIdRef = useRef(selectedBodyId);
  const isRealisticScaleRef = useRef(isRealisticScale);
  const timeSpeedRef = useRef(timeSpeed);
  const isPausedRef = useRef(isPaused);

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

  const startCinematicFlight = (targetId) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const bodyMeshes = meshesRef.current;
    if (!camera || !controls) return;

    let targetWorldPos = new THREE.Vector3(0, 0, 0);
    let offsetDist = 25;

    if (targetId === 'milkyway') {
      targetWorldPos.set(0, -50, 0);
      offsetDist = 450;
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
    const duration = Math.min(4.5, Math.max(2.8, dist * 0.015));

    const midCamPos = startCamPos.clone().add(targetWorldPos).multiplyScalar(0.5);
    const arcHeight = Math.min(120, dist * 0.25);
    midCamPos.y += arcHeight;
    midCamPos.z += arcHeight * 0.5;

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
    scene.fog = new THREE.FogExp2(0x030308, 0.0002);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000);
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
    controls.maxDistance = 2200;
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

    // 5. MILKY WAY GALAXY & STARFIELD PARTICLES
    createStarfieldAndGalaxy(scene);

    // 6. BUILD CELESTIAL BODIES
    const bodyMeshes = {};
    const orbitLines = [];

    CELESTIAL_BODIES.forEach((body) => {
      const radius = isRealisticScale ? Math.max(0.2, body.realRadius / 15000) : body.visualRadius;
      const distance = isRealisticScale ? body.realDistance * 1.5 : body.visualDistance;

      const orbitGroup = new THREE.Group();
      scene.add(orbitGroup);

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
        mesh.position.set(distance, 0, 0);
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
          scene.add(orbitLine);
          orbitLines.push(orbitLine);
        }

        bodyMeshes[body.id] = { mesh, orbitGroup, bodyData: body };
      }

      mesh.userData = { bodyId: body.id, bodyData: body };
    });

    meshesRef.current = bodyMeshes;
    orbitsRef.current = orbitLines;

    // 7. ASTEROID BELT
    const asteroidMesh = createAsteroidBelts(scene, isRealisticScale);

    // Initial Camera Setup (Earth)
    if (bodyMeshes['earth']) {
      const earthMesh = bodyMeshes['earth'].mesh;
      const worldPos = new THREE.Vector3();
      earthMesh.getWorldPosition(worldPos);
      controls.target.copy(worldPos);
      camera.position.set(worldPos.x + 8, worldPos.y + 4, worldPos.z + 14);
    }

    // 8. RAYCASTER CLICK & HOVER LISTENERS
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedBody = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactables = [];
      Object.values(bodyMeshes).forEach((b) => interactables.push(b.mesh));

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
      if (hitBody && onSelectBody) {
        onSelectBody(hitBody.id);
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 9. ANIMATION LOOP WITH CINEMATIC FLIGHT
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const currentSpeed = isPausedRef.current ? 0 : timeSpeedRef.current;
      const currentSelectedId = selectedBodyIdRef.current;
      const flightState = flightStateRef.current;

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

      if (asteroidMesh) {
        asteroidMesh.rotation.y += delta * 0.01 * (currentSpeed > 0 ? currentSpeed * 0.2 : 1);
      }

      if (currentSelectedId) {
        let targetWorldPos = new THREE.Vector3(0, 0, 0);
        let offsetDist = 25;

        if (currentSelectedId === 'milkyway') {
          targetWorldPos.set(0, -50, 0);
          offsetDist = 450;
        } else if (bodyMeshes[currentSelectedId]) {
          const selectedObj = bodyMeshes[currentSelectedId].mesh;
          selectedObj.getWorldPosition(targetWorldPos);

          const bodyData = bodyMeshes[currentSelectedId].bodyData;
          const radius = isRealisticScaleRef.current
            ? Math.max(0.2, bodyData.realRadius / 15000)
            : bodyData.visualRadius;

          offsetDist = radius * 3.5 + 5;
        }

        if (flightState.isAnimating) {
          const elapsedTime = (performance.now() - flightState.startTime) / 1000;
          const progress = Math.min(1.0, elapsedTime / flightState.duration);
          const easedProgress = cubicEaseInOut(progress);

          controls.target.lerpVectors(flightState.startTargetPos, targetWorldPos, easedProgress);

          const finalCamOffset = camera.position.clone().sub(controls.target);
          if (finalCamOffset.length() === 0) finalCamOffset.set(0, 4, 12);
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

      {/* Dynamic Hover Tooltip Badge */}
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

function createStarfieldAndGalaxy(scene) {
  const starCount = 10000;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const colors = [new THREE.Color(0xffffff), new THREE.Color(0x88bbff), new THREE.Color(0xffddaa)];

  for (let i = 0; i < starCount; i++) {
    const r = 500 + Math.random() * 2000;
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
    size: 2.0,
    vertexColors: true,
    transparent: true,
    opacity: 0.9
  });
  scene.add(new THREE.Points(starGeo, starMat));

  // Milky Way Spiral Galaxy
  const galaxyCount = 12000;
  const galaxyGeo = new THREE.BufferGeometry();
  const galaxyPos = new Float32Array(galaxyCount * 3);
  const galaxyColors = new Float32Array(galaxyCount * 3);

  const innerColor = new THREE.Color(0xffaa44);
  const outerColor = new THREE.Color(0x3377ff);

  for (let i = 0; i < galaxyCount; i++) {
    const r = Math.random() * 700 + 100;
    const arms = 4;
    const armAngle = ((i % arms) * (Math.PI * 2)) / arms;
    const spinAngle = r * 0.008;

    const theta = armAngle + spinAngle + (Math.random() - 0.5) * 0.5;
    const y = (Math.random() - 0.5) * (140 - r * 0.12);

    galaxyPos[i * 3] = Math.cos(theta) * r;
    galaxyPos[i * 3 + 1] = y - 200;
    galaxyPos[i * 3 + 2] = Math.sin(theta) * r;

    const mixedColor = innerColor.clone().lerp(outerColor, r / 800);
    galaxyColors[i * 3] = mixedColor.r;
    galaxyColors[i * 3 + 1] = mixedColor.g;
    galaxyColors[i * 3 + 2] = mixedColor.b;
  }

  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPos, 3));
  galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

  const galaxyMat = new THREE.PointsMaterial({
    size: 2.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  scene.add(new THREE.Points(galaxyGeo, galaxyMat));
}

function createAsteroidBelts(scene, isRealisticScale) {
  const count = 2000;
  const geo = new THREE.DodecahedronGeometry(0.35, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x998877,
    roughness: 0.8
  });

  const instancedMesh = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();

  const minR = isRealisticScale ? 110 : 105;
  const maxR = isRealisticScale ? 130 : 125;

  for (let i = 0; i < count; i++) {
    const r = minR + Math.random() * (maxR - minR);
    const theta = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * 6;

    dummy.position.set(Math.cos(theta) * r, y, Math.sin(theta) * r);
    const scale = 0.5 + Math.random() * 1.5;
    dummy.scale.set(scale, scale, scale);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    dummy.updateMatrix();

    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  instancedMesh.instanceMatrix.needsUpdate = true;
  scene.add(instancedMesh);
  return instancedMesh;
}
