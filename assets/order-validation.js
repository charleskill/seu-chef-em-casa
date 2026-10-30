(function(root){
  'use strict';
  function validateOrder(order, now, chef){
    const f=order.f||{};
    if(!String(f.name||'').trim()) return 'Informe seu nome.';
    const phone=String(f.phone||'').trim();
    let digits=phone.replace(/\D/g,'');
    if(digits.length>11 && digits.startsWith('55')) digits=digits.slice(2);
    if(!/^[+\d\s().-]+$/.test(phone) || !/^[1-9]\d{9,10}$/.test(digits)) return 'Informe um telefone válido com DDD.';
    if(f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return 'Confira o e-mail informado.';
    if(f.date){
      const date=new Date(f.date+'T12:00:00');
      const current=now||new Date();
      const today=new Date(current.getFullYear(),current.getMonth(),current.getDate());
      if(!/^\d{4}-\d{2}-\d{2}$/.test(f.date) || Number.isNaN(date.getTime()) || date.getFullYear()!==Number(f.date.slice(0,4)) || date.getMonth()+1!==Number(f.date.slice(5,7)) || date.getDate()!==Number(f.date.slice(8,10)) || date<today) return 'Escolha uma data válida, a partir de hoje.';
      if(chef && chef.agenda && Array.isArray(chef.agenda.off) && chef.agenda.off.includes(f.date)) return 'Este chef não atende na data escolhida. Escolha outra data.';
    }
    if(order.mode==='marmita'){
      const m=order.m||{},cfg=chef&&chef.marmita;
      if(chef&&!cfg) return 'Este chef ainda não oferece marmitas.';
      if(!['semanal','quinzenal','mensal'].includes(m.freq)||(cfg&&!cfg.freq.includes(m.freq))) return 'Escolha uma frequência de entrega oferecida pelo chef.';
      if(!Number.isInteger(m.qty)||m.qty<1) return 'Informe quantas marmitas por entrega.';
      if(cfg&&m.qty<cfg.min) return 'Este chef atende a partir de '+cfg.min+' marmitas por entrega.';
      if(m.qty>500) return 'Informe até 500 marmitas por entrega.';
      if(!Number.isInteger(m.months)||m.months<1||m.months>24) return 'Escolha a duração do plano.';
      if(!['entrega','casa'].includes(m.way)||(cfg&&!cfg.modes.includes(m.way))) return 'Escolha uma forma de atendimento oferecida pelo chef.';
      if(!Array.isArray(m.days)||!m.days.length) return 'Escolha ao menos um dia da semana para a entrega ou o preparo.';
    }
    if(!Array.isArray(order.dishes)||!order.dishes.length) return 'Escolha ao menos um prato do cardápio.';
    return '';
  }
  if(typeof module!=='undefined' && module.exports) module.exports={validateOrder};
  else root.ChefValidation={validateOrder};
})(typeof window!=='undefined'?window:globalThis);

