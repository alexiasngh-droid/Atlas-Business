
import LaunchReadinessCenter from "@/components/internal/launch/LaunchReadinessCenter";

const departments = [
  {
    name: "CEO Overview",
    description: "Revenue, users, uptime, and alerts",
  },
  {
    name: "Accounts & Auth",
    description: "Signup, profiles, and onboarding",
  },
  {
    name: "Security Center",
    description: "Access, RLS, and audit events",
  },
  {
    name: "Database & Code",
    description: "Schema, GitHub, and architecture",
  },
  {
    name: "AI Operations",
    description: "Agents, conversations, and usage",
  },
  {
    name: "Business Brain",
    description: "Context, memory, and data flow",
  },
  {
    name: "Billing & Finance",
    description: "Stripe, trials, and revenue",
  },
  {
    name: "Core Products",
    description: "HQ, goals, projects, and tasks",
  },
  {
    name: "Integrations",
    description: "OAuth, syncs, and assistant actions",
  },
  {
    name: "Growth & Affiliates",
    description: "Invites, referrals, and prospects",
  },
  {
    name: "Legal & Compliance",
    description: "Policies, IP, and agreements",
  },
  {
    name: "Customer Journey",
    description: "Funnel, testing, and support",
  },
];

const metrics = [
  "Revenue",
  "Customers",
  "System Health",
  "Open Alerts",
];

export default function AtlasCommandHome() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0b0b0d",
        color: "#ffffff",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <header>
          <p
            style={{
              color: "#999999",
              fontSize: "12px",
              letterSpacing: "3px",
            }}
          >
            ATLAS AI SYSTEMS / INTERNAL
          </p>

          <h1
            style={{
              fontSize: "42px",
              marginTop: "20px",
            }}
          >
            Atlas Command
          </h1>

          <p
            style={{
              color: "#aaaaaa",
              marginTop: "8px",
            }}
          >
            Founder & CEO Control Center
          </p>
        </header>

        <section style={{ marginTop: "48px" }}>
          <h2 style={{ fontSize: "24px" }}>
            CEO Overview
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {metrics.map((metric) => (
              <div
                key={metric}
                style={{
                  backgroundColor: "#19191c",
                  border: "1px solid #333333",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <p
                  style={{
                    color: "#aaaaaa",
                    fontSize: "13px",
                  }}
                >
                  {metric}
                </p>

                <p
                  style={{
                    fontSize: "32px",
                    marginTop: "12px",
                  }}
                >
                  —
                </p>

                <p
                  style={{
                    color: "#888888",
                    fontSize: "12px",
                    marginTop: "8px",
                  }}
                >
                  Awaiting live data
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: "48px" }}>
          <h2 style={{ fontSize: "24px" }}>
            Departments
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {departments.map((department) => (
              <div
                key={department.name}
                style={{
                  backgroundColor: "#19191c",
                  border: "1px solid #333333",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <h3 style={{ fontSize: "17px" }}>
                  {department.name}
                </h3>

                <p
                  style={{
                    color: "#999999",
                    fontSize: "13px",
                    marginTop: "12px",
                  }}
                >
                  {department.description}
                </p>

                <p
                  style={{
                    color: "#777777",
                    fontSize: "12px",
                    marginTop: "20px",
                  }}
                >
                  Module foundation
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            backgroundColor: "#19191c",
            border: "1px solid #333333",
            borderRadius: "12px",
            padding: "28px",
            marginTop: "48px",
          }}
        >
          <h2 style={{ fontSize: "24px" }}>
            Global System Registry
          </h2>

          <p
            style={{
              color: "#aaaaaa",
              fontSize: "14px",
              marginTop: "16px",
              lineHeight: "1.7",
            }}
          >
            Central architecture registry for every
            Atlas Business feature, including frontend
            components, Supabase tables, backend
            functions, subscription requirements,
            security reviews, development progress,
            dependencies, and GitHub documentation.
          </p>

          <p
            style={{
              color: "#888888",
              fontSize: "13px",
              marginTop: "20px",
            }}
          >
            Status: Registry foundation planned
          </p>
        </section>

<LaunchReadinessCenter />

        <footer
          style={{
            marginTop: "48px",
            paddingTop: "24px",
            borderTop: "1px solid #333333",
            color: "#777777",
            fontSize: "12px",
          }}
        >
          Atlas AI Systems — Internal Administration
        </footer>
      </div>
    </main>
  );
}
