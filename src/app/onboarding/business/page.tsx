"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const businessTypes = [
  {
    value: "saas_technology",
    label: "Technology",
    description: "Software, SaaS, AI and technology companies.",
  },
  {
    value: "creator_media",
    label: "Creator & Media",
    description: "Creators, media brands and content businesses.",
  },
  {
    value: "ecommerce",
    label: "Commerce",
    description: "E-commerce, retail and product businesses.",
  },
  {
    value: "art_creative",
    label: "Creative",
    description: "Art, photography and creative businesses.",
  },
  {
    value: "professional_services",
    label: "Professional Services",
    description: "Consulting, agencies and service businesses.",
  },
  {
    value: "healthcare",
    label: "Healthcare",
    description: "Practices and healthcare organizations.",
  },
  {
    value: "legal",
    label: "Legal",
    description: "Law firms and legal services.",
  },
  {
    value: "nonprofit",
    label: "Nonprofit",
    description: "Nonprofits, foundations and mission-led organizations.",
  },
  {
    value: "affiliate_partnership",
    label: "Affiliate & Partnerships",
    description: "Affiliate, partnership and commission-based businesses.",
  },
  {
    value: "general",
    label: "Other",
    description: "A flexible Atlas workspace for any other business.",
  },
];

export default function BusinessSetupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
  event: FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  setError("");
  setLoading(true);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    setError(
      "Your session has expired. Please sign in again."
    );
    setLoading(false);
    return;
  }

  if (
    !businessName.trim() ||
    !businessType ||
    !industry.trim()
  ) {
    setError(
      "Please complete the required business information."
    );
    setLoading(false);
    return;
  }

  // Create the business and its onboarding foundation
  // as one secure database transaction.
  const {
    data: businessId,
    error: businessError,
  } = await supabase.rpc(
    "create_initial_business",
    {
      p_name: businessName.trim(),
      p_business_type: businessType,
      p_industry: industry.trim(),
      p_website: website.trim() || null,
    }
  );

  if (businessError || !businessId) {
    setError(
      businessError?.message ??
        "We couldn't create your business."
    );
    setLoading(false);
    return;
  }

  router.push(
    `/onboarding/plan?business=${businessId}`
  );
}

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT */}
        <section className="hidden border-r border-black/15 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div>
            <p className="text-[9px] uppercase tracking-[0.45em]">
              Atlas
            </p>

            <h1 className="mt-1 text-xl font-light tracking-tight">
              Business
            </h1>
          </div>

          <div className="max-w-md">
            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
              Your workspace
            </p>

            <h2 className="mt-5 text-4xl font-light leading-[1.15] tracking-[-0.04em]">
              Built around
              <br />
              your business.
            </h2>

            <p className="mt-6 max-w-sm text-sm font-light leading-6 text-neutral-500">
              Tell Atlas what kind of company you're
              building. Your workspace will adapt around
              how your business actually operates.
            </p>
          </div>

          <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-300">
            Atlas AI Systems
          </p>
        </section>

        {/* FORM */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-20">
          <div className="w-full max-w-[620px]">

            <div className="mb-12">
              <div className="flex items-center justify-between">
                <p className="text-[9px] uppercase tracking-[0.25em]">
                  02 — Business
                </p>

                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                  Step 2 of 4
                </p>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                <div className="h-px bg-black" />
                <div className="h-px bg-black" />
                <div className="h-px bg-neutral-200" />
                <div className="h-px bg-neutral-200" />
              </div>
            </div>

            <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
              Create your workspace
            </p>

            <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] sm:text-5xl">
              Tell us about your business.
            </h2>

            <p className="mt-5 max-w-lg text-sm font-light leading-6 text-neutral-500">
              We'll use this information to create the
              foundation of your Atlas workspace.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-12"
            >
              <Field
                label="Business name"
                value={businessName}
                onChange={setBusinessName}
                placeholder="Your company"
              />

              <div className="mt-9">
                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">
                  Business type
                </p>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {businessTypes.map((type) => {
                    const selected =
                      businessType === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setBusinessType(type.value)
                        }
                        className={`min-h-[100px] border p-4 text-left transition ${
                          selected
                            ? "border-black bg-black text-white"
                            : "border-black/20 bg-white hover:border-black"
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-[0.16em]">
                          {type.label}
                        </p>

                        <p
                          className={`mt-2 text-[10px] font-light leading-4 ${
                            selected
                              ? "text-white/60"
                              : "text-neutral-400"
                          }`}
                        >
                          {type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-9">
                <Field
                  label="Industry"
                  value={industry}
                  onChange={setIndustry}
                  placeholder="e.g. Artificial Intelligence"
                />
              </div>

              <div className="mt-9">
                <Field
                  label="Website"
                  optional
                  value={website}
                  onChange={setWebsite}
                  placeholder="https://"
                />
              </div>

              {error && (
                <div className="mt-8 border border-black/20 px-4 py-3">
                  <p className="text-xs font-light">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-10 flex w-full items-center justify-between bg-black px-6 py-4 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="text-[10px] uppercase tracking-[0.22em]">
                  {loading
                    ? "Creating workspace..."
                    : "Continue"}
                </span>

                {!loading && (
                  <span aria-hidden="true">→</span>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">
          {label}
        </span>

        {optional && (
          <span className="text-[8px] uppercase tracking-[0.18em] text-neutral-300">
            Optional
          </span>
        )}
      </span>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-3 w-full border-0 border-b border-black/30 bg-transparent px-0 py-3 text-sm font-light outline-none transition placeholder:text-neutral-300 focus:border-black"
      />
    </label>
  );
}