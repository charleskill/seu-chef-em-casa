const test=require('node:test');const assert=require('node:assert/strict');
const C=require('../assets/app-core.js');
test('perfil só fica pronto com foto, prato e cidade',()=>{
  assert.deepEqual(C.faltaPerfil({}),['foto','prato','cidade']);
  assert.deepEqual(C.faltaPerfil({avatar:'x',dishes:[{}],cities:'  '}),['cidade']);
  assert.deepEqual(C.faltaPerfil({gallery:[{}],dishes:[{}],cities:'Florianópolis'}),[]);
});
