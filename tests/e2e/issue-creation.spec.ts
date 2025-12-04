import { test, expect } from "@playwright/test"

test.describe("Issue Creation Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should navigate to report page", async ({ page }) => {
    await page.click('a[href="/report"]')
    await expect(page).toHaveURL("/report")
    await expect(page.locator("h1")).toContainText(/report/i)
  })

  test("should display report form fields", async ({ page }) => {
    await page.goto("/report")

    await expect(page.locator('input[name="title"]')).toBeVisible()
    await expect(page.locator('textarea[name="description"]')).toBeVisible()
    await expect(page.locator('select[name="category"]')).toBeVisible()
  })

  test("should show validation errors for empty form", async ({ page }) => {
    await page.goto("/report")

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    await expect(page.locator("text=/required/i").first()).toBeVisible()
  })
})
