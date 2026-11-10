"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { CalendarIcon, ClockIcon } from "../ui/icons";
import { Badge } from "../ui/Badge";
import type { ScheduleEvent } from "@/lib/personal-os/models/dashboard";

export interface TodayScheduleProps {
  initialEvents: ScheduleEvent[];
}

export function TodaySchedule({ initialEvents }: TodayScheduleProps) {
  const [events, setEvents] = useState<ScheduleEvent[]>(initialEvents);

  const toggleEventComplete = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const getCategoryBadgeVariant = (cat: ScheduleEvent["category"]) => {
    switch (cat) {
      case "work":
        return "primary";
      case "focus":
        return "warning";
      case "meeting":
        return "success";
      default:
        return "muted";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-zinc-500 dark:text-zinc-400" />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Today&apos;s Schedule
          </h2>
        </div>
        <span className="text-xs text-zinc-400 font-mono">
          {events.filter((e) => e.completed).length}/{events.length} done
        </span>
      </CardHeader>
      <CardBody className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
              event.completed
                ? "bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/50 opacity-60"
                : "bg-white dark:bg-[#18181B] border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <input
              type="checkbox"
              checked={event.completed || false}
              onChange={() => toggleEventComplete(event.id)}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-semibold truncate ${
                    event.completed
                      ? "line-through text-zinc-400 dark:text-zinc-500"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {event.title}
                </span>
                <Badge variant={getCategoryBadgeVariant(event.category)} size="sm">
                  {event.category}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                <span className="flex items-center gap-1">
                  <ClockIcon size={12} />
                  {event.time} ({event.duration})
                </span>
                {event.location && (
                  <>
                    <span>•</span>
                    <span className="truncate">{event.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
