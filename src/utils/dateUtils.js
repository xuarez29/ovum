export function parseLocalDate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return null;
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

export function toDateInputValue(date) {
  if (!date) return '';
  const parsed = date instanceof Date ? date : parseLocalDate(date);
  if (!parsed) return '';
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(dateString) {
  const date = parseLocalDate(dateString);
  if (!date) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function formatDateShort(dateString) {
  const date = parseLocalDate(dateString);
  if (!date) return 'Sin fecha';
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short'
  }).format(date);
}

export function formatLongDate(dateString) {
  const date = parseLocalDate(dateString);
  if (!date) return '';
  return new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date);
}

export function addDays(dateString, days) {
  const date = parseLocalDate(dateString);
  if (!date) return '';
  date.setDate(date.getDate() + Number(days));
  return toDateInputValue(date);
}

export function differenceInDays(fromDateString, toDateString) {
  const from = parseLocalDate(fromDateString);
  const to = parseLocalDate(toDateString);
  if (!from || !to) return null;
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((end - start) / 86400000);
}

export function isDateBetween(dateString, startString, endString) {
  const date = parseLocalDate(dateString);
  const start = parseLocalDate(startString);
  const end = parseLocalDate(endString);
  if (!date || !start || !end) return false;
  return date >= start && date <= end;
}

export function getTodayInputValue() {
  return toDateInputValue(new Date());
}

export function getMonthMatrix(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();
  const cells = [];

  for (let i = 0; i < leadingBlanks; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(toDateInputValue(new Date(year, monthIndex, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}
