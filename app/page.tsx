"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const users = useStore((s) => s.users);
  const signInAs = useStore((s) => s.signInAs);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const grouped = {
    admin: users.filter((u) => u.role === "admin"),
    employee: users.filter((u) => u.role === "employee"),
    client: users.filter((u) => u.role === "client"),
  };

  const handleSelect = (userId: string, role: string) => {
    signInAs(userId);
    router.push(`/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col items-center text-center mb-10 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-ink flex items-center justify-center text-white mb-5 shadow-float">
            <Sparkles size={24} />
          </div>
          <h1 className="text-[40px] font-semibold tracking-tight text-ink leading-tight">
            Welcome to Studio
          </h1>
          <p className="text-[17px] text-ink-muted mt-3 max-w-md">
            One workspace for clients, employees, and admins. Choose a profile to continue.
          </p>
        </div>

        <div className="space-y-6 animate-fade-in">
          {(["admin", "employee", "client"] as const).map((role) => (
            <section key={role}>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-[13px] font-semibold uppercase tracking-wider text-ink-muted">
                  {role}
                </h2>
                <span className="text-[12px] text-ink-soft">{grouped[role].length} profile{grouped[role].length !== 1 ? "s" : ""}</span>
              </div>
              <Card className="divide-y divide-line/60">
                {grouped[role].map((u) => (
                  <button
                    key={u.id}
                    onMouseEnter={() => setHoveredId(u.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => handleSelect(u.id, u.role)}
                    className={cn(
                      "w-full flex items-center gap-4 px-5 py-4 text-left transition-all",
                      "hover:bg-surface-muted first:rounded-t-2xl last:rounded-b-2xl"
                    )}
                  >
                    <Avatar name={u.name} color={u.avatarColor} size={40} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-medium text-ink truncate">{u.name}</div>
                      <div className="text-[13px] text-ink-muted truncate">
                        {u.title || u.company || u.email}
                      </div>
                    </div>
                    <ArrowRight
                      size={18}
                      className={cn(
                        "text-ink-soft transition-all",
                        hoveredId === u.id && "text-accent translate-x-1"
                      )}
                    />
                  </button>
                ))}
              </Card>
            </section>
          ))}
        </div>

        <p className="text-center text-[12px] text-ink-soft mt-10">
          Demo workspace · Data is stored locally in your browser.
        </p>
      </div>
    </div>
  );
}
