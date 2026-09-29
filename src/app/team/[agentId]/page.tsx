"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useSearchParams,
} from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import AtlasAppShell from "@/components/atlas/AtlasAppShell";


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


type Conversation = {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
};


type DatabaseMessage = {
  id: string;
  sender_type:
    | "user"
    | "agent"
    | "system";
  agent_id: string | null;
  content: string;
  created_at: string;
};


type SpeechRecognitionEventLike = {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: {
        transcript: string;
      };
    };
  };
};


type SpeechRecognitionErrorEventLike = {
  error: string;
};


type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;

  onresult:
    | ((
        event: SpeechRecognitionEventLike
      ) => void)
    | null;

  onerror:
    | ((
        event: SpeechRecognitionErrorEventLike
      ) => void)
    | null;

  onend:
    | (() => void)
    | null;
};


type SpeechRecognitionConstructor =
  new () => SpeechRecognitionLike;


type SpeechWindow = Window & {
  SpeechRecognition?:
    SpeechRecognitionConstructor;

  webkitSpeechRecognition?:
    SpeechRecognitionConstructor;
};


const agentDetails: Record<
  string,
  {
    department: string;
    specialty: string;
  }
> = {
  ceo_strategy: {
    department:
      "Executive Office",
    specialty:
      "Strategy · Priorities · Planning · Decisions · Team Coordination",
  },

  marketing: {
    department:
      "Growth",
    specialty:
      "Positioning · Campaigns · Content · Messaging · Audience Growth",
  },

  sales: {
    department:
      "Revenue",
    specialty:
      "Leads · Outreach · Pipeline · Acquisition · Conversion",
  },

  operations: {
    department:
      "Operations",
    specialty:
      "Processes · Workflows · Execution · Efficiency · Dependencies",
  },

  research_intelligence: {
    department:
      "Intelligence",
    specialty:
      "Markets · Competitors · Trends · Research · Opportunities",
  },
};


