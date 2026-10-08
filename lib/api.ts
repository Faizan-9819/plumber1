import { API_BASE_URL, BACKEND_ENABLED } from "@/settings";

/**
 * True only when the backend is switched on *and* an API link was supplied,
 * so half-filled settings can never produce requests to a bad URL.
 */
export function isBackendEnabled(): boolean {
  return BACKEND_ENABLED && API_BASE_URL.trim() !== "";
}

/** Joins a path onto API_BASE_URL, tolerating slashes on either side. */
export function apiUrl(path: string): string {
  const base = API_BASE_URL.trim().replace(/\/+$/, "");
  return `${base}/${path.replace(/^\/+/, "")}`;
}
