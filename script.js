(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const beforeInput = $("#beforeInput");
  const afterInput = $("#afterInput");
  const beforeOut = $("#beforeResult");
  const afterOut = $("#afterResult");
  const toggleBtn = $("#themeToggle");
  const clearBefore = $("#clearBefore");
  const clearAfter = $("#clearAfter");
  const root = document.documentElement;

  // ==== Hàm định dạng số ====
  function format(num) {
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  }

  // ==== Hàm tính toán biểu thức ====
  function safeEval(expr) {
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) return NaN;
    try {
      return new Function(`return (${expr})`)();
    } catch {
      return NaN;
    }
  }

  // ==== Tính trước level 15 ====
  function calcBefore() {
    const expr = beforeInput.value.replace(",", ".");
    const val = safeEval(expr);
    const res = (val * 105) / 95;
    beforeOut.textContent = format(res);
  }

  // ==== Tính sau level 15 ====
  function calcAfter() {
    const expr = afterInput.value.replace(",", ".");
    const val = safeEval(expr);
    const res = (val * 110) / 95;
    afterOut.textContent = format(res);
  }

  // ==== Gắn sự kiện input ====
  if (beforeInput && beforeOut) {
    beforeInput.addEventListener("input", calcBefore);
  }
  if (afterInput && afterOut) {
    afterInput.addEventListener("input", calcAfter);
  }

  // ==== Nút xoá nhanh ====
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

  // ==== Dark / Light Theme ====
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (toggleBtn) toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    document.body.style.visibility = "hidden";
    document.body.offsetHeight;
    document.body.style.visibility = "visible";
  }
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    if (beforeInput && beforeOut) calcBefore();
    if (afterInput && afterOut) calcAfter();
  });
})();
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
  {
    option1: { text: "Đá thần", reward: "Tăng tu vi", danger: false },
    option2: { text: "Đá hiếm", reward: "Tăng tu vi", danger: false },
  },
  {
    option1: { text: "Đánh nhau với người đó", reward: "Đan xanh", danger: false },
    option2: { text: "Cho lời khuyên", reward: "Tăng tu vi", danger: false },
  },
  {
    option1: { text: "Đi đến hồ đen", reward: "Trừ tu vi", danger: true },
    option2: { text: "Đi đến thôn hoa sen", reward: "Đan xanh", danger: false },
  },
  {
    option1: { text: "Đi sang trái", reward: "Trừ tu vi", danger: true },
    option2: { text: "Đi sang phải", reward: "Thư thách đấu", danger: false },
  },
  {
    option1: { text: "Đi trên thuyền", reward: "Đan xanh", danger: false },
    option2: { text: "Bay trên kiếm", reward: "Thư thách đấu", danger: false },
  },
  {
    option1: { text: "Đi vào ban đêm", reward: "Đan vàng", danger: false },
    option2: { text: "Đi vào ban ngày", reward: "Không có gì", danger: true },
  },
  {
    option1: { text: "Đồng ý", reward: "Tăng tu vi", danger: false },
    option2: { text: "Từ chối", reward: "Tăng tu vi", danger: false },
  },
  {
    option1: { text: "Dũng cảm dựa vào", reward: "Tăng tu vi", danger: false },
    option2: { text: "Đi nấp", reward: "Không có gì", danger: true },
  },
  {
    option1: { text: "Khai thác bề mặt", reward: "Tăng tu vi", danger: false },
    option2: { text: "Khai thác sâu", reward: "Không có gì", danger: true },
  },
  {
    option1: { text: "Lương thiện", reward: "Tăng tu vi", danger: false },
    option2: { text: "Lớn mạnh", reward: "Đan vàng", danger: false },
  },
  {
    option1: { text: "Tặng thuốc", reward: "Đan xanh", danger: false },
    option2: { text: "Cứu chữa", reward: "Đan vàng", danger: false },
  },
  {
    option1: { text: "Tiên thảo", reward: "Tăng tu vi", danger: false },
    option2: { text: "Đan dược", reward: "Đan xanh", danger: false },
  },
  {
    option1: { text: "Trợ giúp chim loan", reward: "Đan xanh", danger: false },
    option2: { text: "Trợ giúp chuột vàng", reward: "Đan vàng", danger: false },
  },
  {
    option1: { text: "Tưới vườn thuốc", reward: "Tăng tu vi", danger: false },
    option2: { text: "Luyện đan", reward: "Đan xanh", danger: false },
  },
];
const choicesBody = document.getElementById("choicesBody");
if (choicesBody) {
  choicesData.forEach((q) => {
    const row = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.innerHTML = `
      <div class="choice ${q.option1.danger ? "danger" : ""}">
        <span>${q.option1.text}</span>
        <span class="reward">(${q.option1.reward})</span>
      </div>
    `;

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
// ====== THÊM NÚT ĐIỀU HƯỚNG TỰ ĐỘNG ======
(function addNavButtons() {
  const main = document.querySelector("main");
  if (!main) return; // Nếu trang không có <main> thì bỏ qua

  // Tạo wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "exp-link-wrapper";

  // Nút Bảng EXP
  const expBtn = document.createElement("a");
  expBtn.href = "exp.html";
  expBtn.className = "exp-btn";
  expBtn.textContent = "📄 Bảng EXP";

  // Nút Câu Hỏi
  const choicesBtn = document.createElement("a");
  choicesBtn.href = "choices.html";
  choicesBtn.className = "exp-btn alt";
  choicesBtn.textContent = "❓ Câu hỏi";

  // Nút Trang Chính
  const homeBtn = document.createElement("a");
  homeBtn.href = "index.html";
  homeBtn.className = "exp-btn back";
  homeBtn.textContent = "🏠 Trang chính";

  // Gắn tất cả nút vào wrapper
  wrapper.appendChild(expBtn);
  wrapper.appendChild(choicesBtn);
  wrapper.appendChild(homeBtn);

  // Thêm wrapper vào cuối <main>
  main.appendChild(wrapper);
})();
