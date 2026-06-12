"use client"

import * as React from "react"
import { SendIcon } from "lucide-react"
import { toast } from "sonner"

import { projectTypes } from "@/lib/site-data"

const fieldClass =
  "h-11 w-full rounded-lg border border-black/12 bg-white px-3.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-shadow focus:border-brand-strong focus:ring-3 focus:ring-brand/25"

export function QuoteForm() {
  const [submitting, setSubmitting] = React.useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setSubmitting(true)
    // No backend yet. Simulate a request so the form feels alive.
    setTimeout(() => {
      setSubmitting(false)
      form.reset()
      toast.success("Quote request sent!", {
        description:
          "Thank you for reaching out. Our team will get back to you within one working day.",
      })
    }, 900)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="quote-name" className="text-ink text-sm font-medium">
            Full name
          </label>
          <input
            id="quote-name"
            name="name"
            placeholder="John Doe"
            required
            className={fieldClass}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="quote-email" className="text-ink text-sm font-medium">
            Email address
          </label>
          <input
            id="quote-email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="quote-phone" className="text-ink text-sm font-medium">
            Phone number
          </label>
          <input
            id="quote-phone"
            name="phone"
            type="tel"
            placeholder="+255 755 000 000"
            className={fieldClass}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="quote-type" className="text-ink text-sm font-medium">
            Project type
          </label>
          <select
            id="quote-type"
            name="projectType"
            required
            defaultValue=""
            className={fieldClass}
          >
            <option value="" disabled>
              Select project type
            </option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="quote-details" className="text-ink text-sm font-medium">
          Project details
        </label>
        <textarea
          id="quote-details"
          name="details"
          rows={5}
          placeholder="Describe your project requirements, timeline, and any specific needs..."
          required
          className={`${fieldClass} h-auto min-h-32 py-3`}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-ink hover:bg-steel inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-[15px] font-semibold text-white transition-all duration-200 [transition-timing-function:var(--ease-snap)] active:scale-[0.98] disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send request"}
        <SendIcon className="size-4" />
      </button>
    </form>
  )
}
