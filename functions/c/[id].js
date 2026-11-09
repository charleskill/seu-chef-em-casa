// Link de compartilhamento do chef: /c/<id>
// Devolve uma página com a prévia (foto, nome, especialidade) que WhatsApp, Instagram e Facebook mostram,
// e leva a pessoa na hora para o perfil no app (/#/chef/<id>).
const PADRAO = {
  titulo: 'Seu Chef em Casa · Boa comida, boas histórias',
  desc: 'Conheça personal chefs, explore cardápios e prepare seu pedido de orçamento.',
  imagem: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&h=630&fit=crop&q=80'
};
const e = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export async function onRequest({ request, env, params }) {
  const origem = new URL(request.url).origin, id = String(params.id || '');
  const destino = origem + '/#/chef/' + encodeURIComponent(id);
  let { titulo, desc, imagem } = PADRAO;
  if (/^chef-[a-f\d]{16}$/.test(id) && env.DB) {
    try {
      const row = await env.DB.prepare('SELECT perfil FROM chefs WHERE id = ? AND publicado = 1 AND COALESCE(oculto, 0) = 0').bind(id).first();
      if (row) {
        const p = JSON.parse(row.perfil || '{}');
        if (p.name) titulo = p.name + ' · Personal chef no Seu Chef em Casa';
        const linha = [p.specialty, p.cities].filter(Boolean).join(' · ');
        if (linha) desc = linha + '. Veja o cardápio e peça seu orçamento.';
        const foto = (p.gallery && p.gallery[0] && p.gallery[0].url) || p.avatar || '';
        if (foto.startsWith('/api/foto/')) imagem = origem + foto;
        else if (/^https:\/\//.test(foto)) imagem = foto;
      }
    } catch (err) { /* sem banco ou coluna: usa a prévia padrão */ }
  }
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(titulo)}</title>
<meta name="description" content="${e(desc)}">
<meta property="og:type" content="profile"><meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Seu Chef em Casa">
<meta property="og:title" content="${e(titulo)}"><meta property="og:description" content="${e(desc)}">
<meta property="og:image" content="${e(imagem)}"><meta property="og:url" content="${e(origem + '/c/' + id)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${e(destino)}">
<meta http-equiv="refresh" content="0;url=${e(destino)}">
<script>location.replace(${JSON.stringify(destino)})</script>
</head><body style="font-family:system-ui;padding:24px"><p><a href="${e(destino)}">Abrir o perfil no Seu Chef em Casa</a></p></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } });
}
