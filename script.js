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

  // ===== Hàm tính biểu thức an toàn =====
  function safeEval(expr) {
    if (!expr) return NaN;

    // Chỉ cho phép số, dấu + - * / ( ) và khoảng trắng
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) return NaN;

    try {
      return new Function(`return (${expr})`)();
    } catch {
      return NaN;
    }
  }

  // ====== Tính toán cho before ======
  function calcBefore() {
    const raw = beforeInput.value.replace(',', '.').trim();
    const val = safeEval(raw) || 0; // <-- Dùng safeEval thay cho parseFloat
    const res = (val * 105) / 95;
    beforeOut.textContent = format(res);
  }

  // ====== Tính toán cho after ======
  function calcAfter() {
    const raw = afterInput.value.replace(',', '.').trim();
    const val = safeEval(raw) || 0; // <-- Dùng safeEval thay cho parseFloat
    const res = (val * 110) / 95;
    afterOut.textContent = format(res);
  }

  // ====== Gắn sự kiện cho before ======
  if (beforeInput && beforeOut) {
    beforeInput.addEventListener("input", calcBefore);

    beforeInput.addEventListener("paste", (e) => {
      const text = (e.clipboardData || window.clipboardData).getData("text");
      if (text && /,/.test(text)) {
        setTimeout(() => {
          beforeInput.value = text.replace(',', '.');
          beforeInput.dispatchEvent(new Event("input", { bubbles: true }));
        }, 0);
      }
    });
  }

  // ====== Gắn sự kiện cho after ======
  if (afterInput && afterOut) {
    afterInput.addEventListener("input", calcAfter);

    afterInput.addEventListener("paste", (e) => {
      const text = (e.clipboardData || window.clipboardData).getData("text");
      if (text && /,/.test(text)) {
        setTimeout(() => {
          afterInput.value = text.replace(',', '.');
          afterInput.dispatchEvent(new Event("input", { bubbles: true }));
        }, 0);
      }
    });
  }

  // ====== Nút xoá nhanh ======
  if (clearBefore && beforeInput) {
    clearBefore.addEventListener("click", () => {
      beforeInput.value = "";
      calcBefore();
      beforeInput.focus();
    });
  }

  if (clearAfter && afterInput) {
    clearAfter.addEventListener("click", () => {
      afterInput.value = "";
      calcAfter();
      afterInput.focus();
    });
  }

  // ====== Dark / Light Theme Toggle ======
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (toggleBtn) toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";

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

  // Chỉ gắn sự kiện khi nút toggle tồn tại
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }

  // Tính toán lại kết quả khi load (chỉ trên index)
  window.addEventListener("DOMContentLoaded", () => {
    if (beforeInput && beforeOut) calcBefore();
    if (afterInput && afterOut) calcAfter();
  });
})();
