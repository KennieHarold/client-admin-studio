"use client";

import { PageHeader } from "@/components/dashboard-shell";
import { FilesView } from "@/components/files-view";

export default function ClientFiles() {
  return (
    <>
      <PageHeader title="Files" description="Shared deliverables and documents across your projects." />
      <FilesView />
    </>
  );
}
