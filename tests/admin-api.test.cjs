const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
let DatabaseSync;try{({DatabaseSync}=require('node:sqlite'))}catch{test('integração SQLite da API requer Node 22.13+', {skip:true},()=>{});return;}
const Site=require('../assets/site-settings.js');
const db=new DatabaseSync(':memory:');
for(const name of ['0001_piloto.sql','0002_google.sql','0003_admin.sql'])db.exec(fs.readFileSync(path.join(__dirname,'../migrations',name),'utf8'));
// Adaptador D1 com SQLite real: SQL e relações são exercitados sem serviços externos.
const DB={prepare(sql){let args=[];return {bind(...v){args=v;return this},async first(){return db.prepare(sql).get(...args)||null},async all(){return {results:db.prepare(sql).all(...args)}},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}}}}},async batch(statements){db.exec('BEGIN');try{const r=[];for(const s of statements)r.push(await s.run());db.exec('COMMIT');return r}catch(e){db.exec('ROLLBACK');throw e}}};
const ids={admin:'chef-1111111111111111',chef:'chef-2222222222222222',other:'chef-3333333333333333'};
const tokens={admin:'a'.repeat(64),chef:'b'.repeat(64)};
// A lista antiga pode continuar configurada; ela não deve autorizar outros e-mails.
const env={DB,ADMIN_EMAILS:'chef@example.com;other@example.com;fer-teste@example.com'};
const digest=async t=>Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t))).toString('hex');
let api;
test.before(async()=>{
 api=await import('../functions/api/[[rota]].js');
 for(const [role,id] of Object.entries(ids)){
  const perfil={name:role,whatsapp:'(48) 99110-6355',cities:'Florianópolis',bio:'Original',avatar:'',gallery:[],dishes:[{id:'d1',name:'Risoto',price:50,category:'Pratos Principais'}]};
  db.prepare('INSERT INTO chefs (id,email,credencial,perfil,criado_em,atualizado_em) VALUES (?,?,?,?,?,?)').run(id,role==='admin'?'carlosmendes.ricci@gmail.com':role+'@example.com','{}',JSON.stringify(perfil),'2026-11-15T10:00:00Z','v1');
 }
 for(const [role,token] of Object.entries(tokens))db.prepare('INSERT INTO sessoes VALUES (?,?,?)').run(await digest(token),ids[role],'2099-01-01T00:00:00Z');
});
async function req(route,method='GET',body,role){const headers={'content-type':'application/json'};if(role)headers.cookie='scc_sessao='+tokens[role];const request=new Request('https://example.com/api/'+route,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});return api.onRequest({request,env,params:{rota:new URL(request.url).pathname.slice(5).split('/')}})}
test('configuração pública usa padrões e não expõe dados internos',async()=>{const r=await req('site');assert.equal(r.status,200);const j=await r.json();assert.deepEqual(j.config,Site.defaults);assert.equal(JSON.stringify(j).includes('admin@example'),false)});
test('todas as rotas administrativas recusam anônimo e chef comum, mesmo listado em ADMIN_EMAILS',async()=>{for(const [route,method] of [['admin/dashboard','GET'],['admin/site','GET'],['admin/site','PUT'],['admin/chefs','GET'],['admin/chefs/'+ids.other,'GET'],['admin/chefs/'+ids.other,'PUT'],['admin/chefs/'+ids.other,'POST'],['admin/chefs/'+ids.other,'DELETE']]){const body=['PUT','POST'].includes(method)?{}:undefined;assert.equal((await req(route,method,body)).status,401);assert.equal((await req(route,method,body,'chef')).status,403)}});

