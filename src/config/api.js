// آدرس بک‌اند: در حالت لوکال به پورت 5000 وصل می‌شود و در صورت دیپلوی از متغیر VITE_API_URL استفاده می‌کند
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";
