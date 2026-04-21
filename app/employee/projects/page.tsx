"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectStatusBadge } from "@/components/ui/status";
import { Avatar } from "@/components/ui/avatar";
import { useActiveUser, useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Check } from "lucide-react";

export default function EmployeeProjects() {
  const user = useActiveUser();
  const { projects, users, toggleMilestone, log } = useStore();
  if (!user) return null;

  const mine = projects.filter((p) => p.assigneeIds.includes(user.id));

  return (
    <>
      <PageHeader title="Your projects" description="Assigned projects, milestones, and deadlines." />

      <div className="space-y-6">
        {mine.map((p) => {
          const client = users.find((u) => u.id === p.clientId);
          return (
            <Card key={p.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-[17px]">{p.name}</CardTitle>
                      <ProjectStatusBadge status={p.status} />
                    </div>
                    <p className="text-[13px] text-ink-muted mt-1">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar name={client?.name ?? "?"} color={client?.avatarColor ?? "#999"} size={28} />
                    <div className="text-right">
                      <div className="text-[12px] font-medium">{client?.name}</div>
                      <div className="text-[11px] text-ink-muted">{client?.company}</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-3 gap-6 mb-6 text-[12px]">
                  <div>
                    <div className="text-ink-muted mb-0.5">Started</div>
                    <div className="font-medium">{formatDate(p.startDate)}</div>
                  </div>
                  <div>
                    <div className="text-ink-muted mb-0.5">Due</div>
                    <div className="font-medium">{formatDate(p.dueDate)}</div>
                  </div>
                  <div>
                    <div className="text-ink-muted mb-0.5">Progress</div>
                    <div className="font-medium">{p.progress}%</div>
                  </div>
                </div>
                <Progress value={p.progress} className="mb-6" />

                <div>
                  <div className="text-[13px] font-medium mb-3">Milestones</div>
                  <div className="space-y-2">
                    {p.milestones.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          toggleMilestone(p.id, m.id);
                          log(user.id, m.completed ? "Reopened milestone" : "Completed milestone", m.title);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-sunken hover:bg-surface-muted transition text-left"
                      >
                        <div
                          className={
                            m.completed
                              ? "w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0"
                              : "w-5 h-5 rounded-full border-2 border-line shrink-0"
                          }
                        >
                          {m.completed && <Check size={12} strokeWidth={3} />}
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <span className={"text-[13px] " + (m.completed ? "text-ink-muted line-through" : "text-ink")}>
                            {m.title}
                          </span>
                          <span className="text-[12px] text-ink-soft">{formatDate(m.dueDate)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
}
