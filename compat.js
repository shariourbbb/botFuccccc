// compat.js — python-telegram-bot compatibility layer on top of grammY.
// This makes the Python bot's object model available in Node.js so that all
// converted handler modules keep the EXACT same structure, logic and calls:
//   context.user_data / context.bot_data / context.bot
//   update.message / update.callback_query / update.effective_user / update.effective_chat
//   query.answer(text, {show_alert}) / query.edit_message_text(text, {parse_mode, reply_markup})
//   InlineKeyboardButton / InlineKeyboardMarkup / ReplyKeyboardMarkup / KeyboardButton

// ============================ PTB-like dicts ============================

const _PDICT_METHODS = new Set([
  "get", "set", "has", "pop", "setdefault", "clear", "keys", "values",
  "items", "size", "raw", "toJSON", "_d",
]);

export class PDict {
  constructor(init = {}) {
    this._d = (init && typeof init === "object" && !Array.isArray(init)) ? { ...init } : {};
    // Proxy makes bracket access (pd["k"], pd["k"] = v) hit the same _d store
    // that .get()/.set() and the py* helpers use — one store, no drift.
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (typeof prop === "symbol") return Reflect.get(target, prop, receiver);
        if (_PDICT_METHODS.has(prop) || typeof target[prop] === "function") {
          return Reflect.get(target, prop, receiver);
        }
        return target._d[prop];
      },
      set(target, prop, value) {
        if (typeof prop === "symbol" || _PDICT_METHODS.has(prop) || prop in PDict.prototype) {
          target[prop] = value;
          return true;
        }
        target._d[prop] = value;
        return true;
      },
      has(target, prop) {
        if (typeof prop === "symbol" || _PDICT_METHODS.has(prop) || prop in PDict.prototype) return true;
        return prop in target._d;
      },
      deleteProperty(target, prop) {
        delete target._d[prop];
        return true;
      },
      ownKeys(target) {
        return Object.keys(target._d);
      },
      getOwnPropertyDescriptor(target, prop) {
        if (prop in target._d) {
          return { value: target._d[prop], writable: true, enumerable: true, configurable: true };
        }
        return undefined;
      },
    });
  }
  get(k, d = null) { return (k in this._d) ? this._d[k] : d; }
  set(k, v) { this._d[k] = v; return v; }
  has(k) { return k in this._d; }
  pop(k, d = null) {
    const v = (k in this._d) ? this._d[k] : d;
    delete this._d[k];
    return v;
  }
  setdefault(k, d = null) { if (!(k in this._d)) this._d[k] = d; return this._d[k]; }
  clear() { this._d = {}; }
  keys() { return Object.keys(this._d); }
  values() { return Object.values(this._d); }
  items() { return Object.entries(this._d).map(([k, v]) => [k, v]); }
  get size() { return Object.keys(this._d).length; }
  raw() { return this._d; }
  toJSON() { return this._d; }
  [Symbol.iterator]() { return this._d[Symbol.iterator](); }
}

// In-memory per-user / global state store (PTB's user_data / bot_data)
export class DataStore {
  constructor() { this._users = new Map(); this.global = new PDict(); }
  user(uid) {
    if (!this._users.has(uid)) this._users.set(uid, new PDict());
    return this._users.get(uid);
  }
}

// ============================ Keyboard classes ============================

class _InlineKeyboardButton {
  constructor(text, opts = {}) {
    this.text = text;
    for (const [k, v] of Object.entries(opts)) if (v !== undefined) this[k] = v;
  }
}
export function InlineKeyboardButton(text, opts = {}) {
  return new _InlineKeyboardButton(text, opts);
}

class _InlineKeyboardMarkup {
  // PTB: InlineKeyboardMarkup([[InlineKeyboardButton(...), ...], ...])
  constructor(inline_keyboard) { this.inline_keyboard = inline_keyboard || []; }
}
export function InlineKeyboardMarkup(inline_keyboard) {
  return new _InlineKeyboardMarkup(inline_keyboard);
}

class _KeyboardButton {
  constructor(text, opts = {}) {
    this.text = text;
    for (const [k, v] of Object.entries(opts)) if (v !== undefined) this[k] = v;
  }
}
export function KeyboardButton(text, opts = {}) {
  return new _KeyboardButton(text, opts);
}

