"use client"

import * as React from "react"
import Link from "next/link"
import { MoreHorizontalIcon, PlusIcon, SearchIcon } from "lucide-react"
import { toast } from "sonner"

import { ProjectStatusBadge, ProjectTypeBadge } from "@/components/badges"
import { ConfirmDelete } from "@/components/confirm-delete"
import { ProjectDialog } from "@/components/project-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrencyCompact, formatDate } from "@/lib/format"
import {
  projectProfit,
  projectSpent,
  projectSupplierIds,
} from "@/lib/selectors"
import { useStore } from "@/lib/store"
import type { Project } from "@/lib/types"

export default function ProjectsPage() {
  const { data, ready, deleteProject } = useStore()
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Project | undefined>()
  const [deleting, setDeleting] = React.useState<Project | undefined>()

  if (!ready) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    )
  }

  const filtered = data.projects.filter((p) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q)
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    const matchesType = typeFilter === "all" || p.projectType === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="supply">Supply</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setCreateOpen(true)}>
            <PlusIcon className="size-4" /> New Project
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-sm">
          <p className="font-medium">No projects found</p>
          <p>Create a project to start tracking suppliers and costs.</p>
          <Button className="mt-2" onClick={() => setCreateOpen(true)}>
            <PlusIcon className="size-4" /> New Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => {
            const spent = projectSpent(data, project.id)
            const supplierCount = projectSupplierIds(data, project.id).length
            const pct =
              project.budget > 0 ? (spent / project.budget) * 100 : 0
            const over = pct > 100
            const profit = projectProfit(data, project)
            return (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="leading-snug">
                      <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="hover:underline"
                      >
                        {project.name}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <ProjectStatusBadge status={project.status} />
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                            />
                          }
                        >
                          <MoreHorizontalIcon className="size-4" />
                          <span className="sr-only">Project actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            render={<Link href={`/dashboard/projects/${project.id}`} />}
                          >
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditing(project)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeleting(project)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ProjectTypeBadge type={project.projectType} />
                    {project.client && (
                      <span className="text-muted-foreground text-xs">
                        for {project.client}
                      </span>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-end gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget used</span>
                    <span
                      className={
                        over
                          ? "font-medium text-red-600 dark:text-red-400"
                          : "font-medium"
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
                    {formatCurrencyCompact(spent)} of {formatCurrencyCompact(project.budget)}
                  </p>
                  <div className="mt-1 flex items-center justify-between border-t pt-2 text-sm">
                    <span className="text-muted-foreground">
                      Profit ({formatCurrencyCompact(project.contractValue)} value)
                    </span>
                    <span
                      className={
                        profit >= 0
                          ? "font-semibold text-emerald-600 tabular-nums dark:text-emerald-400"
                          : "font-semibold text-red-600 tabular-nums dark:text-red-400"
                      }
                    >
                      {profit >= 0 ? "+" : ""}
                      {formatCurrencyCompact(profit)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="text-muted-foreground justify-between text-xs">
                  <span>Started {formatDate(project.startDate)}</span>
                  <span>
                    {supplierCount} supplier{supplierCount === 1 ? "" : "s"}
                  </span>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      <ProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ProjectDialog
        open={Boolean(editing)}
        onOpenChange={(o) => !o && setEditing(undefined)}
        project={editing}
      />
      <ConfirmDelete
        open={Boolean(deleting)}
        onOpenChange={(o) => !o && setDeleting(undefined)}
        title="Delete project?"
        description={`This will permanently delete "${deleting?.name ?? ""}" and all of its expenses. This action cannot be undone.`}
        onConfirm={() => {
          if (deleting) {
            deleteProject(deleting.id)
            toast.success("Project deleted")
            setDeleting(undefined)
          }
        }}
      />
    </div>
  )
}
