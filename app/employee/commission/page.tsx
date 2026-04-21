"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Empty } from "@/components/ui/empty";
import { useActiveUser, useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BadgeDollarSign } from "lucide-react";

export default function EmployeeCommission() {
  const user = useActiveUser();
  const { commissions } = useStore();
  if (!user) return null;

  const mine = commissions.filter((c) => c.employeeId === user.id);
  const totals = {
    ytd: mine.reduce((s, c) => s + c.payout, 0),
    pending: mine.filter((c) => c.status === "pending").reduce((s, c) => s + c.payout, 0),
    paid: mine.filter((c) => c.status === "paid").reduce((s, c) => s + c.payout, 0),
  };

  return (
    <>
      <PageHeader title="Commission" description="Your earnings from closed deals." />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Stat label="Earned (YTD)" value={formatCurrency(totals.ytd)} accent />
        <Stat label="Paid" value={formatCurrency(totals.paid)} />
        <Stat label="Pending" value={formatCurrency(totals.pending)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deals</CardTitle>
        </CardHeader>
        <CardBody>
          {mine.length === 0 ? (
            <Empty
              icon={<BadgeDollarSign size={32} />}
              title="No commissions yet"
              description="Close a deal from your leads to start earning commission."
            />
          ) : (
            <div className="divide-y divide-line/60 -mx-6">
              {mine.map((c) => (
                <div key={c.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium truncate">{c.dealName}</div>
                    <div className="text-[12px] text-ink-muted mt-0.5">
                      Closed {formatDate(c.closedAt)} · {(c.rate * 100).toFixed(1)}% of {formatCurrency(c.amount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[15px] font-semibold tabular-nums">{formatCurrency(c.payout)}</div>
                  </div>
                  <Badge tone={c.status === "paid" ? "green" : "amber"}>
                    {c.status === "paid" ? "Paid" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card className={accent ? "bg-gradient-to-br from-ink to-[#3a3a3f] text-white border-ink" : undefined}>
      <CardBody className="pt-5">
        <div className={"text-[12px] mb-2 " + (accent ? "text-white/70" : "text-ink-muted")}>{label}</div>
        <div className="text-[26px] font-semibold tracking-tight tabular-nums">{value}</div>
      </CardBody>
    </Card>
  );
}
