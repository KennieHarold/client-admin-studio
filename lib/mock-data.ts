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
} from "./types";

const now = new Date();
const iso = (daysOffset: number, hour = 9) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const mockUsers: User[] = [
  // Admins
  { id: "u_admin", name: "Alex Morgan", email: "alex@studio.co", role: "admin", avatarColor: "#1d1d1f", title: "Founder" },
  // Employees
  { id: "u_emp_1", name: "Jordan Lee", email: "jordan@studio.co", role: "employee", avatarColor: "#0071e3", title: "Senior Designer" },
  { id: "u_emp_2", name: "Sam Rivera", email: "sam@studio.co", role: "employee", avatarColor: "#30b27b", title: "Engineer" },
  { id: "u_emp_3", name: "Priya Shah", email: "priya@studio.co", role: "employee", avatarColor: "#ff6b35", title: "Account Manager" },
  // Clients
  { id: "u_client_1", name: "Taylor Kim", email: "taylor@northwind.com", role: "client", avatarColor: "#8e4ec6", company: "Northwind Labs" },
  { id: "u_client_2", name: "Morgan Patel", email: "morgan@acme.co", role: "client", avatarColor: "#f7b500", company: "Acme Co." },
];

export const mockProjects: Project[] = [
  {
    id: "p_1",
    name: "Northwind Website Redesign",
    description: "Complete brand refresh and marketing site rebuild.",
    clientId: "u_client_1",
    assigneeIds: ["u_emp_1", "u_emp_2"],
    status: "in_progress",
    progress: 62,
    startDate: iso(-30),
    dueDate: iso(20),
    budget: 48000,
    milestones: [
      { id: "m1", title: "Discovery & research", dueDate: iso(-20), completed: true },
      { id: "m2", title: "Design system", dueDate: iso(-5), completed: true },
      { id: "m3", title: "Implementation", dueDate: iso(10), completed: false },
      { id: "m4", title: "Launch", dueDate: iso(20), completed: false },
    ],
  },
  {
    id: "p_2",
    name: "Acme Mobile App",
    description: "iOS + Android customer-facing app, v1 launch.",
    clientId: "u_client_2",
    assigneeIds: ["u_emp_2", "u_emp_3"],
    status: "onboarding",
    progress: 12,
    startDate: iso(-4),
    dueDate: iso(60),
    budget: 92000,
    milestones: [
      { id: "m5", title: "Kickoff & scope", dueDate: iso(2), completed: false },
      { id: "m6", title: "Prototype", dueDate: iso(20), completed: false },
      { id: "m7", title: "Beta", dueDate: iso(45), completed: false },
    ],
  },
  {
    id: "p_3",
    name: "Northwind Analytics Dashboard",
    description: "Internal analytics & reporting suite.",
    clientId: "u_client_1",
    assigneeIds: ["u_emp_1"],
    status: "review",
    progress: 88,
    startDate: iso(-70),
    dueDate: iso(5),
    budget: 26000,
    milestones: [
      { id: "m8", title: "Data integration", dueDate: iso(-40), completed: true },
      { id: "m9", title: "Charts & UI", dueDate: iso(-10), completed: true },
      { id: "m10", title: "QA & sign-off", dueDate: iso(5), completed: false },
    ],
  },
];

export const mockTasks: Task[] = [
  { id: "t_1", projectId: "p_1", title: "Finalize homepage hero", assigneeId: "u_emp_1", status: "doing", dueDate: iso(3), createdAt: iso(-4) },
  { id: "t_2", projectId: "p_1", title: "Implement navigation component", assigneeId: "u_emp_2", status: "todo", dueDate: iso(6), createdAt: iso(-3) },
  { id: "t_3", projectId: "p_1", title: "Content audit", assigneeId: "u_emp_1", status: "done", createdAt: iso(-10) },
  { id: "t_4", projectId: "p_2", title: "Kickoff workshop prep", assigneeId: "u_emp_3", status: "doing", dueDate: iso(1), createdAt: iso(-1) },
  { id: "t_5", projectId: "p_3", title: "Cross-browser QA", assigneeId: "u_emp_1", status: "todo", dueDate: iso(4), createdAt: iso(-2) },
];

