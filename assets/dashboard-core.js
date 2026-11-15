(function(root){
'use strict';
const DAY=86400000;
const iso=d=>new Date(d).toISOString().slice(0,10);
function date(v){if(!/^\d{4}-\d{2}-\d{2}$/.test(v)||!Number.isFinite(Date.parse(v+'T00:00:00Z'))||iso(Date.parse(v+'T00:00:00Z'))!==v)throw new Error('Informe datas válidas.');return Date.parse(v+'T00:00:00Z');}
function range(inicio,fim,today=iso(Date.now()-3*3600000)){
 if(!inicio&&!fim){fim=today;inicio=iso(date(fim)-29*DAY);}
 const from=date(inicio),to=date(fim),dias=Math.round((to-from)/DAY)+1;
 if(dias<1)throw new Error('A data final deve ser igual ou posterior à inicial.');
 if(dias>366)throw new Error('Selecione um período de até 366 dias.');
 const anteriorInicio=iso(from-dias*DAY),anteriorFim=iso(from-DAY);
 return {inicio,fim,dias,anteriorInicio,anteriorFim,from:new Date(inicio+'T00:00:00-03:00').toISOString(),until:new Date(to+DAY+3*3600000).toISOString(),previousFrom:new Date(anteriorInicio+'T00:00:00-03:00').toISOString()};
}
function series(period,rows){const map=new Map(rows.map(r=>[r.dia,Number(r.total)]));const out=[];for(let i=0;i<period.dias;i++){const dia=iso(date(period.inicio)+i*DAY);out.push({dia,total:map.get(dia)||0});}return out;}
function change(now,before){return before?Math.round((now-before)/before*100):null;}
const api={range,series,change,iso,DAY};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ChefDashboardCore=api;
})(typeof window!=='undefined'?window:globalThis);
