"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Select = React.forwardRef<
  HTMLDivElement,
  SelectProps
>(({ className, value, onValueChange, open, onOpenChange, ...props }, ref) => {
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
            onOpenChange: handleOpenChange,
            value,
            onValueChange
          });
        }
        return child;
      })}
    </div>
  );
});
Select.displayName = "Select";

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ className, children, open, onOpenChange, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    role="combobox"
    aria-expanded={open}
    className={cn("w-full justify-between", className)}
    onClick={() => onOpenChange?.(!open)}
    {...props}
  >
    {children}
    <ChevronDown className={cn("ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform", open && "rotate-180")} />
  </Button>
));
SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
  value?: string;
}

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  SelectValueProps
>(({ className, placeholder, value, ...props }, ref) => (
  <span ref={ref} className={cn("block truncate", className)} {...props}>
    {value || placeholder}
  </span>
));
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean;
  }
>(({ className, open, ...props }, ref) => {
  if (!open) return null;
  
  return (
    <div
      ref={ref}
      className={cn("absolute top-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)}
      {...props}
    />
  );
});
SelectContent.displayName = "SelectContent";

interface SelectItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  value?: string;
  onSelect?: (value: string) => void;
}

const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectItemProps
>(({ className, value, onSelect, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
    data-value={value}
    onClick={() => {
      onSelect?.(value || '');
      // Close the dropdown after selection
      const selectElement = ref as React.RefObject<HTMLDivElement>;
      if (selectElement?.current?.parentElement?.parentElement) {
        const select = selectElement.current.parentElement.parentElement;
        const trigger = select.querySelector('[role="combobox"]') as HTMLButtonElement;
        if (trigger) {
          trigger.click();
        }
      }
    }}
    {...props}
  />
));
SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};
