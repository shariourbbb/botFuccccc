# CONVENTIONS.md — StudyMart Python → Node.js Conversion Contract

Project: `C:\Users\Ahmed\Desktop\PY-NODExxxx\StudyMart-Bot-Node` (Node.js, ESM, grammY)
Source: `C:\Users\Ahmed\Desktop\PY-NODExxxx\StudyMart-Bot` (bot.py 16660 lines, database.py 3264 lines)

## ABSOLUTE RULES
1. **Faithful 1:1 conversion.** Same function names, same messages (Bengali text copied EXACTLY, byte-for-byte), same callback_data strings, same keyboard layouts, same branching, same defaults. Do NOT improve, restructure, or omit anything.
2. Only call functions that exist per the Module Map below. Import them from the owning module.
3. Circular imports are allowed and expected — BUT only call imported functions inside function bodies, never at module top level.
4. Python → JS translation rules (apply mechanically):
   - `async def f(a, b=1)` → `async function f(a, b = 1)`
   - f-strings → template literals; `.format()` → template literals
   - Tuples → arrays (`return a, b` → `return [a, b]`; caller uses `const [x, y] = ...`)
   - `dict()` / dict literals → object literals; `list` → array
   - `try/except Exception as e:` → `try { } catch (e) { }`; `except Exception: pass` → `catch (e) { }`; `raise` → `throw e`
   - `x.startswith(("a","b"))` → `x.startsWith("a") || x.startsWith("b")`; `endswith` → `endsWith`
   - `str(x)` → `String(x)`; `int(x)` → `parseInt(x, 10)`; `float(x)` → `parseFloat(x)`
   - `len(x)` → `x.length` (array/string) or `Object.keys(x).length` (dict)
   - `"k" in d` (plain dict) → `Object.prototype.hasOwnProperty.call(d, "k")`
   - `d.get("k", default)` (plain dict) → `(k in d ? d[k] : default)` or `d?.k ?? default` — preserve Python falsy semantics exactly
   - `d.pop("k", None)` (plain dict) → `const v = k in d ? d[k] : null; delete d[k];`
   - `for i, item in enumerate(list)` → `for (let i = 0; i < list.length; i++)`
   - `range(n)` → `for (let i = 0; i < n; i++)`; `range(a, b)` → `for (let i = a; i < b; i++)`
   - `min/max/abs` → `Math.min/Math.max/Math.abs`
   - `and/or/not/None/True/False` → `&&/||/!/null/true/false`
   - `re` module → JS `RegExp` (translate patterns; `re.match` → anchor at start)
   - `datetime.now().strftime("%d/%m/%Y %H:%M")` → manual formatting with identical output, zero-padded
   - `isoformat()` → `.toISOString()`; timestamp int conversions preserved
   - `str.isdigit()` → `/^\d+$/.test(s)`
   - `hashlib.sha256(x.encode()).hexdigest()[:16]` → `crypto.createHash('sha256').update(x,'utf8').digest('hex').slice(0,16)`
   - `html.escape(x)` → escape `& < > " '` exactly like Python's html.escape
   - `sorted(l, key=...)` → `[...l].sort(...)`; dict iteration order = insertion order
   - `a // b` → `Math.floor(a / b)`
   - `"".join(list)` → `list.join("")`
   - `time.sleep(s)` in async code → `await new Promise(r => setTimeout(r, s * 1000))`
   - `str.strip()` → `.trim()`; `.lower()` → `.toLowerCase()`; `.upper()` → `.toUpperCase()`
5. **`context.user_data` / `context.bot_data` / `context.chat_data`** are `PDict` instances (compat.js):
   - `.get("k")` / `.get("k", default)` — same as Python dict.get
   - `context.user_data["k"] = v` → `context.user_data.set("k", v)`
   - `context.user_data["k"]` read → `context.user_data.get("k")`
   - `.pop("k")` / `.pop("k", default)`, `.setdefault("k", default)`, `.has("k")`, `.clear()`, `.keys()`, `.values()`
