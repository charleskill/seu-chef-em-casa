const test=require('node:test'),assert=require('node:assert');
const P=require('../assets/pratos.js');
const CATEGORIAS=['Entradas','Pratos Principais','Sobremesas','Massas','Frutos do mar','Bebidas & drinks'];
test('catálogo de pratos: mais de mil nomes, sem repetição e com categoria do formulário',()=>{
  assert.ok(P.lista.length>1000,'esperava mais de 1000 pratos, veio '+P.lista.length);
  assert.equal(new Set(P.lista.map(p=>p.chave)).size,P.lista.length);
  for(const p of P.lista){assert.ok(CATEGORIAS.includes(p.categoria),p.nome);assert.ok(p.nome&&p.nome.length<=100,p.nome);assert.ok(p.cozinha,p.nome);assert.ok(!/[<>|`]/.test(p.nome),p.nome)}
  assert.deepEqual(P.categorias,CATEGORIAS);
});
test('busca de pratos: ignora acentos e maiúsculas, limita e prioriza o começo do nome',()=>{
  assert.deepEqual(P.buscar('a'),[]);
  assert.equal(P.buscar('MOQUECA BAIANA')[0].nome,'Moqueca baiana');
  assert.equal(P.buscar('tiramisu')[0].nome,'Tiramisù');
  assert.ok(P.buscar('risoto').length===8);
  assert.ok(P.buscar('risoto',3).length===3);
  assert.ok(P.buscar('risoto').every(p=>p.chave.includes('risoto')));
  assert.ok(P.buscar('camarao moranga').some(p=>p.nome==='Camarão na moranga'));
  assert.ok(P.buscar('feij')[0].chave.startsWith('feij'));
  assert.deepEqual(P.buscar('zzzzqq'),[]);
});
