// Painel completo: pedidos, clientes, comentários, resumo e registro de atividades. Dados fictícios.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
let DatabaseSync;try{({DatabaseSync}=require('node:sqlite'))}catch{test('integração SQLite da API requer Node 22.13+',{skip:true},()=>{});return;}
const db=new DatabaseSync(':memory:');
for(const name of ['0001_piloto.sql','0002_google.sql','0003_admin.sql'])db.exec(fs.readFileSync(path.join(__dirname,'../migrations',name),'utf8'));
const DB={prepare(sql){let args=[];return {bind(...v){args=v;return this},async first(){return db.prepare(sql).get(...args)||null},async all(){return {results:db.prepare(sql).all(...args)}},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}}}}},async batch(list){for(const s of list)await s.run();return []}};
const env={DB};
const ids={admin:'chef-aaaaaaaaaaaaaaaa',chef:'chef-bbbbbbbbbbbbbbbb',cliente:'chef-cccccccccccccccc'};
const tokens={admin:'d'.repeat(64),chef:'e'.repeat(64),cliente:'f'.repeat(64)};
const digest=async t=>Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t))).toString('hex');
let api;
async function req(route,method='GET',body,role){const headers={'content-type':'application/json'};if(role)headers.cookie='scc_sessao='+tokens[role];const request=new Request('https://example.com/api/'+route,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});return api.onRequest({request,env,params:{rota:new URL(request.url).pathname.slice(5).split('/')}})}
test.before(async()=>{
 api=await import('../functions/api/[[rota]].js');
 const base={whatsapp:'(48) 99110-6355',cities:'Florianópolis',bio:'Teste',avatar:'',dishes:[]};
 const perfis={admin:{...base,name:'Equipe Teste'},chef:{...base,name:'Chef Teste',gallery:[{id:'g1',url:'/assets/x.webp',caption:'Risoto'}]},cliente:{...base,name:'Cliente Teste',tipo:'cliente',gallery:[]}};
 for(const [role,id] of Object.entries(ids)){
  db.prepare('INSERT INTO chefs (id,email,credencial,perfil,criado_em,atualizado_em) VALUES (?,?,?,?,?,?)').run(id,role==='admin'?'carlosmendes.ricci@gmail.com':role+'@example.com','{}',JSON.stringify(perfis[role]),'2026-11-20T10:00:00Z','v1');
  db.prepare('INSERT INTO sessoes VALUES (?,?,?)').run(await digest(tokens[role]),id,'2099-01-01T00:00:00Z');
 }
 db.prepare('INSERT INTO pedidos VALUES (?,?,?,?,?)').run('ped-1',ids.chef,'Cliente: Maria Teste\nTelefone: (48) 99110-6355\nData: 10/12/2026','{}','2026-11-25T12:00:00Z');
 db.prepare('INSERT INTO pedidos VALUES (?,?,?,?,?)').run('ped-2',ids.chef,'Pedido de marmitas fictício',JSON.stringify({mode:'marmita',status:'fechado',cliente:'João Teste'}),'2026-11-26T12:00:00Z');
});

test('rotas novas do painel recusam anônimo (401) e conta comum (403)',async()=>{
 for(const [route,method] of [['admin/resumo','GET'],['admin/pedidos','GET'],['admin/pedidos/ped-1','PATCH'],['admin/pedidos/ped-1','DELETE'],['admin/clientes','GET'],['admin/comentarios','GET'],['admin/comentarios/x','DELETE'],['admin/atividades','GET']]){
  const body=method==='PATCH'?{status:'fechado'}:undefined;
  assert.equal((await req(route,method,body)).status,401,route);
  assert.equal((await req(route,method,body,'chef')).status,403,route);
  assert.equal((await req(route,method,body,'cliente')).status,403,route);
 }
 assert.equal(db.prepare('SELECT COUNT(*) n FROM pedidos').get().n,2);
});

