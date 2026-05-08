<script
  setup
  lang="ts"
>
const socials = [
  {
    label: 'Facebook',
    icon: 'i-mdi-facebook',
    href: 'https://www.facebook.com/MannMuscles/'
  },
  {
    label: 'TikTok',
    icon: 'i-simple-icons-tiktok',
    href: '/'
  },
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
  // Mobile is a single column now; no special positioning needed.
  return ''
}
</script>

<template>
  <div class="relative w-full px-4 sm:px-0 sm:mx-auto sm:max-w-5xl">
    <div class="relative z-10 text-center sm:px-24 lg:px-28">
      <div class="mx-auto mb-10 w-full max-w-sm overflow-hidden rounded-lg border border-default bg-muted pb-10">
        <video
          class="block w-full h-auto"
          controls
          playsinline
          preload="metadata"
        >
          <source
            src="/videos/vid_web.mp4"
            type="video/mp4"
          >
          Your browser does not support the video tag.
        </video>
      </div>

      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
        FOLLOW US
      </h2>

      <div class="mt-8 grid grid-cols-1 sm:grid-cols-6 gap-3 justify-items-stretch">
        <a
          v-for="(social, index) in socials"
          :key="social.label"
          :href="social.href"
          target="_blank"
          rel="noopener noreferrer"
          :class="[
            'inline-flex items-center justify-center gap-3 rounded-lg px-5 py-3 text-base font-semibold w-full',
            'text-highlighted ring ring-inset ring-primary bg-muted hover:bg-elevated active:bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
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
