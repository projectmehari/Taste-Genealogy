// Guards against a stalled socket, not against the SDK's internal rate-limit
// waiting, hence the generous budget. Anything longer than this is dead.
const ARENA_REQUEST_TIMEOUT_MS = 45_000
const ARENA_MAX_ATTEMPTS = 5

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function errorStatus(error: unknown) {
  const candidate = error as { status?: number; response?: { status?: number } }

  return typeof candidate.status === 'number'
    ? candidate.status
    : typeof candidate.response?.status === 'number'
      ? candidate.response.status
      : undefined
}

function retryDelayMs(error: unknown, attempt: number) {
  const response = (error as { response?: { headers?: { get?: (name: string) => string | null } } })
    .response
  const retryAfter = Number(response?.headers?.get?.('retry-after'))

  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return Math.min(30_000, retryAfter * 1000)
  }

  return Math.min(15_000, 1000 * 2 ** attempt)
}

/**
 * Client errors such as 404 are permanent. Rate limits, server errors and
 * network-level failures (ECONNRESET / "fetch failed" / socket hang up) get
 * retried so a single blip does not abort a whole static build.
 */
export function isRetryableError(error: unknown) {
  const status = errorStatus(error)

  if (typeof status === 'number') {
    return status === 429 || status >= 500
  }

  return true
}

function describeError(error: unknown) {
  const code = (error as { code?: string }).code
  const message = (error as { message?: string }).message

  return [errorStatus(error) ? `status ${errorStatus(error)}` : null, code ?? null, message ?? String(error)]
    .filter(Boolean)
    .join(' ')
}

async function withTimeout<T>(label: string, load: () => Promise<T>) {
  let timer: ReturnType<typeof setTimeout> | undefined

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(`${label} timed out after ${ARENA_REQUEST_TIMEOUT_MS}ms`) as Error & {
        code: string
      }
      error.code = 'ETIMEDOUT'
      reject(error)
    }, ARENA_REQUEST_TIMEOUT_MS)
  })

  try {
    return await Promise.race([load(), timeout])
  } finally {
    if (timer) {
      clearTimeout(timer)
    }
  }
}

export async function withArenaRetry<T>(label: string, load: () => Promise<T>): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt < ARENA_MAX_ATTEMPTS; attempt += 1) {
    try {
      return await withTimeout(label, load)
    } catch (error) {
      lastError = error

      if (!isRetryableError(error) || attempt === ARENA_MAX_ATTEMPTS - 1) {
        throw error
      }

      const delay = retryDelayMs(error, attempt)
      console.warn(
        `${label} failed (${describeError(error)}); retry ${attempt + 1}/${ARENA_MAX_ATTEMPTS - 1} in ${Math.round(delay / 1000)}s`,
      )
      await sleep(delay)
    }
  }

  throw lastError
}
