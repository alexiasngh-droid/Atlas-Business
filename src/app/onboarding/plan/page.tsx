"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    tagline: "The System",
    description:
      "Everything you need to organize your business in one intelligent system.",
    products: "1 product or brand",
    additionalBusiness: "$15/mo",
    features: [
      "Business Brain",
      "Atlas HQ",
      "Goals & Roadmaps",
      "Action Plans & Priorities",
      "Tasks & Ideas",
      "Business Vault",
      "Contacts & Subscriptions",
      "Atlas AI Assistance",
      "Standard Analytics",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    tagline: "The Operator",
    description:
      "Proactive intelligence, automation and connected tools to help run your business.",
    products: "Up to 5 products or brands",
    additionalBusiness: "$20/mo",
    featured: true,
    features: [
      "Everything in Starter",
      "Daily CEO Brief",
      "Atlas News",
      "Founder’s Lab",
      "Integrations",
      "Automations",
      "Vacation Mode",
      "Full AI Goal Planning",
    ],
  },
  {
    id: "executive",
    name: "Executive",
    price: 199,
    tagline: "The Office",
    description:
      "Your AI executive office — built to help run the company and your executive workload.",
    products: "Unlimited products or brands*",
    additionalBusiness: "$50/mo",
    features: [
      "Everything in Pro",
      "Atlas Assistant",
      "Atlas AI Team",
      "CEO / Strategy",
      "Marketing",
      "Sales",
      "Operations",
      "Research & Intelligence",
      "Advanced Business Intelligence",
      "Cross-Agent Intelligence",
      "Executive Decision Analysis",
      "Higher AI Capacity",
    ],
  },
];

