<script
  setup
  lang="ts"
>
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const errorMessage = ref<string | null>(null)
const isSigningOut = ref(false)

type JobRow = {
  id: string
  job_type: string | null
  address_from: string | null
  address_to: string | null
  scheduled_date: string | null
  status: string | null
  notes: string | null
  created_at: string
}

const jobsErrorMessage = ref<string | null>(null)
const jobsTotalCount = ref<number | null>(null)
const jobsLastRunAt = ref<string | null>(null)

const debugSessionUserId = ref<string | null>(null)
const debugGetUserId = ref<string | null>(null)
const debugUserRefId = ref<string | null>(null)

const debugEffectiveAuthUserId = ref<string | null>(null)
const debugUserRefKeys = ref<string | null>(null)
const debugUserRefJson = ref<string | null>(null)
const debugHeadCountError = ref<string | null>(null)

const {
  data: jobs,
  pending: jobsPending,
  refresh: refreshJobs
} = useAsyncData<JobRow[]>('jobs-for-user', async () => {
  jobsErrorMessage.value = null
  jobsTotalCount.value = null
  jobsLastRunAt.value = new Date().toISOString()
  debugHeadCountError.value = null

  // Debugging: confirm session/user IDs match what RLS expects.
  // Only logs in dev to avoid noisy production consoles.
  let sessionUserId: string | null = null
  let getUserId: string | null = null
  let userRefId: string | null = null

  if (import.meta.dev) {
    const sessionRes = await supabase.auth.getSession()
    console.log('DEBUG session', sessionRes.data.session?.user?.id)
    sessionUserId = sessionRes.data.session?.user?.id ?? null
    debugSessionUserId.value = sessionUserId

    const who = await supabase.auth.getUser()
    console.log('DEBUG auth user', who.data.user?.id)
    getUserId = who.data.user?.id ?? null
    debugGetUserId.value = getUserId

    console.log('DEBUG customer_id intended', user.value?.id)
    userRefId = (user.value as any)?.id ?? null
    debugUserRefId.value = userRefId

    debugUserRefKeys.value = user.value ? Object.keys(user.value as any).sort().join(', ') : null
    try {
      debugUserRefJson.value = user.value ? JSON.stringify(user.value) : null
    } catch {
      debugUserRefJson.value = '[unserializable]'
    }
  }

  const effectiveAuthUserId = user.value?.id ?? getUserId ?? sessionUserId ?? null
  debugEffectiveAuthUserId.value = effectiveAuthUserId

  // If we can't prove the user is authenticated yet, don't query.
  if (!effectiveAuthUserId) {
    return []
  }

  const { data, error, count } = await supabase
    .from('jobs')
    .select('id, job_type, address_from, address_to, scheduled_date, status, notes, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (error) {
    jobsErrorMessage.value = [
      error.message,
      typeof (error as any).code === 'string' ? `code: ${(error as any).code}` : null,
      typeof (error as any).status === 'number' ? `status: ${(error as any).status}` : null
    ].filter(Boolean).join(' • ')
    return []
  }

  jobsTotalCount.value = typeof count === 'number' ? count : null

  // Some PostgREST/Supabase configurations may not return a parsed `count` on data queries.
  // Fallback to a count-only HEAD request so the UI can still show whether any rows are visible under RLS.
  if (jobsTotalCount.value === null) {
    const { count: headCount, error: headError } = await supabase
      .from('jobs')
      .select('id', { count: 'exact', head: true })

    if (headError) {
      debugHeadCountError.value = headError.message
    }

    if (!headError && typeof headCount === 'number') {
      jobsTotalCount.value = headCount
    }
  }

  return (data ?? []) as JobRow[]
}, {
  watch: [user],
  server: false,
  default: () => []
})

const jobsCount = computed(() => jobs.value?.length ?? 0)

function normalizeStatus(status: string | null) {
  return (status ?? '').trim().toLowerCase()
}

function statusBadgeClass(status: string | null) {
  const normalized = normalizeStatus(status)

  if (normalized === 'new') {
    return 'bg-success/15 text-success ring-success/30'
  }

  if (normalized === 'in_progress' || normalized === 'in progress') {
    return 'bg-warning/15 text-warning ring-warning/30'
  }

  if (normalized === 'completed' || normalized === 'done') {
    return 'bg-info/15 text-info ring-info/30'
  }

  if (normalized === 'cancelled' || normalized === 'canceled') {
    return 'bg-error/15 text-error ring-error/30'
  }

  return 'bg-neutral/15 text-muted ring-default'
}

function statusLabel(status: string | null) {
  if (!status) return 'Unknown'
  return status.replace(/_/g, ' ')
}

function formatDate(value: string | null) {
  if (!value) return '—'
  const dt = new Date(value)
  return Number.isNaN(dt.getTime()) ? value : dt.toLocaleString()
}

async function signOut() {
  errorMessage.value = null
  isSigningOut.value = true

  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      errorMessage.value = error.message
      return
    }

    await navigateTo('/')
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : String(err)
  } finally {
    isSigningOut.value = false
  }
}
</script>

