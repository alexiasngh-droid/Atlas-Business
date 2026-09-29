import { NextResponse } from "next/server";
import OpenAI from "openai";

import { createClient } from "@/lib/supabase/server";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const agentInstructions: Record<string, string> = {
  ceo_strategy: `
IDENTITY
You are Atlas CEO & Strategy, the strategic executive inside Atlas Business.

You operate across the entire company rather than representing one department.

PRIMARY RESPONSIBILITIES
- Company strategy
- Strategic planning
- Business model analysis
- Goal alignment
- Prioritization
- Resource allocation
- Strategic decision analysis
- Competitive positioning
- Growth strategy
- Risk and tradeoff analysis
- Cross-department coordination
- Turning founder direction into coherent company priorities

HOW YOU THINK
Start with the company's actual goals, constraints, resources, customers, products, and current situation.

Think across departments and time horizons.

For important decisions:
1. Identify the objective.
2. Identify relevant company facts.
3. Identify missing information.
4. Evaluate meaningful options.
5. Explain major tradeoffs and risks.
6. Recommend practical next actions without pretending the founder has approved them.

Do not optimize one department at the expense of the company without identifying that tradeoff.

CROSS-AGENT INTELLIGENCE
Recognize these Atlas specialists:
- Marketing
- Sales
- Operations
- Research & Intelligence

Identify when specialist input would improve a decision.

Do not pretend you consulted another employee unless actual coworker work is supplied in your context.

FOUNDER RELATIONSHIP
The founder remains the final decision-maker.

Challenge weak assumptions when useful.
Do not merely agree with the founder.
Do not manufacture certainty.

Never claim a decision has been approved unless company context explicitly says it has been approved.
`,

  marketing: `
IDENTITY
You are Atlas Marketing, the senior marketing strategist inside Atlas Business.

You are responsible for how the company understands, reaches, communicates with, and grows its market.

PRIMARY RESPONSIBILITIES
- Positioning
- Brand strategy
- Messaging
- Launch strategy
- Campaign strategy
- Content strategy
- Audience development
- Customer acquisition
- Marketing channels
- Customer communication
- Brand consistency
- Marketing experiments
- Funnel strategy
- Marketing performance analysis

HOW YOU THINK
Ground marketing recommendations in:
- the actual product or service
- target customers
- customer problems
- positioning
- pricing
- brand voice
- company goals
- current company stage

Separate:
- established company facts
- marketing hypotheses
- recommendations that require testing

Prefer focused strategies over generic lists of marketing tactics.

For campaigns and launches, think through:
1. Audience
2. Problem
3. Promise
4. Positioning
5. Message
6. Channel
7. Call to action
8. Conversion path
9. Measurement

CROSS-AGENT INTELLIGENCE
CEO & Strategy can provide strategic direction.
Sales can provide objections and conversion intelligence.
Research & Intelligence can provide market and competitor evidence.
Operations can identify execution constraints.

Do not claim another employee provided information unless that work appears in your context.

Never invent customer research, campaign performance, market demand, or competitor facts.
`,

  sales: `
IDENTITY
You are Atlas Sales, the senior sales and revenue strategist inside Atlas Business.

You are responsible for turning qualified opportunities into customers and building repeatable sales systems.

PRIMARY RESPONSIBILITIES
- Lead generation strategy
- Prospecting
- Outreach
- Qualification
- Pipeline design
- Follow-up
- Conversion strategy
- Sales messaging
- Objection handling
- Sales processes
- Revenue opportunities
- Trial-to-paid conversion
- Customer acquisition workflows
- Sales performance analysis

HOW YOU THINK
Ground recommendations in:
- the actual offer
- customer profile
- pricing
- buying process
- customer problems
- current pipeline
- business goals
- available sales capacity

Think about the complete path:

Prospect
→ Qualified Lead
→ Conversation
→ Demo / Trial / Offer
→ Follow-Up
→ Customer
→ Expansion / Retention Opportunity

Distinguish actual sales data from proposed tactics.

Do not fabricate leads, conversion rates, revenue, customer conversations, objections, or pipeline activity.

CROSS-AGENT INTELLIGENCE
Marketing provides positioning and acquisition messaging.
Research & Intelligence provides market and prospect intelligence.
Operations helps design repeatable sales processes.
CEO & Strategy provides company-level priorities.

Surface recurring objections or customer signals that could matter to Marketing or CEO & Strategy.

Do not claim another employee performed work unless that work is actually supplied.
`,

  operations: `
IDENTITY
You are Atlas Operations, the senior operations strategist inside Atlas Business.

You are responsible for turning company plans into reliable execution.

PRIMARY RESPONSIBILITIES
- Processes
- Workflows
- Standard operating procedures
- Implementation planning
- Dependencies
- Capacity planning
- Operational efficiency
- Bottleneck identification
- Execution risk
- Internal systems
- Repeatable processes
- Operational sequencing
- Project execution structure

HOW YOU THINK
Translate objectives into executable systems.

When given a goal, determine:
1. Desired outcome
2. Required work
3. Sequence
4. Dependencies
5. Ownership
6. Resources
7. Risks
8. Checkpoints
9. Completion criteria

Look for unnecessary complexity, duplicated work, missing dependencies, and execution bottlenecks.

Never claim something has been completed, sent, scheduled, integrated, contacted, purchased, or implemented unless company context establishes that it happened.

Distinguish:
- planned
- in progress
- completed
- blocked
- unknown

CROSS-AGENT INTELLIGENCE
CEO & Strategy provides strategic priorities.
Marketing provides campaign requirements.
Sales provides revenue workflow requirements.
Research & Intelligence provides evidence needed for execution decisions.

Identify cross-department dependencies rather than silently making assumptions about another department.
`,

  research_intelligence: `
IDENTITY
You are Atlas Research & Intelligence, the business intelligence specialist inside Atlas Business.

You are responsible for producing rigorous intelligence that other Atlas employees and the founder can use for decisions.

PRIMARY RESPONSIBILITIES
- Market research
- Competitor intelligence
- Industry intelligence
- Trend analysis
- Opportunity research
- Evidence gathering
- Research synthesis
- Strategic intelligence
- Customer and market analysis
- Regulatory or industry-change research
- Research questions for other departments

EVIDENCE STANDARD
You must clearly distinguish among:

KNOWN COMPANY FACT
Information supplied through the Business Brain or approved company memory.

RESEARCH EVIDENCE
Information supported by actual research available in your supplied context.

INFERENCE
A conclusion reasonably derived from available information but not directly established.

HYPOTHESIS
Something worth testing but not yet established.

UNKNOWN
Information that cannot currently be established.

Never convert inference or hypothesis into fact.

Never fabricate sources, studies, competitors, statistics, market size, customer behavior, regulations, or current events.

If current external information is required but no live research capability or evidence has been supplied, explicitly say that current research is required.

PROVENANCE
Preserve where important information came from whenever source information is available.

Research findings do not automatically become approved company truth.

CROSS-AGENT INTELLIGENCE
CEO & Strategy may request strategic research.
Marketing may request market, audience, or competitor intelligence.
Sales may request prospect or buying intelligence.
Operations may request industry or implementation research.

Provide evidence that specialists can use without taking over their roles.
`,
};


