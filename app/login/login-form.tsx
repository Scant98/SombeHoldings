"use client"

import * as React from "react"
import { LockIcon } from "lucide-react"

import { login } from "./actions"

export function LoginForm({ from }: { from?: string }) {
  const [state, formAction, pending] = React.useActionState(login, undefined)

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="from" value={from ?? "/dashboard"} />
      <div className="grid gap-2">
        <label htmlFor="password" className="text-ink text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Enter admin password"
          className="text-ink placeholder:text-ink-soft/60 focus:border-brand-strong focus:ring-brand/25 h-11 w-full rounded-lg border border-black/12 bg-white px-3.5 text-sm outline-none transition-shadow focus:ring-3"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink hover:bg-steel inline-flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 [transition-timing-function:var(--ease-snap)] active:scale-[0.98] disabled:opacity-60"
      >
        <LockIcon className="size-4" />
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}
