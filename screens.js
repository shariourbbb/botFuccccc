// screens.js — auto-transpiled from bot.py by py2js. Ported 1:1 from the Python source.
import { InlineKeyboardMarkup } from "./compat.js";
import { BOT_NAME, BOT_USERNAME, SUPPORT_USERNAME } from "./config.js";
import { db } from "./db.js";
import { cart_merge_unique, get_cart_empty_body, get_cart_header_parts, get_cart_media, get_fallback_template_text } from "./admin_panels.js";
import { _delete_bot_message, _edit_photo_smooth, _msg_has_media, append_course_join_buttons, disp_name, is_admin, logger, parse_inline_buttons, send_folder_screen, start } from "./core.js";
import { pyAll, pyAny, pyAppend, pyContains, pyDict, pyDiv, pyEnumerate, pyEq, pyExtend, pyGet, pyHasAttr, pyHtmlEscape, pyInt, pyIsInstance, pyItems, pyIter, pyJoin, pyLen, pyLower, pyMax, pyMin, pyMod, pyPartition, pyPop, pyQuotePlus, pyRStrip, pyRange, pyReCompile, pyRepeat, pyReplace, pySetDefault, pySlice, pySplit, pyStart, pyStr, pyStrip, pySub, pySum, pyT, pyUpper } from "./helpers.js";
import { InlineKeyboardButton } from "./core.js";

