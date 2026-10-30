const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),vm=require('vm');
const ctx={window:{},console};ctx.globalThis=ctx;vm.createContext(ctx);
vm.runInContext(fs.readFileSync('assets/app-core.js','utf8'),ctx);
const C=ctx.window.ChefCore||ctx.ChefCore||ctx.window.C;
const V=require('../assets/order-validation.js');
test('agenda: limpeza e disponibilidade',()=>{
  assert.equal(JSON.stringify(C.cleanAgenda({off:['2026-12-18','x','2026-12-18','2026-12-01']})),'{"off":["2026-12-01","2026-12-18"]}');
  assert.equal(C.cleanAgenda({off:[]}),null);
  const c={agenda:{off:['2026-12-18']}};
  assert.equal(C.isFree(c,'2026-12-18'),false);assert.equal(C.isFree(c,'2026-12-19'),true);assert.equal(C.isFree({},'2026-12-18'),true);assert.equal(C.isFree(c,''),true);
});
test('pedido em data ocupada é recusado',()=>{
  const chef={dishes:[{id:'1'}],agenda:{off:['2099-12-18']}};
  const o={adults:2,kids:0,dishes:['1'],chips:[],mode:'evento',f:{name:'Ana Souza',phone:'48999998888',date:'2099-12-18'}};
  assert.match(V.validateOrder(o,new Date(2026,0,1),chef)||'', /não atende na data/);
  o.f.date='2099-12-19';assert.ok(!/não atende/.test(V.validateOrder(o,new Date(2026,0,1),chef)||''));
});
