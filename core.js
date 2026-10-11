// core.js — auto-transpiled from bot.py by py2js. Ported 1:1 from the Python source.
import { InlineKeyboardMarkup, InputMediaPhoto, KeyboardButton, ReplyKeyboardMarkup } from "./compat.js";
import { ADMIN_IDS, BOT_NAME, SUPPORT_USERNAME } from "./config.js";
import { db } from "./db.js";
import { browse_ebooks, send_course_details, view_ebook_details } from "./screens.js";
import { pyAppend, pyContains, pyEq, pyGet, pyGetAttr, pyHasAttr, pyHtmlEscape, pyInt, pyIsInstance, pyIter, pyJoin, pyLStrip, pyLen, pyList, pyLower, pyMax, pyMin, pyPop, pyRStrip, pyRange, pyReCompile, pyReFindAll, pyReSub, pyReplace, pySlice, pySorted, pySplit, pyStart, pyStr, pyStrip, pySub, pyT, pyUpper, pyValues } from "./helpers.js";

import { InlineKeyboardButton as _RawInlineKeyboardButton } from "./compat.js";
import { createHash } from "node:crypto";
export function __pyLogFmt(lvl, msg) {
  const d = new Date();
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  const ts = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())},${pad(d.getMilliseconds(), 3)}`;
  const parts = [msg];
  for (let i = 2; i < arguments.length; i++) parts.push(JSON.stringify(arguments[i]));
  return `${ts} - bot - ${lvl} - ${parts.join(' ')}`;
}
export const logger = {
  debug: () => { },
  info: function (msg) { console.log(__pyLogFmt('INFO', msg)); },
  warning: function (msg) { console.log(__pyLogFmt('WARNING', msg)); },
  error: function (msg) { console.error(__pyLogFmt('ERROR', msg)); },
  exception: function (msg) { console.error(__pyLogFmt('ERROR', msg)); },
};
export const _COMPACT_CALLBACKS = {};
export function _compact_callback_data(callback_data) {
  callback_data = pyStr(callback_data);
  const is_safe_inline_payload = (
    pyT(callback_data) &&
    Buffer.byteLength(callback_data, 'utf-8') <= 64 &&
    !Array.from(callback_data).some((char) => char.codePointAt(0) < 32 || char.codePointAt(0) === 127)
  );
  if (pyT(is_safe_inline_payload)) {
    return callback_data;
  }
  const token = `cb_${createHash('sha256').update(callback_data, 'utf8').digest('hex').slice(0, 16)}`;
  _COMPACT_CALLBACKS[token] = callback_data;
  return token;
}

export let BUTTON_COLOR_GROUPS = [{ id: "approve", label: "Approve / Confirm", details: "Order + withdraw Approve buttons", prefixes: ["approve_", "apprwdr_"], labels: [], label_prefixes: [] }, { id: "danger", label: "Reject / Delete", details: "Reject, delete category / course / button, remove from cart", prefixes: ["reject_", "rejwdr_", "adm_del", "adm_fld_delfolder", "adm_ebfld_delfolder", "remcart_"], labels: [], label_prefixes: [] }, { id: "buynow", label: "Buy Now", details: "Course / e-book Buy Now button", prefixes: ["buy_"], labels: [], label_prefixes: [] }, { id: "paymethods", label: "Pay Methods", details: "bKash, Nagad, Rocket, Use Wallet", prefixes: ["pay_"], labels: [], label_prefixes: [] }, { id: "coupon", label: "Coupon", details: "Coupon / Apply Coupon buttons", prefixes: ["coupon_"], labels: [], label_prefixes: [] }, { id: "addcart", label: "Add to Cart", details: "Add to Cart button", prefixes: ["addcart_"], labels: [], label_prefixes: [] }, { id: "browse", label: "Category / Sub-category", details: "All browse buttons (+ per-category colors below)", prefixes: ["cat_", "subcat_", "ebcat_"], labels: [], label_prefixes: [] }, { id: "back", label: "Back buttons", details: "All Back buttons everywhere", prefixes: [], labels: ["⬅️Back", "◀️ Back"], label_prefixes: ["« Back"] }, { id: "nav", label: "My Courses / Profile / Info", details: "Main navigation buttons", prefixes: ["my_", "profile_", "info_", "browse_"], labels: [], label_prefixes: [] }, { id: "pagination", label: "Prev / Next", details: "List page buttons (search, orders, courses)", prefixes: ["srchpg_", "my_courses_pg_", "my_ebooks_pg_", "my_orders_pg_", "noop_"], labels: [], label_prefixes: [] }, { id: "ebooks", label: "E-Book Download", details: "Download PDF / free access buttons", prefixes: ["ebdl_", "unlock_free_eb_"], labels: [], label_prefixes: [] }, { id: "home", label: "Home / Main Menu", details: "HOME buttons", prefixes: ["back_to_main_menu"], labels: [], label_prefixes: [] }];
export let BUTTON_COLOR_DEFAULTS = { approve: "success", danger: "danger" };
export let BUTTON_STYLE_DOT = { primary: "🔵", success: "🟢", danger: "🔴", none: "⚪" };
export let BUTTON_STYLE_NAME = { primary: "Blue", success: "Green", danger: "Red", none: "Default" };
export function _browse_root_category(cb) {
  let r, rest, roots;
  try {
      if (pyT(pyStart(cb, "cat_"))) {
            return ((((__v0) => (pyT(__v0) ? __v0 : (null)))(pyStrip(pySlice(cb, 4, null, null)))));
      }
      if (pyT(pyStart(cb, "ebcat_"))) {
            return ((((__v1) => (pyT(__v1) ? __v1 : (null)))(pyStrip(pySub(pySplit(pySlice(cb, 6, null, null), " > ", -1), 0)))));
      }
      if (pyT(pyStart(cb, "subcat_"))) {
            rest = pySlice(cb, 7, null, null);
            roots = ((() => { const __acc = []; for (const r of pyIter(db.get_categories())) { if (!pyT(r)) continue; __acc.push(r); } return __acc; })());
            for (const r of pyIter(db.get_ebook_categories())) {
                    if (pyT((((__v2) => (pyT(__v2) ? (((!pyContains(roots, r)))) : __v2))(r)))) {
                              pyAppend(roots, r);
                    }
            }
            for (const r of pyIter(pySorted(roots, len, true))) {
                    if (pyT((((__v4) => (pyT(__v4) ? __v4 : (((__v3) => (pyT(__v3) ? __v3 : (pyStart(rest, (r + " > ")))))(pyStart(rest, (r + "_"))))))((pyEq(rest, r)))))) {
                              return (r);
                    }
            }
      }
  } catch (__e) {
  }
  return (null);
}

export function _strip_color_dot(t) {
  let d, s;
  try {
      s = pyStr((((__v5) => (pyT(__v5) ? __v5 : ("")))(t)));
      for (const d of pyIter(["🔵 ", "🟢 ", "🔴 ", "⚪ ", "🔵", "🟢", "🔴", "⚪"])) {
            if (pyT(pyStart(s, d))) {
                    return (pyLStrip(pySlice(s, pyLen(d), null, null)));
            }
      }
      return (s);
  } catch (__e) {
      return (pyStr((((__v6) => (pyT(__v6) ? __v6 : ("")))(t))));
  }
}

export function _valid_kb_style(v) {
  try {
      return ((pyT((pyContains(["primary", "success", "danger"], v))) ? (v) : (null)));
  } catch (__e) {
      return (null);
  }
}

export function _kb_button_style(btn) {
  try {
      if (pyT((!pyT(pyIsInstance(btn, "dict"))))) {
            return (null);
      }
      return (_valid_kb_style(pyStrip(pyStr(pyGet(btn, "style", "none")))));
  } catch (__e) {
      return (null);
  }
}

export function _auto_button_style(text, cb) {
  let _bl, _bt, cats, customs, g, groups, grp, hit;
  let nm, p, root, rule, st, t;
  try {
      groups = (((__v7) => (pyT(__v7) ? __v7 : ({  })))(db.get_setting("button_color_groups", {  })));
      cats = (((__v8) => (pyT(__v8) ? __v8 : ({  })))(db.get_setting("category_colors", {  })));
      cb = (((__v9) => (pyT(__v9) ? __v9 : ("")))(cb));
      text = (((__v10) => (pyT(__v10) ? __v10 : ("")))(text));
      const _valid = (v) => {
        return ((pyT((pyContains(["primary", "success", "danger"], v))) ? (v) : (null)));
      };
      _bt = (((__v11) => (pyT(__v11) ? __v11 : ("")))(text));
      if (pyT((((__v13) => (pyT(__v13) ? __v13 : (((__v12) => (pyT(__v12) ? __v12 : ((pyEq(_bt, "◀️ Back")))))(pyStart(_bt, "« Back")))))((pyEq(_bt, "⬅️Back")))))) {
            return (_valid(pyGet(groups, "back", pyGet(BUTTON_COLOR_DEFAULTS, "back", "none"))));
      }
      try {
            customs = (((__v14) => (pyT(__v14) ? __v14 : ([])))(db.get_setting("custom_button_colors", [])));
      } catch (__e) {
            customs = [];
      }
      if (pyT((((__v15) => (pyT(__v15) ? (_bt) : __v15))(customs)))) {
            _bl = pyLower(_bt);
            for (const rule of pyIter(customs)) {
                    if (pyT((!pyT(pyIsInstance(rule, "dict"))))) {
                              continue;
                    }
                    nm = pyStrip(pyStr(pyGet(rule, "name", "")));
                    if (pyT((((__v16) => (pyT(__v16) ? ((pyContains(_bl, pyLower(nm)))) : __v16))(nm)))) {
                              st = _valid(pyGet(rule, "style"));
                              if (pyT(st)) {
                                          return (st);
                              }
                    }
            }
      }
      if (pyT(pyStart(cb, ["cat_", "subcat_", "ebcat_"]))) {
            root = _browse_root_category(cb);
            if (pyT(root)) {
                    st = _valid(pyGet(cats, root));
                    if (pyT(st)) {
                              return (st);
                    }
            }
            return (_valid(pyGet(groups, "browse", pyGet(BUTTON_COLOR_DEFAULTS, "browse", "none"))));
      }
      for (const grp of pyIter(BUTTON_COLOR_GROUPS)) {
            if (pyT((pyContains(["browse", "back"], pySub(grp, "id"))))) {
                    continue;
            }
            g = _valid(pyGet(groups, pySub(grp, "id"), pyGet(BUTTON_COLOR_DEFAULTS, pySub(grp, "id"), "none")));
            if (pyT((!pyT(g)))) {
                    continue;
            }
            hit = false;
            for (const p of pyIter(pyGet(grp, "prefixes", []))) {
                    if (pyT((((__v17) => (pyT(__v17) ? (pyStart(cb, p)) : __v17))(p)))) {
                              hit = true;
                              break;
                    }
            }
            if (pyT((!pyT(hit)))) {
                    for (const t of pyIter(pyGet(grp, "labels", []))) {
                              if (pyT((((__v18) => (pyT(__v18) ? ((pyEq(text, t))) : __v18))(t)))) {
                                          hit = true;
                                          break;
                              }
                    }
            }
            if (pyT((!pyT(hit)))) {
                    for (const t of pyIter(pyGet(grp, "label_prefixes", []))) {
                              if (pyT((((__v19) => (pyT(__v19) ? (pyStart(text, t)) : __v19))(t)))) {
                                          hit = true;
                                          break;
                              }
                    }
            }
            if (pyT(hit)) {
                    return (g);
            }
      }
  } catch (__e) {
  }
  return (null);
}

// bot.py lines 216-235: universal button colors + callback compaction wrapper.
export function InlineKeyboardButton(text, opts = {}) {
  const kwargs = { ...(opts || {}) };
  if (!kwargs.style) {
    delete kwargs.style;
    try {
      const _txt = pyStr(text);
      let _cb = kwargs.callback_data;
      if (_cb === undefined || _cb === null) _cb = null;
      const _auto = _auto_button_style(_txt, typeof _cb === 'string' ? _cb : null);
      if (_auto) kwargs.style = _auto;
    } catch { }
  }
  if (kwargs.callback_data !== undefined && kwargs.callback_data !== null) {
    kwargs.callback_data = _compact_callback_data(kwargs.callback_data);
  }
  return new _RawInlineKeyboardButton(pyStr(text), kwargs);
}

export function _expand_callback_data(callback_data) {
  return (pyGet(_COMPACT_CALLBACKS, callback_data, callback_data));
}

export let DEFAULT_BOT_DESCRIPTION = "🎓 StudyMart-এ আপনাকে স্বাগতম!\n\nআপনার বিশ্বস্ত অটোমেটেড কোর্স প্ল্যাটফর্ম।\n\n📖 SSC • 📚 HSC • 🎯 Admission • 💼 Skills\n\n💳 নিরাপদ পেমেন্ট\n⚡ তাত্ক্ষণিক কোর্স অ্যাক্সেস\n🤖 সম্পূর্ণ অটোমেটেড";
export function is_admin(user_id) {
  if (pyT((!pyT(user_id)))) {
      return (false);
  }
  return (db.is_admin(user_id));
}

export function format_order_id_display(oid) {
  let oid_str;
  if (pyT((!pyT(oid)))) {
      return ("N/A");
  }
  oid_str = pyStrip(pyStr(oid));
  if (pyT(pyStart(pyUpper(oid_str), "ORD-"))) {
      return (`#${pyStr(pySlice(oid_str, 4, null, null))}`);
  }
  if (pyT((!pyT(pyStart(oid_str, "#"))))) {
      return (`#${pyStr(oid_str)}`);
  }
  return (oid_str);
}

