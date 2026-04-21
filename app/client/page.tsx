"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectStatusBadge, InvoiceStatusBadge } from "@/components/ui/status";
import { useActiveUser, useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight, Clock, Receipt, CheckCircle2 } from "lucide-react";

export default function ClientOverview() {
  const user = useActiveUser();
  const { projects, invoices } = useStore();

  if (!user) return null;

  const myProjects = projects.filter((p) => p.clientId === user.id);
  const myInvoices = invoices.filter((i) => i.clientId === user.id);
  const outstanding = myInvoices.filter((i) => i.status === "sent" || i.status === "overdue");
  const outstandingAmount = outstanding.reduce((sum, i) => sum + i.amount, 0);
  const active = myProjects.filter((p) => p.status !== "completed").length;

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}.`}
        description="Here's what's happening across your projects."
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<CheckCircle2 size={18} />}
          label="Active projects"
          value={String(active)}
        />
        <StatCard
          icon={<Receipt size={18} />}
          label="Outstanding"
          value={formatCurrency(outstandingAmount)}
          hint={`${outstanding.length} unpaid`}
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Upcoming milestones"
          value={String(
            myProjects.reduce((n, p) => n + p.milestones.filter((m) => !m.completed).length, 0)
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your projects</CardTitle>
              <Link href="/client/projects" className="text-[13px] text-accent hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {myProjects.length === 0 && <p className="text-sm text-ink-muted">No projects yet.</p>}
            {myProjects.map((p) => (
              <Link
                key={p.id}
                href={`/client/projects`}
                className="block p-4 rounded-xl border border-line/60 hover:bg-surface-muted transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-[14px]">{p.name}</div>
                    <div className="text-[12px] text-ink-muted mt-0.5">
                      Due {formatDate(p.dueDate)}
                    </div>
                  </div>
                  <ProjectStatusBadge status={p.status} />
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={p.progress} className="flex-1" />
                  <span className="text-[12px] text-ink-muted tabular-nums">{p.progress}%</span>
                </div>
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent invoices</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {myInvoices.slice(0, 4).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-medium">{inv.number}</div>
                  <div className="text-[11px] text-ink-muted">
                    {formatCurrency(inv.amount)}
                  </div>
                </div>
                <InvoiceStatusBadge status={inv.status} />
              </div>
            ))}
            <Link href="/client/invoices" className="text-[12px] text-accent hover:underline inline-flex items-center gap-1 mt-2">
              View all <ArrowUpRight size={12} />
            </Link>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function StatCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-center gap-2 text-ink-muted mb-3">
          {icon}
          <span className="text-[12px] font-medium">{label}</span>
        </div>
        <div className="text-[28px] font-semibold tracking-tight">{value}</div>
        {hint && <div className="text-[12px] text-ink-muted mt-1">{hint}</div>}
      </CardBody>
    </Card>
  );
}
