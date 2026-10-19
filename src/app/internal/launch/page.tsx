"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type TaskStatus = "Not Started" | "In Progress" | "Blocked" | "Completed" | "Verified";
type Priority = "Critical" | "High" | "Medium" | "Low";
type LaunchTask = {
  id: string;
  section_number: number;
  section_name: string;
  department: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  notes: string;
  sort_order: number;
  completed_at: string | null;
  verified_at: string | null;
  updated_at: string;
};

const statuses: TaskStatus[] = ["Not Started", "In Progress", "Blocked", "Completed", "Verified"];
const priorities: Priority[] = ["Critical", "High", "Medium", "Low"];
const sectionNames = [
  "Build Order & Interactive Demo",
  "Core Software & Onboarding",
  "AI Agents & Atlas Assistant",
  "Integrations & Industry Experiences",
  "Billing, Affiliates & Outreach",
  "Founder-Only Atlas Command",
  "Legal, IP & Cybersecurity",
  "Launch, Marketing & Testing",
];
const panel = { background: "#19191c", border: "1px solid #333", borderRadius: 12 };
const inputStyle = { background: "#111114", border: "1px solid #444", color: "#fff", borderRadius: 8, padding: "10px 12px" };
const finished = (task: LaunchTask) => task.status === "Completed" || task.status === "Verified";

