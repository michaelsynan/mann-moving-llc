// https://nuxt.com/docs/api/configuration/nuxt-config
const env = (globalThis as any).process?.env || {};

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxtjs/turnstile",
    "@nuxtjs/color-mode",
    "@nuxtjs/supabase",
    "nuxt-resend",
  ],

  resend: {
    apiKey: env.NUXT_RESEND_API_KEY || env.RESEND_API_KEY,
  },

  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
  },
  turnstile: {
    // Turnstile site key is intentionally public (it is embedded in the browser).
    // We support a non-"KEY" env var name to avoid some host UIs warning about it.
    siteKey:
      env.NUXT_PUBLIC_TURNSTILE_SITE_KEY ||
      env.NUXT_PUBLIC_TURNSTILE_SITE ||
      env.TURNSTILE_SITE_KEY,
  },

  runtimeConfig: {
    turnstile: {
      // This can be overridden at runtime via the NUXT_TURNSTILE_SECRET_KEY
      // environment variable.
      secretKey: env.NUXT_TURNSTILE_SECRET_KEY || env.TURNSTILE_SECRET_KEY,
    },

    // Optional: AWS S3 uploads (for junk-removal photos).
    // These are server-only secrets.
    s3: {
      region: env.S3_REGION,
      bucket: env.S3_BUCKET,
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      // Optional (advanced): custom S3 endpoint (e.g. for localstack / S3-compatible providers)
      endpoint: env.S3_ENDPOINT,
      // Pre-signed GET URL expiry (seconds). Default: 7 days. Max: 7 days.
      presignedUrlExpiresSeconds: env.S3_PRESIGNED_URL_EXPIRES_SECONDS,
    },

    // Optional: email-to-SMS gateway recipient (e.g. Verizon: 10digits@vtext.com)
    contactSmsTo: env.NUXT_CONTACT_SMS_TO || env.CONTACT_SMS_TO,
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
      // Where to redirect after auth callbacks (magic link / OAuth).
      callback: "/command",
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
