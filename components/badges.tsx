import { Badge } from "@/components/ui/badge"
import type {
  InvoiceStatus,
  PaymentStatus,
  ProjectStatus,
  ProjectType,
  SupplierStatus,
} from "@/lib/types"
import { cn } from "@/lib/utils"

const projectStyles: Record<ProjectStatus, string> = {
  planning:
    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-transparent",
  active:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-transparent",
  "on-hold":
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-transparent",
  completed:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-transparent",
}

const projectLabels: Record<ProjectStatus, string> = {
  planning: "Planning",
  active: "Active",
  "on-hold": "On Hold",
  completed: "Completed",
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge className={cn(projectStyles[status])}>{projectLabels[status]}</Badge>
}

const typeStyles: Record<ProjectType, string> = {
  construction:
    "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-transparent",
  supply:
    "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300 border-transparent",
}

export function ProjectTypeBadge({ type }: { type: ProjectType }) {
  return (
    <Badge className={cn(typeStyles[type], "capitalize")}>{type}</Badge>
  )
}

const paymentStyles: Record<PaymentStatus, string> = {
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-transparent",
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-transparent",
  overdue:
    "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-transparent",
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge className={cn(paymentStyles[status], "capitalize")}>{status}</Badge>
  )
}

const invoiceStyles: Record<InvoiceStatus, string> = {
  received:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-transparent",
  invoiced:
    "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-transparent",
}

const invoiceLabels: Record<InvoiceStatus, string> = {
  received: "Received",
  invoiced: "Awaiting payment",
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge className={cn(invoiceStyles[status])}>{invoiceLabels[status]}</Badge>
}

export function SupplierStatusBadge({ status }: { status: SupplierStatus }) {
  return (
    <Badge
      variant={status === "active" ? "default" : "secondary"}
      className="capitalize"
    >
      {status}
    </Badge>
  )
}
