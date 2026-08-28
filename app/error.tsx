"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely without exposing details to the user
    console.error("Runtime application boundary error:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 text-center">
      <div className="glass-panel w-full max-w-md p-7">
        <h1 className="text-3xl font-semibold text-mist">Something went wrong</h1>
        <p className="mt-4 text-sm leading-6 text-stone/70">
          Please retry in a moment. The support team has been notified.
        </p>
        <button
          onClick={reset}
          className="focus-ring mt-6 inline-flex h-11 items-center justify-center bg-gold px-6 text-sm font-semibold text-ink"
          type="button"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
