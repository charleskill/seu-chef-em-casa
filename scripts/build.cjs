// Dependency-free static build. Never copies docs, tests or SQL to hosting.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
fs.mkdirSync(out,{recursive:true});
// Marca cada arquivo de assets/ com a versão do conteúdo (?v=hash), para o navegador não misturar arquivos novos e antigos após uma atualização.
const crypto=require('node:crypto');
const versao=f=>crypto.createHash('sha1').update(fs.readFileSync(path.join(root,f))).digest('hex').slice(0,10);
fs.writeFileSync(path.join(out,'index.html'),fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/(src|href)="(assets\/[^"?]+\.(?:js|css))"/g,(m,attr,f)=>attr+'="'+f+'?v='+versao(f)+'"'));
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
// Portable review copy, with the same sources, for opening without a server.
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="assets/styles.css">',()=>'<style>'+fs.readFileSync(path.join(root,'assets/styles.css'),'utf8')+'</style>');
html=html.replace('<link rel="stylesheet" href="assets/improvements.css">',()=>'<style>'+fs.readFileSync(path.join(root,'assets/improvements.css'),'utf8')+'</style>');
html=html.replaceAll(/<script defer src="(assets\/[^\"]+)"><\/script>/g,()=> '');
const scripts=['demo-data.js','demo-images.js','app-core.js','cloud.js','order-validation.js','termos.js','app.js','improvements.js','endereco.js'].map(f=>'<script>\n'+fs.readFileSync(path.join(root,'assets',f),'utf8').replaceAll('</script','<\\/script')+'\n</script>').join('\n');
html=html.replace('</body>',()=>scripts+'\n</body>');
fs.writeFileSync(path.join(out,'seu-chef-revisado.html'),html);
console.log('Built dist/index.html and dist/seu-chef-revisado.html');
