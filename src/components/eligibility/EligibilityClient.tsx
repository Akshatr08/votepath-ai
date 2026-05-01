"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { EligibilityResult } from "@/types";
import Link from "next/link";

const EligibilitySchema = z.object({
  age: z.coerce.number().int().min(1, "Age is required").max(120, "Please enter a valid age"),
  isCitizen: z.boolean(),
  isResident: z.boolean(),
  region: z.string().min(2, "Please enter your region"),
  residencyStatus: z.enum(["citizen", "permanent_resident", "temporary_resident", "other"]),
});

type EligibilityFormData = z.infer<typeof EligibilitySchema>;

export function EligibilityClient() {
  const [result, setResult] = useState<(EligibilityResult & { disclaimer: string }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<EligibilityFormData>({
    resolver: zodResolver(EligibilitySchema),
    defaultValues: {
      isCitizen: true,
      isResident: true,
      residencyStatus: "citizen",
    },
  });

  // Remove unused isCitizen watch

  const onSubmit = async (data: EligibilityFormData) => {
    setLoading(true);
    setApiError(null);
    setResult(null);
    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? "Check failed");
      setResult(json.data);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-green-500" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-extrabold mb-3">
          Eligibility <span className="gradient-text">Checker</span>
        </h1>
        <p className="text-muted-foreground">
          Find out if you&apos;re eligible to vote and get your personalized next steps.
        </p>
      </motion.div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate aria-label="Eligibility check form">
            {/* Age */}
            <div>
              <label htmlFor="elig-age" className="text-sm font-medium mb-1.5 block">Your Age <span aria-hidden="true">*</span></label>
              <input
                id="elig-age"
                type="number"
                min={1}
                max={120}
                {...register("age")}
                placeholder="e.g. 22"
                aria-required="true"
                aria-describedby={errors.age ? "elig-age-error" : undefined}
                className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.age && <p id="elig-age-error" role="alert" className="text-destructive text-xs mt-1">{errors.age.message}</p>}
            </div>

            {/* Region */}
            <div>
              <label htmlFor="elig-region" className="text-sm font-medium mb-1.5 block">State / Region <span aria-hidden="true">*</span></label>
              <input
                id="elig-region"
                type="text"
                {...register("region")}
                placeholder="e.g. Maharashtra, California"
                aria-required="true"
                aria-describedby={errors.region ? "elig-region-error" : undefined}
                className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {errors.region && <p id="elig-region-error" role="alert" className="text-destructive text-xs mt-1">{errors.region.message}</p>}
            </div>

            {/* Residency Status */}
            <div>
              <label htmlFor="elig-residency" className="text-sm font-medium mb-1.5 block">Residency Status</label>
              <select
                id="elig-residency"
                {...register("residencyStatus")}
                onChange={(e) => {
                  // The value is already handled by react-hook-form's register
                  console.log("Status changed to:", e.target.value);
                }}
                className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="citizen">Citizen</option>
                <option value="permanent_resident">Permanent Resident</option>
                <option value="temporary_resident">Temporary Resident</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Checkboxes */}
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium mb-2">Confirm your status</legend>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="elig-citizen"
                  {...register("isCitizen")}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-sm">I am a citizen (or eligible non-citizen) of this country</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="elig-resident"
                  {...register("isResident")}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-sm">I am currently residing at a registered address in this region</span>
              </label>
            </fieldset>

            {apiError && (
              <div role="alert" className="flex items-center gap-2 p-3 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {apiError}
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={loading}
              id="check-eligibility-btn"
              aria-label="Check my eligibility"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Checking…</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  Check My Eligibility
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
            role="region"
            aria-label="Eligibility result"
            aria-live="polite"
          >
            <Card className={result.eligible ? "border-green-500/40" : "border-destructive/40"}>
              <CardContent className="p-6">
                {/* Result Header */}
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-border">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${result.eligible ? "bg-green-500/10" : "bg-destructive/10"}`}>
                    {result.eligible
                      ? <CheckCircle2 className="w-7 h-7 text-green-500" aria-hidden="true" />
                      : <XCircle className="w-7 h-7 text-destructive" aria-hidden="true" />
                    }
                  </div>
                  <div>
                    <h2 className={`text-xl font-extrabold ${result.eligible ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                      {result.eligible ? "Likely Eligible ✓" : "Not Currently Eligible"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Confidence: <span className="font-medium capitalize">{result.confidence}</span>
                    </p>
                  </div>
                </div>

                {/* Reasons */}
                <div className="mb-5">
                  <h3 className="text-sm font-bold mb-2">Assessment</h3>
                  <ul className="space-y-1.5" role="list">
                    {result.reasons.map((r, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" aria-hidden="true" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div className="mb-5">
                  <h3 className="text-sm font-bold mb-2">Next Steps</h3>
                  <ol className="space-y-1.5 list-none">
                    {result.nextSteps.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="font-bold text-primary shrink-0">{i + 1}.</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Disclaimer */}
                <div className="p-3 rounded-xl bg-warning/5 border border-warning/20 text-xs text-muted-foreground">
                  {result.disclaimer}
                </div>

                {result.eligible && (
                  <div className="mt-4 flex gap-3">
                    <Button asChild variant="gradient" size="sm" className="flex-1">
                      <Link href="/dashboard">Start Journey</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href="/locator">Find Polling Booth</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