export default function LaunchOperationsPage() {
  const [tasks, setTasks] = useState<LaunchTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [expanded, setExpanded] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/internal/launch/tasks", { cache: "no-store" });
      if (!response.ok) throw new Error(`Unable to load tasks (${response.status}).`);
      const result: { tasks: LaunchTask[] } = await response.json();
      if (!Array.isArray(result.tasks)) throw new Error("Unexpected launch task response.");
      setTasks(result.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadTasks(); }, [loadTasks]);

  const updateTask = async (task: LaunchTask, changes: Partial<Pick<LaunchTask, "status" | "priority" | "notes">>) => {
    if (busyIds.includes(task.id)) return;
    setBusyIds((current) => [...current, task.id]);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/internal/launch/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, ...changes }),
      });
      const result: { task?: LaunchTask; error?: string } = await response.json();
      if (!response.ok || !result.task) throw new Error(result.error || "Unable to save task.");
      setTasks((current) => current.map((item) => item.id === task.id ? result.task! : item));
      if ("notes" in changes) setDraftNotes((current) => {
        const next = { ...current };
        delete next[task.id];
        return next;
      });
      setMessage(`Saved: ${task.title}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save task.");
    } finally {
      setBusyIds((current) => current.filter((id) => id !== task.id));
    }
  };

  const departments = useMemo(() => ["All departments", ...Array.from(new Set(tasks.map((task) => task.department))).sort()], [tasks]);
  const filtered = useMemo(() => tasks.filter((task) => {
    const query = search.trim().toLowerCase();
    return (department === "All departments" || task.department === department)
      && (statusFilter === "All statuses" || task.status === statusFilter)
      && (!query || [task.title, task.section_name, task.department, task.notes].join(" ").toLowerCase().includes(query));
  }), [tasks, search, department, statusFilter]);
  const complete = tasks.filter(finished).length;
  const verified = tasks.filter((task) => task.status === "Verified").length;
  const blocked = tasks.filter((task) => task.status === "Blocked").length;
  const percent = tasks.length ? Math.round(complete / tasks.length * 100) : 0;
  const daysLeft = Math.ceil((new Date("2027-01-11T00:00:00").getTime() - Date.now()) / 86400000);

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0d", color: "#fff", padding: "36px 24px" }}>
      <div style={{ maxWidth: 1250, margin: "0 auto" }}>
        <Link href="/internal" style={{ color: "#aaa", fontSize: 13 }}>← Back to Atlas Command</Link>
        <p style={{ color: "#888", fontSize: 12, letterSpacing: 2, marginTop: 32 }}>ATLAS COMMAND / LAUNCH OPERATIONS</p>
        <h1 style={{ fontSize: 36, marginTop: 12 }}>Master Launch Checklist</h1>
        <p style={{ color: "#aaa", marginTop: 12 }}>One source of truth for development, operations, legal, and launch readiness.</p>
        <p style={{ color: "#888", fontSize: 12, marginTop: 8 }}>Target launch: 1.11.27 · Statuses are founder-maintained, not independently certified.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 12, marginTop: 28 }}>
          {[
            ["Total tasks", tasks.length], ["Completed / Verified", complete], ["Verified", verified], ["Blocked", blocked], ["Days until launch", Math.max(0, daysLeft)],
          ].map(([label, value]) => (
            <div key={String(label)} style={{ ...panel, padding: 20 }}>
              <p style={{ color: "#999", fontSize: 12 }}>{label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, marginTop: 10 }}>{loading ? "—" : value}</p>
            </div>
          ))}
        </div>

        <div style={{ ...panel, padding: 22, marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><strong>Overall checklist progress</strong><strong>{loading ? "—" : `${percent}%`}</strong></div>
          <div style={{ height: 8, borderRadius: 8, background: "#37373c", marginTop: 14, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: "#f1f1f3", borderRadius: 8 }} />
          </div>
          <p style={{ color: "#999", fontSize: 12, marginTop: 12 }}>Completion is not launch clearance. Critical security, legal, payment, and integration requirements need separate verification.</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
          <input aria-label="Search launch tasks" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks, sections, or notes..." style={{ ...inputStyle, flex: "2 1 240px" }} />
          <select aria-label="Filter by department" value={department} onChange={(event) => setDepartment(event.target.value)} style={{ ...inputStyle, flex: "1 1 190px" }}>
            {departments.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ ...inputStyle, flex: "1 1 160px" }}>
            {["All statuses", ...statuses].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 16, alignItems: "center" }}>
          <p style={{ color: "#999", fontSize: 13 }}>{filtered.length} of {tasks.length} tasks shown</p>
          <button type="button" onClick={() => void loadTasks()} disabled={loading || busyIds.length > 0} style={{ ...inputStyle, cursor: "pointer" }}>Refresh from Supabase</button>
        </div>
        {error && <p role="alert" style={{ color: "#f0aaaa", marginTop: 16 }}>{error}</p>}
        {message && <p role="status" style={{ color: "#b6e5c0", marginTop: 16 }}>{message}</p>}
        {loading && <p style={{ color: "#aaa", marginTop: 24 }}>Loading launch tasks...</p>}

        {!loading && sectionNames.map((sectionName, index) => {
          const section = index + 1;
          const allInSection = tasks.filter((task) => task.section_number === section);
          const visible = filtered.filter((task) => task.section_number === section);
          if (!visible.length && (search || department !== "All departments" || statusFilter !== "All statuses")) return null;
          const done = allInSection.filter(finished).length;
          const isOpen = expanded.includes(section);
          return (
            <section key={section} style={{ ...panel, marginTop: 18, overflow: "hidden" }}>
              <button type="button" aria-expanded={isOpen} onClick={() => setExpanded((current) => isOpen ? current.filter((item) => item !== section) : [...current, section])}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, background: "transparent", color: "#fff", border: 0, padding: 22, textAlign: "left", cursor: "pointer" }}>
                <span><strong style={{ fontSize: 17 }}>{section}. {sectionName}</strong><span style={{ display: "block", color: "#999", fontSize: 12, marginTop: 7 }}>{done} of {allInSection.length} completed · {visible.length} shown</span></span>
                <span style={{ color: "#aaa" }}>{isOpen ? "−" : "+"}</span>
              </button>
              <div style={{ height: 3, background: "#36363a" }}><div style={{ height: "100%", width: `${allInSection.length ? done / allInSection.length * 100 : 0}%`, background: "#eee" }} /></div>
              {isOpen && <div style={{ padding: "4px 22px 22px" }}>
                {visible.map((task) => {
                  const busy = busyIds.includes(task.id);
                  const notesValue = draftNotes[task.id] ?? task.notes;
                  return (
                    <div key={task.id} style={{ borderBottom: "1px solid #343438", padding: "18px 0" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <input type="checkbox" aria-label={`Mark ${task.title} completed`} checked={finished(task)} disabled={busy}
                          onChange={(event) => void updateTask(task, { status: event.target.checked ? "Completed" : "Not Started" })}
                          style={{ width: 18, height: 18, marginTop: 3, accentColor: "#fff", cursor: "pointer" }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong style={{ fontSize: 14, fontWeight: 600, color: finished(task) ? "#aaa" : "#fff" }}>{task.title}</strong>
                          <p style={{ color: "#888", fontSize: 12, marginTop: 6 }}>{task.department}{task.due_date ? ` · Due ${task.due_date}` : ""}</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                            <label style={{ display: "grid", gap: 5, color: "#999", fontSize: 11 }}>Status
                              <select value={task.status} disabled={busy} onChange={(event) => void updateTask(task, { status: event.target.value as TaskStatus })} style={{ ...inputStyle, padding: "8px 10px", fontSize: 12 }}>
                                {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                              </select>
                            </label>
                            <label style={{ display: "grid", gap: 5, color: "#999", fontSize: 11 }}>Priority
                              <select value={task.priority} disabled={busy} onChange={(event) => void updateTask(task, { priority: event.target.value as Priority })} style={{ ...inputStyle, padding: "8px 10px", fontSize: 12 }}>
                                {priorities.map((item) => <option key={item} value={item}>{item}</option>)}
                              </select>
                            </label>
                          </div>
                          <details style={{ marginTop: 12 }}><summary style={{ color: "#aaa", fontSize: 12, cursor: "pointer" }}>Notes</summary>
                            <textarea aria-label={`Notes for ${task.title}`} value={notesValue} disabled={busy} onChange={(event) => setDraftNotes((current) => ({ ...current, [task.id]: event.target.value }))}
                              rows={3} maxLength={10000} style={{ ...inputStyle, width: "100%", marginTop: 10, resize: "vertical", boxSizing: "border-box" }} />
                            <button type="button" disabled={busy || notesValue === task.notes} onClick={() => void updateTask(task, { notes: notesValue })}
                              style={{ ...inputStyle, marginTop: 8, cursor: "pointer", opacity: busy || notesValue === task.notes ? 0.5 : 1 }}>{busy ? "Saving..." : "Save notes"}</button>
                          </details>
                        </div>
                        {busy && <span style={{ color: "#999", fontSize: 12 }}>Saving...</span>}
                      </div>
                    </div>
                  );
                })}
                {visible.length === 0 && <p style={{ color: "#999" }}>No tasks in this section.</p>}
              </div>}
            </section>
          );
        })}
        {!loading && filtered.length === 0 && <p style={{ color: "#aaa", marginTop: 24 }}>No tasks match your filters.</p>}
      </div>
    </main>
  );
}
