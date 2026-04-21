"use client";

import { useEffect, useRef, useState } from "react";
import { useActiveUser, useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatRelative } from "@/lib/utils";
import { Send, Hash } from "lucide-react";
import { Empty } from "./ui/empty";

export function Messaging() {
  const user = useActiveUser();
  const { channels, messages, users, sendMessage } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const myChannels = channels.filter((c) => c.memberIds.includes(user.id));
  const active = myChannels.find((c) => c.id === activeId) ?? myChannels[0];
  const channelMessages = messages
    .filter((m) => active && m.channelId === active.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channelMessages.length, active?.id]);

  const handleSend = () => {
    if (!draft.trim() || !active) return;
    sendMessage(active.id, user.id, draft.trim());
    setDraft("");
  };

  if (myChannels.length === 0) {
    return (
      <Card>
        <Empty title="No conversations yet" description="Your team will appear here once you're added to a project." />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-[260px_1fr] min-h-[560px]">
        <div className="border-r border-line/70 bg-surface-sunken">
          <div className="px-4 py-3 border-b border-line/70">
            <div className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted">
              Channels
            </div>
          </div>
          <div className="py-2">
            {myChannels.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2 text-left text-[13px] transition",
                  active?.id === c.id
                    ? "bg-surface text-ink font-medium"
                    : "text-ink-muted hover:bg-surface/50"
                )}
              >
                <Hash size={14} className="text-ink-soft" />
                <span className="truncate">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="px-5 py-3 border-b border-line/70 flex items-center justify-between">
            <div>
              <div className="text-[14px] font-semibold flex items-center gap-1.5">
                <Hash size={14} className="text-ink-soft" /> {active?.name}
              </div>
              <div className="text-[11px] text-ink-muted">{active?.memberIds.length} members</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 max-h-[460px]">
            {channelMessages.map((m) => {
              const author = users.find((u) => u.id === m.authorId);
              const isMe = m.authorId === user.id;
              return (
                <div key={m.id} className={cn("flex gap-3", isMe && "flex-row-reverse")}>
                  <Avatar
                    name={author?.name ?? "?"}
                    color={author?.avatarColor ?? "#999"}
                    size={28}
                  />
                  <div className={cn("max-w-[75%]", isMe && "text-right")}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[12px] font-medium">{author?.name}</span>
                      <span className="text-[11px] text-ink-soft">{formatRelative(m.createdAt)}</span>
                    </div>
                    <div
                      className={cn(
                        "inline-block px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed",
                        isMe ? "bg-accent text-white rounded-tr-md" : "bg-surface-muted text-ink rounded-tl-md"
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                </div>
              );
            })}
            {channelMessages.length === 0 && (
              <div className="text-center text-[13px] text-ink-muted py-8">
                No messages yet. Start the conversation.
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-line/70 p-3 flex gap-2">
            <Input
              placeholder={`Message #${active?.name}`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            />
            <Button onClick={handleSend} disabled={!draft.trim()}>
              <Send size={14} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
