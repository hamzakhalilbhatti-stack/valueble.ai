// ===== RUNTIME — Immersive site behavior =====

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- Preloader ---------------- */
function runPreloader(done) {
  const lines = [
    'INITIALIZING RUNTIME_OS v2.4...',
    'CONNECTING TO WORKFLOW ENGINE...',
    'LOADING AGENT MODULES [3/3]...',
    '<ACCESS GRANTED>',
  ];
  const container = document.querySelector('#preloader .boot-lines');
  if (!container) return done();

  if (reduceMotion) {
    container.innerHTML = lines.map(l => `<div class="boot-line">${l}</div>`).join('');
    setTimeout(done, 400);
    return;
  }

  let i = 0;
  function nextLine() {
    if (i >= lines.length) {
      setTimeout(done, 350);
      return;
    }
    const el = document.createElement('div');
    el.className = 'boot-line';
    container.appendChild(el);
    let c = 0;
    const text = lines[i];
    const interval = setInterval(() => {
      c++;
      el.textContent = text.slice(0, c);
      if (c >= text.length) {
        clearInterval(interval);
        i++;
        setTimeout(nextLine, 180);
      }
    }, 18);
  }
  nextLine();
}

function hidePreloader() {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  if (reduceMotion || typeof gsap === 'undefined') {
    pre.style.display = 'none';
    revealHero();
    return;
  }
  gsap.to(pre, {
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => { pre.style.display = 'none'; },
  });
  revealHero();
}

function revealHero() {
  if (reduceMotion || typeof gsap === 'undefined') return;
  gsap.fromTo('.hero-inner > *',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
  );
}

/* ---------------- Custom cursor ---------------- */
function initCursor() {
  const isFine = window.matchMedia('(pointer: fine)').matches;
  if (!isFine) return;
  document.documentElement.classList.add('has-cursor');

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  });

  function loop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, input, textarea, select, .node-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ---------------- Three.js network scene ---------------- */
function initScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0e0c, 0.09);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 9;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const group = new THREE.Group();
  scene.add(group);

  // Distribute nodes on a sphere (fibonacci sphere)
  const NODE_COUNT = 90;
  const radius = 4.2;
  const nodePositions = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    nodePositions.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }

  // Glow sprite texture (radial gradient on canvas)
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = 64; spriteCanvas.height = 64;
  const ctx = spriteCanvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(61,255,138,1)');
  grad.addColorStop(0.35, 'rgba(61,255,138,0.6)');
  grad.addColorStop(1, 'rgba(61,255,138,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const spriteTex = new THREE.CanvasTexture(spriteCanvas);

  // Points (nodes)
  const pointsGeo = new THREE.BufferGeometry().setFromPoints(nodePositions);
  const pointsMat = new THREE.PointsMaterial({
    size: 0.28,
    map: spriteTex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    color: 0x3dff8a,
  });
  const points = new THREE.Points(pointsGeo, pointsMat);
  group.add(points);

  // Connections: link each node to its nearest few neighbors
  const linePositions = [];
  const maxDist = 1.85;
  for (let i = 0; i < nodePositions.length; i++) {
    for (let j = i + 1; j < nodePositions.length; j++) {
      if (nodePositions[i].distanceTo(nodePositions[j]) < maxDist) {
        linePositions.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
        linePositions.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x3dff8a,
    transparent: true,
    opacity: 0.16,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  group.position.set(2.6, 0, 0);
  group.rotation.x = 0.3;

  let targetRotY = 0, targetRotX = 0.3;
  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (!reduceMotion) {
      targetRotY = t * 0.08 + mouseX * 0.6;
      targetRotX = 0.3 + mouseY * 0.3;
      group.rotation.y += (targetRotY - group.rotation.y) * 0.04;
      group.rotation.x += (targetRotX - group.rotation.x) * 0.04;

      camera.position.x += ((mouseX * 0.8) - camera.position.x) * 0.02;
      camera.position.y += ((-mouseY * 0.5) - camera.position.y) * 0.02;
      camera.lookAt(group.position);
    }

    renderer.render(scene, camera);
  }
  animate();
}

/* ---------------- Scroll reveals + nav + tilt ---------------- */
function initScroll() {
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || reduceMotion) return;
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      }
    );
  });

  gsap.utils.toArray('.reveal-stagger').forEach((group) => {
    const items = group.children;
    gsap.fromTo(items,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 85%' },
      }
    );
  });
}

function initTilt() {
  document.querySelectorAll('.tilt-stage .node-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateY(0) rotateX(0) translateY(0)';
    });
  });
}

/* ---------------- Contact form ---------------- */
function initForm() {
  const form = document.querySelector('#leadForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = form.querySelector('.form-msg');
    const btn = form.querySelector('button[type="submit"]');
    const webhookUrl = form.getAttribute('data-webhook');
    btn.textContent = 'SENDING...';
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      msg.textContent = '> 200 OK — request received. We\'ll reply within 1 business day.';
      msg.classList.add('show', 'ok');
      form.reset();
    } catch (err) {
      msg.textContent = '> submission logged locally — connect the n8n webhook in app.js to go live.';
      msg.classList.add('show', 'ok');
      form.reset();
    } finally {
      btn.textContent = 'RUN →';
    }
  });
}

/* ---------------- Boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScene();
  initScroll();
  initTilt();
  initForm();
  runPreloader(hidePreloader);
});
