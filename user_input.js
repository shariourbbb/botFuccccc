// user_input.js — auto-transpiled from bot.py by py2js. Ported 1:1 from the Python source.
import { InlineKeyboardMarkup } from "./compat.js";
import { db } from "./db.js";
import { handle_admin_category_creation, handle_admin_coupon_creation_wizard, handle_admin_course_creation, handle_admin_course_edit_input, handle_admin_ebook_creation, handle_admin_ebook_edit_input, handle_admin_ebook_subcategory_creation, handle_admin_payment_input, handle_admin_subcategory_creation, handle_admin_user_mgmt_input, handle_broadcast_input_step } from "./admin_input.js";
import { admin_cmd, build_fallback_text, get_fallback_template_text, prompt_add_hbtn_row, render_admin_ebook_folder_directory, render_admin_folder_directory, render_hbtn_edit_panel, split_fallback_buttons } from "./admin_panels.js";
import { handle_admin_kb_add_input, handle_admin_kb_edit_input, handle_callback } from "./callbacks_user.js";
import { _strip_color_dot, cancel_cmd, check_banned, check_maintenance, format_order_id_display, get_home_keyboard_grid, is_admin, logger, main_menu_keyboard, start } from "./core.js";
import { handle_coupon_input, handle_trxid_input, handle_withdraw_input, show_subcategories_message } from "./flows.js";
import { auto_search_courses, show_cart, show_info, show_my_courses, show_profile } from "./screens.js";
import { pyAppend, pyContains, pyDict, pyEq, pyGet, pyHtmlEscape, pyInsert, pyInt, pyIsInstance, pyItems, pyIter, pyLen, pyLower, pyPop, pyReplace, pySlice, pyStart, pyStr, pyStrip, pySub, pyT, pyTitle } from "./helpers.js";
import { InlineKeyboardButton } from "./core.js";

