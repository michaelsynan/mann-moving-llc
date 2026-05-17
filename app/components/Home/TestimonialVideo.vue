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
    src: '/videos/Shed_demo_and_cleanout_web.mp4',
    poster: '/videos/posters/Shed_demo_and_cleanout_web.jpg',
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

    <div class="testimonial-videos overflow-x-hidden">
      <div
        v-for="video in videos"
        :key="video.src"
        class="testimonial-video-item"
      >
        <video
          class="testimonial-video block rounded-lg border border-default bg-muted"
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
.testimonial-videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.testimonial-video-item {
  display: flex;
  justify-content: center;
}

@media (min-width: 640px) {
  .testimonial-videos {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
  }

  .testimonial-video-item {
    flex: 0 0 calc(50% - 0.75rem);
    height: clamp(240px, 32vw, 380px);
    align-items: stretch;
  }

  .testimonial-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

@media (min-width: 1024px) {
  .testimonial-videos {
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .testimonial-video-item {
    flex: 0 1 auto;
    height: auto;
  }

  .testimonial-video {
    height: clamp(220px, 18vw, 320px);
    width: auto;
    max-width: 100%;
    object-fit: contain;
  }
}
</style>
