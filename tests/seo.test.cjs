const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../assets/app-core.js');
test('endereço do chef: nome sem acento + 6 primeiros hex do id',()=>{
 assert.equal(C.slugChef('Ana Lúcia D\'Ávila','chef-1a2b3c4d5e6f7a8b'),'ana-lucia-d-avila-1a2b3c');
 assert.equal(C.slugChef('','chef-1a2b3c4d5e6f7a8b'),'chef-1a2b3c');
 assert.equal(C.slugChef('Ana','cliente-x'),'');
 assert.equal(C.idDoSlug('ana-lucia-1a2b3c'),'1a2b3c');assert.equal(C.idDoSlug('ana-lucia'),'');
});
let DatabaseSync;try{({DatabaseSync}=require('node:sqlite'))}catch{test('SEO no servidor requer SQLite do Node 22.13+',{skip:true},()=>{});return;}
const db=new DatabaseSync(':memory:');for(const f of ['0001_piloto.sql','0002_google.sql','0003_admin.sql'])db.exec(fs.readFileSync(path.join(__dirname,'../migrations',f),'utf8'));
const DB={prepare(sql){let a=[];return{bind(...x){a=x;return this},async first(){return db.prepare(sql).get(...a)||null},async all(){return{results:db.prepare(sql).all(...a)}},async run(){return{meta:{changes:Number(db.prepare(sql).run(...a).changes)}}}}}};
const foto='/api/foto/'+'e'.repeat(32);
const perfil=(name,extra={})=>({name,whatsapp:'(48) 99110-6355',cities:'Florianópolis, São José',specialty:'Cozinha italiana',bio:'Cozinho na sua casa.',avatar:foto,gallery:[],dishes:[{id:'d',name:'Risoto <b>',price:80,category:'Massas'}],opcoes:{x_pizza:true},...extra});
const add=(id,email,p,pub=1,oculto=0)=>db.prepare('INSERT INTO chefs (id,email,credencial,perfil,publicado,oculto,criado_em,atualizado_em) VALUES (?,?,?,?,?,?,?,?)').run(id,email,'{}',JSON.stringify(p),pub,oculto,'2026-11-20T10:00:00Z','2026-11-24T10:00:00Z');
add('chef-aaaaaa0000000001','real@x.com',perfil('Maria Teste',{gallery:[{id:'primeiro',url:foto,caption:'Jantar <privado>'}]}));
add('chef-bbbbbb0000000002','escondido@x.com',perfil('Chef Escondido'),1,1);
add('chef-cccccc0000000003','pausado@x.com',perfil('Chef Pausado'),0);
add('chef-dddddd0000000004','inc@x.com',perfil('Chef Incompleto',{dishes:[]}));
add('chef-eeeeee0000000005','helena@apresentacao.invalid',perfil('Chef Fictícia'));
add('chef-ffffff0000000006','cli@x.com',perfil('Cliente',{tipo:'cliente'}));
let chef,c,cid,serv,mapa;
test.before(async()=>{chef=await import('../functions/chef/[slug].js');c=await import('../functions/c/[id].js');cid=await import('../functions/personal-chef/[[cidade]].js');serv=await import('../functions/servicos/[[servico]].js');mapa=await import('../functions/sitemap.xml.js')});
const PROD='https://seuchefemcasa.com.br';
const abre=(mod,url,params)=>mod.onRequest({request:new Request(url),env:{DB},params});
test('perfil /chef/<slug> sai completo do servidor, com canonical e JSON-LD; nome antigo redireciona',async()=>{
 const r=await abre(chef,PROD+'/chef/maria-teste-aaaaaa',{slug:'maria-teste-aaaaaa'});assert.equal(r.status,200);const h=await r.text();
 assert.match(h,/<title>Maria Teste · Personal chef<\/title>/);assert.match(h,/<link rel="canonical" href="https:\/\/seuchefemcasa\.com\.br\/chef\/maria-teste-aaaaaa">/);
 assert.match(h,/"@type":"Person"/);assert.match(h,/"priceCurrency":"BRL"/);assert.doesNotMatch(h,/noindex/);assert.doesNotMatch(h,/Risoto <b>/);assert.match(h,/\\u003cb>/);
 const graph=JSON.parse(h.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1])['@graph'];
 const page=graph.find(node=>node['@type']==='ProfilePage');
 const pessoa=graph.find(node=>node['@type']==='Person');
 const servico=graph.find(node=>node['@type']==='Service');
 assert.equal(page.mainEntity['@id'],pessoa['@id']);
 assert.equal(servico.provider['@id'],pessoa['@id']);
 assert.deepEqual(servico.areaServed.map(cidade=>cidade.name),['Florianópolis','São José']);
 assert.match(h,/href="#perfil-conteudo">Pular para o conteúdo/);
 assert.match(h,/href="https:\/\/seuchefemcasa\.com\.br\/personal-chef\/florianopolis"|href="\/personal-chef\/florianopolis"|personal-chef\/florianopolis/);
 const v=await abre(chef,PROD+'/chef/nome-velho-aaaaaa',{slug:'nome-velho-aaaaaa'});assert.equal(v.status,301);assert.equal(v.headers.get('location'),PROD+'/chef/maria-teste-aaaaaa');
 const prev=await(await abre(chef,'https://x.seu-chef-em-casa.pages.dev/chef/maria-teste-aaaaaa',{slug:'maria-teste-aaaaaa'})).text();assert.match(prev,/noindex/);
 for(const s of ['chef-escondido-bbbbbb','chef-pausado-cccccc','chef-incompleto-dddddd','chef-ficticia-eeeeee','cliente-ffffff','qualquer'])assert.equal((await abre(chef,PROD+'/chef/'+s,{slug:s})).status,404,s);
});
test('/c/<id> leva (301) ao endereço novo; /c/exemplo continua, com noindex',async()=>{
 const r=await abre(c,PROD+'/c/chef-aaaaaa0000000001',{id:'chef-aaaaaa0000000001'});assert.equal(r.status,301);assert.equal(r.headers.get('location'),PROD+'/chef/maria-teste-aaaaaa');
 assert.equal((await abre(c,PROD+'/c/chef-bbbbbb0000000002',{id:'chef-bbbbbb0000000002'})).status,404);
 const ex=await abre(c,PROD+'/c/exemplo',{id:'exemplo'});assert.equal(ex.status,200);assert.match(await ex.text(),/noindex/);
});
test('perfil exibe apenas ícones habilitados e mantém e-mail de contato separado da conta',async()=>{
 const {vitrine}=await import('../functions/_lib/vitrine.js');
 const p=perfil('Chef Contato',{contatos:['instagram','linkedin','phone','location','contactEmail','tiktok','facebook'],
  instagram:'https://instagram.com/chef',linkedin:'https://www.linkedin.com/in/chef',phone:'(48) 99110-6355',
  contactEmail:'chefe+eventos@example.com',email:'acesso@example.com',tiktok:'https://www.tiktok.com/@chef',facebook:'https://www.facebook.com/chef'});
 const html=await vitrine(p,{origem:PROD,id:'chef-aaaaaa0000000001',esteLink:PROD+'/chef/chef-contato-aaaaaa'}).text();
 for(const nome of ['Instagram','LinkedIn','Telefone','Localização','E-mail','TikTok','Facebook']) assert.ok(html.includes('aria-label="'+nome+'"'),nome);
 assert.doesNotMatch(html,/aria-label="WhatsApp"|wa\.me|acesso@example\.com/);
 assert.match(html,/mailto:chefe%2Beventos@example\.com/);
});
test('perfil compartilhado renderiza a primeira publicação, cardápio e contadores públicos',async()=>{
 const url=PROD+'/chef/maria-teste-aaaaaa',params={slug:'maria-teste-aaaaaa'};
 const novo=await (await abre(chef,url,params)).text();
 assert.match(novo,/<dt>Publicações<\/dt><dd>1<\/dd>/);
 assert.match(novo,/<dt>Seguidores<\/dt><dd>0<\/dd>/);
 assert.match(novo,/<dt>Seguindo<\/dt><dd>0<\/dd>/);
 assert.match(novo,/data-legenda="Jantar &lt;privado&gt;"/);
 assert.match(novo,/data-foto-id="primeiro"/);
 assert.match(novo,/data-comentarios/);
 assert.match(novo,/data-comentar/);
 assert.match(novo,/data-curtir aria-pressed="false"/);
 assert.match(novo,/<meta property="og:image"/);
 assert.ok(novo.indexOf('id="publicacoes"') < novo.indexOf('id="cardapio"'));

 db.exec('CREATE TABLE seguidores (chef_id TEXT, conta_id TEXT)');
 try {
  const segue=db.prepare('INSERT INTO seguidores VALUES (?, ?)');
  segue.run('chef-aaaaaa0000000001','chef-bbbbbb0000000002');
  segue.run('chef-aaaaaa0000000001','chef-ffffff0000000006');
  segue.run('chef-bbbbbb0000000002','chef-aaaaaa0000000001');
  const html=await (await abre(chef,url,params)).text();
  assert.match(html,/<dt>Seguidores<\/dt><dd>2<\/dd>/);
  assert.match(html,/<dt>Seguindo<\/dt><dd>1<\/dd>/);
  assert.doesNotMatch(html,/chef-bbbbbb0000000002|chef-ffffff0000000006/);
 } finally {
  db.exec('DROP TABLE seguidores');
 }
});
test('link da segunda publicação abre a foto certa e preserva o canonical do perfil',async()=>{
 const url=PROD+'/c/exemplo',params={id:'exemplo'};
 const primeira=await (await abre(c,url,params)).text();
 const imagem=primeira.match(/<a href="([^"]+)" data-publicacao data-link="[^"]+\?foto=foto-2"/)[1];
 const segunda=await (await abre(c,url+'?foto=foto-2',params)).text();
 assert.ok(segunda.includes('property="og:image" content="'+imagem+'"'));
 assert.ok(segunda.includes('rel="canonical" href="'+url+'"'));
 assert.match(segunda,/\?foto=foto-2" data-legenda="" data-foto-inicial/);
 assert.match(segunda,/Enviar pelo WhatsApp/);
 assert.match(segunda,/Copiar link da foto/);
 const ausente=await (await abre(c,url+'?foto=removida',params)).text();
 assert.doesNotMatch(ausente,/data-foto-inicial/);
});
test('portfólio completo reúne fotos, cardápio e contato em uma página para salvar como PDF',async()=>{
 const url=PROD+'/chef/maria-teste-aaaaaa',params={slug:'maria-teste-aaaaaa'};
 const html=await (await abre(chef,url+'?portfolio=pdf',params)).text();
 assert.match(html,/data-imprimir/);
 assert.match(html,/<meta name="robots" content="noindex">/);
 assert.ok(html.includes('rel="canonical" href="'+url+'"'));
 assert.match(html,/class="portfolio-capa com-foto"/);
 assert.match(html,/Minha cozinha/);
 assert.match(html,/<figcaption>Jantar &lt;privado&gt;<\/figcaption>/);
 assert.match(html,/<h2>Cardápio<\/h2>/);
 assert.match(html,/<h3 class="portfolio-categoria">Massas<\/h3>/);
 assert.match(html,/https:\/\/wa\.me\/5548991106355/);
 assert.doesNotMatch(html,/id="foto-publica"/);
});
test('cidade e serviço: com chef real indexa; sem chef, convite com noindex; desconhecido dá 404',async()=>{
 const f=await(await abre(cid,PROD+'/personal-chef/florianopolis',{cidade:['florianopolis']})).text();assert.doesNotMatch(f,/noindex/);assert.match(f,/href="\/chef\/maria-teste-aaaaaa"/);assert.match(f,/"FAQPage"/);assert.doesNotMatch(f,/Escondido|Fictícia|Pausado|Incompleto/);
 const j=await(await abre(cid,PROD+'/personal-chef/joinville',{cidade:['joinville']})).text();assert.match(j,/noindex/);assert.match(j,/brigada de Joinville/);
 assert.equal((await abre(cid,PROD+'/personal-chef/atlantida',{cidade:['atlantida']})).status,404);
 const p=await(await abre(serv,PROD+'/servicos/noite-da-pizza',{servico:['noite-da-pizza']})).text();assert.doesNotMatch(p,/noindex/);assert.match(p,/maria-teste-aaaaaa/);
 assert.match(await(await abre(serv,PROD+'/servicos/noite-do-fondue',{servico:['noite-do-fondue']})).text(),/noindex/);
 assert.equal(new Set((await import('../functions/_lib/seo.js')).SERVICOS.map(s=>s.slug)).size,(await import('../functions/_lib/seo.js')).SERVICOS.length);
});
test('sitemap lista só chefs visíveis, completos e reais, e cidades/serviços com chef',async()=>{
 const x=await(await mapa.onRequest({env:{DB}})).text();
 assert.match(x,/<loc>https:\/\/seuchefemcasa\.com\.br\/chef\/maria-teste-aaaaaa<\/loc><lastmod>2026-11-24<\/lastmod>/);
 assert.match(x,/personal-chef\/florianopolis</);assert.match(x,/personal-chef\/sao-jose</);assert.match(x,/servicos\/noite-da-pizza</);
 assert.doesNotMatch(x,/bbbbbb|cccccc|dddddd|eeeeee|ffffff|joinville|fondue/);
 const vazio=await(await mapa.onRequest({env:{}})).text();assert.equal((vazio.match(/<loc>/g)||[]).length,1);
});
