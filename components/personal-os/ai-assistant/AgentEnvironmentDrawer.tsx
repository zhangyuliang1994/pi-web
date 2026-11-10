"use client";

import React from "react";
import { Drawer } from "../ui/Drawer";
import { Badge } from "../ui/Badge";
import { SettingsIcon, TerminalIcon } from "../ui/icons";

export interface AgentEnvironmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string | null;
  sessionTitle?: string | null;
  cwd?: string | null;
  modelId?: string | null;
  thinkingLevel?: string | number | null;
  onOpenSettings?: () => void;
}

export function AgentEnvironmentDrawer({
  isOpen,
  onClose,
  sessionId,
  sessionTitle,
  cwd,
  modelId,
  thinkingLevel,
  onOpenSettings,
}: AgentEnvironmentDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Agent Environment"
      description="Runtime parameters, project workspace, and integrations"
      width="md"
    >
      <div className="space-y-5 text-xs">
        {/* Active Session */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-400">
              Active Session
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
          <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
            {sessionTitle || "New Agent Conversation"}
          </div>
          {sessionId && (
            <div className="text-[11px] font-mono text-zinc-400 truncate">
              ID: {sessionId}
            </div>
          )}
        </div>

        {/* Runtime Model & Thinking Level */}
        <div className="space-y-2">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-400 block">
            Model Configuration
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="text-[10px] text-zinc-400 block">Active Model</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate block mt-0.5 font-mono">
                {modelId || "pi-default"}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="text-[10px] text-zinc-400 block">Thinking Level</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mt-0.5 font-mono">
                {thinkingLevel !== undefined && thinkingLevel !== null ? String(thinkingLevel) : "Normal"}
              </span>
            </div>
          </div>
        </div>

        {/* Working Directory (cwd) */}
        <div className="space-y-1.5">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-400 block">
            Project Working Directory
          </span>
          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
            <TerminalIcon size={14} className="text-zinc-400 flex-shrink-0" />
            <span className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300 truncate">
              {cwd || "Default workspace (~/pi-cwd)"}
            </span>
          </div>
        </div>

        {/* Capabilities & Extensions */}
        <div className="space-y-2">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-400 block">
            Integrated Capabilities
          </span>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">Model Context Protocol (MCP)</span>
              </div>
              <Badge variant="success" size="sm">Active</Badge>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">Pi Agent Skills &amp; Plugins</span>
              </div>
              <Badge variant="success" size="sm">Loaded</Badge>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">Git Worktree &amp; Terminal</span>
              </div>
              <Badge variant="success" size="sm">Available</Badge>
            </div>
          </div>
        </div>

        {/* Settings button */}
        {onOpenSettings && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-2xs"
            >
              <SettingsIcon size={14} />
              <span>Configure Models &amp; MCP in Settings</span>
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
