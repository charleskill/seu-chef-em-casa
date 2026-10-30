// Gera assets/demo-data.js (50 chefs de teste) e assets/demo-images.js (imagens ilustrativas).
// Uso: node scripts/gerar-demo.cjs        (as imagens exigem Playwright com Chromium; só para regenerar)
// Tudo é fictício: nomes, bios, preços, avaliações. Nenhum contato real.
const fs=require('node:fs');
const path=require('node:path');
const {DISHES}=require('./demo/catalogo.cjs');
const base=require('./demo/base-perfis.json');
const root=path.resolve(__dirname,'..');

/* ---------- Perfis-tipo ---------- */
// marmitaP: chance de oferecer marmitas · foco: marmita é o carro-chefe
const ARQ={
 litoral:{label:'Frutos do mar e cozinha litorânea catarinense',cuisines:['litoral','acoriana'],extra:['classicos'],marmitaP:.4,frase:['Meu forte são os frutos do mar frescos do litoral catarinense, preparados do jeito açoriano e com toques contemporâneos.','Trabalho com pescado e frutos do mar da região, e a tainha na brasa é meu cartão de visitas.']},
 alema:{label:'Cozinha alemã do Vale do Itajaí',cuisines:['alema'],extra:['classicos'],marmitaP:.5,frase:['Cozinho receitas alemãs de família, como o eisbein e os doces de cuca, com a tradição do Vale do Itajaí.','Levo para a sua mesa a cozinha teuto-catarinense: defumados, chucrute artesanal e sobremesas caseiras.']},
 italianasc:{label:'Cozinha italiana do sul catarinense',cuisines:['italianasc','italiana'],extra:['classicos'],marmitaP:.5,frase:['Aprendi com a nona a polenta, o galeto e as massas das colônias italianas do sul de Santa Catarina.','Tradição italiana do sul catarinense, com massas feitas na hora e muito queijo.']},
 serrana:{label:'Culinária serrana e fogo de chão',cuisines:['serrana','gaucha'],extra:['classicos'],marmitaP:.3,frase:['Pinhão, carnes na brasa e queijo serrano são a base da minha cozinha de serra.','Cozinho ao estilo da Serra Catarinense, com ingredientes de produtores locais.']},
 nordeste:{label:'Cozinha nordestina e baiana',cuisines:['nordeste'],extra:['classicos'],marmitaP:.6,frase:['Moqueca, baião de dois e carne de sol: levo o sabor do Nordeste para a sua casa.','Minha cozinha é de dendê, coco e muito tempero, com receitas que vieram da Bahia.']},
 mineira:{label:'Cozinha mineira e caseira',cuisines:['mineira','classicos'],extra:['caseira'],marmitaP:.8,frase:['Cozinha mineira de fogão a lenha adaptada para sua casa: feijão tropeiro, angu e doces de leite.','Comida de vó, no ponto certo, com receitas de Minas e do Brasil inteiro.']},
 churrasco:{label:'Churrasco e carnes na brasa',cuisines:['gaucha'],extra:['bbq','classicos'],marmitaP:.2,frase:['Churrasco com cortes selecionados, ponto certo e acompanhamentos feitos na hora.','Carnes na brasa são o meu ofício, de picanha a costela de fogo de chão.']},
 amazonica:{label:'Cozinha amazônica contemporânea',cuisines:['amazonica'],extra:['nordeste','classicos'],marmitaP:.2,frase:['Trago ingredientes da Amazônia, como tucupi, jambu e pirarucu, em pratos contemporâneos.','Peixes de água doce, castanhas e frutas amazônicas em um cardápio autoral.']},
 italiana:{label:'Italiana artesanal',cuisines:['italiana'],extra:['mediterranea'],marmitaP:.4,frase:['Massas frescas feitas na sua cozinha, molhos de longo cozimento e muita conversa à mesa.','Cozinha italiana de verdade: poucos ingredientes, bem escolhidos, e técnica.']},
 japonesa:{label:'Japonesa e oriental',cuisines:['japonesa'],extra:['asiatica'],marmitaP:.4,frase:['Comida japonesa de casa, de gyoza a temaki bar interativo para animar a festa.','Cozinha japonesa caseira e sushi-bar particular, com peixe fresco do dia.']},
 francesa:{label:'Francesa clássica',cuisines:['francesa'],extra:['italiana','mediterranea'],marmitaP:.25,frase:['Bistrô francês em casa, com caldos longos, vinho na panela e sobremesas clássicas.','Técnicas francesas aplicadas a ingredientes de Santa Catarina.']},
 mexicana:{label:'Mexicana',cuisines:['mexicana'],extra:['bbq','drinks'],marmitaP:.5,frase:['Tacos, guacamole e muita pimenta, com tortilhas feitas na hora.','Mexicana de verdade, sem exageros de queijo amarelo: sabor de rua e de casa.']},
 asiatica:{label:'Tailandesa e asiática',cuisines:['asiatica'],extra:['japonesa'],marmitaP:.5,frase:['Pad thai, curries e rolinhos, com a explosão de ervas e especiarias do Sudeste Asiático.','Cozinha asiática equilibrada entre doce, picante, azedo e salgado.']},
 arabe:{label:'Árabe e libanesa',cuisines:['arabe'],extra:['mediterranea'],marmitaP:.5,frase:['Mesa farta de mezze, quibes e kaftas, com receitas passadas de geração em geração.','Culinária árabe e libanesa para compartilhar, com pão fresco e temperos frescos.']},
 indiana:{label:'Indiana',cuisines:['indiana'],extra:['vegana','asiatica'],marmitaP:.6,frase:['Curries aromáticos, pães indianos e opções vegetarianas deliciosas.','Especiarias torradas na hora e receitas de várias regiões da Índia.']},
 mediterranea:{label:'Mediterrânea e grega',cuisines:['mediterranea','espanhola'],extra:['portuguesa'],marmitaP:.4,frase:['Azeite, limão e ervas: a cozinha do Mediterrâneo em pratos leves e cheios de sabor.','Moussaka, polvo grelhado e salada grega, com ingredientes frescos.']},
 peruana:{label:'Peruana e espanhola',cuisines:['peruana','espanhola'],extra:['mediterranea'],marmitaP:.3,frase:['Ceviches, tiraditos e paellas, com o frescor do Pacífico e do Mediterrâneo.','Cozinha peruana e espanhola em formato de degustação.']},
 portuguesa:{label:'Portuguesa',cuisines:['portuguesa'],extra:['espanhola','mediterranea'],marmitaP:.4,frase:['Bacalhau de mil jeitos, caldo verde e doces conventuais, direto da tradição lusa.','Cozinha portuguesa de domingo: bacalhau, arroz de pato e muito azeite.']},
 vegana:{label:'Vegana e vegetariana',cuisines:['vegana'],extra:[],fallback:false,marmitaP:1,foco:1,frase:['Cozinha 100% vegetal, colorida e saborosa, sem abrir mão do aconchego.','Pratos veganos que agradam também quem come de tudo.']},
 fit:{label:'Marmitas fit e saudáveis',cuisines:['fit'],extra:['caseira','vegana'],marmitaP:1,foco:1,frase:['Marmitas balanceadas, com macros calculados e ingredientes frescos.','Alimentação saudável para a semana inteira, com planejamento e sabor.']},
 caseira:{label:'Marmitas caseiras do dia a dia',cuisines:['caseira'],extra:['classicos','mineira'],marmitaP:1,foco:1,frase:['Comida de casa para a semana toda: arroz, feijão, mistura e salada, no ponto de sempre.','Marmitas caseiras, bem servidas e variadas, para quem não tem tempo de cozinhar.']},
 confeitaria:{label:'Confeitaria e sobremesas',cuisines:['confeitaria'],extra:['drinks'],fallback:false,n:{E:0,P:0,S:7,B:2},marmitaP:0,frase:['Sobremesas para fechar a mesa: tortas, pavlovas, doces finos e bolos de pote.','Confeitaria autoral para aniversários e jantares, com receitas de família.']},
 gastro:{label:'Alta gastronomia',cuisines:['francesa','italiana'],extra:['mediterranea','drinks','confeitaria'],marmitaP:0,frase:['Menu degustação com harmonização, para encontros em que cada prato é uma pausa.','Alta gastronomia em casa: técnica refinada e produtos selecionados.']},
 bbq:{label:'Barbecue americano',cuisines:['bbq'],extra:['gaucha','mexicana'],marmitaP:.3,frase:['Costelinha, pulled pork e hambúrguer artesanal, com defumação lenta.','Barbecue ao estilo americano e acompanhamentos clássicos.']},
 contemporanea:{label:'Cozinha brasileira contemporânea',cuisines:['classicos','nordeste','amazonica','litoral'],extra:['mineira'],marmitaP:.5,frase:['Ingredientes brasileiros em pratos autorais, do Sul ao Norte.','Brasilidade na mesa: raízes, frutos e peixes em releituras contemporâneas.']}
};
const ORDEM_CHEFS=['gastro','litoral','churrasco','japonesa','litoral','alema','alema','italianasc','serrana','fit','litoral','caseira','italianasc','vegana','bbq','serrana','churrasco','alema','contemporanea','litoral','italiana','fit','nordeste','peruana','confeitaria','alema','vegana','caseira','mineira','mexicana','mediterranea','churrasco','contemporanea','arabe','portuguesa','serrana','caseira','asiatica','alema','indiana','fit','francesa','nordeste','gastro','vegana','bbq','confeitaria','japonesa','italiana','contemporanea'];

