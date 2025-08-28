/* ========= script.js =========
   Các hàm khởi tạo chung cho LMS
   Áp dụng cho tất cả dashboard (Admin, Instructor, Student)
================================= */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* ========== DARK / LIGHT MODE ========== */
  const themeSwitch = document.getElementById("themeSwitch");

  // Load trạng thái từ localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
    if (themeSwitch) themeSwitch.checked = true;
  } else {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
    if (themeSwitch) themeSwitch.checked = false;
  }

  // Toggle khi người dùng click
  if (themeSwitch) {
    themeSwitch.addEventListener("change", (e) => {
      if (e.target.checked) {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
        localStorage.setItem("theme", "dark");
      } else {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    });
  }

  /* ========== SIDEBAR TOGGLE ========== */
  const toggleSidebar = document.getElementById("toggleSidebar");
  const openSidebar = document.getElementById("openSidebar");

  toggleSidebar?.addEventListener("click", () => {
    body.classList.toggle("sidebar-compact");
  });

  openSidebar?.addEventListener("click", () => {
    body.classList.toggle("sidebar-open");
  });

  /* ========== USER MENU (avatar góc phải) ========== */
  document.querySelectorAll(".userbox").forEach((box) => {
    box.addEventListener("click", (e) => {
      e.stopPropagation(); // ngăn sự kiện lan ra ngoài
      // Đóng tất cả userbox khác trước khi mở cái mới
      document.querySelectorAll(".userbox.open").forEach((b) =>
        b.classList.remove("open")
      );
      box.classList.toggle("open");
    });
  });

  // Click ngoài thì đóng
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".userbox")) {
      document
        .querySelectorAll(".userbox.open")
        .forEach((b) => b.classList.remove("open"));
    }
  });

  /* ========== FOOTER YEAR ========== */
  const yearEl = document.getElementById("yearNow");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ========== ANIMATION KHỞI ĐỘNG ========== */
  // Cho các section hiện ra mượt hơn khi cuộn
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".fade-in, .slide-up, .zoom-in, .pop-in")
    .forEach((el) => observer.observe(el));
});
