const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const M=require('../assets/mural-core.js');
const base={tipo:'Jantar',cidade:'Florianópolis',data:M.somaDias(M.hoje(),10),pessoas:6,detalhes:'Jantar de aniversário com entrada, principal e sobremesa.',whatsapp:'(48) 99110-6355',nome:'Maria Silva'};

test('regras: valida o pedido, esconde o contato e casa a cidade sem acento',()=>{
 const p=M.limpar(base);
 assert.equal(p.whatsapp,'5548991106355');assert.equal(p.cidadeSlug,'florianopolis');
 assert.throws(()=>M.limpar({...base,data:'2020-01-01'}),/data/);assert.throws(()=>M.limpar({...base,pessoas:0}),/pessoas/);
 assert.throws(()=>M.limpar({...base,whatsapp:'123'}),/WhatsApp/);assert.throws(()=>M.limpar({...base,tipo:'Festa rave'}),/tipo/);
 assert.equal(M.limpar({...base,semData:true,data:''}).data,'');
 const s=M.semContato(p);assert.equal(s.whatsapp,undefined);assert.equal(s.nome,'Maria');
 assert.ok(M.atende({cities:'Florianopolis, São José e Palhoça'},'Florianópolis'));assert.ok(!M.atende({cities:'Joinville'},'Florianópolis'));
 assert.equal(M.expira({data:''},'2026-11-27T10:00:00Z'),'2026-12-27');
});

let DatabaseSync;try{({DatabaseSync}=require('node:sqlite'))}catch{test('mural na API requer SQLite do Node 22.13+',{skip:true},()=>{});return;}
const db=new DatabaseSync(':memory:');for(const f of ['0001_piloto.sql','0002_google.sql','0003_admin.sql'])db.exec(fs.readFileSync(path.join(__dirname,'../migrations',f),'utf8'));
const DB={prepare(sql){let a=[];return {bind(...x){a=x;return this},async first(){return db.prepare(sql).get(...a)||null},async all(){return{results:db.prepare(sql).all(...a)}},async run(){return{meta:{changes:Number(db.prepare(sql).run(...a).changes)}}}}},async batch(l){for(const s of l)await s.run()}};
const contas={cliente:{tipo:'cliente',name:'Maria Silva',whatsapp:''},cliente2:{tipo:'cliente',name:'João',whatsapp:''},joinville:{cities:'Joinville'},incompleto:{cities:'Florianópolis',dishes:[]}};
for(const n of [1,2,3,4,5])contas['chef'+n]={cities:'Florianópolis, São José'};
let api;const tk=n=>n.padEnd(64,'0').replace(/[^a-f\d]/g,'a').slice(0,64);
test.before(async()=>{api=await import('../functions/api/[[rota]].js');
 for(const [n,extra] of Object.entries(contas)){const p={name:'Chef '+n,whatsapp:'48991106355',avatar:'/x.jpg',gallery:[],dishes:[{id:'d',name:'Risoto',price:50}],...extra};
  db.prepare('INSERT INTO chefs(id,email,credencial,perfil,criado_em,atualizado_em) VALUES(?,?,?,?,?,?)').run('id-'+n,n+'@example.com','{}',JSON.stringify(p),'2026-01-01','v1');
  const hash=Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(tk(n)))).toString('hex');db.prepare('INSERT INTO sessoes VALUES(?,?,?)').run(hash,'id-'+n,'2099-01-01')}});
const req=(conta,rota,metodo='GET',body)=>api.onRequest({request:new Request('https://example.com/api/'+rota,{method:metodo,headers:{'content-type':'application/json',...(conta?{cookie:'scc_sessao='+tk(conta)}:{}),'cf-connecting-ip':conta||'x'},body:body?JSON.stringify(body):undefined}),env:{DB},params:{rota:rota.split('/')}});

