<script
  setup
  lang="ts"
>
const videos = [
  '/videos/changing_web.mp4',
  '/videos/cleanout_web.mp4',
  // '/videos/JunkRemovalNEW30sec_web.mp4',
  '/videos/vid_web.mp4'
]

// Temporarily disabled poster image usage per request.
// const poster = '/content/ProfilePic1200x1200PNGTransparent.png'
</script>

<template>
  <div class="mx-auto max-w-6xl px-1 sm:px-6 lg:px-8 ">
    <div class="mb-12 text-center">
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted">
        Check out these before and afters
      </h2>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div
        v-for="videoSrc in videos"
        :key="videoSrc"
        class="overflow-hidden rounded-lg border border-default bg-muted"
      >
        <video
          class="block w-full h-auto"
          controls
          playsinline
          preload="metadata"
        >
          <source
            :src="videoSrc"
            type="video/mp4"
          >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>

    <div class="mt-16 flex w-full justify-center">
      <UButton
        label="Leave a Review"
        to="https://www.facebook.com/MannMuscles/reviews/?id=100063722133622&sk=reviews"
        target="_blank"
        rel="noopener noreferrer"
        trailing-icon="i-lucide-arrow-right"
        color="primary"
        size="xl"
        variant="solid"
        class="w-full sm:w-auto"
      />
    </div>
  </div>
</template>
