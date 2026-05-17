<script
  setup
  lang="ts"
>
type FormError = { name: string, message: string }

type Address = {
  street: string
  apt: string
  city: string
  state: string
  zip: string
}

const token = ref()
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
const supabase = useSupabaseClient()
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const submitSuccess = ref(false)

const submitValidationError = ref<string | null>(null)

const honeypotWebsite = ref('')
const formStartedAt = ref<number | null>(null)

const DUPLICATE_SUBMIT_TTL_SECONDS = 60 * 60 * 24 * 14
const DUPLICATE_STORAGE_KEY = 'mm-moving-submit-at'
const duplicateSubmitMessage = "It looks like you've already submitted some information. Please contact us to discuss"

const movingSubmittedAt = useCookie<string | undefined>(DUPLICATE_STORAGE_KEY, {
  maxAge: DUPLICATE_SUBMIT_TTL_SECONDS,
  sameSite: 'lax'
})

const hasRecentSubmission = computed(() => Boolean(movingSubmittedAt.value))

const allowDuplicateSubmissions = computed(() => import.meta.dev)

const shouldBlockDuplicateSubmission = computed(() => {
  return hasRecentSubmission.value && !allowDuplicateSubmissions.value
})

const duplicateSubmitDescription = computed(() => {
  if (allowDuplicateSubmissions.value) {
    return `You already uploaded [dev allowing upload]: ${duplicateSubmitMessage}`
  }
  return duplicateSubmitMessage
})

const isSubmissionLocked = computed(() => hasRecentSubmission.value && !submitSuccess.value)

function describeError(err: unknown): string {
  if (err instanceof Error) {
    const anyErr = err as any
    const data = anyErr?.data
    if (data && typeof data === 'object') {
      const message = (data as { error?: unknown; message?: unknown }).error
        ?? (data as { error?: unknown; message?: unknown }).message
      if (typeof message === 'string' && message.trim()) {
        return message
      }
    }

    return err.message
  }

  if (typeof err === 'string') {
    return err
  }

  if (err && typeof err === 'object') {
    const maybeMessage = (err as { message?: unknown }).message
    if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
      return maybeMessage
    }

    try {
      return JSON.stringify(err)
    } catch {
      return String(err)
    }
  }

  return String(err)
}

function markMovingSubmission() {
  const timestamp = new Date().toISOString()
  movingSubmittedAt.value = timestamp

  if (import.meta.client) {
    localStorage.setItem(DUPLICATE_STORAGE_KEY, timestamp)
  }
}

onMounted(() => {
  if (!import.meta.client) {
    return
  }

  if (formStartedAt.value == null) {
    formStartedAt.value = Date.now()
  }

  const localMarker = localStorage.getItem(DUPLICATE_STORAGE_KEY)
  if (localMarker && !movingSubmittedAt.value) {
    movingSubmittedAt.value = localMarker
  }
})

const usStateOptions = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'District of Columbia', value: 'DC' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' }
]

const usStateValueSet = new Set(usStateOptions.map((o) => o.value))

function emptyAddress(): Address {
  return {
    street: '',
    apt: '',
    city: '',
    state: '',
    zip: ''
  }
}

const state = reactive({
  name: '',
  phone: '',
  email: '',
  moveDate: '',
  pickup: emptyAddress(),
  dropoff: emptyAddress(),
  additionalStops: [] as Address[],
  largeItems: [] as string[],
  approxBoxCount: undefined as number | undefined,
  over250lbsDetails: '',
  notes: ''
})

function onMoveDateClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) {
    return
  }

  // Chromium-only: opens the native picker programmatically.
  const anyTarget = target as HTMLInputElement & { showPicker?: () => void }
  anyTarget.showPicker?.()
}

function normalizePhone(input: string) {
  const digitsOnly = input.replace(/\D/g, '')
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return digitsOnly.slice(1)
  }

  return digitsOnly
}

function isValidPhone(input: string) {
  return normalizePhone(input).length === 10
}

function isValidEmail(input: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim())
}

const stopDraft = reactive(emptyAddress())
const largeItemDraft = ref('')
const showStopDraft = ref(false)

const canAddStop = computed(() => {
  return Boolean(stopDraft.street.trim())
    && Boolean(stopDraft.city.trim())
    && usStateValueSet.has(stopDraft.state)
    && Boolean(stopDraft.zip.trim())
})

function addStopFromDraft() {
  if (!canAddStop.value) {
    return
  }

  state.additionalStops.push({
    street: stopDraft.street.trim(),
    apt: stopDraft.apt.trim(),
    city: stopDraft.city.trim(),
    state: stopDraft.state,
    zip: stopDraft.zip.trim()
  })

  Object.assign(stopDraft, emptyAddress())
  showStopDraft.value = false
}

