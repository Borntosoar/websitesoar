/* SOAR® — kinetic streetwear interactions
   Vanilla, no libraries. Respects reduced-motion + coarse pointers. */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---- year ---- */
  var y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();

  /* ---- header stuck (cheap, always on) ---- */
  var header = $("[data-header]");
  var stuck = function () { if (header) header.classList.toggle("is-stuck", scrollY > 8); };
  stuck(); addEventListener("scroll", stuck, { passive: true });

  /* ---- reveals ---- */
  var revealEls = $$("[data-reveal]");
  revealEls.forEach(function (el) { var d = el.getAttribute("data-delay"); if (d) el.style.setProperty("--d", d); });
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- counters ---- */
  function countUp(el) {
    var t = parseFloat(el.getAttribute("data-count"));
    var suf = el.getAttribute("data-suffix") || "";
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (reduce) { el.textContent = t.toFixed(dec) + suf; return; }
    var s = performance.now(), dur = 1500;
    (function tick(now) {
      var p = clamp((now - s) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (t * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(s);
  }
  var counts = $$("[data-count]");
  if (counts.length) {
    if (!("IntersectionObserver" in window)) counts.forEach(countUp);
    else {
      var cio = new IntersectionObserver(function (en) {
        en.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
      }, { threshold: 0.6 });
      counts.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---- scrollspy ---- */
  if ("IntersectionObserver" in window) {
    var links = $$(".nav a[href^='#']");
    var map = {};
    links.forEach(function (a) { var id = a.getAttribute("href"); if (id && id.length > 1) { var s = $(id); if (s) map[id] = a; } });
    var sio = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { links.forEach(function (l) { l.classList.remove("is-active"); }); var a = map["#" + e.target.id]; if (a) a.classList.add("is-active"); }
      });
    }, { threshold: 0.5 });
    Object.keys(map).forEach(function (id) { var s = $(id); if (s) sio.observe(s); });
  }

  /* ---- mobile menu ---- */
  var menu = $("[data-menu]"), openB = $("[data-menu-open]"), closeB = $("[data-menu-close]"), lastFocus = null;
  function openMenu() { if (!menu) return; lastFocus = document.activeElement; menu.classList.add("is-open"); openB && openB.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; closeB && closeB.focus(); }
  function closeMenu() { if (!menu) return; menu.classList.remove("is-open"); openB && openB.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; lastFocus && lastFocus.focus(); }
  openB && openB.addEventListener("click", openMenu);
  closeB && closeB.addEventListener("click", closeMenu);
  $$("[data-menu-link]").forEach(function (a) { a.addEventListener("click", closeMenu); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && menu && menu.classList.contains("is-open")) closeMenu(); });

  /* ---- back to top ---- */
  var top = $("[data-top]"); top && top.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---- newsletter ---- */
  var form = $("[data-form]");
  if (form) {
    var sec = form.closest("section"), input = $("#email", form), msg = $("[data-form-msg]"), base = msg ? msg.textContent : "";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((input.value || "").trim());
      sec.classList.remove("is-ok", "is-error");
      if (!ok) { sec.classList.add("is-error"); if (msg) msg.textContent = "Enter a valid email to begin the ascent."; input.focus(); return; }
      sec.classList.add("is-ok"); if (msg) msg.textContent = "On the list. Watch your inbox."; input.value = "";
      setTimeout(function () { sec.classList.remove("is-ok"); if (msg) msg.textContent = base; }, 4200);
    });
    input && input.addEventListener("input", function () { if (sec.classList.contains("is-error")) { sec.classList.remove("is-error"); if (msg) msg.textContent = base; } });
  }

  /* ---- add to bag ---- */
  var cc = $("[data-cart-count]"), cart = 0;
  $$(".plate__add, .plate__media").forEach(function (el) {
    el.addEventListener("click", function () {
      cart++; if (cc) { cc.textContent = cart; cc.animate([{ transform: "scale(1)" }, { transform: "scale(1.7)" }, { transform: "scale(1)" }], { duration: 340, easing: "cubic-bezier(.22,1,.36,1)" }); }
    });
  });

  /* ---- pointer flourishes ---- */
  if (fine && !reduce) {
    var cur = $("[data-cursor]");
    if (cur) {
      var cx = 0, cy = 0, x = 0, yy = 0;
      addEventListener("mousemove", function (e) { cx = e.clientX; cy = e.clientY; });
      (function loop() { x += (cx - x) * .22; yy += (cy - yy) * .22; cur.style.transform = "translate(" + x + "px," + yy + "px) translate(-50%,-50%)"; requestAnimationFrame(loop); })();
      $$("a,button,[data-magnetic],.plate,.ledger li").forEach(function (el) {
        el.addEventListener("mouseenter", function () { cur.classList.add("is-hover"); });
        el.addEventListener("mouseleave", function () { cur.classList.remove("is-hover"); });
      });
    }
    $$("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) { var r = el.getBoundingClientRect(); el.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * .3 + "px," + (e.clientY - r.top - r.height / 2) * .3 + "px)"; });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* =====================================================
     Scroll engine: parallax + marquee velocity + pinned rail
     ===================================================== */
  var marquees = $$("[data-marquee]").map(function (el) {
    var track = $("[data-marquee-track]", el);
    return { track: track, dir: parseFloat(el.dataset.dir || "-1"), speed: parseFloat(el.dataset.speed || "1"), half: 0, pos: 0 };
  });
  var parallax = $$("[data-parallax]").map(function (el) { return { el: el, s: parseFloat(el.dataset.parallax) || 0 }; });
  var rails = $$("[data-rail]").map(function (el) { return { el: el, track: $("[data-rail-track]", el), maxX: 0 }; });

  function layoutMarquee(m) { if (m.track) { m.half = m.track.scrollWidth / 2; m.pos = m.dir > 0 ? -m.half : 0; } }
  function layoutRails() {
    rails.forEach(function (r) {
      if (innerWidth >= 860 && !reduce && r.track) {
        var maxX = r.track.scrollWidth - innerWidth + 8;
        r.maxX = Math.max(maxX, 0);
        r.el.classList.add("is-pinned");
        r.el.style.height = (innerHeight + r.maxX) + "px";
      } else {
        r.maxX = 0; r.el.classList.remove("is-pinned"); r.el.style.height = ""; if (r.track) r.track.style.transform = "";
      }
    });
  }
  function layoutAll() { marquees.forEach(layoutMarquee); layoutRails(); }

  if (!reduce) {
    addEventListener("load", layoutAll);
    layoutAll();
    var rt; addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(layoutAll, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutAll);

    var lastY = scrollY, vel = 0, vh = innerHeight;
    addEventListener("resize", function () { vh = innerHeight; });

    requestAnimationFrame(function frame() {
      var sy = scrollY;
      vel += ((sy - lastY) - vel) * 0.25; lastY = sy;
      var boost = Math.min(Math.abs(vel) * 0.9, 64);

      // marquees
      marquees.forEach(function (m) {
        if (!m.track || !m.half) return;
        m.pos += (0.55 * m.speed + boost) * m.dir;
        if (m.pos <= -m.half) m.pos += m.half;
        if (m.pos > 0) m.pos -= m.half;
        m.track.style.transform = "translate3d(" + m.pos + "px,0,0)";
      });

      // parallax
      parallax.forEach(function (p) {
        var r = p.el.getBoundingClientRect();
        var ty = clamp(((r.top + r.height / 2) - vh / 2) * p.s, -320, 320);
        p.el.style.setProperty("--py", ty.toFixed(1) + "px");
      });

      // pinned rails
      rails.forEach(function (r) {
        if (!r.el.classList.contains("is-pinned") || !r.track) return;
        var rect = r.el.getBoundingClientRect();
        var total = r.el.offsetHeight - vh;
        var prog = clamp(-rect.top / total, 0, 1);
        r.track.style.transform = "translate3d(" + (-(prog * r.maxX)).toFixed(1) + "px,0,0)";
      });

      requestAnimationFrame(frame);
    });
  } else {
    layoutAll();
  }
})();
