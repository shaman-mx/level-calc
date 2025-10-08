(function () {
  "use strict";

  // ===== Helpers =====
  const $ = (sel) => document.querySelector(sel);
  const root = document.documentElement;
  const fmt = (n) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");
  const safeEval = (expr) => {
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) return NaN;
    try { return new Function(`return (${expr})`)(); } catch { return NaN; }
  };
  const formatTime = (sec) => {
    if (!sec || sec <= 0) return "—";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return `${h}h ${m}m ${s}s`;
  };

  // ===== Elements (Calculator) =====
  const beforeInput = $("#beforeInput");
  const afterInput = $("#afterInput");
  const beforeOut = $("#beforeResult");
  const afterOut = $("#afterResult");
  const clearBefore = $("#clearBefore");
  const clearAfter = $("#clearAfter");
  const toggleBtn = $("#themeToggle");

  // ===== Elements (Crystal) =====
  const levelSelect = $("#levelSelect");
  const progressBar = $("#progressBar");
  const progressText = $("#progressText");
  const resetBtn = $("#resetBtn");
  const progressMessage = $("#progressMessage");

  const expCapacityEl = $("#expCapacity");
  const baseSpeedEl = $("#baseSpeed");
  const currentSpeedEl = $("#currentSpeed");
  const timeRequiredEl = $("#timeRequired");
  const timeRemainingEl = $("#timeRemaining");
  const customSpeedInput = $("#customSpeed");
  const clearCustomSpeed = $("#clearCustomSpeed");

  // Buff controls
  const suoiLinh = $("#suoiLinh");
  const danTuLinh = $("#danTuLinh");
  const thanchu = $("#thanchu");
  const thanMat = $("#thanMat");
  const chienDau = $("#chienDau");
  const keBangTam = $("#keBangTam");
  const huyenMinhCong = $("#huyenMinhCong");

  // ===== State =====
  let progress = 0;
  let expPerSecond = 0;
  let totalExp = 0;
  let timer = null;

  // ===== Data =====
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
    "9-sơ": { exp: 63460, rate: 10 },
    "9-trung": { exp: 66500, rate: 10 },
    "9-hậu": { exp: 69920, rate: 10 },
    "10-sơ": { exp: 73454, rate: 10 },
    "10-trung": { exp: 77140, rate: 10 },
    "10-hậu": { exp: 80940, rate: 10 },
    "11-sơ": { exp: 95000, rate: 10 },
    "11-hậu": { exp: 114000, rate: 10 },
    "12-sơ": { exp: 380000, rate: 30 },
    "12-trung": { exp: 311600, rate: 30 },
    "12-hậu": { exp: 326800, rate: 30 },
    "13-sơ": { exp: 334400, rate: 30 },
    "13-trung": { exp: 342000, rate: 30 },
    "13-hậu": { exp: 344166, rate: 30 },
    "14-sơ": { exp: 350360, rate: 30 },
    "14-trung": { exp: 356668, rate: 30 },
    "14-hậu": { exp: 363090, rate: 30 },
    "15-trung": { exp: 376200, rate: 30 },
    "15-hậu": { exp: 383055, rate: 30 },
  };

  // ===== Speed with Buffs =====
  function getCurrentSpeed(baseSpeed) {
    if (customSpeedInput && customSpeedInput.value !== "") {
      return parseFloat(customSpeedInput.value) || 0;
    }
    let buffPercent = 1;
    if (suoiLinh?.checked) buffPercent += 0.1;
    if (danTuLinh?.checked) buffPercent += 0.2;
    if (thanchu?.checked) buffPercent += 0.3;
    buffPercent += parseInt(thanMat?.value || 0, 10) * 0.05;
    const cd = parseInt(chienDau?.value || 0, 10);
    if (cd >= 1501) buffPercent += 0.15;
    else if (cd >= 1001) buffPercent += 0.07;
    else if (cd >= 501) buffPercent += 0.05;
    else if (cd >= 200) buffPercent += 0.03;
    const keBang = parseInt(keBangTam?.value || 0, 10);
    const extra = keBang;
    const hmc = parseInt(huyenMinhCong?.value || 0, 10);
    buffPercent += hmc * 0.01;
    return baseSpeed * buffPercent + extra;
  }

  // ===== Info box update =====
  function updateCrystalInfo() {
    if (!levelSelect) return;
    const key = levelSelect.value;
    const data = crystalData[key];
    if (!data) return;
    const expCapacity = data.exp;
    const baseSpeed = data.rate;
    const currentSpeed = getCurrentSpeed(baseSpeed);
    const timeRequiredSec = currentSpeed > 0 ? expCapacity / currentSpeed : 0;
    if (expCapacityEl) expCapacityEl.textContent = expCapacity.toLocaleString();
    if (baseSpeedEl) baseSpeedEl.textContent = baseSpeed.toFixed(2);
    if (currentSpeedEl) currentSpeedEl.textContent = currentSpeed.toFixed(2);
    if (timeRequiredEl) timeRequiredEl.textContent = formatTime(timeRequiredSec);
    if (progress > 0 && currentSpeed > 0) {
      const expRemaining = expCapacity * (1 - progress / 100);
      if (timeRemainingEl) timeRemainingEl.textContent = formatTime(expRemaining / currentSpeed);
    } else {
      if (timeRemainingEl) timeRemainingEl.textContent = "—";
    }
    totalExp = expCapacity;
  }

  // ===== Progress simulation & UI =====
  function updateProgressUI() {
    if (!progressBar || !progressText) return;
    const p = Math.max(0, Math.min(100, progress));
    progressBar.style.width = `${p}%`;
    const capacity = totalExp || 0;
    const currentExp = Math.round((p / 100) * capacity);
    const capDisplay = capacity ? capacity.toLocaleString() : "—";
    const curDisplay = capacity ? currentExp.toLocaleString() : "—";
    const pctDisplay = `${p >= 99.5 ? 100 : Math.floor(p)}%`;
    progressText.textContent = `(${curDisplay}/${capDisplay} – ${pctDisplay})`;
  }

  function startProgress() {
    if (timer) cancelAnimationFrame(timer);
    if (!levelSelect || !progressBar || !progressText) return;
    const key = levelSelect.value;
    const data = crystalData[key];
    if (!data) return;
    totalExp = data.exp;
    progress = 0;
    updateProgressUI();
    if (progressMessage) {
      progressMessage.textContent = "";
      progressMessage.classList.remove("danger-glow");
    }
    let lastTime = performance.now();
    function animate(now) {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      expPerSecond = getCurrentSpeed(data.rate);
      progress += (expPerSecond / totalExp) * 100 * delta;
      if (progress >= 100) {
        progress = 100;
        updateProgressUI();
        if (progressMessage) {
          progressMessage.textContent = "✨ Tinh thể tu vi đã đầy!";
          progressMessage.classList.add("danger-glow");
        }
        cancelAnimationFrame(timer);
        timer = null;
        return;
      }
      updateProgressUI();
      updateCrystalInfo();
      timer = requestAnimationFrame(animate);
    }
    timer = requestAnimationFrame(animate);
  }

  // ===== Calculator (before/after Lv15) =====
  function calcBefore() {
    const expr = (beforeInput?.value || "").replace(",", ".");
    const val = safeEval(expr);
    let res = (val * 105) / 95;
    const selected = document.querySelector("input[name='sachhe']:checked");
    const sachHeValue = selected ? parseInt(selected.value, 10) : 0;
    res += sachHeValue;
    if (beforeOut) beforeOut.textContent = fmt(res);
  }

  function calcAfter() {
    const expr = (afterInput?.value || "").replace(",", ".");
    const val = safeEval(expr);
    let res = (val * 110) / 95;
    const selected = document.querySelector("input[name='sachheAfter']:checked");
    const sachHeValue = selected ? parseInt(selected.value, 10) : 0;
    res += sachHeValue;
    if (afterOut) afterOut.textContent = fmt(res);
  }

  // ===== Theme =====
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (toggleBtn) toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  (function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
    else setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    toggleBtn?.addEventListener("click", () => {
      const cur = root.getAttribute("data-theme");
      setTheme(cur === "dark" ? "light" : "dark");
    });
  })();

  // ===== Swipe slides + swipe button =====
  (function () {
    const container = document.querySelector(".slide-container");
    if (!container) return;
    const slides = container.querySelectorAll(".slide");
    if (slides.length <= 1) return;
    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isTouching = false;
    const THRESHOLD = 60;
    container.style.touchAction = "pan-y";

function goTo(index, animate = true) {
  index = Math.max(0, Math.min(index, slides.length - 1));
  currentIndex = index;
  container.style.transition = animate ? "transform 0.3s ease" : "none";
  container.style.transform = `translateX(-${currentIndex * 100}%)`;

  // cập nhật dot
  const dots = document.querySelectorAll(".slide-dots .dot");
  dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));

  // ✅ đồng bộ swipe button
  const swipeBtn = document.getElementById("swipeBtn");
  if (swipeBtn) {
    const thumb = swipeBtn.querySelector(".swipe-thumb");
    const maxX = swipeBtn.offsetWidth - thumb.offsetWidth;
    thumb.style.transition = "left 0.25s ease";
    thumb.style.left = (currentIndex === 0 ? "0px" : maxX + "px");
    // ✅ cập nhật text và vị trí
    const swipeText = swipeBtn.querySelector("#swipeText");
    if (swipeText) {
      if (currentIndex === 0) {
        swipeText.textContent = "SAU LEVEL 15 >";
        swipeText.classList.remove("left");
        swipeText.classList.add("right");
      } else {
        swipeText.textContent = "< TRƯỚC LEVEL 15";
        swipeText.classList.remove("right");
        swipeText.classList.add("left");
      }
    }
  }
}



    // swipe container
    container.addEventListener("pointerdown", (e) => {
      isTouching = true;
      startX = e.clientX;
      currentX = startX;
      container.style.transition = "none";
    });
    container.addEventListener("pointermove", (e) => {
      if (!isTouching) return; 
      currentX = e.clientX;
      const dx = currentX - startX;
      container.style.transform = `translateX(calc(${-currentIndex * 100}% + ${dx}px))`;
    });
    container.addEventListener("pointerup", () => {
      if (!isTouching) return;
      const dx = currentX - startX;
      isTouching = false;
      if (dx > THRESHOLD && currentIndex > 0) goTo(currentIndex - 1, true);
      else if (dx < -THRESHOLD && currentIndex < slides.length - 1) goTo(currentIndex + 1, true);
      else goTo(currentIndex, true);
    });

    // dots
    document.querySelectorAll(".slide-dots .dot").forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

    // swipe button
    const swipeBtn = document.getElementById("swipeBtn");
    if (swipeBtn) {
      const thumb = swipeBtn.querySelector(".swipe-thumb");
      let dragging = false;
      let startThumbX = 0;
      thumb.addEventListener("pointerdown", (e) => {
        dragging = true;
        startThumbX = e.clientX - thumb.offsetLeft;
        thumb.style.transition = "none";
      });
      document.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        let x = e.clientX - startThumbX;
        const maxX = swipeBtn.offsetWidth - thumb.offsetWidth;
        if (x < 0) x = 0;
        if (x > maxX) x = maxX;
        thumb.style.left = x + "px";
      });
