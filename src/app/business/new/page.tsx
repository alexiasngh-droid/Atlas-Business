"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const businessTypes = [
  {
    value: "saas_technology",
    name: "Technology",
    description: "Software, SaaS, AI & technology",
  },
  {
    value: "creator_media",
    name: "Creator",
    description: "YouTube, social media & media",
  },
  {
    value: "ecommerce",
    name: "Commerce",
    description: "E-commerce, retail & products",
  },
  {
    value: "art_creative",
    name: "Creative",
    description: "Art, photography & creative work",
  },
  {
    value: "professional_services",
    name: "Services",
    description: "Consulting & professional services",
  },
  {
    value: "healthcare",
    name: "Healthcare",
    description: "Medical & healthcare businesses",
  },
  {
    value: "legal",
    name: "Legal",
    description: "Law firms & legal services",
  },
  {
    value: "nonprofit",
    name: "Nonprofit",
    description: "Foundations & mission-driven organizations",
  },
  {
    value: "affiliate_partnership",
    name: "Affiliate",
    description: "Affiliate & partnership businesses",
  },
  {
    value: "general",
    name: "Other",
    description: "Start with the core Atlas workspace",
  },
];

export default function NewBusinessPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createBusiness(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !businessType) {
      setError("Add a business name and choose a business type.");
      return;
    }

    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("Please sign in again.");
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("businesses")
      .insert({
        owner_id: user.id,
        name: name.trim(),
        business_type: businessType,
      })
      .select()
      .single();

    if (insertError) {
  setError(insertError.message);
  setLoading(false);
  return;
}

    router.push(`/hq?business=${data.id}`);
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-8 py-10">

        {/* TOP */}
        <header className="flex items-center justify-between border-b border-black/20 pb-7">
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em]">
              Atlas
            </p>

            <p className="mt-1 text-lg font-light">
              Business
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.back()}
            className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 transition hover:text-black"
          >
            Cancel
          </button>
        </header>

        {/* CONTENT */}
        <div className="mx-auto w-full max-w-4xl py-16">

          <div className="mb-12">
            <p className="mb-4 text-[9px] uppercase tracking-[0.3em] text-neutral-400">
              New Workspace
            </p>

            <h1 className="text-4xl font-light tracking-[-0.03em]">
              What are you building?
            </h1>

            <p className="mt-4 max-w-xl text-sm font-light leading-6 text-neutral-500">
              Give Atlas the basics. You can teach your Business Brain
              everything else later.
            </p>
          </div>

          <form onSubmit={createBusiness}>

            {/* NAME */}
            <div className="mb-14">
              <label
                htmlFor="business-name"
                className="mb-3 block text-[9px] uppercase tracking-[0.22em]"
              >
                Business Name
              </label>

              <input
                id="business-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Atlas AI Systems"
                autoFocus
                className="w-full border-0 border-b border-black bg-transparent px-0 py-4 text-2xl font-light outline-none placeholder:text-neutral-300"
              />
            </div>

            {/* BUSINESS TYPE */}
            <div>
              <p className="mb-5 text-[9px] uppercase tracking-[0.22em]">
                Business Type
              </p>

              <div className="grid grid-cols-2 border-l border-t border-black/20 md:grid-cols-3">

                {businessTypes.map((type) => {
                  const selected = businessType === type.value;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setBusinessType(type.value)}
                      className={`min-h-[125px] border-b border-r border-black/20 p-5 text-left transition ${
                        selected
                          ? "bg-black text-white"
                          : "bg-white hover:bg-neutral-50"
                      }`}
                    >
                      <p className="text-sm font-normal">
                        {type.name}
                      </p>

                      <p
                        className={`mt-2 text-[11px] font-light leading-5 ${
                          selected
                            ? "text-neutral-300"
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

            {error && (
              <p className="mt-6 text-xs text-red-600">
                {error}
              </p>
            )}

            {/* CREATE */}
            <div className="mt-10 flex items-center justify-between border-t border-black/20 pt-8">

              <p className="text-[10px] font-light text-neutral-400">
                About 10 seconds. No setup questionnaire.
              </p>

              <button
                type="submit"
                disabled={loading || !name.trim() || !businessType}
                className="border border-black bg-black px-8 py-4 text-[9px] uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-400"
              >
                {loading ? "Creating..." : "Create Workspace"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </main>
  );
}