
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LaunchReadinessCenter from "@/components/internal/launch/LaunchReadinessCenter";

export const dynamic = "force-dynamic";

const launchDate = "2027-01-11T00:00:00";

const departments = [
  { name: "CEO Overview", description: "Revenue, users, uptime, and alerts" },
  { name: "Accounts & Auth", description: "Signup, profiles, and onboarding" },
  { name: "Security Center", description: "Access, RLS, and audit events" },
  { name: "Database & Code", description: "Schema, GitHub, and architecture" },
  { name: "AI Operations", description: "Agents, conversations, and usage" },
  { name: "Business Brain", description: "Context, memory, and data flow" },
  { name: "Billing & Finance", description: "Stripe, trials, and revenue" },
  { name: "Core Products", description: "HQ, goals, projects, and tasks" },
  { name: "Integrations", description: "OAuth, syncs, and assistant actions" },
  { name: "Growth & Affiliates", description: "Invites, referrals, and prospects" },
  { name: "Legal & Compliance", description: "Policies, IP, and agreements" },
  { name: "Customer Journey", description: "Funnel, testing, and support" },
];

const metrics = ["Revenue", "Customers", "System Health", "Open Alerts"];

type LaunchTask = {
  id: string;
  department: string;
  status: string;
  priority: string;
};

const cardStyle = {
  backgroundColor: "#19191c",
  border: "1px solid #333333",
  borderRadius: "12px",
  padding: "24px",
};

function isDone(status: string) {
  return status === "Completed" || status === "Verified";
}

export default async function AtlasCommandHome() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("atlas_launch_tasks")
    .select("id, department, status, priority");

  const tasks: LaunchTask[] = error ? [] : (data ?? []);

  const total = tasks.length;
  const done = tasks.filter((task) => isDone(task.status)).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const criticalRemaining = tasks.filter(
    (task) => task.priority === "Critical" && !isDone(task.status)
  ).length;

  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(launchDate).getTime() - Date.now()) / 86400000
    )
  );

  const progress = total ? Math.round((done / total) * 100) : 0;

  const launchStats = [
    {
      label: "Launch progress",
      value: `${done} / ${total}`,
      detail: `${progress}% completed or verified`,
    },
    {
      label: "In progress",
      value: String(inProgress),
      detail: "Tasks currently underway",
    },
    {
      label: "Critical remaining",
      value: String(criticalRemaining),
      detail: "Critical tasks not yet complete",
    },
    {
      label: "Days to launch",
      value: String(daysLeft),
      detail: "Target launch: 1.11.27",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0b0b0d",
        color: "#ffffff",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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

          <h1 style={{ fontSize: "42px", marginTop: "20px" }}>
            Atlas Command
          </h1>

          <p style={{ color: "#aaaaaa", marginTop: "8px" }}>
            Founder & CEO Control Center
          </p>
        </header>

        <section style={{ marginTop: "48px" }}>
          <h2 style={{ fontSize: "24px" }}>CEO Overview</h2>

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
              <div key={metric} style={cardStyle}>
                <p style={{ color: "#aaaaaa", fontSize: "13px" }}>
                  {metric}
                </p>

                <p style={{ fontSize: "32px", marginTop: "12px" }}>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "24px" }}>
                Launch Operations
              </h2>

              <p
                style={{
                  color: "#999999",
                  fontSize: "13px",
                  marginTop: "8px",
                }}
              >
                Target launch: 1.11.27 · Founder-maintained task
                statuses
              </p>
            </div>

            <Link
              href="/internal/launch"
              style={{
                color: "#ffffff",
                border: "1px solid #555555",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              Open Master Checklist →
            </Link>
          </div>

          {error ? (
            <div
              style={{
                ...cardStyle,
                marginTop: "24px",
                color: "#dddddd",
              }}
            >
              Live launch task data is temporarily unavailable.
              Open Launch Operations to retry.
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginTop: "24px",
                }}
              >
                {launchStats.map((stat) => (
                  <div key={stat.label} style={cardStyle}>
                    <p
                      style={{
                        color: "#aaaaaa",
                        fontSize: "13px",
                      }}
                    >
                      {stat.label}
                    </p>

                    <p
                      style={{
                        fontSize: "32px",
                        marginTop: "12px",
                      }}
                    >
                      {stat.value}
                    </p>

                    <p
                      style={{
                        color: "#888888",
                        fontSize: "12px",
                        marginTop: "8px",
                      }}
                    >
                      {stat.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  ...cardStyle,
                  marginTop: "16px",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    marginBottom: "14px",
                  }}
                >
                  Master checklist completion
                </p>

                <div
                  role="progressbar"
                  aria-label="Launch checklist completion"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  style={{
                    height: "8px",
                    borderRadius: "8px",
                    background: "#333338",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      background: "#ffffff",
                    }}
                  />
                </div>

                <p
                  style={{
                    color: "#999999",
                    fontSize: "12px",
                    marginTop: "12px",
                  }}
                >
                  {done} of {total} tasks completed or verified
                </p>
              </div>
            </>
          )}
        </section>

        <section style={{ marginTop: "48px" }}>
          <h2 style={{ fontSize: "24px" }}>Departments</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginTop: "24px",
            }}
          >
            {departments.map((department) => {
              const assigned = tasks.filter(
                (task) => task.department === department.name
              );

              const finished = assigned.filter((task) =>
                isDone(task.status)
              ).length;

              return (
                <div key={department.name} style={cardStyle}>
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
                      color: "#bbbbbb",
                      fontSize: "12px",
                      marginTop: "20px",
                    }}
                  >
                    {error
                      ? "Launch task data unavailable"
                      : `${finished} / ${assigned.length} launch tasks completed`}
                  </p>

                  <p
                    style={{
                      color: "#777777",
                      fontSize: "12px",
                      marginTop: "8px",
                    }}
                  >
                    Module foundation
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section
          style={{
            ...cardStyle,
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
            Central architecture registry for every Atlas Business
            feature, including frontend components, Supabase
            tables, backend functions, subscription requirements,
            security reviews, development progress, dependencies,
            and GitHub documentation.
          </p>

          <Link
            href="/internal/registry"
            style={{
              display: "inline-block",
              color: "#ffffff",
              fontSize: "13px",
              marginTop: "20px",
            }}
          >
            Open Global System Registry →
          </Link>
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
