"use client"

import * as React from "react"
import Link from "next/link"
import { MoreHorizontalIcon, PlusIcon, SearchIcon } from "lucide-react"
import { toast } from "sonner"

import { SupplierStatusBadge } from "@/components/badges"
import { ConfirmDelete } from "@/components/confirm-delete"
import { RatingStars } from "@/components/rating-stars"
import { SupplierDialog } from "@/components/supplier-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"
import { supplierTotal } from "@/lib/selectors"
import { useStore } from "@/lib/store"
import { SUPPLIER_CATEGORIES, type Supplier } from "@/lib/types"

export default function SuppliersPage() {
  const { data, ready, deleteSupplier } = useStore()
  const [search, setSearch] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Supplier | undefined>()
  const [deleting, setDeleting] = React.useState<Supplier | undefined>()

  if (!ready) {
    return <Skeleton className="h-96 rounded-xl" />
  }

  const filtered = data.suppliers.filter((s) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !search ||
      s.name.toLowerCase().includes(q) ||
      s.contactName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    const matchesCategory =
      categoryFilter === "all" || s.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search suppliers, contacts, emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3">
          <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "all")}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {SUPPLIER_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon className="size-4" /> New Supplier
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-sm">
          <p className="font-medium">No suppliers found</p>
          <p>Add suppliers to build your directory.</p>
          <Button className="mt-2" onClick={() => setCreateOpen(true)}>
            <PlusIcon className="size-4" /> New Supplier
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Contact</TableHead>
                <TableHead className="hidden sm:table-cell">Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Business</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/suppliers/${supplier.id}`}
                      className="font-medium hover:underline"
                    >
                      {supplier.name}
                    </Link>
                    <div className="text-muted-foreground text-xs md:hidden">
                      {supplier.category}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">
                    {supplier.category}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div>{supplier.contactName || "—"}</div>
                    <div className="text-muted-foreground text-xs">
                      {supplier.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <RatingStars rating={supplier.rating} />
                  </TableCell>
                  <TableCell>
                    <SupplierStatusBadge status={supplier.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(supplierTotal(data, supplier.id))}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon" className="size-7" />
                        }
                      >
                        <MoreHorizontalIcon className="size-4" />
                        <span className="sr-only">Supplier actions</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          render={<Link href={`/dashboard/suppliers/${supplier.id}`} />}
                        >
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditing(supplier)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleting(supplier)}
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
      )}

      <SupplierDialog open={createOpen} onOpenChange={setCreateOpen} />
      <SupplierDialog
        open={Boolean(editing)}
        onOpenChange={(o) => !o && setEditing(undefined)}
        supplier={editing}
      />
      <ConfirmDelete
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(undefined)}
        title="Delete supplier?"
        description={`This will permanently delete "${deleting?.name ?? ""}" and all expenses recorded with them. This action cannot be undone.`}
        onConfirm={() => {
          if (deleting) {
            deleteSupplier(deleting.id)
            toast.success("Supplier deleted")
            setDeleting(undefined)
          }
        }}
      />
    </div>
  )
}
