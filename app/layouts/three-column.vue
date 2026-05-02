<script
  setup
  lang="ts"
>
const route = useRoute()
const showHomeReviews = computed(() => route.path === '/')

const scrollY = ref(0)
const reducedMotion = ref(false)
const reviewsEntered = ref(false)

function updateScroll() {
  scrollY.value = window.scrollY || 0
}

onMounted(() => {
  reducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  updateScroll()
  window.addEventListener('scroll', updateScroll, { passive: true })

  if (reducedMotion.value)
    reviewsEntered.value = true
  else
    requestAnimationFrame(() => {
      reviewsEntered.value = true
    })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScroll)
})

watch(showHomeReviews, (isHome) => {
  if (!isHome) {
    reviewsEntered.value = false
    return
  }

  if (reducedMotion.value) {
    reviewsEntered.value = true
    return
  }

  reviewsEntered.value = false
  requestAnimationFrame(() => {
    reviewsEntered.value = true
  })
})

function getSideParallaxStyle(multiplier: number, maxExtra: number) {
  if (!showHomeReviews.value || reducedMotion.value)
    return undefined

  // Move side columns faster than the main content.
  // Document scroll is 1:1; this extra negative translate increases perceived speed.
  const extra = Math.min(scrollY.value * multiplier, maxExtra)
  return {
    transform: `translate3d(0, ${-extra}px, 0)`
  }
}

const leftParallaxStyle = computed(() => getSideParallaxStyle(0.14, 360))
const rightParallaxStyle = computed(() => getSideParallaxStyle(0.34, 760))

const leftEnterClass = computed(() => {
  if (!showHomeReviews.value)
    return ''
  if (reducedMotion.value)
    return 'opacity-100 translate-y-0'
  return reviewsEntered.value ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
})

const rightEnterClass = computed(() => {
  if (!showHomeReviews.value)
    return ''
  if (reducedMotion.value)
    return 'opacity-100 translate-y-0'
  return reviewsEntered.value ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
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
      <div class="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div class="flex items-start gap-6">
          <aside class="relative z-50 hidden lg:block w-80 2xl:w-96 shrink-0">
            <div
              v-if="showHomeReviews"
              class="pt-[28vh] will-change-transform transition-all duration-700 ease-out"
              :class="leftEnterClass"
              :style="leftParallaxStyle"
            >
              <HomeReviewColumn parity="even" />
            </div>

            <slot
              v-else
              name="left"
            />
          </aside>

          <div class="relative z-10 min-w-0 flex-1">
            <slot />
          </div>

          <aside class="relative z-50 hidden lg:block w-80 2xl:w-96 shrink-0">
            <div
              v-if="showHomeReviews"
              class="pt-[56vh] will-change-transform transition-all duration-900 ease-out delay-150"
              :class="rightEnterClass"
              :style="rightParallaxStyle"
            >
              <HomeReviewColumn parity="odd" />
            </div>

            <slot
              v-else
              name="right"
            />
          </aside>
        </div>
      </div>
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
