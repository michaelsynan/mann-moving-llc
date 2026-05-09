<script
  setup
  lang="ts"
>
const route = useRoute()
const showHomeReviews = computed(() => route.path === '/')

const reducedMotion = ref(false)
const reviewsEntered = ref(false)

const leftViewportEl = ref<HTMLElement | null>(null)
const rightViewportEl = ref<HTMLElement | null>(null)
const leftRailEl = ref<HTMLElement | null>(null)
const rightRailEl = ref<HTMLElement | null>(null)

const leftMaxScroll = ref(0)
const rightMaxScroll = ref(0)

const leftTargetTravel = ref(0)
const rightTargetTravel = ref(0)

const leftCurrentY = ref(0)
const rightCurrentY = ref(0)

const lastWheelAt = ref(0)

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t
}

function normalizeWheelDelta(event: WheelEvent) {
  // deltaMode: 0 = pixels, 1 = lines, 2 = pages
  if (event.deltaMode === 1)
    return event.deltaY * 16
  if (event.deltaMode === 2)
    return event.deltaY * window.innerHeight
  return event.deltaY
}

function onWheel(event: WheelEvent) {
  if (!showHomeReviews.value || reducedMotion.value)
    return

  lastWheelAt.value = performance.now()

  if (leftMaxScroll.value === 0 || rightMaxScroll.value === 0)
    measureRails()

  // Positive deltaY = scrolling down.
  const deltaPx = normalizeWheelDelta(event)

  // Tune: left is slower, right is faster.
  const leftSpeed = 0.55
  const rightSpeed = 0.85

  leftTargetTravel.value = Math.min(
    leftMaxScroll.value,
    Math.max(0, leftTargetTravel.value + deltaPx * leftSpeed)
  )

  rightTargetTravel.value = Math.min(
    rightMaxScroll.value,
    Math.max(0, rightTargetTravel.value + deltaPx * rightSpeed)
  )
}

function measureRails() {
  const leftViewport = leftViewportEl.value
  const rightViewport = rightViewportEl.value
  const leftRail = leftRailEl.value
  const rightRail = rightRailEl.value

  if (leftViewport && leftRail)
    leftMaxScroll.value = Math.max(0, leftRail.scrollHeight - leftViewport.clientHeight)

  if (rightViewport && rightRail)
    rightMaxScroll.value = Math.max(0, rightRail.scrollHeight - rightViewport.clientHeight)

  leftTargetTravel.value = Math.min(leftTargetTravel.value, leftMaxScroll.value)
  rightTargetTravel.value = Math.min(rightTargetTravel.value, rightMaxScroll.value)
}

onMounted(() => {
  reducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  if (!reducedMotion.value) {
    leftCurrentY.value = 16
    rightCurrentY.value = 24
  }
  lastWheelAt.value = performance.now()
  window.addEventListener('wheel', onWheel, { passive: true })

  let resizeObserver: ResizeObserver | undefined
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      measureRails()
    })
    if (leftViewportEl.value)
      resizeObserver.observe(leftViewportEl.value as unknown as Element)
    if (rightViewportEl.value)
      resizeObserver.observe(rightViewportEl.value as unknown as Element)
    if (leftRailEl.value)
      resizeObserver.observe(leftRailEl.value as unknown as Element)
    if (rightRailEl.value)
      resizeObserver.observe(rightRailEl.value as unknown as Element)
  }

  // Initial measure after mount/paint.
  requestAnimationFrame(() => {
    measureRails()
  })

  let rafId = 0
  let lastTickAt = performance.now()
  const tick = () => {
    rafId = requestAnimationFrame(tick)

    const now = performance.now()
    const dtMs = Math.min(48, Math.max(0, now - lastTickAt))
    lastTickAt = now

    if (!showHomeReviews.value)
      return

    if (reducedMotion.value) {
      leftCurrentY.value = 0
      rightCurrentY.value = 0
      return
    }

    // Ambient upward motion when idle (no wheel input recently).
    // This keeps the rails feeling alive even when the user isn't scrolling.
    if (leftMaxScroll.value === 0 || rightMaxScroll.value === 0)
      measureRails()

    const idleMs = now - lastWheelAt.value
    const idleThresholdMs = 450
    if (idleMs > idleThresholdMs) {
      const dtSeconds = dtMs / 1000
      const leftIdlePxPerSecond = 10
      const rightIdlePxPerSecond = 14

      if (leftMaxScroll.value > 0) {
        leftTargetTravel.value += leftIdlePxPerSecond * dtSeconds
        if (leftTargetTravel.value >= leftMaxScroll.value)
          leftTargetTravel.value = 0
      }

      if (rightMaxScroll.value > 0) {
        rightTargetTravel.value += rightIdlePxPerSecond * dtSeconds
        if (rightTargetTravel.value >= rightMaxScroll.value)
          rightTargetTravel.value = 0
      }
    }

    const leftTargetY = -leftTargetTravel.value
    const rightTargetY = -rightTargetTravel.value

    // RAF-driven smoothing; avoid CSS transform transitions.
    leftCurrentY.value = lerp(leftCurrentY.value, leftTargetY, 0.14)
    rightCurrentY.value = lerp(rightCurrentY.value, rightTargetY, 0.14)
  }

  rafId = requestAnimationFrame(tick)

  if (reducedMotion.value)
    reviewsEntered.value = true
  else
    requestAnimationFrame(() => {
      reviewsEntered.value = true
    })

  onBeforeUnmount(() => {
    window.removeEventListener('wheel', onWheel)
    if (resizeObserver)
      resizeObserver.disconnect()
    cancelAnimationFrame(rafId)
  })
})