const VIZINHAS={
 grandefloripa:['Florianópolis','São José','Palhoça','Biguaçu'],
 litoralnorte:['Balneário Camboriú','Itajaí','Itapema','Porto Belo'],
 vale:['Blumenau','Brusque','Rio do Sul','Jaraguá do Sul'],
 norte:['Joinville','Jaraguá do Sul','São Bento do Sul'],
 sul:['Criciúma','Tubarão','Araranguá'],
 oeste:['Chapecó','Concórdia'],
 serra:['Lages']
};
const ORDEM_CAT=['Entradas','Pratos Principais','Massas','Frutos do mar','Sobremesas','Bebidas & drinks'];
const FREQS=['semanal','quinzenal','mensal'];

/* ---------- Utilidades ---------- */
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const pick=(r,arr)=>arr[Math.floor(r()*arr.length)];
function shuffle(r,arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const group=c=>c==='Entradas'?'E':c==='Sobremesas'?'S':c==='Bebidas & drinks'?'B':'P';
const hex=e=>[...e].map(c=>c.codePointAt(0).toString(16)).join('-');
const PALETAS=[['#f6d365','#fda085'],['#a1c4fd','#c2e9fb'],['#d4fc79','#96e6a1'],['#fbc2eb','#a6c1ee'],['#ffecd2','#fcb69f'],['#84fab0','#8fd3f4'],['#fccb90','#d57eeb'],['#e0c3fc','#8ec5fc'],['#f5f7fa','#c3cfe2'],['#fdcbf1','#e6dee9'],['#ffd1ff','#fad0c4'],['#cfd9df','#e2ebf0']];
const paletaDe=k=>{let h=0;for(const c of k)h=(h*31+c.charCodeAt(0))>>>0;return PALETAS[h%PALETAS.length]};

/* ---------- Chefs ---------- */
function cidades(r,cidade){
  const g=Object.values(VIZINHAS).find(v=>v.includes(cidade))||[cidade];
  const outras=shuffle(r,g.filter(c=>c!==cidade));
  const n=r()<.55?Math.min(outras.length,1+Math.floor(r()*2)):0;
  const lista=[cidade,...outras.slice(0,n)];
  return lista.length===1?lista[0]:lista.slice(0,-1).join(', ')+' & '+lista.at(-1);
}
function escolherPratos(r,a){
  const pools=[a.cuisines,a.extra||[],...(a.fallback===false?[]:[['classicos']])].map(cs=>DISHES.filter(d=>cs.includes(d.cuisine)));
  const usados=new Set(),sel=[];
  const pegar=(grupo,n,somenteMarmita=false)=>{
    let falta=n;
    for(const pool of pools){
      for(const d of shuffle(r,pool)){
        if(!falta)return;
        if(usados.has(d.name)||group(d.category)!==grupo)continue;
        if(somenteMarmita&&!d.marmita)continue;
        usados.add(d.name);sel.push(d);falta--;
      }
    }
  };
  const foco=!!a.foco,n=a.n||{};
  pegar('E',n.E??2+Math.floor(r()*2));
  const nP=n.P??(foco?6+Math.floor(r()*2):4+Math.floor(r()*2));
  const antes=sel.length;
  pegar('P',nP,foco);
  if(foco&&sel.length-antes<nP){ // faltou prato de marmita: completa só com a culinária principal
    const falta=nP-(sel.length-antes);
    for(const d of shuffle(r,pools[0])){if(sel.length-antes>=nP)break;if(!usados.has(d.name)&&group(d.category)==='P'){usados.add(d.name);sel.push(d)}}
  }
  pegar('S',n.S??2);
  if(n.B!=null)pegar('B',n.B);else if(r()<.4)pegar('B',1);
  return sel;
}
function marmitaDe(r,a,pratos){
  const el=pratos.filter(d=>d.marmita);
  if(el.length<3)return null;
  const media=el.reduce((n,d)=>n+d.price,0)/el.length;
  const price=Math.max(22,Math.min(52,Math.round(media*.62)));
  const min=pick(r,a.foco?[5,7,10,10,12]:[8,10,12,15,20]);
  let freq=a.foco&&r()<.7?FREQS.slice():FREQS.filter(f=>f==='semanal'?r()<.85:r()<.55);
  if(!freq.length)freq=['semanal'];
  const modes=pick(r,[['entrega'],['casa'],['entrega','casa'],['entrega','casa']]);
  return{price,min,freq,modes};
}
function bio(r,a,ano,cid,mm){
  const intros=[
    `Cozinho profissionalmente há ${ano} anos e atendo em ${cid}.`,
    `Personal chef há ${ano} anos, com atendimento em ${cid}.`,
    `São ${ano} anos de cozinha, levando o serviço de personal chef a ${cid}.`,
    `Depois de ${ano} anos entre restaurantes e eventos, hoje cozinho na casa dos meus clientes em ${cid}.`,
    `Meu trabalho de personal chef começou há ${ano} anos e hoje atende ${cid}.`
  ];
  const servico=[
    'Cuido de tudo: compras, preparo, finalização e a cozinha organizada ao final.',
    'Monto o cardápio com você, de acordo com o evento e as restrições de cada convidado.',
    'Atendo jantares íntimos, aniversários e encontros em família.',
    'Trabalho com ingredientes frescos e de produtores da região sempre que possível.',
    'Cardápio sob medida, com respeito a alergias e restrições alimentares.'
  ];
  const par1=intros[Math.floor(r()*intros.length)]+' '+pick(r,a.frase);
  let par2=pick(r,servico);
  if(mm){
    const fr=mm.freq.map(f=>f==='semanal'?'semanais':f==='quinzenal'?'quinzenais':'mensais');
    const lista=fr.length>1?fr.slice(0,-1).join(', ')+' e '+fr.at(-1):fr[0];
    par2+=` Também faço planos de marmitas ${lista}, para comer bem na rotina.`;
  }
  return par1+'\n\n'+par2;
}

const chefs=[],artes=new Map(),avatares=new Map();
const avatarUsado=new Set();
base.forEach((b,i)=>{
  const r=rng(i*7919+13);
  const a=ARQ[ORDEM_CHEFS[i]];
  const num=String(i+1).padStart(2,'0');
  const id='demo-'+num;
  const cid=cidades(r,b.city);
  const fator=.92+r()*.3;
  let pratos=escolherPratos(r,a);
  let marmita=r()<a.marmitaP?marmitaDe(r,a,pratos):null;
  if(!marmita&&a.foco)marmita=marmitaDe(r,a,pratos);
  pratos.sort((x,y)=>ORDEM_CAT.indexOf(x.category)-ORDEM_CAT.indexOf(y.category));
  const dishes=pratos.map((d,k)=>{const o={id:k+1,category:d.category,name:d.name,desc:d.desc,price:Math.round(d.price*fator)};if(marmita&&d.marmita)o.marmita=true;return o});
  // galeria: ilustração do prato primeiro (a capa nunca falha) e depois as fotos reais já existentes, intercaladas
  const arts=shuffle(r,pratos).slice(0,3).map(d=>{const k='a-'+hex(d.emoji);artes.set(k,d.emoji);return{url:'demo:'+k,caption:d.name}});
  const reais=b.gallery.map(g=>({url:g.url,caption:g.caption}));
  const ordem=[];for(let j=0;j<Math.max(arts.length,reais.length);j++){if(arts[j])ordem.push(arts[j]);if(reais[j])ordem.push(reais[j])}
  const gal=ordem.map((g,j)=>({id:101+j,url:g.url,caption:g.caption}));
  const real=!avatarUsado.has(b.avatar);avatarUsado.add(b.avatar);
  let avatar=b.avatar;
  if(!real){avatar='demo:av-'+num;avatares.set('av-'+num,{nome:b.name.replace(/^Chef\s+/,''),i})}
  const chef={id,name:b.name,email:'',whatsapp:'',phone:'',instagram:'',cities:cid,specialty:a.label,avatar,
    bio:bio(r,a,3+Math.floor(r()*20),cid,marmita),dishes,gallery:gal};
  if(marmita)chef.marmita=marmita;
  chefs.push(chef);
});

/* ---------- Saída: demo-data.js ---------- */
const cab=`/* PERFIS DE EXEMPLO PARA TESTE. Tudo aqui é fictício: nomes, bios, preços e fotos ilustrativas.
   Gerado por scripts/gerar-demo.cjs (não edite à mão).
   Para esconder os 50 perfis de uma vez, troque enabled para false.
   Para remover de vez: apague demo-data.js e demo-images.js e as duas linhas <script> deles no index.html. */
window.ChefDemo={enabled:true};
`;
const dados='window.ChefSeed=[\n'+chefs.map(c=>JSON.stringify(c)).join(',\n')+'\n];\nwindow.ChefSeed.forEach(c=>{c.isDemo=true});\n';
fs.writeFileSync(path.join(root,'assets/demo-data.js'),cab+dados);

/* ---------- Saída: demo-images.js (Playwright) ---------- */
async function imagens(){
  const {chromium}=require('playwright');
  const browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:320,height:240},deviceScaleFactor:1});
  const out={};
  for(const [k,emoji] of artes){
    const [c1,c2]=paletaDe(k);
    await page.setContent(`<body style="margin:0;width:320px;height:240px;background:linear-gradient(135deg,${c1},${c2});display:grid;place-items:center;overflow:hidden">
      <div style="width:176px;height:176px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#f1efe9);box-shadow:0 10px 24px rgba(0,0,0,.22),inset 0 0 0 10px #fff,inset 0 0 0 12px #e8e3d9;display:grid;place-items:center;font:84px 'Noto Color Emoji'">${emoji}</div></body>`);
    out[k]='data:image/jpeg;base64,'+(await page.screenshot({type:'jpeg',quality:58})).toString('base64');
  }
  const pa=await browser.newPage({viewport:{width:128,height:128},deviceScaleFactor:1});
  const fundos=['#304e3b','#8a3b2b','#2b4d7a','#6b7d2a','#7a4a6b','#9a6a1f','#3d6a6a','#5a4a8a','#a04a5a','#4a5a3a'];
  for(const [k,v] of avatares){
    const ini=v.nome.split(' ').map(p=>p[0]).slice(0,2).join('');
    await pa.setContent(`<body style="margin:0;width:128px;height:128px;background:${fundos[v.i%fundos.length]};display:grid;place-items:center;color:#fff;font:56px Georgia,'DejaVu Serif',serif">${ini}</body>`);
    out[k]='data:image/jpeg;base64,'+(await pa.screenshot({type:'jpeg',quality:70})).toString('base64');
  }
  await browser.close();
  fs.writeFileSync(path.join(root,'assets/demo-images.js'),'/* Imagens ilustrativas dos perfis de exemplo (geradas por scripts/gerar-demo.cjs). Não são fotos reais. */\nwindow.ChefDemoImages='+JSON.stringify(out)+';\n');
  return Object.keys(out).length;
}
imagens().then(n=>console.log(chefs.length+' chefs, '+n+' imagens, marmita em '+chefs.filter(c=>c.marmita).length+' chefs')).catch(e=>{console.error(e);process.exit(1)});
