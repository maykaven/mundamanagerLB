import Script from 'next/script';

interface StructuredDataProps {
  type: 'website' | 'organization' | 'webpage';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

export function WebsiteStructuredData() {
  return (
    <StructuredData
      type="website"
      data={{
        name: "Linebreakers",
        description: "Necromunda Campaign Manager with AI-powered narrative generation",
        url: "https://github.com/maykaven/mundamanagerLB",
      }}
    />
  );
}

export function OrganizationStructuredData() {
  return (
    <StructuredData
      type="organization"
      data={{
        name: "Linebreakers",
        description: "Necromunda Campaign Manager with AI-powered narrative generation",
        url: "https://github.com/maykaven/mundamanagerLB",
        logo: "/images/logo.png",
        sameAs: [
          "https://github.com/maykaven/mundamanagerLB"
        ]
      }}
    />
  );
} 