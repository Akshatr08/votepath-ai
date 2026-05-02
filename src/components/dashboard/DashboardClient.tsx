"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Map, CheckCircle2, ChevronRight, LogIn, User, Flag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { RoadmapCard } from "@/components/dashboard/RoadmapCard";
import { OnboardingWizard } from "@/components/dashboard/OnboardingWizard";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { DEFAULT_ROADMAP_STEPS } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Tab = "roadmap" | "assistant" | "firsttime";

const TABS = [
  { id: "roadmap" as Tab, label: "My Roadmap", icon: Map },
  { id: "assistant" as Tab, label: "AI Assistant", icon: Sparkles },
  { id: "firsttime" as Tab, label: "First Time Voter", icon: Flag },
];

const FIRST_TIME_TIPS = [
  {
    title: "What to Bring",
    items: ["Government-issued photo ID", "Voter registration card/confirmation", "Any absentee application (if applicable)"],
  },
  {
    title: "At the Polling Booth",
    items: ["Show your ID to the poll worker", "Receive your ballot (paper or electronic)", "Mark your choices in a private booth", "Submit your completed ballot"],
  },
  {
    title: "Your Privacy",
    items: ["Voting is completely secret — no one sees your ballot", "Poll workers cannot ask who you voted for", "You can vote for any candidate without fear"],
  },
  {
    title: "How Long It Takes",
    items: ["Usually 15–30 minutes total", "Longer lines on election day morning & evening", "Early voting is often faster"],
  },
];

export function DashboardClient(): JSX.Element {
  const { user, profile, loading, signInWithGoogle, isAuthenticated } = useAuthContext();
  const [activeTab, setActiveTab] = useState<Tab>("roadmap");
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">
              {isAuthenticated
                ? `Welcome back, ${user?.displayName?.split(" ")[0] ?? "Voter"} 👋`
                : "Your Voting Dashboard"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {profile?.onboardingComplete
                ? "Track your election journey and get AI-powered guidance."
                : "Complete your profile to get personalized guidance."}
            </p>
          </div>

          <div className="flex gap-3">
            {!isAuthenticated ? (
              <Button onClick={signInWithGoogle} id="dashboard-signin" aria-label="Sign in with Google">
                <LogIn className="w-4 h-4" aria-hidden="true" />
                Sign In to Save Progress
              </Button>
            ) : !profile?.onboardingComplete ? (
              <Button
                onClick={() => setShowOnboarding(true)}
                variant="gradient"
                id="start-onboarding"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                Complete Profile
              </Button>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Steps Completed", value: "1/6", color: "text-blue-500" },
          { label: "Days to Deadline", value: "18", color: "text-orange-500" },
          { label: "Your Region", value: profile?.state || "—", color: "text-green-500" },
          { label: "Status", value: isAuthenticated ? "Registered" : "Guest", color: "text-purple-500" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className={cn("text-xl font-bold truncate", stat.color)}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link href="/timeline">
          <Button variant="outline" size="sm" className="rounded-full">Timeline</Button>
        </Link>
        <Link href="/faq">
          <Button variant="outline" size="sm" className="rounded-full">FAQ</Button>
        </Link>
        <Link href="/settings">
          <Button variant="outline" size="sm" className="rounded-full">Settings</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Dashboard sections"
        className="flex gap-1 p-1 bg-secondary rounded-xl mb-8 w-fit"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeTab === tab.id
                  ? "bg-card shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {/* Roadmap */}
        <div
          id="panel-roadmap"
          role="tabpanel"
          aria-labelledby="tab-roadmap"
          hidden={activeTab !== "roadmap"}
        >
          {activeTab === "roadmap" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">Election Roadmap</h2>
                <Link href="/checklist">
                  <Button variant="outline" size="sm">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    Full Checklist
                    <ChevronRight className="w-3 h-3" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {DEFAULT_ROADMAP_STEPS.map((step, i) => (
                  <RoadmapCard key={step.id} step={step} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* AI Assistant */}
        <div
          id="panel-assistant"
          role="tabpanel"
          aria-labelledby="tab-assistant"
          hidden={activeTab !== "assistant"}
        >
          {activeTab === "assistant" && <AIAssistant />}
        </div>

        {/* First Time Voter */}
        <div
          id="panel-firsttime"
          role="tabpanel"
          aria-labelledby="tab-firsttime"
          hidden={activeTab !== "firsttime"}
        >
          {activeTab === "firsttime" && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold">First Time Voter Guide</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Everything you need to know before and on election day.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {FIRST_TIME_TIPS.map((tip, i) => (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">{tip.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2" role="list">
                          {tip.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
      )}
    </main>
  );
}
