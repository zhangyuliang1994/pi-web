import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { SeoIcon } from "../ui/icons";
import { formatNumber } from "@/lib/personal-os/utils/format";
import type { WebsiteProperty } from "@/lib/personal-os/models/website";

export interface WebsitePerformanceProps {
  site: WebsiteProperty;
}

export function WebsitePerformance({ site }: WebsitePerformanceProps) {
  const metrics = site.metrics["28d"].summary;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <SeoIcon size={16} className="text-zinc-500 dark:text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {site.domain}
          </h2>
          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            {metrics.clicksChange} Clicks (28d)
          </span>
        </div>
        <Link
          href="/websites"
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          SEO Hub →
        </Link>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-0.5">Clicks</span>
            <span className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {formatNumber(metrics.totalClicks)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-0.5">Impressions</span>
            <span className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {formatNumber(metrics.totalImpressions)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-0.5">Avg CTR</span>
            <span className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {metrics.averageCtr}%
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] text-zinc-400 block mb-0.5">Avg Position</span>
            <span className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">
              {metrics.averagePosition}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
