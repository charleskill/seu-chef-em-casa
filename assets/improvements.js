/* Melhorias de uso. Carregar depois de app.js. Só adiciona comportamento; não altera os arquivos originais. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
let tt,raf;
const say=t=>{const el=$('#toast');if(!el||!t)return;el.textContent=t;el.hidden=false;clearTimeout(tt);tt=setTimeout(()=>el.hidden=true,5000)};
const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function formatPhone(v){
  let d=String(v||'').replace(/\D/g,'');if(d.startsWith('55')&&d.length>11)d=d.slice(2);
  if(!/^[1-9]\d{9,10}$/.test(d))return v;
  return d.length===11?`(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`:`(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
}
function enhance(){
  // 1) Imagem principal: carrega já, em resolução maior
  const hero=$('.hero-image img');
  if(hero&&!hero.dataset.fast){hero.dataset.fast='1';hero.loading='eager';hero.setAttribute('fetchpriority','high');if(/unsplash\.com/.test(hero.src)&&/w=600/.test(hero.src))hero.src=hero.src.replace('w=600','w=1200')}
  // 2) Estimativa de valor para os adultos no resumo do pedido
  const sum=$('#order-summary');
  if(sum&&!sum.querySelector('[data-est]')){
    const per=[...sum.querySelectorAll('.summary-line')].find(l=>/Menu por pessoa/.test(l.textContent));
    const adults=parseInt($('#count-adults')?.textContent,10);
    const v=per?parseFloat(per.querySelector('strong').textContent.replace(/[^\d,]/g,'').replace(',','.')):0;
    if(per&&adults>0&&v>0){
      const row=document.createElement('div');row.className='summary-line';row.dataset.est='1';
      row.innerHTML='<span>Estimativa p/ '+adults+(adults>1?' adultos':' adulto')+'*</span><strong>'+money(v*adults)+'</strong>';
      per.after(row);
    }
  }
  // 3) Botão de compartilhar no perfil do chef
  const top=$('.profile-top');
  const acts=top&&top.parentElement.querySelector('.acts');
  if(acts&&!acts.querySelector('[data-share]')){
    const b=document.createElement('button');b.type='button';b.className='b b2 share-btn';b.dataset.share='1';b.textContent='↗ Compartilhar perfil';acts.appendChild(b);
  }
}
new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(enhance)}).observe($('#view')||document.body,{childList:true,subtree:true});
enhance();
document.addEventListener('click',async e=>{
  if(e.target.closest('[data-share]')){
    const data={title:document.title,url:location.href};
    try{if(navigator.share){await navigator.share(data)}else{await navigator.clipboard.writeText(data.url);say('Link do perfil copiado.')}}
    catch(err){if(err&&err.name!=='AbortError')say('Não foi possível compartilhar. Copie o endereço da barra do navegador.')}
    return;
  }
  // Mostra o erro do pedido junto ao campo, não só no rodapé do resumo
  if(e.target.closest('[data-a="revieworder"]'))setTimeout(()=>say($('#order-error')?.textContent),80);
});
// Máscara de telefone ao sair do campo: (48) 99999-0000
document.addEventListener('change',e=>{
  const el=e.target;
  if(el&&el.type==='tel'){const f=formatPhone(el.value);if(f!==el.value){el.value=f;el.dispatchEvent(new Event('input',{bubbles:true}))}}
},true);
})();
