/* SOAR — entrance starfield (canvas). Reduced-motion → static. */
(function () {
  var c = document.querySelector('[data-soar-stars]');
  if (!c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ctx = c.getContext('2d'), w = 0, h = 0, stars = [], raf = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
  function build() { stars = []; var n = Math.min(240, Math.floor(w * h / 16000)); for (var i = 0; i < n; i++) stars.push({ x: Math.random() * w, y: Math.random() * h * 0.74, z: Math.random(), s: Math.random() * 1.4 + 0.2 }); }
  function size() { w = c.width = c.offsetWidth * dpr; h = c.height = c.offsetHeight * dpr; build(); }
  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i];
      st.y -= (0.05 + st.z * 0.16) * dpr;
      if (st.y < -2) { st.y = h * 0.74; st.x = Math.random() * w; }
      ctx.globalAlpha = 0.22 + st.z * 0.62;
      ctx.fillStyle = '#fff';
      ctx.fillRect(st.x, st.y, st.s * dpr, st.s * dpr);
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(tick);
  }
  function start() { size(); cancelAnimationFrame(raf); tick(); }
  window.addEventListener('resize', size, { passive: true });
  start();
})();
