import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/")

    await expect(page).toHaveTitle(/WeReport/i)
    await expect(page.getByRole("heading", { name: /WeReport/i })).toBeVisible()
  })

  test("should navigate to feed page", async ({ page }) => {
    await page.goto("/")

    await page.getByRole("link", { name: /feed/i }).click()
    await expect(page).toHaveURL(/\/feed/)
  })

  test("should show report issue button", async ({ page }) => {
    await page.goto("/")

    const reportButton = page.getByRole("link", { name: /report issue/i })
    await expect(reportButton).toBeVisible()
  })
})