export async function show_categories(update, context) {
  let _cmf, _cmt, all_courses, cap, cat, categories, custom_cat_text, default_cat_text;
  let e, is_active, keyboard, markup, per_row, row, show_inactive, tag;
  let text, user_id;
  user_id = (pyT(update.effective_user) ? (update.effective_user.id) : (0));
  show_inactive = is_admin(user_id);
  categories = db.get_categories({ include_inactive: show_inactive });
  keyboard = [];
  try {
      _cmt = pyLower(pyStr((((__v0) => (pyT(__v0) ? __v0 : ("none")))(db.get_setting("category_library_media_type", "none")))));
      _cmf = (((__v1) => (pyT(__v1) ? __v1 : ("")))(db.get_setting("category_library_media_file_id", "")));
  } catch (__e) {
      [_cmt, _cmf] = ["none", ""];
  }
  if (pyT((((__v2) => (pyT(__v2) ? __v2 : ((!pyT(_cmf)))))(((!pyContains(["photo", "animation"], _cmt))))))) {
      _cmt = "none";
  }
  if (pyT((!pyT(categories)))) {
      text = "📂 **বর্তমানে কোনো ক্যাটাগরি উপলব্ধ নেই।**";
  } else {
      default_cat_text = "📂 **আপনার ব্যাচ/শ্রেণী নির্বাচন করুন:**";
      try {
            custom_cat_text = pyStrip((((__v3) => (pyT(__v3) ? __v3 : ("")))(db.get_setting("category_library_header_text", ""))));
      } catch (__e) {
            custom_cat_text = "";
      }
      text = (pyT(custom_cat_text) ? (custom_cat_text) : (default_cat_text));
      per_row = db.get_category_row_size();
      row = [];
      for (const cat of pyIter(categories)) {
            is_active = db.is_category_active(cat);
            tag = (pyT((((__v4) => (pyT(__v4) ? (show_inactive) : __v4))((!pyT(is_active))))) ? (" [OFF 🔴]") : (""));
            pyAppend(row, InlineKeyboardButton(`${pyStr(cat)}${pyStr(tag)}`, { callback_data: `cat_${pyStr(cat)}` }));
            if (pyT((pyEq(pyLen(row), per_row)))) {
                    pyAppend(keyboard, row);
                    row = [];
            }
      }
      if (pyT(row)) {
            pyAppend(keyboard, row);
      }
  }
  if (pyT(db.is_view_all_courses_enabled())) {
      all_courses = db.get_courses_by_filter({ include_inactive: show_inactive });
      if (pyT(all_courses)) {
            pyAppend(keyboard, [InlineKeyboardButton(`📚 Browse All Courses (${pyStr(pyLen(all_courses))})`, { callback_data: "cat_ALL" })]);
      }
  }
  if (pyT(db.is_home_button_enabled())) {
      pyAppend(keyboard, [InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" })]);
  }
  markup = InlineKeyboardMarkup(keyboard);
  if (pyT((((__v5) => (pyT(__v5) ? (categories) : __v5))(((!pyEq(_cmt, "none"))))))) {
      cap = (pyT(((pyLen(text) <= 1024))) ? (text) : ((pySlice(text, null, 1021, null) + "...")));
      try {
            if (pyT(update.callback_query)) {
                    try {
                              void ((await update.callback_query.message.delete()));
                    } catch (__e) {
                    }
                    if (pyT((pyEq(_cmt, "photo")))) {
                              void ((await update.callback_query.message.reply_photo({ photo: _cmf, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
                    } else {
                              void ((await update.callback_query.message.reply_animation({ animation: _cmf, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
                    }
            } else if (pyT((pyEq(_cmt, "photo")))) {
                    void ((await update.message.reply_photo({ photo: _cmf, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
            } else {
                    void ((await update.message.reply_animation({ animation: _cmf, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
            }
            return;
      } catch (e) {
            logger.warning(`Category library header media failed: ${pyStr(e)}`);
      }
  }
  if (pyT(update.callback_query)) {
      if (pyT(_msg_has_media(update.callback_query.message))) {
            try {
                    void ((await update.callback_query.message.delete()));
            } catch (__e) {
            }
            void ((await update.callback_query.message.reply_text(text, { parse_mode: "Markdown", reply_markup: markup })));
      } else {
            void ((await update.callback_query.edit_message_text(text, { parse_mode: "Markdown", reply_markup: markup })));
      }
  } else {
      void ((await update.message.reply_text(text, { parse_mode: "Markdown", reply_markup: markup })));
  }
}

export async function show_subcategories(query, category) {
  let all_courses, course, direct_courses, is_bought, is_sub_active, keyboard, per_row, price_tag;
  let row, show_inactive, status_tag, sub, sub_path, subcats, tag, text;
  let user_id;
  user_id = (pyT((((__v6) => (pyT(__v6) ? (query.from_user) : __v6))(pyHasAttr(query, "from_user")))) ? (query.from_user.id) : (0));
  show_inactive = is_admin(user_id);
  subcats = db.get_subcategories(category, { include_inactive: show_inactive });
  keyboard = [];
  per_row = db.get_subcategory_row_size();
  row = [];
  for (const sub of pyIter(subcats)) {
      sub_path = `${pyStr(category)} > ${pyStr(sub)}`;
      is_sub_active = db.is_category_active(sub_path);
      tag = (pyT((((__v7) => (pyT(__v7) ? (show_inactive) : __v7))((!pyT(is_sub_active))))) ? (" [OFF 🔴]") : (""));
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
      status_tag = (pyT((((__v8) => (pyT(__v8) ? (show_inactive) : __v8))((pyEq(pyGet(course, "status"), "inactive"))))) ? ("🔴 ") : (""));
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(status_tag)}${pyStr(pySub(course, "name"))}${pyStr(price_tag)}${pyStr(is_bought)}`, { callback_data: `course_${pyStr(pySub(course, "id"))}` })]);
  }
  if (pyT(db.is_view_all_courses_enabled())) {
      all_courses = db.get_courses_by_filter({ category: category, include_inactive: show_inactive });
      pyAppend(keyboard, [InlineKeyboardButton(`🎓 View All ${pyStr(category)} Courses (${pyStr(pyLen(all_courses))})`, { callback_data: `subcat_${pyStr(category)}_ALL` })]);
  }
  if (pyT(is_admin(user_id))) {
      pyAppend(keyboard, [InlineKeyboardButton(`➕ Add Course`, { callback_data: `adm_addcourse_cat_${pyStr(category)}` }), InlineKeyboardButton("📁 Manage Folder", { callback_data: `adm_dir_${pyStr(category)}` })]);
  }
  if (pyT((((__v9) => (pyT(__v9) ? (direct_courses) : __v9))(subcats)))) {
      text = `📂 **${pyStr(disp_name(category))} এর বিষয় ও কোর্সসমূহ:**`;
  } else if (pyT(direct_courses)) {
      text = `📚 **${pyStr(disp_name(category))} এর কোর্সসমূহ:**`;
  } else {
      text = `📂 **${pyStr(disp_name(category))} এর বিষয়/প্রোগ্রাম:**`;
  }
  void ((await send_folder_screen(query, text, InlineKeyboardMarkup(keyboard), category)));
}

export function safe_html_format(text) {
  let i, parts, valid_tags_regex;
  valid_tags_regex = pyReCompile("(</?(?:b|i|u|code|pre|blockquote|a)(?:\\s+href=\"[^\"]*\")?\\s*>)", "i");
  parts = pySplit(text, valid_tags_regex, -1);
  for (const i of pyIter(pyRange(pyLen(parts)))) {
      if (pyT((pyEq(pyMod(i, 2), 0)))) {
            parts[i] = pyHtmlEscape(pySub(parts, i));
      }
  }
  return (pyJoin("", parts));
}

export function format_course_card_html(name, price, description, discount) {
  if (discount === undefined) discount = (null);
  let desc_clean, desc_display, name_clean, p_val, price_str;
  name_clean = pyHtmlEscape(pyStrip(pyStr(name)));
  if (pyT(((!(discount === null || discount === undefined))))) {
      price_str = `<s>৳${pyStr(price)}</s> ➔ <b>৳${pyStr(discount)} BDT</b> 🔥 <i>(কুপন ডিসকাউন্ট প্রয়োগ করা হয়েছে!)</i>`;
  } else {
      try {
            p_val = pyInt(price);
            price_str = (pyT(((p_val > 0))) ? (`<b>৳${pyStr(p_val)} BDT</b>`) : ("<b>১০০% ফ্রি (Free Course) 🎁</b>"));
      } catch (__e) {
            price_str = `<b>৳${pyStr(price)} BDT</b>`;
      }
  }
  desc_clean = safe_html_format(pyStrip(pyStr(description)));
  if (pyT((!pyT(desc_clean)))) {
      desc_clean = "কোর্সের বিস্তারিত তথ্য শীঘ্রই যুক্ত করা হবে।";
  }
  desc_display = desc_clean;
  return (`<blockquote><b>${pyStr(name_clean)}</b></blockquote>

<blockquote>💰 <b>Price:</b> ${pyStr(price_str)}</blockquote>

${pyStr(desc_display)}`);
}

export async function send_rich_course_message(target, html_text, reply_markup, image_or_opts, is_edit) {
  let image;
  if (image_or_opts && typeof image_or_opts === "object" && image_or_opts.image !== undefined) {
    image = image_or_opts.image;
    if (is_edit === undefined) is_edit = image_or_opts.is_edit;
  } else {
    image = image_or_opts;
  }
  if (image === undefined) image = (null);
  if (is_edit === undefined) is_edit = (false);
  let e, is_callback;
  is_callback = pyHasAttr(target, "message");
  if (pyT(image)) {
      if (pyT(((pyLen(html_text) <= 1024)))) {
            if (pyT(is_callback)) {
                    if (pyT(_msg_has_media(target.message))) {
                              try {
                                          if (pyT((await _edit_photo_smooth(target, image, html_text, reply_markup, "HTML")))) {
                                                        return;
                                          }
                              } catch (__e) {
                              }
                    }
                    void ((await _delete_bot_message(target.message)));
                    try {
                              return ((await target.message.reply_photo({ photo: image, caption: html_text, parse_mode: "HTML", reply_markup: reply_markup })));
                    } catch (e) {
                              logger.warning(`Failed to reply_photo with caption: ${pyStr(e)}`);
                              return ((await target.message.reply_text(html_text, { parse_mode: "HTML", reply_markup: reply_markup })));
                    }
            } else {
                    try {
                              return ((await target.reply_photo({ photo: image, caption: html_text, parse_mode: "HTML", reply_markup: reply_markup })));
                    } catch (e) {
                              logger.warning(`Failed to reply_photo with caption: ${pyStr(e)}`);
                              return ((await target.reply_text(html_text, { parse_mode: "HTML", reply_markup: reply_markup })));
                    }
            }
      } else if (pyT(is_callback)) {
            void ((await _delete_bot_message(target.message)));
            try {
                    void ((await target.message.reply_photo({ photo: image })));
            } catch (__e) {
            }
            return ((await target.message.reply_text(html_text, { parse_mode: "HTML", reply_markup: reply_markup })));
      } else {
            try {
                    void ((await target.reply_photo({ photo: image })));
            } catch (__e) {
            }
            return ((await target.reply_text(html_text, { parse_mode: "HTML", reply_markup: reply_markup })));
      }
  } else if (pyT(is_callback)) {
      if (pyT((((__v10) => (pyT(__v10) ? ((!pyT(_msg_has_media(target.message)))) : __v10))(is_edit)))) {
            try {
                    return ((await target.edit_message_text(html_text, { parse_mode: "HTML", reply_markup: reply_markup })));
            } catch (__e) {
            }
      }
      void ((await _delete_bot_message(target.message)));
      return ((await target.message.reply_text(html_text, { parse_mode: "HTML", reply_markup: reply_markup })));
  } else {
      return ((await target.reply_text(html_text, { parse_mode: "HTML", reply_markup: reply_markup })));
  }
}

export async function send_course_details(target, context, course, user_id, is_edit) {
  if (is_edit === undefined) is_edit = (false);
  let buy_price, category, course_id, discount, image, in_cart, is_purchased, item;
  let keyboard, msg, price, reply_markup, share_url, subcategory;
  course_id = pySub(course, "id");
  is_purchased = db.is_purchased(user_id, course_id);
  in_cart = pyAny(((() => { const __acc = []; for (const item of pyIter(db.get_cart(user_id))) { __acc.push((pyEq(pySub(item, "id"), course_id))); } return __acc; })()));
  price = pyGet(course, "price", 0);
  discount = (pyT((pyEq(pyGet(context.user_data, "coupon_course"), course_id))) ? (pyGet(context.user_data, "discounted_price")) : (null));
  category = pyGet(course, "category", "HSC 28");
  subcategory = pyGet(course, "subcategory", pyGet(course, "program", "General"));
  msg = format_course_card_html(pyGet(course, "name", ""), price, pyGet(course, "description", ""), discount);
  keyboard = [];
  if (pyT(is_purchased)) {
      msg += "\n\n🎉 <b>আপনি ইতিমধ্যে এই কোর্সে এনরোল করেছেন!</b>";
      void ((await append_course_join_buttons(keyboard, context.bot, course, user_id, { query: (pyT(pyHasAttr(target, "answer")) ? (target) : (null)), prefix: "➥ ", single_text: "➥ Go to Course" })));
      share_url = `https://t.me/share/url?url=https://t.me/${pyStr(BOT_USERNAME)}?start=course_${pyStr(course_id)}&text=${pyStr(pyQuotePlus(pyGet(course, "name", "")))}`;
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: `cat_${pyStr(category)}` }), InlineKeyboardButton("📤 Share", { url: share_url })]);
  } else if (pyT((pyEq(price, 0)))) {
      pyAppend(keyboard, [InlineKeyboardButton("🎁 Free Enroll", { callback_data: `free_enroll_${pyStr(course_id)}` })]);
      share_url = `https://t.me/share/url?url=https://t.me/${pyStr(BOT_USERNAME)}?start=course_${pyStr(course_id)}&text=${pyStr(pyQuotePlus(pyGet(course, "name", "")))}`;
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: `cat_${pyStr(category)}` }), InlineKeyboardButton("📤 Share", { url: share_url })]);
  } else {
      if (pyT(in_cart)) {
            pyAppend(keyboard, [InlineKeyboardButton("🎟 Coupon", { callback_data: `coupon_${pyStr(course_id)}` }), InlineKeyboardButton("❌ Remove From Cart", { callback_data: `remcartc_${pyStr(course_id)}` })]);
      } else {
            pyAppend(keyboard, [InlineKeyboardButton("🎟 Coupon", { callback_data: `coupon_${pyStr(course_id)}` }), InlineKeyboardButton("🛒 Add to Cart", { callback_data: `addcart_${pyStr(course_id)}` })]);
      }
      buy_price = (pyT(((!(discount === null || discount === undefined)))) ? (discount) : (price));
      pyAppend(keyboard, [InlineKeyboardButton(`🛍 Buy Now — ৳${pyStr(buy_price)}`, { callback_data: `buy_${pyStr(course_id)}` })]);
      share_url = `https://t.me/share/url?url=https://t.me/${pyStr(BOT_USERNAME)}?start=course_${pyStr(course_id)}&text=${pyStr(pyQuotePlus(pyGet(course, "name", "")))}`;
      pyAppend(keyboard, [InlineKeyboardButton("◀️ Back", { callback_data: `cat_${pyStr(category)}` }), InlineKeyboardButton("📤 Share", { url: share_url })]);
  }
  reply_markup = InlineKeyboardMarkup(keyboard);
  image = pyGet(course, "image");
  void ((await send_rich_course_message(target, msg, reply_markup, { image: image, is_edit: is_edit })));
}

export async function send_admin_course_preview(target, context, new_course) {
  let _glines, _pv_groups, card_text, category, description, g, i, image;
  let keyboard, link, meta_info, name, preview_msg, price, reply_markup, subcategory;
  context.user_data["course_step"] = "preview";
  name = pyGet(new_course, "name", "Untitled Course");
  price = pyGet(new_course, "price", 0);
  description = pyGet(new_course, "description", "");
  category = pyGet(new_course, "category", "General");
  subcategory = pyGet(new_course, "subcategory", pyGet(new_course, "program", "General"));
  link = pyGet(new_course, "access_link", "");
  image = pyGet(new_course, "image", "");
  card_text = format_course_card_html(name, price, description);
  meta_info = `

📂 <b>Category:</b> ${pyStr(pyHtmlEscape(pyStr(category)))} | ${pyStr(pyHtmlEscape(pyStr(subcategory)))}`;
  if (pyT(link)) {
      meta_info += `
🔗 <b>Access Link:</b> ${pyStr(pyHtmlEscape(pyStr(link)))}`;
  } else {
      meta_info += "\n🔗 <b>Access Link:</b> <i>দেওয়া হয়নি</i>";
  }
  if (pyT(pyGet(new_course, "group_id"))) {
      meta_info += `
👥 <b>Group ID:</b> <code>${pyStr(pyHtmlEscape(pyStr(pySub(new_course, "group_id"))))}</code>`;
  } else {
      meta_info += "\n👥 <b>Group ID:</b> <i>দেওয়া হয়নি</i>";
  }
  _pv_groups = (((__v11) => (pyT(__v11) ? __v11 : ([])))(pyGet(new_course, "group_ids")));
  if (pyT(((pyLen(_pv_groups) > 1)))) {
      _glines = pyJoin("\n", ((() => { const __acc = []; for (const [i, g] of pyIter(pyEnumerate(_pv_groups, 1))) { __acc.push(`   ${pyStr(i)}. ${pyStr(pyHtmlEscape(pyStr(pyGet(g, "label", ""))))} — <code>${pyStr(pyHtmlEscape(pyStr(pyGet(g, "id", ""))))}</code>`); } return __acc; })()));
      meta_info += `
👥 <b>Groups (${pyStr(pyLen(_pv_groups))}):</b>
${pyStr(_glines)}`;
  }
  preview_msg = `✨ <b>[ Course Preview / প্রিভিউ ]</b>
━━━━━━━━━━━━━━━━━━━━
${pyStr(card_text)}${pyStr(meta_info)}`;
  keyboard = [[InlineKeyboardButton("✅ Publish Course", { callback_data: "adm_pub_course" })], [InlineKeyboardButton("🖼️ Add / Change Photo", { callback_data: "adm_chg_img" }), InlineKeyboardButton("📂 Change Category", { callback_data: "adm_chg_cat" })], [InlineKeyboardButton("✏️ Edit Details", { callback_data: "adm_chg_fields" }), InlineKeyboardButton("❌ Cancel (বাতিল)", { callback_data: "adm_cancel_course" })]];
  reply_markup = InlineKeyboardMarkup(keyboard);
  void ((await send_rich_course_message(target, preview_msg, reply_markup, { image: image, is_edit: false })));
}

export function parse_group_id_input(text, n) {
  let _, gid, label, left, right, sep, t;
  t = pyStrip((((__v12) => (pyT(__v12) ? __v12 : ("")))(text)));
  if (pyT((!pyT(t)))) {
      return ([null, null]);
  }
  [label, gid] = [null, t];
  for (const sep of pyIter(["=", ":"])) {
      if (pyT((pyContains(t, sep)))) {
            [left, _, right] = pyPartition(t, sep);
            if (pyT(pyStrip(right))) {
                    [label, gid] = [pyStrip(left), pyStrip(right)];
                    break;
            }
      }
  }
  gid = pyStrip(gid);
  if (pyT((((__v13) => (pyT(__v13) ? __v13 : ((pyContains(gid, " ")))))((!pyT(gid)))))) {
      return ([null, null]);
  }
  if (pyT((!pyT(label)))) {
      label = `Group ${pyStr(n)}`;
  }
  return ([pySlice(label, null, 40, null), gid]);
}

export async function send_admin_group_id_prompt(target, context) {
  let added, added_block, added_lines, g, i, keyboard, prompt, wiz;
  context.user_data["course_step"] = "group_id";
  wiz = pySetDefault(context.user_data, "new_course", {  });
  pySetDefault(wiz, "group_ids", []);
  added = (((__v14) => (pyT(__v14) ? __v14 : ([])))(pyGet(wiz, "group_ids")));
  added_lines = pyJoin("\n", ((() => { const __acc = []; for (const [i, g] of pyIter(pyEnumerate(added, 1))) { __acc.push(`${pyStr(i)}. ${pyStr(pyGet(g, "label"))} — \`${pyStr(pyGet(g, "id"))}\``); } return __acc; })()));
  added_block = (pyT(added) ? (`

✅ **Added (${pyStr(pyLen(added))}):**
${pyStr(added_lines)}`) : (""));
  prompt = `👥 **Telegram Group / Channel IDs (একাধিক দেওয়া যাবে):**
━━━━━━━━━━━━━━━━━━━━
Private group/channel-এর ID একটা করে পাঠান।
EX: \`-1001234567890\`
Label সহ: \`Cycle 1 = -1001234567890\`
${pyStr(added_block)}

👉 সব ID দেওয়া শেষ হলে **✅ Done** চাপুন (1 কোর্সে 6টা/20টা ID দেওয়া যাবে)।

💡 প্রতিটি student-এর জন্য প্রতিটা group-এর আলাদা 1-জনের unique invite link তৈরি হবে।`;
  keyboard = InlineKeyboardMarkup([[InlineKeyboardButton(`✅ Done (${pyStr(pyLen(added))} added)`, { callback_data: "adm_group_done" })], [InlineKeyboardButton("⏭️ Skip Group ID", { callback_data: "adm_skip_group" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_course" })]]);
  if (pyT(pyHasAttr(target, "message"))) {
      if (pyT(_msg_has_media(target.message))) {
            try {
                    void ((await target.message.delete()));
            } catch (__e) {
            }
            void ((await target.message.reply_text(prompt, { parse_mode: "Markdown", reply_markup: keyboard })));
      } else {
            void ((await target.edit_message_text(prompt, { parse_mode: "Markdown", reply_markup: keyboard })));
      }
  } else {
      void ((await target.reply_text(prompt, { parse_mode: "Markdown", reply_markup: keyboard })));
  }
}

export async function send_admin_category_selector(target, context, title_prefix) {
  if (title_prefix === undefined) title_prefix = ("📂 **ধাপ ৪/৬: ক্যাটাগরি নির্বাচন করুন:**");
  let cat, cats, keyboard, msg, per_row, reply_markup, row;
  cats = db.get_categories();
  keyboard = [];
  per_row = db.get_category_row_size();
  row = [];
  for (const cat of pyIter(cats)) {
      pyAppend(row, InlineKeyboardButton(`◈ ${pyStr(cat)}`, { callback_data: `adm_setcat_${pyStr(cat)}` }));
      if (pyT((pyEq(pyLen(row), per_row)))) {
            pyAppend(keyboard, row);
            row = [];
      }
  }
  if (pyT(row)) {
      pyAppend(keyboard, row);
  }
  pyAppend(keyboard, [InlineKeyboardButton("➕ Custom / New Category", { callback_data: "adm_setcat_CUSTOM" })]);
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]);
  reply_markup = InlineKeyboardMarkup(keyboard);
  msg = `${pyStr(title_prefix)}

👇 নিচের তালিকা থেকে ক্যাটাগরি সিলেক্ট করুন:`;
  if (pyT(pyHasAttr(target, "message"))) {
      if (pyT(_msg_has_media(target.message))) {
            try {
                    void ((await target.message.delete()));
            } catch (__e) {
            }
            void ((await target.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: reply_markup })));
      } else {
            try {
                    void ((await target.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: reply_markup })));
            } catch (__e) {
                    void ((await target.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: reply_markup })));
            }
      }
  } else {
      void ((await target.reply_text(msg, { parse_mode: "Markdown", reply_markup: reply_markup })));
  }
}

export async function send_admin_subcategory_selector(target, context, cat_selected) {
  let keyboard, msg, per_row, reply_markup, row, s, subcats;
  subcats = db.get_subcategories(cat_selected);
  keyboard = [];
  per_row = db.get_subcategory_row_size();
  row = [];
  for (const s of pyIter(subcats)) {
      pyAppend(row, InlineKeyboardButton(`• ${pyStr(s)}`, { callback_data: `adm_setsub_${pyStr(s)}` }));
      if (pyT((pyEq(pyLen(row), per_row)))) {
            pyAppend(keyboard, row);
            row = [];
      }
  }
  if (pyT(row)) {
      pyAppend(keyboard, row);
  }
  pyAppend(keyboard, [InlineKeyboardButton("➕ Custom / New Sub-Category", { callback_data: "adm_setsub_CUSTOM" })]);
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]);
  reply_markup = InlineKeyboardMarkup(keyboard);
  msg = `📂 **Category:** \`${pyStr(cat_selected)}\`

🎯 **ধাপ ৫/৬: সাব-ক্যাটাগরি নির্বাচন করুন:**`;
  if (pyT(pyHasAttr(target, "message"))) {
      if (pyT(_msg_has_media(target.message))) {
            try {
                    void ((await target.message.delete()));
            } catch (__e) {
            }
            void ((await target.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: reply_markup })));
      } else {
            try {
                    void ((await target.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: reply_markup })));
            } catch (__e) {
                    void ((await target.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: reply_markup })));
            }
      }
  } else {
      void ((await target.reply_text(msg, { parse_mode: "Markdown", reply_markup: reply_markup })));
  }
}

