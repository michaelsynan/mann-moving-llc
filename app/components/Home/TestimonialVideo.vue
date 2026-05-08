<script
  setup
  lang="ts"
>
const videos = [
  {
    src: '/videos/changing_web.mp4',
    poster: '/videos/posters/changing_web.jpg',
  },
  {
    src: '/videos/cleanout_web.mp4',
    poster: '/videos/posters/cleanout_web.jpg',
  },
  {
    src: '/videos/JunkRemovalNEW30sec_web.mp4',
    poster: '/videos/posters/JunkRemovalNEW30sec_web.jpg',
  },
  // {
  //   src: '/videos/vid_web.mp4',
  //   poster: '/videos/posters/vid_web.jpg',
  // },
]
</script>

<template>
  <div class="mx-auto max-w-6xl px-1 sm:px-6 lg:px-0">
    <div class="mb-12 text-center">
      <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-highlighted uppercase">
        Check Out These Before & Afters
      </h2>
    </div>

    <div class="flex flex-col gap-4 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-center overflow-x-hidden">
      <video
        v-for="video in videos"
        :key="video.src"
        class="testimonial-video block w-full h-auto rounded-lg border border-default bg-muted sm:w-auto"
        controls
        playsinline
        preload="metadata"
        :poster="video.poster"
      >
        <source
          :src="video.src"
          type="video/mp4"
        >
        Your browser does not support the video tag.
      </video>
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

<style scoped>
@media (min-width: 640px) {
  .testimonial-video {
    height: clamp(240px, 26vw, 500px);
    width: auto;
    max-width: none;
  }
}
</style>
