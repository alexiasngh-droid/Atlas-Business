"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Business = {
  id: string;
  name: string;
  business_type: string;
};

type Profile = {
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
};

type NavigationSection = {
  label: string;
  items: string[];
};

const coreNavigation: NavigationSection[] = [
  {
    label: "OVERVIEW",
    items: ["HQ", "CEO Brief", "Atlas AI Team"],
  },
  {
    label: "WORK",
    items: ["Goals", "My Tasks", "Ideas"],
  },
  {
    label: "INTELLIGENCE",
    items: ["Atlas News", "Founder's Lab"],
  },
];

const navigationByType: Record<string, NavigationSection[]> = {
  saas_technology: [
    {
      label: "BUSINESS",
      items: [
        "Products",
        "Customers",
        "Affiliates",
        "Subscriptions",
        "Contacts",
        "Business Vault",
      ],
    },
    {
      label: "TECHNOLOGY",
      items: [
        "Product Roadmap",
        "Development",
        "Integrations",
        "Analytics",
      ],
    },
  ],

  creator_media: [
    {
      label: "CREATOR",
      items: [
        "Content Calendar",
        "Content Ideas",
        "Content Pipeline",
        "YouTube",
        "Travel",
        "Brand Deals",
        "Affiliates",
      ],
    },
    {
      label: "BUSINESS",
      items: [
        "Revenue",
        "Expenses",
        "Equipment",
        "Contacts",
        "Business Vault",
      ],
    },
  ],

  ecommerce: [
    {
      label: "COMMERCE",
      items: [
        "Products",
        "Collections",
        "Orders",
        "Customers",
        "Inventory",
        "Fulfillment",
      ],
    },
    {
      label: "BUSINESS",
      items: [
        "Revenue",
        "Expenses",
        "Equipment",
        "Donations",
        "Contacts",
        "Business Vault",
      ],
    },
  ],

  art_creative: [
    {
      label: "CREATIVE",
      items: [
        "Original Art",
        "Photography",
        "Prints",
        "Collections",
        "Content",
      ],
    },
    {
      label: "COMMERCE",
      items: [
        "Products",
        "Orders",
        "Customers",
        "Inventory",
        "Fulfillment",
      ],
    },
    {
      label: "BUSINESS",
      items: [
        "Revenue",
        "Expenses",
        "Equipment",
        "Donations",
        "Business Vault",
      ],
    },
  ],

  nonprofit: [
    {
      label: "NONPROFIT",
      items: [
        "Programs",
        "Partner Organizations",
        "Campaigns",
        "Donations Received",
        "Donations Made",
        "Grants",
        "Fundraising",
        "Impact",
      ],
    },
    {
      label: "ORGANIZATION",
      items: [
        "Revenue",
        "Expenses",
        "Compliance",
        "Contacts",
        "Documents",
        "Business Vault",
      ],
    },
  ],

  professional_services: [
    {
      label: "CLIENTS",
      items: [
        "Clients",
        "Services",
        "Pipeline",
        "Appointments",
        "Contacts",
      ],
    },
    {
      label: "BUSINESS",
      items: [
        "Revenue",
        "Expenses",
        "Subscriptions",
        "Business Vault",
      ],
    },
  ],

  healthcare: [
    {
      label: "PRACTICE",
      items: [
        "Services",
        "Operations",
        "Scheduling",
        "Team",
        "Vendors",
        "Contacts",
      ],
    },
    {
      label: "BUSINESS",
      items: [
        "Revenue",
        "Expenses",
        "Compliance",
        "Subscriptions",
        "Business Vault",
      ],
    },
  ],

  legal: [
    {
      label: "FIRM",
      items: [
        "Services",
        "Clients",
        "Matters",
        "Operations",
        "Team",
        "Contacts",
      ],
    },
    {
      label: "BUSINESS",
      items: [
        "Revenue",
        "Expenses",
        "Compliance",
        "Subscriptions",
        "Business Vault",
      ],
    },
  ],

  affiliate_partnership: [
    {
      label: "PARTNERSHIPS",
      items: [
        "Affiliates",
        "Partners",
        "Campaigns",
        "Conversions",
        "Commissions",
        "Payouts",
      ],
    },
    {
      label: "BUSINESS",
      items: [
        "Revenue",
        "Expenses",
        "Contacts",
        "Business Vault",
      ],
    },
  ],

  general: [
    {
      label: "BUSINESS",
      items: [
        "Products",
        "Revenue",
        "Expenses",
        "Subscriptions",
        "Contacts",
        "Business Vault",
      ],
    },
  ],
};

