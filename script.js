(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const root = document.documentElement;

  /** =============================
   *  PHẦN 1 — ĐỊNH NGHĨA BIẾN CHUNG
   ============================== */
  const beforeInput = $("#beforeInput");
  const afterInput = $("#afterInput");
  const beforeOut = $("#beforeResult");
  const afterOut = $("#afterResult");
  const clearBefore = $("#clearBefore");
  const clearAfter = $("#clearAfter");
  const toggleBtn = $("#themeToggle");

  // Crystal Elements
  const levelSelect = $("#levelSelect");
  const stageSelect = $("#stageSelect");
  const progressBar = $("#progressBar");
  const progressText = $("#progressText");
  const resetBtn = $("#resetBtn");

  let progress = 0;
  let expPerSecond = 0;
  let totalExp = 0;
  let timer = null;
  
// === Buff elements (crystal.html) ===
const suoiLinhEl  = $("#suoiLinh");
const thanMatEl   = $("#thanMat");
const chienDauEl  = $("#chienDau");
const keBangTamEl = $("#keBangTam");

// === Crystal runtime state ===
let baseRate = 0;      // tốc độ cơ bản theo level
let accExp   = 0;      // EXP đã tích luỹ
let lastTick = 0;      // mốc thời gian tick trước


  /** =============================
   *  PHẦN 2 — CẤU HÌNH DỮ LIỆU CRYSTAL
   ============================== */
  const crystalData = {
    "1-sơ": { exp: 6, rate: 1 },
    "1-trung": { exp: 8, rate: 1 },
    "1-hậu": { exp: 18, rate: 1 },
    "2-sơ": { exp: 38, rate: 1 },
    "2-trung": { exp: 160, rate: 1 },
    "2-hậu": { exp: 320, rate: 1 },
    "3-sơ": { exp: 1938, rate: 3 },
    "3-trung": { exp: 5000, rate: 3 },
    "3-hậu": { exp: 8740, rate: 3 },
    "4-sơ": { exp: 9100, rate: 5 },
    "4-trung": { exp: 9690, rate: 5 },
    "4-hậu": { exp: 16150, rate: 5 },
    "5-sơ": { exp: 17670, rate: 5 },
    "5-trung": { exp: 18544, rate: 5 },
    "5-hậu": { exp: 19874, rate: 5 },
    "6-sơ": { exp: 20444, rate: 5 },
    "6-trung": { exp: 21470, rate: 5 },
    "6-hậu": { exp: 22420, rate: 5 },
    "7-sơ": { exp: 23674, rate: 5 },
  };

  /** =============================
   *  PHẦN 3 — HÀM TIỆN ÍCH
   ============================== */
  function format(num) {
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  }

  function safeEval(expr) {
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) return NaN;
    try {
      return new Function(`return (${expr})`)();
    } catch {
      return NaN;
    }
  }

  /** =============================
   *  PHẦN 4 — TÍNH TOÁN TRƯỚC / SAU LV15
   ============================== */
  function calcBefore() {
    const expr = beforeInput.value.replace(",", ".");
    const val = safeEval(expr);
    const res = (val * 105) / 95;
    beforeOut.textContent = format(res);
  }

  function calcAfter() {
    const expr = afterInput.value.replace(",", ".");
    const val = safeEval(expr);
    const res = (val * 110) / 95;
    afterOut.textContent = format(res);
  }

  if (beforeInput) beforeInput.addEventListener("input", calcBefore);
  if (afterInput) afterInput.addEventListener("input", calcAfter);

  if (clearBefore) {
    clearBefore.addEventListener("click", () => {
      beforeInput.value = "";
      calcBefore();
      beforeInput.focus();
    });
  }

  if (clearAfter) {
    clearAfter.addEventListener("click", () => {
      afterInput.value = "";
      calcAfter();
      afterInput.focus();
    });
  }

  /** =============================
   *  PHẦN 5 — DARK / LIGHT THEME ĐỒNG BỘ
   ============================== */
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (toggleBtn) toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
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

/** =============================
 *  PHẦN 6 — PROGRESS BAR CRYSTAL
 ============================== */

// % từ "Tinh thần chiến đấu"
function getChienDauPct(val) {
  if (val >= 1501) return 0.15;
  if (val >= 1001) return 0.07;
  if (val >= 501)  return 0.05;
  if (val >= 200)  return 0.03;
  return 0;
}

