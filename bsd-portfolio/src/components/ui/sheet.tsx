"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";

const Sheet = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative", className)} {...props} />
));
Sheet.displayName = "Sheet";

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button ref={ref} className={className} {...props} />
));
SheetTrigger.displayName = "SheetTrigger";

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("fixed inset-y-0 right-0 z-50 h-full w-3/4 border-l bg-background p-6 shadow-lg", className)}
    {...props}
  >
    {children}
  </div>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
));
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = "SheetDescription";

const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="icon"
    className={cn("absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", className)}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </Button>
));
SheetClose.displayName = "SheetClose";

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
};
