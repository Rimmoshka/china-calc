(function(){
  const el = id => document.getElementById(id);
  const fmt = x => Number(x).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' ₽';

  const products = [
    ["Комплект одежды",400],["Ползунки, распашонки",50],["Спортивный костюм",600],
    ["Трусы, майка",30],["Носки, гольфы",20],["Свитер, толстовка",350],
    ["Пижама",200],["Куртка ветровка",500],["Футболка, топ",80],
    ["Рубашка, блузка",150],["Куртка зимняя, пуховик",1000],["Платье, сарафан",200],
    ["Шапка",100],["Джинсы",400],["Шарф",150],["Шорты",150],["Перчатки, варежки",80],
    ["Юбка",250],["Тапки, шлепанцы",200],["Ботинки",800],["Босоножки, сандалии",500],
    ["Сапоги",1000],["Кроссовки, мокасины",800],["Резиновые сапоги",1000],["Туфли",600],
    ["Джинсы (жен)",800],["Трусы (жен)",30],["Шорты (жен)",300],["Бюстгальтер",70],
    ["Юбка (жен)",300],["Купальник",120],["Женский свитер",600],["Майка, топ (жен)",100],
    ["Женская толстовка",800],["Женская футболка",250],["Жакет, блейзер",400],
    ["Рубашка, блузка (жен)",300],["Полупальто, пальто, плащ",1200],["Женское платье, сарафан",500],
    ["Куртка ветровка (жен)",1000],["Вечернее платье",700],["Куртка осенняя (жен)",850],
    ["Куртка зимняя, пуховик (жен)",1500],["Деловой костюм (жен)",950],["Шуба",5000],
    ["Спортивный костюм (жен)",600],["Шапка (жен)",150],["Брюки, бриджи (жен)",600],
    ["Шарф (жен)",200],["Леггинсы",300],["Перчатки, варежки (жен)",150],["Тапки, шлепанцы (жен)",350],
    ["Ботинки (жен)",1200],["Босоножки, сандалии (жен)",600],["Сапоги (жен)",1300],["Кроссовки (жен)",1100],
    ["Резиновые сапоги (жен)",1100],["Туфли (жен)",700],["Толстовка (муж)",800],["Мужские трусы",150],
    ["Пиджак",1200],["Майка, футболка (муж)",220],["Пальто, плащ (муж)",1500],["Рубашка (муж)",250],
    ["Куртка ветровка (муж)",1200],["Деловой костюм (муж)",1800],["Куртка осенняя (муж)",1400],
    ["Спортивный костюм (муж)",1300],["Куртка зимняя, пуховик (муж)",1800],["Брюки, бриджи (муж)",700],
    ["Джинсы (муж)",800],["Шапка (муж)",200],["Шорты (муж)",350],["Шарф (муж)",250],["Свитер (муж)",700],
    ["Перчатки (муж)",140],["Тапки, шлепанцы (муж)",700],["Ботинки (муж)",1400],["Сандали (муж)",600],
    ["Сапоги (муж)",1800],["Кроссовки, мокасины (муж)",1200],["Резиновые сапоги (муж)",1400],["Туфли (муж)",850],
    ["Женская сумка",1000],["Рюкзак",1500],["Портфель",1000],["Дорожная сумка",5500],["Барсетка",800],
    ["Кошельки, портмоне",300]
  ];

  const sel = el('productSelect');
  products.forEach(([name,g])=>{
    const opt = document.createElement('option');
    opt.value = String(g);
    opt.textContent = `${name} — ${(g/1000).toFixed(3)} кг`;
    sel.appendChild(opt);
  });

  sel.addEventListener('change', ()=>{
    const v = sel.value;
    if(v){
      el('weight').value = v;
      el('weight').disabled = true;
    } else {
      el('weight').value = '';
      el('weight').disabled = false;
      el('weight').focus();
    }
  });

  function calculate(){
    const priceCNY = parseFloat(el('priceCNY').value) || 0;
    const kurs = parseFloat(el('kursY').value) || 0;
    const tariff = parseFloat(el('tariff').value) || 0;
    const packRUB = parseFloat(el('packCost').value) || 0;
    const qty = parseInt(el('qty').value) || 0;
    const weight = parseFloat(el('weight').value) || 0; // grams per unit
    const includePack = el('includePack').checked;
    const includeCommission = el('includeCommission').checked;
    const commissionPercent = 15;

    const priceRUBPerUnit = priceCNY * kurs;
    const goodsCost = priceRUBPerUnit * qty;
    const weightKgTotal = (weight * qty) / 1000;
    const weightCost = weightKgTotal * tariff;
    const packageCost = includePack ? (packRUB * qty) : 0;
    const commissionCost = includeCommission ? (goodsCost * (commissionPercent/100)) : 0;
    const total = goodsCost + weightCost + packageCost + commissionCost;

    el('goodsCost').innerText = fmt(goodsCost);
    el('weightCost').innerText = fmt(weightCost);
    el('packageCostResult').innerText = fmt(packageCost);
    el('commissionResult').innerText = fmt(commissionCost);
    el('total').innerText = fmt(total);
  }

  el('calcBtn').addEventListener('click', calculate);
  el('resetBtn').addEventListener('click', ()=>{ location.reload(); });

  el('shareBtn').addEventListener('click', async ()=>{
    const params = new URLSearchParams({
      price: el('priceCNY').value, kurs: el('kursY').value, tariff: el('tariff').value,
      pack: el('packCost').value, qty: el('qty').value, weight: el('weight').value,
      includePack: el('includePack').checked?1:0, includeCommission: el('includeCommission').checked?1:0
    }).toString();
    const url = location.origin + location.pathname + '?' + params;
    try{ if(navigator.share) await navigator.share({title:'Расчёт',url}); else { await navigator.clipboard.writeText(url); alert('Ссылка скопирована'); } }
    catch(e){ try{ await navigator.clipboard.writeText(url); alert('Скопирована'); }catch(e){ prompt('Скопируй ссылку', url);} }
  });

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }

})();