function openStopDraft() {
  showStopDraft.value = true
}

function cancelStopDraft() {
  Object.assign(stopDraft, emptyAddress())
  showStopDraft.value = false
}

function removeStop(index: number) {
  state.additionalStops.splice(index, 1)
}

function addLargeItemFromDraft() {
  const next = largeItemDraft.value.trim()
  if (!next) {
    return
  }

  state.largeItems.push(next)
  largeItemDraft.value = ''
}

function removeLargeItem(index: number) {
  state.largeItems.splice(index, 1)
}

function formatAddressSummary(address: Address) {
  const streetLine = address.apt?.trim() ? `${address.street}, ${address.apt}` : address.street
  const cityLine = `${address.city}, ${address.state} ${address.zip}`
  return [streetLine, cityLine]
}

function validate(formState: typeof state) {
  const errors: FormError[] = []

  if (!formState.name.trim()) {
    errors.push({ name: 'name', message: 'Name is required' })
  }

  if (!isValidPhone(formState.phone)) {
    errors.push({ name: 'phone', message: 'Enter a valid phone number' })
  }

  if (!isValidEmail(formState.email)) {
    errors.push({ name: 'email', message: 'Enter a valid email' })
  }

  if (!formState.moveDate.trim()) {
    errors.push({ name: 'moveDate', message: 'Move date is required' })
  }

  const validateState = (path: string, value: string) => {
    if (!usStateValueSet.has(value)) {
      errors.push({ name: path, message: 'Select a state' })
    }
  }

  const isValidZip = (value: string) => {
    const zip = value.trim()
    // Accept 5-digit or ZIP+4.
    return /^\d{5}(-\d{4})?$/.test(zip)
  }

  const validateZip = (path: string, value: string) => {
    if (!value.trim()) {
      errors.push({ name: path, message: 'ZIP is required' })
      return
    }

    if (!isValidZip(value)) {
      errors.push({ name: path, message: 'Enter a valid ZIP' })
    }
  }

  validateState('pickup.state', formState.pickup.state)
  validateState('dropoff.state', formState.dropoff.state)

  validateZip('pickup.zip', formState.pickup.zip)
  validateZip('dropoff.zip', formState.dropoff.zip)

  for (let index = 0; index < formState.additionalStops.length; index++) {
    validateState(`additionalStops.${index}.state`, formState.additionalStops[index]?.state ?? '')
  }

  return errors
}

function onFormError() {
  submitValidationError.value = 'Please fill in all required fields above.'
}

