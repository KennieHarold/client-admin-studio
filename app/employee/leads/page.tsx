"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Empty } from "@/components/ui/empty";
import { useActiveUser, useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Target, Trash2 } from "lucide-react";
import { useState } from "react";
import type { LeadStatus } from "@/lib/types";

const statuses: LeadStatus[] = ["new", "contacted", "qualified", "proposal", "won", "lost"];

export default function EmployeeLeads() {
  const user = useActiveUser();
  const { leads, addLead, updateLeadStatus, deleteLead, log } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", value: "", notes: "" });

  if (!user) return null;
  const mine = leads.filter((l) => l.ownerId === user.id);

  const pipeline = {
    count: mine.length,
    value: mine.filter((l) => l.status !== "lost").reduce((s, l) => s + l.value, 0),
    won: mine.filter((l) => l.status === "won").reduce((s, l) => s + l.value, 0),
  };

  const handleCreate = () => {
    if (!form.name || !form.company || !form.email) return;
    addLead({
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone || undefined,
      value: Number(form.value) || 0,
      status: "new",
      ownerId: user.id,
      notes: form.notes || undefined,
    });
    log(user.id, "Added lead", form.company);
    setForm({ name: "", company: "", email: "", phone: "", value: "", notes: "" });
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Leads"
        description="Track prospects and win new business."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={14} /> Add lead
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="Leads in pipeline" value={String(pipeline.count)} />
        <Stat label="Pipeline value" value={formatCurrency(pipeline.value)} />
        <Stat label="Closed won" value={formatCurrency(pipeline.won)} />
      </div>

      {mine.length === 0 ? (
        <Card>
          <Empty
            icon={<Target size={32} />}
            title="No leads yet"
            description="Add your first lead to start tracking your pipeline."
            action={
              <Button onClick={() => setOpen(true)}>
                <Plus size={14} /> Add lead
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="divide-y divide-line/60">
          {mine.map((l) => (
            <div key={l.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium">{l.name}</span>
                  <span className="text-[12px] text-ink-muted">· {l.company}</span>
                </div>
                <div className="text-[12px] text-ink-muted mt-0.5">
                  {l.email} · added {formatDate(l.createdAt)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[14px] font-semibold tabular-nums">{formatCurrency(l.value)}</div>
              </div>
              <Select
                value={l.status}
                onChange={(e) => {
                  updateLeadStatus(l.id, e.target.value as LeadStatus);
                  log(user.id, `Moved lead → ${e.target.value}`, l.company);
                }}
                className="w-36"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </Select>
              <button
                onClick={() => {
                  deleteLead(l.id);
                  log(user.id, "Deleted lead", l.company);
                }}
                className="text-ink-soft hover:text-red-500 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </Card>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New lead"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Add lead</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label>Phone (optional)</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Deal value (USD)</Label>
            <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
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
        <div className="text-[22px] font-semibold tracking-tight">{value}</div>
      </CardBody>
    </Card>
  );
}
