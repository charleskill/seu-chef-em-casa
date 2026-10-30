const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),vm=require('vm');
const ctx={window:{},console};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync('assets/app-core.js','utf8'),ctx);const C=ctx.window.ChefCore||ctx.ChefCore||ctx.window.C;
test('opcoes: padrões e limpeza',()=>{
  const o=C.opcoes({});assert.equal(o.criancas,true);assert.equal(o.garcom,false);
  assert.equal(C.opcoes({opcoes:{criancas:false}}).criancas,false);
  assert.equal(JSON.stringify(C.cleanOpcoes({criancas:false,x:1,garcom:'sim'})),'{"criancas":false}');
  assert.equal(C.cleanOpcoes({x:1}),null);
});
test('normalizeData mantém opcoes válidas',()=>{
  const d=C.normalizeData({chefs:[{id:'a',name:'A',opcoes:{criancas:false,lixo:true}}]},[]);
  assert.equal(JSON.stringify(d.chefs[0].opcoes),'{"criancas":false}');
});
test('mapsUrl',()=>{
  assert.equal(C.mapsUrl('  '),'');
  assert.equal(C.mapsUrl('Pedra Branca, Palhoça'),'https://www.google.com/maps/search/?api=1&query=Pedra%20Branca%2C%20Palho%C3%A7a');
});
