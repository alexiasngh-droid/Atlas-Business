
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  registry,
  type DevelopmentStatus,
} from "@/lib/internal/systemRegistry";

type LiveSystem = {
  id: string;
  development_status: DevelopmentStatus;
  security_status: string;
  notes: string;
  updated_at: string;
  updated_by: string | null;
};

const statuses: Array<"All" | DevelopmentStatus> = [
  "All",
  "Designed",
  "Implemented",
  "Tested",
  "Production-ready",
];

const panel = {
  background: "#19191c",
  border: "1px solid #333",
  borderRadius: 12,
  padding: 22,
};

export default function SystemRegistryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<"All" | DevelopmentStatus>("All");
  const [selectedId, setSelectedId] = useState<string | null>(
    "ai-team"
  );

  const [liveSystems, setLiveSystems] = useState<
    Record<string, LiveSystem>
  >({});
  const [draftStatuses, setDraftStatuses] = useState<
    Record<string, DevelopmentStatus>
  >({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccessId, setSaveSuccessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadRegistry() {
      try {
        const response = await fetch(
          "/api/internal/registry",
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Registry request failed (${response.status})`
          );
        }

        const result: { systems: LiveSystem[] } =
          await response.json();

        const byId: Record<string, LiveSystem> = {};

        for (const system of result.systems) {
          byId[system.id] = system;
        }

        setLiveSystems(byId);
        setLoadError(null);
      } catch (error) {
        if (controller.signal.aborted) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load registry"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadRegistry();

    return () => controller.abort();
  }, []);

  const systems = useMemo(
    () =>
      registry.map((entry) => {
        const live = liveSystems[entry.id];

        return {
          ...entry,
          development:
            live?.development_status ?? entry.development,
          security:
            live?.security_status ?? entry.security,
          notes: live?.notes ?? entry.notes,
          hasLiveRecord: Boolean(live),
          updatedAt: live?.updated_at ?? null,
        };
      }),
    [liveSystems]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return systems.filter((entry) => {
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
  }, [systems, search, status]);

  const selected =
    systems.find((entry) => entry.id === selectedId) ??
    null;

  const selectedDraft = selected
    ? (draftStatuses[selected.id] ?? selected.development)
    : null;

  async function saveDevelopmentStatus() {
    if (
      !selected ||
      !selected.hasLiveRecord ||
      loadError ||
      loading ||
      savingId ||
      selectedDraft === selected.development
    ) {
      return;
    }

    const systemId = selected.id;
    const newStatus = selectedDraft;
    setSavingId(systemId);
    setSaveError(null);
    setSaveSuccessId(null);

    try {
      const response = await fetch("/api/internal/registry/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        body: JSON.stringify({
          id: systemId,
          development_status: newStatus,
        }),
      });

      const result: {
        system?: LiveSystem;
        error?: string;
      } = await response.json();

      if (!response.ok || !result.system) {
        throw new Error(result.error ?? "Unable to save status.");
      }

      setLiveSystems((current) => ({
        ...current,
        [systemId]: result.system!,
      }));
      setDraftStatuses((current) => {
        if (current[systemId] !== newStatus) return current;
        const next = { ...current };
        delete next[systemId];
        return next;
      });
      setSaveSuccessId(systemId);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Unable to save status."
      );
    } finally {
      setSavingId(null);
    }
  }

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
          {loading
            ? "Loading saved registry records..."
            : loadError
              ? "Live registry unavailable"
              : "Saved statuses from Supabase — architecture manually maintained"}
        </p>

        {loadError && (
          <p
            role="alert"
            style={{
              color: "#f0aaaa",
              fontSize: 13,
              marginTop: 12,
            }}
          >
            {loadError}. Displaying local registry values.
            Changes cannot be saved.
          </p>
        )}

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
          {filtered.length} of {systems.length} systems
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
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    <select
                      aria-label={`Development status for ${selected.name}`}
                      value={selectedDraft ?? selected.development}
                      disabled={
                        loading ||
                        Boolean(loadError) ||
                        !selected.hasLiveRecord ||
                        Boolean(savingId)
                      }
                      onChange={(event) => {
                        setDraftStatuses((current) => ({
                          ...current,
                          [selected.id]: event.target.value as DevelopmentStatus,
                        }));
                        setSaveError(null);
                        setSaveSuccessId(null);
                      }}
                      style={{
                        padding: 12,
                        background: "#0b0b0d",
                        color: "#fff",
                        border: "1px solid #444",
                        borderRadius: 8,
                        flex: "1 1 180px",
                      }}
                    >
                      {statuses.filter((item) => item !== "All").map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={saveDevelopmentStatus}
                      disabled={
                        loading ||
                        Boolean(loadError) ||
                        !selected.hasLiveRecord ||
                        Boolean(savingId) ||
                        selectedDraft === selected.development
                      }
                      style={{
                        padding: "12px 20px",
                        background: "#fff",
                        color: "#111",
                        border: "1px solid #fff",
                        borderRadius: 8,
                        fontWeight: 600,
                        cursor: savingId ? "wait" : "pointer",
                        opacity:
                          loading ||
                          loadError ||
                          !selected.hasLiveRecord ||
                          savingId ||
                          selectedDraft === selected.development
                            ? 0.45
                            : 1,
                      }}
                    >
                      {savingId === selected.id ? "Saving..." : "Save"}
                    </button>
                  </div>
                  {saveError && !savingId && (
                    <p role="alert" style={{ color: "#f0aaaa", marginTop: 10, fontSize: 13 }}>
                      {saveError}
                    </p>
                  )}
                  {saveSuccessId === selected.id && !savingId && (
                    <p role="status" style={{ color: "#aaa", marginTop: 10, fontSize: 13 }}>
                      Status saved to Supabase.
                    </p>
                  )}
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

                {selected.hasLiveRecord &&
                  selected.updatedAt && (
                    <p
                      style={{
                        color: "#777",
                        fontSize: 12,
                        marginTop: 24,
                      }}
                    >
                      Last saved:{" "}
                      {new Date(
                        selected.updatedAt
                      ).toLocaleString()}
                    </p>
                  )}
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