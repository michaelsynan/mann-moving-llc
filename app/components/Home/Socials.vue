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

function mobileGridPositionClass(index: number) {
  // Mobile uses 2 columns. For odd counts, center the final item.
  if (socials.length % 2 === 1 && index === socials.length - 1) {
    return 'col-span-2 justify-self-center w-full max-w-xs'
  }
  return ''
}
</script>

<template>
  <div class="mx-auto max-w-5xl relative">
    <img
      src="/content/tribal.webp"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute left-0 top-1/2 hidden -translate-x-2/3 -translate-y-1/2 -rotate-90 opacity-30 sm:block h-28 md:h-32 lg:h-36 w-auto"
      loading="lazy"
      decoding="async"
    >

    <img
      src="/content/tribal.webp"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute right-0 top-1/2 hidden translate-x-2/3 -translate-y-1/2 rotate-90 opacity-30 sm:block h-28 md:h-32 lg:h-36 w-auto"
      loading="lazy"
      decoding="async"
    >

    <div class="relative z-10 text-center sm:px-24 lg:px-28">
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
            'inline-flex items-center justify-center gap-3 rounded-lg px-5 py-3 text-base font-semibold w-full',
            'text-highlighted ring ring-inset ring-primary/25 bg-primary/10 hover:bg-primary/15 active:bg-primary/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            mobileGridPositionClass(index),
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
  </div>
</template>
