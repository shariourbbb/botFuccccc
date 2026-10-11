// callbacks_user.js — auto-transpiled from bot.py by py2js. Ported 1:1 from the Python source.
import { CopyTextButton, InlineKeyboardMarkup } from "./compat.js";
import { BOT_USERNAME, SUPPORT_USERNAME } from "./config.js";
import { db } from "./db.js";
import { handle_admin_callback } from "./admin_callback.js";
import { _ebook_get_files } from "./admin_input.js";
import { get_action_select_keyboard } from "./admin_panels.js";
import { BUTTON_STYLE_DOT, BUTTON_STYLE_NAME, WELCOME_MESSAGE, _edit_photo_smooth, _expand_callback_data, _kb_button_style, _msg_has_media, append_course_join_buttons, check_banned, check_maintenance, disp_name, format_order_id_display, get_notify_admins, get_welcome_inline_keyboard, is_admin, logger, main_menu_keyboard, parse_inline_buttons, send_folder_screen, send_welcome_text, start } from "./core.js";
import { _cleanup_withdraw_prompt } from "./flows.js";
import { _run_search, _search_page_keyboard, browse_ebooks, get_default_info_content, send_course_details, send_info_detail, send_rich_course_message, show_cart, show_categories, show_earnings_dashboard, show_earnings_history, show_ebooks_by_category, show_info, show_my_courses, show_my_ebooks, show_profile, show_referral, show_subcategories, show_withdrawal_history, start_withdraw_flow, view_ebook_details } from "./screens.js";
import { pyAppend, pyContains, pyDiv, pyEnd, pyEnumerate, pyEq, pyGet, pyGetAttr, pyHtmlEscape, pyInt, pyIter, pyJoin, pyLen, pyLower, pyMax, pyMin, pyNow, pyPop, pyQuotePlus, pyRange, pyReSub, pyRepeat, pyReplace, pySlice, pySplit, pyStart, pyStr, pyStrip, pySub, pySum, pyT, pyTitle } from "./helpers.js";
import { InlineKeyboardButton } from "./core.js";

