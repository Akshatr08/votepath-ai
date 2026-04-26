"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { TIMELINE_EVENTS } from "@/constants";
import type { TimelineEvent } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<TimelineEvent["category"], string> = {
  registration: "bg-blue-500",
  campaign: "bg-purple-500",
  voting: "bg-green-500",
  results: "bg-orange-500",
};

const STATUS_ICONS = {
  completed: CheckCircle2,
  active: AlertCircle,
  upcoming: Clock,
};

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isLeft = index % 2 === 0;
  const StatusIcon = STATUS_ICONS[event.status];

  return (
    <div ref={ref} className={cn("relative flex items-center gap-8", isLeft ? "flex-row" : "flex-row-reverse")}>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1"
      >
        <div
          className={cn(
            "p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
            event.status === "completed" && "border-green-500/30 bg-green-500/5",
            event.status === "active" && "border-blue-500/50 bg-blue-500/8 glow-blue",
            event.status === "upcoming" && "border-border bg-card opacity-80"
          )}
          role="article"
          aria-label={`${event.title}: ${event.status}`}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", CATEGORY_COLORS[event.category])} aria-hidden="true" />
              <span className="text-xs font-medium text-muted-foreground capitalize">{event.category}</span>
            </div>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                event.status === "completed" && "bg-green-500/15 text-green-600 dark:text-green-400",
                event.status === "active" && "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                event.status === "upcoming" && "bg-secondary text-muted-foreground"
              )}
            >
              {event.status === "active" ? "Happening Now" : event.status === "completed" ? "Completed" : "Upcoming"}
            </span>
          </div>
          <h3 className="font-bold text-base mb-1">{event.title}</h3>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{event.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            <time dateTime={event.date}>{event.date}</time>
          </div>
        </div>
      </motion.div>

      {/* Center Node */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={cn(
          "w-12 h-12 rounded-full border-4 border-background flex items-center justify-center shrink-0 z-10",
          event.status === "completed" && "bg-green-500",
          event.status === "active" && "bg-blue-500 animate-pulse",
          event.status === "upcoming" && "bg-secondary border-border"
        )}
        aria-hidden="true"
      >
        <StatusIcon className={cn("w-5 h-5", event.status === "upcoming" ? "text-muted-foreground" : "text-white")} />
      </motion.div>

      {/* Spacer for the other side */}
      <div className="flex-1 hidden sm:block" />
    </div>
  );
}

export function TimelineClient() {
  const categories = ["registration", "campaign", "voting", "results"] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold mb-3">
          Election <span className="gradient-text">Timeline</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          The full election lifecycle — from voter registration to final results. Track every important milestone.
        </p>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-2 text-sm">
            <span className={cn("w-3 h-3 rounded-full", CATEGORY_COLORS[cat])} aria-hidden="true" />
            <span className="capitalize text-muted-foreground">{cat}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative" aria-label="Election timeline" role="feed">
        {/* Vertical Line */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-border to-border -translate-x-1/2 hidden sm:block"
        />

        <div className="space-y-8">
          {TIMELINE_EVENTS.map((event, i) => (
            <TimelineItem key={event.id} event={event} index={i} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 p-4 rounded-xl border border-warning/30 bg-warning/5 text-sm text-center"
        role="note"
      >
        ⚠️ Dates shown are illustrative examples. Always verify current election dates with your official election authority.
      </motion.div>
    </div>
  );
}
