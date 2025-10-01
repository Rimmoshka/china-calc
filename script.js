(function(){
  const el=id=>document.getElementById(id);
  const fmt=x=>Number(x).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₽';

  // when a product is selected, if value set (grams) -> fill weight field (grams) and disable manual input
  el('productSelect').addEventListener('change', ()=>{
    const v = el('productSelect').value;
    if(v){
      el('weight').value = v; // grams
      el('weight').disabled = true;
    } else {
      el('weight').value = '';
      el('weight').disabled = false;
      el('weight').focus();
    }
  });

  function calculate(){
    const priceCNY = parseFloat(el('priceCNY').value) || 0;
    const kurs = parseFloat(el('kurs').value) || 0;
    const weight = parseFloat(el('weight').value) || 0; // grams total per qty
    const shipRUBperKg = parseFloat(el('tariff').value) || 0;
    const packRUB = parseFloat(el('packRUB').value) || 0;
    const qty = parseInt(el('qty').value) || 0;
    const includePack = el('includePack').checked;
    const includeCommission = el('includeCommission').checked;
    const commissionPercent = 15;

    // compute per unit price in RUB
    const priceRUBPerUnit = priceCNY * kurs;
    const goodsCost = priceRUBPerUnit * qty;

    const weightKgTotal = (weight * qty) / 1000;
    const weightCost = weightKgTotal * shipRUBperKg;

    const packageCost = includePack ? (packRUB * qty) : 0;
    const commissionCost = includeCommission ? (goodsCost * (commissionPercent/100)) : 0;

    const total = goodsCost + weightCost + packageCost + commissionCost;

    el('goodsCost').innerText = fmt(goodsCost);
    el('weightCost').innerText = fmt(weightCost);
    el('packageCostResult').innerText = fmt(packageCost);
    el('commissionResult').innerText = fmt(commissionCost);
    el('total').innerText = fmt(total);
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('resetBtn').addEventListener('click', ()=>{ location.reload(); });

  document.getElementById('shareBtn').addEventListener('click', async ()=>{
    const params = new URLSearchParams({
      priceCNY: el('priceCNY').value,
      kurs: el('kurs').value,
      weight: el('weight').value,
      shipRUBperKg: el('tariff').value,
      packRUB: el('packRUB').value,
      qty: el('qty').value,
      includePack: el('includePack').checked ? 1:0,
      includeCommission: el('includeCommission').checked ? 1:0,
    }).toString();
    const url = location.origin + location.pathname + '?' + params;
    try{ if(navigator.share) await navigator.share({title:'Расчёт товара',text:'Ссылка на расчёт',url}); else{ await navigator.clipboard.writeText(url); alert('Ссылка скопирована'); } }
    catch(e){ try{ await navigator.clipboard.writeText(url); alert('Ссылка скопирована'); }catch(e){ prompt('Скопируй ссылку', url); } }
  });

  // load from URL params if present
  (function loadFromURL(){
    const p = new URLSearchParams(location.search);
    if(p.has('priceCNY')) el('priceCNY').value = p.get('priceCNY');
    if(p.has('kurs')) el('kurs').value = p.get('kurs');
    if(p.has('tariff')) el('tariff').value = p.get('tariff');
    if(p.has('packRUB')) el('packRUB').value = p.get('packRUB');
    if(p.has('qty')) el('qty').value = p.get('qty');
    if(p.has('weight')) el('weight').value = p.get('weight');
    if(p.has('includePack')) el('includePack').checked = p.get('includePack')==='1';
    if(p.has('includeCommission')) el('includeCommission').checked = p.get('includeCommission')==='1';
  })();

  // register service worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
})();