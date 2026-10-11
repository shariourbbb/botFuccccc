// admin_panels.js — auto-transpiled from bot.py by py2js. Ported 1:1 from the Python source.
// admin_panels.js — auto-transpiled from bot.py by py2js. Ported 1:1 from the Python source.
import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from "./compat.js";
import { ADMIN_IDS, SUPPORT_USERNAME } from "./config.js";
import { ADMIN_PERMISSION_DEFINITIONS, db } from "./db.js";
import { BUTTON_COLOR_DEFAULTS, BUTTON_COLOR_GROUPS, BUTTON_STYLE_DOT, BUTTON_STYLE_NAME, InlineKeyboardButton, _kb_button_style, _msg_has_media, format_order_id_display, get_home_keyboard_grid, is_admin, parse_inline_buttons } from "./core.js";
import { browse_ebooks, get_default_info_content } from "./screens.js";
import { __isPlainObj, __kw, pyAppend, pyContains, pyDiv, pyEnumerate, pyEq, pyGet, pyHasAttr, pyHtmlEscape, pyInt, pyIsInstance, pyItems, pyIter, pyJoin, pyKeys, pyLen, pyList, pyLower, pyMax, pyMin, pyPop, pyRStrip, pyRange, pyReCompile, pyRepeat, pyReplace, pySetNew, pySlice, pySplit, pyStart, pyStr, pyStrip, pySub, pySum, pyT, pyUpper, pyValues } from "./helpers.js";

export async function sync_admin_order_messages(context, order_id, status) {
  let _cdate, _wline, aid_s, base, kb, mid, msg_ids, order;
  let tail;
  try {
      order = db.get_order(order_id);
  } catch (__e) {
      return;
  }
  if (pyT((!pyT(order)))) {
      return;
  }
  msg_ids = (pyT(pyGet(order, "admin_msg_ids")) || pyT({  }));
  if (pyT((pyT((!pyT(pyIsInstance(msg_ids, "dict")))) || pyT((!pyT(msg_ids)))))) {
      return;
  }
  if (pyT((pyEq(status, "approved")))) {
      tail = "\n\n✅ **Status: Approved**";
      kb = [[InlineKeyboardButton("✅ Approved", { callback_data: "adm_ignore" })]];
  } else {
      tail = "\n\n❌ **Status: Rejected**";
      kb = [[InlineKeyboardButton("❌ Rejected", { callback_data: "adm_ignore" })]];
  }
  _wline = (pyT(pyGet(order, "wallet_used")) ? (`
💳 **Wallet Used:** \`-৳${pyStr(pyGet(order, "wallet_used", 0))}\``) : (""));
  _cdate = pySlice(pyStr(pyGet(order, "date", "N/A")), null, 19, null);
  base = `🔔 **Order Update**
━━━━━━━━━━━━━━━━━━━━

📦 **Order ID:** \`${pyStr(format_order_id_display(order_id))}\`
👤 **Student:** ${pyStr(pyGet(order, "full_name", "N/A"))} (@${pyStr(pyGet(order, "username", "N/A"))})
🆔 **User ID:** \`${pyStr(pyGet(order, "user_id", "N/A"))}\`
📖 **Course:** ${pyStr(pyGet(order, "course_name", "N/A"))}
💰 **Amount:** ${pyStr(pyGet(order, "amount", 0))} ৳${pyStr(_wline)}
💳 **Method:** ${pyStr(pyGet(order, "payment_method", "N/A"))}
🔑 **TrxID:** \`${pyStr(pyGet(order, "trxid", "N/A"))}\`
🏷️ **Coupon:** \`${pyStr((pyT(pyGet(order, "coupon_code")) || pyT("None")))}\`
📅 **Time:** ${pyStr(_cdate)}`;
  for (const [aid_s, mid] of pyIter(pyItems(msg_ids))) {
      try {
            void ((await context.bot.edit_message_text((base + tail), { chat_id: pyInt(aid_s), message_id: pyInt(mid), parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(kb) })));
      } catch (__e) {
      }
  }
}

export function build_admin_withdrawal_text(wid, w, header) {
  { const _k = __kw(header, ["header"]); if (_k) header = _k.header; }
  if ((header === undefined) || __isPlainObj(header)) header = ("🔔 **New Withdrawal Request!**");
  return (`${pyStr(header)}
━━━━━━━━━━━━━━━━━━━━

🆔 **Withdraw ID:** \`${pyStr(wid)}\`
👤 **User:** ${pyStr(pyGet(w, "full_name", "N/A"))} (@${pyStr(pyGet(w, "username", "N/A"))})
🆔 **User ID:** \`${pyStr(pyGet(w, "user_id", "N/A"))}\`
💰 **Amount:** ${pyStr(pyGet(w, "amount", 0))} ৳
💳 **Method:** ${pyStr(pyGet(w, "method", "N/A"))}
📱 **Account:** \`${pyStr(pyGet(w, "account", "N/A"))}\`
📅 **Time:** ${pyStr(pySlice(pyStr(pyGet(w, "date", "N/A")), null, 19, null))}`);
}

export function build_withdrawal_detail_text(wid, w) {
  let cur_bal, past, past_ok, past_ok_total, ref_c, same_acc, same_acc_txt, u;
  let uid, x;
  uid = pyGet(w, "user_id");
  u = (pyT(uid) ? (db.get_user(uid)) : (null));
  cur_bal = pyGet((pyT(u) || pyT({  })), "balance", 0);
  ref_c = pyGet((pyT(u) || pyT({  })), "referral_count", 0);
  past = ((() => { const __acc = []; for (const x of pyIter((pyT(pyHasAttr(db, "withdrawals")) ? (pyList(pyValues(db.withdrawals))) : ([])))) { if (!pyT((pyT((pyEq(pyStr(pyGet(x, "user_id")), pyStr(uid)))) && pyT(((!pyEq(pyGet(x, "withdraw_id"), wid))))))) continue; __acc.push(x); } return __acc; })());
  past_ok = ((() => { const __acc = []; for (const x of pyIter(past)) { if (!pyT((pyEq(pyGet(x, "status"), "approved")))) continue; __acc.push(x); } return __acc; })());
  past_ok_total = pySum(((() => { const __acc = []; for (const x of pyIter(past_ok)) { __acc.push(pyInt((pyT(pyGet(x, "amount", 0)) || pyT(0)))); } return __acc; })()));
  same_acc = pySum(((() => { const __acc = []; for (const x of pyIter(past)) { if (!pyT((pyT((pyEq(pyStr(pyGet(x, "account", "")), pyStr(pyGet(w, "account", ""))))) && pyT(((!pyEq(pyStr(pyGet(x, "account", "")), ""))))))) continue; __acc.push(1); } return __acc; })()));
  same_acc_txt = (pyT(same_acc) ? (`♻️ এই account-এ আগেও ${pyStr(same_acc)} বার`) : ("🆕 এই account প্রথমবার"));
  return (`💸 **Withdrawal Request Details**
━━━━━━━━━━━━━━━━━━━━

🆔 **Withdraw ID:** \`${pyStr(wid)}\`
👤 **User:** ${pyStr(pyGet(w, "full_name", "N/A"))} (@${pyStr(pyGet(w, "username", "N/A"))})
🆔 **User ID:** \`${pyStr(pyGet(w, "user_id"))}\`
💰 **Amount:** \`${pyStr(pySub(w, "amount"))}\` ৳
💳 **Method:** ${pyStr(pyGet(w, "method"))}
📱 **Account:** \`${pyStr(pyGet(w, "account"))}\`
📅 **Date:** ${pyStr(pySlice(pyStr(pyGet(w, "date", "N/A")), null, 19, null))}
📌 **Status:** ${pyStr(pyUpper(pyStr(pyGet(w, "status", ""))))}
━━━━━━━━━━━━━━━━━━━━
🔍 **Verify Info:**
💰 **Current Balance:** \`${pyStr(cur_bal)}\` ৳
👥 **Referrals:** \`${pyStr(ref_c)}\`
📜 **Past Withdrawals:** \`${pyStr(pyLen(past_ok))} approved (৳${pyStr(past_ok_total)})\`
${pyStr(same_acc_txt)}`);
}

export async function sync_admin_withdrawal_messages(context, withdraw_id, status) {
  let aid_s, base, kb, mid, msg_ids, tail, w;
  try {
      w = db.get_withdrawal(withdraw_id);
  } catch (__e) {
      return;
  }
  if (pyT((!pyT(w)))) {
      return;
  }
  msg_ids = (pyT(pyGet(w, "admin_msg_ids")) || pyT({  }));
  if (pyT((pyT((!pyT(pyIsInstance(msg_ids, "dict")))) || pyT((!pyT(msg_ids)))))) {
      return;
  }
  if (pyT((pyEq(status, "approved")))) {
      tail = "\n\n✅ **Status: Approved**";
      kb = [[InlineKeyboardButton("✅ Approved", { callback_data: "adm_ignore" })]];
  } else {
      tail = "\n\n❌ **Status: Rejected**";
      kb = [[InlineKeyboardButton("❌ Rejected", { callback_data: "adm_ignore" })]];
  }
  base = build_admin_withdrawal_text(withdraw_id, w, { header: "🔔 **Withdrawal Update**" });
  for (const [aid_s, mid] of pyIter(pyItems(msg_ids))) {
      try {
            void ((await context.bot.edit_message_text((base + tail), { chat_id: pyInt(aid_s), message_id: pyInt(mid), parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(kb) })));
      } catch (__e) {
      }
  }
}

export function get_admin_dashboard_keyboard(user_id) {
  let keyboard, r1, r2, r3, r4, r5;
  keyboard = [];
  r1 = [];
  if (pyT(db.has_permission(user_id, "course_manage"))) {
      pyAppend(r1, InlineKeyboardButton("📚 Courses", { callback_data: "adm_courses" }));
  }
  if (pyT(db.has_permission(user_id, "ebook_manage"))) {
      pyAppend(r1, InlineKeyboardButton("📖 E-Books", { callback_data: "adm_ebooks" }));
  }
  if (pyT(db.has_permission(user_id, "category_manage"))) {
      pyAppend(r1, InlineKeyboardButton("📁 Categories", { callback_data: "adm_categories" }));
  }
  if (pyT(r1)) {
      pyAppend(keyboard, r1);
  }
  r2 = [];
  if (pyT(db.has_permission(user_id, "orders"))) {
      pyAppend(r2, InlineKeyboardButton("⏳ Pending Orders", { callback_data: "adm_pending_orders" }));
  }
  if (pyT(db.has_permission(user_id, "coupon"))) {
      pyAppend(r2, InlineKeyboardButton("🎟️ Coupons & Promo", { callback_data: "adm_coupons" }));
  }
  if (pyT(r2)) {
      pyAppend(keyboard, r2);
  }
  r3 = [];
  if (pyT(db.has_permission(user_id, "payment_settings"))) {
      pyAppend(r3, InlineKeyboardButton("💸 Withdrawals", { callback_data: "adm_withdrawals" }));
      pyAppend(r3, InlineKeyboardButton("⚙️ Payment Gateway", { callback_data: "adm_payments" }));
  }
  if (pyT(r3)) {
      pyAppend(keyboard, r3);
  }
  r4 = [];
  if (pyT((pyT(db.has_permission(user_id, "user_manage")) || pyT(db.has_permission(user_id, "admin_manage")) || pyT(db.has_permission(user_id, "admin_permission"))))) {
      pyAppend(r4, InlineKeyboardButton("👥 User Management", { callback_data: "adm_users" }));
  }
  if (pyT(db.has_permission(user_id, "broadcast"))) {
      pyAppend(r4, InlineKeyboardButton("📢 Broadcast Notice", { callback_data: "adm_broadcast" }));
  }
  if (pyT(r4)) {
      pyAppend(keyboard, r4);
  }
  r5 = [];
  if (pyT(db.has_permission(user_id, "statistics"))) {
      pyAppend(r5, InlineKeyboardButton("📊 Analytics & Stats", { callback_data: "adm_stats" }));
  }
  if (pyT(db.has_permission(user_id, "orders"))) {
      pyAppend(r5, InlineKeyboardButton("📦 All Orders", { callback_data: "adm_all_orders" }));
  }
  if (pyT(r5)) {
      pyAppend(keyboard, r5);
  }
  if (pyT(db.has_permission(user_id, "bot_settings"))) {
      pyAppend(keyboard, [InlineKeyboardButton("⚙️ Bot Settings", { callback_data: "adm_bot_settings" }), InlineKeyboardButton("⚙️ Keyboard Settings", { callback_data: "adm_keyboard_settings" })]);
      pyAppend(keyboard, [InlineKeyboardButton(`🛠️ Maintenance: ${pyStr((pyT((pyEq(db.get_setting("maintenance_mode"), true))) ? ("ON 🟢") : ("OFF 🔴")))}`, { callback_data: "adm_toggle_maintenance" })]);
  }
  return (InlineKeyboardMarkup(keyboard));
}

export async function admin_cmd(update, context) {
  let keyboard, maint_status, msg, stats, user_id;
  user_id = update.effective_user.id;
  if (pyT((!pyT(is_admin(user_id))))) {
      void ((await update.message.reply_text("⛔ Access Denied! You are not an admin.")));
      return;
  }
  stats = db.get_stats();
  maint_status = (pyT((pyEq(db.get_setting("maintenance_mode"), true))) ? ("🟢 ON") : ("🔴 OFF"));
  msg = `<blockquote>📊 <b>Live Analytics</b>
👥 Students: ${pyStr(pySub(stats, "total_users"))}
📚 Courses: ${pyStr(pySub(stats, "total_courses"))} | 📖 E-Books: ${pyStr(pyGet(stats, "total_ebooks", 0))}
📦 Orders: ${pyStr(pySub(stats, "total_orders"))} | ⏳ Pending: <code>${pyStr(pySub(stats, "pending_orders"))}</code>
💸 Withdrawals: <code>${pyStr(pyGet(stats, "pending_withdrawals", 0))}</code>
💵 Revenue: ৳${pyStr(pySub(stats, "total_revenue"))} | Paid: ৳${pyStr(pyGet(stats, "total_withdrawn", 0))}
🛠️ **Maintenance Mode:** ${pyStr(maint_status)}</blockquote>

<blockquote>👇 <b>Select an option:</b></blockquote>`;
  keyboard = get_admin_dashboard_keyboard(user_id);
  if (pyT((!pyT(keyboard.inline_keyboard)))) {
      void ((await update.message.reply_text("⛔ You currently do not have permissions for any admin modules. Please contact the Super Admin.")));
      return;
  }
  void ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: keyboard })));
}

export function get_admin_uview_keyboard(uid, is_user_adm, is_root_owner, is_banned) {
  if (is_banned === undefined) is_banned = (false);
  let keyboard;
  keyboard = [[InlineKeyboardButton("✦ Grant / Revoke Course", { callback_data: `adm_ucourse_${pyStr(uid)}` })], [InlineKeyboardButton("📖 Grant / Revoke E-Book", { callback_data: `adm_uebook_${pyStr(uid)}` })], [InlineKeyboardButton("◈ Toggle Earnings Menu", { callback_data: `adm_utogearn_${pyStr(uid)}` })], [InlineKeyboardButton("💰 Adjust Balance", { callback_data: `adm_ubal_${pyStr(uid)}` })]];
  if (pyT(is_banned)) {
      pyAppend(keyboard, [InlineKeyboardButton("✅ Unban User", { callback_data: `adm_unban_${pyStr(uid)}` })]);
  } else {
      pyAppend(keyboard, [InlineKeyboardButton("⛔ Ban User", { callback_data: `adm_ban_${pyStr(uid)}` })]);
  }
  if (pyT(is_user_adm)) {
      pyAppend(keyboard, [InlineKeyboardButton("🔐 Admin Permissions (পারমিশন পরিবর্তন)", { callback_data: `adm_perm_${pyStr(uid)}` })]);
      if (pyT((!pyT(is_root_owner)))) {
            pyAppend(keyboard, [InlineKeyboardButton("❌ Demote from Admin", { callback_data: `adm_rmadmin_${pyStr(uid)}` })]);
      }
  } else {
      pyAppend(keyboard, [InlineKeyboardButton("👑 Promote to Admin", { callback_data: `adm_makeadmin_${pyStr(uid)}` })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("➥ Send Message (DM)", { callback_data: `adm_udm_${pyStr(uid)}` })]);
  pyAppend(keyboard, [InlineKeyboardButton("« Admin List", { callback_data: "adm_admin_list" }), InlineKeyboardButton("« User List", { callback_data: "adm_userlist_1" })]);
  return (InlineKeyboardMarkup(keyboard));
}

export async function render_admin_user_profile(query, uid) {
  let adm_role_str, ban_st, c_list, c_names, c_obj, cid, cn, courses_str;
  let earn_st, is_banned, is_root_owner, is_user_adm, msg, o, orders, reply_markup;
  let total_spent, u;
  u = db.get_user(uid);
  if (pyT((!pyT(u)))) {
      try {
            void ((await query.answer("User not found!", { show_alert: true })));
      } catch (__e) {
      }
      return;
  }
  c_list = (pyT(pyGet(u, "purchased_courses", [])) || pyT([]));
  c_names = [];
  for (const cid of pyIter(c_list)) {
      c_obj = db.get_course(cid);
      pyAppend(c_names, (pyT(c_obj) ? (pySub(c_obj, "name")) : (cid)));
  }
  courses_str = (pyT(c_names) ? (pyJoin("\n", ((() => { const __acc = []; for (const cn of pyIter(c_names)) { __acc.push(`  • ${pyStr(cn)}`); } return __acc; })()))) : ("  (None)"));
  orders = db.get_user_orders(uid);
  total_spent = pySum(((() => { const __acc = []; for (const o of pyIter(orders)) { if (!pyT((pyEq(pyGet(o, "status"), "approved")))) continue; __acc.push(pyGet(o, "amount", 0)); } return __acc; })()));
  earn_st = (pyT(pyGet(u, "earnings_enabled")) ? ("Enabled ✅") : ("Disabled ❌"));
  is_user_adm = db.is_admin(uid);
  is_root_owner = (pyT(((pyLen(ADMIN_IDS) > 0))) && pyT((pyEq(uid, pySub(ADMIN_IDS, 0)))));
  adm_role_str = (pyT(is_root_owner) ? ("👑 Super Admin") : ((pyT(is_user_adm) ? ("🛡️ Admin") : ("👤 Student"))));
  is_banned = pyT(pyGet(u, "banned", false));
  ban_st = (pyT(is_banned) ? ("⛔ Banned 🚫") : ("✅ Active"));
  msg = `<blockquote>👤 <b>User Profile Details</b></blockquote>

<blockquote>🆔 <b>User ID:</b> <code>${pyStr(pySub(u, "user_id"))}</code>
👤 <b>Name:</b> ${pyStr(pyHtmlEscape(pyGet(u, "full_name", "N/A")))}
🔹 <b>Username:</b> @${pyStr(pyHtmlEscape((pyT(pyGet(u, "username")) || pyT("N/A"))))}
👑 <b>Role:</b> <b>${pyStr(adm_role_str)}</b>
🚫 <b>Status:</b> <b>${pyStr(ban_st)}</b>
📅 <b>Join Date:</b> ${pyStr(pySlice(pyGet(u, "joined_date", "N/A"), null, 19, null))}
💰 <b>Wallet Balance:</b> <code>${pyStr(pyGet(u, "balance", 0))}</code> ৳
📊 <b>Earnings Option:</b> ${pyStr(earn_st)}
💳 <b>Total Spent:</b> ${pyStr(total_spent)} ৳</blockquote>

<blockquote>📚 <b>Enrolled Courses (${pyStr(pyLen(c_list))}):</b>
${pyStr(pyHtmlEscape(courses_str))}</blockquote>`;
  reply_markup = get_admin_uview_keyboard(uid, is_user_adm, is_root_owner, is_banned);
  void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: reply_markup })));
}

