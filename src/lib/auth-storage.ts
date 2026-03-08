const ACCESS_TOKEN_KEY = "pentagence.access_token";
const REFRESH_TOKEN_KEY = "pentagence.refresh_token";
const USER_KEY = "pentagence.user";

export interface StoredUser {
  id: string;
  email: string;
  role: "user" | "admin";
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getAccessToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function setStoredUser(user: StoredUser): void {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): StoredUser | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.sessionStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredUser;
    if (!parsed.id || !parsed.email || !parsed.role) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearStoredUser(): void {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(USER_KEY);
}
