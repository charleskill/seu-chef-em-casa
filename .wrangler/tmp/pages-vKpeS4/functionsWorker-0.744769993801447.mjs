var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e3) {
    throw err = [e3], e3;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e3) {
    throw mod = 0, e3;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../assets/app-core.js
var require_app_core = __commonJS({
  "../assets/app-core.js"(exports, module) {
    init_functionsRoutes_0_6006401703432819();
    (function(root) {
      "use strict";
      const norm = /* @__PURE__ */ __name((v) => String(v || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(), "norm");
      const email = /* @__PURE__ */ __name((v) => String(v || "").trim().toLowerCase(), "email");
      const ADMIN_EMAIL = "carlosmendes.ricci@gmail.com";
      const isAdminEmail = /* @__PURE__ */ __name((value) => email(value) === ADMIN_EMAIL, "isAdminEmail");
      const validEmail = /* @__PURE__ */ __name((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim()), "validEmail");
      function safeUrl(value, image = false) {
        const v = String(value || "").trim();
        if (image && /^data:image\/(jpeg|png|webp|gif);base64,[a-z\d+/=\s]+$/i.test(v)) return v;
        if (image && /^\/api\/foto\/[a-f\d]{32}$/.test(v)) return v;
        if (image && /^\/assets\/apresentacao\/[a-z0-9-]+\.webp$/.test(v)) return v;
        if (image && /^\/assets\/capa\/[a-z0-9-]+\.webp$/.test(v)) return v;
        try {
          const u = new URL(v);
          return ["http:", "https:"].includes(u.protocol) ? u.href : "";
        } catch {
          return "";
        }
      }
      __name(safeUrl, "safeUrl");
      function phone(value) {
        const v = String(value || "").trim();
        if (!/^[+\d\s().-]+$/.test(v)) return "";
        let n = v.replace(/\D/g, "");
        if (n.startsWith("55") && n.length > 11) n = n.slice(2);
        return /^[1-9]\d{9,10}$/.test(n) ? "55" + n : "";
      }
      __name(phone, "phone");
      function parsePrice(value) {
        if (typeof value === "number") return Number.isFinite(value) && value >= 0 ? value : NaN;
        const s = String(value ?? "").trim().replace(/^R\$\s*/, "");
        if (/^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$/.test(s)) return Number(s.replace(/\./g, "").replace(",", "."));
        if (/^\d+\.\d{1,2}$/.test(s)) return Number(s);
        return NaN;
      }
      __name(parsePrice, "parsePrice");
      function validateProfile(p, others = []) {
        if (String(p.name || "").trim().length < 2) return "Informe um nome com pelo menos 2 caracteres.";
        if (!validEmail(p.email)) return "Confira o e-mail informado.";
        if (others.some((c) => c.id !== p.id && email(c.email) === email(p.email))) return "Este e-mail j\xE1 est\xE1 cadastrado.";
        if (p.whatsapp && !phone(p.whatsapp)) return "Informe um WhatsApp v\xE1lido com DDD.";
        if (p.instagram) {
          try {
            const u = new URL(p.instagram);
            if (u.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(u.hostname)) throw 0;
          } catch {
            return "Use um link https://instagram.com/seu.perfil.";
          }
        }
        return "";
      }
      __name(validateProfile, "validateProfile");
      const FREQ = { semanal: { label: "Semanal", perMonth: 4 }, quinzenal: { label: "Quinzenal", perMonth: 2 }, mensal: { label: "Mensal", perMonth: 1 } };
      const MODOS = { entrega: "Entrega das marmitas prontas", casa: "Preparo na minha casa" };
      const DIAS2 = [["seg", "Seg"], ["ter", "Ter"], ["qua", "Qua"], ["qui", "Qui"], ["sex", "Sex"], ["sab", "S\xE1b"], ["dom", "Dom"]];
      const money2 = /* @__PURE__ */ __name((n) => Math.round(n * 100) / 100, "money2");
      const brl = /* @__PURE__ */ __name((n) => Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), "brl");
      function cleanKits(k) {
        if (!Array.isArray(k)) return [];
        return k.map((x2) => {
          if (!x2 || typeof x2 !== "object") return null;
          const name = String(x2.name || "").trim().slice(0, 60), items = {};
          Object.entries(x2.items && typeof x2.items === "object" ? x2.items : {}).forEach(([id, q]) => {
            const n = Math.floor(Number(q));
            if (id && n >= 1 && n <= 500) items[String(id)] = n;
          });
          return name && Object.keys(items).length ? { id: String(x2.id || name).slice(0, 40), name, items } : null;
        }).filter(Boolean).slice(0, 6);
      }
      __name(cleanKits, "cleanKits");
      function cleanMarmita(m) {
        if (!m || typeof m !== "object") return null;
        const price = Number(m.price), min = Math.floor(Number(m.min));
        const freq = (Array.isArray(m.freq) ? m.freq : []).filter((f) => FREQ[f]).filter((f, i, a) => a.indexOf(f) === i);
        const modes = (Array.isArray(m.modes) ? m.modes : []).filter((f) => MODOS[f]).filter((f, i, a) => a.indexOf(f) === i);
        if (!(price > 0 && price <= 1e3) || !(min >= 1 && min <= 500) || !freq.length || !modes.length) return null;
        const kits = cleanKits(m.kits);
        return kits.length ? { price: money2(price), min, freq, modes, kits } : { price: money2(price), min, freq, modes };
      }
      __name(cleanMarmita, "cleanMarmita");
      function validateMarmita(m) {
        if (!Number.isFinite(m.price) || m.price <= 0 || m.price > 1e3) return "Informe o pre\xE7o por marmita, de R$ 0,01 a R$ 1.000,00.";
        if (!Number.isInteger(m.min) || m.min < 1 || m.min > 500) return "Informe o m\xEDnimo de marmitas por entrega, de 1 a 500.";
        if (!(m.freq || []).length) return "Escolha ao menos uma frequ\xEAncia de entrega.";
        if (!(m.modes || []).length) return "Escolha ao menos uma forma de atendimento.";
        return "";
      }
      __name(validateMarmita, "validateMarmita");
      function marmitaEstimate(m, chef) {
        const cfg = chef && chef.marmita, f = FREQ[m && m.freq];
        const unit = Number(cfg && cfg.price), qty = Math.floor(Number(m && m.qty)), months = Math.floor(Number(m && m.months));
        if (!f || !(unit > 0) || !(qty >= 1) || !(months >= 1)) return null;
        const monthly = money2(unit * qty * f.perMonth);
        return { unit, qty, deliveries: f.perMonth, monthly, months, total: money2(monthly * months), units: qty * f.perMonth * months };
      }
      __name(marmitaEstimate, "marmitaEstimate");
      const isTransientDemo = /* @__PURE__ */ __name((c) => c && c.isDemo === true && c.id !== "demo-workspace", "isTransientDemo");
      function withDemo(data, demo) {
        const keep = (data.chefs || []).filter((c) => !isTransientDemo(c));
        const add = (Array.isArray(demo) ? demo : []).filter((c) => c && typeof c.id === "string" && typeof c.name === "string").map((c) => ({ ...c, isDemo: true }));
        return { ...data, chefs: [...keep, ...normalizeData({ chefs: add }, add).chefs] };
      }
      __name(withDemo, "withDemo");
      function stripDemo(data) {
        return { ...data, chefs: (data.chefs || []).filter((c) => !isTransientDemo(c)) };
      }
      __name(stripDemo, "stripDemo");
      const TEMPORARIOS = new Set("10minutemail.com 10minutemail.net 10minemail.com 20minutemail.com 33mail.com mailinator.com mailinator.net mailinator2.com guerrillamail.com guerrillamail.net guerrillamail.org guerrillamail.biz guerrillamail.de guerrillamailblock.com sharklasers.com grr.la pokemail.net spam4.me yopmail.com yopmail.net yopmail.fr cool.fr.nf jetable.fr.nf courriel.fr.nf moncourrier.fr.nf monemail.fr.nf monmail.fr.nf tempmail.com temp-mail.org temp-mail.io tempmail.net tempmail.dev tempmail.plus tempmailo.com tempr.email tempinbox.com tempmailaddress.com throwawaymail.com trashmail.com trashmail.net trashmail.de trashmail.io trash-mail.com wegwerfmail.de wegwerfemail.de dispostable.com discard.email discardmail.com maildrop.cc mailnesia.com mailcatch.com mintemail.com mohmal.com getnada.com nada.email getairmail.com fakeinbox.com fakemail.net emailondeck.com mytemp.email mytrashmail.com spamgourmet.com spambox.us spamex.com mailpoof.com burnermail.io inboxkitten.com emailfake.com emailtemporanea.com emailtemporario.com.br email-temporario.com.br tempail.com 1secmail.com 1secmail.net 1secmail.org esiix.com wwjmp.com dropmail.me 10mail.org emltmp.com minutemail.com harakirimail.com mail.tm mail.gw tmpmail.org tmpmail.net tmails.net luxusmail.org owlymail.com moakt.com tmail.ws byom.de anonbox.net crazymailing.com mailtemp.net instaddr.com chacuo.net linshiyouxiang.net".split(" "));
      const emailTemporario = /* @__PURE__ */ __name((v) => {
        const d = String(v || "").trim().toLowerCase().split("@")[1] || "";
        return [...TEMPORARIOS].some((t) => d === t || d.endsWith("." + t));
      }, "emailTemporario");
      const faltaPerfil = /* @__PURE__ */ __name((c) => {
        const f = [];
        if (!String(c && c.whatsapp || "").trim()) f.push("whatsapp");
        if (c && c.tipo === "cliente") return f;
        if (!(c && (c.avatar || (c.gallery || []).length))) f.push("foto");
        if (!(c && (c.dishes || []).length)) f.push("prato");
        if (!String(c && c.cities || "").trim()) f.push("cidade");
        return f;
      }, "faltaPerfil");
      const OPCOES = [
        ["criancas", "Atendo eventos com crian\xE7as", "Quem n\xE3o marcar n\xE3o ver\xE1 o campo de crian\xE7as no pedido.", true],
        ["compras", "Fa\xE7o as compras dos ingredientes", "O cliente poder\xE1 pedir esse servi\xE7o no or\xE7amento.", true],
        ["limpeza", "Deixo a cozinha limpa ao final", "O cliente poder\xE1 pedir a limpeza no or\xE7amento.", true],
        ["utensilios", "Levo meus utens\xEDlios e equipamentos", "Aparece no seu perfil como diferencial.", true],
        ["garcom", "Ofere\xE7o servi\xE7o de mesa (gar\xE7om)", "Aparece no seu perfil como diferencial.", false],
        ["equipe", "Tenho equipe de apoio (gar\xE7ons, ajudantes e copeiros)", 'Aparece no seu perfil e no filtro "Com equipe". Voc\xEA combina e paga a sua equipe.', false],
        ["grupos", "Atendo grupos grandes (mais de 20 pessoas)", "Aparece no seu perfil como diferencial.", false],
        ["corporativo", "Atendo eventos corporativos e empresas", "Aparece no seu perfil e no filtro corporativo.", false],
        ["nota_fiscal", "Emito Nota Fiscal (PJ / MEI)", "Aparece no seu perfil como diferencial para empresas.", false],
        ["fds", "Atendo fins de semana e feriados", "Aparece no seu perfil.", true],
        ["viagem", "Atendo outras cidades (com taxa de deslocamento)", "Aparece no seu perfil.", false],
        ["r_gluten", "Cozinho sem gl\xFAten", "Mostra a op\xE7\xE3o no pedido do cliente.", true],
        ["r_lactose", "Cozinho sem lactose", "Mostra a op\xE7\xE3o no pedido do cliente.", true],
        ["r_vegetariano", "Cozinho pratos vegetarianos", "Mostra a op\xE7\xE3o no pedido do cliente.", true],
        ["r_vegano", "Cozinho pratos veganos", "Mostra a op\xE7\xE3o no pedido do cliente.", true],
        ["r_mar", "Cuido de alergia a frutos do mar", "Mostra a op\xE7\xE3o no pedido do cliente.", true],
        ["x_lanche", "Fa\xE7o Noite do Lanche", "Voc\xEA aparece nesta experi\xEAncia, na aba Servi\xE7os.", false],
        ["x_pizza", "Fa\xE7o Noite da Pizza", "Voc\xEA aparece nesta experi\xEAncia, na aba Servi\xE7os.", false],
        ["x_lounge", "Fa\xE7o Lounge (petiscos e drinks)", "Voc\xEA aparece nesta experi\xEAncia, na aba Servi\xE7os.", false],
        ["x_tematico", "Fa\xE7o card\xE1pio tem\xE1tico", "Voc\xEA aparece nesta experi\xEAncia, na aba Servi\xE7os.", false],
        ["x_boteco", "Fa\xE7o Noite do Boteco", "Voc\xEA aparece nesta experi\xEAncia, na aba Servi\xE7os.", false],
        ["x_churrasco", "Fa\xE7o churrasco em casa", "Voc\xEA aparece nesta experi\xEAncia, na aba Servi\xE7os.", false],
        ["x_mar", "Fa\xE7o sequ\xEAncia de frutos do mar", "Voc\xEA aparece nesta experi\xEAncia, na aba Servi\xE7os.", false],
        ["x_tainha", "Fa\xE7o Noite da Tainha", "Voc\xEA aparece nesta experi\xEAncia, na aba Servi\xE7os.", false],
        ["x_fondue", "Fa\xE7o Noite do Fondue", "Voc\xEA aparece nesta experi\xEAncia, na aba Servi\xE7os.", false],
        ["x_aula", "Dou aula de cozinha em casa", "Voc\xEA aparece nesta experi\xEAncia, na aba Servi\xE7os.", false]
      ];
      const EXPERIENCIAS = [
        ["Brunch em casa", "Uma manh\xE3 sem pressa, com receitas doces e salgadas.", "x_brunch", "cup"],
        ["Caf\xE9 da manh\xE3 especial", "Comece o dia com uma mesa preparada com carinho.", "x_cafe", "cup"],
        ["Noite de Massas", "Massas e molhos preparados para o seu encontro.", "x_massas", "menu"],
        ["Festival de Risotos", "Receitas cremosas e combina\xE7\xF5es para compartilhar.", "x_risotos", "bowl"],
        ["Noite Japonesa", "Sushis e sabores japoneses preparados na sua casa.", "x_japonesa", "bowl"],
        ["Cozinha Italiana", "Cl\xE1ssicos italianos em um menu cheio de afeto.", "x_italiana", "menu"],
        ["Cozinha Francesa", "T\xE9cnica e delicadeza em um jantar especial.", "x_francesa", "cloche"],
        ["Cozinha Mediterr\xE2nea", "Azeite, vegetais e sabores frescos \xE0 mesa.", "x_mediterranea", "leaf"],
        ["Noite Mexicana", "Tacos, guacamole e sabores para uma noite animada.", "x_mexicana", "bowl"],
        ["Noite \xC1rabe", "Pastas, especiarias e receitas para dividir.", "x_arabe", "bowl"],
        ["Cozinha Indiana", "Aromas de especiarias em um menu cheio de personalidade.", "x_indiana", "bowl"],
        ["Cozinha Nordestina", "Receitas e ingredientes que celebram o Nordeste.", "x_nordestina", "cloche"],
        ["Feijoada em casa", "Um cl\xE1ssico brasileiro para reunir a turma.", "x_feijoada", "bowl"],
        ["Menu Vegetariano", "Vegetais como protagonistas de uma refei\xE7\xE3o especial.", "x_vegetariano", "leaf"],
        ["Menu Vegano", "Uma experi\xEAncia criativa com ingredientes de origem vegetal.", "x_vegano", "leaf"],
        ["Menu Degusta\xE7\xE3o", "Uma sequ\xEAncia de pequenas cria\xE7\xF5es do chef.", "x_degustacao", "cloche"],
        ["Jantar harmonizado", "Pratos e bebidas combinados com o chef.", "x_harmonizado", "wine"],
        ["Tapas e petiscos", "Pequenas por\xE7\xF5es e grandes conversas \xE0 mesa.", "x_tapas", "menu"],
        ["Confeitaria em casa", "Bolos e sobremesas preparados para a sua ocasi\xE3o.", "x_confeitaria", "cake"],
        ["Ch\xE1 da tarde", "Ch\xE1s, quitutes e uma pausa gostosa para receber.", "x_cha", "cup"],
        ["Paella em casa", "Arroz, frutos do mar e uma receita para compartilhar.", "x_paella", "bowl"],
        ["Ceviches e sabores peruanos", "Frescor, c\xEDtricos e combina\xE7\xF5es da cozinha peruana.", "x_peruana", "bowl"],
        ["Cozinha Tailandesa", "Curries e ervas arom\xE1ticas em um menu vibrante.", "x_tailandesa", "bowl"],
        ["Cozinha Coreana", "Sabores fermentados e receitas para uma mesa generosa.", "x_coreana", "bowl"],
        ["Noite do Nhoque", "Nhoques delicados com os molhos da sua prefer\xEAncia.", "x_nhoque", "menu"],
        ["Festival de Crepes", "Recheios doces e salgados preparados na hora.", "x_crepes", "menu"],
        ["Queijos e t\xE1buas artesanais", "Queijos, frutas e acompanhamentos para receber bem.", "x_queijos", "wine"],
        ["Sopas e caldos", "Receitas aconchegantes para noites mais frescas.", "x_sopas", "bowl"],
        ["P\xE3es artesanais", "Uma experi\xEAncia com massas, fermenta\xE7\xE3o e p\xE3o fresco.", "x_paes", "cup"],
        ["Saladas gourmet", "Folhas, gr\xE3os e molhos em combina\xE7\xF5es cheias de sabor.", "x_saladas", "leaf"],
        ["Peixes grelhados", "Peixes e acompanhamentos com preparo delicado.", "x_peixes", "cloche"],
        ["Carnes nobres", "Cortes selecionados, ponto e acompanhamentos a combinar.", "x_carnes", "cloche"],
        ["Costela de preparo lento", "Carne macia e sabores que pedem tempo e cuidado.", "x_costela", "cloche"],
        ["Moqueca \xE0 mesa", "Peixe, temperos e o aroma de uma boa moqueca.", "x_moqueca", "bowl"],
        ["Caf\xE9 colonial", "P\xE3es, bolos e quitutes para uma mesa farta.", "x_colonial", "cup"],
        ["Piquenique especial", "Um card\xE1pio pensado para aproveitar ao ar livre.", "x_piquenique", "cup"],
        ["Finger food para receber", "Pequenas cria\xE7\xF5es para encontros e recep\xE7\xF5es.", "x_fingerfood", "menu"],
        ["Cozinha Grega", "Frescor, azeite e receitas inspiradas na Gr\xE9cia.", "x_grega", "leaf"],
        ["Noite do L\xE1men", "Caldo arom\xE1tico, macarr\xE3o e acompanhamentos \xE0 sua escolha.", "x_lamen", "bowl"],
        ["Pokes e bowls", "Tigelas coloridas, ingredientes frescos e combina\xE7\xF5es leves.", "x_poke", "bowl"]
      ];
      EXPERIENCIAS.forEach(([nome, , key]) => OPCOES.push([key, "Ofere\xE7o " + nome, "Voc\xEA aparece nesta experi\xEAncia, na aba Servi\xE7os.", false]));
      const RESTR = { "Sem gl\xFAten": "r_gluten", "Sem lactose": "r_lactose", "Vegetariano": "r_vegetariano", "Vegano": "r_vegano", "Alergia a frutos do mar": "r_mar" };
      const opcoes = /* @__PURE__ */ __name((c) => {
        const o = c && c.opcoes && typeof c.opcoes === "object" ? c.opcoes : {};
        const r = {};
        OPCOES.forEach(([k, , , d]) => {
          r[k] = typeof o[k] === "boolean" ? o[k] : d;
        });
        return r;
      }, "opcoes");
      const cleanOpcoes = /* @__PURE__ */ __name((o) => {
        if (!o || typeof o !== "object") return null;
        const r = {};
        OPCOES.forEach(([k]) => {
          if (typeof o[k] === "boolean") r[k] = o[k];
        });
        return Object.keys(r).length ? r : null;
      }, "cleanOpcoes");
      const cleanAgenda = /* @__PURE__ */ __name((a) => {
        if (!a || !Array.isArray(a.off)) return null;
        const off = [...new Set(a.off.filter((d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort().slice(-400);
        return off.length ? { off } : null;
      }, "cleanAgenda");
      const isFree = /* @__PURE__ */ __name((c, date) => !date || !(c && c.agenda && Array.isArray(c.agenda.off) && c.agenda.off.includes(date)), "isFree");
      const mapsUrl = /* @__PURE__ */ __name((q) => {
        q = String(q || "").trim();
        return q ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q) : "";
      }, "mapsUrl");
      function normalizeData(data, seed) {
        const source = Array.isArray(data?.chefs) ? data.chefs : seed;
        const chefs = source.filter((c) => c && typeof c.id === "string" && typeof c.name === "string").map((c) => ({
          ...c,
          isDemo: c.isDemo ?? seed.some((s) => s.id === c.id),
          gallery: (Array.isArray(c.gallery) ? c.gallery : []).filter((p) => p && p.id != null && typeof p.url === "string"),
          dishes: (Array.isArray(c.dishes) ? c.dishes : []).filter((d) => d && d.id != null && typeof d.name === "string").map((d) => {
            const x2 = { ...d, price: Number.isFinite(Number(d.price)) && Number(d.price) >= 0 ? Number(d.price) : 0 };
            if (x2.marmita !== true) delete x2.marmita;
            return x2;
          })
        })).map((c) => {
          const m = cleanMarmita(c.marmita);
          if (m) c.marmita = m;
          else delete c.marmita;
          const op = cleanOpcoes(c.opcoes);
          if (op) c.opcoes = op;
          else delete c.opcoes;
          const ag = cleanAgenda(c.agenda);
          if (ag) c.agenda = ag;
          else delete c.agenda;
          return c;
        });
        return { version: 4, chefs, messages: (Array.isArray(data?.messages) ? data.messages : []).filter((m) => m && typeof m.chefId === "string" && typeof m.text === "string"), orders: Array.isArray(data?.orders) ? data.orders : [], name: String(data?.name || ""), visitorId: typeof data?.visitorId === "string" ? data.visitorId : "", draft: data?.draft && typeof data.draft === "object" ? data.draft : null };
      }
      __name(normalizeData, "normalizeData");
      function readData(storage, seed) {
        const current = storage.getItem("scf4_store");
        if (current) return normalizeData(JSON.parse(current), seed);
        const chefs = storage.getItem("scf3_db"), messages = storage.getItem("scf3_msgs");
        return normalizeData({ chefs: chefs ? JSON.parse(chefs) : seed, messages: messages ? JSON.parse(messages) : [], name: storage.getItem("scf3_name") || "" }, seed);
      }
      __name(readData, "readData");
      function persist(storage, data) {
        storage.setItem("scf4_store", JSON.stringify(data));
      }
      __name(persist, "persist");
      function buildMarmitaText(c, o) {
        const f = o.f, m = o.m || {}, e3 = marmitaEstimate(m, c), mix = m.mix && typeof m.mix === "object" ? m.mix : {}, pr = c.dishes.filter((d) => o.dishes.includes(d.id)).map((d) => "- " + (mix[String(d.id)] ? mix[String(d.id)] + "x " : "") + d.name).join("\n");
        const dias = DIAS2.filter(([k]) => (m.days || []).includes(k)).map((x2) => x2[1]).join(", ");
        const meses = m.months === 1 ? "1 m\xEAs" : m.months + " meses";
        return `*PEDIDO DE OR\xC7AMENTO \u2014 ${c.name}*
*Plano de marmitas*

Cliente: ${f.name.trim()}
Telefone: ${f.phone.trim()}${f.email ? "\nE-mail: " + f.email.trim() : ""}
In\xEDcio desejado: ${f.date ? f.date.split("-").reverse().join("/") : "A combinar"}
Local: ${f.local || "A combinar"}${f.local && f.local.trim() ? "\nMapa: " + mapsUrl(f.local) : ""}
Pessoas atendidas: ${o.adults} adultos e ${o.kids} crian\xE7as
Frequ\xEAncia: ${(FREQ[m.freq] || {}).label || "A combinar"}
Marmitas por entrega: ${m.qty}
Dura\xE7\xE3o do plano: ${meses}
Forma de atendimento: ${MODOS[m.way] || "A combinar"}
Dias preferidos: ${dias || "A combinar"}
Servi\xE7os solicitados: ${[o.shop ? "Compras dos ingredientes" : "", o.clean ? "Limpeza ao final" : ""].filter(Boolean).join(", ") || "A combinar"}
Restri\xE7\xF5es e prefer\xEAncias: ${o.chips.concat(f.allergies ? [f.allergies] : []).join(", ") || "Nenhuma informada"}

${Object.keys(mix).length ? "Marmitas escolhidas por entrega" : "Pratos de interesse"}:
${pr}

${e3 ? `Estimativa de refer\xEAncia: ${brl(e3.monthly)} por m\xEAs (${e3.qty * e3.deliveries} marmitas \xD7 ${brl(e3.unit)})${e3.months > 1 ? "; plano de " + meses + ": " + brl(e3.total) : ""}.
` : ""}Valores, servi\xE7os e disponibilidade a confirmar com o chef.
Seu Chef em Casa`;
      }
      __name(buildMarmitaText, "buildMarmitaText");
      function buildOrderText(c, o) {
        if (o.mode === "marmita" && c.marmita) return buildMarmitaText(c, o);
        const f = o.f, pr = c.dishes.filter((d) => o.dishes.includes(d.id)).map((d) => "- " + d.name).join("\n");
        return `*PEDIDO DE OR\xC7AMENTO \u2014 ${c.name}*

Cliente: ${f.name.trim()}
Telefone: ${f.phone.trim()}${f.email ? "\nE-mail: " + f.email.trim() : ""}${f.company ? "\nEmpresa: " + f.company.trim() : ""}${f.nf ? "\nPrecisa de Nota Fiscal: Sim" : ""}${f.equipe ? "\nPrecisa de equipe de apoio: Sim" : ""}
Data: ${f.date ? f.date.split("-").reverse().join("/") : "A combinar"}
Evento: ${f.type || "Jantar a dois"}
Local: ${f.local || "A combinar"}${f.local && f.local.trim() ? "\nMapa: " + mapsUrl(f.local) : ""}
Convidados: ${o.adults} adultos e ${o.kids} crian\xE7as
Servi\xE7os solicitados: ${[o.shop ? "Compras dos ingredientes" : "", o.clean ? "Limpeza ao final" : ""].filter(Boolean).join(", ") || "A combinar"}
Restri\xE7\xF5es e prefer\xEAncias: ${o.chips.concat(f.allergies ? [f.allergies] : []).join(", ") || "Nenhuma informada"}

Pratos:
${pr}

Valores, servi\xE7os e disponibilidade a confirmar com o chef.
Seu Chef em Casa`;
      }
      __name(buildOrderText, "buildOrderText");
      const hex3 = /* @__PURE__ */ __name((bytes) => Array.from(new Uint8Array(bytes), (x2) => x2.toString(16).padStart(2, "0")).join(""), "hex");
      async function passwordRecord(password, cryptoApi) {
        const c = cryptoApi || root.crypto;
        if (!c?.subtle) throw new Error("Abra a vers\xE3o HTTPS para criar sua conta local.");
        const salt = c.getRandomValues(new Uint8Array(16)), iterations = 21e4;
        const key = await c.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
        return { algorithm: "PBKDF2-SHA256", iterations, salt: hex3(salt), hash: hex3(await c.subtle.deriveBits({ name: "PBKDF2", salt, iterations, hash: "SHA-256" }, key, 256)) };
      }
      __name(passwordRecord, "passwordRecord");
      async function verifyPassword(password, account, cryptoApi) {
        const c = cryptoApi || root.crypto, record = account.credential;
        if (record) {
          if (record.algorithm !== "PBKDF2-SHA256" || !Number.isInteger(record.iterations) || record.iterations < 1e5 || record.iterations > 1e6 || !/^[\da-f]{32}$/.test(record.salt)) return false;
          if (!c?.subtle) throw new Error("Abra a vers\xE3o HTTPS para entrar.");
          const key = await c.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
          const salt = Uint8Array.from(record.salt.match(/../g), (x2) => parseInt(x2, 16));
          return record.hash === hex3(await c.subtle.deriveBits({ name: "PBKDF2", salt, iterations: record.iterations, hash: "SHA-256" }, key, 256));
        }
        if (!account.pass) return false;
        if (/^x\d+$/.test(account.pass)) {
          let h = 5381, t = account.id + ":" + password;
          for (let i = 0; i < t.length; i++) h = (h << 5) + h + t.charCodeAt(i) >>> 0;
          return account.pass === "x" + h;
        }
        if (!/^[a-f\d]{64}$/i.test(account.pass) || !c?.subtle) return false;
        return account.pass === hex3(await c.subtle.digest("SHA-256", new TextEncoder().encode(account.id + ":" + password)));
      }
      __name(verifyPassword, "verifyPassword");
      const slug = /* @__PURE__ */ __name((v) => norm(v).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, ""), "slug");
      const slugChef = /* @__PURE__ */ __name((nome, id) => {
        const h = (String(id || "").match(/^chef-([a-f\d]{6})/) || [])[1] || "";
        return h ? (slug(nome) || "chef") + "-" + h : "";
      }, "slugChef");
      const idDoSlug = /* @__PURE__ */ __name((s) => (String(s || "").match(/-([a-f\d]{6})$/) || [])[1] || "", "idDoSlug");
      const api = { slug, slugChef, idDoSlug, faltaPerfil, emailTemporario, norm, email, isAdminEmail, validEmail, safeUrl, phone, parsePrice, validateProfile, normalizeData, readData, persist, buildOrderText, passwordRecord, verifyPassword, FREQ, MODOS, DIAS: DIAS2, cleanMarmita, validateMarmita, marmitaEstimate, withDemo, stripDemo, OPCOES, EXPERIENCIAS, RESTR, opcoes, cleanOpcoes, mapsUrl, cleanAgenda, isFree, cleanKits };
      if (typeof module !== "undefined" && module.exports) module.exports = api;
      else root.ChefCore = api;
    })(typeof window !== "undefined" ? window : globalThis);
  }
});

// _lib/vitrine.js
function indisponivel(origem) {
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>' + e(PADRAO.titulo) + '</title><meta property="og:title" content="' + e(PADRAO.titulo) + '"><meta property="og:description" content="' + e(PADRAO.desc) + '"><meta property="og:image" content="' + e(PADRAO.imagem) + '"><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f6f3eb;color:#303629;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:24px;text-align:center}h1{font-family:' + SERIFA + ';font-weight:400;font-size:1.8rem;margin:0 0 10px}p{margin:0 0 24px;color:#56635a}a{display:inline-block;padding:13px 26px;border-radius:999px;background:#754653;color:#fff;text-decoration:none;font-weight:600}</style></head><body><main><h1>Este perfil n\xE3o est\xE1 dispon\xEDvel</h1><p>O chef pode ter pausado a p\xE1gina ou o endere\xE7o mudou.</p><a href="' + e(origem + "/#/buscar") + '">Conhecer outros chefs</a></main></body></html>';
  return new Response(html, { status: 404, headers: { ...CABECALHOS, "cache-control": "no-store" } });
}
function vitrine(p, { origem, id, esteLink, extra = {} }) {
  const exemplo = p === EXEMPLO;
  const perfil = exemplo ? origem + "/#/buscar" : origem + "/#/chef/" + encodeURIComponent(id);
  const pedido = exemplo ? origem + "/#/buscar" : origem + "/#/pedido/" + encodeURIComponent(id);
  const galeria = (Array.isArray(p.gallery) ? p.gallery : []).map((g) => ({ url: fotoOk(g && g.url, origem), legenda: String(g && g.caption || "").trim() })).filter((g) => g.url);
  const avatar = fotoOk(p.avatar, origem);
  const capa = galeria[0] && galeria[0].url || avatar;
  const fone = C.phone(p.whatsapp);
  const zap = fone ? "https://wa.me/" + fone + "?text=" + encodeURIComponent("Ol\xE1, " + p.name + "! Vi sua p\xE1gina no Seu Chef em Casa e gostaria de conversar sobre um encontro.") : "";
  const primeiroNome = String(p.name).trim().split(/\s+/)[0];
  const linha = [p.specialty, p.cities].map((s) => String(s || "").trim()).filter(Boolean).join(" \xB7 ");
  const titulo = p.name + " \xB7 Personal chef";
  const desc = (linha ? linha + ". " : "") + "Veja o card\xE1pio e pe\xE7a seu or\xE7amento.";
  const pratos = (Array.isArray(p.dishes) ? p.dishes : []).filter((d) => d && d.name).map((d, i) => ({ d, i, o: ORDEM.indexOf(d.category) < 0 ? 99 : ORDEM.indexOf(d.category) })).sort((a, b) => a.o - b.o || a.i - b.i).map((x2) => x2.d);
  const mostra = pratos.slice(0, 8);
  const prato = /* @__PURE__ */ __name((d) => '<article class="prato">' + (d.category ? "<small>" + e(d.category) + "</small>" : "") + "<h3>" + e(d.name) + "</h3>" + (d.desc ? "<p>" + e(d.desc) + "</p>" : "") + (Number(d.price) > 0 ? "<span>Refer\xEAncia: " + e(dinheiro(d.price)) + " por pessoa</span>" : "") + "</article>", "prato");
  const op = C.opcoes(p);
  const marcadas = C.OPCOES.filter((x2) => op[x2[0]]);
  const trabalho = marcadas.filter((x2) => !x2[0].startsWith("x_")).map((x2) => x2[1]);
  const experiencias = marcadas.filter((x2) => x2[0].startsWith("x_")).map((x2) => x2[1].replace(/^Faço /, ""));
  if (p.marmita) experiencias.push("Marmitas da semana");
  const fotos = galeria.slice(1, 7);
  const botoes = /* @__PURE__ */ __name((claro) => '<div class="acoes"><a class="b b1" href="' + e(pedido) + '">Montar meu or\xE7amento</a>' + (zap ? '<a class="b ' + (claro ? "b2" : "b3") + '" href="' + e(zap) + '" target="_blank" rel="noopener">Conversar no WhatsApp</a>' : "") + "</div>", "botoes");
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(titulo) + '</title><meta name="description" content="' + e(desc) + '"><meta name="theme-color" content="#455238"><meta property="og:type" content="profile"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Seu Chef em Casa"><meta property="og:title" content="' + e(titulo) + '"><meta property="og:description" content="' + e(desc) + '"><meta property="og:image" content="' + e(capa || PADRAO.imagem) + '"><meta property="og:url" content="' + e(esteLink) + '"><meta name="twitter:card" content="summary_large_image"><link rel="canonical" href="' + e(esteLink) + '">' + (exemplo || extra.noindex ? '<meta name="robots" content="noindex">' : "") + (extra.jsonld ? '<script type="application/ld+json">' + JSON.stringify(extra.jsonld).replace(/</g, "\\u003c") + "<\/script>" : "") + "<style>" + ESTILO + '</style></head><body><header class="capa">' + (capa ? '<img src="' + e(capa) + '" alt="">' : "") + '<div class="l topo"><b>' + e(p.name) + '</b><a href="#contato">Pedir or\xE7amento</a></div><div class="l heroi"><p class="olho">Personal chef' + (p.specialty ? " \xB7 " + e(p.specialty) : "") + "</p><h1>" + e(p.name) + '</h1><p class="linha">' + (p.cities ? "Na sua casa, em " + e(p.cities) + "." : "Na sua casa, do seu jeito.") + "</p>" + botoes(true) + "</div></header><main>" + (p.bio || avatar ? '<section><div class="l sobre">' + (avatar ? '<img class="retrato" src="' + e(avatar) + '" alt="Foto de ' + e(p.name) + '" width="132" height="132">' : "<span></span>") + '<div><p class="olho">Sobre</p><h2>Prazer, ' + e(primeiroNome) + ".</h2>" + (paragrafos(p.bio) || "<p>Cozinho na sua casa, com card\xE1pio pensado para o seu encontro.</p>") + "</div></div></section>" : "") + (mostra.length ? '<section><div class="l"><p class="olho">Do card\xE1pio</p><h2>Alguns pratos que eu preparo</h2><div class="pratos">' + mostra.map(prato).join("") + "</div>" + (pratos.length > mostra.length ? '<details class="mais"><summary>Ver os outros ' + (pratos.length - mostra.length) + ' pratos</summary><div class="pratos">' + pratos.slice(mostra.length, 60).map(prato).join("") + "</div></details>" : "") + '<p class="nota">Os valores s\xE3o uma refer\xEAncia; o pre\xE7o final depende do n\xFAmero de pessoas e do que combinarmos. <a href="' + e(perfil) + '">Ver o card\xE1pio completo</a></p></div></section>' : "") + (fotos.length ? '<section><div class="l"><p class="olho">Da minha cozinha</p><h2>Um pouco do que j\xE1 servi</h2><div class="fotos">' + fotos.map((g) => '<figure><img src="' + e(g.url) + '" alt="' + e(g.legenda || "Prato preparado por " + p.name) + '" loading="lazy">' + (g.legenda ? "<figcaption>" + e(g.legenda.slice(0, 90)) + "</figcaption>" : "") + "</figure>").join("") + "</div></div></section>" : "") + (trabalho.length || experiencias.length ? '<section><div class="l"><p class="olho">Como eu trabalho</p><h2>Cuido de tudo para voc\xEA aproveitar</h2>' + (trabalho.length ? '<ul class="lista">' + trabalho.map((t) => "<li>" + e(t) + "</li>").join("") + "</ul>" : "") + (experiencias.length ? '<div class="exp">' + experiencias.map((t) => "<span>" + e(t) + "</span>").join("") + "</div>" : "") + "</div></section>" : "") + '<section><div class="l"><p class="olho">Como funciona</p><h2>Do primeiro contato ao \xFAltimo prato</h2><ol class="passos"><li><b>Escolha os pratos</b><span>Veja o card\xE1pio e marque o que combina com o seu encontro.</span></li><li><b>Conte como ser\xE1</b><span>Data, n\xFAmero de pessoas e o que mais for importante para voc\xEA.</span></li><li><b>Combinamos os detalhes</b><span>O pedido segue pelo WhatsApp e acertamos valores e disponibilidade.</span></li></ol></div></section><section class="final" id="contato"><div class="l"><p class="olho">Vamos conversar</p><h2>Seu pr\xF3ximo encontro come\xE7a aqui.</h2><p>Me conte a ocasi\xE3o e eu preparo uma proposta para a sua mesa.</p>' + botoes(true) + '</div></section></main><footer><div class="l"><p>' + e(p.name) + ' atende pelo <a href="' + e(origem + "/") + '">Seu Chef em Casa</a>.</p>' + ((extra.cidades || []).length ? "<p>Mais chefs em " + extra.cidades.map(([s, n]) => '<a href="' + e(origem + "/personal-chef/" + s) + '">' + e(n) + "</a>").join(", ") + ".</p>" : "") + '<p>A plataforma \xE9 uma vitrine: contrata\xE7\xE3o, pagamento e servi\xE7o s\xE3o combinados direto com o chef. <a href="' + e(origem + "/#/termos") + '">Termos de uso</a></p></div></footer><nav class="barra" aria-label="Contato"><a class="b b1" href="' + e(pedido) + '">Montar or\xE7amento</a>' + (zap ? '<a class="b b3" href="' + e(zap) + '" target="_blank" rel="noopener">WhatsApp</a>' : "") + "</nav></body></html>";
  return new Response(html, { headers: CABECALHOS });
}
var import_app_core, C, PADRAO, e, dinheiro, ORDEM, fotoOk, paragrafos, CABECALHOS, SERIFA, ESTILO, U, EXEMPLO;
var init_vitrine = __esm({
  "_lib/vitrine.js"() {
    init_functionsRoutes_0_6006401703432819();
    import_app_core = __toESM(require_app_core());
    C = import_app_core.default && import_app_core.default.normalizeData ? import_app_core.default : globalThis.ChefCore;
    PADRAO = {
      titulo: "Seu Chef em Casa \xB7 Boa comida, boas hist\xF3rias",
      desc: "Conhe\xE7a personal chefs, explore card\xE1pios e prepare seu pedido de or\xE7amento.",
      imagem: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&h=630&fit=crop&q=80"
    };
    e = /* @__PURE__ */ __name((t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), "e");
    dinheiro = /* @__PURE__ */ __name((n) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), "dinheiro");
    ORDEM = ["Entradas", "Massas", "Frutos do mar", "Pratos Principais", "Sobremesas", "Bebidas & drinks"];
    fotoOk = /* @__PURE__ */ __name((u, origem) => {
      u = String(u || "");
      return /^\/api\/foto\/[a-f\d]{32}$/.test(u) || /^\/assets\/apresentacao\/[a-z0-9-]+\.webp$/.test(u) ? origem + u : /^https:\/\/images\.unsplash\.com\//.test(u) ? u : "";
    }, "fotoOk");
    paragrafos = /* @__PURE__ */ __name((t) => String(t || "").split(/\n\s*\n|\r?\n/).map((s) => s.trim()).filter(Boolean).slice(0, 8).map((s) => "<p>" + e(s) + "</p>").join(""), "paragrafos");
    CABECALHOS = {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "referrer-policy": "strict-origin-when-cross-origin",
      "content-security-policy": "default-src 'none'; img-src 'self' data: https://images.unsplash.com; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
    };
    SERIFA = 'Palatino,"Palatino Linotype",Georgia,serif';
    ESTILO = [
      "*{box-sizing:border-box}html{scroll-behavior:smooth}",
      'body{margin:0;background:#f6f3eb;color:#303629;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}',
      "img{display:block;max-width:100%}a{color:inherit}",
      ".l{width:100%;max-width:1040px;margin:0 auto;padding:0 22px}",
      "h1,h2,h3{font-family:" + SERIFA + ";font-weight:400;margin:0;text-wrap:balance}",
      ".olho{font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;color:#754653;margin:0 0 12px}",
      // Botões
      ".b{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:13px 26px;border-radius:999px;font-weight:600;font-size:.98rem;text-decoration:none;border:1px solid transparent;transition:background .2s,color .2s,border-color .2s}",
      ".b1{background:#754653;color:#fff}.b1:hover{background:#613744}",
      ".b2{background:transparent;color:#fff;border-color:rgba(255,255,255,.7)}.b2:hover{background:#fff;color:#303629}",
      ".b3{background:transparent;color:#455238;border-color:#455238}.b3:hover{background:#455238;color:#fff}",
      ".b:focus-visible{outline:3px solid #e2c48f;outline-offset:3px}",
      ".acoes{display:flex;flex-wrap:wrap;gap:12px}",
      // Capa
      ".capa{position:relative;min-height:88vh;display:flex;flex-direction:column;color:#fff;background:#455238;overflow:hidden}",
      ".capa>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}",
      '.capa::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,20,17,.62) 0%,rgba(15,20,17,.18) 30%,rgba(15,20,17,.55) 62%,rgba(15,20,17,.92) 100%)}',
      ".topo{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:16px;padding-top:22px;padding-bottom:22px}",
      ".topo b{font-family:" + SERIFA + ";font-weight:400;font-size:1.05rem;letter-spacing:.04em}",
      ".topo a{font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;padding:12px 4px;border-bottom:1px solid rgba(255,255,255,.6)}",
      ".heroi{position:relative;z-index:1;margin-top:auto;padding-top:60px;padding-bottom:54px}",
      ".heroi .olho{color:#e2c48f}",
      ".heroi h1{font-size:clamp(2.6rem,9vw,4.6rem);line-height:1.04;letter-spacing:-.01em;margin-bottom:14px}",
      ".heroi .linha{font-size:1.08rem;color:rgba(255,255,255,.88);margin:0 0 30px;max-width:34em}",
      // Seções
      "section{padding:72px 0}section+section{border-top:1px solid rgba(28,37,32,.14)}",
      "h2{font-size:clamp(1.8rem,5vw,2.5rem);line-height:1.15;margin-bottom:26px}",
      ".sobre{display:grid;gap:34px;align-items:start}",
      ".sobre .retrato{width:132px;height:132px;border-radius:50%;object-fit:cover;border:4px solid #fff;box-shadow:0 10px 30px rgba(38,52,44,.18)}",
      ".sobre p{margin:0 0 1em;max-width:38em}.sobre p:first-of-type{font-family:" + SERIFA + ";font-size:1.3rem;line-height:1.5}",
      // Cardápio
      ".pratos{display:grid;gap:0 56px}",
      ".prato{padding:20px 0;border-bottom:1px solid rgba(28,37,32,.16)}",
      ".prato small{display:block;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:#7b857c;margin-bottom:4px}",
      ".prato h3{font-size:1.28rem;line-height:1.3}",
      ".prato p{margin:6px 0 0;color:#56635a;font-size:.96rem}",
      ".prato span{display:block;margin-top:8px;font-size:.88rem;color:#754653;font-weight:600}",
      ".mais{margin-top:18px}.mais summary{cursor:pointer;font-weight:600;color:#455238;padding:12px 0;min-height:44px}",
      ".nota{margin:22px 0 0;font-size:.88rem;color:#6a756c;max-width:44em}",
      // Fotos
      ".fotos{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}",
      ".fotos figure{margin:0;position:relative;aspect-ratio:1;overflow:hidden;border-radius:6px;background:#e4dfd2}",
      ".fotos img{width:100%;height:100%;object-fit:cover}",
      ".fotos figcaption{position:absolute;left:0;right:0;bottom:0;padding:26px 12px 10px;font-size:.82rem;line-height:1.35;color:#fff;background:linear-gradient(180deg,rgba(15,20,17,0),rgba(15,20,17,.78))}",
      // Como trabalho
      ".lista{list-style:none;margin:0;padding:0;display:grid;gap:12px 40px}",
      '.lista li{position:relative;padding-left:28px}.lista li::before{content:"";position:absolute;left:2px;top:.52em;width:12px;height:7px;border-left:2px solid #754653;border-bottom:2px solid #754653;transform:rotate(-45deg)}',
      ".exp{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}.exp span{border:1px solid rgba(28,37,32,.4);border-radius:999px;padding:8px 18px;font-size:.92rem}",
      // Passos
      ".passos{counter-reset:p;list-style:none;margin:0;padding:0;display:grid;gap:30px}",
      '.passos li{counter-increment:p}.passos li::before{content:"0" counter(p);display:block;font-family:' + SERIFA + ";font-size:1.5rem;color:#754653;margin-bottom:6px}",
      ".passos b{display:block;font-family:" + SERIFA + ";font-weight:400;font-size:1.2rem;margin-bottom:4px}.passos span{color:#56635a;font-size:.96rem}",
      // Chamada final e rodapé
      ".final{background:#455238;color:#f3eee4;text-align:center;padding:84px 0;border:0}",
      ".final h2{margin-bottom:12px}.final p{margin:0 auto 30px;color:#c9c3b6;max-width:30em}.final .acoes{justify-content:center}.final .olho{color:#e2c48f}",
      "footer{background:#354229;color:#9aa39b;font-size:.84rem;padding:28px 0 96px;text-align:center}footer p{margin:0 0 6px}footer a{color:#c9c3b6}",
      // Barra fixa no celular
      ".barra{position:fixed;left:0;right:0;bottom:0;z-index:5;display:flex;gap:10px;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:rgba(246,243,236,.96);border-top:1px solid rgba(28,37,32,.18)}",
      ".barra .b{flex:1;min-height:48px;padding:10px 12px;font-size:.92rem}",
      "@media (min-width:760px){body{font-size:18px}.sobre{grid-template-columns:132px 1fr;gap:48px}.pratos{grid-template-columns:1fr 1fr}.fotos{grid-template-columns:repeat(3,1fr);gap:14px}.lista{grid-template-columns:1fr 1fr}.passos{grid-template-columns:repeat(3,1fr);gap:44px}section{padding:96px 0}.barra{display:none}footer{padding-bottom:34px}.heroi{padding-bottom:76px}}",
      "@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.b{transition:none}}",
      "@media print{.barra,.topo a{display:none}.capa{min-height:0}}"
    ].join("");
    U = /* @__PURE__ */ __name((id) => "https://images.unsplash.com/photo-" + id + "?w=1400&q=80&auto=format&fit=crop", "U");
    EXEMPLO = {
      name: "Helena Duarte",
      specialty: "Cozinha italiana",
      cities: "Florian\xF3polis, S\xE3o Jos\xE9, Palho\xE7a",
      whatsapp: "(48) 99110-6355",
      bio: "Cozinho h\xE1 quinze anos e acredito que um bom jantar come\xE7a muito antes do primeiro prato: na escolha dos ingredientes, na conversa sobre a ocasi\xE3o, no cuidado com cada detalhe.\n\nLevo a cozinha at\xE9 a sua casa, preparo tudo na hora e deixo o ambiente pronto para voc\xEA s\xF3 receber quem gosta. (Este \xE9 um perfil de exemplo, com dados fict\xEDcios.)",
      avatar: "",
      gallery: [
        { url: U("1414235077428-338989a2e8c0"), caption: "" },
        { url: U("1476124369491-e7addf5db371"), caption: "" },
        { url: U("1616669944447-d65d41a222bd"), caption: "" },
        { url: U("1464093515883-ec948246accb"), caption: "" },
        { url: U("1544025162-d76694265947"), caption: "" },
        { url: U("1529692236671-f1f6cf9683ba"), caption: "" },
        { url: U("1519708227418-c8fd9a32b7a2"), caption: "" }
      ],
      dishes: [
        { category: "Entradas", name: "Burrata com tomates assados", desc: "Burrata cremosa, tomates confitados, manjeric\xE3o e azeite extravirgem.", price: 38 },
        { category: "Entradas", name: "Carpaccio de carne", desc: "L\xE2minas finas com r\xFAcula, parmes\xE3o e molho de alcaparras.", price: 42 },
        { category: "Massas", name: "Tagliatelle ao ragu de costela", desc: "Massa fresca feita na hora e costela cozida por seis horas.", price: 78 },
        { category: "Massas", name: "Ravi\xF3li de ab\xF3bora", desc: "Na manteiga de s\xE1lvia, com am\xEAndoas tostadas.", price: 72 },
        { category: "Pratos Principais", name: "Risoto de funghi", desc: "Arroz arb\xF3reo, cogumelos frescos e secos, finalizado com parmes\xE3o.", price: 84 },
        { category: "Pratos Principais", name: "Ossobuco \xE0 milanesa", desc: "Cozido lentamente em vinho branco, servido com risoto de a\xE7afr\xE3o.", price: 96 },
        { category: "Sobremesas", name: "Tiramis\xF9", desc: "A receita cl\xE1ssica, montada no dia.", price: 28 },
        { category: "Sobremesas", name: "Panna cotta com frutas vermelhas", desc: "Leve, com calda feita em casa.", price: 26 }
      ],
      opcoes: { garcom: true, x_pizza: true, x_lounge: true }
    };
    __name(indisponivel, "indisponivel");
    __name(vitrine, "vitrine");
  }
});

// _lib/seo.js
async function chefsVisiveis(env) {
  if (!env.DB) return [];
  try {
    return montar((await env.DB.prepare(SQL + " ORDER BY atualizado_em DESC LIMIT 2000").all()).results);
  } catch (err) {
    return [];
  }
}
async function chefPorId(env, id) {
  if (!env.DB || !/^chef-[a-f\d]{16}$/.test(id)) return null;
  try {
    return montar([await env.DB.prepare(SQL + " AND id = ?").bind(id).first()].filter(Boolean))[0] || null;
  } catch (err) {
    return null;
  }
}
async function chefPorSlug(env, slug) {
  const h = C.idDoSlug(slug);
  if (!env.DB || !h) return null;
  try {
    const lista2 = montar((await env.DB.prepare(SQL + " AND id LIKE ?").bind("chef-" + h + "%").all()).results);
    return lista2.find((x2) => x2.slug === slug) || lista2[0] || null;
  } catch (err) {
    return null;
  }
}
function lista(o, origem) {
  const cartoes = o.chefs.map((c) => {
    const foto = fotoOk(c.p.avatar, origem) || fotoOk(((c.p.gallery || [])[0] || {}).url, origem);
    return '<li class="chef"><a href="/chef/' + e(c.slug) + '">' + (foto ? '<img src="' + e(foto) + '" alt="" width="72" height="72" loading="lazy">' : '<span class="sem"></span>') + "<div><h3>" + e(c.p.name) + "</h3><p>" + e([c.p.specialty, c.p.cities].map((s) => String(s || "").trim()).filter(Boolean).join(" \xB7 ")) + "</p><span>Ver card\xE1pio</span></div></a></li>";
  }).join("");
  const trilha = [["In\xEDcio", "/"], ...o.trilha || []];
  const grafo = [
    { "@type": "BreadcrumbList", itemListElement: trilha.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE + u })) },
    ...o.perguntas ? [{ "@type": "FAQPage", mainEntity: o.perguntas.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }] : [],
    ...o.chefs.length ? [{ "@type": "ItemList", itemListElement: o.chefs.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: SITE + "/chef/" + c.slug, name: c.p.name })) }] : []
  ];
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e(o.titulo) + '</title><meta name="description" content="' + e(o.desc) + '"><meta name="theme-color" content="#455238">' + (o.noindex ? '<meta name="robots" content="noindex,follow">' : "") + '<link rel="canonical" href="' + e(SITE + o.url) + '"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Seu Chef em Casa"><meta property="og:title" content="' + e(o.titulo) + '"><meta property="og:description" content="' + e(o.desc) + '"><meta property="og:url" content="' + e(SITE + o.url) + '">' + ld({ "@context": "https://schema.org", "@graph": grafo }) + "<style>" + ESTILO2 + '</style></head><body><header class="topo"><div class="l"><a href="/"><b>Seu Chef em Casa</b></a><nav><a href="/#/buscar">Buscar chefs</a></nav></div></header><main><div class="l"><p class="trilha">' + trilha.map(([n, u], i) => i === trilha.length - 1 ? e(n) : '<a href="' + e(u) + '">' + e(n) + "</a>").join(" / ") + '</p><div class="abre"><p class="olho">' + e(o.olho) + "</p><h1>" + e(o.h1) + "</h1>" + o.intro.map((t) => "<p>" + e(t) + "</p>").join("") + '</div></div><section><div class="l">' + (o.chefs.length ? "<h2>" + e(o.tituloChefs) + '</h2><ul class="chefs">' + cartoes + "</ul>" : '<div class="vazio"><h2>' + e(o.vazio[0]) + "</h2><p>" + e(o.vazio[1]) + '</p><div class="acoes"><a class="b b1" href="/#/entrar">Sou chef e quero aparecer aqui</a><a class="b b2" href="/#/buscar">Ver todos os chefs</a></div></div>') + "</div></section>" + (o.perguntas ? '<section><div class="l"><h2>Perguntas frequentes</h2>' + o.perguntas.map(([q, a]) => "<details><summary>" + e(q) + "</summary><p>" + e(a) + "</p></details>").join("") + "</div></section>" : "") + (o.blocos || []).map(([t, h]) => '<section><div class="l"><h2>' + e(t) + "</h2>" + h + "</div></section>").join("") + '</main><footer><div class="l"><p><a href="/">Seu Chef em Casa</a> \xB7 personal chefs em Santa Catarina</p><p>A plataforma \xE9 uma vitrine: contrata\xE7\xE3o, pagamento e servi\xE7o s\xE3o combinados direto com o chef. <a href="/#/termos">Termos de uso</a></p></div></footer></body></html>';
  return new Response(html, { status: o.status || 200, headers: CABECALHOS2 });
}
function naoAchou() {
  return lista({
    url: "/",
    titulo: "P\xE1gina n\xE3o encontrada \xB7 Seu Chef em Casa",
    desc: "Esta p\xE1gina n\xE3o existe.",
    olho: "Erro 404",
    h1: "Esta p\xE1gina saiu do card\xE1pio.",
    intro: ["O endere\xE7o pode ter mudado. Os chefs continuam na busca."],
    chefs: [],
    vazio: ["Vamos voltar para a cozinha?", "Veja os chefs dispon\xEDveis ou entre como chef."],
    noindex: true,
    status: 404
  }, "");
}
var SITE, producao, SQL, montar, CIDADES, cidadesDe, atende, cidadesDoChef, PROPRIOS, SERVICOS, fazServico, ESTILO2, CABECALHOS2, ld, PERGUNTAS, links;
var init_seo = __esm({
  "_lib/seo.js"() {
    init_functionsRoutes_0_6006401703432819();
    init_vitrine();
    SITE = "https://seuchefemcasa.com.br";
    producao = /* @__PURE__ */ __name((url) => /^(www\.)?seuchefemcasa\.com\.br$/.test(new URL(url).hostname), "producao");
    SQL = "SELECT id, perfil, atualizado_em FROM chefs WHERE publicado = 1 AND COALESCE(oculto, 0) = 0 AND COALESCE(json_extract(perfil, '$.tipo'), 'chef') <> 'cliente' AND COALESCE(email, '') NOT LIKE '%@apresentacao.invalid'";
    montar = /* @__PURE__ */ __name((rows) => (rows || []).map((r) => {
      let p = null;
      try {
        p = JSON.parse(r.perfil || "{}");
      } catch (err) {
        p = null;
      }
      if (!p || !String(p.name || "").trim() || C.faltaPerfil(p).length) return null;
      return { id: r.id, p, slug: C.slugChef(p.name, r.id), atualizado: r.atualizado_em || "" };
    }).filter((x2) => x2 && x2.slug), "montar");
    __name(chefsVisiveis, "chefsVisiveis");
    __name(chefPorId, "chefPorId");
    __name(chefPorSlug, "chefPorSlug");
    CIDADES = [
      ["florianopolis", "Florian\xF3polis"],
      ["sao-jose", "S\xE3o Jos\xE9"],
      ["palhoca", "Palho\xE7a"],
      ["biguacu", "Bigua\xE7u"],
      ["santo-amaro-da-imperatriz", "Santo Amaro da Imperatriz"],
      ["governador-celso-ramos", "Governador Celso Ramos"],
      ["garopaba", "Garopaba"],
      ["balneario-camboriu", "Balne\xE1rio Cambori\xFA"],
      ["itajai", "Itaja\xED"],
      ["itapema", "Itapema"],
      ["bombinhas", "Bombinhas"],
      ["porto-belo", "Porto Belo"],
      ["brusque", "Brusque"],
      ["blumenau", "Blumenau"],
      ["joinville", "Joinville"],
      ["jaragua-do-sul", "Jaragu\xE1 do Sul"],
      ["sao-francisco-do-sul", "S\xE3o Francisco do Sul"],
      ["criciuma", "Crici\xFAma"],
      ["tubarao", "Tubar\xE3o"],
      ["lages", "Lages"],
      ["chapeco", "Chapec\xF3"]
    ];
    cidadesDe = /* @__PURE__ */ __name((p) => String(p.cities || "").split(/[,;/\n]|\s+e\s+/).map((s) => C.slug(s).replace(/-sc$/, "")).filter(Boolean), "cidadesDe");
    atende = /* @__PURE__ */ __name((p, cidade) => cidadesDe(p).includes(cidade), "atende");
    cidadesDoChef = /* @__PURE__ */ __name((p) => CIDADES.filter(([s]) => atende(p, s)), "cidadesDoChef");
    PROPRIOS = {
      x_lanche: ["Noite do Lanche", "Hamb\xFArgueres e lanches montados na hora, na sua cozinha."],
      x_pizza: ["Noite da Pizza", "Massa aberta na hora e pizzas saindo uma atr\xE1s da outra para a turma."],
      x_lounge: ["Lounge de petiscos e drinks", "Petiscos e drinks para receber os convidados em p\xE9, sem mesa posta."],
      x_tematico: ["Card\xE1pio tem\xE1tico", "Um menu montado em torno de um tema: uma viagem, uma data, um filme."],
      x_boteco: ["Noite do Boteco", "Bolinhos, por\xE7\xF5es e tira-gostos de bar servidos em casa."],
      x_churrasco: ["Churrasco em casa", "O chef cuida da brasa e dos cortes enquanto voc\xEA recebe."],
      x_mar: ["Sequ\xEAncia de frutos do mar", "Camar\xE3o, peixe e frutos do mar servidos em etapas."],
      x_tainha: ["Noite da Tainha", "Tainha escalada, recheada ou na brasa, do jeito do litoral catarinense."],
      x_fondue: ["Noite do Fondue", "Fondue de queijo e de chocolate para as noites frias."],
      x_aula: ["Aula de cozinha em casa", "O chef ensina as receitas na sua cozinha, com voc\xEA de avental."]
    };
    SERVICOS = [
      ...Object.entries(PROPRIOS).map(([k, [nome, desc]]) => ({ k, nome, desc })),
      ...C.EXPERIENCIAS.map(([nome, desc, k]) => ({ k, nome, desc })),
      { k: "marmita", nome: "Marmitas da semana", desc: "Refei\xE7\xF5es da semana preparadas pelo chef e porcionadas para a sua geladeira." }
    ].map((s) => ({ ...s, slug: C.slug(s.nome) }));
    fazServico = /* @__PURE__ */ __name((p, s) => s.k === "marmita" ? !!p.marmita : !!C.opcoes(p)[s.k], "fazServico");
    ESTILO2 = [
      '*{box-sizing:border-box}body{margin:0;background:#f6f3eb;color:#303629;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}',
      "a{color:inherit}img{display:block;max-width:100%}.l{max-width:1040px;margin:0 auto;padding:0 22px}",
      "h1,h2,h3{font-family:" + SERIFA + ";font-weight:400;margin:0;text-wrap:balance}",
      ".topo{background:#455238;color:#f3eee4}.topo .l{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:64px}",
      ".topo a{text-decoration:none}.topo b{font-family:" + SERIFA + ";font-weight:400;font-size:1.08rem;letter-spacing:.04em}.topo nav a{font-size:.8rem;letter-spacing:.16em;text-transform:uppercase;padding:12px 2px;border-bottom:1px solid rgba(243,238,228,.6)}",
      ".trilha{font-size:.85rem;color:#6a756c;padding-top:22px}.trilha a{color:#455238}",
      ".abre{padding:26px 0 40px}.olho{font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;color:#754653;margin:0 0 12px}",
      "h1{font-size:clamp(2.1rem,7vw,3.4rem);line-height:1.08;margin-bottom:16px}.abre p{max-width:40em;margin:0 0 12px;color:#4b5648}",
      "section{padding:44px 0;border-top:1px solid rgba(28,37,32,.14)}h2{font-size:clamp(1.6rem,4.5vw,2.1rem);line-height:1.15;margin-bottom:22px}",
      ".chefs{list-style:none;margin:0;padding:0;display:grid;gap:14px}",
      ".chef a{display:grid;grid-template-columns:72px 1fr;gap:16px;align-items:center;padding:14px;border-radius:10px;background:#fff;text-decoration:none;box-shadow:0 1px 2px rgba(38,52,44,.08),0 6px 18px rgba(38,52,44,.06);transition:box-shadow .2s}",
      ".chef a:hover{box-shadow:0 1px 2px rgba(38,52,44,.1),0 10px 26px rgba(38,52,44,.12)}.chef img,.chef .sem{width:72px;height:72px;border-radius:50%;object-fit:cover;background:#e4dfd2}",
      ".chef h3{font-size:1.2rem;line-height:1.25}.chef p{margin:2px 0 0;font-size:.92rem;color:#56635a}.chef span{display:inline-block;margin-top:6px;font-size:.85rem;font-weight:600;color:#754653}",
      ".vazio{background:#fff;border-radius:10px;padding:26px 22px;box-shadow:0 1px 2px rgba(38,52,44,.08)}.vazio p{margin:0 0 18px;max-width:38em}",
      ".acoes{display:flex;flex-wrap:wrap;gap:12px}.b{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 24px;border-radius:999px;font-weight:600;text-decoration:none;border:1px solid #455238}",
      ".b1{background:#754653;border-color:#754653;color:#fff}.b2{color:#455238}.b:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #c9a46a;outline-offset:3px}",
      "details{border-bottom:1px solid rgba(28,37,32,.16)}summary{cursor:pointer;padding:16px 0;font-family:" + SERIFA + ";font-size:1.15rem;min-height:48px}details p{margin:0 0 18px;color:#4b5648;max-width:42em}",
      ".links{display:flex;flex-wrap:wrap;gap:8px}.links a{border:1px solid rgba(28,37,32,.3);border-radius:999px;padding:8px 16px;font-size:.92rem;text-decoration:none}.links a:hover{border-color:#455238;background:#fff}",
      "footer{background:#354229;color:#9aa39b;font-size:.84rem;padding:28px 0;text-align:center}footer p{margin:0 0 6px}footer a{color:#c9c3b6}",
      "@media (min-width:760px){.chefs{grid-template-columns:1fr 1fr}}",
      "@media (prefers-reduced-motion:reduce){.chef a{transition:none}}"
    ].join("");
    CABECALHOS2 = {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
      "referrer-policy": "strict-origin-when-cross-origin",
      "content-security-policy": "default-src 'none'; img-src 'self' data: https://images.unsplash.com; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
    };
    ld = /* @__PURE__ */ __name((o) => '<script type="application/ld+json">' + JSON.stringify(o).replace(/</g, "\\u003c") + "<\/script>", "ld");
    PERGUNTAS = /* @__PURE__ */ __name((lugar) => [
      ["Como contrato um personal chef" + (lugar ? " em " + lugar : "") + "?", "Escolha um chef, veja o card\xE1pio e monte o pedido de or\xE7amento com a data, o n\xFAmero de pessoas e os pratos. O pedido vai para o WhatsApp do chef e voc\xEAs acertam os detalhes direto."],
      ["Quanto custa um personal chef" + (lugar ? " em " + lugar : "") + "?", "Cada chef define o pr\xF3prio pre\xE7o. Os pratos do card\xE1pio trazem um valor de refer\xEAncia por pessoa; o valor final depende do n\xFAmero de convidados, dos ingredientes e do que voc\xEA combinar com o chef."],
      ["O chef faz as compras e limpa a cozinha?", "Depende do chef. O perfil de cada um mostra se ele faz as compras dos ingredientes, leva os pr\xF3prios utens\xEDlios e entrega a cozinha limpa no fim."],
      ["Pago pelo site?", "N\xE3o. O Seu Chef em Casa \xE9 uma vitrine: contrata\xE7\xE3o, pagamento e servi\xE7o s\xE3o combinados direto com o chef."]
    ], "PERGUNTAS");
    __name(lista, "lista");
    links = /* @__PURE__ */ __name((itens) => '<nav class="links">' + itens.map(([n, u]) => '<a href="' + e(u) + '">' + e(n) + "</a>").join("") + "</nav>", "links");
    __name(naoAchou, "naoAchou");
  }
});

