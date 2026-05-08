<script
  setup
  lang="ts"
>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const state = reactive({
  email: '',
  password: ''
})

const errorMessage = ref<string | null>(null)
const isSubmitting = ref(false)

const turnstileToken = ref<string | undefined>(undefined)
const turnstileKey = ref(0)
const turnstileOptions = {
  'error-callback': (error: unknown) => {
    if (!import.meta.client) {
      return
    }

    console.error('[turnstile] widget error', {
      error,
      host: window.location.host,
      href: window.location.href
    })
  },
  'unsupported-callback': () => {
    if (!import.meta.client) {
      return
    }

    console.error('[turnstile] widget unsupported', {
      host: window.location.host,
      href: window.location.href
    })
  }
} as const

function validateForm(values: typeof state) {
  const errors: Array<{ name: string, message: string }> = []

  if (!values.email.trim()) {
    errors.push({ name: 'email', message: 'Email is required.' })
  } else if (!values.email.includes('@')) {
    errors.push({ name: 'email', message: 'Enter a valid email.' })
  }

  if (!values.password) {
    errors.push({ name: 'password', message: 'Password is required.' })
  }

  return errors
}

async function onSubmit() {
  errorMessage.value = null
  isSubmitting.value = true

  try {
    if (!turnstileToken.value) {
      errorMessage.value = 'Please complete the Turnstile challenge.'
      return
    }

    const verification = await $fetch<{ success: boolean }>('/api/turnstile-verify', {
      method: 'POST',
      body: { token: turnstileToken.value }
    })

    if (!verification?.success) {
      errorMessage.value = 'Turnstile verification failed. Please try again.'
      turnstileToken.value = undefined
      turnstileKey.value += 1
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: state.email,
      password: state.password
    })

    if (error) {
      errorMessage.value = error.message
      return
    }

    await navigateTo('/command')
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : String(err)
  } finally {
    isSubmitting.value = false
  }
}

async function onSignOut() {
  errorMessage.value = null

  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      errorMessage.value = error.message
      return
    }

    await navigateTo('/')
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : String(err)
  }
}
</script>

<template>
  <UContainer class="py-12">
    <div class="mx-auto max-w-lg">
      <UCard>
        <template #header>
          <div class="space-y-1">
            <h1 class="text-2xl font-semibold text-highlighted">
              Login
            </h1>
            <p class="text-sm text-muted">
              Sign in to access /command.
            </p>
          </div>
        </template>

        <div class="space-y-4">
          <UAlert
            v-if="user"
            color="success"
            variant="subtle"
            title="Signed in"
            :description="user.email ? `Signed in as ${user.email}` : 'Signed in.'"
            icon="i-lucide-check"
          />

          <UAlert
            v-else-if="errorMessage"
            color="error"
            variant="subtle"
            title="Sign in failed"
            :description="errorMessage"
            icon="i-lucide-alert-triangle"
          />

          <UForm
            v-if="!user"
            :state="state"
            :validate="validateForm"
            @submit="onSubmit"
          >
            <div class="space-y-4">
              <UFormField
                name="email"
                label="Email"
                required
                size="lg"
              >
                <UInput
                  v-model="state.email"
                  type="email"
                  autocomplete="email"
                  placeholder="you@example.com"
                  size="lg"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                name="password"
                label="Password"
                required
                size="lg"
              >
                <UInput
                  v-model="state.password"
                  type="password"
                  autocomplete="current-password"
                  placeholder="••••••••"
                  size="lg"
                  class="w-full"
                />
              </UFormField>

              <ClientOnly>
                <NuxtTurnstile
                  :key="turnstileKey"
                  v-model="turnstileToken"
                  :options="turnstileOptions"
                />
              </ClientOnly>

              <UButton
                type="submit"
                color="primary"
                variant="solid"
                size="lg"
                block
                :loading="isSubmitting"
                :disabled="!turnstileToken"
              >
                Sign in
              </UButton>
            </div>
          </UForm>
        </div>

        <template #footer>
          <div
            v-if="user"
            class="flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <UButton
              to="/command"
              color="primary"
              variant="solid"
            >
              Go to /command
            </UButton>

            <UButton
              color="neutral"
              variant="outline"
              @click="onSignOut"
            >
              Sign out
            </UButton>
          </div>

          <p
            v-else
            class="text-xs text-muted"
          >
            Create a test user in Supabase Auth (Email/Password), then sign in here.
          </p>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
