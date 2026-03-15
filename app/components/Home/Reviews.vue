<script
  setup
  lang="ts"
>
type Review = {
  author: string
  company: string
  stars: number
  text: string
  photos: Array<{ label: string, seed: string }>
  avatarSrc?: string
}

const stars = Array.from({ length: 5 }, (_, i) => i + 1)

const getInitials = (value: string) => {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0)
    return ''

  if (parts.length === 1)
    return parts[0]![0]!.toUpperCase()

  return `${parts[0]![0]!.toUpperCase()}${parts.at(-1)![0]!.toUpperCase()}`
}

const formatAuthorName = (value: string) => {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length <= 1)
    return value.trim()

  const first = parts[0]!
  const middleParts = parts.slice(1, -1)
  const middleInitials = middleParts
    .map(part => part.replace(/\./g, ''))
    .filter(Boolean)
    .map(part => `${part[0]!.toUpperCase()}.`)

  const lastInitial = `${parts.at(-1)![0]!.toUpperCase()}.`

  return [first, ...middleInitials, lastInitial].join(' ')
}

const formatReviewText = (value: string) => {
  // Keep the wording but remove excessive paragraph breaks.
  return value
    .replace(/\s*\n+\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

const reviews: Review[] = [
  {
    author: 'Jacob W Rosenstein',
    company: 'Mann Muscles LLC',
    stars: 5,
    text: 'Mann Muscles cleaned out an entire 3 story building and filled TWO 40 yard dumpsters in a day.\n\nMatt and his crew are quick, clean, funny, and affordable.\n\nIt’s hard to find really one of those qualities - along with all of that said, they’re a local business.\n\nThank-you Matt and crew!',
    avatarSrc: '/jacob.jpg',
    photos: Array.from({ length: 5 }, (_, i) => ({
      label: `Mann Muscles photo ${i + 1}`,
      seed: `mann-muscles-jacob-${i + 1}`
    }))
  },
  {
    author: 'Phoenix Reina',
    company: 'Mann Muscles LLC',
    stars: 5,
    text: '100% recommend for all your moving needs.\n\nI needed someone last minute to pick up a couch for me over an hour away & he made himself available to do so!\n\nHe picked up my fiance in his truck & off they went to get our new to us 5 piece sectional!\n\nHe & my fiance loaded it up in his truck, unloaded it once home, & up a flight of steps to our second floor apartment!\n\nI\'ll say it again, I 100% recommend mann muscles for all your moving needs he was absolutely amazing & super affordable!\n\nThanks again Matt!',
    avatarSrc: '/p.jpg',
    photos: Array.from({ length: 5 }, (_, i) => ({
      label: `Mann Muscles photo ${i + 1}`,
      seed: `mann-muscles-phoenix-${i + 1}`
    }))
  },
  {
    author: 'Christina Marie',
    company: 'Mann Muscles LLC',
    stars: 5,
    text: 'Found these guys from a guy in Kingston!\n\nI have to honestly say and I had a lot of experience with movers.\n\nThis was the first time I saw movers wrap furniture so it didn’t get knicked.\n\nThese guys were so nice, careful and did not lolli gag!!!\n\nHe gave me an estimate of 2 hours and it was just that.\n\nThey fit the furniture in the truck like a puzzle and fast at that.\n\nIt was unbelievable and I was beyond happy.\n\nWill be calling them for every move from this point.\n\nI already referred them to about 5 people.',
    avatarSrc: '/christina.jpg',
    photos: Array.from({ length: 5 }, (_, i) => ({
      label: `Mann Muscles photo ${i + 1}`,
      seed: `mann-muscles-christina-${i + 1}`
    }))
  }
]
</script>

<template>
  <div class="space-y-8">
    <div
      v-for="(review, idx) in reviews"
      :key="review.author"
      class="flex flex-col items-start gap-8"
      :class="idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'"
    >
      <div
        class="w-full self-start rounded-lg border border-default bg-primary/5 dark:bg-primary/10 p-6 sm:p-8 lg:w-1/2 lg:sticky lg:top-24"
      >
        <div class="flex items-start gap-4">
          <div class="size-12 shrink-0">
            <img
              v-if="review.avatarSrc"
              class="size-12 rounded-full object-cover border border-default"
              :src="review.avatarSrc"
              :alt="`${formatAuthorName(review.author)} photo`"
              loading="lazy"
              decoding="async"
            >
            <div
              v-else
              class="size-12 rounded-full bg-muted flex items-center justify-center font-semibold text-highlighted"
              :aria-label="`${formatAuthorName(review.author)} avatar`"
              role="img"
            >
              {{ getInitials(review.author) }}
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p class="font-semibold text-highlighted">
                {{ formatAuthorName(review.author) }}
              </p>
            </div>

            <div
              class="mt-1 flex items-center gap-0.5 text-primary"
              :aria-label="`${review.stars} out of 5 stars`"
            >
              <UIcon
                v-for="star in stars"
                :key="star"
                :name="star <= review.stars ? 'i-mdi-star' : 'i-mdi-star-outline'"
                class="size-5"
              />
            </div>

            <p class="mt-4 text-base text-muted">
              “{{ formatReviewText(review.text) }}”
            </p>
          </div>
        </div>
      </div>

      <div class="w-full space-y-4 self-start lg:w-1/2">
        <div
          v-for="photo in review.photos"
          :key="photo.seed"
          class="h-48 sm:h-56 lg:h-64 rounded-lg border border-default bg-muted overflow-hidden"
          role="img"
          :aria-label="photo.label"
        >
          <img
            class="h-full w-full object-cover"
            :src="`https://picsum.photos/seed/${photo.seed}/900/500`"
            :alt="photo.label"
            loading="lazy"
            decoding="async"
          >
        </div>
      </div>
    </div>

    <div class="flex justify-center pt-6 pb-2">
      <UButton
        label="See All Reviews"
        to="https://www.facebook.com/MannMuscles/reviews/?id=100063722133622&sk=reviews"
        target="_blank"
        rel="noopener noreferrer"
        trailing-icon="i-lucide-arrow-right"
        color="primary"
        size="xl"
        variant="solid"
      />
    </div>
  </div>
</template>
