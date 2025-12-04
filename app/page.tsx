import Link from "next/link"
import { ChevronRight, MapPin, Users, TrendingUp, CheckCircle, MessageSquare, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0057A8] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              W
            </div>
            <span className="font-bold text-xl text-foreground">WeReport</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#how-it-works" className="text-sm font-semibold hover:text-[#0057A8] transition">
              How It Works
            </a>
            <a href="#impact" className="text-sm font-semibold hover:text-[#0057A8] transition">
              Impact
            </a>
            <a href="#testimonials" className="text-sm font-semibold hover:text-[#0057A8] transition">
              Stories
            </a>
          </div>
          <div className="flex gap-3">
            <Link href="/report">
              <Button
                variant="outline"
                size="sm"
                className="font-bold bg-transparent border-[#0057A8] text-[#0057A8] hover:bg-[#0057A8]/10"
              >
                Report Issue
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="sm" className="font-bold bg-[#0057A8] hover:bg-[#0057A8]/90 text-white">
                View Issues
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-[#0057A8] via-[#0057A8] to-[#1FA84F] text-white py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight mb-8">
              Fix Your Community, One Report at a Time
            </h1>
            <p className="text-lg md:text-xl text-white/90 text-balance mb-10 leading-relaxed font-semibold">
              Report local problems directly to your council. Upvote urgent issues. Watch real-world change happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/report">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-[#0057A8] hover:bg-white/90 font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Report a Problem
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#1FA84F] text-white hover:bg-[#1FA84F]/90 font-bold text-base border-2 border-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  View Community Issues
                </Button>
              </Link>
            </div>
            <p className="text-base text-white/80 mt-8 font-semibold">Join 15,000+ citizens making a difference</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 bg-[#F7F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-[#1A1A1A]">Three Simple Steps</h2>
          <p className="text-center text-[#4D4D4D] mb-16 max-w-2xl mx-auto text-lg font-semibold">
            From problem to resolution in one platform
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { number: "1", title: "Report", desc: "Spot an issue? Report it with photos and details.", icon: MapPin },
              { number: "2", title: "Upvote", desc: "Community upvotes prioritize urgent issues.", icon: TrendingUp },
              { number: "3", title: "Resolve", desc: "Track progress as officials work on fixes.", icon: CheckCircle },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={i}
                  className="bg-white border-2 border-[#E0E0E0] rounded-2xl p-10 text-center hover:shadow-lg hover:border-[#0057A8] transition-all"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1FA84F]/15 rounded-full mb-6">
                    <Icon className="w-8 h-8 text-[#1FA84F] font-bold" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[#1A1A1A]">{step.title}</h3>
                  <p className="text-[#4D4D4D] text-base font-semibold">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-[#1A1A1A]">Why Choose WeReport</h2>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              { icon: MapPin, title: "Location-Based", desc: "See problems on an interactive map near you" },
              { icon: Users, title: "Community Powered", desc: "Upvotes show what matters most to citizens" },
              { icon: BarChart3, title: "Data Transparency", desc: "Track resolution time and government response" },
              { icon: MessageSquare, title: "Two-Way Communication", desc: "Councils provide updates on every report" },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 bg-[#1FA84F]/15 rounded-lg">
                      <Icon className="w-6 h-6 text-[#1FA84F] font-bold" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-[#1A1A1A]">{feature.title}</h3>
                    <p className="text-[#4D4D4D] text-base font-semibold">{feature.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="impact" className="py-20 md:py-32 bg-[#0057A8] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "14,832", label: "Issues Reported" },
              { stat: "8,456", label: "Issues Resolved" },
              { stat: "73%", label: "Resolution Rate" },
              { stat: "28 days", label: "Avg. Resolution Time" },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-5xl font-bold mb-3">{item.stat}</div>
                <div className="text-white/90 text-lg font-semibold">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-32 bg-[#F7F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#1A1A1A]">Community Stories</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Community Organizer",
                quote: "WeReport gave us the data to push for that new traffic light. Now our street is safer.",
              },
              {
                name: "Ahmed Malik",
                role: "Local Resident",
                quote: "Finally, someone listens to us. The pothole on my street was fixed in 3 weeks.",
              },
              {
                name: "James Robertson",
                role: "City Council Member",
                quote: "This platform helps us prioritize better. We're more responsive to our community now.",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white border-2 border-[#E0E0E0] rounded-2xl p-8 hover:border-[#0057A8] transition-all"
              >
                <p className="text-[#4D4D4D] mb-6 italic text-lg font-semibold">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold text-lg text-[#1A1A1A]">{testimonial.name}</p>
                  <p className="text-[#4D4D4D] font-semibold">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[#0057A8] via-[#0057A8]/98 to-[#1FA84F]/20 border-t-2 border-[#0057A8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Ready to Make a Difference?</h2>
          <p className="text-lg text-white/90 mb-10 font-semibold">
            Start reporting local issues and watch your community improve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/report">
              <Button
                size="lg"
                className="bg-white text-[#0057A8] hover:bg-white/90 font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Report Your First Issue
              </Button>
            </Link>
            <Link href="/map">
              <Button
                size="lg"
                className="bg-[#1FA84F] text-white hover:bg-[#1FA84F]/90 font-bold text-base border-2 border-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                View Our Map
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#1A1A1A] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#1FA84F] rounded-lg flex items-center justify-center text-white font-bold">
                  W
                </div>
                <span className="font-bold text-lg">WeReport</span>
              </div>
              <p className="text-sm text-white/70 font-semibold">
                Empowering communities to fix local issues together.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Platform</h4>
              <ul className="space-y-2 text-sm text-white/70 font-semibold">
                <li>
                  <Link href="/feed" className="hover:text-[#1FA84F] transition">
                    Browse Issues
                  </Link>
                </li>
                <li>
                  <Link href="/map" className="hover:text-[#1FA84F] transition">
                    Interactive Map
                  </Link>
                </li>
                <li>
                  <Link href="/report" className="hover:text-[#1FA84F] transition">
                    Report Issue
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Resources</h4>
              <ul className="space-y-2 text-sm text-white/70 font-semibold">
                <li>
                  <a href="#" className="hover:text-[#1FA84F] transition">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1FA84F] transition">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1FA84F] transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70 font-semibold">
                <li>
                  <a href="#" className="hover:text-[#1FA84F] transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1FA84F] transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#1FA84F] transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/70 font-semibold">
            <p>&copy; 2025 WeReport. Built for civic engagement.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
