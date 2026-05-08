<script
  setup
  lang="ts"
>
interface Props {
  header: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <section
    class="relative isolate -mt-(--ui-header-height) border-b border-default bg-[url('/best-moving-company.png')] bg-fixed bg-cover bg-center bg-no-repeat"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-white/45 z-10"
    />

    <div
      class="relative z-20 mx-auto max-w-6xl px-4 pt-[calc(var(--ui-header-height)+2.5rem)] pb-20 sm:px-6 sm:pt-16 sm:pb-26 lg:px-8 lg:pt-20 lg:pb-30"
    >
      <div class="flex justify-center">
        <AppLogo class="w-full max-w-4xl h-auto" />
      </div>

      <div class="mx-auto mt-4 max-w-3xl text-center">
        <h1 class="text-3xl font-black leading-tight tracking-tight text-highlighted uppercase sm:text-5xl">
          {{ header }}
        </h1>

        <p
          v-if="description"
          class="mt-4 text-lg font-medium text-muted sm:text-xl"
        >
          {{ description }}
        </p>
      </div>
    </div>
  </section>
</template>
