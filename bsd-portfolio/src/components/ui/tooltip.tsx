"use client";

import * as React from "react";

const Tooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
));
Tooltip.displayName = "Tooltip";

export { Tooltip };
