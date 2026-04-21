"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ProjectStatusBadge } from "@/components/ui/status";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, uid } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import type { Project, ProjectStatus } from "@/lib/types";

const statuses: ProjectStatus[] = ["onboarding", "in_progress", "review", "completed", "on_hold"];

export default function AdminProjects() {
  const { projects, users, upsertProject, log } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    clientId: "",
    assigneeIds: [] as string[],
    status: "onboarding" as ProjectStatus,
    progress: 0,
    startDate: "",
    dueDate: "",
    budget: "",
  });

  const clients = users.filter((u) => u.role === "client");
  const employees = users.filter((u) => u.role === "employee");

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      clientId: "",
      assigneeIds: [],
      status: "onboarding",
      progress: 0,
      startDate: new Date().toISOString().slice(0, 10),
      dueDate: "",
      budget: "",
    });
    setOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      clientId: p.clientId,
      assigneeIds: p.assigneeIds,
      status: p.status,
      progress: p.progress,
      startDate: p.startDate.slice(0, 10),
      dueDate: p.dueDate.slice(0, 10),
      budget: String(p.budget),
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.clientId) return;
    upsertProject({
      id: editing?.id,
      name: form.name,
      description: form.description,
      clientId: form.clientId,
      assigneeIds: form.assigneeIds,
      status: form.status,
      progress: Number(form.progress) || 0,
      startDate: new Date(form.startDate).toISOString(),
      dueDate: new Date(form.dueDate).toISOString(),
      budget: Number(form.budget) || 0,
      milestones: editing?.milestones ?? [
        { id: uid(), title: "Kickoff", dueDate: new Date(form.startDate).toISOString(), completed: false },
      ],
    });
    log("u_admin", editing ? "Updated project" : "Created project", form.name);
    setOpen(false);
  };

  const toggleAssignee = (id: string) => {
    setForm((f) => ({
      ...f,
      assigneeIds: f.assigneeIds.includes(id) ? f.assigneeIds.filter((x) => x !== id) : [...f.assigneeIds, id],
    }));
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description="Create projects, assign teams, and track progress."
        action={
          <Button onClick={openNew}>
            <Plus size={14} /> New project
          </Button>
        }
      />

      <div className="space-y-4">
        {projects.map((p) => {
          const client = users.find((u) => u.id === p.clientId);
          const assignees = users.filter((u) => p.assigneeIds.includes(u.id));
          return (
            <Card key={p.id}>
              <CardBody className="pt-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-semibold">{p.name}</span>
                      <ProjectStatusBadge status={p.status} />
                    </div>
                    <div className="text-[12px] text-ink-muted mt-1">
                      {client?.company} · {formatDate(p.startDate)} → {formatDate(p.dueDate)} · {formatCurrency(p.budget)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      {assignees.map((u) => (
                        <Avatar key={u.id} name={u.name} color={u.avatarColor} size={26} className="ring-2 ring-surface" />
                      ))}
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => openEdit(p)}>
                      <Pencil size={12} /> Edit
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={p.progress} className="flex-1" />
                  <span className="text-[12px] text-ink-muted tabular-nums">{p.progress}%</span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit project" : "New project"}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editing ? "Save" : "Create"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Client</Label>
              <Select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                <option value="">Select…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.company}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ")}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label>Assign team</Label>
            <div className="flex flex-wrap gap-1.5">
              {employees.map((u) => {
                const selected = form.assigneeIds.includes(u.id);
                return (
                  <button
                    key={u.id}
                    onClick={() => toggleAssignee(u.id)}
                    className={
                      "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[12px] transition " +
                      (selected ? "bg-accent text-white" : "bg-surface-muted text-ink hover:bg-line")
                    }
                  >
                    <Avatar name={u.name} color={u.avatarColor} size={18} /> {u.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Start date</Label>
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <Label>Due date</Label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div>
              <Label>Budget (USD)</Label>
              <Input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Progress ({form.progress}%)</Label>
            <input
              type="range"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
              className="w-full accent-accent"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
