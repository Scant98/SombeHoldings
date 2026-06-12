"use client"

import * as React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeftIcon,
  DownloadIcon,
  PencilIcon,
  PlusIcon,
} from "lucide-react"

import { ProjectStatusBadge, ProjectTypeBadge } from "@/components/badges"
import { CostDialog } from "@/components/cost-dialog"
import { CostsTable } from "@/components/costs-table"
import { InvoiceDialog } from "@/components/invoice-dialog"
import { InvoicesTable } from "@/components/invoices-table"
import { ProjectDialog } from "@/components/project-dialog"
import { RatingStars } from "@/components/rating-stars"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { downloadCsv, formatCurrency, formatCurrencyCompact, formatDate } from "@/lib/format"
import { invoicedTotal, receivedTotal } from "@/lib/selectors"
import { useStore } from "@/lib/store"

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const { data, ready } = useStore()
  const [editOpen, setEditOpen] = React.useState(false)
  const [addCostOpen, setAddCostOpen] = React.useState(false)
  const [addInvoiceOpen, setAddInvoiceOpen] = React.useState(false)

  if (!ready) {
    return <Skeleton className="h-96 rounded-xl" />
  }

  const project = data.projects.find((p) => p.id === id)
  if (!project) notFound()

  const costs = data.costs
    .filter((c) => c.projectId === project.id)
    .sort((a, b) => b.date.localeCompare(a.date))
  const spent = costs.reduce((s, c) => s + c.amount, 0)
  const remaining = project.budget - spent
  const pct = project.budget > 0 ? (spent / project.budget) * 100 : 0
  const over = pct > 100
  const profit = project.contractValue - spent
  const margin =
    project.contractValue > 0 ? (profit / project.contractValue) * 100 : null

  const invoices = data.invoices
    .filter((i) => i.projectId === project.id)
    .sort((a, b) => b.dateInvoiced.localeCompare(a.dateInvoiced))
  const invoiced = invoicedTotal(invoices)
  const received = receivedTotal(invoices)

  const supplierRows = [
    ...costs
      .reduce((map, c) => {
        const entry = map.get(c.supplierId) ?? { total: 0, entries: 0 }
        entry.total += c.amount
        entry.entries += 1
        map.set(c.supplierId, entry)
        return map
      }, new Map<string, { total: number; entries: number }>())
      .entries(),
  ]
    .map(([supplierId, agg]) => ({
      supplier: data.suppliers.find((s) => s.id === supplierId),
      ...agg,
    }))
    .filter((r) => r.supplier)
    .sort((a, b) => b.total - a.total)

  function exportCsv() {
    downloadCsv(
      `${project!.name.replace(/\s+/g, "-").toLowerCase()}-expenses.csv`,
      [
        ["Date", "Description", "Supplier", "Category", "Quantity", "Unit Price", "Amount", "Status", "Invoice"],
        ...costs.map((c) => [
          c.date,
          c.description,
          data.suppliers.find((s) => s.id === c.supplierId)?.name ?? "",
          c.category,
          c.quantity,
          c.unitPrice,
          c.amount,
          c.paymentStatus,
          c.invoiceNumber ?? "",
        ]),
      ]
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-1"
            render={<Link href="/dashboard/projects" />}
          >
            <ArrowLeftIcon className="size-4" /> All projects
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              {project.name}
            </h2>
            <ProjectTypeBadge type={project.projectType} />
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="text-muted-foreground max-w-2xl text-sm">
            {project.description || "No description"}
          </p>
          <p className="text-muted-foreground text-xs">
            {project.client && (
              <>
                Client: <span className="font-medium">{project.client}</span>
                {" · "}
              </>
            )}
            {formatDate(project.startDate)}
            {project.endDate ? ` — ${formatDate(project.endDate)}` : " — ongoing"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <PencilIcon className="size-4" /> Edit
          </Button>
          <Button onClick={() => setAddCostOpen(true)}>
            <PlusIcon className="size-4" /> Add Expense
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Project Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {formatCurrencyCompact(project.contractValue)}
            </div>
            <p className="text-muted-foreground text-xs">Contract valuation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Costs to Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {formatCurrencyCompact(spent)}
            </div>
            <p className="text-muted-foreground text-xs">
              {costs.length} expense{costs.length === 1 ? "" : "s"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {profit >= 0 ? "Profit" : "Loss"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold tabular-nums ${
                profit >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {profit >= 0 ? "+" : ""}
              {formatCurrencyCompact(profit)}
            </div>
            <p className="text-muted-foreground text-xs">
              {margin !== null
                ? `${margin.toFixed(1)}% margin on value`
                : "No valuation set"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget Left</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold tabular-nums ${
                remaining < 0 ? "text-red-600 dark:text-red-400" : ""
              }`}
            >
              {formatCurrencyCompact(remaining)}
            </div>
            <p
              className={`text-xs ${
                remaining < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-muted-foreground"
              }`}
            >
              {remaining < 0
                ? "Over budget"
                : `of ${formatCurrencyCompact(project.budget)} budget`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div
              className={`text-2xl font-bold tabular-nums ${
                over ? "text-red-600 dark:text-red-400" : ""
              }`}
            >
              {Math.round(pct)}%
            </div>
            <Progress
              value={Math.min(pct, 100)}
              className={over ? "[&>div]:bg-red-500" : undefined}
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="expenses">
              Expenses ({costs.length})
            </TabsTrigger>
            <TabsTrigger value="payments">
              Client Payments ({invoices.length})
            </TabsTrigger>
            <TabsTrigger value="suppliers">
              Suppliers ({supplierRows.length})
            </TabsTrigger>
          </TabsList>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            disabled={costs.length === 0}
          >
            <DownloadIcon className="size-4" /> Export CSV
          </Button>
        </div>
        <TabsContent value="expenses" className="mt-4">
          <CostsTable costs={costs} showProject={false} />
        </TabsContent>
        <TabsContent value="payments" className="mt-4 flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Invoiced to Client", value: invoiced },
              { label: "Received", value: received },
              { label: "Awaiting Payment", value: invoiced - received },
              { label: "Not Yet Invoiced", value: project.contractValue - invoiced },
            ].map((s) => (
              <Card key={s.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {s.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold tabular-nums">
                    {formatCurrencyCompact(s.value)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setAddInvoiceOpen(true)}>
              <PlusIcon className="size-4" /> New Invoice
            </Button>
          </div>
          <InvoicesTable invoices={invoices} showProject={false} />
        </TabsContent>
        <TabsContent value="suppliers" className="mt-4">
          {supplierRows.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center gap-1 rounded-lg border border-dashed py-12 text-sm">
              <p className="font-medium">No suppliers yet</p>
              <p>Suppliers appear here once you record expenses with them.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Rating</TableHead>
                    <TableHead className="text-right">Entries</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supplierRows.map((row) => (
                    <TableRow key={row.supplier!.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/dashboard/suppliers/${row.supplier!.id}`}
                          className="hover:underline"
                        >
                          {row.supplier!.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden sm:table-cell">
                        {row.supplier!.category}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <RatingStars rating={row.supplier!.rating} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.entries}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatCurrency(row.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ProjectDialog open={editOpen} onOpenChange={setEditOpen} project={project} />
      <CostDialog
        open={addCostOpen}
        onOpenChange={setAddCostOpen}
        defaultProjectId={project.id}
      />
      <InvoiceDialog
        open={addInvoiceOpen}
        onOpenChange={setAddInvoiceOpen}
        defaultProjectId={project.id}
      />
    </div>
  )
}
