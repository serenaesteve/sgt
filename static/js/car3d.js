/**
 * APEX — Car 3D Viewer
 * Modelos GLB reales via GLTFLoader; fallback procedural por marca
 */

// MODEL_MAP: claves 'Marca' (default) y 'Marca::Modelo' (específico)
// 15 GLBs para 10 marcas — 40 modelos totales
const MODEL_MAP = {

  // ══════════════════════════════════════════════════════════
  // FERRARI  (3 looks diferentes)
  //   ferrari.glb     = GT clásico (12 Cilindri, SF90)
  //   ferrari_488.glb = Deportivo mid-engine (296 GTB, Roma)
  //   ferrari_f8.glb  = Hypercar track (F8, F80)
  // ══════════════════════════════════════════════════════════
  'Ferrari':                 { file:'ferrari.glb',     bodyMesh:['body'] },
  'Ferrari::296 GTB':        { file:'ferrari_488.glb', bodyMesh:['main_color_paint','main_paint'] },
  'Ferrari::Roma':           { file:'ferrari_488.glb', bodyMesh:['main_color_paint','main_paint'] },
  'Ferrari::SF90 Stradale':  { file:'ferrari_f8.glb',  bodyMesh:['body:paint_geo','paint_geo','kit3_paint'] },
  'Ferrari::F80':            { file:'ferrari_f8.glb',  bodyMesh:['body:paint_geo','paint_geo','kit3_paint'] },
  // 12 Cilindri → ferrari.glb (default — GT V12 clásico)

  // ══════════════════════════════════════════════════════════
  // LAMBORGHINI  (2 looks diferentes)
  //   lamborghini.glb = Huracán (todos los Huracán + Temerario)
  //   aventador.glb   = V12 flagship (Revuelto)
  // ══════════════════════════════════════════════════════════
  'Lamborghini':                    { file:'lamborghini.glb', bodyMesh:['body:kit3_paint','kit3_paint','kit3_coloured'] },
  'Lamborghini::Revuelto':          { file:'aventador.glb',   bodyMesh:['coloured_geo','coloured'] },
  // Huracán Sterrato / STO / Temerario → lamborghini.glb (default)

  // ══════════════════════════════════════════════════════════
  // PORSCHE  (3 looks diferentes)
  //   porsche.glb  = 911 GT3  (911 GTS, GT3, GT3 RS)
  //   cayman.glb   = Cayman S (Cayman GT4 RS)
  //   panamera.glb = Panamera Sport Turismo (Panamera Turbo S)
  // ══════════════════════════════════════════════════════════
  'Porsche':                    { file:'porsche.glb',   bodyMesh:[], largestMesh:true },
  'Porsche::Cayman GT4 RS':     { file:'cayman.glb',    bodyMesh:['cayman','car_porsche','lod0m'] },
  'Porsche::Panamera Turbo S':  { file:'panamera.glb',  bodyMesh:['coloured_geo','coloured'] },
  // 911 Carrera GTS / 911 GT3 / 911 GT3 RS → porsche.glb (default)

  // ══════════════════════════════════════════════════════════
  // McLAREN  (1 look — solo tenemos 720S)
  //   mclaren.glb = McLaren 720S
  // ══════════════════════════════════════════════════════════
  'McLaren':  { file:'mclaren.glb', bodyMesh:['s:paint_geo','s:paint','paint_geo'] },

  // ══════════════════════════════════════════════════════════
  // ASTON MARTIN  (1 look — Vantage Roadster)
  //   astonmartin.glb = Aston Martin Vantage Roadster
  // ══════════════════════════════════════════════════════════
  'Aston Martin':  { file:'astonmartin.glb', bodyMesh:[], largestMesh:true },

  // ══════════════════════════════════════════════════════════
  // BUGATTI  (1 look — Bolide 2024)
  //   bugatti.glb = Bugatti Bolide 2024
  // ══════════════════════════════════════════════════════════
  'Bugatti':  { file:'bugatti.glb', bodyMesh:[], largestMesh:true },

  // ══════════════════════════════════════════════════════════
  // MASERATI  (1 look — GranTurismo MC Stradale)
  //   maserati.glb = Maserati GranTurismo MC Stradale
  // ══════════════════════════════════════════════════════════
  'Maserati':  { file:'maserati.glb', bodyMesh:[], largestMesh:true },

  // ══════════════════════════════════════════════════════════
  // FORD  (1 look — Mustang Shelby GT500)
  //   mustang.glb = Ford Mustang Shelby GT500
  // ══════════════════════════════════════════════════════════
  'Ford':  { file:'mustang.glb', bodyMesh:['carpaint','body','paint'] },

  // ══════════════════════════════════════════════════════════
  // NISSAN  (1 look — 370Z)
  //   gtr.glb = Nissan 370Z
  // ══════════════════════════════════════════════════════════
  'Nissan':  { file:'gtr.glb', bodyMesh:[], largestMesh:true },

  // ══════════════════════════════════════════════════════════
  // AUDI  (1 look — R8 V10)
  //   r8.glb = Audi R8 V10
  // ══════════════════════════════════════════════════════════
  'Audi':  { file:'r8.glb', bodyMesh:[], largestMesh:true },
};

// 20 colores con propiedades físicas reales (PBR)
const COLORS = [
  // Gloss
  { name:'Rosso Corsa',        hex:'#C41230', metal:0.72, rough:0.12, finish:'Gloss' },
  { name:'Giallo Modena',      hex:'#F5C400', metal:0.45, rough:0.15, finish:'Gloss' },
  { name:'Nero Daytona',       hex:'#0D0D0D', metal:0.85, rough:0.10, finish:'Gloss' },
  { name:'Bianco Avus',        hex:'#F0EEE8', metal:0.50, rough:0.15, finish:'Gloss' },
  // Metallic
  { name:'Blu Tour de France', hex:'#1B3A6B', metal:0.78, rough:0.10, finish:'Metallic' },
  { name:'Grigio Silverstone', hex:'#8D9093', metal:0.82, rough:0.08, finish:'Metallic' },
  { name:'Verde British',      hex:'#1B4D2E', metal:0.72, rough:0.10, finish:'Metallic' },
  { name:'Rosso Portofino',    hex:'#A0321F', metal:0.74, rough:0.10, finish:'Metallic' },
  { name:'Arancio Atlas',      hex:'#D4600A', metal:0.68, rough:0.11, finish:'Metallic' },
  { name:'Oro Brillante',      hex:'#C9A84C', metal:0.94, rough:0.07, finish:'Metallic' },
  // Pearl
  { name:'Verde Mantis',       hex:'#2D6A4F', metal:0.55, rough:0.13, finish:'Pearl' },
  { name:'Azzurro California', hex:'#4FB3D4', metal:0.60, rough:0.12, finish:'Pearl' },
  { name:'Bianco Fuji',        hex:'#F7F5F0', metal:0.55, rough:0.12, finish:'Pearl' },
  { name:'Viola Parsifae',     hex:'#6B2D8B', metal:0.68, rough:0.11, finish:'Pearl' },
  // Matte
  { name:'Grigio Nürburgring', hex:'#4A4A4A', metal:0.08, rough:0.92, finish:'Matte' },
  { name:'Nero Opaco',         hex:'#181818', metal:0.04, rough:0.95, finish:'Matte' },
  { name:'Verde Racing Matte', hex:'#2A4A1E', metal:0.06, rough:0.93, finish:'Matte' },
  // Satin
  { name:'Carbon Satin',       hex:'#2D2D2D', metal:0.22, rough:0.44, finish:'Satin' },
  { name:'Grigio Titanio',     hex:'#6B7280', metal:0.36, rough:0.38, finish:'Satin' },
  { name:'Blu Scuro Satin',    hex:'#1A2A4A', metal:0.32, rough:0.42, finish:'Satin' },
];

