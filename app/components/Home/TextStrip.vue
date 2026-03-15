<template>
  <div class="w-full bg-inverted text-inverted px-6 py-8 sm:px-10 sm:py-10 overflow-hidden">
    <div class="marquee">
      <div class="marquee__inner">
        <div class="marquee__track">
          <div class="marquee__item">
            <UIcon
              name="i-mdi-truck-fast"
              class="marquee__icon text-primary"
            />
            <span>Stress-Free Moving</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-dump-truck"
              class="marquee__icon text-primary"
            />
            <span>Get Paid for Your Junk</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-star"
              class="marquee__icon text-primary"
            />
            <span>Rated Five Stars</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-cash-multiple"
              class="marquee__icon text-primary"
            />
            <span>Cut Costs</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-recycle"
              class="marquee__icon text-primary"
            />
            <span>Keep It Off The Landfill</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-calendar-clock"
              class="marquee__icon text-primary"
            />
            <span>Fast Scheduling</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-shield-check"
              class="marquee__icon text-primary"
            />
            <span>Reliable & Professional</span>
          </div>
        </div>

        <div
          class="marquee__track"
          aria-hidden="true"
        >
          <div class="marquee__item">
            <UIcon
              name="i-mdi-truck-fast"
              class="marquee__icon text-primary"
            />
            <span>Moving</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-dump-truck"
              class="marquee__icon text-primary"
            />
            <span>Junk Removal</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-star"
              class="marquee__icon text-primary"
            />
            <span>Rated Five Stars</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-cash-multiple"
              class="marquee__icon text-primary"
            />
            <span>Cut Costs</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-recycle"
              class="marquee__icon text-primary"
            />
            <span>Keep It Out Of The Landfill</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-calendar-clock"
              class="marquee__icon text-primary"
            />
            <span>Fast Scheduling</span>
          </div>
          <div class="marquee__item">
            <UIcon
              name="i-mdi-shield-check"
              class="marquee__icon text-primary"
            />
            <span>Reliable, Professional Service</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg,
      transparent,
      #000 10%,
      #000 90%,
      transparent);
  mask-image: linear-gradient(90deg,
      transparent,
      #000 10%,
      #000 90%,
      transparent);
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
}

.marquee__inner {
  display: flex;
  width: max-content;
  animation: marquee-scroll 40s linear infinite;
}

.marquee__track {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  padding-right: 2.5rem;
  white-space: nowrap;
}

.marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
  font-size: clamp(1.25rem, 3.75vw, 3rem);
  line-height: 1.05;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.marquee__icon {
  width: 1.2em;
  height: 1.2em;
  flex-shrink: 0;
  opacity: 0.9;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee__inner {
    animation: none;
  }
}
</style>
