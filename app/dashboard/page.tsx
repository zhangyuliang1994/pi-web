"use client";

import React, { useState, useEffect } from "react";
import { PersonalOsLayout } from "@/components/personal-os/layout/PersonalOsLayout";
import { WelcomeHeader } from "@/components/personal-os/dashboard/WelcomeHeader";
import { DailyOverview } from "@/components/personal-os/dashboard/DailyOverview";
import { AiDailyBriefing } from "@/components/personal-os/dashboard/AiDailyBriefing";
import { TodaySchedule } from "@/components/personal-os/dashboard/TodaySchedule";
import { DashboardTasks } from "@/components/personal-os/dashboard/DashboardTasks";
import { ActiveProjects } from "@/components/personal-os/dashboard/ActiveProjects";
import { WebsitePerformance } from "@/components/personal-os/dashboard/WebsitePerformance";
import { QuickCapture } from "@/components/personal-os/dashboard/QuickCapture";
import { CustomizeDashboardModal } from "@/components/personal-os/dashboard/CustomizeDashboardModal";

import {
  getStoredTasks,
  getStoredProjects,
  getStoredWidgets,
  saveStoredWidgets,
  resetStoredWidgets,
  getStoredBriefing,
  toggleStoredTaskComplete,
  subscribeToPersonalOsStorage,
} from "@/lib/personal-os/storage/storage";
import { INITIAL_SCHEDULE } from "@/lib/personal-os/mock-data/dashboard";
import { INITIAL_WEBSITES } from "@/lib/personal-os/mock-data/websites";
import type { PersonalTask } from "@/lib/personal-os/models/task";
import type { PersonalProject } from "@/lib/personal-os/models/project";
import type { DashboardWidgetConfig } from "@/lib/personal-os/models/dashboard";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<PersonalTask[]>([]);
  const [projects, setProjects] = useState<PersonalProject[]>([]);
  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>([]);
  const [briefing, setBriefing] = useState(getStoredBriefing());
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const loadData = () => {
    setTasks(getStoredTasks());
    setProjects(getStoredProjects());
    setWidgets(getStoredWidgets());
    setBriefing(getStoredBriefing());
  };

  useEffect(() => {
    setMounted(true);
    loadData();
    const unsubscribe = subscribeToPersonalOsStorage(loadData);
    return () => unsubscribe();
  }, []);

  const handleToggleTask = (id: string) => {
    toggleStoredTaskComplete(id);
    setTasks(getStoredTasks());
  };

  const handleSaveWidgets = (newWidgets: DashboardWidgetConfig[]) => {
    saveStoredWidgets(newWidgets);
    setWidgets(newWidgets);
  };

  const handleResetWidgets = () => {
    const res = resetStoredWidgets();
    setWidgets(res);
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const urgentTasks = pendingTasks.filter((t) => t.priority === 1);
  const activeProjects = projects.filter((p) => p.status === "active");

  const renderWidget = (id: string) => {
    switch (id) {
      case "quick_capture":
        return <QuickCapture key="quick_capture" onTaskCreated={loadData} />;
      case "briefing":
        return <AiDailyBriefing key="briefing" initialData={briefing} />;
      case "overview":
        return (
          <DailyOverview
            key="overview"
            eventsCount={INITIAL_SCHEDULE.length}
            pendingTasksCount={pendingTasks.length}
            urgentTasksCount={urgentTasks.length}
            activeProjectsCount={activeProjects.length}
          />
        );
      case "tasks":
        return (
          <DashboardTasks
            key="tasks"
            tasks={pendingTasks}
            onToggleComplete={handleToggleTask}
          />
        );
      case "projects":
        return <ActiveProjects key="projects" projects={projects} />;
      case "websites":
        return INITIAL_WEBSITES[0] ? (
          <WebsitePerformance key="websites" site={INITIAL_WEBSITES[0]} />
        ) : null;
      case "schedule":
        return <TodaySchedule key="schedule" initialEvents={INITIAL_SCHEDULE} />;
      default:
        return null;
    }
  };

  // Group widgets into Top (Full width) and Main Grid according to Stitch design
  const topWidgetIds = ["quick_capture", "briefing", "overview"];
  const mainColumnIds = ["tasks", "projects", "websites"];
  const sideColumnIds = ["schedule"];

  const enabledTopWidgets = widgets
    .filter((w) => w.enabled && topWidgetIds.includes(w.id))
    .sort((a, b) => a.order - b.order);

  const enabledMainWidgets = widgets
    .filter((w) => w.enabled && mainColumnIds.includes(w.id))
    .sort((a, b) => a.order - b.order);

  const enabledSideWidgets = widgets
    .filter((w) => w.enabled && sideColumnIds.includes(w.id))
    .sort((a, b) => a.order - b.order);

  return (
    <PersonalOsLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Welcome Header */}
        <WelcomeHeader
          pendingTasksCount={pendingTasks.length}
          activeProjectsCount={activeProjects.length}
          onCustomizeClick={() => setCustomizeOpen(true)}
        />

        {/* Dynamic Top Widgets (Rendered strictly in user's sorted order) */}
        {enabledTopWidgets.map((w) => renderWidget(w.id))}

        {/* Main Grid: Left Column & Right Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Column (2 spans on desktop, rendered in user's sorted order) */}
          <div className="lg:col-span-2 space-y-6">
            {enabledMainWidgets.map((w) => renderWidget(w.id))}
          </div>

          {/* Side Column (1 span on desktop) */}
          <div className="space-y-6">
            {enabledSideWidgets.map((w) => renderWidget(w.id))}
          </div>
        </div>
      </div>

      {/* Customize Dashboard Modal */}
      {mounted && (
        <CustomizeDashboardModal
          isOpen={customizeOpen}
          onClose={() => setCustomizeOpen(false)}
          widgets={widgets}
          onSave={handleSaveWidgets}
          onReset={handleResetWidgets}
        />
      )}
    </PersonalOsLayout>
  );
}
