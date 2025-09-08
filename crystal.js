/* =========================================================
   TU TIÊN WEPLAY – Script hợp nhất cho toàn bộ website
   - Máy tính trước/sau Lv15 (index)
   - Mô phỏng tinh thể tu vi (crystal)
   - Bảng EXP / Câu hỏi: sinh điều hướng
   - Đồng bộ Dark/Light theme
   ========================================================= */
(function () {
  "use strict";

  /* -------------------- Helpers chung -------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const rootEl = document.documentElement;
  const themeToggleBtn = $("#themeToggle");

  function setTheme(theme) {
    rootEl.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (themeToggleBtn) themeToggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
    // tránh nháy nhỏ
    document.body.style.visibility = "hidden";
    void document.body.offsetHeight;
    document.body.style.visibility = "visible";
  }
  // Khởi tạo theme ngay
  (function initTheme() {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(saved || (prefersDark ? "dark" : "light"));
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const cur = rootEl.getAttribute("data-theme");
        setTheme(cur === "dark" ? "light" : "dark");
      });
    }
  })();

  /* ---------------- Máy tính trước/sau Lv15 (index) ---------------- */
  (function setupIndexCalc() {
    const beforeInput = $("#beforeInput");
    const afterInput = $("#afterInput");
    const beforeOut = $("#beforeResult");
    const afterOut = $("#afterResult");
    const clearBefore = $("#clearBefore");
    const clearAfter = $("#clearAfter");

    if (!beforeInput && !afterInput) return; // không ở trang index

    const format = (num) => (Number.isFinite(num) ? num.toFixed(2) : "0.00");
    const safeEval = (expr) => {
      if (!/^[0-9+\-*/().\s]+$/.test(expr)) return NaN;
      try {
        // eslint-disable-next-line no-new-func
        return new Function(`return (${expr})`)();
      } catch {
        return NaN;
      }
    };

    function calcBefore() {
      const expr = beforeInput.value.replace(",", ".");
      const val = safeEval(expr);
      const res = (val * 105) / 95;
      if (beforeOut) beforeOut.textContent = format(res);
    }
    function calcAfter() {
      const expr = afterInput.value.replace(",", ".");
      const val = safeEval(expr);
      const res = (val * 110) / 95;
      if (afterOut) afterOut.textContent = format(res);
    }

    if (beforeInput && beforeOut) beforeInput.addEventListener("input", calcBefore);
    if (afterInput && afterOut) afterInput.addEventListener("input", calcAfter);

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

    window.addEventListener("DOMContentLoaded", () => {
      if (beforeInput && beforeOut) calcBefore();
      if (afterInput && afterOut) calcAfter();
    });
  })();

  /* -------------------- Mô phỏng tinh thể (crystal) -------------------- */
  (function setupCrystal() {
    // Phần tử bắt buộc của trang crystal
    const levelSelect = $("#levelSelect");
    const cbSuoiLinh = $("#suoiLinh");
    const selThanMat = $("#thanMat");
    const selChienDau = $("#chienDau");
    const selKeBangTam = $("#keBangTam");

    const outCapacity = $("#expCapacity");
    const outBase = $("#baseSpeed");
    const outCurrent = $("#currentSpeed");
    const outTimeReq = $("#timeRequired");
    const outTimeRemain = $("#timeRemaining");

    const progressBar = $("#progressBar");
    const progressText = $("#progressText");
    const resetBtn = $("#resetBtn");

    // Không ở trang crystal
    if (!levelSelect || !progressBar || !progressText) return;

    // Dữ liệu dung lượng tinh thể đã xác nhận
    const CAPACITY = {
      "1-sơ": 6,
      "1-trung": 8,
      "1-hậu": 18,
      "2-sơ": 38,
      "2-trung": 160,
      "2-hậu": 320,
      "3-sơ": 1938,
      "3-trung": 5000,
      "3-hậu": 8740,
      "4-sơ": 9100,
      "4-trung": 9690,
      "4-hậu": 16150,
      "5-sơ": 17670,
      "5-trung": 18544,
      "5-hậu": 19874,
      "6-sơ": 20444,
      "6-trung": 21470,
      "6-hậu": 22420,
      "7-sơ": 23674
      "7-trung": 24852
      "7-hậu": 26106
      "8-sơ": 27398
      // sẽ bổ sung thêm khi có số liệu
    };

    // Tốc độ gốc theo Level
    function baseSpeedByLevel(levelNum) {
      const n = Number(levelNum);
      if (n <= 0) return 0;
      if (n === 1) return 1;
      if (n === 2) return 1;
      if (n === 3) return 3;
      if (n === 4) return 5;
      if (n >= 5 && n <= 7) return 5;
      if (n >= 8 && n <= 11) return 10;
      if (n >= 12 && n <= 15) return 30;
      if (n === 16 || n === 17) return 50;
      if (n === 18) return 100;
      return 0;
    }

    // Map tinh thần chiến đấu -> % tăng tốc (trên tốc độ gốc)
    function chienDauPercent(val) {
      const v = Number(val);
      if (v >= 1501) return 15;
      if (v >= 1001) return 7;
      if (v >= 501) return 5;
      if (v >= 200) return 3;
      return 0;
    }

    // Map Kế băng tâm -> +EXP/s
    function keBangTamFlat(val) {
      const v = Number(val);
      if (v >= 5) return 3;
      if (v >= 3) return 2;
      if (v >= 1) return 1;
      return 0;
    }

    // State mô phỏng
    const state = {
      levelKey: "", // "4-trung" ...
      capacity: 0,
      levelNum: 0,
      baseSpeed: 0, // EXP/s
      // chạy liên tục
      startTime: performance.now(), // ms
      startExp: 0, // EXP tại startTime
      currentSpeed: 0, // EXP/s (đã tính buff)
      finished: false
    };

    function parseLevelKey(key) {
      // "4-trung" -> { num:4, phase:"trung" }
      const [numStr] = key.split("-");
      return { num: Number(numStr) || 0 };
    }

    // Tính tốc độ hiện tại với buff, KHÔNG reset progress
    function recalcSpeedKeepProgress() {
      // Đang ở giữa -> ghi nhận EXP hiện tại rồi set lại mốc mới
      const now = performance.now();
      const expNow = getCurrentExp(now);
      state.startExp = expNow;
      state.startTime = now;

      const base = state.baseSpeed; // tốc độ gốc theo level
      let percent = 0;
      if (cbSuoiLinh && cbSuoiLinh.checked) percent += 10;
      if (selThanMat) {
        const tm = Number(selThanMat.value || 0);
        percent += tm * 5; // 1,2,3 người -> +5/10/15%
      }
      if (selChienDau) percent += chienDauPercent(selChienDau.value);

      const flat = selKeBangTam ? keBangTamFlat(selKeBangTam.value) : 0;

      // % chỉ cộng trên tốc độ gốc, sau cùng cộng thêm flat
      const speed = base * (1 + percent / 100) + flat;
      state.currentSpeed = Math.max(0, speed);

      // cập nhật hiển thị
      if (outBase) outBase.textContent = base.toFixed(2);
      if (outCurrent) outCurrent.textContent = state.currentSpeed.toFixed(2);

      // thời gian lý thuyết từ 0% với tốc độ hiện tại
      if (outTimeReq) {
        const t = state.currentSpeed > 0 ? state.capacity / state.currentSpeed : Infinity;
        outTimeReq.textContent = formatDuration(t);
      }
    }

    // Reset khi đổi Level/Giai đoạn hoặc bấm Reset
    function resetCrystal(fromLevelChange = false) {
      // đổi level -> cập nhật capacity, base
      if (fromLevelChange) {
        const key = levelSelect.value;
        state.levelKey = key || "";
        const { num } = parseLevelKey(state.levelKey);
        state.levelNum = num;
        state.capacity = CAPACITY[state.levelKey] || 0;
        state.baseSpeed = baseSpeedByLevel(num);
        state.finished = false;

        // thông tin cơ bản
        if (outCapacity) outCapacity.textContent = state.capacity.toLocaleString("vi-VN");
        if (outBase) outBase.textContent = state.baseSpeed.toFixed(2);
      }

      // reset tiến trình
      state.startExp = 0;
      state.startTime = performance.now();
      state.finished = false;

      // tính lại tốc độ với buff hiện tại
      recalcSpeedKeepProgress();
      // ép vẽ UI ngay
      drawProgress(performance.now());
    }

    // EXP tại thời điểm t (ms)
    function getCurrentExp(tms) {
      const elapsedSec = Math.max(0, (tms - state.startTime) / 1000);
      const exp = state.startExp + elapsedSec * state.currentSpeed;
      return Math.min(exp, state.capacity);
    }

    function formatDuration(totalSeconds) {
      if (!isFinite(totalSeconds)) return "—";
      const s = Math.max(0, Math.floor(totalSeconds));
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      return `${h} giờ ${m} phút ${sec} giây`;
    }

    function drawProgress(now) {
      const exp = getCurrentExp(now);
      const ratio = state.capacity > 0 ? exp / state.capacity : 0;
      const pct = Math.max(0, Math.min(100, ratio * 100));

      if (progressBar) progressBar.style.width = `${pct}%`;
      if (progressText) progressText.textContent = `${pct.toFixed(1)}%`;

      // Còn lại
      const remainExp = Math.max(0, state.capacity - exp);
      const remainSec =
        state.currentSpeed > 0 ? remainExp / state.currentSpeed : Infinity;
      if (outTimeRemain) outTimeRemain.textContent = formatDuration(remainSec);

      // Thông báo khi đầy (1 lần)
      if (!state.finished && exp >= state.capacity && state.capacity > 0) {
        state.finished = true;
        try {
          // nhẹ nhàng, tránh spam
          alert("✨ Tinh thể đã đầy!");
        } catch {}
      }
    }

    // Vòng lặp mượt với rAF
    (function tick() {
      const now = performance.now();
      drawProgress(now);
      requestAnimationFrame(tick);
    })();

    // Liên kết sự kiện
    levelSelect.addEventListener("change", () => resetCrystal(true));
    if (cbSuoiLinh) cbSuoiLinh.addEventListener("change", recalcSpeedKeepProgress);
    if (selThanMat) selThanMat.addEventListener("change", recalcSpeedKeepProgress);
    if (selChienDau) selChienDau.addEventListener("change", recalcSpeedKeepProgress);
    if (selKeBangTam) selKeBangTam.addEventListener("change", recalcSpeedKeepProgress);
    if (resetBtn) resetBtn.addEventListener("click", () => resetCrystal(false));

    // Tự động chạy ngay với lựa chọn mặc định
    resetCrystal(true);
  })();

  /* ----------------- Bảng lựa chọn (choices.html) ----------------- */
  (function renderChoicesIfAny() {
    const choicesBody = $("#choicesBody");
    if (!choicesBody) return;

    const choicesData = [
      { option1: { text: "Ăn quả", reward: "Tăng tu vi", danger: false },
        option2: { text: "Uống nước từ suối", reward: "Tăng tu vi", danger: false }},

      { option1: { text: "Bí mật điều tra", reward: "Thư thách đấu", danger: false },
        option2: { text: "Tấn công trực diện", reward: "Không có gì", danger: true }},

      { option1: { text: "Chiến đấu", reward: "Thư thách đấu", danger: false },
        option2: { text: "Ngưỡng mộ", reward: "Tăng tu vi", danger: false }},

      { option1: { text: "Cùng nhau khám phá", reward: "Trừ tu vi", danger: true },
        option2: { text: "Tự khám phá", reward: "Đan vàng", danger: false }},

      { option1: { text: "Cứu chữa", reward: "Đan xanh", danger: false },
        option2: { text: "Rời đi", reward: "Trừ tu vi", danger: true }},

      { option1: { text: "Đá thần", reward: "Tăng tu vi", danger: false },
        option2: { text: "Đá hiếm", reward: "Tăng tu vi", danger: false }},

      { option1: { text: "Đánh nhau với người đó", reward: "Đan xanh", danger: false },
        option2: { text: "Cho lời khuyên", reward: "Tăng tu vi", danger: false }},

      { option1: { text: "Đi đến hồ đen", reward: "Trừ tu vi", danger: true },
        option2: { text: "Đi đến thôn hoa sen", reward: "Đan xanh", danger: false }},

      { option1: { text: "Đi sang trái", reward: "Trừ tu vi", danger: true },
        option2: { text: "Đi sang phải", reward: "Thư thách đấu", danger: false }},

      { option1: { text: "Đi trên thuyền", reward: "Đan xanh", danger: false },
        option2: { text: "Bay trên kiếm", reward: "Thư thách đấu", danger: false }},

      { option1: { text: "Đi vào ban đêm", reward: "Đan vàng", danger: false },
        option2: { text: "Đi vào ban ngày", reward: "Không có gì", danger: true }},

      { option1: { text: "Đồng ý", reward: "Tăng tu vi", danger: false },
        option2: { text: "Từ chối", reward: "Tăng tu vi", danger: false }},

      { option1: { text: "Dũng cảm dựa vào", reward: "Tăng tu vi", danger: false },
        option2: { text: "Đi nấp", reward: "Không có gì", danger: true }},

      { option1: { text: "Khai thác bề mặt", reward: "Tăng tu vi", danger: false },
        option2: { text: "Khai thác sâu", reward: "Không có gì", danger: true }},

      { option1: { text: "Lương thiện", reward: "Tăng tu vi", danger: false },
        option2: { text: "Lớn mạnh", reward: "Đan vàng", danger: false }},

      { option1: { text: "Tặng thuốc", reward: "Đan xanh", danger: false },
        option2: { text: "Cứu chữa", reward: "Đan vàng", danger: false }},

      { option1: { text: "Tiên thảo", reward: "Tăng tu vi", danger: false },
        option2: { text: "Đan dược", reward: "Đan xanh", danger: false }},

      { option1: { text: "Trợ giúp chim loan", reward: "Đan xanh", danger: false },
        option2: { text: "Trợ giúp chuột vàng", reward: "Đan vàng", danger: false }},

      { option1: { text: "Tưới vườn thuốc", reward: "Tăng tu vi", danger: false },
        option2: { text: "Luyện đan", reward: "Đan xanh", danger: false }},
    ];

    const frag = document.createDocumentFragment();
    choicesData.forEach((q) => {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");

      td1.innerHTML = `
        <div class="choice ${q.option1.danger ? "danger" : ""}">
          <span>${q.option1.text}</span>
          <span class="reward">(${q.option1.reward})</span>
        </div>
      `;
      td2.innerHTML = `
        <div class="choice ${q.option2.danger ? "danger" : ""}">
          <span>${q.option2.text}</span>
          <span class="reward">(${q.option2.reward})</span>
        </div>
      `;
      tr.appendChild(td1);
      tr.appendChild(td2);
      frag.appendChild(tr);
    });
    choicesBody.appendChild(frag);
  })();

  /* --------------- Điều hướng tự động (ẩn trang hiện tại) --------------- */
  (function addNavButtons() {
    const main = document.querySelector("main");
    if (!main) return;

    const current = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

    const wrapper = document.createElement("div");
    wrapper.className = "exp-link-wrapper";

    const allButtons = [
      { href: "index.html", label: "🏠 Trang chính", class: "exp-btn back" },
      { href: "exp.html", label: "📄 Bảng EXP", class: "exp-btn" },
      { href: "choices.html", label: "❓ Câu hỏi", class: "exp-btn alt" },
      { href: "crystal.html", label: "🔷 Mô phỏng tinh thể", class: "exp-btn" },
    ];

    allButtons
      .filter((b) => b.href.toLowerCase() !== current)
      .forEach((b) => {
        const a = document.createElement("a");
        a.href = b.href;
        a.textContent = b.label;
        a.className = b.class;
        wrapper.appendChild(a);
      });

    main.appendChild(wrapper);
  })();
})();
