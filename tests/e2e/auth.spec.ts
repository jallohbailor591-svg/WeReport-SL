import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/auth/login")

    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test("should show validation errors for empty form", async ({ page }) => {
    await page.goto("/auth/login")

    await page.getByRole("button", { name: /sign in/i }).click()

    // Should show validation errors
    await expect(page.getByText(/email.*required/i)).toBeVisible()
  })

  test("should navigate to signup page", async ({ page }) => {
    await page.goto("/auth/login")

    await page.getByRole("link", { name: /sign up/i }).click()
    await expect(page).toHaveURL(/\/auth\/sign-up/)
  })
})
