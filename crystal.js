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
  "7 sơ": { exp: 23674, rate: 5 }
};

// Gán option vào select
const levelSelect = document.getElementById("levelSelect");
Object.keys(levelData).forEach(level => {
  const opt = document.createElement("option");
  opt.value = level;
  opt.textContent = `Level ${level}`;
  levelSelect.appendChild(opt);
});

// Các phần tử
const suoiLinh = document.getElementById("suoiLinh");
const thanMat = document.getElementById("thanMat");
const chienDau = document.getElementById("chienDau");
const keBangTam = document.getElementById("keBangTam");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const expInfo = document.getElementById("expInfo");
const speedInfo = document.getElementById("speedInfo");
const timeInfo = document.getElementById("timeInfo");
const resetBtn = document.getElementById("resetBtn");

let currentExp = 0;
let intervalId = null;

// Tính tốc độ tu luyện
function calcSpeed(baseRate) {
  let speed = baseRate;
  if (suoiLinh.checked) speed *= 1.1;
  speed *= 1 + Number(thanMat.value) * 0.05;
  const chienVal = Number(chienDau.value);
  if (chienVal >= 1501) speed *= 1.15;
  else if (chienVal >= 1001) speed *= 1.07;
  else if (chienVal >= 501) speed *= 1.05;
  else if (chienVal >= 200) speed *= 1.03;
  speed += Number(keBangTam.value);
  return speed;
}

// Update thông tin và progress
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

  const progress = Math.min((currentExp / exp) * 100, 100);
  progressBar.value = progress;
  progressText.textContent = `${progress.toFixed(1)}%`;
}

// Tick EXP mỗi giây
function tick() {
  const selected = levelSelect.value;
  if (!selected) return;
  const { exp, rate } = levelData[selected];
  const speed = calcSpeed(rate);

  currentExp += speed;
  if (currentExp >= exp) {
    clearInterval(intervalId);
    currentExp = exp;
    alert("🎉 Tinh thể tu vi đã đầy!");
  }
  updateStats();
}

// Reset
resetBtn.addEventListener("click", () => {
  currentExp = 0;
  clearInterval(intervalId);
  intervalId = setInterval(tick, 1000);
  updateStats();
});

// Cập nhật khi thay đổi lựa chọn
[levelSelect, suoiLinh, thanMat, chienDau, keBangTam].forEach(el => {
  el.addEventListener("change", () => {
    updateStats();
  });
});

// Bắt đầu đếm
intervalId = setInterval(tick, 1000);
updateStats();
