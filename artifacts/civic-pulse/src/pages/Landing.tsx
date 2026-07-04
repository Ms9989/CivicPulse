import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, Zap, BrainCircuit, Globe, Layers } from "lucide-react";
import { PageTransition, staggerContainer, staggerItem } from "@/components/PageTransition";

export default function Landing() {
  return (
    <PageTransition className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="py-6 px-8 flex justify-between items-center border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20">
            CP
          </div>
          <span className="text-xl font-bold tracking-tight">CivicPulse</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login">
            <Button variant="ghost" className="font-medium">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button className="shadow-lg shadow-primary/20">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                CivicPulse AI Engine 2.0 Now Live
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
                Decision intelligence for <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">modern municipalities.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Empower your local government with AI-driven insights. Automatically analyze citizen complaints, prioritize critical issues, and optimize departmental workloads in real-time.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-primary/25">
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-background/50 backdrop-blur-sm">
                    View Demo Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 md:px-8 bg-card border-y border-border/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">A complete operating system for civic data</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Everything your municipal office needs to understand and act on citizen feedback at scale.</p>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                { icon: BrainCircuit, title: "AI Issue Triage", desc: "Automatically categorize and prioritize incoming complaints using advanced natural language processing." },
                { icon: Zap, title: "Real-time Detection", desc: "Identify duplicate reports instantly to prevent redundant crew dispatches and wasted resources." },
                { icon: Activity, title: "Predictive Analytics", desc: "Forecast emerging issues and infrastructural decay before they become critical citizen pain points." },
                { icon: ShieldCheck, title: "Resource Allocation", desc: "Optimize departmental workload by intelligently assigning issues based on crew availability and skill." },
                { icon: Layers, title: "Cross-dept Visibility", desc: "Break down silos with unified dashboards showing exact performance metrics across all city departments." },
                { icon: Globe, title: "Geospatial Insights", desc: "Map complaint density to identify problematic wards and target infrastructural investments effectively." }
              ].map((feature, i) => (
                <motion.div key={i} variants={staggerItem} className="p-6 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-4 text-center">
          <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to transform your municipality?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join forward-thinking cities that are using CivicPulse to build more responsive, efficient, and transparent local governance.
          </p>
          <Link href="/signup">
            <Button size="lg" className="h-14 px-10 text-lg shadow-xl shadow-primary/25">
              Get Started Today
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t py-12 px-8 bg-card mt-auto text-sm text-muted-foreground">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-[10px]">
                CP
              </div>
              <span className="font-bold text-foreground tracking-tight text-base">CivicPulse</span>
            </div>
            <p>Intelligence platform for modern municipal governance.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>Features</li>
              <li>Security</li>
              <li>Integrations</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>About</li>
              <li>Customers</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
      </footer>
    </PageTransition>
  );
}
