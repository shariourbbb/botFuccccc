// flows.js — auto-transpiled from bot.py by py2js. Ported 1:1 from the Python source.
import { InlineKeyboardMarkup } from "./compat.js";
import { db } from "./db.js";
import { append_course_join_buttons, disp_name, format_order_id_display, get_notify_admins, is_admin, logger, main_menu_keyboard } from "./core.js";
import { pyAppend, pyContains, pyEnumerate, pyEq, pyFormatDt, pyGet, pyHtmlEscape, pyInt, pyIter, pyJoin, pyLStrip, pyLen, pyLower, pyMax, pyNow, pyPop, pySlice, pyStr, pyStrip, pySub, pySum, pyT, pyTimestamp, pyUpper } from "./helpers.js";
import { InlineKeyboardButton } from "./core.js";

export async function show_subcategories_message(update, category) {
  let _cap, _hdr, _hmf, _hmt, all_c, course, direct_courses, e;
  let is_bought, is_sub_active, keyboard, per_row, price_tag, row, show_inactive, status_tag;
  let sub, sub_path, subcats, tag, text, user_id;
  user_id = (pyT(update.effective_user) ? (update.effective_user.id) : (0));
  show_inactive = is_admin(user_id);
  subcats = db.get_subcategories(category, { include_inactive: show_inactive });
  keyboard = [];
  per_row = db.get_subcategory_row_size();
  row = [];
  for (const sub of pyIter(subcats)) {
      sub_path = `${pyStr(category)} > ${pyStr(sub)}`;
      is_sub_active = db.is_category_active(sub_path);
      tag = (pyT((((__v0) => (pyT(__v0) ? (show_inactive) : __v0))((!pyT(is_sub_active))))) ? (" [OFF 🔴]") : (""));
      pyAppend(row, InlineKeyboardButton(`${pyStr(sub)}${pyStr(tag)}`, { callback_data: `subcat_${pyStr(category)}_${pyStr(sub)}` }));
      if (pyT((pyEq(pyLen(row), per_row)))) {
            pyAppend(keyboard, row);
            row = [];
      }
  }
  if (pyT(row)) {
      pyAppend(keyboard, row);
  }
  direct_courses = db.get_courses_by_folder(category, { include_inactive: show_inactive });
  for (const course of pyIter(direct_courses)) {
      price_tag = (pyT(((pyGet(course, "price", 0) > 0))) ? (` ─ ৳${pyStr(pySub(course, "price"))}`) : (" 🆓"));
      is_bought = (pyT(db.is_purchased(user_id, pySub(course, "id"))) ? (" ✅") : (""));
      status_tag = (pyT((((__v1) => (pyT(__v1) ? (show_inactive) : __v1))((pyEq(pyGet(course, "status"), "inactive"))))) ? ("🔴 ") : (""));
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(status_tag)}${pyStr(pySub(course, "name"))}${pyStr(price_tag)}${pyStr(is_bought)}`, { callback_data: `course_${pyStr(pySub(course, "id"))}` })]);
  }
  if (pyT(db.is_view_all_courses_enabled())) {
      all_c = db.get_courses_by_filter({ category: category, include_inactive: show_inactive });
      pyAppend(keyboard, [InlineKeyboardButton(`🎓 View All ${pyStr(category)} Courses (${pyStr(pyLen(all_c))})`, { callback_data: `subcat_${pyStr(category)}_ALL` })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("« All Categories", { callback_data: "back_to_categories" })]);
  if (pyT((((__v2) => (pyT(__v2) ? (direct_courses) : __v2))(subcats)))) {
      text = `📂 **${pyStr(disp_name(category))} এর বিষয় ও কোর্সসমূহ:**
━━━━━━━━━━━━━━━━━━━━
আপনার প্রয়োজনীয় বিষয় বা কোর্স বেছে নিন:`;
  } else if (pyT(direct_courses)) {
      text = `📚 **${pyStr(disp_name(category))} এর কোর্সসমূহ:**
━━━━━━━━━━━━━━━━━━━━
যে কোর্সের তথ্য দেখতে চান সেটিতে ক্লিক করুন:`;
  } else {
      text = `📂 **${pyStr(disp_name(category))} এর বিষয় / সাব-ক্যাটাগরি:**
━━━━━━━━━━━━━━━━━━━━
আপনার প্রয়োজনীয় বিষয় বা প্রোগ্রাম বেছে নিন:`;
  }
  _hdr = db.get_folder_header(category);
  if (pyT(pyStrip((((__v3) => (pyT(__v3) ? __v3 : ("")))(pyGet(_hdr, "text")))))) {
      text = pyStrip(pySub(_hdr, "text"));
  }
  [_hmt, _hmf] = db.get_folder_header_media(category);
  if (pyT((((__v4) => (pyT(__v4) ? (_hmf) : __v4))((pyContains(["photo", "animation"], _hmt)))))) {
      _cap = (pyT(((pyLen(text) <= 1024))) ? (text) : ((pySlice(text, null, 1021, null) + "...")));
      try {
            if (pyT((pyEq(_hmt, "photo")))) {
                    void ((await update.message.reply_photo({ photo: _hmf, caption: _cap, parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
            } else {
                    void ((await update.message.reply_animation({ animation: _hmf, caption: _cap, parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
            }
            return;
      } catch (e) {
            logger.warning(`Folder header media failed: ${pyStr(e)}`);
      }
  }
  void ((await update.message.reply_text(text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

export async function _cleanup_coupon_prompt(update, context) {
  let chat_id, msg_id;
  try {
      msg_id = pyPop(context.user_data, "coupon_prompt_msg_id", null);
  } catch (__e) {
      msg_id = null;
  }
  if (pyT(msg_id)) {
      try {
            chat_id = (pyT(update.effective_chat) ? (update.effective_chat.id) : (null));
            if (pyT(chat_id)) {
                    void ((await context.bot.delete_message({ chat_id: chat_id, message_id: pyInt(msg_id) })));
            }
      } catch (__e) {
      }
  }
  try {
      void ((await update.message.delete()));
  } catch (__e) {
  }
}

export async function _cleanup_pay_prompt(update, context) {
  let chat_id, msg_id;
  try {
      msg_id = pyPop(context.user_data, "pay_prompt_msg_id", null);
  } catch (__e) {
      msg_id = null;
  }
  if (pyT(msg_id)) {
      try {
            chat_id = (pyT(update.effective_chat) ? (update.effective_chat.id) : (null));
            if (pyT(chat_id)) {
                    void ((await context.bot.delete_message({ chat_id: chat_id, message_id: pyInt(msg_id) })));
            }
      } catch (__e) {
      }
  }
  try {
      void ((await update.message.delete()));
  } catch (__e) {
  }
}

export async function _cleanup_withdraw_prompt(update, context) {
  let chat_id, ids, mid;
  try {
      ids = (((__v5) => (pyT(__v5) ? __v5 : ([])))(pyPop(context.user_data, "withdraw_prompt_ids", [])));
  } catch (__e) {
      ids = [];
  }
  try {
      chat_id = (pyT(update.effective_chat) ? (update.effective_chat.id) : (null));
  } catch (__e) {
      chat_id = null;
  }
  if (pyT(chat_id)) {
      for (const mid of pyIter(ids)) {
            try {
                    void ((await context.bot.delete_message({ chat_id: chat_id, message_id: pyInt(mid) })));
            } catch (__e) {
            }
      }
  }
  try {
      if (pyT(update.message)) {
            void ((await update.message.delete()));
      }
  } catch (__e) {
  }
}

export async function handle_coupon_input(update, context) {
  let _banner, _ebid, c_obj, cart_total, cid, clean_msg, coupon_eb, coupon_obj;
  let course, course_cat, course_id, course_image, course_name, course_price, courses_in_order, discount;
  let discount_eb, discount_val, eb, eb_cat, eb_name, eb_price, emoji, err_msg;
  let i, idx, item, items, items_list, k_err, keyboard, m_key;
  let message, message_eb, method, methods, msg, new_price, new_total, text;
  let user_id, valid, valid_eb;
  text = pyStrip(update.message.text);
  context.user_data["awaiting_coupon"] = false;
  user_id = update.effective_user.id;
  if (pyT((((__v6) => (pyT(__v6) ? __v6 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
      pyPop(context.user_data, "awaiting_coupon", null);
      pyPop(context.user_data, "coupon_course", null);
      pyPop(context.user_data, "applied_coupon", null);
      pyPop(context.user_data, "discounted_price", null);
      void ((await update.message.reply_text("✕ Coupon application cancelled.", { reply_markup: main_menu_keyboard(user_id) })));
      return;
  }
  course_id = pyGet(context.user_data, "coupon_course");
  if (pyT((pyEq(course_id, "cart")))) {
      items = db.get_cart(user_id);
      if (pyT((!pyT(items)))) {
            void ((await update.message.reply_text("❌ Your cart is empty.", { reply_markup: main_menu_keyboard(user_id) })));
            return;
      }
      courses_in_order = ((() => { const __acc = []; for (const i of pyIter(items)) { __acc.push(pySub(i, "id")); } return __acc; })());
      cart_total = pySum(((() => { const __acc = []; for (const item of pyIter(items)) { __acc.push(pyGet(item, "price", 0)); } return __acc; })()));
      context.user_data["checkout_type"] = "cart";
      context.user_data["checkout_courses"] = courses_in_order;
      context.user_data["checkout_course_name"] = pyJoin(", ", ((() => { const __acc = []; for (const i of pyIter(items)) { __acc.push(pySub(i, "name")); } return __acc; })()));
      context.user_data["checkout_total"] = cart_total;
      [valid, discount, message, coupon_obj] = db.validate_coupon_advanced(text, user_id, cart_total, "All", { course_ids: courses_in_order });
      if (pyT(valid)) {
            new_total = pyMax(0, (cart_total - discount));
            context.user_data["checkout_total"] = new_total;
            context.user_data["applied_coupon"] = pyUpper(text);
            context.user_data["checkout_type"] = "cart";
            context.user_data["checkout_courses"] = courses_in_order;
            context.user_data["checkout_course_name"] = pyJoin(", ", ((() => { const __acc = []; for (const i of pyIter(items)) { __acc.push(pySub(i, "name")); } return __acc; })()));
            if (pyT((pyEq(new_total, 0)))) {
                    courses_in_order = pyGet(context.user_data, "checkout_courses", []);
                    for (const cid of pyIter(courses_in_order)) {
                              db.add_purchase(user_id, cid);
                              c_obj = db.get_course(cid);
                              if (pyT((((__v7) => (pyT(__v7) ? (pyGet(c_obj, "access_link")) : __v7))(c_obj)))) {
                                          db.store_user_access_link(user_id, cid, pySub(c_obj, "access_link"));
                              }
                    }
                    db.use_coupon(pyUpper(text), user_id);
                    db.clear_cart(user_id);
                    pyPop(context.user_data, "discounted_price", null);
                    pyPop(context.user_data, "pay_method", null);
                    pyPop(context.user_data, "pay_amount", null);
                    pyPop(context.user_data, "checkout_course", null);
                    pyPop(context.user_data, "checkout_courses", null);
                    pyPop(context.user_data, "applied_coupon", null);
                    void ((await _cleanup_coupon_prompt(update, context)));
                    keyboard = [[InlineKeyboardButton("🎓 My Courses", { callback_data: "my_courses_nav" })]];
                    void ((await update.message.reply_text(`🎉 <b>কুপন দিয়ে কার্টের সকল কোর্স সফলভাবে ফ্রি এনরোল হয়েছে!</b>
━━━━━━━━━━━━━━━━━━━━

🏷️ <b>কুপন:</b> <code>${pyStr(pyUpper(text))}</code>
📦 <b>কার্ট আইটেম:</b> ${pyStr(pyLen(courses_in_order))}টি কোর্স
💰 <b>মোট মূল্য:</b> ৳${pyStr(cart_total)} → <b>ফ্রি!</b>

👇 ক্লাসে যুক্ত হতে এবং আপনার কোর্সগুলো দেখতে নিচের বাটনে চাপ দিন:`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
                    return;
            }
            methods = db.get_payment_methods({ active_only: true });
            keyboard = [];
            for (const method of pyIter(methods)) {
                    m_key = pyLower(pySub(method, "key"));
                    emoji = (pyT((pyContains(m_key, "bkash"))) ? ("💗") : ((pyT((pyContains(m_key, "nagad"))) ? ("🟠") : ((pyT((pyContains(m_key, "rocket"))) ? ("🟣") : ("💳"))))));
                    pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(emoji)} ${pyStr(pySub(method, "name"))}`, { callback_data: `pay_${pyStr(pySub(method, "key"))}` })]);
            }
            pyAppend(keyboard, [InlineKeyboardButton("◀️ Back to Cart", { callback_data: "view_cart" })]);
            items = db.get_cart(user_id);
            items_list = pyJoin("\n", ((() => { const __acc = []; for (const [idx, i] of pyIter(pyEnumerate(items, 1))) { __acc.push(`${pyStr(idx)}. <b>${pyStr(pyHtmlEscape(pySub(i, "name")))}</b> — ৳${pyStr(pySub(i, "price"))}`); } return __acc; })()));
            discount_val = (cart_total - new_total);
            msg = `💳 <b>Select payment method:</b>

📦 <b>Cart Items (${pyStr(pyLen(items))}):</b>
${pyStr(items_list)}

💰 <b>Price:</b> ৳${pyStr(cart_total)}
🎟 <b>Coupon Discount:</b> -৳${pyStr(discount_val)}
✅ <b>Total:</b> ৳${pyStr(new_total)}`;
            void ((await _cleanup_coupon_prompt(update, context)));
            if (pyT((pyEq(pyLen(items), 1)))) {
                    _banner = pyGet(pySub(items, 0), "image");
                    if (pyT(_banner)) {
                              void ((await update.message.reply_photo({ photo: _banner, caption: msg, parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
                              return;
                    }
            }
      }
      if (pyT(valid)) {
            void ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
            return;
      }
      pyPop(context.user_data, "applied_coupon", null);
      pyPop(context.user_data, "discounted_price", null);
      context.user_data["checkout_total"] = cart_total;
      methods = db.get_payment_methods({ active_only: true });
      keyboard = [];
      for (const method of pyIter(methods)) {
              m_key = pyLower(pySub(method, "key"));
              emoji = (pyT((pyContains(m_key, "bkash"))) ? ("💗") : ((pyT((pyContains(m_key, "nagad"))) ? ("🟠") : ((pyT((pyContains(m_key, "rocket"))) ? ("🟣") : ("💳"))))));
              pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(emoji)} ${pyStr(pySub(method, "name"))}`, { callback_data: `pay_${pyStr(pySub(method, "key"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Back to Cart", { callback_data: "view_cart" })]);
      items = db.get_cart(user_id);
      items_list = pyJoin("\n", ((() => { const __acc = []; for (const [idx, i] of pyIter(pyEnumerate(items, 1))) { __acc.push(`${pyStr(idx)}. <b>${pyStr(pyHtmlEscape(pySub(i, "name")))}</b> — ৳${pyStr(pySub(i, "price"))}`); } return __acc; })()));
      msg = `💳 <b>Select payment method:</b>

📦 <b>Cart Items (${pyStr(pyLen(items))}):</b>
${pyStr(items_list)}

💰 <b>Price:</b> ৳${pyStr(cart_total)}
✅ <b>Total:</b> ৳${pyStr(cart_total)}`;
      void ((await _cleanup_coupon_prompt(update, context)));
      if (pyT((pyEq(pyLen(items), 1)))) {
              _banner = pyGet(pySub(items, 0), "image");
              if (pyT(_banner)) {
                      void ((await update.message.reply_photo({ photo: _banner, caption: msg, parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
                      return;
              }
      }
      void ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  course = (pyT(course_id) ? (db.get_course(course_id)) : (null));
  if (pyT((!pyT(course)))) {
      cid = (((__v8) => (pyT(__v8) ? __v8 : (pyGet(context.user_data, "checkout_course"))))(pyGet(context.user_data, "current_course")));
      course = (pyT(cid) ? (db.get_course(cid)) : (null));
      if (pyT(course)) {
            course_id = pyStr(pyGet(course, "id", cid));
      }
  }
  eb = null;
  if (pyT((!pyT(course)))) {
      _ebid = (((__v10) => (pyT(__v10) ? __v10 : (((__v9) => (pyT(__v9) ? __v9 : (pyGet(context.user_data, "checkout_course"))))(pyGet(context.user_data, "current_course")))))(course_id));
      eb = (pyT(_ebid) ? (db.get_ebook(_ebid)) : (null));
      if (pyT(eb)) {
            course_id = _ebid;
      }
  }
  course_price = (pyT(course) ? (pyGet(course, "price", 0)) : (0));
  course_cat = (pyT(course) ? (pyGet(course, "category", "")) : (""));
  course_name = (pyT(course) ? (pyGet(course, "name", "Course")) : ("Course"));
  [valid, discount, message, coupon_obj] = db.validate_coupon_advanced(text, user_id, course_price, course_cat, { course_id: course_id });
  if (pyT((((__v11) => (pyT(__v11) ? (course) : __v11))(valid)))) {
      new_price = pyMax(0, (course_price - discount));
      context.user_data["discounted_price"] = new_price;
      context.user_data["applied_coupon"] = pyUpper(text);
      context.user_data["checkout_type"] = "single";
      context.user_data["checkout_course"] = course_id;
      context.user_data["checkout_course_name"] = course_name;
      context.user_data["checkout_total"] = new_price;
      if (pyT((pyEq(new_price, 0)))) {
            db.add_purchase(user_id, course_id);
            db.use_coupon(pyUpper(text), user_id);
            keyboard = [];
            void ((await append_course_join_buttons(keyboard, context.bot, course, user_id, { query: null, force_new: true, prefix: "🔗 ", single_text: `${pyStr(pySub(course, "name"))}` })));
            pyAppend(keyboard, [InlineKeyboardButton("🎓 My Courses", { callback_data: "my_courses_nav" })]);
            void ((await _cleanup_coupon_prompt(update, context)));
            void ((await update.message.reply_text(`🎉 <b>কুপন দিয়ে ফ্রি কোর্স সফল হয়েছে!</b>

🏷️ <b>কুপন:</b> <code>${pyStr(pyUpper(text))}</code>
📘 <b>কোর্স:</b> ${pyStr(pySub(course, "name"))}
💰 <b>মূল্য:</b> ৳${pyStr(course_price)} → <b>ফ্রি!</b>

👇 ক্লাসে যুক্ত হতে নিচের বাটনে চাপ দিন:`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
            return;
      }
      context.user_data["checkout_type"] = "single";
      context.user_data["checkout_course"] = course_id;
      context.user_data["checkout_course_name"] = pySub(course, "name");
      context.user_data["checkout_total"] = new_price;
      methods = db.get_payment_methods({ active_only: true });
      keyboard = [];
      for (const method of pyIter(methods)) {
            m_key = pyLower(pySub(method, "key"));
            emoji = (pyT((pyContains(m_key, "bkash"))) ? ("💗") : ((pyT((pyContains(m_key, "nagad"))) ? ("🟠") : ((pyT((pyContains(m_key, "rocket"))) ? ("🟣") : ("💳"))))));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(emoji)} ${pyStr(pySub(method, "name"))}`, { callback_data: `pay_${pyStr(pySub(method, "key"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: "cancel_buy" })]);
      discount_val = (course_price - new_price);
      msg = `💳 <b>Select payment method:</b>

📘 <b>Course:</b> ${pyStr(pySub(course, "name"))}
💰 <b>Price:</b> ৳${pyStr(course_price)}
🎟 <b>Coupon Discount:</b> -৳${pyStr(discount_val)}
✅ <b>Total:</b> ৳${pyStr(new_price)}`;
      course_image = pyGet(course, "image");
      void ((await _cleanup_coupon_prompt(update, context)));
      void ((pyT(course_image) ? ((await update.message.reply_photo({ photo: course_image, caption: msg, parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) }))) : ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })))));
      return;
  }
  if (pyT(eb)) {
      eb_price = pyGet(eb, "price", 0);
      eb_cat = pyGet(eb, "category", "");
      eb_name = pyGet(eb, "name", "E-Book");
      [valid_eb, discount_eb, message_eb, coupon_eb] = db.validate_coupon_advanced(text, user_id, eb_price, eb_cat, { course_id: course_id });
      if (pyT(valid_eb)) {
            new_price = pyMax(0, (eb_price - discount_eb));
            context.user_data["discounted_price"] = new_price;
            context.user_data["applied_coupon"] = pyUpper(text);
            context.user_data["checkout_type"] = "ebook";
            context.user_data["checkout_course"] = course_id;
            context.user_data["checkout_courses"] = [course_id];
            context.user_data["checkout_course_name"] = eb_name;
            context.user_data["checkout_total"] = new_price;
            if (pyT((pyEq(new_price, 0)))) {
                    db.add_ebook_purchase(user_id, course_id);
                    db.use_coupon(pyUpper(text), user_id);
                    keyboard = [[InlineKeyboardButton("📚 My E-Books", { callback_data: "my_ebooks_nav" })]];
                    void ((await _cleanup_coupon_prompt(update, context)));
                    void ((await update.message.reply_text(`🎉 <b>কুপন দিয়ে ফ্রি ই-বুক সফল হয়েছে!</b>

🏷️ <b>কুপন:</b> <code>${pyStr(pyUpper(text))}</code>
📘 <b>ই-বুক:</b> ${pyStr(eb_name)}
💰 <b>মূল্য:</b> ৳${pyStr(eb_price)} → <b>ফ্রি!</b>

👇 নিচের বাটনে চাপ দিন:`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
                    return;
            }
            methods = db.get_payment_methods({ active_only: true });
            keyboard = [];
            for (const method of pyIter(methods)) {
                    m_key = pyLower(pySub(method, "key"));
                    emoji = (pyT((pyContains(m_key, "bkash"))) ? ("💗") : ((pyT((pyContains(m_key, "nagad"))) ? ("🟠") : ((pyT((pyContains(m_key, "rocket"))) ? ("🟣") : ("💳"))))));
                    pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(emoji)} ${pyStr(pySub(method, "name"))}`, { callback_data: `pay_${pyStr(pySub(method, "key"))}` })]);
            }
            pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: "cancel_buy" })]);
            discount_val = (eb_price - new_price);
            msg = `💳 <b>Select payment method:</b>

📘 <b>E-Book:</b> ${pyStr(eb_name)}
💰 <b>Price:</b> ৳${pyStr(eb_price)}
🎟 <b>Coupon Discount:</b> -৳${pyStr(discount_val)}
✅ <b>Total:</b> ৳${pyStr(new_price)}`;
            void ((await _cleanup_coupon_prompt(update, context)));
            if (pyT(pyGet(eb, "image"))) {
                    void ((await update.message.reply_photo({ photo: pySub(eb, "image"), caption: msg, parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
            } else {
                    void ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
            }
            return;
      }
      pyPop(context.user_data, "applied_coupon", null);
      pyPop(context.user_data, "discounted_price", null);
      context.user_data["checkout_type"] = "ebook";
      context.user_data["checkout_course"] = course_id;
      context.user_data["checkout_courses"] = [course_id];
      context.user_data["checkout_course_name"] = eb_name;
      context.user_data["checkout_total"] = eb_price;
      methods = db.get_payment_methods({ active_only: true });
      keyboard = [];
      for (const method of pyIter(methods)) {
              m_key = pyLower(pySub(method, "key"));
              emoji = (pyT((pyContains(m_key, "bkash"))) ? ("💗") : ((pyT((pyContains(m_key, "nagad"))) ? ("🟠") : ((pyT((pyContains(m_key, "rocket"))) ? ("🟣") : ("💳"))))));
              pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(emoji)} ${pyStr(pySub(method, "name"))}`, { callback_data: `pay_${pyStr(pySub(method, "key"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: "cancel_buy" })]);
      msg = `💳 <b>Select payment method:</b>

📘 <b>E-Book:</b> ${pyStr(eb_name)}
💰 <b>Price:</b> ৳${pyStr(eb_price)}
✅ <b>Total:</b> ৳${pyStr(eb_price)}`;
      void ((await _cleanup_coupon_prompt(update, context)));
      if (pyT(pyGet(eb, "image"))) {
              void ((await update.message.reply_photo({ photo: pySub(eb, "image"), caption: msg, parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
              void ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
      return;
  }
  pyPop(context.user_data, "applied_coupon", null);
  pyPop(context.user_data, "discounted_price", null);
  if (pyT(course)) {
      context.user_data["checkout_type"] = "single";
      context.user_data["checkout_course"] = course_id;
      context.user_data["checkout_course_name"] = course_name;
      context.user_data["checkout_total"] = course_price;
      methods = db.get_payment_methods({ active_only: true });
      keyboard = [];
      for (const method of pyIter(methods)) {
              m_key = pyLower(pySub(method, "key"));
              emoji = (pyT((pyContains(m_key, "bkash"))) ? ("💗") : ((pyT((pyContains(m_key, "nagad"))) ? ("🟠") : ((pyT((pyContains(m_key, "rocket"))) ? ("🟣") : ("💳"))))));
              pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(emoji)} ${pyStr(pySub(method, "name"))}`, { callback_data: `pay_${pyStr(pySub(method, "key"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: "cancel_buy" })]);
      msg = `💳 <b>Select payment method:</b>

📘 <b>Course:</b> ${pyStr(pySub(course, "name"))}
💰 <b>Price:</b> ৳${pyStr(course_price)}
✅ <b>Total:</b> ৳${pyStr(course_price)}`;
      course_image = pyGet(course, "image");
      void ((await _cleanup_coupon_prompt(update, context)));
      void ((pyT(course_image) ? ((await update.message.reply_photo({ photo: course_image, caption: msg, parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) }))) : ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })))));
      return;
  }
  clean_msg = pyStrip(pyLStrip(message, "❌ "));
  err_msg = `❌ Invalid coupon for \`${pyStr(course_name)}\`: ${pyStr(clean_msg)}`;
  k_err = [[InlineKeyboardButton("🔄 Try Again", { callback_data: `coupon_${pyStr(course_id)}` })], [InlineKeyboardButton("⏭️ Skip (No Coupon)", { callback_data: `skipcoupon_${pyStr(course_id)}` })], [InlineKeyboardButton("◀️ Back", { callback_data: `course_${pyStr(course_id)}` })]];
  void ((await _cleanup_coupon_prompt(update, context)));
  void ((await update.message.reply_text(err_msg, { reply_markup: InlineKeyboardMarkup(k_err) })));
}

export async function handle_withdraw_input(update, context) {
  let account_number, admin_wdr_keyboard, admin_wdr_msg, admin_wdr_msg_ids, aid, amount, balance, chat_id;
  let deducted, e, keyboard, m, method, methods, row, sent;
  let step, str, text, user_data, user_id, w_data, withdraw_id;
  text = pyStrip(update.message.text);
  user_id = update.effective_user.id;
  step = pyGet(context.user_data, "withdraw_step");
  if (pyT((pyEq(text, "/cancel")))) {
      pyPop(context.user_data, "withdraw_step", null);
      pyPop(context.user_data, "withdraw_amount", null);
      pyPop(context.user_data, "withdraw_method", null);
      void ((await _cleanup_withdraw_prompt(update, context)));
      try {
            chat_id = (pyT(update.effective_chat) ? (update.effective_chat.id) : (user_id));
            void ((await context.bot.send_message(chat_id, "✕ উইথড্রয়াল প্রক্রিয়া বাতিল করা হয়েছে।", { reply_markup: main_menu_keyboard(user_id) })));
      } catch (__e) {
      }
      return;
  }
  if (pyT((pyEq(step, "amount")))) {
      user_data = (((__v12) => (pyT(__v12) ? __v12 : ({  })))(db.get_user(user_id)));
      balance = pyGet(user_data, "balance", 0);
      try {
            amount = pyInt(text);
      } catch (__e) {
            void ((await update.message.reply_text("⚠️ অনুগ্রহ করে সঠিক পূর্ণসংখ্যা লিখুন (যেমন: 100):")));
            return;
      }
      if (pyT(((amount < db.get_min_withdraw_amount())))) {
            void ((await update.message.reply_text(`⚠️ সর্বনিম্ন উত্তোলনযোগ্য পরিমাণ \`${pyStr(db.get_min_withdraw_amount())}\` ৳! পুনরায় লিখুন:`)));
            return;
      }
      if (pyT(((amount > balance)))) {
            void ((await update.message.reply_text(`⚠️ আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই! বর্তমান ব্যালেন্স: \`${pyStr(balance)}\` ৳। পুনরায় লিখুন:`)));
            return;
      }
      context.user_data["withdraw_amount"] = amount;
      context.user_data["withdraw_step"] = "method_select";
      methods = db.get_payment_methods({ active_only: true });
      keyboard = [];
      row = [];
      for (const m of pyIter(methods)) {
            pyAppend(row, InlineKeyboardButton(`💳 ${pyStr(pySub(m, "name"))}`, { callback_data: `wdrpay_${pyStr(pySub(m, "key"))}` }));
            if (pyT((pyEq(pyLen(row), 2)))) {
                    pyAppend(keyboard, row);
                    row = [];
            }
      }
      if (pyT(row)) {
            pyAppend(keyboard, row);
      }
      if (pyT(db.is_home_button_enabled())) {
            pyAppend(keyboard, [InlineKeyboardButton("✕ বাতিল", { callback_data: "back_to_main_menu" })]);
      }
      void ((await _cleanup_withdraw_prompt(update, context)));
      try {
            chat_id = (pyT(update.effective_chat) ? (update.effective_chat.id) : (user_id));
            sent = (await context.bot.send_message(chat_id, `💰 <b>Withdrawable Amount:</b> <code>${pyStr(amount)}</code> ৳

👇 <b>Choose the method to receive your payment:</b>`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) }));
            context.user_data["withdraw_prompt_ids"] = [sent.message_id];
      } catch (__e) {
      }
  } else if (pyT((pyEq(step, "account")))) {
      account_number = text;
      amount = pyGet(context.user_data, "withdraw_amount", 0);
      method = pyGet(context.user_data, "withdraw_method", "bKash");
      deducted = db.deduct_balance(user_id, amount);
      if (pyT((!pyT(deducted)))) {
            pyPop(context.user_data, "withdraw_step", null);
            void ((await update.message.reply_text("✕ দুঃখিত, আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!", { reply_markup: main_menu_keyboard(user_id) })));
            return;
      }
      withdraw_id = `WDR-${pyStr(user_id)}-${pyStr(pyInt(pyTimestamp(pyNow())))}`;
      w_data = { user_id: user_id, username: (((__v13) => (pyT(__v13) ? __v13 : ("")))(update.effective_user.username)), full_name: (((__v14) => (pyT(__v14) ? __v14 : ("")))(update.effective_user.full_name)), amount: amount, method: method, account: account_number, status: "pending", date: pyStr(pyNow()) };
      db.add_withdrawal(withdraw_id, w_data);
      pyPop(context.user_data, "withdraw_step", null);
      pyPop(context.user_data, "withdraw_amount", null);
      pyPop(context.user_data, "withdraw_method", null);
      void ((await _cleanup_withdraw_prompt(update, context)));
      try {
            chat_id = (pyT(update.effective_chat) ? (update.effective_chat.id) : (user_id));
            void ((await context.bot.send_message(chat_id, `✅ <b>Withdrawal request submitted successfully!</b>
━━━━━━━━━━━━━━━━━━━━

🆔 <b>Withdraw ID:</b> <code>${pyStr(withdraw_id)}</code>
💰 <b>Amount:</b> ${pyStr(amount)} ৳
💳 <b>Method:</b> ${pyStr(method)}
📱 <b>Number:</b> <code>${pyStr(account_number)}</code>
📌 <b>Status:</b> 🟡 Pending

Admin will send your payment and approve the request soon.`, { parse_mode: "HTML", reply_markup: main_menu_keyboard(user_id) })));
      } catch (__e) {
      }
      admin_wdr_msg = `🔔 **New Withdrawal Request!**
━━━━━━━━━━━━━━━━━━━━

🆔 **Withdraw ID:** \`${pyStr(withdraw_id)}\`
👤 **User:** ${pyStr(update.effective_user.full_name)} (@${pyStr((((__v15) => (pyT(__v15) ? __v15 : ("N/A")))(update.effective_user.username)))})
🆔 **User ID:** \`${pyStr(user_id)}\`
💰 **Amount:** ${pyStr(amount)} ৳
💳 **Method:** ${pyStr(method)}
📱 **Account:** \`${pyStr(account_number)}\`
📅 **Time:** ${pyStr(pyFormatDt(pyNow(), "%Y-%m-%d %I:%M %p"))}`;
      admin_wdr_keyboard = [[InlineKeyboardButton("✅ Approve", { callback_data: `apprwdr_${pyStr(withdraw_id)}` }), InlineKeyboardButton("✕ Reject & Refund", { callback_data: `rejwdr_${pyStr(withdraw_id)}` })]];
      admin_wdr_msg_ids = {  };
      for (const aid of pyIter(get_notify_admins("payment_settings"))) {
            try {
                    sent = (await context.bot.send_message(aid, admin_wdr_msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(admin_wdr_keyboard) }));
                    try {
                              admin_wdr_msg_ids[pyStr(aid)] = sent.message_id;
                    } catch (__e) {
                    }
            } catch (e) {
                    logger.error(`অ্যাডমিন ${pyStr(aid)} কে উইথড্র নোটিশ পাঠাতে ত্রুটি: ${pyStr(e)}`);
            }
      }
      if (pyT(admin_wdr_msg_ids)) {
            try {
                    db.update_withdrawal(withdraw_id, { admin_msg_ids: admin_wdr_msg_ids });
            } catch (__e) {
            }
      }
  }
}

export async function handle_trxid_input(update, context) {
  let _wu_refund, admin_keyboard, admin_msg, admin_msg_ids, admin_wallet_line, aid, applied_coupon, checkout_type;
  let course_id, course_label, course_name, courses_in_order, e, method, order_data, order_id;
  let sent, status_msg, str, text, total, trxid, user_id, wallet_line;
  let wallet_used;
  text = pyStrip(update.message.text);
  context.user_data["awaiting_trxid"] = false;
  user_id = update.effective_user.id;
  if (pyT((((__v17) => (pyT(__v17) ? __v17 : (((__v16) => (pyT(__v16) ? __v16 : ((pyEq(text, "✕ Cancel")))))((pyEq(text, "❌ Cancel"))))))((pyEq(text, "/cancel")))))) {
      pyPop(context.user_data, "pay_method", null);
      pyPop(context.user_data, "pay_amount", null);
      _wu_refund = pyPop(context.user_data, "wallet_used", 0);
      if (pyT(_wu_refund)) {
            db.refund_balance(user_id, _wu_refund);
      }
      void ((await _cleanup_pay_prompt(update, context)));
      void ((await update.message.reply_text(("✕ পেমেন্ট বাতিল করা হয়েছে।" + (pyT(_wu_refund) ? (` ৳${pyStr(_wu_refund)} wallet-এ refund হয়েছে!`) : (""))), { reply_markup: main_menu_keyboard(user_id) })));
      return;
  }
  trxid = pyUpper(text);
  method = pyGet(context.user_data, "pay_method", "Manual");
  total = pyGet(context.user_data, "pay_amount", 0);
  checkout_type = pyGet(context.user_data, "checkout_type", "single");
  applied_coupon = pyGet(context.user_data, "applied_coupon", "");
  wallet_used = pyGet(context.user_data, "wallet_used", 0);
  order_id = db.generate_next_order_id();
  course_name = pyGet(context.user_data, "checkout_course_name", "Course");
  course_id = pyGet(context.user_data, "checkout_course", "");
  courses_in_order = pyGet(context.user_data, "checkout_courses", (pyT(course_id) ? ([course_id]) : ([])));
  if (pyT((((__v19) => (pyT(__v19) ? ((((__v18) => (pyT(__v18) ? __v18 : ((!pyT(db.get_ebook(course_id))))))((!pyT(course_id))))) : __v19))((pyEq(checkout_type, "ebook")))))) {
      _wu_refund = pyPop(context.user_data, "wallet_used", 0);
      if (pyT(_wu_refund)) {
            db.refund_balance(user_id, _wu_refund);
      }
      void ((await _cleanup_pay_prompt(update, context)));
      void ((await update.message.reply_text(("❌ Session expired! ই-বুক তথ্য পাওয়া যায়নি — আবার ই-বুক সিলেক্ট করে পেমেন্ট করুন।" + (pyT(_wu_refund) ? (` ৳${pyStr(_wu_refund)} wallet-এ refund হয়েছে!`) : (""))), { reply_markup: main_menu_keyboard(user_id) })));
      return;
  }
  order_data = { user_id: user_id, username: (((__v20) => (pyT(__v20) ? __v20 : ("")))(update.effective_user.username)), full_name: (((__v21) => (pyT(__v21) ? __v21 : ("")))(update.effective_user.full_name)), course_id: course_id, courses: courses_in_order, course_name: course_name, amount: total, payment_method: method, trxid: trxid, coupon_code: applied_coupon, wallet_used: wallet_used, status: "pending", date: pyStr(pyNow()), checkout_type: checkout_type };
  db.add_order(order_id, order_data);
  if (pyT(applied_coupon)) {
      db.use_coupon(applied_coupon, user_id);
  }
  if (pyT((pyEq(checkout_type, "cart")))) {
      db.clear_cart(user_id);
  }
  pyPop(context.user_data, "discounted_price", null);
  pyPop(context.user_data, "pay_method", null);
  pyPop(context.user_data, "pay_amount", null);
  pyPop(context.user_data, "checkout_course", null);
  pyPop(context.user_data, "checkout_courses", null);
  pyPop(context.user_data, "applied_coupon", null);
  pyPop(context.user_data, "wallet_used", null);
  void ((await _cleanup_pay_prompt(update, context)));
  wallet_line = (pyT(wallet_used) ? (`
💳 **Wallet Used:** -৳${pyStr(wallet_used)}`) : (""));
  course_label = (pyT((pyEq(checkout_type, "cart"))) ? ("Courses") : ("Course"));
  status_msg = (await update.message.reply_text(`✅ **Order Submitted Successfully!**
━━━━━━━━━━━━━━━━━━━━

📦 **Order ID:** \`${pyStr(format_order_id_display(order_id))}\`
📘 **${pyStr(course_label)}:** ${pyStr(course_name)}
💰 **Amount:** ${pyStr(total)} ৳${pyStr(wallet_line)}
💳 **Method:** ${pyStr(method)}
🔑 **TrxID:** \`${pyStr(trxid)}\`

📊 **Status:** ⏳ Pending`, { parse_mode: "Markdown", reply_markup: main_menu_keyboard(user_id) }));
  try {
      db.update_order(order_id, { status_msg_id: status_msg.message_id });
  } catch (__e) {
  }
  admin_wallet_line = (pyT(wallet_used) ? (`
💳 **Wallet Used:** \`-৳${pyStr(wallet_used)}\``) : (""));
  admin_msg = `🔔 **New Order Received!**
━━━━━━━━━━━━━━━━━━━━

📦 **Order ID:** \`${pyStr(format_order_id_display(order_id))}\`
👤 **Student:** ${pyStr(update.effective_user.full_name)} (@${pyStr((((__v22) => (pyT(__v22) ? __v22 : ("N/A")))(update.effective_user.username)))})
🆔 **User ID:** \`${pyStr(user_id)}\`
📖 **Course:** ${pyStr(course_name)}
💰 **Amount:** ${pyStr(total)} ৳${pyStr(admin_wallet_line)}
💳 **Method:** ${pyStr(method)}
🔑 **TrxID:** \`${pyStr(trxid)}\`
🏷️ **Coupon:** \`${pyStr((((__v23) => (pyT(__v23) ? __v23 : ("None")))(applied_coupon)))}\`
📅 **Time:** ${pyStr(pyFormatDt(pyNow(), "%Y-%m-%d %I:%M %p"))}`;
  admin_keyboard = [[InlineKeyboardButton("✅ Approve", { callback_data: `approve_${pyStr(order_id)}` }), InlineKeyboardButton("✕ Reject", { callback_data: `reject_${pyStr(order_id)}` })]];
  admin_msg_ids = {  };
  for (const aid of pyIter(get_notify_admins("orders"))) {
      try {
            sent = (await context.bot.send_message(aid, admin_msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(admin_keyboard) }));
            try {
                    admin_msg_ids[pyStr(aid)] = sent.message_id;
            } catch (__e) {
            }
      } catch (e) {
            logger.error(`অ্যাডমিন ${pyStr(aid)} কে মেসেজ পাঠাতে ত্রুটি: ${pyStr(e)}`);
      }
  }
  if (pyT(admin_msg_ids)) {
      try {
            db.update_order(order_id, { admin_msg_ids: admin_msg_ids });
      } catch (__e) {
      }
  }
}