export async function handle_callback(update, context) {
  let _aitem, _banner, _c, _cap, _cid, _cids, _cinfo_kb, _citem;
  let _dl_files, _eb, _f, _hdr, _hdr_path, _hitem, _i, _k;
  let _pg, _sent, _titem, _wbtn, _wu, _wu_line, _wu_refund, aid;
  let all_courses, all_sub_courses, amount, applied_coupon, back_cb, back_pg, bal_info, ban_msg;
  let banner_img, btn, btn_cnt, btn_hdr, btn_lbl, c, c_id, c_name;
  let c_obj, c_type, cart_courses, cat, category, cfg, child, child_path;
  let child_tag, cid, cids, clean_ban, clean_msg, cleaned_welcome, coupon_obj, course;
  let course_id, course_ids, course_image, course_label, course_name, course_names, courses, courses_in_order;
  let custom_c, custom_kb, data, deducted, default_kb, default_support, direct_courses, discount;
  let discount_val, discounted_price, e, eb, eb_id, eb_obj, eb_results, emoji;
  let esc_bot, esc_support, first_course, full_child_path, has_eb, i, icon, idx;
  let instructions, is_banned, is_bought, is_child_active, is_coupon_active, is_direct_all, item, items;
  let items_list, keyboard, m_key, maint_msg, message, method, method_emoji, method_ins;
  let method_key, method_name, method_number, method_obj, method_selected, methods, mid, msg;
  let msg_text, n_added, nav, nested_path, nested_subcats, new_data, num, o;
  let order, order_data, order_id, orders, original_total, page_num, parent_segs, parsed_kb;
  let parts, payment_note, per_page, pg, price_tag, q, query, raw_msg;
  let raw_text, raw_welcome, remaining, remaining_bal, reply_markup, results, sent, share_text;
  let share_url, show_inactive, st, st_txt, status_tag, sub_filter, sub_leaf_name, sub_title;
  let subcat, success_msg, target, text, total, total_found, total_pages, total_spent;
  let under_maint, use_amt, user_bal, user_data, user_id, valid, welcome_kb;
  query = update.callback_query;
  user_id = query.from_user.id;
  [under_maint, maint_msg] = check_maintenance(user_id);
  if (pyT(under_maint)) {
      clean_msg = pyReplace(pyReplace(maint_msg, "**", ""), "__", "");
      void ((await query.answer(clean_msg, { show_alert: true })));
      return;
  }
  [is_banned, ban_msg] = check_banned(user_id);
  if (pyT(is_banned)) {
      clean_ban = pyReplace(pyReplace(ban_msg, "**", ""), "__", "");
      void ((await query.answer(clean_ban, { show_alert: true })));
      return;
  }
  data = _expand_callback_data(query.data);
  if (pyT((!pyT((((__v2) => (pyT(__v2) ? __v2 : (((__v1) => (pyT(__v1) ? __v1 : (((__v0) => (pyT(__v0) ? __v0 : (pyStart(data, "copy_num_"))))(pyStart(data, "remcartc_")))))(pyStart(data, "remcart_")))))(pyStart(data, "addcart_"))))))) {
      void ((await query.answer()));
  }
  if (pyT((((__v3) => (pyT(__v3) ? __v3 : ((pyEq(data, "back_to_categories")))))((pyEq(data, "browse_categories")))))) {
      void ((await show_categories(update, context)));
  } else if (pyT(pyStart(data, "srchpg_"))) {
      try {
            pg = pyInt(pyReplace(data, "srchpg_", ""));
      } catch (__e) {
            pg = 0;
      }
      q = pyGet(context.user_data, "last_search", "");
      if (pyT((!pyT(q)))) {
            void ((await query.answer("❌ Search expired! আবার লিখে search করুন।", { show_alert: true })));
            return;
      }
      [results, eb_results] = _run_search(q);
      if (pyT((((__v4) => (pyT(__v4) ? ((!pyT(eb_results))) : __v4))((!pyT(results)))))) {
            void ((await query.answer("❌ No results!", { show_alert: true })));
            return;
      }
      [keyboard, total_pages, pg] = _search_page_keyboard(user_id, q, results, eb_results, pg);
      total_found = (pyLen(results) + pyLen(eb_results));
      msg = `🔍 **'${pyStr(q)}' এর সার্চ ফলাফল (${pyStr(total_found)} টি পাওয়া গেছে):**
━━━━━━━━━━━━━━━━━━━━
কোর্সের বিস্তারিত তথ্য ও ভর্তি হতে নিচের বাটনে চাপ দিন:`;
      void ((await query.answer()));
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw e;
            }
      }
  } else if (pyT((pyEq(data, "back_to_main_menu")))) {
      for (const _k of pyIter(["withdraw_step", "withdraw_amount", "withdraw_method", "awaiting_coupon", "coupon_course", "awaiting_trxid", "checkout_type", "checkout_course", "checkout_courses", "checkout_total", "applied_coupon", "discounted_price", "pay_method", "pay_amount"])) {
            pyPop(context.user_data, _k, null);
      }
      void ((await _cleanup_withdraw_prompt(update, context)));
      try {
            if (pyT(_msg_has_media(query.message))) {
                    void ((await query.message.delete()));
            }
      } catch (__e) {
      }
      raw_welcome = db.get_setting("welcome_message", WELCOME_MESSAGE);
      [cleaned_welcome, custom_kb] = parse_inline_buttons(raw_welcome);
      if (pyT(custom_kb)) {
            void ((await query.message.reply_text(cleaned_welcome, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(custom_kb) })));
      } else {
            welcome_kb = get_welcome_inline_keyboard();
            if (pyT((((__v5) => (pyT(__v5) ? (welcome_kb.inline_keyboard) : __v5))(welcome_kb)))) {
                    void ((await send_welcome_text(query.message, raw_welcome, { reply_markup: welcome_kb })));
            } else {
                    void ((await send_welcome_text(query.message, raw_welcome, { reply_markup: main_menu_keyboard(user_id) })));
                    return;
            }
            try {
                    void ((await query.message.reply_text("👇 Quick Menu:", { reply_markup: main_menu_keyboard(user_id) })));
            } catch (__e) {
                    logger.warning("Reply keyboard re-attach failed", { exc_info: true });
            }
      }
  } else if (pyT((pyEq(data, "profile_nav")))) {
      void ((await show_profile(update, context)));
  } else if (pyT((pyEq(data, "my_earnings_nav")))) {
      void ((await show_earnings_dashboard(update, context)));
  } else if (pyT((pyEq(data, "earn_history")))) {
      void ((await show_earnings_history(update, context)));
  } else if (pyT((pyEq(data, "earn_withdraw_history")))) {
      void ((await show_withdrawal_history(update, context)));
  } else if (pyT((pyEq(data, "earn_withdraw")))) {
      void ((await start_withdraw_flow(query, context, user_id)));
  } else if (pyT(pyStart(data, "wdrpay_"))) {
      method_selected = pyTitle(pyReplace(data, "wdrpay_", ""));
      context.user_data["withdraw_method"] = method_selected;
      context.user_data["withdraw_step"] = "account";
      amount = pyGet(context.user_data, "withdraw_amount", 0);
      void ((await query.edit_message_text(`💳 **${pyStr(method_selected)} একাউন্ট নাম্বার:**
━━━━━━━━━━━━━━━━━━━━

💰 Withdrawal Amount: \`${pyStr(amount)}\` ৳
💳 Method: **${pyStr(method_selected)}**

👇 Send your **${pyStr(method_selected)} personal account number**:
(Example: \`017XXXXXXXX\`)

💡 To cancel, type /cancel.`, { parse_mode: "Markdown" })));
  } else if (pyT((((__v6) => (pyT(__v6) ? __v6 : (pyStart(data, "my_courses_pg_"))))((pyEq(data, "my_courses_nav")))))) {
      try {
            _pg = (pyT(pyStart(data, "my_courses_pg_")) ? (pyInt(pyReplace(data, "my_courses_pg_", ""))) : (0));
      } catch (__e) {
            _pg = 0;
      }
      void ((await show_my_courses(update, context, { page: _pg })));
  } else if (pyT((((__v7) => (pyT(__v7) ? __v7 : (pyStart(data, "my_ebooks_pg_"))))((pyEq(data, "my_ebooks_nav")))))) {
      try {
            _pg = (pyT(pyStart(data, "my_ebooks_pg_")) ? (pyInt(pyReplace(data, "my_ebooks_pg_", ""))) : (0));
      } catch (__e) {
            _pg = 0;
      }
      void ((await show_my_ebooks(update, context, { page: _pg })));
  } else if (pyT((pyEq(data, "my_refer_nav")))) {
      void ((await show_referral(update, context)));
  } else if (pyT((pyEq(data, "view_cart_nav")))) {
      pyPop(context.user_data, "awaiting_coupon", null);
      pyPop(context.user_data, "applied_coupon", null);
      pyPop(context.user_data, "discounted_price", null);
      pyPop(context.user_data, "coupon_course", null);
      pyPop(context.user_data, "coupon_prompt_msg_id", null);
      pyPop(context.user_data, "checkout_total", null);
      pyPop(context.user_data, "checkout_courses", null);
      pyPop(context.user_data, "checkout_course_name", null);
      void ((await show_cart(update, context)));
  } else if (pyT((pyEq(data, "info_menu")))) {
      void ((await show_info(update, context)));
  } else if (pyT((pyEq(data, "info_contact")))) {
      esc_support = pyReplace(SUPPORT_USERNAME, "_", "\\_");
      esc_bot = pyReplace(BOT_USERNAME, "_", "\\_");
      default_support = `➥ **Contact Support / হেল্পলাইন**
━━━━━━━━━━━━━━━━━━━━

যেকোনো কোর্স সংক্রান্ত তথ্য, পেমেন্ট হেল্প বা সমস্যার জন্য আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন:

👨‍💻 **Admin Support:** @${pyStr(esc_support)}
📢 **Official Channel:** @${pyStr(esc_bot)}
⏰ **সাপোর্ট সময়:** সকাল ৯:০০ টা - রাত ১২:০০ টা

💡 আপনার কোনো সমস্যা থাকলে এডমিনের ইনবক্সে সরাসরি মেসেজ দিন।`;
      raw_text = db.get_setting("support_message", default_support);
      [text, parsed_kb] = parse_inline_buttons(raw_text);
      reply_markup = null;
      if (pyT(parsed_kb)) {
            reply_markup = InlineKeyboardMarkup(parsed_kb);
      } else {
            keyboard = [[InlineKeyboardButton("➥ Contact Admin", { url: `https://t.me/${pyStr(SUPPORT_USERNAME)}` })], [InlineKeyboardButton("📢 Official Channel", { url: `https://t.me/${pyStr(BOT_USERNAME)}` })], [InlineKeyboardButton("« Back to Info Menu", { callback_data: "info_menu" })]];
            reply_markup = InlineKeyboardMarkup(keyboard);
      }
      text = pyReSub("(?<!\\\\)_", "\\_", text);
      _citem = (((__v8) => (pyT(__v8) ? __v8 : ({  })))(pyGet(pyGet(db.get_info_settings(), "items", {  }), "contact", {  })));
      void ((await send_info_detail(update, context, text, reply_markup, { header: pyGet(_citem, "header", ""), media_type: pyGet(_citem, "media_type", "none"), media_file_id: pyGet(_citem, "media_file_id", "") })));
  } else if (pyT((pyEq(data, "info_how_to_buy")))) {
      cfg = db.get_info_settings();
      _hitem = (((__v9) => (pyT(__v9) ? __v9 : ({  })))(pyGet(pyGet(cfg, "items", {  }), "how_to_buy", {  })));
      custom_c = pyStrip(pyGet(_hitem, "content", ""));
      raw_msg = (pyT(custom_c) ? (custom_c) : (get_default_info_content("how_to_buy")));
      [msg, parsed_kb] = parse_inline_buttons(raw_msg);
      default_kb = [[InlineKeyboardButton("❖ Browse Courses", { callback_data: "browse_categories" })], [InlineKeyboardButton("➥ Contact Admin", { url: `https://t.me/${pyStr(SUPPORT_USERNAME)}` })], [InlineKeyboardButton("« Back to Info Menu", { callback_data: "info_menu" })]];
      reply_markup = (pyT(parsed_kb) ? (InlineKeyboardMarkup(parsed_kb)) : (InlineKeyboardMarkup(default_kb)));
      void ((await send_info_detail(update, context, msg, reply_markup, { header: pyGet(_hitem, "header", ""), media_type: pyGet(_hitem, "media_type", "none"), media_file_id: pyGet(_hitem, "media_file_id", "") })));
  } else if (pyT((pyEq(data, "info_about")))) {
      cfg = db.get_info_settings();
      _aitem = (((__v10) => (pyT(__v10) ? __v10 : ({  })))(pyGet(pyGet(cfg, "items", {  }), "about", {  })));
      custom_c = pyStrip(pyGet(_aitem, "content", ""));
      raw_msg = (pyT(custom_c) ? (custom_c) : (get_default_info_content("about")));
      [msg, parsed_kb] = parse_inline_buttons(raw_msg);
      default_kb = [[InlineKeyboardButton("➥ Join Community", { url: `https://t.me/${pyStr(BOT_USERNAME)}` })], [InlineKeyboardButton("« Back to Info Menu", { callback_data: "info_menu" })]];
      reply_markup = (pyT(parsed_kb) ? (InlineKeyboardMarkup(parsed_kb)) : (InlineKeyboardMarkup(default_kb)));
      void ((await send_info_detail(update, context, msg, reply_markup, { header: pyGet(_aitem, "header", ""), media_type: pyGet(_aitem, "media_type", "none"), media_file_id: pyGet(_aitem, "media_file_id", "") })));
  } else if (pyT((pyEq(data, "info_terms")))) {
      cfg = db.get_info_settings();
      _titem = (((__v11) => (pyT(__v11) ? __v11 : ({  })))(pyGet(pyGet(cfg, "items", {  }), "terms", {  })));
      custom_c = pyStrip(pyGet(_titem, "content", ""));
      raw_msg = (pyT(custom_c) ? (custom_c) : (get_default_info_content("terms")));
      [msg, parsed_kb] = parse_inline_buttons(raw_msg);
      default_kb = [[InlineKeyboardButton("« Back to Info Menu", { callback_data: "info_menu" })]];
      reply_markup = (pyT(parsed_kb) ? (InlineKeyboardMarkup(parsed_kb)) : (InlineKeyboardMarkup(default_kb)));
      void ((await send_info_detail(update, context, msg, reply_markup, { header: pyGet(_titem, "header", ""), media_type: pyGet(_titem, "media_type", "none"), media_file_id: pyGet(_titem, "media_file_id", "") })));
  } else if (pyT(pyStart(data, "cinfo_view_"))) {
      c_id = pyReplace(data, "cinfo_view_", "");
      btn = db.get_custom_info_button(c_id);
      if (pyT(btn)) {
            btn_lbl = pyHtmlEscape(pyGet(btn, "label", "Info"));
            btn_cnt = pyHtmlEscape(pyGet(btn, "content", ""));
            btn_hdr = pyHtmlEscape(pyStrip((((__v12) => (pyT(__v12) ? __v12 : ("")))(pyGet(btn, "header", "")))));
            _hdr = (`ℹ️ <b>${pyStr(btn_lbl)}</b>` + (pyT(btn_hdr) ? (`
${pyStr(btn_hdr)}`) : ("")));
            _cinfo_kb = InlineKeyboardMarkup([[InlineKeyboardButton("« Back to Info Menu", { callback_data: "info_menu" })]]);
            void ((await send_info_detail(update, context, btn_cnt, _cinfo_kb, { header: _hdr, media_type: pyGet(btn, "media_type", "none"), media_file_id: pyGet(btn, "media_file_id", ""), parse_mode: "HTML", divider: false })));
      } else {
            void ((await query.answer("Button not found!")));
      }
  } else if (pyT(pyStart(data, "cat_"))) {
      category = pyReplace(data, "cat_", "");
      context.user_data["category"] = category;
      if (pyT((pyEq(category, "ALL")))) {
            show_inactive = is_admin(user_id);
            all_courses = db.get_courses_by_filter({ include_inactive: show_inactive });
            keyboard = [];
            for (const course of pyIter(all_courses)) {
                    price_tag = (pyT(((pyGet(course, "price", 0) > 0))) ? (` ─ ৳${pyStr(pySub(course, "price"))}`) : (" 🆓"));
                    is_bought = (pyT(db.is_purchased(user_id, pySub(course, "id"))) ? (" ✅") : (""));
                    status_tag = (pyT((((__v13) => (pyT(__v13) ? (show_inactive) : __v13))((pyEq(pyGet(course, "status"), "inactive"))))) ? ("🔴 ") : (""));
                    pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(status_tag)}${pyStr(pySub(course, "name"))}${pyStr(price_tag)}${pyStr(is_bought)}`, { callback_data: `course_${pyStr(pySub(course, "id"))}` })]);
            }
            pyAppend(keyboard, [InlineKeyboardButton("« Back to Categories", { callback_data: "browse_categories" })]);
            if (pyT(db.is_home_button_enabled())) {
                    pyAppend(keyboard, [InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" })]);
            }
            msg_text = `📚 **সকল কোর্সসমূহ (${pyStr(pyLen(all_courses))} টি):**
━━━━━━━━━━━━━━━━━━━━
যে কোর্সের তথ্য দেখতে চান সেটিতে ক্লিক করুন:`;
            if (pyT(_msg_has_media(query.message))) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await query.message.reply_text(msg_text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
            } else {
                    void ((await query.edit_message_text(msg_text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
            }
      } else {
            void ((await show_subcategories(query, category)));
      }
  } else if (pyT(pyStart(data, "subcat_"))) {
      parts = pySplit(pyReplace(data, "subcat_", ""), "_", 1);
      category = pySub(parts, 0);
      subcat = (pyT(((pyLen(parts) > 1))) ? (pySub(parts, 1)) : ("ALL"));
      context.user_data["category"] = category;
      context.user_data["subcategory"] = subcat;
      is_direct_all = false;
      if (pyT(pyEnd(subcat, "_ALLDIRECT"))) {
            subcat = pyReplace(subcat, "_ALLDIRECT", "");
            is_direct_all = true;
      }
      if (pyT((((__v15) => (pyT(__v15) ? (((__v14) => (pyT(__v14) ? ((!pyT(is_direct_all))) : __v14))(((!pyEq(subcat, ""))))) : __v15))(((!pyEq(subcat, "ALL"))))))) {
            nested_path = `${pyStr(category)} > ${pyStr(subcat)}`;
            nested_subcats = db.get_subcategories(nested_path, { include_inactive: is_admin(user_id) });
            if (pyT(nested_subcats)) {
                    keyboard = [];
                    for (const child of pyIter(nested_subcats)) {
                              child_path = `${pyStr(subcat)} > ${pyStr(child)}`;
                              full_child_path = `${pyStr(category)} > ${pyStr(child_path)}`;
                              is_child_active = db.is_category_active(full_child_path);
                              child_tag = (pyT((((__v16) => (pyT(__v16) ? (is_admin(user_id)) : __v16))((!pyT(is_child_active))))) ? (" [OFF 🔴]") : (""));
                              pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(child)}${pyStr(child_tag)}`, { callback_data: `subcat_${pyStr(category)}_${pyStr(child_path)}` })]);
                    }
                    direct_courses = db.get_courses_by_folder(nested_path, { include_inactive: is_admin(user_id) });
                    for (const course of pyIter(direct_courses)) {
                              price_tag = (pyT(((pyGet(course, "price", 0) > 0))) ? (` ─ ৳${pyStr(pySub(course, "price"))}`) : (" 🆓"));
                              is_bought = (pyT(db.is_purchased(user_id, pySub(course, "id"))) ? (" ✅") : (""));
                              status_tag = (pyT((((__v17) => (pyT(__v17) ? (is_admin(user_id)) : __v17))((pyEq(pyGet(course, "status"), "inactive"))))) ? ("🔴 ") : (""));
                              pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(status_tag)}${pyStr(pySub(course, "name"))}${pyStr(price_tag)}${pyStr(is_bought)}`, { callback_data: `course_${pyStr(pySub(course, "id"))}` })]);
                    }
                    if (pyT(db.is_view_all_courses_enabled())) {
                              sub_leaf_name = pySub(pySplit(subcat, " > ", -1), (-(1)));
                              all_sub_courses = db.get_courses_by_filter({ category: category, subcategory: subcat, include_inactive: is_admin(user_id) });
                              pyAppend(keyboard, [InlineKeyboardButton(`🎓 View All ${pyStr(sub_leaf_name)} Courses (${pyStr(pyLen(all_sub_courses))})`, { callback_data: `subcat_${pyStr(category)}_${pyStr(subcat)}_ALLDIRECT` })]);
                    }
                    parent_segs = pySplit(subcat, " > ", -1);
                    back_cb = (pyT(((pyLen(parent_segs) > 1))) ? (`subcat_${pyStr(category)}_${pyStr(pyJoin(" > ", pySlice(parent_segs, null, (-(1)), null)))}`) : (`cat_${pyStr(category)}`));
                    pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: back_cb })]);
                    if (pyT(is_admin(user_id))) {
                              pyAppend(keyboard, [InlineKeyboardButton(`➕ Add Course in '${pyStr(subcat)}'`, { callback_data: `adm_addcourse_dir_${pyStr(nested_path)}` }), InlineKeyboardButton("📁 Manage Folder", { callback_data: `adm_dir_${pyStr(nested_path)}` })]);
                    }
                    if (pyT(direct_courses)) {
                              msg_text = `📂 **${pyStr(disp_name(category))} | ${pyStr(disp_name(subcat))} এর বিষয় ও কোর্সসমূহ:**