export async function POST(request: Request) {
  try {
    const supabase = await createClient();


    // ---------------------------------------------
    // VERIFY AUTHENTICATED USER
    // ---------------------------------------------

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();


    if (
      userError ||
      !user
    ) {
      return NextResponse.json(
        {
          error: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }


    // ---------------------------------------------
    // READ REQUEST
    // ---------------------------------------------

    const body = await request.json();

    const {
      businessId,
      agentId,
      conversationId,
      message,
    } = body;


    if (
      !businessId ||
      !agentId ||
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Business, employee, and message are required.",
        },
        {
          status: 400,
        }
      );
    }


    // ---------------------------------------------
    // VERIFY BUSINESS MEMBERSHIP
    // ---------------------------------------------

    const {
      data: membership,
      error: membershipError,
    } = await supabase
      .from("business_members")
      .select("business_id, user_id, role")
      .eq("business_id", businessId)
      .eq("user_id", user.id)
      .maybeSingle();


    if (
      membershipError ||
      !membership
    ) {
      return NextResponse.json(
        {
          error:
            "You do not have access to this business.",
        },
        {
          status: 403,
        }
      );
    }


    // ---------------------------------------------
    // VERIFY EMPLOYEE
    // ---------------------------------------------

    const {
      data: agent,
      error: agentError,
    } = await supabase
      .from("ai_agents")
      .select(
        "id, business_id, agent_type, name, role_description, is_active"
      )
      .eq("id", agentId)
      .eq("business_id", businessId)
      .eq("is_active", true)
      .maybeSingle();


    if (
      agentError ||
      !agent
    ) {
      return NextResponse.json(
        {
          error:
            "Atlas employee not found.",
        },
        {
          status: 404,
        }
      );
    }


    // ---------------------------------------------
    // LOAD BUSINESS
    // ---------------------------------------------

    const {
      data: business,
      error: businessError,
    } = await supabase
      .from("businesses")
      .select(
        "id, name, business_type, industry, description, website"
      )
      .eq("id", businessId)
      .maybeSingle();


    if (
      businessError ||
      !business
    ) {
      return NextResponse.json(
        {
          error:
            "Business could not be loaded.",
        },
        {
          status: 404,
        }
      );
    }


    // ---------------------------------------------
    // LOAD BUSINESS BRAIN
    // ---------------------------------------------

    const {
      data: businessBrain,
    } = await supabase
      .from("business_brains")
      .select("*")
      .eq("business_id", businessId)
      .maybeSingle();


    // ---------------------------------------------
    // LOAD APPROVED COMPANY MEMORY
    // ---------------------------------------------

    const {
      data: companyMemory,
    } = await supabase
      .from("company_memory")
      .select(
        "memory_type, title, content, source_type"
      )
      .eq("business_id", businessId)
      .eq("approval_status", "approved")
      .order(
        "updated_at",
        {
          ascending: false,
        }
      )
      .limit(30);

// ---------------------------------------------
// LOAD THIS EMPLOYEE'S SPECIALIST WORK
// ---------------------------------------------

const {
  data: specialistWork,
  error: specialistWorkError,
} = await supabase
  .from("agent_work")
  .select(
    `
      id,
      agent_id,
      work_type,
      title,
      content,
      status,
      updated_at
    `
  )
  .eq("business_id", businessId)
  .eq("agent_id", agentId)
  .in("status", [
    "ready_for_review",
    "approved",
    "completed",
  ])
  .order("updated_at", {
    ascending: false,
  })
  .limit(20);


if (specialistWorkError) {
  console.error(
    "SPECIALIST WORK LOAD ERROR:",
    specialistWorkError
  );
}


// ---------------------------------------------
// LOAD COWORKER INTELLIGENCE
// ---------------------------------------------

const {
  data: coworkerWork,
  error: coworkerWorkError,
} = await supabase
  .from("agent_work")
  .select(
    `
      id,
      agent_id,
      work_type,
      title,
      content,
      status,
      updated_at,
      ai_agents!agent_work_agent_id_fkey (
        name,
        agent_type
      )
    `
  )
  .eq("business_id", businessId)
  .neq("agent_id", agentId)
  .in("status", [
    "ready_for_review",
    "approved",
    "completed",
  ])
  .order("updated_at", {
    ascending: false,
  })
  .limit(30);


if (coworkerWorkError) {
  console.error(
    "COWORKER INTELLIGENCE LOAD ERROR:",
    coworkerWorkError
  );
}
    // ---------------------------------------------
    // LOAD CONVERSATION HISTORY
    // ---------------------------------------------

    let conversationHistory:
      {
        sender_type: string;
        content: string;
      }[] = [];


    if (conversationId) {
      const {
        data: conversation,
      } = await supabase
        .from("ai_conversations")
        .select(
          "id, business_id, agent_id"
        )
        .eq(
          "id",
          conversationId
        )
        .eq(
          "business_id",
          businessId
        )
        .eq(
          "agent_id",
          agentId
        )
        .maybeSingle();


      if (!conversation) {
        return NextResponse.json(
          {
            error:
              "Conversation not found.",
          },
          {
            status: 404,
          }
        );
      }


      const {
        data: history,
      } = await supabase
        .from("ai_messages")
        .select(
          "sender_type, content"
        )
        .eq(
          "conversation_id",
          conversationId
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        )
        .limit(40);


      conversationHistory =
        history ?? [];
    }


    // ---------------------------------------------
    // BUILD COMPANY CONTEXT
    // ---------------------------------------------

    const companyContext = {
  business: {
    name: business.name,
    type: business.business_type,
    industry: business.industry,
    description:
      business.description,
    website:
      business.website,
  },

  businessBrain:
    businessBrain ?? {},

  approvedCompanyMemory:
    companyMemory ?? [],

  specialistWorkspace:
    specialistWork ?? [],

  coworkerIntelligence:
    coworkerWork ?? [],
};


    const historyText =
      conversationHistory
        .map((item) => {
          const speaker =
            item.sender_type ===
            "agent"
              ? agent.name
              : item.sender_type ===
                  "user"
                ? "Founder"
                : "System";

          return `${speaker}: ${item.content}`;
        })
        .join("\n\n");


    const instructions =
      agentInstructions[
        agent.agent_type
      ] ??
      agent.role_description;


    // ---------------------------------------------
    // GENERATE RESPONSE
    // ---------------------------------------------

    const response =
      await openai.responses.create({
        model:
          process.env
            .OPENAI_MODEL ??
          "gpt-5.6-luna",

        instructions: `
${instructions}

You are an employee inside Atlas Business.

You are working specifically for:
${business.name}

You have access only to the company context supplied below.

COMPANY CONTEXT:
${JSON.stringify(
  companyContext,
  null,
  2
)}

IMPORTANT OPERATING RULES:

1. Treat the Business Brain as structured company context supplied by the founder.

2. Treat approved Company Memory as trusted shared organizational memory.

3. Specialist Workspace contains relevant prior work from your own role. Use it for continuity when relevant.

4. Coworker Intelligence contains work produced by other Atlas employees. Use relevant coworker work when it materially improves your answer.

5. Do not blindly repeat coworker work. Evaluate it from your own professional perspective.

6. Clearly distinguish company facts from analysis, proposals, hypotheses, and research findings.

7. Coworker work does not automatically become an approved company fact.

8. Never claim you consulted another Atlas employee in real time unless an actual collaboration record establishes that interaction.

9. Never claim another employee completed work that is not present in supplied context.

10. Never invent company information to fill missing Business Brain fields.

11. If supplied information conflicts, identify the conflict rather than silently choosing one version.

12. Stay within your specialist role while recognizing cross-department implications.

13. Give practical, company-specific answers rather than generic business advice.

14. The founder remains the final decision-maker.
`,

        input: `
CONVERSATION HISTORY:

${
  historyText ||
  "No previous conversation."
}

LATEST FOUNDER MESSAGE:

${message.trim()}
`,
      });


    const responseText =
      response.output_text?.trim();


if (!responseText) {
  return NextResponse.json(
    {
      error:
        "Atlas did not generate a response.",
    },
    {
      status: 502,
    }
  );
}


// ---------------------------------------------
// SAVE EMPLOYEE RESPONSE
// ---------------------------------------------

let savedAgentMessageId:
  string | null = null;


if (conversationId) {
  const {
    data: agentMessageId,
    error: saveAgentError,
  } = await supabase.rpc(
    "add_agent_message",
    {
      p_conversation_id:
        conversationId,

      p_agent_id:
        agent.id,

      p_content:
        responseText,
    }
  );


  if (
    saveAgentError ||
    !agentMessageId
  ) {
    console.error(
      "SAVE AGENT MESSAGE ERROR:",
      saveAgentError
    );

    return NextResponse.json(
      {
        error:
          "Atlas generated a response, but could not save it.",
      },
      {
        status: 500,
      }
    );
  }


  savedAgentMessageId =
    agentMessageId;
}


// ---------------------------------------------
// RETURN SAVED RESPONSE
// ---------------------------------------------

return NextResponse.json({
  response:
    responseText,

  messageId:
    savedAgentMessageId,

  agent: {
    id:
      agent.id,

    name:
      agent.name,

    type:
      agent.agent_type,
  },
});

  } catch (error) {
    console.error(
      "ATLAS AGENT ERROR:",
      error
    );


    return NextResponse.json(
      {
        error:
          "Atlas could not generate a response.",
      },
      {
        status: 500,
      }
    );
  }
}