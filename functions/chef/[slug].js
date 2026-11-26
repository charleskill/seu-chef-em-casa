// /chef/<nome>-<6 hex do id>: perfil do chef montado no servidor, com HTML completo para o Google
// (title, description, canonical, Open Graph e JSON-LD). Se o nome mudou, redireciona (301) para o endereço atual.
import { vitrine, indisponivel, fotoOk } from '../_lib/vitrine.js';
import { SITE, producao, chefPorSlug, cidadesDoChef } from '../_lib/seo.js';

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url), slug = String(params.slug || '').toLowerCase();
  const c = await chefPorSlug(env, slug);
  if (!c) return indisponivel(url.origin);
  if (c.slug !== String(params.slug || '')) return new Response(null, { status: 301, headers: { location: url.origin + '/chef/' + c.slug + url.search, 'cache-control': 'public, max-age=300' } });
  const p = c.p, canonico = SITE + '/chef/' + c.slug;
  const foto = fotoOk(p.avatar, SITE) || fotoOk(((p.gallery || [])[0] || {}).url, SITE);
  const cidades = String(p.cities || '').split(/[,;/\n]/).map(s => s.trim()).filter(Boolean);
  const pratos = (Array.isArray(p.dishes) ? p.dishes : []).filter(d => d && d.name).slice(0, 60);
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Person', '@id': canonico + '#chef', name: p.name, jobTitle: 'Personal chef', url: canonico,
      ...(foto ? { image: foto } : {}), ...(p.bio ? { description: String(p.bio).slice(0, 400) } : {}), ...(p.specialty ? { knowsAbout: p.specialty } : {}),
      ...(cidades.length ? { areaServed: cidades.map(n => ({ '@type': 'City', name: n })) } : {}) },
    ...(pratos.length ? [{ '@type': 'Menu', name: 'Cardápio de ' + p.name, url: canonico, hasMenuItem: pratos.map(d => ({ '@type': 'MenuItem', name: d.name,
      ...(d.desc ? { description: d.desc } : {}), ...(Number(d.price) > 0 ? { offers: { '@type': 'Offer', price: String(Number(d.price)), priceCurrency: 'BRL' } } : {}) })) }] : []),
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Seu Chef em Casa', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: p.name, item: canonico }] }
  ] };
  const social = await contadores(env.DB, c.id).catch(() => null);
  return vitrine(p, { origem: url.origin, id: c.id, esteLink: canonico, extra: { portfolio: url.searchParams.get('portfolio') === 'pdf', foto: url.searchParams.get('foto'), social, jsonld, cidades: cidadesDoChef(p), noindex: !producao(request.url) } });
}

async function contadores(db, id) {
  // A tabela social é criada sob demanda em instalações novas.
  const tabela = await db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'seguidores'").first();
  if (!tabela) return { seguidores: 0, seguindo: 0 };
  return db.prepare('SELECT (SELECT COUNT(*) FROM seguidores WHERE chef_id = ?) AS seguidores, (SELECT COUNT(*) FROM seguidores WHERE conta_id = ?) AS seguindo').bind(id, id).first();
}
