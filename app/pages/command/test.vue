<template>
  <UContainer class="py-12">
    <UCard class="mx-auto max-w-2xl">
      <template #header>
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold text-highlighted">
            /command/test
          </h1>
          <p class="text-sm text-muted">
            Subpage guard test (also should be protected).
          </p>
        </div>
      </template>

      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <UButton
          to="/command"
          color="primary"
          variant="solid"
        >
          Back to /command
        </UButton>

        <UButton
          to="/"
          color="neutral"
          variant="outline"
        >
          Home
        </UButton>
      </div>
    </UCard>
  </UContainer>
</template>
