"use client"

import * as React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeftIcon,
  MailIcon,
  MapPinIcon,
  PencilIcon,
  PhoneIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react"

import { SupplierStatusBadge } from "@/components/badges"
import { CostDialog } from "@/components/cost-dialog"
import { CostsTable } from "@/components/costs-table"
import { RatingStars } from "@/components/rating-stars"
import { SupplierDialog } from "@/components/supplier-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrencyCompact } from "@/lib/format"
import { totalByStatus } from "@/lib/selectors"
import { useStore } from "@/lib/store"

export default function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const { data, ready } = useStore()
  const [editOpen, setEditOpen] = React.useState(false)
  const [addCostOpen, setAddCostOpen] = React.useState(false)

  if (!ready) {
    return <Skeleton className="h-96 rounded-xl" />
  }

  const supplier = data.suppliers.find((s) => s.id === id)
  if (!supplier) notFound()

  const costs = data.costs
    .filter((c) => c.supplierId === supplier.id)
    .sort((a, b) => b.date.localeCompare(a.date))
  const total = costs.reduce((s, c) => s + c.amount, 0)
  const outstanding =
    totalByStatus(costs, "pending") + totalByStatus(costs, "overdue")
  const projectCount = new Set(costs.map((c) => c.projectId)).size

  const contactRows = [
    { icon: UserIcon, value: supplier.contactName },
    { icon: MailIcon, value: supplier.email },
    { icon: PhoneIcon, value: supplier.phone },
    { icon: MapPinIcon, value: supplier.address },
  ].filter((r) => r.value)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 mb-1"
            render={<Link href="/dashboard/suppliers" />}
          >
            <ArrowLeftIcon className="size-4" /> All suppliers
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              {supplier.name}
            </h2>
            <SupplierStatusBadge status={supplier.status} />
            <Badge variant="outline">{supplier.category}</Badge>
          </div>
          <RatingStars rating={supplier.rating} />
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

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            {contactRows.length === 0 && (
              <p className="text-muted-foreground">No contact details.</p>
            )}
            {contactRows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <row.icon className="text-muted-foreground size-4 shrink-0" />
                <span className="truncate">{row.value}</span>
              </div>
            ))}
            {supplier.notes && (
              <p className="text-muted-foreground border-t pt-3 text-xs">
                {supplier.notes}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Business</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {formatCurrencyCompact(total)}
            </div>
            <p className="text-muted-foreground text-xs">
              {costs.length} expense{costs.length === 1 ? "" : "s"} across{" "}
              {projectCount} project{projectCount === 1 ? "" : "s"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold tabular-nums ${
                outstanding > 0 ? "text-amber-600 dark:text-amber-400" : ""
              }`}
            >
              {formatCurrencyCompact(outstanding)}
            </div>
            <p className="text-muted-foreground text-xs">
              Unpaid or overdue invoices
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Expense History</h3>
        <CostsTable costs={costs} showSupplier={false} />
      </div>

      <SupplierDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        supplier={supplier}
      />
      <CostDialog
        open={addCostOpen}
        onOpenChange={setAddCostOpen}
        defaultSupplierId={supplier.id}
      />
    </div>
  )
}
