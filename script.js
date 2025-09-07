// app.js — logic tách riêng, không phụ thuộc thư viện
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  const beforeInput = $("#beforeInput");
  const afterInput  = $("#afterInput");
  const beforeOut   = $("#beforeResult");
  const afterOut    = $("#afterResult");

  function format(num){
    // Giữ 2 chữ số sau dấu phẩy, hiển thị gọn gàng
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
  }

  function calcBefore(){
    const val = parseFloat(beforeInput.value.replace(',', '.')) || 0;
    const res = (val * 105) / 95;
    beforeOut.textContent = format(res);
  }

  function calcAfter(){
    const val = parseFloat(afterInput.value.replace(',', '.')) || 0;
    const res = (val * 110) / 95;
    afterOut.textContent = format(res);
  }

  // Lắng nghe nhập liệu và khởi tạo
  beforeInput.addEventListener("input", calcBefore);
  afterInput.addEventListener("input", calcAfter);

  // Cho phép paste số có dấu phẩy (vi-VN)
  [beforeInput, afterInput].forEach((el) => {
    el.addEventListener("paste", (e) => {
      const text = (e.clipboardData || window.clipboardData).getData("text");
      if (text && /,/.test(text)) {
        // Đổi , -> . để parseFloat đọc được
        setTimeout(() => {
          el.value = text.replace(',', '.');
          el.dispatchEvent(new Event("input", { bubbles: true }));
        }, 0);
      }
    });
  });

  // Tính lại khi tải trang (nếu trình duyệt tự khôi phục giá trị input)
  window.addEventListener("DOMContentLoaded", () => {
    calcBefore();
    calcAfter();
  });
})();
