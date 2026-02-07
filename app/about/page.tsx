import AboutMundaManager from "@/components/munda-manager-info/about-munda-manager";
import { Metadata } from "next";

const defaultUrl = process.env.NODE_ENV === 'development'
  ? "http://localhost:3000"
  : "https://www.mundamanager.com";

const PAGE_TITLE = 'About Linebreakers - Necromunda Campaign Manager';
const PAGE_DESCRIPTION = 'Learn about Linebreakers, a Necromunda campaign manager with AI-powered narrative generation. Built on Munda Manager.';
const PAGE_KEYWORDS = 'Linebreakers, Necromunda, gang management, campaign tool, AI narratives, about, Games Workshop';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: PAGE_KEYWORDS,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${defaultUrl}/about`,
    type: 'website',
    siteName: 'Linebreakers',
  },
  twitter: {
    card: 'summary',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  alternates: {
    canonical: `${defaultUrl}/about`,
  },
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="container ml-[10px] mr-[10px] max-w-4xl w-full space-y-4">
        <div className="bg-card shadow-md rounded-lg p-4">
          <h1 className="text-xl md:text-2xl font-bold mb-4">About Linebreakers</h1>
          <AboutMundaManager />
        </div>
      </div>
    </main>
  );
}
