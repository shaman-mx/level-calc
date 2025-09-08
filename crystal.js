"use strict";

// ===== DỮ LIỆU =====
const levels = {
  "1 sơ": { exp: 6, rate: 1 }, "1 trung": { exp: 8, rate: 1 }, "1 hậu": { exp: 18, rate: 1 },
  "2 sơ": { exp: 38, rate: 1 }, "2 trung": { exp: 160, rate: 1 }, "2 hậu": { exp: 320, rate: 1 },
  "3 sơ": { exp: 1938, rate: 3 }, "3 trung": { exp: 5000, rate: 3 }, "3 hậu": { exp: 8740, rate: 3 },
  "4 sơ": { exp: 9100, rate: 5 }, "4 trung": { exp: 9690, rate: 5 }, "4 hậu": { exp: 16150, rate: 5 },
  "5 sơ": { exp: 17670, rate: 5 }, "5 trung": { exp: 18544, rate: 5 }, "5 hậu": { exp: 19874, rate: 5 },
  "6 sơ": { exp: 20444, rate: 5 }, "6 trung": { exp: 21470, rate: 5 }, "6 hậu": { exp: 22420, rate: 5 },
  "7 sơ": { exp: 23674, rate: 5 }
};

// DOM elements
const levelEl = document.getElementById("level");
const suoiLinhEl = document.getElementById("suoiLinh");
const thanMatEl = document.getElementById("thanMat");
const chienDauEl = document.getElementById("chienDau");
const keBangTamEl = document.getElementById("keBangTam");
const infoBox = document.getElementById("infoBox");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const resetBtn = document.getElementById("resetBtn");

// Tạo option cho select Level
Object.keys(levels).forEach(lv => {
  const opt = document.createElement("option");
  opt.value = lv;
  opt.textContent = `Level ${lv}`;
  levelEl.appendChild(opt);
});

// Biến lưu trạng thái
let currentExp = 0;
let totalExp = levels[levelEl.value]?.exp || 0;
let baseRate = levels[levelEl.value]?.rate || 1;
let interval = null;

// ===== TÍNH TỐC ĐỘ =====
function calcRate() {
  const suoi = suoiLinhEl.checked ? 0.1 : 0;
  const than = parseInt(thanMatEl.value) * 0.05;
  const chienVal = parseInt(chienDauEl.value);
  const chien = chienVal >= 1501 ? 0.15 : chienVal >= 1001 ? 0.07 : chienVal >= 501 ? 0.05 : chienVal >= 200 ? 0.03 : 0;
  const ke = parseInt(keBangTamEl.value);
  return baseRate * (1 + suoi + than + chien) + (ke >= 1 ? (ke === 1 ? 1 : ke === 3 ? 2 : 3) : 0);
}

// ===== CẬP NHẬT GIAO DIỆN =====
function updateUI() {
  totalExp = levels[levelEl.value].exp;
  baseRate = levels[levelEl.value].rate;
  const speed = calcRate();
  const timeLeft = (totalExp - currentExp) / speed;
  const percent = Math.min((currentExp / totalExp) * 100, 100);

  infoBox.innerHTML = `
    <strong>Dung lượng tinh thể:</strong> ${totalExp} EXP<br>
    <strong>Tốc độ hiện tại:</strong> ${speed.toFixed(2)} EXP/s<br>
    <strong>Dự kiến đầy sau:</strong> ${formatTime(timeLeft)}
  `;
  progressBar.value = percent;
  progressText.textContent = `${percent.toFixed(1)}%`;
}

// ===== CHẠY ĐẾM NGƯỢC =====
function startProgress() {
  clearInterval(interval);
  interval = setInterval(() => {
    currentExp += calcRate();
    if (currentExp >= totalExp) {
      currentExp = totalExp;
      clearInterval(interval);
      alert("🎉 Tinh thể đã đầy!");
    }
    updateUI();
  }, 1000);
}

// ===== ĐỊNH DẠNG THỜI GIAN =====
function formatTime(sec) {
  if (sec <= 0) return "Đã đầy";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return `${h} giờ ${m} phút ${s} giây`;
}

// ===== RESET =====
resetBtn.addEventListener("click", () => {
  currentExp = 0;
  startProgress();
});

// Sự kiện
[levelEl, suoiLinhEl, thanMatEl, chienDauEl, keBangTamEl].forEach(el => {
  el.addEventListener("change", updateUI);
  el.addEventListener("input", updateUI);
});

// ===== ĐỒNG BỘ THEME =====
const root = document.documentElement;
const toggleBtn = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) root.setAttribute("data-theme", savedTheme);
toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";
toggleBtn.addEventListener("click", () => {
  const newTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  toggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
});

// Khởi tạo
levelEl.selectedIndex = 0;
updateUI();
startProgress();
