<script
  setup
  lang="ts"
>
const heroDescription: string | undefined = undefined
// const heroDescription: string | undefined = 'Moving soon? We provide the muscle you need. Our team handles loading, unloading, and moving heavy items safely and efficiently. Fast, careful, and stress-free moving help.'
</script>

<template>
  <div>
    <div class="relative z-10">
      <SharedPageHero
        header="Book Your Move"
        :description="heroDescription"
      />

      <UPageSection :ui="{ container: 'py-6! sm:py-8! lg:py-10!' }">
        <MovingFormCard />
      </UPageSection>
    </div>
  </div>
</template>
