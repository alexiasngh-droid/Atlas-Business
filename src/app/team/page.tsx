"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { createClient } from "@/lib/supabase/client";


type Agent = {
  id: string;
  agent_type: string;
  name: string;
  role_description: string;
  is_active: boolean;
};


type Business = {
  id: string;
  name: string;
};


const agentLabels: Record<
  string,
  {
    number: string;
    department: string;
    shortDescription: string;
  }
> = {
  ceo_strategy: {
    number: "01",
    department: "Executive Office",
    shortDescription:
      "Strategy, priorities, decisions, and team coordination.",
  },

  marketing: {
    number: "02",
    department: "Growth",
    shortDescription:
      "Positioning, campaigns, content, messaging, and audience growth.",
  },

  sales: {
    number: "03",
    department: "Revenue",
    shortDescription:
      "Outreach, pipeline, customer acquisition, and conversion.",
  },

  operations: {
    number: "04",
    department: "Operations",
    shortDescription:
      "Processes, execution, workflows, dependencies, and efficiency.",
  },

  research_intelligence: {
    number: "05",
    department: "Intelligence",
    shortDescription:
      "Markets, competitors, trends, research, and opportunities.",
  },
};


export default function AtlasTeamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const businessId =
    searchParams.get("business");

  const [business, setBusiness] =
    useState<Business | null>(null);

  const [agents, setAgents] =
    useState<Agent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    async function loadTeam() {
      if (!businessId) {
        setError(
          "No business was selected."
        );

        setLoading(false);
        return;
      }


      setLoading(true);
      setError("");


      // ---------------------------------------------
      // LOAD BUSINESS
      // ---------------------------------------------

      const {
        data: businessData,
        error: businessError,
      } = await supabase
        .from("businesses")
        .select("id, name")
        .eq("id", businessId)
        .single();


      if (
        businessError ||
        !businessData
      ) {
        console.error(
          "BUSINESS LOAD ERROR:",
          businessError
        );

        console.log(
          "BUSINESS ID:",
          businessId
        );

        setError(
          businessError?.message ??
            "We couldn't load this business."
        );

        setLoading(false);
        return;
      }


      // ---------------------------------------------
      // LOAD ATLAS AI TEAM
      // ---------------------------------------------

      const {
        data: agentData,
        error: agentError,
      } = await supabase
        .from("ai_agents")
        .select(
          "id, agent_type, name, role_description, is_active"
        )
        .eq("business_id", businessId)
        .eq("is_active", true);


      if (agentError) {
        console.error(
          "AGENT LOAD ERROR:",
          agentError
        );

        setError(
          "We couldn't load the Atlas AI Team."
        );

        setLoading(false);
        return;
      }


      setBusiness(businessData);
      setAgents(agentData ?? []);
      setLoading(false);
    }


    loadTeam();

  }, [businessId, supabase]);


  function getAgentOrder(
    agentType: string
  ) {
    const order = [
      "ceo_strategy",
      "marketing",
      "sales",
      "operations",
      "research_intelligence",
    ];

    return order.indexOf(
      agentType
    );
  }


  const orderedAgents =
    [...agents].sort(
      (a, b) =>
        getAgentOrder(
          a.agent_type
        ) -
        getAgentOrder(
          b.agent_type
        )
    );


  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black">

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">

          <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400">
            Loading Atlas AI Team
          </p>

        </div>

      </main>
    );
  }


  if (error) {
    return (
      <main className="min-h-screen bg-white text-black">

        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">

          <button
            type="button"
            onClick={() =>
              router.push(
                businessId
                  ? `/hq?business=${businessId}`
                  : "/hq"
              )
            }
            className="text-[9px] uppercase tracking-[0.22em] text-neutral-400 transition hover:text-black"
          >
            ← Back to HQ
          </button>


          <div className="mt-16 border border-black/10 p-8">

            <p className="text-sm font-light">
              {error}
            </p>

          </div>

        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-white text-black">

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-16">


        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            router.push(
              `/hq?business=${businessId}`
            )
          }
          className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-neutral-400 transition hover:text-black"
        >

          <span className="text-base font-light transition-transform group-hover:-translate-x-1">
            ←
          </span>

          Back to HQ

        </button>


        {/* HEADER */}

        <section className="mt-12 border-b border-black pb-10">

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">


            <div>

              <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                {business?.name}
              </p>


              <h1 className="mt-4 text-5xl font-light tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Atlas AI Team
              </h1>


              <p className="mt-6 max-w-2xl text-sm font-light leading-7 text-neutral-500">
                Your AI executive team. Each employee
                has a specialized role while working
                from the same company intelligence.
              </p>

            </div>


            <div className="border-l border-black/10 pl-6">

              <p className="text-[9px] uppercase tracking-[0.22em] text-neutral-400">
                Team Status
              </p>


              <p className="mt-2 text-sm font-light">
                {orderedAgents.length} active employees
              </p>

            </div>

          </div>

        </section>


        {/* SHARED INTELLIGENCE */}

        <section className="grid border-b border-black/10 lg:grid-cols-[1fr_2fr]">


          <div className="border-b border-black/10 py-8 lg:border-b-0 lg:border-r lg:pr-10">

            <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
              Shared Intelligence
            </p>


            <h2 className="mt-3 text-2xl font-light tracking-[-0.03em]">
              One company brain.
            </h2>

          </div>


          <div className="py-8 lg:pl-10">

            <p className="max-w-2xl text-sm font-light leading-7 text-neutral-500">
              Every Atlas employee works from your
              Business Brain and approved company
              memory. Their responsibilities remain
              distinct, but relevant intelligence can
              move across the team.
            </p>


            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">

              {[
                "Business Brain",
                "Company Memory",
                "Agent Work",
                "Cross-Agent Intelligence",
              ].map((item) => (

                <span
                  key={item}
                  className="text-[9px] uppercase tracking-[0.2em]"
                >
                  {item}
                </span>

              ))}

            </div>

          </div>

        </section>


        {/* TEAM */}

        <section className="py-14">


          <div className="mb-8 flex items-end justify-between">

            <div>

              <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                Executive Team
              </p>


              <h2 className="mt-3 text-3xl font-light tracking-[-0.04em]">
                Your employees
              </h2>

            </div>

          </div>


          <div className="border-t border-black">

            {orderedAgents.map(
              (agent) => {

                const details =
                  agentLabels[
                    agent.agent_type
                  ];


                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/team/${agent.id}?business=${businessId}`
                      )
                    }
                    className="group grid w-full border-b border-black/10 py-7 text-left transition hover:bg-neutral-50 md:grid-cols-[70px_1fr_1.2fr_80px] md:items-center"
                  >

                    <div className="text-[10px] tracking-[0.2em] text-neutral-400">
                      {details?.number}
                    </div>


                    <div className="mt-4 md:mt-0">

                      <p className="text-[9px] uppercase tracking-[0.22em] text-neutral-400">
                        {details?.department}
                      </p>


                      <h3 className="mt-2 text-xl font-light tracking-[-0.02em]">
                        {agent.name}
                      </h3>

                    </div>


                    <p className="mt-4 max-w-md text-xs font-light leading-6 text-neutral-500 md:mt-0">
                      {
                        details?.shortDescription
                      }
                    </p>


                    <div className="mt-5 text-right text-xl font-light transition-transform group-hover:translate-x-1 md:mt-0">
                      →
                    </div>

                  </button>
                );
              }
            )}

          </div>

        </section>


        {/* COLLABORATION */}

        <section className="mt-6 border border-black p-8 lg:p-10">

          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">


            <div>

              <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
                Team Intelligence
              </p>


              <h2 className="mt-4 text-3xl font-light tracking-[-0.04em]">
                Built to collaborate.
              </h2>

            </div>


            <div>

              <p className="text-sm font-light leading-7 text-neutral-500">
                Atlas employees do not operate as
                isolated assistants. Relevant research,
                strategy, operational findings, sales
                intelligence, and marketing work can be
                shared across the team while preserving
                the source and status of that
                information.
              </p>


              <div className="mt-8 grid gap-px bg-black/10 sm:grid-cols-3">


                <div className="bg-white p-5">

                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                    01
                  </p>

                  <p className="mt-3 text-xs font-light">
                    Specialized roles
                  </p>

                </div>


                <div className="bg-white p-5">

                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                    02
                  </p>

                  <p className="mt-3 text-xs font-light">
                    Shared intelligence
                  </p>

                </div>


                <div className="bg-white p-5">

                  <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                    03
                  </p>

                  <p className="mt-3 text-xs font-light">
                    Human approval
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}