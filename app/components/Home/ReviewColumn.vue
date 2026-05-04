<script
  setup
  lang="ts"
>
import type { Review } from '~/data/reviews'
import { reviews as allReviews } from '~/data/reviews'

type Parity = 'odd' | 'even'

const props = withDefaults(
  defineProps<{
    parity: Parity
    count?: number
  }>(),
  {
    count: undefined
  }
)

const stars = Array.from({ length: 5 }, (_, i) => i + 1)

function isOddPosition(index: number) {
  // Treat “odd/even” as human positions (1-based):
  // odd -> 1st, 3rd, 5th... -> index 0, 2, 4...
  // even -> 2nd, 4th, 6th... -> index 1, 3, 5...
  return index % 2 === 0
}

const reviews = computed<Review[]>(() => {
  const filtered = allReviews.filter((_, index) => {
    return props.parity === 'odd' ? isOddPosition(index) : !isOddPosition(index)
  })

  if (typeof props.count === 'number')
    return filtered.slice(0, Math.max(0, props.count))

  return filtered
})
</script>

<template>
  <div class="flex flex-col">
    <div
      v-for="review in reviews"
      :key="`${review.name}-${review.date}`"
      class="min-h-screen flex items-center"
    >
      <div class="relative z-20 w-full rounded-lg border border-default bg-default p-6 sm:p-8">
        <div class="min-w-0">
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

            <div
              v-else
              class="inline-flex items-center gap-2 rounded-full border border-default bg-default px-3 py-1 text-sm font-semibold text-highlighted"
              aria-label="Recommends"
            >
              <UIcon
                name="i-lucide-badge-check"
                class="size-4 text-primary"
              />
              <span>{{ review.stars }}</span>
            </div>
          </div>
        </div>

        <p class="mt-4 text-base text-muted">
          “{{ review.review }}”
        </p>
      </div>
    </div>
  </div>
</template>
