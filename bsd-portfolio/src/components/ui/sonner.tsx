"use client";

import * as React from "react";

const Sonner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
Sonner.displayName = "Sonner";

export { Sonner };
