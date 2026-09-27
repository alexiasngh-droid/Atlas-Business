"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BrainSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  fields: {
    label: string;
    value: string;
  }[];
};

const initialSections: BrainSection[] = [
  {
    id: "company",
    eyebrow: "01",
    title: "Company",
    description:
      "The foundation Atlas uses to understand your business.",
    fields: [
      {
        label: "Company Description",
        value: "",
      },
      {
        label: "Industry",
        value: "",
      },
      {
        label: "Business Model",
        value: "",
      },
      {
        label: "Website",
        value: "",
      },
    ],
  },
  {
    id: "products",
    eyebrow: "02",
    title: "Products & Services",
    description:
      "What your company creates, sells, or provides.",
    fields: [
      {
        label: "Products & Services",
        value: "",
      },
      {
        label: "Pricing Strategy",
        value: "",
      },
    ],
  },
  {
    id: "customers",
    eyebrow: "03",
    title: "Customers",
    description:
      "Who you serve and the problems you solve for them.",
    fields: [
      {
        label: "Target Customers",
        value: "",
      },
      {
        label: "Customer Problems",
        value: "",
      },
    ],
  },
  {
    id: "positioning",
    eyebrow: "04",
    title: "Positioning",
    description:
      "How your business fits into the market.",
    fields: [
      {
        label: "Competitors",
        value: "",
      },
      {
        label: "Brand Positioning",
        value: "",
      },
    ],
  },
  {
    id: "brand",
    eyebrow: "05",
    title: "Brand",
    description:
      "The identity, purpose, and voice behind the company.",
    fields: [
      {
        label: "Mission",
        value: "",
      },
      {
        label: "Vision",
        value: "",
      },
      {
        label: "Brand Voice",
        value: "",
      },
    ],
  },
  {
    id: "growth",
    eyebrow: "06",
    title: "Growth",
    description:
      "How your business attracts and converts customers.",
    fields: [
      {
        label: "Marketing Strategy",
        value: "",
      },
      {
        label: "Sales Strategy",
        value: "",
      },
    ],
  },
  {
    id: "goals",
    eyebrow: "07",
    title: "Goals",
    description:
      "What the business is working toward.",
    fields: [
      {
        label: "Business Goals",
        value: "",
      },
      {
        label: "Financial Goals",
        value: "",
      },
    ],
  },
  {
    id: "context",
    eyebrow: "08",
    title: "Current Context",
    description:
      "What Atlas should understand about the business right now.",
    fields: [
      {
        label: "Current Challenges",
        value: "",
      },
      {
        label: "Additional Context",
        value: "",
      },
    ],
  },
];

