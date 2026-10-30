/* Correções de texto nos perfis de exemplo. Carregar depois de demo-data.js e antes de app.js. */
(function(){
'use strict';
const seed=window.ChefSeed;if(!Array.isArray(seed))return;
const swaps=[[/especializado\(a\)/g,'especializado'],[/especializada\(a\)/g,'especializada'],[/Bolo Húmido/g,'Bolo Úmido'],[/File Mignon/g,'Filé Mignon']];
const fix=s=>typeof s==='string'?swaps.reduce((t,[a,b])=>t.replace(a,b),s):s;
seed.forEach(c=>{
  c.bio=fix(c.bio);
  (c.dishes||[]).forEach(d=>{
    d.name=fix(d.name);d.desc=fix(d.desc);
    // Prato principal que repetia a entrada "Bruschettas"
    if(d.category==='Pratos Principais'&&/^Bruschettas de Tomate Seco/.test(d.name))d.name='Tagliata de Fraldinha com Rúcula e Parmesão';
  });
});
})();
