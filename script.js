(function () {
  "use strict";

  // ===== Helpers =====
  const $ = (sel) => document.querySelector(sel);
  const root = document.documentElement;

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

  // Info box (may be absent in HTML — we handle nulls)
  const expCapacityEl = $("#expCapacity");
  const baseSpeedEl = $("#baseSpeed");
  const currentSpeedEl = $("#currentSpeed");
  const timeRequiredEl = $("#timeRequired");
  const timeRemainingEl = $("#timeRemaining");
  const customSpeedInput = $("#customSpeed");
  const clearCustomSpeed = $("#clearCustomSpeed")

  // Buff controls
  const suoiLinh = $("#suoiLinh");
  const danTuLinh = $("#danTuLinh") || $("#dantulinh");
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

  // ===== Utils =====
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

  // ===== Speed with Buffs =====
  function getCurrentSpeed(baseSpeed) {
    // Nếu có tốc độ tuỳ chỉnh → bỏ buff
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
    const extra = keBang > 0 ? Math.ceil(keBang / 2) : 0;

    const hmc = parseInt(huyenMinhCong?.value || 0, 10);
    buffPercent += hmc * 0.01;

    return baseSpeed * buffPercent + extra;
  }

  // ===== Xoá tốc độ tuỳ chỉnh =====
  clearCustomSpeed?.addEventListener("click", () => {
    if (customSpeedInput) customSpeedInput.value = "";
    updateCrystalInfo();
  });

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

    // Update only elements that exist in DOM (we support case when expCapacityEl is removed)
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

    // sync totalExp so updateProgressUI can display current/capacity
    totalExp = expCapacity;
  }

  // ===== Progress simulation & UI =====
function updateProgressUI() {
  if (!progressBar || !progressText) return;

  // clamp progress
  const p = Math.max(0, Math.min(100, progress));
  progressBar.style.width = `${p}%`;

  // determine capacity and current EXP
  const capacity = totalExp || 0;
  const currentExp = Math.round((p / 100) * capacity);

  // build display strings
  const capDisplay = capacity ? capacity.toLocaleString() : "—";
  const curDisplay = capacity ? currentExp.toLocaleString() : "—";
  const pctDisplay = `${p >= 99.5 ? 100 : Math.floor(p)}%`;

  // đặt nội dung text
  progressText.textContent = `(${curDisplay}/${capDisplay} – ${pctDisplay})`;
}


  // Recalculate text on resize to keep it placed correctly
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateProgressUI, 80);
  });

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

  // Thiên thư + Sách hệ (Trước Lv15)
  const thienThuValue = parseInt(document.getElementById("thienthu")?.value || 0, 10);
  const sachHeValue   = parseInt(document.getElementById("sachhe")?.value || 0, 10);
  res += thienThuValue + sachHeValue;

  if (beforeOut) beforeOut.textContent = fmt(res);
}

function calcAfter() {
  const expr = (afterInput?.value || "").replace(",", ".");
  const val = safeEval(expr);
  let res = (val * 110) / 95;

  // Thiên thư + Sách hệ (Sau Lv15)
  const thienThuAfter = parseInt(document.getElementById("thienthuAfter")?.value || 0, 10);
  const sachHeAfter   = parseInt(document.getElementById("sachheAfter")?.value || 0, 10);
  res += thienThuAfter + sachHeAfter;

  if (afterOut) afterOut.textContent = fmt(res);
}

// ===== Event listeners =====

// Trước Lv15
beforeInput?.addEventListener("input", calcBefore);
["change","input"].forEach(ev => {
  $("#thienthu")?.addEventListener(ev, calcBefore);
  $("#sachhe")?.addEventListener(ev, calcBefore);
});
clearBefore?.addEventListener("click", () => {
  if (!beforeInput) return;
  beforeInput.value = "";
  calcBefore();
  beforeInput.focus();
});

