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
      <div class="relative mx-auto max-w-6xl px-4 pt-20 pb-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div class="flex justify-center">
          <AppLogo class="w-full max-w-4xl h-auto" />
        </div>

        <div class="mx-auto mt-4 max-w-3xl text-center">
          <h1 class="text-3xl font-black leading-tight tracking-tight text-highlighted uppercase sm:text-5xl">
            Book Your Move
          </h1>

          <p class="mt-4 text-base text-muted sm:text-lg">
            Moving soon? We provide the muscle you need. Our team handles loading, unloading, and moving heavy items
            safely and efficiently. Fast, careful, and stress-free moving help.
          </p>
        </div>
      </div>
    </section>

    <UPageSection>
      <MovingFormCard />
    </UPageSection>
  </div>
</template>
