const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../assets/app-core.js');
const {validateOrder}=require('../assets/order-validation.js');
const now=new Date(2026,9,30,10);
const cfg={price:30,min:10,freq:['semanal','quinzenal','mensal'],modes:['entrega','casa']};
const chef={id:'c1',name:'Chef Teste',marmita:cfg,dishes:[{id:1,name:'Feijoada light',price:34,marmita:true},{id:2,name:'Risoto',price:80}]};
const base=(m={},f={})=>({mode:'marmita',f:{name:'Ana',phone:'(48) 99999-9999',...f},dishes:[1],adults:2,kids:1,shop:false,clean:true,chips:['Sem lactose'],m:{freq:'semanal',qty:10,months:2,way:'entrega',days:['seg','qua'],...m}});

test('configuração de marmita válida é normalizada; inválida é descartada',()=>{
  assert.deepEqual(C.cleanMarmita({price:'32.5',min:'8.9',freq:['semanal','x','semanal'],modes:['casa','nada']}),{price:32.5,min:8,freq:['semanal'],modes:['casa']});
  for(const m of [null,{},{price:0,min:5,freq:['semanal'],modes:['casa']},{price:30,min:0,freq:['semanal'],modes:['casa']},{price:30,min:5,freq:[],modes:['casa']},{price:30,min:5,freq:['semanal'],modes:[]},{price:2000,min:5,freq:['semanal'],modes:['casa']}])assert.equal(C.cleanMarmita(m),null);
});
test('formulário do chef rejeita preço, mínimo, frequência e atendimento vazios',()=>{
  assert.equal(C.validateMarmita(cfg),'');
  for(const m of [{...cfg,price:NaN},{...cfg,price:0},{...cfg,min:0},{...cfg,min:2.5},{...cfg,freq:[]},{...cfg,modes:[]}])assert.ok(C.validateMarmita(m));
});
test('estimativa considera 4 semanas por mês e não vira preço final',()=>{
  let e=C.marmitaEstimate({freq:'semanal',qty:10,months:2},chef);
  assert.equal(e.monthly,1200);assert.equal(e.total,2400);assert.equal(e.units,80);assert.equal(e.deliveries,4);
  assert.equal(C.marmitaEstimate({freq:'quinzenal',qty:20,months:1},chef).monthly,1200);
  assert.equal(C.marmitaEstimate({freq:'mensal',qty:40,months:3},chef).total,3600);
  assert.equal(C.marmitaEstimate({freq:'semanal',qty:0,months:1},chef),null);
  assert.equal(C.marmitaEstimate({freq:'diaria',qty:5,months:1},chef),null);
  assert.equal(C.marmitaEstimate({freq:'semanal',qty:5,months:1},{}),null);
});
test('pedido de marmita exige plano completo e respeita o que o chef oferece',()=>{
  assert.equal(validateOrder(base(),now,chef),'');
  assert.match(validateOrder(base({qty:9}),now,chef),/a partir de 10/);
  assert.match(validateOrder(base({qty:10.5}),now,chef),/quantas marmitas/);
  assert.match(validateOrder(base({freq:'diaria'}),now,chef),/frequência/);
  assert.match(validateOrder(base({months:0}),now,chef),/duração/);
  assert.match(validateOrder(base({way:'drone'}),now,chef),/forma de atendimento/);
  assert.match(validateOrder(base({days:[]}),now,chef),/dia da semana/);
  assert.match(validateOrder({...base(),dishes:[]},now,chef),/prato/);
  assert.match(validateOrder(base(),now,{...chef,marmita:undefined}),/não oferece marmitas/);
  assert.match(validateOrder(base({freq:'mensal'}),now,{...chef,marmita:{...cfg,freq:['semanal']}}),/frequência/);
  assert.equal(validateOrder({...base(),mode:'evento'},now,chef),'');
});
test('texto do WhatsApp descreve o plano e deixa valores para confirmar',()=>{
  const t=C.buildOrderText(chef,base({},{date:'2026-11-09',local:'Centro, Florianópolis'}));
  for(const part of ['Plano de marmitas','Cliente: Ana','Início desejado: 09/11/2026','Frequência: Semanal','Marmitas por entrega: 10','Duração do plano: 2 meses','Entrega das marmitas prontas','Seg, Qua','Sem lactose','Feijoada light','por mês','a confirmar','Limpeza ao final'])assert.ok(t.includes(part),part);
  assert.ok(!t.includes('Risoto'));assert.ok(!t.includes('Enviado'));assert.ok(!t.includes('Convidados'));
  const ev=C.buildOrderText(chef,{...base(),mode:'evento',f:{name:'Ana',phone:'1',type:'Celebração'}});
  assert.ok(ev.includes('Convidados')&&!ev.includes('Plano de marmitas'));
});
test('normalizeData mantém marmita válida e remove marcas inválidas',()=>{
  const d=C.normalizeData({chefs:[{id:'a',name:'A',marmita:cfg,dishes:[{id:1,name:'x',price:1,marmita:true},{id:2,name:'y',price:1,marmita:'sim'}]},{id:'b',name:'B',marmita:{price:-1},dishes:[]}]},[]);
  assert.deepEqual(d.chefs[0].marmita,cfg);assert.equal(d.chefs[0].dishes[0].marmita,true);assert.ok(!('marmita' in d.chefs[0].dishes[1]));assert.ok(!('marmita' in d.chefs[1]));
});
test('perfis de exemplo vêm sempre do código e nunca são gravados',()=>{
  const real={id:'chef-1',name:'Chef real',isDemo:false,dishes:[],gallery:[]};
  const velho={id:'c7',name:'Cópia velha',isDemo:true,dishes:[],gallery:[]};
  const work={id:'demo-workspace',name:'Estúdio',isDemo:true,dishes:[],gallery:[]};
  const demo=[{id:'demo-01',name:'Chef Exemplo',dishes:[{id:1,name:'Prato',price:10}],gallery:[]}];
  const d=C.withDemo({chefs:[velho,real,work],messages:[],orders:[],name:'',visitorId:'v',draft:null},demo);
  assert.deepEqual(d.chefs.map(c=>c.id),['chef-1','demo-workspace','demo-01']);
  assert.equal(d.chefs.at(-1).isDemo,true);assert.equal(d.visitorId,'v');
  assert.deepEqual(C.stripDemo(d).chefs.map(c=>c.id),['chef-1','demo-workspace']);
  assert.deepEqual(C.withDemo(d,[]).chefs.map(c=>c.id),['chef-1','demo-workspace']);
  assert.deepEqual(C.withDemo({chefs:[]},undefined).chefs,[]);
});
