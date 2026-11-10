"use client";

import React, { useState } from "react";
import { Card } from "../ui/Card";
import type { WebsiteDayMetric } from "@/lib/personal-os/models/website";
import { formatNumber } from "@/lib/personal-os/utils/format";

export interface DualAxisPerformanceChartProps {
  data: WebsiteDayMetric[];
}

export function DualAxisPerformanceChart({ data }: DualAxisPerformanceChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  // Max scales
  const maxClicks = Math.max(...data.map((d) => d.clicks), 500);
  const maxImpressions = Math.max(...data.map((d) => d.impressions), 15000);

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 180;
  const paddingX = 10;
  const paddingY = 15;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingY * 2;

  // Compute points
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * innerWidth;
    const yClicks = svgHeight - paddingY - (d.clicks / maxClicks) * innerHeight;
    const yImpressions = svgHeight - paddingY - (d.impressions / maxImpressions) * innerHeight;
    return { x, yClicks, yImpressions, data: d };
  });

  // SVG Paths
  const clicksPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.yClicks.toFixed(1)}`)
    .join(" ");

  const impressionsLinePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.yImpressions.toFixed(1)}`)
    .join(" ");

  const impressionsAreaPath = `${impressionsLinePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  return (
    <Card className="p-4 sm:p-5 space-y-4">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
            Dual-Axis Search Performance Trend
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Clicks (Left Y-Axis, 0–{formatNumber(maxClicks)}/day) vs. Impressions (Right Y-Axis, 0–{(maxImpressions / 1000).toFixed(0)}k/day)
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-medium">
          <div className="flex items-center gap-1.5 text-[#4338CA] dark:text-[#818CF8]">
            <span className="w-3 h-1 bg-[#4338CA] dark:bg-[#818CF8] rounded-full inline-block" />
            <span>Clicks (Left Axis)</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-400 dark:text-indigo-400">
            <span className="w-3 h-1 bg-indigo-300 dark:bg-indigo-600 rounded-full inline-block" />
            <span>Impressions (Right Axis)</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas with Dual Axes */}
      <div className="relative bg-zinc-50/70 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
        <div className="flex items-stretch h-52">
          {/* Left Y-Axis (Clicks) */}
          <div className="w-12 flex flex-col justify-between text-[10px] font-mono font-semibold text-[#4338CA] dark:text-[#818CF8] pr-2 border-r border-zinc-200 dark:border-zinc-800 text-right select-none pb-4">
            <span>{formatNumber(maxClicks)}</span>
            <span>{formatNumber(Math.round(maxClicks / 2))}</span>
            <span>0</span>
          </div>

          {/* SVG Viewport */}
          <div className="flex-1 relative px-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              <line
                x1="0"
                y1={paddingY}
                x2={svgWidth}
                y2={paddingY}
                stroke="currentColor"
                className="text-zinc-200 dark:text-zinc-800"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1={svgHeight / 2}
                x2={svgWidth}
                y2={svgHeight / 2}
                stroke="currentColor"
                className="text-zinc-200 dark:text-zinc-800"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1={svgHeight - paddingY}
                x2={svgWidth}
                y2={svgHeight - paddingY}
                stroke="currentColor"
                className="text-zinc-200 dark:text-zinc-800"
              />

              {/* Impressions Area & Line */}
              <path
                d={impressionsAreaPath}
                fill="currentColor"
                className="text-indigo-100 dark:text-indigo-950/40"
              />
              <path
                d={impressionsLinePath}
                fill="none"
                stroke="currentColor"
                className="text-indigo-300 dark:text-indigo-500"
                strokeWidth="2"
              />

              {/* Clicks Line */}
              <path
                d={clicksPath}
                fill="none"
                stroke="currentColor"
                className="text-[#4338CA] dark:text-[#818CF8]"
                strokeWidth="2.5"
              />

              {/* Hover active indicators */}
              {hoveredPoint && (
                <>
                  <line
                    x1={hoveredPoint.x}
                    y1={paddingY}
                    x2={hoveredPoint.x}
                    y2={svgHeight - paddingY}
                    stroke="currentColor"
                    className="text-zinc-400 dark:text-zinc-600"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.yClicks}
                    r="4.5"
                    className="fill-[#4338CA] dark:fill-[#818CF8] stroke-white dark:stroke-[#18181B]"
                    strokeWidth="2"
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.yImpressions}
                    r="3.5"
                    className="fill-indigo-400 stroke-white dark:stroke-[#18181B]"
                    strokeWidth="1.5"
                  />
                </>
              )}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div
                className="absolute z-10 bg-zinc-900 text-white p-2.5 rounded-lg shadow-xl text-xs font-mono pointer-events-none transform -translate-x-1/2 -top-2 space-y-0.5 border border-zinc-700"
                style={{
                  left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                }}
              >
                <div className="text-zinc-400 text-[10px]">{hoveredPoint.data.date}</div>
                <div className="text-emerald-400 font-bold">
                  Clicks: {formatNumber(hoveredPoint.data.clicks)}
                </div>
                <div className="text-indigo-300">
                  Impressions: {formatNumber(hoveredPoint.data.impressions)}
                </div>
                <div className="text-zinc-400 text-[10px]">
                  CTR: {hoveredPoint.data.ctr}% • Pos: #{hoveredPoint.data.position}
                </div>
              </div>
            )}

            {/* Interactive hover zones */}
            <div className="absolute inset-0 flex">
              {points.map((p, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-full cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              ))}
            </div>
          </div>

          {/* Right Y-Axis (Impressions) */}
          <div className="w-12 flex flex-col justify-between text-[10px] font-mono font-semibold text-indigo-500 pl-2 border-l border-zinc-200 dark:border-zinc-800 select-none pb-4">
            <span>{(maxImpressions / 1000).toFixed(0)}k</span>
            <span>{(maxImpressions / 2000).toFixed(0)}k</span>
            <span>0</span>
          </div>
        </div>

        {/* X-Axis Timeline Dates */}
        <div className="flex justify-between text-[11px] text-zinc-400 font-mono pt-2 border-t border-zinc-200 dark:border-zinc-800/80 px-12">
          <span>{data[0]?.date}</span>
          <span className="hidden sm:inline">
            {data[Math.floor(data.length / 2)]?.date}
          </span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    </Card>
  );
}
