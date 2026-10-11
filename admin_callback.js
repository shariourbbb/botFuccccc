// admin_callback.js — auto-transpiled from bot.py by py2js. Ported 1:1 from the Python source.
import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from "./compat.js";
import { ADMIN_IDS, SUPPORT_USERNAME } from "./config.js";
import { ADMIN_PERMISSION_DEFINITIONS, db } from "./db.js";
import { _ebook_get_files, execute_broadcast, finalize_coupon_creation, get_broadcast_target_selector_text, render_broadcast_target_selector_keyboard, send_admin_ebook_preview, show_broadcast_preview, show_course_edit_dashboard, show_ebook_edit_dashboard } from "./admin_input.js";
import { CART_EMPTY_PRESET_1, CART_EMPTY_PRESET_2, DEFAULT_CART_EMPTY, DEFAULT_CART_HEADER, build_admin_withdrawal_text, build_fallback_text, build_withdrawal_detail_text, check_admin_callback_permission, get_action_select_keyboard, get_admin_dashboard_keyboard, get_all_ebook_folder_paths, get_builtin_actions_keyboard, get_categories_actions_keyboard, get_coupon_scope_desc, get_ebook_folder_actions_keyboard, get_fallback_template_text, get_subcat_category_select_keyboard, get_subcategories_actions_keyboard, prompt_add_kb_row, render_admin_coupon_list, render_admin_ebook_folder_directory, render_admin_folder_directory, render_admin_permission_dashboard, render_admin_referral_user_view, render_admin_referrals_hub, render_admin_referrers_list, render_admin_user_profile, render_btncolor_cats_panel, render_btncolor_custom_panel, render_button_colors_panel, render_button_edit_panel, render_cart_settings_panel, render_category_reorder_panel, render_catlib_header_panel, render_cinfo_editor, render_coupon_course_select_page, render_coupon_ebook_select_page, render_course_groups_panel, render_eblib_header_panel, render_ebook_category_reorder_panel, render_ebook_folder_header_panel, render_fallback_panel, render_folder_header_panel, render_hbtn_edit_panel, render_home_buttons_panel, render_info_buttons_panel, render_info_item_editor, render_kb_color_picker, render_kb_colors_panel, render_kb_del_list, render_kb_position_panel, render_keyboard_settings_panel, render_user_course_access, render_user_ebook_access, show_order_detail, split_fallback_buttons, sync_admin_order_messages, sync_admin_withdrawal_messages } from "./admin_panels.js";
import { BUTTON_COLOR_DEFAULTS, BUTTON_COLOR_GROUPS, BUTTON_STYLE_DOT, BUTTON_STYLE_NAME, DEFAULT_BOT_DESCRIPTION, _expand_callback_data, _msg_has_media, append_course_join_buttons, check_banned, format_order_id_display, get_home_keyboard_grid, get_welcome_media, is_admin, logger, main_menu_keyboard, parse_inline_buttons, send_wizard_step1, start } from "./core.js";
import { browse_ebooks, send_admin_category_selector, send_admin_course_preview, send_admin_group_id_prompt, send_admin_subcategory_selector } from "./screens.js";
import { pyAny, pyAppend, pyContains, pyDel, pyDiv, pyEnd, pyEnumerate, pyEq, pyExtend, pyGet, pyGetAttr, pyHasAttr, pyHtmlEscape, pyIndex, pyInsert, pyInt, pyIsDigit, pyIsInstance, pyItems, pyIter, pyJoin, pyLen, pyList, pyLower, pyMax, pyMin, pyNext, pyNow, pyPartition, pyPop, pyRPartition, pyRSplit, pyRange, pyRemove, pyRepeat, pyReplace, pySetDefault, pySlice, pySplit, pyStart, pyStr, pyStrip, pySub, pySum, pyT, pyTimestamp, pyTitle, pyUpper, pyValues } from "./helpers.js";
import { InlineKeyboardButton } from "./core.js";

export async function handle_admin_callback(update, context) {
  let _, _approved_txt, _bpg, _cancelled_txt, _clbl, _co, _cur, _eb;
  let _ebid, _flat, _fq, _fq2, _icfg, _kb, _pb, _pbtns;
  let _pg, _pub_files_line, _pub_n, _rej_label, _rows, _smid, _wl, _wm_f;
  let _wm_fid, _wm_line, _wm_t, _wm_type, acc, access_links, access_text, act;
  let action, active_count, active_dir, active_fld, added, adm_choice, admin_lines, admin_list;
  let admin_only, admins, aid, all_w, allowed, amt, appr_all, appr_total;
  let b, back, back_page, badge, ban_badge, ban_msg, body, bot_desc_status;
  let btn, btn_action, btn_data, btn_id, btn_text, button, buttons_grid, c;
  let c_btns, c_code, c_fld, c_idx, c_name, c_obj, cancel_data, cat;
  let cat_chosen, cat_name, cat_selected, categories, category, cats, cdata, cfg;
  let checkout_type, choice, cid, cid_chosen, cleaned_delivery, code, cols, confirm_kb;
  let confirm_keyboard, confirm_text, conv_success, coords, coupons, course, course_id, courses;
  let courses_c, cur, cur_bal, cur_bonus, cur_line, cur_note, curr_status, current;
  let current_name, current_val, custom_kb, customs, data, default_delivery, delivery_status, delivery_template;
  let delta, demo_q, dest, df_free_nl, df_free_wl, df_paid_nl, df_paid_wl, dir_path;
  let direction, display_key, done_text, dtype, dtype_s, dval, e, e_obj;
  let eb, eb_id, eb_obj, ebook_id, ebooks, ec, edge, edit_kb;
  let edt_action, eid, eid_chosen, fake_data, fake_query, fallback_status, field, field_labels;
  let flat_buttons, fld, fld_segments, folder_name, folder_path, folder_to_delete, folders, full;
  let g, gid, grid, groups, grp, has_link, hdr, head;
  let help_text, home_btn_enabled, home_btn_status, i, idx, idx_s, ii, inactive_count;
  let info_status, is_adm_badge, is_banned, is_cat, is_free, is_root, item, item_key;
  let item_label, item_name, items, k_b, k_back, k_c, k_canc, k_cancel;
  let k_cmenu, k_done, k_edit, k_file, k_img, k_link, kb, keyboard;
  let kind, lbl, legacy, list_text, m, maint_status, maintenance_status, methods;
  let module_name, moved, msg, msg_f, msg_img, msg_key, msg_p, msg_success;
  let msg_text, n, n_courses, n_eb, n_sub, name, nav, nav_ctx;
  let nav_row, new_active_dir, new_bal, new_btn, new_cid, new_course, new_ebook, new_grid;
  let new_id, new_parent, new_path, new_raw, new_st, new_status, new_val, note;
  let note_display, o, o_id, ok, old_empty, order, order_amount, order_id;
  let orders, origin, p_desc, p_img, p_key, p_name, p_path, p_price;
  let p_text, p_txt, page, page_num, parent, parent_display, parent_parent, parent_path;
  let parent_segments, parsed_kb, parts, past, past_ok, past_ok_total, pat, path;
  let path_disp, paths, pcode, pend_all, pend_total, pending, per_page, per_row;
  let per_user_lim, per_user_lim_v, per_user_str, per_user_str_v, pg, pg_s, pick, pkey;
  let plimit, pos, preset, prev, preview, price_tag, price_val, prompt;
  let prompts, prop, prop_prompts, pul, pul_txt, query, r, r_amount;
  let r_idx, r_stats, r_uid, raw, raw_fb, raw_prev, ref_c, ref_info;
  let ref_st_icon, referrer_id, rej_all, removable_admins, removed, reply_markup, rest, results;
  let reward_amt, reward_res, reward_uid, ri, row, row_choice, row_sel, rows;
  let rtype, s, same_acc, same_acc_txt, scope, scope_desc, search_query, segments;
  let segs, sel, sel_ids, sel_names, selected, sep, sf, sib;
  let sibling_name, siblings, sibs, src, src_base, st_icon, st_text, st_title;
  let st_word, stats, status, status_msg, status_symbol, status_text, status_txt, status_word;
  let step, student_name, style, sub, sub_chosen, subcat_path, subcategory, subcats;
  let subfolders, subs, success, t, t_idx, tag, tail, target_courses;
  let target_folder, target_path, target_row, target_sub, target_uid, tc, template_key, text;
  let toggle_btn_text, total_pages, total_u, txt, u, u_name, u_user, uid;
  let uname, user_id, user_notify, users_page, view_all_enabled, view_all_status, w, welcome_media_status;
  let welcome_status, wid, wiz, x;
  let eb_c, eb_cid, eb_items, eb_keyboard, eb_msg_text, eb_nav, eb_page_num, eb_per_page, eb_price_tag, eb_total_pages;
  query = update.callback_query;
  data = _expand_callback_data(query.data);
  user_id = query.from_user.id;
  if (pyT((((__v1) => (pyT(__v1) ? __v1 : (((__v0) => (pyT(__v0) ? __v0 : ((pyEq(data, "adm_ignore")))))(pyEnd(data, "_noop")))))(pyStart(data, "noop"))))) {
      void ((await query.answer()));
      return;
  }
  if (pyT((!pyT(is_admin(user_id))))) {
      void ((await query.answer("⛔ Access Denied!", { show_alert: true })));
      return;
  }
  [is_banned, ban_msg] = check_banned(user_id);
  if (pyT(is_banned)) {
      void ((await query.answer(pyReplace(pyReplace(ban_msg, "**", ""), "__", ""), { show_alert: true })));
      return;
  }
  [allowed, module_name] = check_admin_callback_permission(user_id, data);
  if (pyT((!pyT(allowed)))) {
      void ((await query.answer(`⛔ Access Denied! You do not have permission for ${pyStr(module_name)}.`, { show_alert: true })));
      return;
  }
  if (pyT(pyStart(data, "bc_sel_"))) {
      void ((await query.answer()));
      parts = pySplit(data, "_", -1);
      action = pySub(parts, 2);
      if (pyT((pyEq(action, "tgl")))) {
            target_uid = pyInt(pySub(parts, 3));
            page = pyInt(pySub(parts, 4));
            selected = pySetDefault(context.user_data, "bc_recipients", []);
            if (pyT((pyContains(selected, target_uid)))) {
                    pyRemove(selected, target_uid);
            } else {
                    pyAppend(selected, target_uid);
            }
            context.user_data["bc_recipients"] = selected;
            search_query = pyGet(context.user_data, "bc_search_query", "");
            if (pyT(search_query)) {
                    results = db.search_users(search_query);
                    void ((await query.edit_message_text(get_broadcast_target_selector_text(context, search_query), { parse_mode: "Markdown", reply_markup: render_broadcast_target_selector_keyboard(context, { search_results: results }) })));
            } else {
                    void ((await query.edit_message_text(get_broadcast_target_selector_text(context), { parse_mode: "Markdown", reply_markup: render_broadcast_target_selector_keyboard(context, { page: page }) })));
            }
      } else if (pyT((pyEq(action, "pg")))) {
            page = pyInt(pySub(parts, 3));
            pyPop(context.user_data, "bc_search_query", null);
            void ((await query.edit_message_text(get_broadcast_target_selector_text(context), { parse_mode: "Markdown", reply_markup: render_broadcast_target_selector_keyboard(context, { page: page }) })));
      } else if (pyT((pyEq(action, "search")))) {
            context.user_data["admin_broadcasting_step"] = "search_users_for_bc";
            void ((await query.edit_message_text("🔍 **Search User**\n━━━━━━━━━━━━━━━━━━━━\n\n👇 Send the user's **Name**, **Username**, or **Telegram User ID** to search:\n\n(Click Cancel below to abort search)", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel Search", { callback_data: "bc_sel_pg_1" })]]) })));
      } else if (pyT((pyEq(action, "done")))) {
            selected = pyGet(context.user_data, "bc_recipients", []);
            if (pyT((!pyT(selected)))) {
                    void ((await query.answer("⚠️ Please select at least 1 user first!", { show_alert: true })));
                    return;
            }
            pyPop(context.user_data, "admin_broadcasting_step", null);
            pyPop(context.user_data, "bc_search_query", null);
            void ((await show_broadcast_preview(query, context, user_id)));
      }
      return;
  }
  if (pyT((pyEq(data, "adm_home_buttons")))) {
      void ((await render_home_buttons_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_info_buttons")))) {
      void ((await render_info_buttons_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_info_media_upload")))) {
      context.user_data["admin_info_media_wait"] = true;
      void ((await query.edit_message_text("🖼️ <b>Info Header Photo/GIF Upload</b>\n━━━━━━━━━━━━━━━━━━━━\n\n👉 এখন একটা <b>Photo</b> অথবা <b>GIF/Animation</b> পাঠান।\nএটাই Info menu-র Head Text-এর সাথে সুন্দর করে দেখাবে।\n\n❌ বাতিল করতে /cancel লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_info_buttons" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_info_media_remove")))) {
      db.set_info_header_media("none", "");
      void ((await query.answer("🗑️ Header photo removed! (এখন text only)", { show_alert: true })));
      void ((await render_info_buttons_panel(query)));
      return;
  } else if (pyT(pyStart(data, "adm_infoitem_"))) {
      item_key = pyReplace(data, "adm_infoitem_", "");
      void ((await render_info_item_editor(query, item_key)));
      return;
  } else if (pyT(pyStart(data, "adm_infoedit_"))) {
      item_key = pyReplace(data, "adm_infoedit_", "");
      context.user_data["admin_edit_infoitem_key"] = item_key;
      item_label = (((__v2) => (pyT(__v2) ? __v2 : (item_key)))(pyGet(pyGet(pyGet(db.get_info_settings(), "items", {  }), item_key, {  }), "label")));
      void ((await query.edit_message_text(`✍️ <b>Enter the new description / text for '${pyStr(pyHtmlEscape(item_label))}':</b>

💡 <i>You can use Markdown or HTML tags. You can also append buttons using <code>[Button Text](URL)</code> at the end of the text.</i>

Type /cancel to abort.`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_infoitem_${pyStr(item_key)}` })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_infoheader_"))) {
      item_key = pyReplace(data, "adm_infoheader_", "");
      context.user_data["admin_info_header_key"] = item_key;
      item_label = (((__v3) => (pyT(__v3) ? __v3 : (item_key)))(pyGet(pyGet(pyGet(db.get_info_settings(), "items", {  }), item_key, {  }), "label")));
      cur = pyStrip((((__v4) => (pyT(__v4) ? __v4 : ("")))(pyGet(pyGet(pyGet(db.get_info_settings(), "items", {  }), item_key, {  }), "header", ""))));
      cur_line = (pyT(cur) ? (`

Current: <code>${pyStr(pyHtmlEscape(pySlice(cur, null, 200, null)))}</code>`) : (""));
      void ((await query.edit_message_text(`✍️ <b>Enter the header text for '${pyStr(pyHtmlEscape(item_label))}':</b>
💡 <i>This shows on top (with photo/GIF if set), above the description.</i>${pyStr(cur_line)}

Type /cancel to abort.`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_infoitem_${pyStr(item_key)}` })]]) })));
      return;
  } else if (pyT((((__v5) => (pyT(__v5) ? ((!pyT(pyStart(data, "adm_infomedia_rm_")))) : __v5))(pyStart(data, "adm_infomedia_"))))) {
      item_key = pyReplace(data, "adm_infomedia_", "");
      context.user_data["admin_info_media_target"] = { kind: "item", id: item_key };
      item_label = (((__v6) => (pyT(__v6) ? __v6 : (item_key)))(pyGet(pyGet(pyGet(db.get_info_settings(), "items", {  }), item_key, {  }), "label")));
      void ((await query.edit_message_text(`🖼️ <b>Photo/GIF for '${pyStr(pyHtmlEscape(item_label))}'</b>
━━━━━━━━━━━━━━━━━━━━

👉 এখন একটা <b>Photo</b> অথবা <b>GIF/Animation</b> পাঠান।
এটাই এই বাটনের detail-এ header-এর সাথে দেখাবে।

❌ বাতিল করতে /cancel লিখুন।`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_infoitem_${pyStr(item_key)}` })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_infomedia_rm_"))) {
      item_key = pyReplace(data, "adm_infomedia_rm_", "");
      db.update_info_item(item_key, { media_type: "none", media_file_id: "" });
      void ((await query.answer("🗑️ Photo/GIF removed! (এখন text only)", { show_alert: true })));
      void ((await render_info_item_editor(query, item_key)));
      return;
  } else if (pyT(pyStart(data, "adm_inforeset_"))) {
      item_key = pyReplace(data, "adm_inforeset_", "");
      db.reset_info_item(item_key);
      if (pyT((pyEq(item_key, "contact")))) {
            db.delete_setting("support_message");
      }
      void ((await query.answer("Reset to default template successfully!", { show_alert: true })));
      void ((await render_info_item_editor(query, item_key)));
      return;
  } else if (pyT(pyStart(data, "adm_infotog_"))) {
      item_key = pyReplace(data, "adm_infotog_", "");
      db.toggle_info_item_status(item_key);
      void ((await query.answer("Status toggled!")));
      void ((await render_info_item_editor(query, item_key)));
      return;
  } else if (pyT((pyEq(data, "adm_infobtn_add")))) {
      context.user_data["admin_add_infobtn_step"] = "label";
      context.user_data["admin_add_infobtn_data"] = {  };
      void ((await query.edit_message_text("➕ <b>Add Custom Info Button — Step 1/4: Button Label</b>\n━━━━━━━━━━━━━━━━━━━━\n\n✍️ নতুন বাটনের <b>নাম/label</b> লিখে পাঠান (e.g. <code>📞 Support</code>):\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_info_buttons" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_btncolor_customs")))) {
      void ((await render_btncolor_custom_panel(query)));
      return;
  } else if (pyT(pyStart(data, "adm_btncolor_cpg_"))) {
      try {
            _pg = pyInt(pyReplace(data, "adm_btncolor_cpg_", ""));
      } catch (__e) {
            _pg = 0;
      }
      void ((await render_btncolor_custom_panel(query, { page: _pg })));
      return;
  } else if (pyT((pyEq(data, "adm_btncolor_custom")))) {
      context.user_data["admin_customcolor"] = { step: "name" };
      void ((await query.edit_message_text("✏️ <b>Custom Button Color — Step 1/2: Button Name</b>\n━━━━━━━━━━━━━━━━━━━━\n\n✍️ Button-এর নাম লিখে পাঠান (e.g. <code>Buy Now</code>):\n💡 <i>যেসব button-এর নামে এই লেখা আছে, সবগুলোতে color লাগবে।</i>\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_btncolor_customs" })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_btncolor_cpick_"))) {
      style = pyReplace(data, "adm_btncolor_cpick_", "");
      if (pyT(((!pyContains(["primary", "success", "danger"], style))))) {
            void ((await query.answer("Invalid choice!", { show_alert: true })));
            return;
      }
      cdata = pyPop(context.user_data, "admin_customcolor", {  });
      if (pyT((!pyT(pyStrip((((__v7) => (pyT(__v7) ? __v7 : ("")))(pyGet(cdata, "name")))))))) {
            void ((await query.answer("Session expired! আবার চেষ্টা করুন।", { show_alert: true })));
            void ((await render_btncolor_custom_panel(query)));
            return;
      }
      customs = (((__v8) => (pyT(__v8) ? __v8 : ([])))(db.get_setting("custom_button_colors", [])));
      customs = ((() => { const __acc = []; for (const r of pyIter(customs)) { if (!pyT(pyIsInstance(r, "dict"))) continue; __acc.push(r); } return __acc; })());
      pyInsert(customs, 0, { name: pyStrip(pySub(cdata, "name")), style: style });
      db.set_setting("custom_button_colors", customs);
      void ((await query.answer("✅ Custom color saved!", { show_alert: true })));
      void ((await render_btncolor_custom_panel(query)));
      return;
  } else if (pyT(pyStart(data, "adm_btncolor_cdel_"))) {
      rest = pyReplace(data, "adm_btncolor_cdel_", "");
      if (pyT((pyContains(rest, "_p")))) {
            [idx_s, _, pg_s] = pyRPartition(rest, "_p");
      } else {
            [idx_s, pg_s] = [rest, "0"];
      }
      try {
            idx = pyInt(idx_s);
      } catch (__e) {
            void ((await query.answer("Invalid!", { show_alert: true })));
            return;
      }
      try {
            pg = pyInt(pg_s);
      } catch (__e) {
            pg = 0;
      }
      customs = (((__v9) => (pyT(__v9) ? __v9 : ([])))(db.get_setting("custom_button_colors", [])));
      customs = ((() => { const __acc = []; for (const r of pyIter(customs)) { if (!pyT(pyIsInstance(r, "dict"))) continue; __acc.push(r); } return __acc; })());
      if (pyT(((0 <= idx) && (idx < pyLen(customs))))) {
            pyPop(customs, idx);
            db.set_setting("custom_button_colors", customs);
            void ((await query.answer("🗑️ Deleted!")));
      } else {
            void ((await query.answer("Not found!", { show_alert: true })));
      }
      void ((await render_btncolor_custom_panel(query, { page: pg })));
      return;
  } else if (pyT((pyEq(data, "adm_infobtn_del_list")))) {
      cfg = db.get_info_settings();
      c_btns = pyGet(cfg, "custom_buttons", []);
      if (pyT((!pyT(c_btns)))) {
            void ((await query.answer("No custom buttons found to delete!", { show_alert: true })));
            void ((await render_info_buttons_panel(query)));
            return;
      }
      keyboard = [];
      for (const b of pyIter(c_btns)) {
            pyAppend(keyboard, [InlineKeyboardButton(`✕ ${pyStr(pySub(b, "label"))}`, { callback_data: `adm_infobtn_del_${pyStr(pySub(b, "id"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_info_buttons" })]);
      void ((await query.edit_message_text("👇 <b>Select a custom button to delete:</b>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  } else if (pyT(pyStart(data, "adm_infobtn_del_"))) {
      btn_id = pyReplace(data, "adm_infobtn_del_", "");
      db.delete_custom_info_button(btn_id);
      void ((await query.answer("Button deleted!")));
      void ((await render_info_buttons_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_infobtn_skipmedia")))) {
      btn_data = pyPop(context.user_data, "admin_add_infobtn_data", {  });
      pyPop(context.user_data, "admin_add_infobtn_step", null);
      if (pyT((!pyT(pyGet(btn_data, "label"))))) {
            void ((await query.answer("Session expired! আবার চেষ্টা করুন।", { show_alert: true })));
            void ((await render_info_buttons_panel(query)));
            return;
      }
      lbl = pyGet(btn_data, "label", "Info Button");
      new_id = db.add_custom_info_button(lbl, pyGet(btn_data, "type", "text"), pyGet(btn_data, "content", ""), { header: pyGet(btn_data, "header", "") });
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await query.message.reply_text(`✅ Custom Info button '<b>${pyStr(pyHtmlEscape(lbl))}</b>' added successfully! (no photo)`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("✏️ Edit Button", { callback_data: `adm_cinfo_edit_${pyStr(new_id)}` })], [InlineKeyboardButton("ℹ️ Info Button Settings", { callback_data: "adm_info_buttons" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_cinfo_edit_list")))) {
      cfg = db.get_info_settings();
      c_btns = pyGet(cfg, "custom_buttons", []);
      if (pyT((!pyT(c_btns)))) {
            void ((await query.answer("No custom buttons found!", { show_alert: true })));
            void ((await render_info_buttons_panel(query)));
            return;
      }
      keyboard = [];
      for (const b of pyIter(c_btns)) {
            pyAppend(keyboard, [InlineKeyboardButton(`✏️ ${pyStr(pySub(b, "label"))}`, { callback_data: `adm_cinfo_edit_${pyStr(pySub(b, "id"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "adm_info_buttons" })]);
      void ((await query.edit_message_text("👇 <b>Select a custom button to edit:</b>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  } else if (pyT(pyStart(data, "adm_cinfo_edit_"))) {
      btn_id = pyReplace(data, "adm_cinfo_edit_", "");
      void ((await render_cinfo_editor(query, btn_id)));
      return;
  } else if (pyT(pyStart(data, "adm_cinfo_label_"))) {
      btn_id = pyReplace(data, "adm_cinfo_label_", "");
      context.user_data["admin_cinfo_label_id"] = btn_id;
      void ((await query.edit_message_text("✍️ <b>Enter the new label for this button:</b>\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_cinfo_edit_${pyStr(btn_id)}` })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_cinfo_desc_"))) {
      btn_id = pyReplace(data, "adm_cinfo_desc_", "");
      context.user_data["admin_cinfo_desc_id"] = btn_id;
      void ((await query.edit_message_text("✍️ <b>Enter the new description / text content for this button:</b>\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_cinfo_edit_${pyStr(btn_id)}` })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_cinfo_header_"))) {
      btn_id = pyReplace(data, "adm_cinfo_header_", "");
      context.user_data["admin_cinfo_header_id"] = btn_id;
      void ((await query.edit_message_text("✍️ <b>Enter the new header text for this button:</b>\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_cinfo_edit_${pyStr(btn_id)}` })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_cinfo_media_rm_"))) {
      btn_id = pyReplace(data, "adm_cinfo_media_rm_", "");
      db.update_custom_info_button(btn_id, { media_type: "none", media_file_id: "" });
      void ((await query.answer("🗑️ Photo/GIF removed!", { show_alert: true })));
      void ((await render_cinfo_editor(query, btn_id)));
      return;
  } else if (pyT(pyStart(data, "adm_cinfo_media_"))) {
      btn_id = pyReplace(data, "adm_cinfo_media_", "");
      context.user_data["admin_info_media_target"] = { kind: "custom", id: btn_id };
      void ((await query.edit_message_text("🖼️ <b>Photo/GIF for this button</b>\n━━━━━━━━━━━━━━━━━━━━\n\n👉 এখন একটা <b>Photo</b> অথবা <b>GIF/Animation</b> পাঠান।\n\n❌ বাতিল করতে /cancel লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_cinfo_edit_${pyStr(btn_id)}` })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_cinfo_tog_"))) {
      btn_id = pyReplace(data, "adm_cinfo_tog_", "");
      db.toggle_custom_info_button(btn_id);
      void ((await query.answer("Status toggled!")));
      void ((await render_cinfo_editor(query, btn_id)));
      return;
  } else if (pyT((pyEq(data, "adm_btn_colors")))) {
      void ((await render_button_colors_panel(query, { page: 0 })));
      return;
  } else if (pyT(pyStart(data, "adm_btncolor_pg_"))) {
      try {
            _pg = pyInt(pyReplace(data, "adm_btncolor_pg_", ""));
      } catch (__e) {
            _pg = 0;
      }
      void ((await render_button_colors_panel(query, { page: _pg })));
      return;
  } else if (pyT((pyEq(data, "adm_fallback_mgr")))) {
      void ((await render_fallback_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_fallback_preview")))) {
      demo_q = "physics";
      raw_fb = pyReplace((((__v10) => (pyT(__v10) ? __v10 : (get_fallback_template_text())))(db.get_setting("fallback_message"))), "{query}", demo_q);
      [msg, parsed_kb] = parse_inline_buttons(raw_fb);
      kb = (pyList(parsed_kb) + [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_fallback_mgr" })]]);
      void ((await query.message.reply_text(("👁️ <b>Preview — user যা দেখবে:</b>\n━━━━━━━━━━━━━━━━━━━━\n\n" + msg), { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(kb) })));
      return;
  } else if (pyT((pyEq(data, "adm_fallback_edittext")))) {
      raw_fb = (((__v11) => (pyT(__v11) ? __v11 : ("")))(db.get_setting("fallback_message", "")));
      [body, _rows] = split_fallback_buttons((pyT(pyStrip(raw_fb)) ? (raw_fb) : (get_fallback_template_text())));
      context.user_data["admin_fallback_text"] = true;
      prev = (pyT(pyStrip(body)) ? (`

Current:
<blockquote>${pyStr(pyHtmlEscape(pySlice(body, null, 400, null)))}</blockquote>`) : (""));
      void ((await query.edit_message_text(`✏️ <b>Edit Fallback Text</b>
━━━━━━━━━━━━━━━━━━━━
💡 <i>শুধু message text পাঠান — buttons unchanged থাকবে।</i>${pyStr(prev)}

Type /cancel to abort.`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_fallback_mgr" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_fallback_btnadd")))) {
      context.user_data["admin_fallback_btn"] = { step: "label" };
      void ((await query.edit_message_text("➕ <b>Add Button — Step 1/2: Label</b>\n━━━━━━━━━━━━━━━━━━━━\n\n✍️ Button-এর নাম লিখে পাঠান (e.g. <code>Browse Courses</code>):\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_fallback_mgr" })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_fallback_btndel_"))) {
      parts = pySplit(pyReplace(data, "adm_fallback_btndel_", ""), "_", -1);
      try {
            [ri, ii] = [pyInt(pySub(parts, 0)), pyInt(pySub(parts, 1))];
      } catch (__e) {
            void ((await query.answer("Invalid!", { show_alert: true })));
            return;
      }
      raw_fb = (((__v12) => (pyT(__v12) ? __v12 : ("")))(db.get_setting("fallback_message", "")));
      [body, rows] = split_fallback_buttons((pyT(pyStrip(raw_fb)) ? (raw_fb) : (get_fallback_template_text())));
      if (pyT((((__v13) => (pyT(__v13) ? (((0 <= ii) && (ii < pyLen(pySub(rows, ri))))) : __v13))(((0 <= ri) && (ri < pyLen(rows))))))) {
            pyPop(pySub(rows, ri), ii);
            rows = ((() => { const __acc = []; for (const r of pyIter(rows)) { if (!pyT(r)) continue; __acc.push(r); } return __acc; })());
            db.set_setting("fallback_message", build_fallback_text(body, rows));
            void ((await query.answer("🗑️ Button deleted!")));
      } else {
            void ((await query.answer("Not found!", { show_alert: true })));
      }
      void ((await render_fallback_panel(query)));
      return;
  } else if (pyT(pyStart(data, "adm_btncolor_grp_"))) {
      gid = pyReplace(data, "adm_btncolor_grp_", "");
      grp = pyNext(((() => { const __acc = []; for (const g of pyIter(BUTTON_COLOR_GROUPS)) { if (!pyT((pyEq(pySub(g, "id"), gid)))) continue; __acc.push(g); } return __acc; })()), null);
      if (pyT((!pyT(grp)))) {
            void ((await query.answer("Invalid group!", { show_alert: true })));
            return;
      }
      groups = (((__v14) => (pyT(__v14) ? __v14 : ({  })))(db.get_setting("button_color_groups", {  })));
      cur = pyGet(groups, gid, pyGet(BUTTON_COLOR_DEFAULTS, gid, "none"));
      if (pyT(((!pyContains(["primary", "success", "danger"], cur))))) {
            cur = "none";
      }
      void ((await query.edit_message_text(`🎨 <b>${pyStr(pyHtmlEscape(pySub(grp, "label")))}</b>
📋 Covers: <i>${pyStr(pyHtmlEscape(pyGet(grp, "details", "")))}</i>
Current: ${pyStr(pySub(BUTTON_STYLE_DOT, cur))} ${pyStr(pySub(BUTTON_STYLE_NAME, cur))}

👇 Pick color:`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🔵 Blue", { callback_data: `adm_btncolor_pick_${pyStr(gid)}_primary` })], [InlineKeyboardButton("🟢 Green", { callback_data: `adm_btncolor_pick_${pyStr(gid)}_success` })], [InlineKeyboardButton("🔴 Red", { callback_data: `adm_btncolor_pick_${pyStr(gid)}_danger` })], [InlineKeyboardButton("⚪ Default (no color)", { callback_data: `adm_btncolor_pick_${pyStr(gid)}_none` })], [InlineKeyboardButton("⬅️Back", { callback_data: "adm_btn_colors" })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_btncolor_pick_"))) {
      rest = pyReplace(data, "adm_btncolor_pick_", "");
      [gid, _, style] = pyRPartition(rest, "_");
      grp = pyNext(((() => { const __acc = []; for (const g of pyIter(BUTTON_COLOR_GROUPS)) { if (!pyT((pyEq(pySub(g, "id"), gid)))) continue; __acc.push(g); } return __acc; })()), null);
      if (pyT((((__v15) => (pyT(__v15) ? __v15 : (((!pyContains(["primary", "success", "danger", "none"], style))))))((!pyT(grp)))))) {
            void ((await query.answer("Invalid choice!", { show_alert: true })));
            return;
      }
      groups = (((__v16) => (pyT(__v16) ? __v16 : ({  })))(db.get_setting("button_color_groups", {  })));
      groups[gid] = style;
      db.set_setting("button_color_groups", groups);
      void ((await query.answer(`✅ ${pyStr(pySub(grp, "label"))} → ${pyStr(pyGet(BUTTON_STYLE_DOT, style, "⚪"))}!`, { show_alert: true })));
      void ((await render_button_colors_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_btncolor_cats")))) {
      void ((await render_btncolor_cats_panel(query)));
      return;
  } else if (pyT(pyStart(data, "adm_btncolor_ctpg_"))) {
      try {
            _pg = pyInt(pyReplace(data, "adm_btncolor_ctpg_", ""));
      } catch (__e) {
            _pg = 0;
      }
      void ((await render_btncolor_cats_panel(query, { page: _pg })));
      return;
  } else if (pyT(pyStart(data, "adm_btncolor_cat_"))) {
      rest = pyReplace(data, "adm_btncolor_cat_", "");
      [pg, cat_name] = [0, rest];
      [head, sep, tail] = pyPartition(rest, "_");
      if (pyT((((__v18) => (pyT(__v18) ? (((__v17) => (pyT(__v17) ? (tail) : __v17))(pyIsDigit(head))) : __v18))(sep)))) {
            [pg, cat_name] = [pyInt(head), tail];
      }
      context.user_data["admin_btncolor_cat"] = cat_name;
      context.user_data["admin_btncolor_cat_page"] = pg;
      void ((await query.edit_message_text(`🎨 <b>Color for ${pyStr(pyHtmlEscape(cat_name))}</b> 👇`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("🔵 Blue", { callback_data: "adm_btncolor_set_primary" })], [InlineKeyboardButton("🟢 Green", { callback_data: "adm_btncolor_set_success" })], [InlineKeyboardButton("🔴 Red", { callback_data: "adm_btncolor_set_danger" })], [InlineKeyboardButton("⚪ Default (no color)", { callback_data: "adm_btncolor_set_none" })], [InlineKeyboardButton("⬅️Back", { callback_data: `adm_btncolor_ctpg_${pyStr(pg)}` })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_btncolor_set_"))) {
      style = pyReplace(data, "adm_btncolor_set_", "");
      if (pyT(((!pyContains(["primary", "success", "danger", "none"], style))))) {
            void ((await query.answer("Invalid choice!", { show_alert: true })));
            return;
      }
      cat_name = pyStrip((((__v19) => (pyT(__v19) ? __v19 : ("")))(pyPop(context.user_data, "admin_btncolor_cat", ""))));
      try {
            pg = pyInt(pyPop(context.user_data, "admin_btncolor_cat_page", 0));
      } catch (__e) {
            pg = 0;
      }
      if (pyT((!pyT(cat_name)))) {
            void ((await query.answer("Session expired! আবার চেষ্টা করুন।", { show_alert: true })));
            void ((await render_button_colors_panel(query)));
            return;
      }
      cats = (((__v20) => (pyT(__v20) ? __v20 : ({  })))(db.get_setting("category_colors", {  })));
      if (pyT((pyEq(style, "none")))) {
            pyPop(cats, cat_name, null);
      } else {
            cats[cat_name] = style;
      }
      db.set_setting("category_colors", cats);
      void ((await query.answer(`✅ ${pyStr(cat_name)} → ${pyStr(pyGet(BUTTON_STYLE_DOT, style, "⚪"))}!`, { show_alert: true })));
      void ((await render_btncolor_cats_panel(query, { page: pg })));
      return;
  } else if (pyT((pyEq(data, "adm_hbtn_add")))) {
      context.user_data["admin_add_hbtn_step"] = "text";
      context.user_data["admin_add_hbtn_data"] = {  };
      void ((await query.edit_message_text("✍️ <b>Enter the text for the new home button:</b>\n(e.g., <code>📚 Browse Courses</code> or <code>💬 Support</code>)\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_home_buttons" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_hbtn_del_list")))) {
      grid = get_home_keyboard_grid();
      keyboard = [];
      for (const [r_idx, row] of pyIter(pyEnumerate(grid))) {
            for (const [c_idx, btn] of pyIter(pyEnumerate(row))) {
                    pyAppend(keyboard, [InlineKeyboardButton(`Row ${pyStr((r_idx + 1))} Col ${pyStr((c_idx + 1))}: ${pyStr(pySub(btn, "text"))}`, { callback_data: `adm_hbtn_del_${pyStr(r_idx)}_${pyStr(c_idx)}` })]);
            }
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_home_buttons" })]);
      void ((await query.edit_message_text("👇 <b>Select a button to delete:</b>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  } else if (pyT(pyStart(data, "adm_hbtn_del_"))) {
      parts = pySplit(pyReplace(data, "adm_hbtn_del_", ""), "_", -1);
      r_idx = pyInt(pySub(parts, 0));
      c_idx = pyInt(pySub(parts, 1));
      grid = get_home_keyboard_grid();
      if (pyT((((__v21) => (pyT(__v21) ? (((c_idx < pyLen(pySub(grid, r_idx))))) : __v21))(((r_idx < pyLen(grid))))))) {
            pyDel(pySub(grid, r_idx), c_idx);
            if (pyT((!pyT(pySub(grid, r_idx))))) {
                    pyDel(grid, r_idx);
            }
            db.set_setting("home_keyboard_grid", grid);
            void ((await query.answer("🗑️ Button deleted successfully!")));
      }
      void ((await render_home_buttons_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_hbtn_edit_list")))) {
      grid = get_home_keyboard_grid();
      keyboard = [];
      for (const [r_idx, row] of pyIter(pyEnumerate(grid))) {
            for (const [c_idx, btn] of pyIter(pyEnumerate(row))) {
                    pyAppend(keyboard, [InlineKeyboardButton(`Row ${pyStr((r_idx + 1))} Col ${pyStr((c_idx + 1))}: ${pyStr(pySub(btn, "text"))}`, { callback_data: `adm_hbtn_edit_select_${pyStr(r_idx)}_${pyStr(c_idx)}` })]);
            }
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_home_buttons" })]);
      void ((await query.edit_message_text("👇 <b>Select a button to edit:</b>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  } else if (pyT(pyStart(data, "adm_hbtn_edit_select_"))) {
      parts = pySplit(pyReplace(data, "adm_hbtn_edit_select_", ""), "_", -1);
      r_idx = pyInt(pySub(parts, 0));
      c_idx = pyInt(pySub(parts, 1));
      void ((await render_hbtn_edit_panel(query, context, r_idx, c_idx)));
      return;
  } else if (pyT((pyEq(data, "adm_hbtn_edt_text")))) {
      context.user_data["admin_add_hbtn_step"] = "edit_text";
      void ((await query.edit_message_text("✍️ <b>Enter the new text for this button:</b>\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_home_buttons" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_hbtn_edt_action")))) {
      context.user_data["admin_add_hbtn_step"] = "edit_action";
      void ((await query.edit_message_text("✍️ <b>Enter the new action (URL link or callback data):</b>\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_home_buttons" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_hbtn_edt_move")))) {
      coords = pyGet(context.user_data, "admin_edit_hbtn_coords");
      if (pyT((!pyT(coords)))) {
            void ((await query.answer("Button selection expired. Please select it again.", { show_alert: true })));
            void ((await render_home_buttons_panel(query)));
            return;
      }
      [r_idx, c_idx] = coords;
      grid = get_home_keyboard_grid();
      if (pyT((((__v22) => (pyT(__v22) ? __v22 : (((c_idx >= pyLen(pySub(grid, r_idx)))))))(((r_idx >= pyLen(grid))))))) {
            void ((await query.answer("Button not found. Please select it again.", { show_alert: true })));
            void ((await render_home_buttons_panel(query)));
            return;
      }
      void ((await query.edit_message_text("🔀 <b>Move Button Position</b>\n━━━━━━━━━━━━━━━━━━━━\n\nChoose where to move this button. The change is saved instantly.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️ Left", { callback_data: "adm_hbtn_edmove_left" }), InlineKeyboardButton("➡️ Right", { callback_data: "adm_hbtn_edmove_right" })], [InlineKeyboardButton("⬆️ Up", { callback_data: "adm_hbtn_edmove_up" }), InlineKeyboardButton("⬇️ Down", { callback_data: "adm_hbtn_edmove_down" })], [InlineKeyboardButton("⬅️Back", { callback_data: `adm_hbtn_edit_select_${pyStr(r_idx)}_${pyStr(c_idx)}` })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_hbtn_edmove_"))) {
      direction = pyReplace(data, "adm_hbtn_edmove_", "");
      coords = pyGet(context.user_data, "admin_edit_hbtn_coords");
      grid = get_home_keyboard_grid();
      if (pyT((!pyT(coords)))) {
            void ((await query.answer("Button selection expired. Please select it again.", { show_alert: true })));
            void ((await render_home_buttons_panel(query)));
            return;
      }
      [r_idx, c_idx] = coords;
      if (pyT((((__v23) => (pyT(__v23) ? __v23 : (((c_idx >= pyLen(pySub(grid, r_idx)))))))(((r_idx >= pyLen(grid))))))) {
            void ((await query.answer("Button not found. Please select it again.", { show_alert: true })));
            void ((await render_home_buttons_panel(query)));
            return;
      }
      button = pySub(pySub(grid, r_idx), c_idx);
      moved = false;
      if (pyT((((__v24) => (pyT(__v24) ? (((c_idx > 0))) : __v24))((pyEq(direction, "left")))))) {
            const __un1 = ([pySub(pySub(grid, r_idx), (c_idx - 1)), pySub(pySub(grid, r_idx), c_idx)]); pySub(grid, r_idx)[c_idx] = __un1[0]; pySub(grid, r_idx)[(c_idx - 1)] = __un1[1];
            c_idx -= 1;
            moved = true;
      } else if (pyT((((__v25) => (pyT(__v25) ? (((c_idx < (pyLen(pySub(grid, r_idx)) - 1)))) : __v25))((pyEq(direction, "right")))))) {
            const __un2 = ([pySub(pySub(grid, r_idx), (c_idx + 1)), pySub(pySub(grid, r_idx), c_idx)]); pySub(grid, r_idx)[c_idx] = __un2[0]; pySub(grid, r_idx)[(c_idx + 1)] = __un2[1];
            c_idx += 1;
            moved = true;
      } else if (pyT((((__v26) => (pyT(__v26) ? (((r_idx > 0))) : __v26))((pyEq(direction, "up")))))) {
            pyDel(pySub(grid, r_idx), c_idx);
            if (pyT((!pyT(pySub(grid, r_idx))))) {
                    pyDel(grid, r_idx);
                    r_idx -= 1;
            } else {
                    r_idx -= 1;
            }
            c_idx = pyMin(c_idx, pyLen(pySub(grid, r_idx)));
            pyInsert(pySub(grid, r_idx), c_idx, button);
            moved = true;
      } else if (pyT((((__v27) => (pyT(__v27) ? (((r_idx < (pyLen(grid) - 1)))) : __v27))((pyEq(direction, "down")))))) {
            pyDel(pySub(grid, r_idx), c_idx);
            if (pyT((!pyT(pySub(grid, r_idx))))) {
                    pyDel(grid, r_idx);
                    target_row = r_idx;
            } else {
                    target_row = (r_idx + 1);
            }
            r_idx = target_row;
            c_idx = pyMin(c_idx, pyLen(pySub(grid, r_idx)));
            pyInsert(pySub(grid, r_idx), c_idx, button);
            moved = true;
      }
      if (pyT((!pyT(moved)))) {
            edge = pyGet({ left: "left", right: "right", up: "top", down: "bottom" }, direction, "selected");
            void ((await query.answer(`Already at the ${pyStr(edge)} position!`, { show_alert: true })));
      } else {
            db.set_setting("home_keyboard_grid", grid);
            context.user_data["admin_edit_hbtn_coords"] = [r_idx, c_idx];
            void ((await query.answer("✅ Button position updated!")));
      }
      void ((await render_hbtn_edit_panel(query, context, r_idx, c_idx)));
      return;
  } else if (pyT((pyEq(data, "adm_hbtn_edt_toggle")))) {
      coords = pyGet(context.user_data, "admin_edit_hbtn_coords");
      if (pyT(coords)) {
            [r_idx, c_idx] = coords;
            grid = get_home_keyboard_grid();
            if (pyT((((__v28) => (pyT(__v28) ? (((c_idx < pyLen(pySub(grid, r_idx))))) : __v28))(((r_idx < pyLen(grid))))))) {
                    pySub(pySub(grid, r_idx), c_idx)["enabled"] = (!pyT(pyGet(pySub(pySub(grid, r_idx), c_idx), "enabled", true)));
                    db.set_setting("home_keyboard_grid", grid);
                    void ((await query.answer("🔄 Button toggle status updated!")));
                    void ((await render_hbtn_edit_panel(query, context, r_idx, c_idx)));
            }
      }
      return;
  } else if (pyT(pyStart(data, "adm_hbtn_row_"))) {
      row_choice = pyReplace(data, "adm_hbtn_row_", "");
      btn_data = pyGet(context.user_data, "admin_add_hbtn_data", {  });
      btn_text = pyGet(btn_data, "text");
      btn_action = pyGet(btn_data, "action");
      new_btn = { text: btn_text, action: btn_action, enabled: true };
      grid = get_home_keyboard_grid();
      if (pyT((pyEq(row_choice, "new_top")))) {
            pyInsert(grid, 0, [new_btn]);
      } else if (pyT((pyEq(row_choice, "new_bottom")))) {
            pyAppend(grid, [new_btn]);
      } else {
            r_idx = pyInt(row_choice);
            if (pyT(((r_idx < pyLen(grid))))) {
                    pyAppend(pySub(grid, r_idx), new_btn);
            }
      }
      db.set_setting("home_keyboard_grid", grid);
      pyPop(context.user_data, "admin_add_hbtn_data", null);
      pyPop(context.user_data, "admin_add_hbtn_step", null);
      void ((await query.answer("✅ Button added successfully!")));
      void ((await render_home_buttons_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_hbtn_resize_prompt")))) {
      keyboard = [[InlineKeyboardButton("1 Column (1 Button per Row)", { callback_data: "adm_hbtn_resize_do_1" })], [InlineKeyboardButton("2 Columns (2 Buttons per Row)", { callback_data: "adm_hbtn_resize_do_2" })], [InlineKeyboardButton("3 Columns (3 Buttons per Row)", { callback_data: "adm_hbtn_resize_do_3" })], [InlineKeyboardButton("⬅️Back", { callback_data: "adm_home_buttons" })]];
      void ((await query.edit_message_text("📐 <b>Select column layout format for home buttons:</b>\n\nThis will re-arrange all home buttons automatically into the specified number of columns.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  } else if (pyT(pyStart(data, "adm_hbtn_resize_do_"))) {
      cols = pyInt(pyReplace(data, "adm_hbtn_resize_do_", ""));
      grid = get_home_keyboard_grid();
      flat_buttons = [];
      for (const row of pyIter(grid)) {
            for (const btn of pyIter(row)) {
                    pyAppend(flat_buttons, btn);
            }
      }
      new_grid = [];
      for (const i of pyIter(pyRange(0, pyLen(flat_buttons), cols))) {
            pyAppend(new_grid, pySlice(flat_buttons, i, (i + cols), null));
      }
      db.set_setting("home_keyboard_grid", new_grid);
      void ((await query.answer(`✅ Layout resized to ${pyStr(cols)} columns!`)));
      void ((await render_home_buttons_panel(query)));
      return;
  }
  if (pyT((pyEq(data, "adm_keyboard_settings")))) {
      void ((await render_keyboard_settings_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_kb_add")))) {
      context.user_data["admin_add_kb_step"] = "text";
      context.user_data["admin_add_kb_data"] = {  };
      void ((await query.edit_message_text("✍️ <b>Enter the text for the new button:</b>\n(Example: <code>📞 Support</code> or <code>📚 Free Courses</code>)\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_keyboard_settings" })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_kb_act_"))) {
      act = pyReplace(data, "adm_kb_act_", "");
      if (pyT((pyEq(act, "menu")))) {
            void ((await query.edit_message_text("👇 <b>Select the action type for this button when clicked:</b>", { parse_mode: "HTML", reply_markup: get_action_select_keyboard({ is_edit: false }) })));
      } else if (pyT((pyEq(act, "grp_builtin")))) {
            void ((await query.edit_message_text("👇 <b>Select a built-in action:</b>", { parse_mode: "HTML", reply_markup: get_builtin_actions_keyboard({ is_edit: false }) })));
      } else if (pyT((pyEq(act, "grp_cats")))) {
            void ((await query.edit_message_text("👇 <b>Select a course category action:</b>", { parse_mode: "HTML", reply_markup: get_categories_actions_keyboard({ is_edit: false }) })));
      } else if (pyT((pyEq(act, "grp_subcats")))) {
            void ((await query.edit_message_text("👇 <b>Select a category to view its subcategories:</b>", { parse_mode: "HTML", reply_markup: get_subcat_category_select_keyboard({ is_edit: false }) })));
      } else if (pyT((pyEq(act, "grp_ebcats")))) {
            void ((await query.edit_message_text("👇 <b>Select an E-Book / PDF folder for this button:</b>", { parse_mode: "HTML", reply_markup: get_ebook_folder_actions_keyboard({ is_edit: false }) })));
      } else if (pyT((pyEq(act, "eb_act_browse")))) {
            pySub(context.user_data, "admin_add_kb_data")["action"] = "browse_ebooks";
            void ((await prompt_add_kb_row(query, context)));
      } else if (pyT((pyEq(act, "eb_act_all")))) {
            pySub(context.user_data, "admin_add_kb_data")["action"] = "ebcat_ALL";
            void ((await prompt_add_kb_row(query, context)));
      } else if (pyT(pyStart(act, "eb_idx_"))) {
            paths = get_all_ebook_folder_paths();
            i = pyInt(pyReplace(act, "eb_idx_", ""));
            if (pyT(((0 <= i) && (i < pyLen(paths))))) {
                    pySub(context.user_data, "admin_add_kb_data")["action"] = `ebcat_${pyStr(pySub(paths, i))}`;
                    void ((await prompt_add_kb_row(query, context)));
            }
      } else if (pyT(pyStart(act, "subcatlist_"))) {
            cat = pyReplace(act, "subcatlist_", "");
            context.user_data["kb_subcat_nav"] = { cat: cat, is_edit: false };
            void ((await query.edit_message_text(`👇 <b>Select a subcategory in category '${pyStr(cat)}':</b>`, { parse_mode: "HTML", reply_markup: get_subcategories_actions_keyboard(cat, { is_edit: false }) })));
      } else if (pyT(pyStart(act, "subcatlistpg_"))) {
            try {
                    pg = pyInt(pyReplace(act, "subcatlistpg_", ""));
            } catch (__e) {
                    pg = 0;
            }
            void ((await query.edit_message_text("👇 <b>Select a category to view its subcategories:</b>", { parse_mode: "HTML", reply_markup: get_subcat_category_select_keyboard({ is_edit: false, page: pg }) })));
      } else if (pyT(pyStart(act, "catpg_"))) {
            try {
                    pg = pyInt(pyReplace(act, "catpg_", ""));
            } catch (__e) {
                    pg = 0;
            }
            void ((await query.edit_message_text("👇 <b>Select a course category action:</b>", { parse_mode: "HTML", reply_markup: get_categories_actions_keyboard({ is_edit: false, page: pg }) })));
      } else if (pyT(pyStart(act, "subcatpg_"))) {
            try {
                    pg = pyInt(pyReplace(act, "subcatpg_", ""));
            } catch (__e) {
                    pg = 0;
            }
            nav_ctx = (((__v29) => (pyT(__v29) ? __v29 : ({  })))(pyGet(context.user_data, "kb_subcat_nav")));
            cat = pyGet(nav_ctx, "cat", "");
            void ((await query.edit_message_text(`👇 <b>Select a subcategory in category '${pyStr(cat)}':</b>`, { parse_mode: "HTML", reply_markup: get_subcategories_actions_keyboard(cat, { is_edit: false, page: pg }) })));
      } else if (pyT(pyStart(act, "ebpg_"))) {
            try {
                    pg = pyInt(pyReplace(act, "ebpg_", ""));
            } catch (__e) {
                    pg = 0;
            }
            void ((await query.edit_message_text("👇 <b>Select an E-Book / PDF folder for this button:</b>", { parse_mode: "HTML", reply_markup: get_ebook_folder_actions_keyboard({ is_edit: false, page: pg }) })));
      } else if (pyT(pyStart(act, "cat_"))) {
            cat_name = pyReplace(act, "cat_", "");
            pySub(context.user_data, "admin_add_kb_data")["action"] = `cat_${pyStr(cat_name)}`;
            void ((await prompt_add_kb_row(query, context)));
      } else if (pyT(pyStart(act, "subcat_"))) {
            subcat_path = pyReplace(act, "subcat_", "");
            pySub(context.user_data, "admin_add_kb_data")["action"] = `subcat_${pyStr(subcat_path)}`;
            void ((await prompt_add_kb_row(query, context)));
      } else if (pyT((pyEq(act, "custom")))) {
            context.user_data["admin_add_kb_step"] = "custom_action";
            void ((await query.edit_message_text("✍️ <b>Type the custom callback data for this button:</b>\n(e.g., <code>cat_SSC</code> or <code>buy_course1</code> or <code>adm_stats</code>)\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_keyboard_settings" })]]) })));
      } else {
            pySub(context.user_data, "admin_add_kb_data")["action"] = act;
            void ((await prompt_add_kb_row(query, context)));
      }
      return;
  } else if (pyT(pyStart(data, "adm_kb_row_"))) {
      row_choice = pyReplace(data, "adm_kb_row_", "");
      pySub(context.user_data, "admin_add_kb_data")["row"] = row_choice;
      keyboard = [[InlineKeyboardButton("👑 Yes (Admins Only)", { callback_data: "adm_kb_adm_yes" })], [InlineKeyboardButton("👤 No (All Users)", { callback_data: "adm_kb_adm_no" })], [InlineKeyboardButton("« Cancel", { callback_data: "adm_keyboard_settings" })]];
      void ((await query.edit_message_text("👇 <b>Should this button be visible to Admins only?</b>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  } else if (pyT(pyStart(data, "adm_kb_adm_"))) {
      adm_choice = pyReplace(data, "adm_kb_adm_", "");
      admin_only = (pyT((pyEq(adm_choice, "yes"))) ? (true) : (false));
      btn_data = pyGet(context.user_data, "admin_add_kb_data", {  });
      btn_text = pyGet(btn_data, "text");
      btn_action = pyGet(btn_data, "action");
      row_sel = pyGet(btn_data, "row");
      new_btn = { text: btn_text, action: btn_action };
      if (pyT(admin_only)) {
            new_btn["admin_only"] = true;
      }
      custom_kb = db.get_custom_keyboards();
      if (pyT(((!pyContains(custom_kb, "buttons"))))) {
            custom_kb["buttons"] = [];
      }
      if (pyT((pyEq(row_sel, "new_top")))) {
            pyInsert(pySub(custom_kb, "buttons"), 0, [new_btn]);
      } else if (pyT((((__v30) => (pyT(__v30) ? __v30 : ((pyEq(row_sel, "new")))))((pyEq(row_sel, "new_bottom")))))) {
            pyAppend(pySub(custom_kb, "buttons"), [new_btn]);
      } else {
            try {
                    r_idx = pyInt(row_sel);
            } catch (__e) {
                    r_idx = 0;
            }
            if (pyT(((r_idx < pyLen(pySub(custom_kb, "buttons")))))) {
                    pyAppend(pySub(pySub(custom_kb, "buttons"), r_idx), new_btn);
            } else {
                    pyAppend(pySub(custom_kb, "buttons"), [new_btn]);
            }
      }
      db.save_custom_keyboards(custom_kb);
      pyPop(context.user_data, "admin_add_kb_step", null);
      pyPop(context.user_data, "admin_add_kb_data", null);
      void ((await query.answer("✅ Button added successfully!")));
      void ((await render_keyboard_settings_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_kb_del_list")))) {
      void ((await render_kb_del_list(query)));
      return;
  } else if (pyT(pyStart(data, "adm_kb_tog_"))) {
      try {
            [r_idx, c_idx] = pySplit(pyReplace(data, "adm_kb_tog_", ""), "_", -1).map(x => pyInt(x));
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      custom_kb = db.get_custom_keyboards();
      try {
            btn = pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx);
      } catch (__e) {
            void ((await query.answer("❌ Not found!", { show_alert: true })));
            return;
      }
      btn["enabled"] = (!pyT(((!(pyGet(btn, "enabled", true) === false)))));
      db.save_custom_keyboards(custom_kb);
      void ((await query.answer(`✅ '${pyStr(pySlice(pyGet(btn, "text", ""), null, 20, null))}' ${pyStr((pyT(pySub(btn, "enabled")) ? ("ON 🟢") : ("OFF 🔴")))}!`)));
      void ((await render_kb_del_list(query)));
      return;
  } else if (pyT(pyStart(data, "adm_kb_del_btn_"))) {
      coords = pySplit(pyReplace(data, "adm_kb_del_btn_", ""), "_", -1);
      r_idx = pyInt(pySub(coords, 0));
      c_idx = pyInt(pySub(coords, 1));
      custom_kb = db.get_custom_keyboards();
      if (pyT((((__v31) => (pyT(__v31) ? (((r_idx < pyLen(pySub(custom_kb, "buttons"))))) : __v31))((pyContains(custom_kb, "buttons")))))) {
            row = pySub(pySub(custom_kb, "buttons"), r_idx);
            if (pyT(((c_idx < pyLen(row))))) {
                    pyDel(row, c_idx);
                    if (pyT((!pyT(row)))) {
                              pyDel(pySub(custom_kb, "buttons"), r_idx);
                    }
                    db.save_custom_keyboards(custom_kb);
                    void ((await query.answer("✅ Button deleted successfully!")));
            }
      }
      void ((await render_kb_del_list(query)));
      return;
  } else if (pyT((pyEq(data, "adm_kb_edit_list")))) {
      custom_kb = db.get_custom_keyboards();
      keyboard = [];
      buttons_grid = pyGet(custom_kb, "buttons", []);
      for (const [r_idx, r] of pyIter(pyEnumerate(buttons_grid))) {
            for (const [c_idx, btn] of pyIter(pyEnumerate(r))) {
                    pyAppend(keyboard, [InlineKeyboardButton(`✏️ Row ${pyStr((r_idx + 1))}: ${pyStr(pySub(btn, "text"))}`, { callback_data: `adm_kb_edit_btn_${pyStr(r_idx)}_${pyStr(c_idx)}` })]);
            }
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Keyboard Settings", { callback_data: "adm_keyboard_settings" })]);
      void ((await query.edit_message_text("👇 <b>Select a button to modify:</b>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  } else if (pyT(pyStart(data, "adm_kb_edit_btn_"))) {
      coords = pySplit(pyReplace(data, "adm_kb_edit_btn_", ""), "_", -1);
      r_idx = pyInt(pySub(coords, 0));
      c_idx = pyInt(pySub(coords, 1));
      context.user_data["admin_edit_kb_coords"] = [r_idx, c_idx];
      void ((await render_button_edit_panel(query, context, r_idx, c_idx)));
      return;
  } else if (pyT(pyStart(data, "adm_kb_edt_"))) {
      edt_action = pyReplace(data, "adm_kb_edt_", "");
      coords = pyGet(context.user_data, "admin_edit_kb_coords");
      if (pyT((!pyT(coords)))) {
            void ((await query.answer("Session expired!")));
            void ((await render_keyboard_settings_panel(query)));
            return;
      }
      [r_idx, c_idx] = coords;
      custom_kb = db.get_custom_keyboards();
      btn = pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx);
      if (pyT((pyEq(edt_action, "text")))) {
            context.user_data["admin_edit_kb_step"] = "text";
            void ((await query.edit_message_text(`✍️ <b>Enter the new text for button '${pyStr(pyHtmlEscape(pySub(btn, "text")))}':</b>

Type /cancel to abort.`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_kb_edit_btn_${pyStr(r_idx)}_${pyStr(c_idx)}` })]]) })));
      } else if (pyT((pyEq(edt_action, "action")))) {
            void ((await query.edit_message_text("👇 <b>Select the action type for this button:</b>", { parse_mode: "HTML", reply_markup: get_action_select_keyboard({ is_edit: true, r_idx: r_idx, c_idx: c_idx }) })));
      } else if (pyT((pyEq(edt_action, "adm")))) {
            btn["admin_only"] = (!pyT(pyGet(btn, "admin_only")));
            db.save_custom_keyboards(custom_kb);
            void ((await query.answer("Toggle Admin-Only success!")));
            void ((await render_button_edit_panel(query, context, r_idx, c_idx)));
      } else if (pyT((pyEq(edt_action, "move")))) {
            keyboard = [[InlineKeyboardButton("⬅️ Move Left", { callback_data: "adm_kb_edmove_left" }), InlineKeyboardButton("➡️ Move Right", { callback_data: "adm_kb_edmove_right" })], [InlineKeyboardButton("⬆️ Move Up", { callback_data: "adm_kb_edmove_up" }), InlineKeyboardButton("⬇️ Move Down", { callback_data: "adm_kb_edmove_down" })], [InlineKeyboardButton("➕ Move to New Row", { callback_data: "adm_kb_edmove_new" })], [InlineKeyboardButton("⬅️Back", { callback_data: `adm_kb_edit_btn_${pyStr(r_idx)}_${pyStr(c_idx)}` })]];
            void ((await query.edit_message_text("👇 <b>Choose movement direction:</b>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else if (pyT((pyEq(edt_action, "color")))) {
            void ((await render_kb_color_picker(query, context, r_idx, c_idx, 0, "edit")));
      }
      return;
  } else if (pyT(pyStart(data, "adm_kb_edact_"))) {
      act = pyReplace(data, "adm_kb_edact_", "");
      coords = pyGet(context.user_data, "admin_edit_kb_coords");
      if (pyT((!pyT(coords)))) {
            void ((await query.answer("Session expired!")));
            void ((await render_keyboard_settings_panel(query)));
            return;
      }
      [r_idx, c_idx] = coords;
      custom_kb = db.get_custom_keyboards();
      if (pyT((pyEq(act, "menu")))) {
            void ((await query.edit_message_text("👇 <b>Select the action type for this button:</b>", { parse_mode: "HTML", reply_markup: get_action_select_keyboard({ is_edit: true, r_idx: r_idx, c_idx: c_idx }) })));
      } else if (pyT((pyEq(act, "grp_builtin")))) {
            void ((await query.edit_message_text("👇 <b>Select a built-in action:</b>", { parse_mode: "HTML", reply_markup: get_builtin_actions_keyboard({ is_edit: true, r_idx: r_idx, c_idx: c_idx }) })));
      } else if (pyT((pyEq(act, "grp_cats")))) {
            void ((await query.edit_message_text("👇 <b>Select a course category action:</b>", { parse_mode: "HTML", reply_markup: get_categories_actions_keyboard({ is_edit: true, r_idx: r_idx, c_idx: c_idx }) })));
      } else if (pyT((pyEq(act, "grp_subcats")))) {
            void ((await query.edit_message_text("👇 <b>Select a category to view its subcategories:</b>", { parse_mode: "HTML", reply_markup: get_subcat_category_select_keyboard({ is_edit: true, r_idx: r_idx, c_idx: c_idx }) })));
      } else if (pyT((pyEq(act, "grp_ebcats")))) {
            void ((await query.edit_message_text("👇 <b>Select an E-Book / PDF folder for this button:</b>", { parse_mode: "HTML", reply_markup: get_ebook_folder_actions_keyboard({ is_edit: true, r_idx: r_idx, c_idx: c_idx }) })));
      } else if (pyT((pyEq(act, "eb_act_browse")))) {
            pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx)["action"] = "browse_ebooks";
            db.save_custom_keyboards(custom_kb);
            void ((await query.answer("Action updated to E-Book List!")));
            void ((await render_button_edit_panel(query, context, r_idx, c_idx)));
      } else if (pyT((pyEq(act, "eb_act_all")))) {
            pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx)["action"] = "ebcat_ALL";
            db.save_custom_keyboards(custom_kb);
            void ((await query.answer("Action updated to All E-Books!")));
            void ((await render_button_edit_panel(query, context, r_idx, c_idx)));
      } else if (pyT(pyStart(act, "eb_idx_"))) {
            paths = get_all_ebook_folder_paths();
            i = pyInt(pyReplace(act, "eb_idx_", ""));
            if (pyT(((0 <= i) && (i < pyLen(paths))))) {
                    pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx)["action"] = `ebcat_${pyStr(pySub(paths, i))}`;
                    db.save_custom_keyboards(custom_kb);
                    void ((await query.answer("Action updated to E-Book Folder!")));
                    void ((await render_button_edit_panel(query, context, r_idx, c_idx)));
            }
      } else if (pyT(pyStart(act, "subcatlist_"))) {
            cat = pyReplace(act, "subcatlist_", "");
            context.user_data["kb_subcat_nav"] = { cat: cat, is_edit: true };
            void ((await query.edit_message_text(`👇 <b>Select a subcategory in category '${pyStr(cat)}':</b>`, { parse_mode: "HTML", reply_markup: get_subcategories_actions_keyboard(cat, { is_edit: true, r_idx: r_idx, c_idx: c_idx }) })));
      } else if (pyT(pyStart(act, "subcatlistpg_"))) {
            try {
                    pg = pyInt(pyReplace(act, "subcatlistpg_", ""));
            } catch (__e) {
                    pg = 0;
            }
            void ((await query.edit_message_text("👇 <b>Select a category to view its subcategories:</b>", { parse_mode: "HTML", reply_markup: get_subcat_category_select_keyboard({ is_edit: true, r_idx: r_idx, c_idx: c_idx, page: pg }) })));
      } else if (pyT(pyStart(act, "catpg_"))) {
            try {
                    pg = pyInt(pyReplace(act, "catpg_", ""));
            } catch (__e) {
                    pg = 0;
            }
            void ((await query.edit_message_text("👇 <b>Select a course category action:</b>", { parse_mode: "HTML", reply_markup: get_categories_actions_keyboard({ is_edit: true, r_idx: r_idx, c_idx: c_idx, page: pg }) })));
      } else if (pyT(pyStart(act, "subcatpg_"))) {
            try {
                    pg = pyInt(pyReplace(act, "subcatpg_", ""));
            } catch (__e) {
                    pg = 0;
            }
            nav_ctx = (((__v32) => (pyT(__v32) ? __v32 : ({  })))(pyGet(context.user_data, "kb_subcat_nav")));
            cat = pyGet(nav_ctx, "cat", "");
            void ((await query.edit_message_text(`👇 <b>Select a subcategory in category '${pyStr(cat)}':</b>`, { parse_mode: "HTML", reply_markup: get_subcategories_actions_keyboard(cat, { is_edit: true, r_idx: r_idx, c_idx: c_idx, page: pg }) })));
      } else if (pyT(pyStart(act, "ebpg_"))) {
            try {
                    pg = pyInt(pyReplace(act, "ebpg_", ""));
            } catch (__e) {
                    pg = 0;
            }
            void ((await query.edit_message_text("👇 <b>Select an E-Book / PDF folder for this button:</b>", { parse_mode: "HTML", reply_markup: get_ebook_folder_actions_keyboard({ is_edit: true, r_idx: r_idx, c_idx: c_idx, page: pg }) })));
      } else if (pyT(pyStart(act, "cat_"))) {
            cat_name = pyReplace(act, "cat_", "");
            pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx)["action"] = `cat_${pyStr(cat_name)}`;
            db.save_custom_keyboards(custom_kb);
            void ((await query.answer("Action updated to Category!")));
            void ((await render_button_edit_panel(query, context, r_idx, c_idx)));
      } else if (pyT(pyStart(act, "subcat_"))) {
            subcat_path = pyReplace(act, "subcat_", "");
            pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx)["action"] = `subcat_${pyStr(subcat_path)}`;
            db.save_custom_keyboards(custom_kb);
            void ((await query.answer("Action updated to Sub-category!")));
            void ((await render_button_edit_panel(query, context, r_idx, c_idx)));
      } else if (pyT((pyEq(act, "custom")))) {
            context.user_data["admin_edit_kb_step"] = "custom_action";
            void ((await query.edit_message_text("✍️ <b>Type the custom callback data for this button:</b>\n\nType /cancel to abort.", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_kb_edit_btn_${pyStr(r_idx)}_${pyStr(c_idx)}` })]]) })));
      } else {
            pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx)["action"] = act;
            db.save_custom_keyboards(custom_kb);
            void ((await query.answer("Action modified successfully!")));
            void ((await render_button_edit_panel(query, context, r_idx, c_idx)));
      }
      return;
  } else if (pyT(pyStart(data, "adm_kb_edmove_"))) {
      direction = pyReplace(data, "adm_kb_edmove_", "");
      coords = pyGet(context.user_data, "admin_edit_kb_coords");
      if (pyT((!pyT(coords)))) {
            void ((await query.answer("Session expired!")));
            void ((await render_keyboard_settings_panel(query)));
            return;
      }
      [r_idx, c_idx] = coords;
      custom_kb = db.get_custom_keyboards();
      grid = pySub(custom_kb, "buttons");
      btn = pySub(pySub(grid, r_idx), c_idx);
      if (pyT((pyEq(direction, "left")))) {
            if (pyT(((c_idx > 0)))) {
                    const __un3 = ([pySub(pySub(grid, r_idx), (c_idx - 1)), pySub(pySub(grid, r_idx), c_idx)]); pySub(grid, r_idx)[c_idx] = __un3[0]; pySub(grid, r_idx)[(c_idx - 1)] = __un3[1];
                    c_idx -= 1;
                    void ((await query.answer("Moved left!")));
            } else {
                    void ((await query.answer("Already at the leftmost position!", { show_alert: true })));
            }
      } else if (pyT((pyEq(direction, "right")))) {
            if (pyT(((c_idx < (pyLen(pySub(grid, r_idx)) - 1))))) {
                    const __un4 = ([pySub(pySub(grid, r_idx), (c_idx + 1)), pySub(pySub(grid, r_idx), c_idx)]); pySub(grid, r_idx)[c_idx] = __un4[0]; pySub(grid, r_idx)[(c_idx + 1)] = __un4[1];
                    c_idx += 1;
                    void ((await query.answer("Moved right!")));
            } else {
                    void ((await query.answer("Already at the rightmost position!", { show_alert: true })));
            }
      } else if (pyT((pyEq(direction, "up")))) {
            if (pyT(((r_idx > 0)))) {
                    pyDel(pySub(grid, r_idx), c_idx);
                    if (pyT((!pyT(pySub(grid, r_idx))))) {
                              pyDel(grid, r_idx);
                              r_idx -= 1;
                    }
                    pyAppend(pySub(grid, r_idx), btn);
                    c_idx = (pyLen(pySub(grid, r_idx)) - 1);
                    void ((await query.answer("Moved up!")));
            } else {
                    void ((await query.answer("Already at the top row!", { show_alert: true })));
            }
      } else if (pyT((pyEq(direction, "down")))) {
            if (pyT(((r_idx < (pyLen(grid) - 1))))) {
                    pyDel(pySub(grid, r_idx), c_idx);
                    old_empty = false;
                    if (pyT((!pyT(pySub(grid, r_idx))))) {
                              pyDel(grid, r_idx);
                              old_empty = true;
                    }
                    t_idx = (pyT(old_empty) ? (r_idx) : ((r_idx + 1)));
                    pyAppend(pySub(grid, t_idx), btn);
                    r_idx = t_idx;
                    c_idx = (pyLen(pySub(grid, t_idx)) - 1);
                    void ((await query.answer("Moved down!")));
            } else {
                    void ((await query.answer("Already at the bottom row!", { show_alert: true })));
            }
      } else if (pyT((pyEq(direction, "new")))) {
            pyDel(pySub(grid, r_idx), c_idx);
            if (pyT((!pyT(pySub(grid, r_idx))))) {
                    pyDel(grid, r_idx);
            }
            pyAppend(grid, [btn]);
            r_idx = (pyLen(grid) - 1);
            c_idx = 0;
            void ((await query.answer("Moved to a new row!")));
      }
      db.save_custom_keyboards(custom_kb);
      context.user_data["admin_edit_kb_coords"] = [r_idx, c_idx];
      void ((await render_button_edit_panel(query, context, r_idx, c_idx)));
      return;
  } else if (pyT((pyEq(data, "adm_kb_pos")))) {
      pyPop(context.user_data, "kb_pos_sel", null);
      void ((await render_kb_position_panel(query, context)));
      return;
  } else if (pyT(pyStart(data, "adm_kb_pos_sel_"))) {
      try {
            [r_idx, c_idx] = pySplit(pyReplace(data, "adm_kb_pos_sel_", ""), "_", -1).map(x => pyInt(x));
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      grid = pyGet(db.get_custom_keyboards(), "buttons", []);
      if (pyT((!pyT((((__v33) => (pyT(__v33) ? (((0 <= c_idx) && (c_idx < pyLen(pySub(grid, r_idx))))) : __v33))(((0 <= r_idx) && (r_idx < pyLen(grid))))))))) {
            void ((await query.answer("❌ Not found!", { show_alert: true })));
            return;
      }
      cur = pyGet(context.user_data, "kb_pos_sel");
      if (pyT((((__v34) => (pyT(__v34) ? __v34 : ((pyEq(cur, [r_idx, c_idx])))))((pyEq(cur, [r_idx, c_idx])))))) {
            pyPop(context.user_data, "kb_pos_sel", null);
            void ((await query.answer("Selection cleared!")));
      } else {
            context.user_data["kb_pos_sel"] = [r_idx, c_idx];
            void ((await query.answer(`✅ Selected: ${pyStr(pySlice(pyGet(pySub(pySub(grid, r_idx), c_idx), "text", ""), null, 20, null))}`)));
      }
      void ((await render_kb_position_panel(query, context)));
      return;
  } else if (pyT(pyStart(data, "adm_kb_pos_"))) {
      direction = pyReplace(data, "adm_kb_pos_", "");
      if (pyT(((!pyContains(["left", "right", "up", "down"], direction))))) {
            return;
      }
      sel = pyGet(context.user_data, "kb_pos_sel");
      if (pyT((!pyT(sel)))) {
            void ((await query.answer("⚠️ আগে কোনো button select করুন!", { show_alert: true })));
            return;
      }
      [r_idx, c_idx] = sel;
      custom_kb = db.get_custom_keyboards();
      grid = pyGet(custom_kb, "buttons", []);
      if (pyT((!pyT((((__v35) => (pyT(__v35) ? (((0 <= c_idx) && (c_idx < pyLen(pySub(grid, r_idx))))) : __v35))(((0 <= r_idx) && (r_idx < pyLen(grid))))))))) {
            pyPop(context.user_data, "kb_pos_sel", null);
            void ((await query.answer("❌ Not found!", { show_alert: true })));
            void ((await render_kb_position_panel(query, context)));
            return;
      }
      btn = pySub(pySub(grid, r_idx), c_idx);
      moved = false;
      if (pyT((pyEq(direction, "left")))) {
            if (pyT(((c_idx > 0)))) {
                    const __un5 = ([pySub(pySub(grid, r_idx), (c_idx - 1)), pySub(pySub(grid, r_idx), c_idx)]); pySub(grid, r_idx)[c_idx] = __un5[0]; pySub(grid, r_idx)[(c_idx - 1)] = __un5[1];
                    c_idx -= 1;
                    moved = true;
            } else if (pyT(((r_idx > 0)))) {
                    t = (r_idx - 1);
                    pyPop(pySub(grid, r_idx), c_idx);
                    if (pyT((!pyT(pySub(grid, r_idx))))) {
                              pyDel(grid, r_idx);
                    }
                    pyAppend(pySub(grid, t), btn);
                    [r_idx, c_idx] = [t, (pyLen(pySub(grid, t)) - 1)];
                    moved = true;
            }
      } else if (pyT((pyEq(direction, "right")))) {
            if (pyT(((c_idx < (pyLen(pySub(grid, r_idx)) - 1))))) {
                    const __un6 = ([pySub(pySub(grid, r_idx), (c_idx + 1)), pySub(pySub(grid, r_idx), c_idx)]); pySub(grid, r_idx)[c_idx] = __un6[0]; pySub(grid, r_idx)[(c_idx + 1)] = __un6[1];
                    c_idx += 1;
                    moved = true;
            } else if (pyT(((r_idx < (pyLen(grid) - 1))))) {
                    pyPop(pySub(grid, r_idx), c_idx);
                    if (pyT((!pyT(pySub(grid, r_idx))))) {
                              pyDel(grid, r_idx);
                              t = r_idx;
                    } else {
                              t = (r_idx + 1);
                    }
                    pyInsert(pySub(grid, t), 0, btn);
                    [r_idx, c_idx] = [t, 0];
                    moved = true;
            }
      } else if (pyT((pyEq(direction, "up")))) {
            if (pyT(((r_idx > 0)))) {
                    t = (r_idx - 1);
                    tc = pyMin(c_idx, (pyLen(pySub(grid, t)) - 1));
                    pyPop(pySub(grid, r_idx), c_idx);
                    if (pyT((!pyT(pySub(grid, r_idx))))) {
                              pyDel(grid, r_idx);
                    }
                    pyInsert(pySub(grid, t), tc, btn);
                    [r_idx, c_idx] = [t, tc];
                    moved = true;
            }
      } else if (pyT((pyEq(direction, "down")))) {
            if (pyT(((r_idx < (pyLen(grid) - 1))))) {
                    pyPop(pySub(grid, r_idx), c_idx);
                    if (pyT((!pyT(pySub(grid, r_idx))))) {
                              pyDel(grid, r_idx);
                              t = r_idx;
                    } else {
                              t = (r_idx + 1);
                    }
                    tc = pyMin(c_idx, (pyLen(pySub(grid, t)) - 1));
                    pyInsert(pySub(grid, t), tc, btn);
                    [r_idx, c_idx] = [t, tc];
                    moved = true;
            }
      }
      if (pyT(moved)) {
            db.save_custom_keyboards(custom_kb);
            context.user_data["kb_pos_sel"] = [r_idx, c_idx];
            void ((await query.answer("✅")));
      } else {
            void ((await query.answer("⚠️ আর এদিকে যাওয়া যাবে না!", { show_alert: true })));
      }
      void ((await render_kb_position_panel(query, context)));
      return;
  } else if (pyT((pyEq(data, "adm_kb_resize_cols_prompt")))) {
      custom_kb = db.get_custom_keyboards();
      grid = pyGet(custom_kb, "buttons", []);
      cur = ((() => { const __acc = []; for (const r of pyIter(grid)) { __acc.push(pyLen(r)); } return __acc; })()).reduce((a, b) => Math.max(a, b), 1);
      keyboard = [[InlineKeyboardButton(`Columns: ${pyStr(cur)}`, { callback_data: "noop_kbpg" }), InlineKeyboardButton("1", { callback_data: "adm_kb_resize_do_1" }), InlineKeyboardButton("2", { callback_data: "adm_kb_resize_do_2" }), InlineKeyboardButton("3", { callback_data: "adm_kb_resize_do_3" })], [InlineKeyboardButton("⬅️Back", { callback_data: "adm_keyboard_settings" })]];
      void ((await query.edit_message_text("📐 <b>Koita column thakbe?</b>\n\nChapun — sob button auto sajano hobe:", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  } else if (pyT(pyStart(data, "adm_kb_resize_do_"))) {
      cols = pyInt(pyReplace(data, "adm_kb_resize_do_", ""));
      custom_kb = db.get_custom_keyboards();
      grid = pyGet(custom_kb, "buttons", []);
      flat_buttons = [];
      for (const row of pyIter(grid)) {
            for (const btn of pyIter(row)) {
                    pyAppend(flat_buttons, btn);
            }
      }
      new_grid = [];
      for (const i of pyIter(pyRange(0, pyLen(flat_buttons), cols))) {
            pyAppend(new_grid, pySlice(flat_buttons, i, (i + cols), null));
      }
      custom_kb["buttons"] = new_grid;
      db.save_custom_keyboards(custom_kb);
      void ((await query.answer(`✅ Keyboard layout resized to ${pyStr(cols)} columns!`)));
      void ((await render_keyboard_settings_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_kb_colors")))) {
      void ((await render_kb_colors_panel(query, 0)));
      return;
  } else if (pyT(pyStart(data, "adm_kb_colors_pg_"))) {
      try {
            _pg = pyInt(pyReplace(data, "adm_kb_colors_pg_", ""));
      } catch (__e) {
            _pg = 0;
      }
      void ((await render_kb_colors_panel(query, _pg)));
      return;
  } else if (pyT((pyEq(data, "noop_kbcolor_pg")))) {
      void ((await query.answer()));
      return;
  } else if (pyT(pyStart(data, "adm_kb_color_set_"))) {
      style = pyReplace(data, "adm_kb_color_set_", "");
      if (pyT(((!pyContains(["primary", "success", "danger", "none"], style))))) {
            void ((await query.answer("❌ Invalid color!", { show_alert: true })));
            return;
      }
      coords = pyGet(context.user_data, "admin_kb_color_coords");
      back = (((__v36) => (pyT(__v36) ? __v36 : ({ page: 0, to: "colors" })))(pyGet(context.user_data, "admin_kb_color_back")));
      if (pyT((!pyT(coords)))) {
            void ((await query.answer("Session expired!")));
            try {
                    _bpg = pyInt(pyGet(back, "page", 0));
            } catch (__e) {
                    _bpg = 0;
            }
            void ((await render_kb_colors_panel(query, _bpg)));
            return;
      }
      [r_idx, c_idx] = coords;
      custom_kb = db.get_custom_keyboards();
      try {
            btn = pySub(pySub(pySub(custom_kb, "buttons"), r_idx), c_idx);
      } catch (__e) {
            void ((await query.answer("❌ Not found!", { show_alert: true })));
            return;
      }
      if (pyT((pyEq(style, "none")))) {
            pyPop(btn, "style", null);
      } else {
            btn["style"] = style;
      }
      db.save_custom_keyboards(custom_kb);
      pyPop(context.user_data, "admin_kb_color_coords", null);
      pyPop(context.user_data, "admin_kb_color_back", null);
      void ((await query.answer(`✅ ${pyStr(pyGet(BUTTON_STYLE_DOT, style, "⚪"))} ${pyStr(pyGet(BUTTON_STYLE_NAME, style, "Default"))}!`)));
      if (pyT((pyEq(pyGet(back, "to"), "edit")))) {
            void ((await render_button_edit_panel(query, context, r_idx, c_idx)));
      } else {
            try {
                    _bpg = pyInt(pyGet(back, "page", 0));
            } catch (__e) {
                    _bpg = 0;
            }
            void ((await render_kb_colors_panel(query, _bpg)));
      }
      return;
  } else if (pyT(pyStart(data, "adm_kb_color_"))) {
      rest = pyReplace(data, "adm_kb_color_", "");
      try {
            { const _rpi = rest.lastIndexOf("_p"); head = _rpi === -1 ? "" : rest.slice(0, _rpi); _ = "_p"; pg_s = _rpi === -1 ? rest : rest.slice(_rpi + 2); }
            [r_idx, c_idx] = pySplit(head, "_", -1).map(x => pyInt(x));
            back_page = pyInt(pg_s);
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      void ((await render_kb_color_picker(query, context, r_idx, c_idx, back_page, "colors")));
      return;
  }
  if (pyT((pyEq(data, "adm_main")))) {
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
            void ((await query.answer("⛔ You currently do not have permissions for any admin modules.", { show_alert: true })));
            return;
      }
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: keyboard })));
      } else {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: keyboard })));
      }
  } else if (pyT((pyEq(data, "adm_toggle_maintenance")))) {
      current = db.get_setting("maintenance_mode", false);
      new_val = (!pyT(current));
      db.set_setting("maintenance_mode", new_val);
      status_word = (pyT(new_val) ? ("enabled") : ("disabled"));
      void ((await query.answer(`🛠️ Maintenance Mode has been ${pyStr(status_word)}!`, { show_alert: true })));
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
      fake_query = FakeCallbackQuery(query.message, "adm_main", query.from_user);
          class FakeUpdate {
                constructor(message, callback_query) {
                        this.message = message;
                        this.callback_query = callback_query;
                        this.effective_user = callback_query.from_user;
                        this.effective_chat = message.chat;
                }
          }
      void ((await handle_admin_callback(FakeUpdate(query.message, fake_query), context)));
      return;
  } else if (pyT((((__v37) => (pyT(__v37) ? __v37 : ((pyEq(data, "adm_toggle_home_btn_kb")))))((pyEq(data, "adm_toggle_home_btn")))))) {
      new_val = db.toggle_home_button();
      status_word = (pyT(new_val) ? ("🟢 ON (Enabled)") : ("🔴 OFF (Disabled)"));
      void ((await query.answer(`⚜️ HOME Button is now ${pyStr(status_word)}!`, { show_alert: true })));
      if (pyT((pyEq(data, "adm_toggle_home_btn_kb")))) {
            void ((await render_keyboard_settings_panel(query)));
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
            fake_query = FakeCallbackQuery(query.message, "adm_bot_settings", query.from_user);
                  class FakeUpdate {
                          constructor(message, callback_query) {
                                    this.message = message;
                                    this.callback_query = callback_query;
                                    this.effective_user = callback_query.from_user;
                                    this.effective_chat = message.chat;
                          }
                  }
            void ((await handle_admin_callback(FakeUpdate(query.message, fake_query), context)));
      }
      return;
  } else if (pyT((((__v38) => (pyT(__v38) ? __v38 : ((pyEq(data, "adm_toggle_view_all_courses_kb")))))((pyEq(data, "adm_toggle_view_all_courses")))))) {
      new_val = db.toggle_view_all_courses();
      status_word = (pyT(new_val) ? ("🟢 ON (Enabled)") : ("🔴 OFF (Disabled)"));
      void ((await query.answer(`📚 Browse All Courses Button is now ${pyStr(status_word)}!`, { show_alert: true })));
      if (pyT((pyEq(data, "adm_toggle_view_all_courses_kb")))) {
            void ((await render_keyboard_settings_panel(query)));
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
            fake_query = FakeCallbackQuery(query.message, "adm_bot_settings", query.from_user);
                  class FakeUpdate {
                          constructor(message, callback_query) {
                                    this.message = message;
                                    this.callback_query = callback_query;
                                    this.effective_user = callback_query.from_user;
                                    this.effective_chat = message.chat;
                          }
                  }
            void ((await handle_admin_callback(FakeUpdate(query.message, fake_query), context)));
      }
      return;
  } else if (pyT((((__v39) => (pyT(__v39) ? __v39 : (pyStart(data, "adm_subrow_"))))(pyStart(data, "adm_catrow_"))))) {
      is_cat = pyStart(data, "adm_catrow_");
      try {
            n = pyInt(pyReplace(pyReplace(data, "adm_catrow_", ""), "adm_subrow_", ""));
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      n = pyMax(1, pyMin(4, n));
      if (pyT(is_cat)) {
            db.set_category_row_size(n);
            void ((await query.answer(`📁 Category: 1 line-e ${pyStr(n)} ta button!`, { show_alert: true })));
      } else {
            db.set_subcategory_row_size(n);
            void ((await query.answer(`📂 Sub-Category: 1 line-e ${pyStr(n)} ta button!`, { show_alert: true })));
      }
          class _FQ {
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
      _fq = _FQ(query.message, "adm_bot_settings", query.from_user);
          class _FU {
                constructor(message, callback_query) {
                        this.message = message;
                        this.callback_query = callback_query;
                        this.effective_user = callback_query.from_user;
                        this.effective_chat = message.chat;
                }
          }
      void ((await handle_admin_callback(_FU(query.message, _fq), context)));
      return;
  } else if (pyT((pyEq(data, "adm_welcome_media_upload")))) {
      context.user_data["admin_welcome_media_wait"] = true;
      pyPop(context.user_data, "admin_msg_edit_key", null);
      void ((await query.edit_message_text("🖼️ <b>Welcome Photo/GIF Upload</b>\n━━━━━━━━━━━━━━━━━━━━\n\n👉 এখন একটা <b>Photo</b> অথবা <b>GIF/Animation</b> পাঠান।\nএটাই /start-এ welcome text-এর সাথে caption হিসেবে যাবে।\n\n❌ বাতিল করতে /cancel লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Back to Welcome Msg", { callback_data: "adm_editmsg_welcome_message" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_welcome_media_remove")))) {
      db.set_setting("welcome_media_type", "none");
      db.set_setting("welcome_media_file_id", "");
      void ((await query.answer("🗑️ Welcome photo/GIF removed! (এখন text only)", { show_alert: true })));
          class _FQ2 {
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
      _fq2 = _FQ2(query.message, "adm_editmsg_welcome_message", query.from_user);
          class _FU2 {
                constructor(message, callback_query) {
                        this.message = message;
                        this.callback_query = callback_query;
                        this.effective_user = callback_query.from_user;
                        this.effective_chat = message.chat;
                }
          }
      void ((await handle_admin_callback(_FU2(query.message, _fq2), context)));
      return;
  } else if (pyT((pyEq(data, "adm_bot_settings")))) {
      const get_status_str = (key, default_desc) => {
        if (default_desc === undefined) default_desc = ("(using default)");
        let preview, val;
        val = db.get_setting(key, "");
        if (pyT(val)) {
            preview = (pyT(((pyLen(pyStr(val)) > 40))) ? ((pyReplace(pySlice(val, null, 40, null), "\n", " ") + "...")) : (pyReplace(val, "\n", " ")));
            return (`🟢 <b>Customized</b>
    ↳ <code>${pyStr(pyHtmlEscape(preview))}</code>`);
        } else {
            return (`🔴 <i>${pyStr(default_desc)}</i>`);
        }
      };
      home_btn_enabled = db.is_home_button_enabled();
      home_btn_status = (pyT(home_btn_enabled) ? ("🟢 <b>Enabled (Showing)</b>") : ("🔴 <b>Disabled (Hidden)</b>"));
      view_all_enabled = db.is_view_all_courses_enabled();
      view_all_status = (pyT(view_all_enabled) ? ("🟢 <b>Enabled (Showing)</b>") : ("🔴 <b>Disabled (Hidden)</b>"));
      [_wm_type, _wm_fid] = get_welcome_media();
      if (pyT((pyEq(_wm_type, "photo")))) {
            welcome_media_status = "🖼️ <b>Photo সেট করা আছে</b> (/start-এ ছবিসহ আসবে)";
      } else if (pyT((pyEq(_wm_type, "animation")))) {
            welcome_media_status = "🎞️ <b>GIF/Animation সেট করা আছে</b> (/start-এ GIF সহ আসবে)";
      } else {
            welcome_media_status = "🔴 <i>কোনো ছবি/GIF নেই (text only)</i>";
      }
      welcome_status = get_status_str("welcome_message");
      bot_desc_status = get_status_str("bot_description", "Default (Bengali preview)");
      delivery_status = get_status_str("delivery_message");
      maintenance_status = get_status_str("maintenance_message");
      fallback_status = get_status_str("fallback_message");
      info_status = get_status_str("info_message");
      msg = `⚙️ <b>Bot Settings Panel</b>
━━━━━━━━━━━━━━━━━━━━
Here is the status of your bot's automated messages & buttons:

⚜️ <b>Inline HOME Button:</b>
${pyStr(home_btn_status)}

📚 <b>Browse All Courses Button:</b>
${pyStr(view_all_status)}

👋 <b>Start / Welcome Message:</b>
${pyStr(welcome_status)}

🖼️ <b>Welcome Photo/GIF:</b>
${pyStr(welcome_media_status)}

🤖 <b>Bot Description (What can this bot do?):</b>
${pyStr(bot_desc_status)}

📦 <b>Delivery Message:</b>
${pyStr(delivery_status)}

🛠️ <b>Maintenance Message:</b>
${pyStr(maintenance_status)}

🔄 <b>Fallback Message:</b>
${pyStr(fallback_status)}

ℹ️ <b>Info / Help Message:</b>
${pyStr(info_status)}

👇 <b>Select a setting to modify or toggle:</b>`;
      keyboard = [[InlineKeyboardButton(`⚜️ HOME: ${pyStr((pyT(home_btn_enabled) ? ("ON 🟢") : ("OFF 🔴")))}`, { callback_data: "adm_toggle_home_btn" }), InlineKeyboardButton(`📚 All Courses: ${pyStr((pyT(view_all_enabled) ? ("ON 🟢") : ("OFF 🔴")))}`, { callback_data: "adm_toggle_view_all_courses" })], [InlineKeyboardButton(`⚙️ Min Limit: ৳${pyStr(db.get_min_withdraw_amount())}`, { callback_data: "adm_wdr_min" })], [InlineKeyboardButton("👋 Welcome Msg", { callback_data: "adm_editmsg_welcome_message" }), InlineKeyboardButton("🤖 Bot Description", { callback_data: "adm_editmsg_bot_description" })], [InlineKeyboardButton("📦 Delivery Msg", { callback_data: "adm_editmsg_delivery_message" }), InlineKeyboardButton("🛠️ Maint Msg", { callback_data: "adm_editmsg_maintenance_message" })], [InlineKeyboardButton("🔄 Fallback Msg", { callback_data: "adm_fallback_mgr" }), InlineKeyboardButton("🎨 Button Colors", { callback_data: "adm_btn_colors" })], [InlineKeyboardButton("🛒 Cart Settings", { callback_data: "adm_cart_settings" })], [InlineKeyboardButton("🏡 Home Buttons Settings", { callback_data: "adm_home_buttons" }), InlineKeyboardButton("ℹ️ Info Button Settings", { callback_data: "adm_info_buttons" })], [InlineKeyboardButton("« Back to Admin Menu", { callback_data: "adm_main" })]];
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else if (pyT((pyEq(data, "adm_rm_admin_menu")))) {
      admins = db.get_admins();
      removable_admins = ((() => { const __acc = []; for (const aid of pyIter(admins)) { if (!pyT((!pyT((((__v40) => (pyT(__v40) ? ((pyEq(aid, pySub(ADMIN_IDS, 0)))) : __v40))(((pyLen(ADMIN_IDS) > 0)))))))) continue; __acc.push(aid); } return __acc; })());
      if (pyT((!pyT(removable_admins)))) {
            void ((await query.answer("কোনো সেকেন্ডারি এডমিন নেই যাকে রিমুভ করা যাবে!", { show_alert: true })));
            return;
      }
      keyboard = [];
      for (const aid of pyIter(removable_admins)) {
            u = db.get_user(aid);
            u_name = (((__v42) => (pyT(__v42) ? __v42 : (((__v41) => (pyT(__v41) ? __v41 : (pyStr(aid))))(pyGet(u, "username")))))(pyGet(u, "full_name")));
            pyAppend(keyboard, [InlineKeyboardButton(`✕ Remove: ${pyStr(pySlice(u_name, null, 18, null))} (${pyStr(aid)})`, { callback_data: `adm_rmadmin_${pyStr(aid)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Back to Admin List", { callback_data: "adm_admin_list" })]);
      msg = "<blockquote>✕ <b>[ Remove Admin Role ]</b></blockquote>\n\n<blockquote>⚠️ যাকে এডমিন পদ থেকে অপসারণ করতে চান তার নামের বাটনে চাপুন:</blockquote>";
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_rmadmin_"))) {
      target_uid = pyInt(pyReplace(data, "adm_rmadmin_", ""));
      removed = db.remove_admin(target_uid);
      if (pyT(removed)) {
            try {
                    void ((await context.bot.send_message(target_uid, "ℹ️ **Your admin access has been revoked.**\nContact the owner for help.", { parse_mode: "Markdown" })));
            } catch (__e) {
            }
            void ((await query.answer(`✅ User ${pyStr(target_uid)} removed from admins!`, { show_alert: true })));
      } else {
            void ((await query.answer("⛔ Cannot remove the Primary Owner!", { show_alert: true })));
      }
      admins = db.get_admins();
      admin_lines = [];
      for (const aid of pyIter(admins)) {
            u = db.get_user(aid);
            u_name = (pyT(u) ? (pyHtmlEscape(pyGet(u, "full_name", "N/A"))) : (`ID: ${pyStr(aid)}`));
            u_user = (pyT((((__v43) => (pyT(__v43) ? (pyGet(u, "username")) : __v43))(u))) ? (` (@${pyStr(pyHtmlEscape(pyGet(u, "username")))})`) : (""));
            is_root = (pyT((((__v44) => (pyT(__v44) ? ((pyEq(aid, pySub(ADMIN_IDS, 0)))) : __v44))(((pyLen(ADMIN_IDS) > 0))))) ? (" 👑 <i>[Super Admin / Owner]</i>") : (" 🛡️ <i>[Admin]</i>"));
            pyAppend(admin_lines, `• <b>${pyStr(u_name)}</b>${pyStr(u_user)} — <code>${pyStr(aid)}</code>${pyStr(is_root)}`);
      }
      list_text = (pyT(admin_lines) ? (pyJoin("\n", admin_lines)) : ("<i>কোনো এডমিন পাওয়া যায়নি</i>"));
      msg = `<blockquote>👑 <b>Admin Team & Role Management</b></blockquote>

<blockquote>📋 <b>বর্তমান এডমিন তালিকা (${pyStr(pyLen(admins))} জন):</b>
${pyStr(list_text)}</blockquote>

<blockquote>💡 নতুন এডমিন যুক্ত করতে নিচের <b>➕ Add New Admin</b> বাটনে চাপুন।</blockquote>`;
      keyboard = [];
      for (const aid of pyIter(admins)) {
            u = db.get_user(aid);
            u_name = (((__v46) => (pyT(__v46) ? __v46 : (((__v45) => (pyT(__v45) ? __v45 : (pyStr(aid))))(pyGet(u, "username")))))(pyGet(u, "full_name")));
            pyAppend(keyboard, [InlineKeyboardButton(`👤 ${pyStr(pySlice(u_name, null, 20, null))} (ID: ${pyStr(aid)})`, { callback_data: `adm_uview_${pyStr(aid)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("➕ Add New Admin", { callback_data: "adm_add_admin" }), InlineKeyboardButton("✕ Remove Admin", { callback_data: "adm_rm_admin_menu" })]);
      pyAppend(keyboard, [InlineKeyboardButton("« User Management", { callback_data: "adm_users" })]);
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_editmsg_"))) {
      msg_key = pyReplace(data, "adm_editmsg_", "");
      if (pyT((pyEq(msg_key, "delivery_message")))) {
            const get_status_str_short = (key, default_val) => {
              let preview, val;
              val = db.get_setting(key, "");
              if (pyT((!pyT(val)))) {
                  val = default_val;
              }
              preview = (pyT(((pyLen(pyStr(val)) > 80))) ? ((pyReplace(pySlice(val, null, 80, null), "\n", " ") + "...")) : (pyReplace(val, "\n", " ")));
              return (`<code>${pyStr(pyHtmlEscape(preview))}</code>`);
            };
            df_free_wl = "🎉 **Your Course Access is Confirmed!**\n\n**Course:** {course_name}\n\n👇 Click the button below to join your course:\n{access_text}";
            df_free_nl = "🎉 **Your Course Access is Confirmed!**\n\n**Course:** {course_name}\n\n⚠️ No direct link is currently available. Please contact admin.";
            df_paid_wl = "🎉 **Your Course Purchase was Successful!**\n\n**Course:** {course_name}\n**Order ID:** `{order_id}`\n\n✅ **Payment completed successfully.**\n\n👇 Click the button below to join your course:\n{access_text}";
            df_paid_nl = "🎉 **Your Course Purchase was Successful!**\n\n**Course:** {course_name}\n**Order ID:** `{order_id}`\n\n✅ **Payment completed successfully.**\n\n⚠️ No direct link is attached to this course. Please contact support.";
            msg = `📦 <b>Delivery Text Settings</b>
━━━━━━━━━━━━━━━━━━━━

🆕 <b>Free Course — With Link:</b>
${pyStr(get_status_str_short("delivery_free_with_link", df_free_wl))}

🆕 <b>Free Course — No Link:</b>
${pyStr(get_status_str_short("delivery_free_no_link", df_free_nl))}

💳 <b>Paid Course — With Link:</b>
${pyStr(get_status_str_short("delivery_paid_with_link", df_paid_wl))}

💳 <b>Paid Course — No Link:</b>
${pyStr(get_status_str_short("delivery_paid_no_link", df_paid_nl))}`;
            keyboard = [[InlineKeyboardButton("✏️ 🆕 Free Course — With Link", { callback_data: "adm_editmsg_delivery_free_with_link" })], [InlineKeyboardButton("✏️ 🆕 Free Course — No Link", { callback_data: "adm_editmsg_delivery_free_no_link" })], [InlineKeyboardButton("✏️ 💳 Paid Course — With Link", { callback_data: "adm_editmsg_delivery_paid_with_link" })], [InlineKeyboardButton("✏️ 💳 Paid Course — No Link", { callback_data: "adm_editmsg_delivery_paid_no_link" })], [InlineKeyboardButton("◀️ Back", { callback_data: "adm_bot_settings" })]];
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
            return;
      }
      context.user_data["admin_msg_edit_key"] = msg_key;
      if (pyT((pyEq(msg_key, "info_message")))) {
            current_val = (((__v47) => (pyT(__v47) ? __v47 : (db.get_setting(msg_key, ""))))(pyGet(db.get_info_settings(), "header_text", "")));
      } else {
            current_val = db.get_setting(msg_key, "");
      }
      display_key = pyTitle(pyReplace(msg_key, "_", " "));
      if (pyT(current_val)) {
            preview = `📝 <b>Current:</b>
<blockquote>${pyStr(pyHtmlEscape(pySlice(current_val, null, 500, null)))}</blockquote>`;
      } else {
            preview = "📝 <b>Current:</b> <i>(Using default message)</i>";
      }
      if (pyT((pyEq(msg_key, "info_message")))) {
            cancel_data = "adm_info_buttons";
      } else if (pyT(pyStart(msg_key, "delivery_"))) {
            cancel_data = "adm_editmsg_delivery_message";
      } else if (pyT(pyStart(msg_key, "cart_"))) {
            cancel_data = "adm_cart_settings";
      } else {
            cancel_data = "adm_bot_settings";
      }
      edit_kb = [[InlineKeyboardButton("« Cancel", { callback_data: cancel_data })]];
      if (pyT(current_val)) {
            pyAppend(pySub(edit_kb, 0), InlineKeyboardButton("🗑️ Reset to Default", { callback_data: `adm_resetmsg_${pyStr(msg_key)}` }));
      }
      if (pyT((pyEq(msg_key, "welcome_message")))) {
            try {
                    [_wm_t, _wm_f] = get_welcome_media();
            } catch (__e) {
                    [_wm_t, _wm_f] = ["none", ""];
            }
            if (pyT((pyEq(_wm_t, "photo")))) {
                    _wm_line = "🖼️ <b>Photo:</b> 🖼️ সেট করা আছে";
            } else if (pyT((pyEq(_wm_t, "animation")))) {
                    _wm_line = "🖼️ <b>Photo/GIF:</b> 🎞️ GIF সেট করা আছে";
            } else {
                    _wm_line = "🖼️ <b>Photo/GIF:</b> <i>নেই (text only)</i>";
            }
            preview = `${pyStr(preview)}

${pyStr(_wm_line)}`;
            pyAppend(edit_kb, [InlineKeyboardButton("🖼️ Upload Photo/GIF", { callback_data: "adm_welcome_media_upload" })]);
            if (pyT((((__v48) => (pyT(__v48) ? (_wm_f) : __v48))((pyContains(["photo", "animation"], _wm_t)))))) {
                    pyAppend(edit_kb, [InlineKeyboardButton("🗑️ Remove Photo/GIF", { callback_data: "adm_welcome_media_remove" })]);
            }
      }
      help_text = "";
      if (pyT(pyStart(msg_key, "delivery_"))) {
            help_text = "\n💡 <i>Supported placeholders:</i> <code>{course_name}</code> (or <code>${courseName}</code>), <code>{order_id}</code>, <code>{amount}</code>, <code>{access_text}</code>\n";
      }
      if (pyT(pyStart(msg_key, "cart_"))) {
            help_text = "\n💡 <i>Placeholders (filled cart):</i> <code>{count}</code>, <code>{total}</code>\n<i>Button যোগ করতে আলাদা লাইনে লিখুন:</i> <code>[Button Text | callback_or_URL]</code>\n<i>• এক লাইনে একাধিক দিলে এক row-তে আসবে • callback e.g. browse_categories • URL e.g. https://t.me/username</i>\n";
      }
      if (pyT((pyEq(msg_key, "fallback_message")))) {
            help_text = "\n💡 <i>Button যোগ করতে আলাদা লাইনে লিখুন:</i> <code>[Button Text | callback_or_URL]</code>\n<i>• এক লাইনে একাধিক দিলে এক row-তে আসবে • callback e.g. browse_categories • URL e.g. https://t.me/username</i>\n<i>• কোনো button line না দিলে কোনো button দেখাবে না</i>\n";
      }
      if (pyT((pyContains(["cart_empty_message", "cart_message"], msg_key)))) {
            raw_prev = (((__v49) => (pyT(__v49) ? __v49 : ((pyT((pyEq(msg_key, "cart_empty_message"))) ? (DEFAULT_CART_EMPTY) : (DEFAULT_CART_HEADER)))))(current_val));
            if (pyT((pyEq(msg_key, "cart_message")))) {
                    raw_prev = pyReplace(pyReplace(raw_prev, "{count}", "2"), "{total}", "500");
            }
            try {
                    [_pb, _pbtns] = parse_inline_buttons(raw_prev);
            } catch (__e) {
                    [_pb, _pbtns] = [raw_prev, []];
            }
            if (pyT(_pbtns)) {
                    _flat = ((() => { const __acc = []; for (const row of pyIter(_pbtns)) { for (const b of pyIter(row)) { __acc.push(b.text); } } return __acc; })());
                    preview += `

👀 <b>Live Preview:</b> ${pyStr(pyLen(_flat))} button(s) → ${pyStr(pyHtmlEscape(pyJoin(" | ", _flat)))}`;
            } else {
                    preview += "\n\n👀 <b>Live Preview:</b> <i>no custom buttons (core buttons only)</i>";
            }
            help_text += "\n✅ <i>Ready callbacks:</i> <code>browse_categories</code>, <code>browse_ebooks</code>, <code>cart</code>, <code>my_courses_nav</code>, <code>my_ebooks_nav</code>, <code>back_to_main_menu</code>\n";
            if (pyT((pyEq(msg_key, "cart_empty_message")))) {
                    pyAppend(edit_kb, [InlineKeyboardButton("📄 Standard Template", { callback_data: "adm_cartpreset_empty_1" })]);
                    pyAppend(edit_kb, [InlineKeyboardButton("📄 বাংলা টেমপ্লেট", { callback_data: "adm_cartpreset_empty_2" })]);
            }
      }
      void ((await query.edit_message_text(`✏️ <b>Edit ${pyStr(display_key)}</b>
━━━━━━━━━━━━━━━━━━━━

${pyStr(preview)}
${pyStr(help_text)}
👇 <b>Send the new message:</b>
(Or use the buttons below to abort or reset)`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(edit_kb) })));
  } else if (pyT(pyStart(data, "adm_resetmsg_"))) {
      msg_key = pyReplace(data, "adm_resetmsg_", "");
      db.delete_setting(msg_key);
      if (pyT((pyEq(msg_key, "info_message")))) {
            try {
                    _icfg = db.get_info_settings();
                    _icfg["header_text"] = "";
                    db.save_info_settings(_icfg);
            } catch (__e) {
            }
      }
      if (pyT((pyEq(msg_key, "bot_description")))) {
            try {
                    void ((await context.bot.set_my_description({ description: DEFAULT_BOT_DESCRIPTION })));
            } catch (e) {
                    logger.error(`Failed to reset bot description on Telegram: ${pyStr(e)}`);
            }
      }
      display_key = pyTitle(pyReplace(msg_key, "_", " "));
      void ((await query.answer(`✅ Reset ${pyStr(display_key)} to default!`, { show_alert: true })));
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
      if (pyT((pyEq(msg_key, "info_message")))) {
            fake_data = "adm_info_buttons";
      } else if (pyT((pyEq(msg_key, "fallback_message")))) {
            fake_data = "adm_fallback_mgr";
      } else if (pyT(pyStart(msg_key, "delivery_"))) {
            fake_data = "adm_editmsg_delivery_message";
      } else if (pyT(pyStart(msg_key, "cart_"))) {
            fake_data = "adm_cart_settings";
      } else {
            fake_data = "adm_bot_settings";
      }
      fake_query = FakeCallbackQuery(query.message, fake_data, query.from_user);
          class FakeUpdate {
                constructor(message, callback_query) {
                        this.message = message;
                        this.callback_query = callback_query;
                        this.effective_user = callback_query.from_user;
                        this.effective_chat = message.chat;
                }
          }
      void ((await handle_admin_callback(FakeUpdate(query.message, fake_query), context)));
      return;
  } else if (pyT((pyEq(data, "adm_payments")))) {
      methods = db.get_payment_methods();
      note = db.get_payment_note();
      msg = `⚙ <b>Payment Settings Management</b>
━━━━━━━━━━━━━━━━━━━━

📋 <b>Active Payment Methods (${pyStr(pyLen(methods))}):</b>`;
      keyboard = [];
      for (const m of pyIter(methods)) {
            st_icon = (pyT((pyEq(pyGet(m, "status"), "active"))) ? ("🟢") : ("🔴"));
            msg += `
• ${pyStr(st_icon)} <b>${pyStr(pySub(m, "name"))}:</b> <code>${pyStr(pySub(m, "number"))}</code> (${pyStr(pyHtmlEscape(pyGet(m, "instruction", "Personal")))})`;
            pyAppend(keyboard, [InlineKeyboardButton(`⚙ Manage: ${pyStr(pySub(m, "name"))} (${pyStr(pySub(m, "number"))})`, { callback_data: `adm_paym_${pyStr(pySub(m, "key"))}` })]);
      }
      note_display = (pyT(note) ? (pyHtmlEscape(note)) : ("<i>(None)</i>"));
      msg += `

📝 <b>Current Payment Disclaimer / Notes:</b>
${pyStr(note_display)}`;
      pyAppend(keyboard, [InlineKeyboardButton("➕ Add Payment Method", { callback_data: "adm_add_paym" })]);
      pyAppend(keyboard, [InlineKeyboardButton("📝 Edit Payment Notes", { callback_data: "adm_edit_paynote" }), InlineKeyboardButton("🗑️ Clear Note", { callback_data: "adm_del_paynote" })]);
      pyAppend(keyboard, [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]);
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_paym_"))) {
      pkey = pyReplace(data, "adm_paym_", "");
      m = db.get_payment_method(pkey);
      if (pyT((!pyT(m)))) {
            void ((await query.answer("Payment method not found!")));
            return;
      }
      st_text = (pyT((pyEq(pyGet(m, "status"), "active"))) ? ("Active 🟢") : ("Inactive 🔴"));
      msg = `💳 <b>${pyStr(pyHtmlEscape(pySub(m, "name")))} Settings</b>
━━━━━━━━━━━━━━━━━━━━

📱 <b>Number:</b> <code>${pyStr(pyHtmlEscape(pySub(m, "number")))}</code>
⚙ <b>Instruction:</b> ${pyStr(pyHtmlEscape(pyGet(m, "instruction", "Personal")))}
📌 <b>Status:</b> ${pyStr(st_text)}

Select an action:`;
      keyboard = [[InlineKeyboardButton("📱 Change Number", { callback_data: `adm_pedit_${pyStr(pkey)}_num` }), InlineKeyboardButton("⚙ Change Instruction", { callback_data: `adm_pedit_${pyStr(pkey)}_ins` })], [InlineKeyboardButton("🔄 Toggle Status", { callback_data: `adm_pedit_${pyStr(pkey)}_toggle` }), InlineKeyboardButton("✕ Delete Method", { callback_data: `adm_pedit_${pyStr(pkey)}_del` })], [InlineKeyboardButton("« Payment Settings", { callback_data: "adm_payments" })]];
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_pedit_"))) {
      rest = pyReplace(data, "adm_pedit_", "", 1);
      parts = pyRSplit(rest, "_", 1);
      pkey = pySub(parts, 0);
      action = (pyT(((pyLen(parts) > 1))) ? (pySub(parts, 1)) : (""));
      if (pyT((pyEq(action, "toggle")))) {
            db.toggle_payment_method_status(pkey);
            void ((await query.answer("Status updated!")));
            m = db.get_payment_method(pkey);
            st_text = (pyT((pyEq(pyGet(m, "status"), "active"))) ? ("Active 🟢") : ("Inactive 🔴"));
            msg = `💳 <b>${pyStr(pyHtmlEscape(pySub(m, "name")))} Settings</b>
━━━━━━━━━━━━━━━━━━━━

📱 <b>Number:</b> <code>${pyStr(pyHtmlEscape(pySub(m, "number")))}</code>
⚙ <b>Instruction:</b> ${pyStr(pyHtmlEscape(pyGet(m, "instruction", "Personal")))}
📌 <b>Status:</b> ${pyStr(st_text)}

Select an action:`;
            keyboard = [[InlineKeyboardButton("📱 Change Number", { callback_data: `adm_pedit_${pyStr(pkey)}_num` }), InlineKeyboardButton("⚙ Change Instruction", { callback_data: `adm_pedit_${pyStr(pkey)}_ins` })], [InlineKeyboardButton("🔄 Toggle Status", { callback_data: `adm_pedit_${pyStr(pkey)}_toggle` }), InlineKeyboardButton("✕ Delete Method", { callback_data: `adm_pedit_${pyStr(pkey)}_del` })], [InlineKeyboardButton("« Payment Settings", { callback_data: "adm_payments" })]];
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else if (pyT((pyEq(action, "del")))) {
            db.delete_payment_method(pkey);
            void ((await query.answer("Payment method deleted!", { show_alert: true })));
            methods = db.get_payment_methods();
            note = db.get_payment_note();
            msg = `⚙ <b>Payment Settings Management</b>
━━━━━━━━━━━━━━━━━━━━

📋 <b>Active Payment Methods (${pyStr(pyLen(methods))}):</b>`;
            keyboard = [];
            for (const item of pyIter(methods)) {
                    st_icon = (pyT((pyEq(pyGet(item, "status"), "active"))) ? ("🟢") : ("🔴"));
                    msg += `
• ${pyStr(st_icon)} <b>${pyStr(pyHtmlEscape(pySub(item, "name")))}:</b> <code>${pyStr(pyHtmlEscape(pySub(item, "number")))}</code>`;
                    pyAppend(keyboard, [InlineKeyboardButton(`⚙ Manage: ${pyStr(pySub(item, "name"))} (${pyStr(pySub(item, "number"))})`, { callback_data: `adm_paym_${pyStr(pySub(item, "key"))}` })]);
            }
            pyAppend(keyboard, [InlineKeyboardButton("➕ Add Payment Method", { callback_data: "adm_add_paym" })]);
            pyAppend(keyboard, [InlineKeyboardButton("📝 Edit Payment Notes", { callback_data: "adm_edit_paynote" }), InlineKeyboardButton("🗑️ Clear Note", { callback_data: "adm_del_paynote" })]);
            pyAppend(keyboard, [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]);
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else if (pyT((pyEq(action, "num")))) {
            context.user_data["admin_pay_step"] = "edit_num";
            context.user_data["admin_pay_target_key"] = pkey;
            void ((await query.edit_message_text(`📱 <b>Enter new number for ${pyStr(pyHtmlEscape(pyTitle(pkey)))}:</b>

(Type /cancel to abort)`, { parse_mode: "HTML" })));
      } else if (pyT((pyEq(action, "ins")))) {
            context.user_data["admin_pay_step"] = "edit_ins";
            context.user_data["admin_pay_target_key"] = pkey;
            void ((await query.edit_message_text(`⚙ <b>Enter new instruction for ${pyStr(pyHtmlEscape(pyTitle(pkey)))} (e.g. Personal / Agent / Merchant):</b>

(Type /cancel to abort)`, { parse_mode: "HTML" })));
      }
  } else if (pyT((pyEq(data, "adm_add_paym")))) {
      context.user_data["admin_pay_step"] = "add_name";
      context.user_data["new_pay_method"] = {  };
      void ((await query.edit_message_text("💳 <b>Enter Payment Method Name (e.g. Upay or City Bank):</b>\n\n(Type /cancel to abort)", { parse_mode: "HTML" })));
  } else if (pyT((pyEq(data, "adm_edit_paynote")))) {
      context.user_data["admin_pay_step"] = "edit_note";
      cur_note = db.get_payment_note();
      void ((await query.edit_message_text(`📝 <b>Edit Payment Disclaimer / Notes:</b>
━━━━━━━━━━━━━━━━━━━━━

Current Note:
<blockquote>${pyStr((pyT(cur_note) ? (pyHtmlEscape(cur_note)) : ("<i>(None)</i>")))}</blockquote>

👇 <b>Send the new payment disclaimer note:</b>
(Type /cancel to abort)`, { parse_mode: "HTML" })));
  } else if (pyT((pyEq(data, "adm_del_paynote")))) {
      db.set_payment_note("");
      void ((await query.answer("🗑️ Payment note cleared!", { show_alert: true })));
      methods = db.get_payment_methods();
      note = db.get_payment_note();
      msg = `⚙ <b>Payment Settings Management</b>
━━━━━━━━━━━━━━━━━━━━━

📋 <b>Active Payment Methods (${pyStr(pyLen(methods))}):</b>`;
      keyboard = [];
      for (const item of pyIter(methods)) {
            st_icon = (pyT((pyEq(pyGet(item, "status"), "active"))) ? ("🟢") : ("🔴"));
            msg += `
• ${pyStr(st_icon)} <b>${pyStr(pyHtmlEscape(pySub(item, "name")))}:</b> <code>${pyStr(pyHtmlEscape(pySub(item, "number")))}</code>`;
            pyAppend(keyboard, [InlineKeyboardButton(`⚙ Manage: ${pyStr(pySub(item, "name"))} (${pyStr(pySub(item, "number"))})`, { callback_data: `adm_paym_${pyStr(pySub(item, "key"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("➕ Add Payment Method", { callback_data: "adm_add_paym" })]);
      pyAppend(keyboard, [InlineKeyboardButton("📝 Edit Payment Notes", { callback_data: "adm_edit_paynote" }), InlineKeyboardButton("🗑️ Clear Note", { callback_data: "adm_del_paynote" })]);
      pyAppend(keyboard, [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]);
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(data, "adm_users")))) {
      total_u = pyLen(db.users);
      admin_list = db.get_admins();
      msg = `<blockquote>👥 <b>User & Admin Management</b></blockquote>

<blockquote>📊 <b>Overview:</b>
👤 <b>Total Users:</b> <code>${pyStr(total_u)}</code> 
👑 <b>Total Admins:</b> <code>${pyStr(pyLen(admin_list))}</code> </blockquote>`;
      keyboard = [[InlineKeyboardButton("📋 User List", { callback_data: "adm_userlist_1" }), InlineKeyboardButton("🔍 Search User", { callback_data: "adm_user_search" })], [InlineKeyboardButton("👑 Admin List & Manage", { callback_data: "adm_admin_list" }), InlineKeyboardButton("➕ Add Admin", { callback_data: "adm_add_admin" })], [InlineKeyboardButton("📢 Broadcast Notice", { callback_data: "adm_broadcast" })], [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]];
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(data, "adm_admin_list")))) {
      admins = db.get_admins();
      admin_lines = [];
      for (const aid of pyIter(admins)) {
            u = db.get_user(aid);
            u_name = (pyT(u) ? (pyHtmlEscape(pyGet(u, "full_name", "N/A"))) : (`ID: ${pyStr(aid)}`));
            u_user = (pyT((((__v50) => (pyT(__v50) ? (pyGet(u, "username")) : __v50))(u))) ? (` (@${pyStr(pyHtmlEscape(pyGet(u, "username")))})`) : (""));
            is_root = (pyT((((__v51) => (pyT(__v51) ? ((pyEq(aid, pySub(ADMIN_IDS, 0)))) : __v51))(((pyLen(ADMIN_IDS) > 0))))) ? (" 👑 <i>[Super Admin / Owner]</i>") : (" 🛡️ <i>[Admin]</i>"));
            pyAppend(admin_lines, `• <b>${pyStr(u_name)}</b>${pyStr(u_user)} — <code>${pyStr(aid)}</code>${pyStr(is_root)}`);
      }
      list_text = (pyT(admin_lines) ? (pyJoin("\n", admin_lines)) : ("<i>কোনো এডমিন পাওয়া যায়নি</i>"));
      msg = `<blockquote>👑 <b>Admin Team & Role Management</b></blockquote>

<blockquote>📋 <b>বর্তমান এডমিন তালিকা (${pyStr(pyLen(admins))} জন):</b>
${pyStr(list_text)}</blockquote>

<blockquote>💡 এডমিনের নামের উপর চাপ দিয়ে <b>পারমিশন পরিবর্তন (Permission Toggle)</b> অথবা <b>রিমুভ</b> করুন।</blockquote>`;
      keyboard = [];
      for (const aid of pyIter(admins)) {
            u = db.get_user(aid);
            u_name = (((__v53) => (pyT(__v53) ? __v53 : (((__v52) => (pyT(__v52) ? __v52 : (pyStr(aid))))(pyGet(u, "username")))))(pyGet(u, "full_name")));
            is_root = (((__v54) => (pyT(__v54) ? ((pyEq(aid, pySub(ADMIN_IDS, 0)))) : __v54))(((pyLen(ADMIN_IDS) > 0))));
            badge = (pyT(is_root) ? ("👑 Super Admin") : ("🔐 Permissions"));
            pyAppend(keyboard, [InlineKeyboardButton(`👤 ${pyStr(pySlice(u_name, null, 18, null))} (${pyStr(badge)})`, { callback_data: `adm_perm_${pyStr(aid)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("➕ Add New Admin", { callback_data: "adm_add_admin" }), InlineKeyboardButton("✕ Remove Admin", { callback_data: "adm_rm_admin_menu" })]);
      pyAppend(keyboard, [InlineKeyboardButton("« User Management", { callback_data: "adm_users" })]);
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_perm_"))) {
      target_uid = pyInt(pyReplace(data, "adm_perm_", ""));
      void ((await render_admin_permission_dashboard(query, context, target_uid)));
      return;
  } else if (pyT(pyStart(data, "adm_togperm_"))) {
      parts = pySplit(pyReplace(data, "adm_togperm_", ""), "_", 1);
      target_uid = pyInt(pySub(parts, 0));
      p_key = pySub(parts, 1);
      if (pyT((!pyT(db.has_permission(user_id, "admin_permission"))))) {
            void ((await query.answer("⛔ Access Denied! You do not have permission to manage permissions.", { show_alert: true })));
            return;
      }
      if (pyT(db.is_super_admin(target_uid))) {
            void ((await query.answer("👑 Super Admin permissions cannot be modified!", { show_alert: true })));
            return;
      }
      new_val = db.toggle_admin_permission(target_uid, p_key);
      p_name = pyGet(pyGet(ADMIN_PERMISSION_DEFINITIONS, p_key, {  }), "name", p_key);
      status_txt = (pyT(new_val) ? ("Granted ✅") : ("Revoked ❌"));
      void ((await query.answer(`${pyStr(p_name)}: ${pyStr(status_txt)}`)));
      void ((await render_admin_permission_dashboard(query, context, target_uid)));
      return;
  } else if (pyT(pyStart(data, "adm_rmadmin_"))) {
      target_uid = pyInt(pyReplace(data, "adm_rmadmin_", ""));
      if (pyT((!pyT(db.has_permission(user_id, "admin_manage"))))) {
            void ((await query.answer("⛔ Access Denied! You do not have permission to remove admins.", { show_alert: true })));
            return;
      }
      if (pyT(db.is_super_admin(target_uid))) {
            void ((await query.answer("👑 Super Admin cannot be removed!", { show_alert: true })));
            return;
      }
      removed = db.remove_admin(target_uid);
      if (pyT(removed)) {
            try {
                    void ((await context.bot.send_message(target_uid, "⚠️ **আপনার এডমিন রোল অপসারণ করা হয়েছে।**", { parse_mode: "Markdown" })));
            } catch (__e) {
            }
            void ((await query.answer(`✅ Admin ${pyStr(target_uid)} removed successfully!`, { show_alert: true })));
      } else {
            void ((await query.answer("ℹ️ User is not an admin!", { show_alert: true })));
      }
      admins = db.get_admins();
      admin_lines = [];
      for (const aid of pyIter(admins)) {
            u = db.get_user(aid);
            u_name = (pyT(u) ? (pyHtmlEscape(pyGet(u, "full_name", "N/A"))) : (`ID: ${pyStr(aid)}`));
            u_user = (pyT((((__v55) => (pyT(__v55) ? (pyGet(u, "username")) : __v55))(u))) ? (` (@${pyStr(pyHtmlEscape(pyGet(u, "username")))})`) : (""));
            is_root = (pyT((((__v56) => (pyT(__v56) ? ((pyEq(aid, pySub(ADMIN_IDS, 0)))) : __v56))(((pyLen(ADMIN_IDS) > 0))))) ? (" 👑 <i>[Super Admin / Owner]</i>") : (" 🛡️ <i>[Admin]</i>"));
            pyAppend(admin_lines, `• <b>${pyStr(u_name)}</b>${pyStr(u_user)} — <code>${pyStr(aid)}</code>${pyStr(is_root)}`);
      }
      list_text = (pyT(admin_lines) ? (pyJoin("\n", admin_lines)) : ("<i>কোনো এডমিন পাওয়া যায়নি</i>"));
      msg = `<blockquote>👑 <b>Admin Team & Role Management</b></blockquote>

<blockquote>📋 <b>বর্তমান এডমিন তালিকা (${pyStr(pyLen(admins))} জন):</b>
${pyStr(list_text)}</blockquote>

<blockquote>💡 এডমিনের নামের উপর চাপ দিয়ে <b>পারমিশন পরিবর্তন (Permission Toggle)</b> অথবা <b>রিমুভ</b> করুন।</blockquote>`;
      keyboard = [];
      for (const aid of pyIter(admins)) {
            u = db.get_user(aid);
            u_name = (((__v58) => (pyT(__v58) ? __v58 : (((__v57) => (pyT(__v57) ? __v57 : (pyStr(aid))))(pyGet(u, "username")))))(pyGet(u, "full_name")));
            is_root = (((__v59) => (pyT(__v59) ? ((pyEq(aid, pySub(ADMIN_IDS, 0)))) : __v59))(((pyLen(ADMIN_IDS) > 0))));
            badge = (pyT(is_root) ? ("👑 Super Admin") : ("🔐 Permissions"));
            pyAppend(keyboard, [InlineKeyboardButton(`👤 ${pyStr(pySlice(u_name, null, 18, null))} (${pyStr(badge)})`, { callback_data: `adm_perm_${pyStr(aid)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("➕ Add New Admin", { callback_data: "adm_add_admin" }), InlineKeyboardButton("✕ Remove Admin", { callback_data: "adm_rm_admin_menu" })]);
      pyAppend(keyboard, [InlineKeyboardButton("« User Management", { callback_data: "adm_users" })]);
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      return;
  } else if (pyT((pyEq(data, "adm_rm_admin_menu")))) {
      admins = db.get_admins();
      removable_admins = ((() => { const __acc = []; for (const aid of pyIter(admins)) { if (!pyT((!pyT((((__v60) => (pyT(__v60) ? ((pyEq(aid, pySub(ADMIN_IDS, 0)))) : __v60))(((pyLen(ADMIN_IDS) > 0)))))))) continue; __acc.push(aid); } return __acc; })());
      if (pyT((!pyT(removable_admins)))) {
            void ((await query.answer("No secondary admins to remove!", { show_alert: true })));
            return;
      }
      keyboard = [];
      for (const aid of pyIter(removable_admins)) {
            u = db.get_user(aid);
            u_name = (((__v62) => (pyT(__v62) ? __v62 : (((__v61) => (pyT(__v61) ? __v61 : (pyStr(aid))))(pyGet(u, "username")))))(pyGet(u, "full_name")));
            pyAppend(keyboard, [InlineKeyboardButton(`✕ Remove: ${pyStr(pySlice(u_name, null, 18, null))} (${pyStr(aid)})`, { callback_data: `adm_rmadmin_${pyStr(aid)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Back to Admin List", { callback_data: "adm_admin_list" })]);
      msg = "<blockquote>✕ <b>[ Remove Admin Role ]</b></blockquote>\n\n<blockquote>⚠️ Select the admin you want to remove below:</blockquote>";
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(data, "adm_bc_create")))) {
      context.user_data["admin_broadcasting_mode"] = "create";
      context.user_data["admin_broadcasting_step"] = "msg_content";
      context.user_data["bc_payload"] = {  };
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await context.bot.send_message({ chat_id: user_id, text: "✍ **Send your Broadcast Message:**\n━━━━━━━━━━━━━━━━━━━━\n\nYou can send Text, Photo, Video, or Document.\n\n💡 Click Cancel below to abort.", parse_mode: "Markdown", reply_markup: ReplyKeyboardMarkup([["❌ Cancel"]], { resize_keyboard: true }) })));
      return;
  } else if (pyT((pyEq(data, "adm_bc_forward")))) {
      context.user_data["admin_broadcasting_mode"] = "forward";
      context.user_data["admin_broadcasting_step"] = "fwd_content";
      context.user_data["bc_payload"] = {  };
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await context.bot.send_message({ chat_id: user_id, text: "✍ **Forward your Broadcast Message:**\n━━━━━━━━━━━━━━━━━━━━\n\nForward any message from a channel or chat to broadcast it.\n\n💡 Click Cancel below to abort.", parse_mode: "Markdown", reply_markup: ReplyKeyboardMarkup([["❌ Cancel"]], { resize_keyboard: true }) })));
      return;
  } else if (pyT((pyEq(data, "adm_bc_target_all")))) {
      context.user_data["bc_target_mode"] = "all";
      context.user_data["bc_recipients"] = db.get_all_user_ids();
      void ((await show_broadcast_preview(query, context, user_id)));
  } else if (pyT((pyEq(data, "adm_bc_target_sel")))) {
      context.user_data["bc_target_mode"] = "selected";
      context.user_data["bc_recipients"] = [];
      context.user_data["admin_broadcasting_step"] = "sel_uids";
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      reply_markup = render_broadcast_target_selector_keyboard(context, { page: 1 });
      text = get_broadcast_target_selector_text(context);
      void ((await context.bot.send_message({ chat_id: user_id, text: text, parse_mode: "Markdown", reply_markup: reply_markup })));
      return;
  } else if (pyT((pyEq(data, "adm_bc_confirm_send")))) {
      void ((await execute_broadcast(query, context, user_id)));
  } else if (pyT((pyEq(data, "adm_bc_cancel")))) {
      pyPop(context.user_data, "admin_broadcasting_mode", null);
      pyPop(context.user_data, "admin_broadcasting_step", null);
      pyPop(context.user_data, "bc_payload", null);
      pyPop(context.user_data, "bc_recipients", null);
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      void ((await context.bot.send_message({ chat_id: user_id, text: "✕ Broadcast cancelled.", reply_markup: main_menu_keyboard(user_id) })));
      return;
  } else if (pyT((pyEq(data, "adm_add_admin")))) {
      context.user_data["admin_user_step"] = "add_admin";
      void ((await query.edit_message_text("<blockquote>👑 <b>[ ➕ Add New Admin ]</b></blockquote>\n\n<blockquote>📝 <b>নির্দেশনা:</b>\nযাকে এডমিন বানাতে চান তার <b>Telegram User ID</b> অথবা <b>Username</b> লিখে পাঠান।\n(যেমন: <code>7610279126</code> বা <code>username</code>)\n\n💡 <i>ইউজারকে অবশ্যই বটটিতে অন্তত একবার স্টার্ট (/start) করা থাকতে হবে।</i></blockquote>\n\n<blockquote>❌ বাতিল করতে <code>/cancel</code> লিখুন।</blockquote>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_admin_list" })]]) })));
  } else if (pyT((pyEq(data, "adm_rm_admin_menu")))) {
      admins = db.get_admins();
      removable_admins = ((() => { const __acc = []; for (const aid of pyIter(admins)) { if (!pyT((!pyT((((__v63) => (pyT(__v63) ? ((pyEq(aid, pySub(ADMIN_IDS, 0)))) : __v63))(((pyLen(ADMIN_IDS) > 0)))))))) continue; __acc.push(aid); } return __acc; })());
      if (pyT((!pyT(removable_admins)))) {
            void ((await query.answer("No secondary admins to remove!", { show_alert: true })));
            return;
      }
      keyboard = [];
      for (const aid of pyIter(removable_admins)) {
            u = db.get_user(aid);
            u_name = (((__v65) => (pyT(__v65) ? __v65 : (((__v64) => (pyT(__v64) ? __v64 : (pyStr(aid))))(pyGet(u, "username")))))(pyGet(u, "full_name")));
            pyAppend(keyboard, [InlineKeyboardButton(`✕ Remove: ${pyStr(pySlice(u_name, null, 18, null))} (${pyStr(aid)})`, { callback_data: `adm_rmadmin_${pyStr(aid)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Back to Admin List", { callback_data: "adm_admin_list" })]);
      msg = "<blockquote>✕ <b>[ Remove Admin Role ]</b></blockquote>\n\n<blockquote>⚠️ Select the admin you want to remove below:</blockquote>";
      void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_makeadmin_"))) {
      target_uid = pyInt(pyReplace(data, "adm_makeadmin_", ""));
      added = db.add_admin(target_uid, { added_by: user_id });
      if (pyT(added)) {
            try {
                    void ((await context.bot.send_message(target_uid, "🎉 **অভিনন্দন! আপনাকে StudyMart বট-এর এডমিন হিসেবে যুক্ত করা হয়েছে।**\n\n👉 /admin কমান্ড দিয়ে আপনি এডমিন প্যানেল অ্যাক্সেস করতে পারবেন।", { parse_mode: "Markdown" })));
            } catch (__e) {
            }
            void ((await query.answer(`✅ User ${pyStr(target_uid)} promoted to Admin!`, { show_alert: true })));
      } else {
            void ((await query.answer("ℹ️ User already an admin!", { show_alert: true })));
      }
      void ((await render_admin_user_profile(query, target_uid)));
  } else if (pyT(pyStart(data, "adm_userlist_"))) {
      page_num = pyInt(pyReplace(data, "adm_userlist_", ""));
      [users_page, total_pages] = db.get_paginated_users({ page: page_num, per_page: 6 });
      msg = `📋 **Student List (Page ${pyStr(page_num)}/${pyStr(total_pages)}):**
━━━━━━━━━━━━━━━━━━━━
Select a user to view profile and manage access:
`;
      keyboard = [];
      for (const u of pyIter(users_page)) {
            u_name = (((__v67) => (pyT(__v67) ? __v67 : (((__v66) => (pyT(__v66) ? __v66 : (pyStr(pyGet(u, "user_id")))))(pyGet(u, "username")))))(pyGet(u, "full_name")));
            courses_c = pyLen(pyGet(u, "purchased_courses", []));
            is_adm_badge = (pyT(db.is_admin(pySub(u, "user_id"))) ? (" 👑") : (""));
            ban_badge = (pyT(pyGet(u, "banned")) ? (" 🚫") : (""));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(pySlice(u_name, null, 20, null))}${pyStr(is_adm_badge)}${pyStr(ban_badge)} (📚 ${pyStr(courses_c)})`, { callback_data: `adm_uview_${pyStr(pySub(u, "user_id"))}` })]);
      }
      nav_row = [];
      if (pyT(((page_num > 1)))) {
            pyAppend(nav_row, InlineKeyboardButton("◀️", { callback_data: `adm_userlist_${pyStr((page_num - 1))}` }));
      } else {
            pyAppend(nav_row, InlineKeyboardButton("⏹️", { callback_data: "adm_ignore" }));
      }
      pyAppend(nav_row, InlineKeyboardButton("🔍 Search", { callback_data: "adm_user_search" }));
      if (pyT(((page_num < total_pages)))) {
            pyAppend(nav_row, InlineKeyboardButton("▶️", { callback_data: `adm_userlist_${pyStr((page_num + 1))}` }));
      } else {
            pyAppend(nav_row, InlineKeyboardButton("⏹️", { callback_data: "adm_ignore" }));
      }
      pyAppend(keyboard, nav_row);
      pyAppend(keyboard, [InlineKeyboardButton("« User Menu", { callback_data: "adm_users" })]);
      void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(data, "adm_user_search")))) {
      context.user_data["admin_user_step"] = "search";
      void ((await query.edit_message_text("<blockquote>🔍 <b>Search User / শিক্ষার্থী খুঁজুন</b></blockquote>\n\n<blockquote>📝 যাকে খুঁজতে চান তার <b>Telegram User ID</b>, <b>Username</b> অথবা <b>Name</b> লিখে পাঠান।\n(যেমন: <code>7610279126</code> বা <code>student</code>)</blockquote>\n\n<blockquote>💡 বাতিল করতে নিচের <b>« Cancel</b> বাটনে চাপুন অথবা <code>/cancel</code> লিখুন।</blockquote>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_users" })]]) })));
  } else if (pyT((pyEq(data, "adm_order_search")))) {
      context.user_data["admin_order_search_step"] = true;
      void ((await query.edit_message_text("<blockquote>🔍 <b>Search Orders / অর্ডার খুঁজুন</b></blockquote>\n\n<blockquote>📝 <b>Order ID</b>, <b>TrxID</b>, <b>User ID</b> অথবা <b>Student Name</b> লিখে পাঠান।\n(যেমন: <code>1001</code> বা <code>TX12345</code>)</blockquote>\n\n<blockquote>💡 বাতিল করতে নিচের <b>« Cancel</b> বাটনে চাপুন অথবা <code>/cancel</code> লিখুন।</blockquote>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_pending_orders" })]]) })));
  } else if (pyT(pyStart(data, "adm_uview_"))) {
      uid = pyInt(pyReplace(data, "adm_uview_", ""));
      void ((await render_admin_user_profile(query, uid)));
  } else if (pyT(pyStart(data, "adm_ubal_"))) {
      uid = pyInt(pyReplace(data, "adm_ubal_", ""));
      context.user_data["admin_user_step"] = `adjust_bal_${pyStr(uid)}`;
      void ((await query.edit_message_text(`<blockquote>💰 <b>Adjust Student Wallet Balance</b></blockquote>

<blockquote>👤 <b>User ID:</b> <code>${pyStr(uid)}</code>
💵 <b>বর্তমান ব্যালেন্স:</b> <code>${pyStr((pyT(db.get_user(uid)) ? (pyGet(db.get_user(uid), "balance", 0)) : (0)))}</code> ৳</blockquote>

<blockquote>👇 <b>নতুন ব্যালেন্সটি টাইপ করে পাঠান (যেমন: 500):</b></blockquote>

❌ বাতিল করতে <code>/cancel</code> লিখুন।`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_uview_${pyStr(uid)}` })]]) })));
  } else if (pyT(pyStart(data, "adm_utogearn_"))) {
      uid = pyInt(pyReplace(data, "adm_utogearn_", ""));
      u = db.get_user(uid);
      if (pyT(u)) {
            cur = pyGet(u, "earnings_enabled", false);
            db.enable_user_earnings(uid, (!pyT(cur)));
            void ((await query.answer("Earnings menu toggled!", { show_alert: true })));
            void ((await render_admin_user_profile(query, uid)));
      }
  } else if (pyT(pyStart(data, "adm_ban_"))) {
      uid = pyInt(pyReplace(data, "adm_ban_", ""));
      if (pyT((((__v68) => (pyT(__v68) ? __v68 : (db.is_super_admin(uid))))((pyContains(ADMIN_IDS, uid)))))) {
            void ((await query.answer("👑 Super Admin-কে ban করা যাবে না!", { show_alert: true })));
            return;
      }
      if (pyT(db.is_admin(uid))) {
            void ((await query.answer("⚠️ Admin-কে ban করার আগে Demote করুন!", { show_alert: true })));
            return;
      }
      db.ban_user(uid);
      void ((await query.answer("⛔ User banned!", { show_alert: true })));
      try {
            void ((await context.bot.send_message(uid, "⛔ <b>Your account has been temporarily banned.</b>\n\nPlease contact admin support.", { parse_mode: "HTML" })));
      } catch (__e) {
      }
      void ((await render_admin_user_profile(query, uid)));
  } else if (pyT(pyStart(data, "adm_unban_"))) {
      uid = pyInt(pyReplace(data, "adm_unban_", ""));
      db.unban_user(uid);
      void ((await query.answer("✅ User unbanned!", { show_alert: true })));
      try {
            void ((await context.bot.send_message(uid, "✅ <b>Your account has been reactivated.</b>\n\nYou can now use the bot.", { parse_mode: "HTML" })));
      } catch (__e) {
      }
      void ((await render_admin_user_profile(query, uid)));
  } else if (pyT(pyStart(data, "adm_ucourse_"))) {
      rest = pyReplace(data, "adm_ucourse_", "");
      parts = pySplit(rest, "_", -1);
      try {
            uid = pyInt(pySub(parts, 0));
      } catch (__e) {
            return;
      }
      page = 0;
      if (pyT(((pyLen(parts) > 1)))) {
            try {
                    page = pyInt(pySub(parts, 1));
            } catch (__e) {
                    page = 0;
            }
      }
      void ((await render_user_course_access(query, uid, page)));
  } else if (pyT(pyStart(data, "adm_ugrant_"))) {
      parts = pySplit(data, "_", -1);
      try {
            uid = pyInt(pySub(parts, 2));
      } catch (__e) {
            return;
      }
      cid = (pyT(((pyLen(parts) > 3))) ? (pySub(parts, 3)) : (""));
      page = 0;
      if (pyT(((pyLen(parts) > 4)))) {
            try {
                    page = pyInt(pySub(parts, 4));
            } catch (__e) {
                    page = 0;
            }
      }
      db.add_purchase(uid, cid);
      void ((await query.answer("✅ Course access granted!", { show_alert: true })));
      void ((await render_user_course_access(query, uid, page)));
  } else if (pyT(pyStart(data, "adm_urevoke_"))) {
      parts = pySplit(data, "_", -1);
      try {
            uid = pyInt(pySub(parts, 2));
      } catch (__e) {
            return;
      }
      cid = (pyT(((pyLen(parts) > 3))) ? (pySub(parts, 3)) : (""));
      page = 0;
      if (pyT(((pyLen(parts) > 4)))) {
            try {
                    page = pyInt(pySub(parts, 4));
            } catch (__e) {
                    page = 0;
            }
      }
      db.manual_revoke_course(uid, cid);
      void ((await query.answer("✕ Course access revoked!", { show_alert: true })));
      void ((await render_user_course_access(query, uid, page)));
  } else if (pyT(pyStart(data, "adm_uebook_"))) {
      rest = pyReplace(data, "adm_uebook_", "");
      parts = pySplit(rest, "_", -1);
      try {
            uid = pyInt(pySub(parts, 0));
      } catch (__e) {
            return;
      }
      page = 0;
      if (pyT(((pyLen(parts) > 1)))) {
            try {
                    page = pyInt(pySub(parts, 1));
            } catch (__e) {
                    page = 0;
            }
      }
      void ((await render_user_ebook_access(query, uid, page)));
  } else if (pyT(pyStart(data, "adm_uebgrant_"))) {
      parts = pySplit(data, "_", -1);
      try {
            uid = pyInt(pySub(parts, 2));
      } catch (__e) {
            return;
      }
      eid = (pyT(((pyLen(parts) > 3))) ? (pySub(parts, 3)) : (""));
      page = 0;
      if (pyT(((pyLen(parts) > 4)))) {
            try {
                    page = pyInt(pySub(parts, 4));
            } catch (__e) {
                    page = 0;
            }
      }
      db.add_ebook_purchase(uid, eid);
      void ((await query.answer("✅ E-Book access granted!", { show_alert: true })));
      void ((await render_user_ebook_access(query, uid, page)));
  } else if (pyT(pyStart(data, "adm_uebrevoke_"))) {
      parts = pySplit(data, "_", -1);
      try {
            uid = pyInt(pySub(parts, 2));
      } catch (__e) {
            return;
      }
      eid = (pyT(((pyLen(parts) > 3))) ? (pySub(parts, 3)) : (""));
      page = 0;
      if (pyT(((pyLen(parts) > 4)))) {
            try {
                    page = pyInt(pySub(parts, 4));
            } catch (__e) {
                    page = 0;
            }
      }
      db.manual_revoke_ebook(uid, eid);
      void ((await query.answer("✕ E-Book access revoked!", { show_alert: true })));
      void ((await render_user_ebook_access(query, uid, page)));
  } else if (pyT(pyStart(data, "adm_udm_"))) {
      uid = pyInt(pyReplace(data, "adm_udm_", ""));
      context.user_data["admin_user_step"] = "send_dm";
      context.user_data["admin_dm_target_uid"] = uid;
      void ((await query.edit_message_text(`➥ **Type message to send directly to User \`${pyStr(uid)}\`:**

(Type /cancel to abort)`)));
  } else if (pyT((pyEq(data, "adm_broadcast")))) {
      keyboard = [[InlineKeyboardButton("✍ Create Message", { callback_data: "adm_bc_create" })], [InlineKeyboardButton("➥ Forward Message", { callback_data: "adm_bc_forward" })], [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]];
      text = "⚡ **Broadcast System**\n━━━━━━━━━━━━━━━━━━━━\n\nChoose how you want to broadcast:\n\n1️⃣ **Create Message:** Send text, photo, video or document with optional custom button/link.\n2️⃣ **Forward Message:** Forward any existing Telegram post directly to all/selected users.";
      void ((await query.edit_message_text(text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT((pyEq(data, "adm_wdr_min")))) {
      _cur = db.get_min_withdraw_amount();
      context.user_data["admin_wdr_min_step"] = true;
      _kb = [[InlineKeyboardButton("« Bot Settings", { callback_data: "adm_bot_settings" })]];
      try {
            void ((await query.edit_message_text(`⚙️ <b>Withdraw Minimum Limit</b>
━━━━━━━━━━━━━━━━━━━━

💰 <b>Current:</b> <code>৳${pyStr(_cur)}</code>

✏️ শুধু Amount লিখে পাঠান (যেমন: \`100\`):`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(_kb) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw e;
            }
      }
      return;
  } else if (pyT((((__v69) => (pyT(__v69) ? __v69 : (pyStart(data, "adm_wdr_"))))((pyEq(data, "adm_withdrawals")))))) {
      if (pyT(pyStart(data, "adm_wdr_"))) {
            try {
                    [_, ___1, rest] = pyPartition(data, "adm_wdr_");
                    [status, _, pg] = pyPartition(rest, "_");
                    page_num = (pyT(pg) ? (pyInt(pg)) : (1));
            } catch (__e) {
                    [status, page_num] = ["pending", 1];
            }
            if (pyT(((!pyContains(["pending", "approved", "rejected"], status))))) {
                    [status, page_num] = ["pending", 1];
            }
      } else {
            [status, page_num] = ["pending", 1];
      }
      all_w = (pyT(pyHasAttr(db, "withdrawals")) ? (pyList(pyValues(db.withdrawals))) : ([]));
      pend_all = ((() => { const __acc = []; for (const w of pyIter(all_w)) { if (!pyT((pyEq(pyGet(w, "status"), "pending")))) continue; __acc.push(w); } return __acc; })());
      appr_all = ((() => { const __acc = []; for (const w of pyIter(all_w)) { if (!pyT((pyEq(pyGet(w, "status"), "approved")))) continue; __acc.push(w); } return __acc; })());
      rej_all = ((() => { const __acc = []; for (const w of pyIter(all_w)) { if (!pyT((pyEq(pyGet(w, "status"), "rejected")))) continue; __acc.push(w); } return __acc; })());
      pend_total = pySum(((() => { const __acc = []; for (const w of pyIter(pend_all)) { __acc.push(pyInt((((__v70) => (pyT(__v70) ? __v70 : (0)))(pyGet(w, "amount", 0))))); } return __acc; })()));
      appr_total = pySum(((() => { const __acc = []; for (const w of pyIter(appr_all)) { __acc.push(pyInt((((__v71) => (pyT(__v71) ? __v71 : (0)))(pyGet(w, "amount", 0))))); } return __acc; })()));
      [items, total_pages] = db.get_paginated_withdrawals({ status: status, page: page_num, per_page: 6 });
      st_title = pySub({ pending: "⏳ Pending", approved: "✅ Approved", rejected: "❌ Rejected" }, status);
      msg = `💸 <b>Withdrawals — ${pyStr(st_title)}</b>
━━━━━━━━━━━━━━━━━━━━
🟡 <b>Pending Withdrawals:</b> <code>${pyStr(pyLen(pend_all))}</code>
💰 <b>Total Pending:</b> <code>৳${pyStr(pend_total)}</code>
✅ <b>Approved:</b> <code>${pyStr(pyLen(appr_all))}</code> টা | <code>৳${pyStr(appr_total)}</code>
❌ <b>Rejected:</b> <code>${pyStr(pyLen(rej_all))}</code> টা
━━━━━━━━━━━━━━━━━━━━
<b>${pyStr(st_title)} list (Page ${pyStr(page_num)}/${pyStr(total_pages)}):</b>
Select to review and process:`;
      if (pyT((!pyT(items)))) {
            msg = `💸 <b>Withdrawals — ${pyStr(st_title)}</b>
━━━━━━━━━━━━━━━━━━━━
🟡 <b>Pending Withdrawals:</b> <code>${pyStr(pyLen(pend_all))}</code>
💰 <b>Total Pending:</b> <code>৳${pyStr(pend_total)}</code>
✅ <b>Approved:</b> <code>${pyStr(pyLen(appr_all))}</code> টা | <code>৳${pyStr(appr_total)}</code>
❌ <b>Rejected:</b> <code>${pyStr(pyLen(rej_all))}</code> টা
━━━━━━━━━━━━━━━━━━━━
<i>এই tab-এ কোনো request নেই।</i>`;
      }
      keyboard = [];
      for (const w of pyIter(items)) {
            uname = pySlice((((__v73) => (pyT(__v73) ? __v73 : (((__v72) => (pyT(__v72) ? __v72 : (pyStr(pyGet(w, "user_id", "?")))))(pyGet(w, "username")))))(pyGet(w, "full_name"))), null, 14, null);
            pyAppend(keyboard, [InlineKeyboardButton(`💳 ৳${pyStr(pySub(w, "amount"))} - ${pyStr(uname)} (${pyStr(pyGet(w, "method", ""))})`, { callback_data: `wdrinfo_${pyStr(pySub(w, "withdraw_id"))}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton(`⏳ Pending (${pyStr(pyLen(pend_all))})`, { callback_data: "adm_wdr_pending_1" }), InlineKeyboardButton(`✅ Approved`, { callback_data: "adm_wdr_approved_1" }), InlineKeyboardButton(`❌ Rejected`, { callback_data: "adm_wdr_rejected_1" })]);
      nav_row = [];
      if (pyT(((page_num > 1)))) {
            pyAppend(nav_row, InlineKeyboardButton("⬅️ Prev", { callback_data: `adm_wdr_${pyStr(status)}_${pyStr((page_num - 1))}` }));
      } else {
            pyAppend(nav_row, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_wdr_page" }));
      }
      pyAppend(nav_row, InlineKeyboardButton(`Page ${pyStr(page_num)}/${pyStr(total_pages)}`, { callback_data: "noop_wdr_page" }));
      if (pyT(((page_num < total_pages)))) {
            pyAppend(nav_row, InlineKeyboardButton("Next ➡️", { callback_data: `adm_wdr_${pyStr(status)}_${pyStr((page_num + 1))}` }));
      } else {
            pyAppend(nav_row, InlineKeyboardButton("Next ➡️", { callback_data: "noop_wdr_page" }));
      }
      pyAppend(keyboard, nav_row);
      pyAppend(keyboard, [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]);
      void ((await query.answer()));
      try {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw e;
            }
      }
  } else if (pyT(pyStart(data, "wdrinfo_"))) {
      wid = pyReplace(data, "wdrinfo_", "");
      w = db.get_withdrawal(wid);
      if (pyT((!pyT(w)))) {
            void ((await query.answer("Withdrawal request not found!")));
            return;
      }
      uid = pyGet(w, "user_id");
      u = (pyT(uid) ? (db.get_user(uid)) : (null));
      cur_bal = pyGet((((__v74) => (pyT(__v74) ? __v74 : ({  })))(u)), "balance", 0);
      ref_c = pyGet((((__v75) => (pyT(__v75) ? __v75 : ({  })))(u)), "referral_count", 0);
      past = ((() => { const __acc = []; for (const x of pyIter((pyT(pyHasAttr(db, "withdrawals")) ? (pyList(pyValues(db.withdrawals))) : ([])))) { if (!pyT((((__v76) => (pyT(__v76) ? (((!pyEq(pyGet(x, "withdraw_id"), wid)))) : __v76))((pyEq(pyStr(pyGet(x, "user_id")), pyStr(uid))))))) continue; __acc.push(x); } return __acc; })());
      past_ok = ((() => { const __acc = []; for (const x of pyIter(past)) { if (!pyT((pyEq(pyGet(x, "status"), "approved")))) continue; __acc.push(x); } return __acc; })());
      past_ok_total = pySum(((() => { const __acc = []; for (const x of pyIter(past_ok)) { __acc.push(pyInt((((__v77) => (pyT(__v77) ? __v77 : (0)))(pyGet(x, "amount", 0))))); } return __acc; })()));
      same_acc = pySum(((() => { const __acc = []; for (const x of pyIter(past)) { if (!pyT((((__v78) => (pyT(__v78) ? (((!pyEq(pyStr(pyGet(x, "account", "")), "")))) : __v78))((pyEq(pyStr(pyGet(x, "account", "")), pyStr(pyGet(w, "account", "")))))))) continue; __acc.push(1); } return __acc; })()));
      same_acc_txt = (pyT(same_acc) ? (`♻️ এই account-এ আগেও ${pyStr(same_acc)} বার`) : ("🆕 এই account প্রথমবার"));
      keyboard = [[InlineKeyboardButton("✅ Approve", { callback_data: `apprwdr_${pyStr(wid)}` }), InlineKeyboardButton("✕ Reject & Refund", { callback_data: `rejwdr_${pyStr(wid)}` })], [InlineKeyboardButton("« Withdraw List", { callback_data: "adm_withdrawals" })]];
      void ((await query.edit_message_text(`💸 **Withdrawal Request Details**
━━━━━━━━━━━━━━━━━━━━

🆔 **Withdraw ID:** \`${pyStr(wid)}\`
👤 **User:** ${pyStr(pyGet(w, "full_name", "N/A"))} (@${pyStr(pyGet(w, "username", "N/A"))})
🆔 **User ID:** \`${pyStr(pyGet(w, "user_id"))}\`
💰 **Amount:** \`${pyStr(pySub(w, "amount"))}\` ৳
💳 **Method:** ${pyStr(pyGet(w, "method"))}
📱 **Account:** \`${pyStr(pyGet(w, "account"))}\`
📅 **Date:** ${pyStr(pySlice(pyGet(w, "date", "N/A"), null, 19, null))}
📌 **Status:** ${pyStr(pyUpper(pyGet(w, "status", "")))}
━━━━━━━━━━━━━━━━━━━━
🔍 **Verify Info:**
💰 **Current Balance:** \`${pyStr(cur_bal)}\` ৳
👥 **Referrals:** \`${pyStr(ref_c)}\`
📜 **Past Withdrawals:** \`${pyStr(pyLen(past_ok))} approved (৳${pyStr(past_ok_total)})\`
${pyStr(same_acc_txt)}`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "apprwdr_"))) {
      wid = pyReplace(data, "apprwdr_", "");
      w = db.get_withdrawal(wid);
      if (pyT((((__v79) => (pyT(__v79) ? ((pyEq(pyGet(w, "status"), "pending"))) : __v79))(w)))) {
            db.approve_withdrawal(wid);
            try {
                    void ((await context.bot.send_message(pySub(w, "user_id"), `🎉 <b>Your withdrawal has been approved!</b>
━━━━━━━━━━━━━━━━━━━━

🆔 <b>Withdraw ID:</b> <code>${pyStr(wid)}</code>
💰 <b>Amount:</b> ${pyStr(pySub(w, "amount"))} ৳
💳 <b>Method:</b> ${pyStr(pyGet(w, "method"))}
📱 <b>Number:</b> <code>${pyStr(pyGet(w, "account"))}</code>

✨ Payment has been sent to your account. Thank you for staying with us!`, { parse_mode: "HTML" })));
            } catch (e) {
                    logger.error(`উইথড্র নোটিফিকেশন পাঠাতে সমস্যা: ${pyStr(e)}`);
            }
            w = (((__v80) => (pyT(__v80) ? __v80 : (w)))(db.get_withdrawal(wid)));
            void ((await sync_admin_withdrawal_messages(context, wid, "approved")));
            void ((await query.answer("✅ Withdrawal approved!", { show_alert: false })));
            try {
                    if (pyT((pyContains((((__v81) => (pyT(__v81) ? __v81 : ("")))(pyGetAttr(query.message, "text", null))), "Withdrawal Request Details")))) {
                              void ((await query.edit_message_text(build_withdrawal_detail_text(wid, w), { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Withdraw List", { callback_data: "adm_withdrawals" })]]) })));
                    } else {
                              void ((await query.edit_message_text((build_admin_withdrawal_text(wid, w, { header: "🔔 **Withdrawal Update**" }) + "\n\n✅ **Status: Approved**"), { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("✅ Approved", { callback_data: "adm_ignore" })], [InlineKeyboardButton("« Withdraw List", { callback_data: "adm_withdrawals" })]]) })));
                    }
            } catch (__e) {
            }
      } else if (pyT(w)) {
            void ((await query.answer("✅ Already approved!", { show_alert: false })));
            void ((await sync_admin_withdrawal_messages(context, wid, "approved")));
      }
  } else if (pyT(pyStart(data, "rejwdr_"))) {
      wid = pyReplace(data, "rejwdr_", "");
      w = db.get_withdrawal(wid);
      if (pyT((((__v82) => (pyT(__v82) ? ((pyEq(pyGet(w, "status"), "pending"))) : __v82))(w)))) {
            db.reject_withdrawal(wid);
            try {
                    void ((await context.bot.send_message(pySub(w, "user_id"), `❌ **দুঃখিত! আপনার উইথড্রয়াল রিকোয়েস্টটি বাতিল করা হয়েছে।**
━━━━━━━━━━━━━━━━━━━━

🆔 **উইথড্র আইডি:** \`${pyStr(wid)}\`
💰 **টাকার পরিমাণ:** ${pyStr(pySub(w, "amount"))} ৳

🔄 **${pyStr(pySub(w, "amount"))} ৳ আপনার ওয়ালেট ব্যালেন্সে পুনরায় রিফান্ড করা হয়েছে।**
সহায়তার জন্য এডমিনের সাথে যোগাযোগ করুন: @${pyStr(SUPPORT_USERNAME)}`, { parse_mode: "Markdown" })));
            } catch (e) {
                    logger.error(`উইথড্র রিজেক্ট নোটিশ পাঠাতে সমস্যা: ${pyStr(e)}`);
            }
            w = (((__v83) => (pyT(__v83) ? __v83 : (w)))(db.get_withdrawal(wid)));
            void ((await sync_admin_withdrawal_messages(context, wid, "rejected")));
            void ((await query.answer("❌ Withdrawal rejected & refunded!", { show_alert: false })));
            try {
                    if (pyT((pyContains((((__v84) => (pyT(__v84) ? __v84 : ("")))(pyGetAttr(query.message, "text", null))), "Withdrawal Request Details")))) {
                              void ((await query.edit_message_text(build_withdrawal_detail_text(wid, w), { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Withdraw List", { callback_data: "adm_withdrawals" })]]) })));
                    } else {
                              void ((await query.edit_message_text((build_admin_withdrawal_text(wid, w, { header: "🔔 **Withdrawal Update**" }) + "\n\n❌ **Status: Rejected**"), { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("❌ Rejected", { callback_data: "adm_ignore" })], [InlineKeyboardButton("« Withdraw List", { callback_data: "adm_withdrawals" })]]) })));
                    }
            } catch (__e) {
            }
      } else if (pyT(w)) {
            void ((await query.answer(`⚠️ Already ${pyStr(pyGet(w, "status"))}!`, { show_alert: true })));
            void ((await sync_admin_withdrawal_messages(context, wid, (pyT((pyEq(pyGet(w, "status"), "approved"))) ? ("approved") : ("rejected")))));
      }
  } else if (pyT((pyEq(data, "adm_categories")))) {
      void ((await render_admin_folder_directory(query, context, "")));
  } else if (pyT(pyStart(data, "adm_dir_"))) {
      path = pyReplace(data, "adm_dir_", "");
      void ((await render_admin_folder_directory(query, context, path)));
  } else if (pyT(pyStart(data, "adm_catm_"))) {
      cat = pyReplace(data, "adm_catm_", "");
      void ((await render_admin_folder_directory(query, context, cat)));
  } else if (pyT(pyStart(data, "adm_subcatm_"))) {
      parts = pySplit(pyReplace(data, "adm_subcatm_", ""), "_", 1);
      path = (pyT(((pyLen(parts) > 1))) ? (`${pyStr(pySub(parts, 0))} > ${pyStr(pySub(parts, 1))}`) : (pySub(parts, 0)));
      void ((await render_admin_folder_directory(query, context, path)));
  } else if (pyT((((__v85) => (pyT(__v85) ? __v85 : ((pyEq(data, "adm_add_cat")))))((pyEq(data, "adm_fld_addfolder")))))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      context.user_data["admin_add_subcat"] = true;
      context.user_data["admin_subcat_target_parent"] = active_dir;
      parent_display = (pyT(active_dir) ? (active_dir) : ("Root (মূল ক্যাটাগরি)"));
      msg = `📁 **Folder Location:** \`${pyStr(parent_display)}\`
━━━━━━━━━━━━━━━━━━━━
➕ **Enter new Folder name:**
(Example: Physics, Chemistry, Cycle 1, Academic )

(Cancel by typing /cancel)`;
      k_c = [[InlineKeyboardButton("« Cancel", { callback_data: `adm_dir_${pyStr(active_dir)}` })]];
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_c) })));
      } else {
            void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_c) })));
      }
  } else if (pyT(pyStart(data, "adm_addsub_"))) {
      cat = pyReplace(data, "adm_addsub_", "");
      context.user_data["admin_add_subcat"] = true;
      context.user_data["admin_subcat_target_parent"] = cat;
      void ((await query.edit_message_text(`➕ **Enter new Sub-Category / Folder name for \`${pyStr(cat)}\`:**

(Type /cancel to abort)`)));
  } else if (pyT((pyEq(data, "adm_fld_addcourse")))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      cat = (pyT(segments) ? (pySub(segments, 0)) : ("General"));
      sub = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, 1, null, null))) : ("General"));
      context.user_data["admin_add_course"] = true;
      context.user_data["course_step"] = "name";
      context.user_data["course_origin_callback"] = `adm_dir_${pyStr(active_dir)}`;
      context.user_data["new_course"] = { category: cat, subcategory: sub, folder_path: active_dir, program: (pyT(segments) ? (pyLower(pySub(segments, (-(1))))) : ("general")) };
      path_disp = (pyT(active_dir) ? (active_dir) : ("General"));
      msg = `📁 **Folder:** \`${pyStr(path_disp)}\`
━━━━━━━━━━━━━━━━━━━━

**Step 1 of 4 — Course Name**
Send the course name.

Example: \`BH Biology Full Course | ${pyStr(cat)}\`
The course will be added to this folder.`;
      k_cancel = [[InlineKeyboardButton("✕ Cancel", { callback_data: `adm_dir_${pyStr(active_dir)}` })]];
      void ((await send_wizard_step1(query, context, msg, k_cancel)));
  } else if (pyT((((__v86) => (pyT(__v86) ? __v86 : (pyStart(data, "adm_addcourse_sub_"))))(pyStart(data, "adm_addcourse_dir_"))))) {
      if (pyT(pyStart(data, "adm_addcourse_dir_"))) {
            target_path = pyReplace(data, "adm_addcourse_dir_", "");
      } else {
            parts = pySplit(pyReplace(data, "adm_addcourse_sub_", ""), "_", 1);
            target_path = (pyT(((pyLen(parts) > 1))) ? (`${pyStr(pySub(parts, 0))} > ${pyStr(pySub(parts, 1))}`) : (pySub(parts, 0)));
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(target_path, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      cat = (pyT(segments) ? (pySub(segments, 0)) : ("General"));
      sub = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, 1, null, null))) : ("General"));
      context.user_data["active_dir"] = target_path;
      context.user_data["admin_add_course"] = true;
      context.user_data["course_step"] = "name";
      context.user_data["new_course"] = { category: cat, subcategory: sub, folder_path: target_path, program: (pyT(segments) ? (pyLower(pySub(segments, (-(1))))) : ("general")) };
      msg = `📁 **Folder:** \`${pyStr(target_path)}\`
━━━━━━━━━━━━━━━━━━━━

**Step 1 of 4 — Course Name**
Send the course name.

Example: \`BH Biology Full Course | ${pyStr(cat)}\`
The course will be added to this folder.`;
      k_cancel = [[InlineKeyboardButton("✕ Cancel", { callback_data: `adm_dir_${pyStr(target_path)}` })]];
      void ((await send_wizard_step1(query, context, msg, k_cancel)));
  } else if (pyT(pyStart(data, "adm_addcourse_cat_"))) {
      cat = pyReplace(data, "adm_addcourse_cat_", "");
      context.user_data["active_dir"] = cat;
      context.user_data["admin_add_course"] = true;
      context.user_data["course_step"] = "name";
      context.user_data["new_course"] = { category: cat, subcategory: "General", folder_path: cat, program: "general" };
      msg = `📁 **Folder:** \`${pyStr(cat)}\`
━━━━━━━━━━━━━━━━━━━━

**Step 1 of 4 — Course Name**
Send the course name.

Example: \`BH Biology Full Course | ${pyStr(cat)}\`
The course will be added to this folder.`;
      k_cancel = [[InlineKeyboardButton("✕ Cancel", { callback_data: `adm_dir_${pyStr(cat)}` })]];
      void ((await send_wizard_step1(query, context, msg, k_cancel)));
  } else if (pyT(pyStart(data, "adm_fld_togglestatus_"))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("Cannot toggle root directory status!", { show_alert: true })));
            return;
      }
      new_st = db.toggle_category_status(active_dir);
      st_word = (pyT(new_st) ? ("🟢 Active (ON)") : ("🔴 Inactive (OFF - Hidden)"));
      void ((await query.answer(`Category status changed to ${pyStr(st_word)}!`, { show_alert: true })));
      void ((await render_admin_folder_directory(query, context, active_dir)));
      return;
  } else if (pyT((pyEq(data, "adm_fld_delfolder")))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("Cannot delete root directory!", { show_alert: true })));
            return;
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      folder_to_delete = pySub(segments, (-(1)));
      n_sub = pyLen(db.get_sub_folders(active_dir, { include_inactive: true }));
      n_courses = pyLen(db.get_courses_by_folder(active_dir, { include_inactive: true }));
      confirm_text = `🗑️ <b>Delete folder?</b>

📁 <b>${pyStr(pyHtmlEscape(active_dir))}</b> will be permanently removed.
📂 Sub-folders: <b>${pyStr(n_sub)}</b> | 📚 Courses: <b>${pyStr(n_courses)}</b>
This cannot be undone.`;
      confirm_kb = InlineKeyboardMarkup([[InlineKeyboardButton("✅ Yes, Delete", { callback_data: "adm_fld_delfolder_yes" })], [InlineKeyboardButton("« Cancel", { callback_data: `adm_dir_${pyStr(active_dir)}` })]]);
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(confirm_text, { parse_mode: "HTML", reply_markup: confirm_kb })));
      } else {
            void ((await query.edit_message_text(confirm_text, { parse_mode: "HTML", reply_markup: confirm_kb })));
      }
  } else if (pyT((pyEq(data, "adm_fld_delfolder_yes")))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("Cannot delete root directory!", { show_alert: true })));
            return;
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      folder_to_delete = pySub(segments, (-(1)));
      parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
      db.delete_sub_folder(parent_path, folder_to_delete);
      void ((await query.answer(`✅ '${pyStr(folder_to_delete)}' deleted!`, { show_alert: true })));
      void ((await render_admin_folder_directory(query, context, parent_path)));
  } else if (pyT((((__v87) => (pyT(__v87) ? __v87 : (pyStart(data, "adm_fld_movedown_"))))(pyStart(data, "adm_fld_moveup_"))))) {
      direction = (pyT((pyContains(data, "moveup"))) ? ("up") : ("down"));
      folder_name = pyReplace(pyReplace(data, "adm_fld_moveup_", ""), "adm_fld_movedown_", "");
      active_dir = pyGet(context.user_data, "active_dir", "");
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
      success = db.move_folder_order(parent_path, folder_name, direction);
      if (pyT(success)) {
            siblings = db.get_sub_folders(parent_path, { include_inactive: true });
            pos = (pyT((pyContains(siblings, folder_name))) ? ((pyIndex(siblings, folder_name) + 1)) : ("?"));
            void ((await query.answer(`✅ '${pyStr(folder_name)}' moved ${pyStr(direction)}! (Position: #${pyStr(pos)} of ${pyStr(pyLen(siblings))})`, { show_alert: true })));
      } else {
            void ((await query.answer(`⚠️ '${pyStr(folder_name)}' is already at the ${pyStr((pyT((pyEq(direction, "up"))) ? ("top") : ("bottom")))}!`, { show_alert: true })));
      }
      void ((await render_admin_folder_directory(query, context, active_dir)));
  } else if (pyT(pyStart(data, "adm_fld_reorder_"))) {
      p_path = pyReplace(data, "adm_fld_reorder_", "");
      if (pyT((pyEq(p_path, "CUR")))) {
            p_path = pyGet(context.user_data, "active_dir", "");
      }
      context.user_data["reorder_parent_path"] = p_path;
      pyPop(context.user_data, "pos_sel", null);
      pyPop(context.user_data, "pos_pick", null);
      pyPop(context.user_data, "pos_cpick", null);
      void ((await render_category_reorder_panel(query, context, p_path)));
      return;
  } else if (pyT(pyStart(data, "adm_fld_layout_"))) {
      try {
            n = pyMax(1, pyMin(4, pyInt(pyReplace(data, "adm_fld_layout_", ""))));
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      active_dir = pyGet(context.user_data, "active_dir", "");
      if (pyT((!pyT(active_dir)))) {
            db.set_category_row_size(n);
            void ((await query.answer(`📁 Category: 1 line-e ${pyStr(n)} ta!`, { show_alert: true })));
      } else {
            db.set_subcategory_row_size(n);
            void ((await query.answer(`📂 Sub-Category: 1 line-e ${pyStr(n)} ta!`, { show_alert: true })));
      }
      void ((await render_admin_folder_directory(query, context, active_dir)));
      return;
  } else if (pyT(pyStart(data, "adm_fld_reord_"))) {
      parts = pySplit(pyReplace(data, "adm_fld_reord_", ""), "_", -1);
      action = pySub(parts, 0);
      idx = pyInt(pySub(parts, 1));
      p_path = pyGet(context.user_data, "reorder_parent_path", "");
      ok = false;
      item_name = "";
      if (pyT((pyContains(["fup", "fdn"], action)))) {
            folders = db.get_sub_folders(p_path, { include_inactive: true });
            if (pyT(((0 <= idx) && (idx < pyLen(folders))))) {
                    item_name = pySub(folders, idx);
                    ok = db.move_folder_order(p_path, item_name, (pyT((pyEq(action, "fup"))) ? ("up") : ("down")));
            }
      } else if (pyT((pyContains(["cup", "cdn"], action)))) {
            courses = (pyT(p_path) ? (db.get_courses_by_folder(p_path, { include_inactive: true })) : ([]));
            if (pyT(((0 <= idx) && (idx < pyLen(courses))))) {
                    item_name = pyGet(pySub(courses, idx), "name", "");
                    ok = db.move_course_order(pySub(pySub(courses, idx), "id"), (pyT((pyEq(action, "cup"))) ? ("up") : ("down")));
            }
      }
      if (pyT(ok)) {
            void ((await query.answer(`✅ Position changed: ${pyStr(item_name)}`)));
      } else {
            void ((await query.answer("⚠️ আর এদিকে যাওয়া যাবে না (already at edge)!", { show_alert: true })));
      }
      void ((await render_category_reorder_panel(query, context, p_path)));
      return;
  } else if (pyT(pyStart(data, "adm_fld_psel_"))) {
      rest = pyReplace(data, "adm_fld_psel_", "");
      [kind, idx_s] = [pySub(rest, 0), pySlice(rest, 1, null, null)];
      try {
            idx = pyInt(idx_s);
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      p_path = pyGet(context.user_data, "reorder_parent_path", "");
      if (pyT((pyEq(kind, "f")))) {
            folders = db.get_sub_folders(p_path, { include_inactive: true });
            if (pyT((!pyT(((0 <= idx) && (idx < pyLen(folders))))))) {
                    void ((await query.answer("❌ Not found!", { show_alert: true })));
                    return;
            }
            cur = (((__v88) => (pyT(__v88) ? __v88 : ({  })))(pyGet(context.user_data, "pos_sel")));
            if (pyT((((__v89) => (pyT(__v89) ? ((pyEq(pyGet(cur, "name"), pySub(folders, idx)))) : __v89))((pyEq(pyGet(cur, "kind"), "f")))))) {
                    pyPop(context.user_data, "pos_sel", null);
                    void ((await query.answer("Selection cleared!")));
            } else {
                    context.user_data["pos_sel"] = { kind: "f", name: pySub(folders, idx) };
                    void ((await query.answer(`✅ Selected: ${pyStr(pySub(folders, idx))}`)));
            }
      } else {
            courses = (pyT(p_path) ? (db.get_courses_by_folder(p_path, { include_inactive: true })) : ([]));
            if (pyT((!pyT(((0 <= idx) && (idx < pyLen(courses))))))) {
                    void ((await query.answer("❌ Not found!", { show_alert: true })));
                    return;
            }
            cur = (((__v90) => (pyT(__v90) ? __v90 : ({  })))(pyGet(context.user_data, "pos_sel")));
            if (pyT((((__v91) => (pyT(__v91) ? ((pyEq(pyGet(cur, "id"), pyGet(pySub(courses, idx), "id")))) : __v91))((pyEq(pyGet(cur, "kind"), "c")))))) {
                    pyPop(context.user_data, "pos_sel", null);
                    void ((await query.answer("Selection cleared!")));
            } else {
                    context.user_data["pos_sel"] = { kind: "c", id: pyGet(pySub(courses, idx), "id"), name: pyGet(pySub(courses, idx), "name", "") };
                    void ((await query.answer(`✅ Selected: ${pyStr(pySlice(pyGet(pySub(courses, idx), "name", ""), null, 20, null))}`)));
            }
      }
      void ((await render_category_reorder_panel(query, context, p_path)));
      return;
  } else if (pyT(pyStart(data, "adm_fld_pos_pick_"))) {
      rest = pyReplace(data, "adm_fld_pos_pick_", "");
      if (pyT((pyEq(rest, "cancel")))) {
            p_path = pyGet(context.user_data, "reorder_parent_path", "");
            pyPop(context.user_data, "pos_pick", null);
            void ((await render_category_reorder_panel(query, context, p_path)));
            return;
      }
      try {
            idx = pyInt(rest);
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      pick = (((__v92) => (pyT(__v92) ? __v92 : ({  })))(pyGet(context.user_data, "pos_pick")));
      sibs = pyGet(pick, "siblings", []);
      name = pyGet(pick, "name", "");
      p_path = pyGet(pick, "parent", pyGet(context.user_data, "reorder_parent_path", ""));
      if (pyT((((__v93) => (pyT(__v93) ? __v93 : ((!pyT(((0 <= idx) && (idx < pyLen(sibs))))))))((!pyT(name)))))) {
            void ((await query.answer("Session expired!", { show_alert: true })));
            return;
      }
      sib = pySub(sibs, idx);
      ok = db.move_folder_right(p_path, name, sib);
      pyPop(context.user_data, "pos_pick", null);
      if (pyT(ok)) {
            new_parent = (pyT(p_path) ? (`${pyStr(p_path)} > ${pyStr(sib)}`) : (sib));
            context.user_data["reorder_parent_path"] = new_parent;
            void ((await query.answer(`✅ '${pyStr(name)}' → '${pyStr(sib)}'!`, { show_alert: true })));
            void ((await render_category_reorder_panel(query, context, new_parent)));
      } else {
            void ((await query.answer("❌ Move failed!", { show_alert: true })));
            void ((await render_category_reorder_panel(query, context, p_path)));
      }
      return;
  } else if (pyT(pyStart(data, "adm_fld_pos_cpick_"))) {
      rest = pyReplace(data, "adm_fld_pos_cpick_", "");
      if (pyT((pyEq(rest, "cancel")))) {
            p_path = pyGet(context.user_data, "reorder_parent_path", "");
            pyPop(context.user_data, "pos_cpick", null);
            void ((await render_category_reorder_panel(query, context, p_path)));
            return;
      }
      try {
            idx = pyInt(rest);
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      pick = (((__v94) => (pyT(__v94) ? __v94 : ({  })))(pyGet(context.user_data, "pos_cpick")));
      subs = pyGet(pick, "subs", []);
      cid = pyGet(pick, "cid");
      p_path = pyGet(pick, "parent", pyGet(context.user_data, "reorder_parent_path", ""));
      if (pyT((((__v95) => (pyT(__v95) ? __v95 : ((!pyT(((0 <= idx) && (idx < pyLen(subs))))))))((!pyT(cid)))))) {
            void ((await query.answer("Session expired!", { show_alert: true })));
            return;
      }
      ok = db.move_course_right(cid, pySub(subs, idx));
      pyPop(context.user_data, "pos_cpick", null);
      pyPop(context.user_data, "pos_sel", null);
      if (pyT(ok)) {
            void ((await query.answer(`✅ Course → '${pyStr(pySub(subs, idx))}'!`, { show_alert: true })));
      } else {
            void ((await query.answer("❌ Move failed!", { show_alert: true })));
      }
      void ((await render_category_reorder_panel(query, context, p_path)));
      return;
  } else if (pyT((((__v96) => (pyT(__v96) ? ((pyContains(["up", "down", "left", "right"], pyReplace(data, "adm_fld_pos_", "")))) : __v96))(pyStart(data, "adm_fld_pos_"))))) {
      action = pyReplace(data, "adm_fld_pos_", "");
      p_path = pyGet(context.user_data, "reorder_parent_path", "");
      sel = (((__v97) => (pyT(__v97) ? __v97 : ({  })))(pyGet(context.user_data, "pos_sel")));
      if (pyT((!pyT(sel)))) {
            void ((await query.answer("⚠️ আগে কোনো category select করুন!", { show_alert: true })));
            return;
      }
      per_row = (pyT((!pyT(p_path))) ? (db.get_category_row_size()) : (db.get_subcategory_row_size()));
      delta = pySub({ left: (-(1)), right: 1, up: (-(per_row)), down: per_row }, action);
      if (pyT((pyEq(pyGet(sel, "kind"), "f")))) {
            name = pyGet(sel, "name", "");
            folders = db.get_sub_folders(p_path, { include_inactive: true });
            if (pyT(((!pyContains(folders, name))))) {
                    pyPop(context.user_data, "pos_sel", null);
                    void ((await query.answer("❌ Not found!", { show_alert: true })));
                    void ((await render_category_reorder_panel(query, context, p_path)));
                    return;
            }
            ok = db.move_folder_to(p_path, name, (pyIndex(folders, name) + delta));
      } else {
            cid = pyGet(sel, "id");
            courses = (pyT(p_path) ? (db.get_courses_by_folder(p_path, { include_inactive: true })) : ([]));
            idx = pyNext(((() => { const __acc = []; for (const [i, c] of pyIter(pyEnumerate(courses))) { if (!pyT((pyEq(pyGet(c, "id"), cid)))) continue; __acc.push(i); } return __acc; })()), (-(1)));
            if (pyT(((idx < 0)))) {
                    pyPop(context.user_data, "pos_sel", null);
                    void ((await query.answer("❌ Course not found!", { show_alert: true })));
                    void ((await render_category_reorder_panel(query, context, p_path)));
                    return;
            }
            ok = db.move_course_to(cid, (idx + delta));
      }
      if (pyT(ok)) {
            void ((await query.answer("✅")));
      } else {
            void ((await query.answer("⚠️ আর এদিকে যাওয়া যাবে না!", { show_alert: true })));
      }
      void ((await render_category_reorder_panel(query, context, p_path)));
      return;
  } else if (pyT((pyEq(data, "adm_fld_cancel_copy")))) {
      pyPop(context.user_data, "copy_folder_src", null);
      void ((await query.answer("❌ Cut cancelled!", { show_alert: true })));
      void ((await render_admin_folder_directory(query, context, pyGet(context.user_data, "active_dir", ""))));
      return;
  } else if (pyT((pyEq(data, "adm_fld_copy_go")))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("⚠️ Cut করতে কোনো folder-এর ভেতরে ঢুকুন!", { show_alert: true })));
            return;
      }
      if (pyT((pyEq(pyGet(context.user_data, "copy_folder_src"), active_dir)))) {
            void ((await query.answer(`✂️ Already cut! Destination-এ গিয়ে Paste চাপুন.`, { show_alert: true })));
            return;
      }
      context.user_data["copy_folder_src"] = active_dir;
      void ((await query.answer(`✂️ Cut! এখন destination-এ গিয়ে Paste চাপুন.`, { show_alert: true })));
      void ((await render_admin_folder_directory(query, context, active_dir)));
      return;
  } else if (pyT((pyEq(data, "adm_fld_paste_go")))) {
      src = pyStrip((((__v98) => (pyT(__v98) ? __v98 : ("")))(pyGet(context.user_data, "copy_folder_src"))));
      dest = pyGet(context.user_data, "active_dir", "");
      if (pyT((!pyT(src)))) {
            void ((await query.answer("⚠️ আগে কোনো folder Cut করুন!", { show_alert: true })));
            return;
      }
      if (pyT((((__v100) => (pyT(__v100) ? __v100 : ((((__v99) => (pyT(__v99) ? (pyStart(dest, (src + " > "))) : __v99))(dest)))))((pyEq(dest, src)))))) {
            void ((await query.answer("⚠️ নিজের ভেতরে Paste করা যাবে না!", { show_alert: true })));
            return;
      }
      src_base = pyStrip(pySub(pySplit(src, " > ", -1), (-(1))));
      new_path = (pyT(dest) ? (`${pyStr(dest)} > ${pyStr(src_base)}`) : (src_base));
      if (pyT((pyEq(new_path, src)))) {
            void ((await query.answer("⚠️ এটা already এখানেই আছে!", { show_alert: true })));
            return;
      }
      if (pyT((pyContains(db.get_sub_folders(dest, { include_inactive: true }), src_base)))) {
            void ((await query.answer("⚠️ ওই নামে folder destination-এ already আছে!", { show_alert: true })));
            return;
      }
      ok = db.move_folder_path(src, new_path);
      if (pyT((!pyT(ok)))) {
            void ((await query.answer("❌ Move failed! আবার চেষ্টা করুন।", { show_alert: true })));
            return;
      }
      pyPop(context.user_data, "copy_folder_src", null);
      void ((await query.answer(`✅ Moved as '${pyStr(new_path)}'!`, { show_alert: true })));
      void ((await render_admin_folder_directory(query, context, dest)));
      return;
  } else if (pyT((pyEq(data, "adm_fld_header")))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("⚠️ কোনো folder-এর ভেতরে ঢুকে Header সেট করুন!", { show_alert: true })));
            return;
      }
      void ((await render_folder_header_panel(query, context, active_dir)));
      return;
  } else if (pyT((pyEq(data, "adm_fld_header_text")))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("⚠️ Session expired!", { show_alert: true })));
            return;
      }
      context.user_data["admin_folder_header_text_wait"] = active_dir;
      void ((await query.edit_message_text(`✏️ <b>Send new title text for</b> <code>${pyStr(pyHtmlEscape(active_dir))}</code>:

❌ বাতিল করতে /cancel লিখুন।`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_fld_header" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_fld_header_media")))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("⚠️ Session expired!", { show_alert: true })));
            return;
      }
      context.user_data["admin_folder_header_media_wait"] = active_dir;
      void ((await query.edit_message_text("🖼️ <b>এখন একটা Photo বা GIF পাঠান:</b>\n\n❌ বাতিল করতে /cancel লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_fld_header" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_fld_header_rmmedia")))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      hdr = db.get_folder_header(active_dir);
      db.set_folder_header_media(active_dir, "none", "");
      if (pyT((!pyT(pyStrip((((__v101) => (pyT(__v101) ? __v101 : ("")))(pyGet(hdr, "text")))))))) {
            db.reset_folder_header(active_dir);
      }
      void ((await query.answer("🗑️ Header photo removed!", { show_alert: true })));
      void ((await render_folder_header_panel(query, context, active_dir)));
      return;
  } else if (pyT((pyEq(data, "adm_fld_header_reset")))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      db.reset_folder_header(active_dir);
      void ((await query.answer("↩️ Header reset to default!", { show_alert: true })));
      void ((await render_folder_header_panel(query, context, active_dir)));
      return;
  } else if (pyT(pyStart(data, "adm_fld_mleft_"))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      if (pyT(((pyLen(segments) <= 1)))) {
            void ((await query.answer("⚠️ Already a root category, cannot move left!", { show_alert: true })));
            return;
      }
      current_name = pySub(segments, (-(1)));
      parent_path = pyJoin(" > ", pySlice(segments, null, (-(1)), null));
      success = db.move_folder_left(parent_path, current_name);
      if (pyT(success)) {
            parent_segments = pySplit(parent_path, " > ", -1);
            parent_parent = (pyT(((pyLen(parent_segments) > 1))) ? (pyJoin(" > ", pySlice(parent_segments, null, (-(1)), null))) : (""));
            new_active_dir = (pyT(parent_parent) ? (`${pyStr(parent_parent)} > ${pyStr(current_name)}`) : (current_name));
            void ((await query.answer("✅ Moved left successfully!", { show_alert: true })));
            void ((await render_admin_folder_directory(query, context, new_active_dir)));
      } else {
            void ((await query.answer("❌ Move left failed!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_fld_mright_"))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      if (pyT((!pyT(segments)))) {
            void ((await query.answer("Cannot move!", { show_alert: true })));
            return;
      }
      current_name = pySub(segments, (-(1)));
      parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
      siblings = ((() => { const __acc = []; for (const s of pyIter(db.get_sub_folders(parent_path))) { if (!pyT(((!pyEq(s, current_name))))) continue; __acc.push(s); } return __acc; })());
      if (pyT((!pyT(siblings)))) {
            void ((await query.answer("⚠️ No sibling folders to move into!", { show_alert: true })));
            return;
      }
      context.user_data["move_folder_name"] = current_name;
      context.user_data["move_folder_parent"] = parent_path;
      context.user_data["move_folder_siblings"] = siblings;
      keyboard = [];
      for (const [idx, s] of pyIter(pyEnumerate(siblings))) {
            pyAppend(keyboard, [InlineKeyboardButton(`📁 ${pyStr(s)}`, { callback_data: `adm_fld_doright_${pyStr(idx)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: `adm_dir_${pyStr(active_dir)}` })]);
      void ((await query.edit_message_text(`➡️ <b>Select a sibling folder to move '${pyStr(pyHtmlEscape(current_name))}' into:</b>`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_fld_doright_"))) {
      idx = pyInt(pyReplace(data, "adm_fld_doright_", ""));
      current_name = pyGet(context.user_data, "move_folder_name");
      parent_path = pyGet(context.user_data, "move_folder_parent");
      siblings = pyGet(context.user_data, "move_folder_siblings", []);
      if (pyT((((__v102) => (pyT(__v102) ? __v102 : (((idx >= pyLen(siblings))))))((!pyT(current_name)))))) {
            void ((await query.answer("Session expired or invalid choice!", { show_alert: true })));
            return;
      }
      sibling_name = pySub(siblings, idx);
      success = db.move_folder_right(parent_path, current_name, sibling_name);
      pyPop(context.user_data, "move_folder_name", null);
      pyPop(context.user_data, "move_folder_parent", null);
      pyPop(context.user_data, "move_folder_siblings", null);
      if (pyT(success)) {
            void ((await query.answer(`✅ Moved '${pyStr(current_name)}' into '${pyStr(sibling_name)}'!`, { show_alert: true })));
            void ((await render_admin_folder_directory(query, context, parent_path)));
      } else {
            void ((await query.answer("❌ Move failed!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_fld_rename_"))) {
      folder_name = pyReplace(data, "adm_fld_rename_", "");
      active_dir = pyGet(context.user_data, "active_dir", "");
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
      context.user_data["rename_folder_old"] = folder_name;
      context.user_data["rename_folder_parent"] = parent_path;
      context.user_data["awaiting_folder_rename"] = true;
      void ((await query.edit_message_text(`✏️ **Rename '${pyStr(folder_name)}' to:**

(Type new name or click Cancel below)`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_dir_${pyStr(active_dir)}` })]]) })));
  } else if (pyT(pyStart(data, "adm_delcat_confirm_"))) {
      cat_name = pyReplace(data, "adm_delcat_confirm_", "");
      db.delete_category(cat_name);
      void ((await query.answer(`✅ '${pyStr(cat_name)}' deleted!`, { show_alert: true })));
      void ((await render_admin_folder_directory(query, context, "")));
  } else if (pyT(pyStart(data, "adm_delcat_"))) {
      cat_name = pyReplace(data, "adm_delcat_", "");
      n_sub = pyLen(db.get_sub_folders(cat_name, { include_inactive: true }));
      n_courses = pyLen(db.get_courses_by_folder(cat_name, { include_inactive: true }));
      confirm_kb = InlineKeyboardMarkup([[InlineKeyboardButton("✅ Yes, Delete", { callback_data: `adm_delcat_confirm_${pyStr(cat_name)}` })], [InlineKeyboardButton("« Cancel", { callback_data: "adm_dir_" })]]);
      void ((await query.edit_message_text(`🗑️ <b>Delete category?</b>

📁 <b>${pyStr(pyHtmlEscape(cat_name))}</b> will be permanently removed.
📂 Sub-folders: <b>${pyStr(n_sub)}</b> | 📚 Courses: <b>${pyStr(n_courses)}</b>
This cannot be undone.`, { parse_mode: "HTML", reply_markup: confirm_kb })));
  } else if (pyT(pyStart(data, "adm_delsubmenu_"))) {
      cat = pyReplace(data, "adm_delsubmenu_", "");
      subcats = db.get_sub_folders(cat);
      if (pyT((!pyT(subcats)))) {
            void ((await query.answer("No sub-categories available!")));
            return;
      }
      keyboard = [];
      for (const s of pyIter(subcats)) {
            pyAppend(keyboard, [InlineKeyboardButton(`✕ Delete: ${pyStr(s)}`, { callback_data: `adm_delsub_${pyStr(cat)}_${pyStr(s)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: `adm_dir_${pyStr(cat)}` })]);
      void ((await query.edit_message_text(`✕ **Select sub-category to delete from \`${pyStr(cat)}\`:**`, { reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_delsub_confirm_"))) {
      parts = pySplit(pyReplace(data, "adm_delsub_confirm_", ""), "_", 1);
      cat = pySub(parts, 0);
      sub = (pyT(((pyLen(parts) > 1))) ? (pySub(parts, 1)) : (""));
      db.delete_sub_folder(cat, sub);
      void ((await query.answer(`✅ '${pyStr(sub)}' deleted!`, { show_alert: true })));
      void ((await render_admin_folder_directory(query, context, cat)));
  } else if (pyT((((__v104) => (pyT(__v104) ? (((__v103) => (pyT(__v103) ? ((!pyT(pyStart(data, "adm_delsub_confirm_")))) : __v103))((!pyT(pyStart(data, "adm_delsubmenu_"))))) : __v104))(pyStart(data, "adm_delsub_"))))) {
      parts = pySplit(pyReplace(data, "adm_delsub_", ""), "_", 1);
      cat = pySub(parts, 0);
      sub = (pyT(((pyLen(parts) > 1))) ? (pySub(parts, 1)) : (""));
      full = (pyT(sub) ? (`${pyStr(cat)} > ${pyStr(sub)}`) : (cat));
      n_sub = pyLen(db.get_sub_folders(full, { include_inactive: true }));
      n_courses = pyLen(db.get_courses_by_folder(full, { include_inactive: true }));
      confirm_kb = InlineKeyboardMarkup([[InlineKeyboardButton("✅ Yes, Delete", { callback_data: `adm_delsub_confirm_${pyStr(cat)}_${pyStr(sub)}` })], [InlineKeyboardButton("« Cancel", { callback_data: `adm_dir_${pyStr(cat)}` })]]);
      void ((await query.edit_message_text(`🗑️ <b>Delete sub-category?</b>

📁 <b>${pyStr(pyHtmlEscape(full))}</b> will be permanently removed.
📂 Sub-folders: <b>${pyStr(n_sub)}</b> | 📚 Courses: <b>${pyStr(n_courses)}</b>
This cannot be undone.`, { parse_mode: "HTML", reply_markup: confirm_kb })));
  } else if (pyT((pyEq(data, "adm_courses")))) {
      keyboard = [[InlineKeyboardButton("📁 Manage Course Categories", { callback_data: "adm_categories" })], [InlineKeyboardButton("📋 All Courses List", { callback_data: "adm_list_courses" })], [InlineKeyboardButton("➕ Add New Course", { callback_data: "adm_add_course" })], [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]];
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text("❖ **Course Management Menu:**", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await query.edit_message_text("❖ **Course Management Menu:**", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else if (pyT((pyEq(data, "adm_add_course")))) {
      active_dir = pyGet(context.user_data, "active_dir", "");
      if (pyT(active_dir)) {
            segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
            cat = (pyT(segments) ? (pySub(segments, 0)) : ("General"));
            sub = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, 1, null, null))) : ("General"));
            context.user_data["admin_add_course"] = true;
            context.user_data["course_step"] = "name";
            context.user_data["course_origin_callback"] = `adm_dir_${pyStr(active_dir)}`;
            context.user_data["new_course"] = { category: cat, subcategory: sub, folder_path: active_dir, program: (pyT(segments) ? (pyLower(pySub(segments, (-(1))))) : ("general")) };
            path_disp = active_dir;
            msg = `📁 **Folder:** \`${pyStr(path_disp)}\`
━━━━━━━━━━━━━━━━━━━━

**Step 1 of 4 — Course Name**
Send the course name.

Example: \`BH Biology Full Course | ${pyStr(cat)}\`
The course will be added to this folder.`;
            k_cancel = [[InlineKeyboardButton("✕ Cancel", { callback_data: `adm_dir_${pyStr(active_dir)}` })]];
            void ((await send_wizard_step1(query, context, msg, k_cancel)));
      } else {
            categories = db.get_categories();
            if (pyT((!pyT(categories)))) {
                    void ((await query.answer("⚠️ প্রথমে একটি ক্যাটাগরি তৈরি করুন!", { show_alert: true })));
                    return;
            }
            keyboard = [];
            per_row = db.get_category_row_size();
            row = [];
            for (const cat of pyIter(categories)) {
                    pyAppend(row, InlineKeyboardButton(`📁 ${pyStr(cat)}`, { callback_data: `adm_addcourse_dir_${pyStr(cat)}` }));
                    if (pyT((pyEq(pyLen(row), per_row)))) {
                              pyAppend(keyboard, row);
                              row = [];
                    }
            }
            if (pyT(row)) {
                    pyAppend(keyboard, row);
            }
            pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_courses" })]);
            msg = "📂 **কোর্স যোগ করতে প্রথমে ক্যাটাগরি নির্বাচন করুন:**\n━━━━━━━━━━━━━━━━━━━━\nযে ক্যাটাগরি বা ফোল্ডারের অধীনে নতুন কোর্সটি যুক্ত করতে চান সেটি নির্বাচন করুন:";
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
  } else if (pyT(pyStart(data, "adm_setcat_"))) {
      cat_selected = pyReplace(data, "adm_setcat_", "");
      if (pyT((pyEq(cat_selected, "CUSTOM")))) {
            context.user_data["course_step"] = "type_custom_cat";
            msg_p = "✍️ **নতুন ক্যাটাগরির নাম লিখুন (যেমন: HSC 28 বা SSC):**\n\n(বাতিল করতে নিচের বাটনে চাপুন)";
            k_canc = [[InlineKeyboardButton("« Cancel", { callback_data: "adm_courses" })]];
            if (pyT(_msg_has_media(query.message))) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await query.message.reply_text(msg_p, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_canc) })));
            } else {
                    void ((await query.edit_message_text(msg_p, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_canc) })));
            }
            return;
      }
      new_course = pyGet(context.user_data, "new_course", {  });
      new_course["category"] = cat_selected;
      context.user_data["new_course"] = new_course;
      context.user_data["course_step"] = "subcategory";
      void ((await send_admin_subcategory_selector(query, context, cat_selected)));
  } else if (pyT(pyStart(data, "adm_setsub_"))) {
      sub_chosen = pyReplace(data, "adm_setsub_", "");
      new_course = pyGet(context.user_data, "new_course", {  });
      if (pyT((pyEq(sub_chosen, "CUSTOM")))) {
            context.user_data["course_step"] = "type_custom_sub";
            msg_p = "✍️ **নতুন সাব-ক্যাটাগরির নাম লিখুন (যেমন: Academic বা Physics):**\n\n(বাতিল করতে নিচের বাটনে চাপুন)";
            k_canc = [[InlineKeyboardButton("« Cancel", { callback_data: "adm_courses" })]];
            if (pyT(_msg_has_media(query.message))) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await query.message.reply_text(msg_p, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_canc) })));
            } else {
                    void ((await query.edit_message_text(msg_p, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_canc) })));
            }
            return;
      }
      new_course["subcategory"] = sub_chosen;
      new_course["program"] = pyLower(sub_chosen);
      context.user_data["new_course"] = new_course;
      if (pyT((((__v106) => (pyT(__v106) ? (((__v105) => (pyT(__v105) ? (pyGet(new_course, "description")) : __v105))((pyContains(new_course, "price")))) : __v106))(pyGet(new_course, "name"))))) {
            if (pyT(((!pyContains(new_course, "access_link"))))) {
                    context.user_data["course_step"] = "link";
                    p_text = "🔗 **ধাপ ৬/৭: টেলিগ্রাম প্রাইভেট চ্যানেল বা ড্রাইভ এক্সেস লিংক পাঠান:**\n━━━━━━━━━━━━━━━━━━━━\n💡 লিংক না থাকলে বা পরে দিতে চাইলে নিচের স্কিপ বাটনে চাপুন:";
                    k_link = [[InlineKeyboardButton("⏭️ Skip Link (স্কিপ করুন)", { callback_data: "adm_skip_link" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_course" })]];
                    if (pyT(_msg_has_media(query.message))) {
                              try {
                                          void ((await query.message.delete()));
                              } catch (__e) {
                              }
                              void ((await query.message.reply_text(p_text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_link) })));
                    } else {
                              void ((await query.edit_message_text(p_text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_link) })));
                    }
            } else if (pyT((!pyT(pyGet(new_course, "image"))))) {
                    context.user_data["course_step"] = "image";
                    p_img = "🖼️ **ধাপ ৭/৭: কোর্সের ব্যানার বা ছবি পাঠান:**\n━━━━━━━━━━━━━━━━━━━━\n💡 ছবি ছাড়া প্রকাশ করতে চাইলে নিচের স্কিপ বাটনে চাপুন:";
                    k_img = [[InlineKeyboardButton("⏭️ Skip Image (ছবি ছাড়া প্রকাশ)", { callback_data: "adm_skip_img" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_course" })]];
                    if (pyT(_msg_has_media(query.message))) {
                              try {
                                          void ((await query.message.delete()));
                              } catch (__e) {
                              }
                              void ((await query.message.reply_text(p_img, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_img) })));
                    } else {
                              void ((await query.edit_message_text(p_img, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_img) })));
                    }
            } else {
                    void ((await send_admin_course_preview(query, context, new_course)));
            }
      } else {
            context.user_data["course_step"] = "price";
            p_price = `📖 **Sub-Category:** \`${pyStr(sub_chosen)}\`

💰 **ধাপ ৪/৬: কোর্সের মূল্য লিখুন (Price in BDT):**
(ফ্রি কোর্সের জন্য \`0\` লিখুন)`;
            k_c = [[InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_course" })]];
            if (pyT(_msg_has_media(query.message))) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await query.message.reply_text(p_price, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_c) })));
            } else {
                    void ((await query.edit_message_text(p_price, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_c) })));
            }
      }
  } else if (pyT((pyEq(data, "adm_skip_link")))) {
      new_course = pyGet(context.user_data, "new_course", {  });
      new_course["access_link"] = "";
      context.user_data["new_course"] = new_course;
      void ((await send_admin_group_id_prompt(query, context)));
  } else if (pyT((pyEq(data, "adm_skip_group")))) {
      new_course = pyGet(context.user_data, "new_course", {  });
      new_course["group_id"] = "";
      new_course["group_ids"] = [];
      context.user_data["new_course"] = new_course;
      if (pyT(pyGet(new_course, "image"))) {
            void ((await send_admin_course_preview(query, context, new_course)));
      } else {
            context.user_data["course_step"] = "image";
            p_img = "🖼️ **ধাপ ৭/৭: কোর্সের ব্যানার বা ছবি পাঠান:**\n━━━━━━━━━━━━━━━━━━━━\n💡 ছবি ছাড়া প্রকাশ করতে চাইলে নিচের স্কিপ বাটনে চাপুন:";
            k_img = [[InlineKeyboardButton("⏭️ Skip Image (ছবি ছাড়া প্রকাশ)", { callback_data: "adm_skip_img" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_course" })]];
            if (pyT(_msg_has_media(query.message))) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await query.message.reply_text(p_img, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_img) })));
            } else {
                    void ((await query.edit_message_text(p_img, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_img) })));
            }
      }
  } else if (pyT((pyEq(data, "adm_group_done")))) {
      new_course = pyGet(context.user_data, "new_course", {  });
      if (pyT(pyGet(new_course, "image"))) {
            void ((await send_admin_course_preview(query, context, new_course)));
      } else {
            context.user_data["course_step"] = "image";
            p_img = "🖼️ **ধাপ ৭/৭: কোর্সের ব্যানার বা ছবি পাঠান:**\n━━━━━━━━━━━━━━━━━━━━\n💡 ছবি ছাড়া প্রকাশ করতে চাইলে নিচের স্কিপ বাটনে চাপুন:";
            k_img = [[InlineKeyboardButton("⏭️ Skip Image (ছবি ছাড়া প্রকাশ)", { callback_data: "adm_skip_img" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_course" })]];
            if (pyT(_msg_has_media(query.message))) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await query.message.reply_text(p_img, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_img) })));
            } else {
                    void ((await query.edit_message_text(p_img, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_img) })));
            }
      }
  } else if (pyT((pyEq(data, "adm_skip_img")))) {
      new_course = pyGet(context.user_data, "new_course", {  });
      new_course["image"] = "";
      context.user_data["new_course"] = new_course;
      void ((await send_admin_course_preview(query, context, new_course)));
  } else if (pyT((pyEq(data, "adm_pub_course")))) {
      new_course = pyGet(context.user_data, "new_course", {  });
      if (pyT((((__v107) => (pyT(__v107) ? __v107 : ((!pyT(pyGet(new_course, "name"))))))((!pyT(new_course)))))) {
            void ((await query.answer("❌ কোনো কোর্স তথ্য পাওয়া যায়নি!", { show_alert: true })));
            return;
      }
      course_id = `COURSE-${pyStr(pyInt(pyTimestamp(pyNow())))}`;
      new_course["id"] = course_id;
      if (pyT((((__v108) => (pyT(__v108) ? __v108 : ((!pyT(pySub(new_course, "category"))))))(((!pyContains(new_course, "category"))))))) {
            new_course["category"] = "HSC 28";
      }
      if (pyT((((__v109) => (pyT(__v109) ? __v109 : ((!pyT(pySub(new_course, "subcategory"))))))(((!pyContains(new_course, "subcategory"))))))) {
            new_course["subcategory"] = "Academic";
      }
      if (pyT(((!pyContains(new_course, "program"))))) {
            new_course["program"] = pyLower(pyStr(pySub(new_course, "subcategory")));
      }
      if (pyT(((!pyContains(new_course, "price"))))) {
            new_course["price"] = 0;
      }
      if (pyT((((__v110) => (pyT(__v110) ? __v110 : ((!pyT(pySub(new_course, "description"))))))(((!pyContains(new_course, "description"))))))) {
            new_course["description"] = "কোর্সের বিস্তারিত তথ্য শীঘ্রই যুক্ত করা হবে।";
      }
      if (pyT(((!pyContains(new_course, "features"))))) {
            new_course["features"] = pySub(new_course, "description");
      }
      if (pyT(((!pyContains(new_course, "instructor"))))) {
            new_course["instructor"] = "অভিজ্ঞ শিক্ষকবৃন্দ";
      }
      if (pyT(((!pyContains(new_course, "access_link"))))) {
            new_course["access_link"] = "";
      }
      db.add_course(course_id, new_course);
      fld = pyStrip(pyGet(new_course, "folder_path", ""));
      if (pyT(fld)) {
            fld_segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(fld, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
            for (const i of pyIter(pyRange(pyLen(fld_segments)))) {
                    parent = pyJoin(" > ", pySlice(fld_segments, null, i, null));
                    name = pySub(fld_segments, i);
                    db.add_sub_folder(parent, name);
            }
      } else {
            db.add_category(pyGet(new_course, "category", "General"));
      }
      context.user_data["admin_add_course"] = false;
      pyPop(context.user_data, "new_course", null);
      pyPop(context.user_data, "course_step", null);
      void ((await query.answer("🎉 কোর্সটি সফলভাবে পাবলিশ করা হয়েছে!", { show_alert: true })));
      price_tag = (pyT(((pySub(new_course, "price") > 0))) ? (`${pyStr(pySub(new_course, "price"))} ৳`) : ("বিনামূল্যে (Free) 🎁"));
      done_text = `🎉 <b>কোর্স সফলভাবে লাইভ পাবলিশ হয়েছে!</b>
━━━━━━━━━━━━━━━━━━━━

📖 <b>কোর্স:</b> ${pyStr(pyHtmlEscape(pySub(new_course, "name")))}
💰 <b>মূল্য:</b> ${pyStr(price_tag)}
📂 <b>ক্যাটাগরি:</b> ${pyStr(pyHtmlEscape(pySub(new_course, "category")))} | ${pyStr(pyHtmlEscape(pySub(new_course, "subcategory")))}
🔗 <b>এক্সেস লিংক:</b> ${pyStr(pyHtmlEscape((((__v111) => (pyT(__v111) ? __v111 : ("দেওয়া হয়নি")))(pySub(new_course, "access_link")))))}

💡 শিক্ষার্থীরা এখন সরাসরি বটের মেনু থেকে এই কোর্সটি দেখতে ও কিনতে পারবে।`;
      k_done = [[InlineKeyboardButton("📁 Open Folder", { callback_data: (pyT(fld) ? (`adm_dir_${pyStr(fld)}`) : ("adm_categories")) })], [InlineKeyboardButton("➕ Add Another Course", { callback_data: (pyT(fld) ? (`adm_addcourse_dir_${pyStr(fld)}`) : ("adm_add_course")) })], [InlineKeyboardButton("📂 All Categories", { callback_data: "adm_categories" })]];
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(done_text, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(k_done) })));
      } else {
            void ((await query.edit_message_text(done_text, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(k_done) })));
      }
  } else if (pyT((pyEq(data, "adm_chg_img")))) {
      context.user_data["course_step"] = "image_edit";
      msg_img = "🖼️ **কোর্সের নতুন ব্যানার বা ছবি পাঠান:**\n\n(ছবি সরাতে 'remove' লিখে পাঠান)\n(আগের ছবিতে ফিরে যেতে /cancel লিখুন)";
      k_back = [[InlineKeyboardButton("« Back to Preview", { callback_data: "adm_back_prev" })]];
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(msg_img, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_back) })));
      } else {
            void ((await query.edit_message_text(msg_img, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_back) })));
      }
  } else if (pyT((pyEq(data, "adm_chg_cat")))) {
      void ((await send_admin_category_selector(query, context, "📂 **ক্যাটাগরি পরিবর্তন করুন:**")));
  } else if (pyT((pyEq(data, "adm_chg_fields")))) {
      k_edit = [[InlineKeyboardButton("✏️ Name / Title", { callback_data: "adm_edprev_name" }), InlineKeyboardButton("💰 Price", { callback_data: "adm_edprev_price" })], [InlineKeyboardButton("📝 Description", { callback_data: "adm_edprev_desc" }), InlineKeyboardButton("🔗 Access Link", { callback_data: "adm_edprev_link" })], [InlineKeyboardButton("👥 Group ID", { callback_data: "adm_edprev_group_id" })], [InlineKeyboardButton("« Back to Preview", { callback_data: "adm_back_prev" })]];
      msg_f = "✏️ **যে তথ্যটি সংশোধন করতে চান তা নির্বাচন করুন:**";
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(msg_f, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_edit) })));
      } else {
            void ((await query.edit_message_text(msg_f, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_edit) })));
      }
  } else if (pyT(pyStart(data, "adm_edprev_"))) {
      field = pyReplace(data, "adm_edprev_", "");
      context.user_data["course_step"] = `edit_field_${pyStr(field)}`;
      field_labels = { name: "কোর্সের নতুন নাম (Course Title)", price: "নতুন মূল্য (Price in BDT, e.g. 400 or 0)", desc: "নতুন বিস্তারিত বিবরণ (Description)", link: "নতুন টেলিগ্রাম/ড্রাইভ লিংক (Access Link)", group_id: "নতুন Telegram Group / Channel ID" };
      lbl = pyGet(field_labels, field, field);
      p_txt = `✏️ **${pyStr(lbl)} লিখে পাঠান:**

(ফিরে যেতে নিচের বাটনে চাপুন)`;
      k_b = [[InlineKeyboardButton("« Back to Preview", { callback_data: "adm_back_prev" })]];
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(p_txt, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_b) })));
      } else {
            void ((await query.edit_message_text(p_txt, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_b) })));
      }
  } else if (pyT((pyEq(data, "adm_back_prev")))) {
      new_course = pyGet(context.user_data, "new_course", {  });
      void ((await send_admin_course_preview(query, context, new_course)));
  } else if (pyT((pyContains(["adm_cancel_course", "adm_course_cancel"], data)))) {
      origin = pyPop(context.user_data, "course_origin_callback", "adm_main");
      context.user_data["admin_add_course"] = false;
      pyPop(context.user_data, "new_course", null);
      pyPop(context.user_data, "course_step", null);
      void ((await query.answer("✕ কোর্স wizard বাতিল করা হয়েছে।")));
      if (pyT((pyEq(origin, "adm_main")))) {
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
            fake_query = FakeCallbackQuery(query.message, "adm_main", query.from_user);
                  class FakeUpdate {
                          constructor(message, callback_query) {
                                    this.message = message;
                                    this.callback_query = callback_query;
                                    this.effective_user = callback_query.from_user;
                                    this.effective_chat = message.chat;
                          }
                  }
            void ((await handle_admin_callback(FakeUpdate(query.message, fake_query), context)));
      } else if (pyT(pyStart(origin, "adm_dir_"))) {
            dir_path = pyReplace(origin, "adm_dir_", "");
            void ((await render_admin_folder_directory(query, context, dir_path)));
      } else {
            k_cmenu = [[InlineKeyboardButton("➕ Add New Course", { callback_data: "adm_add_course" })], [InlineKeyboardButton("📋 All Courses & Delete", { callback_data: "adm_list_courses" })], [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]];
            if (pyT(_msg_has_media(query.message))) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await query.message.reply_text("❖ **Course Management Menu:**", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_cmenu) })));
            } else {
                    void ((await query.edit_message_text("❖ **Course Management Menu:**", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_cmenu) })));
            }
      }
  } else if (pyT((pyEq(data, "adm_course_back")))) {
      step = pyGet(context.user_data, "course_step");
      new_course = pyGet(context.user_data, "new_course", {  });
      try {
            context.user_data["last_wizard_msg_id"] = query.message.message_id;
      } catch (__e) {
      }
      if (pyT((pyEq(step, "price")))) {
            context.user_data["course_step"] = "name";
            fld = pyGet(new_course, "folder_path", "General");
            cat = pyGet(new_course, "category", "General");
            msg = `📁 **Folder:** \`${pyStr(fld)}\`
━━━━━━━━━━━━━━━━━━━━

**Step 1 of 4 — Course Name**
Send the course name.

Example: \`BH Biology Full Course | ${pyStr(cat)}\`
The course will be added to this folder.`;
            k_cancel = [[InlineKeyboardButton("✕ Cancel", { callback_data: `adm_dir_${pyStr(fld)}` })]];
            void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_cancel) })));
      } else if (pyT((pyEq(step, "description")))) {
            context.user_data["course_step"] = "price";
            p_price = `📘 **Course:** ${pyStr(pyGet(new_course, "name", ""))}

**Step 2 of 4 — Price (BDT)**
Send the price as a number. Send \`0\` for a free course.`;
            keyboard = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
            void ((await query.edit_message_text(p_price, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else if (pyT((pyEq(step, "link")))) {
            context.user_data["course_step"] = "description";
            price_val = pyGet(new_course, "price", 0);
            price_tag = (pyT(((price_val > 0))) ? (`৳${pyStr(price_val)}`) : ("বিনামূল্যে (Free) 🎁"));
            p_desc = `💰 **Price:** ${pyStr(price_tag)}

**Step 3 of 4 — Description**
Send a short course description. You can write multiple lines.`;
            keyboard = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
            void ((await query.edit_message_text(p_desc, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else if (pyT((pyEq(step, "image")))) {
            context.user_data["course_step"] = "link";
            fld = pyGet(new_course, "folder_path", "General");
            p_text = `📁 **Folder:** \`${pyStr(fld)}\`
━━━━━━━━━━━━━━━━━━━━
**Step 4 of 4 — Access Link**
Send the Telegram or Drive link, or tap **Skip Link** to add it later.`;
            keyboard = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_course_back" }), InlineKeyboardButton("⏭️ Skip Link", { callback_data: "adm_skip_link" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_course_cancel" })]];
            void ((await query.edit_message_text(p_text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else if (pyT((((__v112) => (pyT(__v112) ? __v112 : (pyStart(data, "adm_list_courses_"))))((pyEq(data, "adm_list_courses")))))) {
      try {
            page_num = (pyT(pyStart(data, "adm_list_courses_")) ? (pyInt(pyReplace(data, "adm_list_courses_", ""))) : (0));
      } catch (__e) {
            page_num = 0;
      }
      courses = db.get_all_courses();
      if (pyT((!pyT(courses)))) {
            void ((await query.edit_message_text("❌ No courses found.", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_courses" })]]) })));
            return;
      }
      per_page = 8;
      items = pyList(pyItems(courses));
      total_pages = pyMax(1, pyDiv(((pyLen(items) + per_page) - 1), per_page));
      page_num = pyMax(0, pyMin(page_num, (total_pages - 1)));
      keyboard = [];
      for (const [cid, c] of pyIter(pySlice(items, ((typeof page_num === 'string' || Array.isArray(page_num) ? pyRepeat(page_num, per_page) : (page_num * per_page))), ((typeof (page_num + 1) === 'string' || Array.isArray((page_num + 1)) ? pyRepeat((page_num + 1), per_page) : ((page_num + 1) * per_page))), null))) {
            price_tag = (pyT(((pyGet(c, "price", 0) > 0))) ? (` ─ ৳${pyStr(pySub(c, "price"))}`) : (" (Free)"));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(pySub(c, "name"))}${pyStr(price_tag)}`, { callback_data: `adm_edit_${pyStr(cid)}` })]);
      }
      nav = [];
      if (pyT(((page_num > 0)))) {
            pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `adm_list_courses_${pyStr((page_num - 1))}` }));
      } else {
            pyAppend(nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_courselist" }));
      }
      pyAppend(nav, InlineKeyboardButton(`Page ${pyStr((page_num + 1))}/${pyStr(total_pages)}`, { callback_data: "noop_courselist" }));
      if (pyT(((page_num < (total_pages - 1))))) {
            pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: `adm_list_courses_${pyStr((page_num + 1))}` }));
      } else {
            pyAppend(nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_courselist" }));
      }
      pyAppend(keyboard, nav);
      pyAppend(keyboard, [InlineKeyboardButton("« Course Management", { callback_data: "adm_courses" })]);
      msg_text = "📋 **All Courses List:**\n━━━━━━━━━━━━━━━━━━━━\nSelect any course to view details, edit or delete:";
      void ((await query.answer()));
      try {
            if (pyT(_msg_has_media(query.message))) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await query.message.reply_text(msg_text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
            } else {
                    void ((await query.edit_message_text(msg_text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
            }
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw e;
            }
      }
  } else if (pyT((((__v_eblist) => (pyT(__v_eblist) ? __v_eblist : (pyStart(data, "adm_list_ebooks_"))))((pyEq(data, "adm_list_ebooks")))))) {
      try {
            eb_page_num = (pyT(pyStart(data, "adm_list_ebooks_")) ? (pyInt(pyReplace(data, "adm_list_ebooks_", ""))) : (0));
      } catch (__e) {
            eb_page_num = 0;
      }
      ebooks = db.get_all_ebooks();
      if (pyT((!pyT(ebooks)))) {
            void ((await query.edit_message_text("❌ No e-books found.", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebooks" })]]) })));
            return;
      }
      eb_per_page = 8;
      eb_items = pyList(pyItems(ebooks));
      eb_total_pages = pyMax(1, pyDiv(((pyLen(eb_items) + eb_per_page) - 1), eb_per_page));
      eb_page_num = pyMax(0, pyMin(eb_page_num, (eb_total_pages - 1)));
      eb_keyboard = [];
      for (const [eb_cid, eb_c] of pyIter(pySlice(eb_items, (eb_page_num * eb_per_page), ((eb_page_num + 1) * eb_per_page), null))) {
            eb_price_tag = (pyT(((pyGet(eb_c, "price", 0) > 0))) ? (` ─ ৳${pyStr(pySub(eb_c, "price"))}`) : (" (Free)"));
            pyAppend(eb_keyboard, [InlineKeyboardButton(`${pyStr(pySub(eb_c, "name"))}${pyStr(eb_price_tag)}`, { callback_data: `adm_editeb_${pyStr(eb_cid)}` })]);
      }
      eb_nav = [];
      if (pyT(((eb_page_num > 0)))) {
            pyAppend(eb_nav, InlineKeyboardButton("⬅️ Prev", { callback_data: `adm_list_ebooks_${pyStr((eb_page_num - 1))}` }));
      } else {
            pyAppend(eb_nav, InlineKeyboardButton("⬅️ Prev", { callback_data: "noop_ebooklist" }));
      }
      pyAppend(eb_nav, InlineKeyboardButton(`Page ${pyStr((eb_page_num + 1))}/${pyStr(eb_total_pages)}`, { callback_data: "noop_ebooklist" }));
      if (pyT(((eb_page_num < (eb_total_pages - 1))))) {
            pyAppend(eb_nav, InlineKeyboardButton("Next ➡️", { callback_data: `adm_list_ebooks_${pyStr((eb_page_num + 1))}` }));
      } else {
            pyAppend(eb_nav, InlineKeyboardButton("Next ➡️", { callback_data: "noop_ebooklist" }));
      }
      pyAppend(eb_keyboard, eb_nav);
      pyAppend(eb_keyboard, [InlineKeyboardButton("« E-Book Management", { callback_data: "adm_ebooks" })]);
      eb_msg_text = "📋 **All E-Books List:**\n━━━━━━━━━━━━━━━━━━━━\nSelect any e-book to view details, edit or delete:";
      void ((await query.answer()));
      try {
            if (pyT(_msg_has_media(query.message))) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await query.message.reply_text(eb_msg_text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(eb_keyboard) })));
            } else {
                    void ((await query.edit_message_text(eb_msg_text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(eb_keyboard) })));
            }
      } catch (e) {
            if (pyT(((!pyContains(pyLower(pyStr(e)), "not modified"))))) {
                    throw e;
            }
      }
  } else if (pyT(pyStart(data, "adm_course_toggle_"))) {
      cid = pyReplace(data, "adm_course_toggle_", "");
      new_status = db.toggle_course_status(cid);
      if (pyT(new_status)) {
            status_text = (pyT((pyEq(new_status, "active"))) ? ("Enabled") : ("Disabled"));
            void ((await query.answer(`✅ Course ${pyStr(status_text)} successfully!`, { show_alert: true })));
            void ((await show_course_edit_dashboard(query, cid)));
      } else {
            void ((await query.answer("❌ Error toggling status!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_course_clone_"))) {
      cid = pyReplace(data, "adm_course_clone_", "");
      new_cid = db.clone_course(cid);
      if (pyT(new_cid)) {
            void ((await query.answer("✅ Course Cloned (Copied) successfully!", { show_alert: true })));
            void ((await show_course_edit_dashboard(query, new_cid)));
      } else {
            void ((await query.answer("❌ Error cloning course!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_delcourse_confirm_"))) {
      cid = pyReplace(data, "adm_delcourse_confirm_", "");
      course = db.get_course(cid);
      if (pyT((!pyT(course)))) {
            void ((await query.answer("❌ Course not found (it may already be deleted).", { show_alert: true })));
            return;
      }
      folder_path = pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > ");
      if (pyT((!pyT(folder_path)))) {
            category = pyStrip(pyStr(pyGet(course, "category", "")));
            subcategory = pyStrip(pyStr(pyGet(course, "subcategory", "")));
            folder_path = (pyT((((__v113) => (pyT(__v113) ? __v113 : ((pyEq(pyLower(subcategory), "general")))))((!pyT(subcategory))))) ? (category) : (`${pyStr(category)} > ${pyStr(subcategory)}`));
      }
      if (pyT(db.delete_course(cid))) {
            void ((await query.answer("✅ Course deleted successfully!", { show_alert: true })));
            void ((await render_admin_folder_directory(query, context, folder_path)));
      } else {
            void ((await query.answer("❌ Could not delete this course. Please try again.", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_delcourse_"))) {
      cid = pyReplace(data, "adm_delcourse_", "");
      course = db.get_course(cid);
      if (pyT((!pyT(course)))) {
            void ((await query.answer("❌ Course not found (it may already be deleted).", { show_alert: true })));
            return;
      }
      confirm_text = `🗑️ <b>Delete course?</b>

<b>${pyStr(pyHtmlEscape(pyStr(pyGet(course, "name", "Untitled course"))))}</b> will be permanently removed.
This cannot be undone.`;
      confirm_keyboard = InlineKeyboardMarkup([[InlineKeyboardButton("✅ Yes, Delete", { callback_data: `adm_delcourse_confirm_${pyStr(cid)}` })], [InlineKeyboardButton("« Cancel", { callback_data: `adm_edit_${pyStr(cid)}` })]]);
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(confirm_text, { parse_mode: "HTML", reply_markup: confirm_keyboard })));
      } else {
            void ((await query.edit_message_text(confirm_text, { parse_mode: "HTML", reply_markup: confirm_keyboard })));
      }
  } else if (pyT(pyStart(data, "adm_course_mup_"))) {
      cid = pyReplace(data, "adm_course_mup_", "");
      success = db.move_course_order(cid, "up");
      if (pyT(success)) {
            void ((await query.answer("⬆️ Moved Up successfully!")));
            void ((await show_course_edit_dashboard(query, cid, "⬆️ **Moved Course Up**\n")));
      } else {
            void ((await query.answer("⚠️ This course is already first in this folder!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_course_mdown_"))) {
      cid = pyReplace(data, "adm_course_mdown_", "");
      success = db.move_course_order(cid, "down");
      if (pyT(success)) {
            void ((await query.answer("⬇️ Moved Down successfully!")));
            void ((await show_course_edit_dashboard(query, cid, "⬇️ **Moved Course Down**\n")));
      } else {
            void ((await query.answer("⚠️ This course is already last in this folder!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_course_mleft_"))) {
      cid = pyReplace(data, "adm_course_mleft_", "");
      success = db.move_course_left(cid);
      if (pyT(success)) {
            void ((await query.answer("✅ Course moved left (up one level)!", { show_alert: true })));
            void ((await show_course_edit_dashboard(query, cid)));
      } else {
            void ((await query.answer("⚠️ Already in a root category, cannot move left!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_course_mright_"))) {
      cid = pyReplace(data, "adm_course_mright_", "");
      course = db.get_course(cid);
      if (pyT((!pyT(course)))) {
            void ((await query.answer("Course not found!", { show_alert: true })));
            return;
      }
      c_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > ");
      subfolders = db.get_sub_folders(c_fld);
      if (pyT((!pyT(subfolders)))) {
            void ((await query.answer("⚠️ No subfolders in this directory to move into!", { show_alert: true })));
            return;
      }
      context.user_data["move_course_id"] = cid;
      context.user_data["move_course_subfolders"] = subfolders;
      keyboard = [];
      for (const [idx, sf] of pyIter(pyEnumerate(subfolders))) {
            pyAppend(keyboard, [InlineKeyboardButton(`📁 ${pyStr(sf)}`, { callback_data: `adm_course_doright_${pyStr(idx)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: `adm_edit_${pyStr(cid)}` })]);
      void ((await query.edit_message_text(`➡️ **Select a subfolder to move the course '${pyStr(pySub(course, "name"))}' into:**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_course_doright_"))) {
      idx = pyInt(pyReplace(data, "adm_course_doright_", ""));
      cid = pyGet(context.user_data, "move_course_id");
      subfolders = pyGet(context.user_data, "move_course_subfolders", []);
      if (pyT((((__v114) => (pyT(__v114) ? __v114 : (((idx >= pyLen(subfolders))))))((!pyT(cid)))))) {
            void ((await query.answer("Session expired or invalid choice!", { show_alert: true })));
            return;
      }
      target_folder = pySub(subfolders, idx);
      success = db.move_course_right(cid, target_folder);
      pyPop(context.user_data, "move_course_id", null);
      pyPop(context.user_data, "move_course_subfolders", null);
      if (pyT(success)) {
            void ((await query.answer(`✅ Course moved into '${pyStr(target_folder)}'!`, { show_alert: true })));
            void ((await show_course_edit_dashboard(query, cid)));
      } else {
            void ((await query.answer("❌ Move failed!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_course_cut_"))) {
      cid = pyReplace(data, "adm_course_cut_", "");
      course = db.get_course(cid);
      if (pyT((!pyT(course)))) {
            void ((await query.answer("Course not found!", { show_alert: true })));
            return;
      }
      context.user_data["cut_course_id"] = cid;
      void ((await query.answer(`✂️ '${pyStr(pySlice(pySub(course, "name"), null, 30, null))}' cut! এখন destination folder-এ গিয়ে Paste চাপুন.`, { show_alert: true })));
      void ((await show_course_edit_dashboard(query, cid, "✂️ **Course cut — এখন destination folder-এ গিয়ে Paste চাপুন।**\n")));
  } else if (pyT((pyEq(data, "adm_course_cancel_cut")))) {
      pyPop(context.user_data, "cut_course_id", null);
      void ((await query.answer("❌ Cut cancelled!", { show_alert: true })));
      void ((await render_admin_folder_directory(query, context, pyGet(context.user_data, "active_dir", ""))));
      return;
  } else if (pyT((pyEq(data, "adm_course_paste_go")))) {
      cid = pyStrip((((__v115) => (pyT(__v115) ? __v115 : ("")))(pyGet(context.user_data, "cut_course_id"))));
      dest = pyGet(context.user_data, "active_dir", "");
      course = (pyT(cid) ? (db.get_course(cid)) : (null));
      if (pyT((!pyT(course)))) {
            pyPop(context.user_data, "cut_course_id", null);
            void ((await query.answer("⚠️ আগে কোনো course Cut করুন!", { show_alert: true })));
            return;
      }
      if (pyT((!pyT(dest)))) {
            void ((await query.answer("⚠️ কোনো folder-এর ভেতরে ঢুকে Paste চাপুন!", { show_alert: true })));
            return;
      }
      c_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > ");
      if (pyT((pyEq(c_fld, dest)))) {
            void ((await query.answer("⚠️ Course already এই folder-এই আছে!", { show_alert: true })));
            return;
      }
      success = db.move_course_to_folder(cid, dest);
      if (pyT((!pyT(success)))) {
            void ((await query.answer("❌ Move failed! আবার চেষ্টা করুন।", { show_alert: true })));
            return;
      }
      pyPop(context.user_data, "cut_course_id", null);
      void ((await query.answer(`✅ Moved '${pyStr(pySlice(pySub(course, "name"), null, 30, null))}' to '${pyStr(dest)}'!`, { show_alert: true })));
      void ((await render_admin_folder_directory(query, context, dest)));
      return;
  } else if (pyT(pyStart(data, "adm_edit_"))) {
      cid = pyReplace(data, "adm_edit_", "");
      void ((await show_course_edit_dashboard(query, cid)));
  } else if (pyT(pyStart(data, "adm_edmenu_"))) {
      cid = pyReplace(data, "adm_edmenu_", "");
      course = db.get_course(cid);
      if (pyT((!pyT(course)))) {
            void ((await query.answer("Course not found!")));
            return;
      }
      text = `✏️ **Edit Course: '${pyStr(pySub(course, "name"))}'**
━━━━━━━━━━━━━━━━━━━━
Select property to edit:`;
      keyboard = [[InlineKeyboardButton("✏️ Edit Title", { callback_data: `edprop_${pyStr(cid)}_name` }), InlineKeyboardButton("💰 Edit Price", { callback_data: `edprop_${pyStr(cid)}_price` })], [InlineKeyboardButton("📂 Edit Category", { callback_data: `edprop_${pyStr(cid)}_category` }), InlineKeyboardButton("🎯 Edit Sub-Category", { callback_data: `edprop_${pyStr(cid)}_subcategory` })], [InlineKeyboardButton("🖼️ Edit Banner", { callback_data: `edprop_${pyStr(cid)}_image` }), InlineKeyboardButton("🔗 Edit Link", { callback_data: `edprop_${pyStr(cid)}_access_link` })], [InlineKeyboardButton("👥 Manage Group IDs", { callback_data: `edprop_${pyStr(cid)}_groups` })], [InlineKeyboardButton("👨‍🏫 Edit Teacher", { callback_data: `edprop_${pyStr(cid)}_instructor` }), InlineKeyboardButton("📝 Edit Details", { callback_data: `edprop_${pyStr(cid)}_description` })], [InlineKeyboardButton("✂️ Move Course (Cut-Paste)", { callback_data: `adm_course_cut_${pyStr(cid)}` })], [InlineKeyboardButton("⬅️Back", { callback_data: `adm_edit_${pyStr(cid)}` })]];
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await query.edit_message_text(text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else if (pyT(pyStart(data, "edprop_"))) {
      parts = pySplit(data, "_", 2);
      cid = pySub(parts, 1);
      prop = pySub(parts, 2);
      if (pyT((pyEq(prop, "groups")))) {
            void ((await render_course_groups_panel(query, context, cid)));
            return;
      }
      context.user_data["admin_edit_cid"] = cid;
      context.user_data["admin_edit_field"] = prop;
      prop_prompts = { name: "📝 **Send new Course Title:**", price: "💰 **Send new Course Price (e.g. 250 or 0):**", category: "📂 **Send new Category (e.g. SSC / HSC 28 / HSC 27):**", subcategory: "🎯 **Send new Sub-Category (e.g. Physics / Academic):**", image: "🖼️ **Send new Banner Photo or Image Web URL:**\n(Send `remove` to remove banner)", access_link: "🔗 **Send new Telegram Channel / Drive Access Link:**", group_id: "👥 **Send new Telegram Group / Channel ID:**", instructor: "👨‍🏫 **Send Teacher / Instructor Name:**", description: "📝 **Send new Course Description & Features:**" };
      prompt = pyGet(prop_prompts, prop, "Send new value:");
      prompt += "\n\n(Type /cancel to abort)";
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(prompt, { parse_mode: "Markdown" })));
      } else {
            void ((await query.edit_message_text(prompt, { parse_mode: "Markdown" })));
      }
  } else if (pyT(pyStart(data, "adm_addgroup_"))) {
      cid = pyReplace(data, "adm_addgroup_", "");
      course = db.get_course(cid);
      if (pyT((!pyT(course)))) {
            void ((await query.answer("❌ Course not found!", { show_alert: true })));
            return;
      }
      context.user_data["admin_edit_cid"] = cid;
      context.user_data["admin_edit_field"] = "group_add";
      void ((await query.edit_message_text("👥 **Send Group / Channel ID to add:**\n(ex: `-1001234567890` or `Cycle 2 = -1001234567890`)\n\n(Type /cancel to abort)", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: `edprop_${pyStr(cid)}_groups` })]]) })));
      return;
  } else if (pyT(pyStart(data, "adm_delgroup_"))) {
      rest = pyReplace(data, "adm_delgroup_", "");
      [cid, _, idx_s] = pyRPartition(rest, "_");
      try {
            idx = pyInt(idx_s);
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      course = db.get_course(cid);
      if (pyT((!pyT(course)))) {
            void ((await query.answer("❌ Course not found!", { show_alert: true })));
            return;
      }
      groups = db.get_course_group_list(course);
      if (pyT(((0 <= idx) && (idx < pyLen(groups))))) {
            removed = pyPop(groups, idx);
            raw = (pyT(pyIsInstance(pyGet(course, "group_ids"), "list")) ? (pyGet(course, "group_ids")) : ([]));
            new_raw = [];
            for (const g of pyIter(raw)) {
                    gid = pyStrip(pyStr((pyT(pyIsInstance(g, "dict")) ? (pyGet(g, "id")) : (g))));
                    if (pyT((((__v116) => (pyT(__v116) ? (((!pyEq(gid, pySub(removed, "id"))))) : __v116))(gid)))) {
                              pyAppend(new_raw, g);
                    }
            }
            legacy = pyStrip(pyStr((((__v117) => (pyT(__v117) ? __v117 : ("")))(pyGet(course, "group_id", "")))));
            if (pyT((pyEq(legacy, pySub(removed, "id"))))) {
                    legacy = (pyT(groups) ? (pySub(pySub(groups, 0), "id")) : (""));
            }
            db.update_course(cid, { group_ids: new_raw, group_id: legacy });
            void ((await query.answer(`✕ Removed '${pyStr(pySub(removed, "label"))}'!`)));
      }
      void ((await render_course_groups_panel(query, context, cid)));
      return;
  } else if (pyT((pyEq(data, "adm_ebooks")))) {
      void ((await render_admin_ebook_folder_directory(query, context, "")));
  } else if (pyT(pyStart(data, "adm_ebdir_"))) {
      path = pyReplace(data, "adm_ebdir_", "");
      void ((await render_admin_ebook_folder_directory(query, context, path)));
  } else if (pyT((pyEq(data, "adm_ebfld_addfolder")))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      context.user_data["admin_add_eb_subcat"] = true;
      context.user_data["admin_eb_subcat_target_parent"] = active_dir;
      parent_display = (pyT(active_dir) ? (active_dir) : ("Root (মূল ক্যাটাগরি)"));
      msg = `📁 **ই-বুক ফোল্ডার অবস্থান:** \`${pyStr(parent_display)}\`
━━━━━━━━━━━━━━━━━━━━
➕ **নতুন ক্যাটাগরি বা ফোল্ডারের নাম লিখে পাঠান:**
(যেমন: HSC 26, Medical, Physics, Formula Sheet ইত্যাদি)

(বাতিল করতে /cancel লিখুন)`;
      k_c = [[InlineKeyboardButton("« Cancel", { callback_data: `adm_ebdir_${pyStr(active_dir)}` })]];
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_c) })));
      } else {
            void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_c) })));
      }
  } else if (pyT((((__v119) => (pyT(__v119) ? __v119 : (((__v118) => (pyT(__v118) ? __v118 : ((pyEq(data, "adm_add_ebook")))))(pyStart(data, "adm_addebook_dir_")))))((pyEq(data, "adm_ebfld_addebook")))))) {
      if (pyT(pyStart(data, "adm_addebook_dir_"))) {
            active_dir = pyReplace(data, "adm_addebook_dir_", "");
      } else {
            active_dir = pyGet(context.user_data, "active_eb_dir", "");
      }
      if (pyT((((__v120) => (pyT(__v120) ? ((!pyT(pyStart(data, "adm_addebook_dir_")))) : __v120))((!pyT(active_dir)))))) {
            cats = db.get_ebook_categories();
            if (pyT((!pyT(cats)))) {
                    void ((await query.answer("⚠️ প্রথমে একটি ক্যাটাগরি তৈরি করুন!", { show_alert: true })));
                    return;
            }
            keyboard = [];
            per_row = db.get_category_row_size();
            row = [];
            for (const c of pyIter(cats)) {
                    pyAppend(row, InlineKeyboardButton(`📁 ${pyStr(c)}`, { callback_data: `adm_setebcat_${pyStr(c)}` }));
                    if (pyT((pyEq(pyLen(row), per_row)))) {
                              pyAppend(keyboard, row);
                              row = [];
                    }
            }
            if (pyT(row)) {
                    pyAppend(keyboard, row);
            }
            pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_ebooks" })]);
            msg = "📂 **ই-বুক যোগ করতে প্রথমে ক্যাটাগরি নির্বাচন করুন:**\n━━━━━━━━━━━━━━━━━━━━\nযে ক্যাটাগরি বা ফোল্ডারের অধীনে নতুন ই-বুকটি যুক্ত করতে চান সেটি নির্বাচন করুন:";
            if (pyT(_msg_has_media(query.message))) {
                    try {
                              void ((await query.message.delete()));
                    } catch (__e) {
                    }
                    void ((await query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
            } else {
                    void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
            }
            return;
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      cat = (pyT(segments) ? (pySub(segments, 0)) : ("General"));
      sub = (pyT(((pyLen(segments) > 1))) ? (pySub(segments, (-(1)))) : ("General"));
      context.user_data["active_eb_dir"] = active_dir;
      context.user_data["admin_add_ebook"] = true;
      context.user_data["ebook_step"] = "name";
      context.user_data["new_ebook"] = { category: cat, subcategory: sub, folder_path: active_dir };
      path_disp = (pyT(active_dir) ? (active_dir) : ("General"));
      msg = `📁 **ই-বুক ডিরেক্টরি: \`${pyStr(path_disp)}\`**
━━━━━━━━━━━━━━━━━━━━

✨ **ধাপ ১/৪: ই-বুকের নাম (E-Book Title) লিখে পাঠান:**
(যেমন: 📘 HSC Physics Formula Sheet | ${pyStr(cat)})

💡 ক্যাটাগরি ও ফোল্ডার স্বয়ংক্রিয়ভাবে \`${pyStr(path_disp)}\` ডিরেক্টরিতে সেট করা থাকবে।`;
      k_cancel = [[InlineKeyboardButton("✕ Cancel", { callback_data: `adm_ebdir_${pyStr(active_dir)}` })]];
      void ((await send_wizard_step1(query, context, msg, k_cancel)));
  } else if (pyT(pyStart(data, "adm_ebfld_togglestatus_"))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("Cannot toggle root directory status!", { show_alert: true })));
            return;
      }
      new_st = db.toggle_ebook_category_status(active_dir);
      st_word = (pyT(new_st) ? ("🟢 Active (ON)") : ("🔴 Inactive (OFF - Hidden)"));
      void ((await query.answer(`E-Book Category status changed to ${pyStr(st_word)}!`, { show_alert: true })));
      void ((await render_admin_ebook_folder_directory(query, context, active_dir)));
      return;
  } else if (pyT((pyEq(data, "adm_ebfld_delfolder")))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("Cannot delete root directory!", { show_alert: true })));
            return;
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      n_sub = pyLen(db.get_ebook_sub_folders(active_dir, { include_inactive: true }));
      try {
            n_eb = pyLen(db.get_ebooks_by_folder(active_dir, { include_inactive: true }));
      } catch (__e) {
            n_eb = 0;
      }
      confirm_text = `🗑️ <b>Delete e-book folder?</b>

📁 <b>${pyStr(pyHtmlEscape(active_dir))}</b> will be permanently removed.
📂 Sub-folders: <b>${pyStr(n_sub)}</b> | 📕 E-Books: <b>${pyStr(n_eb)}</b>
This cannot be undone.`;
      confirm_kb = InlineKeyboardMarkup([[InlineKeyboardButton("✅ Yes, Delete", { callback_data: "adm_ebfld_delfolder_yes" })], [InlineKeyboardButton("« Cancel", { callback_data: `adm_ebdir_${pyStr(active_dir)}` })]]);
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(confirm_text, { parse_mode: "HTML", reply_markup: confirm_kb })));
      } else {
            void ((await query.edit_message_text(confirm_text, { parse_mode: "HTML", reply_markup: confirm_kb })));
      }
  } else if (pyT((pyEq(data, "adm_ebfld_delfolder_yes")))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("Cannot delete root directory!", { show_alert: true })));
            return;
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      folder_to_delete = pySub(segments, (-(1)));
      parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
      db.delete_ebook_sub_folder(parent_path, folder_to_delete);
      void ((await query.answer(`✅ '${pyStr(folder_to_delete)}' deleted!`, { show_alert: true })));
      void ((await render_admin_ebook_folder_directory(query, context, parent_path)));
  } else if (pyT(pyStart(data, "adm_ebfld_reorder_"))) {
      p_path = pyReplace(data, "adm_ebfld_reorder_", "");
      if (pyT((pyEq(p_path, "CUR")))) {
            p_path = pyGet(context.user_data, "active_eb_dir", "");
      }
      context.user_data["reorder_eb_parent_path"] = p_path;
      pyPop(context.user_data, "pos_eb_sel", null);
      pyPop(context.user_data, "pos_eb_pick", null);
      pyPop(context.user_data, "pos_eb_cpick", null);
      void ((await render_ebook_category_reorder_panel(query, context, p_path)));
      return;
  } else if (pyT(pyStart(data, "adm_ebfld_layout_"))) {
      try {
            n = pyMax(1, pyMin(4, pyInt(pyReplace(data, "adm_ebfld_layout_", ""))));
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      if (pyT((!pyT(active_dir)))) {
            db.set_category_row_size(n);
            void ((await query.answer(`📁 Category: 1 line-e ${pyStr(n)} ta!`, { show_alert: true })));
      } else {
            db.set_subcategory_row_size(n);
            void ((await query.answer(`📂 Sub-Category: 1 line-e ${pyStr(n)} ta!`, { show_alert: true })));
      }
      void ((await render_admin_ebook_folder_directory(query, context, active_dir)));
      return;
  } else if (pyT(pyStart(data, "adm_ebfld_reord_"))) {
      parts = pySplit(pyReplace(data, "adm_ebfld_reord_", ""), "_", -1);
      action = pySub(parts, 0);
      idx = pyInt(pySub(parts, 1));
      p_path = pyGet(context.user_data, "reorder_eb_parent_path", "");
      ok = false;
      item_name = "";
      if (pyT((pyContains(["fup", "fdn"], action)))) {
            folders = db.get_ebook_sub_folders(p_path, { include_inactive: true });
            if (pyT(((0 <= idx) && (idx < pyLen(folders))))) {
                    item_name = pySub(folders, idx);
                    ok = db.move_ebook_folder_order(p_path, item_name, (pyT((pyEq(action, "fup"))) ? ("up") : ("down")));
            }
      } else if (pyT((pyContains(["cup", "cdn"], action)))) {
            ebooks = (pyT(p_path) ? (db.get_ebooks_by_folder(p_path, { include_inactive: true })) : ([]));
            if (pyT(((0 <= idx) && (idx < pyLen(ebooks))))) {
                    item_name = pyGet(pySub(ebooks, idx), "name", "");
                    ok = db.move_ebook_order(pySub(pySub(ebooks, idx), "id"), (pyT((pyEq(action, "cup"))) ? ("up") : ("down")));
            }
      }
      if (pyT(ok)) {
            void ((await query.answer(`✅ Position changed: ${pyStr(item_name)}`)));
      } else {
            void ((await query.answer("⚠️ আর এদিকে যাওয়া যাবে না (already at edge)!", { show_alert: true })));
      }
      void ((await render_ebook_category_reorder_panel(query, context, p_path)));
      return;
  } else if (pyT(pyStart(data, "adm_ebfld_psel_"))) {
      rest = pyReplace(data, "adm_ebfld_psel_", "");
      [kind, idx_s] = [pySub(rest, 0), pySlice(rest, 1, null, null)];
      try {
            idx = pyInt(idx_s);
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      p_path = pyGet(context.user_data, "reorder_eb_parent_path", "");
      if (pyT((pyEq(kind, "f")))) {
            folders = db.get_ebook_sub_folders(p_path, { include_inactive: true });
            if (pyT((!pyT(((0 <= idx) && (idx < pyLen(folders))))))) {
                    void ((await query.answer("❌ Not found!", { show_alert: true })));
                    return;
            }
            cur = (((__v121) => (pyT(__v121) ? __v121 : ({  })))(pyGet(context.user_data, "pos_eb_sel")));
            if (pyT((((__v122) => (pyT(__v122) ? ((pyEq(pyGet(cur, "name"), pySub(folders, idx)))) : __v122))((pyEq(pyGet(cur, "kind"), "f")))))) {
                    pyPop(context.user_data, "pos_eb_sel", null);
                    void ((await query.answer("Selection cleared!")));
            } else {
                    context.user_data["pos_eb_sel"] = { kind: "f", name: pySub(folders, idx) };
                    void ((await query.answer(`✅ Selected: ${pyStr(pySub(folders, idx))}`)));
            }
      } else {
            ebooks = (pyT(p_path) ? (db.get_ebooks_by_folder(p_path, { include_inactive: true })) : ([]));
            if (pyT((!pyT(((0 <= idx) && (idx < pyLen(ebooks))))))) {
                    void ((await query.answer("❌ Not found!", { show_alert: true })));
                    return;
            }
            cur = (((__v123) => (pyT(__v123) ? __v123 : ({  })))(pyGet(context.user_data, "pos_eb_sel")));
            if (pyT((((__v124) => (pyT(__v124) ? ((pyEq(pyGet(cur, "id"), pyGet(pySub(ebooks, idx), "id")))) : __v124))((pyEq(pyGet(cur, "kind"), "e")))))) {
                    pyPop(context.user_data, "pos_eb_sel", null);
                    void ((await query.answer("Selection cleared!")));
            } else {
                    context.user_data["pos_eb_sel"] = { kind: "e", id: pyGet(pySub(ebooks, idx), "id"), name: pyGet(pySub(ebooks, idx), "name", "") };
                    void ((await query.answer(`✅ Selected: ${pyStr(pySlice(pyGet(pySub(ebooks, idx), "name", ""), null, 20, null))}`)));
            }
      }
      void ((await render_ebook_category_reorder_panel(query, context, p_path)));
      return;
  } else if (pyT(pyStart(data, "adm_ebfld_pos_pick_"))) {
      rest = pyReplace(data, "adm_ebfld_pos_pick_", "");
      if (pyT((pyEq(rest, "cancel")))) {
            p_path = pyGet(context.user_data, "reorder_eb_parent_path", "");
            pyPop(context.user_data, "pos_eb_pick", null);
            void ((await render_ebook_category_reorder_panel(query, context, p_path)));
            return;
      }
      try {
            idx = pyInt(rest);
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      pick = (((__v125) => (pyT(__v125) ? __v125 : ({  })))(pyGet(context.user_data, "pos_eb_pick")));
      sibs = pyGet(pick, "siblings", []);
      name = pyGet(pick, "name", "");
      p_path = pyGet(pick, "parent", pyGet(context.user_data, "reorder_eb_parent_path", ""));
      if (pyT((((__v126) => (pyT(__v126) ? __v126 : ((!pyT(((0 <= idx) && (idx < pyLen(sibs))))))))((!pyT(name)))))) {
            void ((await query.answer("Session expired!", { show_alert: true })));
            return;
      }
      sib = pySub(sibs, idx);
      ok = db.move_ebook_folder_right(p_path, name, sib);
      pyPop(context.user_data, "pos_eb_pick", null);
      if (pyT(ok)) {
            new_parent = (pyT(p_path) ? (`${pyStr(p_path)} > ${pyStr(sib)}`) : (sib));
            context.user_data["reorder_eb_parent_path"] = new_parent;
            void ((await query.answer(`✅ '${pyStr(name)}' → '${pyStr(sib)}'!`, { show_alert: true })));
            void ((await render_ebook_category_reorder_panel(query, context, new_parent)));
      } else {
            void ((await query.answer("❌ Move failed!", { show_alert: true })));
            void ((await render_ebook_category_reorder_panel(query, context, p_path)));
      }
      return;
  } else if (pyT(pyStart(data, "adm_ebfld_pos_cpick_"))) {
      rest = pyReplace(data, "adm_ebfld_pos_cpick_", "");
      if (pyT((pyEq(rest, "cancel")))) {
            p_path = pyGet(context.user_data, "reorder_eb_parent_path", "");
            pyPop(context.user_data, "pos_eb_cpick", null);
            void ((await render_ebook_category_reorder_panel(query, context, p_path)));
            return;
      }
      try {
            idx = pyInt(rest);
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      pick = (((__v127) => (pyT(__v127) ? __v127 : ({  })))(pyGet(context.user_data, "pos_eb_cpick")));
      subs = pyGet(pick, "subs", []);
      eid = pyGet(pick, "eid");
      p_path = pyGet(pick, "parent", pyGet(context.user_data, "reorder_eb_parent_path", ""));
      if (pyT((((__v128) => (pyT(__v128) ? __v128 : ((!pyT(((0 <= idx) && (idx < pyLen(subs))))))))((!pyT(eid)))))) {
            void ((await query.answer("Session expired!", { show_alert: true })));
            return;
      }
      ok = db.move_ebook_right(eid, pySub(subs, idx));
      pyPop(context.user_data, "pos_eb_cpick", null);
      pyPop(context.user_data, "pos_eb_sel", null);
      if (pyT(ok)) {
            void ((await query.answer(`✅ E-Book → '${pyStr(pySub(subs, idx))}'!`, { show_alert: true })));
      } else {
            void ((await query.answer("❌ Move failed!", { show_alert: true })));
      }
      void ((await render_ebook_category_reorder_panel(query, context, p_path)));
      return;
  } else if (pyT((((__v129) => (pyT(__v129) ? ((pyContains(["up", "down", "left", "right"], pyReplace(data, "adm_ebfld_pos_", "")))) : __v129))(pyStart(data, "adm_ebfld_pos_"))))) {
      action = pyReplace(data, "adm_ebfld_pos_", "");
      p_path = pyGet(context.user_data, "reorder_eb_parent_path", "");
      sel = (((__v130) => (pyT(__v130) ? __v130 : ({  })))(pyGet(context.user_data, "pos_eb_sel")));
      if (pyT((!pyT(sel)))) {
            void ((await query.answer("⚠️ আগে কোনো category select করুন!", { show_alert: true })));
            return;
      }
      per_row = (pyT((!pyT(p_path))) ? (db.get_category_row_size()) : (db.get_subcategory_row_size()));
      delta = pySub({ left: (-(1)), right: 1, up: (-(per_row)), down: per_row }, action);
      if (pyT((pyEq(pyGet(sel, "kind"), "f")))) {
            name = pyGet(sel, "name", "");
            folders = db.get_ebook_sub_folders(p_path, { include_inactive: true });
            if (pyT(((!pyContains(folders, name))))) {
                    pyPop(context.user_data, "pos_eb_sel", null);
                    void ((await query.answer("❌ Not found!", { show_alert: true })));
                    void ((await render_ebook_category_reorder_panel(query, context, p_path)));
                    return;
            }
            ok = db.move_ebook_folder_to(p_path, name, (pyIndex(folders, name) + delta));
      } else {
            eid = pyGet(sel, "id");
            ebooks = (pyT(p_path) ? (db.get_ebooks_by_folder(p_path, { include_inactive: true })) : ([]));
            idx = pyNext(((() => { const __acc = []; for (const [i, e] of pyIter(pyEnumerate(ebooks))) { if (!pyT((pyEq(pyGet(e, "id"), eid)))) continue; __acc.push(i); } return __acc; })()), (-(1)));
            if (pyT(((idx < 0)))) {
                    pyPop(context.user_data, "pos_eb_sel", null);
                    void ((await query.answer("❌ E-Book not found!", { show_alert: true })));
                    void ((await render_ebook_category_reorder_panel(query, context, p_path)));
                    return;
            }
            ok = db.move_ebook_to(eid, (idx + delta));
      }
      if (pyT(ok)) {
            void ((await query.answer("✅")));
      } else {
            void ((await query.answer("⚠️ আর এদিকে যাওয়া যাবে না!", { show_alert: true })));
      }
      void ((await render_ebook_category_reorder_panel(query, context, p_path)));
      return;
  } else if (pyT((((__v131) => (pyT(__v131) ? __v131 : (pyStart(data, "adm_ebfld_movedown_"))))(pyStart(data, "adm_ebfld_moveup_"))))) {
      direction = (pyT((pyContains(data, "moveup"))) ? ("up") : ("down"));
      folder_name = pyReplace(pyReplace(data, "adm_ebfld_moveup_", ""), "adm_ebfld_movedown_", "");
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
      success = db.move_ebook_folder_order(parent_path, folder_name, direction);
      if (pyT(success)) {
            void ((await query.answer(`✅ Moved ${pyStr(direction)}!`, { show_alert: true })));
      } else {
            void ((await query.answer(`Cannot move ${pyStr(direction)}!`, { show_alert: true })));
      }
      void ((await render_admin_ebook_folder_directory(query, context, active_dir)));
  } else if (pyT((pyEq(data, "adm_ebfld_cancel_copy")))) {
      pyPop(context.user_data, "copy_eb_folder_src", null);
      void ((await query.answer("❌ Cut cancelled!", { show_alert: true })));
      void ((await render_admin_ebook_folder_directory(query, context, pyGet(context.user_data, "active_eb_dir", ""))));
      return;
  } else if (pyT((pyEq(data, "adm_ebfld_copy_go")))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("⚠️ Cut করতে কোনো folder-এর ভেতরে ঢুকুন!", { show_alert: true })));
            return;
      }
      if (pyT((pyEq(pyGet(context.user_data, "copy_eb_folder_src"), active_dir)))) {
            void ((await query.answer(`✂️ Already cut! Destination-এ গিয়ে Paste চাপুন.`, { show_alert: true })));
            return;
      }
      context.user_data["copy_eb_folder_src"] = active_dir;
      void ((await query.answer(`✂️ Cut! এখন destination-এ গিয়ে Paste চাপুন.`, { show_alert: true })));
      void ((await render_admin_ebook_folder_directory(query, context, active_dir)));
      return;
  } else if (pyT((pyEq(data, "adm_ebfld_paste_go")))) {
      src = pyStrip((((__v132) => (pyT(__v132) ? __v132 : ("")))(pyGet(context.user_data, "copy_eb_folder_src"))));
      dest = pyGet(context.user_data, "active_eb_dir", "");
      if (pyT((!pyT(src)))) {
            void ((await query.answer("⚠️ আগে কোনো folder Cut করুন!", { show_alert: true })));
            return;
      }
      if (pyT((((__v134) => (pyT(__v134) ? __v134 : ((((__v133) => (pyT(__v133) ? (pyStart(dest, (src + " > "))) : __v133))(dest)))))((pyEq(dest, src)))))) {
            void ((await query.answer("⚠️ নিজের ভেতরে Paste করা যাবে না!", { show_alert: true })));
            return;
      }
      src_base = pyStrip(pySub(pySplit(src, " > ", -1), (-(1))));
      new_path = (pyT(dest) ? (`${pyStr(dest)} > ${pyStr(src_base)}`) : (src_base));
      if (pyT((pyEq(new_path, src)))) {
            void ((await query.answer("⚠️ এটা already এখানেই আছে!", { show_alert: true })));
            return;
      }
      if (pyT((pyContains(db.get_ebook_sub_folders(dest, { include_inactive: true }), src_base)))) {
            void ((await query.answer("⚠️ ওই নামে folder destination-এ already আছে!", { show_alert: true })));
            return;
      }
      ok = db.move_ebook_folder_path(src, new_path);
      if (pyT((!pyT(ok)))) {
            void ((await query.answer("❌ Move failed! আবার চেষ্টা করুন।", { show_alert: true })));
            return;
      }
      pyPop(context.user_data, "copy_eb_folder_src", null);
      void ((await query.answer(`✅ Moved as '${pyStr(new_path)}'!`, { show_alert: true })));
      void ((await render_admin_ebook_folder_directory(query, context, dest)));
      return;
  } else if (pyT((pyEq(data, "adm_ebfld_header")))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("⚠️ কোনো folder-এর ভেতরে ঢুকে Header সেট করুন!", { show_alert: true })));
            return;
      }
      void ((await render_ebook_folder_header_panel(query, context, active_dir)));
      return;
  } else if (pyT((pyEq(data, "adm_ebfld_header_text")))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("⚠️ Session expired!", { show_alert: true })));
            return;
      }
      context.user_data["admin_eb_folder_header_text_wait"] = active_dir;
      void ((await query.edit_message_text(`✏️ <b>Send new title text for</b> <code>${pyStr(pyHtmlEscape(active_dir))}</code>:

❌ বাতিল করতে /cancel লিখুন।`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebfld_header" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_ebfld_header_media")))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      if (pyT((!pyT(active_dir)))) {
            void ((await query.answer("⚠️ Session expired!", { show_alert: true })));
            return;
      }
      context.user_data["admin_eb_folder_header_media_wait"] = active_dir;
      void ((await query.edit_message_text("🖼️ <b>এখন একটা Photo বা GIF পাঠান:</b>\n\n❌ বাতিল করতে /cancel লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebfld_header" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_ebfld_header_rmmedia")))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      hdr = db.get_ebook_folder_header(active_dir);
      db.set_ebook_folder_header_media(active_dir, "none", "");
      if (pyT((!pyT(pyStrip((((__v135) => (pyT(__v135) ? __v135 : ("")))(pyGet(hdr, "text")))))))) {
            db.reset_ebook_folder_header(active_dir);
      }
      void ((await query.answer("🗑️ Header photo removed!", { show_alert: true })));
      void ((await render_ebook_folder_header_panel(query, context, active_dir)));
      return;
  } else if (pyT((pyEq(data, "adm_ebfld_header_reset")))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      db.reset_ebook_folder_header(active_dir);
      void ((await query.answer("↩️ Header reset to default!", { show_alert: true })));
      void ((await render_ebook_folder_header_panel(query, context, active_dir)));
      return;
  } else if (pyT((pyEq(data, "adm_eblib_header")))) {
      void ((await render_eblib_header_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_eblib_header_text")))) {
      context.user_data["admin_eblib_header_text_wait"] = true;
      void ((await query.edit_message_text("✏️ <b>Send new title text for the E-Book Library screen:</b>\n\n❌ বাতিল করতে /cancel লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_eblib_header" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_eblib_header_media")))) {
      context.user_data["admin_eblib_header_media_wait"] = true;
      void ((await query.edit_message_text("🖼️ <b>এখন একটা Photo বা GIF পাঠান</b> (Library screen-এ title-এর সাথে দেখাবে):\n\n❌ বাতিল করতে /cancel লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_eblib_header" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_eblib_header_rmmedia")))) {
      db.set_setting("ebook_library_media_type", "none");
      db.set_setting("ebook_library_media_file_id", "");
      void ((await query.answer("🗑️ Library photo removed!", { show_alert: true })));
      void ((await render_eblib_header_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_eblib_header_reset")))) {
      db.set_setting("ebook_library_header_text", "");
      void ((await query.answer("↩️ Library title reset to default!", { show_alert: true })));
      void ((await render_eblib_header_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_catlib_header")))) {
      void ((await render_catlib_header_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_catlib_header_text")))) {
      context.user_data["admin_catlib_header_text_wait"] = true;
      void ((await query.edit_message_text("✏️ <b>Send new title text for the Category screen:</b>\n\n❌ বাতিল করতে /cancel লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_catlib_header" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_catlib_header_media")))) {
      context.user_data["admin_catlib_header_media_wait"] = true;
      void ((await query.edit_message_text("🖼️ <b>এখন একটা Photo বা GIF পাঠান</b> (Category screen-এ title-এর সাথে দেখাবে):\n\n❌ বাতিল করতে /cancel লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_catlib_header" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_catlib_header_rmmedia")))) {
      db.set_setting("category_library_media_type", "none");
      db.set_setting("category_library_media_file_id", "");
      void ((await query.answer("🗑️ Category photo removed!", { show_alert: true })));
      void ((await render_catlib_header_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_catlib_header_reset")))) {
      db.set_setting("category_library_header_text", "");
      void ((await query.answer("↩️ Category title reset to default!", { show_alert: true })));
      void ((await render_catlib_header_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_cart_settings")))) {
      void ((await render_cart_settings_panel(query)));
      return;
  } else if (pyT((pyEq(data, "adm_cart_media_upload")))) {
      context.user_data["admin_cart_media_wait"] = true;
      void ((await query.edit_message_text("🖼️ <b>এখন একটা Photo বা GIF পাঠান</b> (Cart screen-এ heading image হিসেবে দেখাবে):\n\n❌ বাতিল করতে /cancel লিখুন।", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_cart_settings" })]]) })));
      return;
  } else if (pyT((pyEq(data, "adm_cart_media_remove")))) {
      db.set_setting("cart_media_type", "none");
      db.set_setting("cart_media_file_id", "");
      void ((await query.answer("🗑️ Cart image removed!", { show_alert: true })));
      void ((await render_cart_settings_panel(query)));
      return;
  } else if (pyT((((__v136) => (pyT(__v136) ? __v136 : ((pyEq(data, "adm_cartpreset_empty_2")))))((pyEq(data, "adm_cartpreset_empty_1")))))) {
      preset = (pyT(pyEnd(data, "_1")) ? (CART_EMPTY_PRESET_1) : (CART_EMPTY_PRESET_2));
      db.set_setting("cart_empty_message", preset);
      void ((await query.answer("✅ Template applied!", { show_alert: true })));
          class _FQ {
                constructor(message, user) {
                        this.message = message;
                        this.data = "adm_editmsg_cart_empty_message";
                        this.from_user = user;
                        this.id = "0";
                }
                async answer(text, show_alert) {
                }
                async edit_message_text(text, ...__args) {
                        return ((await this.message.reply_text(text, ...__args)));
                }
          }
          class _FU {
                constructor(message, callback_query) {
                        this.message = message;
                        this.callback_query = callback_query;
                        this.effective_user = callback_query.from_user;
                        this.effective_chat = message.chat;
                }
          }
      void ((await handle_admin_callback(_FU(query.message, _FQ(query.message, query.from_user)), context)));
      return;
  } else if (pyT(pyStart(data, "adm_ebfld_mleft_"))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      if (pyT(((pyLen(segments) <= 1)))) {
            void ((await query.answer("⚠️ Already a root category, cannot move left!", { show_alert: true })));
            return;
      }
      current_name = pySub(segments, (-(1)));
      parent_path = pyJoin(" > ", pySlice(segments, null, (-(1)), null));
      success = db.move_ebook_folder_left(parent_path, current_name);
      if (pyT(success)) {
            parent_segments = pySplit(parent_path, " > ", -1);
            parent_parent = (pyT(((pyLen(parent_segments) > 1))) ? (pyJoin(" > ", pySlice(parent_segments, null, (-(1)), null))) : (""));
            new_active_dir = (pyT(parent_parent) ? (`${pyStr(parent_parent)} > ${pyStr(current_name)}`) : (current_name));
            void ((await query.answer("✅ Moved left successfully!", { show_alert: true })));
            void ((await render_admin_ebook_folder_directory(query, context, new_active_dir)));
      } else {
            void ((await query.answer("❌ Move left failed!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_ebfld_mright_"))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      if (pyT((!pyT(segments)))) {
            void ((await query.answer("Cannot move!", { show_alert: true })));
            return;
      }
      current_name = pySub(segments, (-(1)));
      parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
      siblings = ((() => { const __acc = []; for (const s of pyIter(db.get_ebook_sub_folders(parent_path))) { if (!pyT(((!pyEq(s, current_name))))) continue; __acc.push(s); } return __acc; })());
      if (pyT((!pyT(siblings)))) {
            void ((await query.answer("⚠️ No sibling folders to move into!", { show_alert: true })));
            return;
      }
      context.user_data["move_eb_folder_name"] = current_name;
      context.user_data["move_eb_folder_parent"] = parent_path;
      context.user_data["move_eb_folder_siblings"] = siblings;
      keyboard = [];
      for (const [idx, s] of pyIter(pyEnumerate(siblings))) {
            pyAppend(keyboard, [InlineKeyboardButton(`📁 ${pyStr(s)}`, { callback_data: `adm_ebfld_doright_${pyStr(idx)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: `adm_ebdir_${pyStr(active_dir)}` })]);
      void ((await query.edit_message_text(`➡️ **Select a sibling folder to move '${pyStr(current_name)}' into:**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_ebfld_doright_"))) {
      idx = pyInt(pyReplace(data, "adm_ebfld_doright_", ""));
      current_name = pyGet(context.user_data, "move_eb_folder_name");
      parent_path = pyGet(context.user_data, "move_eb_folder_parent");
      siblings = pyGet(context.user_data, "move_eb_folder_siblings", []);
      if (pyT((((__v137) => (pyT(__v137) ? __v137 : (((idx >= pyLen(siblings))))))((!pyT(current_name)))))) {
            void ((await query.answer("Session expired or invalid choice!", { show_alert: true })));
            return;
      }
      sibling_name = pySub(siblings, idx);
      success = db.move_ebook_folder_right(parent_path, current_name, sibling_name);
      pyPop(context.user_data, "move_eb_folder_name", null);
      pyPop(context.user_data, "move_eb_folder_parent", null);
      pyPop(context.user_data, "move_eb_folder_siblings", null);
      if (pyT(success)) {
            void ((await query.answer(`✅ Moved '${pyStr(current_name)}' into '${pyStr(sibling_name)}'!`, { show_alert: true })));
            void ((await render_admin_ebook_folder_directory(query, context, parent_path)));
      } else {
            void ((await query.answer("❌ Move failed!", { show_alert: true })));
      }
  } else if (pyT((((__v138) => (pyT(__v138) ? __v138 : (pyStart(data, "adm_ebfld_movedown"))))(pyStart(data, "adm_ebfld_moveup"))))) {
      direction = (pyT((pyContains(data, "moveup"))) ? ("up") : ("down"));
      subfolders = db.get_ebook_sub_folders("");
      if (pyT((!pyT(subfolders)))) {
            void ((await query.answer("No categories to move!", { show_alert: true })));
            return;
      }
      parent_path = "";
      folder_name = (pyT(subfolders) ? (pySub(subfolders, 0)) : (""));
      if (pyT((!pyT(folder_name)))) {
            void ((await query.answer("No category selected!", { show_alert: true })));
            return;
      }
      success = db.move_ebook_folder_order(parent_path, folder_name, direction);
      if (pyT(success)) {
            void ((await query.answer(`✅ Moved ${pyStr(direction)}!`, { show_alert: true })));
      } else {
            void ((await query.answer(`Cannot move ${pyStr(direction)}!`, { show_alert: true })));
      }
      void ((await render_admin_ebook_folder_directory(query, context, "")));
  } else if (pyT(pyStart(data, "adm_ebfld_rename_"))) {
      folder_name = pyReplace(data, "adm_ebfld_rename_", "");
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(active_dir, ">", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
      context.user_data["rename_eb_folder_old"] = folder_name;
      context.user_data["rename_eb_folder_parent"] = parent_path;
      context.user_data["awaiting_eb_folder_rename"] = true;
      void ((await query.edit_message_text(`✏️ **'${pyStr(folder_name)}' ফোল্ডারের নতুন নাম লিখে পাঠান:**

(নতুন নাম লিখুন অথবা নিচের বাটনে চাপুন)`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: `adm_ebdir_${pyStr(active_dir)}` })]]) })));
  } else if (pyT(pyStart(data, "adm_setebcat_"))) {
      cat_selected = pyReplace(data, "adm_setebcat_", "");
      context.user_data["admin_add_ebook"] = true;
      context.user_data["ebook_step"] = "name";
      context.user_data["new_ebook"] = { category: cat_selected, folder_path: cat_selected };
      msg = `📁 **ক্যাটাগরি: \`${pyStr(cat_selected)}\`**
━━━━━━━━━━━━━━━━━━━━

✨ **ধাপ ১/৪: ই-বুকের নাম (E-Book Title) লিখে পাঠান:**
(যেমন: 📘 HSC Physics Formula Sheet | ${pyStr(cat_selected)})

💡 ক্যাটাগরি স্বয়ংক্রিয়ভাবে \`${pyStr(cat_selected)}\` সেট করা থাকবে।`;
      k_cancel = [[InlineKeyboardButton("✕ Cancel", { callback_data: `adm_ebdir_${pyStr(cat_selected)}` })]];
      void ((await send_wizard_step1(query, context, msg, k_cancel)));
  } else if (pyT((pyEq(data, "adm_cancel_ebook")))) {
      active_dir = pyGet(context.user_data, "active_eb_dir", "");
      context.user_data["admin_add_ebook"] = false;
      pyPop(context.user_data, "new_ebook", null);
      pyPop(context.user_data, "ebook_step", null);
      void ((await render_admin_ebook_folder_directory(query, context, active_dir)));
  } else if (pyT((pyEq(data, "adm_ebook_back")))) {
      step = pyGet(context.user_data, "ebook_step");
      new_ebook = pyGet(context.user_data, "new_ebook", {  });
      active_dir = (((__v139) => (pyT(__v139) ? __v139 : (pyGet(new_ebook, "category", "General"))))(pyGet(new_ebook, "folder_path")));
      try {
            context.user_data["last_wizard_msg_id"] = query.message.message_id;
      } catch (__e) {
      }
      if (pyT((pyEq(step, "price")))) {
            context.user_data["ebook_step"] = "name";
            msg = `📁 **ডিরেক্টরি: \`${pyStr(active_dir)}\`**
━━━━━━━━━━━━━━━━━━━━

✨ **ধাপ ১/৪: ই-বুকের নাম (E-Book Title) লিখে পাঠান:**
(যেমন: 📘 HSC Physics Formula Sheet | ${pyStr(active_dir)})

💡 ক্যাটাগরি স্বয়ংক্রিয়ভাবে \`${pyStr(active_dir)}\` সেট করা থাকবে।`;
            k_cancel = [[InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_ebook" })]];
            void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_cancel) })));
      } else if (pyT((pyEq(step, "description")))) {
            context.user_data["ebook_step"] = "price";
            p_price = `📖 ই-বুকের নাম: **${pyStr(pyGet(new_ebook, "name", ""))}**

💰 **ধাপ ২/৪: ই-বুকের মূল্য লিখুন (Price in BDT):**

(যেমন: 50 বা ফ্রি ই-বুকের জন্য 0 লিখুন)`;
            keyboard = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebook_back" }), InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_ebook" })]];
            void ((await query.edit_message_text(p_price, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else if (pyT((pyEq(step, "file_or_link")))) {
            context.user_data["ebook_step"] = "description";
            price_val = pyGet(new_ebook, "price", 0);
            price_tag = (pyT(((price_val > 0))) ? (`৳${pyStr(price_val)}`) : ("বিনামূল্যে (Free) 🎁"));
            p_desc = `💰 মূল্য: **${pyStr(price_tag)}**

📝 **ধাপ ৩/৪: ই-বুকের বিস্তারিত বিবরণ (Description) লিখুন:**

💡 ই-বুকের বিষয়বস্তু বা বৈশিষ্ট্য লিখুন (অথবা স্কিপ করতে নিচের বাটনে চাপুন):`;
            keyboard = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebook_back" }), InlineKeyboardButton("⏭️ Skip Description", { callback_data: "adm_skipeb_desc" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_ebook" })]];
            void ((await query.edit_message_text(p_desc, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else if (pyT((pyEq(data, "adm_skipeb_desc")))) {
      new_ebook = pyGet(context.user_data, "new_ebook", {  });
      new_ebook["description"] = "প্রিমিয়াম ই-বুক ও স্টাডি মেটেরিয়াল।";
      context.user_data["new_ebook"] = new_ebook;
      active_dir = (((__v140) => (pyT(__v140) ? __v140 : (pyGet(new_ebook, "category", "General"))))(pyGet(new_ebook, "folder_path")));
      if (pyT(pyGet(new_ebook, "file_id"))) {
            void ((await send_admin_ebook_preview(query, context, new_ebook)));
      } else {
            context.user_data["ebook_step"] = "file_or_link";
            p_text = `📁 **ডিরেক্টরি:** \`${pyStr(active_dir)}\`
━━━━━━━━━━━━━━━━━━━━
📄 **ধাপ ৪/৪: PDF ফাইল সরাসরি আপলোড করুন অথবা ডাউনলোড লিংক পাঠান:**

💡 ফাইল পাঠানোর নিয়ম:
• সরাসরি এই চ্যাটে Telegram **PDF Document** ফাইল সেন্ড করুন — একাধিক PDF একটা একটা করে পাঠাতে পারেন, সবগুলো যোগ হবে।
• অথবা Google Drive / Web ডাউনলোড লিংক লিখে পাঠান।
• 🖼️ কভার ছবি দিতে চাইলে **Photo** পাঠান।`;
            k_file = [[InlineKeyboardButton("⬅️Back", { callback_data: "adm_ebook_back" }), InlineKeyboardButton("⏭️ Skip File (পরে যোগ করবেন)", { callback_data: "adm_skipeb_file" })], [InlineKeyboardButton("✕ Cancel", { callback_data: "adm_cancel_ebook" })]];
            void ((await query.edit_message_text(p_text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_file) })));
      }
  } else if (pyT((pyEq(data, "adm_skipeb_file")))) {
      new_ebook = pyGet(context.user_data, "new_ebook", {  });
      void ((await send_admin_ebook_preview(query, context, new_ebook)));
  } else if (pyT((pyEq(data, "adm_ebook_preview")))) {
      new_ebook = pyGet(context.user_data, "new_ebook", {  });
      if (pyT((!pyT(pyGet(new_ebook, "name"))))) {
            void ((await query.answer("⚠️ ই-বুকের তথ্য অসম্পূর্ণ!", { show_alert: true })));
            return;
      }
      void ((await send_admin_ebook_preview(query, context, new_ebook)));
  } else if (pyT((pyEq(data, "adm_publisheb")))) {
      new_ebook = pyGet(context.user_data, "new_ebook", {  });
      if (pyT((!pyT(pyGet(new_ebook, "name"))))) {
            try {
                    void ((await query.edit_message_text("⚠️ **ই-বুকের তথ্য অসম্পূর্ণ!**\n━━━━━━━━━━━━━━━━━━━━\n\nসেশন শেষ হয়ে গেছে — নতুন করে আবার যোগ করুন।", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("➕ Add New E-Book", { callback_data: "adm_ebooks" })]]) })));
            } catch (__e) {
                    void ((await query.answer("⚠️ ই-বুকের তথ্য অসম্পূর্ণ!", { show_alert: true })));
            }
            return;
      }
      ebook_id = `EB-${pyStr(pyInt(pyTimestamp(pyNow())))}`;
      new_ebook["id"] = ebook_id;
      active_fld = pyGet(context.user_data, "active_eb_dir", "");
      if (pyT((((__v141) => (pyT(__v141) ? __v141 : ((!pyT(pySub(new_ebook, "folder_path"))))))(((!pyContains(new_ebook, "folder_path"))))))) {
            new_ebook["folder_path"] = active_fld;
      }
      if (pyT((((__v142) => (pyT(__v142) ? __v142 : ((!pyT(pySub(new_ebook, "category"))))))(((!pyContains(new_ebook, "category"))))))) {
            segs = pySplit(active_fld, " > ", -1);
            new_ebook["category"] = (pyT(segs) ? (pySub(segs, 0)) : ("General"));
      }
      if (pyT(((!pyContains(new_ebook, "price"))))) {
            new_ebook["price"] = 0;
      }
      if (pyT(((!pyContains(new_ebook, "description"))))) {
            new_ebook["description"] = "প্রিমিয়াম ই-বুক ও স্টাডি মেটেরিয়াল।";
      }
      _pub_n = pyLen(_ebook_get_files(new_ebook));
      db.add_ebook(ebook_id, new_ebook);
      context.user_data["admin_add_ebook"] = false;
      pyPop(context.user_data, "new_ebook", null);
      pyPop(context.user_data, "ebook_step", null);
      pyPop(context.user_data, "last_wizard_msg_id", null);
      _pub_files_line = (pyT(_pub_n) ? (`
📁 **ফাইল:** ${pyStr(_pub_n)}টি PDF`) : (""));
      msg_success = `✅ **ই-বুক সফলভাবে প্রকাশিত হয়েছে!**
━━━━━━━━━━━━━━━━━━━━

📖 **নাম:** ${pyStr(pySub(new_ebook, "name"))}
📂 **ডিরেক্টরি:** \`${pyStr((((__v143) => (pyT(__v143) ? __v143 : (pyGet(new_ebook, "category"))))(pyGet(new_ebook, "folder_path"))))}\`
💰 **মূল্য:** ${pyStr((pyT(((pySub(new_ebook, "price") > 0))) ? (`৳${pyStr(pySub(new_ebook, "price"))}`) : ("Free 🎁")))}${pyStr(_pub_files_line)}`;
      keyboard = [[InlineKeyboardButton(`📁 Open '${pyStr((((__v144) => (pyT(__v144) ? __v144 : ("Folder")))(pyGet(new_ebook, "folder_path"))))}'`, { callback_data: `adm_ebdir_${pyStr(pyGet(new_ebook, "folder_path", ""))}` })], [InlineKeyboardButton("➕ Add Another E-Book", { callback_data: `adm_addebook_dir_${pyStr(pyGet(new_ebook, "folder_path", ""))}` })], [InlineKeyboardButton("« E-Book Management", { callback_data: "adm_ebooks" })]];
      void ((await query.edit_message_text(msg_success, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_vieweb_"))) {
      eid = pyReplace(data, "adm_vieweb_", "");
      void ((await show_ebook_edit_dashboard(query, eid)));
  } else if (pyT(pyStart(data, "adm_eb_toggle_"))) {
      eid = pyReplace(data, "adm_eb_toggle_", "");
      eb = db.get_ebook(eid);
      if (pyT(eb)) {
            new_status = (pyT(((!pyEq(pyGet(eb, "status"), "inactive")))) ? ("inactive") : ("active"));
            db.update_ebook(eid, { status: new_status });
            tag = (pyT((pyEq(new_status, "inactive"))) ? ("🔴 Disabled") : ("🟢 Enabled"));
            void ((await query.answer(`E-Book ${pyStr(tag)}!`, { show_alert: true })));
            void ((await show_ebook_edit_dashboard(query, eid)));
      }
  } else if (pyT(pyStart(data, "adm_ebmove_mleft_"))) {
      eid = pyReplace(data, "adm_ebmove_mleft_", "");
      success = db.move_ebook_left(eid);
      if (pyT(success)) {
            void ((await query.answer("✅ Moved E-Book to parent folder!", { show_alert: true })));
            void ((await show_ebook_edit_dashboard(query, eid)));
      } else {
            void ((await query.answer("⚠️ Already at root folder, cannot move left!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_ebmove_mright_"))) {
      eid = pyReplace(data, "adm_ebmove_mright_", "");
      eb = db.get_ebook(eid);
      if (pyT((!pyT(eb)))) {
            void ((await query.answer("E-Book not found!", { show_alert: true })));
            return;
      }
      c_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(eb, "folder_path", ""))), " / ", " > "), "/", " > ");
      subfolders = db.get_ebook_sub_folders(c_fld);
      if (pyT((!pyT(subfolders)))) {
            void ((await query.answer("⚠️ No sub-folders available in current directory to move into!", { show_alert: true })));
            return;
      }
      context.user_data["move_eb_target_id"] = eid;
      context.user_data["move_eb_target_fld"] = c_fld;
      context.user_data["move_eb_target_subs"] = subfolders;
      keyboard = [];
      for (const [idx, sf] of pyIter(pyEnumerate(subfolders))) {
            pyAppend(keyboard, [InlineKeyboardButton(`📁 ${pyStr(sf)}`, { callback_data: `adm_ebmove_dosub_${pyStr(idx)}` })]);
      }
      pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: `adm_vieweb_${pyStr(eid)}` })]);
      void ((await query.edit_message_text(`➡️ **Select a sub-folder to move '${pyStr(pyGet(eb, "name"))}' into:**`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_ebmove_dosub_"))) {
      idx = pyInt(pyReplace(data, "adm_ebmove_dosub_", ""));
      eid = pyGet(context.user_data, "move_eb_target_id");
      subfolders = pyGet(context.user_data, "move_eb_target_subs", []);
      if (pyT((((__v145) => (pyT(__v145) ? __v145 : (((idx >= pyLen(subfolders))))))((!pyT(eid)))))) {
            void ((await query.answer("Session expired!", { show_alert: true })));
            return;
      }
      target_sub = pySub(subfolders, idx);
      success = db.move_ebook_right(eid, target_sub);
      pyPop(context.user_data, "move_eb_target_id", null);
      pyPop(context.user_data, "move_eb_target_fld", null);
      pyPop(context.user_data, "move_eb_target_subs", null);
      if (pyT(success)) {
            void ((await query.answer(`✅ Moved into '${pyStr(target_sub)}'!`, { show_alert: true })));
            void ((await show_ebook_edit_dashboard(query, eid)));
      } else {
            void ((await query.answer("❌ Move failed!", { show_alert: true })));
      }
  } else if (pyT(pyStart(data, "adm_deleb_confirm_"))) {
      eid = pyReplace(data, "adm_deleb_confirm_", "");
      eb = db.get_ebook(eid);
      if (pyT(eb)) {
            fld = pyGet(eb, "folder_path", "");
            db.delete_ebook(eid);
            void ((await query.answer(`✅ '${pyStr(pyGet(eb, "name", "E-Book"))}' deleted successfully!`, { show_alert: true })));
            void ((await render_admin_ebook_folder_directory(query, context, fld)));
      } else {
            void ((await query.answer("❌ E-Book not found!", { show_alert: true })));
      }
  } else if (pyT((((__v146) => (pyT(__v146) ? ((!pyT(pyStart(data, "adm_deleb_confirm_")))) : __v146))(pyStart(data, "adm_deleb_"))))) {
      eid = pyReplace(data, "adm_deleb_", "");
      eb = db.get_ebook(eid);
      if (pyT((!pyT(eb)))) {
            void ((await query.answer("❌ E-Book not found!", { show_alert: true })));
            return;
      }
      confirm_kb = InlineKeyboardMarkup([[InlineKeyboardButton("✅ Yes, Delete", { callback_data: `adm_deleb_confirm_${pyStr(eid)}` })], [InlineKeyboardButton("« Cancel", { callback_data: `adm_vieweb_${pyStr(eid)}` })]]);
      void ((await query.edit_message_text(`🗑️ <b>Delete e-book?</b>

📕 <b>${pyStr(pyHtmlEscape(pyStr(pyGet(eb, "name", "Untitled"))))}</b> will be permanently removed.
This cannot be undone.`, { parse_mode: "HTML", reply_markup: confirm_kb })));
  } else if (pyT(pyStart(data, "adm_editeb_"))) {
      eid = pyReplace(data, "adm_editeb_", "");
      eb = db.get_ebook(eid);
      if (pyT((!pyT(eb)))) {
            void ((await query.answer("E-Book not found!")));
            return;
      }
      text = `✏️ **Edit E-Book: '${pyStr(pyGet(eb, "name"))}'**
━━━━━━━━━━━━━━━━━━━━
Select property to edit:`;
      keyboard = [[InlineKeyboardButton("✏️ Edit Title", { callback_data: `edebprop_${pyStr(eid)}_name` }), InlineKeyboardButton("💰 Edit Price", { callback_data: `edebprop_${pyStr(eid)}_price` })], [InlineKeyboardButton("📂 Edit Category", { callback_data: `edebprop_${pyStr(eid)}_category` }), InlineKeyboardButton("📁 Edit File / Drive Link", { callback_data: `edebprop_${pyStr(eid)}_access_link` })], [InlineKeyboardButton("📝 Edit Description", { callback_data: `edebprop_${pyStr(eid)}_description` })], [InlineKeyboardButton("🖼️ Edit Banner", { callback_data: `edebprop_${pyStr(eid)}_image` })], [InlineKeyboardButton("⬅️Back", { callback_data: `adm_vieweb_${pyStr(eid)}` })]];
      void ((await query.edit_message_text(text, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "edebprop_"))) {
      parts = pySplit(data, "_", -1);
      eid = pySub(parts, 1);
      prop = pyJoin("_", pySlice(parts, 2, null, null));
      context.user_data["admin_edit_ebid"] = eid;
      context.user_data["admin_edit_ebook_field"] = prop;
      prompts = { name: "Send new E-Book Title / Name:", price: "Send new Price in BDT (Send `0` for Free):", category: "Send new Category (e.g. HSC 28, SSC, Admission, General):", access_link: "Upload new PDF Document file OR send Google Drive / Web link:", description: "Send new Description text:", image: "Send new Banner Photo (or `remove` to remove it):" };
      void ((await query.edit_message_text(`✏️ **${pyStr(pyGet(prompts, prop, "Send new value:"))}**

💡 Type /cancel to abort.`)));
  } else if (pyT((((__v147) => (pyT(__v147) ? __v147 : (pyStart(data, "adm_porders_"))))((pyEq(data, "adm_pending_orders")))))) {
      page_num = (pyT(pyStart(data, "adm_porders_")) ? (pyInt(pyReplace(data, "adm_porders_", ""))) : (1));
      [pending, total_pages] = db.get_paginated_pending_orders({ page: page_num, per_page: 6 });
      if (pyT((!pyT(pending)))) {
            void ((await query.edit_message_text("✅ No pending orders currently!", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]]) })));
            return;
      }
      keyboard = [];
      for (const o of pyIter(pending)) {
            student_name = (((__v149) => (pyT(__v149) ? __v149 : (((__v148) => (pyT(__v148) ? __v148 : ("Student")))(pyGet(o, "username")))))(pyGet(o, "full_name")));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(format_order_id_display(pySub(o, "order_id")))} — ${pyStr(pySlice(student_name, null, 15, null))} — ${pyStr(pySub(o, "amount"))}৳ (${pyStr(pyGet(o, "payment_method", ""))})`, { callback_data: `ordinfo_${pyStr(pySub(o, "order_id"))}` })]);
      }
      nav_row = [];
      if (pyT(((page_num > 1)))) {
            pyAppend(nav_row, InlineKeyboardButton("◀️", { callback_data: `adm_porders_${pyStr((page_num - 1))}` }));
      } else {
            pyAppend(nav_row, InlineKeyboardButton("⏹️", { callback_data: "adm_ignore" }));
      }
      pyAppend(nav_row, InlineKeyboardButton("🔍 Search", { callback_data: "adm_order_search" }));
      if (pyT(((page_num < total_pages)))) {
            pyAppend(nav_row, InlineKeyboardButton("▶️", { callback_data: `adm_porders_${pyStr((page_num + 1))}` }));
      } else {
            pyAppend(nav_row, InlineKeyboardButton("⏹️", { callback_data: "adm_ignore" }));
      }
      pyAppend(keyboard, nav_row);
      pyAppend(keyboard, [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]);
      void ((await query.edit_message_text(`⏳ **Pending Orders (Page ${pyStr(page_num)}/${pyStr(total_pages)}):**
Select an order to review & verify:`, { reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "ordinfo_"))) {
      order_id = pyReplace(data, "ordinfo_", "");
      void ((await show_order_detail(query, order_id)));
  } else if (pyT(pyStart(data, "approve_"))) {
      order_id = pyReplace(data, "approve_", "");
      order = db.get_order(order_id);
      if (pyT((((__v150) => (pyT(__v150) ? (((!pyEq(pyGet(order, "status"), "approved")))) : __v150))(order)))) {
            if (pyT((pyEq(pyGet(order, "checkout_type", "single"), "ebook")))) {
                    _ebid = (((__v151) => (pyT(__v151) ? __v151 : ("")))(pyGet(order, "course_id")));
                    if (pyT((((__v152) => (pyT(__v152) ? __v152 : ((!pyT(db.get_ebook(_ebid))))))((!pyT(_ebid)))))) {
                              void ((await query.answer("❌ এই অর্ডারে কোনো ই-বুক linked নেই — approve করা হলো না!", { show_alert: true })));
                              return;
                    }
            }
            db.update_order(order_id, { status: "approved" });
            checkout_type = pyGet(order, "checkout_type", "single");
            access_links = [];
            if (pyT((pyEq(checkout_type, "ebook")))) {
                    eb_id = pyGet(order, "course_id");
                    db.add_ebook_purchase(pySub(order, "user_id"), eb_id);
                    eb_obj = db.get_ebook(eb_id);
                    if (pyT((((__v153) => (pyT(__v153) ? (pyGet(eb_obj, "access_link")) : __v153))(eb_obj)))) {
                              pyAppend(access_links, `➥ **${pyStr(pySub(eb_obj, "name"))}:** ${pyStr(pySub(eb_obj, "access_link"))}`);
                    }
            } else {
                    target_courses = pyGet(order, "courses", []);
                    if (pyT((((__v154) => (pyT(__v154) ? (pyGet(order, "course_id")) : __v154))((!pyT(target_courses)))))) {
                              target_courses = [pySub(order, "course_id")];
                    }
                    for (const cid of pyIter(target_courses)) {
                              _eb = db.get_ebook(cid);
                              if (pyT(_eb)) {
                                          db.add_ebook_purchase(pySub(order, "user_id"), cid);
                                          if (pyT(pyGet(_eb, "access_link"))) {
                                                        pyAppend(access_links, `➥ **${pyStr(pySub(_eb, "name"))}:** ${pyStr(pySub(_eb, "access_link"))}`);
                                          }
                                          continue;
                              }
                              db.add_purchase(pySub(order, "user_id"), cid);
                              c_obj = db.get_course(cid);
                              if (pyT((((__v156) => (pyT(__v156) ? ((((__v155) => (pyT(__v155) ? __v155 : (pyGet(c_obj, "group_id"))))(pyGet(c_obj, "access_link")))) : __v156))(c_obj)))) {
                                          if (pyT(pyGet(c_obj, "access_link"))) {
                                                        db.store_user_access_link(pySub(order, "user_id"), cid, pySub(c_obj, "access_link"));
                                          }
                                          pyAppend(access_links, `➥ **${pyStr(pySub(c_obj, "name"))}:** Access ready`);
                              }
                    }
            }
            reward_res = db.trigger_referral_reward_for_order(order);
            if (pyT(reward_res)) {
                    [reward_uid, r_amount, c_code] = reward_res;
                    try {
                              void ((await context.bot.send_message(reward_uid, `🎉 <b>Referral Reward Earned!</b>
━━━━━━━━━━━━━━━━━━━━

🏷️ <b>Coupon Code:</b> <code>${pyStr(c_code)}</code>
📦 <b>Order ID:</b> <code>${pyStr(format_order_id_display(order_id))}</code>
💰 <b>Reward Earned:</b> <code>+৳${pyStr(r_amount)} BDT</code>

✨ <i>The reward has been added to your account balance. Check your profile to view your balance.</i>`, { parse_mode: "HTML" })));
                    } catch (e) {
                              logger.error(`রেফারেল রিওয়ার্ড নোটিফিকেশন পাঠাতে সমস্যা: ${pyStr(e)}`);
                    }
            }
            access_text = (pyT(access_links) ? (pyJoin("\n", access_links)) : ((pyT((pyEq(checkout_type, "ebook"))) ? ("আমাদের বটে '📃 My E-Books' মেনুতে আপনার ই-বুক যুক্ত করা হয়েছে।") : ("আমাদের বটে '✦ আমার কোর্সসমূহ' মেনুতে আপনার কোর্স লিংক যুক্ত করা হয়েছে।"))));
            is_free = false;
            try {
                    if (pyT((pyEq(pyInt(pyGet(order, "amount", 0)), 0)))) {
                              is_free = true;
                    }
            } catch (__e) {
            }
            has_link = ((pyLen(access_links) > 0));
            if (pyT(is_free)) {
                    if (pyT(has_link)) {
                              template_key = "delivery_free_with_link";
                              default_delivery = "🎉 **Your Course Access is Confirmed!**\n\n**Course:** {course_name}\n\n👇 Click the button below to join your course:\n{access_text}";
                    } else {
                              template_key = "delivery_free_no_link";
                              default_delivery = "🎉 **Your Course Access is Confirmed!**\n\n**Course:** {course_name}\n\n⚠️ No direct link is currently available. Please contact admin.";
                    }
            } else if (pyT(has_link)) {
                    template_key = "delivery_paid_with_link";
                    default_delivery = "🎉 **Your Course Purchase was Successful!**\n\n**Course:** {course_name}\n**Order ID:** `{order_id}`\n\n✅ **Payment completed successfully.**\n\n👇 Click the button below to join your course:\n{access_text}";
            } else {
                    template_key = "delivery_paid_no_link";
                    default_delivery = "🎉 **Your Course Purchase was Successful!**\n\n**Course:** {course_name}\n**Order ID:** `{order_id}`\n\n✅ **Payment completed successfully.**\n\n⚠️ No direct link is attached to this course. Please contact support.";
            }
            delivery_template = (((__v158) => (pyT(__v158) ? __v158 : (((__v157) => (pyT(__v157) ? __v157 : (default_delivery)))(db.get_setting("delivery_message")))))(db.get_setting(template_key)));
            [cleaned_delivery, custom_kb] = parse_inline_buttons(delivery_template);
            c_name = pyStr((((__v159) => (pyT(__v159) ? __v159 : ("N/A")))(pyGet(order, "course_name"))));
            o_id = format_order_id_display(order_id);
            amt = pyStr(pyGet(order, "amount", 0));
            acc = (pyT(access_text) ? (pyStr(access_text)) : (""));
            user_notify = cleaned_delivery;
            for (const pat of pyIter(["${courseName}", "{courseName}", "${course_name}", "{course_name}"])) {
                    user_notify = pyReplace(user_notify, pat, c_name);
            }
            for (const pat of pyIter(["${orderId}", "{orderId}", "${order_id}", "{order_id}"])) {
                    user_notify = pyReplace(user_notify, pat, o_id);
            }
            for (const pat of pyIter(["${amount}", "{amount}"])) {
                    user_notify = pyReplace(user_notify, pat, amt);
            }
            for (const pat of pyIter(["${access_text}", "{access_text}", "${accessText}", "{accessText}"])) {
                    user_notify = pyReplace(user_notify, pat, acc);
            }
            keyboard = [];
            if (pyT((pyEq(checkout_type, "ebook")))) {
                    eb_id = pyGet(order, "course_id");
                    eb_obj = db.get_ebook(eb_id);
                    if (pyT(eb_obj)) {
                              if (pyT(pyGet(eb_obj, "file_id"))) {
                                          pyAppend(keyboard, [InlineKeyboardButton("📥 Download (PDF)", { callback_data: `ebdl_${pyStr(eb_id)}` })]);
                              }
                              if (pyT(pyGet(eb_obj, "access_link"))) {
                                          pyAppend(keyboard, [InlineKeyboardButton("📥 Download E-Book", { url: pySub(eb_obj, "access_link") })]);
                              }
                    }
                    pyAppend(keyboard, [InlineKeyboardButton("📚 My E-Books", { callback_data: "my_ebooks_nav" })]);
            } else {
                    if (pyT(access_links)) {
                              for (const cid of pyIter(target_courses)) {
                                          c_obj = db.get_course(cid);
                                          if (pyT(c_obj)) {
                                                        void ((await append_course_join_buttons(keyboard, context.bot, c_obj, pySub(order, "user_id"), { query: null, force_new: true, invite_name: `Order ${pyStr(format_order_id_display(order_id))}`, prefix: `🔗 ${pyStr(pySlice(pyGet(c_obj, "name", ""), null, 12, null))} | `, single_text: `${pyStr(pySub(c_obj, "name"))}` })));
                                          }
                              }
                    }
                    if (pyT(pyAny(((() => { const __acc = []; for (const cid of pyIter(target_courses)) { __acc.push(db.get_ebook(cid)); } return __acc; })())))) {
                              pyAppend(keyboard, [InlineKeyboardButton("📚 My E-Books", { callback_data: "my_ebooks_nav" })]);
                    }
                    pyAppend(keyboard, [InlineKeyboardButton("🎓 My Courses", { callback_data: "my_courses_nav" })]);
            }
            if (pyT(custom_kb)) {
                    pyExtend(keyboard, custom_kb);
            }
            try {
                    void ((await context.bot.send_message(pySub(order, "user_id"), user_notify, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
            } catch (e) {
                    logger.error(`ইউজারকে নোটিফিকেশন পাঠাতে সমস্যা: ${pyStr(e)}`);
            }
            try {
                    _smid = pyGet(order, "status_msg_id");
                    if (pyT(_smid)) {
                              _approved_txt = `📦 **Order ID:** \`${pyStr(o_id)}\`
📘 **Course:** ${pyStr(c_name)}
💰 **Amount:** ${pyStr(amt)} ৳

📊 **Status:** ✅ Approved`;
                              try {
                                          void ((await context.bot.edit_message_text(_approved_txt, { chat_id: pySub(order, "user_id"), message_id: _smid, parse_mode: "Markdown" })));
                              } catch (__e) {
                                          void ((await context.bot.edit_message_text(_approved_txt, { chat_id: pySub(order, "user_id"), message_id: _smid })));
                              }
                    } else {
                              void ((await query.answer("⚠️ User status message ID missing — user notified by DM only.", { show_alert: true })));
                    }
            } catch (e) {
                    logger.warning(`order status msg edit failed: ${pyStr(e)}`);
                    try {
                              void ((await query.answer("⚠️ User status message update failed — user notified by DM only.", { show_alert: true })));
                    } catch (__e) {
                    }
            }
            try {
                    order_amount = pyInt(pyGet(order, "amount", 0));
            } catch (__e) {
                    order_amount = 0;
            }
            if (pyT(((order_amount > 0)))) {
                    [conv_success, referrer_id, reward_amt, new_bal] = db.process_paid_referral_conversion({ buyer_id: pySub(order, "user_id"), order_id: order_id, course_name: pyGet(order, "course_name", "Paid Course") });
                    if (pyT((((__v160) => (pyT(__v160) ? (referrer_id) : __v160))(conv_success)))) {
                              try {
                                          void ((await context.bot.send_message(referrer_id, `🎁 <b>Referral Bonus Earned!</b>
━━━━━━━━━━━━━━━━━━━━
👤 A student joined through your referral link has successfully purchased a course!

📦 <b>Order ID:</b> <code>${pyStr(format_order_id_display(order_id))}</code>
💰 <b>Bonus Earned:</b> <code>+৳${pyStr(reward_amt)} BDT</code>
💳 <b>Current Balance:</b> <code>৳${pyStr(new_bal)} BDT</code>

💡 <i>You can use your balance to purchase any course or e-book directly from the bot.</i>`, { parse_mode: "HTML" })));
                              } catch (e) {
                                          logger.error(`Failed to send referral bonus reward notice: ${pyStr(e)}`);
                              }
                    }
            }
            void ((await query.answer(`✅ Order approved!`, { show_alert: false })));
            void ((await show_order_detail(query, order_id, { notice: "✅ **Order approved & access delivered!**" })));
            void ((await sync_admin_order_messages(context, order_id, "approved")));
      } else if (pyT(order)) {
            void ((await query.answer("✅ Already approved!", { show_alert: false })));
            void ((await sync_admin_order_messages(context, order_id, "approved")));
            void ((await show_order_detail(query, order_id)));
      }
  } else if (pyT(pyStart(data, "reject_"))) {
      order_id = pyReplace(data, "reject_", "");
      order = db.get_order(order_id);
      if (pyT((((__v161) => (pyT(__v161) ? ((pyEq(pyGet(order, "status"), "pending"))) : __v161))(order)))) {
            db.update_order(order_id, { status: "rejected" });
            _rej_label = (pyT((pyEq(pyGet(order, "checkout_type"), "ebook"))) ? ("📖 **E-Book:**") : ("📖 **Course:**"));
            _co = pyGet(order, "checkout_type", "single");
            _clbl = (pyT((pyEq(_co, "cart"))) ? ("Courses") : ((pyT((pyEq(_co, "ebook"))) ? ("E-Book") : ("Course"))));
            _wl = (pyT(pyGet(order, "wallet_used")) ? (`
💳 **Wallet Used:** -৳${pyStr(pyGet(order, "wallet_used", 0))}`) : (""));
            try {
                    void ((await context.bot.send_message(pySub(order, "user_id"), `❌ **Sorry! Your order has been cancelled.**
━━━━━━━━━━━━━━━━━━━━

📦 **Order ID:** \`${pyStr(format_order_id_display(order_id))}\`
📘 **${pyStr(_clbl)}:** ${pyStr(pyGet(order, "course_name", "N/A"))}
💰 **Amount:** ${pyStr(pyGet(order, "amount", 0))} ৳${pyStr(_wl)}
💳 **Method:** ${pyStr(pyGet(order, "payment_method", "N/A"))}
🔑 **TrxID:** \`${pyStr(pyGet(order, "trxid", "N/A"))}\`

📊 **Status:** ❌ Cancelled`, { parse_mode: "Markdown" })));
            } catch (e) {
                    logger.error(`ইউজারকে রিজেক্ট মেসেজ পাঠাতে সমস্যা: ${pyStr(e)}`);
            }
            try {
                    _smid = pyGet(order, "status_msg_id");
                    if (pyT(_smid)) {
                              _cancelled_txt = `❌ **Sorry! Your order has been cancelled.**
━━━━━━━━━━━━━━━━━━━━

📦 **Order ID:** \`${pyStr(format_order_id_display(order_id))}\`
📘 **${pyStr(_clbl)}:** ${pyStr(pyGet(order, "course_name", "N/A"))}
💰 **Amount:** ${pyStr(pyGet(order, "amount", 0))} ৳${pyStr(_wl)}
💳 **Method:** ${pyStr(pyGet(order, "payment_method", "N/A"))}
🔑 **TrxID:** \`${pyStr(pyGet(order, "trxid", "N/A"))}\`

📊 **Status:** ❌ Cancelled`;
                              try {
                                          void ((await context.bot.edit_message_text(_cancelled_txt, { chat_id: pySub(order, "user_id"), message_id: _smid, parse_mode: "Markdown" })));
                              } catch (__e) {
                                          void ((await context.bot.edit_message_text(_cancelled_txt, { chat_id: pySub(order, "user_id"), message_id: _smid })));
                              }
                    } else {
                              void ((await query.answer("⚠️ User status message ID missing — user notified by DM only.", { show_alert: true })));
                    }
            } catch (e) {
                    logger.warning(`order status msg edit failed: ${pyStr(e)}`);
                    try {
                              void ((await query.answer("⚠️ User status message update failed — user notified by DM only.", { show_alert: true })));
                    } catch (__e) {
                    }
            }
            void ((await query.answer(`❌ Order rejected!`, { show_alert: false })));
            void ((await show_order_detail(query, order_id, { notice: "❌ **Order rejected & refunded!**" })));
            void ((await sync_admin_order_messages(context, order_id, "rejected")));
      } else if (pyT(order)) {
            void ((await query.answer(`⚠️ Already ${pyStr(pyGet(order, "status"))}!`, { show_alert: true })));
            void ((await sync_admin_order_messages(context, order_id, (pyT((pyEq(pyGet(order, "status"), "approved"))) ? ("approved") : ("rejected")))));
            void ((await show_order_detail(query, order_id)));
      }
  } else if (pyT((pyEq(data, "adm_coupons")))) {
      coupons = db.get_all_coupons();
      active_count = pySum(((() => { const __acc = []; for (const c of pyIter(pyValues(coupons))) { if (!pyT((pyEq(pyGet(c, "status", "active"), "active")))) continue; __acc.push(1); } return __acc; })()));
      inactive_count = (pyLen(coupons) - active_count);
      r_stats = db.get_referral_global_stats();
      ref_st_icon = (pyT(pySub(r_stats, "is_enabled")) ? ("🟢 ON") : ("🔴 OFF"));
      msg = `<blockquote>🎟️ <b>[ Coupon & Referral Rewards Hub ]</b></blockquote>

<blockquote>🏷️ <b>Coupons Overview:</b>
• <b>Total Coupons:</b> <code>${pyStr(pyLen(coupons))}</code>
• <b>Active:</b> <code>${pyStr(active_count)}</code> | <b>Inactive:</b> <code>${pyStr(inactive_count)}</code></blockquote>

<blockquote>🎁 <b>Refer & Earn Program:</b>
• <b>System Status:</b> <b>${pyStr(ref_st_icon)}</b>
• <b>Bonus Per Referral:</b> <code>৳${pyStr(pySub(r_stats, "bonus_amount"))} BDT</code>
• <b>Total Referrers:</b> <code>${pyStr(pySub(r_stats, "total_referrers"))}</code>
• <b>Successful (Paid) Refs:</b> <code>${pyStr(pySub(r_stats, "total_converted"))}</code>
• <b>Total User Balance:</b> <code>৳${pyStr(pySub(r_stats, "total_balance"))} BDT</code></blockquote>

<blockquote>👇 <b>Select an option below:</b></blockquote>`;
      keyboard = [[InlineKeyboardButton("👥 Refer & Earn Manager", { callback_data: "adm_referrals" })], [InlineKeyboardButton(`🔄 Refer System: ${pyStr(ref_st_icon)}`, { callback_data: "adm_tog_referral" })], [InlineKeyboardButton("➕ Create New Coupon", { callback_data: "adm_add_coupon_start" })], [InlineKeyboardButton("📋 All Coupons List", { callback_data: "adm_list_coupons" })], [InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]];
      if (pyT(_msg_has_media(query.message))) {
            try {
                    void ((await query.message.delete()));
            } catch (__e) {
            }
            void ((await query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else if (pyT((pyEq(data, "adm_referrals")))) {
      void ((await render_admin_referrals_hub(query, context)));
  } else if (pyT((pyEq(data, "adm_tog_referral")))) {
      new_st = db.toggle_referral_system();
      st_word = (pyT(new_st) ? ("🟢 ON (Active)") : ("🔴 OFF (Disabled)"));
      void ((await query.answer(`Referral system changed to ${pyStr(st_word)}!`, { show_alert: true })));
      void ((await render_admin_referrals_hub(query, context)));
  } else if (pyT(pyStart(data, "adm_reflist_"))) {
      try {
            page_num = pyInt(pyReplace(data, "adm_reflist_", ""));
      } catch (__e) {
            page_num = 1;
      }
      void ((await query.answer()));
      void ((await render_admin_referrers_list(query, context, { page: page_num })));
  } else if (pyT(pyStart(data, "adm_refuview_"))) {
      target_uid = pyInt(pyReplace(data, "adm_refuview_", ""));
      void ((await render_admin_referral_user_view(query, context, target_uid)));
  } else if (pyT((pyEq(data, "adm_ref_search")))) {
      context.user_data["admin_user_step"] = "search_referral_user";
      void ((await query.edit_message_text("<blockquote>🔍 <b>Search Referral User / রেফারেল ইউজার খুঁজুন</b></blockquote>\n\n<blockquote>📝 <b>নির্দেশনা:</b>\nইউজারের <b>Telegram User ID</b>, <b>Name</b> অথবা <b>Username</b> লিখে পাঠান।\n(যেমন: <code>7610279126</code> বা <code>username</code>)</blockquote>\n\n<blockquote>❌ বাতিল করতে <code>/cancel</code> লিখুন।</blockquote>", { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_referrals" })]]) })));
  } else if (pyT((pyEq(data, "adm_ref_set_bonus")))) {
      context.user_data["admin_user_step"] = "set_referral_bonus";
      cur_bonus = db.get_referral_reward_amount();
      void ((await query.edit_message_text(`<blockquote>💵 <b>Set Referral Bonus Amount</b></blockquote>

<blockquote>💰 <b>বর্তমান বোনাস:</b> <code>৳${pyStr(cur_bonus)} BDT</code> per paid referral</blockquote>

<blockquote>👇 <b>প্রতি সফল পেইড রেফারের নতুন বোনাসের পরিমাণ লিখুন (যেমন: 50 বা 100):</b></blockquote>

<blockquote>❌ বাতিল করতে <code>/cancel</code> লিখুন।</blockquote>`, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Cancel", { callback_data: "adm_referrals" })]]) })));
  } else if (pyT((pyEq(data, "adm_add_coupon_start")))) {
      context.user_data["admin_add_coupon_wizard"] = true;
      context.user_data["coupon_wiz_step"] = "code";
      context.user_data["wiz_coupon"] = { applicable_course_ids: [], applicable_course_names: [] };
      pyPop(context.user_data, "wiz_coupon_page", null);
      void ((await query.edit_message_text("🏷️ **Enter New Coupon Code**\n\nSend your coupon code below.\n👉 Example: `SPECIAL50` or `RATUL20`\n\n❌ To cancel, send `/cancel`.", { parse_mode: "Markdown" })));
  } else if (pyT(pyStart(data, "cpnwiz_type_"))) {
      dtype = pyReplace(data, "cpnwiz_type_", "");
      pySub(context.user_data, "wiz_coupon")["discount_type"] = dtype;
      context.user_data["coupon_wiz_step"] = "discount_value";
      prompt = (pyT((pyEq(dtype, "fixed"))) ? ("💰 **Enter Fixed Discount Amount (৳):**") : ("📊 **Enter Discount Rate (%):**"));
      void ((await query.edit_message_text(prompt, { parse_mode: "Markdown" })));
  } else if (pyT(pyStart(data, "cpnwiz_scope_"))) {
      scope = pyReplace(data, "cpnwiz_scope_", "");
      if (pyT((pyEq(scope, "all")))) {
            pySub(context.user_data, "wiz_coupon")["applicable_category"] = "All";
            pySub(context.user_data, "wiz_coupon")["applicable_course_id"] = null;
            pySub(context.user_data, "wiz_coupon")["applicable_course_name"] = null;
            pySub(context.user_data, "wiz_coupon")["applicable_course_ids"] = [];
            pySub(context.user_data, "wiz_coupon")["applicable_course_names"] = [];
            context.user_data["coupon_wiz_step"] = "usage_limit";
            void ((await query.edit_message_text("🔢 **Enter Maximum Usage Limit (e.g., 100):**", { parse_mode: "Markdown" })));
      } else if (pyT((pyEq(scope, "cat")))) {
            cats = db.get_categories();
            try {
                    for (const ec of pyIter(db.get_ebook_categories())) {
                              if (pyT(((!pyContains(cats, ec))))) {
                                          pyAppend(cats, ec);
                              }
                    }
            } catch (__e) {
            }
            keyboard = [];
            per_row = db.get_category_row_size();
            row = [];
            for (const c of pyIter(cats)) {
                    pyAppend(row, InlineKeyboardButton(`📁 ${pyStr(c)}`, { callback_data: `cpnwiz_cat_${pyStr(c)}` }));
                    if (pyT((pyEq(pyLen(row), per_row)))) {
                              pyAppend(keyboard, row);
                              row = [];
                    }
            }
            if (pyT(row)) {
                    pyAppend(keyboard, row);
            }
            pyAppend(keyboard, [InlineKeyboardButton("« Cancel", { callback_data: "adm_coupons" })]);
            void ((await query.edit_message_text("📂 **Select category (courses + e-books):**", { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else if (pyT((((__v162) => (pyT(__v162) ? __v162 : (pyStart(scope, "course_pg_"))))((pyEq(scope, "course")))))) {
            try {
                    page_num = (pyT(pyStart(scope, "course_pg_")) ? (pyInt(pyReplace(scope, "course_pg_", ""))) : (1));
            } catch (__e) {
                    page_num = 1;
            }
            wiz = pySetDefault(context.user_data, "wiz_coupon", {  });
            pySetDefault(wiz, "applicable_course_ids", []);
            pySetDefault(wiz, "applicable_course_names", []);
            wiz["applicable_category"] = "Specific";
            void ((await query.answer()));
            void ((await render_coupon_course_select_page(query, { page: page_num, context: context })));
      } else if (pyT((((__v163) => (pyT(__v163) ? __v163 : (pyStart(scope, "ebook_pg_"))))((pyEq(scope, "ebook")))))) {
            try {
                    page_num = (pyT(pyStart(scope, "ebook_pg_")) ? (pyInt(pyReplace(scope, "ebook_pg_", ""))) : (1));
            } catch (__e) {
                    page_num = 1;
            }
            wiz = pySetDefault(context.user_data, "wiz_coupon", {  });
            pySetDefault(wiz, "applicable_course_ids", []);
            pySetDefault(wiz, "applicable_course_names", []);
            wiz["applicable_category"] = "Specific";
            void ((await query.answer()));
            void ((await render_coupon_ebook_select_page(query, { page: page_num, context: context })));
      }
  } else if (pyT(pyStart(data, "cpnwiz_cat_"))) {
      cat_chosen = pyReplace(data, "cpnwiz_cat_", "");
      pySub(context.user_data, "wiz_coupon")["applicable_category"] = cat_chosen;
      pySub(context.user_data, "wiz_coupon")["applicable_course_id"] = null;
      pySub(context.user_data, "wiz_coupon")["applicable_course_name"] = null;
      pySub(context.user_data, "wiz_coupon")["applicable_course_ids"] = [];
      pySub(context.user_data, "wiz_coupon")["applicable_course_names"] = [];
      context.user_data["coupon_wiz_step"] = "usage_limit";
      void ((await query.edit_message_text(`✅ Category \`${pyStr(cat_chosen)}\` selected.

🔢 **Enter Maximum Usage Limit (e.g., 100):**`, { parse_mode: "Markdown" })));
  } else if (pyT((pyEq(data, "cpnwiz_courses_done")))) {
      wiz = pyGet(context.user_data, "wiz_coupon", {  });
      sel_ids = (((__v164) => (pyT(__v164) ? __v164 : ([])))(pyGet(wiz, "applicable_course_ids", [])));
      if (pyT((((__v165) => (pyT(__v165) ? (((!pyContains(sel_ids, pyGet(wiz, "applicable_course_id"))))) : __v165))(pyGet(wiz, "applicable_course_id"))))) {
            sel_ids = (sel_ids + [pyGet(wiz, "applicable_course_id")]);
            wiz["applicable_course_ids"] = sel_ids;
      }
      if (pyT((!pyT(sel_ids)))) {
            void ((await query.answer("⚠️ Please select at least 1 course!", { show_alert: true })));
            return;
      }
      sel_names = [];
      for (const cid of pyIter(sel_ids)) {
            c_obj = db.get_course(cid);
            pyAppend(sel_names, (pyT(c_obj) ? (pyGet(c_obj, "name", pySlice(cid, null, 12, null))) : (pySlice(cid, null, 12, null))));
      }
      wiz["applicable_course_names"] = sel_names;
      wiz["applicable_course_id"] = pySub(sel_ids, 0);
      wiz["applicable_course_name"] = (pyT(sel_names) ? (pySub(sel_names, 0)) : (null));
      wiz["applicable_category"] = "Specific";
      context.user_data["coupon_wiz_step"] = "usage_limit";
      void ((await query.answer(`✅ ${pyStr(pyLen(sel_ids))} course(s) selected!`)));
      void ((await query.edit_message_text(`✅ ${pyStr(pyLen(sel_ids))} course(s) selected.

🔢 **Enter Maximum Usage Limit (e.g., 100):**`, { parse_mode: "Markdown" })));
  } else if (pyT((pyEq(data, "cpnwiz_courses_clear")))) {
      wiz = pySetDefault(context.user_data, "wiz_coupon", {  });
      wiz["applicable_course_ids"] = [];
      wiz["applicable_course_names"] = [];
      wiz["applicable_course_id"] = null;
      wiz["applicable_course_name"] = null;
      wiz["applicable_category"] = "Specific";
      page_num = pyGet(context.user_data, "wiz_coupon_page", 1);
      void ((await query.answer("🧹 Selection cleared!")));
      void ((await render_coupon_course_select_page(query, { page: page_num, context: context })));
  } else if (pyT(pyStart(data, "cpnwiz_course_"))) {
      cid_chosen = pyReplace(data, "cpnwiz_course_", "");
      wiz = pySetDefault(context.user_data, "wiz_coupon", {  });
      sel_ids = (((__v166) => (pyT(__v166) ? __v166 : ([])))(pyGet(wiz, "applicable_course_ids", [])));
      if (pyT((((__v167) => (pyT(__v167) ? (((!pyContains(sel_ids, pyGet(wiz, "applicable_course_id"))))) : __v167))(pyGet(wiz, "applicable_course_id"))))) {
            pyAppend(sel_ids, pyGet(wiz, "applicable_course_id"));
      }
      if (pyT((pyContains(sel_ids, cid_chosen)))) {
            sel_ids = ((() => { const __acc = []; for (const x of pyIter(sel_ids)) { if (!pyT(((!pyEq(x, cid_chosen))))) continue; __acc.push(x); } return __acc; })());
            void ((await query.answer("❌ Removed from selection!")));
      } else {
            pyAppend(sel_ids, cid_chosen);
            void ((await query.answer("✅ Added to selection!")));
      }
      sel_names = [];
      for (const cid of pyIter(sel_ids)) {
            c_obj = db.get_course(cid);
            pyAppend(sel_names, (pyT(c_obj) ? (pyGet(c_obj, "name", pySlice(cid, null, 12, null))) : (pySlice(cid, null, 12, null))));
      }
      wiz["applicable_course_ids"] = sel_ids;
      wiz["applicable_course_names"] = sel_names;
      wiz["applicable_course_id"] = (pyT(sel_ids) ? (pySub(sel_ids, 0)) : (null));
      wiz["applicable_course_name"] = (pyT(sel_names) ? (pySub(sel_names, 0)) : (null));
      wiz["applicable_category"] = "Specific";
      page_num = pyGet(context.user_data, "wiz_coupon_page", 1);
      void ((await render_coupon_course_select_page(query, { page: page_num, context: context })));
  } else if (pyT((pyEq(data, "cpnwiz_ebooks_done")))) {
      wiz = pyGet(context.user_data, "wiz_coupon", {  });
      sel_ids = (((__v168) => (pyT(__v168) ? __v168 : ([])))(pyGet(wiz, "applicable_course_ids", [])));
      if (pyT((((__v169) => (pyT(__v169) ? (((!pyContains(sel_ids, pyGet(wiz, "applicable_course_id"))))) : __v169))(pyGet(wiz, "applicable_course_id"))))) {
            sel_ids = (sel_ids + [pyGet(wiz, "applicable_course_id")]);
            wiz["applicable_course_ids"] = sel_ids;
      }
      if (pyT((!pyT(sel_ids)))) {
            void ((await query.answer("⚠️ Please select at least 1 e-book!", { show_alert: true })));
            return;
      }
      sel_names = [];
      for (const eid of pyIter(sel_ids)) {
            e_obj = db.get_ebook(eid);
            if (pyT(e_obj)) {
                    pyAppend(sel_names, pyGet(e_obj, "name", pySlice(eid, null, 12, null)));
                    continue;
            }
            c_obj = db.get_course(eid);
            pyAppend(sel_names, (pyT(c_obj) ? (pyGet(c_obj, "name", pySlice(eid, null, 12, null))) : (pySlice(eid, null, 12, null))));
      }
      wiz["applicable_course_names"] = sel_names;
      wiz["applicable_course_id"] = pySub(sel_ids, 0);
      wiz["applicable_course_name"] = (pyT(sel_names) ? (pySub(sel_names, 0)) : (null));
      wiz["applicable_category"] = "Specific";
      context.user_data["coupon_wiz_step"] = "usage_limit";
      void ((await query.answer(`✅ ${pyStr(pyLen(sel_ids))} e-book(s) selected!`)));
      void ((await query.edit_message_text(`✅ ${pyStr(pyLen(sel_ids))} e-book(s) selected.

🔢 **Enter Maximum Usage Limit (e.g., 100):**`, { parse_mode: "Markdown" })));
  } else if (pyT((pyEq(data, "cpnwiz_ebooks_clear")))) {
      wiz = pySetDefault(context.user_data, "wiz_coupon", {  });
      wiz["applicable_course_ids"] = [];
      wiz["applicable_course_names"] = [];
      wiz["applicable_course_id"] = null;
      wiz["applicable_course_name"] = null;
      wiz["applicable_category"] = "Specific";
      page_num = pyGet(context.user_data, "wiz_coupon_page", 1);
      void ((await query.answer("🧹 Selection cleared!")));
      void ((await render_coupon_ebook_select_page(query, { page: page_num, context: context })));
  } else if (pyT(pyStart(data, "cpnwiz_ebook_"))) {
      eid_chosen = pyReplace(data, "cpnwiz_ebook_", "");
      wiz = pySetDefault(context.user_data, "wiz_coupon", {  });
      sel_ids = (((__v170) => (pyT(__v170) ? __v170 : ([])))(pyGet(wiz, "applicable_course_ids", [])));
      if (pyT((((__v171) => (pyT(__v171) ? (((!pyContains(sel_ids, pyGet(wiz, "applicable_course_id"))))) : __v171))(pyGet(wiz, "applicable_course_id"))))) {
            pyAppend(sel_ids, pyGet(wiz, "applicable_course_id"));
      }
      if (pyT((pyContains(sel_ids, eid_chosen)))) {
            sel_ids = ((() => { const __acc = []; for (const x of pyIter(sel_ids)) { if (!pyT(((!pyEq(x, eid_chosen))))) continue; __acc.push(x); } return __acc; })());
            void ((await query.answer("❌ Removed from selection!")));
      } else {
            pyAppend(sel_ids, eid_chosen);
            void ((await query.answer("✅ Added to selection!")));
      }
      sel_names = [];
      for (const eid of pyIter(sel_ids)) {
            e_obj = db.get_ebook(eid);
            if (pyT(e_obj)) {
                    pyAppend(sel_names, pyGet(e_obj, "name", pySlice(eid, null, 12, null)));
                    continue;
            }
            c_obj = db.get_course(eid);
            pyAppend(sel_names, (pyT(c_obj) ? (pyGet(c_obj, "name", pySlice(eid, null, 12, null))) : (pySlice(eid, null, 12, null))));
      }
      wiz["applicable_course_ids"] = sel_ids;
      wiz["applicable_course_names"] = sel_names;
      wiz["applicable_course_id"] = (pyT(sel_ids) ? (pySub(sel_ids, 0)) : (null));
      wiz["applicable_course_name"] = (pyT(sel_names) ? (pySub(sel_names, 0)) : (null));
      wiz["applicable_category"] = "Specific";
      page_num = pyGet(context.user_data, "wiz_coupon_page", 1);
      void ((await render_coupon_ebook_select_page(query, { page: page_num, context: context })));
  } else if (pyT(pyStart(data, "cpnwiz_pulimit_"))) {
      try {
            pul = pyInt(pyReplace(data, "cpnwiz_pulimit_", ""));
      } catch (__e) {
            pul = 1;
      }
      pySetDefault(context.user_data, "wiz_coupon", {  })["per_user_limit"] = pul;
      context.user_data["coupon_wiz_step"] = "referral_select";
      pul_txt = (pyT((pyEq(pul, 0))) ? ("Unlimited ♾️") : (`${pyStr(pul)} time(s)`));
      void ((await query.answer(`✅ Per-user limit: ${pyStr(pul_txt)}`)));
      keyboard = [[InlineKeyboardButton("✅ Yes (Enable Reward)", { callback_data: "cpnwiz_ref_yes" }), InlineKeyboardButton("✕ No (No Reward)", { callback_data: "cpnwiz_ref_no" })]];
      void ((await query.edit_message_text(`👤 Per-User Limit: **${pyStr(pul_txt)}** ✅

🎁 **Want to add Referral/Affiliate Reward?**
━━━━━━━━━━━━━━━━━━━━
Will any specific partner/user get a commission/reward from the sales made using this coupon?`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "cpnwiz_ref_"))) {
      choice = pyReplace(data, "cpnwiz_ref_", "");
      if (pyT((pyEq(choice, "yes")))) {
            pySub(context.user_data, "wiz_coupon")["enable_referral_reward"] = true;
            context.user_data["coupon_wiz_step"] = "reward_user_id";
            void ((await query.edit_message_text("👤 **Enter Telegram User ID of recipient (e.g. 7610279126):**", { parse_mode: "Markdown" })));
      } else {
            pySub(context.user_data, "wiz_coupon")["enable_referral_reward"] = false;
            pySub(context.user_data, "wiz_coupon")["reward_user_id"] = null;
            pySub(context.user_data, "wiz_coupon")["reward_type"] = "fixed";
            pySub(context.user_data, "wiz_coupon")["reward_amount"] = 0;
            void ((await finalize_coupon_creation(query, context, user_id)));
      }
  } else if (pyT(pyStart(data, "cpnwiz_reftype_"))) {
      rtype = pyReplace(data, "cpnwiz_reftype_", "");
      pySub(context.user_data, "wiz_coupon")["reward_type"] = rtype;
      context.user_data["coupon_wiz_step"] = "reward_amount";
      r_uid = pyGet(pySub(context.user_data, "wiz_coupon"), "reward_user_id", "");
      if (pyT((pyEq(rtype, "fixed")))) {
            prompt = `💰 **Enter Fixed Reward Amount in BDT for User \`${pyStr(r_uid)}\` (e.g., 30 or 50):**`;
      } else {
            prompt = `📊 **Enter Reward Percentage (%) for User \`${pyStr(r_uid)}\` (e.g., 10 or 15):**`;
      }
      void ((await query.edit_message_text(prompt, { parse_mode: "Markdown" })));
  } else if (pyT((((__v172) => (pyT(__v172) ? __v172 : (pyStart(data, "adm_list_coupons_"))))((pyEq(data, "adm_list_coupons")))))) {
      try {
            page_num = (pyT(pyStart(data, "adm_list_coupons_")) ? (pyInt(pyReplace(data, "adm_list_coupons_", ""))) : (1));
      } catch (__e) {
            page_num = 1;
      }
      void ((await query.answer()));
      void ((await render_admin_coupon_list(query, { page: page_num })));
  } else if (pyT(pyStart(data, "adm_view_coupon_"))) {
      code = pyReplace(data, "adm_view_coupon_", "");
      c = db.get_coupon(code);
      if (pyT((!pyT(c)))) {
            void ((await query.answer("❌ No coupon found!", { show_alert: true })));
            return;
      }
      status = pyGet(c, "status", "active");
      status_text = (pyT((pyEq(status, "active"))) ? ("🟢 Active ") : ("🔴 Inactive "));
      dtype_s = (pyT((pyEq(pyGet(c, "discount_type"), "fixed"))) ? ("৳ (Fixed)") : ("% (Percentage)"));
      dval = pyGet(c, "discount_value", pyGet(c, "discount", 0));
      scope_desc = get_coupon_scope_desc(c);
      if (pyT((((__v173) => (pyT(__v173) ? (pyGet(c, "reward_user_id")) : __v173))(pyGet(c, "enable_referral_reward"))))) {
            rtype = (pyT((pyEq(pyGet(c, "reward_type"), "fixed"))) ? ("৳ (Fixed)") : ("% (Percentage)"));
            ref_info = `👤 User ID: \`${pyStr(pyGet(c, "reward_user_id"))}\`
🎁 **Commission:** ${pyStr(pyGet(c, "reward_amount", 0))} ${pyStr(rtype)}`;
      } else {
            ref_info = "Disabled";
      }
      per_user_lim_v = pyGet(c, "per_user_limit", 1);
      per_user_str_v = (pyT((pyEq(per_user_lim_v, 0))) ? ("Unlimited ♾️") : (`${pyStr(per_user_lim_v)} time(s) per ID`));
      msg = `🏷️ **Coupon Code:** \`${pyStr(code)}\`
━━━━━━━━━━━━━━━━━━━━

📊 **Current Status:** ${pyStr(status_text)}
💰 **Discount:** ${pyStr(dval)} ${pyStr(dtype_s)}
🎯 **Scope:** ${pyStr(scope_desc)}
🛒 **Minimum Purchase:** ${pyStr(pyGet(c, "min_purchase", 0))} ৳
🔢 **Usage:** ${pyStr(pyGet(c, "used_count", 0))} / ${pyStr(pyGet(c, "usage_limit", pyGet(c, "uses", 100)))} Times
👤 **Per-ID Limit:** ${pyStr(per_user_str_v)}
🤝 **Referral Reward:** ${pyStr(ref_info)}`;
      toggle_btn_text = (pyT((pyEq(status, "active"))) ? ("🔴 Deactivate Coupon") : ("🟢 Activate Coupon"));
      keyboard = [[InlineKeyboardButton(toggle_btn_text, { callback_data: `adm_toggle_coupon_${pyStr(code)}` })], [InlineKeyboardButton("1️⃣ Per-ID: Once", { callback_data: `adm_pulimit_${pyStr(code)}_1` }), InlineKeyboardButton("♾️ Per-ID: Unlimited", { callback_data: `adm_pulimit_${pyStr(code)}_0` })], [InlineKeyboardButton("🗑️ Delete Coupon", { callback_data: `adm_delcoupon_${pyStr(code)}` })], [InlineKeyboardButton("« Back to List", { callback_data: "adm_list_coupons" })]];
      void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
  } else if (pyT(pyStart(data, "adm_pulimit_"))) {
      try {
            rest = pyReplace(data, "adm_pulimit_", "");
            [pcode, plimit] = pyRSplit(rest, "_", 1);
            plimit = pyInt(plimit);
      } catch (__e) {
            void ((await query.answer("❌ Invalid!", { show_alert: true })));
            return;
      }
      if (pyT(db.set_coupon_per_user_limit(pcode, plimit))) {
            txt = (pyT((pyEq(plimit, 0))) ? ("Unlimited ♾️") : (`${pyStr(plimit)} time(s) per ID`));
            void ((await query.answer(`✅ '${pyStr(pcode)}' Per-ID limit → ${pyStr(txt)}!`, { show_alert: true })));
            query.data = `adm_view_coupon_${pyStr(pcode)}`;
            c = db.get_coupon(pcode);
            status = (pyT(c) ? (pyGet(c, "status", "active")) : ("active"));
            status_text = (pyT((pyEq(status, "active"))) ? ("🟢 Active ") : ("🔴 Inactive "));
            dtype_s = (pyT((pyEq(pyGet((((__v174) => (pyT(__v174) ? __v174 : ({  })))(c)), "discount_type"), "fixed"))) ? ("৳ (Fixed)") : ("% (Percentage)"));
            dval = pyGet((((__v175) => (pyT(__v175) ? __v175 : ({  })))(c)), "discount_value", pyGet((((__v176) => (pyT(__v176) ? __v176 : ({  })))(c)), "discount", 0));
            scope_desc = get_coupon_scope_desc((((__v177) => (pyT(__v177) ? __v177 : ({  })))(c)));
            if (pyT((((__v179) => (pyT(__v179) ? (pyGet((((__v178) => (pyT(__v178) ? __v178 : ({  })))(c)), "reward_user_id")) : __v179))(pyGet((((__v180) => (pyT(__v180) ? __v180 : ({  })))(c)), "enable_referral_reward"))))) {
                    rtype = (pyT((pyEq(pyGet(c, "reward_type"), "fixed"))) ? ("৳ (Fixed)") : ("% (Percentage)"));
                    ref_info = `👤 User ID: \`${pyStr(pyGet(c, "reward_user_id"))}\`
🎁 **Commission:** ${pyStr(pyGet(c, "reward_amount", 0))} ${pyStr(rtype)}`;
            } else {
                    ref_info = "Disabled";
            }
            per_user_lim_v = pyGet((((__v181) => (pyT(__v181) ? __v181 : ({  })))(c)), "per_user_limit", 1);
            per_user_str_v = (pyT((pyEq(per_user_lim_v, 0))) ? ("Unlimited ♾️") : (`${pyStr(per_user_lim_v)} time(s) per ID`));
            msg = `🏷️ **Coupon Code:** \`${pyStr(pcode)}\`
━━━━━━━━━━━━━━━━━━━━

📊 **Current Status:** ${pyStr(status_text)}
💰 **Discount:** ${pyStr(dval)} ${pyStr(dtype_s)}
🎯 **Scope:** ${pyStr(scope_desc)}
🛒 **Minimum Purchase:** ${pyStr(pyGet((((__v182) => (pyT(__v182) ? __v182 : ({  })))(c)), "min_purchase", 0))} ৳
🔢 **Usage:** ${pyStr(pyGet((((__v183) => (pyT(__v183) ? __v183 : ({  })))(c)), "used_count", 0))} / ${pyStr(pyGet((((__v184) => (pyT(__v184) ? __v184 : ({  })))(c)), "usage_limit", pyGet((((__v185) => (pyT(__v185) ? __v185 : ({  })))(c)), "uses", 100)))} Times
👤 **Per-ID Limit:** ${pyStr(per_user_str_v)}
🤝 **Referral Reward:** ${pyStr(ref_info)}`;
            toggle_btn_text = (pyT((pyEq(status, "active"))) ? ("🔴 Deactivate Coupon") : ("🟢 Activate Coupon"));
            keyboard = [[InlineKeyboardButton(toggle_btn_text, { callback_data: `adm_toggle_coupon_${pyStr(pcode)}` })], [InlineKeyboardButton("1️⃣ Per-ID: Once", { callback_data: `adm_pulimit_${pyStr(pcode)}_1` }), InlineKeyboardButton("♾️ Per-ID: Unlimited", { callback_data: `adm_pulimit_${pyStr(pcode)}_0` })], [InlineKeyboardButton("🗑️ Delete Coupon", { callback_data: `adm_delcoupon_${pyStr(pcode)}` })], [InlineKeyboardButton("« Back to List", { callback_data: "adm_list_coupons" })]];
            void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await query.answer("❌ Coupon not found!", { show_alert: true })));
            return;
      }
  } else if (pyT(pyStart(data, "adm_toggle_coupon_"))) {
      code = pyReplace(data, "adm_toggle_coupon_", "");
      c = db.get_coupon(code);
      if (pyT(c)) {
            curr_status = pyGet(c, "status", "active");
            new_status = (pyT((pyEq(curr_status, "active"))) ? ("inactive") : ("active"));
            db.set_coupon_status(code, new_status);
            status_msg = (pyT((pyEq(new_status, "inactive"))) ? ("Deactivated") : ("Activated"));
            void ((await query.answer(`✅ Coupon '${pyStr(code)}' successfully ${pyStr(status_msg)}!`, { show_alert: true })));
            c = db.get_coupon(code);
            status = pyGet(c, "status", "active");
            status_text = (pyT((pyEq(status, "active"))) ? ("🟢 Active ") : ("🔴 Inactive "));
            dtype_s = (pyT((pyEq(pyGet(c, "discount_type"), "fixed"))) ? ("৳ (Fixed)") : ("% (Percentage)"));
            dval = pyGet(c, "discount_value", pyGet(c, "discount", 0));
            scope_desc = get_coupon_scope_desc(c, { default_all: "🌐 All Courses (Global)" });
            if (pyT((((__v186) => (pyT(__v186) ? (pyGet(c, "reward_user_id")) : __v186))(pyGet(c, "enable_referral_reward"))))) {
                    rtype = (pyT((pyEq(pyGet(c, "reward_type"), "fixed"))) ? ("৳ (Fixed)") : ("% (Percentage)"));
                    ref_info = `👤 User ID: \`${pyStr(pyGet(c, "reward_user_id"))}\`
🎁 **Commission:** ${pyStr(pyGet(c, "reward_amount", 0))} ${pyStr(rtype)}`;
            } else {
                    ref_info = "Disabled";
            }
            per_user_lim = pyGet(c, "per_user_limit", 1);
            per_user_str = (pyT((pyEq(per_user_lim, 0))) ? ("Unlimited") : (`${pyStr(per_user_lim)} time(s)`));
            msg = `🏷️ **Coupon Code:** \`${pyStr(code)}\`
━━━━━━━━━━━━━━━━━━━━

📊 **Current Status:** ${pyStr(status_text)}
💰 **Discount:** ${pyStr(dval)} ${pyStr(dtype_s)}
🎯 **Scope:** ${pyStr(scope_desc)}
🛒 **Minimum Purchase:** ${pyStr(pyGet(c, "min_purchase", 0))} ৳
🔢 **Usage:** ${pyStr(pyGet(c, "used_count", 0))} / ${pyStr(pyGet(c, "usage_limit", pyGet(c, "uses", 100)))} Times
👤 **Per-User Limit:** ${pyStr(per_user_str)}
🤝 **Referral Reward:** ${pyStr(ref_info)}`;
            toggle_btn_text = (pyT((pyEq(status, "active"))) ? ("🔴 Deactivate Coupon") : ("🟢 Activate Coupon"));
            keyboard = [[InlineKeyboardButton(toggle_btn_text, { callback_data: `adm_toggle_coupon_${pyStr(code)}` })], [InlineKeyboardButton("🗑️ Delete Coupon", { callback_data: `adm_delcoupon_${pyStr(code)}` })], [InlineKeyboardButton("« Back to List", { callback_data: "adm_list_coupons" })]];
            void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else if (pyT(pyStart(data, "adm_delcoupon_confirm_"))) {
      code = pyReplace(data, "adm_delcoupon_confirm_", "");
      db.delete_coupon(code);
      void ((await query.answer(`✅ Coupon '${pyStr(code)}' deleted successfully!`, { show_alert: true })));
      void ((await render_admin_coupon_list(query, { page: 1 })));
  } else if (pyT((((__v187) => (pyT(__v187) ? ((!pyT(pyStart(data, "adm_delcoupon_confirm_")))) : __v187))(pyStart(data, "adm_delcoupon_"))))) {
      code = pyReplace(data, "adm_delcoupon_", "");
      confirm_kb = InlineKeyboardMarkup([[InlineKeyboardButton("✅ Yes, Delete", { callback_data: `adm_delcoupon_confirm_${pyStr(code)}` })], [InlineKeyboardButton("« Cancel", { callback_data: `adm_view_coupon_${pyStr(code)}` })]]);
      void ((await query.edit_message_text(`🗑️ <b>Delete coupon?</b>

🏷️ <code>${pyStr(pyHtmlEscape(code))}</code> will be permanently removed.
This cannot be undone.`, { parse_mode: "HTML", reply_markup: confirm_kb })));
  } else if (pyT((pyEq(data, "adm_stats")))) {
      stats = db.get_stats();
      void ((await query.edit_message_text(`📊 **Business Statistics Overview**
━━━━━━━━━━━━━━━━━━━━

👥 **Total Active Students:** ${pyStr(pySub(stats, "total_users"))}
📚 **Total Ready Courses:** ${pyStr(pySub(stats, "total_courses"))}
📦 **Total Orders:** ${pyStr(pySub(stats, "total_orders"))}
⏳ **Pending Orders:** ${pyStr(pySub(stats, "pending_orders"))}
💸 **Pending Withdrawals:** ${pyStr(pyGet(stats, "pending_withdrawals", 0))}
💵 **Total Gross Sales:** ${pyStr(pySub(stats, "total_revenue"))} ৳
💳 **Total Withdrawals Paid:** ${pyStr(pyGet(stats, "total_withdrawn", 0))} ৳`, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("« Admin Menu", { callback_data: "adm_main" })]]) })));
  } else if (pyT((((__v188) => (pyT(__v188) ? __v188 : (pyStart(data, "adm_aorders_"))))((pyEq(data, "adm_all_orders")))))) {
      page_num = (pyT(pyStart(data, "adm_aorders_")) ? (pyInt(pyReplace(data, "adm_aorders_", ""))) : (1));
      [orders, total_pages] = db.get_paginated_all_orders({ page: page_num, per_page: 6 });
      if (pyT((!pyT(orders)))) {
            void ((await query.edit_message_text("❌ No order records found.", { reply_markup: InlineKeyboardMarkup([[InlineKeyboardButton("⬅️Back", { callback_data: "adm_main" })]]) })));
            return;
      }
      keyboard = [];
      for (const o of pyIter(orders)) {
            status_symbol = (pyT((pyEq(pySub(o, "status"), "pending"))) ? ("⏳") : ((pyT((pyEq(pySub(o, "status"), "approved"))) ? ("✅") : ("❌"))));
            student_name = (((__v190) => (pyT(__v190) ? __v190 : (((__v189) => (pyT(__v189) ? __v189 : ("Student")))(pyGet(o, "username")))))(pyGet(o, "full_name")));
            pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(status_symbol)} ${pyStr(format_order_id_display(pySub(o, "order_id")))} — ${pyStr(pySlice(student_name, null, 15, null))} — ${pyStr(pySub(o, "amount"))}৳`, { callback_data: `ordinfo_${pyStr(pySub(o, "order_id"))}` })]);
      }
      nav_row = [];
      if (pyT(((page_num > 1)))) {
            pyAppend(nav_row, InlineKeyboardButton("◀️", { callback_data: `adm_aorders_${pyStr((page_num - 1))}` }));
      } else {
            pyAppend(nav_row, InlineKeyboardButton("⏹️", { callback_data: "adm_ignore" }));
      }
      pyAppend(nav_row, InlineKeyboardButton("🔍 Search", { callback_data: "adm_order_search" }));
      if (pyT(((page_num < total_pages)))) {
            pyAppend(nav_row, InlineKeyboardButton("▶️", { callback_data: `adm_aorders_${pyStr((page_num + 1))}` }));
      } else {
            pyAppend(nav_row, InlineKeyboardButton("⏹️", { callback_data: "adm_ignore" }));
      }
      pyAppend(keyboard, nav_row);
      pyAppend(keyboard, [InlineKeyboardButton("⬅️Back", { callback_data: "adm_main" })]);
      void ((await query.edit_message_text(`📋 **All Orders (Page ${pyStr(page_num)}/${pyStr(total_pages)}):**`, { reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

