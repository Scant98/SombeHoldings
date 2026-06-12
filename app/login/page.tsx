import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Staff access to the Sombe Holdings supplier management system.",
  robots: { index: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams

  return (
    <div className="bg-paper flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/logo.jpg"
            alt="Sombe Holdings logo"
            width={56}
            height={56}
            className="size-14 rounded-xl"
            priority
          />
          <h1 className="text-ink mt-5 text-2xl font-bold tracking-tight">
            Admin login
          </h1>
          <p className="text-ink-soft mt-1.5 text-sm">
            Staff access to the supplier management system
          </p>
        </div>

        <div className="rounded-2xl border border-black/8 bg-white p-7">
          <LoginForm from={from} />
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="text-ink-soft hover:text-ink text-sm transition-colors"
          >
            Back to website
          </Link>
        </p>
      </div>
    </div>
  )
}