export function parse_inline_buttons(text) {
  let body_lines, body_text, btn_pattern, btn_target, btn_text, keyboard, line, lines;
  let matches, remainder, row, stripped;
  if (pyT((!pyT(text)))) {
      return (["", []]);
  }
  lines = pySplit(text, "\n", -1);
  body_lines = [];
  keyboard = [];
  btn_pattern = pyReCompile("\\[\\s*([^\\]|]+?)\\s*\\|\\s*([^\\]|]+?)\\s*\\]");
  for (const line of pyIter(lines)) {
      stripped = pyStrip(line);
      if (pyT((!pyT(stripped)))) {
            pyAppend(body_lines, line);
            continue;
      }
      remainder = pyStrip(pyReSub(btn_pattern, "", stripped));
      if (pyT((pyEq(remainder, "")))) {
            matches = pyReFindAll(btn_pattern, stripped);
            row = [];
            for (const [btn_text, btn_target] of pyIter(matches)) {
                    btn_text = pyStrip(btn_text);
                    btn_target = pyStrip(btn_target);
                    if (pyT((((__v21) => (pyT(__v21) ? __v21 : (((__v20) => (pyT(__v20) ? __v20 : (pyStart(btn_target, "tg://"))))(pyStart(btn_target, "https://")))))(pyStart(btn_target, "http://"))))) {
                              pyAppend(row, InlineKeyboardButton(btn_text, { url: btn_target }));
                    } else {
                              pyAppend(row, InlineKeyboardButton(btn_text, { callback_data: btn_target }));
                    }
            }
            if (pyT(row)) {
                    pyAppend(keyboard, row);
            }
      } else {
            pyAppend(body_lines, line);
      }
  }
  body_text = pyRStrip(pyJoin("\n", body_lines));
  return ([body_text, keyboard]);
}

