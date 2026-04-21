"use client";

import { DashboardShell, type NavItem } from "@/components/dashboard-shell";
import {
  LayoutDashboard,
  Users,
  UserCog,
  FolderKanban,
  Receipt,
  BarChart3,
  Activity,
} from "lucide-react";

const nav: NavItem[] = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { href: "/admin/clients", label: "Clients", icon: <Users size={16} /> },
  { href: "/admin/employees", label: "Employees", icon: <UserCog size={16} /> },
  { href: "/admin/projects", label: "Projects", icon: <FolderKanban size={16} /> },
  { href: "/admin/invoices", label: "Invoices", icon: <Receipt size={16} /> },
  { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 size={16} /> },
  { href: "/admin/logs", label: "Activity", icon: <Activity size={16} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="admin" nav={nav}>
      {children}
    </DashboardShell>
  );
}