export default function BusinessBrainPage() {
  const router = useRouter();

  const [sections, setSections] =
    useState<BrainSection[]>(initialSections);

  const [editingSection, setEditingSection] =
    useState<string | null>(null);

  function updateField(
    sectionId: string,
    fieldIndex: number,
    value: string
  ) {
    setSections((current) =>
      current.map((section) => {
        if (section.id !== sectionId) {
          return section;
        }

        return {
          ...section,
          fields: section.fields.map(
            (field, index) =>
              index === fieldIndex
                ? { ...field, value }
                : field
          ),
        };
      })
    );
  }

  const totalFields = sections.reduce(
    (total, section) =>
      total + section.fields.length,
    0
  );

  const completedFields = sections.reduce(
    (total, section) =>
      total +
      section.fields.filter(
        (field) => field.value.trim().length > 0
      ).length,
    0
  );

  const completion =
    totalFields === 0
      ? 0
      : Math.round(
          (completedFields / totalFields) * 100
        );

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-[1500px] px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
        {/* Back to HQ */}
<div className="mb-10">
  <button
    type="button"
    onClick={() => router.push("/hq")}
    className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-neutral-400 transition hover:text-black"
  >
    <span className="text-base font-light transition-transform group-hover:-translate-x-1">
      ←
    </span>
    Back to HQ
  </button>
</div>
        {/* Header */}
        <header className="border-b border-black/10 pb-10">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                Atlas Intelligence
              </p>

              <h1 className="mt-4 text-4xl font-light tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Business Brain
              </h1>

              <p className="mt-5 max-w-2xl text-sm font-light leading-6 text-neutral-500">
                The living intelligence behind your
                Atlas workspace. Everything Atlas
                understands about your company begins
                here.
              </p>
            </div>

            <div className="min-w-[220px]">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-neutral-400">
                    Brain Completion
                  </p>

                  <p className="mt-2 text-2xl font-light">
                    {completion}%
                  </p>
                </div>

                <p className="text-[10px] text-neutral-400">
                  {completedFields}/{totalFields}
                </p>
              </div>

              <div className="mt-4 h-px bg-black/10">
                <div
                  className="h-px bg-black transition-all duration-500"
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Intro */}
        <section className="grid gap-8 border-b border-black/10 py-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
              How Atlas Thinks
            </p>
          </div>

          <div className="max-w-3xl">
            <p className="text-xl font-light leading-8 tracking-[-0.02em]">
              Your Business Brain gives Atlas the
              context it needs to think with your
              company—not just answer generic
              questions about it.
            </p>

            <p className="mt-5 text-sm font-light leading-6 text-neutral-500">
              As your business evolves, this
              intelligence should evolve with it.
              Atlas will eventually be able to
              propose updates from your goals,
              decisions, integrations, and
              conversations for your approval.
            </p>
          </div>
        </section>

        {/* Brain Sections */}
        <section>
          {sections.map((section) => {
            const isEditing =
              editingSection === section.id;

            return (
              <div
                key={section.id}
                className="grid gap-8 border-b border-black/10 py-10 lg:grid-cols-[80px_280px_1fr]"
              >
                <div>
                  <span className="text-[10px] font-light text-neutral-300">
                    {section.eyebrow}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-light tracking-[-0.025em]">
                    {section.title}
                  </h2>

                  <p className="mt-3 max-w-[240px] text-xs font-light leading-5 text-neutral-400">
                    {section.description}
                  </p>
                </div>

                <div>
                  <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
                    {section.fields.map(
                      (field, fieldIndex) => (
                        <div
                          key={field.label}
                          className={
                            field.label ===
                              "Company Description" ||
                            field.label ===
                              "Products & Services" ||
                            field.label ===
                              "Additional Context"
                              ? "md:col-span-2"
                              : ""
                          }
                        >
                          <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                            {field.label}
                          </p>

                          {isEditing ? (
                            <textarea
                              value={field.value}
                              onChange={(event) =>
                                updateField(
                                  section.id,
                                  fieldIndex,
                                  event.target.value
                                )
                              }
                              placeholder={`Add ${field.label.toLowerCase()}...`}
                              rows={
                                field.label ===
                                  "Company Description" ||
                                field.label ===
                                  "Products & Services" ||
                                field.label ===
                                  "Additional Context"
                                  ? 4
                                  : 3
                              }
                              className="mt-3 w-full resize-none border border-black/15 bg-white px-4 py-3 text-sm font-light leading-6 outline-none transition focus:border-black"
                            />
                          ) : (
                            <p className="mt-3 min-h-6 whitespace-pre-wrap text-sm font-light leading-6 text-neutral-700">
                              {field.value ||
                                "Not added yet"}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingSection(
                          isEditing
                            ? null
                            : section.id
                        )
                      }
                      className={
                        isEditing
                          ? "border border-black bg-black px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800"
                          : "border border-black/15 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] transition hover:border-black"
                      }
                    >
                      {isEditing
                        ? "Done"
                        : "Edit Section"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Future Intelligence */}
        <section className="grid gap-8 py-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
              Living Intelligence
            </p>
          </div>

          <div className="max-w-3xl border border-black/10 p-7">
            <p className="text-xs uppercase tracking-[0.2em]">
              Atlas Suggested Updates
            </p>

            <p className="mt-4 text-sm font-light leading-6 text-neutral-500">
              As Atlas learns from your work, it
              will surface proposed changes here
              before adding important information
              to your Business Brain.
            </p>

            <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-neutral-300">
              No suggestions yet
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}