class _ReplyKeyboardMarkup {
  constructor(keyboard, opts = {}) {
    this.keyboard = keyboard || [];
    for (const [k, v] of Object.entries(opts)) if (v !== undefined) this[k] = v;
  }
}
export function ReplyKeyboardMarkup(keyboard, opts = {}) {
  return new _ReplyKeyboardMarkup(keyboard, opts);
}

class _CopyTextButton {
  constructor(text) { this.text = text; }
}
export function CopyTextButton(text) {
  return new _CopyTextButton(text);
}

class _InputMediaPhoto {
  constructor(media, opts = {}) {
    this.type = "photo";
    this.media = media;
    for (const [k, v] of Object.entries(opts)) if (v !== undefined) this[k] = v;
  }
}
export function InputMediaPhoto(media, opts = {}) {
  return new _InputMediaPhoto(media, opts);
}

class _InputMediaVideo {
  constructor(media, opts = {}) {
    this.type = "video";
    this.media = media;
    for (const [k, v] of Object.entries(opts)) if (v !== undefined) this[k] = v;
  }
}
export function InputMediaVideo(media, opts = {}) {
  return new _InputMediaVideo(media, opts);
}

export class BotCommand {
  constructor(command, description) { this.command = command; this.description = description; }
}

function serializeObj(o) {
  const out = {};
  for (const [k, v] of Object.entries(o)) {
    if (v === undefined) continue;
    if (k.startsWith("_")) continue;
    if (v instanceof _CopyTextButton) { out[k] = { text: v.text }; continue; }
    if (v instanceof _InputMediaPhoto || v instanceof _InputMediaVideo) { out[k] = serializeObj(v); continue; }
    if (k === "disable_web_page_preview" && v === true) { out.link_preview_options = { is_disabled: true }; continue; }
    out[k] = v;
  }
  return out;
}

function serializeButton(b) {
  if (b == null) return b;
  const validKeys = new Set(["text", "url", "callback_data", "web_app", "login_url", "switch_inline_query", "switch_inline_query_current_chat", "switch_inline_query_chosen_chat", "pay", "copy_text", "style", "request_users", "request_chat", "request_contact", "request_location", "request_poll"]);
  const out = {};
  for (const [k, v] of Object.entries(b)) {
    if (v === undefined) continue;
    if (k.startsWith("_")) continue;
    if (validKeys.has(k)) out[k] = v;
  }
  return out;
}

function serializeRow(row) {
  return (row || []).map(serializeButton);
}

export function serializeMarkup(mk) {
  if (mk == null) return undefined;
  if (mk instanceof _InlineKeyboardMarkup) return { inline_keyboard: (mk.inline_keyboard || []).map(serializeRow) };
  if (mk instanceof _ReplyKeyboardMarkup) {
    const o = { keyboard: (mk.keyboard || []).map(serializeRow) };
    for (const k of ["resize_keyboard", "one_time_keyboard", "selective", "is_persistent", "input_field_placeholder", "row_width"]) {
      if (mk[k] !== undefined) o[k] = mk[k];
    }
    return o;
  }
  // Already-plain markup (e.g. stored JSON keyboards) — pass through, but strip custom props from buttons.
  if (typeof mk === "object") {
    if (mk.inline_keyboard) {
      return { ...mk, inline_keyboard: mk.inline_keyboard.map(serializeRow) };
    }
    return mk;
  }
  return undefined;
}

export function serializeMedia(m) {
  if (m == null) return undefined;
  if (m instanceof _InputMediaPhoto || m instanceof _InputMediaVideo) return serializeObj(m);
  return m;
}

// ============================ Message wrapper ============================

export class M {
  constructor(raw, api) {
    if (!raw) { this._raw = null; return; }
    this._raw = raw;
    this._api = api;
    this.message_id = raw.message_id;
    this.date = raw.date;
    this.text = raw.text;
    this.caption = raw.caption;
    this.chat = raw.chat;                       // raw Telegram Chat (id, title, username, type)
    this.from_user = raw.from;                  // raw Telegram User (id, first_name, username, ...)
    this.photo = raw.photo;
    this.video = raw.video;
    this.document = raw.document;
    this.animation = raw.animation;
    this.audio = raw.audio;
    this.voice = raw.voice;
    this.sticker = raw.sticker;
    this.contact = raw.contact;
    this.location = raw.location;
    this.media_group_id = raw.media_group_id;
    this.forward_from = raw.forward_from;
    this.forward_from_chat = raw.forward_from_chat;
    this.forward_origin = raw.forward_origin;
    this.forward_date = raw.forward_date;
    this.reply_to_message = raw.reply_to_message ? new M(raw.reply_to_message, api) : null;
    this.entities = raw.entities;
    this.caption_entities = raw.caption_entities;
    this.web_app_data = raw.web_app_data;
  }

