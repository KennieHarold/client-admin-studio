"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectStatusBadge, TaskStatusBadge } from "@/components/ui/status";
import { useActiveUser, useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock, ListTodo } from "lucide-react";

export default function EmployeeOverview() {
  const user = useActiveUser();
  const { projects, tasks, time } = useStore();

  if (!user) return null;

  const myProjects = projects.filter((p) => p.assigneeIds.includes(user.id));
  const myTasks = tasks.filter((t) => t.assigneeId === user.id);
  const openTasks = myTasks.filter((t) => t.status !== "done");
  const active = time.find((t) => t.userId === user.id && !t.end);

  const weeklyHours = time
    .filter((t) => t.userId === user.id && t.end)
    .reduce((sum, t) => sum + (new Date(t.end!).getTime() - new Date(t.start).getTime()) / 3600000, 0);

  return (
    <>
      <PageHeader
        title={`Hey, ${user.name.split(" ")[0]}.`}
        description="Here's your day at a glance."
      />

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Stat icon={<CheckCircle2 size={18} />} label="Active projects" value={String(myProjects.length)} />
        <Stat icon={<ListTodo size={18} />} label="Open tasks" value={String(openTasks.length)} />
        <Stat icon={<Clock size={18} />} label="Hours this week" value={`${weeklyHours.toFixed(1)}h`} />
        <Stat
          icon={<Clock size={18} />}
          label="Currently tracking"
          value={active ? "On the clock" : "Off"}
          hint={active ? projects.find((p) => p.id === active.projectId)?.name : undefined}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your projects</CardTitle>
              <Link href="/employee/projects" className="text-[13px] text-accent hover:underline flex items-center gap-1">
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {myProjects.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-line/60">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-[14px]">{p.name}</div>
                    <div className="text-[12px] text-ink-muted mt-0.5">Due {formatDate(p.dueDate)}</div>
                  </div>
                  <ProjectStatusBadge status={p.status} />
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={p.progress} className="flex-1" />
                  <span className="text-[12px] text-ink-muted tabular-nums">{p.progress}%</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's tasks</CardTitle>
              <Link href="/employee/tasks" className="text-[13px] text-accent hover:underline flex items-center gap-1">
                View <ArrowUpRight size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {openTasks.slice(0, 5).map((t) => {
              const proj = projects.find((p) => p.id === t.projectId);
              return (
                <div key={t.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{t.title}</div>
                    <div className="text-[11px] text-ink-muted truncate">{proj?.name}</div>
                  </div>
                  <TaskStatusBadge status={t.status} />
                </div>
              );
            })}
            {openTasks.length === 0 && (
              <p className="text-[13px] text-ink-muted text-center py-4">All caught up. ✨</p>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function Stat({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardBody className="pt-5">
        <div className="flex items-center gap-2 text-ink-muted mb-3">
          {icon}
          <span className="text-[12px] font-medium">{label}</span>
        </div>
        <div className="text-[24px] font-semibold tracking-tight">{value}</div>
        {hint && <div className="text-[11px] text-ink-muted mt-1 truncate">{hint}</div>}
      </CardBody>
    </Card>
  );
}
