
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const departments = [
  { name: "CEO Overview", path: "/internal" },
  { name: "Accounts & Auth", path: "/internal/accounts" },
  { name: "Security Center", path: "/internal/security" },
  { name: "Database & Code", path: "/internal/database" },
  { name: "AI Operations", path: "/internal/ai" },
  { name: "Business Brain", path: "/internal/brain" },
  { name: "Billing & Finance", path: "/internal/billing" },
  { name: "Core Products", path: "/internal/products" },
  { name: "Integrations", path: "/internal/integrations" },
  { name: "Growth & Affiliates", path: "/internal/growth" },
  { name: "Legal & Compliance", path: "/internal/legal" },
  { name: "Customer Journey", path: "/internal/journey" },
];

export default function AtlasCommandSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 250,
        minWidth: 250,
        background: "#111114",
        borderRight: "1px solid #303036",
        padding: "28px 16px",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
      }}
    >
      <div style={{ padding: "0 12px", marginBottom: 36 }}>
        <p
          style={{
            color: "#888",
            fontSize: 10,
            letterSpacing: 2,
          }}
        >
          ATLAS AI SYSTEMS
        </p>

        <h2
          style={{
            color: "#fff",
            fontSize: 19,
            marginTop: 10,
          }}
        >
          ATLAS COMMAND
        </h2>

        <p
          style={{
            color: "#888",
            fontSize: 11,
            marginTop: 8,
          }}
        >
          Founder Control Center
        </p>
      </div>

      <nav aria-label="Atlas Command departments">
        {departments.map((department) => {
          const active =
            pathname === department.path ||
            (department.path !== "/internal" &&
              pathname.startsWith(department.path + "/"));

          const available =
            department.path === "/internal";

          const content = (
            <span
              style={{
                display: "block",
                padding: "11px 12px",
                borderRadius: 8,
                fontSize: 13,
                color: active ? "#fff" : "#aaa",
                background: active ? "#29292e" : "transparent",
              }}
            >
              {department.name}
              {!available && (
                <span
                  style={{
                    float: "right",
                    color: "#777",
                    fontSize: 10,
                  }}
                >
                  Soon
                </span>
              )}
            </span>
          );

          return (
            <div key={department.path} style={{ marginBottom: 4 }}>
              {available ? (
                <Link href={department.path}>{content}</Link>
              ) : (
                content
              )}

              {department.name === "Database & Code" && (
                <Link href="/internal/registry">
                  <span
                    style={{
                      display: "block",
                      marginLeft: 12,
                      padding: "10px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      color:
                        pathname === "/internal/registry"
                          ? "#fff"
                          : "#aaa",
                      background:
                        pathname === "/internal/registry"
                          ? "#29292e"
                          : "transparent",
                    }}
                  >
                    ↳ Global System Registry
                  </span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: 40,
          borderTop: "1px solid #303036",
          padding: "24px 12px 0",
        }}
      >
        <Link
          href="/hq"
          style={{ color: "#999", fontSize: 12 }}
        >
          ← Return to Atlas Business
        </Link>
      </div>
    </aside>
  );
}