  get _chat_id() { return this._raw?.chat?.id; }
  get exists() { return !!this._raw; }
  get content_type() {
    if (this.text != null) return "text";
    if (this.photo) return "photo";
    if (this.video) return "video";
    if (this.document) return "document";
    if (this.animation) return "animation";
    if (this.audio) return "audio";
    if (this.voice) return "voice";
    return "unknown";
  }

  _norm(opts = {}) {
    const o = {};
    for (const [k, v] of Object.entries(opts)) {
      if (v === undefined) continue;
      if (k === "reply_markup") { o.reply_markup = serializeMarkup(v); continue; }
      if (k === "disable_web_page_preview" && v === true) { o.link_preview_options = { is_disabled: true }; continue; }
      o[k] = v;
    }
    return o;
  }

  async reply_text(text, opts = {}) {
    const res = await this._api.sendMessage(this._chat_id, text, this._norm(opts));
    return new M(res, this._api);
  }
  async reply_photo(photo, opts = {}) {
    if (photo && typeof photo === "object" && photo.photo !== undefined) {
      opts = { ...photo, ...opts };
      delete opts.photo;
      photo = photo.photo;
    }
    const res = await this._api.sendPhoto(this._chat_id, photo, this._norm(opts));
    return new M(res, this._api);
  }
  async reply_video(video, opts = {}) {
    if (video && typeof video === "object" && video.video !== undefined) {
      opts = { ...video, ...opts };
      delete opts.video;
      video = video.video;
    }
    const res = await this._api.sendVideo(this._chat_id, video, this._norm(opts));
    return new M(res, this._api);
  }
  async reply_animation(animation, opts = {}) {
    if (animation && typeof animation === "object" && animation.animation !== undefined) {
      opts = { ...animation, ...opts };
      delete opts.animation;
      animation = animation.animation;
    }
    const res = await this._api.sendAnimation(this._chat_id, animation, this._norm(opts));
    return new M(res, this._api);
  }
  async reply_audio(audio, opts = {}) {
    if (audio && typeof audio === "object" && audio.audio !== undefined) {
      opts = { ...audio, ...opts };
      delete opts.audio;
      audio = audio.audio;
    }
    const res = await this._api.sendAudio(this._chat_id, audio, this._norm(opts));
    return new M(res, this._api);
  }
  async reply_voice(voice, opts = {}) {
    if (voice && typeof voice === "object" && voice.voice !== undefined) {
      opts = { ...voice, ...opts };
      delete opts.voice;
      voice = voice.voice;
    }
    const res = await this._api.sendVoice(this._chat_id, voice, this._norm(opts));
    return new M(res, this._api);
  }
  async reply_document(document, opts = {}) {
    if (document && typeof document === "object" && document.document !== undefined) {
      opts = { ...document, ...opts };
      delete opts.document;
      document = document.document;
    }
    const res = await this._api.sendDocument(this._chat_id, document, this._norm(opts));
    return new M(res, this._api);
  }
  async reply_media_group(media, opts = {}) {
    return this._api.sendMediaGroup(this._chat_id, media.map(serializeMedia), this._norm(opts));
  }
  async reply_copy(from_chat_id, message_id, opts = {}) {
    return this._api.copyMessage(this._chat_id, from_chat_id, message_id, this._norm(opts));
  }
  async edit_text(text, opts = {}) {
    const res = await this._api.editMessageText(this._chat_id, this.message_id, text, this._norm(opts));
    return res ? new M(res, this._api) : true;
  }
  async edit_reply_markup(opts = {}) {
    return this._api.editMessageReplyMarkup(this._chat_id, this.message_id, this._norm(opts));
  }
  async edit_media(media, opts = {}) {
    return this._api.editMessageMedia(this._chat_id, this.message_id, serializeMedia(media), this._norm(opts));
  }
  async edit_caption(caption, opts = {}) {
    const res = await this._api.editMessageCaption(this._chat_id, this.message_id, this._norm({ ...opts, caption }));
    return res ? new M(res, this._api) : true;
  }
  async delete() {
    return this._api.deleteMessage(this._chat_id, this.message_id);
  }
  async forward(chat_id, opts = {}) {
    const res = await this._api.forwardMessage(chat_id, this._chat_id, this.message_id, this._norm(opts));
    return new M(res, this._api);
  }
  async copy(chat_id, opts = {}) {
    return this._api.copyMessage(chat_id, this._chat_id, this.message_id, this._norm(opts));
  }
  async pin(opts = {}) { return this._api.pinChatMessage(this._chat_id, this.message_id, this._norm(opts)); }
  async unpin() { return this._api.unpinChatMessage(this._chat_id, this.message_id); }
}

