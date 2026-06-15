/* SOAR theme — interaction enhancements (vanilla, progressive, fail-safe).
   Scroll progress · card tilt · AJAX cart drawer with native fallback.
   Lenis smooth-scroll is set up inline in theme.liquid (exposes window.lenis). */
(function () {
  "use strict";
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---- scroll progress ---- */
  var bar = document.querySelector("[data-progress]");
  if (bar) {
    var upd = function () {
      var h = document.documentElement;
      var p = h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1);
      bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
    };
    upd();
    addEventListener("scroll", upd, { passive: true });
  }

  /* ---- card tilt ---- */
  if (fine && !reduce) {
    document.querySelectorAll(".card__media, .plate__media").forEach(function (m) {
      var card = m.closest(".card, .plate");
      if (!card) return;
      card.addEventListener("mousemove", function (e) {
        var r = m.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        m.style.transform = "perspective(800px) rotateX(" + (-py * 6) + "deg) rotateY(" + (px * 6) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        m.style.transform = "";
      });
    });
  }

  /* ---- AJAX cart drawer ---- */
  var drawer = document.querySelector("[data-cart-drawer]");
  var overlay = document.querySelector("[data-cd-overlay]");

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    if (overlay) overlay.hidden = false;
    document.body.classList.add("cd-locked");
    if (window.lenis) window.lenis.stop();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    if (overlay) overlay.hidden = true;
    document.body.classList.remove("cd-locked");
    if (window.lenis) window.lenis.start();
  }
  function refreshCount() {
    fetch("/cart.js", { headers: { Accept: "application/json" } })
      .then(function (r) { return r.json(); })
      .then(function (c) {
        document.querySelectorAll("[data-cart-count]").forEach(function (el) { el.textContent = c.item_count; });
      })
      .catch(function () {});
  }
  function replaceDrawer(html) {
    if (!drawer || !html) return;
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    var fresh = tmp.querySelector("[data-cart-drawer]");
    if (fresh) drawer.innerHTML = fresh.innerHTML;
    refreshCount();
  }

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-cart-toggle]")) { e.preventDefault(); openDrawer(); return; }
    if (e.target.closest("[data-cd-close]") || e.target === overlay) { closeDrawer(); return; }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) closeDrawer();
  });

  /* add to cart -> AJAX + section render, native fallback on failure */
  document.querySelectorAll('form[action*="/cart/add"]').forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      fd.append("sections", "cart-drawer");
      fd.append("sections_url", location.pathname);
      fetch("/cart/add.js", { method: "POST", headers: { Accept: "application/json" }, body: fd })
        .then(function (r) { if (!r.ok) throw new Error("add"); return r.json(); })
        .then(function (data) {
          if (data.sections && data.sections["cart-drawer"]) replaceDrawer(data.sections["cart-drawer"]);
          else refreshCount();
          openDrawer();
        })
        .catch(function () { form.submit(); });
    });
  });

  /* qty +/- and remove inside the drawer */
  document.addEventListener("click", function (e) {
    if (!drawer) return;
    var row = e.target.closest("[data-line]");
    if (!row || !drawer.contains(row)) return;
    var line = parseInt(row.getAttribute("data-line"), 10);
    var qtyEl = row.querySelector(".cd__qty span");
    var q = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
    var nq = null;
    if (e.target.closest("[data-cd-inc]")) nq = q + 1;
    else if (e.target.closest("[data-cd-dec]")) nq = Math.max(0, q - 1);
    else if (e.target.closest("[data-cd-remove]")) nq = 0;
    if (nq === null) return;
    fetch("/cart/change.js", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ line: line, quantity: nq, sections: "cart-drawer", sections_url: location.pathname }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.sections && data.sections["cart-drawer"]) replaceDrawer(data.sections["cart-drawer"]);
        else refreshCount();
      })
      .catch(function () { location.href = "/cart"; });
  });
})();
