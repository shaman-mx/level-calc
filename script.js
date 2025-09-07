function toggleClear(input) {
  const wrap = input.parentElement;
  if (input.value.trim() !== "") {
    wrap.classList.add("show-clear");
  } else {
    wrap.classList.remove("show-clear");
  }
}

function clearInput(id) {
  const input = document.getElementById(id);
  input.value = "";
  toggleClear(input);
  if (id === "beforeInput") {
    document.getElementById("beforeResult").innerText = "0.00";
  } else {
    document.getElementById("afterResult").innerText = "0.00";
  }
}

function calcBefore() {
  const val = parseFloat(document.getElementById("beforeInput").value);
  document.getElementById("beforeResult").innerText = isNaN(val) ? "0.00" : (val * 105 / 95).toFixed(2);
}

function calcAfter() {
  const val = parseFloat(document.getElementById("afterInput").value);
  document.getElementById("afterResult").innerText = isNaN(val) ? "0.00" : (val * 110 / 95).toFixed(2);
}
