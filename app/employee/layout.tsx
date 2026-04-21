"use client";

import { DashboardShell, type NavItem } from "@/components/dashboard-shell";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Timer,
  Folder,
  MessageSquare,
  Target,
  BadgeDollarSign,
} from "lucide-react";

const nav: NavItem[] = [
  { href: "/employee", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { href: "/employee/projects", label: "Projects", icon: <FolderKanban size={16} /> },
  { href: "/employee/tasks", label: "Tasks", icon: <ListTodo size={16} /> },
  { href: "/employee/time", label: "Time tracking", icon: <Timer size={16} /> },
  { href: "/employee/files", label: "Files", icon: <Folder size={16} /> },
  { href: "/employee/messages", label: "Messages", icon: <MessageSquare size={16} /> },
  { href: "/employee/leads", label: "Leads", icon: <Target size={16} /> },
  { href: "/employee/commission", label: "Commission", icon: <BadgeDollarSign size={16} /> },
];

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="employee" nav={nav}>
      {children}
    </DashboardShell>
  );
}
