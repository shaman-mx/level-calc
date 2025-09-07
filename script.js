// script.js — hoàn chỉnh, hỗ trợ nút xoá nhanh & dark mode
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const beforeInput = $("#beforeInput");
  const afterInput  = $("#afterInput");
  const beforeOut   = $("#beforeResult");
  const afterOut    = $("#afterResult");
  const toggleBtn   = $("#themeToggle");
  const clearBefore = $("#clearBefore");
  const clearAfter  = $("#clearAfter");
  const root = document.documentElement;

  // ===== Hàm định dạng số =====
  function format(num) {
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  }

  function calcBefore() {
    const val = parseFloat(beforeInput.value.replace(',', '.')) || 0;
    const res = (val * 105) / 95;
    beforeOut.textContent = format(res);
  }

  function calcAfter() {
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

  // ====== Nút xoá nhanh ======
  clearBefore.addEventListener("click", () => {
    beforeInput.value = "";
    calcBefore();
    beforeInput.focus();
  });

  clearAfter.addEventListener("click", () => {
    afterInput.value = "";
    calcAfter();
    afterInput.focus();
  });

  // ====== Dark / Light Theme Toggle ======
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";

    // Force repaint trên iOS Safari
    document.body.style.visibility = "hidden";
    document.body.offsetHeight;
    document.body.style.visibility = "visible";
  }

  // Áp dụng theme khi load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
  });

  // Tính toán lại kết quả khi load
  window.addEventListener("DOMContentLoaded", () => {
    calcBefore();
    calcAfter();
  });
})();
