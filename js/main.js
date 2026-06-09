/* SOAR — interactions
   Progressive enhancement: everything degrades gracefully and respects
   prefers-reduced-motion + coarse pointers. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- Footer year ---- */
  var year = $("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ---- Sticky header ---- */
  var header = $("[data-header]");
  var onScroll = function () {
    if (header) header.classList.toggle("is-stuck", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Reveal on scroll ---- */
  var revealEls = $$("[data-reveal]");
  revealEls.forEach(function (el) {
    var d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--d", d);
  });
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Mobile menu ---- */
  var menu = $("[data-menu]");
  var openBtn = $("[data-menu-open]");
  var closeBtn = $("[data-menu-close]");
  var lastFocus = null;
  function openMenu() {
    if (!menu) return;
    lastFocus = document.activeElement;
    menu.classList.add("is-open");
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("is-open");
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  if (openBtn) openBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  $$("[data-menu-link]").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu && menu.classList.contains("is-open")) closeMenu();
  });

  /* ---- Smooth back-to-top ---- */
  var topLink = $("[data-top]");
  if (topLink) topLink.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---- Count-up stats ---- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (reduce) { el.textContent = target.toFixed(decimals) + suffix; return; }
    var start = performance.now();
    var dur = 1600;
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }
  var counts = $$("[data-count]");
  if (counts.length) {
    if (!("IntersectionObserver" in window)) { counts.forEach(countUp); }
    else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.6 });
      counts.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---- Newsletter form ---- */
  var form = $("[data-form]");
  if (form) {
    var field = form.querySelector(".field");
    var input = $("#email", form);
    var msg = $("[data-form-msg]", form);
    var defaultMsg = msg ? msg.textContent : "";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = (input.value || "").trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      field.classList.remove("is-ok", "is-error");
      if (!valid) {
        field.classList.add("is-error");
        if (msg) msg.textContent = "Please enter a valid email to begin the ascent.";
        input.focus();
        return;
      }
      field.classList.add("is-ok");
      if (msg) msg.textContent = "Welcome to the ascent. Check your inbox.";
      input.value = "";
      setTimeout(function () {
        field.classList.remove("is-ok");
        if (msg) msg.textContent = defaultMsg;
      }, 4200);
    });
    if (input) input.addEventListener("input", function () {
      if (field.classList.contains("is-error")) {
        field.classList.remove("is-error");
        if (msg) msg.textContent = defaultMsg;
      }
    });
  }

  /* ---- Add-to-bag delight ---- */
  var cartCount = $("[data-cart-count]");
  var cart = 0;
  $$(".card__overlay").forEach(function (ov) {
    ov.addEventListener("click", function () {
      cart += 1;
      if (cartCount) {
        cartCount.textContent = cart;
        cartCount.animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.6)" }, { transform: "scale(1)" }],
          { duration: 360, easing: "cubic-bezier(0.22,1,0.36,1)" }
        );
      }
    });
  });

  /* ---- Desktop-only flourishes ---- */
  if (fine && !reduce) {
    /* Custom cursor */
    var cursor = $("[data-cursor]");
    if (cursor) {
      var cx = 0, cy = 0, x = 0, y = 0, raf;
      window.addEventListener("mousemove", function (e) { cx = e.clientX; cy = e.clientY; });
      (function loop() {
        x += (cx - x) * 0.2; y += (cy - y) * 0.2;
        cursor.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
        raf = requestAnimationFrame(loop);
      })();
      $$("a, button, [data-magnetic], .card").forEach(function (el) {
        el.addEventListener("mouseenter", function () { cursor.classList.add("is-hover"); });
        el.addEventListener("mouseleave", function () { cursor.classList.remove("is-hover"); });
      });
    }

    /* Magnetic buttons */
    $$("[data-magnetic]").forEach(function (el) {
      var strength = 0.35;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + mx * strength + "px," + my * strength + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });

    /* Product card tilt */
    $$("[data-tilt]").forEach(function (el) {
      var media = el.querySelector(".card__media");
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        if (media) media.style.transform = "perspective(800px) rotateX(" + (-py * 6) + "deg) rotateY(" + (px * 6) + "deg)";
      });
      el.addEventListener("mouseleave", function () { if (media) media.style.transform = ""; });
    });
  }
})();