// c/[id].js
async function onRequest({ request, env, params }) {
  const url = new URL(request.url), id = String(params.id || "");
  if (id === "exemplo") return vitrine(EXEMPLO, { origem: url.origin, id, esteLink: url.origin + "/c/exemplo" });
  const c = await chefPorId(env, id);
  if (!c) return indisponivel(url.origin);
  return new Response(null, { status: 301, headers: { location: url.origin + "/chef/" + c.slug, "cache-control": "public, max-age=300" } });
}
var init_id = __esm({
  "c/[id].js"() {
    init_functionsRoutes_0_6006401703432819();
    init_vitrine();
    init_seo();
    __name(onRequest, "onRequest");
  }
});

// chef/[slug].js
async function onRequest2({ request, env, params }) {
  const url = new URL(request.url), slug = String(params.slug || "").toLowerCase();
  const c = await chefPorSlug(env, slug);
  if (!c) return indisponivel(url.origin);
  if (c.slug !== String(params.slug || "")) return new Response(null, { status: 301, headers: { location: url.origin + "/chef/" + c.slug, "cache-control": "public, max-age=300" } });
  const p = c.p, canonico = SITE + "/chef/" + c.slug;
  const foto = fotoOk(p.avatar, SITE) || fotoOk(((p.gallery || [])[0] || {}).url, SITE);
  const cidades = String(p.cities || "").split(/[,;/\n]/).map((s) => s.trim()).filter(Boolean);
  const pratos = (Array.isArray(p.dishes) ? p.dishes : []).filter((d) => d && d.name).slice(0, 60);
  const jsonld = { "@context": "https://schema.org", "@graph": [
    {
      "@type": "Person",
      "@id": canonico + "#chef",
      name: p.name,
      jobTitle: "Personal chef",
      url: canonico,
      ...foto ? { image: foto } : {},
      ...p.bio ? { description: String(p.bio).slice(0, 400) } : {},
      ...p.specialty ? { knowsAbout: p.specialty } : {},
      ...cidades.length ? { areaServed: cidades.map((n) => ({ "@type": "City", name: n })) } : {}
    },
    ...pratos.length ? [{ "@type": "Menu", name: "Card\xE1pio de " + p.name, url: canonico, hasMenuItem: pratos.map((d) => ({
      "@type": "MenuItem",
      name: d.name,
      ...d.desc ? { description: d.desc } : {},
      ...Number(d.price) > 0 ? { offers: { "@type": "Offer", price: String(Number(d.price)), priceCurrency: "BRL" } } : {}
    })) }] : [],
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Seu Chef em Casa", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: p.name, item: canonico }
    ] }
  ] };
  return vitrine(p, { origem: url.origin, id: c.id, esteLink: canonico, extra: { jsonld, cidades: cidadesDoChef(p), noindex: !producao(request.url) } });
}
var init_slug = __esm({
  "chef/[slug].js"() {
    init_functionsRoutes_0_6006401703432819();
    init_vitrine();
    init_seo();
    __name(onRequest2, "onRequest");
  }
});

