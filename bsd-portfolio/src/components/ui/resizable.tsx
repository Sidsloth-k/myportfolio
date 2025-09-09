"use client";

import * as React from "react";

import { cn } from "./utils";

const Resizable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex", className)} {...props} />
));
Resizable.displayName = "Resizable";

const ResizablePanel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1", className)} {...props} />
));
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-1 bg-border hover:bg-accent transition-colors", className)}
    {...props}
  />
));
ResizableHandle.displayName = "ResizableHandle";

export { Resizable, ResizablePanel, ResizableHandle };
