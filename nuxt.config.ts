// https://nuxt.com/docs/api/configuration/nuxt-config
const env = (globalThis as any).process?.env || {};

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/fonts",
    "@nuxt/scripts",
    "@nuxtjs/turnstile",
  ],

  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
  },
  turnstile: {
    siteKey: env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
  },

  runtimeConfig: {
    turnstile: {
      // This can be overridden at runtime via the NUXT_TURNSTILE_SECRET_KEY
      // environment variable.
      secretKey: env.NUXT_TURNSTILE_SECRET_KEY || env.TURNSTILE_SECRET_KEY,
    },
  },

  devtools: {
    enabled: true,
    clientAllowed: true, // Attempt to auto-accept DevTools client connections
  },

  css: ["~/assets/css/main.css"],

  routeRules: {
    "/": { prerender: true },
  },

  

  

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
