import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized election roadmap and AI assistant.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
