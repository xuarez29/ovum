const STORAGE_KEY = 'ovum.users.v1';

export function loadUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function clearUsers() {
  localStorage.removeItem(STORAGE_KEY);
}

export function validateImportPayload(payload) {
  if (!Array.isArray(payload)) return false;
  return payload.every((user) => user?.id && user?.name && user?.lastPeriodStart);
}