test('a sessão só informa admin para Carlos; autorização não depende da lista legada',async()=>{const owner=await (await req('eu','GET',undefined,'admin')).json();const regular=await (await req('eu','GET',undefined,'chef')).json();assert.equal(owner.chef.admin,true);assert.equal(owner.chef.email,'carlosmendes.ricci@gmail.com');assert.equal(regular.chef.admin,false);});
test('administrador salva conteúdo, persiste na rota pública e rejeita versão antiga',async()=>{let r=await req('admin/site','PUT',{config:{...Site.defaults,heroTitle:'Jantar em casa',contactEmail:'contato@example.com'},versao:''},'admin');assert.equal(r.status,200);const saved=await r.json();assert.ok(saved.versao);assert.equal((await (await req('site')).json()).config.heroTitle,'Jantar em casa');assert.equal((await req('admin/site','PUT',{config:Site.defaults,versao:''},'admin')).status,409)});
test('configuração rejeita URLs perigosas, campos inválidos e descarta chaves extras',()=>{for(const heroImage of ['javascript:alert(1)','https://evil.example/image.jpg','https://images.unsplash.com@evil.example/x'])assert.throws(()=>Site.clean({...Site.defaults,heroImage}));assert.throws(()=>Site.clean({contactEmail:'errado'}));assert.throws(()=>Site.clean({heroTitle:''}));assert.throws(()=>Site.clean({supportWhatsapp:'123'}));assert.equal(Site.clean({admin:true}).admin,undefined)});
test('editar conteúdo da própria conta administrativa preserva o papel da equipe',async()=>{const id=ids.admin;const r=await (await req('admin/chefs/'+id,'GET',undefined,'admin')).json();assert.equal(r.chef.admin,true);const saved=await req('admin/chefs/'+id,'PUT',{versao:r.versao,perfil:{...r.chef,bio:'Apresentação revisada'}},'admin');assert.equal(saved.status,200);assert.equal((await saved.json()).chef.admin,true)});
test('editor de chef preserva acesso e não aceita fotos de outra conta',async()=>{
 const id=ids.other;const before=await (await req('admin/chefs/'+id,'GET',undefined,'admin')).json();assert.equal(before.chef.email,'other@example.com');assert.equal(before.chef.credencial,undefined);
 db.prepare('INSERT INTO fotos VALUES (?,?,?,?,?)').run('f'.repeat(32),ids.chef,'image/jpeg',new Uint8Array([255,216,255]),'agora');
 const r=await req('admin/chefs/'+id,'PUT',{versao:'v1',perfil:{...before.chef,name:'Chef revisado',email:'admin@example.com',admin:true,pausado:true,avatar:'/api/foto/'+'f'.repeat(32),dishes:[{id:'d1',name:'Moqueca',price:80}]}},'admin');assert.equal(r.status,200);
 const saved=await r.json();assert.equal(saved.chef.name,'Chef revisado');assert.equal(saved.chef.email,'other@example.com');assert.equal(saved.chef.admin,false);assert.equal(saved.chef.pausado,false);assert.equal(saved.chef.avatar,'');assert.equal(saved.chef.dishes[0].name,'Moqueca');assert.equal((await req('admin/chefs/'+id,'PUT',{versao:'v1',perfil:before.chef},'admin')).status,409);
});
test('editar perfil preserva fotos locais existentes sem aceitar arquivos de outro perfil',async()=>{
 const id=ids.other,row=db.prepare('SELECT perfil FROM chefs WHERE id=?').get(id),original=JSON.parse(row.perfil);
 const avatar='/assets/apresentacao/helena-retrato.webp',own='/assets/apresentacao/helena-1.webp';
 db.prepare('UPDATE chefs SET perfil=? WHERE id=?').run(JSON.stringify({...original,avatar,gallery:[{id:'g1',url:own,caption:'Mesa'}]}),id);
 const before=await (await req('admin/chefs/'+id,'GET',undefined,'admin')).json();
 const r=await req('admin/chefs/'+id,'PUT',{versao:before.versao,perfil:{...before.chef,gallery:[...before.chef.gallery,{id:'g2',url:'/assets/apresentacao/rafael-1.webp',caption:'Outra'}]}},'admin');
 assert.equal(r.status,200);const saved=(await r.json()).chef;assert.equal(saved.avatar,avatar);assert.deepEqual(saved.gallery.map(g=>g.url),[own]);
 db.prepare('UPDATE chefs SET perfil=? WHERE id=?').run(row.perfil,id);
});

