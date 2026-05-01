"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Sparkles, MapPin, Calendar, ShieldCheck, Globe,
  CheckCircle2, ArrowRight, ChevronRight, Users, Zap, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { MYTHS_FACTS, APP_TAGLINE } from "@/constants";
import { ThreeBackground } from "./ThreeBackground";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Election Assistant",
    description: "Ask anything about elections — registration, documents, eligibility — and get clear, neutral answers instantly.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Calendar,
    title: "Interactive Timeline",
    description: "Visualize the entire election lifecycle from registration to results with animated, easy-to-follow cards.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Eligibility Checker",
    description: "Find out if you're eligible to vote in seconds. Get personalized next steps based on your situation.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: MapPin,
    title: "Polling Locator",
    description: "Find your nearest polling booth, election office, or help center using Google Maps integration.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: CheckCircle2,
    title: "Smart Checklist",
    description: "Save your personalized voter checklist with deadlines and notes. Never miss a step.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Available in English, Hindi, and 8+ Indian languages using real-time Cloud Translation API.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Tell Us About You", description: "Complete a quick onboarding — your country, state, age, and voter status." },
  { step: "02", title: "Get Your Roadmap", description: "Receive a personalized step-by-step election journey tailored to your profile." },
  { step: "03", title: "Ask the AI Assistant", description: "Have questions? Our Gemini-powered assistant answers everything about elections." },
  { step: "04", title: "Vote Confidently", description: "Know exactly what to do, what to bring, and when. Vote with complete confidence." },
];

const STATS = [
  { value: "8+", label: "Core Features" },
  { value: "100%", label: "Non-Partisan" },
  { value: "8+", label: "Regional Languages" },
  { value: "100%", label: "Google Cloud Ecosystem" },
];

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        className="hero-gradient relative min-h-screen flex items-center justify-center pt-20 pb-16"
        aria-labelledby="hero-heading"
      >
        <ThreeBackground />
        {/* Background orbs */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-float" />
          <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-blue-400/5 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Powered by Google Cloud Ecosystem (6 Core Services)
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
          >
            Understand Elections{" "}
            <span className="gradient-text block sm:inline">Without Confusion</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {APP_TAGLINE}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base text-muted-foreground max-w-xl mx-auto mb-10"
          >
            Personalized guidance for registration, voting steps, timelines, and election day.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              variant="gradient"
              size="xl"
              id="hero-start-cta"
              aria-label="Start your voting journey"
            >
              <Link href="/dashboard">
                Start Journey
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              id="hero-ai-cta"
              aria-label="Open AI Assistant"
            >
              <Link href="/dashboard#assistant">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                Ask AI Assistant
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section
        className="py-24 bg-secondary/30"
        aria-labelledby="features-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
              <Zap className="w-4 h-4" aria-hidden="true" />
              Everything You Need
            </span>
            <h2 id="features-heading" className="text-4xl sm:text-5xl font-extrabold mb-4">
              Packed with <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From AI-powered guidance to interactive maps, VotePath AI gives you every tool to vote with confidence.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <AnimatedSection key={feature.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                  >
                    <Card hover className="h-full">
                      <CardContent className="p-6">
                        <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                          <Icon className={`w-6 h-6 ${feature.color}`} aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section
        className="py-24"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              Simple Process
            </span>
            <h2 id="how-it-works-heading" className="text-4xl sm:text-5xl font-extrabold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <AnimatedSection key={step.step}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative text-center"
                >
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div aria-hidden="true" className="hidden lg:block absolute top-8 left-full w-full h-px border-t border-dashed border-border -translate-x-6 z-0" />
                  )}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-4 text-white font-extrabold text-lg shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Myth vs Fact ───────────────────────────────────── */}
      <section
        className="py-24 bg-secondary/30"
        aria-labelledby="myths-heading"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              Common Misconceptions
            </span>
            <h2 id="myths-heading" className="text-4xl sm:text-5xl font-extrabold mb-4">
              Myth vs <span className="gradient-text">Fact</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Clear up the most common misconceptions about voting.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MYTHS_FACTS.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 bg-destructive/5 border-b border-destructive/20">
                      <div className="flex items-start gap-2">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-destructive/15 text-destructive">MYTH</span>
                        <p className="text-sm text-muted-foreground">{item.myth}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-2">
                        <span className="inline-flex px-2 py-0.5 rounded text-xs font-bold bg-green-500/15 text-green-600 dark:text-green-400">FACT</span>
                        <p className="text-sm font-medium">{item.fact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="py-24" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="relative rounded-3xl overflow-hidden p-12 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 text-white shadow-2xl">
              <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
              </div>
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
                    <Users className="w-10 h-10" aria-hidden="true" />
                  </div>
                </div>
                <h2 id="cta-heading" className="text-3xl sm:text-4xl font-extrabold mb-4">
                  Ready to Vote with Confidence?
                </h2>
                <p className="text-blue-100 mb-8 text-lg max-w-xl mx-auto">
                  Join millions of first-time and returning voters. Your personalized election journey starts now.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="xl"
                    className="bg-white text-blue-700 hover:bg-blue-50 font-bold"
                    id="cta-start-journey"
                  >
                    <Link href="/dashboard">
                      Start Your Journey
                      <ChevronRight className="w-5 h-5" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="xl"
                    variant="outline"
                    className="border-white/40 text-white hover:bg-white/10"
                  >
                    <Link href="/eligibility">Check Eligibility</Link>
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
