<script>
// =================== TOÀN BỘ script.js ===================
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const root = document.documentElement;

  /* ========= PHẦN 1 — BIẾN CHUNG (index) ========= */
  const beforeInput = $("#beforeInput");
  const afterInput = $("#afterInput");
  const beforeOut = $("#beforeResult");
  const afterOut = $("#afterResult");
  const clearBefore = $("#clearBefore");
  const clearAfter = $("#clearAfter");
  const toggleBtn = $("#themeToggle");

  /* ========= PHẦN 2 — DỮ LIỆU CRYSTAL ========= */
  const crystalData = {
    "1-sơ":   { exp: 6,     rate: 1 },
    "1-trung":{ exp: 8,     rate: 1 },
    "1-hậu":  { exp: 18,    rate: 1 },

    "2-sơ":   { exp: 38,    rate: 1 },
    "2-trung":{ exp: 160,   rate: 1 },
    "2-hậu":  { exp: 320,   rate: 1 },

    "3-sơ":   { exp: 1938,  rate: 3 },
    "3-trung":{ exp: 5000,  rate: 3 },
    "3-hậu":  { exp: 8740,  rate: 3 },

    "4-sơ":   { exp: 9100,  rate: 5 },
    "4-trung":{ exp: 9690,  rate: 5 },
    "4-hậu":  { exp: 16150, rate: 5 },

    "5-sơ":   { exp: 17670, rate: 5 },
    "5-trung":{ exp: 18544, rate: 5 },
    "5-hậu":  { exp: 19874, rate: 5 },

    "6-sơ":   { exp: 20444, rate: 5 },
    "6-trung":{ exp: 21470, rate: 5 },
    "6-hậu":  { exp: 22420, rate: 5 },

    "7-sơ":   { exp: 23674, rate: 5 },
  };

  /* ========= PHẦN 3 — HÀM TIỆN ÍCH ========= */
  const format = (num) => (Number.isFinite(num) ? num.toFixed(2) : "0.00");

  function safeEval(expr) {
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) return NaN;
    try { return new Function(`return (${expr})`)(); }
    catch { return NaN; }
  }

  function formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "—";
    const s = Math.floor(seconds % 60);
    const m = Math.floor((seconds / 60) % 60);
    const h = Math.floor(seconds / 3600);
    const parts = [];
    if (h) parts.push(`${h} giờ`);
    if (m || h) parts.push(`${m} phút`);
    parts.push(`${s} giây`);
    return parts.join(" ");
  }

  /* ========= PHẦN 4 — TÍNH TRƯỚC / SAU LV15 (index) ========= */
  function calcBefore() {
    if (!beforeInput || !beforeOut) return;
    const val = safeEval(beforeInput.value.replace(",", "."));
    const res = (val * 105) / 95;
    beforeOut.textContent = format(res);
  }
  function calcAfter() {
    if (!afterInput || !afterOut) return;
    const val = safeEval(afterInput.value.replace(",", "."));
    const res = (val * 110) / 95;
    afterOut.textContent = format(res);
  }
  if (beforeInput) beforeInput.addEventListener("input", calcBefore);
  if (afterInput)  afterInput.addEventListener("input",  calcAfter);
  if (clearBefore && beforeInput) clearBefore.addEventListener("click", () => { beforeInput.value = ""; calcBefore(); beforeInput.focus(); });
  if (clearAfter  && afterInput)  clearAfter .addEventListener("click", () => { afterInput.value  = ""; calcAfter();  afterInput.focus();  });

  /* ========= PHẦN 5 — THEME ĐỒNG BỘ ========= */
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (toggleBtn) toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) setTheme(savedTheme);
  else setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  if (toggleBtn) toggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });

  /* ========= PHẦN 6 — MÔ PHỎNG CRYSTAL ========= */
  // Elements (crystal.html)
  const levelSelect   = $("#levelSelect");
  const suoiLinhEl    = $("#suoiLinh");
  const thanMatEl     = $("#thanMat");
  const chienDauEl    = $("#chienDau");
  const keBangTamEl   = $("#keBangTam");

  const expCapacityEl = $("#expCapacity");
  const baseSpeedEl   = $("#baseSpeed");
  const currentSpeedEl= $("#currentSpeed");
  const timeReqEl     = $("#timeRequired");
  const timeLeftEl    = $("#timeRemaining");

  const progressBar   = $("#progressBar");
  const progressText  = $("#progressText");
  const resetBtn      = $("#resetBtn");

  // Trạng thái mô phỏng
  let totalExp = 0;       // dung lượng tinh thể
  let baseRate = 0;       // exp/s cơ bản theo level
  let gainedExp = 0;      // exp đã tích lũy
  let lastTs = 0;         // timestamp cho rAF
  let completed = false;  // đã đầy chưa (để alert 1 lần)

  function readBuffPercent() {
    // Tính % dựa trên tốc độ GỐC
    let p = 0;
    if (suoiLinhEl && suoiLinhEl.checked) p += 0.10;

    if (thanMatEl) {
      const n = parseInt(thanMatEl.value || "0", 10);
      if (n === 1) p += 0.05;
      else if (n === 2) p += 0.10;
      else if (n === 3) p += 0.15;
    }

    if (chienDauEl) {
      const v = parseInt(chienDauEl.value || "0", 10);
      if (v >= 1501) p += 0.15;
      else if (v >= 1001) p += 0.07;
      else if (v >= 501)  p += 0.05;
      else if (v >= 200)  p += 0.03;
    }
    return p;
  }

  function readFlatBonus() {
    if (!keBangTamEl) return 0;
    const v = parseInt(keBangTamEl.value || "0", 10);
    if (v === 1) return 1;  // Lv1: +1 exp/s
    if (v === 3) return 2;  // Lv3: +2 exp/s
    if (v === 5) return 3;  // Lv5: +3 exp/s
    return 0;
  }

  function currentRate() {
    // speed = baseRate * (1 + %buff) + flat
    return baseRate * (1 + readBuffPercent()) + readFlatBonus();
  }

  function applyLevelSelection(resetProgress = false) {
    if (!levelSelect) return;
    const key = levelSelect.value;  // ví dụ "4-trung"
    const data = crystalData[key];
    if (!data) return;

    totalExp = data.exp;
    baseRate = data.rate;

    if (resetProgress) {
      gainedExp = 0;
      completed = false;
    }
    updateInfoUI();   // cập nhật bảng thông tin
    updateProgressUI(); // cập nhật thanh tiến trình
  }

  function updateInfoUI() {
    const rateNow = currentRate();
    if (expCapacityEl) expCapacityEl.textContent = totalExp.toLocaleString("vi-VN");
    if (baseSpeedEl)   baseSpeedEl.textContent   = format(baseRate);
    if (currentSpeedEl)currentSpeedEl.textContent= format(rateNow);

    // Thời gian lý thuyết từ 0 đến đầy với tốc độ hiện tại
    const theoSeconds = rateNow > 0 ? totalExp / rateNow : NaN;
    if (timeReqEl)  timeReqEl.textContent  = formatDuration(theoSeconds);

    // Thời gian còn lại dựa trên tiến độ hiện tại
    const remain = rateNow > 0 ? Math.max(0, (totalExp - gainedExp) / rateNow) : NaN;
    if (timeLeftEl) timeLeftEl.textContent = formatDuration(remain);
  }

  function updateProgressUI() {
    const percent = totalExp > 0 ? Math.min(100, (gainedExp / totalExp) * 100) : 0;
    if (progressBar)  progressBar.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `${Math.floor(percent)}%`;
  }

  function tick(ts) {
    // Nếu trang crystal không có các phần tử, bỏ qua vòng lặp
    if (!levelSelect || !progressBar || !progressText) return;

    if (!lastTs) lastTs = ts;
    const dt = (ts - lastTs) / 1000; // giây
    lastTs = ts;

    const rate = currentRate();

    if (!completed && rate > 0 && totalExp > 0) {
      gainedExp += rate * dt;
      if (gainedExp >= totalExp) {
        gainedExp = totalExp;
        if (!completed) {
          completed = true;
          // Thông báo đầy tinh thể
          try { alert("✨ Tinh thể tu vi đã đầy!"); } catch {}
        }
      }
    }

    updateInfoUI();
    updateProgressUI();
    requestAnimationFrame(tick);
  }

  // Sự kiện: chỉ reset khi đổi level hoặc bấm "Bắt đầu lại"
  if (levelSelect) {
    levelSelect.addEventListener("change", () => {
      applyLevelSelection(true); // reset về 0
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      applyLevelSelection(true); // reset về 0
    });
  }

  // Buffs: không reset — chỉ cập nhật UI ngay
  [suoiLinhEl, thanMatEl, chienDauEl, keBangTamEl].forEach(el => {
    if (!el) return;
    el.addEventListener("change", () => {
      updateInfoUI(); // tốc độ & thời gian còn lại thay đổi tức thì
    });
  });

  // Khởi động nếu đang ở trang crystal.html
  if (levelSelect && progressBar && progressText) {
    applyLevelSelection(true);  // lấy giá trị đầu tiên & reset
    requestAnimationFrame(tick); // vòng lặp mượt
  }

  /* ========= PHẦN 7 — KHỞI TẠO GIÁ TRỊ (index) ========= */
  window.addEventListener("DOMContentLoaded", () => {
    if (beforeInput && beforeOut) calcBefore();
    if (afterInput && afterOut)   calcAfter();
  });

})(); // end IIFE

