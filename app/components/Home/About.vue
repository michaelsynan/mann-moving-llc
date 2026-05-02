<script
  setup
  lang="ts"
>
</script>

<template>
  <div class="space-y-6">
    <div class="relative rounded-lg border border-default overflow-hidden">
      <img
        src="/mann-group.jpg"
        alt="Mann Muscles LLC crew group photo"
        class="h-112 w-full object-cover object-top sm:h-136 lg:h-160"
        loading="lazy"
        decoding="async"
      >

      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45))] dark:bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65))]"
      />
      <div
        aria-hidden="true"
        class="about-grain pointer-events-none absolute inset-0 opacity-25 mix-blend-soft-light dark:opacity-30"
      />
    </div>

    <div class="mx-auto max-w-3xl text-center">
      <h2 class="text-4xl sm:text-5xl font-bold tracking-tight text-highlighted">
        We are Mann Muscles LLC
      </h2>

      <p class="mt-4 text-base sm:text-lg text-muted">
        Mann Muscles LLC is a family-run team serving Northeastern PA. We handle junk removal and help you from move by
        doing the heavy lifting with care. We are committed to giving you the best service possible and helping you move
        on to the next chapter of your life with ease.
      </p>

      <div class="mt-6 flex justify-center">
        <UButton
          label="Get in Touch"
          to="tel:"
          icon="i-mdi-phone"
          size="xl"
          color="primary"
          variant="solid"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-grain {
  background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A//www.w3.org/2000/svg'%20width%3D'180'%20height%3D'180'%3E%3Cfilter%20id%3D'n'%3E%3CfeTurbulence%20type%3D'fractalNoise'%20baseFrequency%3D'.9'%20numOctaves%3D'3'%20stitchTiles%3D'stitch'/%3E%3C/filter%3E%3Crect%20width%3D'180'%20height%3D'180'%20filter%3D'url(%23n)'%20opacity%3D'.5'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 180px 180px;
  filter: contrast(140%) brightness(115%);
}
</style>
