"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Messaging } from "@/components/messaging";

export default function ClientMessages() {
  return (
    <>
      <PageHeader title="Messages" description="Real-time updates with your team." />
      <Messaging />
    </>
  );
}
