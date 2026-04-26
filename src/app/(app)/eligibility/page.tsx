import type { Metadata } from "next";
import { EligibilityClient } from "@/components/eligibility/EligibilityClient";

export const metadata: Metadata = {
  title: "Eligibility Checker",
  description: "Check if you're eligible to vote and get personalized next steps.",
};

export default function EligibilityPage() {
  return <EligibilityClient />;
}
