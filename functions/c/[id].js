// /c/<id>: endereço antigo da vitrine do chef. Agora leva (301) ao endereço novo /chef/<slug>, que vai para o Google.
// /c/exemplo continua mostrando o chef fictício (com noindex), para apresentar a página aos chefs.
import { EXEMPLO, vitrine, indisponivel } from '../_lib/vitrine.js';
import { chefPorId } from '../_lib/seo.js';

export async function onRequest({ request, env, params }) {
  const url = new URL(request.url), id = String(params.id || '');
  if (id === 'exemplo') return vitrine(EXEMPLO, { origem: url.origin, id, esteLink: url.origin + '/c/exemplo', extra: { foto: url.searchParams.get('foto') } });
  const c = await chefPorId(env, id);
  if (!c) return indisponivel(url.origin);
  return new Response(null, { status: 301, headers: { location: url.origin + '/chef/' + c.slug, 'cache-control': 'public, max-age=300' } });
}
