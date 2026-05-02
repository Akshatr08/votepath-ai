"use client";

import { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SUPPORTED_COUNTRIES, INDIA_STATES, US_STATES } from "@/constants";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { updateUserProfile } from "@/lib/firestore";
import toast from "react-hot-toast";
import { OnboardingSchema } from "@/lib/validators";

import { OnboardingData } from "@/types";

// Schema moved to validators.ts

interface OnboardingWizardProps {
  onComplete: () => void;
}

const STEPS = [
  { title: "Your Location", description: "Help us show relevant election info for your region." },
  { title: "Your Profile", description: "A bit about you so we can personalize your journey." },
  { title: "Your Preferences", description: "How would you like to receive information?" },
];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuthContext();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm<OnboardingData>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      country: "IN",
      state: "",
      age: 0,
      isFirstTimeVoter: false,
      votingMethod: "both",
      preferredLanguage: "en",
    },
  });

  const selectedCountry = useWatch({
    control,
    name: "country",
  });
  const stateOptions = selectedCountry === "IN" ? INDIA_STATES : selectedCountry === "US" ? US_STATES : [];

  const STEP_FIELDS: (keyof OnboardingData)[][] = [
    ["country", "state"],
    ["age", "isFirstTimeVoter"],
    ["votingMethod", "preferredLanguage"],
  ];

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (data: OnboardingData) => {
    if (!user) { onComplete(); return; }
    setSubmitting(true);
    try {
      await updateUserProfile(user.uid, { ...data, onboardingComplete: true });
      toast.success("Profile saved! Your journey is personalised.");
      onComplete();
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 id="onboarding-title" className="font-bold text-lg">
              Quick Setup ({step + 1}/{STEPS.length})
            </h2>
            <button
              onClick={onComplete}
              aria-label="Close onboarding"
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          {/* Progress */}
          <div className="flex gap-1.5" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label="Onboarding progress">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-primary" : "bg-secondary"}`}
              />
            ))}
          </div>
          <div className="mt-3">
            <p className="font-semibold text-sm">{STEPS[step].title}</p>
            <p className="text-xs text-muted-foreground">{STEPS[step].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-6 space-y-4 min-h-48">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="country" className="text-sm font-medium mb-1.5 block">Country</label>
                      <select
                        id="country"
                        {...register("country")}
                        className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-describedby={errors.country ? "country-error" : undefined}
                      >
                        {SUPPORTED_COUNTRIES.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                      {errors.country && <p id="country-error" className="text-destructive text-xs mt-1">{errors.country.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="state" className="text-sm font-medium mb-1.5 block">State / Region</label>
                      {stateOptions.length > 0 ? (
                        <select
                          id="state"
                          {...register("state")}
                          className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          aria-describedby={errors.state ? "state-error" : undefined}
                        >
                          <option value="">Select state…</option>
                          {stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <input
                          id="state"
                          type="text"
                          {...register("state")}
                          placeholder="Enter your state or region"
                          className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      )}
                      {errors.state && <p id="state-error" className="text-destructive text-xs mt-1">{errors.state.message}</p>}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="age" className="text-sm font-medium mb-1.5 block">Your Age</label>
                      <input
                        id="age"
                        type="number"
                        min={1}
                        max={120}
                        {...register("age")}
                        placeholder="e.g. 24"
                        className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        aria-describedby={errors.age ? "age-error" : undefined}
                      />
                      {errors.age && <p id="age-error" className="text-destructive text-xs mt-1">{errors.age.message}</p>}
                    </div>
                    <div>
                      <fieldset>
                        <legend className="text-sm font-medium mb-2">Is this your first time voting?</legend>
                        <div className="flex gap-3">
                          {[
                            { label: "Yes, first time!", value: "true" },
                            { label: "No, I've voted before", value: "false" },
                          ].map((opt) => (
                            <label key={opt.value} htmlFor={`voter-${opt.value}`} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                id={`voter-${opt.value}`}
                                value={opt.value}
                                {...register("isFirstTimeVoter")}
                                className="accent-primary"
                              />
                              <span className="text-sm">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <fieldset>
                        <legend className="text-sm font-medium mb-2">Voting method preference</legend>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "online", label: "Online" },
                            { value: "offline", label: "In Person" },
                            { value: "both", label: "Both" },
                          ].map((opt) => (
                            <label key={opt.value} htmlFor={`method-${opt.value}`} className="flex items-center justify-center gap-2 cursor-pointer border border-border rounded-xl py-2.5 px-3 text-sm hover:border-primary/50 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                              <input type="radio" id={`method-${opt.value}`} value={opt.value} {...register("votingMethod")} className="sr-only" />
                              {opt.label}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                    <div>
                      <label htmlFor="language" className="text-sm font-medium mb-2 block">Preferred Language</label>
                      <select
                        id="language"
                        {...register("preferredLanguage")}
                        className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                      </select>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              disabled={step === 0}
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={handleNext} aria-label="Next step">
                Next
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="gradient"
                disabled={submitting}
                aria-label="Complete onboarding"
              >
                {submitting ? "Saving…" : "Complete Setup"}
                <Check className="w-4 h-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
