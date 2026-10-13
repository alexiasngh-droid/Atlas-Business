
import Link from "next/link";
import { registry } from "@/lib/internal/systemRegistry";

type LaunchStatus =
  | "Implemented — Testing Required"
  | "In Development"
  | "Not Started"
  | "Review Required";

type LaunchItem = {
  name: string;
  description: string;
  status: LaunchStatus;
  priority: "Critical" | "High" | "Medium";
  systemIds: string[];
};

const launchItems: LaunchItem[] = [
  {
    name: "Authentication & Account Security",
    description:
      "Verify signup, login, session protection, account ownership, and access controls.",
    status: "Review Required",
    priority: "Critical",
    systemIds: ["authentication"],
  },
  {
    name: "Supabase Security & RLS",
    description:
      "Test business isolation, database policies, privileged functions, and authorization.",
    status: "Review Required",
    priority: "Critical",
    systemIds: [
      "authentication",
      "business-onboarding",
      "business-brain",
      "ai-team",
      "atlas-command",
    ],
  },
  {
    name: "Stripe Billing & Subscriptions",
    description:
      "Implement checkout, subscription lifecycle, trials, entitlements, and webhooks.",
    status: "In Development",
    priority: "Critical",
    systemIds: ["billing"],
  },
  {
    name: "Affiliate & Invitation System",
    description:
      "Create personalized invitations, referral tracking, contracts, and commission workflows.",
    status: "In Development",
    priority: "Critical",
    systemIds: ["affiliates"],
  },
  {
    name: "Atlas Business Onboarding",
    description:
      "Complete onboarding, business creation, plan selection, and first-use experience.",
    status: "Implemented — Testing Required",
    priority: "High",
    systemIds: ["business-onboarding", "billing"],
  },
  {
    name: "AI Operations & Cost Controls",
    description:
      "Implement AI usage metering, cost tracking, plan budgets, and abuse protections.",
    status: "In Development",
    priority: "High",
    systemIds: ["ai-team"],
  },
  {
    name: "Integrations & Atlas Assistant",
    description:
      "Develop supported integrations with secure permissions and approved actions.",
    status: "In Development",
    priority: "High",
    systemIds: ["integrations"],
  },
  {
    name: "Legal & Compliance",
    description:
      "Finalize customer terms, privacy policy, affiliate agreements, and legal review.",
    status: "Review Required",
    priority: "Critical",
    systemIds: [],
  },
  {
    name: "Customer Journey Testing",
    description:
      "Test invitation, signup, onboarding, trial, payment, upgrade, downgrade, and cancellation.",
    status: "Not Started",
    priority: "Critical",
    systemIds: [
      "authentication",
      "business-onboarding",
      "billing",
      "affiliates",
    ],
  },
  {
    name: "Production Deployment",
    description:
      "Configure domain, hosting, production environment, monitoring, and deployment checks.",
    status: "Not Started",
    priority: "Critical",
    systemIds: ["atlas-command"],
  },
];

const statusColors: Record<LaunchStatus, string> = {
  "Implemented — Testing Required": "#c5c5c5",
  "In Development": "#d7d7d7",
  "Not Started": "#888888",
  "Review Required": "#ffffff",
};

export default function LaunchReadinessCenter() {
  const criticalItems = launchItems.filter(
    (item) => item.priority === "Critical"
  );

  const inDevelopment = launchItems.filter(
    (item) => item.status === "In Development"
  );

  const reviewRequired = launchItems.filter(
    (item) => item.status === "Review Required"
  );

  const summary = [
    {
      label: "Tracked Workstreams",
      value: launchItems.length,
    },
    {
      label: "Critical Priorities",
      value: criticalItems.length,
    },
    {
      label: "In Development",
      value: inDevelopment.length,
    },
    {
      label: "Review Required",
      value: reviewRequired.length,
    },
  ];

  return (
    <section style={{ marginTop: "48px" }}>
      <div>
        <p
          style={{
            color: "#888888",
            fontSize: "12px",
            letterSpacing: "2px",
          }}
        >
          DEVELOPMENT OPERATIONS
        </p>

        <h2
          style={{
            fontSize: "24px",
            marginTop: "12px",
          }}
        >
          Development & Launch Readiness
        </h2>

        <p
          style={{
            color: "#aaaaaa",
            fontSize: "14px",
            marginTop: "12px",
            lineHeight: "1.7",
          }}
        >
          Track Atlas Business development, outstanding
          security reviews, and launch requirements.
          Target launch: November 9, 2026.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        {summary.map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: "#19191c",
              border: "1px solid #333333",
              borderRadius: "12px",
              padding: "24px",
            }}
          >
            <p
              style={{
                color: "#999999",
                fontSize: "13px",
              }}
            >
              {item.label}
            </p>

            <p
              style={{
                fontSize: "32px",
                marginTop: "12px",
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "#19191c",
          border: "1px solid #333333",
          borderRadius: "12px",
          padding: "28px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h3 style={{ fontSize: "19px" }}>
            Launch Workstreams
          </h3>

          <Link
            href="/internal/registry"
            style={{
              color: "#ffffff",
              fontSize: "13px",
              textDecoration: "underline",
            }}
          >
            Open System Registry →
          </Link>
        </div>

        <p
          style={{
            color: "#888888",
            fontSize: "12px",
            marginTop: "12px",
          }}
        >
          Initial planning assessment — manually maintained.
          System development stages are referenced from the
          shared Global System Registry. Neither source
          represents verified production readiness.
        </p>

        <div style={{ marginTop: "24px" }}>
          {launchItems.map((item) => {
            const relatedSystems = item.systemIds
              .map((id) =>
                registry.find((entry) => entry.id === id)
              )
              .filter(
                (entry): entry is (typeof registry)[number] =>
                  entry !== undefined
              );

            return (
              <div
                key={item.name}
                style={{
                  padding: "20px 0",
                  borderTop: "1px solid #333333",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: "1 1 280px" }}>
                    <h4 style={{ fontSize: "15px" }}>
                      {item.name}
                    </h4>

                    <p
                      style={{
                        color: "#999999",
                        fontSize: "13px",
                        marginTop: "8px",
                        lineHeight: "1.6",
                      }}
                    >
                      {item.description}
                    </p>

                    {relatedSystems.length > 0 && (
                      <div
                        style={{
                          marginTop: "14px",
                          display: "grid",
                          gap: "8px",
                        }}
                      >
                        <p
                          style={{
                            color: "#777777",
                            fontSize: "11px",
                            letterSpacing: "1px",
                          }}
                        >
                          RELATED SYSTEMS
                        </p>

                        {relatedSystems.map((system) => (
                          <div
                            key={system.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: "8px",
                              fontSize: "12px",
                            }}
                          >
                            <span style={{ color: "#aaaaaa" }}>
                              {system.name}
                            </span>

                            <span style={{ color: "#dddddd" }}>
                              {system.development}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        color: statusColors[item.status],
                        fontSize: "12px",
                      }}
                    >
                      {item.status}
                    </p>

                    <p
                      style={{
                        color: "#777777",
                        fontSize: "12px",
                        marginTop: "8px",
                      }}
                    >
                      {item.priority} Priority
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p
        style={{
          color: "#777777",
          fontSize: "12px",
          marginTop: "16px",
          lineHeight: "1.6",
        }}
      >
        Workstream statuses are preliminary planning
        classifications, not verified production readiness.
        A system marked Implemented may still require security
        review, integration testing, and deployment validation.
        Launch blockers must be cleared through implementation,
        testing, and appropriate reviews.
      </p>
    </section>
  );
}
