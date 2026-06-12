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
import { useStore } from "@/lib/store"
import type { ClientInvoice, InvoiceStatus } from "@/lib/types"

export function InvoiceDialog({
  open,
  onOpenChange,
  invoice,
  defaultProjectId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: ClientInvoice
  defaultProjectId?: string
}) {
  const { data, addInvoice, updateInvoice } = useStore()
  const editing = Boolean(invoice)

  const [projectId, setProjectId] = React.useState("")
  const [invoiceNumber, setInvoiceNumber] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [dateInvoiced, setDateInvoiced] = React.useState("")
  const [status, setStatus] = React.useState<InvoiceStatus>("invoiced")
  const [dateReceived, setDateReceived] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setProjectId(invoice?.projectId ?? defaultProjectId ?? "")
      setInvoiceNumber(invoice?.invoiceNumber ?? "")
      setDescription(invoice?.description ?? "")
      setAmount(invoice ? String(invoice.amount) : "")
      setDateInvoiced(
        invoice?.dateInvoiced ?? new Date().toISOString().slice(0, 10)
      )
      setStatus(invoice?.status ?? "invoiced")
      setDateReceived(invoice?.dateReceived ?? "")
    }
  }, [open, invoice, defaultProjectId])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amountNum = Number(amount)
    if (!projectId) {
      toast.error("Select a project")
      return
    }
    if (!amount || Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Enter a valid invoice amount")
      return
    }
    const payload = {
      projectId,
      invoiceNumber: invoiceNumber.trim(),
      description: description.trim(),
      amount: amountNum,
      dateInvoiced,
      status,
      dateReceived:
        status === "received"
          ? dateReceived || new Date().toISOString().slice(0, 10)
          : undefined,
    }
    if (invoice) {
      updateInvoice(invoice.id, payload)
      toast.success("Invoice updated")
    } else {
      addInvoice(payload)
      toast.success("Invoice recorded")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Client Invoice" : "New Client Invoice"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Update this invoice to the client."
              : "Record an amount billed to the client of a project."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Project</Label>
              <Select
                value={projectId}
                onValueChange={(v) => setProjectId(v ?? "")}
              >
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
              <Label htmlFor="invoice-number">Invoice #</Label>
              <Input
                id="invoice-number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. PINV-2026-010"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invoice-description">Description</Label>
            <Input
              id="invoice-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Phase 2 completion certificate"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="invoice-amount">Amount (TZS)</Label>
              <Input
                id="invoice-amount"
                type="number"
                min="0"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invoice-date">Date invoiced</Label>
              <Input
                id="invoice-date"
                type="date"
                value={dateInvoiced}
                onChange={(e) => setDateInvoiced(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as InvoiceStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoiced">
                    Invoiced — awaiting payment
                  </SelectItem>
                  <SelectItem value="received">Payment received</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === "received" && (
              <div className="grid gap-2">
                <Label htmlFor="invoice-received">Date received</Label>
                <Input
                  id="invoice-received"
                  type="date"
                  value={dateReceived}
                  onChange={(e) => setDateReceived(e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editing ? "Save changes" : "Record invoice"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
