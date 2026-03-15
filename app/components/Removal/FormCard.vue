<script
  setup
  lang="ts"
>
import { watch } from 'vue'

const token = ref()

type FormError = { name: string, message: string }

type Address = {
  street: string
  apt: string
  city: string
  state: string
  zip: string
}

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
  serviceAddress: emptyAddress(),
  serviceDate: '',
  notes: '',
  photos: null as File[] | null,
  photoDescriptions: {} as Record<string, string>
})

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

function getFileKey(file: File) {
  return `${file.name}::${file.size}::${file.lastModified}`
}

watch(
  () => state.photos,
  (files) => {
    const next = files ?? []
    const allowedKeys = new Set(next.map(getFileKey))

    for (const key of Object.keys(state.photoDescriptions)) {
      if (!allowedKeys.has(key)) {
        delete state.photoDescriptions[key]
      }
    }
  }
)

function onSubmit() {
  // Placeholder: wire up to email/CRM later.
  // eslint-disable-next-line no-console
  console.log('Junk removal form submit', { ...state })
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

  if (!usStateValueSet.has(formState.serviceAddress.state)) {
    errors.push({ name: 'serviceAddress.state', message: 'Select a state' })
  }

  return errors
}
</script>

<template>
  <UCard class="mx-auto w-full max-w-2xl bg-primary/5 dark:bg-primary/10">
    <template #header>
      <div class="space-y-1">
        <p class="text-sm text-muted">Request removal / clean out</p>
        <h2
          class="text-[clamp(1.35rem,2.8vw,1.9rem)] font-black leading-tight tracking-tight text-highlighted uppercase whitespace-nowrap truncate"
        >Tell us what you need removed</h2>
      </div>
    </template>

    <UForm
      :state="state"
      :validate="validate"
      @submit="onSubmit"
    >
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <UFormField
          label="Name"
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
          label="Phone"
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
          label="Email"
          name="email"
          size="lg"
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
          label="Service date"
          name="serviceDate"
          size="lg"
        >
          <UInput
            v-model="state.serviceDate"
            type="date"
            class="w-full"
          />
        </UFormField>

        <div class="sm:col-span-2">
          <USeparator />
        </div>

        <div class="sm:col-span-2">
          <p class="text-sm font-semibold text-highlighted">Service address</p>
        </div>

        <UFormField
          label="Street address"
          name="serviceAddress.street"
          class="sm:col-span-2"
          size="lg"
        >
          <UInput
            v-model="state.serviceAddress.street"
            placeholder="Street address"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Apt / Unit"
          name="serviceAddress.apt"
          size="lg"
        >
          <UInput
            v-model="state.serviceAddress.apt"
            placeholder="Apt / Unit (optional)"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="City"
          name="serviceAddress.city"
          size="lg"
        >
          <UInput
            v-model="state.serviceAddress.city"
            placeholder="City"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="State"
          name="serviceAddress.state"
          size="lg"
        >
          <USelect
            v-model="state.serviceAddress.state"
            :items="usStateOptions"
            placeholder="Select state"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField
          label="ZIP"
          name="serviceAddress.zip"
          size="lg"
        >
          <UInput
            v-model="state.serviceAddress.zip"
            placeholder="ZIP"
            class="w-full"
            inputmode="numeric"
            autocomplete="postal-code"
          />
        </UFormField>

        <div class="sm:col-span-2">
          <USeparator />
        </div>

        <UFormField
          label="Upload photos of what needs removed"
          name="photos"
          class="sm:col-span-2"
          size="lg"
        >
          <UFileUpload
            v-model="state.photos"
            multiple
            accept="image/*"
            variant="area"
            size="lg"
            layout="list"
            label="Add photos"
            description="Photos help us price accurately. Add one photo per item if possible."
            class="w-full min-h-48"
          />
        </UFormField>

        <div
          v-if="state.photos?.length"
          class="sm:col-span-2 space-y-4"
        >
          <div
            v-for="file in state.photos"
            :key="getFileKey(file)"
            class="rounded-lg border border-default bg-elevated/40 p-4"
          >
            <p class="text-sm font-semibold text-highlighted truncate">{{ file.name }}</p>
            <p class="mt-1 text-xs text-muted">Optional description</p>

            <UInput
              v-model="state.photoDescriptions[getFileKey(file)]"
              class="mt-2"
              placeholder="e.g. Couch in basement, old fridge in garage"
              size="lg"
            />
          </div>
        </div>

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
            placeholder="Anything else we should know? (location, stairs, accessibility, preferred time, special instructions)"
            class="w-full"
          />
        </UFormField>
      </div>
      <NuxtTurnstile
        v-model="token"
        class="pt-6"
      />
      <div class="mt-8 flex items-center justify-center">
        <UButton
          type="submit"
          color="primary"
          size="xl"
          class="w-full sm:w-auto"
        >Request a quote</UButton>
      </div>
    </UForm>
  </UCard>
</template>