test('mural: cliente publica, chefs da cidade veem sem contato, só 4 liberam e o cliente vê quem foi',async()=>{
 assert.equal((await req(null,'mural','POST',base)).status,401);
 const r=await req('cliente','mural','POST',base);assert.equal(r.status,201);const {id,chefsAvisados}=await r.json();
 assert.equal(chefsAvisados,5,'avisa só chefs completos de Florianópolis');
 assert.ok(db.prepare("SELECT COUNT(*) n FROM notificacoes WHERE tipo='mural'").get().n>=5);
 const v=await(await req('chef1','mural')).json();assert.equal(v.pedidos.length,1);assert.equal(v.pedidos[0].whatsapp,undefined);assert.equal(v.pedidos[0].nome,'Maria');
 assert.equal((await(await req('joinville','mural')).json()).pedidos.length,0,'outra cidade não vê');
 assert.equal((await req('cliente','mural')).status,403,'cliente não abre o mural dos chefs');
 assert.equal((await req('incompleto','mural/'+id+'/liberar','POST',{})).status,403,'perfil incompleto não libera');
 assert.equal((await req('joinville','mural/'+id+'/liberar','POST',{})).status,403,'cidade que não atende');
 for(const n of [1,2,3,4]){const l=await req('chef'+n,'mural/'+id+'/liberar','POST',{});assert.equal(l.status,200);const j=await l.json();assert.equal(j.ordem,n);assert.equal(j.contato.whatsapp,'5548991106355');assert.match(j.mensagem,/Olá, Maria/)}
 assert.equal((await req('chef1','mural/'+id+'/liberar','POST',{})).status,200,'liberar de novo devolve o mesmo contato');
 assert.equal((await req('chef5','mural/'+id+'/liberar','POST',{})).status,409,'quinto chef fica de fora');
 assert.equal((await(await req('chef5','mural')).json()).pedidos.length,0,'pedido completo some para quem não liberou');
 const meus=await(await req('cliente','mural/meus')).json();assert.equal(meus.pedidos[0].status,'completo');assert.deepEqual(meus.pedidos[0].chefs.map(c=>c.ordem),[1,2,3,4]);
 assert.ok(db.prepare("SELECT COUNT(*) n FROM notificacoes WHERE conta_id='id-cliente' AND tipo='mural'").get().n===4);
});

test('mural: limite de pedidos abertos, fechar, denúncia e validação',async()=>{
 const bad=await req('cliente2','mural','POST',{...base,pessoas:0});assert.equal(bad.status,400);assert.equal((await bad.json()).campo,'pessoas');
 const a=await(await req('cliente2','mural','POST',base)).json(),b=await(await req('cliente2','mural','POST',{...base,tipo:'Churrasco'})).json();
 assert.equal((await req('cliente2','mural','POST',base)).status,409,'máximo de 2 abertos');
 assert.equal((await req('cliente','mural/meus/'+a.id+'/fechar','POST',{})).status,404,'não fecha pedido de outra pessoa');
 assert.equal((await req('cliente2','mural/meus/'+a.id+'/fechar','POST',{})).status,200);
 assert.equal((await req('cliente2','mural','POST',base)).status,201,'fechou um, pode publicar outro');
 await req('chef1','mural/'+b.id+'/denunciar','POST',{});assert.ok(!(await(await req('chef1','mural')).json()).pedidos.some(p=>p.id===b.id),'quem denunciou não vê mais');
 await req('chef2','mural/'+b.id+'/denunciar','POST',{});assert.equal(db.prepare('SELECT status FROM mural_pedidos WHERE id=?').get(b.id).status,'oculto');
 assert.equal((await req('chef3','mural/'+b.id+'/liberar','POST',{})).status,410,'pedido oculto não libera');
});

test('mural: excluir a conta apaga pedidos e liberações dela',async()=>{
 assert.equal((await req('cliente2','eu','DELETE')).status,200);
 assert.equal(db.prepare("SELECT COUNT(*) n FROM mural_pedidos WHERE conta_id='id-cliente2'").get().n,0);
});
test('mural: painel da equipe é só para a equipe',async()=>{
 assert.equal((await req('chef1','mural/admin')).status,403);assert.equal((await req('cliente','mural/admin/'+'a'.repeat(24)+'/remover','POST',{})).status,403);
});
