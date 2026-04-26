import type { Metadata } from "next";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata: Metadata = {
  title: "Settings & Accessibility",
  description: "Customize your VotePath AI experience with accessibility options.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