━━━━━━━━━━━━━━━━━━━━
আপনার প্রয়োজনীয় বিষয় বা কোর্স বেছে নিন:`;
                    } else {
                              msg_text = `📂 **${pyStr(disp_name(category))} | ${pyStr(disp_name(subcat))} এর বিষয় / সাব-ক্যাটাগরি:**
━━━━━━━━━━━━━━━━━━━━
আপনার প্রয়োজনীয় বিষয় বা প্রোগ্রাম বেছে নিন:`;
                    }
                    void ((await send_folder_screen(query, msg_text, InlineKeyboardMarkup(keyboard), nested_path)));
                    return;
            }
      }
      sub_filter = (pyT((pyEq(subcat, "ALL"))) ? (null) : (subcat));
      courses = db.get_courses_by_filter({ category: category, subcategory: sub_filter, include_inactive: is_admin(user_id) });
      sub_title = (pyT((pyEq(subcat, "ALL"))) ? ("সকল কোর্স") : (subcat));
      keyboard = [];
      if (pyT((!pyT(courses)))) {
            parent_segs = (pyT(((!pyEq(subcat, "ALL")))) ? (pySplit(subcat, " > ", -1)) : ([]));
            back_cb = (pyT(((pyLen(parent_segs) > 1))) ? (`subcat_${pyStr(category)}_${pyStr(pyJoin(" > ", pySlice(parent_segs, null, (-(1)), null)))}`) : (`cat_${pyStr(category)}`));
            pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: back_cb })]);
            msg_text = `❌ দুঃখিত, **${pyStr(category)} ➡️ ${pyStr(sub_title)}** এ বর্তমানে কোনো কোর্স পাওয়া যায়নি।`;
      } else {
            for (const course of pyIter(courses)) {
                    price_tag = (pyT(((pyGet(course, "price", 0) > 0))) ? (` ─ ৳${pyStr(pySub(course, "price"))}`) : (" 🆓"));
                    is_bought = (pyT(db.is_purchased(user_id, pySub(course, "id"))) ? (" ✅") : (""));
                    status_tag = (pyT((((__v18) => (pyT(__v18) ? (is_admin(user_id)) : __v18))((pyEq(pyGet(course, "status"), "inactive"))))) ? ("🔴 ") : (""));
                    pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(status_tag)}${pyStr(pySub(course, "name"))}${pyStr(price_tag)}${pyStr(is_bought)}`, { callback_data: `course_${pyStr(pySub(course, "id"))}` })]);
            }
            parent_segs = (pyT(((!pyEq(subcat, "ALL")))) ? (pySplit(subcat, " > ", -1)) : ([]));
            back_cb = (pyT(((pyLen(parent_segs) > 1))) ? (`subcat_${pyStr(category)}_${pyStr(pyJoin(" > ", pySlice(parent_segs, null, (-(1)), null)))}`) : (`cat_${pyStr(category)}`));
            pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: back_cb })]);
            msg_text = `📚 **${pyStr(disp_name(category))} | ${pyStr(disp_name(sub_title))} এর কোর্সসমূহ:**
━━━━━━━━━━━━━━━━━━━━
যে কোর্সের তথ্য দেখতে চান সেটিতে ক্লিক করুন:`;
      }
      if (pyT(is_admin(user_id))) {
            if (pyT(((!pyEq(subcat, "ALL"))))) {
                    nested_path = `${pyStr(category)} > ${pyStr(subcat)}`;
                    pyAppend(keyboard, [InlineKeyboardButton(`➕ Add Course in '${pyStr(subcat)}'`, { callback_data: `adm_addcourse_dir_${pyStr(nested_path)}` }), InlineKeyboardButton("📁 Manage Folder", { callback_data: `adm_dir_${pyStr(nested_path)}` })]);
            } else {
                    pyAppend(keyboard, [InlineKeyboardButton(`➕ Add Course to '${pyStr(category)}'`, { callback_data: `adm_addcourse_cat_${pyStr(category)}` })]);
            }
      }
      _hdr_path = (pyT((pyContains(["ALL", ""], subcat))) ? (category) : (`${pyStr(category)} > ${pyStr(subcat)}`));
      void ((await send_folder_screen(query, msg_text, InlineKeyboardMarkup(keyboard), _hdr_path)));
  } else if (pyT(pyStart(data, "course_"))) {
      course_id = pyReplace(data, "course_", "");
      course = db.get_course(course_id);
      if (pyT((!pyT(course)))) {
            void ((await query.answer("❌ কোর্সটি খুঁজে পাওয়া যায়নি।", { show_alert: true })));
            return;
      }
      pyPop(context.user_data, "awaiting_coupon", null);
      pyPop(context.user_data, "coupon_prompt_msg_id", null);
      if (pyT((pyEq(pyGet(context.user_data, "coupon_course"), course_id)))) {
            pyPop(context.user_data, "coupon_course", null);
            pyPop(context.user_data, "applied_coupon", null);
            pyPop(context.user_data, "discounted_price", null);
      }
      context.user_data["current_course"] = course_id;
      void ((await send_course_details(query, context, course, user_id, { is_edit: true })));
  } else if (pyT(pyStart(data, "addcart_"))) {
      course_id = pyReplace(data, "addcart_", "");
      course = db.get_course(course_id);
      if (pyT(course)) {
            db.add_to_cart(user_id, course_id);
            void ((await query.answer()));
            void ((await send_course_details(query, context, course, user_id, { is_edit: true })));
            return;
      }
      eb = db.get_ebook(course_id);
      if (pyT(eb)) {
            db.add_to_cart(user_id, course_id);
            void ((await query.answer()));
            void ((await view_ebook_details(update, context, course_id)));
            return;
      }
  } else if (pyT(pyStart(data, "remcartc_"))) {
      course_id = pyReplace(data, "remcartc_", "");
      course = db.get_course(course_id);
      db.remove_from_cart(user_id, course_id);
      void ((await query.answer()));
      if (pyT(course)) {
            void ((await send_course_details(query, context, course, user_id, { is_edit: true })));
      } else if (pyT(db.get_ebook(course_id))) {
            void ((await view_ebook_details(update, context, course_id)));
      } else {
            void ((await show_cart(update, context)));
      }
  } else if (pyT(pyStart(data, "remcart_"))) {
      course_id = pyReplace(data, "remcart_", "");
      db.remove_from_cart(user_id, course_id);
      void ((await query.answer("✕ আইটেম মুছে ফেলা হয়েছে!", { show_alert: true })));
      void ((await show_cart(update, context)));
  } else if (pyT((pyContains(["view_cart", "show_cart", "cart"], data)))) {
      pyPop(context.user_data, "awaiting_coupon", null);
      pyPop(context.user_data, "applied_coupon", null);
      pyPop(context.user_data, "discounted_price", null);
      pyPop(context.user_data, "coupon_course", null);
      pyPop(context.user_data, "coupon_prompt_msg_id", null);
      pyPop(context.user_data, "checkout_total", null);
      pyPop(context.user_data, "checkout_courses", null);
      pyPop(context.user_data, "checkout_course_name", null);
      void ((await show_cart(update, context)));
      return;
  } else if (pyT((pyEq(data, "clear_cart")))) {
      db.clear_cart(user_id);
      pyPop(context.user_data, "applied_coupon", null);
      pyPop(context.user_data, "discounted_price", null);
      pyPop(context.user_data, "coupon_course", null);
      pyPop(context.user_data, "awaiting_coupon", null);
      void ((await query.answer("✕ কার্ট খালি করা হয়েছে!", { show_alert: true })));
      void ((await show_cart(update, context)));
  } else if (pyT((pyEq(data, "checkout_cart")))) {
      items = db.get_cart(user_id);
      if (pyT((!pyT(items)))) {
            void ((await query.answer("কার্ট খালি!", { show_alert: true })));
            return;
      }
      total = pySum(((() => { const __acc = []; for (const item of pyIter(items)) { __acc.push(pyGet(item, "price", 0)); } return __acc; })()));
      original_total = total;
      course_names = pyJoin(", ", ((() => { const __acc = []; for (const i of pyIter(items)) { __acc.push(pySub(i, "name")); } return __acc; })()));
      course_ids = ((() => { const __acc = []; for (const i of pyIter(items)) { __acc.push(pySub(i, "id")); } return __acc; })());
      context.user_data["checkout_type"] = "cart";
      context.user_data["checkout_courses"] = course_ids;
      context.user_data["checkout_course_name"] = course_names;
      applied_coupon = pyGet(context.user_data, "applied_coupon");
      discount_val = 0;
      if (pyT(applied_coupon)) {
            [valid, discount, message, coupon_obj] = db.validate_coupon_advanced(applied_coupon, user_id, total, "All", { course_ids: course_ids });
            if (pyT(valid)) {
                    discount_val = discount;
                    total = pyMax(0, (total - discount));
            }
      }
      context.user_data["checkout_total"] = total;
      user_bal = pyGet((((__v19) => (pyT(__v19) ? __v19 : ({  })))(db.get_user(user_id))), "balance", 0);
      methods = db.get_payment_methods({ active_only: true });
      keyboard = [];
      if (pyT((((__v20) => (pyT(__v20) ? (((total > 0))) : __v20))(((user_bal > 0)))))) {
            if (pyT(((user_bal >= total)))) {
                    _wbtn = `💰 Pay with Wallet Balance (৳${pyStr(user_bal)})`;
            } else {
                    _wbtn = `💰 Use Wallet ৳${pyStr(user_bal)}`;
            }
            pyAppend(keyboard, [InlineKeyboardButton(_wbtn, { callback_data: "pay_wallet_balance" })]);
      }
      for (const method of pyIter(methods)) {
            m_key = pyLower(pySub(method, "key"));
            emoji = (pyT((pyContains(m_key, "bkash"))) ? ("💗") : ((pyT((pyContains(m_key, "nagad"))) ? ("🟠") : ((pyT((pyContains(m_key, "rocket"))) ? ("🟣") : ("💳"))))));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(emoji)} ${pyStr(pySub(method, "name"))}`, { callback_data: `pay_${pyStr(pySub(method, "key"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: "cancel_buy" })]);
      items_list = pyJoin("\n", ((() => { const __acc = []; for (const [idx, i] of pyIter(pyEnumerate(items, 1))) { __acc.push(`${pyStr(idx)}. <b>${pyStr(pyHtmlEscape(pySub(i, "name")))}</b> — ৳${pyStr(pySub(i, "price"))}`); } return __acc; })()));
      bal_info = (pyT(((user_bal > 0))) ? (`
💰 <b>Wallet Balance:</b> ৳${pyStr(user_bal)} BDT`) : (""));
      if (pyT(((discount_val > 0)))) {
            msg = `💳 <b>Select payment method:</b>

📦 <b>Cart Items (${pyStr(pyLen(items))}):</b>
${pyStr(items_list)}

💰 <b>Price:</b> ৳${pyStr(original_total)}
🎟 <b>Coupon Discount:</b> -৳${pyStr(discount_val)}
✅ <b>Total:</b> ৳${pyStr(total)}${pyStr(bal_info)}`;
      } else {
            msg = `💳 <b>Select payment method:</b>

📦 <b>Cart Items (${pyStr(pyLen(items))}):</b>
${pyStr(items_list)}

💰 <b>Total:</b> ৳${pyStr(total)}${pyStr(bal_info)}`;
      }
      course_image = null;
      if (pyT((pyEq(pyLen(items), 1)))) {
            course_image = pyGet(pySub(items, 0), "image");
      }
      void ((await send_rich_course_message(query, msg, InlineKeyboardMarkup(keyboard), { image: course_image, is_edit: true })));
  } else if (pyT(pyStart(data, "free_enroll_"))) {
      course_id = pyReplace(data, "free_enroll_", "");
      course = db.get_course(course_id);
      if (pyT(course)) {
            db.add_purchase(user_id, course_id);
            keyboard = [];
            void ((await append_course_join_buttons(keyboard, context.bot, course, user_id, { query: query, force_new: true, prefix: "🔗 ", single_text: `${pyStr(pySub(course, "name"))}` })));
            pyAppend(keyboard, [InlineKeyboardButton("🎓 My Courses", { callback_data: "my_courses_nav" })]);
            msg = `🎉 ** Congratulations! Course added to your profile!**

 **Course:** ${pyStr(pySub(course, "name"))}

👇 Click the button below to join:`;
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
  } else if (pyT(pyStart(data, "coupon_"))) {
      course_id = pyReplace(data, "coupon_", "");
      context.user_data["awaiting_coupon"] = true;
      context.user_data["coupon_course"] = course_id;
      if (pyT((pyEq(course_id, "cart")))) {
            items = db.get_cart(user_id);
            if (pyT((!pyT(items)))) {
                    void ((await query.answer("❌ আপনার কার্ট খালি!", { show_alert: true })));
                    return;
            }
            total = pySum(((() => { const __acc = []; for (const item of pyIter(items)) { __acc.push(pyGet(item, "price", 0)); } return __acc; })()));
            context.user_data["checkout_courses"] = ((() => { const __acc = []; for (const i of pyIter(items)) { __acc.push(pySub(i, "id")); } return __acc; })());
            context.user_data["checkout_total"] = total;
            text = "🎟 **Enter Coupon Code**\n━━━━━━━━━━━━━━━━━━━━\n\n✍️ Type your coupon code and send it.\n\n💡 Example: `EID25`";
            keyboard = [[InlineKeyboardButton("⏭️ Skip (No Coupon)", { callback_data: "skipcoupon_cart" })], [InlineKeyboardButton("◀️ Back", { callback_data: "view_cart" })]];
            if (pyT((pyEq(pyLen(items), 1)))) {
                    _banner = pyGet(pySub(items, 0), "image");
                    if (pyT(_banner)) {
                              if (pyT(_msg_has_media(query.message))) {
                                          try {
                                                        if (pyT((await _edit_photo_smooth(query, _banner, text, InlineKeyboardMarkup(keyboard), "Markdown")))) {
                                                                        try {
                                                                                          context.user_data["coupon_prompt_msg_id"] = query.message.message_id;
                                                                        } catch (__e) {
                                                                        }
                                                                        return;
                                                        }
                                          } catch (__e) {
                                          }
                                          try {
                                                        void ((await query.message.delete()));
                                          } catch (__e) {
                                          }
                                          sent = (await query.message.reply_photo({ photo: _banner, caption: text, parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) }));
                                          try {
                                                        context.user_data["coupon_prompt_msg_id"] = sent.message_id;
                                          } catch (__e) {
                                          }
                              } else {
                                          try {
                                                        void ((await query.message.delete()));
                                          } catch (__e) {
                                          }
                                          sent = (await query.message.reply_photo({ photo: _banner, caption: text, parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) }));
                                          try {
                                                        context.user_data["coupon_prompt_msg_id"] = sent.message_id;
                                          } catch (__e) {
                                          }
                              }
                              return;
                    }
            }
      } else {
            course = db.get_course(course_id);
            eb = (pyT((!pyT(course))) ? (db.get_ebook(course_id)) : (null));
            text = "🎟 **Enter Coupon Code**\n━━━━━━━━━━━━━━━━━━━━\n\n✍️ Type your coupon code and send it.\n\n💡 Example: `EID25`";
            if (pyT(eb)) {
                    keyboard = [[InlineKeyboardButton("⏭️ Skip (No Coupon)", { callback_data: `skipcoupon_${pyStr(course_id)}` })], [InlineKeyboardButton("◀️ Back", { callback_data: `view_eb_${pyStr(course_id)}` })]];
            } else {
                    keyboard = [[InlineKeyboardButton("⏭️ Skip (No Coupon)", { callback_data: `skipcoupon_${pyStr(course_id)}` })], [InlineKeyboardButton("◀️ Back", { callback_data: `course_${pyStr(course_id)}` })]];
            }
            banner_img = (((__v22) => (pyT(__v22) ? __v22 : ((pyT(eb) ? (pyGet((((__v21) => (pyT(__v21) ? __v21 : ({  })))(eb)), "image")) : (null)))))((pyT(course) ? (pyGet(course, "image")) : (null))));
            if (pyT(banner_img)) {
                    if (pyT(_msg_has_media(query.message))) {
                              try {
                                          if (pyT((await _edit_photo_smooth(query, banner_img, text, InlineKeyboardMarkup(keyboard), "Markdown")))) {
                                                        try {
                                                                        context.user_data["coupon_prompt_msg_id"] = query.message.message_id;
                                                        } catch (__e) {
                                                        }
                                                        return;
                                          }
                              } catch (__e) {
                              }
                              try {
                                          void ((await query.message.delete()));
                              } catch (__e) {
                              }
                              sent = (await query.message.reply_photo({ photo: banner_img, caption: text, parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) }));
                              try {
                                          context.user_data["coupon_prompt_msg_id"] = sent.message_id;
                              } catch (__e) {
                              }
                    } else {
                              try {
                                          void ((await query.message.delete()));
                              } catch (__e) {
                              }
                              sent = (await query.message.reply_photo({ photo: banner_img, caption: text, parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) }));
                              try {
                                          context.user_data["coupon_prompt_msg_id"] = sent.message_id;
                              } catch (__e) {
                              }
                    }
                    return;
            }
      }
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            sent = (await query.message.reply_text(text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) }));
            try {
                    context.user_data["coupon_prompt_msg_id"] = sent.message_id;
            } catch (__e) {
            }
      } else {
            void ((await query.edit_message_text(text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
            try {
                    context.user_data["coupon_prompt_msg_id"] = query.message.message_id;
            } catch (__e) {
            }
      }
  } else if (pyT(pyStart(data, "skipcoupon_"))) {
      target = pyReplace(data, "skipcoupon_", "");
      context.user_data["awaiting_coupon"] = false;
      pyPop(context.user_data, "discounted_price", null);
      pyPop(context.user_data, "applied_coupon", null);
      pyPop(context.user_data, "coupon_course", null);
      pyPop(context.user_data, "coupon_prompt_msg_id", null);
      void ((await query.answer()));
          class _SkipQ {
                constructor(message, data, user) {
                        this.message = message;
                        this.data = data;
                        this.from_user = user;
                        this.id = "0";
                }
                async answer(...__args) {
                }
                async edit_message_text(...__args) {
                        return ((await this.message.reply_text(...__args)));
                }
          }
          class _SkipU {
                constructor(message, callback_query) {
                        this.message = message;
                        this.callback_query = callback_query;
                        this.effective_user = callback_query.from_user;
                        this.effective_chat = message.chat;
                }
          }
      new_data = (pyT((pyEq(target, "cart"))) ? ("checkout_cart") : ((pyT(db.get_ebook(target)) ? (`buy_eb_${pyStr(target)}`) : (`buy_${pyStr(target)}`))));
      void ((await handle_callback(_SkipU(query.message, _SkipQ(query.message, new_data, query.from_user)), context)));
      return;
  } else if (pyT((pyEq(data, "browse_ebooks")))) {
      void ((await browse_ebooks(update, context)));
      return;
  } else if (pyT(pyStart(data, "ebcat_"))) {
      cat = pyReplace(data, "ebcat_", "");
      void ((await show_ebooks_by_category(update, context, cat)));
      return;
  } else if (pyT(pyStart(data, "view_eb_"))) {
      eb_id = pyReplace(data, "view_eb_", "");
      void ((await view_ebook_details(update, context, eb_id)));
      return;
  } else if (pyT(pyStart(data, "unlock_free_eb_"))) {
      eb_id = pyReplace(data, "unlock_free_eb_", "");
      db.add_ebook_purchase(user_id, eb_id);
      void ((await query.answer("🎉 ই-বুকটি আপনার সংগৃহীত তালিকায় যুক্ত হয়েছে!", { show_alert: true })));
      void ((await view_ebook_details(update, context, eb_id)));
      return;
  } else if (pyT(pyStart(data, "buy_eb_"))) {
      eb_id = pyReplace(data, "buy_eb_", "");
      eb = db.get_ebook(eb_id);
      if (pyT((!pyT(eb)))) {
            return;
      }
      discounted_price = pyGet(context.user_data, "discounted_price");
      total = (pyT((((__v23) => (pyT(__v23) ? (((!(discounted_price === null || discounted_price === undefined)))) : __v23))((pyEq(pyGet(context.user_data, "coupon_course"), eb_id))))) ? (discounted_price) : (pySub(eb, "price")));
      context.user_data["checkout_type"] = "ebook";
      context.user_data["checkout_course"] = eb_id;
      context.user_data["checkout_courses"] = [eb_id];
      context.user_data["checkout_course_name"] = pySub(eb, "name");
      context.user_data["checkout_total"] = total;
      user_bal = pyGet((((__v24) => (pyT(__v24) ? __v24 : ({  })))(db.get_user(user_id))), "balance", 0);
      methods = db.get_payment_methods({ active_only: true });
      keyboard = [];
      if (pyT((((__v25) => (pyT(__v25) ? (((total > 0))) : __v25))(((user_bal > 0)))))) {
            if (pyT(((user_bal >= total)))) {
                    _wbtn = `💰 Pay with Wallet Balance (৳${pyStr(user_bal)})`;
            } else {
                    _wbtn = `💰 Use Wallet ৳${pyStr(user_bal)}`;
            }
            pyAppend(keyboard, [InlineKeyboardButton(_wbtn, { callback_data: "pay_wallet_balance" })]);
      }
      for (const method of pyIter(methods)) {
            m_key = pyLower(pySub(method, "key"));
            emoji = (pyT((pyContains(m_key, "bkash"))) ? ("💗") : ((pyT((pyContains(m_key, "nagad"))) ? ("🟠") : ((pyT((pyContains(m_key, "rocket"))) ? ("🟣") : ("💳"))))));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(emoji)} ${pyStr(pySub(method, "name"))}`, { callback_data: `pay_${pyStr(pySub(method, "key"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: `view_eb_${pyStr(eb_id)}` })]);
      bal_info = (pyT(((user_bal > 0))) ? (`
💰 <b>Wallet Balance:</b> ৳${pyStr(user_bal)} BDT`) : (""));
      is_coupon_active = (pyEq(pyGet(context.user_data, "coupon_course"), eb_id));
      if (pyT(is_coupon_active)) {
            discount_val = (pySub(eb, "price") - total);
            msg = `💳 <b>Select payment method:</b>

📘 <b>E-Book:</b> ${pyStr(pySub(eb, "name"))}
💰 <b>Price:</b> ৳${pyStr(pySub(eb, "price"))}
🎟 <b>Coupon Discount:</b> -৳${pyStr(discount_val)}
✅ <b>Total:</b> ৳${pyStr(total)}${pyStr(bal_info)}`;
      } else {
            msg = `💳 <b>Select payment method:</b>

📘 <b>E-Book:</b> ${pyStr(pySub(eb, "name"))}
💰 <b>Price:</b> ৳${pyStr(pySub(eb, "price"))}
✅ <b>Total:</b> ৳${pyStr(total)}${pyStr(bal_info)}`;
      }
      void ((await send_rich_course_message(query, msg, InlineKeyboardMarkup(keyboard), { image: pyGet(eb, "image"), is_edit: true })));
      return;
  } else if (pyT(pyStart(data, "buy_"))) {
      course_id = pyReplace(data, "buy_", "");
      course = db.get_course(course_id);
      if (pyT((!pyT(course)))) {
            return;
      }
      discounted_price = pyGet(context.user_data, "discounted_price");
      total = (pyT((((__v26) => (pyT(__v26) ? (((!(discounted_price === null || discounted_price === undefined)))) : __v26))((pyEq(pyGet(context.user_data, "coupon_course"), course_id))))) ? (discounted_price) : (pySub(course, "price")));
      context.user_data["checkout_type"] = "single";
      context.user_data["checkout_course"] = course_id;
      context.user_data["checkout_course_name"] = pySub(course, "name");
      context.user_data["checkout_total"] = total;
      user_bal = pyGet((((__v27) => (pyT(__v27) ? __v27 : ({  })))(db.get_user(user_id))), "balance", 0);
      methods = db.get_payment_methods({ active_only: true });
      keyboard = [];
      if (pyT((((__v28) => (pyT(__v28) ? (((total > 0))) : __v28))(((user_bal > 0)))))) {
            if (pyT(((user_bal >= total)))) {
                    _wbtn = `💰 Pay with Wallet Balance (৳${pyStr(user_bal)})`;
            } else {
                    _wbtn = `💰 Use Wallet ৳${pyStr(user_bal)}`;
            }
            pyAppend(keyboard, [InlineKeyboardButton(_wbtn, { callback_data: "pay_wallet_balance" })]);
      }
      for (const method of pyIter(methods)) {
            m_key = pyLower(pySub(method, "key"));
            emoji = (pyT((pyContains(m_key, "bkash"))) ? ("💗") : ((pyT((pyContains(m_key, "nagad"))) ? ("🟠") : ((pyT((pyContains(m_key, "rocket"))) ? ("🟣") : ("💳"))))));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(emoji)} ${pyStr(pySub(method, "name"))}`, { callback_data: `pay_${pyStr(pySub(method, "key"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: "cancel_buy" })]);
      bal_info = (pyT(((user_bal > 0))) ? (`
💰 <b>Wallet Balance:</b> ৳${pyStr(user_bal)} BDT`) : (""));
      is_coupon_active = (pyEq(pyGet(context.user_data, "coupon_course"), course_id));
      if (pyT(is_coupon_active)) {
            discount_val = (pySub(course, "price") - total);
            msg = `💳 <b>Select payment method:</b>

📘 <b>Course:</b> ${pyStr(pySub(course, "name"))}
💰 <b>Price:</b> ৳${pyStr(pySub(course, "price"))}
🎟 <b>Coupon Discount:</b> -৳${pyStr(discount_val)}
✅ <b>Total:</b> ৳${pyStr(total)}${pyStr(bal_info)}`;
      } else {
            msg = `💳 <b>Select payment method:</b>

📘 <b>Course:</b> ${pyStr(pySub(course, "name"))}
💰 <b>Price:</b> ৳${pyStr(pySub(course, "price"))}
✅ <b>Total:</b> ৳${pyStr(total)}${pyStr(bal_info)}`;
      }
      course_image = pyGet(course, "image");
      void ((await send_rich_course_message(query, msg, InlineKeyboardMarkup(keyboard), { image: course_image, is_edit: true })));
  } else if (pyT((pyEq(data, "pay_wallet_balance")))) {
      user_data = (((__v29) => (pyT(__v29) ? __v29 : ({  })))(db.get_user(user_id)));
      user_bal = pyGet(user_data, "balance", 0);
      total = pyGet(context.user_data, "checkout_total", 0);
      c_type = pyGet(context.user_data, "checkout_type", "single");
      applied_coupon = pyGet(context.user_data, "applied_coupon", "");
      if (pyT((((__v30) => (pyT(__v30) ? __v30 : (((total <= 0)))))(((user_bal <= 0)))))) {
            void ((await query.answer("❌ ওয়ালেট ব্যালেন্স নেই!", { show_alert: true })));
            return;
      }
      use_amt = pyMin(user_bal, total);
      deducted = db.deduct_balance(user_id, use_amt);
      if (pyT((!pyT(deducted)))) {
            void ((await query.answer("❌ ব্যালেন্স কাটতে সমস্যা হয়েছে! পুনরায় চেষ্টা করুন।", { show_alert: true })));
            return;
      }
      context.user_data["wallet_used"] = (pyGet(context.user_data, "wallet_used", 0) + use_amt);
      remaining = (total - use_amt);
      context.user_data["checkout_total"] = remaining;
      if (pyT(((remaining > 0)))) {
            methods = db.get_payment_methods({ active_only: true });
            keyboard = [];
            for (const method of pyIter(methods)) {
                    m_key = pyLower(pySub(method, "key"));
                    emoji = (pyT((pyContains(m_key, "bkash"))) ? ("💗") : ((pyT((pyContains(m_key, "nagad"))) ? ("🟠") : ((pyT((pyContains(m_key, "rocket"))) ? ("🟣") : ("💳"))))));
                    pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(emoji)} ${pyStr(pySub(method, "name"))}`, { callback_data: `pay_${pyStr(pySub(method, "key"))}` })]);
            }
            pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: "cancel_buy" })]);
            c_name = pyGet(context.user_data, "checkout_course_name", "Course");
            msg = `💳 <b>Select payment method for the rest:</b>

📘 <b>Course:</b> ${pyStr(c_name)}
💰 <b>Total:</b> ৳${pyStr(total)}
💳 <b>Wallet Used:</b> -৳${pyStr(use_amt)}
✅ <b>Due:</b> ৳${pyStr(remaining)}`;
            void ((await query.answer(`✅ ৳${pyStr(use_amt)} wallet থেকে কাটা হয়েছে! বাকি ৳${pyStr(remaining)}`, { show_alert: true })));
            course_image = null;
            try {
                    if (pyT((pyEq(c_type, "ebook")))) {
                              _eb = db.get_ebook(pyGet(context.user_data, "checkout_course", ""));
                              course_image = pyGet((((__v31) => (pyT(__v31) ? __v31 : ({  })))(_eb)), "image");
                    } else {
                              _cids = (((__v32) => (pyT(__v32) ? __v32 : ((pyT(pyGet(context.user_data, "checkout_course")) ? ([pyGet(context.user_data, "checkout_course")]) : ([])))))(pyGet(context.user_data, "checkout_courses")));
                              for (const _cid of pyIter(_cids)) {
                                          _c = db.get_course(_cid);
                                          if (pyT((((__v33) => (pyT(__v33) ? (pyGet(_c, "image")) : __v33))(_c)))) {
                                                        course_image = pyGet(_c, "image");
                                                        break;
                                          }
                              }
                    }
            } catch (__e) {
                    course_image = null;
            }
            sent = (await send_rich_course_message(query, msg, InlineKeyboardMarkup(keyboard), { image: course_image, is_edit: true }));
            try {
                    mid = (((__v34) => (pyT(__v34) ? __v34 : (query.message.message_id)))(pyGetAttr(sent, "message_id", null)));
                    context.user_data["pay_prompt_msg_id"] = mid;
            } catch (__e) {
            }
            return;
      }
      order_id = db.generate_next_order_id();
      course_name = pyGet(context.user_data, "checkout_course_name", "Course");
      course_id = pyGet(context.user_data, "checkout_course", "");
      courses_in_order = pyGet(context.user_data, "checkout_courses", (pyT(course_id) ? ([course_id]) : ([])));
      order_data = { user_id: user_id, username: (((__v35) => (pyT(__v35) ? __v35 : ("")))(update.effective_user.username)), full_name: (((__v36) => (pyT(__v36) ? __v36 : ("")))(update.effective_user.full_name)), course_id: course_id, courses: courses_in_order, course_name: course_name, amount: total, payment_method: "Wallet Balance", trxid: `WALLET-${pyStr(user_id)}`, coupon_code: applied_coupon, wallet_used: use_amt, status: "approved", date: pyStr(pyNow()), checkout_type: c_type };
      db.add_order(order_id, order_data);
      if (pyT(applied_coupon)) {
            db.use_coupon(applied_coupon, user_id);
      }
      keyboard = [];
      if (pyT((pyEq(c_type, "ebook")))) {
            db.add_ebook_purchase(user_id, course_id);
            eb_obj = db.get_ebook(course_id);
            if (pyT(eb_obj)) {
                    if (pyT(pyGet(eb_obj, "file_id"))) {
                              pyAppend(keyboard, [InlineKeyboardButton("📥 Download (PDF)", { callback_data: `ebdl_${pyStr(course_id)}` })]);
                    } else if (pyT(pyGet(eb_obj, "access_link"))) {
                              pyAppend(keyboard, [InlineKeyboardButton("📥 Download E-Book", { url: pySub(eb_obj, "access_link") })]);
                    }
            }
            pyAppend(keyboard, [InlineKeyboardButton("📚 My E-Books", { callback_data: "my_ebooks_nav" })]);
      } else if (pyT((pyEq(c_type, "cart")))) {
            has_eb = false;
            for (const cid of pyIter(courses_in_order)) {
                    _eb = db.get_ebook(cid);
                    if (pyT(_eb)) {
                              has_eb = true;
                              db.add_ebook_purchase(user_id, cid);
                              continue;
                    }
                    db.add_purchase(user_id, cid);
                    c_obj = db.get_course(cid);
                    if (pyT(c_obj)) {
                              void ((await append_course_join_buttons(keyboard, context.bot, c_obj, user_id, { query: query, force_new: true, invite_name: `Order ${pyStr(format_order_id_display(order_id))}`, prefix: `🔗 ${pyStr(pySlice(pyGet(c_obj, "name", ""), null, 12, null))} | `, single_text: `${pyStr(pySub(c_obj, "name"))}` })));
                    }
            }
            db.clear_cart(user_id);
            if (pyT(has_eb)) {
                    pyAppend(keyboard, [InlineKeyboardButton("📚 My E-Books", { callback_data: "my_ebooks_nav" })]);
            }
            pyAppend(keyboard, [InlineKeyboardButton("🎓 My Courses", { callback_data: "my_courses_nav" })]);
      } else {
            db.add_purchase(user_id, course_id);
            c_obj = db.get_course(course_id);
            if (pyT(c_obj)) {
                    void ((await append_course_join_buttons(keyboard, context.bot, c_obj, user_id, { query: query, force_new: true, invite_name: `Order ${pyStr(format_order_id_display(order_id))}`, prefix: `🔗 ${pyStr(pySlice(pyGet(c_obj, "name", ""), null, 12, null))} | `, single_text: `${pyStr(pySub(c_obj, "name"))}` })));
            }
            pyAppend(keyboard, [InlineKeyboardButton("🎓 My Courses", { callback_data: "my_courses_nav" })]);
      }
      if (pyT(db.is_home_button_enabled())) {
            pyAppend(keyboard, [InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" })]);
      }
      pyPop(context.user_data, "discounted_price", null);
      pyPop(context.user_data, "pay_method", null);
      pyPop(context.user_data, "pay_amount", null);
      pyPop(context.user_data, "checkout_course", null);
      pyPop(context.user_data, "checkout_courses", null);
      pyPop(context.user_data, "applied_coupon", null);
      pyPop(context.user_data, "checkout_total", null);
      remaining_bal = pyGet((((__v37) => (pyT(__v37) ? __v37 : ({  })))(db.get_user(user_id))), "balance", 0);
      success_msg = `🎉 <b>পেমেন্ট সফল হয়েছে! (Wallet Balance)</b>
━━━━━━━━━━━━━━━━━━━━

📦 <b>Order ID:</b> <code>${pyStr(format_order_id_display(order_id))}</code>
📘 <b>আইটেম:</b> ${pyStr(pyHtmlEscape(course_name))}
💰 <b>পরিশোধিত মূল্য:</b> <code>৳${pyStr(total)} BDT</code>
💳 <b>অবশিষ্ট ওয়ালেট ব্যালেন্স:</b> <code>৳${pyStr(remaining_bal)} BDT</code>

✅ <i>আপনার কোর্স/ই-বুক সরাসরি সক্রিয় করা হয়েছে। নিচের বাটনে চাপ দিয়ে ক্লাসে যুক্ত হোন!</i>`;
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(success_msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await query.edit_message_text(success_msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
      for (const aid of pyIter(get_notify_admins("orders"))) {
            try {
                    void ((await context.bot.send_message(aid, `🔔 <b>New Wallet Purchase Order!</b>
━━━━━━━━━━━━━━━━━━━━
📦 <b>Order:</b> <code>${pyStr(format_order_id_display(order_id))}</code>
👤 <b>User:</b> ${pyStr(pyHtmlEscape((((__v38) => (pyT(__v38) ? __v38 : ("User")))(update.effective_user.full_name))))} (<code>${pyStr(user_id)}</code>)
📘 <b>Item:</b> ${pyStr(pyHtmlEscape(course_name))}
💰 <b>Amount:</b> <code>৳${pyStr(total)} BDT</code> (Wallet Auto-Approved)`, { parse_mode: "HTML" })));
            } catch (__e) {
            }
      }
      return;
  } else if (pyT(pyStart(data, "pay_"))) {
      method_key = pyReplace(data, "pay_", "");
      total = pyGet(context.user_data, "checkout_total", 0);
      c_type = pyGet(context.user_data, "checkout_type");
      c_name = pyGet(context.user_data, "checkout_course_name");
      if (pyT((!pyT(c_type)))) {
            if (pyT((((__v39) => (pyT(__v39) ? __v39 : ((pyEq(pyGet(context.user_data, "coupon_course"), "cart")))))(pyGet(context.user_data, "checkout_courses"))))) {
                    c_type = "cart";
                    context.user_data["checkout_type"] = "cart";
            } else if (pyT((((__v41) => (pyT(__v41) ? __v41 : (((__v40) => (pyT(__v40) ? __v40 : (pyGet(context.user_data, "coupon_course"))))(pyGet(context.user_data, "current_course")))))(pyGet(context.user_data, "checkout_course"))))) {
                    c_type = "single";
                    context.user_data["checkout_type"] = "single";
            }
      }
      if (pyT((pyEq(c_type, "cart")))) {
            items = db.get_cart(user_id);
            if (pyT(items)) {
                    c_name = ("\n" + pyJoin("\n", ((() => { const __acc = []; for (const i of pyIter(items)) { __acc.push(`  • ${pyStr(pyHtmlEscape(pySub(i, "name")))}`); } return __acc; })())));
                    context.user_data["checkout_courses"] = ((() => { const __acc = []; for (const i of pyIter(items)) { __acc.push(pySub(i, "id")); } return __acc; })());
                    context.user_data["checkout_course_name"] = pyJoin(", ", ((() => { const __acc = []; for (const i of pyIter(items)) { __acc.push(pySub(i, "name")); } return __acc; })()));
            } else if (pyT((!pyT(c_name)))) {
                    c_name = "Cart Items";
            }
      } else {
            cid = (((__v43) => (pyT(__v43) ? __v43 : (((__v42) => (pyT(__v42) ? __v42 : (pyGet(context.user_data, "coupon_course"))))(pyGet(context.user_data, "current_course")))))(pyGet(context.user_data, "checkout_course")));
            if (pyT((((__v44) => (pyT(__v44) ? (((!pyEq(cid, "cart")))) : __v44))(cid)))) {
                    c_obj = db.get_course(cid);
                    if (pyT(c_obj)) {
                              c_name = pyHtmlEscape(pyGet(c_obj, "name", "Course"));
                              context.user_data["checkout_course"] = cid;
                              context.user_data["checkout_course_name"] = pyGet(c_obj, "name", "Course");
                    } else {
                              _eb = db.get_ebook(cid);
                              if (pyT(_eb)) {
                                          c_name = pyHtmlEscape(pyGet(_eb, "name", "E-Book"));
                                          context.user_data["checkout_course"] = cid;
                                          context.user_data["checkout_course_name"] = pyGet(_eb, "name", "E-Book");
                              }
                    }
            }
            if (pyT((((__v45) => (pyT(__v45) ? __v45 : ((pyEq(c_name, "Course")))))((!pyT(c_name)))))) {
                    items = db.get_cart(user_id);
                    if (pyT(items)) {
                              c_type = "cart";
                              context.user_data["checkout_type"] = "cart";
                              c_name = ("\n" + pyJoin("\n", ((() => { const __acc = []; for (const i of pyIter(items)) { __acc.push(`  • ${pyStr(pyHtmlEscape(pySub(i, "name")))}`); } return __acc; })())));
                    }
            }
      }
      if (pyT((!pyT(c_name)))) {
            c_name = "Course";
      }
      method_obj = db.get_payment_method(method_key);
      method_name = (pyT(method_obj) ? (pySub(method_obj, "name")) : (pyTitle(method_key)));
      method_number = (pyT(method_obj) ? (pySub(method_obj, "number")) : ("01XXXXXXXXX"));
      method_ins = (pyT(method_obj) ? (pyGet(method_obj, "instruction", "Personal (Send Money)")) : ("Personal"));
      payment_note = db.get_payment_note();
      context.user_data["awaiting_trxid"] = true;
      context.user_data["pay_method"] = method_name;
      context.user_data["pay_amount"] = total;
      method_emoji = (pyT((pyContains(pyLower(method_key), "bkash"))) ? ("💗") : ((pyT((pyContains(pyLower(method_key), "nagad"))) ? ("🟠") : ((pyT((pyContains(pyLower(method_key), "rocket"))) ? ("🟣") : ("💳"))))));
      course_label = (pyT((pyEq(c_type, "cart"))) ? ("Courses") : ("Course"));
      _wu = pyGet(context.user_data, "wallet_used", 0);
      _wu_line = (pyT(_wu) ? (`
💳 <b>Wallet Used:</b> -৳${pyStr(_wu)}`) : (""));
      instructions = `${pyStr(method_emoji)} <b>${pyStr(method_name)} Payment Instruction</b>
━━━━━━━━━━━━━━━━━━━━
💼 <b>${pyStr(course_label)}:</b> ${pyStr(c_name)}
━━━━━━━━━━━━━━━━━━━━
📱 <b>Number:</b> <code>${pyStr(method_number)}</code>

💰 <b>Amount:</b> <code>৳${pyStr(total)}</code>${pyStr(_wu_line)}
━━━━━━━━━━━━━━━━━━━━

💡 ${pyStr(method_ins)}

${pyStr(payment_note)}`;
      keyboard = [[InlineKeyboardButton("📋 Copy Number", { copy_text: CopyTextButton(pyStr(method_number)) })], [InlineKeyboardButton("◀️ Back", { callback_data: "cancel_trxid" })]];
      course_image = null;
      c_type = pyGet(context.user_data, "checkout_type");
      if (pyT((pyEq(c_type, "single")))) {
            course_id = pyGet(context.user_data, "checkout_course");
            course = db.get_course(course_id);
            if (pyT(course)) {
                    course_image = pyGet(course, "image");
            }
      } else if (pyT((pyEq(c_type, "ebook")))) {
            eb_id = pyGet(context.user_data, "checkout_course");
            eb_obj = (pyT(eb_id) ? (db.get_ebook(eb_id)) : (null));
            if (pyT(eb_obj)) {
                    course_image = pyGet(eb_obj, "image");
            }
      } else if (pyT((pyEq(c_type, "cart")))) {
            cart_courses = pyGet(context.user_data, "checkout_courses", []);
            if (pyT((pyEq(pyLen(cart_courses), 1)))) {
                    first_course = (((__v46) => (pyT(__v46) ? __v46 : (db.get_ebook(pySub(cart_courses, 0)))))(db.get_course(pySub(cart_courses, 0))));
                    if (pyT(first_course)) {
                              course_image = pyGet(first_course, "image");
                    }
            }
      }
      sent = (await send_rich_course_message(query, instructions, InlineKeyboardMarkup(keyboard), { image: course_image, is_edit: true }));
      try {
            mid = (((__v47) => (pyT(__v47) ? __v47 : (query.message.message_id)))(pyGetAttr(sent, "message_id", null)));
            context.user_data["pay_prompt_msg_id"] = mid;
      } catch (__e) {
      }
  } else if (pyT(pyStart(data, "copy_num_"))) {
      num = pyReplace(data, "copy_num_", "");
      void ((await query.answer()));
      return;
  } else if (pyT(pyStart(data, "share_"))) {
      course_id = pyReplace(data, "share_", "");
      course = db.get_course(course_id);
      if (pyT(course)) {
            share_text = `🎓 ${pyStr(pySub(course, "name"))}
💰 মূল্য: ${pyStr(pySub(course, "price"))} ৳

এখনই জয়েন করতে টেলিগ্রাম বটের এই লিংকে ক্লিক করুন:
https://t.me/${pyStr(BOT_USERNAME)}?start=course_${pyStr(course_id)}`;
            share_url = `https://t.me/share/url?url=${pyStr(pyQuotePlus(`https://t.me/${pyStr(BOT_USERNAME)}?start=course_${pyStr(course_id)}`))}&text=${pyStr(pyQuotePlus(pySub(course, "name")))}`;
            void ((await query.message.reply_text(share_text, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("➥ Share Link", { url: share_url })]]) })));
      }
  } else if (pyT((((__v48) => (pyT(__v48) ? __v48 : (pyStart(data, "my_orders_pg_"))))((pyEq(data, "my_orders_history")))))) {
      try {
            page_num = (pyT(pyStart(data, "my_orders_pg_")) ? (pyInt(pyReplace(data, "my_orders_pg_", ""))) : (0));
      } catch (__e) {
            page_num = 0;
      }
      orders = db.get_user_orders(user_id);
      if (pyT((!pyT(orders)))) {
            void ((await query.edit_message_text("🧾 No order history found.", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("◀️ Profile", { callback_data: "profile_nav" })]]) })));
            return;
      }
      per_page = 8;
      total_pages = pyMax(1, pyDiv(((pyLen(orders) + per_page) - 1), per_page));
      page_num = pyMax(0, pyMin(page_num, (total_pages - 1)));
      context.user_data["ord_hist_page"] = page_num;
      total_spent = pySum(((() => { const __acc = []; for (const o of pyIter(orders)) { if (!pyT((pyEq(pyGet(o, "status"), "approved")))) continue; __acc.push(pyInt((((__v49) => (pyT(__v49) ? __v49 : (0)))(pyGet(o, "amount", 0))))); } return __acc; })()));
      msg = `📋 <b>Order History (${pyStr(pyLen(orders))} Items)</b>
💰 <b>Total Spent:</b> ৳${pyStr(total_spent)}
━━━━━━━━━━━━━━━━━━━━
Tap any order for details + access links:`;
      keyboard = [];
      for (const o of pyIter(pySlice(orders, ((typeof page_num === 'string' || Array.isArray(page_num) ? pyRepeat(page_num, per_page) : (page_num * per_page))), ((typeof (page_num + 1) === 'string' || Array.isArray((page_num + 1)) ? pyRepeat((page_num + 1), per_page) : ((page_num + 1) * per_page))), null))) {
            st = pyGet(o, "status", "");
            icon = (pyT((pyEq(st, "approved"))) ? ("✅") : ((pyT((pyEq(st, "pending"))) ? ("⏳") : ("❌"))));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(icon)} #${pyStr(format_order_id_display(pySub(o, "order_id")))} — ${pyStr(pySlice(pyStr(pyGet(o, "course_name", "Course")), null, 28, null))}`, { callback_data: `myord_${pyStr(pySub(o, "order_id"))}` })]);
      }
      nav = [];
      if (pyT(((page_num > 0)))) {
            pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `my_orders_pg_${pyStr((page_num - 1))}` }));
      } else {
            pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_ordhist" }));
      }
      pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page_num + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_ordhist" }));
      if (pyT(((page_num < (total_pages - 1))))) {
            pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `my_orders_pg_${pyStr((page_num + 1))}` }));
      } else {
            pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_ordhist" }));
      }
      pyAppend(keyboard, nav);
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Profile", { callback_data: "profile_nav" })]);
      void ((await query.answer()));
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw e;
            }
      }
  } else if (pyT(pyStart(data, "myord_"))) {
      order_id = pyReplace(data, "myord_", "");
      order = db.get_order(order_id);
      if (pyT((((__v50) => (pyT(__v50) ? __v50 : (((!pyEq(pyStr(pyGet(order, "user_id")), pyStr(user_id)))))))((!pyT(order)))))) {
            void ((await query.answer("❌ Order not found!", { show_alert: true })));
            return;
      }
      st = pyGet(order, "status", "");
      st_txt = (pyT((pyEq(st, "approved"))) ? ("✅ Approved") : ((pyT((pyEq(st, "pending"))) ? ("⏳ Pending") : ("❌ Cancelled"))));
      cids = (((__v51) => (pyT(__v51) ? __v51 : ((pyT(pyGet(order, "course_id")) ? ([pyGet(order, "course_id")]) : ([])))))(pyGet(order, "courses", [])));
      cids = ((() => { const __acc = []; for (const c of pyIter(cids)) { if (!pyT(c)) continue; __acc.push(c); } return __acc; })());
      msg = `📋 <b>Order #${pyStr(format_order_id_display(order_id))}</b>
━━━━━━━━━━━━━━━━━━━━

📘 <b>Course:</b> ${pyStr(pyHtmlEscape(pyStr(pyGet(order, "course_name", "N/A"))))}
💰 <b>Amount:</b> ৳${pyStr(pyGet(order, "amount", 0))}
💳 <b>Payment:</b> ${pyStr(pyHtmlEscape(pyStr(pyGet(order, "payment_method", "N/A"))))}
🔑 <b>TrxID:</b> <code>${pyStr(pyHtmlEscape(pyStr(pyGet(order, "trxid", "N/A"))))}</code>
📅 <b>Date:</b> ${pyStr(pyHtmlEscape(pySlice(pyStr(pyGet(order, "date", "N/A")), null, 19, null)))}

<b>Status:</b> ${pyStr(st_txt)}`;
      keyboard = [];
      if (pyT((pyEq(st, "approved")))) {
            for (const cid of pyIter(cids)) {
                    c_obj = db.get_course(cid);
                    if (pyT((!pyT(c_obj)))) {
                              continue;
                    }
                    n_added = (await append_course_join_buttons(keyboard, context.bot, c_obj, user_id, { query: null, prefix: `🔗 ${pyStr(pySlice(pyGet(c_obj, "name", ""), null, 12, null))} | `, single_text: `🔗 ${pyStr(pySlice(pyGet(c_obj, "name", "Course"), null, 28, null))}` }));
                    if (pyT((!pyT(n_added)))) {
                              pyAppend(keyboard, [InlineKeyboardButton(`📘 ${pyStr(pySlice(pyGet(c_obj, "name", "Course"), null, 28, null))}`, { callback_data: `course_${pyStr(cid)}` })]);
                    }
            }
      }
      back_pg = pyGet(context.user_data, "ord_hist_page", 0);
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: `my_orders_pg_${pyStr(back_pg)}` })]);
      void ((await query.answer()));
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw e;
            }
      }
  } else if (pyT((((__v52) => (pyT(__v52) ? __v52 : ((pyEq(data, "cancel_trxid")))))((pyEq(data, "cancel_buy")))))) {
      context.user_data["awaiting_trxid"] = false;
      pyPop(context.user_data, "awaiting_coupon", null);
      pyPop(context.user_data, "pay_method", null);
      pyPop(context.user_data, "pay_amount", null);
      pyPop(context.user_data, "applied_coupon", null);
      pyPop(context.user_data, "discounted_price", null);
      pyPop(context.user_data, "coupon_course", null);
      pyPop(context.user_data, "coupon_prompt_msg_id", null);
      pyPop(context.user_data, "pay_prompt_msg_id", null);
      pyPop(context.user_data, "checkout_total", null);
      pyPop(context.user_data, "checkout_courses", null);
      pyPop(context.user_data, "checkout_course_name", null);
      _wu_refund = pyPop(context.user_data, "wallet_used", 0);
      if (pyT(_wu_refund)) {
            db.refund_balance(user_id, _wu_refund);
            void ((await query.answer(`↩️ ৳${pyStr(_wu_refund)} wallet-এ refund হয়েছে!`, { show_alert: false })));
      }
      c_type = pyPop(context.user_data, "checkout_type", null);
      if (pyT((((__v53) => (pyT(__v53) ? (pyGet(context.user_data, "checkout_course")) : __v53))((pyEq(c_type, "single")))))) {
            course_id = pyPop(context.user_data, "checkout_course");
            course = db.get_course(course_id);
            if (pyT(course)) {
                    void ((await send_course_details(query, context, course, user_id, { is_edit: true })));
                    return;
            }
      } else if (pyT((pyEq(c_type, "cart")))) {
            void ((await show_cart(update, context)));
            return;
      } else if (pyT((((__v54) => (pyT(__v54) ? (pyGet(context.user_data, "checkout_course")) : __v54))((pyEq(c_type, "ebook")))))) {
            eb_id = pyPop(context.user_data, "checkout_course");
            if (pyT(db.get_ebook(eb_id))) {
                    void ((await view_ebook_details(update, context, eb_id)));
                    return;
            }
      }
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
      }
      raw_welcome = db.get_setting("welcome_message", WELCOME_MESSAGE);
      [cleaned_welcome, custom_kb] = parse_inline_buttons(raw_welcome);
      if (pyT(custom_kb)) {
            void ((await query.message.reply_text(cleaned_welcome, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(custom_kb) })));
      } else {
            void ((await send_welcome_text(query.message, raw_welcome, { reply_markup: main_menu_keyboard(user_id) })));
            welcome_kb = get_welcome_inline_keyboard();
            if (pyT((((__v55) => (pyT(__v55) ? (welcome_kb.inline_keyboard) : __v55))(welcome_kb)))) {
                    void ((await query.message.reply_text("", { reply_markup: welcome_kb })));
            }
      }
  } else if (pyT(pyStart(data, "ebdl_"))) {
      eb_id = pyReplace(data, "ebdl_", "");
      eb = db.get_ebook(eb_id);
      _dl_files = _ebook_get_files((((__v56) => (pyT(__v56) ? __v56 : ({  })))(eb)));
      if (pyT((((__v57) => (pyT(__v57) ? (_dl_files) : __v57))(eb)))) {
            try {
                    void ((await query.answer("📥 ডাউনলোড শুরু হচ্ছে...")));
                    _sent = 0;
                    for (const [_i, _f] of pyIter(pyEnumerate(_dl_files))) {
                              _cap = (pyT((pyEq(_i, 0))) ? (`📖 **${pyStr(pySub(eb, "name"))}**

🎓`) : (`📄 **${pyStr(pyGet(_f, "file_name", "document.pdf"))}**`));
                              try {
                                          void ((await context.bot.send_document({ chat_id: user_id, document: pySub(_f, "file_id"), caption: _cap, parse_mode: "Markdown" })));
                              } catch (__e) {
                                          try {
                                                        void ((await context.bot.send_document({ chat_id: user_id, document: pySub(_f, "file_id"), caption: pyReplace(_cap, "**", "") })));
                                          } catch (__e) {
                                                        continue;
                                          }
                              }
                              _sent += 1;
                    }
                    if (pyT((!pyT(_sent)))) {
                              void ((await query.answer("❌ ফাইল পাঠাতে সমস্যা হয়েছে!", { show_alert: true })));
                    }
            } catch (e) {
                    void ((await query.answer("❌ ফাইল পাঠাতে সমস্যা হয়েছে!", { show_alert: true })));
            }
      } else {
            void ((await query.answer("ফাইল পাওয়া যায়নি!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, ["admin_", "adm_", "approve_", "reject_", "ordinfo_", "edprop_", "edebprop_", "apprwdr_", "rejwdr_", "wdrinfo_", "cpnwiz_", "bc_sel_"]))) {
      void ((await handle_admin_callback(update, context)));
  }
}

export async function handle_admin_kb_add_input(update, context) {
  let buttons_grid, custom_kb, keyboard, r_idx, step, text, user_id;
  user_id = update.effective_user.id;
  if (pyT((!pyT(is_admin(user_id))))) {
      return;
  }
  text = pyStrip(update.message.text);
  if (pyT((pyEq(text, "/cancel")))) {
      pyPop(context.user_data, "admin_add_kb_step", null);
      pyPop(context.user_data, "admin_add_kb_data", null);
      void ((await update.message.reply_text("✕ Keyboard configuration aborted.", { reply_markup: main_menu_keyboard(user_id) })));
      return;
  }
  step = pyGet(context.user_data, "admin_add_kb_step");
  if (pyT((pyEq(step, "text")))) {
      pySub(context.user_data, "admin_add_kb_data")["text"] = text;
      void ((await update.message.reply_text(`Button text saved: \`${pyStr(text)}\`

👇 **Select the action type for this button when clicked:**`, { parse_mode: "Markdown", reply_markup: get_action_select_keyboard({ is_edit: false }) })));
      pyPop(context.user_data, "admin_add_kb_step", null);
  } else if (pyT((pyEq(step, "custom_action")))) {
      pySub(context.user_data, "admin_add_kb_data")["action"] = text;
      pyPop(context.user_data, "admin_add_kb_step", null);
      custom_kb = db.get_custom_keyboards();
      keyboard = [];
      buttons_grid = pyGet(custom_kb, "buttons", []);
      for (const r_idx of pyIter(pyRange(pyLen(buttons_grid)))) {
            pyAppend(keyboard, [InlineKeyboardButton(`Row ${pyStr((r_idx + 1))}`, { callback_data: `adm_kb_row_${pyStr(r_idx)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("➕ New Row", { callback_data: "adm_kb_row_new" })]);
      pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_keyboard_settings" })]);
      void ((await update.message.reply_text(`Custom callback data saved: \`${pyStr(text)}\`

👇 **Choose which row to place the new button on:**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function handle_admin_kb_edit_input(update, context) {
  let adm_marker, btn, c_idx, coords, custom_kb, keyboard, msg, r_idx;
  let step, text, user_id;
  user_id = update.effective_user.id;
  if (pyT((!pyT(is_admin(user_id))))) {
      return;
  }
  text = pyStrip(update.message.text);
  coords = pyGet(context.user_data, "admin_edit_kb_coords");
  if (pyT((!pyT(coords)))) {
      pyPop(context.user_data, "admin_edit_kb_step", null);
      void ((await update.message.reply_text("✕ Editing session expired.", { reply_markup: main_menu_keyboard(user_id) })));
      return;
  }
  [r_idx, c_idx] = coords;
  if (pyT((pyEq(text, "/cancel")))) {
      pyPop(context.user_data, "admin_edit_kb_step", null);
      custom_kb = db.get_custom_keyboards();
      btn = pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx);
      adm_marker = (pyT(pyGet(btn, "admin_only")) ? ("🟢 Yes (Admins Only)") : ("🔴 No (All Users)"));
      msg = `✏️ **Modify Keyboard Button**
━━━━━━━━━━━━━━━━━━━━
• **Text:** \`${pyStr(pySub(btn, "text"))}\`
• **Action:** \`${pyStr(pyGet(btn, "action"))}\`
• **Admin Only:** ${pyStr(adm_marker)}
• **Color:** ${pyStr(((pyGet(BUTTON_STYLE_DOT, (((__v58) => (pyT(__v58) ? __v58 : ("none")))(_kb_button_style(btn))), "⚪") + " ") + pyGet(BUTTON_STYLE_NAME, (((__v59) => (pyT(__v59) ? __v59 : ("none")))(_kb_button_style(btn))), "Default")))}
• **Position:** Row ${pyStr((r_idx + 1))}, Column ${pyStr((c_idx + 1))}

Choose what you want to edit:`;
      keyboard = [[InlineKeyboardButton("✏️ Edit Text", { callback_data: "adm_kb_edt_text" }), InlineKeyboardButton("🔗 Edit Action", { callback_data: "adm_kb_edt_action" })], [InlineKeyboardButton("↔️ Move Position", { callback_data: "adm_kb_edt_move" }), InlineKeyboardButton("👑 Toggle Admin-Only", { callback_data: "adm_kb_edt_adm" })], [InlineKeyboardButton("🎨 Edit Color", { callback_data: "adm_kb_edt_color" })], [InlineKeyboardButton("« Keyboard Settings", { callback_data: "adm_keyboard_settings" })]];
      void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  step = pyGet(context.user_data, "admin_edit_kb_step");
  custom_kb = db.get_custom_keyboards();
  if (pyT((pyEq(step, "text")))) {
      pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx)["text"] = text;
      db.save_custom_keyboards(custom_kb);
      pyPop(context.user_data, "admin_edit_kb_step", null);
      void ((await update.message.reply_text("✅ Button text updated successfully!")));
      btn = pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx);
      adm_marker = (pyT(pyGet(btn, "admin_only")) ? ("🟢 Yes (Admins Only)") : ("🔴 No (All Users)"));
      msg = `✏️ **Modify Keyboard Button**
━━━━━━━━━━━━━━━━━━━━
• **Text:** \`${pyStr(pySub(btn, "text"))}\`
• **Action:** \`${pyStr(pyGet(btn, "action"))}\`
• **Admin Only:** ${pyStr(adm_marker)}
• **Color:** ${pyStr(((pyGet(BUTTON_STYLE_DOT, (((__v60) => (pyT(__v60) ? __v60 : ("none")))(_kb_button_style(btn))), "⚪") + " ") + pyGet(BUTTON_STYLE_NAME, (((__v61) => (pyT(__v61) ? __v61 : ("none")))(_kb_button_style(btn))), "Default")))}
• **Position:** Row ${pyStr((r_idx + 1))}, Column ${pyStr((c_idx + 1))}

Choose what you want to edit:`;
      keyboard = [[InlineKeyboardButton("✏️ Edit Text", { callback_data: "adm_kb_edt_text" }), InlineKeyboardButton("🔗 Edit Action", { callback_data: "adm_kb_edt_action" })], [InlineKeyboardButton("↔️ Move Position", { callback_data: "adm_kb_edt_move" }), InlineKeyboardButton("👑 Toggle Admin-Only", { callback_data: "adm_kb_edt_adm" })], [InlineKeyboardButton("🎨 Edit Color", { callback_data: "adm_kb_edt_color" })], [InlineKeyboardButton("« Keyboard Settings", { callback_data: "adm_keyboard_settings" })]];
      void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(step, "custom_action")))) {
      pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx)["action"] = text;
      db.save_custom_keyboards(custom_kb);
      pyPop(context.user_data, "admin_edit_kb_step", null);
      void ((await update.message.reply_text("✅ Button action updated successfully!")));
      btn = pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx);
      adm_marker = (pyT(pyGet(btn, "admin_only")) ? ("🟢 Yes (Admins Only)") : ("🔴 No (All Users)"));
      msg = `✏️ **Modify Keyboard Button**
━━━━━━━━━━━━━━━━━━━━
• **Text:** \`${pyStr(pySub(btn, "text"))}\`
• **Action:** \`${pyStr(pyGet(btn, "action"))}\`
• **Admin Only:** ${pyStr(adm_marker)}
• **Color:** ${pyStr(((pyGet(BUTTON_STYLE_DOT, (((__v62) => (pyT(__v62) ? __v62 : ("none")))(_kb_button_style(btn))), "⚪") + " ") + pyGet(BUTTON_STYLE_NAME, (((__v63) => (pyT(__v63) ? __v63 : ("none")))(_kb_button_style(btn))), "Default")))}
• **Position:** Row ${pyStr((r_idx + 1))}, Column ${pyStr((c_idx + 1))}

Choose what you want to edit:`;
      keyboard = [[InlineKeyboardButton("✏️ Edit Text", { callback_data: "adm_kb_edt_text" }), InlineKeyboardButton("🔗 Edit Action", { callback_data: "adm_kb_edt_action" })], [InlineKeyboardButton("↔️ Move Position", { callback_data: "adm_kb_edt_move" }), InlineKeyboardButton("👑 Toggle Admin-Only", { callback_data: "adm_kb_edt_adm" })], [InlineKeyboardButton("🎨 Edit Color", { callback_data: "adm_kb_edt_color" })], [InlineKeyboardButton("« Keyboard Settings", { callback_data: "adm_keyboard_settings" })]];
      void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

