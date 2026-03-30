
// Initialize Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

// Initialize Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 28;
camera.position.y = 5.2;

// Initialize Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Particle System Setup
const particleCount = 15000;
const geometry = new THREE.BufferGeometry();
const posA = new Float32Array(particleCount * 3); // Ring
const posB = new Float32Array(particleCount * 3); // Globe
const posWeb = new Float32Array(particleCount * 3);
const posSocial = new Float32Array(particleCount * 3);
const posData = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const cWeb = new Float32Array(particleCount * 3);
const cSocial = new Float32Array(particleCount * 3);
const cData = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);
const randoms = new Float32Array(particleCount);

const majorRadius = 12;
const minorRadius = 2.5;
const globeRadius = 7.5;

const color_blue = new THREE.Color(0x2266ff);
const color_purple = new THREE.Color(0x8844ff);
const color_gold = new THREE.Color(0xffaa00);

// Palettes
const color_wd_blue = new THREE.Color(0x00f2fe);
const color_wd_purple = new THREE.Color(0x9966ff);
const color_sm_red = new THREE.Color(0xff3333);
const color_sm_orange = new THREE.Color(0xffaa00);
const color_sm_pink = new THREE.Color(0xff44aa);
const color_sm_yellow = new THREE.Color(0xffff00);
const color_ds_green = new THREE.Color(0x00ff88);
const color_ds_dark = new THREE.Color(0x006622);

// Generate particle positions and colors
for (let i = 0; i < particleCount; i++) {
  const u = Math.random() * Math.PI * 2;
  const v = Math.random() * Math.PI * 2;
  const r = majorRadius + (Math.cos(v) * minorRadius) + (Math.random() - 0.5) * 0.4;
  posA[i * 3] = r * Math.cos(u);
  posA[i * 3 + 1] = r * Math.sin(u);
  posA[i * 3 + 2] = (Math.sin(v) * minorRadius * 0.8) + (Math.random() - 0.5) * 0.5;

  const phi = Math.acos(-1 + (2 * i) / particleCount);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  posB[i * 3] = globeRadius * Math.cos(theta) * Math.sin(phi);
  posB[i * 3 + 1] = globeRadius * Math.sin(theta) * Math.sin(phi);
  posB[i * 3 + 2] = globeRadius * Math.cos(phi);

  randoms[i] = Math.random();
  sizes[i] = Math.random() * 0.4 + 0.22;

  const normalizedY = (posA[i * 3 + 1] + majorRadius) / (majorRadius * 2);
  const color = new THREE.Color();
  if (normalizedY < 0.2) color.lerpColors(color_blue, color_purple, normalizedY / 0.2);
  else if (normalizedY < 0.4) color.lerpColors(color_purple, color_gold, (normalizedY - 0.2) / 0.2);
  else color.set(color_gold);

  colors[i * 3] = color.r;
  colors[i * 3 + 1] = color.g;
  colors[i * 3 + 2] = color.b;

  // Web Dev Palette
  const wc = new THREE.Color().lerpColors(color_wd_blue, color_wd_purple, Math.random());
  cWeb[i * 3] = wc.r; cWeb[i * 3 + 1] = wc.g; cWeb[i * 3 + 2] = wc.b;

  // Social Media Palette
  const smRand = Math.random();
  const sc = new THREE.Color();
  if (smRand < 0.25) sc.copy(color_sm_red);
  else if (smRand < 0.5) sc.copy(color_sm_orange);
  else if (smRand < 0.75) sc.copy(color_sm_pink);
  else sc.copy(color_sm_yellow);
  cSocial[i * 3] = sc.r; cSocial[i * 3 + 1] = sc.g; cSocial[i * 3 + 2] = sc.b;

  // Data Science Palette
  const dc = new THREE.Color().lerpColors(color_ds_green, color_ds_dark, Math.random());
  cData[i * 3] = dc.r; cData[i * 3 + 1] = dc.g; cData[i * 3 + 2] = dc.b;
}

const ICON_SCALE = 0.85;