6. **Keyboard/markup classes** (compat.js) — construct with options objects:
   - `InlineKeyboardButton("txt", callback_data="x")` → `new InlineKeyboardButton("txt", { callback_data: "x" })`
   - `InlineKeyboardMarkup(kb)` → `new InlineKeyboardMarkup(kb)`
   - `ReplyKeyboardMarkup(kb, resize_keyboard=True)` → `new ReplyKeyboardMarkup(kb, { resize_keyboard: true })`
   - `KeyboardButton("t", style="success")` → `new KeyboardButton("t", { style: "success" })`
   - `CopyTextButton("t")` → `new CopyTextButton("t")` (button option `copy_text`)

7. **Messages / queries** (compat.js wrappers, PTB-style snake_case methods):
   - `query.answer()` → `await query.answer()`; `query.answer("msg", show_alert=True)` → `await query.answer("msg", { show_alert: true })`
   - `query.edit_message_text(text, parse_mode="Markdown", reply_markup=mk)` → `await query.edit_message_text(text, { parse_mode: "Markdown", reply_markup: mk })`
   - `query.edit_message_reply_markup(reply_markup=mk)` → `await query.edit_message_reply_markup({ reply_markup: mk })`
   - `query.edit_message_media(InputMediaPhoto(...))` → `await query.edit_message_media(new InputMediaPhoto(...))`
   - `query.edit_message_caption(...)` → `await query.edit_message_caption(caption, opts)`
   - `query.message.delete()` → `await query.message.delete()`; `query.message.reply_text(...)` → `await query.message.reply_text(text, opts)`
   - `update.effective_user` / `update.effective_chat` / `update.effective_message` — same names
   - `msg.photo[-1].file_id` → `msg.photo[msg.photo.length - 1].file_id`
   - "not modified" guard: `except Exception as e: if "not modified" not in str(e).lower(): raise` → `catch (e) { if (!String(e?.message || e).toLowerCase().includes("not modified")) throw e; }`
8. **`context.bot`** is a `BotApi` (compat.js): `context.bot.send_message(chat_id, text, { parse_mode, reply_markup, disable_web_page_preview })`, `send_photo(chat_id, photo, { caption, parse_mode, reply_markup })`, `send_document`, `send_video`, `send_media_group`, `copy_message`, `get_chat_member`, `create_chat_invite_link(chat_id, { name, expire_date, creates_join_request, member_limit })`, `revoke_chat_invite_link`, `delete_message`, `edit_message_text`, `send_chat_action`. PTB's `application.bot` == `context.bot`. `expire_date` must be epoch SECONDS (number).

## MODULE MAP (who owns what — import from these modules only)

