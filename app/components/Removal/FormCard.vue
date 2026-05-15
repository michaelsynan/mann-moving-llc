<script
  setup
  lang="ts"
>
import { onBeforeUnmount, onMounted, watch } from 'vue'

const token = ref()
const turnstileKey = ref(0)
const supabase = useSupabaseClient()
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const submitSuccess = ref(false)

const submitValidationError = ref<string | null>(null)

const honeypotWebsite = ref('')
const formStartedAt = ref<number | null>(null)

const DUPLICATE_SUBMIT_TTL_SECONDS = 60 * 60 * 24 * 14
const DUPLICATE_STORAGE_KEY = 'mm-removal-submit-at'
const duplicateSubmitMessage = "It looks like you've already submitted some information. Please contact us to discuss"

const removalSubmittedAt = useCookie<string | undefined>(DUPLICATE_STORAGE_KEY, {
  maxAge: DUPLICATE_SUBMIT_TTL_SECONDS,
  sameSite: 'lax'
})

const hasRecentSubmission = computed(() => Boolean(removalSubmittedAt.value))

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

function markRemovalSubmission() {
  const timestamp = new Date().toISOString()
  removalSubmittedAt.value = timestamp

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
  if (localMarker && !removalSubmittedAt.value) {
    removalSubmittedAt.value = localMarker
  }
})
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

type FormError = { name: string, message: string }

type Address = {
  street: string
  apt: string
  city: string
  state: string
  zip: string
}