// Estado del visor
let scene, camera, renderer;
let composer = null, bloomPass = null;
let currentModel = null;
let bodyMeshes    = [];
let caliperMeshes = [];
let rimMeshes     = [];   // llantas — para cambiar color/estilo
let spinTargets   = [];   // objetos a rotar en el giro idle de las ruedas (malla o pivote del buje)
let interiorMeshes = [];  // tapicería — para cambiar color del interior
let currentColorIdx = 0;
let autoRotate = true;
let loadedBrands = {};    // cache: brand → { model, normalizedFor }
let rotY = 0.5, rotX = 0.15, dist = 8;
let isDragging = false, lx = 0, ly = 0;
let hintHidden = false;
let currentFile = null;   // archivo .glb actual — usado por los presets de cámara (orientación)
let studioLights = {};    // refs a luces de estudio — usado por el modo noche
let nightMode = false;
let carbonTexture = null; // textura de fibra de carbono, generada una sola vez
let underglow = null;     // luz de neón bajo el coche
let xrayMode = false;      // vista de rayos X — carrocería semitransparente
const XRAY_OPACITY = 0.18;

// Estilos de llantas: color y propiedades PBR
const WHEEL_STYLES = {
  serie:      { hex: 0xaaaaaa, metal: 0.92, rough: 0.10 },
  sport_20:   { hex: 0x888888, metal: 0.90, rough: 0.14 },
  forged_21:  { hex: 0xcccccc, metal: 0.97, rough: 0.04 },
  diamond_21: { hex: 0xe8e8e8, metal: 1.00, rough: 0.02 },
  carbon_20:  { hex: 0x222222, metal: 0.28, rough: 0.42 },
};

// Acabado de tapicería: cuero/Nappa con sheen vs Alcántara mate/aterciopelada
const DEFAULT_LEATHER_FINISH = { rough: 0.35, metal: 0.06 };
const INTERIOR_FINISH = {
  alcantara: { rough: 0.92, metal: 0.0 },
};

// ── INIT THREE.JS ─────────────────────────────────────────────
function initThree(mountId) {
  const mount = document.getElementById(mountId);
  const W = mount.clientWidth;
  const H = mount.clientHeight;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.physicallyCorrectLights = true;
  mount.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060606);
  scene.fog = new THREE.FogExp2(0x060606, 0.030);

  camera = new THREE.PerspectiveCamera(40, W / H, 0.01, 200);
  camera.position.set(5, 2.2, 6);
  camera.lookAt(0, 0.8, 0);

  setupLights();
  setupEnvironment();
  setupUnderglow();
  setupEnvMap();
  setupComposer(W, H);
  setupOrbitControls(mount);
  setupResize(mount);
  animate();
}

// Bloom de post-procesado: halo de luz real en faros/pilotos.
// Degradado silencioso si las librerías de postprocessing no llegan a cargar (CDN).
function setupComposer(W, H) {
  try {
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(W, H), 0.45, 0.35, 0.92);
    composer.addPass(bloomPass);
    composer.renderTarget1.texture.encoding = THREE.sRGBEncoding;
    composer.renderTarget2.texture.encoding = THREE.sRGBEncoding;
  } catch (e) {
    console.warn('Bloom no disponible:', e.message);
    composer = null;
  }
}

function setupLights() {
  const ambient = new THREE.AmbientLight(0xffffff, 0.45);  // bajo para más contraste; el key light aporta el brillo principal
  scene.add(ambient);

  const key = new THREE.DirectionalLight(0xfff8e8, 3.2);
  key.position.set(6, 12, 7);
  key.castShadow = true;
  key.shadow.mapSize.width  = 2048;
  key.shadow.mapSize.height = 2048;
  key.shadow.camera.near = 0.5;
  key.shadow.camera.far  = 60;
  key.shadow.camera.left   = -10;
  key.shadow.camera.right  = 10;
  key.shadow.camera.top    = 10;
  key.shadow.camera.bottom = -10;
  key.shadow.bias = -0.0005;
  scene.add(key);

  const fill = new THREE.DirectionalLight(0x8ab4ff, 1.1);
  fill.position.set(-7, 5, -5);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xff3300, 0.7);
  rim.position.set(0, 4, -10);
  scene.add(rim);

  const hemi = new THREE.HemisphereLight(0x444444, 0x111111, 0.30);
  scene.add(hemi);

  const spots = [];
  [-4, 4].forEach(x => {
    const spot = new THREE.SpotLight(0xffffff, 1.8, 22, Math.PI / 5.5, 0.35, 1);
    spot.position.set(x, 9, 2);
    spot.target.position.set(x * 0.25, 0, 0);
    scene.add(spot);
    scene.add(spot.target);
    spots.push(spot);
  });

  studioLights = { ambient, key, fill, rim, hemi, spots };
  [ambient, key, fill, rim, hemi, ...spots].forEach(l => { l.userData.dayIntensity = l.intensity; });
}

// Modo noche / showroom: apaga la luz ambiental del estudio para que destaquen
// los faros/pilotos (emissive + bloom) sobre un fondo casi negro.
function setNightMode(on) {
  nightMode = on;
  const bg = on ? 0x000000 : 0x060606;
  scene.background = new THREE.Color(bg);
  if (scene.fog) {
    scene.fog.color.setHex(bg);
    scene.fog.density = on ? 0.045 : 0.030;
  }

  const factor = on ? 0.15 : 1.0;
  const { ambient, key, fill, rim, hemi, spots } = studioLights;
  [ambient, key, fill, rim, hemi, ...(spots || [])].forEach(l => {
    if (l) l.intensity = l.userData.dayIntensity * factor;
  });

  renderer.toneMappingExposure = on ? 1.0 : 1.4;

  if (bloomPass) {
    bloomPass.strength = on ? 0.85 : 0.45;
    bloomPass.threshold = on ? 0.65 : 0.92;
  }
}

