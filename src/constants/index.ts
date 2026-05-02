/**
 * Application-wide constants.
 *
 * Contains all static data used across the platform including navigation links,
 * region lists, roadmap steps, checklist items, timeline events, FAQ entries,
 * myths/facts, and rate-limit configuration.
 *
 * @module constants
 */

import type { ChecklistItem, FAQItem, MythFact, RoadmapStep, TimelineEvent } from "@/types";

// ─── App ─────────────────────────────────────────────────────────────────────

/** Display name of the application. */
export const APP_NAME = "VotePath AI";

/** Primary tagline shown in the hero section and metadata. */
export const APP_TAGLINE = "Understand Elections Clearly. Vote Confidently.";

/** Short application description used in SEO metadata. */
export const APP_DESCRIPTION =
  "Personalized guidance for registration, voting steps, timelines, and election day.";

// ─── Countries & Regions ─────────────────────────────────────────────────────

/** Countries supported by the onboarding wizard. */
export const SUPPORTED_COUNTRIES = [
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
];

export const INDIA_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh",
];

export const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

// ─── Default Roadmap ─────────────────────────────────────────────────────────

/** Step-by-step voter journey roadmap displayed on the dashboard. */
export const DEFAULT_ROADMAP_STEPS: readonly RoadmapStep[] = [
  {
    id: "step-1",
    step: 1,
    title: "Check Your Eligibility",
    description: "Verify your age, citizenship, and residency requirements for your region.",
    status: "available",
    estimatedTime: "5 min",
    actionLabel: "Check Eligibility",
    actionHref: "/eligibility",
  },
  {
    id: "step-2",
    step: 2,
    title: "Register Before Deadline",
    description: "Complete your voter registration with the required documents.",
    status: "locked",
    estimatedTime: "15 min",
    actionLabel: "Start Registration",
    actionHref: "/checklist",
  },
  {
    id: "step-3",
    step: 3,
    title: "Verify Your Voter ID",
    description: "Confirm your voter identification is valid and up to date.",
    status: "locked",
    estimatedTime: "10 min",
    actionLabel: "Verify ID",
    actionHref: "/checklist",
  },
  {
    id: "step-4",
    step: 4,
    title: "Locate Your Polling Booth",
    description: "Find your nearest polling station and note the timings.",
    status: "locked",
    estimatedTime: "3 min",
    actionLabel: "Find Location",
    actionHref: "/locator",
  },
  {
    id: "step-5",
    step: 5,
    title: "Vote on Election Day",
    description: "Exercise your democratic right. Bring your ID and required documents.",
    status: "locked",
    estimatedTime: "30–60 min",
    actionLabel: "Prepare for Voting",
    actionHref: "/timeline",
  },
  {
    id: "step-6",
    step: 6,
    title: "Track Election Results",
    description: "Follow official channels for accurate and timely results.",
    status: "locked",
    estimatedTime: "Ongoing",
    actionLabel: "Learn More",
    actionHref: "/faq",
  },
];

// ─── Default Checklist ───────────────────────────────────────────────────────

/** Default checklist items for new users who haven't saved a personalized list. */
export const DEFAULT_CHECKLIST_ITEMS: readonly ChecklistItem[] = [
  {
    id: "chk-1",
    title: "Verify Voter Eligibility",
    description: "Confirm you meet age, citizenship, and residency requirements.",
    status: "pending",
    category: "registration",
  },
  {
    id: "chk-2",
    title: "Gather Required Documents",
    description: "Collect proof of identity, address, and citizenship.",
    status: "pending",
    category: "documents",
  },
  {
    id: "chk-3",
    title: "Complete Voter Registration",
    description: "Register online or at your local election office.",
    status: "pending",
    category: "registration",
  },
  {
    id: "chk-4",
    title: "Receive Voter Card / Confirmation",
    description: "Wait for and verify your official voter registration card.",
    status: "pending",
    category: "registration",
  },
  {
    id: "chk-5",
    title: "Find Your Polling Booth",
    description: "Locate your assigned polling station and note directions.",
    status: "pending",
    category: "polling",
  },
  {
    id: "chk-6",
    title: "Know Election Day Hours",
    description: "Check opening and closing times for your polling station.",
    status: "pending",
    category: "election_day",
  },
  {
    id: "chk-7",
    title: "Prepare What to Bring",
    description: "Pack your voter ID, any required forms, and a mask if needed.",
    status: "pending",
    category: "election_day",
  },
  {
    id: "chk-8",
    title: "Cast Your Vote",
    description: "Visit your polling booth and cast your ballot.",
    status: "pending",
    category: "election_day",
  },
];

// ─── Timeline Events ──────────────────────────────────────────────────────────