// Tốc độ hiện tại sau khi áp dụng buff
function getBuffedSpeed() {
  let pct = 0;

  // Suối linh & Thân mật: % theo "tốc độ gốc"
  if (suoiLinhEl && suoiLinhEl.checked) pct += 0.10;

  if (thanMatEl) {
    const tm = Number(thanMatEl.value);
    if (tm === 1) pct += 0.05;
    else if (tm === 2) pct += 0.10;
    else if (tm === 3) pct += 0.15;
  }

  // Tinh thần chiến đấu: % cộng dồn
  if (chienDauEl) pct += getChienDauPct(Number(chienDauEl.value));

  // Kế băng tâm: cộng thẳng EXP/s
  let flat = 0;
  if (keBangTamEl) {
    const lv = Number(keBangTamEl.value);
    if (lv === 1) flat = 1;
    else if (lv === 3) flat = 2;
    else if (lv === 5) flat = 3;
  }

  return baseRate * (1 + pct) + flat;
}

function formatTime(sec) {
  if (!isFinite(sec) || sec <= 0) return "—";
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  const p1 = h ? `${h} giờ ` : "";
  const p2 = m ? `${m} phút ` : "";
  const p3 = `${s} giây`;
  return (p1 + p2 + p3).trim();
}

function updateInfoUI() {
  const expCapEl  = $("#expCapacity");
  const baseEl    = $("#baseSpeed");
  const curEl     = $("#currentSpeed");
  const fullEl    = $("#timeRequired");
  const remainEl  = $("#timeRemaining");

  const speed = getBuffedSpeed();

  if (expCapEl) expCapEl.textContent = Math.round(totalExp).toLocaleString("vi-VN");
  if (baseEl)   baseEl.textContent   = baseRate.toFixed(2);
  if (curEl)    curEl.textContent    = speed.toFixed(2);

  if (fullEl)   fullEl.textContent   = speed > 0 ? formatTime(totalExp / speed) : "—";
  if (remainEl) remainEl.textContent = speed > 0 ? formatTime((totalExp - accExp) / speed) : "—";
}

function updateProgressUI() {
  if (!progressBar || !progressText) return;
  const pct = Math.min(100, (accExp / totalExp) * 100);
  progressBar.style.width = `${pct}%`;
  progressText.textContent = `${Math.floor(pct)}%`;
}

function tick() {
  const now = Date.now();
  const dt  = (now - lastTick) / 1000; // giây
  lastTick  = now;

  const speed = getBuffedSpeed();      // đọc buff mỗi tick → đổi buff không reset

  accExp = Math.min(totalExp, accExp + speed * dt);
  updateProgressUI();
  updateInfoUI();

  if (accExp >= totalExp) {
    clearInterval(timer);
    timer = null;
    updateProgressUI();
    alert("✨ Tinh thể tu vi đã đầy!");
  }
}

function startProgress() {
  clearInterval(timer);
  if (!levelSelect) return;

  const key = levelSelect.value;          // đã gộp Level + Giai đoạn
  if (!crystalData[key]) return;

  totalExp = crystalData[key].exp;
  baseRate = crystalData[key].rate;

  // Reset khi đổi Level hoặc bấm reset
  accExp   = 0;
  lastTick = Date.now();
  updateProgressUI();
  updateInfoUI();

  timer = setInterval(tick, 200);         // tick mượt 5 lần/giây
}


  /** =============================
   *  PHẦN 7 — BẢNG CÂU HỎI choicesData ĐẦY ĐỦ
   ============================== */
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
        </div>`;
      const td2 = document.createElement("td");
      td2.innerHTML = `
        <div class="choice ${q.option2.danger ? "danger" : ""}">
          <span>${q.option2.text}</span>
          <span class="reward">(${q.option2.reward})</span>
        </div>`;
      row.appendChild(td1);
      row.appendChild(td2);
      choicesBody.appendChild(row);
    });
  }

  /** =============================
   *  PHẦN 8 — NÚT ĐIỀU HƯỚNG
   ============================== */
  (function addNavButtons() {
    const main = document.querySelector("main");
    if (!main) return;

    const currentPage = window.location.pathname.split("/").pop();

    const wrapper = document.createElement("div");
    wrapper.className = "exp-link-wrapper";

const buttons = [
  { href: "index.html", label: "🏠 Trang chính", class: "exp-btn back" },
  { href: "exp.html", label: "📄 Bảng EXP", class: "exp-btn" },
  { href: "choices.html", label: "❓ Câu hỏi", class: "exp-btn alt" },
  { href: "crystal.html", label: "🔮 Mô phỏng tinh thể", class: "exp-btn" }, // ⬅ Nút mới
];
    buttons.forEach((btnData) => {
      if (btnData.href === currentPage) return;
      const btn = document.createElement("a");
      btn.href = btnData.href;
      btn.textContent = btnData.label;
      btn.className = btnData.class;
      wrapper.appendChild(btn);
    });

    main.appendChild(wrapper);
  })();
})();
