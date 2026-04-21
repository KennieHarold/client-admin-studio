"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectStatusBadge } from "@/components/ui/status";
import { Avatar } from "@/components/ui/avatar";
import { useActiveUser, useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Check } from "lucide-react";

export default function ClientProjects() {
  const user = useActiveUser();
  const { projects, users } = useStore();
  if (!user) return null;

  const myProjects = projects.filter((p) => p.clientId === user.id);

  return (
    <>
      <PageHeader title="Projects" description="Track every engagement with your team." />

      <div className="space-y-6">
        {myProjects.map((p) => {
          const assignees = users.filter((u) => p.assigneeIds.includes(u.id));
          return (
            <Card key={p.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-[17px]">{p.name}</CardTitle>
                      <ProjectStatusBadge status={p.status} />
                    </div>
                    <p className="text-[13px] text-ink-muted mt-1">{p.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[12px] text-ink-muted">Budget</div>
                    <div className="text-[15px] font-semibold">{formatCurrency(p.budget)}</div>
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
                    <div className="text-ink-muted mb-0.5">Team</div>
                    <div className="flex -space-x-1.5 mt-0.5">
                      {assignees.map((u) => (
                        <Avatar
                          key={u.id}
                          name={u.name}
                          color={u.avatarColor}
                          size={24}
                          className="ring-2 ring-surface"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-medium">Overall progress</span>
                    <span className="text-[13px] text-ink-muted tabular-nums">{p.progress}%</span>
                  </div>
                  <Progress value={p.progress} />
                </div>

                <div>
                  <div className="text-[13px] font-medium mb-3">Milestones</div>
                  <div className="space-y-2">
                    {p.milestones.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-sunken"
                      >
                        <div
                          className={
                            m.completed
                              ? "w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white"
                              : "w-5 h-5 rounded-full border-2 border-line"
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
                      </div>
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
