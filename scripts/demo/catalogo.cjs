// Catálogo de pratos de exemplo (fictício) para os perfis de teste.
// Origem: sc = Santa Catarina · br = Brasil · int = internacional.
// Formato: D(culinária, categoria, nome, descrição, preço de referência por pessoa, emoji, serve como marmita)
const ORIGEM={
  litoral:'sc',acoriana:'sc',alema:'sc',italianasc:'sc',serrana:'sc',
  nordeste:'br',mineira:'br',gaucha:'br',amazonica:'br',classicos:'br',caseira:'br',
  italiana:'int',japonesa:'int',francesa:'int',mexicana:'int',asiatica:'int',arabe:'int',indiana:'int',
  mediterranea:'int',espanhola:'int',peruana:'int',portuguesa:'int',bbq:'int',vegana:'int',fit:'int',confeitaria:'int',drinks:'int'
};
const DISHES=[];
const D=(cuisine,category,name,desc,price,emoji,marmita=0)=>DISHES.push({cuisine,origin:ORIGEM[cuisine],category,name,desc,price,emoji,marmita:!!marmita});
const E='Entradas',P='Pratos Principais',S='Sobremesas',M='Massas',F='Frutos do mar',B='Bebidas & drinks';

/* ---------- Santa Catarina ---------- */
// Litoral e frutos do mar
D('litoral',E,'Casquinha de siri','Siri desfiado e temperado, gratinado na própria casquinha.',34,'🦀');
D('litoral',E,'Ostras gratinadas de Florianópolis','Ostras do cultivo local com parmesão e ervas finas.',58,'🦪');
D('litoral',E,'Bolinho de siri com maionese verde','Massa leve de mandioca, recheio generoso de siri.',32,'🧆');
D('litoral',E,'Pastel de camarão assado','Massa fina e crocante com camarão refogado e catupiry.',29,'🥟');
D('litoral',F,'Sequência de camarão','Camarão frito, empanado e ao alho, com arroz, pirão e salada.',112,'🍤');
D('litoral',F,'Tainha assada na brasa','Tainha recheada com farofa de camarão, assada com ervas.',96,'🐟');
D('litoral',F,'Moqueca catarinense de peixe e camarão','Cozida lentamente com leite de coco, pimentões e coentro.',104,'🍲',1);
D('litoral',F,'Arroz de camarão cremoso','Arroz caldoso com camarões rosa e toque de limão.',88,'🍚',1);
D('litoral',F,'Anchova assada com legumes','Posta de anchova com batatas e legumes assados no forno.',92,'🐟');
D('litoral',F,'Berbigão ao vapor','Berbigão fresco ao vapor com vinho branco, alho e salsa.',74,'🐚');
D('litoral',F,'Lula recheada ao molho de tomate','Lula recheada com arroz e ervas, finalizada no molho rústico.',86,'🦑');
D('litoral',F,'Caldeirada de frutos do mar','Peixe, camarão, lula e mariscos em caldo de tomate e vinho.',108,'🥘');
D('litoral',P,'Peixe frito com pirão e arroz','Filé de peixe frito na hora, pirão de caldo e arroz soltinho.',72,'🍽️',1);
D('litoral',F,'Pirão de peixe com camarão','Pirão cremoso feito com caldo de cabeça de peixe e camarões.',68,'🥣');
// Açoriana
D('acoriana',E,'Bolinho de peixe açoriano','Bolinho com peixe desfiado, batata e salsinha, frito na hora.',28,'🧆');
D('acoriana',P,'Cuscuz de peixe catarinense','Cuscuz de farinha de milho com peixe, ovos e azeitonas.',66,'🍲',1);
D('acoriana',P,'Sopa de feijão com costelinha','Feijão cozido devagar com costelinha defumada e legumes.',54,'🥣',1);
D('acoriana',S,'Bijajica de tapioca','Doce típico de Florianópolis, crocante por fora e macio por dentro.',20,'🍪');
D('acoriana',S,'Bolo de aipim cremoso','Bolo úmido de aipim com coco, servido morno.',22,'🍰');
// Alemã do Vale do Itajaí
D('alema',P,'Eisbein com chucrute','Joelho de porco cozido e dourado, com chucrute e purê de batata.',98,'🍖');
D('alema',P,'Marreco recheado com repolho roxo','Marreco assado com recheio de maçã, servido com repolho roxo.',118,'🍗');
D('alema',P,'Kassler com chucrute e purê','Lombo defumado assado, chucrute e purê de batata cremoso.',84,'🥩',1);
D('alema',P,'Salsichão blumenauense com batata rústica','Salsichão grelhado, mostarda artesanal e batatas assadas.',68,'🌭',1);
D('alema',E,'Sopa de batata à moda alemã','Caldo cremoso de batata com bacon crocante e cebolinha.',32,'🥣');
D('alema',E,'Salada alemã de batata','Batata, pepino em conserva e bacon com molho morno de mostarda.',28,'🥗');
D('alema',E,'Bolinho de batata crocante','Panquecas finas de batata ralada, com creme azedo e ervas.',30,'🥔');
D('alema',S,'Apfelstrudel','Massa folhada fina recheada com maçã, canela e passas.',30,'🥧');
D('alema',S,'Cuca de banana com farofa doce','Massa macia, banana e cobertura crocante de farofa doce.',24,'🍰');
D('alema',S,'Torta Floresta Negra','Chocolate, cerejas e creme de leite, camada por camada.',34,'🎂');
// Italiana do sul catarinense
D('italianasc',P,'Galeto assado com polenta frita','Galeto temperado na brasa e polenta crocante com radicci.',76,'🍗',1);
D('italianasc',E,'Polenta brustolada com queijo','Polenta tostada na chapa com queijo derretido e salame.',30,'🧀');
D('italianasc',E,'Sopa de capeletti','Caldo de galinha caseiro com capeletti recheados.',36,'🍜',1);
D('italianasc',P,'Risoto de radicci com bacon','Arroz arbóreo, radicci refogado, bacon e parmesão.',70,'🍚');
D('italianasc',M,'Massa caseira ao sugo de galinha','Massa fresca de ovos com molho de tomate e galinha caipira.',68,'🍝',1);
D('italianasc',S,'Sagu de vinho tinto','Sagu cozido em vinho com cravo e canela, creme de baunilha.',22,'🍮');
// Serrana
D('serrana',E,'Sopa de pinhão com linguiça','Creme de pinhão com linguiça defumada e salsinha.',34,'🥣');
D('serrana',P,'Costela de fogo de chão','Costela assada por horas ao calor da brasa, com mandioca.',92,'🍖');
D('serrana',P,'Entrevero serrano','Carnes variadas, pinhão, cebola e pimentões salteados.',78,'🥘',1);
D('serrana',P,'Escondidinho de pinhão com carne seca','Purê de pinhão sobre carne seca desfiada, gratinado.',66,'🥧',1);
D('serrana',E,'Queijo serrano grelhado com geleia de pimenta','Queijo curado grelhado, finalizado com geleia da casa.',36,'🧀');
D('serrana',S,'Maçã assada com canela e sorvete','Maçã de São Joaquim assada lentamente, com sorvete de creme.',26,'🍎');
D('serrana',S,'Paçoca de pinhão','Doce rústico de pinhão com amendoim, servido em porções.',20,'🌰');

