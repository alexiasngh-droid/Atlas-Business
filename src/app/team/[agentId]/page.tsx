"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { supabase } from "@/lib/supabase";

type Agent = {
  id: string;
  business_id: string;
  agent_type: string;
  name: string;
  role_description: string;
};

type Business = {
  id: string;
  name: string;
};

type Message = {
  id: string;
  sender: "user" | "agent";
  content: string;
};

const agentDetails: Record<
  string,
  {
    department: string;
    specialty: string;
  }
> = {
  ceo_strategy: {
    department: "Executive Office",
    specialty:
      "Strategy · Priorities · Planning · Decisions · Team Coordination",
  },

  marketing: {
    department: "Growth",
    specialty:
      "Positioning · Campaigns · Content · Messaging · Audience Growth",
  },

  sales: {
    department: "Revenue",
    specialty:
      "Leads · Outreach · Pipeline · Acquisition · Conversion",
  },

  operations: {
    department: "Operations",
    specialty:
      "Processes · Workflows · Execution · Efficiency · Dependencies",
  },

  research_intelligence: {
    department: "Intelligence",
    specialty:
      "Markets · Competitors · Trends · Research · Opportunities",
  },
};

export default function AgentWorkspacePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const agentId = params.agentId as string;
  const businessId = searchParams.get("business");

  const [agent, setAgent] =
    useState<Agent | null>(null);

  const [business, setBusiness] =
    useState<Business | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState<Message[]>([]);

  useEffect(() => {
    async function loadWorkspace() {
      if (!businessId || !agentId) {
        setError(
          "This employee workspace could not be identified."
        );
        setLoading(false);
        return;
      }

      const {
        data: businessData,
        error: businessError,
      } = await supabase
        .from("businesses")
        .select("id, name")
        .eq("id", businessId)
        .single();

      if (businessError || !businessData) {
        setError(
          "We couldn't load this business."
        );
        setLoading(false);
        return;
      }

      const {
        data: agentData,
        error: agentError,
      } = await supabase
        .from("ai_agents")
        .select(
          "id, business_id, agent_type, name, role_description"
        )
        .eq("id", agentId)
        .eq("business_id", businessId)
        .single();

      if (agentError || !agentData) {
        setError(
          "We couldn't load this Atlas employee."
        );
        setLoading(false);
        return;
      }

      setBusiness(businessData);
      setAgent(agentData);
      setLoading(false);
    }

    loadWorkspace();
  }, [agentId, businessId]);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        sender: "user",
        content: trimmedMessage,
      },
    ]);

    setMessage("");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-black">
        <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
          Opening employee workspace
        </p>
      </main>
    );
  }

  if (error || !agent) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-black">
        <button
          type="button"
          onClick={() =>
            router.push(
              `/team?business=${businessId ?? ""}`
            )
          }
          className="text-[9px] uppercase tracking-[0.22em] text-neutral-400 hover:text-black"
        >
          ← Back to AI Team
        </button>

        <p className="mt-12 text-sm font-light">
          {error}
        </p>
      </main>
    );
  }

  const details =
    agentDetails[agent.agent_type];

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-16">

        {/* NAVIGATION */}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/team?business=${businessId}`
              )
            }
            className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-neutral-400 transition hover:text-black"
          >
            <span className="text-base transition-transform group-hover:-translate-x-1">
              ←
            </span>

            Atlas AI Team
          </button>

          <p className="text-[9px] uppercase tracking-[0.22em] text-neutral-400">
            {business?.name}
          </p>
        </div>


        {/* EMPLOYEE HEADER */}

        <section className="mt-12 border-b border-black pb-10">
          <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
            {details?.department}
          </p>

          <h1 className="mt-4 text-5xl font-light tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            {agent.name}
          </h1>

          <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            {details?.specialty}
          </p>

          <p className="mt-7 max-w-3xl text-sm font-light leading-7 text-neutral-500">
            {agent.role_description}
          </p>
        </section>


        {/* WORKSPACE */}

        <section className="grid min-h-[620px] lg:grid-cols-[260px_1fr]">

          {/* CONTEXT SIDEBAR */}

          <aside className="border-b border-black/10 py-8 lg:border-b-0 lg:border-r lg:pr-8">

            <p className="text-[9px] uppercase tracking-[0.24em] text-neutral-400">
              Working Context
            </p>

            <div className="mt-7 space-y-6">

              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                  Company
                </p>

                <p className="mt-2 text-xs font-light">
                  {business?.name}
                </p>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                  Intelligence
                </p>

                <div className="mt-3 space-y-2 text-xs font-light text-neutral-500">
                  <p>Business Brain</p>
                  <p>Company Memory</p>
                  <p>Specialist Workspace</p>
                  <p>Coworker Intelligence</p>
                </div>
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-neutral-400">
                  Status
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-black" />
                  <span className="text-xs font-light">
                    Active
                  </span>
                </div>
              </div>

            </div>
          </aside>


          {/* CONVERSATION */}

          <div className="flex min-h-[620px] flex-col py-8 lg:pl-10">

            <div className="border-b border-black/10 pb-6">
              <p className="text-[9px] uppercase tracking-[0.24em] text-neutral-400">
                Employee Workspace
              </p>

              <h2 className="mt-3 text-2xl font-light tracking-[-0.03em]">
                Work with {agent.name}
              </h2>
            </div>


            {/* MESSAGES */}

            <div className="flex-1 py-8">

              {messages.length === 0 ? (
                <div className="flex h-full min-h-[300px] items-center justify-center">
                  <div className="max-w-md text-center">

                    <p className="text-2xl font-light tracking-[-0.03em]">
                      What are we working on?
                    </p>

                    <p className="mt-4 text-sm font-light leading-7 text-neutral-400">
                      This employee will work within
                      their specialist role while using
                      relevant company intelligence.
                    </p>

                  </div>
                </div>
              ) : (
                <div className="space-y-8">

                  {messages.map((item) => (
                    <div
                      key={item.id}
                      className={
                        item.sender === "user"
                          ? "ml-auto max-w-2xl"
                          : "mr-auto max-w-2xl"
                      }
                    >
                      <p className="mb-2 text-[8px] uppercase tracking-[0.2em] text-neutral-400">
                        {item.sender === "user"
                          ? "You"
                          : agent.name}
                      </p>

                      <div
                        className={
                          item.sender === "user"
                            ? "border border-black bg-black px-5 py-4 text-sm font-light leading-7 text-white"
                            : "border border-black/10 px-5 py-4 text-sm font-light leading-7"
                        }
                      >
                        {item.content}
                      </div>
                    </div>
                  ))}

                </div>
              )}

            </div>


            {/* INPUT */}

            <form
              onSubmit={handleSubmit}
              className="border-t border-black pt-6"
            >
              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder={`Message ${agent.name}...`}
                rows={3}
                className="w-full resize-none border-0 bg-transparent text-sm font-light leading-7 outline-none placeholder:text-neutral-300"
              />

              <div className="mt-4 flex items-center justify-between">

                <p className="text-[9px] font-light text-neutral-400">
                  Shared company intelligence available
                </p>

                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="border border-black bg-black px-6 py-3 text-[9px] uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-200"
                >
                  Send
                </button>

              </div>
            </form>

          </div>

        </section>

      </div>
    </main>
  );
}