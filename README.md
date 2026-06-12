# SupplyTrack — Construction & Supply Management System

A responsive project, supplier and cost management system for a construction company that also supplies construction materials. Built with Next.js 16, Tailwind CSS v4 and shadcn/ui.

## Features

- **Profit/loss tracking** — every project carries a valuation (contract value, what the client pays). Profit = valuation − recorded costs, shown live per project with margin %, plus a company-wide projected profit and a profitability table on the dashboard.
- **Client payment tracking** — record invoices issued to clients per project and mark them received. See invoiced vs received vs awaiting payment vs not-yet-invoiced per project, plus a global Client Invoices page and a Receivables card on the dashboard.
- **Two project types** — Construction (you build for a client) and Supply (you deliver materials to a client's site), each with its own badge and filterable lists.
- **Tanzanian Shillings** — all amounts are in TZS; tables show full amounts, stat cards and chart axes use compact form (e.g. TSh 800M).
- **Dashboard** — portfolio value, total costs, projected profit, receivables, unpaid supplier bills, monthly spending chart, spend by category, project profitability table, budget health, recent expenses.
- **Projects** — create projects with client, valuation, cost budget and status (planning / active / on-hold / completed); track budget utilization with over-budget warnings; see all suppliers and expenses per project.
- **Suppliers** — searchable directory with categories, contacts, star ratings and active/inactive status; per-supplier view with total business, outstanding balance and expense history.
- **Expenses** — record costs against a project and supplier with quantity × unit price, payment status (paid / pending / overdue), invoice numbers; filter by project, supplier, status or text; mark as paid in one click.
- **CSV export** for filtered expenses and per-project expense lists.
- **Dark mode**, toast notifications, confirmation dialogs for deletes, fully responsive layout with a collapsible sidebar.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The app ships with sample data on first load so you can explore immediately.

## Data storage

Data is persisted in the browser's `localStorage` (key: `supplier-management-data`), so everything survives page reloads with no database setup. Deleting a project or supplier also removes its expenses. To start fresh, clear the key from your browser's devtools.

To move to a real database later, the data layer is isolated in `lib/store.tsx` — swap its implementation for API calls (e.g. Prisma + route handlers) without touching the pages.

## Structure

- `app/` — pages: dashboard (`/`), `/projects`, `/projects/[id]`, `/suppliers`, `/suppliers/[id]`, `/costs`
- `components/` — app shell (sidebar, header), dialogs for project/supplier/expense CRUD, shared expenses table, badges
- `lib/` — types, seed data, localStorage store, selectors (derived totals), formatting helpers