/* ---------- Brasil ---------- */
// Nordeste e Bahia
D('nordeste',P,'Moqueca baiana','Peixe com leite de coco, dendê e pimentões, arroz e pirão.',96,'🍲',1);
D('nordeste',P,'Baião de dois com queijo coalho','Arroz, feijão-de-corda, queijo coalho e carne de sol.',62,'🍚',1);
D('nordeste',P,'Carne de sol com macaxeira e manteiga de garrafa','Carne de sol na chapa com macaxeira cozida e vinagrete.',78,'🥩',1);
D('nordeste',P,'Bobó de camarão','Creme de aipim com camarões, dendê e leite de coco.',92,'🍤');
D('nordeste',E,'Bolinho de feijão-fradinho com vatapá','Acarajé crocante com vatapá cremoso e camarão seco.',34,'🧆');
D('nordeste',E,'Tapioca recheada','Tapioca crocante com queijo coalho e carne de sol.',22,'🫓');
D('nordeste',P,'Escondidinho de carne seca','Purê de macaxeira sobre carne seca desfiada, gratinado.',64,'🥧',1);
D('nordeste',S,'Cocada cremosa','Cocada mole de forno com raspas de limão.',18,'🥥');
D('nordeste',S,'Cartola','Banana frita com queijo derretido, açúcar e canela.',20,'🍌');
// Mineira
D('mineira',P,'Feijão tropeiro','Feijão com torresmo, linguiça, farinha e couve, ovo frito.',58,'🫘',1);
D('mineira',P,'Frango com quiabo e angu','Frango caipira refogado com quiabo, servido com angu.',60,'🍗',1);
D('mineira',P,'Vaca atolada','Costela cozida com mandioca em caldo encorpado.',74,'🥘',1);
D('mineira',P,'Tutu de feijão com couve e linguiça','Tutu cremoso, couve refogada, linguiça e torresmo.',56,'🫘',1);
D('mineira',E,'Pão de queijo recheado','Pão de queijo quentinho recheado com goiabada ou linguiça.',24,'🧀');
D('mineira',E,'Torresmo crocante com mandioca','Torresmo pururuca e mandioca frita com molho de pimenta.',26,'🥓');
D('mineira',S,'Romeu e Julieta tostado','Queijo minas tostado com goiabada cascão e canela.',20,'🧀');
D('mineira',S,'Doce de leite de panela com queijo fresco','Doce de leite cremoso, queijo fresco e farofa de amendoim.',22,'🍮');
// Gaúcha e churrasco
D('gaucha',P,'Costela de fogo de chão com mandioca','Costela com sal grosso, assada lentamente na brasa.',92,'🍖');
D('gaucha',P,'Picanha na brasa com farofa e vinagrete','Picanha no ponto desejado, farofa crocante e vinagrete.',108,'🥩');
D('gaucha',P,'Arroz carreteiro','Arroz com charque, bacon e temperos, com ovo.',54,'🍚',1);
D('gaucha',P,'Churrasco misto','Cortes bovinos, suínos e linguiça, com farofa e salada.',98,'🍖');
D('gaucha',E,'Pão de alho na brasa','Pão artesanal com manteiga de alho e ervas, tostado.',18,'🥖');
D('gaucha',E,'Maionese de batata','Receita de família com batata, cenoura e ervilha.',16,'🥔');
D('gaucha',P,'Fraldinha com molho chimichurri','Fraldinha grelhada, chimichurri e batatas bolinha.',88,'🥩');
// Amazônica
D('amazonica',P,'Pato no tucupi','Pato cozido em tucupi com jambu e arroz branco.',112,'🍲');
D('amazonica',E,'Tacacá','Caldo de tucupi com goma, camarão seco e jambu.',34,'🍜');
D('amazonica',P,'Pirarucu com crosta de castanha','Pirarucu grelhado, crosta de castanha-do-pará e purê de banana.',118,'🐟');
D('amazonica',P,'Tambaqui assado na brasa','Costela de tambaqui assada com vinagrete e farofa de ovo.',102,'🐟');
D('amazonica',P,'Maniçoba','Folhas de mandioca cozidas por dias com carnes defumadas.',68,'🥘',1);
D('amazonica',S,'Creme de cupuaçu','Mousse de cupuaçu com crocante de castanha.',26,'🍨');
D('amazonica',S,'Açaí cremoso com granola','Açaí batido na hora, banana, granola e mel.',24,'🍇');
// Clássicos do Brasil
D('classicos',P,'Feijoada completa','Feijão preto com carnes selecionadas, couve, farofa e laranja.',86,'🫘',1);
D('classicos',P,'Estrogonofe de carne com batata palha','Cubos de filé ao molho cremoso, arroz e batata palha.',68,'🍛',1);
D('classicos',P,'Bife à parmegiana','Bife empanado, molho de tomate e queijo gratinado, arroz e fritas.',72,'🥩',1);
D('classicos',P,'Galinhada com pequi','Arroz e frango caipira cozidos juntos, com pequi e cheiro-verde.',58,'🍗',1);
D('classicos',P,'Camarão na moranga','Camarões ao creme servidos dentro da moranga assada.',118,'🎃');
D('classicos',E,'Pamonha salgada de forno','Pamonha cremosa de milho verde com queijo.',22,'🌽');
D('classicos',S,'Pudim de leite condensado','O clássico: textura lisa, sem furinhos, calda de caramelo.',22,'🍮');
D('classicos',S,'Quindim','Gemas, coco e açúcar, brilhante e cremoso.',20,'🍮');
D('classicos',S,'Mousse de maracujá','Maracujá fresco, creme de leite e calda da fruta.',20,'🍨');
D('classicos',S,'Bolo de cenoura com brigadeiro','Cenoura macia e cobertura de brigadeiro de panela.',22,'🍰');
// Caseira (marmita do dia a dia)
D('caseira',P,'Bife acebolado com arroz, feijão e salada','Prato feito completo, temperado como em casa.',34,'🍽️',1);
D('caseira',P,'Frango assado com purê de batata','Coxa e sobrecoxa assadas com ervas, purê cremoso e legumes.',34,'🍗',1);
D('caseira',P,'Carne de panela com legumes','Acém macio cozido devagar com batata, cenoura e mandioca.',36,'🥘',1);
D('caseira',P,'Macarrão ao molho de tomate fresco com frango','Penne, molho caseiro e frango desfiado, com salada.',32,'🍝',1);
D('caseira',P,'Strogonoff de frango com arroz e batata palha','Receita tradicional e cremosa, acompanhada de arroz branco.',34,'🍛',1);
D('caseira',P,'Almôndegas ao sugo com purê de abóbora','Almôndegas macias no molho de tomate e purê de abóbora.',35,'🍝',1);
D('caseira',P,'Feijão, arroz, farofa e linguiça acebolada','Combinação caseira para o dia a dia, bem servida.',30,'🫘',1);
D('caseira',E,'Sopa de legumes com frango','Caldo leve com legumes da estação e frango desfiado.',24,'🥣',1);