function setupEnvironment() {
  // Suelo de estudio pulido: clearcoat + envMap más intenso = reflejo tenue del coche
  const groundMat = new THREE.MeshPhysicalMaterial({
    color: 0x070707,
    metalness: 0.92,
    roughness: 0.05,
    envMapIntensity: 1.8,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(35, 70, 0x181818, 0x0f0f0f);
  grid.position.y = 0.002;
  scene.add(grid);

  const lineGeo = new THREE.PlaneGeometry(0.05, 22);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xe8170a, transparent: true, opacity: 0.20 });
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.rotation.x = -Math.PI / 2;
  line.position.y = 0.003;
  scene.add(line);

  // Sombra de contacto bajo el coche — ancla el modelo al suelo
  const aoCanvas = document.createElement('canvas');
  aoCanvas.width = aoCanvas.height = 256;
  const actx = aoCanvas.getContext('2d');
  const grad = actx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0,   'rgba(0,0,0,0.55)');
  grad.addColorStop(0.7, 'rgba(0,0,0,0.22)');
  grad.addColorStop(1,   'rgba(0,0,0,0)');
  actx.fillStyle = grad;
  actx.fillRect(0, 0, 256, 256);
  const aoMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(aoCanvas), transparent: true, depthWrite: false });
  const aoBlob = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 5.6), aoMat);
  aoBlob.rotation.x = -Math.PI / 2;
  aoBlob.position.y = 0.0015;
  scene.add(aoBlob);
}

// Luz de neón bajo el coche: disco emisivo (additive) + luz puntual coloreada
// que se refleja en el suelo de estudio. Oculto por defecto, se activa con toggle.
function setupUnderglow() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0,   'rgba(255,255,255,1)');
  grad.addColorStop(0.35,'rgba(255,255,255,0.45)');
  grad.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);

  const mat = new THREE.MeshBasicMaterial({
    map: tex, color: 0x00e5ff, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 5.6), mat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = 0.012;
  glow.visible = false;
  scene.add(glow);

  const light = new THREE.PointLight(0x00e5ff, 0, 6, 2);
  light.position.set(0, 0.25, 0);
  scene.add(light);

  underglow = { mesh: glow, mat, light };
}

// on: boolean — activa/desactiva el neón. hex: color (opcional, p.ej. el acento de marca)
function setUnderglow(on, hex) {
  if (!underglow) return;
  if (hex) {
    const c = new THREE.Color(hex);
    underglow.mat.color.copy(c);
    underglow.light.color.copy(c);
  }
  underglow.mesh.visible = on;
  underglow.light.intensity = on ? 2.4 : 0;
}

function setupEnvMap() {
  // Neutral studio environment so PBR/metallic materials are visible without HDRI
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envScene = new THREE.Scene();
  // Six point lights simulating a bright studio box
  const envCols = [0xfff8f0, 0xd0e8ff, 0xfff8f0, 0xd0e8ff, 0xffffff, 0x888888];
  const envPos  = [[0,10,0],[0,-4,0],[10,4,0],[-10,4,0],[0,4,10],[0,4,-10]];
  envPos.forEach((p, i) => {
    const l = new THREE.PointLight(envCols[i], 2.5, 40);
    l.position.set(...p);
    envScene.add(l);
  });
  envScene.add(new THREE.AmbientLight(0xffffff, 2.0));
  const envTex = pmrem.fromScene(envScene).texture;
  scene.environment = envTex;
  pmrem.dispose();
}

// ── ORBIT CONTROLS ────────────────────────────────────────────
function setupOrbitControls(container) {
  const cv = renderer.domElement;
  cv.addEventListener('mousedown', e => { isDragging = true; lx = e.clientX; ly = e.clientY; autoRotate = false; hideHint(); });
  cv.addEventListener('mousemove', e => {
    if (!isDragging) return;
    rotY += (e.clientX - lx) * 0.007;
    rotX -= (e.clientY - ly) * 0.004;
    rotX = Math.max(-0.28, Math.min(0.65, rotX));
    lx = e.clientX; ly = e.clientY;
    updateCamera();
  });
  cv.addEventListener('mouseup',    () => isDragging = false);
  cv.addEventListener('mouseleave', () => isDragging = false);
  cv.addEventListener('wheel', e => {
    dist = Math.max(3, Math.min(18, dist + e.deltaY * 0.012));
    updateCamera(); autoRotate = false;
  }, { passive: true });
  cv.addEventListener('touchstart', e => { isDragging = true; lx = e.touches[0].clientX; ly = e.touches[0].clientY; autoRotate = false; hideHint(); });
  cv.addEventListener('touchmove', e => {
    if (!isDragging) return;
    rotY += (e.touches[0].clientX - lx) * 0.007;
    rotX -= (e.touches[0].clientY - ly) * 0.004;
    rotX = Math.max(-0.28, Math.min(0.65, rotX));
    lx = e.touches[0].clientX; ly = e.touches[0].clientY;
    updateCamera();
  });
  cv.addEventListener('touchend', () => isDragging = false);
}

function hideHint() {
  if (hintHidden) return;
  const h = document.getElementById('drag-hint');
  if (h) h.style.opacity = '0';
  hintHidden = true;
}

function updateCamera() {
  const x = dist * Math.sin(rotY) * Math.cos(rotX);
  const y = Math.max(dist * Math.sin(rotX) + 1.2, 0.3);
  const z = dist * Math.cos(rotY) * Math.cos(rotX);
  camera.position.set(x, y, z);
  camera.lookAt(0, 0.9, 0);
}

// Archivos cuyo morro apunta a -Z en su orientación nativa (resto → +Z).
// Mismo dato que RACE_YAW en race_game.html: solo ferrari.glb está invertido.
const NOSE_FLIP = { 'ferrari.glb': true };

// Vistas de cámara predefinidas: frontal/lateral/trasera/3-4.
// rotY=0 → cámara en +Z, ve la cara +Z del modelo (el morro, en los modelos no invertidos).
const CAMERA_PRESETS = {
  front:  { rotY: 0,         rotX: 0.12, dist: 6.2 },
  rear:   { rotY: Math.PI,   rotX: 0.12, dist: 6.2 },
  side:   { rotY: Math.PI/2, rotX: 0.08, dist: 8.5 },
  threeq: { rotY: 0.5,       rotX: 0.15, dist: 8   },
};

