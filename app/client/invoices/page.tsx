"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { InvoiceStatusBadge } from "@/components/ui/status";
import { useActiveUser, useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useState } from "react";
import { CreditCard, Sparkles } from "lucide-react";
import type { Invoice } from "@/lib/types";

export default function ClientInvoices() {
  const user = useActiveUser();
  const { invoices, updateInvoiceStatus, log } = useStore();
  const [paying, setPaying] = useState<Invoice | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  if (!user) return null;
  const mine = invoices.filter((i) => i.clientId === user.id);

  const handlePay = async () => {
    if (!paying) return;
    setProcessing(true);
    // Simulated Stripe flow
    await new Promise((r) => setTimeout(r, 1400));
    updateInvoiceStatus(paying.id, "paid");
    log(user.id, "Paid invoice", paying.number);
    setProcessing(false);
    setSuccess(paying.number);
    setPaying(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const totals = {
    paid: mine.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
    outstanding: mine
      .filter((i) => i.status === "sent" || i.status === "overdue")
      .reduce((s, i) => s + i.amount, 0),
  };

  return (
    <>
      <PageHeader title="Invoices & payments" description="Pay outstanding invoices and view history." />

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-5 py-4 text-emerald-800">
          <Sparkles size={16} />
          <span className="text-sm font-medium">Payment for {success} received. Thank you!</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardBody className="pt-5">
            <div className="text-[12px] text-ink-muted mb-2">Total paid</div>
            <div className="text-[28px] font-semibold">{formatCurrency(totals.paid)}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="pt-5">
            <div className="text-[12px] text-ink-muted mb-2">Outstanding</div>
            <div className="text-[28px] font-semibold">{formatCurrency(totals.outstanding)}</div>
          </CardBody>
        </Card>
      </div>

      <Card className="divide-y divide-line/60">
        {mine.map((inv) => (
          <div key={inv.id} className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium">{inv.number}</span>
                <InvoiceStatusBadge status={inv.status} />
              </div>
              <div className="text-[12px] text-ink-muted mt-0.5">
                Issued {formatDate(inv.issuedAt)} · Due {formatDate(inv.dueAt)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[15px] font-semibold tabular-nums">{formatCurrency(inv.amount)}</div>
            </div>
            {(inv.status === "sent" || inv.status === "overdue") && (
              <Button size="sm" onClick={() => setPaying(inv)}>
                <CreditCard size={14} /> Pay
              </Button>
            )}
            {inv.status === "paid" && inv.paidAt && (
              <div className="text-[12px] text-ink-muted w-20 text-right">
                Paid {formatDate(inv.paidAt)}
              </div>
            )}
          </div>
        ))}
      </Card>

      <Modal
        open={!!paying}
        onClose={() => !processing && setPaying(null)}
        title="Complete payment"
        description="Simulated Stripe checkout — for demo purposes only."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPaying(null)} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={handlePay} disabled={processing}>
              {processing ? "Processing…" : `Pay ${paying ? formatCurrency(paying.amount) : ""}`}
            </Button>
          </>
        }
      >
        {paying && (
          <div className="space-y-4">
            <div className="rounded-xl bg-surface-sunken p-4 border border-line/60">
              <div className="flex justify-between text-sm">
                <span className="text-ink-muted">Invoice</span>
                <span className="font-medium">{paying.number}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-ink-muted">Total</span>
                <span className="font-medium">{formatCurrency(paying.amount)}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {paying.lineItems.map((li, i) => (
                <div key={i} className="flex justify-between text-ink-muted">
                  <span>{li.description}</span>
                  <span className="tabular-nums">{formatCurrency(li.amount)}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-line px-4 py-3 bg-white flex items-center gap-3">
              <CreditCard size={16} className="text-ink-muted" />
              <span className="text-sm font-medium">•••• 4242</span>
              <span className="text-[12px] text-ink-muted ml-auto">Demo card</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
