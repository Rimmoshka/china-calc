(function(){
  const el=id=>document.getElementById(id);
  const fmt=x=>Number(x).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₽';

  function calculate(){
    const priceCNY = parseFloat(el('priceCNY').value) || 0;
    const kurs = parseFloat(el('kurs').value) || 0;
    const weight = parseFloat(el('weight').value) || 0; // grams per unit
    const shipRUBperKg = parseFloat(el('shipRUBperKg').value) || 0;
    const packRUB = parseFloat(el('packRUB').value) || 0;
    const qty = parseInt(el('qty').value) || 0;
    const commissionPercent = parseFloat(el('commissionPercent').value) || 0;

    const priceRUBPerUnit = priceCNY * kurs;
    const goodsCost = priceRUBPerUnit * qty;
    const weightKgTotal = (weight * qty) / 1000;
    const weightCost = weightKgTotal * shipRUBperKg;
    const packageCost = packRUB * qty;
    const commissionCost = goodsCost * (commissionPercent/100);

    const total = goodsCost + weightCost + packageCost + commissionCost;

    el('goodsCost').innerText = fmt(goodsCost);
    el('weightCost').innerText = fmt(weightCost);
    el('packageCostResult').innerText = fmt(packageCost);
    el('commissionResult').innerText = fmt(commissionCost);
    el('total').innerText = fmt(total);
  }

  document.getElementById('calcBtn').addEventListener('click', calculate);
  document.getElementById('resetBtn').addEventListener('click', ()=>{location.reload();});

  // share button builds URL with params
  document.getElementById('shareBtn').addEventListener('click', async ()=>{
    const params = new URLSearchParams({
      priceCNY: el('priceCNY').value, kurs: el('kurs').value,
      weight: el('weight').value, shipRUBperKg: el('shipRUBperKg').value,
      packRUB: el('packRUB').value, qty: el('qty').value,
      commissionPercent: el('commissionPercent').value
    }).toString();
    const url = location.origin + location.pathname + '?' + params;
    try{
      if(navigator.share) await navigator.share({title:'Расчёт товара',text:'Ссылка на расчёт',url});
      else{ await navigator.clipboard.writeText(url); alert('Ссылка скопирована'); }
    }catch(e){ try{ await navigator.clipboard.writeText(url); alert('Ссылка скопирована'); }catch(e){ prompt('Скопируй ссылку', url); } }
  });

  // load params from URL if present
  (function loadFromURL(){
    const p = new URLSearchParams(location.search);
    if(p.has('priceCNY')) el('priceCNY').value = p.get('priceCNY');
    if(p.has('kurs')) el('kurs').value = p.get('kurs');
    if(p.has('weight')) el('weight').value = p.get('weight');
    if(p.has('shipRUBperKg')) el('shipRUBperKg').value = p.get('shipRUBperKg');
    if(p.has('packRUB')) el('packRUB').value = p.get('packRUB');
    if(p.has('qty')) el('qty').value = p.get('qty');
    if(p.has('commissionPercent')) el('commissionPercent').value = p.get('commissionPercent');
  })();

  // register service worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
})();