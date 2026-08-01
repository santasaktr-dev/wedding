import { expect, it } from "vitest";

import { runWithConcurrency } from "../upload-queue";

it("never runs more than three upload jobs at once", async () => {
  let active = 0;
  let peak = 0;
  const jobs = Array.from({ length: 8 }, (_, value) => async () => {
    active += 1;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active -= 1;
    return value;
  });

  await expect(runWithConcurrency(jobs, 3)).resolves.toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  expect(peak).toBe(3);
});
