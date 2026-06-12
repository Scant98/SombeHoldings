"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/format"
import { useStore } from "@/lib/store"
import {
  COST_CATEGORIES,
  type CostCategory,
  type CostEntry,
  type PaymentStatus,
} from "@/lib/types"

export function CostDialog({
  open,
  onOpenChange,
  cost,
  defaultProjectId,
  defaultSupplierId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  cost?: CostEntry
  defaultProjectId?: string
  defaultSupplierId?: string
}) {
  const { data, addCost, updateCost } = useStore()
  const editing = Boolean(cost)

  const [projectId, setProjectId] = React.useState("")
  const [supplierId, setSupplierId] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState<CostCategory>("Materials")
  const [quantity, setQuantity] = React.useState("1")
  const [unitPrice, setUnitPrice] = React.useState("")
  const [date, setDate] = React.useState("")
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>("pending")
  const [invoiceNumber, setInvoiceNumber] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setProjectId(cost?.projectId ?? defaultProjectId ?? "")
      setSupplierId(cost?.supplierId ?? defaultSupplierId ?? "")
      setDescription(cost?.description ?? "")
      setCategory(cost?.category ?? "Materials")
      setQuantity(String(cost?.quantity ?? 1))
      setUnitPrice(cost ? String(cost.unitPrice) : "")
      setDate(cost?.date ?? new Date().toISOString().slice(0, 10))
      setPaymentStatus(cost?.paymentStatus ?? "pending")
      setInvoiceNumber(cost?.invoiceNumber ?? "")
    }
  }, [open, cost, defaultProjectId, defaultSupplierId])

  const qty = Number(quantity) || 0
  const price = Number(unitPrice) || 0
  const total = qty * price

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!projectId) {
      toast.error("Select a project")
      return
    }
    if (!supplierId) {
      toast.error("Select a supplier")
      return
    }
    if (!description.trim()) {
      toast.error("Description is required")
      return
    }
    if (qty <= 0 || price <= 0) {
      toast.error("Quantity and unit price must be greater than zero")
      return
    }
    const payload = {
      projectId,
      supplierId,
      description: description.trim(),
      category,
      quantity: qty,
      unitPrice: price,
      amount: total,
      date,
      paymentStatus,
      invoiceNumber: invoiceNumber.trim() || undefined,
    }
    if (cost) {
      updateCost(cost.id, payload)
      toast.success("Expense updated")
    } else {
      addCost(payload)
      toast.success("Expense recorded")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Expense" : "Record Expense"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update this expense entry."
              : "Log a cost against a project and supplier."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Project</Label>
              <Select value={projectId} onValueChange={(v) => setProjectId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {data.projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Supplier</Label>
              <Select value={supplierId} onValueChange={(v) => setSupplierId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {data.suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cost-description">Description</Label>
            <Input
              id="cost-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Structural steel delivery"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as CostCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COST_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost-quantity">Quantity</Label>
              <Input
                id="cost-quantity"
                type="number"
                min="0"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost-unit-price">Unit price</Label>
              <Input
                id="cost-unit-price"
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="bg-muted text-muted-foreground flex items-center justify-between rounded-md px-3 py-2 text-sm">
            <span>Total amount</span>
            <span className="text-foreground font-semibold">
              {formatCurrency(total)}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="cost-date">Date</Label>
              <Input
                id="cost-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Payment status</Label>
              <Select
                value={paymentStatus}
                onValueChange={(v) => setPaymentStatus(v as PaymentStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost-invoice">Invoice #</Label>
              <Input
                id="cost-invoice"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{editing ? "Save changes" : "Record expense"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