/** Illustrative election timeline milestones. Dates are examples — users should verify with authorities. */
export const TIMELINE_EVENTS: readonly TimelineEvent[] = [
  {
    id: "tl-1",
    title: "Voter Registration Opens",
    description: "Official voter registration portal opens. Eligible citizens can register online or at designated offices.",
    date: "Jan 15, 2025",
    status: "completed",
    icon: "UserCheck",
    category: "registration",
  },
  {
    id: "tl-2",
    title: "Candidate Filing Deadline",
    description: "Last date for eligible candidates to file nomination papers with the Election Commission.",
    date: "Feb 28, 2025",
    status: "completed",
    icon: "FileText",
    category: "campaign",
  },
  {
    id: "tl-3",
    title: "Voter Registration Deadline",
    description: "Final date to register as a voter. After this date, new registrations will not be accepted.",
    date: "Mar 15, 2025",
    status: "completed",
    icon: "Calendar",
    category: "registration",
  },
  {
    id: "tl-4",
    title: "Campaign Period Begins",
    description: "Official campaign period starts. Candidates may begin public campaigning and outreach activities.",
    date: "Mar 20, 2025",
    status: "completed",
    icon: "Megaphone",
    category: "campaign",
  },
  {
    id: "tl-5",
    title: "Early Voting Starts",
    description: "Early voting locations open for registered voters who cannot vote on election day.",
    date: "Apr 25, 2025",
    status: "active",
    icon: "Vote",
    category: "voting",
  },
  {
    id: "tl-6",
    title: "Election Day",
    description: "Main election day. Polling booths are open for all registered voters to cast their ballots.",
    date: "May 12, 2025",
    status: "upcoming",
    icon: "Flag",
    category: "voting",
  },
  {
    id: "tl-7",
    title: "Vote Counting Begins",
    description: "Official ballot counting begins under election commission supervision.",
    date: "May 13, 2025",
    status: "upcoming",
    icon: "BarChart2",
    category: "results",
  },
  {
    id: "tl-8",
    title: "Official Results Declared",
    description: "Election commission announces final, certified results.",
    date: "May 20, 2025",
    status: "upcoming",
    icon: "Award",
    category: "results",
  },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

/** Curated frequently asked questions covering registration, documents, eligibility, and voting. */
export const FAQ_DATA: readonly FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I register to vote?",
    answer:
      "You can register to vote online through your country's official election commission website, in person at designated election offices, or by mail. You'll need to provide proof of identity, address, and citizenship. Registration deadlines vary by region, so check early.",
    category: "Registration",
  },
  {
    id: "faq-2",
    question: "What ID do I need to vote?",
    answer:
      "Accepted ID varies by region but typically includes a government-issued photo ID such as a driver's license, passport, or official voter card. Some regions accept utility bills or bank statements as proof of address. Check your local election authority for the complete list.",
    category: "Documents",
  },
  {
    id: "faq-3",
    question: "Can students vote?",
    answer:
      "Yes, students who meet the age and citizenship requirements can vote. Students may vote at their home address or, depending on local rules, at the address where they currently reside for studies. You'll need to ensure you're registered at the correct address.",
    category: "Eligibility",
  },
  {
    id: "faq-4",
    question: "How does absentee voting work?",
    answer:
      "Absentee or postal voting allows registered voters to cast ballots without visiting a polling station. You must typically apply in advance, citing a valid reason (travel, disability, etc.). Your region's election office will mail you a ballot to complete and return before the deadline.",
    category: "Voting Methods",
  },
  {
    id: "faq-5",
    question: "What happens on voting day?",
    answer:
      "On election day, bring your voter ID to your assigned polling station during open hours. Poll workers will verify your identity and registration, provide a ballot, and direct you to a private voting booth. Mark your ballot, submit it, and receive a confirmation. The entire process usually takes 15–30 minutes.",
    category: "Election Day",
  },
  {
    id: "faq-6",
    question: "Can I vote after moving to a new address?",
    answer:
      "If you've moved, you may need to update your voter registration with your new address before the registration deadline. Some regions allow provisional voting while your registration update is processed. Contact your local election office to understand the rules for your area.",
    category: "Registration",
  },
  {
    id: "faq-7",
    question: "Is my vote private?",
    answer:
      "Yes. Ballots in most democratic countries are secret. No one — not poll workers, election officials, or government agencies — can see how you voted. The ballot system is designed to separate your identity from your vote after verification.",
    category: "Privacy",
  },
  {
    id: "faq-8",
    question: "What if I make a mistake on my ballot?",
    answer:
      "If you make a mistake before submitting your ballot, you can typically request a new ballot (called a spoiled ballot) from poll workers. Once a ballot is submitted, it generally cannot be changed. If using an electronic voting machine, review your selections carefully before final submission.",
    category: "Election Day",
  },
];

// ─── Myths vs Facts ───────────────────────────────────────────────────────────

/** Common voting myths paired with factual corrections for voter education. */
export const MYTHS_FACTS: readonly MythFact[] = [
  {
    id: "mf-1",
    myth: "My vote is public and people can see how I voted.",
    fact: "Ballots are completely private. The secret ballot system ensures no one can link your identity to your voting choice.",
  },
  {
    id: "mf-2",
    myth: "Students cannot vote if they study away from home.",
    fact: "Students can vote, but they may need to register at either their home or study address depending on their region's rules.",
  },
  {
    id: "mf-3",
    myth: "One vote doesn't make a difference.",
    fact: "Many elections have been decided by very small margins. Every vote is counted and contributes to the final result.",
  },
  {
    id: "mf-4",
    myth: "You need to be highly educated to vote.",
    fact: "Voting is a universal right for eligible citizens regardless of education level. The process is designed to be accessible to everyone.",
  },
  {
    id: "mf-5",
    myth: "If you miss the registration deadline, you can still vote on election day.",
    fact: "In most regions, you must be registered before the deadline to vote. Some areas offer same-day registration — check your local rules.",
  },
  {
    id: "mf-6",
    myth: "Voting takes hours and is very complicated.",
    fact: "The voting process is typically quick — most voters are done in 15–30 minutes, including any wait time.",
  },
];

// ─── Nav Links ───────────────────────────────────────────────────────────────

/** Primary navigation links rendered in the Navbar and Footer. */
export const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/timeline", label: "Timeline" },
  { href: "/eligibility", label: "Eligibility" },
  { href: "/locator", label: "Polling Locator" },
  { href: "/faq", label: "FAQ" },
  { href: "/checklist", label: "My Checklist" },
];

// ─── Rate Limiting ────────────────────────────────────────────────────────────

/** Maximum API requests allowed per rate-limit window. */
export const RATE_LIMIT_REQUESTS = 10;

/** Rate-limit sliding window duration in milliseconds (1 minute). */
export const RATE_LIMIT_WINDOW_MS = 60 * 1000;
