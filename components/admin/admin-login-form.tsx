"use client";

import { useState } from "react";
import { Lock, LogIn } from "lucide-react";

export function AdminLoginForm() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("Checking credentials...");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        setStatus("Invalid username or password.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch (error) {
      console.error(error);
      setStatus("A connection error occurred. Please check your network and retry.");
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4">
      <form className="glass-panel w-full max-w-md p-7" onSubmit={submit}>
        <div className="mb-8">
          <div className="grid h-12 w-12 place-items-center border border-white/15 text-gold">
            <Lock size={22} />
          </div>
          <p className="eyebrow mt-6">Secure admin</p>
          <h1 className="mt-3 text-4xl font-semibold text-mist">Sign in</h1>
          <p className="mt-3 text-sm leading-6 text-stone/70">
            Use the local admin credentials configured in `.env.local`.
          </p>
        </div>

        <label className="grid gap-2 text-sm text-stone/70">
          Username
          <input
            className="focus-ring border border-white/10 bg-ink px-4 py-3 text-mist"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>

        <label className="mt-4 grid gap-2 text-sm text-stone/70">
          Password
          <input
            className="focus-ring border border-white/10 bg-ink px-4 py-3 text-mist"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button
          className="focus-ring mt-6 inline-flex h-12 w-full items-center justify-center gap-2 bg-gold px-5 text-sm font-semibold text-ink disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          <LogIn size={17} />
          {loading ? "Signing in" : "Sign in"}
        </button>

        {status ? <p className="mt-4 text-sm text-stone/70">{status}</p> : null}
      </form>
    </main>
  );
}
