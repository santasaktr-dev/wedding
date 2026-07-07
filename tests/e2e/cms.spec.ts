import { expect, test } from "@playwright/test";

test("public home page renders with fallback CMS content", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /jajah & smart/i })).toBeVisible();
  await expect(page.getByText(/Pearl Wedding Avenue/i).first()).toBeVisible();
});

test("admin login page renders", async ({ page }) => {
  await page.goto("/admin/login");

  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
});

test("gallery page renders fallback album", async ({ page }) => {
  await page.goto("/gallery");

  await expect(page.getByRole("heading", { name: /jajah & smart albums/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /highlights/i })).toBeVisible();
});