export async function render_user_course_access(query, uid, page) {
  if (page === undefined) page = (0);
  let all_courses, c, cid, cname, e, items, keyboard, msg;
  let nav, per_page, total_pages, u, user_c;
  u = db.get_user(uid);
  if (pyT((!pyT(u)))) {
      try {
            void ((await query.answer("❌ User not found!", { show_alert: true })));
      } catch (__e) {
      }
      return;
  }
  all_courses = (pyT(db.get_all_courses()) || pyT({  }));
  user_c = (pyT(pyGet(u, "purchased_courses", [])) || pyT([]));
  per_page = 10;
  items = pyList(pyItems(all_courses));
  total_pages = pyMax(1, pyDiv(((pyLen(items) + per_page) - 1), per_page));
  try {
      page = pyInt(page);
  } catch (__e) {
      page = 0;
  }
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  msg = `🎓 **User \`${pyStr(uid)}\` Course Access Management:**
━━━━━━━━━━━━━━━━━━━━
Click to Grant or Revoke access:
📄 Page ${pyStr((page + 1))}/${pyStr(total_pages)} • Total ${pyStr(pyLen(items))} courses
`;
  keyboard = [];
  for (const [cid, c] of pyIter(pySlice(items, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, per_page) : (page * per_page))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), per_page) : ((page + 1) * per_page))), null))) {
      cname = pySlice(pyStr(pyGet(c, "name", cid)), null, 18, null);
      if (pyT((pyContains(user_c, cid)))) {
            pyAppend(keyboard, [InlineKeyboardButton(`✕ Revoke: ${pyStr(cname)}`, { callback_data: `adm_urevoke_${pyStr(uid)}_${pyStr(cid)}_${pyStr(page)}` })]);
      } else {
            pyAppend(keyboard, [InlineKeyboardButton(`➕ Grant: ${pyStr(cname)}`, { callback_data: `adm_ugrant_${pyStr(uid)}_${pyStr(cid)}_${pyStr(page)}` })]);
      }
  }
  nav = [];
  if (pyT(((page > 0)))) {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `adm_ucourse_${pyStr(uid)}_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_ucourse" }));
  }
  pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_ucourse" }));
  if (pyT(((page < (total_pages - 1))))) {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `adm_ucourse_${pyStr(uid)}_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_ucourse" }));
  }
  pyAppend(keyboard, nav);
  pyAppend(keyboard, [InlineKeyboardButton("« User Profile", { callback_data: `adm_uview_${pyStr(uid)}` })]);
  try {
      void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } catch (e) {
      if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
            throw __e;
      }
  }
}

export async function render_user_ebook_access(query, uid, page) {
  if (page === undefined) page = (0);
  let all_ebooks, e, eb, eid, ename, items, keyboard, msg;
  let nav, per_page, total_pages, u, user_eb;
  u = db.get_user(uid);
  if (pyT((!pyT(u)))) {
      try {
            void ((await query.answer("❌ User not found!", { show_alert: true })));
      } catch (__e) {
      }
      return;
  }
  all_ebooks = (pyT(db.get_all_ebooks()) || pyT({  }));
  user_eb = (pyT(pyGet(u, "purchased_ebooks", [])) || pyT([]));
  per_page = 10;
  items = pyList(pyItems(all_ebooks));
  total_pages = pyMax(1, pyDiv(((pyLen(items) + per_page) - 1), per_page));
  try {
      page = pyInt(page);
  } catch (__e) {
      page = 0;
  }
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  msg = `📖 **User \`${pyStr(uid)}\` E-Book Access Management:**
━━━━━━━━━━━━━━━━━━━━
Click to Grant or Revoke access:
📄 Page ${pyStr((page + 1))}/${pyStr(total_pages)} • Total ${pyStr(pyLen(items))} e-books
`;
  keyboard = [];
  for (const [eid, eb] of pyIter(pySlice(items, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, per_page) : (page * per_page))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), per_page) : ((page + 1) * per_page))), null))) {
      ename = pySlice(pyStr(pyGet(eb, "name", eid)), null, 18, null);
      if (pyT((pyContains(user_eb, eid)))) {
            pyAppend(keyboard, [InlineKeyboardButton(`✕ Revoke: ${pyStr(ename)}`, { callback_data: `adm_uebrevoke_${pyStr(uid)}_${pyStr(eid)}_${pyStr(page)}` })]);
      } else {
            pyAppend(keyboard, [InlineKeyboardButton(`➕ Grant: ${pyStr(ename)}`, { callback_data: `adm_uebgrant_${pyStr(uid)}_${pyStr(eid)}_${pyStr(page)}` })]);
      }
  }
  nav = [];
  if (pyT(((page > 0)))) {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `adm_uebook_${pyStr(uid)}_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_uebook" }));
  }
  pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_uebook" }));
  if (pyT(((page < (total_pages - 1))))) {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `adm_uebook_${pyStr(uid)}_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_uebook" }));
  }
  pyAppend(keyboard, nav);
  pyAppend(keyboard, [InlineKeyboardButton("« User Profile", { callback_data: `adm_uview_${pyStr(uid)}` })]);
  try {
      void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } catch (e) {
      if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
            throw __e;
      }
  }
}

export async function render_admin_permission_dashboard(query, context, target_uid) {
  let bottom_row, btn_text, icon, is_enabled, is_target_root, keyboard, msg, p_info;
  let p_key, perms, role_str, target_name, u;
  u = db.get_user(target_uid);
  target_name = (pyT(pyGet(u, "full_name")) || pyT(pyGet(u, "username")) || pyT(pyStr(target_uid)));
  perms = db.get_admin_permissions(target_uid);
  is_target_root = db.is_super_admin(target_uid);
  role_str = (pyT(is_target_root) ? ("👑 Super Admin (Full Access)") : ("🛡️ Sub-Admin"));
  msg = `<blockquote>🔐 <b>Permission Toggle:</b>
👤 <b>Admin:</b> ${pyStr(pyHtmlEscape(target_name))} (<code>${pyStr(target_uid)}</code>)
👑 <b>Role:</b> ${pyStr(role_str)}</blockquote>

<blockquote>💡 বাটনগুলোতে চাপ দিয়ে পারমিশন চালু (✅) বা বন্ধ (❌) করুন:</blockquote>`;
  keyboard = [];
  for (const [p_key, p_info] of pyIter(pyItems(ADMIN_PERMISSION_DEFINITIONS))) {
      is_enabled = pyGet(perms, p_key, true);
      icon = (pyT(is_enabled) ? ("✅") : ("❌"));
      btn_text = `${pyStr(icon)} ${pyStr(pySub(p_info, "emoji"))} ${pyStr(pySub(p_info, "name"))}`;
      pyAppend(keyboard, [InlineKeyboardButton(btn_text, { callback_data: `adm_togperm_${pyStr(target_uid)}_${pyStr(p_key)}` })]);
  }
  bottom_row = [];
  if (pyT((!pyT(is_target_root)))) {
      pyAppend(bottom_row, InlineKeyboardButton("🗑 Admin Remove", { callback_data: `adm_rmadmin_${pyStr(target_uid)}` }));
  }
  pyAppend(bottom_row, InlineKeyboardButton("◀️ Back", { callback_data: "adm_admin_list" }));
  pyAppend(keyboard, bottom_row);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function render_category_reorder_panel(query, context, parent_path) {
  if (parent_path === undefined) parent_path = ("");
  let back_cb, c, clean_parent, courses, e, f, folders, idx;
  let keyboard, mark, msg, parent_title, per_row, row, sel;
  clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
  folders = db.get_sub_folders(clean_parent, { include_inactive: true });
  courses = (pyT(clean_parent) ? (db.get_courses_by_folder(clean_parent, { include_inactive: true })) : ([]));
  parent_title = (pyT(clean_parent) ? (`Folder '${pyStr(clean_parent)}'`) : ("All Categories"));
  context.user_data["reorder_parent_path"] = clean_parent;
  sel = (pyT(pyGet(context.user_data, "pos_sel")) || pyT({  }));
  per_row = (pyT((!pyT(clean_parent))) ? (db.get_category_row_size()) : (db.get_subcategory_row_size()));
  msg = `🗂️ <b>Position Change Mode</b>

Select a category, then use arrow buttons to move
<i>${pyStr(pyHtmlEscape(parent_title))}</i>`;
  if (pyT((pyEq(pyGet(sel, "kind"), "f")))) {
      msg += `
✅ Selected: 📁 <code>${pyStr(pyHtmlEscape(pyGet(sel, "name", "")))}</code>`;
  } else if (pyT((pyEq(pyGet(sel, "kind"), "c")))) {
      msg += `
✅ Selected: 📖 <code>${pyStr(pyHtmlEscape(pyGet(sel, "name", "")))}</code>`;
  }
  keyboard = [];
  row = [];
  for (const [idx, f] of pyIter(pyEnumerate(folders))) {
      mark = (pyT((pyT((pyEq(pyGet(sel, "kind"), "f"))) && pyT((pyEq(pyGet(sel, "name"), f))))) ? ("✅ ") : (""));
      pyAppend(row, InlineKeyboardButton(`${pyStr(mark)}📁 ${pyStr(f)}`, { callback_data: `adm_fld_psel_f${pyStr(idx)}` }));
      if (pyT((pyEq(pyLen(row), per_row)))) {
            pyAppend(keyboard, row);
            row = [];
      }
  }
  if (pyT(row)) {
      pyAppend(keyboard, row);
  }
  row = [];
  for (const [idx, c] of pyIter(pyEnumerate(courses))) {
      mark = (pyT((pyT((pyEq(pyGet(sel, "kind"), "c"))) && pyT((pyEq(pyGet(sel, "id"), pyGet(c, "id")))))) ? ("✅ ") : (""));
      pyAppend(row, InlineKeyboardButton(`${pyStr(mark)}📖 ${pyStr(pySlice(pySub(c, "name"), null, 18, null))}`, { callback_data: `adm_fld_psel_c${pyStr(idx)}` }));
      if (pyT((pyEq(pyLen(row), per_row)))) {
            pyAppend(keyboard, row);
            row = [];
      }
  }
  if (pyT(row)) {
      pyAppend(keyboard, row);
  }
  if (pyT((pyT((!pyT(folders))) && pyT((!pyT(courses)))))) {
      msg += "\n<i>(এই Window-এ কোনো Item নেই)</i>";
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️", { callback_data: "adm_fld_pos_left" }), InlineKeyboardButton("⬆️", { callback_data: "adm_fld_pos_up" }), InlineKeyboardButton("⬇️", { callback_data: "adm_fld_pos_down" }), InlineKeyboardButton("➡️", { callback_data: "adm_fld_pos_right" })]);
  back_cb = (pyT(clean_parent) ? (`adm_dir_${pyStr(clean_parent)}`) : ("adm_dir_"));
  pyAppend(keyboard, [InlineKeyboardButton("❌ Exit Position Mode", { callback_data: back_cb })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw __e;
            }
      }
  }
}

export async function render_admin_folder_directory(query, context, folder_path) {
  if (folder_path === undefined) folder_path = ("");
  let _cat_cols, _copy_src, _cs_base, _cut_c, _cut_cid, _show_paste, _sub_cols, back_btn;
  let back_title, badge, c, child_courses, child_path, child_sub_count, clean_path, course_list_str;
  let courses, cur_pos_str, current_name, del_btn, e, is_active, is_sf_active, keyboard;
  let msg, parent_path, path_display, per_row, price_tag, rename_btn, row, s;
  let segments, sf, status_display, status_dot, status_toggle_btn, sub_list_str, subfolders, total_items;
  clean_path = pyReplace(pyReplace(pyStrip(pyStr(folder_path)), " / ", " > "), "/", " > ");
  context.user_data["active_dir"] = clean_path;
  subfolders = db.get_sub_folders(clean_path, { include_inactive: true });
  courses = (pyT(clean_path) ? (db.get_courses_by_folder(clean_path, { include_inactive: true })) : ([]));
  segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(clean_path, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
  current_name = (pyT(segments) ? (pySub(segments, (-(1)))) : ("Root"));
  parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
  keyboard = [];
  per_row = (pyT((!pyT(clean_path))) ? (db.get_category_row_size()) : (db.get_subcategory_row_size()));
  row = [];
  for (const sf of pyIter(subfolders)) {
      child_path = (pyT(clean_path) ? (`${pyStr(clean_path)} > ${pyStr(sf)}`) : (sf));
      child_courses = db.get_courses_by_folder(child_path, { include_inactive: true });
      child_sub_count = pyLen(db.get_sub_folders(child_path, { include_inactive: true }));
      total_items = (pyT(((pyLen(child_courses) > 0))) ? (pyLen(child_courses)) : (child_sub_count));
      badge = (pyT(((total_items > 0))) ? (` (${pyStr(total_items)})`) : (""));
      is_sf_active = db.is_category_active(child_path);
      status_dot = (pyT(is_sf_active) ? ("") : ("🔴 [OFF] "));
      pyAppend(row, InlineKeyboardButton(`${pyStr(status_dot)}${pyStr(sf)}${pyStr(badge)}`, { callback_data: `adm_dir_${pyStr(child_path)}` }));
      if (pyT((pyEq(pyLen(row), per_row)))) {
            pyAppend(keyboard, row);
            row = [];
      }
  }
  if (pyT(row)) {
      pyAppend(keyboard, row);
  }
  for (const c of pyIter(pySlice(courses, null, 25, null))) {
      price_tag = (pyT(((pyGet(c, "price", 0) > 0))) ? (` ─ ৳${pyStr(pySub(c, "price"))}`) : (" (Free)"));
      status_dot = (pyT((pyEq(pyGet(c, "status"), "inactive"))) ? ("🔴 ") : (""));
      pyAppend(keyboard, [InlineKeyboardButton((pyT(((pyGet(c, "price", 0) > 0))) ? (`${pyStr(status_dot)}${pyStr(pySub(c, "name"))} — ${pyStr(pySub(c, "price"))}৳`) : (`${pyStr(status_dot)}${pyStr(pySub(c, "name"))} — Free 🎁`)), { callback_data: `adm_edit_${pyStr(pySub(c, "id"))}` })]);
  }
  if (pyT((!pyT(clean_path)))) {
      pyAppend(keyboard, [InlineKeyboardButton("🔀 Change Position (Reorder)", { callback_data: "adm_fld_reorder_" })]);
      pyAppend(keyboard, [InlineKeyboardButton("➕ Add Category", { callback_data: "adm_fld_addfolder" })]);
      pyAppend(keyboard, [InlineKeyboardButton("🖼️ Category Header", { callback_data: "adm_catlib_header" })]);
      _copy_src = (pyT(context) ? (pyStrip((pyT(pyGet(context.user_data, "copy_folder_src")) || pyT("")))) : (""));
      if (pyT(_copy_src)) {
            _cs_base = pyStrip(pySub(pySplit(_copy_src, " > ", -1), (-(1))));
            pyAppend(keyboard, [InlineKeyboardButton(`📌 Paste '${pyStr(pySlice(_cs_base, null, 20, null))}' Here`, { callback_data: "adm_fld_paste_go" })]);
            pyAppend(keyboard, [InlineKeyboardButton("❌ Cancel Cut", { callback_data: "adm_fld_cancel_copy" })]);
      }
      _cut_cid = (pyT(context) ? (pyStrip((pyT(pyGet(context.user_data, "cut_course_id")) || pyT("")))) : (""));
      if (pyT(_cut_cid)) {
            if (pyT(db.get_course(_cut_cid))) {
                    pyAppend(keyboard, [InlineKeyboardButton("❌ Cancel Course Cut", { callback_data: "adm_course_cancel_cut" })]);
            } else {
                    pyPop(context.user_data, "cut_course_id", null);
            }
      }
      _cat_cols = db.get_category_row_size();
      pyAppend(keyboard, [InlineKeyboardButton(`🔢 Columns: ${pyStr(_cat_cols)}`, { callback_data: "noop_fld_layout" }), InlineKeyboardButton("1", { callback_data: "adm_fld_layout_1" }), InlineKeyboardButton("2", { callback_data: "adm_fld_layout_2" }), InlineKeyboardButton("3", { callback_data: "adm_fld_layout_3" })]);
      pyAppend(keyboard, [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]);
      sub_list_str = (pyT(subfolders) ? (pyJoin("\n", ((() => { const __acc = []; for (const s of pyIter(subfolders)) { __acc.push(`  📁 ${pyStr((pyT((!pyT(db.is_category_active(s)))) ? ("🔴 [OFF] ") : ("")))}<b>${pyStr(pyHtmlEscape(s))}</b> <i>(${pyStr((pyT(pyLen(db.get_courses_by_folder(s, { include_inactive: true }))) || pyT(pyLen(db.get_sub_folders(s, { include_inactive: true })))))} items)</i>`); } return __acc; })()))) : ("  <i>(কোনো ক্যাটাগরি নেই)</i>"));
      msg = `<blockquote>📂 <b>[ Category & Directory Manager ]</b></blockquote>

<blockquote>📂 <b>Categories (${pyStr(pyLen(subfolders))}):</b>
${pyStr(sub_list_str)}</blockquote>

<blockquote>💡 <b>Inside a category: Add sub-folders, toggle status, or add courses </b></blockquote>`;
  } else {
      pyAppend(keyboard, [InlineKeyboardButton("➕ Add Course", { callback_data: "adm_fld_addcourse" }), InlineKeyboardButton("➕ Add Sub-Folder", { callback_data: "adm_fld_addfolder" })]);
      cur_pos_str = "";
      is_active = db.is_category_active(clean_path);
      status_toggle_btn = InlineKeyboardButton((pyT(is_active) ? (`🟢 Active`) : ("🔴 Off")), { callback_data: `adm_fld_togglestatus_${pyStr(current_name)}` });
      del_btn = InlineKeyboardButton(`✕ Delete '${pyStr(current_name)}'`, { callback_data: "adm_fld_delfolder" });
      rename_btn = InlineKeyboardButton("✏️ Rename", { callback_data: `adm_fld_rename_${pyStr(current_name)}` });
      pyAppend(keyboard, [rename_btn, del_btn]);
      pyAppend(keyboard, [InlineKeyboardButton("🔀 Change Position", { callback_data: "adm_fld_reorder_CUR" }), status_toggle_btn]);
      _copy_src = (pyT(context) ? (pyStrip((pyT(pyGet(context.user_data, "copy_folder_src")) || pyT("")))) : (""));
      _show_paste = pyT((pyT(_copy_src) && pyT(((!pyEq(_copy_src, clean_path)))) && pyT((!pyT(pyStart(clean_path, (_copy_src + " > ")))))));
      if (pyT((!pyT(_show_paste)))) {
            pyAppend(keyboard, [InlineKeyboardButton("✂️ Cut", { callback_data: "adm_fld_copy_go" }), InlineKeyboardButton("🖼️ Header", { callback_data: "adm_fld_header" })]);
      } else {
            _cs_base = pyStrip(pySub(pySplit(_copy_src, " > ", -1), (-(1))));
            pyAppend(keyboard, [InlineKeyboardButton(`📌 Paste '${pyStr(pySlice(_cs_base, null, 20, null))}' Here`, { callback_data: "adm_fld_paste_go" })]);
            pyAppend(keyboard, [InlineKeyboardButton("❌ Cancel Cut", { callback_data: "adm_fld_cancel_copy" })]);
      }
      _cut_cid = (pyT(context) ? (pyStrip((pyT(pyGet(context.user_data, "cut_course_id")) || pyT("")))) : (""));
      if (pyT(_cut_cid)) {
            _cut_c = db.get_course(_cut_cid);
            if (pyT(_cut_c)) {
                    pyAppend(keyboard, [InlineKeyboardButton(`📌 Paste Course '${pyStr(pySlice(pyStr(pyGet(_cut_c, "name", "")), null, 20, null))}' Here`, { callback_data: "adm_course_paste_go" })]);
                    pyAppend(keyboard, [InlineKeyboardButton("❌ Cancel Course Cut", { callback_data: "adm_course_cancel_cut" })]);
            } else {
                    pyPop(context.user_data, "cut_course_id", null);
            }
      }
      _sub_cols = db.get_subcategory_row_size();
      pyAppend(keyboard, [InlineKeyboardButton(`🔢 Columns: ${pyStr(_sub_cols)}`, { callback_data: "noop_fld_layout" }), InlineKeyboardButton("1", { callback_data: "adm_fld_layout_1" }), InlineKeyboardButton("2", { callback_data: "adm_fld_layout_2" }), InlineKeyboardButton("3", { callback_data: "adm_fld_layout_3" })]);
      back_title = (pyT(((pyLen(segments) > 1))) ? (`« Back to ${pyStr(pySub(segments, (-(2))))}`) : ("« All Categories"));
      back_btn = InlineKeyboardButton(back_title, { callback_data: `adm_dir_${pyStr(parent_path)}` });
      pyAppend(keyboard, [back_btn]);
      if (pyT(((pyLen(segments) > 1)))) {
            pyAppend(keyboard, [InlineKeyboardButton("📂 All Categories (Root)", { callback_data: "adm_dir_" })]);
      }
      path_display = pyHtmlEscape(pyJoin(" ➔ ", segments));
      status_display = (pyT(is_active) ? ("🟢 <b>Active (ON)</b>") : ("🔴 <b>Inactive (OFF - Hidden from students)</b>"));
      sub_list_str = (pyT(subfolders) ? (pyJoin("\n", ((() => { const __acc = []; for (const s of pyIter(subfolders)) { __acc.push(`  📁 ${pyStr((pyT((!pyT(db.is_category_active(((clean_path + " > ") + s))))) ? ("🔴 [OFF] ") : ("")))}<b>${pyStr(pyHtmlEscape(s))}</b> <i>(${pyStr((pyT(pyLen(db.get_courses_by_folder(((clean_path + " > ") + s), { include_inactive: true }))) || pyT(pyLen(db.get_sub_folders(((clean_path + " > ") + s), { include_inactive: true })))))} items)</i>`); } return __acc; })()))) : ("  <i>(No Sub-Folders)</i>"));
      course_list_str = (pyT(courses) ? (pyJoin("\n", ((() => { const __acc = []; for (const c of pyIter(courses)) { __acc.push(`  • ${pyStr((pyT((pyEq(pyGet(c, "status"), "inactive"))) ? ("[DISABLED] ") : ("")))}<b>${pyStr(pyHtmlEscape(pySub(c, "name")))}</b> ➔ <code>৳${pyStr(pyGet(c, "price", 0))}</code>`); } return __acc; })()))) : ("  <i>(No Courses in this folder)</i>"));
      msg = `<blockquote>📁 <b>[ Directory: <code>${pyStr(path_display)}</code> ]</b>
📌 <b>Visibility / Status:</b> ${pyStr(status_display)}${pyStr(cur_pos_str)}</blockquote>

<blockquote>📂 <b>Sub-Folders (${pyStr(pyLen(subfolders))}):</b>
${pyStr(sub_list_str)}</blockquote>

<blockquote>📚 <b>Courses (${pyStr(pyLen(courses))}):</b>
${pyStr(course_list_str)}</blockquote>

<blockquote>💡 <b>Click below to manage categories, courses, and sub-folders:</b></blockquote>`;
  }
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw __e;
            }
      }
  }
}

