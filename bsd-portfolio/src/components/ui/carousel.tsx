"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "./utils";
import { Button } from "./button";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </div>
  )
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex", className)}
      {...props}
    />
  )
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("min-w-0 flex-shrink-0", className)}
      {...props}
    />
  )
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn("h-8 w-8", className)}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
);
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn("h-8 w-8", className)}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
);
CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
