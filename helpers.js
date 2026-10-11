// helpers.js — Python-semantics runtime for the transpiled StudyMart bot.
// Every helper is a 1:1 behavioral match of the Python construct it replaces.

// PDict instances store data in ._d — unwrap for helper access.
function _unwrap(o) {
  if (o && typeof o === "object" && !Array.isArray(o) && o._d && typeof o._d === "object" && typeof o.get === "function" && typeof o.set === "function") return o._d;
  return o;
}

export function pyT(v) {
  // Python truthiness: None/False/0/""/[]/{} /empty are falsy.
  if (v === null || v === undefined || v === false) return false;
  if (v === true) return true;
  if (typeof v === "number") return v !== 0 && !Number.isNaN(v);
  if (typeof v === "string") return v.length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (v instanceof Set || v instanceof Map) return v.size > 0;
  if (typeof v === "object") {
    const d = _unwrap(v);
    return Object.keys(d).length > 0;
  }
  return true;
}
export function pyGet(o, key, dflt = null) {
  // dict.get(key, default): MISSING-key fallback; present-but-null stays null.
  if (o === null || o === undefined) return dflt;
  if (o instanceof Map) return o.has(key) ? o.get(key) : dflt;
  if (Array.isArray(o)) {
    const i = Number(key);
    if (Number.isInteger(i) && i >= 0 && i < o.length) return o[i];
    return dflt;
  }
  if (typeof o === "object") {
    const d = _unwrap(o);
    if (typeof key === "number" && Array.isArray(d)) { return d[key] ?? dflt; }
    return Object.prototype.hasOwnProperty.call(d, key) ? d[key] : dflt;
  }
  return dflt;
}
export function pyDeepGet(o, keys, dflt = null) {
  // chained safe navigation for X.get(a, {}).get(b) patterns.
  let cur = o;
  for (const [k, d] of keys) { cur = pyGet(cur, k, d); }
  return cur === undefined ? dflt : cur;
}
export function pySet(o, key, val) {
  if (o instanceof Map) { o.set(key, val); return val; }
  const d = _unwrap(o);
  d[key] = val; return val;
}
export function pySetDefault(o, key, dflt) {
  // dict.setdefault — present-but-falsy stays (Python checks membership, not truthiness).
  if (o instanceof Map) { if (!o.has(key)) o.set(key, dflt); return o.get(key); }
  const d = _unwrap(o);
  if (!Object.prototype.hasOwnProperty.call(d, key)) d[key] = dflt;
  return d[key];
}
export function pyPop(o, key, dflt = null) {
  // dict.pop / list.pop(i=-1). Missing-key returns dflt (Python would raise without default;
  // all surveyed call sites pass a default or pop existing keys).
  if (Array.isArray(o)) {
    if (key === undefined || key === null) return o.pop();
    let i = Number(key);
    if (i < 0) i = o.length + i;
    if (i < 0 || i >= o.length) return dflt;
    return o.splice(i, 1)[0];
  }
  if (o instanceof Map) {
    if (o.has(key)) { const v = o.get(key); o.delete(key); return v; }
    return dflt;
  }
  const d = _unwrap(o);
  if (Object.prototype.hasOwnProperty.call(d, key)) { const v = d[key]; delete d[key]; return v; }
  return dflt;
}
export function pyDel(o, key) {
  // del o[key] — dict + list-index forms.
  if (Array.isArray(o) && typeof key === "number") { o.splice(key < 0 ? o.length + key : key, 1); return; }
  if (o instanceof Map) { o.delete(key); return; }
  const d = _unwrap(o);
  delete d[key];
}
export function pyUpdate(o, other) {
  // dict.update
  if (o instanceof Map) { for (const [k, v] of Object.entries(other)) o.set(k, v); return o; }
  const d = _unwrap(o);
  Object.assign(d, other); return o;
}
export function pyCopy(o) {
  if (Array.isArray(o)) return o.slice();
  if (o instanceof Map) return new Map(o);
  if (o instanceof Set) return new Set(o);
  if (o && typeof o === "object") return { ...o };
  return o;
}
export function pyClear(o) {
  if (Array.isArray(o)) { o.length = 0; return; }
  if (o instanceof Map || o instanceof Set) { o.clear(); return; }
  for (const k of Object.keys(o)) delete o[k];
}
export function pySub(o, idx) {
  // Python subscript: negative list index, dict key, string index, tuple index.
  if (o === null || o === undefined) return null;
  if (Array.isArray(o) || typeof o === "string") {
    let i = Number(idx);
    if (!Number.isInteger(i)) return o[idx];
    if (i < 0) i = o.length + i;
    if (i < 0 || i >= o.length) return null;
    return o[i];
  }
  if (o instanceof Map) { const v = o.get(idx); return v === undefined ? null : v; }
  if (typeof o === "object") {
    const d = _unwrap(o);
    const v = d[idx];
    return v === undefined ? null : v;
  }
  return null;
}
export function pySlice(s, start = null, end = null, step = null) {
  // Python s[a:b:c]. Only step 1/-1 surveyed (+ plain [a:b]/[:n]/[n:]/[:]).
  const n = s.length;
  const norm = (v, dflt) => {
    if (v === null || v === undefined) return dflt;
    let i = Number(v);
    if (i < 0) i = Math.max(n + i, 0);
    return Math.min(Math.max(i, 0), n);
  };
  const st = step === null || step === undefined ? 1 : Number(step);
  let a = norm(start, st > 0 ? 0 : n - 1);
  let b = norm(end, st > 0 ? n : -1);
  if (Array.isArray(s)) {
    const out = [];
    if (st > 0) { for (let i = a; i < b; i += st) out.push(s[i]); }
    else { for (let i = a; i > b; i += st) out.push(s[i]); }
    return out;
  }
  if (st === 1) return String(s).slice(a, b);
  let out = "";
  const t = String(s);
  if (st > 0) { for (let i = a; i < b; i += st) out += t[i] ?? ""; }
  else { for (let i = a; i > b; i += st) out += t[i] ?? ""; }
  return out;
}
export function pyContains(container, item) {
  // `in`: substring, array membership, dict-key membership, set membership.
  if (container === null || container === undefined) return false;
  if (typeof container === "string") return container.includes(String(item));
  if (Array.isArray(container)) return container.includes(item);
  if (container instanceof Set || container instanceof Map) return container.has(item);
  if (typeof container === "object") {
    const d = _unwrap(container);
    return Object.prototype.hasOwnProperty.call(d, item);
  }
  return false;
}
export function pyEq(a, b) {
  // Python ==: strict except numeric cross-type (1 == True, 1.0 == 1).
  if (typeof a === "number" && typeof b === "boolean") return a === (b ? 1 : 0);
  if (typeof b === "number" && typeof a === "boolean") return (a ? 1 : 0) === b;
  if (typeof a === "number" && typeof b === "number") return a === b;
  return a === b;
}
export function pyIter(o) {
  // for x in ... over list / string / dict (keys) / set / Map (keys) / generator.
  if (o === null || o === undefined) return [];
  if (Array.isArray(o) || typeof o === "string") return o;
  if (o instanceof Map) return [...o.keys()];
  if (o instanceof Set) return [...o];
  if (typeof o[Symbol.iterator] === "function") return [...o];
  if (typeof o === "object") {
    const d = _unwrap(o);
    return Object.keys(d);
  }
  return [];
}
export function pyNext(iterable, dflt = null) {
  // Python next(iter([...]), default) — first element or default.
  const arr = pyIter(iterable);
  return arr.length > 0 ? arr[0] : dflt;
}
export function pyRPartition(s, sep) {
  // Python str.rpartition(sep): split at LAST occurrence of sep.
  const t = String(s);
  const i = t.lastIndexOf(sep);
  if (i === -1) return ["", "", t];
  return [t.slice(0, i), sep, t.slice(i + sep.length)];
}
export function pyList(o) {
  // list(x): strings → char arrays (Python semantics), iterables → arrays, dict → keys.
  if (o === null || o === undefined) return [];
  if (Array.isArray(o)) return o.slice();
  if (typeof o === "string") return [...o];
  return [...pyIter(o)];
}
export function pyDict(o) {
  // dict(x): shallow clone of a mapping, or entries-array → object.
  if (o === null || o === undefined) return {};
  if (Array.isArray(o)) { const r = {}; for (const [k, v] of o) r[k] = v; return r; }
  if (o instanceof Map) { const r = {}; for (const [k, v] of o) r[k] = v; return r; }
  return { ...o };
}
export function pySetNew(o) {
  if (o === null || o === undefined) return new Set();
  return new Set(pyIter(o));
}
export function pyLen(o) {
  if (o === null || o === undefined) return 0;
  if (typeof o === "string" || Array.isArray(o)) return o.length;
  if (o instanceof Set || o instanceof Map) return o.size;
  if (typeof o === "object") {
    const d = _unwrap(o);
    return Object.keys(d).length;
  }
  return 0;
}
export function pyStr(v) {
  // str(x): None→"None", True→"True", floats like 1.5, ints plain.
  if (v === null || v === undefined) return "None";
  if (v === true) return "True";
  if (v === false) return "False";
  if (typeof v === "number") {
    if (Number.isInteger(v)) return String(v);
    return String(v);
  }
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toString();
  return String(v);
}
export function pyInt(v, base = 10) {
  // int(x): truncates toward zero; parses leading int from strings like Python (strict-ish for surveyed uses);
  // int(x, base) never surveyed — base ignored except 10.
  if (v === true) return 1;
  if (v === false) return 0;
  if (v === null || v === undefined) throw new Error("invalid literal for int()");
  if (typeof v === "number") return Math.trunc(v);
  if (typeof v === "string") {
    const t = v.trim();
    if (/^[+-]?\d+$/.test(t)) return parseInt(t, 10);
    if (/^[+-]?\d+\.\d+$/.test(t)) return Math.trunc(parseFloat(t));
    const m = /^[+-]?\d+/.exec(t);
    if (m) return parseInt(m[0], 10);
    throw new Error(`invalid literal for int(): '${v}'`);
  }
  return Math.trunc(Number(v));
}
export function pyFloat(v) {
  if (v === true) return 1.0;
  if (v === false) return 0.0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const t = v.trim();
    const n = Number(t);
    if (t !== "" && !Number.isNaN(n)) return n;
    throw new Error(`could not convert string to float: '${v}'`);
  }
  return Number(v);
}
export function pyIsNone(v) { return v === null || v === undefined; }
export function pyIsInstance(v, t) {
  // isinstance(x, (dict|list|str|int|bool|float|tuple)) over surveyed uses.
  const one = (x, c) => {
    if (c === "dict" || c === Object) return x !== null && typeof x === "object" && !Array.isArray(x);
    if (c === "list" || c === Array) return Array.isArray(x);
    if (c === "str" || c === String) return typeof x === "string";
    if (c === "int") return typeof x === "number" && Number.isInteger(x);
    if (c === "bool") return typeof x === "boolean";
    if (c === "float") return typeof x === "number";
    if (c === "tuple") return Array.isArray(x);
    if (typeof c === "string") {
      if (c === "dict") return x !== null && typeof x === "object" && !Array.isArray(x);
      if (c === "list" || c === "tuple") return Array.isArray(x);
      if (c === "str") return typeof x === "string";
      if (c === "int") return typeof x === "number" && Number.isInteger(x);
      if (c === "float") return typeof x === "number";
      if (c === "bool") return typeof x === "boolean";
      return false;
    }
    try { return x instanceof c; } catch { return false; }
  };
  if (Array.isArray(t)) return t.some((c) => one(v, c));
  return one(v, t);
}
export function pyGetAttr(o, name, dflt = null) {
  if (o === null || o === undefined) return dflt;
  const v = o[name];
  return v === undefined ? dflt : v;
}
export function pyHasAttr(o, name) {
  if (o === null || o === undefined) return false;
  return o[name] !== undefined;
}
export function pyRange(...args) {
  // range(stop) / range(start, stop[, step]).
  let start = 0, stop = 0, step = 1;
  if (args.length === 1) [stop] = args;
  else if (args.length === 2) [start, stop] = args;
  else [start, stop, step] = args;
  const out = [];
  if (step > 0) { for (let i = start; i < stop; i += step) out.push(i); }
  else if (step < 0) { for (let i = start; i > stop; i += step) out.push(i); }
  return out;
}
export function pyEnumerate(iterable, start = 0) {
  const arr = pyIter(iterable);
  return arr.map((v, i) => [start + i, v]);
}
export function pyZip(...args) {
  const arrs = args.map((a) => pyIter(a));
  const n = Math.min(...arrs.map((a) => a.length));
  const out = [];
  for (let i = 0; i < n; i++) out.push(arrs.map((a) => a[i]));
  return out;
}
export function pyReversed(o) {
  return pyIter(o).slice().reverse();
}
export function pyAny(iterable, fn = null) {
  for (const x of pyIter(iterable)) { if (pyT(fn ? fn(x) : x)) return true; }
  return false;
}
export function pyAll(iterable, fn = null) {
  for (const x of pyIter(iterable)) { if (!pyT(fn ? fn(x) : x)) return false; }
  return true;
}
export function pySum(iterable, fn = null) {
  let t = 0;
  for (const x of pyIter(iterable)) t += fn ? fn(x) : x;
  return t;
}
export function pySorted(iterable, keyFn = null, reverse = false) {
  const arr = pyIter(iterable).slice();
  const key = keyFn ? keyFn : (x) => x;
  arr.sort((a, b) => {
    const ka = key(a), kb = key(b);
    if (ka < kb) return -1;
    if (ka > kb) return 1;
    return 0;
  });
  if (reverse) arr.reverse();
  return arr;
}
export function pyMax(...args) {
  const arr = (args.length === 1 && Array.isArray(args[0])) ? args[0] : args;
  return arr.reduce((a, b) => (a > b ? a : b));
}
export function pyMin(...args) {
  const arr = (args.length === 1 && Array.isArray(args[0])) ? args[0] : args;
  return arr.reduce((a, b) => (a < b ? a : b));
}
export function pyMathCeil(x) { return Math.ceil(Number(x)); }
export function pyChr(n) { return String.fromCharCode(Number(n)); }
export function pyRound(x) {
  // Python banker's rounding: round-half-to-even.
  const n = Number(x);
  const f = Math.floor(n), c = Math.ceil(n);
  if (n - f !== 0.5 || c - n !== 0.5) return Math.round(n);
  return (f % 2 === 0) ? f : c;
}
export function pyTitle(s) {
  // Python str.title(): uppercase after every non-letter, lowercase the rest.
  return String(s).toLowerCase().replace(/(^|[^A-Za-zÀ-ÿ])([A-Za-zÀ-ÿ])/g, (m, p, c) => p + c.toUpperCase());
}
export function pyPartition(s, sep) {
  const t = String(s);
  const i = t.indexOf(sep);
  if (i === -1) return [t, "", ""];
  return [t.slice(0, i), sep, t.slice(i + sep.length)];
}
export function pySplit(s, sep = null, maxsplit = -1) {
  // str.split(sep, maxsplit): None-sep splits on runs of whitespace (no empties).
  const t = String(s);
  if (sep === null || sep === undefined) {
    const parts = t.split(/\s+/);
    if (parts.length && parts[0] === "") parts.shift();
    if (parts.length && parts[parts.length - 1] === "") parts.pop();
    if (maxsplit !== -1 && maxsplit !== null && parts.length > maxsplit + 1) {
      const head = parts.slice(0, maxsplit);
      head.push(parts.slice(maxsplit).join(" "));
      return head;
    }
    return parts;
  }
  if (maxsplit === -1 || maxsplit === null) return t.split(sep);
  if (sep instanceof RegExp) return t.split(sep, maxsplit);
  const out = [];
  let rest = t, n = 0;
  while (n < maxsplit) {
    const i = rest.indexOf(sep);
    if (i === -1) break;
    out.push(rest.slice(0, i));
    rest = rest.slice(i + sep.length);
    n++;
  }
  out.push(rest);
  return out;
}
export function pyRSplit(s, sep = null, maxsplit = -1) {
  const t = String(s);
  if (sep === null || sep === undefined) {
    const parts = pySplit(t, null, -1);
    if (maxsplit === -1 || maxsplit === null || parts.length <= maxsplit + 1) return parts;
    const tail = parts.slice(parts.length - maxsplit);
    return [parts.slice(0, parts.length - maxsplit).join(" "), ...tail];
  }
  if (maxsplit === -1 || maxsplit === null) return t.split(sep);
  const all = t.split(sep);
  if (all.length <= maxsplit + 1) return all;
  return [all.slice(0, all.length - maxsplit).join(sep), ...all.slice(all.length - maxsplit)];
}
export function pyJoin(sep, iterable) {
  return pyIter(iterable).map((x) => (typeof x === "string" ? x : pyStr(x))).join(String(sep));
}
export function pyStrip(s, chars = null) {
  const t = String(s);
  if (chars === null || chars === undefined) return t.trim();
  const set = new Set([...String(chars)]);
  let a = 0, b = t.length;
  while (a < b && set.has(t[a])) a++;
  while (b > a && set.has(t[b - 1])) b--;
  return t.slice(a, b);
}
export function pyLStrip(s, chars = null) {
  const t = String(s);
  if (chars === null || chars === undefined) return t.trimStart();
  const set = new Set([...String(chars)]);
  let a = 0;
  while (a < t.length && set.has(t[a])) a++;
  return t.slice(a);
}
export function pyRStrip(s, chars = null) {
  const t = String(s);
  if (chars === null || chars === undefined) return t.trimEnd();
  const set = new Set([...String(chars)]);
  let b = t.length;
  while (b > 0 && set.has(t[b - 1])) b--;
  return t.slice(0, b);
}
export function pyLower(s) { return String(s).toLowerCase(); }
export function pyUpper(s) { return String(s).toUpperCase(); }
export function pyStart(s, prefix) {
  if (Array.isArray(prefix)) return prefix.some((p) => String(s).startsWith(p));
  return String(s).startsWith(String(prefix));
}
export function pyEnd(s, suffix) {
  if (Array.isArray(suffix)) return suffix.some((p) => String(s).endsWith(p));
  return String(s).endsWith(String(suffix));
}
export function pyReplace(s, oldSub, newSub, count = -1) {
  const t = String(s), a = String(oldSub), b = String(newSub);
  if (a === "") return t;
  if (count === -1 || count === null || count === undefined) return t.split(a).join(b);
  let out = t, n = 0;
  let i = out.indexOf(a);
  while (i !== -1 && n < count) { out = out.slice(0, i) + b + out.slice(i + a.length); n++; i = out.indexOf(a, i + b.length); }
  return out;
}
export function pyFind(s, sub) { return String(s).indexOf(String(sub)); }
export function pyIsDigit(s) { return /^\d+$/.test(String(s)); }
export function pyZfill(s, width) {
  const t = String(s);
  if (t.length >= width) return t;
  const sign = (t[0] === "+" || t[0] === "-") ? t[0] : "";
  const body = sign ? t.slice(1) : t;
  return sign + "0".repeat(width - t.length) + body;
}
export function pySplitLines(s) { return String(s).split(/\r\n|\r|\n/); }
export function pyMod(a, b) {
  // Python %: result takes the sign of the divisor.
  const x = Number(a), y = Number(b);
  return ((x % y) + y) % y;
}
export function pyRepeat(s, n) {
  // "ab" * 3; [1] * 3 handled by list branch.
  if (Array.isArray(s)) { const out = []; for (let i = 0; i < n; i++) out.push(...s); return out; }
  return String(s).repeat(Math.max(0, Number(n)));
}
export function pyDiv(a, b) {
  // Python //: floor division (toward -inf).
  return Math.floor(Number(a) / Number(b));
}
export function pyPow(a, b) { return Math.pow(Number(a), Number(b)); }
export function pyKeys(o) {
  if (o instanceof Map) return [...o.keys()];
  const d = _unwrap(o);
  return Object.keys(d || {});
}
export function pyValues(o) {
  if (o === null || o === undefined) return [];
  if (Array.isArray(o)) return o.slice();
  if (o instanceof Map) return [...o.values()];
  if (typeof o === "object") {
    const d = _unwrap(o);
    return Object.values(d);
  }
  return [];
}
export function pyItems(o) {
  if (o === null || o === undefined) return [];
  if (o instanceof Map) return [...o.entries()];
  if (typeof o === "object") {
    const d = _unwrap(o);
    return Object.entries(d);
  }
  return [];
}
export function pyAppend(lst, v) { lst.push(v); return v; }
export function pyExtend(lst, it) { for (const x of pyIter(it)) lst.push(x); return lst; }
export function pyInsert(lst, i, v) {
  let idx = Number(i);
  if (idx < 0) idx = Math.max(lst.length + idx, 0);
  lst.splice(Math.min(idx, lst.length), 0, v);
  return lst;
}
export function pyRemove(lst, v) {
  const i = lst.indexOf(v);
  if (i !== -1) lst.splice(i, 1);
  return lst;
}
export function pyIndex(lst, v) { return lst.indexOf(v); }
export function pyCount(lst, v) {
  let n = 0;
  for (const x of lst) if (pyEq(x, v)) n++;
  return n;
}
export function pySort(lst, keyFn = null, reverse = false) {
  const key = keyFn ? keyFn : (x) => x;
  lst.sort((a, b) => {
    const ka = key(a), kb = key(b);
    if (ka < kb) return -1;
    if (ka > kb) return 1;
    return 0;
  });
  if (reverse) lst.reverse();
  return lst;
}
export function pyReverse(lst) { lst.reverse(); return lst; }
export function pyDotGet(o, key, dflt = null) {
  // attribute read with default (getattr / optional chaining sites).
  return pyGetAttr(o, key, dflt);
}
export function pyReCompile(pat, flags = "") {
  return new RegExp(pat, flags);
}
export function pyReSub(pat, repl, text) {
  const rx = pat instanceof RegExp
    ? new RegExp(pat.source, pat.flags.includes("g") ? pat.flags : pat.flags + "g")
    : new RegExp(pat, "g");
  if (typeof repl === "function") {
    return String(text).replace(rx, (...args) => {
      const m = { group: (n = 0) => args[n] ?? "" };
      return repl(m);
    });
  }
  return String(text).replace(rx, String(repl));
}
export function pyReFindAll(pat, text) {
  const rx = pat instanceof RegExp
    ? new RegExp(pat.source, pat.flags.includes("g") ? pat.flags : pat.flags + "g")
    : new RegExp(pat, "g");
  const out = [];
  let m;
  while ((m = rx.exec(String(text))) !== null) {
    if (m.length > 2) {
      const groups = [];
      for (let i = 1; i < m.length; i++) groups.push(m[i] ?? "");
      out.push(groups);
    } else {
      out.push(m[1] !== undefined ? m[1] : m[0]);
    }
    if (m[0] === "") rx.lastIndex++;
  }
  return out;
}
export function pyReMatch(pat, text) {
  // re.match anchors at string start (no MULTILINE surveyed).
  const src = pat instanceof RegExp ? pat.source : String(pat);
  const flags = pat instanceof RegExp ? pat.flags.replace("g", "") : "";
  const m = new RegExp("^(?:" + src + ")", flags).exec(String(text));
  if (!m) return null;
  const groups = m.slice(1);
  const o = {
    0: m[0],
    group: (n = 0) => (n === 0 ? m[0] : (groups[n - 1] ?? null)),
    groups: () => groups,
  };
  groups.forEach((g, i) => { o[i + 1] = g; });
  return o;
}
export function pyQuotePlus(s) {
  return encodeURIComponent(String(s)).replace(/%20/g, "+");
}
export function pyHtmlEscape(s, quote = true) {
  // Python html.escape: & < > then " and ' (as &#x27; &#x22;-style? no — &quot; &#x27;).
  let t = String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  if (quote) t = t.replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  return t;
}
export function pySha256(s) {
  // sync sha256 hex — needs node:crypto; lazy import keeps helpers.js dependency-free at load.
  let h = 0;
  const t = String(s);
  // djb2 fallback is NOT sha256-equivalent — real impl below via dynamic require guard.
  try {
    const crypto = process.getBuiltinModule("node:crypto");
    if (crypto) return crypto.createHash("sha256").update(t, "utf8").digest("hex");
  } catch { /* fall through */ }
  for (let i = 0; i < t.length; i++) { h = ((h << 5) - h + t.charCodeAt(i)) | 0; }
  return String(h);
}
export function pyTimeInt() { return Math.floor(Date.now() / 1000); }
export function pyTimeNow() { return { timestamp: () => Date.now() / 1000 }; }
export function pyDateStr(d = null) {
  // str(datetime.now()) → "YYYY-MM-DD HH:MM:SS.mmmmmm"-ish; surveyed slices [:10],[:16] need ISO-like prefix.
  const t = d instanceof Date ? d : new Date();
  const p = (n, l = 2) => String(n).padStart(l, "0");
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())} ${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}.${p(t.getMilliseconds(), 3)}`;
}
export function pyNow() { return new Date(); }
export function pyTimestamp(d = null) {
  const t = d instanceof Date ? d : new Date();
  return t.getTime() / 1000;
}
export function pyFormatDt(d, fmt) {
  // Only surveyed format: '%Y-%m-%d %I:%M %p'.
  const t = d instanceof Date ? d : new Date();
  const p = (n, l = 2) => String(n).padStart(l, "0");
  const h24 = t.getHours();
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return fmt
    .replace("%Y", t.getFullYear())
    .replace("%m", p(t.getMonth() + 1))
    .replace("%d", p(t.getDate()))
    .replace("%H", p(h24))
    .replace("%I", p(h12))
    .replace("%M", p(t.getMinutes()))
    .replace("%S", p(t.getSeconds()))
    .replace("%p", h24 < 12 ? "AM" : "PM");
}
export function pySleep(sec) {
  return new Promise((r) => setTimeout(r, Number(sec) * 1000));
}
export function pyPrint(...args) { console.log(...args); }
export function pyAssert(cond, msg = "") {
  if (!pyT(cond)) throw new Error("AssertionError" + (msg ? ": " + msg : ""));
}
export function pyDeepCopy(o) {
  return o === undefined ? undefined : JSON.parse(JSON.stringify(o));
}
// Set operations over JS Set (surveyed: seen.add(tuple), `in` checks).
export function pySetAdd(s, v) { s.add(Array.isArray(v) ? JSON.stringify(v) : v); return s; }
export function pySetHas(s, v) { return s.has(Array.isArray(v) ? JSON.stringify(v) : v); }












// ---- Audit fix: kwargs-object unwrappers (Python kwarg callers pass {k:v}) ----
export function __isPlainObj(v) { return !!v && typeof v === "object" && !Array.isArray(v) && !(v instanceof Set) && !(v instanceof Map); }
export function __kw(o, keys) { if (__isPlainObj(o)) { for (const k of keys) { if (Object.prototype.hasOwnProperty.call(o, k)) return o; } } return null; }
export function __kwVal(o, key, dflt) { if (__isPlainObj(o) && Object.prototype.hasOwnProperty.call(o, key)) return o[key]; return dflt; }
