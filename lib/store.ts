"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "./utils";
import type {
  User,
  Project,
  Task,
  Invoice,
  Contract,
  FileItem,
  Channel,
  Message,
  TimeEntry,
  Booking,
  Lead,
  Commission,
  ActivityLog,
  Role,
  TaskStatus,
  LeadStatus,
  InvoiceStatus,
} from "./types";
import {
  mockUsers,
  mockProjects,
  mockTasks,
  mockInvoices,
  mockContracts,
  mockFiles,
  mockChannels,
  mockMessages,
  mockTime,
  mockBookings,
  mockLeads,
  mockCommissions,
  mockLogs,
} from "./mock-data";

interface State {
  // auth
  currentUserId: string | null;
  impersonateId: string | null;

  // data
  users: User[];
  projects: Project[];
  tasks: Task[];
  invoices: Invoice[];
  contracts: Contract[];
  files: FileItem[];
  channels: Channel[];
  messages: Message[];
  time: TimeEntry[];
  bookings: Booking[];
  leads: Lead[];
  commissions: Commission[];
  logs: ActivityLog[];

  // auth actions
  signInAs: (userId: string) => void;
  signOut: () => void;
  impersonate: (userId: string | null) => void;

  // users
  upsertUser: (u: Omit<User, "id"> & { id?: string }) => void;
  deleteUser: (id: string) => void;

  // projects
  upsertProject: (p: Omit<Project, "id" | "milestones"> & { id?: string; milestones?: Project["milestones"] }) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  setProjectProgress: (projectId: string, progress: number) => void;

  // tasks
  addTask: (t: Omit<Task, "id" | "createdAt">) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;

  // invoices
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  addInvoice: (i: Omit<Invoice, "id" | "number" | "issuedAt">) => void;

  // files
  addFile: (f: Omit<FileItem, "id" | "uploadedAt">) => void;
  deleteFile: (id: string) => void;

  // messages
  sendMessage: (channelId: string, authorId: string, content: string) => void;

  // time
  clockIn: (userId: string, projectId: string, note?: string) => void;
  clockOut: (userId: string) => void;
  addTimeEntry: (e: Omit<TimeEntry, "id">) => void;

  // bookings
  addBooking: (b: Omit<Booking, "id">) => void;
  deleteBooking: (id: string) => void;

  // leads
  addLead: (l: Omit<Lead, "id" | "createdAt">) => void;
  updateLeadStatus: (id: string, status: LeadStatus) => void;
  deleteLead: (id: string) => void;

  // logs
  log: (userId: string, action: string, target?: string) => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      impersonateId: null,

      users: mockUsers,
      projects: mockProjects,
      tasks: mockTasks,
      invoices: mockInvoices,
      contracts: mockContracts,
      files: mockFiles,
      channels: mockChannels,
      messages: mockMessages,
      time: mockTime,
      bookings: mockBookings,
      leads: mockLeads,
      commissions: mockCommissions,
      logs: mockLogs,

      signInAs: (userId) => {
        set({ currentUserId: userId, impersonateId: null });
        const u = get().users.find((x) => x.id === userId);
        if (u) get().log(userId, "Signed in");
      },
      signOut: () => set({ currentUserId: null, impersonateId: null }),
      impersonate: (userId) => set({ impersonateId: userId }),

      upsertUser: (u) => {
        const id = u.id ?? `u_${uid()}`;
        set((s) => {
          const exists = s.users.find((x) => x.id === id);
          const user = { ...u, id } as User;
          return {
            users: exists ? s.users.map((x) => (x.id === id ? user : x)) : [...s.users, user],
          };
        });
      },
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      upsertProject: (p) => {
        const id = p.id ?? `p_${uid()}`;
        set((s) => {
          const existing = s.projects.find((x) => x.id === id);
          const project: Project = {
            ...p,
            id,
            milestones: p.milestones ?? existing?.milestones ?? [],
          } as Project;
          return {
            projects: existing ? s.projects.map((x) => (x.id === id ? project : x)) : [...s.projects, project],
          };
        });
      },
      toggleMilestone: (projectId, milestoneId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  milestones: p.milestones.map((m) => (m.id === milestoneId ? { ...m, completed: !m.completed } : m)),
                }
              : p
          ),
        })),
      setProjectProgress: (projectId, progress) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === projectId ? { ...p, progress } : p)),
        })),

      addTask: (t) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            { ...t, id: `t_${uid()}`, createdAt: new Date().toISOString() },
          ],
        })),
      updateTaskStatus: (id, status) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      updateInvoiceStatus: (id, status) =>
        set((s) => ({
          invoices: s.invoices.map((i) =>
            i.id === id
              ? { ...i, status, paidAt: status === "paid" ? new Date().toISOString() : i.paidAt }
              : i
          ),
        })),
      addInvoice: (i) =>
        set((s) => ({
          invoices: [
            ...s.invoices,
            {
              ...i,
              id: `inv_${uid()}`,
              number: `INV-${1050 + s.invoices.length + 1}`,
              issuedAt: new Date().toISOString(),
            },
          ],
        })),

      addFile: (f) =>
        set((s) => ({
          files: [
            ...s.files,
            { ...f, id: `f_${uid()}`, uploadedAt: new Date().toISOString() },
          ],
        })),
      deleteFile: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),

      sendMessage: (channelId, authorId, content) =>
        set((s) => ({
          messages: [
            ...s.messages,
            { id: `m_${uid()}`, channelId, authorId, content, createdAt: new Date().toISOString() },
          ],
        })),

      clockIn: (userId, projectId, note) =>
        set((s) => {
          const active = s.time.find((t) => t.userId === userId && !t.end);
          if (active) return s;
          return {
            time: [
              ...s.time,
              { id: `te_${uid()}`, userId, projectId, start: new Date().toISOString(), note },
            ],
          };
        }),
      clockOut: (userId) =>
        set((s) => ({
          time: s.time.map((t) =>
            t.userId === userId && !t.end ? { ...t, end: new Date().toISOString() } : t
          ),
        })),
      addTimeEntry: (e) => set((s) => ({ time: [...s.time, { ...e, id: `te_${uid()}` }] })),

      addBooking: (b) => set((s) => ({ bookings: [...s.bookings, { ...b, id: `b_${uid()}` }] })),
      deleteBooking: (id) => set((s) => ({ bookings: s.bookings.filter((b) => b.id !== id) })),

      addLead: (l) =>
        set((s) => ({
          leads: [
            ...s.leads,
            { ...l, id: `l_${uid()}`, createdAt: new Date().toISOString() },
          ],
        })),
      updateLeadStatus: (id, status) =>
        set((s) => ({ leads: s.leads.map((l) => (l.id === id ? { ...l, status } : l)) })),
      deleteLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),

      log: (userId, action, target) =>
        set((s) => ({
          logs: [
            { id: `log_${uid()}`, userId, action, target, at: new Date().toISOString() },
            ...s.logs,
          ].slice(0, 200),
        })),
    }),
    {
      name: "cad-store",
      version: 1,
    }
  )
);

export function useActiveUser() {
  const { currentUserId, impersonateId, users } = useStore();
  const id = impersonateId ?? currentUserId;
  return users.find((u) => u.id === id) ?? null;
}

export function useRealUser() {
  const { currentUserId, users } = useStore();
  return users.find((u) => u.id === currentUserId) ?? null;
}

export function roleHome(role: Role) {
  return `/${role}`;
}
