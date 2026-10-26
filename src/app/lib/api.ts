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
