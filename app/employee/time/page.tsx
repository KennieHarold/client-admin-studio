"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { useActiveUser, useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Play, Square, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

function duration(start: string, end?: string) {
  const ms = (end ? new Date(end).getTime() : Date.now()) - new Date(start).getTime();
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m`;
}

export default function EmployeeTime() {
  const user = useActiveUser();
  const { time, projects, clockIn, clockOut, addTimeEntry, log } = useStore();
  const [_, setTick] = useState(0);
  const [selectedProject, setSelectedProject] = useState("");
  const [note, setNote] = useState("");
  const [manualOpen, setManualOpen] = useState(false);
  const [manual, setManual] = useState({ projectId: "", date: "", startTime: "09:00", endTime: "17:00", note: "" });

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!user) return null;
  const myProjects = projects.filter((p) => p.assigneeIds.includes(user.id));
  const active = time.find((t) => t.userId === user.id && !t.end);
  const myEntries = time
    .filter((t) => t.userId === user.id)
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  const weekly = myEntries
    .filter((t) => t.end)
    .reduce((sum, t) => sum + (new Date(t.end!).getTime() - new Date(t.start).getTime()) / 3600000, 0);

  const handleClockIn = () => {
    if (!selectedProject) return;
    clockIn(user.id, selectedProject, note || undefined);
    log(user.id, "Clocked in");
    setNote("");
  };

  const handleManual = () => {
    if (!manual.projectId || !manual.date) return;
    const start = new Date(`${manual.date}T${manual.startTime}`).toISOString();
    const end = new Date(`${manual.date}T${manual.endTime}`).toISOString();
    addTimeEntry({
      userId: user.id,
      projectId: manual.projectId,
      start,
      end,
      note: manual.note || undefined,
    });
    log(user.id, "Logged time", projects.find((p) => p.id === manual.projectId)?.name);
    setManual({ projectId: "", date: "", startTime: "09:00", endTime: "17:00", note: "" });
    setManualOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Time tracking"
        description="Clock in while you work or log time manually."
        action={
          <Button variant="secondary" onClick={() => setManualOpen(true)}>
            <Plus size={14} /> Add manual entry
          </Button>
        }
      />

      <Card className="mb-6">
        <CardBody className="pt-6">
          {active ? (
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <div className="text-[12px] text-ink-muted mb-1">On the clock</div>
                <div className="text-[22px] font-semibold tabular-nums">{duration(active.start)}</div>
                <div className="text-[13px] text-ink-muted mt-1">
                  {projects.find((p) => p.id === active.projectId)?.name}
                  {active.note && ` · ${active.note}`}
                </div>
              </div>
              <Button
                variant="danger"
                onClick={() => {
                  clockOut(user.id);
                  log(user.id, "Clocked out");
                }}
              >
                <Square size={14} fill="white" /> Stop
              </Button>
            </div>
          ) : (
            <div className="flex items-end gap-3">
              <div className="flex-1 max-w-xs">
                <Label>Project</Label>
                <Select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                  <option value="">Select project…</option>
                  {myProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex-1">
                <Label>Note (optional)</Label>
                <Input placeholder="What are you working on?" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
              <Button onClick={handleClockIn} disabled={!selectedProject}>
                <Play size={14} fill="white" /> Clock in
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatBox label="This week" value={`${weekly.toFixed(1)}h`} />
        <StatBox label="Entries" value={String(myEntries.filter((t) => t.end).length)} />
        <StatBox label="Currently" value={active ? "Tracking" : "Idle"} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent entries</CardTitle>
        </CardHeader>
        <CardBody className="divide-y divide-line/60 -mx-6 px-0">
          {myEntries.map((t) => {
            const proj = projects.find((p) => p.id === t.projectId);
            return (
              <div key={t.id} className="px-6 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate">{proj?.name ?? "—"}</div>
                  <div className="text-[12px] text-ink-muted truncate">
                    {formatDate(t.start)} ·{" "}
                    {new Date(t.start).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    {t.end && ` – ${new Date(t.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
                    {t.note && ` · ${t.note}`}
                  </div>
                </div>
                <div className="text-[13px] font-medium tabular-nums">{duration(t.start, t.end)}</div>
                {!t.end && <span className="text-[11px] text-emerald-600 font-medium">Active</span>}
              </div>
            );
          })}
        </CardBody>
      </Card>

      <Modal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        title="Log time"
        footer={
          <>
            <Button variant="secondary" onClick={() => setManualOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleManual}>Save entry</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Project</Label>
            <Select value={manual.projectId} onChange={(e) => setManual({ ...manual, projectId: e.target.value })}>
              <option value="">Select…</option>
              {myProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Date</Label>
              <Input type="date" value={manual.date} onChange={(e) => setManual({ ...manual, date: e.target.value })} />
            </div>
            <div>
              <Label>Start</Label>
              <Input type="time" value={manual.startTime} onChange={(e) => setManual({ ...manual, startTime: e.target.value })} />
            </div>
            <div>
              <Label>End</Label>
              <Input type="time" value={manual.endTime} onChange={(e) => setManual({ ...manual, endTime: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Note</Label>
            <Textarea value={manual.note} onChange={(e) => setManual({ ...manual, note: e.target.value })} />
          </div>
        </div>
      </Modal>
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardBody className="pt-5">
        <div className="text-[12px] text-ink-muted mb-2">{label}</div>
        <div className="text-[24px] font-semibold tabular-nums">{value}</div>
      </CardBody>
    </Card>
  );
}
