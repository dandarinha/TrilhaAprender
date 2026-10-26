type RuntimeEnv = {
  VITE_API_BASE_URL?: string;
};

const configuredBaseUrl = (
  (import.meta as ImportMeta & { env?: RuntimeEnv }).env
    ?.VITE_API_BASE_URL || ''
).trim();

const isLoopbackBaseUrl = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/|$)/i.test(
  configuredBaseUrl
);

const currentHostname =
  typeof window === 'undefined' ? '' : window.location.hostname;

const isLoopbackPage =
  currentHostname === 'localhost' ||
  currentHostname === '127.0.0.1' ||
  currentHostname === '::1';

/**
 * Em um celular, localhost aponta para o próprio celular.
 * Quando o frontend é acessado por IP da rede local, usa /api
 * para passar pelo proxy do Vite (ou reverse proxy de produção).
 */
export const API_BASE_URL =
  configuredBaseUrl &&
  !(isLoopbackBaseUrl && !isLoopbackPage)
    ? configuredBaseUrl.replace(/\/$/, '')
    : '/api';

const API_TIMEOUT_MS = 12000;

/** Evita que um celular fique preso indefinidamente em uma requisição. */
export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = API_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timeout);
  }
}

export function readLocalStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocalStorage(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeLocalStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Alguns navegadores bloqueiam storage privado ou incorporado.
  }
}
