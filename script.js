// script.js — fix theme toggle mobile
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const beforeInput = $("#beforeInput");
  const afterInput  = $("#afterInput");
  const beforeOut   = $("#beforeResult");
  const afterOut    = $("#afterResult");
  const toggleBtn   = $("#themeToggle");
  const root = document.documentElement;

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

  beforeInput.addEventListener("input", calcBefore);
  afterInput.addEventListener("input", calcAfter);

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
  function updateToggleIcon() {
    const theme = root.getAttribute("data-theme");
    toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  // Đọc theme từ localStorage hoặc hệ thống
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("data-theme", prefersDark ? "dark" : "light");
  }
  updateToggleIcon();

  toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateToggleIcon();
  });

  window.addEventListener("DOMContentLoaded", () => {
    calcBefore();
    calcAfter();
  });
})();
