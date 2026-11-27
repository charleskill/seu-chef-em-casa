// /sitemap.xml gerado do banco: página inicial, blog, chefs visíveis e completos, cidades e experiências com ao menos um chef real.
// Perfis escondidos, pausados, incompletos ou de apresentação nunca entram.
import { SITE, chefsVisiveis, CIDADES, atende, SERVICOS, fazServico } from './_lib/seo.js';
import { ARTIGOS } from './_lib/blog.js';

const x = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const dia = t => /^\d{4}-\d{2}-\d{2}/.test(String(t || '')) ? String(t).slice(0, 10) : '';

export async function onRequest({ env }) {
  const chefs = await chefsVisiveis(env);
  const urls = [[SITE + '/', '']];
  if (chefs.length) urls.push([SITE + '/personal-chef', ''], [SITE + '/servicos', '']);
  for (const [s] of CIDADES) if (chefs.some(c => atende(c.p, s))) urls.push([SITE + '/personal-chef/' + s, '']);
  for (const s of SERVICOS) if (chefs.some(c => fazServico(c.p, s))) urls.push([SITE + '/servicos/' + s.slug, '']);
  urls.push([SITE + '/orcamento-personal-chef', ''], [SITE + '/para-chefs', ''], [SITE + '/blog', ''], ...ARTIGOS.map(a => [SITE + '/blog/' + a.slug, a.data]));
  for (const c of chefs) urls.push([SITE + '/chef/' + c.slug, dia(c.atualizado)]);
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.map(([u, d]) => '  <url><loc>' + x(u) + '</loc>' + (d ? '<lastmod>' + d + '</lastmod>' : '') + '</url>').join('\n') + '\n</urlset>\n';
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}
