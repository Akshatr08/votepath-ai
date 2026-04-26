import type { Metadata } from "next";
import { LocatorClient } from "@/components/locator/LocatorClient";

export const metadata: Metadata = {
  title: "Polling Locator",
  description: "Find polling booths, election offices, and help centers near you.",
};

export default function LocatorPage() {
  return <LocatorClient />;
}
