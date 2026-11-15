const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
let DatabaseSync;try{({DatabaseSync}=require('node:sqlite'))}catch{test('integração SQLite da API requer Node 22.13+', {skip:true},()=>{});return;}
const Site=require('../assets/site-settings.js');
const db=new DatabaseSync(':memory:');
for(const name of ['0001_piloto.sql','0002_google.sql','0003_admin.sql'])db.exec(fs.readFileSync(path.join(__dirname,'../migrations',name),'utf8'));
// Adaptador D1 com SQLite real: SQL e relações são exercitados sem serviços externos.
const DB={prepare(sql){let args=[];return {bind(...v){args=v;return this},async first(){return db.prepare(sql).get(...args)||null},async all(){return {results:db.prepare(sql).all(...args)}},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}}}}},async batch(statements){db.exec('BEGIN');try{const r=[];for(const s of statements)r.push(await s.run());db.exec('COMMIT');return r}catch(e){db.exec('ROLLBACK');throw e}}};
const ids={admin:'chef-1111111111111111',chef:'chef-2222222222222222',other:'chef-3333333333333333'};
const tokens={admin:'a'.repeat(64),chef:'b'.repeat(64)};
const env={DB,ADMIN_EMAILS:'admin@example.com'};
const digest=async t=>Buffer.from(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t))).toString('hex');
let api;
test.before(async()=>{
 api=await import('../functions/api/[[rota]].js');
 for(const [role,id] of Object.entries(ids)){
  const perfil={name:role,whatsapp:'(48) 99110-6355',cities:'Florianópolis',bio:'Original',avatar:'',gallery:[],dishes:[{id:'d1',name:'Risoto',price:50,category:'Pratos Principais'}]};
  db.prepare('INSERT INTO chefs (id,email,credencial,perfil,criado_em,atualizado_em) VALUES (?,?,?,?,?,?)').run(id,role+'@example.com','{}',JSON.stringify(perfil),'2026-11-15T10:00:00Z','v1');
 }
 for(const [role,token] of Object.entries(tokens))db.prepare('INSERT INTO sessoes VALUES (?,?,?)').run(await digest(token),ids[role],'2099-01-01T00:00:00Z');
});
async function req(route,method='GET',body,role){const headers={'content-type':'application/json'};if(role)headers.cookie='scc_sessao='+tokens[role];const request=new Request('https://example.com/api/'+route,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});return api.onRequest({request,env,params:{rota:route.split('/')}})}
test('configuração pública usa padrões e não expõe dados internos',async()=>{const r=await req('site');assert.equal(r.status,200);const j=await r.json();assert.deepEqual(j.config,Site.defaults);assert.equal(JSON.stringify(j).includes('admin@example'),false)});
test('rotas administrativas recusam anônimo e chef comum',async()=>{for(const [route,method] of [['admin/site','GET'],['admin/site','PUT'],['admin/chefs/'+ids.other,'GET'],['admin/chefs/'+ids.other,'PUT']]){assert.equal((await req(route,method,method==='PUT'?{}:undefined)).status,401);assert.equal((await req(route,method,method==='PUT'?{}:undefined,'chef')).status,403)}});
test('administrador salva conteúdo, persiste na rota pública e rejeita versão antiga',async()=>{let r=await req('admin/site','PUT',{config:{...Site.defaults,heroTitle:'Jantar em casa',contactEmail:'contato@example.com'},versao:''},'admin');assert.equal(r.status,200);const saved=await r.json();assert.ok(saved.versao);assert.equal((await (await req('site')).json()).config.heroTitle,'Jantar em casa');assert.equal((await req('admin/site','PUT',{config:Site.defaults,versao:''},'admin')).status,409)});
test('configuração rejeita URLs perigosas, campos inválidos e descarta chaves extras',()=>{for(const heroImage of ['javascript:alert(1)','https://evil.example/image.jpg','https://images.unsplash.com@evil.example/x'])assert.throws(()=>Site.clean({...Site.defaults,heroImage}));assert.throws(()=>Site.clean({contactEmail:'errado'}));assert.throws(()=>Site.clean({heroTitle:''}));assert.throws(()=>Site.clean({supportWhatsapp:'123'}));assert.equal(Site.clean({admin:true}).admin,undefined)});
test('editar conteúdo da própria conta administrativa preserva o papel da equipe',async()=>{const id=ids.admin;const r=await (await req('admin/chefs/'+id,'GET',undefined,'admin')).json();assert.equal(r.chef.admin,true);const saved=await req('admin/chefs/'+id,'PUT',{versao:r.versao,perfil:{...r.chef,bio:'Apresentação revisada'}},'admin');assert.equal(saved.status,200);assert.equal((await saved.json()).chef.admin,true)});
test('editor de chef preserva acesso e não aceita fotos de outra conta',async()=>{
 const id=ids.other;const before=await (await req('admin/chefs/'+id,'GET',undefined,'admin')).json();assert.equal(before.chef.email,'other@example.com');assert.equal(before.chef.credencial,undefined);
 db.prepare('INSERT INTO fotos VALUES (?,?,?,?,?)').run('f'.repeat(32),ids.chef,'image/jpeg',new Uint8Array([255,216,255]),'agora');
 const r=await req('admin/chefs/'+id,'PUT',{versao:'v1',perfil:{...before.chef,name:'Chef revisado',email:'admin@example.com',admin:true,pausado:true,avatar:'/api/foto/'+'f'.repeat(32),dishes:[{id:'d1',name:'Moqueca',price:80}]}},'admin');assert.equal(r.status,200);
 const saved=await r.json();assert.equal(saved.chef.name,'Chef revisado');assert.equal(saved.chef.email,'other@example.com');assert.equal(saved.chef.admin,false);assert.equal(saved.chef.pausado,false);assert.equal(saved.chef.avatar,'');assert.equal(saved.chef.dishes[0].name,'Moqueca');assert.equal((await req('admin/chefs/'+id,'PUT',{versao:'v1',perfil:before.chef},'admin')).status,409);
});
test('exclusão própria exige sessão e apaga conta, fotos, pedidos e sessões',async()=>{const id=ids.chef;db.prepare('INSERT INTO pedidos VALUES (?,?,?,?,?)').run('p1',id,'Pedido fictício','{}','agora');assert.equal((await req('eu','DELETE')).status,401);assert.equal((await req('eu','DELETE',undefined,'chef')).status,200);for(const table of ['fotos','pedidos','sessoes'])assert.equal(db.prepare('SELECT COUNT(*) AS n FROM '+table+' WHERE chef_id = ?').get(id).n,0);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM chefs WHERE id = ?').get(id).n,0);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM chefs WHERE id = ?').get(ids.admin).n,1)});