export async function wizard_edit_or_reply(context, update, text, parse_mode, reply_markup) {
  if (parse_mode === undefined) parse_mode = ("Markdown");
  if (reply_markup === undefined) reply_markup = (null);
  let chat_id, last_msg_id, query, sent;
  last_msg_id = pyGet(context.user_data, "last_wizard_msg_id");
  chat_id = (pyT(update.effective_chat) ? (update.effective_chat.id) : ((pyT(update.message) ? (update.message.chat_id) : ((pyT((((__v22) => (pyT(__v22) ? (update.callback_query.message) : __v22))(update.callback_query))) ? (update.callback_query.message.chat_id) : (null))))));
  if (pyT((((__v23) => (pyT(__v23) ? (chat_id) : __v23))(last_msg_id)))) {
      try {
            void ((await context.bot.delete_message({ chat_id: chat_id, message_id: last_msg_id })));
      } catch (__e) {
            try {
                    void ((await context.bot.edit_message_reply_markup({ chat_id: chat_id, message_id: last_msg_id, reply_markup: null })));
            } catch (__e) {
            }
      }
  }
  if (pyT(update.message)) {
      sent = (await update.message.reply_text(text, { parse_mode: parse_mode, reply_markup: reply_markup }));
  } else {
      query = update.callback_query;
      sent = (await query.message.reply_text(text, { parse_mode: parse_mode, reply_markup: reply_markup }));
  }
  context.user_data["last_wizard_msg_id"] = sent.message_id;
}

export async function send_wizard_step1(query, context, msg, k_cancel) {
  let sent;
  if (pyT(_msg_has_media(query.message))) {
      try {
            void ((await query.message.delete()));
      } catch (__e) {
      }
      sent = (await query.message.reply_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_cancel) }));
      context.user_data["last_wizard_msg_id"] = sent.message_id;
  } else {
      void ((await query.edit_message_text(msg, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(k_cancel) })));
      try {
            context.user_data["last_wizard_msg_id"] = query.message.message_id;
      } catch (__e) {
      }
  }
}

export function check_maintenance(user_id) {
  let msg;
  if (pyT((((__v24) => (pyT(__v24) ? ((!pyT(is_admin(user_id)))) : __v24))((pyEq(db.get_setting("maintenance_mode"), true)))))) {
      msg = db.get_setting("maintenance_message", "🛠️ **StudyMart Bot is currently undergoing scheduled maintenance. Please check back later.**");
      return ([true, msg]);
  }
  return ([false, ""]);
}

export function check_banned(user_id) {
  try {
      if (pyT((((__v25) => (pyT(__v25) ? ((!pyT(db.is_super_admin(user_id)))) : __v25))(db.is_banned(user_id))))) {
            return ([true, "⛔ **Your account has been banned.**\n\nPlease contact admin support for assistance."]);
      }
  } catch (__e) {
  }
  return ([false, ""]);
}

export function get_notify_admins(perm_key) {
  if (perm_key === undefined) perm_key = ("");
  try {
      return (pyList(db.get_admins()));
  } catch (__e) {
      try {
            return (pyList(ADMIN_IDS));
      } catch (__e) {
            return ([]);
      }
  }
}

export async function _user_is_group_member(bot, group_id, user_id) {
  let m;
  try {
      m = (await bot.get_chat_member({ chat_id: group_id, user_id: user_id }));
      return ((pyContains(["member", "administrator", "creator"], m.status)));
  } catch (__e) {
      return (null);
  }
}

