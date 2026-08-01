export async function runWithConcurrency<T>(jobs: Array<() => Promise<T>>, limit: number): Promise<T[]> {
  const results = new Array<T>(jobs.length);
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, jobs.length) }, async () => {
      while (nextIndex < jobs.length) {
        const index = nextIndex++;
        results[index] = await jobs[index]();
      }
    }),
  );

  return results;
}
