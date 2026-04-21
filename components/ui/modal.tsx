"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const width = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-surface rounded-3xl shadow-float border border-line/60 w-full overflow-hidden",
          width
        )}
      >
        <div className="flex items-start justify-between px-6 pt-5">
          <div>
            {title && <h2 className="text-[17px] font-semibold text-ink">{title}</h2>}
            {description && (
              <p className="text-[13px] text-ink-muted mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink transition p-1 -mr-1"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-line/70 bg-surface-sunken flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
