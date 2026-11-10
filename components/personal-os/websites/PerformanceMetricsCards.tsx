import React from "react";
import { Card } from "../ui/Card";
import { SeoIcon } from "../ui/icons";
import { formatNumber } from "@/lib/personal-os/utils/format";
import type { WebsiteProperty, DateRangeOption } from "@/lib/personal-os/models/website";

export interface PerformanceMetricsCardsProps {
  property: WebsiteProperty;
  dateRange: DateRangeOption;
}

export function PerformanceMetricsCards({
  property,
  dateRange,
}: PerformanceMetricsCardsProps) {
  const summary = property.metrics[dateRange].summary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Clicks */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-medium uppercase tracking-wider text-[11px]">Total Clicks</span>
          <SeoIcon size={16} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {formatNumber(summary.totalClicks)}
          </span>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            {summary.clicksChange}
          </span>
        </div>
        <span className="text-[11px] text-zinc-400 mt-1 block">
          Measured in Google Search Console
        </span>
      </Card>

      {/* Total Impressions */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-medium uppercase tracking-wider text-[11px]">Total Impressions</span>
          <SeoIcon size={16} className="text-blue-500" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {formatNumber(summary.totalImpressions)}
          </span>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            {summary.impressionsChange}
          </span>
        </div>
        <span className="text-[11px] text-zinc-400 mt-1 block">
          Search appearance count
        </span>
      </Card>

      {/* Average CTR */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-medium uppercase tracking-wider text-[11px]">Average CTR</span>
          <span className="text-xs font-bold text-amber-500">%</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {summary.averageCtr}%
          </span>
          <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
            {summary.ctrChange}
          </span>
        </div>
        <span className="text-[11px] text-zinc-400 mt-1 block">
          Percentage points change
        </span>
      </Card>

      {/* Average Position */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-medium uppercase tracking-wider text-[11px]">Average Position</span>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">#</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {summary.averagePosition}
          </span>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            {summary.positionChange}
          </span>
        </div>
        <span className="text-[11px] text-zinc-400 mt-1 block">
          Rank movement toward #1
        </span>
      </Card>
    </div>
  );
}
