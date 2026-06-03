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
let currentModel = null;
let bodyMeshes    = [];
let caliperMeshes = [];
let rimMeshes     = [];   // llantas — para cambiar color/estilo
let currentColorIdx = 0;
let autoRotate = true;
let loadedBrands = {};    // cache: brand → { model, normalizedFor }
let rotY = 0.5, rotX = 0.15, dist = 8;
let isDragging = false, lx = 0, ly = 0;
let hintHidden = false;

// Estilos de llantas: color y propiedades PBR
const WHEEL_STYLES = {
  serie:      { hex: 0xaaaaaa, metal: 0.92, rough: 0.10 },
  sport_20:   { hex: 0x888888, metal: 0.90, rough: 0.14 },
  forged_21:  { hex: 0xcccccc, metal: 0.97, rough: 0.04 },
  diamond_21: { hex: 0xe8e8e8, metal: 1.00, rough: 0.02 },
  carbon_20:  { hex: 0x222222, metal: 0.28, rough: 0.42 },
};

// ── INIT THREE.JS ─────────────────────────────────────────────
function initThree(mountId) {
  const mount = document.getElementById(mountId);
  const W = mount.clientWidth;
  const H = mount.clientHeight;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
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
  setupEnvMap();
  setupOrbitControls(mount);
  setupResize(mount);
  animate();
}

function setupLights() {
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));  // alto para que colores metálicos sean visibles

  const key = new THREE.DirectionalLight(0xfff8e8, 2.8);
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

  scene.add(new THREE.HemisphereLight(0x444444, 0x111111, 0.5));

  [-4, 4].forEach(x => {
    const spot = new THREE.SpotLight(0xffffff, 1.8, 22, Math.PI / 5.5, 0.35, 1);
    spot.position.set(x, 9, 2);
    spot.target.position.set(x * 0.25, 0, 0);
    scene.add(spot);
    scene.add(spot.target);
  });
}

function setupEnvironment() {
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x070707,
    metalness: 0.96,
    roughness: 0.04,
    envMapIntensity: 1.0,
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

function setupResize(container) {
  const ro = new ResizeObserver(() => {
    const W = container.clientWidth;
    const H = container.clientHeight;
    renderer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  });
  ro.observe(container);
}

function animate() {
  requestAnimationFrame(animate);
  if (autoRotate) { rotY += 0.003; updateCamera(); }
  renderer.render(scene, camera);
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
  const cfg = cfgOverride || MODEL_MAP[brand] || {};

  // ── Materiales ─────────────────────────────────────────────
  const col  = COLORS[currentColorIdx];
  const _pm  = paintMetal(col.metal);
  const _pr  = col.finish === 'Matte' ? col.rough : Math.max(col.rough, 0.16);
  const mkPaint = () => new THREE.MeshStandardMaterial({
    color: new THREE.Color(col.hex), metalness: _pm, roughness: _pr,
    envMapIntensity: 2.0,
    emissive: new THREE.Color(col.hex), emissiveIntensity: 0.18,
  });
  const glbGlass   = new THREE.MeshPhysicalMaterial({ color:0x9ab0c8, metalness:0.05, roughness:0.02, transparent:true, opacity:0.22 });
  const glbTire    = new THREE.MeshStandardMaterial({ color:0x080808, metalness:0.0,  roughness:0.97 });
  const glbRimMat  = new THREE.MeshStandardMaterial({ color:0xbbbbbb, metalness:0.96, roughness:0.06, envMapIntensity:1.8 });
  const glbLight   = new THREE.MeshStandardMaterial({ color:0xffffff, emissive:new THREE.Color(0xffffcc), emissiveIntensity:1.0 });
  const glbLightR  = new THREE.MeshStandardMaterial({ color:0xff2200, emissive:new THREE.Color(0xff2200), emissiveIntensity:1.4 });
  const glbDark    = new THREE.MeshStandardMaterial({ color:0x101010, metalness:0.25, roughness:0.80 });
  const glbChrome  = new THREE.MeshStandardMaterial({ color:0xcccccc, metalness:0.99, roughness:0.03, envMapIntensity:2.0 });
  const glbCaliper = new THREE.MeshStandardMaterial({ color:0xcc0000, metalness:0.65, roughness:0.32 });

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
      child.material = glbRimMat.clone(); rimMeshes.push(child); return;
    }
    if (n.includes('headlight') || n.includes('drl') || n.includes('led') ||
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
      child.material = glbDark; return;
    }
    if (n.includes('chrome') || n.includes('exhaust') || n.includes('trim_metal') || n.includes('grille') || n.includes('grill')) {
      child.material = glbChrome; return;
    }

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

function applyColor(idx) {
  currentColorIdx = idx;
  const col   = COLORS[idx];
  const color = new THREE.Color(col.hex);
  const metal = paintMetal(col.metal);
  // Colores mate/satin con metalness bajo ya se ven bien; gloss/metallic cap a 0.45
  const rough = col.finish === 'Matte' ? col.rough : Math.max(col.rough, 0.14);

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
        mat.emissiveIntensity = 0.18;
        mat.needsUpdate = true;
      } else {
        mesh.material = new THREE.MeshStandardMaterial({
          color, metalness: metal, roughness: rough, envMapIntensity: 2.0,
          emissive: new THREE.Color(col.hex), emissiveIntensity: 0.18,
        });
      }
    });
  });
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
  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(col.hex), metalness: col.metal, roughness: col.rough, envMapIntensity: 1.9
  });
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88aacc, metalness: 0.1, roughness: 0.04, transparent: true, opacity: 0.25
  });
  const darkMat  = new THREE.MeshStandardMaterial({ color: 0x080808, metalness: 0.88, roughness: 0.22 });
  const chrome   = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 1.0, roughness: 0.03 });
  const tire     = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.96 });
  const rimMat   = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.96, roughness: 0.05 });
  const caliperMat = new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.7, roughness: 0.3 });
  const lightF   = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffcc, emissiveIntensity: 0.9 });
  const lightR   = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 1.3 });
  const drlMat   = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3.5 });
  const lbarMat  = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 2.2 });

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

window.Car3D = { initThree, loadModel, applyColor, applyCaliperColor, applyWheels, buildFallback, COLORS, MODEL_MAP, WHEEL_STYLES };