// ============================ CallbackQuery wrapper ============================

export class Q {
  constructor(cq, ctx) {
    if (!cq) { this._raw = null; return; }
    this._raw = cq;
    this._ctx = ctx;
    this.id = cq.id;
    this.data = cq.data;
    this.from_user = cq.from;
    this.chat_instance = cq.chat_instance;
  }
  get exists() { return !!this._raw; }
  get message() {
    return this._raw?.message ? new M(this._raw.message, this._ctx.api) : null;
  }
  _norm(opts = {}) {
    const o = {};
    for (const [k, v] of Object.entries(opts)) {
      if (v === undefined) continue;
      if (k === "reply_markup") { o.reply_markup = serializeMarkup(v); continue; }
      if (k === "disable_web_page_preview" && v === true) { o.link_preview_options = { is_disabled: true }; continue; }
      o[k] = v;
    }
    return o;
  }
  // PTB: await query.answer()  |  await query.answer("msg", show_alert=True)
  async answer(text = null, opts = {}) {
    const showAlert = (typeof opts === "boolean") ? opts : !!opts.show_alert;
    const payload = {};
    if (text != null) payload.text = String(text);
    if (showAlert) payload.show_alert = true;
    try {
      return await this._ctx.answerCallbackQuery(payload);
    } catch (e) {
      // Query may be too old — PTB swallows this in practice; keep behavior identical.
      return undefined;
    }
  }
  async edit_message_text(text, opts = {}) {
    return this._ctx.editMessageText(text, this._norm(opts));
  }
  async edit_message_reply_markup(opts = {}) {
    return this._ctx.editMessageReplyMarkup(this._norm(opts));
  }
  async edit_message_caption(caption, opts = {}) {
    return this._ctx.editMessageCaption(this._norm({ ...opts, caption }));
  }
  async edit_message_media(media, opts = {}) {
    return this._ctx.editMessageMedia(serializeMedia(media), this._norm(opts));
  }
}

// ============================ Update wrapper ============================

export class U {
  constructor(ctx) {
    this._ctx = ctx;
    this.update_id = ctx.update?.update_id ?? 0;
    this.message = ctx.message ? new M(ctx.message, ctx.api) : null;
    this.callback_query = ctx.callbackQuery ? new Q(ctx.callbackQuery, ctx) : null;
  }
  get effective_user() { return this._ctx.from || null; }
  get effective_chat() { return this._ctx.chat || null; }
  get effective_message() {
    if (this.message) return this.message;
    if (this.callback_query) return this.callback_query.message;
    return null;
  }
}

// ============================ Bot API wrapper ============================

// Drop positional routing keys when a transpiled kwargs object doubles as opts.
function _stripRouting(o) {
  const out = { ...o };
  for (const k of ["chat_id", "message_id", "from_chat_id", "user_id", "invite_link", "photo", "video", "document", "animation", "audio", "voice"]) delete out[k];
  return out;
}

export class BotApi {
  constructor(api) { this._api = api; }
  _norm(opts = {}) {
    const o = {};
    for (const [k, v] of Object.entries(opts)) {
      if (v === undefined) continue;
      if (k === "reply_markup") { o.reply_markup = serializeMarkup(v); continue; }
      if (k === "disable_web_page_preview" && v === true) { o.link_preview_options = { is_disabled: true }; continue; }
      o[k] = v;
    }
    return o;
  }
  _wrapMsg(res) { return res ? new M(res, this._api) : res; }

