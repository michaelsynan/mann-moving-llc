<script
  setup
  lang="ts"
></script>

<template>
  <div>
    <section
      class="relative -mt-(--ui-header-height) border-b border-default bg-[url('/cleaning-moving-nepa.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-white/70"
      />

      <img
        src="/content/tribal.webp"
        alt=""
        aria-hidden="true"
        class="pointer-events-none left-25 fixed top-25 opacity-30 md:block h-auto max-h-[60vh] z-10"
        loading="lazy"
        decoding="async"
      >

      <img
        src="/content/tribal.webp"
        alt=""
        aria-hidden="true"
        class="pointer-events-none right-25 fixed top-25 opacity-30 md:block h-auto max-h-[60vh] z-10 scale-x-[-1]"
        loading="lazy"
        decoding="async"
      >

      <div class="relative mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
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
