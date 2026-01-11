import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { MapPin, Shield, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { PublicLayout } from "@/components/public-layout";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 fixed w-full z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-xl">InfraAlert</span>
            </div> */}

            <Link href="/" className="flex items-center gap-2 items-center">
              <img
                src="/logo.png"
                alt="InfraAlert Logo"
                className="h-5 w-5"
              />
              <span className="font-display font-bold text-xl font-color-blue">
                InfraAlert
              </span>
            </Link>


            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-enter">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Now serving 10+ municipalities
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Open-source civic platform
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-display font-extrabold leading-[1.1] tracking-tight text-foreground">
                Better cities start with <span className="text-primary">better feedback.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Report infrastructure issues in seconds. Track progress in real-time. Join thousands of citizens in building safer, cleaner neighborhoods.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-8 text-lg shadow-lg shadow-primary/20">
                    Report an Issue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                    Explore Issues Near You
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-8 text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-5 w-5" />
                  <span>Instant Reporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-5 w-5" />
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform rotate-3 scale-105 blur-2xl"></div>
              {/* Scenic cityscape Unsplash image */}
              <img
                src="/hero_img.png"
                alt="City Infrastructure"
                className="relative rounded-3xl shadow-2xl border border-white/20 object-cover aspect-[4/3]"
              />
              {/* Floating card effect */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-border/50 max-w-xs animate-enter" style={{ animationDelay: '200ms' }}>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Issue Resolved</p>
                    <p className="text-muted-foreground text-sm">Pothole on 5th Ave fixed within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold font-display mb-4">How InfraAlert Works</h2>
              <p className="text-muted-foreground text-lg">Our platform bridges the gap between citizens and city administration, making infrastructure maintenance efficient and transparent.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <MapPin className="h-8 w-8 text-primary" />,
                  title: "1. Report Geotagged Issues",
                  desc: "Snap a photo, confirm location, and submit. The system automatically routes it to the right department."
                },
                {
                  icon: <Shield className="h-8 w-8 text-primary" />,
                  title: "2. Track Resolution",
                  desc: "Get notified when status changes from 'Pending' to 'In Progress' and finally 'Resolved'."
                },
                {
                  icon: <Users className="h-8 w-8 text-primary" />,
                  title: "3. Community Impact",
                  desc: "See what issues are being reported in your neighborhood and upvote critical repairs."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
