// config.js — 1:1 port of config.py
export const BOT_TOKEN = "8977778359:AAGOn-LfnMxEGOJ8sCgNlwzIFHh_LOqjkOY";
export const ADMIN_IDS = [7610279126, 8167080297]; // অ্যাডমিনদের টেলিগ্রাম ইউজার আইড়ি (@fjgjhijhb যুক্ত করা হয়েছে)

export const BOT_USERNAME = "studymart0_bot";
export const BOT_NAME = "StudyMart";
export const SUPPORT_USERNAME = "StudyMartAdmin"; // আপনার টেলিগ্রাম ইউজারনেম বা সাপোর্ট ইউজারনেম

// পেমেন্ট মাধ্যম ও নাম্বারসমূহ
export const PAYMENT_METHODS = [
  { name: "bKash", number: "01XXXXXXXXX", instruction: "Personal (Send Money)" },
  { name: "Nagad", number: "01XXXXXXXXX", instruction: "Personal (Send Money)" },
  { name: "Rocket", number: "01XXXXXXXXX", instruction: "Personal (Send Money)" },
];

// UI layout: 1 line-e koyta category/sub-category button thakbe (1-4)
// Admin panel (Bot Settings) thekeo pore change kora jabe.
export const CATEGORY_BUTTONS_PER_ROW = 2;
export const SUBCATEGORY_BUTTONS_PER_ROW = 2;

// ডাটাবেস ফাইলসমূহ
export const COURSES_DB = "courses.json";
export const USERS_DB = "users.json";
export const ORDERS_DB = "orders.json";
export const COUPONS_DB = "coupons.json";
export const CART_DB = "cart.json";
export const CATEGORIES_DB = "categories.json";
export const EBOOK_CATEGORIES_DB = "ebook_categories.json";
export const EBOOKS_DB = "ebooks.json";
export const WITHDRAWALS_DB = "withdrawals.json";
export const PAYMENTS_DB = "payments.json";
export const ADMINS_DB = "admins.json";
export const ADMIN_PERMISSIONS_DB = "admin_permissions.json";
export const KEYBOARDS_DB = "keyboards.json";

// উইথড্র সেটিংস
export const MIN_WITHDRAW_AMOUNT = 50; // সর্বনিম্ন উত্তোলনযোগ্য টাকার পরিমাণ
export const SETTINGS_DB = "settings.json";
