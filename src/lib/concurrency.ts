/**
 * Runs `worker` over `items` with at most `limit` promises in flight, keeping
 * results in input order. Ordered results matter here because the rendered
 * channel order (and block tie-breaking) must be identical on every build.
 */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length)
  const total = items.length
  let next = 0
  let failed = false

  if (total === 0) {
    return results
  }

  const lanes = Math.max(1, Math.min(limit, total))

  await Promise.all(
    Array.from({ length: lanes }, async () => {
      while (!failed) {
        const index = next
        next += 1

        if (index >= total) {
          return
        }

        try {
          results[index] = await worker(items[index], index)
        } catch (error) {
          // Stop the other lanes from pulling new work, then surface the error.
          failed = true
          throw error
        }
      }
    }),
  )

  return results
}
