// =================== DỮ LIỆU TINH THỂ TU VI ===================
const crystalData = {
  "1-sơ": { exp: 6, speed: 1 },
  "1-trung": { exp: 8, speed: 1 },
  "1-hậu": { exp: 18, speed: 1 },
  "2-sơ": { exp: 38, speed: 1 },
  "2-trung": { exp: 160, speed: 1 },
  "2-hậu": { exp: 320, speed: 1 },
  "3-sơ": { exp: 1938, speed: 3 },
  "3-trung": { exp: 5000, speed: 3 },
  "3-hậu": { exp: 8740, speed: 3 },
  "4-sơ": { exp: 9100, speed: 5 },
  "4-trung": { exp: 9690, speed: 5 },
  "4-hậu": { exp: 16150, speed: 5 },
  "5-sơ": { exp: 17670, speed: 5 },
  "5-trung": { exp: 18544, speed: 5 },
  "5-hậu": { exp: 19874, speed: 5 },
  "6-sơ": { exp: 20444, speed: 5 },
  "6-trung": { exp: 21470, speed: 5 },
  "6-hậu": { exp: 22420, speed: 5 },
  "7-sơ": { exp: 23674, speed: 5 }
};

// =================== PHẦN TỬ HTML ===================
const levelSelect = document.getElementById("level");
const suoiLinh = document.getElementById("suoiLinh");
const thanMat = document.getElementById("thanMat");
const chienDau = document.getElementById("chienDau");
const keBangTam = document.getElementById("keBangTam");
const dungLuongEl = document.getElementById("dungLuong");
const tocDoEl = document.getElementById("tocDo");
const thoiGianEl = document.getElementById("thoiGian");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const resetBtn = document.getElementById("resetBtn");
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

let interval;
let currentExp = 0;

// =================== ĐỒNG BỘ DARK / LIGHT MODE ===================
function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

// Khởi tạo theme theo localStorage hoặc hệ thống
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
} else {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}

// Bấm nút đổi theme
themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// =================== TÍNH TỐC ĐỘ HIỆN TẠI ===================
function calcSpeed() {
  const level = levelSelect.value;
  const base = crystalData[level].speed;

  let speed = base;
  if (suoiLinh.checked) speed *= 1.1;
  speed *= 1 + thanMat.value / 100;
  speed *= 1 + chienDau.value / 100;
  speed += parseInt(keBangTam.value);

  return speed;
}

// =================== CẬP NHẬT GIAO DIỆN ===================
function updateUI() {
  const level = levelSelect.value;
  const totalExp = crystalData[level].exp;
  const speed = calcSpeed();
  const remaining = Math.max(totalExp - currentExp, 0);
  const seconds = Math.ceil(remaining / speed);

  dungLuongEl.textContent = totalExp;
  tocDoEl.textContent = speed.toFixed(2);
  thoiGianEl.textContent = `${Math.floor(seconds / 3600)} giờ ${Math.floor((seconds % 3600) / 60)} phút ${seconds % 60} giây`;

  const percent = Math.min((currentExp / totalExp) * 100, 100);
  progressFill.style.width = `${percent}%`;
  progressFill.style.background = percent >= 100 ? "#16a34a" : "#2563eb";
  progressText.textContent = `${percent.toFixed(1)}%`;
}

// =================== CHẠY TIẾN TRÌNH ===================
function startProgress() {
  clearInterval(interval);
  interval = setInterval(() => {
    const level = levelSelect.value;
    const totalExp = crystalData[level].exp;
    const speed = calcSpeed();

    currentExp += speed;

    if (currentExp >= totalExp) {
      currentExp = totalExp;
      updateUI();
      clearInterval(interval);
      alert("🎉 Tinh thể đã đầy!");
    } else {
      updateUI();
    }
  }, 1000);
}

// =================== NÚT RESET ===================
resetBtn.addEventListener("click", () => {
  currentExp = 0;
  startProgress();
});

// =================== SỰ KIỆN NGƯỜI DÙNG ===================
[levelSelect, suoiLinh, thanMat, chienDau, keBangTam].forEach(el => {
  el.addEventListener("change", () => {
    updateUI();
  });
});

// =================== KHỞI TẠO ===================
updateUI();
startProgress();
