/* App instalável: registra o service worker e guarda o convite de instalação do navegador.
   O Painel mostra o botão "Instalar app" quando dá para instalar (Android/Chrome/Edge)
   ou quando é iPhone no Safari (aí mostramos como adicionar à tela de início). */
(function(root){
 'use strict';
 let convite=null;
 const instalado=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
 const iphone=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 const seguro=location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1';
 if('serviceWorker' in navigator&&seguro)addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
 addEventListener('beforeinstallprompt',ev=>{ev.preventDefault();convite=ev;root.ChefApp.aoMudar&&root.ChefApp.aoMudar()});
 addEventListener('appinstalled',()=>{convite=null;root.ChefApp.aoMudar&&root.ChefApp.aoMudar()});
 root.ChefApp={
  aoMudar:null,
  mostrar(){return !instalado()&&(!!convite||iphone())},
  // Devolve um texto para avisar a pessoa (ou '' se o navegador já mostrou a janela de instalação).
  async instalar(){
   if(convite){const c=convite;convite=null;c.prompt();const r=await c.userChoice.catch(()=>({}));return r.outcome==='accepted'?'Pronto! O Seu Chef em Casa está na sua tela inicial.':''}
   if(iphone())return 'No Safari, toque em Compartilhar (o quadrado com a seta) e depois em Adicionar à Tela de Início.';
   return 'Abra o menu do navegador e escolha Instalar app ou Adicionar à tela inicial.';
  }
 };
})(window);
