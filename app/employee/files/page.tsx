"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { FilesView } from "@/components/files-view";

export default function EmployeeFiles() {
  return (
    <>
      <PageHeader title="Files" description="Upload deliverables and shared resources." />
      <FilesView />
    </>
  );
}
