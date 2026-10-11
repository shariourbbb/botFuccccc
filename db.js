// db.js — auto-transpiled from database.py by py2js. Ported 1:1 from the Python source.
import { ADMINS_DB, ADMIN_IDS, ADMIN_PERMISSIONS_DB, CART_DB, CATEGORIES_DB, CATEGORY_BUTTONS_PER_ROW, COUPONS_DB, COURSES_DB, EBOOKS_DB, EBOOK_CATEGORIES_DB, KEYBOARDS_DB, MIN_WITHDRAW_AMOUNT, ORDERS_DB, PAYMENTS_DB, SETTINGS_DB, SUBCATEGORY_BUTTONS_PER_ROW, USERS_DB, WITHDRAWALS_DB } from "./config.js";
import { pyAll, pyAny, pyAppend, pyContains, pyDel, pyDict, pyDiv, pyEnumerate, pyEq, pyExtend, pyFloat, pyGet, pyIndex, pyInsert, pyInt, pyIsDigit, pyIsInstance, pyItems, pyIter, pyJoin, pyKeys, pyLen, pyList, pyLower, pyMathCeil, pyMax, pyMin, pyNext, pyNow, pyPop, pyPrint, pyRange, pyReMatch, pyRemove, pyRepeat, pyReplace, pyRound, pySetNew, pySlice, pySort, pySorted, pySplit, pyStart, pyStr, pyStrip, pySub, pySum, pyT, pyTimestamp, pyUpdate, pyUpper, pyValues } from "./helpers.js";
import { pyJsonParse, pyReadFile, pyWriteFile, pyFileExists } from "./fileio.js";

// __kw helpers: accept Python-kwargs-object OR positional args (audit fix).
function __isPlainObj(v) { return !!v && typeof v === "object" && !Array.isArray(v) && !(v instanceof Set) && !(v instanceof Map); }
function __kw(o, keys) { if (__isPlainObj(o)) { for (const k of keys) { if (Object.prototype.hasOwnProperty.call(o, k)) return o; } } return null; }
function __kwVal(o, key, dflt) { if (__isPlainObj(o) && Object.prototype.hasOwnProperty.call(o, key)) return o[key]; return dflt; }


