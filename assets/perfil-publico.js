(() => {
  document.querySelector('[data-imprimir]')?.addEventListener('click', () => window.print());
  const dialog = document.querySelector('#foto-publica');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const publicacoes = [...document.querySelectorAll('[data-publicacao]')];
  const imagem = dialog.querySelector('img');
  const legenda = dialog.querySelector('#foto-legenda');
  const numero = dialog.querySelector('output');
  const anterior = dialog.querySelector('[data-anterior]');
  const proxima = dialog.querySelector('[data-proxima]');
  const whatsapp = dialog.querySelector('[data-whatsapp]');
  const copiar = dialog.querySelector('[data-copiar]');
  const status = dialog.querySelector('[data-compartilhamento]');
  const manual = dialog.querySelector('[data-link-manual]');
  const chef = dialog.dataset.chef;
  const exemplo = chef === 'exemplo';
  const curtida = dialog.querySelector('[data-curtir]');
  const lista = dialog.querySelector('[data-comentarios]');
  const aviso = dialog.querySelector('[data-social-status]');
  const entrar = dialog.querySelector('[data-entrar]');
  const formulario = dialog.querySelector('[data-comentar]');
  const texto = formulario.querySelector('textarea');
  const publicar = formulario.querySelector('button');
  const demonstracao = new Map();
  let indice = 0;
  let origem;
  let revisao = 0;

  const fotoAtual = () => publicacoes[indice].dataset.fotoId;
  function mostrarCurtida({ curti = false, curtidas = 0 } = {}) {
    curtida.setAttribute('aria-pressed', String(curti));
    curtida.textContent = (curti ? '♥ Curtido' : '♡ Curtir') + ' · ' + curtidas;
  }

  function mostrarComentarios(comentarios) {
    lista.replaceChildren();
    for (const comentario of comentarios) {
      const item = document.createElement('li');
      const nome = document.createElement('strong');
      const corpo = document.createElement('p');
      nome.textContent = comentario.nome;
      corpo.textContent = comentario.texto;
      item.append(nome, corpo);
      lista.append(item);
    }
    if (!comentarios.length) {
      const vazio = document.createElement('li');
      vazio.textContent = 'Seja a primeira pessoa a comentar.';
      lista.append(vazio);
    }
  }

  function estadoDemo(foto) {
    if (!demonstracao.has(foto)) {
      const comentarios = foto === 'foto-2' ? [
        { nome: 'Visitante de exemplo', texto: 'Que risoto bonito! O que você serviu de entrada?' }
      ] : [];
      demonstracao.set(foto, { curti: false, curtidas: 0, comentarios });
    }
    return demonstracao.get(foto);
  }

  async function carregarConversa(foto, versao) {
    curtida.disabled = true;
    mostrarCurtida();
    lista.replaceChildren();
    aviso.textContent = 'Carregando comentários…';
    entrar.hidden = true;
    publicar.disabled = true;
    texto.readOnly = false;
    texto.value = '';
    try {
      const dados = exemplo ? estadoDemo(foto) : await Promise.all([
        window.ChefCloud.social(chef), window.ChefCloud.comentarios(chef, foto)
      ]).then(([social, resposta]) => ({ ...social.fotos[foto], comentarios: resposta.comentarios }));
      if (versao !== revisao) return;
      mostrarCurtida(dados);
      mostrarComentarios(dados.comentarios);
      aviso.textContent = '';
      curtida.disabled = publicar.disabled = false;
    } catch {
      if (versao === revisao) aviso.textContent = 'Os comentários e as curtidas não carregaram. Feche e abra a foto para tentar novamente.';
    }
  }

  function avisarErro(erro) {
    aviso.textContent = erro.message || 'Não foi possível concluir esta ação.';
    entrar.hidden = erro.status !== 401;
  }

  function mostrar(posicao) {
    indice = (posicao + publicacoes.length) % publicacoes.length;
    const link = publicacoes[indice];
    imagem.src = link.href;
    imagem.alt = link.querySelector('img').alt;
    legenda.textContent = link.dataset.legenda;
    legenda.hidden = !legenda.textContent;
    numero.textContent = (indice + 1) + ' de ' + publicacoes.length;
    whatsapp.href = 'https://wa.me/?text=' + encodeURIComponent('Veja esta foto no Seu Chef em Casa: ' + link.dataset.link);
    manual.value = link.dataset.link;
    manual.hidden = status.hidden = true;
    carregarConversa(fotoAtual(), ++revisao);
  }

  entrar.addEventListener('click', () => {
    try {
      const url = new URL(publicacoes[indice].dataset.link);
      sessionStorage.setItem('sc_volta_publicacao', url.pathname + url.search);
    } catch {}
  });

  curtida.addEventListener('click', async () => {
    const foto = fotoAtual(), versao = revisao;
    const curti = curtida.getAttribute('aria-pressed') !== 'true';
    curtida.disabled = true;
    try {
      let resposta;
      if (exemplo) {
        const dados = estadoDemo(foto);
        dados.curti = curti;
        dados.curtidas = Number(curti);
        resposta = dados;
      } else {
        resposta = await window.ChefCloud.curtir(chef, foto, curti);
      }
      if (versao === revisao) {
        mostrarCurtida(resposta);
        aviso.textContent = '';
        entrar.hidden = true;
      }
    } catch (erro) {
      if (versao === revisao) avisarErro(erro);
    } finally {
      if (versao === revisao) curtida.disabled = false;
    }
  });

  formulario.addEventListener('submit', async event => {
    event.preventDefault();
    const comentario = texto.value.trim();
    if (!comentario || publicar.disabled) return;
    const foto = fotoAtual(), versao = revisao;
    publicar.disabled = true;
    texto.readOnly = true;
    try {
      let comentarios;
      if (exemplo) {
        comentarios = estadoDemo(foto).comentarios;
        comentarios.push({ nome: 'Você (demonstração)', texto: comentario });
      } else {
        await window.ChefCloud.comentar(chef, foto, comentario);
      }
      if (versao !== revisao) return;
      texto.value = '';
      entrar.hidden = true;
      aviso.textContent = 'Comentário publicado.';
      if (!exemplo) comentarios = (await window.ChefCloud.comentarios(chef, foto)).comentarios;
      if (versao === revisao) mostrarComentarios(comentarios);
    } catch (erro) {
      if (versao === revisao) avisarErro(erro);
    } finally {
      if (versao === revisao) {
        publicar.disabled = false;
        texto.readOnly = false;
      }
    }
  });

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
    if (event.target.matches('input, textarea')) return;
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
