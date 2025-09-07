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

  // ====== Tính toán ======
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

  // ====== Chỉ gắn sự kiện khi phần tử tồn tại ======
  if (beforeInput && beforeOut) {
    beforeInput.addEventListener("input", calcBefore);

    // Hỗ trợ dán số có dấu phẩy
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

// ====== DỮ LIỆU CÂU HỎI ======
const choicesData = [
  {
    option1: { text: "Ăn quả", reward: "Tăng tu vi", danger: false },
    option2: { text: "Uống nước từ suối", reward: "Tăng tu vi", danger: false },
  },
  {
    option1: { text: "Bí mật điều tra", reward: "Thư thách đấu", danger: false },
    option2: { text: "Tấn công trực diện", reward: "Không có gì", danger: true },
  },
  {
    option1: { text: "Chiến đấu", reward: "Thư thách đấu", danger: false },
    option2: { text: "Ngưỡng mộ", reward: "Tăng tu vi", danger: false },
  },
  {
    option1: { text: "Cùng nhau khám phá", reward: "Trừ tu vi", danger: true },
    option2: { text: "Tự khám phá", reward: "Đan vàng", danger: false },
  },
  {
    option1: { text: "Cứu chữa", reward: "Đan xanh", danger: false },
    option2: { text: "Rời đi", reward: "Trừ tu vi", danger: true },
  },
  // ... tiếp tục bổ sung theo bảng bạn gửi
];

// ====== RENDER BẢNG CÂU HỎI ======
const choicesBody = document.getElementById("choicesBody");

if (choicesBody) {
  choicesData.forEach((q) => {
    const row = document.createElement("tr");

    // Lựa chọn 1
    const td1 = document.createElement("td");
    td1.innerHTML = `
      <div class="choice ${q.option1.danger ? "danger" : ""}">
        <span>${q.option1.text}</span>
        <span class="reward">(${q.option1.reward})</span>
      </div>
    `;

    // Lựa chọn 2
    const td2 = document.createElement("td");
    td2.innerHTML = `
      <div class="choice ${q.option2.danger ? "danger" : ""}">
        <span>${q.option2.text}</span>
        <span class="reward">(${q.option2.reward})</span>
      </div>
    `;

    row.appendChild(td1);
    row.appendChild(td2);
    choicesBody.appendChild(row);
  });
}
