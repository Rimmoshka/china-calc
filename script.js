(function(){
  const el = id => document.getElementById(id);
  function fmt(x){ return Number(x).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' ₽'; }

  function calculate(){
    const cny = parseFloat(el('cnyRate').value) || 0;
    const usd = parseFloat(el('usdRate').value) || 0;
    const tariff = parseFloat(el('tariff').value) || 0;
    const packUSD = parseFloat(el('packageCost').value) || 0;
    const priceCNY = parseFloat(el('itemPrice').value) || 0;
    const qty = parseInt(el('quantity').value) || 0;
    const weight = parseFloat(el('weight').value) || 0;
    const includePack = el('includePackage').checked;
    const includeComm = el('includeCommission').checked;
    const commission = parseFloat(el('commission').value) || 0;
    const mode = document.querySelector('input[name="mode"]:checked').value;

    const goodsCost = priceCNY * qty * cny;
    const weightKg = (weight * qty) / 1000;
    const weightCost = weightKg * tariff * usd;
    const packageCost = includePack ? (packUSD * usd) : 0;
    const commissionCost = includeComm ? (goodsCost * commission / 100) : 0;

    let total = 0;
    if(mode === 'goods') total = goodsCost + commissionCost;
    else total = goodsCost + weightCost + packageCost + commissionCost;

    el('goodsCost').innerText = fmt(goodsCost);
    el('weightCost').innerText = fmt(weightCost);
    el('packageCostResult').innerText = fmt(packageCost);
    el('commissionResult').innerText = fmt(commissionCost);
    el('total').innerText = fmt(total);
  }

  // enable/disable commission input
  el('includeCommission').addEventListener('change', ()=>{
    el('commission').disabled = !el('includeCommission').checked;
    calculate();
  });

  // events on inputs
  Array.from(document.querySelectorAll('input')).forEach(i=>{
    i.addEventListener('input', calculate);
    i.addEventListener('change', calculate);
  });

  // share button (copy link with params)
  document.getElementById('shareBtn').addEventListener('click', async ()=>{
    const params = new URLSearchParams({
      cny: el('cnyRate').value, usd: el('usdRate').value, tariff: el('tariff').value,
      pack: el('packageCost').value, price: el('itemPrice').value, qty: el('quantity').value,
      weight: el('weight').value, includePack: el('includePackage').checked ? 1:0,
      includeComm: el('includeCommission').checked ? 1:0, commission: el('commission').value,
      mode: document.querySelector('input[name="mode"]:checked').value
    }).toString();
    const url = location.origin + location.pathname + '?' + params;
    try{
      if(navigator.share) await navigator.share({title:'Расчёт товара',text:'Ссылка на расчёт',url});
      else{ await navigator.clipboard.writeText(url); alert('Ссылка скопирована'); }
    }catch(e){ try{ await navigator.clipboard.writeText(url); alert('Ссылка скопирована'); }catch(e){ prompt('Скопируй ссылку',url); } }
  });

  document.getElementById('resetBtn').addEventListener('click', ()=>location.reload());
  // pick params from url
  function loadFromURL(){
    const p = new URLSearchParams(location.search);
    if(p.has('cny')) el('cnyRate').value = p.get('cny');
    if(p.has('usd')) el('usdRate').value = p.get('usd');
    if(p.has('tariff')) el('tariff').value = p.get('tariff');
    if(p.has('pack')) el('packageCost').value = p.get('pack');
    if(p.has('price')) el('itemPrice').value = p.get('price');
    if(p.has('qty')) el('quantity').value = p.get('qty');
    if(p.has('weight')) el('weight').value = p.get('weight');
    if(p.has('includePack')) el('includePackage').checked = p.get('includePack')==='1';
    if(p.has('includeComm')) el('includeCommission').checked = p.get('includeComm')==='1';
    if(p.has('commission')) el('commission').value = p.get('commission');
    if(p.has('mode')){
      const m=p.get('mode'); document.querySelectorAll('input[name="mode"]').forEach(r=>{ if(r.value===m) r.checked=true; });
    }
    if(el('includeCommission').checked) el('commission').disabled=false;
  }

  loadFromURL();
  calculate();

  // register service worker for offline (if supported)
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
})();