// ../assets/site-settings.js
var require_site_settings = __commonJS({
  "../assets/site-settings.js"(exports, module) {
    init_functionsRoutes_0_6006401703432819();
    (function(root) {
      "use strict";
      const defaults = { heroTitle: "Boa comida. Boas hist\xF3rias.", heroText: "Encontre um personal chef para transformar um encontro em casa em uma experi\xEAncia especial.", heroImage: "/assets/capa/jantar-no-quintal-2.webp", heroCaption: "O cuidado come\xE7a antes do primeiro prato.", ctaTitle: "Seu talento merece uma vitrine.", ctaText: "Organize seu portf\xF3lio e apresente sua cozinha.", contactEmail: "", supportWhatsapp: "", instagram: "https://www.instagram.com/seuchefemcasaoficial/", facebook: "", tiktok: "" };
      const fields = { heroTitle: ["T\xEDtulo da p\xE1gina inicial", 100], heroText: ["Apresenta\xE7\xE3o da p\xE1gina inicial", 400], heroImage: ["Endere\xE7o da imagem de capa (Unsplash)", 500], heroCaption: ["Legenda da capa", 160], ctaTitle: ["T\xEDtulo do convite aos chefs", 120], ctaText: ["Texto do convite aos chefs", 300], contactEmail: ["E-mail de contato", 160], supportWhatsapp: ["WhatsApp de suporte com DDD", 30], instagram: ["Link do Instagram", 300], facebook: ["Link do Facebook", 300], tiktok: ["Link do TikTok", 300] };
      function clean(input) {
        const out = {};
        for (const [key, [label, max]] of Object.entries(fields)) {
          const v = String(input?.[key] ?? defaults[key]).trim();
          if (v.length > max) throw new Error(label + ": texto longo demais.");
          if (["heroTitle", "heroText", "heroImage", "ctaTitle"].includes(key) && !v) throw new Error("Preencha " + label.toLowerCase() + ".");
          if (key === "contactEmail" && v && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v)) throw new Error("Confira o e-mail de contato.");
          if (key === "supportWhatsapp" && v && !/^(?:55)?[1-9]\d{9,10}$/.test(v.replace(/\D/g, ""))) throw new Error("Confira o WhatsApp de suporte com DDD.");
          if (["heroImage", "instagram", "facebook", "tiktok"].includes(key) && v && !(key === "heroImage" && v === defaults.heroImage)) {
            let u;
            try {
              u = new URL(v);
            } catch {
              throw new Error(label + ": informe um endere\xE7o completo com https://.");
            }
            const allowed = { heroImage: ["images.unsplash.com"], instagram: ["instagram.com", "www.instagram.com"], facebook: ["facebook.com", "www.facebook.com"], tiktok: ["tiktok.com", "www.tiktok.com"] };
            if (u.protocol !== "https:" || u.username || u.password || !allowed[key].includes(u.hostname)) throw new Error(label + ": dom\xEDnio n\xE3o permitido.");
          }
          out[key] = v;
        }
        return out;
      }
      __name(clean, "clean");
      const api = { defaults, fields, clean };
      if (typeof module !== "undefined" && module.exports) module.exports = api;
      else root.ChefSite = api;
    })(typeof window !== "undefined" ? window : globalThis);
  }
});