async function onSubmit() {
  submitValidationError.value = null
  submitError.value = null
  submitSuccess.value = false

  if (hasRecentSubmission.value) {
    submitError.value = duplicateSubmitMessage
    return
  }

  if (isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    if (formStartedAt.value == null) {
      formStartedAt.value = Date.now()
    }

    if (!token.value) {
      submitError.value = 'Please complete the Turnstile challenge.'
      return
    }

    const verification = await $fetch<{ success: boolean, errorCodes?: string[] }>('/api/turnstile-verify', {
      method: 'POST',
      body: { token: token.value }
    })

    if (!verification?.success) {
      submitError.value = verification?.errorCodes?.length
        ? `Turnstile verification failed: ${verification.errorCodes.join(', ')}`
        : 'Turnstile verification failed. Please try again.'
      return
    }

    const addressFrom = formatAddressSummary(state.pickup).join(', ')
    const addressTo = formatAddressSummary(state.dropoff).join(', ')

    const notes = [
      `Name: ${state.name}`,
      `Phone: ${state.phone}`,
      `Email: ${state.email}`,
      `Move date: ${state.moveDate || 'N/A'}`,
      `Additional stops: ${state.additionalStops.length
        ? state.additionalStops.map((s) => formatAddressSummary(s).join(', ')).join(' | ')
        : 'None'}`,
      `Large items: ${state.largeItems.length ? state.largeItems.join(', ') : 'None'}`,
      `Approx box count: ${state.approxBoxCount ?? 'N/A'}`,
      `Over 250 lbs details: ${state.over250lbsDetails || 'N/A'}`,
      `Notes: ${state.notes || 'N/A'}`
    ].join('\n')

    const emailResponse = await $fetch<{ status: string, error?: string }>('/api/contact', {
      method: 'POST',
      body: {
        name: state.name,
        email: state.email,
        phone: state.phone,
        service: 'Moving',
        zipcode: state.pickup.zip,
        website: honeypotWebsite.value,
        startedAt: formStartedAt.value,
        message: [
          `Pickup: ${addressFrom}`,
          `Dropoff: ${addressTo}`,
          '',
          notes
        ].join('\n')
      }
    })

    if (emailResponse?.status !== 'sent') {
      submitError.value = emailResponse?.error || 'Could not send email. Please try again.'
      return
    }

    try {
      const { error } = await (supabase as any)
        .from('jobs')
        .insert({
          job_type: 'moving',
          address_from: addressFrom,
          address_to: addressTo,
          scheduled_date: state.moveDate || null,
          status: 'new',
          notes
        })

      if (error) {
        throw error
      }
    } catch (err) {
      // Non-fatal: the customer request already reached us via email.
      console.warn('Supabase job insert failed', describeError(err))
    }

    markMovingSubmission()
    submitSuccess.value = true

    state.name = ''
    state.phone = ''
    state.email = ''
    state.moveDate = ''
    state.pickup = emptyAddress()
    state.dropoff = emptyAddress()
    state.additionalStops = []
    state.largeItems = []
    state.approxBoxCount = undefined
    state.over250lbsDetails = ''
    state.notes = ''

    Object.assign(stopDraft, emptyAddress())
    largeItemDraft.value = ''
    showStopDraft.value = false

    token.value = undefined
    honeypotWebsite.value = ''
    formStartedAt.value = Date.now()
  } catch (err) {
    submitError.value = describeError(err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UCard class="mx-auto w-full max-w-2xl bg-primary/5 dark:bg-primary/10">
    <template #header>
      <div class="space-y-1">
        <!-- <p class="text-sm text-muted">Request moving help</p> -->
        <h2
          class="text-[clamp(1.35rem,2.8vw,1.9rem)] font-black leading-tight tracking-tight text-highlighted uppercase whitespace-normal wrap-break-word"
        >Tell us about your move</h2>
      </div>
    </template>

    <UAlert
      v-if="submitSuccess"
      color="success"
      variant="subtle"
      title="Request submitted"
      description="Thanks! Your moving request has been submitted. We'll reach out soon."
      icon="i-lucide-check"
    />

    <UForm
      v-else
      :state="state"
      :validate="validate"
      @submit="onSubmit"
      @error="onFormError"
    >
      <div
        aria-hidden="true"
        class="hidden"
      >
        <label for="mm-website">Website</label>
        <input
          id="mm-website"
          v-model="honeypotWebsite"
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
        >
      </div>
      <UAlert
        v-if="submitError"
        color="error"
        variant="subtle"
        class="mb-4"
        title="Could not submit request"
        :description="submitError"
        icon="i-lucide-alert-triangle"
      />

      <UAlert
        v-if="hasRecentSubmission && !submitSuccess"
        color="warning"
        variant="subtle"
        class="mb-4"
        title="Already submitted"
        :description="duplicateSubmitDescription"
        icon="i-lucide-info"
      />

      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2"
        :class="isSubmissionLocked ? 'pointer-events-none opacity-60' : ''"
      >
        <UFormField
          label="Name *"
          name="name"
          size="lg"
        >
          <UInput
            v-model="state.name"
            placeholder="Your name"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Phone *"
          name="phone"
          size="lg"
        >
          <UInput
            v-model="state.phone"
            placeholder="(555) 123-4567"
            class="w-full"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
          />
        </UFormField>

        <UFormField
          label="Email *"
          name="email"
          size="lg"
          class="sm:col-span-2"
        >
          <UInput
            v-model="state.email"
            placeholder="you@example.com"
            class="w-full"
            type="email"
            inputmode="email"
            autocomplete="email"
          />
        </UFormField>

        <UFormField
          label="Move date *"
          name="moveDate"
          size="lg"
          class="sm:col-span-2"
        >
          <UInput
            v-model="state.moveDate"
            type="date"
            :ui="{ base: 'mm-native-date-input' }"
            @click="onMoveDateClick"
            class="w-full"
          />
        </UFormField>

        <div class="sm:col-span-2">
          <USeparator />
        </div>

        <div class="sm:col-span-2">
          <p class="text-sm font-semibold text-highlighted">Pick up address</p>
        </div>

        <UFormField
          label="Street address"
          name="pickup.street"
          class="sm:col-span-2"
          size="lg"
        >
          <UInput
            v-model="state.pickup.street"
            class="w-full"
            placeholder="Street address"
          />
        </UFormField>

        <UFormField
          label="Apt / Unit"
          name="pickup.apt"
          size="lg"
        >
          <UInput
            v-model="state.pickup.apt"
            class="w-full"
            placeholder="Apt / Unit (optional)"
          />
        </UFormField>

        <UFormField
          label="City"
          name="pickup.city"
          size="lg"
        >
          <UInput
            v-model="state.pickup.city"
            class="w-full"
            placeholder="City"
          />
        </UFormField>

        <UFormField
          label="State *"
          name="pickup.state"
          size="lg"
        >
          <USelect
            v-model="state.pickup.state"
            :items="usStateOptions"
            placeholder="Select state"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField
          label="ZIP *"
          name="pickup.zip"
          size="lg"
        >
          <UInput
            v-model="state.pickup.zip"
            class="w-full"
            placeholder="ZIP"
            inputmode="numeric"
            autocomplete="postal-code"
          />
        </UFormField>

        <div class="sm:col-span-2">
          <USeparator />
        </div>

        <div class="sm:col-span-2">
          <p class="text-sm font-semibold text-highlighted">Drop off address</p>
        </div>

        <UFormField
          label="Street address"
          name="dropoff.street"
          class="sm:col-span-2"
          size="lg"
        >
          <UInput
            v-model="state.dropoff.street"
            class="w-full"
            placeholder="Street address"
          />
        </UFormField>

        <UFormField
          label="Apt / Unit"
          name="dropoff.apt"
          size="lg"
        >
          <UInput
            v-model="state.dropoff.apt"
            class="w-full"
            placeholder="Apt / Unit (optional)"
          />
        </UFormField>

        <UFormField
          label="City"
          name="dropoff.city"
          size="lg"
        >
          <UInput
            v-model="state.dropoff.city"
            class="w-full"
            placeholder="City"
          />
        </UFormField>

        <UFormField
          label="State *"
          name="dropoff.state"
          size="lg"
        >
          <USelect
            v-model="state.dropoff.state"
            :items="usStateOptions"
            placeholder="Select state"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField
          label="ZIP *"
          name="dropoff.zip"
          size="lg"
        >
          <UInput
            v-model="state.dropoff.zip"
            class="w-full"
            placeholder="ZIP"
            inputmode="numeric"
            autocomplete="postal-code"
          />
        </UFormField>

        <div class="sm:col-span-2">
          <div class="flex items-center justify-between gap-4">
            <p class="text-sm font-semibold text-highlighted">Additional stops</p>

            <UButton
              type="button"
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-lucide-plus"
              @click="openStopDraft"
            >Add stop</UButton>
          </div>
        </div>

        <div
          v-if="showStopDraft"
          class="sm:col-span-2 rounded-lg border border-default bg-elevated/30 p-4"
        >
          <div class="flex items-center justify-between gap-4">
            <p class="text-sm font-semibold text-highlighted">Add a stop</p>

            <UButton
              type="button"
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-lucide-x"
              @click="cancelStopDraft"
            >Cancel</UButton>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UFormField
              label="Street address"
              name="stopDraft.street"
              class="sm:col-span-2"
              size="lg"
            >
              <UInput
                v-model="stopDraft.street"
                class="w-full"
                placeholder="Street address"
              />
            </UFormField>

            <UFormField
              label="Apt / Unit"
              name="stopDraft.apt"
              size="lg"
            >
              <UInput
                v-model="stopDraft.apt"
                class="w-full"
                placeholder="Apt / Unit (optional)"
              />
            </UFormField>

            <UFormField
              label="City"
              name="stopDraft.city"
              size="lg"
            >
              <UInput
                v-model="stopDraft.city"
                class="w-full"
                placeholder="City"
              />
            </UFormField>

            <UFormField
              label="State"
              name="stopDraft.state"
              size="lg"
            >
              <USelect
                v-model="stopDraft.state"
                :items="usStateOptions"
                placeholder="Select state"
                class="w-full"
                size="lg"
              />
            </UFormField>

            <UFormField
              label="ZIP"
              name="stopDraft.zip"
              size="lg"
            >
              <UInput
                v-model="stopDraft.zip"
                class="w-full"
                placeholder="ZIP"
                inputmode="numeric"
                autocomplete="postal-code"
                @keydown.enter.prevent="addStopFromDraft"
              />
            </UFormField>

            <div class="sm:col-span-2 flex items-center justify-end gap-3">
              <UButton
                type="button"
                variant="ghost"
                color="neutral"
                size="lg"
                @click="cancelStopDraft"
              >Cancel</UButton>

              <UButton
                type="button"
                color="primary"
                variant="solid"
                size="lg"
                icon="i-lucide-plus"
                :disabled="!canAddStop"
                @click="addStopFromDraft"
              >Add stop</UButton>
            </div>
          </div>
        </div>

        <div
          v-if="state.additionalStops.length"
          class="sm:col-span-2 space-y-3"
        >
          <div
            v-for="(stop, index) in state.additionalStops"
            :key="index"
            class="flex items-start justify-between gap-4 rounded-lg border border-default bg-elevated/20 p-4"
          >
            <div class="min-w-0">
              <p class="text-sm font-semibold text-highlighted">Stop {{ index + 1 }}</p>
              <p class="mt-1 text-sm text-muted truncate">{{ formatAddressSummary(stop)[0] }}</p>
              <p class="text-sm text-muted truncate">{{ formatAddressSummary(stop)[1] }}</p>
            </div>

            <UButton
              type="button"
              variant="ghost"
              color="neutral"
              size="sm"
              icon="i-lucide-x"
              aria-label="Remove stop"
              @click="removeStop(index)"
            />
          </div>
        </div>

        <div class="sm:col-span-2">
          <USeparator />
        </div>

        <div class="sm:col-span-2">
          <div class="flex items-center justify-between gap-4">
            <p class="text-sm font-semibold text-highlighted">Large items</p>
          </div>
        </div>

        <div class="sm:col-span-2">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <UInput
              v-model="largeItemDraft"
              placeholder="Type an item and press Enter (e.g. sofa, refrigerator, treadmill)"
              class="w-full"
              size="lg"
              @keydown.enter.prevent="addLargeItemFromDraft"
            />

            <UButton
              type="button"
              color="primary"
              variant="solid"
              size="lg"
              icon="i-lucide-plus"
              :disabled="!largeItemDraft.trim()"
              class="sm:w-auto"
              @click="addLargeItemFromDraft"
            >Add</UButton>
          </div>

          <div
            v-if="state.largeItems.length"
            class="mt-4 space-y-2"
          >
            <div
              v-for="(item, index) in state.largeItems"
              :key="`${item}-${index}`"
              class="flex items-center justify-between gap-4 rounded-lg border border-default bg-elevated/20 px-4 py-3"
            >
              <p class="min-w-0 truncate text-sm text-highlighted">{{ item }}</p>

              <UButton
                type="button"
                variant="ghost"
                color="neutral"
                size="sm"
                icon="i-lucide-x"
                aria-label="Remove item"
                @click="removeLargeItem(index)"
              />
            </div>
          </div>
        </div>

        <div class="sm:col-span-2">
          <USeparator />
        </div>

        <UFormField
          label="Approx. box count"
          name="approxBoxCount"
          class="sm:col-span-2"
          size="lg"
        >
          <UInput
            v-model.number="state.approxBoxCount"
            type="number"
            min="0"
            placeholder="0"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Anything over 250 pounds?"
          name="over250lbsDetails"
          class="sm:col-span-2"
          size="lg"
        >
          <UTextarea
            v-model="state.over250lbsDetails"
            :rows="4"
            placeholder="List anything over 250 lbs (e.g. safe, piano, commercial equipment)"
            class="w-full"
          />
        </UFormField>

        <div class="sm:col-span-2">
          <USeparator />
        </div>

        <UFormField
          label="Notes"
          name="notes"
          class="sm:col-span-2"
          size="lg"
        >
          <UTextarea
            v-model="state.notes"
            :rows="4"
            placeholder="Anything else we should know? (stairs, parking, timing, access codes, fragile items, etc.)"
            class="w-full"
          />
        </UFormField>
      </div>
      <NuxtTurnstile
        v-model="token"
        :options="turnstileOptions"
        class="pt-6"
      />
      <UAlert
        v-if="submitValidationError"
        color="warning"
        variant="subtle"
        class="mt-4"
        :description="submitValidationError"
        title="Check required fields"
        icon="i-lucide-info"
      />
      <div class="mt-8 flex items-center justify-center">
        <UButton
          type="submit"
          color="primary"
          size="xl"
          :loading="isSubmitting"
          :disabled="isSubmitting || isSubmissionLocked"
          class="w-full sm:w-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >Request a quote</UButton>
      </div>
    </UForm>
  </UCard>
</template>

<style>
/*
  Nuxt UI/Tailwind form styles can apply `appearance: none`, which hides the
  native calendar indicator in Chromium for <input type="date">.
  This is intentionally scoped to this component.
*/
.mm-native-date-input {
  -webkit-appearance: auto;
  appearance: auto;
}

.mm-native-date-input::-webkit-calendar-picker-indicator {
  opacity: 1;
  cursor: pointer;
}
</style>