export async function render_ebook_category_reorder_panel(query, context, parent_path) {
  if (parent_path === undefined) parent_path = ("");
  let back_cb, clean_parent, e, eb, ebooks, f, folders, idx;
  let keyboard, mark, msg, parent_title, per_row, row, sel;
  clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
  folders = db.get_ebook_sub_folders(clean_parent, { include_inactive: true });
  ebooks = (pyT(clean_parent) ? (db.get_ebooks_by_folder(clean_parent, { include_inactive: true })) : ([]));
  parent_title = (pyT(clean_parent) ? (`Folder '${pyStr(clean_parent)}'`) : ("All Categories"));
  context.user_data["reorder_eb_parent_path"] = clean_parent;
  sel = (pyT(pyGet(context.user_data, "pos_eb_sel")) || pyT({  }));
  per_row = (pyT((!pyT(clean_parent))) ? (db.get_category_row_size()) : (db.get_subcategory_row_size()));
  msg = `🗂️ <b>Position Change Mode</b>

Select a category, then use arrow buttons to move
<i>${pyStr(pyHtmlEscape(parent_title))}</i>`;
  if (pyT((pyEq(pyGet(sel, "kind"), "f")))) {
      msg += `
✅ Selected: 📁 <code>${pyStr(pyHtmlEscape(pyGet(sel, "name", "")))}</code>`;
  } else if (pyT((pyEq(pyGet(sel, "kind"), "e")))) {
      msg += `
✅ Selected: 📖 <code>${pyStr(pyHtmlEscape(pyGet(sel, "name", "")))}</code>`;
  }
  keyboard = [];
  row = [];
  for (const [idx, f] of pyIter(pyEnumerate(folders))) {
      mark = (pyT((pyT((pyEq(pyGet(sel, "kind"), "f"))) && pyT((pyEq(pyGet(sel, "name"), f))))) ? ("✅ ") : (""));
      pyAppend(row, InlineKeyboardButton(`${pyStr(mark)}📁 ${pyStr(f)}`, { callback_data: `adm_ebfld_psel_f${pyStr(idx)}` }));
      if (pyT((pyEq(pyLen(row), per_row)))) {
            pyAppend(keyboard, row);
            row = [];
      }
  }
  if (pyT(row)) {
      pyAppend(keyboard, row);
  }
  row = [];
  for (const [idx, eb] of pyIter(pyEnumerate(ebooks))) {
      mark = (pyT((pyT((pyEq(pyGet(sel, "kind"), "e"))) && pyT((pyEq(pyGet(sel, "id"), pyGet(eb, "id")))))) ? ("✅ ") : (""));
      pyAppend(row, InlineKeyboardButton(`${pyStr(mark)}📖 ${pyStr(pySlice(pySub(eb, "name"), null, 18, null))}`, { callback_data: `adm_ebfld_psel_e${pyStr(idx)}` }));
      if (pyT((pyEq(pyLen(row), per_row)))) {
            pyAppend(keyboard, row);
            row = [];
      }
  }
  if (pyT(row)) {
      pyAppend(keyboard, row);
  }
  if (pyT((pyT((!pyT(folders))) && pyT((!pyT(ebooks)))))) {
      msg += "\n<i>(এই Window-এ কোনো Item নেই)</i>";
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️", { callback_data: "adm_ebfld_pos_left" }), InlineKeyboardButton("⬆️", { callback_data: "adm_ebfld_pos_up" }), InlineKeyboardButton("⬇️", { callback_data: "adm_ebfld_pos_down" }), InlineKeyboardButton("➡️", { callback_data: "adm_ebfld_pos_right" })]);
  back_cb = (pyT(clean_parent) ? (`adm_ebdir_${pyStr(clean_parent)}`) : ("adm_ebdir_"));
  pyAppend(keyboard, [InlineKeyboardButton("❌ Exit Position Mode", { callback_data: back_cb })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw __e;
            }
      }
  }
}

export async function render_admin_ebook_folder_directory(query, context, folder_path) {
  if (folder_path === undefined) folder_path = ("");
  let _cat_cols, _copy_src, _cs_base, _show_paste, _sub_cols, back_btn, back_title, badge;
  let child_ebooks, child_path, child_sub_count, clean_path, current_name, del_btn, e, eb;
  let ebook_list_str, ebooks, is_active, is_sf_active, keyboard, msg, parent_path, path_display;
  let per_row, price_tag, rename_btn, row, s, segments, sf, status_display;
  let status_dot, status_toggle_btn, sub_list_str, subfolders, total_items;
  clean_path = pyReplace(pyReplace(pyStrip(pyStr(folder_path)), " / ", " > "), "/", " > ");
  context.user_data["active_eb_dir"] = clean_path;
  subfolders = db.get_ebook_sub_folders(clean_path, { include_inactive: true });
  ebooks = (pyT(clean_path) ? (db.get_ebooks_by_folder(clean_path, { include_inactive: true })) : ([]));
  segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(clean_path, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
  current_name = (pyT(segments) ? (pySub(segments, (-(1)))) : ("Root"));
  parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
  keyboard = [];
  per_row = (pyT((!pyT(clean_path))) ? (db.get_category_row_size()) : (db.get_subcategory_row_size()));
  row = [];
  for (const sf of pyIter(subfolders)) {
      child_path = (pyT(clean_path) ? (`${pyStr(clean_path)} > ${pyStr(sf)}`) : (sf));
      child_ebooks = db.get_ebooks_by_folder(child_path, { include_inactive: true });
      child_sub_count = pyLen(db.get_ebook_sub_folders(child_path, { include_inactive: true }));
      total_items = (pyT(((pyLen(child_ebooks) > 0))) ? (pyLen(child_ebooks)) : (child_sub_count));
      badge = (pyT(((total_items > 0))) ? (` (${pyStr(total_items)})`) : (""));
      is_sf_active = db.is_ebook_category_active(child_path);
      status_dot = (pyT(is_sf_active) ? ("") : ("🔴 [OFF] "));
      pyAppend(row, InlineKeyboardButton(`${pyStr(status_dot)}${pyStr(sf)}${pyStr(badge)}`, { callback_data: `adm_ebdir_${pyStr(child_path)}` }));
      if (pyT((pyEq(pyLen(row), per_row)))) {
            pyAppend(keyboard, row);
            row = [];
      }
  }
  if (pyT(row)) {
      pyAppend(keyboard, row);
  }
  for (const eb of pyIter(pySlice(ebooks, null, 25, null))) {
      price_tag = (pyT(((pyGet(eb, "price", 0) > 0))) ? (` (${pyStr(pySub(eb, "price"))}৳)`) : (" (Free)"));
      status_dot = (pyT((pyEq(pyGet(eb, "status"), "inactive"))) ? ("🔴 ") : (""));
      pyAppend(keyboard, [InlineKeyboardButton((pyT(((pyGet(eb, "price", 0) > 0))) ? (`${pyStr(status_dot)}${pyStr(pySub(eb, "name"))} — ${pyStr(pySub(eb, "price"))}৳`) : (`${pyStr(status_dot)}${pyStr(pySub(eb, "name"))} — Free 🎁`)), { callback_data: `adm_vieweb_${pyStr(pySub(eb, "id"))}` })]);
  }
  if (pyT((!pyT(clean_path)))) {
      pyAppend(keyboard, [InlineKeyboardButton("➕ Add Category", { callback_data: "adm_ebfld_addfolder" }), InlineKeyboardButton("➕ Add New E-Book", { callback_data: "adm_ebfld_addebook" })]);
      pyAppend(keyboard, [InlineKeyboardButton("🔀 Change Position (Reorder)", { callback_data: "adm_ebfld_reorder_CUR" })]);
      pyAppend(keyboard, [InlineKeyboardButton("🖼️ Library Header", { callback_data: "adm_eblib_header" })]);
      _copy_src = (pyT(context) ? (pyStrip((pyT(pyGet(context.user_data, "copy_eb_folder_src")) || pyT("")))) : (""));
      if (pyT(_copy_src)) {
            _cs_base = pyStrip(pySub(pySplit(_copy_src, " > ", -1), (-(1))));
            pyAppend(keyboard, [InlineKeyboardButton(`📌 Paste '${pyStr(pySlice(_cs_base, null, 20, null))}' Here`, { callback_data: "adm_ebfld_paste_go" })]);
            pyAppend(keyboard, [InlineKeyboardButton("❌ Cancel Cut", { callback_data: "adm_ebfld_cancel_copy" })]);
      }
      _cat_cols = db.get_category_row_size();
      pyAppend(keyboard, [InlineKeyboardButton(`🔢 Columns: ${pyStr(_cat_cols)}`, { callback_data: "noop_fld_layout" }), InlineKeyboardButton("1", { callback_data: "adm_ebfld_layout_1" }), InlineKeyboardButton("2", { callback_data: "adm_ebfld_layout_2" }), InlineKeyboardButton("3", { callback_data: "adm_ebfld_layout_3" })]);
      pyAppend(keyboard, [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]);
      sub_list_str = (pyT(subfolders) ? (pyJoin("\n", ((() => { const __acc = []; for (const s of pyIter(subfolders)) { __acc.push(`  📁 ${pyStr((pyT((!pyT(db.is_ebook_category_active(s)))) ? ("🔴 [OFF] ") : ("")))}<b>${pyStr(pyHtmlEscape(s))}</b> <i>(${pyStr((pyT(pyLen(db.get_ebooks_by_folder(s, { include_inactive: true }))) || pyT(pyLen(db.get_ebook_sub_folders(s, { include_inactive: true })))))} items)</i>`); } return __acc; })()))) : ("  <i>(কোনো ক্যাটাগরি নেই)</i>"));
      msg = `<blockquote>📖 <b>[ E-Book Category & Directory Manager ]</b></blockquote>

<blockquote>📂 <b>Categories (${pyStr(pyLen(subfolders))}):</b>
${pyStr(sub_list_str)}</blockquote>

<blockquote>💡 <b>প্রতিটি ক্যাটাগরিতে ঢুকে সাব-ফোল্ডার, অন/অফ (Status Toggle) বা সরাসরি ই-বুক / PDF যুক্ত করতে পারেন।</b></blockquote>`;
  } else {
      pyAppend(keyboard, [InlineKeyboardButton("➕ Add E-Book", { callback_data: "adm_ebfld_addebook" }), InlineKeyboardButton("➕ Add Sub-Folder", { callback_data: "adm_ebfld_addfolder" })]);
      is_active = db.is_ebook_category_active(clean_path);
      status_toggle_btn = InlineKeyboardButton((pyT(is_active) ? (`🟢 Active`) : ("🔴 Off")), { callback_data: `adm_ebfld_togglestatus_${pyStr(current_name)}` });
      del_btn = InlineKeyboardButton(`✕ Delete '${pyStr(current_name)}'`, { callback_data: "adm_ebfld_delfolder" });
      rename_btn = InlineKeyboardButton("✏️ Rename", { callback_data: `adm_ebfld_rename_${pyStr(current_name)}` });
      pyAppend(keyboard, [rename_btn, del_btn]);
      pyAppend(keyboard, [InlineKeyboardButton("🔀 Change Position", { callback_data: "adm_ebfld_reorder_CUR" }), status_toggle_btn]);
      _copy_src = (pyT(context) ? (pyStrip((pyT(pyGet(context.user_data, "copy_eb_folder_src")) || pyT("")))) : (""));
      _show_paste = pyT((pyT(_copy_src) && pyT(((!pyEq(_copy_src, clean_path)))) && pyT((!pyT(pyStart(clean_path, (_copy_src + " > ")))))));
      if (pyT((!pyT(_show_paste)))) {
            pyAppend(keyboard, [InlineKeyboardButton("✂️ Cut", { callback_data: "adm_ebfld_copy_go" }), InlineKeyboardButton("🖼️ Header", { callback_data: "adm_ebfld_header" })]);
      } else {
            _cs_base = pyStrip(pySub(pySplit(_copy_src, " > ", -1), (-(1))));
            pyAppend(keyboard, [InlineKeyboardButton(`📌 Paste '${pyStr(pySlice(_cs_base, null, 20, null))}' Here`, { callback_data: "adm_ebfld_paste_go" })]);
            pyAppend(keyboard, [InlineKeyboardButton("❌ Cancel Cut", { callback_data: "adm_ebfld_cancel_copy" })]);
      }
      _sub_cols = db.get_subcategory_row_size();
      pyAppend(keyboard, [InlineKeyboardButton(`🔢 Columns: ${pyStr(_sub_cols)}`, { callback_data: "noop_fld_layout" }), InlineKeyboardButton("1", { callback_data: "adm_ebfld_layout_1" }), InlineKeyboardButton("2", { callback_data: "adm_ebfld_layout_2" }), InlineKeyboardButton("3", { callback_data: "adm_ebfld_layout_3" })]);
      back_title = (pyT(((pyLen(segments) > 1))) ? (`« Back to ${pyStr(pySub(segments, (-(2))))}`) : ("« All Categories"));
      back_btn = InlineKeyboardButton(back_title, { callback_data: `adm_ebdir_${pyStr(parent_path)}` });
      pyAppend(keyboard, [back_btn]);
      if (pyT(((pyLen(segments) > 1)))) {
            pyAppend(keyboard, [InlineKeyboardButton("📂 All Categories (Root)", { callback_data: "adm_ebdir_" })]);
      }
      path_display = pyHtmlEscape(pyJoin(" ➔ ", segments));
      status_display = (pyT(is_active) ? ("🟢 <b>Active (ON)</b>") : ("🔴 <b>Inactive (OFF - Hidden from students)</b>"));
      sub_list_str = (pyT(subfolders) ? (pyJoin("\n", ((() => { const __acc = []; for (const s of pyIter(subfolders)) { __acc.push(`  📁 ${pyStr((pyT((!pyT(db.is_ebook_category_active(((clean_path + " > ") + s))))) ? ("🔴 [OFF] ") : ("")))}<b>${pyStr(pyHtmlEscape(s))}</b> <i>(${pyStr((pyT(pyLen(db.get_ebooks_by_folder(((clean_path + " > ") + s), { include_inactive: true }))) || pyT(pyLen(db.get_ebook_sub_folders(((clean_path + " > ") + s))))))} items)</i>`); } return __acc; })()))) : ("  <i>(No Sub-Folders)</i>"));
      ebook_list_str = (pyT(ebooks) ? (pyJoin("\n", ((() => { const __acc = []; for (const eb of pyIter(ebooks)) { __acc.push(`  • ${pyStr((pyT((pyEq(pyGet(eb, "status"), "inactive"))) ? ("[DISABLED] ") : ("")))}<b>${pyStr(pyHtmlEscape(pySub(eb, "name")))}</b> ➔ <code>৳${pyStr(pyGet(eb, "price", 0))}</code>`); } return __acc; })()))) : ("  <i>(এই ফোল্ডারে এখনো কোনো ই-বুক নেই)</i>"));
      msg = `<blockquote>📁 <b>[ E-Book Directory: <code>${pyStr(path_display)}</code> ]</b>
📌 <b>Visibility / Status:</b> ${pyStr(status_display)}</blockquote>

<blockquote>📂 <b>Sub-Folders (${pyStr(pyLen(subfolders))}):</b>
${pyStr(sub_list_str)}</blockquote>

<blockquote>📖 <b>E-Books (${pyStr(pyLen(ebooks))}):</b>
${pyStr(ebook_list_str)}</blockquote>
<blockquote>💡 <b>নিচের বাটন চেপে ক্যাটাগরি অন/অফ, নতুন ই-বুক বা সাব-ফোল্ডার পরিচালনা করুন:</b></blockquote>`;
  }
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw __e;
            }
      }
  }
}

export function get_action_select_keyboard(is_edit, r_idx, c_idx) {
  if (is_edit === undefined) is_edit = (false);
  if (r_idx === undefined) r_idx = (0);
  if (c_idx === undefined) c_idx = (0);
  let keyboard, prefix;
  prefix = (pyT(is_edit) ? ("adm_kb_edact_") : ("adm_kb_act_"));
  keyboard = [[InlineKeyboardButton("⚙️ Built-in Actions", { callback_data: `${pyStr(prefix)}grp_builtin` })], [InlineKeyboardButton("📂 Course Categories", { callback_data: `${pyStr(prefix)}grp_cats` })], [InlineKeyboardButton("🏷️ Course Sub-categories", { callback_data: `${pyStr(prefix)}grp_subcats` })], [InlineKeyboardButton("📖 E-Book / PDF Folders", { callback_data: `${pyStr(prefix)}grp_ebcats` })], [InlineKeyboardButton("✍️ Custom Callback Data", { callback_data: `${pyStr(prefix)}custom` })]];
  if (pyT(is_edit)) {
      pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: `adm_kb_edit_btn_${pyStr(r_idx)}_${pyStr(c_idx)}` })]);
  } else {
      pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_keyboard_settings" })]);
  }
  return (InlineKeyboardMarkup(keyboard));
}

export function get_builtin_actions_keyboard(is_edit, r_idx, c_idx) {
  if (is_edit === undefined) is_edit = (false);
  if (r_idx === undefined) r_idx = (0);
  if (c_idx === undefined) c_idx = (0);
  let keyboard, prefix;
  prefix = (pyT(is_edit) ? ("adm_kb_edact_") : ("adm_kb_act_"));
  keyboard = [[InlineKeyboardButton("🛍️ Cart", { callback_data: `${pyStr(prefix)}cart` }), InlineKeyboardButton("👤 Profile", { callback_data: `${pyStr(prefix)}profile` })], [InlineKeyboardButton("ℹ Info / Help", { callback_data: `${pyStr(prefix)}info` }), InlineKeyboardButton("⚙ Admin Panel", { callback_data: `${pyStr(prefix)}admin` })], [InlineKeyboardButton("📚 Browse Courses", { callback_data: `${pyStr(prefix)}browse_categories` }), InlineKeyboardButton("🎓 My Courses", { callback_data: `${pyStr(prefix)}my_courses_nav` })], [InlineKeyboardButton("📖 My E-Books", { callback_data: `${pyStr(prefix)}my_ebooks_nav` })], [InlineKeyboardButton("⬅️Back", { callback_data: `${pyStr(prefix)}menu` })]];
  return (InlineKeyboardMarkup(keyboard));
}

export let KB_PICK_PER_PAGE = 8;
export function _kb_pick_nav_row(prefix, page, total_pages) {
  let nav;
  nav = [];
  if (pyT(((page > 0)))) {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `${pyStr(prefix)}${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_kbpg" }));
  }
  pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page + 1))}/${pyStr(pyMax(1, total_pages))}`, { callback_data: "noop_kbpg" }));
  if (pyT(((page < (total_pages - 1))))) {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `${pyStr(prefix)}${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_kbpg" }));
  }
  return (nav);
}

export function get_categories_actions_keyboard(is_edit, r_idx, c_idx, page) {
  if (is_edit === undefined) is_edit = (false);
  if (r_idx === undefined) r_idx = (0);
  if (c_idx === undefined) c_idx = (0);
  if (page === undefined) page = (0);
  let cat, cats, keyboard, prefix, total_pages;
  prefix = (pyT(is_edit) ? ("adm_kb_edact_") : ("adm_kb_act_"));
  keyboard = [];
  cats = pyList(pyKeys(db.categories));
  total_pages = pyMax(1, pyDiv(((pyLen(cats) + KB_PICK_PER_PAGE) - 1), KB_PICK_PER_PAGE));
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  for (const cat of pyIter(pySlice(cats, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, KB_PICK_PER_PAGE) : (page * KB_PICK_PER_PAGE))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), KB_PICK_PER_PAGE) : ((page + 1) * KB_PICK_PER_PAGE))), null))) {
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(cat)}`, { callback_data: `${pyStr(prefix)}cat_${pyStr(cat)}` })]);
  }
  if (pyT(((total_pages > 1)))) {
      pyAppend(keyboard, _kb_pick_nav_row(`${pyStr(prefix)}catpg_`, page, total_pages));
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: `${pyStr(prefix)}menu` })]);
  return (InlineKeyboardMarkup(keyboard));
}

