"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore, useActiveUser, useRealUser } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useEffect, type ReactNode } from "react";
import { LogOut, Sparkles, ChevronsUpDown } from "lucide-react";
import type { Role } from "@/lib/types";

export interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

export function DashboardShell({
  role,
  nav,
  children,
}: {
  role: Role;
  nav: NavItem[];
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const activeUser = useActiveUser();
  const realUser = useRealUser();
  const { signOut, impersonate } = useStore();

  useEffect(() => {
    if (!activeUser) {
      router.replace("/");
      return;
    }
    if (activeUser.role !== role) {
      router.replace(`/${activeUser.role}`);
    }
  }, [activeUser, role, router]);

  if (!activeUser) return null;

  const impersonating = realUser && realUser.id !== activeUser.id;

  return (
    <div className="min-h-screen flex bg-surface-sunken">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-line/70 bg-surface/50 glass sticky top-0 h-screen flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-ink flex items-center justify-center text-white">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight">Studio</div>
            <div className="text-[11px] text-ink-muted capitalize">{role} workspace</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all",
                  active
                    ? "bg-surface text-ink shadow-sm border border-line/60"
                    : "text-ink-muted hover:bg-surface hover:text-ink"
                )}
              >
                <span className={cn(active ? "text-accent" : "text-ink-soft")}>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-line/60 bg-surface">
            <Avatar name={activeUser.name} color={activeUser.avatarColor} size={32} />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">{activeUser.name}</div>
              <div className="text-[11px] text-ink-muted truncate">{activeUser.email}</div>
            </div>
            <button
              onClick={() => {
                if (impersonating) {
                  impersonate(null);
                } else {
                  signOut();
                  router.push("/");
                }
              }}
              className="text-ink-soft hover:text-ink transition"
              title={impersonating ? "Stop impersonating" : "Sign out"}
            >
              {impersonating ? <ChevronsUpDown size={16} /> : <LogOut size={16} />}
            </button>
          </div>
          {impersonating && realUser && (
            <div className="text-[11px] text-amber-600 mt-2 text-center">
              Impersonating — signed in as {realUser.name}
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-8 py-10 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-8 gap-4">
      <div>
        <h1 className="text-[32px] font-semibold tracking-tight text-ink leading-tight">{title}</h1>
        {description && (
          <p className="text-[15px] text-ink-muted mt-1.5">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
