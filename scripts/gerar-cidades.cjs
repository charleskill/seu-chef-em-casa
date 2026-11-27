// Gera assets/cidades-br.json com todos os municípios do IBGE ("Nome|UF").
// Rodar de vez em quando: node scripts/gerar-cidades.cjs
const fs = require('node:fs'), path = require('node:path');
(async () => {
  const r = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios?view=nivelado');
  if (!r.ok) throw new Error('IBGE respondeu ' + r.status);
  const lista = (await r.json()).map(m => m['municipio-nome'] + '|' + m['UF-sigla']).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  fs.writeFileSync(path.join(__dirname, '..', 'assets', 'cidades-br.json'), JSON.stringify(lista));
  console.log(lista.length + ' municípios');
})();
