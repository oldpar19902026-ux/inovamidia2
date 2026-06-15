export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Retorna a URL de login.
 * Sempre redireciona para a página de login local (/login),
 * já que o OAuth Manus foi removido do projeto.
 */
export const getLoginUrl = () => "/login";