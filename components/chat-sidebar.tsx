"use client";

import React from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  X,
  Menu,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onCollapse: () => void;
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  isOpen,
  isCollapsed,
  onToggle,
  onCollapse,
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-50 h-full
          bg-slate-950 border-r border-slate-700/40
          flex flex-col transition-all duration-300 shrink-0
          ${isOpen ? "translate-x-0 w-60" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-0 lg:border-0 lg:overflow-hidden" : "lg:w-60"}
        `}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-700/40 flex items-center justify-between min-w-[240px]">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Chat History
          </h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCollapse}
              className="hidden lg:flex h-7 w-7 text-slate-500 hover:text-slate-200 hover:bg-slate-800"
              title={isCollapsed ? "Show sidebar" : "Hide sidebar"}
            >
              {isCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="lg:hidden h-7 w-7 text-slate-500 hover:text-slate-200 hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3 min-w-[240px]">
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-2 bg-teal-600/15 hover:bg-teal-600/25 border border-teal-500/25 text-teal-300 hover:text-teal-200 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
          {sessions.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-10">
              No chat history yet
            </p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectSession(session.id)}
                onKeyDown={(e) => e.key === "Enter" && onSelectSession(session.id)}
                className={`
                  group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                  ${
                    activeSessionId === session.id
                      ? "bg-teal-600/20 border border-teal-500/30 text-white"
                      : "hover:bg-slate-800/60 text-slate-300"
                  }
                `}
              >
                <MessageSquare
                  className={`h-3.5 w-3.5 shrink-0 ${
                    activeSessionId === session.id ? "text-teal-400" : "text-slate-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate leading-tight">
                    {session.title?.trim() || "New Chat"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {session.updatedAt
                      ? new Date(session.updatedAt).toLocaleDateString()
                      : "Today"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 hover:bg-red-900/20 shrink-0 transition-all"
                  aria-label="Delete session"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label="Open sidebar"
          className="fixed top-4 left-4 z-30 lg:hidden h-9 w-9 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 text-slate-300 hover:text-white"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}