// https://nuxt.com/docs/api/configuration/nuxt-config
const env = (globalThis as any).process?.env || {};

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/fonts",
    "@nuxt/scripts",
    "@nuxtjs/turnstile",
    "@nuxtjs/color-mode",
    "@nuxtjs/supabase",
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

  ui: {
    // Disable Nuxt UI's Color Mode integration.
    // We'll configure @nuxtjs/color-mode directly below to force light mode.
    colorMode: false,
  },

  // Force light mode (no system detection, no dark).
  // https://color-mode.nuxtjs.org/usage/configuration
  colorMode: {
    preference: "light",
    fallback: "light",
    // Use a custom key to avoid any previously persisted dark preference.
    storageKey: "mm-color-mode",
    classSuffix: "",
  },

  // Supabase auth route guarding
  supabase: {
    redirectOptions: {
      // Guard /command and any future sub-pages under it.
      include: ["/command(/*)?"],
      // Redirect unauthenticated users here.
      login: "/login",
    },
  },

  devtools: {
    enabled: true,
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