function addLine(targetArray, startIndex, count, x1, y1, x2, y2) {
  for (let i = 0; i < count; i++) {
    const t = Math.random();
    const idx = (startIndex + i) * 3;
    const nx = -(y2 - y1);
    const ny = (x2 - x1);
    const len = Math.sqrt(nx * nx + ny * ny);

    const thick = (Math.random() - 0.5) * 0.6;
    const jitterX = (Math.random() - 0.5) * 0.3;
    const jitterY = (Math.random() - 0.5) * 0.3;

    targetArray[idx] = (x1 + (x2 - x1) * t + (nx / len) * thick + jitterX) * ICON_SCALE;
    targetArray[idx + 1] = (y1 + (y2 - y1) * t + (ny / len) * thick + jitterY) * ICON_SCALE;
    targetArray[idx + 2] = (Math.random() - 0.5) * 2.0;
  }
}

function addCircle(targetArray, startIndex, count, cx, cy, radius, fill) {
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = fill ? Math.sqrt(Math.random()) * radius : radius + (Math.random() - 0.5) * 1.0;
    const idx = (startIndex + i) * 3;

    const jitterX = (Math.random() - 0.5) * 0.8;
    const jitterY = (Math.random() - 0.5) * 0.8;

    targetArray[idx] = (cx + r * Math.cos(theta) + jitterX) * ICON_SCALE;
    targetArray[idx + 1] = (cy + r * Math.sin(theta) + jitterY) * ICON_SCALE;
    targetArray[idx + 2] = (Math.random() - 0.5) * 4.0;
  }
}

function fillNoise(targetArray, startIndex) {
  for (let i = startIndex; i < particleCount; i++) {
    const idx = i * 3;
    targetArray[idx] = (Math.random() - 0.5) * 60.0;
    targetArray[idx + 1] = (Math.random() - 0.5) * 60.0;
    targetArray[idx + 2] = (Math.random() - 0.5) * 60.0;
  }
}

// Web Dev (1)
addLine(posWeb, 0, 1000, -4, 3, -7, 0);
addLine(posWeb, 1000, 1000, -7, 0, -4, -3);
addLine(posWeb, 2000, 1000, -1, -4, 1, 4);
addLine(posWeb, 3000, 1000, 4, 3, 7, 0);
addLine(posWeb, 4000, 1000, 7, 0, 4, -3);
fillNoise(posWeb, 5000);

// Social Media (2)
addLine(posSocial, 0, 800, -6, -4, 6, -4);
addLine(posSocial, 800, 800, 6, -4, 6, 4);
addLine(posSocial, 1600, 800, 6, 4, -6, 4);
addLine(posSocial, 2400, 800, -6, 4, -6, -4);
addCircle(posSocial, 3200, 2000, 0, 0, 2.5, false);
addCircle(posSocial, 5200, 800, 4, 2.5, 0.5, true);
fillNoise(posSocial, 6000);

// Data Science (3)
addLine(posData, 0, 800, -7, -5, -7, 5);
addLine(posData, 800, 800, -7, -5, 7, -5);
addLine(posData, 1600, 1000, -5, -3, -2, 0);
addLine(posData, 2600, 1000, -2, 0, 1, -2);
addLine(posData, 3600, 1000, 1, -2, 4, 2);
addLine(posData, 4600, 1000, 4, 2, 7, 6);
fillNoise(posData, 5600);

geometry.setAttribute('posWeb', new THREE.BufferAttribute(posWeb, 3));
geometry.setAttribute('posSocial', new THREE.BufferAttribute(posSocial, 3));
geometry.setAttribute('posData', new THREE.BufferAttribute(posData, 3));
geometry.setAttribute('colorWeb', new THREE.BufferAttribute(cWeb, 3));
geometry.setAttribute('colorSocial', new THREE.BufferAttribute(cSocial, 3));
geometry.setAttribute('colorData', new THREE.BufferAttribute(cData, 3));

