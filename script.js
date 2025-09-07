// script.js — fix đổi theme ngay lập tức trên mobile iOS/Android
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const beforeInput = $("#beforeInput");
  const afterInput  = $("#afterInput");
  const beforeOut   = $("#beforeResult");
  const afterOut    = $("#afterResult");
  const toggleBtn   = $("#themeToggle");
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

  // Cho phép dán số có dấu phẩy
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

  // ====== QUẢN LÝ THEME ======
  function setTheme(theme) {
    // Cập nhật attribute trên <html>
    root.setAttribute("data-theme", theme);
    // Lưu lựa chọn
    localStorage.setItem("theme", theme);
    // Cập nhật icon nút
    toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";

    // *** FORCE REPAINT TRÊN MOBILE ***
    // Trick này buộc Safari & Chrome Android render lại ngay lập tức
    document.body.style.visibility = "hidden";
    document.body.offsetHeight; // Trigger reflow
    document.body.style.visibility = "visible";
  }

  // Áp dụng theme lúc load trang
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  // Toggle theme khi bấm nút
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