document.addEventListener("pointerup", () => {
  if (!dragging) return;
  dragging = false;
  const maxX = swipeBtn.offsetWidth - thumb.offsetWidth;

// Nếu đang ở Before và kéo sang phải đủ xa -> sang After
if (currentIndex === 0 && thumb.offsetLeft >= maxX - 10) {
  goTo(1, true);
  thumb.style.transition = "left 0.2s ease";
  thumb.style.left = maxX + "px"; // 👉 đổi từ "0px" thành maxX
}
// Nếu đang ở After và kéo sang trái (gần 0) -> quay về Before
else if (currentIndex === 1 && thumb.offsetLeft <= 10) {
  goTo(0, true);
  thumb.style.transition = "left 0.2s ease";
  thumb.style.left = "0px";
}
// Nếu chưa đủ xa thì reset thumb
else {
  thumb.style.transition = "left 0.2s ease";
  thumb.style.left = currentIndex === 0 ? "0px" : maxX + "px";
}
});


    }

    goTo(0, false);
  })();

  // ===== Events =====
  beforeInput?.addEventListener("input", calcBefore);
  document.querySelectorAll("input[name='sachhe']").forEach(r => r.addEventListener("change", calcBefore));
  afterInput?.addEventListener("input", calcAfter);
  document.querySelectorAll("input[name='sachheAfter']").forEach(r => r.addEventListener("change", calcAfter));
  clearBefore?.addEventListener("click", () => { if (beforeInput) { beforeInput.value = ""; calcBefore(); } });
  clearAfter?.addEventListener("click", () => { if (afterInput) { afterInput.value = ""; calcAfter(); } });

  levelSelect?.addEventListener("change", startProgress);
  resetBtn?.addEventListener("click", startProgress);
  [levelSelect, suoiLinh, danTuLinh, thanchu, thanMat, chienDau, keBangTam, huyenMinhCong].forEach(el => {
    if (el) el.addEventListener("change", updateCrystalInfo);
  });
  customSpeedInput?.addEventListener("input", () => updateCrystalInfo());
  clearCustomSpeed?.addEventListener("click", () => { if (customSpeedInput) customSpeedInput.value = ""; updateCrystalInfo(); });

  // init
  updateCrystalInfo();
  startProgress();
  calcBefore();
  calcAfter();
})();
// ===== Choices table =====
  const choicesData = [
    { option1: { text: "Ăn quả", reward: "Tăng tu vi", danger: false }, option2: { text: "Uống nước từ suối", reward: "Tăng tu vi", danger: false } },
    { option1: { text: "Bí mật điều tra", reward: "Thư thách đấu", danger: false }, option2: { text: "Tấn công trực diện", reward: "Không có gì", danger: true } },
    { option1: { text: "Chiến đấu", reward: "Thư thách đấu", danger: false }, option2: { text: "Ngưỡng mộ", reward: "Tăng tu vi", danger: false } },
    { option1: { text: "Cùng nhau khám phá", reward: "Trừ tu vi", danger: true }, option2: { text: "Tự khám phá", reward: "Đan vàng", danger: false } },
    { option1: { text: "Cứu chữa", reward: "Đan xanh", danger: false }, option2: { text: "Rời đi", reward: "Trừ tu vi", danger: true } },
    { option1: { text: "Đá thần", reward: "Tăng tu vi", danger: false }, option2: { text: "Đá hiếm", reward: "Tăng tu vi", danger: false } },
    { option1: { text: "Đánh nhau với người đó", reward: "Đan xanh", danger: false }, option2: { text: "Cho lời khuyên", reward: "Tăng tu vi", danger: false } },
    { option1: { text: "Đi đến hồ đen", reward: "Trừ tu vi", danger: true }, option2: { text: "Đi đến thôn hoa sen", reward: "Đan xanh", danger: false } },
    { option1: { text: "Đi sang trái", reward: "Trừ tu vi", danger: true }, option2: { text: "Đi sang phải", reward: "Thư thách đấu", danger: false } },
    { option1: { text: "Đi trên thuyền", reward: "Đan xanh", danger: false }, option2: { text: "Bay trên kiếm", reward: "Thư thách đấu", danger: false } },
    { option1: { text: "Đi vào ban đêm", reward: "Đan vàng", danger: false }, option2: { text: "Đi vào ban ngày", reward: "Không có gì", danger: true } },
    { option1: { text: "Đồng ý", reward: "Tăng tu vi", danger: false }, option2: { text: "Từ chối", reward: "Tăng tu vi", danger: false } },
    { option1: { text: "Dũng cảm dựa vào", reward: "Tăng tu vi", danger: false }, option2: { text: "Đi nấp", reward: "Không có gì", danger: true } },
    { option1: { text: "Khai thác bề mặt", reward: "Tăng tu vi", danger: false }, option2: { text: "Khai thác sâu", reward: "Không có gì", danger: true } },
    { option1: { text: "Lương thiện", reward: "Tăng tu vi", danger: false }, option2: { text: "Lớn mạnh", reward: "Đan vàng", danger: false } },
    { option1: { text: "Tặng thuốc", reward: "Đan xanh", danger: false }, option2: { text: "Cứu chữa", reward: "Đan vàng", danger: false } },
    { option1: { text: "Tiên thảo", reward: "Tăng tu vi", danger: false }, option2: { text: "Đan dược", reward: "Đan xanh", danger: false } },
    { option1: { text: "Trợ giúp chim loan", reward: "Đan xanh", danger: false }, option2: { text: "Trợ giúp chuột vàng", reward: "Đan vàng", danger: false } },
    { option1: { text: "Tưới vườn thuốc", reward: "Tăng tu vi", danger: false }, option2: { text: "Luyện đan", reward: "Đan xanh", danger: false } },
    { option1: { text: "Đi bên trái", reward: "Trừ tu vi", danger: true }, option2: { text: "Đi bên phải", reward: "Thư thách đấu", danger: false } },
  ];
  (function buildChoices() {
    const choicesBody = document.getElementById("choicesBody");
    if (!choicesBody) return;
    choicesBody.innerHTML = "";
    choicesData.forEach((q) => {
      const row = document.createElement("tr");
      const td1 = document.createElement("td");
      td1.innerHTML = `<div class="choice ${q.option1.danger ? "danger" : ""}">
        <span>${q.option1.text}</span><span class="reward">(${q.option1.reward})</span></div>`;
      const td2 = document.createElement("td");
      td2.innerHTML = `<div class="choice ${q.option2.danger ? "danger" : ""}">
        <span>${q.option2.text}</span><span class="reward">(${q.option2.reward})</span></div>`;
      row.append(td1, td2);
      choicesBody.appendChild(row);
    });
  })();
// ===== Nav buttons =====
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
      { href: "crystal.html", label: "🔮 Mô phỏng tinh thể", class: "exp-btn" },
      { href: "out.html", label: "🥊 Ao Chình", class: "exp-btn alt" },
    ];
    buttons.forEach((b) => {
      if (b.href === currentPage) return;
      const a = document.createElement("a");
      a.href = b.href; a.textContent = b.label; a.className = b.class;
      wrapper.appendChild(a);
    });
    main.appendChild(wrapper);
  })();
