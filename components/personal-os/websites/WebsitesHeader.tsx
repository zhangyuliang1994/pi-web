"use client";

import React, { useState } from "react";
import { SyncIcon } from "../ui/icons";
import { Badge } from "../ui/Badge";
import type { WebsiteProperty, DateRangeOption } from "@/lib/personal-os/models/website";

export interface WebsitesHeaderProps {
  properties: WebsiteProperty[];
  selectedProperty: WebsiteProperty;
  onSelectProperty: (property: WebsiteProperty) => void;
  dateRange: DateRangeOption;
  onChangeDateRange: (range: DateRangeOption) => void;
  onSync: () => void;
}

export function WebsitesHeader({
  properties,
  selectedProperty,
  onSelectProperty,
  dateRange,
  onChangeDateRange,
  onSync,
}: WebsitesHeaderProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSyncClick = () => {
    setSyncing(true);
    setSyncMessage("Syncing Google Search Console (Simulated Demo)...");
    setTimeout(() => {
      setSyncing(false);
      setSyncMessage("Data is up-to-date (Demo cache refreshed).");
      onSync();
      setTimeout(() => setSyncMessage(null), 3000);
    }, 1000);
  };

  const ranges: { id: DateRangeOption; label: string }[] = [
    { id: "7d", label: "7D" },
    { id: "28d", label: "Last 28 Days" },
    { id: "3m", label: "3 Months" },
  ];

  return (
    <div className="space-y-3 pb-2">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Domain Selector & Sync status */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-x-auto">
            {properties.map((p) => {
              const active = p.id === selectedProperty.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectProperty(p)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                    active
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs border border-zinc-200/80 dark:border-zinc-600"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {p.domain}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
              GSC Connected • {selectedProperty.lastSyncedAt || "Synced"}
            </span>
            <Badge variant="primary" size="sm">
              Demo Data
            </Badge>
          </div>
        </div>

        {/* Right: Date Range & Sync button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium">
            {ranges.map((r) => {
              const active = dateRange === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onChangeDateRange(r.id)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    active
                      ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold shadow-2xs"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleSyncClick}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors shadow-2xs disabled:opacity-60"
            title="Refresh Search Console performance metrics"
          >
            <SyncIcon size={14} className={syncing ? "animate-spin text-indigo-600" : "text-indigo-600 dark:text-indigo-400"} />
            <span>{syncing ? "Syncing..." : "Sync API"}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/60 animate-in fade-in">
          {syncMessage}
        </div>
      )}
    </div>
  );
}
