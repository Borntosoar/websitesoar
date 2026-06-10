/* SOAR® — interactions (bright minimal build)
   Vanilla, no libraries. Respects reduced-motion + coarse pointers. */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  var y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();

  /* ---- entrance gate (password) ----
     NOTE: client-side only — anyone can read PASS in the source. It's a
     drop-culture splash, not real security. For true gating use Shopify's
     storefront password page or a server check. */
  (function () {
    var gate = $("[data-gate]"); if (!gate) return;
    var PASS = "ASCEND";                 // change me
    var KEY = "soar-gate-passed";
    var form = $("[data-gate-form]", gate), input = $("[data-gate-input]", gate), msg = $("[data-gate-msg]", gate);
    var base = msg ? msg.textContent : "";
    var passed = false; try { passed = sessionStorage.getItem(KEY) === "1"; } catch (e) {}

    function seal() { try { sessionStorage.setItem(KEY, "1"); } catch (e) {} document.body.style.overflow = ""; }
    function shut() { gate.classList.add("is-open"); setTimeout(function () { gate.setAttribute("hidden", ""); }, 750); }
    function enter(skipAnim) {
      seal();
      if (skipAnim || reduce) { shut(); return; }
      gate.classList.add("is-unlocking");
      setTimeout(shut, 1500);            // let the breakthrough play
    }

    if (passed) { gate.classList.add("is-open"); gate.setAttribute("hidden", ""); }
    else { document.body.style.overflow = "hidden"; if (input) setTimeout(function () { input.focus(); }, 350); }

    form && form.addEventListener("submit", function (e) {
      e.preventDefault();
      if ((input.value || "").trim().toLowerCase() === PASS.toLowerCase()) { gate.classList.remove("is-error"); enter(false); }
      else { gate.classList.add("is-error"); if (msg) msg.textContent = "Not yet — the box holds. Try again."; input.select(); }
    });
    input && input.addEventListener("input", function () { if (gate.classList.contains("is-error")) { gate.classList.remove("is-error"); if (msg) msg.textContent = base; } });
    $$("[data-gate-skip]", gate).forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); enter(true); var t = $("#list"); if (t) setTimeout(function () { t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }, 60); });
    });
  })();

  /* header stuck */
  var header = $("[data-header]");
  var stuck = function () { if (header) header.classList.toggle("is-stuck", scrollY > 6); };
  stuck(); addEventListener("scroll", stuck, { passive: true });

  /* reveals */
  var revealEls = $$("[data-reveal]");
  revealEls.forEach(function (el) { var d = el.getAttribute("data-delay"); if (d) el.style.setProperty("--d", d); });
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* counters */
  function countUp(el) {
    var t = parseFloat(el.getAttribute("data-count")), suf = el.getAttribute("data-suffix") || "", dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (reduce) { el.textContent = t.toFixed(dec) + suf; return; }
    var s = performance.now(), dur = 1500;
    (function tick(now) { var p = clamp((now - s) / dur, 0, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = (t * e).toFixed(dec) + suf; if (p < 1) requestAnimationFrame(tick); })(s);
  }
  var counts = $$("[data-count]");
  if (counts.length) {
    if (!("IntersectionObserver" in window)) counts.forEach(countUp);
    else { var cio = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } }); }, { threshold: 0.6 }); counts.forEach(function (el) { cio.observe(el); }); }
  }

  /* scrollspy */
  if ("IntersectionObserver" in window) {
    var links = $$(".nav a[href^='#']"), map = {};
    links.forEach(function (a) { var id = a.getAttribute("href"); if (id && id.length > 1) { var s = $(id); if (s) map[id] = a; } });
    var sio = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (l) { l.classList.remove("is-active"); }); var a = map["#" + e.target.id]; if (a) a.classList.add("is-active"); } });
    }, { threshold: 0.5 });
    Object.keys(map).forEach(function (id) { var s = $(id); if (s) sio.observe(s); });
  }

  /* mobile menu */
  var menu = $("[data-menu]"), openB = $("[data-menu-open]"), closeB = $("[data-menu-close]"), lastFocus = null;
  function openMenu() { if (!menu) return; lastFocus = document.activeElement; menu.classList.add("is-open"); openB && openB.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; closeB && closeB.focus(); }
  function closeMenu() { if (!menu) return; menu.classList.remove("is-open"); openB && openB.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; lastFocus && lastFocus.focus(); }
  openB && openB.addEventListener("click", openMenu);
  closeB && closeB.addEventListener("click", closeMenu);
  $$("[data-menu-link]").forEach(function (a) { a.addEventListener("click", closeMenu); });
  addEventListener("keydown", function (e) { if (e.key === "Escape" && menu && menu.classList.contains("is-open")) closeMenu(); });

  /* back to top */
  var top = $("[data-top]"); top && top.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* add to bag */
  var cc = $("[data-cart-count]"), cart = 0;
  $$(".card__add, .card__media").forEach(function (el) {
    el.addEventListener("click", function () {
      var p = el.closest(".card"); if (p && p.classList.contains("is-soldout")) return;
      cart++; if (cc) { cc.textContent = cart; cc.animate([{ transform: "scale(1)" }, { transform: "scale(1.7)" }, { transform: "scale(1)" }], { duration: 340, easing: "cubic-bezier(.22,1,.36,1)" }); }
    });
  });

  /* drop countdown — next Thursday 11:00 local */
  (function () {
    if (!$("[data-countdown]")) return;
    var d = $("[data-cd='days']"), h = $("[data-cd='hours']"), m = $("[data-cd='mins']"), s = $("[data-cd='secs']");
    function nextDrop() { var n = new Date(), t = new Date(n); t.setHours(11, 0, 0, 0); var add = (4 - t.getDay() + 7) % 7; if (add === 0 && n.getTime() >= t.getTime()) add = 7; t.setDate(t.getDate() + add); return t; }
    var target = nextDrop(), pad = function (v) { return (v < 10 ? "0" : "") + v; };
    function tick() {
      var diff = target - new Date(); if (diff <= 0) { target = nextDrop(); diff = target - new Date(); }
      var tot = Math.floor(diff / 1000);
      if (d) d.textContent = pad(Math.floor(tot / 86400));
      if (h) h.textContent = pad(Math.floor((tot % 86400) / 3600));
      if (m) m.textContent = pad(Math.floor((tot % 3600) / 60));
      if (s) s.textContent = pad(tot % 60);
    }
    tick(); setInterval(tick, 1000);
  })();

  /* newsletter capture (Klaviyo email + SMS) — set keys to go live; demo mode otherwise */
  var KLAVIYO = { publicKey: "YOUR_KLAVIYO_PUBLIC_KEY", listId: "YOUR_LIST_ID" };
  var form = $("[data-form]");
  if (form) {
    var sec = form.closest("section"), input = $("#email", form), phone = $("#phone", form), msg = $("[data-form-msg]"), base = msg ? msg.textContent : "";
    var setMsg = function (t) { if (msg) msg.textContent = t; };
    var resetSoon = function () { setTimeout(function () { sec.classList.remove("is-ok"); setMsg(base); }, 4600); };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = (input.value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { sec.classList.remove("is-ok"); sec.classList.add("is-error"); setMsg("Enter a valid email to begin the ascent."); input.focus(); return; }
      sec.classList.remove("is-error");
      var live = form.hasAttribute("data-klaviyo") && KLAVIYO.publicKey.indexOf("YOUR_") !== 0;
      if (!live) { sec.classList.add("is-ok"); setMsg("On the list. Watch your inbox."); form.reset(); resetSoon(); return; }
      setMsg("Joining…");
      var attrs = { email: email }; if (phone && phone.value.trim()) attrs.phone_number = phone.value.trim();
      var payload = { data: { type: "subscription", attributes: { custom_source: "SOAR Website", profile: { data: { type: "profile", attributes: attrs } } }, relationships: { list: { data: { type: "list", id: KLAVIYO.listId } } } } };
      fetch("https://a.klaviyo.com/client/subscriptions/?company_id=" + encodeURIComponent(KLAVIYO.publicKey), { method: "POST", headers: { "Content-Type": "application/json", revision: "2024-10-15" }, body: JSON.stringify(payload) })
        .then(function (r) { if (r.ok || r.status === 202) { sec.classList.add("is-ok"); setMsg("On the list. Watch your inbox."); form.reset(); } else { sec.classList.add("is-error"); setMsg("Something went wrong — please try again."); } resetSoon(); })
        .catch(function () { sec.classList.add("is-error"); setMsg("Network error — please try again."); resetSoon(); });
    });
    input && input.addEventListener("input", function () { if (sec.classList.contains("is-error")) { sec.classList.remove("is-error"); setMsg(base); } });
  }

  /* pointer flourishes + gentle parallax */
  if (fine && !reduce) {
    var cur = $("[data-cursor]");
    if (cur) {
      var cx = 0, cy = 0, x = 0, yy = 0;
      addEventListener("mousemove", function (e) { cx = e.clientX; cy = e.clientY; });
      (function loop() { x += (cx - x) * .2; yy += (cy - yy) * .2; cur.style.transform = "translate(" + x + "px," + yy + "px) translate(-50%,-50%)"; requestAnimationFrame(loop); })();
      $$("a,button,[data-magnetic],.card").forEach(function (el) {
        el.addEventListener("mouseenter", function () { cur.classList.add("is-hover"); });
        el.addEventListener("mouseleave", function () { cur.classList.remove("is-hover"); });
      });
    }
    $$("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) { var r = el.getBoundingClientRect(); el.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * .25 + "px," + (e.clientY - r.top - r.height / 2) * .25 + "px)"; });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });

    var px = $$("[data-parallax]").map(function (el) { return { el: el, s: parseFloat(el.dataset.parallax) || 0 }; });
    if (px.length) {
      var vh = innerHeight; addEventListener("resize", function () { vh = innerHeight; });
      requestAnimationFrame(function frame() {
        px.forEach(function (p) { var r = p.el.getBoundingClientRect(); var ty = clamp(((r.top + r.height / 2) - vh / 2) * p.s, -120, 120); p.el.style.transform = "translate3d(0," + ty.toFixed(1) + "px,0)"; });
        requestAnimationFrame(frame);
      });
    }
  }
})();