// ../assets/dashboard-core.js
var require_dashboard_core = __commonJS({
  "../assets/dashboard-core.js"(exports, module) {
    init_functionsRoutes_0_6006401703432819();
    (function(root) {
      "use strict";
      const DAY = 864e5;
      const iso = /* @__PURE__ */ __name((d) => new Date(d).toISOString().slice(0, 10), "iso");
      function date(v) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || !Number.isFinite(Date.parse(v + "T00:00:00Z")) || iso(Date.parse(v + "T00:00:00Z")) !== v) throw new Error("Informe datas v\xE1lidas.");
        return Date.parse(v + "T00:00:00Z");
      }
      __name(date, "date");
      function range(inicio, fim, today = iso(Date.now() - 3 * 36e5)) {
        if (!inicio && !fim) {
          fim = today;
          inicio = iso(date(fim) - 29 * DAY);
        }
        const from = date(inicio), to = date(fim), dias = Math.round((to - from) / DAY) + 1;
        if (dias < 1) throw new Error("A data final deve ser igual ou posterior \xE0 inicial.");
        if (dias > 366) throw new Error("Selecione um per\xEDodo de at\xE9 366 dias.");
        const anteriorInicio = iso(from - dias * DAY), anteriorFim = iso(from - DAY);
        return { inicio, fim, dias, anteriorInicio, anteriorFim, from: (/* @__PURE__ */ new Date(inicio + "T00:00:00-03:00")).toISOString(), until: new Date(to + DAY + 3 * 36e5).toISOString(), previousFrom: (/* @__PURE__ */ new Date(anteriorInicio + "T00:00:00-03:00")).toISOString() };
      }
      __name(range, "range");
      function series(period, rows) {
        const map = new Map(rows.map((r) => [r.dia, Number(r.total)]));
        const out = [];
        for (let i = 0; i < period.dias; i++) {
          const dia2 = iso(date(period.inicio) + i * DAY);
          out.push({ dia: dia2, total: map.get(dia2) || 0 });
        }
        return out;
      }
      __name(series, "series");
      function change(now, before) {
        return before ? Math.round((now - before) / before * 100) : null;
      }
      __name(change, "change");
      const api = { range, series, change, iso, DAY };
      if (typeof module !== "undefined" && module.exports) module.exports = api;
      else root.ChefDashboardCore = api;
    })(typeof window !== "undefined" ? window : globalThis);
  }
});

// ../assets/menus-core.js
var require_menus_core = __commonJS({
  "../assets/menus-core.js"(exports, module) {
    init_functionsRoutes_0_6006401703432819();
    (function(root, factory) {
      const api = factory();
      if (typeof module === "object" && module.exports) module.exports = api;
      else root.ChefMenusCore = api;
    })(typeof globalThis !== "undefined" ? globalThis : exports, function() {
      "use strict";
      const occasions = ["Natal", "R\xE9veillon", "P\xE1scoa", "Dia das M\xE3es", "Dia dos Pais", "Dia dos Namorados", "Anivers\xE1rio", "Encontro especial"];
      const modes = { casa: "Chef na sua casa", entrega: "Entrega", retirada: "Retirada" };
      const text = /* @__PURE__ */ __name((s, n) => String(s ?? "").trim().slice(0, n), "text");
      const today = /* @__PURE__ */ __name(() => new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10), "today");
      const date = /* @__PURE__ */ __name((s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + "T12:00:00Z")) && (/* @__PURE__ */ new Date(s + "T12:00:00Z")).toISOString().slice(0, 10) === s, "date");
      function clean(list, allowedPhotos) {
        if (!Array.isArray(list) || list.length > 12) throw Error("Crie at\xE9 12 menus especiais.");
        const ids = /* @__PURE__ */ new Set();
        return list.map((p) => {
          if (!p || typeof p !== "object") throw Error("Menu inv\xE1lido.");
          const m = { id: text(p.id, 60), title: text(p.title, 80), occasion: text(p.occasion, 40), description: text(p.description, 600), items: text(p.items, 1400), photo: text(p.photo, 240), mode: text(p.mode, 20), price: Number(p.price), basis: p.basis === "pessoa" ? "pessoa" : "menu", starting: p.starting === true, serves: Number(p.serves), includes: text(p.includes, 600), deadline: text(p.deadline, 10), until: text(p.until, 10), published: p.published === true };
          if (!/^[a-zA-Z0-9-]{1,60}$/.test(m.id) || ids.has(m.id)) throw Error("Identificador de menu inv\xE1lido ou repetido.");
          ids.add(m.id);
          if (!m.title) throw Error("D\xEA um nome ao menu.");
          if (!occasions.includes(m.occasion) || !modes[m.mode]) throw Error("Escolha a ocasi\xE3o e a forma de atendimento.");
          if (!Number.isFinite(m.price) || m.price <= 0 || m.price > 1e5 || !Number.isInteger(m.serves) || m.serves < 1 || m.serves > 500) throw Error("Informe um pre\xE7o v\xE1lido e a quantidade de pessoas.");
          m.price = Math.round(m.price * 100) / 100;
          if (!date(m.deadline) || !date(m.until) || m.deadline > m.until) throw Error("Confira o prazo de encomenda e o fim da divulga\xE7\xE3o.");
          if (allowedPhotos && !allowedPhotos.has(m.photo)) throw Error("Escolha uma foto da sua galeria ou da cole\xE7\xE3o do site.");
          if (m.published && (!m.photo || !m.items || !m.includes || m.deadline < today())) throw Error("Para divulgar, inclua foto, card\xE1pio, o que est\xE1 incluso e um prazo vigente.");
          return m;
        });
      }
      __name(clean, "clean");
      const active = /* @__PURE__ */ __name((list, day = today()) => (Array.isArray(list) ? list : []).filter((m) => m.published && m.until >= day && m.deadline >= day), "active");
      const money = /* @__PURE__ */ __name((n) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), "money");
      const price = /* @__PURE__ */ __name((m) => (m.starting ? "A partir de " : "") + money(m.price) + (m.basis === "pessoa" ? " / pessoa" : " / menu"), "price");
      const quantity = /* @__PURE__ */ __name((m) => (m.basis === "pessoa" ? "M\xEDnimo de " : "Serve ") + m.serves + (m.serves === 1 ? " pessoa" : " pessoas"), "quantity");
      const link = /* @__PURE__ */ __name((origin, c, m) => origin + "/m/" + encodeURIComponent(c.id) + "/" + encodeURIComponent(m.id), "link");
      const caption = /* @__PURE__ */ __name((c, m, url) => m.title + " \u2014 " + c.name + "\n" + price(m) + " \xB7 " + quantity(m) + "\n" + modes[m.mode] + " \xB7 " + c.cities + "\nEncomendas at\xE9 " + m.deadline.split("-").reverse().join("/") + ".\nConfira o card\xE1pio e pe\xE7a seu or\xE7amento: " + url + "\nSeu Chef em Casa", "caption");
      return { occasions, modes, today, date, clean, active, price, quantity, link, caption };
    });
  }
});

// ../assets/service-photos.js
var require_service_photos = __commonJS({
  "../assets/service-photos.js"(exports, module) {
    init_functionsRoutes_0_6006401703432819();
    (function(root) {
      const photos = {
        "Almo\xE7o em fam\xEDlia": "assets/servicos/almoco-em-familia.webp",
        "Aula com o chef": "assets/servicos/aula-com-o-chef.webp",
        "Brunch em casa": "assets/servicos/brunch-em-casa.webp",
        "Caf\xE9 colonial": "assets/servicos/cafe-colonial.webp",
        "Caf\xE9 da manh\xE3 especial": "assets/servicos/cafe-da-manha-especial.webp",
        "Card\xE1pio tem\xE1tico": "assets/servicos/cardapio-tematico.webp",
        "Carnes nobres": "assets/servicos/carnes-nobres.webp",
        "Celebra\xE7\xE3o": "assets/servicos/celebracao.webp",
        "Ceviches e sabores peruanos": "assets/servicos/ceviches-e-sabores-peruanos.webp",
        "Ch\xE1 da tarde": "assets/servicos/cha-da-tarde.webp",
        "Churrasco em casa": "assets/servicos/churrasco-em-casa.webp",
        "Confeitaria em casa": "assets/servicos/confeitaria-em-casa.webp",
        "Costela de preparo lento": "assets/servicos/costela-de-preparo-lento.webp",
        "Cozinha Coreana": "assets/servicos/cozinha-coreana.webp",
        "Cozinha Francesa": "assets/servicos/cozinha-francesa.webp",
        "Cozinha Grega": "assets/servicos/cozinha-grega.webp",
        "Cozinha Indiana": "assets/servicos/cozinha-indiana.webp",
        "Cozinha Italiana": "assets/servicos/cozinha-italiana.webp",
        "Cozinha Mediterr\xE2nea": "assets/servicos/cozinha-mediterranea.webp",
        "Cozinha Nordestina": "assets/servicos/cozinha-nordestina.webp",
        "Cozinha Tailandesa": "assets/servicos/cozinha-tailandesa.webp",
        "Encontro com amigos": "assets/servicos/encontro-com-amigos.webp",
        "Feijoada em casa": "assets/servicos/feijoada-em-casa.webp",
        "Festival de Crepes": "assets/servicos/festival-de-crepes.webp",
        "Festival de Risotos": "assets/servicos/festival-de-risotos.webp",
        "Finger food para receber": "assets/servicos/finger-food-para-receber.webp",
        "Jantar a dois": "assets/servicos/jantar-a-dois.webp",
        "Jantar harmonizado": "assets/servicos/jantar-harmonizado.webp",
        "Lounge": "assets/servicos/lounge.webp",
        "Marmitas da semana": "assets/servicos/marmitas-da-semana.webp",
        "Menu Degusta\xE7\xE3o": "assets/servicos/menu-degustacao.webp",
        "Menu Vegano": "assets/servicos/menu-vegano.webp",
        "Menu Vegetariano": "assets/servicos/menu-vegetariano.webp",
        "Moqueca \xE0 mesa": "assets/servicos/moqueca-a-mesa.webp",
        "Noite \xC1rabe": "assets/servicos/noite-arabe.webp",
        "Noite da Pizza": "assets/servicos/noite-da-pizza.webp",
        "Noite da Tainha": "assets/servicos/noite-da-tainha.webp",
        "Noite de Massas": "assets/servicos/noite-de-massas.webp",
        "Noite do Boteco": "assets/servicos/noite-do-boteco.webp",
        "Noite do Fondue": "assets/servicos/noite-do-fondue.webp",
        "Noite do L\xE1men": "assets/servicos/noite-do-lamen.webp",
        "Noite do Lanche": "assets/servicos/noite-do-lanche.webp",
        "Noite do Nhoque": "assets/servicos/noite-do-nhoque.webp",
        "Noite Japonesa": "assets/servicos/noite-japonesa.webp",
        "Noite Mexicana": "assets/servicos/noite-mexicana.webp",
        "Paella em casa": "assets/servicos/paella-em-casa.webp",
        "P\xE3es artesanais": "assets/servicos/paes-artesanais.webp",
        "Peixes grelhados": "assets/servicos/peixes-grelhados.webp",
        "Piquenique especial": "assets/servicos/piquenique-especial.webp",
        "Pokes e bowls": "assets/servicos/pokes-e-bowls.webp",
        "Queijos e t\xE1buas artesanais": "assets/servicos/queijos-e-tabuas-artesanais.webp",
        "Saladas gourmet": "assets/servicos/saladas-gourmet.webp",
        "Sequ\xEAncia de frutos do mar": "assets/servicos/sequencia-de-frutos-do-mar.webp",
        "Sopas e caldos": "assets/servicos/sopas-e-caldos.webp",
        "Tapas e petiscos": "assets/servicos/tapas-e-petiscos.webp"
      };
      if (typeof module !== "undefined" && module.exports) module.exports = photos;
      else root.ChefServicePhotos = photos;
    })(typeof window !== "undefined" ? window : globalThis);
  }
});