export async function get_dynamic_access_link(bot, access_link, user_id, query, group_id, force_new, invite_name) {
  // Transpiled call sites pass Python kwargs as one options object.
  if (query && typeof query === "object" && !Array.isArray(query) && !pyHasAttr(query, "answer")) {
      const __o = query;
      query = __o.query ?? null;
      group_id = __o.group_id ?? null;
      force_new = __o.force_new ?? false;
      invite_name = __o.invite_name ?? null;
  }
  if (query === undefined) query = (null);
  if (group_id === undefined) group_id = (null);
  if (force_new === undefined) force_new = (false);
  if (invite_name === undefined) invite_name = (null);
  let course, e, invite_link, is_member, link, user_link;
  if (pyT((!pyT(force_new)))) {
      user_link = null;
      for (const course of pyIter(pyValues(db.get_all_courses()))) {
            if (pyT((((__v27) => (pyT(__v27) ? ((((__v26) => (pyT(__v26) ? __v26 : ((pyEq(pyStrip(pyStr(pyGet(course, "group_id", ""))), pyStrip(pyStr(group_id)))))))((!pyT(group_id))))) : __v27))((pyEq(pyGet(course, "access_link"), access_link)))))) {
                    user_link = db.get_user_access_link(user_id, pyGet(course, "id"));
                    break;
            }
      }
      if (pyT(user_link)) {
            is_member = (pyT(group_id) ? ((await _user_is_group_member(bot, group_id, user_id))) : (null));
            if (pyT(((!(is_member === true))))) {
                    return (user_link);
            }
            try {
                    void ((await bot.revoke_chat_invite_link({ chat_id: pyStrip(pyStr(group_id)), invite_link: user_link })));
            } catch (__e) {
            }
      }
  }
  if (pyT((!pyT(group_id)))) {
      return (access_link);
  }
  group_id = pyStrip(pyStr(group_id));
  if (pyT((!pyT(group_id)))) {
      return (access_link);
  }
  try {
      logger.info(`[get_dynamic_access_link] Creating invite for group_id: ${pyStr(group_id)}, user: ${pyStr(user_id)}`);
      invite_link = (await bot.create_chat_invite_link({ chat_id: group_id, member_limit: 1, name: pySlice((((__v28) => (pyT(__v28) ? __v28 : (`User ${pyStr(user_id)}`)))(invite_name)), null, 32, null) }));
      link = invite_link.invite_link;
      for (const course of pyIter(pyValues(db.get_all_courses()))) {
            if (pyT((((__v30) => (pyT(__v30) ? ((((__v29) => (pyT(__v29) ? __v29 : ((pyEq(pyStrip(pyStr(pyGet(course, "group_id", ""))), group_id)))))((!pyT(group_id))))) : __v30))((pyEq(pyGet(course, "access_link"), access_link)))))) {
                    db.store_user_access_link(user_id, pyGet(course, "id"), link);
                    break;
            }
      }
      return (link);
  } catch (e) {
      logger.error(`[get_dynamic_access_link] Failed for user ${pyStr(user_id)}, link ${pyStr(access_link)}: ${pyStr(e)}`);
      if (pyT(query)) {
            try {
                    void ((await query.answer(`❌ ${pyStr(e)}`, { show_alert: true })));
            } catch (__e) {
            }
      }
      throw new Error(`Failed to create unique invite link for group ${pyStr(group_id)}. Ensure bot is admin with 'Invite Users' permission. Error: ${pyStr(e)}`);
  }
}

export async function get_course_access_links(bot, course, user_id, query, force_new, invite_name) {
  // Transpiled call sites pass Python kwargs as one options object.
  if (query && typeof query === "object" && !Array.isArray(query) && !pyHasAttr(query, "answer")) {
      const __o = query;
      query = __o.query ?? null;
      force_new = __o.force_new ?? false;
      invite_name = __o.invite_name ?? null;
  }
  if (query === undefined) query = (null);
  if (force_new === undefined) force_new = (false);
  if (invite_name === undefined) invite_name = (null);
  let access_link, cid, e, errors, g, gid, groups, inv;
  let is_member, link, mapping, out, stored;
  if (pyT((!pyT(pyIsInstance(course, "dict"))))) {
      return ([]);
  }
  cid = pyGet(course, "id", "");
  groups = db.get_course_group_list(course);
  if (pyT(groups)) {
      stored = (pyT(force_new) ? ({  }) : (db.get_user_access_links(user_id, cid)));
      [out, mapping, errors] = [[], {  }, []];
      for (const g of pyIter(groups)) {
            gid = pySub(g, "id");
            link = pyGet(stored, gid);
            if (pyT(link)) {
                    is_member = (await _user_is_group_member(bot, gid, user_id));
                    if (pyT(((is_member === true)))) {
                              try {
                                          void ((await bot.revoke_chat_invite_link({ chat_id: gid, invite_link: link })));
                              } catch (__e) {
                              }
                              link = null;
                    }
            }
            if (pyT((!pyT(link)))) {
                    try {
                              logger.info(`[get_course_access_links] Creating invite for group_id: ${pyStr(gid)}, user: ${pyStr(user_id)}`);
                              inv = (await bot.create_chat_invite_link({ chat_id: gid, member_limit: 1, name: pySlice((((__v31) => (pyT(__v31) ? __v31 : (`User ${pyStr(user_id)}`)))(invite_name)), null, 32, null) }));
                              link = inv.invite_link;
                    } catch (e) {
                              logger.error(`[get_course_access_links] Failed for user ${pyStr(user_id)}, group ${pyStr(gid)}: ${pyStr(e)}`);
                              pyAppend(errors, pyGet(g, "label", gid));
                              continue;
                    }
            }
            if (pyT(link)) {
                    mapping[gid] = link;
                    pyAppend(out, [(((__v32) => (pyT(__v32) ? __v32 : ("Join")))(pyGet(g, "label"))), link]);
            }
      }
      if (pyT(mapping)) {
            db.store_user_access_links(user_id, cid, mapping);
      }
      if (pyT((((__v34) => (pyT(__v34) ? (((__v33) => (pyT(__v33) ? (query) : __v33))(errors)) : __v34))((!pyT(out)))))) {
            try {
                    void ((await query.answer(`❌ Could not create invite for: ${pyStr(pyJoin(", ", errors))}`, { show_alert: true })));
            } catch (__e) {
            }
      }
      return (out);
  }
  access_link = (((__v35) => (pyT(__v35) ? __v35 : ("")))(pyGet(course, "access_link", "")));
  if (pyT(pyGet(course, "group_id"))) {
      try {
            link = (await get_dynamic_access_link(bot, access_link, user_id, { query: query, group_id: pyGet(course, "group_id"), force_new: force_new, invite_name: invite_name }));
      } catch (__e) {
            return ([]);
      }
      return ((pyT(link) ? ([[pyGet(course, "name", "Join"), link]]) : ([])));
  }
  if (pyT(access_link)) {
      return ([[pyGet(course, "name", "Join"), access_link]]);
  }
  return ([]);
}

