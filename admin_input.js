// admin_input.js — auto-transpiled from bot.py by py2js. Ported 1:1 from the Python source.
import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from "./compat.js";
import { db } from "./db.js";
import { render_admin_folder_directory } from "./admin_panels.js";
import { _msg_has_media, is_admin, logger, main_menu_keyboard, start, wizard_edit_or_reply } from "./core.js";
import { parse_group_id_input, send_admin_category_selector, send_admin_course_preview, send_admin_group_id_prompt, send_admin_subcategory_selector } from "./screens.js";
import { pyAny, pyAppend, pyContains, pyDiv, pyEnumerate, pyEq, pyGet, pyHasAttr, pyInt, pyIsDigit, pyIsInstance, pyItems, pyIter, pyJoin, pyLen, pyList, pyLower, pyMax, pyPop, pyReFindAll, pyReMatch, pyRepeat, pyReplace, pySetDefault, pySlice, pySort, pySplit, pyStart, pyStr, pyStrip, pySub, pySum, pyT, pyTitle, pyUpper, pyValues, pySleep, __kw, __kwVal, __isPlainObj } from "./helpers.js";
import { InlineKeyboardButton } from "./core.js";

export async function handle_admin_payment_input(update, context) {
  let back_kb, m_ins, m_name, m_num, pkey, step, text, user_id;
  text = (pyT(update.message.text) ? (pyStrip(update.message.text)) : (""));
  user_id = update.effective_user.id;
  step = pyGet(context.user_data, "admin_pay_step");
  if (pyT((pyEq(text, "/cancel")))) {
      pyPop(context.user_data, "admin_pay_step", null);
      pyPop(context.user_data, "admin_pay_target_key", null);
      pyPop(context.user_data, "new_pay_method", null);
      back_kb = [[InlineKeyboardButton("⚙ Payment Settings", { callback_data: "adm_payments" })]];
      void ((await update.message.reply_text("✕ Action aborted.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
      return;
  }
  if (pyT((pyEq(step, "edit_num")))) {
      pkey = pyGet(context.user_data, "admin_pay_target_key");
      db.update_payment_method(pkey, { number: text });
      pyPop(context.user_data, "admin_pay_step", null);
      pyPop(context.user_data, "admin_pay_target_key", null);
      void ((await update.message.reply_text(`✅ **${pyStr(pyTitle(pkey))} number updated to \`${pyStr(text)}\`!**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⚙ Payment Settings", { callback_data: "adm_payments" })]]) })));
  } else if (pyT((pyEq(step, "edit_ins")))) {
      pkey = pyGet(context.user_data, "admin_pay_target_key");
      db.update_payment_method(pkey, { instruction: text });
      pyPop(context.user_data, "admin_pay_step", null);
      pyPop(context.user_data, "admin_pay_target_key", null);
      void ((await update.message.reply_text(`✅ **${pyStr(pyTitle(pkey))} instruction updated to \`${pyStr(text)}\`!**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⚙ Payment Settings", { callback_data: "adm_payments" })]]) })));
  } else if (pyT((pyEq(step, "edit_note")))) {
      db.set_payment_note(text);
      pyPop(context.user_data, "admin_pay_step", null);
      void ((await update.message.reply_text("✅ **Payment notes & disclaimer updated successfully!**", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⚙ Payment Settings", { callback_data: "adm_payments" })]]) })));
  } else if (pyT((pyEq(step, "add_name")))) {
      pySub(context.user_data, "new_pay_method")["name"] = text;
      context.user_data["admin_pay_step"] = "add_num";
      void ((await update.message.reply_text(`📱 **Enter number for ${pyStr(text)}:**
(e.g. 01XXXXXXXXX)`)));
  } else if (pyT((pyEq(step, "add_num")))) {
      pySub(context.user_data, "new_pay_method")["number"] = text;
      context.user_data["admin_pay_step"] = "add_ins";
      void ((await update.message.reply_text("⚙ **Enter instruction/type (e.g. Personal / Send Money / Merchant):**")));
  } else if (pyT((pyEq(step, "add_ins")))) {
      m_name = pySub(pySub(context.user_data, "new_pay_method"), "name");
      m_num = pySub(pySub(context.user_data, "new_pay_method"), "number");
      m_ins = text;
      db.add_payment_method({ name: m_name, number: m_num, instruction: m_ins });
      pyPop(context.user_data, "admin_pay_step", null);
      pyPop(context.user_data, "new_pay_method", null);
      void ((await update.message.reply_text(`🎉 **New Payment Method Added!**
━━━━━━━━━━━━━━━━━━━━

💳 **Name:** ${pyStr(m_name)}
📱 **Number:** \`${pyStr(m_num)}\`
⚙ **Type:** ${pyStr(m_ins)}`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⚙ Payment Settings", { callback_data: "adm_payments" })]]) })));
  }
}

export async function handle_admin_user_mgmt_input(update, context) {
  let added, back_kb, bal, clean_text, courses_c, e, is_adm_badge, keyboard;
  let ref_c, results, step, target_uid, text, u, u_data, u_info;
  let u_name, uid, uid_val, user_id, val;
  text = (pyT(update.message.text) ? (pyStrip(update.message.text)) : (""));
  user_id = update.effective_user.id;
  step = pyGet(context.user_data, "admin_user_step");
  if (pyT((pyEq(text, "/cancel")))) {
      pyPop(context.user_data, "admin_user_step", null);
      pyPop(context.user_data, "admin_dm_target_uid", null);
      uid = (pyT((((__v0) => (pyT(__v0) ? (pyStart(step, "adjust_bal_")) : __v0))(step))) ? (pyReplace(step, "adjust_bal_", "")) : (null));
      back_kb = [];
      if (pyT(uid)) {
            pyAppend(back_kb, [InlineKeyboardButton("👤 View User Profile", { callback_data: `adm_uview_${pyStr(uid)}` })]);
      }
      pyAppend(back_kb, [InlineKeyboardButton("« User Management Menu", { callback_data: "adm_users" })]);
      void ((await update.message.reply_text("✕ Aborted.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
      return;
  }
  if (pyT((pyEq(step, "set_referral_bonus")))) {
      pyPop(context.user_data, "admin_user_step", null);
      try {
            val = pyInt(text);
            if (pyT(((val < 0)))) {
                    throw (ValueError);
            }
      } catch (__e) {
            void ((await update.message.reply_text("⚠️ অনুগ্রহ করে সঠিক ধনাত্মক পূর্ণসংখ্যা লিখুন (যেমন: 50 বা 100):")));
            return;
      }
      db.set_referral_reward_amount(val);
      keyboard = [[InlineKeyboardButton("👥 Refer & Earn Hub", { callback_data: "adm_referrals" })], [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]];
      void ((await update.message.reply_text(`✅ **Success!**
🎁 প্রতি সফল পেইড রেফারেলের বোনাস **৳${pyStr(val)} BDT** নির্ধারণ করা হয়েছে।`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  if (pyT((pyEq(step, "search_referral_user")))) {
      pyPop(context.user_data, "admin_user_step", null);
      results = db.search_referral_users(text);
      if (pyT((!pyT(results)))) {
            void ((await update.message.reply_text(`❌ No student found matching '${pyStr(text)}'!`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Refer & Earn Hub", { callback_data: "adm_referrals" })]]) })));
            return;
      }
      keyboard = [];
      for (const u of pyIter(pySlice(results, null, 10, null))) {
            u_name = (((__v2) => (pyT(__v2) ? __v2 : (((__v1) => (pyT(__v1) ? __v1 : (pyStr(pyGet(u, "user_id")))))(pyGet(u, "username")))))(pyGet(u, "full_name")));
            ref_c = pyGet(u, "referral_count", 0);
            bal = pyGet(u, "balance", 0);
            pyAppend(keyboard, [InlineKeyboardButton(`👤 ${pyStr(pySlice(u_name, null, 16, null))} — 👥 ${pyStr(ref_c)} | 💰 ৳${pyStr(bal)}`, { callback_data: `adm_refuview_${pyStr(pySub(u, "user_id"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Refer & Earn Hub", { callback_data: "adm_referrals" })]);
      void ((await update.message.reply_text(`🔍 <b>Referral Search Results for '${pyStr(text)}' (${pyStr(pyLen(results))} found):</b>
Click to view referral details:`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  if (pyT((((__v3) => (pyT(__v3) ? (pyStart(step, "adjust_bal_")) : __v3))(step)))) {
      uid = pyInt(pyReplace(step, "adjust_bal_", ""));
      pyPop(context.user_data, "admin_user_step", null);
      try {
            val = pyInt(text);
      } catch (__e) {
            void ((await update.message.reply_text("⚠️ Please enter a valid integer (e.g., 500):")));
            return;
      }
      db.update_balance(uid, val);
      keyboard = [[InlineKeyboardButton("👤 View User Profile", { callback_data: `adm_uview_${pyStr(uid)}` })], [InlineKeyboardButton("« User Menu", { callback_data: "adm_users" })]];
      void ((await update.message.reply_text(`✅ **Success!**
👤 User \`${pyStr(uid)}\` balance has been updated to **${pyStr(val)} ৳**!`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  if (pyT((pyEq(step, "search")))) {
      pyPop(context.user_data, "admin_user_step", null);
      results = db.search_users(text);
      if (pyT((!pyT(results)))) {
            void ((await update.message.reply_text(`❌ No student found matching '${pyStr(text)}'!`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« User Menu", { callback_data: "adm_users" })]]) })));
            return;
      }
      keyboard = [];
      for (const u of pyIter(pySlice(results, null, 10, null))) {
            u_name = (((__v5) => (pyT(__v5) ? __v5 : (((__v4) => (pyT(__v4) ? __v4 : (pyStr(pyGet(u, "user_id")))))(pyGet(u, "username")))))(pyGet(u, "full_name")));
            courses_c = pyLen(pyGet(u, "purchased_courses", []));
            is_adm_badge = (pyT(db.is_admin(pySub(u, "user_id"))) ? (" 👑") : (""));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(pySlice(u_name, null, 20, null))}${pyStr(is_adm_badge)} (📚 ${pyStr(courses_c)})`, { callback_data: `adm_uview_${pyStr(pySub(u, "user_id"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("« User Menu", { callback_data: "adm_users" })]);
      void ((await update.message.reply_text(`🔍 **Search Results for '${pyStr(text)}' (${pyStr(pyLen(results))} found):**
Click to view profile:`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(step, "add_admin")))) {
      pyPop(context.user_data, "admin_user_step", null);
      target_uid = null;
      clean_text = pyStrip(pyReplace(text, "@", ""));
      if (pyT(pyIsDigit(clean_text))) {
            target_uid = pyInt(clean_text);
      } else {
            for (const [uid_val, u_data] of pyIter(pyItems(db.users))) {
                    if (pyT((pyEq(pyLower(pyGet(u_data, "username", "")), pyLower(clean_text))))) {
                              target_uid = pyInt(uid_val);
                              break;
                    }
            }
      }
      if (pyT((!pyT(target_uid)))) {
            keyboard = [[InlineKeyboardButton("➕ Try Again", { callback_data: "adm_add_admin" })], [InlineKeyboardButton("« Admin List", { callback_data: "adm_admin_list" })]];
            void ((await update.message.reply_text(`❌ User not found! Ensure that \`${pyStr(text)}\` has started the bot or provide a valid User ID.`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
            return;
      }
      added = db.add_admin(target_uid, { added_by: user_id });
      if (pyT(added)) {
            try {
                    void ((await context.bot.send_message(target_uid, "🎉 **Congratulations!**\nYou have been added as an admin.\n👉 Use /admin command to open the admin panel.", { parse_mode: "Markdown" })));
            } catch (__e) {
            }
            u_info = db.get_user(target_uid);
            u_name = (((__v6) => (pyT(__v6) ? __v6 : (`User ${pyStr(target_uid)}`)))((pyT(u_info) ? (pyGet(u_info, "full_name")) : (""))));
            keyboard = [[InlineKeyboardButton("🔐 Configure Permissions (পারমিশন সেট করুন)", { callback_data: `adm_perm_${pyStr(target_uid)}` })], [InlineKeyboardButton("👑 View Admin List", { callback_data: "adm_admin_list" }), InlineKeyboardButton("👤 User Profile", { callback_data: `adm_uview_${pyStr(target_uid)}` })], [InlineKeyboardButton("« User Management", { callback_data: "adm_users" })]];
            void ((await update.message.reply_text(`✅ **Success!**
👑 **${pyStr(u_name)}** (\`${pyStr(target_uid)}\`) has been successfully appointed as an admin!`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            keyboard = [[InlineKeyboardButton("👑 View Admin List", { callback_data: "adm_admin_list" })], [InlineKeyboardButton("« User Management", { callback_data: "adm_users" })]];
            void ((await update.message.reply_text(`ℹ️ User \`${pyStr(target_uid)}\` is already an admin!`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else if (pyT((pyEq(step, "send_dm")))) {
      target_uid = pyGet(context.user_data, "admin_dm_target_uid");
      pyPop(context.user_data, "admin_user_step", null);
      pyPop(context.user_data, "admin_dm_target_uid", null);
      try {
            void ((await context.bot.send_message(target_uid, text, { parse_mode: "Markdown" })));
            void ((await update.message.reply_text(`✅ **Message delivered to User \`${pyStr(target_uid)}\` inbox!**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("👤 User Profile", { callback_data: `adm_uview_${pyStr(target_uid)}` })]]) })));
      } catch (e) {
            void ((await update.message.reply_text(`❌ Could not send message: ${pyStr(e)}`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("👤 User Profile", { callback_data: `adm_uview_${pyStr(target_uid)}` })]]) })));
      }
  }
}

export function render_broadcast_target_selector_keyboard(context, page, search_results) {
    { const _k = __kw(page, ["page", "search_results"]); if (_k) { if ("page" in _k) page = _k.page; if ("search_results" in _k) search_results = _k.search_results; } }
    if (((page === undefined || page === null)) || __isPlainObj(page)) page = 1;
  if (page === undefined) page = (1);
  if (search_results === undefined) search_results = (null);
  let all_users, end_idx, icon, is_selected, keyboard, name, nav_row, per_page;
  let selected, start_idx, total, total_pages, u, uid, uname, uname_disp;
  let users_list;
  selected = pySetDefault(context.user_data, "bc_recipients", []);
  if (pyT(((!(search_results === null || search_results === undefined))))) {
      users_list = search_results;
      total_pages = 1;
  } else {
      all_users = pyList(pyValues(db.users));
      pySort(all_users, ((u) => (pyGet(u, "joined_date", ""))), true);
      per_page = 5;
      total = pyLen(all_users);
      total_pages = pyMax(1, pyDiv(((total + per_page) - 1), per_page));
      if (pyT(((page < 1)))) {
            page = 1;
      }
      if (pyT(((page > total_pages)))) {
            page = total_pages;
      }
      start_idx = ((typeof (page - 1) === 'string' || Array.isArray((page - 1)) ? pyRepeat((page - 1), per_page) : ((page - 1) * per_page)));
      end_idx = (start_idx + per_page);
      users_list = pySlice(all_users, start_idx, end_idx, null);
  }
  keyboard = [];
  for (const u of pyIter(users_list)) {
      uid = pyInt(pySub(u, "user_id"));
      name = (((__v7) => (pyT(__v7) ? __v7 : ("User")))(pyGet(u, "full_name")));
      uname = pyGet(u, "username");
      uname_disp = (pyT(uname) ? (` (@${pyStr(uname)})`) : (""));
      is_selected = (pyContains(selected, uid));
      icon = (pyT(is_selected) ? ("✅") : ("➕"));
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(icon)} ${pyStr(name)}${pyStr(uname_disp)} [${pyStr(uid)}]`, { callback_data: `bc_sel_tgl_${pyStr(uid)}_${pyStr(page)}` })]);
  }
  if (pyT(((search_results === null || search_results === undefined)))) {
      nav_row = [];
      if (pyT(((page > 1)))) {
            pyAppend(nav_row, InlineKeyboardButton("« Prev", { callback_data: `bc_sel_pg_${pyStr((page - 1))}` }));
      }
      pyAppend(nav_row, InlineKeyboardButton(`Page ${pyStr(page)}/${pyStr(total_pages)}`, { callback_data: "bc_sel_pg_noop" }));
      if (pyT(((page < total_pages)))) {
            pyAppend(nav_row, InlineKeyboardButton("Next »", { callback_data: `bc_sel_pg_${pyStr((page + 1))}` }));
      }
      pyAppend(keyboard, nav_row);
  } else {
      pyAppend(keyboard, [InlineKeyboardButton("« Back to User List", { callback_data: "bc_sel_pg_1" })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("🔍 Search User", { callback_data: "bc_sel_search" }), InlineKeyboardButton(`✅ Confirm (${pyStr(pyLen(selected))} Selected)`, { callback_data: "bc_sel_done" })]);
  pyAppend(keyboard, [InlineKeyboardButton("✕ Cancel Broadcast", { callback_data: "adm_bc_cancel" })]);
  return (InlineKeyboardMarkup(keyboard));
}

export function get_broadcast_target_selector_text(context, search_query) {
    { const _k = __kw(search_query, ["search_query"]); if (_k) search_query = _k.search_query; }
    if (__isPlainObj(search_query)) search_query = "";
  if (search_query === undefined) search_query = ("");
  let name, search_header, selected, selected_details, selected_text, text, uid, uname;
  let uname_disp, user_info;
  selected = pyGet(context.user_data, "bc_recipients", []);
  selected_details = [];
  for (const uid of pyIter(pySlice(selected, null, 15, null))) {
      user_info = db.get_user(uid);
      if (pyT(user_info)) {
            name = (((__v8) => (pyT(__v8) ? __v8 : ("User")))(pyGet(user_info, "full_name")));
            uname = pyGet(user_info, "username");
            uname_disp = (pyT(uname) ? (` (@${pyStr(uname)})`) : (""));
            pyAppend(selected_details, `• 👤 ${pyStr(name)}${pyStr(uname_disp)} (\`${pyStr(uid)}\`)`);
      } else {
            pyAppend(selected_details, `• 👤 Unknown User (\`${pyStr(uid)}\`)`);
      }
  }
  if (pyT(((pyLen(selected) > 15)))) {
      pyAppend(selected_details, `• ... and ${pyStr((pyLen(selected) - 15))} more.`);
  }
  selected_text = (pyT(selected_details) ? (pyJoin("\n", selected_details)) : ("_(None selected)_"));
  search_header = (pyT(search_query) ? (`🔍 **Search Results for:** \`${pyStr(search_query)}\`

`) : (""));
  text = `◈ **Select Target Users:**
━━━━━━━━━━━━━━━━━━━━
${pyStr(search_header)}📌 **Selected Recipients (${pyStr(pyLen(selected))}):**
${pyStr(selected_text)}

👇 **How to select target users:**
1. Click on a user button below to toggle selection.
2. Click **Search User** to find specific users by Name/Username/ID.
3. Paste/type multiple User IDs in the chat directly to add them instantly.

💡 Click **Confirm** when you are done to proceed.`;
  return (text);
}

export async function handle_broadcast_input_step(update, context) {
  let added_count, btn_title, btn_url, item, keyboard, msg, msg_text, page;
  let parts, payload, raw, recipients, reply_markup, results, search_query, step;
  let text, uid, user_id;
  msg = update.message;
  text = (pyT((((__v9) => (pyT(__v9) ? (msg.text) : __v9))(msg))) ? (pyStrip(msg.text)) : (""));
  user_id = update.effective_user.id;
  step = pyGet(context.user_data, "admin_broadcasting_step");
  if (pyT((((__v11) => (pyT(__v11) ? __v11 : (((__v10) => (pyT(__v10) ? __v10 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "❌ Cancel"))))))((pyEq(text, "/cancel")))))) {
      pyPop(context.user_data, "admin_broadcasting_mode", null);
      pyPop(context.user_data, "admin_broadcasting_step", null);
      pyPop(context.user_data, "bc_payload", null);
      pyPop(context.user_data, "bc_recipients", null);
      void ((await update.message.reply_text("✕ Broadcast cancelled.", { reply_markup: main_menu_keyboard(user_id) })));
      return;
  }
  if (pyT((pyEq(step, "msg_content")))) {
      payload = {  };
      if (pyT(msg.photo)) {
            payload["type"] = "photo";
            payload["file_id"] = pySub(msg.photo, (-(1))).file_id;
            payload["caption"] = (((__v12) => (pyT(__v12) ? __v12 : ("")))(msg.caption));
      } else if (pyT(msg.video)) {
            payload["type"] = "video";
            payload["file_id"] = msg.video.file_id;
            payload["caption"] = (((__v13) => (pyT(__v13) ? __v13 : ("")))(msg.caption));
      } else if (pyT(msg.document)) {
            payload["type"] = "document";
            payload["file_id"] = msg.document.file_id;
            payload["caption"] = (((__v14) => (pyT(__v14) ? __v14 : ("")))(msg.caption));
      } else if (pyT(text)) {
            payload["type"] = "text";
            payload["text"] = text;
      }
      if (pyT((!pyT(payload)))) {
            void ((await update.message.reply_text("⚠️ Unsupported message type! Please send Text, Photo, Video, or Document (or click Cancel):")));
            return;
      }
      context.user_data["bc_payload"] = payload;
      context.user_data["admin_broadcasting_step"] = "btn_input";
      void ((await update.message.reply_text("➥ **Do you want to attach a URL button to this message?**\n━━━━━━━━━━━━━━━━━━━━\n\nFormat: `Button Title | https://link`\nExample: `Join Live Class | https://t.me/example`\n\n💡 Type `skip` if you don't need any button.", { reply_markup: ReplyKeyboardMarkup([["❌ Cancel"]], { resize_keyboard: true }) })));
  } else if (pyT((pyEq(step, "btn_input")))) {
      payload = pyGet(context.user_data, "bc_payload", {  });
      if (pyT(((!pyEq(pyLower(text), "skip"))))) {
            if (pyT((pyContains(text, "|")))) {
                    parts = pySplit(text, "|", 1);
                    btn_title = pyStrip(pySub(parts, 0));
                    btn_url = pyStrip(pySub(parts, 1));
                    if (pyT((((__v15) => (pyT(__v15) ? (pyStart(btn_url, "http")) : __v15))(btn_title)))) {
                              payload["btn_text"] = btn_title;
                              payload["btn_url"] = btn_url;
                    } else {
                              void ((await update.message.reply_text("⚠️ Invalid URL! The link must start with http:// or https://. Send again or type `skip`:")));
                              return;
                    }
            } else {
                    void ((await update.message.reply_text("⚠️ Invalid format! Please send: `Button Title | https://link` or type `skip`:")));
                    return;
            }
      }
      context.user_data["bc_payload"] = payload;
      context.user_data["admin_broadcasting_step"] = "target_select";
      keyboard = [[InlineKeyboardButton("👥 All Users", { callback_data: "adm_bc_target_all" }), InlineKeyboardButton("◈ Selected Users", { callback_data: "adm_bc_target_sel" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_bc_cancel" })]];
      void ((await update.message.reply_text("📌 **Select Broadcast Target Audience:**", { reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(step, "fwd_content")))) {
      if (pyT((!pyT(msg)))) {
            void ((await update.message.reply_text("⚠️ Invalid message! Please forward a message:")));
            return;
      }
      payload = { type: "forward", from_chat_id: msg.chat_id, message_id: msg.message_id };
      context.user_data["bc_payload"] = payload;
      context.user_data["admin_broadcasting_step"] = "target_select";
      keyboard = [[InlineKeyboardButton("👥 All Users", { callback_data: "adm_bc_target_all" }), InlineKeyboardButton("◈ Selected Users", { callback_data: "adm_bc_target_sel" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_bc_cancel" })]];
      void ((await update.message.reply_text("📌 **Select Broadcast Target Audience:**", { reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(step, "search_users_for_bc")))) {
      results = db.search_users(text);
      if (pyT((!pyT(results)))) {
            void ((await update.message.reply_text(`❌ No users found matching '${pyStr(text)}'! Try again or cancel search:`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel Search", { callback_data: "bc_sel_pg_1" })]]) })));
            return;
      }
      context.user_data["bc_search_query"] = text;
      reply_markup = render_broadcast_target_selector_keyboard(context, { search_results: results });
      msg_text = get_broadcast_target_selector_text(context, { search_query: text });
      void ((await update.message.reply_text(msg_text, { parse_mode: "Markdown", reply_markup: reply_markup })));
      context.user_data["admin_broadcasting_step"] = "sel_uids";
      return;
  } else if (pyT((pyEq(step, "sel_uids")))) {
      raw = pySplit(pyReplace(text, ",", " "), null, -1);
      recipients = pySetDefault(context.user_data, "bc_recipients", []);
      added_count = 0;
      for (const item of pyIter(raw)) {
            if (pyT(pyIsDigit(item))) {
                    uid = pyInt(item);
                    if (pyT(((!pyContains(recipients, uid))))) {
                              pyAppend(recipients, uid);
                              added_count += 1;
                    }
            }
      }
      if (pyT((pyEq(added_count, 0)))) {
            void ((await update.message.reply_text("⚠️ No new/valid User IDs found! Send again or use the buttons below:")));
            return;
      }
      context.user_data["bc_recipients"] = recipients;
      page = 1;
      search_query = pyGet(context.user_data, "bc_search_query", "");
      if (pyT(search_query)) {
            results = db.search_users(search_query);
            void ((await update.message.reply_text(get_broadcast_target_selector_text(context, search_query), { parse_mode: "Markdown", reply_markup: render_broadcast_target_selector_keyboard(context, { search_results: results }) })));
      } else {
            void ((await update.message.reply_text(get_broadcast_target_selector_text(context), { parse_mode: "Markdown", reply_markup: render_broadcast_target_selector_keyboard(context, { page: page }) })));
      }
      return;
  }
}

export async function show_broadcast_preview(target, context, user_id) {
  let conf_msg, e, keyboard, payload, ptype, recipients, reply_markup, target_chat_id;
  payload = pyGet(context.user_data, "bc_payload", {  });
  recipients = pyGet(context.user_data, "bc_recipients", []);
  target_chat_id = (pyT(pyHasAttr(target, "chat_id")) ? (target.chat_id) : (user_id));
  reply_markup = null;
  if (pyT((((__v16) => (pyT(__v16) ? (pyGet(payload, "btn_url")) : __v16))(pyGet(payload, "btn_text"))))) {
      reply_markup = InlineKeyboardMarkup([[InlineKeyboardButton(pySub(payload, "btn_text"), { url: pySub(payload, "btn_url") })]]);
  }
  try {
      ptype = pyGet(payload, "type");
      if (pyT((pyEq(ptype, "forward")))) {
            void ((await context.bot.copy_message({ chat_id: target_chat_id, from_chat_id: pySub(payload, "from_chat_id"), message_id: pySub(payload, "message_id") })));
      } else if (pyT((pyEq(ptype, "photo")))) {
            void ((await context.bot.send_photo({ chat_id: target_chat_id, photo: pySub(payload, "file_id"), caption: pyGet(payload, "caption", ""), reply_markup: reply_markup })));
      } else if (pyT((pyEq(ptype, "video")))) {
            void ((await context.bot.send_video({ chat_id: target_chat_id, video: pySub(payload, "file_id"), caption: pyGet(payload, "caption", ""), reply_markup: reply_markup })));
      } else if (pyT((pyEq(ptype, "document")))) {
            void ((await context.bot.send_document({ chat_id: target_chat_id, document: pySub(payload, "file_id"), caption: pyGet(payload, "caption", ""), reply_markup: reply_markup })));
      } else {
            void ((await context.bot.send_message({ chat_id: target_chat_id, text: pyGet(payload, "text", ""), reply_markup: reply_markup })));
      }
  } catch (e) {
      logger.error(`Preview error: ${pyStr(e)}`);
  }
  conf_msg = `⚡ **Broadcast Preview Complete!**
━━━━━━━━━━━━━━━━━━━━

👥 **Total Recipients:** \`${pyStr(pyLen(recipients))}\` users

Click Send Broadcast to dispatch now:`;
  keyboard = [[InlineKeyboardButton("🚀 Send Broadcast", { callback_data: "adm_bc_confirm_send" }), InlineKeyboardButton("✕ Cancel", { callback_data: "adm_bc_cancel" })]];
  void ((await context.bot.send_message({ chat_id: target_chat_id, text: "👇 **Confirm broadcast options below:**", reply_markup: main_menu_keyboard(user_id) })));
  void ((await context.bot.send_message({ chat_id: target_chat_id, text: conf_msg, parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function execute_broadcast(query, context, user_id) {
  let failed, payload, progress, ptype, recipients, reply_markup, sent, uid;
  payload = pyGet(context.user_data, "bc_payload", {  });
  recipients = pyGet(context.user_data, "bc_recipients", []);
  pyPop(context.user_data, "admin_broadcasting_mode", null);
  pyPop(context.user_data, "admin_broadcasting_step", null);
  pyPop(context.user_data, "bc_payload", null);
  pyPop(context.user_data, "bc_recipients", null);
  if (pyT((!pyT(recipients)))) {
      void ((await query.edit_message_text("❌ No recipients found!", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]]) })));
      return;
  }
  progress = (await query.edit_message_text(`🚀 Sending broadcast to ${pyStr(pyLen(recipients))} users...`));
  sent = 0;
  failed = 0;
  reply_markup = null;
  if (pyT((((__v17) => (pyT(__v17) ? (pyGet(payload, "btn_url")) : __v17))(pyGet(payload, "btn_text"))))) {
      reply_markup = InlineKeyboardMarkup([[InlineKeyboardButton(pySub(payload, "btn_text"), { url: pySub(payload, "btn_url") })]]);
  }
  ptype = pyGet(payload, "type");
  for (const uid of pyIter(recipients)) {
      try {
            if (pyT((pyEq(ptype, "forward")))) {
                    void ((await context.bot.copy_message({ chat_id: uid, from_chat_id: pySub(payload, "from_chat_id"), message_id: pySub(payload, "message_id") })));
            } else if (pyT((pyEq(ptype, "photo")))) {
                    void ((await context.bot.send_photo({ chat_id: uid, photo: pySub(payload, "file_id"), caption: pyGet(payload, "caption", ""), reply_markup: reply_markup })));
            } else if (pyT((pyEq(ptype, "video")))) {
                    void ((await context.bot.send_video({ chat_id: uid, video: pySub(payload, "file_id"), caption: pyGet(payload, "caption", ""), reply_markup: reply_markup })));
            } else if (pyT((pyEq(ptype, "document")))) {
                    void ((await context.bot.send_document({ chat_id: uid, document: pySub(payload, "file_id"), caption: pyGet(payload, "caption", ""), reply_markup: reply_markup })));
            } else {
                    void ((await context.bot.send_message({ chat_id: uid, text: pyGet(payload, "text", ""), reply_markup: reply_markup })));
            }
            sent += 1;
            void ((await pySleep(0.04)));
      } catch (__e) {
            failed += 1;
      }
  }
  void ((await query.edit_message_text(`✅ **Broadcast Complete!**
━━━━━━━━━━━━━━━━━━━━

📤 **Sent:** ${pyStr(sent)}
❌ **Failed:** ${pyStr(failed)}`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]]) })));
}

export async function handle_admin_coupon_creation_wizard(update, context) {
  let back_kb, keyboard, low, step, text, user_id, wiz;
  text = pyStrip(update.message.text);
  step = pyGet(context.user_data, "coupon_wiz_step");
  wiz = pyGet(context.user_data, "wiz_coupon", {  });
  user_id = update.effective_user.id;
  if (pyT((pyEq(text, "/cancel")))) {
      context.user_data["admin_add_coupon_wizard"] = false;
      pyPop(context.user_data, "wiz_coupon", null);
      pyPop(context.user_data, "coupon_wiz_step", null);
      pyPop(context.user_data, "wiz_coupon_page", null);
      back_kb = [[InlineKeyboardButton("🎟 Coupon Management", { callback_data: "adm_coupons" })]];
      void ((await update.message.reply_text("✕ Coupon creation aborted.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
      return;
  }
  if (pyT((pyEq(step, "code")))) {
      wiz["code"] = pyUpper(text);
      context.user_data["wiz_coupon"] = wiz;
      context.user_data["coupon_wiz_step"] = "type_select";
      keyboard = [[InlineKeyboardButton("💵 Fixed Discount (BDT)", { callback_data: "cpnwiz_type_fixed" }), InlineKeyboardButton("📊 Percentage Discount (%)", { callback_data: "cpnwiz_type_percentage" })]];
      void ((await update.message.reply_text(`🏷️ **Coupon Code:** \`${pyStr(pySub(wiz, "code"))}\`

👇 **Select Discount Type:**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(step, "discount_value")))) {
      try {
            wiz["discount_value"] = pyInt(text);
      } catch (__e) {
            void ((await update.message.reply_text("⚠️ Please enter a valid number:")));
            return;
      }
      context.user_data["wiz_coupon"] = wiz;
      context.user_data["coupon_wiz_step"] = "min_purchase";
      void ((await update.message.reply_text("💰 **Minimum purchase amount required to use this coupon?**\n(Enter `0` if no minimum limit):", { parse_mode: "Markdown" })));
  } else if (pyT((pyEq(step, "min_purchase")))) {
      try {
            wiz["min_purchase"] = pyInt(text);
      } catch (__e) {
            wiz["min_purchase"] = 0;
      }
      context.user_data["wiz_coupon"] = wiz;
      context.user_data["coupon_wiz_step"] = "scope_select";
      keyboard = [[InlineKeyboardButton("🌐 All Courses", { callback_data: "cpnwiz_scope_all" })], [InlineKeyboardButton("📂 By Category", { callback_data: "cpnwiz_scope_cat" })], [InlineKeyboardButton("🎯 Specific Courses (Multi-select)", { callback_data: "cpnwiz_scope_course" })], [InlineKeyboardButton("📖 Specific E-Books (Multi-select)", { callback_data: "cpnwiz_scope_ebook" })]];
      void ((await update.message.reply_text("🎯 **Coupon Scope:**\n━━━━━━━━━━━━━━━━━━━━\nThis coupon will be applicable to which item(s)?\n(Specific = select 1 or multiple courses / e-books)", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(step, "usage_limit")))) {
      try {
            wiz["usage_limit"] = pyInt(text);
      } catch (__e) {
            wiz["usage_limit"] = 100;
      }
      context.user_data["wiz_coupon"] = wiz;
      context.user_data["coupon_wiz_step"] = "per_user_limit";
      void ((await update.message.reply_text("👤 **Per-User Usage Limit / একই ID কয়বার ব্যবহার করতে পারবে?**\n━━━━━━━━━━━━━━━━━━━━\nHow many times can ONE user / same ID use this coupon?\n👉 `1` = একই ID মাত্র 1 বার ব্যবহার করতে পারবে\n👉 `0` = Unlimited (যতবার খুশি)\n\nশুধু সংখ্যা লিখে পাঠান (যেমন: `1`, `2`, `5`, `0`):", { parse_mode: "Markdown" })));
  } else if (pyT((pyEq(step, "per_user_limit")))) {
      low = pyLower(pyStrip(text));
      if (pyT((pyContains(["unlimited", "unli", "inf", "infinity"], low)))) {
            wiz["per_user_limit"] = 0;
      } else {
            try {
                    wiz["per_user_limit"] = pyInt(text);
            } catch (__e) {
                    wiz["per_user_limit"] = 1;
            }
      }
      context.user_data["wiz_coupon"] = wiz;
      context.user_data["coupon_wiz_step"] = "referral_select";
      keyboard = [[InlineKeyboardButton("✅ Yes (Enable Reward)", { callback_data: "cpnwiz_ref_yes" }), InlineKeyboardButton("✕ No (No Reward)", { callback_data: "cpnwiz_ref_no" })]];
      void ((await update.message.reply_text("🎁 **Want to add Referral/Affiliate Reward?**\n━━━━━━━━━━━━━━━━━━━━\nWill any specific partner/user get a commission/reward from the sales made using this coupon?", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(step, "reward_user_id")))) {
      try {
            wiz["reward_user_id"] = pyInt(text);
      } catch (__e) {
            void ((await update.message.reply_text("⚠️ Please enter a valid Telegram User ID (Numeric):")));
            return;
      }
      context.user_data["wiz_coupon"] = wiz;
      context.user_data["coupon_wiz_step"] = "reward_type_select";
      keyboard = [[InlineKeyboardButton("💵 Fixed Amount (BDT)", { callback_data: "cpnwiz_reftype_fixed" }), InlineKeyboardButton("📊 Percentage (%)", { callback_data: "cpnwiz_reftype_percentage" })]];
      void ((await update.message.reply_text(`👤 **User ID:** \`${pyStr(pySub(wiz, "reward_user_id"))}\`

👇 **Select Commission/Reward Type:**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(step, "reward_amount")))) {
      try {
            wiz["reward_amount"] = pyInt(text);
      } catch (__e) {
            wiz["reward_amount"] = 0;
      }
      context.user_data["wiz_coupon"] = wiz;
      void ((await finalize_coupon_creation(update.message, context, user_id)));
  }
}

export async function finalize_coupon_creation(target, context, user_id) {
  let cat, cid, cids, cname, cnames, code, dtype, dtype_str;
  let dval, i, keyboard, limit, many_kind, min_p, more, msg;
  let n, n_eb, one_kind, per_user_lim, per_user_str, r_amt, r_type, r_uid;
  let ref_info, ref_on, rtype_s, scope_str, shown, wiz;
  wiz = pyGet(context.user_data, "wiz_coupon", {  });
  code = pyGet(wiz, "code", "COUPON");
  dtype = pyGet(wiz, "discount_type", "fixed");
  dval = pyGet(wiz, "discount_value", 0);
  min_p = pyGet(wiz, "min_purchase", 0);
  cat = pyGet(wiz, "applicable_category", "All");
  cid = pyGet(wiz, "applicable_course_id");
  cname = pyGet(wiz, "applicable_course_name");
  cids = (((__v18) => (pyT(__v18) ? __v18 : ((pyT(cid) ? ([cid]) : ([])))))(pyGet(wiz, "applicable_course_ids", [])));
  cnames = (((__v19) => (pyT(__v19) ? __v19 : ((pyT(cname) ? ([cname]) : ([])))))(pyGet(wiz, "applicable_course_names", [])));
  limit = pyGet(wiz, "usage_limit", 100);
  per_user_lim = pyGet(wiz, "per_user_limit", 1);
  ref_on = pyGet(wiz, "enable_referral_reward", false);
  r_uid = pyGet(wiz, "reward_user_id");
  r_type = pyGet(wiz, "reward_type", "fixed");
  r_amt = pyGet(wiz, "reward_amount", 0);
  db.add_coupon({ code: code, discount_type: dtype, discount_value: dval, min_purchase: min_p, applicable_category: cat, applicable_course_id: cid, applicable_course_name: cname, applicable_course_ids: cids, applicable_course_names: cnames, usage_limit: limit, per_user_limit: per_user_lim, enable_referral_reward: ref_on, reward_user_id: r_uid, reward_type: r_type, reward_amount: r_amt });
  context.user_data["admin_add_coupon_wizard"] = false;
  pyPop(context.user_data, "wiz_coupon", null);
  pyPop(context.user_data, "coupon_wiz_step", null);
  pyPop(context.user_data, "wiz_coupon_page", null);
  if (pyT((((__v21) => (pyT(__v21) ? (((__v20) => (pyT(__v20) ? (cnames) : __v20))((pyEq(pyLen(cids), 1)))) : __v21))(cids)))) {
      one_kind = (pyT(pyStart(pyStr(pySub(cids, 0)), "EB-")) ? ("E-Book") : ("Course"));
      scope_str = `🎯 ${pyStr(one_kind)}: \`${pyStr(pySub(cnames, 0))}\``;
  } else if (pyT((((__v22) => (pyT(__v22) ? (((pyLen(cids) > 1))) : __v22))(cids)))) {
      shown = pyJoin(", ", ((() => { const __acc = []; for (const n of pyIter(pySlice(cnames, null, 3, null))) { __acc.push(`\`${pyStr(pySlice(n, null, 18, null))}\``); } return __acc; })()));
      more = (pyT(((pyLen(cnames) > 3))) ? (` +${pyStr((pyLen(cnames) - 3))} more`) : (""));
      n_eb = pySum(((() => { const __acc = []; for (const i of pyIter(cids)) { if (!pyT(pyStart(pyStr(i), "EB-"))) continue; __acc.push(1); } return __acc; })()));
      many_kind = (pyT((((__v23) => (pyT(__v23) ? ((pyEq(n_eb, pyLen(cids)))) : __v23))(n_eb))) ? ("E-Books") : ((pyT(n_eb) ? ("Items") : ("Courses"))));
      scope_str = `🎯 ${pyStr(many_kind)} (${pyStr(pyLen(cids))}): ${pyStr(shown)}${pyStr(more)}`;
  } else if (pyT((((__v24) => (pyT(__v24) ? (((!pyContains(["All", "Specific"], cat)))) : __v24))(cat)))) {
      scope_str = `📂 Category: \`${pyStr(cat)}\``;
  } else {
      scope_str = "🌐 All Courses (Global)";
  }
  if (pyT((((__v25) => (pyT(__v25) ? (r_uid) : __v25))(ref_on)))) {
      rtype_s = (pyT((pyEq(r_type, "fixed"))) ? ("৳ (Fixed)") : ("% (Percentage)"));
      ref_info = `
🎁 **Referral Reward:** ${pyStr(r_amt)} ${pyStr(rtype_s)} ➡️ User ID: \`${pyStr(r_uid)}\``;
  } else {
      ref_info = "\n🎁 **Referral Reward:** Disabled";
  }
  dtype_str = (pyT((pyEq(dtype, "fixed"))) ? (`${pyStr(dval)} ৳ (Fixed)`) : (`${pyStr(dval)}% (Percentage)`));
  per_user_str = (pyT((pyEq(per_user_lim, 0))) ? ("Unlimited ♾️") : (`${pyStr(per_user_lim)} time(s) per ID`));
  msg = `🎉 **Coupon created successfully!**
━━━━━━━━━━━━━━━━━━━━

🏷️ **Coupon Code:** \`${pyStr(code)}\`
💰 **Discount:** ${pyStr(dtype_str)}
🎯 **Scope:** ${pyStr(scope_str)}
🛒 **Minimum Order:** ${pyStr(min_p)} ৳
🔢 **Total Usage Limit:** ${pyStr(limit)} times
👤 **Per-ID Limit:** ${pyStr(per_user_str)}${pyStr(ref_info)}`;
  keyboard = [[InlineKeyboardButton("📋 All Coupons List", { callback_data: "adm_list_coupons" })], [InlineKeyboardButton("➕ Create Another Coupon", { callback_data: "adm_add_coupon_start" })], [InlineKeyboardButton("« Coupon Management", { callback_data: "adm_coupons" })]];
  if (pyT(pyHasAttr(target, "reply_text"))) {
      void ((await target.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await target.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function show_course_edit_dashboard(query, course_id, notice) {
  if (notice === undefined) notice = ("");
  let _dash_groups, _g_lines, _group_line, category, course, folder_path, g, has_img;
  let i, image, keyboard, msg, price_str, status_tag, subcategory, toggle_label;
  course = db.get_course(course_id);
  if (pyT((!pyT(course)))) {
      void ((await query.answer("❌ Course not found!", { show_alert: true })));
      return;
  }
  price_str = (pyT(((pyGet(course, "price", 0) > 0))) ? (`${pyStr(pySub(course, "price"))} ৳`) : ("Free 🎁"));
  has_img = (pyT(pyGet(course, "image")) ? ("Yes ✅") : ("No ❌"));
  status_tag = (pyT((pyEq(pyGet(course, "status"), "inactive"))) ? ("🔴 Disabled (Hidden from Students)") : ("🟢 Enabled (Visible to Students)"));
  toggle_label = (pyT((pyEq(pyGet(course, "status"), "inactive"))) ? ("🟢 Enable Course") : ("🔴 Disable Course"));
  folder_path = pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > ");
  if (pyT((!pyT(folder_path)))) {
      category = pyStrip(pyStr(pyGet(course, "category", "")));
      subcategory = pyStrip(pyStr(pyGet(course, "subcategory", "")));
      folder_path = (pyT((((__v26) => (pyT(__v26) ? __v26 : ((pyEq(pyLower(subcategory), "general")))))((!pyT(subcategory))))) ? (category) : (`${pyStr(category)} > ${pyStr(subcategory)}`));
  }
  _dash_groups = db.get_course_group_list(course);
  if (pyT(_dash_groups)) {
      _g_lines = pyJoin("\n", ((() => { const __acc = []; for (const [i, g] of pyIter(pyEnumerate(_dash_groups, 1))) { __acc.push(`   ${pyStr(i)}. ${pyStr(pySub(g, "label"))} — \`${pyStr(pySub(g, "id"))}\``); } return __acc; })()));
      _group_line = `👥 **Groups (${pyStr(pyLen(_dash_groups))}):**
${pyStr(_g_lines)}`;
  } else {
      _group_line = "👥 **Groups:** <i>Not configured</i>";
  }
  msg = `${pyStr(notice)}📖 **Course Details & Management**
━━━━━━━━━━━━━━━━━━━━

📖 **Title:** ${pyStr(pySub(course, "name"))}
💰 **Price:** ${pyStr(price_str)}
📂 **Category:** ${pyStr(pyGet(course, "category", "N/A"))}
🎯 **Sub-Category:** ${pyStr(pyGet(course, "subcategory", pyGet(course, "program", "N/A")))}
👨‍🏫 **Instructor:** ${pyStr(pyGet(course, "instructor", "N/A"))}
🔗 **Access Link:** ${pyStr(pyGet(course, "access_link", "N/A"))}
${pyStr(_group_line)}
🖼️ **Banner Photo:** ${pyStr(has_img)}
✨ **Status:** ${pyStr(status_tag)}

📝 **Description:**
${pyStr(pyGet(course, "description", "N/A"))}

✨ **Features:**
${pyStr(pyGet(course, "features", "N/A"))}

👇 **Select an option to manage this course:**`;
  keyboard = [[InlineKeyboardButton("✏️ Edit Details", { callback_data: `adm_edmenu_${pyStr(course_id)}` }), InlineKeyboardButton(toggle_label, { callback_data: `adm_course_toggle_${pyStr(course_id)}` })], [InlineKeyboardButton("📋 Copy (Clone)", { callback_data: `adm_course_clone_${pyStr(course_id)}` }), InlineKeyboardButton("🗑️ Delete Course", { callback_data: `adm_delcourse_${pyStr(course_id)}` })], [InlineKeyboardButton("✂️ Cut (Move Course)", { callback_data: `adm_course_cut_${pyStr(course_id)}` })], [InlineKeyboardButton("« Back to Folder", { callback_data: `adm_dir_${pyStr(folder_path)}` })]];
  image = pyGet(course, "image");
  if (pyT(image)) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      try {
            void ((await query.message.reply_photo({ photo: image, caption: msg, parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (__e) {
            void ((await query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function handle_admin_category_creation(update, context) {
  let added, back_kb, keyboard, text, user_id;
  text = pyStrip(update.message.text);
  user_id = update.effective_user.id;
  context.user_data["admin_add_category"] = false;
  if (pyT((pyEq(text, "/cancel")))) {
      back_kb = [[InlineKeyboardButton("📂 Categories Management", { callback_data: "adm_categories" })]];
      void ((await update.message.reply_text("✕ Aborted.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
      return;
  }
  added = db.add_category(text);
  if (pyT(added)) {
      keyboard = [[InlineKeyboardButton(`➕ Add Sub-Category to '${pyStr(text)}'`, { callback_data: `adm_addsub_${pyStr(text)}` })], [InlineKeyboardButton(`📂 Manage '${pyStr(text)}'`, { callback_data: `adm_catm_${pyStr(text)}` })], [InlineKeyboardButton("« All Categories", { callback_data: "adm_categories" })]];
      void ((await update.message.reply_text(`✅ **New Category '${pyStr(text)}' created successfully!**

💡 No automatic sub-categories were created. You can add sub-categories as needed:`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await update.message.reply_text(`ℹ️ Category '${pyStr(text)}' already exists!`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("📂 Categories Management", { callback_data: "adm_categories" })]]) })));
  }
}

export async function handle_admin_subcategory_creation(update, context) {
  let added, back_kb, keyboard, new_path, parent, text, user_id;
  text = pyStrip(update.message.text);
  user_id = update.effective_user.id;
  parent = (((__v27) => (pyT(__v27) ? __v27 : (pyGet(context.user_data, "admin_subcat_target_cat", ""))))(pyGet(context.user_data, "admin_subcat_target_parent")));
  context.user_data["admin_add_subcat"] = false;
  pyPop(context.user_data, "admin_subcat_target_parent", null);
  pyPop(context.user_data, "admin_subcat_target_cat", null);
  if (pyT((pyEq(text, "/cancel")))) {
      back_kb = [(pyT(parent) ? ([InlineKeyboardButton(`« Back to '${pyStr((((__v28) => (pyT(__v28) ? __v28 : ("All Categories")))(parent)))}'`, { callback_data: `adm_dir_${pyStr(parent)}` })]) : ([InlineKeyboardButton("« All Categories", { callback_data: "adm_categories" })]))];
      void ((await update.message.reply_text("✕ Aborted.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
      return;
  }
  added = db.add_sub_folder(parent, text);
  new_path = (pyT(parent) ? (`${pyStr(parent)} > ${pyStr(text)}`) : (text));
  if (pyT(added)) {
      void ((await update.message.reply_text(`✅ **Category added successfully:** \`${pyStr(text)}\`
📁 **Location:** \`${pyStr(new_path)}\``, { parse_mode: "Markdown" })));
          class FolderListQuery {
                constructor(message, user) {
                        this.message = message;
                        this.from_user = user;
                        this.id = "0";
                }
                async answer(...__args) {
                }
                async edit_message_text(...__args) {
                        return ((await this.message.reply_text(...__args)));
                }
          }
      void ((await render_admin_folder_directory(FolderListQuery(update.message, update.effective_user), context, parent)));
  } else {
      keyboard = [[InlineKeyboardButton(`« Back to '${pyStr((((__v29) => (pyT(__v29) ? __v29 : ("All Categories")))(parent)))}'`, { callback_data: `adm_dir_${pyStr(parent)}` })], [InlineKeyboardButton("📂 All Categories", { callback_data: "adm_categories" })]];
      void ((await update.message.reply_text(`ℹ️ Folder / category \`${pyStr(text)}\` already exists in this location.`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function handle_admin_ebook_subcategory_creation(update, context) {
  let added, back_kb, keyboard, new_path, parent, text, user_id;
  text = pyStrip(update.message.text);
  user_id = update.effective_user.id;
  parent = (((__v30) => (pyT(__v30) ? __v30 : ("")))(pyGet(context.user_data, "admin_eb_subcat_target_parent")));
  context.user_data["admin_add_eb_subcat"] = false;
  pyPop(context.user_data, "admin_eb_subcat_target_parent", null);
  if (pyT((pyEq(text, "/cancel")))) {
      back_kb = [(pyT(parent) ? ([InlineKeyboardButton(`« Back to '${pyStr((((__v31) => (pyT(__v31) ? __v31 : ("All Categories")))(parent)))}'`, { callback_data: `adm_ebdir_${pyStr(parent)}` })]) : ([InlineKeyboardButton("« All Categories", { callback_data: "adm_ebooks" })]))];
      void ((await update.message.reply_text("✕ Aborted.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
      return;
  }
  added = db.add_ebook_sub_folder(parent, text);
  new_path = (pyT(parent) ? (`${pyStr(parent)} > ${pyStr(text)}`) : (text));
  if (pyT(added)) {
      keyboard = [[InlineKeyboardButton(`📁 Open '${pyStr(text)}' Folder`, { callback_data: `adm_ebdir_${pyStr(new_path)}` })], [InlineKeyboardButton(`➕ Add E-Book in '${pyStr(text)}'`, { callback_data: `adm_addebook_dir_${pyStr(new_path)}` })], [InlineKeyboardButton(`➕ Add Another Sub-Folder in '${pyStr((((__v32) => (pyT(__v32) ? __v32 : ("Root")))(parent)))}'`, { callback_data: "adm_ebfld_addfolder" })], [InlineKeyboardButton(`« Back to '${pyStr((((__v33) => (pyT(__v33) ? __v33 : ("All Categories")))(parent)))}'`, { callback_data: `adm_ebdir_${pyStr(parent)}` })]];
      void ((await update.message.reply_text(`✅ **New E-Book Folder '${pyStr(text)}' created successfully!**

📁 **Location:** \`${pyStr(new_path)}\``, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      keyboard = [[InlineKeyboardButton(`« Back to '${pyStr((((__v34) => (pyT(__v34) ? __v34 : ("All Categories")))(parent)))}'`, { callback_data: `adm_ebdir_${pyStr(parent)}` })], [InlineKeyboardButton("📂 All Categories", { callback_data: "adm_ebooks" })]];
      void ((await update.message.reply_text(`ℹ️ Folder '${pyStr(text)}' already exists!`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export function parse_quick_course_template(text, photo_id) {
  if (photo_id === undefined) photo_id = ("");
  let accumulated_lines, content, current_key, data, digits, k, line, line_s;
  let lines, m, matched_content, matched_key, pat, patterns;
  if (pyT((!pyT(text)))) {
      return (null);
  }
  patterns = { name: "^(?:কোর্সের\\s*নাম|কোর্স\\s*নাম|নাম|course\\s*name|course\\s*title|title|name)\\s*[:：\\-]\\s*", price: "^(?:কোর্স\\s*মূল্য|মূল্য|ফি|টাকা|price|fee|cost)\\s*[:：\\-]\\s*", category: "^(?:ক্যাটাগরি|ক্যাটাগরী|ক্লাস|ব্যাচ|category|batch|class)\\s*[:：\\-]\\s*", subcategory: "^(?:সাব-ক্যাটাগরি|সাব\\s*ক্যাটাগরি|সাবক্যাটাগরি|প্রোগ্রাম|subcategory|sub-category|sub_category|program|sub)\\s*[:：\\-]\\s*", link: "^(?:এক্সেস\\s*লিংক|চ্যানেল\\s*লিংক|লিংক|access\\s*link|channel\\s*link|link|url)\\s*[:：\\-]\\s*", description: "^(?:বিবরণ|কোর্সের\\s*বিবরণ|ফিচার্স|ফিচার|details|description|desc|features)\\s*[:：\\-]\\s*" };
  lines = pySplit(pyStrip(text), "\n", -1);
  data = {  };
  current_key = null;
  accumulated_lines = [];
  const flush_key = (key, lines_list) => {
    let content, data, digits;
    content = pyStrip(pyJoin("\n", lines_list));
    if (pyT((!pyT(key)))) {
        return;
    }
    if (pyT((pyEq(key, "name")))) {
        data["name"] = content;
    } else if (pyT((pyEq(key, "price")))) {
        digits = pyReFindAll("\\d+", content);
        data["price"] = (pyT(digits) ? (pyInt(pySub(digits, 0))) : (0));
    } else if (pyT((pyEq(key, "category")))) {
        data["category"] = content;
    } else if (pyT((pyEq(key, "subcategory")))) {
        data["subcategory"] = content;
    } else if (pyT((pyEq(key, "link")))) {
        data["access_link"] = content;
    } else if (pyT((pyEq(key, "description")))) {
        data["description"] = content;
    }
  };
  for (const line of pyIter(lines)) {
      line_s = pyStrip(line);
      if (pyT((((__v35) => (pyT(__v35) ? ((!pyT(current_key))) : __v35))((!pyT(line_s)))))) {
            continue;
      }
      matched_key = null;
      matched_content = "";
      for (const [k, pat] of pyIter(pyItems(patterns))) {
            m = pyReMatch(pat, line_s);
            if (pyT(m)) {
                    matched_key = k;
                    matched_content = pySlice(line_s, m.end(), null, null);
                    break;
            }
      }
      if (pyT(matched_key)) {
            if (pyT(current_key)) {
                    flush_key(current_key, accumulated_lines);
            }
            current_key = matched_key;
            accumulated_lines = (pyT(matched_content) ? ([matched_content]) : ([]));
      } else if (pyT(current_key)) {
            pyAppend(accumulated_lines, line);
      }
  }
  if (pyT(current_key)) {
      flush_key(current_key, accumulated_lines);
  }
  if (pyT((((__v38) => (pyT(__v38) ? ((((__v37) => (pyT(__v37) ? __v37 : (((__v36) => (pyT(__v36) ? __v36 : ((pyContains(data, "category")))))((pyContains(data, "description"))))))((pyContains(data, "price"))))) : __v38))((pyContains(data, "name")))))) {
      data["image"] = (((__v39) => (pyT(__v39) ? __v39 : ("")))(photo_id));
      if (pyT(((!pyContains(data, "price"))))) {
            data["price"] = 0;
      }
      if (pyT((((__v40) => (pyT(__v40) ? __v40 : ((!pyT(pySub(data, "description"))))))(((!pyContains(data, "description"))))))) {
            data["description"] = "কোর্সের বিস্তারিত তথ্য শীঘ্রই যুক্ত করা হবে।";
      }
      data["features"] = pySub(data, "description");
      if (pyT(((!pyContains(data, "access_link"))))) {
            data["access_link"] = "";
      }
      if (pyT(((!pyContains(data, "instructor"))))) {
            data["instructor"] = "অভিজ্ঞ শিক্ষকবৃন্দ";
      }
      return (data);
  }
  return (null);
}

export async function handle_admin_course_creation(update, context) {
  let back_kb, caption, cat_name, check_str, course_name, digits, field, g;
  let gid, groups, k_cancel, k_img, k_link, label, low, msg;
  let new_course, orig, p_img, p_text, photo, photo_id, price_tag, price_val;
  let quick_course, step, subcats, text, user_id;
  msg = update.message;
  text = (pyT((((__v41) => (pyT(__v41) ? (msg.text) : __v41))(msg))) ? (pyStrip(msg.text)) : (""));
  caption = (pyT((((__v42) => (pyT(__v42) ? (msg.caption) : __v42))(msg))) ? (pyStrip(msg.caption)) : (""));
  photo = msg.photo;
  user_id = update.effective_user.id;
  step = pyGet(context.user_data, "course_step");
  if (pyT((((__v43) => (pyT(__v43) ? __v43 : ((pyEq(caption, "/cancel")))))((pyEq(text, "/cancel")))))) {
      context.user_data["admin_add_course"] = false;
      pyPop(context.user_data, "new_course", null);
      pyPop(context.user_data, "course_step", null);
      orig = pyPop(context.user_data, "course_origin_callback", "adm_categories");
      back_kb = [[InlineKeyboardButton("« Cancel", { callback_data: orig })]];
      void ((await update.message.reply_text("✕ Course creation cancelled.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
      return;
  }
  check_str = (pyT(caption) ? (caption) : (text));
  photo_id = (pyT(photo) ? (pySub(photo, (-(1))).file_id) : (""));
  if (pyT((((__v44) => (pyT(__v44) ? __v44 : ((!pyT(step)))))((pyEq(step, "init_choice")))))) {
      quick_course = parse_quick_course_template(check_str, photo_id);
      if (pyT(quick_course)) {
            context.user_data["new_course"] = quick_course;
            if (pyT((!pyT(pyGet(quick_course, "category"))))) {
                    context.user_data["course_step"] = "category_select";
                    void ((await send_admin_category_selector(update.message, context, "📂 **কোর্স ক্যাটাগরি নির্বাচন করুন:**")));
                    return;
            } else if (pyT((!pyT(pyGet(quick_course, "subcategory"))))) {
                    context.user_data["course_step"] = "subcategory";
                    void ((await send_admin_subcategory_selector(update.message, context, pySub(quick_course, "category"))));
                    return;
            } else {
                    void ((await send_admin_course_preview(update.message, context, quick_course)));
                    return;
            }
      }
  }
  new_course = pyGet(context.user_data, "new_course", {  });
  if (pyT((((__v45) => (pyT(__v45) ? __v45 : ((pyEq(step, "name")))))((pyEq(step, "init_choice")))))) {
      course_name = (pyT(caption) ? (caption) : (text));
      if (pyT((!pyT(course_name)))) {
            void ((await wizard_edit_or_reply(context, update, "⚠️ অনুগ্রহ করে কোর্সের নাম (Title) লিখে পাঠান:")));
            return;
      }
      new_course["name"] = course_name;
      if (pyT(photo_id)) {
            new_course["image"] = photo_id;
      }
      context.user_data["new_course"] = new_course;
      context.user_data["course_step"] = "price";
      k_cancel = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
      void ((await wizard_edit_or_reply(context, update, `📘 **Course:** ${pyStr(course_name)}

**Step 2 of 4 — Price (BDT)**
Send the price as a number. Send \`0\` for a free course.`, { reply_markup: InlineKeyboardMarkup(k_cancel) })));
  } else if (pyT((pyEq(step, "price")))) {
      digits = pyReFindAll("\\d+", text);
      if (pyT((!pyT(digits)))) {
            void ((await wizard_edit_or_reply(context, update, "⚠️ অনুগ্রহ করে সঠিক মূল্য লিখুন (যেমন: 400 বা ফ্রি হলে 0):")));
            return;
      }
      price_val = pyInt(pySub(digits, 0));
      new_course["price"] = price_val;
      context.user_data["new_course"] = new_course;
      context.user_data["course_step"] = "description";
      price_tag = (pyT(((price_val > 0))) ? (`৳${pyStr(price_val)}`) : ("Free 🎁"));
      k_cancel = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
      void ((await wizard_edit_or_reply(context, update, `💰 **Price:** ${pyStr(price_tag)}

**Step 3 of 4 — Description**
Send a short course description. You can write multiple lines.`, { reply_markup: InlineKeyboardMarkup(k_cancel) })));
  } else if (pyT((pyEq(step, "description")))) {
      if (pyT((!pyT(text)))) {
            void ((await wizard_edit_or_reply(context, update, "⚠️ অনুগ্রহ করে কোর্সের বিবরণ (Description) লিখে পাঠান:")));
            return;
      }
      new_course["description"] = text;
      new_course["features"] = text;
      new_course["instructor"] = "অভিজ্ঞ শিক্ষকবৃন্দ";
      context.user_data["new_course"] = new_course;
      if (pyT((((__v46) => (pyT(__v46) ? (pyGet(new_course, "subcategory")) : __v46))(pyGet(new_course, "category"))))) {
            if (pyT(((!pyContains(new_course, "access_link"))))) {
                    context.user_data["course_step"] = "link";
                    p_text = `📁 **Folder:** \`${pyStr(pySub(new_course, "category"))}\` ➔ \`${pyStr(pySub(new_course, "subcategory"))}\`
━━━━━━━━━━━━━━━━━━━━
**Step 4 of 4 — Access Link**
Send the Telegram or Drive link, or tap **Skip Link** to add it later.`;
                    k_link = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("⏭️ Skip Link", { callback_data: "adm_skip_link" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
                    void ((await wizard_edit_or_reply(context, update, p_text, { reply_markup: InlineKeyboardMarkup(k_link) })));
            } else if (pyT((!pyT(pyGet(new_course, "image"))))) {
                    context.user_data["course_step"] = "image";
                    p_img = `📁 **Folder:** \`${pyStr(pySub(new_course, "category"))}\` ➔ \`${pyStr(pySub(new_course, "subcategory"))}\`
━━━━━━━━━━━━━━━━━━━━
🖼️ **Final step — Banner Image (Optional)**
Send a photo, or tap **Skip Image** to publish without one.`;
                    k_img = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("⏭️ Skip Image", { callback_data: "adm_skip_img" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
                    void ((await wizard_edit_or_reply(context, update, p_img, { reply_markup: InlineKeyboardMarkup(k_img) })));
            } else {
                    void ((await send_admin_course_preview(update.message, context, new_course)));
            }
      } else if (pyT((((__v47) => (pyT(__v47) ? ((!pyT(pyGet(new_course, "subcategory")))) : __v47))(pyGet(new_course, "category"))))) {
            subcats = db.get_subcategories(pySub(new_course, "category"));
            if (pyT(subcats)) {
                    context.user_data["course_step"] = "subcategory";
                    void ((await send_admin_subcategory_selector(update.message, context, pySub(new_course, "category"))));
            } else {
                    new_course["subcategory"] = "General";
                    new_course["program"] = "general";
                    context.user_data["course_step"] = "link";
                    p_text = `📁 **Folder:** \`${pyStr(pySub(new_course, "category"))}\`
━━━━━━━━━━━━━━━━━━━━
**Step 4 of 4 — Access Link**
Send the Telegram or Drive link, or tap **Skip Link** to add it later.`;
                    k_link = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("⏭️ Skip Link", { callback_data: "adm_skip_link" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
                    void ((await wizard_edit_or_reply(context, update, p_text, { reply_markup: InlineKeyboardMarkup(k_link) })));
            }
      } else {
            context.user_data["course_step"] = "category_select";
            void ((await send_admin_category_selector(update.message, context, "📂 **ধাপ ৪/৬: ক্যাটাগরি নির্বাচন করুন:**")));
      }
  } else if (pyT((pyEq(step, "type_custom_cat")))) {
      if (pyT((!pyT(text)))) {
            void ((await wizard_edit_or_reply(context, update, "⚠️ ক্যাটাগরির নাম লিখে পাঠান:")));
            return;
      }
      db.add_category(text);
      new_course["category"] = text;
      context.user_data["new_course"] = new_course;
      context.user_data["course_step"] = "type_custom_sub";
      k_cancel = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
      void ((await wizard_edit_or_reply(context, update, `✅ নতুন ক্যাটাগরি \`${pyStr(text)}\` যোগ হয়েছে!

🎯 **ধাপ ৫/৬: এই ক্যাটাগরির জন্য সাব-ক্যাটাগরি লিখুন (যেমন: Academic বা Physics):**`, { reply_markup: InlineKeyboardMarkup(k_cancel) })));
  } else if (pyT((pyEq(step, "type_custom_sub")))) {
      if (pyT((!pyT(text)))) {
            void ((await wizard_edit_or_reply(context, update, "⚠️ সাব-ক্যাটাগরির নাম লিখে পাঠান:")));
            return;
      }
      cat_name = pyGet(new_course, "category", "General");
      db.add_subcategory(cat_name, text);
      new_course["subcategory"] = text;
      new_course["program"] = pyLower(text);
      context.user_data["new_course"] = new_course;
      if (pyT(((!pyContains(new_course, "access_link"))))) {
            context.user_data["course_step"] = "link";
            p_text = "🔗 **ধাপ ৬/৭: টেলিগ্রাম প্রাইভেট চ্যানেল বা ড্রাইভ এক্সেস লিংক পাঠান:**\n━━━━━━━━━━━━━━━━━━━━\n💡 লিংক না থাকলে বা পরে দিতে চাইলে নিচের স্কিপ বাটনে চাপুন:";
            k_link = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("⏭️ Skip Link (স্কিপ করুন)", { callback_data: "adm_skip_link" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
            void ((await wizard_edit_or_reply(context, update, p_text, { reply_markup: InlineKeyboardMarkup(k_link) })));
      } else if (pyT((!pyT(pyGet(new_course, "image"))))) {
            context.user_data["course_step"] = "image";
            p_img = "🖼️ **ধাপ ৭/৭: কোর্সের ব্যানার বা ছবি পাঠান:**\n━━━━━━━━━━━━━━━━━━━━\n💡 ছবি ছাড়া প্রকাশ করতে চাইলে নিচের স্কিপ বাটনে চাপুন:";
            k_img = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("⏭️ Skip Image (ছবি ছাড়া প্রকাশ)", { callback_data: "adm_skip_img" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
            void ((await wizard_edit_or_reply(context, update, p_img, { reply_markup: InlineKeyboardMarkup(k_img) })));
      } else {
            void ((await send_admin_course_preview(update.message, context, new_course)));
      }
  } else if (pyT((pyEq(step, "link")))) {
      if (pyT((((__v48) => (pyT(__v48) ? (((!pyEq(pyLower(text), "skip")))) : __v48))(text)))) {
            new_course["access_link"] = text;
      } else {
            new_course["access_link"] = "";
      }
      context.user_data["new_course"] = new_course;
      void ((await send_admin_group_id_prompt(update.message, context)));
  } else if (pyT((pyEq(step, "group_id")))) {
      low = pyLower(pyStrip((((__v49) => (pyT(__v49) ? __v49 : ("")))(text))));
      if (pyT((pyContains(["skip", "/skip"], low)))) {
            new_course["group_id"] = "";
            new_course["group_ids"] = [];
            context.user_data["new_course"] = new_course;
      } else if (pyT((pyContains(["/done", "done"], low)))) {
            context.user_data["new_course"] = new_course;
      } else {
            groups = pySetDefault(new_course, "group_ids", []);
            [label, gid] = parse_group_id_input(text, (pyLen(groups) + 1));
            if (pyT((!pyT(gid)))) {
                    void ((await wizard_edit_or_reply(context, update, "⚠️ সঠিক Group/Channel ID পাঠান (যেমন: `-1001234567890` বা `Cycle 1 = -1001234567890`):")));
                    return;
            }
            if (pyT(pyAny(((() => { const __acc = []; for (const g of pyIter(groups)) { __acc.push((pyEq(pyGet(g, "id"), gid))); } return __acc; })())))) {
                    void ((await wizard_edit_or_reply(context, update, `ℹ️ এই ID আগেই যোগ করা আছে: \`${pyStr(gid)}\`

আরো ID পাঠান বা **✅ Done** চাপুন:`)));
                    return;
            }
            pyAppend(groups, { label: label, id: gid });
            if (pyT((((__v50) => (pyT(__v50) ? ((!pyT(pyGet(new_course, "group_id")))) : __v50))((pyEq(pyLen(groups), 1)))))) {
                    new_course["group_id"] = gid;
            }
            context.user_data["new_course"] = new_course;
            void ((await send_admin_group_id_prompt(update.message, context)));
            return;
      }
      context.user_data["new_course"] = new_course;
      if (pyT(pyGet(new_course, "image"))) {
            void ((await send_admin_course_preview(update.message, context, new_course)));
      } else {
            context.user_data["course_step"] = "image";
            p_img = "🖼️ **ধাপ ৭/৭: কোর্সের ব্যানার বা ছবি পাঠান:**\n━━━━━━━━━━━━━━━━━━━━\n💡 ছবি ছাড়া প্রকাশ করতে চাইলে নিচের স্কিপ বাটনে চাপুন:";
            k_img = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("⏭️ Skip Image (ছবি ছাড়া প্রকাশ)", { callback_data: "adm_skip_img" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
            void ((await wizard_edit_or_reply(context, update, p_img, { reply_markup: InlineKeyboardMarkup(k_img) })));
      }
  } else if (pyT((pyEq(step, "image")))) {
      if (pyT(photo)) {
            new_course["image"] = pySub(photo, (-(1))).file_id;
      } else if (pyT((((__v52) => (pyT(__v52) ? ((((__v51) => (pyT(__v51) ? __v51 : (pyStart(text, "https://"))))(pyStart(text, "http://")))) : __v52))(text)))) {
            new_course["image"] = text;
      } else {
            new_course["image"] = "";
      }
      context.user_data["new_course"] = new_course;
      void ((await send_admin_course_preview(update.message, context, new_course)));
  } else if (pyT((pyEq(step, "image_edit")))) {
      if (pyT(photo)) {
            new_course["image"] = pySub(photo, (-(1))).file_id;
      } else if (pyT((((__v53) => (pyT(__v53) ? ((pyEq(pyLower(text), "remove"))) : __v53))(text)))) {
            new_course["image"] = "";
      } else if (pyT((((__v55) => (pyT(__v55) ? ((((__v54) => (pyT(__v54) ? __v54 : (pyStart(text, "https://"))))(pyStart(text, "http://")))) : __v55))(text)))) {
            new_course["image"] = text;
      }
      context.user_data["new_course"] = new_course;
      void ((await send_admin_course_preview(update.message, context, new_course)));
  } else if (pyT((((__v56) => (pyT(__v56) ? (pyStart(step, "edit_field_")) : __v56))(step)))) {
      field = pyReplace(step, "edit_field_", "");
      if (pyT((pyEq(field, "name")))) {
            new_course["name"] = text;
      } else if (pyT((pyEq(field, "price")))) {
            digits = pyReFindAll("\\d+", text);
            new_course["price"] = (pyT(digits) ? (pyInt(pySub(digits, 0))) : (0));
      } else if (pyT((pyEq(field, "desc")))) {
            new_course["description"] = text;
            new_course["features"] = text;
      } else if (pyT((pyEq(field, "link")))) {
            new_course["access_link"] = (pyT(((!pyEq(pyLower(text), "remove")))) ? (text) : (""));
      } else if (pyT((pyEq(field, "group_id")))) {
            new_course["group_id"] = (pyT(((!pyEq(pyLower(text), "remove")))) ? (text) : (""));
      }
      context.user_data["new_course"] = new_course;
      void ((await send_admin_course_preview(update.message, context, new_course)));
  }
}

export async function handle_admin_course_edit_input(update, context) {
  let cid, course, field, g, gid, groups, keyboard, label;
  let photo, raw, text, text_menu, upd, updated_data, user_id, val;
  text = (pyT(update.message.text) ? (pyStrip(update.message.text)) : (""));
  photo = update.message.photo;
  cid = pyGet(context.user_data, "admin_edit_cid");
  field = pyGet(context.user_data, "admin_edit_field");
  user_id = update.effective_user.id;
  if (pyT((pyEq(text, "/cancel")))) {
      pyPop(context.user_data, "admin_edit_cid", null);
      pyPop(context.user_data, "admin_edit_field", null);
      void ((await update.message.reply_text("✕ Edit cancelled.", { reply_markup: main_menu_keyboard(user_id) })));
      course = db.get_course(cid);
      if (pyT(course)) {
            text_menu = `✏️ **Edit Course: '${pyStr(pySub(course, "name"))}'**
━━━━━━━━━━━━━━━━━━━━
Select property to edit:`;
            keyboard = [[InlineKeyboardButton("✏️ Edit Title", { callback_data: `edprop_${pyStr(cid)}_name` }), InlineKeyboardButton("💰 Edit Price", { callback_data: `edprop_${pyStr(cid)}_price` })], [InlineKeyboardButton("📂 Edit Category", { callback_data: `edprop_${pyStr(cid)}_category` }), InlineKeyboardButton("🎯 Edit Sub-Category", { callback_data: `edprop_${pyStr(cid)}_subcategory` })], [InlineKeyboardButton("🖼️ Edit Banner", { callback_data: `edprop_${pyStr(cid)}_image` }), InlineKeyboardButton("🔗 Edit Link", { callback_data: `edprop_${pyStr(cid)}_access_link` })], [InlineKeyboardButton("👥 Manage Group IDs", { callback_data: `edprop_${pyStr(cid)}_groups` })], [InlineKeyboardButton("👨‍🏫 Edit Teacher", { callback_data: `edprop_${pyStr(cid)}_instructor` }), InlineKeyboardButton("📝 Edit Details", { callback_data: `edprop_${pyStr(cid)}_description` })], [InlineKeyboardButton("✂️ Move Course (Cut-Paste)", { callback_data: `adm_course_cut_${pyStr(cid)}` })], [InlineKeyboardButton("⬅️Back", { callback_data: `adm_edit_${pyStr(cid)}` })]];
            void ((await update.message.reply_text(text_menu, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
      return;
  }
  course = db.get_course(cid);
  if (pyT((!pyT(course)))) {
      pyPop(context.user_data, "admin_edit_cid", null);
      pyPop(context.user_data, "admin_edit_field", null);
      void ((await update.message.reply_text("❌ Course not found.", { reply_markup: main_menu_keyboard(user_id) })));
      return;
  }
  updated_data = {  };
  if (pyT((pyEq(field, "price")))) {
      try {
            val = pyInt(text);
            updated_data["price"] = val;
      } catch (__e) {
            void ((await update.message.reply_text("⚠️ Please enter a valid number (e.g. 250 or 0):")));
            return;
      }
  } else if (pyT((pyEq(field, "image")))) {
      if (pyT(photo)) {
            updated_data["image"] = pySub(photo, (-(1))).file_id;
      } else if (pyT((pyEq(pyLower(text), "remove")))) {
            updated_data["image"] = "";
      } else if (pyT(text)) {
            updated_data["image"] = text;
      }
  } else if (pyT((pyEq(field, "category")))) {
      updated_data["category"] = pyUpper(text);
  } else if (pyT((pyEq(field, "subcategory")))) {
      updated_data["subcategory"] = text;
      updated_data["program"] = pyLower(text);
  } else if (pyT((pyEq(field, "group_add")))) {
      groups = db.get_course_group_list(course);
      [label, gid] = parse_group_id_input(text, (pyLen(groups) + 1));
      if (pyT((!pyT(gid)))) {
            void ((await update.message.reply_text("⚠️ সঠিক Group/Channel ID পাঠান (যেমন: `-1001234567890`):")));
            return;
      }
      if (pyT(pyAny(((() => { const __acc = []; for (const g of pyIter(groups)) { __acc.push((pyEq(pySub(g, "id"), gid))); } return __acc; })())))) {
            void ((await update.message.reply_text(`ℹ️ এই ID আগেই আছে: \`${pyStr(gid)}\``)));
            return;
      }
      raw = (pyT(pyIsInstance(pyGet(course, "group_ids"), "list")) ? (pyGet(course, "group_ids")) : ([]));
      raw = (pyList(raw) + [{ label: label, id: gid }]);
      upd = { group_ids: raw };
      if (pyT((!pyT(pyStrip(pyStr((((__v57) => (pyT(__v57) ? __v57 : ("")))(pyGet(course, "group_id", ""))))))))) {
            upd["group_id"] = gid;
      }
      db.update_course(cid, upd);
      pyPop(context.user_data, "admin_edit_cid", null);
      pyPop(context.user_data, "admin_edit_field", null);
      void ((await update.message.reply_text(`✅ **Added:** \`${pyStr(label)}\` — \`${pyStr(gid)}\``, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("➕ Add Another", { callback_data: `adm_addgroup_${pyStr(cid)}` })], [InlineKeyboardButton("👥 Group List", { callback_data: `edprop_${pyStr(cid)}_groups` })], [InlineKeyboardButton("⬅️Back", { callback_data: `adm_edit_${pyStr(cid)}` })]]) })));
      return;
  } else {
      if (pyT((!pyT(text)))) {
            void ((await update.message.reply_text("⚠️ Please enter text:")));
            return;
      }
      updated_data[field] = text;
  }
  db.update_course(cid, updated_data);
  pyPop(context.user_data, "admin_edit_cid", null);
  pyPop(context.user_data, "admin_edit_field", null);
  void ((await update.message.reply_text(`✅ **'${pyStr(pySub(course, "name"))}' updated successfully!**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("✏️ Edit this course again", { callback_data: `adm_edit_${pyStr(cid)}` })], [InlineKeyboardButton("« All Courses", { callback_data: "adm_list_courses" })], [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]]) })));
}

export async function show_ebook_edit_dashboard(query, ebook_id, notice) {
  if (notice === undefined) notice = ("");
  let _dash_files, eb, keyboard, msg, price_str, source;
  eb = db.get_ebook(ebook_id);
  if (pyT((!pyT(eb)))) {
      void ((await query.answer("❌ E-Book not found!", { show_alert: true })));
      return;
  }
  price_str = (pyT(((pyGet(eb, "price", 0) > 0))) ? (`${pyStr(pyGet(eb, "price", 0))} ৳`) : ("Free 🎁"));
  _dash_files = _ebook_get_files(eb);
  if (pyT(((pyLen(_dash_files) > 1)))) {
      source = `📄 ${pyStr(pyLen(_dash_files))} PDF Files (${pyStr(pySlice(pyStr((((__v58) => (pyT(__v58) ? __v58 : ("Document")))(pyGet(pySub(_dash_files, 0), "file_name")))), null, 24, null))} +${pyStr((pyLen(_dash_files) - 1))})`;
  } else if (pyT(pyGet(eb, "file_id"))) {
      source = `📄 PDF File (${pyStr(pyGet(eb, "file_name", "Document"))})`;
  } else {
      source = (((__v59) => (pyT(__v59) ? __v59 : ("None")))(pyGet(eb, "access_link")));
  }
  msg = `${pyStr(notice)}📖 **E-Book Details & Management**
━━━━━━━━━━━━━━━━━━━━

🆔 **ID:** \`${pyStr(ebook_id)}\`
📖 **Title:** ${pyStr(pyGet(eb, "name", "N/A"))}
💰 **Price:** ${pyStr(price_str)}
📂 **Category:** ${pyStr(pyGet(eb, "category", "General"))}
📁 **File / Link:** ${pyStr(source)}

📝 **Description:**
${pyStr(pyGet(eb, "description", "প্রিমিয়াম ই-বুক ও স্টাডি মেটেরিয়াল।"))}

👇 **Select an option to Edit or Delete:**`;
  keyboard = [[InlineKeyboardButton("✏️ Edit E-Book", { callback_data: `adm_editeb_${pyStr(ebook_id)}` }), InlineKeyboardButton("✕ Delete E-Book", { callback_data: `adm_deleb_${pyStr(ebook_id)}` })], [InlineKeyboardButton("« All E-Books", { callback_data: "adm_list_ebooks" })]];
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export function _ebook_append_file(eb_data, file_id, file_name) {
  let f, files;
  files = pyGet(eb_data, "files");
  if (pyT((!pyT(pyIsInstance(files, "list"))))) {
      files = [];
      if (pyT(pyGet(eb_data, "file_id"))) {
            pyAppend(files, { file_id: pyGet(eb_data, "file_id"), file_name: pyGet(eb_data, "file_name", "document.pdf") });
      }
  }
  if (pyT((((__v61) => (pyT(__v61) ? ((!pyT(pyAny(((() => { const __acc = []; for (const f of pyIter(files)) { __acc.push((((__v60) => (pyT(__v60) ? ((pyEq(pyGet(f, "file_id"), file_id))) : __v60))(pyIsInstance(f, "dict")))); } return __acc; })()))))) : __v61))(file_id)))) {
      pyAppend(files, { file_id: file_id, file_name: (((__v62) => (pyT(__v62) ? __v62 : ("document.pdf")))(file_name)) });
  }
  eb_data["files"] = files;
  if (pyT(files)) {
      eb_data["file_id"] = pyGet(pySub(files, 0), "file_id", "");
      eb_data["file_name"] = pyGet(pySub(files, 0), "file_name", "document.pdf");
  }
  return (pyLen(files));
}

export function _ebook_get_files(eb) {
  let f, files, valid;
  if (pyT((!pyT(pyIsInstance(eb, "dict"))))) {
      return ([]);
  }
  files = pyGet(eb, "files");
  if (pyT((((__v63) => (pyT(__v63) ? (files) : __v63))(pyIsInstance(files, "list"))))) {
      valid = ((() => { const __acc = []; for (const f of pyIter(files)) { if (!pyT((((__v64) => (pyT(__v64) ? (pyGet(f, "file_id")) : __v64))(pyIsInstance(f, "dict"))))) continue; __acc.push(f); } return __acc; })());
      if (pyT(valid)) {
            return (valid);
      }
  }
  if (pyT(pyGet(eb, "file_id"))) {
      return ([{ file_id: pyGet(eb, "file_id"), file_name: pyGet(eb, "file_name", "document.pdf") }]);
  }
  return ([]);
}

export async function send_admin_ebook_preview(target, context, eb_data) {
  let _f, _names, _pv_files, cap, cat, delivery, image, keyboard;
  let markup, msg, price, price_tag;
  price = pyGet(eb_data, "price", 0);
  price_tag = (pyT(((price > 0))) ? (`৳${pyStr(price)}`) : ("বিনামূল্যে (Free) 🎁"));
  cat = pyGet(eb_data, "category", "General");
  _pv_files = _ebook_get_files(eb_data);
  if (pyT(((pyLen(_pv_files) > 1)))) {
      _names = pyJoin("\n", ((() => { const __acc = []; for (const _f of pyIter(pySlice(_pv_files, null, 10, null))) { __acc.push(`• \`${pyStr(pySlice(pyStr((((__v65) => (pyT(__v65) ? __v65 : ("document.pdf")))(pyGet(_f, "file_name")))), null, 40, null))}\``); } return __acc; })()));
      if (pyT(((pyLen(_pv_files) > 10)))) {
            _names += `
• ...+${pyStr((pyLen(_pv_files) - 10))} more`;
      }
      delivery = `📄 সরাসরি Telegram PDF ফাইল (মোট ${pyStr(pyLen(_pv_files))}টি):
${pyStr(_names)}`;
  } else if (pyT(pyGet(eb_data, "file_id"))) {
      delivery = `📄 সরাসরি Telegram PDF ফাইল (\`${pyStr(pyGet(eb_data, "file_name", "Document.pdf"))}\`)`;
  } else if (pyT(pyGet(eb_data, "access_link"))) {
      delivery = `🔗 গুগল ড্রাইভ / ডাউনলোড লিংক (\`${pyStr(pyGet(eb_data, "access_link"))}\`)`;
  } else {
      delivery = "⚠️ কোনো ফাইল বা লিংক যুক্ত করা হয়নি (পরে এডিট করতে পারবেন)";
  }
  msg = `🎉 **ই-বুক প্রিভিউ ও নিশ্চিতকরণ (E-Book Preview):**
━━━━━━━━━━━━━━━━━━━━

📖 **নাম:** ${pyStr(pyGet(eb_data, "name", "N/A"))}
📂 **ক্যাটাগরি:** \`${pyStr(cat)}\`
💰 **মূল্য:** **${pyStr(price_tag)}**
📁 **ডেলিভারি মেথড:** ${pyStr(delivery)}

📝 **বিবরণ:**
${pyStr(pyGet(eb_data, "description", "প্রিমিয়াম ই-বুক ও স্টাডি মেটেরিয়াল।"))}`;
  keyboard = [[InlineKeyboardButton("🚀 Publish E-Book (প্রকাশ করুন)", { callback_data: "adm_publisheb" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_ebook" })]];
  markup = InlineKeyboardMarkup(keyboard);
  image = pyGet(eb_data, "image", "");
  if (pyT((((__v66) => (pyT(__v66) ? (pyHasAttr(target, "reply_photo")) : __v66))(image)))) {
      try {
            cap = (pyT(((pyLen(msg) <= 1024))) ? (msg) : ((pySlice(msg, null, 1021, null) + "...")));
            void ((await target.reply_photo({ photo: image, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
            return;
      } catch (__e) {
      }
  }
  if (pyT(pyHasAttr(target, "reply_text"))) {
      void ((await target.reply_text(msg, { parse_mode: "Markdown", reply_markup: markup })));
  } else if (pyT(pyHasAttr(target, "edit_message_text"))) {
      void ((await target.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: markup })));
  } else if (pyT((((__v67) => (pyT(__v67) ? (pyHasAttr(target.message, "reply_text")) : __v67))(pyHasAttr(target, "message"))))) {
      void ((await target.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: markup })));
  } else if (pyT((((__v68) => (pyT(__v68) ? (pyHasAttr(target.effective_message, "reply_text")) : __v68))(pyHasAttr(target, "effective_message"))))) {
      void ((await target.effective_message.reply_text(msg, { parse_mode: "Markdown", reply_markup: markup })));
  }
}

export async function handle_admin_ebook_creation(update, context) {
  let back_kb, caption, cat, desc_val, digits, doc, k_cancel, k_file;
  let k_more, msg, n_files, name_val, new_ebook, p_text, photo, price_tag;
  let price_val, prompt, step, text, user_id;
  msg = update.message;
  text = (pyT((((__v69) => (pyT(__v69) ? (msg.text) : __v69))(msg))) ? (pyStrip(msg.text)) : (""));
  caption = (pyT((((__v70) => (pyT(__v70) ? (msg.caption) : __v70))(msg))) ? (pyStrip(msg.caption)) : (""));
  doc = msg.document;
  photo = msg.photo;
  user_id = update.effective_user.id;
  step = pyGet(context.user_data, "ebook_step");
  if (pyT((((__v71) => (pyT(__v71) ? __v71 : ((pyEq(caption, "/cancel")))))((pyEq(text, "/cancel")))))) {
      context.user_data["admin_add_ebook"] = false;
      pyPop(context.user_data, "new_ebook", null);
      pyPop(context.user_data, "ebook_step", null);
      back_kb = [[InlineKeyboardButton("« Cancel", { callback_data: "adm_ebooks" })]];
      void ((await update.message.reply_text("✕ E-Book creation cancelled.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
      return;
  }
  new_ebook = pyGet(context.user_data, "new_ebook", {  });
  cat = pyGet(new_ebook, "category", "General");
  if (pyT((pyEq(step, "custom_cat")))) {
      if (pyT((!pyT(text)))) {
            void ((await wizard_edit_or_reply(context, update, "⚠️ অনুগ্রহ করে ক্যাটাগরির নাম লিখে পাঠান:")));
            return;
      }
      cat = text;
      new_ebook["category"] = cat;
      context.user_data["new_ebook"] = new_ebook;
      context.user_data["ebook_step"] = "name";
      prompt = `📁 **ক্যাটাগরি: \`${pyStr(cat)}\`**
━━━━━━━━━━━━━━━━━━━━

✨ **ধাপ ১/৪: ই-বুকের নাম (E-Book Title) লিখে পাঠান:**
(যেমন: 📘 HSC Physics Formula Sheet | ${pyStr(cat)})

💡 ক্যাটাগরি স্বয়ংক্রিয়ভাবে \`${pyStr(cat)}\` সেট করা থাকবে।`;
      k_cancel = [[InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_ebook" })]];
      void ((await wizard_edit_or_reply(context, update, prompt, { reply_markup: InlineKeyboardMarkup(k_cancel) })));
      return;
  }
  if (pyT((((__v72) => (pyT(__v72) ? __v72 : ((pyEq(step, "name")))))((pyEq(step, "init_choice")))))) {
      name_val = (pyT(caption) ? (caption) : (text));
      if (pyT((((__v73) => (pyT(__v73) ? ((!pyT(name_val))) : __v73))(doc)))) {
            name_val = (((__v74) => (pyT(__v74) ? __v74 : ("New E-Book PDF")))(doc.file_name));
      }
      if (pyT((!pyT(name_val)))) {
            void ((await wizard_edit_or_reply(context, update, "⚠️ অনুগ্রহ করে ই-বুকের নাম লিখে পাঠান:")));
            return;
      }
      new_ebook["name"] = name_val;
      if (pyT(doc)) {
            _ebook_append_file(new_ebook, doc.file_id, (((__v75) => (pyT(__v75) ? __v75 : ("document.pdf")))(doc.file_name)));
      }
      if (pyT(photo)) {
            new_ebook["image"] = pySub(photo, (-(1))).file_id;
      }
      context.user_data["new_ebook"] = new_ebook;
      context.user_data["ebook_step"] = "price";
      k_cancel = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebook_back" }), InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_ebook" })]];
      void ((await wizard_edit_or_reply(context, update, `📖 ই-বুকের নাম: **${pyStr(name_val)}**

💰 **ধাপ ২/৪: ই-বুকের মূল্য লিখুন (Price in BDT):**

(যেমন: 50 বা ফ্রি ই-বুকের জন্য 0 লিখুন)`, { reply_markup: InlineKeyboardMarkup(k_cancel) })));
  } else if (pyT((pyEq(step, "price")))) {
      digits = pyReFindAll("\\d+", text);
      if (pyT((!pyT(digits)))) {
            void ((await wizard_edit_or_reply(context, update, "⚠️ অনুগ্রহ করে সঠিক মূল্য লিখুন (যেমন: 50 বা ফ্রি হলে 0):")));
            return;
      }
      price_val = pyInt(pySub(digits, 0));
      new_ebook["price"] = price_val;
      context.user_data["new_ebook"] = new_ebook;
      context.user_data["ebook_step"] = "description";
      price_tag = (pyT(((price_val > 0))) ? (`৳${pyStr(price_val)}`) : ("বিনামূল্যে (Free) 🎁"));
      k_cancel = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebook_back" }), InlineKeyboardButton("⏭️ Skip Description", { callback_data: "adm_skipeb_desc" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_ebook" })]];
      void ((await wizard_edit_or_reply(context, update, `💰 মূল্য: **${pyStr(price_tag)}**

📝 **ধাপ ৩/৪: ই-বুকের বিস্তারিত বিবরণ (Description) লিখুন:**

💡 ই-বুকের বিষয়বস্তু বা বৈশিষ্ট্য লিখুন (অথবা স্কিপ করতে নিচের বাটনে চাপুন):`, { reply_markup: InlineKeyboardMarkup(k_cancel) })));
  } else if (pyT((pyEq(step, "description")))) {
      desc_val = (pyT((((__v76) => (pyT(__v76) ? (((!pyEq(text, "/skip")))) : __v76))(text))) ? (text) : ("প্রিমিয়াম ই-বুক ও স্টাডি মেটেরিয়াল।"));
      new_ebook["description"] = desc_val;
      context.user_data["new_ebook"] = new_ebook;
      if (pyT(pyGet(new_ebook, "file_id"))) {
            void ((await send_admin_ebook_preview(update.message, context, new_ebook)));
            return;
      }
      context.user_data["ebook_step"] = "file_or_link";
      p_text = `📁 **ক্যাটাগরি:** \`${pyStr(cat)}\`
━━━━━━━━━━━━━━━━━━━━
📄 **ধাপ ৪/৪: PDF ফাইল সরাসরি আপলোড করুন অথবা ডাউনলোড লিংক পাঠান:**

💡 ফাইল পাঠানোর নিয়ম:
• সরাসরি এই চ্যাটে Telegram **PDF Document** ফাইল সেন্ড করুন — একাধিক PDF একটা একটা করে পাঠাতে পারেন, সবগুলো যোগ হবে।
• অথবা Google Drive / Web ডাউনলোড লিংক লিখে পাঠান।
• 🖼️ কভার ছবি দিতে চাইলে **Photo** পাঠান।`;
      k_file = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebook_back" }), InlineKeyboardButton("⏭️ Skip File (পরে যোগ করবেন)", { callback_data: "adm_skipeb_file" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_ebook" })]];
      void ((await wizard_edit_or_reply(context, update, p_text, { reply_markup: InlineKeyboardMarkup(k_file) })));
  } else if (pyT((pyEq(step, "file_or_link")))) {
      if (pyT(doc)) {
            n_files = _ebook_append_file(new_ebook, doc.file_id, (((__v77) => (pyT(__v77) ? __v77 : ("document.pdf")))(doc.file_name)));
            if (pyT(photo)) {
                    new_ebook["image"] = pySub(photo, (-(1))).file_id;
            }
            context.user_data["new_ebook"] = new_ebook;
            k_more = [[InlineKeyboardButton("👁 Preview & Publish", { callback_data: "adm_ebook_preview" })], [InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebook_back" }), InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_ebook" })]];
            void ((await wizard_edit_or_reply(context, update, `📄 **PDF যুক্ত হয়েছে! (মোট ${pyStr(n_files)}টি)**

💡 আরও PDF পাঠান — প্রতিটা যোগ হবে (আলাদা প্রিভিউ খুলবে না)।
🖼️ কভার ছবির জন্য Photo পাঠান।

✅ সব শেষ হলে নিচের বাটনে প্রিভিউ দেখুন:`, { reply_markup: InlineKeyboardMarkup(k_more) })));
            return;
      } else if (pyT((((__v79) => (pyT(__v79) ? (((__v78) => (pyT(__v78) ? (((!pyEq(text, "/skip")))) : __v78))(((!pyEq(pyLower(text), "skip"))))) : __v79))(text)))) {
            if (pyT(pyStart(text, "http"))) {
                    new_ebook["access_link"] = text;
                    new_ebook["download_link"] = text;
            } else {
                    new_ebook["access_link"] = text;
            }
      }
      if (pyT(photo)) {
            new_ebook["image"] = pySub(photo, (-(1))).file_id;
      }
      context.user_data["new_ebook"] = new_ebook;
      void ((await send_admin_ebook_preview(update.message, context, new_ebook)));
  }
}

export async function handle_admin_ebook_edit_input(update, context) {
  let _ex, caption, doc, eb, eb_id, f, field, keyboard;
  let msg, num_str, photo, text, text_menu, updated_data, user_id;
  msg = update.message;
  text = (pyT((((__v80) => (pyT(__v80) ? (msg.text) : __v80))(msg))) ? (pyStrip(msg.text)) : (""));
  caption = (pyT((((__v81) => (pyT(__v81) ? (msg.caption) : __v81))(msg))) ? (pyStrip(msg.caption)) : (""));
  doc = msg.document;
  photo = msg.photo;
  user_id = update.effective_user.id;
  eb_id = pyGet(context.user_data, "admin_edit_ebid");
  field = pyGet(context.user_data, "admin_edit_ebook_field");
  if (pyT((((__v82) => (pyT(__v82) ? __v82 : ((pyEq(caption, "/cancel")))))((pyEq(text, "/cancel")))))) {
      pyPop(context.user_data, "admin_edit_ebid", null);
      pyPop(context.user_data, "admin_edit_ebook_field", null);
      void ((await update.message.reply_text("✕ Edit cancelled.", { reply_markup: main_menu_keyboard(user_id) })));
      eb = db.get_ebook(eb_id);
      if (pyT(eb)) {
            text_menu = `✏️ **Edit E-Book: '${pyStr(pyGet(eb, "name"))}'**
━━━━━━━━━━━━━━━━━━━━
Select property to edit:`;
            keyboard = [[InlineKeyboardButton("✏️ Edit Title", { callback_data: `edebprop_${pyStr(eb_id)}_name` }), InlineKeyboardButton("💰 Edit Price", { callback_data: `edebprop_${pyStr(eb_id)}_price` })], [InlineKeyboardButton("📂 Edit Category", { callback_data: `edebprop_${pyStr(eb_id)}_category` }), InlineKeyboardButton("📁 Edit File / Drive Link", { callback_data: `edebprop_${pyStr(eb_id)}_access_link` })], [InlineKeyboardButton("📝 Edit Description", { callback_data: `edebprop_${pyStr(eb_id)}_description` })], [InlineKeyboardButton("🖼️ Edit Banner", { callback_data: `edebprop_${pyStr(eb_id)}_image` })], [InlineKeyboardButton("⬅️Back", { callback_data: `adm_vieweb_${pyStr(eb_id)}` })]];
            void ((await update.message.reply_text(text_menu, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
      return;
  }
  if (pyT((((__v83) => (pyT(__v83) ? __v83 : ((!pyT(field)))))((!pyT(eb_id)))))) {
      return;
  }
  eb = db.get_ebook(eb_id);
  if (pyT((!pyT(eb)))) {
      pyPop(context.user_data, "admin_edit_ebid", null);
      pyPop(context.user_data, "admin_edit_ebook_field", null);
      void ((await update.message.reply_text("❌ E-Book not found.", { reply_markup: main_menu_keyboard(user_id) })));
      return;
  }
  updated_data = {  };
  if (pyT((pyEq(field, "price")))) {
      try {
            num_str = pyJoin("", filter("str".isdigit, text));
            updated_data["price"] = (pyT(num_str) ? (pyInt(num_str)) : (0));
      } catch (__e) {
            void ((await update.message.reply_text("⚠️ Please enter a valid number (e.g. 100 or 0):")));
            return;
      }
  } else if (pyT((pyEq(field, "access_link")))) {
      if (pyT(doc)) {
            _ex = (pyT(pyIsInstance(pyGet(eb, "files"), "list")) ? (pyGet(eb, "files")) : ([]));
            _ex = ((() => { const __acc = []; for (const f of pyIter(_ex)) { if (!pyT((((__v84) => (pyT(__v84) ? (pyGet(f, "file_id")) : __v84))(pyIsInstance(f, "dict"))))) continue; __acc.push(f); } return __acc; })());
            if (pyT((!pyT(pyAny(((() => { const __acc = []; for (const f of pyIter(_ex)) { __acc.push((pyEq(pyGet(f, "file_id"), doc.file_id))); } return __acc; })())))))) {
                    pyAppend(_ex, { file_id: doc.file_id, file_name: (((__v85) => (pyT(__v85) ? __v85 : ("document.pdf")))(doc.file_name)) });
            }
            updated_data["files"] = _ex;
            updated_data["file_id"] = (pyT(_ex) ? (pySub(pySub(_ex, 0), "file_id")) : (""));
            updated_data["file_name"] = (pyT(_ex) ? (pyGet(pySub(_ex, 0), "file_name", "document.pdf")) : (""));
            updated_data["access_link"] = "";
            updated_data["download_link"] = "";
      } else if (pyT(pyStart(text, "http"))) {
            updated_data["access_link"] = text;
            updated_data["download_link"] = text;
      } else if (pyT((pyEq(pyLower(text), "remove")))) {
            updated_data["access_link"] = "";
            updated_data["download_link"] = "";
            updated_data["file_id"] = "";
            updated_data["file_name"] = "";
            updated_data["files"] = [];
      } else {
            updated_data["access_link"] = text;
            updated_data["download_link"] = text;
      }
  } else if (pyT((pyEq(field, "image")))) {
      if (pyT(photo)) {
            updated_data["image"] = pySub(photo, (-(1))).file_id;
      } else if (pyT((pyEq(pyLower(text), "remove")))) {
            updated_data["image"] = "";
      } else if (pyT(text)) {
            updated_data["image"] = text;
      } else {
            void ((await update.message.reply_text("⚠️ Banner Photo পাঠান (or `remove`):")));
            return;
      }
  } else {
      if (pyT((!pyT(text)))) {
            void ((await update.message.reply_text("⚠️ Please enter text:")));
            return;
      }
      updated_data[field] = text;
  }
  db.update_ebook(eb_id, updated_data);
  pyPop(context.user_data, "admin_edit_ebid", null);
  pyPop(context.user_data, "admin_edit_ebook_field", null);
  void ((await update.message.reply_text(`✅ **E-Book property '${pyStr(field)}' updated successfully!**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("✏️ Edit this E-Book again", { callback_data: `adm_vieweb_${pyStr(eb_id)}` })], [InlineKeyboardButton("« All E-Books", { callback_data: "adm_list_ebooks" })], [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]]) })));
}