/* ---------- Internacional ---------- */
// Italiana
D('italiana',E,'Bruschetta de tomate e manjericão','Pão italiano tostado, tomates frescos e azeite.',26,'🍅');
D('italiana',E,'Carpaccio de carne com rúcula e parmesão','Lâminas finas de filé, alcaparras, limão e parmesão.',44,'🥩');
D('italiana',E,'Focaccia de alecrim e flor de sal','Pão aerado e crocante, azeite e alecrim fresco.',22,'🍞');
D('italiana',M,'Lasanha à bolonhesa','Camadas de massa fresca, ragù e molho branco gratinado.',72,'🍝',1);
D('italiana',M,'Nhoque de batata ao sugo','Nhoque macio com molho de tomate fresco e manjericão.',64,'🍝',1);
D('italiana',M,'Ravioli de ricota e espinafre','Massa recheada com manteiga de sálvia e nozes.',70,'🍝');
D('italiana',M,'Fettuccine Alfredo','Fettuccine fresco com molho cremoso de parmesão.',66,'🍝');
D('italiana',M,'Spaghetti alla carbonara','Gema, pecorino, guanciale e pimenta-do-reino.',68,'🍝');
D('italiana',M,'Penne ao pesto com tomates assados','Pesto de manjericão, pinoli e tomates caramelizados.',58,'🍝',1);
D('italiana',P,'Risoto de funghi','Arroz arbóreo com cogumelos variados e parmesão.',76,'🍚');
D('italiana',P,'Risoto de limão siciliano','Cremoso e leve, finalizado com raspas de limão.',72,'🍚');
D('italiana',P,'Osso buco com polenta cremosa','Ossobuco cozido lentamente com vinho e legumes.',104,'🍖');
D('italiana',P,'Saltimbocca alla romana','Vitela com presunto cru e sálvia ao vinho branco.',94,'🥩');
D('italiana',P,'Parmigiana di melanzane','Berinjela grelhada, molho de tomate e mussarela gratinada.',62,'🍆',1);
D('italiana',S,'Tiramisù clássico','Café, mascarpone e cacau, sem pressa.',32,'🍰');
D('italiana',S,'Panna cotta com calda de frutas vermelhas','Creme de baunilha suave e calda ácida.',28,'🍮');
D('italiana',S,'Cannoli de ricota e gotas de chocolate','Massa crocante e recheio cremoso.',26,'🥐');
// Japonesa
D('japonesa',E,'Gyoza de legumes e porco','Dourados na hora, molho ponzu.',34,'🥟');
D('japonesa',E,'Sashimi de salmão','Cortes frescos servidos com shoyu e wasabi.',58,'🍣');
D('japonesa',E,'Tempurá de legumes e camarão','Massa leve e crocante, molho tentsuyu.',46,'🍤');
D('japonesa',E,'Missoshiru','Caldo de missô com tofu, algas e cebolinha.',18,'🥣');
D('japonesa',P,'Temaki bar','Salmão, atum, kani e vegetais para montar à mesa.',86,'🍣');
D('japonesa',P,'Yakisoba da casa','Legumes, frango e shoyu levemente adocicado.',58,'🍜',1);
D('japonesa',P,'Ramen de porco com ovo marinado','Caldo longo, noodles, chashu e ovo shoyu.',72,'🍜');
D('japonesa',P,'Katsudon','Porco empanado e ovo sobre arroz japonês, molho dashi.',62,'🍱',1);
D('japonesa',P,'Frango teriyaki com arroz japonês','Frango grelhado, molho teriyaki e legumes no vapor.',56,'🍱',1);
D('japonesa',S,'Mochi sortido','Matcha, morango e feijão doce.',26,'🍡');
D('japonesa',S,'Dorayaki de doce de leite','Panquecas macias recheadas, servidas mornas.',22,'🥞');
// Francesa
D('francesa',E,'Sopa de cebola gratinada','Cebola caramelizada, caldo de carne e queijo gruyère.',36,'🥣');
D('francesa',E,'Quiche lorraine','Massa quebradiça com bacon, ovos e creme.',32,'🥧');
D('francesa',P,'Boeuf bourguignon','Carne cozida em vinho tinto com cogumelos e cebolas.',96,'🥘',1);
D('francesa',P,'Coq au vin','Frango em vinho tinto, bacon, cogumelos e batatas.',88,'🍗',1);
D('francesa',P,'Magret de pato com redução de laranja','Pato tostado, redução cítrica e purê de mandioquinha.',118,'🍗');
D('francesa',P,'Salmão en papillote','Salmão assado no papel com legumes e ervas.',90,'🐟');
D('francesa',P,'Ratatouille','Legumes assados em camadas com molho de tomate.',52,'🍆',1);
D('francesa',P,'Gratin dauphinois','Batatas cremosas, noz-moscada e gruyère gratinado.',38,'🥔');
D('francesa',S,'Crème brûlée de baunilha','Creme sedoso com fina crosta de açúcar queimado.',32,'🍮');
D('francesa',S,'Tarte tatin','Maçã caramelizada, massa folhada e sorvete de creme.',30,'🥧');
D('francesa',S,'Profiteroles com chocolate quente','Bolinhos de massa choux, creme e calda de chocolate.',34,'🍩');
// Mexicana
D('mexicana',E,'Guacamole com totopos','Abacate amassado na hora, limão, coentro e pimenta.',28,'🥑');
D('mexicana',E,'Quesadilla de queijo e cogumelos','Tortilla dourada com queijo derretido e cogumelos.',30,'🌮');
D('mexicana',P,'Tacos al pastor','Porco marinado em achiote, abacaxi e coentro.',58,'🌮');
D('mexicana',P,'Burrito de frango','Tortilla recheada com frango, arroz, feijão e guacamole.',54,'🌯',1);
D('mexicana',P,'Enchiladas verdes','Tortillas recheadas com frango e molho de tomatillo.',62,'🌯',1);
D('mexicana',P,'Chili con carne','Carne, feijão e pimentas cozidos lentamente.',56,'🌶️',1);
D('mexicana',P,'Pozole rojo','Caldo de milho com porco, pimenta e rabanete.',60,'🍲');
D('mexicana',S,'Churros com doce de leite','Crocantes por fora, macios por dentro.',24,'🥖');
// Asiática (tailandesa, chinesa, coreana)
D('asiatica',E,'Rolinhos primavera','Legumes e frango crocantes, molho agridoce.',28,'🥟');
D('asiatica',E,'Tom yum de camarão','Caldo picante e perfumado com capim-limão.',44,'🍜');
D('asiatica',P,'Pad thai de camarão','Noodles de arroz, camarão, amendoim e limão.',66,'🍜');
D('asiatica',P,'Curry verde tailandês de frango','Leite de coco, manjericão tailandês e pimenta.',64,'🍛',1);
D('asiatica',P,'Frango xadrez com arroz','Frango, castanhas, pimentões e molho shoyu.',54,'🍛',1);
D('asiatica',P,'Bibimbap','Arroz, legumes salteados, carne e ovo com gochujang.',60,'🍚',1);
D('asiatica',P,'Bulgogi de carne com arroz','Carne marinada em pera e shoyu, grelhada na chapa.',72,'🥩');
D('asiatica',S,'Manga com arroz glutinoso','Arroz com leite de coco e manga madura.',26,'🥭');
// Árabe e libanesa
D('arabe',E,'Homus com pão sírio','Grão-de-bico, tahine, limão e azeite.',24,'🧆');
D('arabe',E,'Tabule','Trigo, salsa, tomate, hortelã e limão.',20,'🥗');
D('arabe',E,'Quibe assado recheado','Carne moída com trigo e recheio de queijo.',30,'🧆');
D('arabe',E,'Esfiha aberta de carne','Massa macia com carne temperada e limão.',22,'🥟');
D('arabe',P,'Kafta grelhada com arroz de lentilha','Carne moída temperada e mujaddara.',58,'🍢',1);
D('arabe',P,'Shawarma de frango no prato','Frango marinado, molho de alho e picles.',54,'🥙',1);
D('arabe',P,'Cordeiro com arroz de amêndoas','Paleta de cordeiro assada e arroz com especiarias.',102,'🍖');
D('arabe',S,'Baklava de pistache','Camadas de massa filo, castanhas e calda de mel.',28,'🍯');
// Indiana
D('indiana',E,'Samosa de legumes','Massa crocante recheada com batata e ervilha.',24,'🥟');
D('indiana',P,'Frango tikka masala','Frango marinado em iogurte, molho cremoso de tomate.',68,'🍛',1);
D('indiana',P,'Chana masala','Grão-de-bico com tomate, gengibre e especiarias.',52,'🍛',1);
D('indiana',P,'Dal de lentilhas','Lentilhas cremosas com cominho e coentro.',44,'🥣',1);
D('indiana',P,'Biryani de cordeiro','Arroz basmati com cordeiro e açafrão.',92,'🍚');
D('indiana',P,'Naan na chapa','Pão indiano macio, com manteiga e alho.',16,'🫓');
D('indiana',S,'Kheer de cardamomo','Arroz-doce indiano com leite, cardamomo e pistache.',22,'🍚');
// Mediterrânea e grega
D('mediterranea',E,'Salada grega','Tomate, pepino, azeitonas, queijo feta e orégano.',28,'🥗');
D('mediterranea',E,'Tzatziki com pão pita','Iogurte, pepino, alho e hortelã.',22,'🥙');
D('mediterranea',P,'Moussaka','Camadas de berinjela, carne e molho bechamel gratinado.',72,'🍆',1);
D('mediterranea',P,'Souvlaki de frango','Espetos marinados com limão e orégano, batatas.',56,'🍢');
D('mediterranea',P,'Polvo grelhado com batatas','Polvo macio, batatas ao murro e azeite de ervas.',108,'🐙');
D('mediterranea',P,'Falafel com salada','Bolinho de grão-de-bico crocante e salada fresca.',44,'🧆');
D('mediterranea',P,'Cordeiro assado com ervas','Paleta assada lentamente, batatas e legumes.',98,'🍖');
// Espanhola
D('espanhola',E,'Patatas bravas','Batatas crocantes com molho picante e alioli.',26,'🥔');
D('espanhola',E,'Tábua de jamón e queijos curados','Seleção de curados, azeitonas e pão de fermentação natural.',64,'🧀');
D('espanhola',E,'Gazpacho andaluz','Sopa fria de tomate, pimentão e pepino.',26,'🥣');
D('espanhola',P,'Paella valenciana','Arroz com frango, coelho, feijão-verde e açafrão.',96,'🥘');
D('espanhola',P,'Paella de frutos do mar','Arroz com camarão, mariscos, lula e açafrão.',112,'🥘');
D('espanhola',P,'Tortilla espanhola','Omelete grossa de batata e cebola, com pimentões.',40,'🍳',1);
D('espanhola',S,'Crema catalana','Creme de leite com canela e casquinha caramelizada.',28,'🍮');
// Peruana
D('peruana',E,'Ceviche clássico','Peixe branco, limão, cebola roxa, milho e batata-doce.',52,'🐟');
D('peruana',E,'Causa limeña de frango','Purê de batata amarela, abacate e frango.',34,'🥑');
D('peruana',E,'Tiradito de peixe','Fatias finas de peixe com leche de tigre e pimenta.',56,'🍣');
D('peruana',P,'Lomo saltado','Tiras de filé salteadas com cebola, tomate e batatas fritas.',72,'🥩',1);
D('peruana',P,'Arroz chaufa','Arroz frito à peruana com frango, ovos e cebolinha.',52,'🍚',1);
D('peruana',S,'Picarones com calda de chancaca','Roscas fritas de abóbora e batata-doce.',24,'🍩');
// Portuguesa
D('portuguesa',E,'Bolinho de bacalhau','Bolinho crocante de bacalhau, batata e salsa.',32,'🧆');
D('portuguesa',E,'Caldo verde','Purê de batata, couve fatiada e rodelas de chouriço.',28,'🥣');
D('portuguesa',P,'Bacalhau à Gomes de Sá','Lascas de bacalhau, batatas, cebola e ovos cozidos.',102,'🐟',1);
D('portuguesa',P,'Bacalhau com natas','Bacalhau gratinado com batatas e creme de leite.',98,'🐟');
D('portuguesa',P,'Arroz de pato','Arroz cozido no caldo do pato com chouriço.',84,'🍚',1);
D('portuguesa',P,'Polvo à lagareiro','Polvo assado com batatas e muito azeite.',112,'🐙');
D('portuguesa',S,'Pastel de nata','Massa folhada, creme de ovos e canela.',16,'🥧');
// Americana e BBQ
D('bbq',P,'Costelinha barbecue com coleslaw','Costelinha de porco macia, molho barbecue e salada de repolho.',84,'🍖');
D('bbq',P,'Pulled pork no pão brioche','Porco desfiado por 10 horas, picles e molho defumado.',62,'🍔');
D('bbq',P,'Hambúrguer artesanal da casa','Blend de carnes, cheddar, cebola caramelizada e batatas.',58,'🍔');
D('bbq',P,'Mac and cheese gratinado','Macarrão com molho de queijos e crosta crocante.',46,'🧀',1);
D('bbq',E,'Asinhas de frango defumadas','Marinadas e glaceadas com molho picante.',34,'🍗');
D('bbq',S,'Cheesecake de frutas vermelhas','Base crocante, creme suave e geleia da casa.',32,'🍰');
D('bbq',S,'Brownie quente com sorvete','Chocolate intenso, casquinha crocante e sorvete de creme.',28,'🍫');
// Vegana e vegetariana
D('vegana',E,'Carpaccio de beterraba com pistache','Beterraba assada, cítricos, rúcula e pistache.',30,'🥗');
D('vegana',E,'Hummus de beterraba com crudités','Pasta de grão-de-bico e beterraba, legumes crocantes.',24,'🥕');
D('vegana',P,'Curry de grão-de-bico e leite de coco','Especiarias, espinafre e arroz basmati.',54,'🍛',1);
D('vegana',P,'Hambúrguer de lentilha e beterraba','Blend de lentilha, pão artesanal e maionese vegana.',46,'🍔');
D('vegana',P,'Moqueca de palmito pupunha','Leite de coco, pimentões e coentro, arroz e farofa.',58,'🍲',1);
D('vegana',P,'Risoto de abóbora com cogumelos','Cremoso sem laticínios, com ervas e castanhas.',60,'🍚');
D('vegana',P,'Lasanha de berinjela e castanhas','Camadas de berinjela, molho de tomate e creme de castanhas.',62,'🍆',1);
D('vegana',P,'Feijoada vegana','Feijão preto com cogumelos, linguiça vegetal e couve.',58,'🫘',1);
D('vegana',P,'Strogonoff de cogumelos','Cogumelos, molho cremoso de castanhas e batata palha.',56,'🍄',1);
D('vegana',P,'Tacos de jaca com abacate','Jaca desfiada em temperos defumados, cebola roxa e limão.',46,'🌮');
D('vegana',P,'Salada de quinoa com legumes assados','Quinoa, grão-de-bico, abóbora assada e molho de tahine.',42,'🥗',1);
D('vegana',S,'Brigadeiro vegano trufado','Cacau 70% e leite de coco.',22,'🍫');
D('vegana',S,'Mousse de cacau com abacate','Cremosa, intensa e sem laticínios.',22,'🥑');
D('vegana',S,'Bolo de cenoura vegano','Macio e úmido, com cobertura de chocolate.',20,'🍰');
// Fit (marmitas saudáveis)
D('fit',P,'Frango grelhado com batata-doce e brócolis','Peito grelhado, batata-doce assada e brócolis no vapor.',32,'🍗',1);
D('fit',P,'Tilápia com purê de mandioquinha e legumes','Tilápia grelhada com ervas e legumes salteados.',34,'🐟',1);
D('fit',P,'Carne moída com abobrinha e arroz integral','Carne magra com legumes e arroz integral.',30,'🥘',1);
D('fit',P,'Strogonoff fit com arroz de couve-flor','Creme leve de iogurte, frango e cogumelos.',33,'🍛',1);
D('fit',P,'Escondidinho fit de frango com batata-doce','Purê de batata-doce sobre frango desfiado e gratinado leve.',32,'🥧',1);
D('fit',P,'Salmão com quinoa e aspargos','Salmão assado com limão, quinoa e aspargos.',46,'🐟',1);
D('fit',P,'Panqueca de espinafre com ricota','Panquecas integrais com recheio de ricota e molho de tomate.',29,'🥞',1);
D('fit',P,'Omelete de forno com legumes','Ovos, legumes e queijo branco assados, com salada.',26,'🍳',1);
D('fit',P,'Bowl de grão-de-bico com legumes assados','Grão-de-bico, legumes assados e molho de iogurte.',30,'🥗',1);
D('fit',P,'Feijoada light com couve e arroz integral','Versão leve com carnes magras e muita couve.',34,'🫘',1);
D('fit',E,'Caldo de abóbora com gengibre','Cremoso e sem creme de leite, com gengibre fresco.',20,'🥣',1);
D('fit',S,'Mousse de chocolate com abacate e cacau','Doce leve, sem açúcar refinado.',18,'🍫');

