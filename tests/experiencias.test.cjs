const test=require('node:test');const assert=require('node:assert/strict');
const C=require('../assets/app-core.js');
test('as vinte novas experiências só filtram chefs que optaram por oferecê-las',()=>{
  assert.equal(C.EXPERIENCIAS.length,20);
  assert.equal(new Set(C.EXPERIENCIAS.map(x=>x[2])).size,20);
  for(const [nome,descricao,key,icone] of C.EXPERIENCIAS){
    assert.ok(nome&&descricao&&icone);
    assert.equal(C.opcoes({})[key],false);
    const opcoes=C.cleanOpcoes({[key]:true});
    assert.equal(C.opcoes({opcoes})[key],true);
    assert.equal(C.opcoes({opcoes})[key.replace('x_','nao_existe_')],undefined);
  }
});
test('experiências são escolhidas pelo chef e começam desligadas',()=>{
  assert.equal(C.opcoes({}).x_pizza,false);
  assert.equal(C.opcoes({opcoes:C.cleanOpcoes({x_pizza:true})}).x_pizza,true);
});
