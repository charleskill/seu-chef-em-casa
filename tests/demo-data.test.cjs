const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const C=require('../assets/app-core.js');
const {DISHES}=require('../scripts/demo/catalogo.cjs');
const sandbox={};sandbox.window=sandbox;
for(const f of ['demo-data.js','demo-images.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../assets',f),'utf8'),sandbox);
const seed=sandbox.ChefSeed,imgs=sandbox.ChefDemoImages;
const CATS=['Entradas','Pratos Principais','Massas','Frutos do mar','Sobremesas','Bebidas & drinks'];

test('catálogo grande, sem nomes repetidos e com SC, Brasil e internacional',()=>{
  const nomes=DISHES.map(d=>d.name);
  assert.equal(new Set(nomes).size,nomes.length);
  assert.ok(DISHES.length>=200);
  for(const [o,min] of [['sc',40],['br',45],['int',100]])assert.ok(DISHES.filter(d=>d.origin===o).length>=min,o);
  assert.ok(DISHES.every(d=>d.price>0&&d.desc&&d.emoji&&CATS.includes(d.category)));
});
test('50 chefs de teste completos, identificados e sem contato real',()=>{
  assert.equal(seed.length,50);assert.equal(sandbox.ChefDemo.enabled,true);
  assert.equal(new Set(seed.map(c=>c.id)).size,50);
  for(const c of seed){
    assert.match(c.id,/^demo-\d\d$/);assert.equal(c.isDemo,true);
    assert.ok(c.name&&c.bio&&c.specialty&&c.cities);
    assert.equal(c.whatsapp+c.phone+c.email+c.instagram,'');
    assert.ok(c.dishes.length>=8&&c.dishes.length<=12,c.id+' pratos');
    assert.equal(new Set(c.dishes.map(d=>d.name)).size,c.dishes.length);
    assert.ok(c.dishes.every(d=>d.price>0&&CATS.includes(d.category)&&d.desc));
    assert.ok(c.gallery.length>=4,c.id+' galeria');
  }
});
test('todas as imagens referenciadas existem e são JPEG',()=>{
  for(const c of seed)for(const u of [c.avatar,...c.gallery.map(g=>g.url)]){
    if(!u.startsWith('demo:')){assert.match(u,/^https:\/\//);continue}
    const v=imgs[u.slice(5)];assert.ok(v,u);assert.equal(C.safeUrl(v,true),v);
  }
});
test('marmitas dos chefs de teste são consistentes',()=>{
  const com=seed.filter(c=>c.marmita);
  assert.ok(com.length>=15);
  for(const c of seed){
    const n=c.dishes.filter(d=>d.marmita).length;
    if(c.marmita){assert.equal(JSON.stringify(C.cleanMarmita(c.marmita)),JSON.stringify(c.marmita));assert.ok(n>=3,c.id)}
    else assert.equal(n,0,c.id);
  }
  assert.ok(com.some(c=>c.marmita.freq.includes('mensal'))&&com.some(c=>c.marmita.modes.includes('casa')));
});
test('o conjunto cobre as três origens e várias cidades de Santa Catarina',()=>{
  const usados=new Set(seed.flatMap(c=>c.dishes.map(d=>d.name)));
  for(const o of ['sc','br','int'])assert.ok(DISHES.some(d=>d.origin===o&&usados.has(d.name)),o);
  assert.ok(usados.size>=150);
  const cidades=new Set(seed.flatMap(c=>c.cities.split(/,|&/).map(x=>x.trim())));
  assert.ok(cidades.size>=15);
});
