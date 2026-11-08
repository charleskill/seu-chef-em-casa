const test=require('node:test');const assert=require('node:assert/strict');
const C=require('../assets/app-core.js');
test('fotos do banco do piloto são aceitas como imagem',()=>{
  assert.equal(C.safeUrl('/api/foto/0123456789abcdef0123456789abcdef',true),'/api/foto/0123456789abcdef0123456789abcdef');
  assert.equal(C.safeUrl('/api/foto/../../segredo',true),'');
  assert.equal(C.safeUrl('/api/foto/0123456789abcdef0123456789abcdef',false),'');
  assert.equal(C.safeUrl('javascript:alert(1)',true),'');
});
test('cloud.js carrega sem quebrar fora do navegador',()=>{
  require('../assets/cloud.js');assert.equal(typeof globalThis.ChefCloud.start,'function');assert.equal(globalThis.ChefCloud.on,false);
});
