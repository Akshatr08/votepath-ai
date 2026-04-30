import Link from "next/link";
import { Vote, Mail, Shield, ExternalLink } from "lucide-react";
import { APP_NAME, APP_TAGLINE, NAV_LINKS } from "@/constants";

const Github = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);

const Twitter = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const FOOTER_LINKS = {
  Product: NAV_LINKS,
  Resources: [
    { href: "/faq", label: "FAQ" },
    { href: "https://eci.gov.in", label: "Election Commission of India" },
    { href: "https://vote.gov", label: "vote.gov (USA)" },
  ],
  Legal: [
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Accessibility" },
  ],
};

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-border bg-card/50 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 w-fit">
              <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Vote className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <span className="font-bold text-lg gradient-text">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {APP_TAGLINE}
            </p>
            <p className="text-xs text-muted-foreground mt-3 flex items-start gap-1.5">
              <Shield className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" aria-hidden="true" />
              All election information is neutral and non-partisan. Always verify
              with official election authorities.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
              >
                <Twitter className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="mailto:hello@votepath.ai"
                aria-label="Email us"
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-4">{category}</h3>
              <ul className="space-y-2.5" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                      {link.href.startsWith("http") && (
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VotePath AI. Built for the PromptWars Hackathon.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-md">Gemini AI</span>
            <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-md">Firebase</span>
            <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-md">Google Maps</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
