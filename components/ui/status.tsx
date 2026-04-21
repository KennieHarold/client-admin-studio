import { Badge } from "./badge";
import type { ProjectStatus, TaskStatus, InvoiceStatus, LeadStatus } from "@/lib/types";

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const map: Record<ProjectStatus, { label: string; tone: React.ComponentProps<typeof Badge>["tone"] }> = {
    onboarding: { label: "Onboarding", tone: "violet" },
    in_progress: { label: "In progress", tone: "blue" },
    review: { label: "In review", tone: "amber" },
    completed: { label: "Completed", tone: "green" },
    on_hold: { label: "On hold", tone: "neutral" },
  };
  const { label, tone } = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { label: string; tone: React.ComponentProps<typeof Badge>["tone"] }> = {
    todo: { label: "To do", tone: "neutral" },
    doing: { label: "In progress", tone: "blue" },
    done: { label: "Done", tone: "green" },
  };
  const { label, tone } = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, { label: string; tone: React.ComponentProps<typeof Badge>["tone"] }> = {
    draft: { label: "Draft", tone: "neutral" },
    sent: { label: "Sent", tone: "blue" },
    paid: { label: "Paid", tone: "green" },
    overdue: { label: "Overdue", tone: "red" },
  };
  const { label, tone } = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, { label: string; tone: React.ComponentProps<typeof Badge>["tone"] }> = {
    new: { label: "New", tone: "neutral" },
    contacted: { label: "Contacted", tone: "blue" },
    qualified: { label: "Qualified", tone: "violet" },
    proposal: { label: "Proposal", tone: "amber" },
    won: { label: "Won", tone: "green" },
    lost: { label: "Lost", tone: "red" },
  };
  const { label, tone } = map[status];
  return <Badge tone={tone}>{label}</Badge>;
}
