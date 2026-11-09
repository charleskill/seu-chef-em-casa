const test=require('node:test');const assert=require('node:assert/strict');
const C=require('../assets/app-core.js');
test('experiências são escolhidas pelo chef e começam desligadas',()=>{
  assert.equal(C.opcoes({}).x_pizza,false);
  assert.equal(C.opcoes({opcoes:C.cleanOpcoes({x_pizza:true})}).x_pizza,true);
});