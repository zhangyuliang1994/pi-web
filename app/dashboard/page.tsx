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

  const isWidgetEnabled = (id: string) => {
    const w = widgets.find((item) => item.id === id);
    return w ? w.enabled : true;
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const urgentTasks = pendingTasks.filter((t) => t.priority === 1);
  const activeProjects = projects.filter((p) => p.status === "active");

  return (
    <PersonalOsLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Welcome Header */}
        <WelcomeHeader
          pendingTasksCount={pendingTasks.length}
          activeProjectsCount={activeProjects.length}
          onCustomizeClick={() => setCustomizeOpen(true)}
        />

        {/* Quick Capture Bar */}
        {isWidgetEnabled("quick_capture") && (
          <QuickCapture onTaskCreated={loadData} />
        )}

        {/* AI Daily Briefing */}
        {isWidgetEnabled("briefing") && (
          <AiDailyBriefing initialData={briefing} />
        )}

        {/* Daily Overview Stats */}
        {isWidgetEnabled("overview") && (
          <DailyOverview
            eventsCount={INITIAL_SCHEDULE.length}
            pendingTasksCount={pendingTasks.length}
            urgentTasksCount={urgentTasks.length}
            activeProjectsCount={activeProjects.length}
          />
        )}

        {/* Main Grid: Left Column & Right Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Column (2 spans on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Priority Tasks */}
            {isWidgetEnabled("tasks") && (
              <DashboardTasks
                tasks={pendingTasks}
                onToggleComplete={handleToggleTask}
              />
            )}

            {/* Active Projects */}
            {isWidgetEnabled("projects") && (
              <ActiveProjects projects={projects} />
            )}

            {/* Website SEO Snapshot */}
            {isWidgetEnabled("websites") && INITIAL_WEBSITES[0] && (
              <WebsitePerformance site={INITIAL_WEBSITES[0]} />
            )}
          </div>

          {/* Side Column (1 span on desktop) */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            {isWidgetEnabled("schedule") && (
              <TodaySchedule initialEvents={INITIAL_SCHEDULE} />
            )}
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
