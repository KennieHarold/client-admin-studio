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

const colors = ["#8e4ec6", "#f7b500", "#30b27b", "#ff6b35", "#0071e3", "#e0245e"];

export default function AdminClients() {
  const { users, projects, invoices, upsertUser, deleteUser, impersonate, log } = useStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "" });

  const clients = users.filter((u) => u.role === "client");

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", email: "", company: "" });
    setOpen(true);
  };
  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, company: u.company ?? "" });
    setOpen(true);
  };
  const handleSave = () => {
    if (!form.name || !form.email) return;
    upsertUser({
      id: editing?.id,
      name: form.name,
      email: form.email,
      company: form.company || undefined,
      role: "client",
      avatarColor: editing?.avatarColor ?? colors[Math.floor(Math.random() * colors.length)],
    });
    log("u_admin", editing ? "Updated client" : "Created client", form.name);
    setOpen(false);
  };

  const handleImpersonate = (u: User) => {
    impersonate(u.id);
    log("u_admin", "Impersonated", u.name);
    router.push("/client");
  };

  return (
    <>
      <PageHeader
        title="Clients"
        description="Manage your client roster."
        action={
          <Button onClick={openNew}>
            <Plus size={14} /> Add client
          </Button>
        }
      />

      <Card className="divide-y divide-line/60">
        {clients.map((u) => {
          const projectCount = projects.filter((p) => p.clientId === u.id).length;
          const revenue = invoices
            .filter((i) => i.clientId === u.id && i.status === "paid")
            .reduce((s, i) => s + i.amount, 0);
          return (
            <div key={u.id} className="flex items-center gap-4 px-5 py-4">
              <Avatar name={u.name} color={u.avatarColor} size={40} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium">{u.name}</div>
                <div className="text-[12px] text-ink-muted">{u.email} · {u.company ?? "—"}</div>
              </div>
              <div className="text-right text-[12px] w-24">
                <div className="text-ink-muted">Projects</div>
                <div className="font-medium text-[13px] text-ink">{projectCount}</div>
              </div>
              <div className="text-right text-[12px] w-28">
                <div className="text-ink-muted">Revenue</div>
                <div className="font-medium text-[13px] text-ink">${revenue.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleImpersonate(u)} title="Open as this client">
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
                      log("u_admin", "Deleted client", u.name);
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
        title={editing ? "Edit client" : "Add client"}
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
            <Label>Company</Label>
            <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
        </div>
      </Modal>
    </>
  );
}
