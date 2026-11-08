const test=require('node:test'),assert=require('node:assert');
require('../assets/endereco.js');const E=globalThis.ChefEndereco;
const F=p=>({properties:{countrycode:'BR',...p}});
test('endereço: rua com número digitado vira endereço completo com UF',()=>{
  const it=E.item(F({type:'street',osm_key:'highway',name:'Avenida Pedra Branca',district:'Cidade Universitária Pedra Branca',city:'Palhoça',state:'Santa Catarina'}),'endereco','av pedra branca 123');
  assert.equal(it.valor,'Avenida Pedra Branca, 123, Cidade Universitária Pedra Branca, Palhoça - SC');
});
test('cidade: só cidades do Brasil, valor é o nome',()=>{
  assert.equal(E.item(F({type:'city',name:'Florianópolis',state:'Santa Catarina'}),'cidade','flori').valor,'Florianópolis');
  assert.equal(E.item(F({type:'city',name:'Florianópolis',state:'Santa Catarina'}),'cidade','flori').detalhe,'Santa Catarina, Brasil');
  assert.equal(E.item(F({type:'street',name:'Rua X',city:'Palhoça'}),'cidade','rua'),null);
  assert.equal(E.item({properties:{countrycode:'US',type:'city',name:'Florida'}},'cidade','flori'),null);
});
test('endereço: lugar com rua e número próprios',()=>{
  const it=E.item(F({type:'house',name:'Padaria Teste',street:'Rua Bocaiúva',housenumber:'2468',district:'Centro',city:'Florianópolis',state:'Santa Catarina'}),'endereco','padaria');
  assert.equal(it.valor,'Padaria Teste, Rua Bocaiúva, 2468, Centro, Florianópolis - SC');
});
test('endereço: loja no endereço digitado vira só o endereço',()=>{
  const it=E.item(F({type:'house',name:'Banco do Brasil',street:'Rua Bocaiúva',housenumber:'2468',district:'Centro',city:'Florianópolis',state:'Santa Catarina'}),'endereco','rua bocaiuva 2468');
  assert.equal(it.valor,'Rua Bocaiúva, 2468, Centro, Florianópolis - SC');
});
