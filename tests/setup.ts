import "@testing-library/jest-dom"
import { beforeAll, afterEach, afterAll } from "vitest"

// Mock environment variables
beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"
})

// Cleanup after each test
afterEach(() => {
  // Clear all mocks
})

afterAll(() => {
  // Final cleanup
})
