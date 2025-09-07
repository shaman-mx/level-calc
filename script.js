function calcBefore() {
  let val = parseFloat(document.getElementById("beforeInput").value) || 0;
  let res = val * 105 / 95;
  document.getElementById("beforeResult").innerText = res.toFixed(2);
}

function calcAfter() {
  let val = parseFloat(document.getElementById("afterInput").value) || 0;
  let res = val * 110 / 95;
  document.getElementById("afterResult").innerText = res.toFixed(2);
}

function toggleClear(input) {
  const btn = input.parentElement.querySelector('.clear-btn');
  btn.style.display = input.value ? 'block' : 'none';
}

function clearInput(id) {
  const input = document.getElementById(id);
  input.value = '';
  if (id === "beforeInput") calcBefore();
  if (id === "afterInput") calcAfter();
  toggleClear(input);
}
