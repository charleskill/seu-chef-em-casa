const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),vm=require('vm');
const ctx={window:{},console};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync('assets/app-core.js','utf8'),ctx);
const C=ctx.window.ChefCore||ctx.ChefCore||ctx.window.C;const V=require('../assets/order-validation.js');
const chef={marmita:{price:30,min:10,freq:['semanal'],modes:['casa']},dishes:[{id:'a',marmita:true},{id:'b',marmita:true},{id:'c'}]};
const ord=mix=>({mode:'marmita',adults:2,kids:0,dishes:Object.keys(mix),chips:[],f:{name:'Ana Souza',phone:'48999998888'},m:{freq:'semanal',qty:Object.values(mix).reduce((a,b)=>a+b,0),months:1,way:'casa',days:['seg'],mix}});
test('kits: limpeza',()=>{
  assert.equal(JSON.stringify(C.cleanKits([{id:'k',name:' Leve ',items:{a:5,b:'5',x:0}},{name:'',items:{a:1}},{name:'Vazio',items:{}}])),'[{"id":"k","name":"Leve","items":{"a":5,"b":5}}]');
  const m=C.cleanMarmita({price:30,min:10,freq:['semanal'],modes:['casa'],kits:[{id:'k',name:'Leve',items:{a:10}}]});assert.equal(m.kits.length,1);
  assert.equal(C.cleanMarmita({price:30,min:10,freq:['semanal'],modes:['casa']}).kits,undefined);
});
test('pedido com composição',()=>{
  assert.equal(V.validateOrder(ord({a:5,b:5}),new Date(2026,0,1),chef),'');
  assert.match(V.validateOrder(ord({a:3,b:3}),new Date(2026,0,1),chef),/mínimo|a partir de 10/);
  assert.match(V.validateOrder(ord({c:10}),new Date(2026,0,1),chef),/não oferece/);
  const o=ord({a:5,b:5});o.m.qty=12;assert.match(V.validateOrder(o,new Date(2026,0,1),chef),/soma/);
});
test('texto do pedido lista as quantidades',()=>{
  const c={...chef,name:'Chef X',dishes:[{id:'a',name:'Frango',marmita:true,price:0,category:'x'},{id:'b',name:'Peixe',marmita:true,price:0,category:'x'}]};
  const t=C.buildOrderText(c,ord({a:5,b:5}));assert.match(t,/5x Frango/);assert.match(t,/Marmitas escolhidas por entrega/);
});