export async function handle_user_input(update, context) {
  let _body, _mt, _nv, _rows, action, active_dir, back_cb, back_kb;
  let ban_msg, bstate, btn, btn_data, btn_id, c_idx, caption, cdata;
  let check_str, clean_t, coords, custom_kb, display_key, e, fake_query, fake_update;
  let fid, found_orders, fpath, grid, is_banned, is_command, is_kb_button, item_key;
  let item_label, key, keyboard, label, lbl, m, maint_msg, matched_btn;
  let menu_text, msg, msg_key, mtype, o, o_copy, oid, old_name;
  let parent_path, pending_keys, pending_text_input, q, r_idx, raw_fb, row, standard_buttons;
  let status_dot, step, student_name, success, t_id, t_kind, target, text;
  let text_val, under_maint, user, user_id;
  user = update.effective_user;
  if (pyT((!pyT(user)))) {
      return;
  }
  [under_maint, maint_msg] = check_maintenance(user.id);
  if (pyT(under_maint)) {
      if (pyT(update.message)) {
            void ((await update.message.reply_text(maint_msg, { parse_mode: "Markdown" })));
      }
      return;
  }
  [is_banned, ban_msg] = check_banned(user.id);
  if (pyT(is_banned)) {
      if (pyT(update.message)) {
            void ((await update.message.reply_text(ban_msg, { parse_mode: "Markdown" })));
      }
      return;
  }
  msg = update.message;
  text = (pyT((((__v0) => (pyT(__v0) ? (msg.text) : __v0))(msg))) ? (pyStrip(msg.text)) : (""));
  caption = (pyT((((__v1) => (pyT(__v1) ? (msg.caption) : __v1))(msg))) ? (pyStrip(msg.caption)) : (""));
  user_id = update.effective_user.id;
  check_str = pyLower(pyStrip((((__v2) => (pyT(__v2) ? __v2 : (caption)))(text))));
  if (pyT((pyContains(["/cancel", "cancel", "বাতিল", "❌ cancel", "abort", "/stop"], check_str)))) {
      void ((await cancel_cmd(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_add_subcat"))) {
      void ((await handle_admin_subcategory_creation(update, context)));
      return;
  }
  pending_text_input = (((__v6) => (pyT(__v6) ? __v6 : (((__v5) => (pyT(__v5) ? __v5 : (((__v4) => (pyT(__v4) ? __v4 : (((__v3) => (pyT(__v3) ? __v3 : (pyGet(context.user_data, "awaiting_eb_folder_rename"))))(pyGet(context.user_data, "awaiting_folder_rename")))))(pyGet(context.user_data, "admin_add_eb_subcat")))))(pyGet(context.user_data, "admin_add_subcat")))))(pyGet(context.user_data, "admin_add_category")));
  if (pyT((((__v7) => (pyT(__v7) ? ((!pyT(pending_text_input))) : __v7))(text)))) {
      is_command = pyStart(text, "/");
      is_kb_button = false;
      menu_text = _strip_color_dot(text);
      standard_buttons = ["🛍️ Cart", "👤 Profile", "ℹ Info", "⚙ Admin Panel", "« Back", "⬅️Back", "⚜️ HOME"];
      if (pyT((pyContains(standard_buttons, menu_text)))) {
            is_kb_button = true;
      }
      if (pyT((!pyT(is_kb_button)))) {
            try {
                    custom_kb = db.get_custom_keyboards();
                    for (const row of pyIter(pyGet(custom_kb, "buttons", []))) {
                              for (const btn of pyIter(row)) {
                                          if (pyT((pyEq(pyGet(btn, "text"), menu_text)))) {
                                                        is_kb_button = true;
                                                        break;
                                          }
                              }
                              if (pyT(is_kb_button)) {
                                          break;
                              }
                    }
            } catch (__e) {
            }
      }
      if (pyT((((__v8) => (pyT(__v8) ? __v8 : (is_kb_button)))(is_command)))) {
            pending_keys = ["admin_add_kb_step", "admin_edit_kb_step", "admin_add_course", "admin_add_ebook", "admin_edit_ebook_field", "admin_edit_field", "admin_add_category", "admin_add_subcat", "admin_add_eb_subcat", "awaiting_folder_rename", "rename_folder_old", "rename_folder_parent", "awaiting_eb_folder_rename", "rename_eb_folder_old", "rename_eb_folder_parent", "cut_course_id", "last_wizard_msg_id", "admin_add_coupon_wizard", "admin_pay_step", "admin_msg_edit_key", "admin_user_step", "admin_broadcasting_step", "withdraw_step", "awaiting_coupon", "awaiting_trxid", "admin_order_search_step", "withdraw_prompt_ids", "admin_welcome_media_wait", "admin_info_media_wait", "admin_folder_header_text_wait", "admin_folder_header_media_wait", "admin_eb_folder_header_text_wait", "admin_eb_folder_header_media_wait", "admin_eblib_header_text_wait", "admin_eblib_header_media_wait", "admin_catlib_header_text_wait", "admin_catlib_header_media_wait", "admin_cart_media_wait", "admin_wdr_min_step", "admin_add_infobtn_step", "admin_add_infobtn_data", "admin_info_header_key", "admin_info_media_target", "admin_cinfo_label_id", "admin_cinfo_desc_id", "admin_cinfo_header_id", "admin_btncolor_cat", "admin_fallback_text", "admin_fallback_btn", "admin_customcolor"];
            for (const key of pyIter(pending_keys)) {
                    pyPop(context.user_data, key, null);
            }
      }
  }
  if (pyT(pyGet(context.user_data, "admin_eb_folder_header_text_wait"))) {
      fpath = pyGet(context.user_data, "admin_eb_folder_header_text_wait", "");
      pyPop(context.user_data, "admin_eb_folder_header_text_wait", null);
      db.set_ebook_folder_header_text(fpath, text);
      void ((await update.message.reply_text("✅ Header text saved!", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🖼️ Header Settings", { callback_data: "adm_ebfld_header" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_eblib_header_text_wait"))) {
      pyPop(context.user_data, "admin_eblib_header_text_wait", null);
      db.set_setting("ebook_library_header_text", text);
      void ((await update.message.reply_text("✅ Library title saved!", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🖼️ Library Header", { callback_data: "adm_eblib_header" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_eblib_header_media_wait"))) {
      m = update.message;
      fid = "";
      mtype = "";
      if (pyT(m.photo)) {
            fid = pySub(m.photo, (-(1))).file_id;
            mtype = "photo";
      } else if (pyT(m.animation)) {
            fid = m.animation.file_id;
            mtype = "animation";
      } else if (pyT((((__v10) => (pyT(__v10) ? (pyStart((((__v9) => (pyT(__v9) ? __v9 : ("")))(m.document.mime_type)), "image/gif")) : __v10))(m.document)))) {
            fid = m.document.file_id;
            mtype = "animation";
      } else if (pyT((((__v12) => (pyT(__v12) ? (pyStart((((__v11) => (pyT(__v11) ? __v11 : ("")))(m.document.mime_type)), "image/")) : __v12))(m.document)))) {
            fid = m.document.file_id;
            mtype = "photo";
      }
      if (pyT((!pyT(fid)))) {
            void ((await update.message.reply_text("⚠️ Photo বা GIF পাঠান (image/gif)।\n❌ বাতিল করতে /cancel লিখুন।", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_eblib_header" })]]) })));
            return;
      }
      pyPop(context.user_data, "admin_eblib_header_media_wait", null);
      db.set_setting("ebook_library_media_type", mtype);
      db.set_setting("ebook_library_media_file_id", fid);
      label = (pyT((pyEq(mtype, "photo"))) ? ("Photo 🖼️") : ("GIF 🎞️"));
      void ((await update.message.reply_text(`✅ ${pyStr(label)} সেভ হয়েছে! এখন Library screen ছবিসহ দেখাবে।`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🖼️ Library Header", { callback_data: "adm_eblib_header" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_catlib_header_text_wait"))) {
      pyPop(context.user_data, "admin_catlib_header_text_wait", null);
      db.set_setting("category_library_header_text", text);
      void ((await update.message.reply_text("✅ Category title saved!", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🖼️ Category Header", { callback_data: "adm_catlib_header" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_catlib_header_media_wait"))) {
      m = update.message;
      fid = "";
      mtype = "";
      if (pyT(m.photo)) {
            fid = pySub(m.photo, (-(1))).file_id;
            mtype = "photo";
      } else if (pyT(m.animation)) {
            fid = m.animation.file_id;
            mtype = "animation";
      } else if (pyT((((__v14) => (pyT(__v14) ? (pyStart((((__v13) => (pyT(__v13) ? __v13 : ("")))(m.document.mime_type)), "image/gif")) : __v14))(m.document)))) {
            fid = m.document.file_id;
            mtype = "animation";
      } else if (pyT((((__v16) => (pyT(__v16) ? (pyStart((((__v15) => (pyT(__v15) ? __v15 : ("")))(m.document.mime_type)), "image/")) : __v16))(m.document)))) {
            fid = m.document.file_id;
            mtype = "photo";
      }
      if (pyT((!pyT(fid)))) {
            void ((await update.message.reply_text("⚠️ Photo বা GIF পাঠান (image/gif)।\n❌ বাতিল করতে /cancel লিখুন।", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_catlib_header" })]]) })));
            return;
      }
      pyPop(context.user_data, "admin_catlib_header_media_wait", null);
      db.set_setting("category_library_media_type", mtype);
      db.set_setting("category_library_media_file_id", fid);
      label = (pyT((pyEq(mtype, "photo"))) ? ("Photo 🖼️") : ("GIF 🎞️"));
      void ((await update.message.reply_text(`✅ ${pyStr(label)} সেভ হয়েছে! এখন Category screen ছবিসহ দেখাবে।`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🖼️ Category Header", { callback_data: "adm_catlib_header" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_cart_media_wait"))) {
      m = update.message;
      fid = "";
      mtype = "";
      if (pyT(m.photo)) {
            fid = pySub(m.photo, (-(1))).file_id;
            mtype = "photo";
      } else if (pyT(m.animation)) {
            fid = m.animation.file_id;
            mtype = "animation";
      } else if (pyT((((__v18) => (pyT(__v18) ? (pyStart((((__v17) => (pyT(__v17) ? __v17 : ("")))(m.document.mime_type)), "image/gif")) : __v18))(m.document)))) {
            fid = m.document.file_id;
            mtype = "animation";
      } else if (pyT((((__v20) => (pyT(__v20) ? (pyStart((((__v19) => (pyT(__v19) ? __v19 : ("")))(m.document.mime_type)), "image/")) : __v20))(m.document)))) {
            fid = m.document.file_id;
            mtype = "photo";
      }
      if (pyT((!pyT(fid)))) {
            void ((await update.message.reply_text("⚠️ Photo বা GIF পাঠান (image/gif)।\n❌ বাতিল করতে /cancel লিখুন।", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_cart_settings" })]]) })));
            return;
      }
      pyPop(context.user_data, "admin_cart_media_wait", null);
      db.set_setting("cart_media_type", mtype);
      db.set_setting("cart_media_file_id", fid);
      label = (pyT((pyEq(mtype, "photo"))) ? ("Photo 🖼️") : ("GIF 🎞️"));
      void ((await update.message.reply_text(`✅ ${pyStr(label)} সেভ হয়েছে! এখন Cart screen ছবিসহ দেখাবে।`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🛒 Cart Settings", { callback_data: "adm_cart_settings" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_eb_folder_header_media_wait"))) {
      fpath = pyGet(context.user_data, "admin_eb_folder_header_media_wait", "");
      m = update.message;
      fid = "";
      mtype = "";
      if (pyT(m.photo)) {
            fid = pySub(m.photo, (-(1))).file_id;
            mtype = "photo";
      } else if (pyT(m.animation)) {
            fid = m.animation.file_id;
            mtype = "animation";
      } else if (pyT((((__v22) => (pyT(__v22) ? (pyStart((((__v21) => (pyT(__v21) ? __v21 : ("")))(m.document.mime_type)), "image/gif")) : __v22))(m.document)))) {
            fid = m.document.file_id;
            mtype = "animation";
      } else if (pyT((((__v24) => (pyT(__v24) ? (pyStart((((__v23) => (pyT(__v23) ? __v23 : ("")))(m.document.mime_type)), "image/")) : __v24))(m.document)))) {
            fid = m.document.file_id;
            mtype = "photo";
      }
      if (pyT((!pyT(fid)))) {
            context.user_data["admin_eb_folder_header_media_wait"] = fpath;
            void ((await update.message.reply_text("⚠️ Photo বা GIF পাঠান (image/gif)।\n❌ বাতিল করতে /cancel লিখুন।", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebfld_header" })]]) })));
            return;
      }
      pyPop(context.user_data, "admin_eb_folder_header_media_wait", null);
      db.set_ebook_folder_header_media(fpath, mtype, fid);
      label = (pyT((pyEq(mtype, "photo"))) ? ("Photo 🖼️") : ("GIF 🎞️"));
      void ((await update.message.reply_text(`✅ ${pyStr(label)} সেভ হয়েছে!`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🖼️ Header Settings", { callback_data: "adm_ebfld_header" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_folder_header_text_wait"))) {
      fpath = pyGet(context.user_data, "admin_folder_header_text_wait", "");
      pyPop(context.user_data, "admin_folder_header_text_wait", null);
      db.set_folder_header_text(fpath, text);
      void ((await update.message.reply_text("✅ Header text saved!", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🖼️ Header Settings", { callback_data: "adm_fld_header" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_folder_header_media_wait"))) {
      fpath = pyGet(context.user_data, "admin_folder_header_media_wait", "");
      m = update.message;
      fid = "";
      mtype = "";
      if (pyT(m.photo)) {
            fid = pySub(m.photo, (-(1))).file_id;
            mtype = "photo";
      } else if (pyT(m.animation)) {
            fid = m.animation.file_id;
            mtype = "animation";
      } else if (pyT((((__v26) => (pyT(__v26) ? (pyStart((((__v25) => (pyT(__v25) ? __v25 : ("")))(m.document.mime_type)), "image/gif")) : __v26))(m.document)))) {
            fid = m.document.file_id;
            mtype = "animation";
      } else if (pyT((((__v28) => (pyT(__v28) ? (pyStart((((__v27) => (pyT(__v27) ? __v27 : ("")))(m.document.mime_type)), "image/")) : __v28))(m.document)))) {
            fid = m.document.file_id;
            mtype = "photo";
      }
      if (pyT((!pyT(fid)))) {
            context.user_data["admin_folder_header_media_wait"] = fpath;
            void ((await update.message.reply_text("⚠️ Photo বা GIF পাঠান (image/gif)।\n❌ বাতিল করতে /cancel লিখুন।", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_fld_header" })]]) })));
            return;
      }
      pyPop(context.user_data, "admin_folder_header_media_wait", null);
      db.set_folder_header_media(fpath, mtype, fid);
      label = (pyT((pyEq(mtype, "photo"))) ? ("Photo 🖼️") : ("GIF 🎞️"));
      void ((await update.message.reply_text(`✅ ${pyStr(label)} সেভ হয়েছে!`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🖼️ Header Settings", { callback_data: "adm_fld_header" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_info_media_wait"))) {
      m = update.message;
      fid = "";
      mtype = "";
      if (pyT(m.photo)) {
            fid = pySub(m.photo, (-(1))).file_id;
            mtype = "photo";
      } else if (pyT(m.animation)) {
            fid = m.animation.file_id;
            mtype = "animation";
      } else if (pyT((((__v30) => (pyT(__v30) ? (pyStart((((__v29) => (pyT(__v29) ? __v29 : ("")))(m.document.mime_type)), "image/gif")) : __v30))(m.document)))) {
            fid = m.document.file_id;
            mtype = "animation";
      } else if (pyT((((__v32) => (pyT(__v32) ? (pyStart((((__v31) => (pyT(__v31) ? __v31 : ("")))(m.document.mime_type)), "image/")) : __v32))(m.document)))) {
            fid = m.document.file_id;
            mtype = "photo";
      }
      if (pyT((!pyT(fid)))) {
            void ((await update.message.reply_text("⚠️ Photo বা GIF পাঠান (image/gif)।\n❌ বাতিল করতে /cancel লিখুন।", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_info_buttons" })]]) })));
            return;
      }
      db.set_info_header_media(mtype, fid);
      pyPop(context.user_data, "admin_info_media_wait", null);
      label = (pyT((pyEq(mtype, "photo"))) ? ("Photo 🖼️") : ("GIF 🎞️"));
      void ((await update.message.reply_text(`✅ ${pyStr(label)} সেভ হয়েছে! এখন Info menu সুন্দর করে ছবিসহ দেখাবে।`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("ℹ️ Info Button Settings", { callback_data: "adm_info_buttons" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_info_media_target"))) {
      target = (((__v33) => (pyT(__v33) ? __v33 : ({  })))(pyGet(context.user_data, "admin_info_media_target")));
      t_kind = pyGet(target, "kind");
      t_id = pyGet(target, "id", "");
      if (pyT((pyEq(t_kind, "item")))) {
            back_cb = `adm_infoitem_${pyStr(t_id)}`;
      } else if (pyT((pyEq(t_kind, "custom")))) {
            back_cb = `adm_cinfo_edit_${pyStr(t_id)}`;
      } else {
            back_cb = "adm_info_buttons";
      }
      m = update.message;
      _mt = (pyT((((__v34) => (pyT(__v34) ? (m.text) : __v34))(m))) ? (pyStrip((((__v35) => (pyT(__v35) ? __v35 : ("")))(m.text)))) : (""));
      if (pyT((((__v36) => (pyT(__v36) ? __v36 : ((pyEq(pyLower(_mt), "cancel")))))((pyEq(_mt, "/cancel")))))) {
            pyPop(context.user_data, "admin_info_media_target", null);
            void ((await update.message.reply_text("✕ Media upload cancelled.", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: back_cb })]]) })));
            return;
      }
      fid = "";
      mtype = "";
      if (pyT(m.photo)) {
            fid = pySub(m.photo, (-(1))).file_id;
            mtype = "photo";
      } else if (pyT(m.animation)) {
            fid = m.animation.file_id;
            mtype = "animation";
      } else if (pyT((((__v38) => (pyT(__v38) ? (pyStart((((__v37) => (pyT(__v37) ? __v37 : ("")))(m.document.mime_type)), "image/gif")) : __v38))(m.document)))) {
            fid = m.document.file_id;
            mtype = "animation";
      } else if (pyT((((__v40) => (pyT(__v40) ? (pyStart((((__v39) => (pyT(__v39) ? __v39 : ("")))(m.document.mime_type)), "image/")) : __v40))(m.document)))) {
            fid = m.document.file_id;
            mtype = "photo";
      }
      if (pyT((!pyT(fid)))) {
            void ((await update.message.reply_text("⚠️ Photo বা GIF পাঠান (image/gif)।\n❌ বাতিল করতে /cancel লিখুন।", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: back_cb })]]) })));
            return;
      }
      pyPop(context.user_data, "admin_info_media_target", null);
      if (pyT((pyEq(t_kind, "custom")))) {
            db.update_custom_info_button(t_id, { media_type: mtype, media_file_id: fid });
      } else {
            db.update_info_item(t_id, { media_type: mtype, media_file_id: fid });
      }
      label = (pyT((pyEq(mtype, "photo"))) ? ("Photo 🖼️") : ("GIF 🎞️"));
      void ((await update.message.reply_text(`✅ ${pyStr(label)} সেভ হয়েছে! এখন এই বাটনের detail ছবিসহ দেখাবে।`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: back_cb })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_welcome_media_wait"))) {
      m = update.message;
      fid = "";
      mtype = "";
      if (pyT(m.photo)) {
            fid = pySub(m.photo, (-(1))).file_id;
            mtype = "photo";
      } else if (pyT(m.animation)) {
            fid = m.animation.file_id;
            mtype = "animation";
      } else if (pyT((((__v42) => (pyT(__v42) ? (pyStart((((__v41) => (pyT(__v41) ? __v41 : ("")))(m.document.mime_type)), "image/gif")) : __v42))(m.document)))) {
            fid = m.document.file_id;
            mtype = "animation";
      } else if (pyT((((__v44) => (pyT(__v44) ? (pyStart((((__v43) => (pyT(__v43) ? __v43 : ("")))(m.document.mime_type)), "image/")) : __v44))(m.document)))) {
            fid = m.document.file_id;
            mtype = "photo";
      }
      if (pyT((!pyT(fid)))) {
            void ((await update.message.reply_text("⚠️ Photo বা GIF পাঠান (image/gif)।\n❌ বাতিল করতে /cancel লিখুন।", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Back to Welcome Msg", { callback_data: "adm_editmsg_welcome_message" })]]) })));
            return;
      }
      db.set_setting("welcome_media_type", mtype);
      db.set_setting("welcome_media_file_id", fid);
      pyPop(context.user_data, "admin_welcome_media_wait", null);
      label = (pyT((pyEq(mtype, "photo"))) ? ("Photo 🖼️") : ("GIF 🎞️"));
      void ((await update.message.reply_text(`✅ ${pyStr(label)} সেভ হয়েছে! এখন /start দিলে welcome text-এর সাথে যাবে।`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("👋 Back to Welcome Msg", { callback_data: "adm_editmsg_welcome_message" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_add_kb_step"))) {
      void ((await handle_admin_kb_add_input(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_edit_kb_step"))) {
      void ((await handle_admin_kb_edit_input(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_add_course"))) {
      void ((await handle_admin_course_creation(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_add_ebook"))) {
      void ((await handle_admin_ebook_creation(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_edit_ebook_field"))) {
      void ((await handle_admin_ebook_edit_input(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_edit_field"))) {
      void ((await handle_admin_course_edit_input(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_add_category"))) {
      void ((await handle_admin_category_creation(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_add_subcat"))) {
      void ((await handle_admin_subcategory_creation(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_add_eb_subcat"))) {
      void ((await handle_admin_ebook_subcategory_creation(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "awaiting_folder_rename"))) {
      text = pyStrip(update.message.text);
      if (pyT((pyEq(text, "/cancel")))) {
            pyPop(context.user_data, "awaiting_folder_rename", null);
            pyPop(context.user_data, "rename_folder_old", null);
            pyPop(context.user_data, "rename_folder_parent", null);
            void ((await update.message.reply_text("✕ Rename cancelled.", { reply_markup: main_menu_keyboard(user_id) })));
            return;
      }
      old_name = pyGet(context.user_data, "rename_folder_old", "");
      parent_path = pyGet(context.user_data, "rename_folder_parent", "");
      success = db.rename_folder(parent_path, old_name, text);
      pyPop(context.user_data, "awaiting_folder_rename", null);
      pyPop(context.user_data, "rename_folder_old", null);
      pyPop(context.user_data, "rename_folder_parent", null);
      if (pyT(success)) {
            active_dir = (pyT(parent_path) ? (((parent_path + " > ") + text)) : (text));
            void ((await update.message.reply_text(`✅ Renamed to '${pyStr(text)}'!`, { reply_markup: main_menu_keyboard(user_id) })));
            // from-import elided
                  class FakeQ {
                          constructor(msg) {
                                    this.message = msg;
                                    this.data = ("adm_dir_" + active_dir);
                                    this.from_user = update.effective_user;
                                    this.id = "0";
                          }
                          async answer(...__args) {
                          }
                          async edit_message_text(...__args) {
                                    return ((await this.message.reply_text(...__args)));
                          }
                  }
            void ((await render_admin_folder_directory(FakeQ(update.message), context, active_dir)));
      } else {
            void ((await update.message.reply_text("❌ Rename failed. Name may already exist.", { reply_markup: main_menu_keyboard(user_id) })));
      }
      return;
  }
  if (pyT(pyGet(context.user_data, "awaiting_eb_folder_rename"))) {
      text = pyStrip(update.message.text);
      if (pyT((pyEq(text, "/cancel")))) {
            pyPop(context.user_data, "awaiting_eb_folder_rename", null);
            pyPop(context.user_data, "rename_eb_folder_old", null);
            pyPop(context.user_data, "rename_eb_folder_parent", null);
            void ((await update.message.reply_text("✕ Rename cancelled.", { reply_markup: main_menu_keyboard(user_id) })));
            return;
      }
      old_name = pyGet(context.user_data, "rename_eb_folder_old", "");
      parent_path = pyGet(context.user_data, "rename_eb_folder_parent", "");
      success = db.rename_ebook_folder(parent_path, old_name, text);
      pyPop(context.user_data, "awaiting_eb_folder_rename", null);
      pyPop(context.user_data, "rename_eb_folder_old", null);
      pyPop(context.user_data, "rename_eb_folder_parent", null);
      if (pyT(success)) {
            active_dir = (pyT(parent_path) ? (((parent_path + " > ") + text)) : (text));
            void ((await update.message.reply_text(`✅ Renamed to '${pyStr(text)}'!`, { reply_markup: main_menu_keyboard(user_id) })));
                  class FakeEBQ {
                          constructor(msg) {
                                    this.message = msg;
                                    this.data = ("adm_ebdir_" + active_dir);
                                    this.from_user = update.effective_user;
                                    this.id = "0";
                          }
                          async answer(...__args) {
                          }
                          async edit_message_text(...__args) {
                                    return ((await this.message.reply_text(...__args)));
                          }
                  }
            void ((await render_admin_ebook_folder_directory(FakeEBQ(update.message), context, active_dir)));
      } else {
            void ((await update.message.reply_text("❌ Rename failed. Name may already exist.", { reply_markup: main_menu_keyboard(user_id) })));
      }
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_add_coupon_wizard"))) {
      void ((await handle_admin_coupon_creation_wizard(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_pay_step"))) {
      void ((await handle_admin_payment_input(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_edit_infoitem_key"))) {
      item_key = pyPop(context.user_data, "admin_edit_infoitem_key");
      if (pyT((((__v45) => (pyT(__v45) ? __v45 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
            back_kb = [[InlineKeyboardButton("« Back to Section", { callback_data: `adm_infoitem_${pyStr(item_key)}` })]];
            void ((await update.message.reply_text("✕ Editing cancelled.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
            return;
      }
      db.update_info_item(item_key, { content: text });
      if (pyT((pyEq(item_key, "contact")))) {
            db.set_setting("support_message", text);
      }
      item_label = (((__v46) => (pyT(__v46) ? __v46 : (item_key)))(pyGet(pyGet(pyGet(db.get_info_settings(), "items", {  }), item_key, {  }), "label")));
      keyboard = [[InlineKeyboardButton(`🔍 View ${pyStr(item_label)}`, { callback_data: `adm_infoitem_${pyStr(item_key)}` })], [InlineKeyboardButton("ℹ️ Info Button Settings", { callback_data: "adm_info_buttons" })]];
      void ((await update.message.reply_text(`✅ Description for '<b>${pyStr(pyHtmlEscape(item_label))}</b>' updated successfully!`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_info_header_key"))) {
      item_key = pyPop(context.user_data, "admin_info_header_key");
      if (pyT((((__v47) => (pyT(__v47) ? __v47 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
            back_kb = [[InlineKeyboardButton("⬅️Back", { callback_data: `adm_infoitem_${pyStr(item_key)}` })]];
            void ((await update.message.reply_text("✕ Editing cancelled.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
            return;
      }
      db.update_info_item(item_key, { header: text });
      item_label = (((__v48) => (pyT(__v48) ? __v48 : (item_key)))(pyGet(pyGet(pyGet(db.get_info_settings(), "items", {  }), item_key, {  }), "label")));
      keyboard = [[InlineKeyboardButton(`🔍 View ${pyStr(item_label)}`, { callback_data: `adm_infoitem_${pyStr(item_key)}` })], [InlineKeyboardButton("ℹ️ Info Button Settings", { callback_data: "adm_info_buttons" })]];
      void ((await update.message.reply_text(`✅ Header text for '<b>${pyStr(pyHtmlEscape(item_label))}</b>' updated successfully!`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_cinfo_label_id"))) {
      btn_id = pyPop(context.user_data, "admin_cinfo_label_id");
      if (pyT((((__v49) => (pyT(__v49) ? __v49 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
            back_kb = [[InlineKeyboardButton("⬅️Back", { callback_data: `adm_cinfo_edit_${pyStr(btn_id)}` })]];
            void ((await update.message.reply_text("✕ Editing cancelled.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
            return;
      }
      db.update_custom_info_button(btn_id, { label: text });
      keyboard = [[InlineKeyboardButton("✏️ Edit Button", { callback_data: `adm_cinfo_edit_${pyStr(btn_id)}` })], [InlineKeyboardButton("ℹ️ Info Button Settings", { callback_data: "adm_info_buttons" })]];
      void ((await update.message.reply_text("✅ Button label updated successfully!", { reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_cinfo_desc_id"))) {
      btn_id = pyPop(context.user_data, "admin_cinfo_desc_id");
      if (pyT((((__v50) => (pyT(__v50) ? __v50 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
            back_kb = [[InlineKeyboardButton("⬅️Back", { callback_data: `adm_cinfo_edit_${pyStr(btn_id)}` })]];
            void ((await update.message.reply_text("✕ Editing cancelled.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
            return;
      }
      db.update_custom_info_button(btn_id, { content: text });
      keyboard = [[InlineKeyboardButton("✏️ Edit Button", { callback_data: `adm_cinfo_edit_${pyStr(btn_id)}` })], [InlineKeyboardButton("ℹ️ Info Button Settings", { callback_data: "adm_info_buttons" })]];
      void ((await update.message.reply_text("✅ Button description updated successfully!", { reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_cinfo_header_id"))) {
      btn_id = pyPop(context.user_data, "admin_cinfo_header_id");
      if (pyT((((__v51) => (pyT(__v51) ? __v51 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
            back_kb = [[InlineKeyboardButton("⬅️Back", { callback_data: `adm_cinfo_edit_${pyStr(btn_id)}` })]];
            void ((await update.message.reply_text("✕ Editing cancelled.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
            return;
      }
      db.update_custom_info_button(btn_id, { header: text });
      keyboard = [[InlineKeyboardButton("✏️ Edit Button", { callback_data: `adm_cinfo_edit_${pyStr(btn_id)}` })], [InlineKeyboardButton("ℹ️ Info Button Settings", { callback_data: "adm_info_buttons" })]];
      void ((await update.message.reply_text("✅ Button header text updated successfully!", { reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_fallback_text"))) {
      if (pyT((((__v52) => (pyT(__v52) ? __v52 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
            pyPop(context.user_data, "admin_fallback_text", null);
            back_kb = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_fallback_mgr" })]];
            void ((await update.message.reply_text("✕ Editing cancelled.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
            return;
      }
      if (pyT((!pyT(pyStrip(text))))) {
            void ((await update.message.reply_text("⚠️ Text লিখে পাঠান:")));
            return;
      }
      pyPop(context.user_data, "admin_fallback_text", null);
      raw_fb = (((__v53) => (pyT(__v53) ? __v53 : ("")))(db.get_setting("fallback_message", "")));
      [_body, _rows] = split_fallback_buttons((pyT(pyStrip(raw_fb)) ? (raw_fb) : (get_fallback_template_text())));
      db.set_setting("fallback_message", build_fallback_text(text, _rows));
      keyboard = [[InlineKeyboardButton("🔄 Fallback Manager", { callback_data: "adm_fallback_mgr" })]];
      void ((await update.message.reply_text("✅ Fallback text updated! (buttons unchanged)", { reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_fallback_btn"))) {
      bstate = (((__v54) => (pyT(__v54) ? __v54 : ({  })))(pyGet(context.user_data, "admin_fallback_btn")));
      if (pyT((((__v55) => (pyT(__v55) ? __v55 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
            pyPop(context.user_data, "admin_fallback_btn", null);
            back_kb = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_fallback_mgr" })]];
            void ((await update.message.reply_text("✕ Cancelled.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
            return;
      }
      if (pyT((pyEq(pyGet(bstate, "step"), "label")))) {
            if (pyT((!pyT(pyStrip(text))))) {
                    void ((await update.message.reply_text("⚠️ Button-এর নাম লিখে পাঠান:")));
                    return;
            }
            bstate["label"] = pyStrip(text);
            bstate["step"] = "target";
            context.user_data["admin_fallback_btn"] = bstate;
            void ((await update.message.reply_text("➕ <b>Add Button — Step 2/2: Target</b>\n━━━━━━━━━━━━━━━━━━━━\n\n✍️ <b>URL</b> (e.g. <code>https://t.me/username</code>) অথবা <b>callback</b> (e.g. <code>browse_categories</code>) লিখে পাঠান:\n\nType /cancel to abort.", { parse_mode: "HTML" })));
            return;
      }
      if (pyT((!pyT(pyStrip(text))))) {
            void ((await update.message.reply_text("⚠️ URL বা callback লিখে পাঠান:")));
            return;
      }
      pyPop(context.user_data, "admin_fallback_btn", null);
      raw_fb = (((__v56) => (pyT(__v56) ? __v56 : ("")))(db.get_setting("fallback_message", "")));
      [_body, _rows] = split_fallback_buttons((pyT(pyStrip(raw_fb)) ? (raw_fb) : (get_fallback_template_text())));
      pyAppend(_rows, [[pyGet(bstate, "label", "Button"), pyStrip(text)]]);
      db.set_setting("fallback_message", build_fallback_text(_body, _rows));
      keyboard = [[InlineKeyboardButton("🔄 Fallback Manager", { callback_data: "adm_fallback_mgr" })]];
      void ((await update.message.reply_text(`✅ Button '<b>${pyStr(pyHtmlEscape(pyGet(bstate, "label", "")))}</b>' added!`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_customcolor"))) {
      cdata = (((__v57) => (pyT(__v57) ? __v57 : ({  })))(pyGet(context.user_data, "admin_customcolor")));
      if (pyT((((__v58) => (pyT(__v58) ? __v58 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
            pyPop(context.user_data, "admin_customcolor", null);
            back_kb = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_btncolor_customs" })]];
            void ((await update.message.reply_text("✕ Cancelled.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
            return;
      }
      if (pyT((!pyT(pyStrip(text))))) {
            void ((await update.message.reply_text("⚠️ Button-এর নাম লিখে পাঠান:")));
            return;
      }
      cdata["name"] = pyStrip(text);
      context.user_data["admin_customcolor"] = cdata;
      void ((await update.message.reply_text(`✏️ <b>Custom Button Color — Step 2/2: Color</b> for <code>${pyStr(pyHtmlEscape(pySlice(pyStrip(text), null, 40, null)))}</code> 👇`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🔵 Blue", { callback_data: "adm_btncolor_cpick_primary" })], [InlineKeyboardButton("🟢 Green", { callback_data: "adm_btncolor_cpick_success" })], [InlineKeyboardButton("🔴 Red", { callback_data: "adm_btncolor_cpick_danger" })]]) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_msg_edit_key"))) {
      msg_key = pyPop(context.user_data, "admin_msg_edit_key");
      if (pyT((((__v59) => (pyT(__v59) ? __v59 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
            back_kb = [[InlineKeyboardButton("⚙️ Bot Settings", { callback_data: "adm_bot_settings" })]];
            void ((await update.message.reply_text("✕ Cancelled.", { reply_markup: InlineKeyboardMarkup(back_kb) })));
            return;
      }
      db.set_setting(msg_key, text);
      if (pyT((pyEq(msg_key, "info_message")))) {
            db.set_info_header_text(text);
      }
      if (pyT((pyEq(msg_key, "bot_description")))) {
            try {
                    void ((await context.bot.set_my_description({ description: text })));
            } catch (e) {
                    logger.error(`Failed to update bot description on Telegram: ${pyStr(e)}`);
            }
      }
      display_key = pyTitle(pyReplace(msg_key, "_", " "));
      back_kb = [[InlineKeyboardButton("⚙️ Bot Settings", { callback_data: "adm_bot_settings" })], [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]];
      if (pyT(pyStart(msg_key, "delivery_"))) {
            pyInsert(back_kb, 0, [InlineKeyboardButton("📦 Delivery Settings", { callback_data: "adm_editmsg_delivery_message" })]);
      }
      if (pyT(pyStart(msg_key, "cart_"))) {
            pyInsert(back_kb, 0, [InlineKeyboardButton("🛒 Cart Settings", { callback_data: "adm_cart_settings" })]);
      }
      void ((await update.message.reply_text(`✅ **${pyStr(display_key)} updated successfully!**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(back_kb) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_wdr_min_step"))) {
      pyPop(context.user_data, "admin_wdr_min_step", null);
      try {
            _nv = pyInt(pyStrip((((__v60) => (pyT(__v60) ? __v60 : ("")))(text))));
      } catch (__e) {
            _nv = 0;
      }
      if (pyT(((_nv > 0)))) {
            db.set_min_withdraw_amount(_nv);
            void ((await update.message.reply_text(`✅ Minimum withdraw limit → ৳${pyStr(_nv)}!`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⚙️ Bot Settings", { callback_data: "adm_bot_settings" })]]) })));
      } else {
            void ((await update.message.reply_text("⚠️ সঠিক সংখ্যা লিখুন (যেমন: 100):", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_wdr_min" })]]) })));
      }
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_add_hbtn_step"))) {
      step = pyGet(context.user_data, "admin_add_hbtn_step");
      if (pyT((((__v61) => (pyT(__v61) ? __v61 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
            pyPop(context.user_data, "admin_add_hbtn_step", null);
            pyPop(context.user_data, "admin_add_hbtn_data", null);
            void ((await update.message.reply_text("✕ Add Button operation cancelled.", { reply_markup: main_menu_keyboard(user_id) })));
            return;
      }
      if (pyT((pyEq(step, "text")))) {
            pySub(context.user_data, "admin_add_hbtn_data")["text"] = text;
            context.user_data["admin_add_hbtn_step"] = "action";
            void ((await update.message.reply_text("✍️ <b>Enter the action (URL link or callback data like my_courses_nav):</b>\n\nType /cancel to abort.", { parse_mode: "HTML" })));
      } else if (pyT((pyEq(step, "action")))) {
            pySub(context.user_data, "admin_add_hbtn_data")["action"] = text;
                  class FakeCallbackQuery {
                          constructor(message) {
                                    this.message = message;
                          }
                          async edit_message_text(text, parse_mode, reply_markup) {
                                    void ((await this.message.reply_text(text, { parse_mode: parse_mode, reply_markup: reply_markup })));
                          }
                  }
            fake_query = new FakeCallbackQuery(update.message);
            void ((await prompt_add_hbtn_row(fake_query, context)));
      } else if (pyT((pyEq(step, "edit_text")))) {
            coords = pyGet(context.user_data, "admin_edit_hbtn_coords");
            if (pyT(coords)) {
                    [r_idx, c_idx] = coords;
                    grid = get_home_keyboard_grid();
                    if (pyT((((__v62) => (pyT(__v62) ? (((c_idx < pyLen(pySub(grid, r_idx))))) : __v62))(((r_idx < pyLen(grid))))))) {
                              pySub(pySub(grid, r_idx), c_idx)["text"] = text;
                              db.set_setting("home_keyboard_grid", grid);
                              pyPop(context.user_data, "admin_add_hbtn_step", null);
                              void ((await update.message.reply_text("✅ Button text updated successfully!")));
                                        class FakeCallbackQuery {
                                                    constructor(message) {
                                                                  this.message = message;
                                                    }
                                                    async edit_message_text(text, parse_mode, reply_markup) {
                                                                  void ((await this.message.reply_text(text, { parse_mode: parse_mode, reply_markup: reply_markup })));
                                                    }
                                        }
                              fake_query = new FakeCallbackQuery(update.message);
                              void ((await render_hbtn_edit_panel(fake_query, context, r_idx, c_idx)));
                    }
            }
      } else if (pyT((pyEq(step, "edit_action")))) {
            coords = pyGet(context.user_data, "admin_edit_hbtn_coords");
            if (pyT(coords)) {
                    [r_idx, c_idx] = coords;
                    grid = get_home_keyboard_grid();
                    if (pyT((((__v63) => (pyT(__v63) ? (((c_idx < pyLen(pySub(grid, r_idx))))) : __v63))(((r_idx < pyLen(grid))))))) {
                              pySub(pySub(grid, r_idx), c_idx)["action"] = text;
                              db.set_setting("home_keyboard_grid", grid);
                              pyPop(context.user_data, "admin_add_hbtn_step", null);
                              void ((await update.message.reply_text("✅ Button action updated successfully!")));
                                        class FakeCallbackQuery {
                                                    constructor(message) {
                                                                  this.message = message;
                                                    }
                                                    async edit_message_text(text, parse_mode, reply_markup) {
                                                                  void ((await this.message.reply_text(text, { parse_mode: parse_mode, reply_markup: reply_markup })));
                                                    }
                                        }
                              fake_query = new FakeCallbackQuery(update.message);
                              void ((await render_hbtn_edit_panel(fake_query, context, r_idx, c_idx)));
                    }
            }
      }
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_add_infobtn_step"))) {
      step = pyGet(context.user_data, "admin_add_infobtn_step");
      if (pyT((((__v64) => (pyT(__v64) ? __v64 : ((pyEq(pyLower(text), "cancel")))))((pyEq(text, "/cancel")))))) {
            pyPop(context.user_data, "admin_add_infobtn_step", null);
            pyPop(context.user_data, "admin_add_infobtn_data", null);
            void ((await update.message.reply_text("✕ Add Info Button cancelled.", { reply_markup: main_menu_keyboard(user_id) })));
            return;
      }
      if (pyT((pyEq(step, "label")))) {
            if (pyT((!pyT(pyGet(context.user_data, "admin_add_infobtn_data"))))) {
                    context.user_data["admin_add_infobtn_data"] = {  };
            }
            pySub(context.user_data, "admin_add_infobtn_data")["label"] = text;
            context.user_data["admin_add_infobtn_step"] = "header";
            void ((await update.message.reply_text("✍️ <b>Enter the header text for this button:</b>\n\n💡 <i>This shows on top (with photo/GIF if you add one), above the description.</i>\n\nType /cancel to abort.", { parse_mode: "HTML" })));
            return;
      } else if (pyT((pyEq(step, "header")))) {
            pySub(context.user_data, "admin_add_infobtn_data")["header"] = text;
            context.user_data["admin_add_infobtn_step"] = "content";
            void ((await update.message.reply_text("✍️ <b>Enter the URL link or text content for this button:</b>\n\n• If you provide a link (e.g. <code>https://t.me/...</code>), it will open as a URL.\n• If you provide text, clicking the button will display your text.\n\nType /cancel to abort.", { parse_mode: "HTML" })));
            return;
      } else if (pyT((pyEq(step, "content")))) {
            btn_data = pyGet(context.user_data, "admin_add_infobtn_data", {  });
            btn_data["content"] = text;
            btn_data["type"] = (pyT((((__v66) => (pyT(__v66) ? __v66 : (((__v65) => (pyT(__v65) ? __v65 : (pyStart(text, "t.me"))))(pyStart(text, "https://")))))(pyStart(text, "http://")))) ? ("url") : ("text"));
            context.user_data["admin_add_infobtn_data"] = btn_data;
            context.user_data["admin_add_infobtn_step"] = "media";
            void ((await update.message.reply_text("🖼️ <b>Send a Photo or GIF for this button</b> (header-এর সাথে দেখাবে):\n\n• এখন একটা <b>Photo/GIF</b> পাঠান, অথবা\n• ছবি ছাড়া রাখতে <b>Skip</b> চাপুন / <code>skip</code> লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⏭️ Skip", { callback_data: "adm_infobtn_skipmedia" })]]) })));
            return;
      } else if (pyT((pyEq(step, "media")))) {
            btn_data = pyPop(context.user_data, "admin_add_infobtn_data", {  });
            pyPop(context.user_data, "admin_add_infobtn_step", null);
            m = update.message;
            [fid, mtype] = ["", "none"];
            _mt = (pyT((((__v67) => (pyT(__v67) ? (m.text) : __v67))(m))) ? (pyStrip((((__v68) => (pyT(__v68) ? __v68 : ("")))(m.text)))) : (""));
            if (pyT(((!pyEq(pyLower(_mt), "skip"))))) {
                    if (pyT(m.photo)) {
                              fid = pySub(m.photo, (-(1))).file_id;
                              mtype = "photo";
                    } else if (pyT(m.animation)) {
                              fid = m.animation.file_id;
                              mtype = "animation";
                    } else if (pyT((((__v70) => (pyT(__v70) ? (pyStart((((__v69) => (pyT(__v69) ? __v69 : ("")))(m.document.mime_type)), "image/gif")) : __v70))(m.document)))) {
                              fid = m.document.file_id;
                              mtype = "animation";
                    } else if (pyT((((__v72) => (pyT(__v72) ? (pyStart((((__v71) => (pyT(__v71) ? __v71 : ("")))(m.document.mime_type)), "image/")) : __v72))(m.document)))) {
                              fid = m.document.file_id;
                              mtype = "photo";
                    }
            }
            if (pyT((((__v73) => (pyT(__v73) ? ((!pyT(fid))) : __v73))(((!pyEq(pyLower(_mt), "skip"))))))) {
                    context.user_data["admin_add_infobtn_data"] = btn_data;
                    context.user_data["admin_add_infobtn_step"] = "media";
                    void ((await update.message.reply_text("⚠️ Photo/GIF পাঠান অথবা <code>skip</code> লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⏭️ Skip", { callback_data: "adm_infobtn_skipmedia" })]]) })));
                    return;
            }
            lbl = pyGet(btn_data, "label", "Info Button");
            db.add_custom_info_button(lbl, pyGet(btn_data, "type", "text"), pyGet(btn_data, "content", ""), { header: pyGet(btn_data, "header", ""), media_type: mtype, media_file_id: fid });
            keyboard = [[InlineKeyboardButton("ℹ️ Info Button Settings", { callback_data: "adm_info_buttons" })]];
            void ((await update.message.reply_text(`✅ Custom Info button '<b>${pyStr(pyHtmlEscape(lbl))}</b>' added successfully!`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
            return;
      }
  }
  if (pyT(pyGet(context.user_data, "admin_user_step"))) {
      void ((await handle_admin_user_mgmt_input(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_order_search_step"))) {
      pyPop(context.user_data, "admin_order_search_step", null);
      text_val = (pyT(update.message.text) ? (pyStrip(update.message.text)) : (""));
      if (pyT((((__v74) => (pyT(__v74) ? __v74 : ((pyEq(pyLower(text_val), "cancel")))))((pyEq(text_val, "/cancel")))))) {
            void ((await update.message.reply_text("✕ Aborted.", { reply_markup: main_menu_keyboard(user_id) })));
            return;
      }
      q = pyLower(text_val);
      found_orders = [];
      for (const [oid, o] of pyIter(pyItems(db.orders))) {
            if (pyT((((__v78) => (pyT(__v78) ? __v78 : (((__v77) => (pyT(__v77) ? __v77 : (((__v76) => (pyT(__v76) ? __v76 : (((__v75) => (pyT(__v75) ? __v75 : ((pyContains(pyLower(pyStr(pyGet(o, "course_name", ""))), q)))))((pyContains(pyLower(pyStr(pyGet(o, "full_name", ""))), q))))))((pyContains(pyLower(pyStr(pyGet(o, "user_id", ""))), q))))))((pyContains(pyLower(pyStr(pyGet(o, "trxid", ""))), q))))))((pyContains(pyLower(oid), q)))))) {
                    o_copy = pyDict(o);
                    o_copy["order_id"] = oid;
                    pyAppend(found_orders, o_copy);
            }
      }
      if (pyT((!pyT(found_orders)))) {
            void ((await update.message.reply_text(`❌ No orders found matching '${pyStr(text_val)}'!`, { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Pending Orders", { callback_data: "adm_pending_orders" })]]) })));
            return;
      }
      keyboard = [];
      for (const o of pyIter(pySlice(found_orders, null, 15, null))) {
            status_dot = (pyT((pyEq(pyGet(o, "status"), "pending"))) ? ("⏳ ") : ((pyT((pyEq(pyGet(o, "status"), "approved"))) ? ("✅ ") : ("❌ "))));
            student_name = (((__v80) => (pyT(__v80) ? __v80 : (((__v79) => (pyT(__v79) ? __v79 : ("Student")))(pyGet(o, "username")))))(pyGet(o, "full_name")));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(status_dot)}${pyStr(format_order_id_display(pySub(o, "order_id")))} — ${pyStr(pySlice(student_name, null, 15, null))} — ${pyStr(pySub(o, "amount"))}৳`, { callback_data: `ordinfo_${pyStr(pySub(o, "order_id"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Pending Orders", { callback_data: "adm_pending_orders" })]);
      void ((await update.message.reply_text(`🔍 **Search Results for '${pyStr(text_val)}' (${pyStr(pyLen(found_orders))} found):**
Click to view details:`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  }
  if (pyT(pyGet(context.user_data, "admin_broadcasting_step"))) {
      void ((await handle_broadcast_input_step(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "withdraw_step"))) {
      void ((await handle_withdraw_input(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "awaiting_coupon"))) {
      void ((await handle_coupon_input(update, context)));
      return;
  }
  if (pyT(pyGet(context.user_data, "awaiting_trxid"))) {
      void ((await handle_trxid_input(update, context)));
      return;
  }
  if (pyT((!pyT(text)))) {
      return;
  }
  menu_text = _strip_color_dot(text);
  custom_kb = db.get_custom_keyboards();
  matched_btn = null;
  for (const row of pyIter(pyGet(custom_kb, "buttons", []))) {
      for (const btn of pyIter(row)) {
            if (pyT((!pyT(pyIsInstance(btn, "dict"))))) {
                    continue;
            }
            if (pyT(((pyGet(btn, "enabled", true) === false)))) {
                    continue;
            }
            if (pyT((pyEq(pyGet(btn, "text"), menu_text)))) {
                    matched_btn = btn;
                    break;
            }
      }
      if (pyT(matched_btn)) {
            break;
      }
  }
  if (pyT(matched_btn)) {
      if (pyT((((__v81) => (pyT(__v81) ? ((!pyT(is_admin(user_id)))) : __v81))(pyGet(matched_btn, "admin_only"))))) {
            void ((await update.message.reply_text("⛔ Access Denied! You are not an admin.")));
            return;
      }
      action = pyGet(matched_btn, "action", "");
      if (pyT((pyEq(action, "cart")))) {
            pyPop(context.user_data, "awaiting_coupon", null);
            pyPop(context.user_data, "applied_coupon", null);
            pyPop(context.user_data, "discounted_price", null);
            pyPop(context.user_data, "coupon_course", null);
            pyPop(context.user_data, "checkout_total", null);
            pyPop(context.user_data, "checkout_courses", null);
            pyPop(context.user_data, "checkout_course_name", null);
            void ((await show_cart(update, context)));
            return;
      } else if (pyT((pyEq(action, "profile")))) {
            void ((await show_profile(update, context)));
            return;
      } else if (pyT((pyEq(action, "info")))) {
            void ((await show_info(update, context)));
            return;
      } else if (pyT((pyEq(action, "admin")))) {
            void ((await admin_cmd(update, context)));
            return;
      } else {
                  class FakeCallbackQuery {
                          constructor(message, data, user) {
                                    this.message = message;
                                    this.data = data;
                                    this.from_user = user;
                                    this.id = "0";
                          }
                          async answer(text, show_alert) {
                          }
                          async edit_message_text(text, ...__args) {
                                    return ((await this.message.reply_text(text, ...__args)));
                          }
                  }
            fake_query = new FakeCallbackQuery(update.message, action, update.effective_user);
                  class FakeUpdate {
                          constructor(message, callback_query) {
                                    this.message = message;
                                    this.callback_query = callback_query;
                                    this.effective_user = callback_query.from_user;
                                    this.effective_chat = message.chat;
                                    this.update_id = 0;
                          }
                  }
            fake_update = new FakeUpdate(update.message, fake_query);
            void ((await handle_callback(fake_update, context)));
            return;
      }
  }
  clean_t = pyLower(pyStrip(pyReplace(pyReplace(pyReplace(pyReplace(pyReplace(pyReplace(pyReplace(pyReplace(pyReplace(pyReplace(_strip_color_dot(text), "⊞", ""), "👤", ""), "ℹ", ""), "⚙", ""), "🛒", ""), "🛍️", ""), "🛍", ""), "+", ""), "⚜️", ""), "⚜", "")));
  if (pyT((pyContains(["cart", "কার্ট", "my cart"], clean_t)))) {
      pyPop(context.user_data, "awaiting_coupon", null);
      pyPop(context.user_data, "applied_coupon", null);
      pyPop(context.user_data, "discounted_price", null);
      pyPop(context.user_data, "coupon_course", null);
      pyPop(context.user_data, "checkout_total", null);
      pyPop(context.user_data, "checkout_courses", null);
      pyPop(context.user_data, "checkout_course_name", null);
      void ((await show_cart(update, context)));
  } else if (pyT((pyContains(["profile", "প্রোফাইল"], clean_t)))) {
      void ((await show_profile(update, context)));
  } else if (pyT((pyContains(["info", "তথ্য ও সাপোর্ট", "তথ্য", "help"], clean_t)))) {
      void ((await show_info(update, context)));
  } else if (pyT((pyContains(["admin panel", "admin"], clean_t)))) {
      void ((await admin_cmd(update, context)));
  } else if (pyT((pyContains(["home", "হোম", "main menu", "menu", "start"], clean_t)))) {
      void ((await start(update, context)));
  } else if (pyT((pyContains(["ssc"], clean_t)))) {
      context.user_data["category"] = "SSC";
      void ((await show_subcategories_message(update, "SSC")));
  } else if (pyT((pyContains(["hsc 28"], clean_t)))) {
      context.user_data["category"] = "HSC 28";
      void ((await show_subcategories_message(update, "HSC 28")));
  } else if (pyT((pyContains(["hsc 27"], clean_t)))) {
      context.user_data["category"] = "HSC 27";
      void ((await show_subcategories_message(update, "HSC 27")));
  } else if (pyT((pyContains(["hsc 26"], clean_t)))) {
      context.user_data["category"] = "HSC 26";
      void ((await show_subcategories_message(update, "HSC 26")));
  } else if (pyT((pyContains(["আমার কোর্সসমূহ", "my courses", "আমার কোর্স"], clean_t)))) {
      void ((await show_my_courses(update, context)));
  } else {
      void ((await auto_search_courses(update, text, context)));
  }
}

