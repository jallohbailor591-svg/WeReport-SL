import { redirect } from "next/navigation"
import { createServerClient_ } from "@/lib/supabase-server"
import { Navigation } from "@/components/navigation"
import { UserProfileView } from "@/components/user-profile-view"

export default async function ProfilePage() {
  const supabase = await createServerClient_()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>
        {profile && <UserProfileView profile={profile} user={user} />}
      </main>
    </div>
  )
}