const typeLabels: Record<string, string> = {
  saas_technology: "Technology",
  creator_media: "Creator & Media",
  ecommerce: "Commerce",
  art_creative: "Creative",
  professional_services: "Professional Services",
  healthcare: "Healthcare",
  legal: "Legal",
  nonprofit: "Nonprofit",
  affiliate_partnership: "Affiliate & Partnerships",
  general: "Business",
};

export default function AtlasHQ() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const businessId = searchParams.get("business");

  const [activePage, setActivePage] = useState("HQ");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusiness, setActiveBusiness] =
    useState<Business | null>(null);

  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadAtlas() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      // Load the profile belonging to the authenticated account.
      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("first_name, last_name, display_name")
          .eq("id", user.id)
          .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError);
      }

      setProfile(profileData);

      // Load only businesses this authenticated user can access.
      // Supabase RLS provides the ownership protection.
      const { data, error } = await supabase
        .from("businesses")
        .select("id, name, business_type")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Business loading error:", error);
        setLoadingBusinesses(false);
        return;
      }

      const loadedBusinesses = data ?? [];

      setBusinesses(loadedBusinesses);

      if (loadedBusinesses.length === 0) {
        router.push("/business/new");
        return;
      }

      const requestedBusiness = loadedBusinesses.find(
        (business) => business.id === businessId
      );

      const selectedBusiness =
        requestedBusiness ?? loadedBusinesses[0];

      setActiveBusiness(selectedBusiness);
      setLoadingBusinesses(false);

      if (!businessId || !requestedBusiness) {
        router.replace(`/hq?business=${selectedBusiness.id}`);
      }
    }

    loadAtlas();
  }, [businessId, router]);

  const accountName =
    profile?.display_name ||
    profile?.first_name ||
    "Account";

  function switchBusiness(business: Business) {
    setActiveBusiness(business);
    setSwitcherOpen(false);
    setActivePage("HQ");

    router.push(`/hq?business=${business.id}`);
  }

  const specializedNavigation =
    navigationByType[
      activeBusiness?.business_type ?? "general"
    ] ?? navigationByType.general;

  const navigation = [
    ...coreNavigation,
    ...specializedNavigation,
  ];

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
          <div className="relative border-b border-black/20">
            <button
              type="button"
              onClick={() =>
                setSwitcherOpen((current) => !current)
              }
              className="flex w-full items-center justify-between px-8 py-5 text-left transition hover:bg-neutral-50"
            >
              <div className="min-w-0">
                <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">
                  {activeBusiness
                    ? typeLabels[
                        activeBusiness.business_type
                      ] ?? "Business"
                    : "Business"}
                </p>

                <p className="mt-1 truncate text-xs">
                  {loadingBusinesses
                    ? "Loading..."
                    : activeBusiness?.name ??
                      "Select Business"}
                </p>
              </div>

              <span
                className={`ml-4 text-xs transition-transform ${
                  switcherOpen ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>

            {switcherOpen && (
              <div className="absolute left-0 top-full z-50 w-full border-b border-r border-black/20 bg-white shadow-sm">
                <div className="max-h-[420px] overflow-y-auto py-2">
                  {businesses.map((business) => {
                    const selected =
                      business.id === activeBusiness?.id;

                    return (
                      <button
                        key={business.id}
                        type="button"
                        onClick={() =>
                          switchBusiness(business)
                        }
                        className="flex w-full items-center justify-between px-8 py-3 text-left text-[11px] transition hover:bg-neutral-50"
                      >
                        <div className="min-w-0">
                          <p className="truncate">
                            {business.name}
                          </p>

                          <p className="mt-1 text-[8px] uppercase tracking-[0.15em] text-neutral-400">
                            {typeLabels[
                              business.business_type
                            ] ?? "Business"}
                          </p>
                        </div>

                        {selected && (
                          <span className="ml-3 text-[9px]">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/business/new")
                  }
                  className="w-full border-t border-black/20 px-8 py-4 text-left text-[9px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
                >
                  + Add Business
                </button>
              </div>
            )}
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 overflow-y-auto px-5 py-7">
            {navigation.map((section) => (
              <div
                key={section.label}
                className="mb-8"
              >
                <p className="mb-3 px-3 text-[8px] font-medium tracking-[0.22em] text-neutral-400">
                  {section.label}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={`${section.label}-${item}`}
                      type="button"
                      onClick={() =>
                        setActivePage(item)
                      }
                      className={`w-full border px-3 py-2.5 text-left text-[11px] transition ${
                        activePage === item
                          ? "border-black bg-black text-white"
                          : "border-transparent hover:border-black/20"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                         <span>{item}</span>

                         {item === "Business Vault" && (
                           <VaultLock />
                           )}
                     </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* LOWER NAVIGATION */}
          <div className="border-t border-black/20 px-5 py-5">
            {[
              "Business Brain",
              "Vacation Mode",
              "Settings",
            ].map((item) => (
              <button
                key={item}
                type="button"
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

          {/* ACCOUNT */}
          <div className="border-t border-black/20 px-8 py-5">
            <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">
              Account
            </p>

            <p className="mt-1 text-xs">
              {accountName}
            </p>
          </div>
        </aside>

        {/* MAIN */}
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[72px] items-center justify-between border-b border-black/20 px-10">
            <p className="text-[10px] uppercase tracking-[0.25em]">
              {activePage}
            </p>

            <div className="flex items-center gap-6">
              <button
                type="button"
                className="text-[10px] uppercase tracking-[0.15em]"
              >
                Search
              </button>

              <button
                type="button"
                className="text-[10px] uppercase tracking-[0.15em]"
              >
                Notifications
              </button>
            </div>
          </header>

          <div className="flex-1 px-10 py-12">
            {activePage === "HQ" &&
            activeBusiness ? (
              <BusinessDashboard
                business={activeBusiness}
                accountName={accountName}
              />
            ) : (
              <PlaceholderPage
                title={activePage}
                businessName={
                  activeBusiness?.name ?? ""
                }
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
function BusinessDashboard({
  business,
  accountName,
}: {
  business: Business;
  accountName: string;
}) {
  switch (business.business_type) {
    case "saas_technology":
      return (
        <TechnologyDashboard
          business={business}
          accountName={accountName}
        />
      );

    case "creator_media":
      return (
        <CreatorDashboard
          business={business}
          accountName={accountName}
        />
      );

    case "ecommerce":
    case "art_creative":
      return (
        <CommerceDashboard
          business={business}
          accountName={accountName}
        />
      );

    case "nonprofit":
      return (
        <NonprofitDashboard
          business={business}
          accountName={accountName}
        />
      );

    default:
      return (
        <GeneralDashboard
          business={business}
          accountName={accountName}
        />
      );
  }
}

function DashboardHeader({
  business,
  description,
  accountName,
}: {
  business: Business;
  description: string;
  accountName: string;
}) {
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="mb-14">
      <div className="mb-3 flex items-center gap-3">
        <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
          {today}
        </p>

        <span className="text-neutral-300">·</span>

        <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
          {typeLabels[business.business_type] ?? "Business"}
        </p>
      </div>

      <h2 className="text-4xl font-light tracking-[-0.03em]">
        {greeting}, {accountName}.
      </h2>

      <p className="mt-4 max-w-2xl text-sm font-light leading-6 text-neutral-500">
        {description}
      </p>
    </div>
  );
}

function TechnologyDashboard({
  business,
  accountName,
}: {
  business: Business;
  accountName: string;
}) {
  return (
    <DashboardShell>
      <DashboardHeader
        business={business}
        accountName={accountName}
        description={`Everything happening across ${business.name}, in one place.`}
      />

      <MetricGrid
        metrics={[
          ["Active Goals", "—"],
          ["Open Tasks", "—"],
          ["Top Priorities", "—"],
          ["Goal Progress", "—"],
        ]}
      />

      <DashboardGrid>
        <DashboardSection
          eyebrow="TODAY"
          title="Your priorities"
          description="The most important work requiring your attention today."
        />

        <DashboardSection
          eyebrow="PRODUCT"
          title="Product development"
          description="Product roadmap, development priorities and upcoming releases."
        />

        <DashboardSection
          eyebrow="GROWTH"
          title="Customers & affiliates"
          description="Customer activity, acquisition and affiliate performance."
        />

        <DashboardSection
          eyebrow="INTELLIGENCE"
          title="Technology intelligence"
          description="Industry developments, competitors and opportunities relevant to your company."
        />
      </DashboardGrid>

      <CEOBrief />
    </DashboardShell>
  );
}

function CreatorDashboard({
  business,
  accountName,
}: {
  business: Business;
  accountName: string;
}) {
  return (
    <DashboardShell>
      <DashboardHeader
        business={business}
        accountName={accountName}
        description={`Your content, partnerships, travel and business activity across ${business.name}.`}
      />

      <MetricGrid
        metrics={[
          ["Content Planned", "—"],
          ["In Production", "—"],
          ["Brand Deals", "—"],
          ["Upcoming Travel", "—"],
        ]}
      />

      <DashboardGrid>
        <DashboardSection
          eyebrow="CONTENT"
          title="Content pipeline"
          description="Ideas, planned content, production and publishing in one place."
        />

        <DashboardSection
          eyebrow="CALENDAR"
          title="What's coming up"
          description="Upcoming content, shoots, travel and publishing deadlines."
        />

        <DashboardSection
          eyebrow="PARTNERSHIPS"
          title="Brand deals & affiliates"
          description="Active partnerships, sponsorships, affiliate activity and deliverables."
        />

        <DashboardSection
          eyebrow="PERFORMANCE"
          title="Channel intelligence"
          description="Content performance and audience insights will appear here."
        />
      </DashboardGrid>

      <CEOBrief />
    </DashboardShell>
  );
}

function CommerceDashboard({
  business,
  accountName,
}: {
  business: Business;
  accountName: string;
}) {
  return (
    <DashboardShell>
      <DashboardHeader
        business={business}
        accountName={accountName}
        description={`Products, creative work, customers and operations across ${business.name}.`}
      />

      <MetricGrid
        metrics={[
          ["Products", "—"],
          ["Open Orders", "—"],
          ["Revenue", "—"],
          ["Donations", "—"],
        ]}
      />

      <DashboardGrid>
        <DashboardSection
          eyebrow="ORDERS"
          title="Orders & fulfillment"
          description="Track orders from purchase through production and fulfillment."
        />

        <DashboardSection
          eyebrow="CREATIVE"
          title="Art & photography"
          description="Manage original work, photography, prints and future collections."
        />

        <DashboardSection
          eyebrow="CUSTOMERS"
          title="Customers"
          description="Customer relationships, purchases and collector information."
        />

        <DashboardSection
          eyebrow="IMPACT"
          title="Product donations"
          description="Track products connected to charitable commitments and organizations."
        />
      </DashboardGrid>

      <CEOBrief />
    </DashboardShell>
  );
}

function NonprofitDashboard({
  business,
  accountName,
}: {
  business: Business;
  accountName: string;
}) {
  return (
    <DashboardShell>
      <DashboardHeader
        business={business}
        accountName={accountName}
        description={`Programs, funding, partnerships and impact across ${business.name}.`}
      />

      <MetricGrid
        metrics={[
          ["Active Programs", "—"],
          ["Partner Organizations", "—"],
          ["Funds Received", "—"],
          ["Funds Distributed", "—"],
        ]}
      />

      <DashboardGrid>
        <DashboardSection
          eyebrow="PROGRAMS"
          title="Programs & initiatives"
          description="Track active programs, future initiatives and their progress."
        />

        <DashboardSection
          eyebrow="FUNDING"
          title="Donations & grants"
          description="Monitor donations received, grants and funding activity."
        />

        <DashboardSection
          eyebrow="PARTNERS"
          title="Organizations"
          description="Manage nonprofit partners, sanctuaries and organizations you support."
        />

        <DashboardSection
          eyebrow="IMPACT"
          title="Impact"
          description="Track where funds go and the outcomes connected to your mission."
        />
      </DashboardGrid>

      <CEOBrief />
    </DashboardShell>
  );
}

function GeneralDashboard({
  business,
  accountName,
}: {
  business: Business;
  accountName: string;
}) {
  return (
    <DashboardShell>
      <DashboardHeader
        business={business}
        accountName={accountName}
        description={`Everything happening across ${business.name}, in one place.`}
      />

      <MetricGrid
        metrics={[
          ["Active Goals", "—"],
          ["Open Tasks", "—"],
          ["Top Priorities", "—"],
          ["Goal Progress", "—"],
        ]}
      />

      <DashboardGrid>
        <DashboardSection
          eyebrow="TODAY"
          title="Your priorities"
          description="Atlas will surface the work that matters most today."
        />

        <DashboardSection
          eyebrow="ROADMAP"
          title="Goal roadmaps"
          description="See the path from your active goals to completion."
        />

        <DashboardSection
          eyebrow="GOALS"
          title="Active goals"
          description="Track the outcomes you're currently working toward."
        />

        <DashboardSection
          eyebrow="INTELLIGENCE"
          title="Atlas News"
          description="Important developments across your industry and competitors."
        />
      </DashboardGrid>

      <CEOBrief />
    </DashboardShell>
  );
}
function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1400px]">
      {children}
    </div>
  );
}

function MetricGrid({
  metrics,
}: {
  metrics: [string, string][];
}) {
  return (
    <div className="grid grid-cols-4 border border-black/20">
      {metrics.map(([title, value], index) => (
        <Metric
          key={title}
          title={title}
          value={value}
          last={index === metrics.length - 1}
        />
      ))}
    </div>
  );
}

function DashboardGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-10">
      {children}
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
    <div
      className={`p-6 ${
        last ? "" : "border-r border-black/20"
      }`}
    >
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

function CEOBrief() {
  return (
    <div className="mt-10 border border-black/20 p-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[8px] uppercase tracking-[0.25em] text-neutral-400">
            DAILY CEO BRIEF
          </p>

          <h3 className="mt-3 text-xl font-light">
            Your business at a glance.
          </h3>

          <p className="mt-3 max-w-2xl text-xs font-light leading-5 text-neutral-500">
            Atlas will prepare a concise daily brief covering
            priorities, goals, risks, opportunities and decisions
            requiring your attention.
          </p>
        </div>

        <button
          type="button"
          className="border border-black px-5 py-3 text-[9px] uppercase tracking-[0.18em] transition hover:bg-black hover:text-white"
        >
          View Brief
        </button>
      </div>
    </div>
  );
}

function PlaceholderPage({
  title,
  businessName,
}: {
  title: string;
  businessName: string;
}) {
  return (
    <div className="mx-auto max-w-[1400px]">
      <p className="mb-3 text-[9px] uppercase tracking-[0.3em] text-neutral-400">
        {businessName || "Atlas Business"}
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
function VaultLock() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 opacity-60"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="1"
      />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}