function PlanSelection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const businessId = searchParams.get("business");

  const [selectedPlan, setSelectedPlan] =
    useState("pro");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleContinue() {
    setError("");

    if (!businessId) {
      setError(
        "We couldn't identify your business. Please return to business setup."
      );
      return;
    }

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

    /*
      Save the selected plan as onboarding progress.

      We intentionally do NOT grant the actual paid
      entitlement here. Stripe will become the trusted
      source for paid access in the next step.
    */

    const { error: subscriptionError } =
      await supabase
        .from("subscriptions")
        .update({
          plan: selectedPlan,
          status: "incomplete",
        })
        .eq("business_id", businessId);

    if (subscriptionError) {
      setError(subscriptionError.message);
      setLoading(false);
      return;
    }

    const { error: onboardingError } =
      await supabase
        .from("onboarding_progress")
        .update({
          current_step: "billing",
          plan_complete: true,
        })
        .eq("business_id", businessId);

    if (onboardingError) {
      setError(onboardingError.message);
      setLoading(false);
      return;
    }

    router.push(
      `/onboarding/billing?business=${businessId}&plan=${selectedPlan}`
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-[1500px] px-6 py-10 sm:px-10 lg:px-14">

        {/* HEADER */}
        <header className="flex items-start justify-between border-b border-black/15 pb-8">
          <div>
            <p className="text-[9px] uppercase tracking-[0.45em]">
              Atlas
            </p>

            <h1 className="mt-1 text-xl font-light tracking-tight">
              Business
            </h1>
          </div>

          <p className="hidden text-[9px] uppercase tracking-[0.2em] text-neutral-300 sm:block">
            Atlas AI Systems
          </p>
        </header>

        {/* PROGRESS */}
        <div className="mx-auto mt-10 max-w-[620px]">
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.25em]">
              03 — Plan
            </p>

            <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
              Step 3 of 4
            </p>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            <div className="h-px bg-black" />
            <div className="h-px bg-black" />
            <div className="h-px bg-black" />
            <div className="h-px bg-neutral-200" />
          </div>
        </div>

        {/* TITLE */}
        <section className="mx-auto mt-14 max-w-3xl text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
  14-Day Executive Trial
</p>

<h2 className="mt-4 text-4xl font-light tracking-[-0.045em] sm:text-5xl lg:text-6xl">
  Experience everything first.
</h2>

<p className="mx-auto mt-6 max-w-xl text-sm font-light leading-6 text-neutral-500">
  Every Atlas trial includes full Executive access
  for 14 days. Choose the plan you&apos;d like to
  continue with when your trial ends.
</p>

<div className="mx-auto mt-8 max-w-xl border-y border-black/10 py-5">
  <p className="text-[10px] uppercase tracking-[0.22em]">
    Your first 14 days
  </p>

  <p className="mt-2 text-sm font-light text-neutral-500">
    Full Executive access · $0 today
  </p>
</div>
        </section>

        {/* PLAN CARDS */}
        <section className="mx-auto mt-16 grid max-w-[1250px] gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const selected =
              selectedPlan === plan.id;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() =>
                  setSelectedPlan(plan.id)
                }
                className={`relative flex min-h-[650px] flex-col border p-7 text-left transition ${
                  selected
                    ? "border-black bg-black text-white"
                    : "border-black/20 bg-white text-black hover:border-black"
                }`}
              >
                {plan.featured && (
                  <div
                    className={`absolute right-5 top-5 text-[8px] uppercase tracking-[0.2em] ${
                      selected
                        ? "text-white/50"
                        : "text-neutral-400"
                    }`}
                  >
                    Most Popular
                  </div>
                )}

                <div>
                  <p
                    className={`text-[9px] uppercase tracking-[0.28em] ${
                      selected
                        ? "text-white/50"
                        : "text-neutral-400"
                    }`}
                  >
                    {plan.tagline}
                  </p>

                  <h3 className="mt-4 text-2xl font-light">
                    {plan.name}
                  </h3>

                  <div className="mt-7 flex items-end gap-1">
                    <span className="text-5xl font-light tracking-[-0.05em]">
                      ${plan.price}
                    </span>

                    <span
                      className={`mb-1 text-xs font-light ${
                        selected
                          ? "text-white/50"
                          : "text-neutral-400"
                      }`}
                    >
                      / month
                    </span>
                  </div>

                  <p
                    className={`mt-6 min-h-[72px] text-sm font-light leading-6 ${
                      selected
                        ? "text-white/65"
                        : "text-neutral-500"
                    }`}
                  >
                    {plan.description}
                  </p>

                  <div
                    className={`mt-7 border-y py-5 ${
                      selected
                        ? "border-white/15"
                        : "border-black/10"
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-[0.16em]">
                      1 Business
                    </p>

                    <p
                      className={`mt-2 text-xs font-light ${
                        selected
                          ? "text-white/55"
                          : "text-neutral-400"
                      }`}
                    >
                      {plan.products}
                    </p>
                  </div>
                </div>

                {/* FEATURES */}
                <div className="mt-7 flex-1">
                  <p
                    className={`text-[8px] uppercase tracking-[0.22em] ${
                      selected
                        ? "text-white/40"
                        : "text-neutral-400"
                    }`}
                  >
                    Included
                  </p>

                  <div className="mt-5 space-y-3">
                    {plan.features.map(
                      (feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-3"
                        >
                          <span
                            className={`mt-[2px] text-[9px] ${
                              selected
                                ? "text-white/60"
                                : "text-neutral-400"
                            }`}
                          >
                            ✓
                          </span>

                          <span className="text-xs font-light leading-5">
                            {feature}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* ADDITIONAL BUSINESS */}
                <div
                  className={`mt-8 border-t pt-5 ${
                    selected
                      ? "border-white/15"
                      : "border-black/10"
                  }`}
                >
                  <p
                    className={`text-[9px] font-light ${
                      selected
                        ? "text-white/45"
                        : "text-neutral-400"
                    }`}
                  >
                    Additional businesses{" "}
                    <span
                      className={
                        selected
                          ? "text-white"
                          : "text-black"
                      }
                    >
                      +{plan.additionalBusiness}
                    </span>
                  </p>
                </div>

                {/* SELECTION */}
                <div
                  className={`mt-6 flex items-center justify-between border-t pt-5 ${
                    selected
                      ? "border-white/15"
                      : "border-black/10"
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-[0.2em]">
                    {selected
                      ? "Selected"
                      : "Select Plan"}
                  </span>

                  <span
                    className={`flex h-4 w-4 items-center justify-center border ${
                      selected
                        ? "border-white"
                        : "border-black/30"
                    }`}
                  >
                    {selected && (
                      <span className="h-1.5 w-1.5 bg-white" />
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        {/* ERROR */}
        {error && (
          <div className="mx-auto mt-8 max-w-[620px] border border-black/20 px-4 py-3">
            <p className="text-center text-xs font-light">
              {error}
            </p>
          </div>
        )}

        {/* CONTINUE */}
        <div className="mx-auto mt-10 max-w-[620px]">
          <button
            type="button"
            onClick={handleContinue}
            disabled={loading}
            className="flex w-full items-center justify-between bg-black px-6 py-4 text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-[10px] uppercase tracking-[0.22em]">
              {loading
                ? "Saving plan..."
                : `Continue with ${
                    plans.find(
                      (plan) =>
                        plan.id ===
                        selectedPlan
                    )?.name
                  }`}
            </span>

            {!loading && (
              <span aria-hidden="true">→</span>
            )}
          </button>

          <p className="mt-5 text-center text-[10px] font-light leading-5 text-neutral-400">
  Your 14-day trial includes full Executive access.
  Your selected plan begins when the trial ends.
  Cancel before then to avoid being charged.
</p>

          <p className="mt-2 text-center text-[9px] font-light text-neutral-300">
            *Subject to reasonable usage limits.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white" />
      }
    >
      <PlanSelection />
    </Suspense>
  );
}