test('dashboard agrega dados reais por período, respeita meia-noite e não retorna dados pessoais',async()=>{
 const rows=[['dash-a',ids.chef,'2026-11-10T03:00:00.000Z',{}],['dash-b',ids.other,'2026-11-12T02:59:59.000Z',{mode:'marmita',status:'respondido'}],['dash-prev',ids.chef,'2026-11-10T02:59:59.000Z',{status:'fechado'}],['dash-next',ids.chef,'2026-11-12T03:00:00.000Z',{}]];
 for(const [id,chef,date,data] of rows)db.prepare('INSERT INTO pedidos VALUES (?,?,?,?,?)').run(id,chef,'Cliente: Nome privado; telefone privado',JSON.stringify(data),date);
 const r=await req('admin/dashboard?inicio=2026-11-10&fim=2026-11-11','GET',undefined,'admin');assert.equal(r.status,200);const j=await r.json();assert.equal(j.pedidos.total,2);assert.equal(j.pedidos.anterior,1);assert.equal(j.pedidos.variacao,100);assert.equal(j.pedidos.novos,1);assert.equal(j.pedidos.respondidos,1);assert.equal(j.pedidos.marmitas,1);assert.equal(j.pedidos.chefs,2);assert.deepEqual(j.pedidos.serie,[{dia:'2026-11-10',total:1},{dia:'2026-11-11',total:1}]);assert.equal(j.cadastros.total,0);assert.equal(j.chefs.cadastrados,3);assert.equal(j.ranking.length,2);assert.equal(JSON.stringify(j).includes('privado'),false);assert.equal(JSON.stringify(j).includes('@example.com'),false);
});
test('dashboard rejeita período inválido e retorna zeros em período vazio',async()=>{assert.equal((await req('admin/dashboard?inicio=2026-02-29&fim=2026-03-01','GET',undefined,'admin')).status,400);const r=await req('admin/dashboard?inicio=2020-01-01&fim=2020-01-01','GET',undefined,'admin');assert.equal(r.status,200);const j=await r.json();assert.equal(j.pedidos.total,0);assert.equal(j.pedidos.serie[0].total,0);assert.equal(j.pedidos.variacao,null);assert.deepEqual(j.ranking,[]);});
test('exclusão própria exige sessão e apaga conta, fotos, pedidos e sessões',async()=>{const id=ids.chef;db.prepare('INSERT INTO pedidos VALUES (?,?,?,?,?)').run('p1',id,'Pedido fictício','{}','agora');assert.equal((await req('eu','DELETE')).status,401);assert.equal((await req('eu','DELETE',undefined,'chef')).status,200);for(const table of ['fotos','pedidos','sessoes'])assert.equal(db.prepare('SELECT COUNT(*) AS n FROM '+table+' WHERE chef_id = ?').get(id).n,0);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM chefs WHERE id = ?').get(id).n,0);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM chefs WHERE id = ?').get(ids.admin).n,1)});

