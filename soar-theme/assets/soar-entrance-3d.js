/* SOAR — 3D entrance for the Shopify password page (vanilla Three.js).
   The box moves and trembles; on submit the lid blows off and a BIRD soars up
   and OUT of the box, wings beating, leaving a burst of sparks — colour cycling
   amber<->electric for the "overdose" feel. Server validates the password while
   the animation plays. Progressive: if WebGL/CDN is unavailable the static SVG
   gate remains. */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";

(function () {
  var mount = document.querySelector("[data-soar-3d]");
  var gate = document.querySelector(".gate");
  if (!mount || !gate) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var BONE = 0xe7e2d7;

  var renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true }); } catch (e) { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  mount.appendChild(renderer.domElement);
  var svg = gate.querySelector(".gate__symbol");
  if (svg) svg.style.display = "none";
  gate.classList.add("gate--3d");

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1f1b16);
  scene.fog = new THREE.Fog(0x1f1b16, 7, 16);
  var camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 1.4, 6.4);
  camera.lookAt(0, 0.7, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  var dir = new THREE.DirectionalLight(BONE, 0.45);
  dir.position.set(3, 6, 4);
  scene.add(dir);

  var rig = new THREE.Group();
  scene.add(rig);

  /* ---- box ---- */
  var boxGroup = new THREE.Group();
  rig.add(boxGroup);
  var shellGeo = new THREE.BoxGeometry(1.7, 1.7, 1.7);
  var shell = new THREE.Mesh(shellGeo, new THREE.MeshStandardMaterial({ color: 0x2a251f, roughness: 1, transparent: true, opacity: 0.32 }));
  boxGroup.add(shell);
  boxGroup.add(new THREE.LineSegments(new THREE.EdgesGeometry(shellGeo), new THREE.LineBasicMaterial({ color: BONE })));

  var lid = new THREE.Group();
  var lidGeo = new THREE.BoxGeometry(1.72, 0.06, 1.72);
  lid.add(new THREE.Mesh(lidGeo, new THREE.MeshStandardMaterial({ color: 0x2a251f, transparent: true, opacity: 0.4 })));
  lid.add(new THREE.LineSegments(new THREE.EdgesGeometry(lidGeo), new THREE.LineBasicMaterial({ color: BONE })));
  lid.position.y = 0.88;
  boxGroup.add(lid);

  var innerLight = new THREE.PointLight(0xe6c566, 1.8, 6, 1.8);
  innerLight.position.y = 0;
  boxGroup.add(innerLight);

  /* ---- grid floor ---- */
  var grid = new THREE.GridHelper(16, 32, 0x3a332a, 0x2a251f);
  grid.position.y = -0.9;
  rig.add(grid);

  /* ---- the BIRD ---- */
  function makeWing(sign) {
    var g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, sign * 1.25, 0.06, -0.12, sign * 0.34, 0, -0.74], 3));
    g.setIndex([0, 1, 2]);
    g.computeVertexNormals();
    return g;
  }
  var bird = new THREE.Group();
  var wingMat = new THREE.MeshStandardMaterial({ color: 0xf1eee6, emissive: 0xe6c566, emissiveIntensity: 0.6, roughness: 0.5, side: THREE.DoubleSide, transparent: true, opacity: 1 });
  var lWing = new THREE.Mesh(makeWing(1), wingMat);
  var rWing = new THREE.Mesh(makeWing(-1), wingMat);
  bird.add(lWing); bird.add(rWing);
  var body = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.7, 6), wingMat);
  body.rotation.x = Math.PI; // nose forward/down
  body.position.z = -0.18;
  bird.add(body);
  bird.scale.setScalar(0);
  bird.position.set(0, -0.1, 0);
  rig.add(bird);

  /* ---- sparks ---- */
  var SPARKS = 24, sparks = [];
  var sparkGeo = new THREE.SphereGeometry(0.035, 6, 6);
  for (var i = 0; i < SPARKS; i++) {
    var sm = new THREE.MeshBasicMaterial({ color: 0xe6c566, transparent: true, opacity: 0 });
    var sp = new THREE.Mesh(sparkGeo, sm);
    rig.add(sp);
    sparks.push({ m: sp, mat: sm, dx: (Math.random() - 0.5) * 2.2, dz: (Math.random() - 0.5) * 2.2, dy: 2 + Math.random() * 3, phase: Math.random() });
  }

  /* ---- glow ---- */
  var glowTex = (function () {
    var c = document.createElement("canvas"); c.width = c.height = 128;
    var ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(243,238,227,0.95)"); g.addColorStop(0.4, "rgba(230,197,102,0.25)"); g.addColorStop(1, "rgba(230,197,102,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  var glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.position.y = 1.1; glow.scale.set(6.5, 6.5, 1);
  rig.add(glow);

  /* ---- state ---- */
  var fly = 0, target = 0, px = 0, py = 0;
  var hueCol = new THREE.Color();
  addEventListener("pointermove", function (e) { px = (e.clientX / innerWidth) * 2 - 1; py = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
  addEventListener("resize", function () { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  var form = gate.querySelector("form");
  if (form) form.addEventListener("submit", function () { target = 1; });

  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  var clock = new THREE.Clock();
  function frame() {
    var t = clock.getElapsedTime(), dt = Math.min(clock.getDelta() || 0.016, 0.05);
    fly += (target - fly) * Math.min(1, dt * 0.9);
    var locked = 1 - Math.min(1, fly * 1.4);
    var f = ease(Math.min(1, fly));

    // cycling colour (amber <-> electric)
    var mix = 0.5 + 0.5 * Math.sin(t * 0.7);
    var hue = 0.13 + (0.62 - 0.13) * mix;
    hueCol.setHSL(hue, 0.85, 0.55);
    innerLight.color.copy(hueCol);
    wingMat.emissive.copy(hueCol);

    // box tremble + open
    boxGroup.rotation.y += dt * 0.1;
    var s = 0.014 * locked;
    boxGroup.position.x = Math.sin(t * 33) * s + Math.sin(t * 19) * s * 0.6;
    boxGroup.position.z = Math.cos(t * 27) * s;
    shell.scale.setScalar(1 + (0.02 + 0.015 * Math.max(0, Math.sin(t * 7))) * locked);
    lid.position.y = 0.88 + Math.abs(Math.sin(t * 14)) * 0.02 * locked + f * 1.6;
    lid.position.x = f * 1.3; lid.rotation.z = -f * 1.1; lid.rotation.x = f * 0.5;
    innerLight.intensity = (1.8 + Math.sin(t * 9) * 0.9) * locked + 9 * f;

    // BIRD soars out
    bird.scale.setScalar(Math.min(1.1, fly * 5));
    bird.position.y = -0.1 + f * 9.2;
    bird.position.z = f * 0.6;
    bird.rotation.x = -0.35 - f * 0.2;
    bird.rotation.y = Math.sin(t * 1.5) * 0.15;
    var flap = Math.sin(t * 16) * (0.5 + 0.4 * fly);
    lWing.rotation.z = flap; rWing.rotation.z = -flap;
    wingMat.opacity = fly > 0.85 ? Math.max(0, 1 - (fly - 0.85) / 0.15) : 1;

    // sparks burst
    for (var i = 0; i < SPARKS; i++) {
      var sp = sparks[i];
      var p = Math.min(1, Math.max(0, fly * 1.3 - sp.phase * 0.3));
      sp.m.position.set(sp.dx * p, 0.1 + sp.dy * p - p * p * 1.2, sp.dz * p);
      sp.mat.color.copy(hueCol);
      sp.mat.opacity = p > 0 && p < 1 ? Math.sin(p * Math.PI) * 0.9 : 0;
    }

    grid.material.opacity = 1; // keep
    glow.material.opacity = 0.3 + f * 0.5;

    rig.rotation.y += ((px * 0.26) - rig.rotation.y) * 0.04;
    rig.rotation.x += ((-py * 0.13) - rig.rotation.x) * 0.04;

    renderer.render(scene, camera);
    if (!reduce) requestAnimationFrame(frame);
  }
  if (reduce) { fly = 0; renderer.render(scene, camera); } else requestAnimationFrame(frame);
})();
