"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Zap, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { NotificationCenter } from "@/components/notification-center"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    const interval = setInterval(checkUser, 60000)
    return () => clearInterval(interval)
  }, [])

  const checkUser = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error("Error checking user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/feed", label: "Feed" },
    { href: "/map", label: "Map" },
    { href: "/community", label: "Community" },
    { href: "/dashboard", label: "Dashboard" },
  ]

  return (
    <nav 
      className="sticky top-0 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 border-b-2 border-emerald-700 dark:border-emerald-800 shadow-lg backdrop-blur-md"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 rounded-lg"
          aria-label="WeReport Home"
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white font-bold text-base shadow-lg group-hover:shadow-xl group-hover:bg-white/30 transition-all">
            W
          </div>
          <span className="font-bold text-xl hidden sm:inline text-white drop-shadow-md">WeReport</span>
        </Link>

        <div className="hidden md:flex gap-1 items-center" role="menubar">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 transition-all duration-200 aria-current:bg-white/30 aria-current:text-white"
              role="menuitem"
              aria-label={`Navigate to ${link.label}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex gap-3 items-center">
          {!isLoading && (
            <>
              {user ? (
                <>
                  <NotificationCenter userId={user.id} />
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-white/90 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600"
                      aria-label="View profile"
                    >
                      <Settings className="w-4 h-4" aria-hidden="true" />
                      Profile
                    </Button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-semibold px-3.5 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 transition-all duration-200 flex items-center gap-1.5"
                    aria-label="Sign out"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white/90 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600"
                      aria-label="Sign in"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-white text-emerald-600 hover:bg-white/90 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 font-semibold"
                      aria-label="Create account"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
          <Link href="/report" aria-label="Report a new issue">
            <Button
              size="sm"
              className="gap-1.5 font-semibold bg-white text-emerald-600 hover:bg-white/90 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 transition-all"
            >
              <Zap className="w-4 h-4" aria-hidden="true" />
              Report Issue
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2.5 hover:bg-white/20 rounded-lg transition-colors active:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-white" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5 text-white" aria-hidden="true" />
          )}
        </button>
      </div>

      {isOpen && (
        <div 
          id="mobile-menu"
          className="md:hidden border-t-2 border-emerald-700 dark:border-emerald-800 bg-gradient-to-b from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 backdrop-blur-sm animate-in fade-in-50 slide-in-from-top-2 duration-200 shadow-lg"
          role="menu"
        >
          <div className="px-4 py-4 space-y-2 max-w-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-semibold px-4 py-2.5 rounded-lg text-white/90 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 transition-all"
                role="menuitem"
                aria-label={`Navigate to ${link.label}`}
              >
                {link.label}
              </Link>
            ))}

            {!isLoading && user && (
              <>
                <div className="pt-3 border-t-2 border-emerald-700 dark:border-emerald-800 mt-3 space-y-2">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block text-sm font-semibold px-4 py-2.5 rounded-lg text-white/90 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 transition-all"
                    role="menuitem"
                    aria-label="View profile"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left text-sm font-semibold px-4 py-2.5 rounded-lg text-white/90 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 transition-all"
                    role="menuitem"
                    aria-label="Sign out"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            )}

            {!isLoading && !user && (
              <>
                <div className="pt-3 border-t-2 border-emerald-700 dark:border-emerald-800 mt-3 space-y-2">
                  <Link href="/auth/login" onClick={() => setIsOpen(false)} className="block w-full" aria-label="Sign in">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up" onClick={() => setIsOpen(false)} className="block w-full" aria-label="Create account">
                    <Button 
                      size="sm" 
                      className="w-full bg-white text-emerald-600 hover:bg-white/90 shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 font-semibold"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </>
            )}

            <Link
              href="/report"
              onClick={() => setIsOpen(false)}
              className="block w-full mt-3 pt-3 border-t-2 border-emerald-700 dark:border-emerald-800"
              aria-label="Report a new issue"
            >
              <Button
                size="sm"
                className="w-full gap-1.5 font-semibold bg-white text-emerald-600 hover:bg-white/90 shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600"
              >
                <Zap className="w-4 h-4" aria-hidden="true" />
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
