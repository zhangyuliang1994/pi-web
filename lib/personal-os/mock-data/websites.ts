import type { WebsiteProperty, WebsiteDayMetric } from "../models/website";

function generateDailyData(days: number, baseClicks: number, baseImpressions: number, baseCtr: number, basePos: number): WebsiteDayMetric[] {
  const result: WebsiteDayMetric[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    // Minor deterministic variation
    const factor = 1 + Math.sin(i * 0.7) * 0.18 + Math.cos(i * 0.3) * 0.08;
    const clicks = Math.round(baseClicks * factor);
    const impressions = Math.round(baseImpressions * factor * (1 + (i % 3) * 0.05));
    const ctr = impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : baseCtr;
    const position = Number((basePos - Math.sin(i * 0.5) * 1.2).toFixed(1));

    result.push({
      date: dateStr,
      clicks,
      impressions,
      ctr,
      position,
    });
  }
  return result;
}

export const INITIAL_WEBSITES: WebsiteProperty[] = [
  {
    id: "site-uplink-plans",
    domain: "UplinkPlans.com",
    name: "UplinkPlans",
    syncStatus: "demo",
    lastSyncedAt: "Today at 07:45 AM",
    metrics: {
      "7d": {
        summary: {
          totalClicks: 4120,
          totalImpressions: 98400,
          averageCtr: 4.18,
          averagePosition: 11.2,
          clicksChange: "+14.5%",
          impressionsChange: "+19.2%",
          ctrChange: "-0.2%",
          positionChange: "+1.4",
        },
        chartData: generateDailyData(7, 580, 14000, 4.14, 11.2),
        topPages: [
          { path: "/starlink-residential-vs-roam", clicks: 1240, impressions: 24500, ctr: 5.06, position: 4.2, change: "+18.2%" },
          { path: "/best-satellite-internet-plans-2026", clicks: 980, impressions: 21300, ctr: 4.60, position: 6.8, change: "+9.5%" },
          { path: "/direct-to-cell-coverage-maps", clicks: 710, impressions: 16800, ctr: 4.22, position: 8.5, change: "+12.1%" },
          { path: "/ku-band-vs-ka-band-latency", clicks: 490, impressions: 14200, ctr: 3.45, position: 14.1, change: "-2.4%" },
          { path: "/oneweb-enterprise-terminal-pricing", clicks: 350, impressions: 9800, ctr: 3.57, position: 15.6, change: "+4.1%" },
        ],
      },
      "28d": {
        summary: {
          totalClicks: 14820,
          totalImpressions: 342100,
          averageCtr: 4.33,
          averagePosition: 12.4,
          clicksChange: "+12.8%",
          impressionsChange: "+18.4%",
          ctrChange: "-0.2%",
          positionChange: "+0.8",
        },
        chartData: generateDailyData(28, 520, 12200, 4.26, 12.4),
        topPages: [
          { path: "/starlink-residential-vs-roam", clicks: 4320, impressions: 84500, ctr: 5.11, position: 4.5, change: "+15.3%" },
          { path: "/best-satellite-internet-plans-2026", clicks: 3490, impressions: 72100, ctr: 4.84, position: 6.9, change: "+11.2%" },
          { path: "/direct-to-cell-coverage-maps", clicks: 2610, impressions: 58900, ctr: 4.43, position: 8.9, change: "+8.7%" },
          { path: "/ku-band-vs-ka-band-latency", clicks: 1840, impressions: 49300, ctr: 3.73, position: 13.8, change: "-1.8%" },
          { path: "/oneweb-enterprise-terminal-pricing", clicks: 1210, impressions: 38200, ctr: 3.16, position: 16.2, change: "+3.5%" },
        ],
      },
      "3m": {
        summary: {
          totalClicks: 42150,
          totalImpressions: 980400,
          averageCtr: 4.30,
          averagePosition: 13.1,
          clicksChange: "+32.1%",
          impressionsChange: "+41.5%",
          ctrChange: "-0.3%",
          positionChange: "+2.1",
        },
        chartData: generateDailyData(90, 460, 10800, 4.25, 13.1),
        topPages: [
          { path: "/starlink-residential-vs-roam", clicks: 12900, impressions: 248000, ctr: 5.20, position: 4.8, change: "+24.5%" },
          { path: "/best-satellite-internet-plans-2026", clicks: 10450, impressions: 215000, ctr: 4.86, position: 7.2, change: "+19.0%" },
          { path: "/direct-to-cell-coverage-maps", clicks: 7600, impressions: 172000, ctr: 4.41, position: 9.3, change: "+15.2%" },
          { path: "/ku-band-vs-ka-band-latency", clicks: 5100, impressions: 141000, ctr: 3.61, position: 14.5, change: "-0.5%" },
          { path: "/oneweb-enterprise-terminal-pricing", clicks: 3400, impressions: 108000, ctr: 3.14, position: 17.0, change: "+7.8%" },
        ],
      },
    },
  },
  {
    id: "site-satcom-index",
    domain: "SatcomIndex.com",
    name: "SatcomIndex",
    syncStatus: "demo",
    lastSyncedAt: "Yesterday at 11:30 PM",
    metrics: {
      "7d": {
        summary: {
          totalClicks: 1890,
          totalImpressions: 42100,
          averageCtr: 4.48,
          averagePosition: 15.3,
          clicksChange: "+8.2%",
          impressionsChange: "+11.0%",
          ctrChange: "-0.1%",
          positionChange: "+0.5",
        },
        chartData: generateDailyData(7, 270, 6000, 4.5, 15.3),
        topPages: [
          { path: "/transponders/c-band-frequencies", clicks: 610, impressions: 12400, ctr: 4.91, position: 9.1, change: "+10.2%" },
          { path: "/ground-stations/teleport-directory", clicks: 480, impressions: 11100, ctr: 4.32, position: 12.4, change: "+6.8%" },
          { path: "/orbit/geo-slots-allocations", clicks: 390, impressions: 9200, ctr: 4.23, position: 14.8, change: "+4.1%" },
        ],
      },
      "28d": {
        summary: {
          totalClicks: 6840,
          totalImpressions: 154000,
          averageCtr: 4.44,
          averagePosition: 15.8,
          clicksChange: "+9.1%",
          impressionsChange: "+14.3%",
          ctrChange: "-0.2%",
          positionChange: "+0.6",
        },
        chartData: generateDailyData(28, 240, 5500, 4.36, 15.8),
        topPages: [
          { path: "/transponders/c-band-frequencies", clicks: 2210, impressions: 43200, ctr: 5.11, position: 9.4, change: "+12.1%" },
          { path: "/ground-stations/teleport-directory", clicks: 1750, impressions: 39400, ctr: 4.44, position: 12.8, change: "+8.3%" },
          { path: "/orbit/geo-slots-allocations", clicks: 1390, impressions: 33100, ctr: 4.19, position: 15.1, change: "+5.4%" },
        ],
      },
      "3m": {
        summary: {
          totalClicks: 19800,
          totalImpressions: 448000,
          averageCtr: 4.41,
          averagePosition: 16.2,
          clicksChange: "+18.4%",
          impressionsChange: "+22.9%",
          ctrChange: "-0.1%",
          positionChange: "+1.2",
        },
        chartData: generateDailyData(90, 220, 5000, 4.4, 16.2),
        topPages: [
          { path: "/transponders/c-band-frequencies", clicks: 6420, impressions: 126000, ctr: 5.09, position: 9.8, change: "+16.5%" },
          { path: "/ground-stations/teleport-directory", clicks: 5120, impressions: 114000, ctr: 4.49, position: 13.1, change: "+11.0%" },
          { path: "/orbit/geo-slots-allocations", clicks: 4010, impressions: 96000, ctr: 4.17, position: 15.6, change: "+8.9%" },
        ],
      },
    },
  },
  {
    id: "site-cup-cities",
    domain: "CupCities.com",
    name: "CupCities",
    syncStatus: "demo",
    lastSyncedAt: "Today at 06:15 AM",
    metrics: {
      "7d": {
        summary: {
          totalClicks: 2840,
          totalImpressions: 74200,
          averageCtr: 3.82,
          averagePosition: 18.4,
          clicksChange: "+28.4%",
          impressionsChange: "+34.1%",
          ctrChange: "-0.2%",
          positionChange: "+2.8",
        },
        chartData: generateDailyData(7, 400, 10600, 3.77, 18.4),
        topPages: [
          { path: "/new-york-new-jersey/metlife-stadium-transit", clicks: 920, impressions: 21400, ctr: 4.29, position: 12.1, change: "+35.2%" },
          { path: "/mexico-city/estadio-azteca-guide-2026", clicks: 760, impressions: 18900, ctr: 4.02, position: 14.5, change: "+29.4%" },
          { path: "/los-angeles/sofi-stadium-hotels", clicks: 580, impressions: 15600, ctr: 3.71, position: 16.8, change: "+22.1%" },
        ],
      },
      "28d": {
        summary: {
          totalClicks: 9450,
          totalImpressions: 258000,
          averageCtr: 3.66,
          averagePosition: 20.1,
          clicksChange: "+45.2%",
          impressionsChange: "+52.0%",
          ctrChange: "-0.2%",
          positionChange: "+4.1",
        },
        chartData: generateDailyData(28, 340, 9200, 3.69, 20.1),
        topPages: [
          { path: "/new-york-new-jersey/metlife-stadium-transit", clicks: 3120, impressions: 72000, ctr: 4.33, position: 13.0, change: "+48.0%" },
          { path: "/mexico-city/estadio-azteca-guide-2026", clicks: 2540, impressions: 64100, ctr: 3.96, position: 15.2, change: "+39.2%" },
          { path: "/los-angeles/sofi-stadium-hotels", clicks: 1950, impressions: 53200, ctr: 3.66, position: 17.9, change: "+31.5%" },
        ],
      },
      "3m": {
        summary: {
          totalClicks: 21500,
          totalImpressions: 610000,
          averageCtr: 3.52,
          averagePosition: 22.8,
          clicksChange: "+84.0%",
          impressionsChange: "+96.5%",
          ctrChange: "-0.3%",
          positionChange: "+6.5",
        },
        chartData: generateDailyData(90, 240, 6800, 3.52, 22.8),
        topPages: [
          { path: "/new-york-new-jersey/metlife-stadium-transit", clicks: 7100, impressions: 168000, ctr: 4.22, position: 14.2, change: "+92.0%" },
          { path: "/mexico-city/estadio-azteca-guide-2026", clicks: 5800, impressions: 149000, ctr: 3.89, position: 16.5, change: "+78.5%" },
          { path: "/los-angeles/sofi-stadium-hotels", clicks: 4400, impressions: 124000, ctr: 3.54, position: 19.4, change: "+65.0%" },
        ],
      },
    },
  },
];
