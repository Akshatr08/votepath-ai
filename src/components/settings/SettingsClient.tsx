"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Eye, Languages, Moon, Sun, Accessibility } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useAccessibility } from "@/components/providers/AccessibilityProvider";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export function SettingsClient() {
  const { user, profile, isAuthenticated } = useAuthContext();
  const { fontSize, setFontSize, highContrast, setHighContrast } = useAccessibility();
  const { theme, setTheme } = useTheme();

  const saveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-extrabold mb-2">
          Settings & <span className="gradient-text">Accessibility</span>
        </h1>
        <p className="text-muted-foreground">
          Customize your experience to make VotePath AI work best for you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "appearance", label: "Appearance", icon: Moon },
            { id: "accessibility", label: "Accessibility", icon: Accessibility },
            { id: "privacy", label: "Privacy & Security", icon: Shield },
          ].map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-secondary text-muted-foreground hover:text-foreground"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-8">
          {/* Profile Section */}
          <section id="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Profile</CardTitle>
                <CardDescription>Manage your personal information and voting eligibility details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAuthenticated ? (
                  <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl border border-border">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xl font-bold">
                      {user?.displayName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-bold">{user?.displayName}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                      <p className="text-xs text-primary mt-1">Verified Voter Profile</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-border rounded-2xl">
                    <p className="text-sm text-muted-foreground mb-4">Sign in to manage your profile</p>
                    <Button variant="outline" size="sm">Connect Google Account</Button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Current State</label>
                    <p className="text-sm font-medium">{profile?.state || "Not Set"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Voting Status</label>
                    <p className="text-sm font-medium">{profile?.isFirstTimeVoter ? "First Time Voter" : "Registered Voter"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Appearance Section */}
          <section id="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appearance</CardTitle>
                <CardDescription>Adjust how VotePath AI looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-12 h-6 bg-secondary rounded-full relative transition-colors p-1"
                  >
                    <motion.div
                      animate={{ x: theme === "dark" ? 24 : 0 }}
                      className="w-4 h-4 bg-primary rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Font Size</p>
                  <div className="flex gap-2">
                    {["small", "medium", "large", "xlarge"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={cn(
                          "flex-1 py-2 rounded-xl text-xs font-medium border transition-all",
                          fontSize === size
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Accessibility Section */}
          <section id="accessibility">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accessibility</CardTitle>
                <CardDescription>Features to help make the platform easier to use.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">High Contrast Mode</p>
                      <p className="text-xs text-muted-foreground">Increase visibility for text and elements</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className="w-12 h-6 bg-secondary rounded-full relative transition-colors p-1"
                  >
                    <motion.div
                      animate={{ x: highContrast ? 24 : 0 }}
                      className="w-4 h-4 bg-primary rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Preferred Language</p>
                      <p className="text-xs text-muted-foreground">Currently set to English</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Change Language</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="flex justify-end gap-4">
            <Button variant="ghost">Reset Defaults</Button>
            <Button variant="gradient" onClick={saveSettings}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
