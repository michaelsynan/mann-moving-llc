<script
  setup
  lang="ts"
>
const navigationItems = [
  {
    label: 'Home',
    to: '/'
  },
  {
    label: 'Moving',
    to: '/moving'
  },
  {
    label: 'Junk Removal',
    to: '/junk-removal'
  }
]

const footerSocials = [
  {
    label: 'Facebook',
    icon: 'i-mdi-facebook',
    href: 'https://www.facebook.com/'
  },
  {
    label: 'TikTok',
    icon: 'i-simple-icons-tiktok',
    href: 'https://www.tiktok.com/'
  },
  {
    label: 'Yelp',
    icon: 'i-mdi-yelp',
    href: 'https://www.yelp.com/'
  },
  {
    label: 'Google',
    icon: 'i-mdi-google',
    href: 'https://www.google.com/'
  },
  {
    label: 'Instagram',
    icon: 'i-mdi-instagram',
    href: 'https://www.instagram.com/'
  }
]
</script>

<template>
  <div>
    <UHeader
      class="sticky top-0 z-60"
      :ui="{ container: 'w-full max-w-none px-4 sm:px-6 lg:px-8' }"
    >
      <template #left>
        <div class="flex items-center gap-2 self-center">
          <NuxtLink
            to="/"
            class="flex items-center gap-3"
            aria-label="Mann Muscles LLC"
          >
            <span class="h-8">
              <AppLogo class="h-full" />
            </span>
            <span class="font-semibold tracking-tight text-highlighted">
              Mann Muscles LLC
            </span>
          </NuxtLink>
        </div>
      </template>

      <template #right>
        <div class="flex items-center gap-6">
          <nav class="hidden lg:flex items-center gap-4">
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/moving">Moving</NuxtLink>
            <NuxtLink to="/junk-removal">Junk Removal</NuxtLink>
          </nav>

          <div class="flex items-center gap-3">
            <UButton
              to="https://github.com/nuxt-ui-templates/starter"
              target="_blank"
              icon="i-mdi-phone"
              aria-label="Call Us"
              color="primary"
              variant="solid"
              size="xl"
            >
              <span class="hidden sm:inline">Call Us</span>
            </UButton>
          </div>
        </div>
      </template>

      <template #body>
        <div class="py-4">
          <UNavigationMenu
            orientation="vertical"
            :items="navigationItems"
          />
        </div>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter class="border-t border-default bg-accented">
      <div class="w-full py-2">
        <div class="flex justify-center border-b border-default pb-4 mb-4">
          <img
            src="/content/NumberClassicPNGTransparent.png"
            alt="Mann Muscles contact number"
            class="h-14 sm:h-16 w-auto"
            loading="lazy"
            decoding="async"
          >
        </div>

        <div class="mb-4 flex items-center justify-center gap-2">
          <UButton
            v-for="social in footerSocials"
            :key="social.label"
            :to="social.href"
            target="_blank"
            :icon="social.icon"
            :aria-label="social.label"
            color="neutral"
            variant="ghost"
          />
        </div>

        <div class="text-center">
          <p class="text-sm text-muted">
            © {{ new Date().getFullYear() }} Mann Muscles LLC
          </p>
        </div>
      </div>
    </UFooter>
  </div>
</template>
