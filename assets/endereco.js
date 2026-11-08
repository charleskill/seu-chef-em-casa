/* Sugestões de endereço e cidade enquanto a pessoa digita.
   Fonte: Photon (photon.komoot.io), gratuito e sem chave, com dados do OpenStreetMap.
   Liga em qualquer campo com data-endereco:
     "endereco" → endereço completo (rua, número, bairro, cidade - UF)
     "cidade"   → só o nome da cidade
     "cidades"  → lista de cidades; a sugestão troca só o último trecho depois de "," ou "&"
   Para trocar pelo Google Places no futuro, basta reescrever buscar() mantendo o formato dos itens. */
(function (root) {
  'use strict';
  const UF = { 'Acre':'AC','Alagoas':'AL','Amapá':'AP','Amazonas':'AM','Bahia':'BA','Ceará':'CE','Distrito Federal':'DF','Espírito Santo':'ES','Goiás':'GO','Maranhão':'MA','Mato Grosso':'MT','Mato Grosso do Sul':'MS','Minas Gerais':'MG','Pará':'PA','Paraíba':'PB','Paraná':'PR','Pernambuco':'PE','Piauí':'PI','Rio de Janeiro':'RJ','Rio Grande do Norte':'RN','Rio Grande do Sul':'RS','Rondônia':'RO','Roraima':'RR','Santa Catarina':'SC','São Paulo':'SP','Sergipe':'SE','Tocantins':'TO' };
  const uf = s => UF[s] || s || '';
  const CIDADE = ['city', 'town', 'village'];

  // Transforma um resultado do Photon em { titulo, detalhe, valor } conforme o modo do campo.
  function item(f, modo, consulta) {
    const p = f.properties || {};
    if (p.countrycode && p.countrycode !== 'BR') return null;
    const tipo = p.osm_value || p.type;
    const ehCidade = p.type === 'city' || CIDADE.includes(tipo);
    const cidade = ehCidade ? p.name : (p.city || p.county || '');
    const estado = uf(p.state);
    if (modo !== 'endereco') {
      if (!ehCidade || !p.name) return null;
      return { titulo: p.name, detalhe: [p.state, 'Brasil'].filter(Boolean).join(', '), valor: p.name };
    }
    let rua = p.street || '', nome = p.name || '';
    if (p.type === 'street' || (!p.street && p.osm_key === 'highway')) { rua = nome; nome = ''; }
    // Nome de loja/lugar só aparece se a pessoa digitou esse nome (senão "Rua X, 123" virava "Banco do Brasil · Rua X, 123").
    const sem = t => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (nome && rua && !sem(nome).split(/\s+/).some(w => w.length > 2 && sem(consulta).includes(w))) nome = '';
    let numero = p.housenumber || '';
    // Mantém o número que a pessoa digitou quando a sugestão é só a rua.
    if (rua && !numero) { const m = String(consulta).match(/\b(\d{1,6})\b/); if (m) numero = m[1]; }
    const linha1 = [nome && nome !== rua ? nome : '', [rua, numero].filter(Boolean).join(', ')].filter(Boolean).join(' · ') || cidade;
    const bairro = p.district || p.locality || '';
    const fim = [bairro && bairro !== linha1 ? bairro : '', cidade && cidade !== linha1 ? cidade + (estado ? ' - ' + estado : '') : (estado || '')].filter(Boolean).join(', ');
    if (!linha1) return null;
    return { titulo: linha1, detalhe: fim, valor: [linha1.replace(' · ', ', '), fim].filter(Boolean).join(', ') };
  }

  async function buscar(texto, modo, sinal) {
    const u = new URL('https://photon.komoot.io/api/');
    u.searchParams.set('q', texto); u.searchParams.set('limit', '10');
    // Prioriza a Grande Florianópolis e limita ao Brasil.
    u.searchParams.set('lat', '-27.6'); u.searchParams.set('lon', '-48.6');
    u.searchParams.set('bbox', '-74,-34,-34,6');
    if (modo !== 'endereco') ['city', 'locality'].forEach(l => u.searchParams.append('layer', l));
    const r = await fetch(u, { signal: sinal });
    if (!r.ok) throw new Error('sem sugestões');
    const j = await r.json(), vistos = new Set(), out = [];
    for (const f of j.features || []) {
      const it = item(f, modo, texto);
      if (!it || vistos.has(it.valor)) continue;
      vistos.add(it.valor); out.push(it); if (out.length >= 5) break;
    }
    return out;
  }

  // Interface: lista abaixo do campo, com teclado (setas, Enter, Esc) e toque.
  let atual = null, timer = null, ctl = null, seq = 0;
  function caixa(el) {
    let box = document.getElementById('endereco-sugestoes');
    if (!box) {
      box = document.createElement('div'); box.id = 'endereco-sugestoes'; box.className = 'end-sug'; box.setAttribute('role', 'listbox');
      box.addEventListener('mousedown', e => e.preventDefault());
      box.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) escolher(+b.dataset.i); });
      document.body.appendChild(box);
    }
    const r = el.getBoundingClientRect();
    box.style.left = (r.left + window.scrollX) + 'px'; box.style.top = (r.bottom + window.scrollY + 4) + 'px'; box.style.width = r.width + 'px';
    return box;
  }
  function fechar() {
    const box = document.getElementById('endereco-sugestoes'); if (box) box.hidden = true;
    if (atual) { atual.el.setAttribute('aria-expanded', 'false'); atual.el.removeAttribute('aria-activedescendant'); }
    atual = null;
  }
  function desenhar() {
    if (!atual) return;
    const { el, itens, sel } = atual, box = caixa(el);
    if (!itens.length) { fechar(); return; }
    box.innerHTML = itens.map((it, i) => '<button type="button" role="option" id="end-op-' + i + '" data-i="' + i + '" aria-selected="' + (i === sel) + '" class="' + (i === sel ? 'on' : '') + '"><b></b><small></small></button>').join('') + '<p class="end-cred">Sugestões: Photon · © OpenStreetMap</p>';
    box.querySelectorAll('[data-i]').forEach((b, i) => { b.querySelector('b').textContent = itens[i].titulo; b.querySelector('small').textContent = itens[i].detalhe; });
    box.hidden = false; el.setAttribute('aria-expanded', 'true');
    if (sel >= 0) el.setAttribute('aria-activedescendant', 'end-op-' + sel); else el.removeAttribute('aria-activedescendant');
  }
  function trecho(el) {
    const v = el.value;
    if (el.dataset.endereco !== 'cidades') return { antes: '', texto: v };
    const i = Math.max(v.lastIndexOf(','), v.lastIndexOf('&'));
    return { antes: i >= 0 ? v.slice(0, i + 1) + ' ' : '', texto: v.slice(i + 1) };
  }
  function escolher(i) {
    if (!atual || !atual.itens[i]) return;
    const { el } = atual, t = trecho(el);
    el.value = (t.antes + atual.itens[i].valor).slice(0, Number(el.maxLength) > 0 ? Number(el.maxLength) : 300);
    fechar();
    el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
    el.focus();
  }
  function preparar(el) {
    if (el.dataset.endPronto) return;
    el.dataset.endPronto = '1'; el.setAttribute('role', 'combobox'); el.setAttribute('aria-autocomplete', 'list');
    el.setAttribute('aria-controls', 'endereco-sugestoes'); el.setAttribute('aria-expanded', 'false');
    el.setAttribute('autocomplete', 'off'); el.removeAttribute('list');
  }

  root.ChefEndereco = { item, buscar };
  if (typeof document === 'undefined') return;
  document.addEventListener('focusin', e => { if (e.target.matches && e.target.matches('input[data-endereco]')) preparar(e.target); });
  document.addEventListener('input', e => {
    const el = e.target; if (!el.matches || !el.matches('input[data-endereco]') || !e.isTrusted) return;
    preparar(el); clearTimeout(timer); if (ctl) ctl.abort();
    const t = trecho(el).texto.trim();
    if (t.length < 3) { fechar(); return; }
    timer = setTimeout(async () => {
      const n = ++seq; ctl = new AbortController();
      try {
        const itens = await buscar(t, el.dataset.endereco, ctl.signal);
        if (n !== seq || document.activeElement !== el) return;
        atual = { el, itens, sel: -1 }; desenhar();
      } catch (err) { if (n === seq) fechar(); }
    }, 300);
  });
  document.addEventListener('keydown', e => {
    if (!atual || e.target !== atual.el) return;
    const n = atual.itens.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); atual.sel = (atual.sel + 1) % n; desenhar(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); atual.sel = (atual.sel - 1 + n) % n; desenhar(); }
    else if (e.key === 'Enter' && atual.sel >= 0) { e.preventDefault(); escolher(atual.sel); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); fechar(); }
  }, true);
  document.addEventListener('focusout', e => { if (atual && e.target === atual.el) setTimeout(fechar, 150); });
  window.addEventListener('hashchange', fechar);
  window.addEventListener('resize', () => { if (atual) desenhar(); });
  document.addEventListener('scroll', () => { if (atual) caixa(atual.el); }, true);

})(typeof window !== 'undefined' ? window : globalThis);
