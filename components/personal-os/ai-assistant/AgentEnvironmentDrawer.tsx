"use client";

import React, { useState, useEffect } from "react";
import { Drawer } from "../ui/Drawer";
import { Badge } from "../ui/Badge";
import { SettingsIcon, TerminalIcon, SyncIcon } from "../ui/icons";

export interface AgentEnvironmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string | null;
  sessionTitle?: string | null;
  cwd?: string | null;
  modelId?: string | null;
  modelProvider?: string | null;
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
  modelProvider,
  thinkingLevel,
  onOpenSettings,
}: AgentEnvironmentDrawerProps) {
  const [mcpStatus, setMcpStatus] = useState<{ loading: boolean; count: number | null; error: boolean }>({
    loading: false,
    count: null,
    error: false,
  });
  const [skillsStatus, setSkillsStatus] = useState<{ loading: boolean; count: number | null; error: boolean }>({
    loading: false,
    count: null,
    error: false,
  });

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function checkIntegrations() {
      setMcpStatus({ loading: true, count: null, error: false });
      setSkillsStatus({ loading: true, count: null, error: false });

      const targetCwd = cwd || "";

      // Check MCP
      try {
        const mcpUrl = targetCwd ? `/api/mcp?cwd=${encodeURIComponent(targetCwd)}` : "/api/mcp";
        const res = await fetch(mcpUrl);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            const enabledCount = Array.isArray(data.servers)
              ? data.servers.filter((s: { enabled?: boolean }) => s.enabled !== false).length
              : 0;
            setMcpStatus({ loading: false, count: enabledCount, error: false });
          }
        } else {
          if (!cancelled) setMcpStatus({ loading: false, count: null, error: true });
        }
      } catch {
        if (!cancelled) setMcpStatus({ loading: false, count: null, error: true });
      }

      // Check Skills
      try {
        if (!targetCwd) {
          if (!cancelled) setSkillsStatus({ loading: false, count: null, error: false });
        } else {
          const skillsUrl = `/api/skills?cwd=${encodeURIComponent(targetCwd)}`;
          const res = await fetch(skillsUrl);
          if (res.ok) {
            const data = await res.json();
            if (!cancelled) {
              const count = Array.isArray(data.skills) ? data.skills.length : 0;
              setSkillsStatus({ loading: false, count, error: false });
            }
          } else {
            if (!cancelled) setSkillsStatus({ loading: false, count: null, error: true });
          }
        }
      } catch {
        if (!cancelled) setSkillsStatus({ loading: false, count: null, error: true });
      }
    }

    void checkIntegrations();

    return () => {
      cancelled = true;
    };
  }, [isOpen, cwd]);

  const displayModelText = modelId
    ? `${modelProvider ? `${modelProvider} / ` : ""}${modelId}`
    : "Unknown / Not Available";

  const displayThinkingText =
    thinkingLevel !== undefined && thinkingLevel !== null && thinkingLevel !== ""
      ? String(thinkingLevel)
      : "Unknown / Not Available";

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
              <span
                className={`font-semibold truncate block mt-0.5 font-mono ${
                  modelId
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-400 dark:text-zinc-500 italic"
                }`}
              >
                {displayModelText}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700">
              <span className="text-[10px] text-zinc-400 block">Thinking Level</span>
              <span
                className={`font-semibold block mt-0.5 font-mono ${
                  thinkingLevel !== undefined && thinkingLevel !== null && thinkingLevel !== ""
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-400 dark:text-zinc-500 italic"
                }`}
              >
                {displayThinkingText}
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
            {/* MCP Status */}
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    mcpStatus.loading
                      ? "bg-amber-400 animate-pulse"
                      : mcpStatus.count && mcpStatus.count > 0
                      ? "bg-emerald-500"
                      : "bg-zinc-400"
                  }`}
                />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  Model Context Protocol (MCP)
                </span>
              </div>
              {mcpStatus.loading ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                  <SyncIcon size={12} className="animate-spin" /> Checking...
                </span>
              ) : mcpStatus.error || mcpStatus.count === null ? (
                <Badge variant="muted" size="sm">Not Available</Badge>
              ) : mcpStatus.count > 0 ? (
                <Badge variant="success" size="sm">{mcpStatus.count} Active</Badge>
              ) : (
                <Badge variant="muted" size="sm">0 Configured</Badge>
              )}
            </div>

            {/* Skills & Plugins Status */}
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    skillsStatus.loading
                      ? "bg-amber-400 animate-pulse"
                      : skillsStatus.count && skillsStatus.count > 0
                      ? "bg-emerald-500"
                      : "bg-zinc-400"
                  }`}
                />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  Pi Agent Skills &amp; Plugins
                </span>
              </div>
              {skillsStatus.loading ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                  <SyncIcon size={12} className="animate-spin" /> Checking...
                </span>
              ) : skillsStatus.error || skillsStatus.count === null ? (
                <Badge variant="muted" size="sm">Not Available</Badge>
              ) : skillsStatus.count > 0 ? (
                <Badge variant="success" size="sm">{skillsStatus.count} Loaded</Badge>
              ) : (
                <Badge variant="muted" size="sm">0 Loaded</Badge>
              )}
            </div>

            {/* Terminal & Worktree Status */}
            <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  Git Worktree &amp; Terminal
                </span>
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