function setCameraView(view) {
  const p = CAMERA_PRESETS[view] || CAMERA_PRESETS.threeq;
  const flip = (currentFile && NOSE_FLIP[currentFile]) ? Math.PI : 0;
  autoRotate = false;
  hideHint();
  rotY = p.rotY + flip;
  rotX = p.rotX;
  dist = p.dist;
  updateCamera();
}

function setupResize(container) {
  const ro = new ResizeObserver(() => {
    const W = container.clientWidth;
    const H = container.clientHeight;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    if (composer) composer.setSize(W, H);
  });
  ro.observe(container);
}

function animate() {
  requestAnimationFrame(animate);
  if (autoRotate) { rotY += 0.003; updateCamera(); }
  // Ruedas girando al ralentí — ambiente de showroom (solo modelos GLB reales)
  if (currentFile) spinTargets.forEach(m => {
    m.rotation.x += 0.012;
    const c = m.userData.spinCenter;
    m.position.copy(m.userData.spinBasePos).add(c).sub(c.clone().applyEuler(m.rotation));
  });
  if (composer) composer.render(); else renderer.render(scene, camera);
}

// ── CARGA DE MODELO ───────────────────────────────────────────
// brand: nombre de la marca, model: nombre del modelo específico (opcional)
function loadModel(brand, model, onProgress, onDone) {
  // Soporte llamada legacy sin model
  if (typeof model === 'function') { onDone = onProgress; onProgress = model; model = ''; }

  const modelKey = model ? (brand + '::' + model) : brand;
  const cfg = MODEL_MAP[modelKey] || MODEL_MAP[brand];
  if (!cfg) { buildFallback(brand); if (onDone) onDone(false); return; }

  const cacheKey = cfg.file;  // clave de caché por archivo (varios modelos pueden compartirlo)

  // Cache hit: renormalizar con la config específica del modelo
  if (loadedBrands[cacheKey]) {
    const cached = loadedBrands[cacheKey];
    normalizeModel(cached, brand, cfg);
    swapModel(cached, brand);
    if (onDone) onDone(true);
    return;
  }

  const dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  const loader = new THREE.GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  showLoadingState(true);
  loader.load(
    `/static/models/${cfg.file}`,
    (gltf) => {
      try {
        const m = gltf.scene;
        normalizeModel(m, brand, cfg);
        loadedBrands[cacheKey] = m;
        swapModel(m, brand);
        showLoadingState(false);
        if (onDone) onDone(true);
      } catch (e) {
        console.error('Model load error:', e.message);
        buildFallback(brand);
        showLoadingState(false);
        if (onDone) onDone(false);
      }
    },
    (xhr) => { if (onProgress && xhr.total) onProgress(Math.round(xhr.loaded / xhr.total * 100)); },
    () => { buildFallback(brand); showLoadingState(false); if (onDone) onDone(false); }
  );
}

// Prepara una malla de llanta para el giro idle. Guarda su posición/rotación
// originales y el centro de su geometría: en animate() se compensa la posición
// cada frame para que la malla gire sobre el centro de su geometría (el buje)
// en vez de orbitar lejos de su sitio cuando ese centro no coincide con el
// origen local de la malla. No modifica el árbol de la escena (seguro de
// llamar varias veces sobre el mismo modelo cacheado).
function setupWheelSpin(mesh) {
  if (mesh.userData.spinBasePos) {
    mesh.position.copy(mesh.userData.spinBasePos);
    mesh.rotation.copy(mesh.userData.spinBaseRot);
  } else {
    mesh.geometry.computeBoundingBox();
    mesh.userData.spinCenter  = mesh.geometry.boundingBox.getCenter(new THREE.Vector3());
    mesh.userData.spinBasePos = mesh.position.clone();
    mesh.userData.spinBaseRot = mesh.rotation.clone();
  }
  spinTargets.push(mesh);
}

