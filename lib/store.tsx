"use client"

import * as React from "react"
import type {
  AppData,
  ClientInvoice,
  CostEntry,
  Project,
  Supplier,
} from "./types"
import { seedData } from "./seed"

const STORAGE_KEY = "supplier-management-data"

type StoreContextValue = {
  data: AppData
  ready: boolean
  addProject: (p: Omit<Project, "id" | "createdAt">) => Project
  updateProject: (id: string, patch: Partial<Project>) => void
  deleteProject: (id: string) => void
  addSupplier: (s: Omit<Supplier, "id" | "createdAt">) => Supplier
  updateSupplier: (id: string, patch: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void
  addCost: (c: Omit<CostEntry, "id" | "createdAt">) => CostEntry
  updateCost: (id: string, patch: Partial<CostEntry>) => void
  deleteCost: (id: string) => void
  addInvoice: (i: Omit<ClientInvoice, "id" | "createdAt">) => ClientInvoice
  updateInvoice: (id: string, patch: Partial<ClientInvoice>) => void
  deleteInvoice: (id: string) => void
  resetData: () => void
}

const StoreContext = React.createContext<StoreContextValue | null>(null)

function migrate(parsed: AppData): AppData {
  // Data saved by older versions lacks type/client/valuation fields (v1)
  // or the client invoices array (v2, USD amounts).
  const isLegacy =
    parsed.projects.some((p) => p.contractValue === undefined) ||
    !Array.isArray(parsed.invoices)
  if (!isLegacy) return parsed

  // Pure sample data from an old version: replace with the new sample set.
  const seedIds = new Set(seedData.projects.map((p) => p.id))
  if (parsed.projects.every((p) => seedIds.has(p.id))) return seedData

  return {
    ...parsed,
    invoices: parsed.invoices ?? [],
    projects: parsed.projects.map((p) => ({
      ...p,
      projectType: p.projectType ?? "construction",
      client: p.client ?? "",
      contractValue: p.contractValue ?? 0,
    })),
  }
}

function loadData(): AppData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppData
      if (parsed && Array.isArray(parsed.projects)) return migrate(parsed)
    }
  } catch {
    // corrupted storage falls through to seed
  }
  return seedData
}

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<AppData>(seedData)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    setData(loadData())
    setReady(true)
  }, [])

  React.useEffect(() => {
    if (!ready) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // storage full or unavailable; keep working in memory
    }
  }, [data, ready])

  const value = React.useMemo<StoreContextValue>(() => {
    return {
      data,
      ready,
      addProject(input) {
        const project: Project = {
          ...input,
          id: newId(),
          createdAt: new Date().toISOString(),
        }
        setData((d) => ({ ...d, projects: [project, ...d.projects] }))
        return project
      },
      updateProject(id, patch) {
        setData((d) => ({
          ...d,
          projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }))
      },
      deleteProject(id) {
        setData((d) => ({
          ...d,
          projects: d.projects.filter((p) => p.id !== id),
          costs: d.costs.filter((c) => c.projectId !== id),
          invoices: d.invoices.filter((i) => i.projectId !== id),
        }))
      },
      addSupplier(input) {
        const supplier: Supplier = {
          ...input,
          id: newId(),
          createdAt: new Date().toISOString(),
        }
        setData((d) => ({ ...d, suppliers: [supplier, ...d.suppliers] }))
        return supplier
      },
      updateSupplier(id, patch) {
        setData((d) => ({
          ...d,
          suppliers: d.suppliers.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        }))
      },
      deleteSupplier(id) {
        setData((d) => ({
          ...d,
          suppliers: d.suppliers.filter((s) => s.id !== id),
          costs: d.costs.filter((c) => c.supplierId !== id),
        }))
      },
      addCost(input) {
        const cost: CostEntry = {
          ...input,
          id: newId(),
          createdAt: new Date().toISOString(),
        }
        setData((d) => ({ ...d, costs: [cost, ...d.costs] }))
        return cost
      },
      updateCost(id, patch) {
        setData((d) => ({
          ...d,
          costs: d.costs.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }))
      },
      deleteCost(id) {
        setData((d) => ({ ...d, costs: d.costs.filter((c) => c.id !== id) }))
      },
      addInvoice(input) {
        const invoice: ClientInvoice = {
          ...input,
          id: newId(),
          createdAt: new Date().toISOString(),
        }
        setData((d) => ({ ...d, invoices: [invoice, ...d.invoices] }))
        return invoice
      },
      updateInvoice(id, patch) {
        setData((d) => ({
          ...d,
          invoices: d.invoices.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        }))
      },
      deleteInvoice(id) {
        setData((d) => ({
          ...d,
          invoices: d.invoices.filter((i) => i.id !== id),
        }))
      },
      resetData() {
        setData(seedData)
      },
    }
  }, [data, ready])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = React.useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
