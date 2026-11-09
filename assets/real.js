/* Versão real: não baixa os perfis de exemplo (cerca de 520 KB). Na demonstração eles carregam normalmente. */
window.ChefReal=/(^|\.)seu-chef-em-casa\.pages\.dev$|(^|\.)seuchefemcasa\.com\.br$/.test(location.hostname);
if(!window.ChefReal)document.write('<script defer src="assets/demo-data.js"><\/script><script defer src="assets/demo-images.js"><\/script>');
