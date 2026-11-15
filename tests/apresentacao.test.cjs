const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../assets/app-core.js'),{profiles}=require('../scripts/perfis-apresentacao.cjs');
test('três perfis de apresentação têm 25 pratos, nove fotos e retrato, sem contas reais ou pedidos inventados',()=>{
 assert.equal(profiles.length,3);assert.equal(new Set(profiles.map(c=>c.id)).size,3);
 for(const c of profiles){const p=c.profile;assert.match(c.email,/@apresentacao\.invalid$/);assert.match(c.id,/^chef-[a-f\d]{16}$/);assert.deepEqual(C.faltaPerfil(p),[]);assert.equal(p.whatsapp,'(48) 99110-6355');assert.equal(p.dishes.length,25);assert.equal(new Set(p.dishes.map(d=>d.name)).size,25);assert.equal(p.gallery.length,9);assert.equal(new Set(p.gallery.map(g=>g.url)).size,9);assert.equal('pedidos' in p,false);assert.equal('avaliacoes' in p,false);
  for(const d of p.dishes)assert.ok(d.price>0&&d.desc&&d.category);
  for(const url of [p.avatar,...p.gallery.map(g=>g.url)]){assert.equal(C.safeUrl(url,true),url);assert.ok(fs.statSync(path.join(__dirname,'..',url.slice(1))).size>10000);}
 }
 assert.equal(C.safeUrl('/assets/apresentacao/../segredo.webp',true),'');
 assert.equal(C.safeUrl('/assets/apresentacao/personagem.svg',true),'');
});
