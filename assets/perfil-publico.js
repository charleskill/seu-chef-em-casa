(() => {
  const dialog = document.querySelector('#foto-publica');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const publicacoes = [...document.querySelectorAll('[data-publicacao]')];
  const imagem = dialog.querySelector('img');
  const legenda = dialog.querySelector('#foto-legenda');
  const numero = dialog.querySelector('output');
  const anterior = dialog.querySelector('[data-anterior]');
  const proxima = dialog.querySelector('[data-proxima]');
  const interagir = dialog.querySelector('[data-interagir]');
  const whatsapp = dialog.querySelector('[data-whatsapp]');
  const copiar = dialog.querySelector('[data-copiar]');
  const status = dialog.querySelector('[data-compartilhamento]');
  const manual = dialog.querySelector('[data-link-manual]');
  let indice = 0;
  let origem;

  function mostrar(posicao) {
    indice = (posicao + publicacoes.length) % publicacoes.length;
    const link = publicacoes[indice];
    imagem.src = link.href;
    imagem.alt = link.querySelector('img').alt;
    legenda.textContent = link.dataset.legenda;
    legenda.hidden = !legenda.textContent;
    numero.textContent = (indice + 1) + ' de ' + publicacoes.length;
    if (interagir) interagir.href = link.dataset.interagir;
    whatsapp.href = 'https://wa.me/?text=' + encodeURIComponent('Veja esta publicação no Seu Chef em Casa: ' + link.dataset.link);
    manual.value = link.dataset.link;
    manual.hidden = status.hidden = true;
  }

  publicacoes.forEach((link, i) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    origem = link;
    mostrar(i);
    dialog.showModal();
  }));
  anterior.disabled = proxima.disabled = publicacoes.length < 2;
  dialog.querySelector('[data-fechar]').addEventListener('click', () => dialog.close());
  anterior.addEventListener('click', () => mostrar(indice - 1));
  proxima.addEventListener('click', () => mostrar(indice + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      mostrar(indice + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  dialog.addEventListener('close', () => origem?.focus());
  copiar.addEventListener('click', async () => {
    const url = manual.value;
    let copiado = false;
    try {
      await navigator.clipboard.writeText(url);
      copiado = true;
    } catch {}
    if (manual.value !== url || !dialog.open) return;
    status.hidden = false;
    status.textContent = copiado ? 'Link copiado.' : 'Selecione e copie o link da foto.';
    manual.hidden = copiado;
    if (!copiado) manual.select();
  });

  const inicial = publicacoes.findIndex(link => link.hasAttribute('data-foto-inicial'));
  if (inicial >= 0) {
    origem = publicacoes[inicial];
    mostrar(inicial);
    dialog.showModal();
  }
})();
