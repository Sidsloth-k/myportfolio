"use client";

import * as React from "react";

import { cn } from "./utils";

const NavigationMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative flex max-w-max flex-1 items-center justify-center", className)} {...props} />
));
NavigationMenu.displayName = "NavigationMenu";

const NavigationMenuList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)} {...props} />
));
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
NavigationMenuItem.displayName = "NavigationMenuItem";

const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50", className)}
    {...props}
  >
    {children}
  </button>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("absolute top-full left-0 w-full bg-popover text-popover-foreground shadow-lg", className)}
    {...props}
  />
));
NavigationMenuContent.displayName = "NavigationMenuContent";

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
};