export async function append_course_join_buttons(keyboard, bot, course, user_id, query, force_new, invite_name, prefix, single_text) {
  // Transpiled call sites pass Python kwargs as one options object.
  if (query && typeof query === "object" && !Array.isArray(query) && !pyHasAttr(query, "answer")) {
      const __o = query;
      query = __o.query ?? null;
      force_new = __o.force_new ?? false;
      invite_name = __o.invite_name ?? null;
      prefix = __o.prefix ?? "🔗 ";
      single_text = __o.single_text ?? null;
  }
  if (query === undefined) query = (null);
  if (force_new === undefined) force_new = (false);
  if (invite_name === undefined) invite_name = (null);
  if (prefix === undefined) prefix = ("🔗 ");
  if (single_text === undefined) single_text = (null);
  let added, label, links, url;
  added = 0;
  try {
      links = (await get_course_access_links(bot, course, user_id, query, force_new, invite_name));
  } catch (__e) {
      links = [];
  }
  if (pyT((((__v36) => (pyT(__v36) ? ((!pyT(pyGet(course, "group_ids")))) : __v36))((pyEq(pyLen(links), 1)))))) {
      pyAppend(keyboard, [InlineKeyboardButton((((__v37) => (pyT(__v37) ? __v37 : (`${pyStr(prefix)}${pyStr(pySlice(pySub(pySub(links, 0), 0), null, 30, null))}`)))(single_text)), { url: pySub(pySub(links, 0), 1) })]);
      return (1);
  }
  for (const [label, url] of pyIter(links)) {
      pyAppend(keyboard, [InlineKeyboardButton(`${pyStr(prefix)}${pyStr(pySlice(pyStr(label), null, 30, null))}`, { url: url })]);
      added += 1;
  }
  return (added);
}

export function main_menu_keyboard(user_id) {
  let btn, custom_kb, keyboard, row, row_buttons, st, txt;
  custom_kb = db.get_custom_keyboards();
  keyboard = [];
  for (const row of pyIter(pyGet(custom_kb, "buttons", []))) {
      row_buttons = [];
      for (const btn of pyIter(row)) {
            if (pyT((!pyT(pyIsInstance(btn, "dict"))))) {
                    continue;
            }
            if (pyT(((pyGet(btn, "enabled", true) === false)))) {
                    continue;
            }
            if (pyT((((__v38) => (pyT(__v38) ? ((!pyT(is_admin(user_id)))) : __v38))(pyGet(btn, "admin_only"))))) {
                    continue;
            }
            txt = pyGet(btn, "text");
            if (pyT((((__v39) => (pyT(__v39) ? __v39 : ((!pyT(pyStrip(txt))))))((!pyT(pyIsInstance(txt, "str"))))))) {
                    continue;
            }
            st = _kb_button_style(btn);
            try {
                    if (pyT(st)) {
                              pyAppend(row_buttons, KeyboardButton(pySlice(pyStrip(txt), null, 60, null), { style: st }));
                    } else {
                              pyAppend(row_buttons, KeyboardButton(pySlice(pyStrip(txt), null, 60, null)));
                    }
            } catch (__e) {
                    pyAppend(row_buttons, KeyboardButton(pySlice(pyStrip(txt), null, 60, null)));
            }
      }
      if (pyT(row_buttons)) {
            pyAppend(keyboard, row_buttons);
      }
  }
  if (pyT((!pyT(keyboard)))) {
      keyboard = [[KeyboardButton("🛍️ Cart"), KeyboardButton("👤 Profile"), KeyboardButton("ℹ Info")]];
      if (pyT(is_admin(user_id))) {
            pyAppend(keyboard, [KeyboardButton("⚙ Admin Panel")]);
      }
  }
  return (ReplyKeyboardMarkup(keyboard, { resize_keyboard: true, is_persistent: true, one_time_keyboard: false }));
}

export let WELCOME_MESSAGE = `আসসালামু আলাইকুম! 👋

🎓 **${pyStr(BOT_NAME)}**-এ আপনাকে স্বাগতম!

এখানে আপনি আপনার প্রয়োজনীয় যেকোনো একাডেমিক ও ভর্তি প্রস্তুতির কোর্স খুব সহজেই খুঁজে পাবেন, ক্রয় করতে পারবেন এবং তাৎক্ষণিকভাবে কোর্সের প্রিমিয়াম অ্যাক্সেস পেয়ে যাবেন।

✦ **আমাদের বিশেষ সুবিধাসমূহ:**
• ফুল এইচডি রেকর্ডেড ক্লাস ও নিয়মিত লাইভ সেশন
• সেরা মানের লেকচার শিট, হ্যান্ডনোট ও প্রশ্নব্যাংক
• যেকোনো কোর্সের নাম লিখলেই ইনস্ট্যান্ট সার্চ
• বিকাশ, নগদ ও রকেটের মাধ্যমে ইনস্ট্যান্ট পেমেন্ট
• ২৪/৭ নির্ভরযোগ্য ডেলিভারি ও এডমিন সাপোর্ট

`;
export function get_home_keyboard_grid() {
  let btn, grid, has_browse_eb, row;
  grid = db.get_setting("home_keyboard_grid");
  has_browse_eb = false;
  if (pyT(grid)) {
      for (const row of pyIter(grid)) {
            for (const btn of pyIter(row)) {
                    if (pyT((pyEq(pyGet(btn, "action"), "browse_ebooks")))) {
                              has_browse_eb = true;
                              break;
                    }
            }
      }
      if (pyT((!pyT(has_browse_eb)))) {
            grid = null;
      }
  }
  if (pyT((!pyT(grid)))) {
      // from-import elided
      grid = [[{ text: "📚 Browse Courses", action: "browse_categories", enabled: true }], [{ text: "📖 Browse E-Book", action: "browse_ebooks", enabled: true }], [{ text: "🎓 My Courses", action: "my_courses_nav", enabled: true }, { text: "📃 My E-Books", action: "my_ebooks_nav", enabled: true }], [{ text: "💬 Support", action: `https://t.me/${pyStr(SUPPORT_USERNAME)}`, enabled: true }]];
      db.set_setting("home_keyboard_grid", grid);
  }
  return (grid);
}

