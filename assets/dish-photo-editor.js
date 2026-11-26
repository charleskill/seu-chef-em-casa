(() => {
  'use strict';
  const catalogo = window.ChefDishPhotos;
  const dados = new WeakMap();
  const entradas = Object.entries(catalogo);
  const normal = texto => window.ChefCore.norm(texto).replace(/[^a-z0-9 ]/g, ' ').trim();
  const item = id => Object.hasOwn(catalogo, id) ? catalogo[id] : null;
  const urlLocal = url => window.ChefCore.safeUrl(url, true);

  function imagem(d, demoSrc) {
    const preset = item(d.photoPreset);
    return preset ? { ...preset, url: (location.protocol === 'file:' ? '.' : '') + preset.url } : { url: urlLocal(demoSrc(d.photo)) };
  }

  function montar(form, prato, galeria, demoSrc) {
    const caixa = form.querySelector('[data-dish-photo]');
    const painel = caixa.querySelector('[data-opcoes-foto]');
    const preview = caixa.querySelector('img');
    const remover = caixa.querySelector('[data-remover-foto]');
    const aviso = caixa.querySelector('[role=status]');
    const nome = form.querySelector('#d_name');
    const upload = caixa.querySelector('input[type=file]');
    const salvar = form.querySelector('button[type=submit]');
    let versao = 0;

    function selecionar(escolha, atualizarPainel = true) {
      versao++;
      salvar.disabled = false;
      dados.set(form, escolha);
      const foto = imagem(escolha, demoSrc);
      preview.hidden = !foto.url;
      if (foto.url) preview.src = foto.url;
      else preview.removeAttribute('src');
      remover.hidden = !foto.url;
      if (atualizarPainel) painel.replaceChildren();
      aviso.textContent = foto.author ? 'Foto ilustrativa de ' + foto.author : '';
    }

    function card(escolha, titulo) {
      const foto = imagem(escolha, demoSrc);
      const botao = document.createElement('button');
      botao.type = 'button';
      const img = document.createElement('img');
      img.src = foto.url;
      img.alt = '';
      img.loading = 'lazy';
      const label = document.createElement('span');
      label.textContent = titulo;
      botao.append(img, label);
      botao.addEventListener('click', () => {
        selecionar(escolha);
        caixa.querySelector('summary').focus();
      });
      return botao;
    }

    function mostrar(opcoes, vazio) {
      const grade = document.createElement(opcoes.length ? 'div' : 'p');
      grade.className = 'dish-photo-grid';
      if (opcoes.length) grade.append(...opcoes);
      else grade.textContent = vazio;
      return grade;
    }

    function banco() {
      const busca = document.createElement('input');
      busca.type = 'search';
      busca.setAttribute('aria-label', 'Buscar fotos no acervo');
      busca.placeholder = 'Digite o nome do prato';
      busca.value = nome.value;
      const resultados = document.createElement('div');
      function buscar() {
        const termos = normal(busca.value).split(/\s+/).filter(Boolean);
        const encontradas = entradas.filter(([, foto]) => termos.every(termo => normal(foto.name + ' ' + foto.tags).includes(termo)));
        resultados.replaceChildren(mostrar(encontradas.map(([id, foto]) => card({ photoPreset: id }, foto.name)),
          'Nenhuma foto no acervo para essa busca. Tente um termo mais curto.'));
      }
      painel.replaceChildren(busca, resultados);
      busca.addEventListener('input', buscar);
      busca.addEventListener('keydown', event => {
        if (event.key === 'Enter') event.preventDefault();
      });
      buscar();
      busca.focus();
    }

    caixa.querySelector('[data-sugerir-foto]').onclick = () => {
      const nomePrato = normal(nome.value);
      const sugestao = entradas.find(([, foto]) => normal(foto.name) === nomePrato);
      painel.replaceChildren(mostrar(sugestao ? [card({ photoPreset: sugestao[0] }, sugestao[1].name)] : [],
        'Este prato ainda não tem foto sugerida. Tente buscar no acervo.'));
    };
    caixa.querySelector('[data-foto-portfolio]').onclick = () => {
      painel.replaceChildren(mostrar(galeria.filter(foto => urlLocal(demoSrc(foto.url))).map((foto, i) =>
        card({ photo: foto.url }, foto.caption || 'Foto ' + (i + 1))), 'Seu portfólio ainda não tem fotos.'));
    };
    caixa.querySelector('[data-buscar-fotos]').onclick = banco;
    caixa.querySelector('[data-enviar-foto]').onclick = () => upload.click();
    remover.onclick = () => selecionar({});
    upload.onchange = async () => {
      const arquivo = upload.files[0];
      upload.value = '';
      if (!arquivo) return;
      const atual = ++versao;
      salvar.disabled = false;
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type) || arquivo.size > 10 * 1024 * 1024) {
        aviso.textContent = 'Escolha um JPG, PNG ou WebP de até 10 MB.';
        return;
      }
      const url = URL.createObjectURL(arquivo);
      try {
        salvar.disabled = true;
        aviso.textContent = 'Preparando a foto…';
        const img = new Image();
        img.src = url;
        await img.decode();
        if (!form.isConnected || atual !== versao) return;
        const fator = Math.min(1, 1000 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * fator));
        canvas.height = Math.max(1, Math.round(img.height * fator));
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        selecionar({ photo: canvas.toDataURL('image/jpeg', .8) });
      } catch {
        if (atual === versao) aviso.textContent = 'Não foi possível abrir essa imagem.';
      } finally {
        URL.revokeObjectURL(url);
        if (atual === versao) salvar.disabled = false;
      }
    };
    selecionar(prato.photoPreset ? { photoPreset: prato.photoPreset } : prato.photo ? { photo: prato.photo } : {});
  }

  window.ChefDishPhotoEditor = { montar, imagem, escolha: form => dados.get(form) };
})();
