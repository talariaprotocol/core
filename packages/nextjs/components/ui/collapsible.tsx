"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

// Utility function for conditional class names
const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function Collapsible({ title, children, defaultExpanded = false }: CollapsibleProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <div className="border rounded-md">
      <button
        className="flex justify-between items-center w-full p-4 text-left bg-gray-100 hover:bg-gray-200 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium">{title}</span>
        <ChevronDown
          className={cn("h-5 w-5 transition-transform duration-200", isExpanded ? "transform rotate-180" : "")}
        />
      </button>
      <div
        className={cn(
          "transition-all duration-200 ease-in-out overflow-scroll",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
