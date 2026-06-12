"use server"

import { timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  SESSION_COOKIE,
  SESSION_DURATION_MS,
  createToken,
} from "@/lib/session-crypto"

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

export async function login(
  _prevState: { error: string } | undefined,
  formData: FormData
): Promise<{ error: string } | undefined> {
  const password = String(formData.get("password") ?? "")
  const from = String(formData.get("from") ?? "/dashboard")
  const adminPassword = process.env.ADMIN_PASSWORD
  const secret = process.env.SESSION_SECRET

  if (!adminPassword || !secret) {
    return { error: "Server is missing ADMIN_PASSWORD or SESSION_SECRET." }
  }
  if (!password || !safeEqual(password, adminPassword)) {
    return { error: "Incorrect password. Please try again." }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, await createToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + SESSION_DURATION_MS),
  })

  redirect(from.startsWith("/dashboard") ? from : "/dashboard")
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/login")
}
