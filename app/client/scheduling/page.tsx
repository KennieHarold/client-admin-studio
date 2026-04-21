"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Empty } from "@/components/ui/empty";
import { useActiveUser, useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { CalendarDays, Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ClientScheduling() {
  const user = useActiveUser();
  const { bookings, users, addBooking, deleteBooking, log } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", employeeId: "", date: "", time: "10:00", notes: "" });

  if (!user) return null;
  const mine = bookings
    .filter((b) => b.clientId === user.id)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const employees = users.filter((u) => u.role === "employee");

  const reset = () => setForm({ title: "", employeeId: "", date: "", time: "10:00", notes: "" });

  const handleBook = () => {
    if (!form.title || !form.employeeId || !form.date) return;
    const start = new Date(`${form.date}T${form.time}`).toISOString();
    const end = new Date(new Date(start).getTime() + 60 * 60 * 1000).toISOString();
    addBooking({
      title: form.title,
      clientId: user.id,
      employeeId: form.employeeId,
      start,
      end,
      notes: form.notes || undefined,
    });
    log(user.id, "Booked meeting", form.title);
    reset();
    setOpen(false);
  };

  return (
    <>
      <PageHeader
        title="Scheduling"
        description="Book a call with your team or see what's coming up."
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus size={14} /> Book a meeting
          </Button>
        }
      />

      {mine.length === 0 ? (
        <Card>
          <Empty
            icon={<CalendarDays size={32} />}
            title="No meetings scheduled"
            description="Book a call with your team to get started."
            action={
              <Button onClick={() => setOpen(true)}>
                <Plus size={14} /> Book a meeting
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {mine.map((b) => {
            const emp = users.find((u) => u.id === b.employeeId);
            return (
              <Card key={b.id}>
                <CardBody className="pt-5 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center">
                    <div className="text-[10px] font-semibold uppercase">
                      {new Date(b.start).toLocaleDateString("en-US", { month: "short" })}
                    </div>
                    <div className="text-[18px] font-semibold leading-none">
                      {new Date(b.start).getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold">{b.title}</div>
                    <div className="text-[12px] text-ink-muted mt-0.5 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(b.start).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} –{" "}
                        {new Date(b.end).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      </span>
                      <span>with {emp?.name ?? "Team"}</span>
                    </div>
                    {b.notes && <div className="text-[12px] text-ink-muted mt-2 line-clamp-2">{b.notes}</div>}
                  </div>
                  <button
                    onClick={() => {
                      deleteBooking(b.id);
                      log(user.id, "Cancelled meeting", b.title);
                    }}
                    className="text-ink-soft hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        title="Book a meeting"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBook}>Book</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>What would you like to discuss?</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Project kickoff"
            />
          </div>
          <div>
            <Label>With</Label>
            <Select
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            >
              <option value="">Select team member</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} · {e.title}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Notes (optional)</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Anything you'd like to cover"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