function normalizeModel(model, brand, cfgOverride) {
  const box  = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = 4.5 / Math.max(size.x, size.z);
  model.scale.setScalar(scale);
  box.setFromObject(model);
  box.getCenter(center);
  model.position.x = -center.x;
  model.position.y = -box.min.y;
  model.position.z = -center.z;

  bodyMeshes    = [];
  caliperMeshes = [];
  rimMeshes     = [];
  spinTargets   = [];
  interiorMeshes = [];
  const cfg = cfgOverride || MODEL_MAP[brand] || {};
  currentFile = cfg.file || null;

  // ── Materiales ─────────────────────────────────────────────
  const col  = COLORS[currentColorIdx];
  const _pm  = paintMetal(col.metal);
  const _pr  = col.finish === 'Matte' ? col.rough : Math.max(col.rough, 0.16);
  // Mate/Satinado no "brillan" con luz propia → más contraste de sombras;
  // Gloss/Metallic/Pearl mantienen un leve resplandor que realza el color
  const _ei  = (col.finish === 'Matte' || col.finish === 'Satin') ? 0.04 : 0.18;
  const _cc  = clearcoatForFinish(col.finish);
  const mkPaint = () => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(col.hex), metalness: _pm, roughness: _pr,
    envMapIntensity: 2.0,
    emissive: new THREE.Color(col.hex), emissiveIntensity: _ei,
    clearcoat: _cc.cc, clearcoatRoughness: _cc.ccr,
    transparent: xrayMode, opacity: xrayMode ? XRAY_OPACITY : 1.0, depthWrite: !xrayMode,
  });
  const glbGlass   = new THREE.MeshPhysicalMaterial({ color:0x10181f, metalness:0.2, roughness:0.05, transparent:true, opacity:0.55, envMapIntensity:1.6 });
  const glbTire    = new THREE.MeshStandardMaterial({ color:0x080808, metalness:0.0,  roughness:0.97 });
  const glbRimMat  = new THREE.MeshStandardMaterial({ color:0xbbbbbb, metalness:0.96, roughness:0.06, envMapIntensity:1.8 });
  const glbLight   = new THREE.MeshStandardMaterial({ color:0xffffff, emissive:new THREE.Color(0xffffcc), emissiveIntensity:1.8 });
  const glbLightR  = new THREE.MeshStandardMaterial({ color:0xff2200, emissive:new THREE.Color(0xff2200), emissiveIntensity:2.2 });
  const glbDark    = new THREE.MeshStandardMaterial({ color:0x101010, metalness:DEFAULT_LEATHER_FINISH.metal, roughness:DEFAULT_LEATHER_FINISH.rough });
  const glbChrome  = new THREE.MeshStandardMaterial({ color:0xcccccc, metalness:0.99, roughness:0.03, envMapIntensity:2.0 });
  const glbCaliper = new THREE.MeshStandardMaterial({ color:0xcc0000, metalness:0.65, roughness:0.32 });
  const glbCarbon  = new THREE.MeshPhysicalMaterial({ color:0xffffff, map:getCarbonTexture(), metalness:0.45, roughness:0.28, clearcoat:0.7, clearcoatRoughness:0.18, envMapIntensity:1.6 });
  const glbMirror  = new THREE.MeshStandardMaterial({ color:0xeef2f5, metalness:1.0, roughness:0.04, envMapIntensity:2.4 });

  // ── Pre-scan: max vértices para umbral de carrocería ────────
  let maxVerts = 0;
  model.traverse(c => {
    if (c.isMesh && c.geometry?.attributes?.position)
      maxVerts = Math.max(maxVerts, c.geometry.attributes.position.count);
  });
  const bodyThreshold = maxVerts * 0.14;  // meshes > 14% del mayor → panel de carrocería

  // ── Asignación de materiales ────────────────────────────────
  model.traverse(child => {
    if (!child.isMesh) return;
    child.castShadow = true;
    child.receiveShadow = true;

    const n    = child.name.toLowerCase();
    const verts = child.geometry?.attributes?.position?.count || 0;

    // 1. Carrocería por nombre (modelos con meshes nombrados)
    const isNamedBody = cfg.bodyMesh.length > 0 && cfg.bodyMesh.some(k => n.includes(k.toLowerCase()));
    if (isNamedBody) {
      child.material = mkPaint();
      bodyMeshes.push(child);
      return;
    }

    // 2. Partes especiales por nombre
    if (n.includes('glass') || n.includes('windscreen') || n.includes('window') || n.includes('windshield') || n.includes('crystal')) {
      child.material = glbGlass; return;
    }
    if (n.includes('tyre') || n.includes('tire') || n.includes('rubber') || n === 'wheel') {
      child.material = glbTire; return;
    }
    if (n.includes('rim') || n.includes('spoke') || n.includes('hub') || n.includes('alloy') ||
        (n.includes('wheel') && !n.includes('tire') && !n.includes('tyre'))) {
      child.material = glbRimMat.clone();
      rimMeshes.push(child); return;
    }
    if (n.includes('headlight') || n.includes('drl') || n.includes('_led') ||
        (n.includes('light') && (n.includes('head') || n.includes('front') || n.includes('_fl') || n.includes('_fr')))) {
      child.material = glbLight; return;
    }
    if (n.includes('taillight') || n.includes('lights_red') || n.includes('stop_light') ||
        (n.includes('light') && (n.includes('tail') || n.includes('rear') || n.includes('red') || n.includes('_rl') || n.includes('_rr')))) {
      child.material = glbLightR; return;
    }
    if (n.includes('caliper') || n.includes('brake') || n.includes('clamp')) {
      child.material = glbCaliper.clone(); caliperMeshes.push(child); return;
    }
    if (n.includes('interior') || n.includes('leather') || n.includes('seat') || n.includes('carpet') ||
        n.includes('cabin') || n.includes('cockpit') || n.includes('dashboard')) {
      child.material = glbDark.clone(); interiorMeshes.push(child); return;
    }
    if (n.includes('chrome') || n.includes('exhaust') || n.includes('trim_metal') || n.includes('grille') || n.includes('grill') ||
        n.includes('badge') || n.includes('emblem') || n.includes('orange')) {
      child.material = glbChrome; return;
    }
    if (n.includes('mirror')) { child.material = glbMirror; return; }
    if (n.includes('carbon')) { child.material = glbCarbon; return; }

    // 3. Para meshes sin nombre específico: usar umbral de tamaño
    //    Los paneles de carrocería exterior suelen ser los meshes más grandes
    if (verts >= bodyThreshold) {
      // Comprobar forma: ruedas/cilindros tienen dos dimensiones similares
      // (diámetro × diámetro × anchura), carrocería es alargada (largo >> alto)
      const wb = new THREE.Box3().setFromObject(child);
      const ws = wb.getSize(new THREE.Vector3());
      const dims = [ws.x, ws.y, ws.z].sort((a, b) => a - b); // [min, mid, max]
      // Cilindro/rueda: dims[1] ≈ dims[2] (dos lados grandes) y dims[0] << dims[1]
      const isRound = dims[2] > 0.01 &&
                      (dims[1] / dims[2]) > 0.65 &&   // similar en Y y Z
                      (dims[0] / dims[2]) < 0.55;     // X mucho más pequeño
      if (isRound) {
        // Es una rueda → no pintar como carrocería
        child.material = glbTire;
      } else {
        // Panel de carrocería → color de pintura
        child.material = mkPaint();
        bodyMeshes.push(child);
      }
    } else {
      // Mesh pequeño → trim/detalle → mantener material original ajustado
      const origMat = Array.isArray(child.material) ? child.material[0] : child.material;
      if (!origMat) return;
      // Vidrio por material
      if (origMat.transparent && origMat.opacity < 0.55) { child.material = glbGlass; return; }
      // Neutralizar colores muy saturados (liveries neon)
      if (origMat.color) {
        const hsl = { h:0, s:0, l:0 };
        origMat.color.getHSL(hsl);
        if (hsl.s > 0.35 && hsl.l > 0.14) origMat.color.setHSL(hsl.h, 0.06, 0.10);
      }
      if (origMat.isMeshStandardMaterial || origMat.isMeshPhysicalMaterial) {
        origMat.envMapIntensity = 1.2;
        if (origMat.metalness > 0.65) origMat.metalness = 0.65;
        if (origMat.roughness < 0.18)  origMat.roughness = 0.18;
        origMat.needsUpdate = true;
      }
    }
  });

  // Seguridad: si bodyMeshes sigue vacío, usar el mayor mesh
  if (bodyMeshes.length === 0) {
    let top = null, topV = 0;
    model.traverse(c => {
      if (!c.isMesh || !c.geometry?.attributes?.position) return;
      const v = c.geometry.attributes.position.count;
      if (v > topV) { topV = v; top = c; }
    });
    if (top) { top.material = mkPaint(); bodyMeshes = [top]; }
  }

  // Preparar el giro idle de las llantas (fuera de model.traverse: envolver una
  // malla en un grupo pivote modifica el árbol de la escena y rompe la iteración).
  rimMeshes.forEach(setupWheelSpin);
}

function swapModel(model, brand) {
  if (currentModel) scene.remove(currentModel);
  currentModel = model;
  scene.add(model);
  applyColor(currentColorIdx);
  autoRotate = true;
  rotY = 0.5;
  updateCamera();
}

// ── COLOR ─────────────────────────────────────────────────────
// paintMetal: metalness visible en nuestro setup sin HDRI completo
// El color real necesita metalness ≤ 0.45 para ser legible con luces puntuales
function paintMetal(rawMetal) { return Math.min(rawMetal, 0.45); }

