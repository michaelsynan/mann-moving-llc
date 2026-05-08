<script
  setup
  lang="ts"
>
const heroDescription: string | undefined = undefined
// const heroDescription: string | undefined = 'Need junk gone? We make it easy. Fast, responsible, and we even buy what we can to save you money and keep stuff out of landfills. Simple, stress-free junk removal.'
</script>

<template>
  <div>
    <div class="relative z-10">
      <SharedPageHero
        header="Schedule Your Junk Removal"
        :description="heroDescription"
      />

      <UPageSection :ui="{ container: 'py-6! sm:py-8! lg:py-10!' }">
        <RemovalFormCard />
      </UPageSection>
    </div>
  </div>
</template>
<!--  -->