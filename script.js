(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const beforeInput = $("#beforeInput");
  const afterInput  = $("#afterInput");
  const beforeOut   = $("#beforeResult");
  const afterOut    = $("#afterResult");
  const toggleBtn   = $("#themeToggle");
  const clearBefore = $("#clearBefore");
  const clearAfter  = $("#clearAfter");
  const root = document.documentElement;

  // ===== Hàm định dạng số =====
  function format(num) {
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  }

  // ====== Tính toán ======
  function calcBefore() {
    const val = parseFloat(beforeInput.value.replace(',', '.')) || 0;
    const res = (val * 105) / 95;
    beforeOut.textContent = format(res);
  }

  function calcAfter() {
    const val = parseFloat(afterInput.value.replace(',', '.')) || 0;
    const res = (val * 110) / 95;
    afterOut.textContent = format(res);
  }

  // ====== Chỉ gắn sự kiện khi phần tử tồn tại ======
  if (beforeInput && beforeOut) {
    beforeInput.addEventListener("input", calcBefore);

    // Hỗ trợ dán số có dấu phẩy
    beforeInput.addEventListener("paste", (e) => {
      const text = (e.clipboardData || window.clipboardData).getData("text");
      if (text && /,/.test(text)) {
        setTimeout(() => {
          beforeInput.value = text.replace(',', '.');
          beforeInput.dispatchEvent(new Event("input", { bubbles: true }));
        }, 0);
      }
    });
  }

  if (afterInput && afterOut) {
    afterInput.addEventListener("input", calcAfter);

    afterInput.addEventListener("paste", (e) => {
      const text = (e.clipboardData || window.clipboardData).getData("text");
      if (text && /,/.test(text)) {
        setTimeout(() => {
          afterInput.value = text.replace(',', '.');
          afterInput.dispatchEvent(new Event("input", { bubbles: true }));
        }, 0);
      }
    });
  }

  // ====== Nút xoá nhanh ======
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

  // ====== Dark / Light Theme Toggle ======
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (toggleBtn) toggleBtn.textContent = theme === "dark" ? "☀️" : "🌙";

    // Force repaint trên iOS Safari
    document.body.style.visibility = "hidden";
    document.body.offsetHeight;
    document.body.style.visibility = "visible";
  }

  // Áp dụng theme khi load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }

  // Chỉ gắn sự kiện khi nút toggle tồn tại
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      setTheme(next);
    });
  }

  // Tính toán lại kết quả khi load (chỉ trên index)
  window.addEventListener("DOMContentLoaded", () => {
    if (beforeInput && beforeOut) calcBefore();
    if (afterInput && afterOut) calcAfter();
  });
})();

// ====== DỮ LIỆU CÂU HỎI ======
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
  // ... tiếp tục bổ sung theo bảng bạn gửi
];

// ====== RENDER BẢNG CÂU HỎI ======
const choicesBody = document.getElementById("choicesBody");

if (choicesBody) {
  choicesData.forEach((q) => {
    const row = document.createElement("tr");

    // Lựa chọn 1
    const td1 = document.createElement("td");
    td1.innerHTML = `
      <div class="choice ${q.option1.danger ? "danger" : ""}">
        <span>${q.option1.text}</span>
        <span class="reward">(${q.option1.reward})</span>
      </div>
    `;

    // Lựa chọn 2
    const td2 = document.createElement("td");
    td2.innerHTML = `
      <div class="choice ${q.option2.danger ? "danger" : ""}">
        <span>${q.option2.text}</span>
        <span class="reward">(${q.option2.reward})</span>
      </div>
    `;

    row.appendChild(td1);
    row.appendChild(td2);
    choicesBody.appendChild(row);
  });
}

// === HỖ TRỢ NHẬP PHÉP TÍNH CHO TẤT CẢ INPUT SỐ ===

// Hàm tính biểu thức an toàn hơn eval
function safeEval(expression) {
    try {
        // Chỉ cho phép các ký tự số, + - * / ( ) và .
        if (!/^[0-9+\-*/().\s]+$/.test(expression)) return NaN;

        // Tính toán bằng hàm Function thay vì eval để an toàn hơn
        return new Function(`return (${expression})`)();
    } catch {
        return NaN;
    }
}

// Chọn tất cả các input trong form tính lực chiến
const numericInputs = document.querySelectorAll('input[type="text"], input[type="number"]');

// Áp dụng cho tất cả input
numericInputs.forEach(input => {
    input.addEventListener("input", () => {
        const rawValue = input.value.trim();

        // Nếu trống thì bỏ qua
        if (rawValue === "") {
            input.dataset.value = "";
            updateAllCalculations();
            return;
        }

        // Tính biểu thức
        const result = safeEval(rawValue);

        // Nếu kết quả hợp lệ → lưu giá trị tính được
        if (!isNaN(result)) {
            input.dataset.value = result; // Lưu số thật vào dataset
            input.style.color = ""; // reset màu chữ nếu nhập đúng
        } else {
            input.dataset.value = ""; // Không tính nếu sai
            input.style.color = "red"; // highlight lỗi
        }

        // Cập nhật lại kết quả tổng
        updateAllCalculations();
    });
});

// Hàm tính lại toàn bộ kết quả
function updateAllCalculations() {
    numericInputs.forEach(input => {
        // Nếu có dataset.value thì dùng nó, ngược lại fallback về giá trị nhập
        if (input.dataset.value !== undefined && input.dataset.value !== "") {
            input.value = input.value; // Giữ nguyên biểu thức người dùng nhập
        }
    });

    // Gọi lại hàm update kết quả sẵn có của bạn
    if (typeof updateResult === "function") {
        updateResult();
    }
}