// Barniz (clearcoat): doble reflejo típico de pintura de coche real.
// Gloss/Metallic/Pearl llevan capa de barniz brillante; Satin un leve brillo; Matte ninguno.
function clearcoatForFinish(finish) {
  switch (finish) {
    case 'Matte': return { cc: 0.0,  ccr: 0.6 };
    case 'Satin': return { cc: 0.25, ccr: 0.3 };
    case 'Pearl': return { cc: 1.0,  ccr: 0.02 };
    default:      return { cc: 1.0,  ccr: 0.04 }; // Gloss / Metallic
  }
}

// Fibra de carbono: textura tejida procedural (patrón 2x2), generada una vez y reutilizada.
function makeCarbonTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const ctx = c.getContext('2d');
  const tile = 4;
  for (let y = 0; y < 32; y += tile) {
    for (let x = 0; x < 32; x += tile) {
      const odd = ((x / tile) + (y / tile)) % 2 === 0;
      ctx.fillStyle = odd ? '#1e1e1e' : '#0c0c0c';
      ctx.fillRect(x, y, tile, tile);
      ctx.fillStyle = odd ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)';
      ctx.fillRect(x, y, tile, tile / 2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 10);
  tex.encoding = THREE.sRGBEncoding;
  return tex;
}

function getCarbonTexture() {
  if (!carbonTexture) carbonTexture = makeCarbonTexture();
  return carbonTexture;
}

function applyColor(idx) {
  currentColorIdx = idx;
  const col   = COLORS[idx];
  const color = new THREE.Color(col.hex);
  const metal = paintMetal(col.metal);
  // Colores mate/satin con metalness bajo ya se ven bien; gloss/metallic cap a 0.45
  const rough = col.finish === 'Matte' ? col.rough : Math.max(col.rough, 0.14);
  // Mate/Satinado sin resplandor propio → más contraste de sombras y relieve
  const ei = (col.finish === 'Matte' || col.finish === 'Satin') ? 0.04 : 0.18;
  const cc = clearcoatForFinish(col.finish);

  bodyMeshes.forEach(mesh => {
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach(mat => {
      if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
        mat.color.set(color);
        mat.metalness = metal;
        mat.roughness = rough;
        mat.envMapIntensity = 2.0;
        if (!mat.emissive) mat.emissive = new THREE.Color(0);
        mat.emissive.set(color);
        mat.emissiveIntensity = ei;
        if ('clearcoat' in mat) { mat.clearcoat = cc.cc; mat.clearcoatRoughness = cc.ccr; }
        mat.transparent = xrayMode;
        mat.opacity = xrayMode ? XRAY_OPACITY : 1.0;
        mat.depthWrite = !xrayMode;
        mat.needsUpdate = true;
      } else {
        mesh.material = new THREE.MeshPhysicalMaterial({
          color, metalness: metal, roughness: rough, envMapIntensity: 2.0,
          emissive: new THREE.Color(col.hex), emissiveIntensity: ei,
          clearcoat: cc.cc, clearcoatRoughness: cc.ccr,
          transparent: xrayMode, opacity: xrayMode ? XRAY_OPACITY : 1.0, depthWrite: !xrayMode,
        });
      }
    });
  });
}

// Vista de rayos X: carrocería semitransparente para revelar chasis/interior ("blueprint").
function setXrayMode(on) {
  xrayMode = on;
  applyColor(currentColorIdx);
}

// ── CALIPER COLOR ─────────────────────────────────────────────
function applyCaliperColor(hex) {
  const color = new THREE.Color(hex);
  caliperMeshes.forEach(mesh => {
    if (!mesh.isMesh) return;
    mesh.material.color.set(color);
    mesh.material.emissive?.set(color);
    mesh.material.emissiveIntensity = 0.15;
    mesh.material.needsUpdate = true;
  });
}

// ── INTERIOR COLOR ─────────────────────────────────────────────
function applyInteriorColor(hex, interiorId) {
  const color = new THREE.Color(hex);
  const finish = INTERIOR_FINISH[interiorId] || DEFAULT_LEATHER_FINISH;
  interiorMeshes.forEach(mesh => {
    if (!mesh.isMesh) return;
    mesh.material.color.set(color);
    mesh.material.roughness = finish.rough;
    mesh.material.metalness = finish.metal;
    mesh.material.needsUpdate = true;
  });
}

// ── WHEEL STYLE ───────────────────────────────────────────────
function applyWheels(wheelId) {
  const ws = WHEEL_STYLES[wheelId] || WHEEL_STYLES['serie'];
  const color = new THREE.Color(ws.hex);
  rimMeshes.forEach(mesh => {
    if (!mesh.isMesh) return;
    mesh.material.color.set(color);
    mesh.material.metalness = ws.metal;
    mesh.material.roughness = ws.rough;
    mesh.material.needsUpdate = true;
  });
}

