"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Enter your email address.");
      return;
    }

    setError("");
    setLoading(true);

    const redirectTo =
      `${window.location.origin}/reset-password`;

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        cleanEmail,
        {
          redirectTo,
        }
      );

    setLoading(false);

    if (error) {
      setError(
        "We couldn't send the reset email. Please try again."
      );
      return;
    }

    setSent(true);
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="flex min-h-screen flex-col items-center justify-center px-6">

        <div className="w-full max-w-md">

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-12 text-[9px] uppercase tracking-[0.22em] text-neutral-400 transition hover:text-black"
          >
            ← Back to Login
          </button>

          <div className="mb-12">
            <p className="mb-4 text-[10px] uppercase tracking-[0.45em]">
              Atlas
            </p>

            <h1 className="text-4xl font-light tracking-[-0.03em]">
              Reset your password.
            </h1>

            <div className="mt-6 h-px w-10 bg-black" />

            <p className="mt-6 text-sm font-light leading-7 text-neutral-500">
              Enter the email associated with your
              Atlas account. We&apos;ll send you a
              secure password reset link.
            </p>
          </div>

          {!sent ? (
            <form
              onSubmit={handleReset}
              className="space-y-8"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-3 block text-[10px] uppercase tracking-[0.2em]"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full border-0 border-b border-black bg-transparent px-0 py-3 text-sm font-light outline-none placeholder:text-neutral-300"
                />
              </div>

              {error && (
                <p className="text-xs font-light text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full border border-black bg-black px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Sending..."
                  : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="border-t border-black pt-8">

              <p className="text-[10px] uppercase tracking-[0.22em]">
                Check your email
              </p>

              <p className="mt-4 text-sm font-light leading-7 text-neutral-500">
                If an Atlas account exists for that
                email address, you&apos;ll receive a
                password reset link shortly.
              </p>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-8 border border-black px-6 py-3 text-[9px] uppercase tracking-[0.2em] transition hover:bg-black hover:text-white"
              >
                Return to Login
              </button>

            </div>
          )}

        </div>

        <div className="absolute bottom-8 text-[9px] uppercase tracking-[0.3em] text-neutral-300">
          Atlas AI Systems
        </div>

      </div>
    </main>
  );
}