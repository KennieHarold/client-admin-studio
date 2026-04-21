"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Empty } from "./ui/empty";
import { useActiveUser, useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { Upload, File as FileIcon, Trash2 } from "lucide-react";
import { useRef } from "react";

const prettySize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function FilesView({ projectId, canDelete = true }: { projectId?: string; canDelete?: boolean }) {
  const user = useActiveUser();
  const { files, users, projects, addFile, deleteFile, log } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  let list = files;
  if (projectId) list = list.filter((f) => f.projectId === projectId);
  if (user.role === "client") list = list.filter((f) => {
    const p = projects.find((x) => x.id === f.projectId);
    return p?.clientId === user.id;
  });
  if (user.role === "employee")
    list = list.filter((f) => {
      const p = projects.find((x) => x.id === f.projectId);
      return p?.assigneeIds.includes(user.id) || f.uploaderId === user.id;
    });

  list = [...list].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addFile({
      name: file.name,
      size: file.size,
      uploaderId: user.id,
      projectId: projectId ?? projects.find((p) => p.clientId === user.id || p.assigneeIds.includes(user.id))?.id,
      type: file.name.split(".").pop() ?? "file",
    });
    log(user.id, "Uploaded file", file.name);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <input type="file" ref={inputRef} onChange={handleUpload} className="hidden" />
        <Button onClick={() => inputRef.current?.click()}>
          <Upload size={14} /> Upload file
        </Button>
      </div>

      <Card>
        {list.length === 0 ? (
          <Empty
            icon={<FileIcon size={32} />}
            title="No files yet"
            description="Upload files to share with your team."
          />
        ) : (
          <div className="divide-y divide-line/60">
            {list.map((f) => {
              const uploader = users.find((u) => u.id === f.uploaderId);
              const project = projects.find((p) => p.id === f.projectId);
              return (
                <div key={f.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-10 h-10 rounded-xl bg-surface-muted flex items-center justify-center text-ink-muted uppercase text-[10px] font-semibold">
                    {f.type.slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium truncate">{f.name}</div>
                    <div className="text-[12px] text-ink-muted truncate">
                      {project?.name ?? "—"} · {uploader?.name} · {formatDate(f.uploadedAt)}
                    </div>
                  </div>
                  <div className="text-[12px] text-ink-muted tabular-nums w-16 text-right">
                    {prettySize(f.size)}
                  </div>
                  {canDelete && f.uploaderId === user.id && (
                    <button
                      onClick={() => {
                        deleteFile(f.id);
                        log(user.id, "Deleted file", f.name);
                      }}
                      className="text-ink-soft hover:text-red-500 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </>
  );
}