/* ---------- Confeitaria ---------- */
D('confeitaria',S,'Pavlova com frutas frescas','Merengue crocante, creme chantilly e frutas da estação.',34,'🍓');
D('confeitaria',S,'Torta de limão siciliano','Massa amanteigada, creme cítrico e merengue maçaricado.',28,'🥧');
D('confeitaria',S,'Éclair de baunilha','Massa choux recheada com creme e cobertura de chocolate.',24,'🥐');
D('confeitaria',S,'Bolo de pote de ninho com morango','Camadas de bolo, creme de leite ninho e geleia.',20,'🍰');
D('confeitaria',S,'Tábua de doces finos','Brigadeiros gourmet, trufas e bem-casados variados.',42,'🍬');
D('confeitaria',S,'Torta de nozes com sorvete','Massa crocante, recheio de nozes e caramelo.',30,'🥧');
D('confeitaria',S,'Macarons sortidos','Seis sabores, recheios cremosos e casca delicada.',38,'🍪');
D('confeitaria',S,'Cheesecake de goiabada','Creme de queijo com calda de goiabada cascão.',30,'🍰');

/* ---------- Bebidas e drinks ---------- */
D('drinks',B,'Caipirinha de frutas da estação','Cachaça artesanal, frutas frescas e gelo.',28,'🍹');
D('drinks',B,'Gin tônica com especiarias','Gin, tônica, zimbro, limão siciliano e especiarias.',34,'🍸');
D('drinks',B,'Drink de maracujá com gengibre','Maracujá, gengibre e espumante.',30,'🍹');
D('drinks',B,'Spritz de laranja','Aperol, espumante e rodela de laranja.',32,'🍹');
D('drinks',B,'Limonada suíça','Limão, leite condensado e gelo, refrescante.',16,'🥤');
D('drinks',B,'Quentão catarinense','Cachaça, gengibre, cravo e canela, servido quente.',20,'☕');
D('drinks',B,'Vinho quente com especiarias','Vinho tinto com laranja, canela e cravo.',24,'🍷');
D('drinks',B,'Suco verde detox','Couve, maçã, limão e gengibre.',14,'🥤');
D('drinks',B,'Sangria de vinho tinto','Vinho, frutas picadas e um toque de canela.',26,'🍷');

module.exports={DISHES,ORIGEM};