<template>
  <UContainer class="py-12">
    <div class="mx-auto max-w-4xl space-y-4 ">
      <div class="flex flex-col gap-2 items-start border-b border-default pb-4">
        <h1 class="text-2xl font-semibold text-highlighted">
          MANN MUSCLES LLC COMMAND CENTER
        </h1>

        <div
          v-if="user"
          class="inline-flex items-center gap-2 rounded-lg bg-success/10 px-3 py-1.5 text-sm text-success"
        >
          <span class="font-semibold">Authenticated</span>
          <span class="text-success/80">•</span>
          <span>{{ user.email ? `Signed in as ${user.email}` : 'Signed in.' }}</span>
        </div>
      </div>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="subtle"
        title="Error"
        :description="errorMessage"
        icon="i-lucide-alert-triangle"
      />

      <UAlert
        v-if="!user"
        color="warning"
        variant="subtle"
        title="Not signed in"
        description="If you can see this, your guard redirect is disabled or misconfigured."
        icon="i-lucide-shield-alert"
      />

      <section
        v-if="user"
        class="space-y-4"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1">
            <h2 class="text-lg font-semibold text-highlighted">Job List</h2>
            <!-- <p class="text-sm text-muted">
              Showing {{ jobsCount }} job{{ jobsCount === 1 ? '' : 's' }} you have access to.
            </p> -->
          </div>

          <UButton
            class="cursor-pointer"
            color="neutral"
            variant="outline"
            :loading="jobsPending"
            @click="() => refreshJobs()"
          >
            Refresh
          </UButton>
        </div>

        <UAlert
          v-if="jobsErrorMessage"
          color="error"
          variant="subtle"
          title="Could not load jobs"
          :description="jobsErrorMessage"
          icon="i-lucide-alert-triangle"
        />

        <div
          v-else-if="jobsPending"
          class="text-sm text-muted"
        >
          Loading jobs…
        </div>

        <div
          v-else-if="!jobs || jobs.length === 0"
          class="text-sm text-muted"
        >
          No jobs returned. If you expect jobs to appear here, it’s usually an RLS/policy issue (your logged-in user
          doesn’t
          have SELECT access).
        </div>

        <div
          v-else
          class="space-y-3"
        >
          <UCard
            v-for="job in jobs"
            :key="job.id"
            variant="subtle"
          >
            <template #header>
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-3">
                  <div class="text-base sm:text-lg font-bold text-highlighted">
                    {{ job.job_type || 'Job' }}
                  </div>

                  <span
                    class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset"
                    :class="statusBadgeClass(job.status)"
                  >
                    {{ statusLabel(job.status) }}
                  </span>
                </div>

                <div class="text-xs text-muted">
                  Created: {{ formatDate(job.created_at) }}
                </div>
              </div>
            </template>

            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div>
                <dt class="text-muted">Scheduled</dt>
                <dd class="text-highlighted">{{ formatDate(job.scheduled_date) }}</dd>
              </div>

              <div>
                <dt class="text-muted">From</dt>
                <dd class="text-highlighted">{{ job.address_from || '—' }}</dd>
              </div>

              <div>
                <dt class="text-muted">To</dt>
                <dd class="text-highlighted">{{ job.address_to || '—' }}</dd>
              </div>

              <div class="sm:col-span-2">
                <dt class="text-muted">Notes</dt>
                <dd class="text-highlighted whitespace-pre-wrap">{{ job.notes || '—' }}</dd>
              </div>
            </dl>

            <template #footer>
              <div class="text-xs text-muted">
                ID: {{ job.id }}
              </div>
            </template>
          </UCard>
        </div>

        <div class="mt-4 text-xs text-muted hidden">
          <div>Last run: {{ jobsLastRunAt ? formatDate(jobsLastRunAt) : '—' }}</div>
          <div>Total (count header): {{ typeof jobsTotalCount === 'number' ? jobsTotalCount : '—' }}</div>
          <div>DEBUG session user id: {{ debugSessionUserId || '—' }}</div>
          <div>DEBUG getUser() id: {{ debugGetUserId || '—' }}</div>
          <div>DEBUG user ref id: {{ debugUserRefId || '—' }}</div>
          <div>DEBUG effective auth id: {{ debugEffectiveAuthUserId || '—' }}</div>
          <div>DEBUG head count error: {{ debugHeadCountError || '—' }}</div>
          <div class="wrap-break-word">DEBUG user keys: {{ debugUserRefKeys || '—' }}</div>
          <div class="wrap-break-word">DEBUG user json: {{ debugUserRefJson || '—' }}</div>
        </div>
      </section>

      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <UButton
          to="/command/test"
          color="primary"
          variant="solid"
        >
          Go to /command/test
        </UButton>

        <UButton
          v-if="user"
          color="neutral"
          variant="outline"
          :loading="isSigningOut"
          @click="signOut"
        >
          Sign out
        </UButton>

        <UButton
          v-else
          to="/login"
          color="neutral"
          variant="outline"
        >
          Go to /login
        </UButton>
      </div>
    </div>
  </UContainer>
</template>
