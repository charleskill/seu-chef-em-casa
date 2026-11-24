const test=require('node:test');const assert=require('node:assert/strict');
const C=require('../assets/app-core.js');
test('perfil só fica pronto com foto, prato e cidade',()=>{
  assert.deepEqual(C.faltaPerfil({}),['whatsapp','foto','prato','cidade']);
  assert.deepEqual(C.faltaPerfil({avatar:'x',dishes:[{}],cities:'  ',whatsapp:'48991106355'}),['cidade']);
  assert.deepEqual(C.faltaPerfil({gallery:[{}],dishes:[{}],cities:'Florianópolis',whatsapp:'48991106355'}),[]);
});