geometry.setAttribute('position', new THREE.BufferAttribute(posA, 3));
geometry.setAttribute('posTarget', new THREE.BufferAttribute(posB, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
geometry.setAttribute('random', new THREE.BufferAttribute(randoms, 1));

// Custom Shader Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    uScroll: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uHover: { value: 0 },
    uHoverMorph: { value: 0 },
    uActiveIcon: { value: 0 },
    uTargetColor: { value: new THREE.Color(0xffffff) }
  },
  vertexShader: `
        attribute vec3 posTarget;
        attribute vec3 posWeb;
        attribute vec3 posSocial;
        attribute vec3 posData;
        attribute vec3 color;
        attribute vec3 colorWeb;
        attribute vec3 colorSocial;
        attribute vec3 colorData;
        attribute float size;
        attribute float random;
        varying vec3 vColor;
        varying float vGlow;
        varying float vInteraction;
        uniform float time;
        uniform float uScroll;
        uniform vec2 uMouse;
        uniform float uHover;
        uniform float uHoverMorph;
        uniform float uActiveIcon;
        uniform vec3 uTargetColor;
        
        void main() {
          vec3 targetIconColor = mix(colorWeb, colorSocial, step(1.5, uActiveIcon));
          targetIconColor = mix(targetIconColor, colorData, step(2.5, uActiveIcon));

          vColor = mix(color, targetIconColor, uHoverMorph);
          float morph = smoothstep(0.0, 0.5, uScroll);
          vec3 pos = mix(position, posTarget, morph);
          
          float activeOrbit = (1.0 - morph) * 0.6;
          float orbitX = cos(time * 0.4) * activeOrbit;
          float orbitY = sin(time * 0.4) * activeOrbit;
          
          float rotSpeed = time * 0.25;
          float s = sin(rotSpeed); float c = cos(rotSpeed);
          
          vec3 basePos = pos;
          float nx = basePos.x * c - basePos.z * s;
          float nz = basePos.x * s + basePos.z * c;
          basePos.x = nx; basePos.z = nz;
          
          vec3 shapeWeb = posWeb;
          vec3 shapeSocial = mix(shapeWeb, posSocial, step(1.5, uActiveIcon));
          vec3 finalShape = mix(shapeSocial, posData, step(2.5, uActiveIcon));
          
          vec3 finalPos = mix(basePos, finalShape, uHoverMorph);
          
          float section2Center = smoothstep(0.2, 0.6, uScroll) * (1.0 - smoothstep(0.8, 1.0, uScroll));
          float tx = section2Center * 15.0;
          
          finalPos.x += tx + orbitX;
          finalPos.y += orbitY;
          
          vec3 worldMouse = vec3(uMouse.x * 15.0, uMouse.y * 10.0, 0.0);
          float d = distance(finalPos, worldMouse);
          float hoverEffect = smoothstep(6.0, 0.0, d) * morph;
          vInteraction = hoverEffect;
          
          float pulse = (sin(time * 2.0 + random * 10.0) * 0.1 + 1.0) * (1.0 + hoverEffect * 0.6);
          
          // Precise fade: gently fades out the globe entirely before Section 4 begins
          float fade = 1.0 - smoothstep(1.2, 1.48, uScroll);
          
          vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
          gl_PointSize = size * pulse * (700.0 / -mvPosition.z) * fade;
          gl_Position = projectionMatrix * mvPosition;
          
          float depth = -mvPosition.z;
          vGlow = (1.0 - smoothstep(20.0, 50.0, depth)) * fade;
        }
    `,
  fragmentShader: `
        varying vec3 vColor;
        varying float vGlow;
        varying float vInteraction;
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha = pow(alpha, 1.5);
          float core = 1.0 - smoothstep(0.0, 0.2, dist);
          
          vec3 finalColor = vColor * (alpha + core * 0.6 + vInteraction * 1.5) * vGlow;
          gl_FragColor = vec4(finalColor, (alpha + vInteraction * 0.4) * vGlow);
        }
    `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// Mouse Tracking
let mouseX = 0, mouseY = 0;
let targetTiltX = 0, targetTiltY = 0;
let targetHoverMorph = 0;
let currentIcon = 1.0;
let iconTargetColor = new THREE.Color(0xffffff);

const cards = document.querySelectorAll('.service-card');
cards.forEach((card, index) => {
  card.addEventListener('mouseenter', () => {
    targetHoverMorph = 1.0;
    if (index === 1) { currentIcon = 1.0; iconTargetColor.set(0xffffff); }
    else if (index === 0) { currentIcon = 2.0; iconTargetColor.set(0xffffff); }
    else if (index === 2) { currentIcon = 3.0; iconTargetColor.set(0xffffff); }
  });
  card.addEventListener('mouseleave', () => {
    targetHoverMorph = 0.0;
  });
});

window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  material.uniforms.uMouse.value.set(mouseX, mouseY);
  targetTiltX = mouseY * 0.1;
  targetTiltY = mouseX * 0.1;
});

