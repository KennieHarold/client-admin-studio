"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { Messaging } from "@/components/messaging";

export default function EmployeeMessages() {
  return (
    <>
      <PageHeader title="Messages" description="Chat with admins and clients." />
      <Messaging />
    </>
  );
}