// ── FALLBACK PROCEDURAL (silueta extruida real) ───────────────
function buildFallback(brand) {
  if (currentModel) scene.remove(currentModel);
  bodyMeshes    = [];
  caliperMeshes = [];
  rimMeshes     = [];
  spinTargets   = [];
  interiorMeshes = [];
  currentFile = null;

  // Perfiles por marca: hd=hood ratio, bh=belt height, nh=nose height,
  // rh=rear deck height, rfS=roof slope (fastback factor), wing, wf=wide fenders
  const P = {
    'Ferrari':      { l:4.60, w:2.00, h:1.15, hd:0.38, bh:0.42, nh:0.26, rh:0.38, rfS:0.30, wing:false, wf:false },
    'Lamborghini':  { l:4.72, w:2.10, h:1.18, hd:0.36, bh:0.38, nh:0.22, rh:0.35, rfS:0.55, wing:true,  wf:true  },
    'Porsche':      { l:4.52, w:1.85, h:1.30, hd:0.34, bh:0.44, nh:0.28, rh:0.42, rfS:0.20, wing:false, wf:false },
    'McLaren':      { l:4.54, w:2.02, h:1.20, hd:0.34, bh:0.38, nh:0.20, rh:0.36, rfS:0.45, wing:false, wf:false },
    'Aston Martin': { l:4.73, w:1.96, h:1.26, hd:0.44, bh:0.44, nh:0.28, rh:0.42, rfS:0.22, wing:false, wf:false },
    'Bugatti':      { l:4.54, w:2.04, h:1.18, hd:0.40, bh:0.40, nh:0.26, rh:0.38, rfS:0.30, wing:true,  wf:true  },
    'Maserati':     { l:4.64, w:2.00, h:1.22, hd:0.42, bh:0.42, nh:0.26, rh:0.40, rfS:0.28, wing:false, wf:false },
    'Ford':         { l:4.78, w:1.92, h:1.38, hd:0.46, bh:0.48, nh:0.30, rh:0.44, rfS:0.30, wing:false, wf:true  },
    'Nissan':       { l:4.71, w:2.06, h:1.24, hd:0.40, bh:0.44, nh:0.28, rh:0.40, rfS:0.38, wing:true,  wf:true  },
    'Audi':         { l:4.44, w:1.94, h:1.24, hd:0.38, bh:0.40, nh:0.24, rh:0.38, rfS:0.36, wing:false, wf:false },
  };

  const p = P[brand] || P['Ferrari'];
  const col = COLORS[currentColorIdx];
  const group = new THREE.Group();
  const L = p.l, W = p.w, H = p.h;

  // ── Materiales ──────────────────────────────────────────────
  const _cc = clearcoatForFinish(col.finish);
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(col.hex), metalness: col.metal, roughness: col.rough, envMapIntensity: 1.9,
    clearcoat: _cc.cc, clearcoatRoughness: _cc.ccr,
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88aacc, metalness: 0.1, roughness: 0.04, transparent: true, opacity: 0.25
  });
  const darkMat  = new THREE.MeshStandardMaterial({ color: 0x080808, metalness: 0.88, roughness: 0.22 });
  const chrome   = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1.0, roughness: 0.03 });
  const tire     = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.96 });
  const rimMat   = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.96, roughness: 0.05 });
  const caliperMat = new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.7, roughness: 0.3 });
  const lightF   = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffcc, emissiveIntensity: 1.6 });
  const lightR   = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 2.0 });
  const drlMat   = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 4.5 });
  const lbarMat  = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 3.0 });

  function add(geo, mat, x, y, z, rx, ry, rz) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x||0, y||0, z||0);
    if (rx !== undefined) m.rotation.x = rx;
    if (ry !== undefined) m.rotation.y = ry;
    if (rz !== undefined) m.rotation.z = rz;
    m.castShadow = true;
    group.add(m);
    return m;
  }

  // ── CUERPO PRINCIPAL: silueta extruida real ─────────────────
  // Puntos clave del perfil lateral
  const hoodEndX   = L/2 - L * p.hd;       // fin del capó / base parabrisas
  const deckStartX = -L/2 + L * 0.22;      // inicio de la ventana trasera
  const beltH      = H * p.bh;             // línea de cintura
  const noseH      = H * p.nh;             // altura del frontal / parachoques
  const deckH      = H * p.rh;             // altura del maletero/cubierta trasera
  const roofPeak   = H * (0.98 + p.rfS * 0.03); // altura máxima del techo

  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(L/2, 0.04);                              // esquina frontal inferior
  bodyShape.lineTo(L/2 + 0.015, noseH * 0.55);             // cara frontal bumper
  // Curva frontal → capó (transición redondeada)
  bodyShape.quadraticCurveTo(L/2 - 0.06, noseH * 1.05, L/2 - L*0.06, noseH);
  // Capó con ligera inclinación
  bodyShape.quadraticCurveTo(L/2 - L*p.hd*0.5, beltH * 0.86, hoodEndX + L*0.02, beltH - H*0.01);
  bodyShape.lineTo(hoodEndX, beltH);
  // Base del parabrisas (pequeño escalón)
  bodyShape.lineTo(hoodEndX - L*0.02, beltH + H*0.04);
  // Pilar A → techo (bezier suave)
  bodyShape.bezierCurveTo(
    hoodEndX - L*0.06, H * 0.88,
    hoodEndX - L*0.13, roofPeak * 0.98,
    hoodEndX - L*0.16, roofPeak
  );
  // Techo curvo
  bodyShape.quadraticCurveTo(0, roofPeak * (1 + p.rfS * 0.02), deckStartX + L*0.14, roofPeak);
  // Pilar C → cubierta trasera
  bodyShape.bezierCurveTo(
    deckStartX + L*0.08, roofPeak * 0.92,
    deckStartX + L*0.04, deckH + H*(0.08 + p.rfS*0.06),
    deckStartX, deckH + H*0.02
  );
  // Cubierta trasera
  bodyShape.lineTo(-L/2 + L*0.06, deckH);
  // Cara trasera bumper
  bodyShape.lineTo(-L/2, deckH * 0.60);
  bodyShape.lineTo(-L/2 - 0.01, 0.04);
  // Fondo
  bodyShape.lineTo(L/2, 0.04);

  const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, {
    depth: W * 0.82, bevelEnabled: false
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  // Extrusión a lo largo de +Z → centrar
  bodyMesh.position.set(0, 0, -W * 0.41);
  bodyMesh.castShadow = true;
  bodyMeshes.push(bodyMesh);
  group.add(bodyMesh);

  // ── ALETAS / GUARDABARROS (más anchos que el cuerpo) ────────
  const fW = p.wf ? W * 0.095 : W * 0.055;
  const fH = H * 0.36;
  [-1,1].forEach(s => {
    // Aleta delantera
    const ff = new THREE.Mesh(new THREE.BoxGeometry(L*0.44, fH, fW), bodyMat);
    ff.position.set(L/2 - L*0.22, fH*0.5 + 0.04, s*(W*0.41 + fW*0.5));
    ff.castShadow = true; bodyMeshes.push(ff); group.add(ff);
    // Aleta trasera
    const rf = new THREE.Mesh(new THREE.BoxGeometry(L*0.38, fH + H*0.04, fW), bodyMat);
    rf.position.set(-L*0.27, (fH + H*0.04)*0.5 + 0.04, s*(W*0.41 + fW*0.5));
    rf.castShadow = true; bodyMeshes.push(rf); group.add(rf);
    // Faldón lateral
    const sill = new THREE.Mesh(new THREE.BoxGeometry(L*0.50, H*0.07, W*0.03), darkMat);
    sill.position.set(0, H*0.055, s*(W*0.41 + W*0.015));
    sill.castShadow = true; group.add(sill);
  });

  // ── FRONTAL: rejilla + splitter ──────────────────────────────
  // Abertura de rejilla superior
  add(new THREE.BoxGeometry(0.055, noseH*0.52, W*0.52), darkMat, L/2+0.015, noseH*0.58);
  // Toma de aire inferior
  add(new THREE.BoxGeometry(0.055, noseH*0.38, W*0.65), darkMat, L/2+0.015, noseH*0.22);
  // Splitter
  const spl = add(new THREE.BoxGeometry(0.24, 0.028, W*0.76), darkMat, L/2-0.08, 0.027);
  bodyMeshes.push(spl);
  // Listones de rejilla
  for (let i = 0; i < 4; i++) {
    add(new THREE.BoxGeometry(0.065, 0.015, W*0.48), darkMat, L/2+0.015, noseH*0.34 + i*noseH*0.16);
  }
  // Logo / centre pin
  const logo = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), chrome);
  logo.rotation.x = Math.PI/2;
  logo.position.set(L/2+0.022, noseH*0.72, 0);
  group.add(logo);

  // ── FAROS DELANTEROS ────────────────────────────────────────
  [-1,1].forEach(s => {
    // Caja del faro
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.07, H*0.068, W*0.145), lightF);
    hl.position.set(L/2-0.018, noseH + H*0.04, s*W*0.355);
    group.add(hl);
    // DRL strip (línea luminosa)
    const drl = new THREE.Mesh(new THREE.BoxGeometry(0.008, H*0.014, W*0.17), drlMat);
    drl.position.set(L/2+0.004, noseH*0.96, s*W*0.355);
    group.add(drl);
    // Proyector circular
    const proj = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16), lightF);
    proj.rotation.z = Math.PI/2;
    proj.position.set(L/2-0.01, noseH+H*0.04, s*W*0.32);
    group.add(proj);
  });

  // ── PILOTOS TRASEROS ────────────────────────────────────────
  [-1,1].forEach(s => {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.038, H*0.075, W*0.24), lightR);
    tl.position.set(-L/2+0.014, deckH*0.60, s*W*0.32);
    group.add(tl);
  });
  // Barra LED trasera de extremo a extremo
  const lbar = new THREE.Mesh(new THREE.BoxGeometry(0.024, H*0.013, W*0.70), lbarMat);
  lbar.position.set(-L/2 + 0.014, deckH * 0.88, 0);
  group.add(lbar);

  // ── DIFUSOR + ESCAPES ───────────────────────────────────────
  add(new THREE.BoxGeometry(0.24, H*0.068, W*0.80), darkMat, -L/2+0.10, H*0.04, 0, -0.22);
  [-1,1].forEach(s => {
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.033, 0.042, 0.24, 16), chrome);
    ex.rotation.z = Math.PI/2;
    ex.position.set(-L/2+0.02, H*0.092, s*W*0.26);
    group.add(ex);
    const exI = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.26, 8), darkMat);
    exI.rotation.z = Math.PI/2;
    exI.position.set(-L/2+0.02, H*0.092, s*W*0.26);
    group.add(exI);
  });

  // ── ALERÓN TRASERO ──────────────────────────────────────────
  if (p.wing) {
    const wSpan = W * 0.92;
    // Plano aerodinámico
    const wingBlade = add(new THREE.BoxGeometry(0.08, 0.072, wSpan), darkMat, -L*0.40, H*0.52, 0, 0, 0, -0.06);
    bodyMeshes.push(wingBlade);
    // Soportes
    [-1,1].forEach(s => add(new THREE.BoxGeometry(0.048, 0.20, 0.048), darkMat, -L*0.40, H*0.42, s*wSpan*0.42));
    // Gurney flap
    add(new THREE.BoxGeometry(0.028, 0.048, wSpan), darkMat, -L*0.40-0.048, H*0.548);
  }

  // ── CRISTALES ───────────────────────────────────────────────
  const wsAngle = 0.46 + p.bh * 0.08;
  // Parabrisas
  const ws = new THREE.Mesh(new THREE.PlaneGeometry(W*0.78, H*0.32), glassMat);
  ws.position.set(hoodEndX - L*0.10, H*0.72, 0);
  ws.rotation.x = -wsAngle;
  group.add(ws);
  // Luneta trasera
  const rw = new THREE.Mesh(new THREE.PlaneGeometry(W*0.72, H*(0.22 + p.rfS*0.08)), glassMat);
  rw.position.set(deckStartX + L*0.08, H*0.70, 0);
  rw.rotation.x = wsAngle * (1 + p.rfS * 0.5);
  group.add(rw);
  // Ventanas laterales
  [-1,1].forEach(s => {
    const sw = new THREE.Mesh(new THREE.PlaneGeometry(L*0.28, H*0.24), glassMat);
    sw.position.set(hoodEndX - L*0.16, H*0.70, s*W*0.42);
    sw.rotation.y = s * Math.PI/2;
    group.add(sw);
  });

  // ── RUEDAS ──────────────────────────────────────────────────
  const wY = 0.33;
  [[L*0.30, W*0.5+0.03],[L*0.30,-W*0.5-0.03],[-L*0.28,W*0.5+0.03],[-L*0.28,-W*0.5-0.03]]
  .forEach(([x, z]) => {
    const s = z > 0 ? 1 : -1;
    // Neumático
    add(new THREE.CylinderGeometry(0.32, 0.32, 0.24, 32), tire, x, wY, z, Math.PI/2);
    // Llanta — material clonado para poder cambiar color independientemente
    const rimM = rimMat.clone();
    const rimFace = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.215, 0.25, 10), rimM);
    rimFace.rotation.x = Math.PI/2;
    rimFace.position.set(x, wY, z+s*0.01);
    rimFace.castShadow = true;
    group.add(rimFace);
    rimMeshes.push(rimFace);
    // Radios (5 radios)
    for (let a = 0; a < 5; a++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.385, 0.026), rimM);
      spoke.rotation.z = (a/5) * Math.PI;
      spoke.position.set(x, wY, z + s*0.025);
      group.add(spoke);
      rimMeshes.push(spoke);
    }
    // Centro / buje
    add(new THREE.CylinderGeometry(0.058, 0.058, 0.27, 8), chrome, x, wY, z+s*0.03, Math.PI/2);
    // Disco de freno
    add(new THREE.CylinderGeometry(0.178, 0.178, 0.038, 16), darkMat, x, wY, z+s*0.045, Math.PI/2);
    // Pinza / caliper
    const cal = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.095, 0.072), caliperMat);
    cal.position.set(x, wY - 0.065, z + s*0.145);
    group.add(cal);
    caliperMeshes.push(cal);
  });

  currentModel = group;
  scene.add(group);
  applyColor(currentColorIdx);
  autoRotate = true; rotY = 0.5;
  updateCamera();
}

function showLoadingState(visible) {
  const el = document.getElementById('model-loader');
  if (el) el.style.display = visible ? 'flex' : 'none';
}

// Captura el frame actual del visor y dispara la descarga como PNG.
function captureImage(filename) {
  if (composer) composer.render(); else renderer.render(scene, camera);
  const link = document.createElement('a');
  link.download = (filename || 'apex-build') + '.png';
  link.href = renderer.domElement.toDataURL('image/png');
  link.click();
}

window.Car3D = { initThree, loadModel, applyColor, applyCaliperColor, applyWheels, applyInteriorColor, buildFallback, setNightMode, setCameraView, setUnderglow, setXrayMode, captureImage, COLORS, MODEL_MAP, WHEEL_STYLES };
