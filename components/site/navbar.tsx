"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboardIcon, MenuIcon, PhoneIcon, XIcon } from "lucide-react"

import { company, navLinks } from "@/lib/site-data"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow duration-300 [transition-timing-function:var(--ease-snap)]",
        scrolled || open ? "shadow-[0_1px_0_0_rgba(0,0,0,0.08)]" : ""
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px] md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Sombe Holdings logo"
            width={40}
            height={40}
            className="size-10 rounded-lg"
            priority
          />
          <span className="flex flex-col leading-tight">
            <span className="text-ink text-[15px] font-bold tracking-tight">
              Sombe Holdings
            </span>
            <span className="text-ink-soft text-[11px] font-medium">
              Construction &amp; Supply
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-ink-soft hover:text-ink relative text-sm font-medium transition-colors duration-200",
                pathname === link.href &&
                  "text-ink after:bg-brand-strong after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${company.phoneHref}`}
            className="text-ink-soft hover:text-ink flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <PhoneIcon className="text-brand-strong size-4" />
            {company.phone}
          </a>
          <Link
            href="/dashboard"
            className="text-ink hover:border-ink/40 inline-flex h-10 items-center gap-2 rounded-lg border border-black/15 bg-white px-4 text-sm font-semibold transition-all duration-200 [transition-timing-function:var(--ease-snap)] active:scale-[0.98]"
          >
            <LayoutDashboardIcon className="size-4" />
            Admin
          </Link>
          <Link
            href="/contact"
            className="bg-ink hover:bg-steel inline-flex h-10 items-center rounded-lg px-5 text-sm font-semibold text-white transition-all duration-200 [transition-timing-function:var(--ease-snap)] active:scale-[0.98]"
          >
            Get a Quote
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-ink flex size-10 items-center justify-center rounded-lg active:scale-[0.95] lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/8 bg-white lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-ink-soft rounded-lg px-3 py-2.5 text-sm font-medium",
                  pathname === link.href && "text-ink bg-paper-dim font-semibold"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              className="text-ink mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-black/15 text-sm font-semibold active:scale-[0.98]"
            >
              <LayoutDashboardIcon className="size-4" />
              Admin
            </Link>
            <Link
              href="/contact"
              className="bg-ink inline-flex h-11 items-center justify-center rounded-lg text-sm font-semibold text-white active:scale-[0.98]"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
