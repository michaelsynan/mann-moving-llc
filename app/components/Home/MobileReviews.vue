<script
  setup
  lang="ts"
>
import { reviews } from '~/data/reviews'

const stars = Array.from({ length: 5 }, (_, i) => i + 1)

const scroller = ref<unknown>(null)
const activeIndex = ref(0)

let scrollRaf = 0

function updateActiveFromScroll() {
  const el = scroller.value as any
  if (!el)
    return

  const cards = Array.from(el.querySelectorAll?.('[data-review-card]') ?? []) as any[]
  if (!cards.length)
    return

  const viewportCenter = (el.scrollLeft ?? 0) + (el.clientWidth ?? 0) / 2
  let bestIndex = 0
  let bestDistance = Number.POSITIVE_INFINITY

  for (const card of cards) {
    const index = Number(card?.dataset?.index)
    if (!Number.isFinite(index))
      continue

    const cardCenter = (card.offsetLeft ?? 0) + (card.offsetWidth ?? 0) / 2
    const distance = Math.abs(cardCenter - viewportCenter)
    if (distance < bestDistance) {
      bestDistance = distance
      bestIndex = index
    }
  }

  activeIndex.value = bestIndex
}

function onScroll() {
  if (scrollRaf)
    return
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0
    updateActiveFromScroll()
  })
}

onMounted(() => {
  const el = scroller.value as any
  if (!el?.addEventListener)
    return

  updateActiveFromScroll()
  el.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  const el = scroller.value as any
  el?.removeEventListener?.('scroll', onScroll)
  if (scrollRaf)
    cancelAnimationFrame(scrollRaf)
})
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartScrollLeft = ref(0)

function snapToNearestCard() {
  const el = scroller.value as any
  if (!el?.querySelectorAll)
    return

  const cards = Array.from(el.querySelectorAll('[data-review-card]') ?? []) as any[]
  if (!cards.length)
    return

  const viewportCenter = (el.scrollLeft ?? 0) + (el.clientWidth ?? 0) / 2
  let bestCard: any = null
  let bestDistance = Number.POSITIVE_INFINITY

  for (const card of cards) {
    const cardCenter = (card.offsetLeft ?? 0) + (card.offsetWidth ?? 0) / 2
    const distance = Math.abs(cardCenter - viewportCenter)
    if (distance < bestDistance) {
      bestDistance = distance
      bestCard = card
    }
  }

  const targetLeft = Math.max(0, Number(bestCard?.offsetLeft ?? 0))
  if (typeof el.scrollTo === 'function')
    el.scrollTo({ left: targetLeft, behavior: 'smooth' })
  else
    el.scrollLeft = targetLeft
}

function onPointerDown(event: PointerEvent) {
  if (event.pointerType !== 'mouse')
    return
  if (event.button !== 0)
    return

  const el = scroller.value
  if (!(el instanceof HTMLElement))
    return

  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartScrollLeft.value = el.scrollLeft

  el.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value)
    return
  const el = scroller.value
  if (!(el instanceof HTMLElement))
    return

  const delta = event.clientX - dragStartX.value
  el.scrollLeft = dragStartScrollLeft.value - delta
}

function onPointerUp(event: PointerEvent) {
  if (!isDragging.value)
    return

  isDragging.value = false

  const el = scroller.value
  if (el instanceof HTMLElement)
    el.releasePointerCapture(event.pointerId)

  // For desktop testing: on mouse drag release, smoothly snap to the nearest card.
  if (event.pointerType === 'mouse')
    snapToNearestCard()
}
</script>

<template>
  <section
    aria-label="Customer reviews"
    class="py-10"
  >
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="text-center">
        <h2 class="text-2xl font-bold tracking-tight text-highlighted">
          Customer Reviews
        </h2>
        <p class="mt-1 text-sm text-muted">
          Swipe to read what people are saying.
        </p>
      </div>
    </div>

    <div class="mt-6 w-svw mx-[calc(50%-50svw)] px-4 sm:px-6">
      <div
        ref="scroller"
        class="review-scroller no-scrollbar -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto select-none snap-x snap-mandatory overscroll-x-contain"
        :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <div class="flex items-start gap-4">
          <article
            v-for="(review, index) in reviews"
            :key="`${review.name}-${review.date}`"
            data-review-card
            :data-index="index"
            class="snap-start snap-always shrink-0 w-[86%] sm:w-[70%]"
          >
            <div class="rounded-lg border border-default bg-amber-50 p-6">
              <p class="text-lg font-semibold text-highlighted">
                {{ review.name }}
              </p>

              <div class="mt-2">
                <div
                  v-if="typeof review.stars === 'number'"
                  class="flex items-center gap-0.5 text-primary"
                  :aria-label="`${review.stars} out of 5 stars`"
                >
                  <UIcon
                    v-for="star in stars"
                    :key="star"
                    :name="star <= review.stars ? 'i-mdi-star' : 'i-mdi-star-outline'"
                    class="size-5"
                  />
                </div>
              </div>

              <p class="mt-4 text-base text-muted">
                “{{ review.review }}”
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div
        class="mt-5 flex justify-center gap-2"
        aria-label="Review position"
      >
        <span
          v-for="(_, index) in reviews"
          :key="index"
          class="size-2 rounded-full transition-colors"
          :class="index === activeIndex ? 'bg-primary' : 'bg-muted'"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.review-scroller {
  -webkit-overflow-scrolling: touch;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
