"use client"

import * as React from "react"
import Link from "next/link"
import { MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"

import { PaymentStatusBadge } from "@/components/badges"
import { ConfirmDelete } from "@/components/confirm-delete"
import { CostDialog } from "@/components/cost-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/format"
import { useStore } from "@/lib/store"
import type { CostEntry } from "@/lib/types"

export function CostsTable({
  costs,
  showProject = true,
  showSupplier = true,
}: {
  costs: CostEntry[]
  showProject?: boolean
  showSupplier?: boolean
}) {
  const { data, updateCost, deleteCost } = useStore()
  const [editing, setEditing] = React.useState<CostEntry | undefined>()
  const [deleting, setDeleting] = React.useState<CostEntry | undefined>()

  const projectName = (id: string) =>
    data.projects.find((p) => p.id === id)?.name ?? "—"
  const supplierName = (id: string) =>
    data.suppliers.find((s) => s.id === id)?.name ?? "—"

  if (costs.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-12 text-sm">
        <p className="font-medium">No expenses yet</p>
        <p>Recorded expenses will appear here.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              {showProject && <TableHead className="hidden md:table-cell">Project</TableHead>}
              {showSupplier && <TableHead className="hidden md:table-cell">Supplier</TableHead>}
              <TableHead className="hidden lg:table-cell">Category</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {costs.map((cost) => (
              <TableRow key={cost.id}>
                <TableCell>
                  <div className="font-medium">{cost.description}</div>
                  {cost.invoiceNumber && (
                    <div className="text-muted-foreground text-xs">
                      {cost.invoiceNumber}
                    </div>
                  )}
                </TableCell>
                {showProject && (
                  <TableCell className="hidden md:table-cell">
                    <Link
                      href={`/dashboard/projects/${cost.projectId}`}
                      className="hover:underline"
                    >
                      {projectName(cost.projectId)}
                    </Link>
                  </TableCell>
                )}
                {showSupplier && (
                  <TableCell className="hidden md:table-cell">
                    <Link
                      href={`/dashboard/suppliers/${cost.supplierId}`}
                      className="hover:underline"
                    >
                      {supplierName(cost.supplierId)}
                    </Link>
                  </TableCell>
                )}
                <TableCell className="text-muted-foreground hidden lg:table-cell">
                  {cost.category}
                </TableCell>
                <TableCell className="text-muted-foreground hidden sm:table-cell">
                  {formatDate(cost.date)}
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={cost.paymentStatus} />
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(cost.amount)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-7" />
                      }
                    >
                      <MoreHorizontalIcon className="size-4" />
                      <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditing(cost)}>
                        Edit
                      </DropdownMenuItem>
                      {cost.paymentStatus !== "paid" && (
                        <DropdownMenuItem
                          onClick={() => {
                            updateCost(cost.id, { paymentStatus: "paid" })
                            toast.success("Marked as paid")
                          }}
                        >
                          Mark as paid
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleting(cost)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CostDialog
        open={Boolean(editing)}
        onOpenChange={(o) => !o && setEditing(undefined)}
        cost={editing}
      />
      <ConfirmDelete
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(undefined)}
        title="Delete expense?"
        description={`This will permanently remove "${deleting?.description ?? ""}" (${
          deleting ? formatCurrency(deleting.amount) : ""
        }).`}
        onConfirm={() => {
          if (deleting) {
            deleteCost(deleting.id)
            toast.success("Expense deleted")
            setDeleting(undefined)
          }
        }}
      />
    </>
  )
}
