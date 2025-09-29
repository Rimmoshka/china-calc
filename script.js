// script.js — логика расчёта, share, PWA install, URL-параметры
(function(){
  const el = id => document.getElementById(id);
  const formatRub = x => Number(x).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' ₽';

  function getValues(){
    return {
      priceCNY: parseFloat(el('priceCNY').value) || 0,
      kurs: parseFloat(el('kurs').value) || 0,
      weightKg: parseFloat(el('weightKg').value) || 0,
      shipRUBperKg: parseFloat(el('shipRUBperKg').value) || 0,
      packRUB: parseFloat(el('packRUB').value) || 0,
      commissionPercent: parseFloat(el('commissionPercent').value) || 0,
      commissionFixedRUB: parseFloat(el('commissionFixedRUB').value) || 0,
      qty: parseInt(el('qty').value) || 1,
      marginPercent: parseFloat(el('marginPercent').value) || 0
    };
  }

  function calculateAndShow(){
    const v = getValues();
    const priceRUB = v.priceCNY * v.kurs;
    const shipPerUnit = v.weightKg * v.shipRUBperKg;
    const commPercRUB = priceRUB * (v.commissionPercent / 100);
    const costPerUnit = priceRUB + shipPerUnit + v.packRUB + commPercRUB + v.commissionFixedRUB;
    const totalCost = costPerUnit * v.qty;
    const retail = costPerUnit * (1 + v.marginPercent / 100);

    el('output').innerHTML = `
      <strong>Результат (на 1 шт):</strong><br>
      Цена в рублях: <strong>${formatRub(priceRUB)}</strong><br>
      Доставка/упаковка: <strong>${formatRub(shipPerUnit + v.packRUB)}</strong><br>
      Комиссия (%): <strong>${formatRub(commPercRUB)}</strong><br>
      ---<br>
      <strong>Себестоимость / шт:</strong> ${formatRub(costPerUnit)}<br>
      <strong>Общая себестоимость (${v.qty} шт):</strong> ${formatRub(totalCost)}<br>
      <strong>Рекомендуемая цена (маржа ${v.marginPercent}%):</strong> ${formatRub(retail)}<br>
    `;
  }

  // Подставить значения из URL если есть
  function populateFromURL(){
    const p = new URLSearchParams(location.search);
    ['priceCNY','kurs','weightKg','shipRUBperKg','packRUB','commissionPercent','commissionFixedRUB','qty','marginPercent'].forEach(k=>{
      if(p.has(k)) el(k).value = p.get(k);
    });
  }

  // Поделиться — формируем ссылку с параметрами
  async function shareCalc(){
    const v = getValues();
    const params = new URLSearchParams(v).toString();
    const url = location.origin + location.pathname + '?' + params;
    // Попытка Web Share API
    if(navigator.share){
      try{
        await navigator.share({title:'Расчёт товара из Китая', text:'Смотри расчёт', url});
        return;
      }catch(e){}
    }
    // Иначе копировать в буфер
    try{
      await navigator.clipboard.writeText(url);
      alert('Ссылка скопирована в буфер — отправь её клиенту.');
    }catch(e){
      prompt('Скопируй ссылку вручную:', url);
    }
  }

  // Установка PWA (кнопка)
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = el('installBtn');
    btn.style.display = 'inline-block';
    btn.onclick = async () => {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      btn.style.display = 'none';
    };
  });

  // Service worker регистрация
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{/*ignore*/});
  }

  // events
  el('calcBtn').addEventListener('click', calculateAndShow);
  el('resetBtn').addEventListener('click', ()=>location.reload());
  el('shareBtn').addEventListener('click', shareCalc);

  // init
  populateFromURL();
  calculateAndShow();
})();
