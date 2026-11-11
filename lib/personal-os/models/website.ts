export type DateRangeOption = "7d" | "28d" | "3m";

export type GscSyncStatus = "not_connected" | "demo" | "loading" | "connected" | "sync_failed";

export interface WebsiteDayMetric {
  date: string; // YYYY-MM-DD
  clicks: number;
  impressions: number;
  ctr: number; // percentage, e.g. 2.45 (%)
  position: number; // e.g. 14.2
}

export interface WebsiteTopPage {
  path: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  change: string; // e.g. "+14.2%" or "-2.1%"
}

export interface WebsiteProperty {
  id: string;
  domain: string;
  name: string;
  syncStatus: GscSyncStatus;
  lastSyncedAt?: string;
  metrics: Record<DateRangeOption, {
    summary: {
      totalClicks: number;
      totalImpressions: number;
      averageCtr: number;
      averagePosition: number;
      clicksChange: string; // e.g. "+12.8%"
      impressionsChange: string;
      ctrChange: string;
      positionChange: string;
    };
    chartData: WebsiteDayMetric[];
    topPages: WebsiteTopPage[];
  }>;
}