watch(showHomeReviews, (isHome) => {
  if (!isHome) {
    reviewsEntered.value = false
    leftCurrentY.value = 0
    rightCurrentY.value = 0
    leftTargetTravel.value = 0
    rightTargetTravel.value = 0
    return
  }

  if (reducedMotion.value) {
    reviewsEntered.value = true
    return
  }

  reviewsEntered.value = false
  if (!reducedMotion.value) {
    leftCurrentY.value = 16
    rightCurrentY.value = 24
  }
  requestAnimationFrame(() => {
    reviewsEntered.value = true
    measureRails()
  })
})

const leftRailStyle = computed(() => {
  const entered = reducedMotion.value || reviewsEntered.value
  return {
    transform: `translate3d(0, ${leftCurrentY.value}px, 0)`,
    opacity: entered ? 1 : 0
  }
})

const rightRailStyle = computed(() => {
  const entered = reducedMotion.value || reviewsEntered.value
  return {
    transform: `translate3d(0, ${rightCurrentY.value}px, 0)`,
    opacity: entered ? 1 : 0
  }
})

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
            aria-label="Mann Muscles LLC"
          >
            <img
              src="/mann-logo-type.png"
              alt="Mann Muscles LLC"
              class="block h-7 w-auto sm:h-8"
              loading="eager"
              decoding="async"
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

    <UMain class="relative z-40! overflow-x-clip">
      <div class="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div
          class="lg:grid lg:gap-6 lg:grid-cols-[20rem_minmax(0,1fr)_20rem] 2xl:lg:grid-cols-[24rem_minmax(0,1fr)_24rem]"
        >
          <aside class="relative z-70! hidden lg:block shrink-0 self-stretch">
            <div
              v-if="showHomeReviews"
              ref="leftViewportEl"
              class="sticky top-(--ui-header-height) z-70! h-[calc(100svh-var(--ui-header-height))] overflow-hidden"
            >
              <div
                ref="leftRailEl"
                class="pt-[28vh] will-change-transform transition-opacity duration-700 ease-out"
                :style="leftRailStyle"
              >
                <HomeReviewColumn parity="even" />
              </div>
            </div>

            <slot
              v-else
              name="left"
            />
          </aside>

          <div class="relative z-10 min-w-0">
            <slot />
          </div>

          <aside class="relative z-70! hidden lg:block shrink-0 self-stretch">
            <div
              v-if="showHomeReviews"
              ref="rightViewportEl"
              class="sticky top-(--ui-header-height) z-70! h-[calc(100svh-var(--ui-header-height))] overflow-hidden"
            >
              <div
                ref="rightRailEl"
                class="pt-[56vh] will-change-transform transition-opacity duration-900 ease-out delay-150"
                :style="rightRailStyle"
              >
                <HomeReviewColumn parity="odd" />
              </div>
            </div>

            <slot
              v-else
              name="right"
            />
          </aside>
        </div>
      </div>
    </UMain>

    <UFooter
      class="relative z-0! border-t border-default bg-accented"
      :ui="{
        root: '',
        container: 'w-full max-w-none mx-auto px-0 py-2',
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
      </div>
    </UFooter>
  </div>
</template>
