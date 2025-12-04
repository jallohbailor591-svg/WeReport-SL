"use client"

import { redirect } from "next/navigation"
import { createServerClient_ } from "@/lib/supabase-server"
import { Navigation } from "@/components/navigation"
import { ModerationQueue } from "@/components/moderation-queue"
import { AdminStats } from "@/components/admin-stats"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createServerClient_()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You don't have permission to access the admin panel.</p>
            <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage issues, moderate content, and track platform metrics</p>
        </div>

        <div className="space-y-8">
          <AdminStats userId={user.id} />
          <ModerationQueue userId={user.id} />
        </div>
      </main>
    </div>
  )
}
