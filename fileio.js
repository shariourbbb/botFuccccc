// fileio.js — sync JSON persistence + fs helpers (mirrors database.py behavior).
import fs from "node:fs";
export function pyReadFile(filename) {
  if (!fs.existsSync(filename)) return null;
  return fs.readFileSync(filename, "utf-8");
}
export function pyJsonParse(text) {
  if (text === null || text === undefined) throw new Error("empty file");
  return JSON.parse(text);
}
export function pyJsonDumps(data) {
  return JSON.stringify(data);
}
export function pyWriteFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
}
export function pyFileExists(p) {
  return fs.existsSync(p);
}
export function pyGetCwd() {
  return process.cwd();
}
export function pyListDir(p) {
  return fs.readdirSync(p);
}
export function pyMakeDirs(p) {
  fs.mkdirSync(p, { recursive: true });
}
