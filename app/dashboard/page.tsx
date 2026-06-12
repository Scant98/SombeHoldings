"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  BanknoteIcon,
  BriefcaseIcon,
  ClockIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ProjectTypeBadge } from "@/components/badges"
import { CostsTable } from "@/components/costs-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, formatCurrencyCompact, monthLabel } from "@/lib/format"
import {
  monthlySpend,
  outstandingReceivables,
  profitMargin,
  projectProfit,
  projectSpent,
  spendByCategory,
  totalByStatus,
} from "@/lib/selectors"
import { useStore } from "@/lib/store"

const chartConfig = {
  total: { label: "Spend", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function DashboardPage() {
  const { data, ready } = useStore()

  if (!ready) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    )
  }

  const totalSpend = data.costs.reduce((s, c) => s + c.amount, 0)
  const portfolioValue = data.projects.reduce((s, p) => s + p.contractValue, 0)
  const projectedProfit = portfolioValue - totalSpend
  const overallMargin =
    portfolioValue > 0 ? (projectedProfit / portfolioValue) * 100 : 0
  const activeProjects = data.projects.filter((p) => p.status === "active").length
  const pendingAmount =
    totalByStatus(data.costs, "pending") + totalByStatus(data.costs, "overdue")
  const pendingCount = data.costs.filter(
    (c) => c.paymentStatus !== "paid"
  ).length
  const receivables = outstandingReceivables(data.invoices)
  const receivableCount = data.invoices.filter(
    (i) => i.status === "invoiced"
  ).length

  const spendSeries = monthlySpend(data.costs).map((b) => ({
    month: monthLabel(b.key),
    total: b.total,
  }))
  const categories = spendByCategory(data.costs)
  const maxCategory = categories[0]?.total ?? 1

  const trackedProjects = data.projects
    .filter((p) => p.status !== "completed")
    .map((p) => ({ project: p, spent: projectSpent(data, p.id) }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 4)

  const recentCosts = [...data.costs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  const profitRows = data.projects
    .map((project) => {
      const spent = projectSpent(data, project.id)
      const profit = projectProfit(data, project)
      return { project, spent, profit, margin: profitMargin(project, profit) }
    })
    .sort((a, b) => b.profit - a.profit)

  const stats: {
    title: string
    value: string
    hint: string
    icon: React.ElementType
    valueClass?: string
  }[] = [
    {
      title: "Portfolio Value",
      value: formatCurrencyCompact(portfolioValue),
      hint: `${data.projects.length} projects, ${activeProjects} active`,
      icon: BriefcaseIcon,
    },
    {
      title: "Total Costs",
      value: formatCurrencyCompact(totalSpend),
      hint: `${data.costs.length} expenses recorded`,
      icon: WalletIcon,
    },
    {
      title: "Projected Profit",
      value: `${projectedProfit >= 0 ? "+" : ""}${formatCurrencyCompact(projectedProfit)}`,
      hint: `${overallMargin.toFixed(1)}% overall margin`,
      icon: TrendingUpIcon,
      valueClass:
        projectedProfit >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400",
    },
    {
      title: "Receivables",
      value: formatCurrencyCompact(receivables),
      hint: `${receivableCount} client invoice${receivableCount === 1 ? "" : "s"} awaiting payment`,
      icon: BanknoteIcon,
    },
    {
      title: "Unpaid Supplier Bills",
      value: formatCurrencyCompact(pendingAmount),
      hint: `${pendingCount} pending or overdue`,
      icon: ClockIcon,
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold tabular-nums ${stat.valueClass ?? ""}`}
              >
                {stat.value}
              </div>
              <p className="text-muted-foreground text-xs">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Spending Over Time</CardTitle>
            <CardDescription>Monthly total across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <AreaChart data={spendSeries} margin={{ left: 4, right: 12 }}>
                <defs>
                  <linearGradient id="fillSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={72}
                  tickFormatter={(v: number) => formatCurrencyCompact(v)}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Area
                  dataKey="total"
                  type="monotone"
                  fill="url(#fillSpend)"
                  stroke="var(--color-total)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
            <CardDescription>Where the money goes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {categories.length === 0 && (
              <p className="text-muted-foreground text-sm">No expenses yet.</p>
            )}
            {categories.map((c) => (
              <div key={c.category} className="grid gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{c.category}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {formatCurrencyCompact(c.total)}
                  </span>
                </div>
                <Progress value={(c.total / maxCategory) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Profitability</CardTitle>
          <CardDescription>
            Valuation vs costs across all projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Client</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">
                    Costs
                  </TableHead>
                  <TableHead className="text-right">Profit / Loss</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">
                    Margin
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitRows.map(({ project, spent, profit, margin }) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="hover:underline"
                      >
                        {project.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <ProjectTypeBadge type={project.projectType} />
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">
                      {project.client || "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCurrency(project.contractValue)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right tabular-nums">
                      {formatCurrency(spent)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-semibold tabular-nums ${
                        profit >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {profit >= 0 ? "+" : ""}
                      {formatCurrency(profit)}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden lg:table-cell text-right tabular-nums">
                      {margin !== null ? `${margin.toFixed(1)}%` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Budget Health</CardTitle>
            <CardDescription>Spend vs budget on open projects</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {trackedProjects.length === 0 && (
              <p className="text-muted-foreground text-sm">No open projects.</p>
            )}
            {trackedProjects.map(({ project, spent }) => {
              const pct = project.budget > 0 ? (spent / project.budget) * 100 : 0
              const over = pct > 100
              return (
                <div key={project.id} className="grid gap-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="truncate font-medium hover:underline"
                    >
                      {project.name}
                    </Link>
                    <span
                      className={
                        over
                          ? "text-red-600 dark:text-red-400 tabular-nums"
                          : "text-muted-foreground tabular-nums"
                      }
                    >
                      {Math.round(pct)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(pct, 100)}
                    className={over ? "[&>div]:bg-red-500" : undefined}
                  />
                  <p className="text-muted-foreground text-xs tabular-nums">
                    {formatCurrencyCompact(spent)} of{" "}
                    {formatCurrencyCompact(project.budget)}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Latest recorded costs</CardDescription>
            </div>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/costs" />}>
              View all <ArrowRightIcon className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <CostsTable costs={recentCosts} showSupplier={false} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
