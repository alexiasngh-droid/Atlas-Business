"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email or password is incorrect.");
      setLoading(false);
      return;
    }

    router.push("/hq");
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="flex min-h-screen flex-col items-center justify-center px-6">

        <div className="w-full max-w-md">

          <div className="mb-16 text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.45em]">
              Atlas
            </p>

            <h1 className="text-4xl font-light tracking-[-0.03em]">
              Business
            </h1>

            <div className="mx-auto mt-6 h-px w-10 bg-black" />

            <p className="mt-6 text-sm font-light text-neutral-500">
              Your business, intelligently organized.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">

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
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full border-0 border-b border-black bg-transparent px-0 py-3 text-sm font-light outline-none placeholder:text-neutral-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-3 block text-[10px] uppercase tracking-[0.2em]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border-0 border-b border-black bg-transparent px-0 py-3 text-sm font-light outline-none placeholder:text-neutral-300"
              />
            </div>

            {error && (
              <p className="text-xs font-light text-red-600">
                {error}
              </p>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full border border-black bg-black px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Entering..." : "Enter Atlas"}
              </button>
            </div>

          </form>

          <div className="mt-8 flex justify-between text-[10px] tracking-wide text-neutral-400">
            <button
              type="button"
              className="transition hover:text-black"
            >
              Forgot password?
            </button>

            <button
              type="button"
              className="transition hover:text-black"
            >
              Create account
            </button>
          </div>

        </div>

        <div className="absolute bottom-8 text-[9px] uppercase tracking-[0.3em] text-neutral-300">
          Atlas AI Systems
        </div>

      </div>
    </main>
  );
}