export function get_subcat_category_select_keyboard(is_edit, r_idx, c_idx, page) {
  if (is_edit === undefined) is_edit = (false);
  if (r_idx === undefined) r_idx = (0);
  if (c_idx === undefined) c_idx = (0);
  if (page === undefined) page = (0);
  let cat, cats, keyboard, prefix, total_pages;
  prefix = (pyT(is_edit) ? ("adm_kb_edact_") : ("adm_kb_act_"));
  keyboard = [];
  cats = pyList(pyKeys(db.categories));
  total_pages = pyMax(1, pyDiv(((pyLen(cats) + KB_PICK_PER_PAGE) - 1), KB_PICK_PER_PAGE));
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  for (const cat of pyIter(pySlice(cats, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, KB_PICK_PER_PAGE) : (page * KB_PICK_PER_PAGE))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), KB_PICK_PER_PAGE) : ((page + 1) * KB_PICK_PER_PAGE))), null))) {
      pyAppend(keyboard, [InlineKeyboardButton(`📂 ${pyStr(cat)}`, { callback_data: `${pyStr(prefix)}subcatlist_${pyStr(cat)}` })]);
  }
  if (pyT(((total_pages > 1)))) {
      pyAppend(keyboard, _kb_pick_nav_row(`${pyStr(prefix)}subcatlistpg_`, page, total_pages));
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: `${pyStr(prefix)}menu` })]);
  return (InlineKeyboardMarkup(keyboard));
}

export function get_subcategories_actions_keyboard(category, is_edit, r_idx, c_idx, page) {
  if (is_edit === undefined) is_edit = (false);
  if (r_idx === undefined) r_idx = (0);
  if (c_idx === undefined) c_idx = (0);
  if (page === undefined) page = (0);
  let keyboard, prefix, sub, subcats, total_pages;
  prefix = (pyT(is_edit) ? ("adm_kb_edact_") : ("adm_kb_act_"));
  keyboard = [];
  subcats = pyGet(db.categories, category, []);
  total_pages = pyMax(1, pyDiv(((pyLen(subcats) + KB_PICK_PER_PAGE) - 1), KB_PICK_PER_PAGE));
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  for (const sub of pyIter(pySlice(subcats, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, KB_PICK_PER_PAGE) : (page * KB_PICK_PER_PAGE))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), KB_PICK_PER_PAGE) : ((page + 1) * KB_PICK_PER_PAGE))), null))) {
      pyAppend(keyboard, [InlineKeyboardButton(`🏷️ ${pyStr(sub)}`, { callback_data: `${pyStr(prefix)}subcat_${pyStr(category)}_${pyStr(sub)}` })]);
  }
  if (pyT(((total_pages > 1)))) {
      pyAppend(keyboard, _kb_pick_nav_row(`${pyStr(prefix)}subcatpg_`, page, total_pages));
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: `${pyStr(prefix)}grp_subcats` })]);
  return (InlineKeyboardMarkup(keyboard));
}

export function get_all_ebook_folder_paths() {
  let child, paths, sf;
  paths = [];
  const walk = (parent) => {
    let child, sf;
    for (const sf of pyIter(db.get_ebook_sub_folders(parent, { include_inactive: true }))) {
        child = (pyT(parent) ? (`${pyStr(parent)} > ${pyStr(sf)}`) : (sf));
        pyAppend(paths, child);
        walk(child);
    }
  };
  walk("");
  return (paths);
}

export function get_ebook_folder_actions_keyboard(is_edit, r_idx, c_idx, page) {
  if (is_edit === undefined) is_edit = (false);
  if (r_idx === undefined) r_idx = (0);
  if (c_idx === undefined) c_idx = (0);
  if (page === undefined) page = (0);
  let i, keyboard, offset, path, paths, prefix, total_pages;
  prefix = (pyT(is_edit) ? ("adm_kb_edact_") : ("adm_kb_act_"));
  keyboard = [[InlineKeyboardButton("📖 E-Book Main List", { callback_data: `${pyStr(prefix)}eb_act_browse` })], [InlineKeyboardButton("📚 All E-Books", { callback_data: `${pyStr(prefix)}eb_act_all` })]];
  paths = get_all_ebook_folder_paths();
  total_pages = pyMax(1, pyDiv(((pyLen(paths) + KB_PICK_PER_PAGE) - 1), KB_PICK_PER_PAGE));
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  offset = ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, KB_PICK_PER_PAGE) : (page * KB_PICK_PER_PAGE)));
  for (const [i, path] of pyIter(pyEnumerate(pySlice(paths, offset, (offset + KB_PICK_PER_PAGE), null), offset))) {
      pyAppend(keyboard, [InlineKeyboardButton(`📁 ${pyStr(path)}`, { callback_data: `${pyStr(prefix)}eb_idx_${pyStr(i)}` })]);
  }
  if (pyT(((total_pages > 1)))) {
      pyAppend(keyboard, _kb_pick_nav_row(`${pyStr(prefix)}ebpg_`, page, total_pages));
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: `${pyStr(prefix)}menu` })]);
  return (InlineKeyboardMarkup(keyboard));
}

export async function render_kb_del_list(query) {
  let btn, buttons_grid, c_idx, custom_kb, keyboard, on, r, r_idx;
  custom_kb = db.get_custom_keyboards();
  keyboard = [];
  buttons_grid = pyGet(custom_kb, "buttons", []);
  for (const [r_idx, r] of pyIter(pyEnumerate(buttons_grid))) {
      for (const [c_idx, btn] of pyIter(pyEnumerate(r))) {
            if (pyT((!pyT(pyIsInstance(btn, "dict"))))) {
                    continue;
            }
            on = ((!(pyGet(btn, "enabled", true) === false)));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr((pyT(on) ? ("🟢 ON") : ("🔴 OFF")))}: ${pyStr(pySlice(pyStr(pyGet(btn, "text", "?")), null, 16, null))}`, { callback_data: `adm_kb_tog_${pyStr(r_idx)}_${pyStr(c_idx)}` }), InlineKeyboardButton("🗑️ Delete", { callback_data: `adm_kb_del_btn_${pyStr(r_idx)}_${pyStr(c_idx)}` })]);
      }
  }
  pyAppend(keyboard, [InlineKeyboardButton("« Keyboard Settings", { callback_data: "adm_keyboard_settings" })]);
  void ((await query.edit_message_text("👇 <b>Tap ON/OFF to disable without deleting, or 🗑️ to delete:</b>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_keyboard_settings_panel(query) {
  let adm_marker, btn, buttons_grid, c_idx, custom_kb, dot, home_btn_enabled, home_btn_st;
  let keyboard, msg, off_marker, r_idx, row, row_str, view_all_enabled, view_all_st;
  custom_kb = db.get_custom_keyboards();
  home_btn_enabled = db.is_home_button_enabled();
  home_btn_st = (pyT(home_btn_enabled) ? ("🟢 Enabled (Active)") : ("🔴 Disabled (Hidden)"));
  view_all_enabled = db.is_view_all_courses_enabled();
  view_all_st = (pyT(view_all_enabled) ? ("🟢 Enabled (Active)") : ("🔴 Disabled (Hidden)"));
  msg = `⚙️ <b>Keyboard Layout Settings</b>
━━━━━━━━━━━━━━━━━━━━
Here is the current ReplyKeyboardMarkup layout. (Buttons with 👑 are Admin-only)

• <b>Inline HOME Button:</b> ${pyStr(home_btn_st)}
• <b>Browse All Courses Button:</b> ${pyStr(view_all_st)}

`;
  buttons_grid = pyGet(custom_kb, "buttons", []);
  for (const [r_idx, row] of pyIter(pyEnumerate(buttons_grid))) {
      row_str = [];
      for (const [c_idx, btn] of pyIter(pyEnumerate(row))) {
            adm_marker = (pyT(pyGet(btn, "admin_only")) ? (" 👑") : (""));
            off_marker = (pyT(((pyGet(btn, "enabled", true) === false))) ? (" 🔴OFF") : (""));
            dot = pyGet(BUTTON_STYLE_DOT, (pyT(_kb_button_style(btn)) || pyT("none")), "⚪");
            pyAppend(row_str, `${pyStr(dot)}<code>[${pyStr(pyHtmlEscape(pySub(btn, "text")))}${pyStr(adm_marker)}${pyStr(off_marker)} -> ${pyStr(pyHtmlEscape(pyGet(btn, "action", "")))}]</code>`);
      }
      msg += ((`<b>Row ${pyStr((r_idx + 1))}:</b> ` + pyJoin(", ", row_str)) + "\n");
  }
  if (pyT((!pyT(buttons_grid)))) {
      msg += "<i>No custom buttons configured.</i>\n";
  }
  msg += "\n👇 Select an operation below:";
  keyboard = [[InlineKeyboardButton(`⚜️ HOME: ${pyStr((pyT(home_btn_enabled) ? ("ON 🟢") : ("OFF 🔴")))}`, { callback_data: "adm_toggle_home_btn_kb" }), InlineKeyboardButton(`📚 All Courses: ${pyStr((pyT(view_all_enabled) ? ("ON 🟢") : ("OFF 🔴")))}`, { callback_data: "adm_toggle_view_all_courses_kb" })], [InlineKeyboardButton("➕ Add Button", { callback_data: "adm_kb_add" }), InlineKeyboardButton("🗑️ Delete Button", { callback_data: "adm_kb_del_list" })], [InlineKeyboardButton("✏️ Edit Button", { callback_data: "adm_kb_edit_list" }), InlineKeyboardButton("📐 Resize Columns", { callback_data: "adm_kb_resize_cols_prompt" })], [InlineKeyboardButton("🔀 Position Mode", { callback_data: "adm_kb_pos" }), InlineKeyboardButton("🎨 Colors", { callback_data: "adm_kb_colors" })], [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]];
  void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_kb_position_panel(query, context) {
  let btn, c_idx, e, grid, kb_row, keyboard, mark, msg;
  let r_idx, row, sc, sel, sr, txt;
  grid = pyGet(db.get_custom_keyboards(), "buttons", []);
  sel = pyGet(context.user_data, "kb_pos_sel");
  if (pyT(sel)) {
      [sr, sc] = sel;
      if (pyT((!pyT((pyT(((0 <= sr) && (sr < pyLen(grid)))) && pyT(((0 <= sc) && (sc < pyLen(pySub(grid, sr)))))))))) {
            sel = null;
            pyPop(context.user_data, "kb_pos_sel", null);
      }
  }
  msg = "🗂️ <b>Position Change Mode</b>\n\nSelect a button, then use arrow buttons to move";
  if (pyT(sel)) {
      [sr, sc] = sel;
      msg += `
✅ Selected: <code>${pyStr(pyHtmlEscape(pyStr(pyGet(pySub(pySub(grid, sr), sc), "text", ""))))}</code> (Row ${pyStr((sr + 1))})`;
  }
  keyboard = [];
  for (const [r_idx, row] of pyIter(pyEnumerate(grid))) {
      kb_row = [];
      for (const [c_idx, btn] of pyIter(pyEnumerate(row))) {
            mark = (pyT((pyT((pyEq(sel, [r_idx, c_idx]))) || pyT((pyEq(sel, [r_idx, c_idx]))))) ? ("✅ ") : (""));
            txt = pySlice(pyStr(pyGet(btn, "text", "?")), null, 16, null);
            pyAppend(kb_row, InlineKeyboardButton(`${pyStr(mark)}${pyStr(txt)}`, { callback_data: `adm_kb_pos_sel_${pyStr(r_idx)}_${pyStr(c_idx)}` }));
      }
      pyAppend(keyboard, kb_row);
  }
  if (pyT((!pyT(grid)))) {
      msg += "\n<i>(No buttons yet — Add one first)</i>";
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️", { callback_data: "adm_kb_pos_left" }), InlineKeyboardButton("⬆️", { callback_data: "adm_kb_pos_up" }), InlineKeyboardButton("⬇️", { callback_data: "adm_kb_pos_down" }), InlineKeyboardButton("➡️", { callback_data: "adm_kb_pos_right" })]);
  pyAppend(keyboard, [InlineKeyboardButton("❌ Exit Position Mode", { callback_data: "adm_keyboard_settings" })]);
  try {
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } catch (e) {
      if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
            throw __e;
      }
  }
}

export let KB_COLORS_PER_PAGE = 8;
export function _kb_color_entries() {
  let btn, c_idx, grid, out, r_idx, row;
  try {
      grid = (pyT(pyGet(db.get_custom_keyboards(), "buttons", [])) || pyT([]));
  } catch (__e) {
      return ([]);
  }
  out = [];
  try {
      for (const [r_idx, row] of pyIter(pyEnumerate(grid))) {
            if (pyT((!pyT(pyIsInstance(row, "list"))))) {
                    continue;
            }
            for (const [c_idx, btn] of pyIter(pyEnumerate(row))) {
                    if (pyT((pyT(pyIsInstance(btn, "dict")) && pyT(pyStrip(pyStr(pyGet(btn, "text", ""))))))) {
                              pyAppend(out, [r_idx, c_idx, btn]);
                    }
            }
      }
  } catch (__e) {
  }
  return (out);
}

export async function render_kb_colors_panel(query, page) {
  if (page === undefined) page = (0);
  let btn, c_idx, dot, e, entries, keyboard, lines, msg;
  let nav, nm, off, page_entries, r_idx, start_n, total_pages;
  entries = _kb_color_entries();
  if (pyT((!pyT(entries)))) {
      void ((await query.answer("কোনো keyboard button নেই! আগে Add করুন।", { show_alert: true })));
      void ((await render_keyboard_settings_panel(query)));
      return;
  }
  total_pages = pyMax(1, pyDiv(((pyLen(entries) + KB_COLORS_PER_PAGE) - 1), KB_COLORS_PER_PAGE));
  try {
      page = pyInt(page);
  } catch (__e) {
      page = 0;
  }
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  page_entries = pySlice(entries, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, KB_COLORS_PER_PAGE) : (page * KB_COLORS_PER_PAGE))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), KB_COLORS_PER_PAGE) : ((page + 1) * KB_COLORS_PER_PAGE))), null);
  start_n = (((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, KB_COLORS_PER_PAGE) : (page * KB_COLORS_PER_PAGE))) + 1);
  lines = [];
  for (const [off, [r_idx, c_idx, btn]] of pyIter(pyEnumerate(page_entries))) {
      dot = pyGet(BUTTON_STYLE_DOT, (pyT(_kb_button_style(btn)) || pyT("none")), "⚪");
      nm = pySlice(pyStr(pyGet(btn, "text", "")), null, 30, null);
      pyAppend(lines, `${pyStr((start_n + off))}. ${pyStr(dot)} <b>${pyStr(pyHtmlEscape(nm))}</b> <i>(Row ${pyStr((r_idx + 1))})</i>`);
  }
  msg = (`🎨 <b>[ Keyboard Button Colors ]</b> (Page ${pyStr((page + 1))}/${pyStr(total_pages)})
━━━━━━━━━━━━━━━━━━━━
👇 Button-এ চাপ দিয়ে color বেছে নিন:

` + pyJoin("\n", lines));
  keyboard = [];
  for (const [r_idx, c_idx, btn] of pyIter(page_entries)) {
      dot = pyGet(BUTTON_STYLE_DOT, (pyT(_kb_button_style(btn)) || pyT("none")), "⚪");
      nm = pySlice(pyStr(pyGet(btn, "text", "?")), null, 24, null);
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(dot)} ${pyStr(nm)}`, { callback_data: `adm_kb_color_${pyStr(r_idx)}_${pyStr(c_idx)}_p${pyStr(page)}` })]);
  }
  nav = [];
  if (pyT(((page > 0)))) {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `adm_kb_colors_pg_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_kbcolor_pg" }));
  }
  pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_kbcolor_pg" }));
  if (pyT(((page < (total_pages - 1))))) {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `adm_kb_colors_pg_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_kbcolor_pg" }));
  }
  pyAppend(keyboard, nav);
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "adm_keyboard_settings" })]);
  try {
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } catch (e) {
      if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
            throw __e;
      }
  }
}