export let ADMIN_PERMISSION_DEFINITIONS = { course_manage: { name: "Course Manage", emoji: "📘" }, category_manage: { name: "Category Manage", emoji: "📁" }, orders: { name: "Orders", emoji: "📋" }, coupon: { name: "Coupon", emoji: "🎟" }, payment_settings: { name: "Payment Settings", emoji: "💳" }, user_manage: { name: "User", emoji: "👤" }, broadcast: { name: "Broadcast", emoji: "📢" }, admin_manage: { name: "Admin Manage", emoji: "👑" }, statistics: { name: "Statistics", emoji: "📊" }, bot_settings: { name: "Bot Settings", emoji: "⚙️" }, admin_permission: { name: "Admin Permission", emoji: "🔐" }, info_manage: { name: "Info Manage", emoji: "ℹ️" }, ebook_manage: { name: "E-Book Manage", emoji: "📖" } };
export class Database {
  constructor() {
      this.courses = this._load(COURSES_DB);
      this.users = this._load(USERS_DB);
      this.orders = this._load(ORDERS_DB);
      this.coupons = this._load(COUPONS_DB);
      this.cart = this._load(CART_DB);
      this.categories = this._load_categories(CATEGORIES_DB);
      this.ebook_categories = this._load_categories(EBOOK_CATEGORIES_DB);
      this.ebooks = this._load(EBOOKS_DB);
      this.withdrawals = this._load(WITHDRAWALS_DB);
      this.payments = this._load_payments(PAYMENTS_DB);
      this.admins = this._load_admins(ADMINS_DB);
      this.admin_permissions = this._load(ADMIN_PERMISSIONS_DB);
      this.keyboards = this._load_keyboards(KEYBOARDS_DB);
      this.settings = this._load_settings(SETTINGS_DB);
  }
  _load(filename) {
    let e, f;
      if (pyT(pyFileExists(filename))) {
            try {
                    f = pyReadFile(filename);
                    return (pyJsonParse(f));
            } catch (e) {
                    pyPrint(`Error loading ${pyStr(filename)}: ${pyStr(e)}`);
                    return ({  });
            }
      }
      return ({  });
  }
  _load_categories(filename) {
    let c, cats, defaults, e, f, migrated;
      if (pyT(pyFileExists(filename))) {
            try {
                    f = pyReadFile(filename);
                    cats = pyJsonParse(f);
                    if (pyT(pyIsInstance(cats, "dict"))) {
                              return (cats);
                    } else if (pyT((((__v0) => (pyT(__v0) ? (cats) : __v0))(pyIsInstance(cats, "list"))))) {
                              migrated = {  };
                              for (const c of pyIter(cats)) {
                                          migrated[c] = ["একাডেমিক (Academy)", "রিভিশন (Revision)", "স্পেশাল (Special)"];
                              }
                              this._save_raw(migrated, filename);
                              return (migrated);
                    }
            } catch (e) {
                    pyPrint(`Error loading ${pyStr(filename)}: ${pyStr(e)}`);
            }
      }
      defaults = {  };
      this._save_raw(defaults, filename);
      return (defaults);
  }
  _load_payments(filename) {
    let defaults, e, f, p;
      if (pyT(pyFileExists(filename))) {
            try {
                    f = pyReadFile(filename);
                    p = pyJsonParse(f);
                    if (pyT((((__v1) => (pyT(__v1) ? ((pyContains(p, "methods"))) : __v1))(pyIsInstance(p, "dict"))))) {
                              return (p);
                    }
            } catch (e) {
                    pyPrint(`Error loading ${pyStr(filename)}: ${pyStr(e)}`);
            }
      }
      defaults = { methods: { bkash: { name: "bKash", number: "01XXXXXXXXX", instruction: "Personal (Send Money)", status: "active" }, nagad: { name: "Nagad", number: "01XXXXXXXXX", instruction: "Personal (Send Money)", status: "active" }, rocket: { name: "Rocket", number: "01XXXXXXXXX", instruction: "Personal (Send Money)", status: "active" } }, note: "⚠️ টাকা পাঠানোর পর অবশ্যই এসএমএস থেকে TrxID কপি করে বটে সাবমিট করবেন। কোনো সমস্যা হলে সরাসরি এডমিনের সাথে যোগাযোগ করুন।" };
      this._save(defaults, filename);
      return (defaults);
  }
  _load_admins(filename) {
    let admins, aid, data, e, f, x;
      if (pyT(pyFileExists(filename))) {
            try {
                    f = pyReadFile(filename);
                    data = pyJsonParse(f);
                    if (pyT(pyIsInstance(data, "list"))) {
                              for (const aid of pyIter(ADMIN_IDS)) {
                                          if (pyT(((!pyContains(data, aid))))) {
                                                        pyAppend(data, aid);
                                          }
                              }
                              return (((() => { const __acc = []; for (const x of pyIter(data)) { if (!pyT(pyIsDigit(pyStr(x)))) continue; __acc.push(pyInt(x)); } return __acc; })()));
                    }
            } catch (e) {
                    pyPrint(`Error loading ${pyStr(filename)}: ${pyStr(e)}`);
            }
      }
      admins = pyList(ADMIN_IDS);
      this._save_raw(admins, filename);
      return (admins);
  }
  _save(data, filename) {
    let e;
      try {
            pyWriteFile(filename, data);
      } catch (e) {
            pyPrint(`Error saving ${pyStr(filename)}: ${pyStr(e)}`);
      }
  }
  _save_raw(data, filename) {
    let e;
      try {
            pyWriteFile(filename, data);
      } catch (e) {
            pyPrint(`Error saving ${pyStr(filename)}: ${pyStr(e)}`);
      }
  }
  save_all() {
      this._save(this.courses, COURSES_DB);
      this._save(this.users, USERS_DB);
      this._save(this.orders, ORDERS_DB);
      this._save(this.coupons, COUPONS_DB);
      this._save(this.cart, CART_DB);
      this._save_raw(this.categories, CATEGORIES_DB);
      this._save(this.ebooks, EBOOKS_DB);
      this._save(this.withdrawals, WITHDRAWALS_DB);
      this._save(this.payments, PAYMENTS_DB);
  }
  get_payment_methods(active_only) {
    { const _k = __kw(active_only, ["active_only"]); if (_k) active_only = _k.active_only; }
    if ((active_only === undefined) || __isPlainObj(active_only)) active_only = false;
    let item, key, methods_dict, result, val;
      methods_dict = pyGet(this.payments, "methods", {  });
      result = [];
      for (const [key, val] of pyIter(pyItems(methods_dict))) {
            if (pyT((((__v2) => (pyT(__v2) ? ((pyEq(pyGet(val, "status"), "inactive"))) : __v2))(active_only)))) {
                    continue;
            }
            item = pyDict(val);
            item["key"] = key;
            pyAppend(result, item);
      }
      return (result);
  }
  get_payment_method(key) {
    let clean_key, item, methods;
      clean_key = pyStrip(pyLower(key));
      methods = pyGet(this.payments, "methods", {  });
      if (pyT((pyContains(methods, clean_key)))) {
            item = pyDict(pySub(methods, clean_key));
            item["key"] = clean_key;
            return (item);
      }
      return (null);
  }
  update_payment_method(key, data) {
    let clean_key;
      clean_key = pyStrip(pyLower(key));
      if (pyT(((!pyContains(this.payments, "methods"))))) {
            this.payments["methods"] = {  };
      }
      if (pyT((pyContains(pySub(this.payments, "methods"), clean_key)))) {
            pyUpdate(pySub(pySub(this.payments, "methods"), clean_key), data);
      } else {
            pySub(this.payments, "methods")[clean_key] = data;
      }
      this._save(this.payments, PAYMENTS_DB);
  }
  add_payment_method(name, number, instruction) {
    { const _k = __kw(name, ["name", "number", "instruction"]); if (_k) { if ("name" in _k) name = _k.name; if ("number" in _k) number = _k.number; if ("instruction" in _k) instruction = _k.instruction; } }
    if ((instruction === undefined || instruction === null)) instruction = "Personal (Send Money)";
    let key;
      key = pyReplace(pyStrip(pyLower(name)), " ", "_");
      if (pyT(((!pyContains(this.payments, "methods"))))) {
            this.payments["methods"] = {  };
      }
      pySub(this.payments, "methods")[key] = { name: pyStrip(name), number: pyStrip(number), instruction: pyStrip(instruction), status: "active" };
      this._save(this.payments, PAYMENTS_DB);
  }
  delete_payment_method(key) {
    let clean_key;
      clean_key = pyStrip(pyLower(key));
      if (pyT((pyContains(pyGet(this.payments, "methods", {  }), clean_key)))) {
            pyDel(pySub(this.payments, "methods"), clean_key);
            this._save(this.payments, PAYMENTS_DB);
            return (true);
      }
      return (false);
  }
  toggle_payment_method_status(key) {
    let clean_key, cur, m, new_st;
      clean_key = pyStrip(pyLower(key));
      m = pyGet(pyGet(this.payments, "methods", {  }), clean_key);
      if (pyT(m)) {
            cur = pyGet(m, "status", "active");
            new_st = (pyT((pyEq(cur, "active"))) ? ("inactive") : ("active"));
            m["status"] = new_st;
            this._save(this.payments, PAYMENTS_DB);
            return (new_st);
      }
      return ("inactive");
  }
  get_payment_note() {
      return (pyGet(this.payments, "note", "⚠️ টাকা পাঠানোর পর অবশ্যই এসএমএস থেকে TrxID কপি করে বটে সাবমিট করবেন।"));
  }
  set_payment_note(note) {
      this.payments["note"] = pyStrip(note);
      this._save(this.payments, PAYMENTS_DB);
  }
  is_referral_enabled() {
      return (this.get_setting("referral_system_enabled", true));
  }
  toggle_referral_system() {
    let current, new_val;
      current = this.is_referral_enabled();
      new_val = (!pyT(current));
      this.set_setting("referral_system_enabled", new_val);
      return (new_val);
  }
  get_referral_reward_amount() {
      try {
            return (pyInt(this.get_setting("referral_bonus_amount", 50)));
      } catch (__e) {
            return (50);
      }
  }
  set_referral_reward_amount(amount) {
    let val;
      try {
            val = pyMax(0, pyInt(amount));
            this.set_setting("referral_bonus_amount", val);
            return (true);
      } catch (__e) {
            return (false);
      }
  }
  add_user(user_id, username, full_name, referrer_id) {
    if (__isPlainObj(referrer_id)) referrer_id = __kwVal(referrer_id, "referrer_id", null);
    if ((username === undefined)) username = ""; if ((full_name === undefined)) full_name = "";
    if ((referrer_id === undefined)) referrer_id = null;
    let already_in, is_new, r_item, ref_uid, uid, updated, valid_referrer;
      uid = pyStr(user_id);
      is_new = false;
      valid_referrer = null;
      if (pyT(((!pyContains(this.users, uid))))) {
            is_new = true;
            if (pyT((((__v5) => (pyT(__v5) ? (((__v4) => (pyT(__v4) ? (((__v3) => (pyT(__v3) ? (this.is_referral_enabled()) : __v3))(((!pyEq(referrer_id, user_id))))) : __v4))((pyContains(this.users, pyStr(referrer_id))))) : __v5))(referrer_id)))) {
                    valid_referrer = referrer_id;
                    ref_uid = pyStr(referrer_id);
                    if (pyT(((!pyContains(pySub(this.users, ref_uid), "referred_users"))))) {
                              pySub(this.users, ref_uid)["referred_users"] = [];
                    }
                    already_in = false;
                    for (const r_item of pyIter(pySub(pySub(this.users, ref_uid), "referred_users"))) {
                              if (pyT((((__v6) => (pyT(__v6) ? ((pyEq(pyGet(r_item, "user_id"), user_id))) : __v6))(pyIsInstance(r_item, "dict"))))) {
                                          already_in = true;
                                          break;
                              } else if (pyT((((__v7) => (pyT(__v7) ? ((pyEq(r_item, user_id))) : __v7))(pyIsInstance(r_item, "int"))))) {
                                          already_in = true;
                                          break;
                              }
                    }
                    if (pyT((!pyT(already_in)))) {
                              pyAppend(pySub(pySub(this.users, ref_uid), "referred_users"), { user_id: user_id, username: (((__v8) => (pyT(__v8) ? __v8 : ("")))(username)), full_name: (((__v9) => (pyT(__v9) ? __v9 : ("")))(full_name)), joined_date: pyStr(pyNow()), converted: false });
                    }
            }
            this.users[uid] = { user_id: user_id, username: (((__v10) => (pyT(__v10) ? __v10 : ("")))(username)), full_name: (((__v11) => (pyT(__v11) ? __v11 : ("")))(full_name)), purchased_courses: [], purchased_ebooks: [], balance: 0, earnings_enabled: false, banned: false, ban_reason: "", earnings_history: [], referral_count: 0, referred_users: [], referred_by: valid_referrer, referral_reward_claimed: false, joined_date: pyStr(pyNow()) };
            this._save(this.users, USERS_DB);
            return ([is_new, valid_referrer]);
      } else {
            updated = false;
            if (pyT((((__v12) => (pyT(__v12) ? (((!pyEq(pyGet(pySub(this.users, uid), "username"), username)))) : __v12))(username)))) {
                    pySub(this.users, uid)["username"] = username;
                    updated = true;
            }
            if (pyT((((__v13) => (pyT(__v13) ? (((!pyEq(pyGet(pySub(this.users, uid), "full_name"), full_name)))) : __v13))(full_name)))) {
                    pySub(this.users, uid)["full_name"] = full_name;
                    updated = true;
            }
            if (pyT(((!pyContains(pySub(this.users, uid), "purchased_ebooks"))))) {
                    pySub(this.users, uid)["purchased_ebooks"] = [];
                    updated = true;
            }
            if (pyT(((!pyContains(pySub(this.users, uid), "earnings_enabled"))))) {
                    pySub(this.users, uid)["earnings_enabled"] = false;
                    updated = true;
            }
            if (pyT(((!pyContains(pySub(this.users, uid), "banned"))))) {
                    pySub(this.users, uid)["banned"] = false;
                    updated = true;
            }
            if (pyT(((!pyContains(pySub(this.users, uid), "ban_reason"))))) {
                    pySub(this.users, uid)["ban_reason"] = "";
                    updated = true;
            }
            if (pyT(((!pyContains(pySub(this.users, uid), "earnings_history"))))) {
                    pySub(this.users, uid)["earnings_history"] = [];
                    updated = true;
            }
            if (pyT(((!pyContains(pySub(this.users, uid), "referral_count"))))) {
                    pySub(this.users, uid)["referral_count"] = 0;
                    updated = true;
            }
            if (pyT(((!pyContains(pySub(this.users, uid), "referred_users"))))) {
                    pySub(this.users, uid)["referred_users"] = [];
                    updated = true;
            }
            if (pyT(((!pyContains(pySub(this.users, uid), "referral_reward_claimed"))))) {
                    pySub(this.users, uid)["referral_reward_claimed"] = false;
                    updated = true;
            }
            if (pyT(updated)) {
                    this._save(this.users, USERS_DB);
            }
            return ([false, null]);
      }
  }
  process_paid_referral_conversion(buyer_id, order_id, course_name) {
    if ((order_id === undefined)) order_id = "N/A"; if ((course_name === undefined)) course_name = "";
    // Transpiled call: process_paid_referral_conversion({ buyer_id, order_id, course_name })
    if (buyer_id && typeof buyer_id === "object" && !Array.isArray(buyer_id)) {
      const o = buyer_id; course_name = o.course_name; order_id = o.order_id; buyer_id = o.buyer_id;
    }
    let buyer, found, item, order, ref_list, ref_uid, referrer, referrer_id;
    let reward_amount, uid, updated_list;
      uid = pyStr(buyer_id);
      if (pyT(((!pyContains(this.users, uid))))) {
            return ([false, null, 0, 0]);
      }
      order = this.get_order(order_id);
      if (pyT(order)) {
            try {
                    if (pyT(((pyInt(pyGet(order, "amount", 0)) <= 0)))) {
                              return ([false, null, 0, 0]);
                    }
            } catch (__e) {
            }
      }
      buyer = pySub(this.users, uid);
      referrer_id = pyGet(buyer, "referred_by");
      if (pyT((((__v14) => (pyT(__v14) ? __v14 : (pyGet(buyer, "referral_reward_claimed"))))((!pyT(referrer_id)))))) {
            return ([false, null, 0, 0]);
      }
      if (pyT((!pyT(this.is_referral_enabled())))) {
            return ([false, null, 0, 0]);
      }
      ref_uid = pyStr(referrer_id);
      if (pyT(((!pyContains(this.users, ref_uid))))) {
            return ([false, null, 0, 0]);
      }
      buyer["referral_reward_claimed"] = true;
      referrer = pySub(this.users, ref_uid);
      referrer["referral_count"] = (pyGet(referrer, "referral_count", 0) + 1);
      reward_amount = this.get_referral_reward_amount();
      ref_list = pyGet(referrer, "referred_users", []);
      updated_list = [];
      found = false;
      for (const item of pyIter(ref_list)) {
            if (pyT((((__v15) => (pyT(__v15) ? ((pyEq(pyGet(item, "user_id"), buyer_id))) : __v15))(pyIsInstance(item, "dict"))))) {
                    item["converted"] = true;
                    item["conversion_date"] = pyStr(pyNow());
                    item["course_name"] = course_name;
                    item["order_id"] = order_id;
                    pyAppend(updated_list, item);
                    found = true;
            } else if (pyT((((__v16) => (pyT(__v16) ? ((pyEq(item, buyer_id))) : __v16))(pyIsInstance(item, "int"))))) {
                    pyAppend(updated_list, { user_id: buyer_id, username: pyGet(buyer, "username", ""), full_name: pyGet(buyer, "full_name", ""), joined_date: pyGet(buyer, "joined_date", ""), converted: true, conversion_date: pyStr(pyNow()), course_name: course_name, order_id: order_id });
                    found = true;
            } else {
                    pyAppend(updated_list, item);
            }
      }
      if (pyT((!pyT(found)))) {
            pyAppend(updated_list, { user_id: buyer_id, username: pyGet(buyer, "username", ""), full_name: pyGet(buyer, "full_name", ""), joined_date: pyGet(buyer, "joined_date", ""), converted: true, conversion_date: pyStr(pyNow()), course_name: course_name, order_id: order_id });
      }
      referrer["balance"] = (pyGet(referrer, "balance", 0) + reward_amount);
      if (pyT(((!pyContains(referrer, "earnings_history"))))) {
            referrer["earnings_history"] = [];
      }
      pyAppend(pySub(referrer, "earnings_history"), { amount: reward_amount, coupon_code: "REFERRAL_BONUS", order_id: pyStr(order_id), date: pyStr(pyNow()) });
      this._save(this.users, USERS_DB);
      return ([true, referrer_id, reward_amount, pySub(referrer, "balance")]);
  }
  get_referral_global_stats() {
    let bal, ref_c, refs, total_balance, total_converted, total_joined, total_referrers, u;
    let uid, w_stats;
      total_referrers = 0;
      total_joined = 0;
      total_converted = 0;
      total_balance = 0;
      for (const [uid, u] of pyIter(pyItems(this.users))) {
            ref_c = pyGet(u, "referral_count", 0);
            bal = pyGet(u, "balance", 0);
            refs = pyGet(u, "referred_users", []);
            if (pyT((((__v18) => (pyT(__v18) ? __v18 : (((__v17) => (pyT(__v17) ? __v17 : (((pyLen(refs) > 0)))))(((bal > 0))))))(((ref_c > 0)))))) {
                    total_referrers += 1;
            }
            total_joined += pyLen(refs);
            total_converted += ref_c;
            total_balance += bal;
      }
      w_stats = this.get_withdrawal_stats();
      return ({ is_enabled: this.is_referral_enabled(), bonus_amount: this.get_referral_reward_amount(), total_referrers: total_referrers, total_joined: total_joined, total_converted: total_converted, total_balance: total_balance, total_paid_out: pyGet(w_stats, "approved_amount", 0), total_withdrawn: pyGet(w_stats, "approved_amount", 0) });
  }
  get_all_referrers_list() {
    let bal, ref_c, referrers, refs, u, u_copy, uid;
      referrers = [];
      for (const [uid, u] of pyIter(pyItems(this.users))) {
            ref_c = pyGet(u, "referral_count", 0);
            bal = pyGet(u, "balance", 0);
            refs = pyGet(u, "referred_users", []);
            if (pyT((((__v20) => (pyT(__v20) ? __v20 : (((__v19) => (pyT(__v19) ? __v19 : (((pyLen(refs) > 0)))))(((bal > 0))))))(((ref_c > 0)))))) {
                    u_copy = pyDict(u);
                    u_copy["user_id"] = pyInt(uid);
                    pyAppend(referrers, u_copy);
            }
      }
      pySort(referrers, ((x) => (pyStr(pyGet(x, "referral_count", 0)).padStart(12, "0") + "|" + pyStr(pyGet(x, "balance", 0)).padStart(15, "0") + "|" + pyStr(pyLen(pyGet(x, "referred_users", []))).padStart(12, "0"))), true);
      return (referrers);
  }
  get_paginated_referrers(page, per_page) {
    { const _k = __kw(page, ["page", "per_page"]); if (_k) { if ("page" in _k) page = _k.page; if ("per_page" in _k) per_page = _k.per_page; } }
    if ((page === undefined || page === null) || __isPlainObj(page)) page = 1;
    if ((per_page === undefined || per_page === null) || __isPlainObj(per_page)) per_page = 8;
    let all_refs, end_idx, start_idx, total, total_pages;
      all_refs = this.get_all_referrers_list();
      total = pyLen(all_refs);
      total_pages = pyMax(1, pyDiv(((total + per_page) - 1), per_page));
      start_idx = ((typeof (page - 1) === 'string' || Array.isArray((page - 1)) ? pyRepeat((page - 1), per_page) : ((page - 1) * per_page)));
      end_idx = (start_idx + per_page);
      return ([pySlice(all_refs, start_idx, end_idx, null), total_pages, total]);
  }
  search_referral_users(query) {
    let fname, matched, q, u, u_copy, uid, uname;
      q = pyLower(pyStrip(query));
      if (pyT((!pyT(q)))) {
            return ([]);
      }
      matched = [];
      for (const [uid, u] of pyIter(pyItems(this.users))) {
            uname = pyLower(pyStr(pyGet(u, "username", "")));
            fname = pyLower(pyStr(pyGet(u, "full_name", "")));
            if (pyT((((__v22) => (pyT(__v22) ? __v22 : (((__v21) => (pyT(__v21) ? __v21 : ((pyContains(fname, q)))))((pyContains(uname, q))))))((pyEq(q, pyStr(uid))))))) {
                    u_copy = pyDict(u);
                    u_copy["user_id"] = pyInt(uid);
                    pyAppend(matched, u_copy);
            }
      }
      return (matched);
  }
  get_user(user_id) {
      return (pyGet(this.users, pyStr(user_id)));
  }
  get_all_user_ids() {
    let uid;
      return (((() => { const __acc = []; for (const uid of pyIter(pyKeys(this.users))) { __acc.push(pyInt(uid)); } return __acc; })()));
  }
  update_user(user_id, data) {
    let uid;
      uid = pyStr(user_id);
      if (pyT((pyContains(this.users, uid)))) {
            pyUpdate(pySub(this.users, uid), data);
            this._save(this.users, USERS_DB);
      }
  }
  store_user_access_link(user_id, course_id, link) {
    let uid;
      uid = pyStr(user_id);
      if (pyT(((!pyContains(this.users, uid))))) {
            return;
      }
      if (pyT(((!pyContains(pySub(this.users, uid), "access_links"))))) {
            pySub(this.users, uid)["access_links"] = {  };
      }
      pySub(pySub(this.users, uid), "access_links")[course_id] = link;
      this._save(this.users, USERS_DB);
  }
  get_user_access_link(user_id, course_id) {
    let uid, user;
      uid = pyStr(user_id);
      user = pyGet(this.users, uid);
      if (pyT((!pyT(user)))) {
            return (null);
      }
      return (pyGet(pyGet(user, "access_links", {  }), course_id));
  }
  store_user_access_links(user_id, course_id, mapping) {
    let k, merged, prev, str, uid, v;
      uid = pyStr(user_id);
      if (pyT((((__v23) => (pyT(__v23) ? __v23 : ((!pyT(pyIsInstance(mapping, "dict"))))))(((!pyContains(this.users, uid))))))) {
            return;
      }
      if (pyT(((!pyContains(pySub(this.users, uid), "access_links"))))) {
            pySub(this.users, uid)["access_links"] = {  };
      }
      prev = pyGet(pySub(pySub(this.users, uid), "access_links"), course_id);
      merged = (pyT(pyIsInstance(prev, "dict")) ? (pyDict(prev)) : ({  }));
      for (const [k, v] of pyIter(pyItems(mapping))) {
            if (pyT(v)) {
                    merged[pyStr(k)] = pyStr(v);
            }
      }
      pySub(pySub(this.users, uid), "access_links")[course_id] = merged;
      this._save(this.users, USERS_DB);
  }
  get_user_access_links(user_id, course_id) {
    let uid, user, val;
      uid = pyStr(user_id);
      user = pyGet(this.users, uid);
      if (pyT((!pyT(user)))) {
            return ({  });
      }
      val = pyGet(pyGet(user, "access_links", {  }), course_id);
      return ((pyT(pyIsInstance(val, "dict")) ? (pyDict(val)) : ({  })));
  }
  get_course_group_list(course) {
    let g, gid, i, label, legacy, out, raw, x;
      out = [];
      if (pyT((!pyT(pyIsInstance(course, "dict"))))) {
            return (out);
      }
      raw = (((__v24) => (pyT(__v24) ? __v24 : ([])))(pyGet(course, "group_ids")));
      if (pyT(pyIsInstance(raw, "str"))) {
            raw = [raw];
      }
      for (const [i, g] of pyIter(pyEnumerate((pyT(pyIsInstance(raw, "list")) ? (raw) : ([]))))) {
            if (pyT(pyIsInstance(g, "dict"))) {
                    gid = pyStrip(pyStr(pyGet(g, "id", "")));
                    label = (((__v25) => (pyT(__v25) ? __v25 : (`Group ${pyStr((i + 1))}`)))(pyStrip(pyStr(pyGet(g, "label", "")))));
            } else {
                    gid = pyStrip(pyStr(g));
                    label = `Group ${pyStr((i + 1))}`;
            }
            if (pyT((((__v26) => (pyT(__v26) ? (pyAll(((() => { const __acc = []; for (const x of pyIter(out)) { __acc.push(((!pyEq(pySub(x, "id"), gid)))); } return __acc; })()))) : __v26))(gid)))) {
                    pyAppend(out, { label: label, id: gid });
            }
      }
      legacy = pyStrip(pyStr((((__v27) => (pyT(__v27) ? __v27 : ("")))(pyGet(course, "group_id", "")))));
      if (pyT((((__v28) => (pyT(__v28) ? (pyAll(((() => { const __acc = []; for (const x of pyIter(out)) { __acc.push(((!pyEq(pySub(x, "id"), legacy)))); } return __acc; })()))) : __v28))(legacy)))) {
            pyAppend(out, { label: (((__v29) => (pyT(__v29) ? __v29 : ("Main Group")))(pyGet(course, "group_label", ""))), id: legacy });
      }
      return (out);
  }
  is_user_authorized_for_chat(user_id, chat_id, invite_link) {
    let c, c_chats, c_link, chat_id_str, cid, clean_inv, course, flat;
    let g, order, orders, purchased_ids, stored_link, target_courses, uid, user;
    let user_links;
      if (pyT(this.is_admin(user_id))) {
            return (true);
      }
      uid = pyStr(user_id);
      user = pyGet(this.users, uid);
      if (pyT((!pyT(user)))) {
            return (false);
      }
      user_links = pyGet(user, "access_links", {  });
      if (pyT(invite_link)) {
            clean_inv = pyStrip(pyStr(invite_link));
            flat = [];
            for (const stored_link of pyIter(pyValues(user_links))) {
                    if (pyT(pyIsInstance(stored_link, "dict"))) {
                              pyExtend(flat, pyValues(stored_link));
                    } else {
                              pyAppend(flat, stored_link);
                    }
            }
            for (const stored_link of pyIter(flat)) {
                    if (pyT((((__v30) => (pyT(__v30) ? ((pyEq(pyStrip(pyStr(stored_link)), clean_inv))) : __v30))(stored_link)))) {
                              return (true);
                    }
            }
      }
      purchased_ids = pyGet(user, "purchased_courses", []);
      chat_id_str = pyStr(chat_id);
      for (const cid of pyIter(purchased_ids)) {
            course = this.get_course(cid);
            if (pyT((!pyT(course)))) {
                    continue;
            }
            c_chats = [pyStrip(pyStr((((__v32) => (pyT(__v32) ? __v32 : (((__v31) => (pyT(__v31) ? __v31 : ("")))(pyGet(course, "group_id")))))(pyGet(course, "chat_id")))))];
            c_chats += ((() => { const __acc = []; for (const g of pyIter(this.get_course_group_list(course))) { __acc.push(pyGet(g, "id", "")); } return __acc; })());
            if (pyT((((__v34) => (pyT(__v34) ? (pyAny(((() => { const __acc = []; for (const c of pyIter(c_chats)) { __acc.push((((__v33) => (pyT(__v33) ? ((pyEq(c, chat_id_str))) : __v33))(c))); } return __acc; })()))) : __v34))(chat_id_str)))) {
                    return (true);
            }
            c_link = pyStrip(pyStr(pyGet(course, "access_link", "")));
            if (pyT((((__v36) => (pyT(__v36) ? (((__v35) => (pyT(__v35) ? ((pyEq(invite_link, c_link))) : __v35))(c_link)) : __v36))(invite_link)))) {
                    return (true);
            }
            if (pyT((((__v37) => (pyT(__v37) ? ((pyContains(c_link, chat_id_str))) : __v37))(c_link)))) {
                    return (true);
            }
      }
      orders = this.get_user_orders(user_id);
      for (const order of pyIter(orders)) {
            if (pyT((pyEq(pyGet(order, "status"), "approved")))) {
                    target_courses = pyGet(order, "courses", []);
                    if (pyT((((__v38) => (pyT(__v38) ? (pyGet(order, "course_id")) : __v38))((!pyT(target_courses)))))) {
                              target_courses = [pySub(order, "course_id")];
                    }
                    for (const cid of pyIter(target_courses)) {
                              course = this.get_course(cid);
                              if (pyT(course)) {
                                          c_chats = [pyStrip(pyStr((((__v40) => (pyT(__v40) ? __v40 : (((__v39) => (pyT(__v39) ? __v39 : ("")))(pyGet(course, "group_id")))))(pyGet(course, "chat_id")))))];
                                          c_chats += ((() => { const __acc = []; for (const g of pyIter(this.get_course_group_list(course))) { __acc.push(pyGet(g, "id", "")); } return __acc; })());
                                          if (pyT((((__v42) => (pyT(__v42) ? (pyAny(((() => { const __acc = []; for (const c of pyIter(c_chats)) { __acc.push((((__v41) => (pyT(__v41) ? ((pyEq(c, chat_id_str))) : __v41))(c))); } return __acc; })()))) : __v42))(chat_id_str)))) {
                                                        return (true);
                                          }
                                          c_link = pyStrip(pyStr(pyGet(course, "access_link", "")));
                                          if (pyT((((__v44) => (pyT(__v44) ? (((__v43) => (pyT(__v43) ? ((pyEq(invite_link, c_link))) : __v43))(c_link)) : __v44))(invite_link)))) {
                                                        return (true);
                                          }
                              }
                    }
            }
      }
      return (false);
  }
  is_earnings_enabled(user_id) {
    let user;
      user = this.get_user(user_id);
      if (pyT(user)) {
            return (pyGet(user, "earnings_enabled", false));
      }
      return (false);
  }
  enable_user_earnings(user_id, enable) {
    { const _k = __kw(enable, ["enable"]); if (_k) enable = _k.enable; }
    if ((enable === undefined) || __isPlainObj(enable)) enable = true;
    let uid;
      uid = pyStr(user_id);
      if (pyT((pyContains(this.users, uid)))) {
            pySub(this.users, uid)["earnings_enabled"] = enable;
            this._save(this.users, USERS_DB);
      }
  }
  is_banned(user_id) {
    let user;
      user = this.get_user(user_id);
      if (pyT(user)) {
            return (pyT(pyGet(user, "banned", false)));
      }
      return (false);
  }
  ban_user(user_id, reason) {
    let uid;
      uid = pyStr(user_id);
      if (pyT((pyContains(this.users, uid)))) {
            pySub(this.users, uid)["banned"] = true;
            pySub(this.users, uid)["ban_reason"] = pyStr((((__v45) => (pyT(__v45) ? __v45 : ("")))(reason)));
            this._save(this.users, USERS_DB);
            return (true);
      }
      return (false);
  }
  unban_user(user_id) {
    let uid;
      uid = pyStr(user_id);
      if (pyT((pyContains(this.users, uid)))) {
            pySub(this.users, uid)["banned"] = false;
            pySub(this.users, uid)["ban_reason"] = "";
            this._save(this.users, USERS_DB);
            return (true);
      }
      return (false);
  }
  add_earning(user_id, amount, coupon_code, order_id) {
    let uid, user;
      uid = pyStr(user_id);
      if (pyT((pyContains(this.users, uid)))) {
            user = pySub(this.users, uid);
            user["balance"] = (pyGet(user, "balance", 0) + pyInt(amount));
            if (pyT(((!pyContains(user, "earnings_history"))))) {
                    user["earnings_history"] = [];
            }
            pyAppend(pySub(user, "earnings_history"), { amount: pyInt(amount), coupon_code: pyUpper(coupon_code), order_id: order_id, date: pyStr(pyNow()) });
            this._save(this.users, USERS_DB);
      }
  }
  get_earnings_history(user_id) {
    let hist, user;
      user = this.get_user(user_id);
      if (pyT(user)) {
            hist = pyGet(user, "earnings_history", []);
            return (pySorted(hist, ((x) => (pyGet(x, "date", ""))), true));
      }
      return ([]);
  }
  deduct_balance(user_id, amount) {
    let current, uid;
      uid = pyStr(user_id);
      if (pyT((pyContains(this.users, uid)))) {
            current = pyGet(pySub(this.users, uid), "balance", 0);
            if (pyT(((current >= amount)))) {
                    pySub(this.users, uid)["balance"] = (current - amount);
                    this._save(this.users, USERS_DB);
                    return (true);
            }
      }
      return (false);
  }
  update_balance(user_id, new_balance) {
    let uid;
      uid = pyStr(user_id);
      if (pyT((pyContains(this.users, uid)))) {
            pySub(this.users, uid)["balance"] = pyInt(new_balance);
            this._save(this.users, USERS_DB);
            return (true);
      }
      return (false);
  }
  refund_balance(user_id, amount) {
    let uid;
      uid = pyStr(user_id);
      if (pyT((pyContains(this.users, uid)))) {
            pySub(this.users, uid)["balance"] = (pyGet(pySub(this.users, uid), "balance", 0) + pyInt(amount));
            this._save(this.users, USERS_DB);
      }
  }
  add_balance(user_id, amount) {
      this.refund_balance(user_id, amount);
  }
  is_purchased(user_id, course_id) {
    let user;
      user = this.get_user(user_id);
      if (pyT(user)) {
            return ((pyContains(pyGet(user, "purchased_courses", []), course_id)));
      }
      return (false);
  }
  add_purchase(user_id, course_id) {
    let user;
      user = this.get_user(user_id);
      if (pyT(user)) {
            if (pyT(((!pyContains(user, "purchased_courses"))))) {
                    user["purchased_courses"] = [];
            }
            if (pyT(((!pyContains(pySub(user, "purchased_courses"), course_id))))) {
                    pyAppend(pySub(user, "purchased_courses"), course_id);
                    this._save(this.users, USERS_DB);
            }
      }
  }
  manual_revoke_course(user_id, course_id) {
    let user;
      user = this.get_user(user_id);
      if (pyT((((__v46) => (pyT(__v46) ? ((pyContains(user, "purchased_courses"))) : __v46))(user)))) {
            if (pyT((pyContains(pySub(user, "purchased_courses"), course_id)))) {
                    pyRemove(pySub(user, "purchased_courses"), course_id);
                    this._save(this.users, USERS_DB);
            }
      }
  }
  manual_revoke_ebook(user_id, ebook_id) {
    let user;
      user = this.get_user(user_id);
      if (pyT((((__v47) => (pyT(__v47) ? ((pyContains(user, "purchased_ebooks"))) : __v47))(user)))) {
            if (pyT((pyContains(pySub(user, "purchased_ebooks"), ebook_id)))) {
                    pyRemove(pySub(user, "purchased_ebooks"), ebook_id);
                    this._save(this.users, USERS_DB);
            }
      }
  }
  get_user_courses(user_id) {
    let c_copy, cid, course, purchased_ids, result, user;
      user = this.get_user(user_id);
      if (pyT((!pyT(user)))) {
            return ([]);
      }
      purchased_ids = pyGet(user, "purchased_courses", []);
      result = [];
      for (const cid of pyIter(purchased_ids)) {
            course = this.get_course(cid);
            if (pyT(course)) {
                    c_copy = pyDict(course);
                    c_copy["id"] = cid;
                    pyAppend(result, c_copy);
            }
      }
      return (result);
  }
  get_referral_stats(user_id) {
    let user;
      user = this.get_user(user_id);
      if (pyT((!pyT(user)))) {
            return ({ referral_count: 0, balance: 0, referred_users: [] });
      }
      return ({ referral_count: pyGet(user, "referral_count", 0), balance: pyGet(user, "balance", 0), referred_users: pyGet(user, "referred_users", []) });
  }
  get_paginated_users(page, per_page) {
    { const _k = __kw(page, ["page", "per_page"]); if (_k) { if ("page" in _k) page = _k.page; if ("per_page" in _k) per_page = _k.per_page; } }
    if ((page === undefined || page === null) || __isPlainObj(page)) page = 1;
    if ((per_page === undefined || per_page === null) || __isPlainObj(per_page)) per_page = 8;
    let all_users, end_idx, start_idx, total, total_pages;
      all_users = pyList(pyValues(this.users));
      pySort(all_users, ((u) => (pyGet(u, "joined_date", ""))), true);
      total = pyLen(all_users);
      total_pages = pyMax(1, pyDiv(((total + per_page) - 1), per_page));
      start_idx = ((typeof (page - 1) === 'string' || Array.isArray((page - 1)) ? pyRepeat((page - 1), per_page) : ((page - 1) * per_page)));
      end_idx = (start_idx + per_page);
      return ([pySlice(all_users, start_idx, end_idx, null), total_pages]);
  }
  search_users(query) {
    let fname, q, results, uid, uname, user;
      q = pyLower(pyStrip(query));
      if (pyT((!pyT(q)))) {
            return ([]);
      }
      results = [];
      for (const [uid, user] of pyIter(pyItems(this.users))) {
            uname = pyLower(pyStr(pyGet(user, "username", "")));
            fname = pyLower(pyStr(pyGet(user, "full_name", "")));
            if (pyT((((__v49) => (pyT(__v49) ? __v49 : (((__v48) => (pyT(__v48) ? __v48 : ((pyContains(fname, q)))))((pyContains(uname, q))))))((pyEq(q, uid)))))) {
                    pyAppend(results, user);
            }
      }
      return (results);
  }
  get_all_ebooks() {
      return (this.ebooks);
  }
  get_ebook(ebook_id) {
    let eb, eb_copy;
      eb = pyGet(this.ebooks, ebook_id);
      if (pyT(eb)) {
            eb_copy = pyDict(eb);
            eb_copy["id"] = ebook_id;
            return (eb_copy);
      }
      return (null);
  }
  add_ebook(ebook_id, data) {
      this.ebooks[ebook_id] = data;
      this._save(this.ebooks, EBOOKS_DB);
  }
  update_ebook(ebook_id, data) {
      if (pyT((pyContains(this.ebooks, ebook_id)))) {
            pyUpdate(pySub(this.ebooks, ebook_id), data);
            this._save(this.ebooks, EBOOKS_DB);
      }
  }
  delete_ebook(ebook_id) {
      if (pyT((pyContains(this.ebooks, ebook_id)))) {
            pyDel(this.ebooks, ebook_id);
            this._save(this.ebooks, EBOOKS_DB);
            return (true);
      }
      return (false);
  }
  is_ebook_purchased(user_id, ebook_id) {
    let user;
      user = this.get_user(user_id);
      if (pyT(user)) {
            return ((pyContains(pyGet(user, "purchased_ebooks", []), ebook_id)));
      }
      return (false);
  }
  has_user_ebook_access(user_id, ebook_id) {
    let eb;
      eb = this.get_ebook(ebook_id);
      if (pyT((!pyT(eb)))) {
            return (false);
      }
      if (pyT((pyEq(pyGet(eb, "price", 0), 0)))) {
            return (true);
      }
      return (this.is_ebook_purchased(user_id, ebook_id));
  }
  get_ebooks_by_category(category) {
    let e, eb, eb_cat, eid, result, target;
      result = [];
      for (const [eid, eb] of pyIter(pyItems(this.ebooks))) {
            if (pyT((pyEq(pyGet(eb, "status"), "inactive")))) {
                    continue;
            }
            eb_cat = pyLower(pyStrip(pyStr(pyGet(eb, "category", "General"))));
            if (pyT((((__v50) => (pyT(__v50) ? (((!pyEq(pyUpper(pyStrip(pyStr(category))), "ALL")))) : __v50))(category)))) {
                    target = pyLower(pyStrip(pyStr(category)));
                    if (pyT((((__v52) => (pyT(__v52) ? (((__v51) => (pyT(__v51) ? (((!pyContains(target, eb_cat)))) : __v51))(((!pyContains(eb_cat, target))))) : __v52))(((!pyEq(eb_cat, target))))))) {
                              continue;
                    }
            }
            e = pyDict(eb);
            e["id"] = eid;
            pyAppend(result, e);
      }
      return (result);
  }
  is_ebook_category_active(folder_path) {
    let clean_path, i, inactive_list, parent_sub, segments, x;
      clean_path = pyLower(pyReplace(pyReplace(pyStrip(pyStr(folder_path)), " / ", " > "), "/", " > "));
      if (pyT((!pyT(clean_path)))) {
            return (true);
      }
      inactive_list = ((() => { const __acc = []; for (const x of pyIter(this.get_setting("inactive_ebook_categories", []))) { __acc.push(pyLower(pyReplace(pyReplace(pyStrip(pyStr(x)), " / ", " > "), "/", " > "))); } return __acc; })());
      if (pyT((pyContains(inactive_list, clean_path)))) {
            return (false);
      }
      segments = pySplit(clean_path, " > ", -1);
      for (const i of pyIter(pyRange(1, (pyLen(segments) + 1)))) {
            parent_sub = pyJoin(" > ", pySlice(segments, null, i, null));
            if (pyT((pyContains(inactive_list, parent_sub)))) {
                    return (false);
            }
      }
      return (true);
  }
  toggle_ebook_category_status(folder_path) {
    let clean_lower, clean_path, inactive_map, raw_list, x;
      clean_path = pyReplace(pyReplace(pyStrip(pyStr(folder_path)), " / ", " > "), "/", " > ");
      if (pyT((!pyT(clean_path)))) {
            return (true);
      }
      clean_lower = pyLower(clean_path);
      raw_list = pyList(this.get_setting("inactive_ebook_categories", []));
      inactive_map = (() => { const __acc = []; for (const x of pyIter(raw_list)) { __acc.push([pyLower(pyReplace(pyReplace(pyStrip(pyStr(x)), " / ", " > "), "/", " > ")), pyStr(x)]); } const __o = {}; for (const [__k, __v] of __acc) __o[__k] = __v; return __o; })();
      if (pyT((pyContains(inactive_map, clean_lower)))) {
            raw_list = ((() => { const __acc = []; for (const x of pyIter(raw_list)) { if (!pyT(((!pyEq(pyLower(pyReplace(pyReplace(pyStrip(pyStr(x)), " / ", " > "), "/", " > ")), clean_lower))))) continue; __acc.push(x); } return __acc; })());
            this.set_setting("inactive_ebook_categories", raw_list);
            return (true);
      } else {
            pyAppend(raw_list, clean_path);
            this.set_setting("inactive_ebook_categories", raw_list);
            return (false);
      }
  }
  get_ebook_sub_folders(parent_path, include_inactive) {

    { const _k = __kw(parent_path, ["parent_path", "parent", "include_inactive"]); if (_k) { if ("parent_path" in _k) parent_path = _k.parent_path; else if ("parent" in _k) parent_path = _k.parent; if ("include_inactive" in _k) include_inactive = _k.include_inactive; } }
    if (__isPlainObj(include_inactive)) include_inactive = __kwVal(include_inactive, "include_inactive", true);
    if ((parent_path === undefined || parent_path === null) || __isPlainObj(parent_path)) parent_path = "";
    if ((include_inactive === undefined)) include_inactive = true;
    let clean_parent, items, k, s, sub_list, top_level;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      if (pyT((!pyT(pyIsInstance(this.ebook_categories, "dict"))))) {
            return ([]);
      }
      if (pyT((!pyT(clean_parent)))) {
            top_level = [];
            for (const k of pyIter(pyKeys(this.ebook_categories))) {
                    if (pyT(((!pyContains(k, " > "))))) {
                              if (pyT((((__v53) => (pyT(__v53) ? __v53 : (this.is_ebook_category_active(k))))(include_inactive)))) {
                                          pyAppend(top_level, k);
                              }
                    }
            }
            return (top_level);
      }
      for (const [k, sub_list] of pyIter(pyItems(this.ebook_categories))) {
            if (pyT((pyEq(pyLower(pyStrip(k)), pyLower(clean_parent))))) {
                    if (pyT(pyIsInstance(sub_list, "list"))) {
                              items = ((() => { const __acc = []; for (const s of pyIter(sub_list)) { if (!pyT(pyStrip(pyStr(s)))) continue; __acc.push(pyStrip(pyStr(s))); } return __acc; })());
                              if (pyT(include_inactive)) {
                                          return (items);
                              }
                              return (((() => { const __acc = []; for (const s of pyIter(items)) { if (!pyT(this.is_ebook_category_active(`${pyStr(clean_parent)} > ${pyStr(s)}`))) continue; __acc.push(s); } return __acc; })()));
                    }
                    return ([]);
            }
      }
      return ([]);
  }
  add_ebook_sub_folder(parent_path, folder_name) {
    let clean_name, clean_parent, existing_lower, found_key, k, new_full_path, s;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyStr(folder_name));
      if (pyT((!pyT(clean_name)))) {
            return (false);
      }
      if (pyT((!pyT(pyIsInstance(this.ebook_categories, "dict"))))) {
            this.ebook_categories = {  };
      }
      if (pyT((!pyT(clean_parent)))) {
            if (pyT(((!pyContains(this.ebook_categories, clean_name))))) {
                    this.ebook_categories[clean_name] = [];
                    this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
                    return (true);
            }
            return (false);
      }
      found_key = null;
      for (const k of pyIter(pyKeys(this.ebook_categories))) {
            if (pyT((pyEq(pyLower(pyStrip(k)), pyLower(clean_parent))))) {
                    found_key = k;
                    break;
            }
      }
      if (pyT((!pyT(found_key)))) {
            found_key = clean_parent;
            this.ebook_categories[found_key] = [];
      }
      if (pyT((!pyT(pyIsInstance(pySub(this.ebook_categories, found_key), "list"))))) {
            this.ebook_categories[found_key] = [];
      }
      existing_lower = ((() => { const __acc = []; for (const s of pyIter(pySub(this.ebook_categories, found_key))) { __acc.push(pyLower(pyStrip(s))); } return __acc; })());
      if (pyT((pyContains(existing_lower, pyLower(clean_name))))) {
            return (false);
      }
      pyAppend(pySub(this.ebook_categories, found_key), clean_name);
      new_full_path = `${pyStr(found_key)} > ${pyStr(clean_name)}`;
      if (pyT(((!pyContains(this.ebook_categories, new_full_path))))) {
            this.ebook_categories[new_full_path] = [];
      }
      this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
      return (true);
  }
  delete_ebook_sub_folder(parent_path, folder_name) {
    let clean_name, clean_parent, deleted, full_child_path, k, removed_paths, s, sub_list;
    let target_parent_key;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyStr(folder_name));
      if (pyT((!pyT(pyIsInstance(this.ebook_categories, "dict"))))) {
            return (false);
      }
      if (pyT((!pyT(clean_parent)))) {
            deleted = false;
            removed_paths = [clean_name];
            for (const k of pyIter(pyList(pyKeys(this.ebook_categories)))) {
                    if (pyT((((__v54) => (pyT(__v54) ? __v54 : (pyStart(pyLower(pyStrip(k)), (pyLower(clean_name) + " > ")))))((pyEq(pyLower(pyStrip(k)), pyLower(clean_name))))))) {
                              pyAppend(removed_paths, k);
                              pyDel(this.ebook_categories, k);
                              deleted = true;
                    }
            }
            if (pyT(deleted)) {
                    this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
                    this._remove_ebooks_in_paths(removed_paths);
            }
            return (deleted);
      }
      deleted = false;
      target_parent_key = null;
      for (const [k, sub_list] of pyIter(pyItems(this.ebook_categories))) {
            if (pyT((((__v55) => (pyT(__v55) ? (pyIsInstance(sub_list, "list")) : __v55))((pyEq(pyLower(pyStrip(k)), pyLower(clean_parent))))))) {
                    target_parent_key = k;
                    for (const s of pyIter(pyList(sub_list))) {
                              if (pyT((pyEq(pyLower(pyStrip(s)), pyLower(clean_name))))) {
                                          pyRemove(sub_list, s);
                                          deleted = true;
                              }
                    }
            }
      }
      full_child_path = pyLower(`${pyStr(clean_parent)} > ${pyStr(clean_name)}`);
      removed_paths = [`${pyStr(clean_parent)} > ${pyStr(clean_name)}`];
      for (const k of pyIter(pyList(pyKeys(this.ebook_categories)))) {
            if (pyT((((__v56) => (pyT(__v56) ? __v56 : (pyStart(pyLower(pyStrip(k)), (full_child_path + " > ")))))((pyEq(pyLower(pyStrip(k)), full_child_path)))))) {
                    pyAppend(removed_paths, k);
                    pyDel(this.ebook_categories, k);
                    deleted = true;
            }
      }
      if (pyT(deleted)) {
            this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
            this._remove_ebooks_in_paths(removed_paths);
      }
      return (deleted);
  }
  move_ebook_folder_order(parent_path, folder_name, direction) {
    let clean_name, clean_parent, idx, k, keys, new_cats, sub_list;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyStr(folder_name));
      if (pyT((!pyT(pyIsInstance(this.ebook_categories, "dict"))))) {
            return (false);
      }
      if (pyT((!pyT(clean_parent)))) {
            keys = pyList(pyKeys(this.ebook_categories));
            if (pyT(((!pyContains(keys, clean_name))))) {
                    return (false);
            }
            idx = pyIndex(keys, clean_name);
            if (pyT((((__v57) => (pyT(__v57) ? (((idx > 0))) : __v57))((pyEq(direction, "up")))))) {
                    const __un1 = ([pySub(keys, (idx - 1)), pySub(keys, idx)]); keys[idx] = __un1[0]; keys[(idx - 1)] = __un1[1];
            } else if (pyT((((__v58) => (pyT(__v58) ? (((idx < (pyLen(keys) - 1)))) : __v58))((pyEq(direction, "down")))))) {
                    const __un2 = ([pySub(keys, (idx + 1)), pySub(keys, idx)]); keys[idx] = __un2[0]; keys[(idx + 1)] = __un2[1];
            } else {
                    return (false);
            }
            new_cats = {  };
            for (const k of pyIter(keys)) {
                    new_cats[k] = pySub(this.ebook_categories, k);
            }
            this.ebook_categories = new_cats;
            this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
            return (true);
      }
      for (const [k, sub_list] of pyIter(pyItems(this.ebook_categories))) {
            if (pyT((((__v59) => (pyT(__v59) ? (pyIsInstance(sub_list, "list")) : __v59))((pyEq(pyLower(pyStrip(k)), pyLower(clean_parent))))))) {
                    if (pyT(((!pyContains(sub_list, clean_name))))) {
                              return (false);
                    }
                    idx = pyIndex(sub_list, clean_name);
                    if (pyT((((__v60) => (pyT(__v60) ? (((idx > 0))) : __v60))((pyEq(direction, "up")))))) {
                              const __un3 = ([pySub(sub_list, (idx - 1)), pySub(sub_list, idx)]); sub_list[idx] = __un3[0]; sub_list[(idx - 1)] = __un3[1];
                    } else if (pyT((((__v61) => (pyT(__v61) ? (((idx < (pyLen(sub_list) - 1)))) : __v61))((pyEq(direction, "down")))))) {
                              const __un4 = ([pySub(sub_list, (idx + 1)), pySub(sub_list, idx)]); sub_list[idx] = __un4[0]; sub_list[(idx + 1)] = __un4[1];
                    } else {
                              return (false);
                    }
                    this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
                    return (true);
            }
      }
      return (false);
  }
  move_ebook_folder_path(old_path, new_path) {
    let eb, eb_fld, eid, k, new_base, new_categories, new_parent_path, new_segments;
    let old_base, old_parent_path, old_segments, segs, sub_list, suffix, target_key, updated_fld;
    let v;
      old_path = pyReplace(pyReplace(pyStrip(old_path), " / ", " > "), "/", " > ");
      new_path = pyReplace(pyReplace(pyStrip(new_path), " / ", " > "), "/", " > ");
      if (pyT((((__v63) => (pyT(__v63) ? __v63 : (((__v62) => (pyT(__v62) ? __v62 : ((pyEq(old_path, new_path)))))((!pyT(new_path))))))((!pyT(old_path)))))) {
            return (false);
      }
      old_segments = pySplit(old_path, " > ", -1);
      old_parent_path = pyJoin(" > ", pySlice(old_segments, null, (-(1)), null));
      old_base = pySub(old_segments, (-(1)));
      new_segments = pySplit(new_path, " > ", -1);
      new_parent_path = pyJoin(" > ", pySlice(new_segments, null, (-(1)), null));
      new_base = pySub(new_segments, (-(1)));
      if (pyT((!pyT(old_parent_path)))) {
      } else {
            for (const [k, sub_list] of pyIter(pyList(pyItems(this.ebook_categories)))) {
                    if (pyT((((__v64) => (pyT(__v64) ? (pyIsInstance(sub_list, "list")) : __v64))((pyEq(pyLower(pyStrip(k)), pyLower(old_parent_path))))))) {
                              if (pyT((pyContains(sub_list, old_base)))) {
                                          pyRemove(sub_list, old_base);
                              }
                    }
            }
      }
      if (pyT((!pyT(new_parent_path)))) {
            if (pyT(((!pyContains(this.ebook_categories, new_base))))) {
                    this.ebook_categories[new_base] = [];
            }
      } else {
            target_key = null;
            for (const k of pyIter(pyKeys(this.ebook_categories))) {
                    if (pyT((pyEq(pyLower(pyStrip(k)), pyLower(new_parent_path))))) {
                              target_key = k;
                              break;
                    }
            }
            if (pyT((!pyT(target_key)))) {
                    target_key = new_parent_path;
                    this.ebook_categories[target_key] = [];
            }
            if (pyT((!pyT(pyIsInstance(pySub(this.ebook_categories, target_key), "list"))))) {
                    this.ebook_categories[target_key] = [];
            }
            if (pyT(((!pyContains(pySub(this.ebook_categories, target_key), new_base))))) {
                    pyAppend(pySub(this.ebook_categories, target_key), new_base);
            }
      }
      new_categories = {  };
      for (const [k, v] of pyIter(pyItems(this.ebook_categories))) {
            if (pyT((pyEq(k, old_path)))) {
                    new_categories[new_path] = v;
            } else if (pyT(pyStart(k, (old_path + " > ")))) {
                    suffix = pySlice(k, pyLen(old_path), null, null);
                    new_categories[(new_path + suffix)] = v;
            } else {
                    new_categories[k] = v;
            }
      }
      this.ebook_categories = new_categories;
      for (const [eid, eb] of pyIter(pyItems(this.ebooks))) {
            eb_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(eb, "folder_path", ""))), " / ", " > "), "/", " > ");
            if (pyT((pyEq(eb_fld, old_path)))) {
                    eb["folder_path"] = new_path;
                    segs = pySplit(new_path, " > ", -1);
                    eb["category"] = (pyT(((pyLen(segs) > 0))) ? (pySub(segs, 0)) : (""));
                    eb["subcategory"] = (pyT(((pyLen(segs) > 1))) ? (pySub(segs, 1)) : (""));
            } else if (pyT(pyStart(eb_fld, (old_path + " > ")))) {
                    suffix = pySlice(eb_fld, pyLen(old_path), null, null);
                    updated_fld = (new_path + suffix);
                    eb["folder_path"] = updated_fld;
                    segs = pySplit(updated_fld, " > ", -1);
                    eb["category"] = (pyT(((pyLen(segs) > 0))) ? (pySub(segs, 0)) : (""));
                    eb["subcategory"] = (pyT(((pyLen(segs) > 1))) ? (pySub(segs, 1)) : (""));
            }
      }
      this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
      this._save(this.ebooks, EBOOKS_DB);
      return (true);
  }
  move_ebook_folder_left(parent_path, folder_name) {
    let clean_name, clean_parent, new_full_path, new_parent_path, old_full_path, s, segments;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyStr(folder_name));
      if (pyT((!pyT(clean_parent)))) {
            return (false);
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(clean_parent, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      new_parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
      old_full_path = `${pyStr(clean_parent)} > ${pyStr(clean_name)}`;
      new_full_path = (pyT(new_parent_path) ? (`${pyStr(new_parent_path)} > ${pyStr(clean_name)}`) : (clean_name));
      return (this.move_ebook_folder_path(old_full_path, new_full_path));
  }
  move_ebook_folder_right(parent_path, folder_name, target_sibling) {
    let clean_name, clean_parent, clean_sibling, new_full_path, old_full_path;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyStr(folder_name));
      clean_sibling = pyStrip(pyStr(target_sibling));
      if (pyT((pyEq(clean_name, clean_sibling)))) {
            return (false);
      }
      old_full_path = (pyT(clean_parent) ? (`${pyStr(clean_parent)} > ${pyStr(clean_name)}`) : (clean_name));
      new_full_path = (pyT(clean_parent) ? (`${pyStr(clean_parent)} > ${pyStr(clean_sibling)} > ${pyStr(clean_name)}`) : (`${pyStr(clean_sibling)} > ${pyStr(clean_name)}`));
      return (this.move_ebook_folder_path(old_full_path, new_full_path));
  }
  _all_ebook_folder_paths() {
    let full, k, kk, paths, s, ss, v;
      paths = pySetNew();
      if (pyT((!pyT(pyIsInstance(this.ebook_categories, "dict"))))) {
            return (paths);
      }
      for (const [k, v] of pyIter(pyItems(this.ebook_categories))) {
            kk = pyStrip(pyStr(k));
            if (pyT(kk)) {
                    paths.add(kk);
            }
            if (pyT(pyIsInstance(v, "list"))) {
                    for (const s of pyIter(v)) {
                              ss = pyStrip(pyStr(s));
                              if (pyT((!pyT(ss)))) {
                                          continue;
                              }
                              full = (pyT(kk) ? (`${pyStr(kk)} > ${pyStr(ss)}`) : (ss));
                              paths.add(full);
                    }
            }
      }
      return (paths);
  }
  copy_ebook_folder(src_path, dest_parent_path) {
    let __for_else_1, dest_parent, dest_subs, eb, eb_fld, eid, idx, inactive;
    let ip, k, kk, n, new_base, new_eb, new_fld, new_id;
    let new_ip, new_path, norm, s, segs, src, src_base, stamp;
    let suffix, v, x;
      // import elided: time
      src = pyReplace(pyReplace(pyStrip(pyStr((((__v65) => (pyT(__v65) ? __v65 : ("")))(src_path)))), " / ", " > "), "/", " > ");
      dest_parent = pyReplace(pyReplace(pyStrip(pyStr((((__v66) => (pyT(__v66) ? __v66 : ("")))(dest_parent_path)))), " / ", " > "), "/", " > ");
      if (pyT((((__v67) => (pyT(__v67) ? __v67 : ((!pyT(pyIsInstance(this.ebook_categories, "dict"))))))((!pyT(src)))))) {
            return (null);
      }
      if (pyT((((__v68) => (pyT(__v68) ? __v68 : (pyStart(dest_parent, (src + " > ")))))((pyEq(dest_parent, src)))))) {
            return (null);
      }
      if (pyT(((!pyContains(this._all_ebook_folder_paths(), src))))) {
            return (null);
      }
      src_base = pyStrip(pySub(pySplit(src, " > ", -1), (-(1))));
      dest_subs = this.get_ebook_sub_folders(dest_parent, { include_inactive: true });
      new_base = src_base;
      if (pyT((pyContains(dest_subs, new_base)))) {
            new_base = `${pyStr(src_base)} (Copy)`;
            n = 2;
            while (pyT((pyContains(dest_subs, new_base)))) {
                    new_base = `${pyStr(src_base)} (Copy ${pyStr(n)})`;
                    n += 1;
            }
      }
      new_path = (pyT(dest_parent) ? (`${pyStr(dest_parent)} > ${pyStr(new_base)}`) : (new_base));
      for (const [k, v] of pyIter(pyList(pyItems(this.ebook_categories)))) {
            kk = pyStrip(pyStr(k));
            if (pyT((pyEq(kk, src)))) {
                    this.ebook_categories[new_path] = (pyT(pyIsInstance(v, "list")) ? (pyList(v)) : ([]));
            } else if (pyT(pyStart(kk, (src + " > ")))) {
                    suffix = pySlice(kk, pyLen(src), null, null);
                    this.ebook_categories[(new_path + suffix)] = (pyT(pyIsInstance(v, "list")) ? (pyList(v)) : ([]));
            }
      }
      if (pyT(((!pyContains(this.ebook_categories, new_path))))) {
            this.ebook_categories[new_path] = pyList(pyGet(this.ebook_categories, src, []));
      }
      if (pyT((!pyT(dest_parent)))) {
            if (pyT(((!pyContains(this.ebook_categories, new_base))))) {
                    this.ebook_categories[new_base] = [];
            }
      } else {
            __for_else_1 = false;
            for (const [k, v] of pyIter(pyItems(this.ebook_categories))) {
                    if (pyT((((__v69) => (pyT(__v69) ? (pyIsInstance(v, "list")) : __v69))((pyEq(pyLower(pyStrip(pyStr(k))), pyLower(dest_parent))))))) {
                              if (pyT(((!pyContains(v, new_base))))) {
                                          pyAppend(v, new_base);
                              }
                              __for_else_1 = true;
                              break;
                    }
            }
            if (pyT((!pyT(__for_else_1)))) {
                    this.ebook_categories[dest_parent] = [new_base];
            }
      }
      try {
            inactive = ((() => { const __acc = []; for (const x of pyIter(this.get_setting("inactive_ebook_categories", []))) { __acc.push(pyStr(x)); } return __acc; })());
            norm = ((() => { const __acc = []; for (const x of pyIter(inactive)) { __acc.push(pyReplace(pyReplace(pyStrip(pyStr(x)), " / ", " > "), "/", " > ")); } return __acc; })());
            for (const ip of pyIter(pyList(norm))) {
                    if (pyT((((__v70) => (pyT(__v70) ? __v70 : (pyStart(ip, (src + " > ")))))((pyEq(ip, src)))))) {
                              new_ip = (new_path + pySlice(ip, pyLen(src), null, null));
                              if (pyT(((!pyContains(norm, new_ip))))) {
                                          pyAppend(inactive, new_ip);
                              }
                    }
            }
            this.set_setting("inactive_ebook_categories", inactive);
      } catch (__e) {
      }
      stamp = pyInt(pyTimestamp());
      idx = 0;
      for (const [eid, eb] of pyIter(pyList(pyItems(this.ebooks)))) {
            eb_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(eb, "folder_path", ""))), " / ", " > "), "/", " > ");
            if (pyT((((__v71) => (pyT(__v71) ? __v71 : (pyStart(eb_fld, (src + " > ")))))((pyEq(eb_fld, src)))))) {
                    suffix = pySlice(eb_fld, pyLen(src), null, null);
                    new_fld = (new_path + suffix);
                    new_eb = pyDict(eb);
                    new_eb["folder_path"] = new_fld;
                    segs = ((() => { const __acc = []; for (const s of pyIter(pySplit(new_fld, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
                    new_eb["category"] = (pyT(segs) ? (pySub(segs, 0)) : (""));
                    new_eb["subcategory"] = (pyT(((pyLen(segs) > 1))) ? (pySub(segs, 1)) : (""));
                    new_id = `EBOOK-COPY-${pyStr(stamp)}-${pyStr(idx)}`;
                    idx += 1;
                    while (pyT((pyContains(this.ebooks, new_id)))) {
                              new_id = `EBOOK-COPY-${pyStr(stamp)}-${pyStr(idx)}`;
                              idx += 1;
                    }
                    new_eb["id"] = new_id;
                    this.ebooks[new_id] = new_eb;
            }
      }
      this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
      this._save(this.ebooks, EBOOKS_DB);
      return (new_path);
  }
  rename_ebook_folder(parent_path, old_name, new_name) {
    let ck, clean_new, clean_old, clean_parent, idx, k, new_cats, new_child_path;
    let new_ck, new_key, old_child_path, old_child_prefix, sub_list, v;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_old = pyStrip(pyStr(old_name));
      clean_new = pyStrip(pyStr(new_name));
      if (pyT((((__v72) => (pyT(__v72) ? __v72 : ((!pyT(clean_old)))))((!pyT(clean_new)))))) {
            return (false);
      }
      if (pyT((!pyT(pyIsInstance(this.ebook_categories, "dict"))))) {
            return (false);
      }
      if (pyT((!pyT(clean_parent)))) {
            if (pyT(((!pyContains(this.ebook_categories, clean_old))))) {
                    return (false);
            }
            if (pyT((pyContains(this.ebook_categories, clean_new)))) {
                    return (false);
            }
            new_cats = {  };
            for (const [k, v] of pyIter(pyItems(this.ebook_categories))) {
                    if (pyT((pyEq(k, clean_old)))) {
                              new_cats[clean_new] = v;
                    } else {
                              new_cats[k] = v;
                    }
            }
            old_child_prefix = `${pyStr(clean_old)} > `;
            for (const [k, v] of pyIter(pyList(pyItems(new_cats)))) {
                    if (pyT(pyStart(k, old_child_prefix))) {
                              new_key = (clean_new + pySlice(k, pyLen(old_child_prefix), null, null));
                              new_cats[new_key] = v;
                              pyDel(new_cats, k);
                    }
            }
            this.ebook_categories = new_cats;
            this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
            return (true);
      }
      for (const [k, sub_list] of pyIter(pyItems(this.ebook_categories))) {
            if (pyT((((__v73) => (pyT(__v73) ? (pyIsInstance(sub_list, "list")) : __v73))((pyEq(pyLower(pyStrip(k)), pyLower(clean_parent))))))) {
                    if (pyT(((!pyContains(sub_list, clean_old))))) {
                              return (false);
                    }
                    if (pyT((pyContains(sub_list, clean_new)))) {
                              return (false);
                    }
                    idx = pyIndex(sub_list, clean_old);
                    sub_list[idx] = clean_new;
                    old_child_path = `${pyStr(clean_parent)} > ${pyStr(clean_old)}`;
                    new_child_path = `${pyStr(clean_parent)} > ${pyStr(clean_new)}`;
                    for (const ck of pyIter(pyList(pyKeys(this.ebook_categories)))) {
                              if (pyT((pyEq(ck, old_child_path)))) {
                                          this.ebook_categories[new_child_path] = pyPop(this.ebook_categories, ck);
                              } else if (pyT(pyStart(ck, (old_child_path + " > ")))) {
                                          new_ck = (new_child_path + pySlice(ck, pyLen(old_child_path), null, null));
                                          this.ebook_categories[new_ck] = pyPop(this.ebook_categories, ck);
                              }
                    }
                    this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
                    return (true);
            }
      }
      return (false);
  }
  get_ebooks_by_folder(folder_path, include_inactive) {

    { const _k = __kw(folder_path, ["folder_path", "path", "include_inactive"]); if (_k) { if ("folder_path" in _k) folder_path = _k.folder_path; else if ("path" in _k) folder_path = _k.path; if ("include_inactive" in _k) include_inactive = _k.include_inactive; } }
    if (__isPlainObj(include_inactive)) include_inactive = __kwVal(include_inactive, "include_inactive", false);
    if (__isPlainObj(folder_path)) folder_path = "";
    if ((include_inactive === undefined)) include_inactive = false;
    let clean_path, e, eb, eb_cat, eb_fld, eb_sub, eid, result;
    let s, seg, segments;
      clean_path = pyReplace(pyReplace(pyStrip(pyStr(folder_path)), " / ", " > "), "/", " > ");
      if (pyT((!pyT(clean_path)))) {
            return (((() => { const __acc = []; for (const [eid, eb] of pyIter(pyItems(this.ebooks))) { if (!pyT((((__v74) => (pyT(__v74) ? __v74 : (((!pyEq(pyGet(eb, "status"), "inactive"))))))(include_inactive)))) continue; __acc.push(Object.assign(pyDict(eb), { id: eid })); } return __acc; })()));
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(clean_path, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyLower(pyStrip(s))); } return __acc; })());
      result = [];
      for (const [eid, eb] of pyIter(pyItems(this.ebooks))) {
            if (pyT((((__v75) => (pyT(__v75) ? ((pyEq(pyGet(eb, "status"), "inactive"))) : __v75))((!pyT(include_inactive)))))) {
                    continue;
            }
            eb_fld = pyLower(pyReplace(pyReplace(pyStrip(pyStr(pyGet(eb, "folder_path", ""))), " / ", " > "), "/", " > "));
            eb_cat = pyLower(pyStrip(pyStr(pyGet(eb, "category", ""))));
            eb_sub = pyLower(pyStrip(pyStr(pyGet(eb, "subcategory", ""))));
            if (pyT(eb_fld)) {
                    if (pyT((pyEq(eb_fld, pyLower(clean_path))))) {
                              e = pyDict(eb);
                              e["id"] = eid;
                              pyAppend(result, e);
                    }
                    continue;
            }
            if (pyT((pyEq(pyLen(segments), 1)))) {
                    if (pyT((((__v76) => (pyT(__v76) ? __v76 : ((pyContains(eb_cat, pySub(segments, 0))))))((pyEq(eb_cat, pySub(segments, 0))))))) {
                              e = pyDict(eb);
                              e["id"] = eid;
                              pyAppend(result, e);
                    }
            } else if (pyT((pyEq(pyLen(segments), 2)))) {
                    if (pyT((((__v78) => (pyT(__v78) ? ((((__v77) => (pyT(__v77) ? __v77 : ((pyContains(eb_sub, pySub(segments, 1))))))((pyEq(eb_sub, pySub(segments, 1)))))) : __v78))((((__v79) => (pyT(__v79) ? __v79 : ((pyContains(eb_cat, pySub(segments, 0))))))((pyEq(eb_cat, pySub(segments, 0))))))))) {
                              e = pyDict(eb);
                              e["id"] = eid;
                              pyAppend(result, e);
                    }
            } else if (pyT(((pyLen(segments) >= 3)))) {
                    if (pyT((((__v80) => (pyT(__v80) ? (pyAny(((() => { const __acc = []; for (const seg of pyIter(pySlice(segments, 1, null, null))) { __acc.push((pyContains(`${pyStr(eb_sub)} ${pyStr(eb_fld)}`, seg))); } return __acc; })()))) : __v80))((((__v81) => (pyT(__v81) ? __v81 : ((pyContains(eb_cat, pySub(segments, 0))))))((pyEq(eb_cat, pySub(segments, 0))))))))) {
                              e = pyDict(eb);
                              e["id"] = eid;
                              pyAppend(result, e);
                    }
            }
      }
      return (result);
  }
  get_ebook_categories(include_inactive) {
    { const _k = __kw(include_inactive, ["include_inactive"]); if (_k) include_inactive = _k.include_inactive; }
    if ((include_inactive === undefined)) include_inactive = true;
      return (this.get_ebook_sub_folders("", include_inactive));
  }
  get_ebook_subcategories(category, include_inactive) {
    { const _k = __kw(include_inactive, ["include_inactive"]); if (_k) include_inactive = _k.include_inactive; }
    if ((include_inactive === undefined)) include_inactive = true;
      return (this.get_ebook_sub_folders(category, include_inactive));
  }
  add_ebook_category(name) {
      return (this.add_ebook_sub_folder("", name));
  }
  delete_ebook_category(name) {
      return (this.delete_ebook_sub_folder("", name));
  }
  move_ebook_to_folder(ebook_id, new_folder_path) {
    let eb, new_folder, segs;
      eb = pyGet(this.ebooks, ebook_id);
      if (pyT((!pyT(eb)))) {
            return (false);
      }
      new_folder = pyReplace(pyReplace(pyStrip(new_folder_path), " / ", " > "), "/", " > ");
      eb["folder_path"] = new_folder;
      segs = pySplit(new_folder, " > ", -1);
      eb["category"] = (pyT(((pyLen(segs) > 0))) ? (pySub(segs, 0)) : (""));
      eb["subcategory"] = (pyT(((pyLen(segs) > 1))) ? (pySub(segs, 1)) : (""));
      this._save(this.ebooks, EBOOKS_DB);
      return (true);
  }
  move_ebook_left(ebook_id) {
    let eb, eb_fld, new_fld, s, segments;
      eb = this.get_ebook(ebook_id);
      if (pyT((!pyT(eb)))) {
            return (false);
      }
      eb_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(eb, "folder_path", ""))), " / ", " > "), "/", " > ");
      if (pyT((!pyT(eb_fld)))) {
            return (false);
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(eb_fld, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      if (pyT(((pyLen(segments) <= 1)))) {
            return (false);
      }
      new_fld = pyJoin(" > ", pySlice(segments, null, (-(1)), null));
      return (this.move_ebook_to_folder(ebook_id, new_fld));
  }
  move_ebook_right(ebook_id, target_folder) {
    let eb, eb_fld, new_fld;
      eb = this.get_ebook(ebook_id);
      if (pyT((!pyT(eb)))) {
            return (false);
      }
      eb_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(eb, "folder_path", ""))), " / ", " > "), "/", " > ");
      new_fld = (pyT(eb_fld) ? (`${pyStr(eb_fld)} > ${pyStr(target_folder)}`) : (target_folder));
      return (this.move_ebook_to_folder(ebook_id, new_fld));
  }
  move_ebook_order(ebook_id, direction) {
    let category, current_folder, current_index, ebook, eid, folder, idx, keys;
    let new_ebooks, other_id, other_index, sibling_ids, subcategory;
      if (pyT(((!pyContains(this.ebooks, ebook_id))))) {
            return (false);
      }
      const folder_key = (ebook) => {
        let category, folder, subcategory;
        folder = pyReplace(pyReplace(pyStrip(pyStr(pyGet(ebook, "folder_path", ""))), " / ", " > "), "/", " > ");
        if (pyT(folder)) {
            return (pyLower(folder));
        }
        category = pyStrip(pyStr(pyGet(ebook, "category", "")));
        subcategory = pyStrip(pyStr(pyGet(ebook, "subcategory", "")));
        return (pyLower((pyT((((__v82) => (pyT(__v82) ? __v82 : ((pyEq(pyLower(subcategory), "general")))))((!pyT(subcategory))))) ? (category) : (`${pyStr(category)} > ${pyStr(subcategory)}`))));
      };
      current_folder = folder_key(pySub(this.ebooks, ebook_id));
      sibling_ids = ((() => { const __acc = []; for (const [eid, ebook] of pyIter(pyItems(this.ebooks))) { if (!pyT((pyEq(folder_key(ebook), current_folder)))) continue; __acc.push(eid); } return __acc; })());
      idx = pyIndex(sibling_ids, ebook_id);
      if (pyT((pyEq(direction, "up")))) {
            if (pyT((pyEq(idx, 0)))) {
                    return (false);
            }
            other_id = pySub(sibling_ids, (idx - 1));
      } else if (pyT((pyEq(direction, "down")))) {
            if (pyT((pyEq(idx, (pyLen(sibling_ids) - 1))))) {
                    return (false);
            }
            other_id = pySub(sibling_ids, (idx + 1));
      } else {
            return (false);
      }
      keys = pyList(pyKeys(this.ebooks));
      current_index = pyIndex(keys, ebook_id);
      other_index = pyIndex(keys, other_id);
      const __un5 = ([pySub(keys, other_index), pySub(keys, current_index)]); keys[current_index] = __un5[0]; keys[other_index] = __un5[1];
      new_ebooks = {  };
      for (const eid of pyIter(keys)) {
            new_ebooks[eid] = pySub(this.ebooks, eid);
      }
      this.ebooks = new_ebooks;
      this._save(this.ebooks, EBOOKS_DB);
      return (true);
  }
  move_ebook_folder_to(parent_path, folder_name, new_index) {
    let clean_name, clean_parent, k, new_cats, new_i, old_i, r, roots;
    let sub_list, v;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr((((__v83) => (pyT(__v83) ? __v83 : ("")))(parent_path)))), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyStr((((__v84) => (pyT(__v84) ? __v84 : ("")))(folder_name))));
      if (pyT((((__v85) => (pyT(__v85) ? __v85 : ((!pyT(clean_name)))))((!pyT(pyIsInstance(this.ebook_categories, "dict"))))))) {
            return (false);
      }
      if (pyT((!pyT(clean_parent)))) {
            roots = ((() => { const __acc = []; for (const k of pyIter(pyKeys(this.ebook_categories))) { if (!pyT(((!pyContains(k, " > "))))) continue; __acc.push(k); } return __acc; })());
            if (pyT(((!pyContains(roots, clean_name))))) {
                    return (false);
            }
            old_i = pyIndex(roots, clean_name);
            new_i = pyMax(0, pyMin((pyLen(roots) - 1), pyInt(new_index)));
            if (pyT((pyEq(new_i, old_i)))) {
                    return (false);
            }
            pyPop(roots, old_i);
            pyInsert(roots, new_i, clean_name);
            new_cats = {  };
            for (const r of pyIter(roots)) {
                    for (const [k, v] of pyIter(pyItems(this.ebook_categories))) {
                              if (pyT((((__v86) => (pyT(__v86) ? __v86 : (pyStart(k, `${pyStr(r)} > `))))((pyEq(k, r)))))) {
                                          new_cats[k] = v;
                              }
                    }
            }
            for (const [k, v] of pyIter(pyItems(this.ebook_categories))) {
                    if (pyT(((!pyContains(new_cats, k))))) {
                              new_cats[k] = v;
                    }
            }
            this.ebook_categories = new_cats;
            this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
            return (true);
      }
      for (const [k, sub_list] of pyIter(pyItems(this.ebook_categories))) {
            if (pyT((((__v87) => (pyT(__v87) ? (pyIsInstance(sub_list, "list")) : __v87))((pyEq(pyLower(pyStrip(pyStr(k))), pyLower(clean_parent))))))) {
                    if (pyT(((!pyContains(sub_list, clean_name))))) {
                              return (false);
                    }
                    old_i = pyIndex(sub_list, clean_name);
                    new_i = pyMax(0, pyMin((pyLen(sub_list) - 1), pyInt(new_index)));
                    if (pyT((pyEq(new_i, old_i)))) {
                              return (false);
                    }
                    pyPop(sub_list, old_i);
                    pyInsert(sub_list, new_i, clean_name);
                    this._save_raw(this.ebook_categories, EBOOK_CATEGORIES_DB);
                    return (true);
            }
      }
      return (false);
  }
  move_ebook_to(ebook_id, new_index) {
    let category, current_folder, ebook, eid, folder, k, keys, new_ebooks;
    let new_i, old_i, pred, s, sibs, sibs_wo, subcategory;
      if (pyT(((!pyContains(this.ebooks, ebook_id))))) {
            return (false);
      }
      const folder_key = (ebook) => {
        let category, folder, subcategory;
        folder = pyReplace(pyReplace(pyStrip(pyStr(pyGet(ebook, "folder_path", ""))), " / ", " > "), "/", " > ");
        if (pyT(folder)) {
            return (pyLower(folder));
        }
        category = pyStrip(pyStr(pyGet(ebook, "category", "")));
        subcategory = pyStrip(pyStr(pyGet(ebook, "subcategory", "")));
        return (pyLower((pyT((((__v88) => (pyT(__v88) ? __v88 : ((pyEq(pyLower(subcategory), "general")))))((!pyT(subcategory))))) ? (category) : (`${pyStr(category)} > ${pyStr(subcategory)}`))));
      };
      current_folder = folder_key(pySub(this.ebooks, ebook_id));
      sibs = ((() => { const __acc = []; for (const [eid, ebook] of pyIter(pyItems(this.ebooks))) { if (!pyT((pyEq(folder_key(ebook), current_folder)))) continue; __acc.push(eid); } return __acc; })());
      if (pyT(((!pyContains(sibs, ebook_id))))) {
            return (false);
      }
      old_i = pyIndex(sibs, ebook_id);
      new_i = pyMax(0, pyMin((pyLen(sibs) - 1), pyInt(new_index)));
      if (pyT((pyEq(new_i, old_i)))) {
            return (false);
      }
      pyPop(sibs, old_i);
      pyInsert(sibs, new_i, ebook_id);
      keys = ((() => { const __acc = []; for (const k of pyIter(pyKeys(this.ebooks))) { if (!pyT(((!pyEq(k, ebook_id))))) continue; __acc.push(k); } return __acc; })());
      sibs_wo = ((() => { const __acc = []; for (const s of pyIter(sibs)) { if (!pyT(((!pyEq(s, ebook_id))))) continue; __acc.push(s); } return __acc; })());
      if (pyT((pyEq(new_i, 0)))) {
            pyInsert(keys, pyIndex(keys, pySub(sibs_wo, 0)), ebook_id);
      } else {
            pred = pySub(sibs, (new_i - 1));
            pyInsert(keys, (pyIndex(keys, pred) + 1), ebook_id);
      }
      new_ebooks = {  };
      for (const eid of pyIter(keys)) {
            new_ebooks[eid] = pySub(this.ebooks, eid);
      }
      this.ebooks = new_ebooks;
      this._save(this.ebooks, EBOOKS_DB);
      return (true);
  }
  add_ebook_purchase(user_id, ebook_id) {
    let user;
      user = this.get_user(user_id);
      if (pyT(user)) {
            if (pyT(((!pyContains(user, "purchased_ebooks"))))) {
                    user["purchased_ebooks"] = [];
            }
            if (pyT(((!pyContains(pySub(user, "purchased_ebooks"), ebook_id))))) {
                    pyAppend(pySub(user, "purchased_ebooks"), ebook_id);
                    this._save(this.users, USERS_DB);
            }
      }
  }
  get_user_ebooks(user_id) {
    let eb, eb_copy, eid, purchased_ids, result, user;
      user = this.get_user(user_id);
      if (pyT((!pyT(user)))) {
            return ([]);
      }
      purchased_ids = pyGet(user, "purchased_ebooks", []);
      result = [];
      for (const eid of pyIter(purchased_ids)) {
            eb = this.get_ebook(eid);
            if (pyT(eb)) {
                    eb_copy = pyDict(eb);
                    eb_copy["id"] = eid;
                    pyAppend(result, eb_copy);
            }
      }
      return (result);
  }
  add_course(course_id, data) {
    let cat;
      this.courses[course_id] = data;
      cat = pyStrip(pyGet(data, "category", ""));
      if (pyT((((__v89) => (pyT(__v89) ? (((!pyContains(this.categories, cat)))) : __v89))(cat)))) {
            if (pyT(pyIsInstance(this.categories, "dict"))) {
                    this.categories[cat] = [];
            } else if (pyT(pyIsInstance(this.categories, "list"))) {
                    pyAppend(this.categories, cat);
            }
            this._save_raw(this.categories, CATEGORIES_DB);
      }
      this._save(this.courses, COURSES_DB);
  }
  get_course(course_id) {
    let c, course;
      course = pyGet(this.courses, course_id);
      if (pyT(course)) {
            c = pyDict(course);
            c["id"] = course_id;
            return (c);
      }
      return (null);
  }
  get_all_courses() {
      return (this.courses);
  }
  delete_course(course_id) {
      if (pyT((pyContains(this.courses, course_id)))) {
            pyDel(this.courses, course_id);
            this._save(this.courses, COURSES_DB);
            return (true);
      }
      return (false);
  }
  update_course(course_id, data) {
    let cat;
      if (pyT((pyContains(this.courses, course_id)))) {
            pyUpdate(pySub(this.courses, course_id), data);
            cat = pyStrip(pyGet(data, "category", ""));
            if (pyT((((__v90) => (pyT(__v90) ? (((!pyContains(this.categories, cat)))) : __v90))(cat)))) {
                    if (pyT(pyIsInstance(this.categories, "dict"))) {
                              this.categories[cat] = [];
                    } else if (pyT(pyIsInstance(this.categories, "list"))) {
                              pyAppend(this.categories, cat);
                    }
                    this._save_raw(this.categories, CATEGORIES_DB);
            }
            this._save(this.courses, COURSES_DB);
      }
  }
  search_courses(query) {
    let c, category, cid, combined, course, description, instructor, name;
    let program, results, w, words;
      query = pyLower(pyStrip(query));
      if (pyT((!pyT(query)))) {
            return ([]);
      }
      words = pySplit(query, null, -1);
      results = [];
      for (const [cid, course] of pyIter(pyItems(this.courses))) {
            if (pyT((pyEq(pyGet(course, "status"), "inactive")))) {
                    continue;
            }
            name = pyLower(pyStr(pyGet(course, "name", "")));
            category = pyLower(pyStr(pyGet(course, "category", "")));
            instructor = pyLower(pyStr(pyGet(course, "instructor", "")));
            description = pyLower(pyStr(pyGet(course, "description", "")));
            program = pyLower(pyStr(pyGet(course, "program", "")));
            combined = `${pyStr(name)} ${pyStr(category)} ${pyStr(instructor)} ${pyStr(description)} ${pyStr(program)}`;
            if (pyT((((__v91) => (pyT(__v91) ? __v91 : (pyAll(((() => { const __acc = []; for (const w of pyIter(words)) { __acc.push((pyContains(combined, w))); } return __acc; })())))))((pyContains(combined, query)))))) {
                    c = pyDict(course);
                    c["id"] = cid;
                    pyAppend(results, c);
                    continue;
            }
            if (pyT(pyAny(((() => { const __acc = []; for (const w of pyIter(words)) { __acc.push((((__v92) => (pyT(__v92) ? ((pyContains(combined, w))) : __v92))(((pyLen(w) >= 3))))); } return __acc; })())))) {
                    c = pyDict(course);
                    c["id"] = cid;
                    pyAppend(results, c);
            }
      }
      return (results);
  }
  is_category_active(folder_path) {
    let clean_path, i, inactive_list, parent_sub, segments, x;
      clean_path = pyLower(pyReplace(pyReplace(pyStrip(pyStr(folder_path)), " / ", " > "), "/", " > "));
      if (pyT((!pyT(clean_path)))) {
            return (true);
      }
      inactive_list = ((() => { const __acc = []; for (const x of pyIter(this.get_setting("inactive_categories", []))) { __acc.push(pyLower(pyReplace(pyReplace(pyStrip(pyStr(x)), " / ", " > "), "/", " > "))); } return __acc; })());
      if (pyT((pyContains(inactive_list, clean_path)))) {
            return (false);
      }
      segments = pySplit(clean_path, " > ", -1);
      for (const i of pyIter(pyRange(1, (pyLen(segments) + 1)))) {
            parent_sub = pyJoin(" > ", pySlice(segments, null, i, null));
            if (pyT((pyContains(inactive_list, parent_sub)))) {
                    return (false);
            }
      }
      return (true);
  }
  toggle_category_status(folder_path) {
    let clean_lower, clean_path, inactive_map, raw_list, x;
      clean_path = pyReplace(pyReplace(pyStrip(pyStr(folder_path)), " / ", " > "), "/", " > ");
      if (pyT((!pyT(clean_path)))) {
            return (true);
      }
      clean_lower = pyLower(clean_path);
      raw_list = pyList(this.get_setting("inactive_categories", []));
      inactive_map = (() => { const __acc = []; for (const x of pyIter(raw_list)) { __acc.push([pyLower(pyReplace(pyReplace(pyStrip(pyStr(x)), " / ", " > "), "/", " > ")), pyStr(x)]); } const __o = {}; for (const [__k, __v] of __acc) __o[__k] = __v; return __o; })();
      if (pyT((pyContains(inactive_map, clean_lower)))) {
            raw_list = ((() => { const __acc = []; for (const x of pyIter(raw_list)) { if (!pyT(((!pyEq(pyLower(pyReplace(pyReplace(pyStrip(pyStr(x)), " / ", " > "), "/", " > ")), clean_lower))))) continue; __acc.push(x); } return __acc; })());
            this.set_setting("inactive_categories", raw_list);
            return (true);
      } else {
            pyAppend(raw_list, clean_path);
            this.set_setting("inactive_categories", raw_list);
            return (false);
      }
  }
  get_sub_folders(parent_path, include_inactive) {

    { const _k = __kw(parent_path, ["parent_path", "parent", "include_inactive"]); if (_k) { if ("parent_path" in _k) parent_path = _k.parent_path; else if ("parent" in _k) parent_path = _k.parent; if ("include_inactive" in _k) include_inactive = _k.include_inactive; } }
    if (__isPlainObj(include_inactive)) include_inactive = __kwVal(include_inactive, "include_inactive", true);
    if ((parent_path === undefined || parent_path === null) || __isPlainObj(parent_path)) parent_path = "";
    if ((include_inactive === undefined)) include_inactive = true;
    let clean_parent, items, k, roots, s, segments, sub_list;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      if (pyT((!pyT(pyIsInstance(this.categories, "dict"))))) {
            this.categories = {  };
            this._save_raw(this.categories, CATEGORIES_DB);
      }
      if (pyT((!pyT(clean_parent)))) {
            roots = [];
            for (const k of pyIter(pyKeys(this.categories))) {
                    if (pyT(((!pyContains(k, " > "))))) {
                              if (pyT((((__v93) => (pyT(__v93) ? __v93 : (this.is_category_active(k))))(include_inactive)))) {
                                          pyAppend(roots, k);
                              }
                    }
            }
            return (roots);
      }
      for (const [k, sub_list] of pyIter(pyItems(this.categories))) {
            if (pyT((pyEq(pyLower(pyStrip(k)), pyLower(clean_parent))))) {
                    items = (pyT(pyIsInstance(sub_list, "list")) ? (pyList(sub_list)) : ([]));
                    if (pyT(include_inactive)) {
                              return (items);
                    }
                    return (((() => { const __acc = []; for (const s of pyIter(items)) { if (!pyT(this.is_category_active(`${pyStr(clean_parent)} > ${pyStr(s)}`))) continue; __acc.push(s); } return __acc; })()));
            }
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(clean_parent, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      if (pyT((pyEq(pyLen(segments), 1)))) {
            for (const [k, sub_list] of pyIter(pyItems(this.categories))) {
                    if (pyT((pyEq(pyLower(pyStrip(k)), pyLower(pySub(segments, 0)))))) {
                              items = (pyT(pyIsInstance(sub_list, "list")) ? (pyList(sub_list)) : ([]));
                              if (pyT(include_inactive)) {
                                          return (items);
                              }
                              return (((() => { const __acc = []; for (const s of pyIter(items)) { if (!pyT(this.is_category_active(`${pyStr(clean_parent)} > ${pyStr(s)}`))) continue; __acc.push(s); } return __acc; })()));
                    }
            }
      }
      return ([]);
  }
  add_sub_folder(parent_path, folder_name) {
    let child_path, clean_name, clean_parent, existing, k, target_parent_key;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyReplace(pyReplace(pyStrip(pyStr(folder_name)), ">", ""), "/", ""));
      if (pyT((!pyT(clean_name)))) {
            return (false);
      }
      if (pyT((!pyT(pyIsInstance(this.categories, "dict"))))) {
            this.categories = {  };
      }
      if (pyT((!pyT(clean_parent)))) {
            for (const k of pyIter(pyKeys(this.categories))) {
                    if (pyT((((__v94) => (pyT(__v94) ? ((pyEq(pyLower(pyStrip(k)), pyLower(clean_name)))) : __v94))(((!pyContains(k, " > "))))))) {
                              return (false);
                    }
            }
            this.categories[clean_name] = [];
            this._save_raw(this.categories, CATEGORIES_DB);
            return (true);
      }
      target_parent_key = null;
      for (const k of pyIter(pyKeys(this.categories))) {
            if (pyT((pyEq(pyLower(pyStrip(k)), pyLower(clean_parent))))) {
                    target_parent_key = k;
                    break;
            }
      }
      if (pyT((!pyT(target_parent_key)))) {
            target_parent_key = clean_parent;
            this.categories[target_parent_key] = [];
      }
      if (pyT((!pyT(pyIsInstance(pySub(this.categories, target_parent_key), "list"))))) {
            this.categories[target_parent_key] = [];
      }
      for (const existing of pyIter(pySub(this.categories, target_parent_key))) {
            if (pyT((pyEq(pyLower(pyStrip(existing)), pyLower(clean_name))))) {
                    return (false);
            }
      }
      pyAppend(pySub(this.categories, target_parent_key), clean_name);
      child_path = `${pyStr(target_parent_key)} > ${pyStr(clean_name)}`;
      if (pyT(((!pyContains(this.categories, child_path))))) {
            this.categories[child_path] = [];
      }
      this._save_raw(this.categories, CATEGORIES_DB);
      return (true);
  }
  _remove_courses_in_paths(removed_paths) {
    let _cat, _sub, c, c_fld, cart_changed, cid, course, doomed;
    let items, lowered, new_items, p, rp, uid;
      lowered = ((() => { const __acc = []; for (const p of pyIter((((__v95) => (pyT(__v95) ? __v95 : ([])))(removed_paths)))) { if (!pyT(pyStrip(pyStr((((__v96) => (pyT(__v96) ? __v96 : ("")))(p)))))) continue; __acc.push(pyLower(pyReplace(pyReplace(pyStrip(pyStr(p)), " / ", " > "), "/", " > "))); } return pySetNew(__acc); })());
      if (pyT((!pyT(lowered)))) {
            return (0);
      }
      doomed = [];
      for (const [cid, course] of pyIter(pyList(pyItems(this.courses)))) {
            c = (((__v97) => (pyT(__v97) ? __v97 : ({  })))(course));
            c_fld = pyLower(pyReplace(pyReplace(pyStrip(pyStr(pyGet(c, "folder_path", ""))), " / ", " > "), "/", " > "));
            if (pyT((!pyT(c_fld)))) {
                    _cat = pyStrip(pyStr(pyGet(c, "category", "")));
                    _sub = pyStrip(pyStr(pyGet(c, "subcategory", "")));
                    if (pyT((((__v99) => (pyT(__v99) ? (((__v98) => (pyT(__v98) ? (((!pyEq(pyLower(_sub), "general")))) : __v98))(_sub)) : __v99))(_cat)))) {
                              c_fld = pyLower(`${pyStr(_cat)} > ${pyStr(_sub)}`);
                    } else if (pyT(_cat)) {
                              c_fld = pyLower(_cat);
                    }
            }
            if (pyT((((__v101) => (pyT(__v101) ? (pyAny(((() => { const __acc = []; for (const rp of pyIter(lowered)) { __acc.push((((__v100) => (pyT(__v100) ? __v100 : (pyStart(c_fld, (rp + " > ")))))((pyEq(c_fld, rp))))); } return __acc; })()))) : __v101))(c_fld)))) {
                    pyAppend(doomed, cid);
            }
      }
      if (pyT((!pyT(doomed)))) {
            return (0);
      }
      for (const cid of pyIter(doomed)) {
            pyPop(this.courses, cid, null);
      }
      this._save(this.courses, COURSES_DB);
      cart_changed = false;
      if (pyT(pyIsInstance(this.cart, "dict"))) {
            for (const [uid, items] of pyIter(pyItems(this.cart))) {
                    if (pyT(pyIsInstance(items, "list"))) {
                              new_items = ((() => { const __acc = []; for (const c of pyIter(items)) { if (!pyT(((!pyContains(doomed, c))))) continue; __acc.push(c); } return __acc; })());
                              if (pyT(((!pyEq(pyLen(new_items), pyLen(items)))))) {
                                          this.cart[uid] = new_items;
                                          cart_changed = true;
                              }
                    }
            }
      }
      if (pyT(cart_changed)) {
            this._save(this.cart, CART_DB);
      }
      return (pyLen(doomed));
  }
  _remove_ebooks_in_paths(removed_paths) {
    let _cat, _sub, doomed, e, e_fld, eb, eid, lowered;
    let p, rp;
      lowered = ((() => { const __acc = []; for (const p of pyIter((((__v102) => (pyT(__v102) ? __v102 : ([])))(removed_paths)))) { if (!pyT(pyStrip(pyStr((((__v103) => (pyT(__v103) ? __v103 : ("")))(p)))))) continue; __acc.push(pyLower(pyReplace(pyReplace(pyStrip(pyStr(p)), " / ", " > "), "/", " > "))); } return pySetNew(__acc); })());
      if (pyT((!pyT(lowered)))) {
            return (0);
      }
      doomed = [];
      for (const [eid, eb] of pyIter(pyList(pyItems(this.ebooks)))) {
            e = (((__v104) => (pyT(__v104) ? __v104 : ({  })))(eb));
            e_fld = pyLower(pyReplace(pyReplace(pyStrip(pyStr(pyGet(e, "folder_path", ""))), " / ", " > "), "/", " > "));
            if (pyT((!pyT(e_fld)))) {
                    _cat = pyStrip(pyStr(pyGet(e, "category", "")));
                    _sub = pyStrip(pyStr(pyGet(e, "subcategory", "")));
                    if (pyT((((__v106) => (pyT(__v106) ? (((__v105) => (pyT(__v105) ? (((!pyEq(pyLower(_sub), "general")))) : __v105))(_sub)) : __v106))(_cat)))) {
                              e_fld = pyLower(`${pyStr(_cat)} > ${pyStr(_sub)}`);
                    } else if (pyT(_cat)) {
                              e_fld = pyLower(_cat);
                    }
            }
            if (pyT((((__v108) => (pyT(__v108) ? (pyAny(((() => { const __acc = []; for (const rp of pyIter(lowered)) { __acc.push((((__v107) => (pyT(__v107) ? __v107 : (pyStart(e_fld, (rp + " > ")))))((pyEq(e_fld, rp))))); } return __acc; })()))) : __v108))(e_fld)))) {
                    pyAppend(doomed, eid);
            }
      }
      if (pyT((!pyT(doomed)))) {
            return (0);
      }
      for (const eid of pyIter(doomed)) {
            pyPop(this.ebooks, eid, null);
      }
      this._save(this.ebooks, EBOOKS_DB);
      return (pyLen(doomed));
  }
  delete_sub_folder(parent_path, folder_name) {
    let clean_name, clean_parent, deleted, full_child_path, k, removed_paths, s, sub_list;
    let target_parent_key;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyReplace(pyReplace(pyStrip(pyStr(folder_name)), ">", ""), "/", ""));
      if (pyT((!pyT(pyIsInstance(this.categories, "dict"))))) {
            return (false);
      }
      if (pyT((!pyT(clean_parent)))) {
            deleted = false;
            removed_paths = [];
            for (const k of pyIter(pyList(pyKeys(this.categories)))) {
                    if (pyT((((__v109) => (pyT(__v109) ? __v109 : (pyStart(pyLower(pyStrip(k)), (pyLower(clean_name) + " > ")))))((pyEq(pyLower(pyStrip(k)), pyLower(clean_name))))))) {
                              pyAppend(removed_paths, k);
                              pyDel(this.categories, k);
                              deleted = true;
                    }
            }
            if (pyT(deleted)) {
                    this._save_raw(this.categories, CATEGORIES_DB);
                    this._remove_courses_in_paths(removed_paths);
            }
            return (deleted);
      }
      deleted = false;
      target_parent_key = null;
      for (const [k, sub_list] of pyIter(pyItems(this.categories))) {
            if (pyT((((__v110) => (pyT(__v110) ? (pyIsInstance(sub_list, "list")) : __v110))((pyEq(pyLower(pyStrip(k)), pyLower(clean_parent))))))) {
                    target_parent_key = k;
                    for (const s of pyIter(pyList(sub_list))) {
                              if (pyT((pyEq(pyLower(pyStrip(s)), pyLower(clean_name))))) {
                                          pyRemove(sub_list, s);
                                          deleted = true;
                              }
                    }
            }
      }
      full_child_path = pyLower(`${pyStr(clean_parent)} > ${pyStr(clean_name)}`);
      removed_paths = [`${pyStr(clean_parent)} > ${pyStr(clean_name)}`];
      for (const k of pyIter(pyList(pyKeys(this.categories)))) {
            if (pyT((((__v111) => (pyT(__v111) ? __v111 : (pyStart(pyLower(pyStrip(k)), (full_child_path + " > ")))))((pyEq(pyLower(pyStrip(k)), full_child_path)))))) {
                    pyAppend(removed_paths, k);
                    pyDel(this.categories, k);
                    deleted = true;
            }
      }
      if (pyT(deleted)) {
            this._save_raw(this.categories, CATEGORIES_DB);
            this._remove_courses_in_paths(removed_paths);
      }
      return (deleted);
  }
  move_folder_order(parent_path, folder_name, direction) {
    let clean_name, clean_parent, idx, k, new_cats, r, roots, sub_list;
    let target_idx, v;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyStr(folder_name));
      if (pyT((!pyT(pyIsInstance(this.categories, "dict"))))) {
            return (false);
      }
      if (pyT((!pyT(clean_parent)))) {
            roots = ((() => { const __acc = []; for (const k of pyIter(pyKeys(this.categories))) { if (!pyT(((!pyContains(k, " > "))))) continue; __acc.push(k); } return __acc; })());
            if (pyT(((!pyContains(roots, clean_name))))) {
                    return (false);
            }
            idx = pyIndex(roots, clean_name);
            if (pyT((((__v112) => (pyT(__v112) ? (((idx > 0))) : __v112))((pyEq(direction, "up")))))) {
                    target_idx = (idx - 1);
            } else if (pyT((((__v113) => (pyT(__v113) ? (((idx < (pyLen(roots) - 1)))) : __v113))((pyEq(direction, "down")))))) {
                    target_idx = (idx + 1);
            } else {
                    return (false);
            }
            const __un6 = ([pySub(roots, target_idx), pySub(roots, idx)]); roots[idx] = __un6[0]; roots[target_idx] = __un6[1];
            new_cats = {  };
            for (const r of pyIter(roots)) {
                    for (const [k, v] of pyIter(pyItems(this.categories))) {
                              if (pyT((((__v114) => (pyT(__v114) ? __v114 : (pyStart(k, `${pyStr(r)} > `))))((pyEq(k, r)))))) {
                                          new_cats[k] = v;
                              }
                    }
            }
            for (const [k, v] of pyIter(pyItems(this.categories))) {
                    if (pyT(((!pyContains(new_cats, k))))) {
                              new_cats[k] = v;
                    }
            }
            this.categories = new_cats;
            this._save_raw(this.categories, CATEGORIES_DB);
            return (true);
      }
      for (const [k, sub_list] of pyIter(pyItems(this.categories))) {
            if (pyT((((__v115) => (pyT(__v115) ? (pyIsInstance(sub_list, "list")) : __v115))((pyEq(pyLower(pyStrip(k)), pyLower(clean_parent))))))) {
                    if (pyT(((!pyContains(sub_list, clean_name))))) {
                              return (false);
                    }
                    idx = pyIndex(sub_list, clean_name);
                    if (pyT((((__v116) => (pyT(__v116) ? (((idx > 0))) : __v116))((pyEq(direction, "up")))))) {
                              const __un7 = ([pySub(sub_list, (idx - 1)), pySub(sub_list, idx)]); sub_list[idx] = __un7[0]; sub_list[(idx - 1)] = __un7[1];
                    } else if (pyT((((__v117) => (pyT(__v117) ? (((idx < (pyLen(sub_list) - 1)))) : __v117))((pyEq(direction, "down")))))) {
                              const __un8 = ([pySub(sub_list, (idx + 1)), pySub(sub_list, idx)]); sub_list[idx] = __un8[0]; sub_list[(idx + 1)] = __un8[1];
                    } else {
                              return (false);
                    }
                    this._save_raw(this.categories, CATEGORIES_DB);
                    return (true);
            }
      }
      return (false);
  }
  move_folder_to(parent_path, folder_name, new_index) {
    let clean_name, clean_parent, k, new_cats, new_i, old_i, r, roots;
    let sub_list, v;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr((((__v118) => (pyT(__v118) ? __v118 : ("")))(parent_path)))), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyStr((((__v119) => (pyT(__v119) ? __v119 : ("")))(folder_name))));
      if (pyT((((__v120) => (pyT(__v120) ? __v120 : ((!pyT(clean_name)))))((!pyT(pyIsInstance(this.categories, "dict"))))))) {
            return (false);
      }
      if (pyT((!pyT(clean_parent)))) {
            roots = ((() => { const __acc = []; for (const k of pyIter(pyKeys(this.categories))) { if (!pyT(((!pyContains(k, " > "))))) continue; __acc.push(k); } return __acc; })());
            if (pyT(((!pyContains(roots, clean_name))))) {
                    return (false);
            }
            old_i = pyIndex(roots, clean_name);
            new_i = pyMax(0, pyMin((pyLen(roots) - 1), pyInt(new_index)));
            if (pyT((pyEq(new_i, old_i)))) {
                    return (false);
            }
            pyPop(roots, old_i);
            pyInsert(roots, new_i, clean_name);
            new_cats = {  };
            for (const r of pyIter(roots)) {
                    for (const [k, v] of pyIter(pyItems(this.categories))) {
                              if (pyT((((__v121) => (pyT(__v121) ? __v121 : (pyStart(k, `${pyStr(r)} > `))))((pyEq(k, r)))))) {
                                          new_cats[k] = v;
                              }
                    }
            }
            for (const [k, v] of pyIter(pyItems(this.categories))) {
                    if (pyT(((!pyContains(new_cats, k))))) {
                              new_cats[k] = v;
                    }
            }
            this.categories = new_cats;
            this._save_raw(this.categories, CATEGORIES_DB);
            return (true);
      }
      for (const [k, sub_list] of pyIter(pyItems(this.categories))) {
            if (pyT((((__v122) => (pyT(__v122) ? (pyIsInstance(sub_list, "list")) : __v122))((pyEq(pyLower(pyStrip(pyStr(k))), pyLower(clean_parent))))))) {
                    if (pyT(((!pyContains(sub_list, clean_name))))) {
                              return (false);
                    }
                    old_i = pyIndex(sub_list, clean_name);
                    new_i = pyMax(0, pyMin((pyLen(sub_list) - 1), pyInt(new_index)));
                    if (pyT((pyEq(new_i, old_i)))) {
                              return (false);
                    }
                    pyPop(sub_list, old_i);
                    pyInsert(sub_list, new_i, clean_name);
                    this._save_raw(this.categories, CATEGORIES_DB);
                    return (true);
            }
      }
      return (false);
  }
  move_folder_path(old_path, new_path) {
    let c_fld, cid, course, k, new_base, new_categories, new_parent_path, new_segments;
    let old_base, old_parent_path, old_segments, segs, sub_list, suffix, target_key, updated_fld;
    let v;
      old_path = pyReplace(pyReplace(pyStrip(old_path), " / ", " > "), "/", " > ");
      new_path = pyReplace(pyReplace(pyStrip(new_path), " / ", " > "), "/", " > ");
      if (pyT((((__v124) => (pyT(__v124) ? __v124 : (((__v123) => (pyT(__v123) ? __v123 : ((pyEq(old_path, new_path)))))((!pyT(new_path))))))((!pyT(old_path)))))) {
            return (false);
      }
      old_segments = pySplit(old_path, " > ", -1);
      old_parent_path = pyJoin(" > ", pySlice(old_segments, null, (-(1)), null));
      old_base = pySub(old_segments, (-(1)));
      new_segments = pySplit(new_path, " > ", -1);
      new_parent_path = pyJoin(" > ", pySlice(new_segments, null, (-(1)), null));
      new_base = pySub(new_segments, (-(1)));
      if (pyT((!pyT(old_parent_path)))) {
            if (pyT((pyContains(this.categories, old_base)))) {
            }
      } else {
            for (const [k, sub_list] of pyIter(pyList(pyItems(this.categories)))) {
                    if (pyT((((__v125) => (pyT(__v125) ? (pyIsInstance(sub_list, "list")) : __v125))((pyEq(pyLower(pyStrip(k)), pyLower(old_parent_path))))))) {
                              if (pyT((pyContains(sub_list, old_base)))) {
                                          pyRemove(sub_list, old_base);
                              }
                    }
            }
      }
      if (pyT((!pyT(new_parent_path)))) {
            if (pyT(((!pyContains(this.categories, new_base))))) {
                    this.categories[new_base] = [];
            }
      } else {
            target_key = null;
            for (const k of pyIter(pyKeys(this.categories))) {
                    if (pyT((pyEq(pyLower(pyStrip(k)), pyLower(new_parent_path))))) {
                              target_key = k;
                              break;
                    }
            }
            if (pyT((!pyT(target_key)))) {
                    target_key = new_parent_path;
                    this.categories[target_key] = [];
            }
            if (pyT((!pyT(pyIsInstance(pySub(this.categories, target_key), "list"))))) {
                    this.categories[target_key] = [];
            }
            if (pyT(((!pyContains(pySub(this.categories, target_key), new_base))))) {
                    pyAppend(pySub(this.categories, target_key), new_base);
            }
      }
      new_categories = {  };
      for (const [k, v] of pyIter(pyItems(this.categories))) {
            if (pyT((pyEq(k, old_path)))) {
                    new_categories[new_path] = v;
            } else if (pyT(pyStart(k, (old_path + " > ")))) {
                    suffix = pySlice(k, pyLen(old_path), null, null);
                    new_categories[(new_path + suffix)] = v;
            } else {
                    new_categories[k] = v;
            }
      }
      this.categories = new_categories;
      for (const [cid, course] of pyIter(pyItems(this.courses))) {
            c_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > ");
            if (pyT((pyEq(c_fld, old_path)))) {
                    course["folder_path"] = new_path;
                    segs = pySplit(new_path, " > ", -1);
                    course["category"] = (pyT(((pyLen(segs) > 0))) ? (pySub(segs, 0)) : (""));
                    course["subcategory"] = (pyT(((pyLen(segs) > 1))) ? (pyJoin(" > ", pySlice(segs, 1, null, null))) : (""));
            } else if (pyT(pyStart(c_fld, (old_path + " > ")))) {
                    suffix = pySlice(c_fld, pyLen(old_path), null, null);
                    updated_fld = (new_path + suffix);
                    course["folder_path"] = updated_fld;
                    segs = pySplit(updated_fld, " > ", -1);
                    course["category"] = (pyT(((pyLen(segs) > 0))) ? (pySub(segs, 0)) : (""));
                    course["subcategory"] = (pyT(((pyLen(segs) > 1))) ? (pyJoin(" > ", pySlice(segs, 1, null, null))) : (""));
            }
      }
      this._save_raw(this.categories, CATEGORIES_DB);
      this._save(this.courses, COURSES_DB);
      return (true);
  }
  move_folder_left(parent_path, folder_name) {
    let clean_name, clean_parent, new_full_path, new_parent_path, old_full_path, s, segments;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyStr(folder_name));
      if (pyT((!pyT(clean_parent)))) {
            return (false);
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(clean_parent, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      new_parent_path = (pyT(((pyLen(segments) > 1))) ? (pyJoin(" > ", pySlice(segments, null, (-(1)), null))) : (""));
      old_full_path = `${pyStr(clean_parent)} > ${pyStr(clean_name)}`;
      new_full_path = (pyT(new_parent_path) ? (`${pyStr(new_parent_path)} > ${pyStr(clean_name)}`) : (clean_name));
      return (this.move_folder_path(old_full_path, new_full_path));
  }
  move_folder_right(parent_path, folder_name, target_sibling) {
    let clean_name, clean_parent, clean_sibling, new_full_path, old_full_path;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_name = pyStrip(pyStr(folder_name));
      clean_sibling = pyStrip(pyStr(target_sibling));
      if (pyT((pyEq(clean_name, clean_sibling)))) {
            return (false);
      }
      old_full_path = (pyT(clean_parent) ? (`${pyStr(clean_parent)} > ${pyStr(clean_name)}`) : (clean_name));
      new_full_path = (pyT(clean_parent) ? (`${pyStr(clean_parent)} > ${pyStr(clean_sibling)} > ${pyStr(clean_name)}`) : (`${pyStr(clean_sibling)} > ${pyStr(clean_name)}`));
      return (this.move_folder_path(old_full_path, new_full_path));
  }
  move_course_to_folder(course_id, new_folder_path) {
    let course, new_folder, segs;
      course = pyGet(this.courses, course_id);
      if (pyT((!pyT(course)))) {
            return (false);
      }
      new_folder = pyReplace(pyReplace(pyStrip(new_folder_path), " / ", " > "), "/", " > ");
      course["folder_path"] = new_folder;
      segs = pySplit(new_folder, " > ", -1);
      course["category"] = (pyT(((pyLen(segs) > 0))) ? (pySub(segs, 0)) : (""));
      course["subcategory"] = (pyT(((pyLen(segs) > 1))) ? (pyJoin(" > ", pySlice(segs, 1, null, null))) : (""));
      this._save(this.courses, COURSES_DB);
      return (true);
  }
  move_course_left(course_id) {
    let c_fld, course, new_fld, s, segments;
      course = this.get_course(course_id);
      if (pyT((!pyT(course)))) {
            return (false);
      }
      c_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > ");
      if (pyT((!pyT(c_fld)))) {
            return (false);
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(c_fld, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
      if (pyT(((pyLen(segments) <= 1)))) {
            return (false);
      }
      new_fld = pyJoin(" > ", pySlice(segments, null, (-(1)), null));
      return (this.move_course_to_folder(course_id, new_fld));
  }
  move_course_right(course_id, target_folder) {
    let c_fld, course, new_fld;
      course = this.get_course(course_id);
      if (pyT((!pyT(course)))) {
            return (false);
      }
      c_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > ");
      new_fld = (pyT(c_fld) ? (`${pyStr(c_fld)} > ${pyStr(target_folder)}`) : (target_folder));
      return (this.move_course_to_folder(course_id, new_fld));
  }
  _all_folder_paths() {
    let full, k, kk, paths, s, ss, v;
      paths = pySetNew();
      if (pyT((!pyT(pyIsInstance(this.categories, "dict"))))) {
            return (paths);
      }
      for (const [k, v] of pyIter(pyItems(this.categories))) {
            kk = pyStrip(pyStr(k));
            if (pyT(kk)) {
                    paths.add(kk);
            }
            if (pyT(pyIsInstance(v, "list"))) {
                    for (const s of pyIter(v)) {
                              ss = pyStrip(pyStr(s));
                              if (pyT((!pyT(ss)))) {
                                          continue;
                              }
                              full = (pyT(kk) ? (`${pyStr(kk)} > ${pyStr(ss)}`) : (ss));
                              paths.add(full);
                    }
            }
      }
      return (paths);
  }
  copy_folder(src_path, dest_parent_path) {
    let __for_else_2, c_fld, cid, course, dest_parent, dest_subs, idx, inactive;
    let ip, k, kk, n, new_base, new_c, new_fld, new_id;
    let new_ip, new_path, norm, s, segs, src, src_base, stamp;
    let suffix, v, x;
      // import elided: time
      src = pyReplace(pyReplace(pyStrip(pyStr((((__v126) => (pyT(__v126) ? __v126 : ("")))(src_path)))), " / ", " > "), "/", " > ");
      dest_parent = pyReplace(pyReplace(pyStrip(pyStr((((__v127) => (pyT(__v127) ? __v127 : ("")))(dest_parent_path)))), " / ", " > "), "/", " > ");
      if (pyT((((__v128) => (pyT(__v128) ? __v128 : ((!pyT(pyIsInstance(this.categories, "dict"))))))((!pyT(src)))))) {
            return (null);
      }
      if (pyT((((__v129) => (pyT(__v129) ? __v129 : (pyStart(dest_parent, (src + " > ")))))((pyEq(dest_parent, src)))))) {
            return (null);
      }
      if (pyT(((!pyContains(this._all_folder_paths(), src))))) {
            return (null);
      }
      src_base = pyStrip(pySub(pySplit(src, " > ", -1), (-(1))));
      dest_subs = this.get_sub_folders(dest_parent, { include_inactive: true });
      new_base = src_base;
      if (pyT((pyContains(dest_subs, new_base)))) {
            new_base = `${pyStr(src_base)} (Copy)`;
            n = 2;
            while (pyT((pyContains(dest_subs, new_base)))) {
                    new_base = `${pyStr(src_base)} (Copy ${pyStr(n)})`;
                    n += 1;
            }
      }
      new_path = (pyT(dest_parent) ? (`${pyStr(dest_parent)} > ${pyStr(new_base)}`) : (new_base));
      for (const [k, v] of pyIter(pyList(pyItems(this.categories)))) {
            kk = pyStrip(pyStr(k));
            if (pyT((pyEq(kk, src)))) {
                    this.categories[new_path] = (pyT(pyIsInstance(v, "list")) ? (pyList(v)) : ([]));
            } else if (pyT(pyStart(kk, (src + " > ")))) {
                    suffix = pySlice(kk, pyLen(src), null, null);
                    this.categories[(new_path + suffix)] = (pyT(pyIsInstance(v, "list")) ? (pyList(v)) : ([]));
            }
      }
      if (pyT(((!pyContains(this.categories, new_path))))) {
            this.categories[new_path] = pyList(pyGet(this.categories, src, []));
      }
      if (pyT((!pyT(dest_parent)))) {
            if (pyT(((!pyContains(this.categories, new_base))))) {
                    this.categories[new_base] = [];
            }
      } else {
            __for_else_2 = false;
            for (const [k, v] of pyIter(pyItems(this.categories))) {
                    if (pyT((((__v130) => (pyT(__v130) ? (pyIsInstance(v, "list")) : __v130))((pyEq(pyLower(pyStrip(pyStr(k))), pyLower(dest_parent))))))) {
                              if (pyT(((!pyContains(v, new_base))))) {
                                          pyAppend(v, new_base);
                              }
                              __for_else_2 = true;
                              break;
                    }
            }
            if (pyT((!pyT(__for_else_2)))) {
                    this.categories[dest_parent] = [new_base];
            }
      }
      try {
            inactive = ((() => { const __acc = []; for (const x of pyIter(this.get_setting("inactive_categories", []))) { __acc.push(pyStr(x)); } return __acc; })());
            norm = ((() => { const __acc = []; for (const x of pyIter(inactive)) { __acc.push(pyReplace(pyReplace(pyStrip(pyStr(x)), " / ", " > "), "/", " > ")); } return __acc; })());
            for (const ip of pyIter(pyList(norm))) {
                    if (pyT((((__v131) => (pyT(__v131) ? __v131 : (pyStart(ip, (src + " > ")))))((pyEq(ip, src)))))) {
                              new_ip = (new_path + pySlice(ip, pyLen(src), null, null));
                              if (pyT(((!pyContains(norm, new_ip))))) {
                                          pyAppend(inactive, new_ip);
                              }
                    }
            }
            this.set_setting("inactive_categories", inactive);
      } catch (__e) {
      }
      stamp = pyInt(pyTimestamp());
      idx = 0;
      for (const [cid, course] of pyIter(pyList(pyItems(this.courses)))) {
            c_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > ");
            if (pyT((((__v132) => (pyT(__v132) ? __v132 : (pyStart(c_fld, (src + " > ")))))((pyEq(c_fld, src)))))) {
                    suffix = pySlice(c_fld, pyLen(src), null, null);
                    new_fld = (new_path + suffix);
                    new_c = pyDict(course);
                    new_c["folder_path"] = new_fld;
                    segs = ((() => { const __acc = []; for (const s of pyIter(pySplit(new_fld, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
                    new_c["category"] = (pyT(segs) ? (pySub(segs, 0)) : (""));
                    new_c["subcategory"] = (pyT(((pyLen(segs) > 1))) ? (pyJoin(" > ", pySlice(segs, 1, null, null))) : ("General"));
                    new_c["id"] = `COURSE-COPY-${pyStr(stamp)}-${pyStr(idx)}`;
                    idx += 1;
                    new_id = pySub(new_c, "id");
                    while (pyT((pyContains(this.courses, new_id)))) {
                              new_c["id"] = `COURSE-COPY-${pyStr(stamp)}-${pyStr(idx)}`;
                              new_id = pySub(new_c, "id");
                              idx += 1;
                    }
                    this.courses[new_id] = new_c;
            }
      }
      this._save_raw(this.categories, CATEGORIES_DB);
      this._save(this.courses, COURSES_DB);
      return (new_path);
  }
  rename_folder(parent_path, old_name, new_name) {
    let ck, clean_new, clean_old, clean_parent, idx, k, new_cats, new_child_path;
    let new_ck, new_key, old_child_path, old_child_prefix, sub_list, v;
      clean_parent = pyReplace(pyReplace(pyStrip(pyStr(parent_path)), " / ", " > "), "/", " > ");
      clean_old = pyStrip(pyStr(old_name));
      clean_new = pyStrip(pyStr(new_name));
      if (pyT((((__v133) => (pyT(__v133) ? __v133 : ((!pyT(clean_old)))))((!pyT(clean_new)))))) {
            return (false);
      }
      if (pyT((!pyT(pyIsInstance(this.categories, "dict"))))) {
            return (false);
      }
      if (pyT((!pyT(clean_parent)))) {
            if (pyT(((!pyContains(this.categories, clean_old))))) {
                    return (false);
            }
            if (pyT((pyContains(this.categories, clean_new)))) {
                    return (false);
            }
            new_cats = {  };
            for (const [k, v] of pyIter(pyItems(this.categories))) {
                    if (pyT((pyEq(k, clean_old)))) {
                              new_cats[clean_new] = v;
                    } else {
                              new_cats[k] = v;
                    }
            }
            old_child_prefix = `${pyStr(clean_old)} > `;
            for (const [k, v] of pyIter(pyList(pyItems(new_cats)))) {
                    if (pyT(pyStart(k, old_child_prefix))) {
                              new_key = (clean_new + pySlice(k, (pyLen(old_child_prefix) - 3), null, null));
                              new_cats[new_key] = v;
                              pyDel(new_cats, k);
                    }
            }
            this.categories = new_cats;
            this._save_raw(this.categories, CATEGORIES_DB);
            this._repath_courses(clean_old, clean_new);
            return (true);
      }
      for (const [k, sub_list] of pyIter(pyItems(this.categories))) {
            if (pyT((((__v134) => (pyT(__v134) ? (pyIsInstance(sub_list, "list")) : __v134))((pyEq(pyLower(pyStrip(k)), pyLower(clean_parent))))))) {
                    if (pyT(((!pyContains(sub_list, clean_old))))) {
                              return (false);
                    }
                    if (pyT((pyContains(sub_list, clean_new)))) {
                              return (false);
                    }
                    idx = pyIndex(sub_list, clean_old);
                    sub_list[idx] = clean_new;
                    old_child_path = `${pyStr(clean_parent)} > ${pyStr(clean_old)}`;
                    new_child_path = `${pyStr(clean_parent)} > ${pyStr(clean_new)}`;
                    for (const ck of pyIter(pyList(pyKeys(this.categories)))) {
                              if (pyT((pyEq(ck, old_child_path)))) {
                                          this.categories[new_child_path] = pyPop(this.categories, ck);
                              } else if (pyT(pyStart(ck, (old_child_path + " > ")))) {
                                          new_ck = (new_child_path + pySlice(ck, pyLen(old_child_path), null, null));
                                          this.categories[new_ck] = pyPop(this.categories, ck);
                              }
                    }
                    this._save_raw(this.categories, CATEGORIES_DB);
                    this._repath_courses(old_child_path, new_child_path);
                    return (true);
            }
      }
      return (false);
  }
  _repath_courses(old_path, new_path) {
    let c_fld, changed, course, s, segs, updated;
      changed = false;
      for (const course of pyIter(pyValues(this.courses))) {
            c_fld = pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > ");
            if (pyT((((__v135) => (pyT(__v135) ? __v135 : (pyStart(c_fld, (old_path + " > ")))))((pyEq(c_fld, old_path)))))) {
                    updated = (new_path + pySlice(c_fld, pyLen(old_path), null, null));
                    course["folder_path"] = updated;
                    segs = ((() => { const __acc = []; for (const s of pyIter(pySplit(updated, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyStrip(s)); } return __acc; })());
                    course["category"] = (pyT(segs) ? (pySub(segs, 0)) : (""));
                    course["subcategory"] = (pyT(((pyLen(segs) > 1))) ? (pyJoin(" > ", pySlice(segs, 1, null, null))) : ("General"));
                    changed = true;
            }
      }
      if (pyT(changed)) {
            this._save(this.courses, COURSES_DB);
      }
  }
  get_categories(include_inactive) {
    { const _k = __kw(include_inactive, ["include_inactive"]); if (_k) include_inactive = _k.include_inactive; }
    if ((include_inactive === undefined)) include_inactive = true;
      return (this.get_sub_folders("", include_inactive));
  }
  get_subcategories(category, include_inactive) {
    { const _k = __kw(include_inactive, ["include_inactive"]); if (_k) include_inactive = _k.include_inactive; }
    if ((include_inactive === undefined)) include_inactive = true;
      return (this.get_sub_folders(category, include_inactive));
  }
  add_category(name) {
      return (this.add_sub_folder("", name));
  }
  delete_category(name) {
      return (this.delete_sub_folder("", name));
  }
  add_subcategory(category, subcategory) {
      return (this.add_sub_folder(category, subcategory));
  }
  delete_subcategory(category, subcategory) {
      return (this.delete_sub_folder(category, subcategory));
  }
  _norm_folder_key(path) {
      return (pyReplace(pyReplace(pyStrip(pyStr((((__v136) => (pyT(__v136) ? __v136 : ("")))(path)))), " / ", " > "), "/", " > "));
  }
  get_folder_headers() {
    let cfg;
      cfg = this.get_setting("folder_headers", {  });
      return ((pyT(pyIsInstance(cfg, "dict")) ? (cfg) : ({  })));
  }
  get_folder_header(path) {
      return ((((__v137) => (pyT(__v137) ? __v137 : ({  })))(pyGet(this.get_folder_headers(), this._norm_folder_key(path), {  }))));
  }
  set_folder_header_text(path, text) {
    let cfg, hdr, key;
      key = this._norm_folder_key(path);
      if (pyT((!pyT(key)))) {
            return (false);
      }
      cfg = this.get_folder_headers();
      hdr = (((__v138) => (pyT(__v138) ? __v138 : ({  })))(pyGet(cfg, key, {  })));
      hdr["text"] = pyStrip(pyStr((((__v139) => (pyT(__v139) ? __v139 : ("")))(text))));
      if (pyT((((__v140) => (pyT(__v140) ? ((pyEq(pyGet(hdr, "media_type", "none"), "none"))) : __v140))((!pyT(pySub(hdr, "text"))))))) {
            pyPop(cfg, key, null);
      } else {
            cfg[key] = hdr;
      }
      return (this.set_setting("folder_headers", cfg));
  }
  set_folder_header_media(path, mtype, file_id) {
    let cfg, hdr, key;
      key = this._norm_folder_key(path);
      if (pyT((!pyT(key)))) {
            return (false);
      }
      mtype = pyLower(pyStr((((__v141) => (pyT(__v141) ? __v141 : ("none")))(mtype))));
      if (pyT(((!pyContains(["photo", "animation"], mtype))))) {
            [mtype, file_id] = ["none", ""];
      }
      cfg = this.get_folder_headers();
      hdr = (((__v142) => (pyT(__v142) ? __v142 : ({  })))(pyGet(cfg, key, {  })));
      hdr["media_type"] = mtype;
      hdr["media_file_id"] = (pyT(((!pyEq(mtype, "none")))) ? (file_id) : (""));
      if (pyT((((__v143) => (pyT(__v143) ? ((!pyT(pyStrip(pyGet(hdr, "text", ""))))) : __v143))((pyEq(mtype, "none")))))) {
            pyPop(cfg, key, null);
      } else {
            cfg[key] = hdr;
      }
      return (this.set_setting("folder_headers", cfg));
  }
  reset_folder_header(path) {
    let cfg;
      cfg = this.get_folder_headers();
      pyPop(cfg, this._norm_folder_key(path), null);
      return (this.set_setting("folder_headers", cfg));
  }
  get_folder_header_media(path) {
    let fid, hdr, mtype;
      hdr = this.get_folder_header(path);
      mtype = pyLower(pyStr((((__v144) => (pyT(__v144) ? __v144 : ("none")))(pyGet(hdr, "media_type", "none")))));
      fid = (((__v145) => (pyT(__v145) ? __v145 : ("")))(pyGet(hdr, "media_file_id", "")));
      if (pyT((((__v146) => (pyT(__v146) ? __v146 : ((!pyT(fid)))))(((!pyContains(["photo", "animation"], mtype))))))) {
            return (["none", ""]);
      }
      return ([mtype, fid]);
  }
  get_ebook_folder_headers() {
    let cfg;
      cfg = this.get_setting("ebook_folder_headers", {  });
      return ((pyT(pyIsInstance(cfg, "dict")) ? (cfg) : ({  })));
  }
  get_ebook_folder_header(path) {
      return ((((__v147) => (pyT(__v147) ? __v147 : ({  })))(pyGet(this.get_ebook_folder_headers(), this._norm_folder_key(path), {  }))));
  }
  set_ebook_folder_header_text(path, text) {
    let cfg, hdr, key;
      key = this._norm_folder_key(path);
      if (pyT((!pyT(key)))) {
            return (false);
      }
      cfg = this.get_ebook_folder_headers();
      hdr = (((__v148) => (pyT(__v148) ? __v148 : ({  })))(pyGet(cfg, key, {  })));
      hdr["text"] = pyStrip(pyStr((((__v149) => (pyT(__v149) ? __v149 : ("")))(text))));
      if (pyT((((__v150) => (pyT(__v150) ? ((pyEq(pyGet(hdr, "media_type", "none"), "none"))) : __v150))((!pyT(pySub(hdr, "text"))))))) {
            pyPop(cfg, key, null);
      } else {
            cfg[key] = hdr;
      }
      return (this.set_setting("ebook_folder_headers", cfg));
  }
  set_ebook_folder_header_media(path, mtype, file_id) {
    let cfg, hdr, key;
      key = this._norm_folder_key(path);
      if (pyT((!pyT(key)))) {
            return (false);
      }
      mtype = pyLower(pyStr((((__v151) => (pyT(__v151) ? __v151 : ("none")))(mtype))));
      if (pyT(((!pyContains(["photo", "animation"], mtype))))) {
            [mtype, file_id] = ["none", ""];
      }
      cfg = this.get_ebook_folder_headers();
      hdr = (((__v152) => (pyT(__v152) ? __v152 : ({  })))(pyGet(cfg, key, {  })));
      hdr["media_type"] = mtype;
      hdr["media_file_id"] = (pyT(((!pyEq(mtype, "none")))) ? (file_id) : (""));
      if (pyT((((__v153) => (pyT(__v153) ? ((!pyT(pyStrip(pyGet(hdr, "text", ""))))) : __v153))((pyEq(mtype, "none")))))) {
            pyPop(cfg, key, null);
      } else {
            cfg[key] = hdr;
      }
      return (this.set_setting("ebook_folder_headers", cfg));
  }
  reset_ebook_folder_header(path) {
    let cfg;
      cfg = this.get_ebook_folder_headers();
      pyPop(cfg, this._norm_folder_key(path), null);
      return (this.set_setting("ebook_folder_headers", cfg));
  }
  get_ebook_folder_header_media(path) {
    let fid, hdr, mtype;
      hdr = this.get_ebook_folder_header(path);
      mtype = pyLower(pyStr((((__v154) => (pyT(__v154) ? __v154 : ("none")))(pyGet(hdr, "media_type", "none")))));
      fid = (((__v155) => (pyT(__v155) ? __v155 : ("")))(pyGet(hdr, "media_file_id", "")));
      if (pyT((((__v156) => (pyT(__v156) ? __v156 : ((!pyT(fid)))))(((!pyContains(["photo", "animation"], mtype))))))) {
            return (["none", ""]);
      }
      return ([mtype, fid]);
  }
  get_courses_by_filter(category, subcategory, program, include_inactive) {
    { const _k = __kw(category, ["category", "subcategory", "program", "include_inactive"]); if (_k) { if ("category" in _k) category = _k.category; if ("subcategory" in _k) subcategory = _k.subcategory; if ("program" in _k) program = _k.program; if ("include_inactive" in _k) include_inactive = _k.include_inactive; } }
    if ((category === undefined) || __isPlainObj(category)) category = null; if ((subcategory === undefined) || __isPlainObj(subcategory)) subcategory = null; if ((program === undefined) || __isPlainObj(program)) program = null;
    if (__isPlainObj(include_inactive)) include_inactive = __kwVal(include_inactive, "include_inactive", false);
    if ((include_inactive === undefined)) include_inactive = false;
    let c, c_fld, c_prog, c_sub, cat_prefix, cid, course, course_text;
    let matched, result, sub_filter, target_sub, target_words, w;
      result = [];
      for (const [cid, course] of pyIter(pyItems(this.courses))) {
            if (pyT((((__v157) => (pyT(__v157) ? ((pyEq(pyGet(course, "status"), "inactive"))) : __v157))((!pyT(include_inactive)))))) {
                    continue;
            }
            if (pyT((((__v158) => (pyT(__v158) ? (((!pyEq(pyLower(pyStrip(pyGet(course, "category", ""))), pyLower(pyStrip(category)))))) : __v158))(category)))) {
                    continue;
            }
            sub_filter = (((__v159) => (pyT(__v159) ? __v159 : (program)))(subcategory));
            if (pyT((((__v160) => (pyT(__v160) ? (((!pyEq(pyUpper(pyStrip(pyStr(sub_filter))), "ALL")))) : __v160))(sub_filter)))) {
                    c_sub = pyLower(pyStrip(pyStr(pyGet(course, "subcategory", ""))));
                    c_prog = pyLower(pyStrip(pyStr(pyGet(course, "program", ""))));
                    c_fld = pyLower(pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > "));
                    target_sub = pyLower(pyStrip(pyStr(sub_filter)));
                    matched = false;
                    if (pyT(c_fld)) {
                              cat_prefix = (pyT(category) ? (`${pyStr(pyLower(pyStrip(category)))} > `) : (""));
                              if (pyT((pyEq(c_fld, target_sub)))) {
                                          matched = true;
                              } else if (pyT((((__v161) => (pyT(__v161) ? (pyStart(c_fld, `${pyStr(cat_prefix)}${pyStr(target_sub)} > `)) : __v161))(cat_prefix)))) {
                                          matched = true;
                              } else if (pyT(pyStart(c_fld, `${pyStr(target_sub)} > `))) {
                                          matched = true;
                              } else if (pyT((((__v162) => (pyT(__v162) ? ((pyEq(c_fld, `${pyStr(cat_prefix)}${pyStr(target_sub)}`))) : __v162))(cat_prefix)))) {
                                          matched = true;
                              }
                    } else if (pyT((((__v167) => (pyT(__v167) ? __v167 : (((__v166) => (pyT(__v166) ? __v166 : (((__v164) => (pyT(__v164) ? __v164 : ((((__v163) => (pyT(__v163) ? ((pyContains(target_sub, c_prog))) : __v163))(c_prog)))))((((__v165) => (pyT(__v165) ? ((pyContains(target_sub, c_sub))) : __v165))(c_sub))))))((pyContains(c_prog, target_sub))))))((pyContains(c_sub, target_sub)))))) {
                              matched = true;
                    } else {
                              target_words = ((() => { const __acc = []; for (const w of pyIter(pySplit(target_sub, null, -1))) { if (!pyT(((pyLen(pyStrip(w, "(),.-_")) >= 3)))) continue; __acc.push(pyStrip(w, "(),.-_")); } return __acc; })());
                              course_text = `${pyStr(c_sub)} ${pyStr(c_prog)}`;
                              if (pyT((((__v168) => (pyT(__v168) ? (pyAny(((() => { const __acc = []; for (const w of pyIter(target_words)) { __acc.push((pyContains(course_text, w))); } return __acc; })()))) : __v168))(target_words)))) {
                                          matched = true;
                              }
                    }
                    if (pyT((!pyT(matched)))) {
                              continue;
                    }
            }
            c = pyDict(course);
            c["id"] = cid;
            pyAppend(result, c);
      }
      return (result);
  }
  get_courses_by_folder(folder_path, include_inactive) {

    { const _k = __kw(folder_path, ["folder_path", "path", "include_inactive"]); if (_k) { if ("folder_path" in _k) folder_path = _k.folder_path; else if ("path" in _k) folder_path = _k.path; if ("include_inactive" in _k) include_inactive = _k.include_inactive; } }
    if (__isPlainObj(include_inactive)) include_inactive = __kwVal(include_inactive, "include_inactive", false);
    if (__isPlainObj(folder_path)) folder_path = "";
    if ((include_inactive === undefined)) include_inactive = false;
    let c, c_cat, c_fld, c_prog, c_sub, cid, clean_path, course;
    let result, s, seg, segments;
      clean_path = pyReplace(pyReplace(pyStrip(pyStr(folder_path)), " / ", " > "), "/", " > ");
      if (pyT((!pyT(clean_path)))) {
            return (((() => { const __acc = []; for (const [cid, c] of pyIter(pyItems(this.courses))) { if (!pyT((((__v169) => (pyT(__v169) ? __v169 : (((!pyEq(pyGet(c, "status"), "inactive"))))))(include_inactive)))) continue; __acc.push(Object.assign(pyDict(c), { id: cid })); } return __acc; })()));
      }
      segments = ((() => { const __acc = []; for (const s of pyIter(pySplit(clean_path, " > ", -1))) { if (!pyT(pyStrip(s))) continue; __acc.push(pyLower(pyStrip(s))); } return __acc; })());
      result = [];
      for (const [cid, course] of pyIter(pyItems(this.courses))) {
            if (pyT((((__v170) => (pyT(__v170) ? ((pyEq(pyGet(course, "status"), "inactive"))) : __v170))((!pyT(include_inactive)))))) {
                    continue;
            }
            c_fld = pyLower(pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > "));
            c_cat = pyLower(pyStrip(pyStr(pyGet(course, "category", ""))));
            c_sub = pyLower(pyStrip(pyStr(pyGet(course, "subcategory", ""))));
            c_prog = pyLower(pyStrip(pyStr(pyGet(course, "program", ""))));
            if (pyT(c_fld)) {
                    if (pyT((pyEq(c_fld, pyLower(clean_path))))) {
                              c = pyDict(course);
                              c["id"] = cid;
                              pyAppend(result, c);
                    }
                    continue;
            }
            if (pyT((pyEq(pyLen(segments), 1)))) {
                    if (pyT((((__v171) => (pyT(__v171) ? __v171 : ((pyContains(c_cat, pySub(segments, 0))))))((pyEq(c_cat, pySub(segments, 0))))))) {
                              c = pyDict(course);
                              c["id"] = cid;
                              pyAppend(result, c);
                    }
            } else if (pyT((pyEq(pyLen(segments), 2)))) {
                    if (pyT((((__v175) => (pyT(__v175) ? ((((__v174) => (pyT(__v174) ? __v174 : (((__v173) => (pyT(__v173) ? __v173 : (((__v172) => (pyT(__v172) ? __v172 : ((pyContains(c_prog, pySub(segments, 1))))))((pyContains(c_sub, pySub(segments, 1)))))))((pyEq(c_prog, pySub(segments, 1)))))))((pyEq(c_sub, pySub(segments, 1)))))) : __v175))((((__v176) => (pyT(__v176) ? __v176 : ((pyContains(c_cat, pySub(segments, 0))))))((pyEq(c_cat, pySub(segments, 0))))))))) {
                              c = pyDict(course);
                              c["id"] = cid;
                              pyAppend(result, c);
                    }
            } else if (pyT(((pyLen(segments) >= 3)))) {
                    if (pyT((((__v177) => (pyT(__v177) ? (pyAny(((() => { const __acc = []; for (const seg of pyIter(pySlice(segments, 1, null, null))) { __acc.push((pyContains(`${pyStr(c_sub)} ${pyStr(c_prog)} ${pyStr(c_fld)}`, seg))); } return __acc; })()))) : __v177))((((__v178) => (pyT(__v178) ? __v178 : ((pyContains(c_cat, pySub(segments, 0))))))((pyEq(c_cat, pySub(segments, 0))))))))) {
                              c = pyDict(course);
                              c["id"] = cid;
                              pyAppend(result, c);
                    }
            }
      }
      return (result);
  }
  add_to_cart(user_id, course_id) {
    let uid;
      uid = pyStr(user_id);
      if (pyT(((!pyContains(this.cart, uid))))) {
            this.cart[uid] = [];
      }
      if (pyT(((!pyContains(pySub(this.cart, uid), course_id))))) {
            pyAppend(pySub(this.cart, uid), course_id);
            this._save(this.cart, CART_DB);
            return (true);
      }
      return (false);
  }
  remove_from_cart(user_id, course_id) {
    let uid;
      uid = pyStr(user_id);
      if (pyT((((__v179) => (pyT(__v179) ? ((pyContains(pySub(this.cart, uid), course_id))) : __v179))((pyContains(this.cart, uid)))))) {
            pyRemove(pySub(this.cart, uid), course_id);
            this._save(this.cart, CART_DB);
            return (true);
      }
      return (false);
  }
  is_in_cart(user_id, course_id) {
    let uid;
      uid = pyStr(user_id);
      return ((((__v180) => (pyT(__v180) ? ((pyContains(pyGet(this.cart, uid, []), course_id))) : __v180))((pyContains(this.cart, uid)))));
  }
  get_cart(user_id) {
    let cid, course, course_ids, eb, items, uid;
      uid = pyStr(user_id);
      course_ids = pyGet(this.cart, uid, []);
      items = [];
      for (const cid of pyIter(course_ids)) {
            course = this.get_course(cid);
            if (pyT(course)) {
                    pyAppend(items, course);
                    continue;
            }
            eb = this.get_ebook(cid);
            if (pyT(eb)) {
                    eb["kind"] = "ebook";
                    pyAppend(items, eb);
            }
      }
      return (items);
  }
  clear_cart(user_id) {
      this.cart[pyStr(user_id)] = [];
      this._save(this.cart, CART_DB);
  }
  generate_next_order_id() {
    let highest, m, new_id, next_num, num, oid;
      highest = 1000;
      for (const oid of pyIter(pyKeys(this.orders))) {
            m = pyReMatch("^ORD-(\\d+)$", pyUpper(pyStrip(pyStr(oid))));
            if (pyT(m)) {
                    try {
                              num = pyInt(m.group(1));
                              if (pyT(((num > highest)))) {
                                          highest = num;
                              }
                    } catch (__e) {
                    }
            }
      }
      next_num = (highest + 1);
      new_id = `ORD-${pyStr(next_num)}`;
      while (pyT((pyContains(this.orders, new_id)))) {
            next_num += 1;
            new_id = `ORD-${pyStr(next_num)}`;
      }
      return (new_id);
  }
  add_order(order_id, data) {
      this.orders[order_id] = data;
      this._save(this.orders, ORDERS_DB);
  }
  get_order(order_id) {
    let clean_id, k, o, order, v;
      clean_id = pyStrip(pyStr(order_id));
      if (pyT(pyStart(clean_id, "#"))) {
            clean_id = pySlice(clean_id, 1, null, null);
      }
      order = pyGet(this.orders, clean_id);
      if (pyT((((__v181) => (pyT(__v181) ? ((!pyT(pyStart(pyUpper(clean_id), "ORD-")))) : __v181))((!pyT(order)))))) {
            order = pyGet(this.orders, `ORD-${pyStr(clean_id)}`);
      }
      if (pyT((!pyT(order)))) {
            for (const [k, v] of pyIter(pyItems(this.orders))) {
                    if (pyT((((__v182) => (pyT(__v182) ? __v182 : ((pyEq(pyLower(pyStrip(k)), `ord-${pyStr(pyLower(clean_id))}`)))))((pyEq(pyLower(pyStrip(k)), pyLower(clean_id))))))) {
                              order = v;
                              clean_id = k;
                              break;
                    }
            }
      }
      if (pyT(order)) {
            o = pyDict(order);
            o["order_id"] = clean_id;
            return (o);
      }
      return (null);
  }
  update_order(order_id, data) {
      if (pyT((pyContains(this.orders, order_id)))) {
            pyUpdate(pySub(this.orders, order_id), data);
            this._save(this.orders, ORDERS_DB);
      }
  }
  get_user_orders(user_id) {
    let o, oid, order, result;
      result = [];
      for (const [oid, order] of pyIter(pyItems(this.orders))) {
            if (pyT((pyEq(pyGet(order, "user_id"), user_id)))) {
                    o = pyDict(order);
                    o["order_id"] = oid;
                    pyAppend(result, o);
            }
      }
      pySort(result, ((x) => (pyGet(x, "date", ""))), true);
      return (result);
  }
  get_pending_orders() {
    let o, oid, order, result;
      result = [];
      for (const [oid, order] of pyIter(pyItems(this.orders))) {
            if (pyT((pyEq(pyGet(order, "status"), "pending")))) {
                    o = pyDict(order);
                    o["order_id"] = oid;
                    pyAppend(result, o);
            }
      }
      pySort(result, ((x) => (pyGet(x, "date", ""))), true);
      return (result);
  }
  get_paginated_pending_orders(page, per_page) {
    { const _k = __kw(page, ["page", "per_page"]); if (_k) { if ("page" in _k) page = _k.page; if ("per_page" in _k) per_page = _k.per_page; } }
    if ((page === undefined || page === null) || __isPlainObj(page)) page = 1;
    if ((per_page === undefined || per_page === null) || __isPlainObj(per_page)) per_page = 8;
    let end_idx, o, oid, order, pending, start_idx, total, total_pages;
      pending = [];
      for (const [oid, order] of pyIter(pyItems(this.orders))) {
            if (pyT((pyEq(pyGet(order, "status"), "pending")))) {
                    o = pyDict(order);
                    o["order_id"] = oid;
                    pyAppend(pending, o);
            }
      }
      pySort(pending, ((x) => (pyGet(x, "date", ""))), true);
      total = pyLen(pending);
      total_pages = pyMax(1, pyDiv(((total + per_page) - 1), per_page));
      start_idx = ((typeof (page - 1) === 'string' || Array.isArray((page - 1)) ? pyRepeat((page - 1), per_page) : ((page - 1) * per_page)));
      end_idx = (start_idx + per_page);
      return ([pySlice(pending, start_idx, end_idx, null), total_pages]);
  }
  get_paginated_all_orders(page, per_page) {
    { const _k = __kw(page, ["page", "per_page"]); if (_k) { if ("page" in _k) page = _k.page; if ("per_page" in _k) per_page = _k.per_page; } }
    if ((page === undefined || page === null) || __isPlainObj(page)) page = 1;
    if ((per_page === undefined || per_page === null) || __isPlainObj(per_page)) per_page = 8;
    let all_orders, end_idx, o, oid, order, start_idx, total, total_pages;
      all_orders = [];
      for (const [oid, order] of pyIter(pyItems(this.orders))) {
            o = pyDict(order);
            o["order_id"] = oid;
            pyAppend(all_orders, o);
      }
      pySort(all_orders, ((x) => (pyGet(x, "date", ""))), true);
      total = pyLen(all_orders);
      total_pages = pyMax(1, pyDiv(((total + per_page) - 1), per_page));
      start_idx = ((typeof (page - 1) === 'string' || Array.isArray((page - 1)) ? pyRepeat((page - 1), per_page) : ((page - 1) * per_page)));
      end_idx = (start_idx + per_page);
      return ([pySlice(all_orders, start_idx, end_idx, null), total_pages]);
  }
  add_coupon(code, discount_type, discount_value, min_purchase, max_discount, applicable_category, applicable_course_id, applicable_course_name, applicable_course_ids, applicable_course_names, usage_limit, per_user_limit, first_order_only, status, enable_referral_reward, reward_user_id, reward_type, reward_amount, start_date, expiry_date) {
    if (__isPlainObj(code)) { const _o = code; code = _o.code; if ("discount_type" in _o) discount_type = _o.discount_type; if ("discount_value" in _o) discount_value = _o.discount_value; if ("min_purchase" in _o) min_purchase = _o.min_purchase; if ("max_discount" in _o) max_discount = _o.max_discount; if ("applicable_category" in _o) applicable_category = _o.applicable_category; if ("applicable_course_id" in _o) applicable_course_id = _o.applicable_course_id; if ("applicable_course_name" in _o) applicable_course_name = _o.applicable_course_name; if ("applicable_course_ids" in _o) applicable_course_ids = _o.applicable_course_ids; if ("applicable_course_names" in _o) applicable_course_names = _o.applicable_course_names; if ("usage_limit" in _o) usage_limit = _o.usage_limit; if ("per_user_limit" in _o) per_user_limit = _o.per_user_limit; if ("first_order_only" in _o) first_order_only = _o.first_order_only; if ("status" in _o) status = _o.status; if ("enable_referral_reward" in _o) enable_referral_reward = _o.enable_referral_reward; if ("reward_user_id" in _o) reward_user_id = _o.reward_user_id; if ("reward_type" in _o) reward_type = _o.reward_type; if ("reward_amount" in _o) reward_amount = _o.reward_amount; if ("start_date" in _o) start_date = _o.start_date; if ("expiry_date" in _o) expiry_date = _o.expiry_date; }
    if ((discount_type === undefined)) discount_type = "fixed"; if ((discount_value === undefined)) discount_value = 0; if ((min_purchase === undefined)) min_purchase = 0; if ((max_discount === undefined)) max_discount = 0; if ((applicable_category === undefined)) applicable_category = "All";
    if ((usage_limit === undefined)) usage_limit = 100; if ((per_user_limit === undefined)) per_user_limit = 1; if ((first_order_only === undefined)) first_order_only = false; if ((status === undefined)) status = "active";
    if ((enable_referral_reward === undefined)) enable_referral_reward = false; if ((reward_type === undefined)) reward_type = "fixed"; if ((reward_amount === undefined)) reward_amount = 0; if ((start_date === undefined)) start_date = ""; if ((expiry_date === undefined)) expiry_date = "";
    if ((code === undefined || code === null) || (__isPlainObj(code))) return;
    let clean_code, legacy_cid, legacy_cname, norm_ids, norm_names, x;
      clean_code = pyStrip(pyUpper(code));
      norm_ids = [];
      norm_names = [];
      if (pyT(applicable_course_ids)) {
            norm_ids = ((() => { const __acc = []; for (const x of pyIter(applicable_course_ids)) { if (!pyT(x)) continue; __acc.push(pyStr(x)); } return __acc; })());
      } else if (pyT(applicable_course_id)) {
            norm_ids = [pyStr(applicable_course_id)];
      }
      if (pyT(applicable_course_names)) {
            norm_names = ((() => { const __acc = []; for (const x of pyIter(applicable_course_names)) { if (!pyT(x)) continue; __acc.push(pyStr(x)); } return __acc; })());
      } else if (pyT(applicable_course_name)) {
            norm_names = [pyStr(applicable_course_name)];
      }
      legacy_cid = (pyT(norm_ids) ? (pySub(norm_ids, 0)) : (applicable_course_id));
      legacy_cname = (pyT(norm_names) ? (pySub(norm_names, 0)) : (applicable_course_name));
      this.coupons[clean_code] = { code: clean_code, discount_type: discount_type, discount_value: pyInt(discount_value), discount: pyInt(discount_value), min_purchase: pyInt(min_purchase), max_discount: pyInt(max_discount), applicable_category: (((__v183) => (pyT(__v183) ? __v183 : ("All")))(applicable_category)), applicable_course_id: legacy_cid, applicable_course_name: legacy_cname, applicable_course_ids: norm_ids, applicable_course_names: norm_names, usage_limit: pyInt(usage_limit), uses: pyInt(usage_limit), per_user_limit: pyInt(per_user_limit), first_order_only: pyT(first_order_only), status: (((__v184) => (pyT(__v184) ? __v184 : ("active")))(status)), enable_referral_reward: pyT(enable_referral_reward), reward_user_id: (pyT(reward_user_id) ? (pyInt(reward_user_id)) : (null)), reward_type: (((__v185) => (pyT(__v185) ? __v185 : ("fixed")))(reward_type)), reward_amount: pyInt(reward_amount), start_date: (((__v186) => (pyT(__v186) ? __v186 : (pySlice(pyStr(pyNow()), null, 10, null))))(start_date)), expiry_date: (((__v187) => (pyT(__v187) ? __v187 : ("None")))(expiry_date)), used_count: pyGet(pyGet(this.coupons, clean_code, {  }), "used_count", 0), used_by: pyGet(pyGet(this.coupons, clean_code, {  }), "used_by", {  }) };
      if (pyT((((__v188) => (pyT(__v188) ? (reward_user_id) : __v188))(enable_referral_reward)))) {
            this.enable_user_earnings(pyInt(reward_user_id), true);
      }
      this._save(this.coupons, COUPONS_DB);
  }
  set_coupon_per_user_limit(code, limit) {
    let clean_code;
      clean_code = pyStrip(pyUpper(code));
      if (pyT((pyContains(this.coupons, clean_code)))) {
            pySub(this.coupons, clean_code)["per_user_limit"] = pyInt(limit);
            this._save(this.coupons, COUPONS_DB);
            return (true);
      }
      return (false);
  }
  validate_coupon_advanced(code, user_id, purchase_amount, category, course_id, course_ids) {
    { const _k0 = __kw(category, ["category", "course_id", "course_ids"]); if (_k0) { if ("category" in _k0) category = _k0.category; if ("course_id" in _k0 && (course_id === undefined)) course_id = _k0.course_id; if ("course_ids" in _k0 && (course_ids === undefined)) course_ids = _k0.course_ids; } }
    if (__isPlainObj(category)) category = "";
    { const _k = __kw(course_id, ["course_id", "course_ids"]); if (_k) { if ("course_id" in _k) course_id = _k.course_id; if ("course_ids" in _k) course_ids = _k.course_ids; } }
    { const _k2 = __kw(course_ids, ["course_id", "course_ids"]); if (_k2) { if ((course_id === undefined || course_id === null || course_id === "")) { if ("course_id" in _k2) course_id = _k2.course_id; } if ((course_ids === undefined || course_ids === null)) { if ("course_ids" in _k2) course_ids = _k2.course_ids; } } }
    if ((category === undefined)) category = ""; if ((course_id === undefined) || __isPlainObj(course_id)) course_id = ""; if ((course_ids === undefined) || __isPlainObj(course_ids)) course_ids = null;
    let app_cat, app_ids, app_names, approved_orders, c_name, calc_disc, cid, clean_code;
    let coupon, dtype, dval, final_discount, max_d, min_p, o, p_lim;
    let per_user_limit, u, uid_str, usage_limit, used_by, used_count, user_orders, user_uses;
      clean_code = pyStrip(pyUpper(code));
      coupon = pyGet(this.coupons, clean_code);
      if (pyT((!pyT(coupon)))) {
            return ([false, 0, "Coupon not found.", null]);
      }
      if (pyT(((!pyEq(pyGet(coupon, "status", "active"), "active"))))) {
            return ([false, 0, "This coupon is currently inactive.", null]);
      }
      used_count = pyGet(coupon, "used_count", 0);
      usage_limit = pyGet(coupon, "usage_limit", pyGet(coupon, "uses", 100));
      if (pyT(((used_count >= usage_limit)))) {
            return ([false, 0, "Coupon usage limit reached.", null]);
      }
      uid_str = pyStr(user_id);
      used_by = pyGet(coupon, "used_by", {  });
      if (pyT(pyIsInstance(used_by, "list"))) {
            used_by = (() => { const __acc = []; for (const u of pyIter(used_by)) { __acc.push([pyStr(u), 1]); } const __o = {}; for (const [__k, __v] of __acc) __o[__k] = __v; return __o; })();
            coupon["used_by"] = used_by;
      }
      user_uses = pyGet(used_by, uid_str, 0);
      per_user_limit = pyGet(coupon, "per_user_limit", 1);
      if (pyT(((!(per_user_limit === null || per_user_limit === undefined))))) {
            try {
                    p_lim = pyInt(per_user_limit);
            } catch (__e) {
                    p_lim = 1;
            }
            if (pyT((((__v189) => (pyT(__v189) ? (((user_uses >= p_lim))) : __v189))(((0 < p_lim) && (p_lim < 999999)))))) {
                    if (pyT(((p_lim > 1)))) {
                              return ([false, 0, `Coupon already used (Max ${pyStr(p_lim)} times).`, null]);
                    }
                    return ([false, 0, "You have already used this coupon.", null]);
            }
      }
      min_p = pyGet(coupon, "min_purchase", 0);
      if (pyT((((__v190) => (pyT(__v190) ? (((purchase_amount < min_p))) : __v190))(((min_p > 0)))))) {
            return ([false, 0, `Minimum order of ৳${pyStr(min_p)} required.`, null]);
      }
      app_ids = (((__v191) => (pyT(__v191) ? __v191 : ([])))(pyGet(coupon, "applicable_course_ids")));
      if (pyT((((__v192) => (pyT(__v192) ? (pyGet(coupon, "applicable_course_id")) : __v192))((!pyT(app_ids)))))) {
            app_ids = [pyGet(coupon, "applicable_course_id")];
      }
      if (pyT(app_ids)) {
            app_names = (((__v193) => (pyT(__v193) ? __v193 : ([])))(pyGet(coupon, "applicable_course_names")));
            if (pyT((((__v194) => (pyT(__v194) ? (pyGet(coupon, "applicable_course_name")) : __v194))((!pyT(app_names)))))) {
                    app_names = [pyGet(coupon, "applicable_course_name")];
            }
            c_name = (pyT((pyEq(pyLen(app_names), 1))) ? (pySub(app_names, 0)) : (`${pyStr(pyLen(app_ids))} selected courses`));
            if (pyT(course_ids)) {
                    if (pyT((!pyT(pyAny(((() => { const __acc = []; for (const cid of pyIter(course_ids)) { __acc.push((pyContains(app_ids, cid))); } return __acc; })())))))) {
                              if (pyT((pyEq(pyLen(app_ids), 1)))) {
                                          return ([false, 0, `Valid only for '${pyStr(c_name)}'.`, null]);
                              }
                              return ([false, 0, `Valid only for ${pyStr(pyLen(app_ids))} selected courses.`, null]);
                    }
            } else if (pyT(course_id)) {
                    if (pyT(((!pyContains(app_ids, course_id))))) {
                              if (pyT((pyEq(pyLen(app_ids), 1)))) {
                                          return ([false, 0, `Valid only for '${pyStr(c_name)}'.`, null]);
                              }
                              return ([false, 0, `Valid only for ${pyStr(pyLen(app_ids))} selected courses.`, null]);
                    }
            }
      }
      app_cat = pyGet(coupon, "applicable_category", "All");
      if (pyT((((__v196) => (pyT(__v196) ? (((__v195) => (pyT(__v195) ? (category) : __v195))(((!pyContains(["All", "Specific"], app_cat))))) : __v196))(app_cat)))) {
            if (pyT(((!pyEq(pyLower(pyStrip(app_cat)), pyLower(pyStrip(category))))))) {
                    return ([false, 0, `Valid only for '${pyStr(app_cat)}' category.`, null]);
            }
      }
      if (pyT(pyGet(coupon, "first_order_only", false))) {
            user_orders = this.get_user_orders(user_id);
            approved_orders = ((() => { const __acc = []; for (const o of pyIter(user_orders)) { if (!pyT((pyEq(pyGet(o, "status"), "approved")))) continue; __acc.push(o); } return __acc; })());
            if (pyT(approved_orders)) {
                    return ([false, 0, "Valid only for first order.", null]);
            }
      }
      dtype = pyGet(coupon, "discount_type", "fixed");
      dval = pyGet(coupon, "discount_value", pyGet(coupon, "discount", 0));
      if (pyT((pyEq(dtype, "percentage")))) {
            calc_disc = pyInt(pyRound(((typeof purchase_amount === 'string' || Array.isArray(purchase_amount) ? pyRepeat(purchase_amount, (dval / 100.0)) : (purchase_amount * (dval / 100.0))))));
            max_d = pyGet(coupon, "max_discount", 0);
            if (pyT((((__v197) => (pyT(__v197) ? (((calc_disc > max_d))) : __v197))(((max_d > 0)))))) {
                    calc_disc = max_d;
            }
            final_discount = pyMin(calc_disc, purchase_amount);
      } else {
            final_discount = pyMin(dval, purchase_amount);
      }
      return ([true, final_discount, "Coupon applied successfully!", coupon]);
  }
  validate_coupon(code, user_id) {
    let _, disc, valid, ___1;
      [valid, disc, _, ___1] = this.validate_coupon_advanced(code, user_id, 999999);
      return ((pyT(valid) ? (disc) : (null)));
  }
  use_coupon(code, user_id) {
    let clean_code, coupon, u, uid_str, used_by;
      clean_code = pyStrip(pyUpper(code));
      coupon = pyGet(this.coupons, clean_code);
      if (pyT(coupon)) {
            coupon["used_count"] = (pyGet(coupon, "used_count", 0) + 1);
            coupon["uses"] = pyMax(0, (pyGet(coupon, "uses", 1) - 1));
            used_by = pyGet(coupon, "used_by", {  });
            if (pyT(pyIsInstance(used_by, "list"))) {
                    used_by = (() => { const __acc = []; for (const u of pyIter(used_by)) { __acc.push([pyStr(u), 1]); } const __o = {}; for (const [__k, __v] of __acc) __o[__k] = __v; return __o; })();
            }
            uid_str = pyStr(user_id);
            used_by[uid_str] = (pyGet(used_by, uid_str, 0) + 1);
            coupon["used_by"] = used_by;
            this._save(this.coupons, COUPONS_DB);
      }
  }
  trigger_referral_reward_for_order(order) {
    let coupon, coupon_code, order_amt, raw_amt, reward_amount, reward_type, reward_uid;
      coupon_code = pyStrip(pyUpper(pyGet(order, "coupon_code", "")));
      if (pyT((((__v198) => (pyT(__v198) ? __v198 : (((!pyContains(this.coupons, coupon_code))))))((!pyT(coupon_code)))))) {
            return (null);
      }
      coupon = pySub(this.coupons, coupon_code);
      if (pyT((((__v199) => (pyT(__v199) ? (pyGet(coupon, "reward_user_id")) : __v199))(pyGet(coupon, "enable_referral_reward"))))) {
            reward_uid = pyInt(pySub(coupon, "reward_user_id"));
            reward_type = pyGet(coupon, "reward_type", "fixed");
            raw_amt = pyFloat(pyGet(coupon, "reward_amount", 0));
            if (pyT((pyEq(reward_type, "percentage")))) {
                    order_amt = pyInt(pyGet(order, "amount", 0));
                    reward_amount = pyMax(1, pyInt(pyRound(((typeof order_amt === 'string' || Array.isArray(order_amt) ? pyRepeat(order_amt, (raw_amt / 100.0)) : (order_amt * (raw_amt / 100.0)))))));
            } else {
                    reward_amount = pyInt(raw_amt);
            }
            if (pyT(((reward_amount > 0)))) {
                    this.add_earning(reward_uid, reward_amount, coupon_code, pyGet(order, "order_id", "N/A"));
                    return ([reward_uid, reward_amount, coupon_code]);
            }
      }
      return (null);
  }
  get_all_coupons() {
      return (this.coupons);
  }
  get_coupon(code) {
    let c, c_copy, clean_code;
      clean_code = pyStrip(pyUpper(code));
      c = pyGet(this.coupons, clean_code);
      if (pyT(c)) {
            c_copy = pyDict(c);
            c_copy["code"] = clean_code;
            return (c_copy);
      }
      return (null);
  }
  set_coupon_status(code, status) {
    let clean_code;
      clean_code = pyStrip(pyUpper(code));
      if (pyT((pyContains(this.coupons, clean_code)))) {
            pySub(this.coupons, clean_code)["status"] = status;
            this._save(this.coupons, COUPONS_DB);
            return (true);
      }
      return (false);
  }
  deactivate_all_coupons() {
    let c, code, count;
      count = 0;
      for (const [code, c] of pyIter(pyItems(this.coupons))) {
            c["status"] = "inactive";
            count += 1;
      }
      this._save(this.coupons, COUPONS_DB);
      return (count);
  }
  activate_all_coupons() {
    let c, code, count;
      count = 0;
      for (const [code, c] of pyIter(pyItems(this.coupons))) {
            c["status"] = "active";
            count += 1;
      }
      this._save(this.coupons, COUPONS_DB);
      return (count);
  }
  delete_coupon(code) {
    let clean_code;
      clean_code = pyStrip(pyUpper(code));
      if (pyT((pyContains(this.coupons, clean_code)))) {
            pyDel(this.coupons, clean_code);
            this._save(this.coupons, COUPONS_DB);
            return (true);
      }
      return (false);
  }
  add_withdrawal(withdraw_id, data) {
      this.withdrawals[withdraw_id] = data;
      this._save(this.withdrawals, WITHDRAWALS_DB);
  }
  get_withdrawal(withdraw_id) {
    let w, w_copy;
      w = pyGet(this.withdrawals, withdraw_id);
      if (pyT(w)) {
            w_copy = pyDict(w);
            w_copy["withdraw_id"] = withdraw_id;
            return (w_copy);
      }
      return (null);
  }
  update_withdrawal(withdraw_id, data) {
      if (pyT((pyContains(this.withdrawals, withdraw_id)))) {
            pyUpdate(pySub(this.withdrawals, withdraw_id), data);
            this._save(this.withdrawals, WITHDRAWALS_DB);
      }
  }
  get_user_withdrawals(user_id) {
    let result, w, w_copy, wid;
      result = [];
      for (const [wid, w] of pyIter(pyItems(this.withdrawals))) {
            if (pyT((pyEq(pyGet(w, "user_id"), user_id)))) {
                    w_copy = pyDict(w);
                    w_copy["withdraw_id"] = wid;
                    pyAppend(result, w_copy);
            }
      }
      pySort(result, ((x) => (pyGet(x, "date", ""))), true);
      return (result);
  }
  get_pending_withdrawals() {
    let result, w, w_copy, wid;
      result = [];
      for (const [wid, w] of pyIter(pyItems(this.withdrawals))) {
            if (pyT((pyEq(pyGet(w, "status"), "pending")))) {
                    w_copy = pyDict(w);
                    w_copy["withdraw_id"] = wid;
                    pyAppend(result, w_copy);
            }
      }
      pySort(result, ((x) => (pyGet(x, "date", ""))), true);
      return (result);
  }
  get_all_withdrawals(status) {
    { const _k = __kw(status, ["status"]); if (_k) status = _k.status; }
    if ((status === undefined) || __isPlainObj(status)) status = null;
    let result, w, w_copy, wid;
      result = [];
      for (const [wid, w] of pyIter(pyItems(this.withdrawals))) {
            if (pyT((((__v200) => (pyT(__v200) ? (((!pyEq(status, "all")))) : __v200))(status)))) {
                    if (pyT(((!pyEq(pyGet(w, "status"), status))))) {
                              continue;
                    }
            }
            w_copy = pyDict(w);
            w_copy["withdraw_id"] = wid;
            pyAppend(result, w_copy);
      }
      pySort(result, ((x) => (pyGet(x, "date", ""))), true);
      return (result);
  }
  get_withdrawal_stats() {
    let all_w, approved_amt, approved_list, pending_amt, pending_list, rejected_amt, rejected_list, total_amt;
    let w;
      all_w = pyList(pyValues(this.withdrawals));
      pending_list = ((() => { const __acc = []; for (const w of pyIter(all_w)) { if (!pyT((pyEq(pyGet(w, "status"), "pending")))) continue; __acc.push(w); } return __acc; })());
      approved_list = ((() => { const __acc = []; for (const w of pyIter(all_w)) { if (!pyT((pyEq(pyGet(w, "status"), "approved")))) continue; __acc.push(w); } return __acc; })());
      rejected_list = ((() => { const __acc = []; for (const w of pyIter(all_w)) { if (!pyT((pyEq(pyGet(w, "status"), "rejected")))) continue; __acc.push(w); } return __acc; })());
      pending_amt = pySum(((() => { const __acc = []; for (const w of pyIter(pending_list)) { __acc.push(pyGet(w, "amount", 0)); } return __acc; })()));
      approved_amt = pySum(((() => { const __acc = []; for (const w of pyIter(approved_list)) { __acc.push(pyGet(w, "amount", 0)); } return __acc; })()));
      rejected_amt = pySum(((() => { const __acc = []; for (const w of pyIter(rejected_list)) { __acc.push(pyGet(w, "amount", 0)); } return __acc; })()));
      total_amt = (pending_amt + approved_amt);
      return ({ total_count: pyLen(all_w), total_amount: total_amt, pending_count: pyLen(pending_list), pending_amount: pending_amt, approved_count: pyLen(approved_list), approved_amount: approved_amt, rejected_count: pyLen(rejected_list), rejected_amount: rejected_amt });
  }
  get_paginated_withdrawals(status, page, per_page) {
    { const _k = __kw(status, ["status", "page", "per_page"]); if (_k) { if ("status" in _k) status = _k.status; if ("page" in _k) page = _k.page; if ("per_page" in _k) per_page = _k.per_page; } }
    if ((status === undefined) || __isPlainObj(status)) status = null;
    if ((page === undefined || page === null) || __isPlainObj(page)) page = 1;
    if ((per_page === undefined || per_page === null) || __isPlainObj(per_page)) per_page = 6;
    let all_items, current_page, end_idx, start_idx, total_count, total_pages;
      all_items = this.get_all_withdrawals(status);
      total_count = pyLen(all_items);
      total_pages = pyMax(1, pyMathCeil((total_count / per_page)));
      current_page = pyMax(1, pyMin(page, total_pages));
      start_idx = ((typeof (current_page - 1) === 'string' || Array.isArray((current_page - 1)) ? pyRepeat((current_page - 1), per_page) : ((current_page - 1) * per_page)));
      end_idx = (start_idx + per_page);
      return ([pySlice(all_items, start_idx, end_idx, null), total_pages]);
  }
  search_withdrawals(query) {
    let found, q, w, w_acc, w_copy, w_meth, w_name, w_uname;
    let w_user, wid;
      q = pyLower(pyStrip(query));
      if (pyT((!pyT(q)))) {
            return ([]);
      }
      found = [];
      for (const [wid, w] of pyIter(pyItems(this.withdrawals))) {
            w_user = pyLower(pyStr(pyGet(w, "user_id", "")));
            w_name = pyLower(pyStr(pyGet(w, "full_name", "")));
            w_uname = pyLower(pyStr(pyGet(w, "username", "")));
            w_acc = pyLower(pyStr(pyGet(w, "account", "")));
            w_meth = pyLower(pyStr(pyGet(w, "method", "")));
            if (pyT((((__v205) => (pyT(__v205) ? __v205 : (((__v204) => (pyT(__v204) ? __v204 : (((__v203) => (pyT(__v203) ? __v203 : (((__v202) => (pyT(__v202) ? __v202 : (((__v201) => (pyT(__v201) ? __v201 : ((pyContains(w_meth, q)))))((pyContains(w_acc, q))))))((pyContains(w_uname, q))))))((pyContains(w_name, q))))))((pyContains(w_user, q))))))((pyContains(pyLower(wid), q)))))) {
                    w_copy = pyDict(w);
                    w_copy["withdraw_id"] = wid;
                    pyAppend(found, w_copy);
            }
      }
      pySort(found, ((x) => (pyGet(x, "date", ""))), true);
      return (found);
  }
  approve_withdrawal(withdraw_id) {
    let w;
      w = this.get_withdrawal(withdraw_id);
      if (pyT((((__v206) => (pyT(__v206) ? ((pyEq(pyGet(w, "status"), "pending"))) : __v206))(w)))) {
            this.update_withdrawal(withdraw_id, { status: "approved", processed_date: pyStr(pyNow()) });
            return (true);
      }
      return (false);
  }
  reject_withdrawal(withdraw_id) {
    let w;
      w = this.get_withdrawal(withdraw_id);
      if (pyT((((__v207) => (pyT(__v207) ? ((pyEq(pyGet(w, "status"), "pending"))) : __v207))(w)))) {
            this.update_withdrawal(withdraw_id, { status: "rejected", processed_date: pyStr(pyNow()) });
            this.refund_balance(pySub(w, "user_id"), pyGet(w, "amount", 0));
            return (true);
      }
      return (false);
  }
  get_stats() {
    let o, pending_orders, pending_withdrawals, total_courses, total_ebooks, total_orders, total_revenue, total_users;
    let total_withdrawn, w;
      total_users = pyLen(this.users);
      total_courses = pyLen(this.courses);
      total_ebooks = pyLen(this.ebooks);
      total_orders = pyLen(this.orders);
      pending_orders = pySum(((() => { const __acc = []; for (const o of pyIter(pyValues(this.orders))) { if (!pyT((pyEq(pyGet(o, "status"), "pending")))) continue; __acc.push(1); } return __acc; })()));
      pending_withdrawals = pySum(((() => { const __acc = []; for (const w of pyIter(pyValues(this.withdrawals))) { if (!pyT((pyEq(pyGet(w, "status"), "pending")))) continue; __acc.push(1); } return __acc; })()));
      total_revenue = pySum(((() => { const __acc = []; for (const o of pyIter(pyValues(this.orders))) { if (!pyT((pyEq(pyGet(o, "status"), "approved")))) continue; __acc.push(pyGet(o, "amount", 0)); } return __acc; })()));
      total_withdrawn = pySum(((() => { const __acc = []; for (const w of pyIter(pyValues(this.withdrawals))) { if (!pyT((pyEq(pyGet(w, "status"), "approved")))) continue; __acc.push(pyGet(w, "amount", 0)); } return __acc; })()));
      return ({ total_users: total_users, total_courses: total_courses, total_ebooks: total_ebooks, total_orders: total_orders, pending_orders: pending_orders, pending_withdrawals: pending_withdrawals, total_revenue: total_revenue, total_withdrawn: total_withdrawn });
  }
  get_admins() {
    let aid;
      for (const aid of pyIter(ADMIN_IDS)) {
            if (pyT(((!pyContains(this.admins, aid))))) {
                    pyAppend(this.admins, aid);
            }
      }
      return (pyList(this.admins));
  }
  is_admin(user_id) {
    let uid;
      if (pyT((!pyT(user_id)))) {
            return (false);
      }
      try {
            uid = pyInt(user_id);
      } catch (__e) {
            return (false);
      }
      return ((((__v208) => (pyT(__v208) ? __v208 : ((pyContains(ADMIN_IDS, uid)))))((pyContains(this.get_admins(), uid)))));
  }
  is_super_admin(user_id) {
    let uid;
      if (pyT((!pyT(user_id)))) {
            return (false);
      }
      try {
            uid = pyInt(user_id);
      } catch (__e) {
            return (false);
      }
      return ((((__v209) => (pyT(__v209) ? ((pyEq(uid, pySub(ADMIN_IDS, 0)))) : __v209))(((pyLen(ADMIN_IDS) > 0)))));
  }
  get_admin_permissions(user_id) {
    let k, uid_str, updated, user_perms;
      uid_str = pyStr(user_id);
      if (pyT(this.is_super_admin(user_id))) {
            return ((() => { const __acc = []; for (const k of pyIter(pyKeys(ADMIN_PERMISSION_DEFINITIONS))) { __acc.push([k, true]); } const __o = {}; for (const [__k, __v] of __acc) __o[__k] = __v; return __o; })());
      }
      user_perms = pyGet(this.admin_permissions, uid_str);
      if (pyT(((user_perms === null || user_perms === undefined)))) {
            user_perms = (() => { const __acc = []; for (const k of pyIter(pyKeys(ADMIN_PERMISSION_DEFINITIONS))) { __acc.push([k, true]); } const __o = {}; for (const [__k, __v] of __acc) __o[__k] = __v; return __o; })();
            this.admin_permissions[uid_str] = user_perms;
            this._save_raw(this.admin_permissions, ADMIN_PERMISSIONS_DB);
      } else {
            updated = false;
            for (const k of pyIter(pyKeys(ADMIN_PERMISSION_DEFINITIONS))) {
                    if (pyT(((!pyContains(user_perms, k))))) {
                              user_perms[k] = true;
                              updated = true;
                    }
            }
            if (pyT(updated)) {
                    this.admin_permissions[uid_str] = user_perms;
                    this._save_raw(this.admin_permissions, ADMIN_PERMISSIONS_DB);
            }
      }
      return (pyDict(user_perms));
  }
  has_permission(user_id, perm_key) {
    let perms;
      if (pyT((!pyT(this.is_admin(user_id))))) {
            return (false);
      }
      if (pyT(this.is_super_admin(user_id))) {
            return (true);
      }
      perms = this.get_admin_permissions(user_id);
      return (pyT(pyGet(perms, perm_key, true)));
  }
  toggle_admin_permission(user_id, perm_key) {
    let perms, uid_str;
      uid_str = pyStr(user_id);
      perms = this.get_admin_permissions(user_id);
      if (pyT((pyContains(ADMIN_PERMISSION_DEFINITIONS, perm_key)))) {
            perms[perm_key] = (!pyT(pyGet(perms, perm_key, true)));
            this.admin_permissions[uid_str] = perms;
            this._save_raw(this.admin_permissions, ADMIN_PERMISSIONS_DB);
            return (pySub(perms, perm_key));
      }
      return (false);
  }
  set_admin_permission(user_id, perm_key, value) {
    let perms, uid_str;
      uid_str = pyStr(user_id);
      perms = this.get_admin_permissions(user_id);
      if (pyT((pyContains(ADMIN_PERMISSION_DEFINITIONS, perm_key)))) {
            perms[perm_key] = pyT(value);
            this.admin_permissions[uid_str] = perms;
            this._save_raw(this.admin_permissions, ADMIN_PERMISSIONS_DB);
            return (true);
      }
      return (false);
  }
  add_admin(user_id, added_by) {
    let uid;
      try {
            uid = pyInt(user_id);
      } catch (__e) {
            return (false);
      }
      if (pyT(((!pyContains(this.admins, uid))))) {
            pyAppend(this.admins, uid);
            this._save_raw(this.admins, ADMINS_DB);
            this.get_admin_permissions(uid);
            return (true);
      }
      return (false);
  }
  remove_admin(user_id) {
    let uid;
      try {
            uid = pyInt(user_id);
      } catch (__e) {
            return (false);
      }
      if (pyT((((__v211) => (pyT(__v211) ? (((__v210) => (pyT(__v210) ? ((pyEq(uid, pySub(ADMIN_IDS, 0)))) : __v210))(((pyLen(ADMIN_IDS) > 0)))) : __v211))((pyContains(ADMIN_IDS, uid)))))) {
            return (false);
      }
      if (pyT((pyContains(this.admins, uid)))) {
            pyRemove(this.admins, uid);
            this._save_raw(this.admins, ADMINS_DB);
            if (pyT((pyContains(this.admin_permissions, pyStr(uid))))) {
                    pyPop(this.admin_permissions, pyStr(uid), null);
                    this._save_raw(this.admin_permissions, ADMIN_PERMISSIONS_DB);
            }
            return (true);
      }
      return (false);
  }
  _load_keyboards(filename) {
    let data, defaults, e, f;
      if (pyT(pyFileExists(filename))) {
            try {
                    f = pyReadFile(filename);
                    data = pyJsonParse(f);
                    if (pyT((((__v212) => (pyT(__v212) ? ((pyContains(data, "buttons"))) : __v212))(pyIsInstance(data, "dict"))))) {
                              return (data);
                    }
            } catch (e) {
                    pyPrint(`Error loading keyboards: ${pyStr(e)}`);
            }
      }
      defaults = { buttons: [[{ text: "🛍️ Cart", action: "cart" }, { text: "👤 Profile", action: "profile" }, { text: "ℹ Info", action: "info" }], [{ text: "⚙ Admin Panel", action: "admin", admin_only: true }]] };
      this._save_raw(defaults, filename);
      return (defaults);
  }
  get_custom_keyboards() {
      return (this.keyboards);
  }
  save_custom_keyboards(keyboards) {
      this.keyboards = keyboards;
      this._save_raw(keyboards, KEYBOARDS_DB);
  }
  move_course_order(course_id, direction) {
    let category, cid, course, current_folder, current_index, folder, idx, keys;
    let new_courses, other_id, other_index, sibling_ids, subcategory;
      if (pyT(((!pyContains(this.courses, course_id))))) {
            return (false);
      }
      const folder_key = (course) => {
        let category, folder, subcategory;
        folder = pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > ");
        if (pyT(folder)) {
            return (pyLower(folder));
        }
        category = pyStrip(pyStr(pyGet(course, "category", "")));
        subcategory = pyStrip(pyStr(pyGet(course, "subcategory", "")));
        return (pyLower((pyT((((__v213) => (pyT(__v213) ? __v213 : ((pyEq(pyLower(subcategory), "general")))))((!pyT(subcategory))))) ? (category) : (`${pyStr(category)} > ${pyStr(subcategory)}`))));
      };
      current_folder = folder_key(pySub(this.courses, course_id));
      sibling_ids = ((() => { const __acc = []; for (const [cid, course] of pyIter(pyItems(this.courses))) { if (!pyT((pyEq(folder_key(course), current_folder)))) continue; __acc.push(cid); } return __acc; })());
      idx = pyIndex(sibling_ids, course_id);
      if (pyT((pyEq(direction, "up")))) {
            if (pyT((pyEq(idx, 0)))) {
                    return (false);
            }
            other_id = pySub(sibling_ids, (idx - 1));
      } else if (pyT((pyEq(direction, "down")))) {
            if (pyT((pyEq(idx, (pyLen(sibling_ids) - 1))))) {
                    return (false);
            }
            other_id = pySub(sibling_ids, (idx + 1));
      } else {
            return (false);
      }
      keys = pyList(pyKeys(this.courses));
      current_index = pyIndex(keys, course_id);
      other_index = pyIndex(keys, other_id);
      const __un9 = ([pySub(keys, other_index), pySub(keys, current_index)]); keys[current_index] = __un9[0]; keys[other_index] = __un9[1];
      new_courses = {  };
      for (const cid of pyIter(keys)) {
            new_courses[cid] = pySub(this.courses, cid);
      }
      this.courses = new_courses;
      this._save(this.courses, COURSES_DB);
      return (true);
  }
  move_course_to(course_id, new_index) {
    let category, cid, course, current_folder, folder, k, keys, new_courses;
    let new_i, old_i, pred, s, sibs, sibs_wo, subcategory;
      if (pyT(((!pyContains(this.courses, course_id))))) {
            return (false);
      }
      const folder_key = (course) => {
        let category, folder, subcategory;
        folder = pyReplace(pyReplace(pyStrip(pyStr(pyGet(course, "folder_path", ""))), " / ", " > "), "/", " > ");
        if (pyT(folder)) {
            return (pyLower(folder));
        }
        category = pyStrip(pyStr(pyGet(course, "category", "")));
        subcategory = pyStrip(pyStr(pyGet(course, "subcategory", "")));
        return (pyLower((pyT((((__v214) => (pyT(__v214) ? __v214 : ((pyEq(pyLower(subcategory), "general")))))((!pyT(subcategory))))) ? (category) : (`${pyStr(category)} > ${pyStr(subcategory)}`))));
      };
      current_folder = folder_key(pySub(this.courses, course_id));
      sibs = ((() => { const __acc = []; for (const [cid, course] of pyIter(pyItems(this.courses))) { if (!pyT((pyEq(folder_key(course), current_folder)))) continue; __acc.push(cid); } return __acc; })());
      if (pyT(((!pyContains(sibs, course_id))))) {
            return (false);
      }
      old_i = pyIndex(sibs, course_id);
      new_i = pyMax(0, pyMin((pyLen(sibs) - 1), pyInt(new_index)));
      if (pyT((pyEq(new_i, old_i)))) {
            return (false);
      }
      pyPop(sibs, old_i);
      pyInsert(sibs, new_i, course_id);
      keys = ((() => { const __acc = []; for (const k of pyIter(pyKeys(this.courses))) { if (!pyT(((!pyEq(k, course_id))))) continue; __acc.push(k); } return __acc; })());
      sibs_wo = ((() => { const __acc = []; for (const s of pyIter(sibs)) { if (!pyT(((!pyEq(s, course_id))))) continue; __acc.push(s); } return __acc; })());
      if (pyT((pyEq(new_i, 0)))) {
            pyInsert(keys, pyIndex(keys, pySub(sibs_wo, 0)), course_id);
      } else {
            pred = pySub(sibs, (new_i - 1));
            pyInsert(keys, (pyIndex(keys, pred) + 1), course_id);
      }
      new_courses = {  };
      for (const cid of pyIter(keys)) {
            new_courses[cid] = pySub(this.courses, cid);
      }
      this.courses = new_courses;
      this._save(this.courses, COURSES_DB);
      return (true);
  }
  clone_course(course_id) {
    let course, new_course, new_id;
      course = this.get_course(course_id);
      if (pyT((!pyT(course)))) {
            return (null);
      }
      // import elided: time
      new_id = `COURSE-CLONE-${pyStr(pyInt(pyTimestamp()))}`;
      while (pyT((pyContains(this.courses, new_id)))) {
            new_id = `${pyStr(new_id)}-${pyStr(pyInt(pyTimestamp() * 1000) % 100000)}`;
      }
      new_course = pyDict(course);
      new_course["id"] = new_id;
      new_course["name"] = `${pyStr(pySub(course, "name"))} (Copy)`;
      this.courses[new_id] = new_course;
      this._save(this.courses, COURSES_DB);
      return (new_id);
  }
  toggle_course_status(course_id) {
    let course, current_status, new_status;
      course = this.get_course(course_id);
      if (pyT((!pyT(course)))) {
            return (null);
      }
      current_status = pyGet(course, "status", "active");
      new_status = (pyT(((!pyEq(current_status, "inactive")))) ? ("inactive") : ("active"));
      course["status"] = new_status;
      this.courses[course_id] = course;
      this._save(this.courses, COURSES_DB);
      return (new_status);
  }
  _load_settings(filename) {
    let defaults, e, f;
      if (pyT(pyFileExists(filename))) {
            try {
                    f = pyReadFile(filename);
                    return (pyJsonParse(f));
            } catch (e) {
                    pyPrint(`Error loading settings: ${pyStr(e)}`);
            }
      }
      defaults = { maintenance_mode: false, maintenance_message: "🛠️ **StudyMart Bot is currently undergoing scheduled maintenance.**\n\nWe are updating our courses and systems to serve you better. We will be back online shortly! Thank you for your patience." };
      this._save_raw(defaults, filename);
      return (defaults);
  }
  get_setting(key, default_) {
    if ((default_ === undefined)) default_ = null;
    let val;
      val = pyGet(this.settings, key);
      if (pyT((((__v216) => (pyT(__v216) ? __v216 : ((((__v215) => (pyT(__v215) ? ((!pyT(pyStrip(val)))) : __v215))(pyIsInstance(val, "str"))))))(((val === null || val === undefined)))))) {
            return (default_);
      }
      return (val);
  }
  set_setting(key, value) {
      this.settings[key] = value;
      this._save_raw(this.settings, SETTINGS_DB);
      return (true);
  }
  delete_setting(key) {
      if (pyT((pyContains(this.settings, key)))) {
            pyDel(this.settings, key);
            this._save_raw(this.settings, SETTINGS_DB);
            return (true);
      }
      return (false);
  }
  is_home_button_enabled() {
      return (this.get_setting("show_home_button", true));
  }
  toggle_home_button() {
    let current;
      current = this.is_home_button_enabled();
      this.set_setting("show_home_button", (!pyT(current)));
      return ((!pyT(current)));
  }
  is_view_all_courses_enabled() {
      return (this.get_setting("show_view_all_courses", true));
  }
  toggle_view_all_courses() {
    let current;
      current = this.is_view_all_courses_enabled();
      this.set_setting("show_view_all_courses", (!pyT(current)));
      return ((!pyT(current)));
  }
  get_min_withdraw_amount() {
      try {
            const _v = this.get_setting("min_withdraw_amount", MIN_WITHDRAW_AMOUNT);
            if ((_v === null || _v === undefined)) return (MIN_WITHDRAW_AMOUNT);
            return (pyMax(1, pyInt(_v)));
      } catch (__e) {
            return (MIN_WITHDRAW_AMOUNT);
      }
  }
  set_min_withdraw_amount(amount) {
      try {
            amount = pyMax(1, pyInt(amount));
      } catch (__e) {
            amount = 50;
      }
      this.set_setting("min_withdraw_amount", amount);
      return (amount);
  }
  _clamp_row_size(v, default_) {
    if ((default_ === undefined) || __isPlainObj(default_)) default_ = __kwVal(default_, "default", 2);
    let n;
      try {
            n = pyInt(v);
      } catch (__e) {
            return (default_);
      }
      return (pyMax(1, pyMin(4, n)));
  }
  get_category_row_size() {
      return (this._clamp_row_size(this.get_setting("category_buttons_per_row", CATEGORY_BUTTONS_PER_ROW), CATEGORY_BUTTONS_PER_ROW));
  }
  set_category_row_size(n) {
      n = this._clamp_row_size(n);
      this.set_setting("category_buttons_per_row", n);
      return (n);
  }
  get_subcategory_row_size() {
      return (this._clamp_row_size(this.get_setting("subcategory_buttons_per_row", SUBCATEGORY_BUTTONS_PER_ROW), SUBCATEGORY_BUTTONS_PER_ROW));
  }
  set_subcategory_row_size(n) {
      n = this._clamp_row_size(n);
      this.set_setting("subcategory_buttons_per_row", n);
      return (n);
  }
  get_inline_buttons_config() {
    let btn, buttons, c_idx, config, home_grid, r_idx, row;
      config = this.get_setting("inline_buttons_config");
      if (pyT((((__v217) => (pyT(__v217) ? __v217 : ((!pyT(pyIsInstance(config, "dict"))))))((!pyT(config)))))) {
            buttons = [];
            home_grid = this.get_setting("home_keyboard_grid");
            if (pyT((((__v218) => (pyT(__v218) ? (pyIsInstance(home_grid, "list")) : __v218))(home_grid)))) {
                    for (const [r_idx, row] of pyIter(pyEnumerate(home_grid))) {
                              if (pyT(pyIsInstance(row, "list"))) {
                                          for (const [c_idx, btn] of pyIter(pyEnumerate(row))) {
                                                        if (pyT(pyIsInstance(btn, "dict"))) {
                                                                        pyAppend(buttons, { id: `ibtn_home_${pyStr(r_idx)}_${pyStr(c_idx)}`, text: pyGet(btn, "text", "Button"), action: pyGet(btn, "action", ""), target: "home", enabled: pyGet(btn, "enabled", true), row: r_idx, col: c_idx });
                                                        }
                                          }
                              }
                    }
            }
            config = { master_enabled: true, section_status: { home: true, categories: true, ebooks: true, support: true, delivery: true, profile: true, global: true }, buttons: buttons };
            this.set_setting("inline_buttons_config", config);
      }
      return (config);
  }
  save_inline_buttons_config(config) {
      return (this.set_setting("inline_buttons_config", config));
  }
  is_inline_buttons_master_enabled() {
    let cfg;
      cfg = this.get_inline_buttons_config();
      return (pyGet(cfg, "master_enabled", true));
  }
  toggle_inline_buttons_master() {
    let cfg, current;
      cfg = this.get_inline_buttons_config();
      current = pyGet(cfg, "master_enabled", true);
      cfg["master_enabled"] = (!pyT(current));
      this.save_inline_buttons_config(cfg);
      return ((!pyT(current)));
  }
  is_inline_section_enabled(section) {
    let cfg, section_status;
      cfg = this.get_inline_buttons_config();
      section_status = pyGet(cfg, "section_status", {  });
      return (pyGet(section_status, section, true));
  }
  toggle_inline_section(section) {
    let cfg, current;
      cfg = this.get_inline_buttons_config();
      if (pyT(((!pyContains(cfg, "section_status"))))) {
            cfg["section_status"] = {  };
      }
      current = pyGet(pySub(cfg, "section_status"), section, true);
      pySub(cfg, "section_status")[section] = (!pyT(current));
      this.save_inline_buttons_config(cfg);
      return ((!pyT(current)));
  }
  get_inline_buttons(target_filter) {
    let b, buttons, cfg;
      cfg = this.get_inline_buttons_config();
      buttons = pyGet(cfg, "buttons", []);
      if (pyT(target_filter)) {
            return (((() => { const __acc = []; for (const b of pyIter(buttons)) { if (!pyT((pyEq(pyGet(b, "target"), target_filter)))) continue; __acc.push(b); } return __acc; })()));
      }
      return (buttons);
  }
  get_inline_button_by_id(button_id) {
    let b, cfg;
      cfg = this.get_inline_buttons_config();
      for (const b of pyIter(pyGet(cfg, "buttons", []))) {
            if (pyT((pyEq(pyGet(b, "id"), button_id)))) {
                    return (b);
            }
      }
      return (null);
  }
  add_inline_button(text, action, target, enabled, row, col) {
    { const _k = __kw(text, ["text", "action", "target", "enabled", "row", "col"]); if (_k) { if ("text" in _k) text = _k.text; if ("action" in _k) action = _k.action; if ("target" in _k) target = _k.target; if ("enabled" in _k) enabled = _k.enabled; if ("row" in _k) row = _k.row; if ("col" in _k) col = _k.col; } }
    if (__isPlainObj(text)) text = ""; if ((target === undefined) || __isPlainObj(target)) target = "home"; if ((enabled === undefined)) enabled = true;
    let b, btn_id, cfg, new_btn, target_buttons;
      cfg = this.get_inline_buttons_config();
      if (pyT(((!pyContains(cfg, "buttons"))))) {
            cfg["buttons"] = [];
      }
      target_buttons = ((() => { const __acc = []; for (const b of pyIter(pySub(cfg, "buttons"))) { if (!pyT((pyEq(pyGet(b, "target"), target)))) continue; __acc.push(b); } return __acc; })());
      if (pyT(((row === null || row === undefined)))) {
            if (pyT(target_buttons)) {
                    row = (pyMax(((() => { const __acc = []; for (const b of pyIter(target_buttons)) { __acc.push(pyGet(b, "row", 0)); } return __acc; })())) + 1);
            } else {
                    row = 0;
            }
      }
      if (pyT(((col === null || col === undefined)))) {
            col = 0;
      }
      // import elided: time
      btn_id = `ibtn_${pyStr(pyInt(((typeof pyTimestamp() === 'string' || Array.isArray(pyTimestamp()) ? pyRepeat(pyTimestamp(), 1000) : (pyTimestamp() * 1000)))))}_${pyStr(pyLen(pySub(cfg, "buttons")))}`;
      new_btn = { id: btn_id, text: pyStrip(text), action: pyStrip(action), target: target, enabled: enabled, row: row, col: col };
      pyAppend(pySub(cfg, "buttons"), new_btn);
      this.save_inline_buttons_config(cfg);
      return (new_btn);
  }
  add_multiple_inline_buttons(button_pairs, target) {
    let action, count, text;
      count = 0;
      for (const [text, action] of pyIter(button_pairs)) {
            if (pyT((((__v219) => (pyT(__v219) ? (action) : __v219))(text)))) {
                    this.add_inline_button(text, action, target, true);
                    count += 1;
            }
      }
      return (count);
  }
  delete_inline_button(button_id) {
    let b, cfg, orig_len;
      cfg = this.get_inline_buttons_config();
      orig_len = pyLen(pyGet(cfg, "buttons", []));
      cfg["buttons"] = ((() => { const __acc = []; for (const b of pyIter(pyGet(cfg, "buttons", []))) { if (!pyT(((!pyEq(pyGet(b, "id"), button_id))))) continue; __acc.push(b); } return __acc; })());
      if (pyT(((pyLen(pySub(cfg, "buttons")) < orig_len)))) {
            this.save_inline_buttons_config(cfg);
            return (true);
      }
      return (false);
  }
  delete_all_inline_buttons(target) {
    let b, cfg, deleted_count;
      cfg = this.get_inline_buttons_config();
      if (pyT(target)) {
            deleted_count = pySum(((() => { const __acc = []; for (const b of pyIter(pyGet(cfg, "buttons", []))) { if (!pyT((pyEq(pyGet(b, "target"), target)))) continue; __acc.push(1); } return __acc; })()));
            cfg["buttons"] = ((() => { const __acc = []; for (const b of pyIter(pyGet(cfg, "buttons", []))) { if (!pyT(((!pyEq(pyGet(b, "target"), target))))) continue; __acc.push(b); } return __acc; })());
      } else {
            deleted_count = pyLen(pyGet(cfg, "buttons", []));
            cfg["buttons"] = [];
      }
      this.save_inline_buttons_config(cfg);
      return (deleted_count);
  }
  update_inline_button(button_id, updates) {
    let b, cfg;
      cfg = this.get_inline_buttons_config();
      for (const b of pyIter(pyGet(cfg, "buttons", []))) {
            if (pyT((pyEq(pyGet(b, "id"), button_id)))) {
                    pyUpdate(b, updates);
                    this.save_inline_buttons_config(cfg);
                    return (true);
            }
      }
      return (false);
  }
  move_inline_button_target(button_id, new_target) {
      return (this.update_inline_button(button_id, { target: new_target }));
  }
  toggle_inline_button_status(button_id) {
    let btn, new_status;
      btn = this.get_inline_button_by_id(button_id);
      if (pyT((!pyT(btn)))) {
            return (null);
      }
      new_status = (!pyT(pyGet(btn, "enabled", true)));
      this.update_inline_button(button_id, { enabled: new_status });
      return (new_status);
  }
  move_inline_button_position(button_id, direction) {
    let b, buttons, cfg, curr_pos, i, idx, next_idx, prev_idx;
    let same_target_indices, target;
      cfg = this.get_inline_buttons_config();
      buttons = pyGet(cfg, "buttons", []);
      idx = pyNext(((() => { const __acc = []; for (const [i, b] of pyIter(pyEnumerate(buttons))) { if (!pyT((pyEq(pyGet(b, "id"), button_id)))) continue; __acc.push(i); } return __acc; })()), (-(1)));
      if (pyT((pyEq(idx, (-(1)))))) {
            return (false);
      }
      target = pyGet(pySub(buttons, idx), "target");
      same_target_indices = ((() => { const __acc = []; for (const [i, b] of pyIter(pyEnumerate(buttons))) { if (!pyT((pyEq(pyGet(b, "target"), target)))) continue; __acc.push(i); } return __acc; })());
      curr_pos = pyIndex(same_target_indices, idx);
      if (pyT((pyEq(direction, "up")))) {
            if (pyT((pyEq(curr_pos, 0)))) {
                    return (false);
            }
            prev_idx = pySub(same_target_indices, (curr_pos - 1));
            const __un10 = ([pySub(buttons, prev_idx), pySub(buttons, idx)]); buttons[idx] = __un10[0]; buttons[prev_idx] = __un10[1];
      } else if (pyT((pyEq(direction, "down")))) {
            if (pyT((pyEq(curr_pos, (pyLen(same_target_indices) - 1))))) {
                    return (false);
            }
            next_idx = pySub(same_target_indices, (curr_pos + 1));
            const __un11 = ([pySub(buttons, next_idx), pySub(buttons, idx)]); buttons[idx] = __un11[0]; buttons[next_idx] = __un11[1];
      } else {
            return (false);
      }
      this.save_inline_buttons_config(cfg);
      return (true);
  }
  get_active_inline_buttons_for_target(target, specific_cat) {
    let b, b_target, base_section, cfg, result;
      if (pyT((!pyT(this.is_inline_buttons_master_enabled())))) {
            return ([]);
      }
      base_section = (pyT((pyContains(target, ":"))) ? (pySub(pySplit(target, ":", -1), 0)) : (target));
      if (pyT((!pyT(this.is_inline_section_enabled(base_section))))) {
            return ([]);
      }
      cfg = this.get_inline_buttons_config();
      result = [];
      for (const b of pyIter(pyGet(cfg, "buttons", []))) {
            if (pyT(pyGet(b, "enabled", true))) {
                    b_target = pyGet(b, "target", "");
                    if (pyT((pyEq(b_target, target)))) {
                              pyAppend(result, b);
                    } else if (pyT((((__v220) => (pyT(__v220) ? ((pyEq(b_target, `cat:${pyStr(specific_cat)}`))) : __v220))(specific_cat)))) {
                              pyAppend(result, b);
                    } else if (pyT((((__v221) => (pyT(__v221) ? ((pyEq(b_target, "global"))) : __v221))(((!pyEq(target, "global"))))))) {
                              pyAppend(result, b);
                    }
            }
      }
      return (result);
  }
  get_info_settings() {
    let cfg, header;
      cfg = this.get_setting("info_menu_settings");
      if (pyT((((__v222) => (pyT(__v222) ? __v222 : ((!pyT(pyIsInstance(cfg, "dict"))))))((!pyT(cfg)))))) {
            header = this.get_setting("info_message", "Help🤠\n\nSelect an option below for purchasing guides, general questions, or direct support:");
            cfg = { header_text: header, header_media_type: "none", header_media_file_id: "", items: { contact: { label: "💬 Contact Support", enabled: true, type: "contact", content: "" }, how_to_buy: { label: "📖 How to Buy", enabled: true, type: "text", content: "" }, about: { label: "🎓 About StudyMart", enabled: true, type: "text", content: "" }, terms: { label: "📜 Terms & Policy", enabled: true, type: "text", content: "" } }, custom_buttons: [] };
            this.set_setting("info_menu_settings", cfg);
      }
      return (cfg);
  }
  save_info_settings(cfg) {
      return (this.set_setting("info_menu_settings", cfg));
  }
  set_info_header_text(text) {
    let cfg;
      cfg = this.get_info_settings();
      cfg["header_text"] = pyStrip(text);
      this.set_setting("info_message", pyStrip(text));
      return (this.save_info_settings(cfg));
  }
  get_info_header_media() {
    let cfg, fid, mtype;
      cfg = this.get_info_settings();
      mtype = pyLower(pyStr((((__v223) => (pyT(__v223) ? __v223 : ("none")))(pyGet(cfg, "header_media_type", "none")))));
      fid = (((__v224) => (pyT(__v224) ? __v224 : ("")))(pyGet(cfg, "header_media_file_id", "")));
      if (pyT((((__v225) => (pyT(__v225) ? __v225 : ((!pyT(fid)))))(((!pyContains(["photo", "animation"], mtype))))))) {
            return (["none", ""]);
      }
      return ([mtype, fid]);
  }
  set_info_header_media(mtype, file_id) {
    let cfg;
      mtype = pyLower(pyStr((((__v226) => (pyT(__v226) ? __v226 : ("none")))(mtype))));
      if (pyT(((!pyContains(["photo", "animation"], mtype))))) {
            [mtype, file_id] = ["none", ""];
      }
      cfg = this.get_info_settings();
      cfg["header_media_type"] = mtype;
      cfg["header_media_file_id"] = (pyT(((!pyEq(mtype, "none")))) ? (file_id) : (""));
      return (this.save_info_settings(cfg));
  }
  update_info_item(item_key, label, content, enabled, header, media_type, media_file_id) {
    { const _k = __kw(label, ["label", "content", "enabled", "header", "media_type", "media_file_id"]); if (_k) { if ("label" in _k) label = _k.label; if ("content" in _k) content = _k.content; if ("enabled" in _k) enabled = _k.enabled; if ("header" in _k) header = _k.header; if ("media_type" in _k) media_type = _k.media_type; if ("media_file_id" in _k) media_file_id = _k.media_file_id; } }
    if (__isPlainObj(label)) label = null; if (__isPlainObj(content)) content = null; if (__isPlainObj(enabled)) enabled = null; if (__isPlainObj(header)) header = null; if (__isPlainObj(media_type)) media_type = null; if (__isPlainObj(media_file_id)) media_file_id = null;
    let cfg, mt;
      cfg = this.get_info_settings();
      if (pyT(((!pyContains(cfg, "items"))))) {
            cfg["items"] = {  };
      }
      if (pyT(((!pyContains(pySub(cfg, "items"), item_key))))) {
            pySub(cfg, "items")[item_key] = { label: item_key, enabled: true, type: "text", content: "" };
      }
      if (pyT(((!(label === null || label === undefined))))) {
            pySub(pySub(cfg, "items"), item_key)["label"] = pyStrip(label);
      }
      if (pyT(((!(content === null || content === undefined))))) {
            pySub(pySub(cfg, "items"), item_key)["content"] = pyStrip(content);
      }
      if (pyT(((!(enabled === null || enabled === undefined))))) {
            pySub(pySub(cfg, "items"), item_key)["enabled"] = pyT(enabled);
      }
      if (pyT(((!(header === null || header === undefined))))) {
            pySub(pySub(cfg, "items"), item_key)["header"] = pyStrip(header);
      }
      if (pyT(((!(media_type === null || media_type === undefined))))) {
            mt = pyLower(pyStr((((__v227) => (pyT(__v227) ? __v227 : ("none")))(media_type))));
            if (pyT(((!pyContains(["photo", "animation"], mt))))) {
                    [mt, media_file_id] = ["none", ""];
            }
            pySub(pySub(cfg, "items"), item_key)["media_type"] = mt;
            pySub(pySub(cfg, "items"), item_key)["media_file_id"] = (pyT(((!pyEq(mt, "none")))) ? (media_file_id) : (""));
      }
      return (this.save_info_settings(cfg));
  }
  toggle_info_item_status(item_key) {
    let cfg, cur, new_val;
      cfg = this.get_info_settings();
      if (pyT(((!pyContains(cfg, "items"))))) {
            cfg["items"] = {  };
      }
      cur = pyGet(pyGet(pySub(cfg, "items"), item_key, {  }), "enabled", true);
      new_val = (!pyT(cur));
      this.update_info_item(item_key, { enabled: new_val });
      return (new_val);
  }
  reset_info_item(item_key) {
    let cfg, defaults;
      cfg = this.get_info_settings();
      if (pyT((((__v228) => (pyT(__v228) ? ((pyContains(pySub(cfg, "items"), item_key))) : __v228))((pyContains(cfg, "items")))))) {
            pySub(pySub(cfg, "items"), item_key)["content"] = "";
            pySub(pySub(cfg, "items"), item_key)["header"] = "";
            pySub(pySub(cfg, "items"), item_key)["media_type"] = "none";
            pySub(pySub(cfg, "items"), item_key)["media_file_id"] = "";
            defaults = { contact: "💬 Contact Support", how_to_buy: "📖 How to Buy", about: "🎓 About StudyMart", terms: "📜 Terms & Policy" };
            if (pyT((pyContains(defaults, item_key)))) {
                    pySub(pySub(cfg, "items"), item_key)["label"] = pySub(defaults, item_key);
            }
            return (this.save_info_settings(cfg));
      }
      return (false);
  }
  add_custom_info_button(label, btn_type, content, header, media_type, media_file_id) {
    { const _k = __kw(header, ["header", "media_type", "media_file_id"]); if (_k) { if ("header" in _k) header = _k.header; if ("media_type" in _k) media_type = _k.media_type; if ("media_file_id" in _k) media_file_id = _k.media_file_id; } }
    if ((header === undefined) || __isPlainObj(header)) header = ""; if ((media_type === undefined)) media_type = "none"; if ((media_file_id === undefined)) media_file_id = "";
    let cfg, mt, new_id;
      cfg = this.get_info_settings();
      if (pyT(((!pyContains(cfg, "custom_buttons"))))) {
            cfg["custom_buttons"] = [];
      }
      mt = pyLower(pyStr((((__v229) => (pyT(__v229) ? __v229 : ("none")))(media_type))));
      if (pyT(((!pyContains(["photo", "animation"], mt))))) {
            [mt, media_file_id] = ["none", ""];
      }
      new_id = `cinfo_${pyStr((pyLen(pySub(cfg, "custom_buttons")) + 1))}_${pyStr(pyInt(pyTimestamp(pyNow())))}`;
      pyAppend(pySub(cfg, "custom_buttons"), { id: new_id, label: pyStrip(label), type: pyLower(pyStrip(btn_type)), content: pyStrip(content), header: pyStrip((((__v230) => (pyT(__v230) ? __v230 : ("")))(header))), media_type: mt, media_file_id: (pyT(((!pyEq(mt, "none")))) ? (media_file_id) : ("")), enabled: true });
      this.save_info_settings(cfg);
      return (new_id);
  }
  delete_custom_info_button(btn_id) {
    let b, cfg, orig_len;
      cfg = this.get_info_settings();
      if (pyT((pyContains(cfg, "custom_buttons")))) {
            orig_len = pyLen(pySub(cfg, "custom_buttons"));
            cfg["custom_buttons"] = ((() => { const __acc = []; for (const b of pyIter(pySub(cfg, "custom_buttons"))) { if (!pyT(((!pyEq(pyGet(b, "id"), btn_id))))) continue; __acc.push(b); } return __acc; })());
            if (pyT(((pyLen(pySub(cfg, "custom_buttons")) < orig_len)))) {
                    return (this.save_info_settings(cfg));
            }
      }
      return (false);
  }
  toggle_custom_info_button(btn_id) {
    let b, cfg;
      cfg = this.get_info_settings();
      for (const b of pyIter(pyGet(cfg, "custom_buttons", []))) {
            if (pyT((pyEq(pyGet(b, "id"), btn_id)))) {
                    b["enabled"] = (!pyT(pyGet(b, "enabled", true)));
                    this.save_info_settings(cfg);
                    return (pySub(b, "enabled"));
            }
      }
      return (false);
  }
  get_custom_info_button(btn_id) {
    let b, cfg;
      cfg = this.get_info_settings();
      for (const b of pyIter(pyGet(cfg, "custom_buttons", []))) {
            if (pyT((pyEq(pyGet(b, "id"), btn_id)))) {
                    return (pyDict(b));
            }
      }
      return (null);
  }
  update_custom_info_button(btn_id, label, content, btn_type, header, media_type, media_file_id) {
    { const _k = __kw(label, ["label", "content", "btn_type", "header", "media_type", "media_file_id"]); if (_k) { if ("label" in _k) label = _k.label; if ("content" in _k) content = _k.content; if ("btn_type" in _k) btn_type = _k.btn_type; if ("header" in _k) header = _k.header; if ("media_type" in _k) media_type = _k.media_type; if ("media_file_id" in _k) media_file_id = _k.media_file_id; } }
    if (__isPlainObj(label)) label = null; if (__isPlainObj(content)) content = null; if (__isPlainObj(btn_type)) btn_type = null; if (__isPlainObj(header)) header = null; if (__isPlainObj(media_type)) media_type = null; if (__isPlainObj(media_file_id)) media_file_id = null;
    let b, cfg, mt;
      cfg = this.get_info_settings();
      for (const b of pyIter(pyGet(cfg, "custom_buttons", []))) {
            if (pyT((pyEq(pyGet(b, "id"), btn_id)))) {
                    if (pyT(((!(label === null || label === undefined))))) {
                              b["label"] = pyStrip(label);
                    }
                    if (pyT(((!(content === null || content === undefined))))) {
                              b["content"] = pyStrip(content);
                    }
                    if (pyT(((!(btn_type === null || btn_type === undefined))))) {
                              b["type"] = pyLower(pyStrip(btn_type));
                    }
                    if (pyT(((!(header === null || header === undefined))))) {
                              b["header"] = pyStrip(header);
                    }
                    if (pyT(((!(media_type === null || media_type === undefined))))) {
                              mt = pyLower(pyStr((((__v231) => (pyT(__v231) ? __v231 : ("none")))(media_type))));
                              if (pyT(((!pyContains(["photo", "animation"], mt))))) {
                                          [mt, media_file_id] = ["none", ""];
                              }
                              b["media_type"] = mt;
                              b["media_file_id"] = (pyT(((!pyEq(mt, "none")))) ? (media_file_id) : (""));
                    }
                    return (this.save_info_settings(cfg));
            }
      }
      return (false);
  }
}


export const db = new Database();
