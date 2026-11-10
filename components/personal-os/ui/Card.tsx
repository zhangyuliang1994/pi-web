import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = "", hoverable = false, ...props }: CardProps) {
  const hoverStyles = hoverable
    ? "transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm"
    : "";

  return (
    <div
      className={`bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs text-zinc-900 dark:text-zinc-100 ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}
