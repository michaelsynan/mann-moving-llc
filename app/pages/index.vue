<template>
  <div>
    <section
      class="relative -mt-(--ui-header-height) border-b border-default bg-[url('/cleaning-moving-nepa.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-white/70"
      />

      <div class="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div class="flex justify-center">
          <AppLogo class="w-full max-w-4xl h-auto" />
        </div>

        <div class="mx-auto mt-6 max-w-3xl text-center">
          <h1 class="text-3xl font-black leading-tight tracking-tight text-highlighted uppercase sm:text-5xl">
            WE ARE CHANGING THE JUNK REMOVAL INDUSTRY
          </h1>

          <p class="mt-4 text-base text-muted sm:text-lg">
            We will cut your junk removal costs with Mann Muscles LLC. We buy your junk and keep it out of the landfill.
            Our team makes it stress-free.
          </p>

          <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <UButton
              label="Junk Removal"
              to="/junk-removal"
              icon="i-lucide-arrow-right"
              size="xl"
              color="primary"
              variant="solid"
              class="w-full sm:w-auto px-8 py-4 text-base sm:text-lg"
            />
            <UButton
              label="Moving Help"
              to="/moving"
              icon="i-mdi-truck-fast"
              size="xl"
              color="neutral"
              variant="subtle"
              class="w-full sm:w-auto px-8 py-4 text-base sm:text-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <HomeTextStrip />

    <UPageSection class="border-b border-default">
      <HomeSocials />
    </UPageSection>

    <UPageSection class="border-b border-default">
      <HomeTestimonialVideo />
    </UPageSection>

    <UPageSection
      id="features"
      class="border-b border-default bg-accented"
      title="Junk Removal & Moving You Can Trust"
      description="We have 5 stars on Facebook and Google for a reason. From moving you to removing your old stuff, we do it all. Leave the heavy lifting to us so you can focus on the important aspects of your day."
      :ui="{ title: 'text-left sm:text-center', description: 'text-left sm:text-center' }"
      :features="[{
        icon: 'i-lucide-shield-check',
        title: 'Insured & ready to go Junk Removal',
        description: 'We take our job seriously. Our team is fully insured for junk removal jobs.'
      }, {
        icon: 'i-lucide-file-check',
        title: 'Registered in PA',
        description: 'When you work with us have the peace of mind knowing we are a registered business and follow all local regulations.'
      }, {
        icon: 'i-lucide-star',
        title: 'Rated 5 Stars',
        description: 'Ask about us. We prioritize providing excellent service and customer satisfaction.'
      }, {
        icon: 'i-lucide-calendar-days',
        title: 'Over 10 Years Experience',
        description: 'Our team has been doing this for over a decade. Trust we have seen it all and have an answer for every situation.'
      }, {
        icon: 'i-lucide-users',
        title: 'Family Owned & Operated',
        description: 'Family operated, run by people who care and have roots here in the community. NEPA is our backyard and we treat it as such.'
      }, {
        icon: 'i-lucide-heart',
        title: 'Putting Customers First',
        description: 'Your happiness is our number one priority. Whatever you need, we are here to help.'
      }]"
    />
    <UPageSection>
      <HomeReviews />
    </UPageSection>

    <UPageCTA
      as="section"
      class="border-t border-default bg-accented/60"
      title="Ready to get started? Call the Mann Today!"
      description="Whether you're moving or need something removed, we're here to help."
      variant="naked"
      :ui="{ root: 'rounded-none overflow-hidden', container: 'relative z-10 py-16 sm:py-28 lg:py-32' }"
      :links="[{
        label: 'Junk Removal',
        to: '/junk-removal',
        trailingIcon: 'i-lucide-arrow-right',
        size: 'xl'
      }, {
        label: 'Moving Help',
        to: '/moving',
        icon: 'i-mdi-truck-fast',
        size: 'xl',
        color: 'neutral',
        variant: 'subtle'
      }]"
    >
      <template #top>
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-0 opacity-25 [--grid-color:rgba(0,0,0,0.10)]"
          :style="{
            backgroundImage: 'linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }"
        />
      </template>

      <template #title>
        <span class="flex flex-col items-center gap-6">
          <span class="inline-flex items-center justify-center rounded-full bg-muted ring-4 ring-primary p-5 mb-1">
            <UIcon
              name="i-lucide-thumbs-up"
              class="size-12 text-primary"
            />
          </span>
          <span>Ready to get started with us?</span>
        </span>
      </template>
    </UPageCTA>

    <UPageSection class="bg-elevated border-t border-default">
      <HomeAbout />
    </UPageSection>
  </div>
</template>
