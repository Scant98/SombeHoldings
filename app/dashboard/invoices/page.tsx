"use client"

import * as React from "react"
import { PlusIcon, SearchIcon } from "lucide-react"

import { InvoiceDialog } from "@/components/invoice-dialog"
import { InvoicesTable } from "@/components/invoices-table"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrencyCompact } from "@/lib/format"
import {
  invoicedTotal,
  outstandingReceivables,
  receivedTotal,
} from "@/lib/selectors"
import { useStore } from "@/lib/store"

export default function InvoicesPage() {
  const { data, ready } = useStore()
  const [search, setSearch] = React.useState("")
  const [projectFilter, setProjectFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [addOpen, setAddOpen] = React.useState(false)

  if (!ready) {
    return <Skeleton className="h-96 rounded-xl" />
  }

  const filtered = data.invoices
    .filter((i) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !search ||
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      const matchesProject =
        projectFilter === "all" || i.projectId === projectFilter
      const matchesStatus = statusFilter === "all" || i.status === statusFilter
      return matchesSearch && matchesProject && matchesStatus
    })
    .sort((a, b) => b.dateInvoiced.localeCompare(a.dateInvoiced))

  const summary = [
    { label: "Total Invoiced", value: invoicedTotal(filtered) },
    { label: "Received", value: receivedTotal(filtered) },
    { label: "Awaiting Payment", value: outstandingReceivables(filtered) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {summary.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {formatCurrencyCompact(s.value)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search invoice numbers or descriptions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={projectFilter}
            onValueChange={(v) => setProjectFilter(v ?? "all")}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {data.projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v ?? "all")}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="invoiced">Awaiting payment</SelectItem>
              <SelectItem value="received">Received</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setAddOpen(true)}>
            <PlusIcon className="size-4" /> New Invoice
          </Button>
        </div>
      </div>

      <InvoicesTable invoices={filtered} />

      <InvoiceDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
