"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectStatusBadge } from "@/components/ui/status";
import { Avatar } from "@/components/ui/avatar";
import { useActiveUser, useStore } from "@/lib/store";
import { formatCurrency, formatRelative } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight, Users, FolderKanban, DollarSign, Target } from "lucide-react";

export default function AdminOverview() {
  const user = useActiveUser();
  const { users, projects, invoices, leads, logs, commissions } = useStore();

  if (!user) return null;

  const revenue = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((s, i) => s + i.amount, 0);
  const activeProjects = projects.filter((p) => p.status !== "completed").length;
  const pipelineValue = leads
    .filter((l) => l.status !== "lost" && l.status !== "won")
    .reduce((s, l) => s + l.value, 0);

  return (
    <>
      <PageHeader title="Dashboard" description="The whole business, at a glance." />

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Stat icon={<DollarSign size={18} />} label="Revenue (paid)" value={formatCurrency(revenue)} />
        <Stat icon={<DollarSign size={18} />} label="Outstanding" value={formatCurrency(outstanding)} />
        <Stat icon={<FolderKanban size={18} />} label="Active projects" value={String(activeProjects)} />
        <Stat icon={<Target size={18} />} label="Pipeline" value={formatCurrency(pipelineValue)} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Projects</CardTitle>
              <Link href="/admin/projects" className="text-[13px] text-accent hover:underline flex items-center gap-1">
                Manage <ArrowUpRight size={14} />
              </Link>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {projects.map((p) => {
              const client = users.find((u) => u.id === p.clientId);
              return (
                <div key={p.id} className="p-4 rounded-xl border border-line/60">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-[14px]">{p.name}</div>
                      <div className="text-[12px] text-ink-muted mt-0.5">{client?.company}</div>
                    </div>
                    <ProjectStatusBadge status={p.status} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Progress value={p.progress} className="flex-1" />
                    <span className="text-[12px] text-ink-muted tabular-nums">{p.progress}%</span>
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {logs.slice(0, 6).map((log) => {
                const u = users.find((x) => x.id === log.userId);
                return (
                  <div key={log.id} className="flex items-start gap-2.5">
                    <Avatar name={u?.name ?? "?"} color={u?.avatarColor ?? "#999"} size={24} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px]">
                        <span className="font-medium">{u?.name}</span>{" "}
                        <span className="text-ink-muted">{log.action.toLowerCase()}</span>
                        {log.target && <span className="font-medium"> {log.target}</span>}
                      </div>
                      <div className="text-[11px] text-ink-soft">{formatRelative(log.at)}</div>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardBody className="space-y-2">
              <TeamStat label="Clients" value={users.filter((u) => u.role === "client").length} icon={<Users size={12} />} />
              <TeamStat label="Employees" value={users.filter((u) => u.role === "employee").length} icon={<Users size={12} />} />
              <TeamStat label="Commission owed" value={commissions.filter((c) => c.status === "pending").reduce((s, c) => s + c.payout, 0)} isCurrency icon={<DollarSign size={12} />} />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-center gap-2 text-ink-muted mb-3">
          {icon}
          <span className="text-[12px] font-medium">{label}</span>
        </div>
        <div className="text-[24px] font-semibold tracking-tight">{value}</div>
      </CardBody>
    </Card>
  );
}

function TeamStat({ label, value, icon, isCurrency }: { label: string; value: number; icon: React.ReactNode; isCurrency?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="flex items-center gap-2 text-ink-muted">
        {icon} {label}
      </span>
      <span className="font-semibold tabular-nums">{isCurrency ? formatCurrency(value) : value}</span>
    </div>
  );
}
