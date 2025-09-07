// script.js — fix theme toggle mobile iOS/Android
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const beforeInput = $("#beforeInput");
  const afterInput  = $("#afterInput");
  const beforeOut   = $("#beforeResult");
  const afterOut    = $("#afterResult");
  const toggleBtn   = $("#themeToggle");
  const root = document.documentElement;

  // Hàm định dạng số
  function format(num){
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  }

  // Tính trước Lv15
  function calcBefore(){
    const val = parseFloat(beforeInput.value.replace(',', '.')) || 0;
    const res = (val * 105) / 95;
    beforeOut.textContent = format(res);
  }

  // Tính sau Lv15
  function calcAfter(){
    const val = parseFloat(afterInput.value.replace(',', '.')) || 0;
    const res = (val * 110) / 95;
    afterOut.textContent = format(res);
  }

  // Lắng nghe sự kiện nhập số
  beforeInput.addEventListener("input", calcBefore);
  afterInput.addEventListener("input", calcAfter);

  // Hỗ trợ dán số có dấu phẩy
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

  // =================== THEME TOGGLE ===================
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";

    // Force repaint trên iOS Safari
    document.body.style.display = "none";
    document.body.offsetHeight; // trigger reflow
    document.body.style.display = "";
  }

  // Ưu tiên theme từ localStorage nếu có
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  // Xử lý click nút toggle
  toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  // Khởi tạo kết quả khi tải trang
  window.addEventListener("DOMContentLoaded", () => {
    calcBefore();
    calcAfter();
  });
})();
