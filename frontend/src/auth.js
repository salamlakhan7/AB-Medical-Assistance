const AUTH_STORAGE_KEY = "ab_medical_auth";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

let refreshPromise = null;

export function getStoredAuth() {
  try {
    const rawAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return rawAuth ? JSON.parse(rawAuth) : null;
  } catch {
    return null;
  }
}

export function storeAuth(authData) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
}

export function clearAuth() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getCurrentUser() {
  return getStoredAuth()?.user || null;
}

export function getAccessToken() {
  return getStoredAuth()?.access || "";
}

export function getRefreshToken() {
  return getStoredAuth()?.refresh || "";
}

export function getAuthHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();

  if (!refresh) {
    throw new Error("Refresh token is unavailable.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh })
  });

  if (!response.ok) {
    throw new Error("Unable to refresh authentication.");
  }

  const tokens = await response.json();
  const storedAuth = getStoredAuth();

  storeAuth({
    ...storedAuth,
    access: tokens.access,
    refresh: tokens.refresh || refresh
  });

  return tokens.access;
}

function redirectToLogin() {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

export async function authFetch(input, options = {}) {
  const requestHeaders = new Headers(options.headers || {});
  const accessToken = getAccessToken();

  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(input, { ...options, headers: requestHeaders });

  if (response.status !== 401) {
    return response;
  }

  try {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshedAccessToken = await refreshPromise;
    const retryHeaders = new Headers(options.headers || {});
    retryHeaders.set("Authorization", `Bearer ${refreshedAccessToken}`);

    return fetch(input, { ...options, headers: retryHeaders });
  } catch (error) {
    clearAuth();
    redirectToLogin();
    throw error;
  }
}

export function userHasRole(user, allowedRoles) {
  return Boolean(user && allowedRoles.includes(user.role));
}