test('cadastro novo não ganha administração mesmo enviando admin e estando na lista antiga',async()=>{const request=new Request('https://example.com/api/cadastro',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:'fer-teste@example.com',nome:'Conta de teste',senha:'SomenteTesteLocal1234',whatsapp:'(48) 99110-6355',cidades:'Florianópolis',admin:true})});const r=await api.onRequest({request,env,params:{rota:['cadastro']}});assert.equal(r.status,201);const j=await r.json();assert.equal(j.chef.admin,false);const cookie=r.headers.get('set-cookie').split(';')[0];const denied=await api.onRequest({request:new Request('https://example.com/api/admin/chefs',{headers:{cookie}}),env,params:{rota:['admin','chefs']}});assert.equal(denied.status,403);});
test('conta de cliente sem WhatsApp é criada e não aparece na vitrine',async()=>{const call=(rota,init={})=>api.onRequest({request:new Request('https://example.com/api/'+rota,init),env,params:{rota:rota.split('/')}});const r=await call('cadastro',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({tipo:'cliente',email:'cliente-teste@example.com',nome:'Cliente Teste',senha:'SomenteTesteLocal1234'})});assert.equal(r.status,201);const j=await r.json();assert.equal(j.chef.tipo,'cliente');const lista=await (await call('chefs')).json();assert.ok(!lista.chefs.some(c=>c.id===j.chef.id));const t=await call('cadastro',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({tipo:'cliente',email:'x@yopmail.com',nome:'Temp',senha:'SomenteTesteLocal1234'})});assert.equal(t.status,400);});
test('seguir, curtir e comentar exigem conta e contam certo',async()=>{
 db.prepare("UPDATE chefs SET perfil=json_set(perfil,'$.gallery',json(?)) WHERE id=?").run(JSON.stringify([{id:'g1',url:'/assets/x.webp',caption:'Prato'}]),ids.other);
 const o=ids.other;ids.fa='chef-4444444444444444';tokens.fa='c'.repeat(64);db.prepare('INSERT INTO chefs (id,email,credencial,perfil,criado_em,atualizado_em) VALUES (?,?,?,?,?,?)').run(ids.fa,'fa@example.com','{}',JSON.stringify({name:'Fã',tipo:'cliente'}),'2026-11-24T10:00:00Z','v1');db.prepare('INSERT INTO sessoes VALUES (?,?,?)').run(await digest(tokens.fa),ids.fa,'2099-01-01T00:00:00Z');
 assert.equal((await req('social/'+o+'/seguir','POST',{on:true})).status,401);
 assert.equal((await req('social/'+o+'/seguir','POST',{on:true},'fa')).status,200);
 assert.equal((await req('social/'+ids.admin+'/seguir','POST',{on:true},'admin')).status,400);
 assert.equal((await req('social/'+o+'/curtir','POST',{foto:'g1',on:true},'fa')).status,200);
 assert.equal((await req('social/'+o+'/curtir','POST',{foto:'nao-existe',on:true},'fa')).status,404);
 assert.equal((await req('social/'+o+'/comentarios','POST',{foto:'g1',texto:'Que lindo!'},'fa')).status,201);
 const s=await (await req('social/'+o)).json();
 assert.equal(s.seguidores,1);assert.equal(s.sigo,false);assert.deepEqual(s.fotos.g1,{curtidas:1,curti:false,comentarios:1});
 const meu=await (await req('social/'+o,'GET',undefined,'fa')).json();assert.equal(meu.sigo,true);assert.equal(meu.fotos.g1.curti,true);
 const lista=await (await req('social/'+o+'/comentarios?foto=g1','GET',undefined,'admin')).json();
 assert.equal(lista.comentarios[0].nome,'Fã');assert.equal(lista.comentarios[0].podeApagar,true);
 assert.equal((await req('social/comentario/'+lista.comentarios[0].id,'DELETE',undefined,'admin')).status,200);
 assert.equal((await (await req('social/'+o)).json()).fotos.g1.comentarios,0);
});
test('avisos do sino, denúncia e moderação pela equipe',async()=>{
 const o=ids.other;
 const n=db.prepare("SELECT tipo FROM notificacoes WHERE conta_id=? ORDER BY criado_em").all(o).map(r=>r.tipo);
 assert.ok(n.includes('seguidor'));assert.ok(n.includes('comentario'));
 assert.equal((await req('notificacoes')).status,401);
 const r=await req('social/'+o+'/comentarios','POST',{foto:'g1',texto:'Comentário ruim'},'fa');assert.equal(r.status,201);const {id}=await r.json();
 assert.equal((await req('social/comentario/'+id+'/denunciar','POST',{})).status,401);
 assert.equal((await req('social/comentario/'+id+'/denunciar','POST',{},'admin')).status,200);
 assert.equal((await req('admin/comentarios','GET',undefined,'fa')).status,403);
 const lista=(await (await req('admin/comentarios','GET',undefined,'admin')).json()).comentarios;
 assert.equal(lista[0].id,id);assert.equal(lista[0].denuncias,1);assert.equal(lista[0].autor,'Fã');
 const meus=await (await req('notificacoes','GET',undefined,'fa')).json();assert.equal(typeof meus.naoLidas,'number');
 assert.equal((await req('notificacoes/lidas','POST',{},'fa')).status,200);
});
test('esqueci a senha: só com e-mail ativo, não revela conta e manda link pelo Resend',async()=>{
 const call=(e,body)=>api.onRequest({request:new Request('https://example.com/api/esqueci',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),env:e,params:{rota:['esqueci']}});
 assert.equal((await call(env,{email:'fa@example.com'})).status,503);
 const enviados=[],orig=globalThis.fetch;globalThis.fetch=async(u,o)=>{enviados.push({u,b:JSON.parse(o.body),h:o.headers});return new Response('{}',{status:200})};
 try{
  const e2={...env,EMAIL_REMETENTE:'Seu Chef em Casa <avisos@envio.seuchefemcasa.com.br>',RESEND_API_KEY:'re_teste'};
  const r=await call(e2,{email:'fa@example.com'});assert.equal(r.status,200);
  assert.equal(enviados.length,1);assert.equal(enviados[0].u,'https://api.resend.com/emails');assert.deepEqual(enviados[0].b.to,['fa@example.com']);
  assert.match(enviados[0].b.text,/#\/nova-senha\/chef-4444444444444444\/[a-f\d]{48}/);
  const r2=await call(e2,{email:'ninguem@example.com'});assert.equal(r2.status,200);assert.equal(enviados.length,1);
 }finally{globalThis.fetch=orig}
});
