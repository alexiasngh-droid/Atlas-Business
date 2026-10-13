
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    const user = data.user;

    if (error || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const founderId = process.env.ATLAS_FOUNDER_USER_ID;

    if (!founderId || user.id !== founderId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const result = await supabase
      .from("atlas_system_registry")
      .select("*")
      .order("id");

    if (result.error) {
      console.error("Registry read failed:", result.error.message);

      return NextResponse.json(
        { error: "Registry unavailable" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { systems: result.data ?? [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Registry API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
