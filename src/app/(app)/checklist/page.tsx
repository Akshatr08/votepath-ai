import type { Metadata } from "next";
import { ChecklistClient } from "@/components/checklist/ChecklistClient";

export const metadata: Metadata = {
  title: "My Checklist",
  description: "Your personalized voter checklist — track every step.",
};

export default function ChecklistPage() {
  return <ChecklistClient />;
}
