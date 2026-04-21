"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select } from "@/components/ui/input";
import { InvoiceStatusBadge } from "@/components/ui/status";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { InvoiceStatus } from "@/lib/types";

const statuses: InvoiceStatus[] = ["draft", "sent", "paid", "overdue"];

export default function AdminInvoices() {
  const { invoices, users, projects, addInvoice, updateInvoiceStatus, log } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    clientId: "",
    projectId: "",
    description: "",
    amount: "",
    dueAt: "",
  });

  const clients = users.filter((u) => u.role === "client");

  const handleCreate = () => {
    if (!form.clientId || !form.amount || !form.description) return;
    addInvoice({
      clientId: form.clientId,
      projectId: form.projectId || undefined,
      amount: Number(form.amount),
      status: "sent",
      dueAt: new Date(form.dueAt).toISOString(),
      lineItems: [{ description: form.description, amount: Number(form.amount) }],
    });
    log("u_admin", "Sent invoice", `${form.description}`);
    setForm({ clientId: "", projectId: "", description: "", amount: "", dueAt: "" });
    setOpen(false);
  };

  const totals = {
    revenue: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
    outstanding: invoices.filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0),
  };

  return (
    <>
      <PageHeader
        title="Invoices"
        description="Issue invoices and track payments."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={14} /> New invoice
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="Revenue" value={formatCurrency(totals.revenue)} />
        <Stat label="Outstanding" value={formatCurrency(totals.outstanding)} />
        <Stat label="Overdue" value={formatCurrency(totals.overdue)} />
      </div>

      <Card className="divide-y divide-line/60">
        {invoices.map((inv) => {
          const client = users.find((u) => u.id === inv.clientId);
          const project = projects.find((p) => p.id === inv.projectId);
          return (
            <div key={inv.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium">{inv.number}</span>
                  <InvoiceStatusBadge status={inv.status} />
                </div>
                <div className="text-[12px] text-ink-muted mt-0.5">
                  {client?.company} · {project?.name ?? "—"} · Due {formatDate(inv.dueAt)}
                </div>
              </div>
              <div className="text-[15px] font-semibold tabular-nums">{formatCurrency(inv.amount)}</div>
              <Select
                value={inv.status}
                onChange={(e) => {
                  updateInvoiceStatus(inv.id, e.target.value as InvoiceStatus);
                  log("u_admin", "Changed invoice status", inv.number);
                }}
                className="w-32"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
          );
        })}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New invoice"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Send</Button>
          </>
        }
      >
        <div className="space-y-4">
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
              <Label>Project (optional)</Label>
              <Select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
                <option value="">—</option>
                {projects
                  .filter((p) => !form.clientId || p.clientId === form.clientId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </Select>
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Amount (USD)</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div>
              <Label>Due date</Label>
              <Input type="date" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardBody className="pt-5">
        <div className="text-[12px] text-ink-muted mb-2">{label}</div>
        <div className="text-[22px] font-semibold tabular-nums">{value}</div>
      </CardBody>
    </Card>
  );
}
