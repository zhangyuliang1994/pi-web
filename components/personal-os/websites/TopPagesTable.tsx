"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "../ui/Card";
import { DownloadIcon, BotIcon } from "../ui/icons";
import { formatNumber, exportToCsv } from "@/lib/personal-os/utils/format";
import type { WebsiteTopPage, DateRangeOption } from "@/lib/personal-os/models/website";

export interface TopPagesTableProps {
  domain: string;
  pages: WebsiteTopPage[];
  dateRange: DateRangeOption;
}

export function TopPagesTable({ domain, pages, dateRange }: TopPagesTableProps) {
  const router = useRouter();

  const handleExportCsv = () => {
    const filename = `${domain}-top-pages-${dateRange}-${new Date().toISOString().slice(0, 10)}.csv`;
    const headers = ["Page URL", "Clicks", "Impressions", "CTR (%)", "Average Position", "Recent Change"];
    const rows = pages.map((p) => [
      p.path,
      p.clicks,
      p.impressions,
      p.ctr,
      p.position,
      p.change,
    ]);
    exportToCsv(filename, headers, rows);
  };

  const handleAskAi = () => {
    router.push("/");
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
            Top Performing Pages
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Ranked by search clicks ({dateRange.toUpperCase()})
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors shadow-2xs"
          title="Download real CSV file"
        >
          <DownloadIcon size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50/70 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Page URL</th>
              <th className="py-2.5 px-4 text-right">Clicks</th>
              <th className="py-2.5 px-4 text-right">Impressions</th>
              <th className="py-2.5 px-4 text-right">CTR</th>
              <th className="py-2.5 px-4 text-right">Position</th>
              <th className="py-2.5 px-4 text-right">Change</th>
              <th className="py-2.5 px-4 text-center">AI Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {pages.map((page) => (
              <tr
                key={page.path}
                className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors font-mono"
              >
                <td className="py-3 px-4 text-zinc-900 dark:text-zinc-100 font-medium">
                  {page.path}
                </td>
                <td className="py-3 px-4 text-right font-bold text-zinc-900 dark:text-zinc-100">
                  {formatNumber(page.clicks)}
                </td>
                <td className="py-3 px-4 text-right text-zinc-500 dark:text-zinc-400">
                  {formatNumber(page.impressions)}
                </td>
                <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                  {page.ctr}%
                </td>
                <td className="py-3 px-4 text-right text-zinc-700 dark:text-zinc-300">
                  #{page.position}
                </td>
                <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                  {page.change}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={handleAskAi}
                    className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-xs font-sans"
                  >
                    <BotIcon size={12} />
                    <span>Ask AI</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