export const mockInvoices: Invoice[] = [
  {
    id: "inv_1",
    number: "INV-1042",
    clientId: "u_client_1",
    projectId: "p_1",
    amount: 12000,
    status: "paid",
    issuedAt: iso(-40),
    dueAt: iso(-10),
    paidAt: iso(-12),
    lineItems: [{ description: "Design phase – milestone 1", amount: 12000 }],
  },
  {
    id: "inv_2",
    number: "INV-1048",
    clientId: "u_client_1",
    projectId: "p_1",
    amount: 16000,
    status: "sent",
    issuedAt: iso(-8),
    dueAt: iso(7),
    lineItems: [
      { description: "Implementation – milestone 2", amount: 14000 },
      { description: "Expenses", amount: 2000 },
    ],
  },
  {
    id: "inv_3",
    number: "INV-1051",
    clientId: "u_client_2",
    projectId: "p_2",
    amount: 9200,
    status: "sent",
    issuedAt: iso(-2),
    dueAt: iso(13),
    lineItems: [{ description: "Kickoff & discovery", amount: 9200 }],
  },
  {
    id: "inv_4",
    number: "INV-1033",
    clientId: "u_client_1",
    projectId: "p_3",
    amount: 6500,
    status: "overdue",
    issuedAt: iso(-55),
    dueAt: iso(-5),
    lineItems: [{ description: "Dashboard MVP", amount: 6500 }],
  },
];

export const mockContracts: Contract[] = [
  { id: "c_1", title: "Master Services Agreement – Northwind", clientId: "u_client_1", status: "signed", signedAt: iso(-60), fileUrl: "#" },
  { id: "c_2", title: "SOW – Website Redesign", clientId: "u_client_1", projectId: "p_1", status: "signed", signedAt: iso(-32), fileUrl: "#" },
  { id: "c_3", title: "SOW – Acme Mobile App v1", clientId: "u_client_2", projectId: "p_2", status: "pending", fileUrl: "#" },
];

export const mockFiles: FileItem[] = [
  { id: "f_1", name: "Brand Guidelines v3.pdf", size: 2_400_000, uploaderId: "u_emp_1", projectId: "p_1", uploadedAt: iso(-6), type: "pdf" },
  { id: "f_2", name: "Homepage-mockup.fig", size: 14_800_000, uploaderId: "u_emp_1", projectId: "p_1", uploadedAt: iso(-3), type: "fig" },
  { id: "f_3", name: "Kickoff-notes.docx", size: 220_000, uploaderId: "u_emp_3", projectId: "p_2", uploadedAt: iso(-1), type: "doc" },
  { id: "f_4", name: "Analytics-requirements.xlsx", size: 180_000, uploaderId: "u_client_1", projectId: "p_3", uploadedAt: iso(-14), type: "xls" },
];

export const mockChannels: Channel[] = [
  { id: "ch_p1", name: "Northwind Website", memberIds: ["u_admin", "u_emp_1", "u_emp_2", "u_client_1"], type: "project", projectId: "p_1" },
  { id: "ch_p2", name: "Acme Mobile App", memberIds: ["u_admin", "u_emp_2", "u_emp_3", "u_client_2"], type: "project", projectId: "p_2" },
  { id: "ch_p3", name: "Northwind Analytics", memberIds: ["u_admin", "u_emp_1", "u_client_1"], type: "project", projectId: "p_3" },
  { id: "ch_team", name: "Internal – Team", memberIds: ["u_admin", "u_emp_1", "u_emp_2", "u_emp_3"], type: "direct" },
];

