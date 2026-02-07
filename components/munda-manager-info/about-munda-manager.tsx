import type { JSX } from "react";

type FAQItem = {
  q: string;
  a: string | JSX.Element;
};

export default function AboutMundaManager() {
  const githubUrl = "https://github.com/maykaven/mundamanagerLB";

  const faqItems: FAQItem[] = [
    {
      q: "Is there a cost to use Linebreakers?",
      a: "Linebreakers is free to use! It's built on top of the open-source Munda Manager project and adds AI-powered narrative generation, Discord bot integration, and a custom Hive theme."
    },
    {
      q: "How can I provide feedback or request features?",
      a: <>Open an issue on our <a href={githubUrl} className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">GitHub repository</a> and let us know what you think! Feature requests, suggestions, and bug reports are all welcome.</>
    },
    {
      q: "Can I report a bug or technical issue?",
      a: <>Absolutely! Head over to our <a href={`${githubUrl}/issues`} className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">GitHub Issues</a> page and describe what's going wrong. We'll look into it.</>
    },
    {
      q: "Is my data safe?",
      a: "Your data is stored securely. While gangs and campaigns can be shared publicly, your account information and personal details remain private."
    },
    {
      q: "What makes Linebreakers different from Munda Manager?",
      a: "Linebreakers is a fork of Munda Manager that adds AI-powered narrative generation for your campaigns and battles, a Discord bot for notifications and timeline events, and a grimdark Hive theme. All the core gang and campaign management features from Munda Manager are included."
    }
  ];

  return (
    <div className="space-y-6">
      <section>
        <p className="text-muted-foreground">
          Linebreakers is a Necromunda campaign and gang management tool with AI-powered narrative generation. It's built on top of the excellent open-source <a href="https://www.mundamanager.com" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">Munda Manager</a> project, adding features like AI storytelling, Discord bot integration, and a grimdark Hive theme.
        </p>
        <p className="text-muted-foreground mt-3">
          Track your gangs, log battles, manage campaigns, and watch AI-generated narratives bring your Underhive stories to life. Whether you're an Arbitrator running a full campaign or a player juggling multiple gangs, Linebreakers gives you the tools to keep everything organised.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Key Features</h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Full gang and campaign management (from Munda Manager)</li>
          <li>AI-powered battle narratives and campaign storytelling</li>
          <li>Discord bot for battle notifications and campaign timelines</li>
          <li>Grimdark Hive theme alongside light and dark modes</li>
          <li>Interactive weapon trait and skill tooltips</li>
          <li>Territory art for all territory types</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Open Source</h2>
        <p className="text-muted-foreground">
          Linebreakers is open source. Check out the code and contribute on{' '}
          <a
            href={githubUrl}
            className="underline hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">FAQ</h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index}>
              <h3 className="font-semibold text-foreground mb-1">{index + 1}. {item.q}</h3>
              <div className="text-muted-foreground">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Disclaimer</h2>
        <p className="text-muted-foreground text-sm">
          Linebreakers is an independent fan-made tool designed to assist users in playing Necromunda, a game published by Games Workshop Group PLC. This project is not affiliated with, endorsed by, or associated with Games Workshop.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Copyright Information</h2>
        <p className="text-muted-foreground text-sm">
          Games Workshop, Citadel, Black Library, Forge World, Warhammer, Warhammer 40,000, the &apos;Aquila&apos; Double-headed Eagle logo, Space Marine, 40K, 40,000, Warhammer Age of Sigmar, Battletome, Stormcast Eternals, Warhammer: The Horus Heresy, the &apos;winged-hammer&apos; Warhammer logo, White Dwarf, Blood Bowl, Necromunda, Space Hulk, Battlefleet Gothic, Mordheim, Inquisitor, and all associated logos, illustrations, images, names, creatures, races, vehicles, locations, weapons, characters, and the distinctive likenesses thereof are either &reg; or TM, and/or &copy; Games Workshop Limited, variably registered around the world. All Rights Reserved.
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Content on Linebreakers is not meant, and does not, constitute a challenge to any rights possessed by any intellectual property holder.
        </p>
      </section>
    </div>
  );
}
