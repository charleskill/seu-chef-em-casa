/* Celular em "site para computador".
   Nesse modo o navegador ignora a marcação de celular e desenha a página com ~980 px de largura, encolhida:
   menu e textos ficam minúsculos. Aqui detectamos um aparelho de toque com tela estreita mostrando a página larga
   e forçamos o layout de celular: ligamos as regras de CSS de tela pequena e ampliamos a página (zoom) para a largura real. */
(function () {
  'use strict';
  if (typeof window === 'undefined' || !window.matchMedia) return;
  const regras = [];
  function guardar() {
    if (regras.length) return;
    for (const folha of document.styleSheets) {
      let lista; try { lista = folha.cssRules; } catch (e) { continue; }
      for (const r of lista) if (r.media && r.conditionText !== undefined) regras.push({ r, original: r.media.mediaText });
    }
  }
  function aplicar() {
    const toque = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    const tela = screen.width;
    const larga = window.innerWidth;
    const forcar = toque && tela > 0 && tela <= 600 && larga > tela * 1.3;
    guardar();
    for (const { r, original } of regras) {
      let texto = original;
      if (forcar) {
        const max = /max-width:\s*(\d+)px/.exec(original), min = /min-width:\s*(\d+)px/.exec(original);
        if (max && !min && tela <= Number(max[1])) texto = 'all';
        else if (min && !max && tela < Number(min[1])) texto = 'not all';
      }
      if (r.media.mediaText !== texto) r.media.mediaText = texto;
    }
    const zoom = forcar ? (larga / tela).toFixed(3) : '';
    document.documentElement.style.zoom = zoom;
    document.documentElement.toggleAttribute('data-celular-forcado', forcar);
  }
  aplicar();
  let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(aplicar, 150); });
})();
