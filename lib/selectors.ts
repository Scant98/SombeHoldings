import type { AppData, ClientInvoice, CostEntry, Project } from "./types"

export function projectSpent(data: AppData, projectId: string) {
  return data.costs
    .filter((c) => c.projectId === projectId)
    .reduce((sum, c) => sum + c.amount, 0)
}

/** Profit/loss for a project: contract value minus all recorded costs. */
export function projectProfit(data: AppData, project: Project) {
  return project.contractValue - projectSpent(data, project.id)
}

/** Profit margin as a percentage of contract value, or null when no valuation set. */
export function profitMargin(project: Project, profit: number) {
  return project.contractValue > 0 ? (profit / project.contractValue) * 100 : null
}

export function invoicedTotal(invoices: ClientInvoice[]) {
  return invoices.reduce((sum, i) => sum + i.amount, 0)
}

export function receivedTotal(invoices: ClientInvoice[]) {
  return invoices
    .filter((i) => i.status === "received")
    .reduce((sum, i) => sum + i.amount, 0)
}

/** Money billed to clients but not yet received. */
export function outstandingReceivables(invoices: ClientInvoice[]) {
  return invoicedTotal(invoices) - receivedTotal(invoices)
}

export function projectInvoices(data: AppData, projectId: string) {
  return data.invoices.filter((i) => i.projectId === projectId)
}

export function projectSupplierIds(data: AppData, projectId: string) {
  return [
    ...new Set(
      data.costs.filter((c) => c.projectId === projectId).map((c) => c.supplierId)
    ),
  ]
}

export function supplierTotal(data: AppData, supplierId: string) {
  return data.costs
    .filter((c) => c.supplierId === supplierId)
    .reduce((sum, c) => sum + c.amount, 0)
}

export function totalByStatus(costs: CostEntry[], status: CostEntry["paymentStatus"]) {
  return costs
    .filter((c) => c.paymentStatus === status)
    .reduce((sum, c) => sum + c.amount, 0)
}

/** Spend grouped by month (last `months` months), keyed YYYY-MM. */
export function monthlySpend(costs: CostEntry[], months = 9) {
  const now = new Date()
  const buckets: { key: string; total: number }[] = []
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    buckets.push({ key, total: 0 })
  }
  const byKey = new Map(buckets.map((b) => [b.key, b]))
  for (const c of costs) {
    const key = c.date.slice(0, 7)
    const bucket = byKey.get(key)
    if (bucket) bucket.total += c.amount
  }
  return buckets
}

export function spendByCategory(costs: CostEntry[]) {
  const map = new Map<string, number>()
  for (const c of costs) {
    map.set(c.category, (map.get(c.category) ?? 0) + c.amount)
  }
  return [...map.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}
