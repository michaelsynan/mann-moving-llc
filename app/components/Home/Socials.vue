<script
  setup
  lang="ts"
>
const socials = [
  {
    label: 'Facebook',
    icon: 'i-mdi-facebook',
    href: 'https://www.facebook.com/'
  },
  {
    label: 'TikTok',
    icon: 'i-mdi-tiktok',
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
] as const

function gridPositionClass(index: number) {
  // On `sm+`, we use a 6-column grid and each item spans 2 columns.
  // This lets us truly center leftovers:
  // remainder 1 -> start at col 3 (occupies cols 3-4)
  // remainder 2 -> start at col 2 (items occupy cols 2-3 and 4-5)
  const remainder = socials.length % 3
  if (remainder === 1 && index === socials.length - 1) {
    return 'sm:col-start-3'
  }
  if (remainder === 2 && index === socials.length - 2) {
    return 'sm:col-start-2'
  }
  return ''
}
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <div class="grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
      <div class="hidden lg:flex justify-end">
        <img
          src="/content/tribal.webp"
          alt=""
          aria-hidden="true"
          class="h-40 w-auto opacity-80"
          loading="lazy"
          decoding="async"
        >
      </div>

      <div class="text-center">
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
          FOLLOW US
        </h2>

        <div class="mt-6 grid grid-cols-2 sm:grid-cols-6 gap-3 justify-items-stretch">
          <a
            v-for="(social, index) in socials"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            :class="[
              'inline-flex items-center justify-center gap-3 rounded-lg border border-default bg-muted px-5 py-3 text-base font-semibold text-highlighted w-full',
              'sm:col-span-2',
              gridPositionClass(index)
            ]"
          >
            <UIcon
              :name="social.icon"
              class="size-7"
            />
            <span>{{ social.label }}</span>
          </a>
        </div>
      </div>

      <div class="hidden lg:flex justify-start">
        <img
          src="/content/tribal.webp"
          alt=""
          aria-hidden="true"
          class="h-40 w-auto opacity-80 transform -scale-x-100"
          loading="lazy"
          decoding="async"
        >
      </div>
    </div>
  </div>
</template>
