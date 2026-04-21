"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActiveUser, useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { FileText, Download } from "lucide-react";

export default function ClientContracts() {
  const user = useActiveUser();
  const { contracts } = useStore();
  if (!user) return null;
  const mine = contracts.filter((c) => c.clientId === user.id);

  return (
    <>
      <PageHeader title="Contracts & agreements" description="View and download your signed agreements." />

      <Card className="divide-y divide-line/60">
        {mine.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-5 py-4">
            <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-ink-muted">
              <FileText size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium truncate">{c.title}</div>
              <div className="text-[12px] text-ink-muted">
                {c.status === "signed" && c.signedAt
                  ? `Signed ${formatDate(c.signedAt)}`
                  : "Awaiting signature"}
              </div>
            </div>
            <Badge tone={c.status === "signed" ? "green" : "amber"}>
              {c.status === "signed" ? "Signed" : "Pending"}
            </Badge>
            <Button variant="secondary" size="sm">
              <Download size={14} /> Download
            </Button>
          </div>
        ))}
        {mine.length === 0 && (
          <div className="p-10 text-center text-sm text-ink-muted">No contracts yet.</div>
        )}
      </Card>
    </>
  );
}
