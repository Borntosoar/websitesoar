/* SOAR — Ascent · theme behaviour (vanilla, no deps) */
(function () {
  'use strict';
  var doc = document, body = doc.body;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var FREE = 20000; // free-shipping threshold in cents ($200)
  function money(c) { return '$' + (c / 100).toFixed(2); }

  /* sticky header */
  var header = $('[data-soar-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 40); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* reveal on scroll */
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else { $$('.reveal').forEach(function (el) { el.classList.add('is-in'); }); }

  /* mobile menu */
  var menu = $('[data-soar-menu]');
  function menuSet(open) { if (!menu) return; menu.classList.toggle('is-open', open); menu.setAttribute('aria-hidden', open ? 'false' : 'true'); body.classList.toggle('soar-locked', open); }
  $$('[data-soar-menu-open]').forEach(function (b) { b.addEventListener('click', function () { menuSet(true); }); });
  $$('[data-soar-menu-close]').forEach(function (b) { b.addEventListener('click', function () { menuSet(false); }); });

  /* search */
  var search = $('[data-soar-search]');
  $$('[data-soar-search-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!search) return;
      var open = !search.classList.contains('is-open');
      search.classList.toggle('is-open', open);
      if (open) { var i = search.querySelector('input'); if (i) setTimeout(function () { i.focus(); }, 60); }
    });
  });

  /* cart drawer */
  var overlay = $('[data-soar-overlay]'), drawer = $('[data-soar-drawer]');
  var elItems = $('[data-soar-drawer-items]'), elEmpty = $('[data-soar-drawer-empty]'), elFoot = $('[data-soar-drawer-foot]');
  var elSub = $('[data-soar-drawer-subtotal]'), elDrawerCount = $('[data-soar-drawer-count]');
  var elFreebar = $('[data-soar-freebar]'), elFreeMsg = $('[data-soar-freebar-msg]'), elFreeFill = $('[data-soar-freebar-fill]');
  function cartOpen(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open); drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (overlay) { overlay.hidden = false; overlay.classList.toggle('is-open', open); }
    body.classList.toggle('soar-locked', open);
  }
  $$('[data-soar-cart-open]').forEach(function (b) { b.addEventListener('click', function () { cartOpen(true); fetchCart(); }); });
  $$('[data-soar-cart-close]').forEach(function (b) { b.addEventListener('click', function () { cartOpen(false); }); });
  if (overlay) overlay.addEventListener('click', function () { cartOpen(false); });

  function setCount(n) { $$('[data-soar-cart-count]').forEach(function (el) { el.textContent = n; el.setAttribute('data-empty', n === 0 ? 'true' : 'false'); }); if (elDrawerCount) elDrawerCount.textContent = '(' + n + ')'; }

  function renderCart(cart) {
    setCount(cart.item_count);
    if (elSub) elSub.textContent = money(cart.total_price);
    var empty = cart.item_count === 0;
    if (elEmpty) elEmpty.hidden = !empty;
    if (elFoot) elFoot.hidden = empty;
    if (elFreebar) elFreebar.hidden = empty;
    if (elItems) {
      elItems.innerHTML = empty ? '' : cart.items.map(function (it) {
        var img = it.image ? it.image.replace(/(\.[^.\/]+)(\?|$)/, '_200x$1$2') : '';
        var vt = (it.variant_title && it.variant_title !== 'Default Title') ? it.variant_title : '';
        return '<div class="soar-lineitem" data-key="' + it.key + '">' +
          '<a class="soar-lineitem__media" href="' + it.url + '">' + (img ? '<img src="' + img + '" alt="" loading="lazy">' : '') + '</a>' +
          '<div><p class="soar-lineitem__title">' + it.product_title + '</p>' +
          '<p class="soar-lineitem__meta">' + vt + '</p>' +
          '<div class="soar-lineitem__bottom"><div class="soar-qty">' +
          '<button type="button" aria-label="Decrease" data-key="' + it.key + '" data-qty="' + (it.quantity - 1) + '">&minus;</button>' +
          '<span>' + it.quantity + '</span>' +
          '<button type="button" aria-label="Increase" data-key="' + it.key + '" data-qty="' + (it.quantity + 1) + '">+</button></div>' +
          '<button class="soar-lineitem__remove" type="button" data-key="' + it.key + '" data-qty="0">Remove</button></div></div>' +
          '<span class="soar-lineitem__price">' + money(it.final_line_price) + '</span></div>';
      }).join('');
    }
    if (elFreebar && !empty) {
      var rem = FREE - cart.total_price;
      elFreeMsg.innerHTML = rem > 0 ? 'You&rsquo;re <b>' + money(rem) + '</b> from free shipping' : 'Free shipping unlocked — you&rsquo;ve risen.';
      if (elFreeFill) elFreeFill.style.width = Math.min(100, cart.total_price / FREE * 100) + '%';
    }
  }
  function fetchCart() { fetch('/cart.js', { headers: { 'Accept': 'application/json' } }).then(function (r) { return r.json(); }).then(renderCart).catch(function () {}); }

  if (drawer) {
    drawer.addEventListener('click', function (e) {
      var b = e.target.closest('[data-qty]'); if (!b) return;
      var key = b.getAttribute('data-key'), qty = parseInt(b.getAttribute('data-qty'), 10);
      drawer.classList.add('is-loading');
      fetch('/cart/change.js', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ id: key, quantity: qty }) })
        .then(function (r) { return r.json(); }).then(renderCart).catch(function () {}).then(function () { drawer.classList.remove('is-loading'); });
    });
  }

  /* AJAX add-to-cart (any product form) */
  $$('form[action*="/cart/add"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]'); if (btn) btn.setAttribute('aria-disabled', 'true');
      fetch('/cart/add.js', { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function () { return fetch('/cart.js').then(function (r) { return r.json(); }); })
        .then(function (cart) { renderCart(cart); cartOpen(true); })
        .catch(function () { form.submit(); })
        .then(function () { if (btn) btn.removeAttribute('aria-disabled'); });
    });
  });
  fetchCart();

  /* accordion */
  $$('.soar-accordion__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var exp = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', exp ? 'false' : 'true');
      var panel = btn.nextElementSibling;
      if (panel) panel.style.maxHeight = exp ? '0px' : panel.scrollHeight + 'px';
    });
  });

  /* sticky mobile add-to-cart */
  var sticky = $('.soar-stickyatc'), anchor = $('.soar-product__atc');
  if (sticky && anchor && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { es.forEach(function (e) { sticky.classList.toggle('is-shown', !e.isIntersecting && e.boundingClientRect.top < 0); }); }, { threshold: 0 }).observe(anchor);
  }

  /* ESC closes overlays */
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') { cartOpen(false); menuSet(false); if (search) search.classList.remove('is-open'); } });

  /* ENTRANCE controller */
  var ent = $('[data-soar-entrance]');
  if (ent) {
    var passed = false; try { passed = sessionStorage.getItem('soar-gate-passed') === '1'; } catch (e) {}
    if (passed) { ent.classList.add('is-done'); }
    else {
      ent.hidden = false; body.classList.add('soar-locked');
      var finish = function () { try { sessionStorage.setItem('soar-gate-passed', '1'); } catch (e) {} ent.classList.add('is-lifting'); body.classList.remove('soar-locked'); setTimeout(function () { ent.classList.add('is-done'); }, RM ? 400 : 1200); };
      var ascend = function () { if (RM) return finish(); ent.classList.add('is-ascending'); setTimeout(finish, 1800); };
      var begin = $('[data-soar-begin]', ent); if (begin) begin.addEventListener('click', ascend);
      var skip = $('[data-soar-skip]', ent); if (skip) skip.addEventListener('click', finish);
      var gate = $('[data-soar-gate]', ent), toggle = $('[data-soar-gate-toggle]', ent);
      if (toggle && gate) toggle.addEventListener('click', function () { gate.classList.toggle('is-open'); var i = $('[data-soar-gate-input]', gate); if (i) i.focus(); });
      var mode = 'password';
      $$('[data-soar-mode]', ent).forEach(function (mb) {
        mb.addEventListener('click', function () {
          mode = mb.getAttribute('data-soar-mode');
          $$('[data-soar-mode]', ent).forEach(function (x) { x.classList.toggle('is-active', x === mb); });
          var i = $('[data-soar-gate-input]', ent);
          if (i) { if (mode === 'email') { i.type = 'email'; i.placeholder = 'Email address'; } else { i.type = 'password'; i.placeholder = 'Password'; } i.value = ''; i.focus(); }
        });
      });
      var form = $('[data-soar-gate-form]', ent), err = $('[data-soar-gate-error]', ent);
      if (form) form.addEventListener('submit', function (e) {
        e.preventDefault();
        var i = $('[data-soar-gate-input]', ent); var v = (i && i.value || '').trim();
        if (mode === 'email') {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { if (err) { err.textContent = 'Enter a valid email'; err.setAttribute('data-state', 'err'); } return; }
          try { localStorage.setItem('soar-account', JSON.stringify({ email: v })); localStorage.setItem('soar-promo', 'claimed'); } catch (e2) {}
          ascend();
        } else {
          if (v.toLowerCase() === 'soar') { ascend(); }
          else { if (err) { err.textContent = 'Incorrect password'; err.setAttribute('data-state', 'err'); } if (i) i.select(); }
        }
      });
    }
  }
})();
