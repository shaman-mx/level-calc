// =============================
// DARK / LIGHT MODE ĐỒNG BỘ VỚI INDEX
// =============================
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

// Load theme từ localStorage
const savedTheme = localStorage.getItem("theme") || "light";
root.setAttribute("data-theme", savedTheme);
if (themeToggle) {
  themeToggle.textContent = savedTheme === "dark" ? "🌙" : "🌞";
}

// Toggle theme khi bấm nút
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme =
      root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
    themeToggle.textContent = currentTheme === "dark" ? "🌙" : "🌞";
  });
}

// =============================
// DỮ LIỆU LEVEL + EXP + RATE
// =============================
const levelData = {
  "1 sơ": { exp: 6, rate: 1 },
  "1 trung": { exp: 8, rate: 1 },
  "1 hậu": { exp: 18, rate: 1 },
  "2 sơ": { exp: 38, rate: 1 },
  "2 trung": { exp: 160, rate: 1 },
  "2 hậu": { exp: 320, rate: 1 },
  "3 sơ": { exp: 1938, rate: 3 },
  "3 trung": { exp: 5000, rate: 3 },
  "3 hậu": { exp: 8740, rate: 3 },
  "4 sơ": { exp: 9100, rate: 5 },
  "4 trung": { exp: 9690, rate: 5 },
  "4 hậu": { exp: 16150, rate: 5 },
  "5 sơ": { exp: 17670, rate: 5 },
  "5 trung": { exp: 18544, rate: 5 },
  "5 hậu": { exp: 19874, rate: 5 },
  "6 sơ": { exp: 20444, rate: 5 },
  "6 trung": { exp: 21470, rate: 5 },
  "6 hậu": { exp: 22420, rate: 5 },
  "7 sơ": { exp: 23674, rate: 5 },
  "7 trung": { exp: 24852, rate: 5 },
  "7 hậu": { exp: 26106, rate: 5 },
  "8 sơ": { exp: 27398, rate: 10 },
};

// =============================
// BIẾN TOÀN CỤC
// =============================
const levelSelect = document.getElementById("levelSelect");
const suoiLinh = document.getElementById("suoiLinh");
const thanMat = document.getElementById("thanMat");
const chienDau = document.getElementById("chienDau");
const keBangTam = document.getElementById("keBangTam");
const expInfo = document.getElementById("expInfo");
const speedInfo = document.getElementById("speedInfo");
const timeInfo = document.getElementById("timeInfo");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const resetBtn = document.getElementById("resetBtn");

let currentExp = 0;
let intervalId = null;

// =============================
// RENDER DROPDOWN LEVEL
// =============================
if (levelSelect) {
  Object.keys(levelData).forEach((level) => {
    const option = document.createElement("option");
    option.value = level;
    option.textContent = `Level ${level}`;
    levelSelect.appendChild(option);
  });
}

// =============================
// TÍNH TỐC ĐỘ EXP
// =============================
function calcSpeed(baseRate) {
  let speed = baseRate;

  if (suoiLinh && suoiLinh.checked) speed *= 1.1;
  if (thanMat) speed *= 1 + Number(thanMat.value) * 0.05;

  const chienVal = Number(chienDau?.value || 0);
  if (chienVal >= 1501) speed *= 1.15;
  else if (chienVal >= 1001) speed *= 1.07;
  else if (chienVal >= 501) speed *= 1.05;
  else if (chienVal >= 200) speed *= 1.03;

  speed += Number(keBangTam?.value || 0);
  return speed;
}

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Cập nhật stats & progress bar
function updateStats() {
  const selected = levelSelect.value;
  if (!selected) return;

  const { exp, rate } = levelData[selected];
  const speed = calcSpeed(rate);

  expInfo.textContent = `Dung lượng tinh thể: ${exp} EXP`;
  speedInfo.textContent = `Tốc độ hiện tại: ${speed.toFixed(2)} EXP/s`;

  const remainingExp = exp - currentExp;
  const seconds = remainingExp / speed;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  timeInfo.textContent = `Dự kiến đầy sau: ${h} giờ ${m} phút ${s} giây`;

  // Cập nhật progress bar
  const progress = Math.min((currentExp / exp) * 100, 100);
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${progress.toFixed(1)}%`;
}

// =============================
// CẬP NHẬT EXP THEO THỜI GIAN
// =============================
function tick() {
  const selected = levelSelect.value;
  if (!selected) return;

  const { exp, rate } = levelData[selected];
  const speed = calcSpeed(rate);

  currentExp += speed;

  if (currentExp >= exp) {
    currentExp = exp;
    clearInterval(intervalId);
    alert("🎉 Tinh thể tu vi đã đầy!");
  }

  updateStats();
}

// =============================
// RESET TIẾN TRÌNH
// =============================
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    currentExp = 0;
    clearInterval(intervalId);
    intervalId = setInterval(tick, 1000);
    updateStats();
  });
}

// =============================
// SỰ KIỆN REALTIME
// =============================
[levelSelect, suoiLinh, thanMat, chienDau, keBangTam].forEach((el) => {
  if (el) el.addEventListener("change", updateStats);
});

// =============================
// BẮT ĐẦU TỰ ĐỘNG
// =============================
if (levelSelect) {
  intervalId = setInterval(tick, 1000);
  updateStats();
}
