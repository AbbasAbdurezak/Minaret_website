"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical system-level layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-ink px-4 text-center">
        <div className="glass-panel w-full max-w-md p-7">
          <h1 className="text-3xl font-semibold text-mist">System Error</h1>
          <p className="mt-4 text-sm leading-6 text-stone/70">
            A critical system-level layout error occurred. Please reload.
          </p>
          <button
            onClick={reset}
            className="focus-ring mt-6 inline-flex h-11 items-center justify-center bg-gold px-6 text-sm font-semibold text-ink"
            type="button"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