// api/[[rota]].js
async function derivar(senha, saltHex, iter) {
  const key = await crypto.subtle.importKey("raw", enc.encode(senha), "PBKDF2", false, ["deriveBits"]);
  const salt = Uint8Array.from(saltHex.match(/../g), (x2) => parseInt(x2, 16));
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" }, key, 256));
}
async function criarCredencial(senha) {
  const sal = aleatorio(16);
  return { algoritmo: "PBKDF2-SHA256", iteracoes: PBKDF2_ITER, sal, hash: await derivar(senha, sal, PBKDF2_ITER) };
}
async function conferirSenha(senha, cred) {
  if (!cred || cred.algoritmo !== "PBKDF2-SHA256") return false;
  const h = await derivar(senha, cred.sal, cred.iteracoes);
  if (h.length !== cred.hash.length) return false;
  let d = 0;
  for (let i = 0; i < h.length; i++) d |= h.charCodeAt(i) ^ cred.hash.charCodeAt(i);
  return d === 0;
}
function cookie(req) {
  const m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)scc_sessao=([a-f\d]{64})/);
  return m ? m[1] : "";
}
async function chefDaSessao(env, req) {
  const t = cookie(req);
  if (!t) return null;
  const row = await env.DB.prepare(
    "SELECT c.* FROM sessoes s JOIN chefs c ON c.id = s.chef_id WHERE s.token_hash = ? AND s.expira_em > ?"
  ).bind(await sha256(t), agora()).first();
  return row || null;
}
async function abrirSessao(env, chefId) {
  const token = aleatorio(32), expira = new Date(Date.now() + SESSAO_DIAS * 864e5).toISOString();
  await env.DB.prepare("INSERT INTO sessoes (token_hash, chef_id, expira_em) VALUES (?, ?, ?)").bind(await sha256(token), chefId, expira).run();
  await env.DB.prepare("DELETE FROM sessoes WHERE expira_em <= ?").bind(agora()).run();
  return token;
}
async function limitar(env, req, tipo, max, janelaSeg) {
  const ip = req.headers.get("cf-connecting-ip") || "local";
  const chave = tipo + ":" + await sha256(ip), t = Math.floor(Date.now() / 1e3);
  const row = await env.DB.prepare("SELECT n, expira_em FROM limites WHERE chave = ?").bind(chave).first();
  if (!row || row.expira_em <= t) {
    await env.DB.prepare("INSERT OR REPLACE INTO limites (chave, n, expira_em) VALUES (?, 1, ?)").bind(chave, t + janelaSeg).run();
    return true;
  }
  if (row.n >= max) return false;
  await env.DB.prepare("UPDATE limites SET n = n + 1 WHERE chave = ?").bind(chave).run();
  return true;
}
async function limparPerfil(env, chefId, p, atual) {
  const minhas = new Set((await env.DB.prepare("SELECT id FROM fotos WHERE chef_id = ?").bind(chefId).all()).results.map((r) => r.id));
  const novas = [];
  async function foto(url) {
    url = String(url || "");
    if (/^\/assets\/apresentacao\/[a-z0-9-]+\.webp$/.test(url) && atual && [atual.avatar, ...(atual.gallery || []).map((g) => g.url)].includes(url)) return url;
    if (FOTO_LOCAL.test(url)) return minhas.has(url.slice(10)) ? url : "";
    const m2 = url.match(DATA_URL);
    if (!m2) return "";
    const bin = Uint8Array.from(atob(m2[1]), (c) => c.charCodeAt(0));
    if (bin.length > 1.5 * 1024 * 1024 || bin[0] !== 255 || bin[1] !== 216) return "";
    const id = aleatorio(16);
    novas.push({ id, bin });
    minhas.add(id);
    return "/api/foto/" + id;
  }
  __name(foto, "foto");
  const whatsapp = txt(p.whatsapp, 30);
  if (!C2.phone(whatsapp) && !((p.semWhatsapp || p.tipo === "cliente" || atual && atual.tipo === "cliente") && !whatsapp)) throw new Error("Informe um WhatsApp v\xE1lido com DDD.");
  let instagram = txt(p.instagram, 200);
  if (instagram) {
    try {
      const u = new URL(instagram);
      if (u.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(u.hostname)) instagram = "";
    } catch {
      instagram = "";
    }
  }
  const nome = txt(p.name, 120);
  if (nome.length < 2) throw new Error("Informe um nome com pelo menos 2 caracteres.");
  const out = {
    name: nome,
    whatsapp,
    instagram,
    tipo: atual ? atual.tipo === "cliente" ? "cliente" : "chef" : p.tipo === "cliente" ? "cliente" : "chef",
    phone: txt(p.phone, 30),
    cities: txt(p.cities, 160),
    specialty: txt(p.specialty, 80),
    bio: txt(p.bio, 2e3),
    avatar: await foto(p.avatar),
    gallery: [],
    dishes: []
  };
  for (const g of (Array.isArray(p.gallery) ? p.gallery : []).slice(0, 30)) {
    const url = await foto(g && g.url);
    if (url) out.gallery.push({ id: txt(g.id, 40) || aleatorio(6), url, caption: txt(g.caption, 600) });
  }
  for (const d of (Array.isArray(p.dishes) ? p.dishes : []).slice(0, 120)) {
    if (!d || !txt(d.name, 150)) continue;
    const price = Number(d.price);
    const x2 = { id: typeof d.id === "number" ? d.id : txt(d.id, 40), category: txt(d.category, 60), name: txt(d.name, 150), desc: txt(d.desc, 600), price: Number.isFinite(price) && price >= 0 && price <= 1e5 ? Math.round(price * 100) / 100 : 0 };
    if (d.marmita === true) x2.marmita = true;
    out.dishes.push(x2);
  }
  const m = C2.cleanMarmita(p.marmita);
  if (m) out.marmita = m;
  const o = C2.cleanOpcoes(p.opcoes);
  if (o) out.opcoes = o;
  const a = C2.cleanAgenda(p.agenda);
  if (a) out.agenda = a;
  for (const f of novas) await env.DB.prepare("INSERT INTO fotos (id, chef_id, tipo, dados, criado_em) VALUES (?, ?, ?, ?, ?)").bind(f.id, chefId, "image/jpeg", f.bin, agora()).run();
  const usadas = new Set([out.avatar, ...out.gallery.map((g) => g.url), ...(atual?.menus || []).map((m2) => m2.photo)].filter(Boolean).map((u) => u.slice(10)));
  for (const id of minhas) if (!usadas.has(id)) await env.DB.prepare("DELETE FROM fotos WHERE id = ? AND chef_id = ?").bind(id, chefId).run();
  return out;
}
function googleUrls(env) {
  const t = env.GOOGLE_BASE_TESTE;
  return t ? { auth: t + "/auth", token: t + "/token", iss: [t] } : { auth: "https://accounts.google.com/o/oauth2/v2/auth", token: "https://oauth2.googleapis.com/token", iss: ["https://accounts.google.com", "accounts.google.com"] };
}
function lerIdToken(t) {
  const parte = String(t || "").split(".")[1];
  if (!parte) return null;
  try {
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(parte.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))));
  } catch {
    return null;
  }
}
async function notificar(env, contaId, tipo, texto, link = "") {
  try {
    await env.DB.prepare("INSERT INTO notificacoes (id, conta_id, tipo, texto, link, criado_em) VALUES (?, ?, ?, ?, ?, ?)").bind(aleatorio(12), contaId, tipo, txt(texto, 200), txt(link, 200), agora()).run();
  } catch {
  }
}
function layoutEmail(origem, { titulo, corpo: corpo2, botao, link, nota }) {
  return '<!doctype html><html><body style="margin:0;padding:0;background:#f7f5f0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:32px 12px"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffefb;border-radius:18px;overflow:hidden;border:1px solid #e8e3d8;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#283b30"><tr><td style="background:#304e3b;padding:20px 28px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td><img src="' + origem + '/assets/email-logo.png" width="40" height="40" alt="" style="display:block;border-radius:10px"></td><td style="padding-left:12px;font-family:Georgia,serif;font-size:20px;color:#f7f5f0">Seu Chef em Casa</td></tr></table></td></tr><tr><td style="padding:32px 28px 4px"><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-weight:400;font-size:26px;line-height:1.25;color:#283b30">' + escH(titulo) + "</h1>" + corpo2 + "</td></tr>" + (botao ? '<tr><td style="padding:10px 28px 6px"><a href="' + escH(link) + '" style="display:inline-block;background:#304e3b;color:#fffefb;text-decoration:none;padding:14px 26px;border-radius:12px;font-weight:600;font-size:15px">' + escH(botao) + "</a></td></tr>" : "") + (nota ? '<tr><td style="padding:16px 28px 0;font-size:13px;line-height:1.55;color:#6b7a70">' + nota + "</td></tr>" : "") + '<tr><td style="padding:28px 28px 26px"><div style="border-top:1px solid #e8e3d8;padding-top:16px;font-size:12px;line-height:1.7;color:#8a948d">Boa comida. Boas hist\xF3rias.<br><a href="' + origem + '" style="color:#b45335;text-decoration:none">seuchefemcasa.com.br</a> \xB7 <a href="mailto:contato@seuchefemcasa.com.br" style="color:#b45335;text-decoration:none">contato@seuchefemcasa.com.br</a></div></td></tr></table></td></tr></table></body></html>';
}
function emailPedido(perfil, texto, origem) {
  const cliente = (String(texto).match(/^Cliente: (.+)$/m) || [])[1] || "um cliente";
  const data = (String(texto).match(/^(?:Data|Início desejado): (.+)$/m) || [])[1] || "";
  const assunto = "Novo pedido de or\xE7amento de " + cliente + (data ? " para " + data : "");
  const painel = origem + "/#/painel";
  const corpoTxt = "Ol\xE1, " + saudacao(perfil) + ", tudo bem?\n\nVoc\xEA recebeu um pedido de or\xE7amento pelo Seu Chef em Casa.\nO cliente deve enviar a mesma mensagem pelo WhatsApp. Se n\xE3o chegar, voc\xEA pode responder pelo painel.\n\n" + texto + "\n\nVer no painel: " + painel + "\n";
  const e3 = /* @__PURE__ */ __name((t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), "e");
  const html = layoutEmail(origem, {
    titulo: "Chegou um pedido de or\xE7amento",
    corpo: pEmail("Ol\xE1, " + e3(saudacao(perfil)) + ", tudo bem?") + pEmail("Um cliente montou um pedido para voc\xEA no <b>Seu Chef em Casa</b>. Ele tamb\xE9m deve te chamar no WhatsApp com a mesma mensagem.") + '<div style="background:#f7f5f0;border-left:3px solid #e9a98f;border-radius:10px;padding:16px 18px;margin:6px 0 10px;white-space:pre-wrap;font-size:14px;line-height:1.6;color:#283b30">' + e3(texto) + "</div>",
    botao: "Ver no painel",
    link: painel,
    nota: "Se a mensagem n\xE3o chegar no seu WhatsApp, voc\xEA tamb\xE9m pode responder o cliente pelo painel."
  });
  return { assunto, texto: corpoTxt, html };
}
async function enviarEmail(env, para, m) {
  if (!emailAtivo(env) || !C2.validEmail(C2.email(para))) return false;
  const resend = !!env.RESEND_API_KEY;
  const url = env.EMAIL_API_TESTE || (resend ? "https://api.resend.com/emails" : "https://api.cloudflare.com/client/v4/accounts/" + env.CF_ACCOUNT_ID + "/email/sending/send");
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + (env.RESEND_API_KEY || env.CF_EMAIL_TOKEN || "teste") },
      body: JSON.stringify({ to: resend ? [C2.email(para)] : C2.email(para), from: env.EMAIL_REMETENTE, subject: m.assunto, text: m.texto, html: m.html })
    });
    return r.ok;
  } catch {
    return false;
  }
}
async function avisarChef(env, para, perfil, texto, origem) {
  return enviarEmail(env, para, emailPedido(perfil, texto, origem));
}
function emailSenha(nome, link) {
  const e3 = /* @__PURE__ */ __name((t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), "e");
  return {
    assunto: "Crie uma senha nova no Seu Chef em Casa",
    texto: "Ol\xE1, " + nome + ", tudo bem?\n\nRecebemos um pedido para trocar a senha da sua conta no Seu Chef em Casa.\nUse este link em at\xE9 1 hora:\n" + link + "\n\nSe n\xE3o foi voc\xEA, ignore este e-mail. Sua senha continua a mesma.\n",
    html: layoutEmail(new URL(link).origin, {
      titulo: "Vamos criar sua senha nova",
      corpo: pEmail("Ol\xE1, " + e3(nome) + ", tudo bem?") + pEmail("Recebemos um pedido para trocar a senha da sua conta no <b>Seu Chef em Casa</b>. \xC9 s\xF3 tocar no bot\xE3o e escolher a nova."),
      botao: "Criar senha nova",
      link,
      nota: "O link vale por 1 hora. Se n\xE3o foi voc\xEA que pediu, pode ignorar este e-mail: sua senha continua a mesma."
    })
  };
}
async function corpo(req) {
  if (!(req.headers.get("content-type") || "").startsWith("application/json")) throw new Error("Envie JSON.");
  const t = await req.text();
  if (t.length > 12 * 1024 * 1024) throw new Error("Envio grande demais.");
  return JSON.parse(t || "{}");
}
async function garantirEsquema(env) {
  if (esquemaOk) return;
  const { results } = await env.DB.prepare("PRAGMA table_info(chefs)").all();
  if (!results.some((c) => c.name === "oculto")) {
    try {
      await env.DB.prepare("ALTER TABLE chefs ADD COLUMN oculto INTEGER NOT NULL DEFAULT 0").run();
    } catch (e3) {
      if (!/duplicate column/i.test(String(e3 && e3.message))) throw e3;
    }
  }
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS site_config (id INTEGER PRIMARY KEY CHECK (id = 1), dados TEXT NOT NULL, atualizado_em TEXT NOT NULL, atualizado_por TEXT NOT NULL)").run();
  for (const q of [
    "CREATE TABLE IF NOT EXISTS seguidores (chef_id TEXT NOT NULL, conta_id TEXT NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (chef_id, conta_id))",
    "CREATE INDEX IF NOT EXISTS seguidores_conta ON seguidores(conta_id)",
    "CREATE TABLE IF NOT EXISTS curtidas (chef_id TEXT NOT NULL, foto_id TEXT NOT NULL, conta_id TEXT NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (chef_id, foto_id, conta_id))",
    "CREATE INDEX IF NOT EXISTS curtidas_conta ON curtidas(conta_id)",
    "CREATE TABLE IF NOT EXISTS comentarios (id TEXT PRIMARY KEY, chef_id TEXT NOT NULL, foto_id TEXT NOT NULL, conta_id TEXT NOT NULL, texto TEXT NOT NULL, criado_em TEXT NOT NULL)",
    "CREATE INDEX IF NOT EXISTS comentarios_foto ON comentarios(chef_id, foto_id, criado_em)",
    "CREATE INDEX IF NOT EXISTS comentarios_conta ON comentarios(conta_id)",
    "CREATE TABLE IF NOT EXISTS denuncias (comentario_id TEXT NOT NULL, conta_id TEXT NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (comentario_id, conta_id))",
    "CREATE TABLE IF NOT EXISTS notificacoes (id TEXT PRIMARY KEY, conta_id TEXT NOT NULL, tipo TEXT NOT NULL, texto TEXT NOT NULL, link TEXT NOT NULL DEFAULT '', lida INTEGER NOT NULL DEFAULT 0, criado_em TEXT NOT NULL)",
    "CREATE INDEX IF NOT EXISTS notificacoes_conta ON notificacoes(conta_id, criado_em)"
  ]) await env.DB.prepare(q).run();
  esquemaOk = true;
}
async function onRequest3({ request: req, env, params, waitUntil }) {
  if (!env.DB) return erro("Banco n\xE3o configurado.", 503);
  await garantirEsquema(env);
  const rota = "/" + [].concat(params.rota || []).join("/"), metodo = req.method;
  try {
    if (rota === "/admin/dashboard" && metodo === "GET") {
      const c = await chefDaSessao(env, req);
      if (!c) return erro("Entre com a conta da equipe.", 401);
      if (!ehAdmin(env, c)) return erro("Acesso s\xF3 para a equipe.", 403);
      const q = new URL(req.url).searchParams, periodo = import_dashboard_core.default.range(q.get("inicio"), q.get("fim"));
      const [daily, previous, summary, registered, ranking] = await Promise.all([
        env.DB.prepare("SELECT date(criado_em, '-3 hours') AS dia, COUNT(*) AS total FROM pedidos WHERE criado_em >= ? AND criado_em < ? GROUP BY dia ORDER BY dia").bind(periodo.from, periodo.until).all(),
        env.DB.prepare("SELECT COUNT(*) AS total FROM pedidos WHERE criado_em >= ? AND criado_em < ?").bind(periodo.previousFrom, periodo.from).first(),
        env.DB.prepare(`SELECT COUNT(*) AS total, COUNT(DISTINCT chef_id) AS chefs,
          COALESCE(SUM(CASE WHEN COALESCE(json_extract(dados, '$.status'), 'novo') = 'novo' THEN 1 ELSE 0 END),0) AS novos,
          COALESCE(SUM(CASE WHEN json_extract(dados, '$.status') = 'respondido' THEN 1 ELSE 0 END),0) AS respondidos,
          COALESCE(SUM(CASE WHEN json_extract(dados, '$.status') = 'fechado' THEN 1 ELSE 0 END),0) AS fechados,
          COALESCE(SUM(CASE WHEN json_extract(dados, '$.mode') = 'marmita' THEN 1 ELSE 0 END),0) AS marmitas
          FROM pedidos WHERE criado_em >= ? AND criado_em < ?`).bind(periodo.from, periodo.until).first(),
        env.DB.prepare("SELECT id, perfil, publicado, oculto, criado_em FROM chefs").all(),
        env.DB.prepare(`SELECT c.id, json_extract(c.perfil, '$.name') AS nome, COUNT(*) AS total
          FROM pedidos p JOIN chefs c ON c.id = p.chef_id WHERE p.criado_em >= ? AND p.criado_em < ?
          GROUP BY c.id ORDER BY total DESC, nome LIMIT 5`).bind(periodo.from, periodo.until).all()
      ]);
      const chefs = { cadastrados: registered.results.length, visiveis: 0, pausados: 0, ocultos: 0, incompletos: 0 };
      let cadastrosPeriodo = 0, cadastrosAnterior = 0;
      const newRows = [];
      for (const r of registered.results) {
        const falta = C2.faltaPerfil(JSON.parse(r.perfil || "{}"));
        if (!r.publicado) chefs.pausados++;
        if (r.oculto) chefs.ocultos++;
        if (falta.length) chefs.incompletos++;
        if (r.publicado && !r.oculto && !falta.length) chefs.visiveis++;
        if (r.criado_em >= periodo.from && r.criado_em < periodo.until) {
          cadastrosPeriodo++;
          newRows.push({ dia: import_dashboard_core.default.iso(Date.parse(r.criado_em) - 3 * 36e5), total: 1 });
        } else if (r.criado_em >= periodo.previousFrom && r.criado_em < periodo.from) cadastrosAnterior++;
      }
      const grouped = /* @__PURE__ */ new Map();
      for (const r of newRows) grouped.set(r.dia, (grouped.get(r.dia) || 0) + 1);
      return json({
        periodo,
        geradoEm: agora(),
        pedidos: { ...summary, anterior: previous.total, variacao: import_dashboard_core.default.change(summary.total, previous.total), serie: import_dashboard_core.default.series(periodo, daily.results) },
        cadastros: { total: cadastrosPeriodo, anterior: cadastrosAnterior, variacao: import_dashboard_core.default.change(cadastrosPeriodo, cadastrosAnterior), serie: import_dashboard_core.default.series(periodo, [...grouped].map(([dia2, total]) => ({ dia: dia2, total }))) },
        chefs,
        ranking: ranking.results
      });
    }
    if (rota === "/site" && metodo === "GET") {
      const row = await env.DB.prepare("SELECT dados FROM site_config WHERE id = 1").first();
      return json({ config: import_site_settings.default.clean(row ? JSON.parse(row.dados) : {}) });
    }
    if (rota === "/admin/site") {
      const c = await chefDaSessao(env, req);
      if (!c) return erro("Entre com a conta da equipe.", 401);
      if (!ehAdmin(env, c)) return erro("Acesso s\xF3 para a equipe.", 403);
      const row = await env.DB.prepare("SELECT dados, atualizado_em FROM site_config WHERE id = 1").first();
      if (metodo === "GET") return json({ config: import_site_settings.default.clean(row ? JSON.parse(row.dados) : {}), versao: row?.atualizado_em || "" });
      if (metodo === "PUT") {
        const b = await corpo(req), config = import_site_settings.default.clean(b.config), expected = String(b.versao || "");
        if ((row?.atualizado_em || "") !== expected) return erro("Outra pessoa atualizou o site. Recarregue antes de editar.", 409);
        const versao = agora();
        const result = row ? await env.DB.prepare("UPDATE site_config SET dados = ?, atualizado_em = ?, atualizado_por = ? WHERE id = 1 AND atualizado_em = ?").bind(JSON.stringify(config), versao, c.id, expected).run() : await env.DB.prepare("INSERT OR IGNORE INTO site_config (id, dados, atualizado_em, atualizado_por) VALUES (1, ?, ?, ?)").bind(JSON.stringify(config), versao, c.id).run();
        if (!result.meta.changes) return erro("Outra pessoa atualizou o site. Recarregue antes de editar.", 409);
        return json({ config, versao });
      }
    }
    if (rota === "/saude") return json({ ok: true, google: googleOn(env), convite: !!env.CONVITE });
    if (rota === "/google/iniciar" && metodo === "POST") {
      if (!googleOn(env)) return erro("Login com Google ainda n\xE3o est\xE1 ativado.", 503);
      if (!await limitar(env, req, "google", 20, 900)) return erro("Muitas tentativas. Espere 15 minutos.", 429);
      const b = await corpo(req), modo = b.modo === "cadastro" ? "cadastro" : "entrar", tipo = b.tipo === "cliente" ? "cliente" : "chef";
      let dados = { tipo };
      if (modo === "cadastro") {
        if (env.CONVITE && b.tipo !== "cliente" && txt(b.convite, 80) !== env.CONVITE) return erro("C\xF3digo de convite inv\xE1lido. Pe\xE7a o c\xF3digo \xE0 equipe.", 403);
        const whatsapp = txt(b.whatsapp, 30);
        if (whatsapp && !C2.phone(whatsapp)) return erro("Informe um WhatsApp v\xE1lido com DDD.");
        dados = { nome: txt(b.nome, 120), whatsapp, cidades: txt(b.cidades, 160), tipo };
      }
      const estado = aleatorio(24), verificador = b64url(crypto.getRandomValues(new Uint8Array(32))), nonce = aleatorio(16);
      const desafio = b64url(await crypto.subtle.digest("SHA-256", enc.encode(verificador)));
      const t = Math.floor(Date.now() / 1e3);
      await env.DB.prepare("DELETE FROM oauth_pendente WHERE expira_em <= ?").bind(t).run();
      await env.DB.prepare("INSERT INTO oauth_pendente (estado, verificador, nonce, modo, dados, expira_em) VALUES (?, ?, ?, ?, ?, ?)").bind(estado, verificador, nonce, modo, JSON.stringify(dados), t + 600).run();
      const u = new URL(googleUrls(env).auth);
      Object.entries({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: new URL(req.url).origin + "/api/google/retorno",
        response_type: "code",
        scope: "openid email profile",
        state: estado,
        nonce,
        code_challenge: desafio,
        code_challenge_method: "S256",
        prompt: "select_account"
      }).forEach(([k, v]) => u.searchParams.set(k, v));
      return json({ url: u.toString() }, 200, { "set-cookie": cookieOauth(estado, 600) });
    }
    if (rota === "/google/retorno" && metodo === "GET") {
      const origem = new URL(req.url).origin, q = new URL(req.url).searchParams, apagar = { "set-cookie": cookieOauth("", 0) };
      const falha = /* @__PURE__ */ __name((cod) => voltar(origem, "/?google=" + cod + "#/entrar", apagar), "falha");
      if (!googleOn(env)) return falha("desligado");
      if (q.get("error")) return falha("cancelado");
      const estado = String(q.get("state") || ""), m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)scc_oauth=([a-f\d]{48})/);
      if (!/^[a-f\d]{48}$/.test(estado) || !m || m[1] !== estado) return falha("expirado");
      const p = await env.DB.prepare("SELECT * FROM oauth_pendente WHERE estado = ?").bind(estado).first();
      await env.DB.prepare("DELETE FROM oauth_pendente WHERE estado = ?").bind(estado).run();
      if (!p || p.expira_em <= Math.floor(Date.now() / 1e3)) return falha("expirado");
      const urls = googleUrls(env);
      const r = await fetch(urls.token, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({
        code: String(q.get("code") || ""),
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: origem + "/api/google/retorno",
        grant_type: "authorization_code",
        code_verifier: p.verificador
      }) });
      const tk = r.ok ? await r.json().catch(() => null) : null, id = lerIdToken(tk && tk.id_token);
      const ok = id && id.aud === env.GOOGLE_CLIENT_ID && urls.iss.includes(id.iss) && Number(id.exp) * 1e3 > Date.now() && id.nonce === p.nonce && id.sub && id.email && (id.email_verified === true || id.email_verified === "true");
      if (!ok) return falha("invalido");
      const sub = txt(id.sub, 100), email = C2.email(id.email);
      let row = await env.DB.prepare("SELECT * FROM chefs WHERE google_sub = ?").bind(sub).first();
      if (!row) {
        row = await env.DB.prepare("SELECT * FROM chefs WHERE email = ?").bind(email).first();
        if (row && row.google_sub && row.google_sub !== sub) return falha("outra-conta");
        if (row) await env.DB.prepare("UPDATE chefs SET google_sub = ?, atualizado_em = ? WHERE id = ?").bind(sub, agora(), row.id).run();
      }
      if (!row) {
        const d = JSON.parse(p.dados || "{}");
        if (p.modo !== "cadastro" && env.CONVITE && d.tipo !== "cliente") return falha("sem-conta");
        const chefId = "chef-" + aleatorio(8);
        const perfil = await limparPerfil(env, chefId, { name: d.nome || txt(id.name, 120) || email.split("@")[0], whatsapp: d.whatsapp || "", cities: d.cidades || "", semWhatsapp: true, tipo: d.tipo }, null);
        await env.DB.prepare("INSERT INTO chefs (id, email, credencial, perfil, publicado, criado_em, atualizado_em, google_sub) VALUES (?, ?, ?, ?, 1, ?, ?, ?)").bind(chefId, email, JSON.stringify({ algoritmo: "google" }), JSON.stringify(perfil), agora(), agora(), sub).run();
        row = { id: chefId };
      }
      const token = await abrirSessao(env, row.id);
      const h = new Headers({ location: origem + "/#/painel", "cache-control": "no-store" });
      h.append("set-cookie", cookieSessao(token, SESSAO_DIAS));
      h.append("set-cookie", cookieOauth("", 0));
      return new Response(null, { status: 302, headers: h });
    }
    if (rota.startsWith("/social/")) {
      const partes = rota.split("/").slice(2), eu = await chefDaSessao(env, req);
      if (partes[0] === "comentario" && partes[2] === "denunciar" && metodo === "POST") {
        if (!eu) return erro("Entre para denunciar.", 401);
        const cm = await env.DB.prepare("SELECT id FROM comentarios WHERE id = ?").bind(txt(partes[1], 40)).first();
        if (!cm) return erro("Coment\xE1rio n\xE3o encontrado.", 404);
        await env.DB.prepare("INSERT OR IGNORE INTO denuncias (comentario_id, conta_id, criado_em) VALUES (?, ?, ?)").bind(cm.id, eu.id, agora()).run();
        return json({ ok: true });
      }
      if (partes[0] === "comentario" && metodo === "DELETE") {
        if (!eu) return erro("Entre para continuar.", 401);
        const cm = await env.DB.prepare("SELECT id, chef_id, conta_id FROM comentarios WHERE id = ?").bind(txt(partes[1], 40)).first();
        if (!cm) return erro("Coment\xE1rio n\xE3o encontrado.", 404);
        if (cm.conta_id !== eu.id && cm.chef_id !== eu.id && !ehAdmin(env, eu)) return erro("Voc\xEA n\xE3o pode apagar este coment\xE1rio.", 403);
        await env.DB.prepare("DELETE FROM comentarios WHERE id = ?").bind(cm.id).run();
        await env.DB.prepare("DELETE FROM denuncias WHERE comentario_id = ?").bind(cm.id).run();
        return json({ ok: true });
      }
      const chefId = txt(partes[0], 40), acao = partes[1] || "";
      const alvo = await env.DB.prepare("SELECT id, perfil FROM chefs WHERE id = ? AND publicado = 1 AND COALESCE(oculto, 0) = 0").bind(chefId).first();
      const perfilAlvo = alvo ? JSON.parse(alvo.perfil) : null;
      if (!perfilAlvo || perfilAlvo.tipo === "cliente") return erro("Chef n\xE3o encontrado.", 404);
      const contar = /* @__PURE__ */ __name(async (sql, ...v) => Number((await env.DB.prepare(sql).bind(...v).first()).n), "contar");
      if (!acao && metodo === "GET") {
        const sigo = eu ? !!await env.DB.prepare("SELECT 1 FROM seguidores WHERE chef_id = ? AND conta_id = ?").bind(chefId, eu.id).first() : false;
        const cur = (await env.DB.prepare("SELECT foto_id, COUNT(*) n, MAX(conta_id = ?) eu FROM curtidas WHERE chef_id = ? GROUP BY foto_id").bind(eu ? eu.id : "", chefId).all()).results;
        const com = (await env.DB.prepare("SELECT foto_id, COUNT(*) n FROM comentarios WHERE chef_id = ? GROUP BY foto_id").bind(chefId).all()).results;
        const fotos = {};
        for (const r of cur) fotos[r.foto_id] = { curtidas: Number(r.n), curti: !!r.eu, comentarios: 0 };
        for (const r of com) (fotos[r.foto_id] ||= { curtidas: 0, curti: false, comentarios: 0 }).comentarios = Number(r.n);
        return json({ seguidores: await contar("SELECT COUNT(*) n FROM seguidores WHERE chef_id = ?", chefId), sigo, fotos }, 200, { "cache-control": "no-store" });
      }
      if (acao === "comentarios" && metodo === "GET") {
        const foto2 = txt(new URL(req.url).searchParams.get("foto"), 40), admin = !!eu && ehAdmin(env, eu);
        const { results } = await env.DB.prepare("SELECT c.id, c.conta_id, c.texto, c.criado_em, json_extract(x.perfil, '$.name') nome FROM comentarios c LEFT JOIN chefs x ON x.id = c.conta_id WHERE c.chef_id = ? AND c.foto_id = ? ORDER BY c.criado_em LIMIT 200").bind(chefId, foto2).all();
        return json({ comentarios: results.map((r) => ({ id: r.id, nome: r.nome || "Conta removida", texto: r.texto, criado_em: r.criado_em, podeApagar: !!eu && (r.conta_id === eu.id || chefId === eu.id || admin), meu: !!eu && r.conta_id === eu.id })) }, 200, { "cache-control": "no-store" });
      }
      if (metodo !== "POST") return erro("Rota n\xE3o encontrada.", 404);
      if (!eu) return erro("Crie sua conta gr\xE1tis para continuar.", 401);
      const b = await corpo(req), on = b.on !== false;
      if (acao === "seguir") {
        if (eu.id === chefId) return erro("Voc\xEA n\xE3o pode seguir o pr\xF3prio perfil.");
        if (on) {
          const r = await env.DB.prepare("INSERT OR IGNORE INTO seguidores (chef_id, conta_id, criado_em) VALUES (?, ?, ?)").bind(chefId, eu.id, agora()).run();
          if (r && r.meta && r.meta.changes) await notificar(env, chefId, "seguidor", nomeDe(eu) + " agora acompanha a sua cozinha.", JSON.parse(eu.perfil).tipo === "cliente" ? "" : "#/chef/" + eu.id);
        } else await env.DB.prepare("DELETE FROM seguidores WHERE chef_id = ? AND conta_id = ?").bind(chefId, eu.id).run();
        return json({ seguidores: await contar("SELECT COUNT(*) n FROM seguidores WHERE chef_id = ?", chefId), sigo: on });
      }
      const foto = txt(b.foto, 40);
      if (!(perfilAlvo.gallery || []).some((g) => String(g.id) === foto)) return erro("Foto n\xE3o encontrada.", 404);
      if (acao === "curtir") {
        if (on) await env.DB.prepare("INSERT OR IGNORE INTO curtidas (chef_id, foto_id, conta_id, criado_em) VALUES (?, ?, ?, ?)").bind(chefId, foto, eu.id, agora()).run();
        else await env.DB.prepare("DELETE FROM curtidas WHERE chef_id = ? AND foto_id = ? AND conta_id = ?").bind(chefId, foto, eu.id).run();
        return json({ curtidas: await contar("SELECT COUNT(*) n FROM curtidas WHERE chef_id = ? AND foto_id = ?", chefId, foto), curti: on });
      }
      if (acao === "comentarios") {
        if (!await limitar(env, req, "comentario", 30, 3600)) return erro("Muitos coment\xE1rios seguidos. Tente mais tarde.", 429);
        const texto = txt(b.texto, 500);
        if (!texto) return erro("Escreva um coment\xE1rio.");
        const id = aleatorio(12);
        await env.DB.prepare("INSERT INTO comentarios (id, chef_id, foto_id, conta_id, texto, criado_em) VALUES (?, ?, ?, ?, ?, ?)").bind(id, chefId, foto, eu.id, texto, agora()).run();
        if (eu.id !== chefId) await notificar(env, chefId, "comentario", nomeDe(eu) + " comentou um prato seu: " + texto.slice(0, 80), "#/chef/" + chefId);
        return json({ ok: true, id }, 201);
      }
      return erro("Rota n\xE3o encontrada.", 404);
    }
    if (rota === "/chefs" && metodo === "GET") {
      const { results } = await env.DB.prepare("SELECT id, perfil FROM chefs WHERE publicado = 1 AND oculto = 0 ORDER BY criado_em").all();
      return json({ chefs: results.map(publico).filter((c) => c.tipo !== "cliente" && !C2.faltaPerfil(c).length) }, 200, { "cache-control": "public, max-age=30" });
    }
    if (rota.startsWith("/foto/") && metodo === "GET") {
      const id = rota.slice(6);
      if (!/^[a-f\d]{32}$/.test(id)) return erro("Foto n\xE3o encontrada.", 404);
      const f = await env.DB.prepare("SELECT tipo, dados FROM fotos WHERE id = ?").bind(id).first();
      if (!f) return erro("Foto n\xE3o encontrada.", 404);
      return new Response(new Uint8Array(f.dados), { headers: { "content-type": f.tipo, "cache-control": "public, max-age=31536000, immutable" } });
    }
    if (rota === "/eu" && metodo === "GET") {
      const c = await chefDaSessao(env, req);
      return json({ chef: c ? doDono(c, env) : null });
    }
    if (rota === "/cadastro" && metodo === "POST") {
      if (!await limitar(env, req, "cadastro", 10, 3600)) return erro("Muitas tentativas. Tente de novo em uma hora.", 429);
      const b = await corpo(req);
      if (env.CONVITE && b.tipo !== "cliente" && txt(b.convite, 80) !== env.CONVITE) return erro("C\xF3digo de convite inv\xE1lido. Pe\xE7a o c\xF3digo \xE0 equipe.", 403);
      const email = C2.email(b.email);
      if (!C2.validEmail(email)) return erro("Confira o e-mail informado.");
      if (C2.emailTemporario(email)) return erro("E-mails tempor\xE1rios n\xE3o s\xE3o aceitos. Use seu e-mail pessoal ou entre com Google.");
      const senha = String(b.senha || "");
      if (senha.length < 8 || senha.length > 200) return erro("Crie uma senha com pelo menos 8 caracteres.");
      if (await env.DB.prepare("SELECT 1 FROM chefs WHERE email = ?").bind(email).first()) return erro("Este e-mail j\xE1 est\xE1 cadastrado. Use Entrar.", 409);
      const id = "chef-" + aleatorio(8);
      const perfil = await limparPerfil(env, id, { name: b.nome, whatsapp: b.whatsapp, cities: b.cidades, tipo: b.tipo }, null);
      await env.DB.prepare("INSERT INTO chefs (id, email, credencial, perfil, publicado, criado_em, atualizado_em) VALUES (?, ?, ?, ?, 1, ?, ?)").bind(id, email, JSON.stringify(await criarCredencial(senha)), JSON.stringify(perfil), agora(), agora()).run();
      const token = await abrirSessao(env, id);
      const row = await env.DB.prepare("SELECT * FROM chefs WHERE id = ?").bind(id).first();
      return json({ chef: doDono(row, env) }, 201, { "set-cookie": cookieSessao(token, SESSAO_DIAS) });
    }
    if (rota === "/entrar" && metodo === "POST") {
      if (!await limitar(env, req, "entrar", 10, 900)) return erro("Muitas tentativas. Espere 15 minutos.", 429);
      const b = await corpo(req), email = C2.email(b.email);
      const row = await env.DB.prepare("SELECT * FROM chefs WHERE email = ?").bind(email).first();
      if (row && JSON.parse(row.credencial).algoritmo === "google") return erro("Esta conta entra com o Google. Toque em Entrar com Google.", 401);
      if (!row || !await conferirSenha(String(b.senha || ""), JSON.parse(row.credencial))) return erro("E-mail ou senha incorretos.", 401);
      const token = await abrirSessao(env, row.id);
      return json({ chef: doDono(row, env) }, 200, { "set-cookie": cookieSessao(token, SESSAO_DIAS) });
    }
    if (rota === "/sair" && metodo === "POST") {
      const t = cookie(req);
      if (t) await env.DB.prepare("DELETE FROM sessoes WHERE token_hash = ?").bind(await sha256(t)).run();
      return json({ ok: true }, 200, { "set-cookie": cookieSessao("", 0) });
    }
    if (rota === "/esqueci" && metodo === "POST") {
      if (!emailAtivo(env)) return erro("A recupera\xE7\xE3o por e-mail ainda n\xE3o est\xE1 ativa. Fale com a equipe.", 503);
      if (!await limitar(env, req, "esqueci", 5, 900)) return erro("Muitas tentativas. Espere 15 minutos.", 429);
      const b = await corpo(req), email = C2.email(b.email);
      if (!C2.validEmail(email)) return erro("Confira o e-mail informado.");
      const row = await env.DB.prepare("SELECT id, perfil, credencial FROM chefs WHERE email = ?").bind(email).first();
      if (row) {
        const token = aleatorio(24), cred = JSON.parse(row.credencial || "{}");
        cred.redefinir = { hash: await sha256(token), expira: Date.now() + 36e5 };
        await env.DB.prepare("UPDATE chefs SET credencial = ? WHERE id = ?").bind(JSON.stringify(cred), row.id).run();
        const envio = enviarEmail(env, email, emailSenha(saudacao(JSON.parse(row.perfil || "{}")), new URL(req.url).origin + "/#/nova-senha/" + row.id + "/" + token));
        if (typeof waitUntil === "function") waitUntil(envio);
        else await envio;
      }
      return json({ ok: true });
    }
    if (rota === "/nova-senha" && metodo === "POST") {
      if (!await limitar(env, req, "novasenha", 10, 900)) return erro("Muitas tentativas. Espere 15 minutos.", 429);
      const b = await corpo(req), id = txt(b.id, 40), token = txt(b.token, 80), senha = String(b.senha || "");
      const invalido = /* @__PURE__ */ __name(() => erro("Este link n\xE3o vale mais. Pe\xE7a um novo \xE0 equipe.", 400), "invalido");
      if (!/^chef-[a-f\d]{16}$/.test(id) || !/^[a-f\d]{48}$/.test(token)) return invalido();
      if (senha.length < 8 || senha.length > 200) return erro("Crie uma senha com pelo menos 8 caracteres.");
      const row = await env.DB.prepare("SELECT * FROM chefs WHERE id = ?").bind(id).first();
      const r = row && (JSON.parse(row.credencial || "{}").redefinir || null);
      if (!r || !(Number(r.expira) > Date.now()) || r.hash !== await sha256(token)) return invalido();
      await env.DB.batch([
        env.DB.prepare("UPDATE chefs SET credencial = ?, atualizado_em = ? WHERE id = ?").bind(JSON.stringify(await criarCredencial(senha)), agora(), id),
        env.DB.prepare("DELETE FROM sessoes WHERE chef_id = ?").bind(id)
      ]);
      const sessao = await abrirSessao(env, id);
      return json({ chef: doDono(await env.DB.prepare("SELECT * FROM chefs WHERE id = ?").bind(id).first(), env) }, 200, { "set-cookie": cookieSessao(sessao, SESSAO_DIAS) });
    }
    if (rota === "/eu/menus" && metodo === "PUT") {
      const c = await chefDaSessao(env, req);
      if (!c) return erro("Entre de novo para salvar.", 401);
      const b = await corpo(req), p = JSON.parse(c.perfil);
      if (b.versao !== (p.menusVersao || "")) return erro("Os menus mudaram em outra aba. Recarregue antes de editar.", 409);
      const fotos = new Set([p.avatar, ...(p.gallery || []).map((g) => g.url), ...(p.menus || []).map((m) => m.photo), ...Object.values(import_service_photos.default).map((u) => "/" + u.replace(/^\//, ""))].filter(Boolean));
      const menus = import_menus_core.default.clean(b.menus, fotos), versao = aleatorio(12);
      const result = await env.DB.prepare("UPDATE chefs SET perfil=json_set(perfil,'$.menus',json(?),'$.menusVersao',?),atualizado_em=? WHERE id=? AND COALESCE(json_extract(perfil,'$.menusVersao'),'')=?").bind(JSON.stringify(menus), versao, agora(), c.id, b.versao).run();
      if (!result.meta.changes) return erro("Os menus mudaram em outra aba. Recarregue antes de editar.", 409);
      return json({ menus, versao });
    }
    if (rota === "/eu" && metodo === "PUT") {
      const c = await chefDaSessao(env, req);
      if (!c) return erro("Entre de novo para salvar.", 401);
      const b = await corpo(req), p = b.perfil || {};
      const email = C2.email(p.email || c.email);
      if (!C2.validEmail(email)) return erro("Confira o e-mail informado.");
      if (email !== c.email && C2.emailTemporario(email)) return erro("E-mails tempor\xE1rios n\xE3o s\xE3o aceitos.");
      if (email !== c.email && await env.DB.prepare("SELECT 1 FROM chefs WHERE email = ? AND id <> ?").bind(email, c.id).first()) return erro("Este e-mail j\xE1 est\xE1 cadastrado.", 409);
      const perfil = await limparPerfil(env, c.id, p, JSON.parse(c.perfil));
      const publicado = typeof p.pausado === "boolean" ? p.pausado ? 0 : 1 : c.publicado;
      await env.DB.prepare("UPDATE chefs SET email = ?, perfil = json_set(?,'$.menus',json(COALESCE(json_extract(perfil,'$.menus'),'[]')),'$.menusVersao',COALESCE(json_extract(perfil,'$.menusVersao'),'')), publicado = ?, atualizado_em = ? WHERE id = ?").bind(email, JSON.stringify(perfil), publicado, agora(), c.id).run();
      return json({ chef: doDono(await env.DB.prepare("SELECT * FROM chefs WHERE id = ?").bind(c.id).first(), env) });
    }
    if (rota === "/eu" && metodo === "DELETE") {
      const c = await chefDaSessao(env, req);
      if (!c) return erro("Entre de novo para excluir a conta.", 401);
      await env.DB.batch(["pedidos", "fotos", "sessoes"].map((t) => env.DB.prepare("DELETE FROM " + t + " WHERE chef_id = ?").bind(c.id)).concat(["seguidores", "curtidas", "comentarios"].map((t) => env.DB.prepare("DELETE FROM " + t + " WHERE chef_id = ? OR conta_id = ?").bind(c.id, c.id))).concat(["notificacoes", "denuncias"].map((t) => env.DB.prepare("DELETE FROM " + t + " WHERE conta_id = ?").bind(c.id))).concat(env.DB.prepare("DELETE FROM chefs WHERE id = ?").bind(c.id)));
      return json({ ok: true }, 200, { "set-cookie": cookieSessao("", 0) });
    }
    if (rota === "/pedidos" && metodo === "POST") {
      if (!await limitar(env, req, "pedido", 20, 3600)) return erro("Muitos pedidos seguidos. Tente mais tarde.", 429);
      const b = await corpo(req), chefId = txt(b.chefId, 40);
      const alvo = await env.DB.prepare("SELECT email, perfil FROM chefs WHERE id = ? AND publicado = 1 AND oculto = 0").bind(chefId).first();
      if (!alvo || C2.faltaPerfil(JSON.parse(alvo.perfil)).length) return erro("Chef n\xE3o encontrado.", 404);
      const texto = txt(b.texto, 6e3);
      if (texto.length < 20) return erro("Pedido incompleto.");
      const extra = b.dados && typeof b.dados === "object" ? { ...b.dados } : {};
      delete extra.status;
      if (extra.mode === "especial") {
        const perfil = JSON.parse(alvo.perfil), menu = import_menus_core.default.active(perfil.menus).find((m) => m.id === extra.menuId);
        if (!menu) return erro("Este menu n\xE3o est\xE1 mais dispon\xEDvel.", 410);
        const data = extra.f?.date, pessoas = Number(extra.pessoas);
        if (!import_menus_core.default.date(data) || data < import_menus_core.default.today() || !C2.isFree(perfil, data) || !Number.isInteger(pessoas) || pessoas < menu.serves || pessoas > 500) return erro("Confira a data e a quantidade de pessoas.");
        extra.menu = menu;
      }
      const dadosJson = JSON.stringify(extra), dados = dadosJson.length > 2e4 ? "{}" : dadosJson;
      const id = aleatorio(12);
      await env.DB.prepare("INSERT INTO pedidos (id, chef_id, texto, dados, criado_em) VALUES (?, ?, ?, ?, ?)").bind(id, chefId, texto, dados, agora()).run();
      await notificar(env, chefId, "pedido", "Comanda nova na mesa: voc\xEA recebeu um pedido de or\xE7amento.", "#/painel");
      const aviso = avisarChef(env, alvo.email, JSON.parse(alvo.perfil), texto, new URL(req.url).origin).catch(() => false);
      if (typeof waitUntil === "function") waitUntil(aviso);
      else await aviso;
      return json({ id }, 201);
    }
    if (rota === "/meus-pedidos" && metodo === "GET") {
      const c = await chefDaSessao(env, req);
      if (!c) return erro("Entre para ver seus pedidos.", 401);
      const { results } = await env.DB.prepare("SELECT id, texto, criado_em, COALESCE(json_extract(dados, '$.status'), 'novo') AS status FROM pedidos WHERE chef_id = ? ORDER BY criado_em DESC LIMIT 100").bind(c.id).all();
      return json({ pedidos: results });
    }
    if (rota.startsWith("/meus-pedidos/") && metodo === "PATCH") {
      const c = await chefDaSessao(env, req);
      if (!c) return erro("Entre de novo para atualizar o pedido.", 401);
      const id = rota.slice(14), status = String((await corpo(req)).status || "");
      if (!["novo", "respondido", "fechado"].includes(status)) return erro("Informe uma situa\xE7\xE3o v\xE1lida.");
      const r = await env.DB.prepare("UPDATE pedidos SET dados = json_set(dados, '$.status', ?) WHERE id = ? AND chef_id = ?").bind(status, id, c.id).run();
      if (!r.meta.changes) return erro("Pedido n\xE3o encontrado.", 404);
      return json({ ok: true, status });
    }
    if (rota === "/notificacoes" && metodo === "GET") {
      const c = await chefDaSessao(env, req);
      if (!c) return erro("Entre para ver seus avisos.", 401);
      const { results } = await env.DB.prepare("SELECT id, tipo, texto, link, lida, criado_em FROM notificacoes WHERE conta_id = ? ORDER BY criado_em DESC LIMIT 30").bind(c.id).all();
      return json({ avisos: results.map((r) => ({ ...r, lida: !!r.lida })), naoLidas: results.filter((r) => !r.lida).length }, 200, { "cache-control": "no-store" });
    }
    if (rota === "/notificacoes/lidas" && metodo === "POST") {
      const c = await chefDaSessao(env, req);
      if (!c) return erro("Entre de novo.", 401);
      await env.DB.prepare("UPDATE notificacoes SET lida = 1 WHERE conta_id = ? AND lida = 0").bind(c.id).run();
      return json({ ok: true });
    }
    if (rota === "/admin/comentarios" && metodo === "GET") {
      const c = await chefDaSessao(env, req);
      if (!c) return erro("Entre com a conta da equipe.", 401);
      if (!ehAdmin(env, c)) return erro("Acesso s\xF3 para a equipe.", 403);
      const { results } = await env.DB.prepare("SELECT m.id, m.chef_id, m.texto, m.criado_em, json_extract(a.perfil, '$.name') autor, json_extract(f.perfil, '$.name') chef, (SELECT COUNT(*) FROM denuncias d WHERE d.comentario_id = m.id) denuncias FROM comentarios m LEFT JOIN chefs a ON a.id = m.conta_id LEFT JOIN chefs f ON f.id = m.chef_id ORDER BY denuncias DESC, m.criado_em DESC LIMIT 200").all();
      return json({ comentarios: results }, 200, { "cache-control": "no-store" });
    }
    if (rota === "/admin/chefs" || rota.startsWith("/admin/chefs/")) {
      const c = await chefDaSessao(env, req);
      if (!c) return erro("Entre com a conta da equipe.", 401);
      if (!ehAdmin(env, c)) return erro("Acesso s\xF3 para a equipe.", 403);
      if (rota === "/admin/chefs" && metodo === "GET") {
        const { results } = await env.DB.prepare(`SELECT c.id, c.email, c.perfil, c.publicado, c.oculto, c.criado_em, c.atualizado_em, c.google_sub,
          (SELECT COUNT(*) FROM pedidos p WHERE p.chef_id = c.id) AS pedidos,
          (SELECT COUNT(*) FROM pedidos p WHERE p.chef_id = c.id AND p.criado_em > ?) AS pedidos7,
          (SELECT MAX(p.criado_em) FROM pedidos p WHERE p.chef_id = c.id) AS ultimo
          FROM chefs c ORDER BY c.criado_em DESC`).bind(new Date(Date.now() - 7 * 864e5).toISOString()).all();
        return json({ chefs: results.map((r) => {
          const p = JSON.parse(r.perfil || "{}");
          return {
            id: r.id,
            email: r.email,
            nome: p.name || "",
            cidades: p.cities || "",
            especialidade: p.specialty || "",
            whatsapp: p.whatsapp || "",
            foto: p.avatar || p.gallery && p.gallery[0] && p.gallery[0].url || "",
            pratos: (p.dishes || []).length,
            fotos: (p.gallery || []).length,
            falta: C2.faltaPerfil({ ...p, id: r.id }),
            pausado: !r.publicado,
            oculto: !!r.oculto,
            google: !!r.google_sub,
            criado_em: r.criado_em,
            atualizado_em: r.atualizado_em,
            pedidos: r.pedidos,
            pedidos7: r.pedidos7,
            ultimo: r.ultimo
          };
        }) });
      }
      const id = rota.slice(13);
      if (/^chef-[a-f\d]{16}$/.test(id) && ["GET", "PUT"].includes(metodo)) {
        const alvo = await env.DB.prepare("SELECT * FROM chefs WHERE id = ?").bind(id).first();
        if (!alvo) return erro("Chef n\xE3o encontrado.", 404);
        if (metodo === "GET") return json({ chef: doDono(alvo, env), versao: alvo.atualizado_em });
        const b = await corpo(req);
        if (b.versao !== alvo.atualizado_em) return erro("O perfil foi atualizado. Reabra antes de editar.", 409);
        const perfil = await limparPerfil(env, id, b.perfil || {}, JSON.parse(alvo.perfil));
        const versao = agora();
        await env.DB.prepare("UPDATE chefs SET perfil = json_set(?,'$.menus',json(COALESCE(json_extract(perfil,'$.menus'),'[]')),'$.menusVersao',COALESCE(json_extract(perfil,'$.menusVersao'),'')), atualizado_em = ? WHERE id = ?").bind(JSON.stringify(perfil), versao, id).run();
        return json({ chef: doDono(await env.DB.prepare("SELECT * FROM chefs WHERE id = ?").bind(id).first(), env), versao });
      }
      if (/^chef-[a-f\d]{16}$/.test(id) && metodo === "POST") {
        const b = await corpo(req);
        if (b.acao === "nova-senha") {
          const alvo = await env.DB.prepare("SELECT credencial FROM chefs WHERE id = ?").bind(id).first();
          if (!alvo) return erro("Chef n\xE3o encontrado.", 404);
          const token = aleatorio(24), cred = JSON.parse(alvo.credencial || "{}");
          cred.redefinir = { hash: await sha256(token), expira: Date.now() + 48 * 36e5 };
          await env.DB.prepare("UPDATE chefs SET credencial = ? WHERE id = ?").bind(JSON.stringify(cred), id).run();
          return json({ ok: true, horas: 48, link: new URL(req.url).origin + "/#/nova-senha/" + id + "/" + token });
        }
        if (typeof b.oculto !== "boolean") return erro("Informe se o perfil fica escondido.");
        const r = await env.DB.prepare("UPDATE chefs SET oculto = ?, atualizado_em = ? WHERE id = ?").bind(b.oculto ? 1 : 0, agora(), id).run();
        if (!r.meta.changes) return erro("Chef n\xE3o encontrado.", 404);
        return json({ ok: true, oculto: b.oculto });
      }
      if (/^chef-[a-f\d]{16}$/.test(id) && metodo === "DELETE") {
        if (id === c.id) return erro("Para excluir a sua pr\xF3pria conta, use Painel > Configura\xE7\xF5es.");
        if (!await env.DB.prepare("SELECT 1 FROM chefs WHERE id = ?").bind(id).first()) return erro("Chef n\xE3o encontrado.", 404);
        await env.DB.batch(["pedidos", "fotos", "sessoes"].map((t) => env.DB.prepare("DELETE FROM " + t + " WHERE chef_id = ?").bind(id)).concat(["seguidores", "curtidas", "comentarios"].map((t) => env.DB.prepare("DELETE FROM " + t + " WHERE chef_id = ? OR conta_id = ?").bind(id, id))).concat(["notificacoes", "denuncias"].map((t) => env.DB.prepare("DELETE FROM " + t + " WHERE conta_id = ?").bind(id))).concat(env.DB.prepare("DELETE FROM chefs WHERE id = ?").bind(id)));
        return json({ ok: true });
      }
    }
    return erro("Rota n\xE3o encontrada.", 404);
  } catch (e3) {
    const msg = e3 && e3.message && /[áéíóúãõç]|Informe|Confira|Envie/.test(e3.message) ? e3.message : "Erro no servidor. Tente de novo.";
    return erro(msg, e3 instanceof SyntaxError ? 400 : msg.startsWith("Erro") ? 500 : 400);
  }
}
var import_app_core2, import_site_settings, import_dashboard_core, import_menus_core, import_service_photos, C2, SESSAO_DIAS, PBKDF2_ITER, enc, json, erro, agora, hex, aleatorio, sha256, cookieSessao, txt, FOTO_LOCAL, DATA_URL, b64url, googleOn, cookieOauth, voltar, publico, ehAdmin, nomeDe, doDono, escH, pEmail, saudacao, emailAtivo, esquemaOk;
var init_rota = __esm({
  "api/[[rota]].js"() {
    init_functionsRoutes_0_6006401703432819();
    import_app_core2 = __toESM(require_app_core());
    import_site_settings = __toESM(require_site_settings());
    import_dashboard_core = __toESM(require_dashboard_core());
    import_menus_core = __toESM(require_menus_core());
    import_service_photos = __toESM(require_service_photos());
    C2 = import_app_core2.default && import_app_core2.default.normalizeData ? import_app_core2.default : globalThis.ChefCore;
    SESSAO_DIAS = 30;
    PBKDF2_ITER = 1e5;
    enc = new TextEncoder();
    json = /* @__PURE__ */ __name((data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
      status,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers }
    }), "json");
    erro = /* @__PURE__ */ __name((msg, status = 400) => json({ erro: msg }, status), "erro");
    agora = /* @__PURE__ */ __name(() => (/* @__PURE__ */ new Date()).toISOString(), "agora");
    hex = /* @__PURE__ */ __name((b) => Array.from(new Uint8Array(b), (x2) => x2.toString(16).padStart(2, "0")).join(""), "hex");
    aleatorio = /* @__PURE__ */ __name((n = 16) => hex(crypto.getRandomValues(new Uint8Array(n))), "aleatorio");
    sha256 = /* @__PURE__ */ __name(async (s) => hex(await crypto.subtle.digest("SHA-256", enc.encode(s))), "sha256");
    __name(derivar, "derivar");
    __name(criarCredencial, "criarCredencial");
    __name(conferirSenha, "conferirSenha");
    __name(cookie, "cookie");
    cookieSessao = /* @__PURE__ */ __name((token, dias) => `scc_sessao=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${Math.round(dias * 86400)}`, "cookieSessao");
    __name(chefDaSessao, "chefDaSessao");
    __name(abrirSessao, "abrirSessao");
    __name(limitar, "limitar");
    txt = /* @__PURE__ */ __name((v, max) => String(v ?? "").trim().slice(0, max), "txt");
    FOTO_LOCAL = /^\/api\/foto\/[a-f\d]{32}$/;
    DATA_URL = /^data:image\/jpeg;base64,([a-z\d+/=]+)$/i;
    __name(limparPerfil, "limparPerfil");
    b64url = /* @__PURE__ */ __name((buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), "b64url");
    googleOn = /* @__PURE__ */ __name((env) => !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET), "googleOn");
    __name(googleUrls, "googleUrls");
    cookieOauth = /* @__PURE__ */ __name((estado, seg) => `scc_oauth=${estado}; Path=/api/google; HttpOnly; Secure; SameSite=Lax; Max-Age=${seg}`, "cookieOauth");
    voltar = /* @__PURE__ */ __name((origem, destino2, extra = {}) => new Response(null, { status: 302, headers: { location: origem + destino2, "cache-control": "no-store", ...extra } }), "voltar");
    __name(lerIdToken, "lerIdToken");
    publico = /* @__PURE__ */ __name((row) => {
      const p = JSON.parse(row.perfil);
      delete p.menusVersao;
      return { ...p, menus: import_menus_core.default.active(p.menus), id: row.id, cloud: true };
    }, "publico");
    ehAdmin = /* @__PURE__ */ __name((env, row) => !!row && C2.isAdminEmail(row.email), "ehAdmin");
    __name(notificar, "notificar");
    nomeDe = /* @__PURE__ */ __name((row) => {
      try {
        return txt(JSON.parse(row.perfil).name, 60) || "Algu\xE9m";
      } catch {
        return "Algu\xE9m";
      }
    }, "nomeDe");
    doDono = /* @__PURE__ */ __name((row, env = {}) => ({ ...publico(row), menus: JSON.parse(row.perfil).menus || [], menusVersao: JSON.parse(row.perfil).menusVersao || "", email: row.email, pausado: !row.publicado, oculto: !!row.oculto, admin: ehAdmin(env, row) }), "doDono");
    escH = /* @__PURE__ */ __name((t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), "escH");
    pEmail = /* @__PURE__ */ __name((h) => '<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#283b30">' + h + "</p>", "pEmail");
    saudacao = /* @__PURE__ */ __name((perfil) => {
      const n = txt(perfil && perfil.name, 80) || "Chef";
      return perfil && perfil.tipo === "cliente" ? n : /^chef\b/i.test(n) ? n : "Chef " + n;
    }, "saudacao");
    __name(layoutEmail, "layoutEmail");
    __name(emailPedido, "emailPedido");
    emailAtivo = /* @__PURE__ */ __name((env) => !!(env.EMAIL_REMETENTE && (env.EMAIL_API_TESTE || env.RESEND_API_KEY || env.CF_ACCOUNT_ID && env.CF_EMAIL_TOKEN)), "emailAtivo");
    __name(enviarEmail, "enviarEmail");
    __name(avisarChef, "avisarChef");
    __name(emailSenha, "emailSenha");
    __name(corpo, "corpo");
    esquemaOk = false;
    __name(garantirEsquema, "garantirEsquema");
    __name(onRequest3, "onRequest");
  }
});

