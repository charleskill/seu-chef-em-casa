(function(root){
  'use strict';
  function validateOrder(order, now){
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
    }
    if(!Array.isArray(order.dishes)||!order.dishes.length) return 'Escolha ao menos um prato do cardápio.';
    return '';
  }
  if(typeof module!=='undefined' && module.exports) module.exports={validateOrder};
  else root.ChefValidation={validateOrder};
})(typeof window!=='undefined'?window:globalThis);

