"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot field for anti-spam
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("Please fill in all required fields (Name, Email, Message).");
      return;
    }

    setSubmitting(true);
    setStatus("Sending inquiry...");

    // Honeypot check: If bot filled this field, silently mock success
    if (website) {
      setTimeout(() => {
        setSubmitting(false);
        setSuccess(true);
        setStatus("Inquiry sent successfully.");
      }, 1000);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, email, message, website })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setStatus("Thank you! Your inquiry has been sent successfully.");
      } else {
        setStatus(data.error || "Failed to send inquiry. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("A connection error occurred. Please check your network and retry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="border border-white/10 bg-white/[0.04] p-6" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-stone/70">
          Name *
          <input
            className="focus-ring border border-white/10 bg-ink px-4 py-3 text-mist"
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting || success}
          />
        </label>
        <label className="grid gap-2 text-sm text-stone/70">
          Phone
          <input
            className="focus-ring border border-white/10 bg-ink px-4 py-3 text-mist"
            type="tel"
            maxLength={40}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={submitting || success}
          />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm text-stone/70">
        Email *
        <input
          className="focus-ring border border-white/10 bg-ink px-4 py-3 text-mist"
          type="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting || success}
        />
      </label>

      {/* Honeypot field (hidden from users) */}
      <div className="sr-only">
        <label>
          Leave this field blank:
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            autoComplete="off"
          />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm text-stone/70">
        Message *
        <textarea
          className="focus-ring min-h-40 border border-white/10 bg-ink px-4 py-3 text-mist"
          required
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitting || success}
        />
      </label>

      <button
        className="focus-ring mt-5 bg-gold px-6 py-3 text-sm font-semibold text-ink disabled:opacity-60"
        type="submit"
        disabled={submitting || success}
      >
        {submitting ? "Sending..." : "Send inquiry"}
      </button>

      {status ? (
        <p className={`mt-4 text-sm ${success ? "text-gold" : "text-stone/70"}`}>
          {status}
        </p>
      ) : null}
    </form>
  );
}
