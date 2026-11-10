"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import type { DashboardWidgetConfig } from "@/lib/personal-os/models/dashboard";

export interface CustomizeDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: DashboardWidgetConfig[];
  onSave: (widgets: DashboardWidgetConfig[]) => void;
  onReset: () => void;
}

export function CustomizeDashboardModal({
  isOpen,
  onClose,
  widgets: initialWidgets,
  onSave,
  onReset,
}: CustomizeDashboardModalProps) {
  const [widgets, setWidgets] = useState<DashboardWidgetConfig[]>(initialWidgets);

  const toggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    setWidgets((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const moveDown = (index: number) => {
    if (index >= widgets.length - 1) return;
    setWidgets((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  const handleSave = () => {
    onSave(widgets);
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Dashboard"
      description="Enable, disable and reorder widgets to tailor your daily workspace."
      maxWidth="md"
    >
      <div className="space-y-4">
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          {widgets.map((widget, index) => (
            <li
              key={widget.id}
              className="p-3 bg-white dark:bg-[#18181B] flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`widget-${widget.id}`}
                  checked={widget.enabled}
                  onChange={() => toggleWidget(widget.id)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
                />
                <label
                  htmlFor={`widget-${widget.id}`}
                  className="font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer select-none"
                >
                  {widget.label}
                </label>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveUp(index)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={index === widgets.length - 1}
                  onClick={() => moveDown(index)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  ▼
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:underline"
          >
            Reset to defaults
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] text-white text-xs font-medium hover:opacity-95 shadow-2xs"
            >
              Save Layout
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
