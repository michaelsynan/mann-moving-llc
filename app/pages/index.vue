<script
  setup
  lang="ts"
>
definePageMeta({
  layout: 'three-column'
})
</script>

<template>
  <div>
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

    <div class="relative z-10">
      <div class="w-screen mx-[calc(50%-50vw)]">
        <section
          class="relative isolate flex min-h-svh flex-col -mt-(--ui-header-height)  bg-[url('/best-moving-company.png')] bg-fixed bg-cover bg-center bg-no-repeat"
        >
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 bg-white/45 z-10"
          />

          <div
            class="relative z-20 mx-auto flex-1 w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center pt-[calc(var(--ui-header-height)+2.5rem)] pb-32 sm:pb-36 lg:pb-40"
          >
            <div class="w-full">
              <div class="flex justify-center">
                <AppLogo class="w-full max-w-4xl h-auto" />
              </div>

              <div class="mx-auto mt-6 max-w-3xl text-center">
                <h1 class="text-4xl! md:text-6xl! font-black! leading-tight tracking-tight text-highlighted uppercase">
                  WE ARE CHANGING THE JUNK REMOVAL INDUSTRY
                </h1>

                <p class="mt-4 text-xl md:text-2xl text-muted ">
                  We will cut your junk removal costs with Mann Muscles LLC. We buy your junk and keep it out of the
                  landfill.
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
          </div>

          <div class="absolute inset-x-0 bottom-0 z-20 w-full">
            <HomeTextStrip />
          </div>
        </section>
      </div>

      <UPageSection class="">
        <HomeSocials />
      </UPageSection>

      <div class="lg:hidden border-b border-default">
        <HomeMobileReviews />
      </div>

      <UPageSection class=" ">
        <HomeTestimonialVideo />
      </UPageSection>

      <section class=" bg-muted shadow-none border border-default  py-10 rounded-lg">
        <div class="mx-auto max-w-6xl px-4 pt-6 pb-0 sm:px-6 lg:px-8 flex justify-center border-0">
          <img
            src="/content/Logo%26NumberClassicPNGTransparent.png"
            alt="Mann Muscles LLC logo and phone number"
            class="h-32 sm:h-42 lg:h-44 w-auto"
            loading="lazy"
            decoding="async"
          >
        </div>

        <UPageSection
          id="features"
          class=" bg-transparent! rounded-xl "
          title="Junk Removal & Moving You Can Trust"
          description="We have 5 stars on Facebook and Google for a reason. From moving you to removing your old stuff, we do it all. Leave the heavy lifting to us so you can focus on the important aspects of your day."
          :ui="{ container: 'py-6 sm:py-8 lg:py-10 gap-6 sm:gap-8', title: 'text-center', description: 'text-center', body: 'mt-8 sm:mt-10' }"
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

        <div class="mx-auto max-w-6xl px-4 pt-1 pb-8 sm:px-6 lg:px-8">
          <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <UButton
              label="Junk Removal"
              to="/junk-removal"
              trailing-icon="i-lucide-arrow-right"
              size="xl"
              color="primary"
              variant="solid"
              class="w-full sm:w-auto"
            />
            <UButton
              label="Moving Help"
              to="/moving"
              icon="i-mdi-truck-fast"
              size="xl"
              color="neutral"
              variant="subtle"
              class="w-full sm:w-auto"
            />
          </div>
        </div>
      </section>
      <!-- <UPageSection>
      <HomeReviews />
    </UPageSection> -->

      <div class="pb-10 pt-20 px-8 md:px-10">
        <HomeAbout />
      </div>
    </div>
  </div>
</template>