/* ========= PHẦN 8 — CHOICES TABLE ========= */
const choicesData = [
  { option1:{text:"Ăn quả",reward:"Tăng tu vi",danger:false},           option2:{text:"Uống nước từ suối",reward:"Tăng tu vi",danger:false} },
  { option1:{text:"Bí mật điều tra",reward:"Thư thách đấu",danger:false},option2:{text:"Tấn công trực diện",reward:"Không có gì",danger:true} },
  { option1:{text:"Chiến đấu",reward:"Thư thách đấu",danger:false},      option2:{text:"Ngưỡng mộ",reward:"Tăng tu vi",danger:false} },
  { option1:{text:"Cùng nhau khám phá",reward:"Trừ tu vi",danger:true},  option2:{text:"Tự khám phá",reward:"Đan vàng",danger:false} },
  { option1:{text:"Cứu chữa",reward:"Đan xanh",danger:false},            option2:{text:"Rời đi",reward:"Trừ tu vi",danger:true} },
  { option1:{text:"Đá thần",reward:"Tăng tu vi",danger:false},           option2:{text:"Đá hiếm",reward:"Tăng tu vi",danger:false} },
  { option1:{text:"Đánh nhau với người đó",reward:"Đan xanh",danger:false},option2:{text:"Cho lời khuyên",reward:"Tăng tu vi",danger:false} },
  { option1:{text:"Đi đến hồ đen",reward:"Trừ tu vi",danger:true},       option2:{text:"Đi đến thôn hoa sen",reward:"Đan xanh",danger:false} },
  { option1:{text:"Đi sang trái",reward:"Trừ tu vi",danger:true},        option2:{text:"Đi sang phải",reward:"Thư thách đấu",danger:false} },
  { option1:{text:"Đi trên thuyền",reward:"Đan xanh",danger:false},      option2:{text:"Bay trên kiếm",reward:"Thư thách đấu",danger:false} },
  { option1:{text:"Đi vào ban đêm",reward:"Đan vàng",danger:false},      option2:{text:"Đi vào ban ngày",reward:"Không có gì",danger:true} },
  { option1:{text:"Đồng ý",reward:"Tăng tu vi",danger:false},            option2:{text:"Từ chối",reward:"Tăng tu vi",danger:false} },
  { option1:{text:"Dũng cảm dựa vào",reward:"Tăng tu vi",danger:false},  option2:{text:"Đi nấp",reward:"Không có gì",danger:true} },
  { option1:{text:"Khai thác bề mặt",reward:"Tăng tu vi",danger:false},  option2:{text:"Khai thác sâu",reward:"Không có gì",danger:true} },
  { option1:{text:"Lương thiện",reward:"Tăng tu vi",danger:false},       option2:{text:"Lớn mạnh",reward:"Đan vàng",danger:false} },
  { option1:{text:"Tặng thuốc",reward:"Đan xanh",danger:false},          option2:{text:"Cứu chữa",reward:"Đan vàng",danger:false} },
  { option1:{text:"Tiên thảo",reward:"Tăng tu vi",danger:false},         option2:{text:"Đan dược",reward:"Đan xanh",danger:false} },
  { option1:{text:"Trợ giúp chim loan",reward:"Đan xanh",danger:false},  option2:{text:"Trợ giúp chuột vàng",reward:"Đan vàng",danger:false} },
  { option1:{text:"Tưới vườn thuốc",reward:"Tăng tu vi",danger:false},   option2:{text:"Luyện đan",reward:"Đan xanh",danger:false} },
];