export function get_welcome_inline_keyboard() {
  let action, btn, grid, keyboard, keyboard_row, row, text;
  grid = get_home_keyboard_grid();
  keyboard = [];
  for (const row of pyIter(grid)) {
      keyboard_row = [];
      for (const btn of pyIter(row)) {
            if (pyT(pyGet(btn, "enabled", true))) {
                    text = pySub(btn, "text");
                    action = pySub(btn, "action");
                    if (pyT((((__v41) => (pyT(__v41) ? __v41 : (((__v40) => (pyT(__v40) ? __v40 : (pyStart(action, "tg://"))))(pyStart(action, "https://")))))(pyStart(action, "http://"))))) {
                              pyAppend(keyboard_row, InlineKeyboardButton(text, { url: action }));
                    } else {
                              pyAppend(keyboard_row, InlineKeyboardButton(text, { callback_data: action }));
                    }
            }
      }
      if (pyT(keyboard_row)) {
            pyAppend(keyboard, keyboard_row);
      }
  }
  return (InlineKeyboardMarkup(keyboard));
}

export async function cancel_cmd(update, context) {
  let active_dir, active_eb_dir, k, keyboard, msg, origin_cb, row_admin, row_user;
  let state_keys, user_id;
  user_id = (pyT(update.effective_user) ? (update.effective_user.id) : (0));
  active_dir = pyGet(context.user_data, "active_dir");
  active_eb_dir = pyGet(context.user_data, "active_eb_dir");
  origin_cb = pyGet(context.user_data, "course_origin_callback");
  state_keys = ["admin_user_step", "admin_order_search_step", "admin_broadcasting_step", "admin_broadcasting_mode", "bc_payload", "bc_target_mode", "bc_recipients", "withdraw_step", "awaiting_coupon", "coupon_course", "checkout_type", "awaiting_trxid", "pending_order_data", "withdraw_prompt_ids", "admin_add_course", "course_step", "new_course", "course_origin_callback", "admin_add_ebook", "ebook_step", "new_ebook", "admin_edit_course_id", "admin_edit_course_field", "admin_edit_ebid", "admin_edit_ebook_field", "admin_pay_step", "admin_pay_target_key", "new_pay_method", "coupon_wizard_step", "new_coupon_data", "awaiting_folder_rename", "rename_folder_old", "rename_folder_parent", "awaiting_eb_folder_rename", "rename_eb_folder_old", "rename_eb_folder_parent", "admin_msg_edit_key", "edit_msg_key", "edit_msg_name", "admin_add_hbtn_step", "admin_add_hbtn_data", "admin_edit_hbtn_coords", "admin_add_kb_step", "admin_edit_kb_step", "admin_add_category", "admin_add_subcat", "admin_add_eb_subcat", "admin_edit_field", "active_dir", "active_eb_dir", "admin_welcome_media_wait", "admin_info_media_wait", "copy_folder_src", "copy_eb_folder_src", "cut_course_id", "last_wizard_msg_id", "pos_sel", "pos_pick", "pos_cpick", "pos_eb_sel", "pos_eb_pick", "pos_eb_cpick", "kb_pos_sel", "admin_folder_header_text_wait", "admin_folder_header_media_wait", "admin_eb_folder_header_text_wait", "admin_eb_folder_header_media_wait", "admin_eblib_header_text_wait", "admin_eblib_header_media_wait", "admin_catlib_header_text_wait", "admin_catlib_header_media_wait", "admin_cart_media_wait", "admin_wdr_min_step", "admin_add_infobtn_step", "admin_add_infobtn_data", "admin_info_header_key", "admin_info_media_target", "admin_cinfo_label_id", "admin_cinfo_desc_id", "admin_cinfo_header_id", "admin_btncolor_cat", "admin_fallback_text", "admin_fallback_btn", "admin_customcolor", "admin_add_kb_data", "admin_edit_kb_coords", "admin_kb_color_coords", "admin_kb_color_back"];
  for (const k of pyIter(state_keys)) {
      pyPop(context.user_data, k, null);
  }
  msg = "<blockquote>✕ <b>Action Cancelled / বাতিল করা হয়েছে</b></blockquote>\n\n<blockquote>💡 নিচের বাটন চেপে আপনার প্রয়োজনীয় মেনুতে ফিরে যান:</blockquote>";
  keyboard = [];
  if (pyT(is_admin(user_id))) {
      if (pyT((((__v42) => (pyT(__v42) ? (((!pyEq(origin_cb, "adm_main")))) : __v42))(origin_cb)))) {
            pyAppend(keyboard, [InlineKeyboardButton("« Return to Previous Menu", { callback_data: origin_cb })]);
      } else if (pyT(active_dir)) {
            pyAppend(keyboard, [InlineKeyboardButton("« Return to Category", { callback_data: `adm_dir_${pyStr(active_dir)}` })]);
      } else if (pyT(active_eb_dir)) {
            pyAppend(keyboard, [InlineKeyboardButton("« Return to E-Book Category", { callback_data: `adm_ebdir_${pyStr(active_eb_dir)}` })]);
      }
      row_admin = [InlineKeyboardButton("👑 Admin Dashboard", { callback_data: "adm_main" })];
      if (pyT(db.is_home_button_enabled())) {
            pyAppend(row_admin, InlineKeyboardButton("⚜️ Main Menu", { callback_data: "back_to_main_menu" }));
      }
      pyAppend(keyboard, row_admin);
  } else {
      row_user = [];
      if (pyT(db.is_home_button_enabled())) {
            pyAppend(row_user, InlineKeyboardButton("⚜️ Main Menu", { callback_data: "back_to_main_menu" }));
      }
      pyAppend(row_user, InlineKeyboardButton("📚 Browse Courses", { callback_data: "browse_categories" }));
      pyAppend(keyboard, row_user);
  }
  if (pyT(update.callback_query)) {
      try {
            void ((await update.callback_query.answer("Action cancelled.")));
      } catch (__e) {
      }
      if (pyT(_msg_has_media(update.callback_query.message))) {
            try {
                    void ((await update.callback_query.message.delete()));
            } catch (__e) {
            }
            void ((await update.callback_query.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      } else {
            void ((await update.callback_query.edit_message_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
      }
  } else if (pyT(update.message)) {
      void ((await update.message.reply_text(msg, { parse_mode: "HTML", reply_markup: InlineKeyboardMarkup(keyboard) })));
  }
}

export async function start(update, context) {
  let arg, ban_msg, cleaned_welcome, course, course_id, custom_kb, e, eb;
  let eb_id, is_banned, is_new, maint_msg, raw_welcome, referrer_id, reward_amt, student_name;
  let uname_tag, under_maint, user, valid_ref, welcome_kb;
  user = update.effective_user;
  if (pyT((!pyT(user)))) {
      return;
  }
  [under_maint, maint_msg] = check_maintenance(user.id);
  if (pyT(under_maint)) {
      void ((await update.message.reply_text(maint_msg, { parse_mode: "Markdown" })));
      return;
  }
  [is_banned, ban_msg] = check_banned(user.id);
  if (pyT(is_banned)) {
      void ((await update.message.reply_text(ban_msg, { parse_mode: "Markdown" })));
      return;
  }
  referrer_id = null;
  if (pyT(context.args)) {
      arg = pySub(context.args, 0);
      if (pyT(pyStart(arg, "ref_"))) {
            try {
                    referrer_id = pyInt(pyReplace(arg, "ref_", ""));
            } catch (__e) {
                    referrer_id = null;
            }
      } else if (pyT(pyStart(arg, "course_"))) {
            course_id = pyReplace(arg, "course_", "");
            db.add_user(user.id, (((__v43) => (pyT(__v43) ? __v43 : ("")))(user.username)), user.full_name);
            course = db.get_course(course_id);
            if (pyT(course)) {
                    void ((await send_course_details(update.message, context, course, user.id)));
                    return;
            }
      } else if (pyT(pyStart(arg, "ebook_"))) {
            eb_id = pyReplace(arg, "ebook_", "");
            db.add_user(user.id, (((__v44) => (pyT(__v44) ? __v44 : ("")))(user.username)), user.full_name);
            eb = db.get_ebook(eb_id);
            if (pyT(eb)) {
                    void ((await view_ebook_details(update, context, eb_id)));
                    return;
            }
      }
  }
  [is_new, valid_ref] = db.add_user(user.id, (((__v45) => (pyT(__v45) ? __v45 : ("")))(user.username)), user.full_name, referrer_id);
  if (pyT((((__v46) => (pyT(__v46) ? (valid_ref) : __v46))(is_new)))) {
      try {
            student_name = (pyT(user.username) ? ((((__v47) => (pyT(__v47) ? __v47 : (`@${pyStr(user.username)}`)))(user.full_name))) : (`User ${pyStr(user.id)}`));
            uname_tag = (pyT(user.username) ? (` (@${pyStr(user.username)})`) : (""));
            reward_amt = db.get_referral_reward_amount();
            void ((await context.bot.send_message(valid_ref, `🎉 <b>New Referral Joined!</b>
━━━━━━━━━━━━━━━━━━━━
👤 <b>Student:</b> ${pyStr(pyHtmlEscape(student_name))}${pyStr(uname_tag)}
🆔 <b>User ID:</b> <code>${pyStr(user.id)}</code>

💡 <i>When this student purchases a paid course, a ৳${pyStr(reward_amt)} BDT referral bonus will be credited to your account.</i>`, { parse_mode: "HTML" })));
      } catch (e) {
            logger.error(`Failed to send referral join notification: ${pyStr(e)}`);
      }
  }
  if (pyT((((__v48) => (pyT(__v48) ? (((!pyContains(ADMIN_IDS, user.id)))) : __v48))((!pyT(ADMIN_IDS)))))) {
      pyAppend(ADMIN_IDS, user.id);
      logger.info(`প্রাথমিক অ্যাডমিন যুক্ত করা হয়েছে: ${pyStr(user.id)} (@${pyStr(user.username)})`);
  }
  logger.info(`ইউজার স্টার্ট করেছে: ${pyStr(user.id)} | @${pyStr(user.username)} | ${pyStr(user.full_name)}`);
  raw_welcome = db.get_setting("welcome_message", WELCOME_MESSAGE);
  [cleaned_welcome, custom_kb] = parse_inline_buttons(raw_welcome);
  if (pyT(custom_kb)) {
      void ((await update.message.reply_text(cleaned_welcome, { parse_mode: "Markdown", reply_markup: InlineKeyboardMarkup(custom_kb) })));
  } else {
      welcome_kb = get_welcome_inline_keyboard();
      void ((await send_welcome_text(update.message, raw_welcome, { reply_markup: welcome_kb })));
  }
  try {
      void ((await update.message.reply_text("👇 Quick Menu:", { reply_markup: main_menu_keyboard(user.id) })));
  } catch (__e) {
      logger.warning("Reply keyboard re-attach failed", { exc_info: true });
  }
}

export function chunk_buttons_into_rows(buttons, per_row) {
  if (per_row === undefined) per_row = (2);
  let i;
  try {
      per_row = pyMax(1, pyMin(4, pyInt(per_row)));
  } catch (__e) {
      per_row = 2;
  }
  return (((() => { const __acc = []; for (const i of pyIter(pyRange(0, pyLen(buttons), per_row))) { __acc.push(pySlice(buttons, i, (i + per_row), null)); } return __acc; })()));
}

export function _msg_has_media(m) {
  if (pyT(((m === null || m === undefined)))) {
      return (false);
  }
  return (pyT((((__v51) => (pyT(__v51) ? __v51 : (((__v50) => (pyT(__v50) ? __v50 : (((__v49) => (pyT(__v49) ? __v49 : (pyGetAttr(m, "document", null))))(pyGetAttr(m, "video", null)))))(pyGetAttr(m, "animation", null)))))(pyGetAttr(m, "photo", null)))));
}

export function _can_delete_message(m) {
  let fu;
  try {
      fu = pyGetAttr(m, "from_user", null);
      if (pyT(((fu === null || fu === undefined)))) {
            return (true);
      }
      return (pyT(pyGetAttr(fu, "is_bot", false)));
  } catch (__e) {
      return (false);
  }
}

export async function _delete_bot_message(m) {
  if (pyT((((__v52) => (pyT(__v52) ? (_can_delete_message(m)) : __v52))(((!(m === null || m === undefined))))))) {
      try {
            void ((await m.delete()));
      } catch (__e) {
      }
  }
}

export async function _edit_photo_smooth(query, image, caption, markup, parse_mode) {
  if (parse_mode === undefined) parse_mode = ("HTML");
  let e;
  try {
      void ((await query.edit_message_caption(caption, { parse_mode: parse_mode, reply_markup: markup })));
      return (true);
  } catch (e) {
      if (pyT((((__v53) => (pyT(__v53) ? __v53 : ((pyContains(pyLower(pyStr(e)), "message is not modified")))))((pyContains(pyLower(pyStr(e)), "not modified")))))) {
            return (true);
      }
  }
  try {
      void ((await query.edit_message_media(InputMediaPhoto(image, { caption: caption, parse_mode: parse_mode }), { reply_markup: markup })));
      return (true);
  } catch (e) {
      if (pyT((((__v54) => (pyT(__v54) ? __v54 : ((pyContains(pyLower(pyStr(e)), "message is not modified")))))((pyContains(pyLower(pyStr(e)), "not modified")))))) {
            return (true);
      }
  }
  return (false);
}

export function disp_name(name) {
  let ch, i, s;
  s = pyStr((((__v55) => (pyT(__v55) ? __v55 : ("")))(name)));
  i = 0;
  while (pyT(((i < pyLen(s))))) {
      ch = pySub(s, i);
      if (pyT((((__v56) => (pyT(__v56) ? __v56 : ((pyContains(["\u200D", "\uFE0F"], ch)))))(/\s/.test(ch))))) {
            i += 1;
            continue;
      }
      const cp = ch.codePointAt(0);
      const isSymbol = (
        (cp >= 0x2600 && cp <= 0x27BF) ||
        (cp >= 0xFE00 && cp <= 0xFE0F) ||
        (cp >= 0x1F000 && cp <= 0x1FFFF) ||
        (cp >= 0x20000 && cp <= 0x2FFFF) ||
        (cp >= 0x30000 && cp <= 0x3FFFF) ||
        cp === 0x200D ||
        (cp >= 0x20E3 && cp <= 0x20E3) ||
        (cp >= 0xE0020 && cp <= 0xE007F) ||
        (cp >= 0x200 && cp <= 0x200F) ||
        (cp >= 0x2028 && cp <= 0x202F) ||
        (cp >= 0x2060 && cp <= 0x206F) ||
        cp === 0xFEFF ||
        (cp >= 0x0080 && cp <= 0x00A0) ||
        (cp >= 0x00A0 && cp <= 0x00A0)
      );
      if (pyT(isSymbol)) {
            i += 1;
            continue;
      }
      break;
  }
  return ((((__v57) => (pyT(__v57) ? __v57 : (s)))(pyStrip(pySlice(s, i, null, null)))));
}

export async function send_folder_screen(query, text, reply_markup, folder_path) {
  let caption, custom, e, fid, hdr, mtype;
  try {
      hdr = db.get_folder_header((((__v58) => (pyT(__v58) ? __v58 : ("")))(folder_path)));
  } catch (__e) {
      hdr = {  };
  }
  custom = (pyT(pyIsInstance(hdr, "dict")) ? (pyStrip((((__v59) => (pyT(__v59) ? __v59 : ("")))(pyGet(hdr, "text"))))) : (""));
  if (pyT(custom)) {
      text = custom;
  }
  try {
      [mtype, fid] = db.get_folder_header_media((((__v60) => (pyT(__v60) ? __v60 : ("")))(folder_path)));
  } catch (__e) {
      [mtype, fid] = ["none", ""];
  }
  if (pyT((((__v61) => (pyT(__v61) ? (fid) : __v61))((pyContains(["photo", "animation"], mtype)))))) {
      caption = (pyT(((pyLen(text) <= 1024))) ? (text) : ((pySlice(text, null, 1021, null) + "...")));
      void ((await _delete_bot_message(query.message)));
      try {
            if (pyT((pyEq(mtype, "photo")))) {
                    void ((await query.message.reply_photo({ photo: fid, caption: caption, parse_mode: "Markdown", reply_markup: reply_markup })));
            } else {
                    void ((await query.message.reply_animation({ animation: fid, caption: caption, parse_mode: "Markdown", reply_markup: reply_markup })));
            }
            return;
      } catch (e) {
            logger.warning(`Folder header media failed: ${pyStr(e)}`);
      }
  }
  if (pyT(_msg_has_media(query.message))) {
      void ((await _delete_bot_message(query.message)));
      void ((await query.message.reply_text(text, { parse_mode: "Markdown", reply_markup: reply_markup })));
  } else {
      void ((await query.edit_message_text(text, { parse_mode: "Markdown", reply_markup: reply_markup })));
  }
}

export function get_welcome_media() {
  let fid, mtype;
  try {
      mtype = pyLower(pyStr((((__v62) => (pyT(__v62) ? __v62 : ("none")))(db.get_setting("welcome_media_type", "none")))));
  } catch (__e) {
      mtype = "none";
  }
  try {
      fid = db.get_setting("welcome_media_file_id", "");
  } catch (__e) {
      fid = "";
  }
  if (pyT(((!pyContains(["photo", "animation"], mtype))))) {
      return (["none", ""]);
  }
  if (pyT((!pyT(fid)))) {
      return (["none", ""]);
  }
  return ([mtype, fid]);
}

export async function send_welcome_text(msg_target, raw_welcome, reply_markup) {
  if (reply_markup === undefined) reply_markup = (null);
  let caption, e, fid, mtype;
  [mtype, fid] = get_welcome_media();
  caption = (pyT(((pyLen(raw_welcome) <= 1024))) ? (raw_welcome) : ((pySlice(raw_welcome, null, 1021, null) + "...")));
  if (pyT((((__v63) => (pyT(__v63) ? (fid) : __v63))((pyEq(mtype, "photo")))))) {
      try {
            return ((await msg_target.reply_photo({ photo: fid, caption: caption, parse_mode: "Markdown", reply_markup: reply_markup })));
      } catch (e) {
            logger.warning(`Welcome photo send failed, fallback to text: ${pyStr(e)}`);
      }
  } else if (pyT((((__v64) => (pyT(__v64) ? (fid) : __v64))((pyEq(mtype, "animation")))))) {
      try {
            return ((await msg_target.reply_animation({ animation: fid, caption: caption, parse_mode: "Markdown", reply_markup: reply_markup })));
      } catch (e) {
            logger.warning(`Welcome animation send failed, fallback to text: ${pyStr(e)}`);
      }
  }
  return ((await msg_target.reply_text(raw_welcome, { parse_mode: "Markdown", reply_markup: reply_markup })));
}

