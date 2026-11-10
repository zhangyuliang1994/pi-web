"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TerminalIcon,
  HomeIcon,
  BotIcon,
  ProjectsIcon,
  TasksIcon,
  SeoIcon,
  CalendarIcon,
  SearchIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SunIcon,
  MoonIcon,
} from "../ui/icons";
import { Badge } from "../ui/Badge";
import { useTheme } from "@/hooks/useTheme";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  shortcut?: string;
  badge?: string;
  isAi?: boolean;
  disabled?: boolean;
}

const MAIN_NAV: NavItem[] = [
  { name: "Home", href: "/dashboard", icon: HomeIcon, shortcut: "⌘1" },
  { name: "AI Assistant", href: "/", icon: BotIcon, shortcut: "⌘2", isAi: true },
  { name: "Projects", href: "/projects", icon: ProjectsIcon, shortcut: "⌘3", badge: "6" },
  { name: "Tasks", href: "/tasks", icon: TasksIcon, shortcut: "⌘4" },
];

const GROWTH_NAV: NavItem[] = [
  { name: "Websites & SEO", href: "/websites", icon: SeoIcon, badge: "SEO" },
];

const OTHER_NAV: NavItem[] = [
  { name: "Calendar", href: "#calendar", icon: CalendarIcon, disabled: true, badge: "v1.1" },
  { name: "Content", href: "#content", icon: CalendarIcon, disabled: true, badge: "v1.1" },
  { name: "Finance", href: "#finance", icon: CalendarIcon, disabled: true, badge: "v1.1" },
  { name: "Knowledge", href: "#knowledge", icon: CalendarIcon, disabled: true, badge: "v1.1" },
];

export interface DesktopSidebarProps {
  onOpenCommandPalette?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function DesktopSidebar({
  onOpenCommandPalette,
  collapsed = false,
  onToggleCollapse,
}: DesktopSidebarProps) {
  const pathname = usePathname();
  const { theme, isDark, setThemePreference } = useTheme();

  const toggleTheme = () => {
    setThemePreference(isDark ? "light" : "dark");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`hidden md:flex flex-col justify-between flex-shrink-0 bg-white dark:bg-[#18181B] border-r border-zinc-200 dark:border-zinc-800 transition-all duration-200 select-none z-30 ${
        collapsed ? "w-[64px] p-2.5 items-center" : "w-60 p-4"
      }`}
    >
      <div className="space-y-5 w-full">
        {/* Brand Header */}
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between px-1"}`}>
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group overflow-hidden"
            title="Personal OS Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4338CA] dark:bg-[#6366F1] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
              <TerminalIcon size={18} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100 block leading-tight truncate">
                  Personal OS
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium block truncate">
                  One digital workspace
                </span>
              </div>
            )}
          </Link>

          {onToggleCollapse && !collapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftCloseIcon size={16} />
            </button>
          )}
        </div>

        {/* Command palette search shortcut (if expanded) */}
        {!collapsed && onOpenCommandPalette && (
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-xs text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <SearchIcon size={14} />
              <span>Search or command...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Navigation Sections */}
        <nav className="space-y-4 w-full">
          {/* Main Section */}
          <div>
            {!collapsed && (
              <div className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Main
              </div>
            )}
            <ul className="space-y-1">
              {MAIN_NAV.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center ${
                        collapsed ? "justify-center p-2 rounded-lg" : "justify-between px-2.5 py-1.5 rounded-lg text-xs"
                      } font-medium transition-colors ${
                        active
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                      }`}
                      title={collapsed ? `${item.name} ${item.shortcut || ""}` : undefined}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={18} />
                        {!collapsed && <span>{item.name}</span>}
                      </div>
                      {!collapsed && (
                        <div className="flex items-center gap-1.5">
                          {item.isAi && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Pi Agent Connected" />
                          )}
                          {item.badge && <Badge size="sm">{item.badge}</Badge>}
                          {item.shortcut && (
                            <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500">
                              {item.shortcut}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Growth Section */}
          <div>
            {!collapsed && (
              <div className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Growth
              </div>
            )}
            <ul className="space-y-1">
              {GROWTH_NAV.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center ${
                        collapsed ? "justify-center p-2 rounded-lg" : "justify-between px-2.5 py-1.5 rounded-lg text-xs"
                      } font-medium transition-colors ${
                        active
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                      }`}
                      title={collapsed ? item.name : undefined}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={18} />
                        {!collapsed && <span>{item.name}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <Badge size="sm" variant="success">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Other / Coming Soon Section */}
          {!collapsed && (
            <div>
              <div className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Other
              </div>
              <ul className="space-y-1">
                {OTHER_NAV.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <div
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                        title={`${item.name} is scheduled for v1.1`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon size={18} />
                          <span>{item.name}</span>
                        </div>
                        <Badge size="sm" variant="muted">
                          {item.badge}
                        </Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 w-full">
        {collapsed && onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Expand sidebar"
          >
            <PanelLeftOpenIcon size={18} />
          </button>
        )}

        {/* Theme switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex items-center ${
            collapsed ? "justify-center p-2" : "justify-between px-2.5 py-1.5"
          } w-full rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          <div className="flex items-center gap-2.5">
            {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            {!collapsed && <span>{theme === "dark" ? "Light theme" : "Dark theme"}</span>}
          </div>
          {!collapsed && (
            <span className="text-[10px] text-zinc-400 uppercase font-mono">{theme}</span>
          )}
        </button>

        {/* User Profile */}
        <div
          className={`flex items-center ${
            collapsed ? "justify-center pt-1" : "justify-between px-2 py-1.5"
          } rounded-lg`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
              AL
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 block truncate">
                  Alex Lin
                </span>
                <span className="text-[10px] text-zinc-400 block truncate">Personal OS Demo</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
          )}
        </div>
      </div>
    </aside>
  );
}
