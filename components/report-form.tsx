"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Upload, Loader2, AlertCircle } from "lucide-react"

const CATEGORIES = [
  { id: "water", label: "Water Supply", emoji: "💧" },
  { id: "waste", label: "Waste Management", emoji: "🗑️" },
  { id: "roads", label: "Roads & Potholes", emoji: "🛣️" },
  { id: "electricity", label: "Electricity", emoji: "⚡" },
  { id: "safety", label: "Public Safety", emoji: "🚨" },
]

const SEVERITY_OPTIONS = [
  { value: 1, label: "Low" },
  { value: 2, label: "Minor" },
  { value: 3, label: "Medium" },
  { value: 4, label: "High" },
  { value: 5, label: "Critical" },
]

export function ReportForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    severity: 3,
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    photos: [] as File[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  // Check authentication on mount
  const checkAuth = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/auth/login")
    } else {
      setUser(user)
    }
  }

  React.useEffect(() => {
    checkAuth()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "severity" ? Number.parseInt(value) : value,
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const totalSize = [...formData.photos, ...newFiles].reduce((sum, f) => sum + f.size, 0)

      if (totalSize > 50 * 1024 * 1024) {
        // 50MB limit
        setError("Total file size exceeds 50MB limit")
        return
      }

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newFiles],
      }))
    }
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const getLocation = () => {
    setLocationError(null)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          }))
        },
        (error) => {
          setLocationError(`Location error: ${error.message}`)
        },
      )
    } else {
      setLocationError("Geolocation not supported by your browser")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError("You must be logged in to submit a report")
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()

      let imageUrls: string[] = []
      if (formData.photos.length > 0) {
        imageUrls = await Promise.all(
          formData.photos.map(async (photo) => {
            const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${photo.name}`
            const { data, error } = await supabase.storage.from("issue-images").upload(`${user.id}/${fileName}`, photo)

            if (error) throw error

            const {
              data: { publicUrl },
            } = supabase.storage.from("issue-images").getPublicUrl(`${user.id}/${fileName}`)

            return publicUrl
          }),
        )
      }

      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          severity: formData.severity,
          location: formData.location,
          coordinates: {
            lat: formData.latitude || 0,
            lng: formData.longitude || 0,
          },
          user_id: user.id,
          image_urls: imageUrls,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit report")
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || "Failed to submit report")
      }

      setSubmitted(true)
      setTimeout(() => {
        router.push(`/issues/${result.data.id}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while submitting your report")
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title && formData.description
      case 2:
        return formData.category
      case 3:
        return formData.location
      default:
        return false
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6 animate-in zoom-in-50 duration-300">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-6">
          Your report has been submitted successfully. Redirecting to the issue page...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition ${
                  s === step
                    ? "bg-primary text-primary-foreground"
                    : s < step
                      ? "bg-accent text-white"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              <span className="text-xs text-center text-muted-foreground">
                {s === 1 ? "Details" : s === 2 ? "Category" : s === 3 ? "Location" : "Review"}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Title & Description */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Problem Title
              </label>
              <Input
                id="title"
                type="text"
                name="title"
                placeholder="e.g., Large pothole on Main Street"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full"
                required
                aria-required="true"
                aria-describedby="title-help"
                minLength={10}
                maxLength={200}
              />
              <p id="title-help" className="text-xs text-muted-foreground mt-1">
                Be specific and concise (10-200 characters)
              </p>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the issue in detail. When was it first noticed? Why is it a problem?"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
                aria-required="true"
                aria-describedby="description-help"
                minLength={20}
                maxLength={5000}
              />
              <p id="description-help" className="text-xs text-muted-foreground mt-1">
                Provide detailed information (20-5000 characters)
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Category & Severity */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div>
              <label className="block text-sm font-medium mb-4" id="category-label">
                What category best describes this issue?
              </label>
              <div 
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                role="radiogroup"
                aria-labelledby="category-label"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, category: cat.id }))}
                    className={`p-4 border-2 rounded-lg text-left transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      formData.category === cat.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                    aria-pressed={formData.category === cat.id}
                    aria-label={`Select ${cat.label} category`}
                  >
                    <div className="text-2xl mb-2" aria-hidden="true">{cat.emoji}</div>
                    <div className="font-medium text-sm">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium mb-2">
                Severity Level
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                aria-describedby="severity-help"
                required
              >
                {SEVERITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p id="severity-help" className="text-xs text-muted-foreground mt-1">
                How urgent is this issue?
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Location & Photos */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Location
              </label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="Enter address or coordinates"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="flex-1"
                  required
                  aria-required="true"
                  aria-describedby="location-help"
                  aria-invalid={!!locationError}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getLocation}
                  className="flex items-center gap-2 bg-transparent"
                  aria-label="Use current location"
                >
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  Current
                </Button>
              </div>
              {locationError && (
                <p 
                  className="text-xs text-destructive mt-1 flex items-center gap-1"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="w-3 h-3" aria-hidden="true" /> {locationError}
                </p>
              )}
              <p id="location-help" className="text-xs text-muted-foreground mt-1">
                Exact location helps prioritize response
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Add Photos (Optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">Click to upload photos</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB each (50MB total)</p>
                </label>
              </div>

              {formData.photos.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">{formData.photos.length} photo(s) selected</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.photos.map((photo, i) => (
                      <div key={i} className="relative bg-muted rounded p-2">
                        <p className="text-xs truncate max-w-20">{photo.name}</p>
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/80"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Problem Title</p>
                <p className="font-semibold">{formData.title}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Description</p>
                <p className="text-sm">{formData.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Category</p>
                  <p className="font-semibold">{CATEGORIES.find((c) => c.id === formData.category)?.label}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Severity</p>
                  <p className="font-semibold">{SEVERITY_OPTIONS.find((s) => s.value === formData.severity)?.label}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
                  <p className="font-semibold text-sm">{formData.location}</p>
                </div>
              </div>
              {formData.photos.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Photos</p>
                  <p className="font-semibold">{formData.photos.length} image(s) attached</p>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              By submitting, you agree to share this information with your local council for review and action.
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 pt-6">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <div className="flex-1" />
          {step < 4 ? (
            <Button type="button" onClick={() => setStep(step + 1)} disabled={!isStepValid()}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
