// src/utils/dateUtils.js
// Utilidades de fechas. Las fechas de ciclos se asumen como strings 'YYYY-MM-DD'
// (o Date). parseDate evita los corrimientos de zona horaria de new Date('YYYY-MM-DD').

const MS = 86400000;

export const MES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
export const MES_ABBR = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];
export const DIA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

export function parseDate(v) {
  if (v instanceof Date) return new Date(v.getFullYear(), v.getMonth(), v.getDate());
  if (typeof v === "string") {
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(v);
}

export function addDays(date, n) {
  return new Date(date.getTime() + n * MS);
}

// Días completos de a -> b (positivo si b es posterior).
export function diffDays(a, b) {
  const a0 = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const b0 = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((b0 - a0) / MS);
}

export function fmt(date) {
  return `${date.getDate()} ${MES_ABBR[date.getMonth()]}`;
}

export function fmtLong(date) {
  return `${DIA[date.getDay()]} ${date.getDate()} de ${MES[date.getMonth()]}`;
}

export function startOfToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}
