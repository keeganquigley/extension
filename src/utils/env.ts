export const isChrome = process.env.BROWSER_TARGET === "CHROME";
export const isProduction = process.env.NODE_ENV === "production";

export const getWebAPI: () => typeof window.chrome = () =>
  navigator.userAgent.match(/chrome|chromium|crios/i) ? chrome : window.browser;
