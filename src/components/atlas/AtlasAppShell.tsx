"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";


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


type AtlasAppShellProps = {
  pageTitle: string;
  children: ReactNode;
};


const coreNavigation:
  NavigationSection[] = [
    {
      label: "OVERVIEW",
      items: [
        "HQ",
        "CEO Brief",
        "Atlas AI Team",
      ],
    },
    {
      label: "WORK",
      items: [
        "Goals",
        "My Tasks",
        "Ideas",
      ],
    },
    {
      label: "INTELLIGENCE",
      items: [
        "Atlas News",
        "Founder's Lab",
      ],
    },
  ];


const navigationByType:
  Record<
    string,
    NavigationSection[]
  > = {

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


const typeLabels:
  Record<string, string> = {
    saas_technology:
      "Technology",

    creator_media:
      "Creator & Media",

    ecommerce:
      "Commerce",

    art_creative:
      "Creative",

    professional_services:
      "Professional Services",

    healthcare:
      "Healthcare",

    legal:
      "Legal",

    nonprofit:
      "Nonprofit",

    affiliate_partnership:
      "Affiliate & Partnerships",

    general:
      "Business",
  };


function routeForItem(
  item: string,
  businessId: string
) {
  if (item === "HQ") {
    return `/hq?business=${businessId}`;
  }

  if (
    item === "Atlas AI Team"
  ) {
    return `/team?business=${businessId}`;
  }

  if (
    item === "Business Brain"
  ) {
    return `/brain?business=${businessId}`;
  }

  return `/hq?business=${businessId}&page=${encodeURIComponent(
    item
  )}`;
}


export default function AtlasAppShell({
  pageTitle,
  children,
}: AtlasAppShellProps) {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const [
    supabase,
  ] = useState(() =>
    createClient()
  );


  const businessId =
    searchParams.get(
      "business"
    );


  const [
    businesses,
    setBusinesses,
  ] =
    useState<Business[]>([]);


  const [
    activeBusiness,
    setActiveBusiness,
  ] =
    useState<Business | null>(
      null
    );


  const [
    profile,
    setProfile,
  ] =
    useState<Profile | null>(
      null
    );


  const [
    switcherOpen,
    setSwitcherOpen,
  ] =
    useState(false);


  const [
    loadingBusinesses,
    setLoadingBusinesses,
  ] =
    useState(true);


  useEffect(() => {
    async function loadShell() {
      const {
        data: {
          user,
        },

        error:
          userError,
      } =
        await supabase.auth
          .getUser();


      if (userError) {
        console.error(
          "Auth error:",
          userError
        );
      }


      if (!user) {
        router.replace(
          "/"
        );

        return;
      }


      const {
        data:
          profileData,

        error:
          profileError,
      } =
        await supabase
          .from(
            "profiles"
          )
          .select(
            "first_name, last_name, display_name"
          )
          .eq(
            "id",
            user.id
          )
          .maybeSingle();


      if (
        profileError
      ) {
        console.error(
          "Profile error:",
          profileError
        );
      }


      setProfile(
        profileData
      );


      const {
        data:
          businessData,

        error:
          businessError,
      } =
        await supabase
          .from(
            "businesses"
          )
          .select(
            "id, name, business_type"
          )
          .order(
            "created_at",
            {
              ascending:
                true,
            }
          );


      if (
        businessError
      ) {
        console.error(
          "Business loading error:",
          businessError
        );

        setLoadingBusinesses(
          false
        );

        return;
      }


      const loadedBusinesses =
        businessData ?? [];


      setBusinesses(
        loadedBusinesses
      );


      if (
        loadedBusinesses.length ===
        0
      ) {
        router.push(
          "/business/new"
        );

        return;
      }


      const requestedBusiness =
        loadedBusinesses.find(
          (
            business
          ) =>
            business.id ===
            businessId
        );


      const selectedBusiness =
        requestedBusiness ??
        loadedBusinesses[0];


      setActiveBusiness(
        selectedBusiness
      );


      setLoadingBusinesses(
        false
      );


      if (!businessId) {
        router.replace(
          `/hq?business=${selectedBusiness.id}`
        );
      }
    }


    loadShell();

  }, [
    businessId,
    router,
    supabase,
  ]);


  const accountName =
    profile?.display_name ||
    profile?.first_name ||
    "Account";


  const specializedNavigation =
    navigationByType[
      activeBusiness
        ?.business_type ??
        "general"
    ] ??
    navigationByType
      .general;


  const navigation = [
    ...coreNavigation,
    ...specializedNavigation,
  ];


  function switchBusiness(
    business: Business
  ) {
    setActiveBusiness(
      business
    );

    setSwitcherOpen(
      false
    );

    router.push(
      `/hq?business=${business.id}`
    );
  }


  function navigate(
    item: string
  ) {
    if (
      !activeBusiness
    ) {
      return;
    }


    router.push(
      routeForItem(
        item,
        activeBusiness.id
      )
    );
  }


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
                setSwitcherOpen(
                  (
                    current
                  ) =>
                    !current
                )
              }
              className="flex w-full items-center justify-between px-8 py-5 text-left transition hover:bg-neutral-50"
            >

              <div className="min-w-0">

                <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">

                  {activeBusiness
                    ? typeLabels[
                        activeBusiness
                          .business_type
                      ] ??
                      "Business"
                    : "Business"}

                </p>


                <p className="mt-1 truncate text-xs">

                  {loadingBusinesses
                    ? "Loading..."
                    : activeBusiness
                        ?.name ??
                      "Select Business"}

                </p>

              </div>


              <span
                className={`ml-4 text-xs transition-transform ${
                  switcherOpen
                    ? "rotate-180"
                    : ""
                }`}
              >
                ⌄
              </span>

            </button>


            {switcherOpen && (

              <div className="absolute left-0 top-full z-50 w-full border-b border-r border-black/20 bg-white shadow-sm">

                <div className="max-h-[420px] overflow-y-auto py-2">

                  {businesses.map(
                    (
                      business
                    ) => {
                      const selected =
                        business.id ===
                        activeBusiness
                          ?.id;


                      return (
                        <button
                          key={
                            business.id
                          }
                          type="button"
                          onClick={() =>
                            switchBusiness(
                              business
                            )
                          }
                          className="flex w-full items-center justify-between px-8 py-3 text-left text-[11px] transition hover:bg-neutral-50"
                        >

                          <div className="min-w-0">

                            <p className="truncate">
                              {
                                business.name
                              }
                            </p>

                            <p className="mt-1 text-[8px] uppercase tracking-[0.15em] text-neutral-400">

                              {typeLabels[
                                business
                                  .business_type
                              ] ??
                                "Business"}

                            </p>

                          </div>


                          {selected && (
                            <span className="ml-3 text-[9px]">
                              ✓
                            </span>
                          )}

                        </button>
                      );
                    }
                  )}

                </div>


                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/business/new"
                    )
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

            {navigation.map(
              (
                section
              ) => (

                <div
                  key={
                    section.label
                  }
                  className="mb-8"
                >

                  <p className="mb-3 px-3 text-[8px] font-medium tracking-[0.22em] text-neutral-400">
                    {
                      section.label
                    }
                  </p>


                  <div className="space-y-1">

                    {section.items.map(
                      (
                        item
                      ) => {

                        const selected =
                          pageTitle ===
                            item ||
                          (
                            item ===
                              "Atlas AI Team" &&
                            [
                              "CEO / Strategy",
                              "Marketing",
                              "Sales",
                              "Operations",
                              "Research & Intelligence",
                            ].includes(
                              pageTitle
                            )
                          );


                        return (
                          <button
                            key={`${section.label}-${item}`}
                            type="button"
                            onClick={() =>
                              navigate(
                                item
                              )
                            }
                            className={`w-full border px-3 py-2.5 text-left text-[11px] transition ${
                              selected
                                ? "border-black bg-black text-white"
                                : "border-transparent hover:border-black/20"
                            }`}
                          >

                            <span className="flex items-center gap-2">

                              <span>
                                {
                                  item
                                }
                              </span>


                              {item ===
                                "Business Vault" && (
                                <VaultLock />
                              )}

                            </span>

                          </button>
                        );
                      }
                    )}

                  </div>

                </div>
              )
            )}

          </nav>


          {/* LOWER NAVIGATION */}

          <div className="border-t border-black/20 px-5 py-5">

            {[
              "Business Brain",
              "Vacation Mode",
              "Settings",
            ].map(
              (
                item
              ) => (

                <button
                  key={
                    item
                  }
                  type="button"
                  onClick={() =>
                    navigate(
                      item
                    )
                  }
                  className={`mb-1 w-full border px-3 py-2.5 text-left text-[11px] transition ${
                    pageTitle ===
                    item
                      ? "border-black bg-black text-white"
                      : "border-transparent hover:border-black/20"
                  }`}
                >
                  {item}
                </button>

              )
            )}


            <div className="mt-5 border-t border-black/10 pt-5">

              <button
                type="button"
                onClick={
                  async () => {
                    await supabase
                      .auth
                      .signOut();

                    router.push(
                      "/"
                    );

                    router.refresh();
                  }
                }
                className="w-full border border-transparent px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.18em] text-neutral-400 transition hover:border-black/20 hover:text-black"
              >
                Log Out
              </button>

            </div>

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


          {/* PERMANENT TOP BAR */}

          <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-black/20 px-10">

            <p className="text-[10px] uppercase tracking-[0.25em]">
              {pageTitle}
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


          {/* PAGE CONTENT */}

          <div className="min-w-0 flex-1">
            {children}
          </div>

        </section>

      </div>

    </main>
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