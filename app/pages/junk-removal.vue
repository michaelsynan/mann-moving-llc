<script
  setup
  lang="ts"
></script>

<template>
  <div>
    <section
      class="relative isolate -mt-(--ui-header-height) border-b border-default bg-[url('/cleaning-moving-nepa.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-white/70 z-10"
      />

      <img
        src="/content/tribal.webp"
        alt=""
        aria-hidden="true"
        class="pointer-events-none fixed left-2 top-1/2 -translate-y-1/2 opacity-15 sm:opacity-25 md:opacity-30 h-auto max-h-[18vh] sm:max-h-[36vh] md:left-25 md:top-25 md:translate-y-0 md:max-h-[60vh] z-0"
        loading="lazy"
        decoding="async"
      >

      <img
        src="/content/tribal.webp"
        alt=""
        aria-hidden="true"
        class="pointer-events-none fixed right-2 top-1/2 -translate-y-1/2 opacity-15 sm:opacity-25 md:opacity-30 h-auto max-h-[18vh] sm:max-h-[36vh] md:right-25 md:top-25 md:translate-y-0 md:max-h-[60vh] z-0 scale-x-[-1]"
        loading="lazy"
        decoding="async"
      >

      <div class="relative z-20 mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div class="flex justify-center">
          <AppLogo class="w-full max-w-4xl h-auto" />
        </div>

        <div class="mx-auto mt-4 max-w-3xl pb-10 sm:pb-16 lg:pb-20 text-center">
          <h1 class="text-3xl font-black leading-tight tracking-tight text-highlighted uppercase sm:text-5xl">
            Schedule Your Junk Removal
          </h1>

          <p class="mt-4 text-base text-muted sm:text-lg">
            Need junk gone? We make it easy. Fast, responsible, and we even buy what we can to save you money and keep
            stuff out of landfills. Simple, stress-free junk removal.
          </p>
        </div>
      </div>
    </section>

    <UPageSection>
      <RemovalFormCard />
    </UPageSection>
  </div>
</template>