  async get_me() { return this._api.getMe(); }
  async send_message(chat_id, text, opts = {}) {
    // Audit fix — transpiled kwargs-object call: send_message({ chat_id, text, ... })
    if (chat_id && typeof chat_id === "object" && !Array.isArray(chat_id)) {
      const o = chat_id;
      opts = { ...o }; delete opts.chat_id; delete opts.text;
      text = (o.text === undefined || o.text === null) ? "" : o.text;
      chat_id = o.chat_id;
    }
    return this._wrapMsg(await this._api.sendMessage(chat_id, text, this._norm(opts)));
  }
  async send_photo(chat_id_or_opts, photo, opts = {}) {
    if (typeof chat_id_or_opts === "object" && chat_id_or_opts !== null && chat_id_or_opts.chat_id !== undefined) {
      const o = chat_id_or_opts;
      return this._wrapMsg(await this._api.sendPhoto(o.chat_id, o.photo, this._norm({ caption: o.caption, parse_mode: o.parse_mode, reply_markup: o.reply_markup })));
    }
    return this._wrapMsg(await this._api.sendPhoto(chat_id_or_opts, photo, this._norm(opts)));
  }
  async send_video(chat_id_or_opts, video, opts = {}) {
    if (typeof chat_id_or_opts === "object" && chat_id_or_opts !== null && chat_id_or_opts.chat_id !== undefined) {
      const o = chat_id_or_opts;
      return this._wrapMsg(await this._api.sendVideo(o.chat_id, o.video, this._norm({ caption: o.caption, parse_mode: o.parse_mode, reply_markup: o.reply_markup })));
    }
    return this._wrapMsg(await this._api.sendVideo(chat_id_or_opts, video, this._norm(opts)));
  }
  async send_animation(chat_id_or_opts, animation, opts = {}) {
    if (typeof chat_id_or_opts === "object" && chat_id_or_opts !== null && chat_id_or_opts.chat_id !== undefined) {
      const o = chat_id_or_opts;
      return this._wrapMsg(await this._api.sendAnimation(o.chat_id, o.animation, this._norm({ caption: o.caption, parse_mode: o.parse_mode, reply_markup: o.reply_markup })));
    }
    return this._wrapMsg(await this._api.sendAnimation(chat_id_or_opts, animation, this._norm(opts)));
  }
  async send_audio(chat_id_or_opts, audio, opts = {}) {
    if (typeof chat_id_or_opts === "object" && chat_id_or_opts !== null && chat_id_or_opts.chat_id !== undefined) {
      const o = chat_id_or_opts;
      return this._wrapMsg(await this._api.sendAudio(o.chat_id, o.audio, this._norm({ caption: o.caption, parse_mode: o.parse_mode, reply_markup: o.reply_markup })));
    }
    return this._wrapMsg(await this._api.sendAudio(chat_id_or_opts, audio, this._norm(opts)));
  }
  async send_voice(chat_id_or_opts, voice, opts = {}) {
    if (typeof chat_id_or_opts === "object" && chat_id_or_opts !== null && chat_id_or_opts.chat_id !== undefined) {
      const o = chat_id_or_opts;
      return this._wrapMsg(await this._api.sendVoice(o.chat_id, o.voice, this._norm({ caption: o.caption, parse_mode: o.parse_mode, reply_markup: o.reply_markup })));
    }
    return this._wrapMsg(await this._api.sendVoice(chat_id_or_opts, voice, this._norm(opts)));
  }
  async send_document(chat_id_or_opts, document, opts = {}) {
    if (typeof chat_id_or_opts === "object" && chat_id_or_opts !== null && chat_id_or_opts.chat_id !== undefined) {
      const o = chat_id_or_opts;
      return this._wrapMsg(await this._api.sendDocument(o.chat_id, o.document, this._norm({ caption: o.caption, parse_mode: o.parse_mode, reply_markup: o.reply_markup })));
    }
    return this._wrapMsg(await this._api.sendDocument(chat_id_or_opts, document, this._norm(opts)));
  }
  async send_media_group(chat_id, media, opts = {}) { return this._api.sendMediaGroup(chat_id, media.map(serializeMedia), this._norm(opts)); }
  async copy_message(chat_id, from_chat_id, message_id, opts = {}) {
    // Transpiled call: copy_message({ chat_id, from_chat_id, message_id, ... })
    if (chat_id && typeof chat_id === "object" && !Array.isArray(chat_id)) {
      const o = _stripRouting(chat_id); chat_id = chat_id.chat_id; from_chat_id = o.from_chat_id; message_id = o.message_id; opts = o;
    }
    return this._api.copyMessage(chat_id, from_chat_id, message_id, this._norm(opts));
  }
  async send_chat_action(chat_id, action) { return this._api.sendChatAction(chat_id, action); }
  async delete_message(chat_id, message_id) {
    // Transpiled call: delete_message({ chat_id, message_id })
    if (chat_id && typeof chat_id === "object" && !Array.isArray(chat_id)) { message_id = chat_id.message_id; chat_id = chat_id.chat_id; }
    return this._api.deleteMessage(chat_id, message_id);
  }
  async edit_message_text(text_or_chat_id, message_id_or_opts, text, opts = {}) {
    // Two call forms:
    //   positional: edit_message_text(chat_id, message_id, text, opts)
    //   transpiled: edit_message_text(text, { chat_id, message_id, parse_mode, reply_markup })
    if (typeof message_id_or_opts === "object" && message_id_or_opts !== null && !Array.isArray(message_id_or_opts)) {
      const o = message_id_or_opts;
      return this._api.editMessageText(o.chat_id, o.message_id, text_or_chat_id, this._norm(_stripRouting(o)));
    }
    return this._api.editMessageText(text_or_chat_id, message_id_or_opts, text, this._norm(opts));
  }
  async edit_message_reply_markup(chat_id, message_id, opts = {}) {
    // Transpiled call: edit_message_reply_markup({ chat_id, message_id, reply_markup })
    if (chat_id && typeof chat_id === "object" && !Array.isArray(chat_id)) {
      const o = chat_id; message_id = o.message_id; chat_id = o.chat_id; opts = _stripRouting(o);
    }
    return this._api.editMessageReplyMarkup(chat_id, message_id, this._norm(opts));
  }
  async get_chat(chat_id) { return this._api.getChat(chat_id); }
  async get_chat_member(chat_id, user_id) {
    // Transpiled call: get_chat_member({ chat_id, user_id })
    if (chat_id && typeof chat_id === "object" && !Array.isArray(chat_id)) { user_id = chat_id.user_id; chat_id = chat_id.chat_id; }
    return this._api.getChatMember(chat_id, user_id);
  }
  async get_chat_member_count(chat_id) { return this._api.getChatMemberCount(chat_id); }
  async ban_chat_member(chat_id, user_id, opts = {}) { return this._api.banChatMember(chat_id, user_id, this._norm(opts)); }
  async unban_chat_member(chat_id, user_id, opts = {}) { return this._api.unbanChatMember(chat_id, user_id, this._norm(opts)); }
  async create_chat_invite_link(chat_id, opts = {}) {
    // Transpiled call: create_chat_invite_link({ chat_id, member_limit, name })
    if (chat_id && typeof chat_id === "object" && !Array.isArray(chat_id)) { opts = _stripRouting(chat_id); chat_id = chat_id.chat_id; }
    return this._api.createChatInviteLink(chat_id, this._norm(opts));
  }
  async revoke_chat_invite_link(chat_id, invite_link) {
    // Transpiled call: revoke_chat_invite_link({ chat_id, invite_link })
    if (chat_id && typeof chat_id === "object" && !Array.isArray(chat_id)) { invite_link = chat_id.invite_link; chat_id = chat_id.chat_id; }
    return this._api.revokeChatInviteLink(chat_id, invite_link);
  }
  async set_my_description(opts = {}) { return this._api.setMyDescription(this._norm(opts)); }
  async set_my_commands(commands) { return this._api.setMyCommands(commands); }
  async set_chat_menu_button(opts = {}) { return this._api.setChatMenuButton(this._norm(opts)); }
}

// PTB MessageHandler filter: PHOTO | VIDEO | Document.ALL | TEXT | FORWARDED
export function matchesPtbMessageFilter(msg) {
  if (!msg) return false;
  return !!(
    msg.text != null ||
    msg.photo ||
    msg.video ||
    msg.document ||
    msg.animation ||
    msg.forward_origin ||
    msg.forward_from
  );
}