// Sau Lv15
afterInput?.addEventListener("input", calcAfter);
["change","input"].forEach(ev => {
  $("#thienthuAfter")?.addEventListener(ev, calcAfter);
  $("#sachheAfter")?.addEventListener(ev, calcAfter);
});
clearAfter?.addEventListener("click", () => {
  if (!afterInput) return;
  afterInput.value = "";
  calcAfter();
  afterInput.focus();
});


  // ===== Theme (single, stable) =====
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
    ];
    buttons.forEach((b) => {
      if (b.href === currentPage) return;
      const a = document.createElement("a");
      a.href = b.href; a.textContent = b.label; a.className = b.class;
      wrapper.appendChild(a);
    });
    main.appendChild(wrapper);
  })();

  // ===== Events =====
  levelSelect?.addEventListener("change", startProgress);
  levelSelect?.addEventListener("click", startProgress);
  resetBtn?.addEventListener("click", startProgress);

  // When buffs change update info
  [levelSelect, suoiLinh, danTuLinh, thanchu, thanMat, chienDau, keBangTam, huyenMinhCong].forEach(el => {
    if (el) el.addEventListener("change", () => {
      updateCrystalInfo();
      const key = levelSelect.value;
      if (crystalData[key]) {
        expPerSecond = getCurrentSpeed(crystalData[key].rate);
      }
    });
  });

  // custom speed input behavior
  customSpeedInput?.addEventListener("input", () => {
    const val = parseFloat(customSpeedInput.value);
    if (!isNaN(val) && val >= 0 && customSpeedInput.value !== "") {
      // Reset buffs to default to avoid confusion
      if (suoiLinh) suoiLinh.checked = false;
      if (danTuLinh) danTuLinh.checked = false;
      if (thanchu) thanchu.checked = false;
      if (thanMat) thanMat.value = "0";
      if (chienDau) chienDau.value = "0";
      if (keBangTam) keBangTam.value = "0";
      if (huyenMinhCong) huyenMinhCong.value = "0";
    }
    updateCrystalInfo();
  });

  // clear custom speed handler (defensive)
  clearCustomSpeed?.addEventListener("click", () => {
    if (customSpeedInput) customSpeedInput.value = "";
    updateCrystalInfo();
  });

  // ===== Init =====
  updateCrystalInfo();
  startProgress();
  calcBefore();
  calcAfter();
})();

// ========== Store Integration ==========
(function () {
  "use strict";

  const API_URL = "https://script.google.com/macros/s/AKfycbwO8sd6b9-Uxrm8SeSuCW6IXBQia57J4rNJqwZObBjZ3eUE8VSml-qVjYIdUc_zIvZfVw/exec"; 
  // 👆 thay bằng link Web App của bạn

  // Trang Landing: hiển thị sản phẩm (responsive + bg từ sheet)
  const productList = document.getElementById("product-list");
  if (productList) {
    fetch(API_URL)
      .then(res => {
        console.log("Status:", res.status, res.statusText);
        return res.text();
      })
      .then(txt => {
        console.log("Raw response:", txt);
        let data;
        try {
          data = JSON.parse(txt);
        } catch (e) {
          console.error("Không parse được JSON:", e);
          productList.innerHTML = "<p class='error'>API không trả JSON hợp lệ</p>";
          return;
        }

 productList.innerHTML = "";
        data.forEach(item => {
          const card = document.createElement("div");
          card.className = "card";

          // chỉ set background nếu có link ảnh trong sheet
          if (item.image && item.image.trim() !== "") {
            card.style.background = `
              linear-gradient(to right top, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0) 70%),
              url('${item.image}')
            `;
            card.style.backgroundSize = "cover";
            card.style.backgroundPosition = "right center";
            card.style.backgroundRepeat = "no-repeat";
          }

          card.innerHTML = `
            <h3 class="card__title">${item.name}</h3>
            <p>Số lượng: ${item.quantity}</p>
          `;
          productList.appendChild(card);
        });
      })
      .catch(err => {
        console.error("Fetch lỗi:", err);
        productList.innerHTML = "<p class='error'>Không tải được dữ liệu từ API</p>";
      });
  }

  // Trang Admin: cập nhật sản phẩm
const form = document.getElementById("update-form");
if (form) {
  const productSelect = document.getElementById("product");

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      console.log("Admin loaded products:", data);
      // reset select trước khi thêm option
      productSelect.innerHTML = `<option value="">-- Chọn sản phẩm --</option>`;
      data.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.name;
        opt.textContent = item.name;
        productSelect.appendChild(opt);
      });
    })
    .catch(err => console.error("Không tải được danh sách sản phẩm:", err));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = productSelect.value;
    const quantity = document.getElementById("quantity").value;

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ name, quantity }),
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        form.reset();
      })
      .catch(err => {
        alert("Lỗi cập nhật!");
        console.error(err);
      });
  });
}
})();

// ===== Swipe with smooth transition =====
(function () {
  const container = document.querySelector(".slide-container");
  const slides = document.querySelectorAll(".slide");
  if (!container || slides.length === 0) return;

  let current = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function updateSlide() {
    container.style.transform = `translateX(${-current * 100}%)`;

    // cập nhật dot
    const dots = document.querySelectorAll(".slide-dots .dot");
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function nextSlide() {
    if (current < slides.length - 1) current++;
    else current = 0;
    updateSlide();
  }

  function prevSlide() {
    if (current > 0) current--;
    else current = slides.length - 1;
    updateSlide();
  }

  // touch start
  container.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  // touch move
  container.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  });

  // touch end
  container.addEventListener("touchend", () => {
    if (!isDragging) return;
    const deltaX = startX - currentX;
    if (deltaX > 50) nextSlide();   // swipe trái
    if (deltaX < -50) prevSlide();  // swipe phải
    isDragging = false;
  });

  // nút điều hướng
  document.querySelector(".slide-arrow.left")?.addEventListener("click", prevSlide);
  document.querySelector(".slide-arrow.right")?.addEventListener("click", nextSlide);

  updateSlide();
})();
