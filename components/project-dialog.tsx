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
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"
import type { Project, ProjectStatus, ProjectType } from "@/lib/types"

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "planning", label: "Planning" },
  { value: "active", label: "Active" },
  { value: "on-hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
]

export function ProjectDialog({
  open,
  onOpenChange,
  project,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
}) {
  const { addProject, updateProject } = useStore()
  const editing = Boolean(project)

  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [projectType, setProjectType] = React.useState<ProjectType>("construction")
  const [client, setClient] = React.useState("")
  const [contractValue, setContractValue] = React.useState("")
  const [budget, setBudget] = React.useState("")
  const [status, setStatus] = React.useState<ProjectStatus>("planning")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setName(project?.name ?? "")
      setDescription(project?.description ?? "")
      setProjectType(project?.projectType ?? "construction")
      setClient(project?.client ?? "")
      setContractValue(
        project && project.contractValue > 0 ? String(project.contractValue) : ""
      )
      setBudget(project ? String(project.budget) : "")
      setStatus(project?.status ?? "planning")
      setStartDate(project?.startDate ?? new Date().toISOString().slice(0, 10))
      setEndDate(project?.endDate ?? "")
    }
  }, [open, project])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const budgetNum = Number(budget)
    const valueNum = Number(contractValue)
    if (!name.trim()) {
      toast.error("Project name is required")
      return
    }
    if (!contractValue || Number.isNaN(valueNum) || valueNum <= 0) {
      toast.error("Enter the project valuation (contract value)")
      return
    }
    if (!budget || Number.isNaN(budgetNum) || budgetNum < 0) {
      toast.error("Enter a valid budget amount")
      return
    }
    const payload = {
      name: name.trim(),
      description: description.trim(),
      projectType,
      client: client.trim(),
      contractValue: valueNum,
      budget: budgetNum,
      status,
      startDate,
      endDate: endDate || undefined,
    }
    if (project) {
      updateProject(project.id, payload)
      toast.success("Project updated")
    } else {
      addProject(payload)
      toast.success("Project created")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Project" : "New Project"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Update the project details below."
              : "Create a project to start tracking suppliers and costs."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Warehouse Expansion"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Project type</Label>
              <Select
                value={projectType}
                onValueChange={(v) => setProjectType(v as ProjectType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="supply">Supply</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-client">Client</Label>
              <Input
                id="project-client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Who is this project for?"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="project-value">Project valuation (USD)</Label>
              <Input
                id="project-value"
                type="number"
                min="0"
                step="0.01"
                value={contractValue}
                onChange={(e) => setContractValue(e.target.value)}
                placeholder="Contract value"
              />
              <p className="text-muted-foreground text-xs">
                What the client pays. Used to calculate profit/loss.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-budget">Cost budget (USD)</Label>
              <Input
                id="project-budget"
                type="number"
                min="0"
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Planned spending"
              />
              <p className="text-muted-foreground text-xs">
                Your planned spending limit on this project.
              </p>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as ProjectStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="project-start">Start date</Label>
              <Input
                id="project-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-end">End date (optional)</Label>
              <Input
                id="project-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
            <Button type="submit">{editing ? "Save changes" : "Create project"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
