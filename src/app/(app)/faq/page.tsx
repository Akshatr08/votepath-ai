import type { Metadata } from "next";
import { FAQClient } from "@/components/faq/FAQClient";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to the most common questions about voting and elections.",
};

export default function FAQPage() {
  return <FAQClient />;
}
