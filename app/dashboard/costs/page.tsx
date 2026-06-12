"use client"

import * as React from "react"
import { DownloadIcon, PlusIcon, SearchIcon } from "lucide-react"

import { CostDialog } from "@/components/cost-dialog"
import { CostsTable } from "@/components/costs-table"
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
import { downloadCsv, formatCurrencyCompact } from "@/lib/format"
import { totalByStatus } from "@/lib/selectors"
import { useStore } from "@/lib/store"

export default function CostsPage() {
  const { data, ready } = useStore()
  const [search, setSearch] = React.useState("")
  const [projectFilter, setProjectFilter] = React.useState("all")
  const [supplierFilter, setSupplierFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [addOpen, setAddOpen] = React.useState(false)

  if (!ready) {
    return <Skeleton className="h-96 rounded-xl" />
  }

  const filtered = data.costs
    .filter((c) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !search ||
        c.description.toLowerCase().includes(q) ||
        (c.invoiceNumber ?? "").toLowerCase().includes(q)
      const matchesProject = projectFilter === "all" || c.projectId === projectFilter
      const matchesSupplier =
        supplierFilter === "all" || c.supplierId === supplierFilter
      const matchesStatus = statusFilter === "all" || c.paymentStatus === statusFilter
      return matchesSearch && matchesProject && matchesSupplier && matchesStatus
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  const filteredTotal = filtered.reduce((s, c) => s + c.amount, 0)
  const paid = totalByStatus(filtered, "paid")
  const pending = totalByStatus(filtered, "pending")
  const overdue = totalByStatus(filtered, "overdue")

  function exportCsv() {
    downloadCsv("expenses.csv", [
      ["Date", "Description", "Project", "Supplier", "Category", "Quantity", "Unit Price", "Amount", "Status", "Invoice"],
      ...filtered.map((c) => [
        c.date,
        c.description,
        data.projects.find((p) => p.id === c.projectId)?.name ?? "",
        data.suppliers.find((s) => s.id === c.supplierId)?.name ?? "",
        c.category,
        c.quantity,
        c.unitPrice,
        c.amount,
        c.paymentStatus,
        c.invoiceNumber ?? "",
      ]),
    ])
  }

  const summary = [
    { label: "Filtered Total", value: filteredTotal },
    { label: "Paid", value: paid },
    { label: "Pending", value: pending },
    { label: "Overdue", value: overdue },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            placeholder="Search descriptions or invoice numbers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={projectFilter} onValueChange={(v) => setProjectFilter(v ?? "all")}>
            <SelectTrigger className="w-40">
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
          <Select value={supplierFilter} onValueChange={(v) => setSupplierFilter(v ?? "all")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All suppliers</SelectItem>
              {data.suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={exportCsv}
            disabled={filtered.length === 0}
          >
            <DownloadIcon className="size-4" /> Export
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <PlusIcon className="size-4" /> Add Expense
          </Button>
        </div>
      </div>

      <CostsTable costs={filtered} />

      <CostDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}
