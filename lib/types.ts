export type Role = "client" | "employee" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string;
  company?: string;
  title?: string;
}

export type ProjectStatus = "onboarding" | "in_progress" | "review" | "completed" | "on_hold";

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  assigneeIds: string[];
  status: ProjectStatus;
  progress: number;
  startDate: string;
  dueDate: string;
  budget: number;
  milestones: Milestone[];
}

export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assigneeId: string;
  status: TaskStatus;
  dueDate?: string;
  createdAt: string;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  projectId?: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  lineItems: { description: string; amount: number }[];
}

export interface Contract {
  id: string;
  title: string;
  clientId: string;
  projectId?: string;
  signedAt?: string;
  status: "pending" | "signed";
  fileUrl: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  uploaderId: string;
  projectId?: string;
  uploadedAt: string;
  type: string;
}

export interface Message {
  id: string;
  channelId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Channel {
  id: string;
  name: string;
  memberIds: string[];
  type: "direct" | "project";
  projectId?: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  projectId: string;
  start: string;
  end?: string;
  note?: string;
}

export interface Booking {
  id: string;
  title: string;
  clientId: string;
  employeeId: string;
  start: string;
  end: string;
  notes?: string;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  value: number;
  status: LeadStatus;
  ownerId: string;
  createdAt: string;
  notes?: string;
}

export interface Commission {
  id: string;
  employeeId: string;
  leadId?: string;
  dealName: string;
  amount: number;
  rate: number;
  payout: number;
  closedAt: string;
  status: "pending" | "paid";
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  target?: string;
  at: string;
}
