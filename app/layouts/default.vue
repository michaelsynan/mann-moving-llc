<script
  setup
  lang="ts"
>
const navigationItems = [
  {
    label: 'Moving',
    to: '/moving'
  },
  {
    label: 'Junk Removal',
    to: '/junk-removal'
  }
]

const mobileNavigationItems = [
  {
    label: 'Home',
    to: '/'
  },
  ...navigationItems
]

const footerSocials = [
  {
    label: 'Facebook',
    icon: 'i-mdi-facebook',
    href: 'https://www.facebook.com/MannMuscles/'
  },
  // {
  //   label: 'TikTok',
  //   icon: 'i-simple-icons-tiktok',
  //   href: '/'
  // },
  {
    label: 'Yelp',
    icon: 'i-mdi-yelp',
    href: 'https://www.yelp.com/biz/mann-muscles-forest-city-2'
  },
  {
    label: 'Google',
    icon: 'i-mdi-google',
    href: 'https://share.google/Ac76f9Wav8TrpKnFd'
  },
  {
    label: 'Instagram',
    icon: 'i-mdi-instagram',
    href: 'https://www.instagram.com/musclellc'
  }
]
</script>

<template>
  <div>
    <UHeader
      class="sticky top-0 z-60 bg-amber-50"
      :ui="{ container: 'w-full max-w-none px-4 sm:px-6 lg:px-8' }"
    >
      <template #left>
        <div class="flex items-center gap-2 self-center">
          <NuxtLink
            to="/"
            class="flex items-center gap-3"
            aria-label="Mann Muscles LLC Logo"
          >
            <img
              src="/mann-logo-type.png"
              alt="Mann Muscles LLC Logo"
              class="h-8 w-auto"
            >
          </NuxtLink>
        </div>
      </template>

      <template #right>
        <div class="flex items-center gap-6">
          <nav class="hidden lg:flex items-center gap-4">
            <NuxtLink
              class="text-xl font-semibold text-stone-950 uppercase"
              to="/moving"
            >Moving</NuxtLink>
            <NuxtLink
              class="text-xl font-semibold text-stone-950 uppercase"
              to="/junk-removal"
            >Junk Removal</NuxtLink>
          </nav>

          <div class="flex items-center gap-3">
            <UButton
              href="tel:+15702678864"
              icon="i-mdi-phone"
              aria-label="Call 1-570-267-8864"
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
        <div
          class="min-h-[calc(100svh-var(--ui-header-height))] px-4 py-10 flex items-center justify-center"
          style="transform: translateY(calc(var(--ui-header-height) / -2));"
        >
          <UNavigationMenu
            orientation="vertical"
            :items="mobileNavigationItems"
            :ui="{
              root: 'w-full',
              list: 'w-full flex flex-col items-center justify-center gap-6',
              item: 'w-full flex justify-center',
              link: 'w-full max-w-sm justify-center py-5 text-center text-4xl font-extrabold tracking-tight text-stone-950 uppercase'
            }"
          />
        </div>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter
      class="border-t border-default bg-accented"
      :ui="{
        root: 'relative z-0',
        container: 'w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-2',
        left: 'hidden',
        right: 'hidden',
        center: 'm-0 w-full flex items-center justify-center'
      }"
    >
      <div class="w-full py-1">
        <div class="flex justify-center border-b border-default pb-2 mb-2">
          <a
            href="tel:+15702678864"
            aria-label="Call 1-570-267-8864"
          >
            <img
              src="/content/NumberClassicPNGTransparent.png"
              alt="Mann Muscles contact number"
              class="h-10 sm:h-12 w-auto"
              loading="lazy"
              decoding="async"
            >
          </a>
        </div>

        <div class="mb-2 flex items-center justify-center gap-1">
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

        <div class="text-center">
          <p class="text-sm text-muted">
            Website by
            <NuxtLink
              to="https://formworkstudios.com"
              target="_blank"
              rel="noopener noreferrer"
              class="underline"
            >Formwork Studios</NuxtLink>
          </p>
        </div>

      </div>
    </UFooter>
  </div>
</template>
