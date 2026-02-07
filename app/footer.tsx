import Link from 'next/link';
import Image from 'next/image';
import { FaDiscord, FaGithub } from "react-icons/fa6";

const SITE_DESCRIPTION = "Necromunda Campaign Manager with AI-powered narrative generation";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border shadow-md print:hidden">
      <div className="max-w-5xl mx-auto pl-6 pr-[10px] md:px-[10px] py-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/images/logo.png"
                alt="Linebreakers"
                width={36}
                height={36}
                className="rounded"
              />
              <span className="text-lg font-bold">Linebreakers</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {SITE_DESCRIPTION}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              Bringing the Underhive to life
            </p>
          </div>

          {/* Resources Section */}
          <nav className="flex flex-col gap-2" aria-label="Footer navigation">
            <h3 className="text-sm font-semibold mb-1">Resources</h3>
            <div className="flex flex-col gap-2">
              <Link href="/user-guide" prefetch={false} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                User Guide
              </Link>
              <Link href="/about" prefetch={false} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
            </div>
          </nav>

          {/* Social Icons Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold mb-1">Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/maykaven/mundamanagerLB"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="View our GitHub repository"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} Linebreakers</span>
            <span className="text-muted-foreground">/</span>
            <span>Based on <a href="https://www.mundamanager.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Munda Manager</a></span>
            <span className="text-muted-foreground">/</span>
            <Link href="/terms" prefetch={false} className="text-muted-foreground hover:text-primary transition-colors">
              Terms
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/privacy-policy" prefetch={false} className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