- **config.js**: BOT_TOKEN, ADMIN_IDS, BOT_USERNAME, BOT_NAME, SUPPORT_USERNAME, PAYMENT_METHODS, CATEGORY_BUTTONS_PER_ROW, SUBCATEGORY_BUTTONS_PER_ROW, all *_DB filenames, MIN_WITHDRAW_AMOUNT.
- **compat.js**: PDict, DataStore, InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup, CopyTextButton, InputMediaPhoto, InputMediaVideo, BotCommand, M, Q, U, BotApi, serializeMarkup, serializeMedia, matchesPtbMessageFilter.
- **db.js**: `db` singleton + `ADMIN_PERMISSION_DEFINITIONS`.
- **core.js** (bot.py lines 1–960 + top-level constants): exports `_compact_callback_data`, `_COMPACT_CALLBACKS`, `_browse_root_category`, `_strip_color_dot`, `_valid_kb_style`, `_kb_button_style`, `_auto_button_style`, `InlineKeyboardButton` (wrapped — ALWAYS use core's version in every module, not compat's), `_expand_callback_data`, `DEFAULT_BOT_DESCRIPTION`, `is_admin`, `format_order_id_display`, `parse_inline_buttons`, `wizard_edit_or_reply`, `send_wizard_step1`, `check_maintenance`, `check_banned`, `get_notify_admins`, `_user_is_group_member`, `get_dynamic_access_link`, `get_course_access_links`, `append_course_join_buttons`, `main_menu_keyboard`, `get_home_keyboard_grid`, `WELCOME_MESSAGE`, `get_welcome_inline_keyboard`, `cancel_cmd`, `start`, `chunk_buttons_into_rows`, `_msg_has_media`, `_can_delete_message`, `_delete_bot_message`, `_edit_photo_smooth`, `disp_name`, `send_folder_screen`, `get_welcome_media`, `send_welcome_text`, constants `BUTTON_COLOR_GROUPS`, `BUTTON_COLOR_DEFAULTS`, `BUTTON_STYLE_DOT`, `BUTTON_STYLE_NAME`, `logger`.
- **screens.js** (bot.py 962–2471): `show_categories`, `show_subcategories`, `safe_html_format`, `format_course_card_html`, `send_rich_course_message`, `send_course_details`, `send_admin_course_preview`, `parse_group_id_input`, `send_admin_group_id_prompt`, `send_admin_category_selector`, `send_admin_subcategory_selector`, `show_profile`, `show_referral`, `show_earnings_dashboard`, `show_earnings_history`, `show_withdrawal_history`, `start_withdraw_flow`, `show_my_courses`, `show_my_ebooks`, `view_ebook_details`, `send_cart_message`, `show_cart`, `get_default_info_content`, `get_info_menu_keyboard`, `send_info_detail`, `show_info`, `_run_search`, `_search_page_keyboard`, `auto_search_courses`, constant `SEARCH_PER_PAGE`.
- **callbacks_user.js** (bot.py 2472–3978): `handle_callback`, `handle_admin_kb_add_input`, `handle_admin_kb_edit_input`. (handle_callback ends by calling `handle_admin_callback` from admin_callback.js for admin data.)
- **user_input.js** (bot.py 3979–5033): `handle_user_input`.
- **flows.js** (bot.py 5034–5769): `show_subcategories_message`, `_cleanup_coupon_prompt`, `_cleanup_pay_prompt`, `_cleanup_withdraw_prompt`, `handle_coupon_input`, `handle_withdraw_input`, `handle_trxid_input`.
- **admin_panels.js** (bot.py 5770–8428): `sync_admin_order_messages`, `build_admin_withdrawal_text`, `build_withdrawal_detail_text`, `sync_admin_withdrawal_messages`, `get_admin_dashboard_keyboard`, `admin_cmd`, `get_admin_uview_keyboard`, `render_admin_user_profile`, `render_user_course_access`, `render_user_ebook_access`, `render_admin_permission_dashboard`, `render_category_reorder_panel`, `render_admin_folder_directory`, `render_ebook_category_reorder_panel`, `render_admin_ebook_folder_directory`, `get_action_select_keyboard`, `get_builtin_actions_keyboard`, `_kb_pick_nav_row`, `get_categories_actions_keyboard`, `get_subcat_category_select_keyboard`, `get_subcategories_actions_keyboard`, `get_all_ebook_folder_paths`, `get_ebook_folder_actions_keyboard`, `render_kb_del_list`, `render_keyboard_settings_panel`, `render_kb_position_panel`, `_kb_color_entries`, `render_kb_colors_panel`, `render_btncolor_groups_panel`, `render_btncolor_cats_panel`, `render_btncolor_custom_panel`, `get_fallback_template_text`, `split_fallback_buttons`, `build_fallback_text`, `render_fallback_panel`, `render_info_item_editor`, `render_cinfo_editor`, `prompt_add_hbtn_row`, `render_hbtn_edit_panel`, `check_admin_callback_permission`, `get_coupon_scope_desc`, `render_coupon_course_select_page`, `render_coupon_ebook_select_page`, `render_admin_coupon_list`, `show_order_detail`, `render_folder_header_panel`, `render_eblib_header_panel`, `render_catlib_header_panel`, `get_cart_media`, `get_cart_empty_body`, `get_cart_header_parts`, `cart_merge_unique`, `render_cart_settings_panel`, `render_ebook_folder_header_panel`, `render_course_groups_panel` + constants `KB_PICK_PER_PAGE`, `KB_COLORS_PER_PAGE`, `BTN_COLOR_GROUPS_PER_PAGE`, `BTN_COLOR_CUSTOMS_PER_PAGE`, `BTN_COLOR_CATS_PER_PAGE`, `DEFAULT_CART_EMPTY`, `DEFAULT_CART_HEADER`, `CART_EMPTY_PRESET_1`, `CART_EMPTY_PRESET_2`.
- **admin_callback_1.js** (bot.py 8429–9904): `adminRoute1(update, context, data)` → returns `true` if it matched+handled a branch, else `false`. Translate every if/elif branch whose header line is within 8429–9904. (Gates like is_admin/banned live in admin_callback.js.)
- **admin_callback_2.js** (bot.py 9905–12349): `adminRoute2(update, context, data)` — same contract.
- **admin_callback_3.js** (bot.py 12350–14605): `adminRoute3(update, context, data)` — same contract.
- **admin_input.js** (bot.py 14606–16526): `handle_admin_payment_input`, `handle_admin_user_mgmt_input`, `render_broadcast_target_selector_keyboard`, `get_broadcast_target_selector_text`, `handle_broadcast_input_step`, `show_broadcast_preview`, `execute_broadcast`, `handle_admin_coupon_creation_wizard`, `finalize_coupon_creation`, `show_course_edit_dashboard`, `handle_admin_category_creation`, `handle_admin_subcategory_creation`, `handle_admin_ebook_subcategory_creation`, `parse_quick_course_template`, `handle_admin_course_creation`, `handle_admin_course_edit_input`, `show_ebook_edit_dashboard`, `_ebook_append_file`, `_ebook_get_files`, `send_admin_ebook_preview`, `handle_admin_ebook_creation`, `handle_admin_ebook_edit_input`.
- **admin_callback.js** (thin master, already provided): permission gates + `adminRoute1/2/3` chain.
- **bot.js**: `check_status`, `post_init`, `main`, handler registration (already provided).

