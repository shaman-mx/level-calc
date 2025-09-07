function calcBefore() {
  const input = document.getElementById("beforeInput").value;
  const result = input ? (input * 105 / 95).toFixed(2) : "0.00";
  document.getElementById("beforeResult").innerText = result;
}

function calcAfter() {
  const input = document.getElementById("afterInput").value;
  const result = input ? (input * 110 / 95).toFixed(2) : "0.00";
  document.getElementById("afterResult").innerText = result;
}

function clearInput(id) {
  const input = document.getElementById(id);
  input.value = "";
  if (id === "beforeInput") {
    document.getElementById("beforeResult").innerText = "0.00";
  } else {
    document.getElementById("afterResult").innerText = "0.00";
  }
  input.nextElementSibling.style.display = "none"; // ẩn nút
}

function toggleClear(el) {
  const btn = el.nextElementSibling;
  if (el.value) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}
