# Modelo Airbnb Serviços (chefs): regras e o que serve para o Seu Chef em Casa

Pesquisa de 27/11/2026 (Claude). Regras lidas nas páginas oficiais do Airbnb (links no fim). Não é parecer jurídico.

## 1. Como o Airbnb faz (regras oficiais)

**Dinheiro**
- O cliente paga tudo pelo Airbnb, e o preço exibido já inclui tudo (taxas e gorjeta obrigatória, se houver).
- O Airbnb desconta **15% do chef** (mínimo de US$ 6) em **Serviços**, categoria que inclui chefs, catering e refeições preparadas. Em **Experiências** (atividade em grupo, aula, passeio), desconta 20%.
- O chef recebe **no fim do dia útil seguinte ao serviço**. O Airbnb segura o dinheiro até o serviço acontecer.
- Preço por pessoa (com valor mínimo do grupo) ou preço fechado até X pessoas. O Airbnb recomenda **3 ofertas por anúncio: entrada, padrão e premium**.
- Descontos que o chef pode ligar: promoção de 5 a 50% por até 90 dias, 20% para quem reserva com mais de 2 semanas de antecedência e desconto para grupo grande. Vale só o maior desconto.

**Cancelamento**
- **Pelo cliente:** na política padrão, devolução integral até **24 horas antes** do serviço. Há uma opção de 72 horas para alguns chefs. Depois disso, o chef recebe.
- **Pelo chef:** o cliente recebe tudo de volta e o chef paga **multa de 20% do valor**, descontada do próximo repasse. Não paga se houver motivo válido comprovado, como doença ou casa sem segurança. Cancelamentos repetidos levam à remoção.
- **Problemas cobertos** (cliente pede reembolso em até 72 horas): chef atrasa mais de 15 minutos ou não aparece, serviço muito diferente do anunciado, chef despreparado ou chef que danifica a casa.

**Entrada e qualidade**
- Cadastro grátis, mas com **análise que leva semanas**. Pode haver lista de espera.
- O chef precisa de verificação de identidade (e de antecedentes, onde se aplica), **portfólio com fotos de trabalhos reais**, mínimo de 5 fotos e experiência comprovada (formação, carreira, avaliações em outras plataformas).
- O Airbnb pode exigir alvará e seguro; documentos vencidos pausam o anúncio.
- **Seguro de responsabilidade de até US$ 1 milhão incluído** para danos ou lesões durante o serviço, mais o seguro próprio do chef.
- O chef tem que prestar o serviço pessoalmente, sem mandar outra pessoa no lugar.

## 2. Está funcionando?
- **Para o Airbnb, sim:** nos resultados de 2026, a empresa diz que Experiências e Serviços trazem cliente novo. Quase 1 em cada 4 hóspedes que reservam uma experiência é novo no Airbnb e depois reserva hospedagem ou serviço. A empresa também ampliou os Serviços (mercado, carro, transfer). Ela não divulga números só de chefs.
- **No Brasil, ainda não existe:** em 27/11/2026, a busca de Serviços do Airbnb responde "ainda não estão disponíveis" em Florianópolis, São Paulo e Rio de Janeiro. **Hoje não há o Airbnb competindo com o Seu Chef em Casa por aqui**, mas ele pode chegar.

## 3. O que dá para aplicar, por fase

**Agora, sem mexer em pagamento:**
- **3 ofertas por chef** (entrada, padrão e premium), com preço por pessoa e mínimo de pessoas. Ajuda o cliente a escolher e o chef a vender mais.
- **Política de cancelamento clara** no orçamento e no contrato (ver `contratos-personal-chef.md`). Atenção: as 24 horas do Airbnb são boas para o cliente e ruins para o chef que já comprou ingredientes. Usar a tabela do nosso contrato.
- **Padrão de qualidade para aparecer:** perfil com foto real, pelo menos 5 fotos de trabalhos e experiência descrita. O site já exige foto e um prato; dá para subir a régua aos poucos.
- **Regra de pontualidade e de cancelamento pelo chef** nos termos, com consequência (perde destaque e, se repetir, sai da busca).
- **Desconto para quem reserva com antecedência**, opcional para o chef.

**Depois, com volume: pagamento pelo app e comissão**
- Precisa de um intermediador de pagamento com **divisão automática (split)**: Mercado Pago, Pagar.me, Asaas ou Stripe no Brasil. O dinheiro fica retido e é repassado ao chef depois do serviço, menos a comissão.
- **Comissão de referência: 10 a 15% do chef**, com o preço já cheio para o cliente, como no Airbnb.
- **Custos e riscos novos:** nota fiscal da comissão, atendimento de reembolso e disputa e, principalmente, **responsabilidade**. Quando a plataforma recebe o pagamento, a Justiça tende a vê-la como parte da cadeia de consumo (responde junto com o chef). O Airbnb compensa isso com seguro de US$ 1 milhão; para nós, seria preciso um seguro e revisão do Diogo.
- **Ingredientes:** no Airbnb, o preço do chef já inclui tudo. Para nós, faz sentido separar "serviço" e "ingredientes" no orçamento, e a comissão incidir só sobre o serviço. Assim o chef não paga comissão sobre o mercado.

**Alternativa mais leve (o que o site já indica):** cobrar uma taxa fixa por contato liberado no mural, sem passar o pagamento pelo app. Tem menos risco jurídico e menos burocracia, mas também não garante ao cliente que o dinheiro está seguro.

## 4. Nome "Serviços" ou "Experiências"
No Airbnb são duas coisas diferentes: **Serviço** é o profissional que vai até você (chef em casa, refeições preparadas), com taxa de 15%. **Experiência** é uma atividade, geralmente em grupo (aula, passeio), com taxa de 20%.
No nosso código, a lista "Serviços" (`functions/_lib/seo.js`, `SERVICOS`) já junta três grupos: serviços próprios, `EXPERIENCIAS` (como as noites temáticas) e marmitas. Sugestão: **separar em duas abas, "Experiências" (noites temáticas, aulas) e "Serviços" (jantar em casa, eventos, marmitas)**, em vez de trocar o nome de tudo. Marmita não é experiência.
Se mudar endereço de página (`/servicos/...`), precisa de redirecionamento 301 para não perder o Google.

## Fontes
- Taxas: https://www.airbnb.com/help/article/3164
- Cadastro de Serviços: https://airbnb.com/host/services
- Termos adicionais para Serviços e Experiências (repasse, seguro, substituição): https://www.airbnb.com/help/article/2870
- Padrões e requisitos: https://www.airbnb.com/resources/hosting-services/a/services-standards-requirements-744 · https://www.airbnb.com/help/article/1451
- Seguro de responsabilidade: https://www.airbnb.com/help/article/1608
- Cancelamento pelo cliente: https://www.airbnb.com/help/article/1565 · Reembolso: https://www.airbnb.com/help/article/2278 · Cancelamento pelo chef: https://www.airbnb.com/help/article/2039
- Preços e descontos: https://www.airbnb.com/resources/hosting-services/a/controlling-your-pricing-781
- Resultados do Airbnb 2026: https://news.airbnb.com/airbnb-q1-2026-financial-results/ · https://news.airbnb.com/airbnb-q2-2026-financial-results
- Disponibilidade no Brasil: busca em airbnb.com.br/s/<cidade>/services, feita em 27/11/2026
