"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useActiveUser, useStore } from "@/lib/store";
import { formatDate, cn } from "@/lib/utils";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import type { TaskStatus } from "@/lib/types";

const columns: { key: TaskStatus; title: string; tone: string }[] = [
  { key: "todo", title: "To do", tone: "bg-surface-muted" },
  { key: "doing", title: "In progress", tone: "bg-blue-50" },
  { key: "done", title: "Done", tone: "bg-emerald-50" },
];

export default function EmployeeTasks() {
  const user = useActiveUser();
  const { tasks, projects, addTask, updateTaskStatus, deleteTask, log } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", projectId: "", dueDate: "" });

  if (!user) return null;
  const myTasks = tasks.filter((t) => t.assigneeId === user.id);
  const myProjects = projects.filter((p) => p.assigneeIds.includes(user.id));

  const handleCreate = () => {
    if (!form.title || !form.projectId) return;
    addTask({
      title: form.title,
      description: form.description,
      projectId: form.projectId,
      assigneeId: user.id,
      status: "todo",
      dueDate: form.dueDate || undefined,
    });
    log(user.id, "Created task", form.title);
    setForm({ title: "", description: "", projectId: "", dueDate: "" });
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Organize your work with a simple board."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={14} /> New task
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        {columns.map((col) => {
          const items = myTasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="text-[13px] font-semibold">{col.title}</div>
                <span className="text-[11px] text-ink-muted tabular-nums">{items.length}</span>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {items.map((t) => {
                  const proj = projects.find((p) => p.id === t.projectId);
                  return (
                    <Card key={t.id}>
                      <CardBody className="pt-4 pb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <GripVertical size={14} className="text-ink-soft mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium">{t.title}</div>
                            {t.description && (
                              <div className="text-[12px] text-ink-muted mt-1 line-clamp-2">{t.description}</div>
                            )}
                            <div className="text-[11px] text-ink-muted mt-2 truncate">{proj?.name}</div>
                          </div>
                          <button
                            onClick={() => {
                              deleteTask(t.id);
                              log(user.id, "Deleted task", t.title);
                            }}
                            className="text-ink-soft hover:text-red-500 shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {columns
                            .filter((c) => c.key !== t.status)
                            .map((c) => (
                              <button
                                key={c.key}
                                onClick={() => {
                                  updateTaskStatus(t.id, c.key);
                                  log(user.id, `Moved task → ${c.title}`, t.title);
                                }}
                                className={cn(
                                  "text-[11px] px-2 py-1 rounded-md transition",
                                  c.tone,
                                  "hover:opacity-80"
                                )}
                              >
                                → {c.title}
                              </button>
                            ))}
                          {t.dueDate && (
                            <span className="ml-auto text-[11px] text-ink-muted">{formatDate(t.dueDate)}</span>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
                {items.length === 0 && (
                  <div className="text-center text-[12px] text-ink-soft py-8 border border-dashed border-line rounded-xl">
                    Nothing here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Project</Label>
              <Select
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              >
                <option value="">Select…</option>
                {myProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Due date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
