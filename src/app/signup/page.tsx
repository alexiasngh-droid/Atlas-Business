"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanEmail ||
      !password
    ) {
      setError("Please complete all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(
        "Your password must be at least 8 characters."
      );
      setLoading(false);
      return;
    }

    const {
      data,
      error: signupError,
    } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          first_name: cleanFirstName,
          last_name: cleanLastName,
          display_name: cleanFirstName,
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError(
        "We couldn't create your account. Please try again."
      );
      setLoading(false);
      return;
    }

    /*
      If Supabase email confirmation is disabled,
      the user will already have a session and can
      continue directly into business setup.

      If confirmation is enabled, we will build the
      confirmation experience next.
    */

    if (data.session) {
      router.push("/onboarding/business");
      return;
    }

    router.push(
      `/signup/check-email?email=${encodeURIComponent(
        cleanEmail
      )}`
    );
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT BRAND PANEL */}
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
              One business brain.
            </p>

            <h2 className="mt-5 text-4xl font-light leading-[1.15] tracking-[-0.04em]">
              Your company,
              <br />
              finally connected.
            </h2>

            <p className="mt-6 max-w-sm text-sm font-light leading-6 text-neutral-500">
              Atlas brings your goals, work, intelligence
              and business knowledge into one operating
              system built around your company.
            </p>
          </div>

          <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-300">
            Atlas AI Systems
          </p>
        </section>

        {/* SIGNUP */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-20">
          <div className="w-full max-w-[520px]">

            {/* MOBILE BRAND */}
            <div className="mb-16 lg:hidden">
              <p className="text-[9px] uppercase tracking-[0.45em]">
                Atlas
              </p>

              <h1 className="mt-1 text-xl font-light">
                Business
              </h1>
            </div>

            {/* PROGRESS */}
            <div className="mb-12">
              <div className="flex items-center justify-between">
                <p className="text-[9px] uppercase tracking-[0.25em]">
                  01 — Account
                </p>

                <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-400">
                  Step 1 of 4
                </p>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                <div className="h-px bg-black" />
                <div className="h-px bg-neutral-200" />
                <div className="h-px bg-neutral-200" />
                <div className="h-px bg-neutral-200" />
              </div>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                Start your free trial
              </p>

              <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] sm:text-5xl">
                Create your account.
              </h2>

              <p className="mt-5 max-w-md text-sm font-light leading-6 text-neutral-500">
                Start building the operating system for
                your business.
              </p>
            </div>

            <form
              onSubmit={handleSignup}
              className="mt-12"
            >
              <div className="grid gap-7 sm:grid-cols-2">
                <Field
                  label="First name"
                  value={firstName}
                  onChange={setFirstName}
                  autoComplete="given-name"
                />

                <Field
                  label="Last name"
                  value={lastName}
                  onChange={setLastName}
                  autoComplete="family-name"
                />
              </div>

              <div className="mt-7">
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />
              </div>

              <div className="mt-7">
                <Field
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="new-password"
                />

                <p className="mt-2 text-[10px] font-light text-neutral-400">
                  Minimum 8 characters.
                </p>
              </div>

              {error && (
                <div className="mt-7 border border-black/20 px-4 py-3">
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
                    ? "Creating account..."
                    : "Continue"}
                </span>

                {!loading && (
                  <span aria-hidden="true">→</span>
                )}
              </button>

              <div className="mt-7 text-center">
                <p className="text-xs font-light text-neutral-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="text-black underline underline-offset-4"
                  >
                    Sign in
                  </button>
                </p>
              </div>

              <p className="mt-10 text-center text-[10px] font-light leading-5 text-neutral-400">
                By continuing, you agree to the Atlas
                Terms of Service and Privacy Policy.
              </p>
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
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        autoComplete={autoComplete}
        required
        className="mt-3 w-full border-0 border-b border-black/30 bg-transparent px-0 py-3 text-sm font-light outline-none transition placeholder:text-neutral-300 focus:border-black"
      />
    </label>
  );
}