export async function show_profile(update, context) {
  let keyboard, msg, name, o, orders, purchased_courses, purchased_ebooks, total_spent;
  let user, user_data, username, wallet_balance;
  user = update.effective_user;
  user_data = (((__v15) => (pyT(__v15) ? __v15 : ({  })))(db.get_user(user.id)));
  purchased_courses = pyGet(user_data, "purchased_courses", []);
  purchased_ebooks = pyGet(user_data, "purchased_ebooks", []);
  orders = db.get_user_orders(user.id);
  total_spent = pySum(((() => { const __acc = []; for (const o of pyIter(orders)) { if (!pyT((pyEq(pyGet(o, "status"), "approved")))) continue; __acc.push(pyGet(o, "amount", 0)); } return __acc; })()));
  wallet_balance = pyGet(user_data, "balance", 0);
  name = pyHtmlEscape((((__v16) => (pyT(__v16) ? __v16 : ("User")))(user.first_name)));
  username = (pyT(user.username) ? (`@${pyStr(pyHtmlEscape(user.username))}`) : ("N/A"));
  msg = `Hi, <b>${pyStr(name)}</b> 👋

🆔 <b>User ID:</b> <code>${pyStr(user.id)}</code>
🔗 <b>Username:</b> ${pyStr(username)}

🎓 <b>Courses:</b> ${pyStr(pyLen(purchased_courses))}
📚 <b>E-Books:</b> ${pyStr(pyLen(purchased_ebooks))}
💰 <b>Wallet Balance:</b> ৳${pyStr(wallet_balance)} BDT
💳 <b>Total Spent:</b> ৳${pyStr(total_spent)} BDT`;
  keyboard = [[InlineKeyboardButton("🎓 My Courses", { callback_data: "my_courses_nav" }), InlineKeyboardButton("📚 My E-Books", { callback_data: "my_ebooks_nav" })], [InlineKeyboardButton("🧾 Order History", { callback_data: "my_orders_history" }), InlineKeyboardButton("🎁 Refer & Earn", { callback_data: "my_refer_nav" })]];
  if (pyT(db.is_earnings_enabled(user.id))) {
      pyAppend(keyboard, [InlineKeyboardButton("💰 Earnings & Withdraw", { callback_data: "my_earnings_nav" })]);
  }
  if (pyT(db.is_home_button_enabled())) {
      pyAppend(keyboard, [InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" })]);
  }
  if (pyT(update.callback_query)) {
      if (pyT(_msg_has_media(update.callback_query.message))) {
            try {
                    void ((await update.callback_query.message.delete()));
            } catch (__e) {
            }
            void ((await update.callback_query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await update.callback_query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else {
      void ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function show_referral(update, context) {
  let bonus_amount, bot_info, is_enabled, keyboard, msg, ref_balance, ref_count, ref_link;
  let ref_nav_row, user, user_data;
  user = update.effective_user;
  bot_info = (await context.bot.get_me());
  ref_link = `https://t.me/${pyStr(bot_info.username)}?start=ref_${pyStr(user.id)}`;
  user_data = (((__v17) => (pyT(__v17) ? __v17 : ({  })))(db.get_user(user.id)));
  ref_count = pyGet(user_data, "referral_count", 0);
  ref_balance = pyGet(user_data, "balance", 0);
  bonus_amount = db.get_referral_reward_amount();
  is_enabled = db.is_referral_enabled();
  ref_nav_row = [InlineKeyboardButton("◀️ Profile", { callback_data: "profile_nav" })];
  if (pyT(db.is_home_button_enabled())) {
      pyAppend(ref_nav_row, InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" }));
  }
  if (pyT((!pyT(is_enabled)))) {
      msg = "🎁 <b>Refer & Earn</b>\n━━━━━━━━━━━━━━━━━━━━\n\n⚠️ <i>The referral program is currently suspended. Please check back later.</i>";
      keyboard = [ref_nav_row];
  } else {
      msg = `🎁 <b>Refer & Earn</b>
━━━━━━━━━━━━━━━━━━━━

Share your referral link with friends. When someone purchases a course using your link, you will earn a <b>৳${pyStr(bonus_amount)} BDT</b> bonus!

👥 <b>Successful Referrals:</b> <code>${pyStr(ref_count)}</code>
💰 <b>Referral Balance:</b> <code>৳${pyStr(ref_balance)} BDT</code>

🔗 <b>Your Referral Link:</b>
<code>${pyStr(ref_link)}</code>`;
      keyboard = [[InlineKeyboardButton("📤 Share Link", { url: `https://t.me/share/url?url=${pyStr(ref_link)}` })], ref_nav_row];
  }
  if (pyT(update.callback_query)) {
      if (pyT(_msg_has_media(update.callback_query.message))) {
            try {
                    void ((await update.callback_query.message.delete()));
            } catch (__e) {
            }
            void ((await update.callback_query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await update.callback_query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else {
      void ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function show_earnings_dashboard(update, context) {
  let balance, keyboard, msg, user, user_data;
  user = update.effective_user;
  user_data = (((__v18) => (pyT(__v18) ? __v18 : ({  })))(db.get_user(user.id)));
  balance = pyGet(user_data, "balance", 0);
  if (pyT((!pyT(db.is_earnings_enabled(user.id))))) {
      msg = `💰 <b>Wallet Balance</b>
━━━━━━━━━━━━━━━━━━━━

💳 <b>Your Current Balance:</b> <code>৳${pyStr(balance)} BDT</code>

💡 <i>You can use your earned balance to directly purchase any course or e-book from the bot. Cash withdrawal facility is only available for approved users.</i>`;
      keyboard = [[InlineKeyboardButton("🎓 Browse Courses", { callback_data: "browse_categories" })], [InlineKeyboardButton("◀️ Profile", { callback_data: "profile_nav" })]];
      if (pyT(update.callback_query)) {
            if (pyT(_msg_has_media(update.callback_query.message))) {
                    try {
                              void ((await update.callback_query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await update.callback_query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
            } else {
                    void ((await update.callback_query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
            }
      } else {
            void ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
      return;
  }
  msg = `💰 **Earnings & Withdrawal Dashboard**

💳 **Current Balance (Available Balance):**
👉 ৳${pyStr(balance)} BDT

💡 You can withdraw your earned referral balance here (minimum withdrawal amount: ৳${pyStr(db.get_min_withdraw_amount())} BDT).`;
  keyboard = [[InlineKeyboardButton("💸 Withdraw Balance", { callback_data: "earn_withdraw" })], [InlineKeyboardButton("🧾 Earnings History", { callback_data: "earn_history" }), InlineKeyboardButton("💸 Withdrawal History", { callback_data: "earn_withdraw_history" })], [InlineKeyboardButton("◀️ Profile", { callback_data: "profile_nav" })]];
  if (pyT(update.callback_query)) {
      if (pyT(_msg_has_media(update.callback_query.message))) {
            try {
                    void ((await update.callback_query.message.delete()));
            } catch (__e) {
            }
            void ((await update.callback_query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await update.callback_query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else {
      void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function show_earnings_history(update, context) {
  let history, item, keyboard, msg, user_id;
  user_id = update.effective_user.id;
  history = db.get_earnings_history(user_id);
  if (pyT((!pyT(history)))) {
      msg = "📊 **Earnings History:**\n━━━━━━━━━━━━━━━━━━━━\n\nYou have no earnings records yet.\nYour referral earnings will be reflected here once you successfully purchase a course using your referral coupon.";
  } else {
      msg = "📊 **Earnings History:**\n━━━━━━━━━━━━━━━━━━━━\n\n";
      for (const item of pyIter(pySlice(history, null, 15, null))) {
            msg += `• **+${pyStr(pySub(item, "amount"))}৳** — \`${pyStr(pyGet(item, "coupon_code", "REWARD"))}\` (${pyStr(pySlice(pyGet(item, "date", ""), null, 10, null))})
`;
      }
  }
  keyboard = [[InlineKeyboardButton("« Earnings Menu", { callback_data: "my_earnings_nav" })]];
  if (pyT(update.callback_query)) {
      void ((await update.callback_query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function show_withdrawal_history(update, context) {
  let keyboard, msg, st, user_id, w, withdrawals;
  user_id = update.effective_user.id;
  withdrawals = db.get_user_withdrawals(user_id);
  if (pyT((!pyT(withdrawals)))) {
      msg = "💳 **Withdrawal History:**\n━━━━━━━━━━━━━━━━━━━━\n\nআপনি এখনও কোনো উইথড্রয়াল রিকোয়েস্ট পাঠাননি।";
  } else {
      msg = "💳 **Withdrawal History:**\n━━━━━━━━━━━━━━━━━━━━\n\n";
      for (const w of pyIter(pySlice(withdrawals, null, 10, null))) {
            st = (pyT((pyEq(pyGet(w, "status"), "pending"))) ? ("🟡 Pending") : ((pyT((pyEq(pyGet(w, "status"), "approved"))) ? ("✅ Approved") : ("❌ Rejected"))));
            msg += `• **${pyStr(pySub(w, "amount"))}৳** | ${pyStr(pyGet(w, "method", "N/A"))} (${pyStr(pyGet(w, "account", "N/A"))})
  📅 ${pyStr(pySlice(pyGet(w, "date", ""), null, 16, null))} | স্ট্যাটাস: **${pyStr(st)}**

`;
      }
  }
  keyboard = [[InlineKeyboardButton("« Earnings Menu", { callback_data: "my_earnings_nav" })]];
  if (pyT(update.callback_query)) {
      void ((await update.callback_query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else {
      void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function start_withdraw_flow(query, context, user_id) {
  let balance, msg, user_data;
  if (pyT((!pyT(db.is_earnings_enabled(user_id))))) {
      void ((await query.answer("⚠️ আপনার অ্যাকাউন্টে ক্যাশ উত্তোলন সুবিধা সক্রিয় নেই। ব্যালেন্স দিয়ে যেকোনো কোর্স বা ই-বুক সরাসরি কিনতে পারবেন।", { show_alert: true })));
      return;
  }
  user_data = (((__v19) => (pyT(__v19) ? __v19 : ({  })))(db.get_user(user_id)));
  balance = pyGet(user_data, "balance", 0);
  if (pyT(((balance < db.get_min_withdraw_amount())))) {
      void ((await query.answer(`⚠️ সর্বনিম্ন উত্তোলনযোগ্য ব্যালেন্স ${pyStr(db.get_min_withdraw_amount())} ৳! আপনার ব্যালেন্স: ${pyStr(balance)} ৳`, { show_alert: true })));
      return;
  }
  context.user_data["withdraw_step"] = "amount";
  msg = `💸 **Withdraw Balance**
━━━━━━━━━━━━━━━━━━━━

💰 **Your Current Balance:** \`${pyStr(balance)}\` ৳
📌 **Minimum Withdrawal:** \`${pyStr(db.get_min_withdraw_amount())}\` ৳

👇 **Enter the amount you want to withdraw (in BDT):**
(Example: \`100\` or \`350\`)

💡 To cancel, type /cancel.`;
  void ((await query.edit_message_text(msg, { parse_mode: "Markdown" })));
  try {
      context.user_data["withdraw_prompt_ids"] = [query.message.message_id];
  } catch (__e) {
  }
}

export async function show_my_courses(update, context, page) {
  if (page === undefined) page = (0);
  let c, c_name, courses, idx, keyboard, msg, n_added, nav;
  let page_courses, per_page, total_pages, user_id;
  user_id = update.effective_user.id;
  courses = db.get_user_courses(user_id);
  if (pyT((!pyT(courses)))) {
      msg = "🎓 <b>No Courses Found!</b>\n\nYou have not enrolled in any courses yet. Click below to browse available courses.";
      keyboard = [[InlineKeyboardButton("📚 Browse Courses", { callback_data: "browse_categories" })], [InlineKeyboardButton("◀️ Profile", { callback_data: "profile_nav" })]];
      if (pyT(update.callback_query)) {
            if (pyT(_msg_has_media(update.callback_query.message))) {
                    try {
                              void ((await update.callback_query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await update.callback_query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
            } else {
                    void ((await update.callback_query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
            }
      } else {
            void ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
      return;
  }
  per_page = 5;
  total_pages = pyMax(1, pyDiv(((pyLen(courses) + per_page) - 1), per_page));
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  page_courses = pySlice(courses, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, per_page) : (page * per_page))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), per_page) : ((page + 1) * per_page))), null);
  msg = `🎓 <b>My Courses (${pyStr(pyLen(courses))}):</b>
━━━━━━━━━━━━━━━━━━━━

`;
  keyboard = [];
  for (const [idx, c] of pyIter(pyEnumerate(page_courses, (((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, per_page) : (page * per_page))) + 1)))) {
      c_name = pyHtmlEscape(pyGet(c, "name", "Course"));
      msg += `${pyStr(idx)}. <b>${pyStr(c_name)}</b>
`;
      n_added = (await append_course_join_buttons(keyboard, context.bot, c, user_id, { query: update.callback_query, prefix: `🔗 ${pyStr(pySlice(pyGet(c, "name", ""), null, 12, null))} | `, single_text: `${pyStr(pySub(c, "name"))}` }));
      if (pyT((!pyT(n_added)))) {
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(pySub(c, "name"))}`, { callback_data: `course_${pyStr(pySub(c, "id"))}` })]);
      }
  }
  msg += "\n💡 <i>Click the buttons below to access your course.</i>";
  nav = [];
  if (pyT(((page > 0)))) {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `my_courses_pg_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_mycourse" }));
  }
  pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_mycourse" }));
  if (pyT(((page < (total_pages - 1))))) {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `my_courses_pg_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_mycourse" }));
  }
  pyAppend(keyboard, nav);
  pyAppend(keyboard, [InlineKeyboardButton("◀️ Profile", { callback_data: "profile_nav" })]);
  if (pyT(update.callback_query)) {
      if (pyT(_msg_has_media(update.callback_query.message))) {
            try {
                    void ((await update.callback_query.message.delete()));
            } catch (__e) {
            }
            void ((await update.callback_query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await update.callback_query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else {
      void ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function show_my_ebooks(update, context, page) {
  if (page === undefined) page = (0);
  let all_ebs, eb, ebooks, eid, free_ebs, idx, keyboard, link;
  let msg, nav, page_items, per_page, total_pages, user_id;
  user_id = update.effective_user.id;
  ebooks = db.get_user_ebooks(user_id);
  all_ebs = db.get_all_ebooks();
  free_ebs = ((() => { const __acc = []; for (const [eid, eb] of pyIter(pyItems(all_ebs))) { if (!pyT((pyEq(pyGet(eb, "price", 0), 0)))) continue; __acc.push([eid, eb]); } return __acc; })());
  per_page = 5;
  keyboard = [];
  if (pyT((!pyT(ebooks)))) {
      if (pyT(free_ebs)) {
            total_pages = pyMax(1, pyDiv(((pyLen(free_ebs) + per_page) - 1), per_page));
            page = pyMax(0, pyMin(page, (total_pages - 1)));
            page_items = pySlice(free_ebs, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, per_page) : (page * per_page))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), per_page) : ((page + 1) * per_page))), null);
            msg = `📚 **Free E-books and Study Materials (${pyStr(pyLen(free_ebs))} available):**

`;
            for (const [idx, [eid, eb]] of pyIter(pyEnumerate(page_items, (((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, per_page) : (page * per_page))) + 1)))) {
                    msg += `${pyStr(idx)}. 📘 **${pyStr(pySub(eb, "name"))}** (Free)
`;
                    if (pyT(pyGet(eb, "file_id"))) {
                              pyAppend(keyboard, [InlineKeyboardButton(`📥 Download ${pyStr(pySlice(pySub(eb, "name"), null, 16, null))} (PDF)`, { callback_data: `ebdl_${pyStr(eid)}` })]);
                    } else if (pyT(pyGet(eb, "access_link"))) {
                              pyAppend(keyboard, [InlineKeyboardButton(`📥 Download ${pyStr(pySlice(pySub(eb, "name"), null, 16, null))}`, { url: pySub(eb, "access_link") })]);
                    }
            }
            msg += "\n💡 <i>Click below to download your free e-books.</i>";
            nav = [];
            if (pyT(((page > 0)))) {
                    pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `my_ebooks_pg_${pyStr((page - 1))}` }));
            } else {
                    pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_myebook" }));
            }
            pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_myebook" }));
            if (pyT(((page < (total_pages - 1))))) {
                    pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `my_ebooks_pg_${pyStr((page + 1))}` }));
            } else {
                    pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_myebook" }));
            }
            pyAppend(keyboard, nav);
      } else {
            msg = "📚 **Free E-books and Study Materials**\n\n📖 You have no e-books in your collection yet.\nNew premium e-books and lecture notes will be added soon.";
            pyAppend(keyboard, [InlineKeyboardButton("📖 Browse E-Books", { callback_data: "browse_ebooks" })]);
      }
  } else {
      total_pages = pyMax(1, pyDiv(((pyLen(ebooks) + per_page) - 1), per_page));
      page = pyMax(0, pyMin(page, (total_pages - 1)));
      page_items = pySlice(ebooks, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, per_page) : (page * per_page))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), per_page) : ((page + 1) * per_page))), null);
      msg = `📚 **আপনার সংগৃহীত ই-বুকসমূহ (${pyStr(pyLen(ebooks))} টি):**

`;
      for (const [idx, eb] of pyIter(pyEnumerate(page_items, (((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, per_page) : (page * per_page))) + 1)))) {
            msg += `${pyStr(idx)}. 📘 **${pyStr(pySub(eb, "name"))}**
`;
            eid = pyGet(eb, "id", `eb_${pyStr(idx)}`);
            if (pyT(pyGet(eb, "file_id"))) {
                    pyAppend(keyboard, [InlineKeyboardButton(`📥 Download ${pyStr(pySlice(pySub(eb, "name"), null, 16, null))} (PDF)`, { callback_data: `ebdl_${pyStr(eid)}` })]);
            } else {
                    link = pyGet(eb, "download_link", pyGet(eb, "access_link", ""));
                    if (pyT(link)) {
                              pyAppend(keyboard, [InlineKeyboardButton(`📥 Download ${pyStr(pySlice(pySub(eb, "name"), null, 16, null))}`, { url: link })]);
                    }
            }
      }
      msg += "\n💡 <i>Click below to download your e-books.</i>";
      nav = [];
      if (pyT(((page > 0)))) {
            pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `my_ebooks_pg_${pyStr((page - 1))}` }));
      } else {
            pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_myebook" }));
      }
      pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_myebook" }));
      if (pyT(((page < (total_pages - 1))))) {
            pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `my_ebooks_pg_${pyStr((page + 1))}` }));
      } else {
            pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_myebook" }));
      }
      pyAppend(keyboard, nav);
  }
  pyAppend(keyboard, [InlineKeyboardButton("◀️ Profile", { callback_data: "profile_nav" })]);
  if (pyT(update.callback_query)) {
      if (pyT(_msg_has_media(update.callback_query.message))) {
            try {
                    void ((await update.callback_query.message.delete()));
            } catch (__e) {
            }
            void ((await update.callback_query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await update.callback_query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else {
      void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function browse_ebooks(update, context) {
  let _lmf, _lmt, all_ebs, cap, cat, cats, default_lib, e;
  let keyboard, markup, msg, per_row, query, row;
  query = update.callback_query;
  cats = db.get_ebook_categories({ include_inactive: false });
  all_ebs = db.get_all_ebooks();
  default_lib = "📚 **E-Book Library**\n━━━━━━━━━━━━━━━━━━━━\nSelect a category:";
  msg = (((__v20) => (pyT(__v20) ? __v20 : (default_lib)))(db.get_setting("ebook_library_header_text", "")));
  if (pyT((!pyT(pyStrip((((__v21) => (pyT(__v21) ? __v21 : ("")))(msg))))))) {
      msg = default_lib;
  }
  try {
      _lmt = pyLower(pyStr((((__v22) => (pyT(__v22) ? __v22 : ("none")))(db.get_setting("ebook_library_media_type", "none")))));
      _lmf = (((__v23) => (pyT(__v23) ? __v23 : ("")))(db.get_setting("ebook_library_media_file_id", "")));
  } catch (__e) {
      [_lmt, _lmf] = ["none", ""];
  }
  if (pyT((((__v24) => (pyT(__v24) ? __v24 : ((!pyT(_lmf)))))(((!pyContains(["photo", "animation"], _lmt))))))) {
      _lmt = "none";
  }
  keyboard = [];
  per_row = db.get_category_row_size();
  row = [];
  for (const cat of pyIter(cats)) {
      pyAppend(row, InlineKeyboardButton(`${pyStr(cat)}`, { callback_data: `ebcat_${pyStr(cat)}` }));
      if (pyT((pyEq(pyLen(row), per_row)))) {
            pyAppend(keyboard, row);
            row = [];
      }
  }
  if (pyT(row)) {
      pyAppend(keyboard, row);
  }
  if (pyT(db.is_home_button_enabled())) {
      pyAppend(keyboard, [InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" })]);
  }
  markup = InlineKeyboardMarkup(keyboard);
  if (pyT(((!pyEq(_lmt, "none"))))) {
      cap = (pyT(((pyLen(msg) <= 1024))) ? (msg) : ((pySlice(msg, null, 1021, null) + "...")));
      try {
            if (pyT(query)) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    if (pyT((pyEq(_lmt, "photo")))) {
                              void ((await query.message.reply_photo({ photo: _lmf, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
                    } else {
                              void ((await query.message.reply_animation({ animation: _lmf, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
                    }
            } else if (pyT((pyEq(_lmt, "photo")))) {
                    void ((await update.message.reply_photo({ photo: _lmf, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
            } else {
                    void ((await update.message.reply_animation({ animation: _lmf, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
            }
            return;
      } catch (e) {
            logger.warning(`E-book library header media failed: ${pyStr(e)}`);
      }
  }
  if (pyT(query)) {
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: markup })));
      } else {
            void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: markup })));
      }
  } else {
      void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: markup })));
  }
}

export async function show_ebooks_by_category(update, context, cat) {
  let _ehcap, _ehdr, _ehmf, _ehmt, cat_title, child_ebooks, child_path, child_sub_count;
  let clean_path, e, eb, ebooks, eid, kb, keyboard, msg;
  let parent_path, per_row, price, price_tag, query, row, s, segments;
  let sf, subfolders, user_id;
  query = update.callback_query;
  user_id = update.effective_user.id;
  clean_path = pyReplace(pyReplace(pyStrip(pyStr(cat)), " / ", " > "), "/", " > ");
  if (pyT((((__v25) => (pyT(__v25) ? ((!pyT(db.is_ebook_category_active(clean_path)))) : __v25))(((!pyEq(pyUpper(clean_path), "ALL"))))))) {
      kb = [[InlineKeyboardButton("⬅️Back", { callback_data: "browse_ebooks" })]];
      if (pyT(db.is_home_button_enabled())) {
            pyAppend(kb, [InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" })]);
      }
      if (pyT(query)) {
            try {
                    void ((await query.edit_message_text("⚠️ **এই ক্যাটাগরিটি বর্তমানে বন্ধ আছে।**", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(kb) })));
            } catch (__e) {
                    void ((await query.answer("⚠️ এই ক্যাটাগরিটি বর্তমানে বন্ধ আছে।", { show_alert: true })));
            }
      } else {
            void ((await update.message.reply_text("⚠️ **এই ক্যাটাগরিটি বর্তমানে বন্ধ আছে।**", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(kb) })));
      }
      return;
  }
  if (pyT((pyEq(pyUpper(clean_path), "ALL")))) {
      ebooks = ((() => { const __acc = []; for (const [eid, eb] of pyIter(pyItems(db.get_all_ebooks()))) { if (!pyT(((!pyEq(pyGet(eb, "status"), "inactive"))))) continue; __acc.push(pyDict(eb, eid)); } return __acc; })());
      subfolders = [];
  } else {
      subfolders = db.get_ebook_sub_folders(clean_path, { include_inactive: false });
      ebooks = db.get_ebooks_by_folder(clean_path, { include_inactive: false });
  }
  segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(clean_path, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
  parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
  cat_title = (pyT((pyEq(pyUpper(clean_path), "ALL"))) ? ("সকল ই-বুক") : (`ক্যাটাগরি: ${pyStr(pyJoin(" ➔ ", segments))}`));
  msg = `📁 **${pyStr(cat_title)}**
━━━━━━━━━━━━━━━━━━━━
আপনার পছন্দের ই-বুক বা স্টাডি মেটেরিয়াল নির্বাচন করুন:`;
  if (pyT(((!pyEq(pyUpper(clean_path), "ALL"))))) {
      _ehdr = db.get_ebook_folder_header(clean_path);
      if (pyT(pyStrip((((__v26) => (pyT(__v26) ? __v26 : ("")))(pyGet(_ehdr, "text")))))) {
            msg = pyStrip(pySub(_ehdr, "text"));
      }
  }
  keyboard = [];
  per_row = db.get_subcategory_row_size();
  row = [];
  for (const sf of pyIter(subfolders)) {
      child_path = (pyT(clean_path) ? (`${pyStr(clean_path)} > ${pyStr(sf)}`) : (sf));
      child_ebooks = db.get_ebooks_by_folder(child_path, { include_inactive: false });
      child_sub_count = pyLen(db.get_ebook_sub_folders(child_path));
      pyAppend(row, InlineKeyboardButton(`${pyStr(sf)}`, { callback_data: `ebcat_${pyStr(child_path)}` }));
      if (pyT((pyEq(pyLen(row), per_row)))) {
            pyAppend(keyboard, row);
            row = [];
      }
  }
  if (pyT(row)) {
      pyAppend(keyboard, row);
  }
  for (const eb of pyIter(ebooks)) {
      eid = pyGet(eb, "id");
      price = pyGet(eb, "price", 0);
      price_tag = (pyT(((price > 0))) ? (` —৳${pyStr(price)}`) : (" — Free"));
      if (pyT(db.has_user_ebook_access(user_id, eid))) {
            pyAppend(keyboard, [InlineKeyboardButton(`✅ ${pyStr(pySub(eb, "name"))} (Collected)`, { callback_data: `view_eb_${pyStr(eid)}` })]);
      } else {
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(pySub(eb, "name"))}${pyStr(price_tag)}`, { callback_data: `view_eb_${pyStr(eid)}` })]);
      }
  }
  if (pyT((((__v27) => (pyT(__v27) ? ((!pyT(ebooks))) : __v27))((!pyT(subfolders)))))) {
      msg += "\n\n*(বর্তমানে এই ক্যাটাগরিতে কোনো ই-বুক নেই)*";
  }
  if (pyT(((pyLen(segments) > 1)))) {
      pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: `ebcat_${pyStr(parent_path)}` })]);
  }
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "browse_ebooks" })]);
  if (pyT(db.is_home_button_enabled())) {
      pyAppend(keyboard, [InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" })]);
  }
  if (pyT(query)) {
      [_ehmt, _ehmf] = (pyT(((!pyEq(pyUpper(clean_path), "ALL")))) ? (db.get_ebook_folder_header_media(clean_path)) : (["none", ""]));
      if (pyT((((__v28) => (pyT(__v28) ? (_ehmf) : __v28))((pyContains(["photo", "animation"], _ehmt)))))) {
            _ehcap = (pyT(((pyLen(msg) <= 1024))) ? (msg) : ((pySlice(msg, null, 1021, null) + "...")));
            void ((await _delete_bot_message(query.message)));
            try {
                    if (pyT((pyEq(_ehmt, "photo")))) {
                              void ((await query.message.reply_photo({ photo: _ehmf, caption: _ehcap, parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
                    } else {
                              void ((await query.message.reply_animation({ animation: _ehmf, caption: _ehcap, parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
                    }
                    return;
            } catch (e) {
                    logger.warning(`Ebook folder header media failed: ${pyStr(e)}`);
            }
      }
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else {
      void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function view_ebook_details(update, context, eb_id) {
  let cat, eb, has_access, keyboard, msg, price, query, share_url;
  let user_id;
  query = update.callback_query;
  eb = db.get_ebook(eb_id);
  if (pyT((!pyT(eb)))) {
      if (pyT(query)) {
            void ((await query.answer("E-Book not found!", { show_alert: true })));
      }
      return;
  }
  user_id = update.effective_user.id;
  price = pyGet(eb, "price", 0);
  has_access = db.has_user_ebook_access(user_id, eb_id);
  cat = pyGet(eb, "category", "General");
  msg = `📖 <b>${pyStr(pyHtmlEscape(pySub(eb, "name")))}</b>
━━━━━━━━━━━━━━━━━━━━

📂 Category: <code>${pyStr(pyHtmlEscape(cat))}</code>
💰 Price: ${pyStr((pyT(((price > 0))) ? (`৳${pyStr(price)}`) : ("Free")))}

📝 Description:
${pyStr(pyHtmlEscape(pyGet(eb, "description", "Premium e-book & study material.")))}`;
  keyboard = [];
  if (pyT(has_access)) {
      if (pyT(pyGet(eb, "file_id"))) {
            pyAppend(keyboard, [InlineKeyboardButton("📥 Download PDF", { callback_data: `ebdl_${pyStr(eb_id)}` })]);
      }
      if (pyT(pyGet(eb, "access_link"))) {
            pyAppend(keyboard, [InlineKeyboardButton("🔗 Open Drive Link", { url: pySub(eb, "access_link") })]);
      }
  } else if (pyT((pyEq(price, 0)))) {
      pyAppend(keyboard, [InlineKeyboardButton("🎁 Get Free Access", { callback_data: `unlock_free_eb_${pyStr(eb_id)}` })]);
  } else {
      if (pyT(db.is_in_cart(user_id, eb_id))) {
            pyAppend(keyboard, [InlineKeyboardButton("🎟 Coupon", { callback_data: `coupon_${pyStr(eb_id)}` }), InlineKeyboardButton("❌ Remove From Cart", { callback_data: `remcartc_${pyStr(eb_id)}` })]);
      } else {
            pyAppend(keyboard, [InlineKeyboardButton("🎟 Coupon", { callback_data: `coupon_${pyStr(eb_id)}` }), InlineKeyboardButton("🛒 Add to Cart", { callback_data: `addcart_${pyStr(eb_id)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton(`💳 Buy E-Book — ৳${pyStr(price)}`, { callback_data: `buy_eb_${pyStr(eb_id)}` })]);
  }
  share_url = `https://t.me/share/url?url=https://t.me/${pyStr(BOT_USERNAME)}?start=ebook_${pyStr(eb_id)}&text=${pyStr(pyQuotePlus(pyGet(eb, "name", "")))}`;
  pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: `ebcat_${pyStr(cat)}` }), InlineKeyboardButton("📤 Share", { url: share_url })]);
  if (pyT(db.is_home_button_enabled())) {
      pyAppend(keyboard, [InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" })]);
  }
  void ((await send_rich_course_message((((__v29) => (pyT(__v29) ? __v29 : (update.message)))(query)), msg, InlineKeyboardMarkup(keyboard), { image: pyGet(eb, "image"), is_edit: true })));
}

export async function send_cart_message(update, text, markup) {
  let cap, e, fid, mtype;
  [mtype, fid] = get_cart_media();
  cap = (pyT(((pyLen(text) <= 1024))) ? (text) : ((pySlice(text, null, 1021, null) + "...")));
  if (pyT((((__v30) => (pyT(__v30) ? (fid) : __v30))((pyEq(mtype, "photo")))))) {
      try {
            if (pyT(update.callback_query)) {
                    try {
                              void ((await update.callback_query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await update.callback_query.message.reply_photo({ photo: fid, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
            } else {
                    void ((await update.message.reply_photo({ photo: fid, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
            }
            return (true);
      } catch (e) {
            logger.warning(`Cart heading photo failed, fallback to text: ${pyStr(e)}`);
      }
  } else if (pyT((((__v31) => (pyT(__v31) ? (fid) : __v31))((pyEq(mtype, "animation")))))) {
      try {
            if (pyT(update.callback_query)) {
                    try {
                              void ((await update.callback_query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await update.callback_query.message.reply_animation({ animation: fid, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
            } else {
                    void ((await update.message.reply_animation({ animation: fid, caption: cap, parse_mode: "Markdown", reply_markup: markup })));
            }
            return (true);
      } catch (e) {
            logger.warning(`Cart heading animation failed, fallback to text: ${pyStr(e)}`);
      }
  }
  return (false);
}

export async function show_cart(update, context) {
  let applied_coupon, banner_img, body, caption, cart_custom_rows, coupon_btn_text, coupon_obj, course_ids;
  let custom_rows, discount, discount_val, header, i, idx, item, items;
  let keyboard, markup, message, msg, original_total, total, user_id, valid;
  user_id = update.effective_user.id;
  items = db.get_cart(user_id);
  if (pyT((!pyT(items)))) {
      [msg, custom_rows] = get_cart_empty_body();
      keyboard = [[InlineKeyboardButton("📚 Browse Courses", { callback_data: "browse_categories" })], [InlineKeyboardButton("📖 Browse E-Book", { callback_data: "browse_ebooks" })]];
      pyExtend(keyboard, cart_merge_unique(keyboard, custom_rows));
      if (pyT(db.is_home_button_enabled())) {
            pyAppend(keyboard, [InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" })]);
      }
      markup = InlineKeyboardMarkup(keyboard);
      if (pyT((await send_cart_message(update, msg, markup)))) {
            return;
      }
      if (pyT(update.callback_query)) {
            if (pyT(_msg_has_media(update.callback_query.message))) {
                    try {
                              void ((await update.callback_query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await update.callback_query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: markup })));
            } else {
                    void ((await update.callback_query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: markup })));
            }
      } else {
            void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: markup })));
      }
      return;
  }
  total = pySum(((() => { const __acc = []; for (const item of pyIter(items)) { __acc.push(pyGet(item, "price", 0)); } return __acc; })()));
  original_total = total;
  applied_coupon = pyGet(context.user_data, "applied_coupon");
  discount_val = 0;
  if (pyT(applied_coupon)) {
      course_ids = ((() => { const __acc = []; for (const i of pyIter(items)) { __acc.push(pySub(i, "id")); } return __acc; })());
      [valid, discount, message, coupon_obj] = db.validate_coupon_advanced(applied_coupon, user_id, total, "All", { course_ids: course_ids });
      if (pyT(valid)) {
            discount_val = discount;
            total = pyMax(0, (total - discount));
      } else {
            pyPop(context.user_data, "applied_coupon", null);
            applied_coupon = null;
      }
  }
  [header, cart_custom_rows] = get_cart_header_parts(pyLen(items), total);
  body = "";
  keyboard = [];
  for (const [idx, item] of pyIter(pyEnumerate(items, 1))) {
      body += `${pyStr(idx)}.  **${pyStr(pySub(item, "name"))}** - ${pyStr(pySub(item, "price"))} ৳
`;
      pyAppend(keyboard, [InlineKeyboardButton(`❌ Remove: ${pyStr(pySlice(pySub(item, "name"), null, 18, null))}`, { callback_data: `remcart_${pyStr(pySub(item, "id"))}` })]);
  }
  if (pyT(((discount_val > 0)))) {
      body += `
💰 **মোট মূল্য:** ${pyStr(original_total)} ৳ BDT
`;
      body += `🎟 **কুপন ছাড়:** -${pyStr(discount_val)} ৳ (\`${pyStr(applied_coupon)}\`)
`;
      body += `✅ **সর্বমোট পরিশোধযোগ্য:** **${pyStr(total)} ৳ BDT**`;
  } else {
      body += `
💰 **সর্বমোট মূল্য:** **${pyStr(total)} ৳ BDT**`;
  }
  msg = ((pyRStrip(header) + "\n\n") + body);
  coupon_btn_text = "🎟 Apply Coupon";
  pyAppend(keyboard, [InlineKeyboardButton(coupon_btn_text, { callback_data: "coupon_cart" }), InlineKeyboardButton("🛍 Checkout All", { callback_data: "checkout_cart" })]);
  pyAppend(keyboard, [InlineKeyboardButton("🗑 Clear Cart", { callback_data: "clear_cart" })]);
  pyExtend(keyboard, cart_merge_unique(keyboard, cart_custom_rows));
  if (pyT(db.is_home_button_enabled())) {
      pyAppend(keyboard, [InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" })]);
  }
  if (pyT((await send_cart_message(update, msg, InlineKeyboardMarkup(keyboard))))) {
      return;
  }
  if (pyT((pyEq(pyLen(items), 1)))) {
      banner_img = pyGet(pySub(items, 0), "image");
      if (pyT(banner_img)) {
            caption = msg;
            markup = InlineKeyboardMarkup(keyboard);
            if (pyT(update.callback_query)) {
                    if (pyT(_msg_has_media(update.callback_query.message))) {
                              try {
                                          if (pyT((await _edit_photo_smooth(update.callback_query, banner_img, caption, markup, "Markdown")))) {
                                                        return;
                                          }
                              } catch (__e) {
                              }
                              try {
                                          void ((await update.callback_query.message.delete()));
                              } catch (__e) {
                              }
                              void ((await update.callback_query.message.reply_photo({ photo: banner_img, caption: caption, parse_mode: "Markdown", reply_markup: markup })));
                    } else {
                              try {
                                          void ((await update.callback_query.message.delete()));
                              } catch (__e) {
                              }
                              void ((await update.callback_query.message.reply_photo({ photo: banner_img, caption: caption, parse_mode: "Markdown", reply_markup: markup })));
                    }
            } else {
                    void ((await update.message.reply_photo({ photo: banner_img, caption: caption, parse_mode: "Markdown", reply_markup: markup })));
            }
            return;
      }
  }
  if (pyT(update.callback_query)) {
      if (pyT(_msg_has_media(update.callback_query.message))) {
            try {
                    void ((await update.callback_query.message.delete()));
            } catch (__e) {
            }
            void ((await update.callback_query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await update.callback_query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else {
      void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export function get_default_info_content(item_key) {
  if (pyT((pyEq(item_key, "contact")))) {
      return ((((__v32) => (pyT(__v32) ? __v32 : (`➥ **Contact Support / হেল্পলাইন**
━━━━━━━━━━━━━━━━━━━━

যেকোনো কোর্স সংক্রান্ত তথ্য, পেমেন্ট হেল্প বা সমস্যার জন্য আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন:

👨‍💻 **Admin Support:** @${pyStr(SUPPORT_USERNAME)}
📢 **Official Channel:** @${pyStr(BOT_USERNAME)}
⏰ **সাপোর্ট সময়:** সকাল ৯:০০ টা - রাত ১২:০০ টা

💡 আপনার কোনো সমস্যা থাকলে এডমিনের ইনবক্সে সরাসরি মেসেজ দিন।`)))(db.get_setting("support_message"))));
  } else if (pyT((pyEq(item_key, "how_to_buy")))) {
      return ("❖ **How to Buy / কোর্স কেনার নিয়ম**\n━━━━━━━━━━━━━━━━━━━━\n\nআমাদের প্ল্যাটফর্ম থেকে খুব সহজেই যেকোনো কোর্স কিনতে পারবেন। নিচের ধাপগুলো অনুসরণ করুন:\n\n1️⃣ **কোর্স নির্বাচন:** \nমেনু বা সার্চ থেকে আপনার পছন্দের কোর্সটি সিলেক্ট করুন।\n\n2️⃣ **অর্ডার শুরু করুন:** \nকোর্সের বিস্তারিত দেখে **'💳 এখনই কিনুন (Buy Now)'** বাটনে চাপ দিন। (কুপন থাকলে আগে কুপন প্রয়োগ করতে পারেন)\n\n3️⃣ **পেমেন্ট মেথড নির্বাচন:** \nবিকাশ, নগদ বা রকেট এর মধ্যে আপনার সুবিধাজনক মাধ্যম বেছে নিন।\n\n4️⃣ **টাকা পাঠান (Send Money):** \nপ্রদর্শিত নাম্বারে নির্দিষ্ট পরিমাণ টাকা Send Money করুন এবং প্রাপ্ত **TrxID (Transaction ID)** টি কপি করুন।\n\n5️⃣ **TrxID সাবমিট:** \nTrxID টি বটে সেন্ড করলেই আপনার অর্ডার সাবমিট হয়ে যাবে।\n\n6️⃣ **তাৎক্ষণিক অ্যাক্সেস:** \nএডমিন ট্রানজেকশন যাচাই করার সাথে সাথেই আপনার ইনবক্সে ক্লাসের প্রাইভেট লিংক ও ম্যাটেরিয়াল চলে আসবে!");
  } else if (pyT((pyEq(item_key, "about")))) {
      return (`◈ **About StudyMart**
━━━━━━━━━━━━━━━━━━━━

**${pyStr(BOT_NAME)}** একটি সম্পূর্ণ আধুনিক এবং নির্ভরযোগ্য অনলাইন শিক্ষা সেবা প্ল্যাটফর্ম।

🎯 **আমাদের ভিশন:**
বাংলাদেশের যেকোনো প্রান্ত থেকে শিক্ষার্থীরা যাতে দেশের সেরা মেন্টরদের প্রিমিয়াম কোর্স, পূর্ণাঙ্গ লেকচার শিট ও পরীক্ষার প্রস্তুতি স্বল্প খরচে সহজেই গ্রহণ করতে পারে।

✦ **আমাদের ফিচারসমূহ:**
• লাইফটাইম অ্যাক্সেস সহ ফুল এইচডি ক্লাস
• প্র্যাকটিস শিট, দাগানো বই ও এক্সক্লুসিভ নোটস
• দ্রুত পেমেন্ট ভেরিফিকেশন ও অটোমেটিক ডেলিভারি
• ডেডিকেটেড স্টুডেন্ট সাপোর্ট`);
  } else if (pyT((pyEq(item_key, "terms")))) {
      return ("• **Terms & Policy / নীতিমালা ও শর্তাবলী**\n━━━━━━━━━━━━━━━━━━━━\n\n১. **কোর্স অ্যাক্সেস:** ক্রয়কৃত কোর্সের ম্যাটেরিয়াল ও লিংকে আপনি ফুল অ্যাক্সেস পাবেন।\n২. **পেমেন্ট ভেরিফিকেশন:** ভুল TrxID বা সঠিক টাকার কম পেমেন্ট করলে অর্ডার বাতিল হবে।\n৩. **নন-রিফান্ডেবল:** ডিজিটাল কোর্স মেটেরিয়াল ও অ্যাক্সেস লিংক সরবরাহ করার পর তা রিফান্ডযোগ্য নয়।\n৪. **কপিরাইট ও শেয়ারিং:** কোর্সের কন্টেন্ট অন্য কোথাও বিক্রয় বা বাণিজ্যিকভাবে শেয়ার করা সম্পূর্ণরূপে নিষিদ্ধ।\n৫. **সাপোর্ট:** কোনো সমস্যা হলে সর্বদা আমাদের অফিসিয়াল এডমিনের সাথে যোগাযোগ করবেন।");
  }
  return ("");
}

export function get_info_menu_keyboard() {
  let b, b_content, b_label, b_type, callback, cfg, items, key;
  let keyboard, label, url_dest;
  cfg = db.get_info_settings();
  items = pyGet(cfg, "items", {  });
  keyboard = [];
  for (const [key, callback] of pyIter([["contact", "info_contact"], ["how_to_buy", "info_how_to_buy"], ["about", "info_about"], ["terms", "info_terms"]])) {
      if (pyT(pyGet(pyGet(items, key, {  }), "enabled", true))) {
            label = (((__v33) => (pyT(__v33) ? __v33 : (key)))(pyGet(pyGet(items, key, {  }), "label")));
            pyAppend(keyboard, [InlineKeyboardButton(label, { callback_data: callback })]);
      }
  }
  for (const b of pyIter(pyGet(cfg, "custom_buttons", []))) {
      if (pyT(pyGet(b, "enabled", true))) {
            b_label = pyGet(b, "label", "Button");
            b_type = pyGet(b, "type", "url");
            b_content = pyGet(b, "content", "");
            if (pyT((((__v36) => (pyT(__v36) ? ((((__v35) => (pyT(__v35) ? __v35 : (((__v34) => (pyT(__v34) ? __v34 : (pyStart(b_content, "t.me"))))(pyStart(b_content, "https://")))))(pyStart(b_content, "http://")))) : __v36))((pyEq(b_type, "url")))))) {
                    url_dest = (pyT(pyStart(b_content, "http")) ? (b_content) : (`https://${pyStr(b_content)}`));
                    pyAppend(keyboard, [InlineKeyboardButton(b_label, { url: url_dest })]);
            } else {
                    pyAppend(keyboard, [InlineKeyboardButton(b_label, { callback_data: `cinfo_view_${pyStr(pySub(b, "id"))}` })]);
            }
      }
  }
  if (pyT(db.is_home_button_enabled())) {
      pyAppend(keyboard, [InlineKeyboardButton("⚜️ HOME", { callback_data: "back_to_main_menu" })]);
  }
  return (InlineKeyboardMarkup(keyboard));
}

export async function send_info_detail(update, context, body_text, reply_markup, header, media_type, media_file_id, parse_mode, divider) {
  if (header === undefined) header = ("");
  if (media_type === undefined) media_type = ("none");
  if (media_file_id === undefined) media_file_id = ("");
  if (parse_mode === undefined) parse_mode = ("Markdown");
  if (divider === undefined) divider = (true);
  let cap, e, fid, full, hdr, mtype, query;
  hdr = pyStrip((((__v37) => (pyT(__v37) ? __v37 : ("")))(header)));
  if (pyT((((__v38) => (pyT(__v38) ? (divider) : __v38))(hdr)))) {
      full = `${pyStr(hdr)}
━━━━━━━━━━━━━━━━━━━━

${pyStr(body_text)}`;
  } else if (pyT(hdr)) {
      full = `${pyStr(hdr)}
${pyStr(body_text)}`;
  } else {
      full = body_text;
  }
  mtype = pyLower(pyStr((((__v39) => (pyT(__v39) ? __v39 : ("none")))(media_type))));
  fid = (((__v40) => (pyT(__v40) ? __v40 : ("")))(media_file_id));
  if (pyT((((__v41) => (pyT(__v41) ? __v41 : ((!pyT(fid)))))(((!pyContains(["photo", "animation"], mtype))))))) {
      mtype = "none";
  }
  query = update.callback_query;
  if (pyT(((!pyEq(mtype, "none"))))) {
      cap = (pyT(((pyLen(full) <= 1024))) ? (full) : ((pySlice(full, null, 1021, null) + "...")));
      try {
            if (pyT(query)) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    if (pyT((pyEq(mtype, "photo")))) {
                              void ((await query.message.reply_photo({ photo: fid, caption: cap, parse_mode: parse_mode, reply_markup: reply_markup })));
                    } else {
                              void ((await query.message.reply_animation({ animation: fid, caption: cap, parse_mode: parse_mode, reply_markup: reply_markup })));
                    }
            } else if (pyT((pyEq(mtype, "photo")))) {
                    void ((await update.message.reply_photo({ photo: fid, caption: cap, parse_mode: parse_mode, reply_markup: reply_markup })));
            } else {
                    void ((await update.message.reply_animation({ animation: fid, caption: cap, parse_mode: parse_mode, reply_markup: reply_markup })));
            }
            return;
      } catch (e) {
            logger.warning(`Info detail media send failed, fallback to text: ${pyStr(e)}`);
      }
  }
  if (pyT(query)) {
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(full, { parse_mode: parse_mode, reply_markup: reply_markup })));
      } else {
            void ((await query.edit_message_text(full, { parse_mode: parse_mode, reply_markup: reply_markup })));
      }
  } else {
      void ((await update.message.reply_text(full, { parse_mode: parse_mode, reply_markup: reply_markup })));
  }
}

export async function show_info(update, context) {
  let caption, cfg, default_info, e, fid, mtype, parsed_kb, raw_text;
  let reply_markup, text;
  cfg = db.get_info_settings();
  default_info = "ℹ️ **StudyMart Help & Support**\n━━━━━━━━━━━━━━━━━━━━\n\nSelect an option below for purchasing guides, general questions, or direct support:";
  raw_text = (((__v42) => (pyT(__v42) ? __v42 : (db.get_setting("info_message", default_info))))(pyGet(cfg, "header_text")));
  if (pyT((((__v43) => (pyT(__v43) ? __v43 : ((!pyT(pyStrip(pyStr(raw_text)))))))((!pyT(raw_text)))))) {
      raw_text = default_info;
  }
  [text, parsed_kb] = parse_inline_buttons(raw_text);
  if (pyT((((__v44) => (pyT(__v44) ? __v44 : ((!pyT(pyStrip(pyStr(text)))))))((!pyT(text)))))) {
      text = default_info;
  }
  reply_markup = (pyT(parsed_kb) ? (InlineKeyboardMarkup(parsed_kb)) : (get_info_menu_keyboard()));
  try {
      [mtype, fid] = db.get_info_header_media();
  } catch (__e) {
      [mtype, fid] = ["none", ""];
  }
  if (pyT((((__v45) => (pyT(__v45) ? (fid) : __v45))((pyContains(["photo", "animation"], mtype)))))) {
      caption = (pyT(((pyLen(text) <= 1024))) ? (text) : ((pySlice(text, null, 1021, null) + "...")));
      if (pyT(update.callback_query)) {
            try {
                    void ((await update.callback_query.message.delete()));
            } catch (__e) {
            }
            try {
                    if (pyT((pyEq(mtype, "photo")))) {
                              void ((await update.callback_query.message.reply_photo({ photo: fid, caption: caption, parse_mode: "Markdown", reply_markup: reply_markup })));
                    } else {
                              void ((await update.callback_query.message.reply_animation({ animation: fid, caption: caption, parse_mode: "Markdown", reply_markup: reply_markup })));
                    }
            } catch (e) {
                    logger.warning(`Info header media send failed, fallback to text: ${pyStr(e)}`);
                    void ((await update.callback_query.message.reply_text(text, { parse_mode: "Markdown", reply_markup: reply_markup })));
            }
      } else {
            try {
                    if (pyT((pyEq(mtype, "photo")))) {
                              void ((await update.message.reply_photo({ photo: fid, caption: caption, parse_mode: "Markdown", reply_markup: reply_markup })));
                    } else {
                              void ((await update.message.reply_animation({ animation: fid, caption: caption, parse_mode: "Markdown", reply_markup: reply_markup })));
                    }
            } catch (e) {
                    logger.warning(`Info header media send failed, fallback to text: ${pyStr(e)}`);
                    void ((await update.message.reply_text(text, { parse_mode: "Markdown", reply_markup: reply_markup })));
            }
      }
      return;
  }
  if (pyT(update.callback_query)) {
      if (pyT(_msg_has_media(update.callback_query.message))) {
            try {
                    void ((await update.callback_query.message.delete()));
            } catch (__e) {
            }
            void ((await update.callback_query.message.reply_text(text, { parse_mode: "Markdown", reply_markup: reply_markup })));
      } else {
            void ((await update.callback_query.edit_message_text(text, { parse_mode: "Markdown", reply_markup: reply_markup })));
      }
  } else {
      void ((await update.message.reply_text(text, { parse_mode: "Markdown", reply_markup: reply_markup })));
  }
}

export let SEARCH_PER_PAGE = 8;
export function _run_search(query) {
  let all_ebs, combined, e, eb, eb_results, eid, q, results;
  let w, words;
  results = db.search_courses(query);
  q = pyLower(pyStrip((((__v46) => (pyT(__v46) ? __v46 : ("")))(query))));
  eb_results = [];
  if (pyT(q)) {
      words = pySplit(q, null, -1);
      try {
            all_ebs = (((__v47) => (pyT(__v47) ? __v47 : ({  })))(db.get_all_ebooks()));
      } catch (__e) {
            all_ebs = {  };
      }
      for (const [eid, eb] of pyIter(pyItems(all_ebs))) {
            if (pyT((((__v48) => (pyT(__v48) ? __v48 : ((pyEq(pyGet(eb, "status"), "inactive")))))((!pyT(pyIsInstance(eb, "dict"))))))) {
                    continue;
            }
            combined = pyLower(`${pyStr(pyGet(eb, "name", ""))} ${pyStr(pyGet(eb, "category", ""))} ${pyStr(pyGet(eb, "description", ""))}`);
            if (pyT((((__v51) => (pyT(__v51) ? __v51 : (((__v50) => (pyT(__v50) ? __v50 : (pyAny(((() => { const __acc = []; for (const w of pyIter(words)) { __acc.push((((__v49) => (pyT(__v49) ? ((pyContains(combined, w))) : __v49))(((pyLen(w) >= 3))))); } return __acc; })())))))(pyAll(((() => { const __acc = []; for (const w of pyIter(words)) { __acc.push((pyContains(combined, w))); } return __acc; })()))))))((pyContains(combined, q)))))) {
                    e = pyDict(eb);
                    e["id"] = eid;
                    pyAppend(eb_results, e);
            }
      }
  }
  return ([results, eb_results]);
}

export function _search_page_keyboard(user_id, query, courses, ebooks, page) {
  let c, e, e_price, is_bought, it, items, keyboard, kind;
  let nav, per_page, price_tag, total_pages;
  per_page = SEARCH_PER_PAGE;
  items = (((() => { const __acc = []; for (const c of pyIter(courses)) { __acc.push(["c", c]); } return __acc; })()) + ((() => { const __acc = []; for (const e of pyIter(ebooks)) { __acc.push(["e", e]); } return __acc; })()));
  total_pages = pyMax(1, pyDiv(((pyLen(items) + per_page) - 1), per_page));
  page = pyMax(0, pyMin(page, (total_pages - 1)));
  keyboard = [];
  for (const [kind, it] of pyIter(pySlice(items, ((typeof page === 'string' || Array.isArray(page) ? pyRepeat(page, per_page) : (page * per_page))), ((typeof (page + 1) === 'string' || Array.isArray((page + 1)) ? pyRepeat((page + 1), per_page) : ((page + 1) * per_page))), null))) {
      if (pyT((pyEq(kind, "c")))) {
            price_tag = (pyT(((pyGet(it, "price", 0) > 0))) ? (` — ৳${pyStr(pySub(it, "price"))}`) : (" 🆓"));
            is_bought = (pyT(db.is_purchased(user_id, pySub(it, "id"))) ? (" ✅") : (""));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(pySub(it, "name"))}${pyStr(price_tag)}${pyStr(is_bought)}`, { callback_data: `course_${pyStr(pySub(it, "id"))}` })]);
      } else {
            e_price = pyGet(it, "price", 0);
            price_tag = (pyT(((e_price > 0))) ? (` — ৳${pyStr(e_price)}`) : (" 🆓"));
            pyAppend(keyboard, [InlineKeyboardButton(`📕 ${pyStr(pyGet(it, "name", "E-Book"))}${pyStr(price_tag)}`, { callback_data: `view_eb_${pyStr(pySub(it, "id"))}` })]);
      }
  }
  nav = [];
  if (pyT(((page > 0)))) {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `srchpg_${pyStr((page - 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_srchpg" }));
  }
  pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_srchpg" }));
  if (pyT(((page < (total_pages - 1))))) {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `srchpg_${pyStr((page + 1))}` }));
  } else {
      pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_srchpg" }));
  }
  pyAppend(keyboard, nav);
  return ([keyboard, total_pages, page]);
}

export async function auto_search_courses(update, query, context) {
  if (context === undefined) context = (null);
  let eb_results, keyboard, msg, page, parsed_kb, raw_fb, reply_markup, results;
  let total_found, total_pages, user_id;
  user_id = (pyT(update.effective_user) ? (update.effective_user.id) : (0));
  if (pyT(((!(context === null || context === undefined))))) {
      try {
            context.user_data["last_search"] = query;
      } catch (__e) {
      }
  }
  [results, eb_results] = _run_search(query);
  if (pyT((((__v52) => (pyT(__v52) ? ((!pyT(eb_results))) : __v52))((!pyT(results)))))) {
      raw_fb = (((__v53) => (pyT(__v53) ? __v53 : (get_fallback_template_text())))(db.get_setting("fallback_message")));
      raw_fb = pyReplace(raw_fb, "{query}", query);
      [msg, parsed_kb] = parse_inline_buttons(raw_fb);
      reply_markup = (pyT(parsed_kb) ? (InlineKeyboardMarkup(parsed_kb)) : (null));
      void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: reply_markup })));
      return;
  }
  [keyboard, total_pages, page] = _search_page_keyboard(user_id, query, results, eb_results, 0);
  total_found = (pyLen(results) + pyLen(eb_results));
  msg = `🔍 **'${pyStr(query)}' এর সার্চ ফলাফল (${pyStr(total_found)} টি পাওয়া গেছে):**
━━━━━━━━━━━━━━━━━━━━
কোর্সের বিস্তারিত তথ্য ও ভর্তি হতে নিচের বাটনে চাপ দিন:`;
  void ((await update.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
}

