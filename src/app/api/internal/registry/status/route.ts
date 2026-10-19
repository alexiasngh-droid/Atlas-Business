
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const allowedStatuses = [
  "Designed",
  "Implemented",
  "Tested",
  "Production-ready",
] as const;

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    if (
      !process.env.ATLAS_FOUNDER_USER_ID ||
      user.id !== process.env.ATLAS_FOUNDER_USER_ID
    ) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: 403 }
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
    const developmentStatus = input.development_status;

    if (
      typeof id !== "string" ||
      !/^[a-z0-9-]+$/.test(id) ||
      typeof developmentStatus !== "string" ||
      !allowedStatuses.some(
        (status) => status === developmentStatus
      )
    ) {
      return NextResponse.json(
        { error: "Invalid system or development status." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("atlas_system_registry")
      .update({
        development_status: developmentStatus,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, development_status, security_status, notes, updated_at, updated_by"
      )
      .maybeSingle();

    if (error) {
      console.error("Registry update failed:", error.message);

      return NextResponse.json(
        { error: "Unable to update registry." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "System not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { system: data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Registry status API error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
