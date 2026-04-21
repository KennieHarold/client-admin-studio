"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Plus, Trash2, UserCircle2, Pencil } from "lucide-react";
import { useState } from "react";
import type { User } from "@/lib/types";

const colors = ["#0071e3", "#30b27b", "#ff6b35", "#8e4ec6", "#f7b500", "#e0245e"];

export default function AdminEmployees() {
  const { users, projects, tasks, commissions, upsertUser, deleteUser, impersonate, log } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", title: "" });

  const employees = users.filter((u) => u.role === "employee");

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", email: "", title: "" });
    setOpen(true);
  };
  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, title: u.title ?? "" });
    setOpen(true);
  };
  const handleSave = () => {
    if (!form.name || !form.email) return;
    upsertUser({
      id: editing?.id,
      name: form.name,
      email: form.email,
      title: form.title || undefined,
      role: "employee",
      avatarColor: editing?.avatarColor ?? colors[Math.floor(Math.random() * colors.length)],
    });
    log("u_admin", editing ? "Updated employee" : "Created employee", form.name);
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Employees"
        description="Your team and their assignments."
        action={
          <Button onClick={openNew}>
            <Plus size={14} /> Add employee
          </Button>
        }
      />

      <Card className="divide-y divide-line/60">
        {employees.map((u) => {
          const proj = projects.filter((p) => p.assigneeIds.includes(u.id)).length;
          const openTasks = tasks.filter((t) => t.assigneeId === u.id && t.status !== "done").length;
          const earned = commissions.filter((c) => c.employeeId === u.id).reduce((s, c) => s + c.payout, 0);
          return (
            <div key={u.id} className="flex items-center gap-4 px-5 py-4">
              <Avatar name={u.name} color={u.avatarColor} size={40} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium">{u.name}</div>
                <div className="text-[12px] text-ink-muted">{u.email} · {u.title ?? "—"}</div>
              </div>
              <div className="text-right text-[12px] w-20">
                <div className="text-ink-muted">Projects</div>
                <div className="font-medium text-[13px] text-ink">{proj}</div>
              </div>
              <div className="text-right text-[12px] w-20">
                <div className="text-ink-muted">Tasks</div>
                <div className="font-medium text-[13px] text-ink">{openTasks}</div>
              </div>
              <div className="text-right text-[12px] w-24">
                <div className="text-ink-muted">Commission</div>
                <div className="font-medium text-[13px] text-ink">${earned.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    impersonate(u.id);
                    log("u_admin", "Impersonated", u.name);
                    router.push("/employee");
                  }}
                  title="Open as this employee"
                >
                  <UserCircle2 size={14} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Remove ${u.name}?`)) {
                      deleteUser(u.id);
                      log("u_admin", "Deleted employee", u.name);
                    }
                  }}
                >
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              </div>
            </div>
          );
        })}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit employee" : "Add employee"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editing ? "Save" : "Add"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label>Title / role</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Designer" />
          </div>
        </div>
      </Modal>
    </>
  );
}