export default function AgentWorkspacePage() {
  const params =
    useParams();

  const searchParams =
    useSearchParams();

  const [supabase] =
    useState(() =>
      createClient()
    );


  const agentId =
    params.agentId as string;

  const businessId =
    searchParams.get(
      "business"
    );


  const [
    agent,
    setAgent,
  ] =
    useState<Agent | null>(
      null
    );


  const [
    business,
    setBusiness,
  ] =
    useState<Business | null>(
      null
    );


  const [
    conversations,
    setConversations,
  ] =
    useState<Conversation[]>(
      []
    );


  const [
    conversationId,
    setConversationId,
  ] =
    useState<string | null>(
      null
    );


  const [
    messages,
    setMessages,
  ] =
    useState<
      DatabaseMessage[]
    >([]);


  const [
    message,
    setMessage,
  ] =
    useState("");


  const [
    loading,
    setLoading,
  ] =
    useState(true);


  const [
    loadingConversation,
    setLoadingConversation,
  ] =
    useState(false);


  const [
    sending,
    setSending,
  ] =
    useState(false);


  const [
    error,
    setError,
  ] =
    useState("");


  const [
    savingWorkId,
    setSavingWorkId,
  ] =
    useState<string | null>(
      null
    );


  const [
    savedWorkIds,
    setSavedWorkIds,
  ] =
    useState<string[]>([]);


  const [
    isListening,
    setIsListening,
  ] =
    useState(false);


  const [
    speechRecognition,
    setSpeechRecognition,
  ] =
    useState<
      SpeechRecognitionLike | null
    >(null);


  const [
    dictationSupported,
    setDictationSupported,
  ] =
    useState(false);


  // ---------------------------------------------
  // LOAD EMPLOYEE WORKSPACE
  // ---------------------------------------------

  useEffect(() => {
    async function loadWorkspace() {
      if (
        !businessId ||
        !agentId
      ) {
        setError(
          "This employee workspace could not be identified."
        );

        setLoading(false);

        return;
      }


      setLoading(true);
      setError("");


      // -----------------------------------------
      // LOAD BUSINESS
      // -----------------------------------------

      const {
        data: businessData,
        error: businessError,
      } =
        await supabase
          .from("businesses")
          .select("id, name")
          .eq(
            "id",
            businessId
          )
          .single();


      if (
        businessError ||
        !businessData
      ) {
        console.error(
          "BUSINESS LOAD ERROR:",
          businessError
        );

        setError(
          "We couldn't load this business."
        );

        setLoading(false);

        return;
      }


      // -----------------------------------------
      // LOAD EMPLOYEE
      // -----------------------------------------

      const {
        data: agentData,
        error: agentError,
      } =
        await supabase
          .from("ai_agents")
          .select(
            `
              id,
              business_id,
              agent_type,
              name,
              role_description
            `
          )
          .eq(
            "id",
            agentId
          )
          .eq(
            "business_id",
            businessId
          )
          .single();


      if (
        agentError ||
        !agentData
      ) {
        console.error(
          "AGENT LOAD ERROR:",
          agentError
        );

        setError(
          "We couldn't load this Atlas employee."
        );

        setLoading(false);

        return;
      }


      setBusiness(
        businessData
      );

      setAgent(
        agentData
      );


      // -----------------------------------------
      // LOAD ALL CONVERSATIONS
      // -----------------------------------------

      const {
        data:
          conversationData,

        error:
          conversationError,
      } =
        await supabase
          .from(
            "ai_conversations"
          )
          .select(
            `
              id,
              title,
              created_at,
              updated_at
            `
          )
          .eq(
            "business_id",
            businessId
          )
          .eq(
            "agent_id",
            agentId
          )
          .order(
            "updated_at",
            {
              ascending:
                false,
            }
          );


      if (
        conversationError
      ) {
        console.error(
          "CONVERSATION LOAD ERROR:",
          conversationError
        );

        setError(
          "We couldn't load this employee's conversations."
        );

        setLoading(false);

        return;
      }


      const loadedConversations =
        (conversationData ??
          []) as Conversation[];


      setConversations(
        loadedConversations
      );


      // -----------------------------------------
      // OPEN MOST RECENT CONVERSATION
      // -----------------------------------------

      if (
        loadedConversations.length >
        0
      ) {
        const newest =
          loadedConversations[0];

        setConversationId(
          newest.id
        );


        const {
          data:
            messageData,

          error:
            messageError,
        } =
          await supabase
            .from(
              "ai_messages"
            )
            .select(
              `
                id,
                sender_type,
                agent_id,
                content,
                created_at
              `
            )
            .eq(
              "conversation_id",
              newest.id
            )
            .order(
              "created_at",
              {
                ascending:
                  true,
              }
            );


        if (messageError) {
          console.error(
            "MESSAGE LOAD ERROR:",
            messageError
          );

          setError(
            "We couldn't load this conversation."
          );

          setLoading(false);

          return;
        }


        setMessages(
          (messageData ??
            []) as DatabaseMessage[]
        );
      } else {
        setConversationId(
          null
        );

        setMessages([]);
      }


      setLoading(false);
    }


    loadWorkspace();

  }, [
    agentId,
    businessId,
    supabase,
  ]);


  // ---------------------------------------------
  // SET UP DICTATION
  // ---------------------------------------------

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }


    const speechWindow =
      window as SpeechWindow;


    const Recognition =
      speechWindow
        .SpeechRecognition ??
      speechWindow
        .webkitSpeechRecognition;


    if (!Recognition) {
      setDictationSupported(
        false
      );

      return;
    }


    setDictationSupported(
      true
    );


    const recognition =
      new Recognition();


    recognition.continuous =
      true;

    recognition.interimResults =
      true;

    recognition.lang =
      "en-US";


    recognition.onresult = (
      event
    ) => {
      let finalTranscript =
        "";

      let interimTranscript =
        "";


      for (
        let index = 0;
        index <
        event.results.length;
        index += 1
      ) {
        const result =
          event.results[
            index
          ];

        const transcript =
          result[0]
            .transcript;


        if (
          result.isFinal
        ) {
          finalTranscript +=
            transcript;
        } else {
          interimTranscript +=
            transcript;
        }
      }


      if (
        finalTranscript.trim()
      ) {
        setMessage(
          (current) => {
            const spacer =
              current.trim()
                ? " "
                : "";

            return `${current}${spacer}${finalTranscript.trim()}`;
          }
        );
      }


      if (
        interimTranscript
      ) {
        // Interim speech is intentionally
        // not permanently appended.
        // Only finalized speech is added.
      }
    };


    recognition.onerror = (
      event
    ) => {
      console.error(
        "DICTATION ERROR:",
        event.error
      );

      setIsListening(
        false
      );


      if (
        event.error ===
        "not-allowed" ||
        event.error ===
        "service-not-allowed"
      ) {
        setError(
          "Microphone access was not allowed. Check your browser microphone permissions and try again."
        );
      } else {
        setError(
          "Dictation stopped unexpectedly. You can continue typing your message."
        );
      }
    };


    recognition.onend =
      () => {
        setIsListening(
          false
        );
      };


    setSpeechRecognition(
      recognition
    );


    return () => {
      try {
        recognition.stop();
      } catch {
        // Recognition may already be stopped.
      }
    };

  }, []);


  // ---------------------------------------------
  // LOAD A SPECIFIC CONVERSATION
  // ---------------------------------------------

  async function openConversation(
    selectedConversationId:
      string
  ) {
    if (
      sending ||
      loadingConversation
    ) {
      return;
    }


    setLoadingConversation(
      true
    );

    setError("");

    setSavedWorkIds([]);

    setConversationId(
      selectedConversationId
    );


    const {
      data:
        messageData,

      error:
        messageError,
    } =
      await supabase
        .from("ai_messages")
        .select(
          `
            id,
            sender_type,
            agent_id,
            content,
            created_at
          `
        )
        .eq(
          "conversation_id",
          selectedConversationId
        )
        .order(
          "created_at",
          {
            ascending:
              true,
          }
        );


    if (messageError) {
      console.error(
        "MESSAGE LOAD ERROR:",
        messageError
      );

      setError(
        "We couldn't load this conversation."
      );

      setLoadingConversation(
        false
      );

      return;
    }


    setMessages(
      (messageData ??
        []) as DatabaseMessage[]
    );

    setMessage("");

    setLoadingConversation(
      false
    );
  }


  // ---------------------------------------------
  // NEW CHAT
  // ---------------------------------------------

  function startNewChat() {
    if (sending) {
      return;
    }


    if (isListening) {
      speechRecognition
        ?.stop();

      setIsListening(
        false
      );
    }


    setConversationId(
      null
    );

    setMessages([]);

    setMessage("");

    setError("");

    setSavedWorkIds([]);
  }


  // ---------------------------------------------
  // REFRESH CONVERSATION LIST
  // ---------------------------------------------

  async function refreshConversations(
    activeId?: string
  ) {
    if (
      !businessId ||
      !agentId
    ) {
      return;
    }


    const {
      data,
      error:
        conversationError,
    } =
      await supabase
        .from(
          "ai_conversations"
        )
        .select(
          `
            id,
            title,
            created_at,
            updated_at
          `
        )
        .eq(
          "business_id",
          businessId
        )
        .eq(
          "agent_id",
          agentId
        )
        .order(
          "updated_at",
          {
            ascending:
              false,
          }
        );


    if (
      conversationError
    ) {
      console.error(
        "CONVERSATION REFRESH ERROR:",
        conversationError
      );

      return;
    }


    const refreshed =
      (data ??
        []) as Conversation[];


    setConversations(
      refreshed
    );


    if (activeId) {
      setConversationId(
        activeId
      );
    }
  }


  // ---------------------------------------------
  // DICTATION
  // ---------------------------------------------

  function toggleDictation() {
    setError("");


    if (
      !dictationSupported ||
      !speechRecognition
    ) {
      setError(
        "Dictation isn't supported in this browser. You can continue typing normally."
      );

      return;
    }


    if (isListening) {
      speechRecognition.stop();

      setIsListening(
        false
      );

      return;
    }


    try {
      speechRecognition.start();

      setIsListening(
        true
      );
    } catch (
      dictationError
    ) {
      console.error(
        "START DICTATION ERROR:",
        dictationError
      );

      setError(
        "Dictation couldn't start. Check your microphone permissions and try again."
      );

      setIsListening(
        false
      );
    }
  }


  // ---------------------------------------------
  // SEND MESSAGE
  // ---------------------------------------------

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    if (
      !businessId ||
      !agentId ||
      !agent
    ) {
      return;
    }


    const trimmedMessage =
      message.trim();


    if (
      !trimmedMessage
    ) {
      return;
    }


    if (isListening) {
      speechRecognition
        ?.stop();

      setIsListening(
        false
      );
    }


    setSending(true);

    setError("");


    let activeConversationId =
      conversationId;


    try {

      // -----------------------------------------
      // CREATE CONVERSATION IF NEEDED
      // -----------------------------------------

      if (
        !activeConversationId
      ) {
        const title =
          trimmedMessage.length >
          70
            ? `${trimmedMessage.slice(
                0,
                67
              )}...`
            : trimmedMessage;


        const {
          data:
            newConversationId,

          error:
            conversationError,
        } =
          await supabase.rpc(
            "create_agent_conversation",
            {
              p_business_id:
                businessId,

              p_agent_id:
                agentId,

              p_title:
                title,
            }
          );


        if (
          conversationError ||
          !newConversationId
        ) {
          console.error(
            "CREATE CONVERSATION ERROR:",
            conversationError
          );

          setError(
            conversationError
              ?.message ??
              "We couldn't start this conversation."
          );

          return;
        }


        activeConversationId =
          newConversationId;


        setConversationId(
          newConversationId
        );


        await refreshConversations(
          newConversationId
        );
      }


      // -----------------------------------------
      // SAVE FOUNDER MESSAGE
      // -----------------------------------------

      const {
        data:
          newMessageId,

        error:
          messageError,
      } =
        await supabase.rpc(
          "add_user_agent_message",
          {
            p_conversation_id:
              activeConversationId,

            p_content:
              trimmedMessage,
          }
        );


      if (
        messageError ||
        !newMessageId
      ) {
        console.error(
          "SAVE MESSAGE ERROR:",
          messageError
        );

        setError(
          messageError
            ?.message ??
            "We couldn't save your message."
        );

        return;
      }


      const savedMessage:
        DatabaseMessage = {
          id:
            newMessageId,

          sender_type:
            "user",

          agent_id:
            null,

          content:
            trimmedMessage,

          created_at:
            new Date()
              .toISOString(),
        };


      setMessages(
        (current) => [
          ...current,
          savedMessage,
        ]
      );


      setMessage("");


      // -----------------------------------------
      // ASK ATLAS EMPLOYEE
      // -----------------------------------------

      const response =
        await fetch(
          "/api/agents/respond",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                businessId,
                agentId,

                conversationId:
                  activeConversationId,

                message:
                  trimmedMessage,
              }),
          }
        );


      const result =
        await response.json();


      if (!response.ok) {
        console.error(
          "ATLAS AI ERROR:",
          result
        );

        setError(
          result?.error ??
            "Atlas could not generate a response."
        );

        return;
      }


      if (
        !result.response
      ) {
        setError(
          "Atlas returned an empty response."
        );

        return;
      }


      // -----------------------------------------
      // SHOW EMPLOYEE RESPONSE
      // -----------------------------------------

      const agentMessage:
        DatabaseMessage = {
          id:
            result.messageId ??
            `temporary-${Date.now()}`,

          sender_type:
            "agent",

          agent_id:
            agent.id,

          content:
            result.response,

          created_at:
            new Date()
              .toISOString(),
        };


      setMessages(
        (current) => [
          ...current,
          agentMessage,
        ]
      );


      if (activeConversationId) {
  await refreshConversations(
    activeConversationId
  );
}

    } catch (
      submitError
    ) {
      console.error(
        "SEND MESSAGE ERROR:",
        submitError
      );

      setError(
        "Atlas encountered an unexpected error."
      );

    } finally {
      setSending(false);
    }
  }


  // ---------------------------------------------
  // SAVE EMPLOYEE WORK PRODUCT
  // ---------------------------------------------

  async function saveWorkProduct(
    item:
      DatabaseMessage
  ) {
    if (
      !businessId ||
      !agent ||
      item.sender_type !==
        "agent"
    ) {
      return;
    }


    if (
      savedWorkIds.includes(
        item.id
      )
    ) {
      return;
    }


    setSavingWorkId(
      item.id
    );

    setError("");


    const title =
      item.content.length >
      70
        ? `${item.content.slice(
            0,
            67
          )}...`
        : item.content;


    const {
      error:
        saveWorkError,
    } =
      await supabase.rpc(
        "create_agent_work",
        {
          p_business_id:
            businessId,

          p_agent_id:
            agent.id,

          p_work_type:
            "work_product",

          p_title:
            title,

          p_content:
            item.content,
        }
      );


    if (
      saveWorkError
    ) {
      console.error(
        "SAVE WORK PRODUCT ERROR:",
        saveWorkError
      );

      setError(
        saveWorkError
          .message ??
          "We couldn't save this work product."
      );

      setSavingWorkId(
        null
      );

      return;
    }


    setSavedWorkIds(
      (current) => [
        ...current,
        item.id,
      ]
    );


    setSavingWorkId(
      null
    );
  }


  // ---------------------------------------------
  // PAGE TITLE
  // ---------------------------------------------

  const pageTitle =
    agent?.name ??
    "Atlas AI Team";


  const details =
    agent
      ? agentDetails[
          agent.agent_type
        ]
      : null;


  // ---------------------------------------------
  // RENDER
  // ---------------------------------------------

  return (
    <AtlasAppShell
      pageTitle={
        pageTitle
      }
    >

      <div className="px-10 py-12">


        {loading ? (

          <div className="py-16">

            <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
              Opening employee workspace
            </p>

          </div>

        ) : !agent ? (

          <div className="py-16">

            <p className="text-sm font-light">
              {error ||
                "This Atlas employee could not be loaded."}
            </p>

          </div>

        ) : (

          <div className="mx-auto max-w-[1400px]">


            {/* EMPLOYEE HEADER */}

            <section className="border-b border-black pb-10">

              <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

                <div>

                  <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                    {
                      details
                        ?.department
                    }
                  </p>


                  <h1 className="mt-4 text-5xl font-light tracking-[-0.05em] sm:text-6xl">
                    {
                      agent.name
                    }
                  </h1>


                  <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                    {
                      details
                        ?.specialty
                    }
                  </p>


                  <p className="mt-7 max-w-3xl text-sm font-light leading-7 text-neutral-500">
                    {
                      agent
                        .role_description
                    }
                  </p>

                </div>


                <div className="shrink-0">

                  <p className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">
                    Company
                  </p>

                  <p className="mt-2 text-xs font-light">
                    {
                      business
                        ?.name
                    }
                  </p>

                </div>

              </div>

            </section>


            {/* EMPLOYEE WORKSPACE */}

            <section className="grid min-h-[680px] lg:grid-cols-[280px_1fr]">


              {/* CHAT HISTORY */}

              <aside className="border-b border-black/10 py-8 lg:border-b-0 lg:border-r lg:pr-8">


                <div className="flex items-center justify-between">

                  <p className="text-[9px] uppercase tracking-[0.24em] text-neutral-400">
                    Conversations
                  </p>

                </div>


                <button
                  type="button"
                  onClick={
                    startNewChat
                  }
                  disabled={
                    sending
                  }
                  className="mt-6 w-full border border-black bg-black px-4 py-3 text-left text-[9px] uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  + New Chat
                </button>


                {/* CURRENT NEW CHAT */}

                {!conversationId && (

                  <div className="mt-6 border-l-2 border-black px-4 py-3">

                    <p className="text-[8px] uppercase tracking-[0.18em] text-neutral-400">
                      New conversation
                    </p>

                    <p className="mt-2 text-xs font-light">
                      Untitled
                    </p>

                  </div>

                )}


                {/* CONVERSATION LIST */}

                <div className="mt-7">

                  {conversations.length ===
                  0 ? (

                    <p className="text-xs font-light leading-6 text-neutral-400">
                      Your conversations with{" "}
                      {agent.name} will appear here.
                    </p>

                  ) : (

                    <div className="space-y-1">

                      {conversations.map(
                        (
                          conversation
                        ) => {

                          const selected =
                            conversation.id ===
                            conversationId;


                          return (
                            <button
                              key={
                                conversation.id
                              }
                              type="button"
                              onClick={() =>
                                openConversation(
                                  conversation.id
                                )
                              }
                              disabled={
                                sending ||
                                loadingConversation
                              }
                              className={`w-full border-l-2 px-4 py-3 text-left transition ${
                                selected
                                  ? "border-black bg-neutral-50"
                                  : "border-transparent hover:border-black/20 hover:bg-neutral-50"
                              }`}
                            >

                              <p className="line-clamp-2 text-xs font-light leading-5">
                                {
                                  conversation.title ||
                                  "Untitled conversation"
                                }
                              </p>


                              <p className="mt-2 text-[8px] uppercase tracking-[0.14em] text-neutral-400">
                                {
                                  formatConversationDate(
                                    conversation.updated_at
                                  )
                                }
                              </p>

                            </button>
                          );
                        }
                      )}

                    </div>

                  )}

                </div>


                {/* INTELLIGENCE CONTEXT */}

                <div className="mt-10 border-t border-black/10 pt-7">

                  <p className="text-[9px] uppercase tracking-[0.24em] text-neutral-400">
                    Working Intelligence
                  </p>


                  <div className="mt-5 space-y-2 text-xs font-light text-neutral-500">

                    <p>
                      Business Brain
                    </p>

                    <p>
                      Company Memory
                    </p>

                    <p>
                      Specialist Workspace
                    </p>

                    <p>
                      Coworker Intelligence
                    </p>

                  </div>

                </div>


                {/* STATUS */}

                <div className="mt-8">

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

              </aside>


              {/* CONVERSATION */}

              <div className="flex min-h-[680px] min-w-0 flex-col py-8 lg:pl-10">


                {/* WORKSPACE HEADER */}

                <div className="flex items-end justify-between border-b border-black/10 pb-6">

                  <div>

                    <p className="text-[9px] uppercase tracking-[0.24em] text-neutral-400">
                      Employee Workspace
                    </p>


                    <h2 className="mt-3 text-2xl font-light tracking-[-0.03em]">
                      Work with{" "}
                      {
                        agent.name
                      }
                    </h2>

                  </div>


                  <p className="hidden text-[8px] uppercase tracking-[0.18em] text-neutral-400 sm:block">
                    {conversationId
                      ? "Saved conversation"
                      : "New conversation"}
                  </p>

                </div>


                {/* ERROR */}

                {error && (

                  <div className="mt-6 border border-black/10 px-5 py-4">

                    <p className="text-xs font-light leading-5 text-neutral-500">
                      {error}
                    </p>

                  </div>

                )}


                {/* MESSAGES */}

                <div className="flex-1 py-8">


                  {loadingConversation ? (

                    <div className="flex min-h-[300px] items-center justify-center">

                      <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                        Opening conversation
                      </p>

                    </div>

                  ) : messages.length ===
                    0 ? (

                    <div className="flex h-full min-h-[340px] items-center justify-center">

                      <div className="max-w-md text-center">

                        <p className="text-2xl font-light tracking-[-0.03em]">
                          What are we working on?
                        </p>


                        <p className="mt-4 text-sm font-light leading-7 text-neutral-400">
                          Start a new conversation with{" "}
                          {agent.name}. They&apos;ll work within their specialist role while using relevant company intelligence.
                        </p>

                      </div>

                    </div>

                  ) : (

                    <div className="space-y-8">

                      {messages.map(
                        (
                          item
                        ) => {

                          const isUser =
                            item.sender_type ===
                            "user";


                          const isSaving =
                            savingWorkId ===
                            item.id;


                          const isSaved =
                            savedWorkIds.includes(
                              item.id
                            );


                          return (
                            <div
                              key={
                                item.id
                              }
                              className={
                                isUser
                                  ? "ml-auto max-w-2xl"
                                  : "mr-auto max-w-2xl"
                              }
                            >

                              <p className="mb-2 text-[8px] uppercase tracking-[0.2em] text-neutral-400">

                                {isUser
                                  ? "You"
                                  : agent.name}

                              </p>


                              <div
                                className={
                                  isUser
                                    ? "whitespace-pre-wrap border border-black bg-black px-5 py-4 text-sm font-light leading-7 text-white"
                                    : "whitespace-pre-wrap border border-black/10 px-5 py-4 text-sm font-light leading-7"
                                }
                              >
                                {
                                  item.content
                                }
                              </div>


                              {!isUser && (

                                <div className="mt-3">

                                  <button
                                    type="button"
                                    disabled={
                                      isSaving ||
                                      isSaved
                                    }
                                    onClick={() =>
                                      saveWorkProduct(
                                        item
                                      )
                                    }
                                    className="text-[8px] uppercase tracking-[0.18em] text-neutral-400 transition hover:text-black disabled:cursor-default disabled:text-neutral-300"
                                  >

                                    {isSaving
                                      ? "Saving..."
                                      : isSaved
                                        ? "Saved to Workspace"
                                        : "Save to Workspace"}

                                  </button>

                                </div>

                              )}

                            </div>
                          );
                        }
                      )}

                    </div>

                  )}

                </div>


                {/* MESSAGE COMPOSER */}

                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="border-t border-black pt-6"
                >

                  <div className="flex items-start gap-4">


                    {/* MICROPHONE */}

                    <button
                      type="button"
                      onClick={
                        toggleDictation
                      }
                      disabled={
                        sending
                      }
                      aria-label={
                        isListening
                          ? "Stop dictation"
                          : "Start dictation"
                      }
                      title={
                        dictationSupported
                          ? isListening
                            ? "Stop dictation"
                            : "Start dictation"
                          : "Dictation unavailable in this browser"
                      }
                      className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center border transition ${
                        isListening
                          ? "border-black bg-black text-white"
                          : "border-black/20 bg-white text-black hover:border-black"
                      } disabled:cursor-not-allowed disabled:opacity-30`}
                    >
                      <MicrophoneIcon />
                    </button>


                    {/* TEXTAREA */}

                    <textarea
                      value={
                        message
                      }
                      onChange={(
                        event
                      ) =>
                        setMessage(
                          event
                            .target
                            .value
                        )
                      }
                      onKeyDown={(
                        event
                      ) => {

                        if (
                          event.key ===
                            "Enter" &&
                          !event.shiftKey
                        ) {
                          event.preventDefault();


                          if (
                            message.trim() &&
                            !sending
                          ) {
                            event
                              .currentTarget
                              .form
                              ?.requestSubmit();
                          }
                        }
                      }}
                      placeholder={
                        isListening
                          ? "Listening..."
                          : `Message ${agent.name}...`
                      }
                      rows={3}
                      disabled={
                        sending
                      }
                      className="min-w-0 flex-1 resize-none border-0 bg-transparent text-sm font-light leading-7 outline-none placeholder:text-neutral-300 disabled:opacity-50"
                    />

                  </div>


                  <div className="mt-4 flex items-center justify-between gap-6">


                    <div>

                      <p className="text-[9px] font-light text-neutral-400">

                        {sending
                          ? `${agent.name} is working...`
                          : isListening
                            ? "Listening · Speak naturally · Click the microphone to stop"
                            : "Enter to send · Shift + Enter for a new line"}

                      </p>


                      {!dictationSupported && (

                        <p className="mt-1 text-[8px] font-light text-neutral-300">
                          Voice dictation depends on browser support.
                        </p>

                      )}

                    </div>


                    <button
                      type="submit"
                      disabled={
                        !message.trim() ||
                        sending
                      }
                      className="shrink-0 border border-black bg-black px-6 py-3 text-[9px] uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-200"
                    >

                      {sending
                        ? "Working"
                        : "Send"}

                    </button>

                  </div>

                </form>

              </div>

            </section>

          </div>

        )}

      </div>

    </AtlasAppShell>
  );
}


// ---------------------------------------------
// CONVERSATION DATE
// ---------------------------------------------

function formatConversationDate(
  value: string
) {
  const date =
    new Date(value);

  const now =
    new Date();


  const sameDay =
    date.getFullYear() ===
      now.getFullYear() &&
    date.getMonth() ===
      now.getMonth() &&
    date.getDate() ===
      now.getDate();


  if (sameDay) {
    return "Today";
  }


  const yesterday =
    new Date(now);

  yesterday.setDate(
    now.getDate() - 1
  );


  const wasYesterday =
    date.getFullYear() ===
      yesterday.getFullYear() &&
    date.getMonth() ===
      yesterday.getMonth() &&
    date.getDate() ===
      yesterday.getDate();


  if (wasYesterday) {
    return "Yesterday";
  }


  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    }
  ).format(date);
}


// ---------------------------------------------
// MICROPHONE ICON
// ---------------------------------------------

function MicrophoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >

      <rect
        x="9"
        y="3"
        width="6"
        height="11"
        rx="3"
      />

      <path d="M5.5 10.5a6.5 6.5 0 0 0 13 0" />

      <path d="M12 17v4" />

      <path d="M9 21h6" />

    </svg>
  );
}