"use client";

import * as React from "react";

import { cn } from "./utils";
import { Button } from "./button";

const Pagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("mx-auto flex w-full justify-center", className)} {...props} />
));
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    size="icon"
    className={cn("h-8 w-8", className)}
    {...props}
  />
));
PaginationLink.displayName = "PaginationLink";

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
};
