/* SOAR — 3D entrance for the Shopify password page (vanilla Three.js).
   Progressive enhancement: mounts behind the gate; if WebGL/CDN fails the
   static SVG symbol remains. The box trembles from inside (pressure pulses,
   amber light at the seams, scanner ring on a grid). On form submit the lid
   blows off and glowing arrows rush out while the page posts to Shopify. */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";

(function () {
  var mount = document.querySelector("[data-soar-3d]");
  var gate = document.querySelector(".gate");
  if (!mount || !gate) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var BONE = 0xe7e2d7, AMBER = 0xe6c566;
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  mount.appendChild(renderer.domElement);
  // 3D is live — hide the static SVG fallback
  var svg = gate.querySelector(".gate__symbol");
  if (svg) svg.style.display = "none";
  gate.classList.add("gate--3d");

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1f1b16);
  scene.fog = new THREE.Fog(0x1f1b16, 6.5, 15);
  var camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 1.3, 6.2);
  camera.lookAt(0, 0.6, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.32));
  var dir = new THREE.DirectionalLight(BONE, 0.45);
  dir.position.set(3, 6, 4);
  scene.add(dir);

  var rig = new THREE.Group();
  scene.add(rig);

  /* box */
  var boxGroup = new THREE.Group();
  rig.add(boxGroup);
  var shellGeo = new THREE.BoxGeometry(1.6, 1.6, 1.6);
  var shell = new THREE.Mesh(shellGeo, new THREE.MeshStandardMaterial({ color: 0x2a251f, roughness: 1, transparent: true, opacity: 0.32 }));
  boxGroup.add(shell);
  boxGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(shellGeo), new THREE.LineBasicMaterial({ color: BONE })));

  var lid = new THREE.Group();
  var lidGeo = new THREE.BoxGeometry(1.62, 0.06, 1.62);
  lid.add(new THREE.Mesh(lidGeo, new THREE.MeshStandardMaterial({ color: 0x2a251f, transparent: true, opacity: 0.4 })));
  lid.add(new THREE.LineSegments(new THREE.EdgesGeometry(lidGeo), new THREE.LineBasicMaterial({ color: BONE })));
  lid.position.y = 0.83;
  boxGroup.add(lid);

  var inner = new THREE.PointLight(AMBER, 1.6, 5, 1.8);
  boxGroup.add(inner);

  /* scanner ring + grid */
  var ring = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.012, 8, 64), new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.35 }));
  ring.rotation.x = Math.PI / 2;
  rig.add(ring);
  var grid = new THREE.GridHelper(14, 28, 0x3a332a, 0x2a251f);
  grid.position.y = -0.82;
  rig.add(grid);

  /* glow sprite above */
  var glowTex = (function () {
    var c = document.createElement("canvas"); c.width = c.height = 128;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(243,238,227,0.95)");
    g.addColorStop(0.4, "rgba(230,197,102,0.25)");
    g.addColorStop(1, "rgba(230,197,102,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  var glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.position.y = 2.1; glow.scale.set(6.5, 6.5, 1);
  rig.add(glow);
  var bloomLight = new THREE.PointLight(0xf3eee3, 4, 10, 1.6);
  bloomLight.position.y = 2.1;
  rig.add(bloomLight);

  /* arrows */
  var ARROWS = 26, arrows = [];
  for (var i = 0; i < ARROWS; i++) {
    var grp = new THREE.Group();
    var head = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.34, 4), new THREE.MeshStandardMaterial({ color: BONE, emissive: AMBER, emissiveIntensity: 1.4, transparent: true, opacity: 0, depthWrite: false }));
    var tail = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 4), new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0, depthWrite: false }));
    tail.position.y = -0.28;
    grp.add(head); grp.add(tail);
    grp.position.y = -2;
    var s = 0.55 + Math.random() * 0.65;
    grp.scale.setScalar(s);
    rig.add(grp);
    arrows.push({ g: grp, head: head.material, tail: tail.material, speed: 1.6 + (i % 5) * 0.55 + Math.random() * 0.7, phase: Math.random() * 4, dx: (Math.random() - 0.5) * 1.1, dz: (Math.random() - 0.5) * 1.1, drift: (Math.random() - 0.5) * 0.35 });
  }

  /* state */
  var boost = 0, target = 0;
  var px = 0, py = 0;
  addEventListener("pointermove", function (e) {
    px = (e.clientX / innerWidth) * 2 - 1;
    py = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
  addEventListener("resize", function () {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  /* burst on submit (server validates; this plays while the form posts) */
  var form = gate.querySelector("form");
  if (form) form.addEventListener("submit", function () { target = 1; });

  var clock = new THREE.Clock();
  function frame() {
    var t = clock.getElapsedTime(), dt = Math.min(clock.getDelta() || 0.016, 0.05);
    boost += (target - boost) * Math.min(1, dt * 3.2);
    var locked = 1 - boost;

    boxGroup.rotation.y += dt * 0.1;
    var s2 = 0.012 * locked;
    boxGroup.position.x = Math.sin(t * 31) * s2 + Math.sin(t * 17) * s2 * 0.6;
    boxGroup.position.z = Math.cos(t * 27) * s2;
    var bulge = 1 + (0.02 + 0.015 * Math.max(0, Math.sin(t * 7))) * locked;
    shell.scale.setScalar(bulge);
    lid.position.y = 0.83 + Math.abs(Math.sin(t * 14)) * 0.025 * locked + boost * 1.15;
    lid.position.x = boost * 0.9;
    lid.rotation.z = -boost * 0.9;
    inner.intensity = (1.6 + Math.sin(t * 9) * 0.9 + Math.sin(t * 23) * 0.4) * locked + 10 * boost;

    ring.position.y = -0.8 + ((t * 0.55) % 2.4);
    ring.material.opacity = Math.max(0, (0.4 - Math.abs(ring.position.y - 0.2) * 0.18) * (1 - boost * 0.6));
    ring.rotation.z = t * 0.4;

    glow.material.opacity = 0.35 + boost * 0.5;
    bloomLight.intensity = 4 + boost * 12 + Math.sin(t * 0.6) * 1.2;

    for (var i = 0; i < ARROWS; i++) {
      var a = arrows[i];
      var cycle = 4 / a.speed;
      var p = ((t + a.phase) % cycle) / cycle;
      a.g.position.set(a.dx + a.drift * p * 3, 0.2 + p * 5.2, a.dz);
      var o = boost * Math.sin(p * Math.PI) * 0.95;
      a.head.opacity = o;
      a.tail.opacity = o * 0.4;
    }

    rig.rotation.y += ((px * 0.28) - rig.rotation.y) * 0.04;
    rig.rotation.x += ((-py * 0.14) - rig.rotation.x) * 0.04;

    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(frame);
  }
  if (reduce) { boost = 0; renderer.render(scene, camera); }
  else requestAnimationFrame(frame);
})();