function describeError(err: unknown): string {
  if (err instanceof Error) {
    const anyErr = err as any
    const data = anyErr?.data
    if (data && typeof data === 'object') {
      const message = (data as { error?: unknown; message?: unknown }).error
        ?? (data as { error?: unknown; message?: unknown }).message
      const errorCodes = (data as { errorCodes?: unknown })?.errorCodes
      const codes = Array.isArray(errorCodes) ? errorCodes.filter((c): c is string => typeof c === 'string' && c.trim().length > 0) : []

      if (typeof message === 'string' && message.trim()) {
        return codes.length ? `${message} (codes: ${codes.join(', ')})` : message
      }
    }
    return err.message
  }

  if (typeof err === 'string') {
    return err
  }

  if (err && typeof err === 'object') {
    const anyErr = err as any
    const data = anyErr?.data
    if (data && typeof data === 'object') {
      const message = (data as { error?: unknown; message?: unknown }).error
        ?? (data as { error?: unknown; message?: unknown }).message
      const errorCodes = (data as { errorCodes?: unknown })?.errorCodes
      const codes = Array.isArray(errorCodes) ? errorCodes.filter((c): c is string => typeof c === 'string' && c.trim().length > 0) : []

      if (typeof message === 'string' && message.trim()) {
        return codes.length ? `${message} (codes: ${codes.join(', ')})` : message
      }
    }

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

function getErrorData(err: unknown): Record<string, unknown> | null {
  if (!err || typeof err !== 'object') {
    return null
  }

  const anyErr = err as any
  const data = anyErr?.data
  if (data && typeof data === 'object') {
    return data as Record<string, unknown>
  }

  return null
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

const usStateValueSet = new Set(usStateOptions.map(o => o.value))

function emptyAddress(): Address {
  return {
    street: '',
    apt: '',
    city: '',
    state: '',
    zip: ''
  }
}

function formatAddressSummary(address: Address): string[] {
  const street = address.street.trim()
  const apt = address.apt.trim()
  const city = address.city.trim()
  const stateValue = address.state.trim()
  const zip = address.zip.trim()

  const line2Parts = [city, stateValue].filter(Boolean).join(', ')
  const line2 = [line2Parts, zip].filter(Boolean).join(' ')

  return [street, apt, line2].filter(Boolean)
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

const PHOTO_RESIZE_DEBUG = true
const PHOTO_MAX_DIMENSION = 1000
const PHOTO_OUTPUT_MIME = 'image/jpeg'
const PHOTO_OUTPUT_QUALITY = 0.82
const PHOTO_REENCODE_MIN_BYTES = 700_000

// Keep resized files separate from `state.photos`.
// Mutating the `UFileUpload` v-model can cause feedback loops/glitching.
const resizeResultsByKey = ref<Record<string, ResizeResult>>({})
const photosProcessRunId = ref(0)

const previewUrlByKey = ref<Record<string, string>>({})

type ResizeResult = {
  file: File
  action: 'kept' | 'resized' | 'reencoded'
  srcWidth: number
  srcHeight: number
  dstWidth: number
  dstHeight: number
  processedBy: 'worker' | 'main'
}

type WorkerResizeAction = ResizeResult['action']

type WorkerResizeRequest = {
  id: string
  name: string
  type: string
  lastModified: number
  buffer: ArrayBuffer
  opts: {
    maxDimension: number
    mimeType: string
    quality: number
    reencodeMinBytes: number
  }
}

type WorkerResizeResponse =
  | {
    id: string
    ok: true
    result: {
      action: WorkerResizeAction
      srcWidth: number
      srcHeight: number
      dstWidth: number
      dstHeight: number
      outName: string
      outType: string
      outBuffer: ArrayBuffer
    }
  }
  | {
    id: string
    ok: false
    error: string
  }

const resizeWorker = ref<Worker | null>(null)
const resizeWorkerDisabled = ref(false)
const resizeWorkerNextId = ref(1)
const resizeWorkerPending = new Map<string, {
  resolve: (value: WorkerResizeResponse) => void
  reject: (reason?: unknown) => void
}>()

onBeforeUnmount(() => {
  const worker = resizeWorker.value
  if (worker) {
    try {
      worker.terminate()
    } catch {
      // ignore
    }
  }
  resizeWorker.value = null

  for (const url of Object.values(previewUrlByKey.value)) {
    try {
      URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }
  previewUrlByKey.value = {}

  for (const [, pending] of resizeWorkerPending) {
    pending.reject(new Error('Resize worker terminated'))
  }
  resizeWorkerPending.clear()
})

function getResizeWorker(): Worker | null {
  if (resizeWorkerDisabled.value) {
    return null
  }

  if (import.meta.server) {
    return null
  }

  if (resizeWorker.value) {
    return resizeWorker.value
  }

  if (typeof Worker === 'undefined') {
    return null
  }

  try {
    const worker = new Worker(new URL('../../workers/imageResize.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (event: MessageEvent<WorkerResizeResponse>) => {
      const data = event.data
      const pending = resizeWorkerPending.get(data.id)
      if (!pending) return
      resizeWorkerPending.delete(data.id)
      pending.resolve(data)
    }
    worker.onerror = (event) => {
      if (PHOTO_RESIZE_DEBUG) {
        console.warn('[Removal/FormCard] Resize worker error; disabling worker', event)
      }
      resizeWorkerDisabled.value = true
      try {
        worker.terminate()
      } catch {
        // ignore
      }
      resizeWorker.value = null

      for (const [, pending] of resizeWorkerPending) {
        pending.reject(new Error('Resize worker failed'))
      }
      resizeWorkerPending.clear()
    }

    resizeWorker.value = worker
    return worker
  } catch (error) {
    if (PHOTO_RESIZE_DEBUG) {
      console.warn('[Removal/FormCard] Failed to create resize worker; falling back to main thread', error)
    }
    resizeWorkerDisabled.value = true
    return null
  }
}

async function resizeImageFileInWorker(
  file: File,
  opts: { maxDimension: number, mimeType: string, quality: number, reencodeMinBytes: number }
): Promise<ResizeResult> {
  const worker = getResizeWorker()
  if (!worker) {
    throw new Error('Resize worker unavailable')
  }

  const id = String(resizeWorkerNextId.value++)
  const buffer = await file.arrayBuffer()
  const request: WorkerResizeRequest = {
    id,
    name: file.name,
    type: file.type,
    lastModified: file.lastModified,
    buffer,
    opts
  }

  const response = await new Promise<WorkerResizeResponse>((resolve, reject) => {
    resizeWorkerPending.set(id, { resolve, reject })
    try {
      worker.postMessage(request, [buffer])
    } catch (error) {
      resizeWorkerPending.delete(id)
      reject(error)
    }
  })

  if (!response.ok) {
    throw new Error(response.error)
  }

  const outBlob = new Blob([response.result.outBuffer], { type: response.result.outType })
  return {
    file: new File([outBlob], response.result.outName, { type: outBlob.type, lastModified: file.lastModified }),
    action: response.result.action,
    srcWidth: response.result.srcWidth,
    srcHeight: response.result.srcHeight,
    dstWidth: response.result.dstWidth,
    dstHeight: response.result.dstHeight,
    processedBy: 'worker'
  }
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB'] as const
  const index = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const value = bytes / (1024 ** index)
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
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

function getFileKey(file: File) {
  return `${file.name}::${file.size}::${file.lastModified}`
}

function syncPreviewUrls(files: File[] | null | undefined) {
  if (import.meta.server) {
    return
  }

  const nextFiles = files ?? []
  const nextKeys = new Set(nextFiles.map(getFileKey))

  for (const [key, url] of Object.entries(previewUrlByKey.value)) {
    if (!nextKeys.has(key)) {
      try {
        URL.revokeObjectURL(url)
      } catch {
        // ignore
      }
    }
  }

  const nextUrls: Record<string, string> = {}
  for (const file of nextFiles) {
    const key = getFileKey(file)
    nextUrls[key] = previewUrlByKey.value[key] ?? URL.createObjectURL(file)
  }

  previewUrlByKey.value = nextUrls
}

function getPreviewUrl(file: File) {
  return previewUrlByKey.value[getFileKey(file)]
}

function yieldToBrowser() {
  // Let the UI paint/respond between heavy operations.
  return new Promise<void>(resolve => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }

    if (typeof w.requestIdleCallback === 'function') {
      w.requestIdleCallback(() => resolve(), { timeout: 250 })
      return
    }

    requestAnimationFrame(() => resolve())
  })
}

async function resizeImageFileMainThread(
  file: File,
  opts: { maxDimension: number, mimeType: string, quality: number, reencodeMinBytes: number }
): Promise<ResizeResult> {
  if (!file.type.startsWith('image/')) {
    return {
      file,
      action: 'kept' as const,
      srcWidth: 0,
      srcHeight: 0,
      dstWidth: 0,
      dstHeight: 0,
      processedBy: 'main'
    }
  }

  // All of this is browser-only; safe here because we only call it
  // after user selection on the client.
  let bitmap: ImageBitmap | null = null
  try {
    try {
      // Some browsers respect EXIF orientation with this option.
      bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      bitmap = await createImageBitmap(file)
    }

    const srcW = bitmap.width
    const srcH = bitmap.height
    const maxSide = Math.max(srcW, srcH)
    const scale = Math.min(1, opts.maxDimension / maxSide)

    const didResize = scale !== 1
    const shouldReencode = !didResize
      && file.type !== opts.mimeType
      && file.size >= opts.reencodeMinBytes

    // Skip work if neither resizing nor re-encoding is needed
    if (!didResize && !shouldReencode) {
      return {
        file,
        action: 'kept' as const,
        srcWidth: srcW,
        srcHeight: srcH,
        dstWidth: srcW,
        dstHeight: srcH,
        processedBy: 'main'
      }
    }

    const dstW = Math.max(1, Math.round(srcW * scale))
    const dstH = Math.max(1, Math.round(srcH * scale))

    const canvas: OffscreenCanvas | HTMLCanvasElement = typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(dstW, dstH)
      : document.createElement('canvas')

    if (canvas instanceof HTMLCanvasElement) {
      canvas.width = dstW
      canvas.height = dstH
    }

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null
    if (!ctx) {
      return {
        file,
        action: 'kept',
        srcWidth: srcW,
        srcHeight: srcH,
        dstWidth: srcW,
        dstHeight: srcH,
        processedBy: 'main'
      }
    }

    // Help reduce aliasing when downscaling.
    ; (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = true

    ctx.drawImage(bitmap, 0, 0, dstW, dstH)

    const blob: Blob = await new Promise((resolve, reject) => {
      const done = (b: Blob | null) => (b ? resolve(b) : reject(new Error('toBlob returned null')))

      if ('convertToBlob' in canvas) {
        canvas.convertToBlob({ type: opts.mimeType, quality: opts.quality }).then(resolve, reject)
        return
      }

      canvas.toBlob(done, opts.mimeType, opts.quality)
    })

    const baseName = file.name.replace(/\.[^.]+$/, '')
    const newName = opts.mimeType === 'image/jpeg' ? `${baseName}.jpg` : file.name

    return {
      file: new File([blob], newName, { type: blob.type, lastModified: file.lastModified }),
      action: (didResize ? 'resized' : 'reencoded') as 'resized' | 'reencoded',
      srcWidth: srcW,
      srcHeight: srcH,
      dstWidth: dstW,
      dstHeight: dstH,
      processedBy: 'main'
    }
  } finally {
    try {
      bitmap?.close()
    } catch {
      // ignore
    }
  }
}

async function resizeImageFile(
  file: File,
  opts: { maxDimension: number, mimeType: string, quality: number, reencodeMinBytes: number }
): Promise<ResizeResult> {
  // Worker-first to keep the UI responsive; fallback to main thread for browsers
  // that don't support OffscreenCanvas/createImageBitmap in workers (notably some Safari/iOS versions).
  try {
    if (!import.meta.server && file.type.startsWith('image/')) {
      return await resizeImageFileInWorker(file, opts)
    }
  } catch (error) {
    if (PHOTO_RESIZE_DEBUG) {
      console.warn('[Removal/FormCard] Worker resize failed; falling back to main thread', error)
    }
  }

  return await resizeImageFileMainThread(file, opts)
}

watch(
  () => state.photos,
  async (files) => {
    if (import.meta.server) {
      return
    }

    syncPreviewUrls(files)

    const runId = ++photosProcessRunId.value
    const next = files ?? []

    if (!next.length) {
      // No photos: ensure descriptions are also cleared
      state.photoDescriptions = {}
      resizeResultsByKey.value = {}
      return
    }

    // Rebuild descriptions to drop entries for removed files (no dynamic delete).
    const nextDescriptions: Record<string, string> = {}
    for (const file of next) {
      const key = getFileKey(file)
      const existing = state.photoDescriptions[key]
      if (existing) {
        nextDescriptions[key] = existing
      }
    }
    state.photoDescriptions = nextDescriptions

    const groupLabel = `[Removal/FormCard] Photo resize (${next.length})`
    const didOpenGroup = PHOTO_RESIZE_DEBUG
    if (PHOTO_RESIZE_DEBUG) {
      console.groupCollapsed(groupLabel)
      console.log('Incoming files:', next.map(f => ({ name: f.name, type: f.type, size: f.size })))
    }

    const nextResultsByKey: Record<string, ResizeResult> = {}

    try {
      // Process sequentially to avoid pegging the main thread.
      for (const file of next) {
        // Let the UI update between each file.
        await yieldToBrowser()

        // If the user changed the selection mid-run, abort this run.
        if (runId !== photosProcessRunId.value) {
          return
        }

        const originalKey = getFileKey(file)
        const cached = resizeResultsByKey.value[originalKey]
        if (cached) {
          if (PHOTO_RESIZE_DEBUG) {
            console.log(
              'Resize cache hit:',
              { name: file.name, size: file.size },
              '→',
              { name: cached.file.name, size: cached.file.size, action: cached.action, processedBy: cached.processedBy }
            )
          }
          nextResultsByKey[originalKey] = cached
          continue
        }

        // Skip tiny/non-image files; avoids wasting CPU on already-small images.
        if (!file.type.startsWith('image/') || file.size < 400_000) {
          if (PHOTO_RESIZE_DEBUG) {
            console.log('Skip resize:', { name: file.name, size: file.size, type: file.type })
          }
          nextResultsByKey[originalKey] = {
            file,
            action: 'kept',
            srcWidth: 0,
            srcHeight: 0,
            dstWidth: 0,
            dstHeight: 0,
            processedBy: 'main'
          }
          continue
        }

        const before = { name: file.name, size: file.size, type: file.type }

        try {
          const result = await resizeImageFile(file, {
            maxDimension: PHOTO_MAX_DIMENSION,
            mimeType: PHOTO_OUTPUT_MIME,
            quality: PHOTO_OUTPUT_QUALITY,
            reencodeMinBytes: PHOTO_REENCODE_MIN_BYTES
          })

          if (PHOTO_RESIZE_DEBUG) {
            console.log(
              result.action === 'kept' ? 'Kept:' : (result.action === 'reencoded' ? 'Re-encoded:' : 'Resized:'),
              {
                ...before,
                dims: result.srcWidth ? `${result.srcWidth}x${result.srcHeight}` : undefined
              },
              '→',
              {
                name: result.file.name,
                size: result.file.size,
                type: result.file.type,
                dims: result.dstWidth ? `${result.dstWidth}x${result.dstHeight}` : undefined
              }
            )
          }

          console.log(
            '[Removal/FormCard] Upload transform',
            `${file.name}: ${formatBytes(file.size)} → ${formatBytes(result.file.size)}`,
            `${result.action} (${result.processedBy})`
          )

          nextResultsByKey[originalKey] = result
        } catch (error) {
          if (PHOTO_RESIZE_DEBUG) {
            console.warn('Resize failed; keeping original:', before, error)
          }
          nextResultsByKey[originalKey] = {
            file,
            action: 'kept',
            srcWidth: 0,
            srcHeight: 0,
            dstWidth: 0,
            dstHeight: 0,
            processedBy: 'main'
          }
        }
      }

      if (runId !== photosProcessRunId.value) {
        return
      }

      resizeResultsByKey.value = nextResultsByKey

      if (PHOTO_RESIZE_DEBUG) {
        console.log(
          'Final resize results:',
          Object.entries(nextResultsByKey).map(([, r]) => ({ name: r.file.name, type: r.file.type, size: r.file.size, action: r.action, processedBy: r.processedBy }))
        )
      }
    } finally {
      if (didOpenGroup) {
        console.groupEnd()
      }
    }
  }
)

async function onSubmit() {
  submitValidationError.value = null
  submitError.value = null
  submitSuccess.value = false

  if (shouldBlockDuplicateSubmission.value) {
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

    const tokenValue = typeof token.value === 'string' ? token.value.trim() : ''
    if (!tokenValue) {
      submitError.value = 'Please complete the Turnstile challenge.'
      return
    }

    const addressFrom = formatAddressSummary(state.serviceAddress).join(', ')
    const selected = state.photos ?? []
    const uploadFiles = selected.map((f) => resizeResultsByKey.value[getFileKey(f)]?.file ?? f)
    const photosSummary = uploadFiles.length
      ? uploadFiles
        .map((file) => {
          const description = state.photoDescriptions[getFileKey(file)]?.trim()
          return `- ${file.name} (${formatBytes(file.size)})${description ? ` — ${description}` : ''}`
        })
        .join('\n')
      : 'None'

    const notes = [
      `Name: ${state.name}`,
      `Phone: ${state.phone}`,
      `Email: ${state.email}`,
      `Service date: ${state.serviceDate || 'N/A'}`,
      `Service address: ${addressFrom || 'N/A'}`,
      `Notes: ${state.notes || 'N/A'}`,
      '',
      'Photos:',
      photosSummary
    ].join('\n')

    const form = new FormData()
    form.set('token', tokenValue)
    form.set('website', honeypotWebsite.value)
    form.set('startedAt', String(formStartedAt.value))
    form.set('name', state.name)
    form.set('email', state.email)
    form.set('phone', state.phone)
    form.set('service', 'Junk Removal')
    form.set('zipcode', state.serviceAddress.zip)
    form.set('message', notes)
    for (const file of uploadFiles) {
      form.append('photos', file, file.name)
    }

    const emailResponse = await $fetch<{ status: string, error?: string, errorCodes?: string[] }>('/api/removal-request', {
      method: 'POST',
      body: form
    })

    if (emailResponse?.status !== 'sent') {
      submitError.value = emailResponse?.error || 'Could not send email. Please try again.'
      token.value = undefined
      turnstileKey.value += 1
      return
    }

    try {
      const { error } = await (supabase as any)
        .from('jobs')
        .insert({
          job_type: 'removal',
          address_from: addressFrom,
          address_to: null,
          scheduled_date: state.serviceDate || null,
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

    submitSuccess.value = true
    markRemovalSubmission()

    state.name = ''
    state.phone = ''
    state.email = ''
    state.serviceAddress = emptyAddress()
    state.serviceDate = ''
    state.notes = ''
    state.photos = null
    state.photoDescriptions = {}
    resizeResultsByKey.value = {}

    token.value = undefined
    turnstileKey.value += 1
    honeypotWebsite.value = ''
    formStartedAt.value = Date.now()
  } catch (err) {
    const data = getErrorData(err)
    if (import.meta.client && data) {
      console.warn('[removal-request] submit failed', data)
    }

    const message = typeof data?.error === 'string'
      ? data.error
      : (typeof data?.message === 'string' ? data.message : null)

    const errorCodes = Array.isArray((data as any)?.errorCodes)
      ? (data as any).errorCodes.filter((c: unknown): c is string => typeof c === 'string' && c.trim().length > 0)
      : []

    const isTurnstileFailure = message?.toLowerCase().includes('turnstile')
      || errorCodes.length > 0

    if (isTurnstileFailure) {
      // Token is likely expired/duplicate; force user to re-run the challenge.
      token.value = undefined
      turnstileKey.value += 1
    }

    submitError.value = describeError(err)
  } finally {
    isSubmitting.value = false
  }
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

function onFormError() {
  submitValidationError.value = 'Please fill in all required fields above.'
}

function onServiceDateClick(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) {
    return
  }

  // Chromium-only: opens the native picker programmatically.
  // This makes clicking into the field behave like clicking the calendar icon.
  const anyTarget = target as HTMLInputElement & { showPicker?: () => void }
  anyTarget.showPicker?.()
}
</script>

<template>
  <UCard class="mx-auto w-full max-w-2xl bg-primary/5 dark:bg-primary/10">
    <template #header>
      <div class="space-y-1">
        <!-- <p class="text-sm text-muted">
          Request removal / clean out
        </p> -->
        <h2
          class="text-[clamp(1.35rem,2.8vw,1.9rem)] font-black leading-tight tracking-tight text-highlighted uppercase whitespace-normal wrap-break-word"
        >
          Tell us what you need removed
        </h2>
      </div>
    </template>

    <UAlert
      v-if="submitSuccess"
      color="success"
      variant="subtle"
      title="Request submitted"
      description="Thanks! Your junk removal request has been submitted. We'll reach out soon."
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
        class="sr-only"
      >
        <label for="mm-removal-website">Website</label>
        <input
          id="mm-removal-website"
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

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            :ui="{ base: 'mm-native-date-input' }"
            @click="onServiceDateClick"
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
          label="State *"
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
            :ui="{ base: 'cursor-pointer' }"
            class="w-full min-h-48"
          >
            <!--
              Simplified UX: hide on-screen resize/worker/status text.
              Resize details are still logged to the console.
            -->

            <template #file-leading="{ file }">
              <div class="size-14 shrink-0 overflow-hidden rounded-md border border-default bg-elevated/20">
                <img
                  v-if="getPreviewUrl(file)"
                  :src="getPreviewUrl(file)"
                  alt=""
                  class="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                >
                <div
                  v-else
                  class="flex size-full items-center justify-center"
                >
                  <UIcon
                    name="i-lucide-image"
                    class="size-6 text-muted"
                  />
                </div>
              </div>
            </template>

            <template #file-name="{ file }">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-highlighted truncate">
                  {{ file.name }}
                </p>

                <p class="mt-1 text-xs text-muted">
                  Optional description
                </p>

                <UInput
                  v-model="state.photoDescriptions[getFileKey(file)]"
                  class="mt-2"
                  placeholder="e.g. Couch in basement, old fridge in garage"
                  size="lg"
                />
              </div>
            </template>

            <template #file-size>
              <!-- Shown in file-name slot above to avoid duplicating info -->
            </template>
          </UFileUpload>
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
            placeholder="Anything else we should know? (location, stairs, accessibility, preferred time, special instructions)"
            class="w-full"
          />
        </UFormField>
      </div>
      <NuxtTurnstile
        :key="turnstileKey"
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
          :disabled="isSubmitting || shouldBlockDuplicateSubmission"
          class="w-full sm:w-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          Request a quote
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<style>
/*
  Nuxt UI/Tailwind form styles can apply `appearance: none`, which hides the
  native calendar indicator in Chromium for <input type="date">.
  This is intentionally scoped to this single input.
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