const choicesBody = document.getElementById("choicesBody");
if (choicesBody) {
  choicesData.forEach((q) => {
    const row = document.createElement("tr");
    const td1 = document.createElement("td");
    td1.innerHTML = `<div class="choice ${q.option1.danger ? "danger" : ""}">
      <span>${q.option1.text}</span><span class="reward">(${q.option1.reward})</span></div>`;
    const td2 = document.createElement("td");
    td2.innerHTML = `<div class="choice ${q.option2.danger ? "danger" : ""}">
      <span>${q.option2.text}</span><span class="reward">(${q.option2.reward})</span></div>`;
    row.appendChild(td1); row.appendChild(td2); choicesBody.appendChild(row);
  });
}

/* ========= PHẦN 9 — NÚT ĐIỀU HƯỚNG (không hiện trang hiện tại) ========= */
(function addNavButtons() {
  const main = document.querySelector("main");
  if (!main) return;
  const currentPage = window.location.pathname.split("/").pop();
  const wrapper = document.createElement("div");
  wrapper.className = "exp-link-wrapper";
  const buttons = [
    { href: "index.html",   label: "🏠 Trang chính",       class: "exp-btn back" },
    { href: "exp.html",     label: "📄 Bảng EXP",           class: "exp-btn" },
    { href: "choices.html", label: "❓ Câu hỏi",            class: "exp-btn alt" },
    { href: "crystal.html", label: "🔮 Mô phỏng tinh thể",  class: "exp-btn" },
  ];
  buttons.forEach(b => {
    if (b.href === currentPage) return;
    const a = document.createElement("a");
    a.href = b.href; a.textContent = b.label; a.className = b.class;
    wrapper.appendChild(a);
  });
  main.appendChild(wrapper);
})();
</script>
