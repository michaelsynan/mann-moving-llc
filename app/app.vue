<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'color-scheme', content: 'light' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en',
    class: 'light'
  },
  bodyAttrs: {
    class: 'light'
  }
})

const title = 'Mann Muscles LLC - Junk Removal & Moving Services'
const description = 'We will cut your junk removal costs with Mann Muscles LLC. We buy your junk and keep it out of the landfill. Our team makes it stress-free.'

defineOgImage('MannOgImage.takumi', {
  title: 'Mann Muscles LLC',
  description: 'Top Rated Junk Removal and Moving Services in NEPA.'
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
