
export type DevelopmentStatus =
  | "Designed"
  | "Implemented"
  | "Tested"
  | "Production-ready";

export type RegistryEntry = {
  id: string;
  name: string;
  description: string;
  category: string;
  frontend: string[];
  database: string[];
  backend: string[];
  subscription: string;
  development: DevelopmentStatus;
  security: string;
  notes: string;
};

export const registry: RegistryEntry[] = [
  {
    id: "authentication",
    name: "Authentication & Profiles",
    description: "User authentication, profiles, and session management.",
    category: "Accounts & Auth",
    frontend: [
      "src/app/signup/page.tsx",
      "src/app/forgot-password/page.tsx",
      "src/app/reset-password/page.tsx",
    ],
    database: ["profiles", "auth.users"],
    backend: ["handle_new_user", "src/lib/supabase/proxy.ts"],
    subscription: "All plans",
    development: "Implemented",
    security: "Requires fresh-signup and authorization testing",
    notes: "Existing Supabase authentication infrastructure.",
  },
  {
    id: "business-onboarding",
    name: "Business Onboarding",
    description: "Business creation, setup, and account ownership.",
    category: "Accounts & Auth",
    frontend: [
      "src/app/onboarding/business/page.tsx",
      "src/app/business/new/page.tsx",
    ],
    database: [
      "businesses",
      "business_members",
      "onboarding_progress",
    ],
    backend: ["create_initial_business"],
    subscription: "All plans",
    development: "Implemented",
    security: "Owner membership repaired; end-to-end tests pending",
    notes: "Business creation and membership workflows.",
  },
  {
    id: "atlas-hq",
    name: "Atlas HQ",
    description: "Main business dashboard and operating workspace.",
    category: "Core Products",
    frontend: ["src/app/hq/page.tsx"],
    database: ["businesses", "business_members"],
    backend: ["Not fully mapped"],
    subscription: "All plans",
    development: "Implemented",
    security: "Requires access-control verification",
    notes: "Customer-facing headquarters.",
  },
  {
    id: "business-brain",
    name: "Business Brain",
    description: "Business context, memory, and company information.",
    category: "Business Brain",
    frontend: ["src/app/brain/page.tsx"],
    database: ["business_brains", "company_memory"],
    backend: ["Not fully mapped"],
    subscription: "Plan capabilities to verify",
    development: "Implemented",
    security: "Business isolation requires testing",
    notes: "Business-specific knowledge and memory.",
  },
  {
    id: "ai-team",
    name: "AI Team",
    description: "AI agents, conversations, messages, and work execution.",
    category: "AI Operations",
    frontend: [
      "src/app/team/page.tsx",
      "src/app/team/[agentId]/page.tsx",
    ],
    database: [
      "ai_agents",
      "ai_conversations",
      "ai_messages",
      "agent_work",
      "agent_collaborations",
    ],
    backend: [
      "provision_ai_team",
      "create_agent_conversation",
      "add_agent_message",
      "add_user_agent_message",
      "create_agent_work",
    ],
    subscription: "Executive",
    development: "Implemented",
    security: "Entitlement enforcement and agent-authenticity review needed",
    notes: "Existing database functions require security refinements.",
  },
  {
    id: "billing",
    name: "Subscriptions & Entitlements",
    description: "Plans, trials, subscriptions, and access permissions.",
    category: "Billing & Finance",
    frontend: ["src/app/onboarding/plan/page.tsx"],
    database: ["subscriptions", "business_entitlements"],
    backend: ["Stripe integration not yet verified"],
    subscription: "All plans",
    development: "Designed",
    security: "Server-side entitlements and webhook validation pending",
    notes: "Database foundation exists; live billing is not connected.",
  },
  {
    id: "goals-projects",
    name: "Goals, Projects & Tasks",
    description: "Business planning, milestones, and task management.",
    category: "Core Products",
    frontend: ["Not yet mapped"],
    database: ["Not yet verified"],
    backend: ["Not yet mapped"],
    subscription: "To be finalized",
    development: "Designed",
    security: "Pending implementation",
    notes: "Planned core Atlas Business workflows.",
  },
  {
    id: "integrations",
    name: "Integrations & Atlas Assistant",
    description: "Connected services, OAuth, synchronization, and actions.",
    category: "Integrations",
    frontend: ["Not yet mapped"],
    database: ["Not yet verified"],
    backend: ["Not yet mapped"],
    subscription: "Plan-dependent",
    development: "Designed",
    security: "OAuth scopes, token storage, and approvals pending",
    notes: "Gmail, Calendar, QuickBooks, Zoom, and other services.",
  },
  {
    id: "affiliates",
    name: "Affiliate & Invitation System",
    description: "Creator invitations, referrals, commissions, and outreach.",
    category: "Growth & Affiliates",
    frontend: ["Not yet mapped"],
    database: ["Not yet verified"],
    backend: ["Not yet mapped"],
    subscription: "Internal / affiliate",
    development: "Designed",
    security: "Referral attribution and payout validation pending",
    notes: "Required before the outreach launch.",
  },
  {
    id: "atlas-command",
    name: "Atlas Command",
    description: "Founder-only internal management and system registry.",
    category: "Database & Code",
    frontend: [
      "src/app/internal/page.tsx",
      "src/app/internal/layout.tsx",
      "src/app/internal/registry/page.tsx",
    ],
    database: ["Existing Supabase infrastructure"],
    backend: ["Founder authorization in internal layout"],
    subscription: "Founder-only",
    development: "Implemented",
    security: "Second-account access test and API authorization pending",
    notes: "Internal dashboard foundation; no live monitoring yet.",
  },
];

