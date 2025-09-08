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

  const currentPage = window.location.pathname.split("/").pop();

  // Tạo wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "exp-link-wrapper";

  // Danh sách các nút cần tạo
  const buttons = [
    { href: "exp.html", label: "📄 Bảng EXP", class: "exp-btn" },
    { href: "choices.html", label: "❓ Câu hỏi", class: "exp-btn alt" },
    { href: "index.html", label: "🏠 Trang chính", class: "exp-btn back" }
  ];

  buttons.forEach(btnData => {
    // Ẩn nút nếu đang ở đúng trang hiện tại
    if (btnData.href === currentPage) return;

    const btn = document.createElement("a");
    btn.href = btnData.href;
    btn.textContent = btnData.label;
    btn.className = btnData.class;
    wrapper.appendChild(btn);
  });

  // Gắn wrapper vào cuối <main>
  main.appendChild(wrapper);
})();

// ========================== CRYSTAL CALCULATOR ==========================
const crystalData = [
  { level: "1 sơ", expPerSec: 1, capacity: 6 },
  { level: "1 trung", expPerSec: 1, capacity: 8 },
  { level: "1 hậu", expPerSec: 1, capacity: 18 },
  { level: "2 sơ", expPerSec: 1, capacity: 38 },
  { level: "2 trung", expPerSec: 1, capacity: 160 },
  { level: "2 hậu", expPerSec: 1, capacity: 320 },
  { level: "3 sơ", expPerSec: 3, capacity: 1938 },
  { level: "3 trung", expPerSec: 3, capacity: 5000 },
  { level: "3 hậu", expPerSec: 3, capacity: 8740 },
  { level: "4 sơ", expPerSec: 5, capacity: 9100 },
  { level: "4 trung", expPerSec: 5, capacity: 9690 },
  { level: "4 hậu", expPerSec: 5, capacity: 16150 },
  { level: "5 sơ", expPerSec: 5, capacity: 17670 },
  { level: "5 trung", expPerSec: 5, capacity: 18544 },
  { level: "5 hậu", expPerSec: 5, capacity: 19874 },
  { level: "6 sơ", expPerSec: 5, capacity: 20444 },
  { level: "6 trung", expPerSec: 5, capacity: 21470 },
  { level: "6 hậu", expPerSec: 5, capacity: 22420 },
  { level: "7 sơ", expPerSec: 5, capacity: 23674 },
];

// Lấy element
const levelSelect = document.getElementById("levelSelect");
const crystalCapacity = document.getElementById("crystalCapacity");
const baseExp = document.getElementById("baseExp");
const suoiLinh = document.getElementById("suoiLinh");
const thanMat = document.getElementById("thanMat");
const chienDau = document.getElementById("chienDau");
const keBangTam = document.getElementById("keBangTam");
const finalExp = document.getElementById("finalExp");
const fullTime = document.getElementById("fullTime");
const countdown = document.getElementById("countdown");
const fullWarning = document.getElementById("fullWarning");
const progressBar = document.getElementById("progressBar");

let countdownTimer;

// ======= Populate Dropdown =======
function populateLevels() {
  levelSelect.innerHTML = ""; // Xóa cũ để tránh bị trùng

  crystalData.forEach((item, index) => {
    const opt = document.createElement("option");
    opt.value = index;
    opt.textContent = item.level;
    levelSelect.appendChild(opt);
  });

  // Chọn level đầu tiên mặc định
  levelSelect.value = 0;
}

// ======= Tính toán thời gian đầy tinh thể =======
function calcCrystal() {
  clearInterval(countdownTimer);
  fullWarning.style.display = "none";

  const index = +levelSelect.value;
  const data = crystalData[index];
  if (!data) return;

  const base = data.expPerSec;
  const capacity = data.capacity;

  // Bonus %
  let bonusPercent = 0;
  if (suoiLinh.checked) bonusPercent += 10;
  bonusPercent += +thanMat.value * 5;
  bonusPercent += +chienDau.value;

  // Kế Băng Tâm bonus exp/s
  let keBangBonus = 0;
  if (+keBangTam.value === 1) keBangBonus = 1;
  if (+keBangTam.value === 2) keBangBonus = 2;
  if (+keBangTam.value === 3) keBangBonus = 3;

  // Exp/s cuối cùng
  const expPerSec = base * (1 + bonusPercent / 100) + keBangBonus;
  const timeSec = capacity / expPerSec;

  // Cập nhật UI
  crystalCapacity.textContent = capacity + " EXP";
  baseExp.textContent = base + " EXP/s";
  finalExp.textContent = expPerSec.toFixed(2) + " EXP/s";

  updateCountdown(timeSec);

  // Countdown real-time + progress bar
  let remaining = Math.floor(timeSec);
  countdownTimer = setInterval(() => {
    if (remaining <= 0) {
      clearInterval(countdownTimer);
      countdown.textContent = "Hoàn tất!";
      fullWarning.style.display = "block";
      updateProgress(100);
      return;
    }
    updateCountdown(remaining);
    const percent = ((capacity - remaining * expPerSec) / capacity) * 100;
    updateProgress(percent);
    remaining--;
  }, 1000);
}

// ======= Cập nhật đồng hồ đếm ngược =======
function updateCountdown(sec) {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = Math.floor(sec % 60);
  fullTime.textContent = `${hours} giờ ${minutes} phút ${seconds} giây`;
  countdown.textContent = `⏳ Còn lại: ${hours} giờ ${minutes} phút ${seconds} giây`;
}

// ======= Cập nhật thanh tiến trình =======
function updateProgress(percent) {
  const clamped = Math.min(100, Math.max(0, percent));
  progressBar.style.width = clamped.toFixed(1) + "%";
  progressBar.textContent = clamped.toFixed(1) + "%";
  if (clamped >= 100) {
    progressBar.classList.add("full");
  } else {
    progressBar.classList.remove("full");
  }
}

// ======= Khởi tạo =======
window.addEventListener("DOMContentLoaded", () => {
  populateLevels();
  calcCrystal();

  levelSelect.addEventListener("change", calcCrystal);
  suoiLinh.addEventListener("change", calcCrystal);
  thanMat.addEventListener("change", calcCrystal);
  chienDau.addEventListener("change", calcCrystal);
  keBangTam.addEventListener("change", calcCrystal);
});