test('pedidos: lista com cliente e chef, muda situação, rejeita situação inválida e registra',async()=>{
 const j=await (await req('admin/pedidos','GET',undefined,'admin')).json();
 assert.deepEqual(j.pedidos.map(p=>p.id),['ped-2','ped-1']);
 assert.equal(j.pedidos[1].cliente,'Maria Teste');assert.equal(j.pedidos[1].status,'novo');assert.equal(j.pedidos[1].chef,'Chef Teste');
 assert.equal(j.pedidos[0].cliente,'João Teste');assert.equal(j.pedidos[0].modo,'marmita');assert.equal(j.pedidos[0].status,'fechado');
 assert.equal((await req('admin/pedidos/ped-1','PATCH',{status:'pago'},'admin')).status,400);
 assert.equal((await req('admin/pedidos/nao-existe','PATCH',{status:'fechado'},'admin')).status,404);
 assert.equal((await req('admin/pedidos/ped-1','PATCH',{status:'respondido'},'admin')).status,200);
 assert.equal(JSON.parse(db.prepare('SELECT dados FROM pedidos WHERE id=?').get('ped-1').dados).status,'respondido');
 const log=db.prepare("SELECT * FROM atividades WHERE acao='Mudou situação do pedido'").get();
 assert.equal(log.conta_nome,'Equipe Teste');assert.equal(log.detalhe,'respondido');assert.ok(!log.alvo.includes('Maria'),'registro não guarda dados do cliente');
});

test('resumo conta pedidos novos, chefs, clientes e comentários da semana',async()=>{
 db.prepare('INSERT INTO pedidos VALUES (?,?,?,?,?)').run('ped-3',ids.chef,'Cliente: Ana Teste',"{}",new Date().toISOString());
 const r=await (await req('admin/resumo','GET',undefined,'admin')).json();
 assert.equal(r.pedidosNovos,1);assert.equal(r.clientes,1);assert.equal(r.chefs,2);assert.equal(r.comentariosSemana,0);
 assert.ok(Array.isArray(r.atividades));
});

test('clientes: lista só contas de cliente, com atividade',async()=>{
 db.prepare('INSERT INTO seguidores VALUES (?,?,?)').run(ids.chef,ids.cliente,'2026-11-27T10:00:00Z');
 const j=await (await req('admin/clientes','GET',undefined,'admin')).json();
 assert.equal(j.clientes.length,1);const c=j.clientes[0];
 assert.equal(c.nome,'Cliente Teste');assert.equal(c.email,'cliente@example.com');assert.equal(c.seguindo,1);assert.equal(c.credencial,undefined);
});

test('comentários: lista com autor, chef e foto; apagar registra e some da lista',async()=>{
 db.prepare('INSERT INTO comentarios VALUES (?,?,?,?,?,?)').run('com-1',ids.chef,'g1',ids.cliente,'Que prato lindo','2026-11-27T11:00:00Z');
 let j=await (await req('admin/comentarios','GET',undefined,'admin')).json();
 assert.equal(j.comentarios.length,1);const m=j.comentarios[0];
 assert.equal(m.autor,'Cliente Teste');assert.equal(m.chef,'Chef Teste');assert.equal(m.foto,'/assets/x.webp');assert.equal(m.legenda,'Risoto');
 assert.equal((await req('admin/comentarios/nao-existe','DELETE',undefined,'admin')).status,404);
 assert.equal((await req('admin/comentarios/com-1','DELETE',undefined,'admin')).status,200);
 j=await (await req('admin/comentarios','GET',undefined,'admin')).json();assert.equal(j.comentarios.length,0);
 assert.ok(db.prepare("SELECT 1 FROM atividades WHERE acao='Apagou comentário' AND alvo='De Cliente Teste'").get());
});

test('registro de atividades: ações antigas do painel também entram, sem guardar o link de senha',async()=>{
 const link=await (await req('admin/chefs/'+ids.cliente,'POST',{acao:'nova-senha'},'admin')).json();
 assert.equal((await req('admin/chefs/'+ids.chef,'POST',{oculto:true},'admin')).status,200);
 assert.equal((await req('admin/pedidos/ped-2','DELETE',undefined,'admin')).status,200);
 const j=await (await req('admin/atividades','GET',undefined,'admin')).json();
 const acoes=j.atividades.map(a=>a.acao);
 for(const a of ['Gerou link de nova senha','Escondeu perfil','Excluiu pedido','Apagou comentário','Mudou situação do pedido'])assert.ok(acoes.includes(a),a);
 const token=link.link.split('/').pop();assert.ok(!JSON.stringify(j).includes(token),'o link de senha nunca vai para o registro');
 assert.ok(j.atividades[0].criado_em>=j.atividades[j.atividades.length-1].criado_em,'mais recentes primeiro');
});