export let BTN_COLOR_GROUPS_PER_PAGE = 6;
export let BTN_COLOR_CUSTOMS_PER_PAGE = 6;
export let BTN_COLOR_CATS_PER_PAGE = 8;
export async function render_btncolor_cats_panel(query, page) {
    { const _k = __kw(page, ["page"]); if (_k) page = _k.page; }
    if ((page === undefined || page === null) || __isPlainObj(page)) page = 0;
  if (page === undefined) page = (0);
  let cats, dot, keyboard, nav, page_roots, r, roots, total_pages;
  roots = _btncolor_category_roots();
  if (pyT((!pyT(roots)))) {
      void ((await query.answer("কোনো category নেই!", { show_alert: true })));
      void ((await render_button_colors_panel(query)));
      return;
  }
  cats = (pyT(db.get_setting("category_colors", {  })) || pyT({  }));
  total_pages = pyMax(1, pyDiv(((pyLen(roots) + BTN_COLOR_CATS_PER_PAGE) - 1), BTN_COLOR_CATS_PER_PAGE));
  try {
      page = pyInt(page);
  } catch (__e) {
      page = 0;
  }
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  page_roots = pySlice(roots, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, BTN_COLOR_CATS_PER_PAGE) : (page * BTN_COLOR_CATS_PER_PAGE))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), BTN_COLOR_CATS_PER_PAGE) : ((page + 1) * BTN_COLOR_CATS_PER_PAGE))), null);
  keyboard = [];
  for (const r of pyIter(page_roots)) {
      dot = pyGet(BUTTON_STYLE_DOT, pyGet(cats, r), "⚪");
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(dot)} ${pyStr(r)}`, { callback_data: `adm_btncolor_cat_${pyStr(page)}_${pyStr(r)}` })]);
  }
  nav = [];
  if (pyT(((page > 0)))) {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `adm_btncolor_ctpg_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_btncolor_pg" }));
  }
  pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_btncolor_pg" }));
  if (pyT(((page < (total_pages - 1))))) {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `adm_btncolor_ctpg_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_btncolor_pg" }));
  }
  pyAppend(keyboard, nav);
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "adm_btn_colors" })]);
  void ((await query.edit_message_text(`📁 <b>Per-Category Colors</b> (Page ${pyStr((page + 1))}/${pyStr(total_pages)})
━━━━━━━━━━━━━━━━━━━━

👇 Category চাপ দিয়ে color বেছে নিন:`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_btncolor_custom_panel(query, page) {
    { const _k = __kw(page, ["page"]); if (_k) page = _k.page; }
    if ((page === undefined || page === null) || __isPlainObj(page)) page = 0;
  if (page === undefined) page = (0);
  let body, ci, customs, dot, keyboard, lines, msg, nav;
  let off, page_rules, r, rule, start_n, total_pages;
  try {
      customs = (pyT(db.get_setting("custom_button_colors", [])) || pyT([]));
  } catch (__e) {
      customs = [];
  }
  customs = ((() => { const __acc = []; for (const r of pyIter(customs)) { if (!pyT((pyT(pyIsInstance(r, "dict")) && pyT(pyStrip(pyStr(pyGet(r, "name", ""))))))) continue; __acc.push(r); } return __acc; })());
  total_pages = pyMax(1, pyDiv(((pyLen(customs) + BTN_COLOR_CUSTOMS_PER_PAGE) - 1), BTN_COLOR_CUSTOMS_PER_PAGE));
  try {
      page = pyInt(page);
  } catch (__e) {
      page = 0;
  }
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  page_rules = pySlice(customs, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, BTN_COLOR_CUSTOMS_PER_PAGE) : (page * BTN_COLOR_CUSTOMS_PER_PAGE))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), BTN_COLOR_CUSTOMS_PER_PAGE) : ((page + 1) * BTN_COLOR_CUSTOMS_PER_PAGE))), null);
  if (pyT(customs)) {
      start_n = (((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, BTN_COLOR_CUSTOMS_PER_PAGE) : (page * BTN_COLOR_CUSTOMS_PER_PAGE))) + 1);
      lines = [];
      for (const [off, rule] of pyIter(pyEnumerate(page_rules))) {
            dot = pyGet(BUTTON_STYLE_DOT, pyGet(rule, "style"), "⚪");
            pyAppend(lines, `${pyStr((start_n + off))}. ${pyStr(dot)} <b>${pyStr(pyHtmlEscape(pySlice(pyStr(pyGet(rule, "name", "")), null, 40, null)))}</b>`);
      }
      body = pyJoin("\n", lines);
  } else {
      body = "<i>কোনো custom rule নেই।</i>";
  }
  msg = `✏️ <b>[ Custom Names ]</b> (Page ${pyStr((page + 1))}/${pyStr(total_pages)})
━━━━━━━━━━━━━━━━━━━━
Button-এর নামে এই লেখা থাকলে color লাগবে:

${pyStr(body)}

👇 মুছতে rule-এ চাপুন:`;
  keyboard = [];
  pyAppend(keyboard, [InlineKeyboardButton("➕ Add Custom Name", { callback_data: "adm_btncolor_custom" })]);
  for (const [off, rule] of pyIter(pyEnumerate(page_rules))) {
      ci = (((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, BTN_COLOR_CUSTOMS_PER_PAGE) : (page * BTN_COLOR_CUSTOMS_PER_PAGE))) + off);
      dot = pyGet(BUTTON_STYLE_DOT, pyGet(rule, "style"), "⚪");
      pyAppend(keyboard, [InlineKeyboardButton(`✕ ${pyStr(dot)} ${pyStr(pySlice(pyStr(pyGet(rule, "name", "")), null, 28, null))}`, { callback_data: `adm_btncolor_cdel_${pyStr(ci)}_p${pyStr(page)}` })]);
  }
  nav = [];
  if (pyT(((page > 0)))) {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `adm_btncolor_cpg_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_btncolor_pg" }));
  }
  pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_btncolor_pg" }));
  if (pyT(((page < (total_pages - 1))))) {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `adm_btncolor_cpg_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_btncolor_pg" }));
  }
  pyAppend(keyboard, nav);
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "adm_btn_colors" })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export function get_fallback_template_text() {
  return (`🔍 **No courses or e-books found for '{query}'.**
[❖ Browse All Courses | browse_categories]
[➥ Admin Support | https://t.me/${pyStr(SUPPORT_USERNAME)}]`);
}

export function split_fallback_buttons(raw) {
  let body_lines, btn_pattern, line, rows, stripped, t, tg;
  btn_pattern = pyReCompile("\\[\\s*([^\\]|]+?)\\s*\\|\\s*([^\\]|]+?)\\s*\\]");
  [body_lines, rows] = [[], []];
  for (const line of pyIter(pySplit((pyT(raw) || pyT("")), "\n", -1))) {
      stripped = pyStrip(line);
      if (pyT((pyT(stripped) && pyT((pyEq(pyStrip(btn_pattern.sub("", stripped)), "")))))) {
            pyAppend(rows, ((() => { const __acc = []; for (const [t, tg] of pyIter(btn_pattern.findall(stripped))) { __acc.push([pyStrip(t), pyStrip(tg)]); } return __acc; })()));
      } else {
            pyAppend(body_lines, line);
      }
  }
  return ([pyRStrip(pyJoin("\n", body_lines)), rows]);
}

export function build_fallback_text(body, rows) {
  let cells, parts, row, t, tg;
  parts = [];
  if (pyT(pyStrip((pyT(body) || pyT(""))))) {
      pyAppend(parts, pyRStrip(body));
  }
  for (const row of pyIter((pyT(rows) || pyT([])))) {
      cells = ((() => { const __acc = []; for (const [t, tg] of pyIter(row)) { if (!pyT((pyT(t) && pyT(tg)))) continue; __acc.push(`[${pyStr(t)} | ${pyStr(tg)}]`); } return __acc; })());
      if (pyT(cells)) {
            pyAppend(parts, pyJoin(" ", cells));
      }
  }
  return (pyJoin("\n", parts));
}

export async function render_fallback_panel(query) {
  let body, btn_info, ii, is_custom, keyboard, msg_t, preview, r;
  let raw_fb, ri, row, rows, status, t, tg;
  raw_fb = (pyT(db.get_setting("fallback_message", "")) || pyT(""));
  is_custom = pyT(pyStrip(raw_fb));
  [body, rows] = split_fallback_buttons((pyT(is_custom) ? (raw_fb) : (get_fallback_template_text())));
  status = (pyT(is_custom) ? ("🟢 Custom") : ("⚪ Default"));
  preview = (pyT((pySlice(body, null, 400, null) + (pyT(((pyLen(body) > 400))) ? ("...") : ("")))) || pyT("(empty)"));
  if (pyT(rows)) {
      btn_info = pyJoin("\n", ((() => { const __acc = []; for (const row of pyIter(rows)) { __acc.push(("• " + pyJoin(" | ", ((() => { const __acc = []; for (const [t, tg] of pyIter(row)) { __acc.push(`[${pyStr(t)}]`); } return __acc; })())))); } return __acc; })()));
  } else {
      btn_info = "<i>কোনো button নেই (শুধু text দেখাবে)</i>";
  }
  msg_t = `🔄 <b>[ Fallback Message Manager ]</b>
━━━━━━━━━━━━━━━━━━━━
Search-এ কিছু না পেলে user এই message দেখে।

📌 <b>Status:</b> ${pyStr(status)}

📝 <b>Message Text:</b>
<blockquote>${pyStr(pyHtmlEscape(preview))}</blockquote>

🔘 <b>Buttons (${pyStr(pySum(((() => { const __acc = []; for (const r of pyIter(rows)) { __acc.push(pyLen(r)); } return __acc; })())))}):</b>
${pyStr(btn_info)}

👇 Manage:`;
  keyboard = [[InlineKeyboardButton("✏️ Edit Text", { callback_data: "adm_fallback_edittext" })], [InlineKeyboardButton("➕ Add Button", { callback_data: "adm_fallback_btnadd" })]];
  for (const [ri, row] of pyIter(pyEnumerate(rows))) {
      for (const [ii, [t, tg]] of pyIter(pyEnumerate(row))) {
            pyAppend(keyboard, [InlineKeyboardButton(`✕ ${pyStr(pySlice(t, null, 28, null))}`, { callback_data: `adm_fallback_btndel_${pyStr(ri)}_${pyStr(ii)}` })]);
      }
  }
  keyboard += [[InlineKeyboardButton("👁️ Preview (user view)", { callback_data: "adm_fallback_preview" })], [InlineKeyboardButton("🗑️ Reset to Default", { callback_data: "adm_resetmsg_fallback_message" })], [InlineKeyboardButton("⚙️ Bot Settings", { callback_data: "adm_bot_settings" })]];
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg_t, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await query.edit_message_text(msg_t, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function render_info_item_editor(query, item_key) {
  let cfg, content_preview, custom_content, enabled, header_disp, header_txt, item, keyboard;
  let label, media_disp, mfid, mode_str, msg, mtype, preview_disp, status_str;
  cfg = db.get_info_settings();
  item = pyGet(pyGet(cfg, "items", {  }), item_key, {  });
  label = (pyT(pyGet(item, "label")) || pyT(item_key));
  enabled = pyGet(item, "enabled", true);
  custom_content = pyStrip(pyGet(item, "content", ""));
  header_txt = pyStrip((pyT(pyGet(item, "header", "")) || pyT("")));
  mtype = pyLower(pyStr((pyT(pyGet(item, "media_type", "none")) || pyT("none"))));
  mfid = (pyT(pyGet(item, "media_file_id", "")) || pyT(""));
  if (pyT((pyT(((!pyContains(["photo", "animation"], mtype)))) || pyT((!pyT(mfid)))))) {
      mtype = "none";
  }
  status_str = (pyT(enabled) ? ("🟢 Enabled (ON)") : ("🔴 Disabled (OFF)"));
  if (pyT(custom_content)) {
      content_preview = custom_content;
      mode_str = "🟢 <b>Custom Text</b>";
  } else {
      content_preview = get_default_info_content(item_key);
      mode_str = "⚪ <b>Default Template</b>";
  }
  if (pyT(((pyLen(content_preview) > 500)))) {
      preview_disp = (pySlice(content_preview, null, 500, null) + "\n...(preview truncated)...");
  } else {
      preview_disp = content_preview;
  }
  header_disp = (pyT(header_txt) ? (`
✏️ <b>Header Text:</b> <code>${pyStr(pyHtmlEscape(pySlice(header_txt, null, 120, null)))}</code>`) : ("\n✏️ <b>Header Text:</b> <i>not set</i>"));
  if (pyT((pyEq(mtype, "photo")))) {
      media_disp = "🖼️ <b>Photo সেট করা আছে</b>";
  } else if (pyT((pyEq(mtype, "animation")))) {
      media_disp = "🎞️ <b>GIF সেট করা আছে</b>";
  } else {
      media_disp = "🔴 <i>কোনো ছবি/GIF নেই</i>";
  }
  msg = `ℹ️ <b>[ Info Section: ${pyStr(pyHtmlEscape(label))} ]</b>
━━━━━━━━━━━━━━━━━━━━
📌 <b>Visibility:</b> ${pyStr(status_str)}
📝 <b>Content Status:</b> ${pyStr(mode_str)}
${pyStr(header_disp)}
🖼️ <b>Photo/GIF:</b> ${pyStr(media_disp)}

📖 <b>Current Description / Text Preview:</b>
<blockquote>${pyStr(pyHtmlEscape(preview_disp))}</blockquote>

👇 <b>Choose an action:</b>`;
  keyboard = [[InlineKeyboardButton(`🔄 Toggle: ${pyStr((pyT(enabled) ? ("ON 🟢") : ("OFF 🔴")))}`, { callback_data: `adm_infotog_${pyStr(item_key)}` }), InlineKeyboardButton("✏️ Edit Description", { callback_data: `adm_infoedit_${pyStr(item_key)}` })], [InlineKeyboardButton("✏️ Edit Header", { callback_data: `adm_infoheader_${pyStr(item_key)}` }), InlineKeyboardButton("🖼️ Set Photo/GIF", { callback_data: `adm_infomedia_${pyStr(item_key)}` })]];
  if (pyT(((!pyEq(mtype, "none"))))) {
      pyAppend(keyboard, [InlineKeyboardButton("🗑️ Remove Photo/GIF", { callback_data: `adm_infomedia_rm_${pyStr(item_key)}` })]);
  }
  if (pyT(custom_content)) {
      pyAppend(keyboard, [InlineKeyboardButton("🔄 Reset to Default Template", { callback_data: `adm_inforeset_${pyStr(item_key)}` })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("« Back to Info Settings", { callback_data: "adm_info_buttons" })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function render_cinfo_editor(query, btn_id) {
  let btn, btype, content, enabled, header_disp, header_txt, keyboard, label;
  let media_disp, mfid, msg, mtype, preview_disp, status_str;
  btn = db.get_custom_info_button(btn_id);
  if (pyT((!pyT(btn)))) {
      void ((await query.answer("Button not found!", { show_alert: true })));
      void ((await render_info_buttons_panel(query)));
      return;
  }
  label = pyGet(btn, "label", "Button");
  enabled = pyGet(btn, "enabled", true);
  btype = pyGet(btn, "type", "text");
  content = pyStrip((pyT(pyGet(btn, "content", "")) || pyT("")));
  header_txt = pyStrip((pyT(pyGet(btn, "header", "")) || pyT("")));
  mtype = pyLower(pyStr((pyT(pyGet(btn, "media_type", "none")) || pyT("none"))));
  mfid = (pyT(pyGet(btn, "media_file_id", "")) || pyT(""));
  if (pyT((pyT(((!pyContains(["photo", "animation"], mtype)))) || pyT((!pyT(mfid)))))) {
      mtype = "none";
  }
  status_str = (pyT(enabled) ? ("🟢 Enabled (ON)") : ("🔴 Disabled (OFF)"));
  if (pyT(((pyLen(content) > 400)))) {
      preview_disp = (pySlice(content, null, 400, null) + "\n...(preview truncated)...");
  } else {
      preview_disp = (pyT(content) || pyT("(empty)"));
  }
  header_disp = (pyT(header_txt) ? (`
✏️ <b>Header Text:</b> <code>${pyStr(pyHtmlEscape(pySlice(header_txt, null, 120, null)))}</code>`) : ("\n✏️ <b>Header Text:</b> <i>not set</i>"));
  if (pyT((pyEq(mtype, "photo")))) {
      media_disp = "🖼️ <b>Photo সেট করা আছে</b>";
  } else if (pyT((pyEq(mtype, "animation")))) {
      media_disp = "🎞️ <b>GIF সেট করা আছে</b>";
  } else {
      media_disp = "🔴 <i>কোনো ছবি/GIF নেই</i>";
  }
  msg = `ℹ️ <b>[ Custom Button: ${pyStr(pyHtmlEscape(label))} ]</b>
━━━━━━━━━━━━━━━━━━━━
📌 <b>Visibility:</b> ${pyStr(status_str)}
🔗 <b>Type:</b> ${pyStr(pyHtmlEscape(btype))}
${pyStr(header_disp)}
🖼️ <b>Photo/GIF:</b> ${pyStr(media_disp)}

📖 <b>Description Preview:</b>
<blockquote>${pyStr(pyHtmlEscape(preview_disp))}</blockquote>

👇 <b>Choose an action:</b>`;
  keyboard = [[InlineKeyboardButton("✏️ Edit Label", { callback_data: `adm_cinfo_label_${pyStr(btn_id)}` }), InlineKeyboardButton("✏️ Edit Description", { callback_data: `adm_cinfo_desc_${pyStr(btn_id)}` })], [InlineKeyboardButton("✏️ Edit Header", { callback_data: `adm_cinfo_header_${pyStr(btn_id)}` }), InlineKeyboardButton("🖼️ Set Photo/GIF", { callback_data: `adm_cinfo_media_${pyStr(btn_id)}` })], [InlineKeyboardButton(`🔄 Toggle: ${pyStr((pyT(enabled) ? ("ON 🟢") : ("OFF 🔴")))}`, { callback_data: `adm_cinfo_tog_${pyStr(btn_id)}` })]];
  if (pyT(((!pyEq(mtype, "none"))))) {
      pyAppend(keyboard, [InlineKeyboardButton("🗑️ Remove Photo/GIF", { callback_data: `adm_cinfo_media_rm_${pyStr(btn_id)}` })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("« Back to Info Settings", { callback_data: "adm_info_buttons" })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function prompt_add_kb_row(query, context) {
  let buttons_grid, custom_kb, keyboard, r_idx;
  custom_kb = db.get_custom_keyboards();
  keyboard = [];
  pyAppend(keyboard, [InlineKeyboardButton("➕ New Row at Top", { callback_data: "adm_kb_row_new_top" })]);
  buttons_grid = pyGet(custom_kb, "buttons", []);
  for (const r_idx of pyIter(pyRange(pyLen(buttons_grid)))) {
      pyAppend(keyboard, [InlineKeyboardButton(`Row ${pyStr((r_idx + 1))}`, { callback_data: `adm_kb_row_${pyStr(r_idx)}` })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("➕ New Row at Bottom", { callback_data: "adm_kb_row_new_bottom" })]);
  pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_keyboard_settings" })]);
  void ((await query.edit_message_text("👇 <b>Choose which row to place the new button on:</b>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function prompt_add_hbtn_row(query, context) {
  let grid, keyboard, r_idx;
  grid = get_home_keyboard_grid();
  keyboard = [];
  pyAppend(keyboard, [InlineKeyboardButton("➕ New Row at Top", { callback_data: "adm_hbtn_row_new_top" })]);
  for (const r_idx of pyIter(pyRange(pyLen(grid)))) {
      pyAppend(keyboard, [InlineKeyboardButton(`Row ${pyStr((r_idx + 1))}`, { callback_data: `adm_hbtn_row_${pyStr(r_idx)}` })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("➕ New Row at Bottom", { callback_data: "adm_hbtn_row_new_bottom" })]);
  pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_home_buttons" })]);
  void ((await query.edit_message_text("👇 <b>Choose which row to place the new button on:</b>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_hbtn_edit_panel(query, context, r_idx, c_idx) {
  let btn, grid, keyboard, msg, status_marker;
  context.user_data["admin_edit_hbtn_coords"] = [r_idx, c_idx];
  grid = get_home_keyboard_grid();
  if (pyT((pyT(((r_idx >= pyLen(grid)))) || pyT(((c_idx >= pyLen(pySub(grid, r_idx)))))))) {
      void ((await query.answer("Button not found!")));
      void ((await render_home_buttons_panel(query)));
      return;
  }
  btn = pySub(pySub(grid, r_idx), c_idx);
  status_marker = (pyT(pyGet(btn, "enabled", true)) ? ("🟢 ON (Enabled)") : ("🔴 OFF (Disabled)"));
  msg = `✏️ <b>Modify Home Screen Button</b>
━━━━━━━━━━━━━━━━━━━━
• <b>Text:</b> <code>${pyStr(pyHtmlEscape(pySub(btn, "text")))}</code>
• <b>Action:</b> <code>${pyStr(pyHtmlEscape(pyGet(btn, "action", "")))}</code>
• <b>Status:</b> ${pyStr(status_marker)}
• <b>Position:</b> Row ${pyStr((r_idx + 1))}, Column ${pyStr((c_idx + 1))}

Choose what you want to edit:`;
  keyboard = [[InlineKeyboardButton("✏️ Edit Text", { callback_data: "adm_hbtn_edt_text" }), InlineKeyboardButton("🔗 Edit Action", { callback_data: "adm_hbtn_edt_action" })], [InlineKeyboardButton("↔️ Move Position", { callback_data: "adm_hbtn_edt_move" }), InlineKeyboardButton("🔄 Toggle ON/OFF", { callback_data: "adm_hbtn_edt_toggle" })], [InlineKeyboardButton("« Home Buttons Settings", { callback_data: "adm_home_buttons" })]];
  void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}


export async function render_kb_color_picker(query, context, r_idx, c_idx, back_page, back_to) {
  if (back_page === undefined) back_page = (0);
  if (back_to === undefined) back_to = ("colors");
  let back_cb, btn, cur, grid, keyboard, msg, nm;
  grid = pyGet(db.get_custom_keyboards(), "buttons", []);
  if (pyT((!pyT(pyIsInstance(grid, "list"))))) grid = [];
  btn = pySub(pySub(grid, r_idx), c_idx);
  if (pyT((( !pyT(btn) || !pyT(pyIsInstance(btn, "dict")) )))) {
      void ((await query.answer("❌ Button not found!", { show_alert: true })));
      void ((await render_kb_colors_panel(query, back_page)));
      return;
  }
  cur = (((__vpc) => (pyT(__vpc) ? __vpc : ("none")))(_kb_button_style(btn)));
  context.user_data["admin_kb_color_coords"] = [r_idx, c_idx];
  context.user_data["admin_kb_color_back"] = { page: back_page, to: back_to };
  nm = pySlice(pyStr(pyGet(btn, "text", "")), null, 40, null);
  back_cb = (pyT((pyEq(back_to, "colors"))) ? (`adm_kb_colors_pg_${pyStr(back_page)}`) : (`adm_kb_edit_btn_${pyStr(r_idx)}_${pyStr(c_idx)}`));
  msg = `🎨 <b>Color for ${pyStr(pyHtmlEscape(nm))}</b>\n━━━━━━━━━━━━━━━━━━━━\nCurrent: ${pyStr(pyGet(BUTTON_STYLE_DOT, cur, "⚪"))} ${pyStr(pyGet(BUTTON_STYLE_NAME, cur, "Default"))}\n\n👇 Pick color:`;
  keyboard = [[InlineKeyboardButton("🔵 Blue", { callback_data: "adm_kb_color_set_primary" })], [InlineKeyboardButton("🟢 Green", { callback_data: "adm_kb_color_set_success" })], [InlineKeyboardButton("🔴 Red", { callback_data: "adm_kb_color_set_danger" })], [InlineKeyboardButton("⚪ Default (no color)", { callback_data: "adm_kb_color_set_none" })], [InlineKeyboardButton("⬅️Back", { callback_data: back_cb })]];
  void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_admin_referrals_hub(query, context) {
  let bonus_amt, is_enabled, keyboard, msg, st_btn_text, st_text, stats;
  stats = db.get_referral_global_stats();
  is_enabled = pyGet(stats, "is_enabled", true);
  bonus_amt = pyGet(stats, "bonus_amount", 0);
  st_text = (pyT(is_enabled) ? ("🟢 Enabled (Active)") : ("🔴 Disabled (Paused)"));
  st_btn_text = (pyT(is_enabled) ? ("🔴 Pause Referral System") : ("🟢 Enable Referral System"));
  msg = `<blockquote>🎁 <b>[ Refer & Earn Management Hub ]</b></blockquote>\n\n<blockquote>⚙️ <b>System Settings:</b>\n• <b>System Status:</b> <b>${pyStr(st_text)}</b>\n• <b>Bonus Per Referral:</b> <code>৳${pyStr(bonus_amt)} BDT</code>\n• <b>Conversion Trigger:</b> <i>পেইড কোর্স অর্ডার অনুমোদন (Paid Purchase Approval)</i></blockquote>\n\n<blockquote>📊 <b>Global Referral Statistics:</b>\n• <b>Total Referrers:</b> <code>${pyStr(pyGet(stats, "total_referrers", 0))}</code> users\n• <b>Total Joined via Links:</b> <code>${pyStr(pyGet(stats, "total_joined", 0))}</code> students\n• <b>Successful Paid Referrals:</b> <code>${pyStr(pyGet(stats, "total_converted", 0))}</code> conversions\n• <b>Total Referral Bonus Paid:</b> <code>৳${pyStr(pyGet(stats, "total_paid_out", pyGet(stats, "total_withdrawn", 0)))} BDT</code>\n• <b>Total User Balance Held:</b> <code>৳${pyStr(pyGet(stats, "total_balance", 0))} BDT</code></blockquote>\n\n<blockquote>👇 <b>Admin Control Options:</b></blockquote>`;
  keyboard = [[InlineKeyboardButton(st_btn_text, { callback_data: "adm_tog_referral" })], [InlineKeyboardButton("💵 Set Bonus Amount", { callback_data: "adm_ref_set_bonus" })], [InlineKeyboardButton("📋 Referrers & Balances List", { callback_data: "adm_reflist_1" })], [InlineKeyboardButton("🔍 Search Referrals", { callback_data: "adm_ref_search" })], [InlineKeyboardButton("« Coupons & Rewards Hub", { callback_data: "adm_coupons" })]];
  void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_admin_referrers_list(query, context, page) {
  { const _k = __kw(page, ["page"]); if (_k) page = _k.page; }
  if ((page === undefined || page === null) || __isPlainObj(page)) page = 1;
  let bal, earn_st, keyboard, msg, nav_row, per_page, referrers, ref_c, total_count, total_pages, u, uid, uname;
  per_page = 8;
  [referrers, total_pages, total_count] = db.get_paginated_referrers(page, per_page);
  msg = `<blockquote>👥 <b>[ Referrers & Balances Leaderboard ]</b></blockquote>\n<blockquote>📌 <b>Total Referrers:</b> <code>${pyStr(total_count)}</code> | <b>Page:</b> <code>${pyStr(page)}/${pyStr(pyMax(1, total_pages))}</code></blockquote>\n\n`;
  if (pyT((!pyT(referrers)))) {
      msg += "<i>বর্তমানে কোনো রেফারেলের রেকর্ড নেই।</i>\n";
  }
  keyboard = [];
  for (const u of pyIter(referrers)) {
      uid = pySub(u, "user_id");
      uname = (((__vrl1) => (pyT(__vrl1) ? __vrl1 : (((__vrl2) => (pyT(__vrl2) ? __vrl2 : (`User ${pyStr(uid)}`)))(pyGet(u, "username")))))(pyGet(u, "full_name")));
      ref_c = pyGet(u, "referral_count", 0);
      bal = pyGet(u, "balance", 0);
      earn_st = (pyT(pyGet(u, "earnings_enabled")) ? ("🟢") : ("⚪"));
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(earn_st)} ${pyStr(pySlice(pyStr(uname), null, 15, null))} — 👥 ${pyStr(ref_c)} | 💰 ৳${pyStr(bal)}`, { callback_data: `adm_refuview_${pyStr(uid)}` })]);
  }
  nav_row = [];
  if (pyT(((page > 1)))) {
      pyAppend(nav_row, InlineKeyboardButton("⬅️ Prev", { callback_data: `adm_reflist_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav_row, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_reflist_page" }));
  }
  pyAppend(nav_row, InlineKeyboardButton(`Page ${pyStr(page)}/${pyStr(pyMax(1, total_pages))}`, { callback_data: "noop_reflist_page" }));
  if (pyT(((page < total_pages)))) {
      pyAppend(nav_row, InlineKeyboardButton("Next ➡️", { callback_data: `adm_reflist_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav_row, InlineKeyboardButton("Next ➡️", { callback_data: "noop_reflist_page" }));
  }
  pyAppend(keyboard, nav_row);
  pyAppend(keyboard, [InlineKeyboardButton("🔍 Search User", { callback_data: "adm_ref_search" }), InlineKeyboardButton("« Referrals Hub", { callback_data: "adm_referrals" })]);
  void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_admin_referral_user_view(query, context, user_id) {
  let bal, full_name, is_earn, item, joined_date, keyboard, msg, r_conv, r_name, r_uid, ref_by_text, ref_count, referred_by, referred_list, total_converted, total_joined, u, username;
  u = db.get_user(user_id);
  if (pyT((!pyT(u)))) {
      void ((await query.answer("User not found!", { show_alert: true })));
      return;
  }
  full_name = (((__vru1) => (pyT(__vru1) ? __vru1 : ("N/A")))(pyGet(u, "full_name")));
  username = (pyT(pyGet(u, "username")) ? (`@${pyStr(pyGet(u, "username"))}`) : ("N/A"));
  ref_count = pyGet(u, "referral_count", 0);
  bal = pyGet(u, "balance", 0);
  joined_date = pySlice(pyStr(pyGet(u, "joined_date", "")), null, 16, null);
  referred_by = pyGet(u, "referred_by");
  ref_by_text = (pyT(referred_by) ? (`<code>${pyStr(referred_by)}</code>`) : ("<i>Direct / None</i>"));
  is_earn = (pyT(pyGet(u, "earnings_enabled")) ? ("🟢 Enabled") : ("🔴 Disabled"));
  referred_list = pyGet(u, "referred_users", []);
  total_joined = pyLen(referred_list);
  total_converted = pySum(((() => { const __acc = []; for (const item of pyIter(referred_list)) { __acc.push((pyT(pyIsInstance(item, "dict")) && pyT(pyGet(item, "converted")) ? 1 : 0)); } return __acc; })()));
  msg = `<blockquote>👤 <b>[ User Referral Profile ]</b></blockquote>\n\n<blockquote>🆔 <b>User ID:</b> <code>${pyStr(user_id)}</code>\n👤 <b>Name:</b> <b>${pyStr(pyHtmlEscape(full_name))}</b>\n🔗 <b>Username:</b> ${pyStr(username)}\n📅 <b>Joined:</b> <code>${pyStr(joined_date)}</code>\n🤝 <b>Referred By:</b> ${pyStr(ref_by_text)}</blockquote>\n\n<blockquote>💰 <b>Referral & Wallet Stats:</b>\n• <b>Successful Paid Referrals:</b> <code>${pyStr(ref_count)}</code>\n• <b>Total Joined via Link:</b> <code>${pyStr(total_joined)}</code>\n• <b>Paid Conversions:</b> <code>${pyStr(total_converted)}</code>\n• <b>Current Wallet Balance:</b> <code>৳${pyStr(bal)} BDT</code>\n• <b>Cash Withdraw Permission:</b> <b>${pyStr(is_earn)}</b></blockquote>\n\n<blockquote>👥 <b>Referred Students List:</b></blockquote>`;
  if (pyT((!pyT(referred_list)))) {
      msg += "\n<i>এই ইউজারের লিংকে এখনও কেউ জয়েন করেনি।</i>";
  } else {
      let _idx = 0;
      for (const ref_item of pyIter(pySlice(referred_list, -8, null, null))) {
          _idx += 1;
          if (pyT(pyIsInstance(ref_item, "dict"))) {
              r_uid = pyGet(ref_item, "user_id");
              r_name = (((__vru2) => (pyT(__vru2) ? __vru2 : (pyStr(r_uid))))(pyGet(ref_item, "full_name") || pyGet(ref_item, "username")));
              r_conv = (pyT(pyGet(ref_item, "converted")) ? ("🟢 Paid") : ("🟡 Joined"));
              msg += `\n${pyStr(_idx)}. <b>${pyStr(pyHtmlEscape(r_name))}</b> (<code>${pyStr(r_uid)}</code>) — ${pyStr(r_conv)}`;
          } else {
              msg += `\n${pyStr(_idx)}. <code>${pyStr(ref_item)}</code>`;
          }
      }
  }
  keyboard = [[InlineKeyboardButton("👤 Open Full User Profile", { callback_data: `adm_uview_${pyStr(user_id)}` })], [InlineKeyboardButton("📋 Back to Referrers List", { callback_data: "adm_reflist_1" }), InlineKeyboardButton("« Referrals Hub", { callback_data: "adm_referrals" })]];
  void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_button_edit_panel(query, context, r_idx, c_idx) {
  let adm_marker, btn, color_marker, custom_kb, keyboard, msg, _cur;
  custom_kb = db.get_custom_keyboards();
  btn = pySub(pySub(pyGet(custom_kb, "buttons", []), r_idx), c_idx);
  if (pyT((( !pyT(btn) || !pyT(pyIsInstance(btn, "dict")) )))) {
      void ((await query.answer("❌ Button not found!", { show_alert: true })));
      return;
  }
  adm_marker = (pyT(pyGet(btn, "admin_only")) ? ("🟢 Yes (Admins Only)") : ("🔴 No (All Users)"));
  _cur = (((__vbe) => (pyT(__vbe) ? __vbe : ("none")))(_kb_button_style(btn)));
  color_marker = `${pyStr(pyGet(BUTTON_STYLE_DOT, _cur, "⚪"))} ${pyStr(pyGet(BUTTON_STYLE_NAME, _cur, "Default"))}`;
  msg = `✏️ <b>Modify Keyboard Button</b>\n━━━━━━━━━━━━━━━━━━━━\n• <b>Text:</b> <code>${pyStr(pyHtmlEscape(pySub(btn, "text")))}</code>\n• <b>Action:</b> <code>${pyStr(pyHtmlEscape(pyGet(btn, "action", "")))}</code>\n• <b>Admin Only:</b> ${pyStr(adm_marker)}\n• <b>Color:</b> ${pyStr(color_marker)}\n• <b>Position:</b> Row ${pyStr((r_idx + 1))}, Column ${pyStr((c_idx + 1))}\n\nChoose what you want to edit:`;
  keyboard = [[InlineKeyboardButton("✏️ Edit Text", { callback_data: "adm_kb_edt_text" }), InlineKeyboardButton("🔗 Edit Action", { callback_data: "adm_kb_edt_action" })], [InlineKeyboardButton("↔️ Move Position", { callback_data: "adm_kb_edt_move" }), InlineKeyboardButton("👑 Toggle Admin-Only", { callback_data: "adm_kb_edt_adm" })], [InlineKeyboardButton("🎨 Edit Color", { callback_data: "adm_kb_edt_color" })], [InlineKeyboardButton("« Keyboard Settings", { callback_data: "adm_keyboard_settings" })]];
  void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_home_buttons_panel(query) {
  let btn, c_idx, grid, keyboard, msg, r_idx, row_str, status;
  grid = get_home_keyboard_grid();
  msg = "🏡 <b>Home Screen Inline Buttons Settings</b>\n━━━━━━━━━━━━━━━━━━━━\nHere is the current home inline buttons layout. (🟢 = Enabled / 🔴 = Disabled)\n\n";
  for (const [r_idx, row] of pyIter(pyEnumerate(grid))) {
      row_str = [];
      for (const [c_idx, btn] of pyIter(pyEnumerate(row))) {
          status = (pyT(pyGet(btn, "enabled", true)) ? ("🟢") : ("🔴"));
          pyAppend(row_str, `${pyStr(status)} <code>[${pyStr(pyHtmlEscape(pySub(btn, "text")))} -> ${pyStr(pyHtmlEscape(pyGet(btn, "action", "")))}]</code>`);
      }
      msg += `<b>Row ${pyStr((r_idx + 1))}:</b> ${pyStr(pyJoin(" | ", row_str))}\n`;
  }
  if (pyT((!pyT(grid)))) {
      msg += "<i>No buttons configured.</i>\n";
  }
  msg += "\n👇 Select an operation below:";
  keyboard = [[InlineKeyboardButton("➕ Add Button", { callback_data: "adm_hbtn_add" }), InlineKeyboardButton("🗑️ Delete Button", { callback_data: "adm_hbtn_del_list" })], [InlineKeyboardButton("✏️ Modify Button", { callback_data: "adm_hbtn_edit_list" }), InlineKeyboardButton("📐 Resize Columns", { callback_data: "adm_hbtn_resize_prompt" })], [InlineKeyboardButton("« Bot Settings", { callback_data: "adm_bot_settings" })]];
  void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_info_buttons_panel(query) {
  let b, cfg, content_status_fn, custom_btns, custom_str, header_media_status, header_preview, header_txt, hm_fid, hm_type, items, keyboard, msg, status_icon_fn;
  cfg = db.get_info_settings();
  items = pyGet(cfg, "items", {});
  custom_btns = pyGet(cfg, "custom_buttons", []);
  header_txt = pyGet(cfg, "header_text", "");
  if (pyT(((pyLen(header_txt) > 40)))) {
      header_preview = (pyReplace(pySlice(header_txt, null, 40, null), "\n", " ") + "...");
  } else {
      header_preview = pyReplace(header_txt, "\n", " ");
  }
  status_icon_fn = ((key) => ((pyT(pyGet(pyGet(items, key, {}), "enabled", true))) ? ("🟢") : ("🔴")));
  content_status_fn = ((key) => ((pyT(pyStrip(pyStr(pyGet(pyGet(items, key, {}), "content", ""))))) ? ("✏️ Custom") : ("📄 Default")));
  custom_str = "";
  if (pyT(custom_btns)) {
      const _cflags = ((bb) => { let f = ""; if (pyT(pyStrip(pyStr(pyGet(bb, "header", ""))))) f += " 📝H"; const mt = pyLower(pyStr(pyGet(bb, "media_type", "none") || "none")); if (pyT(pyContains(["photo", "animation"], mt)) && pyT(pyGet(bb, "media_file_id", ""))) f += " 🖼️"; return f; });
      custom_str = ("\n<b>Custom Buttons:</b>\n" + pyJoin("\n", ((() => { const __acc = []; for (const b of pyIter(custom_btns)) { __acc.push(`• ${pyStr(pyHtmlEscape(pySub(b, "label")))} [${pyStr((pyT(pyGet(b, "enabled", true)) ? ("🟢 ON") : ("🔴 OFF")))}]${pyStr(_cflags(b))}`); } return __acc; })())) + "\n");
  }
  try {
      [hm_type, hm_fid] = db.get_info_header_media();
  } catch (__e) {
      hm_type = "none"; hm_fid = "";
  }
  if (pyT((pyEq(hm_type, "photo")))) {
      header_media_status = "🖼️ <b>Photo সেট করা আছে</b>";
  } else if (pyT((pyEq(hm_type, "animation")))) {
      header_media_status = "🎞️ <b>GIF সেট করা আছে</b>";
  } else {
      header_media_status = "🔴 <i>কোনো ছবি/GIF নেই</i>";
  }
  msg = `ℹ️ <b>[ Info Button & Description Settings ]</b>\n━━━━━━━━━━━━━━━━━━━━\nManage the buttons, visibility, and text descriptions of the <b>ℹ Info</b> menu:\n\n<b>Menu Sections & Current Status:</b>\n• 💬 Contact Support: ${pyStr(status_icon_fn("contact"))} [${pyStr(content_status_fn("contact"))}]\n• 📖 How to Buy: ${pyStr(status_icon_fn("how_to_buy"))} [${pyStr(content_status_fn("how_to_buy"))}]\n• 🎓 About StudyMart: ${pyStr(status_icon_fn("about"))} [${pyStr(content_status_fn("about"))}]\n• 📜 Terms & Policy: ${pyStr(status_icon_fn("terms"))} [${pyStr(content_status_fn("terms"))}]\n${pyStr(custom_str)}\n<b>Header Text Preview:</b>\n↳ <code>${pyStr(pyHtmlEscape(header_preview))}</code>\n\n🖼️ <b>Header Photo/GIF:</b>\n${pyStr(header_media_status)}\n\n👇 <b>Click any section below to edit its text description or toggle ON/OFF:</b>`;
  keyboard = [[InlineKeyboardButton(`${pyStr(status_icon_fn("contact"))} 💬 Contact Support`, { callback_data: "adm_infoitem_contact" }), InlineKeyboardButton(`${pyStr(status_icon_fn("how_to_buy"))} 📖 How to Buy`, { callback_data: "adm_infoitem_how_to_buy" })], [InlineKeyboardButton(`${pyStr(status_icon_fn("about"))} 🎓 About StudyMart`, { callback_data: "adm_infoitem_about" }), InlineKeyboardButton(`${pyStr(status_icon_fn("terms"))} 📜 Terms & Policy`, { callback_data: "adm_infoitem_terms" })], [InlineKeyboardButton("➕ Add Custom Button", { callback_data: "adm_infobtn_add" }), InlineKeyboardButton("✏️ Edit Header Text", { callback_data: "adm_editmsg_info_message" })], [InlineKeyboardButton("🖼️ Header Photo/GIF", { callback_data: "adm_info_media_upload" })]];
  if (pyT(pyContains(["photo", "animation"], hm_type)) && pyT(hm_fid)) {
      pyAppend(keyboard, [InlineKeyboardButton("🗑️ Remove Header Photo", { callback_data: "adm_info_media_remove" })]);
  }
  if (pyT(custom_btns)) {
      pyAppend(keyboard, [InlineKeyboardButton("🗑️ Delete Custom Button", { callback_data: "adm_infobtn_del_list" })]);
      pyAppend(keyboard, [InlineKeyboardButton("✏️ Edit Custom Button", { callback_data: "adm_cinfo_edit_list" })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("« Bot Settings", { callback_data: "adm_bot_settings" }), InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
          void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function render_button_colors_panel(query, page) {
  { const _k = __kw(page, ["page"]); if (_k) page = _k.page; }
  if ((page === undefined || page === null) || __isPlainObj(page)) page = 0;
  let cats, customs, g, grp, keyboard, lines, msg, n_cat, nav, page_groups, total_pages, v;
  const _g = ((gid) => { v = pyGet(groups, gid, pyGet(BUTTON_COLOR_DEFAULTS, gid, "none")); return (pyContains(["primary", "success", "danger"], v) ? v : "none"); });
  let groups = db.get_setting("button_color_groups", {});
  if (pyT((!pyT(groups)))) groups = {};
  cats = db.get_setting("category_colors", {});
  if (pyT((!pyT(cats)))) cats = {};
  total_pages = pyMax(1, pyDiv((pyLen(BUTTON_COLOR_GROUPS) + BTN_COLOR_GROUPS_PER_PAGE - 1), BTN_COLOR_GROUPS_PER_PAGE));
  try {
      page = pyInt(page);
  } catch (__e) {
      page = 0;
  }
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  page_groups = pySlice(BUTTON_COLOR_GROUPS, (page * BTN_COLOR_GROUPS_PER_PAGE), ((page + 1) * BTN_COLOR_GROUPS_PER_PAGE), null);
  lines = [];
  for (const grp of pyIter(page_groups)) {
      pyAppend(lines, `${pyStr(pyGet(BUTTON_STYLE_DOT, _g(pySub(grp, "id"))))} <b>${pyStr(pyHtmlEscape(pySub(grp, "label")))}</b>\n  <i>${pyStr(pyHtmlEscape(pyGet(grp, "details", "")))}</i>`);
  }
  n_cat = pySum(((() => { const __acc = []; for (const v of pyIter(pyValues(cats))) { __acc.push((pyContains(["primary", "success", "danger"], v) ? 1 : 0)); } return __acc; })()));
  try {
      customs = db.get_setting("custom_button_colors", []);
  } catch (__e) {
      customs = [];
  }
  if (pyT((!pyT(pyIsInstance(customs, "list"))))) customs = [];
  customs = ((() => { const __acc = []; for (const r of pyIter(customs)) { if (!pyT(pyIsInstance(r, "dict") && pyStrip(pyStr(pyGet(r, "name", ""))))) continue; __acc.push(r); } return __acc; })());
  msg = `🎨 <b>[ Button Colors ]</b> (Page ${pyStr((page + 1))}/${pyStr(total_pages)})\n━━━━━━━━━━━━━━━━━━━━\n👇 Group-এ চাপ দিলে details + color choice আসবে:\n\n${pyStr(pyJoin("\n", lines))}\n\n📁 <b>Per-Category Colors:</b> ${pyStr(n_cat)} set\n✏️ <b>Custom Names:</b> ${pyStr(pyLen(customs))} set`;
  keyboard = [];
  for (const grp of pyIter(page_groups)) {
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(pyGet(BUTTON_STYLE_DOT, _g(pySub(grp, "id"))))} ${pyStr(pySub(grp, "label"))}`, { callback_data: `adm_btncolor_grp_${pyStr(pySub(grp, "id"))}` })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("📁 Per-Category", { callback_data: "adm_btncolor_cats" }), InlineKeyboardButton("✏️ Custom Names", { callback_data: "adm_btncolor_customs" })]);
  nav = [];
  if (pyT(((page > 0)))) {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `adm_btncolor_pg_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_btncolor_pg" }));
  }
  pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_btncolor_pg" }));
  if (pyT(((page < (total_pages - 1))))) {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `adm_btncolor_pg_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_btncolor_pg" }));
  }
  pyAppend(keyboard, nav);
  pyAppend(keyboard, [InlineKeyboardButton("⚙️ Bot Settings", { callback_data: "adm_bot_settings" }), InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
          void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export function check_admin_callback_permission(user_id, data) {
  if (pyT(db.is_super_admin(user_id))) {
      return ([true, ""]);
  }
  if (pyT((pyT(pyStart(data, "adm_course")) || pyT(pyStart(data, "adm_dir_")) || pyT(pyStart(data, "adm_fld_addcourse")) || pyT(pyStart(data, "adm_list_courses")) || pyT(pyStart(data, "adm_edit_")) || pyT(pyStart(data, "adm_edmenu_")) || pyT(pyStart(data, "adm_delcourse_")) || pyT(pyStart(data, "edprop_")) || pyT(pyStart(data, "adm_pub_course")) || pyT(pyStart(data, "adm_cancel_course")) || pyT(pyStart(data, "adm_skip_"))))) {
      if (pyT((!pyT(db.has_permission(user_id, "course_manage"))))) {
            return ([false, "Course Management"]);
      }
  }
  if (pyT((pyT(pyStart(data, "adm_ebook")) || pyT(pyStart(data, "adm_ebdir_")) || pyT(pyStart(data, "adm_ebfld_addebook")) || pyT(pyStart(data, "adm_list_ebooks")) || pyT(pyStart(data, "adm_editeb_")) || pyT(pyStart(data, "adm_publisheb")) || pyT(pyStart(data, "adm_deleb_")) || pyT(pyStart(data, "adm_vieweb_")) || pyT(pyStart(data, "adm_eb_toggle_")) || pyT(pyStart(data, "adm_ebmove_")) || pyT(pyStart(data, "adm_addebook_dir_")) || pyT(pyStart(data, "adm_skipeb_")) || pyT(pyStart(data, "adm_cancel_ebook"))))) {
      if (pyT((!pyT(db.has_permission(user_id, "ebook_manage"))))) {
            return ([false, "E-Book Management"]);
      }
  }
  if (pyT((pyT(pyStart(data, "adm_categories")) || pyT(pyStart(data, "adm_catm_")) || pyT(pyStart(data, "adm_subcatm_")) || pyT(pyStart(data, "adm_fld_")) || pyT(pyStart(data, "adm_ebfld_")) || pyT(pyStart(data, "adm_delcat_")) || pyT(pyStart(data, "adm_delsub_"))))) {
      if (pyT((!pyT(db.has_permission(user_id, "category_manage"))))) {
            return ([false, "Category Management"]);
      }
  }
  if (pyT((pyT(pyStart(data, "adm_pending_orders")) || pyT(pyStart(data, "adm_all_orders")) || pyT(pyStart(data, "adm_porders_")) || pyT(pyStart(data, "adm_aorders_")) || pyT(pyStart(data, "ordinfo_")) || pyT(pyStart(data, "approve_")) || pyT(pyStart(data, "reject_")) || pyT(pyStart(data, "adm_order_search"))))) {
      if (pyT((!pyT(db.has_permission(user_id, "orders"))))) {
            return ([false, "Order Management"]);
      }
  }
  if (pyT((pyT(pyStart(data, "adm_coupon")) || pyT(pyStart(data, "adm_add_coupon")) || pyT(pyStart(data, "adm_list_coupon")) || pyT(pyStart(data, "adm_view_coupon_")) || pyT(pyStart(data, "adm_del_coupon_")) || pyT(pyStart(data, "adm_delcoupon_")) || pyT(pyStart(data, "adm_tog_coupon_")) || pyT(pyStart(data, "adm_toggle_coupon_")) || pyT(pyStart(data, "adm_pulimit_")) || pyT(pyStart(data, "cpnwiz_")) || pyT(pyStart(data, "adm_referrals")) || pyT(pyStart(data, "adm_tog_referral")) || pyT(pyStart(data, "adm_reflist_")) || pyT(pyStart(data, "adm_refuview_")) || pyT(pyStart(data, "adm_ref_search")) || pyT(pyStart(data, "adm_ref_set_bonus"))))) {
      if (pyT((!pyT((pyT(db.has_permission(user_id, "coupon")) || pyT(db.has_permission(user_id, "user_manage"))))))) {
            return ([false, "Coupon & Referral Management"]);
      }
  }
  if (pyT((pyT(pyStart(data, "adm_payments")) || pyT(pyStart(data, "adm_withdrawals")) || pyT(pyStart(data, "adm_wdr_")) || pyT(pyStart(data, "adm_paym_")) || pyT(pyStart(data, "adm_pedit_")) || pyT(pyStart(data, "adm_add_paym")) || pyT(pyStart(data, "adm_edit_paynote")) || pyT(pyStart(data, "adm_del_paynote")) || pyT(pyStart(data, "wdrinfo_")) || pyT(pyStart(data, "apprwdr_")) || pyT(pyStart(data, "rejwdr_"))))) {
      if (pyT((!pyT(db.has_permission(user_id, "payment_settings"))))) {
            return ([false, "Payment Settings & Withdrawals"]);
      }
  }
  if (pyT((pyT(pyStart(data, "adm_broadcast")) || pyT(pyStart(data, "adm_bc_")) || pyT(pyStart(data, "bc_sel_"))))) {
      if (pyT((!pyT(db.has_permission(user_id, "broadcast"))))) {
            return ([false, "Broadcast Notice"]);
      }
  }
  if (pyT((pyT(pyStart(data, "adm_admin_list")) || pyT(pyStart(data, "adm_add_admin")) || pyT(pyStart(data, "adm_rm_admin_menu")) || pyT(pyStart(data, "adm_rmadmin_")) || pyT(pyStart(data, "adm_makeadmin_"))))) {
      if (pyT((!pyT(db.has_permission(user_id, "admin_manage"))))) {
            return ([false, "Admin Management"]);
      }
  }
  if (pyT((pyT(pyStart(data, "adm_perm_")) || pyT(pyStart(data, "adm_togperm_"))))) {
      if (pyT((!pyT(db.has_permission(user_id, "admin_permission"))))) {
            return ([false, "Admin Permissions"]);
      }
  }
  if (pyT(pyStart(data, "adm_stats"))) {
      if (pyT((!pyT(db.has_permission(user_id, "statistics"))))) {
            return ([false, "Statistics"]);
      }
  }
  if (pyT((pyT(pyStart(data, "adm_bot_settings")) || pyT(pyStart(data, "adm_keyboard_settings")) || pyT(pyStart(data, "adm_home_buttons")) || pyT(pyStart(data, "adm_toggle_maintenance")) || pyT(pyStart(data, "adm_toggle_home_btn")) || pyT(pyStart(data, "adm_toggle_view_all_courses")) || pyT(pyStart(data, "adm_catrow_")) || pyT(pyStart(data, "adm_subrow_")) || pyT(pyStart(data, "adm_welcome_media_")) || pyT(pyStart(data, "adm_cart_")) || pyT(pyStart(data, "adm_editmsg_")) || pyT(pyStart(data, "adm_resetmsg_")) || pyT(pyStart(data, "adm_kb_")) || pyT(pyStart(data, "adm_hbtn_")) || pyT(pyStart(data, "adm_info"))))) {
      if (pyT((!pyT(db.has_permission(user_id, "bot_settings"))))) {
            return ([false, "Bot Settings"]);
      }
  }
  if (pyT((pyT(pyStart(data, "adm_users")) || pyT(pyStart(data, "adm_userlist_")) || pyT(pyStart(data, "adm_user_search")) || pyT(pyStart(data, "adm_uview_")) || pyT(pyStart(data, "adm_ubal_")) || pyT(pyStart(data, "adm_utogearn_")) || pyT(pyStart(data, "adm_ucourse_")) || pyT(pyStart(data, "adm_ugrant_")) || pyT(pyStart(data, "adm_urevoke_")) || pyT(pyStart(data, "adm_uebook_")) || pyT(pyStart(data, "adm_uebgrant_")) || pyT(pyStart(data, "adm_uebrevoke_")) || pyT(pyStart(data, "adm_udm_")) || pyT(pyStart(data, "adm_ban_")) || pyT(pyStart(data, "adm_unban_"))))) {
      if (pyT((!pyT((pyT(db.has_permission(user_id, "user_manage")) || pyT(db.has_permission(user_id, "admin_manage")) || pyT(db.has_permission(user_id, "admin_permission"))))))) {
            return ([false, "User Management"]);
      }
  }
  return ([true, ""]);
}

export function get_coupon_scope_desc(c, default_all) {
  { const _k = __kw(default_all, ["default_all"]); if (_k) default_all = _k.default_all; }
  if ((default_all === undefined) || __isPlainObj(default_all)) default_all = ("🌐 All Courses");
  let c_ids, c_names, i, kind, label, more, n, n_eb;
  let nm, shown;
  c_ids = (pyT(pyGet(c, "applicable_course_ids")) || pyT((pyT(pyGet(c, "applicable_course_id")) ? ([pyGet(c, "applicable_course_id")]) : ([]))));
  c_names = (pyT(pyGet(c, "applicable_course_names")) || pyT((pyT(pyGet(c, "applicable_course_name")) ? ([pyGet(c, "applicable_course_name")]) : ([]))));
  n_eb = pySum(((() => { const __acc = []; for (const i of pyIter(c_ids)) { if (!pyT(pyStart(pyStr(i), "EB-"))) continue; __acc.push(1); } return __acc; })()));
  kind = (pyT((pyT(n_eb) && pyT((pyEq(n_eb, pyLen(c_ids)))))) ? ("E-Books") : ((pyT(n_eb) ? ("Items") : ("Courses"))));
  if (pyT(((pyLen(c_ids) > 1)))) {
      shown = (pyT(c_names) ? (pyJoin(", ", ((() => { const __acc = []; for (const n of pyIter(pySlice(c_names, null, 3, null))) { __acc.push(`\`${pyStr(pySlice(n, null, 18, null))}\``); } return __acc; })()))) : (`${pyStr(pyLen(c_ids))} items`));
      more = (pyT(((pyLen(c_ids) > 3))) ? (` +${pyStr((pyLen(c_ids) - 3))} more`) : (""));
      return (`🎯 Specific ${pyStr(kind)} (${pyStr(pyLen(c_ids))}): ${pyStr(shown)}${pyStr(more)}`);
  }
  if (pyT((pyEq(pyLen(c_ids), 1)))) {
      nm = (pyT(c_names) ? (pySub(c_names, 0)) : ((pyT(pyGet(c, "applicable_course_name")) || pyT("Specific Item"))));
      label = (pyT(n_eb) ? ("E-Book") : ("Course"));
      return (`🎯 Specific ${pyStr(label)}: \`${pyStr(nm)}\``);
  }
  if (pyT((pyT(pyGet(c, "applicable_category")) && pyT(((!pyContains(["All", "Specific"], pySub(c, "applicable_category")))))))) {
      return (`📂 Category: \`${pyStr(pySub(c, "applicable_category"))}\``);
  }
  return (default_all);
}

export async function render_coupon_course_select_page(query, page, context) {
    { const _k = __kw(page, ["page", "context"]); if (_k) { if ("page" in _k) page = _k.page; if ("context" in _k) context = _k.context; } }
    if ((page === undefined || page === null) || __isPlainObj(page)) page = 1;
  if (page === undefined) page = (1);
  if (context === undefined) context = (null);
  let c, cid, courses, keyboard, mark, nav_row, page_courses, page_str;
  let per_page, sel_count, sel_str, selected_ids, start_idx, total_items, total_pages, wiz;
  courses = pyList(pyItems(db.get_all_courses()));
  if (pyT((!pyT(courses)))) {
      void ((await query.edit_message_text("❌ No courses available to select.", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_coupons" })]]) })));
      return;
  }
  total_items = pyLen(courses);
  per_page = 6;
  total_pages = pyMax(1, pyDiv(((total_items + per_page) - 1), per_page));
  page = pyMax(1, pyMin(page, total_pages));
  if (pyT(((!(context === null || context === undefined))))) {
      context.user_data["wiz_coupon_page"] = page;
      wiz = pyGet(context.user_data, "wiz_coupon", {  });
      selected_ids = (pyT(pyGet(wiz, "applicable_course_ids", [])) || pyT([]));
      if (pyT((pyT(pyGet(wiz, "applicable_course_id")) && pyT(((!pyContains(selected_ids, pyGet(wiz, "applicable_course_id")))))))) {
            selected_ids = (selected_ids + [pyGet(wiz, "applicable_course_id")]);
      }
  } else {
      selected_ids = [];
  }
  start_idx = ((typeof (page - 1) === 'string' || Array.isArray((page - 1)) ? pyRepeat((page - 1), per_page) : ((page - 1) * per_page)));
  page_courses = pySlice(courses, start_idx, (start_idx + per_page), null);
  keyboard = [];
  for (const [cid, c] of pyIter(page_courses)) {
      mark = (pyT((pyContains(selected_ids, cid))) ? ("✅ ") : (""));
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(mark)}${pyStr(pySlice(pySub(c, "name"), null, 28, null))}`, { callback_data: `cpnwiz_course_${pyStr(cid)}` })]);
  }
  nav_row = [];
  if (pyT(((page > 1)))) {
      pyAppend(nav_row, InlineKeyboardButton("⬅️ Prev", { callback_data: `cpnwiz_scope_course_pg_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav_row, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_wizcourse_page" }));
  }
  pyAppend(nav_row, InlineKeyboardButton(`Page ${pyStr(page)}/${pyStr(total_pages)}`, { callback_data: "noop_wizcourse_page" }));
  if (pyT(((page < total_pages)))) {
      pyAppend(nav_row, InlineKeyboardButton("Next ➡️", { callback_data: `cpnwiz_scope_course_pg_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav_row, InlineKeyboardButton("Next ➡️", { callback_data: "noop_wizcourse_page" }));
  }
  pyAppend(keyboard, nav_row);
  sel_count = pyLen(selected_ids);
  pyAppend(keyboard, [InlineKeyboardButton(`✅ Done (${pyStr(sel_count)} selected)`, { callback_data: "cpnwiz_courses_done" })]);
  if (pyT(((sel_count > 0)))) {
      pyAppend(keyboard, [InlineKeyboardButton("🧹 Clear Selection", { callback_data: "cpnwiz_courses_clear" })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_coupons" })]);
  page_str = ` (Page ${pyStr(page)}/${pyStr(total_pages)})`;
  sel_str = (pyT(sel_count) ? (`
✅ Selected: ${pyStr(sel_count)} course(s). Tap to select/unselect, then press Done.`) : ("\n👉 Tap courses to select (multiple allowed), then press Done."));
  void ((await query.edit_message_text(`🎯 **Choose specific courses${pyStr(page_str)}:**${pyStr(sel_str)}`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_coupon_ebook_select_page(query, page, context) {
    { const _k = __kw(page, ["page", "context"]); if (_k) { if ("page" in _k) page = _k.page; if ("context" in _k) context = _k.context; } }
    if ((page === undefined || page === null) || __isPlainObj(page)) page = 1;
  if (page === undefined) page = (1);
  if (context === undefined) context = (null);
  let eb, ebooks, eid, keyboard, mark, nav_row, page_ebooks, page_str;
  let per_page, sel_count, sel_str, selected_ids, start_idx, total_items, total_pages, wiz;
  ebooks = pyList(pyItems(db.get_all_ebooks()));
  if (pyT((!pyT(ebooks)))) {
      void ((await query.edit_message_text("❌ No e-books available to select.", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_coupons" })]]) })));
      return;
  }
  total_items = pyLen(ebooks);
  per_page = 6;
  total_pages = pyMax(1, pyDiv(((total_items + per_page) - 1), per_page));
  page = pyMax(1, pyMin(page, total_pages));
  if (pyT(((!(context === null || context === undefined))))) {
      context.user_data["wiz_coupon_page"] = page;
      wiz = pyGet(context.user_data, "wiz_coupon", {  });
      selected_ids = (pyT(pyGet(wiz, "applicable_course_ids", [])) || pyT([]));
      if (pyT((pyT(pyGet(wiz, "applicable_course_id")) && pyT(((!pyContains(selected_ids, pyGet(wiz, "applicable_course_id")))))))) {
            selected_ids = (selected_ids + [pyGet(wiz, "applicable_course_id")]);
      }
  } else {
      selected_ids = [];
  }
  start_idx = ((typeof (page - 1) === 'string' || Array.isArray((page - 1)) ? pyRepeat((page - 1), per_page) : ((page - 1) * per_page)));
  page_ebooks = pySlice(ebooks, start_idx, (start_idx + per_page), null);
  keyboard = [];
  for (const [eid, eb] of pyIter(page_ebooks)) {
      mark = (pyT((pyContains(selected_ids, eid))) ? ("✅ ") : (""));
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(mark)}${pyStr(pySlice(pyGet(eb, "name", eid), null, 28, null))}`, { callback_data: `cpnwiz_ebook_${pyStr(eid)}` })]);
  }
  nav_row = [];
  if (pyT(((page > 1)))) {
      pyAppend(nav_row, InlineKeyboardButton("⬅️ Prev", { callback_data: `cpnwiz_scope_ebook_pg_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav_row, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_wizcourse_page" }));
  }
  pyAppend(nav_row, InlineKeyboardButton(`Page ${pyStr(page)}/${pyStr(total_pages)}`, { callback_data: "noop_wizcourse_page" }));
  if (pyT(((page < total_pages)))) {
      pyAppend(nav_row, InlineKeyboardButton("Next ➡️", { callback_data: `cpnwiz_scope_ebook_pg_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav_row, InlineKeyboardButton("Next ➡️", { callback_data: "noop_wizcourse_page" }));
  }
  pyAppend(keyboard, nav_row);
  sel_count = pyLen(selected_ids);
  pyAppend(keyboard, [InlineKeyboardButton(`✅ Done (${pyStr(sel_count)} selected)`, { callback_data: "cpnwiz_ebooks_done" })]);
  if (pyT(((sel_count > 0)))) {
      pyAppend(keyboard, [InlineKeyboardButton("🧹 Clear Selection", { callback_data: "cpnwiz_ebooks_clear" })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_coupons" })]);
  page_str = ` (Page ${pyStr(page)}/${pyStr(total_pages)})`;
  sel_str = (pyT(sel_count) ? (`
✅ Selected: ${pyStr(sel_count)} e-book(s). Tap to select/unselect, then press Done.`) : ("\n👉 Tap e-books to select (multiple allowed), then press Done."));
  void ((await query.edit_message_text(`📖 **Choose specific e-books${pyStr(page_str)}:**${pyStr(sel_str)}`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_admin_coupon_list(query, page) {
    { const _k = __kw(page, ["page"]); if (_k) page = _k.page; }
    if ((page === undefined || page === null) || __isPlainObj(page)) page = 1;
  if (page === undefined) page = (1);
  let c, c_ids, code, coupon_items, coupons, dtype_s, dval, i;
  let keyboard, kind, n_eb, nav_row, page_coupons, page_str, per_page, scope_str;
  let start_idx, status_icon, total_items, total_pages;
  coupons = db.get_all_coupons();
  if (pyT((!pyT(coupons)))) {
      void ((await query.edit_message_text("❌ No coupons found.", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("➕ Create Coupon", { callback_data: "adm_add_coupon_start" })], [InlineKeyboardButton("⬅️Back", { callback_data: "adm_coupons" })]]) })));
      return;
  }
  coupon_items = pyList(pyItems(coupons));
  total_items = pyLen(coupon_items);
  per_page = 6;
  total_pages = pyMax(1, pyDiv(((total_items + per_page) - 1), per_page));
  page = pyMax(1, pyMin(page, total_pages));
  start_idx = ((typeof (page - 1) === 'string' || Array.isArray((page - 1)) ? pyRepeat((page - 1), per_page) : ((page - 1) * per_page)));
  page_coupons = pySlice(coupon_items, start_idx, (start_idx + per_page), null);
  keyboard = [];
  for (const [code, c] of pyIter(page_coupons)) {
      status_icon = (pyT((pyEq(pyGet(c, "status", "active"), "active"))) ? ("🟢") : ("🔴"));
      dtype_s = (pyT((pyEq(pyGet(c, "discount_type"), "fixed"))) ? ("৳") : ("%"));
      dval = pyGet(c, "discount_value", pyGet(c, "discount", 0));
      c_ids = (pyT(pyGet(c, "applicable_course_ids")) || pyT((pyT(pyGet(c, "applicable_course_id")) ? ([pyGet(c, "applicable_course_id")]) : ([]))));
      if (pyT(((pyLen(c_ids) > 1)))) {
            n_eb = pySum(((() => { const __acc = []; for (const i of pyIter(c_ids)) { if (!pyT(pyStart(pyStr(i), "EB-"))) continue; __acc.push(1); } return __acc; })()));
            kind = (pyT((pyT(n_eb) && pyT((pyEq(n_eb, pyLen(c_ids)))))) ? ("e-books") : ((pyT(n_eb) ? ("items") : ("courses"))));
            scope_str = `[${pyStr(pyLen(c_ids))} ${pyStr(kind)}]`;
      } else if (pyT(pyGet(c, "applicable_course_name"))) {
            scope_str = `[${pyStr(pySlice(pySub(c, "applicable_course_name"), null, 14, null))}]`;
      } else if (pyT((pyT(pyGet(c, "applicable_category")) && pyT(((!pyContains(["All", "Specific"], pySub(c, "applicable_category")))))))) {
            scope_str = `[${pyStr(pySub(c, "applicable_category"))}]`;
      } else if (pyT((pyEq(pyGet(c, "applicable_category"), "Specific")))) {
            scope_str = "[Specific]";
      } else {
            scope_str = "[All]";
      }
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(status_icon)} ${pyStr(code)} (${pyStr(dval)}${pyStr(dtype_s)}) ${pyStr(scope_str)}`, { callback_data: `adm_view_coupon_${pyStr(code)}` })]);
  }
  nav_row = [];
  if (pyT(((page > 1)))) {
      pyAppend(nav_row, InlineKeyboardButton("⬅️ Prev", { callback_data: `adm_list_coupons_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav_row, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_coupon_page" }));
  }
  pyAppend(nav_row, InlineKeyboardButton(`Page ${pyStr(page)}/${pyStr(total_pages)}`, { callback_data: "noop_coupon_page" }));
  if (pyT(((page < total_pages)))) {
      pyAppend(nav_row, InlineKeyboardButton("Next ➡️", { callback_data: `adm_list_coupons_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav_row, InlineKeyboardButton("Next ➡️", { callback_data: "noop_coupon_page" }));
  }
  pyAppend(keyboard, nav_row);
  pyAppend(keyboard, [InlineKeyboardButton("➕ Create Coupon", { callback_data: "adm_add_coupon_start" })]);
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "adm_coupons" })]);
  page_str = ` (Page ${pyStr(page)}/${pyStr(total_pages)})`;
  void ((await query.edit_message_text(`📋 **All Coupons List${pyStr(page_str)}:**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function show_order_detail(query, order_id, notice) {
  if (notice === undefined) notice = ("");
  let keyboard, notice_block, order, status, status_line;
  order = db.get_order(order_id);
  if (pyT((!pyT(order)))) {
      void ((await query.answer("Order not found!")));
      return;
  }
  status = pyLower(pyStr(pyGet(order, "status", "")));
  if (pyT((pyEq(status, "approved")))) {
      status_line = "✅ APPROVED";
  } else if (pyT((pyEq(status, "rejected")))) {
      status_line = "❌ REJECTED";
  } else {
      status_line = "⏳ PENDING";
  }
  keyboard = [];
  if (pyT((pyEq(status, "pending")))) {
      pyAppend(keyboard, [InlineKeyboardButton("✅ Approve", { callback_data: `approve_${pyStr(order_id)}` }), InlineKeyboardButton("✕ Reject", { callback_data: `reject_${pyStr(order_id)}` })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("« Pending Orders", { callback_data: "adm_pending_orders" })]);
  notice_block = (pyT(notice) ? (`${pyStr(notice)}
━━━━━━━━━━━━━━━━━━━━

`) : (""));
  void ((await query.edit_message_text(`${pyStr(notice_block)}📦 **Order Verification Details**
━━━━━━━━━━━━━━━━━━━━

🆔 **Order ID:** \`${pyStr(format_order_id_display(order_id))}\`
👤 **Student:** ${pyStr(pyGet(order, "full_name", "N/A"))} (@${pyStr(pyGet(order, "username", "N/A"))})
🆔 **User ID:** \`${pyStr(pyGet(order, "user_id"))}\`
📖 **Course:** ${pyStr(pyGet(order, "course_name", "N/A"))}
💰 **Amount:** ${pyStr(pySub(order, "amount"))} ৳ (${pyStr(pyGet(order, "payment_method", ""))})
🔑 **TrxID:** \`${pyStr(pyGet(order, "trxid", "N/A"))}\`
🏷️ **Coupon:** \`${pyStr((pyT(pyGet(order, "coupon_code")) || pyT("None")))}\`
📅 **Date:** ${pyStr(pySlice(pyGet(order, "date", "N/A"), null, 19, null))}
📌 **Status:** ${pyStr(status_line)}`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function render_folder_header_panel(query, context, folder_path) {
  let clean_path, custom_text, e, fid, hdr, keyboard, media_line, msg;
  let mtype, text_line;
  clean_path = pyReplace(pyReplace(pyStrip(pyStr((pyT(folder_path) || pyT("")))), " / ", " > "), "/", " > ");
  hdr = db.get_folder_header(clean_path);
  custom_text = pyStrip((pyT(pyGet(hdr, "text")) || pyT("")));
  [mtype, fid] = db.get_folder_header_media(clean_path);
  if (pyT((pyEq(mtype, "photo")))) {
      media_line = "🖼️ <b>Photo সেট করা আছে</b>";
  } else if (pyT((pyEq(mtype, "animation")))) {
      media_line = "🎞️ <b>GIF সেট করা আছে</b>";
  } else {
      media_line = "🔴 <i>কোনো ছবি/GIF নেই</i>";
  }
  text_line = (pyT(custom_text) ? (`<code>${pyStr(pyHtmlEscape(pySlice(custom_text, null, 120, null)))}</code>`) : ("<i>(Default title)</i>"));
  msg = `🖼️ <b>Folder Header (Text + Photo)</b>
━━━━━━━━━━━━━━━━━━━━
📁 <b>Path:</b> <code>${pyStr(pyHtmlEscape(clean_path))}</code>

✏️ <b>Title Text:</b>
${pyStr(text_line)}

${pyStr(media_line)}

👇 <b>Select:</b>`;
  keyboard = [[InlineKeyboardButton("✏️ Edit Text", { callback_data: "adm_fld_header_text" })], [InlineKeyboardButton("🖼️ Upload Photo/GIF", { callback_data: "adm_fld_header_media" })]];
  if (pyT((pyT((pyContains(["photo", "animation"], mtype))) && pyT(fid)))) {
      pyAppend(keyboard, [InlineKeyboardButton("🗑️ Remove Photo", { callback_data: "adm_fld_header_rmmedia" })]);
  }
  if (pyT(custom_text)) {
      pyAppend(keyboard, [InlineKeyboardButton("↩️ Reset to Default", { callback_data: "adm_fld_header_reset" })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: `adm_dir_${pyStr(clean_path)}` })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw __e;
            }
      }
  }
}

export async function render_eblib_header_panel(query) {
  let custom_text, e, fid, keyboard, media_line, msg, mtype, text_line;
  try {
      custom_text = pyStrip((pyT(db.get_setting("ebook_library_header_text", "")) || pyT("")));
      mtype = pyLower(pyStr((pyT(db.get_setting("ebook_library_media_type", "none")) || pyT("none"))));
      fid = (pyT(db.get_setting("ebook_library_media_file_id", "")) || pyT(""));
  } catch (__e) {
      [custom_text, mtype, fid] = ["", "none", ""];
  }
  if (pyT((pyT(((!pyContains(["photo", "animation"], mtype)))) || pyT((!pyT(fid)))))) {
      mtype = "none";
  }
  if (pyT((pyEq(mtype, "photo")))) {
      media_line = "🖼️ <b>Photo সেট করা আছে</b>";
  } else if (pyT((pyEq(mtype, "animation")))) {
      media_line = "🎞️ <b>GIF সেট করা আছে</b>";
  } else {
      media_line = "🔴 <i>কোনো ছবি/GIF নেই</i>";
  }
  text_line = (pyT(custom_text) ? (`<code>${pyStr(pyHtmlEscape(pySlice(custom_text, null, 120, null)))}</code>`) : ("<i>(Default title)</i>"));
  msg = `🖼️ <b>E-Book Library Header (Text + Photo)</b>
━━━━━━━━━━━━━━━━━━━━
📚 <b>Library main screen</b> (user-রা E-Book চাপলে যা দেখে)

✏️ <b>Title Text:</b>
${pyStr(text_line)}

${pyStr(media_line)}

👇 <b>Select:</b>`;
  keyboard = [[InlineKeyboardButton("✏️ Edit Text", { callback_data: "adm_eblib_header_text" })], [InlineKeyboardButton("🖼️ Upload Photo/GIF", { callback_data: "adm_eblib_header_media" })]];
  if (pyT(((!pyEq(mtype, "none"))))) {
      pyAppend(keyboard, [InlineKeyboardButton("🗑️ Remove Photo/GIF", { callback_data: "adm_eblib_header_rmmedia" })]);
  }
  if (pyT(custom_text)) {
      pyAppend(keyboard, [InlineKeyboardButton("↩️ Reset to Default", { callback_data: "adm_eblib_header_reset" })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebooks" })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw __e;
            }
      }
  }
}

export async function render_catlib_header_panel(query) {
  let custom_text, e, fid, keyboard, media_line, msg, mtype, text_line;
  try {
      custom_text = pyStrip((pyT(db.get_setting("category_library_header_text", "")) || pyT("")));
      mtype = pyLower(pyStr((pyT(db.get_setting("category_library_media_type", "none")) || pyT("none"))));
      fid = (pyT(db.get_setting("category_library_media_file_id", "")) || pyT(""));
  } catch (__e) {
      [custom_text, mtype, fid] = ["", "none", ""];
  }
  if (pyT((pyT(((!pyContains(["photo", "animation"], mtype)))) || pyT((!pyT(fid)))))) {
      mtype = "none";
  }
  if (pyT((pyEq(mtype, "photo")))) {
      media_line = "🖼️ <b>Photo সেট করা আছে</b>";
  } else if (pyT((pyEq(mtype, "animation")))) {
      media_line = "🎞️ <b>GIF সেট করা আছে</b>";
  } else {
      media_line = "🔴 <i>কোনো ছবি/GIF নেই</i>";
  }
  text_line = (pyT(custom_text) ? (`<code>${pyStr(pyHtmlEscape(pySlice(custom_text, null, 120, null)))}</code>`) : ("<i>(Default title)</i>"));
  msg = `🖼️ <b>Category Header (Text + Photo)</b>
━━━━━━━━━━━━━━━━━━━━
📂 <b>Root Category screen</b> (user-রা Browse Courses চাপলে যা দেখে)

✏️ <b>Title Text:</b>
${pyStr(text_line)}

${pyStr(media_line)}

👇 <b>Select:</b>`;
  keyboard = [[InlineKeyboardButton("✏️ Edit Text", { callback_data: "adm_catlib_header_text" })], [InlineKeyboardButton("🖼️ Upload Photo/GIF", { callback_data: "adm_catlib_header_media" })]];
  if (pyT(((!pyEq(mtype, "none"))))) {
      pyAppend(keyboard, [InlineKeyboardButton("🗑️ Remove Photo/GIF", { callback_data: "adm_catlib_header_rmmedia" })]);
  }
  if (pyT(custom_text)) {
      pyAppend(keyboard, [InlineKeyboardButton("↩️ Reset to Default", { callback_data: "adm_catlib_header_reset" })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "adm_dir_" })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw __e;
            }
      }
  }
}

export let DEFAULT_CART_EMPTY = "🛒 **Your shopping cart is empty!**\n\nTo add courses, please visit the course details page and press the **Add to Cart** button.";
export let DEFAULT_CART_HEADER = "🛒 **শপিং কার্ট ({count} টি আইটেম):**\n";
export let CART_EMPTY_PRESET_1 = "🛒 **Your shopping cart is empty!**\n\nTo add courses, please visit the course details page and press the **Add to Cart** button.\n[📚 Browse Courses | browse_categories]\n[📖 Browse E-Book | browse_ebooks]";
export let CART_EMPTY_PRESET_2 = "🛒 **আপনার শপিং কার্ট খালি!**\n\nকোর্স যোগ করতে কোর্স details পেজ থেকে **Add to Cart** বাটন চাপুন।\n[📚 Browse Courses | browse_categories]\n[📖 Browse E-Book | browse_ebooks]";
export function get_cart_media() {
  let fid, mtype;
  try {
      mtype = pyLower(pyStr((pyT(db.get_setting("cart_media_type", "none")) || pyT("none"))));
      fid = (pyT(db.get_setting("cart_media_file_id", "")) || pyT(""));
  } catch (__e) {
      [mtype, fid] = ["none", ""];
  }
  if (pyT((pyT(((!pyContains(["photo", "animation"], mtype)))) || pyT((!pyT(fid)))))) {
      return (["none", ""]);
  }
  return ([mtype, fid]);
}

export function get_cart_empty_body() {
  let raw;
  try {
      raw = pyStrip((pyT(db.get_setting("cart_empty_message", "")) || pyT("")));
  } catch (__e) {
      raw = "";
  }
  if (pyT((!pyT(raw)))) {
      raw = DEFAULT_CART_EMPTY;
  }
  return (parse_inline_buttons(raw));
}

export function get_cart_header_parts(count, total) {
  if (count === undefined) count = (0);
  if (total === undefined) total = (0);
  let raw;
  try {
      raw = pyStrip((pyT(db.get_setting("cart_message", "")) || pyT("")));
  } catch (__e) {
      raw = "";
  }
  if (pyT((!pyT(raw)))) {
      raw = DEFAULT_CART_HEADER;
  }
  raw = pyReplace(pyReplace(raw, "{count}", pyStr(count)), "{total}", pyStr(total));
  return (parse_inline_buttons(raw));
}

export function cart_merge_unique(keyboard, rows) {
  let b, key, new_row, out, row, seen;
  seen = pySetNew();
  for (const row of pyIter(keyboard)) {
      for (const b of pyIter(row)) {
            try {
                    seen.add([(pyT(b.callback_data) || pyT("")), (pyT(b.url) || pyT(""))]);
            } catch (__e) {
            }
      }
  }
  out = [];
  for (const row of pyIter(rows)) {
      new_row = [];
      for (const b of pyIter(row)) {
            try {
                    key = [(pyT(b.callback_data) || pyT("")), (pyT(b.url) || pyT(""))];
            } catch (__e) {
                    continue;
            }
            if (pyT(((!pyContains(seen, key))))) {
                    seen.add(key);
                    pyAppend(new_row, b);
            }
      }
      if (pyT(new_row)) {
            pyAppend(out, new_row);
      }
  }
  return (out);
}

export async function render_cart_settings_panel(query) {
  let e, empty_line, empty_raw, fid, header_line, header_raw, keyboard, media_line;
  let msg, mtype;
  try {
      empty_raw = pyStrip((pyT(db.get_setting("cart_empty_message", "")) || pyT("")));
      header_raw = pyStrip((pyT(db.get_setting("cart_message", "")) || pyT("")));
  } catch (__e) {
      [empty_raw, header_raw] = ["", ""];
  }
  [mtype, fid] = get_cart_media();
  if (pyT((pyEq(mtype, "photo")))) {
      media_line = "🖼️ <b>Photo সেট করা আছে</b>";
  } else if (pyT((pyEq(mtype, "animation")))) {
      media_line = "🎞️ <b>GIF সেট করা আছে</b>";
  } else {
      media_line = "🔴 <i>কোনো ছবি/GIF নেই</i>";
  }
  empty_line = (pyT(empty_raw) ? (`<code>${pyStr(pyHtmlEscape(pySlice(empty_raw, null, 120, null)))}</code>`) : ("<i>(Default message)</i>"));
  header_line = (pyT(header_raw) ? (`<code>${pyStr(pyHtmlEscape(pySlice(header_raw, null, 120, null)))}</code>`) : ("<i>(Default header)</i>"));
  msg = `🛒 <b>Cart Settings (Message + Image + Buttons)</b>
━━━━━━━━━━━━━━━━━━━━

🈳 <b>Empty Cart Message:</b>
${pyStr(empty_line)}

🧾 <b>Filled Cart Header</b> (placeholders: <code>{count}</code> <code>{total}</code>):
${pyStr(header_line)}

${pyStr(media_line)}

💡 <i>Button যোগ করতে message-এর আলাদা লাইনে লিখুন:</i> <code>[Button Text | callback_or_URL]</code>

👇 <b>Select:</b>`;
  keyboard = [[InlineKeyboardButton("✏️ Empty Cart Msg", { callback_data: "adm_editmsg_cart_empty_message" })], [InlineKeyboardButton("✏️ Cart Header", { callback_data: "adm_editmsg_cart_message" })], [InlineKeyboardButton("🖼️ Upload Heading Image", { callback_data: "adm_cart_media_upload" })]];
  if (pyT(((!pyEq(mtype, "none"))))) {
      pyAppend(keyboard, [InlineKeyboardButton("🗑️ Remove Image", { callback_data: "adm_cart_media_remove" })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "adm_bot_settings" })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw __e;
            }
      }
  }
}

export async function render_ebook_folder_header_panel(query, context, folder_path) {
  let clean_path, custom_text, e, fid, hdr, keyboard, media_line, msg;
  let mtype, text_line;
  clean_path = pyReplace(pyReplace(pyStrip(pyStr((pyT(folder_path) || pyT("")))), " / ", " > "), "/", " > ");
  hdr = db.get_ebook_folder_header(clean_path);
  custom_text = pyStrip((pyT(pyGet(hdr, "text")) || pyT("")));
  [mtype, fid] = db.get_ebook_folder_header_media(clean_path);
  if (pyT((pyEq(mtype, "photo")))) {
      media_line = "🖼️ <b>Photo সেট করা আছে</b>";
  } else if (pyT((pyEq(mtype, "animation")))) {
      media_line = "🎞️ <b>GIF সেট করা আছে</b>";
  } else {
      media_line = "🔴 <i>কোনো ছবি/GIF নেই</i>";
  }
  text_line = (pyT(custom_text) ? (`<code>${pyStr(pyHtmlEscape(pySlice(custom_text, null, 120, null)))}</code>`) : ("<i>(Default title)</i>"));
  msg = `🖼️ <b>E-Book Folder Header (Text + Photo)</b>
━━━━━━━━━━━━━━━━━━━━
📁 <b>Path:</b> <code>${pyStr(pyHtmlEscape(clean_path))}</code>

✏️ <b>Title Text:</b>
${pyStr(text_line)}

${pyStr(media_line)}

👇 <b>Select:</b>`;
  keyboard = [[InlineKeyboardButton("✏️ Edit Text", { callback_data: "adm_ebfld_header_text" })], [InlineKeyboardButton("🖼️ Upload Photo/GIF", { callback_data: "adm_ebfld_header_media" })]];
  if (pyT((pyT((pyContains(["photo", "animation"], mtype))) && pyT(fid)))) {
      pyAppend(keyboard, [InlineKeyboardButton("🗑️ Remove Photo", { callback_data: "adm_ebfld_header_rmmedia" })]);
  }
  if (pyT(custom_text)) {
      pyAppend(keyboard, [InlineKeyboardButton("↩️ Reset to Default", { callback_data: "adm_ebfld_header_reset" })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: `adm_ebdir_${pyStr(clean_path)}` })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw __e;
            }
      }
  }
}

export async function render_course_groups_panel(query, context, cid) {
  let course, e, g, glines, groups, i, keyboard, msg;
  course = db.get_course(cid);
  if (pyT((!pyT(course)))) {
      void ((await query.answer("❌ Course not found!", { show_alert: true })));
      return;
  }
  groups = db.get_course_group_list(course);
  if (pyT(groups)) {
      glines = pyJoin("\n", ((() => { const __acc = []; for (const [i, g] of pyIter(pyEnumerate(groups, 1))) { __acc.push(`${pyStr(i)}. ${pyStr(pySub(g, "label"))} — \`${pyStr(pySub(g, "id"))}\``); } return __acc; })()));
  } else {
      glines = "<i>(কোনো Group ID নেই)</i>";
  }
  msg = `👥 <b>Manage Group IDs</b>
━━━━━━━━━━━━━━━━━━━━
📘 <b>${pyStr(pyHtmlEscape(pyStr(pyGet(course, "name", ""))))}</b>

${pyStr(glines)}

👇 Add / delete:`;
  keyboard = [];
  for (const [i, g] of pyIter(pyEnumerate(groups))) {
      pyAppend(keyboard, [InlineKeyboardButton(`✕ ${pyStr(pySlice(pySub(g, "label"), null, 20, null))}`, { callback_data: `adm_delgroup_${pyStr(cid)}_${pyStr(i)}` })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("➕ Add Group ID", { callback_data: `adm_addgroup_${pyStr(cid)}` })]);
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: `adm_edit_${pyStr(cid)}` })]);
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw __e;
            }
      }
  }
}

