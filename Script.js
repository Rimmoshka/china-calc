function toggleVesInput() {
  let select = document.getElementById("ves_select");
  let custom = document.getElementById("ves_custom");
  if (select.value === "other") {
    custom.style.display = "block";
  } else {
    custom.style.display = "none";
  }
}

function calculate() {
  let kurs = parseFloat(document.getElementById("kurs").value) || 0;
  let tarif = parseFloat(document.getElementById("tarif").value) || 0;
  let upakovka = parseFloat(document.getElementById("upakovka").value) || 0;
  let price = parseFloat(document.getElementById("price").value) || 0;
  let count = parseInt(document.getElementById("count").value) || 1;
  
  let ves_select = document.getElementById("ves_select").value;
  let ves = ves_select === "other" ? parseFloat(document.getElementById("ves_custom").value) || 0 : parseFloat(ves_select);

  let include_pack = document.getElementById("include_pack").checked;
  let include_commission = document.getElementById("include_commission").checked;
  let mode = document.querySelector("input[name='calc_mode']:checked").value;

  let cost_yuan = price * count;
  let cost_rub = cost_yuan * kurs;
  let delivery = (ves / 1000) * tarif;

  let total = cost_rub;
  let pack_cost = include_pack ? upakovka : 0;
  let commission = include_commission ? total * 0.15 : 0;

  if (mode === "all") {
    total = cost_rub + delivery + pack_cost + commission;
  } else {
    total = cost_rub + commission;
  }

  document.getElementById("res_price").innerText = cost_rub.toFixed(2);
  document.getElementById("res_delivery").innerText = delivery.toFixed(2);
  document.getElementById("res_pack").innerText = pack_cost.toFixed(2);
  document.getElementById("res_comm").innerText = commission.toFixed(2);
  document.getElementById("res_total").innerText = total.toFixed(2);
}

function resetForm() {
  document.querySelector("form")?.reset();
  document.getElementById("res_price").innerText = "0";
  document.getElementById("res_delivery").innerText = "0";
  document.getElementById("res_pack").innerText = "0";
  document.getElementById("res_comm").innerText = "0";
  document.getElementById("res_total").innerText = "0";
}
