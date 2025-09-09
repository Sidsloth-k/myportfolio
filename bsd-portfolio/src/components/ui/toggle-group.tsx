"use client";

import * as React from "react";

import { cn } from "./utils";
import { Button } from "./button";

const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex w-fit items-center rounded-md", className)} {...props} />
));
ToggleGroup.displayName = "ToggleGroup";

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="sm"
    className={cn("rounded-none first:rounded-l-md last:rounded-r-md", className)}
    {...props}
  />
));
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
