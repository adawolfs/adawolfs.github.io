import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export type SceneMode = 'systems' | 'intelligence' | 'maker';

export interface Observatory {
  setMode(mode: SceneMode): void;
  setPaused(paused: boolean): void;
  reset(): void;
  dispose(): void;
}

interface ObservatoryOptions {
  reducedMotion?: boolean;
  onReady?: () => void;
  onError?: () => void;
}

interface Satellite {
  mesh: THREE.Group;
  radius: number;
  speed: number;
  phase: number;
  plane: THREE.Quaternion;
}

const INK = 0x0b0d11;
const PAPER = 0xd7e1e6;
const ORANGE = 0xff8152;

/** A self-contained, texture-free orbital instrument. All resources belong to this instance. */
export function createObservatory(
  container: HTMLElement,
  options: ObservatoryOptions = {},
): Observatory {
  const reducedMotion = options.reducedMotion ?? false;
  let disposed = false;
  let contextLost = false;
  let failed = false;
  let renderer: THREE.WebGLRenderer;

  const reportError = (): void => {
    if (!disposed && !failed) {
      failed = true;
      options.onError?.();
    }
  };

  try {
    const renderCanvas = document.createElement('canvas');
    const renderContext = renderCanvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: true,
    });
    if (!renderContext) throw new Error('WebGL2 unavailable');
    renderer = new THREE.WebGLRenderer({
      canvas: renderCanvas,
      context: renderContext,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: true,
    });
  } catch {
    // Let the caller mount its fallback after receiving the returned controller.
    queueMicrotask(reportError);
    return {
      setMode: () => undefined,
      setPaused: () => undefined,
      reset: () => undefined,
      dispose: () => { disposed = true; },
    };
  }

  renderer.setClearColor(INK, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  const canvas = renderer.domElement;
  canvas.className = 'observatory-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'pan-y';
  container.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(INK, 0.032);
  const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 80);
  const initialPosition = new THREE.Vector3(4.7, 3.4, 8.4);
  camera.position.copy(initialPosition);
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = !reducedMotion;
  controls.dampingFactor = 0.055;
  controls.rotateSpeed = 0.46;
  controls.minPolarAngle = Math.PI * 0.18;
  controls.maxPolarAngle = Math.PI * 0.79;
  // A single finger keeps the page scrollable; use a mouse or two fingers to orbit.
  controls.touches.ONE = null;
  controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
  // OrbitControls sets `none` while connecting; restore native vertical panning afterwards.
  canvas.style.touchAction = 'pan-y';
  controls.update();

  scene.add(new THREE.AmbientLight(0xc7d8e8, 1.2));
  const keyLight = new THREE.DirectionalLight(0xffd9bf, 3.5);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x81a9c9, 2.4);
  rimLight.position.set(-4, 1, -3);
  scene.add(rimLight);
  const coreLight = new THREE.PointLight(ORANGE, 3, 6, 2);
  coreLight.position.set(0.2, 0.2, 0.5);
  scene.add(coreLight);

  const narrow = container.clientWidth < 520;
  const ringSegments = narrow ? 100 : 160;
  const turntable = new THREE.Group();
  turntable.rotation.set(0.08, -0.22, 0.02);
  scene.add(turntable);
  const instrument = new THREE.Group();
  turntable.add(instrument);
  const modeRoots: Record<SceneMode, THREE.Group> = {
    systems: new THREE.Group(),
    intelligence: new THREE.Group(),
    maker: new THREE.Group(),
  };
  Object.values(modeRoots).forEach((root) => instrument.add(root));

  const lineMaterial = (color = PAPER, opacity = 0.32): THREE.LineBasicMaterial =>
    new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });

  const segments = (
    vertices: number[],
    color = PAPER,
    opacity = 0.32,
  ): THREE.LineSegments => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return new THREE.LineSegments(geometry, lineMaterial(color, opacity));
  };

  const edges = (
    geometry: THREE.BufferGeometry,
    color = PAPER,
    opacity = 0.4,
  ): THREE.LineSegments => new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 15),
    lineMaterial(color, opacity),
  );

  const points = (
    positions: number[],
    color = PAPER,
    size = 0.035,
    opacity = 0.8,
  ): THREE.Points => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return new THREE.Points(geometry, new THREE.PointsMaterial({
      color, size, transparent: true, opacity, sizeAttenuation: true, depthWrite: false,
    }));
  };

  const coreMaterial = new THREE.MeshStandardMaterial({
    color: ORANGE,
    emissive: 0xf05c2d,
    emissiveIntensity: 0.25,
    roughness: 0.43,
    metalness: 0.42,
    flatShading: true,
  });

  const addCore = (root: THREE.Group, geometry: THREE.BufferGeometry): void => {
    const core = new THREE.Mesh(geometry, coreMaterial);
    core.rotation.set(0.2, 0.35, -0.1);
    root.add(core);
    const outline = edges(geometry, 0xffc6a6, 0.32);
    outline.rotation.copy(core.rotation);
    root.add(outline);
  };

  // SYSTEMS: a faceted shell around a connected, eight-corner computing lattice.
  const shellGeometry = new THREE.IcosahedronGeometry(1.48, 0);
  const shell = edges(shellGeometry, PAPER, 0.37);
  modeRoots.systems.add(shell);
  const shellPoints = shellGeometry.getAttribute('position');
  modeRoots.systems.add(points(Array.from(shellPoints.array), PAPER, 0.035, 0.85));
  shellGeometry.dispose();
  const cubeGeometry = new THREE.BoxGeometry(1.57, 1.57, 1.57);
  const cube = edges(cubeGeometry, ORANGE, 0.48);
  cube.rotation.y = Math.PI / 4;
  modeRoots.systems.add(cube);
  cubeGeometry.dispose();
  const cubeNodes: number[] = [];
  const cubeLinks: number[] = [];
  for (const x of [-0.785, 0.785]) {
    for (const y of [-0.785, 0.785]) {
      for (const z of [-0.785, 0.785]) {
        const node = new THREE.Vector3(x, y, z).applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
        cubeNodes.push(node.x, node.y, node.z);
        cubeLinks.push(0, 0, 0, node.x, node.y, node.z);
      }
    }
  }
  modeRoots.systems.add(points(cubeNodes, ORANGE, 0.075));
  modeRoots.systems.add(segments(cubeLinks, PAPER, 0.15));
  addCore(modeRoots.systems, new THREE.OctahedronGeometry(0.57, 0));

  // INTELLIGENCE: deterministic, spatially connected nodes, with no random reflow.
  const neuralNodes: THREE.Vector3[] = [];
  const neuralPositions: number[] = [];
  const neuralLinks: number[] = [];
  const neuralCount = narrow ? 40 : 58;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < neuralCount; i += 1) {
    const y = 1 - (i / (neuralCount - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const distance = 1.15 + Math.sin(i * 2.13) * 0.22;
    const node = new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius).multiplyScalar(distance);
    neuralNodes.push(node);
    neuralPositions.push(node.x, node.y, node.z);
  }
  neuralNodes.forEach((node, index) => {
    neuralNodes
      .map((other, otherIndex) => ({ other, otherIndex, distance: node.distanceToSquared(other) }))
      .filter(({ otherIndex }) => otherIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .forEach(({ other, otherIndex }) => {
        if (otherIndex > index) neuralLinks.push(node.x, node.y, node.z, other.x, other.y, other.z);
      });
    if (index % 8 === 0) neuralLinks.push(0, 0, 0, node.x, node.y, node.z);
  });
  modeRoots.intelligence.add(segments(neuralLinks, 0xbdd9df, 0.34));
  modeRoots.intelligence.add(points(neuralPositions, PAPER, 0.065));
  modeRoots.intelligence.add(points(neuralPositions.filter((_, index) => Math.floor(index / 3) % 5 === 0), ORANGE, 0.095));
  addCore(modeRoots.intelligence, new THREE.IcosahedronGeometry(0.49, 0));

  // MAKER: an engineered continuous coil around a small solid seed.
  const coilGeometry = new THREE.TorusKnotGeometry(0.84, 0.21, narrow ? 100 : 160, 7, 2, 3);
  const coil = new THREE.Mesh(coilGeometry, new THREE.MeshStandardMaterial({
    color: 0x6b7b86,
    metalness: 0.7,
    roughness: 0.38,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  }));
  const coilWire = new THREE.LineSegments(
    new THREE.WireframeGeometry(coilGeometry),
    lineMaterial(PAPER, 0.28),
  );
  coil.rotation.x = coilWire.rotation.x = Math.PI / 5;
  modeRoots.maker.add(coil, coilWire);
  const orangeCoil: THREE.Vector3[] = [];
  for (let i = 0; i <= 240; i += 1) {
    const theta = (i / 240) * Math.PI * 2;
    const radial = 0.84 * (2 + Math.cos(3 * theta)) * 0.5;
    orangeCoil.push(new THREE.Vector3(
      radial * Math.cos(2 * theta), radial * Math.sin(2 * theta), 0.42 * Math.sin(3 * theta),
    ));
  }
  const coilThread = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(orangeCoil),
    lineMaterial(ORANGE, 0.8),
  );
  coilThread.rotation.x = Math.PI / 5;
  modeRoots.maker.add(coilThread);
  addCore(modeRoots.maker, new THREE.DodecahedronGeometry(0.39, 0));

  const orbitalRoot = new THREE.Group();
  turntable.add(orbitalRoot);
  const ring = (radius: number, color: number, opacity: number): THREE.LineLoop => {
    const vertices: THREE.Vector3[] = [];
    for (let i = 0; i < ringSegments; i += 1) {
      const angle = (i / ringSegments) * Math.PI * 2;
      vertices.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(vertices), lineMaterial(color, opacity));
  };

  const orbitPlanes = [
    new THREE.Quaternion().setFromEuler(new THREE.Euler(0.22, 0, -0.38)),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(1.06, 0.35, 0.65)),
    new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.6, -0.25, 0.96)),
  ];
  const satellites: Satellite[] = [];
  orbitPlanes.forEach((plane, index) => {
    const radius = 2.0 + index * 0.22;
    const orbit = ring(radius, index === 0 ? ORANGE : PAPER, index === 0 ? 0.64 : 0.22);
    orbit.quaternion.copy(plane);
    orbitalRoot.add(orbit);

    const satellite = new THREE.Group();
    satellite.add(new THREE.Mesh(
      new THREE.OctahedronGeometry(index === 0 ? 0.095 : 0.065, 0),
      new THREE.MeshBasicMaterial({ color: index === 0 ? ORANGE : PAPER }),
    ));
    const satelliteHalo = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 10, 8),
      new THREE.MeshBasicMaterial({ color: index === 0 ? ORANGE : PAPER, transparent: true, opacity: 0.08, depthWrite: false }),
    );
    satellite.add(satelliteHalo);
    orbitalRoot.add(satellite);
    satellites.push({ mesh: satellite, radius, speed: 0.13 - index * 0.027, phase: index * 2.2 + 0.65, plane });
  });

  const perimeter = ring(2.8, PAPER, 0.13);
  perimeter.rotation.set(0.08, 0, -0.05);
  orbitalRoot.add(perimeter);
  const ticks: number[] = [];
  for (let i = 0; i < 96; i += 1) {
    const angle = (i / 96) * Math.PI * 2;
    const inner = i % 8 === 0 ? 2.67 : 2.75;
    ticks.push(Math.cos(angle) * inner, 0, Math.sin(angle) * inner);
    ticks.push(Math.cos(angle) * 2.8, 0, Math.sin(angle) * 2.8);
  }
  const tickRing = segments(ticks, PAPER, 0.3);
  tickRing.rotation.copy(perimeter.rotation);
  orbitalRoot.add(tickRing);

  const satelliteConnections = new THREE.BufferGeometry();
  const satelliteConnectionPositions = new Float32Array(satellites.length * 6);
  satelliteConnections.setAttribute('position', new THREE.BufferAttribute(satelliteConnectionPositions, 3));
  orbitalRoot.add(new THREE.LineSegments(satelliteConnections, lineMaterial(ORANGE, 0.11)));

  const grid = new THREE.GridHelper(16, 32, 0x627079, 0x34404a);
  grid.position.y = -2.32;
  const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
  gridMaterials.forEach((material) => {
    material.transparent = true;
    material.opacity = 0.1;
    material.depthWrite = false;
  });
  scene.add(grid);

  const starPositions: number[] = [];
  for (let i = 0; i < (narrow ? 95 : 160); i += 1) {
    // Irrational sequences avoid both a conspicuous grid and nondeterministic screenshots.
    const x = ((i * 0.61803398875) % 1) * 20 - 10;
    const y = ((i * 0.41421356237) % 1) * 14 - 7;
    const z = -3 - ((i * 0.73205080757) % 1) * 8;
    starPositions.push(x, y, z);
  }
  scene.add(points(starPositions, 0x96a9b7, 0.022, 0.54));

  let mode: SceneMode = 'systems';
  let paused = false;
  let inView = true;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let entrance = 1;
  let hasSize = false;
  let ready = false;

  const render = (): void => {
    if (disposed || contextLost || !hasSize) return;
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      options.onReady?.();
    }
  };

  const positionSatellites = (): void => {
    satellites.forEach((satellite, index) => {
      const angle = elapsed * satellite.speed + satellite.phase;
      satellite.mesh.position
        .set(Math.cos(angle) * satellite.radius, 0, Math.sin(angle) * satellite.radius)
        .applyQuaternion(satellite.plane);
      satellite.mesh.rotation.set(elapsed * 0.2, elapsed * 0.3, 0);
      const offset = index * 6;
      satelliteConnectionPositions[offset] = satellite.mesh.position.x;
      satelliteConnectionPositions[offset + 1] = satellite.mesh.position.y;
      satelliteConnectionPositions[offset + 2] = satellite.mesh.position.z;
      satelliteConnectionPositions[offset + 3] = 0;
      satelliteConnectionPositions[offset + 4] = 0;
      satelliteConnectionPositions[offset + 5] = 0;
    });
    satelliteConnections.getAttribute('position').needsUpdate = true;
  };

  const shouldAnimate = (): boolean =>
    !disposed && !contextLost && !paused && !reducedMotion && inView && !document.hidden && hasSize;

  const animate = (time: number): void => {
    frame = 0;
    if (!shouldAnimate()) return;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.04) : 0;
    lastTime = time;
    elapsed += delta;
    turntable.rotation.y += delta * 0.055;
    instrument.rotation.y += delta * 0.08;
    instrument.position.y = Math.sin(elapsed * 0.45) * 0.06;
    orbitalRoot.rotation.y -= delta * 0.018;
    if (entrance < 1) {
      entrance = Math.min(1, entrance + delta * 2.2);
      instrument.scale.setScalar(0.82 + (1 - Math.pow(1 - entrance, 3)) * 0.18);
    }
    positionSatellites();
    controls.update();
    render();
    frame = window.requestAnimationFrame(animate);
  };

  const updateLoop = (): void => {
    if (disposed) return;
    const active = shouldAnimate();
    controls.enableDamping = active;
    if (active && !frame) {
      lastTime = 0;
      frame = window.requestAnimationFrame(animate);
    } else if (!active && frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    }
    render();
  };

  const resize = (): void => {
    if (disposed) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    hasSize = width > 0 && height > 0;
    if (!hasSize) {
      updateLoop();
      return;
    }
    camera.aspect = width / height;
    // Keep the outer instrument inside portrait containers as well as the desktop hero.
    const fittedFov = THREE.MathUtils.radToDeg(
      2 * Math.atan(3.3 / (initialPosition.length() * Math.min(1, camera.aspect))),
    );
    camera.fov = Math.max(39, fittedFov);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 520 ? 1.5 : 1.75));
    renderer.setSize(width, height, false);
    updateLoop();
  };

  const onControlChange = (): void => { if (!frame) render(); };
  const onVisibilityChange = (): void => { updateLoop(); };
  const onContextLost = (event: Event): void => {
    event.preventDefault();
    contextLost = true;
    updateLoop();
    reportError();
  };
  controls.addEventListener('change', onControlChange);
  document.addEventListener('visibilitychange', onVisibilityChange);
  canvas.addEventListener('webglcontextlost', onContextLost);

  const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
  resizeObserver?.observe(container);
  if (!resizeObserver) window.addEventListener('resize', resize);
  const intersectionObserver = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      updateLoop();
    }, { rootMargin: '100px' })
    : null;
  intersectionObserver?.observe(container);

  const setMode = (nextMode: SceneMode): void => {
    if (disposed || !(nextMode in modeRoots)) return;
    const changed = mode !== nextMode;
    mode = nextMode;
    (Object.keys(modeRoots) as SceneMode[]).forEach((key) => {
      modeRoots[key].visible = key === mode;
    });
    if (changed) {
      entrance = reducedMotion || paused ? 1 : 0;
      instrument.scale.setScalar(entrance === 1 ? 1 : 0.82);
    }
    render();
  };

  positionSatellites();
  setMode('systems');
  resize();

  return {
    setMode,
    setPaused(nextPaused: boolean): void {
      paused = nextPaused;
      if (paused) {
        entrance = 1;
        instrument.scale.setScalar(1);
      }
      updateLoop();
    },
    reset(): void {
      if (disposed) return;
      camera.position.copy(initialPosition);
      controls.target.set(0, 0, 0);
      turntable.rotation.set(0.08, -0.22, 0.02);
      instrument.rotation.set(0, 0, 0);
      instrument.position.y = 0;
      orbitalRoot.rotation.set(0, 0, 0);
      elapsed = 0;
      positionSatellites();
      controls.update();
      render();
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse((object) => {
        const drawable = object as THREE.Mesh;
        if (drawable.geometry) geometries.add(drawable.geometry);
        if (drawable.material) {
          const owned = Array.isArray(drawable.material) ? drawable.material : [drawable.material];
          owned.forEach((material) => materials.add(material));
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
