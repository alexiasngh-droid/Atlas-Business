
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  registry,
  type DevelopmentStatus,
} from "@/lib/internal/systemRegistry";

const statuses: Array<"All" | DevelopmentStatus> = [
  "All",
  "Designed",
  "Implemented",
  "Tested",
  "Production-ready",
];

export default function SystemRegistryPage() {
  const [search, setSearch] = useState("");

  const [status, setStatus] =
    useState<"All" | DevelopmentStatus>("All");

  const [selectedId, setSelectedId] = useState<string | null>(
    "ai-team"
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return registry.filter((entry) => {
      const matchesStatus =
        status === "All" || entry.development === status;

      const matchesSearch =
        !query ||
        [
          entry.name,
          entry.description,
          entry.category,
          ...entry.frontend,
          ...entry.database,
          ...entry.backend,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [search, status]);

  const selected =
    registry.find((entry) => entry.id === selectedId) ?? null;

  const panel = {
    background: "#19191c",
    border: "1px solid #333",
    borderRadius: 12,
    padding: 22,
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0d",
        color: "#fff",
        padding: "36px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Link
          href="/internal"
          style={{ color: "#aaa", fontSize: 13 }}
        >
          ← Back to Atlas Command
        </Link>

        <p
          style={{
            color: "#888",
            fontSize: 12,
            letterSpacing: 2,
            marginTop: 32,
          }}
        >
          DATABASE & CODE
        </p>

        <h1 style={{ fontSize: 36, marginTop: 12 }}>
          Global System Registry
        </h1>

        <p style={{ color: "#aaa", marginTop: 12 }}>
          Architecture, dependencies, security, and
          development tracking for Atlas Business.
        </p>

        <p
          style={{
            color: "#888",
            fontSize: 12,
            marginTop: 12,
          }}
        >
          Manually maintained records — not live monitoring
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 32,
          }}
        >
          <input
            aria-label="Search system registry"
            placeholder="Search features, tables, or code..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{
              flex: "1 1 280px",
              padding: 14,
              background: "#19191c",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: 8,
            }}
          />

          <select
            aria-label="Filter development status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | "All"
                  | DevelopmentStatus
              )
            }
            style={{
              padding: 14,
              background: "#19191c",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: 8,
            }}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <p
          style={{
            color: "#888",
            fontSize: 13,
            marginTop: 18,
          }}
        >
          {filtered.length} of {registry.length} systems
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: 20,
            marginTop: 20,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {filtered.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setSelectedId(entry.id)}
                style={{
                  ...panel,
                  width: "100%",
                  color: "#fff",
                  textAlign: "left",
                  cursor: "pointer",
                  borderColor:
                    selectedId === entry.id
                      ? "#aaa"
                      : "#333",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <strong>{entry.name}</strong>

                  <span
                    style={{
                      color: "#aaa",
                      fontSize: 12,
                    }}
                  >
                    {entry.development}
                  </span>
                </div>

                <p
                  style={{
                    color: "#999",
                    fontSize: 13,
                    marginTop: 10,
                  }}
                >
                  {entry.description}
                </p>
              </button>
            ))}

            {filtered.length === 0 && (
              <p style={{ color: "#aaa" }}>
                No matching systems found.
              </p>
            )}
          </div>

          <section style={panel}>
            {selected ? (
              <>
                <p style={{ color: "#888", fontSize: 12 }}>
                  {selected.category}
                </p>

                <h2
                  style={{
                    fontSize: 24,
                    marginTop: 10,
                  }}
                >
                  {selected.name}
                </h2>

                <p
                  style={{
                    color: "#aaa",
                    marginTop: 12,
                    lineHeight: 1.6,
                  }}
                >
                  {selected.description}
                </p>

                {[
                  ["Frontend", selected.frontend],
                  ["Database", selected.database],
                  ["Backend", selected.backend],
                ].map(([heading, values]) => (
                  <div
                    key={heading as string}
                    style={{ marginTop: 24 }}
                  >
                    <h3
                      style={{
                        fontSize: 14,
                        marginBottom: 10,
                      }}
                    >
                      {heading as string}
                    </h3>

                    {(values as string[]).map((value) => (
                      <p
                        key={value}
                        style={{
                          color: "#aaa",
                          fontSize: 13,
                          marginTop: 6,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {value}
                      </p>
                    ))}
                  </div>
                ))}

                <div style={{ marginTop: 24 }}>
                  <h3>Subscription</h3>

                  <p style={{ color: "#aaa", marginTop: 8 }}>
                    {selected.subscription}
                  </p>
                </div>

                <div style={{ marginTop: 24 }}>
                  <h3>Development Status</h3>

                  <p style={{ color: "#aaa", marginTop: 8 }}>
                    {selected.development}
                  </p>
                </div>

                <div style={{ marginTop: 24 }}>
                  <h3>Security Review</h3>

                  <p style={{ color: "#aaa", marginTop: 8 }}>
                    {selected.security}
                  </p>
                </div>

                <div style={{ marginTop: 24 }}>
                  <h3>Technical Notes</h3>

                  <p
                    style={{
                      color: "#aaa",
                      marginTop: 8,
                      lineHeight: 1.6,
                    }}
                  >
                    {selected.notes}
                  </p>
                </div>
              </>
            ) : (
              <p style={{ color: "#aaa" }}>
                Select a system to inspect its architecture.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
