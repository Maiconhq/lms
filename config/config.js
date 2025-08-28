/* ====== CONFIG (chỉnh theo sheet của đồng chí) ====== */
window.APP_CONFIG = {
  // Sheet Users đã Publish to web (chọn CSV)
  USERS_SHEET_CSV: "https://docs.google.com/spreadsheets/d/XXX/export?format=csv&gid=YYY",
  // Sheet Courses (CSV)
  COURSES_SHEET_CSV: "https://docs.google.com/spreadsheets/d/XXX/export?format=csv&gid=ZZZ",
  // Sheet Files (CSV) – lưu metadata file + link xem/tải từ Drive
  FILES_SHEET_CSV: "https://docs.google.com/spreadsheets/d/XXX/export?format=csv&gid=WWW",

  // Link mở thư mục Drive (để admin bấm vào)
  DRIVE_FOLDER_URL: "https://drive.google.com/drive/folders/XXXXXXXXXXXXXX",

  // MASTER KEY (cửa hậu khẩn cấp cho admin@lms.local)
  MASTER_KEY: "admin123", // đổi sau khi deploy

  // Mật khẩu reset mặc định
  DEFAULT_RESET_PASSWORD: "reset123"
};
