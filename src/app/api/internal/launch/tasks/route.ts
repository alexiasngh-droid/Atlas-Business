
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const validStatuses = [
  "Not Started",
  "In Progress",
  "Blocked",
  "Completed",
  "Verified",
];

const validPriorities = [
  "Critical",
  "High",
  "Medium",
  "Low",
];

async function authenticateFounder() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { supabase, user: null, status: 401 };
  }

  if (
    !process.env.ATLAS_FOUNDER_USER_ID ||
    data.user.id !== process.env.ATLAS_FOUNDER_USER_ID
  ) {
    return { supabase, user: null, status: 403 };
  }

  return { supabase, user: data.user, status: 200 };
}

export async function GET() {
  try {
    const auth = await authenticateFounder();

    if (!auth.user) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: auth.status }
      );
    }

    const { data, error } = await auth.supabase
      .from("atlas_launch_tasks")
      .select("*")
      .order("section_number")
      .order("sort_order");

    if (error) {
      console.error("Launch tasks read failed:", error.message);
      return NextResponse.json(
        { error: "Unable to load launch tasks." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { tasks: data ?? [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Launch tasks GET error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await authenticateFounder();

    if (!auth.user) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: auth.status }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON." },
        { status: 400 }
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const input = body as Record<string, unknown>;
    const id = input.id;

    if (
      typeof id !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(id)
    ) {
      return NextResponse.json(
        { error: "Invalid task ID." },
        { status: 400 }
      );
    }

    const changes: Record<string, unknown> = {};

    if ("status" in input) {
      if (
        typeof input.status !== "string" ||
        !validStatuses.includes(input.status)
      ) {
        return NextResponse.json(
          { error: "Invalid status." },
          { status: 400 }
        );
      }

      changes.status = input.status;
    }

    if ("priority" in input) {
      if (
        typeof input.priority !== "string" ||
        !validPriorities.includes(input.priority)
      ) {
        return NextResponse.json(
          { error: "Invalid priority." },
          { status: 400 }
        );
      }

      changes.priority = input.priority;
    }

    if ("notes" in input) {
      if (
        typeof input.notes !== "string" ||
        input.notes.length > 10000
      ) {
        return NextResponse.json(
          { error: "Invalid notes." },
          { status: 400 }
        );
      }

      changes.notes = input.notes;
    }

    if (Object.keys(changes).length === 0) {
      return NextResponse.json(
        { error: "No valid changes provided." },
        { status: 400 }
      );
    }

    changes.updated_by = auth.user.id;
    changes.updated_at = new Date().toISOString();

    if (changes.status === "Completed") {
      changes.completed_at = new Date().toISOString();
      changes.verified_at = null;
    } else if (changes.status === "Verified") {
      changes.completed_at = new Date().toISOString();
      changes.verified_at = new Date().toISOString();
    } else if ("status" in changes) {
      changes.completed_at = null;
      changes.verified_at = null;
    }

    const { data, error } = await auth.supabase
      .from("atlas_launch_tasks")
      .update(changes)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Launch task update failed:", error.message);
      return NextResponse.json(
        { error: "Unable to update task." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Task not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { task: data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Launch tasks PATCH error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
