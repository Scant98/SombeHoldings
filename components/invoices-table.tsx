"use client"

import * as React from "react"
import Link from "next/link"
import { MoreHorizontalIcon } from "lucide-react"
import { toast } from "sonner"

import { InvoiceStatusBadge } from "@/components/badges"
import { ConfirmDelete } from "@/components/confirm-delete"
import { InvoiceDialog } from "@/components/invoice-dialog"
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
import type { ClientInvoice } from "@/lib/types"

export function InvoicesTable({
  invoices,
  showProject = true,
}: {
  invoices: ClientInvoice[]
  showProject?: boolean
}) {
  const { data, updateInvoice, deleteInvoice } = useStore()
  const [editing, setEditing] = React.useState<ClientInvoice | undefined>()
  const [deleting, setDeleting] = React.useState<ClientInvoice | undefined>()

  const projectName = (id: string) =>
    data.projects.find((p) => p.id === id)?.name ?? "—"

  if (invoices.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed py-12 text-sm">
        <p className="font-medium">No client invoices yet</p>
        <p>Invoices you issue to clients will appear here.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              {showProject && (
                <TableHead className="hidden md:table-cell">Project</TableHead>
              )}
              <TableHead className="hidden sm:table-cell">Invoiced</TableHead>
              <TableHead className="hidden lg:table-cell">Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="font-medium">
                    {invoice.invoiceNumber || "Untitled invoice"}
                  </div>
                  {invoice.description && (
                    <div className="text-muted-foreground text-xs">
                      {invoice.description}
                    </div>
                  )}
                </TableCell>
                {showProject && (
                  <TableCell className="hidden md:table-cell">
                    <Link
                      href={`/dashboard/projects/${invoice.projectId}`}
                      className="hover:underline"
                    >
                      {projectName(invoice.projectId)}
                    </Link>
                  </TableCell>
                )}
                <TableCell className="text-muted-foreground hidden sm:table-cell">
                  {formatDate(invoice.dateInvoiced)}
                </TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell">
                  {invoice.dateReceived ? formatDate(invoice.dateReceived) : "—"}
                </TableCell>
                <TableCell>
                  <InvoiceStatusBadge status={invoice.status} />
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(invoice.amount)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="size-7" />
                      }
                    >
                      <MoreHorizontalIcon className="size-4" />
                      <span className="sr-only">Invoice actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditing(invoice)}>
                        Edit
                      </DropdownMenuItem>
                      {invoice.status !== "received" && (
                        <DropdownMenuItem
                          onClick={() => {
                            updateInvoice(invoice.id, {
                              status: "received",
                              dateReceived: new Date()
                                .toISOString()
                                .slice(0, 10),
                            })
                            toast.success("Marked as received")
                          }}
                        >
                          Mark as received
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleting(invoice)}
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

      <InvoiceDialog
        open={Boolean(editing)}
        onOpenChange={(o) => !o && setEditing(undefined)}
        invoice={editing}
      />
      <ConfirmDelete
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(undefined)}
        title="Delete invoice?"
        description={`This will permanently remove invoice "${
          deleting?.invoiceNumber || deleting?.description || ""
        }" (${deleting ? formatCurrency(deleting.amount) : ""}).`}
        onConfirm={() => {
          if (deleting) {
            deleteInvoice(deleting.id)
            toast.success("Invoice deleted")
            setDeleting(undefined)
          }
        }}
      />
    </>
  )
}