export const mockMessages: Message[] = [
  { id: "msg_1", channelId: "ch_p1", authorId: "u_emp_1", content: "Uploaded the updated homepage mockup — would love your eyes on the hero.", createdAt: iso(-2, 10) },
  { id: "msg_2", channelId: "ch_p1", authorId: "u_client_1", content: "Looks great. Can we try a slightly softer gradient on the background?", createdAt: iso(-2, 14) },
  { id: "msg_3", channelId: "ch_p1", authorId: "u_emp_1", content: "On it — new version by EOD.", createdAt: iso(-2, 15) },
  { id: "msg_4", channelId: "ch_p2", authorId: "u_emp_3", content: "Kickoff agenda ready — shared in files.", createdAt: iso(-1, 11) },
  { id: "msg_5", channelId: "ch_team", authorId: "u_admin", content: "Team, weekly review on Friday 3pm.", createdAt: iso(-1, 9) },
];

export const mockTime: TimeEntry[] = [
  { id: "te_1", userId: "u_emp_1", projectId: "p_1", start: iso(-1, 9), end: iso(-1, 13), note: "Homepage revisions" },
  { id: "te_2", userId: "u_emp_1", projectId: "p_1", start: iso(-1, 14), end: iso(-1, 17), note: "Design review" },
  { id: "te_3", userId: "u_emp_2", projectId: "p_1", start: iso(-2, 10), end: iso(-2, 16), note: "Nav component" },
  { id: "te_4", userId: "u_emp_3", projectId: "p_2", start: iso(-1, 9), end: iso(-1, 12), note: "Kickoff prep" },
];

export const mockBookings: Booking[] = [
  { id: "b_1", title: "Weekly sync – Northwind", clientId: "u_client_1", employeeId: "u_emp_1", start: iso(2, 14), end: iso(2, 15) },
  { id: "b_2", title: "Kickoff workshop – Acme", clientId: "u_client_2", employeeId: "u_emp_3", start: iso(4, 10), end: iso(4, 12) },
];

export const mockLeads: Lead[] = [
  { id: "l_1", name: "Chris Walker", company: "Bluewave Inc.", email: "chris@bluewave.io", value: 45000, status: "qualified", ownerId: "u_emp_3", createdAt: iso(-12), notes: "Interested in full rebrand + site." },
  { id: "l_2", name: "Dana Flores", company: "Helm & Co.", email: "dana@helm.co", value: 28000, status: "proposal", ownerId: "u_emp_3", createdAt: iso(-6) },
  { id: "l_3", name: "Rowan Park", company: "Cedar Studio", email: "rowan@cedar.studio", value: 18500, status: "contacted", ownerId: "u_emp_1", createdAt: iso(-3) },
  { id: "l_4", name: "Indra Vasquez", company: "Northlane", email: "i@northlane.app", value: 62000, status: "won", ownerId: "u_emp_3", createdAt: iso(-30) },
];

export const mockCommissions: Commission[] = [
  { id: "cm_1", employeeId: "u_emp_3", leadId: "l_4", dealName: "Northlane – Platform build", amount: 62000, rate: 0.08, payout: 4960, closedAt: iso(-25), status: "paid" },
  { id: "cm_2", employeeId: "u_emp_3", dealName: "Acme Mobile App", amount: 92000, rate: 0.05, payout: 4600, closedAt: iso(-10), status: "pending" },
];

export const mockLogs: ActivityLog[] = [
  { id: "log_1", userId: "u_admin", action: "Created project", target: "Acme Mobile App", at: iso(-4, 9) },
  { id: "log_2", userId: "u_emp_1", action: "Uploaded file", target: "Homepage-mockup.fig", at: iso(-3, 11) },
  { id: "log_3", userId: "u_client_1", action: "Paid invoice", target: "INV-1042", at: iso(-12, 15) },
  { id: "log_4", userId: "u_emp_3", action: "Closed lead", target: "Northlane", at: iso(-25, 17) },
  { id: "log_5", userId: "u_admin", action: "Sent invoice", target: "INV-1048", at: iso(-8, 10) },
];
