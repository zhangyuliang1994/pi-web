"use client";

import React, { useState } from "react";
import { PersonalOsLayout } from "@/components/personal-os/layout/PersonalOsLayout";
import { WebsitesHeader } from "@/components/personal-os/websites/WebsitesHeader";
import { PerformanceMetricsCards } from "@/components/personal-os/websites/PerformanceMetricsCards";
import { DualAxisPerformanceChart } from "@/components/personal-os/websites/DualAxisPerformanceChart";
import { TopPagesTable } from "@/components/personal-os/websites/TopPagesTable";
import { INITIAL_WEBSITES } from "@/lib/personal-os/mock-data/websites";
import type { WebsiteProperty, DateRangeOption } from "@/lib/personal-os/models/website";

export default function WebsitesPage() {
  const [properties, setProperties] = useState<WebsiteProperty[]>(INITIAL_WEBSITES);
  const [selectedProperty, setSelectedProperty] = useState<WebsiteProperty>(
    INITIAL_WEBSITES[0]
  );
  const [dateRange, setDateRange] = useState<DateRangeOption>("28d");

  const handleSync = () => {
    // Refresh simulated sync timestamp
    const nowStr = `Today at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    setProperties((prev) =>
      prev.map((p) =>
        p.id === selectedProperty.id ? { ...p, lastSyncedAt: nowStr } : p
      )
    );
    setSelectedProperty((prev) => ({ ...prev, lastSyncedAt: nowStr }));
  };

  const currentMetrics = selectedProperty.metrics[dateRange];

  return (
    <PersonalOsLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Top Header with Domain Selector & Date Range */}
        <WebsitesHeader
          properties={properties}
          selectedProperty={selectedProperty}
          onSelectProperty={(p) => setSelectedProperty(p)}
          dateRange={dateRange}
          onChangeDateRange={(r) => setDateRange(r)}
          onSync={handleSync}
        />

        {/* 4 Metric Cards */}
        <PerformanceMetricsCards
          property={selectedProperty}
          dateRange={dateRange}
        />

        {/* Dual-Axis Search Performance Trend Chart */}
        <DualAxisPerformanceChart data={currentMetrics.chartData} />

        {/* Top Performing Pages Data Table */}
        <TopPagesTable
          domain={selectedProperty.domain}
          pages={currentMetrics.topPages}
          dateRange={dateRange}
        />
      </div>
    </PersonalOsLayout>
  );
}
