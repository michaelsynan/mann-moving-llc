<script
  setup
  lang="ts"
>
</script>

<template>
  <div class="space-y-6">
    <div class="relative rounded-lg border border-default overflow-hidden">
      <NuxtImg
        src="/mann-group.png"
        alt="Mann Muscles LLC crew group photo"
        class="block w-full h-auto"
        loading="lazy"
        decoding="async"
        width="1365"
        height="768"
        format="webp"
        sizes="100vw sm:80vw lg:60vw"
        :placeholder="[160, 90]"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45))] dark:bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65))]"
      />
      <div
        aria-hidden="true"
        class="about-grain pointer-events-none absolute inset-0 opacity-25 mix-blend-soft-light dark:opacity-30"
      />
    </div>

    <div class="relative z-10 mx-auto mt-6 sm:-mt-20 lg:-mt-24 max-w-xl sm:max-w-2xl">
      <div class="rounded-lg border border-default bg-muted px-6 py-8 sm:px-10 sm:py-10 text-center">
        <h2 class="text-4xl sm:text-5xl font-bold tracking-tight text-highlighted">
          We are Mann Muscles LLC
        </h2>

        <p class="mt-4 text-base sm:text-lg text-muted">
          What started as a small family-run business, Mann Muscles LLC has grown into a trusted team serving
          Northeastern
          PA. We work hard, treat every customer with respect, and never forget the values that built our company. From
          heavy lifting to full junk removal, we’re committed to making every job simple, stress-free, and done right.

        </p>

        <div class="mt-6 flex w-full justify-center">
          <UButton
            label="Get in Touch"
            href="tel:+15702678864"
            icon="i-mdi-phone"
            aria-label="Call 1-570-267-8864"
            size="xl"
            color="primary"
            variant="solid"
            class="w-full sm:w-auto"
          />
        </div>
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
