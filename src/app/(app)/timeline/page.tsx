import type { Metadata } from "next";
import { TimelineClient } from "@/components/timeline/TimelineClient";

export const metadata: Metadata = {
  title: "Election Timeline",
  description: "Interactive election lifecycle — from registration to results.",
};

export default function TimelinePage() {
  return <TimelineClient />;
}
