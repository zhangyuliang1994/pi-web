"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SparklesIcon, XIcon, SyncIcon } from "../ui/icons";
import { Badge } from "../ui/Badge";
import type { BriefingData } from "@/lib/personal-os/models/dashboard";

export interface AiDailyBriefingProps {
  initialData: BriefingData;
  onDismiss?: () => void;
}

export function AiDailyBriefing({ initialData, onDismiss }: AiDailyBriefingProps) {
  const router = useRouter();
  const [data, setData] = useState<BriefingData>(initialData);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleGenerate = () => {
    setData((prev) => ({ ...prev, status: "loading" }));
    setTimeout(() => {
      setData({
        status: "generated",
        headline: "UplinkPlans impressions grew +18.4% this week. CTR on comparison pages is down to 4.33%.",
        summary: "Google Search Console synced 342.1k impressions over the last 28 days. You have 3 urgent tasks scheduled today, including verifying Pi Web agent tool execution states and reviewing Starlink comparison pages.",
        highlights: [
          "UplinkPlans: Starlink vs Roam comparison page gained 1,240 clicks (Position 4.2).",
          "CupCities: World Cup stadium search traffic spiked +35.2% following venue announcements.",
          "Personal OS: All baseline unit tests and type checks passed; V1 workspace layout ready for review.",
        ],
        suggestedAction: {
          label: "Ask AI to diagnose CTR",
          prompt: "Analyze why UplinkPlans comparison page impressions grew by 18% while CTR slightly dropped, and suggest meta title tweaks.",
        },
        generatedAt: "Just now",
        isDemo: true,
      });
    }, 900);
  };

  const handleAskAi = () => {
    // Navigate to native Pi Web agent at /
    router.push("/");
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/80 via-white to-white dark:from-indigo-950/40 dark:via-[#18181B] dark:to-[#18181B] p-4 sm:p-5 shadow-xs transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center">
            <SparklesIcon size={14} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            AI Daily Briefing
          </span>
          <Badge variant="primary" size="sm">
            Demo Briefing
          </Badge>
          {data.generatedAt && (
            <span className="text-[11px] text-zinc-400 hidden sm:inline">• {data.generatedAt}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {data.status === "generated" && (
            <button
              type="button"
              onClick={handleGenerate}
              className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              title="Regenerate briefing"
            >
              <SyncIcon size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            title="Dismiss briefing"
          >
            <XIcon size={16} />
          </button>
        </div>
      </div>

      {/* State: Loading */}
      {data.status === "loading" && (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
          <SyncIcon size={20} className="animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Synthesizing workspace events, task priorities and SEO metrics...
          </p>
        </div>
      )}

      {/* State: Not Generated */}
      {data.status === "not_generated" && (
        <div className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Daily briefing is not generated yet. Click below to synthesize today&apos;s digital workspace status.
          </p>
          <button
            type="button"
            onClick={handleGenerate}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-colors shadow-2xs whitespace-nowrap"
          >
            Generate Briefing (Demo)
          </button>
        </div>
      )}

      {/* State: Failed */}
      {data.status === "failed" && (
        <div className="py-3 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400">
          <span>Failed to generate AI daily briefing. Check agent connection.</span>
          <button
            type="button"
            onClick={handleGenerate}
            className="px-2.5 py-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200"
          >
            Retry
          </button>
        </div>
      )}

      {/* State: Generated */}
      {data.status === "generated" && (
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
            {data.headline}
          </p>

          <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 pl-1">
            {data.highlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold leading-none mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAskAi}
              className="px-3 py-1.5 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] text-white text-xs font-medium hover:opacity-95 shadow-2xs transition-opacity"
              title="Opens Pi Agent workspace"
            >
              Open AI Assistant
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/60 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
