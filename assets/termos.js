/* Termos de Uso e Privacidade. Texto-modelo: deve ser revisado por advogado(a) antes do lançamento. */
(function(root){
'use strict';
const CONTATO='';/* preencher com o e-mail de contato quando existir */
const sec=(t,items)=>'<section class="card termos-sec"><h2>'+t+'</h2>'+items.map(x=>'<p>'+x+'</p>').join('')+'</section>';
function html(){
return '<p class="form-help">Última atualização: 30/10/2026. Ao usar o site, você concorda com estes termos.</p>'
+sec('1. O que é este serviço',[
'O <b>Seu Chef em Casa</b> é uma <b>plataforma de vitrine</b>: um espaço onde personal chefs divulgam seu trabalho (perfil, fotos, cardápio, região e agenda) e onde qualquer pessoa pode conhecer esses perfis e entrar em contato para pedir um orçamento ou combinar um evento ou um plano de marmitas.',
'A plataforma <b>não é empresa de personal chef</b>, não presta serviços de cozinha, não contrata nem emprega chefs, não vende comida, não recebe nem repassa pagamentos e <b>não é parte</b> de nenhum contrato firmado entre cliente e chef.'])
+sec('2. Acesso aberto',[
'Qualquer pessoa pode acessar o site, ver os perfis e entrar em contato com os chefs, e qualquer chef pode criar um perfil. A plataforma <b>não verifica</b> a identidade, as qualificações, os certificados, as licenças, os antecedentes ou a regularidade fiscal e sanitária de chefs ou clientes. Informações, selos e avisos exibidos nos perfis são <b>declarados pelos próprios chefs</b>.',
'Os perfis marcados como "exemplo" ou "demonstração" são ilustrativos e não representam profissionais reais.'])
+sec('3. A contratação é direta entre cliente e chef',[
'Valores, cardápio, data, local, ingredientes, forma de pagamento, nota fiscal, cancelamento, reembolso e quaisquer outras condições são combinados <b>diretamente entre cliente e chef</b>, normalmente pelo WhatsApp. Os valores e as estimativas mostrados no site são <b>referências</b>, não ofertas nem preços finais.',
'A plataforma apenas facilita o primeiro contato, por exemplo preparando a mensagem do pedido de orçamento.'])
+sec('4. Responsabilidade',[
'<b>Nos limites da lei</b>, a plataforma não se responsabiliza pelo que acontece entre cliente e chef nem por qualquer fato decorrente do serviço contratado, incluindo, sem se limitar a: qualidade da comida e do atendimento, segurança alimentar, alergias e intolerâncias, atrasos, faltas e cancelamentos, danos a pessoas ou bens, acidentes, pagamentos, cobranças, nota fiscal, conduta de qualquer pessoa e descumprimento do que foi combinado.',
'Quem tem alergia, restrição alimentar ou necessidade especial deve informá-la <b>diretamente ao chef</b> e confirmar que ele pode atendê-la. O chef é o único responsável pelo preparo seguro dos alimentos, por suas licenças, registros e obrigações fiscais, sanitárias e trabalhistas, e por cumprir o que prometeu.',
'Nada nestes termos limita direitos que a lei não permite limitar, inclusive os do consumidor.'])
+sec('5. Compromissos dos chefs',[
'Dar informações verdadeiras; manter perfil, preços e agenda atualizados; usar apenas fotos e textos próprios ou autorizados; ter as autorizações necessárias para a atividade que anuncia; tratar com cuidado os dados que receber dos clientes; e não usar a plataforma para fraude, publicidade enganosa ou assédio.'])
+sec('6. Compromissos dos clientes',[
'Dar informações verdadeiras no pedido; informar alergias e restrições ao chef; tratar os chefs com respeito; e combinar com o chef as condições antes de contar com o serviço.'])
+sec('7. Conteúdo e remoção',[
'A plataforma pode remover perfis, fotos ou conteúdos que violem estes termos, a lei ou direitos de terceiros, e pode suspender o acesso de quem os descumprir. Quem publica o conteúdo responde por ele.'])
+sec('8. Disponibilidade',[
'O serviço é oferecido "como está", sem garantia de funcionar sem interrupções ou erros. Na fase atual, partes do site funcionam como demonstração e <b>guardam dados apenas no navegador de quem usa</b>.'])
+sec('9. Privacidade (LGPD)',[
'<b>Dados tratados:</b> nome, telefone, e-mail (opcional), cidade ou endereço, data, número de convidados, preferências e restrições alimentares informados no pedido, além dos dados do perfil do chef (nome, WhatsApp, fotos, cidades, textos).',
'<b>Para que usamos:</b> montar o pedido de orçamento e permitir que você fale com o chef que escolheu. Ao tocar em "Abrir WhatsApp", o texto do pedido é enviado ao chef por você, e o chef passa a ter esses dados. Restrições e alergias são informações sensíveis: você escolhe se as inclui no pedido.',
'<b>Onde ficam:</b> nesta versão, os dados do pedido e do painel ficam <b>no seu navegador</b> e não são enviados a um servidor da plataforma. Quando houver servidor, esta seção será atualizada antes.',
'<b>Seus direitos:</b> você pode pedir acesso, correção ou exclusão dos seus dados, e o chef pode apagar o próprio perfil a qualquer momento.'+(CONTATO?' Fale conosco em '+CONTATO+'.':'')])
+sec('10. Alterações',[
'Estes termos podem mudar. A versão em vigor é sempre a publicada nesta página, com a data da última atualização. Regem-se pela lei brasileira.']);
}
root.ChefTermos={html,contato:CONTATO};
})(typeof window!=='undefined'?window:globalThis);
