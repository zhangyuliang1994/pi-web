"use client";

import React, { useState, useEffect } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { CommandPalette } from "./CommandPalette";

export interface PersonalOsLayoutProps {
  children: React.ReactNode;
}

export function PersonalOsLayout({ children }: PersonalOsLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Desktop Sidebar (Left Rail) */}
      <DesktopSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header (hidden on md+) */}
        <MobileHeader onOpenSearch={() => setCommandPaletteOpen(true)} />

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Navigation (hidden on md+) */}
        <MobileBottomNav />
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
}
