// Efeitos visuais da página inicial (tipo React Bits, sem React). As telas são montadas pelo app.js
// dentro de #view, então os efeitos são aplicados a cada troca de tela. Com "reduzir movimento" ligado
// no aparelho eles ficam parados; ?movimento no endereço liga mesmo assim (para revisar).
(function () {
  'use strict';
  var forcar = /[?&]movimento\b/.test(location.search);
  if (forcar) document.documentElement.classList.add('fx-force');
  var calmo = !forcar && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function luz(el, classe) {
    var s = document.createElement('span');
    s.className = classe;
    s.setAttribute('aria-hidden', 'true');
    el.prepend(s);
  }

  // título palavra por palavra; leitores de tela recebem a frase inteira
  function titulo(h1) {
    var texto = h1.textContent.trim();
    if (!texto) return;
    h1.setAttribute('aria-label', texto);
    h1.textContent = '';
    texto.split(/\s+/).forEach(function (p, i) {
      if (i) h1.appendChild(document.createTextNode(' '));
      var s = document.createElement('span');
      s.className = 'fx-word';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      s.textContent = p;
      h1.appendChild(s);
    });
  }

  // número contando de 0 até o valor, uma vez
  function contar(el) {
    var fim = Number(el.getAttribute('data-count'));
    if (!fim) return;
    var dur = 1400, inicio = performance.now() + 400;
    el.textContent = '0';
    (function passo(t) {
      var k = Math.min(1, Math.max(0, (t - inicio) / dur));
      el.textContent = String(Math.round(fim * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(passo);
    })(performance.now());
  }

  function aplicar(raiz) {
    if (calmo) return;
    raiz.querySelectorAll('.hero h1:not([data-fx])').forEach(function (h) { h.setAttribute('data-fx', ''); titulo(h); });
    raiz.querySelectorAll('[data-count]:not([data-fx])').forEach(function (el) { el.setAttribute('data-fx', ''); contar(el); });
    raiz.querySelectorAll('.hero .b1:not([data-fx])').forEach(function (b) { b.setAttribute('data-fx', ''); b.classList.add('fx-shine'); luz(b, 'fx-shine__light'); });
    raiz.querySelectorAll('.home-service-card:not([data-fx]), .how-item:not([data-fx])').forEach(function (c) {
      c.setAttribute('data-fx', '');
      c.classList.add('fx-spot');
      luz(c, 'fx-spot__light');
    });
  }

  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.fx-spot');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  function iniciar() {
    var view = document.getElementById('view');
    if (!view) return;
    aplicar(view);
    new MutationObserver(function () { aplicar(view); }).observe(view, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
