import { Link } from "wouter";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border/60 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Top grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-lg text-foreground">
              InfraAlert
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Building better cities through citizen participation.
            </p>
            <p className="text-xs text-muted-foreground">
              A civic-tech platform to report, track, and resolve local
              infrastructure issues.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/report" className="footer-link">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link href="/issues" className="footer-link">
                  Explore Issues
                </Link>
              </li>
              <li>
                <Link href="/map" className="footer-link">
                  Live Map
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="footer-link">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">
              Community
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/how-it-works" className="footer-link">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/categories" className="footer-link">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/process" className="footer-link">
                  Resolution Process
                </Link>
              </li>
              <li>
                <Link href="/impact" className="footer-link">
                  Community Impact
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-sm text-foreground mb-4">
              Connect
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Github className="h-4 w-4 text-muted-foreground" />
                <a
                  href="https://github.com/nehatabassum572"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  GitHub
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                <a
                  href="https://www.linkedin.com/in/nehatabassum572/"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href="mailto:support@infraalert.dev"
                  className="footer-link"
                >
                  support@infraalert.dev
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/60 my-10" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 InfraAlert. Built with love for smarter cities.</p>
          <p className="text-center sm:text-right">
            A student-led civic technology project.
          </p>
        </div>
      </div>
    </footer>
  );
}