// m/[[rota]].js
async function onRequest4({ request, env, params }) {
  const [id, mid, ...extra] = Array.isArray(params.rota) ? params.rota : [], origin = new URL(request.url).origin;
  const headers = { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff", "content-security-policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'" };
  let c, m;
  if (env.DB && id && mid && !extra.length) {
    const row = await env.DB.prepare("SELECT perfil FROM chefs WHERE id = ? AND publicado = 1 AND COALESCE(oculto, 0) = 0").bind(id).first();
    if (row) {
      c = { ...JSON.parse(row.perfil), id };
      if (!import_app_core3.default.faltaPerfil(c).length) m = import_menus_core2.default.active(c.menus).find((m2) => m2.id === mid);
    }
  }
  if (!m) return new Response('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Menu indispon\xEDvel</title><body><h1>Este menu n\xE3o est\xE1 dispon\xEDvel.</h1><p>O prazo terminou ou o chef pausou a divulga\xE7\xE3o.</p><a href="/#/especiais">Conhecer outros menus</a></body></html>', { status: 404, headers });
  const image = /^\/(?:api\/foto\/[a-f\d]{32}|assets\/(?:servicos|apresentacao)\/[a-z0-9-]+\.webp)$/.test(m.photo) ? origin + m.photo : "", description = import_menus_core2.default.price(m) + " \xB7 " + import_menus_core2.default.quantity(m) + " \xB7 " + import_menus_core2.default.modes[m.mode] + " \xB7 Por " + c.name;
  return new Response('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + e2(m.title) + " \xB7 " + e2(c.name) + '</title><meta name="description" content="' + e2(description) + '"><meta property="og:type" content="website"><meta property="og:title" content="' + e2(m.title) + " \xB7 " + e2(c.name) + '"><meta property="og:description" content="' + e2(description) + '"><meta property="og:image" content="' + e2(image) + '"><meta property="og:url" content="' + e2(import_menus_core2.default.link(origin, c, m)) + '"><meta name="twitter:card" content="summary_large_image"><style>body{margin:0;background:#f6f3eb;color:#303629;font:17px/1.7 Arial,sans-serif}main{max-width:880px;margin:48px auto;padding:0 24px}img{width:100%;max-height:440px;object-fit:cover;border-radius:22px}h1{font:48px/1.1 Georgia,serif}h2{font:30px Georgia,serif}small{color:#754653}a{color:#455238}.button{display:inline-block;padding:16px 24px;background:#455238;color:#fffdf8;border-radius:12px;text-decoration:none}.items{white-space:pre-line}footer{border-top:1px solid #dedfd2;margin-top:40px;padding:24px 0}.price{font-size:26px;font-weight:bold}</style></head><body><main><small>' + e2(m.occasion) + " \xB7 " + e2(import_menus_core2.default.modes[m.mode]) + "</small><h1>" + e2(m.title) + "</h1><p>Por " + e2(c.name) + " \xB7 " + e2(c.cities) + '</p><img src="' + e2(image) + '" alt="' + e2(m.title) + '"><p>' + e2(m.description) + '</p><p class="price">' + e2(import_menus_core2.default.price(m)) + "</p><p>" + e2(import_menus_core2.default.quantity(m)) + '</p><h2>O card\xE1pio</h2><p class="items">' + e2(m.items) + '</p><h2>O que est\xE1 incluso</h2><p class="items">' + e2(m.includes) + "</p><p>Encomendas at\xE9 " + e2(m.deadline.split("-").reverse().join("/")) + '. Valores e disponibilidade sujeitos \xE0 confirma\xE7\xE3o pelo chef.</p><a class="button" href="/#/menu/' + encodeURIComponent(id) + "/" + encodeURIComponent(mid) + '">Pedir or\xE7amento deste menu \u2192</a><footer><a href="/">Seu Chef em Casa</a> \xB7 Encontros em torno da boa comida.</footer></main></body></html>', { headers });
}
var import_menus_core2, import_app_core3, e2;
var init_rota2 = __esm({
  "m/[[rota]].js"() {
    init_functionsRoutes_0_6006401703432819();
    import_menus_core2 = __toESM(require_menus_core());
    import_app_core3 = __toESM(require_app_core());
    e2 = /* @__PURE__ */ __name((s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), "e");
    __name(onRequest4, "onRequest");
  }
});

// personal-chef/[[cidade]].js
async function onRequest5({ request, env, params }) {
  const url = new URL(request.url), partes = [].concat(params.cidade || []);
  const chefs = await chefsVisiveis(env), prod = producao(request.url);
  if (!partes.length) {
    const comChef = CIDADES.map(([s, n]) => [s, n, chefs.filter((c) => atende(c.p, s)).length]);
    return lista({
      url: "/personal-chef",
      titulo: "Personal chef em Santa Catarina, por cidade \xB7 Seu Chef em Casa",
      desc: "Encontre personal chefs que cozinham na sua casa em Florian\xF3polis, Balne\xE1rio Cambori\xFA, Joinville, Blumenau e outras cidades de SC.",
      olho: "Santa Catarina",
      h1: "Personal chef na sua cidade",
      trilha: [["Personal chef em SC", "/personal-chef"]],
      intro: ["Escolha a cidade e veja quem cozinha por a\xED. Cada chef mostra o card\xE1pio, as fotos dos pratos e como trabalha antes de voc\xEA pedir o or\xE7amento."],
      chefs: [],
      vazio: ["Escolha a cidade abaixo", "Ainda estamos montando a brigada de Santa Catarina. Se voc\xEA \xE9 chef, entre e monte seu perfil."],
      blocos: [["Cidades", links(comChef.map(([s, n, k]) => [n + (k ? " (" + k + ")" : ""), "/personal-chef/" + s]))]],
      perguntas: PERGUNTAS(""),
      noindex: !prod || !chefs.length
    }, url.origin);
  }
  const cidade = CIDADES.find(([s]) => s === partes[0]);
  if (!cidade || partes.length > 1) return naoAchou();
  const [slug, nome] = cidade, daqui = chefs.filter((c) => atende(c.p, slug));
  const servicos = SERVICOS.filter((s) => daqui.some((c) => fazServico(c.p, s)));
  return lista({
    url: "/personal-chef/" + slug,
    titulo: "Personal chef em " + nome + " \xB7 Seu Chef em Casa",
    desc: "Personal chefs que atendem em " + nome + ": veja card\xE1pios, fotos dos pratos e pe\xE7a seu or\xE7amento para jantar, almo\xE7o ou evento em casa.",
    olho: "Personal chef \xB7 " + nome + ", SC",
    h1: "Personal chef em " + nome,
    trilha: [["Personal chef em SC", "/personal-chef"], [nome, "/personal-chef/" + slug]],
    intro: [
      "O chef vem at\xE9 a sua casa, cozinha na sua cozinha e serve na sua mesa. Aqui voc\xEA v\xEA o card\xE1pio de cada um antes de pedir o or\xE7amento.",
      daqui.length ? (daqui.length === 1 ? "Um chef atende " : daqui.length + " chefs atendem ") + "em " + nome + " pelo Seu Chef em Casa." : ""
    ].filter(Boolean),
    tituloChefs: "Chefs que atendem em " + nome,
    chefs: daqui,
    vazio: ["A brigada de " + nome + " est\xE1 sendo montada", "Ainda n\xE3o h\xE1 chef de " + nome + " com perfil completo por aqui. Se voc\xEA cozinha na cidade, entre e monte seu perfil; ele aparece nesta p\xE1gina assim que estiver pronto."],
    perguntas: PERGUNTAS(nome),
    blocos: [
      ...servicos.length ? [["O que os chefs de " + nome + " fazem", links(servicos.map((s) => [s.nome, "/servicos/" + s.slug]))]] : [],
      ["Outras cidades", links(CIDADES.filter(([s]) => s !== slug).map(([s, n]) => [n, "/personal-chef/" + s]))]
    ],
    noindex: !prod || !daqui.length
  }, url.origin);
}
var init_cidade = __esm({
  "personal-chef/[[cidade]].js"() {
    init_functionsRoutes_0_6006401703432819();
    init_seo();
    __name(onRequest5, "onRequest");
  }
});

// servicos/[[servico]].js
async function onRequest6({ request, env, params }) {
  const url = new URL(request.url), partes = [].concat(params.servico || []);
  const chefs = await chefsVisiveis(env), prod = producao(request.url);
  if (!partes.length) {
    return lista({
      url: "/servicos",
      titulo: "Experi\xEAncias com personal chef em casa \xB7 Seu Chef em Casa",
      desc: "Noite da Pizza, churrasco, jantar harmonizado, marmitas da semana e outras experi\xEAncias com personal chef em Santa Catarina.",
      olho: "Card\xE1pio de experi\xEAncias",
      h1: "O que um chef pode fazer na sua casa",
      trilha: [["Experi\xEAncias", "/servicos"]],
      intro: ["Do caf\xE9 da manh\xE3 \xE0 sequ\xEAncia de frutos do mar: escolha a ocasi\xE3o e veja os chefs que fazem."],
      chefs: [],
      vazio: ["Escolha a experi\xEAncia abaixo", "Cada chef marca no perfil o que faz. As p\xE1ginas mostram s\xF3 quem tem perfil completo."],
      blocos: [["Experi\xEAncias", links(SERVICOS.map((s2) => [s2.nome, "/servicos/" + s2.slug]))]],
      noindex: !prod || !chefs.length
    }, url.origin);
  }
  const s = SERVICOS.find((x2) => x2.slug === partes[0]);
  if (!s || partes.length > 1) return naoAchou();
  const fazem = chefs.filter((c) => fazServico(c.p, s));
  const cidades = CIDADES.filter(([cs]) => fazem.some((c) => atende(c.p, cs)));
  return lista({
    url: "/servicos/" + s.slug,
    titulo: s.nome + " com personal chef em SC \xB7 Seu Chef em Casa",
    desc: s.desc + " Veja os chefs que fazem " + s.nome + " em Santa Catarina e pe\xE7a seu or\xE7amento.",
    olho: "Experi\xEAncia com chef em casa",
    h1: s.nome,
    trilha: [["Experi\xEAncias", "/servicos"], [s.nome, "/servicos/" + s.slug]],
    intro: [s.desc, "O chef leva a experi\xEAncia at\xE9 a sua casa. Voc\xEA escolhe os pratos, conta quantas pessoas v\xEAm e o pedido segue para o WhatsApp dele."],
    tituloChefs: "Chefs que fazem " + s.nome,
    chefs: fazem,
    vazio: ["Ainda sem chef para " + s.nome, "Nenhum chef com perfil completo marcou esta experi\xEAncia ainda. Se voc\xEA faz " + s.nome + ", marque no seu perfil e apare\xE7a aqui."],
    perguntas: PERGUNTAS("").slice(1),
    blocos: [
      ...cidades.length ? [["Onde tem", links(cidades.map(([cs, n]) => [n, "/personal-chef/" + cs]))]] : [],
      ["Outras experi\xEAncias", links(SERVICOS.filter((x2) => x2 !== s).map((x2) => [x2.nome, "/servicos/" + x2.slug]))]
    ],
    noindex: !prod || !fazem.length
  }, url.origin);
}
var init_servico = __esm({
  "servicos/[[servico]].js"() {
    init_functionsRoutes_0_6006401703432819();
    init_seo();
    __name(onRequest6, "onRequest");
  }
});

// admin.js
function onRequest7({ request }) {
  return Response.redirect(new URL("/#/admin", request.url).href, 302);
}
var init_admin = __esm({
  "admin.js"() {
    init_functionsRoutes_0_6006401703432819();
    __name(onRequest7, "onRequest");
  }
});

// sitemap.xml.js
async function onRequest8({ env }) {
  const chefs = await chefsVisiveis(env);
  const urls = [[SITE + "/", ""]];
  if (chefs.length) urls.push([SITE + "/personal-chef", ""], [SITE + "/servicos", ""]);
  for (const [s] of CIDADES) if (chefs.some((c) => atende(c.p, s))) urls.push([SITE + "/personal-chef/" + s, ""]);
  for (const s of SERVICOS) if (chefs.some((c) => fazServico(c.p, s))) urls.push([SITE + "/servicos/" + s.slug, ""]);
  for (const c of chefs) urls.push([SITE + "/chef/" + c.slug, dia(c.atualizado)]);
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(([u, d]) => "  <url><loc>" + x(u) + "</loc>" + (d ? "<lastmod>" + d + "</lastmod>" : "") + "</url>").join("\n") + "\n</urlset>\n";
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
var x, dia;
var init_sitemap_xml = __esm({
  "sitemap.xml.js"() {
    init_functionsRoutes_0_6006401703432819();
    init_seo();
    x = /* @__PURE__ */ __name((t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]), "x");
    dia = /* @__PURE__ */ __name((t) => /^\d{4}-\d{2}-\d{2}/.test(String(t || "")) ? String(t).slice(0, 10) : "", "dia");
    __name(onRequest8, "onRequest");
  }
});

// _middleware.js
function pagina(para, erro2, status) {
  const html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#141a17"><title>Seu Chef em Casa \xB7 em breve</title><style>' + ESTILO3 + "</style></head><body><main" + (erro2 ? ' class="aberto"' : "") + '><p class="marca">Seu Chef em Casa</p><h1>Grandes coisas est\xE3o para acontecer.</h1><p class="aguarde">O fogo j\xE1 est\xE1 aceso. Aguarde\u2026</p><div class="fio" aria-hidden="true"></div><form method="post" action="/acesso"><input type="hidden" name="para" value="' + esc(para) + '"><label for="senha">Se voc\xEA sabe de algum segredo desta cozinha, digite a senha.</label><input id="senha" name="senha" type="password" autocomplete="current-password" required autofocus>' + (erro2 ? '<p class="erro" role="alert">' + esc(erro2) + "</p>" : "") + '<button type="submit">Entrar</button></form></main></body></html>';
  return new Response(html, { status, headers: CABECALHOS3 });
}
async function onRequest9({ request: req, env, next }) {
  const url = new URL(req.url);
  if (req.method === "GET" && url.pathname === "/acesso" && url.searchParams.has("previa")) return pagina("/", "", 200);
  const senha = LIGADA ? String(env.SENHA_SITE || "").trim() : "";
  if (!senha) return next();
  const esperado = await marca(senha);
  const m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)scc_acesso=([a-f\d]{64})/);
  const liberado = !!m && m[1] === esperado;
  if (req.method === "POST" && url.pathname === "/acesso") {
    let f = null;
    try {
      f = await req.formData();
    } catch (e3) {
      f = null;
    }
    const para = destino(f && f.get("para"));
    if (f && String(f.get("senha") || "").trim() === senha) {
      return new Response(null, { status: 303, headers: {
        location: para,
        "cache-control": "no-store",
        "set-cookie": COOKIE + "=" + esperado + "; Path=/; Max-Age=" + DIAS * 86400 + "; HttpOnly; Secure; SameSite=Lax"
      } });
    }
    await new Promise((r) => setTimeout(r, 700));
    return pagina(para, "Esse n\xE3o \xE9 o ingrediente secreto. Tente de novo.", 401);
  }
  if (liberado) return url.pathname === "/acesso" ? Response.redirect(url.origin + "/", 303) : next();
  if (url.pathname.startsWith("/api/")) {
    return new Response(JSON.stringify({ erro: "Site fechado para testes." }), { status: 401, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
  }
  if (req.method !== "GET" && req.method !== "HEAD") return new Response("Site fechado para testes.", { status: 401, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  return pagina(url.pathname === "/acesso" ? "/" : destino(url.pathname + url.search), "", 401);
}
var LIGADA, COOKIE, DIAS, enc2, hex2, marca, esc, destino, CABECALHOS3, SERIFA2, ESTILO3;
var init_middleware = __esm({
  "_middleware.js"() {
    init_functionsRoutes_0_6006401703432819();
    LIGADA = false;
    COOKIE = "scc_acesso";
    DIAS = 30;
    enc2 = new TextEncoder();
    hex2 = /* @__PURE__ */ __name((buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""), "hex");
    marca = /* @__PURE__ */ __name(async (senha) => hex2(await crypto.subtle.digest("SHA-256", enc2.encode("seu-chef-em-casa:acesso:" + senha))), "marca");
    esc = /* @__PURE__ */ __name((t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]), "esc");
    destino = /* @__PURE__ */ __name((p) => {
      p = String(p || "/");
      return p.startsWith("/") && !p.startsWith("//") && !p.includes("\\") && p.length < 500 ? p : "/";
    }, "destino");
    CABECALHOS3 = {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow",
      "x-frame-options": "DENY",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'"
    };
    SERIFA2 = 'Georgia,"Times New Roman",serif';
    ESTILO3 = [
      "*{box-sizing:border-box}",
      'body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#141a17;background-image:radial-gradient(ellipse at 50% -10%,#27332c 0%,#141a17 60%);color:#f1ece2;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:32px 26px}',
      "main{width:100%;max-width:380px;text-align:center}",
      "main>*{animation:surgir 1.1s cubic-bezier(.2,.6,.2,1) both}",
      ".marca{animation-delay:.1s}h1{animation-delay:.35s}.aguarde{animation-delay:.7s}.fio{animation-delay:1s}form{animation-delay:1.25s}",
      "@keyframes surgir{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}",
      ".marca{font-size:.7rem;letter-spacing:.32em;text-transform:uppercase;color:#c9a46a;margin:0 0 34px}",
      "h1{font-family:" + SERIFA2 + ";font-weight:400;font-size:2rem;line-height:1.22;letter-spacing:.005em;margin:0 0 16px}",
      ".aguarde{font-family:" + SERIFA2 + ";font-style:italic;font-size:1.08rem;color:#b9b3a6;margin:0}",
      ".fio{width:44px;height:1px;background:#c9a46a;margin:38px auto;opacity:.8}",
      "label{display:block;font-size:.92rem;line-height:1.5;color:#b9b3a6;margin-bottom:18px}",
      "input{width:100%;font:inherit;font-size:1.1rem;letter-spacing:.28em;text-align:center;padding:12px 8px;border:0;border-bottom:1px solid rgba(241,236,226,.45);border-radius:0;background:transparent;color:#f1ece2}",
      "input:focus{outline:0;border-bottom-color:#c9a46a;box-shadow:0 1px 0 #c9a46a}",
      "input:focus-visible{outline:2px solid #c9a46a;outline-offset:6px}",
      "button{margin-top:30px;font:inherit;font-size:.78rem;font-weight:600;letter-spacing:.24em;text-transform:uppercase;padding:15px 30px;min-height:48px;border:1px solid #c9a46a;border-radius:2px;background:transparent;color:#e2c48f;cursor:pointer;transition:background .2s,color .2s}",
      "button:hover{background:#c9a46a;color:#141a17}button:focus-visible{outline:2px solid #f1ece2;outline-offset:3px}",
      ".erro{color:#f0a999;font-size:.9rem;margin:16px 0 0}",
      ".aberto>*{animation:none}",
      "@media (prefers-reduced-motion:reduce){main>*{animation:none}}"
    ].join("");
    __name(pagina, "pagina");
    __name(onRequest9, "onRequest");
  }
});

// ../.wrangler/tmp/pages-vKpeS4/functionsRoutes-0.6006401703432819.mjs
var routes;
var init_functionsRoutes_0_6006401703432819 = __esm({
  "../.wrangler/tmp/pages-vKpeS4/functionsRoutes-0.6006401703432819.mjs"() {
    init_id();
    init_slug();
    init_rota();
    init_rota2();
    init_cidade();
    init_servico();
    init_admin();
    init_sitemap_xml();
    init_middleware();
    routes = [
      {
        routePath: "/c/:id",
        mountPath: "/c",
        method: "",
        middlewares: [],
        modules: [onRequest]
      },
      {
        routePath: "/chef/:slug",
        mountPath: "/chef",
        method: "",
        middlewares: [],
        modules: [onRequest2]
      },
      {
        routePath: "/api/:rota*",
        mountPath: "/api",
        method: "",
        middlewares: [],
        modules: [onRequest3]
      },
      {
        routePath: "/m/:rota*",
        mountPath: "/m",
        method: "",
        middlewares: [],
        modules: [onRequest4]
      },
      {
        routePath: "/personal-chef/:cidade*",
        mountPath: "/personal-chef",
        method: "",
        middlewares: [],
        modules: [onRequest5]
      },
      {
        routePath: "/servicos/:servico*",
        mountPath: "/servicos",
        method: "",
        middlewares: [],
        modules: [onRequest6]
      },
      {
        routePath: "/admin",
        mountPath: "/",
        method: "",
        middlewares: [],
        modules: [onRequest7]
      },
      {
        routePath: "/sitemap.xml",
        mountPath: "/",
        method: "",
        middlewares: [],
        modules: [onRequest8]
      },
      {
        routePath: "/",
        mountPath: "/",
        method: "",
        middlewares: [onRequest9],
        modules: []
      }
    ];
  }
});

// ../.wrangler/tmp/bundle-cQtxnd/middleware-loader.entry.ts
init_functionsRoutes_0_6006401703432819();

// ../.wrangler/tmp/bundle-cQtxnd/middleware-insertion-facade.js
init_functionsRoutes_0_6006401703432819();

// ../../../../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
init_functionsRoutes_0_6006401703432819();

// ../../../../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
init_functionsRoutes_0_6006401703432819();
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x2) {
    return x2;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x2) {
    return x2;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function getOriginalPathPrefix(requestPath, normalizedPrefix) {
  let end = 0;
  for (let index = 0; index < normalizedPrefix.length; index++) {
    end++;
    if (normalizedPrefix[index] === "/") {
      while (requestPath[end] === "/") {
        end++;
      }
    }
  }
  return requestPath.slice(0, end);
}
__name(getOriginalPathPrefix, "getOriginalPathPrefix");
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  const normalizedRequestPath = requestPath.replace(/\/+/g, "/");
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath) || routeMatcher(normalizedRequestPath);
    const originalMountMatch = mountMatcher(requestPath);
    const mountMatchResult = originalMountMatch || mountMatcher(normalizedRequestPath);
    if (matchResult && mountMatchResult) {
      const path = originalMountMatch ? originalMountMatch.path : getOriginalPathPrefix(requestPath, mountMatchResult.path);
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../../../../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_functionsRoutes_0_6006401703432819();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e3) {
      console.error("Failed to drain the unused request body.", e3);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_functionsRoutes_0_6006401703432819();
function reduceError(e3) {
  return {
    name: e3?.name,
    message: e3?.message ?? String(e3),
    stack: e3?.stack,
    cause: e3?.cause === void 0 ? void 0 : reduceError(e3.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e3) {
    const error = reduceError(e3);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-cQtxnd/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../../../../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
init_functionsRoutes_0_6006401703432819();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-cQtxnd/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.744769993801447.mjs.map
