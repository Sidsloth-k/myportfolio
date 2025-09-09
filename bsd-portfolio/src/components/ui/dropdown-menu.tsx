"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";

interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownMenu = React.forwardRef<
  HTMLDivElement,
  DropdownMenuProps
>(({ className, open, onOpenChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };
  
  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      {React.Children.map(props.children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            open: open ?? isOpen,
            onOpenChange: handleOpenChange
          });
        }
        return child;
      })}
    </div>
  );
});
DropdownMenu.displayName = "DropdownMenu";

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ className, children, open, onOpenChange, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    className={cn("flex items-center gap-2", className)}
    onClick={() => onOpenChange?.(!open)}
    {...props}
  >
    {children}
    <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
  </Button>
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean;
  }
>(({ className, open, ...props }, ref) => {
  if (!open) return null;
  
  return (
    <div
      ref={ref}
      className={cn("absolute top-full mt-1 bg-popover border rounded-md shadow-lg z-50 min-w-[8rem]", className)}
      {...props}
    />
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};
