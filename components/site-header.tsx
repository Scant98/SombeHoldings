"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

function titleFor(pathname: string) {
  if (pathname === "/dashboard") return "Dashboard"
  if (pathname.startsWith("/dashboard/projects/")) return "Project Details"
  if (pathname.startsWith("/dashboard/projects")) return "Projects"
  if (pathname.startsWith("/dashboard/suppliers/")) return "Supplier Details"
  if (pathname.startsWith("/dashboard/suppliers")) return "Suppliers"
  if (pathname.startsWith("/dashboard/costs")) return "Expenses"
  if (pathname.startsWith("/dashboard/invoices")) return "Client Invoices"
  return "SupplyTrack"
}

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <h1 className="text-base font-medium">{titleFor(pathname)}</h1>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
