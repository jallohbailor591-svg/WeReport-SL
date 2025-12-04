import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { FeedFiltersClient } from "@/components/feed-filters-client"

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(() => null),
  }),
}))

describe("FeedFiltersClient", () => {
  it("should render search input", () => {
    render(<FeedFiltersClient />)
    expect(screen.getByPlaceholderText(/search issues/i)).toBeInTheDocument()
  })

  it("should render category select", () => {
    render(<FeedFiltersClient />)
    expect(screen.getByText(/category/i)).toBeInTheDocument()
  })

  it("should render status select", () => {
    render(<FeedFiltersClient />)
    expect(screen.getByText(/status/i)).toBeInTheDocument()
  })

  it("should show clear button when filters are active", () => {
    render(<FeedFiltersClient />)
    const searchInput = screen.getByPlaceholderText(/search issues/i)
    fireEvent.change(searchInput, { target: { value: "test" } })

    // Wait for debounce and state update
    waitFor(() => {
      const clearButton = screen.queryByTitle(/clear all filters/i)
      expect(clearButton).toBeInTheDocument()
    })
  })
})
