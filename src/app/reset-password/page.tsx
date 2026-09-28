"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { createClient } from "@/lib/supabase/client";


export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [checkingRecovery, setCheckingRecovery] =
    useState(true);

  const [recoveryReady, setRecoveryReady] =
    useState(false);

  const [success, setSuccess] =
    useState(false);


  useEffect(() => {
    async function prepareRecovery() {
      setCheckingRecovery(true);
      setError("");

      const code =
        searchParams.get("code");

      // --------------------------------------------------
      // PKCE PASSWORD-RECOVERY FLOW
      // --------------------------------------------------

      if (code) {
        const {
          error: exchangeError,
        } =
          await supabase.auth.exchangeCodeForSession(
            code
          );

        if (exchangeError) {
          console.error(
            "PASSWORD RECOVERY CODE ERROR:",
            exchangeError
          );

          setError(
            "This password reset link is invalid or has expired. Please request a new one."
          );

          setRecoveryReady(false);
          setCheckingRecovery(false);

          return;
        }

        setRecoveryReady(true);
        setCheckingRecovery(false);

        return;
      }


      // --------------------------------------------------
      // CHECK WHETHER RECOVERY ALREADY CREATED A SESSION
      // --------------------------------------------------

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();


      if (userError || !user) {
        setError(
          "This password reset link is invalid or has expired. Please request a new one."
        );

        setRecoveryReady(false);
        setCheckingRecovery(false);

        return;
      }


      setRecoveryReady(true);
      setCheckingRecovery(false);
    }


    prepareRecovery();

  }, [searchParams, supabase.auth]);


  async function handlePasswordUpdate(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");


    if (password.length < 8) {
      setError(
        "Your password must be at least 8 characters."
      );

      return;
    }


    if (password !== confirmPassword) {
      setError(
        "Your passwords do not match."
      );

      return;
    }


    setLoading(true);


    const {
      error: updateError,
    } =
      await supabase.auth.updateUser({
        password,
      });


    if (updateError) {
      console.error(
        "PASSWORD UPDATE ERROR:",
        updateError
      );

      setError(
        updateError.message ||
          "We couldn't update your password. Please try again."
      );

      setLoading(false);

      return;
    }


    setSuccess(true);
    setLoading(false);
  }


  if (checkingRecovery) {
    return (
      <main className="min-h-screen bg-white text-black">

        <div className="flex min-h-screen items-center justify-center px-6">

          <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-400">
            Verifying secure reset link
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-white text-black">

      <div className="flex min-h-screen flex-col items-center justify-center px-6">

        <div className="w-full max-w-md">


          {!success && (
            <button
              type="button"
              onClick={() =>
                router.push("/")
              }
              className="mb-12 text-[9px] uppercase tracking-[0.22em] text-neutral-400 transition hover:text-black"
            >
              ← Back to Login
            </button>
          )}


          <div className="mb-12">

            <p className="mb-4 text-[10px] uppercase tracking-[0.45em]">
              Atlas
            </p>


            <h1 className="text-4xl font-light tracking-[-0.03em]">

              {success
                ? "Password updated."
                : "Create a new password."}

            </h1>


            <div className="mt-6 h-px w-10 bg-black" />


            <p className="mt-6 text-sm font-light leading-7 text-neutral-500">

              {success
                ? "Your Atlas password has been changed successfully. You can now return to login."
                : "Choose a new password for your Atlas account."}

            </p>

          </div>


          {/* SUCCESS */}

          {success ? (

            <div className="border-t border-black pt-8">

              <p className="text-[10px] uppercase tracking-[0.22em]">
                Password reset complete
              </p>


              <p className="mt-4 text-sm font-light leading-7 text-neutral-500">
                Use your new password the next time
                you enter Atlas.
              </p>


              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();

                  router.push("/");
                  router.refresh();
                }}
                className="mt-8 w-full border border-black bg-black px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-white transition hover:bg-white hover:text-black"
              >
                Return to Login
              </button>

            </div>

          ) : !recoveryReady ? (

            /* INVALID / EXPIRED LINK */

            <div className="border-t border-black pt-8">

              <p className="text-sm font-light leading-7 text-red-600">
                {error}
              </p>


              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/forgot-password"
                  )
                }
                className="mt-8 w-full border border-black bg-black px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-white transition hover:bg-white hover:text-black"
              >
                Request New Link
              </button>

            </div>

          ) : (

            /* NEW PASSWORD FORM */

            <form
              onSubmit={
                handlePasswordUpdate
              }
              className="space-y-8"
            >


              <div>

                <label
                  htmlFor="password"
                  className="mb-3 block text-[10px] uppercase tracking-[0.2em]"
                >
                  New Password
                </label>


                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full border-0 border-b border-black bg-transparent px-0 py-3 text-sm font-light outline-none placeholder:text-neutral-300"
                />

              </div>


              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-3 block text-[10px] uppercase tracking-[0.2em]"
                >
                  Confirm Password
                </label>


                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="••••••••"
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
                  ? "Updating..."
                  : "Update Password"}

              </button>

            </form>

          )}

        </div>


        <div className="absolute bottom-8 text-[9px] uppercase tracking-[0.3em] text-neutral-300">
          Atlas AI Systems
        </div>

      </div>

    </main>
  );
}