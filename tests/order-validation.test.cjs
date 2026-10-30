const {test}=require('node:test');
const assert=require('node:assert/strict');
const {validateOrder}=require('../assets/order-validation.js');
const now=new Date(2026,9,28,10);
const order=(f={},dishes=[1])=>({f:{name:'Cliente teste',phone:'(48) 99999-9999',...f},dishes});
test('aceita DDD e código do Brasil',()=>{assert.equal(validateOrder(order(),now),'');assert.equal(validateOrder(order({phone:'+55 (48) 99999-9999'}),now),'');});
test('rejeita letras, telefone incompleto e nome vazio',()=>{for(const phone of ['abc','48999','abc48999999999']) assert.ok(validateOrder(order({phone}),now));assert.ok(validateOrder(order({name:'  '}),now));});
test('exige prato e valida e-mail opcional',()=>{assert.ok(validateOrder(order({},[]),now));assert.ok(validateOrder(order({email:'erro@'}),now));assert.equal(validateOrder(order({email:'teste@example.com'}),now),'');});
test('data opcional; rejeita passado e data inexistente',()=>{assert.equal(validateOrder(order({date:'2026-10-28'}),now),'');assert.ok(validateOrder(order({date:'2026-10-27'}),now));assert.ok(validateOrder(order({date:'2027-02-30'}),now));});

