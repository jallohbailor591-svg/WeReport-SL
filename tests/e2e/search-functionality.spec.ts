import { test, expect } from "@playwright/test"

test.describe("Search and Filter Functionality", () => {
  test("should perform search on feed page", async ({ page }) => {
    await page.goto("/feed")

    const searchInput = page.locator('input[placeholder*="Search issues"]')
    await searchInput.fill("road repair")

    // Wait for debounced search
    await page.waitForTimeout(600)

    // Check URL was updated
    await expect(page).toHaveURL(/.*search=road\+repair.*/)
  })

  test("should filter by category", async ({ page }) => {
    await page.goto("/feed")

    await page.click('button:has-text("Category")')
    await page.click("text=Infrastructure")

    // Check URL was updated
    await expect(page).toHaveURL(/.*category=infrastructure.*/)
  })

  test("should filter by status", async ({ page }) => {
    await page.goto("/feed")

    await page.click('button:has-text("Status")')
    await page.click("text=In Progress")

    await expect(page).toHaveURL(/.*status=in-progress.*/)
  })

  test("should clear all filters", async ({ page }) => {
    await page.goto("/feed?search=test&category=infrastructure&status=pending")

    const clearButton = page.locator('button[title="Clear all filters"]')
    await clearButton.click()

    await expect(page).toHaveURL("/feed")
  })
})