// Intersection Observer for section animations
const observerOptions = { threshold: 0.2 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.target.id === 'about') {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
      else entry.target.classList.remove('in-view');
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => observer.observe(section));

let scrollProgress = 0;

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const vh = window.innerHeight;
  const s3Top = 2 * vh;
  const s3Height = document.getElementById('services').offsetHeight;

  // Safely map uScroll to compensate for the extended Section 3 length
  if (scrolled <= s3Top) {
    scrollProgress = scrolled / (2 * vh);
  } else if (scrolled <= s3Top + s3Height) {
    scrollProgress = 1.0 + ((scrolled - s3Top) / s3Height) * 0.5;
  } else {
    const s4scroll = scrolled - (s3Top + s3Height);
    scrollProgress = 1.5 + (s4scroll / (2 * vh));
  }

  // Sync reveal for Section 5 (Contact)
  const contactSection = document.getElementById('contact');
  if (scrolled > s3Top + s3Height + vh * 2) {
    contactSection.classList.add('in-view');
  } else {
    contactSection.classList.remove('in-view');
  }

  // Sync Header Visibility
  const mainHeader = document.getElementById('main-header');
  if (scrolled > vh * 0.8) {
    mainHeader.classList.add('scrolled');
  } else {
    mainHeader.classList.remove('scrolled');
  }
});

const pCards = document.querySelectorAll('.portfolio-card');
const servicesSection = document.getElementById('services');
const greetings = document.querySelectorAll('.greeting-text');

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  material.uniforms.time.value = time;
  material.uniforms.uScroll.value += (scrollProgress - material.uniforms.uScroll.value) * 0.08;

  // Sync service reveal - sticky layout allows globe to center precisely
  const curScrollValue = material.uniforms.uScroll.value;
  if (curScrollValue > 1.05) {
    servicesSection.classList.add('in-view-services');
  } else {
    servicesSection.classList.remove('in-view-services');
  }

  // Greeting logic
  if (scrollProgress < 0.2) {
    let greetingIdx = Math.floor(time / 0.5) % 5;
    greetings.forEach((g, i) => {
      if (i === greetingIdx) g.classList.add('active');
      else g.classList.remove('active');
    });
  } else {
    greetings.forEach(g => g.classList.remove('active'));
  }

  material.uniforms.uHoverMorph.value += (targetHoverMorph - material.uniforms.uHoverMorph.value) * 0.1;
  material.uniforms.uActiveIcon.value = currentIcon;
  material.uniforms.uTargetColor.value.lerp(iconTargetColor, 0.1);

  // Card Stacking Animation
  if (pCards.length > 0) {
    const stackProgress = Math.max(0, curScrollValue - 1.5);
    pCards.forEach((card, i) => {
      const cardOffset = i * 0.45;
      const localProgress = Math.min(1, Math.max(0, (stackProgress - cardOffset) * 2.5));

      if (localProgress > 0) {
        const ty = (1.0 - localProgress) * 70;
        card.style.transform = `translate3d(0, ${ty}vh, 0) scale(${0.85 + localProgress * 0.15})`;
        card.style.opacity = localProgress;
      } else {
        card.style.opacity = 0;
        card.style.transform = `translate3d(0, 70vh, 0)`;
      }
    });
  }

  // Dynamic Tilt
  points.rotation.x += (targetTiltX - points.rotation.x) * 0.05;
  points.rotation.y += (targetTiltY - points.rotation.y) * 0.05;

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});