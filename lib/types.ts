export type ProjectStatus = "planning" | "active" | "on-hold" | "completed"

export type ProjectType = "construction" | "supply"

export type PaymentStatus = "paid" | "pending" | "overdue"

export type SupplierStatus = "active" | "inactive"

export const SUPPLIER_CATEGORIES = [
  "Materials",
  "Equipment",
  "Logistics",
  "Services",
  "IT & Software",
  "Office Supplies",
  "Other",
] as const

export type SupplierCategory = (typeof SUPPLIER_CATEGORIES)[number]

export const COST_CATEGORIES = [
  "Materials",
  "Equipment",
  "Labor",
  "Logistics",
  "Services",
  "Other",
] as const

export type CostCategory = (typeof COST_CATEGORIES)[number]

export interface Project {
  id: string
  name: string
  description: string
  projectType: ProjectType
  client: string
  /** Contract value / project valuation — what the client pays. Profit = this minus costs. */
  contractValue: number
  /** Internal spending budget (planned cost). */
  budget: number
  status: ProjectStatus
  startDate: string // ISO date
  endDate?: string // ISO date
  createdAt: string
}

export interface Supplier {
  id: string
  name: string
  category: SupplierCategory
  contactName: string
  email: string
  phone: string
  address: string
  rating: number // 1-5
  status: SupplierStatus
  notes: string
  createdAt: string
}

export type InvoiceStatus = "invoiced" | "received"

/** An invoice issued to the client of a project (money coming in). */
export interface ClientInvoice {
  id: string
  projectId: string
  invoiceNumber: string
  description: string
  amount: number
  dateInvoiced: string // ISO date
  status: InvoiceStatus
  dateReceived?: string // ISO date, set when status is "received"
  createdAt: string
}

export interface CostEntry {
  id: string
  projectId: string
  supplierId: string
  description: string
  category: CostCategory
  quantity: number
  unitPrice: number
  amount: number
  date: string // ISO date
  paymentStatus: PaymentStatus
  invoiceNumber?: string
  createdAt: string
}

export interface AppData {
  projects: Project[]
  suppliers: Supplier[]
  costs: CostEntry[]
  invoices: ClientInvoice[]
}