## IMPORT TEMPLATE (adjust to what you actually use)
```js
import { db, ADMIN_PERMISSION_DEFINITIONS } from "./db.js";
import { InlineKeyboardMarkup, KeyboardButton, ReplyKeyboardMarkup, CopyTextButton, InputMediaPhoto, PDict } from "./compat.js";
import { InlineKeyboardButton, is_admin, check_banned, check_maintenance, get_notify_admins, main_menu_keyboard, parse_inline_buttons, _expand_callback_data, _msg_has_media, _can_delete_message, disp_name, chunk_buttons_into_rows, format_order_id_display, get_dynamic_access_link, append_course_join_buttons } from "./core.js";
```
NOTE: `InlineKeyboardButton` must be imported from **core.js** (it is the color/compaction wrapper). If a module you import from is not yet written when you work, still write the import exactly as the Module Map dictates — all files exist by integration time. Never import from a module what that module does not own.

## FINAL SELF-CHECK (before you finish)
- Run: `node --check <yourfile>` (from the project dir) — MUST pass.
- Every Python function in your assigned line range exists in your JS file with the same name (leading underscore kept).
- No Python syntax remains; no placeholders/TODOs.
9. `parse_mode` values stay EXACTLY as Python ("Markdown", "HTML", "MarkdownV2").
10. `db` — singleton from `db.js`: `import { db } from "./db.js";` All 231 Database methods keep identical names/args (read database.py). Also `ADMIN_PERMISSION_DEFINITIONS` from db.js.
11. Python nested helper classes inside functions (e.g. `FakeUpdate`, `FakeCallbackQuery`) — translate as local JS classes in the same function scope. `FakeUpdate(message, callback_query)` → build a plain object: `{ message, callback_query, effective_user: callback_query.from_user, effective_chat: message.chat, update_id: 0 }` and call the target function with it.
