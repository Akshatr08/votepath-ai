"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, ArrowRight, Clock } from "lucide-react";
import type { RoadmapStep } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface RoadmapCardProps {
  step: RoadmapStep;
  index: number;
}

const STATUS_CONFIG = {
  completed: {
    icon: CheckCircle2,
    iconClass: "text-green-500",
    cardClass: "border-green-500/30 bg-green-500/5",
    badge: "Completed",
    badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400",
  },
  in_progress: {
    icon: Circle,
    iconClass: "text-blue-500",
    cardClass: "border-blue-500/40 bg-blue-500/5 glow-blue",
    badge: "In Progress",
    badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  available: {
    icon: Circle,
    iconClass: "text-primary",
    cardClass: "border-primary/30 hover:border-primary/60",
    badge: "Ready",
    badgeClass: "bg-primary/15 text-primary",
  },
  locked: {
    icon: Lock,
    iconClass: "text-muted-foreground",
    cardClass: "border-border opacity-60",
    badge: "Locked",
    badgeClass: "bg-secondary text-muted-foreground",
  },
};

export function RoadmapCard({ step, index }: RoadmapCardProps) {
  const config = STATUS_CONFIG[step.status];
  const Icon = config.icon;
  const isClickable = step.status !== "locked";

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div
        className={cn(
          "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
          config.cardClass,
          isClickable && "hover:shadow-md"
        )}
        role="article"
        aria-label={`Step ${step.step}: ${step.title} — ${config.badge}`}
      >
        {/* Step Number */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-sm font-bold shrink-0">
          {step.step}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-sm truncate">{step.title}</h3>
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium shrink-0", config.badgeClass)}>
              {config.badge}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{step.description}</p>
          {step.estimatedTime && (
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" aria-hidden="true" />
              {step.estimatedTime}
            </div>
          )}
        </div>

        {/* Icon & Action */}
        <div className="flex items-center gap-2 shrink-0">
          <Icon className={cn("w-5 h-5", config.iconClass)} aria-hidden="true" />
          {isClickable && step.actionHref && (
            <Link href={step.actionHref} aria-label={step.actionLabel}>
              <ArrowRight className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
