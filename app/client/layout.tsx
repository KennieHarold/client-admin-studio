"use client";

import { DashboardShell, type NavItem } from "@/components/dashboard-shell";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Receipt,
  Folder,
  MessageSquare,
  CalendarDays,
} from "lucide-react";

const nav: NavItem[] = [
  { href: "/client", label: "Overview", icon: <LayoutDashboard size={16} /> },
  { href: "/client/projects", label: "Projects", icon: <FolderKanban size={16} /> },
  { href: "/client/contracts", label: "Contracts", icon: <FileText size={16} /> },
  { href: "/client/invoices", label: "Invoices", icon: <Receipt size={16} /> },
  { href: "/client/files", label: "Files", icon: <Folder size={16} /> },
  { href: "/client/messages", label: "Messages", icon: <MessageSquare size={16} /> },
  { href: "/client/scheduling", label: "Scheduling", icon: <CalendarDays size={16} /> },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="client" nav={nav}>
      {children}
    </DashboardShell>
  );
}
