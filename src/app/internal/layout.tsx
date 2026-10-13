
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AtlasCommandSidebar from "@/components/internal/AtlasCommandSidebar";

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  const founderId = process.env.ATLAS_FOUNDER_USER_ID;

  if (!founderId || user.id !== founderId) {
    redirect("/hq");
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#0b0b0d",
      }}
    >
      <AtlasCommandSidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
