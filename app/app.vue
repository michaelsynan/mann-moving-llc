<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

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

const title = 'Mann Muscles LLC - Junk Removal & Moving Services'
const description = 'We will cut your junk removal costs with Mann Muscles LLC. We buy your junk and keep it out of the landfill. Our team makes it stress-free.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <UHeader>
      <template #left>
        <div class="flex items-center gap-2 self-center">
          <NuxtLink
            to="/"
            class="flex items-center"
          >
            <AppLogo class="w-auto shrink-0" />
          </NuxtLink>

          <!-- <TemplateMenu /> -->
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
            >
              <span class="hidden sm:inline">Call Us</span>
            </UButton>

            <UColorModeButton />
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
      <NuxtPage />
    </UMain>

    <UFooter class="border-t border-default bg-accented">
      <template #left>
        <p class="text-sm text-muted">
          Built by Formwork Studios • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://www.facebook.com/MannMuscles/"
          target="_blank"
          icon="i-simple-icons-facebook"
          aria-label="Facebook"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
