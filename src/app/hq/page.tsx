"use client";

import { useState } from "react";

const navigation = [
  {
    label: "OVERVIEW",
    items: ["HQ", "CEO Brief", "Atlas AI Team"],
  },
  {
    label: "WORK",
    items: ["Goals", "Projects", "Tasks", "Sprints", "Future Ideas"],
  },
  {
    label: "INTELLIGENCE",
    items: ["Atlas News", "Founder's Lab"],
  },
  {
    label: "BUSINESS",
    items: [
      "Products",
      "Business Vault",
      "Subscriptions",
      "Contacts",
      "Affiliates",
      "Philanthropy",
    ],
  },
];

export default function AtlasHQ() {
  const [activePage, setActivePage] = useState("HQ");

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="flex w-[260px] shrink-0 flex-col border-r border-black/20 bg-white">

          {/* BRAND */}
          <div className="border-b border-black/20 px-8 py-8">
            <p className="text-[9px] uppercase tracking-[0.45em]">
              Atlas
            </p>

            <h1 className="mt-1 text-xl font-light tracking-tight">
              Business
            </h1>
          </div>

          {/* BUSINESS SWITCHER */}
          <button className="flex w-full items-center justify-between border-b border-black/20 px-8 py-5 text-left">
            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">
                Business
              </p>

              <p className="mt-1 text-xs">
                Atlas AI Systems
              </p>
            </div>

            <span className="text-xs">⌄</span>
          </button>

          {/* NAVIGATION */}
          <nav className="flex-1 overflow-y-auto px-5 py-7">
            {navigation.map((section) => (
              <div key={section.label} className="mb-8">

                <p className="mb-3 px-3 text-[8px] font-medium tracking-[0.22em] text-neutral-400">
                  {section.label}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActivePage(item)}
                      className={`w-full border px-3 py-2.5 text-left text-[11px] transition ${
                        activePage === item
                          ? "border-black bg-black text-white"
                          : "border-transparent hover:border-black/20"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

              </div>
            ))}
          </nav>

          {/* LOWER NAVIGATION */}
          <div className="border-t border-black/20 px-5 py-5">
            {["Business Brain", "Vacation Mode", "Settings"].map((item) => (
              <button
                key={item}
                onClick={() => setActivePage(item)}
                className={`mb-1 w-full border px-3 py-2.5 text-left text-[11px] transition ${
                  activePage === item
                    ? "border-black bg-black text-white"
                    : "border-transparent hover:border-black/20"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* PROFILE */}
          <div className="border-t border-black/20 px-8 py-5">
            <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">
              Account
            </p>

            <p className="mt-1 text-xs">
              Alexia
            </p>
          </div>
        </aside>

        {/* MAIN APP */}
        <section className="flex min-w-0 flex-1 flex-col">

          {/* TOP BAR */}
          <header className="flex h-[72px] items-center justify-between border-b border-black/20 px-10">
            <p className="text-[10px] uppercase tracking-[0.25em]">
              {activePage}
            </p>

            <div className="flex items-center gap-6">
              <button className="text-[10px] uppercase tracking-[0.15em]">
                Search
              </button>

              <button className="text-[10px] uppercase tracking-[0.15em]">
                Notifications
              </button>
            </div>
          </header>

          {/* PAGE */}
          <div className="flex-1 px-10 py-12">

            {activePage === "HQ" ? (
              <HQDashboard />
            ) : (
              <PlaceholderPage title={activePage} />
            )}

          </div>
        </section>
      </div>
    </main>
  );
}

function HQDashboard() {
  return (
    <div className="mx-auto max-w-[1400px]">

      {/* INTRO */}
      <div className="mb-14">
        <p className="mb-3 text-[9px] uppercase tracking-[0.3em] text-neutral-400">
          Sunday · September 21
        </p>

        <h2 className="text-4xl font-light tracking-[-0.03em]">
          Good afternoon, Alexia.
        </h2>

        <p className="mt-4 max-w-2xl text-sm font-light leading-6 text-neutral-500">
          Everything happening across Atlas AI Systems, in one place.
        </p>
      </div>

      {/* BUSINESS SNAPSHOT */}
      <div className="grid grid-cols-4 border border-black/20">
        <Metric title="Active Goals" value="—" />
        <Metric title="Active Projects" value="—" />
        <Metric title="Open Tasks" value="—" />
        <Metric title="Current Sprint" value="—" last />
      </div>

      {/* MAIN GRID */}
      <div className="mt-10 grid grid-cols-2 gap-10">

        <DashboardSection
          eyebrow="TODAY"
          title="Your priorities"
          description="Atlas will surface the work that matters most today."
        />

        <DashboardSection
          eyebrow="SPRINT"
          title="Current sprint"
          description="Your active sprint and progress will appear here."
        />

        <DashboardSection
          eyebrow="GOALS"
          title="Active goals"
          description="Track the outcomes you're currently working toward."
        />

        <DashboardSection
          eyebrow="INTELLIGENCE"
          title="Atlas News"
          description="Important developments across your industries and competitors."
        />

      </div>

      {/* CEO BRIEF */}
      <div className="mt-10 border border-black/20 p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-neutral-400">
              DAILY CEO BRIEF
            </p>

            <h3 className="mt-3 text-xl font-light">
              Your company at a glance.
            </h3>

            <p className="mt-3 max-w-2xl text-xs font-light leading-5 text-neutral-500">
              Once your Business Brain is active, Atlas will prepare a concise
              daily brief covering priorities, projects, risks, opportunities,
              and decisions requiring your attention.
            </p>
          </div>

          <button className="border border-black px-5 py-3 text-[9px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-white">
            View Brief
          </button>
        </div>
      </div>

    </div>
  );
}

function Metric({
  title,
  value,
  last = false,
}: {
  title: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div className={`p-6 ${last ? "" : "border-r border-black/20"}`}>
      <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">
        {title}
      </p>

      <p className="mt-4 text-2xl font-light">
        {value}
      </p>
    </div>
  );
}

function DashboardSection({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-[190px] border border-black/20 p-7">
      <p className="text-[8px] uppercase tracking-[0.25em] text-neutral-400">
        {eyebrow}
      </p>

      <h3 className="mt-4 text-lg font-light">
        {title}
      </h3>

      <p className="mt-3 max-w-md text-xs font-light leading-5 text-neutral-500">
        {description}
      </p>

      <div className="mt-8 border-t border-black/10 pt-4">
        <p className="text-[9px] uppercase tracking-[0.18em] text-neutral-300">
          No data yet
        </p>
      </div>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-[1400px]">
      <p className="mb-3 text-[9px] uppercase tracking-[0.3em] text-neutral-400">
        Atlas Business
      </p>

      <h2 className="text-4xl font-light tracking-[-0.03em]">
        {title}
      </h2>

      <div className="mt-12 border-t border-black/20 pt-8">
        <p className="text-sm font-light text-neutral-400">
          This workspace is ready to be built.
        </p>
      </div>
    </div>
  );
}