"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Empty } from "@/components/ui/empty";
import { useStore } from "@/lib/store";
import { formatRelative, formatDate } from "@/lib/utils";
import { Search, Activity } from "lucide-react";
import { useState } from "react";

export default function AdminLogs() {
  const { logs, users } = useStore();
  const [q, setQ] = useState("");

  const filtered = logs.filter((log) => {
    const u = users.find((x) => x.id === log.userId);
    const hay = `${u?.name ?? ""} ${log.action} ${log.target ?? ""}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <>
      <PageHeader title="Activity" description="Every action taken across the workspace." />

      <div className="mb-4 relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none" />
        <Input
          placeholder="Search activity…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        {filtered.length === 0 ? (
          <Empty icon={<Activity size={32} />} title="No activity" description="Actions will appear here as your team works." />
        ) : (
          <div className="divide-y divide-line/60">
            {filtered.map((log) => {
              const u = users.find((x) => x.id === log.userId);
              return (
                <div key={log.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar name={u?.name ?? "?"} color={u?.avatarColor ?? "#999"} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px]">
                      <span className="font-medium">{u?.name}</span>{" "}
                      <span className="text-ink-muted">{log.action.toLowerCase()}</span>
                      {log.target && <span className="font-medium"> · {log.target}</span>}
                    </div>
                    <div className="text-[11px] text-ink-soft">
                      {formatRelative(log.at)} · {formatDate(log.at)}
                    </div>
                  </div>
                  <span className="text-[11px] capitalize text-ink-muted px-2 py-0.5 rounded-full bg-surface-muted">
                    {u?.role}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}
