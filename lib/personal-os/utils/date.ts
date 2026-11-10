/**
 * Dynamic greeting based on current local hour.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

/**
 * Format date for headers (e.g. "Sunday, Nov 10")
 */
export function formatHeaderDate(date: Date = new Date()): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

/**
 * Today's date string YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Relative date description (Today, Tomorrow, Yesterday, or MMM D)
 */
export function formatRelativeDueDate(dateString?: string): string {
  if (!dateString) return "No due date";
  const today = getTodayDateString();
  if (dateString === today) return "Today";

  const d = new Date(dateString + "T00:00:00");
  const t = new Date(today + "T00:00:00");
  const diffDays = Math.round((d.getTime() - t.getTime()) / (1000 * 3600 * 24));

  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 1 && diffDays <= 7) return `in ${diffDays} days`;

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
