(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const root = document.documentElement;

  /** =============================
   *  PHẦN 1 — ĐỊNH NGHĨA BIẾN CHUNG
   ============================== */
const sachHienNhan = $("#sachHienNhan");
const tamPhapAnhHung = $("#tamPhapAnhHung");
const banDoKhoBau = $("#banDoKhoBau");
const thanChuPhepThuat = $("#thanChuPhepThuat");
const kinhDaoGiao = $("#kinhDaoGiao");
  
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
    "7-trung": { exp: 24852, rate: 5 },
    "7-hậu": { exp: 26106, rate: 5 },
    "8-sơ": { exp: 27398, rate: 10 },
    "8-trung": { exp: 28766, rate: 10 },
    "8-hậu": { exp: 60420, rate: 10 },
  };

  
  /** =============================
   *  PHẦN 6.2 — CẬP NHẬT THÔNG TIN CRYSTAL
   ============================== */
  const expCapacityEl = $("#expCapacity");
  const baseSpeedEl = $("#baseSpeed");
  const currentSpeedEl = $("#currentSpeed");
  const timeRequiredEl = $("#timeRequired");
  const timeRemainingEl = $("#timeRemaining");

  const suoiLinh = $("#suoiLinh");
  const thanMat = $("#huyenminhcong");
  const thanMat = $("#thanMat");
  const chienDau = $("#chienDau");
  const keBangTam = $("#keBangTam");

  function formatTime(sec) {
    if (!sec || sec <= 0) return "—";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return `${h}h ${m}m ${s}s`;
  }

  function getCurrentSpeed(baseSpeed) {
    let buffPercent = 1;

    // Suối linh (+10%)
    if (suoiLinh?.checked) buffPercent += 0.1;

    // Thân mật (+5% mỗi người)
    buffPercent += parseInt(thanMat?.value || 0) * 0.05;

    // Tinh thần chiến đấu
    const chienVal = parseInt(chienDau?.value || 0);
    if (chienVal >= 1501) buffPercent += 0.15;
    else if (chienVal >= 1001) buffPercent += 0.07;
    else if (chienVal >= 501) buffPercent += 0.05;
    else if (chienVal >= 200) buffPercent += 0.03;

    // 📜 Vật phẩm mới
    if (sachHienNhan?.checked) buffPercent += 0.05;
    if (tamPhapAnhHung?.checked) buffPercent += 0.05;
    if (banDoKhoBau?.checked) buffPercent += 0.15;
    if (thanChuPhepThuat?.checked) buffPercent += 0.30;
    if (kinhDaoGiao?.checked) buffPercent += 0.70;

    // Kế băng tâm (+1 / +2 / +3 EXP/s)
    const keBang = parseInt(keBangTam?.value || 0);
    const extraSpeed = keBang > 0 ? Math.ceil(keBang / 2) : 0;

    return baseSpeed * buffPercent + extraSpeed;
}

  function updateCrystalInfo() {
    if (!levelSelect || !expCapacityEl) return;

    const key = levelSelect.value;
    if (!crystalData[key]) return;

    const expCapacity = crystalData[key].exp;
    const baseSpeed = crystalData[key].rate;
    const currentSpeed = getCurrentSpeed(baseSpeed);

    // Tính thời gian cần thiết để đầy
    const timeRequiredSec = currentSpeed > 0 ? expCapacity / currentSpeed : 0;

    // Cập nhật UI
    expCapacityEl.textContent = expCapacity.toLocaleString();
    baseSpeedEl.textContent = baseSpeed.toFixed(2);
    currentSpeedEl.textContent = currentSpeed.toFixed(2);
    timeRequiredEl.textContent = formatTime(timeRequiredSec);

    // Nếu progress đang chạy → tính thời gian còn lại
    if (progress > 0 && currentSpeed > 0) {
      const expRemaining = expCapacity * (1 - progress / 100);
      const timeRemainingSec = expRemaining / currentSpeed;
      timeRemainingEl.textContent = formatTime(timeRemainingSec);
    } else {
      timeRemainingEl.textContent = "—";
    }
  }

  // Lắng nghe thay đổi level & buff
  [levelSelect, suoiLinh, thanMat, chienDau, keBangTam,
  sachHienNhan, tamPhapAnhHung, banDoKhoBau,
  thanChuPhepThuat, kinhDaoGiao].forEach(el => {
    if (el) el.addEventListener("change", () => {
        updateCrystalInfo();
if (progress > 0 && !timer) startProgress();; // đồng bộ progress nếu đang chạy
    });
  });

  // Khởi tạo ban đầu
  updateCrystalInfo();
  startProgress();


  
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
  function startProgress() {
    clearInterval(timer);
    if (!levelSelect || !progressBar || !progressText) return;

    const key = levelSelect.value;
    if (!crystalData[key]) return;

    totalExp = crystalData[key].exp;

    // 🔹 Lấy tốc độ hiện tại thay vì tốc độ cơ bản
    expPerSecond = getCurrentSpeed(crystalData[key].rate);

    progress = 0;
    updateProgressUI();

    timer = setInterval(() => {
      progress += (expPerSecond / totalExp) * 100;

      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        updateProgressUI();
        alert("✨ Tinh thể tu vi đã đầy!");
      } else {
        updateProgressUI();
      }

      // Cập nhật thời gian còn lại trong quá trình chạy
      updateCrystalInfo();
    }, 1000);
  }


  function updateProgressUI() {
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.floor(progress)}%`;
  }

if (levelSelect) {
  levelSelect.addEventListener("change", startProgress);
  levelSelect.addEventListener("click", () => {
    // Nếu bấm lại cùng 1 option thì vẫn reset progress
    startProgress();
  });
}

  if (resetBtn) {
    resetBtn.addEventListener("click", startProgress);
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
