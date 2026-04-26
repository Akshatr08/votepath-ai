import Link from "next/link";
import { Vote, Twitter, Github, Mail, Shield, ExternalLink } from "lucide-react";
import { APP_NAME, APP_TAGLINE, NAV_LINKS } from "@/constants";

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
