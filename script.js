// script.js — logic chính
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const beforeInput = $("#beforeInput");
  const afterInput  = $("#afterInput");
  const beforeOut   = $("#beforeResult");
  const afterOut    = $("#afterResult");
  const toggleBtn   = $("#themeToggle");

  function format(num){
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  }

  function calcBefore(){
    const val = parseFloat(beforeInput.value.replace(',', '.')) || 0;
    const res = (val * 105) / 95;
    beforeOut.textContent = format(res);
  }

  function calcAfter(){
    const val = parseFloat(afterInput.value.replace(',', '.')) || 0;
    const res = (val * 110) / 95;
    afterOut.textContent = format(res);
  }

  // Lắng nghe nhập liệu
  beforeInput.addEventListener("input", calcBefore);
  afterInput.addEventListener("input", calcAfter);

  // Cho phép paste số có dấu phẩy
  [beforeInput, afterInput].forEach((el) => {
    el.addEventListener("paste", (e) => {
      const text = (e.clipboardData || window.clipboardData).getData("text");
      if (text && /,/.test(text)) {
        setTimeout(() => {
          el.value = text.replace(',', '.');
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }, 0);
      }
    });
  });

  // ========== Theme Toggle ==========
  const root = document.body;
  const savedTheme = localStorage.getItem("theme");

  // Nếu user có chọn theme => áp dụng, không thì theo hệ thống
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
    toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
    toggleBtn.textContent = prefersDark ? "☀️" : "🌙";
  }

  toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    toggleBtn.textContent = next === "dark" ? "☀️" : "🌙";
  });

  // Tính lại khi load trang
  window.addEventListener("DOMContentLoaded", () => {
    calcBefore();
    calcAfter();
  });
})();
