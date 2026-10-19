
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const departmentNames: Record<string, string> = {
  accounts: "Accounts & Auth",
  security: "Security Center",
  database: "Database & Code",
  ai: "AI Operations",
  brain: "Business Brain",
  billing: "Billing & Finance",
  products: "Core Products",
  integrations: "Integrations",
  growth: "Growth & Affiliates",
  legal: "Legal & Compliance",
  journey: "Customer Journey",
};

const statuses = [
  "Not Started",
  "In Progress",
  "Blocked",
  "Completed",
  "Verified",
] as const;

type Task = {
  id: string;
  title: string;
  description: string;
  department: string;
  section_number: number;
  section_name: string;
  status: string;
  priority: string;
  notes: string;
};

const panel = {
  background: "#19191c",
  border: "1px solid #333333",
  borderRadius: 12,
  padding: 24,
};

function finished(status: string) {
  return status === "Completed" || status === "Verified";
}

export default function DepartmentDashboard() {
  const params = useParams();
  const slug = String(params.department ?? "");
  const department = departmentNames[slug];

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/internal/launch/tasks", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load launch tasks.");
      }

      const result = await response.json();
      setTasks(Array.isArray(result.tasks) ? result.tasks : []);
    } catch {
      setError("Unable to load department tasks. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (department) {
      void loadTasks();
    }
  }, [department, loadTasks]);

  async function updateStatus(id: string, status: string) {
    setSavingId(id);
    setError("");

    try {
      const response = await fetch("/api/internal/launch/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error("Unable to save task status.");
      }

      const result = await response.json();

      if (!result.task) {
        throw new Error("Updated task was not returned.");
      }

      setTasks((previous) =>
        previous.map((task) =>
          task.id === id ? result.task : task
        )
      );
    } catch {
      setError("Status could not be saved. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  if (!department) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#0b0b0d",
          color: "#fff",
          padding: 40,
        }}
      >
        <h1>Department not found</h1>
        <Link href="/internal" style={{ color: "#aaa" }}>
          ← Return to CEO Overview
        </Link>
      </main>
    );
  }

  const assigned = tasks.filter(
    (task) => task.department === department
  );

  const completed = assigned.filter((task) =>
    finished(task.status)
  ).length;

  const inProgress = assigned.filter(
    (task) => task.status === "In Progress"
  ).length;

  const blocked = assigned.filter(
    (task) => task.status === "Blocked"
  ).length;

  const progress = assigned.length
    ? Math.round((completed / assigned.length) * 100)
    : 0;

  const stats = [
    { label: "Assigned tasks", value: assigned.length },
    { label: "Completed / Verified", value: completed },
    { label: "In progress", value: inProgress },
    { label: "Blocked", value: blocked },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0d",
        color: "#fff",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header>
          <p
            style={{
              color: "#999",
              fontSize: 12,
              letterSpacing: 3,
            }}
          >
            ATLAS COMMAND / DEPARTMENTS
          </p>

          <h1 style={{ fontSize: 38, marginTop: 18 }}>
            {department}
          </h1>

          <p
            style={{
              color: "#aaa",
              marginTop: 10,
              fontSize: 14,
            }}
          >
            Live departmental launch tasks · Target 1.11.27
          </p>

          <div
            style={{
              display: "flex",
              gap: 18,
              marginTop: 22,
              flexWrap: "wrap",
            }}
          >
            <Link href="/internal" style={{ color: "#ccc" }}>
              ← CEO Overview
            </Link>

            <Link
              href="/internal/launch"
              style={{ color: "#ccc" }}
            >
              Master Launch Checklist →
            </Link>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              ...panel,
              marginTop: 24,
              borderColor: "#777",
              color: "#eee",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ color: "#aaa", marginTop: 40 }}>
            Loading live department tasks...
          </p>
        ) : (
          <>
            <section style={{ marginTop: 40 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(190px, 1fr))",
                  gap: 16,
                }}
              >
                {stats.map((stat) => (
                  <div key={stat.label} style={panel}>
                    <p
                      style={{
                        color: "#aaa",
                        fontSize: 13,
                      }}
                    >
                      {stat.label}
                    </p>

                    <p
                      style={{
                        fontSize: 32,
                        marginTop: 12,
                      }}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ ...panel, marginTop: 16 }}>
                <p style={{ marginBottom: 14 }}>
                  Department launch progress — {progress}%
                </p>

                <div
                  style={{
                    height: 8,
                    background: "#333338",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "#fff",
                    }}
                  />
                </div>
              </div>
            </section>

            <section style={{ marginTop: 44 }}>
              <h2 style={{ fontSize: 24 }}>
                Assigned launch tasks
              </h2>

              <p
                style={{
                  color: "#999",
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                Status changes are saved to Supabase and
                reflected across Atlas Command.
              </p>

              {assigned.length === 0 ? (
                <div style={{ ...panel, marginTop: 24 }}>
                  <p style={{ color: "#aaa" }}>
                    No launch tasks are assigned to this
                    department yet.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: 14,
                    marginTop: 24,
                  }}
                >
                  {assigned.map((task) => (
                    <article key={task.id} style={panel}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 20,
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ flex: "1 1 300px" }}>
                          <p
                            style={{
                              color: "#999",
                              fontSize: 11,
                              letterSpacing: 1,
                            }}
                          >
                            SECTION {task.section_number} ·{" "}
                            {task.priority.toUpperCase()} PRIORITY
                          </p>

                          <h3
                            style={{
                              fontSize: 17,
                              marginTop: 10,
                            }}
                          >
                            {task.title}
                          </h3>

                          {task.description && (
                            <p
                              style={{
                                color: "#aaa",
                                fontSize: 13,
                                lineHeight: 1.7,
                                marginTop: 10,
                              }}
                            >
                              {task.description}
                            </p>
                          )}
                        </div>

                        <div
                          style={{
                            minWidth: 170,
                            display: "grid",
                            gap: 8,
                          }}
                        >
                          <label
                            htmlFor={`task-${task.id}`}
                            style={{
                              color: "#aaa",
                              fontSize: 12,
                            }}
                          >
                            Task status
                          </label>

                          <select
                            id={`task-${task.id}`}
                            value={task.status}
                            disabled={savingId === task.id}
                            onChange={(event) =>
                              void updateStatus(
                                task.id,
                                event.target.value
                              )
                            }
                            style={{
                              background: "#0b0b0d",
                              color: "#fff",
                              border: "1px solid #555",
                              borderRadius: 8,
                              padding: "10px 12px",
                              fontSize: 13,
                            }}
                          >
                            {statuses.map((status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            ))}
                          </select>

                          {savingId === task.id && (
                            <p
                              style={{
                                color: "#aaa",
                                fontSize: 11,
                              }}
                            >
                              Saving...
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        <footer
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid #333",
            color: "#777",
            fontSize: 12,
          }}
        >
          Atlas AI Systems — Internal Administration
        </footer>
      </div>
    </main>
  );
}
