const test=require('node:test');const assert=require('node:assert/strict');
const C=require('../assets/app-core.js');
const photos=require('../assets/service-photos.js');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
test('todos os 55 serviços têm uma foto local disponível, incluindo as quarenta experiências',()=>{
  const source=fs.readFileSync(path.join(__dirname,'../assets/app.js'),'utf8');
  const original=vm.runInNewContext(source.match(/const SERVICOS=(\[.*?\]);/)[1]);
  const names=[...original.map(x=>x[0]),...C.EXPERIENCIAS.map(x=>x[0]),'Marmitas da semana'];
  assert.equal(names.length,55);
  assert.equal(new Set(names).size,55);
  assert.equal(Object.keys(photos).length,55);
  for(const name of names){
    assert.match(photos[name],/^assets\/servicos\/[a-z0-9-]+\.webp$/);
    const image=fs.readFileSync(path.join(__dirname,'..',photos[name]));
    assert.equal(image.toString('ascii',0,4),'RIFF',name);
    assert.equal(image.toString('ascii',8,12),'WEBP',name);
    assert.ok(image.length>3000,name);
  }
});
test('as quarenta novas experiências só filtram chefs que optaram por oferecê-las',()=>{
  assert.equal(C.EXPERIENCIAS.length,40);
  assert.equal(new Set(C.EXPERIENCIAS.map(x=>x[2])).size,40);
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
